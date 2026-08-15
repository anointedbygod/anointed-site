'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'

interface Prodotto { id: string; nome: string; slug: string; prezzo: number; immagini: string[] }
interface Sezione { id: string; nome: string; slug: string; sezioni_prodotti: { prodotti: Prodotto }[] }

export default function SezioneSlugPage() {
  const params = useParams()
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'
  const [sezione, setSezione] = useState<Sezione | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sezioni')
      .then(r => r.json())
      .then(data => {
        const found = Array.isArray(data) ? data.find((s: Sezione) => s.slug === params.slug) : null
        setSezione(found || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.slug])

  const viewLabel = locale === 'it' ? 'VEDI' : 'VIEW'
  const backLabel = locale === 'it' ? '← Torna allo shop' : '← Back to shop'
  const emptyLabel = locale === 'it' ? 'Nessun prodotto in questa sezione.' : 'No products in this section.'

  if (loading) return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#c1a99a' }}>LOADING...</p>
    </main>
  )

  if (!sezione) return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#5d4d42', margin: '0 0 1.5rem' }}>Sezione non trovata.</p>
        <Link href={`/${locale}/prodotti`} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', color: '#3a2e2b', textDecoration: 'none', borderBottom: '1px solid #3a2e2b', paddingBottom: '2px' }}>{backLabel}</Link>
      </div>
    </main>
  )

  const prodotti = sezione.sezioni_prodotti.map(sp => sp.prodotti)

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>

        <Link href={`/${locale}/prodotti`} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', color: '#c1a99a', textDecoration: 'none', display: 'inline-block', marginBottom: '2.5rem' }}
          onMouseEnter={e => e.currentTarget.style.color = '#3a2e2b'}
          onMouseLeave={e => e.currentTarget.style.color = '#c1a99a'}>
          {backLabel}
        </Link>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.75rem' }}>— {sezione.nome.toUpperCase()} —</p>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 3rem', letterSpacing: '0.04em' }}>
          {sezione.nome}
        </h1>

        {prodotti.length === 0 ? (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#5d4d42' }}>{emptyLabel}</p>
        ) : (
          <div className="sez-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {prodotti.map((p, i) => <ProdCard key={p.id} p={p} i={i} locale={locale} viewLabel={viewLabel} />)}
          </div>
        )}
      </div>
      <style>{`@media(max-width:767px){.sez-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </main>
  )
}

function ProdCard({ p, i, locale, viewLabel }: { p: Prodotto; i: number; locale: string; viewLabel: string }) {
  const [hovered, setHovered] = useState(false)
  const hasImg = p.immagini?.[0]
  return (
    <Link href={`/${locale}/prodotti/${p.slug}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: 'none', display: 'block', opacity: 1, animation: `fadeUp 0.5s ease ${i * 0.06}s both` }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ aspectRatio: '3/4', background: hasImg ? `url(${p.immagini[0]}) center/cover` : 'linear-gradient(135deg, #e8d2c3 0%, #c1a99a 100%)', borderRadius: '2px', marginBottom: '0.875rem', overflow: 'hidden', position: 'relative' }}>
        {!hasImg && <Image src="/monogram-brown.svg" alt="" width={32} height={32} style={{ position: 'absolute', top: '12px', left: '12px', width: '28px', height: '28px', opacity: 0.2, pointerEvents: 'none' }} />}
        {hasImg && <Image src="/monogram-beige.svg" alt="" width={32} height={32} style={{ position: 'absolute', top: '12px', left: '12px', width: '28px', height: '28px', opacity: 0.12, pointerEvents: 'none', zIndex: 2 }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(58,46,43,0.06)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }} />
        <div style={{ position: 'absolute', bottom: '0.875rem', left: '50%', transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(8px)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s, transform 0.3s', background: 'rgba(241,234,228,0.92)', backdropFilter: 'blur(8px)', borderRadius: '1px', padding: '0.45rem 1.1rem', whiteSpace: 'nowrap', zIndex: 3 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em', color: '#3a2e2b' }}>{viewLabel}</span>
        </div>
      </div>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#3a2e2b', margin: '0 0 0.2rem' }}>{p.nome}</p>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5d4d42', margin: 0 }}>€ {p.prezzo.toFixed(2)}</p>
    </Link>
  )
}
