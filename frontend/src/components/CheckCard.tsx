import { useState } from 'react'
import { CheckResult } from '../types'

interface Props {
  title: string
  description: string
  stepStatus: 'idle' | 'loading' | 'done'
  result?: CheckResult
}

function Icon({ stepStatus, result }: Pick<Props, 'stepStatus' | 'result'>) {
  if (stepStatus === 'loading') {
    return (
      <svg className="animate-spin w-6 h-6 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    )
  }
  if (stepStatus === 'done' && result) {
    if (result.status === 'pass') {
      return (
        <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      )
    }
    if (result.status === 'fail') {
      return (
        <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
      )
    }
    return (
      <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
    )
  }
  return (
    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
      <div className="w-2 h-2 bg-gray-300 rounded-full"/>
    </div>
  )
}

const borderClass = (s: Props['stepStatus'], r?: CheckResult) => {
  if (s !== 'done' || !r) return 'border-gray-100'
  return r.status === 'pass' ? 'border-green-100' : r.status === 'fail' ? 'border-red-100' : 'border-amber-100'
}

const bgClass = (s: Props['stepStatus']) =>
  s === 'loading' ? 'bg-blue-50/50' : 'bg-white'

export function CheckCard({ title, description, stepStatus, result }: Props) {
  const [open, setOpen] = useState(false)
  const hasDetails = stepStatus === 'done' && result && (result.details?.length || result.suggestion)

  return (
    <div className={`rounded-2xl border ${borderClass(stepStatus, result)} ${bgClass(stepStatus)} overflow-hidden transition-all`}>
      <button
        className="w-full p-4 flex items-center gap-3 text-left"
        onClick={() => hasDetails && setOpen((v) => !v)}
      >
        <Icon stepStatus={stepStatus} result={result}/>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {stepStatus === 'idle' ? description
              : stepStatus === 'loading' ? 'Выполняется проверка…'
              : result?.message ?? ''}
          </p>
        </div>
        {hasDetails && (
          <svg
            className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        )}
      </button>

      {open && result && (
        <div className="px-4 pb-4 space-y-2 border-t border-gray-100">
          {result.details && result.details.length > 0 && (
            <ul className="mt-2 space-y-1">
              {result.details.map((d, i) => (
                <li key={i} className="text-xs font-mono bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg">{d}</li>
              ))}
            </ul>
          )}
          {result.suggestion && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-2">
              <p className="text-xs text-blue-800">
                <span className="font-bold">Как исправить: </span>
                {result.suggestion}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
