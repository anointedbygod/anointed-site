'use client'
import { useRef, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const TR = {
  en: { eyebrow: 'You are', quote: 'You are not ordinary.', quote2: 'You are appointed.' },
  it: { eyebrow: 'Tu sei', quote: 'Non sei ordinaria.', quote2: 'Sei nominata.' },
}

export default function EditorialBanner() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const t = TR[pathname.startsWith('/it') ? 'it' : 'en']

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} style={{ background: '#3a2e2b', padding: '8rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(193,169,154,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.28em', color: '#c1a99a', margin: '0 0 2.5rem', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}>— {t.eyebrow.toUpperCase()} —</p>
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 300, letterSpacing: '0.04em', color: '#f1eae4', lineHeight: 1.15, margin: '0 0 1.5rem', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 1s ease 0.15s, transform 1s ease 0.15s' }}>{t.quote}</h2>
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.04em', color: '#c1a99a', lineHeight: 1.15, margin: 0, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 1s ease 0.3s, transform 1s ease 0.3s' }}>{t.quote2}</h2>
    </section>
  )
}
