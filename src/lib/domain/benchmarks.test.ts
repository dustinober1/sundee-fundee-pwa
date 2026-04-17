import { describe, expect, it } from "vitest";
import { bestScore, formatScore, isBetterScore } from "./benchmarks";

describe("isBetterScore", () => {
  it("treats null/undefined current as automatic improvement", () => {
    expect(isBetterScore(120, null, "time")).toBe(true);
    expect(isBetterScore(120, undefined, "reps")).toBe(true);
  });

  it("for time, lower is better", () => {
    expect(isBetterScore(180, 240, "time")).toBe(true);
    expect(isBetterScore(241, 240, "time")).toBe(false);
  });

  it("for everything else, higher is better", () => {
    expect(isBetterScore(20, 18, "reps")).toBe(true);
    expect(isBetterScore(225, 250, "load")).toBe(false);
  });
});

describe("bestScore", () => {
  it("returns null when empty", () => {
    expect(bestScore([], "time")).toBeNull();
  });

  it("picks fastest for time", () => {
    const rows = [{ score: 240 }, { score: 180 }, { score: 200 }];
    expect(bestScore(rows, "time")?.score).toBe(180);
  });

  it("picks heaviest for load", () => {
    const rows = [{ score: 225 }, { score: 315 }, { score: 295 }];
    expect(bestScore(rows, "load")?.score).toBe(315);
  });
});

describe("formatScore", () => {
  it("formats time as M:SS", () => {
    expect(formatScore(245, "time")).toBe("4:05");
    expect(formatScore(60, "time")).toBe("1:00");
  });

  it("formats rounds + reps", () => {
    expect(formatScore(15.0, "rounds_and_reps")).toBe("15");
    expect(formatScore(15.07, "rounds_and_reps")).toBe("15 + 7");
  });

  it("formats load with units", () => {
    expect(formatScore(315, "load")).toBe("315.0 lb");
  });
});
