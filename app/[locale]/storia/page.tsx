'use client'

import ValoriStack from '@/components/ValoriStack'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'

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

export default function StoriaPage() {
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
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.28em', color: '#c1a99a', margin: '0 0 2rem' }}>
          — OUR STORY —
        </p>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, color: '#f1eae4', lineHeight: 1.15, margin: '0 0 1.5rem', maxWidth: '700px' }}>
          Anointed is not just a brand.<br />
          <em style={{ fontStyle: 'italic', color: '#c1a99a' }}>It is a reminder.</em>
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.8, color: 'rgba(241,234,228,0.6)', maxWidth: '480px', margin: 0 }}>
          A reminder that every woman&apos;s identity is not defined by the world, but by calling.
        </p>
      </section>

      {/* CAP 1 — L'ORIGINE */}
      <Chapter
        label="01 — THE ORIGIN"
        title="Chosen and set apart."
        body="The name Anointed comes from the biblical meaning of being chosen — selected with purpose and set apart for something greater. It is not just a word. It is an identity. Every woman who wears Anointed carries this truth with her: she is not ordinary. She is appointed."
        imageRight={false}
      />

      {/* CAP 2 — LA MISSIONE */}
      <Chapter
        label="02 — THE MISSION"
        title="We design with purpose."
        body="Anointed is more than clothing. It is a statement of identity, strength and authority. Inspired by the inner power of women today, every piece is designed with intention — balancing elegance, structure and refinement. Anointed transforms clothing into a symbol of purpose, confidence and lasting impact."
        imageRight={true}
        dark
      />

      {/* CAP 3 — I VALORI */}
      <ValoriStack />

      {/* CAP 4 — SOFIA */}
      <section style={{ background: '#3a2e2b', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <SofiaSection />
        </div>
      </section>

      {/* CTA finale */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center', background: '#f1eae4' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 1.5rem' }}>
          — YOU ARE APPOINTED —
        </p>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 2.5rem', lineHeight: 1.2 }}>
          Ready to wear your purpose?
        </h2>
        <Link href="/prodotti" style={{
          fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em',
          background: '#3a2e2b', color: '#f1eae4', textDecoration: 'none',
          padding: '0.85rem 2.5rem', borderRadius: '1px', display: 'inline-block',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#5d4d42'}
        onMouseLeave={e => e.currentTarget.style.background = '#3a2e2b'}>
          DISCOVER THE COLLECTION
        </Link>
      </section>

    </main>
  )
}

function Chapter({ label, title, body, imageRight, dark }: {
  label: string; title: string; body: string; imageRight: boolean; dark?: boolean
}) {
  const { ref, visible } = useVisible()

  return (
    <div ref={ref} style={{ background: dark ? '#3a2e2b' : '#f1eae4', padding: '6rem 1.5rem' }}>
      <div className="chapter-grid" style={{
        maxWidth: '1100px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center',
        direction: imageRight ? 'rtl' : 'ltr',
      }}>
        {/* Testo */}
        <div style={{
          direction: 'ltr',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#c1a99a', margin: '0 0 1.25rem' }}>
            {label}
          </p>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300, lineHeight: 1.2, color: dark ? '#f1eae4' : '#3a2e2b', margin: '0 0 1.5rem' }}>
            {title}
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: dark ? 'rgba(241,234,228,0.65)' : '#5d4d42', margin: 0, maxWidth: '440px' }}>
            {body}
          </p>
        </div>

        {/* Immagine placeholder */}
        <div style={{
          direction: 'ltr',
          aspectRatio: '4/5',
          background: dark
            ? 'rgba(241,234,228,0.05)'
            : 'linear-gradient(135deg, #e8d2c3 0%, #c1a99a 100%)',
          borderRadius: '2px',
          border: dark ? '1px solid rgba(241,234,228,0.1)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.18em', color: dark ? 'rgba(241,234,228,0.2)' : 'rgba(58,46,43,0.2)' }}>
            EDITORIAL PHOTO
          </p>
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

function ValoriSection() {
  const { ref, visible } = useVisible()

  const valori = [
    { num: '01', title: 'PURPOSEFUL', body: 'Every design reminds a woman of her direction, her strength and her identity.' },
    { num: '02', title: 'EMPOWERING', body: 'Clothing becomes a daily reminder that a woman is worthy, strong and capable of rising again.' },
    { num: '03', title: 'ELEVATING', body: 'Fashion as a tool of renewal — a way to rediscover confidence, beauty and inner strength.' },
    { num: '04', title: 'AUTHENTIC', body: 'We celebrate women who remain true to who they are. Authenticity is the foundation of real influence.' },
    { num: '05', title: 'AUTHORITATIVE', body: 'Elegance that does not need to ask for permission. Women who walk into rooms with presence.' },
  ]

  return (
    <div ref={ref}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 1rem', textAlign: 'center' }}>
        03 — OUR VALUES
      </p>
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300, color: '#3a2e2b', textAlign: 'center', margin: '0 0 4rem' }}>
        What we stand for.
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {valori.map((v, i) => (
          <div key={v.num} style={{
            display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: '2rem',
            padding: '2rem 0', alignItems: 'start',
            borderTop: '1px solid rgba(193,169,154,0.25)',
            borderBottom: i === valori.length - 1 ? '1px solid rgba(193,169,154,0.25)' : 'none',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
          }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.16em', color: '#c1a99a', margin: 0 }}>{v.num}</p>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, letterSpacing: '0.12em', color: '#3a2e2b', margin: 0 }}>{v.title}</h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.75, color: '#5d4d42', margin: 0 }}>{v.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SofiaSection() {
  const { ref, visible } = useVisible()

  return (
    <div ref={ref}>
      <div className="sofia-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>

        {/* Foto placeholder */}
        <div style={{
          aspectRatio: '3/4',
          background: 'rgba(241,234,228,0.06)',
          border: '1px solid rgba(241,234,228,0.1)',
          borderRadius: '2px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(241,234,228,0.2)' }}>
            SOFIA PHOTO
          </p>
        </div>

        {/* Testo */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#c1a99a', margin: '0 0 1.25rem' }}>
            04 — THE FOUNDER
          </p>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300, color: '#f1eae4', margin: '0 0 1.5rem', lineHeight: 1.2 }}>
            Sofia Meneghetti
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'rgba(241,234,228,0.6)', margin: '0 0 1.5rem', maxWidth: '420px' }}>
            [Sofia&apos;s personal story goes here — her journey, her calling, why she created Anointed and what drives her every day.]
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'rgba(241,234,228,0.6)', margin: 0, maxWidth: '420px' }}>
            [Her vision for the brand and the women she designs for.]
          </p>
        </div>
      </div>

      <style>{`
        .sofia-grid { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 767px) {
          .sofia-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </div>
  )
}
