'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [closing, setClosing] = useState(false)
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'

  useEffect(() => {
    if (localStorage.getItem('anointed_popup_seen')) return
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (scrolled > 0.4) { setVisible(true); window.removeEventListener('scroll', handleScroll) }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function close() {
    setClosing(true)
    setTimeout(() => { setVisible(false); setClosing(false); localStorage.setItem('anointed_popup_seen', '1') }, 350)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    await fetch('/api/newsletter', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, tipo: 'popup' }),
    })
    setSent(true)
    localStorage.setItem('anointed_popup_seen', '1')
    setTimeout(() => close(), 3000)
  }

  if (!visible) return null

  const title = locale === 'it' ? 'Un regalo per te.' : 'A gift for you.'
  const sub = locale === 'it' ? 'Iscriviti e ottieni il 10% di sconto sul primo ordine.' : 'Subscribe and get 10% off your first order.'
  const placeholder = locale === 'it' ? 'La tua email' : 'Your email'
  const cta = locale === 'it' ? 'OTTIENI IL 10%' : 'GET 10% OFF'
  const skip = locale === 'it' ? 'No grazie' : 'No thanks'
  const thanksTitle = locale === 'it' ? 'Benvenuta.' : 'Welcome.'
  const thanksSub = locale === 'it' ? 'Il tuo codice WELCOME10 è in arrivo.' : 'Your code WELCOME10 is on its way.'

  return (
    <>
      {/* Overlay */}
      <div onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(58,46,43,0.55)', backdropFilter: 'blur(6px)', zIndex: 100, opacity: closing ? 0 : 1, transition: 'opacity 0.35s ease' }} />

      {/* Modal */}
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: closing ? 'translate(-50%, -47%) scale(0.96)' : 'translate(-50%, -50%) scale(1)', zIndex: 101, width: '90%', maxWidth: '460px', background: '#f1eae4', borderRadius: '2px', overflow: 'hidden', opacity: closing ? 0 : 1, transition: 'opacity 0.35s ease, transform 0.35s ease', boxShadow: '0 32px 80px rgba(58,46,43,0.3)' }}>

        {/* Top bar espresso */}
        <div style={{ background: '#3a2e2b', padding: '1.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Image src="/logo-beige.svg" alt="ANOINTED" width={120} height={28} style={{ height: '22px', width: 'auto' }} />
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,234,228,0.3)', fontSize: '20px', lineHeight: 1, padding: '0.25rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(241,234,228,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(241,234,228,0.3)'}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '2.5rem 2rem' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(74,122,90,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4.5 4.5L16 7" stroke="#4a7a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 300, color: '#3a2e2b', margin: '0 0 0.75rem', letterSpacing: '0.03em' }}>{thanksTitle}</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.8, color: '#5d4d42', margin: 0 }}>{thanksSub}</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '26px', fontWeight: 300, color: '#3a2e2b', margin: '0 0 0.75rem', letterSpacing: '0.02em', lineHeight: 1.2 }}>{title}</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.8, color: '#5d4d42', margin: '0 0 1.75rem' }}>{sub}</p>

              {/* Codice */}
              <div style={{ background: '#3a2e2b', borderRadius: '2px', padding: '0.875rem 1.25rem', marginBottom: '1.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em', color: '#c1a99a' }}>CODICE</span>
                <span style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: '#f1eae4', letterSpacing: '0.08em' }}>WELCOME10</span>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={placeholder}
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', background: 'white', border: '1px solid rgba(193,169,154,0.4)', color: '#3a2e2b', padding: '0.875rem 1rem', outline: 'none', borderRadius: '2px', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(193,169,154,0.4)'} />
                <button type="submit" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500, background: '#3a2e2b', color: '#f1eae4', border: 'none', padding: '1rem', borderRadius: '2px', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#5d4d42'}
                  onMouseLeave={e => e.currentTarget.style.background = '#3a2e2b'}>
                  {cta}
                </button>
              </form>

              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(193,169,154,0.5)', marginTop: '1rem', padding: '0.25rem', display: 'block', width: '100%', textAlign: 'center', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c1a99a'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(193,169,154,0.5)'}>
                {skip}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
