import * as tls from 'tls'
import { CheckResult } from '../types'

export function checkSSL(domain: string): Promise<CheckResult> {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host: domain, port: 443, servername: domain, rejectUnauthorized: false, timeout: 10000 },
      () => {
        try {
          const cert = socket.getPeerCertificate(true)
          const authorized = socket.authorized

          if (!cert || Object.keys(cert).length === 0) {
            socket.destroy()
            return resolve({
              status: 'fail',
              title: 'SSL сертификат не найден',
              message: 'Сервер не предоставил SSL сертификат',
              suggestion: "В Hostinger: hPanel → SSL → Let's Encrypt → выберите домен → Установить.",
            })
          }

          const validTo = new Date(cert.valid_to)
          const validFrom = new Date(cert.valid_from)
          const daysLeft = Math.floor((validTo.getTime() - Date.now()) / 86400000)
          const expired = daysLeft < 0

          const issuer = (cert.issuer as Record<string, string>)?.O ?? 'Неизвестен'
          const subject = (cert.subject as Record<string, string>)?.CN ?? domain
          const selfSigned = issuer === ((cert.subject as Record<string, string>)?.O ?? '')

          socket.destroy()

          const details = [
            `Издатель: ${issuer}`,
            `Домен: ${subject}`,
            `Действителен с: ${validFrom.toLocaleDateString('ru-RU')}`,
            `Действителен до: ${validTo.toLocaleDateString('ru-RU')}`,
            `Осталось дней: ${daysLeft}`,
            `Браузер доверяет: ${authorized ? 'Да' : 'Нет'}`,
          ]

          if (expired) {
            return resolve({
              status: 'fail',
              title: 'SSL сертификат истёк',
              message: `Сертификат истёк ${Math.abs(daysLeft)} дней назад`,
              details,
              suggestion: "Обновите SSL: hPanel → SSL → Let's Encrypt → переустановите.",
            })
          }
          if (selfSigned) {
            return resolve({
              status: 'warning',
              title: 'Самоподписанный сертификат',
              message: 'Браузеры покажут предупреждение «Небезопасно»',
              details,
              suggestion: "Замените на Let's Encrypt — бесплатный доверенный сертификат.",
            })
          }
          if (daysLeft < 14) {
            return resolve({
              status: 'warning',
              title: 'SSL сертификат скоро истечёт',
              message: `Осталось ${daysLeft} дней до истечения`,
              details,
              suggestion: 'Обновите SSL сертификат заранее.',
            })
          }

          resolve({
            status: 'pass',
            title: 'SSL сертификат действителен',
            message: `Действителен ещё ${daysLeft} дней`,
            details,
          })
        } catch (err) {
          socket.destroy()
          resolve({ status: 'fail', title: 'Ошибка чтения SSL', message: String(err) })
        }
      }
    )

    socket.on('error', (err) =>
      resolve({
        status: 'fail',
        title: 'SSL недоступен',
        message: err.message,
        suggestion: 'Убедитесь что SSL установлен и порт 443 открыт.',
      })
    )

    socket.setTimeout(10000, () => {
      socket.destroy()
      resolve({ status: 'fail', title: 'SSL: таймаут', message: 'Превышено время ожидания' })
    })
  })
}
