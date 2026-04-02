import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, BookmarkCheck, FileText, Files, GripVertical, Send } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { pluralSuffix } from '../../i18n'

function renderContent(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, index) => (
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : <span key={index}>{part}</span>
  ))
}

function getRelativeTimestamp(dateString, locale) {
  return new Date(dateString).toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function createDocumentSource(doc, index = 0) {
  return {
    docId: doc.id,
    docName: doc.name,
    page: Math.min(doc.pages || 1, 2 + (index * 3)),
  }
}

function buildAssistantReply(prompt, activeDocuments, workspaceName, t) {
  if (activeDocuments.length === 0) {
    return {
      content: t('chat.noSourceReply'),
      sources: [],
    }
  }

  const primary = activeDocuments[0]
  const secondary = activeDocuments[1]
  const uniqueTags = [...new Set(activeDocuments.flatMap(doc => doc.tags || []))].slice(0, 4)
  const normalizedPrompt = prompt.toLowerCase()
  const focus = normalizedPrompt.includes('resumen')
    ? t('chat.focus.summary')
    : normalizedPrompt.includes('accion') || normalizedPrompt.includes('acción') || normalizedPrompt.includes('action')
      ? t('chat.focus.actions')
      : normalizedPrompt.includes('compar')
        ? t('chat.focus.comparisons')
        : t('chat.focus.findings')

  const secondaryText = secondary ? t('chat.replySecondary', { name: secondary.name }) : ''
  const tagsText = uniqueTags.length > 0 ? t('chat.replyTags', { tags: uniqueTags.join(', ') }) : ''
  const moreSourcesText = activeDocuments.length > 2 ? t('chat.replyMoreSources', { count: activeDocuments.length - 2 }) : ''

  return {
    content: t('chat.reply', {
      selection: activeDocuments.length === 1
        ? t('chat.replySelectionSingle')
        : t('chat.replySelectionMultiple', { count: activeDocuments.length }),
      workspace: workspaceName,
      focus,
      primary: primary.name,
      secondary: secondaryText,
      tags: tagsText,
      moreSources: moreSourcesText,
    }),
    sources: activeDocuments.slice(0, 3).map(createDocumentSource),
  }
}

function TypingBubble({ t }) {
  return (
    <div className="msg-ai flex items-center gap-2">
      <div className="flex gap-1">
        {[0, 0.2, 0.4].map(delay => (
          <div
            key={delay}
            className="w-[5px] h-[5px] rounded-full"
            style={{
              background: 'var(--color-text-tertiary)',
              animation: `pulse 1s ease-in-out ${delay}s infinite`,
            }}
          />
        ))}
      </div>
      <span className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
        {t('chat.typing')}
      </span>
    </div>
  )
}

function getDocumentStatusMeta(status, t) {
  if (status === 'processed') {
    return {
      label: t('chat.status.ready.label'),
      background: 'var(--color-background-success)',
      color: 'var(--color-text-success)',
      helper: t('chat.status.ready.helper'),
    }
  }

  if (status === 'processing') {
    return {
      label: t('chat.status.processing.label'),
      background: 'var(--color-background-warning)',
      color: 'var(--color-text-warning)',
      helper: t('chat.status.processing.helper'),
    }
  }

  return {
    label: t('chat.status.error.label'),
    background: 'rgba(239,68,68,0.12)',
    color: 'var(--accent-red)',
    helper: t('chat.status.error.helper'),
  }
}

function SidebarDocumentRow({ doc, selected, onToggle, t }) {
  const status = getDocumentStatusMeta(doc.status, t)
  const disabled = doc.status !== 'processed'

  return (
    <button
      type="button"
      onClick={() => onToggle(doc.id)}
      disabled={disabled}
      className="w-full text-left rounded-2xl border p-3 transition-all disabled:cursor-not-allowed disabled:opacity-65"
      style={{
        borderColor: selected ? 'var(--color-border-secondary)' : 'var(--color-border-tertiary)',
        background: selected ? 'var(--color-background-secondary)' : 'var(--color-background-primary)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-4 h-4 mt-0.5 rounded-[5px] border flex items-center justify-center shrink-0"
          style={{
            borderColor: selected ? 'var(--color-text-primary)' : 'var(--color-border-secondary)',
            background: selected ? 'var(--color-text-primary)' : 'transparent',
            color: selected ? 'var(--color-background-primary)' : 'transparent',
          }}
        >
          <span className="text-[10px] leading-none">✓</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p className="text-[12px] font-medium leading-5 m-0" style={{ color: 'var(--color-text-primary)' }}>
              {doc.name}
            </p>
            <span
              className="text-[10px] px-2 py-1 rounded-full whitespace-nowrap"
              style={{ background: status.background, color: status.color }}
            >
              {status.label}
            </span>
          </div>

          <p className="text-[11px] m-0 mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
            {t('chat.pages', { count: doc.pages })} · {doc.size}
          </p>
          <p className="text-[11px] leading-5 m-0" style={{ color: 'var(--color-text-secondary)' }}>
            {doc.summary || status.helper}
          </p>
        </div>
      </div>
    </button>
  )
}

export default function ChatPanel({
  workspaceName,
  documents,
  messages,
  setMessages,
  selectedDocumentIds,
  onToggleDocument,
  onToggleAllDocuments,
  savedMessages,
  onToggleSavedMessage,
}) {
  const { t, locale } = useLanguage()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(320)
  const [isDesktop, setIsDesktop] = useState(() => (typeof window === 'undefined' ? true : window.innerWidth >= 1024))
  const bottomRef = useRef(null)
  const containerRef = useRef(null)

  const processedDocuments = useMemo(
    () => documents.filter(doc => doc.status === 'processed'),
    [documents],
  )
  const selectedDocumentSet = useMemo(() => new Set(selectedDocumentIds), [selectedDocumentIds])
  const activeDocuments = useMemo(
    () => processedDocuments.filter(doc => selectedDocumentSet.has(doc.id)),
    [processedDocuments, selectedDocumentSet],
  )
  const savedMessageIds = useMemo(
    () => new Set(savedMessages.map(message => message.messageId)),
    [savedMessages],
  )
  const suggestedQuestions = useMemo(() => t('chat.suggestedQuestions'), [t])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleResizeStart = (event) => {
    if (!isDesktop || !containerRef.current) return

    event.preventDefault()
    const startX = event.clientX
    const startWidth = sidebarWidth

    const handleMouseMove = (moveEvent) => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.getBoundingClientRect().width
      const maxSidebarWidth = Math.max(280, Math.min(520, containerWidth - 360))
      const nextWidth = Math.min(Math.max(260, startWidth + (moveEvent.clientX - startX)), maxSidebarWidth)
      setSidebarWidth(nextWidth)
    }

    const handleMouseUp = () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setMessages(current => [
      ...current,
      {
        id: `m${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      },
    ])
    setInput('')
    setLoading(true)

    await new Promise(resolve => setTimeout(resolve, 900))

    const nextReply = buildAssistantReply(trimmed, activeDocuments, workspaceName, t)

    setMessages(current => [
      ...current,
      {
        id: `m${Date.now() + 1}`,
        role: 'assistant',
        content: nextReply.content,
        timestamp: new Date().toISOString(),
        sources: nextReply.sources,
      },
    ])
    setLoading(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      sendMessage(input)
    }
  }

  const allProcessedSelected = processedDocuments.length > 0 && activeDocuments.length === processedDocuments.length

  return (
    <div ref={containerRef} className="flex flex-1 min-h-0 h-full flex-col lg:flex-row">
      <aside
        className="shrink-0 border-b lg:border-b-0 lg:border-r flex flex-col min-h-[260px] lg:min-h-0"
        style={{
          borderColor: 'var(--color-border-tertiary)',
          width: isDesktop ? sidebarWidth : '100%',
          background: 'color-mix(in srgb, var(--color-background-primary) 96%, var(--color-background-secondary))',
        }}
      >
        <div className="p-3 border-b" style={{ borderColor: 'var(--color-border-tertiary)' }}>
          <p className="text-[12px] font-medium m-0" style={{ color: 'var(--color-text-primary)' }}>
            {t('chat.sourcesTitle')}
          </p>
          <p className="text-[11px] m-0 mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
            {t('chat.sourcesDescription')}
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-3">
          <div className="space-y-3">
            <div
              className="rounded-2xl border p-3"
              style={{
                borderColor: 'var(--color-border-tertiary)',
                background: 'var(--color-background-primary)',
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div>
                  <p className="text-[12px] font-medium m-0" style={{ color: 'var(--color-text-primary)' }}>
                    {t('chat.activeSources')}
                  </p>
                  <p className="text-[11px] m-0" style={{ color: 'var(--color-text-tertiary)' }}>
                    {t('chat.activeSourcesSummary', { selected: activeDocuments.length, total: processedDocuments.length })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onToggleAllDocuments}
                  disabled={processedDocuments.length === 0}
                  className="text-[11px] font-medium disabled:opacity-50"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {allProcessedSelected ? t('chat.clearAll') : t('chat.selectAll')}
                </button>
              </div>

              <p className="text-[11px] leading-5 m-0" style={{ color: 'var(--color-text-secondary)' }}>
                {t('chat.processedOnly')}
              </p>
            </div>

            {documents.length === 0 ? (
              <div className="rounded-2xl border p-4 text-center" style={{ borderColor: 'var(--color-border-tertiary)' }}>
                <Files size={18} className="mx-auto mb-2" style={{ color: 'var(--color-text-tertiary)' }} />
                <p className="text-[12px] m-0" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('chat.emptyDocuments')}
                </p>
              </div>
            ) : (
              documents.map(doc => (
                <SidebarDocumentRow
                  key={doc.id}
                  doc={doc}
                  selected={selectedDocumentSet.has(doc.id)}
                  onToggle={onToggleDocument}
                  t={t}
                />
              ))
            )}
          </div>
        </div>
      </aside>

      {isDesktop && (
        <div
          onMouseDown={handleResizeStart}
          className="hidden lg:flex relative w-3 shrink-0 items-center justify-center cursor-col-resize"
          style={{ background: 'var(--color-background-primary)' }}
          title={t('chat.resizeTitle')}
        >
          <div
            className="h-16 w-[3px] rounded-full"
            style={{ background: 'var(--color-border-secondary)' }}
          />
          <GripVertical
            size={12}
            className="absolute"
            style={{ color: 'var(--color-text-tertiary)' }}
          />
        </div>
      )}

      <section className="flex-1 min-w-0 flex flex-col min-h-0">
        <div className="px-4 py-3 border-b flex items-center justify-between gap-3" style={{ borderColor: 'var(--color-border-tertiary)' }}>
          <div>
            <p className="text-[13px] font-medium m-0" style={{ color: 'var(--color-text-primary)' }}>{t('chat.title')}</p>
            <p className="text-[11px] m-0" style={{ color: 'var(--color-text-tertiary)' }}>
              {activeDocuments.length > 0
                ? t('chat.activeWorkspaceSources', { count: activeDocuments.length, suffix: pluralSuffix(locale, activeDocuments.length), workspace: workspaceName })
                : t('chat.noActiveSources')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5 flex-1 min-h-0 overflow-y-auto">
          {messages.map(message => {
            const isSaved = savedMessageIds.has(message.id)

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[88%] flex flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-start gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`${message.role === 'user' ? 'msg-user' : 'msg-ai'} whitespace-pre-wrap leading-6`}>
                      {renderContent(message.content)}
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleSavedMessage(message)}
                      className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-colors"
                      style={{
                        borderColor: isSaved ? 'var(--color-border-secondary)' : 'var(--color-border-tertiary)',
                        background: isSaved ? 'var(--color-background-secondary)' : 'var(--color-background-primary)',
                        color: isSaved ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      }}
                      title={isSaved ? t('chat.removeSaved') : t('chat.saveMessage')}
                    >
                      {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                    </button>
                  </div>

                  <div className={`flex items-center gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                      {getRelativeTimestamp(message.timestamp, locale)}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                      {message.role === 'assistant' ? t('chat.assistant') : t('chat.yourMessage')}
                    </span>
                  </div>

                  {message.role === 'assistant' && message.sources?.length > 0 && (
                    <div className="flex flex-wrap gap-1 px-0.5">
                      <span className="text-[11px] mr-1 leading-[22px]" style={{ color: 'var(--color-text-tertiary)' }}>
                        {t('chat.sourcesLabel')}
                      </span>
                      {message.sources.map((source, index) => (
                        <span key={`${message.id}-${source.docName}-${index}`} className="source-chip">
                          <FileText size={10} />
                          {source.docName} · p.{source.page}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}

          {loading && <TypingBubble t={t} />}
          <div ref={bottomRef} />
        </div>

        <div
          className="px-3 py-3 shrink-0"
          style={{ borderTop: '1px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)' }}
        >
          <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
            {suggestedQuestions.slice(0, 3).map(question => (
              <button
                key={question}
                type="button"
                onClick={() => sendMessage(question)}
                className="suggestion"
              >
                {question}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.inputPlaceholder')}
              className="dm-input flex-1"
            />
            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-[38px] h-[38px] rounded-xl flex items-center justify-center shrink-0 transition-opacity disabled:opacity-50"
              style={{ background: 'var(--color-text-primary)', color: 'var(--color-background-primary)' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
