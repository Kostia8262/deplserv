import axios from 'axios'
import { CheckResult } from '../types'

export async function checkRedirect(domain: string): Promise<CheckResult> {
  try {
    const r = await axios.get(`http://${domain}`, {
      maxRedirects: 0,
      validateStatus: () => true,
      timeout: 10000,
    })

    const status = r.status
    const location: string = (r.headers['location'] as string) ?? ''

    if (status >= 301 && status <= 308 && location.startsWith('https://')) {
      return {
        status: 'pass',
        title: 'HTTPS редирект настроен',
        message: `HTTP → HTTPS перенаправление работает (${status})`,
        details: [`${status} → ${location}`],
      }
    }

    if (status >= 301 && status <= 308) {
      return {
        status: 'warning',
        title: 'Редирект есть, но не на HTTPS',
        message: `Редирект на: ${location}`,
        details: [`${status} → ${location}`],
        suggestion:
          'Настройте редирект именно на HTTPS. Apache (.htaccess): RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
      }
    }

    return {
      status: 'warning',
      title: 'HTTPS редирект не настроен',
      message: `HTTP отвечает кодом ${status} без редиректа`,
      suggestion:
        'Hostinger hPanel: SSL → Force HTTPS. Или в .htaccess добавьте правило редиректа на HTTPS.',
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('ECONNREFUSED') || msg.includes('ETIMEDOUT')) {
      return {
        status: 'warning',
        title: 'HTTP порт недоступен',
        message: 'Порт 80 закрыт — возможно сайт работает только через HTTPS',
      }
    }
    return { status: 'fail', title: 'Ошибка проверки редиректа', message: msg }
  }
}
