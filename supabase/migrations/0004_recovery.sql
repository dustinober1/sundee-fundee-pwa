-- Sundee Fundee — recovery, injuries, pain, cycle.

-- ─── enums ────────────────────────────────────────────────────────────────
do $$ begin
  create type public.recovery_phase as enum (
    'acute', 'rehab', 'light_load', 'return_to_play', 'resolved'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.pain_type as enum (
    'acute', 'chronic', 'soreness', 'stiffness', 'sharp', 'dull', 'aching', 'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.training_recommendation as enum (
    'push_day', 'moderate', 'rest_day'
  );
exception when duplicate_object then null; end $$;

-- ─── recovery_scores ──────────────────────────────────────────────────────
-- Daily snapshot: total + sub-scores. sub_scores is jsonb to allow missing
-- inputs without bloating the column count.
create table if not exists public.recovery_scores (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users(id) on delete cascade,
  performed_on             date not null default current_date,
  total                    integer not null check (total between 0 and 100),
  recommendation           public.training_recommendation not null,
  sub_scores               jsonb not null default '{}'::jsonb,
  hrv_ms                   numeric(6,2),
  sleep_hours              numeric(4,2),
  pain_intensity           integer check (pain_intensity between 0 and 10),
  cycle_phase              public.cycle_phase,
  notes                    text,
  created_at               timestamptz not null default now(),
  unique (user_id, performed_on)
);

create index if not exists recovery_scores_user_date_idx
  on public.recovery_scores (user_id, performed_on desc);

alter table public.recovery_scores enable row level security;
drop policy if exists recovery_scores_owner_all on public.recovery_scores;
create policy recovery_scores_owner_all on public.recovery_scores for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─── injuries ─────────────────────────────────────────────────────────────
create table if not exists public.injuries (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  location_ids    text[] not null default '{}',
  recovery_phase  public.recovery_phase not null default 'acute',
  phase_updated   timestamptz not null default now(),
  notes           text,
  date_created    timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists injuries_user_idx on public.injuries (user_id, recovery_phase);

drop trigger if exists injuries_updated_at on public.injuries;
create trigger injuries_updated_at
  before update on public.injuries
  for each row execute function public.set_updated_at();

alter table public.injuries enable row level security;
drop policy if exists injuries_owner_all on public.injuries;
create policy injuries_owner_all on public.injuries for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─── daily_pain_logs ──────────────────────────────────────────────────────
create table if not exists public.daily_pain_logs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  performed_on    date not null default current_date,
  location_ids    text[] not null default '{}',
  intensity       integer not null check (intensity between 1 and 10),
  pain_type       public.pain_type not null default 'soreness',
  notes           text,
  created_at      timestamptz not null default now()
);

create index if not exists daily_pain_logs_user_idx
  on public.daily_pain_logs (user_id, performed_on desc);

alter table public.daily_pain_logs enable row level security;
drop policy if exists pain_logs_owner_all on public.daily_pain_logs;
create policy pain_logs_owner_all on public.daily_pain_logs for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─── cycle_settings (one row per user) ────────────────────────────────────
create table if not exists public.cycle_settings (
  user_id                       uuid primary key references auth.users(id) on delete cascade,
  average_cycle_length_days     integer not null default 28 check (average_cycle_length_days between 14 and 60),
  average_period_length_days    integer not null default 5 check (average_period_length_days between 1 and 14),
  luteal_phase_length_days      integer not null default 14 check (luteal_phase_length_days between 7 and 20),
  last_period_start             date,
  updated_at                    timestamptz not null default now()
);

drop trigger if exists cycle_settings_updated_at on public.cycle_settings;
create trigger cycle_settings_updated_at
  before update on public.cycle_settings
  for each row execute function public.set_updated_at();

alter table public.cycle_settings enable row level security;
drop policy if exists cycle_settings_owner_all on public.cycle_settings;
create policy cycle_settings_owner_all on public.cycle_settings for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─── period_logs (multiple periods per user) ──────────────────────────────
create table if not exists public.period_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  start_date   date not null,
  end_date     date,
  notes        text,
  created_at   timestamptz not null default now(),
  unique (user_id, start_date)
);

create index if not exists period_logs_user_idx
  on public.period_logs (user_id, start_date desc);

alter table public.period_logs enable row level security;
drop policy if exists period_logs_owner_all on public.period_logs;
create policy period_logs_owner_all on public.period_logs for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
