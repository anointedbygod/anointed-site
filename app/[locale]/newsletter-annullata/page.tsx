'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function Contenuto() {
  const pathname = usePathname()
  const isIT = pathname.startsWith('/it')
  const errore = useSearchParams().get('errore') === '1'
  const locale = isIT ? 'it' : 'en'
  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '6rem 1.5rem', textAlign: 'center', fontFamily: 'Inter, sans-serif', color: '#5d4d42' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 300, color: '#3a2e2b', margin: '0 0 1rem' }}>
          {errore ? (isIT ? 'Link non valido' : 'Invalid link') : (isIT ? 'Iscrizione annullata' : 'You have been unsubscribed')}
        </h1>
        <p style={{ fontSize: '14px', lineHeight: 1.8, margin: '0 0 2rem' }}>
          {errore
            ? (isIT ? 'Il link non è valido o è scaduto. Scrivici a info@anointed.it e ti cancelliamo a mano.' : 'This link is invalid or expired. Write to info@anointed.it and we will remove you manually.')
            : (isIT ? 'Non riceverai più email promozionali né promemoria del carrello da ANOINTED.' : 'You will no longer receive promotional emails or cart reminders from ANOINTED.')}
        </p>
        <Link href={`/${locale}`} style={{ color: '#3a2e2b', fontSize: '12px', letterSpacing: '0.14em' }}>{isIT ? 'TORNA AL SITO' : 'BACK TO THE SITE'}</Link>
      </div>
    </main>
  )
}

export default function Page() {
  return <Suspense fallback={null}><Contenuto /></Suspense>
}
