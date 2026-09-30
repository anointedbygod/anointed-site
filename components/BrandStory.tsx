'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

const TR = {
  en: { label: 'About Us', headline: "Anointed is not just a brand.", sub: "It is a reminder.", body: "A reminder that a woman's identity is not defined by the world but by her calling.", cta: "Read our story", webelieve: "We believe in", pillars: [{ num: '01', title: 'Identity', body: 'Who you are comes before what you wear. ANOINTED is created to remind every woman of the value, individuality and strength she already carries.' }, { num: '02', title: 'Becoming', body: 'We believe in continuous growth — in becoming more confident, more conscious and more aligned with the woman you are called to be.' }, { num: '03', title: 'Legacy', body: 'What we choose today can leave something beyond us. We believe in creating with intention, meaning and a vision that lasts.' }] },
  it: { label: 'Chi Siamo', headline: "Anointed non è solo un brand.", sub: "È un promemoria.", body: "Un promemoria che l'identità di una donna non è definita dal mondo, ma dalla sua chiamata.", cta: "Leggi la nostra storia", webelieve: "In cosa crediamo", pillars: [{ num: '01', title: 'Identità', body: 'Chi sei viene prima di cosa indossi. ANOINTED nasce per ricordare a ogni donna il valore, l\'unicità e la forza che già porta con sé.' }, { num: '02', title: 'Divenire', body: 'Crediamo nella crescita continua — nel diventare più sicure, più consapevoli e più allineate alla donna che siete chiamate a essere.' }, { num: '03', title: 'Eredità', body: 'Ciò che scegliamo oggi può lasciare qualcosa oltre noi stesse. Crediamo nel creare con intenzione, significato e una visione che dura nel tempo.' }] },
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
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, lineHeight: 1.2, color: '#3a2e2b', margin: 0 }}>{t.headline}</h2>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.2, color: '#5d4d42', margin: '0 0 2rem' }}>{t.sub}</h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.8, color: '#5d4d42', margin: '0 0 2.5rem', maxWidth: '420px' }}>{t.body}</p>
            <Link href={`/${locale}/storia`}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', color: '#3a2e2b', textDecoration: 'none', borderBottom: '1px solid #3a2e2b', paddingBottom: '2px', transition: 'color 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#c1a99a'; e.currentTarget.style.borderColor = '#c1a99a' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#3a2e2b'; e.currentTarget.style.borderColor = '#3a2e2b' }}>
              {t.cta.toUpperCase()}
            </Link>
          </div>

          {/* Foto editoriale About Us */}
          <div style={{ height: '560px', background: 'url(/images/about/brandstory-about.jpg) center/cover', borderRadius: '2px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/monogram-beige.svg" alt="" width={80} height={80}
              style={{ position: 'absolute', top: '16px', left: '16px', width: '48px', height: '48px', opacity: 0.55, pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {/* Pillars carousel — sfondo beige */}
      <div style={{ position: 'relative', background: '#f1eae4', borderTop: '1px solid rgba(193,169,154,0.25)', padding: '5.5rem 0 4.5rem', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '50%', width: '480px', height: '480px',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(193,169,154,0.22) 0%, rgba(193,169,154,0) 70%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        <h2 style={{ position: 'relative', fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 2vw, 2rem)', fontWeight: 300, color: '#3a2e2b', textAlign: 'center', marginBottom: '3.5rem', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }}>
          {t.webelieve}
        </h2>
        <div
          style={{ position: 'relative', perspective: '1400px', height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none', cursor: dragging ? 'grabbing' : 'grab' }}
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
                  position: 'absolute', width: '380px', maxWidth: '86vw', minHeight: '340px',
                  background: isActive
                    ? 'linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.22) 100%)'
                    : 'linear-gradient(160deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.1) 100%)',
                  backdropFilter: 'blur(20px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                  border: isActive ? '1px solid rgba(193,169,154,0.55)' : '1px solid rgba(193,169,154,0.2)',
                  borderRadius: '18px', padding: '3rem 2.5rem',
                  boxShadow: isActive
                    ? '0 30px 70px rgba(58,46,43,0.18), inset 0 1px 0 rgba(255,255,255,0.6)'
                    : '0 14px 40px rgba(58,46,43,0.08), inset 0 1px 0 rgba(255,255,255,0.35)',
                  transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.55s ease, filter 0.55s ease, box-shadow 0.55s ease, border-color 0.55s ease',
                  transformStyle: 'preserve-3d', backfaceVisibility: 'hidden',
                  display: 'flex', flexDirection: 'column', gap: '1.4rem',
                  cursor: isActive ? 'default' : 'pointer',
                  ...getStyle(i),
                }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  border: isActive ? '1px solid rgba(193,169,154,0.6)' : '1px solid rgba(193,169,154,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'border-color 0.4s',
                }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.1em', color: isActive ? '#3a2e2b' : 'rgba(58,46,43,0.4)', margin: 0, transition: 'color 0.3s' }}>{p.num}</p>
                </div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 300, letterSpacing: '0.04em', color: '#3a2e2b', margin: 0 }}>{p.title}</h3>
                <div style={{ height: '1px', width: isActive ? '48px' : '24px', background: 'linear-gradient(90deg, #c1a99a, transparent)', transition: 'width 0.4s ease' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13.5px', lineHeight: 1.85, color: '#5d4d42', margin: 0 }}>{p.body}</p>
              </div>
            )
          })}
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginTop: '2.5rem' }}>
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
