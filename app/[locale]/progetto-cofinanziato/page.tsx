import type { Metadata } from 'next'
import { Titillium_Web } from 'next/font/google'
import BloccoLoghiUE from '@/components/BloccoLoghiUE'
import { PROGETTO_UE, TESTI_PROGETTO_UE } from '@/lib/progetto-ue'

const titillium = Titillium_Web({ subsets: ['latin'], weight: ['400', '600', '700'], display: 'swap' })

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: TESTI_PROGETTO_UE[locale === 'it' ? 'it' : 'en'].titoloPagina }
}

export default async function ProgettoCofinanziato({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = TESTI_PROGETTO_UE[locale === 'it' ? 'it' : 'en']
  const p: React.CSSProperties = { fontSize: 16, lineHeight: 1.75, color: '#3a2e2b', margin: '0 0 1.25rem' }
  const h: React.CSSProperties = { fontSize: 18, fontWeight: 600, color: '#3a2e2b', margin: '2rem 0 0.5rem' }
  return (
    <main className={titillium.className} style={{ background: '#ffffff', minHeight: '100vh', paddingTop: 96 }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '2rem 1.25rem 5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 2.5rem' }}><BloccoLoghiUE altezza={44} /></div>
        <h1 style={{ fontSize: 30, fontWeight: 700, color: '#3a2e2b', margin: '0 0 1.5rem', lineHeight: 1.25 }}>{t.titoloPagina}</h1>
        {(PROGETTO_UE.titolo || PROGETTO_UE.cup) && (
          <div style={{ border: '1px solid #e5e5e5', borderRadius: 4, padding: '1rem 1.25rem', margin: '0 0 1.75rem', fontSize: 15, color: '#3a2e2b', lineHeight: 1.8 }}>
            {PROGETTO_UE.titolo && <div><strong>{t.titoloProgetto}:</strong> {PROGETTO_UE.titolo}</div>}
            {PROGETTO_UE.cup && <div><strong>{t.cup}:</strong> {PROGETTO_UE.cup}</div>}
          </div>
        )}
        <p style={p}>{t.intro}</p>
        <p style={p}>{t.sostegno}</p>
        <h2 style={h}>{t.finalitaT}</h2><p style={p}>{t.finalita}</p>
        <h2 style={h}>{t.attivitaT}</h2><p style={p}>{t.attivita}</p>
        <h2 style={h}>{t.risultatiT}</h2><p style={p}>{t.risultati}</p>
      </div>
    </main>
  )
}
