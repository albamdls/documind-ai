import { useLanguage } from '../../context/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div
      className="inline-flex items-center gap-1 rounded-xl border p-1"
      style={{
        background: 'var(--color-background-primary, var(--bg-hover))',
        borderColor: 'var(--color-border-tertiary, var(--border-default))',
      }}
      aria-label={t('common.languageSwitcher')}
    >
      {[
        { value: 'es', label: 'ES', title: t('common.languages.es') },
        { value: 'en', label: 'EN', title: t('common.languages.en') },
      ].map(option => {
        const active = language === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLanguage(option.value)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors"
            style={{
              background: active ? 'var(--color-text-primary, var(--txt-primary))' : 'transparent',
              color: active ? 'var(--color-background-primary, var(--bg-base))' : 'var(--color-text-secondary, var(--txt-secondary))',
            }}
            title={option.title}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
