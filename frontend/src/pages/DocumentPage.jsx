import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, FileText, Check, Loader2, AlertCircle, Hash,
  Calendar, HardDrive, BookOpen, MessageSquare, StickyNote,
  Sparkles, ChevronRight, Link2
} from 'lucide-react'
import { mockDocuments, mockWorkspaces, mockNotes, mockSuggestedQuestions } from '../data/mockData'
import { Badge, Button } from '../components/ui/index'

const CHUNKS = [
  { id: 1, title: 'Executive Summary',        preview: 'This report analyzes the competitive landscape across 12 key players in the knowledge management market…',           page: 1  },
  { id: 2, title: 'Market Overview',          preview: 'The global knowledge management market is valued at $2.3B and projected to grow at 18% CAGR through 2028…',        page: 3  },
  { id: 3, title: 'Competitor Analysis',      preview: 'NotebookLM leads in document Q&A but lacks workspace organization. Notion AI excels at notes…',                    page: 8  },
  { id: 4, title: 'Feature Comparison Matrix',preview: 'Across the 12 competitors, only 3 offer some form of cross-document reasoning. None offer workspace-level chat…', page: 12 },
  { id: 5, title: 'User Sentiment Analysis',  preview: 'App store reviews reveal consistent frustration with the inability to "talk" to documents in context…',             page: 22 },
  { id: 6, title: 'Recommendations',          preview: 'Based on the analysis, the highest-value positioning focuses on the intersection of document intelligence…',        page: 31 },
]

