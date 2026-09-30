'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

const DYN_COLORS = [
  { bg: '#3a2e2b', monogram: '/monogram-beige.svg', light: false },
  { bg: '#c1a99a', monogram: '/monogram-brown.svg', light: true },
  { bg: '#d4bfb0', monogram: '/monogram-brown.svg', light: true },
  { bg: '#e8d2c3', monogram: '/monogram-brown.svg', light: true },
]

interface CatItem { slug: string; nome: string; bg: string; monogram: string; light: boolean }

export default function Categories() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [items, setItems] = useState<CatItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const dragStart = useRef(0)
  const ref = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const locale = (pathname.startsWith('/it') ? 'it' : 'en') as 'en'|'it'
  const label = locale === 'it' ? 'Collezioni' : 'Collections'

  useEffect(() => {
    fetch('/api/sezioni')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) { setLoaded(true); return }
        const dynItems: CatItem[] = data.map((s: any, i: number) => ({
          slug: s.slug,
          nome: s.nome,
          ...DYN_COLORS[i % DYN_COLORS.length],
        }))
        setItems(dynItems)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [locale])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const N = items.length
  const prev = useCallback(() => setActive(a => ((a - 1) % N + N) % N), [N])
  const next = useCallback(() => setActive(a => (a + 1) % N), [N])

  function getPos(i: number) {
    let diff = ((i - active) % N + N) % N
    if (diff > N / 2) diff -= N
    return diff
  }

  function getStyle(i: number): React.CSSProperties {
    const pos = getPos(i)
    const absp = Math.abs(pos)
    if (absp === 0) return { transform: 'translateX(0) scale(1) rotateY(0deg)', zIndex: 20, opacity: 1, filter: 'none', boxShadow: '0 20px 60px rgba(58,46,43,0.2)' }
    if (absp === 1) return { transform: `translateX(${pos * 265}px) scale(0.78) rotateY(${pos * -38}deg)`, zIndex: 10, opacity: 0.7, filter: 'blur(0.5px)', boxShadow: 'none' }
    if (absp === 2) return { transform: `translateX(${pos * 310}px) scale(0.58) rotateY(${pos * -52}deg)`, zIndex: 5, opacity: 0.35, filter: 'blur(1.5px)', boxShadow: 'none' }
    if (absp === 3) return { transform: `translateX(${pos * 340}px) scale(0.42) rotateY(${pos * -60}deg)`, zIndex: 2, opacity: 0.12, filter: 'blur(3px)', boxShadow: 'none' }
    return { opacity: 0, zIndex: 1 }
  }

  // Niente sezioni attive: non mostrare la carousel (evita link rotti / placeholder)
  if (loaded && items.length === 0) return null

  return (
    <section ref={ref} style={{ padding: '5rem 0 4rem', background: '#f1eae4', overflow: 'hidden' }}>
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 2vw, 2rem)', fontWeight: 300, color: '#3a2e2b', textAlign: 'center', marginBottom: '2.5rem', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        {label}
      </h2>

      <div
        style={{ position: 'relative', height: '460px', perspective: '1000px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s' }}
        onMouseDown={e => { setDragging(true); dragStart.current = e.clientX }}
        onMouseUp={e => { setDragging(false); const d = e.clientX - dragStart.current; if (Math.abs(d) > 40) d < 0 ? next() : prev() }}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={e => { dragStart.current = e.touches[0].clientX }}
        onTouchEnd={e => { const d = e.changedTouches[0].clientX - dragStart.current; if (Math.abs(d) > 40) d < 0 ? next() : prev() }}>

        {items.map((cat, i) => {
          const isActive = i === active
          return (
            <Link key={cat.slug} href={`/${locale}/prodotti?cat=${cat.slug}`}
              onClick={e => { if (!isActive) { e.preventDefault(); setActive(i) } }}
              style={{ position: 'absolute', width: '280px', height: '380px', background: cat.bg, borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '1.25rem', textDecoration: 'none', transformStyle: 'preserve-3d', transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.55s ease, filter 0.55s ease, box-shadow 0.55s ease', overflow: 'hidden', ...getStyle(i) }}>
              <Image src={cat.monogram} alt="" width={48} height={48} style={{ position: 'absolute', top: '14px', left: '14px', width: '40px', height: '40px', opacity: 0.22, pointerEvents: 'none' }} />
              <Image src={cat.monogram} alt="" width={120} height={120} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120px', height: '120px', opacity: isActive ? 0.08 : 0.05, pointerEvents: 'none', transition: 'opacity 0.3s' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', fontWeight: 500, color: cat.light ? '#3a2e2b' : '#f1eae4', position: 'relative', zIndex: 1 }}>
                {cat.nome.toUpperCase()}
              </span>
            </Link>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
        <button onClick={prev} style={{ background: 'none', border: '1px solid rgba(193,169,154,0.4)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3a2e2b', transition: 'border-color 0.2s, color 0.2s', fontSize: '14px' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#c1a99a'; e.currentTarget.style.color = '#c1a99a' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(193,169,154,0.4)'; e.currentTarget.style.color = '#3a2e2b' }}>←</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          {items.map((_, i) => <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? '20px' : '6px', height: '6px', borderRadius: '3px', border: 'none', cursor: 'pointer', padding: 0, background: i === active ? '#3a2e2b' : 'rgba(193,169,154,0.35)', transition: 'all 0.3s ease' }} />)}
        </div>
        <button onClick={next} style={{ background: 'none', border: '1px solid rgba(193,169,154,0.4)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3a2e2b', transition: 'border-color 0.2s, color 0.2s', fontSize: '14px' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#c1a99a'; e.currentTarget.style.color = '#c1a99a' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(193,169,154,0.4)'; e.currentTarget.style.color = '#3a2e2b' }}>→</button>
      </div>
    </section>
  )
}
