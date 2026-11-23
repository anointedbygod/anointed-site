'use client'

import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import PhotoCarousel, { type Foto } from '@/components/PhotoCarousel'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { dividiVoci, ETICHETTE_TIPO, type VoceWorld } from '@/lib/anointed-world'

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

interface EventItem {
  date: string
  location: string
  title: string
  body: string[]
  closing?: string
  image?: string
  imageAlt?: string
  caption?: string
  gallery?: Foto[]
  link?: string
  linkLabel?: string
  logo?: { src: string; alt: string }
  tipo?: string
}

// Unisce i testi nella lingua giusta con i campi comuni (foto, link, logo, tipo)
function voceToEvent(v: VoceWorld, locale: 'it' | 'en'): EventItem {
  return { ...v[locale], image: v.image, link: v.link, logo: v.logo, tipo: ETICHETTE_TIPO[locale][v.tipo] }
}

const CONTENT = {
  en: {
    heroTitle: ['Where the brand', 'comes to life.'],
    heroBody: 'Anointed is more than what we wear. It is a growing world of experiences, conversations, collaborations and meaningful encounters. From events and speaking engagements to selected partnerships and special projects, Anointed World brings the vision of the brand into real spaces — connecting women, ideas and opportunities.',
    upcoming: 'Upcoming',
    learnMore: 'Learn more',
    past: 'Events & collaborations',
  },
  it: {
    heroTitle: ['Dove il brand', 'prende vita.'],
    heroBody: 'Anointed è più di ciò che indossiamo. È un mondo in crescita fatto di esperienze, conversazioni, collaborazioni e incontri significativi. Da eventi e interventi pubblici a partnership selezionate e progetti speciali, Anointed World porta la visione del brand in spazi reali — connettendo donne, idee e opportunità.',
    upcoming: 'In programma',
    learnMore: 'Scopri di più',
    past: 'Eventi e collaborazioni',
  },
} as const

export default function AnointedWorldPage() {
  const pathname = usePathname()
  const locale = (pathname?.startsWith('/it') ? 'it' : 'en') as 'en' | 'it'
  const t = CONTENT[locale]
  const [voci, setVoci] = useState(() => dividiVoci())
  // eslint-disable-next-line react-hooks/set-state-in-effect -- ricalcola con la data del browser (la pagina e' generata al deploy)
  useEffect(() => { setVoci(dividiVoci()) }, [])
  const heroPhotoRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo(heroPhotoRef.current,
        { filter: 'grayscale(100%) brightness(0.72) contrast(1.05)' },
        {
          filter: 'grayscale(0%) brightness(1) contrast(1)',
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    }, heroSectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <main style={{ background: '#f1eae4' }}>

      {/* HERO */}
      <section ref={heroSectionRef} style={{
        minHeight: '85vh',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', textAlign: 'center', padding: '0 1.5rem',
        paddingTop: '64px',
      }}>
        <div ref={heroPhotoRef} style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: "url('/images/about/stage.jpg') center 10%/cover",
          animation: 'awKenBurns 26s ease-in-out infinite alternate',
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(180deg, rgba(20,14,12,0.7) 0%, rgba(20,14,12,0.35) 45%, rgba(20,14,12,0.75) 100%)',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '130px', zIndex: 1, pointerEvents: 'none',
          WebkitBackdropFilter: 'blur(14px)', backdropFilter: 'blur(14px)',
          WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 45%, transparent 100%)', maskImage: 'linear-gradient(180deg, #000 0%, #000 45%, transparent 100%)',
        }} />
        <style>{`
          @keyframes awKenBurns {
            0% { transform: scale(1); }
            100% { transform: scale(1.09); }
          }
        `}</style>
        <div style={{ position: 'relative', zIndex: 2, padding: '5rem 0' }}>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.6rem)', fontWeight: 300, color: '#f1eae4', lineHeight: 1.15, margin: '0 0 1.75rem', maxWidth: '700px' }}>
            {t.heroTitle[0]}<br /><em style={{ fontStyle: 'italic', color: '#c1a99a' }}>{t.heroTitle[1]}</em>
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.9, color: 'rgba(241,234,228,0.65)', maxWidth: '540px', margin: '0 auto' }}>
            {t.heroBody}
          </p>
        </div>
      </section>

      {/* BACHECA EVENTI */}
      <section style={{ position: 'relative', padding: '6rem 1.5rem 7rem', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '45%', height: '55%',
          background: 'radial-gradient(circle, rgba(193,169,154,0.35) 0%, rgba(193,169,154,0) 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-10%', width: '50%', height: '60%',
          background: 'radial-gradient(circle, rgba(216,192,175,0.4) 0%, rgba(216,192,175,0) 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: '820px', margin: '0 auto' }}>
          {voci.inProgramma.length > 0 && (<>
            <h2 style={{
              fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 2vw, 2rem)', fontWeight: 300,
              color: '#3a2e2b', textAlign: 'center', margin: '0 0 3.5rem',
            }}>
              {t.upcoming}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginBottom: '5rem' }}>
              {voci.inProgramma.map(v => <EventCard key={v.slug} ev={voceToEvent(v, locale)} learnMore={t.learnMore} />)}
            </div>
          </>)}
          <h2 style={{
            fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 2vw, 2rem)', fontWeight: 300,
            color: '#3a2e2b', textAlign: 'center', margin: '0 0 3.5rem',
          }}>
            {t.past}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {voci.passate.map(v => <EventCard key={v.slug} ev={voceToEvent(v, locale)} learnMore={t.learnMore} />)}
          </div>
        </div>
      </section>

    </main>
  )
}

