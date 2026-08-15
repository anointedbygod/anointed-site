'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Hero() {
  const [loaded, setLoaded] = useState(false)
  const t = useTranslations('hero')

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const ctaStyle: React.CSSProperties = {
    display: 'inline-block',
    fontFamily: 'Inter, sans-serif',
    fontSize: '10px',
    letterSpacing: '0.2em',
    color: '#f1eae4',
    textDecoration: 'none',
    border: '1px solid rgba(241,234,228,0.45)',
    padding: '0.85rem 2.5rem',
    borderRadius: '1px',
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 1s ease 0.45s, transform 1s ease 0.45s, border-color 0.3s, background 0.3s',
  }

  return (
    <section style={{
      position: 'relative', height: '100vh', minHeight: '600px',
      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #3a2e2b 0%, #5d4d42 60%, #3a2e2b 100%)',
        zIndex: 0,
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,22,20,0.35)', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 2rem', maxWidth: '800px' }}>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.28em',
          color: '#c1a99a', margin: '0 0 2rem',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>
          — ANOINTED —
        </p>

        <h1 style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
          fontWeight: 300, letterSpacing: '0.03em', lineHeight: 1.15,
          color: '#f1eae4', margin: '0 0 2.5rem',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
        }}>
          {t('line1')}<br />
          <em style={{ fontStyle: 'italic', fontWeight: 300 }}>{t('line2')}</em>
        </h1>

        <Link
          href="/en/prodotti"
          style={ctaStyle}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#f1eae4'
            e.currentTarget.style.background = 'rgba(241,234,228,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(241,234,228,0.45)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {t('cta')}
        </Link>
      </div>

      <div style={{
        position: 'absolute', bottom: '2.5rem', left: '50%',
        transform: 'translateX(-50%)', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        opacity: loaded ? 1 : 0, transition: 'opacity 1s ease 1s',
      }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.22em', color: 'rgba(241,234,228,0.5)', margin: 0 }}>
          SCROLL
        </p>
        <div style={{ width: '1px', height: '40px', background: 'rgba(241,234,228,0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', background: '#c1a99a', animation: 'scrollLine 1.8s ease-in-out infinite' }} />
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0% { height: 0%; transform: translateY(0); }
          50% { height: 100%; transform: translateY(0); }
          100% { height: 0%; transform: translateY(200%); }
        }
      `}</style>
    </section>
  )
}
