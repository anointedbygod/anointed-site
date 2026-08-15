import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Articolo {
  varianteId: string
  prodottoNome: string
  taglia: string
  colore: string
  prezzo: number
  quantita: number
  immagine: string
}

interface CarrelloStore {
  articoli: Articolo[]
  aggiungi: (articolo: Articolo) => void
  rimuovi: (varianteId: string) => void
  aggiorna: (varianteId: string, quantita: number) => void
  svuota: () => void
  totale: () => number
}

export const useCarrello = create<CarrelloStore>()(
  persist(
    (set, get) => ({
      articoli: [],
      aggiungi: (articolo) => set((state) => {
        const esistente = state.articoli.find(a => a.varianteId === articolo.varianteId)
        if (esistente) {
          return { articoli: state.articoli.map(a => a.varianteId === articolo.varianteId ? { ...a, quantita: a.quantita + 1 } : a) }
        }
        return { articoli: [...state.articoli, articolo] }
      }),
      rimuovi: (varianteId) => set((state) => ({ articoli: state.articoli.filter(a => a.varianteId !== varianteId) })),
      aggiorna: (varianteId, quantita) => set((state) => ({ articoli: state.articoli.map(a => a.varianteId === varianteId ? { ...a, quantita } : a) })),
      svuota: () => set({ articoli: [] }),
      totale: () => get().articoli.reduce((sum, a) => sum + a.prezzo * a.quantita, 0),
    }),
    { name: 'carrello-anointed' }
  )
)
