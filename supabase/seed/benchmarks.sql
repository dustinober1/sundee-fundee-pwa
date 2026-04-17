-- Sundee Fundee — benchmark definition seed.
-- Source: SundeeFundee/Sources/SundeeFundeeKit/DomainLayer/Benchmark/BenchmarkCatalog.swift
-- Idempotent (upsert).

insert into public.benchmark_definitions
  (id, name, category, workout_description, scoring_type, intensity, sort_order,
   movement_tags, equipment, time_domain, coach_notes)
values
  -- Sundee Fundee Exclusives
  ('sundee-vanessa', 'Vanessa', 'sundee_fundee',
   'Buy-in: 5 Triple Unders. 5 rounds for time: 5 Heavy Cleans (205/155 lb), 25 Double-Unders, 25 Toes-to-Bar. Cash-out: 5 Triple Unders.',
   'time', 5, 0, ARRAY['Heavy Pull','High Skill','Gymnastics'],
   ARRAY['barbell','jump rope','pull-up bar'], '15-25 min',
   'Scale cleans to 185/135 lb if heavy cleans aren''t in your wheelhouse. Triple unders are the buy-in/cash-out — if you can''t do them, sub 15 double-unders each. Focus on smooth transitions between cleans and the jump rope. Break toes-to-bar early (7-8s) to save grip for the cleans.'),

  ('sundee-eliz', 'Eliz', 'sundee_fundee',
   '5 rounds for time (25 min cap): 500m Row, 30 Crossovers (each side = 1), 100ft Farmers Carry (70/50 lb), 5 Overhead Squats (115/85 lb)',
   'time', 4, 1, ARRAY['Cardio','Core','Overhead Stability'],
   ARRAY['rower','dumbbells','barbell'], '20-25 min',
   'Pace the row at 85% — don''t sprint it. Crossovers are sneaky grip-intensive; stay smooth. Farmers carry is active recovery, use it to breathe. OHS should be unbroken for 2-3 rounds; if you''re breaking, consider scaling weight. Core fatigue is real by round 4.'),

  ('sundee-adria', 'Adria', 'sundee_fundee',
   'For time (15 min cap): 3 rounds of 10 Sandbag Cleans (100/75 lb), 15 Sandbag Squats (100/75 lb). Then max distance Farmers Carry (70/50 lb).',
   'time', 4, 2, ARRAY['Sandbag','Grip','Posterior Chain'],
   ARRAY['sandbag','dumbbells'], '10-15 min',
   'Sandbag cleans are squat cleans — catch in the bottom and stand. Keep your chest up on squats; the bag will try to pull you forward. The farmers carry is for max distance, so don''t rush the drop. Go until the grip fails, not until it gets uncomfortable.'),

  ('sundee-kelsey', 'Kelsey', 'sundee_fundee',
   '3 rounds for time (20 min cap): 50 Double-Unders, 10 Handstand Push-ups, 15 Hang Power Cleans (135/95 lb), 10 Chest-to-Bar Pull-ups',
   'time', 5, 3, ARRAY['High Volume','Push/Pull','Cardio'],
   ARRAY['jump rope','wall','barbell','pull-up bar'], '15-20 min',
   '50 DUs is a lot — if you''re not efficient, consider scaling to 35. HSPU should be unbroken round 1, then small sets. Hang power cleans at 135/95 get heavy fast; consider quick singles from round 2 onward. C2B pull-ups: break early if your cleans are slow.'),

  ('sundee-margarita', 'Margarita', 'sundee_fundee',
   '20-min benchmark: Part 1 AMRAP 5 min (10 Burpees, 15 KB Swings), Part 2 1RM Squat Clean, Part 3 AMRAP 5 min (10 Burpees, 15 Russian KB Swings), Part 4 1RM Snatch',
   'time', 5, 4, ARRAY['Hybrid','Max Effort','Cardio'],
   ARRAY['kettlebell','barbell','plates'], '20 min fixed',
   'This is a unique hybrid benchmark — cardio AND max strength. Part 1: push the pace but leave 1-2 reps in the tank for the clean. Part 2: You have 5 min to find a 1RM squat clean — take 2-3 attempts max. Part 3: Russian swings are easier than American, so move fast. Part 4: Snatch under fatigue is dangerous — only attempt weights you''re confident in. Score each part separately.'),

  -- Classic WODs
  ('classic-fran', 'Fran', 'classic_wods',
   '21-15-9 reps for time: Thrusters (95/65 lb), Pull-ups',
   'time', 5, 5, ARRAY['Sprint','Push/Pull'],
   ARRAY['barbell','pull-up bar'], '2-8 min',
   'The original sprint benchmark. Go unbroken if possible. If you break the thrusters, you''ve gone too heavy. Pull-ups should be fast — kip hard. This should hurt from minute 1.'),

  ('classic-helen', 'Helen', 'classic_wods',
   '3 rounds for time: 400m Run, 21 KB Swings (53/35 lb), 12 Pull-ups',
   'time', 4, 6, ARRAY['Cardio','Posterior Chain'],
   ARRAY['kettlebell','pull-up bar','running space'], '8-14 min',
   'Pace the run at 80% — you need energy for the swings and pull-ups. KB swings should be unbroken all rounds. Break pull-ups 6-6 or 5-4-3 if needed.'),

  ('classic-grace', 'Grace', 'classic_wods',
   'For time: 30 Clean & Jerks (135/95 lb)',
   'time', 4, 7, ARRAY['Heavy Push','Barbell Cycling'],
   ARRAY['barbell'], '2-8 min',
   'Sprint pace. If you can go unbroken, do it. Otherwise, quick singles with no rest between reps. Power clean + push jerk is the standard. Full squat clean + split jerk is fine if that''s your preference.'),

  ('classic-karen', 'Karen', 'classic_wods',
   'For time: 150 Wall Ball Shots (20/14 lb to 10/9 ft target)',
   'time', 3, 8, ARRAY['High Volume','Squat','Cardio'],
   ARRAY['wall ball'], '8-15 min',
   'Pacing is key. Start with sets of 25-30 and hold on. If you break, rest no more than 5-10 seconds. Keep the ball moving — catching and throwing should be one fluid motion.'),

  ('classic-dt', 'DT', 'classic_wods',
   '5 rounds for time: 12 Deadlifts, 9 Hang Power Cleans, 6 Push Jerks (155/105 lb)',
   'time', 5, 9, ARRAY['Heavy Pull','Barbell Complex'],
   ARRAY['barbell'], '8-15 min',
   'Touch-and-go on deadlifts is huge. Hang cleans should be quick — if you''re struggling, drop to singles. Push jerks: keep the bar moving. This is a grip and shoulder endurance test.'),

  ('classic-murph', 'Murph', 'classic_wods',
   'For time: 1-Mile Run, 100 Pull-ups, 200 Push-ups, 300 Air Squats, 1-Mile Run. Partition as needed. With 20/14 lb vest.',
   'time', 5, 10, ARRAY['Endurance','High Volume','Hero WOD'],
   ARRAY['pull-up bar','vest (optional)'], '35-60+ min',
   'Partition as 20 rounds of 5-10-15 (Cindy style) for better pacing. Without vest is still a legit attempt. The first run sets the tone — don''t sprint it. Break push-ups early and often.'),

  ('classic-annie', 'Annie', 'classic_wods',
   '50-40-30-20-10 reps for time: Double-Unders, Sit-ups',
   'time', 3, 11, ARRAY['Skill','Core'],
   ARRAY['jump rope'], '6-12 min',
   'If double-unders are inconsistent, this becomes a 15+ minute workout. Sub triple-unders for a challenge or tuck jumps if you don''t have a rope. Sit-ups should be fast — anchor your feet if you can.'),

  ('classic-cindy', 'Cindy', 'classic_wods',
   'AMRAP 20 min: 5 Pull-ups, 10 Push-ups, 15 Air Squats. Score = total rounds + partial reps.',
   'rounds_and_reps', 3, 12, ARRAY['Bodyweight','Gymnastics','Volume'],
   ARRAY['pull-up bar'], '20 min fixed',
   'The gold standard for tracking bodyweight fitness gains. Aim for consistent rounds throughout. Break pull-ups early (3+2) to save grip. Push-ups should be unbroken the first 10 rounds. Rest 10-15s between movements, not between rounds. 20+ rounds is elite.'),

  ('classic-fight-gone-bad', 'Fight Gone Bad', 'classic_wods',
   '3 rounds, 1 min each station: Wall Ball (20/14 lb), SDHP (75/55 lb), Box Jump (20"), Push Press (75/55 lb), Row (calories). 1 min rest between rounds. Score = total reps.',
   'reps', 4, 13, ARRAY['Volume','Cardio','Conditioning'],
   ARRAY['wall ball','barbell','box','rower'], '17 min structured',
   'Sprint mentality at every station. Wall ball and row for calories are your biggest point sources. SDHP: move fast, light weight. Box jumps: step down if needed. Push press: keep cycling. Goal is 300+ reps total. Don''t rest during the 1-min work windows.'),

  -- Strength
  ('strength-back-squat-1rm', '1RM Back Squat', 'strength',
   'Find your 1-rep max back squat.',
   'load', 5, 14, ARRAY['Maximal Strength','Lower Body'],
   ARRAY['barbell','squat rack','plates'], '20-30 min',
   'Warm-up: 5@40%, 3@60%, 1@75%, 1@85%, 1@90%, then attempt. Rest 3-5 min between heavy singles. Belt and knee sleeves are standard. Hit depth — crease of hip below top of knee. If you miss, end the session.'),

  ('strength-conventional-deadlift-1rm', '1RM Conventional Deadlift (No Straps)', 'strength',
   'Find your 1-rep max conventional deadlift without straps.',
   'load', 5, 15, ARRAY['Maximal Strength','Posterior Chain','Grip'],
   ARRAY['barbell','plates'], '20-30 min',
   'No straps — this tests grip too. Belt is fine. Hook grip recommended. Warm-up: 5@40%, 3@60%, 1@75%, 1@85%, 1@90%, then attempt. Bar drags up your shins. Lock out fully at the top. No hitching.'),

  ('strength-bench-press-1rm', '1RM Bench Press', 'strength',
   'Find your 1-rep max flat barbell bench press.',
   'load', 5, 16, ARRAY['Maximal Strength','Upper Body Push'],
   ARRAY['barbell','flat bench','plates','spotter'], '20-30 min',
   'Always use a spotter. Arch and leg drive are legal and recommended. Touch the chest, pause briefly, drive up. Grip just outside shoulder width. Wrist wraps help for heavy singles. Warm-up to 85-90% before your max attempt.'),

  ('strength-overhead-press-1rm', '1RM Overhead Press', 'strength',
   'Find your 1-rep max strict barbell overhead press.',
   'load', 4, 17, ARRAY['Maximal Strength','Upper Body Push','Strict'],
   ARRAY['barbell','plates'], '15-25 min',
   'Strict press — no leg drive. Squeeze glutes and brace hard. Bar path: close to face on the way up, slight lean back in the torso. Lower numbers here are normal. Don''t let it turn into a push press on heavy attempts.'),

  ('strength-clean-and-jerk-1rm', '1RM Clean and Jerk', 'strength',
   'Find your 1-rep max clean and jerk.',
   'load', 5, 18, ARRAY['Olympic Lifting','Full Body Power'],
   ARRAY['barbell','plates','lifting shoes (optional)'], '30-45 min',
   '3-5 min rest between attempts. Warm up the full lift from 50%+. At max weight, commit to the jerk — a missed jerk under a heavy clean is the most dangerous scenario. Split jerk is standard. Lifting shoes and belt make a real difference.'),

  ('strength-snatch-1rm', '1RM Snatch', 'strength',
   'Find your 1-rep max snatch.',
   'load', 5, 19, ARRAY['Olympic Lifting','Full Body Power','High Skill'],
   ARRAY['barbell','plates','lifting shoes (optional)'], '30-45 min',
   'The most technically demanding benchmark. Spend adequate time on warm-up technique before going heavy. Progress: high hang → hang → full. At 90%+, misses are expected — that''s fine. Wrist mobility and shoulder flexibility are common limiters. Never rush a heavy attempt.'),

  -- Endurance
  ('endurance-1-mile-run', '1-Mile Run', 'endurance',
   'Run 1 mile (1.6 km) as fast as possible.',
   'time', 3, 20, ARRAY['Cardio','Running','Aerobic Capacity'],
   ARRAY['running shoes','track or road'], '4-10 min',
   'This is a sprint, not a jog. Go out at 90% effort and hold on. Best results come from even pacing across 4 laps. Track is ideal for accuracy. Sub-6 min is elite for strength athletes. Even splits matter more than a fast first lap.'),

  ('endurance-5k-run', '5K Run', 'endurance',
   'Run 5 kilometers (3.1 miles) as fast as possible.',
   'time', 3, 21, ARRAY['Cardio','Endurance','Running'],
   ARRAY['running shoes','track or road'], '18-35 min',
   'Pacing is everything. Don''t start too fast — the first kilometer should feel easy. Mile 2 is where most athletes blow up. Stay controlled through the middle, then kick on the final 400m. Sub-20 min is competitive. Monitor heart rate if possible; aim for Zone 4.'),

  ('endurance-1.5-mile-run', '1.5-Mile Run', 'endurance',
   'Run 1.5 miles (2.4 km) as fast as possible. Used to estimate VO2 Max (Cooper Test).',
   'time', 3, 22, ARRAY['Cardio','VO2 Max','Endurance'],
   ARRAY['running shoes','track'], '8-15 min',
   'The Cooper Test distance used to estimate VO2 max. 6 laps around a standard track. Start at a sustainable pace and commit to it. Sub-9 min is elite for general athletes. Use your time to estimate VO2 max: 483 ÷ (minutes + 3.5).'),

  ('endurance-2k-row', '2K Row', 'endurance',
   'Row 2000 meters on an ergometer as fast as possible.',
   'time', 4, 23, ARRAY['Cardio','Rowing','Full Body'],
   ARRAY['Concept2 rower'], '6-10 min',
   'The gold standard rowing benchmark. Split the 2K into 4 x 500m mentally. Target a pace you can hold from the start — don''t sprint the first 500. The "red zone" is 1000-1500m, where races are won or lost. Sprint the final 250m. Sub-7:30 is elite for athletes.'),

  -- Gymnastics
  ('gymnastics-max-pull-ups', 'Max Pull-ups', 'gymnastics',
   'Maximum strict pull-ups in one unbroken set.',
   'reps', 3, 24, ARRAY['Gymnastics','Upper Body Pull','Strict'],
   ARRAY['pull-up bar'], '1-5 min',
   'Strict only — dead hang start, chin clears bar, no kipping. Grip just outside shoulders. Focus on pulling elbows down, not just pulling up. 20+ is strong; 30+ is elite. Rest at least 48 hours between max attempts.'),

  ('gymnastics-max-push-ups-2-min', 'Max Push-ups (2 min)', 'gymnastics',
   'Maximum push-ups completed in 2 minutes.',
   'reps', 2, 25, ARRAY['Gymnastics','Upper Body Push','Volume'],
   ARRAY[]::text[], '2 min fixed',
   'Full range of motion required: chest to floor, elbows locked out at top. No resting in the up position. Pace the first 90 seconds at 60% effort, then empty the tank. 75+ in 2 min is excellent. Score drops fast if you rest mid-set.'),

  ('gymnastics-max-handstand-push-ups', 'Max Handstand Push-ups', 'gymnastics',
   'Maximum strict handstand push-ups in one unbroken set.',
   'reps', 4, 26, ARRAY['Gymnastics','Overhead Strength','Strict'],
   ARRAY['wall'], '1-5 min',
   'Strict only — full lockout at top, head touches floor at bottom. Kick up to wall and engage your core hard. Narrower hand width increases difficulty. 10+ is strong; 20+ is elite. Wrist mobility is the most common limiter — warm it up carefully.'),

  ('gymnastics-max-muscle-ups', 'Max Muscle-ups', 'gymnastics',
   'Maximum ring or bar muscle-ups in one unbroken set.',
   'reps', 5, 27, ARRAY['Gymnastics','Push/Pull','High Skill'],
   ARRAY['rings or pull-up bar'], '1-5 min',
   'Most demanding unbroken gymnastics benchmark. Ring muscle-ups are harder than bar. An aggressive kip is critical — the transition is where most athletes fail. False grip on rings makes the turnover easier. 5+ is strong; 10+ is elite. Rest 3-5 min before attempting.'),

  -- General Fitness
  ('fitness-100-push-ups-for-time', '100 Push-ups for Time', 'general_fitness',
   'Complete 100 push-ups as fast as possible. Rest as needed.',
   'time', 2, 28, ARRAY['Bodyweight','Upper Body Push','Volume'],
   ARRAY[]::text[], '3-15 min',
   'Break early and often. Sets of 20-10-10-10-10-10-10-10-10-10 beats going unbroken and failing. Rest no more than 10-15s between sets. Chest must touch floor and elbows lock out. Sub-5 min is excellent.'),

  ('fitness-100-sit-ups-for-time', '100 Sit-ups for Time', 'general_fitness',
   'Complete 100 sit-ups as fast as possible. Rest as needed.',
   'time', 1, 29, ARRAY['Bodyweight','Core','Volume'],
   ARRAY['AbMat (optional)'], '3-12 min',
   'Use an AbMat for full range of motion. Anchor your feet. Go as fast as possible — sit-ups don''t have a strength ceiling, just a conditioning one. Large sets of 25-30 work well. Sub-4 min is strong.'),

  ('fitness-l-sit-hold', 'L-Sit Hold', 'general_fitness',
   'Hold an L-sit (legs straight, parallel to ground) as long as possible. Supported on floor, parallettes, or rings.',
   'time', 3, 30, ARRAY['Gymnastics','Core','Isometric'],
   ARRAY['parallettes, floor, or rings'], '5 sec - 60+ sec',
   'Legs fully straight and parallel to ground. Parallettes are easiest; floor is hardest. Compress your hips and squeeze quads hard. 10s is a solid baseline; 30s is excellent; 60s is elite. Score as a single best hold or total accumulated time.')
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  workout_description = excluded.workout_description,
  scoring_type = excluded.scoring_type,
  intensity = excluded.intensity,
  sort_order = excluded.sort_order,
  movement_tags = excluded.movement_tags,
  equipment = excluded.equipment,
  time_domain = excluded.time_domain,
  coach_notes = excluded.coach_notes;
