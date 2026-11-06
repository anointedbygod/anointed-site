'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const TR = {
  it: {
    title: 'ANOINTED × EquipHer',
    sub: 'EquipHer Italia · Casa Ruffino · 21 novembre 2026',
    body: 'Iscriviti alla newsletter di ANOINTED: riceverai il tuo codice personale. Mostralo allo stand ANOINTED durante l\'evento per avere il 10% sui tuoi acquisti.',
    ph: 'La tua email',
    cta: 'RICEVI IL MIO CODICE',
    consent: 'Acconsento a ricevere email promozionali e newsletter di ANOINTED. Posso annullare l\'iscrizione in ogni momento. Leggi la ',
    okTitle: 'Quasi fatto.',
    ok: 'Ti abbiamo inviato un\'email: clicca il link di conferma per ricevere il tuo codice (controlla anche lo spam).',
    err: 'Qualcosa non ha funzionato. Riprova tra poco.',
    wait: 'INVIO…',
  },
  en: {
    title: 'ANOINTED × EquipHer',
    sub: 'EquipHer Italia · Casa Ruffino · 21 November 2026',
    body: 'Join the ANOINTED newsletter: you will receive your personal code. Show it at the ANOINTED stand during the event to get 10% off your purchases.',
    ph: 'Your email',
    cta: 'GET MY CODE',
    consent: 'I agree to receive ANOINTED promotional emails and newsletters. I can unsubscribe at any time. Read the ',
    okTitle: 'Almost there.',
    ok: 'We have sent you an email: click the confirmation link to receive your code (check your spam too).',
    err: 'Something went wrong. Please try again shortly.',
    wait: 'SENDING…',
  },
}

export default function EquipherPage() {
  const pathname = usePathname()
  const locale = (pathname.startsWith('/en') ? 'en' : 'it') as 'it' | 'en'
  const t = TR[locale]
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [stato, setStato] = useState<'idle' | 'invio' | 'ok' | 'errore'>('idle')

  async function invia(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !consent || stato === 'invio') return
    setStato('invio')
    try {
      const r = await fetch('/api/newsletter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tipo: 'equipher', locale, consenso: true }),
      })
      setStato(r.ok ? 'ok' : 'errore')
    } catch { setStato('errore') }
  }

  return (
    <main style={{ background: '#3a2e2b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 3rem' }}>
      <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-beige.svg" alt="ANOINTED" style={{ width: '200px', maxWidth: '70%', margin: '0 auto 2.25rem', display: 'block' }} />
        <p style={{ fontSize: '11px', letterSpacing: '0.16em', color: '#c1a99a', margin: '0 0 1.5rem' }}>{t.sub.toUpperCase()}</p>
        {stato === 'ok' ? (
          <>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#f1eae4', margin: '0 0 1rem' }}>{t.okTitle}</h1>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(241,234,228,0.75)', margin: 0 }}>{t.ok}</p>
          </>
        ) : (
          <>
            <p style={{ fontSize: '14px', lineHeight: 1.85, color: 'rgba(241,234,228,0.8)', margin: '0 0 2rem' }}>{t.body}</p>
            <form onSubmit={invia} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', textAlign: 'left' }}>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={t.ph} autoComplete="email" inputMode="email"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', padding: '0.95rem 1rem', background: 'rgba(241,234,228,0.08)', border: '1px solid rgba(241,234,228,0.3)', color: '#f1eae4', borderRadius: '2px', outline: 'none' }} />
              <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '2px', accentColor: '#c1a99a' }} />
                <span style={{ fontSize: '11px', lineHeight: 1.6, color: 'rgba(241,234,228,0.65)' }}>
                  {t.consent}
                  <a href={`/${locale}/privacy`} target="_blank" rel="noopener noreferrer" style={{ color: '#c1a99a', textDecoration: 'underline' }}>Privacy Policy</a>.
                </span>
              </label>
              <button type="submit" disabled={stato === 'invio'}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.16em', fontWeight: 500, background: '#f1eae4', color: '#3a2e2b', border: 'none', padding: '1rem', borderRadius: '2px', cursor: 'pointer', marginTop: '0.4rem', opacity: stato === 'invio' ? 0.6 : 1 }}>
                {stato === 'invio' ? t.wait : t.cta}
              </button>
              {stato === 'errore' && <p style={{ fontSize: '12px', color: '#e8b4a4', margin: 0, textAlign: 'center' }}>{t.err}</p>}
            </form>
          </>
        )}
      </div>
    </main>
  )
}
