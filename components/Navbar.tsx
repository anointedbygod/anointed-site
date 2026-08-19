'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCarrello } from '@/lib/carrello'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { usePathname } from 'next/navigation'

const CATS_FIXED = [
  { en: 'Twilli', it: 'Twilli', href: 'twilli' },
  { en: 'Blazer', it: 'Blazer', href: 'blazer' },
  { en: 'Pochette', it: 'Pochette', href: 'pochette' },
  { en: 'T-Shirt', it: 'T-Shirt', href: 'tshirt' },
  { en: 'Shirts', it: 'Camicie', href: 'camicie' },
  { en: 'Trousers', it: 'Pantaloni', href: 'pantaloni' },
  { en: 'Best Sellers', it: 'Best Sellers', href: 'bestseller' },
]

interface SezioneNav { nome: string; slug: string }

export default function Navbar({ forceOpaque = false, onCartClick = () => {} }: { forceOpaque?: boolean; onCartClick?: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sezioniDyn, setSezioniDyn] = useState<SezioneNav[]>([])
  const lastY = useRef(0)
  const dropRef = useRef<HTMLDivElement>(null)
  const { articoli } = useCarrello()
  const count = articoli.reduce((s, a) => s + a.quantita, 0)
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'
  const collectionsLabel = locale === 'it' ? 'COLLEZIONI' : 'COLLECTIONS'
  const storyLabel = locale === 'it' ? 'LA NOSTRA STORIA' : 'OUR STORY'

  useEffect(() => {
    fetch('/api/sezioni').then(r => r.json()).then(data => {
      if (!Array.isArray(data)) return
      const fixedSlugs = CATS_FIXED.map(c => c.href)
      setSezioniDyn(data.filter((s: any) => !fixedSlugs.includes(s.slug)).map((s: any) => ({ nome: s.nome, slug: s.slug })))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      const delta = y - lastY.current
      setScrolled(y > 60)
      if (y > 100) {
        if (delta > 4) { setVisible(false); setCollectionsOpen(false) }
        else if (delta < -4) setVisible(true)
      } else setVisible(true)
      lastY.current = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setCollectionsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isOpaque = forceOpaque || scrolled || mobileOpen
  const textColor = isOpaque ? '#3a2e2b' : '#f1eae4'
  const logoSrc = isOpaque ? '/logo-brown.svg' : '/logo-beige.svg'

  const linkStyle = {
    display: 'block', padding: '0.55rem 1.25rem',
    fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.12em',
    color: '#3a2e2b', textDecoration: 'none',
  }

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .nav-mob { display: none !important; }
          .nav-desk { display: flex !important; }
          .logo-mob { display: none !important; }
          .logo-desk { display: flex !important; }
        }
        @media (max-width: 767px) {
          .nav-desk { display: none !important; }
          .nav-mob { display: flex !important; }
          .logo-desk { display: none !important; }
          .logo-mob { display: flex !important; }
        }
      `}</style>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s ease', transform: visible ? 'translateY(0)' : 'translateY(-100%)', background: isOpaque ? 'rgba(241,234,228,0.97)' : 'transparent', backdropFilter: isOpaque ? 'blur(12px)' : 'none', borderBottom: isOpaque ? '1px solid rgba(193,169,154,0.3)' : '1px solid transparent' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.25rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>

          {/* LEFT desktop */}
          <div ref={dropRef} className="nav-desk" style={{ alignItems: 'center', gap: '2rem', position: 'relative' }}>
            <button onClick={() => setCollectionsOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: 0, fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', color: textColor, transition: 'color 0.3s' }}>
              {collectionsLabel}
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ transition: 'transform 0.25s', transform: collectionsOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                <path d="M1 3L4.5 6.5L8 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
            <Link href={`/${locale}/storia`} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', color: textColor, textDecoration: 'none', transition: 'color 0.3s' }}>{storyLabel}</Link>

            {/* Dropdown desktop */}
            <div style={{ position: 'absolute', top: 'calc(100% + 1rem)', left: 0, background: '#f1eae4', border: '1px solid rgba(193,169,154,0.4)', borderRadius: '2px', padding: '0.5rem 0', minWidth: '200px', opacity: collectionsOpen ? 1 : 0, pointerEvents: collectionsOpen ? 'all' : 'none', transform: collectionsOpen ? 'translateY(0)' : 'translateY(-8px)', transition: 'opacity 0.2s, transform 0.2s', boxShadow: '0 12px 32px rgba(58,46,43,0.08)' }}>
              {CATS_FIXED.map((cat, i) => (
                <Link key={cat.href} href={`/${locale}/prodotti?cat=${cat.href}`} onClick={() => setCollectionsOpen(false)}
                  style={{ ...linkStyle, borderBottom: i < CATS_FIXED.length - 1 ? '1px solid rgba(193,169,154,0.15)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c1a99a'}
                  onMouseLeave={e => e.currentTarget.style.color = '#3a2e2b'}>
                  {(locale === 'it' ? cat.it : cat.en).toUpperCase()}
                </Link>
              ))}
              {sezioniDyn.map((sez, i) => (
                <Link key={sez.slug} href={`/${locale}/sezioni/${sez.slug}`} onClick={() => setCollectionsOpen(false)}
                  style={{ ...linkStyle, borderTop: i === 0 ? '1px solid rgba(193,169,154,0.3)' : '1px solid rgba(193,169,154,0.15)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c1a99a'}
                  onMouseLeave={e => e.currentTarget.style.color = '#3a2e2b'}>
                  {sez.nome.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* LOGO desktop — centrato assoluto, nascosto su mobile */}
          <Link href={`/${locale}`} className="logo-desk" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', alignItems: 'center', textDecoration: 'none' }}>
            <Image src={logoSrc} alt="ANOINTED" width={140} height={32} style={{ height: '26px', width: 'auto' }} priority />
          </Link>

          {/* RIGHT desktop */}
          <div className="nav-desk" style={{ alignItems: 'center', gap: '1.75rem' }}>
            <LanguageSwitcher textColor={textColor} />
            <button onClick={onCartClick} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: textColor, transition: 'color 0.3s' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 1h2.5l1.6 8h7.4l1.5-5.5H4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="13.5" r="0.8" fill="currentColor"/><circle cx="11" cy="13.5" r="0.8" fill="currentColor"/></svg>
              <span style={{ background: textColor, color: isOpaque ? '#f1eae4' : '#3a2e2b', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 600 }}>{count}</span>
            </button>
          </div>

          {/* MOBILE row — hamburger sx | logo centro | carrello dx */}
          <div className="nav-mob" style={{ alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <button onClick={() => setMobileOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: textColor, display: 'flex', flexDirection: 'column', gap: '5px', flexShrink: 0 }}>
              <span style={{ display: 'block', width: '22px', height: '1px', background: 'currentColor', transition: 'transform 0.3s', transform: mobileOpen ? 'translateY(6px) rotate(45deg)' : 'none' }}/>
              <span style={{ display: 'block', width: '22px', height: '1px', background: 'currentColor', transition: 'opacity 0.3s', opacity: mobileOpen ? 0 : 1 }}/>
              <span style={{ display: 'block', width: '22px', height: '1px', background: 'currentColor', transition: 'transform 0.3s', transform: mobileOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }}/>
            </button>

            {/* Logo mobile — solo su mobile */}
            <Link href={`/${locale}`} className="logo-mob" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', alignItems: 'center', textDecoration: 'none' }}>
              <Image src={logoSrc} alt="ANOINTED" width={120} height={28} style={{ height: '22px', width: 'auto' }} priority />
            </Link>

            <button onClick={onCartClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, position: 'relative', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none"><path d="M1 1h2.5l1.6 8h7.4l1.5-5.5H4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="13.5" r="0.8" fill="currentColor"/><circle cx="11" cy="13.5" r="0.8" fill="currentColor"/></svg>
              {count > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#c1a99a', color: '#f1eae4', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 600 }}>{count}</span>}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        <div style={{ overflow: 'hidden', maxHeight: mobileOpen ? '100vh' : '0', transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)', background: 'rgba(241,234,228,0.98)', backdropFilter: 'blur(12px)' }}>
          <div style={{ padding: '1rem 1.25rem 2rem' }}>
            {/* Categorie fisse */}
            {CATS_FIXED.map((cat) => (
              <Link key={cat.href} href={`/${locale}/prodotti?cat=${cat.href}`} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '0.875rem 0', borderBottom: '1px solid rgba(193,169,154,0.2)', fontFamily: 'Inter, sans-serif', fontSize: '13px', letterSpacing: '0.16em', color: '#3a2e2b', textDecoration: 'none' }}>
                {(locale === 'it' ? cat.it : cat.en).toUpperCase()}
              </Link>
            ))}
            {/* Sezioni dinamiche — continuano la lista senza linea extra */}
            {sezioniDyn.map((sez) => (
              <Link key={sez.slug} href={`/${locale}/sezioni/${sez.slug}`} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '0.875rem 0', borderBottom: '1px solid rgba(193,169,154,0.2)', fontFamily: 'Inter, sans-serif', fontSize: '13px', letterSpacing: '0.16em', color: '#3a2e2b', textDecoration: 'none' }}>
                {sez.nome.toUpperCase()}
              </Link>
            ))}
            {/* Storia */}
            <Link href={`/${locale}/storia`} onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '0.875rem 0', borderBottom: '1px solid rgba(193,169,154,0.2)', fontFamily: 'Inter, sans-serif', fontSize: '13px', letterSpacing: '0.16em', color: '#3a2e2b', textDecoration: 'none' }}>
              {storyLabel}
            </Link>
            {/* Language switcher — senza linea sopra, solo padding */}
            <div style={{ paddingTop: '1.25rem' }}>
              <LanguageSwitcher textColor="#3a2e2b" openUp={true} />
            </div>
          </div>
        </div>
      </nav>

      {collectionsOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setCollectionsOpen(false)} />}
    </>
  )
}
