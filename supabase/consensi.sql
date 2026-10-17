-- Prova del consenso alla newsletter (data, fonte, lingua).
-- Eseguire una volta nel SQL Editor di Supabase. Idempotente.
alter table public.newsletter_iscritti add column if not exists consenso_at timestamptz;
alter table public.newsletter_iscritti add column if not exists consenso_fonte text;
alter table public.newsletter_iscritti add column if not exists consenso_lingua text;
