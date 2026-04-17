-- Sundee Fundee — training surface: exercises, workouts, sets, 1RM.

-- ─── enums ────────────────────────────────────────────────────────────────
do $$ begin
  create type public.exercise_kind as enum ('weightlifting', 'conditioning');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.weightlifting_category as enum (
    'squat', 'hip_hinge', 'press', 'pull', 'carry', 'olympic_weightlifting'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.conditioning_scoring as enum ('time', 'reps');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.set_type as enum ('working', 'warmup', 'amrap', 'drop', 'cluster');
exception when duplicate_object then null; end $$;

-- ─── exercises (catalog + user-custom) ────────────────────────────────────
create table if not exists public.exercises (
  id                       uuid primary key default gen_random_uuid(),
  name                     text not null,
  kind                     public.exercise_kind not null,
  weightlifting_category   public.weightlifting_category,
  conditioning_scoring     public.conditioning_scoring,
  is_seeded                boolean not null default false,
  owner_id                 uuid references auth.users(id) on delete cascade,
  created_at               timestamptz not null default now(),
  unique (name, owner_id),
  check (
    (kind = 'weightlifting' and weightlifting_category is not null and conditioning_scoring is null)
    or
    (kind = 'conditioning' and conditioning_scoring is not null and weightlifting_category is null)
  )
);

create index if not exists exercises_owner_idx on public.exercises (owner_id);
create index if not exists exercises_kind_idx on public.exercises (kind);

alter table public.exercises enable row level security;

drop policy if exists exercises_select on public.exercises;
create policy exercises_select on public.exercises for select
  using (is_seeded or owner_id = auth.uid());

drop policy if exists exercises_insert_own on public.exercises;
create policy exercises_insert_own on public.exercises for insert
  with check (owner_id = auth.uid() and not is_seeded);

drop policy if exists exercises_update_own on public.exercises;
create policy exercises_update_own on public.exercises for update
  using (owner_id = auth.uid() and not is_seeded)
  with check (owner_id = auth.uid() and not is_seeded);

drop policy if exists exercises_delete_own on public.exercises;
create policy exercises_delete_own on public.exercises for delete
  using (owner_id = auth.uid() and not is_seeded);

-- ─── workouts ─────────────────────────────────────────────────────────────
create table if not exists public.workouts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  performed_on  date not null default current_date,
  name          text,
  notes         text,
  duration_min  integer,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists workouts_user_date_idx on public.workouts (user_id, performed_on desc);

drop trigger if exists workouts_updated_at on public.workouts;
create trigger workouts_updated_at
  before update on public.workouts
  for each row execute function public.set_updated_at();

alter table public.workouts enable row level security;

drop policy if exists workouts_owner_all on public.workouts;
create policy workouts_owner_all on public.workouts for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─── workout_exercises (ordered list of exercises in a workout) ───────────
create table if not exists public.workout_exercises (
  id            uuid primary key default gen_random_uuid(),
  workout_id    uuid not null references public.workouts(id) on delete cascade,
  exercise_id   uuid not null references public.exercises(id) on delete restrict,
  position      integer not null,
  notes         text,
  rest_seconds  integer,
  created_at    timestamptz not null default now(),
  unique (workout_id, position)
);

create index if not exists workout_exercises_workout_idx on public.workout_exercises (workout_id);

alter table public.workout_exercises enable row level security;

drop policy if exists workout_exercises_owner_all on public.workout_exercises;
create policy workout_exercises_owner_all on public.workout_exercises for all
  using (
    exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid())
  );

-- ─── workout_sets ─────────────────────────────────────────────────────────
create table if not exists public.workout_sets (
  id                    uuid primary key default gen_random_uuid(),
  workout_exercise_id   uuid not null references public.workout_exercises(id) on delete cascade,
  position              integer not null,
  set_type              public.set_type not null default 'working',
  prescribed_weight     numeric(7,2),
  prescribed_reps       integer,
  prescribed_percentage numeric(5,2),
  completed_weight      numeric(7,2),
  completed_reps        integer,
  completed_seconds     integer,
  is_complete           boolean not null default false,
  unique (workout_exercise_id, position)
);

create index if not exists workout_sets_we_idx on public.workout_sets (workout_exercise_id);

alter table public.workout_sets enable row level security;

drop policy if exists workout_sets_owner_all on public.workout_sets;
create policy workout_sets_owner_all on public.workout_sets for all
  using (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  );

-- ─── one_rep_max_records ──────────────────────────────────────────────────
create table if not exists public.one_rep_max_records (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  exercise_id   uuid not null references public.exercises(id) on delete restrict,
  weight        numeric(7,2) not null check (weight > 0),
  unit          public.weight_unit not null,
  performed_on  date not null default current_date,
  is_estimated  boolean not null default false,
  source_reps   integer,
  notes         text,
  created_at    timestamptz not null default now()
);

create index if not exists orm_user_exercise_idx
  on public.one_rep_max_records (user_id, exercise_id, performed_on desc);

alter table public.one_rep_max_records enable row level security;

drop policy if exists orm_owner_all on public.one_rep_max_records;
create policy orm_owner_all on public.one_rep_max_records for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
