import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { Modal, Button } from '../ui'

const EMOJIS = ['📁', '🔬', '⚖️', '⚙️', '📣', '📊', '🎓', '💡', '🚀', '📝', '🔐', '🌐', '🧪', '📱', '🎯']
const COLORS = ['#4f8ef7', '#10b981', '#8b5cf6', '#f59e0b', '#22d3ee', '#ef4444', '#ec4899', '#14b8a6']
const INITIAL_FORM = { name: '', description: '', emoji: '📁', color: '#4f8ef7' }

export default function CreateWorkspaceModal({ isOpen, onClose, onCreate }) {
  const { t } = useLanguage()
  const [form, setForm] = useState(INITIAL_FORM)

  const handleClose = () => {
    onClose()
    setForm(INITIAL_FORM)
  }

  const handleCreate = () => {
    if (!form.name.trim()) return

    onCreate(form)
    handleClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('createWorkspace.title')}>
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--txt-muted)' }}>
            {t('createWorkspace.iconColor')}
          </label>
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all"
              style={{ background: `${form.color}18`, border: `1px solid ${form.color}35` }}
            >
              {form.emoji}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setForm(current => ({ ...current, emoji }))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all"
                    style={{
                      background: form.emoji === emoji ? 'var(--border-strong)' : 'var(--bg-hover)',
                      border: `1px solid ${form.emoji === emoji ? 'var(--border-strong)' : 'var(--border-faint)'}`,
                      outline: form.emoji === emoji ? '2px solid var(--accent)' : 'none',
                      outlineOffset: 1,
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm(current => ({ ...current, color }))}
                    className="w-5 h-5 rounded-full transition-all"
                    style={{
                      background: color,
                      outline: form.color === color ? '2px solid var(--txt-primary)' : 'none',
                      outlineOffset: 2,
                      transform: form.color === color ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>
            {t('createWorkspace.name')}
          </label>
          <input
            value={form.name}
            onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
            placeholder={t('createWorkspace.namePlaceholder')}
            className="input-base"
            autoFocus
            onKeyDown={event => event.key === 'Enter' && handleCreate()}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--txt-muted)' }}>
            {t('createWorkspace.description')} <span style={{ color: 'var(--txt-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>({t('createWorkspace.optional')})</span>
          </label>
          <textarea
            value={form.description}
            onChange={event => setForm(current => ({ ...current, description: event.target.value }))}
            placeholder={t('createWorkspace.descriptionPlaceholder')}
            rows={3}
            className="input-base resize-none"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="secondary" onClick={handleClose} className="flex-1">{t('createWorkspace.cancel')}</Button>
          <Button variant="primary" onClick={handleCreate} className="flex-1" disabled={!form.name.trim()}>
            <Sparkles size={13} /> {t('createWorkspace.submit')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
