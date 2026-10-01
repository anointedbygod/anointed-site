'use client'
import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Globe from './Globe'

interface EventPreview {
  date: string
  location: string
  title: string
  teaser: string
}

const TR = {
  en: {
    title: 'Anointed World',
    subtitle: 'Where the brand comes to life — next on the calendar.',
    more: 'More…',
    events: [
      { date: '10 October 2026', location: 'Rome, Italy', title: 'Connection Business', teaser: 'Sofia Meneghetti joins entrepreneurs and founders for a day built around meaningful connections.' },
      { date: '21 November 2026', location: 'Tuscany, Italy', title: 'EquipHer Italia — Casa Ruffino', teaser: 'A day for women, leadership and purpose — where the first idea of Anointed was born.' },
    ] as EventPreview[],
    nlTitle: 'Join the women who walk with purpose.',
    nlSub: 'New arrivals, stories and exclusive access.',
    nlPlaceholder: 'your@email.com',
    nlCta: 'Subscribe',
    nlThanks: 'Welcome to the circle.',
  },
  it: {
    title: 'Anointed World',
    subtitle: 'Dove il brand prende vita — il prossimo appuntamento.',
    more: 'Scopri di più…',
    events: [
      { date: '10 ottobre 2026', location: 'Roma, Italia', title: 'Connection Business', teaser: 'Sofia Meneghetti incontra imprenditori e fondatori per una giornata dedicata alle connessioni autentiche.' },
      { date: '21 novembre 2026', location: 'Toscana, Italia', title: 'EquipHer Italia — Casa Ruffino', teaser: "Una giornata dedicata a donne, leadership e scopo — dove è nata la prima idea di Anointed." },
    ] as EventPreview[],
    nlTitle: 'Unisciti alle donne che camminano con scopo.',
    nlSub: 'Nuovi arrivi, storie e accesso esclusivo.',
    nlPlaceholder: 'La tua email',
    nlCta: 'Iscriviti',
    nlThanks: 'Benvenuta nel cerchio.',
  },
}

function useVisible(threshold = 0.1) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

