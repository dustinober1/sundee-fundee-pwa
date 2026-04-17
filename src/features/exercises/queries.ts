import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ExerciseRow = {
  id: string;
  name: string;
  kind: "weightlifting" | "conditioning";
  weightlifting_category:
    | "squat"
    | "hip_hinge"
    | "press"
    | "pull"
    | "carry"
    | "olympic_weightlifting"
    | null;
  conditioning_scoring: "time" | "reps" | null;
  is_seeded: boolean;
};

export const listExercises = cache(async (): Promise<ExerciseRow[]> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("exercises")
    .select(
      "id, name, kind, weightlifting_category, conditioning_scoring, is_seeded",
    )
    .order("name", { ascending: true });
  return (data as ExerciseRow[] | null) ?? [];
});

export const listWeightliftingExercises = cache(async () => {
  const all = await listExercises();
  return all.filter((e) => e.kind === "weightlifting");
});
