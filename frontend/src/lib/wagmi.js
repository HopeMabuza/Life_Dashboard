import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { mainnet, polygon, optimism, arbitrum, base, sepolia, bsc } from 'wagmi/chains'

export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

const metadata = {
  name: 'Tracker',
  description: 'Weekly goals, plainly kept.',
  url: 'http://localhost:5173',
  icons: [],
}

const chains = [mainnet, polygon, optimism, arbitrum, base, sepolia, bsc]

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: false,
})

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: 'light',
  allowUnsupportedChain: true,
  enableNetworkView: false,
  featuredWalletIds: [],
  themeVariables: {
    '--w3m-accent':               '#1B2140',
    '--w3m-border-radius-master': '12px',
    '--w3m-font-family':          'Nunito, sans-serif',
    '--w3m-modal-width':          'min(360px, 92vw)',
  },
})
