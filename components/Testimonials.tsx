'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

const TR = {
  en: { title: 'What they say', stayIn: 'Stay in the circle', nlTitle: 'Join the women who walk with purpose.', nlSub: 'New arrivals, stories and exclusive access.', nlPlaceholder: 'your@email.com', nlCta: 'Subscribe', nlThanks: 'Welcome to the circle.' },
  it: { title: 'Cosa dicono', stayIn: 'Resta nel cerchio', nlTitle: 'Unisciti alle donne che camminano con scopo.', nlSub: 'Nuovi arrivi, storie e accesso esclusivo.', nlPlaceholder: 'La tua email', nlCta: 'Iscriviti', nlThanks: 'Benvenuta nel cerchio.' },
}
const TESTI = {
  en: [
    { quote: 'This brand changed how I see myself. Every piece feels intentional, purposeful.', name: 'Maria R.', city: 'Milan' },
    { quote: 'Finally a fashion brand that speaks to who I am, not just how I look.', name: 'Sofia L.', city: 'Rome' },
    { quote: 'The quality and the message together — this is what fashion should always be.', name: 'Anna K.', city: 'Turin' },
    { quote: 'I wear Anointed and I walk differently. It is a feeling I cannot explain.', name: 'Chiara M.', city: 'Florence' },
    { quote: 'Every detail is intentional. You feel it the moment you put it on.', name: 'Laura B.', city: 'Naples' },
  ],
  it: [
    { quote: "Questo brand ha cambiato il modo in cui mi vedo. Ogni capo trasmette intenzionalità e scopo.", name: 'Maria R.', city: 'Milano' },
    { quote: "Finalmente un brand di moda che parla di chi sono, non solo di come appaio.", name: 'Sofia L.', city: 'Roma' },
    { quote: "La qualità e il messaggio insieme — questo è ciò che la moda dovrebbe essere sempre.", name: 'Anna K.', city: 'Torino' },
    { quote: "Indosso Anointed e cammino diversamente. È una sensazione che non riesco a spiegare.", name: 'Chiara M.', city: 'Firenze' },
    { quote: "Ogni dettaglio è intenzionale. Lo senti nel momento in cui lo indossi.", name: 'Laura B.', city: 'Napoli' },
  ],
}

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(0)
  const ref = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const locale = (pathname.startsWith('/it') ? 'it' : 'en') as 'en'|'it'
  const t = TR[locale]
  const testi = TESTI[locale]
  const total = testi.length

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const prev = useCallback(() => setActive(a => (a-1+total)%total), [total])
  const next = useCallback(() => setActive(a => (a+1)%total), [total])

  function getStyle(i: number): React.CSSProperties {
    const diff = ((i-active+total)%total+total)%total
    const pos = diff <= total/2 ? diff : diff-total
    if (pos===0) return { transform: 'translateX(0) scale(1) rotateY(0deg)', zIndex: 10, opacity: 1, filter: 'none' }
    if (pos===1||pos===-1) return { transform: `translateX(${pos*72}%) scale(0.82) rotateY(${pos*-28}deg)`, zIndex: 5, opacity: 0.55, filter: 'blur(1px)' }
    if (pos===2||pos===-2) return { transform: `translateX(${pos*68}%) scale(0.65) rotateY(${pos*-42}deg)`, zIndex: 2, opacity: 0.2, filter: 'blur(2px)' }
    return { opacity: 0, pointerEvents: 'none' }
  }

  return (
    <section ref={ref} style={{ background: '#f1eae4' }}>
      <div style={{ padding: '6rem 0 4rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', textAlign: 'center', marginBottom: '3.5rem', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
          — {t.title.toUpperCase()} —
        </p>
        <div style={{ perspective: '1200px', position: 'relative', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none', cursor: dragging ? 'grabbing' : 'grab', overflow: 'hidden' }}
          onMouseDown={e => { setDragging(true); dragStart.current = e.clientX }}
          onMouseUp={e => { if (!dragging) return; setDragging(false); const d=e.clientX-dragStart.current; if(d<-40)next(); else if(d>40)prev() }}
          onMouseLeave={() => setDragging(false)}
          onTouchStart={e => { dragStart.current = e.touches[0].clientX }}
          onTouchEnd={e => { const d=e.changedTouches[0].clientX-dragStart.current; if(d<-40)next(); else if(d>40)prev() }}>
          {testi.map((item, i) => {
            const initials = item.name.split(' ').map((w:string)=>w[0]).join('')
            return (
              <div key={i} onClick={() => { if(i!==active)setActive(i) }} style={{ position: 'absolute', width: '340px', maxWidth: '85vw', background: 'rgba(58,46,43,0.04)', border: '1px solid rgba(193,169,154,0.25)', borderRadius: '4px', padding: '2rem', transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.55s ease, filter 0.55s ease', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', ...getStyle(i) }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.75, color: '#3a2e2b', margin: '0 0 1.5rem' }}>&ldquo;{item.quote}&rdquo;</p>
                <div style={{ height: '1px', background: 'rgba(193,169,154,0.3)', marginBottom: '1.25rem' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(193,169,154,0.12)', border: '1px solid rgba(193,169,154,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#c1a99a', fontWeight: 500 }}>{initials}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.1em', color: '#3a2e2b', margin: '0 0 0.2rem', fontWeight: 500 }}>{item.name}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.1em', color: '#c1a99a', margin: 0 }}>{item.city}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
          <button onClick={prev} style={{ background: 'none', border: '1px solid rgba(193,169,154,0.4)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3a2e2b', transition: 'border-color 0.2s, color 0.2s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor='#c1a99a';e.currentTarget.style.color='#c1a99a'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(193,169,154,0.4)';e.currentTarget.style.color='#3a2e2b'}}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            {testi.map((_,i) => <button key={i} onClick={()=>setActive(i)} style={{ width: i===active?'20px':'6px', height: '6px', borderRadius: '3px', border: 'none', cursor: 'pointer', padding: 0, background: i===active?'#c1a99a':'rgba(193,169,154,0.3)', transition: 'width 0.3s ease, background 0.3s ease' }} />)}
          </div>
          <button onClick={next} style={{ background: 'none', border: '1px solid rgba(193,169,154,0.4)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3a2e2b', transition: 'border-color 0.2s, color 0.2s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor='#c1a99a';e.currentTarget.style.color='#c1a99a'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(193,169,154,0.4)';e.currentTarget.style.color='#3a2e2b'}}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      <div style={{ margin: '0 1.5rem', height: '1px', background: 'rgba(193,169,154,0.25)' }} />

      <div style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 1rem' }}>— {t.stayIn.toUpperCase()} —</p>
        <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 0.75rem' }}>{t.nlTitle}</h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#5d4d42', margin: '0 0 2.5rem' }}>{t.nlSub}</p>
        {sent ? (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.16em', color: '#c1a99a' }}>{t.nlThanks}</p>
        ) : (
          <form onSubmit={async e=>{e.preventDefault();if(!email)return;await fetch("/api/newsletter",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,tipo:"newsletter"})});setSent(true)}} style={{ display: 'flex', justifyContent: 'center', maxWidth: '440px', margin: '0 auto' }}>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={t.nlPlaceholder} required style={{ flex: 1, fontFamily: 'Inter, sans-serif', fontSize: '12px', background: 'rgba(58,46,43,0.05)', border: '1px solid rgba(193,169,154,0.4)', borderRight: 'none', color: '#3a2e2b', padding: '0.85rem 1.25rem', outline: 'none', borderRadius: '1px 0 0 1px' }} />
            <button type="submit" style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.16em', background: '#3a2e2b', border: '1px solid #3a2e2b', color: '#f1eae4', padding: '0.85rem 1.5rem', cursor: 'pointer', borderRadius: '0 1px 1px 0', whiteSpace: 'nowrap', fontWeight: 500 }} onMouseEnter={e=>e.currentTarget.style.background='#5d4d42'} onMouseLeave={e=>e.currentTarget.style.background='#3a2e2b'}>
              {t.nlCta}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
