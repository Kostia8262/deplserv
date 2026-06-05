import * as dns from 'dns/promises'
import { CheckResult } from '../types'

export async function checkDNS(domain: string): Promise<CheckResult> {
  try {
    const [aRecords, aaaaRecords, cnameRecords] = await Promise.allSettled([
      dns.resolve4(domain),
      dns.resolve6(domain),
      dns.resolveCname(domain),
    ])

    const a = aRecords.status === 'fulfilled' ? aRecords.value : []
    const aaaa = aaaaRecords.status === 'fulfilled' ? aaaaRecords.value : []
    const cname = cnameRecords.status === 'fulfilled' ? cnameRecords.value : []

    if (a.length === 0 && aaaa.length === 0 && cname.length === 0) {
      return {
        status: 'fail',
        title: 'DNS не разрешается',
        message: `Домен ${domain} не имеет DNS записей`,
        suggestion:
          'Проверьте DNS записи в панели управления доменом. A-запись должна указывать на IP-адрес вашего сервера. Обновление DNS может занять до 48 часов.',
      }
    }

    const details: string[] = [
      ...a.map((ip) => `A: ${ip}`),
      ...aaaa.map((ip) => `AAAA: ${ip}`),
      ...cname.map((c) => `CNAME: ${c}`),
    ]

    return {
      status: 'pass',
      title: 'DNS разрешается корректно',
      message: `Найдено ${a.length + aaaa.length + cname.length} DNS записей`,
      details,
      data: { ipAddress: a[0] ?? null, aRecords: a, aaaaRecords: aaaa, cnameRecords: cname },
    }
  } catch (err) {
    return {
      status: 'fail',
      title: 'Ошибка DNS',
      message: `Не удалось разрешить домен: ${String(err)}`,
      suggestion: 'Убедитесь что домен зарегистрирован и DNS записи настроены.',
    }
  }
}
