-- Sundee Fundee — backfill equipment tags for the 92 seeded exercises.
-- Run after supabase/seed/exercises.sql.
-- Idempotent — re-running overwrites tags with the same values.
-- Tag the MINIMUM equipment needed; empty array = no equipment required.

-- ─── Squat ────────────────────────────────────────────────────────────────
update public.exercises set equipment = '{barbell,squat_rack}'::public.equipment_tag[]
  where is_seeded and name = 'Back Squat';
update public.exercises set equipment = '{barbell,squat_rack}'::public.equipment_tag[]
  where is_seeded and name = 'Front Squat';
update public.exercises set equipment = '{safety_bar,squat_rack}'::public.equipment_tag[]
  where is_seeded and name = 'Safety Bar Squat';
update public.exercises set equipment = '{barbell,squat_rack,plyo_box}'::public.equipment_tag[]
  where is_seeded and name = 'Box Squat';
update public.exercises set equipment = '{barbell,squat_rack}'::public.equipment_tag[]
  where is_seeded and name = 'Pause Squat';
update public.exercises set equipment = '{dumbbell_light}'::public.equipment_tag[]
  where is_seeded and name = 'Goblet Squat';
update public.exercises set equipment = '{leg_press}'::public.equipment_tag[]
  where is_seeded and name = 'Leg Press';
update public.exercises set equipment = '{hack_squat_machine}'::public.equipment_tag[]
  where is_seeded and name = 'Hack Squat';
update public.exercises set equipment = '{leg_extension_machine}'::public.equipment_tag[]
  where is_seeded and name = 'Leg Extension';

-- ─── Hip Hinge ────────────────────────────────────────────────────────────
update public.exercises set equipment = '{barbell}'::public.equipment_tag[]
  where is_seeded and name in (
    'Conventional Deadlift (No Straps)',
    'Conventional Deadlift (With Straps)',
    'Romanian Deadlift (No Straps)',
    'Romanian Deadlift (With Straps)',
    'Sumo Deadlift (No Straps)',
    'Sumo Deadlift (With Straps)'
  );
update public.exercises set equipment = '{trap_bar}'::public.equipment_tag[]
  where is_seeded and name in (
    'Trap Bar Deadlift (No Straps)',
    'Trap Bar Deadlift (With Straps)'
  );
update public.exercises set equipment = '{barbell,squat_rack}'::public.equipment_tag[]
  where is_seeded and name = 'Good Morning';
update public.exercises set equipment = '{barbell,bench_flat}'::public.equipment_tag[]
  where is_seeded and name = 'Hip Thrust';
update public.exercises set equipment = '{leg_curl_machine}'::public.equipment_tag[]
  where is_seeded and name in ('Leg Curl (Lying)', 'Leg Curl (Seated)');
update public.exercises set equipment = '{ghd}'::public.equipment_tag[]
  where is_seeded and name = 'Glute Ham Raise';

-- ─── Press ────────────────────────────────────────────────────────────────
update public.exercises set equipment = '{barbell,bench_flat}'::public.equipment_tag[]
  where is_seeded and name in (
    'Flat Barbell Bench Press',
    'Decline Barbell Bench Press',
    'Close Grip Bench Press'
  );
update public.exercises set equipment = '{barbell,bench_adjustable}'::public.equipment_tag[]
  where is_seeded and name = 'Incline Barbell Bench Press';
update public.exercises set equipment = '{barbell,squat_rack}'::public.equipment_tag[]
  where is_seeded and name in ('Strict Press', 'Push Press');
update public.exercises set equipment = '{dumbbell_light,bench_flat}'::public.equipment_tag[]
  where is_seeded and name = 'Dumbbell Bench Press';
update public.exercises set equipment = '{dumbbell_light,bench_adjustable}'::public.equipment_tag[]
  where is_seeded and name = 'Dumbbell Incline Press';
update public.exercises set equipment = '{dumbbell_light}'::public.equipment_tag[]
  where is_seeded and name = 'Dumbbell Overhead Press';
update public.exercises set equipment = '{dip_station}'::public.equipment_tag[]
  where is_seeded and name = 'Dips (Weighted)';

-- ─── Pull ─────────────────────────────────────────────────────────────────
update public.exercises set equipment = '{barbell}'::public.equipment_tag[]
  where is_seeded and name in ('Barbell Row', 'Pendlay Row', 'Bicep Curl (Barbell)', 'Upright Row');
