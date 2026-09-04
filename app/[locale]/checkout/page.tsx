'use client'

import { useState, useEffect } from 'react'
import { useCarrello } from '@/lib/carrello'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter, usePathname } from 'next/navigation'

interface Zona { id: string; nome: string; paesi: string[]; costo: number; soglia_gratuita: number | null }
interface ScontoApplicato { codice: string; tipo: string; valore: number; importo: number }

export default function CheckoutPage() {
  const { articoli, totale, svuota } = useCarrello()
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'
  const [loading, setLoading] = useState(false)
  const [zone, setZone] = useState<Zona[]>([])
  const [zonaSelezionata, setZonaSelezionata] = useState<Zona | null>(null)
  const [costoSpedizione, setCostoSpedizione] = useState(0)
  const [codiceSconto, setCodiceSconto] = useState('')
  const [scontoApplicato, setScontoApplicato] = useState<ScontoApplicato | null>(null)
  const [scontoError, setScontoError] = useState('')
  const [needsNewsletter, setNeedsNewsletter] = useState(false)
  const [iscrivendo, setIscrivendo] = useState(false)
  const [validandoSconto, setValidandoSconto] = useState(false)

  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null)
      if (data.user?.email) {
        update('email', data.user.email)
      }
    })
  }, [])

  const [form, setForm] = useState({
    nome: '', cognome: '', email: '',
    indirizzo: '', citta: '', cap: '', paese: 'IT',
  })

  useEffect(() => {
    fetch('/api/spedizioni').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setZone(data.filter((z: Zona) => z.id))
    })
  }, [])

  useEffect(() => {
    // Calcola zona in base al paese selezionato
    if (!form.paese || zone.length === 0) return
    const zona = zone.find(z => z.paesi?.includes(form.paese.toUpperCase()))
    setZonaSelezionata(zona || null)
    if (zona) {
      const subtotale = totale()
      const gratis = zona.soglia_gratuita && subtotale >= zona.soglia_gratuita
      setCostoSpedizione(gratis ? 0 : zona.costo)
    } else {
      setCostoSpedizione(0)
    }
  }, [form.paese, zone, totale])

  // Ri-valida lo sconto ogni volta che l'email cambia
  useEffect(() => {
    if (!scontoApplicato || !form.email) return
    fetch('/api/valida-sconto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codice: scontoApplicato.codice, totale: subtotale, email: form.email }),
    })
      .then(r => r.json())
      .then(data => {
        if (!data.valido) {
          setScontoApplicato(null)
          setCodiceSconto('')
          setScontoError(data.error || 'Codice non più valido per questa email')
        }
      })
  }, [form.email])

  async function validaSconto() {
    if (!codiceSconto.trim()) return
    setValidandoSconto(true)
    setScontoError('')
    const res = await fetch('/api/valida-sconto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codice: codiceSconto, totale: totale(), email: form.email }),
    })
    const data = await res.json()
    if (data.valido) {
      setScontoApplicato(data.sconto)
      setNeedsNewsletter(false)
    } else if (data.error === 'NEWSLETTER_REQUIRED') {
      setNeedsNewsletter(true)
      setScontoError('')
    } else {
      setScontoError(data.error || 'Codice non valido')
      setNeedsNewsletter(false)
    }
    setValidandoSconto(false)
  }

  async function iscriviEUsaCodice() {
    if (!form.email) return
    setIscrivendo(true)
    await fetch('/api/newsletter', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, tipo: 'popup' }),
    })
    setNeedsNewsletter(false)
    await validaSconto()
    setIscrivendo(false)
  }

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const subtotale = totale()
  const importoSconto = scontoApplicato?.importo || 0
  const totaleFinale = subtotale - importoSconto + costoSpedizione

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (articoli.length === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articoli,
          cliente: { indirizzo: form.indirizzo, citta: form.citta, cap: form.cap, paese: form.paese, email: form.email, nome: `${form.nome} ${form.cognome}`.trim() },
          userId,
          sconto: scontoApplicato,
          spedizione: zonaSelezionata ? { zona: zonaSelezionata.nome, costo: costoSpedizione } : null,
          totaleFinale,
        }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setLoading(false)
      alert(locale === 'it' ? 'Qualcosa è andato storto. Riprova.' : 'Something went wrong. Please try again.')
    }
  }

  const PAESI = [
    { code: 'IT', nome: 'Italia' }, { code: 'SM', nome: 'San Marino' },
    { code: 'VA', nome: 'Vaticano' }, { code: 'DE', nome: 'Germania' },
    { code: 'FR', nome: 'Francia' }, { code: 'ES', nome: 'Spagna' },
    { code: 'PT', nome: 'Portogallo' }, { code: 'AT', nome: 'Austria' },
    { code: 'CH', nome: 'Svizzera' }, { code: 'BE', nome: 'Belgio' },
    { code: 'NL', nome: 'Paesi Bassi' }, { code: 'GB', nome: 'Regno Unito' },
    { code: 'US', nome: 'Stati Uniti' }, { code: 'CA', nome: 'Canada' },
    { code: 'AU', nome: 'Australia' }, { code: 'AE', nome: 'Emirati Arabi' },
    { code: 'SA', nome: 'Arabia Saudita' }, { code: 'QA', nome: 'Qatar' },
    { code: 'KW', nome: 'Kuwait' }, { code: 'BH', nome: 'Bahrain' },
    { code: 'OM', nome: 'Oman' }, { code: 'JP', nome: 'Giappone' },
    { code: 'CN', nome: 'Cina' }, { code: 'KR', nome: 'Corea del Sud' },
    { code: 'SG', nome: 'Singapore' }, { code: 'HK', nome: 'Hong Kong' },
    { code: 'IN', nome: 'India' }, { code: 'BR', nome: 'Brasile' },
    { code: 'MX', nome: 'Messico' }, { code: 'ZA', nome: 'Sudafrica' },
  ]

  const inputStyle: React.CSSProperties = {
    width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '13px',
    background: 'white', border: '1px solid rgba(58,46,43,0.2)',
    color: '#3a2e2b', padding: '0.875rem 1rem', outline: 'none',
    borderRadius: '2px', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 500,
    letterSpacing: '0.12em', color: 'rgba(58,46,43,0.5)', display: 'block', marginBottom: '0.5rem',
  }

  if (articoli.length === 0) {
    return (
      <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', letterSpacing: '0.14em', color: '#c1a99a', marginBottom: '1.5rem' }}>
            {locale === 'it' ? 'IL CARRELLO È VUOTO' : 'YOUR CART IS EMPTY'}
          </p>
          <button onClick={() => router.push(`/${locale}/prodotti`)} style={{ background: '#3a2e2b', border: 'none', color: '#f1eae4', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.16em', padding: '0.85rem 2rem', borderRadius: '1px' }}>
            {locale === 'it' ? 'SCOPRI I PRODOTTI' : 'SHOP NOW'}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.75rem', textAlign: 'center' }}>— CHECKOUT —</p>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 3rem', textAlign: 'center', letterSpacing: '0.04em' }}>
          {locale === 'it' ? 'Completa il tuo ordine' : 'Complete your order'}
        </h1>

        <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>

          {/* LEFT — Form */}
          <form onSubmit={handleSubmit}>
            {/* Dati personali */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', color: '#c1a99a', margin: '0 0 1.25rem' }}>
                {locale === 'it' ? 'DATI PERSONALI' : 'PERSONAL DETAILS'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>{locale === 'it' ? 'NOME *' : 'FIRST NAME *'}</label>
                  <input required value={form.nome} onChange={e => update('nome', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.2)'} />
                </div>
                <div>
                  <label style={labelStyle}>{locale === 'it' ? 'COGNOME *' : 'LAST NAME *'}</label>
                  <input required value={form.cognome} onChange={e => update('cognome', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.2)'} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>EMAIL *</label>
                <input required type="email" value={form.email} disabled={!!userId} onChange={e => update('email', e.target.value)} style={{...inputStyle, background: userId ? 'rgba(193,169,154,0.1)' : 'white', cursor: userId ? 'not-allowed' : 'text'}} onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.2)'} />
                {userId && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#c1a99a', margin: '0.4rem 0 0' }}>Your account email</p>}
              </div>
            </div>

            {/* Indirizzo */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', color: '#c1a99a', margin: '0 0 1.25rem' }}>
                {locale === 'it' ? 'INDIRIZZO DI SPEDIZIONE' : 'SHIPPING ADDRESS'}
              </p>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={labelStyle}>{locale === 'it' ? 'INDIRIZZO *' : 'ADDRESS *'}</label>
                <input required value={form.indirizzo} onChange={e => update('indirizzo', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.2)'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>{locale === 'it' ? 'CITTÀ *' : 'CITY *'}</label>
                  <input required value={form.citta} onChange={e => update('citta', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.2)'} />
                </div>
                <div>
                  <label style={labelStyle}>CAP *</label>
                  <input required value={form.cap} onChange={e => update('cap', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.2)'} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>{locale === 'it' ? 'PAESE *' : 'COUNTRY *'}</label>
                <select required value={form.paese} onChange={e => update('paese', e.target.value)} style={inputStyle}>
                  {PAESI.map(p => <option key={p.code} value={p.code}>{p.nome}</option>)}
                </select>
              </div>
              {zonaSelezionata && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(193,169,154,0.1)', borderRadius: '2px', border: '1px solid rgba(193,169,154,0.2)' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5d4d42', margin: 0 }}>
                    📦 {zonaSelezionata.nome} — {costoSpedizione === 0 ? (locale === 'it' ? 'Spedizione gratuita' : 'Free shipping') : `€${costoSpedizione.toFixed(2)}`}
                    {zonaSelezionata.soglia_gratuita && costoSpedizione > 0 && (
                      <span style={{ color: '#c1a99a' }}> · gratuita sopra €{zonaSelezionata.soglia_gratuita}</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Codice sconto */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', color: '#c1a99a', margin: '0 0 1rem' }}>
                {locale === 'it' ? 'CODICE SCONTO' : 'DISCOUNT CODE'}
              </p>
              {scontoApplicato ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: 'rgba(74,122,90,0.08)', border: '1px solid rgba(74,122,90,0.2)', borderRadius: '2px' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#4a7a5a', margin: 0 }}>
                    ✓ {scontoApplicato.codice} — {scontoApplicato.tipo === 'percentuale' ? `${scontoApplicato.valore}%` : `€${scontoApplicato.valore}`} {locale === 'it' ? 'di sconto' : 'off'}
                  </p>
                  <button type="button" onClick={() => { setScontoApplicato(null); setCodiceSconto('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c97a6b', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                    {locale === 'it' ? 'Rimuovi' : 'Remove'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input value={codiceSconto} onChange={e => { setCodiceSconto(e.target.value.toUpperCase()); setScontoError('') }}
                    placeholder={locale === 'it' ? 'Inserisci codice' : 'Enter code'}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.2)'}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); validaSconto() } }} />
                  <button type="button" onClick={validaSconto} disabled={!codiceSconto || validandoSconto}
                    style={{ background: '#3a2e2b', color: '#f1eae4', border: 'none', padding: '0 1.25rem', borderRadius: '2px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', whiteSpace: 'nowrap', opacity: !codiceSconto ? 0.4 : 1 }}>
                    {validandoSconto ? '...' : (locale === 'it' ? 'APPLICA' : 'APPLY')}
                  </button>
                </div>
              )}
              {scontoError && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#c97a6b', margin: '0.5rem 0 0' }}>{scontoError}</p>}
              {needsNewsletter && (
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#c97a6b', margin: '0.5rem 0 0' }}>
                  Non sei iscritto alla newsletter.{' '}
                  <button type="button" onClick={iscriviEUsaCodice} disabled={iscrivendo} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a2e2b', textDecoration: 'underline', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: 0 }}>
                    {iscrivendo ? '...' : 'Clicca qui per iscriverti'}
                  </button>
                </p>
              )}
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '1.1rem', background: loading ? 'rgba(58,46,43,0.3)' : '#3a2e2b', color: '#f1eae4', border: 'none', borderRadius: '2px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500 }}>
              {loading ? '...' : (locale === 'it' ? 'PROCEDI AL PAGAMENTO' : 'PROCEED TO PAYMENT')}
            </button>
          </form>

          {/* RIGHT — Riepilogo */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', color: '#c1a99a', margin: '0 0 1.25rem' }}>
              {locale === 'it' ? 'RIEPILOGO ORDINE' : 'ORDER SUMMARY'}
            </p>
            <div style={{ background: 'white', borderRadius: '2px', border: '1px solid rgba(193,169,154,0.25)', overflow: 'hidden' }}>
              {articoli.map(item => (
                <div key={item.varianteId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(193,169,154,0.15)' }}>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#3a2e2b', margin: '0 0 0.2rem' }}>{item.prodottoNome}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#c1a99a', margin: 0 }}>{item.taglia} · {item.colore} · ×{item.quantita}</p>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#3a2e2b', margin: 0 }}>€{(item.prezzo * item.quantita).toFixed(2)}</p>
                </div>
              ))}
              <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5d4d42', margin: 0 }}>Subtotale</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#3a2e2b', margin: 0 }}>€{subtotale.toFixed(2)}</p>
                </div>
                {scontoApplicato && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#4a7a5a', margin: 0 }}>Sconto ({scontoApplicato.codice})</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#4a7a5a', margin: 0 }}>-€{importoSconto.toFixed(2)}</p>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5d4d42', margin: 0 }}>
                    {locale === 'it' ? 'Spedizione' : 'Shipping'}
                  </p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: costoSpedizione === 0 && zonaSelezionata ? '#4a7a5a' : '#3a2e2b', margin: 0 }}>
                    {!zonaSelezionata ? (locale === 'it' ? 'Seleziona paese' : 'Select country') : costoSpedizione === 0 ? (locale === 'it' ? 'Gratuita' : 'Free') : `€${costoSpedizione.toFixed(2)}`}
                  </p>
                </div>
                <div style={{ borderTop: '1px solid rgba(193,169,154,0.2)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#3a2e2b', margin: 0 }}>TOTALE</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#3a2e2b', margin: 0 }}>€{totaleFinale.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:767px){.checkout-layout{grid-template-columns:1fr!important}.checkout-layout>div:last-child{position:static!important}}`}</style>
    </main>
  )
}
