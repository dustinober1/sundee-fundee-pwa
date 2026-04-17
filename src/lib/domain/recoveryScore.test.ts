import { describe, expect, it } from "vitest";
import {
  calculateRecoveryScore,
  normalizeHrv,
  scoreAcwr,
  scoreHrv,
  scorePain,
  scoreSleep,
} from "./recoveryScore";

describe("scoreSleep", () => {
  it("uses fixed bands matching Swift", () => {
    expect(scoreSleep(8.5)).toBe(100);
    expect(scoreSleep(7.5)).toBe(85);
    expect(scoreSleep(6.5)).toBe(60);
    expect(scoreSleep(5.5)).toBe(35);
    expect(scoreSleep(4)).toBe(10);
  });
});

describe("scoreHrv", () => {
  it("hits anchor points", () => {
    expect(scoreHrv(80)).toBe(100);
    expect(scoreHrv(60)).toBe(60);
    expect(scoreHrv(40)).toBe(30);
    expect(scoreHrv(20)).toBe(10);
    expect(scoreHrv(10)).toBe(0);
  });

  it("interpolates within bands", () => {
    expect(scoreHrv(70)).toBe(80); // 60 + 0.5 * 40
    expect(scoreHrv(50)).toBe(45); // 30 + 0.5 * 30
  });
});

describe("normalizeHrv", () => {
  it("luteal divides by 0.85 (boosts the score)", () => {
    expect(normalizeHrv(60, "luteal")).toBeCloseTo(70.588, 2);
  });

  it("no phase = identity", () => {
    expect(normalizeHrv(60, null)).toBe(60);
  });
});

describe("scorePain", () => {
  it("clamps to 1..10", () => {
    expect(scorePain(0).score).toBe(scorePain(1).score);
    expect(scorePain(99).score).toBe(scorePain(10).score);
  });

  it("intensity 1 → 100, intensity 10 → 1", () => {
    expect(scorePain(1).score).toBe(100);
    expect(scorePain(10).score).toBe(1);
  });
});

describe("scoreAcwr", () => {
  it("maps ratio bands", () => {
    expect(scoreAcwr(0.5).score).toBe(90);
    expect(scoreAcwr(0.9).score).toBe(80);
    expect(scoreAcwr(1.1).score).toBe(60);
    expect(scoreAcwr(1.4).score).toBe(40);
    expect(scoreAcwr(1.8).score).toBe(20);
  });
});

describe("calculateRecoveryScore", () => {
  it("returns null when no inputs", () => {
    expect(calculateRecoveryScore({})).toBeNull();
  });

  it("redistributes weight when only one input present", () => {
    const r = calculateRecoveryScore({ sleepDurationHours: 7.5 });
    expect(r).not.toBeNull();
    expect(r!.total).toBe(85);
    expect(r!.presentInputCount).toBe(1);
  });

  it("uses recommendation thresholds 70 / 40", () => {
    expect(calculateRecoveryScore({ sleepDurationHours: 8 })!.recommendation).toBe(
      "push_day",
    );
    expect(calculateRecoveryScore({ sleepDurationHours: 6 })!.recommendation).toBe(
      "moderate",
    );
    expect(calculateRecoveryScore({ painIntensity: 10 })!.recommendation).toBe("rest_day");
  });

  it("phase-normalizes HRV", () => {
    // luteal phase boosts low HRV (60ms) above the 60-band threshold
    const luteal = calculateRecoveryScore({
      hrvMilliseconds: 60,
      cyclePhase: "luteal",
    });
    const noPhase = calculateRecoveryScore({ hrvMilliseconds: 60 });
    expect(luteal!.subScores.hrv).toBeGreaterThan(noPhase!.subScores.hrv ?? 0);
  });
});
