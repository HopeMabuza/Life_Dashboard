import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-cream">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto px-10 py-9">
        <Outlet />
      </main>
    </div>
  )
}
