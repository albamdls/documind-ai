import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Key, Bell, Cpu, Shield, Globe,
  ChevronRight, Check, Copy, RefreshCw, Eye, EyeOff,
  Sparkles, Trash2, Download, Camera, LogOut
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
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
  {
    id: 'anthropic',
    name: 'Anthropic',
    defaultModel: 'claude-3-5-sonnet',
    models: [
      { id: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-7-sonnet', label: 'Claude 3.7 Sonnet' },
      { id: 'claude-3-haiku', label: 'Claude 3 Haiku' },
    ],
    logo: '🟠',
      badgeKey: 'recommended',
      badgeVariant: 'blue',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    defaultModel: 'gpt-4o',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o' },
      { id: 'gpt-4.1', label: 'GPT-4.1' },
      { id: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
    ],
    logo: '⚫',
      badgeKey: null,
    badgeVariant: null,
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    defaultModel: 'mixtral-8x7b',
    models: [
      { id: 'mixtral-8x7b', label: 'Mixtral 8x7B' },
      { id: 'llama-3.1-70b', label: 'Llama 3.1 70B' },
      { id: 'mistral-nemo', label: 'Mistral Nemo' },
    ],
    logo: '🟡',
      badgeKey: 'openSource',
      badgeVariant: 'green',
  },
]

const INTEGRATIONS = [
  { name: 'Google Drive', icon: '📂', status: 'connected'    },
  { name: 'Notion',       icon: '⬛', status: 'disconnected' },
  { name: 'Slack',        icon: '💬', status: 'disconnected' },
  { name: 'GitHub',       icon: '🐙', status: 'coming_soon'  },
]

