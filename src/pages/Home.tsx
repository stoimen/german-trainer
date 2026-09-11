import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

const MODES = [
  {
    to: '/artikel',
    title: 'Artikel',
    subtitle: 'der / die / das',
    emoji: '📰',
  },
  {
    to: '/vokabeln',
    title: 'Vokabeln',
    subtitle: 'English → German',
    emoji: '🗂️',
  },
  {
    to: '/deklination',
    title: 'Deklination',
    subtitle: 'Case endings',
    emoji: '🧩',
  },
]

export default function Home() {
  const { isDark, toggle } = useTheme()

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deutsch Trainer</h1>
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle dark mode"
          className="flex h-11 w-11 items-center justify-center rounded-full text-lg transition hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      <p className="mt-2 text-slate-500 dark:text-slate-400">Choose a practice mode.</p>

      <div className="mt-10 flex flex-1 flex-col gap-5">
        {MODES.map((mode) => (
          <Link
            key={mode.to}
            to={mode.to}
            className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition active:scale-[0.98] dark:bg-slate-800 dark:ring-slate-700"
          >
            <span className="text-4xl" aria-hidden="true">
              {mode.emoji}
            </span>
            <span className="flex flex-col text-left">
              <span className="text-xl font-semibold">{mode.title}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{mode.subtitle}</span>
            </span>
          </Link>
        ))}
      </div>

      <Link
        to="/stats"
        className="mt-6 self-center rounded-full px-4 py-2 text-sm font-medium text-slate-500 underline-offset-4 hover:underline dark:text-slate-400"
      >
        View stats
      </Link>
    </div>
  )
}
