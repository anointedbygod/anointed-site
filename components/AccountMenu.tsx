'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AccountMenu({ textColor }: { textColor: string }) {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setLoading(false) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(locale === 'it' ? 'Credenziali non valide.' : 'Invalid credentials.'); setAuthLoading(false); return }
      setOpen(false)
      setEmail(''); setPassword('')
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: nome } } })
      if (error) { setError(error.message); setAuthLoading(false); return }
      setSuccess(locale === 'it' ? 'Controlla la tua email per confermare.' : 'Check your email to confirm.')
    }
    setAuthLoading(false)
  }

  async function logout() {
    await supabase.auth.signOut()
    setOpen(false)
    router.push(`/${locale}`)
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || ''

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: textColor, transition: 'color 0.3s' }}>
        {user ? (
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: textColor, color: textColor === '#f1eae4' ? '#3a2e2b' : '#f1eae4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            {initials}
          </div>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M3 15c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Dropdown */}
      <div style={{
        position: 'absolute', top: 'calc(100% + 1rem)', right: 0,
        background: '#f1eae4', border: '1px solid rgba(193,169,154,0.4)',
        borderRadius: '2px', overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(58,46,43,0.1)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none',
        transform: open ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'opacity 0.2s, transform 0.2s',
        zIndex: 60, width: user ? '220px' : '300px',
      }}>
        {loading ? (
          <div style={{ padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#c1a99a', margin: 0 }}>...</p>
          </div>
        ) : user ? (
          /* Menu utente loggato */
          <div style={{ padding: '0.5rem 0' }}>
            <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(193,169,154,0.2)' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, color: '#3a2e2b', margin: 0 }}>{user.user_metadata?.full_name || user.email}</p>
            </div>
            <Link href={`/${locale}/account?tab=orders`} onClick={() => setOpen(false)} style={{ display: 'block', padding: '0.65rem 1.25rem', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#3a2e2b', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(193,169,154,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {locale === 'it' ? 'I miei ordini' : 'My orders'}
            </Link>
            <Link href={`/${locale}/account?tab=address`} onClick={() => setOpen(false)} style={{ display: 'block', padding: '0.65rem 1.25rem', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#3a2e2b', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(193,169,154,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {locale === 'it' ? 'I miei indirizzi' : 'My addresses'}
            </Link>
            <button onClick={logout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.65rem 1.25rem', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#c97a6b', background: 'none', border: 'none', borderTop: '1px solid rgba(193,169,154,0.2)', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(193,169,154,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {locale === 'it' ? 'Esci' : 'Sign out'}
            </button>
          </div>
        ) : (
          /* Form login/register veloce */
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(193,169,154,0.2)' }}>
              {(['login', 'register'] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 0',
                  fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.1em',
                  color: mode === m ? '#3a2e2b' : '#c1a99a',
                  borderBottom: mode === m ? '1px solid #3a2e2b' : '1px solid transparent',
                  marginBottom: '-1px',
                }}>
                  {m === 'login' ? (locale === 'it' ? 'ACCEDI' : 'SIGN IN') : (locale === 'it' ? 'REGISTRATI' : 'REGISTER')}
                </button>
              ))}
            </div>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {mode === 'register' && (
                <input required value={nome} onChange={e => setNome(e.target.value)} placeholder={locale === 'it' ? 'Nome completo' : 'Full name'}
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '0.6rem 0.8rem', border: '1px solid rgba(58,46,43,0.15)', borderRadius: '2px', outline: 'none', background: 'white' }} />
              )}
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '0.6rem 0.8rem', border: '1px solid rgba(58,46,43,0.15)', borderRadius: '2px', outline: 'none', background: 'white' }} />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '0.6rem 0.8rem', border: '1px solid rgba(58,46,43,0.15)', borderRadius: '2px', outline: 'none', background: 'white' }} />

              {error && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#c97a6b', margin: 0 }}>{error}</p>}
              {success && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#4a7a5a', margin: 0 }}>{success}</p>}

              <button type="submit" disabled={authLoading} style={{ background: '#3a2e2b', color: '#f1eae4', border: 'none', padding: '0.7rem', borderRadius: '2px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.12em', marginTop: '0.25rem' }}>
                {authLoading ? '...' : mode === 'login' ? (locale === 'it' ? 'ACCEDI' : 'SIGN IN') : (locale === 'it' ? 'CREA ACCOUNT' : 'CREATE ACCOUNT')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
