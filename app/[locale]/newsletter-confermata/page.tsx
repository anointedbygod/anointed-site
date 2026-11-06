'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function Contenuto() {
  const pathname = usePathname()
  const isIT = pathname.startsWith('/it')
  const sp = useSearchParams()
  const errore = sp.get('errore') === '1'
  const evento = sp.get('evento') === '1'
  const codice = (sp.get('c') || '').replace(/[^A-Z0-9-]/gi, '').slice(0, 20)
  const locale = isIT ? 'it' : 'en'
  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '6rem 1.5rem', textAlign: 'center', fontFamily: 'Inter, sans-serif', color: '#5d4d42' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 300, color: '#3a2e2b', margin: '0 0 1rem' }}>
          {errore ? (isIT ? 'Link non valido' : 'Invalid link') : (isIT ? 'Iscrizione confermata' : 'Subscription confirmed')}
        </h1>
        <p style={{ fontSize: '14px', lineHeight: 1.8, margin: '0 0 2rem' }}>
          {errore
            ? (isIT ? 'Il link non è valido o è scaduto. Puoi iscriverti di nuovo dal sito.' : 'This link is invalid or expired. You can subscribe again from the site.')
            : (evento ? (isIT ? 'Grazie! Mostra questo codice allo stand ANOINTED durante EquipHer per avere il 10%. Ti abbiamo inviato anche un\'email con lo stesso codice.' : 'Thank you! Show this code at the ANOINTED stand during EquipHer to get 10% off. We have also emailed you the same code.') : isIT ? 'Grazie! Ti abbiamo appena inviato il tuo codice sconto: controlla la posta (anche lo spam).' : 'Thank you! We have just sent you your discount code: check your inbox (and spam folder).')}
        </p>
        {!errore && evento && codice && (
          <div style={{ background: '#3a2e2b', borderRadius: '4px', padding: '1.75rem 1rem', margin: '0 0 2rem' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#c1a99a', margin: '0 0 0.6rem' }}>{isIT ? 'IL TUO CODICE' : 'YOUR CODE'}</p>
            <p style={{ fontFamily: 'monospace', fontSize: '1.9rem', fontWeight: 700, letterSpacing: '0.1em', color: '#f1eae4', margin: 0 }}>{codice}</p>
          </div>
        )}
        <Link href={`/${locale}`} style={{ color: '#3a2e2b', fontSize: '12px', letterSpacing: '0.14em' }}>{isIT ? 'TORNA AL SITO' : 'BACK TO THE SITE'}</Link>
      </div>
    </main>
  )
}

export default function Page() {
  return <Suspense fallback={null}><Contenuto /></Suspense>
}
