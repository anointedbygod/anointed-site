import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const prodotto_id = searchParams.get('prodotto_id')
  if (!prodotto_id) return NextResponse.json([], { status: 200 })

  const { data, error } = await supabaseAdmin
    .from('colori_prodotto')
    .select(`*, immagini_colore(*), varianti(*)`)
    .eq('prodotto_id', prodotto_id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
