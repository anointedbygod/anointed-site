'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const TR = {
  en: { collections: 'Collections', info: 'Info', tagline: 'Chosen. Set apart. Appointed.', copy: '© 2026 Anointed. All rights reserved.', cats: { twilli: 'Twilli', blazer: 'Blazer', pochette: 'Pochette', tshirt: 'T-Shirt', camicie: 'Shirts', pantaloni: 'Trousers' }, links: { story: 'Our Story', privacy: 'Privacy Policy', returns: 'Returns', contact: 'Contact' } },
  it: { collections: 'Collezioni', info: 'Info', tagline: 'Scelta. Messa da parte. Nominata.', copy: '© 2026 Anointed. Tutti i diritti riservati.', cats: { twilli: 'Twilli', blazer: 'Blazer', pochette: 'Pochette', tshirt: 'T-Shirt', camicie: 'Camicie', pantaloni: 'Pantaloni' }, links: { story: 'La Nostra Storia', privacy: 'Privacy Policy', returns: 'Resi', contact: 'Contatti' } },
}

export default function Footer() {
  const pathname = usePathname()
  const locale = (pathname.startsWith('/it') ? 'it' : 'en') as 'en'|'it'
  const t = TR[locale]

  return (
    <footer style={{ background: '#3a2e2b' }}>
      <div style={{ padding: '3.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'start', gap: '2rem' }}>

          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(241,234,228,0.3)', margin: '0 0 1.25rem' }}>{t.collections.toUpperCase()}</p>
            {Object.entries(t.cats).map(([key, label]) => (
              <Link key={key} href={`/${locale}/prodotti?cat=${key}`} style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(241,234,228,0.55)', textDecoration: 'none', marginBottom: '0.6rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c1a99a'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(241,234,228,0.55)'}>
                {label as string}
              </Link>
            ))}
          </div>

          {/* Logo SVG centrato */}
          <div style={{ textAlign: 'center' }}>
            <Link href={`/${locale}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <Image src="/logo-beige.svg" alt="ANOINTED" width={140} height={32} style={{ height: '28px', width: 'auto' }} />
            </Link>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.14em', color: 'rgba(193,169,154,0.4)', margin: '0.75rem 0 0' }}>{t.tagline}</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(241,234,228,0.3)', margin: '0 0 1.25rem' }}>{t.info.toUpperCase()}</p>
            {[
              { label: t.links.story, href: `/${locale}/storia` },
              { label: t.links.privacy, href: `/${locale}/privacy` },
              { label: t.links.returns, href: `/${locale}/resi` },
              { label: t.links.contact, href: `/${locale}/contatti` },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(241,234,228,0.55)', textDecoration: 'none', marginBottom: '0.6rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c1a99a'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(241,234,228,0.55)'}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(241,234,228,0.08)', marginTop: '3rem', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(241,234,228,0.2)', margin: 0 }}>{t.copy}</p>
        </div>
      </div>
      <style>{`@media(max-width:767px){.footer-grid{grid-template-columns:1fr!important;text-align:center!important}.footer-grid>div:last-child{text-align:center!important}}`}</style>
    </footer>
  )
}
