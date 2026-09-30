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
      body: JSON.stringify({ email, tipo: 'popup', locale }),
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
    thanksSub:  locale === 'it' ? 'Controlla la tua email: il tuo codice sconto ti aspetta.' : 'Check your email: your discount code is on its way.',
    thanksSpam: locale === 'it' ? 'Non la vedi? Dai un\'occhiata anche nello spam.' : "Don't see it? Check your spam folder too.",
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
          <div className="popup-image" style={{ minHeight: '520px', background: 'url(/images/about/newsletter-popup.jpg) center/cover', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', padding: '2rem' }}>
            {/* Overlay per leggibilità del logo */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(58,46,43,0) 55%, rgba(58,46,43,0.55) 100%)' }} />
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
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid rgba(193,169,154,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <svg width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M1 3L9.5 9.5C9.8 9.72 10.2 9.72 10.5 9.5L19 3M2 1H18C18.55 1 19 1.45 19 2V14C19 14.55 18.55 15 18 15H2C1.45 15 1 14.55 1 14V2C1 1.45 1.45 1 2 1Z" stroke="#3a2e2b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '32px', fontWeight: 300, color: '#3a2e2b', margin: '0 0 0.75rem', letterSpacing: '0.02em' }}>{t.thanksTitle}</h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#5d4d42', lineHeight: 1.7, margin: '0 0 0.6rem' }}>{t.thanksSub}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#c1a99a', lineHeight: 1.6, margin: '0 0 2rem' }}>{t.thanksSpam}</p>
                <Link href={`/${locale}/prodotti`} onClick={close} style={{ display: 'block', width: '100%', background: '#3a2e2b', color: '#f1eae4', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500, padding: '16px', textAlign: 'center', textDecoration: 'none', transition: 'background 0.25s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#5d4d42'}
                  onMouseLeave={e => e.currentTarget.style.background = '#3a2e2b'}>
                  {t.thanksCta}
                </Link>
              </div>
            ) : (
              /* Form */
              <>
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
