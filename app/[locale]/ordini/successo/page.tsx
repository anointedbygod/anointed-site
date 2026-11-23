'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useCarrello } from '@/lib/carrello'
import { tracciaAcquisto } from '@/lib/tracciamento'
import { useTranslations } from 'next-intl'

export default function SuccessoPage() {
  const { svuota } = useCarrello()
  const params = useParams()
  const l = params?.locale === 'it' ? 'it' : 'en'
  const t = useTranslations('success')

  useEffect(() => {
    const sessione = new URLSearchParams(window.location.search).get('session_id')
    if (sessione) tracciaAcquisto(sessione)
    svuota()
  }, [svuota])

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px', padding: '2rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 1rem', lineHeight: 1.2 }}>
          {t('title')}
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.8, color: '#5d4d42', margin: '0 0 2.5rem' }}>
          {t('body')}
        </p>
        <Link href={`/${l}/prodotti`} style={{
          fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em',
          background: '#3a2e2b', color: '#f1eae4', textDecoration: 'none',
          padding: '0.85rem 2rem', borderRadius: '1px', display: 'inline-block',
        }}>
          {t('cta')}
        </Link>
      </div>
    </main>
  )
}
