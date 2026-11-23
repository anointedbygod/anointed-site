import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import PhotoCarousel from '@/components/PhotoCarousel'
import WorldCard, { WORLD_CARD_CSS } from '@/components/world/WorldCard'
import { VOCI_WORLD, trovaVoce, altreVoci, copertina, ETICHETTE_UI } from '@/lib/anointed-world'

type Params = { params: Promise<{ locale: string; slug: string }> }

// Una pagina per ogni contenuto, in entrambe le lingue, generata al deploy
export function generateStaticParams() {
  return VOCI_WORLD.flatMap(v => [{ locale: 'it', slug: v.slug }, { locale: 'en', slug: v.slug }])
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params
  const v = trovaVoce(slug)
  if (!v) return {}
  const l = locale === 'it' ? 'it' : 'en'
  const t = v[l]
  const img = copertina(v, l)
  return {
    title: t.title,
    description: t.teaser,
    alternates: { languages: { it: `/it/anointed-world/${slug}`, en: `/en/anointed-world/${slug}` } },
    openGraph: { title: t.title, description: t.teaser, images: img ? [{ url: img }] : undefined, type: 'article' },
  }
}

export default async function ArticoloWorld({ params }: Params) {
  const { locale, slug } = await params
  const v = trovaVoce(slug)
  if (!v) notFound()
  const l = locale === 'it' ? 'it' : 'en'
  const t = v[l]
  const ui = ETICHETTE_UI[l]
  const img = copertina(v, l)
  const altri = altreVoci(slug, 3)
  const galleria = (t.gallery || []).filter(f => f.src !== img)

  return (
    <main style={{ background: '#f1eae4' }}>
      <style>{WORLD_CARD_CSS + ART_CSS}</style>

      {/* APERTURA: testo su fondo chiaro + immagine intera con le sue proporzioni (funziona con foto e illustrazioni) */}
      <section className="ar-head">
        <div className="ar-head-text">
          <Link href={`/${l}/anointed-world`} className="ar-back">← {ui.torna}</Link>
          <h1>{t.title}</h1>
          <p className="ar-teaser">{t.teaser}</p>
        </div>
        {img && (
          <figure className="ar-head-img">
            <Image src={img} alt={t.imageAlt || t.gallery?.[0]?.alt || t.title} width={1282} height={1800} priority sizes="(max-width: 767px) 90vw, 440px" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 14 }} />
            {t.caption && <figcaption>{t.caption}</figcaption>}
          </figure>
        )}
      </section>

      {/* TESTO */}
      <article className="ar-body">
        {t.body.map((p, i) => <p key={i} className={i === 0 ? 'ar-lead' : ''}>{p}</p>)}

        {galleria.length > 0 && (
          <figure className="ar-gallery">
            <PhotoCarousel foto={galleria} prev={l === 'it' ? 'Foto precedente' : 'Previous photo'} next={l === 'it' ? 'Foto successiva' : 'Next photo'} ratio="1282 / 1800" sizes="(max-width: 767px) 90vw, 520px" />
          </figure>
        )}

        {(t.closing || v.link) && (
          <div className="ar-foot">
            {t.closing && <p className="ar-closing">{t.closing}</p>}
            {v.link && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem' }}>
                {v.logo && <Image src={v.logo.src} alt={v.logo.alt} width={40} height={40} style={{ width: 40, height: 40, borderRadius: '50%' }} />}
                <a href={v.link} target="_blank" rel="noopener noreferrer" className="ar-btn">{t.linkLabel || (l === 'it' ? 'Scopri di più' : 'Learn more')} →</a>
              </span>
            )}
          </div>
        )}
      </article>

      {/* ALTRI MOMENTI */}
      {altri.length > 0 && (
        <section style={{ maxWidth: '1120px', margin: '0 auto', padding: '1rem 1.5rem 7rem' }}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.3rem, 2vw, 1.8rem)', fontWeight: 300, color: '#3a2e2b', textAlign: 'center', margin: '0 0 2.5rem' }}>{ui.altri}</h2>
          <div className="ar-grid">{altri.map(a => <WorldCard key={a.slug} v={a} locale={l} />)}</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <Link href={`/${l}/anointed-world`} className="ar-btn">{ui.torna}</Link>
          </div>
        </section>
      )}
    </main>
  )
}

const ART_CSS = `
.ar-head { max-width: 1040px; margin: 0 auto; padding: 120px 1.5rem 1rem; display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); gap: clamp(2rem, 5vw, 4.5rem); align-items: center; }
.ar-head-text h1 { font-family: Inter, sans-serif; font-size: clamp(1.8rem, 3.6vw, 2.8rem); font-weight: 300; line-height: 1.2; color: #3a2e2b; margin: 0 0 1.25rem; }
.ar-teaser { font-family: Inter, sans-serif; font-size: 15.5px; line-height: 1.8; color: #5d4d42; margin: 0; }
.ar-meta { font-family: Inter, sans-serif; font-size: 11px; letter-spacing: .1em; color: #8a7a70; margin: 0 0 1.25rem; }
.ar-pill { display: inline-block; font-weight: 500; color: #3a2e2b; background: rgba(193,169,154,0.28); border: 1px solid rgba(193,169,154,0.4); padding: .35rem .8rem; border-radius: 100px; margin-right: .75rem; }
.ar-head-img { margin: 0; max-width: 440px; justify-self: end; width: 100%; }
.ar-head-img img { box-shadow: 0 24px 60px rgba(58,46,43,0.14); background: #fff; }
.ar-head-img figcaption { font-family: Inter, sans-serif; font-size: 11px; letter-spacing: .08em; color: #8a7a70; padding: .9rem .25rem 0; }
.ar-body { max-width: 720px; margin: 0 auto; padding: 3.5rem 1.5rem 4rem; }
.ar-back { display: inline-block; font-family: Inter, sans-serif; font-size: 11px; letter-spacing: .1em; color: #8a7a70; text-decoration: none; margin-bottom: 2.25rem; }
.ar-back:hover { color: #3a2e2b; }
.ar-body p { font-family: Inter, sans-serif; font-size: 15px; line-height: 1.9; color: #5d4d42; margin: 0 0 1.3rem; }
.ar-body p.ar-lead { font-size: 18px; line-height: 1.75; color: #3a2e2b; font-weight: 300; }
.ar-gallery { max-width: 520px; margin: 2.75rem auto; }
.ar-foot { border-top: 1px solid rgba(193,169,154,0.35); margin-top: 2.5rem; padding-top: 1.75rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
.ar-body p.ar-closing { font-style: italic; color: #3a2e2b; margin: 0; font-size: 14px; }
.ar-btn { display: inline-block; font-family: Inter, sans-serif; font-size: 10.5px; letter-spacing: .14em; font-weight: 500; color: #f1eae4; background: #3a2e2b; text-decoration: none; padding: .8rem 1.6rem; border-radius: 100px; transition: background .25s; white-space: nowrap; }
.ar-btn:hover { background: #5d4d42; }
.ar-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 340px)); justify-content: center; gap: 1.75rem; }
@media (max-width: 1100px) { .ar-grid { grid-template-columns: repeat(2, minmax(0, 340px)); } }
@media (max-width: 767px) { .ar-grid { grid-template-columns: 1fr; } .ar-head { grid-template-columns: 1fr; padding-top: 96px; } .ar-head-img { justify-self: center; max-width: 360px; } }
`
