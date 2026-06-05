import { Router, Request, Response } from 'express'
import { checkDNS } from '../checks/dns'
import { checkHTTP } from '../checks/http'
import { checkSSL } from '../checks/ssl'
import { checkRedirect } from '../checks/redirect'
import { checkHeaders } from '../checks/headers'
import { checkSpeed } from '../checks/speed'

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

checksRouter.post('/dns', async (req, res) => {
  const d = domainGuard(req, res)
  if (d) res.json(await checkDNS(d))
})

checksRouter.post('/http', async (req, res) => {
  const d = domainGuard(req, res)
  if (d) res.json(await checkHTTP(d))
})

checksRouter.post('/ssl', async (req, res) => {
  const d = domainGuard(req, res)
  if (d) res.json(await checkSSL(d))
})

checksRouter.post('/redirect', async (req, res) => {
  const d = domainGuard(req, res)
  if (d) res.json(await checkRedirect(d))
})

checksRouter.post('/headers', async (req, res) => {
  const d = domainGuard(req, res)
  if (d) res.json(await checkHeaders(d))
})

checksRouter.post('/speed', async (req, res) => {
  const d = domainGuard(req, res)
  if (d) res.json(await checkSpeed(d))
})

checksRouter.post('/all', async (req, res) => {
  const d = domainGuard(req, res)
  if (!d) return

  const [dns, http, ssl, redirect, headers, speed] = await Promise.allSettled([
    checkDNS(d),
    checkHTTP(d),
    checkSSL(d),
    checkRedirect(d),
    checkHeaders(d),
    checkSpeed(d),
  ])

  const unwrap = (r: PromiseSettledResult<unknown>, name: string) =>
    r.status === 'fulfilled'
      ? r.value
      : { status: 'fail', title: `Ошибка: ${name}`, message: String((r as PromiseRejectedResult).reason) }

  res.json({
    dns: unwrap(dns, 'DNS'),
    http: unwrap(http, 'HTTP'),
    ssl: unwrap(ssl, 'SSL'),
    redirect: unwrap(redirect, 'Redirect'),
    headers: unwrap(headers, 'Headers'),
    speed: unwrap(speed, 'Speed'),
  })
})
