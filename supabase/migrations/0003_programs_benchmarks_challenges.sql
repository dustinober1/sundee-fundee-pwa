-- Sundee Fundee — programs, benchmarks, challenges.

-- ─── enums ────────────────────────────────────────────────────────────────
do $$ begin
  create type public.benchmark_category as enum (
    'sundee_fundee', 'classic_wods', 'strength', 'endurance', 'gymnastics', 'general_fitness'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.benchmark_scoring as enum (
    'time', 'rounds_and_reps', 'load', 'reps', 'calories', 'distance'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.cycle_phase as enum (
    'follicular', 'ovulation', 'luteal', 'menstrual'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.challenge_type as enum (
    'lifetime_volume', 'exercise_volume', 'custom'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.challenge_status as enum ('active', 'completed', 'expired');
exception when duplicate_object then null; end $$;

-- ─── benchmark_definitions (seeded catalog) ───────────────────────────────
create table if not exists public.benchmark_definitions (
  id                   text primary key,
  name                 text not null,
  category             public.benchmark_category not null,
  workout_description  text not null,
  scoring_type         public.benchmark_scoring not null,
  intensity            integer check (intensity between 1 and 5),
  sort_order           integer not null default 0,
  movement_tags        text[] not null default '{}',
  equipment            text[] not null default '{}',
  time_domain          text,
  coach_notes          text,
  is_predefined        boolean not null default true
);

create index if not exists benchmark_definitions_category_idx
  on public.benchmark_definitions (category, sort_order);

alter table public.benchmark_definitions enable row level security;

drop policy if exists benchmark_defs_select_all on public.benchmark_definitions;
create policy benchmark_defs_select_all on public.benchmark_definitions
  for select using (true);

-- ─── benchmark_results ────────────────────────────────────────────────────
create table if not exists public.benchmark_results (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  benchmark_id  text not null references public.benchmark_definitions(id) on delete restrict,
  score         numeric(10,3) not null,
  notes         text,
  performed_on  date not null default current_date,
  cycle_phase   public.cycle_phase,
  created_at    timestamptz not null default now()
);

create index if not exists benchmark_results_user_idx
  on public.benchmark_results (user_id, benchmark_id, performed_on desc);

alter table public.benchmark_results enable row level security;

drop policy if exists benchmark_results_owner_all on public.benchmark_results;
create policy benchmark_results_owner_all on public.benchmark_results for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─── program_templates (seeded) ───────────────────────────────────────────
-- phases + weeks stored as jsonb mirroring the iOS Generated* shape.
create table if not exists public.program_templates (
  id                  text primary key,
  name                text not null,
  category            text not null,
  description         text not null,
  difficulty          text not null,
  duration_weeks      integer not null,
  sessions_per_week   integer not null,
  phases              jsonb not null default '[]'::jsonb,
  weeks               jsonb not null default '[]'::jsonb,
  is_predefined       boolean not null default true,
  sort_order          integer not null default 0
);

alter table public.program_templates enable row level security;
drop policy if exists program_templates_select_all on public.program_templates;
create policy program_templates_select_all on public.program_templates
  for select using (true);

-- ─── enrolled_programs ────────────────────────────────────────────────────
create table if not exists public.enrolled_programs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  template_id   text not null references public.program_templates(id) on delete restrict,
  is_active     boolean not null default true,
  started_on    date not null default current_date,
  completed_on  date,
  current_week  integer not null default 1,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create unique index if not exists enrolled_programs_one_active_per_user
  on public.enrolled_programs (user_id) where is_active;

drop trigger if exists enrolled_programs_updated_at on public.enrolled_programs;
create trigger enrolled_programs_updated_at
  before update on public.enrolled_programs
  for each row execute function public.set_updated_at();

alter table public.enrolled_programs enable row level security;
drop policy if exists enrolled_programs_owner_all on public.enrolled_programs;
create policy enrolled_programs_owner_all on public.enrolled_programs for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─── challenges ───────────────────────────────────────────────────────────
-- Tiers stored as jsonb array of { name, target_volume_lbs, ordinal }.
create table if not exists public.challenges (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users(id) on delete cascade,
  type                     public.challenge_type not null,
  title                    text not null,
  exercise_id              uuid references public.exercises(id) on delete set null,
  exercise_name            text,
  tiers                    jsonb not null,
  current_tier_index       integer not null default 0,
  accumulated_volume_lbs   numeric(14,2) not null default 0,
  status                   public.challenge_status not null default 'active',
  challenge_start_date     date not null default current_date,
  challenge_end_date       date,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists challenges_user_idx
  on public.challenges (user_id, status);

drop trigger if exists challenges_updated_at on public.challenges;
create trigger challenges_updated_at
  before update on public.challenges
  for each row execute function public.set_updated_at();

alter table public.challenges enable row level security;
drop policy if exists challenges_owner_all on public.challenges;
create policy challenges_owner_all on public.challenges for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
