// Pure PR detection for post-workout summary.
// Given a completed workout + prior bests, returns which exercises hit new
// 1RMs, whether total volume beats prior sessions, the best set of the day,
// and which challenge tiers advanced.

import { estimatedOneRepMax } from "./oneRepMax";
import { setVolumeLbs } from "./challenges";
import {
  advanceTier,
  type ChallengeStatus,
  type ChallengeTier,
} from "./challenges";

export type SummarySet = {
  id: string;
  completed_weight: number | null;
  completed_reps: number | null;
  prescribed_weight: number | null;
  prescribed_reps: number | null;
  is_complete: boolean;
};

export type SummaryExercise = {
  exercise_id: string;
  exercise_name: string;
  sets: SummarySet[];
};

export type SummaryWorkout = {
  id: string;
  performed_on: string;
  exercises: SummaryExercise[];
};

export type OneRmPr = {
  exercise_id: string;
  exercise_name: string;
  estimated_1rm: number;
  prior_best: number | null;
  delta: number; // positive = improvement
  source_set: { weight: number; reps: number };
};

export type VolumePr = {
  total_volume: number;
  prior_best: number | null;
  delta: number;
};

export type BestSet = {
  exercise_id: string;
  exercise_name: string;
  weight: number;
  reps: number;
  estimated_1rm: number;
};

export type ChallengeAdvance = {
  challenge_id: string;
  title: string;
  added_volume: number;
  new_tier_name: string | null;
  is_fully_complete: boolean;
};

export type WorkoutPrs = {
  oneRmPrs: OneRmPr[];
  volumePr: VolumePr | null;
  bestSetOfDay: BestSet | null;
  challengeAdvances: ChallengeAdvance[];
  totalVolume: number;
};

export type PriorChallenge = {
  id: string;
  title: string;
  exercise_id: string | null;
  tiers: readonly ChallengeTier[];
  current_tier_index: number;
  accumulated_volume_lbs: number;
  status: ChallengeStatus;
};

/**
 * Best estimated 1RM across a workout's completed sets for one exercise.
 * A single heavy rep counts at face value; multi-rep sets use Epley.
 */
function bestEstimatedOneRm(sets: SummarySet[]): {
  estimate: number;
  weight: number;
  reps: number;
} | null {
  let best: { estimate: number; weight: number; reps: number } | null = null;

  for (const s of sets) {
    const weight = s.completed_weight;
    const reps = s.completed_reps;
    if (!s.is_complete || weight === null || reps === null || weight <= 0 || reps <= 0) {
      continue;
    }
    const estimate = reps === 1 ? weight : (estimatedOneRepMax(weight, reps) ?? 0);
    if (estimate <= 0) continue;
    if (best === null || estimate > best.estimate) {
      best = { estimate, weight, reps };
    }
  }
  return best;
}

export function detectPrs(input: {
  workout: SummaryWorkout;
  priorBestOneRmByExerciseId: Map<string, number>; // weight in lbs
  priorBestWorkoutVolume: number | null;
  challenges: PriorChallenge[];
}): WorkoutPrs {
  const oneRmPrs: OneRmPr[] = [];
  let bestSet: BestSet | null = null;
  let totalVolume = 0;

  for (const ex of input.workout.exercises) {
    const best = bestEstimatedOneRm(ex.sets);

    for (const s of ex.sets) {
      totalVolume += setVolumeLbs({
        completed_weight: s.completed_weight,
        completed_reps: s.completed_reps,
        prescribed_weight: s.prescribed_weight,
        prescribed_reps: s.prescribed_reps,
      });
    }

    if (!best) continue;

    if (bestSet === null || best.estimate > bestSet.estimated_1rm) {
      bestSet = {
        exercise_id: ex.exercise_id,
        exercise_name: ex.exercise_name,
        weight: best.weight,
        reps: best.reps,
        estimated_1rm: best.estimate,
      };
    }

    const prior = input.priorBestOneRmByExerciseId.get(ex.exercise_id) ?? null;
    if (prior === null || best.estimate > prior) {
      oneRmPrs.push({
        exercise_id: ex.exercise_id,
        exercise_name: ex.exercise_name,
        estimated_1rm: best.estimate,
        prior_best: prior,
        delta: prior === null ? best.estimate : best.estimate - prior,
        source_set: { weight: best.weight, reps: best.reps },
      });
    }
  }

  const volumePr: VolumePr | null =
    totalVolume > 0 &&
    (input.priorBestWorkoutVolume === null || totalVolume > input.priorBestWorkoutVolume)
      ? {
          total_volume: totalVolume,
          prior_best: input.priorBestWorkoutVolume,
          delta:
            input.priorBestWorkoutVolume === null
              ? totalVolume
              : totalVolume - input.priorBestWorkoutVolume,
        }
      : null;

  const challengeAdvances: ChallengeAdvance[] = [];
  for (const c of input.challenges) {
    if (c.status === "completed") continue;

    let added = 0;
    if (c.exercise_id === null) {
      added = totalVolume;
    } else {
      for (const ex of input.workout.exercises) {
        if (ex.exercise_id !== c.exercise_id) continue;
        for (const s of ex.sets) {
          added += setVolumeLbs({
            completed_weight: s.completed_weight,
            completed_reps: s.completed_reps,
            prescribed_weight: s.prescribed_weight,
            prescribed_reps: s.prescribed_reps,
          });
        }
      }
    }
    if (added <= 0) continue;

    const next = advanceTier(
      c.tiers,
      c.current_tier_index,
      c.accumulated_volume_lbs + added,
    );
    const tierChanged = next.currentTierIndex > c.current_tier_index;

    if (tierChanged || next.status === "completed") {
      const sorted = [...c.tiers].sort((a, b) => a.ordinal - b.ordinal);
      const newTier = sorted[next.currentTierIndex] ?? null;
      challengeAdvances.push({
        challenge_id: c.id,
        title: c.title,
        added_volume: added,
        new_tier_name: newTier?.name ?? sorted[sorted.length - 1]?.name ?? null,
        is_fully_complete: next.status === "completed",
      });
    }
  }

  return {
    oneRmPrs,
    volumePr,
    bestSetOfDay: bestSet,
    challengeAdvances,
    totalVolume,
  };
}
