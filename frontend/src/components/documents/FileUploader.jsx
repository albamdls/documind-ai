import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CloudUpload, FileText, X, Check } from 'lucide-react'

function FileItem({ file, onRemove }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useState(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 22
        if (next >= 100) { clearInterval(interval); setDone(true); return 100 }
        return next
      })
    }, 180)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="flex items-center gap-3 p-3 rounded-xl transition-all"
      style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-faint)' }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
        style={done
          ? { background: 'color-mix(in srgb, var(--accent-green) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-green) 25%, transparent)' }
          : { background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }
        }>
        {done
          ? <Check size={13} style={{ color: 'var(--accent-green)' }} />
          : <FileText size={13} style={{ color: 'var(--accent)' }} />
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: 'var(--txt-primary)' }}>{file.name}</p>
        <div className="flex items-center gap-2 mt-1">
          {!done ? (
            <>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border-strong)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%`, background: 'var(--accent)' }} />
              </div>
              <span className="text-[11px] shrink-0" style={{ color: 'var(--txt-muted)' }}>{Math.round(Math.min(progress, 100))}%</span>
            </>
          ) : (
            <span className="text-[11px]" style={{ color: 'var(--accent-green)' }}>Uploaded · Processing…</span>
          )}
        </div>
      </div>

      {done && (
        <button onClick={() => onRemove(file.name)} className="transition-colors"
          style={{ color: 'var(--txt-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-muted)'}
        ><X size={13} /></button>
      )}
    </motion.div>
  )
}

export default function FileUploader({ onUpload }) {
  const [dragOver, setDragOver] = useState(false)
  const [files, setFiles] = useState([])
  const inputRef = useRef(null)

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList)
    setFiles(f => [...f, ...newFiles])
    if (onUpload) onUpload(newFiles)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (name) => setFiles(f => f.filter(file => file.name !== name))

  return (
    <div className="space-y-3">
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all"
        style={{
          borderColor: dragOver ? 'var(--accent)' : 'var(--border-default)',
          background: dragOver ? 'color-mix(in srgb, var(--accent) 5%, transparent)' : 'transparent',
        }}
        onMouseEnter={e => { if (!dragOver) e.currentTarget.style.borderColor = 'var(--border-strong)' }}
        onMouseLeave={e => { if (!dragOver) e.currentTarget.style.borderColor = 'var(--border-default)' }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
          style={dragOver
            ? { background: 'color-mix(in srgb, var(--accent) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }
            : { background: 'var(--bg-hover)', border: '1px solid var(--border-default)' }
          }>
          <CloudUpload size={22} style={{ color: dragOver ? 'var(--accent)' : 'var(--txt-muted)' }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: 'var(--txt-primary)' }}>
            {dragOver ? 'Drop files here' : 'Drag & drop files'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--txt-secondary)' }}>
            or <span style={{ color: 'var(--accent)' }}>browse</span> · PDF, DOCX, MD, TXT
          </p>
        </div>
        <input ref={inputRef} type="file" multiple accept=".pdf,.docx,.doc,.md,.txt" className="hidden"
          onChange={e => handleFiles(e.target.files)} />
      </div>

      <AnimatePresence>
        {files.map(file => (
          <FileItem key={file.name} file={file} onRemove={removeFile} />
        ))}
      </AnimatePresence>
    </div>
  )
}
