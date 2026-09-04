'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [email, setEmail] = useState('')
  const [privacy, setPrivacy] = useState(false)
  const [sent, setSent] = useState(false)
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'

  useEffect(() => {
    const seen = localStorage.getItem('anointed_popup_seen')
    if (seen && Date.now() < parseInt(seen)) return

    // Appare dopo 4 secondi O al 35% di scroll
    const timer = setTimeout(() => setVisible(true), 4000)

    const handleScroll = () => {
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (progress > 0.35) { setVisible(true); clearTimeout(timer) }
    }
    window.addEventListener('scroll', handleScroll, { passive: true, once: true } as any)
    return () => { clearTimeout(timer); window.removeEventListener('scroll', handleScroll) }
  }, [])

  useEffect(() => {
    if (visible) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [visible])

  function close() {
    setClosing(true)
    setTimeout(() => {
      setVisible(false)
      setClosing(false)
      const expire = Date.now() + 7 * 24 * 60 * 60 * 1000
      localStorage.setItem('anointed_popup_seen', String(expire))
    }, 220)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !privacy) return
    await fetch('/api/newsletter', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, tipo: 'popup' }),
    })
    setSent(true)
    const expire = Date.now() + 7 * 24 * 60 * 60 * 1000
    localStorage.setItem('anointed_popup_seen', String(expire))
    setTimeout(() => close(), 5000)
  }

  const t = {
    eyebrow:    locale === 'it' ? 'PRIMO REGALO' : 'FIRST GIFT',
    title:      locale === 'it' ? 'Benvenuta in Anointed.' : 'Welcome to Anointed.',
    body:       locale === 'it'
      ? 'Unisciti alle donne che camminano con scopo. Ricevi il <strong>10% di sconto</strong> sul tuo primo ordine e scopri per prima le nuove collezioni.'
      : 'Join the women who walk with purpose. Receive <strong>10% off</strong> your first order and be the first to discover new collections.',
    placeholder: locale === 'it' ? 'Indirizzo email' : 'Email address',
    privacy:    locale === 'it' ? 'Accetto la' : 'I agree to the',
    privacyLink: locale === 'it' ? 'Privacy Policy' : 'Privacy Policy',
    cta:        locale === 'it' ? 'SBLOCCA IL 10%' : 'UNLOCK MY 10%',
    micro:      locale === 'it'
      ? 'Iscrivendoti accetti di ricevere comunicazioni da Anointed. Puoi cancellare in qualsiasi momento.'
      : 'By subscribing you agree to receive communications from Anointed. Unsubscribe at any time.',
    thanksTitle: locale === 'it' ? 'Sei dentro.' : "You're in.",
    thanksSub:  locale === 'it' ? 'Il tuo regalo di benvenuto ti aspetta.' : 'Your welcome gift is waiting.',
    thanksCta:  locale === 'it' ? 'INIZIA A FARE SHOPPING' : 'START SHOPPING',
  }

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes fadeOut { from { opacity:1 } to { opacity:0 } }
        .popup-overlay { animation: ${closing ? 'fadeOut 220ms ease forwards' : 'fadeIn 300ms ease'} }
        .popup-card { animation: ${closing ? 'fadeOut 220ms ease forwards' : 'fadeIn 400ms ease'} }
        @media (max-width: 767px) {
          .popup-grid { grid-template-columns: 1fr !important; }
          .popup-image { min-height: 240px !important; }
          .popup-content { padding: 32px 24px !important; }
          .popup-title { font-size: 32px !important; }
        }
      `}</style>

      {/* Overlay */}
      <div className="popup-overlay" onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(58,46,43,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} />

      {/* Modal */}
      <div className="popup-card" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 101, width: '92%', maxWidth: '860px', background: '#f1eae4', boxShadow: '0 30px 80px rgba(58,46,43,0.25)', overflow: 'hidden' }}>
        <div className="popup-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

          {/* Immagine sx */}
          <div className="popup-image" style={{ minHeight: '520px', background: 'linear-gradient(145deg, #3a2e2b 0%, #5d4d42 40%, #c1a99a 100%)', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', padding: '2rem' }}>
            {/* Monogram watermark */}
            <Image src="/monogram-beige.svg" alt="" width={120} height={120} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '140px', height: '140px', opacity: 0.12, pointerEvents: 'none' }} />
            <Image src="/logo-beige.svg" alt="ANOINTED" width={140} height={32} style={{ height: '24px', width: 'auto', position: 'relative', zIndex: 1 }} />
          </div>

          {/* Contenuto dx */}
          <div className="popup-content" style={{ padding: '54px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Close */}
            <button onClick={close} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'rgba(58,46,43,0.25)', lineHeight: 1, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#3a2e2b'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(58,46,43,0.25)'}>×</button>

            {sent ? (
              /* Seconda schermata */
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.24em', color: '#c1a99a', margin: '0 0 1.25rem' }}>— ANOINTED —</p>
                <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '32px', fontWeight: 300, color: '#3a2e2b', margin: '0 0 0.75rem', letterSpacing: '0.02em' }}>{t.thanksTitle}</h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#5d4d42', lineHeight: 1.7, margin: '0 0 2rem' }}>{t.thanksSub}</p>
                {/* Codice grande */}
                <div style={{ background: '#3a2e2b', padding: '1.25rem 2rem', marginBottom: '1.75rem', display: 'inline-block' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#c1a99a', margin: '0 0 0.4rem' }}>IL TUO CODICE</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '28px', fontWeight: 700, color: '#f1eae4', margin: 0, letterSpacing: '0.1em' }}>WELCOME10</p>
                </div>
                <Link href={`/${locale}/prodotti`} onClick={close} style={{ display: 'block', width: '100%', background: '#3a2e2b', color: '#f1eae4', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500, padding: '16px', textAlign: 'center', textDecoration: 'none', transition: 'background 0.25s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#5d4d42'}
                  onMouseLeave={e => e.currentTarget.style.background = '#3a2e2b'}>
                  {t.thanksCta}
                </Link>
              </div>
            ) : (
              /* Form */
              <>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.24em', color: '#c1a99a', margin: '0 0 1.25rem' }}>{t.eyebrow}</p>
                <h2 className="popup-title" style={{ fontFamily: 'Inter, sans-serif', fontSize: '38px', fontWeight: 300, color: '#3a2e2b', margin: '0 0 1rem', lineHeight: 1.05, letterSpacing: '0.01em' }}>{t.title}</h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.75, color: '#5d4d42', margin: '0 0 2rem' }} dangerouslySetInnerHTML={{ __html: t.body }} />

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={t.placeholder}
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid rgba(58,46,43,0.2)', background: 'transparent', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#3a2e2b', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.2)'} />

                  <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                    <input type="checkbox" required checked={privacy} onChange={e => setPrivacy(e.target.checked)}
                      style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '2px', accentColor: '#3a2e2b', cursor: 'pointer' }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5d4d42', lineHeight: 1.6 }}>
                      {t.privacy}{' '}
                      <Link href={`/${locale}/privacy`} onClick={e => e.stopPropagation()} style={{ color: '#3a2e2b', textDecoration: 'underline' }}>{t.privacyLink}</Link>
                    </span>
                  </label>

                  <button type="submit" style={{ width: '100%', background: '#3a2e2b', color: '#f1eae4', padding: '16px', border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500, cursor: 'pointer', transition: 'background 0.25s, transform 0.25s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#5d4d42'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#3a2e2b'; e.currentTarget.style.transform = 'translateY(0)' }}>
                    {t.cta}
                  </button>
                </form>

                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(58,46,43,0.35)', lineHeight: 1.6, margin: '1.25rem 0 0' }}>{t.micro}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
