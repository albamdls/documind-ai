import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen p-3 md:p-4 lg:p-5" style={{ background: 'var(--bg-base)' }}>
      <div className="dm-app-frame min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-2.5rem)] flex flex-col">
        <Topbar />
        <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
          <Sidebar />
          <main className="dm-main flex flex-1 min-h-0 min-w-0 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
