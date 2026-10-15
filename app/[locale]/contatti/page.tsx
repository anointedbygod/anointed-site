'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function ContattiPage() {
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'
  const isIT = locale === 'it'
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ nome: '', email: '', oggetto: '', messaggio: '' })
  const [privacy, setPrivacy] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [hp, setHp] = useState('') // honeypot anti-bot

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!privacy || sending) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contatti', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, privacy, sito: hp }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError(isIT ? 'Invio non riuscito. Riprova o scrivici a info@anointed.it.' : 'Could not send. Please try again or write to info@anointed.it.')
    }
    setSending(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '13px',
    background: 'rgba(58,46,43,0.04)', border: '1px solid rgba(193,169,154,0.35)',
    color: '#3a2e2b', padding: '0.85rem 1rem', outline: 'none',
    borderRadius: '1px', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.75rem' }}>
          — {isIT ? 'ASSISTENZA' : 'SUPPORT'} —
        </p>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 3rem' }}>
          {isIT ? 'Contattaci' : 'Contact Us'}
        </h1>

        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

          {/* Info */}
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.8, color: '#5d4d42', margin: '0 0 2.5rem' }}>
              {isIT
                ? 'Siamo qui per aiutarti. Per domande su ordini, prodotti, taglie o resi, scrivici — risponderemo entro 48 ore lavorative.'
                : 'We are here to help. For questions about orders, products, sizes or returns, write to us — we will reply within 48 working hours.'
              }
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', color: '#c1a99a', margin: '0 0 0.4rem' }}>EMAIL</p>
                <a href="mailto:info@anointed.it" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#3a2e2b', textDecoration: 'none', borderBottom: '1px solid rgba(58,46,43,0.3)' }}>
                  info@anointed.it
                </a>
              </div>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', color: '#c1a99a', margin: '0 0 0.4rem' }}>INSTAGRAM</p>
                <a href="https://instagram.com/anointed" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#3a2e2b', textDecoration: 'none', borderBottom: '1px solid rgba(58,46,43,0.3)' }}>
                  @anointed
                </a>
              </div>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', color: '#c1a99a', margin: '0 0 0.4rem' }}>
                  {isIT ? 'TEMPI DI RISPOSTA' : 'RESPONSE TIME'}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#5d4d42', margin: 0 }}>
                  {isIT ? 'Entro 48 ore lavorative' : 'Within 48 working hours'}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#c1a99a', margin: '0 0 1rem' }}>✓</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 300, color: '#3a2e2b', margin: '0 0 0.75rem' }}>
                  {isIT ? 'Messaggio inviato.' : 'Message sent.'}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#5d4d42', margin: 0 }}>
                  {isIT ? 'Ti risponderemo entro 48 ore.' : 'We will reply within 48 hours.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em', color: '#5d4d42', display: 'block', marginBottom: '0.5rem' }}>
                      {isIT ? 'NOME *' : 'NAME *'}
                    </label>
                    <input required value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                      style={inputStyle} onFocus={e => e.target.style.borderColor='#c1a99a'} onBlur={e => e.target.style.borderColor='rgba(193,169,154,0.35)'} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em', color: '#5d4d42', display: 'block', marginBottom: '0.5rem' }}>EMAIL *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      style={inputStyle} onFocus={e => e.target.style.borderColor='#c1a99a'} onBlur={e => e.target.style.borderColor='rgba(193,169,154,0.35)'} />
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em', color: '#5d4d42', display: 'block', marginBottom: '0.5rem' }}>
                    {isIT ? 'OGGETTO *' : 'SUBJECT *'}
                  </label>
                  <input required value={form.oggetto} onChange={e => setForm(f => ({ ...f, oggetto: e.target.value }))}
                    style={inputStyle} onFocus={e => e.target.style.borderColor='#c1a99a'} onBlur={e => e.target.style.borderColor='rgba(193,169,154,0.35)'} />
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em', color: '#5d4d42', display: 'block', marginBottom: '0.5rem' }}>
                    {isIT ? 'MESSAGGIO *' : 'MESSAGE *'}
                  </label>
                  <textarea required value={form.messaggio} onChange={e => setForm(f => ({ ...f, messaggio: e.target.value }))}
                    rows={5} style={{ ...inputStyle, resize: 'none' }}
                    onFocus={e => e.target.style.borderColor='#c1a99a'} onBlur={e => e.target.style.borderColor='rgba(193,169,154,0.35)'} />
                </div>
                <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={e => setHp(e.target.value)} style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input type="checkbox" required checked={privacy} onChange={e => setPrivacy(e.target.checked)} style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '2px', accentColor: '#3a2e2b' }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5d4d42', lineHeight: 1.6 }}>
                    {isIT ? 'Ho letto la ' : 'I have read the '}
                    <a href={`/${locale}/privacy`} target="_blank" rel="noopener noreferrer" style={{ color: '#3a2e2b', textDecoration: 'underline' }}>Privacy Policy</a>
                    {isIT ? ' e acconsento al trattamento dei miei dati per rispondere alla richiesta. *' : ' and consent to my data being processed to answer my request. *'}
                  </span>
                </label>
                {error && <p role="alert" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#c97a6b', margin: 0 }}>{error}</p>}
                <button type="submit" disabled={sending} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500, background: '#3a2e2b', color: '#f1eae4', border: 'none', padding: '1rem', borderRadius: '1px', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#5d4d42'}
                  onMouseLeave={e => e.currentTarget.style.background='#3a2e2b'}>
                  {isIT ? 'INVIA MESSAGGIO' : 'SEND MESSAGE'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:767px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
    </main>
  )
}
