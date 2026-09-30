import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, tipo, locale } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email mancante' }, { status: 400 })

  try {
    const emailLower = email.toLowerCase()

    const { data: esistente } = await supabaseAdmin
      .from('newsletter_iscritti')
      .select('email')
      .eq('email', emailLower)
      .maybeSingle()

    await supabaseAdmin
      .from('newsletter_iscritti')
      .upsert({ email: emailLower, tipo: tipo || 'newsletter', created_at: new Date().toISOString() }, { onConflict: 'email' })

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
