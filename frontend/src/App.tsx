import { useDeployCheck } from './hooks/useDeployCheck'
import { Header } from './components/Header'
import { DomainInput } from './components/DomainInput'
import { CheckCard } from './components/CheckCard'
import { Summary } from './components/Summary'
import { CheckKey } from './types'

const STEPS: { id: CheckKey; title: string; description: string }[] = [
  { id: 'dns',      title: 'DNS разрешение',         description: 'Домен указывает на IP-адрес сервера' },
  { id: 'http',     title: 'Доступность сервера',    description: 'Сервер отвечает по HTTP и HTTPS' },
  { id: 'ssl',      title: 'SSL сертификат',         description: 'Сертификат действителен и не истёк' },
  { id: 'redirect', title: 'HTTPS редирект',         description: 'HTTP автоматически → HTTPS' },
  { id: 'headers',  title: 'Заголовки безопасности', description: 'Важные HTTP заголовки присутствуют' },
  { id: 'speed',    title: 'Скорость ответа',        description: 'Сервер отвечает быстро' },
]

export default function App() {
  const { domain, setDomain, results, checkState, isRunning, runAll, reset } = useDeployCheck()

  const hasResults = Object.keys(results).length > 0
  const allDone = !isRunning && Object.keys(results).length === STEPS.length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-xl mx-auto px-4 py-6 space-y-3 pb-12">
        <DomainInput
          domain={domain}
          setDomain={setDomain}
          onStart={runAll}
          isRunning={isRunning}
        />

        {(isRunning || hasResults) && (
          <>
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Результаты проверки
              </p>
              {isRunning && (
                <p className="text-xs text-blue-500">
                  {Object.values(checkState).filter((s) => s === 'done').length} / {STEPS.length}
                </p>
              )}
            </div>

            <div className="space-y-2">
              {STEPS.map((step) => (
                <CheckCard
                  key={step.id}
                  title={step.title}
                  description={step.description}
                  stepStatus={checkState[step.id]}
                  result={results[step.id]}
                />
              ))}
            </div>
          </>
        )}

        {allDone && (
          <Summary results={results} domain={domain} onReset={reset} />
        )}
      </main>
    </div>
  )
}
