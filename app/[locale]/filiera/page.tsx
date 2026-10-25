'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

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

// Testi forniti da Sofia. Como: nessun produttore citato (sono più produttori).
// I contenuti su Cariaggi (storia, sostenibilità) sono tratti dal sito pubblico del lanificio.
const CONTENT = {
  en: {
    eyebrow: 'OUR SUPPLY CHAIN',
    heroTitle1: 'The Art of',
    heroTitle2: 'Italian Craftsmanship',
    heroBody: 'At ANOINTED, quality begins with the materials we choose and the people who bring our creations to life.',
    introBody: [
      'Rooted in Italian textile traditions, we carefully select exceptional materials and collaborate with skilled artisans who share our commitment to quality, authenticity, and timeless elegance.',
      'We believe true luxury lies not only in what we create, but also in how it is made.',
    ],
    millLabel: '01 — LANIFICIO CARIAGGI',
    millTitle: 'The Art of Cashmere',
    millBlocks: [
      { h: 'Italian Excellence Since 1958', p: [
        "Founded in 1958 in Cagli, in Italy's Marche region, Cariaggi is one of the world's leading manufacturers of luxury cashmere yarns, internationally recognized for its exceptional quality, innovation, and Italian textile expertise.",
        'With over 65 years of experience, Cariaggi transforms carefully selected cashmere fibres from China and Mongolia into premium yarns spun in Italy, combining advanced technologies with generations of traditional craftsmanship.',
      ] },
      { h: 'Sustainability & Animal Welfare', p: [
        'Beyond exceptional quality, Cariaggi places strong emphasis on responsible sourcing, environmental sustainability, and animal welfare.',
        'Its commitment includes internationally recognized initiatives such as the Good Cashmere Standard and the Sustainable Fibre Alliance, which promote the welfare of cashmere goats, responsible land management, and improved conditions for local herding communities.',
        'At ANOINTED, we have chosen Cariaggi not only for the exceptional quality of its cashmere, but also for its commitment to responsible practices and respect for animals and the environment.',
      ] },
    ],
    facts: [
      { value: 'Cagli', label: 'Marche, Italy' },
      { value: '1958', label: 'founded — 65+ years of tradition' },
      { value: 'Cashmere', label: 'luxury yarns spun in Italy' },
    ],
    photoMill: 'MILL PHOTO',
    slides: [
      { src: '/images/about/cariaggi-cashmere.jpg', alt: 'Raw cashmere fibre', label: 'CASHMERE', logo: true },
    ],
    silkAlt: 'Silk fibres and a silk cocoon',
    prevPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    blocks: [
      { label: '02 — COMO', title: 'The Art of Silk', bg: '#f1eae4', p: [
        'Located in Northern Italy, Como is one of the world\'s most renowned silk-producing districts, with a centuries-old tradition of textile excellence.',
        'Combining generations of craftsmanship with advanced technologies, the region is internationally recognized for its expertise in silk weaving, printing, and finishing.',
        "At ANOINTED, we select premium silk from textile manufacturers in the Como district, valuing its exceptional quality, natural lustre, softness, and refined elegance.",
        'Through our silk creations, we celebrate the heritage of Italian textile craftsmanship and the timeless beauty of this precious material.',
      ] },
      { label: '03 — MADE IN ITALY', title: 'Our Commitment to Craftsmanship', bg: '#e8d2c3', p: [
        'At ANOINTED, Made in Italy represents more than a label. It reflects our commitment to quality, authenticity, and the preservation of Italian craftsmanship.',
        'We believe in supporting local businesses, independent manufacturers, and skilled artisans, recognizing the importance of preserving traditional expertise and creating opportunities within Italian communities.',
        'By choosing to collaborate with Italian producers, we aim to contribute to the growth of local businesses while celebrating the knowledge, dedication, and attention to detail that make Italian craftsmanship exceptional.',
        'From the selection of materials to the finishing touches, every creation reflects our belief that true luxury is not only about what we make, but also about the people and values behind it.',
      ] },
    ],
    storyLink: 'Read the ANOINTED story',
    ctaTitle: 'Feel the difference.',
    ctaButton: 'DISCOVER THE COLLECTION',
  },
  it: {
    eyebrow: 'LA NOSTRA FILIERA',
    heroTitle1: "L'Arte dell'",
    heroTitle2: 'Artigianalità Italiana',
    heroBody: 'In ANOINTED la qualità nasce dai materiali che scegliamo e dalle persone che danno vita alle nostre creazioni.',
    introBody: [
      'Radicati nelle tradizioni tessili italiane, selezioniamo con cura materiali eccezionali e collaboriamo con abili artigiani che condividono il nostro impegno per qualità, autenticità ed eleganza senza tempo.',
      'Crediamo che il vero lusso non risieda solo in ciò che creiamo, ma anche nel modo in cui viene realizzato.',
    ],
    millLabel: '01 — LANIFICIO CARIAGGI',
    millTitle: 'L\'Arte del Cashmere',
    millBlocks: [
      { h: 'Eccellenza italiana dal 1958', p: [
        "Fondato nel 1958 a Cagli, nelle Marche, Cariaggi è uno dei principali produttori al mondo di filati di cashmere di lusso, riconosciuto a livello internazionale per l'eccezionale qualità, l'innovazione e la competenza tessile italiana.",
        'Con oltre 65 anni di esperienza, Cariaggi trasforma fibre di cashmere accuratamente selezionate, provenienti da Cina e Mongolia, in filati pregiati lavorati in Italia, unendo tecnologie avanzate e generazioni di sapere artigianale.',
      ] },
      { h: 'Sostenibilità e benessere animale', p: [
        "Oltre all'eccezionale qualità, Cariaggi pone grande attenzione all'approvvigionamento responsabile, alla sostenibilità ambientale e al benessere animale.",
        'Il suo impegno include iniziative riconosciute a livello internazionale come il Good Cashmere Standard e la Sustainable Fibre Alliance, che promuovono il benessere delle capre da cashmere, la gestione responsabile del territorio e migliori condizioni per le comunità locali di pastori.',
        "In ANOINTED abbiamo scelto Cariaggi non solo per l'eccezionale qualità del suo cashmere, ma anche per il suo impegno verso pratiche responsabili e il rispetto di animali e ambiente.",
      ] },
    ],
    facts: [
      { value: 'Cagli', label: 'Marche, Italia' },
      { value: '1958', label: 'fondato — oltre 65 anni di tradizione' },
      { value: 'Cashmere', label: 'filati di lusso lavorati in Italia' },
    ],
    photoMill: 'FOTO DEL LANIFICIO',
    slides: [
      { src: '/images/about/cariaggi-cashmere.jpg', alt: 'Fibra di cashmere grezza', label: 'CASHMERE', logo: true },
    ],
    silkAlt: 'Fibre di seta e un bozzolo',
    prevPhoto: 'Foto precedente',
    nextPhoto: 'Foto successiva',
    blocks: [
      { label: '02 — COMO', title: "L'Arte della Seta", bg: '#f1eae4', p: [
        'Situata nel Nord Italia, Como è uno dei distretti serici più rinomati al mondo, con una tradizione tessile secolare di eccellenza.',
        'Unendo generazioni di sapere artigianale e tecnologie avanzate, il territorio è riconosciuto a livello internazionale per la sua competenza nella tessitura, nella stampa e nella nobilitazione della seta.',
        "In ANOINTED selezioniamo seta pregiata da produttori tessili del distretto di Como, apprezzandone l'eccezionale qualità, la naturale lucentezza, la morbidezza e la raffinata eleganza.",
        "Con le nostre creazioni in seta celebriamo il patrimonio dell'artigianato tessile italiano e la bellezza senza tempo di questo materiale prezioso.",
      ] },
      { label: '03 — MADE IN ITALY', title: "Il nostro impegno per l'artigianalità", bg: '#e8d2c3', p: [
        "In ANOINTED il Made in Italy è più di un'etichetta. Riflette il nostro impegno per la qualità, l'autenticità e la tutela dell'artigianato italiano.",
        "Crediamo nel sostenere le imprese locali, i produttori indipendenti e gli abili artigiani, riconoscendo l'importanza di preservare il sapere tradizionale e di creare opportunità nelle comunità italiane.",
        "Scegliendo di collaborare con produttori italiani, vogliamo contribuire alla crescita delle imprese locali celebrando la conoscenza, la dedizione e l'attenzione al dettaglio che rendono eccezionale l'artigianato italiano.",
        'Dalla scelta dei materiali alle rifiniture, ogni creazione riflette la nostra convinzione che il vero lusso non riguarda solo ciò che realizziamo, ma anche le persone e i valori che ci sono dietro.',
      ] },
    ],
    storyLink: 'Leggi la storia di ANOINTED',
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
      <section className="fil-hero" style={{ position: 'relative', overflow: 'hidden',
        height: '70vh', minHeight: '460px',
        background: 'linear-gradient(160deg, #3a2e2b 0%, #5d4d42 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', textAlign: 'center', padding: '0 1.5rem', paddingTop: '64px',
      }}>
        <div className="fil-hero-photo" aria-hidden="true" />
        <div className="fil-hero-shade" aria-hidden="true" />
        <div className="fil-hero-blur" aria-hidden="true" />
        <style>{`
          .fil-hero-photo { position: absolute; inset: 0; z-index: 0; background: url('/images/about/hero-filiera-mobile.jpg') center 42%/cover; }
          .fil-hero-shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(20,14,12,0.75) 0%, rgba(20,14,12,0.6) 25%, rgba(20,14,12,0.6) 100%); }
          .fil-hero-blur {
            position: absolute; top: 0; left: 0; right: 0; height: 130px; z-index: 1; pointer-events: none;
            -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
            -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 45%, transparent 100%); mask-image: linear-gradient(180deg, #000 0%, #000 45%, transparent 100%);
          }
          .fil-hero > h1, .fil-hero > p { position: relative; z-index: 2; }
          @media (min-width: 768px) {
            .fil-hero-photo { background: url('/images/about/hero-filiera.jpg') center 4%/cover; }
          }
        `}</style>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 300, color: '#f1eae4', lineHeight: 1.15, margin: '0 0 1.5rem', maxWidth: '720px' }}>
          {t.heroTitle1}<br />
          <em style={{ fontStyle: 'italic', color: '#c1a99a' }}>{t.heroTitle2}</em>
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.8, color: 'rgba(241,234,228,0.6)', maxWidth: '500px', margin: 0 }}>
          {t.heroBody}
        </p>
      </section>

      <Intro body={t.introBody} />
      <Mill t={t} />
      {t.blocks.map((b, i) => <TextBlock key={i} {...b} foto={i === 0 ? { src: '/images/about/cariaggi-seta.jpg', alt: t.silkAlt } : undefined} />)}

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

