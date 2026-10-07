import type { Metadata } from 'next'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isIT = locale === 'it'
  return {
    title: isIT ? 'La Filiera' : 'Our Supply Chain',
    description: isIT
      ? 'Dove nascono i tessuti di ANOINTED: il lanificio Cariaggi e la tradizione tessile italiana.'
      : 'Where ANOINTED fabrics are born: the Cariaggi mill and Italian textile tradition.',
  }
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
