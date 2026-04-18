-- Sundee Fundee — seed: Starting Strength 4-week beginner strength program template.
-- Idempotent: ON CONFLICT (id) DO NOTHING.

INSERT INTO public.program_templates (
  id,
  name,
  category,
  description,
  difficulty,
  duration_weeks,
  sessions_per_week,
  phases,
  weeks,
  is_predefined,
  sort_order
)
VALUES (
  'starting-strength-4wk',
  'Starting Strength — 4-Week Beginner',
  'Strength',
  'Classic 3-day A/B beginner program built around the squat, press, and deadlift. Add weight every session.',
  'Beginner',
  4,
  3,
  '[
    {"name": "Foundation", "start_week": 1, "end_week": 4}
  ]'::jsonb,
  '[
    {
      "week_num": 1,
      "sessions": [
        {
          "label": "Session A",
          "exercises": [
            {"exercise_id": "71bb4d90-5665-482e-bbee-1f147c20ac98", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "b12a46f6-e35b-4790-85bf-232af30f5b07", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "c5b4b22b-f521-46da-9f65-4ea578fa7e9b", "sets": 3, "reps": 5, "pct_1rm": 0.85}
          ]
        },
        {
          "label": "Session B",
          "exercises": [
            {"exercise_id": "71bb4d90-5665-482e-bbee-1f147c20ac98", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "d9645ce1-1bfd-4261-95ca-4f64eba0ad95", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "f8e48456-0799-44eb-b7ac-da7e49bc941d", "sets": 1, "reps": 5, "pct_1rm": 0.85}
          ]
        }
      ]
    },
    {
      "week_num": 2,
      "sessions": [
        {
          "label": "Session A",
          "exercises": [
            {"exercise_id": "71bb4d90-5665-482e-bbee-1f147c20ac98", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "b12a46f6-e35b-4790-85bf-232af30f5b07", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "c5b4b22b-f521-46da-9f65-4ea578fa7e9b", "sets": 3, "reps": 5, "pct_1rm": 0.85}
          ]
        },
        {
          "label": "Session B",
          "exercises": [
            {"exercise_id": "71bb4d90-5665-482e-bbee-1f147c20ac98", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "d9645ce1-1bfd-4261-95ca-4f64eba0ad95", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "f8e48456-0799-44eb-b7ac-da7e49bc941d", "sets": 1, "reps": 5, "pct_1rm": 0.85}
          ]
        }
      ]
    },
    {
      "week_num": 3,
      "sessions": [
        {
          "label": "Session A",
          "exercises": [
            {"exercise_id": "71bb4d90-5665-482e-bbee-1f147c20ac98", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "b12a46f6-e35b-4790-85bf-232af30f5b07", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "c5b4b22b-f521-46da-9f65-4ea578fa7e9b", "sets": 3, "reps": 5, "pct_1rm": 0.85}
          ]
        },
        {
          "label": "Session B",
          "exercises": [
            {"exercise_id": "71bb4d90-5665-482e-bbee-1f147c20ac98", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "d9645ce1-1bfd-4261-95ca-4f64eba0ad95", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "f8e48456-0799-44eb-b7ac-da7e49bc941d", "sets": 1, "reps": 5, "pct_1rm": 0.85}
          ]
        }
      ]
    },
    {
      "week_num": 4,
      "sessions": [
        {
          "label": "Session A",
          "exercises": [
            {"exercise_id": "71bb4d90-5665-482e-bbee-1f147c20ac98", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "b12a46f6-e35b-4790-85bf-232af30f5b07", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "c5b4b22b-f521-46da-9f65-4ea578fa7e9b", "sets": 3, "reps": 5, "pct_1rm": 0.85}
          ]
        },
        {
          "label": "Session B",
          "exercises": [
            {"exercise_id": "71bb4d90-5665-482e-bbee-1f147c20ac98", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "d9645ce1-1bfd-4261-95ca-4f64eba0ad95", "sets": 3, "reps": 5, "pct_1rm": 0.85},
            {"exercise_id": "f8e48456-0799-44eb-b7ac-da7e49bc941d", "sets": 1, "reps": 5, "pct_1rm": 0.85}
          ]
        }
      ]
    }
  ]'::jsonb,
  true,
  10
)
ON CONFLICT (id) DO NOTHING;
