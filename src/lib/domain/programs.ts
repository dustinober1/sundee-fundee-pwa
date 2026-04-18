// Domain types + pure helpers for program templates.
// No framework imports — safe to use from server or client.

import { roundToPlate } from "./oneRepMax";
import type { WeightUnit } from "@/lib/supabase/types";

export type ProgramPhase = {
  name: string;
  start_week: number;
  end_week: number;
};

export type PrescribedExercise = {
  exercise_id: string;
  sets: number;
  reps: number;
  /** Decimal form: 0.85 === 85% of 1RM. */
  pct_1rm: number;
};

export type ProgramSession = {
  label: string;
  exercises: PrescribedExercise[];
};

export type ProgramWeek = {
  week_num: number;
  sessions: ProgramSession[];
};

/** Resolve the phase covering the given week number, or null if none match. */
export function currentPhaseForWeek(
  phases: ProgramPhase[],
  week: number,
): ProgramPhase | null {
  for (const p of phases) {
    if (week >= p.start_week && week <= p.end_week) return p;
  }
  return null;
}

/** Find a week entry by week_num, or null. */
export function findWeek(
  weeks: ProgramWeek[],
  weekNum: number,
): ProgramWeek | null {
  return weeks.find((w) => w.week_num === weekNum) ?? null;
}

/** Weeks remaining in program; clamps at 0 if currentWeek exceeds total. */
export function weeksRemaining(totalWeeks: number, currentWeek: number): number {
  return Math.max(0, totalWeeks - currentWeek);
}

/** Calculate target weight from stored 1RM and prescribed percentage. */
export function targetWeight(oneRepMax: number, pct1rm: number): number {
  return oneRepMax * pct1rm;
}

export type ResolvedTarget =
  | { has_max: true; weight: number; unit: WeightUnit }
  | { has_max: false };

/**
 * Resolve a rounded target weight for a prescribed %1RM given the user's stored
 * max for that exercise. Returns `{ has_max: false }` when no max is stored —
 * the caller should render a "log a max" prompt.
 */
export function resolveTargetWeight(
  pct_1rm: number,
  max: { weight: number; unit: WeightUnit } | null | undefined,
): ResolvedTarget {
  if (!max) return { has_max: false };
  return {
    has_max: true,
    weight: roundToPlate(max.weight * pct_1rm),
    unit: max.unit,
  };
}
