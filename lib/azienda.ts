// Dati del venditore, mostrati nel footer e nelle Condizioni di vendita.
// Fonte: visura camerale del 02/10/2026 (CCIAA Vicenza), impresa individuale.
// Obblighi: art. 35 DPR 633/72 (P.IVA in home), D.Lgs. 70/2003 art. 7, Codice del Consumo.
// I campi vuoti non vengono mostrati.
export const AZIENDA = {
  ragioneSociale: 'Sofia Meneghetti – impresa individuale (ANOINTED)',
  partitaIva: 'IT04639380247',
  codiceFiscale: '',    // volutamente vuoto: e' il C.F. personale di Sofia, per legge basta la P.IVA
  sede: 'Viale Asiago 113, 36061 Bassano del Grappa (VI), Italia',
  rea: 'VI-418964',
  capitaleSociale: '',  // non applicabile: impresa individuale
  pec: 'sofia.meneghetti@pec.it',
  email: 'info@anointed.it',
}

export function datiVenditore() {
  const a = AZIENDA
  return [
    a.ragioneSociale,
    a.partitaIva && `P.IVA ${a.partitaIva.replace(/^P\.?\s*IVA\s*/i, '')}`,
    a.codiceFiscale && `C.F. ${a.codiceFiscale}`,
    a.sede,
    a.rea && `REA ${a.rea}`,
    a.capitaleSociale && `Capitale sociale ${a.capitaleSociale}`,
  ].filter(Boolean) as string[]
}
