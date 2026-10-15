import { supabaseAdmin } from '@/lib/supabase-admin'
import { getUserFromRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Promemoria carrello: SOLO per utenti loggati con email verificata che hanno dato il consenso
// esplicito alla newsletter/marketing (riga in newsletter_iscritti). Per tutti gli altri
// non si salva nulla sul server e non parte nessuna email.
// L'email viene SEMPRE letta dal token di sessione, mai dal body (impedisce di far inviare
// email a indirizzi altrui).

async function utenteConsenziente(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user?.email || !user.email_confirmed_at) return null
  const email = user.email.toLowerCase()
  const { data } = await supabaseAdmin
    .from('newsletter_iscritti').select('email').eq('email', email).maybeSingle()
  return data ? { email } : null
}

export async function POST(req: Request) {
  const { nome, articoli, totale } = await req.json()
  if (!Array.isArray(articoli) || articoli.length === 0 || articoli.length > 50) {
    return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
  }

  const utente = await utenteConsenziente(req)
  // Nessun consenso / non loggato: risposta ok ma non si salva nulla
  if (!utente) return NextResponse.json({ success: true, saved: false })

  try {
    const { data: esistente } = await supabaseAdmin
      .from('carrelli_abbandonati')
      .select('id')
      .eq('email', utente.email)
      .eq('completato', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const nomeSicuro = typeof nome === 'string' ? nome.slice(0, 120) : null
    if (esistente) {
      await supabaseAdmin
        .from('carrelli_abbandonati')
        .update({ articoli, totale, nome: nomeSicuro, email_inviata: false, created_at: new Date().toISOString() })
        .eq('id', esistente.id)
    } else {
      await supabaseAdmin
        .from('carrelli_abbandonati')
        .insert({ email: utente.email, nome: nomeSicuro, articoli, totale })
    }
    return NextResponse.json({ success: true, saved: true })
  } catch (err) {
    console.error('Carrello sospeso error:', err)
    return NextResponse.json({ error: 'Errore' }, { status: 500 })
  }
}

// Marca come completato quando l'ordine va a buon fine (solo per il proprio carrello)
export async function PUT(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await supabaseAdmin
    .from('carrelli_abbandonati')
    .update({ completato: true })
    .eq('email', user.email.toLowerCase())
    .eq('completato', false)
  return NextResponse.json({ success: true })
}
