import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FolderOpen, StickyNote, Settings,
  ChevronLeft, ChevronRight, Sparkles, Plus, LogOut
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/workspaces', icon: FolderOpen,       label: 'Workspaces' },
  { to: '/notes',      icon: StickyNote,       label: 'Notes'      },
  { to: '/settings',   icon: Settings,         label: 'Settings'   },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 216 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="sidebar-base relative flex flex-col h-full shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-[18px]" style={{ borderBottom: '1px solid var(--border-faint)' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-glow"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
        >
          <Sparkles size={13} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.14 }}
              className="font-display font-bold text-sm tracking-tight whitespace-nowrap"
              style={{ color: 'var(--txt-primary)' }}
            >
              DocuMind AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* New workspace btn */}
      <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border-faint)' }}>
        <button
          onClick={() => navigate('/workspaces')}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold transition-all ${collapsed ? 'justify-center' : ''}`}
          style={{
            background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
            color: 'var(--accent)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 18%, transparent)'}
          onMouseLeave={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 10%, transparent)'}
        >
          <Plus size={13} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
                New Workspace
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center !px-2' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={15} className="shrink-0" style={{ color: isActive ? 'var(--accent)' : undefined }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.12 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-2.5 py-3" style={{ borderTop: '1px solid var(--border-faint)' }}>
        <div
          className={`flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all cursor-pointer group ${collapsed ? 'justify-center' : ''}`}
          style={{ borderRadius: '0.5rem' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
          >
            {user?.initials || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: 'var(--txt-primary)' }}>{user?.name}</div>
                <div className="text-[10px] truncate" style={{ color: 'var(--txt-muted)' }}>{user?.plan} plan</div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleLogout}
                className="opacity-0 group-hover:opacity-100 transition-all"
                style={{ color: 'var(--txt-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-muted)'}
                title="Sign out"
              >
                <LogOut size={13} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center z-10 transition-all"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          color: 'var(--txt-muted)',
          boxShadow: 'var(--shadow-sm)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--txt-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--txt-muted)' }}
      >
        {collapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
      </button>
    </motion.aside>
  )
}
