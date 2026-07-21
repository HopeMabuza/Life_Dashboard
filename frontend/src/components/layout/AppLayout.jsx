import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import TopBar from './TopBar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-cream">
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto pb-24 md:pb-9">
        <TopBar />
        <div className="px-4 py-6 md:px-10 md:py-9">
          <Outlet />
        </div>
      </main>

      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  )
}
