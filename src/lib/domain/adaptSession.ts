// Pure adaptive-session logic. Combines recovery recommendation, cycle phase,
// and active injuries to adjust prescribed loads, surface contraindicated
// lifts, and suggest regressions. No I/O — the caller resolves replacement
// exercise IDs and persists results.

import {
  calculateLoadMultiplier,
  getRegressions,
  isContraindicated,
  type Injury,
} from "./adaptation";
import type { CyclePhase } from "./cyclePhase";
import type { TrainingRecommendation } from "./recoveryScore";

export type PrescribedExercise = {
  exercise_id: string;
  exercise_name: string;
  exercise_category: string | null;
  sets: number;
  reps: number;
  pct_1rm: number; // decimal (0..1)
  latest_max: number | null;
};

export type AdaptedExercise = {
  exercise_id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  pct_1rm: number;
  original_prescribed_weight: number | null;
  adapted_prescribed_weight: number | null;
  contraindicated: boolean;
  regression_suggestions: readonly string[];
};

export type ExerciseSwap = {
  original_exercise_id: string;
  original_exercise_name: string;
  suggested_regressions: readonly string[];
  reason: string;
};

export type AdaptSessionResult = {
  globalMultiplier: number; // 0..~1.05
  recoveryMultiplier: number;
  cycleMultiplier: number;
  injuryMultiplier: number;
  skipRecommended: boolean; // rest_day or multiplier ≤ 0
  exercises: AdaptedExercise[];
  swaps: ExerciseSwap[];
  rationale: string[]; // human-readable explanations
};

function recoveryMultiplier(rec: TrainingRecommendation | null): number {
  if (rec === "push_day") return 1.0;
  if (rec === "moderate") return 0.85;
  if (rec === "rest_day") return 0.0;
  return 1.0; // no data → no adjustment
}

function cycleMultiplier(phase: CyclePhase | null): number {
  if (phase === "ovulation") return 1.05;
  if (phase === "menstrual") return 0.95;
  return 1.0;
}

function roundToPlate(weight: number): number {
  return Math.round(weight * 2) / 2;
}

export function adaptSession(input: {
  exercises: PrescribedExercise[];
  recovery: TrainingRecommendation | null;
  cyclePhase: CyclePhase | null;
  injuries: readonly Injury[];
}): AdaptSessionResult {
  const recMult = recoveryMultiplier(input.recovery);
  const cycMult = cycleMultiplier(input.cyclePhase);
  const injMult = calculateLoadMultiplier(input.injuries);
  const globalMult = recMult * cycMult * injMult;

  const rationale: string[] = [];
  if (input.recovery === "rest_day") {
    rationale.push("Recovery score suggests a rest day — loads zeroed.");
  } else if (input.recovery === "moderate") {
    rationale.push("Moderate recovery — loads reduced to ~85%.");
  } else if (input.recovery === "push_day") {
    rationale.push("Good recovery — prescribed loads preserved.");
  }
  if (input.cyclePhase === "ovulation") {
    rationale.push("Ovulation phase — peak performance window, loads nudged up 5%.");
  } else if (input.cyclePhase === "menstrual") {
    rationale.push("Menstrual phase — loads nudged down 5%.");
  }
  if (injMult < 1.0) {
    rationale.push(
      `Active injuries limit load to ${Math.round(injMult * 100)}% of prescribed.`,
    );
  }

  const exercises: AdaptedExercise[] = [];
  const swaps: ExerciseSwap[] = [];

  for (const ex of input.exercises) {
    const contra = isContraindicated(
      ex.exercise_name,
      ex.exercise_category,
      input.injuries,
    );
    const regressions = contra ? getRegressions(ex.exercise_name) : [];

    const original =
      ex.latest_max != null ? roundToPlate(ex.latest_max * ex.pct_1rm) : null;
    const adapted =
      ex.latest_max != null
        ? roundToPlate(ex.latest_max * ex.pct_1rm * globalMult)
        : null;

    exercises.push({
      exercise_id: ex.exercise_id,
      exercise_name: ex.exercise_name,
      sets: ex.sets,
      reps: ex.reps,
      pct_1rm: ex.pct_1rm,
      original_prescribed_weight: original,
      adapted_prescribed_weight: adapted,
      contraindicated: contra,
      regression_suggestions: regressions,
    });

    if (contra) {
      swaps.push({
        original_exercise_id: ex.exercise_id,
        original_exercise_name: ex.exercise_name,
        suggested_regressions: regressions,
        reason: `${ex.exercise_name} is contraindicated by an active injury.`,
      });
    }
  }

  return {
    globalMultiplier: globalMult,
    recoveryMultiplier: recMult,
    cycleMultiplier: cycMult,
    injuryMultiplier: injMult,
    skipRecommended: globalMult <= 0,
    exercises,
    swaps,
    rationale,
  };
}
