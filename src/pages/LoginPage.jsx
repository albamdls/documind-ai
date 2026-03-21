import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Divider } from '../components/ui/index'

const FEATURES = [
  { icon: '🔬', text: 'Intelligent document understanding' },
  { icon: '💬', text: 'Conversational AI with cited sources' },
  { icon: '🗂️', text: 'Multi-workspace knowledge management' },
  { icon: '⚡', text: 'Semantic search across all your files' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loginWithDemo, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [demoLoading, setDemoLoading] = useState(false)
  const [touched, setTouched] = useState({})

  const isDark = theme === 'dark'

  const validate = (f = form) => {
    const e = {}
    if (!f.email.trim())                         e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(f.email))      e.email = 'Enter a valid email address'
    if (!f.password)                              e.password = 'Password is required'
    else if (f.password.length < 6)              e.password = 'Minimum 6 characters'
    return e
  }

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setServerError('')
    if (touched[field]) {
      const errs = validate({ ...form, [field]: value })
      setErrors(e => ({ ...e, [field]: errs[field] }))
    }
  }

  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }))
    const errs = validate()
    setErrors(e => ({ ...e, [field]: errs[field] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setServerError('')
    const result = await login(form.email, form.password)
    if (result.success) navigate('/dashboard')
    else setServerError(result.error)
  }

  const handleDemo = async () => {
    setDemoLoading(true)
    const result = await loginWithDemo()
    setDemoLoading(false)
    if (result.success) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>

      {/* ── Left branding panel (hidden on mobile) ── */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden"
        style={{ background: isDark ? '#0a0f18' : '#f0f4ff' }}>

        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(79,142,247,0.18) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 flex flex-col h-full px-14 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-glow"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight" style={{ color: 'var(--txt-primary)' }}>
              DocuMind AI
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="font-display font-bold text-4xl leading-tight tracking-tight mb-4"
                style={{ color: 'var(--txt-primary)' }}>
                Your knowledge,<br />
                <span className="text-gradient">amplified by AI</span>
              </h2>
              <p className="text-base leading-relaxed mb-10" style={{ color: 'var(--txt-secondary)' }}>
                Upload documents, chat with your files, and build a knowledge base that truly understands you.
              </p>
            </motion.div>

            <div className="space-y-4">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                    style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)' }}>
                    {f.icon}
                  </div>
                  <span className="text-sm" style={{ color: 'var(--txt-secondary)' }}>{f.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Mini mockup card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 card-glass rounded-2xl p-4"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 rounded-full shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }} />
                <div className="h-2 rounded flex-1" style={{ background: 'var(--border-strong)' }} />
              </div>
              <div className="space-y-1.5">
                <div className="h-2 rounded w-full" style={{ background: 'var(--bg-hover)' }} />
                <div className="h-2 rounded w-4/5" style={{ background: 'var(--bg-hover)' }} />
                <div className="h-2 rounded w-3/5" style={{ background: 'var(--bg-hover)' }} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }} />
                <div className="h-1.5 rounded w-32" style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)' }} />
              </div>
            </motion.div>
          </div>

          <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>© 2024 DocuMind AI · All rights reserved</p>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:max-w-[480px] relative">

        {/* Theme toggle top-right */}
        <button
          onClick={toggleTheme}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-secondary)' }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-display font-bold" style={{ color: 'var(--txt-primary)' }}>DocuMind AI</span>
          </div>

          <h1 className="font-display font-bold text-2xl mb-1 tracking-tight" style={{ color: 'var(--txt-primary)' }}>
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--txt-secondary)' }}>
            Sign in to your workspace
          </p>

          {/* Demo access button */}
          <button
            onClick={handleDemo}
            disabled={loading || demoLoading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-sm mb-4 transition-all disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 15%, transparent), color-mix(in srgb, var(--accent-2) 12%, transparent))',
              border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
              color: 'var(--accent)',
            }}
          >
            {demoLoading
              ? <><div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Loading demo...</>
              : <><Zap size={15} /> Try demo account</>
            }
          </button>

          {/* Google button */}
          <button
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium mb-5 transition-all"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-primary)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <Divider label="or sign in with email" />

          {/* Server error */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm text-red-400 overflow-hidden"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>
                Email address
              </label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--txt-muted)' }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className={`input-base pl-9 ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              <AnimatePresence>
                {errors.email && touched.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={11} />{errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--txt-muted)' }}>
                  Password
                </label>
                <a href="#" className="text-xs font-medium transition-colors hover:opacity-80" style={{ color: 'var(--accent)' }}>
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--txt-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`input-base pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-all"
                  style={{ color: 'var(--txt-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--txt-secondary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-muted)'}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && touched.password && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={11} />{errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-4 h-4 rounded border transition-all peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)]"
                  style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-input)' }} />
              </div>
              <span className="text-sm" style={{ color: 'var(--txt-secondary)' }}>Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60 mt-2"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
              onMouseEnter={e => !loading && (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                : <>Sign in <ArrowRight size={14} /></>
              }
            </button>
          </form>

          <p className="text-sm text-center mt-7" style={{ color: 'var(--txt-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold transition-colors hover:opacity-80" style={{ color: 'var(--accent)' }}>
              Create one free →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
