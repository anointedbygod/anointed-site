import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, tipo, locale, consenso } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email mancante' }, { status: 400 })
  // Consenso esplicito obbligatorio (GDPR): niente iscrizione senza casella spuntata dall'utente
  if (consenso !== true) return NextResponse.json({ error: 'Consenso mancante' }, { status: 400 })

  try {
    const emailLower = email.toLowerCase()

    const { data: esistente } = await supabaseAdmin
      .from('newsletter_iscritti')
      .select('email')
      .eq('email', emailLower)
      .maybeSingle()

    const base = { email: emailLower, tipo: tipo || 'newsletter', created_at: new Date().toISOString() }
    // Prova del consenso (GDPR art. 7): data, fonte, lingua. Richiede supabase/consensi.sql;
    // se le colonne non ci sono ancora, si ripiega sul salvataggio base senza rompere l'iscrizione.
    const prova = { consenso_at: new Date().toISOString(), consenso_fonte: tipo || 'newsletter', consenso_lingua: locale === 'it' ? 'it' : 'en' }
    const { error: errProva } = await supabaseAdmin
      .from('newsletter_iscritti')
      .upsert({ ...base, ...prova }, { onConflict: 'email' })
    if (errProva) {
      await supabaseAdmin.from('newsletter_iscritti').upsert(base, { onConflict: 'email' })
    }

    // Invia l'email di benvenuto solo alla prima iscrizione (non ad ogni re-invio del form)
    if (!esistente) {
      const { data: promo } = await supabaseAdmin
        .from('codici_sconto')
        .select('codice')
        .eq('mostra_in_popup', true)
        .eq('attivo', true)
        .single()

      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'benvenuto_newsletter', email, codice: promo?.codice || 'WELCOME10', locale: locale === 'it' ? 'it' : 'en' }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Newsletter error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
