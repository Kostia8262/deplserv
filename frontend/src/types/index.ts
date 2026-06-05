export type CheckStatus = 'idle' | 'loading' | 'pass' | 'fail' | 'warning'

export interface CheckResult {
  status: 'pass' | 'fail' | 'warning'
  title: string
  message: string
  details?: string[]
  suggestion?: string
  data?: Record<string, unknown>
}

export type CheckKey = 'dns' | 'http' | 'ssl' | 'redirect' | 'headers' | 'speed'

export type AllChecks = Partial<Record<CheckKey, CheckResult>>

export type CheckState = Record<CheckKey, 'idle' | 'loading' | 'done'>

export interface CheckStep {
  id: CheckKey
  title: string
  description: string
}
