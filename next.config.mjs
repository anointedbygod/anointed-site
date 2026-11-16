import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin()

// Header di sicurezza su tutte le pagine. HSTS: solo HTTPS. La fotocamera serve allo scanner staff (stessa origine).
const headerSicurezza = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  // Sottoinsieme sicuro di CSP: niente embedding in altri siti, niente <base>/<object> iniettati, form solo verso il sito
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
]

// CSP completa in modalità di PROVA (Report-Only): non blocca nulla, segnala soltanto a /api/csp-report.
// Quando i log sono puliti (navigazione, login, acquisto Stripe, banner cookie) si sposta in Content-Security-Policy.
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://*.supabase.co'
const dev = process.env.NODE_ENV !== 'production'
const cspProva = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''} https://*.iubenda.com`,
  "style-src 'self' 'unsafe-inline' https://*.iubenda.com",
  `img-src 'self' data: blob: ${supabase} https://*.supabase.co https://*.iubenda.com`,
  "font-src 'self' data: https://*.iubenda.com",
  `connect-src 'self' ${supabase} https://*.supabase.co wss://*.supabase.co https://*.iubenda.com`,
  "frame-src 'self' https://*.iubenda.com",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'report-uri /api/csp-report',
].join('; ')
headerSicurezza.push({ key: 'Content-Security-Policy-Report-Only', value: cspProva })

const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  async headers() {
    return [{ source: '/:path*', headers: headerSicurezza }]
  },
}
export default withNextIntl(nextConfig)
