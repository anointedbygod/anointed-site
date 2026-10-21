-- Informazioni obbligatorie sui prodotti tessili (etichettatura Reg. UE 1007/2011, GPSR).
-- ESEGUI QUESTO SCRIPT SU SUPABASE PRIMA di pubblicare l'admin con i nuovi campi:
-- senza le colonne, salvare un prodotto dall'admin darebbe errore.
alter table public.prodotti add column if not exists composizione   text;
alter table public.prodotti add column if not exists cura           text;
alter table public.prodotti add column if not exists paese_origine  text default 'Italia';
alter table public.prodotti add column if not exists produttore     text;
