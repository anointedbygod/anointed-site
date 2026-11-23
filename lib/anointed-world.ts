import type { Foto } from '@/components/PhotoCarousel'

// Contenuti di Anointed World (eventi, collaborazioni, interventi).
// Un unico elenco usato dalla home (ultimi 3) e dalla pagina Anointed World.
// "In programma" / "passati" si decide da solo in base alla data (iso): il giorno dopo l'evento passa all'archivio.
// Quando arriverà la sezione admin, questi dati si sposteranno nel database con la stessa forma.

export type TipoWorld = 'evento' | 'collaborazione' | 'speaking' | 'stampa'

export interface TestoWorld {
  date: string
  location: string
  title: string
  teaser: string
  body: string[]
  closing?: string
  linkLabel?: string
  imageAlt?: string
  caption?: string
  gallery?: Foto[]
}

export interface VoceWorld {
  slug: string
  iso: string            // data dell'evento o della pubblicazione (AAAA-MM-GG)
  tipo: TipoWorld
  image?: string
  coverPosition?: string  // inquadratura della copertina, es. 'center 10%' per mostrare il volto
  link?: string
  logo?: { src: string; alt: string }
  inEvidenza?: boolean   // mettere true per forzare la scheda grande in alto
  it: TestoWorld
  en: TestoWorld
}

export const ETICHETTE_TIPO: Record<'it' | 'en', Record<TipoWorld, string>> = {
  it: { evento: 'Evento', collaborazione: 'Collaborazione', speaking: 'Intervento', stampa: 'Stampa' },
  en: { evento: 'Event', collaborazione: 'Collaboration', speaking: 'Talk', stampa: 'Press' },
}

const casaRuffino = (it: boolean): Foto[] => [
  { src: '/images/about/casa-ruffino-1.jpg', alt: it ? 'Una stanza di Casa Ruffino con due lampade di carta e una finestra sul giardino e sui cipressi' : 'A room at Casa Ruffino with two paper lamps and a window overlooking the garden and cypress trees' },
  { src: '/images/about/casa-ruffino-2.jpg', alt: it ? 'Un\'ospite su una sdraio a bordo piscina a Casa Ruffino, con le vigne sullo sfondo' : 'A guest relaxing on a lounger by the pool at Casa Ruffino, with vineyards in the background' },
  { src: '/images/about/casa-ruffino-3.jpg', alt: it ? 'La piscina e il giardino all\'italiana di Casa Ruffino, circondati dalle vigne' : 'The pool and Italian garden at Casa Ruffino, surrounded by vineyards' },
  { src: '/images/about/casa-ruffino-4.jpg', alt: it ? 'Cena serale nella corte di Casa Ruffino, illuminata da candele e luci' : 'Evening dinner in the courtyard of Casa Ruffino, lit by candles and string lights' },
]

const pamela = (it: boolean): Foto[] => [
  { src: '/images/world/pamela-palagi-anointed-woman-1.jpg', alt: it ? 'The ANOINTED Woman, illustrazione di Pamela Palagi: donna in blazer e pantaloni ampi con borsa, a matita e acquerello' : 'The ANOINTED Woman, illustration by Pamela Palagi: a woman in a blazer and wide trousers with a bag, in pencil and watercolour' },
  { src: '/images/world/pamela-palagi-anointed-woman-2.jpg', alt: it ? 'The ANOINTED Woman, versione a pennellate nere di Pamela Palagi' : 'The ANOINTED Woman, black brushstroke version by Pamela Palagi' },
]