export default function SettingsPage() {
  const { user, logout, updateProfile } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' })
  const [provider, setProvider] = useState(user?.aiProvider || 'anthropic')
  const [model, setModel] = useState(user?.aiModel || 'claude-3-5-sonnet')
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved
  const [aiSaveState, setAiSaveState] = useState('idle')
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
  const activeProvider = useMemo(
    () => AI_PROVIDERS.find(item => item.id === provider) || AI_PROVIDERS[0],
    [provider],
  )

  useEffect(() => {
    const nextProvider = AI_PROVIDERS.find(item => item.id === provider)
    if (!nextProvider) return

    const validModel = nextProvider.models.some(item => item.id === model)
    if (!validModel) setModel(nextProvider.defaultModel)
  }, [provider, model])

  const handleSaveAiSettings = async () => {
    setAiSaveState('saving')
    await new Promise(resolve => setTimeout(resolve, 500))
    updateProfile({ aiProvider: provider, aiModel: model })
    setAiSaveState('saved')
    setTimeout(() => setAiSaveState('idle'), 2500)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl mb-1 tracking-tight" style={{ color: 'var(--txt-primary)' }}>{t('settings.title')}</h1>
        <p className="text-sm" style={{ color: 'var(--txt-secondary)' }}>{t('settings.subtitle')}</p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Section icon={<User size={15} />} title={t('settings.sections.profile.title')} description={t('settings.sections.profile.description')}>
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
                <div className="mt-1"><Badge variant="blue" size="sm">{t('settings.sections.profile.plan', { plan: user?.plan || 'Free' })}</Badge></div>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>{t('settings.sections.profile.displayName')}</label>
                <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  className="input-base" placeholder={t('settings.sections.profile.namePlaceholder')} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>{t('settings.sections.profile.email')}</label>
                <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                  className="input-base" type="email" placeholder="you@company.com" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary" size="sm" onClick={handleSaveProfile} loading={saveState === 'saving'} disabled={saveState === 'saving'}>
                {saveState === 'saved' ? <><Check size={13} /> {t('settings.sections.profile.saved')}</> : t('settings.sections.profile.save')}
              </Button>
            </div>
          </div>
        </Section>
      </motion.div>

      {/* AI Provider */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section icon={<Cpu size={15} />} title={t('settings.sections.ai.title')} description={t('settings.sections.ai.description')}>
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
                    {p.badgeKey && <Badge variant={p.badgeVariant} size="sm">{t(`settings.providerBadges.${p.badgeKey}`)}</Badge>}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--txt-muted)' }}>{p.models[0].label}</p>
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

            <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>
                  {t('settings.sections.ai.model')}
                </label>
              <select
                value={model}
                onChange={event => setModel(event.target.value)}
                className="input-base py-2.5 text-sm cursor-pointer"
              >
                {activeProvider.models.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveAiSettings}
                loading={aiSaveState === 'saving'}
                disabled={aiSaveState === 'saving'}
              >
                {aiSaveState === 'saved' ? <><Check size={13} /> {t('settings.sections.ai.saved')}</> : t('settings.sections.ai.save')}
              </Button>
            </div>
          </div>
          <p className="text-xs mt-4" style={{ color: 'var(--txt-muted)' }}>
            {t('settings.sections.ai.footer')}
          </p>
        </Section>
      </motion.div>

      {/* API Keys */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Section icon={<Key size={15} />} title={t('settings.sections.apiKeys.title')} description={t('settings.sections.apiKeys.description')}>
          <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>
                 {t('settings.sections.apiKeys.keyLabel', { provider: AI_PROVIDERS.find(p => p.id === provider)?.name || t('settings.sections.ai.title') })}
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
                <Button variant="secondary" size="sm"><RefreshCw size={12} /> {t('settings.sections.apiKeys.rotate')}</Button>
              </div>
            </div>

            {/* DocuMind API
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
            */}
          </div>
        </Section>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Section icon={<Bell size={15} />} title={t('settings.sections.notifications.title')} description={t('settings.sections.notifications.description')}>
          <Toggle checked={notifs.processingComplete} onChange={v => setNotifs(n => ({ ...n, processingComplete: v }))}
            label={t('settings.sections.notifications.processingComplete.label')} description={t('settings.sections.notifications.processingComplete.description')} />
          <Toggle checked={notifs.weeklyDigest} onChange={v => setNotifs(n => ({ ...n, weeklyDigest: v }))}
            label={t('settings.sections.notifications.weeklyDigest.label')} description={t('settings.sections.notifications.weeklyDigest.description')} />
          <Toggle checked={notifs.aiSuggestions} onChange={v => setNotifs(n => ({ ...n, aiSuggestions: v }))}
            label={t('settings.sections.notifications.aiSuggestions.label')} description={t('settings.sections.notifications.aiSuggestions.description')} />
          <Toggle checked={notifs.teamUpdates} onChange={v => setNotifs(n => ({ ...n, teamUpdates: v }))}
            label={t('settings.sections.notifications.teamUpdates.label')} description={t('settings.sections.notifications.teamUpdates.description')} />
        </Section>
      </motion.div>

      {/* Integrations */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Section icon={<Globe size={15} />} title={t('settings.sections.integrations.title')} description={t('settings.sections.integrations.description')}>
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
                    {int.status === 'connected' ? t('settings.sections.integrations.connected') : int.status === 'coming_soon' ? t('settings.sections.integrations.comingSoon') : t('settings.sections.integrations.disconnected')}
                  </p>
                </div>
                {int.status !== 'coming_soon' && (
                  <Button variant={int.status === 'connected' ? 'secondary' : 'primary'} size="sm">
                    {int.status === 'connected' ? t('settings.sections.integrations.disconnect') : t('settings.sections.integrations.connect')}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Account */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Section icon={<Shield size={15} />} title={t('settings.sections.account.title')} description={t('settings.sections.account.description')}>
          <div className="space-y-3">
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-left"
              style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-faint)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-faint)'}
            >
              <Download size={14} style={{ color: 'var(--txt-secondary)' }} />
              <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--txt-primary)' }}>{t('settings.sections.account.exportTitle')}</p>
                  <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>{t('settings.sections.account.exportDescription')}</p>
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
                  <p className="text-sm font-medium" style={{ color: 'var(--accent-amber)' }}>{t('settings.sections.account.signOutTitle')}</p>
                  <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>{t('settings.sections.account.signOutDescription')}</p>
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
                  <p className="text-sm font-medium" style={{ color: 'var(--accent-red)' }}>{t('settings.sections.account.deleteTitle')}</p>
                  <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>{t('settings.sections.account.deleteDescription')}</p>
                </div>
              <ChevronRight size={13} style={{ color: 'var(--txt-muted)' }} className="ml-auto" />
            </button>
          </div>
        </Section>
      </motion.div>
    </div>
  )
}
