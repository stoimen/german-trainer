type ProgressBarProps = {
  seen: number
  accuracy: number // 0..1
}

export default function ProgressBar({ seen, accuracy }: ProgressBarProps) {
  const pct = Math.round(accuracy * 100)
  return (
    <div className="flex items-center justify-center gap-4 px-4 text-sm text-slate-500 dark:text-slate-400">
      <span>Seen: {seen}</span>
      <span aria-hidden="true">·</span>
      <span>Accuracy: {seen === 0 ? '—' : `${pct}%`}</span>
    </div>
  )
}
