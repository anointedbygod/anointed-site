import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, tipo } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email mancante' }, { status: 400 })

  try {
    await supabaseAdmin
      .from('newsletter_iscritti')
      .upsert({ email: email.toLowerCase(), tipo: tipo || 'newsletter', created_at: new Date().toISOString() }, { onConflict: 'email' })

    if (tipo === 'popup') {
      // Trova il codice promo attivo da mostrare
      const { data: promo } = await supabaseAdmin
        .from('codici_sconto')
        .select('codice')
        .eq('mostra_in_popup', true)
        .eq('attivo', true)
        .single()

      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'benvenuto_newsletter', email, codice: promo?.codice || 'WELCOME10' }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Newsletter error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
