import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useWeb3Modal } from '@web3modal/wagmi/react'

const NAV = [
  { to: '/',         label: 'Tasks',    dot: 'bg-green-400' },
  { to: '/reflect',  label: 'Reflect',  dot: 'bg-orange-400' },
  { to: '/overview', label: 'Overview', dot: 'bg-blue-400' },
]

export default function Sidebar() {
  const { address, signOut } = useAuth()
  const { open } = useWeb3Modal()

  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''

  return (
    <aside className="w-56 flex-shrink-0 bg-surface border-r border-line flex flex-col sticky top-0 h-screen">
      {/* Branding */}
      <div className="flex items-center gap-2.5 px-5 py-7">
        <div className="w-8 h-8 rounded-[10px] bg-ink flex items-center justify-center flex-shrink-0">
          <div className="w-3 h-3 rounded-sm bg-green-400" />
        </div>
        <span className="font-display font-extrabold text-lg text-ink">Tracker</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3">
        {NAV.map(({ to, label, dot }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-3 rounded-[14px] text-sm font-bold transition-colors ${
                isActive
                  ? 'bg-cream text-ink'
                  : 'text-muted hover:bg-cream/60 hover:text-ink'
              }`
            }
          >
            <span className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${dot}`} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Wallet */}
      <div className="mt-auto flex flex-col gap-2.5 p-4">
        <button
          onClick={() => open()}
          className="flex items-center gap-2.5 px-3 py-2.5 bg-cream rounded-[14px] w-full text-left"
        >
          <div className="w-7 h-7 rounded-full bg-blue-300 flex-shrink-0" />
          <span className="text-xs font-bold text-ink truncate font-mono">{short || 'Connect'}</span>
        </button>
        {address && (
          <button
            onClick={signOut}
            className="px-3 py-2 border border-line rounded-[14px] text-xs font-bold text-faint hover:text-ink hover:border-ink/20 transition-colors"
          >
            Disconnect
          </button>
        )}
      </div>
    </aside>
  )
}
