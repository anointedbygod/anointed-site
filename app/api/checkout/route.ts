import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { articoli, cliente, sconto, spedizione, totaleFinale } = await req.json()

    const subtotale = articoli.reduce((sum: number, a: any) => sum + a.prezzo * a.quantita, 0)
    const costoSpedizione = spedizione?.costo || 0
    const importoSconto = sconto?.importo || 0
    const totale = totaleFinale || (subtotale - importoSconto + costoSpedizione)

    // Crea ordine su Supabase
    const { data: ordine, error } = await supabaseAdmin
      .from('ordini')
      .insert({
        stato: 'pending',
        totale,
        indirizzo_spedizione: { ...cliente, nome: `${cliente.nome} ${cliente.cognome || ''}`.trim(), email: cliente.email },
        email_cliente: cliente.email,
      })
      .select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Righe ordine
    const righe = articoli.map((a: any) => ({
      ordine_id: ordine.id,
      variante_id: a.varianteId,
      prodotto_nome: a.prodottoNome,
      variante_info: { taglia: a.taglia, colore: a.colore },
      quantita: a.quantita,
      prezzo_unitario: a.prezzo,
    }))
    await supabaseAdmin.from('righe_ordine').insert(righe)

    // Line items Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = articoli.map((a: any) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: `${a.prodottoNome} — ${a.taglia} ${a.colore}` },
        unit_amount: Math.round(a.prezzo * 100),
      },
      quantity: a.quantita,
    }))

    // Aggiungi spedizione come line item se presente
    if (costoSpedizione > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: `Spedizione — ${spedizione.zona}` },
          unit_amount: Math.round(costoSpedizione * 100),
        },
        quantity: 1,
      })
    }

    // Metadata per webhook
    const metadata: Record<string, string> = {
      ordine_id: ordine.id,
      email: cliente.email,
    }
    if (sconto?.id) metadata.sconto_id = sconto.id

    // Crea sessione Stripe con eventuale sconto
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: cliente.email,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/ordini/successo?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      metadata,
    }

    // Applica sconto come coupon Stripe se presente
    if (sconto && importoSconto > 0) {
      try {
        const coupon = await stripe.coupons.create({
          name: sconto.codice,
          amount_off: Math.round(importoSconto * 100),
          currency: 'eur',
          duration: 'once',
        })
        sessionParams.discounts = [{ coupon: coupon.id }]
      } catch (err) {
        console.error('Coupon creation failed:', err)
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    await supabaseAdmin.from('ordini').update({ stripe_session_id: session.id }).eq('id', ordine.id)

    return NextResponse.json({ url: session.url })

  } catch (err) {
    console.error('CHECKOUT ERROR:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
