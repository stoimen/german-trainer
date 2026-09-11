import { useEffect, useRef, useState } from 'react'
import { orderKeysForSession, recordAnswer, type Mode } from '../lib/scheduler'
import { getLastStart, setLastStart } from '../lib/lastStart'
import { upsertSession } from '../lib/history'

export type SessionProgress = {
  itemsAnswered: number
  correct: number
  accuracy: number
}

/**
 * Drives a shuffled, spaced-repetition-biased queue for a practice session.
 * Wrong answers are re-inserted 5-10 items later (session-only repeat pile).
 * The queue loops indefinitely (reshuffling) until the component unmounts,
 * at which point the session is recorded to history.
 */
export function useSessionQueue(mode: Mode, allKeys: string[]) {
  const [currentKey, setCurrentKey] = useState<string | undefined>(undefined)
  const [progress, setProgress] = useState<SessionProgress>({ itemsAnswered: 0, correct: 0, accuracy: 0 })
  const queueRef = useRef<string[]>([])
  const progressRef = useRef(progress)
  const modeRef = useRef(mode)
  const sessionIdRef = useRef('')
  modeRef.current = mode

  useEffect(() => {
    sessionIdRef.current = crypto.randomUUID()
    progressRef.current = { itemsAnswered: 0, correct: 0, accuracy: 0 }
    setProgress(progressRef.current)

    if (allKeys.length === 0) {
      queueRef.current = []
      setCurrentKey(undefined)
      return
    }

    let order = orderKeysForSession(mode, allKeys)
    const lastStart = getLastStart(mode)
    if (order.length > 1 && order[0] === lastStart) {
      ;[order[0], order[1]] = [order[1], order[0]]
    }
    queueRef.current = order
    setCurrentKey(order[0])
    if (order[0]) setLastStart(mode, order[0])

    return () => {
      const { itemsAnswered, correct, accuracy } = progressRef.current
      upsertSession(sessionIdRef.current, { mode: modeRef.current, itemsAnswered, correct, accuracy })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally mount-scoped: shuffle happens once per screen visit
  }, [mode])

  function answer(wasCorrect: boolean) {
    const key = currentKey
    if (!key) return

    recordAnswer(mode, key, wasCorrect)

    const nextProgress: SessionProgress = {
      itemsAnswered: progressRef.current.itemsAnswered + 1,
      correct: progressRef.current.correct + (wasCorrect ? 1 : 0),
      accuracy: 0,
    }
    nextProgress.accuracy = nextProgress.correct / nextProgress.itemsAnswered
    progressRef.current = nextProgress
    setProgress(nextProgress)
    upsertSession(sessionIdRef.current, { mode, ...nextProgress })

    let queue = queueRef.current.slice(1)
    if (!wasCorrect) {
      const insertAt = Math.min(queue.length, 5 + Math.floor(Math.random() * 6))
      queue.splice(insertAt, 0, key)
    }

    if (queue.length === 0) {
      queue = orderKeysForSession(mode, allKeys)
      if (queue.length > 1 && queue[0] === key) {
        ;[queue[0], queue[1]] = [queue[1], queue[0]]
      }
    }

    queueRef.current = queue
    setCurrentKey(queue[0])
  }

  return { currentKey, progress, answer }
}
