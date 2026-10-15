import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * Identifica l'utente che ha fatto la richiesta leggendo il token di sessione
 * Supabase dall'header "Authorization: Bearer <token>" e verificandolo con
 * Supabase. Non ci si fida MAI di user_id/email passati dal client.
 * Restituisce null se manca o non è valido.
 */
export async function getUserFromRequest(req: Request) {
  const header = req.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!token) return null
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

/** Per le chiamate interne server-to-server (webhook, cron → /api/email). */
export function isInternalRequest(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return req.headers.get('authorization') === `Bearer ${secret}`
}
