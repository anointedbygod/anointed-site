import { supabaseAdmin } from '@/lib/supabase-admin'

export type EsitoSconto =
  | { ok: true; sconto: { id: string; codice: string; tipo: string; valore: number }; importo: number }
  | { ok: false; status: number; error: string; message?: string }

/** Validazione unica del codice sconto, usata sia dall'anteprima sia dal checkout. */
export async function validaCodiceSconto(codiceRaw: string, totale: number, emailRaw?: string): Promise<EsitoSconto> {
  const codice = String(codiceRaw || '').trim().toUpperCase()
  const email = emailRaw ? String(emailRaw).trim().toLowerCase() : ''
  if (!codice) return { ok: false, status: 400, error: 'Codice mancante' }

  const { data: sconto, error } = await supabaseAdmin
    .from('codici_sconto').select('*').eq('codice', codice).eq('attivo', true).single()
  if (error || !sconto) return { ok: false, status: 404, error: 'Codice non valido' }

  if (sconto.scadenza && new Date(sconto.scadenza) < new Date())
    return { ok: false, status: 400, error: 'Codice scaduto' }
  if (sconto.utilizzi_max && sconto.utilizzi_attuali >= sconto.utilizzi_max)
    return { ok: false, status: 400, error: 'Codice esaurito' }
  if (sconto.spesa_minima && totale < sconto.spesa_minima)
    return { ok: false, status: 400, error: `Spesa minima €${Number(sconto.spesa_minima).toFixed(2)} richiesta` }

  if (sconto.richiede_newsletter && email) {
    const { data: iscritto } = await supabaseAdmin
      .from('newsletter_iscritti').select('id').eq('email', email).single()
    if (!iscritto) return {
      ok: false, status: 403, error: 'NEWSLETTER_REQUIRED',
      message: 'Devi essere iscritto alla newsletter per usare questo codice.',
    }
  }

  if (email) {
    const { data: usato } = await supabaseAdmin
      .from('utilizzi_sconti').select('id').eq('codice_id', sconto.id).eq('email', email).single()
    if (usato) return { ok: false, status: 400, error: 'Hai già utilizzato questo codice' }
  }

  const grezzo = sconto.tipo === 'percentuale' ? (totale * sconto.valore) / 100 : Math.min(sconto.valore, totale)
  const importo = Math.round(Math.min(grezzo, totale) * 100) / 100
  return { ok: true, sconto: { id: sconto.id, codice: sconto.codice, tipo: sconto.tipo, valore: sconto.valore }, importo }
}
