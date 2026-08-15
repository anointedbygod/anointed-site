import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const ordineId = session.metadata?.ordine_id
    if (!ordineId) return NextResponse.json({ received: true })

    // Aggiorna stato ordine
    await supabaseAdmin
      .from('ordini')
      .update({ stato: 'ricevuto' })
      .eq('id', ordineId)

    // Carica dati ordine per email
    const { data: ordine } = await supabaseAdmin
      .from('ordini')
      .select('*, righe_ordine(*)')
      .eq('id', ordineId)
      .single()

    if (ordine?.indirizzo_spedizione?.email) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo: 'conferma_ordine',
            email: ordine.indirizzo_spedizione.email,
            nome: ordine.indirizzo_spedizione.nome,
            ordineId: ordine.id,
            prodotti: ordine.righe_ordine.map((r: any) => ({
              nome: r.prodotto_nome,
              taglia: r.variante_info?.taglia || '',
              colore: r.variante_info?.colore || '',
              quantita: r.quantita,
              prezzo: r.prezzo_unitario,
            })),
            totale: ordine.totale,
            indirizzo: ordine.indirizzo_spedizione,
          }),
        })
      } catch (err) {
        console.error('Email conferma ordine failed:', err)
      }
    }
  }

  return NextResponse.json({ received: true })
}
