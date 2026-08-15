import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'



export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('sezioni')
    .select(`*, sezioni_prodotti(*, prodotti(id, nome, slug, prezzo, immagini, prezzo_per_colore))`)
    .eq('attiva', true)
    .order('ordine', { ascending: true })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
