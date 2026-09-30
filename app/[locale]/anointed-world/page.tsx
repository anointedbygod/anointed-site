'use client'

import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
  closing: string
  link?: string
}

const CONTENT = {
  en: {
    heroTitle: ['Where the brand', 'comes to life.'],
    heroBody: 'Anointed is more than what we wear. It is a growing world of experiences, conversations, collaborations and meaningful encounters. From events and speaking engagements to selected partnerships and special projects, Anointed World brings the vision of the brand into real spaces — connecting women, ideas and opportunities.',
    upcoming: 'Upcoming',
    learnMore: 'Learn more',
    events: [
      {
        date: '10 October 2026',
        location: 'Rome, Italy',
        title: 'Anointed at Connection Business',
        body: [
          "On October 10th, Sofia Meneghetti, Founder of Anointed, will take part in Connection Business in Rome — an event created to bring together entrepreneurs, professionals and people who believe in the power of meaningful connections.",
          "For Anointed, being part of this event reflects one of the ideas at the heart of the brand: the right encounters can open new perspectives, create opportunities and sometimes change the direction of a journey.",
          "During the event, Sofia will share part of her experience as an entrepreneur and founder, speaking about connection, vision and the importance of surrounding yourself with people who can challenge, inspire and encourage you to grow.",
          "Connection Business is also an opportunity to meet Sofia in person, discover more about the world of Anointed and connect with a growing community built around fashion, purpose, entrepreneurship and meaningful relationships.",
        ],
        closing: 'Meet Sofia. Discover Anointed. Create new connections.',
      },
      {
        date: '21 November 2026',
        location: 'Tuscany, Italy',
        title: 'Anointed at EquipHer Italia — Casa Ruffino',
        body: [
          "On November 21st, Anointed will be present at EquipHer Italia at Casa Ruffino, for a day dedicated to women, leadership, entrepreneurship, faith and personal growth.",
          "This event has a special meaning for the brand. The first idea behind Anointed was born during an EquipHer experience in Las Vegas in April 2025 — a moment that sparked a vision for a fashion brand with deeper meaning, created to remind women of their value, identity and purpose.",
          "A year later, Sofia Meneghetti, Founder of Anointed, returns to the EquipHer world with the brand by her side, bringing that original vision into something real and tangible.",
          "At Casa Ruffino, guests will have the opportunity to meet Sofia, connect in person and discover Anointed more closely — its story, its message and the world that is taking shape around the brand.",
          "For Anointed, this is more than simply being present at an event. It is a meaningful return to the kind of environment that helped inspire its beginning: a space where women connect, share ideas, grow and encourage one another to step into something greater.",
        ],
        closing: 'Come say hello, meet Sofia and step into the world of Anointed.',
        link: 'https://equipherconference.com/italy/',
      },
    ] as EventItem[],
  },
  it: {
    heroTitle: ['Dove il brand', 'prende vita.'],
    heroBody: 'Anointed è più di ciò che indossiamo. È un mondo in crescita fatto di esperienze, conversazioni, collaborazioni e incontri significativi. Da eventi e interventi pubblici a partnership selezionate e progetti speciali, Anointed World porta la visione del brand in spazi reali — connettendo donne, idee e opportunità.',
    upcoming: 'In programma',
    learnMore: 'Scopri di più',
    events: [
      {
        date: '10 ottobre 2026',
        location: 'Roma, Italia',
        title: 'Anointed al Connection Business',
        body: [
          "Il 10 ottobre, Sofia Meneghetti, Founder di Anointed, parteciperà al Connection Business di Roma — un evento nato per riunire imprenditori, professionisti e persone che credono nel potere delle connessioni autentiche.",
          "Per Anointed, essere parte di questo evento riflette una delle idee al centro del brand: gli incontri giusti possono aprire nuove prospettive, creare opportunità e a volte cambiare la direzione di un percorso.",
          "Durante l'evento, Sofia condividerà parte della sua esperienza come imprenditrice e fondatrice, parlando di connessione, visione e dell'importanza di circondarsi di persone capaci di sfidarti, ispirarti e spingerti a crescere.",
          "Connection Business è anche un'occasione per incontrare Sofia di persona, scoprire più da vicino il mondo di Anointed e connettersi con una community in crescita costruita attorno a moda, scopo, imprenditorialità e relazioni autentiche.",
        ],
        closing: 'Incontra Sofia. Scopri Anointed. Crea nuove connessioni.',
      },
      {
        date: '21 novembre 2026',
        location: 'Toscana, Italia',
        title: 'Anointed a EquipHer Italia — Casa Ruffino',
        body: [
          "Il 21 novembre, Anointed sarà presente a EquipHer Italia, a Casa Ruffino, per una giornata dedicata a donne, leadership, imprenditorialità, fede e crescita personale.",
          "Questo evento ha un significato speciale per il brand. La prima idea di Anointed è nata durante un'esperienza EquipHer a Las Vegas nell'aprile 2025 — un momento che ha acceso la visione di un brand di moda con un significato più profondo, pensato per ricordare alle donne il loro valore, la loro identità e il loro scopo.",
          "Un anno dopo, Sofia Meneghetti, Founder di Anointed, torna nel mondo EquipHer con il brand al suo fianco, portando quella visione originaria in qualcosa di reale e tangibile.",
          "A Casa Ruffino, gli ospiti avranno l'opportunità di incontrare Sofia, connettersi di persona e scoprire Anointed più da vicino — la sua storia, il suo messaggio e il mondo che sta prendendo forma attorno al brand.",
          "Per Anointed, questo è più della semplice presenza a un evento. È un ritorno significativo nel tipo di ambiente che ha contribuito a ispirarne l'inizio: uno spazio in cui le donne si connettono, condividono idee, crescono e si incoraggiano a vicenda a fare un passo verso qualcosa di più grande.",
        ],
        closing: 'Vieni a salutarci, incontra Sofia ed entra nel mondo di Anointed.',
        link: 'https://equipherconference.com/italy/',
      },
    ] as EventItem[],
  },
} as const

