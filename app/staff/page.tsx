'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

// Scanner staff EquipHer: PIN -> fotocamera -> VALIDATO / NEGATO. Pensato per telefono.
type Esito = { esito: 'validato' | 'negato'; motivo?: 'gia_usato' | 'non_valido'; codice: string; usato_at?: string | null }
type Riga = { codice: string; email: string; usato_at: string | null }
type Registro = { totale: number; usati: number; lista: Riga[] }

const C = { bg: '#f1eae4', scuro: '#3a2e2b', testo: '#5d4d42', tenue: '#8a7a70', ok: '#4a7a5a', ko: '#b5604f', linea: 'rgba(58,46,43,0.18)' }
const FONT = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const ora = (d?: string | null) => d ? new Date(d).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''

export default function StaffPage() {
  const [fase, setFase] = useState<'carico' | 'pin' | 'app'>('carico')
  const [tab, setTab] = useState<'scanner' | 'registro'>('scanner')

  // ---------- accesso ----------
  const [pin, setPin] = useState('')
  const [errPin, setErrPin] = useState('')
  const [invio, setInvio] = useState(false)

  const caricaRegistro = useCallback(async () => {
    const r = await fetch('/api/staff/equipher')
    if (r.status === 401) { setFase('pin'); return null }
    return (await r.json()) as Registro
  }, [])

  const [registro, setRegistro] = useState<Registro | null>(null)
  const aggiorna = useCallback(async () => { const d = await caricaRegistro(); if (d) setRegistro(d) }, [caricaRegistro])

  useEffect(() => {
    let vivo = true
    // eslint-disable-next-line react-hooks/set-state-in-effect -- controllo iniziale della sessione staff
    caricaRegistro().then(d => { if (!vivo) return; if (d) { setRegistro(d); setFase('app') } else setFase('pin') })
    return () => { vivo = false }
  }, [caricaRegistro])

  async function accedi(valore: string) {
    setInvio(true); setErrPin('')
    const r = await fetch('/api/staff/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin: valore }) })
    if (r.ok) { setPin(''); await aggiorna(); setFase('app') }
    else { const d = await r.json().catch(() => ({})); setErrPin(d.error || 'PIN errato'); setPin('') }
    setInvio(false)
  }

  // ---------- scanner ----------
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const bloccoRef = useRef(false)          // true mentre si mostra un esito
  const ultimoRef = useRef({ c: '', t: 0 })
  const [camera, setCamera] = useState<'spenta' | 'attiva' | 'errore'>('spenta')
  const [esito, setEsito] = useState<Esito | null>(null)
  const [manuale, setManuale] = useState('')

  const ferma = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }, [])

  const verifica = useCallback(async (codice: string) => {
    bloccoRef.current = true
    let d: Esito
    try {
      const r = await fetch('/api/staff/equipher', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codice }) })
      if (r.status === 401) { setFase('pin'); bloccoRef.current = false; return }
      d = await r.json()
      if (!d.esito) throw new Error('risposta')
    } catch {
      d = { esito: 'negato', motivo: 'non_valido', codice }
      alert('Connessione assente o errore. Riprova.')
      bloccoRef.current = false
      return
    }
    setEsito(d)
    try { navigator.vibrate?.(d.esito === 'validato' ? 120 : [80, 60, 80]) } catch {}
    aggiorna()
  }, [aggiorna])

  const avvia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } }, audio: false })
      streamRef.current = stream
      const v = videoRef.current!
      v.srcObject = stream
      await v.play()
      setCamera('attiva')
      const { default: jsQR } = await import('jsqr')
      const ctx = canvasRef.current!.getContext('2d', { willReadFrequently: true })!
      const ciclo = () => {
        rafRef.current = requestAnimationFrame(ciclo)
        if (bloccoRef.current || v.readyState < 2 || !v.videoWidth) return
        const scala = Math.min(1, 640 / v.videoWidth)
        const w = Math.round(v.videoWidth * scala), h = Math.round(v.videoHeight * scala)
        const cv = canvasRef.current!
        if (cv.width !== w) { cv.width = w; cv.height = h }
        ctx.drawImage(v, 0, 0, w, h)
        const q = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' })
        const m = q?.data.trim().toUpperCase().match(/EQUIPHER-\d{3,4}/)
        if (m) {
          const ora = Date.now()
          if (ultimoRef.current.c === m[0] && ora - ultimoRef.current.t < 4000) return
          ultimoRef.current = { c: m[0], t: ora }
          verifica(m[0])
        }
      }
      ciclo()
    } catch {
      setCamera('errore')
    }
  }, [verifica])

  // la fotocamera funziona solo nella scheda Scanner
  useEffect(() => {
    if (fase !== 'app' || tab !== 'scanner') { ferma(); return }
    return () => ferma()
  }, [fase, tab, ferma])
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reset stato fotocamera al cambio scheda
  useEffect(() => { if (tab !== 'scanner') setCamera('spenta') }, [tab])

  function prossimo() { setEsito(null); ultimoRef.current.t = Date.now(); bloccoRef.current = false }

  async function annulla(codice: string) {
    await fetch('/api/staff/equipher', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codice, annulla: true }) })
    ultimoRef.current = { c: '', t: 0 }
    aggiorna(); prossimo()
  }

  // ---------- registro ----------
  const [cerca, setCerca] = useState('')
  const righe = (registro?.lista ?? []).filter(r => !cerca || r.codice.toLowerCase().includes(cerca.toLowerCase()) || r.email.toLowerCase().includes(cerca.toLowerCase()))

  // ---------- UI ----------
  const base: React.CSSProperties = { fontFamily: FONT, color: C.testo, minHeight: '100dvh', background: C.bg }
  const bottone: React.CSSProperties = { fontFamily: FONT, background: C.scuro, color: C.bg, border: 'none', borderRadius: 6, padding: '0.95rem 1.4rem', fontSize: 13, letterSpacing: '0.14em', cursor: 'pointer', width: '100%' }

  if (fase === 'carico') return <div style={base} />

  if (fase === 'pin') {
    return (
      <div style={{ ...base, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.3em', color: C.tenue, margin: '0 0 0.8rem' }}>STAFF</p>
        <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '0.22em', color: C.scuro, margin: '0 0 2.5rem' }}>ANOINTED</h1>
        <input
          type="password" inputMode="numeric" pattern="[0-9]*" maxLength={6} autoFocus autoComplete="off"
          value={pin} placeholder="PIN a 6 cifre" disabled={invio}
          onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 6); setPin(v); setErrPin(''); if (v.length === 6) accedi(v) }}
          style={{ fontFamily: FONT, fontSize: 24, textAlign: 'center', letterSpacing: '0.5em', width: '100%', maxWidth: 280, padding: '1rem', border: `1px solid ${C.linea}`, borderRadius: 6, background: 'white', color: C.scuro, outline: 'none', boxSizing: 'border-box' }}
        />
        <p style={{ fontSize: 13, color: C.ko, minHeight: 20, margin: '1rem 0 0' }}>{errPin}</p>
      </div>
    )
  }

  return (
    <div style={{ ...base, display: 'flex', flexDirection: 'column' }}>
      {/* intestazione */}
      <div style={{ background: C.scuro, color: C.bg, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 15, fontWeight: 300, letterSpacing: '0.22em' }}>ANOINTED</span>
        <span style={{ fontSize: 12, letterSpacing: '0.08em', color: '#c1a99a' }}>
          {registro ? `${registro.usati} timbrati · ${registro.totale - registro.usati} da usare` : ''}
        </span>
      </div>
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.linea}` }}>
        {(['scanner', 'registro'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, fontFamily: FONT, background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${C.scuro}` : '2px solid transparent', padding: '0.9rem', fontSize: 12, letterSpacing: '0.18em', color: tab === t ? C.scuro : C.tenue, cursor: 'pointer' }}>
            {t === 'scanner' ? 'SCANNER' : 'REGISTRO'}
          </button>
        ))}
      </div>

      {tab === 'scanner' && (
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: C.scuro, borderRadius: 8, overflow: 'hidden' }}>
            <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: camera === 'attiva' ? 'block' : 'none' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {camera === 'attiva' && (
              <div style={{ position: 'absolute', inset: '18%', border: '2px solid rgba(241,234,228,0.85)', borderRadius: 12, pointerEvents: 'none' }} />
            )}
            {camera !== 'attiva' && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.5rem', textAlign: 'center', color: C.bg }}>
                <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, color: '#c1a99a' }}>
                  {camera === 'errore' ? 'Fotocamera non disponibile. Consenti l’accesso alla fotocamera nelle impostazioni del browser, oppure scrivi il codice qui sotto.' : 'Inquadra il QR del pass per timbrarlo.'}
                </p>
                <button onClick={avvia} style={{ ...bottone, background: C.bg, color: C.scuro, maxWidth: 240 }}>{camera === 'errore' ? 'RIPROVA' : 'ATTIVA FOTOCAMERA'}</button>
              </div>
            )}
          </div>

          <form onSubmit={e => { e.preventDefault(); if (manuale.trim()) { verifica(manuale.trim()); setManuale('') } }} style={{ display: 'flex', gap: 8 }}>
            <input value={manuale} onChange={e => setManuale(e.target.value)} placeholder="Codice a mano (es. 12)" autoComplete="off" autoCapitalize="characters"
              style={{ flex: 1, fontFamily: FONT, fontSize: 16, padding: '0.85rem 1rem', border: `1px solid ${C.linea}`, borderRadius: 6, background: 'white', color: C.scuro, outline: 'none', minWidth: 0 }} />
            <button type="submit" style={{ ...bottone, width: 'auto', padding: '0.85rem 1.2rem' }}>VERIFICA</button>
          </form>
        </div>
      )}

      {tab === 'registro' && (
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {[['Iscritti', registro?.totale ?? 0], ['Timbrati', registro?.usati ?? 0], ['Da usare', (registro?.totale ?? 0) - (registro?.usati ?? 0)]].map(([l, n]) => (
              <div key={l as string} style={{ flex: 1, background: 'white', borderRadius: 8, padding: '0.9rem 0.5rem', textAlign: 'center', border: `1px solid ${C.linea}` }}>
                <div style={{ fontSize: 26, fontWeight: 300, color: C.scuro }}>{n}</div>
                <div style={{ fontSize: 10, letterSpacing: '0.16em', color: C.tenue, textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
          <input value={cerca} onChange={e => setCerca(e.target.value)} placeholder="Cerca codice o email" autoComplete="off"
            style={{ fontFamily: FONT, fontSize: 16, padding: '0.85rem 1rem', border: `1px solid ${C.linea}`, borderRadius: 6, background: 'white', color: C.scuro, outline: 'none' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {righe.length === 0 && <p style={{ fontSize: 13, color: C.tenue, textAlign: 'center', margin: '1.5rem 0' }}>Nessun pass.</p>}
            {righe.map(r => (
              <div key={r.codice} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0', borderBottom: `1px solid ${C.linea}` }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: C.scuro, letterSpacing: '0.06em' }}>{r.codice}</div>
                  <div style={{ fontSize: 12, color: C.tenue }}>{r.email}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.14em', color: r.usato_at ? C.ko : C.ok }}>{r.usato_at ? 'TIMBRATO' : 'DA USARE'}</div>
                  {r.usato_at && <div style={{ fontSize: 11, color: C.tenue }}>{ora(r.usato_at)}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* esito a tutto schermo */}
      {esito && (
        <div onClick={esito.esito === 'validato' ? prossimo : undefined}
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: esito.esito === 'validato' ? C.ok : C.ko, color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', textAlign: 'center', gap: '0.6rem' }}>
          <div style={{ fontSize: 64, lineHeight: 1 }}>{esito.esito === 'validato' ? '✓' : '✕'}</div>
          <h2 style={{ fontSize: 34, fontWeight: 300, letterSpacing: '0.22em', margin: '0.4rem 0 0' }}>{esito.esito === 'validato' ? 'VALIDATO' : 'NEGATO'}</h2>
          <p style={{ fontFamily: 'monospace', fontSize: 20, letterSpacing: '0.1em', margin: '0.6rem 0 0', opacity: 0.95 }}>{esito.codice}</p>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0.4rem 0 0', opacity: 0.95 }}>
            {esito.esito === 'validato'
              ? '10% da applicare. Pass timbrato.'
              : esito.motivo === 'gia_usato' ? `Già utilizzato il ${ora(esito.usato_at)}` : 'Codice non riconosciuto'}
          </p>
          <div style={{ marginTop: '2.2rem', display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300 }}>
            <button onClick={e => { e.stopPropagation(); prossimo() }} style={{ ...bottone, background: 'white', color: C.scuro }}>PROSSIMO</button>
            {esito.esito === 'validato' && (
              <button onClick={e => { e.stopPropagation(); annulla(esito.codice) }} style={{ ...bottone, background: 'transparent', border: '1px solid rgba(255,255,255,0.7)', color: 'white' }}>ANNULLA TIMBRO</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
