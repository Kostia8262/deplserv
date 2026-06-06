import { useState, useCallback, useEffect, useRef } from 'react'
import { HostingType, AllChecks, CheckState, CheckKey, CheckResult } from '../types'

const ALL_KEYS: CheckKey[] = ['dns', 'http', 'ssl', 'redirect', 'headers', 'speed', 'seo', 'mixed', 'email', 'whois', 'pagespeed']

const INITIAL_CHECK_STATE: CheckState = Object.fromEntries(
  ALL_KEYS.map(k => [k, 'idle'])
) as CheckState

export type MonitorInterval = 0 | 5 | 10 | 30

function readParam(key: string): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get(key)
}

export function useGuide() {
  const [currentPhase, setCurrentPhase] = useState<number>(() => {
    const p = parseInt(readParam('phase') ?? '1')
    return isNaN(p) ? 1 : Math.min(Math.max(p, 1), 6)
  })
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [hostingType, setHostingType] = useState<HostingType | null>(() => {
    const h = readParam('hosting')
    return h === 'shared' || h === 'vps' || h === 'cloud' ? h : null
  })
  const [domain, setDomain] = useState<string>(() => readParam('domain') ?? '')
  const [checkResults, setCheckResults] = useState<AllChecks>({})
  const [checkState, setCheckState] = useState<CheckState>(INITIAL_CHECK_STATE)
  const [isRunning, setIsRunning] = useState(false)
  const [allChecked, setAllChecked] = useState(false)
  const [monitorInterval, setMonitorInterval] = useState<MonitorInterval>(0)
  const [nextCheckAt, setNextCheckAt] = useState<number | null>(null)
  const monitorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync state → URL params
  useEffect(() => {
    const params = new URLSearchParams()
    if (currentPhase > 1) params.set('phase', String(currentPhase))
    if (hostingType) params.set('hosting', hostingType)
    if (domain) params.set('domain', domain)
    const str = params.toString()
    window.history.replaceState({}, '', str ? `?${str}` : window.location.pathname)
  }, [currentPhase, hostingType, domain])

  const toggleItem = useCallback((id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const goToPhase = useCallback((n: number) => setCurrentPhase(n), [])
  const nextPhase = useCallback(() => setCurrentPhase(p => p + 1), [])
  const prevPhase = useCallback(() => setCurrentPhase(p => Math.max(p - 1, 1)), [])

  const runSingle = useCallback(async (key: CheckKey, d: string): Promise<void> => {
    setCheckState(s => ({ ...s, [key]: 'loading' }))
    try {
      const res = await fetch(`/api/checks/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: d }),
      })
      const data: CheckResult = await res.json() as CheckResult
      setCheckResults(r => ({ ...r, [key]: data }))
    } catch (e) {
      setCheckResults(r => ({
        ...r, [key]: { status: 'fail', title: 'Ошибка', message: String(e) },
      }))
    }
    setCheckState(s => ({ ...s, [key]: 'done' }))
  }, [])

  const runChecks = useCallback(async () => {
    if (!domain.trim()) return
    setIsRunning(true)
    setAllChecked(false)
    setCheckResults({})
    setCheckState(INITIAL_CHECK_STATE)
    for (const key of ALL_KEYS) {
      await runSingle(key, domain.trim())
      await new Promise<void>(r => setTimeout(r, 150))
    }
    setIsRunning(false)
    setAllChecked(true)
  }, [domain, runSingle])

  const resetChecks = useCallback(() => {
    setCheckResults({})
    setCheckState(INITIAL_CHECK_STATE)
    setIsRunning(false)
    setAllChecked(false)
    setNextCheckAt(null)
    if (monitorTimerRef.current) clearTimeout(monitorTimerRef.current)
  }, [])

  // Schedule next check when monitor is enabled and checks just finished
  useEffect(() => {
    if (!allChecked || monitorInterval === 0) return
    if (monitorTimerRef.current) clearTimeout(monitorTimerRef.current)
    const delay = monitorInterval * 60 * 1000
    setNextCheckAt(Date.now() + delay)
    monitorTimerRef.current = setTimeout(() => {
      void runChecks()
    }, delay)
    return () => { if (monitorTimerRef.current) clearTimeout(monitorTimerRef.current) }
  }, [allChecked, monitorInterval, runChecks])

  // Cancel timer when monitor is disabled
  useEffect(() => {
    if (monitorInterval === 0) {
      if (monitorTimerRef.current) clearTimeout(monitorTimerRef.current)
      setNextCheckAt(null)
    }
  }, [monitorInterval])

  return {
    currentPhase, setCurrentPhase,
    checked, toggleItem,
    hostingType, setHostingType,
    domain, setDomain,
    checkResults, checkState, isRunning, allChecked,
    runChecks, resetChecks,
    goToPhase, nextPhase, prevPhase,
    monitorInterval, setMonitorInterval,
    nextCheckAt,
  }
}
