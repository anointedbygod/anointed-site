import Link from 'next/link'
import Image from 'next/image'
import { copertina, ETICHETTE_UI, type VoceWorld } from '@/lib/anointed-world'

// Scheda compatta di Anointed World: foto verticale, titolo, una riga di anteprima.
// Tutta la scheda porta alla pagina dell'articolo.
export default function WorldCard({ v, locale, priority = false }: { v: VoceWorld; locale: 'it' | 'en'; priority?: boolean }) {
  const t = v[locale]
  const img = copertina(v, locale)
  return (
    <Link href={`/${locale}/anointed-world/${v.slug}`} className="wc-card">
      <div className="wc-img">
        {img && <Image src={img} alt={t.imageAlt || t.gallery?.[0]?.alt || t.title} fill sizes="(max-width: 767px) 90vw, (max-width: 1100px) 45vw, 340px" style={{ objectFit: 'cover', objectPosition: v.coverPosition || 'center 25%' }} priority={priority} />}
      </div>
      <div className="wc-body">
        <h3 className="wc-title">{t.title}</h3>
        <p className="wc-teaser">{t.teaser}</p>
        <span className="wc-cta">{ETICHETTE_UI[locale].leggi} →</span>
      </div>
    </Link>
  )
}

// Stili condivisi delle schede (inseriti una volta nella pagina che le usa)
export const WORLD_CARD_CSS = `
.wc-card { display: flex; flex-direction: column; text-decoration: none; background: rgba(255,255,255,0.45); border: 1px solid rgba(193,169,154,0.3); border-radius: 16px; overflow: hidden; transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s ease, border-color .45s ease; box-shadow: 0 10px 30px rgba(58,46,43,0.06); }
.wc-card:hover { transform: translateY(-4px); box-shadow: 0 22px 50px rgba(58,46,43,0.14); border-color: rgba(193,169,154,0.6); }
.wc-img { position: relative; aspect-ratio: 4 / 5; background: #e8d2c3; overflow: hidden; }
.wc-img img { transition: transform .8s cubic-bezier(.16,1,.3,1); }
.wc-card:hover .wc-img img { transform: scale(1.04); }
.wc-tipo { position: absolute; top: 14px; left: 14px; font-family: Inter, sans-serif; font-size: 9.5px; letter-spacing: .16em; text-transform: uppercase; color: #3a2e2b; background: rgba(241,234,228,0.92); padding: .38rem .75rem; border-radius: 100px; }
.wc-body { padding: 1.4rem 1.4rem 1.5rem; display: flex; flex-direction: column; gap: .6rem; flex: 1; }
.wc-meta { font-family: Inter, sans-serif; font-size: 10.5px; letter-spacing: .08em; color: #8a7a70; margin: 0; }
.wc-title { font-family: Inter, sans-serif; font-size: 1.12rem; font-weight: 300; line-height: 1.35; color: #3a2e2b; margin: 0; }
.wc-teaser { font-family: Inter, sans-serif; font-size: 13px; line-height: 1.7; color: #5d4d42; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.wc-cta { margin-top: auto; padding-top: .4rem; font-family: Inter, sans-serif; font-size: 10.5px; letter-spacing: .14em; font-weight: 500; color: #3a2e2b; text-transform: uppercase; }
`
