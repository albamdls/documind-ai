import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, FolderOpen, FileText, StickyNote, MoreHorizontal, Clock, Grid3X3, List, Sparkles, X } from 'lucide-react'
import { mockWorkspaces } from '../data/mockData'
import { Badge, EmptyState, Modal, Button } from '../components/ui/index'

function WorkspaceCard({ ws, onClick, view }) {
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
          <span className="flex items-center gap-1.5"><Clock size={11} />{new Date(ws.updatedAt).toLocaleDateString()}</span>
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
        <span className="text-[11px]" style={{ color: 'var(--txt-muted)' }}>{new Date(ws.updatedAt).toLocaleDateString()}</span>
      </div>
    </motion.div>
  )
}

function CreateWorkspaceModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState({ name: '', description: '', emoji: '📁', color: '#4f8ef7' })
  const EMOJIS = ['📁','🔬','⚖️','⚙️','📣','📊','🎓','💡','🚀','📝','🔐','🌐','🧪','📱','🎯']
  const COLORS = ['#4f8ef7','#10b981','#8b5cf6','#f59e0b','#22d3ee','#ef4444','#ec4899','#14b8a6']

  const handleCreate = () => {
    if (!form.name.trim()) return
    onCreate(form)
    onClose()
    setForm({ name: '', description: '', emoji: '📁', color: '#4f8ef7' })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Workspace">
      <div className="space-y-5">
        {/* Icon & Color picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--txt-muted)' }}>
            Icon &amp; Color
          </label>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all"
              style={{ background: `${form.color}18`, border: `1px solid ${form.color}35` }}>
              {form.emoji}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all"
                    style={{
                      background: form.emoji === e ? 'var(--border-strong)' : 'var(--bg-hover)',
                      border: `1px solid ${form.emoji === e ? 'var(--border-strong)' : 'var(--border-faint)'}`,
                      outline: form.emoji === e ? `2px solid var(--accent)` : 'none',
                      outlineOffset: 1,
                    }}>{e}</button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                    className="w-5 h-5 rounded-full transition-all"
                    style={{
                      background: c,
                      outline: form.color === c ? `2px solid var(--txt-primary)` : 'none',
                      outlineOffset: 2,
                      transform: form.color === c ? 'scale(1.2)' : 'scale(1)',
                    }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>Workspace Name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Product Research" className="input-base" autoFocus
            onKeyDown={e => e.key === 'Enter' && handleCreate()} />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>Description <span style={{ color: 'var(--txt-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="What's this workspace for?" rows={3} className="input-base resize-none" />
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" onClick={handleCreate} className="flex-1" disabled={!form.name.trim()}>
            <Sparkles size={13} /> Create Workspace
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default function WorkspacesPage() {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState(mockWorkspaces)
  const [search, setSearch] = useState('')
  const [view, setView] = useState('grid')
  const [sort, setSort] = useState('recent')
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = workspaces
    .filter(ws => ws.name.toLowerCase().includes(search.toLowerCase()) || ws.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'recent') return new Date(b.updatedAt) - new Date(a.updatedAt)
      if (sort === 'name')   return a.name.localeCompare(b.name)
      if (sort === 'docs')   return b.documentsCount - a.documentsCount
      return 0
    })

  const handleCreate = (form) => {
    setWorkspaces(ws => [{
      id: `ws${Date.now()}`, name: form.name, description: form.description,
      color: form.color, emoji: form.emoji, documentsCount: 0, notesCount: 0,
      updatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), tags: [],
    }, ...ws])
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
          <h1 className="font-display font-bold text-2xl mb-1 tracking-tight" style={{ color: 'var(--txt-primary)' }}>Workspaces</h1>
          <p className="text-sm" style={{ color: 'var(--txt-secondary)' }}>
            {workspaces.length} knowledge spaces · {workspaces.reduce((a, b) => a + b.documentsCount, 0)} documents total
          </p>
        </motion.div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          <Plus size={14} /> New Workspace
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--txt-muted)" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workspaces..." className="input-base pl-9 py-2 text-sm" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--txt-muted)' }}><X size={13} /></button>
          )}
        </div>

        <select value={sort} onChange={e => setSort(e.target.value)} className="input-base py-2 text-sm w-auto pr-8 cursor-pointer">
          <option value="recent">Recently updated</option>
          <option value="name">Name A–Z</option>
          <option value="docs">Most documents</option>
        </select>

        <div className="flex gap-0.5 p-1 rounded-lg" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-faint)' }}>
          {iconBtn(view === 'grid', () => setView('grid'), <Grid3X3 size={14} />)}
          {iconBtn(view === 'list', () => setView('list'), <List size={14} />)}
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs mb-4" style={{ color: 'var(--txt-muted)' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
        </p>
      )}

      {/* Grid / List */}
      <AnimatePresence mode="wait">
        {filtered.length === 0
          ? <EmptyState
              icon={<FolderOpen size={28} />}
              title={search ? 'No workspaces found' : 'No workspaces yet'}
              description={search ? `No results for "${search}". Try a different search.` : 'Create your first workspace to start organizing your knowledge.'}
              action={<Button variant="primary" onClick={() => setCreateOpen(true)}><Plus size={14} /> Create Workspace</Button>}
            />
          : <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-2'}>
              {filtered.map((ws, i) => (
                <motion.div key={ws.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <WorkspaceCard ws={ws} onClick={() => navigate(`/workspaces/${ws.id}`)} view={view} />
                </motion.div>
              ))}
            </motion.div>
        }
      </AnimatePresence>

      <CreateWorkspaceModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
    </div>
  )
}
