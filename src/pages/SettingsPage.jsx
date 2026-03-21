import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Key, Bell, Cpu, Shield, Globe,
  ChevronRight, Check, Copy, RefreshCw, Eye, EyeOff,
  Sparkles, Trash2, Download, Camera, LogOut
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Badge, Button, Toggle, Avatar } from '../components/ui/index'

function Section({ icon, title, description, children }) {
  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid var(--border-faint)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-secondary)' }}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>{title}</h3>
          {description && <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>{description}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

const AI_PROVIDERS = [
  { id: 'anthropic',   name: 'Anthropic',    model: 'Claude 3.5 Sonnet',  logo: '🟠', badge: 'Recommended',  badgeVariant: 'blue'    },
  { id: 'openai',      name: 'OpenAI',       model: 'GPT-4o',             logo: '⚫', badge: null,           badgeVariant: null       },
  { id: 'huggingface', name: 'Hugging Face', model: 'Mixtral 8x7B',       logo: '🟡', badge: 'Open source',  badgeVariant: 'green'   },
]

const INTEGRATIONS = [
  { name: 'Google Drive', icon: '📂', status: 'connected'    },
  { name: 'Notion',       icon: '⬛', status: 'disconnected' },
  { name: 'Slack',        icon: '💬', status: 'disconnected' },
  { name: 'GitHub',       icon: '🐙', status: 'coming_soon'  },
]

export default function SettingsPage() {
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' })
  const [provider, setProvider] = useState(user?.aiProvider || 'anthropic')
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved
  const [notifs, setNotifs] = useState({
    processingComplete: true,
    weeklyDigest: false,
    aiSuggestions: true,
    teamUpdates: false,
  })

  const handleSaveProfile = async () => {
    if (!profile.name.trim()) return
    setSaveState('saving')
    await new Promise(r => setTimeout(r, 700))
    updateProfile({ name: profile.name, email: profile.email })
    setSaveState('saved')
    setTimeout(() => setSaveState('idle'), 2500)
  }

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl mb-1 tracking-tight" style={{ color: 'var(--txt-primary)' }}>Settings</h1>
        <p className="text-sm" style={{ color: 'var(--txt-secondary)' }}>Manage your account, integrations, and preferences.</p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Section icon={<User size={15} />} title="Profile" description="Your personal information">
          <div className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
                  {user?.initials || 'U'}
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', color: 'var(--txt-secondary)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--txt-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-secondary)'}
                ><Camera size={11} /></button>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>{user?.name}</p>
                <p className="text-xs" style={{ color: 'var(--txt-secondary)' }}>{user?.email}</p>
                <div className="mt-1"><Badge variant="blue" size="sm">{user?.plan || 'Free'} Plan</Badge></div>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>Display Name</label>
                <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  className="input-base" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>Email Address</label>
                <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                  className="input-base" type="email" placeholder="you@company.com" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary" size="sm" onClick={handleSaveProfile} loading={saveState === 'saving'} disabled={saveState === 'saving'}>
                {saveState === 'saved' ? <><Check size={13} /> Saved!</> : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Section>
      </motion.div>

      {/* AI Provider */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section icon={<Cpu size={15} />} title="AI Provider" description="Choose the model powering your knowledge base">
          <div className="space-y-3">
            {AI_PROVIDERS.map(p => (
              <button key={p.id} onClick={() => setProvider(p.id)}
                className="w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left"
                style={{
                  background: provider === p.id ? 'color-mix(in srgb, var(--accent) 6%, transparent)' : 'var(--bg-hover)',
                  border: `1px solid ${provider === p.id ? 'color-mix(in srgb, var(--accent) 30%, transparent)' : 'var(--border-faint)'}`,
                }}
                onMouseEnter={e => provider !== p.id && (e.currentTarget.style.borderColor = 'var(--border-default)')}
                onMouseLeave={e => provider !== p.id && (e.currentTarget.style.borderColor = 'var(--border-faint)')}
              >
                <span className="text-2xl">{p.logo}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>{p.name}</span>
                    {p.badge && <Badge variant={p.badgeVariant} size="sm">{p.badge}</Badge>}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--txt-muted)' }}>{p.model}</p>
                </div>
                <div className="w-5 h-5 rounded-full flex items-center justify-center transition-all"
                  style={provider === p.id
                    ? { background: 'var(--accent)', border: '2px solid var(--accent)' }
                    : { border: '2px solid var(--border-strong)' }
                  }>
                  {provider === p.id && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: 'var(--txt-muted)' }}>
            Your API key for the selected provider will be used for all AI operations in your workspaces.
          </p>
        </Section>
      </motion.div>

      {/* API Keys */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Section icon={<Key size={15} />} title="API Keys" description="Manage API access credentials">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>
                {AI_PROVIDERS.find(p => p.id === provider)?.name || 'AI Provider'} API Key
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input type={showApiKey ? 'text' : 'password'}
                    value="sk-ant-api03-••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"
                    readOnly className="input-base font-mono text-xs pr-20" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5">
                    <button onClick={() => setShowApiKey(!showApiKey)}
                      className="w-7 h-7 rounded flex items-center justify-center transition-colors"
                      style={{ color: 'var(--txt-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--txt-primary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-muted)'}
                    >{showApiKey ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                    <button onClick={handleCopy}
                      className="w-7 h-7 rounded flex items-center justify-center transition-colors"
                      style={{ color: copied ? 'var(--accent-green)' : 'var(--txt-muted)' }}
                    >{copied ? <Check size={12} /> : <Copy size={12} />}</button>
                  </div>
                </div>
                <Button variant="secondary" size="sm"><RefreshCw size={12} /> Rotate</Button>
              </div>
            </div>

            {/* DocuMind API */}
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-faint)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium" style={{ color: 'var(--txt-primary)' }}>DocuMind API Access</p>
                <Badge variant="green" size="sm">Active</Badge>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--txt-muted)' }}>Use this key to integrate DocuMind AI into your own applications via our REST API.</p>
              <div className="flex gap-2">
                <input type="password" value="dm-api-••••••••••••••••••••••••••••••" readOnly className="input-base font-mono text-xs flex-1" />
                <Button variant="secondary" size="sm"><Copy size={12} /> Copy</Button>
              </div>
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Section icon={<Bell size={15} />} title="Notifications" description="Control when and how you get notified">
          <Toggle checked={notifs.processingComplete} onChange={v => setNotifs(n => ({ ...n, processingComplete: v }))}
            label="Processing complete" description="Notify me when documents finish indexing" />
          <Toggle checked={notifs.weeklyDigest} onChange={v => setNotifs(n => ({ ...n, weeklyDigest: v }))}
            label="Weekly knowledge digest" description="A summary of activity across your workspaces" />
          <Toggle checked={notifs.aiSuggestions} onChange={v => setNotifs(n => ({ ...n, aiSuggestions: v }))}
            label="AI suggestions" description="Proactive insights and recommendations from your documents" />
          <Toggle checked={notifs.teamUpdates} onChange={v => setNotifs(n => ({ ...n, teamUpdates: v }))}
            label="Team updates" description="When teammates add documents or notes" />
        </Section>
      </motion.div>

      {/* Integrations */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Section icon={<Globe size={15} />} title="Integrations" description="Connect DocuMind AI with your existing tools">
          <div className="space-y-3">
            {INTEGRATIONS.map(int => (
              <div key={int.name} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-faint)' }}>
                <span className="text-xl">{int.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--txt-primary)' }}>{int.name}</p>
                  <p className="text-xs" style={{
                    color: int.status === 'connected' ? 'var(--accent-green)' : int.status === 'coming_soon' ? 'var(--txt-muted)' : 'var(--txt-muted)'
                  }}>
                    {int.status === 'connected' ? '✓ Connected' : int.status === 'coming_soon' ? 'Coming soon' : 'Not connected'}
                  </p>
                </div>
                {int.status !== 'coming_soon' && (
                  <Button variant={int.status === 'connected' ? 'secondary' : 'primary'} size="sm">
                    {int.status === 'connected' ? 'Disconnect' : 'Connect'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Account */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Section icon={<Shield size={15} />} title="Account" description="Manage your account data and session">
          <div className="space-y-3">
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-left"
              style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-faint)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-faint)'}
            >
              <Download size={14} style={{ color: 'var(--txt-secondary)' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--txt-primary)' }}>Export all data</p>
                <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>Download all workspaces, documents, and notes as a ZIP</p>
              </div>
              <ChevronRight size={13} style={{ color: 'var(--txt-muted)' }} className="ml-auto" />
            </button>

            <button onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-left"
              style={{ background: 'color-mix(in srgb, var(--accent-amber) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-amber) 15%, transparent)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--accent-amber) 10%, transparent)'}
              onMouseLeave={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--accent-amber) 5%, transparent)'}
            >
              <LogOut size={14} style={{ color: 'var(--accent-amber)' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--accent-amber)' }}>Sign out</p>
                <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>Sign out from all devices</p>
              </div>
              <ChevronRight size={13} style={{ color: 'var(--txt-muted)' }} className="ml-auto" />
            </button>

            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-left"
              style={{ background: 'color-mix(in srgb, var(--accent-red) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-red) 15%, transparent)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--accent-red) 10%, transparent)'}
              onMouseLeave={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--accent-red) 5%, transparent)'}
            >
              <Trash2 size={14} style={{ color: 'var(--accent-red)' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--accent-red)' }}>Delete account</p>
                <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>Permanently delete your account and all data — irreversible</p>
              </div>
              <ChevronRight size={13} style={{ color: 'var(--txt-muted)' }} className="ml-auto" />
            </button>
          </div>
        </Section>
      </motion.div>
    </div>
  )
}
