import { useAuth } from '../../hooks/useAuth.jsx'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export default function TopBar() {
  const { address, signOut } = useAuth()
  const { open } = useWeb3Modal()
  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''

  return (
    <div className="flex md:hidden items-center justify-between px-4 py-4 bg-surface border-b border-line sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-[8px] bg-[#1B2140] flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-sm bg-green-400" />
        </div>
        <span className="font-display font-extrabold text-base text-ink">Tracker</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => open()}
          className="text-xs font-bold text-ink bg-cream px-3 py-1.5 rounded-xl font-mono"
        >
          {short || 'Connect'}
        </button>
        {address && (
          <button onClick={signOut} className="text-xs font-bold text-faint">
            Out
          </button>
        )}
      </div>
    </div>
  )
}
