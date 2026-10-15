import { supabaseAdmin } from '@/lib/supabase-admin'
import { getUserFromRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

export async function GET(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return unauthorized()
  const { data, error } = await supabaseAdmin
    .from('indirizzi_clienti').select('*').eq('user_id', user.id)
    .order('predefinito', { ascending: false })
  if (error) return NextResponse.json({ error: 'Errore' }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return unauthorized()
  const body = await req.json()
  // Solo i campi attesi; user_id sempre quello dell'utente autenticato
  const { nome, indirizzo, citta, cap, paese, telefono, predefinito } = body
  const riga: Record<string, unknown> = { nome, indirizzo, citta, cap, paese, user_id: user.id }
  if (telefono !== undefined) riga.telefono = telefono
  if (predefinito !== undefined) riga.predefinito = !!predefinito
  const { data, error } = await supabaseAdmin.from('indirizzi_clienti').insert(riga).select().single()
  if (error) return NextResponse.json({ error: 'Errore' }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return unauthorized()
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  // Cancella solo se l'indirizzo appartiene all'utente
  const { error } = await supabaseAdmin.from('indirizzi_clienti').delete().eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: 'Errore' }, { status: 500 })
  return NextResponse.json({ success: true })
}
