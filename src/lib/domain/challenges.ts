// Port of ChallengeEngine.swift: tier progression + progress computation.

export type ChallengeTier = {
  name: string;
  target_volume_lbs: number;
  ordinal: number;
};

export type ChallengeStatus = "active" | "completed" | "expired";

export type ChallengeProgress = {
  currentTierName: string;
  percentComplete: number; // 0..1 within the active tier
  volumeRemaining: number;
  justCompletedTier: ChallengeTier | null;
  isFullyComplete: boolean;
};

export const DEFAULT_LIFETIME_TIERS: ChallengeTier[] = [
  { name: "Bronze", target_volume_lbs: 250_000, ordinal: 0 },
  { name: "Silver", target_volume_lbs: 500_000, ordinal: 1 },
  { name: "Gold", target_volume_lbs: 1_000_000, ordinal: 2 },
];

export const DEFAULT_PER_EXERCISE_TIERS: ChallengeTier[] = [
  { name: "Bronze", target_volume_lbs: 100_000, ordinal: 0 },
  { name: "Silver", target_volume_lbs: 300_000, ordinal: 1 },
  { name: "Gold", target_volume_lbs: 500_000, ordinal: 2 },
];

function sortTiers(tiers: readonly ChallengeTier[]): ChallengeTier[] {
  return [...tiers].sort((a, b) => a.ordinal - b.ordinal);
}

/**
 * Advance through tiers based on accumulated volume.
 * Returns the new tier index, completion status, and the most recently
 * crossed tier (if any).
 */
export function advanceTier(
  tiers: readonly ChallengeTier[],
  currentTierIndex: number,
  accumulatedVolume: number,
): {
  currentTierIndex: number;
  status: ChallengeStatus;
  justCompletedTier: ChallengeTier | null;
} {
  const sorted = sortTiers(tiers);
  let index = currentTierIndex;
  let justCompleted: ChallengeTier | null = null;

  while (index < sorted.length && accumulatedVolume >= sorted[index].target_volume_lbs) {
    justCompleted = sorted[index];
    index += 1;
  }

  return {
    currentTierIndex: index,
    status: index >= sorted.length ? "completed" : "active",
    justCompletedTier: justCompleted,
  };
}

export function computeChallengeProgress(challenge: {
  tiers: readonly ChallengeTier[];
  current_tier_index: number;
  accumulated_volume_lbs: number;
  status: ChallengeStatus;
}): ChallengeProgress {
  const tiers = sortTiers(challenge.tiers);

  if (challenge.current_tier_index >= tiers.length || challenge.status === "completed") {
    const last = tiers[tiers.length - 1];
    return {
      currentTierName: last?.name ?? "",
      percentComplete: 1,
      volumeRemaining: 0,
      justCompletedTier: null,
      isFullyComplete: true,
    };
  }

  const currentTier = tiers[challenge.current_tier_index];
  const previousTarget =
    challenge.current_tier_index > 0
      ? tiers[challenge.current_tier_index - 1].target_volume_lbs
      : 0;

  const tierRange = currentTier.target_volume_lbs - previousTarget;
  const tierProgress = challenge.accumulated_volume_lbs - previousTarget;
  const percent = tierRange > 0 ? clamp01(tierProgress / tierRange) : 1;
  const remaining = Math.max(currentTier.target_volume_lbs - challenge.accumulated_volume_lbs, 0);

  return {
    currentTierName: currentTier.name,
    percentComplete: percent,
    volumeRemaining: remaining,
    justCompletedTier: null,
    isFullyComplete: false,
  };
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

/**
 * Volume of a single completed set, in pounds.
 * Mirrors ChallengeEngine.workoutVolume: prefer completed_*; fall back to
 * prescribed_*; treat missing as zero.
 */
export function setVolumeLbs(set: {
  completed_weight: number | null;
  completed_reps: number | null;
  prescribed_weight: number | null;
  prescribed_reps: number | null;
}): number {
  const reps = set.completed_reps ?? set.prescribed_reps ?? 0;
  const weight =
    (set.completed_weight ?? 0) > 0
      ? (set.completed_weight as number)
      : (set.prescribed_weight ?? 0) > 0
        ? (set.prescribed_weight as number)
        : 0;
  return reps * weight;
}
