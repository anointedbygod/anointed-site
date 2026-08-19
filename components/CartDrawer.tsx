'use client'
import { useCarrello } from '@/lib/carrello'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { articoli, rimuovi, aggiorna, totale } = useCarrello()
  const pathname = usePathname()
  const router = useRouter()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'

  const title = locale === 'it' ? 'Il Tuo Carrello' : 'Your Cart'
  const empty = locale === 'it' ? 'Il carrello è vuoto' : 'Your cart is empty'
  const checkout = locale === 'it' ? 'PROCEDI AL CHECKOUT' : 'PROCEED TO CHECKOUT'
  const continueShopping = locale === 'it' ? 'Continua gli acquisti' : 'Continue shopping'
  const shipping = locale === 'it' ? 'Spedizione calcolata al checkout' : 'Shipping calculated at checkout'

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(58,46,43,0.4)',
        backdropFilter: 'blur(4px)', zIndex: 98,
        opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none',
        transition: 'opacity 0.3s ease',
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(420px, 100vw)',
        background: '#f1eae4', zIndex: 99,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(58,46,43,0.12)',
      }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(193,169,154,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#c1a99a', margin: '0 0 0.2rem' }}>— CART —</p>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 500, color: '#3a2e2b', margin: 0 }}>{title}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c1a99a', fontSize: '20px', padding: '0.25rem', lineHeight: 1 }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {articoli.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1.5rem' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#c1a99a', textAlign: 'center' }}>{empty}</p>
              <button onClick={() => { onClose(); router.push(`/${locale}/prodotti`) }}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.16em', background: 'none', border: '1px solid rgba(193,169,154,0.4)', color: '#3a2e2b', padding: '0.75rem 1.5rem', borderRadius: '1px', cursor: 'pointer' }}>
                {continueShopping.toUpperCase()}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {articoli.map(item => (
                <div key={item.varianteId} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem 0', borderBottom: '1px solid rgba(193,169,154,0.2)' }}>
                  {/* Img placeholder */}
                  <div style={{ width: '64px', height: '80px', background: item.immagine ? `url(${item.immagine}) center/cover` : 'linear-gradient(135deg, #e8d2c3, #c1a99a)', borderRadius: '2px', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, color: '#3a2e2b', margin: '0 0 0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.prodottoNome}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#c1a99a', margin: '0 0 0.75rem' }}>{item.taglia} · {item.colore}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Quantità */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(193,169,154,0.3)', borderRadius: '2px', padding: '0.2rem 0.5rem' }}>
                        <button onClick={() => item.quantita > 1 ? aggiorna(item.varianteId, item.quantita - 1) : rimuovi(item.varianteId)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a2e2b', fontSize: '14px', padding: '0 0.25rem', lineHeight: 1 }}>−</button>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#3a2e2b', minWidth: '16px', textAlign: 'center' }}>{item.quantita}</span>
                        <button onClick={() => aggiorna(item.varianteId, item.quantita + 1)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a2e2b', fontSize: '14px', padding: '0 0.25rem', lineHeight: 1 }}>+</button>
                      </div>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, color: '#3a2e2b', margin: 0 }}>€ {(item.prezzo * item.quantita).toFixed(2)}</p>
                    </div>
                  </div>
                  <button onClick={() => rimuovi(item.varianteId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(193,169,154,0.5)', fontSize: '14px', padding: '0.1rem', flexShrink: 0 }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {articoli.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(193,169,154,0.25)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#5d4d42', margin: 0 }}>{shipping}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#3a2e2b', margin: 0 }}>TOTALE</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#3a2e2b', margin: 0 }}>€ {totale().toFixed(2)}</p>
            </div>
            <button onClick={() => { onClose(); router.push(`/${locale}/checkout`) }}
              style={{ width: '100%', padding: '1rem', background: '#3a2e2b', color: '#f1eae4', border: 'none', borderRadius: '1px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#5d4d42'}
              onMouseLeave={e => e.currentTarget.style.background = '#3a2e2b'}>
              {checkout}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
