import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get('user_id')
  if (!user_id) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('wishlist')
    .select('*, prodotti(*)')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { user_id, prodotto_id } = await req.json()
  if (!user_id || !prodotto_id) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('wishlist')
    .insert({ user_id, prodotto_id })
    .select()
    .single()

  if (error) {
    // Se è già presente (unique constraint), non è un errore vero
    if (error.code === '23505') return NextResponse.json({ already_exists: true })
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get('user_id')
  const prodotto_id = searchParams.get('prodotto_id')
  if (!user_id || !prodotto_id) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('wishlist')
    .delete()
    .eq('user_id', user_id)
    .eq('prodotto_id', prodotto_id)

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}
