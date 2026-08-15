'use client'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface Prodotto { id: string; nome: string; prezzo: number; immagini: string[]; slug: string }

export default function BestSellers() {
  const [prodotti, setProdotti] = useState<Prodotto[]>([])
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'
  const viewAll = locale === 'it' ? 'VEDI TUTTI' : 'VIEW ALL'
  const shopNow = locale === 'it' ? 'ACQUISTA' : 'SHOP NOW'

  useEffect(() => {
    fetch('/api/prodotti').then(r => r.json()).then(data => setProdotti(data.slice(0, 4))).catch(() => {})
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const items = prodotti.length > 0 ? prodotti : [
    { id: '1', nome: locale === 'it' ? 'Blazer Strutturato' : 'Blazer Structured', prezzo: 280, immagini: [], slug: 'blazer-structured' },
    { id: '2', nome: 'Twilli', prezzo: 195, immagini: [], slug: 'twilli' },
    { id: '3', nome: locale === 'it' ? 'Camicia Classic' : 'Classic Shirt', prezzo: 145, immagini: [], slug: 'classic-shirt' },
    { id: '4', nome: locale === 'it' ? 'Pantaloni Sartoriali' : 'Tailored Pants', prezzo: 165, immagini: [], slug: 'tailored-pants' },
  ]

  return (
    <section ref={ref} style={{ background: '#f1eae4', padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.5rem', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}>— SHOP —</p>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 300, color: '#3a2e2b', margin: 0, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s' }}>Best Sellers</h2>
          </div>
          <Link href={`/${locale}/prodotti`} style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.16em', color: '#3a2e2b', textDecoration: 'none', borderBottom: '1px solid #3a2e2b', paddingBottom: '2px', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#c1a99a'; e.currentTarget.style.borderColor = '#c1a99a' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#3a2e2b'; e.currentTarget.style.borderColor = '#3a2e2b' }}>
            {viewAll}
          </Link>
        </div>
        <div className="bs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {items.map((p, i) => <ProductCard key={p.id} prodotto={p} i={i} visible={visible} shopNow={shopNow} locale={locale} />)}
        </div>
      </div>
      <style>{`@media(max-width:767px){.bs-grid{grid-template-columns:repeat(2,1fr)!important;gap:0.75rem!important}}`}</style>
    </section>
  )
}

function ProductCard({ prodotto, i, visible, shopNow, locale }: any) {
  const [hovered, setHovered] = useState(false)
  const hasImage = prodotto.immagini?.[0]
  return (
    <Link href={`/${locale}/prodotti/${prodotto.slug}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: 'none', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.7s ease ${i*0.1}s, transform 0.7s ease ${i*0.1}s`, display: 'block' }}>
      <div style={{ aspectRatio: '3/4', background: hasImage ? `url(${prodotto.immagini[0]}) center/cover` : 'linear-gradient(135deg, #e8d2c3 0%, #c1a99a 100%)', borderRadius: '2px', marginBottom: '1rem', overflow: 'hidden', position: 'relative' }}>
        {/* Monogram su placeholder */}
        {!hasImage && (
          <Image src="/monogram-brown.svg" alt="" width={40} height={40}
            style={{ position: 'absolute', top: '12px', left: '12px', width: '32px', height: '32px', opacity: 0.2, pointerEvents: 'none' }} />
        )}
        {/* Monogram su foto reale con opacità bassissima */}
        {hasImage && (
          <Image src="/monogram-beige.svg" alt="" width={40} height={40}
            style={{ position: 'absolute', top: '12px', left: '12px', width: '32px', height: '32px', opacity: 0.15, pointerEvents: 'none', zIndex: 2 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(58,46,43,0.06)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }} />
        <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(8px)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s, transform 0.3s', background: 'rgba(241,234,228,0.92)', backdropFilter: 'blur(8px)', borderRadius: '1px', padding: '0.45rem 1.1rem', whiteSpace: 'nowrap', zIndex: 3 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em', color: '#3a2e2b' }}>{shopNow}</span>
        </div>
      </div>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#3a2e2b', margin: '0 0 0.2rem' }}>{prodotto.nome}</p>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5d4d42', margin: 0 }}>€ {prodotto.prezzo.toFixed(2)}</p>
    </Link>
  )
}
