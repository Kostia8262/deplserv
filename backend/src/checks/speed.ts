import axios from 'axios'
import { CheckResult } from '../types'

export async function checkSpeed(domain: string): Promise<CheckResult> {
  const times: number[] = []
  let lastErr = ''

  for (let i = 0; i < 3; i++) {
    const t0 = Date.now()
    try {
      await axios.get(`https://${domain}`, {
        timeout: 15000,
        validateStatus: () => true,
        maxRedirects: 5,
      })
      times.push(Date.now() - t0)
    } catch (e: unknown) {
      lastErr = e instanceof Error ? e.message : String(e)
    }
  }

  if (times.length === 0) {
    return {
      status: 'fail',
      title: 'Не удалось измерить скорость',
      message: lastErr,
      suggestion: 'Убедитесь что сайт доступен по HTTPS.',
    }
  }

  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  const details = [
    `Среднее время ответа: ${avg} мс`,
    `Замеры: ${times.map((t) => `${t} мс`).join(', ')}`,
    avg < 500 ? 'Отлично (< 500 мс)' : avg < 1500 ? 'Приемлемо (< 1500 мс)' : 'Медленно (> 1500 мс)',
  ]

  if (avg < 500) {
    return { status: 'pass', title: 'Отличная скорость', message: `${avg} мс в среднем`, details }
  }
  if (avg < 1500) {
    return {
      status: 'warning',
      title: 'Приемлемая скорость',
      message: `${avg} мс (рекомендуется < 500 мс)`,
      details,
      suggestion: 'Рассмотрите: включение кэширования, сжатие Gzip, CDN, оптимизацию изображений.',
    }
  }
  return {
    status: 'fail',
    title: 'Медленный ответ',
    message: `${avg} мс — критично медленно`,
    details,
    suggestion:
      'Проверьте: нагрузку на сервер, включите Gzip, настройте кэширование, оптимизируйте базу данных.',
  }
}
