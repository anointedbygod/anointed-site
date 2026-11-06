import { createHash, createHmac, timingSafeEqual } from 'crypto'

// Accesso staff (stand EquipHer): PIN a 6 cifre in EQUIPHER_STAFF_PIN, ricordato dal telefono con un cookie firmato.
export const COOKIE_STAFF = 'staff_equipher'
export const DURATA_COOKIE = 60 * 60 * 24 * 3 // 3 giorni

function firma(): string | null {
  const pin = process.env.EQUIPHER_STAFF_PIN
  const segreto = process.env.CRON_SECRET
  if (!pin || !segreto) return null
  return createHmac('sha256', segreto).update('staff-equipher|' + pin).digest('hex')
}

function uguali(a: string, b: string) {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function pinCorretto(pin: string) {
  const atteso = process.env.EQUIPHER_STAFF_PIN
  return !!atteso && uguali(pin, atteso)
}

export function valoreCookie() { return firma() }

export function autorizzato(req: Request) {
  const f = firma()
  if (!f) return false
  const m = (req.headers.get('cookie') || '').match(new RegExp(`(?:^|; )${COOKIE_STAFF}=([a-f0-9]+)`))
  return !!m && uguali(m[1], f)
}

// Limite tentativi (in memoria: sufficiente per un PIN a 6 cifre usato per un evento)
const tentativi = new Map<string, { n: number; fino: number }>()
export function ipDi(req: Request) {
  return (req.headers.get('x-forwarded-for') || 'x').split(',')[0].trim()
}
export function bloccato(ip: string) {
  const t = tentativi.get(ip)
  return !!t && t.fino > Date.now()
}
export function registraErrore(ip: string) {
  const t = tentativi.get(ip) || { n: 0, fino: 0 }
  t.n += 1
  if (t.n >= 5) { t.fino = Date.now() + 10 * 60 * 1000; t.n = 0 }
  tentativi.set(ip, t)
}
export function azzera(ip: string) { tentativi.delete(ip) }

export function normalizzaCodice(v: unknown) {
  const c = String(v ?? '').trim().toUpperCase().replace(/\s+/g, '')
  if (/^\d{1,4}$/.test(c)) return `EQUIPHER-${c.padStart(3, '0')}`
  const m = c.match(/^EQUIPHER-?(\d{1,4})$/)
  return m ? `EQUIPHER-${m[1].padStart(3, '0')}` : c
}
