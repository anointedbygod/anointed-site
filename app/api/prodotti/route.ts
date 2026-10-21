import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'
import { COMING_SOON } from '@/lib/config'

export async function GET() {
  // Fase di lancio: nessun capo esce dall'API pubblica
  if (COMING_SOON) return NextResponse.json([])
  const { data, error } = await supabaseAdmin
    .from('prodotti')
    .select(`*, varianti(*), sezioni(id, nome, slug)`)
    .eq('attivo', true)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
