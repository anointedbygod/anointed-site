// Rate limit best-effort in memoria (per istanza serverless): fermano abusi banali e script semplici.
// Per un blocco rigoroso a livello di rete usare il Firewall/WAF di Vercel.
const finestre = new Map<string, number[]>()

export function ipDa(req: Request) {
  return (req.headers.get('x-forwarded-for') || 'x').split(',')[0].trim()
}

/** true se la chiave ha superato `max` richieste negli ultimi `ms` millisecondi. */
export function limitato(chiave: string, max: number, ms: number) {
  const ora = Date.now()
  const recenti = (finestre.get(chiave) || []).filter(t => ora - t < ms)
  recenti.push(ora)
  finestre.set(chiave, recenti)
  if (finestre.size > 5000) for (const [k, v] of finestre) if (!v.some(t => ora - t < ms)) finestre.delete(k)
  return recenti.length > max
}

/** Le chiamate che cambiano dati devono arrivare dal nostro sito (difesa CSRF aggiuntiva). */
export function origineValida(req: Request) {
  const o = req.headers.get('origin')
  if (!o) return true // chiamate server-to-server / stessa origine senza header
  try {
    const host = req.headers.get('host') || ''
    return new URL(o).host === host
  } catch { return false }
}
