import { describe, expect, it } from "vitest";
import {
  advanceTier,
  computeChallengeProgress,
  DEFAULT_LIFETIME_TIERS,
  setVolumeLbs,
} from "./challenges";

describe("advanceTier", () => {
  it("stays at current tier when below target", () => {
    const r = advanceTier(DEFAULT_LIFETIME_TIERS, 0, 100_000);
    expect(r.currentTierIndex).toBe(0);
    expect(r.status).toBe("active");
    expect(r.justCompletedTier).toBeNull();
  });

  it("advances when crossing a tier", () => {
    const r = advanceTier(DEFAULT_LIFETIME_TIERS, 0, 260_000);
    expect(r.currentTierIndex).toBe(1);
    expect(r.justCompletedTier?.name).toBe("Bronze");
    expect(r.status).toBe("active");
  });

  it("can advance multiple tiers at once", () => {
    const r = advanceTier(DEFAULT_LIFETIME_TIERS, 0, 1_500_000);
    expect(r.currentTierIndex).toBe(3);
    expect(r.status).toBe("completed");
    expect(r.justCompletedTier?.name).toBe("Gold");
  });

  it("respects unsorted tier input via ordinal", () => {
    const tiers = [
      { name: "Gold", target_volume_lbs: 1_000_000, ordinal: 2 },
      { name: "Bronze", target_volume_lbs: 250_000, ordinal: 0 },
      { name: "Silver", target_volume_lbs: 500_000, ordinal: 1 },
    ];
    const r = advanceTier(tiers, 0, 600_000);
    expect(r.currentTierIndex).toBe(2);
    expect(r.justCompletedTier?.name).toBe("Silver");
  });
});

describe("computeChallengeProgress", () => {
  it("reports partial progress within current tier", () => {
    const p = computeChallengeProgress({
      tiers: DEFAULT_LIFETIME_TIERS,
      current_tier_index: 0,
      accumulated_volume_lbs: 125_000,
      status: "active",
    });
    expect(p.currentTierName).toBe("Bronze");
    expect(p.percentComplete).toBeCloseTo(0.5, 5);
    expect(p.volumeRemaining).toBe(125_000);
    expect(p.isFullyComplete).toBe(false);
  });

  it("clamps to 100% when fully complete", () => {
    const p = computeChallengeProgress({
      tiers: DEFAULT_LIFETIME_TIERS,
      current_tier_index: 3,
      accumulated_volume_lbs: 1_500_000,
      status: "completed",
    });
    expect(p.percentComplete).toBe(1);
    expect(p.isFullyComplete).toBe(true);
    expect(p.volumeRemaining).toBe(0);
  });

  it("computes percent within a non-first tier", () => {
    // 750_000 of [500K..1M] is halfway through the Gold tier.
    const p = computeChallengeProgress({
      tiers: DEFAULT_LIFETIME_TIERS,
      current_tier_index: 2,
      accumulated_volume_lbs: 750_000,
      status: "active",
    });
    expect(p.currentTierName).toBe("Gold");
    expect(p.percentComplete).toBeCloseTo(0.5, 5);
  });
});

describe("setVolumeLbs", () => {
  it("prefers completed values", () => {
    expect(
      setVolumeLbs({
        completed_weight: 225,
        completed_reps: 5,
        prescribed_weight: 200,
        prescribed_reps: 3,
      }),
    ).toBe(225 * 5);
  });

  it("falls back to prescribed when completed missing", () => {
    expect(
      setVolumeLbs({
        completed_weight: null,
        completed_reps: null,
        prescribed_weight: 135,
        prescribed_reps: 8,
      }),
    ).toBe(135 * 8);
  });

  it("returns zero for bodyweight when nothing recorded", () => {
    expect(
      setVolumeLbs({
        completed_weight: null,
        completed_reps: 10,
        prescribed_weight: null,
        prescribed_reps: 10,
      }),
    ).toBe(0);
  });
});
