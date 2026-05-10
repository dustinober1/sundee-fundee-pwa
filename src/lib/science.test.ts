import { describe, expect, it } from "vitest";
import { getScienceRecommendation } from "./science";

describe("getScienceRecommendation", () => {
  it("returns Push for high readiness with no pain and a strength goal", () => {
    const recommendation = getScienceRecommendation({
      readiness: "high",
      cycleContext: "follicular",
      painFlag: "none",
      sessionGoal: "strength",
    });

    expect(recommendation.action).toBe("Push");
    expect(recommendation.load).toContain("planned loading");
  });

  it("returns Hold for a steady normal training day", () => {
    const recommendation = getScienceRecommendation({
      readiness: "steady",
      cycleContext: "not-used",
      painFlag: "none",
      sessionGoal: "strength",
    });

    expect(recommendation.action).toBe("Hold");
    expect(recommendation.summary).toContain("original workout");
  });

  it("returns Modify when low readiness changes the session dose", () => {
    const recommendation = getScienceRecommendation({
      readiness: "low",
      cycleContext: "luteal",
      painFlag: "none",
      sessionGoal: "hypertrophy",
    });

    expect(recommendation.action).toBe("Modify");
    expect(recommendation.volume).toContain("working sets");
  });

  it("returns Recover when acute pain is present", () => {
    const recommendation = getScienceRecommendation({
      readiness: "steady",
      cycleContext: "not-used",
      painFlag: "acute",
      sessionGoal: "technique",
    });

    expect(recommendation.action).toBe("Recover");
    expect(recommendation.exerciseSelection).toContain("Avoid");
  });
});
