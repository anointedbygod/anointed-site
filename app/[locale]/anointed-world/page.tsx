'use client'

import { useRef, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import WorldCard, { WORLD_CARD_CSS } from '@/components/world/WorldCard'
import { VOCI_WORLD, dividiVoci, voceInEvidenza, copertina, ETICHETTE_TIPO, ETICHETTE_UI, type TipoWorld, type VoceWorld } from '@/lib/anointed-world'

const HERO = {
  en: {
    title: ['Where the brand', 'comes to life.'],
    body: 'Anointed is more than what we wear. It is a growing world of experiences, conversations, collaborations and meaningful encounters. From events and speaking engagements to selected partnerships and special projects, Anointed World brings the vision of the brand into real spaces — connecting women, ideas and opportunities.',
  },
  it: {
    title: ['Dove il brand', 'prende vita.'],
    body: 'Anointed è più di ciò che indossiamo. È un mondo in crescita fatto di esperienze, conversazioni, collaborazioni e incontri significativi. Da eventi e interventi pubblici a partnership selezionate e progetti speciali, Anointed World porta la visione del brand in spazi reali — connettendo donne, idee e opportunità.',
  },
}

// Soglie: gli strumenti dell'archivio compaiono da soli quando servono
const PER_PAGINA = 9
const MIN_PER_FILTRI = 8

export default function AnointedWorldPage() {
  const pathname = usePathname()
  const locale = (pathname?.startsWith('/it') ? 'it' : 'en') as 'en' | 'it'
  const ui = ETICHETTE_UI[locale]
  const heroPhotoRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)

  // Le date si ricalcolano nel browser (la pagina è generata al deploy)
  const [oggi, setOggi] = useState(0)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- aggiorna in/out "in arrivo" con la data del browser
  useEffect(() => { setOggi(Date.now()) }, [])
  const { evidenza, inArrivo, archivio } = useMemo(() => {
    void oggi
    const ev = voceInEvidenza()
    const { inProgramma, passate } = dividiVoci()
    return {
      evidenza: ev,
      inArrivo: inProgramma.filter(v => v !== ev),
      archivio: passate.filter(v => v !== ev),
    }
  }, [oggi])

  const [filtro, setFiltro] = useState<TipoWorld | 'tutti'>('tutti')
  const [visibili, setVisibili] = useState(PER_PAGINA)
  const tipiPresenti = Array.from(new Set(archivio.map(v => v.tipo)))
  const mostraFiltri = archivio.length >= MIN_PER_FILTRI && tipiPresenti.length >= 2
  const filtrati = filtro === 'tutti' ? archivio : archivio.filter(v => v.tipo === filtro)
  const mostrati = filtrati.slice(0, visibili)
  const anni = Array.from(new Set(VOCI_WORLD.map(v => v.iso.slice(0, 4))))
  const dividiPerAnno = anni.length >= 2

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo(heroPhotoRef.current,
        { filter: 'grayscale(100%) brightness(0.72) contrast(1.05)' },
        { filter: 'grayscale(0%) brightness(1) contrast(1)', ease: 'none', scrollTrigger: { trigger: heroSectionRef.current, start: 'top top', end: 'bottom top', scrub: true } }
      )
    }, heroSectionRef)
    return () => ctx.revert()
  }, [])

  const titoloSezione = (testo: string) => (
    <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.3rem, 2vw, 1.8rem)', fontWeight: 300, color: '#3a2e2b', textAlign: 'center', margin: '0 0 2.5rem' }}>{testo}</h2>
  )

  return (
    <main style={{ background: '#f1eae4' }}>
      <style>{WORLD_CARD_CSS + PAGE_CSS}</style>

      {/* HERO */}
      <section ref={heroSectionRef} style={{ minHeight: '62vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '0 1.5rem', paddingTop: '64px' }}>
        <div ref={heroPhotoRef} style={{ position: 'absolute', inset: 0, zIndex: 0, background: "url('/images/about/stage.jpg') center 10%/cover", animation: 'awKenBurns 26s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(20,14,12,0.7) 0%, rgba(20,14,12,0.35) 45%, rgba(20,14,12,0.75) 100%)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '130px', zIndex: 1, pointerEvents: 'none', WebkitBackdropFilter: 'blur(14px)', backdropFilter: 'blur(14px)', WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 45%, transparent 100%)', maskImage: 'linear-gradient(180deg, #000 0%, #000 45%, transparent 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '4rem 0 3rem' }}>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 300, color: '#f1eae4', lineHeight: 1.15, margin: '0 0 1.5rem', maxWidth: '700px' }}>
            {HERO[locale].title[0]}<br /><em style={{ fontStyle: 'italic', color: '#c1a99a' }}>{HERO[locale].title[1]}</em>
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.9, color: 'rgba(241,234,228,0.65)', maxWidth: '540px', margin: '0 auto' }}>{HERO[locale].body}</p>
        </div>
      </section>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="aw-glow aw-glow-1" /><div className="aw-glow aw-glow-2" />
        <div style={{ position: 'relative', maxWidth: '1120px', margin: '0 auto', padding: '5rem 1.5rem 7rem' }}>

          {/* IN EVIDENZA */}
          {evidenza && (
            <section style={{ marginBottom: '5rem' }}>
              <InEvidenza v={evidenza} locale={locale} />
            </section>
          )}

          {/* IN ARRIVO */}
          {inArrivo.length > 0 && (
            <section style={{ marginBottom: '5rem' }}>
              {titoloSezione(ui.inArrivo)}
              <div className="aw-grid">{inArrivo.map(v => <WorldCard key={v.slug} v={v} locale={locale} />)}</div>
            </section>
          )}

          {/* ARCHIVIO */}
          {archivio.length > 0 && (
            <section>
              {titoloSezione(ui.archivio)}
              {mostraFiltri && (
                <div className="aw-filtri" role="tablist">
                  {(['tutti', ...tipiPresenti] as const).map(f => (
                    <button key={f} role="tab" aria-selected={filtro === f} className={filtro === f ? 'on' : ''} onClick={() => { setFiltro(f); setVisibili(PER_PAGINA) }}>
                      {f === 'tutti' ? ui.tutti : ETICHETTE_TIPO[locale][f]}
                    </button>
                  ))}
                </div>
              )}
              {dividiPerAnno
                ? anni.sort((a, b) => b.localeCompare(a)).map(anno => {
                    const diAnno = mostrati.filter(v => v.iso.startsWith(anno))
                    if (!diAnno.length) return null
                    return (
                      <div key={anno}>
                        <p className="aw-anno"><span>{anno}</span></p>
                        <div className="aw-grid">{diAnno.map(v => <WorldCard key={v.slug} v={v} locale={locale} />)}</div>
                      </div>
                    )
                  })
                : <div className="aw-grid">{mostrati.map(v => <WorldCard key={v.slug} v={v} locale={locale} />)}</div>}
              {filtrati.length > visibili && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                  <button className="aw-btn" onClick={() => setVisibili(n => n + PER_PAGINA)}>{ui.mostraAltri}</button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  )
}

function InEvidenza({ v, locale }: { v: VoceWorld; locale: 'it' | 'en' }) {
  const t = v[locale]
  const img = copertina(v, locale)
  return (
    <Link href={`/${locale}/anointed-world/${v.slug}`} className="aw-ev">
      <div className="aw-ev-img">
        {img && <Image src={img} alt={t.imageAlt || t.gallery?.[0]?.alt || t.title} fill sizes="(max-width: 767px) 92vw, 520px" style={{ objectFit: 'cover', objectPosition: v.coverPosition || 'center 25%' }} priority />}
      </div>
      <div className="aw-ev-body">
        <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', fontWeight: 300, lineHeight: 1.25, color: '#3a2e2b', margin: '0 0 1.1rem' }}>{t.title}</h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: '#5d4d42', margin: '0 0 1.75rem' }}>{t.teaser}</p>
        <span className="aw-btn">{ETICHETTE_UI[locale].leggi} →</span>
      </div>
    </Link>
  )
}

const PAGE_CSS = `
@keyframes awKenBurns { 0% { transform: scale(1); } 100% { transform: scale(1.09); } }
.aw-glow { position: absolute; pointer-events: none; filter: blur(40px); }
.aw-glow-1 { top: -5%; left: -10%; width: 45%; height: 45%; background: radial-gradient(circle, rgba(193,169,154,0.35) 0%, rgba(193,169,154,0) 70%); }
.aw-glow-2 { bottom: -10%; right: -10%; width: 50%; height: 50%; background: radial-gradient(circle, rgba(216,192,175,0.4) 0%, rgba(216,192,175,0) 70%); }
.aw-eyebrow { font-family: Inter, sans-serif; font-size: 10.5px; letter-spacing: .22em; text-transform: uppercase; color: #8a7a70; text-align: center; margin: 0 0 1.5rem; }
.aw-ev { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); text-decoration: none; background: rgba(255,255,255,0.45); border: 1px solid rgba(193,169,154,0.3); border-radius: 20px; overflow: hidden; box-shadow: 0 14px 40px rgba(58,46,43,0.08); transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s ease; }
.aw-ev:hover { transform: translateY(-4px); box-shadow: 0 26px 60px rgba(58,46,43,0.15); }
.aw-ev-img { position: relative; min-height: 420px; background: #e8d2c3; }
.aw-ev-body { padding: clamp(2rem, 4vw, 3.25rem); display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
.aw-pill { display: inline-block; font-size: 10.5px; letter-spacing: .1em; font-weight: 500; color: #3a2e2b; background: rgba(193,169,154,0.28); border: 1px solid rgba(193,169,154,0.4); padding: .35rem .8rem; border-radius: 100px; margin-right: .5rem; }
.aw-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 340px)); justify-content: center; gap: 1.75rem; }
.aw-filtri { display: flex; justify-content: center; flex-wrap: wrap; gap: .5rem; margin: -1rem 0 2.5rem; }
.aw-filtri button { font-family: Inter, sans-serif; font-size: 11px; letter-spacing: .1em; color: #5d4d42; background: transparent; border: 1px solid rgba(193,169,154,0.5); padding: .5rem 1.1rem; border-radius: 100px; cursor: pointer; transition: all .25s; }
.aw-filtri button.on, .aw-filtri button:hover { background: #3a2e2b; border-color: #3a2e2b; color: #f1eae4; }
.aw-anno { display: flex; align-items: center; gap: 1rem; margin: 2.5rem 0 1.5rem; font-family: Inter, sans-serif; font-size: 12px; letter-spacing: .2em; color: #8a7a70; }
.aw-anno::before, .aw-anno::after { content: ''; flex: 1; height: 1px; background: rgba(193,169,154,0.4); }
.aw-btn { display: inline-block; font-family: Inter, sans-serif; font-size: 10.5px; letter-spacing: .14em; font-weight: 500; color: #f1eae4; background: #3a2e2b; border: none; text-decoration: none; padding: .85rem 1.8rem; border-radius: 100px; cursor: pointer; transition: background .25s; }
.aw-btn:hover { background: #5d4d42; }
@media (max-width: 1100px) { .aw-grid { grid-template-columns: repeat(2, minmax(0, 340px)); } }
@media (max-width: 767px) {
  .aw-ev { grid-template-columns: 1fr; }
  .aw-ev-img { min-height: 0; aspect-ratio: 4 / 5; }
  .aw-grid { grid-template-columns: 1fr; }
}
`
