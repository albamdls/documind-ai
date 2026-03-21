import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Plus, Sparkles, MessageSquare, FileText, StickyNote,
  BookOpen, ArrowLeft, Check, AlertCircle, Loader2, Trash2,
  ChevronRight, Download, Eye
} from 'lucide-react'
import { mockWorkspaces, mockDocuments, mockNotes, mockSummaries } from '../data/mockData'
import { Badge, Tabs, EmptyState, Modal, Button } from '../components/ui/index'
import ChatPanel from '../components/chat/ChatPanel'
import FileUploader from '../components/documents/FileUploader'

function DocRow({ doc, onClick }) {
  const STATUS = {
    processed: { icon: <Check size={11} />,                               label: 'Processed',  variant: 'green'  },
    processing: { icon: <Loader2 size={11} className="animate-spin" />,   label: 'Processing', variant: 'yellow' },
    error:      { icon: <AlertCircle size={11} />,                        label: 'Error',      variant: 'red'    },
  }
  const TYPE_COLORS = { pdf: 'var(--accent-red)', docx: 'var(--accent)', md: 'var(--accent-green)', txt: 'var(--txt-muted)' }
  const s = STATUS[doc.status]
  const tc = TYPE_COLORS[doc.type] || 'var(--txt-muted)'

  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer group transition-all"
      style={{ border: '1px solid transparent' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'var(--border-faint)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
        style={{ background: `color-mix(in srgb, ${tc} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${tc} 22%, transparent)`, color: tc }}>
        {doc.type.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate transition-colors" style={{ color: 'var(--txt-primary)' }}>{doc.name}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--txt-muted)' }}>{doc.size} · {doc.pages} pages · {new Date(doc.uploadedAt).toLocaleDateString()}</p>
      </div>
      <Badge variant={s.variant}>{s.icon}<span className="ml-1">{s.label}</span></Badge>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
        {['Download', 'Delete'].map((action, i) => (
          <button key={action} onClick={e => e.stopPropagation()}
            className="w-6 h-6 rounded flex items-center justify-center transition-colors"
            style={{ color: 'var(--txt-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = i === 1 ? 'var(--accent-red)' : 'var(--txt-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-muted)'}
          >
            {i === 0 ? <Download size={11} /> : <Trash2 size={11} />}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function NoteCard({ note, onClick }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="card-glass rounded-xl p-4 cursor-pointer group transition-all"
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-faint)'}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold leading-snug flex-1 pr-2" style={{ color: 'var(--txt-primary)' }}>{note.title}</h4>
        {note.aiGenerated && (
          <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
            style={{ background: 'color-mix(in srgb, var(--accent-2) 15%, transparent)' }}>
            <Sparkles size={10} style={{ color: 'var(--accent-2)' }} />
          </div>
        )}
      </div>
      <p className="text-xs leading-relaxed line-clamp-3 mb-3" style={{ color: 'var(--txt-secondary)' }}>{note.preview}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {note.tags.slice(0, 2).map(t => <Badge key={t} variant="default" size="sm">{t}</Badge>)}
        </div>
        <span className="text-[10px]" style={{ color: 'var(--txt-muted)' }}>{new Date(note.updatedAt).toLocaleDateString()}</span>
      </div>
    </motion.div>
  )
}

function SummaryCard({ summary }) {
  const isWs = summary.type === 'workspace'
  const accentVar = isWs ? 'var(--accent-2)' : 'var(--accent)'

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="card-glass rounded-xl p-5 transition-all border-l-2"
      style={{ borderLeftColor: accentVar }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-faint)'}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={12} style={{ color: accentVar }} />
            <Badge variant={isWs ? 'purple' : 'blue'} size="sm">{isWs ? 'Workspace summary' : 'Document summary'}</Badge>
          </div>
          <h4 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>{summary.title}</h4>
        </div>
        <span className="text-[10px] shrink-0 ml-3" style={{ color: 'var(--txt-muted)' }}>{new Date(summary.generatedAt).toLocaleDateString()}</span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>{summary.content}</p>
    </motion.div>
  )
}

export default function WorkspaceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const workspace = mockWorkspaces.find(ws => ws.id === id) || mockWorkspaces[0]
  const baseDocs = mockDocuments.filter(d => d.workspaceId === workspace.id)
  const baseNotes = mockNotes.filter(n => n.workspaceId === workspace.id)
  const summaries = mockSummaries.filter(s => s.workspaceId === workspace.id)

  const [activeTab, setActiveTab] = useState('documents')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [allDocs, setAllDocs] = useState(baseDocs)
  const [allNotes, setAllNotes] = useState(baseNotes)

  const tabs = [
    { id: 'documents', label: 'Documents', icon: <FileText size={13} />,    count: allDocs.length  },
    { id: 'notes',     label: 'Notes',     icon: <StickyNote size={13} />,  count: allNotes.length },
    { id: 'summaries', label: 'Summaries', icon: <BookOpen size={13} />,    count: summaries.length },
    { id: 'chat',      label: 'AI Chat',   icon: <MessageSquare size={13} />               },
  ]

  const handleCreateNote = () => {
    if (!newNote.title.trim()) return
    setAllNotes(prev => [{
      id: `n${Date.now()}`, workspaceId: workspace.id,
      title: newNote.title, content: newNote.content, preview: newNote.content.slice(0, 120),
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: [], aiGenerated: false,
    }, ...prev])
    setNewNote({ title: '', content: '' })
    setNoteOpen(false)
    setActiveTab('notes')
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>

      {/* Workspace header */}
      <div className="px-6 py-5 shrink-0 backdrop-blur-sm"
        style={{ borderBottom: '1px solid var(--border-faint)', background: 'color-mix(in srgb, var(--bg-base) 80%, transparent)' }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/workspaces')}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--txt-primary)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-secondary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
            ><ArrowLeft size={14} /></button>

            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `${workspace.color}18`, border: `1px solid ${workspace.color}28` }}>
              {workspace.emoji}
            </div>

            <div>
              <h1 className="font-display font-bold text-xl leading-tight tracking-tight" style={{ color: 'var(--txt-primary)' }}>
                {workspace.name}
              </h1>
              <p className="text-xs mt-0.5 max-w-md" style={{ color: 'var(--txt-secondary)' }}>{workspace.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setNoteOpen(true)}><Plus size={13} /> Note</Button>
            <Button variant="secondary" size="sm" onClick={() => setUploadOpen(true)}><Upload size={13} /> Upload</Button>
            <Button variant="primary"   size="sm" onClick={() => setActiveTab('chat')}><MessageSquare size={13} /> Chat</Button>
          </div>
        </div>

        {/* Mini stats */}
        <div className="flex items-center gap-4 mt-4 ml-[4.75rem]">
          {[
            { label: 'Documents', value: allDocs.length,   colorVar: 'var(--accent)'       },
            { label: 'Notes',     value: allNotes.length,  colorVar: 'var(--accent-amber)'  },
            { label: 'Summaries', value: summaries.length, colorVar: 'var(--accent-2)'      },
            { label: 'Updated',   value: new Date(workspace.updatedAt).toLocaleDateString(), colorVar: 'var(--accent-green)' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: stat.colorVar }} />
              <span className="text-xs" style={{ color: 'var(--txt-muted)' }}>{stat.label}:</span>
              <span className="text-xs font-semibold" style={{ color: stat.colorVar }}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab bar */}
        <div className="px-6 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border-faint)' }}>
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {activeTab === 'documents' && (
              <motion.div key="docs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>{allDocs.length} Documents</h3>
                  <Button variant="secondary" size="sm" onClick={() => setUploadOpen(true)}><Upload size={12} /> Upload</Button>
                </div>
                {allDocs.length === 0
                  ? <EmptyState icon={<FileText size={28} />} title="No documents yet"
                      description="Upload your first document to start chatting with your knowledge."
                      action={<Button variant="primary" onClick={() => setUploadOpen(true)}><Upload size={13} /> Upload Document</Button>} />
                  : <div className="space-y-1">
                      {allDocs.map(doc => <DocRow key={doc.id} doc={doc} onClick={() => navigate(`/documents/${doc.id}`)} />)}
                    </div>
                }
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div key="notes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>{allNotes.length} Notes</h3>
                  <Button variant="secondary" size="sm" onClick={() => setNoteOpen(true)}><Plus size={12} /> New Note</Button>
                </div>
                {allNotes.length === 0
                  ? <EmptyState icon={<StickyNote size={28} />} title="No notes yet"
                      description="Capture insights, summaries, or any thoughts related to this workspace."
                      action={<Button variant="primary" onClick={() => setNoteOpen(true)}><Plus size={13} /> Create Note</Button>} />
                  : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {allNotes.map(note => <NoteCard key={note.id} note={note} onClick={() => navigate('/notes')} />)}
                    </div>
                }
              </motion.div>
            )}

            {activeTab === 'summaries' && (
              <motion.div key="summaries" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>AI-Generated Summaries</h3>
                  <Button variant="primary" size="sm"><Sparkles size={12} /> Generate Summary</Button>
                </div>
                {summaries.length === 0
                  ? <EmptyState icon={<BookOpen size={28} />} title="No summaries yet"
                      description="Generate an AI summary of this workspace or individual documents."
                      action={<Button variant="primary"><Sparkles size={13} /> Generate Summary</Button>} />
                  : <div className="space-y-4">
                      {summaries.map(s => <SummaryCard key={s.id} summary={s} />)}
                    </div>
                }
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ height: 'calc(100vh - 260px)' }}>
                <ChatPanel />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Upload modal */}
      <Modal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Documents" size="md">
        <FileUploader onUpload={files => {
          const newDocs = files.map(f => ({
            id: `doc${Date.now()}-${f.name}`, workspaceId: workspace.id, name: f.name,
            type: f.name.split('.').pop().toLowerCase(),
            size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
            pages: Math.floor(Math.random() * 30) + 5, status: 'processing',
            uploadedAt: new Date().toISOString(), summary: null, chunks: 0, tags: [],
          }))
          setAllDocs(d => [...newDocs, ...d])
        }} />
        <div className="flex justify-end mt-4">
          <Button variant="secondary" onClick={() => setUploadOpen(false)}>Done</Button>
        </div>
      </Modal>

      {/* New note modal */}
      <Modal isOpen={noteOpen} onClose={() => setNoteOpen(false)} title="Create Note" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>Title</label>
            <input value={newNote.title} onChange={e => setNewNote(n => ({ ...n, title: e.target.value }))}
              placeholder="Note title…" className="input-base" autoFocus
              onKeyDown={e => e.key === 'Enter' && handleCreateNote()} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>Content</label>
            <textarea value={newNote.content} onChange={e => setNewNote(n => ({ ...n, content: e.target.value }))}
              placeholder="Start writing…" rows={8} className="input-base resize-none" />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setNoteOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={handleCreateNote} className="flex-1" disabled={!newNote.title.trim()}>
              <StickyNote size={13} /> Save Note
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
