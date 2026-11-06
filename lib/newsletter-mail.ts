import { Resend } from 'resend'
import { urlConferma, type Fonte } from '@/lib/newsletter-token'
import { urlDisiscrizione } from '@/lib/unsubscribe'
import { emailConfermaNewsletter, emailBenvenutoNewsletter, emailPassEvento } from '@/lib/email-templates'

// Invio diretto da server (senza passare da /api/email, che accetta solo chiamate interne autenticate).
const FROM = 'ANOINTED <noreply@anointed.it>'
let client: Resend | null = null
const resend = () => (client ??= new Resend(process.env.RESEND_API_KEY))

async function invia(to: string, subject: string, html: string, unsubUrl?: string) {
  // Disiscrizione con un clic (RFC 8058): richiesta da Gmail/Yahoo per gli invii di massa
  const headers = unsubUrl ? { 'List-Unsubscribe': `<${unsubUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } : undefined
  const r = await resend().emails.send({ from: FROM, to, subject, html, ...(headers ? { headers } : {}) })
  if (r.error) throw new Error(`Resend: ${r.error.message}`)
}

export async function inviaConferma(email: string, locale: 'en' | 'it', fonte: Fonte) {
  await invia(
    email,
    locale === 'it' ? 'Conferma la tua iscrizione — ANOINTED' : 'Confirm your subscription — ANOINTED',
    emailConfermaNewsletter({ locale, confirmUrl: urlConferma(email, locale, fonte) }),
  )
}

export async function inviaBenvenuto(email: string, codice: string, locale: 'en' | 'it') {
  await invia(
    email,
    locale === 'it' ? 'Sei scelta — il tuo codice sconto Anointed' : 'You are chosen — your Anointed discount code',
    emailBenvenutoNewsletter({ email, codice, locale, unsubUrl: urlDisiscrizione(email, locale) }),
    urlDisiscrizione(email, locale),
  )
}

export async function inviaPassEvento(email: string, codice: string, locale: 'en' | 'it') {
  await invia(
    email,
    locale === 'it' ? `Il tuo codice EquipHer — ${codice}` : `Your EquipHer code — ${codice}`,
    emailPassEvento({ codice, locale, unsubUrl: urlDisiscrizione(email, locale) }),
    urlDisiscrizione(email, locale),
  )
}
