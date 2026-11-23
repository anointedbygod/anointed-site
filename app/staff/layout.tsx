import type { Metadata, Viewport } from 'next'
import '../globals.css'
import { EVENTO_EQUIPHER_ATTIVO } from '@/lib/config'

export const metadata: Metadata = {
  title: 'ANOINTED Staff',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'ANOINTED Staff', statusBarStyle: 'default' },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#3a2e2b' }

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body style={{ margin: 0, background: '#f1eae4' }}>
        {EVENTO_EQUIPHER_ATTIVO ? children : (
          <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#5d4d42', textAlign: 'center', padding: '2rem' }}>
            <p style={{ fontSize: 28, fontWeight: 300, letterSpacing: '0.22em', color: '#3a2e2b', margin: '0 0 1rem' }}>ANOINTED</p>
            <p style={{ fontSize: 14, margin: 0 }}>Evento concluso. Lo scanner non è più attivo.</p>
          </div>
        )}
      </body>
    </html>
  )
}
