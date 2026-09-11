import type { SessionRecord } from '../lib/history'

type AccuracyChartProps = {
  sessions: SessionRecord[]
}

const WIDTH = 300
const HEIGHT = 80
const BAR_GAP = 4

export default function AccuracyChart({ sessions }: AccuracyChartProps) {
  if (sessions.length === 0) {
    return <p className="text-sm text-slate-400 dark:text-slate-500">No sessions yet.</p>
  }

  const recent = sessions.slice(-20)
  const barWidth = (WIDTH - BAR_GAP * (recent.length - 1)) / recent.length

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Accuracy per session over time">
      {[0, 0.5, 1].map((frac) => (
        <line
          key={frac}
          x1={0}
          x2={WIDTH}
          y1={HEIGHT - frac * HEIGHT}
          y2={HEIGHT - frac * HEIGHT}
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth={1}
        />
      ))}
      {recent.map((session, i) => {
        const barHeight = Math.max(2, session.accuracy * HEIGHT)
        const x = i * (barWidth + BAR_GAP)
        const y = HEIGHT - barHeight
        const color = session.accuracy >= 0.8 ? '#10b981' : session.accuracy >= 0.5 ? '#f59e0b' : '#f43f5e'
        return (
          <rect key={session.timestamp} x={x} y={y} width={barWidth} height={barHeight} rx={2} fill={color}>
            <title>{`${new Date(session.timestamp).toLocaleDateString()}: ${Math.round(session.accuracy * 100)}%`}</title>
          </rect>
        )
      })}
    </svg>
  )
}
