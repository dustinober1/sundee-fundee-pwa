-- Sundee Fundee — Feature 4: coach recommendations.
--
-- Append-only log of system-generated recommendations. Dismissed + acted rows
-- stay in the table for history; active rows are those with both timestamps null.

create table if not exists public.coach_recommendations (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  kind          text        not null check (kind in (
    'deload', 'retest_1rm', 'reduce_volume', 'plateau', 'pain_focus'
  )),
  exercise_id   uuid        references public.exercises(id) on delete set null,
  rationale     text        not null,
  severity      text        not null default 'info' check (severity in ('info', 'warn', 'urgent')),
  dedup_key     text        not null,
  created_at    timestamptz not null default now(),
  dismissed_at  timestamptz,
  acted_at      timestamptz
);

-- One active row per (user, dedup_key). Completed/dismissed rows don't block
-- a future re-suggestion once the condition re-fires.
create unique index if not exists coach_recommendations_active_dedup
  on public.coach_recommendations (user_id, dedup_key)
  where dismissed_at is null and acted_at is null;

create index if not exists coach_recommendations_user_idx
  on public.coach_recommendations (user_id, created_at desc);

alter table public.coach_recommendations enable row level security;

drop policy if exists coach_recommendations_owner_all on public.coach_recommendations;
create policy coach_recommendations_owner_all on public.coach_recommendations for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
