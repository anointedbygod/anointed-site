import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { codice, totale, email } = await req.json()
  if (!codice) return NextResponse.json({ error: 'Codice mancante' }, { status: 400 })

  const { data: sconto, error } = await supabaseAdmin
    .from('codici_sconto')
    .select('*')
    .eq('codice', codice.toUpperCase())
    .eq('attivo', true)
    .single()

  if (error || !sconto) return NextResponse.json({ error: 'Codice non valido' }, { status: 404 })

  // Controlla scadenza
  if (sconto.scadenza && new Date(sconto.scadenza) < new Date()) {
    return NextResponse.json({ error: 'Codice scaduto' }, { status: 400 })
  }

  // Controlla utilizzi totali
  if (sconto.utilizzi_max && sconto.utilizzi_attuali >= sconto.utilizzi_max) {
    return NextResponse.json({ error: 'Codice esaurito' }, { status: 400 })
  }

  // Controlla spesa minima
  if (sconto.spesa_minima && totale < sconto.spesa_minima) {
    return NextResponse.json({ 
      error: `Spesa minima €${sconto.spesa_minima.toFixed(2)} richiesta` 
    }, { status: 400 })
  }

  // Controlla utilizzo per email (se email fornita)
  if (email) {
    const { data: utilizzoEsistente } = await supabaseAdmin
      .from('utilizzi_sconti')
      .select('id')
      .eq('codice_id', sconto.id)
      .eq('email', email.toLowerCase())
      .single()

    if (utilizzoEsistente) {
      return NextResponse.json({ error: 'Hai già utilizzato questo codice' }, { status: 400 })
    }
  }

  // Calcola sconto
  const importoSconto = sconto.tipo === 'percentuale'
    ? (totale * sconto.valore) / 100
    : Math.min(sconto.valore, totale)

  return NextResponse.json({
    valido: true,
    sconto: { ...sconto, importo: importoSconto },
  })
}
