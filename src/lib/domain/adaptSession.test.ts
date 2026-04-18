import { describe, expect, it } from "vitest";
import { adaptSession, type PrescribedExercise } from "./adaptSession";
import type { Injury } from "./adaptation";

const squat: PrescribedExercise = {
  exercise_id: "sq",
  exercise_name: "Back Squat",
  exercise_category: "Squat",
  sets: 3,
  reps: 5,
  pct_1rm: 0.85,
  latest_max: 300,
};

const bench: PrescribedExercise = {
  exercise_id: "bp",
  exercise_name: "Flat Barbell Bench Press",
  exercise_category: "Press",
  sets: 3,
  reps: 5,
  pct_1rm: 0.80,
  latest_max: 200,
};

describe("adaptSession — recovery multiplier", () => {
  it("leaves loads unchanged on a push day with no injuries", () => {
    const r = adaptSession({
      exercises: [squat],
      recovery: "push_day",
      cyclePhase: null,
      injuries: [],
    });
    expect(r.globalMultiplier).toBeCloseTo(1.0);
    expect(r.exercises[0].adapted_prescribed_weight).toBe(r.exercises[0].original_prescribed_weight);
    expect(r.skipRecommended).toBe(false);
  });

  it("reduces loads to 85% on moderate recovery", () => {
    const r = adaptSession({
      exercises: [squat],
      recovery: "moderate",
      cyclePhase: null,
      injuries: [],
    });
    expect(r.globalMultiplier).toBeCloseTo(0.85);
    expect(r.exercises[0].adapted_prescribed_weight).toBeLessThan(
      r.exercises[0].original_prescribed_weight ?? Infinity,
    );
  });

  it("zeros loads on rest_day and flags skipRecommended", () => {
    const r = adaptSession({
      exercises: [squat],
      recovery: "rest_day",
      cyclePhase: null,
      injuries: [],
    });
    expect(r.globalMultiplier).toBe(0);
    expect(r.exercises[0].adapted_prescribed_weight).toBe(0);
    expect(r.skipRecommended).toBe(true);
  });

  it("makes no adjustment when recovery is null", () => {
    const r = adaptSession({
      exercises: [squat],
      recovery: null,
      cyclePhase: null,
      injuries: [],
    });
    expect(r.globalMultiplier).toBeCloseTo(1.0);
  });
});

describe("adaptSession — cycle phase", () => {
  it("nudges up on ovulation", () => {
    const r = adaptSession({
      exercises: [squat],
      recovery: "push_day",
      cyclePhase: "ovulation",
      injuries: [],
    });
    expect(r.globalMultiplier).toBeCloseTo(1.05);
  });

  it("nudges down on menstrual", () => {
    const r = adaptSession({
      exercises: [squat],
      recovery: "push_day",
      cyclePhase: "menstrual",
      injuries: [],
    });
    expect(r.globalMultiplier).toBeCloseTo(0.95);
  });

  it("is neutral on follicular and luteal", () => {
    const f = adaptSession({
      exercises: [squat],
      recovery: "push_day",
      cyclePhase: "follicular",
      injuries: [],
    });
    expect(f.globalMultiplier).toBeCloseTo(1.0);
    const l = adaptSession({
      exercises: [squat],
      recovery: "push_day",
      cyclePhase: "luteal",
      injuries: [],
    });
    expect(l.globalMultiplier).toBeCloseTo(1.0);
  });
});

describe("adaptSession — injuries", () => {
  it("flags contraindicated exercise + suggests regressions", () => {
    const injuries: Injury[] = [
      {
        id: "i1",
        name: "ACL",
        location_ids: ["knee_left"],
        recovery_phase: "rehab",
      },
    ];
    const r = adaptSession({
      exercises: [squat, bench],
      recovery: "push_day",
      cyclePhase: null,
      injuries,
    });
    const sq = r.exercises.find((e) => e.exercise_id === "sq")!;
    expect(sq.contraindicated).toBe(true);
    expect(sq.regression_suggestions.length).toBeGreaterThan(0);
    const bp = r.exercises.find((e) => e.exercise_id === "bp")!;
    expect(bp.contraindicated).toBe(false);
    expect(r.swaps).toHaveLength(1);
    expect(r.swaps[0].original_exercise_id).toBe("sq");
  });

  it("applies injury load multiplier (acute = 0.3)", () => {
    const injuries: Injury[] = [
      {
        id: "i1",
        name: "Rotator Cuff",
        location_ids: ["shoulder_right"],
        recovery_phase: "acute",
      },
    ];
    const r = adaptSession({
      exercises: [squat],
      recovery: "push_day",
      cyclePhase: null,
      injuries,
    });
    expect(r.injuryMultiplier).toBeCloseTo(0.3);
    expect(r.globalMultiplier).toBeCloseTo(0.3);
  });

  it("takes the minimum multiplier across multiple injuries", () => {
    const injuries: Injury[] = [
      {
        id: "i1",
        name: "Knee",
        location_ids: ["knee_left"],
        recovery_phase: "light_load",
      },
      {
        id: "i2",
        name: "Shoulder",
        location_ids: ["shoulder_right"],
        recovery_phase: "rehab",
      },
    ];
    const r = adaptSession({
      exercises: [squat],
      recovery: "push_day",
      cyclePhase: null,
      injuries,
    });
    expect(r.injuryMultiplier).toBeCloseTo(0.5); // rehab < light_load
  });
});

describe("adaptSession — combined signals", () => {
  it("stacks recovery × cycle × injury", () => {
    const injuries: Injury[] = [
      {
        id: "i1",
        name: "Knee",
        location_ids: ["knee_left"],
        recovery_phase: "return_to_play",
      },
    ];
    const r = adaptSession({
      exercises: [squat],
      recovery: "moderate",
      cyclePhase: "menstrual",
      injuries,
    });
    // 0.85 × 0.95 × 0.85 = 0.6864
    expect(r.globalMultiplier).toBeCloseTo(0.8075 * 0.85, 3);
  });
});

describe("adaptSession — missing max", () => {
  it("leaves prescribed weights null when no max is known", () => {
    const noMax = { ...squat, latest_max: null };
    const r = adaptSession({
      exercises: [noMax],
      recovery: "moderate",
      cyclePhase: null,
      injuries: [],
    });
    expect(r.exercises[0].original_prescribed_weight).toBeNull();
    expect(r.exercises[0].adapted_prescribed_weight).toBeNull();
  });
});

describe("adaptSession — rationale lines", () => {
  it("emits one line per active signal", () => {
    const injuries: Injury[] = [
      {
        id: "i1",
        name: "Back",
        location_ids: ["lumbar"],
        recovery_phase: "rehab",
      },
    ];
    const r = adaptSession({
      exercises: [squat],
      recovery: "moderate",
      cyclePhase: "ovulation",
      injuries,
    });
    expect(r.rationale.length).toBe(3); // recovery + cycle + injury
  });
});
