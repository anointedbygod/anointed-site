'use client'

import { useState } from 'react'
import { useCarrello } from '@/lib/carrello'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { articoli, totale, svuota } = useCarrello()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: '', cognome: '', email: '',
    indirizzo: '', citta: '', cap: '', paese: 'Italia',
  })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (articoli.length === 0) return
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articoli, cliente: form }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setLoading(false)
      alert('Something went wrong. Please try again.')
    }
  }

  if (articoli.length === 0) {
    return (
      <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', letterSpacing: '0.14em', color: '#c1a99a', marginBottom: '1.5rem' }}>YOUR CART IS EMPTY</p>
          <button onClick={() => router.push('/prodotti')} style={{
            background: '#3a2e2b', border: 'none', color: '#f1eae4', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.16em',
            padding: '0.85rem 2rem', borderRadius: '1px',
          }}>
            SHOP NOW
          </button>
        </div>
      </main>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '13px',
    background: 'rgba(58,46,43,0.04)', border: '1px solid rgba(193,169,154,0.35)',
    color: '#3a2e2b', padding: '0.85rem 1rem', outline: 'none',
    borderRadius: '1px', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em',
    color: '#5d4d42', display: 'block', marginBottom: '0.5rem',
  }

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.75rem' }}>— CHECKOUT —</p>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 3rem', letterSpacing: '0.04em' }}>
          Complete your order
        </h1>

        <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem', alignItems: 'start' }}>

          {/* LEFT — Form */}
          <form onSubmit={handleSubmit}>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', color: '#3a2e2b', margin: '0 0 1.5rem', fontWeight: 500 }}>
              SHIPPING INFORMATION
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>FIRST NAME *</label>
                <input required value={form.nome} onChange={e => update('nome', e.target.value)}
                  style={inputStyle} placeholder="Sofia"
                  onFocus={e => e.target.style.borderColor = '#c1a99a'}
                  onBlur={e => e.target.style.borderColor = 'rgba(193,169,154,0.35)'} />
              </div>
              <div>
                <label style={labelStyle}>LAST NAME *</label>
                <input required value={form.cognome} onChange={e => update('cognome', e.target.value)}
                  style={inputStyle} placeholder="Meneghetti"
                  onFocus={e => e.target.style.borderColor = '#c1a99a'}
                  onBlur={e => e.target.style.borderColor = 'rgba(193,169,154,0.35)'} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>EMAIL *</label>
              <input required type="email" value={form.email} onChange={e => update('email', e.target.value)}
                style={inputStyle} placeholder="your@email.com"
                onFocus={e => e.target.style.borderColor = '#c1a99a'}
                onBlur={e => e.target.style.borderColor = 'rgba(193,169,154,0.35)'} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>ADDRESS *</label>
              <input required value={form.indirizzo} onChange={e => update('indirizzo', e.target.value)}
                style={inputStyle} placeholder="Via Roma 1"
                onFocus={e => e.target.style.borderColor = '#c1a99a'}
                onBlur={e => e.target.style.borderColor = 'rgba(193,169,154,0.35)'} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
              <div>
                <label style={labelStyle}>CITY *</label>
                <input required value={form.citta} onChange={e => update('citta', e.target.value)}
                  style={inputStyle} placeholder="Milano"
                  onFocus={e => e.target.style.borderColor = '#c1a99a'}
                  onBlur={e => e.target.style.borderColor = 'rgba(193,169,154,0.35)'} />
              </div>
              <div>
                <label style={labelStyle}>ZIP *</label>
                <input required value={form.cap} onChange={e => update('cap', e.target.value)}
                  style={inputStyle} placeholder="20100"
                  onFocus={e => e.target.style.borderColor = '#c1a99a'}
                  onBlur={e => e.target.style.borderColor = 'rgba(193,169,154,0.35)'} />
              </div>
              <div>
                <label style={labelStyle}>COUNTRY</label>
                <input value={form.paese} onChange={e => update('paese', e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c1a99a'}
                  onBlur={e => e.target.style.borderColor = 'rgba(193,169,154,0.35)'} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '1.1rem', border: 'none', borderRadius: '1px', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500,
              background: loading ? 'rgba(58,46,43,0.3)' : '#3a2e2b', color: '#f1eae4',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#5d4d42' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#3a2e2b' }}>
              {loading ? 'REDIRECTING TO PAYMENT...' : 'PROCEED TO PAYMENT →'}
            </button>

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.1em', color: '#c1a99a', textAlign: 'center', marginTop: '1rem' }}>
              Secure payment via Stripe · SSL encrypted
            </p>
          </form>

          {/* RIGHT — Order summary */}
          <div style={{ position: 'sticky', top: '80px', background: 'rgba(58,46,43,0.04)', border: '1px solid rgba(193,169,154,0.2)', borderRadius: '2px', padding: '1.75rem' }}>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', color: '#3a2e2b', margin: '0 0 1.5rem', fontWeight: 500 }}>
              ORDER SUMMARY
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {articoli.map(item => (
                <div key={item.varianteId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#3a2e2b', margin: '0 0 0.2rem', fontWeight: 400 }}>{item.prodottoNome}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#c1a99a', margin: 0 }}>{item.taglia} · {item.colore} · ×{item.quantita}</p>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#3a2e2b', margin: 0, whiteSpace: 'nowrap' }}>
                    € {(item.prezzo * item.quantita).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(193,169,154,0.25)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#5d4d42', margin: 0 }}>Subtotal</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#3a2e2b', margin: 0 }}>€ {totale().toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#5d4d42', margin: 0 }}>Shipping</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#c1a99a', margin: 0 }}>Calculated at next step</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(193,169,154,0.25)', paddingTop: '1rem' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, color: '#3a2e2b', margin: 0 }}>TOTAL</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 500, color: '#3a2e2b', margin: 0 }}>€ {totale().toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
