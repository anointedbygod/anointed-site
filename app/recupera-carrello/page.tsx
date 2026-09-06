'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCarrello } from '@/lib/carrello'

export default function RecuperaCarrello() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { svuota, aggiungi } = useCarrello()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) { router.push('/en/prodotti'); return }

    fetch(`/api/carrello-sospeso/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error || !data.articoli) { setStatus('error'); return }
        svuota()
        data.articoli.forEach((a: any) => aggiungi(a))
        router.push('/en/checkout')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.16em', color: '#c1a99a' }}>
        {status === 'loading' ? 'RESTORING YOUR CART...' : 'Something went wrong. Redirecting...'}
      </p>
    </main>
  )
}
