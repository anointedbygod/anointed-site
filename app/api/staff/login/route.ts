import { NextResponse } from 'next/server'
import { avvisoSicurezza } from '@/lib/avviso-sicurezza'
import { origineValida } from '@/lib/rate-limit'
import { COOKIE_STAFF, DURATA_COOKIE, azzera, bloccato, ipDi, pinCorretto, registraErrore, valoreCookie } from '@/lib/staff-auth'

export async function POST(req: Request) {
  if (!origineValida(req)) return NextResponse.json({ error: 'Origine non valida' }, { status: 403 })
  const ip = ipDi(req)
  if (bloccato(ip)) return NextResponse.json({ error: 'Troppi tentativi. Riprova tra qualche minuto.' }, { status: 429 })
  const { pin } = await req.json().catch(() => ({ pin: '' }))
  const v = valoreCookie()
  if (!v) return NextResponse.json({ error: 'Accesso staff non configurato' }, { status: 500 })
  if (typeof pin !== 'string' || !/^\d{6}$/.test(pin) || !pinCorretto(pin)) {
    if (registraErrore(ip)) await avvisoSicurezza('Scanner staff EquipHer: 5 PIN errati di fila', `Indirizzo IP ${ip}. L'accesso è bloccato per 10 minuti.`)
    return NextResponse.json({ error: 'PIN errato' }, { status: 401 })
  }
  azzera(ip)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_STAFF, v, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: DURATA_COOKIE })
  return res
}
