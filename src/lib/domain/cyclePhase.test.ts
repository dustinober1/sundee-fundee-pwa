import { describe, expect, it } from "vitest";
import {
  calculateCycleStatus,
  DEFAULT_CYCLE_SETTINGS,
  getPhaseBoundaries,
  scoreCyclePhase,
} from "./cyclePhase";

describe("getPhaseBoundaries (default 28/5/14)", () => {
  it("partitions the cycle", () => {
    const b = getPhaseBoundaries(DEFAULT_CYCLE_SETTINGS);
    expect(b.menstrual).toEqual({ start: 1, end: 5 });
    expect(b.follicular.start).toBe(6);
    expect(b.ovulation.start).toBeLessThanOrEqual(b.ovulation.end);
    expect(b.luteal.end).toBe(28);
  });
});

describe("calculateCycleStatus", () => {
  it("returns null with no period logs", () => {
    expect(calculateCycleStatus([], DEFAULT_CYCLE_SETTINGS)).toBeNull();
  });

  it("identifies menstrual phase on day 1", () => {
    const start = new Date(2026, 3, 10);
    const status = calculateCycleStatus([{ startDate: start, endDate: null }], undefined, start);
    expect(status?.currentPhase).toBe("menstrual");
    expect(status?.cycleDay).toBe(1);
  });

  it("identifies luteal phase late in the cycle", () => {
    const start = new Date(2026, 3, 1);
    const ref = new Date(2026, 3, 22); // day 22 → luteal
    const status = calculateCycleStatus([{ startDate: start, endDate: null }], undefined, ref);
    expect(status?.currentPhase).toBe("luteal");
    expect(status?.cycleDay).toBe(22);
  });
});

describe("scoreCyclePhase", () => {
  it("returns expected scores", () => {
    expect(scoreCyclePhase("ovulation").score).toBe(85);
    expect(scoreCyclePhase("menstrual").score).toBe(50);
    expect(scoreCyclePhase(null).score).toBe(70);
  });
});
