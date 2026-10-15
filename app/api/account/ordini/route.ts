import { supabaseAdmin } from '@/lib/supabase-admin'
import { getUserFromRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Ordini dell'utente loggato. L'identità arriva SOLO dal token di sessione.
export async function GET(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let query = supabaseAdmin.from('ordini').select('*, righe_ordine(*)')
  // Gli ordini fatti da ospite si collegano per email solo se l'email dell'account è verificata
  if (user.email && user.email_confirmed_at) {
    query = query.or(`user_id.eq.${user.id},email_cliente.eq.${user.email}`)
  } else {
    query = query.eq('user_id', user.id)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: 'Errore' }, { status: 500 })
  return NextResponse.json(data)
}
