import { useState } from 'react'
import { CheckResult } from '../types'

interface Props {
  stepNumber: number
  title: string
  description: string
  stepStatus: 'idle' | 'loading' | 'done'
  result?: CheckResult
}

const CARD_CLASS: Record<string, string> = {
  idle: 'card-idle', loading: 'card-loading',
  pass: 'card-pass', fail: 'card-fail', warning: 'card-warning',
}
const ICON_CLASS: Record<string, string> = {
  pass: 'step-icon-pass', fail: 'step-icon-fail', warning: 'step-icon-warn',
}
const BADGE_CLASS: Record<string, string> = {
  pass: 'badge-pass', fail: 'badge-fail', warning: 'badge-warning',
}
const BADGE_LABEL: Record<string, string> = {
  pass: 'OK', fail: 'Ошибка', warning: 'Внимание',
}

function StatusIcon({ stepStatus, result }: Pick<Props, 'stepStatus' | 'result'>) {
  if (stepStatus === 'loading') {
    return (
      <svg className="step-spinner animate-spin-slow w-5 h-5 flex-shrink-0"
           fill="none" viewBox="0 0 24 24">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    )
  }
  if (stepStatus === 'done' && result) {
    const cls = ICON_CLASS[result.status] ?? 'step-icon-idle'
    return (
      <div className={`${cls} w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0`}>
        {result.status === 'pass' && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {result.status === 'fail' && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {result.status === 'warning' && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
      </div>
    )
  }
  return (
    <div className="step-icon-idle w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
      <div className="step-icon-idle-dot w-1.5 h-1.5 rounded-full" />
    </div>
  )
}

export function CheckCard({ stepNumber, title, description, stepStatus, result }: Props) {
  const [open, setOpen] = useState(false)
  const hasDetails = stepStatus === 'done' && result && (result.details?.length || result.suggestion)

  const cardKey = stepStatus === 'done' && result ? result.status : stepStatus
  const cardCls = CARD_CLASS[cardKey] ?? 'card-idle'

  return (
    <div className={`${cardCls} rounded-2xl overflow-hidden transition-all duration-300`}>
      <button
        type="button"
        className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
        onClick={() => hasDetails && setOpen((v) => !v)}
      >
        <div className="step-num w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
          {stepNumber}
        </div>

        <StatusIcon stepStatus={stepStatus} result={result} />

        <div className="flex-1 min-w-0">
          <p className="card-title text-sm font-semibold">{title}</p>
          <p className="card-msg text-xs mt-0.5 truncate">
            {stepStatus === 'loading' ? 'Выполняется проверка…'
              : stepStatus === 'idle' ? description
              : (result?.message ?? '')}
          </p>
        </div>

        {stepStatus === 'done' && result && (
          <span className={`${BADGE_CLASS[result.status]} text-[11px] px-2.5 py-1 rounded-lg font-semibold flex-shrink-0`}>
            {BADGE_LABEL[result.status]}
          </span>
        )}

        {hasDetails && (
          <svg
            className={`card-chevron w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {open && result && (
        <div className="card-details-border px-4 pb-4 pt-0 space-y-2 animate-fade-in">
          {result.details && result.details.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {result.details.map((d, i) => (
                <li key={i} className="detail-row text-xs font-mono px-3 py-2 rounded-xl">{d}</li>
              ))}
            </ul>
          )}
          {result.suggestion && (
            <div className="suggest-box rounded-xl p-3 mt-1">
              <p className="suggest-text text-xs leading-relaxed">
                <span className="font-bold text-white">Как исправить: </span>
                {result.suggestion}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
