'use client'

import { useRef, useEffect, useState } from 'react'

const VALORI = [
  { num: '01', title: 'PURPOSEFUL', body: 'Every design reminds a woman of her direction, her strength and her identity. We believe every woman carries a unique calling.' },
  { num: '02', title: 'EMPOWERING', body: 'Clothing becomes a daily reminder that a woman is worthy, strong and capable of rising again. Anointed is a symbol of confidence and self-worth.' },
  { num: '03', title: 'ELEVATING', body: 'Fashion as a tool of renewal — a way to rediscover confidence, beauty and inner strength. Anointed exists to inspire women to grow and rise.' },
  { num: '04', title: 'AUTHENTIC', body: 'We celebrate women who remain true to who they are. Our designs encourage clarity of identity, integrity and confidence.' },
  { num: '05', title: 'AUTHORITATIVE', body: 'Elegance that does not need to ask for permission. Women who walk into rooms with presence, who lead, build and influence.' },
]

export default function ValoriStack() {
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
  const activeFloat = progress * (VALORI.length - 0.001)
  const activeIndex = Math.floor(activeFloat)
  const cardProgress = activeFloat - activeIndex

  return (
    <div ref={containerRef} style={{ height: `${VALORI.length * 120 + 100}vh`, position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#f1eae4', overflow: 'hidden', padding: '0 1.5rem',
      }}>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.75rem', textAlign: 'center' }}>
          03 — OUR VALUES
        </p>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 2vw, 2rem)', fontWeight: 300, color: '#3a2e2b', textAlign: 'center', margin: '0 0 3rem' }}>
          What we stand for.
        </h2>

        {/* Stack */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '520px', height: '320px' }}>
          {VALORI.map((v, i) => {
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
            let zIndex = VALORI.length - i

            if (isBehind) {
              // Card ancora nel mazzo — impilate sotto
              const depth = Math.min(diff, 3)
              translateY = depth * 12
              scale = 1 - depth * 0.04
              opacity = Math.max(0, 1 - (depth - 1) * 0.4)
              zIndex = VALORI.length - i
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
              zIndex = VALORI.length + 1
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
                  {VALORI.map((_, j) => (
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
          SCROLL TO DISCOVER
        </p>
      </div>
    </div>
  )
}
