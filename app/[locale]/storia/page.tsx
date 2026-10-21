'use client'

import ValoriStack from '@/components/ValoriStack'
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

const CONTENT = {
  en: {
    heroTitle1: 'Anointed is not just a brand.',
    heroTitle2: 'It is a reminder.',
    heroBody: "A reminder that a woman's identity is not defined by the world but by her calling.",
    chapters: [
      {
        title: 'Chosen and set apart.',
        body: "The name Anointed is rooted in the biblical meaning of being chosen and set apart for something greater. It speaks of identity, purpose and calling — a reminder that every woman carries something unique within her. She is not ordinary. She is appointed.",
      },
      {
        title: 'More than clothing.',
        body: 'Anointed is more than clothing. Every piece is created with intention, combining elegance, structure and meaning. Designed to reflect identity and individuality, Anointed transforms clothing into a symbol of purpose, confidence and lasting impact.',
      },
      {
        title: 'Made in Italy.',
        body: "Every ANOINTED creation reflects the excellence of Italian craftsmanship, where tradition, expertise, and attention to detail come together.\n\nWe carefully select exceptional materials, from fine Como silk to luxurious Cariaggi cashmere, collaborating with skilled Italian artisans and local manufacturers who share our commitment to quality and authenticity.\n\nFor us, Made in Italy is more than a label. It is a conscious choice to preserve traditional craftsmanship, support local businesses, and create timeless pieces designed to be cherished beyond seasons.",
      },
    ],
    madeCta: 'Discover our supply chain',
    foundingTitle: 'The story behind the name.',
    foundingParagraphs: [
      "Sometimes, the moments that change the course of our lives arrive quietly.",
      "It started in Dubai, at a friend's home, where I unexpectedly reconnected with someone I had known but had never been particularly close to. During that encounter, she invited me to attend the EquipHer Conference in Las Vegas.",
      "At first, I was hesitant. I already had other plans and wasn't sure whether I should go. But shortly before the conference, something shifted. I felt strongly that I needed to be there.",
      "So I changed my plans, reached out to her, and decided to go.",
      "That decision changed everything.",
      "In April 2025, I arrived in Las Vegas without knowing that those few days would become the beginning of ANOINTED.",
      "What began with an unexpected encounter in Dubai became the first step toward a vision I had yet to put into words.",
    ],
    founderLabel: 'THE FOUNDER',
    founderName: 'Sofia Meneghetti',
    founderBio: [
      "Fashion has always been part of the way I see the world.",
      "I studied Fashion Marketing & Communications, and my journey through entrepreneurship and women-led communities taught me the power of confidence, connection, and believing in something greater than ourselves.",
      "Yet, for a long time, others recognized my place in fashion before I could see it for myself.",
      "I know what it means to question your worth, your direction, and whether you are capable of more. I was one of those women too.",
      "My faith has shaped the way I see purpose and identity. I believe God places visions in our hearts before we fully understand where they will lead us. Sometimes, the calling comes before the confidence.",
      "That is how ANOINTED began.",
      "I created ANOINTED to remind women of something they may have forgotten: their worth is not defined by what they achieve or what others see in them. They are already worthy, already enough, and created with purpose.",
      "But my vision goes beyond fashion. I want ANOINTED to become a way to uplift women, support meaningful causes, and create a lasting impact.",
      "Because success is not only about what we build for ourselves, but about what we can give and the legacy we leave behind.",
    ],
    ctaTitle: 'Ready to wear your purpose?',
    ctaButton: 'DISCOVER THE COLLECTION',
    photo: 'EDITORIAL PHOTO',
    sofiaPhoto: 'SOFIA PHOTO',
  },
  it: {
    heroTitle1: 'Anointed non è solo un brand.',
    heroTitle2: 'È un promemoria.',
    heroBody: "Un promemoria che l'identità di una donna non è definita dal mondo, ma dalla sua chiamata.",
    chapters: [
      {
        title: 'Scelta e messa da parte.',
        body: "Il nome Anointed affonda le radici nel significato biblico dell'essere scelti e messi da parte per qualcosa di più grande. Parla di identità, scopo e chiamata — un promemoria che ogni donna porta con sé qualcosa di unico. Non è ordinaria. È nominata.",
      },
      {
        title: 'Più che semplice abbigliamento.',
        body: "Anointed è più che semplice abbigliamento. Ogni capo nasce con intenzione, unendo eleganza, struttura e significato. Pensato per riflettere identità e unicità, Anointed trasforma l'abbigliamento in un simbolo di scopo, fiducia e impatto duraturo.",
      },
      {
        title: 'Made in Italy.',
        body: "Ogni creazione ANOINTED riflette l'eccellenza dell'artigianato italiano, dove tradizione, competenza e attenzione al dettaglio si incontrano.\n\nSelezioniamo con cura materiali eccezionali, dalla pregiata seta di Como al lussuoso cashmere Cariaggi, collaborando con abili artigiani italiani e produttori locali che condividono il nostro impegno per qualità e autenticità.\n\nPer noi il Made in Italy è più di un'etichetta. È una scelta consapevole: preservare l'artigianalità tradizionale, sostenere le imprese locali e creare capi senza tempo, pensati per essere custoditi oltre le stagioni.",
      },
    ],
    madeCta: 'Scopri la nostra filiera',
    foundingTitle: 'La storia dietro il nome.',
    foundingParagraphs: [
      "A volte, i momenti che cambiano il corso della nostra vita arrivano in silenzio.",
      "È iniziato a Dubai, a casa di un'amica, dove ho incontrato per caso una persona che conoscevo ma con cui non avevo mai avuto un legame particolare. Durante quell'incontro mi ha invitata a partecipare alla EquipHer Conference a Las Vegas.",
      "All'inizio ero titubante. Avevo già altri programmi e non ero sicura di dover andare. Ma poco prima della conferenza, qualcosa è cambiato. Ho sentito con forza che dovevo essere lì.",
      "Così ho cambiato i miei piani, l'ho contattata e ho deciso di partire.",
      "Quella decisione ha cambiato tutto.",
      "Nell'aprile 2025 sono arrivata a Las Vegas senza sapere che quei pochi giorni sarebbero stati l'inizio di ANOINTED.",
      "Ciò che è nato da un incontro inaspettato a Dubai è diventato il primo passo verso una visione che non ero ancora riuscita a mettere in parole.",
    ],
    founderLabel: 'LA FONDATRICE',
    founderName: 'Sofia Meneghetti',
    founderBio: [
      "La moda ha sempre fatto parte del mio modo di vedere il mondo.",
      "Ho studiato Fashion Marketing & Communications e il mio percorso tra imprenditoria e comunità al femminile mi ha insegnato il potere della fiducia, della connessione e del credere in qualcosa di più grande di noi.",
      "Eppure, per molto tempo, gli altri hanno riconosciuto il mio posto nella moda prima che riuscissi a vederlo io stessa.",
      "So cosa significa mettere in dubbio il proprio valore, la propria direzione e la propria capacità di fare di più. Ero una di quelle donne anch'io.",
      "La mia fede ha plasmato il modo in cui vedo scopo e identità. Credo che Dio metta delle visioni nel nostro cuore prima ancora che capiamo dove ci porteranno. A volte la chiamata arriva prima della fiducia.",
      "È così che è nata ANOINTED.",
      "Ho creato ANOINTED per ricordare alle donne qualcosa che forse hanno dimenticato: il loro valore non è definito da ciò che raggiungono né da ciò che gli altri vedono in loro. Sono già degne, già abbastanza, create con uno scopo.",
      "Ma la mia visione va oltre la moda. Voglio che ANOINTED diventi un modo per sostenere le donne, appoggiare cause significative e creare un impatto duraturo.",
      "Perché il successo non riguarda solo ciò che costruiamo per noi stesse, ma ciò che possiamo dare e l'eredità che lasciamo.",
    ],
    ctaTitle: 'Pronta a indossare il tuo scopo?',
    ctaButton: 'SCOPRI LA COLLEZIONE',
    photo: 'FOTO EDITORIALE',
    sofiaPhoto: 'FOTO DI SOFIA',
  },
}

