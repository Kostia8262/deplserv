import { useState, useCallback } from 'react'
import { CheckResult, AllChecks, CheckState, CheckKey } from '../types'

const INITIAL_STATE: CheckState = {
  dns: 'idle', http: 'idle', ssl: 'idle',
  redirect: 'idle', headers: 'idle', speed: 'idle',
}

const ORDER: CheckKey[] = ['dns', 'http', 'ssl', 'redirect', 'headers', 'speed']

export function useDeployCheck() {
  const [domain, setDomain] = useState('')
  const [results, setResults] = useState<AllChecks>({})
  const [checkState, setCheckState] = useState<CheckState>(INITIAL_STATE)
  const [isRunning, setIsRunning] = useState(false)

  const runSingle = useCallback(
    async (key: CheckKey, dom: string): Promise<void> => {
      setCheckState((s) => ({ ...s, [key]: 'loading' }))
      try {
        const res = await fetch(`/api/checks/${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: dom }),
        })
        const data: CheckResult = await res.json()
        setResults((r) => ({ ...r, [key]: data }))
      } catch (e) {
        setResults((r) => ({
          ...r,
          [key]: { status: 'fail', title: 'Ошибка', message: String(e) },
        }))
      }
      setCheckState((s) => ({ ...s, [key]: 'done' }))
    },
    []
  )

  const runAll = useCallback(async () => {
    const d = domain.trim()
    if (!d) return
    setIsRunning(true)
    setResults({})
    setCheckState(INITIAL_STATE)
    for (const key of ORDER) {
      await runSingle(key, d)
      await new Promise<void>((r) => setTimeout(r, 200))
    }
    setIsRunning(false)
  }, [domain, runSingle])

  const reset = useCallback(() => {
    setDomain('')
    setResults({})
    setCheckState(INITIAL_STATE)
    setIsRunning(false)
  }, [])

  return { domain, setDomain, results, checkState, isRunning, runAll, reset }
}
