'use client'
import { useRef, useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const TR = {
  en: {
    eyebrow: 'The experience',
    title: 'An Anointed box arrives quietly.',
    frames: [
      { src: '/images/about/box-closed.jpg', caption: 'Wrapped with quiet intention.' },
      { src: '/images/about/box-open.jpg', caption: 'Opened, it feels like a small ritual.' },
      { src: '/images/about/box-card.jpg', caption: 'A reminder meant to stay with you.' },
    ],
  },
  it: {
    eyebrow: "L'esperienza",
    title: 'Una scatola Anointed arriva in silenzio.',
    frames: [
      { src: '/images/about/box-closed.jpg', caption: 'Avvolta con intenzione silenziosa.' },
      { src: '/images/about/box-open.jpg', caption: 'Aperta, sembra un piccolo rituale.' },
      { src: '/images/about/box-card.jpg', caption: 'Un promemoria pensato per restare con te.' },
    ],
  },
}

export default function GiftingExperience() {
  const pathname = usePathname()
  const locale = (pathname?.startsWith('/it') ? 'it' : 'en') as 'en' | 'it'
  const t = TR[locale]

  const trackRef = useRef<HTMLElement>(null)
  const frameRefs = useRef<(HTMLDivElement | null)[]>([])
  const captionRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const labelRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      // frame 0 starts visible, others hidden
      frameRefs.current.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0, scale: 1.06 }))
      captionRefs.current.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 14 }))
      dotRefs.current.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0.35 }))
      gsap.set(labelRef.current, { opacity: 0, y: 16 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })

      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0)
        // slow continuous Ken Burns drift on every frame throughout
        .to(frameRefs.current, { scale: 1, duration: 3.6, ease: 'none' }, 0)
        // hold on frame 1
        .to({}, { duration: 0.55 })
        // -> frame 2
        .to(frameRefs.current[0], { opacity: 0, duration: 0.5 })
        .to(frameRefs.current[1], { opacity: 1, duration: 0.5 }, '<')
        .to(captionRefs.current[0], { opacity: 0, y: -14, duration: 0.35 }, '<')
        .to(captionRefs.current[1], { opacity: 1, y: 0, duration: 0.4 }, '<0.1')
        .to(dotRefs.current[0], { opacity: 0.35, duration: 0.3 }, '<')
        .to(dotRefs.current[1], { opacity: 1, duration: 0.3 }, '<')
        .to({}, { duration: 0.55 })
        // -> frame 3
        .to(frameRefs.current[1], { opacity: 0, duration: 0.5 })
        .to(frameRefs.current[2], { opacity: 1, duration: 0.5 }, '<')
        .to(captionRefs.current[1], { opacity: 0, y: -14, duration: 0.35 }, '<')
        .to(captionRefs.current[2], { opacity: 1, y: 0, duration: 0.4 }, '<0.1')
        .to(dotRefs.current[1], { opacity: 0.35, duration: 0.3 }, '<')
        .to(dotRefs.current[2], { opacity: 1, duration: 0.3 }, '<')
        .to({}, { duration: 0.7 })
    }, trackRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={trackRef} style={{ position: 'relative', height: '280vh', background: '#141210' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {t.frames.map((f, i) => (
          <div
            key={i}
            ref={el => { frameRefs.current[i] = el }}
            style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(0deg, rgba(10,8,7,0.7) 0%, rgba(10,8,7,0.1) 35%, rgba(10,8,7,0.25) 100%), url(${f.src}) center/cover`,
            }}
          />
        ))}

        {/* eyebrow + title */}
        <div ref={labelRef} style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center', width: '90%', maxWidth: '620px', zIndex: 3,
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10.5px', letterSpacing: '0.2em', color: '#c1a99a', margin: '0 0 0.9rem', textTransform: 'uppercase' }}>
            {t.eyebrow}
          </p>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.6rem, 3.4vw, 2.6rem)', fontWeight: 300, color: '#f1eae4', margin: 0, lineHeight: 1.25 }}>
            {t.title}
          </h2>
        </div>

        {/* caption per frame, bottom-left */}
        <div style={{ position: 'absolute', left: 'clamp(1.5rem, 6vw, 4rem)', bottom: 'clamp(2.5rem, 8vh, 5rem)', zIndex: 3 }}>
          {t.frames.map((f, i) => (
            <p key={i} ref={el => { captionRefs.current[i] = el }} style={{
              position: i === 0 ? 'relative' : 'absolute', left: 0, bottom: 0,
              fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
              color: '#f1eae4', margin: 0, maxWidth: '360px',
            }}>
              {f.caption}
            </p>
          ))}
        </div>

        {/* progress dots */}
        <div style={{
          position: 'absolute', right: 'clamp(1.25rem, 4vw, 3rem)', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: '0.9rem', zIndex: 3,
        }}>
          {t.frames.map((_, i) => (
            <div key={i} ref={el => { dotRefs.current[i] = el }} style={{
              width: '6px', height: '6px', borderRadius: '50%', background: '#f1eae4',
            }} />
          ))}
        </div>
      </div>
    </section>
  )
}