// Tracks the actual rendered font-size of the "W…rld" word (the h2's own
// clamp() value, resolved by the browser at the current viewport) and
// turns it straight into a pixel size for the globe icon — no CSS em/
// !important guesswork, no fixed breakpoints. Whatever size the browser
// decides the text is, the globe is measured from that exact number.
function useGlobeSize(wordRef: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState(40)

  useEffect(() => {
    const el = wordRef.current
    if (!el) return

    const measure = () => {
      const fontSize = parseFloat(getComputedStyle(el).fontSize)
      if (!fontSize) return
      // Ratio tuned against the bold "W"/"rld" cap-height so the circle
      // optically matches the letters around it rather than a guessed
      // em multiple.
      setSize(Math.round(fontSize * 0.72))
    }

    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [wordRef])

  return size
}

export default function AnointedWorldPreview() {
  const [sectionVisible, setSectionVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)
  const globeSize = useGlobeSize(wordRef)
  const pathname = usePathname()
  const locale = (pathname.startsWith('/it') ? 'it' : 'en') as 'en'|'it'
  const t = TR[locale]
  const events = t.events

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSectionVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} style={{ background: '#f1eae4' }}>
      <div style={{ position: 'relative', padding: '6rem 1.5rem 4.5rem', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '5%', left: '50%', width: '560px', height: '480px',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(193,169,154,0.22) 0%, rgba(193,169,154,0) 70%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />

        <h2 className="aw-title" style={{
          position: 'relative', fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', color: '#3a2e2b', textAlign: 'center',
          margin: '0 0 0.9rem', letterSpacing: '-0.01em', lineHeight: 1,
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>
          <span style={{ fontWeight: 300, fontStyle: 'italic', color: '#5d4d42' }}>Anointed</span>{' '}
          <span ref={wordRef} style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>
            W
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: `${globeSize}px`, height: `${globeSize}px`, margin: '0 0.08em',
            }}>
              <Globe size={globeSize} />
            </span>
            rld
          </span>
        </h2>
        <p style={{ position: 'relative', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#5d4d42', textAlign: 'center', margin: '0 0 3.5rem', opacity: sectionVisible ? 1 : 0, transition: 'opacity 0.8s ease 0.1s' }}>
          {t.subtitle}
        </p>

        <div className="aw-grid" style={{
          position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${events.length}, 1fr)`,
          gap: '2rem', maxWidth: '820px', margin: '0 auto',
        }}>
          {events.map((ev, i) => <EventCard key={i} ev={ev} delay={i * 0.12} />)}
        </div>

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <Link href={`/${locale}/anointed-world`} style={{
            fontFamily: 'Inter, sans-serif', fontSize: '10.5px', letterSpacing: '0.14em', fontWeight: 500,
            color: '#f1eae4', background: '#3a2e2b',
            textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: '100px',
            transition: 'background 0.25s, transform 0.25s', display: 'inline-block',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#5d4d42'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#3a2e2b'; e.currentTarget.style.transform = 'translateY(0)' }}>
            {t.more}
          </Link>
        </div>
      </div>

      <div style={{ margin: '0 1.5rem', height: '1px', background: 'rgba(193,169,154,0.25)' }} />

      <div style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 0.75rem' }}>{t.nlTitle}</h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#5d4d42', margin: '0 0 2.5rem' }}>{t.nlSub}</p>
        {sent ? (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.16em', color: '#c1a99a' }}>{t.nlThanks}</p>
        ) : (
          <form onSubmit={async e => { e.preventDefault(); if (!email) return; await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, tipo: "newsletter", locale }) }); setSent(true) }} style={{ display: 'flex', justifyContent: 'center', maxWidth: '440px', margin: '0 auto' }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.nlPlaceholder} required style={{ flex: 1, fontFamily: 'Inter, sans-serif', fontSize: '12px', background: 'rgba(58,46,43,0.05)', border: '1px solid rgba(193,169,154,0.4)', borderRight: 'none', color: '#3a2e2b', padding: '0.85rem 1.25rem', outline: 'none', borderRadius: '1px 0 0 1px' }} />
            <button type="submit" style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.16em', background: '#3a2e2b', border: '1px solid #3a2e2b', color: '#f1eae4', padding: '0.85rem 1.5rem', cursor: 'pointer', borderRadius: '0 1px 1px 0', whiteSpace: 'nowrap', fontWeight: 500 }} onMouseEnter={e => e.currentTarget.style.background = '#5d4d42'} onMouseLeave={e => e.currentTarget.style.background = '#3a2e2b'}>
              {t.nlCta}
            </button>
          </form>
        )}
      </div>

      <style>{`
        .aw-blink { animation: awBlink 2.6s ease-in-out infinite; }
        @keyframes awBlink {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
        @media (max-width: 767px) {
          .aw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function EventCard({ ev, delay }: { ev: EventPreview; delay: number }) {
  const { ref, visible } = useVisible()
  const [hover, setHover] = useState(false)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
          ? 'linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.22) 100%)'
          : 'linear-gradient(160deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.15) 100%)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: hover ? '1px solid rgba(193,169,154,0.55)' : '1px solid rgba(193,169,154,0.28)',
        borderRadius: '18px', padding: '2.5rem 2.25rem',
        boxShadow: hover
          ? '0 30px 70px rgba(58,46,43,0.18), inset 0 1px 0 rgba(255,255,255,0.6)'
          : '0 14px 40px rgba(58,46,43,0.08), inset 0 1px 0 rgba(255,255,255,0.35)',
        display: 'flex', flexDirection: 'column', gap: '1.1rem',
        opacity: visible ? 1 : 0,
        transform: visible ? (hover ? 'translateY(-4px)' : 'translateY(0)') : 'translateY(24px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, border-color 0.4s ease, background 0.4s ease`,
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'Inter, sans-serif', fontSize: '10.5px', letterSpacing: '0.1em', fontWeight: 500,
          color: '#3a2e2b', background: 'rgba(193,169,154,0.28)', border: '1px solid rgba(193,169,154,0.4)',
          padding: '0.35rem 0.8rem', borderRadius: '100px',
        }}>
          {ev.date}
        </span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#5d4d42' }}>{ev.location}</span>
      </div>
      <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.15rem', fontWeight: 300, color: '#3a2e2b', margin: 0 }}>{ev.title}</h3>
      <div style={{ height: '1px', width: hover ? '48px' : '24px', background: 'linear-gradient(90deg, #c1a99a, transparent)', transition: 'width 0.4s ease' }} />
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13.5px', lineHeight: 1.8, color: '#5d4d42', margin: 0 }}>{ev.teaser}</p>
    </div>
  )
}
