import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, User, AlertCircle, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Divider } from '../components/ui/index'

const STRENGTH_CONFIG = [
  { label: 'Too short',  color: '#ef4444' },
  { label: 'Weak',       color: '#ef4444' },
  { label: 'Fair',       color: '#f59e0b' },
  { label: 'Good',       color: '#3b82f6' },
  { label: 'Strong',     color: '#10b981' },
]

function getStrength(pw) {
  if (!pw || pw.length < 6) return 0
  let s = 1
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return Math.min(s, 4)
}

const REQUIREMENTS = [
  { test: pw => pw.length >= 8,          label: 'At least 8 characters' },
  { test: pw => /[A-Z]/.test(pw),        label: 'One uppercase letter' },
  { test: pw => /[0-9]/.test(pw),        label: 'One number' },
  { test: pw => /[^A-Za-z0-9]/.test(pw), label: 'One special character' },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [touched, setTouched] = useState({})
  const [showReqs, setShowReqs] = useState(false)

  const strength = getStrength(form.password)
  const sc = STRENGTH_CONFIG[strength]

  const validate = (f = form) => {
    const e = {}
    if (!f.name.trim())                           e.name = 'Full name is required'
    else if (f.name.trim().length < 2)            e.name = 'Name must be at least 2 characters'
    if (!f.email.trim())                          e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(f.email))       e.email = 'Enter a valid email address'
    if (!f.password)                              e.password = 'Password is required'
    else if (f.password.length < 8)              e.password = 'Minimum 8 characters'
    if (!f.confirm)                               e.confirm = 'Please confirm your password'
    else if (f.confirm !== f.password)            e.confirm = 'Passwords do not match'
    return e
  }

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setServerError('')
    if (touched[field]) {
      const errs = validate({ ...form, [field]: value })
      setErrors(e => ({ ...e, [field]: errs[field] || null }))
    }
  }

  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }))
    const errs = validate()
    setErrors(e => ({ ...e, [field]: errs[field] || null }))
    if (field === 'password') setShowReqs(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true, confirm: true })
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setServerError('')
    const result = await register(form.name, form.email, form.password)
    if (result.success) navigate('/dashboard')
    else setServerError(result.error)
  }

  const passwordsMatch = form.confirm && form.password === form.confirm

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-14 relative" style={{ background: 'var(--bg-base)' }}>

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-2) 8%, transparent) 0%, transparent 70%)' }} />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm"
        style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-secondary)' }}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-glow"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight" style={{ color: 'var(--txt-primary)' }}>
            DocuMind AI
          </span>
        </div>

        {/* Card */}
        <div className="card-glass rounded-2xl p-8">
          <h1 className="font-display font-bold text-2xl mb-1 tracking-tight text-center" style={{ color: 'var(--txt-primary)' }}>
            Create your account
          </h1>
          <p className="text-sm text-center mb-7" style={{ color: 'var(--txt-secondary)' }}>
            Start for free — no credit card required
          </p>

          {/* Google */}
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
            Sign up with Google
          </button>

          <Divider label="or continue with email" />

          {/* Server error */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm text-red-400 mb-4 overflow-hidden"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>
                Full name
              </label>
              <div className="relative">
                <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--txt-muted)' }} />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="Alex Rivera"
                  autoComplete="name"
                  className={`input-base pl-9 ${errors.name && touched.name ? 'input-error' : ''}`}
                />
              </div>
              <AnimatePresence>
                {errors.name && touched.name && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={11} />{errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

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
                  className={`input-base pl-9 ${errors.email && touched.email ? 'input-error' : ''}`}
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
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--txt-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  onFocus={() => setShowReqs(true)}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className={`input-base pl-9 pr-10 ${errors.password && touched.password ? 'input-error' : ''}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--txt-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--txt-secondary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-muted)'}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Strength meter */}
              <AnimatePresence>
                {form.password && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{ background: i <= strength ? sc.color : 'var(--border-strong)' }} />
                      ))}
                    </div>
                    <p className="text-[11px] mt-1 font-medium transition-colors" style={{ color: sc.color }}>{sc.label}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Requirements checklist */}
              <AnimatePresence>
                {showReqs && form.password && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-1 overflow-hidden">
                    {REQUIREMENTS.map((req, i) => {
                      const ok = req.test(form.password)
                      return (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${ok ? 'bg-emerald-500' : ''}`}
                            style={!ok ? { border: '1.5px solid var(--border-strong)' } : {}}>
                            {ok && <Check size={8} className="text-white" strokeWidth={3} />}
                          </div>
                          <span className="text-[11px] transition-colors" style={{ color: ok ? 'var(--accent-green)' : 'var(--txt-muted)' }}>
                            {req.label}
                          </span>
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {errors.password && touched.password && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={11} />{errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>
                Confirm password
              </label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--txt-muted)' }} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={e => handleChange('confirm', e.target.value)}
                  onBlur={() => handleBlur('confirm')}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={`input-base pl-9 pr-10 ${errors.confirm && touched.confirm ? 'input-error' : ''} ${passwordsMatch ? 'input-success' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: passwordsMatch ? 'var(--accent-green)' : 'var(--txt-muted)' }}>
                  {passwordsMatch ? <Check size={14} /> : showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.confirm && touched.confirm && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={11} />{errors.confirm}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Terms */}
            <p className="text-xs leading-relaxed" style={{ color: 'var(--txt-muted)' }}>
              By creating an account, you agree to our{' '}
              <a href="#" className="hover:opacity-80 underline underline-offset-2" style={{ color: 'var(--txt-secondary)' }}>Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="hover:opacity-80 underline underline-offset-2" style={{ color: 'var(--txt-secondary)' }}>Privacy Policy</a>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
              onMouseEnter={e => !loading && (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                : <>Create free account <ArrowRight size={14} /></>
              }
            </button>
          </form>
        </div>

        <p className="text-sm text-center mt-5" style={{ color: 'var(--txt-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--accent)' }}>
            Sign in →
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
