'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import { useCarrello } from '@/lib/carrello'

interface Variante { id: string; taglia: string; colore: string; stock: number; colore_id?: string }
interface ImgColore { url: string; ordine: number }
interface ColoreData { id: string; nome: string; prezzo_aggiuntivo: number; immagini_colore: ImgColore[]; varianti: Variante[] }
interface Prodotto { id: string; nome: string; prezzo: number; descrizione: string; immagini: string[]; slug: string; categoria: string; varianti: Variante[]; prezzo_per_colore: boolean }

export default function ProdottoPage() {
  const params = useParams()
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'
  const { aggiungi } = useCarrello()

  const [prodotto, setProdotto] = useState<Prodotto | null>(null)
  const [colori, setColori] = useState<ColoreData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedColore, setSelectedColore] = useState<ColoreData | null>(null)
  const [selectedTaglia, setSelectedTaglia] = useState('')
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetch('/api/prodotti')
      .then(r => r.json())
      .then(async (data: Prodotto[]) => {
        const found = data.find(p => p.slug === params.slug)
        if (!found) { setLoading(false); return }
        setProdotto(found)

        // Carica colori con immagini e varianti
        const coloriRes = await fetch(`/api/colori?prodotto_id=${found.id}`)
        const coloriData: ColoreData[] = await coloriRes.json()
        setColori(coloriData)
        if (coloriData.length > 0) setSelectedColore(coloriData[0])

        setLoading(false)
      })
  }, [params.slug])

  // Gallery cambia al cambio colore
  useEffect(() => {
    setActiveImg(0)
    setSelectedTaglia('')
  }, [selectedColore])

  if (loading) return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#c1a99a' }}>LOADING...</p>
    </main>
  )

  if (!prodotto) return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#5d4d42' }}>Product not found.</p>
    </main>
  )

  // Immagini del colore selezionato — fallback su immagini prodotto
  const imgs = selectedColore?.immagini_colore?.length
    ? selectedColore.immagini_colore.sort((a, b) => a.ordine - b.ordine).map(i => i.url)
    : prodotto.immagini?.length ? prodotto.immagini : ['']

  // Prezzo — fisso o per colore
  const prezzo = prodotto.prezzo_per_colore && selectedColore
    ? selectedColore.prezzo_aggiuntivo
    : prodotto.prezzo

  // Taglie del colore selezionato
  const taglieDisponibili = selectedColore
    ? selectedColore.varianti?.filter(v => v.colore_id === selectedColore.id || v.colore === selectedColore.nome) || []
    : prodotto.varianti || []

  // Variante selezionata
  const varianteSel = taglieDisponibili.find(v => v.taglia === selectedTaglia)
  const inStock = !varianteSel || varianteSel.stock > 0

  const addToCart = locale === 'it' ? 'Aggiungi al Carrello' : 'Add to Cart'
  const selectSize = locale === 'it' ? 'Seleziona una taglia' : 'Select a size'
  const outOfStock = locale === 'it' ? 'Esaurito' : 'Out of Stock'
  const addedText = locale === 'it' ? 'Aggiunto ✓' : 'Added ✓'
  const sizeLabel = locale === 'it' ? 'TAGLIA' : 'SIZE'
  const colorLabel = locale === 'it' ? 'COLORE' : 'COLOR'
  const sizeGuide = locale === 'it' ? 'Guida taglie' : 'Size guide'

  function handleAggiungi() {
    if (!selectedTaglia) return
    aggiungi({
      varianteId: varianteSel?.id || `${prodotto.id}-${selectedColore?.nome}-${selectedTaglia}`,
      prodottoNome: prodotto.nome,
      taglia: selectedTaglia,
      colore: selectedColore?.nome || '',
      prezzo,
      quantita: 1,
      immagine: imgs[0] || '',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>

        {/* Breadcrumb */}
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em', color: '#c1a99a', marginBottom: '2.5rem' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => history.back()}>SHOP</span>
          <span style={{ margin: '0 0.5rem' }}>—</span>
          <span style={{ color: '#3a2e2b' }}>{prodotto.nome.toUpperCase()}</span>
        </p>

        <div className="prod-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>

          {/* LEFT — Gallery */}
          <div>
            <div style={{
              aspectRatio: '3/4', borderRadius: '2px', overflow: 'hidden',
              background: imgs[activeImg] ? `url(${imgs[activeImg]}) center/cover` : 'linear-gradient(135deg, #e8d2c3 0%, #c1a99a 100%)',
              marginBottom: '0.75rem', position: 'relative',
              transition: 'background-image 0.3s ease',
            }}>
              {!imgs[activeImg] && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(58,46,43,0.3)' }}>PHOTO</p>
                </div>
              )}
            </div>
            {imgs.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {imgs.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{
                    width: '64px', height: '80px', borderRadius: '2px', border: 'none',
                    background: img ? `url(${img}) center/cover` : '#e8d2c3',
                    cursor: 'pointer', padding: 0, flexShrink: 0,
                    outline: i === activeImg ? '1.5px solid #3a2e2b' : '1.5px solid transparent',
                    outlineOffset: '2px', transition: 'outline-color 0.2s',
                    opacity: i === activeImg ? 1 : 0.6,
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#c1a99a', margin: '0 0 0.75rem' }}>
              {prodotto.categoria?.toUpperCase()}
            </p>
            <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 0.75rem', letterSpacing: '0.03em' }}>
              {prodotto.nome}
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 400, color: '#3a2e2b', margin: '0 0 2rem', transition: 'all 0.3s ease' }}>
              € {prezzo.toFixed(2)}
            </p>

            <div style={{ height: '1px', background: 'rgba(193,169,154,0.3)', marginBottom: '2rem' }} />

            {/* Selezione colore */}
            {colori.length > 0 && (
              <div style={{ marginBottom: '1.75rem' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.16em', color: '#3a2e2b', margin: '0 0 0.875rem', fontWeight: 500 }}>
                  {colorLabel} — <span style={{ color: '#5d4d42', fontWeight: 400 }}>{selectedColore?.nome}</span>
                  {prodotto.prezzo_per_colore && selectedColore && (
                    <span style={{ color: '#c1a99a', marginLeft: '0.5rem' }}>€ {selectedColore.prezzo_aggiuntivo.toFixed(2)}</span>
                  )}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {colori.map(colore => (
                    <button key={colore.id} onClick={() => setSelectedColore(colore)} style={{
                      padding: '0.5rem 1rem', borderRadius: '1px', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.1em',
                      background: selectedColore?.id === colore.id ? '#3a2e2b' : 'transparent',
                      color: selectedColore?.id === colore.id ? '#f1eae4' : '#3a2e2b',
                      border: '1px solid', borderColor: selectedColore?.id === colore.id ? '#3a2e2b' : 'rgba(193,169,154,0.5)',
                      transition: 'all 0.2s',
                    }}>
                      {colore.nome}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selezione taglia */}
            {taglieDisponibili.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.16em', color: '#3a2e2b', margin: 0, fontWeight: 500 }}>{sizeLabel}</p>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', color: '#c1a99a', padding: 0 }}>
                    {sizeGuide}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {taglieDisponibili.map(variante => {
                    const esaurito = variante.stock === 0
                    return (
                      <button key={variante.id} onClick={() => !esaurito && setSelectedTaglia(variante.taglia)} style={{
                        width: '48px', height: '48px', borderRadius: '1px', cursor: esaurito ? 'not-allowed' : 'pointer',
                        fontFamily: 'Inter, sans-serif', fontSize: '12px', letterSpacing: '0.06em',
                        background: selectedTaglia === variante.taglia ? '#3a2e2b' : 'transparent',
                        color: esaurito ? 'rgba(193,169,154,0.4)' : selectedTaglia === variante.taglia ? '#f1eae4' : '#3a2e2b',
                        border: '1px solid', borderColor: selectedTaglia === variante.taglia ? '#3a2e2b' : esaurito ? 'rgba(193,169,154,0.2)' : 'rgba(193,169,154,0.5)',
                        transition: 'all 0.2s', textDecoration: esaurito ? 'line-through' : 'none',
                      }}>
                        {variante.taglia}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* CTA */}
            <button onClick={handleAggiungi} disabled={!selectedTaglia || !inStock} style={{
              width: '100%', padding: '1rem', borderRadius: '1px',
              cursor: (!selectedTaglia || !inStock) ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500,
              background: added ? '#c1a99a' : (!selectedTaglia || !inStock) ? 'rgba(58,46,43,0.15)' : '#3a2e2b',
              color: (!selectedTaglia || !inStock) ? '#c1a99a' : '#f1eae4',
              border: 'none', transition: 'background 0.3s', marginBottom: '1rem',
            }}>
              {added ? addedText : !inStock ? outOfStock : !selectedTaglia ? selectSize : addToCart}
            </button>

            {/* Descrizione */}
            {prodotto.descrizione && (
              <>
                <div style={{ height: '1px', background: 'rgba(193,169,154,0.3)', margin: '2rem 0 1.5rem' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.8, color: '#5d4d42', margin: 0 }}>
                  {prodotto.descrizione}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .prod-layout { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </main>
  )
}
