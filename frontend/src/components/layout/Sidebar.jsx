import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, StickyNote, Settings, Plus } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useWorkspaces } from '../../context/WorkspaceContext'
import { localizeWorkspace } from '../../i18n/localizedData'
import CreateWorkspaceModal from '../workspaces/CreateWorkspaceModal'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language } = useLanguage()
  const { workspaces, createWorkspace } = useWorkspaces()
  const [createOpen, setCreateOpen] = useState(false)
  const generalNav = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('navigation.dashboard') },
    { to: '/notes', icon: StickyNote, label: t('navigation.notes') },
    { to: '/settings', icon: Settings, label: t('navigation.settings') },
  ]
  const recentWorkspaces = workspaces.slice(0, 4).map(workspace => localizeWorkspace(workspace, language))

  const handleCreateWorkspace = (form) => {
    const workspace = createWorkspace(form)
    navigate(`/workspaces/${workspace.id}`)
  }

  return (
    <aside className="dm-sidebar">
      <p className="dm-section-label">{t('navigation.general')}</p>
      <div className="flex flex-col gap-1">
        {generalNav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `dm-nav ${isActive ? 'active' : ''}`}>
            <Icon size={14} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <p className="dm-section-label mt-3">{t('navigation.workspaces')}</p>
      <div className="flex flex-col gap-1">
        {recentWorkspaces.map(workspace => {
          const active = location.pathname === `/workspaces/${workspace.id}`
          return (
            <button
              key={workspace.id}
              type="button"
              onClick={() => navigate(`/workspaces/${workspace.id}`)}
              className={`dm-nav text-left ${active ? 'active' : ''}`}
            >
              <span
                className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center text-[12px]"
                style={{ background: `${workspace.color}20` }}
              >
                {workspace.emoji}
              </span>
              <span className="truncate">{workspace.name}</span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setCreateOpen(true)}
        className="dm-nav mt-1"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        <Plus size={14} className="shrink-0" />
        <span>{t('navigation.newWorkspace')}</span>
      </button>

      <CreateWorkspaceModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateWorkspace}
      />
    </aside>
  )
}
