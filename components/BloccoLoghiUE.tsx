import Image from 'next/image'

// Blocco loghi ufficiale Autoimpiego Centro-Nord (file fornito da Invitalia, non modificato):
// Coesione Italia 21-27 · Cofinanziato dall'UE · Ministero del Lavoro · Invitalia · Autoimpiego Centro Nord.
// Su fondo bianco, versione positiva.
export default function BloccoLoghiUE({ altezza = 36 }: { altezza?: number }) {
  return (
    <div style={{ background: '#ffffff', borderRadius: 3, padding: '10px 16px', maxWidth: '100%', boxSizing: 'border-box', display: 'flex', justifyContent: 'center' }}>
      <Image
        src="/images/fondi/blocco-loghi-autoimpiego.png"
        alt="Coesione Italia 21-27 Giovani, donne e lavoro · Cofinanziato dall'Unione europea · Ministero del Lavoro e delle Politiche Sociali · Invitalia · Autoimpiego Centro Nord"
        width={2936} height={276}
        style={{ height: 'auto', width: altezza * (2936 / 276), maxWidth: '100%' }}
      />
    </div>
  )
}
