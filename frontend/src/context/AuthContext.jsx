import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Simulated "database" of users stored in localStorage
const DB_KEY = 'documind_users'
const SESSION_KEY = 'documind_session'

function getUsers() {
  try { return JSON.parse(localStorage.getItem(DB_KEY) || '[]') } catch { return [] }
}

function saveUsers(users) {
  localStorage.setItem(DB_KEY, JSON.stringify(users))
}

function buildInitials(name) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sessionLoaded, setSessionLoaded] = useState(false)

  // Restore session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Verify user still exists
        const users = getUsers()
        const found = users.find(u => u.id === parsed.id)
        if (found) setUser(found)
      }
    } catch { /* ignore */ }
    setSessionLoaded(true)
  }, [])

  // Persist session whenever user changes
  useEffect(() => {
    if (!sessionLoaded) return
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
  }, [user, sessionLoaded])

  /* ── register ─────────────────────────────── */
  const register = async (name, email, password) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 900)) // simulate network

    const users = getUsers()

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setLoading(false)
      return { success: false, error: 'An account with this email already exists.' }
    }

    const newUser = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // in a real app this would be hashed
      initials: buildInitials(name),
      plan: 'Free',
      joinedAt: new Date().toISOString(),
      aiProvider: 'anthropic',
    }

    saveUsers([...users, newUser])
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    setLoading(false)
    return { success: true }
  }

  /* ── login ────────────────────────────────── */
  const login = async (email, password) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const users = getUsers()
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    )

    if (!found) {
      setLoading(false)
      return { success: false, error: 'Incorrect email or password. Please try again.' }
    }

    const { password: _, ...safeUser } = found
    setUser(safeUser)
    setLoading(false)
    return { success: true }
  }

  /* ── loginWithDemo ────────────────────────── */
  const loginWithDemo = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))

    const demoUser = {
      id: 'demo_user',
      name: 'Alex Rivera',
      email: 'alex@documind.ai',
      initials: 'AR',
      plan: 'Pro',
      joinedAt: '2024-01-15T00:00:00Z',
      aiProvider: 'anthropic',
    }
    setUser(demoUser)
    setLoading(false)
    return { success: true }
  }

  /* ── updateProfile ────────────────────────── */
  const updateProfile = (updates) => {
    const updated = { ...user, ...updates, initials: buildInitials(updates.name || user.name) }
    setUser(updated)
    // Also update in storage
    const users = getUsers()
    saveUsers(users.map(u => u.id === updated.id ? { ...u, ...updates } : u))
  }

  /* ── logout ───────────────────────────────── */
  const logout = () => setUser(null)

  if (!sessionLoaded) {
    // Tiny splash while restoring session
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithDemo, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
