import dns from 'dns/promises'
import { CheckResult } from '../types'

export async function checkEmailDNS(domain: string): Promise<CheckResult> {
  const details: string[] = []
  const issues: string[] = []

  // SPF
  try {
    const records = await dns.resolveTxt(domain)
    const spf = records.find(r => r.join('').startsWith('v=spf1'))
    if (spf) {
      details.push(`SPF: ✓  ${spf.join('').slice(0, 60)}`)
    } else {
      issues.push('SPF-запись не найдена')
    }
  } catch {
    issues.push('Не удалось проверить SPF (нет TXT-записей)')
  }

  // DMARC
  try {
    const records = await dns.resolveTxt(`_dmarc.${domain}`)
    const dmarc = records.find(r => r.join('').startsWith('v=DMARC1'))
    if (dmarc) {
      details.push(`DMARC: ✓  ${dmarc.join('').slice(0, 60)}`)
    } else {
      issues.push('DMARC-запись не найдена (_dmarc.домен)')
    }
  } catch {
    issues.push('DMARC-запись отсутствует (_dmarc.домен)')
  }

  // DKIM — check common selectors
  const selectors = ['google', 'default', 'mail', 'dkim', 's1', 's2', 'k1']
  let dkimFound = false
  for (const sel of selectors) {
    try {
      const records = await dns.resolveTxt(`${sel}._domainkey.${domain}`)
      if (records.length > 0) {
        details.push(`DKIM: ✓  selector "${sel}"`)
        dkimFound = true
        break
      }
    } catch { /* next */ }
  }
  if (!dkimFound) issues.push('DKIM не найден (проверены стандартные selectors)')

  if (issues.length === 0) {
    return {
      status: 'pass',
      title: 'Email DNS (SPF, DKIM, DMARC)',
      message: 'SPF, DKIM и DMARC настроены — письма не попадут в спам',
      details,
    }
  }

  return {
    status: issues.length === 3 ? 'warning' : 'warning',
    title: 'Email DNS (SPF, DKIM, DMARC)',
    message: `${issues.length} из 3 email-записей не настроено`,
    details: [...details, ...issues.map(i => `⚠ ${i}`)],
    suggestion: issues.length === 3
      ? 'Если вы не отправляете почту с этого домена — некритично. Для email-рассылок настройте SPF/DKIM/DMARC.'
      : 'Настройте отсутствующие записи для надёжной доставки email',
  }
}
