'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

const TR = {
  en: { label: 'Our Story', headline: "Anointed is not just a brand.", sub: "It is a reminder.", body: "Inspired by the biblical meaning of being anointed — chosen and set apart — the brand celebrates the inner power of women today.", cta: "Read our story", webelieve: "We believe in", pillars: [{ num: '01', title: 'Purpose', body: 'Every woman carries a unique calling. Our designs remind her of her direction, strength and identity.' }, { num: '02', title: 'Strength', body: 'Our garments reflect the quiet power and grace that already lives within every woman.' }, { num: '03', title: 'Meaning', body: 'Clothing can be more than fashion. A reminder of identity, dignity and purpose.' }] },
  it: { label: 'La Nostra Storia', headline: "Anointed non è solo un brand.", sub: "È un promemoria.", body: "Ispirato al significato biblico dell'essere unti — scelti e messi da parte — il brand celebra il potere interiore delle donne di oggi.", cta: "Leggi la nostra storia", webelieve: "In cosa crediamo", pillars: [{ num: '01', title: 'Scopo', body: 'Ogni donna porta una chiamata unica. I nostri design ricordano la sua direzione, forza e identità.' }, { num: '02', title: 'Forza', body: 'I nostri capi riflettono il potere silenzioso e la grazia che già vive in ogni donna.' }, { num: '03', title: 'Significato', body: "L'abbigliamento può essere più della moda. Un promemoria di identità, dignità e scopo." }] },
}

export default function BrandStory() {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(0)
  const ref = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'
  const t = TR[locale as 'en'|'it']
  const total = t.pillars.length

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const prev = useCallback(() => setActive(a => (a - 1 + total) % total), [total])
  const next = useCallback(() => setActive(a => (a + 1) % total), [total])

  function getStyle(i: number): React.CSSProperties {
    const diff = ((i - active + total) % total + total) % total
    const pos = diff <= total / 2 ? diff : diff - total
    if (pos === 0) return { transform: 'translateX(0) scale(1) rotateY(0deg)', zIndex: 10, opacity: 1, filter: 'none' }
    if (pos === 1 || pos === -1) return { transform: `translateX(${pos * 72}%) scale(0.82) rotateY(${pos * -28}deg)`, zIndex: 5, opacity: 0.55, filter: 'blur(1px)' }
    return { transform: `translateX(${pos * 68}%) scale(0.65) rotateY(${pos * -42}deg)`, zIndex: 2, opacity: 0.2, filter: 'blur(2px)' }
  }

  return (
    <section ref={ref} style={{ background: '#f1eae4' }}>
      <div style={{ padding: '6rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', marginBottom: '5rem' }}>
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', marginBottom: '1.5rem' }}>— {t.label.toUpperCase()} —</p>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, lineHeight: 1.2, color: '#3a2e2b', margin: '0 0 1rem' }}>{t.headline}</h2>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.2, color: '#5d4d42', margin: '0 0 2rem' }}>{t.sub}</h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.8, color: '#5d4d42', margin: '0 0 2.5rem', maxWidth: '420px' }}>{t.body}</p>
            <Link href={`/${locale}/storia`}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', color: '#3a2e2b', textDecoration: 'none', borderBottom: '1px solid #3a2e2b', paddingBottom: '2px', transition: 'color 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#c1a99a'; e.currentTarget.style.borderColor = '#c1a99a' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#3a2e2b'; e.currentTarget.style.borderColor = '#3a2e2b' }}>
              {t.cta.toUpperCase()}
            </Link>
          </div>

          {/* Placeholder Our Story con monogram beige — sfondo medio-scuro */}
          <div style={{ height: '560px', background: 'linear-gradient(135deg, #c1a99a 0%, #5d4d42 100%)', borderRadius: '2px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/monogram-beige.svg" alt="" width={80} height={80}
              style={{ position: 'absolute', top: '16px', left: '16px', width: '48px', height: '48px', opacity: 0.2, pointerEvents: 'none' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(241,234,228,0.4)' }}>EDITORIAL PHOTO</p>
          </div>
        </div>
      </div>

      {/* Pillars carousel — sfondo beige */}
      <div style={{ background: '#f1eae4', borderTop: '1px solid rgba(193,169,154,0.25)', padding: '5rem 0 4rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', textAlign: 'center', marginBottom: '3.5rem', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }}>
          — {t.webelieve.toUpperCase()} —
        </p>
        <div
          style={{ perspective: '1200px', position: 'relative', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none', cursor: dragging ? 'grabbing' : 'grab', overflow: 'hidden' }}
          onMouseDown={e => { setDragging(true); dragStart.current = e.clientX }}
          onMouseUp={e => { if (!dragging) return; setDragging(false); const d = e.clientX - dragStart.current; if (d < -40) next(); else if (d > 40) prev() }}
          onMouseLeave={() => setDragging(false)}
          onTouchStart={e => { dragStart.current = e.touches[0].clientX }}
          onTouchEnd={e => { const d = e.changedTouches[0].clientX - dragStart.current; if (d < -40) next(); else if (d > 40) prev() }}>
          {t.pillars.map((p, i) => {
            const isActive = i === active
            return (
              <div key={i} onClick={() => { if (!isActive) setActive(i) }}
                style={{
                  position: 'absolute', width: '340px', maxWidth: '85vw',
                  background: isActive ? 'rgba(58,46,43,0.07)' : 'rgba(58,46,43,0.03)',
                  backdropFilter: 'blur(8px)',
                  border: isActive ? '1px solid rgba(193,169,154,0.45)' : '1px solid rgba(193,169,154,0.15)',
                  borderRadius: '4px', padding: '2rem',
                  transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.55s ease, filter 0.55s ease',
                  transformStyle: 'preserve-3d', backfaceVisibility: 'hidden',
                  display: 'flex', flexDirection: 'column', gap: '1.25rem',
                  ...getStyle(i),
                }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.22em', color: isActive ? '#c1a99a' : 'rgba(193,169,154,0.5)', margin: 0, transition: 'color 0.3s' }}>{p.num}</p>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, letterSpacing: '0.14em', color: '#3a2e2b', margin: 0 }}>{p.title.toUpperCase()}</h3>
                <div style={{ height: '1px', width: isActive ? '40px' : '20px', background: isActive ? '#c1a99a' : 'rgba(193,169,154,0.3)', transition: 'width 0.4s ease, background 0.3s' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.75, color: '#5d4d42', margin: 0 }}>{p.body}</p>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
          <button onClick={prev} style={{ background: 'none', border: '1px solid rgba(193,169,154,0.4)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3a2e2b', transition: 'border-color 0.2s, color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c1a99a'; e.currentTarget.style.color = '#c1a99a' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(193,169,154,0.4)'; e.currentTarget.style.color = '#3a2e2b' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            {t.pillars.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? '20px' : '6px', height: '6px', borderRadius: '3px', border: 'none', cursor: 'pointer', padding: 0, background: i === active ? '#3a2e2b' : 'rgba(193,169,154,0.3)', transition: 'width 0.3s ease, background 0.3s ease' }} />
            ))}
          </div>
          <button onClick={next} style={{ background: 'none', border: '1px solid rgba(193,169,154,0.4)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3a2e2b', transition: 'border-color 0.2s, color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c1a99a'; e.currentTarget.style.color = '#c1a99a' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(193,169,154,0.4)'; e.currentTarget.style.color = '#3a2e2b' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .story-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .story-grid > div:last-child { height: 300px !important; }
        }
      `}</style>
    </section>
  )
}
