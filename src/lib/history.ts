import { loadJSON, saveJSON, removeJSON } from './storage'
import type { Mode } from './scheduler'

export type SessionRecord = {
  id: string
  timestamp: string // ISO date string, set when the session started
  mode: Mode
  itemsAnswered: number
  correct: number
  accuracy: number // 0..1
}

const STORE_NAME = 'history'

export function getHistory(): SessionRecord[] {
  return loadJSON<SessionRecord[]>(STORE_NAME, [])
}

export function getHistoryForMode(mode: Mode): SessionRecord[] {
  return getHistory().filter((r) => r.mode === mode)
}

/**
 * Create or update a session's record, keyed by session id. Called after every
 * answer (not just on unmount) so progress survives a hard refresh or the tab
 * being closed mid-session, not just a clean in-app exit.
 */
export function upsertSession(id: string, patch: Omit<SessionRecord, 'id' | 'timestamp'>): void {
  if (patch.itemsAnswered === 0) return
  const history = getHistory()
  const idx = history.findIndex((r) => r.id === id)
  if (idx === -1) {
    history.push({ id, timestamp: new Date().toISOString(), ...patch })
  } else {
    history[idx] = { ...history[idx], ...patch }
  }
  saveJSON(STORE_NAME, history)
}

export function resetHistory(): void {
  removeJSON(STORE_NAME)
}
