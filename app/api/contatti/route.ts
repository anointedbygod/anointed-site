import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { AZIENDA } from '@/lib/azienda'

// Rate limit best-effort in memoria (per istanza): 5 messaggi / 10 minuti per IP
const hits = new Map<string, number[]>()
function limited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

export async function POST(req: Request) {
  try {
    const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()
    if (limited(ip)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const b = await req.json()
    // honeypot: i bot compilano il campo nascosto, gli umani no
    if (b.sito) return NextResponse.json({ success: true })

    const nome = String(b.nome || '').trim().slice(0, 120)
    const email = String(b.email || '').trim().slice(0, 200)
    const oggetto = String(b.oggetto || '').trim().slice(0, 200)
    const messaggio = String(b.messaggio || '').trim().slice(0, 5000)
    if (!nome || !oggetto || !messaggio || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    if (b.privacy !== true) return NextResponse.json({ error: 'Privacy consent required' }, { status: 400 })

    if (!process.env.RESEND_API_KEY) {
      console.error('Contatti: RESEND_API_KEY mancante')
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: 'ANOINTED <noreply@anointed.it>',
      to: process.env.CONTACT_TO_EMAIL || AZIENDA.email,
      replyTo: email,
      subject: `[Sito] ${oggetto}`,
      html: `<p><strong>Da:</strong> ${esc(nome)} &lt;${esc(email)}&gt;</p><p><strong>Oggetto:</strong> ${esc(oggetto)}</p><p style="white-space:pre-wrap">${esc(messaggio)}</p>`,
    })
    if (error) {
      console.error('Contatti: invio fallito', error)
      return NextResponse.json({ error: 'Send failed' }, { status: 502 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Contatti error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
