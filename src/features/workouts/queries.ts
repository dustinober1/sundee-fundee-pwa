import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type WorkoutListRow = {
  id: string;
  performed_on: string;
  name: string | null;
  duration_min: number | null;
  completed_at: string | null;
  exercise_count: number;
};

export type WorkoutSet = {
  id: string;
  position: number;
  set_type: string;
  prescribed_weight: number | null;
  prescribed_reps: number | null;
  completed_weight: number | null;
  completed_reps: number | null;
  completed_seconds: number | null;
  is_complete: boolean;
};

export type WorkoutExercise = {
  id: string;
  position: number;
  exercise_id: string;
  exercise_name: string;
  notes: string | null;
  rest_seconds: number | null;
  sets: WorkoutSet[];
};

export type WorkoutDetail = {
  id: string;
  performed_on: string;
  name: string | null;
  notes: string | null;
  duration_min: number | null;
  completed_at: string | null;
  exercises: WorkoutExercise[];
};

export const listWorkouts = cache(async (): Promise<WorkoutListRow[]> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("workouts")
    .select(
      "id, performed_on, name, duration_min, completed_at, workout_exercises(count)",
    )
    .order("performed_on", { ascending: false })
    .limit(100);

  type Raw = Omit<WorkoutListRow, "exercise_count"> & {
    workout_exercises: { count: number }[] | null;
  };

  return ((data as Raw[] | null) ?? []).map((r) => ({
    id: r.id,
    performed_on: r.performed_on,
    name: r.name,
    duration_min: r.duration_min,
    completed_at: r.completed_at,
    exercise_count: r.workout_exercises?.[0]?.count ?? 0,
  }));
});

export async function getWorkout(id: string): Promise<WorkoutDetail | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("workouts")
    .select(
      `id, performed_on, name, notes, duration_min, completed_at,
       workout_exercises (
         id, position, exercise_id, notes, rest_seconds,
         exercises ( name ),
         workout_sets (
           id, position, set_type, prescribed_weight, prescribed_reps,
           completed_weight, completed_reps, completed_seconds, is_complete
         )
       )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;

  type RawSet = WorkoutSet;
  type RawWE = {
    id: string;
    position: number;
    exercise_id: string;
    notes: string | null;
    rest_seconds: number | null;
    exercises: { name: string } | { name: string }[] | null;
    workout_sets: RawSet[] | null;
  };
  type Raw = Omit<WorkoutDetail, "exercises"> & { workout_exercises: RawWE[] | null };

  const raw = data as Raw;
  const exercises = (raw.workout_exercises ?? [])
    .sort((a, b) => a.position - b.position)
    .map((we) => ({
      id: we.id,
      position: we.position,
      exercise_id: we.exercise_id,
      exercise_name: Array.isArray(we.exercises)
        ? (we.exercises[0]?.name ?? "")
        : (we.exercises?.name ?? ""),
      notes: we.notes,
      rest_seconds: we.rest_seconds,
      sets: (we.workout_sets ?? []).sort((a, b) => a.position - b.position),
    }));

  return {
    id: raw.id,
    performed_on: raw.performed_on,
    name: raw.name,
    notes: raw.notes,
    duration_min: raw.duration_min,
    completed_at: raw.completed_at,
    exercises,
  };
}
