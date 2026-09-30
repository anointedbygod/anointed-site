'use client'
import { useRef, useLayoutEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const TR = {
  en: {
    eyebrow: 'Follow the world of',
    title: 'Anointed',
    sub: 'Behind every piece, a story worth following.',
    handle: '@anointed',
    followers: '12.4K',
    posts: '184',
    following: '96',
    cta: 'Follow us on Instagram',
    zoomCaption: 'Every piece tells a story.',
  },
  it: {
    eyebrow: 'Segui il mondo di',
    title: 'Anointed',
    sub: 'Dietro ogni capo, una storia da seguire.',
    handle: '@anointed',
    followers: '12.4K',
    posts: '184',
    following: '96',
    cta: 'Seguici su Instagram',
    zoomCaption: 'Ogni capo racconta una storia.',
  },
}

const GRID = [
  '/images/instagram/g1_door.jpg',
  '/images/instagram/g2_box.jpg',
  '/images/instagram/g3_jacket.jpg',
  '/images/instagram/g4_quote1.jpg',
  '/images/instagram/g5_ribbon.jpg',
  '/images/instagram/g6_quote2.jpg',
  '/images/instagram/g7_trousers.jpg',
  '/images/instagram/g8_boxopen.jpg',
  '/images/instagram/g9_coffee.jpg',
]
const ZOOM_IMG = '/images/instagram/g5_ribbon.jpg'

export default function InstagramShowcase() {
  const pathname = usePathname()
  const locale = (pathname?.startsWith('/it') ? 'it' : 'en') as 'en' | 'it'
  const t = TR[locale]

  const trackRef = useRef<HTMLElement>(null)
  const fixedRef = useRef<HTMLDivElement>(null)
  const phoneWrapRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.set(fixedRef.current, { opacity: 0 })
      gsap.set(phoneWrapRef.current, { scale: 0.22, y: 90 })
      gsap.set(labelRef.current, { opacity: 0, x: 60 })
      gsap.set(zoomRef.current, { opacity: 0, scale: 1.18 })
      gsap.set(ctaRef.current, { opacity: 0, y: 24 })

      // Anchor the START directly to the brown EditorialBanner section (not a
      // guessed pixel offset), so the phone floats in while "You are not
      // ordinary / You are appointed" is still on screen, near its end.
      const brownSection = document.getElementById('editorial-banner')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: brownSection || trackRef.current,
          start: 'bottom 85%',
          endTrigger: trackRef.current,
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })

      // 1. entrance + growth — quick, continuous (no separate "drop in" step)
      tl.to(fixedRef.current, { opacity: 1, duration: 0.6 }, 0)
        .to(phoneWrapRef.current, { scale: 1, y: 0, duration: 2.2, ease: 'power2.out' }, 0.2)
        .to(labelRef.current, { opacity: 1, x: 0, duration: 1.4, ease: 'power2.out' }, 0.9)
        // 2. brief hold at full size
        .to({}, { duration: 0.9 })
        // 3. label exits, phone shrinks/fades into the zoom crossfade
        .to(labelRef.current, { opacity: 0, x: -24, duration: 0.5 })
        .to(phoneWrapRef.current, { opacity: 0, scale: 1.15, duration: 0.7, ease: 'power1.in' }, '<')
        .to(zoomRef.current, { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, '<0.1')
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '<0.25')
        // 4. hold on the CTA
        .to({}, { duration: 0.6 })
        // 5. fade everything out — this is the LAST tween, ending right as the
        // track's own bottom reaches the viewport bottom, so the next section
        // starts sliding in the instant we're fully invisible (no dead gap).
        .to(zoomRef.current, { opacity: 0, duration: 0.45 })
        .to(ctaRef.current, { opacity: 0, duration: 0.3 }, '<')
        .to(fixedRef.current, { opacity: 0, duration: 0.25 }, '<0.05')

      setReady(true)
    }, trackRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={trackRef} className="ig-track" style={{ position: 'relative', height: '230vh', background: '#f1eae4' }}>
      <div ref={fixedRef} style={{
        position: 'fixed', inset: 0, zIndex: 35, pointerEvents: 'none', overflow: 'hidden',
      }}>
        {/* ambient glow */}
        <div className="ig-glow" style={{
          position: 'absolute', top: '50%', left: '50%', width: '900px', height: '700px',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(193,169,154,0.25) 0%, rgba(193,169,154,0) 70%)',
          filter: 'blur(60px)', pointerEvents: 'none', opacity: ready ? 1 : 0,
        }} />

        {/* stage: phone + side label, laid out so they never overlap */}
        <div className="ig-stage" style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(1.5rem, 5vw, 5rem)',
          padding: '0 1.5rem',
        }}>
          {/* iPhone mockup */}
          <div ref={phoneWrapRef} style={{ flexShrink: 0, willChange: 'transform, opacity' }}>
            <div ref={phoneRef} style={{
              width: 'min(74vw, 340px)', aspectRatio: '430 / 880',
              background: '#1a1512', borderRadius: '54px', padding: '14px',
              boxShadow: '0 50px 100px rgba(58,46,43,0.35), 0 0 0 2px rgba(255,255,255,0.06) inset',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: '14px', left: '50%', transform: 'translateX(-50%)',
                width: '34%', height: '26px', background: '#1a1512', borderRadius: '16px', zIndex: 5,
              }} />
              <div style={{
                width: '100%', height: '100%', borderRadius: '38px', overflow: 'hidden',
                background: '#f1eae4', display: 'flex', flexDirection: 'column',
              }}>
                {/* IG header */}
                <div style={{ padding: '30px 16px 10px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #3a2e2b, #c1a99a)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid #f1eae4',
                    }}>
                      <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#f1eae4', letterSpacing: '0.05em' }}>A</span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                      <div>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#3a2e2b', margin: 0 }}>{t.posts}</p>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9.5px', color: '#8a7a6e', margin: 0 }}>posts</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#3a2e2b', margin: 0 }}>{t.followers}</p>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9.5px', color: '#8a7a6e', margin: 0 }}>followers</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#3a2e2b', margin: 0 }}>{t.following}</p>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9.5px', color: '#8a7a6e', margin: 0 }}>following</p>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', color: '#3a2e2b', margin: 0 }}>{t.handle}</p>
                </div>
                {/* grid */}
                <div style={{
                  flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px',
                  background: '#fff', overflowY: 'auto',
                }}>
                  {GRID.map((src, i) => (
                    <div key={i} style={{ aspectRatio: '1/1', background: `url(${src}) center/cover` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* side label — never overlaps the phone, enters from the right */}
          <div ref={labelRef} className="ig-label" style={{ maxWidth: '280px', flexShrink: 0 }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10.5px', letterSpacing: '0.16em', color: '#c1a99a', margin: '0 0 0.6rem', textTransform: 'uppercase' }}>
              {t.eyebrow}
            </p>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 0.85rem' }}>
              {t.title}
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.7, color: '#5d4d42', margin: 0 }}>
              {t.sub}
            </p>
          </div>
        </div>

        {/* zoom photo layer */}
        <div ref={zoomRef} style={{
          position: 'absolute', inset: 0, willChange: 'transform, opacity',
          background: `linear-gradient(0deg, rgba(20,14,12,0.55) 0%, rgba(20,14,12,0.05) 40%, rgba(20,14,12,0.15) 100%), url(${ZOOM_IMG}) center 25%/cover`,
        }}>
          <div ref={ctaRef} style={{
            position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
            textAlign: 'center', width: '90%',
          }}>
            <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1.1rem, 2.4vw, 1.6rem)', color: '#f1eae4', margin: '0 0 1.5rem' }}>
              {t.zoomCaption}
            </p>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-block', fontFamily: 'Inter, sans-serif', fontSize: '10.5px', letterSpacing: '0.16em',
              fontWeight: 500, color: '#3a2e2b', background: '#f1eae4',
              textDecoration: 'none', padding: '0.9rem 2.2rem', borderRadius: '100px', pointerEvents: 'auto',
            }}>
              {t.cta.toUpperCase()}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .ig-stage { flex-direction: column !important; gap: 1rem !important; }
          .ig-label { text-align: center; max-width: 90% !important; }
          .ig-track { height: 175vh !important; }
          .ig-glow { width: 480px !important; height: 380px !important; filter: blur(34px) !important; }
        }
      `}</style>
    </section>
  )
}
