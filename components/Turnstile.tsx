'use client'
import { useEffect, useRef } from 'react'

// CAPTCHA Cloudflare Turnstile per login, registrazione e recupero password.
// Si attiva solo se NEXT_PUBLIC_TURNSTILE_SITE_KEY è impostata: senza chiave non compare e non blocca nulla.
// Supabase verifica il token lato server (Authentication > Attack Protection > CAPTCHA).
type TurnstileApi = {
  render: (el: HTMLElement, opzioni: Record<string, unknown>) => string
  reset: (id?: string) => void
  remove: (id: string) => void
}
declare global { interface Window { turnstile?: TurnstileApi } }

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
export const captchaAttivo = !!SITE_KEY

let caricamento: Promise<void> | null = null
function caricaScript() {
  if (caricamento) return caricamento
  caricamento = new Promise<void>((ok, ko) => {
    if (window.turnstile) return ok()
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.onload = () => ok()
    s.onerror = () => { caricamento = null; ko(new Error('Turnstile non caricato')) }
    document.head.appendChild(s)
  })
  return caricamento
}

export default function Turnstile({ onToken, resetKey = 0, lingua = 'it' }: { onToken: (t: string | null) => void; resetKey?: number; lingua?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const id = useRef<string | null>(null)
  const cb = useRef(onToken)
  useEffect(() => { cb.current = onToken }, [onToken])

  useEffect(() => {
    if (!SITE_KEY || !box.current) return
    let vivo = true
    caricaScript().then(() => {
      if (!vivo || !box.current || !window.turnstile) return
      id.current = window.turnstile.render(box.current, {
        sitekey: SITE_KEY,
        language: lingua,
        theme: 'light',
        callback: (t: string) => cb.current(t),
        'expired-callback': () => cb.current(null),
        'error-callback': () => cb.current(null),
      })
    }).catch(() => cb.current(null))
    return () => {
      vivo = false
      if (id.current && window.turnstile) window.turnstile.remove(id.current)
      id.current = null
    }
  }, [lingua])

  // Ogni token vale una sola volta: dopo un tentativo si rigenera
  useEffect(() => {
    if (resetKey && id.current && window.turnstile) { window.turnstile.reset(id.current); cb.current(null) }
  }, [resetKey])

  if (!SITE_KEY) return null
  return <div ref={box} style={{ minHeight: 65, display: 'flex', justifyContent: 'center' }} />
}
