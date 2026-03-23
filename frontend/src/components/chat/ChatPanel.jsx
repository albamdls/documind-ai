import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, FileText, Sparkles } from 'lucide-react'
import { mockChatMessages, mockSuggestedQuestions } from '../../data/mockData'

const MOCK_RESPONSES = [
  "Based on the documents in this workspace, I found several relevant insights. The key theme across your files is the importance of **user-centric design** combined with scalable technical architecture.\n\n- Primary finding: strong demand in this segment\n- Supporting evidence: multiple docs reference similar conclusions\n- Recommended action: prioritize the features mentioned in research notes",
  "According to the analyzed documents, here are the **main points** to consider:\n\n1. The research indicates strong market demand\n2. Competitor analysis shows a clear gap in current offerings\n3. User interviews confirm the hypothesis about pain points\n\nWould you like me to dive deeper into any of these areas?",
  "I've reviewed the relevant sections across your documents. Here's a summary:\n\n- **Primary insight**: The data consistently points to opportunity in the enterprise segment\n- **Supporting evidence**: Multiple documents reference similar conclusions\n- **Recommended action**: Consider prioritizing the features mentioned in the research notes",
]

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2">
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
        <Bot size={13} style={{ color: 'var(--accent)' }} />
      </div>
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl rounded-tl-sm"
        style={{ background: 'var(--chat-ai-bg)', border: '1px solid var(--chat-ai-bdr)' }}>
        <span className="text-xs mr-1" style={{ color: 'var(--txt-muted)' }}>Thinking</span>
        {[0, 0.18, 0.36].map(d => (
          <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: 'var(--accent)', animationDelay: `${d}s`, opacity: 0.7 }} />
        ))}
      </div>
    </div>
  )
}

function renderContent(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} style={{ color: 'var(--txt-primary)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
      : part
  )
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  const lines = msg.content.split('\n')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2.5 px-4 py-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={isUser
          ? { background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }
          : { background: 'color-mix(in srgb, var(--accent) 14%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }
        }>
        {isUser
          ? <User size={12} className="text-white" />
          : <Bot size={12} style={{ color: 'var(--accent)' }} />
        }
      </div>

      <div className={`max-w-[76%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 text-sm leading-relaxed ${isUser ? 'chat-user' : 'chat-ai'}`}
          style={{ color: 'var(--txt-primary)' }}>
          {lines.map((line, i) => {
            if (line.startsWith('- ')) return (
              <div key={i} className="flex items-start gap-2 mb-1">
                <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                <span>{renderContent(line.slice(2))}</span>
              </div>
            )
            if (/^\d+\. /.test(line)) {
              const num = line.match(/^(\d+)\./)[1]
              return (
                <div key={i} className="flex items-start gap-2 mb-1">
                  <span className="text-xs font-mono mt-0.5 shrink-0" style={{ color: 'var(--accent)' }}>{num}.</span>
                  <span>{renderContent(line.replace(/^\d+\. /, ''))}</span>
                </div>
              )
            }
            if (line === '') return <div key={i} className="h-1.5" />
            return <p key={i}>{renderContent(line)}</p>
          })}
        </div>

        {msg.sources?.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] ml-1" style={{ color: 'var(--txt-muted)' }}>Sources cited</span>
            {msg.sources.map((src, i) => (
              <div key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-faint)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-faint)'}
              >
                <FileText size={11} style={{ color: 'var(--accent)' }} className="shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] truncate" style={{ color: 'var(--txt-secondary)' }}>{src.docName}</p>
                  <p className="text-[10px]" style={{ color: 'var(--txt-muted)' }}>{src.chunk} · p.{src.page}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <span className="text-[10px] px-1" style={{ color: 'var(--txt-muted)' }}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  )
}

export default function ChatPanel() {
  const [messages, setMessages] = useState(mockChatMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setMessages(m => [...m, {
      id: `m${Date.now()}`, role: 'user', content: trimmed,
      timestamp: new Date().toISOString(),
    }])
    setInput('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 1600 + Math.random() * 1000))

    setMessages(m => [...m, {
      id: `m${Date.now() + 1}`, role: 'assistant',
      content: MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)],
      timestamp: new Date().toISOString(),
      sources: [{ docId: 'doc1', docName: 'Competitive Analysis Q2 2024.pdf', chunk: 'Section 2', page: Math.ceil(Math.random() * 20) }],
    }])
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-faint)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'color-mix(in srgb, var(--accent) 14%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
            <Sparkles size={11} style={{ color: 'var(--accent)' }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>AI Chat</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="glow-dot" style={{ width: 5, height: 5 }} />
          <span className="text-[11px]" style={{ color: 'var(--txt-secondary)' }}>Ready</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-3">
        <AnimatePresence>
          {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
          {loading && <TypingIndicator />}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 flex gap-2 flex-wrap" style={{ borderTop: '1px solid var(--border-faint)' }}>
          {mockSuggestedQuestions.slice(0, 3).map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)}
              className="text-[11px] px-3 py-1.5 rounded-full transition-all"
              style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-faint)', color: 'var(--txt-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--txt-primary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-secondary)'; e.currentTarget.style.borderColor = 'var(--border-faint)' }}
            >{q}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border-faint)' }}>
        <div className="flex items-end gap-2 p-2 rounded-xl transition-all"
          style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)' }}
          onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--border-focus)'}
          onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything about your documents..."
            rows={1}
            style={{ resize: 'none', minHeight: 36, maxHeight: 120, background: 'transparent', outline: 'none', color: 'var(--txt-primary)', fontSize: '0.875rem', lineHeight: '1.6', padding: '0.25rem 0.25rem', flex: 1, fontFamily: 'inherit' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 disabled:opacity-40"
            style={{ background: 'color-mix(in srgb, var(--accent) 18%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)', color: 'var(--accent)' }}
            onMouseEnter={e => !loading && (e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 30%, transparent)')}
            onMouseLeave={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 18%, transparent)'}
          ><Send size={13} /></button>
        </div>
        <p className="text-[10px] text-center mt-2" style={{ color: 'var(--txt-muted)' }}>
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  )
}
