export interface CheckResult {
  status: 'pass' | 'fail' | 'warning'
  title: string
  message: string
  details?: string[]
  suggestion?: string
  data?: Record<string, unknown>
}
