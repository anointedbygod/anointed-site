import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intl = createMiddleware({
  locales: ['en', 'it'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false,
})

export default function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').toLowerCase()
  const { pathname } = req.nextUrl

  // staff.anointed.it: solo lo scanner dello stand, nessuna pagina dello shop
  if (host.startsWith('staff.')) {
    if (pathname === '/' || pathname.startsWith('/staff')) {
      const url = req.nextUrl.clone()
      url.pathname = '/staff'
      return NextResponse.rewrite(url)
    }
    return NextResponse.redirect(new URL('/', req.url))
  }

  // /staff (anche da anointed.it/staff e localhost) fuori dalla logica delle lingue
  if (pathname.startsWith('/staff')) return NextResponse.next()

  return intl(req)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
