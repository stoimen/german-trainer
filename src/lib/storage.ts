const PREFIX = 'de-trainer'

export function storageKey(name: string): string {
  return `${PREFIX}:${name}`
}

export function loadJSON<T>(name: string, fallback: T): T {
  const key = storageKey(name)
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

export function saveJSON<T>(name: string, value: T): void {
  const key = storageKey(name)
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable; silently ignore, state stays in-memory only
  }
}

export function removeJSON(name: string): void {
  try {
    localStorage.removeItem(storageKey(name))
  } catch {
    // ignore
  }
}
