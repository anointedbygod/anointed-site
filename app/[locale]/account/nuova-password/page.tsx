'use client'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

// Pagina di arrivo del link "Password dimenticata".
// Accetta sia il link con token_hash (modello email personalizzato, funziona su qualsiasi dispositivo)
// sia il link standard di Supabase (?code=..., funziona nello stesso browser della richiesta).
// Le regole della password (lunghezza, lettere e numeri, password trapelate) le applica Supabase lato server.
type Stato = 'verifica' | 'pronto' | 'invalido' | 'fatto'

export default function NuovaPassword() {
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'
  const it = locale === 'it'
  const supabase = useMemo(() => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!), [])

  const [stato, setStato] = useState<Stato>('verifica')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [errore, setErrore] = useState('')
  const [invio, setInvio] = useState(false)

  useEffect(() => {
    let vivo = true
    async function verifica() {
      const url = new URL(window.location.href)
      const tokenHash = url.searchParams.get('token_hash')
      const code = url.searchParams.get('code')
      let ok = false
      if (tokenHash) {
        const { error } = await supabase.auth.verifyOtp({ type: 'recovery', token_hash: tokenHash })
        ok = !error
      } else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        ok = !error
      } else {
        const { data } = await supabase.auth.getSession()
        ok = !!data.session
      }
      // Il token non resta nella barra degli indirizzi né nella cronologia
      window.history.replaceState(null, '', url.pathname)
      if (vivo) setStato(ok ? 'pronto' : 'invalido')
    }
    verifica()
    return () => { vivo = false }
  }, [supabase])

  async function salva(e: React.FormEvent) {
    e.preventDefault()
    setErrore('')
    if (pw.length < 10 || !/[a-zA-Z]/.test(pw) || !/\d/.test(pw)) {
      setErrore(it ? 'La password deve avere almeno 10 caratteri, con lettere e numeri.' : 'The password must be at least 10 characters long, with letters and numbers.')
      return
    }
    if (pw !== pw2) { setErrore(it ? 'Le due password non coincidono.' : 'The two passwords do not match.'); return }
    setInvio(true)
    const { error } = await supabase.auth.updateUser({ password: pw })
    if (error) {
      const debole = /weak|pwned|leaked|short|characters/i.test(error.message)
      setErrore(debole
        ? (it ? 'Questa password non è abbastanza sicura o è già comparsa in violazioni di dati. Scegline un’altra.' : 'This password is not strong enough or has appeared in a data breach. Please choose another one.')
        : (it ? 'Non siamo riusciti a salvare la password. Richiedi un nuovo link e riprova.' : 'We could not save your password. Request a new link and try again.'))
      setInvio(false)
      return
    }
    // Chiude le altre sessioni aperte (es. chi conosceva la vecchia password)
    await supabase.auth.signOut({ scope: 'others' }).catch(() => {})
    setStato('fatto')
    setInvio(false)
  }

  const label: React.CSSProperties = { fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(58,46,43,0.5)', display: 'block', marginBottom: '0.5rem' }
  const input: React.CSSProperties = { width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '14px', background: 'white', border: '1px solid rgba(58,46,43,0.2)', color: '#3a2e2b', padding: '0.875rem 1rem', outline: 'none', borderRadius: '2px', boxSizing: 'border-box' }
  const testo: React.CSSProperties = { fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.8, color: '#5d4d42', margin: '0 0 1.5rem', textAlign: 'center' }
  const bottone: React.CSSProperties = { display: 'block', width: '100%', padding: '1rem', background: '#3a2e2b', color: '#f1eae4', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500, textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '5rem 2rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Link href={`/${locale}`}>
              <Image src="/logo-brown.svg" alt="ANOINTED" width={160} height={40} style={{ height: '28px', width: 'auto' }} />
            </Link>
          </div>

          <div style={{ background: 'white', padding: '2.5rem', border: '1px solid rgba(193,169,154,0.25)', boxShadow: '0 8px 40px rgba(58,46,43,0.06)' }}>
            <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500, color: '#3a2e2b', textAlign: 'center', margin: '0 0 2rem' }}>
              {it ? 'NUOVA PASSWORD' : 'NEW PASSWORD'}
            </h1>

            {stato === 'verifica' && <p style={testo}>{it ? 'Verifica del link in corso…' : 'Checking your link…'}</p>}

            {stato === 'invalido' && (
              <>
                <p style={testo}>{it ? 'Il link non è valido o è scaduto (vale 1 ora e una sola volta). Richiedine uno nuovo dalla pagina di accesso.' : 'This link is invalid or has expired (it is valid for 1 hour and only once). Request a new one from the sign-in page.'}</p>
                <Link href={`/${locale}/account/login`} style={bottone}>{it ? 'TORNA ALL’ACCESSO' : 'BACK TO SIGN IN'}</Link>
              </>
            )}

            {stato === 'pronto' && (
              <form onSubmit={salva} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ ...testo, margin: '0 0 0.5rem' }}>{it ? 'Scegli una nuova password: almeno 10 caratteri, con lettere e numeri.' : 'Choose a new password: at least 10 characters, with letters and numbers.'}</p>
                <div>
                  <label style={label}>{it ? 'NUOVA PASSWORD' : 'NEW PASSWORD'}</label>
                  <input type="password" autoComplete="new-password" required value={pw} onChange={e => setPw(e.target.value)} style={input} />
                </div>
                <div>
                  <label style={label}>{it ? 'RIPETI LA PASSWORD' : 'REPEAT PASSWORD'}</label>
                  <input type="password" autoComplete="new-password" required value={pw2} onChange={e => setPw2(e.target.value)} style={input} />
                </div>
                {errore && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#c97a6b', margin: 0 }}>{errore}</p>}
                <button type="submit" disabled={invio} style={{ ...bottone, marginTop: '0.5rem', opacity: invio ? 0.5 : 1, cursor: invio ? 'not-allowed' : 'pointer' }}>
                  {invio ? '...' : (it ? 'SALVA PASSWORD' : 'SAVE PASSWORD')}
                </button>
              </form>
            )}

            {stato === 'fatto' && (
              <>
                <p style={testo}>{it ? 'Password aggiornata. Sei dentro con la nuova password; le altre sessioni aperte sono state chiuse.' : 'Password updated. You are signed in with your new password; other open sessions have been signed out.'}</p>
                <Link href={`/${locale}/account`} style={bottone}>{it ? 'VAI AL TUO ACCOUNT' : 'GO TO YOUR ACCOUNT'}</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
