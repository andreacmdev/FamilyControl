-- ─────────────────────────────────────────────────────────────────────────────
-- FamilyControl — Schema inicial
-- ─────────────────────────────────────────────────────────────────────────────

-- Enums

create type agenda_category as enum (
  'familia', 'igreja', 'saude', 'trabalho', 'financeiro', 'casa', 'outros'
);

create type entry_type as enum ('receita', 'despesa');

create type entry_status as enum ('pendente', 'pago', 'cancelado');

create type financial_category as enum (
  'casa', 'saude', 'transporte', 'assinaturas', 'igreja',
  'mercado', 'pessoal', 'investimento', 'meta', 'outros'
);

-- ─── Membros da família ───────────────────────────────────────────────────────

create table family_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  nickname    text,
  avatar_url  text,
  color       text,
  created_at  timestamptz not null default now()
);

-- ─── Agenda ───────────────────────────────────────────────────────────────────

create table agenda_events (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  description         text,
  event_date          date not null,
  event_time          time,
  category            agenda_category not null default 'familia',
  responsible_member  uuid references family_members(id) on delete set null,
  source              text,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ─── Financeiro ───────────────────────────────────────────────────────────────

create table financial_entries (
  id           uuid primary key default gen_random_uuid(),
  entry_type   entry_type not null,
  description  text not null,
  amount       numeric(12, 2) not null check (amount >= 0),
  due_date     date,
  paid_date    date,
  category     financial_category not null default 'outros',
  status       entry_status not null default 'pendente',
  is_recurring boolean not null default false,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table financial_goals (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text,
  target_amount  numeric(12, 2) not null check (target_amount > 0),
  current_amount numeric(12, 2) not null default 0 check (current_amount >= 0),
  target_date    date,
  is_completed   boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table monthly_notes (
  id          uuid primary key default gen_random_uuid(),
  year        integer not null,
  month       integer not null check (month between 1 and 12),
  content     text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (year, month)
);

-- ─── updated_at automático ────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_agenda_events_updated_at
  before update on agenda_events
  for each row execute function set_updated_at();

create trigger trg_financial_entries_updated_at
  before update on financial_entries
  for each row execute function set_updated_at();

create trigger trg_financial_goals_updated_at
  before update on financial_goals
  for each row execute function set_updated_at();

create trigger trg_monthly_notes_updated_at
  before update on monthly_notes
  for each row execute function set_updated_at();

-- ─── Índices úteis ────────────────────────────────────────────────────────────

create index idx_agenda_events_date on agenda_events (event_date);
create index idx_financial_entries_due_date on financial_entries (due_date);
create index idx_financial_entries_status on financial_entries (status);
create index idx_financial_entries_type on financial_entries (entry_type);
