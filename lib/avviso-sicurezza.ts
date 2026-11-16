import { Resend } from 'resend'
import { AZIENDA } from '@/lib/azienda'

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

/** Email di avviso al titolare (SECURITY_ALERT_EMAIL, altrimenti CONTACT_TO_EMAIL / email aziendale). Non deve mai bloccare la richiesta. */
export async function avvisoSicurezza(oggetto: string, dettaglio: string) {
  try {
    if (!process.env.RESEND_API_KEY) return
    const to = process.env.SECURITY_ALERT_EMAIL || process.env.CONTACT_TO_EMAIL || AZIENDA.email
    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: 'ANOINTED <noreply@anointed.it>',
      to,
      subject: `[Sicurezza] ${oggetto}`,
      html: `<p><strong>${esc(oggetto)}</strong></p><p>${esc(dettaglio)}</p><p style="color:#888">Avviso automatico del sito ANOINTED.</p>`,
    })
  } catch (e) { console.error('Avviso sicurezza non inviato:', e) }
}
