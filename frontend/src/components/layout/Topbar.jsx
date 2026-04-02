import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Moon, Settings, Sun, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import LanguageSwitcher from '../common/LanguageSwitcher'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handleClick = event => {
      if (ref.current && !ref.current.contains(event.target)) onClose()
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, onClose])
}

export default function Topbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useClickOutside(menuRef, () => setOpen(false))

  const firstName = user?.name?.split(' ')[0] || t('topbar.userFallback')

  return (
    <header className="dm-header px-4 py-3 md:px-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="dm-logo-mark shrink-0" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>DocuMind</span>
            <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>{t('topbar.subtitle')}</span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 transition-colors hover:bg-[var(--color-background-secondary)]"
          >
            <div className="dm-avatar">{user?.initials || 'DM'}</div>
            <span className="hidden text-xs font-medium sm:block" style={{ color: 'var(--color-text-secondary)' }}>
              {firstName}
            </span>
            <ChevronDown size={14} style={{ color: 'var(--color-text-tertiary)' }} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 top-11 w-56 overflow-hidden rounded-2xl z-50"
                style={{
                  background: 'var(--dropdown-bg)',
                  border: '1px solid var(--color-border-secondary)',
                  boxShadow: 'var(--shadow-modal)',
                }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border-tertiary)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{user?.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{user?.email}</p>
                </div>

                <div className="p-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme()
                      setOpen(false)
                    }}
                    className="dm-nav"
                  >
                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                    <span>{theme === 'dark' ? t('theme.light') : t('theme.dark')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate('/settings')
                      setOpen(false)
                    }}
                    className="dm-nav"
                  >
                    <Settings size={14} />
                    <span>{t('topbar.settings')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate('/settings')
                      setOpen(false)
                    }}
                    className="dm-nav"
                  >
                    <User size={14} />
                    <span>{t('topbar.profile')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      navigate('/')
                    }}
                    className="dm-nav"
                    style={{ color: 'var(--accent-red)' }}
                  >
                    <LogOut size={14} />
                    <span>{t('topbar.signOut')}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </div>
    </header>
  )
}
