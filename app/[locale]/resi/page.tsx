'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function ResiPage() {
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'
  const isIT = locale === 'it'

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.75rem' }}>
          — {isIT ? 'ASSISTENZA' : 'SUPPORT'} —
        </p>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 3rem' }}>
          {isIT ? 'Resi e Rimborsi' : 'Returns & Refunds'}
        </h1>

        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: '#5d4d42' }}>

          <Section title={isIT ? 'Diritto di recesso' : 'Right of Withdrawal'}>
            <p>{isIT
              ? 'Ai sensi del D.Lgs. 206/2005 (Codice del Consumo) hai diritto di recedere dal contratto entro 14 giorni dal ricevimento della merce, senza necessità di fornire alcuna motivazione.'
              : 'Under Italian Consumer Code (D.Lgs. 206/2005) you have the right to withdraw from the contract within 14 days of receiving the goods, without providing any reason.'
            }</p>
          </Section>

          <Section title={isIT ? 'Come effettuare un reso' : 'How to Return'}>
            {isIT ? (
              <ol style={{ paddingLeft: '1.25rem' }}>
                <li style={{ marginBottom: '0.75rem' }}>Contatta il nostro servizio clienti entro 14 giorni dal ricevimento a <strong>sofia.meneghetti@pec.it</strong> indicando numero ordine e motivo del reso.</li>
                <li style={{ marginBottom: '0.75rem' }}>Riceverai le istruzioni per la restituzione entro 48 ore lavorative.</li>
                <li style={{ marginBottom: '0.75rem' }}>Imballa il prodotto nell'imballo originale, con etichette e tag intatti.</li>
                <li style={{ marginBottom: '0.75rem' }}>Spedisci il pacco all'indirizzo che ti verrà comunicato. Le spese di reso sono a carico del cliente.</li>
                <li>Al ricevimento e verifica del prodotto, il rimborso verrà emesso entro 14 giorni sullo stesso metodo di pagamento utilizzato.</li>
              </ol>
            ) : (
              <ol style={{ paddingLeft: '1.25rem' }}>
                <li style={{ marginBottom: '0.75rem' }}>Contact our customer service within 14 days of receipt at <strong>sofia.meneghetti@pec.it</strong> with your order number and reason for return.</li>
                <li style={{ marginBottom: '0.75rem' }}>You will receive return instructions within 48 working hours.</li>
                <li style={{ marginBottom: '0.75rem' }}>Pack the product in its original packaging, with tags and labels intact.</li>
                <li style={{ marginBottom: '0.75rem' }}>Ship the package to the address we will provide. Return shipping costs are at the customer's expense.</li>
                <li>Upon receipt and inspection, the refund will be issued within 14 days to the original payment method.</li>
              </ol>
            )}
          </Section>

          <Section title={isIT ? 'Condizioni del reso' : 'Return Conditions'}>
            {isIT ? (
              <ul>
                <li>Il prodotto deve essere non utilizzato, nelle condizioni originali</li>
                <li>Etichette e tag devono essere intatti e non rimossi</li>
                <li>Il prodotto deve essere nell'imballo originale</li>
                <li>Non sono accettati resi di prodotti danneggiati per uso improprio</li>
              </ul>
            ) : (
              <ul>
                <li>The product must be unused, in original condition</li>
                <li>Labels and tags must be intact and not removed</li>
                <li>The product must be in the original packaging</li>
                <li>Returns of products damaged due to misuse are not accepted</li>
              </ul>
            )}
          </Section>

          <Section title={isIT ? 'Prodotti difettosi' : 'Defective Products'}>
            <p>{isIT
              ? 'In caso di prodotto difettoso o non conforme all\'ordine, contatta immediatamente sofia.meneghetti@pec.it con foto del difetto. Provvederemo alla sostituzione o al rimborso completo, con spese di spedizione a nostro carico.'
              : 'In case of a defective or non-conforming product, contact sofia.meneghetti@pec.it immediately with photos of the defect. We will arrange a replacement or full refund, with shipping costs at our expense.'
            }</p>
          </Section>

          <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(58,46,43,0.04)', borderRadius: '4px', border: '1px solid rgba(193,169,154,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#3a2e2b', fontWeight: 500 }}>
              {isIT ? 'Hai bisogno di aiuto?' : 'Need help?'}
            </p>
            <Link href={`/${locale}/contatti`} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', background: '#3a2e2b', color: '#f1eae4', textDecoration: 'none', padding: '0.65rem 1.5rem', borderRadius: '1px' }}>
              {isIT ? 'CONTATTACI' : 'CONTACT US'}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 600, color: '#3a2e2b', margin: '0 0 1rem', letterSpacing: '0.04em' }}>{title}</h2>
      {children}
    </div>
  )
}