export const VOCI_WORLD: VoceWorld[] = [
  {
    slug: 'pamela-palagi-the-anointed-woman',
    iso: '2026-11-05',
    tipo: 'collaborazione',
    coverPosition: 'center 12%',
    link: 'https://nonsolokina.com/',
    logo: { src: '/images/world/nonsolokina-logo.png', alt: 'Nonsolokina' },
    it: {
      date: '', // nessuna data indicata nel testo di Pamela: non la mostriamo
      location: 'Nonsolokina',
      title: 'Pamela Palagi: quando l’arte incontra l’identità femminile',
      teaser: 'L’artista Pamela Palagi ha dato forma a The ANOINTED Woman, un’illustrazione originale realizzata per il brand.',
      body: [
        'Un incontro creativo tra arte e moda che ha dato vita a The ANOINTED Woman.',
        'L’arte ha il potere di rendere visibile ciò che spesso le parole non riescono a esprimere: emozioni, identità, personalità e visioni. È da questa sensibilità che nasce il lavoro di Pamela Palagi, artista e creativa dietro Nonsolokina, il cui percorso unisce illustrazione, ricerca visiva e fotografia Fine Art, con una particolare attenzione alla bellezza autentica e alla profondità dell’essere umano.',
        'Attraverso le sue creazioni, Pamela traduce idee ed emozioni in immagini capaci di raccontare e lasciare un segno. Al centro della sua ricerca artistica si trova l’universo femminile, esplorato attraverso l’individualità, il carattere e la libertà di esprimere se stesse, andando oltre gli stereotipi e le rappresentazioni convenzionali della bellezza.',
        'Una sensibilità che incontra naturalmente la visione di ANOINTED, un brand che pone al centro l’identità, il valore e l’unicità di ogni donna.',
        'Da questa connessione nasce The ANOINTED Woman, un’illustrazione originale realizzata da Pamela Palagi per il brand, attraverso la quale l’artista interpreta l’essenza della donna ANOINTED: una donna consapevole del proprio valore, autentica, libera di esprimere la propria personalità e di distinguersi rimanendo fedele a se stessa.',
        'L’opera diventa così qualcosa di più di una semplice rappresentazione estetica. È un incontro tra due linguaggi creativi, quello dell’arte e quello della moda, che condividono il desiderio di valorizzare l’identità femminile e raccontare la bellezza nella sua forma più autentica.',
        'La collaborazione con Nonsolokina di Pamela Palagi riflette il desiderio di ANOINTED di creare connessioni autentiche con artiste e creative che condividono la sensibilità e i valori del brand, dando spazio a nuove forme di espressione e interpretazione.',
        'The ANOINTED Woman è il risultato di questo incontro: un’opera che unisce due visioni creative e racconta come arte e moda possano dialogare, arricchirsi reciprocamente e dare forma a qualcosa di unico.',
      ],
      closing: 'You are unique. You are worthy. You are chosen.',
      linkLabel: 'Scopri Nonsolokina',
      gallery: pamela(true),
    },
    en: {
      date: '',
      location: 'Nonsolokina',
      title: 'Pamela Palagi: where art meets female identity',
      teaser: 'Artist Pamela Palagi gave shape to The ANOINTED Woman, an original illustration created for the brand.',
      body: [
        'A creative encounter between art and fashion that gave life to The ANOINTED Woman.',
        'Art has the power to make visible what words often cannot express: emotions, identity, personality and vision. This sensitivity lies at the heart of the work of Pamela Palagi, the artist and creative behind Nonsolokina, whose path brings together illustration, visual research and Fine Art photography, with particular attention to authentic beauty and the depth of the human being.',
        'Through her creations, Pamela translates ideas and emotions into images that tell a story and leave a mark. At the centre of her artistic research is the female universe, explored through individuality, character and the freedom to express oneself, beyond stereotypes and conventional representations of beauty.',
        'A sensitivity that naturally meets the vision of ANOINTED, a brand that places the identity, worth and uniqueness of every woman at its centre.',
        'From this connection comes The ANOINTED Woman, an original illustration created by Pamela Palagi for the brand, through which the artist interprets the essence of the ANOINTED woman: a woman aware of her own worth, authentic, free to express her personality and to stand out while staying true to herself.',
        'The work thus becomes more than an aesthetic representation. It is a meeting of two creative languages, art and fashion, which share the desire to celebrate female identity and to tell the story of beauty in its most authentic form.',
        'The collaboration with Pamela Palagi’s Nonsolokina reflects ANOINTED’s desire to build authentic connections with artists and creatives who share the brand’s sensitivity and values, giving space to new forms of expression and interpretation.',
        'The ANOINTED Woman is the result of this encounter: a work that unites two creative visions and shows how art and fashion can speak to each other, enrich one another and give shape to something unique.',
      ],
      closing: 'You are unique. You are worthy. You are chosen.',
      linkLabel: 'Discover Nonsolokina',
      gallery: pamela(false),
    },
  },
  {
    slug: 'equipher-italia-casa-ruffino',
    iso: '2026-11-21',
    tipo: 'evento',
    link: 'https://equipherconference.com/italy/',
    it: {
      date: '21 novembre 2026',
      location: 'Toscana, Italia',
      title: 'Anointed a EquipHer Italia — Casa Ruffino',
      teaser: 'Una giornata dedicata a donne, leadership e scopo a Casa Ruffino — nel mondo dove era nata la prima idea di Anointed.',
      body: [
        'Il 21 novembre Anointed è stata presente a EquipHer Italia, a Casa Ruffino, per una giornata dedicata a donne, leadership, imprenditorialità, fede e crescita personale.',
        'Un evento dal significato speciale per il brand. La prima idea di Anointed era nata proprio durante un’esperienza EquipHer a Las Vegas, nell’aprile 2025: un momento che ha acceso la visione di un brand di moda con un significato più profondo, pensato per ricordare alle donne il loro valore, la loro identità e il loro scopo.',
        'Un anno dopo, Sofia Meneghetti, Founder di Anointed, è tornata nel mondo EquipHer con il brand al suo fianco, portando quella visione originaria in qualcosa di reale e tangibile.',
        'A Casa Ruffino le ospiti hanno potuto incontrare Sofia, conoscersi di persona e scoprire Anointed più da vicino: la sua storia, il suo messaggio e il mondo che sta prendendo forma attorno al brand.',
        'Per Anointed è stato più della semplice presenza a un evento: un ritorno significativo nel tipo di ambiente che ne ha ispirato l’inizio, uno spazio in cui le donne si connettono, condividono idee, crescono e si incoraggiano a vicenda a fare un passo verso qualcosa di più grande.',
      ],
      closing: 'Grazie a tutte le donne che sono passate a salutarci a Casa Ruffino.',
      gallery: casaRuffino(true),
    },
    en: {
      date: '21 November 2026',
      location: 'Tuscany, Italy',
      title: 'Anointed at EquipHer Italia — Casa Ruffino',
      teaser: 'A day for women, leadership and purpose at Casa Ruffino — in the world where the first idea of Anointed was born.',
      body: [
        'On November 21st, Anointed was present at EquipHer Italia at Casa Ruffino, for a day dedicated to women, leadership, entrepreneurship, faith and personal growth.',
        'An event with a special meaning for the brand. The first idea behind Anointed was born during an EquipHer experience in Las Vegas in April 2025: a moment that sparked a vision for a fashion brand with deeper meaning, created to remind women of their value, identity and purpose.',
        'A year later, Sofia Meneghetti, Founder of Anointed, returned to the EquipHer world with the brand by her side, bringing that original vision into something real and tangible.',
        'At Casa Ruffino, guests were able to meet Sofia, connect in person and discover Anointed more closely: its story, its message and the world that is taking shape around the brand.',
        'For Anointed, it was more than simply being present at an event: a meaningful return to the kind of environment that inspired its beginning, a space where women connect, share ideas, grow and encourage one another to step into something greater.',
      ],
      closing: 'Thank you to all the women who came to say hello at Casa Ruffino.',
      gallery: casaRuffino(false),
    },
  },
  {
    slug: 'connection-business-roma',
    iso: '2026-10-10',
    tipo: 'speaking',
    image: '/images/about/connection-business.jpg',
    it: {
      date: '10 ottobre 2026',
      location: 'Roma, Italia',
      title: 'ANOINTED al Connection Business',
      teaser: 'Sofia Meneghetti è salita sul palco a Roma per raccontare la storia di ANOINTED.',
      imageAlt: 'Sofia Meneghetti sul palco di Connection Business a Roma',
      caption: 'Connection Business, Roma · 10 ottobre 2026',
      body: [
        "Il 10 ottobre Sofia Meneghetti, Founder di ANOINTED, è salita sul palco di Connection Business a Roma, un evento che ha riunito imprenditori, professionisti e persone che credono nel potere delle connessioni autentiche.",
        "Durante il suo intervento, Sofia ha condiviso il proprio percorso imprenditoriale e la storia dietro la nascita di ANOINTED, sottolineando come incontri significativi, una visione chiara e il coraggio di agire possano trasformare un'idea in realtà.",
        "Attingendo alla propria esperienza personale, ha parlato dell'importanza di credere in una visione anche quando la strada davanti non è ancora chiara, e di circondarsi di persone che ispirano, sfidano e incoraggiano a crescere.",
        "Il suo messaggio è stato anche un invito alle nuove generazioni: credere nel proprio potenziale, inseguire i propri sogni e avere il coraggio di fare il primo passo, anche prima di avere tutte le risposte.",
        "Questa filosofia è profondamente legata alla visione di ANOINTED, un brand nato non solo per esprimere l'identità attraverso la moda, ma anche per ispirare le persone a riconoscere il proprio valore, abbracciare il proprio scopo e credere in qualcosa di più grande.",
        "Per ANOINTED, Connection Business è stato più di un'occasione per raccontare la propria storia. È stato un momento per connettersi, ispirare e ricordare agli altri che ogni percorso significativo inizia con il coraggio di credere in ciò che è possibile.",
      ],
    },
    en: {
      date: '10 October 2026',
      location: 'Rome, Italy',
      title: 'ANOINTED at Connection Business',
      teaser: 'Sofia Meneghetti took the stage in Rome to share the story behind ANOINTED.',
      imageAlt: 'Sofia Meneghetti speaking on stage at Connection Business in Rome',
      caption: 'Connection Business, Rome · 10 October 2026',
      body: [
        "On October 10th, Sofia Meneghetti, Founder of ANOINTED, took the stage at Connection Business in Rome, an event that brought together entrepreneurs, professionals, and individuals who believe in the power of meaningful connections.",
        "During her talk, Sofia shared her entrepreneurial journey and the story behind the creation of ANOINTED, highlighting how meaningful encounters, a clear vision, and the courage to take action can turn an idea into reality.",
        "Drawing from her personal experience, she spoke about the importance of believing in a vision, even when the path ahead is not yet clear, and surrounding yourself with people who inspire, challenge, and encourage you to grow.",
        "Her message was also an invitation to the younger generation: to believe in their potential, pursue their dreams, and have the courage to take the first step, even before having all the answers.",
        "This philosophy is deeply connected to the vision behind ANOINTED, a brand created not only to express identity through fashion, but also to inspire people to recognize their worth, embrace their purpose, and believe in something greater.",
        "For ANOINTED, Connection Business represented more than an opportunity to share its story. It was a moment to connect, inspire, and remind others that every meaningful journey begins with the courage to believe in what is possible.",
      ],
    },
  },
]

