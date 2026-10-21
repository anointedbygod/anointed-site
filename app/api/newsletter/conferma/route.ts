import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { confermaValida } from '@/lib/newsletter-token'
import { inviaBenvenuto } from '@/lib/newsletter-mail'
import { brevoIscrivi } from '@/lib/brevo'

// Secondo passo del doppio consenso: l'utente ha cliccato il link ricevuto via email.
// Solo ora l'indirizzo entra nella lista, con la prova del consenso, e riceve il codice sconto.
export async function GET(req: Request) {
  const url = new URL(req.url)
  const email = (url.searchParams.get('e') || '').trim().toLowerCase()
  const ts = Number(url.searchParams.get('ts'))
  const locale = url.searchParams.get('l') === 'it' ? 'it' : 'en'
  const fonte = ['popup', 'checkout', 'newsletter'].includes(url.searchParams.get('f') || '') ? url.searchParams.get('f')! : 'popup'
  const token = url.searchParams.get('t') || ''
  const ko = NextResponse.redirect(new URL(`/${locale}/newsletter-confermata?errore=1`, url.origin))

  if (!email || !token || !confermaValida(email, ts, locale, fonte, token)) return ko

  try {
    const { data: esistente } = await supabaseAdmin.from('newsletter_iscritti').select('email').eq('email', email).maybeSingle()

    if (!esistente) {
      const base = { email, tipo: fonte, created_at: new Date().toISOString() }
      // Prova del consenso (GDPR art. 7): data del consenso (richiesta) e conferma via email
      const prova = { consenso_at: new Date(ts).toISOString(), consenso_fonte: `${fonte}+doi`, consenso_lingua: locale }
      const { error: errProva } = await supabaseAdmin.from('newsletter_iscritti').upsert({ ...base, ...prova }, { onConflict: 'email' })
      if (errProva) await supabaseAdmin.from('newsletter_iscritti').upsert(base, { onConflict: 'email' })

      await brevoIscrivi(email)

      const { data: promo } = await supabaseAdmin
        .from('codici_sconto').select('codice').eq('mostra_in_popup', true).eq('attivo', true).single()
      await inviaBenvenuto(email, promo?.codice || 'WELCOME10', locale)
    }
  } catch (err) {
    console.error('Conferma newsletter error:', err)
    return ko
  }
  return NextResponse.redirect(new URL(`/${locale}/newsletter-confermata`, url.origin))
}
