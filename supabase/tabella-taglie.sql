-- Tabella taglie per prodotto (immagine caricata dall'admin, mostrata nel pulsante "Guida taglie").
-- ESEGUIRE PRIMA di pubblicare l'admin che salva il campo.
alter table public.prodotti add column if not exists tabella_taglie text;
