import { NextResponse } from 'next/server'
import { validaCodiceSconto } from '@/lib/sconti'
import { ipDa, limitato } from '@/lib/rate-limit'

// Solo anteprima per il carrello: il checkout rivalida sempre il codice lato server.
export async function POST(req: Request) {
  // Anti-indovinello dei codici: 20 tentativi ogni 10 minuti per IP
  if (limitato('sconto:' + ipDa(req), 20, 10 * 60 * 1000)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  const { codice, totale, email } = await req.json().catch(() => ({}))
  const esito = await validaCodiceSconto(codice, Number(totale) || 0, email)
  if (!esito.ok) {
    return NextResponse.json(
      esito.message ? { error: esito.error, message: esito.message } : { error: esito.error },
      { status: esito.status }
    )
  }
  return NextResponse.json({ valido: true, sconto: { ...esito.sconto, importo: esito.importo } })
}
