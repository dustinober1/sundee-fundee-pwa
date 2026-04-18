-- Sundee Fundee — Feature 5: tombstones for offline-safe deletes.
--
-- A tombstone column lets a queued delete replay without racing a concurrent
-- re-insert of the same row from another device. Readers filter out rows with
-- deleted_at IS NOT NULL. Not a soft-delete with UI — it's purely a sync helper.
--
-- Additive: null default, no index, no RLS change. Rows without a tombstone
-- behave exactly as before.

alter table public.workouts           add column if not exists deleted_at timestamptz;
alter table public.workout_exercises  add column if not exists deleted_at timestamptz;
alter table public.workout_sets       add column if not exists deleted_at timestamptz;
alter table public.recovery_scores    add column if not exists deleted_at timestamptz;
alter table public.daily_pain_logs    add column if not exists deleted_at timestamptz;
alter table public.one_rep_max_records add column if not exists deleted_at timestamptz;
