import { describe, expect, it } from "vitest";
import { detectPrs, type SummaryWorkout } from "./prDetection";
import type { ChallengeTier } from "./challenges";

function makeWorkout(
  exercises: Array<{
    exercise_id: string;
    exercise_name: string;
    sets: Array<{ weight: number | null; reps: number | null; complete?: boolean }>;
  }>,
): SummaryWorkout {
  return {
    id: "w1",
    performed_on: "2026-04-18",
    exercises: exercises.map((e) => ({
      exercise_id: e.exercise_id,
      exercise_name: e.exercise_name,
      sets: e.sets.map((s, i) => ({
        id: `${e.exercise_id}-s${i}`,
        completed_weight: s.weight,
        completed_reps: s.reps,
        prescribed_weight: null,
        prescribed_reps: null,
        is_complete: s.complete ?? true,
      })),
    })),
  };
}

describe("detectPrs — 1RM detection", () => {
  it("flags a PR when no prior max exists", () => {
    const w = makeWorkout([
      { exercise_id: "sq", exercise_name: "Squat", sets: [{ weight: 225, reps: 5 }] },
    ]);
    const result = detectPrs({
      workout: w,
      priorBestOneRmByExerciseId: new Map(),
      priorBestWorkoutVolume: null,
      challenges: [],
    });
    expect(result.oneRmPrs).toHaveLength(1);
    expect(result.oneRmPrs[0].prior_best).toBeNull();
    expect(result.oneRmPrs[0].estimated_1rm).toBeCloseTo(262.5, 2);
  });

  it("flags a PR when the new estimate beats the prior best", () => {
    const w = makeWorkout([
      { exercise_id: "sq", exercise_name: "Squat", sets: [{ weight: 235, reps: 5 }] },
    ]);
    const result = detectPrs({
      workout: w,
      priorBestOneRmByExerciseId: new Map([["sq", 262.5]]),
      priorBestWorkoutVolume: null,
      challenges: [],
    });
    expect(result.oneRmPrs).toHaveLength(1);
    expect(result.oneRmPrs[0].delta).toBeCloseTo(274.166 - 262.5, 1);
  });

  it("does not flag a PR when the best estimate is below the prior best", () => {
    const w = makeWorkout([
      { exercise_id: "sq", exercise_name: "Squat", sets: [{ weight: 205, reps: 5 }] },
    ]);
    const result = detectPrs({
      workout: w,
      priorBestOneRmByExerciseId: new Map([["sq", 262.5]]),
      priorBestWorkoutVolume: null,
      challenges: [],
    });
    expect(result.oneRmPrs).toHaveLength(0);
  });

  it("ignores sets with missing data or incomplete flag", () => {
    const w = makeWorkout([
      {
        exercise_id: "sq",
        exercise_name: "Squat",
        sets: [
          { weight: null, reps: 5 },
          { weight: 225, reps: null },
          { weight: 225, reps: 5, complete: false },
        ],
      },
    ]);
    const result = detectPrs({
      workout: w,
      priorBestOneRmByExerciseId: new Map(),
      priorBestWorkoutVolume: null,
      challenges: [],
    });
    expect(result.oneRmPrs).toHaveLength(0);
    expect(result.bestSetOfDay).toBeNull();
  });

  it("treats a single-rep set at face value", () => {
    const w = makeWorkout([
      { exercise_id: "sq", exercise_name: "Squat", sets: [{ weight: 300, reps: 1 }] },
    ]);
    const result = detectPrs({
      workout: w,
      priorBestOneRmByExerciseId: new Map(),
      priorBestWorkoutVolume: null,
      challenges: [],
    });
    expect(result.oneRmPrs[0].estimated_1rm).toBe(300);
  });
});

describe("detectPrs — volume PR", () => {
  it("flags volume PR when no prior best exists", () => {
    const w = makeWorkout([
      { exercise_id: "sq", exercise_name: "Squat", sets: [{ weight: 100, reps: 5 }] },
    ]);
    const result = detectPrs({
      workout: w,
      priorBestOneRmByExerciseId: new Map(),
      priorBestWorkoutVolume: null,
      challenges: [],
    });
    expect(result.volumePr).not.toBeNull();
    expect(result.volumePr?.total_volume).toBe(500);
  });

  it("flags volume PR only when total exceeds prior best", () => {
    const w = makeWorkout([
      { exercise_id: "sq", exercise_name: "Squat", sets: [{ weight: 100, reps: 5 }] },
    ]);
    const below = detectPrs({
      workout: w,
      priorBestOneRmByExerciseId: new Map(),
      priorBestWorkoutVolume: 1000,
      challenges: [],
    });
    expect(below.volumePr).toBeNull();

    const above = detectPrs({
      workout: w,
      priorBestOneRmByExerciseId: new Map(),
      priorBestWorkoutVolume: 400,
      challenges: [],
    });
    expect(above.volumePr?.delta).toBe(100);
  });
});

