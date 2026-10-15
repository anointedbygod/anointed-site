import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { isInternalRequest } from '@/lib/auth'
import { urlDisiscrizione } from '@/lib/unsubscribe'
import { emailConfermaOrdine, emailBenvenutoNewsletter, emailCarrelloAbbandonato, emailOrdineSpedito } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'ANOINTED <noreply@anointed.it>'

export async function POST(req: Request) {
  // Solo chiamate interne (webhook Stripe, cron): impedisce a chiunque di spedire email dal dominio
  if (!isInternalRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { tipo } = body

  try {
    switch (tipo) {
      case 'conferma_ordine': {
        const { email, nome, ordineId, prodotti, totale, indirizzo } = body
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: `Ordine confermato #${ordineId.slice(0, 8).toUpperCase()} — ANOINTED`,
          html: emailConfermaOrdine({ nome, ordineId, prodotti, totale, indirizzo }),
        })
        break
      }
      case 'benvenuto_newsletter': {
        const { email, codice, locale } = body
        const isIt = locale === 'it'
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: isIt ? `Sei scelta — il tuo codice sconto Anointed` : `You are chosen — your Anointed discount code`,
          html: emailBenvenutoNewsletter({ email, codice, locale: isIt ? 'it' : 'en', unsubUrl: urlDisiscrizione(email, isIt ? 'it' : 'en') }),
        })
        break
      }
      case 'carrello_abbandonato': {
        const { email, nome, prodotti, totale, carrelloId } = body
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: `${nome}, your cart is waiting — ANOINTED`,
          html: emailCarrelloAbbandonato({ nome, prodotti, totale, carrelloId, unsubUrl: urlDisiscrizione(email, 'en') }),
        })
        break
      }
      case 'ordine_spedito': {
        const { email, nome, ordineId, trackingUrl } = body
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: `Il tuo ordine è in arrivo — ANOINTED`,
          html: emailOrdineSpedito({ nome, ordineId, trackingUrl }),
        })
        break
      }
      default:
        return NextResponse.json({ error: 'Tipo non valido' }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('EMAIL ERROR:', err)
    return NextResponse.json({ error: 'Invio non riuscito' }, { status: 500 })
  }
}
