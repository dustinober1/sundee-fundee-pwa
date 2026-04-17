// Domain enums shared across the app. The full Supabase `Database` type should
// be regenerated from the live project once it exists:
//
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/database.gen.ts
//
// Until then, queries return loosely-typed rows; we narrow at the DAL layer
// (see lib/supabase/dal.ts) using these row interfaces.

export type WeightUnit = "lb" | "kg";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type PrimaryGoal =
  | "strength"
  | "hypertrophy"
  | "endurance"
  | "general_fitness";

export interface UserProfileRow {
  id: string;
  display_name: string | null;
  given_name: string | null;
  family_name: string | null;
  weight_unit: WeightUnit;
  experience_level: ExperienceLevel | null;
  primary_goal: PrimaryGoal | null;
  cycle_tracking_enabled: boolean;
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
}
