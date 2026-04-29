import { describe, expect, it } from "vitest";
import { workoutPlans } from "./workout-plans";

const v16AppProgramIds = new Set([
  "first-margarita",
  "beginner-strength",
  "dumbbell-strength",
  "glutes-core-conditioning",
]);

describe("workout plan catalog", () => {
  it("matches the v1.6 app program catalog", () => {
    expect(workoutPlans).toHaveLength(4);
    expect(new Set(workoutPlans.map((plan) => plan.appProgramId))).toEqual(
      v16AppProgramIds,
    );

    for (const plan of workoutPlans) {
      expect(v16AppProgramIds.has(plan.appProgramId)).toBe(true);
      expect(plan.pdfPath).toMatch(/^\/workout-plans\/.+\.pdf$/);
      expect(plan.coverPath).toMatch(/^\/workout-plans\/.+\.png$/);
    }
  });
});
