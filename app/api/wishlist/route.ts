import { supabaseAdmin } from '@/lib/supabase-admin'
import { getUserFromRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

export async function GET(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return unauthorized()
  const { data, error } = await supabaseAdmin
    .from('wishlist').select('*, prodotti(*)').eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: 'Errore' }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return unauthorized()
  const { prodotto_id } = await req.json()
  if (!prodotto_id) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('wishlist').insert({ user_id: user.id, prodotto_id }).select().single()
  if (error) {
    if (error.code === '23505') return NextResponse.json({ already_exists: true })
    return NextResponse.json({ error: 'Errore' }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return unauthorized()
  const prodotto_id = new URL(req.url).searchParams.get('prodotto_id')
  if (!prodotto_id) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  const { error } = await supabaseAdmin
    .from('wishlist').delete().eq('user_id', user.id).eq('prodotto_id', prodotto_id)
  if (error) return NextResponse.json({ error: 'Errore' }, { status: 500 })
  return NextResponse.json({ success: true })
}
