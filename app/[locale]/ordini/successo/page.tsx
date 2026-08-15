'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useCarrello } from '@/lib/carrello'

export default function SuccessoPage() {
  const { svuota } = useCarrello()

  useEffect(() => { svuota() }, [])

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px', padding: '2rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 1.5rem' }}>— THANK YOU —</p>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 1rem', lineHeight: 1.2 }}>
          Your order is confirmed.
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.8, color: '#5d4d42', margin: '0 0 2.5rem' }}>
          You will receive a confirmation email shortly. Thank you for choosing Anointed.
        </p>
        <Link href="/prodotti" style={{
          fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em',
          background: '#3a2e2b', color: '#f1eae4', textDecoration: 'none',
          padding: '0.85rem 2rem', borderRadius: '1px', display: 'inline-block',
        }}>
          CONTINUE SHOPPING
        </Link>
      </div>
    </main>
  )
}
