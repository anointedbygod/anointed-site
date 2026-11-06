import type { Metadata, Viewport } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'ANOINTED Staff',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'ANOINTED Staff', statusBarStyle: 'default' },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#3a2e2b' }

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body style={{ margin: 0, background: '#f1eae4' }}>{children}</body>
    </html>
  )
}
