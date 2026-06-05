import { useDeployCheck } from './hooks/useDeployCheck'
import { Header } from './components/Header'
import { DomainInput } from './components/DomainInput'
import { CheckCard } from './components/CheckCard'
import { Summary } from './components/Summary'
import { CheckKey } from './types'

const STEPS: { id: CheckKey; title: string; description: string }[] = [
  { id: 'dns',      title: 'DNS разрешение',         description: 'Домен → IP-адрес сервера' },
  { id: 'http',     title: 'Доступность сервера',    description: 'HTTP и HTTPS подключение' },
  { id: 'ssl',      title: 'SSL сертификат',         description: 'Валидность и срок действия' },
  { id: 'redirect', title: 'HTTPS редирект',         description: 'HTTP → HTTPS' },
  { id: 'headers',  title: 'Заголовки безопасности', description: 'HSTS, CSP, X-Frame-Options' },
  { id: 'speed',    title: 'Скорость ответа',        description: 'Время ответа сервера' },
]

export default function App() {
  const { domain, setDomain, results, checkState, isRunning, runAll, reset } = useDeployCheck()

  const hasResults = Object.keys(results).length > 0
  const doneCount  = Object.values(checkState).filter((s) => s === 'done').length
  const allDone    = !isRunning && Object.keys(results).length === STEPS.length

  return (
    <div className="app-bg bg-texture">
      <Header />

      <main className="max-w-xl mx-auto px-4 py-6 space-y-3 pb-16">
        <DomainInput domain={domain} setDomain={setDomain} onStart={runAll} isRunning={isRunning} />

        {(isRunning || hasResults) && (
          <>
            <div className="flex items-center justify-between px-1 pt-1">
              <span className="progress-label text-[10px] font-semibold uppercase tracking-widest">
                Результаты
              </span>
              <span className="progress-total text-xs tabular-nums">
                <span className="progress-done">{doneCount}</span>
                {' / '}{STEPS.length}
              </span>
            </div>

            <progress
              className="progress-bar"
              value={doneCount}
              max={STEPS.length}
            />

            <div className="space-y-2">
              {STEPS.map((step, i) => (
                <CheckCard
                  key={step.id}
                  stepNumber={i + 1}
                  title={step.title}
                  description={step.description}
                  stepStatus={checkState[step.id]}
                  result={results[step.id]}
                />
              ))}
            </div>
          </>
        )}

        {allDone && <Summary results={results} domain={domain} onReset={reset} />}
      </main>
    </div>
  )
}
