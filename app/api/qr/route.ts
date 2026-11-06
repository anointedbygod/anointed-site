import QRCode from 'qrcode'

// QR del pass EquipHer: contiene solo il codice (testo), letto dallo scanner dello staff.
export async function GET(req: Request) {
  const c = new URL(req.url).searchParams.get('c') || ''
  if (!/^EQUIPHER-\d{3,4}$/.test(c)) return new Response('not found', { status: 404 })
  const buf = await QRCode.toBuffer(c, { width: 400, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#3a2e2b', light: '#ffffff' } })
  return new Response(new Uint8Array(buf), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' } })
}
