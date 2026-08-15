import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, tipo } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email mancante' }, { status: 400 })

  try {
    // Salva iscritto in Supabase
    await supabaseAdmin
      .from('newsletter_iscritti')
      .upsert({ email, tipo: tipo || 'newsletter', created_at: new Date().toISOString() }, { onConflict: 'email' })

    // Se viene dal popup manda il codice sconto
    if (tipo === 'popup') {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'benvenuto_newsletter', email }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Newsletter error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
