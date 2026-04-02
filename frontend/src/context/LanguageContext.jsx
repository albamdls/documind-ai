import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_LANGUAGE, getLocale, translate } from '../i18n'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'documind_language'

function getInitialLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'es' || stored === 'en') return stored

  const browserLanguage = window.navigator.language?.toLowerCase() || ''
  return browserLanguage.startsWith('en') ? 'en' : DEFAULT_LANGUAGE
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = useCallback(() => {
    setLanguage(current => (current === 'es' ? 'en' : 'es'))
  }, [])

  const t = useCallback((key, params) => translate(language, key, params), [language])

  const value = useMemo(() => ({
    language,
    locale: getLocale(language),
    setLanguage,
    toggleLanguage,
    t,
  }), [language, t, toggleLanguage])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
