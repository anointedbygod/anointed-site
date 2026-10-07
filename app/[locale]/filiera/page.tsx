'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function useVisible(threshold = 0.15) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

// NOTE: struttura con testi PLACEHOLDER. I fatti su Cariaggi (sede a Cagli,
// oltre 60 anni di storia, fibre pregiate come cashmere e seta) arrivano dal
// sito pubblico del lanificio. Tutto il resto va sostituito con i testi
// approvati da Sofia / Cariaggi. Nessun riferimento ad altri marchi o
// azionisti: se verra' approvato, va aggiunto qui in modo esplicito.
const CONTENT = {
  en: {
    eyebrow: 'OUR SUPPLY CHAIN',
    heroTitle1: 'Fabrics with a place',
    heroTitle2: 'and a story.',
    heroBody: 'Every Anointed piece begins long before the first cut: in the Italian mill where the fibres become cloth.',
    introTitle: 'Born in Italy, from fibre to finished piece.',
    introBody: [
      'Anointed fabrics are woven in Italy by Lanificio Cariaggi, a historic textile company working with fine natural fibres.',
      '[Placeholder text — to be replaced with the approved story of the partnership between Anointed and Cariaggi.]',
    ],
    millLabel: 'THE MILL',
    millTitle: 'Lanificio Cariaggi',
    millBody: '[Placeholder text — short description of the mill, its history and its way of working, approved by Cariaggi.]',
    facts: [
      { value: 'Cagli', label: 'Marche, Italy' },
      { value: '60+', label: 'years of textile tradition' },
      { value: 'Cashmere & silk', label: 'fine natural fibres' },
    ],
    photoMill: 'MILL PHOTO',
    pillarsTitle: 'What it means for you.',
    pillars: [
      { title: 'Fine natural fibres', body: '[Placeholder — why cashmere and silk, how they feel and how they last.]' },
      { title: 'Made in Italy', body: '[Placeholder — craftsmanship, construction and the Italian standard Anointed works to.]' },
      { title: 'Made to last', body: '[Placeholder — pieces designed to be worn for years, not seasons.]' },
    ],
    quote: '[Placeholder — a few words from Sofia on why she chose this mill.]',
    quoteBy: 'Sofia Meneghetti',
    storyLink: 'Read the Anointed story',
    ctaTitle: 'Feel the difference.',
    ctaButton: 'DISCOVER THE COLLECTION',
  },
  it: {
    eyebrow: 'LA NOSTRA FILIERA',
    heroTitle1: 'Tessuti con un luogo',
    heroTitle2: 'e una storia.',
    heroBody: 'Ogni capo Anointed nasce molto prima del primo taglio: nel lanificio italiano dove le fibre diventano tessuto.',
    introTitle: 'Nato in Italia, dalla fibra al capo finito.',
    introBody: [
      'I tessuti di Anointed sono tessuti in Italia dal Lanificio Cariaggi, storica azienda tessile che lavora fibre naturali pregiate.',
      '[Testo segnaposto — da sostituire con la storia approvata della collaborazione tra Anointed e Cariaggi.]',
    ],
    millLabel: 'IL LANIFICIO',
    millTitle: 'Lanificio Cariaggi',
    millBody: '[Testo segnaposto — breve descrizione del lanificio, della sua storia e del modo di lavorare, approvata da Cariaggi.]',
    facts: [
      { value: 'Cagli', label: 'Marche, Italia' },
      { value: '60+', label: 'anni di tradizione tessile' },
      { value: 'Cashmere e seta', label: 'fibre naturali pregiate' },
    ],
    photoMill: 'FOTO DEL LANIFICIO',
    pillarsTitle: 'Cosa significa per te.',
    pillars: [
      { title: 'Fibre naturali pregiate', body: '[Segnaposto — perché cashmere e seta, come si sentono e come durano.]' },
      { title: 'Made in Italy', body: "[Segnaposto — artigianalità, costruzione e lo standard italiano a cui lavora Anointed.]" },
      { title: 'Pensati per durare', body: '[Segnaposto — capi pensati per essere indossati per anni, non per una stagione.]' },
    ],
    quote: '[Segnaposto — poche parole di Sofia su perché ha scelto questo lanificio.]',
    quoteBy: 'Sofia Meneghetti',
    storyLink: 'Leggi la storia di Anointed',
    ctaTitle: 'Senti la differenza.',
    ctaButton: 'SCOPRI LA COLLEZIONE',
  },
}

