import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTasks, createTask, updateTask, deleteTask } from '../lib/api'
import Badge from '../components/ui/Badge'
import { clsx } from 'clsx'

const DAYS     = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Anytime']
const TASK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Anytime']
const DEFAULT_FORM = { title: '', description: '', day: 'Anytime', priority: 'medium' }

export default function TasksHomeView() {
  const qc = useQueryClient()
  const [dayFilter, setDayFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm]           = useState(DEFAULT_FORM)

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks().then(r => r.data),
  })

  const addTask = useMutation({
    mutationFn: createTask,
    onSuccess: () => { qc.invalidateQueries(['tasks']); setModalOpen(false); setForm(DEFAULT_FORM) },
  })

  const toggleTask = useMutation({
    mutationFn: ({ id, completed }) => updateTask(id, { completed }),
    onMutate: async ({ id, completed }) => {
      await qc.cancelQueries(['tasks'])
      const prev = qc.getQueryData(['tasks'])
      qc.setQueryData(['tasks'], old => old.map(t => t.id === id ? { ...t, completed } : t))
      return { prev }
    },
    onError: (_, __, ctx) => qc.setQueryData(['tasks'], ctx.prev),
    onSettled: () => qc.invalidateQueries(['tasks']),
  })

  const removeTask = useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      await qc.cancelQueries(['tasks'])
      const prev = qc.getQueryData(['tasks'])
      qc.setQueryData(['tasks'], old => old.filter(t => t.id !== id))
      return { prev }
    },
    onError: (_, __, ctx) => qc.setQueryData(['tasks'], ctx.prev),
    onSettled: () => qc.invalidateQueries(['tasks']),
  })

  function handleAdd(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    addTask.mutate(form)
  }

  const filtered = dayFilter === 'All' ? tasks : tasks.filter(t => t.day === dayFilter)

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="font-display text-[26px] font-extrabold text-ink">Your tasks</h2>
        <p className="text-muted text-sm mt-1">Filter by day, or see everything at once.</p>
      </div>

      {/* Day filter strip */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map(d => (
          <button
            key={d}
            onClick={() => setDayFilter(d)}
            className={clsx(
              'px-4 py-2 rounded-2xl text-sm font-extrabold flex-shrink-0 transition-colors',
              dayFilter === d
                ? 'bg-ink text-surface'
                : 'bg-surface border border-line text-muted hover:text-ink hover:border-ink/20'
            )}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Add task button */}
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-ink text-surface font-extrabold text-sm hover:bg-ink/90 transition-colors"
      >
        <span className="text-lg leading-none">+</span> Add task
      </button>

      {/* Task list */}
      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-16 h-16 mx-auto mb-5 rounded-[42%_58%_65%_35%/45%_40%_60%_55%] bg-green-200 animate-floatBlob" />
            <p className="font-display text-lg font-extrabold text-ink mb-1.5">
              {dayFilter === 'All' ? 'No tasks yet' : `Nothing planned for ${dayFilter}`}
            </p>
            <p className="text-faint text-sm mb-5">
              {dayFilter === 'All' ? 'Add your first task to get the week moving.' : 'Add one, or pick another day.'}
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-ink text-surface font-extrabold text-sm hover:bg-ink/90 transition-colors"
            >
              + Add your first task
            </button>
          </div>
        ) : (
          filtered.map(task => (
            <div
              key={task.id}
              className={clsx(
                'flex items-start gap-3.5 px-4 py-3.5 bg-[#F9F6EE] border border-line rounded-[16px] shadow-sm transition-opacity',
                task.completed && 'opacity-60'
              )}
            >
              {/* Circular checkbox */}
              <button
                onClick={() => toggleTask.mutate({ id: task.id, completed: !task.completed })}
                className={clsx(
                  'w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all',
                  task.completed ? 'bg-ink border-ink scale-105' : 'border-ink/30 hover:border-ink'
                )}
              >
                {task.completed && <div className="w-2 h-2 rounded-sm bg-surface" />}
              </button>

              {/* Text + badges */}
              <div className="flex-1 min-w-0">
                <p className={clsx(
                  'text-sm font-semibold',
                  task.completed ? 'line-through text-faint' : 'text-ink'
                )}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-faint mt-1">{task.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge label={task.priority} variant="priority" />
                  <span className="text-xs font-bold text-muted bg-cream px-3 py-1 rounded-2xl whitespace-nowrap">
                    {task.day}
                  </span>
                </div>
              </div>

              <button
                onClick={() => removeTask.mutate(task.id)}
                className="text-line hover:text-red-400 text-xl leading-none flex-shrink-0 transition-colors"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-ink/25 backdrop-blur-sm flex items-center justify-center z-50 p-5"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-[560px] bg-surface/95 backdrop-blur border border-white/60 rounded-[24px] p-5 md:p-10 shadow-[0_30px_60px_-20px_rgba(27,33,64,0.35)]"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-display text-xl font-extrabold text-ink mb-5">New task</h3>
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <input
                autoFocus
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Task"
                className="w-full px-5 py-4 rounded-2xl border border-line bg-surface text-ink text-sm placeholder-faint focus:outline-none focus:border-ink/30"
              />
              <textarea
                rows={4}
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Description (optional)"
                className="w-full px-5 py-4 rounded-2xl border border-line bg-surface text-ink text-sm placeholder-faint focus:outline-none focus:border-ink/30 resize-none leading-relaxed"
              />
              <div className="flex gap-2.5">
                <select
                  value={form.day}
                  onChange={e => setForm(p => ({ ...p, day: e.target.value }))}
                  className="flex-1 px-3 py-3 rounded-2xl border border-line bg-surface text-ink text-sm font-bold focus:outline-none"
                >
                  {TASK_DAYS.map(d => <option key={d}>{d}</option>)}
                </select>
                <select
                  value={form.priority}
                  onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                  className="flex-1 px-3 py-3 rounded-2xl border border-line bg-surface text-ink text-sm font-bold focus:outline-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl border border-line text-muted font-bold text-sm hover:text-ink hover:border-ink/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addTask.isPending}
                  className="flex-1 py-3 rounded-2xl bg-[#1B2140] text-white font-extrabold text-sm hover:bg-[#272E52] transition-colors disabled:opacity-50"
                >
                  {addTask.isPending ? 'Adding…' : 'Add task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
