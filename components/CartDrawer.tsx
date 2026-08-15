'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCarrello } from '@/lib/carrello'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { articoli, rimuovi, aggiorna, totale } = useCarrello()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(58,46,43,0.45)',
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 70,
        width: '420px', maxWidth: '100vw',
        background: '#f1eae4',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(58,46,43,0.12)',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.75rem 1.5rem',
          borderBottom: '1px solid rgba(193,169,154,0.25)',
        }}>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#c1a99a', margin: '0 0 0.25rem' }}>
              — ANOINTED —
            </p>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, letterSpacing: '0.12em', color: '#3a2e2b', margin: 0 }}>
              YOUR CART {articoli.length > 0 && `(${articoli.length})`}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#3a2e2b', padding: '4px', transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#c1a99a'}
          onMouseLeave={e => e.currentTarget.style.color = '#3a2e2b'}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {articoli.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', letterSpacing: '0.14em', color: '#c1a99a', textAlign: 'center' }}>
                YOUR CART IS EMPTY
              </p>
              <button onClick={onClose} style={{
                background: 'none', border: '1px solid rgba(193,169,154,0.5)',
                padding: '0.65rem 1.5rem', cursor: 'pointer', borderRadius: '1px',
                fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.16em', color: '#3a2e2b',
              }}>
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {articoli.map((item, i) => (
                <div key={item.varianteId} style={{
                  display: 'flex', gap: '1rem', padding: '1.25rem 0',
                  borderBottom: i < articoli.length - 1 ? '1px solid rgba(193,169,154,0.2)' : 'none',
                }}>
                  {/* Foto */}
                  <div style={{
                    width: '80px', height: '100px', flexShrink: 0, borderRadius: '2px',
                    background: item.immagine ? `url(${item.immagine}) center/cover` : 'linear-gradient(135deg, #e8d2c3 0%, #c1a99a 100%)',
                  }} />

                  {/* Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, color: '#3a2e2b', margin: '0 0 0.25rem', letterSpacing: '0.04em' }}>
                        {item.prodottoNome}
                      </p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#5d4d42', margin: '0 0 0.75rem', letterSpacing: '0.06em' }}>
                        {item.taglia} · {item.colore}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Quantità */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid rgba(193,169,154,0.3)', borderRadius: '1px', padding: '0.3rem 0.6rem' }}>
                        <button onClick={() => item.quantita > 1 ? aggiorna(item.varianteId, item.quantita - 1) : rimuovi(item.varianteId)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a2e2b', fontSize: '14px', lineHeight: 1, padding: 0 }}>
                          −
                        </button>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#3a2e2b', minWidth: '16px', textAlign: 'center' }}>
                          {item.quantita}
                        </span>
                        <button onClick={() => aggiorna(item.varianteId, item.quantita + 1)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a2e2b', fontSize: '14px', lineHeight: 1, padding: 0 }}>
                          +
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#3a2e2b', margin: 0, fontWeight: 500 }}>
                          € {(item.prezzo * item.quantita).toFixed(2)}
                        </p>
                        <button onClick={() => rimuovi(item.varianteId)} style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'rgba(193,169,154,0.6)', padding: 0, transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#3a2e2b'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(193,169,154,0.6)'}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {articoli.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid rgba(193,169,154,0.25)',
          }}>
            {/* Totale */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', color: '#5d4d42', margin: 0 }}>
                TOTAL
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 500, color: '#3a2e2b', margin: 0 }}>
                € {totale().toFixed(2)}
              </p>
            </div>

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#c1a99a', margin: '0 0 1.25rem', textAlign: 'center', letterSpacing: '0.08em' }}>
              Shipping calculated at checkout
            </p>

            <Link href="/checkout" onClick={onClose} style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: '#3a2e2b', color: '#f1eae4', textDecoration: 'none',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500,
              padding: '1rem', borderRadius: '1px', transition: 'background 0.2s',
              boxSizing: 'border-box',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#5d4d42'}
            onMouseLeave={e => e.currentTarget.style.background = '#3a2e2b'}>
              PROCEED TO CHECKOUT
            </Link>

            <button onClick={onClose} style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em',
              color: '#c1a99a', padding: '0.75rem', marginTop: '0.5rem', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#3a2e2b'}
            onMouseLeave={e => e.currentTarget.style.color = '#c1a99a'}>
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </>
  )
}
