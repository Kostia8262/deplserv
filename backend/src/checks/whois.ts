import axios from 'axios'
import { CheckResult } from '../types'

interface RdapEvent { eventAction: string; eventDate: string }

export async function checkWhois(domain: string): Promise<CheckResult> {
  try {
    const res = await axios.get(`https://rdap.org/domain/${domain}`, {
      timeout: 12000,
      headers: { Accept: 'application/rdap+json' },
    })
    const data = res.data as { events?: RdapEvent[]; status?: string[] }

    const events = data.events ?? []
    const registered = events.find(e => e.eventAction === 'registration')
    const expires = events.find(e => e.eventAction === 'expiration')
    const changed = events.find(e => e.eventAction === 'last changed')

    const details: string[] = []
    if (registered) details.push(`Зарегистрирован: ${fmtDate(registered.eventDate)}`)
    if (changed) details.push(`Последнее изменение: ${fmtDate(changed.eventDate)}`)
    if (data.status?.length) details.push(`Статус: ${data.status.join(', ')}`)

    if (expires) {
      const expDate = new Date(expires.eventDate)
      const daysLeft = Math.floor((expDate.getTime() - Date.now()) / 86400000)
      details.push(`Истекает: ${fmtDate(expires.eventDate)} (через ${daysLeft} дн.)`)

      if (daysLeft < 14) {
        return {
          status: 'fail', title: 'WHOIS / Домен',
          message: `Домен истекает через ${daysLeft} дней! Срочно продлите!`,
          details,
          suggestion: 'Зайдите к регистратору домена и продлите его немедленно',
        }
      }
      if (daysLeft < 45) {
        return {
          status: 'warning', title: 'WHOIS / Домен',
          message: `Домен истекает через ${daysLeft} дней`,
          details,
          suggestion: 'Рекомендуем продлить домен в ближайшее время',
        }
      }
      return {
        status: 'pass', title: 'WHOIS / Домен',
        message: `Домен активен, истекает ${fmtDate(expires.eventDate)}`,
        details,
      }
    }

    return {
      status: 'pass', title: 'WHOIS / Домен',
      message: 'Домен активен',
      details,
    }
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return {
        status: 'warning', title: 'WHOIS / Домен',
        message: 'WHOIS данные недоступны для этой доменной зоны',
        details: ['.ru, .рф и некоторые ccTLD не поддерживают RDAP-протокол'],
      }
    }
    return {
      status: 'warning', title: 'WHOIS / Домен',
      message: 'Не удалось получить данные WHOIS/RDAP',
    }
  }
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
