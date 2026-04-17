// Port of EpleyCalculator.swift.
// Source: SundeeFundee/Sources/SundeeFundeeKit/Calculations/EpleyCalculator.swift

import type { WeightUnit } from "@/lib/supabase/types";

const LB_PER_KG = 2.20462262185;

/**
 * Estimate one-rep max using the Epley formula: weight × (1 + reps / 30).
 * Returns null for bodyweight (weight <= 0) or single-rep sets (reps <= 1),
 * matching the Swift implementation's `nil` semantics.
 */
export function estimatedOneRepMax(weight: number, reps: number): number | null {
  if (!Number.isFinite(weight) || !Number.isFinite(reps)) return null;
  if (reps <= 1 || weight <= 0) return null;
  return weight * (1 + reps / 30);
}

/** Round to 0.5 increments — typical plate jump granularity. */
export function roundToPlate(weight: number): number {
  return Math.round(weight * 2) / 2;
}

export function convertWeight(
  value: number,
  from: WeightUnit,
  to: WeightUnit,
): number {
  if (from === to) return value;
  return from === "kg" ? value * LB_PER_KG : value / LB_PER_KG;
}

/** Brzycki — alternative formula useful for cross-checking estimates. */
export function brzyckiOneRepMax(weight: number, reps: number): number | null {
  if (!Number.isFinite(weight) || !Number.isFinite(reps)) return null;
  if (reps <= 1 || weight <= 0 || reps >= 37) return null;
  return weight * (36 / (37 - reps));
}
