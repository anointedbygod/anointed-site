'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [closing, setClosing] = useState(false)
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'

  useEffect(() => {
    // Non mostrare se già visto
    if (localStorage.getItem('anointed_popup_seen')) return

    // Appare dopo 40% di scroll
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (scrolled > 0.4) {
        setVisible(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function close() {
    setClosing(true)
    setTimeout(() => {
      setVisible(false)
      setClosing(false)
      localStorage.setItem('anointed_popup_seen', '1')
    }, 300)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, tipo: 'popup' }),
    })
    setSent(true)
    localStorage.setItem('anointed_popup_seen', '1')
    setTimeout(() => close(), 3000)
  }

  if (!visible) return null

  const title = locale === 'it' ? 'Un regalo per te.' : 'A gift for you.'
  const sub = locale === 'it'
    ? 'Iscriviti e ricevi il 10% di sconto sul tuo primo ordine.'
    : 'Subscribe and receive 10% off your first order.'
  const placeholder = locale === 'it' ? 'La tua email' : 'Your email'
  const cta = locale === 'it' ? 'OTTIENI IL 10%' : 'GET 10% OFF'
  const skip = locale === 'it' ? 'No grazie' : 'No thanks'
  const thanks = locale === 'it' ? 'Benvenuta nel cerchio. Il tuo codice WELCOME10 è in arrivo.' : 'Welcome to the circle. Your code WELCOME10 is on its way.'

  return (
    <>
      {/* Overlay */}
      <div onClick={close} style={{
        position: 'fixed', inset: 0, background: 'rgba(58,46,43,0.5)',
        backdropFilter: 'blur(4px)', zIndex: 100,
        opacity: closing ? 0 : 1, transition: 'opacity 0.3s ease',
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: closing ? 'translate(-50%, -48%) scale(0.97)' : 'translate(-50%, -50%) scale(1)',
        zIndex: 101, width: '90%', maxWidth: '480px',
        background: '#f1eae4', borderRadius: '4px',
        overflow: 'hidden',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        boxShadow: '0 24px 64px rgba(58,46,43,0.25)',
      }}>
        {/* Header espresso */}
        <div style={{ background: '#3a2e2b', padding: '2.5rem 2rem', textAlign: 'center', position: 'relative' }}>
          <button onClick={close} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,234,228,0.4)', fontSize: '18px', lineHeight: 1 }}>✕</button>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.75rem' }}>— ANOINTED —</p>
          <div style={{ width: '48px', height: '1px', background: 'rgba(193,169,154,0.3)', margin: '0 auto' }} />
        </div>

        {/* Body */}
        <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          {sent ? (
            <>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 1rem' }}>✓</p>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 300, color: '#3a2e2b', margin: '0 0 1rem', lineHeight: 1.3 }}>
                {locale === 'it' ? 'Grazie!' : 'Thank you!'}
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.8, color: '#5d4d42', margin: 0 }}>{thanks}</p>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '26px', fontWeight: 300, color: '#3a2e2b', margin: '0 0 1rem', lineHeight: 1.3 }}>{title}</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.8, color: '#5d4d42', margin: '0 0 2rem' }}>{sub}</p>

              {/* Codice anteprima */}
              <div style={{ background: '#3a2e2b', borderRadius: '2px', padding: '0.75rem 1.5rem', display: 'inline-block', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 700, color: '#f1eae4', margin: 0, letterSpacing: '0.1em' }}>WELCOME10</p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={placeholder}
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', background: 'white', border: '1px solid rgba(193,169,154,0.4)', color: '#3a2e2b', padding: '0.85rem 1rem', outline: 'none', borderRadius: '2px', width: '100%', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#3a2e2b'}
                  onBlur={e => e.target.style.borderColor = 'rgba(193,169,154,0.4)'}
                />
                <button type="submit" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500, background: '#3a2e2b', color: '#f1eae4', border: 'none', padding: '1rem', borderRadius: '2px', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#5d4d42'}
                  onMouseLeave={e => e.currentTarget.style.background = '#3a2e2b'}>
                  {cta}
                </button>
              </form>

              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(193,169,154,0.6)', marginTop: '1rem', padding: '0.25rem' }}>
                {skip}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
