import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('codici_sconto')
    .select('codice, valore, tipo, mostra_in_popup, attivo')
    .eq('attivo', true)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
