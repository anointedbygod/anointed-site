'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

interface Ordine { id: string; stato: string; totale: number; created_at: string; tracking_url: string | null; righe_ordine: any[] }
interface Indirizzo { id: string; nome: string; indirizzo: string; citta: string; cap: string; paese: string; predefinito: boolean }

const STATO_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  pending:             { label: 'Pending', color: '#c1a99a', bg: 'rgba(193,169,154,0.15)' },
  in_attesa_pagamento: { label: 'Awaiting payment', color: '#c1a99a', bg: 'rgba(193,169,154,0.15)' },
  ricevuto:            { label: 'Received', color: '#4a7a5a', bg: 'rgba(74,122,90,0.1)' },
  in_lavorazione:      { label: 'Processing', color: '#8a6a2a', bg: 'rgba(201,170,107,0.15)' },
  spedito:             { label: 'Shipped', color: '#2a5a8a', bg: 'rgba(107,150,201,0.15)' },
  completato:          { label: 'Delivered', color: '#4a7a5a', bg: 'rgba(74,122,90,0.2)' },
  annullato:           { label: 'Cancelled', color: '#c97a6b', bg: 'rgba(201,122,107,0.15)' },
}

export default function AccountDashboard() {
  const [tab, setTab] = useState<'orders' | 'address' | 'profile'>('orders')
  const [user, setUser] = useState<any>(null)
  const [ordini, setOrdini] = useState<Ordine[]>([])
  const [indirizzi, setIndirizzi] = useState<Indirizzo[]>([])
  const [loading, setLoading] = useState(true)
  const [nuovoIndirizzo, setNuovoIndirizzo] = useState({ nome: '', indirizzo: '', citta: '', cap: '', paese: 'IT' })
  const [aggiungendoIndirizzo, setAggiungendoIndirizzo] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push(`/${locale}/account/login`); return }
      setUser(data.user)
      // Carica ordini e indirizzi
      Promise.all([
        fetch(`/api/account/ordini?user_id=${data.user.id}&email=${data.user.email}`).then(r => r.json()),
        fetch(`/api/account/indirizzi?user_id=${data.user.id}`).then(r => r.json()),
      ]).then(([ord, ind]) => {
        setOrdini(Array.isArray(ord) ? ord : [])
        setIndirizzi(Array.isArray(ind) ? ind : [])
        setLoading(false)
      })
    })
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    router.push(`/${locale}`)
  }

  async function aggiungiIndirizzo() {
    if (!nuovoIndirizzo.nome || !nuovoIndirizzo.indirizzo) return
    setAggiungendoIndirizzo(true)
    const res = await fetch('/api/account/indirizzi', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...nuovoIndirizzo, user_id: user.id }),
    })
    const data = await res.json()
    if (!data.error) {
      setIndirizzi(prev => [...prev, data])
      setNuovoIndirizzo({ nome: '', indirizzo: '', citta: '', cap: '', paese: 'IT' })
      setShowForm(false)
    }
    setAggiungendoIndirizzo(false)
  }

  async function eliminaIndirizzo(id: string) {
    await fetch(`/api/account/indirizzi?id=${id}`, { method: 'DELETE' })
    setIndirizzi(prev => prev.filter(i => i.id !== id))
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '13px',
    background: 'white', border: '1px solid rgba(58,46,43,0.15)',
    color: '#3a2e2b', padding: '0.7rem 0.9rem', outline: 'none',
    borderRadius: '2px', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }

  if (loading) return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#c1a99a' }}>LOADING...</p>
    </main>
  )

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.5rem' }}>— {locale === 'it' ? 'IL TUO ACCOUNT' : 'YOUR ACCOUNT'} —</p>
            <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 300, color: '#3a2e2b', margin: 0 }}>
              {user?.user_metadata?.full_name || user?.email}
            </h1>
          </div>
          <button onClick={logout} style={{ background: 'none', border: '1px solid rgba(193,169,154,0.4)', padding: '0.6rem 1.25rem', borderRadius: '2px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', color: '#c1a99a', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a2e2b'; e.currentTarget.style.color = '#3a2e2b' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(193,169,154,0.4)'; e.currentTarget.style.color = '#c1a99a' }}>
            {locale === 'it' ? 'ESCI' : 'SIGN OUT'}
          </button>
        </div>

        {/* Tab */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(193,169,154,0.3)', marginBottom: '2.5rem' }}>
          {[
            { key: 'orders', label: locale === 'it' ? 'ORDINI' : 'ORDERS' },
            { key: 'address', label: locale === 'it' ? 'INDIRIZZI' : 'ADDRESSES' },
            { key: 'profile', label: locale === 'it' ? 'PROFILO' : 'PROFILE' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '0.75rem 1.5rem',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em',
              color: tab === t.key ? '#3a2e2b' : '#c1a99a',
              borderBottom: tab === t.key ? '1px solid #3a2e2b' : '1px solid transparent',
              marginBottom: '-1px', transition: 'color 0.2s',
            }}>{t.label}</button>
          ))}
        </div>

        {/* ORDINI */}
        {tab === 'orders' && (
          <div>
            {ordini.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#c1a99a', margin: '0 0 1.5rem' }}>
                  {locale === 'it' ? 'Nessun ordine ancora.' : 'No orders yet.'}
                </p>
                <Link href={`/${locale}/prodotti`} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.16em', color: '#3a2e2b', textDecoration: 'none', borderBottom: '1px solid #3a2e2b', paddingBottom: '2px' }}>
                  {locale === 'it' ? 'SCOPRI I PRODOTTI' : 'DISCOVER PRODUCTS'}
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {ordini.map(ordine => {
                  const stile = STATO_STYLE[ordine.stato] || STATO_STYLE.pending
                  const data = new Date(ordine.created_at).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
                  return (
                    <div key={ordine.id} style={{ background: 'white', border: '1px solid rgba(193,169,154,0.2)', padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: ordine.tracking_url ? '1rem' : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(58,46,43,0.4)' }}>#{ordine.id.slice(0, 8).toUpperCase()}</span>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5d4d42' }}>{data}</span>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, color: '#3a2e2b' }}>€{ordine.totale.toFixed(2)}</span>
                        </div>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', padding: '0.25rem 0.75rem', background: stile.bg, color: stile.color, borderRadius: '2px' }}>
                          {stile.label}
                        </span>
                      </div>
                      {/* Articoli */}
                      {ordine.righe_ordine?.length > 0 && (
                        <div style={{ borderTop: '1px solid rgba(193,169,154,0.15)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                          {ordine.righe_ordine.map((r: any) => (
                            <p key={r.id} style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5d4d42', margin: '0 0 0.2rem' }}>
                              {r.prodotto_nome} — {r.variante_info?.taglia} {r.variante_info?.colore} ×{r.quantita}
                            </p>
                          ))}
                        </div>
                      )}
                      {/* Tracking */}
                      {ordine.tracking_url && (
                        <div style={{ borderTop: '1px solid rgba(193,169,154,0.15)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                          <a href={ordine.tracking_url} target="_blank" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#2a5a8a', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            📦 {locale === 'it' ? 'Traccia il pacco' : 'Track your order'} →
                          </a>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* INDIRIZZI */}
        {tab === 'address' && (
          <div>
            {indirizzi.map(ind => (
              <div key={ind.id} style={{ background: 'white', border: '1px solid rgba(193,169,154,0.2)', padding: '1.25rem 1.5rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, color: '#3a2e2b', margin: '0 0 0.4rem' }}>{ind.nome}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5d4d42', margin: 0, lineHeight: 1.6 }}>
                    {ind.indirizzo}<br />{ind.cap} {ind.citta}<br />{ind.paese}
                  </p>
                </div>
                <button onClick={() => eliminaIndirizzo(ind.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c97a6b', fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
                  {locale === 'it' ? 'Rimuovi' : 'Remove'}
                </button>
              </div>
            ))}

            {!showForm ? (
              <button onClick={() => setShowForm(true)} style={{ background: 'none', border: '1px dashed rgba(193,169,154,0.5)', padding: '1rem', width: '100%', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '12px', letterSpacing: '0.12em', color: '#c1a99a', marginTop: '0.5rem' }}>
                + {locale === 'it' ? 'AGGIUNGI INDIRIZZO' : 'ADD ADDRESS'}
              </button>
            ) : (
              <div style={{ background: 'white', border: '1px solid rgba(193,169,154,0.2)', padding: '1.5rem', marginTop: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(58,46,43,0.5)', display: 'block', marginBottom: '0.4rem' }}>{locale === 'it' ? 'NOME COMPLETO' : 'FULL NAME'}</label>
                    <input value={nuovoIndirizzo.nome} onChange={e => setNuovoIndirizzo(p => ({ ...p, nome: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.15)'} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(58,46,43,0.5)', display: 'block', marginBottom: '0.4rem' }}>{locale === 'it' ? 'INDIRIZZO' : 'ADDRESS'}</label>
                    <input value={nuovoIndirizzo.indirizzo} onChange={e => setNuovoIndirizzo(p => ({ ...p, indirizzo: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.15)'} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(58,46,43,0.5)', display: 'block', marginBottom: '0.4rem' }}>{locale === 'it' ? 'CITTÀ' : 'CITY'}</label>
                    <input value={nuovoIndirizzo.citta} onChange={e => setNuovoIndirizzo(p => ({ ...p, citta: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.15)'} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(58,46,43,0.5)', display: 'block', marginBottom: '0.4rem' }}>CAP</label>
                    <input value={nuovoIndirizzo.cap} onChange={e => setNuovoIndirizzo(p => ({ ...p, cap: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.15)'} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={aggiungiIndirizzo} disabled={aggiungendoIndirizzo} style={{ background: '#3a2e2b', color: '#f1eae4', border: 'none', padding: '0.75rem 1.5rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em' }}>
                    {aggiungendoIndirizzo ? '...' : (locale === 'it' ? 'SALVA' : 'SAVE')}
                  </button>
                  <button onClick={() => setShowForm(false)} style={{ background: 'none', border: '1px solid rgba(193,169,154,0.4)', padding: '0.75rem 1.5rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', color: '#c1a99a' }}>
                    {locale === 'it' ? 'ANNULLA' : 'CANCEL'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROFILO */}
        {tab === 'profile' && (
          <div style={{ background: 'white', border: '1px solid rgba(193,169,154,0.2)', padding: '1.5rem', maxWidth: '480px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(58,46,43,0.5)', display: 'block', marginBottom: '0.4rem' }}>EMAIL</label>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#3a2e2b', margin: 0 }}>{user?.email}</p>
            </div>
            <div>
              <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(58,46,43,0.5)', display: 'block', marginBottom: '0.4rem' }}>{locale === 'it' ? 'NOME' : 'NAME'}</label>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#3a2e2b', margin: 0 }}>{user?.user_metadata?.full_name || '—'}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
