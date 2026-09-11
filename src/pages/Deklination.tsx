import { useMemo, useRef, useState } from 'react'
import TopBar from '../components/TopBar'
import ProgressBar from '../components/ProgressBar'
import { useSessionQueue } from '../hooks/useSessionQueue'
import { allWordKeys, wordsByKey } from '../data/words'
import { buildQuestion } from '../lib/declension'

type Feedback = { status: 'correct' } | { status: 'wrong'; correctArticle: string; reason: string }

export default function Deklination() {
  const keys = useMemo(() => allWordKeys, [])
  const { currentKey, progress, answer } = useSessionQueue('deklination', keys)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const timeoutRef = useRef<number | undefined>(undefined)

  const noun = currentKey ? wordsByKey.get(currentKey) : undefined
  // Re-rolled each time the current word changes (the queue never repeats the same word twice in a row).
  const question = useMemo(() => (noun ? buildQuestion(noun) : undefined), [noun])

  function handlePick(option: string) {
    if (feedback || !question) return
    const wasCorrect = option === question.correctArticle

    if (wasCorrect) {
      setFeedback({ status: 'correct' })
    } else {
      setFeedback({ status: 'wrong', correctArticle: question.correctArticle, reason: question.template.reason })
    }

    timeoutRef.current = window.setTimeout(
      () => {
        setFeedback(null)
        answer(wasCorrect)
      },
      wasCorrect ? 600 : 2200,
    )
  }

  if (!question) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <TopBar title="Deklination" />
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

  const [before, after] = question.germanSentence.split('___')

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10">
      <TopBar title="Deklination" />
      <ProgressBar seen={progress.itemsAnswered} accuracy={progress.accuracy} />

      <div className={`mt-10 flex flex-1 flex-col items-center justify-center rounded-3xl p-8 ring-2 transition-colors ${feedbackColor}`}>
        <p className="text-center text-2xl font-semibold leading-snug">
          {before}
          <span className="mx-1 inline-block min-w-12 border-b-2 border-slate-400 dark:border-slate-500">&nbsp;</span>
          {after}
        </p>
        <p className="mt-6 text-center text-sm italic text-slate-500 dark:text-slate-400">{question.englishHint}</p>

        {feedback?.status === 'wrong' && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">{feedback.correctArticle}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{feedback.reason}</p>
          </div>
        )}
        {feedback?.status === 'correct' && (
          <p className="mt-6 text-lg font-semibold text-emerald-600 dark:text-emerald-400">Richtig!</p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handlePick(option)}
            disabled={!!feedback}
            className="h-16 rounded-full bg-white text-lg font-semibold shadow-sm ring-1 ring-slate-200 transition active:scale-95 disabled:opacity-60 dark:bg-slate-800 dark:ring-slate-700"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
