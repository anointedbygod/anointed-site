import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { autorizzato, normalizzaCodice } from '@/lib/staff-auth'

// Verifica/timbro dei pass EquipHer dallo stand. Richiede il cookie staff (PIN).
const nonAutorizzato = () => NextResponse.json({ error: 'non autorizzato' }, { status: 401 })

function maschera(email: string) {
  const [u, d] = email.split('@')
  return `${u.slice(0, 2)}***@${d ?? ''}`
}

export async function GET(req: Request) {
  if (!autorizzato(req)) return nonAutorizzato()
  const { data, error } = await supabaseAdmin
    .from('newsletter_iscritti').select('email, codice_evento, codice_evento_usato_at')
    .not('codice_evento', 'is', null).order('codice_evento', { ascending: false })
  if (error) return NextResponse.json({ error: 'errore database' }, { status: 500 })
  const lista = (data ?? []).map(r => ({ codice: r.codice_evento as string, email: maschera(r.email), usato_at: r.codice_evento_usato_at as string | null }))
  return NextResponse.json({ totale: lista.length, usati: lista.filter(l => l.usato_at).length, lista })
}

// POST { codice }            -> timbra: { esito: 'validato' | 'negato', motivo?, codice, usato_at? }
// POST { codice, annulla }   -> toglie il timbro (per un errore)
export async function POST(req: Request) {
  if (!autorizzato(req)) return nonAutorizzato()
  const body = await req.json().catch(() => ({}))
  const codice = normalizzaCodice(body?.codice)
  if (!/^EQUIPHER-\d{3,4}$/.test(codice)) return NextResponse.json({ esito: 'negato', motivo: 'non_valido', codice })

  if (body?.annulla) {
    const { error } = await supabaseAdmin.from('newsletter_iscritti').update({ codice_evento_usato_at: null }).eq('codice_evento', codice)
    if (error) return NextResponse.json({ error: 'errore database' }, { status: 500 })
    return NextResponse.json({ ok: true, codice })
  }

  // Un solo aggiornamento atomico: timbra solo se ancora non usato
  const adesso = new Date().toISOString()
  const { data, error } = await supabaseAdmin
    .from('newsletter_iscritti').update({ codice_evento_usato_at: adesso })
    .eq('codice_evento', codice).is('codice_evento_usato_at', null).select('codice_evento, email')
  if (error) return NextResponse.json({ error: 'errore database' }, { status: 500 })
  if (data && data.length > 0) return NextResponse.json({ esito: 'validato', codice, usato_at: adesso, email: data[0].email })

  const { data: esiste } = await supabaseAdmin
    .from('newsletter_iscritti').select('codice_evento_usato_at, email').eq('codice_evento', codice).maybeSingle()
  if (!esiste) return NextResponse.json({ esito: 'negato', motivo: 'non_valido', codice })
  return NextResponse.json({ esito: 'negato', motivo: 'gia_usato', codice, usato_at: esiste.codice_evento_usato_at, email: esiste.email })
}
