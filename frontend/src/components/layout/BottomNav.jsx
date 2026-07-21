import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/',         label: 'Tasks',    dot: 'bg-green-400' },
  { to: '/reflect',  label: 'Reflect',  dot: 'bg-red-400' },
  { to: '/overview', label: 'Overview', dot: 'bg-blue-400' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-surface border-t border-line px-2 py-3 md:hidden">
      {NAV.map(({ to, label, dot }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1.5 px-4 py-1 transition-colors ${
              isActive ? 'text-ink' : 'text-faint'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`w-2 h-2 rounded-sm ${dot} ${isActive ? 'opacity-100' : 'opacity-30'}`} />
              <span className="text-[10px] font-extrabold">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
