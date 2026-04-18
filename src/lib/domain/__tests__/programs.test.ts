import { describe, expect, it } from "vitest";
import {
  currentPhaseForWeek,
  findWeek,
  targetWeight,
  weeksRemaining,
  type ProgramPhase,
  type ProgramWeek,
} from "../programs";

describe("currentPhaseForWeek", () => {
  const phases: ProgramPhase[] = [
    { name: "Foundation", start_week: 1, end_week: 4 },
    { name: "Build", start_week: 5, end_week: 8 },
    { name: "Peak", start_week: 9, end_week: 12 },
  ];

  it("returns the phase containing the week", () => {
    expect(currentPhaseForWeek(phases, 1)?.name).toBe("Foundation");
    expect(currentPhaseForWeek(phases, 4)?.name).toBe("Foundation");
    expect(currentPhaseForWeek(phases, 5)?.name).toBe("Build");
    expect(currentPhaseForWeek(phases, 10)?.name).toBe("Peak");
  });

  it("returns null when no phase matches", () => {
    expect(currentPhaseForWeek(phases, 0)).toBeNull();
    expect(currentPhaseForWeek(phases, 13)).toBeNull();
    expect(currentPhaseForWeek([], 1)).toBeNull();
  });
});

describe("findWeek", () => {
  const weeks: ProgramWeek[] = [
    { week_num: 1, sessions: [] },
    { week_num: 2, sessions: [] },
  ];

  it("returns the matching week", () => {
    expect(findWeek(weeks, 1)?.week_num).toBe(1);
    expect(findWeek(weeks, 2)?.week_num).toBe(2);
  });

  it("returns null when missing", () => {
    expect(findWeek(weeks, 5)).toBeNull();
  });
});

describe("weeksRemaining", () => {
  it("computes weeks left", () => {
    expect(weeksRemaining(12, 3)).toBe(9);
    expect(weeksRemaining(12, 12)).toBe(0);
  });
  it("clamps at 0 if exceeded", () => {
    expect(weeksRemaining(4, 7)).toBe(0);
  });
});

describe("targetWeight", () => {
  it("multiplies 1RM by pct", () => {
    expect(targetWeight(200, 0.85)).toBe(170);
    expect(targetWeight(100, 1.0)).toBe(100);
  });
});
