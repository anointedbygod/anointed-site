'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AZIENDA, datiVenditore } from '@/lib/azienda'

// BOZZA da far rivedere a Sofia / a un legale prima del lancio.
// I dati del venditore arrivano da lib/azienda.ts.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 500, color: '#3a2e2b', margin: '0 0 0.9rem' }}>{title.toUpperCase()}</h2>
      {children}
    </section>
  )
}

export default function CondizioniPage() {
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'
  const isIT = locale === 'it'
  const venditore = datiVenditore()

  const p = (it: string, en: string) => <p style={{ margin: '0 0 0.8rem' }}>{isIT ? it : en}</p>

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.75rem' }}>
          — {isIT ? 'LEGALE' : 'LEGAL'} —
        </p>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 3rem' }}>
          {isIT ? 'Condizioni Generali di Vendita' : 'Terms & Conditions of Sale'}
        </h1>

        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: '#5d4d42' }}>

          <Section title={isIT ? '1. Venditore' : '1. Seller'}>
            {venditore.length > 0
              ? <p style={{ margin: '0 0 0.8rem' }}>{venditore.map((v, i) => <span key={i}>{v}<br /></span>)}</p>
              : null}
            <p style={{ margin: 0 }}>
              Email: <a href={`mailto:${AZIENDA.email}`} style={{ color: '#3a2e2b' }}>{AZIENDA.email}</a>
              {AZIENDA.pec && <> · PEC: {AZIENDA.pec}</>}
            </p>
          </Section>

          <Section title={isIT ? '2. Ambito di applicazione' : '2. Scope'}>
            {p(
              'Le presenti condizioni regolano gli acquisti effettuati dai consumatori sul sito anointed.it. Inviando l\'ordine dichiari di averle lette e accettate.',
              'These terms govern purchases made by consumers on anointed.it. By placing your order you confirm that you have read and accepted them.'
            )}
          </Section>

          <Section title={isIT ? '3. Prodotti e prezzi' : '3. Products and prices'}>
            {p(
              'I prodotti sono descritti nelle rispettive schede. I colori possono variare leggermente a seconda dello schermo. I prezzi sono espressi in euro e comprendono l\'IVA ove dovuta; le spese di spedizione sono indicate al checkout, prima della conferma dell\'ordine.',
              'Products are described on their pages. Colours may vary slightly depending on your screen. Prices are in euro and include VAT where due; shipping costs are shown at checkout before you confirm your order.'
            )}
          </Section>

          <Section title={isIT ? '4. Ordine e conclusione del contratto' : '4. Order and contract'}>
            {p(
              'L\'ordine viene inviato dopo il pagamento. Riceverai una email di conferma all\'indirizzo indicato: da quel momento il contratto si intende concluso. Possiamo annullare un ordine in caso di indisponibilita\' del prodotto o errori evidenti di prezzo, rimborsando integralmente quanto pagato.',
              'Your order is placed once payment is completed. You will receive a confirmation email at the address provided; the contract is concluded at that point. We may cancel an order if a product is unavailable or in case of an obvious pricing error, with a full refund.'
            )}
          </Section>

          <Section title={isIT ? '5. Pagamento' : '5. Payment'}>
            {p(
              'Il pagamento avviene online tramite Stripe. I dati della carta vengono inseriti direttamente sulla pagina sicura di Stripe e non transitano ne\' vengono conservati sui nostri server.',
              'Payment is made online through Stripe. Card details are entered directly on Stripe\'s secure page and never pass through or are stored on our servers.'
            )}
          </Section>

          <Section title={isIT ? '6. Spedizione e consegna' : '6. Shipping and delivery'}>
            {p(
              'Spediamo nei Paesi e alle tariffe indicati al checkout. I tempi di consegna sono indicativi e dipendono dal corriere e dalla destinazione. In caso di ritardo ti invitiamo a contattarci.',
              'We ship to the countries and at the rates shown at checkout. Delivery times are indicative and depend on the carrier and destination. If your parcel is late, please contact us.'
            )}
          </Section>

          <Section title={isIT ? '7. Diritto di recesso' : '7. Right of withdrawal'}>
            {p(
              'Hai diritto di recedere dal contratto entro 14 giorni dal ricevimento dei beni, senza dover fornire alcuna motivazione, ai sensi degli artt. 52 e seguenti del Codice del Consumo (D.Lgs. 206/2005). Per esercitare il diritto scrivici all\'indirizzo email o PEC indicato sopra. Il rimborso avviene entro 14 giorni dal momento in cui veniamo a conoscenza dell\'esercizio del recesso, con lo stesso mezzo di pagamento utilizzato, e puo\' essere trattenuto fino al ricevimento dei beni o alla prova della loro spedizione. Le spese di restituzione sono a carico del cliente. Il bene va restituito integro e non utilizzato. Procedura completa nella pagina ',
              'You have the right to withdraw from the contract within 14 days of receiving the goods, without giving any reason, under articles 52 ff. of the Italian Consumer Code (Legislative Decree 206/2005). To exercise it, write to the email or PEC address above. Refunds are issued within 14 days of our being informed of your withdrawal, using the original payment method, and may be withheld until we receive the goods or proof of shipment. Return shipping costs are borne by the customer. Goods must be returned intact and unused. Full procedure on the '
            )}
            <p style={{ margin: 0 }}>
              <Link href={`/${locale}/resi`} style={{ color: '#3a2e2b' }}>{isIT ? 'Resi e Rimborsi' : 'Returns & Refunds'}</Link>.
            </p>
          </Section>

          <Section title={isIT ? '8. Garanzia legale di conformita\'' : '8. Legal guarantee of conformity'}>
            {p(
              'Il venditore risponde dei difetti di conformita\' dei beni ai sensi degli artt. 128 e seguenti del Codice del Consumo, per un periodo di 2 anni dalla consegna. In caso di difetto scrivici descrivendo il problema, allegando se possibile delle foto.',
              'The seller is liable for lack of conformity of the goods under articles 128 ff. of the Italian Consumer Code for 2 years from delivery. If you find a defect, write to us describing the problem and, if possible, attach photos.'
            )}
          </Section>

          <Section title={isIT ? '9. Reclami' : '9. Complaints'}>
            {p(
              'Per reclami puoi scriverci ai recapiti indicati sopra: risponderemo entro 48 ore lavorative.',
              'For complaints you can write to the contacts above: we will reply within 48 working hours.'
            )}
          </Section>

          <Section title={isIT ? '10. Privacy' : '10. Privacy'}>
            <p style={{ margin: 0 }}>
              {isIT ? 'I dati personali sono trattati come descritto nella ' : 'Personal data is processed as described in our '}
              <Link href={`/${locale}/privacy`} style={{ color: '#3a2e2b' }}>Privacy Policy</Link>.
            </p>
          </Section>

          <Section title={isIT ? '11. Legge applicabile e foro competente' : '11. Governing law and jurisdiction'}>
            {p(
              'Il contratto e\' regolato dalla legge italiana. Per le controversie con i consumatori e\' competente il giudice del luogo di residenza o domicilio del consumatore, fatte salve le norme di legge inderogabili del Paese di residenza.',
              'The contract is governed by Italian law. For disputes with consumers, the court of the consumer\'s place of residence or domicile has jurisdiction, without prejudice to mandatory consumer protection rules of the country of residence.'
            )}
          </Section>

        </div>
      </div>
    </main>
  )
}
