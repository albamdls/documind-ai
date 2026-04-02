import es from './messages/es'
import en from './messages/en'

export const DEFAULT_LANGUAGE = 'es'

export const SUPPORTED_LANGUAGES = [
  { value: 'es', label: 'Español', shortLabel: 'ES', locale: 'es-ES' },
  { value: 'en', label: 'English', shortLabel: 'EN', locale: 'en-US' },
]

const MESSAGES = { es, en }

function getValue(source, path) {
  return path.split('.').reduce((current, part) => current?.[part], source)
}

function interpolate(value, params = {}) {
  if (typeof value !== 'string') return value

  return value.replace(/\{(\w+)\}/g, (_, key) => (
    params[key] === undefined || params[key] === null ? `{${key}}` : String(params[key])
  ))
}

export function getLocale(language) {
  return SUPPORTED_LANGUAGES.find(item => item.value === language)?.locale || 'es-ES'
}

export function translate(language, key, params) {
  const value = getValue(MESSAGES[language] || MESSAGES[DEFAULT_LANGUAGE], key)
  const fallback = getValue(MESSAGES[DEFAULT_LANGUAGE], key)
  const resolved = value ?? fallback ?? key

  if (typeof resolved === 'string') {
    return interpolate(resolved, params)
  }

  return resolved
}

export function pluralSuffix(_language, count) {
  return count === 1 ? '' : 's'
}
