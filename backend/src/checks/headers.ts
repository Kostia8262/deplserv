import axios from 'axios'
import { CheckResult } from '../types'

const HEADERS = [
  { name: 'strict-transport-security', label: 'HSTS', critical: true },
  { name: 'x-content-type-options', label: 'X-Content-Type-Options', critical: false },
  { name: 'x-frame-options', label: 'X-Frame-Options', critical: false },
  { name: 'content-security-policy', label: 'Content-Security-Policy', critical: false },
  { name: 'referrer-policy', label: 'Referrer-Policy', critical: false },
]

export async function checkHeaders(domain: string): Promise<CheckResult> {
  try {
    const r = await axios.get(`https://${domain}`, {
      maxRedirects: 5,
      timeout: 10000,
      validateStatus: () => true,
    })

    const present: string[] = []
    const missing: string[] = []
    const missingCritical: string[] = []

    for (const h of HEADERS) {
      if (r.headers[h.name]) {
        present.push(`✓ ${h.label}: ${String(r.headers[h.name]).slice(0, 80)}`)
      } else {
        missing.push(h.label)
        if (h.critical) missingCritical.push(h.label)
      }
    }

    const details = [...present, ...missing.map((h) => `✗ ${h}: отсутствует`)]

    if (missingCritical.length > 0) {
      return {
        status: 'warning',
        title: 'Отсутствуют критические заголовки',
        message: `Нет: ${missingCritical.join(', ')}`,
        details,
        suggestion:
          'Добавьте в конфиг Nginx: add_header Strict-Transport-Security "max-age=31536000" always; Для Apache добавьте в .htaccess.',
      }
    }

    if (missing.length > 0) {
      return {
        status: 'warning',
        title: 'Некоторые заголовки отсутствуют',
        message: `${present.length} из ${HEADERS.length} настроены`,
        details,
        suggestion: `Рекомендуется добавить: ${missing.join(', ')}`,
      }
    }

    return {
      status: 'pass',
      title: 'Заголовки безопасности настроены',
      message: 'Все рекомендуемые заголовки присутствуют',
      details,
    }
  } catch (err) {
    return {
      status: 'fail',
      title: 'Не удалось проверить заголовки',
      message: String(err),
    }
  }
}
