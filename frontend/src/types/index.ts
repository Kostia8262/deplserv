export type CheckStatus = 'idle' | 'loading' | 'pass' | 'fail' | 'warning'
export type HostingType = 'shared' | 'vps' | 'cloud'

export interface CheckResult {
  status: 'pass' | 'fail' | 'warning'
  title: string
  message: string
  details?: string[]
  suggestion?: string
  data?: Record<string, unknown>
}

export type CheckKey =
  | 'dns' | 'http' | 'ssl' | 'redirect' | 'headers' | 'speed'
  | 'seo' | 'mixed' | 'email' | 'whois' | 'pagespeed'

export type AllChecks = Partial<Record<CheckKey, CheckResult>>
export type CheckState = Record<CheckKey, 'idle' | 'loading' | 'done'>

// ─── History ──────────────────────────────────────────────────────────────────
export interface HistoryEntry {
  id: string
  domain: string
  timestamp: number
  results: AllChecks
  score: number
}

// ─── Guide types ──────────────────────────────────────────────────────────────
export interface GuideBlock {
  type: 'para' | 'h3' | 'list' | 'code' | 'tip' | 'warn' | 'info'
  text?: string
  items?: string[]
  forHosting?: HostingType[]
}
export interface GuideLink { label: string; url: string; note?: string }
export interface GuideCheckItem { id: string; text: string; forHosting?: HostingType[] }

export interface GuideStepData {
  id: string
  title: string
  subtitle: string
  icon: string
  isHostingChoice?: boolean
  blocks: GuideBlock[]
  links?: GuideLink[]
  checkItems: GuideCheckItem[]
}
export interface GuidePhaseData {
  id: number
  name: string
  icon: string
  steps: GuideStepData[]
}
