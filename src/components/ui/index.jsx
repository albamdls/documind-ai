import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, X } from 'lucide-react'

/* ─── Button ────────────────────────────────────── */
export function Button({
  children, variant = 'primary', size = 'md',
  loading, disabled, className = '', onClick, type = 'button', fullWidth, ...props
}) {
  const sz = {
    xs: 'px-2.5 py-1 text-[11px] gap-1',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2',
  }[size]

  const base = `inline-flex items-center justify-center font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sz} ${fullWidth ? 'w-full' : ''} ${className}`

  if (variant === 'primary')
    return (
      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type={type} onClick={onClick} disabled={disabled || loading} className={`btn-primary ${base}`} {...props}>
        {loading ? <Loader2 size={14} className="animate-spin" /> : null}
        {children}
      </motion.button>
    )

  if (variant === 'secondary')
    return (
      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type={type} onClick={onClick} disabled={disabled || loading} className={`btn-secondary ${base}`} {...props}>
        {loading ? <Loader2 size={14} className="animate-spin" /> : null}
        {children}
      </motion.button>
    )

  if (variant === 'ghost')
    return (
      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type={type} onClick={onClick} disabled={disabled || loading}
        className={`${base} border border-transparent`}
        style={{ color: 'var(--txt-secondary)' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--txt-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--txt-secondary)' }}
        {...props}>
        {children}
      </motion.button>
    )

  if (variant === 'danger')
    return (
      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type={type} onClick={onClick} disabled={disabled || loading}
        className={`${base} bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20`} {...props}>
        {children}
      </motion.button>
    )

  return null
}

/* ─── Input ─────────────────────────────────────── */
export function Input({ label, error, success, icon, rightIcon, hint, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--txt-muted)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--txt-muted)' }}>
            {icon}
          </span>
        )}
        <input
          className={`input-base ${icon ? 'pl-9' : ''} ${rightIcon ? 'pr-10' : ''} ${error ? 'input-error' : ''} ${success ? 'input-success' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt-muted)' }}>
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-400 flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>{hint}</p>}
    </div>
  )
}

/* ─── Textarea ──────────────────────────────────── */
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--txt-muted)' }}>{label}</label>}
      <textarea className={`input-base resize-none ${error ? 'input-error' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

/* ─── Badge ─────────────────────────────────────── */
const BADGE_STYLES = {
  default: { bg: 'var(--bg-badge)',               color: 'var(--txt-secondary)',  border: 'var(--border-default)' },
  blue:    { bg: 'rgba(79,142,247,0.12)',          color: 'var(--accent)',         border: 'rgba(79,142,247,0.25)' },
  green:   { bg: 'rgba(16,185,129,0.12)',          color: 'var(--accent-green)',   border: 'rgba(16,185,129,0.25)' },
  red:     { bg: 'rgba(239,68,68,0.12)',           color: 'var(--accent-red)',     border: 'rgba(239,68,68,0.25)'  },
  yellow:  { bg: 'rgba(245,158,11,0.12)',          color: 'var(--accent-amber)',   border: 'rgba(245,158,11,0.25)' },
  purple:  { bg: 'rgba(139,92,246,0.12)',          color: 'var(--accent-2)',       border: 'rgba(139,92,246,0.25)' },
  cyan:    { bg: 'rgba(34,211,238,0.12)',          color: 'var(--accent-cyan)',    border: 'rgba(34,211,238,0.25)' },
}

export function Badge({ children, variant = 'default', size = 'sm' }) {
  const s = BADGE_STYLES[variant] || BADGE_STYLES.default
  const sz = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
  return (
    <span
      className={`badge ${sz}`}
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {children}
    </span>
  )
}

/* ─── StatCard ──────────────────────────────────── */
export function StatCard({ icon, label, value, delta, color, colorVar }) {
  const c = colorVar || color || 'var(--accent)'
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass rounded-xl p-5 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `color-mix(in srgb, ${c} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${c} 25%, transparent)` }}>
          <span style={{ color: c }}>{icon}</span>
        </div>
        {delta && <Badge variant="green">{delta}</Badge>}
      </div>
      <div className="stat-value mb-1">{value}</div>
      <div className="text-xs font-medium" style={{ color: 'var(--txt-secondary)' }}>{label}</div>
    </motion.div>
  )
}

/* ─── EmptyState ────────────────────────────────── */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-muted)' }}>
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--txt-primary)' }}>{title}</h3>
      <p className="text-sm max-w-xs mb-6" style={{ color: 'var(--txt-secondary)' }}>{description}</p>
      {action}
    </div>
  )
}

/* ─── Skeleton ──────────────────────────────────── */
export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

/* ─── Modal ─────────────────────────────────────── */
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0" style={{ background: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
            className={`relative w-full ${sizes[size]} modal-surface rounded-2xl overflow-hidden shadow-modal`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border-faint)' }}>
              <h2 className="text-base font-semibold section-header">{title}</h2>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                style={{ background: 'var(--bg-hover)', color: 'var(--txt-secondary)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--txt-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-secondary)'}
              >
                <X size={13} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Tabs ──────────────────────────────────────── */
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tab-bar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`tab-item ${active === tab.id ? 'active' : ''}`}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span
              className="text-[11px] px-1.5 py-0.5 rounded-full font-medium"
              style={{
                background: active === tab.id ? 'var(--bg-hover)' : 'var(--bg-badge)',
                color: active === tab.id ? 'var(--txt-primary)' : 'var(--txt-muted)',
              }}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

/* ─── SearchBar ─────────────────────────────────── */
export function SearchBar({ placeholder = 'Search...', value, onChange, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--txt-muted)" strokeWidth="2.5">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-base pl-9 py-2 text-sm"
      />
    </div>
  )
}

/* ─── Toggle ────────────────────────────────────── */
export function Toggle({ checked, onChange, label, description, disabled }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border-faint)' }}>
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium" style={{ color: 'var(--txt-primary)' }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: 'var(--txt-muted)' }}>{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className="relative w-11 h-6 rounded-full transition-all duration-200 shrink-0 disabled:opacity-50"
        style={{ background: checked ? 'var(--accent)' : 'var(--border-strong)' }}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
          style={{ left: checked ? '1.375rem' : '0.25rem' }}
        />
      </button>
    </div>
  )
}

/* ─── Divider ───────────────────────────────────── */
export function Divider({ label }) {
  if (label) return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 divider" />
      <span className="text-xs" style={{ color: 'var(--txt-muted)' }}>{label}</span>
      <div className="flex-1 divider" />
    </div>
  )
  return <div className="divider my-4" />
}

/* ─── Spinner ───────────────────────────────────── */
export function Spinner({ size = 16 }) {
  return <Loader2 size={size} className="animate-spin" style={{ color: 'var(--accent)' }} />
}

/* ─── Avatar ────────────────────────────────────── */
export function Avatar({ name, size = 'md' }) {
  const sz = { sm: 'w-6 h-6 text-[10px]', md: 'w-8 h-8 text-xs', lg: 'w-10 h-10 text-sm', xl: 'w-14 h-14 text-base' }[size]
  const initials = name ? name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() : 'U'
  return (
    <div className={`${sz} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
      {initials}
    </div>
  )
}
