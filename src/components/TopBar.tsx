import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

type TopBarProps = {
  title: string
}

export default function TopBar({ title }: TopBarProps) {
  const { isDark, toggle } = useTheme()

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-3">
      <Link
        to="/"
        className="flex h-11 items-center rounded-full px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        ← Home
      </Link>
      <h1 className="truncate text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h1>
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle dark mode"
        className="flex h-11 w-11 items-center justify-center rounded-full text-lg transition hover:bg-slate-200 dark:hover:bg-slate-800"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </div>
  )
}
