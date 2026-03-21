import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, Search, ChevronRight, LogOut, Settings, User, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const BREADCRUMBS = {
  '/dashboard':  ['Dashboard'],
  '/workspaces': ['Workspaces'],
  '/notes':      ['Notes'],
  '/settings':   ['Settings'],
}

function useClickOutside(ref, cb) {
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) cb() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, cb])
}

export default function Topbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [userMenu, setUserMenu] = useState(false)
  const [notifMenu, setNotifMenu] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const userRef = useRef(null)
  const notifRef = useRef(null)

  useClickOutside(userRef,  () => setUserMenu(false))
  useClickOutside(notifRef, () => setNotifMenu(false))

  const pathKey = Object.keys(BREADCRUMBS).find(k =>
    location.pathname === k || location.pathname.startsWith(k + '/')
  )
  const crumbs = BREADCRUMBS[pathKey] || []

  const NOTIFS = [
    { id: 1, text: '"Market Size Report.pdf" finished processing', time: '2m ago', unread: true },
    { id: 2, text: 'Workspace summary generated for Product Research', time: '1h ago', unread: true },
    { id: 3, text: 'Document upload complete', time: '3h ago', unread: false },
  ]

  const dropdownStyle = {
    background: 'var(--modal-bg)',
    border: '1px solid var(--border-default)',
    boxShadow: 'var(--shadow-modal)',
    borderRadius: '0.75rem',
  }

  const menuItem = (onClick, icon, label, danger) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 w-full px-4 py-2 text-sm transition-all text-left"
      style={{ color: danger ? 'var(--accent-red)' : 'var(--txt-secondary)' }}
      onMouseEnter={e => {
        e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.06)' : 'var(--bg-hover)'
        e.currentTarget.style.color = danger ? 'var(--accent-red)' : 'var(--txt-primary)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = danger ? 'var(--accent-red)' : 'var(--txt-secondary)'
      }}
    >
      {icon}{label}
    </button>
  )

  return (
    <header className="topbar-base h-14 flex items-center justify-between px-5 shrink-0 sticky top-0 z-30">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-medium" style={{ color: 'var(--txt-muted)' }}>DocuMind</span>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight size={12} style={{ color: 'var(--txt-muted)' }} />
            <span className="font-semibold" style={{ color: 'var(--txt-primary)' }}>{c}</span>
          </span>
        ))}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">

        {/* Search */}
        <motion.div
          animate={{ width: searchFocused ? 260 : 190 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative"
        >
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--txt-muted)' }} />
          <input
            type="text"
            placeholder="Search everything..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="input-base pl-8 h-8 text-xs py-0"
          />
          {searchFocused && (
            <kbd
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] px-1 py-0.5 rounded font-mono"
              style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-muted)' }}
            >⌘K</kbd>
          )}
        </motion.div>

        {/* Theme toggle */}
        <motion.button
          onClick={toggleTheme}
          whileTap={{ scale: 0.88, rotate: 15 }}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-secondary)' }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--txt-primary)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-secondary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
        >
          <AnimatePresence mode="wait">
            {theme === 'dark'
              ? <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><Sun size={14} /></motion.span>
              : <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Moon size={14} /></motion.span>
            }
          </AnimatePresence>
        </motion.button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifMenu(!notifMenu); setUserMenu(false) }}
            className="w-8 h-8 rounded-lg flex items-center justify-center relative transition-all"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-secondary)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--txt-primary)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-secondary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
          >
            <Bell size={14} />
            <span className="notif-dot" style={{ background: 'var(--accent)' }} />
          </button>

          <AnimatePresence>
            {notifMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-10 w-76 overflow-hidden z-50"
                style={{ ...dropdownStyle, width: 300 }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-faint)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: 'var(--txt-primary)' }}>Notifications</span>
                    <button className="text-[11px] transition-colors" style={{ color: 'var(--accent)' }}>Mark all read</button>
                  </div>
                </div>
                {NOTIFS.map(n => (
                  <div
                    key={n.id}
                    className="px-4 py-3 cursor-pointer transition-all"
                    style={{
                      borderBottom: '1px solid var(--border-faint)',
                      background: n.unread ? 'color-mix(in srgb, var(--accent) 4%, transparent)' : 'transparent',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = n.unread ? 'color-mix(in srgb, var(--accent) 4%, transparent)' : 'transparent'}
                  >
                    <div className="flex items-start gap-2.5">
                      {n.unread
                        ? <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--accent)' }} />
                        : <div className="w-1.5 h-1.5 shrink-0" />
                      }
                      <div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--txt-primary)' }}>{n.text}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-muted)' }}>{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2 text-center">
                  <button className="text-xs font-medium transition-colors" style={{ color: 'var(--accent)' }}>View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserMenu(!userMenu); setNotifMenu(false) }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg transition-all"
            style={{ color: 'var(--txt-secondary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
            >
              {user?.initials || 'U'}
            </div>
            <span className="text-xs font-medium hidden sm:block" style={{ color: 'var(--txt-secondary)' }}>
              {user?.name?.split(' ')[0]}
            </span>
          </button>

          <AnimatePresence>
            {userMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-10 w-52 overflow-hidden z-50"
                style={dropdownStyle}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-faint)' }}>
                  <div className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>{user?.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--txt-muted)' }}>{user?.email}</div>
                </div>
                <div className="py-1">
                  {menuItem(() => { navigate('/settings'); setUserMenu(false) }, <User size={13} />, 'Profile')}
                  {menuItem(() => { navigate('/settings'); setUserMenu(false) }, <Settings size={13} />, 'Settings')}
                  <div className="my-1" style={{ borderTop: '1px solid var(--border-faint)' }} />
                  {menuItem(() => { logout(); navigate('/') }, <LogOut size={13} />, 'Sign out', true)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
