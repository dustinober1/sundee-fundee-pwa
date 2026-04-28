import { describe, expect, it } from "vitest";
import {
  calculatePlates,
  estimatedOneRepMax,
  kgToLbs,
  lbsToKg,
} from "./calculations";

describe("training calculations", () => {
  it("estimates one-rep max with the Epley formula", () => {
    expect(estimatedOneRepMax(100, 5)).toBeCloseTo(116.666, 2);
    expect(estimatedOneRepMax(100, 1)).toBeNull();
    expect(estimatedOneRepMax(0, 5)).toBeNull();
  });

  it("converts between pounds and kilograms", () => {
    expect(lbsToKg(100)).toBeCloseTo(45.3592, 4);
    expect(kgToLbs(45.3592)).toBeCloseTo(100, 4);
  });

  it("calculates plates per side for a standard barbell", () => {
    expect(calculatePlates(225)).toEqual([{ weight: 45, count: 2 }]);
    expect(calculatePlates(135)).toEqual([{ weight: 45, count: 1 }]);
    expect(calculatePlates(45)).toEqual([]);
  });
});
