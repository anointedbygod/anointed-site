import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, nome, articoli, totale } = await req.json()
  if (!email || !articoli?.length) return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })

  try {
    // Upsert: se esiste già un carrello sospeso per questa email, aggiornalo
    const { data: esistente } = await supabaseAdmin
      .from('carrelli_abbandonati')
      .select('id')
      .eq('email', email.toLowerCase())
      .eq('completato', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (esistente) {
      await supabaseAdmin
        .from('carrelli_abbandonati')
        .update({ articoli, totale, nome, email_inviata: false, created_at: new Date().toISOString() })
        .eq('id', esistente.id)
    } else {
      await supabaseAdmin
        .from('carrelli_abbandonati')
        .insert({ email: email.toLowerCase(), nome, articoli, totale })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Carrello sospeso error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// Marca come completato quando l'ordine va a buon fine
export async function PUT(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email mancante' }, { status: 400 })

  await supabaseAdmin
    .from('carrelli_abbandonati')
    .update({ completato: true })
    .eq('email', email.toLowerCase())
    .eq('completato', false)

  return NextResponse.json({ success: true })
}
