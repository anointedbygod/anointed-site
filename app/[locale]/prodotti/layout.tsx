import type { Metadata } from 'next'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isIT = locale === 'it'
  return {
    title: isIT ? 'Collezioni' : 'Collections',
    description: isIT ? 'Esplora le collezioni ANOINTED.' : 'Explore ANOINTED collections.',
  }
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
