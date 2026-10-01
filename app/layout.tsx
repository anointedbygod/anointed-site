export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Iubenda cookie-consent banner + script autoblocking.
  // Inattivo finché queste due env var non sono impostate in .env.local
  // (si trovano nella dashboard Iubenda dopo aver creato il sito):
  //   NEXT_PUBLIC_IUBENDA_SITE_ID
  //   NEXT_PUBLIC_IUBENDA_COOKIE_POLICY_ID
  // Una volta impostate, il banner e l'autoblocking di eventuali script di
  // terze parti (analytics, pixel pubblicitari, ecc. se mai aggiunti in
  // futuro) si attivano automaticamente, senza altre modifiche al codice.
  const iubendaSiteId = process.env.NEXT_PUBLIC_IUBENDA_SITE_ID
  const iubendaCookiePolicyId = process.env.NEXT_PUBLIC_IUBENDA_COOKIE_POLICY_ID

  return (
    <html>
      <head>
        {iubendaSiteId && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  var _iub = _iub || [];
                  _iub.csConfiguration = {
                    siteId: ${iubendaSiteId},
                    cookiePolicyId: ${iubendaCookiePolicyId},
                    lang: "it",
                    storage: { useSiteId: true }
                  };
                `,
              }}
            />
            <script src={`https://cs.iubenda.com/autoblocking/${iubendaSiteId}.js`} />
            <script src="https://cdn.iubenda.com/cs/iubenda_cs.js" charSet="UTF-8" async />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
