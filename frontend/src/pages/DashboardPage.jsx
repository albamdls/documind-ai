import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useWorkspaces } from '../context/WorkspaceContext'
import { mockStats } from '../data/mockData'
import { localizeWorkspace } from '../i18n/localizedData'
import { Skeleton } from '../components/ui'
import CreateWorkspaceModal from '../components/workspaces/CreateWorkspaceModal'

function getGreeting(hour, t) {
  if (hour < 12) return t('dashboard.greetings.morning')
  if (hour < 20) return t('dashboard.greetings.afternoon')
  return t('dashboard.greetings.evening')
}

function formatRelativeDate(dateString, locale) {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)))
  const days = Math.floor(hours / 24)

  if (locale === 'es-ES') {
    if (hours < 24) return `hace ${hours}h`
    if (days === 1) return 'ayer'
    if (days < 7) return `hace ${days}d`
  } else {
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return 'yesterday'
    if (days < 7) return `${days}d ago`
  }

  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
}

function StatCard({ label, value }) {
  return (
    <div className="dm-stat-card">
      <p className="text-[11px] mb-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
      <p className="text-[22px] leading-none font-medium" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
    </div>
  )
}

function WorkspaceCard({ workspace, onClick, label }) {
  return (
    <button type="button" onClick={onClick} className="dm-workspace-card text-left">
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center mb-2.5"
        style={{ background: `${workspace.color}20` }}
      >
        <span className="text-[16px] leading-none">{workspace.emoji}</span>
      </div>
      <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>{workspace.name}</p>
      <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
        {label}
      </p>
    </button>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { t, language, locale } = useLanguage()
  const { workspaces, createWorkspace } = useWorkspaces()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const firstName = user?.name?.split(' ')[0] || t('dashboard.userFallback')
  const greeting = getGreeting(new Date().getHours(), t)
  const recentWorkspaces = useMemo(
    () => workspaces.slice(0, 2).map(workspace => localizeWorkspace(workspace, language)),
    [language, workspaces],
  )

  const handleCreateWorkspace = (form) => {
    const workspace = createWorkspace(form)
    navigate(`/workspaces/${workspace.id}`)
  }

  return (
    <div className="p-5 md:p-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="max-w-5xl"
      >
        <p className="text-[18px] font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
          {greeting}, {firstName}
        </p>
        <p className="text-[13px] mb-5" style={{ color: 'var(--color-text-secondary)' }}>
          {t('dashboard.summary', { workspaces: workspaces.length, documents: mockStats.documents })}
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-6">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-[78px] rounded-xl" />
              ))
            : (
              <>
                <StatCard label={t('dashboard.documentsStat')} value={mockStats.documents} />
                <StatCard label={t('dashboard.notesStat')} value={mockStats.notes} />
                <StatCard label={t('dashboard.queriesStat')} value={mockStats.chatsThisWeek} />
              </>
            )}
        </div>

        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {t('dashboard.recentWorkspaces')}
          </p>
          <button
            type="button"
            onClick={() => navigate('/workspaces')}
            className="text-[12px] transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {t('dashboard.viewAll')}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-[122px] rounded-2xl" />
              ))
            : (
              <>
                {recentWorkspaces.map(workspace => (
                    <WorkspaceCard
                      key={workspace.id}
                      workspace={workspace}
                      onClick={() => navigate(`/workspaces/${workspace.id}`)}
                      label={t('dashboard.docsAndDate', {
                        count: workspace.documentsCount,
                        date: formatRelativeDate(workspace.updatedAt, locale),
                      })}
                    />
                  ))}

                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="dm-workspace-card dashed flex min-h-[118px] flex-col items-center justify-center gap-1.5 text-center"
                >
                  <Plus size={20} style={{ color: 'var(--color-text-tertiary)' }} />
                  <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>{t('dashboard.newWorkspace')}</p>
                </button>
              </>
            )}
        </div>
      </motion.section>

      <CreateWorkspaceModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateWorkspace}
      />
    </div>
  )
}
