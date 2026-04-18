import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { setVolumeLbs } from "@/lib/domain/challenges";
import {
  detectPrs,
  type PriorChallenge,
  type SummaryWorkout,
  type WorkoutPrs,
} from "@/lib/domain/prDetection";
import type { ChallengeStatus, ChallengeTier } from "@/lib/domain/challenges";

export type WorkoutSummaryData = {
  workout: SummaryWorkout;
  prs: WorkoutPrs;
};

function normalizeTiers(raw: unknown): ChallengeTier[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((t, i) => {
    const tier = t as Partial<ChallengeTier>;
    return {
      name: typeof tier.name === "string" ? tier.name : `Tier ${i + 1}`,
      target_volume_lbs: Number(tier.target_volume_lbs ?? 0),
      ordinal: Number(tier.ordinal ?? i),
    };
  });
}

export const getWorkoutSummaryData = cache(
  async (workoutId: string): Promise<WorkoutSummaryData | null> => {
    const supabase = await createSupabaseServerClient();

    const { data: workoutRow } = await supabase
      .from("workouts")
      .select(
        `id, performed_on, user_id,
         workout_exercises (
           id, position, exercise_id,
           exercises ( name ),
           workout_sets (
             id, position, prescribed_weight, prescribed_reps,
             completed_weight, completed_reps, is_complete
           )
         )`,
      )
      .eq("id", workoutId)
      .maybeSingle();

    if (!workoutRow) return null;

    type RawSet = {
      id: string;
      position: number;
      prescribed_weight: number | string | null;
      prescribed_reps: number | null;
      completed_weight: number | string | null;
      completed_reps: number | null;
      is_complete: boolean;
    };
    type RawWE = {
      id: string;
      position: number;
      exercise_id: string;
      exercises: { name: string } | { name: string }[] | null;
      workout_sets: RawSet[] | null;
    };
    type RawWorkout = {
      id: string;
      performed_on: string;
      user_id: string;
      workout_exercises: RawWE[] | null;
    };

    const raw = workoutRow as RawWorkout;
    const userId = raw.user_id;

    const toNum = (v: number | string | null) =>
      v === null ? null : typeof v === "string" ? parseFloat(v) : v;

    const exercises = (raw.workout_exercises ?? [])
      .sort((a, b) => a.position - b.position)
      .map((we) => ({
        exercise_id: we.exercise_id,
        exercise_name: Array.isArray(we.exercises)
          ? (we.exercises[0]?.name ?? "")
          : (we.exercises?.name ?? ""),
        sets: (we.workout_sets ?? [])
          .sort((a, b) => a.position - b.position)
          .map((s) => ({
            id: s.id,
            completed_weight: toNum(s.completed_weight),
            completed_reps: s.completed_reps,
            prescribed_weight: toNum(s.prescribed_weight),
            prescribed_reps: s.prescribed_reps,
            is_complete: s.is_complete,
          })),
      }));

    const workout: SummaryWorkout = {
      id: raw.id,
      performed_on: raw.performed_on,
      exercises,
    };

    const exerciseIds = Array.from(new Set(exercises.map((e) => e.exercise_id)));

    // Prior best 1RM per exercise — exclude this workout's performed_on if we've
    // already written an estimated row for it, by scoping to strictly earlier dates.
    const priorBestOneRm = new Map<string, number>();
    if (exerciseIds.length > 0) {
      const { data: maxRows } = await supabase
        .from("one_rep_max_records")
        .select("exercise_id, weight, performed_on")
        .eq("user_id", userId)
        .in("exercise_id", exerciseIds)
        .lt("performed_on", raw.performed_on)
        .order("weight", { ascending: false });

      for (const r of (maxRows ?? []) as Array<{
        exercise_id: string;
        weight: number | string;
      }>) {
        const w = typeof r.weight === "string" ? parseFloat(r.weight) : r.weight;
        const current = priorBestOneRm.get(r.exercise_id);
        if (current === undefined || w > current) {
          priorBestOneRm.set(r.exercise_id, w);
        }
      }
    }

    // Prior best workout volume — strictly earlier, same user.
    const { data: priorWorkouts } = await supabase
      .from("workouts")
      .select(
        `id, performed_on,
         workout_exercises (
           workout_sets ( completed_weight, completed_reps, prescribed_weight, prescribed_reps )
         )`,
      )
      .eq("user_id", userId)
      .lt("performed_on", raw.performed_on)
      .order("performed_on", { ascending: false })
      .limit(200);

    let priorBestVolume: number | null = null;
    type PriorWorkout = {
      workout_exercises:
        | Array<{
            workout_sets:
              | Array<{
                  completed_weight: number | string | null;
                  completed_reps: number | null;
                  prescribed_weight: number | string | null;
                  prescribed_reps: number | null;
                }>
              | null;
          }>
        | null;
    };
    for (const w of (priorWorkouts ?? []) as PriorWorkout[]) {
      let v = 0;
      for (const we of w.workout_exercises ?? []) {
        for (const s of we.workout_sets ?? []) {
          v += setVolumeLbs({
            completed_weight: toNum(s.completed_weight),
            completed_reps: s.completed_reps,
            prescribed_weight: toNum(s.prescribed_weight),
            prescribed_reps: s.prescribed_reps,
          });
        }
      }
      if (v > 0 && (priorBestVolume === null || v > priorBestVolume)) {
        priorBestVolume = v;
      }
    }

    // Active challenges (dedup exercise_id matching is handled in detectPrs).
    const { data: challengeRows } = await supabase
      .from("challenges")
      .select(
        "id, title, exercise_id, tiers, current_tier_index, accumulated_volume_lbs, status",
      )
      .eq("user_id", userId)
      .neq("status", "completed");

    const challenges: PriorChallenge[] = ((challengeRows ?? []) as Array<{
      id: string;
      title: string;
      exercise_id: string | null;
      tiers: unknown;
      current_tier_index: number;
      accumulated_volume_lbs: number | string;
      status: ChallengeStatus;
    }>).map((c) => ({
      id: c.id,
      title: c.title,
      exercise_id: c.exercise_id,
      tiers: normalizeTiers(c.tiers),
      current_tier_index: c.current_tier_index,
      accumulated_volume_lbs:
        typeof c.accumulated_volume_lbs === "string"
          ? parseFloat(c.accumulated_volume_lbs)
          : c.accumulated_volume_lbs,
      status: c.status,
    }));

    const prs = detectPrs({
      workout,
      priorBestOneRmByExerciseId: priorBestOneRm,
      priorBestWorkoutVolume: priorBestVolume,
      challenges,
    });

    return { workout, prs };
  },
);
