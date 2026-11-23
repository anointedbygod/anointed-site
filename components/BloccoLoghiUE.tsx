import Image from 'next/image'

// Blocco loghi istituzionale (file ufficiale, non modificato) + logo dell'ente gestore a destra,
// su fondo bianco come richiesto dal Brand Book Coesione Italia (versione positiva).
export default function BloccoLoghiUE({ altezza = 36 }: { altezza?: number }) {
  return (
    <div className="blocco-ue" style={{ background: '#ffffff', borderRadius: 3, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', maxWidth: '100%', boxSizing: 'border-box' }}>
      <Image src="/images/fondi/blocco-loghi-pn-gdl.png" alt="Coesione Italia 21-27 Giovani, donne e lavoro · Cofinanziato dall'Unione europea · Ministero del Lavoro e delle Politiche Sociali" width={2008} height={213} style={{ height: altezza, width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
      <span aria-hidden style={{ width: 1, height: altezza * 0.8, background: '#c8c8c8' }} />
      <Image src="/invitalia.png" alt="Invitalia" width={765} height={477} style={{ height: altezza, width: 'auto', objectFit: 'contain' }} />
      <style>{`@media (max-width: 600px){ .blocco-ue > span { display: none } }`}</style>
    </div>
  )
}