update public.exercises set equipment = '{pullup_bar}'::public.equipment_tag[]
  where is_seeded and name in ('Pull-Up', 'Weighted Pull-Up');
update public.exercises set equipment = '{lat_pulldown}'::public.equipment_tag[]
  where is_seeded and name = 'Lat Pulldown';
update public.exercises set equipment = '{seated_row_machine}'::public.equipment_tag[]
  where is_seeded and name = 'Cable Row';
update public.exercises set equipment = '{dumbbell_light,bench_flat}'::public.equipment_tag[]
  where is_seeded and name = 'Dumbbell Row';
update public.exercises set equipment = '{cable_column}'::public.equipment_tag[]
  where is_seeded and name = 'Face Pull';
update public.exercises set equipment = '{dumbbell_light}'::public.equipment_tag[]
  where is_seeded and name in ('Bicep Curl (Dumbbell)', 'Hammer Curl');

-- ─── Carry ────────────────────────────────────────────────────────────────
update public.exercises set equipment = '{dumbbell_light}'::public.equipment_tag[]
  where is_seeded and name in ('Farmers Carry', 'Suitcase Carry');
update public.exercises set equipment = '{barbell}'::public.equipment_tag[]
  where is_seeded and name in ('Zercher Carry', 'Yoke Walk');

-- ─── Olympic Weightlifting (all barbell) ──────────────────────────────────
update public.exercises set equipment = '{barbell}'::public.equipment_tag[]
  where is_seeded and name in (
    'Squat Snatch',
    'Squat Clean',
    'Power Clean',
    'Power Snatch',
    'Hang Clean',
    'Hang Snatch',
    'Split Jerk',
    'Push Jerk',
    'Clean and Jerk',
    'Muscle Snatch',
    'Muscle Clean'
  );

-- ─── Conditioning (reps) ──────────────────────────────────────────────────
update public.exercises set equipment = '{wall_ball_target,medicine_ball}'::public.equipment_tag[]
  where is_seeded and name = 'Wall Ball';
update public.exercises set equipment = '{plyo_box}'::public.equipment_tag[]
  where is_seeded and name in ('Box Jump', 'Box Step-up');
update public.exercises set equipment = '{}'::public.equipment_tag[]
  where is_seeded and name in (
    'Burpee',
    'Push-Up',
    'Sit-Up',
    'Air Squat',
    'Lunges (Alternating)',
    'Wall Walk',
    'Handstand Push-up',
    'V-up'
  );
update public.exercises set equipment = '{kettlebell}'::public.equipment_tag[]
  where is_seeded and name = 'Kettlebell Swing';
update public.exercises set equipment = '{jump_rope}'::public.equipment_tag[]
  where is_seeded and name = 'Double Under';
update public.exercises set equipment = '{pullup_bar}'::public.equipment_tag[]
  where is_seeded and name in ('Pull-Up (Kipping)', 'Toes-to-Bar', 'Muscle-Up');
update public.exercises set equipment = '{barbell,squat_rack}'::public.equipment_tag[]
  where is_seeded and name = 'Thruster';
update public.exercises set equipment = '{rower}'::public.equipment_tag[]
  where is_seeded and name = 'Rowing (Calories)';
update public.exercises set equipment = '{bike_air}'::public.equipment_tag[]
  where is_seeded and name = 'Assault Bike (Calories)';
update public.exercises set equipment = '{ski_erg}'::public.equipment_tag[]
  where is_seeded and name = 'SkiErg (Calories)';
update public.exercises set equipment = '{ghd}'::public.equipment_tag[]
  where is_seeded and name = 'GHD Sit-up';

-- ─── Conditioning (time) ──────────────────────────────────────────────────
-- Runs work outdoors (no equipment) or indoors on a treadmill — tag as
-- no-equipment so they show for every profile.
update public.exercises set equipment = '{}'::public.equipment_tag[]
  where is_seeded and name in ('400m Run', '800m Run', '1-Mile Run', '5K Run');
update public.exercises set equipment = '{rower}'::public.equipment_tag[]
  where is_seeded and name in ('500m Row', '2K Row');
update public.exercises set equipment = '{bike_air}'::public.equipment_tag[]
  where is_seeded and name = '1K Assault Bike';
update public.exercises set equipment = '{ski_erg}'::public.equipment_tag[]
  where is_seeded and name = '2K SkiErg';
update public.exercises set equipment = '{}'::public.equipment_tag[]
  where is_seeded and name in ('Plank Hold', 'L-Sit Hold');
