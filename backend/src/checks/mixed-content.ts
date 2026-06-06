import axios from 'axios'
import { CheckResult } from '../types'

export async function checkMixedContent(domain: string): Promise<CheckResult> {
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
    return { status: 'fail', title: 'Mixed Content', message: 'Не удалось загрузить страницу' }
  }

  const httpResources: string[] = []
  for (const match of html.matchAll(/(?:src|href|action|data-src)=["'](http:\/\/[^"']+)["']/gi)) {
    const url = match[1]
    if (!url.startsWith('http://localhost') && !url.startsWith('http://127.')) {
      httpResources.push(url.length > 80 ? url.slice(0, 80) + '…' : url)
    }
  }

  const unique = [...new Set(httpResources)].slice(0, 10)

  if (unique.length === 0) {
    return {
      status: 'pass',
      title: 'Mixed Content',
      message: 'HTTP-ресурсы на HTTPS-странице не обнаружены',
    }
  }

  return {
    status: 'fail',
    title: 'Mixed Content',
    message: `${unique.length} HTTP-ресурс${unique.length > 4 ? 'ов' : unique.length > 1 ? 'а' : ''} на HTTPS-странице`,
    details: unique,
    suggestion: 'Замените все http:// на https:// в ссылках на картинки, стили и скрипты',
  }
}
