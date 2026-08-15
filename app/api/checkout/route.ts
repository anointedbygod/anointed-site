import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { articoli, cliente } = await req.json()

    console.log('Checkout started:', { articoli: articoli?.length, cliente: cliente?.email })

    const totale = articoli.reduce((sum: number, a: any) => sum + a.prezzo * a.quantita, 0)

    const { data: ordine, error } = await supabaseAdmin
      .from('ordini')
      .insert({ stato: 'pending', totale, indirizzo_spedizione: cliente })
      .select().single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const righe = articoli.map((a: any) => ({
      ordine_id: ordine.id,
      variante_id: a.varianteId,
      prodotto_nome: a.prodottoNome,
      variante_info: { taglia: a.taglia, colore: a.colore },
      quantita: a.quantita,
      prezzo_unitario: a.prezzo,
    }))

    await supabaseAdmin.from('righe_ordine').insert(righe)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: articoli.map((a: any) => ({
        price_data: {
          currency: 'eur',
          product_data: { name: `${a.prodottoNome} — ${a.taglia} ${a.colore}` },
          unit_amount: Math.round(a.prezzo * 100),
        },
        quantity: a.quantita,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/ordini/successo?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/carrello`,
      metadata: { ordine_id: ordine.id },
    })

    await supabaseAdmin.from('ordini').update({ stripe_session_id: session.id }).eq('id', ordine.id)

    console.log('Session created:', session.url)
    return NextResponse.json({ url: session.url })

  } catch (err) {
    console.error('CHECKOUT ERROR:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
