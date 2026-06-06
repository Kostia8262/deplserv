import axios from 'axios'
import { CheckResult } from '../types'

interface PSIAudit { displayValue?: string; score?: number }
interface PSIResult {
  lighthouseResult?: {
    categories?: { performance?: { score: number } }
    audits?: {
      'first-contentful-paint'?: PSIAudit
      'largest-contentful-paint'?: PSIAudit
      'total-blocking-time'?: PSIAudit
      'cumulative-layout-shift'?: PSIAudit
      'speed-index'?: PSIAudit
    }
  }
}

export async function checkPageSpeed(domain: string): Promise<CheckResult> {
  const key = process.env.PAGESPEED_API_KEY ?? ''
  const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://${domain}&strategy=mobile${key ? `&key=${key}` : ''}`

  try {
    const res = await axios.get<PSIResult>(url, { timeout: 30000 })
    const perf = res.data.lighthouseResult?.categories?.performance?.score
    const audits = res.data.lighthouseResult?.audits

    if (perf === undefined) {
      return { status: 'warning', title: 'PageSpeed (Core Web Vitals)', message: 'Нет данных производительности' }
    }

    const score = Math.round(perf * 100)
    const details: string[] = [`Балл производительности: ${score}/100 (мобильный)`]

    const a = (k: keyof NonNullable<typeof audits>) => audits?.[k]?.displayValue
    if (a('first-contentful-paint')) details.push(`FCP: ${a('first-contentful-paint')}`)
    if (a('largest-contentful-paint')) details.push(`LCP: ${a('largest-contentful-paint')}`)
    if (a('total-blocking-time')) details.push(`TBT: ${a('total-blocking-time')}`)
    if (a('cumulative-layout-shift')) details.push(`CLS: ${a('cumulative-layout-shift')}`)
    if (a('speed-index')) details.push(`Speed Index: ${a('speed-index')}`)

    if (score >= 90) {
      return { status: 'pass', title: 'PageSpeed (Core Web Vitals)', message: `Отличная производительность: ${score}/100`, details }
    }
    if (score >= 50) {
      return {
        status: 'warning', title: 'PageSpeed (Core Web Vitals)',
        message: `Средняя производительность: ${score}/100`,
        details,
        suggestion: 'Оптимизируйте изображения (WebP), добавьте lazy loading, уменьшите JS-бандл',
      }
    }
    return {
      status: 'fail', title: 'PageSpeed (Core Web Vitals)',
      message: `Низкая производительность: ${score}/100`,
      details,
      suggestion: 'Требуется оптимизация: сжатие картинок, minify CSS/JS, CDN, кэширование',
    }
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 429) {
      return {
        status: 'warning', title: 'PageSpeed (Core Web Vitals)',
        message: 'Превышен лимит запросов Google API',
        suggestion: 'Добавьте PAGESPEED_API_KEY=ваш_ключ в backend/.env для снятия ограничений',
      }
    }
    return { status: 'warning', title: 'PageSpeed (Core Web Vitals)', message: 'PageSpeed API временно недоступен' }
  }
}
