import { AllChecks } from '../types'

interface Props {
  results: AllChecks
  domain: string
  onReset: () => void
}

const STATS = [
  { key: 'pass',    label: 'Прошли',   card: 'stat-ok',   val: 'stat-val-ok'   },
  { key: 'warning', label: 'Внимание', card: 'stat-warn', val: 'stat-val-warn' },
  { key: 'fail',    label: 'Ошибки',   card: 'stat-err',  val: 'stat-val-err'  },
] as const

export function Summary({ results, domain, onReset }: Props) {
  const vals = Object.values(results)
  const counts = {
    pass:    vals.filter((r) => r?.status === 'pass').length,
    warning: vals.filter((r) => r?.status === 'warning').length,
    fail:    vals.filter((r) => r?.status === 'fail').length,
  }
  const score = Math.round((counts.pass / vals.length) * 100)
  const isHealthy = counts.fail === 0
  const scoreClass = score === 100 ? 'score-perfect' : score >= 66 ? 'score-mid' : 'score-low'

  return (
    <div className="glass rounded-2xl overflow-hidden animate-slide-up">
      <div className={`h-[3px] w-full ${isHealthy ? 'summary-bar-ok' : 'summary-bar-err'}`} />

      <div className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className={`${isHealthy ? 'summary-icon-ok' : 'summary-icon-err'} w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0`}>
            {isHealthy ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-white">
              {isHealthy ? 'Сайт работает!' : 'Обнаружены проблемы'}
            </h3>
            <p className="summary-domain text-xs mt-0.5 truncate">{domain}</p>
          </div>

          <div className="text-right">
            <p className={`${scoreClass} text-3xl font-bold tabular-nums`}>{score}%</p>
            <p className="summary-score-label text-[10px] uppercase tracking-wider mt-0.5">Оценка</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {STATS.map((s) => (
            <div key={s.key} className={`${s.card} rounded-xl p-3 text-center`}>
              <p className={`${s.val} text-2xl font-bold tabular-nums`}>{counts[s.key]}</p>
              <p className="stat-lbl text-[11px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <button type="button" onClick={onReset} className="reset-btn w-full py-3 rounded-xl text-sm font-semibold">
          Проверить другой домен
        </button>
      </div>
    </div>
  )
}
