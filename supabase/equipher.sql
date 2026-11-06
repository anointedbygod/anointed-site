-- Pass EquipHer (21/11/2026): codice progressivo EQUIPHER-001, 002, ... assegnato alla conferma dell'email.
-- Non e' uno sconto del sito: serve solo come prova da mostrare allo stand.
-- Da eseguire una volta nel SQL Editor di Supabase.
create sequence if not exists equipher_seq;

alter table newsletter_iscritti
  add column if not exists codice_evento text unique,
  add column if not exists codice_evento_usato_at timestamptz;

create or replace function prossimo_codice_equipher() returns text
language sql as $$
  select 'EQUIPHER-' || lpad(nextval('equipher_seq')::text, 3, '0')
$$;