describe("detectPrs — best set of day", () => {
  it("picks the set with the highest estimated 1RM across all exercises", () => {
    const w = makeWorkout([
      {
        exercise_id: "sq",
        exercise_name: "Squat",
        sets: [{ weight: 225, reps: 5 }], // ~262.5
      },
      {
        exercise_id: "dl",
        exercise_name: "Deadlift",
        sets: [{ weight: 315, reps: 3 }], // 315 × 1.1 = 346.5
      },
    ]);
    const result = detectPrs({
      workout: w,
      priorBestOneRmByExerciseId: new Map(),
      priorBestWorkoutVolume: null,
      challenges: [],
    });
    expect(result.bestSetOfDay?.exercise_id).toBe("dl");
    expect(result.bestSetOfDay?.estimated_1rm).toBeCloseTo(346.5, 1);
  });
});

describe("detectPrs — challenge advances", () => {
  const tiers: ChallengeTier[] = [
    { name: "Bronze", target_volume_lbs: 1000, ordinal: 0 },
    { name: "Silver", target_volume_lbs: 2000, ordinal: 1 },
    { name: "Gold", target_volume_lbs: 3000, ordinal: 2 },
  ];

  it("reports tier advance for a lifetime-volume challenge", () => {
    const w = makeWorkout([
      { exercise_id: "sq", exercise_name: "Squat", sets: [{ weight: 100, reps: 10 }] },
    ]);
    const result = detectPrs({
      workout: w,
      priorBestOneRmByExerciseId: new Map(),
      priorBestWorkoutVolume: null,
      challenges: [
        {
          id: "c1",
          title: "Lifetime volume",
          exercise_id: null,
          tiers,
          current_tier_index: 0,
          accumulated_volume_lbs: 500,
          status: "active",
        },
      ],
    });
    expect(result.challengeAdvances).toHaveLength(1);
    expect(result.challengeAdvances[0].new_tier_name).toBe("Silver");
    expect(result.challengeAdvances[0].added_volume).toBe(1000);
  });

  it("scopes per-exercise challenge to matching lifts only", () => {
    const w = makeWorkout([
      { exercise_id: "sq", exercise_name: "Squat", sets: [{ weight: 100, reps: 10 }] },
      { exercise_id: "dl", exercise_name: "Deadlift", sets: [{ weight: 200, reps: 10 }] },
    ]);
    const result = detectPrs({
      workout: w,
      priorBestOneRmByExerciseId: new Map(),
      priorBestWorkoutVolume: null,
      challenges: [
        {
          id: "c2",
          title: "Deadlift volume",
          exercise_id: "dl",
          tiers,
          current_tier_index: 0,
          accumulated_volume_lbs: 0,
          status: "active",
        },
      ],
    });
    // Only deadlift sets count: 200 × 10 = 2000 → crosses Bronze (1000)
    // and Silver (2000) exactly. Lands in Gold index with Silver crossed.
    expect(result.challengeAdvances).toHaveLength(1);
    expect(result.challengeAdvances[0].added_volume).toBe(2000);
    expect(result.challengeAdvances[0].new_tier_name).toBe("Gold");
  });

  it("reports full completion when the highest tier is crossed", () => {
    const w = makeWorkout([
      { exercise_id: "sq", exercise_name: "Squat", sets: [{ weight: 500, reps: 10 }] },
    ]);
    const result = detectPrs({
      workout: w,
      priorBestOneRmByExerciseId: new Map(),
      priorBestWorkoutVolume: null,
      challenges: [
        {
          id: "c3",
          title: "Lifetime",
          exercise_id: null,
          tiers,
          current_tier_index: 0,
          accumulated_volume_lbs: 0,
          status: "active",
        },
      ],
    });
    expect(result.challengeAdvances).toHaveLength(1);
    expect(result.challengeAdvances[0].is_fully_complete).toBe(true);
  });

  it("skips already-completed challenges", () => {
    const w = makeWorkout([
      { exercise_id: "sq", exercise_name: "Squat", sets: [{ weight: 100, reps: 10 }] },
    ]);
    const result = detectPrs({
      workout: w,
      priorBestOneRmByExerciseId: new Map(),
      priorBestWorkoutVolume: null,
      challenges: [
        {
          id: "c4",
          title: "Done",
          exercise_id: null,
          tiers,
          current_tier_index: 3,
          accumulated_volume_lbs: 10_000,
          status: "completed",
        },
      ],
    });
    expect(result.challengeAdvances).toHaveLength(0);
  });
});

describe("detectPrs — empty workout", () => {
  it("returns empty PRs, null best set, null volume PR", () => {
    const result = detectPrs({
      workout: { id: "w", performed_on: "2026-04-18", exercises: [] },
      priorBestOneRmByExerciseId: new Map(),
      priorBestWorkoutVolume: null,
      challenges: [],
    });
    expect(result.oneRmPrs).toEqual([]);
    expect(result.volumePr).toBeNull();
    expect(result.bestSetOfDay).toBeNull();
    expect(result.challengeAdvances).toEqual([]);
    expect(result.totalVolume).toBe(0);
  });
});
