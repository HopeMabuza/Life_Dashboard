import { useWeb3Modal } from '@web3modal/wagmi/react'
import Button from '../components/ui/Button'

export default function ConnectView() {
  const { open } = useWeb3Modal()

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Life Dashboard</h1>
        <p className="text-gray-400 text-lg">Connect your wallet to get started</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm text-center space-y-4">
        <div className="text-5xl">🔐</div>
        <p className="text-gray-400 text-sm">
          Sign in securely using your crypto wallet. No email or password needed.
        </p>
        <Button onClick={() => open()} className="w-full py-3 text-base">
          Connect Wallet
        </Button>
        <p className="text-xs text-gray-600">
          Supports MetaMask, Rainbow, Coinbase Wallet & more
        </p>
      </div>
    </div>
  )
}
