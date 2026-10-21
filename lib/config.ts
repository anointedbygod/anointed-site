// Interruttore globale: finché è true i capi e le categorie sono "COMING SOON":
// nomi nascosti sia nell'interfaccia sia nelle API pubbliche, acquisto bloccato lato server.
// Al lancio metti false.
export const COMING_SOON = true

// Sottocategorie di primo livello in Collections (ognuna avrà le sue categorie e i suoi prodotti).
// "Man" non è ancora lanciato: mostra sempre COMING SOON. Quando ci saranno i dati,
// serve un campo "genere" su sezioni/prodotti nel database per filtrare.
export const GENERI = [
  { value: 'woman', label: 'Woman', attivo: true },
  { value: 'man', label: 'Man', attivo: false }, // metti true quando Man sarà pronto: compare ovunque
] as const
export type Genere = (typeof GENERI)[number]['value']
// Solo i generi visibili sul sito
export const GENERI_ATTIVI = GENERI.filter(g => g.attivo)
