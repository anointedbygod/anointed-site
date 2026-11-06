import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { confermaValida } from '@/lib/newsletter-token'
import { inviaBenvenuto, inviaPassEvento } from '@/lib/newsletter-mail'
import { brevoIscrivi } from '@/lib/brevo'

// Secondo passo del doppio consenso: l'utente ha cliccato il link ricevuto via email.
// Solo ora l'indirizzo entra nella lista, con la prova del consenso, e riceve il codice sconto.
export async function GET(req: Request) {
  const url = new URL(req.url)
  const email = (url.searchParams.get('e') || '').trim().toLowerCase()
  const ts = Number(url.searchParams.get('ts'))
  const locale = url.searchParams.get('l') === 'it' ? 'it' : 'en'
  const fonte = ['popup', 'checkout', 'newsletter', 'equipher'].includes(url.searchParams.get('f') || '') ? url.searchParams.get('f')! : 'popup'
  const token = url.searchParams.get('t') || ''
  const ko = NextResponse.redirect(new URL(`/${locale}/newsletter-confermata?errore=1`, url.origin))

  if (!email || !token || !confermaValida(email, ts, locale, fonte, token)) return ko

  // Pass dell'evento: codice progressivo EQUIPHER-NNN assegnato ora (a email confermata), una sola volta per indirizzo.
  // Non e' uno sconto del sito: nessun codice in codici_sconto, nessun'email di benvenuto con WELCOME10.
  if (fonte === 'equipher') {
    try {
      const base = { email, tipo: 'equipher', created_at: new Date().toISOString() }
      const prova = { consenso_at: new Date(ts).toISOString(), consenso_fonte: 'equipher+doi', consenso_lingua: locale }
      const { error: errNuovo } = await supabaseAdmin.from('newsletter_iscritti').upsert({ ...base, ...prova }, { onConflict: 'email', ignoreDuplicates: true })
      if (errNuovo) await supabaseAdmin.from('newsletter_iscritti').upsert(base, { onConflict: 'email', ignoreDuplicates: true })

      const { data: riga } = await supabaseAdmin.from('newsletter_iscritti').select('codice_evento').eq('email', email).single()
      let codice: string | null = riga?.codice_evento ?? null
      let nuovo = false
      if (!codice) {
        const { data: num, error: errNum } = await supabaseAdmin.rpc('prossimo_codice_equipher')
        if (errNum || !num) throw errNum ?? new Error('Codice non generato')
        // aggiorna solo se ancora vuoto: un doppio clic non assegna due codici
        await supabaseAdmin.from('newsletter_iscritti').update({ codice_evento: num as string }).eq('email', email).is('codice_evento', null)
        const { data: dopo } = await supabaseAdmin.from('newsletter_iscritti').select('codice_evento').eq('email', email).single()
        codice = dopo?.codice_evento ?? null
        nuovo = codice === num
      }
      if (!codice) throw new Error('Codice assente')
      await brevoIscrivi(email, true)
      if (nuovo) await inviaPassEvento(email, codice, locale)
      return NextResponse.redirect(new URL(`/${locale}/newsletter-confermata?evento=1&c=${encodeURIComponent(codice)}`, url.origin))
    } catch (err) {
      console.error('Conferma pass evento error:', err)
      return ko
    }
  }

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
