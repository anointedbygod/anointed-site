-- Sicurezza: registro dei login falliti, per l'avviso dopo 5 password errate di fila.
-- Eseguire una volta nel SQL Editor di Supabase. Idempotente.
create table if not exists public.tentativi_login (
  id bigint generated always as identity primary key,
  email text not null,
  ip text,
  created_at timestamptz not null default now()
);
create index if not exists tentativi_login_email_created_idx on public.tentativi_login (email, created_at desc);
-- RLS senza policy: la chiave pubblica non può leggere né scrivere; ci pensa solo il server (service_role)
alter table public.tentativi_login enable row level security;