export default function FilieraPage() {
  const pathname = usePathname()
  const locale = (pathname.startsWith('/it') ? 'it' : 'en') as 'en' | 'it'
  const t = CONTENT[locale]

  return (
    <main style={{ background: '#f1eae4' }}>

      {/* HERO */}
      <section style={{
        height: '70vh', minHeight: '460px',
        background: 'linear-gradient(160deg, #3a2e2b 0%, #5d4d42 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', textAlign: 'center', padding: '0 1.5rem', paddingTop: '64px',
      }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 1.25rem' }}>
          — {t.eyebrow} —
        </p>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 300, color: '#f1eae4', lineHeight: 1.15, margin: '0 0 1.5rem', maxWidth: '720px' }}>
          {t.heroTitle1}<br />
          <em style={{ fontStyle: 'italic', color: '#c1a99a' }}>{t.heroTitle2}</em>
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.8, color: 'rgba(241,234,228,0.6)', maxWidth: '500px', margin: 0 }}>
          {t.heroBody}
        </p>
      </section>

      <Intro title={t.introTitle} body={t.introBody} />
      <Mill t={t} />
      <Pillars title={t.pillarsTitle} pillars={t.pillars} />
      <Quote quote={t.quote} by={t.quoteBy} />

      {/* CTA finale */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center', background: '#f1eae4' }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 2.5rem', lineHeight: 1.2 }}>
          {t.ctaTitle}
        </h2>
        <Link href={`/${locale}/prodotti`} style={{
          fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em',
          background: '#3a2e2b', color: '#f1eae4', textDecoration: 'none',
          padding: '0.85rem 2.5rem', borderRadius: '1px', display: 'inline-block', transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#5d4d42'}
        onMouseLeave={e => e.currentTarget.style.background = '#3a2e2b'}>
          {t.ctaButton}
        </Link>
        <div style={{ marginTop: '1.75rem' }}>
          <Link href={`/${locale}/storia`} style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', letterSpacing: '0.08em', color: '#5d4d42', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
            {t.storyLink}
          </Link>
        </div>
      </section>
    </main>
  )
}

function Intro({ title, body }: { title: string; body: string[] }) {
  const { ref, visible } = useVisible()
  return (
    <section ref={ref} style={{ background: '#f1eae4', padding: '6rem 1.5rem 3rem' }}>
      <div style={{
        maxWidth: '680px', margin: '0 auto', textAlign: 'center',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300, color: '#3a2e2b', lineHeight: 1.25, margin: '0 0 1.75rem' }}>
          {title}
        </h2>
        {body.map((p, i) => (
          <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.9, color: '#5d4d42', margin: '0 0 1.1rem' }}>{p}</p>
        ))}
      </div>
    </section>
  )
}

function Mill({ t }: { t: typeof CONTENT['en'] }) {
  const { ref, visible } = useVisible()
  return (
    <section ref={ref} style={{ background: '#3a2e2b', padding: '6rem 1.5rem' }}>
      <div className="fil-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
        <div style={{
          aspectRatio: '4/5', background: 'rgba(241,234,228,0.05)', border: '1px solid rgba(241,234,228,0.1)',
          borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(241,234,228,0.25)' }}>{t.photoMill}</p>
        </div>
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', fontWeight: 500, color: '#c1a99a', margin: '0 0 0.75rem' }}>{t.millLabel}</p>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300, color: '#f1eae4', margin: '0 0 1.5rem', lineHeight: 1.2 }}>{t.millTitle}</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'rgba(241,234,228,0.65)', margin: '0 0 2.25rem', maxWidth: '440px' }}>{t.millBody}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {t.facts.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', borderTop: '1px solid rgba(241,234,228,0.1)', paddingTop: '1rem' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.3rem', fontWeight: 300, color: '#f1eae4', minWidth: '9rem' }}>{f.value}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.1em', color: '#c1a99a' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .fil-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  )
}

function Pillars({ title, pillars }: { title: string; pillars: { title: string; body: string }[] }) {
  const { ref, visible } = useVisible()
  return (
    <section ref={ref} style={{ background: '#f1eae4', padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300, color: '#3a2e2b',
          textAlign: 'center', margin: '0 0 3.5rem', lineHeight: 1.25,
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>{title}</h2>
        <div className="fil-pillars" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
          {pillars.map((p, i) => (
            <div key={i} style={{
              borderTop: '1px solid rgba(193,169,154,0.5)', paddingTop: '1.5rem',
              opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.8s ease ${0.1 + i * 0.12}s, transform 0.8s ease ${0.1 + i * 0.12}s`,
            }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', color: '#c1a99a', margin: '0 0 0.9rem' }}>0{i + 1}</p>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.15rem', fontWeight: 300, color: '#3a2e2b', margin: '0 0 0.9rem' }}>{p.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13.5px', lineHeight: 1.8, color: '#5d4d42', margin: 0 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .fil-pillars { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  )
}

function Quote({ quote, by }: { quote: string; by: string }) {
  const { ref, visible } = useVisible()
  return (
    <section ref={ref} style={{ background: '#e8d2c3', padding: '5.5rem 1.5rem' }}>
      <div style={{
        maxWidth: '720px', margin: '0 auto', textAlign: 'center',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}>
        <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1.2rem, 2vw, 1.7rem)', lineHeight: 1.6, color: '#3a2e2b', margin: '0 0 1.5rem' }}>
          “{quote}”
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#5d4d42', margin: 0 }}>— {by.toUpperCase()}</p>
      </div>
    </section>
  )
}
