import { loadJSON, saveJSON, removeJSON } from './storage'

export type Mode = 'artikel' | 'vokabeln' | 'deklination'

export type SchedulerRecord = {
  ease: number
  interval: number
  repetitions: number
  dueDate: string // ISO date string
  correct: number
  incorrect: number
  lastSeen: string // ISO date string
}

type SchedulerStore = Partial<Record<Mode, Record<string, SchedulerRecord>>>

const STORE_NAME = 'scheduler'

function loadStore(): SchedulerStore {
  return loadJSON<SchedulerStore>(STORE_NAME, {})
}

function saveStore(store: SchedulerStore): void {
  saveJSON(STORE_NAME, store)
}

export function getRecord(mode: Mode, key: string): SchedulerRecord | undefined {
  return loadStore()[mode]?.[key]
}

export function getAllRecords(mode: Mode): Record<string, SchedulerRecord> {
  return loadStore()[mode] ?? {}
}

/** Update a word's spaced-repetition record after it's been answered. Uses a binary-quality SM-2 variant. */
export function recordAnswer(mode: Mode, key: string, wasCorrect: boolean): SchedulerRecord {
  const store = loadStore()
  const modeStore = store[mode] ?? {}
  const existing = modeStore[key]
  const quality = wasCorrect ? 5 : 2

  let ease = existing?.ease ?? 2.5
  let repetitions = existing?.repetitions ?? 0
  let interval = existing?.interval ?? 0

  if (quality < 3) {
    repetitions = 0
    interval = 1
  } else {
    repetitions += 1
    if (repetitions === 1) interval = 1
    else if (repetitions === 2) interval = 6
    else interval = Math.round(interval * ease)
  }

  ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))

  const now = new Date()
  const due = new Date(now)
  due.setDate(due.getDate() + interval)

  const updated: SchedulerRecord = {
    ease,
    interval,
    repetitions,
    dueDate: due.toISOString(),
    correct: (existing?.correct ?? 0) + (wasCorrect ? 1 : 0),
    incorrect: (existing?.incorrect ?? 0) + (wasCorrect ? 0 : 1),
    lastSeen: now.toISOString(),
  }

  modeStore[key] = updated
  store[mode] = modeStore
  saveStore(store)
  return updated
}

export type MasteryBucket = 'mastered' | 'inProgress' | 'unseen'

export function masteryOf(record: SchedulerRecord | undefined): MasteryBucket {
  if (!record) return 'unseen'
  if (record.repetitions >= 4 && record.interval >= 14) return 'mastered'
  return 'inProgress'
}

/**
 * Order word keys for a fresh session: due items first, then never-seen items,
 * then everything else — each bucket shuffled independently so ordering stays
 * varied while still biasing toward what needs practice.
 */
export function orderKeysForSession(mode: Mode, keys: string[]): string[] {
  const records = getAllRecords(mode)
  const now = Date.now()

  const due: string[] = []
  const unseen: string[] = []
  const rest: string[] = []

  for (const key of keys) {
    const record = records[key]
    if (!record) {
      unseen.push(key)
    } else if (new Date(record.dueDate).getTime() <= now) {
      due.push(key)
    } else {
      rest.push(key)
    }
  }

  return [...shuffle(due), ...shuffle(unseen), ...shuffle(rest)]
}

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function resetScheduler(): void {
  removeJSON(STORE_NAME)
}
