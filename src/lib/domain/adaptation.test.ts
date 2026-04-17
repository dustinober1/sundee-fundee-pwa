import { describe, expect, it } from "vitest";
import {
  calculateLoadMultiplier,
  getRegressions,
  isContraindicated,
  type Injury,
} from "./adaptation";

const kneeInjury: Injury = {
  id: "i1",
  name: "knee strain",
  location_ids: ["knee_right"],
  recovery_phase: "rehab",
};

describe("isContraindicated", () => {
  it("flags squats with active knee injury", () => {
    expect(isContraindicated("Back Squat", "Squat", [kneeInjury])).toBe(true);
    expect(isContraindicated("Box Jump", null, [kneeInjury])).toBe(true);
  });

  it("does not flag bench press for knee injury", () => {
    expect(isContraindicated("Flat Barbell Bench Press", "Press", [kneeInjury])).toBe(false);
  });

  it("ignores resolved injuries", () => {
    expect(
      isContraindicated("Back Squat", "Squat", [
        { ...kneeInjury, recovery_phase: "resolved" },
      ]),
    ).toBe(false);
  });

  it("respects clinical synonyms (acl maps to knee)", () => {
    const acl: Injury = {
      id: "i2",
      name: "acl",
      location_ids: ["knee_left"],
      recovery_phase: "acute",
    };
    expect(isContraindicated("Back Squat", "Squat", [acl])).toBe(true);
  });
});

describe("getRegressions", () => {
  it("returns regressions for known compound lifts", () => {
    expect(getRegressions("Back Squat")).toEqual(["Goblet Squat", "Box Squat", "Air Squats"]);
  });

  it("matches partial names", () => {
    expect(getRegressions("Heavy Back Squat (Pause)")[0]).toBe("Goblet Squat");
  });

  it("returns empty for unknown exercise", () => {
    expect(getRegressions("Curl Variation Q")).toEqual([]);
  });
});

describe("calculateLoadMultiplier", () => {
  it("returns 1.0 with no active injuries", () => {
    expect(calculateLoadMultiplier([])).toBe(1.0);
    expect(
      calculateLoadMultiplier([{ ...kneeInjury, recovery_phase: "resolved" }]),
    ).toBe(1.0);
  });

  it("uses the most severe phase", () => {
    expect(
      calculateLoadMultiplier([
        { ...kneeInjury, recovery_phase: "rehab" },
        { ...kneeInjury, id: "i9", recovery_phase: "acute" },
      ]),
    ).toBe(0.3);
  });
});
