import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const isIT = locale === 'it'

  const { data: prodotto } = await supabaseAdmin
    .from('prodotti')
    .select('nome, descrizione, immagini')
    .eq('slug', slug)
    .single()

  if (!prodotto) return { title: 'Prodotto — ANOINTED' }

  return {
    title: prodotto.nome,
    description: prodotto.descrizione || (isIT ? `Scopri ${prodotto.nome} su ANOINTED.` : `Discover ${prodotto.nome} on ANOINTED.`),
    openGraph: {
      title: `${prodotto.nome} — ANOINTED`,
      description: prodotto.descrizione || '',
      images: prodotto.immagini?.[0] ? [{ url: prodotto.immagini[0], width: 800, height: 1000, alt: prodotto.nome }] : [],
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
