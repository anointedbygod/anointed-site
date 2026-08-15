'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  textColor?: string
}

export default function LanguageSwitcher({ textColor = '#3a2e2b' }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Con localePrefix: 'always' il path è sempre /en/... o /it/...
  const locale = pathname.startsWith('/it') ? 'it' : 'en'

  function switchTo(lang: string) {
    if (lang === locale) { setOpen(false); return }
    // Sostituisci solo il prefisso lingua
    const withoutLocale = pathname.replace(/^\/(en|it)/, '') || '/'
    router.push(`/${lang}${withoutLocale}`)
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: 'Inter, sans-serif', fontSize: '11px',
        letterSpacing: '0.14em', color: textColor, padding: 0,
        transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: '4px',
      }}>
        {locale.toUpperCase()}
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none"
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 0.75rem)', right: 0,
            background: '#f1eae4', border: '1px solid rgba(193,169,154,0.4)',
            borderRadius: '2px', overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(58,46,43,0.08)',
            zIndex: 50, minWidth: '100px',
          }}>
            {[
              { code: 'en', label: 'English' },
              { code: 'it', label: 'Italiano' },
            ].map(lang => (
              <button key={lang.code} onClick={() => switchTo(lang.code)} style={{
                display: 'block', width: '100%', padding: '0.65rem 1rem',
                background: lang.code === locale ? 'rgba(58,46,43,0.06)' : 'none',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.12em',
                color: lang.code === locale ? '#c1a99a' : '#3a2e2b',
fontWeight: lang.code === locale ? 400 : 500,
              }}>
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
