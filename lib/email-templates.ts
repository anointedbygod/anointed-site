// Template email ANOINTED — stile coerente col brand

const BASE = `
  font-family: 'Georgia', serif;
  background: #f1eae4;
  color: #3a2e2b;
  max-width: 600px;
  margin: 0 auto;
`

import { AZIENDA, datiVenditore } from '@/lib/azienda'

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

      <p style="font-family:Georgia,serif;font-size:13px;line-height:1.8;color:#5d4d42;margin:0 0 32px;">
        For any questions, contact us at <a href="mailto:info@anointed.it" style="color:#3a2e2b;">info@anointed.it</a>
      </p>

      <!-- Informazioni obbligatorie (art. 49 e 51 Codice del Consumo) -->
      <div style="border-top:1px solid rgba(193,169,154,0.3);padding-top:20px;">
        <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.14em;color:#c1a99a;margin:0 0 10px;">RIGHT OF WITHDRAWAL · DIRITTO DI RECESSO</p>
        <p style="font-family:Georgia,serif;font-size:12px;line-height:1.7;color:#5d4d42;margin:0 0 10px;">
          You may withdraw from this purchase within 14 days of receiving the goods, without giving any reason. Write to ${AZIENDA.email} or ${AZIENDA.pec}; model form and procedure: <a href="https://www.anointed.it/en/resi" style="color:#3a2e2b;">Returns &amp; Refunds</a>. Return shipping costs are borne by the customer. Legal guarantee of conformity: 2 years from delivery. Full terms: <a href="https://www.anointed.it/en/condizioni" style="color:#3a2e2b;">Terms of Sale</a>.
        </p>
        <p style="font-family:Georgia,serif;font-size:12px;line-height:1.7;color:#5d4d42;margin:0 0 10px;">
          Puoi recedere dall'acquisto entro 14 giorni dal ricevimento della merce, senza dover fornire alcuna motivazione. Scrivi a ${AZIENDA.email} o ${AZIENDA.pec}; modulo tipo e procedura: <a href="https://www.anointed.it/it/resi" style="color:#3a2e2b;">Resi e Rimborsi</a>. Le spese di restituzione sono a carico del cliente. Garanzia legale di conformità: 2 anni dalla consegna. Condizioni complete: <a href="https://www.anointed.it/it/condizioni" style="color:#3a2e2b;">Condizioni di Vendita</a>.
        </p>
        <p style="font-family:Georgia,serif;font-size:11px;line-height:1.7;color:#8a7a70;margin:0;">${datiVenditore().join(' · ')}</p>
      </div>
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

