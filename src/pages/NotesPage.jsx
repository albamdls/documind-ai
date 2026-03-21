import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, StickyNote, Sparkles, X, Trash2, FolderOpen, ChevronLeft, Save } from 'lucide-react'
import { mockNotes, mockWorkspaces } from '../data/mockData'
import { Badge, EmptyState, Button } from '../components/ui/index'

function NoteEditor({ note, onClose, onSave }) {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const hasChanges = title !== (note?.title || '') || content !== (note?.content || '')

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-base)' }}>
      {/* Editor topbar */}
      <div className="flex items-center gap-3 px-6 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border-faint)' }}>
        <button onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-secondary)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--txt-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-secondary)'}
        ><ChevronLeft size={14} /></button>

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Untitled note"
          className="flex-1 text-lg font-semibold bg-transparent outline-none"
          style={{ color: 'var(--txt-primary)', fontFamily: 'Syne, sans-serif' }}
        />

        <div className="flex items-center gap-2">
          {hasChanges && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-xs" style={{ color: 'var(--txt-muted)' }}>Unsaved changes</motion.span>
          )}
          <Button variant="primary" size="sm" onClick={() => onSave({ title, content })} disabled={!title.trim()}>
            <Save size={13} /> Save
          </Button>
        </div>
      </div>

      {/* Editor body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Start writing your note…&#10;&#10;Use this space to capture insights, ideas, meeting notes, or summaries."
            className="w-full bg-transparent outline-none leading-relaxed resize-none"
            style={{
              color: 'var(--txt-primary)',
              fontSize: '0.9375rem',
              minHeight: 'calc(100vh - 240px)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          />
        </div>
      </div>

      {/* Word count */}
      <div className="px-6 py-2 text-right shrink-0" style={{ borderTop: '1px solid var(--border-faint)' }}>
        <span className="text-[11px]" style={{ color: 'var(--txt-muted)' }}>
          {content.split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </div>
  )
}

function NoteCard({ note, onClick, onDelete, workspaceName }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -2 }}
      onClick={onClick}
      className="card-glass rounded-xl p-4 cursor-pointer group transition-all"
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-faint)'}
    >
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {note.aiGenerated && (
            <div className="w-4 h-4 rounded flex items-center justify-center shrink-0"
              style={{ background: 'color-mix(in srgb, var(--accent-2) 15%, transparent)' }}>
              <Sparkles size={9} style={{ color: 'var(--accent-2)' }} />
            </div>
          )}
          <h4 className="text-sm font-semibold leading-snug truncate" style={{ color: 'var(--txt-primary)' }}>{note.title}</h4>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDelete(note.id) }}
          className="w-6 h-6 rounded flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shrink-0"
          style={{ color: 'var(--txt-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-red)'; e.currentTarget.style.background = 'color-mix(in srgb, var(--accent-red) 10%, transparent)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-muted)'; e.currentTarget.style.background = 'transparent' }}
        ><Trash2 size={11} /></button>
      </div>

      <p className="text-xs leading-relaxed line-clamp-3 mb-3" style={{ color: 'var(--txt-secondary)' }}>{note.preview}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {workspaceName && (
            <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--txt-muted)' }}>
              <FolderOpen size={10} />{workspaceName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {note.tags.slice(0, 2).map(t => <Badge key={t} variant="default" size="sm">{t}</Badge>)}
          <span className="text-[10px] ml-1" style={{ color: 'var(--txt-muted)' }}>{new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function NotesPage() {
  const [notes, setNotes] = useState(mockNotes)
  const [search, setSearch] = useState('')
  const [wsFilter, setWsFilter] = useState('all')
  const [editing, setEditing] = useState(null)  // null = list, false = new, or note object
  const [creating, setCreating] = useState(false)

  const filtered = notes.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
    const matchWs = wsFilter === 'all' || n.workspaceId === wsFilter
    return matchSearch && matchWs
  })

  const wsForNote = wsId => mockWorkspaces.find(ws => ws.id === wsId)?.name

  const handleDelete = id => setNotes(n => n.filter(note => note.id !== id))

  const handleSave = (data) => {
    if (creating) {
      setNotes(prev => [{
        id: `n${Date.now()}`,
        workspaceId: wsFilter !== 'all' ? wsFilter : 'ws1',
        title: data.title || 'Untitled',
        content: data.content,
        preview: data.content.slice(0, 120) || data.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [], aiGenerated: false,
      }, ...prev])
    } else if (editing) {
      setNotes(prev => prev.map(n => n.id === editing.id
        ? { ...n, title: data.title, content: data.content, preview: data.content.slice(0, 120), updatedAt: new Date().toISOString() }
        : n
      ))
    }
    setCreating(false)
    setEditing(null)
  }

  if (creating || editing) {
    return (
      <div style={{ height: 'calc(100vh - 56px)' }}>
        <NoteEditor
          note={editing || null}
          onClose={() => { setCreating(false); setEditing(null) }}
          onSave={handleSave}
        />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-2xl mb-1 tracking-tight" style={{ color: 'var(--txt-primary)' }}>Notes</h1>
          <p className="text-sm" style={{ color: 'var(--txt-secondary)' }}>
            {notes.length} notes across {mockWorkspaces.length} workspaces
          </p>
        </motion.div>
        <Button variant="primary" onClick={() => setCreating(true)}>
          <Plus size={14} /> New Note
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--txt-muted)" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes…" className="input-base pl-9 py-2 text-sm" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt-muted)' }}><X size={13} /></button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[{ id: 'all', label: 'All', emoji: '' }, ...mockWorkspaces.slice(0, 4).map(ws => ({ id: ws.id, label: ws.name, emoji: ws.emoji }))].map(ws => (
            <button key={ws.id} onClick={() => setWsFilter(ws.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
              style={wsFilter === ws.id
                ? { background: 'color-mix(in srgb, var(--accent) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)', color: 'var(--accent)' }
                : { background: 'var(--bg-hover)', border: '1px solid var(--border-faint)', color: 'var(--txt-secondary)' }
              }
              onMouseEnter={e => wsFilter !== ws.id && (e.currentTarget.style.color = 'var(--txt-primary)')}
              onMouseLeave={e => wsFilter !== ws.id && (e.currentTarget.style.color = 'var(--txt-secondary)')}
            >
              {ws.emoji && <span>{ws.emoji}</span>}{ws.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0
          ? <EmptyState icon={<StickyNote size={28} />}
              title={search ? 'No notes found' : 'No notes yet'}
              description={search ? `No results for "${search}"` : 'Create your first note to capture knowledge and insights.'}
              action={<Button variant="primary" onClick={() => setCreating(true)}><Plus size={13} /> Create Note</Button>} />
          : <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((note, i) => (
                <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <NoteCard note={note} onClick={() => setEditing(note)} onDelete={handleDelete} workspaceName={wsForNote(note.workspaceId)} />
                </motion.div>
              ))}
            </motion.div>
        }
      </AnimatePresence>
    </div>
  )
}
