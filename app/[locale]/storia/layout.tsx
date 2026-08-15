import type { Metadata } from 'next'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isIT = locale === 'it'
  return {
    title: isIT ? 'La Nostra Storia' : 'Our Story',
    description: isIT ? 'Scopri la storia di ANOINTED — un brand nato dalla fede e dallo scopo.' : 'Discover the story of ANOINTED — a brand born from faith and purpose.',
  }
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