// Oggi in formato AAAA-MM-GG (ora italiana): un evento resta "in programma" per tutto il suo giorno
function oggiISO() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date())
}

export function dividiVoci(voci: VoceWorld[] = VOCI_WORLD) {
  const oggi = oggiISO()
  const inProgramma = voci.filter(v => v.tipo === 'evento' && v.iso >= oggi).sort((a, b) => a.iso.localeCompare(b.iso))
  const passate = voci.filter(v => !inProgramma.includes(v)).sort((a, b) => b.iso.localeCompare(a.iso))
  return { inProgramma, passate }
}

// Home: prima gli eventi in arrivo (dal più vicino), poi i contenuti più recenti. Massimo 3.
export function ultimeVoci(n = 3) {
  const { inProgramma, passate } = dividiVoci()
  return [...inProgramma, ...passate].slice(0, n)
}

// ── Utilità per l'indice e le pagine articolo ──

export const ETICHETTE_UI = {
  it: { evidenza: 'In evidenza', inArrivo: 'In arrivo', archivio: 'Eventi e collaborazioni', tutti: 'Tutti', leggi: 'Leggi', mostraAltri: 'Mostra altri', altri: 'Altri momenti', torna: 'Torna ad Anointed World', anno: 'Anno' },
  en: { evidenza: 'Featured', inArrivo: 'Upcoming', archivio: 'Events & collaborations', tutti: 'All', leggi: 'Read', mostraAltri: 'Show more', altri: 'More moments', torna: 'Back to Anointed World', anno: 'Year' },
}

/** Immagine di copertina: quella dedicata, altrimenti la prima della galleria. */
export function copertina(v: VoceWorld, locale: 'it' | 'en') {
  return v.image || v[locale].gallery?.[0]?.src || ''
}

export function trovaVoce(slug: string) {
  return VOCI_WORLD.find(v => v.slug === slug)
}

/** In evidenza: quella scelta a mano, altrimenti il prossimo evento, altrimenti l'ultimo contenuto. */
export function voceInEvidenza(voci: VoceWorld[] = VOCI_WORLD) {
  const { inProgramma, passate } = dividiVoci(voci)
  return voci.find(v => v.inEvidenza) || inProgramma[0] || passate[0]
}

/** Altri contenuti per la pagina articolo: prima dello stesso tipo, poi i più recenti. */
export function altreVoci(slug: string, n = 3) {
  const v = trovaVoce(slug)
  const resto = [...VOCI_WORLD].filter(x => x.slug !== slug).sort((a, b) => b.iso.localeCompare(a.iso))
  const stesso = resto.filter(x => x.tipo === v?.tipo)
  return [...stesso, ...resto.filter(x => !stesso.includes(x))].slice(0, n)
}
