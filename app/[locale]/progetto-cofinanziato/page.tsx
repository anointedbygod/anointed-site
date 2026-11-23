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
        <div style={{ border: '1px solid #e5e5e5', borderRadius: 4, padding: '1rem 1.25rem', margin: '0 0 2rem', fontSize: 15, color: '#3a2e2b', lineHeight: 1.8 }}>
          <div><strong>{t.programmaL}:</strong> {t.programma}</div>
          <div><strong>{t.misuraL}:</strong> {PROGETTO_UE.misura}</div>
          <div><strong>{t.codiceL}:</strong> {PROGETTO_UE.codice}</div>
          <div><strong>{t.cupL}:</strong> {PROGETTO_UE.cup}</div>
          <div style={{ marginTop: '.5rem', fontWeight: 600 }}>{t.cofinanziato}</div>
        </div>
        <h2 style={h}>{t.descrizioneT}</h2>
        {t.descrizione.map((x, i) => <p key={i} style={p}>{x}</p>)}
        <h2 style={h}>{t.finalitaT}</h2>
        {t.finalita.map((x, i) => <p key={i} style={p}>{x}</p>)}
        <h2 style={h}>{t.attivitaT}</h2>
        <ul style={{ ...p, paddingLeft: '1.25rem', listStyle: 'disc' }}>{t.attivita.map((x, i) => <li key={i} style={{ marginBottom: '.35rem' }}>{x}</li>)}</ul>
        <h2 style={h}>{t.risultatiT}</h2><p style={p}>{t.risultati}</p>
        <h2 style={h}>{t.sostegnoT}</h2><p style={p}>{t.sostegno}</p>
      </div>
    </main>
  )
}
