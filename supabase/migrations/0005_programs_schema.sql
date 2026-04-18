-- Sundee Fundee — programs schema: is_admin flag, template JSONB constraints, enrolled session linkage.

-- ─── user_profiles: is_admin flag ────────────────────────────────────────────

alter table public.user_profiles
  add column if not exists is_admin boolean not null default false;

-- ─── program_templates: JSONB array check constraints ─────────────────────────

-- D-05: lightweight array-type guards; no deep structure validation
alter table public.program_templates
  add constraint program_templates_phases_is_array
    check (jsonb_typeof(phases) = 'array');

alter table public.program_templates
  add constraint program_templates_weeks_is_array
    check (jsonb_typeof(weeks) = 'array');

-- ─── program_templates: admin write RLS policy ────────────────────────────────

-- D-07: direct subquery; no helper function
-- D-08: existing program_templates_select_all policy is preserved (not dropped)
drop policy if exists program_templates_admin_write on public.program_templates;
create policy program_templates_admin_write on public.program_templates
  for all
  using   (exists (select 1 from public.user_profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.user_profiles where id = auth.uid() and is_admin = true));

-- ─── enrolled_program_sessions ────────────────────────────────────────────────

-- D-09: minimal schema with session_workout_id linkage column
create table if not exists public.enrolled_program_sessions (
  id                 uuid        primary key default gen_random_uuid(),
  enrollment_id      uuid        not null references public.enrolled_programs(id) on delete cascade,
  week_num           integer     not null,
  session_index      integer     not null,
  completed_at       timestamptz,
  session_workout_id uuid        references public.workouts(id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  -- D-10: prevents double-logging; Phase 6 can upsert on conflict
  unique (enrollment_id, week_num, session_index)
);

-- Supporting index for FK lookups by enrollment (unique constraint covers the composite)
create index if not exists enrolled_program_sessions_enrollment_idx
  on public.enrolled_program_sessions (enrollment_id);

-- updated_at trigger (consistent with enrolled_programs and all other tables)
drop trigger if exists enrolled_program_sessions_updated_at on public.enrolled_program_sessions;
create trigger enrolled_program_sessions_updated_at
  before update on public.enrolled_program_sessions
  for each row execute function public.set_updated_at();

alter table public.enrolled_program_sessions enable row level security;

-- D-11: owner-all via cross-table subquery mirroring workout_exercises_owner_all pattern
drop policy if exists enrolled_program_sessions_owner_all on public.enrolled_program_sessions;
create policy enrolled_program_sessions_owner_all on public.enrolled_program_sessions for all
  using (
    exists (select 1 from public.enrolled_programs where id = enrollment_id and user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.enrolled_programs where id = enrollment_id and user_id = auth.uid())
  );
