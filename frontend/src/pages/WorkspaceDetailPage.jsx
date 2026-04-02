import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, Check, FileText, Loader2, Plus, Sparkles, Trash2, Upload } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockDocuments, mockNotes, mockSummaries } from '../data/mockData'
import { useLanguage } from '../context/LanguageContext'
import { useWorkspaces } from '../context/WorkspaceContext'
import { localizeDocument, localizeNote, localizeSummary, localizeWorkspace } from '../i18n/localizedData'
import { Modal } from '../components/ui'
import ChatPanel from '../components/chat/ChatPanel'
import FileUploader from '../components/documents/FileUploader'

const NOTE_TAG_COLORS = [
  { background: '#EEEDFE', color: '#3C3489' },
  { background: '#E1F5EE', color: '#085041' },
  { background: '#FAEEDA', color: '#633806' },
  { background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' },
]

function getSavedMessagesStorageKey(workspaceId) {
  return `documind:saved-messages:${workspaceId}`
}

function readSavedMessages(workspaceId) {
  if (typeof window === 'undefined') return []

  try {
    return JSON.parse(window.localStorage.getItem(getSavedMessagesStorageKey(workspaceId)) || '[]')
  } catch {
    return []
  }
}

function createDocumentSource(doc, index = 0) {
  const fallbackPage = Math.min(doc.pages || 1, 3 + (index * 4))

  return {
    docId: doc.id,
    docName: doc.name,
    page: fallbackPage,
  }
}

function createInitialChatMessages(workspace, docs, t) {
  const processedDocs = docs.filter(doc => doc.status === 'processed')

  if (processedDocs.length === 0) {
    return [
        {
          id: `m-${workspace.id}-welcome`,
          role: 'assistant',
          content: t('workspaceDetail.noProcessedDocs'),
          timestamp: new Date().toISOString(),
          sources: [],
      },
    ]
  }

  return [
    {
      id: `m-${workspace.id}-user`,
      role: 'user',
      content: t('workspaceDetail.initialQuestion', { workspace: workspace.name }),
      timestamp: new Date().toISOString(),
    },
    {
      id: `m-${workspace.id}-assistant`,
      role: 'assistant',
      content: t('workspaceDetail.initialAnswer', {
        primary: processedDocs[0].name,
        secondary: processedDocs[1] ? t('workspaceDetail.initialSecondary', { name: processedDocs[1].name }) : '',
      }),
      timestamp: new Date().toISOString(),
      sources: processedDocs.slice(0, 2).map(createDocumentSource),
    },
  ]
}

function getRelativeTime(dateString, language, locale, t) {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)))
  const days = Math.floor(hours / 24)

  if (hours < 24) return t('workspaceDetail.relative.hours', { count: hours })
  if (days === 1) return t('workspaceDetail.relative.yesterday')
  if (days < 7) return t('workspaceDetail.relative.days', { count: days })
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
}

function getDocIconColor(type) {
  if (type === 'pdf') return '#BA7517'
  if (type === 'docx') return '#2563eb'
  if (type === 'md') return '#059669'
  return 'var(--color-text-secondary)'
}

function getStatusMeta(status, t) {
  if (status === 'processed') {
    return {
      label: t('workspaceDetail.documentStatus.processed'),
      background: 'var(--color-background-success)',
      color: 'var(--color-text-success)',
      icon: <Check size={11} />,
    }
  }

  if (status === 'processing') {
    return {
      label: t('workspaceDetail.documentStatus.processing'),
      background: 'var(--color-background-warning)',
      color: 'var(--color-text-warning)',
      icon: <Loader2 size={11} className="animate-spin" />,
    }
  }

  return {
    label: t('workspaceDetail.documentStatus.error'),
    background: 'rgba(239,68,68,0.12)',
    color: 'var(--accent-red)',
    icon: <AlertCircle size={11} />,
  }
}