export function emailBenvenutoNewsletter({ email, codice = 'WELCOME10', locale = 'en', unsubUrl }: { email: string; codice?: string; locale?: 'en' | 'it'; unsubUrl?: string }) {
  const L = locale === 'it'
    ? {
        tagline: 'SCELTA. MESSA DA PARTE. NOMINATA.',
        heading: 'Sei scelta.',
        salutation: 'Cara donna,',
        paragraphs: [
          'se sei arrivata fin qui, vorrei lasciarti un piccolo promemoria:',
        ],
        chosenLine: 'sei scelta.',
        chosenList: ['Scelta da Dio.', 'Creata con intenzione.', 'Con valore.', 'Con uno scopo.'],
        paragraphs2: [
          'ANOINTED nasce dal desiderio di creare qualcosa che vada oltre ciò che indossiamo. Qualcosa che possa ricordarti chi sei, ciò che porti dentro di te e la donna che sei chiamata a diventare.',
          'Crediamo che ogni donna abbia una storia unica, dei doni da custodire e uno scopo da vivere.',
          'Per questo ogni pezzo ANOINTED vuole essere più di qualcosa di bello da indossare.',
          'Vuole essere un reminder di identità, grazia, fede, forza e purpose.',
          'Un piccolo segno da portare con te, ogni giorno, per ricordarti che non sei qui per caso.',
          'Qualunque sia la stagione che stai vivendo, non dimenticare mai che la tua storia ha valore e che ciò che hai dentro di te può fare la differenza.',
        ],
        closingList: ['Continua a credere.', 'Continua a costruire.', 'Continua a diventare la donna che sei chiamata ad essere.'],
        finalChosen: 'You are chosen.',
        signoff: 'Con affetto,',
        signature: 'Sofia',
        role: 'Founder, ANOINTED',
        codeLabel: 'IL TUO CODICE',
        codeIntro: 'Come piccolo dono di benvenuto, ecco il tuo codice sconto per il tuo primo ordine.',
        codeInstructions: 'Inseriscilo al checkout per ricevere il 10% di sconto sul tuo primo ordine.',
        cta: 'SCOPRI LA COLLEZIONE',
      }
    : {
        tagline: 'CHOSEN. SET APART. APPOINTED.',
        heading: 'You are chosen.',
        salutation: 'Dear woman,',
        paragraphs: [
          "if you've made it this far, I want to leave you with a small reminder:",
        ],
        chosenLine: 'you are chosen.',
        chosenList: ['Chosen by God.', 'Created with intention.', 'With value.', 'With purpose.'],
        paragraphs2: [
          'ANOINTED was born from the desire to create something that goes beyond what we wear. Something that can remind you of who you are, what you carry within you, and the woman you are called to become.',
          'We believe every woman has a unique story, gifts worth holding onto, and a purpose worth living.',
          'That is why every ANOINTED piece wants to be more than something beautiful to wear.',
          'It wants to be a reminder of identity, grace, faith, strength and purpose.',
          'A small sign to carry with you, every day, to remind you that you are not here by chance.',
          'Whatever season you are in right now, never forget that your story has value, and that what you carry within you can make a difference.',
        ],
        closingList: ['Keep believing.', 'Keep building.', 'Keep becoming the woman you are called to be.'],
        finalChosen: 'You are chosen.',
        signoff: 'With love,',
        signature: 'Sofia',
        role: 'Founder, ANOINTED',
        codeLabel: 'YOUR CODE',
        codeIntro: 'As a small welcome gift, here is your discount code for your first order.',
        codeInstructions: 'Enter the code at checkout to get 10% off your first order.',
        cta: 'DISCOVER THE COLLECTION',
      }

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
      <p style="font-family:Georgia,serif;font-size:10px;letter-spacing:0.18em;color:#c1a99a;margin:8px 0 0;">${L.tagline}</p>
    </td>
  </tr>

  <tr>
    <td style="padding:48px 40px;">
      <h1 style="font-family:Georgia,serif;font-size:26px;font-style:italic;font-weight:400;color:#3a2e2b;margin:0 0 28px;line-height:1.3;text-align:center;">${L.heading}</h1>

      <p style="font-family:Georgia,serif;font-size:14px;line-height:1.85;color:#5d4d42;margin:0 0 20px;">${L.salutation}</p>
      ${L.paragraphs.map(p => `<p style="font-family:Georgia,serif;font-size:14px;line-height:1.85;color:#5d4d42;margin:0 0 20px;">${p}</p>`).join('\n      ')}

      <p style="font-family:Georgia,serif;font-size:18px;font-style:italic;font-weight:600;color:#3a2e2b;margin:0 0 20px;">${L.chosenLine}</p>

      <p style="font-family:Georgia,serif;font-size:14px;line-height:1.9;color:#5d4d42;margin:0 0 28px;">
        ${L.chosenList.join('<br>')}
      </p>

      ${L.paragraphs2.map(p => `<p style="font-family:Georgia,serif;font-size:14px;line-height:1.85;color:#5d4d42;margin:0 0 20px;">${p}</p>`).join('\n      ')}

      <p style="font-family:Georgia,serif;font-size:14px;line-height:1.9;color:#5d4d42;margin:0 0 28px;">
        ${L.closingList.join('<br>')}
      </p>

      <p style="font-family:Georgia,serif;font-size:18px;font-style:italic;font-weight:600;color:#3a2e2b;margin:0 0 36px;text-align:center;">${L.finalChosen}</p>

      <p style="font-family:Georgia,serif;font-size:14px;line-height:1.7;color:#5d4d42;margin:0 0 4px;">${L.signoff}</p>
      <p style="font-family:Georgia,serif;font-size:16px;font-style:italic;color:#3a2e2b;margin:0 0 2px;">${L.signature}</p>
      <p style="font-family:Georgia,serif;font-size:12px;letter-spacing:0.08em;color:#c1a99a;margin:0 0 40px;">${L.role}</p>

      <div style="border-top:1px solid rgba(193,169,154,0.3);padding-top:36px;text-align:center;">
        <p style="font-family:Georgia,serif;font-size:13px;line-height:1.8;color:#5d4d42;margin:0 0 24px;">
          ${L.codeIntro}
        </p>

        <!-- Codice sconto -->
        <div style="background:#3a2e2b;border-radius:4px;padding:24px 32px;margin-bottom:24px;display:inline-block;">
          <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.14em;color:#c1a99a;margin:0 0 8px;">${L.codeLabel}</p>
          <p style="font-family:monospace;font-size:24px;font-weight:700;color:#f1eae4;margin:0;letter-spacing:0.1em;">${codice}</p>
        </div>

        <p style="font-family:Georgia,serif;font-size:13px;line-height:1.8;color:#5d4d42;margin:0 0 32px;">
          ${L.codeInstructions}
        </p>

        <a href="https://anointed.it" style="display:inline-block;background:#3a2e2b;color:#f1eae4;font-family:Georgia,serif;font-size:11px;letter-spacing:0.16em;text-decoration:none;padding:14px 32px;border-radius:2px;">
          ${L.cta}
        </a>
      </div>
    </td>
  </tr>

  <tr>
    <td style="background:#3a2e2b;padding:32px 40px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.14em;color:#c1a99a;margin:0 0 8px;">ANOINTED</p>
${unsubUrl ? `<p style="font-family:Georgia,serif;font-size:10px;color:rgba(241,234,228,0.55);margin:0 0 8px;">${locale === 'it' ? 'Ricevi questa email perché ti sei iscritta alla newsletter di ANOINTED.' : 'You receive this email because you subscribed to ANOINTED.'} <a href="${unsubUrl}" style="color:#c1a99a;">${locale === 'it' ? 'Annulla l\'iscrizione' : 'Unsubscribe'}</a></p>` : ''}
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
  carrelloId,
  unsubUrl,
}: {
  nome: string
  prodotti: { nome: string; prezzo: number; immagine?: string }[]
  totale: number
  carrelloId: string
  unsubUrl?: string
}) {
  const locale = 'en'
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
        <a href="https://anointed.it/recupera-carrello?id=${carrelloId}" style="display:inline-block;background:#3a2e2b;color:#f1eae4;font-family:Georgia,serif;font-size:11px;letter-spacing:0.16em;text-decoration:none;padding:14px 32px;border-radius:2px;">
          COMPLETE YOUR ORDER
        </a>
      </div>
    </td>
  </tr>

  <tr>
    <td style="background:#3a2e2b;padding:32px 40px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.14em;color:#c1a99a;margin:0 0 8px;">ANOINTED</p>
${unsubUrl ? `<p style="font-family:Georgia,serif;font-size:10px;color:rgba(241,234,228,0.55);margin:0 0 8px;">${false ? 'Ricevi questa email perché ti sei iscritta alla newsletter di ANOINTED.' : 'You receive this email because you subscribed to ANOINTED.'} <a href="${unsubUrl}" style="color:#c1a99a;">${false ? 'Annulla l\'iscrizione' : 'Unsubscribe'}</a></p>` : ''}
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

// Email di conferma iscrizione newsletter (doppio consenso)
export function emailConfermaNewsletter({ locale = 'en', confirmUrl }: { locale?: 'en' | 'it'; confirmUrl: string }) {
  const isIt = locale === 'it'
  const L = isIt
    ? { heading: 'Conferma la tua iscrizione', body: 'Hai chiesto di iscriverti alla newsletter di ANOINTED. Conferma il tuo indirizzo con un clic: subito dopo ti invieremo il tuo codice sconto.', cta: 'CONFERMA ISCRIZIONE', ignore: 'Se non sei stata tu, ignora questa email: non verrai iscritta e non riceverai altro. Il link scade tra 7 giorni.' }
    : { heading: 'Confirm your subscription', body: 'You asked to join the ANOINTED newsletter. Confirm your address with one click and we will send you your discount code right after.', cta: 'CONFIRM SUBSCRIPTION', ignore: 'If this was not you, just ignore this email: you will not be subscribed and you will not receive anything else. The link expires in 7 days.' }
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#e8d2c3;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#e8d2c3;padding:40px 20px;">
<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#f1eae4;border-radius:4px;overflow:hidden;">
  <tr>
    <td style="background:#3a2e2b;padding:36px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:22px;letter-spacing:0.28em;color:#f1eae4;margin:0;">ANOINTED</p>
    </td>
  </tr>
  <tr>
    <td style="padding:44px 40px;text-align:center;">
      <h1 style="font-family:Georgia,serif;font-size:24px;font-style:italic;font-weight:400;color:#3a2e2b;margin:0 0 24px;">${L.heading}</h1>
      <p style="font-family:Georgia,serif;font-size:14px;line-height:1.85;color:#5d4d42;margin:0 0 32px;">${L.body}</p>
      <a href="${confirmUrl}" style="display:inline-block;background:#3a2e2b;color:#f1eae4;font-family:Georgia,serif;font-size:11px;letter-spacing:0.16em;text-decoration:none;padding:14px 32px;">${L.cta}</a>
      <p style="font-family:Georgia,serif;font-size:11px;line-height:1.7;color:#8a7a70;margin:32px 0 0;">${L.ignore}</p>
    </td>
  </tr>
  <tr>
    <td style="background:#3a2e2b;padding:24px 40px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:10px;color:rgba(241,234,228,0.55);margin:0;">${datiVenditore()}</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>
  `
}
