import { createHmac, timingSafeEqual } from 'crypto'

// Link di conferma iscrizione (doppio consenso): firmato HMAC, scade dopo 7 giorni.
// Nessuna scrittura nel database finché l'utente non clicca: un indirizzo inventato
// non riceve mai il codice sconto e non entra nella lista.
const SCADENZA_MS = 7 * 24 * 60 * 60 * 1000
export type Fonte = 'popup' | 'checkout' | 'newsletter'

function firma(email: string, ts: number, lingua: string, fonte: string) {
  const secret = process.env.CRON_SECRET
  if (!secret) throw new Error('CRON_SECRET mancante')
  return createHmac('sha256', secret).update(`conferma:${email.trim().toLowerCase()}:${ts}:${lingua}:${fonte}`).digest('hex')
}

export function urlConferma(email: string, lingua: 'en' | 'it', fonte: Fonte) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://anointed.it'
  const ts = Date.now()
  const e = encodeURIComponent(email.trim().toLowerCase())
  return `${base}/api/newsletter/conferma?e=${e}&ts=${ts}&l=${lingua}&f=${fonte}&t=${firma(email, ts, lingua, fonte)}`
}

export function confermaValida(email: string, ts: number, lingua: string, fonte: string, token: string) {
  try {
    if (!Number.isFinite(ts) || Date.now() - ts > SCADENZA_MS || ts > Date.now() + 60_000) return false
    const atteso = Buffer.from(firma(email, ts, lingua, fonte), 'hex')
    const ricevuto = Buffer.from(token, 'hex')
    return atteso.length === ricevuto.length && timingSafeEqual(atteso, ricevuto)
  } catch {
    return false
  }
}
