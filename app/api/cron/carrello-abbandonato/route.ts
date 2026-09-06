import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  // Verifica che sia chiamato da Vercel Cron (sicurezza)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const unOraFa = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  // Trova carrelli abbandonati da più di 1 ora, non completati, email non ancora inviata
  const { data: carrelli, error } = await supabaseAdmin
    .from('carrelli_abbandonati')
    .select('*')
    .eq('completato', false)
    .eq('email_inviata', false)
    .lt('created_at', unOraFa)

  if (error) return NextResponse.json({ error }, { status: 500 })
  if (!carrelli || carrelli.length === 0) return NextResponse.json({ sent: 0 })

  let sent = 0
  for (const carrello of carrelli) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'carrello_abbandonato',
          email: carrello.email,
          nome: carrello.nome || 'there',
          prodotti: carrello.articoli.map((a: any) => ({ nome: a.prodottoNome, prezzo: a.prezzo * a.quantita })),
          totale: carrello.totale,
          carrelloId: carrello.id,
        }),
      })
      await supabaseAdmin.from('carrelli_abbandonati').update({ email_inviata: true }).eq('id', carrello.id)
      sent++
    } catch (err) {
      console.error(`Failed to send abandoned cart email to ${carrello.email}:`, err)
    }
  }

  return NextResponse.json({ sent })
}
