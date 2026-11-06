import type { Metadata } from 'next'

// Pagina riservata al QR dell'evento: non indicizzata dai motori di ricerca.
export const metadata: Metadata = {
  title: 'ANOINTED × EquipHer',
  robots: { index: false, follow: false },
}

export default function EquipherLayout({ children }: { children: React.ReactNode }) {
  return children
}
