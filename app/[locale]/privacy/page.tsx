'use client'
import { usePathname } from 'next/navigation'

// Site/document ids from the Iubenda account (anointedbyheaven@gmail.com, site anointed.it).
// Only an Italian version exists today — the account's current plan supports a single
// language. Once Sofia upgrades and the English document is generated, this will get
// its own id and the src below can branch on `locale`.
const IUBENDA_PRIVACY_COOKIE_POLICY_ID = 10974198

export default function PrivacyPage() {
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'
  const isIT = locale === 'it'

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.75rem' }}>
          — {isIT ? 'LEGALE' : 'LEGAL'} —
        </p>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 0.5rem' }}>
          {isIT ? 'Informativa sulla Privacy' : 'Privacy Policy'}
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#c1a99a', margin: '0 0 2.5rem', letterSpacing: '0.08em' }}>
          {isIT
            ? 'Documento generato e mantenuto aggiornato tramite Iubenda.'
            : 'Document generated and kept up to date via Iubenda.'}
        </p>

        {/* An <iframe> keeps Iubenda's document fully contained: its own
            markup and styles live inside the frame and can never leak out
            or break the surrounding page layout, unlike the JS embed
            widget. The trade-off is that it scrolls in its own box rather
            than flowing with the rest of the page. */}
        <div style={{
          background: '#fff', borderRadius: '10px', overflow: 'hidden',
          border: '1px solid rgba(193,169,154,0.35)',
          boxShadow: '0 20px 50px rgba(58,46,43,0.08)',
        }}>
          <iframe
            src={`https://www.iubenda.com/privacy-policy/${IUBENDA_PRIVACY_COOKIE_POLICY_ID}`}
            title="Privacy Policy"
            style={{ width: '100%', height: '75vh', minHeight: '520px', border: 'none', display: 'block' }}
          />
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#c1a99a', margin: '1.25rem 0 0', textAlign: 'center' }}>
          {isIT ? (
            <>Il documento non si vede bene? <a href={`https://www.iubenda.com/privacy-policy/${IUBENDA_PRIVACY_COOKIE_POLICY_ID}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3a2e2b' }}>Aprilo in una nuova pagina</a>.</>
          ) : (
            <>Document not displaying correctly? <a href={`https://www.iubenda.com/privacy-policy/${IUBENDA_PRIVACY_COOKIE_POLICY_ID}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3a2e2b' }}>Open it in a new page</a>.</>
          )}
        </p>
      </div>
    </main>
  )
}
