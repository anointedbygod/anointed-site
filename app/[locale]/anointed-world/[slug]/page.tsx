import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import PhotoCarousel from '@/components/PhotoCarousel'
import WorldCard, { WORLD_CARD_CSS } from '@/components/world/WorldCard'
import { VOCI_WORLD, trovaVoce, altreVoci, copertina, ETICHETTE_TIPO, ETICHETTE_UI } from '@/lib/anointed-world'

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

  return (
    <main style={{ background: '#f1eae4' }}>
      <style>{WORLD_CARD_CSS + ART_CSS}</style>

      {/* COPERTINA */}
      <section className="ar-hero">
        {img && <Image src={img} alt={t.imageAlt || t.gallery?.[0]?.alt || t.title} fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: v.coverPosition || 'center 25%' }} />}
        <div className="ar-hero-shade" />
        <div className="ar-hero-blur" aria-hidden="true" />
        <div className="ar-hero-text">
          <p className="ar-meta"><span className="ar-pill">{t.date}</span>{t.location} · {ETICHETTE_TIPO[l][v.tipo]}</p>
          <h1>{t.title}</h1>
        </div>
      </section>

      {/* TESTO */}
      <article className="ar-body">
        <Link href={`/${l}/anointed-world`} className="ar-back">← {ui.torna}</Link>
        {t.body.map((p, i) => <p key={i} className={i === 0 ? 'ar-lead' : ''}>{p}</p>)}

        {t.gallery && t.gallery.length > 0 && (
          <figure className="ar-gallery">
            <PhotoCarousel foto={t.gallery} prev={l === 'it' ? 'Foto precedente' : 'Previous photo'} next={l === 'it' ? 'Foto successiva' : 'Next photo'} ratio="1282 / 1800" sizes="(max-width: 767px) 90vw, 520px" />
          </figure>
        )}
        {!t.gallery && t.caption && <p className="ar-caption">{t.caption}</p>}

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
.ar-hero { position: relative; min-height: 72vh; display: flex; align-items: flex-end; overflow: hidden; background: #3a2e2b; }
.ar-hero-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,14,12,0.55) 0%, rgba(20,14,12,0.1) 40%, rgba(20,14,12,0.78) 100%); }
.ar-hero-blur { position: absolute; top: 0; left: 0; right: 0; height: 130px; pointer-events: none; -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 45%, transparent 100%); mask-image: linear-gradient(180deg, #000 0%, #000 45%, transparent 100%); }
.ar-hero-text { position: relative; max-width: 820px; margin: 0 auto; width: 100%; padding: 0 1.5rem 3.5rem; }
.ar-hero-text h1 { font-family: Inter, sans-serif; font-size: clamp(1.8rem, 4.4vw, 3.2rem); font-weight: 300; line-height: 1.15; color: #f1eae4; margin: 0; }
.ar-meta { font-family: Inter, sans-serif; font-size: 11px; letter-spacing: .1em; color: rgba(241,234,228,0.8); margin: 0 0 1.25rem; }
.ar-pill { display: inline-block; font-weight: 500; color: #3a2e2b; background: rgba(241,234,228,0.9); padding: .38rem .85rem; border-radius: 100px; margin-right: .75rem; }
.ar-body { max-width: 720px; margin: 0 auto; padding: 3rem 1.5rem 4rem; }
.ar-back { display: inline-block; font-family: Inter, sans-serif; font-size: 11px; letter-spacing: .1em; color: #8a7a70; text-decoration: none; margin-bottom: 2.25rem; }
.ar-back:hover { color: #3a2e2b; }
.ar-body p { font-family: Inter, sans-serif; font-size: 15px; line-height: 1.9; color: #5d4d42; margin: 0 0 1.3rem; }
.ar-body p.ar-lead { font-size: 18px; line-height: 1.75; color: #3a2e2b; font-weight: 300; }
.ar-gallery { max-width: 520px; margin: 2.75rem auto; }
.ar-caption { font-size: 12px !important; letter-spacing: .08em; color: #8a7a70 !important; }
.ar-foot { border-top: 1px solid rgba(193,169,154,0.35); margin-top: 2.5rem; padding-top: 1.75rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
.ar-body p.ar-closing { font-style: italic; color: #3a2e2b; margin: 0; font-size: 14px; }
.ar-btn { display: inline-block; font-family: Inter, sans-serif; font-size: 10.5px; letter-spacing: .14em; font-weight: 500; color: #f1eae4; background: #3a2e2b; text-decoration: none; padding: .8rem 1.6rem; border-radius: 100px; transition: background .25s; white-space: nowrap; }
.ar-btn:hover { background: #5d4d42; }
.ar-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 340px)); justify-content: center; gap: 1.75rem; }
@media (max-width: 1100px) { .ar-grid { grid-template-columns: repeat(2, minmax(0, 340px)); } }
@media (max-width: 767px) { .ar-grid { grid-template-columns: 1fr; } .ar-hero { min-height: 62vh; } }
`
