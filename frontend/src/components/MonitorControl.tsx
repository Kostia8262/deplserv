import { useState, useEffect } from 'react'
import { MonitorInterval } from '../hooks/useGuide'

interface Props {
  interval: MonitorInterval
  onChange: (v: MonitorInterval) => void
  nextCheckAt: number | null
}

const OPTIONS: { value: MonitorInterval; label: string }[] = [
  { value: 0,  label: 'Выкл.' },
  { value: 5,  label: '5 мин' },
  { value: 10, label: '10 мин' },
  { value: 30, label: '30 мин' },
]

function Countdown({ nextCheckAt }: { nextCheckAt: number }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const left = Math.max(0, Math.ceil((nextCheckAt - now) / 1000))
  const m = Math.floor(left / 60)
  const s = left % 60
  return (
    <span className="monitor-countdown">
      Следующая проверка через {m}:{String(s).padStart(2, '0')}
    </span>
  )
}

export function MonitorControl({ interval, onChange, nextCheckAt }: Props) {
  return (
    <div className="monitor-control">
      <div className="monitor-control-row">
        <span className="monitor-label">
          <span className={`monitor-pulse${interval > 0 ? ' monitor-pulse--active' : ''}`} />
          Авто-мониторинг
        </span>
        <div className="monitor-options">
          {OPTIONS.map(o => (
            <button
              key={o.value}
              type="button"
              className={`monitor-opt${interval === o.value ? ' monitor-opt--active' : ''}`}
              onClick={() => onChange(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      {interval > 0 && nextCheckAt && <Countdown nextCheckAt={nextCheckAt} />}
    </div>
  )
}
