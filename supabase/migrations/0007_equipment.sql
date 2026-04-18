-- Sundee Fundee — equipment tags on exercises, equipment profile on user_profiles.

-- ─── enums ────────────────────────────────────────────────────────────────
do $$ begin
  create type public.equipment_tag as enum (
    'barbell',
    'safety_bar',
    'trap_bar',
    'dumbbell_light',
    'dumbbell_heavy',
    'kettlebell',
    'squat_rack',
    'smith_machine',
    'bench_flat',
    'bench_adjustable',
    'cable_column',
    'lat_pulldown',
    'seated_row_machine',
    'chest_press_machine',
    'shoulder_press_machine',
    'leg_press',
    'hack_squat_machine',
    'leg_curl_machine',
    'leg_extension_machine',
    'pec_deck',
    'rear_delt_machine',
    'assisted_pullup_machine',
    'preacher_curl_bench',
    'calf_raise_machine',
    'abductor_adductor_machine',
    'pullup_bar',
    'dip_station',
    'plyo_box',
    'medicine_ball',
    'wall_ball_target',
    'ghd',
    'jump_rope',
    'treadmill',
    'rower',
    'bike_stationary',
    'bike_air',
    'stair_climber',
    'elliptical',
    'ski_erg'
  );
exception when duplicate_object then null; end $$;

-- ─── exercises.equipment ──────────────────────────────────────────────────
-- Minimum equipment required. Empty array = no equipment needed (bodyweight,
-- outdoor running). Filtering uses the subset operator: an exercise is shown
-- when its equipment array is a subset of the user's profile allow-list.
alter table public.exercises
  add column if not exists equipment public.equipment_tag[] not null default '{}';

create index if not exists exercises_equipment_gin_idx
  on public.exercises using gin (equipment);

-- ─── user_profiles.equipment_profile ─────────────────────────────────────
-- Preset name (resolved in code, see src/lib/domain/equipmentProfiles.ts).
-- null = "show all equipment" (no filtering applied).
alter table public.user_profiles
  add column if not exists equipment_profile text;
