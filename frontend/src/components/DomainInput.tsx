interface Props {
  domain: string
  setDomain: (v: string) => void
  onStart: () => void
  isRunning: boolean
}

const EXAMPLES = ['google.com', 'github.com', 'vercel.app']

export function DomainInput({ domain, setDomain, onStart, isRunning }: Props) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-center mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="domain-sep h-px flex-1" />
          <span className="domain-section-label text-[10px] tracking-widest uppercase font-medium">
            Шаг 1 из 7
          </span>
          <div className="domain-sep h-px flex-1" />
        </div>
        <h2 className="text-xl font-bold text-white">Введите домен вашего сайта</h2>
        <p className="domain-subtitle text-sm mt-1.5">Проверим DNS, SSL, HTTPS и производительность</p>
      </div>

      <div className="flex gap-2.5">
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="domain-globe-icon w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && domain.trim() && !isRunning && onStart()}
            placeholder="example.com"
            disabled={isRunning}
            className="input-dark w-full pl-10 pr-4 py-3.5 rounded-xl text-sm"
          />
        </div>
        <button
          type="button"
          onClick={onStart}
          disabled={!domain.trim() || isRunning}
          className="btn-primary px-5 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
        >
          {isRunning ? (
            <>
              <svg className="step-spinner animate-spin-slow w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Проверяем
            </>
          ) : (
            <>
              Запустить
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="domain-examples-prefix text-xs">Попробовать:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => !isRunning && setDomain(ex)}
            disabled={isRunning}
            className="example-chip text-xs px-2.5 py-1 rounded-lg"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