function EventCard({ ev, learnMore }: { ev: EventItem; learnMore: string }) {
  const isIt = usePathname()?.startsWith('/it')
  const prevLabel = isIt ? 'Foto precedente' : 'Previous photo'
  const nextLabel = isIt ? 'Foto successiva' : 'Next photo'
  const { ref, visible } = useVisible()
  const [hover, setHover] = useState(false)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.38)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        border: `1px solid ${hover ? 'rgba(193,169,154,0.55)' : 'rgba(255,255,255,0.5)'}`,
        borderRadius: '20px',
        padding: 'clamp(2rem, 4vw, 3rem)',
        boxShadow: hover
          ? '0 24px 60px rgba(58,46,43,0.16), inset 0 1px 0 rgba(255,255,255,0.6)'
          : '0 12px 40px rgba(58,46,43,0.09), inset 0 1px 0 rgba(255,255,255,0.5)',
        opacity: visible ? 1 : 0,
        transform: visible ? (hover ? 'translateY(-4px)' : 'translateY(0)') : 'translateY(28px)',
        transition: 'opacity 0.8s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease, border-color 0.5s ease',
        overflow: 'hidden',
      }}
    >
      {/* subtle top sheen */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
      }} />
      <div style={{ display: 'flow-root' }}>
        {ev.gallery && (
          <figure className="aw-ev-fig" style={{ margin: '0 clamp(1.5rem, 3vw, 2.75rem) 1.25rem 0', float: 'left', width: 'min(40%, 340px)' }}>
            <PhotoCarousel foto={ev.gallery} prev={prevLabel} next={nextLabel} ratio="1282 / 1800" sizes="(max-width: 767px) 90vw, 340px" />
          </figure>
        )}
        {ev.image && (
          <figure className="aw-ev-fig" style={{ margin: '0 clamp(1.5rem, 3vw, 2.75rem) 1.25rem 0', float: 'left', width: 'min(40%, 340px)' }}>
            <Image src={ev.image} alt={ev.imageAlt || ''} width={1282} height={1800} sizes="(max-width: 767px) 90vw, 320px"
              style={{ width: '100%', height: 'auto', borderRadius: '10px', display: 'block' }} />
            {ev.caption && (
              <figcaption style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.08em', color: '#5d4d42', margin: '0.75rem 0 0' }}>{ev.caption}</figcaption>
            )}
          </figure>
        )}
        <div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'Inter, sans-serif', fontSize: '10.5px', letterSpacing: '0.12em', fontWeight: 500,
          color: '#3a2e2b', background: 'rgba(193,169,154,0.28)', border: '1px solid rgba(193,169,154,0.4)',
          padding: '0.4rem 0.9rem', borderRadius: '100px',
        }}>
          {ev.date}
        </span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.1em', color: '#5d4d42' }}>
          {ev.location}
        </span>
        {ev.tipo && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8a7a70' }}>· {ev.tipo}</span>}
      </div>

      <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 1.5rem', lineHeight: 1.25 }}>
        {ev.title}
      </h3>

      <div style={{ marginBottom: '2rem' }}>
        {ev.body.map((p, i) => (
          <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '13.5px', lineHeight: 1.85, color: '#5d4d42', margin: i === ev.body.length - 1 ? 0 : '0 0 1.1rem' }}>
            {p}
          </p>
        ))}
      </div>

      {(ev.closing || ev.link) && <div style={{
        borderTop: '1px solid rgba(193,169,154,0.3)', paddingTop: '1.5rem', clear: 'both',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        {ev.closing && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontStyle: 'italic', color: '#3a2e2b', margin: 0 }}>
          {ev.closing}
        </p>}
        {ev.link && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem' }}>
          {ev.logo && <Image src={ev.logo.src} alt={ev.logo.alt} width={40} height={40} style={{ width: 40, height: 40, borderRadius: '50%' }} />}
          <a href={ev.link} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: 'Inter, sans-serif', fontSize: '10.5px', letterSpacing: '0.14em', fontWeight: 500,
            color: '#f1eae4', background: '#3a2e2b',
            textDecoration: 'none', padding: '0.65rem 1.4rem', borderRadius: '100px', whiteSpace: 'nowrap',
            transition: 'background 0.25s, transform 0.25s',
            display: 'inline-block',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#5d4d42'; e.currentTarget.style.transform = 'translateX(2px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#3a2e2b'; e.currentTarget.style.transform = 'translateX(0)' }}>
            {ev.linkLabel || learnMore} →
          </a>
          </span>
        )}
      </div>}
        </div>
      </div>
      <style>{`@media (max-width: 767px) { .aw-ev-fig { float: none !important; width: 100% !important; margin: 0 0 1.5rem !important; } }`}</style>
    </div>
  )
}
