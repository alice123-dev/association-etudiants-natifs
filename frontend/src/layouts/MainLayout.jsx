import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

function MainLayout() {
  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg p-6 gap-6 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto pb-2">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout