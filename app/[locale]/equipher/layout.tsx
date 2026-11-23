import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { EVENTO_EQUIPHER_ATTIVO } from '@/lib/config'

// Pagina riservata al QR dell'evento: non indicizzata dai motori di ricerca.
export const metadata: Metadata = {
  title: 'ANOINTED × EquipHer',
  robots: { index: false, follow: false },
}

export default async function EquipherLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  // Evento concluso: chi inquadra ancora il QR arriva alla home del sito
  if (!EVENTO_EQUIPHER_ATTIVO) {
    const { locale } = await params
    redirect(`/${locale === 'it' ? 'it' : 'en'}`)
  }
  return children
}
