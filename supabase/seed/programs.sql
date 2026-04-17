-- Sundee Fundee — program template metadata seed.
-- Source: SundeeFundee/Sources/SundeeFundeeKit/DomainLayer/Program/ProgramTemplateGenerator.swift
--
-- The full phases/weeks JSON for "First Margarita" lives in the iOS source
-- (FirstMargaritaProgram.swift, 266 lines). This seed installs the catalog
-- entries; phases/weeks JSON is added in a follow-up seed once the JSON is
-- generated from the Swift source.

insert into public.program_templates
  (id, name, category, description, difficulty, duration_weeks, sessions_per_week, sort_order, phases, weeks)
values
  ('first-margarita', 'The First Margarita', 'strength',
   'Sundee Fundee''s flagship 8-week strength program: accumulation, intensification, and a deload/testing week.',
   'advanced', 8, 3, 0, '[]'::jsonb, '[]'::jsonb),
  ('strength-4wk', 'Strength Block (4 weeks)', 'strength',
   '4-week linear strength block focused on the main lifts. Good for an in-between cycle.',
   'intermediate', 4, 3, 1, '[]'::jsonb, '[]'::jsonb),
  ('hypertrophy-6wk', 'Hypertrophy (6 weeks)', 'hypertrophy',
   '6-week hypertrophy program emphasizing volume and time-under-tension across 4 sessions per week.',
   'intermediate', 6, 4, 2, '[]'::jsonb, '[]'::jsonb),
  ('full-body-4wk', 'Full Body (4 weeks)', 'general',
   '4-week full-body program for general strength and conditioning. Good for beginners.',
   'beginner', 4, 3, 3, '[]'::jsonb, '[]'::jsonb),
  ('linear-6wk', 'Linear Progression (6 weeks)', 'strength',
   '6-week linear progression cycle. Add weight every session until you stall.',
   'beginner', 6, 3, 4, '[]'::jsonb, '[]'::jsonb),
  ('dup-4wk', 'Daily Undulating Periodization (4 weeks)', 'strength',
   '4-week DUP cycle: vary intensity and volume from session to session within the same week.',
   'intermediate', 4, 3, 5, '[]'::jsonb, '[]'::jsonb),
  ('block-9wk', 'Block Periodization (9 weeks)', 'strength',
   '9-week block periodization: hypertrophy → strength → peaking phases.',
   'advanced', 9, 3, 6, '[]'::jsonb, '[]'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  difficulty = excluded.difficulty,
  duration_weeks = excluded.duration_weeks,
  sessions_per_week = excluded.sessions_per_week,
  sort_order = excluded.sort_order;
