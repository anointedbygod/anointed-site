// Interruttore globale: finché è true i capi sono "Coming soon" e l'acquisto è disattivato
// (sia nell'interfaccia sia lato server, nell'API checkout). Metti false al lancio.
export const COMING_SOON = true

// Sottocategorie di primo livello in Collections. Per aggiungere "Man": nuova voce qui
// (e, quando ci saranno i prodotti, un campo "genere" sui prodotti per filtrare).
export const GENERI = [{ value: 'woman', label: 'Woman' }] as const