function DocumentRow({ doc, onClick, t, language, locale }) {
  const status = getStatusMeta(doc.status, t)
  const iconColor = getDocIconColor(doc.type)

  return (
    <button type="button" onClick={onClick} className="dm-doc-row w-full text-left">
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
        style={{ background: '#FAEEDA' }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 2h7l3 3v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke={iconColor} strokeWidth="1.2" />
          <path d="M10 2v3h3" stroke={iconColor} strokeWidth="1.2" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium m-0 truncate" style={{ color: 'var(--color-text-primary)' }}>
          {doc.name}
        </p>
        <p className="text-[11px] m-0" style={{ color: 'var(--color-text-tertiary)' }}>
          {doc.size} · {doc.status === 'processing' ? t('workspaceDetail.documentProcessing') : t('workspaceDetail.documentUploaded', { time: getRelativeTime(doc.uploadedAt, language, locale, t) })}
        </p>
      </div>

      <span className="dm-status-pill inline-flex items-center gap-1.5" style={{ background: status.background, color: status.color }}>
        {status.icon}
        {status.label}
      </span>
    </button>
  )
}

function NoteCard({ note, onClick, t, language, locale }) {
  return (
    <button type="button" onClick={onClick} className="dm-note-card w-full text-left">
      <div className="flex justify-between items-start gap-3 mb-2">
        <p className="text-[13px] font-medium m-0" style={{ color: 'var(--color-text-primary)' }}>
          {note.title}
        </p>
        <span className="text-[10px] whitespace-nowrap" style={{ color: 'var(--color-text-tertiary)' }}>
          {getRelativeTime(note.updatedAt, language, locale, t)}
        </span>
      </div>

      <p className="text-[12px] leading-5 m-0 mb-2.5" style={{ color: 'var(--color-text-secondary)' }}>
        {note.preview || note.content.slice(0, 120)}
      </p>

      <div className="flex flex-wrap items-center gap-y-1">
        {note.tags.slice(0, 2).map((tag, index) => {
          const colors = NOTE_TAG_COLORS[index % NOTE_TAG_COLORS.length]
          return (
            <span key={tag} className="dm-note-tag" style={{ background: colors.background, color: colors.color }}>
              {tag}
            </span>
          )
        })}

        {note.aiGenerated && (
            <span className="text-[10px] inline-flex items-center gap-1 ml-1" style={{ color: 'var(--color-text-tertiary)' }}>
              <Sparkles size={10} />
              {t('workspaceDetail.generatedWithAI')}
            </span>
          )}
      </div>
    </button>
  )
}

function SummaryCard({ summary, t, language, locale }) {
  return (
    <div className="dm-note-card cursor-default">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: '#EEEDFE', color: '#3C3489' }}>
            <Sparkles size={13} />
          </div>
          <div>
            <p className="text-[13px] font-medium m-0" style={{ color: 'var(--color-text-primary)' }}>
              {summary.title}
            </p>
            <p className="text-[11px] m-0" style={{ color: 'var(--color-text-tertiary)' }}>
              {summary.type === 'workspace' ? t('workspaceDetail.workspaceSummary') : t('workspaceDetail.documentSummary')}
            </p>
          </div>
        </div>
        <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
          {getRelativeTime(summary.generatedAt, language, locale, t)}
        </span>
      </div>

      <p className="text-[12px] leading-5 m-0" style={{ color: 'var(--color-text-secondary)' }}>
        {summary.content}
      </p>
    </div>
  )
}

