import { describe, expect, it } from "vitest";
import {
  EQUIPMENT_PROFILES,
  EQUIPMENT_PROFILE_KEYS,
  getEquipmentProfile,
  isEquipmentProfileKey,
  isExerciseAllowed,
} from "./equipmentProfiles";

describe("isEquipmentProfileKey", () => {
  it("accepts every declared preset key", () => {
    for (const key of EQUIPMENT_PROFILE_KEYS) {
      expect(isEquipmentProfileKey(key)).toBe(true);
    }
  });

  it("rejects unknown strings and non-strings", () => {
    expect(isEquipmentProfileKey("garage")).toBe(false);
    expect(isEquipmentProfileKey(null)).toBe(false);
    expect(isEquipmentProfileKey(undefined)).toBe(false);
    expect(isEquipmentProfileKey(42)).toBe(false);
  });
});

describe("getEquipmentProfile", () => {
  it("returns the profile for a valid key", () => {
    expect(getEquipmentProfile("commercial_gym")?.key).toBe("commercial_gym");
  });

  it("returns null for unknown or nullish keys", () => {
    expect(getEquipmentProfile(null)).toBeNull();
    expect(getEquipmentProfile(undefined)).toBeNull();
    expect(getEquipmentProfile("")).toBeNull();
    expect(getEquipmentProfile("planet_fitness")).toBeNull();
  });
});

describe("isExerciseAllowed", () => {
  const commercial = EQUIPMENT_PROFILES.commercial_gym;
  const full = EQUIPMENT_PROFILES.full_gym;
  const home = EQUIPMENT_PROFILES.home_barbell;
  const bw = EQUIPMENT_PROFILES.bodyweight;

  it("always allows empty-equipment exercises", () => {
    expect(isExerciseAllowed([], commercial)).toBe(true);
    expect(isExerciseAllowed([], full)).toBe(true);
    expect(isExerciseAllowed([], home)).toBe(true);
    expect(isExerciseAllowed([], bw)).toBe(true);
  });

  it("always allows everything when profile is null (show-all)", () => {
    expect(isExerciseAllowed(["barbell", "squat_rack"], null)).toBe(true);
    expect(isExerciseAllowed(["ghd"], null)).toBe(true);
  });

  it("hides barbell lifts from the commercial-gym profile", () => {
    expect(isExerciseAllowed(["barbell", "squat_rack"], commercial)).toBe(false);
    expect(isExerciseAllowed(["barbell"], commercial)).toBe(false);
    expect(isExerciseAllowed(["trap_bar"], commercial)).toBe(false);
  });

  it("shows machine and dumbbell lifts to the commercial-gym profile", () => {
    expect(isExerciseAllowed(["leg_press"], commercial)).toBe(true);
    expect(isExerciseAllowed(["lat_pulldown"], commercial)).toBe(true);
    expect(isExerciseAllowed(["dumbbell_light", "bench_flat"], commercial)).toBe(true);
    expect(isExerciseAllowed(["cable_column"], commercial)).toBe(true);
    expect(isExerciseAllowed(["smith_machine"], commercial)).toBe(true);
  });

  it("hides heavy-dumbbell lifts from the commercial-gym profile", () => {
    expect(isExerciseAllowed(["dumbbell_heavy", "bench_flat"], commercial)).toBe(false);
  });

  it("hides specialty cardio (air bike, ski erg) from commercial-gym", () => {
    expect(isExerciseAllowed(["bike_air"], commercial)).toBe(false);
    expect(isExerciseAllowed(["ski_erg"], commercial)).toBe(false);
    expect(isExerciseAllowed(["rower"], commercial)).toBe(true);
    expect(isExerciseAllowed(["treadmill"], commercial)).toBe(true);
  });

  it("full-gym allows everything", () => {
    expect(isExerciseAllowed(["barbell", "squat_rack", "ghd", "bike_air"], full)).toBe(true);
    expect(isExerciseAllowed(["dumbbell_heavy"], full)).toBe(true);
  });

  it("home-barbell hides machine-only lifts but allows barbell work", () => {
    expect(isExerciseAllowed(["barbell", "squat_rack"], home)).toBe(true);
    expect(isExerciseAllowed(["trap_bar"], home)).toBe(true);
    expect(isExerciseAllowed(["leg_press"], home)).toBe(false);
    expect(isExerciseAllowed(["lat_pulldown"], home)).toBe(false);
    expect(isExerciseAllowed(["cable_column"], home)).toBe(false);
  });

  it("bodyweight shows bodyweight + pullup/dip, hides everything else", () => {
    expect(isExerciseAllowed([], bw)).toBe(true);
    expect(isExerciseAllowed(["pullup_bar"], bw)).toBe(true);
    expect(isExerciseAllowed(["dip_station"], bw)).toBe(true);
    expect(isExerciseAllowed(["jump_rope"], bw)).toBe(true);
    expect(isExerciseAllowed(["barbell"], bw)).toBe(false);
    expect(isExerciseAllowed(["dumbbell_light"], bw)).toBe(false);
    expect(isExerciseAllowed(["leg_press"], bw)).toBe(false);
  });
});

describe("EQUIPMENT_PROFILES integrity", () => {
  it("contains an entry for every declared key", () => {
    for (const key of EQUIPMENT_PROFILE_KEYS) {
      expect(EQUIPMENT_PROFILES[key]).toBeDefined();
      expect(EQUIPMENT_PROFILES[key].key).toBe(key);
    }
  });

  it("has a non-empty label and description for every profile", () => {
    for (const key of EQUIPMENT_PROFILE_KEYS) {
      const p = EQUIPMENT_PROFILES[key];
      expect(p.label.length).toBeGreaterThan(0);
      expect(p.description.length).toBeGreaterThan(0);
    }
  });
});
