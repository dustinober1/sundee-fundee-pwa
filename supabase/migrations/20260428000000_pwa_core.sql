create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  data_mode text not null default 'cloud-sync' check (data_mode in ('local-only', 'cloud-sync')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exercises (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null default 'strength',
  primary_muscles text[] not null default '{}',
  is_custom boolean not null default true,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  sync_status text not null default 'synced'
);

create table if not exists public.lifts (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null,
  best_estimated_one_rep_max numeric,
  unit text not null default 'lb' check (unit in ('lb', 'kg')),
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  sync_status text not null default 'synced'
);

create table if not exists public.workouts (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  status text not null check (status in ('planned', 'active', 'completed')),
  source text not null default 'manual' check (source in ('manual', 'program', 'ai')),
  notes text,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  sync_status text not null default 'synced'
);

create table if not exists public.workout_sets (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_id text not null,
  exercise_id text not null,
  set_index integer not null,
  reps integer not null,
  weight numeric not null,
  unit text not null default 'lb' check (unit in ('lb', 'kg')),
  rpe numeric,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  sync_status text not null default 'synced'
);

create table if not exists public.cycle_settings (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  average_cycle_length_days integer not null default 28,
  average_period_length_days integer not null default 5,
  luteal_phase_length_days integer not null default 14,
  tracking_enabled boolean not null default false,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  sync_status text not null default 'synced'
);

create table if not exists public.period_logs (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  started_on date not null,
  ended_on date,
  flow text check (flow in ('light', 'medium', 'heavy')),
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  sync_status text not null default 'synced'
);

create table if not exists public.recovery_scores (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  recorded_on date not null,
  score numeric not null check (score >= 0 and score <= 100),
  sleep_quality numeric,
  soreness numeric,
  stress numeric,
  notes text,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  sync_status text not null default 'synced'
);

create table if not exists public.programs (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  template_id text,
  category text,
  difficulty text,
  weeks integer not null default 4,
  sessions_per_week integer not null default 3,
  source text not null default 'custom' check (source in ('bundled', 'custom')),
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  sync_status text not null default 'synced'
);

create table if not exists public.program_enrollments (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id text not null,
  started_on date not null,
  current_week integer not null default 1,
  current_session_index integer not null default 0,
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  sync_status text not null default 'synced'
);

create table if not exists public.injuries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  body_location text not null,
  severity integer not null check (severity between 1 and 5),
  notes text,
  active boolean not null default true,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  sync_status text not null default 'synced'
);

create table if not exists public.sync_events (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  entity text not null,
  entity_id text not null,
  operation text not null check (operation in ('upsert', 'delete')),
  status text not null default 'queued',
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.donations (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  amount_cents integer not null,
  currency text not null default 'usd',
  mode text not null check (mode in ('payment', 'subscription')),
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

drop policy if exists "Users can read their profile" on public.profiles;
drop policy if exists "Users can update their profile" on public.profiles;
drop policy if exists "Users can insert their profile" on public.profiles;
drop policy if exists "Users manage their exercises" on public.exercises;
drop policy if exists "Users manage their lifts" on public.lifts;
drop policy if exists "Users manage their workouts" on public.workouts;
drop policy if exists "Users manage their workout sets" on public.workout_sets;
drop policy if exists "Users manage their cycle settings" on public.cycle_settings;
drop policy if exists "Users manage their period logs" on public.period_logs;
drop policy if exists "Users manage their recovery scores" on public.recovery_scores;
drop policy if exists "Users manage their programs" on public.programs;
drop policy if exists "Users manage their program enrollments" on public.program_enrollments;
drop policy if exists "Users manage their injuries" on public.injuries;
drop policy if exists "Users manage their sync events" on public.sync_events;
drop policy if exists "Users read their donations" on public.donations;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'lifts_exercise_id_fkey'
  ) then
    alter table public.lifts
      add constraint lifts_exercise_id_fkey
      foreign key (exercise_id) references public.exercises(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'workout_sets_workout_id_fkey'
  ) then
    alter table public.workout_sets
      add constraint workout_sets_workout_id_fkey
      foreign key (workout_id) references public.workouts(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'workout_sets_exercise_id_fkey'
  ) then
    alter table public.workout_sets
      add constraint workout_sets_exercise_id_fkey
      foreign key (exercise_id) references public.exercises(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'program_enrollments_program_id_fkey'
  ) then
    alter table public.program_enrollments
      add constraint program_enrollments_program_id_fkey
      foreign key (program_id) references public.programs(id) on delete cascade;
  end if;
end $$;

create index if not exists profiles_updated_at_idx on public.profiles(updated_at);
create index if not exists exercises_user_updated_idx on public.exercises(user_id, updated_at);
create index if not exists lifts_user_updated_idx on public.lifts(user_id, updated_at);
create index if not exists lifts_exercise_id_idx on public.lifts(exercise_id);
create index if not exists workouts_user_updated_idx on public.workouts(user_id, updated_at);
create index if not exists workout_sets_user_updated_idx on public.workout_sets(user_id, updated_at);
create index if not exists workout_sets_workout_id_idx on public.workout_sets(workout_id);
create index if not exists workout_sets_exercise_id_idx on public.workout_sets(exercise_id);
create index if not exists cycle_settings_user_updated_idx on public.cycle_settings(user_id, updated_at);
create index if not exists period_logs_user_updated_idx on public.period_logs(user_id, updated_at);
create index if not exists recovery_scores_user_updated_idx on public.recovery_scores(user_id, updated_at);
create index if not exists programs_user_updated_idx on public.programs(user_id, updated_at);
create index if not exists program_enrollments_user_updated_idx on public.program_enrollments(user_id, updated_at);
create index if not exists program_enrollments_program_id_idx on public.program_enrollments(program_id);
create index if not exists injuries_user_updated_idx on public.injuries(user_id, updated_at);
create index if not exists sync_events_user_updated_idx on public.sync_events(user_id, updated_at);
create index if not exists donations_user_created_idx on public.donations(user_id, created_at);

alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.lifts enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_sets enable row level security;
alter table public.cycle_settings enable row level security;
alter table public.period_logs enable row level security;
alter table public.recovery_scores enable row level security;
alter table public.programs enable row level security;
alter table public.program_enrollments enable row level security;
alter table public.injuries enable row level security;
alter table public.sync_events enable row level security;
alter table public.donations enable row level security;
alter table public.stripe_events enable row level security;

create policy "Users can read their profile" on public.profiles
  for select using (id = auth.uid());
create policy "Users can update their profile" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Users can insert their profile" on public.profiles
  for insert with check (id = auth.uid());

create policy "Users manage their exercises" on public.exercises
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage their lifts" on public.lifts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage their workouts" on public.workouts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage their workout sets" on public.workout_sets
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage their cycle settings" on public.cycle_settings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage their period logs" on public.period_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage their recovery scores" on public.recovery_scores
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage their programs" on public.programs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage their program enrollments" on public.program_enrollments
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage their injuries" on public.injuries
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage their sync events" on public.sync_events
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users read their donations" on public.donations
  for select using (user_id = auth.uid());
