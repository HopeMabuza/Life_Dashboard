import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../lib/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const AREAS = ['Health', 'Work', 'Growth', 'Finance', 'Relationships']

export default function MonthlyView() {
  const qc = useQueryClient()
  const [form, setForm] = useState({ title: '', area: 'Work', target: '' })

  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: () => getGoals().then(r => r.data),
  })

  const add = useMutation({
    mutationFn: createGoal,
    onSuccess: () => { qc.invalidateQueries(['goals']); setForm({ title: '', area: 'Work', target: '' }) },
  })

  const updateProgress = useMutation({
    mutationFn: ({ id, progress }) => updateGoal(id, { progress }),
    onSuccess: () => qc.invalidateQueries(['goals']),
  })

  const remove = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => qc.invalidateQueries(['goals']),
  })

  function handleAdd(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    add.mutate(form)
  }

  const grouped = AREAS.reduce((acc, area) => {
    acc[area] = goals.filter(g => g.area === area)
    return acc
  }, {})

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Monthly Goals</h2>
        <p className="text-gray-500 text-sm mt-1">Set and track your goals for this month</p>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Add Goal</h3>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-3">
          <input
            className="flex-1 min-w-48 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
            placeholder="Goal description"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          />
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            value={form.area}
            onChange={e => setForm(p => ({ ...p, area: e.target.value }))}
          >
            {AREAS.map(a => <option key={a}>{a}</option>)}
          </select>
          <Button type="submit" disabled={add.isPending}>Add Goal</Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AREAS.map(area => (
          <Card key={area}>
            <div className="flex items-center gap-2 mb-4">
              <Badge label={area} />
              <span className="text-xs text-gray-500">{grouped[area].length} goals</span>
            </div>
            {grouped[area].length === 0
              ? <p className="text-gray-600 text-sm">No goals yet</p>
              : (
                <ul className="space-y-4">
                  {grouped[area].map(goal => (
                    <li key={goal.id} className="group">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm text-gray-200 flex-1">{goal.title}</span>
                        <button
                          onClick={() => remove.mutate(goal.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 text-xs ml-2 transition-opacity"
                        >✕</button>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={goal.progress ?? 0}
                          onChange={e => updateProgress.mutate({ id: goal.id, progress: Number(e.target.value) })}
                          className="flex-1 accent-brand-500"
                        />
                        <span className="text-xs text-gray-400 w-8 text-right">{goal.progress ?? 0}%</span>
                      </div>
                      <div className="h-1 bg-gray-700 rounded mt-1">
                        <div
                          className="h-1 bg-brand-500 rounded transition-all"
                          style={{ width: `${goal.progress ?? 0}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )
            }
          </Card>
        ))}
      </div>
    </div>
  )
}
