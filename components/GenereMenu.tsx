'use client'

import { useState } from 'react'
import Link from 'next/link'
import { COMING_SOON, GENERI_ATTIVI } from '@/lib/config'

interface Sez { nome: string; slug: string }

// Menu Collections: Woman / Man; cliccando si aprono le categorie del genere.
// Finché COMING_SOON è attivo (e per Man, non ancora lanciato) le categorie non mostrano il nome.
export default function GenereMenu({ locale, sezioni, onNavigate, variant }: {
  locale: string; sezioni: Sez[]; onNavigate: () => void; variant: 'desktop' | 'mobile'
}) {
  const [open, setOpen] = useState('')
  const mobile = variant === 'mobile'
  const font = { fontFamily: 'Inter, sans-serif', fontSize: mobile ? '13px' : '11px', letterSpacing: mobile ? '0.16em' : '0.14em' }
  const row = { ...font, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' as const, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const, padding: mobile ? '0.875rem 0' : '0.7rem 1.25rem', color: '#3a2e2b' }
  const sub = { ...font, display: 'block', padding: mobile ? '0.6rem 0 0.6rem 1rem' : '0.55rem 1.25rem 0.55rem 2rem', color: '#c1a99a', textDecoration: 'none', cursor: 'default' as const }

  return (
    <div>
      {GENERI_ATTIVI.map(g => {
        const isOpen = open === g.value
        const soon = COMING_SOON || g.value !== 'woman'
        const rows: (Sez | null)[] = soon ? Array.from({ length: g.value === 'woman' ? Math.max(sezioni.length, 1) : 1 }, () => null) : sezioni
        return (
          <div key={g.value} style={{ borderBottom: mobile ? '1px solid rgba(193,169,154,0.2)' : '1px solid rgba(193,169,154,0.15)' }}>
            <button onClick={() => setOpen(isOpen ? '' : g.value)} style={row}>
              {g.label.toUpperCase()}
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ transition: 'transform 0.25s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                <path d="M1 3L4.5 6.5L8 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            {isOpen && rows.map((sez, i) => sez ? (
              <Link key={sez.slug} href={`/${locale}/prodotti?genere=${g.value}&cat=${sez.slug}`} onClick={onNavigate} style={{ ...sub, color: '#3a2e2b', cursor: 'pointer' }}>
                {sez.nome.toUpperCase()}
              </Link>
            ) : (
              <span key={i} style={sub}>COMING SOON</span>
            ))}
          </div>
        )
      })}
    </div>
  )
}
