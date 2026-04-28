import { describe, expect, it } from "vitest";
import { buildLocalTrainingRecommendation } from "./recommendations";

describe("local training recommendations", () => {
  it("pushes when recovery is high", () => {
    const recommendation = buildLocalTrainingRecommendation({
      recoveryScore: 88,
      cyclePhase: "follicular",
      recentWorkoutCount: 3,
    });

    expect(recommendation.adjustment).toBe("push");
    expect(recommendation.intensityMultiplier).toBe(1);
  });

  it("reduces a planned session when soreness is high", () => {
    const recommendation = buildLocalTrainingRecommendation({
      recoveryScore: 72,
      soreness: 8,
      recentWorkoutCount: 2,
      programSession: {
        sessionId: "w1d1",
        sessionName: "Week 1 Day 1 - Squat Focus",
        sessionType: "strength",
        focus: "squat",
        exercises: [],
      },
    });

    expect(recommendation.adjustment).toBe("reduce");
    expect(recommendation.reasons).toContain(
      "High soreness suggests reducing volume today.",
    );
  });

  it("turns very low recovery into recovery work", () => {
    const recommendation = buildLocalTrainingRecommendation({
      recoveryScore: 32,
      cyclePhase: "menstrual",
      stress: 9,
      recentWorkoutCount: 4,
    });

    expect(recommendation.adjustment).toBe("rest");
    expect(recommendation.intensityMultiplier).toBe(0.65);
  });
});
