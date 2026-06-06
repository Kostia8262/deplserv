import { useState, useEffect, useCallback } from 'react'
import { AllChecks, HistoryEntry } from '../types'

const STORAGE_KEY = 'deploychecker_history'
const MAX_ENTRIES = 15

export function calcScore(results: AllChecks): number {
  const vals = Object.values(results).filter(Boolean)
  if (vals.length === 0) return 0
  const passes = vals.filter(r => r?.status === 'pass').length
  return Math.round((passes / vals.length) * 100)
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as HistoryEntry[]
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const addEntry = useCallback((domain: string, results: AllChecks) => {
    if (!domain || Object.keys(results).length === 0) return
    const entry: HistoryEntry = {
      id: String(Date.now()),
      domain,
      timestamp: Date.now(),
      results,
      score: calcScore(results),
    }
    setHistory(prev =>
      [entry, ...prev.filter(e => e.domain !== domain)].slice(0, MAX_ENTRIES)
    )
  }, [])

  const clearHistory = useCallback(() => setHistory([]), [])

  return { history, addEntry, clearHistory }
}
