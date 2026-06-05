import axios from 'axios'
import { CheckResult } from '../types'

export async function checkHTTP(domain: string): Promise<CheckResult> {
  let httpOk = false
  let httpsOk = false
  let httpCode = 0
  let httpsCode = 0
  let httpErr = ''
  let httpsErr = ''

  try {
    const r = await axios.get(`http://${domain}`, {
      maxRedirects: 5,
      timeout: 10000,
      validateStatus: () => true,
    })
    httpOk = true
    httpCode = r.status
  } catch (e: unknown) {
    httpErr = e instanceof Error ? e.message : String(e)
  }

  try {
    const r = await axios.get(`https://${domain}`, {
      maxRedirects: 5,
      timeout: 10000,
      validateStatus: () => true,
    })
    httpsOk = true
    httpsCode = r.status
  } catch (e: unknown) {
    httpsErr = e instanceof Error ? e.message : String(e)
  }

  if (httpsOk) {
    const details = [`HTTPS: ${httpsCode}`]
    if (httpOk) details.push(`HTTP: ${httpCode}`)
    return {
      status: httpsCode >= 200 && httpsCode < 400 ? 'pass' : 'warning',
      title: 'Сервер доступен',
      message: `Сервер отвечает по HTTPS (код ${httpsCode})`,
      details,
      data: { httpCode, httpsCode },
    }
  }

  if (httpOk) {
    return {
      status: 'warning',
      title: 'Сервер доступен только по HTTP',
      message: `HTTP работает (${httpCode}), HTTPS недоступен`,
      details: [`HTTP: ${httpCode}`, `HTTPS: ${httpsErr}`],
      suggestion:
        'Установите SSL сертификат. В Hostinger: hPanel → SSL → Let\'s Encrypt → выберите домен → Установить.',
      data: { httpCode, httpsCode: 0 },
    }
  }

  return {
    status: 'fail',
    title: 'Сервер недоступен',
    message: 'Не удалось подключиться ни по HTTP, ни по HTTPS',
    details: [`HTTP: ${httpErr}`, `HTTPS: ${httpsErr}`],
    suggestion:
      'Проверьте: 1) файлы загружены в папку public_html 2) домен привязан к хостингу 3) DNS записи обновились (до 48ч) 4) хостинг активен.',
  }
}
