import { describe, expect, it } from "vitest";
import { calculateRecoveryScore } from "./recovery";

describe("recovery scoring", () => {
  it("redistributes weights across present inputs", () => {
    const result = calculateRecoveryScore({
      sleepHours: 8,
      soreness: 2,
      stress: 3,
      cyclePhase: "follicular",
    });

    expect(result?.total).toBeGreaterThanOrEqual(80);
    expect(result?.recommendation).toBe("pushDay");
    expect(result?.presentInputCount).toBe(4);
  });

  it("returns null without inputs", () => {
    expect(calculateRecoveryScore({})).toBeNull();
  });
});
