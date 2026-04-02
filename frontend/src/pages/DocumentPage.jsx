import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
   ArrowLeft, FileText, Check, Loader2, AlertCircle, Hash,
   Calendar, HardDrive, BookOpen, MessageSquare, StickyNote,
   Sparkles, ChevronRight, Link2, Eye
 } from 'lucide-react'
import { mockDocuments, mockNotes } from '../data/mockData'
import { useLanguage } from '../context/LanguageContext'
import { useWorkspaces } from '../context/WorkspaceContext'
import { localizeDocument, localizeNote, localizeWorkspace } from '../i18n/localizedData'
import { Badge, Button } from '../components/ui/index'

export default function DocumentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, language, locale } = useLanguage()
  const { workspaces } = useWorkspaces()
  const doc = localizeDocument(mockDocuments.find(d => d.id === id) || mockDocuments[0], language)
  const workspace = localizeWorkspace(workspaces.find(ws => ws.id === doc.workspaceId) || workspaces[0], language)
  const relatedNotes = mockNotes.filter(n => n.workspaceId === doc.workspaceId).slice(0, 2).map(note => localizeNote(note, language))
  const chunks = t('documentPage.chunks')
  const suggestedQuestions = t('chat.suggestedQuestions')

  const STATUS = {
    processed: { icon: <Check size={12} />, label: t('documentPage.status.processed.label'), variant: 'green', desc: t('documentPage.status.processed.desc') },
    processing: { icon: <Loader2 size={12} className="animate-spin" />, label: t('documentPage.status.processing.label'), variant: 'yellow', desc: t('documentPage.status.processing.desc') },
    error: { icon: <AlertCircle size={12} />, label: t('documentPage.status.error.label'), variant: 'red', desc: t('documentPage.status.error.desc') },
  }
  const s = STATUS[doc.status]

  const META = [
    { label: t('documentPage.meta.workspace'), value: workspace?.name, link: true },
    { label: t('documentPage.meta.fileType'), value: doc.type.toUpperCase() },
    { label: t('documentPage.meta.fileSize'), value: doc.size },
    { label: t('documentPage.meta.pages'), value: doc.pages },
    { label: t('documentPage.meta.chunks'), value: doc.chunks || '—' },
    { label: t('documentPage.meta.uploaded'), value: new Date(doc.uploadedAt).toLocaleDateString(locale) },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <button onClick={() => navigate('/workspaces')} className="transition-colors hover:opacity-70" style={{ color: 'var(--txt-muted)' }}>{t('documentPage.breadcrumbWorkspaces')}</button>
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
                  <span className="flex items-center gap-1.5"><BookOpen size={11} />{t('documentPage.pageSummary', { pages: doc.pages })}</span>
                  <span className="flex items-center gap-1.5"><Hash size={11} />{t('documentPage.chunkSummary', { count: doc.chunks })}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={11} />{new Date(doc.uploadedAt).toLocaleDateString(locale)}</span>
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
                  <MessageSquare size={12} /> {t('documentPage.askDoc')}
                </Button>
                <Button variant="secondary" size="sm"><Eye size={12} /> {t('documentPage.preview')}</Button>
              </div>
            )}
          </motion.div>

          {/* Summary */}
          {doc.summary && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="card-glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} style={{ color: 'var(--accent-2)' }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>{t('documentPage.aiSummary')}</h3>
                <Badge variant="purple" size="sm">{t('documentPage.generated')}</Badge>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>{doc.summary}</p>
            </motion.div>
          )}

          {/* Chunks */}
          {doc.status === 'processed' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
              className="card-glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--txt-primary)' }}>{t('documentPage.sections')}</h3>
              <div className="space-y-1">
                {chunks.map((chunk, i) => (
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
                <h3 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>{t('documentPage.suggestedQuestions')}</h3>
              </div>
              <div className="space-y-2">
                {suggestedQuestions.slice(0, 4).map((q, i) => (
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
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--txt-primary)' }}>{t('documentPage.details')}</h3>
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
                <p className="text-xs mb-2" style={{ color: 'var(--txt-muted)' }}>{t('documentPage.tags')}</p>
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
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>{t('documentPage.relatedNotes')}</h3>
                </div>
                <button onClick={() => navigate('/notes')} className="text-[11px] transition-opacity hover:opacity-70" style={{ color: 'var(--accent)' }}>{t('documentPage.viewAll')}</button>
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
