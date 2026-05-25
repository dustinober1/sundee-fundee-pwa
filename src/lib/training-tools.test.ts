import { describe, expect, it } from "vitest";
import { getTrainingTool, trainingTools } from "./training-tools";

describe("training tool catalog", () => {
  it("registers the minimal tool routes needed by topic hubs", () => {
    expect(trainingTools.map((tool) => tool.slug)).toEqual([
      "readiness-score-calculator",
      "deload-week-planner",
      "cycle-symptom-workout-modifier",
      "one-rep-max-readiness-checklist",
      "rpe-rir-chart",
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
});
