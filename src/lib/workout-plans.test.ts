import { describe, expect, it } from "vitest";
import { workoutPlans } from "./workout-plans";

const v16AppProgramIds = new Set([
  "first-margarita",
  "beginner-strength",
  "dumbbell-strength",
  "glutes-core-conditioning",
  "100-push-ups",
]);

describe("workout plan catalog", () => {
  it("keeps app-linked plans aligned and allows web-only printables", () => {
    expect(workoutPlans).toHaveLength(6);

    const appLinkedIds = new Set(
      workoutPlans
        .map((plan) => plan.appProgramId)
        .filter((planId): planId is string => planId !== null),
    );

    expect(appLinkedIds).toEqual(v16AppProgramIds);

    for (const plan of workoutPlans) {
      expect(plan.pdfPath).toMatch(/^\/workout-plans\/.+\.pdf$/);
      expect(plan.coverPath).toMatch(/^\/workout-plans\/.+\.png$/);
      if (plan.appProgramId !== null) {
        expect(v16AppProgramIds.has(plan.appProgramId)).toBe(true);
      }
    }
  });
});
