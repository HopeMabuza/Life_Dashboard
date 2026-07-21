import { useQuery } from '@tanstack/react-query'
import { getTasks, getHabits, getGoals } from '../lib/api'
import Card from '../components/ui/Card'
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PolarRadiusAxis
} from 'recharts'

const AREAS = ['Health', 'Work', 'Growth', 'Finance', 'Relationships']

export default function ProgressView() {
  const { data: tasks  = [] } = useQuery({ queryKey: ['tasks'],  queryFn: () => getTasks().then(r => r.data) })
  const { data: habits = [] } = useQuery({ queryKey: ['habits'], queryFn: () => getHabits().then(r => r.data) })
  const { data: goals  = [] } = useQuery({ queryKey: ['goals'],  queryFn: () => getGoals().then(r => r.data) })

  const completionByArea = AREAS.map(area => ({
    area,
    tasks:  tasks.filter(t => t.area === area && t.completed).length,
    goals:  Math.round(
      goals.filter(g => g.area === area).reduce((s, g) => s + (g.progress ?? 0), 0) /
      (goals.filter(g => g.area === area).length || 1)
    ),
  }))

  const radarData = AREAS.map(area => ({
    area,
    score: Math.round(
      (
        (tasks.filter(t => t.area === area && t.completed).length / (tasks.filter(t => t.area === area).length || 1)) * 50 +
        (goals.filter(g => g.area === area).reduce((s, g) => s + (g.progress ?? 0), 0) / (goals.filter(g => g.area === area).length || 1)) * 0.5
      )
    ),
  }))

  const totalTasks    = tasks.length
  const doneTasks     = tasks.filter(t => t.completed).length
  const totalHabits   = habits.length
  const avgStreak     = totalHabits ? Math.round(habits.reduce((s, h) => s + h.streak, 0) / totalHabits) : 0
  const avgGoalProg   = goals.length ? Math.round(goals.reduce((s, g) => s + (g.progress ?? 0), 0) / goals.length) : 0

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Progress Overview</h2>
        <p className="text-gray-500 text-sm mt-1">How you're doing across all areas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tasks Done',    value: `${doneTasks}/${totalTasks}` },
          { label: 'Habits Tracked', value: totalHabits },
          { label: 'Avg Streak',    value: `${avgStreak}d` },
          { label: 'Goal Progress', value: `${avgGoalProg}%` },
        ].map(stat => (
          <Card key={stat.label} className="text-center">
            <p className="text-3xl font-bold text-brand-500">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar chart - tasks & goals by area */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Tasks & Goals by Area</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={completionByArea}>
              <XAxis dataKey="area" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }} />
              <Bar dataKey="tasks" fill="#4f6ef7" radius={[4,4,0,0]} name="Tasks done" />
              <Bar dataKey="goals" fill="#7c3aed" radius={[4,4,0,0]} name="Goal %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar chart - life balance */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Life Balance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="area" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar name="Score" dataKey="score" stroke="#4f6ef7" fill="#4f6ef7" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Habit streaks */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Habit Streaks</h3>
        {habits.length === 0
          ? <p className="text-gray-600 text-sm">No habits tracked yet</p>
          : (
            <div className="space-y-3">
              {habits.sort((a, b) => b.streak - a.streak).map(h => (
                <div key={h.id} className="flex items-center gap-4">
                  <span className="text-sm text-gray-300 w-40 truncate">{h.name}</span>
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-brand-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (h.streak / 30) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-12 text-right">{h.streak}d 🔥</span>
                </div>
              ))}
            </div>
          )
        }
      </Card>
    </div>
  )
}
