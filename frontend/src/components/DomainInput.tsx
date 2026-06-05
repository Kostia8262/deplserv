interface Props {
  domain: string
  setDomain: (v: string) => void
  onStart: () => void
  isRunning: boolean
}

export function DomainInput({ domain, setDomain, onStart, isRunning }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="text-center mb-5">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900">Введите домен вашего сайта</h2>
        <p className="text-sm text-gray-400 mt-1">
          Мы пройдём по всем шагам и покажем что работает, а что нет
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && domain.trim() && !isRunning && onStart()}
          placeholder="example.com"
          disabled={isRunning}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-50 disabled:text-gray-400 transition"
        />
        <button
          onClick={onStart}
          disabled={!domain.trim() || isRunning}
          className="px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold
            hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
            transition-all whitespace-nowrap"
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Проверяем
            </span>
          ) : 'Проверить'}
        </button>
      </div>
    </div>
  )
}
