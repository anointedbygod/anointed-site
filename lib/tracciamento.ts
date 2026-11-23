// Eventi per Google Analytics (e in futuro Meta Pixel).
// Non fa nulla se gli strumenti non sono caricati (sviluppo, anteprime, consenso negato).
// Gli script si caricano dal layout e partono solo dopo il consenso cookie (Iubenda).

export const GA_ID = 'G-05LJ06QF2S'

type Prodotto = { id: string; nome: string; prezzo: number; quantita?: number; variante?: string }

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

function invia(evento: string, parametri: Record<string, unknown>) {
  try { window.gtag?.('event', evento, parametri) } catch { /* mai bloccare il sito per le statistiche */ }
}

const voce = (p: Prodotto) => ({ item_id: p.id, item_name: p.nome, item_variant: p.variante, price: p.prezzo, quantity: p.quantita ?? 1 })

export const tracciaVistaProdotto = (p: Prodotto) =>
  invia('view_item', { currency: 'EUR', value: p.prezzo, items: [voce(p)] })

export const tracciaAggiuntaCarrello = (p: Prodotto) =>
  invia('add_to_cart', { currency: 'EUR', value: p.prezzo * (p.quantita ?? 1), items: [voce(p)] })

// Salva il totale per l'evento di acquisto: la pagina di conferma lo legge dopo il ritorno da Stripe
export function tracciaInizioCheckout(prodotti: Prodotto[], totale: number) {
  invia('begin_checkout', { currency: 'EUR', value: totale, items: prodotti.map(voce) })
  try { sessionStorage.setItem('anointed-checkout', JSON.stringify({ totale, items: prodotti.map(voce) })) } catch {}
}

export function tracciaAcquisto(idTransazione: string) {
  try {
    const salvato = sessionStorage.getItem('anointed-checkout')
    if (!salvato) return
    const { totale, items } = JSON.parse(salvato)
    invia('purchase', { transaction_id: idTransazione, currency: 'EUR', value: totale, items })
    sessionStorage.removeItem('anointed-checkout') // niente doppioni se la pagina si ricarica
  } catch {}
}