function Intro({ body }: { body: string[] }) {
  const { ref, visible } = useVisible()
  return (
    <section ref={ref} style={{ background: '#f1eae4', padding: '6rem 1.5rem 3rem' }}>
      <div style={{
        maxWidth: '680px', margin: '0 auto', textAlign: 'center',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}>
        {body.map((p, i) => (
          <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: i === 1 ? '16px' : '14px', fontStyle: i === 1 ? 'italic' : 'normal', lineHeight: 1.9, color: '#5d4d42', margin: '0 0 1.1rem' }}>{p}</p>
        ))}
      </div>
    </section>
  )
}

function Mill({ t }: { t: typeof CONTENT['en'] }) {
  const { ref, visible } = useVisible()
  return (
    <section ref={ref} style={{ background: '#3a2e2b', padding: '6rem 1.5rem' }}>
      <div className="fil-wrap" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flow-root' }}>
        <div className="fil-photo" style={{
          float: 'left', width: 'min(45%, 480px)', margin: '0 clamp(1.5rem, 3vw, 3rem) 1.5rem 0',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>
          <div style={{ position: 'relative', aspectRatio: '715 / 520', overflow: 'hidden' }}>
            <Image src={t.slides[0].src} alt={t.slides[0].alt} fill sizes="(max-width: 767px) 90vw, 480px" style={{ objectFit: 'cover' }} />
            <LogoCariaggi />
          </div>
        </div>
        <div className="fil-text" style={{
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
        }}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300, color: '#f1eae4', margin: '0 0 1.75rem', lineHeight: 1.2 }}>{t.millTitle}</h2>
          {t.millBlocks.map((b, i) => (
            <div key={i} style={{ marginBottom: '1.75rem', clear: i > 0 ? 'both' : undefined }}>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', fontWeight: 500, color: '#c1a99a', margin: '0 0 0.9rem' }}>{b.h.toUpperCase()}</h3>
              {b.p.map((p, j) => (
                <p key={j} style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'rgba(241,234,228,0.65)', margin: '0 0 0.9rem' }}>{p}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="fil-facts" style={{
          clear: 'both', display: 'flex', flexDirection: 'column', gap: '1.1rem', paddingTop: '1rem',
          opacity: visible ? 1 : 0, transition: 'opacity 0.9s ease 0.3s',
        }}>
          {t.facts.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', borderTop: '1px solid rgba(241,234,228,0.1)', paddingTop: '1rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.3rem', fontWeight: 300, color: '#f1eae4', minWidth: '9rem' }}>{f.value}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.1em', color: '#c1a99a' }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .fil-wrap { display: flex !important; flex-direction: column; }
          .fil-text { order: 1; }
          .fil-photo { order: 2; float: none !important; width: 100% !important; margin: 0.5rem 0 2rem !important; }
          .fil-facts { order: 3; }
        }
      `}</style>
    </section>
  )
}

function TextBlock({ title, p, bg, foto }: { label?: string; title: string; p: string[]; bg: string; foto?: { src: string; alt: string } }) {
  const { ref, visible } = useVisible()
  const anim = {
    opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: 'opacity 0.9s ease, transform 0.9s ease',
  } as const
  const testo = (
    <>
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300, color: '#3a2e2b', lineHeight: 1.25, margin: '0 0 1.75rem' }}>{title}</h2>
      {p.map((x, i) => (
        <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.9, color: '#5d4d42', margin: '0 0 1.1rem' }}>{x}</p>
      ))}
    </>
  )
  if (!foto) {
    return (
      <section ref={ref} style={{ background: bg, padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', ...anim }}>{testo}</div>
      </section>
    )
  }
  // Con foto: foto a destra, testo a sinistra che prosegue sotto la foto; su mobile la foto va dopo il testo
  return (
    <section ref={ref} style={{ background: bg, padding: '6rem 1.5rem' }}>
      <div className="fil-wrap2" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flow-root', ...anim }}>
        <div className="fil-photo2" style={{ float: 'right', width: 'min(45%, 480px)', margin: '0 0 1.5rem clamp(1.5rem, 3vw, 3rem)' }}>
          <div style={{ position: 'relative', aspectRatio: '715 / 520', overflow: 'hidden' }}>
            <Image src={foto.src} alt={foto.alt} fill sizes="(max-width: 767px) 90vw, 480px" style={{ objectFit: 'cover' }} />
          </div>
        </div>
        <div className="fil-text2">{testo}</div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .fil-wrap2 { display: flex !important; flex-direction: column; }
          .fil-text2 { order: 1; }
          .fil-photo2 { order: 2; float: none !important; width: 100% !important; margin: 0.5rem 0 0 !important; }
        }
      `}</style>
    </section>
  )
}

// Etichetta sulla foto: nome del materiale nel font del marchio (Dallas) e, dove corretto, il logo Cariaggi in piccolo.
function LogoCariaggi() {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, padding: '1.6rem 1.25rem 1rem', pointerEvents: 'none',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
      background: 'linear-gradient(0deg, rgba(241,234,228,0.7) 0%, rgba(241,234,228,0) 100%)',
    }}>
      <Image src="/images/about/cariaggi-logo.png" alt="Cariaggi" width={365} height={65} style={{ height: '15px', width: 'auto', opacity: 0.9 }} />
    </div>
  )
}
