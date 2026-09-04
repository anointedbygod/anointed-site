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
    const scontoId = session.metadata?.sconto_id
    const emailCliente = session.customer_email || session.metadata?.email

    if (!ordineId) return NextResponse.json({ received: true })

    // Prova a collegare l'ordine a un account esistente tramite email
    let userId: string | null = null
    if (emailCliente) {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers()
      const matchedUser = users?.users?.find((u: any) => u.email?.toLowerCase() === emailCliente.toLowerCase())
      if (matchedUser) userId = matchedUser.id
    }

    // Aggiorna stato ordine (e collega a user_id se trovato, solo se non già impostato)
    const updateData: any = { stato: 'ricevuto', email_cliente: emailCliente }
    if (userId) {
      const { data: ordineAttuale } = await supabaseAdmin.from('ordini').select('user_id').eq('id', ordineId).single()
      if (!ordineAttuale?.user_id) updateData.user_id = userId
    }

    await supabaseAdmin
      .from('ordini')
      .update(updateData)
      .eq('id', ordineId)

    // Registra utilizzo sconto
    if (scontoId && emailCliente) {
      // Controlla se esiste già prima di inserire
      const { data: esistente } = await supabaseAdmin
        .from('utilizzi_sconti')
        .select('id')
        .eq('codice_id', scontoId)
        .eq('email', emailCliente.toLowerCase())
        .single()
      if (!esistente) {
        await supabaseAdmin.from('utilizzi_sconti').insert({
          codice_id: scontoId,
          email: emailCliente.toLowerCase(),
        })
      }

      await supabaseAdmin.rpc('incrementa_utilizzi_sconto', { sconto_id: scontoId })
    }

    // Carica dati ordine per email
    const { data: ordine } = await supabaseAdmin
      .from('ordini')
      .select('*, righe_ordine(*)')
      .eq('id', ordineId)
      .single()

    if (ordine?.indirizzo_spedizione?.email || emailCliente) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo: 'conferma_ordine',
            email: ordine?.indirizzo_spedizione?.email || emailCliente,
            nome: ordine?.indirizzo_spedizione?.nome || 'Cliente',
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
