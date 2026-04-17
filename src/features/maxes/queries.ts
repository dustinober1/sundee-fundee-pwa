import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { WeightUnit } from "@/lib/supabase/types";

export type OneRepMaxRow = {
  id: string;
  exercise_id: string;
  exercise_name: string;
  weight: number;
  unit: WeightUnit;
  performed_on: string;
  is_estimated: boolean;
  source_reps: number | null;
  notes: string | null;
};

type RawRow = {
  id: string;
  exercise_id: string;
  weight: string | number;
  unit: WeightUnit;
  performed_on: string;
  is_estimated: boolean;
  source_reps: number | null;
  notes: string | null;
  exercises: { name: string } | { name: string }[] | null;
};

function exerciseName(rel: RawRow["exercises"]): string {
  if (!rel) return "";
  return Array.isArray(rel) ? (rel[0]?.name ?? "") : rel.name;
}

export const listMaxes = cache(async (): Promise<OneRepMaxRow[]> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("one_rep_max_records")
    .select(
      "id, exercise_id, weight, unit, performed_on, is_estimated, source_reps, notes, exercises ( name )",
    )
    .order("performed_on", { ascending: false });

  const rows = (data as RawRow[] | null) ?? [];
  return rows.map((r) => ({
    id: r.id,
    exercise_id: r.exercise_id,
    exercise_name: exerciseName(r.exercises),
    weight: typeof r.weight === "string" ? parseFloat(r.weight) : r.weight,
    unit: r.unit,
    performed_on: r.performed_on,
    is_estimated: r.is_estimated,
    source_reps: r.source_reps,
    notes: r.notes,
  }));
});
