import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getEquipmentProfile,
  isExerciseAllowed,
  type EquipmentProfileKey,
} from "@/lib/domain/equipmentProfiles";

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
  equipment: string[];
};

export const listExercises = cache(async (): Promise<ExerciseRow[]> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("exercises")
    .select(
      "id, name, kind, weightlifting_category, conditioning_scoring, is_seeded, equipment",
    )
    .order("name", { ascending: true });
  return (data as ExerciseRow[] | null) ?? [];
});

export const listWeightliftingExercises = cache(async () => {
  const all = await listExercises();
  return all.filter((e) => e.kind === "weightlifting");
});

export async function listExercisesByIds(
  ids: string[],
): Promise<{ id: string; name: string }[]> {
  if (ids.length === 0) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("exercises")
    .select("id, name")
    .in("id", ids);
  return (data as { id: string; name: string }[] | null) ?? [];
}

// Filters the exercise catalog by the user's equipment profile preset.
// Pass a null/unknown key to get everything (no filter).
export async function listExercisesForProfile(
  profileKey: EquipmentProfileKey | string | null,
): Promise<ExerciseRow[]> {
  const all = await listExercises();
  const profile = getEquipmentProfile(profileKey);
  if (!profile) return all;
  return all.filter((e) => isExerciseAllowed(e.equipment, profile));
}
