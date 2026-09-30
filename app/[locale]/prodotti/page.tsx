'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import WishlistButton from '@/components/WishlistButton'
import { useSearchParams, usePathname } from 'next/navigation'

interface Sezione { id: string; nome: string; slug: string }
interface Prodotto { id: string; nome: string; prezzo: number; immagini: string[]; slug: string; sezione_id: string | null; sezioni: Sezione | null }
type Tab = { label: string; value: string }

export default function ProdottiPage() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'

  const [prodotti, setProdotti] = useState<Prodotto[]>([])
  const [tabs, setTabs] = useState<Tab[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') || '')

  const allLabel = locale === 'it' ? 'Tutte le Collezioni' : 'All Collections'
  const allTabLabel = locale === 'it' ? 'Tutti' : 'All'
  const noProducts = locale === 'it' ? 'Nessun prodotto in questa categoria.' : 'No products found.'

  useEffect(() => { setActiveCat(searchParams.get('cat') || '') }, [searchParams])

  useEffect(() => {
    Promise.all([
      fetch('/api/prodotti').then(r => r.json()),
      fetch('/api/sezioni').then(r => r.json()),
    ]).then(([prodData, sezData]) => {
      setProdotti(Array.isArray(prodData) ? prodData : [])

      const dynTabs: Tab[] = Array.isArray(sezData)
        ? sezData.map((s: any) => ({ label: s.nome, value: s.slug }))
        : []
      setTabs([{ label: allTabLabel, value: '' }, ...dynTabs])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [locale])

  const activeTab = tabs.find(t => t.value === activeCat)

  const filtered = !activeCat
    ? prodotti
    : prodotti.filter(p => p.sezioni?.slug === activeCat)

  const activeLabel = activeCat ? (activeTab?.label || allLabel) : allLabel

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ padding: '4rem 1.5rem 2rem', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: '#3a2e2b', margin: 0, letterSpacing: '0.04em' }}>{activeLabel}</h1>
      </div>

      <div style={{ padding: '0 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {tabs.length > 1 && (
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto', borderBottom: '1px solid rgba(193,169,154,0.3)', scrollbarWidth: 'none', marginBottom: '3rem' }}>
            {tabs.map(tab => (
              <button key={tab.value} onClick={() => setActiveCat(tab.value)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0.85rem 1.25rem',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em',
                color: activeCat === tab.value ? '#3a2e2b' : '#c1a99a',
                borderBottom: activeCat === tab.value ? '1px solid #3a2e2b' : '1px solid transparent',
                marginBottom: '-1px', whiteSpace: 'nowrap',
                transition: 'color 0.2s, border-color 0.2s',
                fontWeight: activeCat === tab.value ? 500 : 400,
              }}>
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {!loading && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#c1a99a', letterSpacing: '0.1em', marginBottom: '2rem' }}>
            {filtered.length} {locale === 'it' ? 'prodotti' : 'products'}
          </p>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#c1a99a', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.16em' }}>LOADING...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#5d4d42' }}>{noProducts}</p>
          </div>
        ) : (
          <div className="prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', paddingBottom: '5rem' }}>
            {filtered.map((p, i) => <ProductCard key={p.id} prodotto={p} i={i} locale={locale} />)}
          </div>
        )}
      </div>

      <style>{`div::-webkit-scrollbar{display:none}@media(max-width:767px){.prod-grid{grid-template-columns:repeat(2,1fr)!important}}@media(min-width:768px) and (max-width:1023px){.prod-grid{grid-template-columns:repeat(3,1fr)!important}}`}</style>
    </main>
  )
}

function ProductCard({ prodotto, i, locale }: { prodotto: Prodotto; i: number; locale: string }) {
  const [hovered, setHovered] = useState(false)
  const hasImg = prodotto.immagini?.[0]
  const viewLabel = locale === 'it' ? 'VEDI' : 'VIEW'
  return (
    <Link href={`/${locale}/prodotti/${prodotto.slug}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: 'none', display: 'block', opacity: 1, animation: `fadeUp 0.5s ease ${i * 0.06}s both` }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ aspectRatio: '3/4', background: hasImg ? `url(${prodotto.immagini[0]}) center/cover` : 'linear-gradient(135deg, #e8d2c3 0%, #c1a99a 100%)', borderRadius: '2px', marginBottom: '0.875rem', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 3 }} onClick={e => e.preventDefault()}>
          <WishlistButton prodottoId={prodotto.id} size={16} />
        </div>
        {!hasImg && <>
          <Image src="/monogram-brown.svg" alt="" width={40} height={40} style={{ position: 'absolute', top: '12px', left: '12px', width: '32px', height: '32px', opacity: 0.2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.16em', color: 'rgba(58,46,43,0.3)' }}>PHOTO</p>
          </div>
        </>}
        {hasImg && <Image src="/monogram-beige.svg" alt="" width={40} height={40} style={{ position: 'absolute', top: '12px', left: '12px', width: '32px', height: '32px', opacity: 0.12, pointerEvents: 'none', zIndex: 2 }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(58,46,43,0.06)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }} />
        <div style={{ position: 'absolute', bottom: '0.875rem', left: '50%', transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(8px)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s, transform 0.3s', background: 'rgba(241,234,228,0.92)', backdropFilter: 'blur(8px)', borderRadius: '1px', padding: '0.45rem 1.1rem', whiteSpace: 'nowrap', zIndex: 3 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em', color: '#3a2e2b' }}>{viewLabel}</span>
        </div>
      </div>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#3a2e2b', margin: '0 0 0.2rem' }}>{prodotto.nome}</p>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5d4d42', margin: 0 }}>€ {prodotto.prezzo.toFixed(2)}</p>
    </Link>
  )
}
