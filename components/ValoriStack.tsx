'use client'

import { useRef, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const VALORI = {
  en: [
    { num: '01', title: 'PURPOSEFUL', body: 'Every piece begins with intention. We create more than clothing: we create reminders of purpose, identity and direction.' },
    { num: '02', title: 'REFINED', body: 'We believe in thoughtful design, timeless elegance and attention to detail. Nothing excessive, nothing accidental.' },
    { num: '03', title: 'DISTINCTIVE', body: 'ANOINTED is made for women who do not need to blend in. Individuality is not a statement — it is a way of being.' },
    { num: '04', title: 'AUTHENTIC', body: 'We value honesty, integrity and staying true to who you are, in what you wear and in how you live.' },
    { num: '05', title: 'ENDURING', body: 'We create with a long-term vision: pieces, ideas and values designed to remain relevant beyond a season.' },
  ],
  it: [
    { num: '01', title: 'CONSAPEVOLE', body: 'Ogni capo nasce da un’intenzione. Creiamo più che abbigliamento: creiamo promemoria di scopo, identità e direzione.' },
    { num: '02', title: 'RAFFINATA', body: 'Crediamo in un design curato, un’eleganza senza tempo e nell’attenzione al dettaglio. Niente di eccessivo, niente di casuale.' },
    { num: '03', title: 'DISTINTIVA', body: 'ANOINTED è pensato per donne che non hanno bisogno di passare inosservate. L’individualità non è una dichiarazione — è un modo di essere.' },
    { num: '04', title: 'AUTENTICA', body: 'Diamo valore all’onestà, all’integrità e al restare fedeli a chi sei, in ciò che indossi e in come vivi.' },
    { num: '05', title: 'DURATURA', body: 'Creiamo con una visione a lungo termine: capi, idee e valori pensati per restare rilevanti oltre una stagione.' },
  ],
} as const

const TEXT = {
  en: { heading: 'What we stand for.', scroll: 'SCROLL TO DISCOVER' },
  it: { heading: 'In cosa crediamo.', scroll: 'SCORRI PER SCOPRIRE' },
} as const

export default function ValoriStack() {
  const pathname = usePathname()
  const locale = (pathname?.startsWith('/it') ? 'it' : 'en') as 'en' | 'it'
  const valori = VALORI[locale]
  const t = TEXT[locale]

  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const total = containerRef.current.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const p = Math.max(0, Math.min(1, scrolled / total))
      setProgress(p)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Quante card sono "aperte" — progress 0→1 mappa su 0→5
  const activeFloat = progress * (valori.length - 0.001)

  return (
    <div ref={containerRef} style={{ height: `${valori.length * 120 + 100}vh`, position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#f1eae4', overflow: 'hidden', padding: '0 1.5rem',
      }}>

        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 2vw, 2rem)', fontWeight: 300, color: '#3a2e2b', textAlign: 'center', margin: '0 0 3rem' }}>
          {t.heading}
        </h2>

        {/* Stack */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '520px', height: '320px' }}>
          {valori.map((v, i) => {
            const diff = i - activeFloat
            const isBehind = diff > 0
            const isPast = diff < -1

            // Card attiva: diff tra -1 e 0
            // Card in arrivo: diff > 0
            // Card passata: diff < -1

            let translateY = 0
            let translateX = 0
            let rotate = 0
            let scale = 1
            let opacity = 1
            let zIndex = valori.length - i

            if (isBehind) {
              // Card ancora nel mazzo — impilate sotto
              const depth = Math.min(diff, 3)
              translateY = depth * 12
              scale = 1 - depth * 0.04
              opacity = Math.max(0, 1 - (depth - 1) * 0.4)
              zIndex = valori.length - i
            } else if (isPast) {
              // Card già sfogliata — vola via
              const gone = Math.min(-diff - 1, 1)
              translateX = gone * 120
              translateY = -gone * 40
              rotate = gone * 15
              opacity = 1 - gone
              zIndex = i
            } else {
              // Card corrente — transizione tra stack e via
              const p = -diff // 0 = in cima, 1 = sta andando via
              translateX = p * 120
              translateY = -p * 40
              rotate = p * 15
              opacity = 1
              zIndex = valori.length + 1
              scale = 1
            }

            return (
              <div
                key={v.num}
                style={{
                  position: 'absolute', inset: 0,
                  background: i % 2 === 0 ? '#3a2e2b' : '#f1eae4',
                  border: i % 2 === 0 ? 'none' : '1px solid rgba(193,169,154,0.3)',
                  borderRadius: '8px',
                  padding: '2.5rem',
                  transform: `translateX(${translateX}%) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: 'none',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  boxShadow: '0 8px 40px rgba(58,46,43,0.12)',
                  willChange: 'transform, opacity',
                }}
              >
                <div>
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '10px',
                    letterSpacing: '0.22em', margin: '0 0 1.25rem',
                    color: i % 2 === 0 ? '#c1a99a' : '#c1a99a',
                  }}>
                    {v.num}
                  </p>
                  <h3 style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                    fontWeight: 300, letterSpacing: '0.06em', margin: '0 0 1.5rem',
                    color: i % 2 === 0 ? '#f1eae4' : '#3a2e2b',
                  }}>
                    {v.title}
                  </h3>
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '14px',
                    lineHeight: 1.8, margin: 0,
                    color: i % 2 === 0 ? 'rgba(241,234,228,0.65)' : '#5d4d42',
                  }}>
                    {v.body}
                  </p>
                </div>

                {/* Progress indicator */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '2rem' }}>
                  {valori.map((_, j) => (
                    <div key={j} style={{
                      height: '2px', flex: 1, borderRadius: '1px',
                      background: j <= i
                        ? (i % 2 === 0 ? '#c1a99a' : '#3a2e2b')
                        : (i % 2 === 0 ? 'rgba(241,234,228,0.15)' : 'rgba(193,169,154,0.2)'),
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Scroll hint */}
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.2em',
          color: 'rgba(193,169,154,0.4)', marginTop: '2.5rem',
          opacity: progress < 0.05 ? 1 : 0, transition: 'opacity 0.4s',
        }}>
          {t.scroll}
        </p>
      </div>
    </div>
  )
}
