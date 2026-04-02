import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Moon, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LanguageSwitcher from '../components/common/LanguageSwitcher'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')

    const result = await login(form.email, form.password)
    if (result.success) navigate('/dashboard')
    else setServerError(result.error)
  }

  return (
    <div className="dm-auth-shell relative">
      <div className="absolute top-5 right-5 flex items-center gap-2">
        <LanguageSwitcher />
        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{
            background: 'var(--color-background-primary)',
            border: '1px solid var(--color-border-tertiary)',
            color: 'var(--color-text-secondary)',
          }}
          title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="dm-auth-card"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-md" style={{ background: 'var(--color-text-primary)' }} />
            <span className="text-base font-medium" style={{ color: 'var(--color-text-primary)' }}>DocuMind</span>
          </div>
          <p className="text-[20px] font-medium m-0 mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
            {t('auth.login.title')}
          </p>
          <p className="text-[13px] m-0" style={{ color: 'var(--color-text-secondary)' }}>
            {t('auth.login.subtitle')}
          </p>
        </div>

        <div className="dm-surface-card">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                {t('auth.login.email')}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
                placeholder={t('auth.register.emailPlaceholder')}
                autoComplete="email"
                className="dm-input"
              />
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                {t('auth.login.password')}
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={event => setForm(current => ({ ...current, password: event.target.value }))}
                  placeholder="········"
                  autoComplete="current-password"
                  className="dm-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(current => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {serverError && (
              <p className="text-xs mb-4" style={{ color: 'var(--accent-red)' }}>
                {serverError}
              </p>
            )}

            <button type="submit" disabled={loading} className="dm-primary-button">
              {loading ? t('auth.login.loading') : t('auth.login.submit')}
            </button>
          </form>

          <p className="text-center text-[12px] mt-4 mb-0" style={{ color: 'var(--color-text-secondary)' }}>
            {t('auth.login.noAccount')}{' '}
            <Link to="/register" style={{ color: 'var(--color-text-info)' }}>
              {t('auth.login.register')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
