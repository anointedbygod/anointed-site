import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

// Pubblica in sola lettura (serve al checkout). La modifica delle zone si fa
// solo dal pannello admin (anointed-admin), che ha le sue API.
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('zone_spedizione')
    .select('*')
    .order('nome', { ascending: true })
  if (error) return NextResponse.json({ error: 'Errore' }, { status: 500 })
  return NextResponse.json(data)
}
