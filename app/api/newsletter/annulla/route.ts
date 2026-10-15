import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { firmaValida } from '@/lib/unsubscribe'

// Disiscrizione con un clic dal link nelle email: revoca il consenso marketing
// e ferma anche i promemoria del carrello.
export async function GET(req: Request) {
  const url = new URL(req.url)
  const email = (url.searchParams.get('e') || '').trim().toLowerCase()
  const token = url.searchParams.get('t') || ''
  const locale = url.searchParams.get('l') === 'it' ? 'it' : 'en'

  if (!email || !token || !firmaValida(email, token)) {
    return NextResponse.redirect(new URL(`/${locale}/newsletter-annullata?errore=1`, url.origin))
  }

  await supabaseAdmin.from('newsletter_iscritti').delete().eq('email', email)
  await supabaseAdmin.from('carrelli_abbandonati').update({ completato: true }).eq('email', email).eq('completato', false)

  return NextResponse.redirect(new URL(`/${locale}/newsletter-annullata`, url.origin))
}
