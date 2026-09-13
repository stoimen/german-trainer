import { useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import AccuracyChart from '../components/AccuracyChart'
import { getHistoryForMode, resetHistory, type SessionRecord } from '../lib/history'
import { getAllRecords, masteryOf, resetScheduler, type Mode } from '../lib/scheduler'
import { allWordKeys } from '../data/words'
import { deklinationKeys } from '../data/deklinationSentences'
import { removeJSON } from '../lib/storage'

const MODES: { mode: Mode; label: string; keys: string[] }[] = [
  { mode: 'artikel', label: 'Artikel', keys: allWordKeys },
  { mode: 'vokabeln', label: 'Vokabeln', keys: allWordKeys },
  { mode: 'deklination', label: 'Deklination', keys: deklinationKeys },
]

function useModeStats(refreshKey: number) {
  return useMemo(() => {
    return MODES.map(({ mode, label, keys }) => {
      const history: SessionRecord[] = getHistoryForMode(mode)
      const records = getAllRecords(mode)

      let mastered = 0
      let inProgress = 0
      let unseen = 0
      for (const key of keys) {
        const bucket = masteryOf(records[key])
        if (bucket === 'mastered') mastered++
        else if (bucket === 'inProgress') inProgress++
        else unseen++
      }

      const totalItems = history.reduce((sum, s) => sum + s.itemsAnswered, 0)

      return { mode, label, history, mastered, inProgress, unseen, totalItems }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refreshKey forces recompute after a reset
  }, [refreshKey])
}

export default function Stats() {
  const [confirming, setConfirming] = useState(false)
  const [resetNonce, setResetNonce] = useState(0)
  const modeStats = useModeStats(resetNonce)

  const totalSessions = modeStats.reduce((sum, m) => sum + m.history.length, 0)
  const totalItemsAnswered = modeStats.reduce((sum, m) => sum + m.totalItems, 0)

  function handleReset() {
    resetScheduler()
    resetHistory()
    removeJSON('lastStart')
    setConfirming(false)
    setResetNonce((n) => n + 1)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-16" key={resetNonce}>
      <TopBar title="Stats" />

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <p className="text-3xl font-bold">{totalSessions}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sessions</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <p className="text-3xl font-bold">{totalItemsAnswered}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Items answered</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {modeStats.map(({ mode, label, history, mastered, inProgress, unseen }) => {
          const total = mastered + inProgress + unseen
          return (
            <section key={mode}>
              <h2 className="text-lg font-semibold">{label}</h2>

              <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <AccuracyChart sessions={history} />
              </div>

              <div className="mt-3 overflow-hidden rounded-full">
                <div className="flex h-3 w-full">
                  <div className="bg-emerald-500" style={{ width: `${(mastered / total) * 100}%` }} />
                  <div className="bg-amber-400" style={{ width: `${(inProgress / total) * 100}%` }} />
                  <div className="bg-slate-300 dark:bg-slate-600" style={{ width: `${(unseen / total) * 100}%` }} />
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>🟢 Mastered: {mastered}</span>
                <span>🟡 In progress: {inProgress}</span>
                <span>⚪ Unseen: {unseen}</span>
              </div>
            </section>
          )
        })}
      </div>

      <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-700">
        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="h-12 w-full rounded-full border border-rose-300 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950"
          >
            Reset all progress
          </button>
        ) : (
          <div className="flex flex-col gap-3 rounded-2xl bg-rose-50 p-4 text-center dark:bg-rose-950/40">
            <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
              This deletes all scheduling data and session history. This can't be undone.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="h-11 rounded-full bg-white text-sm font-medium shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="h-11 rounded-full bg-rose-600 text-sm font-semibold text-white shadow-sm"
              >
                Yes, reset everything
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
