// Placeholder Supabase types. Regenerate with the Supabase CLI once a project
// exists:
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
//
// Until then, expose a minimal shape so the typed client compiles.

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

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfileRow;
        Insert: Partial<UserProfileRow> & { id: string };
        Update: Partial<UserProfileRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
