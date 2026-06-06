import { HistoryEntry } from '../types'

interface Props {
  history: HistoryEntry[]
  onLoad: (entry: HistoryEntry) => void
  onClear: () => void
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'только что'
  if (m < 60) return `${m} мин. назад`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} ч. назад`
  return `${Math.floor(h / 24)} дн. назад`
}

function ScoreDot({ score }: { score: number }) {
  const cls = score >= 80 ? 'score-dot--pass' : score >= 50 ? 'score-dot--warn' : 'score-dot--fail'
  return <span className={`score-dot ${cls}`}>{score}%</span>
}

export function HistoryPanel({ history, onLoad, onClear }: Props) {
  if (history.length === 0) return null

  return (
    <div className="history-panel glass rounded-2xl p-4">
      <div className="history-header">
        <span className="history-title">История проверок</span>
        <button type="button" className="history-clear-btn" onClick={onClear}>Очистить</button>
      </div>
      <ul className="history-list">
        {history.map(entry => (
          <li key={entry.id}>
            <button type="button" className="history-item" onClick={() => onLoad(entry)}>
              <div className="history-item-left">
                <span className="history-item-domain">{entry.domain}</span>
                <span className="history-item-time">{timeAgo(entry.timestamp)}</span>
              </div>
              <ScoreDot score={entry.score} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
