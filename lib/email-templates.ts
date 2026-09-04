// Template email ANOINTED — stile coerente col brand

const BASE = `
  font-family: 'Georgia', serif;
  background: #f1eae4;
  color: #3a2e2b;
  max-width: 600px;
  margin: 0 auto;
`

export function emailConfermaOrdine({
  nome,
  ordineId,
  prodotti,
  totale,
  indirizzo,
}: {
  nome: string
  ordineId: string
  prodotti: { nome: string; taglia: string; colore: string; quantita: number; prezzo: number }[]
  totale: number
  indirizzo: { indirizzo: string; citta: string; cap: string; paese: string }
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#e8d2c3;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#e8d2c3;padding:40px 20px;">
<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#f1eae4;border-radius:4px;overflow:hidden;">

  <!-- Header -->
  <tr>
    <td style="background:#3a2e2b;padding:40px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:22px;font-weight:400;letter-spacing:0.28em;color:#f1eae4;margin:0;">ANOINTED</p>
      <p style="font-family:Georgia,serif;font-size:10px;letter-spacing:0.18em;color:#c1a99a;margin:8px 0 0;">CHOSEN. SET APART. APPOINTED.</p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:48px 40px;">
      <p style="font-family:Georgia,serif;font-size:10px;letter-spacing:0.2em;color:#c1a99a;margin:0 0 16px;">— ORDER CONFIRMED —</p>
      <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#3a2e2b;margin:0 0 16px;line-height:1.3;">Thank you, ${nome}.</h1>
      <p style="font-family:Georgia,serif;font-size:14px;line-height:1.8;color:#5d4d42;margin:0 0 32px;">
        Your order has been received. We will notify you when it ships.
      </p>

      <!-- Ordine ID -->
      <div style="background:#e8d2c3;border-radius:4px;padding:16px 20px;margin-bottom:32px;">
        <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.14em;color:#c1a99a;margin:0 0 4px;">ORDER NUMBER</p>
        <p style="font-family:monospace;font-size:14px;color:#3a2e2b;margin:0;">#${ordineId.slice(0, 8).toUpperCase()}</p>
      </div>

      <!-- Prodotti -->
      <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.14em;color:#c1a99a;margin:0 0 16px;">YOUR ITEMS</p>
      ${prodotti.map(p => `
      <div style="border-top:1px solid rgba(193,169,154,0.3);padding:16px 0;display:flex;justify-content:space-between;">
        <div>
          <p style="font-family:Georgia,serif;font-size:14px;color:#3a2e2b;margin:0 0 4px;">${p.nome}</p>
          <p style="font-family:Georgia,serif;font-size:12px;color:#c1a99a;margin:0;">${p.taglia} · ${p.colore} · Qtà ${p.quantita}</p>
        </div>
        <p style="font-family:Georgia,serif;font-size:14px;color:#3a2e2b;margin:0;">€ ${(p.prezzo * p.quantita).toFixed(2)}</p>
      </div>
      `).join('')}
      <div style="border-top:1px solid rgba(193,169,154,0.3);padding-top:16px;text-align:right;margin-bottom:32px;">
        <p style="font-family:Georgia,serif;font-size:16px;font-weight:600;color:#3a2e2b;margin:0;">Totale: € ${totale.toFixed(2)}</p>
      </div>

      <!-- Indirizzo -->
      <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.14em;color:#c1a99a;margin:0 0 12px;">SHIPPING ADDRESS</p>
      <p style="font-family:Georgia,serif;font-size:14px;line-height:1.8;color:#5d4d42;margin:0 0 40px;">
        ${indirizzo.indirizzo}<br>
        ${indirizzo.cap} ${indirizzo.citta}<br>
        ${indirizzo.paese}
      </p>

      <p style="font-family:Georgia,serif;font-size:13px;line-height:1.8;color:#5d4d42;margin:0;">
        For any questions, contact us at <a href="mailto:info@anointed.it" style="color:#3a2e2b;">info@anointed.it</a>
      </p>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#3a2e2b;padding:32px 40px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.14em;color:#c1a99a;margin:0 0 8px;">ANOINTED</p>
      <p style="font-family:Georgia,serif;font-size:10px;color:rgba(241,234,228,0.4);margin:0;">© 2026 Anointed. All rights reserved.</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>
  `
}

export function emailBenvenutoNewsletter({ email, codice = 'WELCOME10' }: { email: string; codice?: string }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#e8d2c3;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#e8d2c3;padding:40px 20px;">
<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#f1eae4;border-radius:4px;overflow:hidden;">

  <tr>
    <td style="background:#3a2e2b;padding:40px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:22px;font-weight:400;letter-spacing:0.28em;color:#f1eae4;margin:0;">ANOINTED</p>
      <p style="font-family:Georgia,serif;font-size:10px;letter-spacing:0.18em;color:#c1a99a;margin:8px 0 0;">CHOSEN. SET APART. APPOINTED.</p>
    </td>
  </tr>

  <tr>
    <td style="padding:48px 40px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:10px;letter-spacing:0.2em;color:#c1a99a;margin:0 0 16px;">— WELCOME —</p>
      <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#3a2e2b;margin:0 0 16px;line-height:1.3;">You are in the circle.</h1>
      <p style="font-family:Georgia,serif;font-size:14px;line-height:1.8;color:#5d4d42;margin:0 0 40px;">
        Thank you for subscribing. Here is your 10% discount code for your first order.
      </p>

      <!-- Codice sconto -->
      <div style="background:#3a2e2b;border-radius:4px;padding:24px 32px;margin-bottom:40px;display:inline-block;">
        <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.14em;color:#c1a99a;margin:0 0 8px;">YOUR CODE</p>
        <p style="font-family:monospace;font-size:24px;font-weight:700;color:#f1eae4;margin:0;letter-spacing:0.1em;">${codice}</p>
      </div>

      <p style="font-family:Georgia,serif;font-size:13px;line-height:1.8;color:#5d4d42;margin:0 0 32px;">
        Enter the code at checkout to get 10% off your first order.
      </p>

      <a href="https://anointed.it" style="display:inline-block;background:#3a2e2b;color:#f1eae4;font-family:Georgia,serif;font-size:11px;letter-spacing:0.16em;text-decoration:none;padding:14px 32px;border-radius:2px;">
        DISCOVER THE COLLECTION
      </a>
    </td>
  </tr>

  <tr>
    <td style="background:#3a2e2b;padding:32px 40px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.14em;color:#c1a99a;margin:0 0 8px;">ANOINTED</p>
      <p style="font-family:Georgia,serif;font-size:10px;color:rgba(241,234,228,0.4);margin:0;">© 2026 Anointed. All rights reserved.</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>
  `
}

export function emailCarrelloAbbandonato({
  nome,
  prodotti,
  totale,
}: {
  nome: string
  prodotti: { nome: string; prezzo: number; immagine?: string }[]
  totale: number
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#e8d2c3;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#e8d2c3;padding:40px 20px;">
<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#f1eae4;border-radius:4px;overflow:hidden;">

  <tr>
    <td style="background:#3a2e2b;padding:40px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:22px;font-weight:400;letter-spacing:0.28em;color:#f1eae4;margin:0;">ANOINTED</p>
      <p style="font-family:Georgia,serif;font-size:10px;letter-spacing:0.18em;color:#c1a99a;margin:8px 0 0;">CHOSEN. SET APART. APPOINTED.</p>
    </td>
  </tr>

  <tr>
    <td style="padding:48px 40px;">
      <p style="font-family:Georgia,serif;font-size:10px;letter-spacing:0.2em;color:#c1a99a;margin:0 0 16px;">— YOU FORGOT SOMETHING —</p>
      <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#3a2e2b;margin:0 0 16px;line-height:1.3;">${nome}, your cart is waiting.</h1>
      <p style="font-family:Georgia,serif;font-size:14px;line-height:1.8;color:#5d4d42;margin:0 0 32px;">
        You left some items in your cart. Complete your order before they sell out.
      </p>

      ${prodotti.map(p => `
      <div style="border-top:1px solid rgba(193,169,154,0.3);padding:16px 0;display:flex;justify-content:space-between;align-items:center;">
        <p style="font-family:Georgia,serif;font-size:14px;color:#3a2e2b;margin:0;">${p.nome}</p>
        <p style="font-family:Georgia,serif;font-size:14px;color:#3a2e2b;margin:0;">€ ${p.prezzo.toFixed(2)}</p>
      </div>
      `).join('')}

      <div style="border-top:1px solid rgba(193,169,154,0.3);padding:16px 0 32px;text-align:right;">
        <p style="font-family:Georgia,serif;font-size:16px;font-weight:600;color:#3a2e2b;margin:0;">Totale: € ${totale.toFixed(2)}</p>
      </div>

      <div style="text-align:center;">
        <a href="https://anointed.it/checkout" style="display:inline-block;background:#3a2e2b;color:#f1eae4;font-family:Georgia,serif;font-size:11px;letter-spacing:0.16em;text-decoration:none;padding:14px 32px;border-radius:2px;">
          COMPLETA L'ORDINE
        </a>
      </div>
    </td>
  </tr>

  <tr>
    <td style="background:#3a2e2b;padding:32px 40px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.14em;color:#c1a99a;margin:0 0 8px;">ANOINTED</p>
      <p style="font-family:Georgia,serif;font-size:10px;color:rgba(241,234,228,0.4);margin:0;">© 2026 Anointed. All rights reserved.</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>
  `
}

export function emailOrdineSpedito({ nome, ordineId, trackingUrl }: { nome: string; ordineId: string; trackingUrl: string }) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#e8d2c3;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#e8d2c3;padding:40px 20px;"><tr><td><table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#f1eae4;border-radius:4px;overflow:hidden;"><tr><td style="background:#3a2e2b;padding:40px;text-align:center;"><p style="font-family:Georgia,serif;font-size:22px;letter-spacing:0.28em;color:#f1eae4;margin:0;">ANOINTED</p><p style="font-family:Georgia,serif;font-size:10px;letter-spacing:0.18em;color:#c1a99a;margin:8px 0 0;">CHOSEN. SET APART. APPOINTED.</p></td></tr><tr><td style="padding:48px 40px;text-align:center;"><p style="font-family:Georgia,serif;font-size:10px;letter-spacing:0.2em;color:#c1a99a;margin:0 0 16px;">— ORDER SHIPPED —</p><h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#3a2e2b;margin:0 0 16px;">On its way to you, ${nome}.</h1><p style="font-family:Georgia,serif;font-size:14px;line-height:1.8;color:#5d4d42;margin:0 0 8px;">Il tuo ordine <strong>#${ordineId.slice(0,8).toUpperCase()}</strong> has been shipped.</p><p style="font-family:Georgia,serif;font-size:14px;line-height:1.8;color:#5d4d42;margin:0 0 40px;">You can track your package in real time by clicking the button below.</p><a href="${trackingUrl}" style="display:inline-block;background:#3a2e2b;color:#f1eae4;font-family:Georgia,serif;font-size:11px;letter-spacing:0.16em;text-decoration:none;padding:16px 40px;border-radius:2px;">TRACK YOUR ORDER →</a><p style="font-family:Georgia,serif;font-size:12px;color:#c1a99a;margin:40px 0 0;">For any questions, contact us at <a href="mailto:info@anointed.it" style="color:#3a2e2b;">info@anointed.it</a></p></td></tr><tr><td style="background:#3a2e2b;padding:32px 40px;text-align:center;"><p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.14em;color:#c1a99a;margin:0 0 8px;">ANOINTED</p><p style="font-family:Georgia,serif;font-size:10px;color:rgba(241,234,228,0.4);margin:0;">© 2026 Anointed. All rights reserved.</p></td></tr></table></td></tr></table></body></html>`
}