function SavedMessageCard({ message, onRemove, t, language, locale }) {
  return (
    <div className="dm-note-card cursor-default">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: '#E7F0FF', color: '#1D4ED8' }}>
            <FileText size={13} />
          </div>
          <div>
            <p className="text-[13px] font-medium m-0" style={{ color: 'var(--color-text-primary)' }}>
              {message.role === 'assistant' ? t('workspaceDetail.savedAssistant') : t('workspaceDetail.savedUser')}
            </p>
            <p className="text-[11px] m-0" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('workspaceDetail.savedAt', { time: getRelativeTime(message.savedAt, language, locale, t) })}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(message.id)}
          className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0"
          style={{
            borderColor: 'var(--color-border-tertiary)',
            color: 'var(--color-text-secondary)',
            background: 'var(--color-background-primary)',
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <p className="text-[12px] leading-6 whitespace-pre-wrap m-0 mb-3" style={{ color: 'var(--color-text-secondary)' }}>
        {message.content}
      </p>

      {message.sources?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {message.sources.map((source, index) => (
            <span key={`${message.id}-${source.docName}-${index}`} className="source-chip">
              <FileText size={10} />
              {source.docName} · p.{source.page}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function WorkspaceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, language, locale } = useLanguage()
  const { workspaces } = useWorkspaces()
  const workspace = localizeWorkspace(workspaces.find(item => item.id === id) || workspaces[0], language)
  const workspaceDocuments = useMemo(() => mockDocuments.filter(doc => doc.workspaceId === workspace.id).map(doc => localizeDocument(doc, language)), [workspace.id, language])
  const workspaceNotes = useMemo(() => mockNotes.filter(note => note.workspaceId === workspace.id).map(note => localizeNote(note, language)), [workspace.id, language])
  const workspaceSummaries = useMemo(() => mockSummaries.filter(summary => summary.workspaceId === workspace.id).map(summary => localizeSummary(summary, language)), [workspace.id, language])

  const [activeTab, setActiveTab] = useState('documents')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [documents, setDocuments] = useState(() => workspaceDocuments)
  const [notes, setNotes] = useState(() => workspaceNotes)
  const [summaries, setSummaries] = useState(() => workspaceSummaries)
  const [chatMessages, setChatMessages] = useState(() => createInitialChatMessages(workspace, workspaceDocuments, t))
  const [selectedDocumentIds, setSelectedDocumentIds] = useState(() => workspaceDocuments.filter(doc => doc.status === 'processed').map(doc => doc.id))
  const [savedMessages, setSavedMessages] = useState(() => readSavedMessages(workspace.id))

  const tabs = useMemo(() => ([
    { id: 'documents', label: t('workspaceDetail.tabs.documents') },
    { id: 'chat', label: t('workspaceDetail.tabs.chat') },
    { id: 'saved', label: t('workspaceDetail.tabs.saved') },
    { id: 'notes', label: t('workspaceDetail.tabs.notes') },
    { id: 'summaries', label: t('workspaceDetail.tabs.summaries') },
  ]), [t])
  const selectableDocumentIds = useMemo(
    () => documents.filter(doc => doc.status === 'processed').map(doc => doc.id),
    [documents],
  )

  useEffect(() => {
    setDocuments(workspaceDocuments)
    setNotes(workspaceNotes)
    setSummaries(workspaceSummaries)
    setChatMessages(createInitialChatMessages(workspace, workspaceDocuments, t))
    setSelectedDocumentIds(workspaceDocuments.filter(doc => doc.status === 'processed').map(doc => doc.id))
    setSavedMessages(readSavedMessages(workspace.id))
    setSelectedNote(null)
    setNewNote({ title: '', content: '' })
  }, [workspace, workspaceDocuments, workspaceNotes, workspaceSummaries, t])

  useEffect(() => {
    setSelectedDocumentIds(current => {
      const availableIds = new Set(selectableDocumentIds)
      const nextSelected = current.filter(docId => availableIds.has(docId))

      if (nextSelected.length === 0 && selectableDocumentIds.length > 0) {
        return selectableDocumentIds
      }

      return nextSelected
    })
  }, [selectableDocumentIds])

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(getSavedMessagesStorageKey(workspace.id), JSON.stringify(savedMessages))
  }, [workspace.id, savedMessages])

  const handleCreateNote = () => {
    if (!newNote.title.trim()) return

    const note = {
      id: `n${Date.now()}`,
      workspaceId: workspace.id,
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      preview: newNote.content.trim() || t('workspaceDetail.noteWithoutContent'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      aiGenerated: false,
    }

    setNotes(current => [note, ...current])
    setNewNote({ title: '', content: '' })
    setNoteOpen(false)
    setActiveTab('notes')
  }

  const handleGenerateSummary = () => {
    const summary = {
      id: `s${Date.now()}`,
      workspaceId: workspace.id,
      documentId: null,
      title: t('workspaceDetail.createSummaryTitle', { workspace: workspace.name }),
      content: t('workspaceDetail.createSummaryContent', {
        documents: documents.length,
        notes: notes.length,
        topics: workspace.tags?.join(', ') || t('workspaceDetail.topicsFallback'),
      }),
      generatedAt: new Date().toISOString(),
      type: 'workspace',
    }

    setSummaries(current => [summary, ...current])
    setActiveTab('summaries')
  }

  const handleToggleDocumentSelection = (documentId) => {
    if (!selectableDocumentIds.includes(documentId)) return

    setSelectedDocumentIds(current => (
      current.includes(documentId)
        ? current.filter(id => id !== documentId)
        : [...current, documentId]
    ))
  }

  const handleToggleAllDocuments = () => {
    setSelectedDocumentIds(current => (
      current.length === selectableDocumentIds.length ? [] : selectableDocumentIds
    ))
  }

  const handleToggleSavedMessage = (message) => {
    setSavedMessages(current => {
      const alreadySaved = current.some(item => item.messageId === message.id)

      if (alreadySaved) {
        return current.filter(item => item.messageId !== message.id)
      }

      return [
        {
          id: `saved-${Date.now()}`,
          messageId: message.id,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp,
          sources: message.sources || [],
          savedAt: new Date().toISOString(),
        },
        ...current,
      ]
    })
  }

  const handleRemoveSavedMessage = (savedMessageId) => {
    setSavedMessages(current => current.filter(item => item.id !== savedMessageId))
  }

  const headerLeft = activeTab === 'documents'
    ? (
      <div className="flex items-center gap-2">
        <div className="dm-logo-mark" />
        <span className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>DocuMind</span>
        <span className="text-[13px]" style={{ color: 'var(--color-text-tertiary)' }}>/</span>
        <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{workspace.name}</span>
      </div>
    )
    : (
      <div className="flex items-center gap-2">
        <span className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>{workspace.name}</span>
        <span className="text-[13px]" style={{ color: 'var(--color-text-tertiary)' }}>/</span>
        <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{tabs.find(tab => tab.id === activeTab)?.label}</span>
      </div>
    )

  return (
    <div className="p-5 md:p-6 flex-1 min-h-0 flex">
      <div className="w-full flex flex-1 min-h-0">
        <div className="dm-workspace-shell flex-1 flex flex-col min-h-0">
          <div className="dm-workspace-header">
            <div className="min-w-0">{headerLeft}</div>

            {activeTab === 'chat' ? (
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('workspaceDetail.headerSources', { selected: selectedDocumentIds.length, total: selectableDocumentIds.length })}
                </span>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-text-success)' }} />
              </div>
            ) : activeTab === 'saved' ? (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('workspaceDetail.headerSaved', { count: savedMessages.length })}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'documents') setUploadOpen(true)
                  if (activeTab === 'notes') setNoteOpen(true)
                  if (activeTab === 'summaries') handleGenerateSummary()
                }}
                className="dm-inline-button shrink-0"
              >
                {activeTab === 'documents' && <><Upload size={12} /> {t('workspaceDetail.actions.uploadDocument')}</>}
                {activeTab === 'notes' && <><Plus size={12} /> {t('workspaceDetail.actions.newNote')}</>}
                {activeTab === 'summaries' && <><Sparkles size={12} /> {t('workspaceDetail.actions.generateSummary')}</>}
              </button>
            )}
          </div>

          <div className="px-4 md:px-5 pt-4 border-b" style={{ borderColor: 'var(--color-border-tertiary)' }}>
            <div className="flex items-center gap-0 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`dm-tab ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col overflow-hidden" style={{ background: 'var(--color-background-primary)' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'documents' && (
                <motion.div key="documents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-0 overflow-y-auto">
                  {documents.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                          {t('workspaceDetail.emptyDocuments')}
                        </p>
                        <button type="button" onClick={() => setUploadOpen(true)} className="dm-inline-button">
                          <Upload size={12} />
                          {t('workspaceDetail.actions.uploadDocument')}
                        </button>
                    </div>
                  ) : (
                    documents.map(doc => (
                      <DocumentRow
                        key={doc.id}
                        doc={doc}
                        onClick={() => navigate(`/documents/${doc.id}`)}
                        t={t}
                        language={language}
                        locale={locale}
                      />
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === 'notes' && (
                <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-0 overflow-y-auto p-4 md:p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {notes.map(note => (
                        <NoteCard key={note.id} note={note} onClick={() => setSelectedNote(note)} t={t} language={language} locale={locale} />
                      ))}

                    <button
                      type="button"
                      onClick={() => setNoteOpen(true)}
                      className="dm-note-card dashed flex flex-col items-center justify-center gap-1.5 min-h-[100px]"
                    >
                      <Plus size={20} style={{ color: 'var(--color-text-tertiary)' }} />
                      <p className="text-[12px] m-0" style={{ color: 'var(--color-text-tertiary)' }}>{t('workspaceDetail.actions.newNote')}</p>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'summaries' && (
                <motion.div key="summaries" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-0 overflow-y-auto p-4 md:p-5">
                  <div className="space-y-3">
                    {summaries.map(summary => <SummaryCard key={summary.id} summary={summary} t={t} language={language} locale={locale} />)}
                    {summaries.length === 0 && (
                      <div className="p-8 text-center">
                        <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                          {t('workspaceDetail.emptySummaries')}
                        </p>
                        <button type="button" onClick={handleGenerateSummary} className="dm-inline-button">
                          <Sparkles size={12} />
                          {t('workspaceDetail.actions.generateSummary')}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'chat' && (
                <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-0 flex flex-col">
                  <ChatPanel
                    workspaceName={workspace.name}
                    documents={documents}
                    messages={chatMessages}
                    setMessages={setChatMessages}
                    selectedDocumentIds={selectedDocumentIds}
                    onToggleDocument={handleToggleDocumentSelection}
                    onToggleAllDocuments={handleToggleAllDocuments}
                    savedMessages={savedMessages}
                    onToggleSavedMessage={handleToggleSavedMessage}
                  />
                </motion.div>
              )}

              {activeTab === 'saved' && (
                <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-0 overflow-y-auto p-4 md:p-5">
                  {savedMessages.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                          {t('workspaceDetail.emptySaved')}
                        </p>
                        <p className="text-[12px] m-0" style={{ color: 'var(--color-text-tertiary)' }}>
                          {t('workspaceDetail.emptySavedHint')}
                        </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                        {savedMessages.map(message => (
                          <SavedMessageCard key={message.id} message={message} onRemove={handleRemoveSavedMessage} t={t} language={language} locale={locale} />
                        ))}
                      </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Modal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} title={t('workspaceDetail.uploadTitle')} size="md">
        <FileUploader
          onUpload={files => {
            const uploadedDocs = files.map(file => ({
              id: `doc-${Date.now()}-${file.name}`,
              workspaceId: workspace.id,
              name: file.name,
              type: file.name.split('.').pop().toLowerCase(),
              size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
              pages: Math.floor(Math.random() * 30) + 5,
              status: 'processing',
              uploadedAt: new Date().toISOString(),
              summary: null,
              chunks: 0,
              tags: [],
            }))

            setDocuments(current => [...uploadedDocs, ...current])
          }}
        />
        <div className="flex justify-end mt-4">
          <button type="button" onClick={() => setUploadOpen(false)} className="dm-inline-button">
            {t('common.done')}
          </button>
        </div>
      </Modal>

      <Modal isOpen={noteOpen} onClose={() => setNoteOpen(false)} title={t('workspaceDetail.newNoteTitle')} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              {t('workspaceDetail.noteTitle')}
            </label>
            <input
              value={newNote.title}
              onChange={event => setNewNote(current => ({ ...current, title: event.target.value }))}
              placeholder={t('workspaceDetail.noteTitlePlaceholder')}
              className="dm-input"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              {t('workspaceDetail.noteContent')}
            </label>
            <textarea
              value={newNote.content}
              onChange={event => setNewNote(current => ({ ...current, content: event.target.value }))}
              placeholder={t('workspaceDetail.noteContentPlaceholder')}
              rows={7}
              className="dm-input resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setNoteOpen(false)} className="dm-inline-button">
              {t('common.cancel')}
            </button>
            <button type="button" onClick={handleCreateNote} className="dm-primary-button !w-auto px-4">
              {t('workspaceDetail.saveNote')}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={Boolean(selectedNote)} onClose={() => setSelectedNote(null)} title={selectedNote?.title || t('workspaceDetail.newNoteTitle')} size="md">
        {selectedNote && (
          <div>
            <p className="text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('workspaceDetail.updatedAt', { time: getRelativeTime(selectedNote.updatedAt, language, locale, t) })}
            </p>
            <p className="text-sm leading-6 whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>
              {selectedNote.content}
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
