'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * fetch che allega il token di sessione dell'utente loggato, così le API
 * private possono verificare chi sta chiedendo i dati.
 */
export async function authFetch(input: string, init: RequestInit = {}) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase.auth.getSession()
  const headers = new Headers(init.headers)
  if (data.session?.access_token) {
    headers.set('Authorization', `Bearer ${data.session.access_token}`)
  }
  return fetch(input, { ...init, headers })
}
