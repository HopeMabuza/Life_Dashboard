import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useWeb3Modal } from '@web3modal/wagmi/react'

const NAV = [
  { to: '/',          label: 'Today',    icon: '☀️' },
  { to: '/weekly',    label: 'Weekly',   icon: '📅' },
  { to: '/monthly',   label: 'Monthly',  icon: '🗓️' },
  { to: '/progress',  label: 'Progress', icon: '📈' },
]

export default function Sidebar() {
  const { address, signOut } = useAuth()
  const { open } = useWeb3Modal()

  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-brand-500">Life Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">Your personal tracker</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => open()}
          className="w-full text-left px-4 py-2 rounded-lg bg-gray-800 text-xs text-gray-300 hover:bg-gray-700 transition-colors font-mono truncate"
        >
          {short || 'Connect Wallet'}
        </button>
        {address && (
          <button
            onClick={signOut}
            className="w-full mt-2 px-4 py-2 rounded-lg text-xs text-red-400 hover:bg-gray-800 transition-colors"
          >
            Disconnect
          </button>
        )}
      </div>
    </aside>
  )
}
