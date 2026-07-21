import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from './lib/wagmi'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import AppLayout from './components/layout/AppLayout'
import ConnectView    from './views/ConnectView'
import TasksHomeView  from './views/TasksHomeView'
import ReflectView    from './views/ReflectView'
import OverviewView   from './views/OverviewView'

const queryClient = new QueryClient()

function ProtectedRoutes() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Authenticating…</p>
      </div>
    )
  }

  if (!isAuthenticated) return <ConnectView />

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/"         element={<TasksHomeView />} />
        <Route path="/reflect"  element={<ReflectView />} />
        <Route path="/overview" element={<OverviewView />} />
        <Route path="*"         element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <ProtectedRoutes />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
