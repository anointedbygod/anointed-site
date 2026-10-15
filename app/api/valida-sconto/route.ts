import { NextResponse } from 'next/server'
import { validaCodiceSconto } from '@/lib/sconti'

// Solo anteprima per il carrello: il checkout rivalida sempre il codice lato server.
export async function POST(req: Request) {
  const { codice, totale, email } = await req.json()
  const esito = await validaCodiceSconto(codice, Number(totale) || 0, email)
  if (!esito.ok) {
    return NextResponse.json(
      esito.message ? { error: esito.error, message: esito.message } : { error: esito.error },
      { status: esito.status }
    )
  }
  return NextResponse.json({ valido: true, sconto: { ...esito.sconto, importo: esito.importo } })
}
