import { Router, Request, Response } from 'express'
import { checkDNS } from '../checks/dns'
import { checkHTTP } from '../checks/http'
import { checkSSL } from '../checks/ssl'
import { checkRedirect } from '../checks/redirect'
import { checkHeaders } from '../checks/headers'
import { checkSpeed } from '../checks/speed'
import { checkSEO } from '../checks/seo'
import { checkMixedContent } from '../checks/mixed-content'
import { checkEmailDNS } from '../checks/email-dns'
import { checkWhois } from '../checks/whois'
import { checkPageSpeed } from '../checks/pagespeed'

export const checksRouter = Router()

function clean(domain: string): string {
  return domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim().toLowerCase()
}

function domainGuard(req: Request, res: Response): string | null {
  const { domain } = req.body as { domain?: string }
  if (!domain || typeof domain !== 'string') {
    res.status(400).json({ error: 'Укажите домен' })
    return null
  }
  return clean(domain)
}

checksRouter.post('/dns',       async (req, res) => { const d = domainGuard(req, res); if (d) res.json(await checkDNS(d)) })
checksRouter.post('/http',      async (req, res) => { const d = domainGuard(req, res); if (d) res.json(await checkHTTP(d)) })
checksRouter.post('/ssl',       async (req, res) => { const d = domainGuard(req, res); if (d) res.json(await checkSSL(d)) })
checksRouter.post('/redirect',  async (req, res) => { const d = domainGuard(req, res); if (d) res.json(await checkRedirect(d)) })
checksRouter.post('/headers',   async (req, res) => { const d = domainGuard(req, res); if (d) res.json(await checkHeaders(d)) })
checksRouter.post('/speed',     async (req, res) => { const d = domainGuard(req, res); if (d) res.json(await checkSpeed(d)) })
checksRouter.post('/seo',       async (req, res) => { const d = domainGuard(req, res); if (d) res.json(await checkSEO(d)) })
checksRouter.post('/mixed',     async (req, res) => { const d = domainGuard(req, res); if (d) res.json(await checkMixedContent(d)) })
checksRouter.post('/email',     async (req, res) => { const d = domainGuard(req, res); if (d) res.json(await checkEmailDNS(d)) })
checksRouter.post('/whois',     async (req, res) => { const d = domainGuard(req, res); if (d) res.json(await checkWhois(d)) })
checksRouter.post('/pagespeed', async (req, res) => { const d = domainGuard(req, res); if (d) res.json(await checkPageSpeed(d)) })

checksRouter.post('/all', async (req, res) => {
  const d = domainGuard(req, res)
  if (!d) return

  const [dns, http, ssl, redirect, headers, speed, seo, mixed, email, whois, pagespeed] =
    await Promise.allSettled([
      checkDNS(d), checkHTTP(d), checkSSL(d), checkRedirect(d), checkHeaders(d),
      checkSpeed(d), checkSEO(d), checkMixedContent(d), checkEmailDNS(d),
      checkWhois(d), checkPageSpeed(d),
    ])

  const unwrap = (r: PromiseSettledResult<unknown>, name: string) =>
    r.status === 'fulfilled'
      ? r.value
      : { status: 'fail', title: `Ошибка: ${name}`, message: String((r as PromiseRejectedResult).reason) }

  res.json({
    dns: unwrap(dns, 'DNS'), http: unwrap(http, 'HTTP'), ssl: unwrap(ssl, 'SSL'),
    redirect: unwrap(redirect, 'Redirect'), headers: unwrap(headers, 'Headers'),
    speed: unwrap(speed, 'Speed'), seo: unwrap(seo, 'SEO'),
    mixed: unwrap(mixed, 'Mixed'), email: unwrap(email, 'Email'),
    whois: unwrap(whois, 'Whois'), pagespeed: unwrap(pagespeed, 'PageSpeed'),
  })
})
