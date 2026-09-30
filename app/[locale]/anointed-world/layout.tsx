import type { Metadata } from 'next'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isIT = locale === 'it'
  return {
    title: isIT ? 'Anointed World' : 'Anointed World',
    description: isIT ? 'Eventi, incontri e progetti che portano il mondo ANOINTED nella realtà.' : 'Events, encounters and projects that bring the ANOINTED world to life.',
  }
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
