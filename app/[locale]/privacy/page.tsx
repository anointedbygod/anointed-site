'use client'
import { usePathname } from 'next/navigation'

export default function PrivacyPage() {
  const pathname = usePathname()
  const locale = pathname.startsWith('/it') ? 'it' : 'en'
  const isIT = locale === 'it'

  return (
    <main style={{ background: '#f1eae4', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', color: '#c1a99a', margin: '0 0 0.75rem' }}>
          — {isIT ? 'LEGALE' : 'LEGAL'} —
        </p>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300, color: '#3a2e2b', margin: '0 0 0.5rem' }}>
          {isIT ? 'Informativa sulla Privacy' : 'Privacy Policy'}
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#c1a99a', margin: '0 0 3rem', letterSpacing: '0.08em' }}>
          {isIT ? 'Ultimo aggiornamento: agosto 2026' : 'Last updated: August 2026'}
        </p>

        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: '#5d4d42' }}>

          <Section title={isIT ? '1. Titolare del trattamento' : '1. Data Controller'}>
            {isIT ? (
              <>
                <p>Il Titolare del trattamento dei dati personali è:</p>
                <p><strong style={{ color: '#3a2e2b' }}>Sofia Meneghetti – Impresa Individuale</strong><br />
                Viale Asiago 113, 36061 Bassano del Grappa (VI)<br />
                P.IVA: 04639380247<br />
                Email: sofia.meneghetti@pec.it</p>
              </>
            ) : (
              <>
                <p>The data controller is:</p>
                <p><strong style={{ color: '#3a2e2b' }}>Sofia Meneghetti – Sole Trader</strong><br />
                Viale Asiago 113, 36061 Bassano del Grappa (VI), Italy<br />
                VAT: 04639380247<br />
                Email: sofia.meneghetti@pec.it</p>
              </>
            )}
          </Section>

          <Section title={isIT ? '2. Dati raccolti' : '2. Data We Collect'}>
            {isIT ? (
              <ul>
                <li><strong>Dati di acquisto:</strong> nome, cognome, indirizzo di spedizione, email, dati di pagamento (gestiti da Stripe — non conserviamo dati di carte di credito).</li>
                <li><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, pagine visitate, tramite Google Analytics 4 e Meta Pixel.</li>
                <li><strong>Dati di contatto:</strong> email fornita per la newsletter o per richieste di assistenza.</li>
              </ul>
            ) : (
              <ul>
                <li><strong>Purchase data:</strong> name, surname, shipping address, email, payment data (managed by Stripe — we do not store credit card data).</li>
                <li><strong>Navigation data:</strong> IP address, browser type, pages visited, via Google Analytics 4 and Meta Pixel.</li>
                <li><strong>Contact data:</strong> email provided for the newsletter or support requests.</li>
              </ul>
            )}
          </Section>

          <Section title={isIT ? '3. Finalità del trattamento' : '3. Purpose of Processing'}>
            {isIT ? (
              <ul>
                <li>Gestione degli ordini e spedizioni</li>
                <li>Comunicazioni relative all'ordine (conferma, spedizione)</li>
                <li>Invio newsletter (solo previo consenso)</li>
                <li>Analisi del traffico del sito (Google Analytics 4)</li>
                <li>Remarketing pubblicitario (Meta Pixel — solo previo consenso)</li>
                <li>Adempimento di obblighi legali e fiscali</li>
              </ul>
            ) : (
              <ul>
                <li>Order management and shipping</li>
                <li>Order-related communications (confirmation, shipping)</li>
                <li>Newsletter sending (only with consent)</li>
                <li>Website traffic analysis (Google Analytics 4)</li>
                <li>Advertising remarketing (Meta Pixel — only with consent)</li>
                <li>Compliance with legal and tax obligations</li>
              </ul>
            )}
          </Section>

          <Section title={isIT ? '4. Strumenti di terze parti' : '4. Third-Party Tools'}>
            {isIT ? (
              <>
                <p><strong>Stripe</strong> — gestione pagamenti. Privacy policy: stripe.com/privacy</p>
                <p><strong>Google Analytics 4</strong> — analisi traffico. I dati sono anonimizzati. Privacy policy: policies.google.com/privacy</p>
                <p><strong>Meta Pixel</strong> — remarketing pubblicitario. Privacy policy: facebook.com/privacy/policy</p>
                <p><strong>Supabase</strong> — archiviazione dati. Privacy policy: supabase.com/privacy</p>
              </>
            ) : (
              <>
                <p><strong>Stripe</strong> — payment processing. Privacy policy: stripe.com/privacy</p>
                <p><strong>Google Analytics 4</strong> — traffic analysis. Data is anonymized. Privacy policy: policies.google.com/privacy</p>
                <p><strong>Meta Pixel</strong> — advertising remarketing. Privacy policy: facebook.com/privacy/policy</p>
                <p><strong>Supabase</strong> — data storage. Privacy policy: supabase.com/privacy</p>
              </>
            )}
          </Section>

          <Section title={isIT ? '5. Conservazione dei dati' : '5. Data Retention'}>
            <p>{isIT
              ? 'I dati relativi agli ordini sono conservati per 10 anni in conformità agli obblighi fiscali italiani. I dati di newsletter sono conservati fino alla revoca del consenso.'
              : 'Order data is retained for 10 years in compliance with Italian tax obligations. Newsletter data is retained until consent is withdrawn.'
            }</p>
          </Section>

          <Section title={isIT ? '6. Diritti dell\'interessato' : '6. Your Rights'}>
            {isIT ? (
              <>
                <p>Ai sensi del GDPR (Reg. UE 2016/679) hai diritto a:</p>
                <ul>
                  <li>Accedere ai tuoi dati personali</li>
                  <li>Rettificare dati inesatti</li>
                  <li>Richiedere la cancellazione dei dati</li>
                  <li>Opporti al trattamento per finalità di marketing</li>
                  <li>Portabilità dei dati</li>
                </ul>
                <p>Per esercitare i tuoi diritti: <strong>sofia.meneghetti@pec.it</strong></p>
              </>
            ) : (
              <>
                <p>Under GDPR (EU Reg. 2016/679) you have the right to:</p>
                <ul>
                  <li>Access your personal data</li>
                  <li>Rectify inaccurate data</li>
                  <li>Request data deletion</li>
                  <li>Object to processing for marketing purposes</li>
                  <li>Data portability</li>
                </ul>
                <p>To exercise your rights: <strong>sofia.meneghetti@pec.it</strong></p>
              </>
            )}
          </Section>

          <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(193,169,154,0.1)', borderRadius: '4px', border: '1px solid rgba(193,169,154,0.2)' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#c1a99a' }}>
              {isIT
                ? '⚠️ Questo documento è un placeholder professionale. Si raccomanda la revisione da parte di un consulente legale prima del lancio del sito.'
                : '⚠️ This document is a professional placeholder. Legal review is recommended before the site launch.'
              }
            </p>
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
