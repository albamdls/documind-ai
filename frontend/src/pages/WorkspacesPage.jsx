import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FolderOpen, FileText, StickyNote, MoreHorizontal, Clock, Grid3X3, List, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useWorkspaces } from '../context/WorkspaceContext'
import { localizeWorkspace } from '../i18n/localizedData'
import { Badge, EmptyState, Button } from '../components/ui/index'
import CreateWorkspaceModal from '../components/workspaces/CreateWorkspaceModal'

function WorkspaceCard({ ws, onClick, view, locale }) {
  if (view === 'list') {
    return (
      <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        onClick={onClick}
        className="flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer group transition-all card-glass"
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-faint)'}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `${ws.color}18`, border: `1px solid ${ws.color}28` }}>{ws.emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--txt-primary)' }}>{ws.name}</p>
          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--txt-secondary)' }}>{ws.description}</p>
        </div>
        <div className="hidden md:flex items-center gap-5 text-xs shrink-0" style={{ color: 'var(--txt-muted)' }}>
          <span className="flex items-center gap-1.5"><FileText size={11} />{ws.documentsCount}</span>
          <span className="flex items-center gap-1.5"><StickyNote size={11} />{ws.notesCount}</span>
          <span className="flex items-center gap-1.5"><Clock size={11} />{new Date(ws.updatedAt).toLocaleDateString(locale)}</span>
        </div>
        <div className="flex gap-1.5">
          {ws.tags.slice(0, 2).map(t => <Badge key={t} variant="default">{t}</Badge>)}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }} onClick={onClick}
      className="card-glass rounded-2xl p-5 cursor-pointer group relative overflow-hidden transition-all"
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-faint)'}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${ws.color}, transparent)` }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: `${ws.color}18`, border: `1px solid ${ws.color}28` }}>{ws.emoji}</div>
        <button
          onClick={e => e.stopPropagation()}
          className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          style={{ background: 'var(--bg-hover)', color: 'var(--txt-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--txt-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-muted)'}
        ><MoreHorizontal size={14} /></button>
      </div>
      <h3 className="font-semibold mb-1.5" style={{ color: 'var(--txt-primary)' }}>{ws.name}</h3>
      <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--txt-secondary)' }}>{ws.description}</p>
      <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--txt-muted)' }}>
        <span className="flex items-center gap-1"><FileText size={11} />{ws.documentsCount}</span>
        <span className="flex items-center gap-1"><StickyNote size={11} />{ws.notesCount}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {ws.tags.slice(0, 2).map(t => <Badge key={t} variant="default" size="sm">{t}</Badge>)}
        </div>
        <span className="text-[11px]" style={{ color: 'var(--txt-muted)' }}>{new Date(ws.updatedAt).toLocaleDateString(locale)}</span>
      </div>
    </motion.div>
  )
}

export default function WorkspacesPage() {
  const navigate = useNavigate()
  const { workspaces, createWorkspace } = useWorkspaces()
  const { t, language, locale } = useLanguage()
  const [search, setSearch] = useState('')
  const [view, setView] = useState('grid')
  const [sort, setSort] = useState('recent')
  const [createOpen, setCreateOpen] = useState(false)

  const localizedWorkspaces = workspaces.map(workspace => localizeWorkspace(workspace, language))

  const filtered = localizedWorkspaces
    .filter(ws => ws.name.toLowerCase().includes(search.toLowerCase()) || ws.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'recent') return new Date(b.updatedAt) - new Date(a.updatedAt)
      if (sort === 'name')   return a.name.localeCompare(b.name)
      if (sort === 'docs')   return b.documentsCount - a.documentsCount
      return 0
    })

  const handleCreate = (form) => {
    createWorkspace(form)
  }

  const iconBtn = (active, onClick, children) => (
    <button onClick={onClick}
      className="p-1.5 rounded-md transition-all"
      style={{
        background: active ? 'var(--bg-surface)' : 'transparent',
        color: active ? 'var(--txt-primary)' : 'var(--txt-muted)',
        boxShadow: active ? 'var(--shadow-sm)' : 'none',
      }}>{children}</button>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-2xl mb-1 tracking-tight" style={{ color: 'var(--txt-primary)' }}>{t('workspacesPage.title')}</h1>
          <p className="text-sm" style={{ color: 'var(--txt-secondary)' }}>
            {t('workspacesPage.subtitle', { count: localizedWorkspaces.length, documents: localizedWorkspaces.reduce((a, b) => a + b.documentsCount, 0) })}
          </p>
        </motion.div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          <Plus size={14} /> {t('workspacesPage.newWorkspace')}
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--txt-muted)" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('workspacesPage.searchPlaceholder')} className="input-base pl-9 py-2 text-sm" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--txt-muted)' }}><X size={13} /></button>
          )}
        </div>

        <select value={sort} onChange={e => setSort(e.target.value)} className="input-base py-2 text-sm w-auto pr-8 cursor-pointer">
          <option value="recent">{t('workspacesPage.sortRecent')}</option>
          <option value="name">{t('workspacesPage.sortName')}</option>
          <option value="docs">{t('workspacesPage.sortDocs')}</option>
        </select>

        <div className="flex gap-0.5 p-1 rounded-lg" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-faint)' }}>
          {iconBtn(view === 'grid', () => setView('grid'), <Grid3X3 size={14} />)}
          {iconBtn(view === 'list', () => setView('list'), <List size={14} />)}
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs mb-4" style={{ color: 'var(--txt-muted)' }}>
          {t('workspacesPage.results', { count: filtered.length, suffix: filtered.length === 1 ? '' : 's', search })}
        </p>
      )}

      {/* Grid / List */}
      <AnimatePresence mode="wait">
        {filtered.length === 0
          ? <EmptyState
              icon={<FolderOpen size={28} />}
              title={search ? t('workspacesPage.noResultsTitle') : t('workspacesPage.emptyTitle')}
              description={search ? t('workspacesPage.noResultsDescription', { search }) : t('workspacesPage.emptyDescription')}
              action={<Button variant="primary" onClick={() => setCreateOpen(true)}><Plus size={14} /> {t('workspacesPage.createWorkspace')}</Button>}
            />
          : <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-2'}>
              {filtered.map((ws, i) => (
                <motion.div key={ws.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <WorkspaceCard ws={ws} onClick={() => navigate(`/workspaces/${ws.id}`)} view={view} locale={locale} />
                </motion.div>
              ))}
            </motion.div>
        }
      </AnimatePresence>

      <CreateWorkspaceModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
    </div>
  )
}
