import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAuth } from '../hooks/useAuth.jsx'

export default function ConnectView() {
  const { open } = useWeb3Modal()
  const { loading } = useAuth()

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 overflow-hidden relative">
      {/* Blobs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-[42%_58%_65%_35%/45%_40%_60%_55%] bg-green-400 animate-floatBlob" />
      <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-[60%_40%_35%_65%/55%_60%_40%_45%] bg-blue-300 animate-floatBlobSlow" />
      <div className="absolute top-5 right-16 w-24 h-24 rounded-full bg-ink" />

      <div className="relative z-10 w-full max-w-[600px] bg-surface rounded-[32px] px-6 py-10 md:px-16 md:py-20 text-center shadow-[0_30px_60px_-20px_rgba(27,33,64,0.3)]">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1B2140] mb-6">
          <div className="w-5 h-5 rounded-md bg-green-400" />
        </div>

        <h1 className="font-display text-[28px] md:text-[34px] font-extrabold text-ink leading-tight mb-2">Tracker</h1>
        <p className="text-muted text-base mb-9 leading-relaxed">
          Weekly goals, plainly kept.<br />No dashboards, just done.
        </p>

        {loading ? (
          <div className="w-full py-4 rounded-2xl bg-green-100 text-ink text-sm font-bold flex items-center justify-center gap-3">
            <div className="w-4 h-4 rounded-full border-[3px] border-green-500 border-t-transparent animate-spin" />
            Sign message to verify…
          </div>
        ) : (
          <button
            onClick={() => open()}
            className="w-full py-4 rounded-2xl bg-[#1B2140] text-white text-base font-extrabold hover:bg-[#272E52] transition-colors"
          >
            Connect Wallet
          </button>
        )}

        <p className="mt-5 text-xs text-faint">No email, no password. Just your wallet.</p>
      </div>
    </div>
  )
}
