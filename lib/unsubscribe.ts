import { createHmac, timingSafeEqual } from 'crypto'

// Link di disiscrizione firmato (HMAC): nessuno puo' cancellare l'iscrizione di un altro
// senza conoscere il link ricevuto via email. Usa CRON_SECRET come chiave.
function firma(email: string) {
  const secret = process.env.CRON_SECRET
  if (!secret) throw new Error('CRON_SECRET mancante')
  return createHmac('sha256', secret).update(email.trim().toLowerCase()).digest('hex')
}

export function urlDisiscrizione(email: string, locale: 'en' | 'it' = 'en') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://anointed.it'
  const e = encodeURIComponent(email.trim().toLowerCase())
  return `${base}/api/newsletter/annulla?e=${e}&t=${firma(email)}&l=${locale}`
}

export function firmaValida(email: string, token: string) {
  try {
    const atteso = Buffer.from(firma(email), 'hex')
    const ricevuto = Buffer.from(token, 'hex')
    return atteso.length === ricevuto.length && timingSafeEqual(atteso, ricevuto)
  } catch {
    return false
  }
}
