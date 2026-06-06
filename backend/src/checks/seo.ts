import axios from 'axios'
import { CheckResult } from '../types'

export async function checkSEO(domain: string): Promise<CheckResult> {
  let html = ''
  try {
    const res = await axios.get(`https://${domain}`, {
      timeout: 10000,
      maxRedirects: 5,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DeployChecker/1.0)' },
      responseType: 'text',
    })
    html = res.data as string
  } catch {
    return { status: 'fail', title: 'SEO-базис', message: 'Не удалось загрузить страницу для анализа' }
  }

  const details: string[] = []
  const warnings: string[] = []

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (!titleMatch) {
    warnings.push('Отсутствует тег <title>')
  } else {
    const t = titleMatch[1].trim()
    details.push(`Title: "${t.slice(0, 60)}${t.length > 60 ? '…' : ''}" (${t.length} симв.)`)
    if (t.length < 10) warnings.push('Title слишком короткий (<10 символов)')
    if (t.length > 70) warnings.push('Title слишком длинный (>70 символов)')
  }

  // Meta description
  const descMatch =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)
  if (!descMatch) {
    warnings.push('Отсутствует <meta name="description">')
  } else {
    const d = descMatch[1].trim()
    details.push(`Description: "${d.slice(0, 60)}${d.length > 60 ? '…' : ''}" (${d.length} симв.)`)
    if (d.length < 50) warnings.push('Meta description слишком короткая (<50 символов)')
    if (d.length > 160) warnings.push('Meta description слишком длинная (>160 символов)')
  }

  // Open Graph
  const ogMissing: string[] = []
  if (!/<meta[^>]+property=["']og:title["']/i.test(html)) ogMissing.push('og:title')
  if (!/<meta[^>]+property=["']og:description["']/i.test(html)) ogMissing.push('og:description')
  if (!/<meta[^>]+property=["']og:image["']/i.test(html)) ogMissing.push('og:image')
  if (ogMissing.length > 0) {
    warnings.push(`Open Graph теги отсутствуют: ${ogMissing.join(', ')}`)
  } else {
    details.push('Open Graph (og:title / og:description / og:image): ✓')
  }

  // robots.txt
  try {
    await axios.get(`https://${domain}/robots.txt`, { timeout: 5000 })
    details.push('robots.txt: ✓')
  } catch {
    warnings.push('robots.txt недоступен')
  }

  // sitemap.xml
  try {
    const r = await axios.get(`https://${domain}/sitemap.xml`, { timeout: 5000 })
    if (r.status === 200) details.push('sitemap.xml: ✓')
  } catch {
    warnings.push('sitemap.xml не найден')
  }

  if (warnings.length === 0) {
    return {
      status: 'pass',
      title: 'SEO-базис',
      message: 'Title, description, OG-теги, robots.txt и sitemap присутствуют',
      details,
    }
  }

  return {
    status: 'warning',
    title: 'SEO-базис',
    message: `${warnings.length} SEO-проблем${warnings.length === 1 ? 'а' : ''}`,
    details: [...details, ...warnings.map(w => `⚠ ${w}`)],
    suggestion: 'Добавьте meta description и Open Graph теги для лучшего вида в поиске и соцсетях',
  }
}
