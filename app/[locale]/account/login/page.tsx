'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function AccountLogin() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPw, setShowPw] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const t = {
    loginTitle: locale === 'it' ? 'Accedi' : 'Sign In',
    registerTitle: locale === 'it' ? 'Crea account' : 'Create Account',
    emailLabel: 'Email',
    passwordLabel: locale === 'it' ? 'Password' : 'Password',
    nomeLabel: locale === 'it' ? 'Nome completo' : 'Full name',
    loginCta: locale === 'it' ? 'ACCEDI' : 'SIGN IN',
    registerCta: locale === 'it' ? 'CREA ACCOUNT' : 'CREATE ACCOUNT',
    switchToRegister: locale === 'it' ? 'Non hai un account? Registrati' : "Don't have an account? Register",
    switchToLogin: locale === 'it' ? 'Hai già un account? Accedi' : 'Already have an account? Sign in',
    forgotPw: locale === 'it' ? 'Password dimenticata?' : 'Forgot password?',
    successRegister: locale === 'it' ? 'Account creato! Controlla la tua email per confermare.' : 'Account created! Check your email to confirm.',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(locale === 'it' ? 'Credenziali non valide.' : 'Invalid credentials.'); setLoading(false); return }
      window.location.href = `/${locale}/account`
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: nome } } })
      if (error) { setError(error.message); setLoading(false); return }
      setSuccess(t.successRegister)
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '14px',
    background: 'white', border: '1px solid rgba(58,46,43,0.2)',
    color: '#3a2e2b', padding: '0.875rem 1rem', outline: 'none',
    borderRadius: '2px', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh' }}>
      {/* Mini header */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(241,234,228,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(193,169,154,0.3)', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Link href={`/${locale}`}>
          <Image src="/logo-brown.svg" alt="ANOINTED" width={140} height={32} style={{ height: '26px', width: 'auto' }} />
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '5rem 2rem 2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Link href={`/${locale}`}>
            <Image src="/logo-brown.svg" alt="ANOINTED" width={160} height={40} style={{ height: '28px', width: 'auto' }} />
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: 'white', padding: '2.5rem', border: '1px solid rgba(193,169,154,0.25)', boxShadow: '0 8px 40px rgba(58,46,43,0.06)' }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(193,169,154,0.25)', marginBottom: '2rem' }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{
                flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.75rem', fontFamily: 'Inter, sans-serif', fontSize: '11px',
                letterSpacing: '0.14em', color: mode === m ? '#3a2e2b' : '#c1a99a',
                borderBottom: mode === m ? '1px solid #3a2e2b' : '1px solid transparent',
                marginBottom: '-1px', transition: 'color 0.2s',
              }}>
                {m === 'login' ? t.loginTitle.toUpperCase() : t.registerTitle.toUpperCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'register' && (
              <div>
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(58,46,43,0.5)', display: 'block', marginBottom: '0.5rem' }}>{t.nomeLabel.toUpperCase()}</label>
                <input required value={nome} onChange={e => setNome(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.2)'} />
              </div>
            )}
            <div>
              <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(58,46,43,0.5)', display: 'block', marginBottom: '0.5rem' }}>EMAIL</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.2)'} />
            </div>
            <div>
              <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(58,46,43,0.5)', display: 'block', marginBottom: '0.5rem' }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: '3rem' }}
                  onFocus={e => e.target.style.borderColor='#3a2e2b'} onBlur={e => e.target.style.borderColor='rgba(58,46,43,0.2)'} />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(58,46,43,0.3)' }}>
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#c97a6b', margin: 0 }}>{error}</p>}
            {success && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#4a7a5a', margin: 0 }}>{success}</p>}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', background: loading ? 'rgba(58,46,43,0.3)' : '#3a2e2b', color: '#f1eae4', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500, marginTop: '0.5rem', transition: 'background 0.2s' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#5d4d42' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#3a2e2b' }}>
              {loading ? '...' : mode === 'login' ? t.loginCta : t.registerCta}
            </button>
          </form>

          {mode === 'login' && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#c1a99a', textAlign: 'center', marginTop: '1.25rem', margin: '1.25rem 0 0' }}>
              <button onClick={async () => {
                if (!email) { setError(locale === 'it' ? 'Inserisci la tua email prima.' : 'Enter your email first.'); return }
                await supabase.auth.resetPasswordForEmail(email)
                setSuccess(locale === 'it' ? 'Email di reset inviata.' : 'Reset email sent.')
              }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c1a99a', fontFamily: 'Inter, sans-serif', fontSize: '11px', textDecoration: 'underline' }}>
                {t.forgotPw}
              </button>
            </p>
          )}
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(193,169,154,0.6)', textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href={`/${locale}`} style={{ color: 'rgba(193,169,154,0.6)', textDecoration: 'none' }}>← {locale === 'it' ? 'Torna al sito' : 'Back to site'}</Link>
        </p>
      </div>
      </div>
    </main>
  )
}
