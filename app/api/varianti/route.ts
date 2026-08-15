import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const prodottoId = searchParams.get('prodotto_id')
  const { data, error } = await supabaseAdmin
    .from('varianti')
    .select('*')
    .eq('prodotto_id', prodottoId)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
