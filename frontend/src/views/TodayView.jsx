import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTasks, createTask, updateTask, deleteTask, getHabits, toggleHabit } from '../lib/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { format } from 'date-fns'

const AREAS = ['Health', 'Work', 'Growth', 'Finance', 'Relationships']
const PRIORITIES = ['low', 'medium', 'high']

export default function TodayView() {
  const qc = useQueryClient()
  const [newTask, setNewTask] = useState({ title: '', area: 'Work', priority: 'medium' })

  const { data: tasks = [] }  = useQuery({ queryKey: ['tasks'],  queryFn: () => getTasks().then(r => r.data) })
  const { data: habits = [] } = useQuery({ queryKey: ['habits'], queryFn: () => getHabits().then(r => r.data) })

  const addTask = useMutation({
    mutationFn: createTask,
    onSuccess: () => qc.invalidateQueries(['tasks']),
  })

  const toggleTask = useMutation({
    mutationFn: ({ id, completed }) => updateTask(id, { completed }),
    onSuccess: () => qc.invalidateQueries(['tasks']),
  })

  const removeTask = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => qc.invalidateQueries(['tasks']),
  })

  const toggleHabitMut = useMutation({
    mutationFn: toggleHabit,
    onSuccess: () => qc.invalidateQueries(['habits']),
  })

  function handleAddTask(e) {
    e.preventDefault()
    if (!newTask.title.trim()) return
    addTask.mutate(newTask)
    setNewTask({ title: '', area: 'Work', priority: 'medium' })
  }

  const todayTasks  = tasks.filter(t => !t.completed)
  const doneTasks   = tasks.filter(t => t.completed)
  const todayHabits = habits.filter(h => !h.completedToday)

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white">{format(new Date(), 'EEEE, MMMM d')}</h2>
        <p className="text-gray-500 text-sm mt-1">
          {doneTasks.length}/{tasks.length} tasks done · {habits.filter(h => h.completedToday).length}/{habits.length} habits logged
        </p>
      </div>

      {/* Add Task */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Add Task</h3>
        <form onSubmit={handleAddTask} className="flex flex-wrap gap-3">
          <input
            className="flex-1 min-w-48 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
            placeholder="What needs to get done?"
            value={newTask.title}
            onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
          />
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            value={newTask.area}
            onChange={e => setNewTask(p => ({ ...p, area: e.target.value }))}
          >
            {AREAS.map(a => <option key={a}>{a}</option>)}
          </select>
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            value={newTask.priority}
            onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}
          >
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
          <Button type="submit" disabled={addTask.isPending}>Add</Button>
        </form>
      </Card>

      {/* Active Tasks */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Tasks</h3>
        {todayTasks.length === 0
          ? <p className="text-gray-600 text-sm">No pending tasks 🎉</p>
          : (
            <ul className="space-y-2">
              {todayTasks.map(task => (
                <li key={task.id} className="flex items-center gap-3 group">
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => toggleTask.mutate({ id: task.id, completed: true })}
                    className="w-4 h-4 accent-brand-500 cursor-pointer"
                  />
                  <span className="flex-1 text-sm text-gray-200">{task.title}</span>
                  <Badge label={task.area} />
                  <span className={`text-xs ${task.priority === 'high' ? 'text-red-400' : task.priority === 'medium' ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={() => removeTask.mutate(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 text-xs transition-opacity"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )
        }
      </Card>

      {/* Habits */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Today's Habits</h3>
        {todayHabits.length === 0
          ? <p className="text-gray-600 text-sm">All habits logged for today 🔥</p>
          : (
            <div className="grid grid-cols-2 gap-3">
              {habits.map(habit => (
                <button
                  key={habit.id}
                  onClick={() => toggleHabitMut.mutate(habit.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                    habit.completedToday
                      ? 'border-brand-500 bg-brand-500/10 text-brand-300'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <span className="text-lg">{habit.completedToday ? '✅' : '⬜'}</span>
                  <div>
                    <p className="text-sm font-medium">{habit.name}</p>
                    <p className="text-xs text-gray-500">{habit.streak} day streak</p>
                  </div>
                </button>
              ))}
            </div>
          )
        }
      </Card>

      {/* Completed */}
      {doneTasks.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Completed</h3>
          <ul className="space-y-2">
            {doneTasks.map(task => (
              <li key={task.id} className="flex items-center gap-3 opacity-50">
                <span className="text-green-500 text-sm">✓</span>
                <span className="text-sm text-gray-400 line-through">{task.title}</span>
                <Badge label={task.area} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
