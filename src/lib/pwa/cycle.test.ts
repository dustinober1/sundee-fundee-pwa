import { describe, expect, it } from "vitest";
import {
  calculateCycleStatus,
  getPhaseBoundaries,
  getPhaseRecommendation,
} from "./cycle";

describe("cycle calculations", () => {
  it("matches the iOS phase boundaries for a 28-day cycle", () => {
    expect(
      getPhaseBoundaries({
        averageCycleLengthDays: 28,
        averagePeriodLengthDays: 5,
        lutealPhaseLengthDays: 14,
      }),
    ).toEqual({
      menstrual: { start: 1, end: 5 },
      follicular: { start: 6, end: 11 },
      ovulation: { start: 12, end: 16 },
      luteal: { start: 17, end: 28 },
    });
  });

  it("calculates the current phase from a period start", () => {
    const status = calculateCycleStatus(
      [{ startedOn: "2026-04-01" }],
      {
        averageCycleLengthDays: 28,
        averagePeriodLengthDays: 5,
        lutealPhaseLengthDays: 14,
      },
      new Date("2026-04-13T12:00:00"),
    );

    expect(status?.cycleDay).toBe(13);
    expect(status?.currentPhase).toBe("ovulation");
    expect(status?.predictedNextPeriod).toBe("2026-04-29");
  });

  it("returns phase recommendations", () => {
    expect(getPhaseRecommendation("luteal").intensityRecommendation).toBe(
      "moderate",
    );
  });
});
