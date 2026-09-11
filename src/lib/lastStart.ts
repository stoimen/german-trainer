import { loadJSON, saveJSON } from './storage'
import type { Mode } from './scheduler'

const STORE_NAME = 'lastStart'

function loadAll(): Partial<Record<Mode, string>> {
  return loadJSON<Partial<Record<Mode, string>>>(STORE_NAME, {})
}

export function getLastStart(mode: Mode): string | undefined {
  return loadAll()[mode]
}

export function setLastStart(mode: Mode, key: string): void {
  const all = loadAll()
  all[mode] = key
  saveJSON(STORE_NAME, all)
}
