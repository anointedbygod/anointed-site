import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'
import { inviaConferma } from '@/lib/newsletter-mail'
import type { Fonte } from '@/lib/newsletter-token'

// Doppio consenso: qui NON si iscrive nessuno e NON si dà nessun codice.
// Si controlla il consenso esplicito e si invia un'email con il link di conferma;
// l'iscrizione vera avviene in /api/newsletter/conferma quando l'utente clicca.
const ipHits = new Map<string, number[]>()
const emailHits = new Map<string, number>()
function limitato(ip: string, email: string) {
  const now = Date.now()
  const recenti = (ipHits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000)
  if (recenti.length >= 8) return true
  ipHits.set(ip, [...recenti, now])
  if (now - (emailHits.get(email) || 0) < 60 * 1000) return true
  emailHits.set(email, now)
  return false
}

export async function POST(req: Request) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 }) }
  const email = String(body?.email || '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
  // Consenso esplicito obbligatorio (GDPR): niente iscrizione senza casella spuntata dall'utente
  if (body?.consenso !== true) return NextResponse.json({ error: 'Consenso mancante' }, { status: 400 })

  const locale = body?.locale === 'it' ? 'it' : 'en'
  const fonte: Fonte = body?.tipo === 'checkout' ? 'checkout' : body?.tipo === 'newsletter' ? 'newsletter' : 'popup'
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()
  if (limitato(ip, email)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  try {
    const { data: esistente } = await supabaseAdmin.from('newsletter_iscritti').select('email').eq('email', email).maybeSingle()
    // Già iscritta: nessuna nuova email (evita invii ripetuti a un indirizzo altrui)
    if (esistente) return NextResponse.json({ success: true, gia: true })

    await inviaConferma(email, locale, fonte)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Newsletter error:', err)
    return NextResponse.json({ error: 'Invio non riuscito' }, { status: 502 })
  }
}
