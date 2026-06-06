import { useEffect } from 'react'
import { useGuide } from './hooks/useGuide'
import { useHistory } from './hooks/useHistory'
import { Header } from './components/Header'
import { DomainInput } from './components/DomainInput'
import { CheckCard } from './components/CheckCard'
import { Summary } from './components/Summary'
import { GuidePhase } from './components/GuidePhase'
import { HistoryPanel } from './components/HistoryPanel'
import { MonitorControl } from './components/MonitorControl'
import { GUIDE_PHASES } from './data/guide'
import { CheckKey, HistoryEntry } from './types'

const CHECK_STEPS: { id: CheckKey; title: string; description: string }[] = [
  { id: 'dns',       title: 'DNS разрешение',         description: 'Домен → IP-адрес сервера' },
  { id: 'http',      title: 'Доступность сервера',    description: 'HTTP и HTTPS подключение' },
  { id: 'ssl',       title: 'SSL сертификат',         description: 'Валидность и срок действия' },
  { id: 'redirect',  title: 'HTTPS редирект',         description: 'HTTP → HTTPS' },
  { id: 'headers',   title: 'Заголовки безопасности', description: 'HSTS, CSP, X-Frame-Options' },
  { id: 'speed',     title: 'Скорость ответа',        description: 'Время ответа сервера' },
  { id: 'seo',       title: 'SEO-базис',              description: 'Title, description, OG-теги, sitemap' },
  { id: 'mixed',     title: 'Mixed Content',          description: 'HTTP-ресурсы на HTTPS-странице' },
  { id: 'email',     title: 'Email DNS',              description: 'SPF, DKIM, DMARC записи' },
  { id: 'whois',     title: 'WHOIS / Домен',          description: 'Срок действия домена' },
  { id: 'pagespeed', title: 'PageSpeed',              description: 'Core Web Vitals — Google' },
]

export default function App() {
  const guide = useGuide()
  const {
    currentPhase, checked, toggleItem,
    hostingType, setHostingType,
    domain, setDomain,
    checkResults, checkState, isRunning, allChecked,
    runChecks, resetChecks,
    nextPhase, prevPhase, goToPhase,
    monitorInterval, setMonitorInterval, nextCheckAt,
  } = guide

  const { history, addEntry, clearHistory } = useHistory()

  const doneCount  = Object.values(checkState).filter(s => s === 'done').length
  const hasResults = Object.keys(checkResults).length > 0

  // Save to history when checks finish
  useEffect(() => {
    if (allChecked && domain && Object.keys(checkResults).length > 0) {
      addEntry(domain, checkResults)
    }
  }, [allChecked]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadFromHistory = (entry: HistoryEntry) => {
    setDomain(entry.domain)
  }

  return (
    <div className="app-bg bg-texture">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6 pb-20 space-y-2">
        {/* Phase timeline */}
        <div className="phase-timeline">
          {GUIDE_PHASES.map(p => (
            <button
              key={p.id}
              type="button"
              className={`phase-dot${currentPhase === p.id ? ' phase-dot--active' : currentPhase > p.id ? ' phase-dot--done' : ''}`}
              onClick={() => currentPhase > p.id && goToPhase(p.id)}
              title={p.name}
            >
              {currentPhase > p.id ? (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>{p.id}</span>
              )}
            </button>
          ))}
        </div>
        <div className="phase-timeline-labels">
          {GUIDE_PHASES.map(p => (
            <span key={p.id} className={`phase-timeline-label${currentPhase === p.id ? ' phase-timeline-label--active' : ''}`}>
              {p.name}
            </span>
          ))}
        </div>

        {/* Phases */}
        {GUIDE_PHASES.map(phase => (
          <GuidePhase
            key={phase.id}
            phase={phase}
            isActive={currentPhase === phase.id}
            isCompleted={currentPhase > phase.id}
            hostingType={hostingType}
            setHostingType={setHostingType}
            checked={checked}
            toggleItem={toggleItem}
            onNext={nextPhase}
            onPrev={prevPhase}
            isFirst={phase.id === 1}
            isLast={phase.id === GUIDE_PHASES.length}
          >
            {/* Phase 6: automated checks slot */}
            {phase.id === 6 && (
              <div className="space-y-3 mt-4">
                <HistoryPanel
                  history={history}
                  onLoad={loadFromHistory}
                  onClear={clearHistory}
                />

                <DomainInput
                  domain={domain}
                  setDomain={setDomain}
                  onStart={runChecks}
                  isRunning={isRunning}
                />

                {(isRunning || hasResults) && (
                  <>
                    <div className="flex items-center justify-between px-1">
                      <span className="progress-label text-[10px] font-semibold uppercase tracking-widest">
                        Проверки
                      </span>
                      <span className="progress-total text-xs tabular-nums">
                        <span className="progress-done">{doneCount}</span>
                        {' / '}{CHECK_STEPS.length}
                      </span>
                    </div>
                    <progress className="progress-bar" value={doneCount} max={CHECK_STEPS.length} />

                    <div className="space-y-2">
                      {CHECK_STEPS.map((step, i) => (
                        <CheckCard
                          key={step.id}
                          stepNumber={i + 1}
                          title={step.title}
                          description={step.description}
                          stepStatus={checkState[step.id]}
                          result={checkResults[step.id]}
                        />
                      ))}
                    </div>
                  </>
                )}

                {allChecked && (
                  <>
                    <MonitorControl
                      interval={monitorInterval}
                      onChange={setMonitorInterval}
                      nextCheckAt={nextCheckAt}
                    />
                    <Summary
                      results={checkResults}
                      domain={domain}
                      onReset={resetChecks}
                      onFinish={nextPhase}
                    />
                  </>
                )}
              </div>
            )}
          </GuidePhase>
        ))}

        {/* Done screen */}
        {currentPhase > GUIDE_PHASES.length && (
          <div className="done-screen glass rounded-2xl p-8 text-center animate-slide-up">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Сайт работает!</h2>
            <p className="text-secondary mb-6">
              Поздравляем! Ваш сайт прошёл все проверки и доступен в интернете.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://${domain}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              >
                Открыть {domain}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <button type="button" onClick={() => goToPhase(6)} className="reset-btn px-6 py-3 rounded-xl text-sm font-semibold">
                Запустить проверки снова
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
