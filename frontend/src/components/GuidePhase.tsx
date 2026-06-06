import { useState } from 'react'
import { GuidePhaseData, GuideBlock, HostingType, GuideCheckItem } from '../types'

interface Props {
  phase: GuidePhaseData
  isActive: boolean
  isCompleted: boolean
  hostingType: HostingType | null
  setHostingType: (t: HostingType) => void
  checked: Record<string, boolean>
  toggleItem: (id: string) => void
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
  children?: React.ReactNode
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button type="button" className="code-copy-btn" onClick={handleCopy}>
      {copied ? '✓ Скопировано' : 'Копировать'}
    </button>
  )
}

// ─── Content renderers ────────────────────────────────────────────────────────
function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case 'h3':
      return <h3 className="guide-h3">{block.text}</h3>
    case 'para':
      return <p className="guide-para">{block.text}</p>
    case 'list':
      return (
        <ul className="guide-list">
          {(block.items ?? []).map((item, i) => (
            <li key={i} className="guide-list-item">
              <span className="guide-list-dot" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'code':
      return (
        <div className="guide-code-wrapper">
          <pre className="guide-code"><code>{block.text}</code></pre>
          {block.text && <CopyButton text={block.text} />}
        </div>
      )
    case 'tip':
      return (
        <div className="guide-tip">
          <span className="guide-tip-icon">💡</span>
          <p>{block.text}</p>
        </div>
      )
    case 'warn':
      return (
        <div className="guide-warn">
          <span className="guide-warn-icon">⚠️</span>
          <p>{block.text}</p>
        </div>
      )
    case 'info':
      return (
        <div className="guide-info">
          <span className="guide-info-icon">ℹ️</span>
          <p>{block.text}</p>
        </div>
      )
    default:
      return null
  }
}

function HostingChoice({ hostingType, setHostingType }: { hostingType: HostingType | null; setHostingType: (t: HostingType) => void }) {
  const OPTIONS: { type: HostingType; icon: string; title: string; sub: string; badge: string; badgeCls: string; desc: string }[] = [
    {
      type: 'shared', icon: '🏠', title: 'Shared Hosting',
      sub: 'Hostinger, Beget, TimeWeb',
      badge: 'Для новичков', badgeCls: 'badge-green',
      desc: 'Готовая панель управления, File Manager, 1-кликовый SSL. Цены от $2–5/мес.'
    },
    {
      type: 'vps', icon: '🖥', title: 'VPS / VDS',
      sub: 'Hetzner, DigitalOcean, Hostinger VPS',
      badge: 'Больше контроля', badgeCls: 'badge-blue',
      desc: 'Свой сервер, Linux, Nginx. Нужны базовые знания терминала. От $4–8/мес.'
    },
    {
      type: 'cloud', icon: '☁️', title: 'Vercel / Netlify',
      sub: 'Для React, Vue, Next.js',
      badge: 'Бесплатно!', badgeCls: 'badge-teal',
      desc: 'Деплой через git push, авто-SSL, глобальный CDN. Идеально для статических сайтов.'
    },
  ]

  return (
    <div className="hosting-grid">
      {OPTIONS.map((o) => (
        <button
          key={o.type}
          type="button"
          className={`hosting-card${hostingType === o.type ? ' hosting-card--active' : ''}`}
          onClick={() => setHostingType(o.type)}
        >
          <div className="hosting-card-top">
            <span className="hosting-card-icon">{o.icon}</span>
            <span className={`hosting-badge ${o.badgeCls}`}>{o.badge}</span>
          </div>
          <p className="hosting-card-title">{o.title}</p>
          <p className="hosting-card-sub">{o.sub}</p>
          <p className="hosting-card-desc">{o.desc}</p>
          {hostingType === o.type && (
            <div className="hosting-card-check">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

function CheckItem({ item, checked, onToggle }: { item: GuideCheckItem; checked: boolean; onToggle: () => void }) {
  return (
    <label className="checklist-item">
      <button type="button" className={`checklist-box${checked ? ' checklist-box--checked' : ''}`} onClick={onToggle}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span className={`checklist-text${checked ? ' checklist-text--done' : ''}`}>{item.text}</span>
    </label>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export function GuidePhase({ phase, isActive, isCompleted, hostingType, setHostingType, checked, toggleItem, onNext, onPrev, isFirst, isLast, children }: Props) {
  const allItems: GuideCheckItem[] = phase.steps.flatMap(s =>
    s.checkItems.filter(item => !item.forHosting || !hostingType || item.forHosting.includes(hostingType))
  )
  const allDone = allItems.length === 0 || allItems.every(item => checked[item.id])

  return (
    <div className={`phase-wrapper${isActive ? ' phase-wrapper--active' : ''}`}>
      <button type="button" className="phase-header" onClick={() => {}}>
        <div className="phase-header-left">
          <div className={`phase-num${isCompleted ? ' phase-num--done' : isActive ? ' phase-num--active' : ''}`}>
            {isCompleted ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span>{phase.id}</span>
            )}
          </div>
          <div>
            <p className="phase-name">{phase.icon} {phase.name}</p>
            {isCompleted && <p className="phase-done-label">Завершено</p>}
          </div>
        </div>
      </button>

      {isActive && (
        <div className="phase-body">
          {phase.steps.map(step => {
            const visibleBlocks = step.blocks.filter(
              b => !b.forHosting || !hostingType || b.forHosting.includes(hostingType)
            )
            const visibleItems = step.checkItems.filter(
              item => !item.forHosting || !hostingType || item.forHosting.includes(hostingType)
            )

            return (
              <div key={step.id} className="guide-step">
                <div className="guide-step-header">
                  <span className="guide-step-icon">{step.icon}</span>
                  <div>
                    <p className="guide-step-title">{step.title}</p>
                    <p className="guide-step-sub">{step.subtitle}</p>
                  </div>
                </div>

                {visibleBlocks.length > 0 && (
                  <div className="guide-blocks">
                    {visibleBlocks.map((block, i) => <Block key={i} block={block} />)}
                  </div>
                )}

                {step.isHostingChoice && (
                  <HostingChoice hostingType={hostingType} setHostingType={setHostingType} />
                )}

                {step.links && step.links.length > 0 && (
                  <div className="guide-links">
                    <p className="guide-links-label">Полезные ссылки:</p>
                    <div className="guide-links-row">
                      {step.links.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noreferrer" className="guide-link">
                          {link.label}
                          {link.note && <span className="guide-link-note"> — {link.note}</span>}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {visibleItems.length > 0 && (
                  <div className="checklist">
                    <p className="checklist-label">Отметьте когда готово:</p>
                    {visibleItems.map(item => (
                      <CheckItem
                        key={item.id}
                        item={item}
                        checked={!!checked[item.id]}
                        onToggle={() => toggleItem(item.id)}
                      />
                    ))}
                  </div>
                )}

                {step.id === 'auto-checks' && children}
              </div>
            )
          })}

          <div className="phase-nav">
            {!isFirst && (
              <button type="button" className="phase-nav-back" onClick={onPrev}>
                ← Назад
              </button>
            )}
            {!isLast && (
              <button
                type="button"
                className={`phase-nav-next${allDone ? '' : ' phase-nav-next--disabled'}`}
                onClick={allDone ? onNext : undefined}
                disabled={!allDone}
              >
                {allDone ? 'Далее →' : 'Отметьте все пункты'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
