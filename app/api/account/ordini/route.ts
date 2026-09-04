import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get('user_id')
  const email = searchParams.get('email')

  if (!user_id && !email) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  // Cerca per user_id OR email, evitando duplicati
  let query = supabaseAdmin.from('ordini').select('*, righe_ordine(*)')

  if (user_id && email) {
    query = query.or(`user_id.eq.${user_id},email_cliente.eq.${email}`)
  } else if (user_id) {
    query = query.eq('user_id', user_id)
  } else if (email) {
    query = query.eq('email_cliente', email)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
