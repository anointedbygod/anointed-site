import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import ClientLayout from '@/components/ClientLayout'
import '../globals.css'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isIT = locale === 'it'

  return {
    title: {
      default: 'ANOINTED — Chosen. Set apart. Appointed.',
      template: '%s — ANOINTED',
    },
    description: isIT
      ? 'Brand di moda femminile ispirato al significato biblico dell\'essere unti — scelti e messi da parte. Abbigliamento con scopo.'
      : 'A women\'s fashion brand inspired by the biblical meaning of being anointed — chosen and set apart. Clothing with purpose.',
    keywords: isIT
      ? ['moda femminile', 'abbigliamento donna', 'brand italiano', 'anointed', 'blazer', 'twilli', 'pochette']
      : ['women fashion', 'clothing brand', 'italian fashion', 'anointed', 'blazer', 'twilli', 'pochette'],
    authors: [{ name: 'ANOINTED' }],
    creator: 'ANOINTED',
    openGraph: {
      type: 'website',
      locale: isIT ? 'it_IT' : 'en_US',
      url: 'https://anointed.it',
      siteName: 'ANOINTED',
      title: 'ANOINTED — Chosen. Set apart. Appointed.',
      description: isIT
        ? 'Brand di moda femminile ispirato al significato biblico dell\'essere unti.'
        : 'A women\'s fashion brand inspired by the biblical meaning of being anointed.',
      images: [{ url: 'https://anointed.it/og-image.jpg', width: 1200, height: 630, alt: 'ANOINTED' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'ANOINTED — Chosen. Set apart. Appointed.',
      description: isIT ? 'Brand di moda femminile con scopo.' : 'A women\'s fashion brand with purpose.',
      images: ['https://anointed.it/og-image.jpg'],
    },
    robots: { index: true, follow: true },
    icons: { icon: '/monogram-light-brown.svg', apple: '/monogram-light-brown.svg' },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
