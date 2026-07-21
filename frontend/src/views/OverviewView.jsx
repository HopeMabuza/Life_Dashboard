import { useQuery } from '@tanstack/react-query'
import { getTasks } from '../lib/api'

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function OverviewView() {
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks().then(r => r.data),
  })

  const total     = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const pct       = total ? Math.round((completed / total) * 100) : 0

  const weekGlance = WEEK_DAYS.map(day => {
    const dayTasks = tasks.filter(t => t.day === day)
    const done     = dayTasks.filter(t => t.completed).length
    return { day, done, total: dayTasks.length, pct: dayTasks.length ? Math.round((done / dayTasks.length) * 100) : 0 }
  })

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="font-display text-[26px] font-extrabold text-ink">Overview</h2>
        <p className="text-muted text-sm mt-1">A quiet look at the week, not a scoreboard.</p>
      </div>

      {total === 0 ? (
        <div className="text-center py-20 bg-surface border border-line rounded-card">
          <div className="w-16 h-16 mx-auto mb-5 rounded-[60%_40%_35%_65%/55%_60%_40%_45%] bg-blue-200 animate-floatBlob" />
          <p className="font-display text-lg font-extrabold text-ink mb-2">Nothing tracked yet</p>
          <p className="text-faint text-sm">Add a few tasks and your week will take shape here.</p>
        </div>
      ) : (
        <>
          {/* Overall progress */}
          <div className="bg-surface border border-line rounded-card p-6">
            <div className="flex justify-between items-baseline mb-3">
              <h3 className="text-xs font-extrabold text-muted uppercase tracking-widest">This week's progress</h3>
              <span className="font-display text-base font-extrabold text-ink">
                {completed} of {total} tasks completed
              </span>
            </div>
            <div className="w-full h-3 bg-cream rounded-2xl overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-2xl transition-all duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Week at a glance */}
          <div className="bg-surface border border-line rounded-card p-6">
            <h3 className="text-xs font-extrabold text-muted uppercase tracking-widest mb-5">This week at a glance</h3>
            <div className="flex flex-col gap-2.5">
              {weekGlance.map(({ day, done, total: t, pct: p }) => (
                <div key={day} className="flex items-center gap-4 px-4 py-3 bg-cream rounded-[14px]">
                  <span className="w-10 flex-shrink-0 font-display text-sm font-extrabold text-ink">{day}</span>
                  <div className="flex-1 h-2 bg-line rounded-2xl overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-2xl transition-all duration-500 ease-out"
                      style={{ width: `${p}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-muted flex-shrink-0 w-16 text-right">
                    {done}/{t} done
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
