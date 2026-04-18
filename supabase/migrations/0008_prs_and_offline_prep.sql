-- Sundee Fundee — Feature 1 (auto-PRs) + preemptive Feature 5 (offline) columns.
--
-- Additive only:
--   * one_rep_max_records.source  — distinguish manual logs from auto-estimated PRs.
--   * client_id                   — idempotency key for offline replay (Dexie outbox).
--
-- Nothing drops, nothing backfills destructively.

-- ─── one_rep_max_records.source ───────────────────────────────────────────
alter table public.one_rep_max_records
  add column if not exists source text not null default 'manual'
  check (source in ('manual', 'estimated', 'retest'));

-- ─── client_id columns for offline idempotency ────────────────────────────
alter table public.workouts
  add column if not exists client_id uuid;
create unique index if not exists workouts_client_id_key
  on public.workouts (user_id, client_id)
  where client_id is not null;

alter table public.workout_exercises
  add column if not exists client_id uuid;
create unique index if not exists workout_exercises_client_id_key
  on public.workout_exercises (workout_id, client_id)
  where client_id is not null;

alter table public.workout_sets
  add column if not exists client_id uuid;
create unique index if not exists workout_sets_client_id_key
  on public.workout_sets (workout_exercise_id, client_id)
  where client_id is not null;

alter table public.recovery_scores
  add column if not exists client_id uuid;
create unique index if not exists recovery_scores_client_id_key
  on public.recovery_scores (user_id, client_id)
  where client_id is not null;

alter table public.daily_pain_logs
  add column if not exists client_id uuid;
create unique index if not exists daily_pain_logs_client_id_key
  on public.daily_pain_logs (user_id, client_id)
  where client_id is not null;

alter table public.one_rep_max_records
  add column if not exists client_id uuid;
create unique index if not exists one_rep_max_records_client_id_key
  on public.one_rep_max_records (user_id, client_id)
  where client_id is not null;
