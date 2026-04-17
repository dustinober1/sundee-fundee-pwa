import { describe, expect, it } from "vitest";
import {
  brzyckiOneRepMax,
  convertWeight,
  estimatedOneRepMax,
  roundToPlate,
} from "./oneRepMax";

describe("estimatedOneRepMax (Epley)", () => {
  it("returns null for single-rep sets", () => {
    expect(estimatedOneRepMax(225, 1)).toBeNull();
    expect(estimatedOneRepMax(225, 0)).toBeNull();
  });

  it("returns null for bodyweight or negative weight", () => {
    expect(estimatedOneRepMax(0, 5)).toBeNull();
    expect(estimatedOneRepMax(-50, 5)).toBeNull();
  });

  it("returns null for non-finite inputs", () => {
    expect(estimatedOneRepMax(NaN, 5)).toBeNull();
    expect(estimatedOneRepMax(225, Infinity)).toBeNull();
  });

  it("computes weight × (1 + reps/30)", () => {
    // 225 × (1 + 5/30) = 262.5
    expect(estimatedOneRepMax(225, 5)).toBeCloseTo(262.5, 5);
    // 100 × (1 + 10/30) ≈ 133.333…
    expect(estimatedOneRepMax(100, 10)).toBeCloseTo(133.3333, 3);
  });
});

describe("brzyckiOneRepMax", () => {
  it("matches the standard formula", () => {
    // 225 × 36/(37-5) = 253.125
    expect(brzyckiOneRepMax(225, 5)).toBeCloseTo(253.125, 5);
  });

  it("rejects reps outside the valid range", () => {
    expect(brzyckiOneRepMax(225, 1)).toBeNull();
    expect(brzyckiOneRepMax(225, 37)).toBeNull();
  });
});

describe("convertWeight", () => {
  it("is identity when units match", () => {
    expect(convertWeight(225, "lb", "lb")).toBe(225);
  });

  it("converts kg → lb and back", () => {
    const lb = convertWeight(100, "kg", "lb");
    expect(lb).toBeCloseTo(220.462, 2);
    expect(convertWeight(lb, "lb", "kg")).toBeCloseTo(100, 5);
  });
});

describe("roundToPlate", () => {
  it("rounds to nearest 0.5", () => {
    expect(roundToPlate(262.5)).toBe(262.5);
    expect(roundToPlate(262.7)).toBe(262.5);
    expect(roundToPlate(262.8)).toBe(263);
  });
});
