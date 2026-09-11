import { useEffect, useMemo, useRef, useState } from 'react'
import TopBar from '../components/TopBar'
import ProgressBar from '../components/ProgressBar'
import { useSessionQueue } from '../hooks/useSessionQueue'
import { allWordKeys, wordsByKey, type Article } from '../data/words'

const ARTICLES: Article[] = ['der', 'die', 'das']

type Feedback = { status: 'correct' } | { status: 'wrong'; correctArticle: Article; english: string }

export default function Artikel() {
  const keys = useMemo(() => allWordKeys, [])
  const { currentKey, progress, answer } = useSessionQueue('artikel', keys)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const timeoutRef = useRef<number | undefined>(undefined)

  const noun = currentKey ? wordsByKey.get(currentKey) : undefined

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current)
  }, [])

  function handlePick(article: Article) {
    if (feedback || !noun) return
    const wasCorrect = article === noun.article

    if (wasCorrect) {
      setFeedback({ status: 'correct' })
    } else {
      setFeedback({ status: 'wrong', correctArticle: noun.article, english: noun.english })
    }

    timeoutRef.current = window.setTimeout(
      () => {
        setFeedback(null)
        answer(wasCorrect)
      },
      wasCorrect ? 600 : 1800,
    )
  }

  if (!noun) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <TopBar title="Artikel" />
        <p className="mt-20 text-center text-slate-500">No words available.</p>
      </div>
    )
  }

  const feedbackColor =
    feedback?.status === 'correct'
      ? 'bg-emerald-500/15 ring-emerald-500'
      : feedback?.status === 'wrong'
        ? 'bg-rose-500/15 ring-rose-500'
        : 'ring-transparent'

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10">
      <TopBar title="Artikel" />
      <ProgressBar seen={progress.itemsAnswered} accuracy={progress.accuracy} />

      <div className={`mt-10 flex flex-1 flex-col items-center justify-center rounded-3xl p-8 ring-2 transition-colors ${feedbackColor}`}>
        <p className="text-center text-5xl font-bold tracking-tight">{noun.german}</p>

        {feedback?.status === 'wrong' && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">
              {feedback.correctArticle} {noun.german}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{feedback.english}</p>
          </div>
        )}
        {feedback?.status === 'correct' && (
          <p className="mt-6 text-lg font-semibold text-emerald-600 dark:text-emerald-400">Richtig!</p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {ARTICLES.map((article) => (
          <button
            key={article}
            type="button"
            onClick={() => handlePick(article)}
            disabled={!!feedback}
            className="flex h-24 flex-col items-center justify-center rounded-full bg-white text-lg font-semibold shadow-sm ring-1 ring-slate-200 transition active:scale-95 disabled:opacity-60 dark:bg-slate-800 dark:ring-slate-700"
          >
            {article}
          </button>
        ))}
      </div>
    </div>
  )
}
