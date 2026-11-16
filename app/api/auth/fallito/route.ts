import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { avvisoSicurezza } from '@/lib/avviso-sicurezza'
import { ipDa, limitato, origineValida } from '@/lib/rate-limit'

// Il browser segnala qui un login fallito. Alla 5ª password errata in 15 minuti sullo stesso account
// arriva un'email di avviso (al massimo una all'ora per account). Non rivela se l'account esiste.
// Richiede la tabella tentativi_login (supabase/sicurezza.sql); se manca, risponde comunque ok.
export async function POST(req: Request) {
  if (!origineValida(req)) return NextResponse.json({ ok: true })
  const ip = ipDa(req)
  if (limitato('fallito:' + ip, 30, 10 * 60 * 1000)) return NextResponse.json({ ok: true })
  const { email: raw } = await req.json().catch(() => ({ email: '' }))
  const email = String(raw || '').trim().toLowerCase().slice(0, 254)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ ok: true })

  try {
    const da = new Date(Date.now() - 15 * 60 * 1000).toISOString()
    await supabaseAdmin.from('tentativi_login').insert({ email, ip })
    const { count } = await supabaseAdmin.from('tentativi_login').select('id', { count: 'exact', head: true }).eq('email', email).gte('created_at', da)
    if ((count ?? 0) >= 5 && !limitato('avviso:' + email, 1, 60 * 60 * 1000)) {
      await avvisoSicurezza('5 password errate di fila', `Account: ${email}. Ultimo IP: ${ip}. Tentativi falliti negli ultimi 15 minuti: ${count}.`)
    }
    // pulizia vecchi tentativi (> 7 giorni)
    await supabaseAdmin.from('tentativi_login').delete().lt('created_at', new Date(Date.now() - 7 * 86400000).toISOString())
  } catch (e) { console.error('Tentativi login:', e) }
  return NextResponse.json({ ok: true })
}