export default function AnointedWorldPage() {
  const pathname = usePathname()
  const locale = (pathname?.startsWith('/it') ? 'it' : 'en') as 'en' | 'it'
  const t = CONTENT[locale]
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
          background: "url('/images/about/stage.jpg') center 22%/cover",
          animation: 'awKenBurns 26s ease-in-out infinite alternate',
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(180deg, rgba(20,14,12,0.55) 0%, rgba(20,14,12,0.35) 45%, rgba(20,14,12,0.75) 100%)',
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
          <h2 style={{
            fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 2vw, 2rem)', fontWeight: 300,
            color: '#3a2e2b', textAlign: 'center', margin: '0 0 3.5rem',
          }}>
            {t.upcoming}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {t.events.map((ev, i) => <EventCard key={i} ev={ev} learnMore={t.learnMore} />)}
          </div>
        </div>
      </section>

    </main>
  )
}

function EventCard({ ev, learnMore }: { ev: EventItem; learnMore: string }) {
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
      </div>

      <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 1.5rem', lineHeight: 1.25 }}>
        {ev.title}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '2rem' }}>
        {ev.body.map((p, i) => (
          <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '13.5px', lineHeight: 1.85, color: '#5d4d42', margin: 0 }}>
            {p}
          </p>
        ))}
      </div>

      <div style={{
        borderTop: '1px solid rgba(193,169,154,0.3)', paddingTop: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontStyle: 'italic', color: '#3a2e2b', margin: 0 }}>
          {ev.closing}
        </p>
        {ev.link && (
          <a href={ev.link} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: 'Inter, sans-serif', fontSize: '10.5px', letterSpacing: '0.14em', fontWeight: 500,
            color: '#f1eae4', background: '#3a2e2b',
            textDecoration: 'none', padding: '0.65rem 1.4rem', borderRadius: '100px', whiteSpace: 'nowrap',
            transition: 'background 0.25s, transform 0.25s',
            display: 'inline-block',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#5d4d42'; e.currentTarget.style.transform = 'translateX(2px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#3a2e2b'; e.currentTarget.style.transform = 'translateX(0)' }}>
            {learnMore} →
          </a>
        )}
      </div>
    </div>
  )
}
