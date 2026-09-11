import { useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import ProgressBar from '../components/ProgressBar'
import { useSessionQueue } from '../hooks/useSessionQueue'
import { allWordKeys, wordsByKey } from '../data/words'

export default function Vokabeln() {
  const keys = useMemo(() => allWordKeys, [])
  const { currentKey, progress, answer } = useSessionQueue('vokabeln', keys)
  const [revealed, setRevealed] = useState(false)

  const noun = currentKey ? wordsByKey.get(currentKey) : undefined

  function handleAnswer(knewIt: boolean) {
    setRevealed(false)
    answer(knewIt)
  }

  if (!noun) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <TopBar title="Vokabeln" />
        <p className="mt-20 text-center text-slate-500">No words available.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10">
      <TopBar title="Vokabeln" />
      <ProgressBar seen={progress.itemsAnswered} accuracy={progress.accuracy} />

      <div className="mt-10 flex flex-1 flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        <p className="text-center text-3xl font-bold tracking-tight">{noun.english}</p>

        {revealed && (
          <div className="mt-8 text-center">
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              {noun.article} {noun.german}
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Plural: die {noun.plural}</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="h-16 w-full rounded-full bg-indigo-600 text-lg font-semibold text-white shadow-sm transition active:scale-[0.98]"
          >
            Show
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleAnswer(false)}
              className="h-16 rounded-full bg-rose-500 text-lg font-semibold text-white shadow-sm transition active:scale-[0.98]"
            >
              I didn&apos;t
            </button>
            <button
              type="button"
              onClick={() => handleAnswer(true)}
              className="h-16 rounded-full bg-emerald-500 text-lg font-semibold text-white shadow-sm transition active:scale-[0.98]"
            >
              I knew it
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
