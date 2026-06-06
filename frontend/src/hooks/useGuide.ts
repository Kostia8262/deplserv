import { useState, useCallback } from 'react'
import { HostingType, AllChecks, CheckState, CheckKey, CheckResult } from '../types'

const INITIAL_CHECK_STATE: CheckState = {
  dns: 'idle', http: 'idle', ssl: 'idle',
  redirect: 'idle', headers: 'idle', speed: 'idle',
}
const CHECK_ORDER: CheckKey[] = ['dns', 'http', 'ssl', 'redirect', 'headers', 'speed']

export function useGuide() {
  const [currentPhase, setCurrentPhase] = useState(1)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [hostingType, setHostingType] = useState<HostingType | null>(null)
  const [domain, setDomain] = useState('')
  const [checkResults, setCheckResults] = useState<AllChecks>({})
  const [checkState, setCheckState] = useState<CheckState>(INITIAL_CHECK_STATE)
  const [isRunning, setIsRunning] = useState(false)
  const [allChecked, setAllChecked] = useState(false)

  const toggleItem = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const goToPhase = useCallback((n: number) => setCurrentPhase(n), [])

  const nextPhase = useCallback(() =>
    setCurrentPhase((p) => Math.min(p + 1, 6)), [])

  const prevPhase = useCallback(() =>
    setCurrentPhase((p) => Math.max(p - 1, 1)), [])

  const runSingle = useCallback(async (key: CheckKey, d: string): Promise<void> => {
    setCheckState((s) => ({ ...s, [key]: 'loading' }))
    try {
      const res = await fetch(`/api/checks/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: d }),
      })
      const data: CheckResult = await res.json()
      setCheckResults((r) => ({ ...r, [key]: data }))
    } catch (e) {
      setCheckResults((r) => ({
        ...r, [key]: { status: 'fail', title: 'Ошибка', message: String(e) },
      }))
    }
    setCheckState((s) => ({ ...s, [key]: 'done' }))
  }, [])

  const runChecks = useCallback(async () => {
    if (!domain.trim()) return
    setIsRunning(true)
    setAllChecked(false)
    setCheckResults({})
    setCheckState(INITIAL_CHECK_STATE)
    for (const key of CHECK_ORDER) {
      await runSingle(key, domain.trim())
      await new Promise<void>((r) => setTimeout(r, 200))
    }
    setIsRunning(false)
    setAllChecked(true)
  }, [domain, runSingle])

  const resetChecks = useCallback(() => {
    setCheckResults({})
    setCheckState(INITIAL_CHECK_STATE)
    setIsRunning(false)
    setAllChecked(false)
  }, [])

  return {
    currentPhase, setCurrentPhase,
    checked, toggleItem,
    hostingType, setHostingType,
    domain, setDomain,
    checkResults, checkState, isRunning, allChecked,
    runChecks, resetChecks,
    goToPhase, nextPhase, prevPhase,
  }
}