export default function DocumentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const doc = mockDocuments.find(d => d.id === id) || mockDocuments[0]
  const workspace = mockWorkspaces.find(ws => ws.id === doc.workspaceId)
  const relatedNotes = mockNotes.filter(n => n.workspaceId === doc.workspaceId).slice(0, 2)

  const STATUS = {
    processed: { icon: <Check size={12} />,                              label: 'Processed',  variant: 'green',  desc: 'Document has been fully indexed and is ready for queries.' },
    processing: { icon: <Loader2 size={12} className="animate-spin" />, label: 'Processing', variant: 'yellow', desc: 'Currently extracting and indexing document content…' },
    error:      { icon: <AlertCircle size={12} />,                      label: 'Error',      variant: 'red',    desc: 'Failed to process. Please try re-uploading the document.' },
  }
  const s = STATUS[doc.status]

  const META = [
    { label: 'Workspace',      value: workspace?.name, link: true  },
    { label: 'File type',      value: doc.type.toUpperCase()        },
    { label: 'File size',      value: doc.size                      },
    { label: 'Pages',          value: doc.pages                     },
    { label: 'Indexed chunks', value: doc.chunks || '—'             },
    { label: 'Uploaded',       value: new Date(doc.uploadedAt).toLocaleDateString() },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <button onClick={() => navigate('/workspaces')} className="transition-colors hover:opacity-70" style={{ color: 'var(--txt-muted)' }}>Workspaces</button>
        <ChevronRight size={13} style={{ color: 'var(--txt-muted)' }} />
        <button onClick={() => navigate(`/workspaces/${workspace?.id}`)} className="transition-colors hover:opacity-70" style={{ color: 'var(--txt-muted)' }}>{workspace?.name}</button>
        <ChevronRight size={13} style={{ color: 'var(--txt-muted)' }} />
        <span className="truncate max-w-xs" style={{ color: 'var(--txt-secondary)' }}>{doc.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">

          {/* Header card */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glass rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }}>
                <FileText size={20} style={{ color: 'var(--accent)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-display font-bold text-xl leading-snug mb-2" style={{ color: 'var(--txt-primary)' }}>{doc.name}</h1>
                <div className="flex items-center flex-wrap gap-3 text-xs" style={{ color: 'var(--txt-secondary)' }}>
                  <span className="flex items-center gap-1.5"><HardDrive size={11} />{doc.size}</span>
                  <span className="flex items-center gap-1.5"><BookOpen size={11} />{doc.pages} pages</span>
                  <span className="flex items-center gap-1.5"><Hash size={11} />{doc.chunks} chunks</span>
                  <span className="flex items-center gap-1.5"><Calendar size={11} />{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Badge variant={s.variant}>{s.icon}<span className="ml-1">{s.label}</span></Badge>
            </div>

            {doc.status === 'processing' && (
              <div className="mt-4 p-3 rounded-xl"
                style={{ background: 'color-mix(in srgb, var(--accent-amber) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-amber) 20%, transparent)' }}>
                <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--accent-amber)' }}>
                  <Loader2 size={11} className="animate-spin" /> {s.desc}
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-strong)' }}>
                  <div className="h-full rounded-full animate-pulse" style={{ width: '45%', background: 'var(--accent-amber)' }} />
                </div>
              </div>
            )}

            {doc.status === 'error' && (
              <div className="mt-4 p-3 rounded-xl"
                style={{ background: 'color-mix(in srgb, var(--accent-red) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-red) 20%, transparent)' }}>
                <p className="text-xs" style={{ color: 'var(--accent-red)' }}>{s.desc}</p>
              </div>
            )}

            {doc.status === 'processed' && (
              <div className="mt-4 flex gap-3">
                <Button variant="primary" size="sm" onClick={() => navigate(`/workspaces/${doc.workspaceId}`)}>
                  <MessageSquare size={12} /> Ask about this doc
                </Button>
                <Button variant="secondary" size="sm"><Eye size={12} /> Preview</Button>
              </div>
            )}
          </motion.div>

          {/* Summary */}
          {doc.summary && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="card-glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} style={{ color: 'var(--accent-2)' }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>AI Summary</h3>
                <Badge variant="purple" size="sm">Generated</Badge>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>{doc.summary}</p>
            </motion.div>
          )}

          {/* Chunks */}
          {doc.status === 'processed' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
              className="card-glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--txt-primary)' }}>Document Sections</h3>
              <div className="space-y-1">
                {CHUNKS.map((chunk, i) => (
                  <motion.div key={chunk.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-3 p-3 rounded-xl cursor-pointer group transition-all"
                    style={{ border: '1px solid transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'var(--border-faint)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
                  >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5"
                      style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)', color: 'var(--accent)' }}>
                      {chunk.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium" style={{ color: 'var(--txt-primary)' }}>{chunk.title}</p>
                        <Badge variant="default" size="sm">p.{chunk.page}</Badge>
                      </div>
                      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--txt-secondary)' }}>{chunk.preview}</p>
                    </div>
                    <Link2 size={12} className="opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5" style={{ color: 'var(--txt-muted)' }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">

          {/* Suggested questions */}
          {doc.status === 'processed' && (
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="card-glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={13} style={{ color: 'var(--accent)' }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>Suggested Questions</h3>
              </div>
              <div className="space-y-2">
                {mockSuggestedQuestions.slice(0, 4).map((q, i) => (
                  <button key={i} onClick={() => navigate(`/workspaces/${doc.workspaceId}`)}
                    className="w-full text-left p-2.5 text-xs rounded-lg transition-all leading-relaxed"
                    style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-faint)', color: 'var(--txt-secondary)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--txt-primary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-secondary)'; e.currentTarget.style.borderColor = 'var(--border-faint)' }}
                  >{q}</button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Metadata */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className="card-glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--txt-primary)' }}>Details</h3>
            <div className="space-y-2.5">
              {META.map(({ label, value, link }) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--txt-muted)' }}>{label}</span>
                  {link
                    ? <button onClick={() => navigate(`/workspaces/${workspace?.id}`)}
                        className="font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--accent)' }}>{value}</button>
                    : <span className="font-medium" style={{ color: 'var(--txt-secondary)' }}>{value}</span>
                  }
                </div>
              ))}
            </div>
            {doc.tags?.length > 0 && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-faint)' }}>
                <p className="text-xs mb-2" style={{ color: 'var(--txt-muted)' }}>Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {doc.tags.map(t => <Badge key={t} variant="default" size="sm">{t}</Badge>)}
                </div>
              </div>
            )}
          </motion.div>

          {/* Related notes */}
          {relatedNotes.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="card-glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StickyNote size={13} style={{ color: 'var(--accent-amber)' }} />
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>Related Notes</h3>
                </div>
                <button onClick={() => navigate('/notes')} className="text-[11px] transition-opacity hover:opacity-70" style={{ color: 'var(--accent)' }}>View all</button>
              </div>
              <div className="space-y-2">
                {relatedNotes.map(note => (
                  <div key={note.id} className="p-2.5 rounded-lg cursor-pointer transition-all"
                    style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-faint)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-faint)'}
                  >
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--txt-primary)' }}>{note.title}</p>
                    <p className="text-[11px] line-clamp-2" style={{ color: 'var(--txt-muted)' }}>{note.preview}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
