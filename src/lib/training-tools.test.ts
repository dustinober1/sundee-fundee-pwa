import { describe, expect, it } from "vitest";
import {
  calculateEstimatedOneRepMax,
  calculateReadinessRecommendation,
  classifyDeloadNeed,
  getTrainingTool,
  trainingTools,
} from "./training-tools";

describe("training tools", () => {
  it("registers five indexable tools", () => {
    expect(trainingTools.map((tool) => tool.slug)).toEqual([
      "readiness-score-calculator",
      "deload-week-planner",
      "one-rep-max-readiness-checklist",
      "rpe-rir-chart",
      "cycle-symptom-workout-modifier",
    ]);

    for (const tool of trainingTools) {
      expect(tool.href).toBe(`/tools/${tool.slug}`);
      expect(tool.title.length).toBeGreaterThan(10);
      expect(tool.description.length).toBeGreaterThan(20);
      expect(tool.intro.length).toBeGreaterThan(80);
      expect(tool.topicSummary.length).toBeGreaterThan(40);
      expect(getTrainingTool(tool.slug)).toEqual(tool);
    }
  });

  it("calculates readiness recommendations", () => {
    expect(
      calculateReadinessRecommendation({
        sleep: 9,
        soreness: 2,
        stress: 2,
        pain: 0,
      }).mode,
    ).toBe("push");

    expect(
      calculateReadinessRecommendation({
        sleep: 7,
        soreness: 5,
        stress: 5,
        pain: 2,
      }).mode,
    ).toBe("steady");

    expect(
      calculateReadinessRecommendation({
        sleep: 4,
        soreness: 8,
        stress: 7,
        pain: 6,
      }).mode,
    ).toBe("modify");
  });

  it("calculates estimated one rep max with Epley rounding", () => {
    expect(calculateEstimatedOneRepMax({ weight: 100, reps: 5 })).toBe(117);
    expect(calculateEstimatedOneRepMax({ weight: 185, reps: 3 })).toBe(204);
  });

  it("classifies deload need", () => {
    expect(
      classifyDeloadNeed({
        poorSleepDays: 1,
        highSorenessDays: 1,
        performanceDropSessions: 0,
      }),
    ).toBe("continue");

    expect(
      classifyDeloadNeed({
        poorSleepDays: 3,
        highSorenessDays: 2,
        performanceDropSessions: 1,
      }),
    ).toBe("monitor");

    expect(
      classifyDeloadNeed({
        poorSleepDays: 5,
        highSorenessDays: 4,
        performanceDropSessions: 2,
      }),
    ).toBe("deload");
  });
});
