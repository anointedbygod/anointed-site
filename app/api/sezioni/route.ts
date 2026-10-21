import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'
import { COMING_SOON } from '@/lib/config'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('sezioni')
    .select(`*, sezioni_prodotti(*, prodotti(id, nome, slug, prezzo, immagini, prezzo_per_colore))`)
    .eq('attiva', true)
    .order('ordine', { ascending: true })
  if (error) return NextResponse.json({ error }, { status: 500 })
  // Fase di lancio: nessun nome/slug/prodotto esce dall'API, solo segnaposto (serve a mostrare il numero di card)
  if (COMING_SOON) {
    return NextResponse.json((data || []).map((_, i) => ({ id: `cs-${i}`, nome: 'COMING SOON', slug: `coming-soon-${i}`, sezioni_prodotti: [] })))
  }
  return NextResponse.json(data)
}
