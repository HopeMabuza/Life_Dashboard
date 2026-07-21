import { useState, useEffect, createContext, useContext } from 'react'
import { useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { verifyWallet } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { disconnect } = useDisconnect()

  const [token, setToken]     = useState(() => localStorage.getItem('auth_token'))
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // When wallet connects, sign a message to authenticate
  useEffect(() => {
    if (isConnected && address && !token) {
      signIn()
    }
    if (!isConnected) {
      setToken(null)
      localStorage.removeItem('auth_token')
    }
  }, [isConnected, address])

  async function signIn() {
    try {
      setLoading(true)
      setError(null)
      const message = `Sign in to Life Dashboard\nAddress: ${address}\nTimestamp: ${Date.now()}`
      const signature = await signMessageAsync({ message })
      const res = await verifyWallet(address, signature, message)
      const jwt = res.data.token
      localStorage.setItem('auth_token', jwt)
      setToken(jwt)
    } catch (err) {
      setError('Authentication failed. Please try again.')
      disconnect()
    } finally {
      setLoading(false)
    }
  }

  function signOut() {
    disconnect()
    setToken(null)
    localStorage.removeItem('auth_token')
  }

  return (
    <AuthContext.Provider value={{ token, address, isAuthenticated: !!token, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
