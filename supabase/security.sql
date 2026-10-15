-- ANOINTED — Row Level Security
-- Da eseguire UNA VOLTA nel SQL Editor di Supabase (progetto di produzione).
--
-- Tutto l'accesso ai dati passa dalle API di Next.js con la chiave service_role,
-- che ignora RLS. Abilitando RLS SENZA policy, la chiave pubblica (anon key,
-- visibile nel browser) non può più leggere né scrivere nessuna di queste tabelle
-- direttamente: chi la usa contro l'API REST di Supabase riceve zero righe.
--
-- Se una tabella non esiste con questo nome, la riga viene saltata (IF EXISTS).

alter table if exists public.ordini                enable row level security;
alter table if exists public.righe_ordine          enable row level security;
alter table if exists public.indirizzi_clienti     enable row level security;
alter table if exists public.wishlist              enable row level security;
alter table if exists public.carrelli_abbandonati  enable row level security;
alter table if exists public.newsletter_iscritti   enable row level security;
alter table if exists public.utilizzi_sconti       enable row level security;
alter table if exists public.codici_sconto         enable row level security;
alter table if exists public.zone_spedizione       enable row level security;
alter table if exists public.prodotti              enable row level security;
alter table if exists public.varianti              enable row level security;
alter table if exists public.colori_prodotto       enable row level security;
alter table if exists public.immagini_colore       enable row level security;
alter table if exists public.sezioni               enable row level security;
alter table if exists public.template_varianti     enable row level security;

-- Verifica: deve elencare tutte le tabelle con rowsecurity = true
select tablename, rowsecurity from pg_tables where schemaname = 'public' order by tablename;
