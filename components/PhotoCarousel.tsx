'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'

export interface Foto { src: string; alt: string; position?: string; overlay?: ReactNode }

// Carosello discreto: scorre da solo (si ferma al passaggio del mouse, con il focus e a scheda
// nascosta; niente autoplay se l'utente preferisce meno animazioni), frecce sottili che appaiono
// al passaggio, puntini piccoli, swipe su touch. Scorrimento continuo con clone della prima foto.
export default function PhotoCarousel({ foto, prev, next, intervalMs = 5500, ratio = '4 / 3', sizes = '(max-width: 767px) 90vw, 760px', tone = 'dark' }: {
  foto: Foto[]; prev: string; next: string; intervalMs?: number; ratio?: string; sizes?: string; tone?: 'dark' | 'light'
}) {
  // tone='light' per foto chiare: frecce e puntini scuri
  const chiaro = tone === 'light'
  const n = foto.length
  const slides = [...foto, foto[0]]
  const [i, setI] = useState(0)
  const [anim, setAnim] = useState(true)
  const [pausa, setPausa] = useState(false)
  const [ridotto, setRidotto] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const touchX = useRef<number | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setRidotto(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])

  const avanti = () => { if (i > n - 1) return; setAnim(true); setI(x => x + 1) }
  const indietro = () => {
    if (i > n - 1) return
    if (i === 0) {
      setAnim(false); setI(n)
      requestAnimationFrame(() => requestAnimationFrame(() => { setAnim(true); setI(n - 1) }))
    } else { setAnim(true); setI(x => x - 1) }
  }
  const vai = (k: number) => { setAnim(true); setI(k) }

  useEffect(() => {
    if (pausa || ridotto || n < 2) return
    const t = setInterval(() => { if (!document.hidden) avanti() }, intervalMs)
    return () => clearInterval(t)
  })

  if (n === 0) return null
  const attivo = i % n

  return (
    <div className="pc" role="group" aria-roledescription="carousel"
      onMouseEnter={() => setPausa(true)} onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)} onBlur={() => setPausa(false)}
      style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', background: 'rgba(58,46,43,0.06)' }}>
      <div
        onTouchStart={e => { touchX.current = e.touches[0].clientX; setPausa(true) }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - (touchX.current ?? e.changedTouches[0].clientX)
          touchX.current = null; setPausa(false)
          if (Math.abs(dx) > 40) (dx < 0 ? avanti : indietro)()
        }}
        onTransitionEnd={() => { if (i === n) { setAnim(false); setI(0) } }}
        style={{ display: 'flex', transform: `translateX(-${i * 100}%)`, transition: anim ? 'transform 0.7s cubic-bezier(0.22,0.8,0.24,1)' : 'none' }}>
        {slides.map((f, k) => (
          <div key={k} aria-hidden={k !== attivo && !(k === n && attivo === 0)} style={{ position: 'relative', flex: '0 0 100%', aspectRatio: ratio }}>
            <Image src={f.src} alt={k === n ? '' : f.alt} fill sizes={sizes}
              style={{ objectFit: 'cover', objectPosition: f.position || '50% 50%' }} />
            {f.overlay}
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <button type="button" className="pc-arrow" aria-label={prev} onClick={indietro} style={{ ...frecciaStile, left: '12px' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className="pc-arrow" aria-label={next} onClick={avanti} style={{ ...frecciaStile, right: '12px' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px' }}>
            {foto.map((_, k) => (
              <button key={k} type="button" aria-label={`${k + 1} / ${n}`} aria-current={k === attivo} onClick={() => vai(k)}
                style={{ width: k === attivo ? '16px' : '6px', height: '6px', borderRadius: '3px', border: 'none', padding: 0, cursor: 'pointer', background: chiaro ? (k === attivo ? 'rgba(58,46,43,0.85)' : 'rgba(58,46,43,0.3)') : (k === attivo ? 'rgba(241,234,228,0.95)' : 'rgba(241,234,228,0.5)'), transition: 'width 0.3s, background 0.3s' }} />
            ))}
          </div>
        </>
      )}
      <style>{`
        .pc-arrow { opacity: 0; transition: opacity 0.25s, background 0.25s; }
        .pc:hover .pc-arrow, .pc:focus-within .pc-arrow { opacity: 1; }
        .pc-arrow:hover { background: rgba(241,234,228,0.95) !important; }
        .pc-arrow { box-shadow: 0 1px 8px rgba(58,46,43,0.18); }
        @media (hover: none) { .pc-arrow { opacity: 0.8; } }
      `}</style>
    </div>
  )
}

const frecciaStile: React.CSSProperties = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '34px', height: '34px', borderRadius: '50%',
  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(241,234,228,0.78)', color: '#3a2e2b', backdropFilter: 'blur(4px)', padding: 0,
}
