import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { emailConfermaOrdine, emailBenvenutoNewsletter, emailCarrelloAbbandonato, emailOrdineSpedito } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'ANOINTED <onboarding@resend.dev>'

export async function POST(req: Request) {
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
        const { email } = body
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: 'Benvenuta nel cerchio — il tuo 10% di sconto',
          html: emailBenvenutoNewsletter({ email }),
        })
        break
      }
      case 'carrello_abbandonato': {
        const { email, nome, prodotti, totale } = body
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: `${nome}, il tuo carrello ti aspetta — ANOINTED`,
          html: emailCarrelloAbbandonato({ nome, prodotti, totale }),
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
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
