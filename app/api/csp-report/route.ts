import { NextResponse } from 'next/server'

// Riceve le segnalazioni della CSP in modalità di prova e le scrive nei log di Vercel (cerca "CSP report").
// Non blocca nulla: serve a capire quali origini aggiungere prima di renderla vincolante.
const visti = new Map<string, number>()

export async function POST(req: Request) {
  try {
    const testo = (await req.text()).slice(0, 10000)
    const dati = JSON.parse(testo)
    const lista = Array.isArray(dati) ? dati.map(r => r?.body ?? r) : [dati?.['csp-report'] ?? dati]
    for (const r of lista.slice(0, 10)) {
      const direttiva = r?.['effective-directive'] || r?.effectiveDirective || r?.['violated-directive'] || '?'
      const bloccato = r?.['blocked-uri'] || r?.blockedURL || '?'
      const pagina = r?.['document-uri'] || r?.documentURL || '?'
      const chiave = `${direttiva}|${bloccato}`
      const ora = Date.now()
      if (ora - (visti.get(chiave) || 0) < 60_000) continue // stessa segnalazione al massimo una volta al minuto
      visti.set(chiave, ora)
      console.warn('CSP report', JSON.stringify({ direttiva, bloccato: String(bloccato).slice(0, 200), pagina: String(pagina).slice(0, 200) }))
    }
  } catch { /* segnalazione malformata: ignorata */ }
  return new NextResponse(null, { status: 204 })
}
