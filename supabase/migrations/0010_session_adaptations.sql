-- Sundee Fundee — Feature 3: adaptive session rewrite.
--
-- Stores pending/accepted/dismissed adaptation decisions per user, keyed by
-- enrollment + week + session. The `payload` jsonb is the computed
-- { exercises, swaps, multiplier, rationale } blob — applied at confirm time.

create table if not exists public.session_adaptations (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references auth.users(id) on delete cascade,
  enrollment_id    uuid         not null references public.enrolled_programs(id) on delete cascade,
  week_num         integer      not null,
  session_index    integer      not null,
  recovery_score   integer,
  cycle_phase      public.cycle_phase,
  load_multiplier  numeric(4,3),
  payload          jsonb        not null default '{}'::jsonb,
  accepted_at      timestamptz,
  dismissed_at     timestamptz,
  created_at       timestamptz  not null default now(),
  updated_at       timestamptz  not null default now(),
  unique (enrollment_id, week_num, session_index)
);

create index if not exists session_adaptations_user_idx
  on public.session_adaptations (user_id, created_at desc);

drop trigger if exists session_adaptations_updated_at on public.session_adaptations;
create trigger session_adaptations_updated_at
  before update on public.session_adaptations
  for each row execute function public.set_updated_at();

alter table public.session_adaptations enable row level security;

drop policy if exists session_adaptations_owner_all on public.session_adaptations;
create policy session_adaptations_owner_all on public.session_adaptations for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
