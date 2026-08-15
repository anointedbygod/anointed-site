'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, usePathname } from 'next/navigation'

const CATS_FIXED_EN = [
  { label: 'All', value: '', type: 'all' },
  { label: 'Twilli', value: 'twilli', type: 'cat' },
  { label: 'Blazer', value: 'blazer', type: 'cat' },
  { label: 'Pochette', value: 'pochette', type: 'cat' },
  { label: 'T-Shirt', value: 'tshirt', type: 'cat' },
  { label: 'Shirts', value: 'camicie', type: 'cat' },
  { label: 'Trousers', value: 'pantaloni', type: 'cat' },
  { label: 'Best Sellers', value: 'bestseller', type: 'cat' },
]

const CATS_FIXED_IT = [
  { label: 'Tutti', value: '', type: 'all' },
  { label: 'Twilli', value: 'twilli', type: 'cat' },
  { label: 'Blazer', value: 'blazer', type: 'cat' },
  { label: 'Pochette', value: 'pochette', type: 'cat' },
  { label: 'T-Shirt', value: 'tshirt', type: 'cat' },
  { label: 'Camicie', value: 'camicie', type: 'cat' },
  { label: 'Pantaloni', value: 'pantaloni', type: 'cat' },
  { label: 'Best Sellers', value: 'bestseller', type: 'cat' },
]

const SLUG_TO_CAT: Record<string, string[]> = {
  twilli:    ['twilli'],
  blazer:    ['blazer'],
  pochette:  ['pochette'],
  tshirt:    ['t-shirt', 'tshirt', 't shirt'],
  camicie:   ['camicie', 'shirts', 'camicia'],
  pantaloni: ['pantaloni', 'trousers', 'pantalone'],
  bestseller: [],
}

function matchCategoria(categoriaDB: string, slug: string): boolean {
  if (!categoriaDB) return false
  if (slug === 'bestseller') return true
  const valori = SLUG_TO_CAT[slug] || [slug]
  return valori.some(v => categoriaDB.toLowerCase() === v.toLowerCase())
}

interface Prodotto { id: string; nome: string; prezzo: number; immagini: string[]; slug: string; categoria: string }
interface SezioneTab { label: string; value: string; type: 'sez'; slug: string; prodottiIds: string[] }
type Tab = { label: string; value: string; type: string } | SezioneTab

export default function ProdottiPage() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'

  const [prodotti, setProdotti] = useState<Prodotto[]>([])
  const [tabs, setTabs] = useState<Tab[]>(locale === 'it' ? CATS_FIXED_IT : CATS_FIXED_EN)
  const [loading, setLoading] = useState(true)
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') || '')

  const allLabel = locale === 'it' ? 'Tutte le Collezioni' : 'All Collections'
  const noProducts = locale === 'it' ? 'Nessun prodotto in questa categoria.' : 'No products found.'

  useEffect(() => { setActiveCat(searchParams.get('cat') || '') }, [searchParams])

  useEffect(() => {
    Promise.all([
      fetch('/api/prodotti').then(r => r.json()),
      fetch('/api/sezioni').then(r => r.json()),
    ]).then(([prodData, sezData]) => {
      setProdotti(Array.isArray(prodData) ? prodData : [])

      const fixed = locale === 'it' ? CATS_FIXED_IT : CATS_FIXED_EN
      if (Array.isArray(sezData)) {
        const fixedSlugs = CATS_FIXED_EN.map(c => c.value)
        const dynTabs: SezioneTab[] = sezData
          .filter((s: any) => !fixedSlugs.includes(s.slug) && s.sezioni_prodotti?.length > 0)
          .map((s: any) => ({
            label: s.nome,
            value: `sez:${s.slug}`,
            type: 'sez',
            slug: s.slug,
            prodottiIds: s.sezioni_prodotti.map((sp: any) => sp.prodotto_id || sp.prodotti?.id),
          }))
        setTabs([...fixed, ...dynTabs])
      } else {
        setTabs(fixed)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [locale])

  const activeTab = tabs.find(t => t.value === activeCat)

  const filtered = (() => {
    if (!activeCat) return prodotti
    if (activeTab && (activeTab as SezioneTab).type === 'sez') {
      const ids = (activeTab as SezioneTab).prodottiIds
      return prodotti.filter(p => ids.includes(p.id))
    }
    return prodotti.filter(p => matchCategoria(p.categoria, activeCat))
  })()

  const activeLabel = activeTab?.label || allLabel

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ padding: '4rem 1.5rem 2rem', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.75rem' }}>— SHOP —</p>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: '#3a2e2b', margin: 0, letterSpacing: '0.04em' }}>{activeLabel}</h1>
      </div>

      <div style={{ padding: '0 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
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
