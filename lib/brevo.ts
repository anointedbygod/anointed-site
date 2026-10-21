// Sincronizzazione newsletter con Brevo (lista contatti). Mai bloccante: se manca la chiave
// (es. in locale) o Brevo non risponde, l'iscrizione su Supabase funziona comunque.
// Variabili: BREVO_API_KEY (secret, solo server) e BREVO_LIST_ID (numero della lista).
const API = 'https://api.brevo.com/v3'

function config() {
  const key = process.env.BREVO_API_KEY
  const list = Number(process.env.BREVO_LIST_ID)
  return key && Number.isInteger(list) && list > 0 ? { key, list } : null
}

async function chiama(key: string, path: string, method: string, body: unknown) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Brevo ${method} ${path} -> ${res.status} ${(await res.text()).slice(0, 200)}`)
}

// Iscrive (o riattiva) il contatto nella lista: da chiamare SOLO dopo il consenso esplicito.
export async function brevoIscrivi(email: string) {
  const c = config()
  if (!c) return
  try {
    await chiama(c.key, '/contacts', 'POST', { email, listIds: [c.list], updateEnabled: true, emailBlacklisted: false })
  } catch (err) {
    console.error('Brevo iscrizione fallita:', err)
  }
}

// Disiscrizione: il contatto viene bloccato in Brevo, quindi non riceverà più campagne.
export async function brevoDisiscrivi(email: string) {
  const c = config()
  if (!c) return
  try {
    await chiama(c.key, `/contacts/${encodeURIComponent(email)}`, 'PUT', { emailBlacklisted: true })
  } catch (err) {
    console.error('Brevo disiscrizione fallita:', err)
  }
}