export default function StoriaPage() {
  const pathname = usePathname()
  const locale = (pathname.startsWith('/it') ? 'it' : 'en') as 'en' | 'it'
  const t = CONTENT[locale]

  return (
    <main style={{ background: '#f1eae4' }}>

      {/* HERO */}
      <section style={{
        height: '80vh', minHeight: '500px',
        background: 'linear-gradient(160deg, #3a2e2b 0%, #5d4d42 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', textAlign: 'center', padding: '0 1.5rem',
        paddingTop: '64px',
      }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, color: '#f1eae4', lineHeight: 1.15, margin: '0 0 1.5rem', maxWidth: '700px' }}>
          {t.heroTitle1}<br />
          <em style={{ fontStyle: 'italic', color: '#c1a99a' }}>{t.heroTitle2}</em>
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.8, color: 'rgba(241,234,228,0.6)', maxWidth: '480px', margin: 0 }}>
          {t.heroBody}
        </p>
      </section>

      {/* 01 */}
      <Chapter title={t.chapters[0].title} body={t.chapters[0].body} imageRight={false} photoLabel={t.photo} photoSrc="/images/about/chapter-origin.jpg" />
      {/* 02 */}
      <Chapter title={t.chapters[1].title} body={t.chapters[1].body} imageRight={true} dark photoLabel={t.photo} photoSrc="/images/about/chapter-meaning.jpg" />
      {/* 03 — Our Values */}
      <ValoriStack />
      {/* 04 — Craftsmanship */}
      <Chapter title={t.chapters[2].title} body={t.chapters[2].body} imageRight={false} photoLabel={t.photo} photoSrc="/images/about/chapter-craftsmanship.jpg" ctaLabel={t.madeCta} ctaHref={`/${locale}/filiera`} />

      {/* 05 — Founding story */}
      <section style={{ background: '#3a2e2b', padding: '7rem 1.5rem' }}>
        <FoundingStory title={t.foundingTitle} paragraphs={t.foundingParagraphs} />
      </section>

      {/* 06 — The founder */}
      <section style={{ background: '#f1eae4', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <SofiaSection label={t.founderLabel} name={t.founderName} bio={t.founderBio} photoLabel={t.sofiaPhoto} photoSrc="/images/about/sofia-founder.jpg" />
        </div>
      </section>

      {/* CTA finale */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center', background: '#f1eae4' }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 2.5rem', lineHeight: 1.2 }}>
          {t.ctaTitle}
        </h2>
        <Link href={`/${locale}/prodotti`} style={{
          fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em',
          background: '#3a2e2b', color: '#f1eae4', textDecoration: 'none',
          padding: '0.85rem 2.5rem', borderRadius: '1px', display: 'inline-block',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#5d4d42'}
        onMouseLeave={e => e.currentTarget.style.background = '#3a2e2b'}>
          {t.ctaButton}
        </Link>
      </section>

    </main>
  )
}

function Chapter({ title, body, imageRight, dark, photoLabel, photoSrc, ctaLabel, ctaHref }: {
  title: string; body: string; imageRight: boolean; dark?: boolean; photoLabel: string; photoSrc?: string; ctaLabel?: string; ctaHref?: string
}) {
  const { ref, visible } = useVisible()

  return (
    <div ref={ref} style={{ background: dark ? '#3a2e2b' : '#f1eae4', padding: '6rem 1.5rem' }}>
      <div className="chapter-grid" style={{
        maxWidth: '1100px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center',
        direction: imageRight ? 'rtl' : 'ltr',
      }}>
        <div style={{
          direction: 'ltr',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300, lineHeight: 1.2, color: dark ? '#f1eae4' : '#3a2e2b', margin: '0 0 1.5rem' }}>
            {title}
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: dark ? 'rgba(241,234,228,0.65)' : '#5d4d42', margin: 0, maxWidth: '440px', whiteSpace: 'pre-line' }}>
            {body}
          </p>
          {ctaLabel && ctaHref && (
            <Link href={ctaHref} style={{
              display: 'inline-block', marginTop: '1.75rem', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.16em',
              color: dark ? '#f1eae4' : '#3a2e2b', textDecoration: 'none',
              borderBottom: `1px solid ${dark ? 'rgba(241,234,228,0.5)' : 'rgba(58,46,43,0.5)'}`, paddingBottom: '4px',
            }}>
              {ctaLabel.toUpperCase()} →
            </Link>
          )}
        </div>

        <div style={{
          direction: 'ltr',
          aspectRatio: '4/5',
          background: photoSrc
            ? `url(${photoSrc}) center/cover`
            : (dark ? 'rgba(241,234,228,0.05)' : 'linear-gradient(135deg, #e8d2c3 0%, #c1a99a 100%)'),
          borderRadius: '2px',
          border: dark ? '1px solid rgba(241,234,228,0.1)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
        }}>
          {!photoSrc && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.18em', color: dark ? 'rgba(241,234,228,0.2)' : 'rgba(58,46,43,0.2)' }}>
              {photoLabel}
            </p>
          )}
        </div>
      </div>

      <style>{`
        .chapter-grid { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 767px) {
          .chapter-grid { grid-template-columns: 1fr !important; direction: ltr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </div>
  )
}

function FoundingStory({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  const { ref, visible } = useVisible()

  return (
    <div ref={ref} style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{
        fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300,
        color: '#f1eae4', margin: '0 0 3rem', lineHeight: 1.25,
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {paragraphs.map((p, i) => (
          <p key={i} style={{
            fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: 1.9,
            color: 'rgba(241,234,228,0.7)', margin: 0,
            fontStyle: i === 0 || i === 4 ? 'italic' : 'normal',
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 0.7s ease ${0.1 + i * 0.08}s, transform 0.7s ease ${0.1 + i * 0.08}s`,
          }}>
            {p}
          </p>
        ))}
      </div>
    </div>
  )
}

function SofiaSection({ label, name, bio, photoLabel, photoSrc }: { label: string; name: string; bio: string[]; photoLabel: string; photoSrc?: string }) {
  const { ref, visible } = useVisible()

  return (
    <div ref={ref}>
      <div className="sofia-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>

        <div style={{
          aspectRatio: '3/4',
          background: photoSrc ? `url(${photoSrc}) center/cover` : 'linear-gradient(135deg, #c1a99a 0%, #5d4d42 100%)',
          borderRadius: '2px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'sticky', top: '96px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>
          {!photoSrc && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(241,234,228,0.5)' }}>
              {photoLabel}
            </p>
          )}
        </div>

        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', fontWeight: 500, color: '#c1a99a', margin: '0 0 0.75rem' }}>
            {label}
          </p>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 2rem', lineHeight: 1.2 }}>
            {name}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {bio.map((p, i) => (
              <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: '#5d4d42', margin: 0, maxWidth: '460px' }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .sofia-grid { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 767px) {
          .sofia-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .sofia-grid > div:first-child { position: static !important; }
        }
      `}</style>
    </div>
  )
}
