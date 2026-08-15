'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Prodotto { id: string; nome: string; slug: string; prezzo: number; immagini: string[] }
interface Sezione { id: string; nome: string; slug: string; sezioni_prodotti: { prodotti: Prodotto }[] }

export default function SezioniDinamiche() {
  const [sezioni, setSezioni] = useState<Sezione[]>([])
  const [loaded, setLoaded] = useState(false)
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'

  useEffect(() => {
    fetch('/api/sezioni')
      .then(r => r.json())
      .then(data => {
        console.log('SEZIONI:', data)
        if (Array.isArray(data)) {
          setSezioni(data.filter(s => s.sezioni_prodotti?.length > 0))
        }
        setLoaded(true)
      })
      .catch(err => { console.error('SEZIONI ERROR:', err); setLoaded(true) })
  }, [])

  console.log('RENDER sezioni:', sezioni.length, 'loaded:', loaded)

  if (!loaded) return null
  if (sezioni.length === 0) return <div style={{padding:'2rem',color:'red'}}>Nessuna sezione con prodotti</div>

  const viewAll = locale === 'it' ? 'VEDI TUTTI' : 'VIEW ALL'
  const shopNow = locale === 'it' ? 'ACQUISTA' : 'SHOP NOW'

  return (
    <>
      {sezioni.map(sezione => (
        <SezioneSection key={sezione.id} sezione={sezione} locale={locale} viewAll={viewAll} shopNow={shopNow} />
      ))}
    </>
  )
}

function SezioneSection({ sezione, locale, viewAll, shopNow }: { sezione: Sezione; locale: string; viewAll: string; shopNow: string }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const prodotti = sezione.sezioni_prodotti.map(sp => sp.prodotti).slice(0, 4)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} style={{ background: '#f1eae4', padding: '6rem 1.5rem', borderTop: '1px solid rgba(193,169,154,0.2)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.5rem' }}>
              — {sezione.nome.toUpperCase()} —
            </p>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 300, color: '#3a2e2b', margin: 0 }}>
              {sezione.nome}
            </h2>
          </div>
          <Link href={`/${locale}/sezioni/${sezione.slug}`} style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.16em', color: '#3a2e2b', textDecoration: 'none', borderBottom: '1px solid #3a2e2b', paddingBottom: '2px' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#c1a99a'; e.currentTarget.style.borderColor = '#c1a99a' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#3a2e2b'; e.currentTarget.style.borderColor = '#3a2e2b' }}>
            {viewAll}
          </Link>
        </div>
        <div className="sez-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {prodotti.map((p, i) => <ProdCard key={p.id} p={p} i={i} visible={visible} shopNow={shopNow} locale={locale} />)}
        </div>
      </div>
      <style>{`@media(max-width:767px){.sez-grid{grid-template-columns:repeat(2,1fr)!important;gap:0.75rem!important}}`}</style>
    </section>
  )
}

function ProdCard({ p, i, visible, shopNow, locale }: any) {
  const [hovered, setHovered] = useState(false)
  const hasImg = p.immagini?.[0]
  return (
    <Link href={`/${locale}/prodotti/${p.slug}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: 'none', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.7s ease ${i*0.1}s, transform 0.7s ease ${i*0.1}s`, display: 'block' }}>
      <div style={{ aspectRatio: '3/4', background: hasImg ? `url(${p.immagini[0]}) center/cover` : 'linear-gradient(135deg, #e8d2c3 0%, #c1a99a 100%)', borderRadius: '2px', marginBottom: '1rem', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(58,46,43,0.06)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }} />
        <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(8px)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s, transform 0.3s', background: 'rgba(241,234,228,0.92)', backdropFilter: 'blur(8px)', borderRadius: '1px', padding: '0.45rem 1.1rem', whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em', color: '#3a2e2b' }}>{shopNow}</span>
        </div>
      </div>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#3a2e2b', margin: '0 0 0.2rem' }}>{p.nome}</p>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5d4d42', margin: 0 }}>€ {p.prezzo.toFixed(2)}</p>
    </Link>
  )
}
