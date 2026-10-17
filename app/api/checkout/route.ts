import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getUserFromRequest } from '@/lib/auth'
import { validaCodiceSconto } from '@/lib/sconti'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status })

// I prezzi, la spedizione e lo sconto vengono SEMPRE ricalcolati qui dal database:
// del carrello inviato dal browser si usano solo prodotto, colore, taglia e quantità.
export async function POST(req: Request) {
  try {
    const { articoli, cliente, sconto, terminiAccettati } = await req.json()
    // Accettazione esplicita di condizioni di vendita / privacy / recesso prima del pagamento
    if (terminiAccettati !== true) return NextResponse.json({ error: 'Termini non accettati' }, { status: 400 })

    if (!Array.isArray(articoli) || articoli.length === 0 || articoli.length > 50) return bad('Carrello non valido')
    if (!cliente || typeof cliente.email !== 'string' || !cliente.email.includes('@')) return bad('Email non valida')
    const paese = String(cliente.paese || '').toUpperCase()
    if (!paese) return bad('Paese mancante')

    const user = await getUserFromRequest(req) // opzionale: l'acquisto da ospite resta possibile

    // ── Righe d'ordine con prezzi verificati ──
    const righeVerificate: {
      varianteId: string; prodottoNome: string; taglia: string; colore: string; prezzo: number; quantita: number
    }[] = []

    for (const a of articoli) {
      const quantita = Number(a?.quantita)
      if (!Number.isInteger(quantita) || quantita < 1 || quantita > 99) return bad('Quantità non valida')

      let q = supabaseAdmin.from('prodotti').select('id, nome, prezzo, prezzo_per_colore')
      q = a.prodottoId ? q.eq('id', a.prodottoId) : q.eq('nome', String(a.prodottoNome || ''))
      const { data: prodotti } = await q.limit(1)
      const prodotto = prodotti?.[0]
      if (!prodotto) return bad('Prodotto non trovato')

      let prezzo = Number(prodotto.prezzo)
      const colore = String(a.colore || '')
      if (prodotto.prezzo_per_colore) {
        const { data: col } = await supabaseAdmin
          .from('colori_prodotto').select('prezzo_aggiuntivo')
          .eq('prodotto_id', prodotto.id).eq('nome', colore).limit(1)
        if (!col?.[0]) return bad('Colore non valido')
        prezzo = Number(col[0].prezzo_aggiuntivo)
      }
      if (!Number.isFinite(prezzo) || prezzo <= 0) return bad('Prezzo non valido')

      if (a.varianteId && UUID.test(String(a.varianteId))) {
        const { data: v } = await supabaseAdmin.from('varianti').select('stock').eq('id', a.varianteId).limit(1)
        if (v?.[0] && Number(v[0].stock) < quantita) return bad(`Disponibilità insufficiente per ${prodotto.nome}`, 409)
      }

      righeVerificate.push({
        varianteId: String(a.varianteId || ''), prodottoNome: prodotto.nome,
        taglia: String(a.taglia || ''), colore, prezzo, quantita,
      })
    }

    const subtotale = righeVerificate.reduce((s, r) => s + r.prezzo * r.quantita, 0)

    // ── Spedizione dalla zona del paese ──
    const { data: zone } = await supabaseAdmin.from('zone_spedizione').select('*')
    const zona = (zone || []).find((z: any) => z.attiva !== false && Array.isArray(z.paesi) && z.paesi.includes(paese))
    if (!zona) return bad('Spedizione non disponibile per questo paese')
    const gratis = zona.soglia_gratuita && subtotale >= zona.soglia_gratuita
    const costoSpedizione = gratis ? 0 : Number(zona.costo) || 0

    // ── Sconto rivalidato lato server ──
    let importoSconto = 0
    let scontoValidato: { id: string; codice: string } | null = null
    if (sconto?.codice) {
      const esito = await validaCodiceSconto(sconto.codice, subtotale, cliente.email)
      if (!esito.ok) return bad(esito.error, esito.status)
      importoSconto = esito.importo
      scontoValidato = { id: esito.sconto.id, codice: esito.sconto.codice }
    }

    const totale = Math.round((subtotale - importoSconto + costoSpedizione) * 100) / 100

    // ── Ordine su Supabase ──
    const { data: ordine, error } = await supabaseAdmin
      .from('ordini')
      .insert({
        stato: 'pending',
        totale,
        indirizzo_spedizione: { ...cliente, nome: `${cliente.nome || ''} ${cliente.cognome || ''}`.trim(), email: cliente.email },
        email_cliente: cliente.email,
        ...(user ? { user_id: user.id } : {}),
      })
      .select().single()
    if (error) return bad('Errore nella creazione dell\'ordine', 500)

    await supabaseAdmin.from('righe_ordine').insert(righeVerificate.map(r => ({
      ordine_id: ordine.id,
      variante_id: UUID.test(r.varianteId) ? r.varianteId : null,
      prodotto_nome: r.prodottoNome,
      variante_info: { taglia: r.taglia, colore: r.colore },
      quantita: r.quantita,
      prezzo_unitario: r.prezzo,
    })))

    // ── Stripe ──
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = righeVerificate.map(r => ({
      price_data: {
        currency: 'eur',
        product_data: { name: `${r.prodottoNome} — ${r.taglia} ${r.colore}`.trim() },
        unit_amount: Math.round(r.prezzo * 100),
      },
      quantity: r.quantita,
    }))
    if (costoSpedizione > 0) {
      lineItems.push({
        price_data: { currency: 'eur', product_data: { name: `Spedizione — ${zona.nome}` }, unit_amount: Math.round(costoSpedizione * 100) },
        quantity: 1,
      })
    }

    const metadata: Record<string, string> = { ordine_id: ordine.id, email: cliente.email }
    if (scontoValidato) metadata.sconto_id = scontoValidato.id
    // Prova dell'accettazione di Condizioni di Vendita / Privacy / recesso (visibile anche nella dashboard Stripe)
    metadata.termini_accettati_il = new Date().toISOString()
    metadata.termini_versione = '2026-10-15'

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: cliente.email,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/ordini/successo?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      metadata,
    }

    if (scontoValidato && importoSconto > 0) {
      const coupon = await stripe.coupons.create({
        name: scontoValidato.codice,
        amount_off: Math.round(importoSconto * 100),
        currency: 'eur',
        duration: 'once',
      })
      sessionParams.discounts = [{ coupon: coupon.id }]
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    await supabaseAdmin.from('ordini').update({ stripe_session_id: session.id }).eq('id', ordine.id)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('CHECKOUT ERROR:', err)
    return bad('Errore durante il checkout', 500)
  }
}
