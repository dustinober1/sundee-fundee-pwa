// Equipment profile presets. The DB stores a string key on user_profiles.equipment_profile;
// the allow-lists below are resolved here so they can evolve without a migration.
// An exercise is shown when its equipment[] is a subset of the profile's allowed set.

export const EQUIPMENT_TAGS = [
  "barbell",
  "safety_bar",
  "trap_bar",
  "dumbbell_light",
  "dumbbell_heavy",
  "kettlebell",
  "squat_rack",
  "smith_machine",
  "bench_flat",
  "bench_adjustable",
  "cable_column",
  "lat_pulldown",
  "seated_row_machine",
  "chest_press_machine",
  "shoulder_press_machine",
  "leg_press",
  "hack_squat_machine",
  "leg_curl_machine",
  "leg_extension_machine",
  "pec_deck",
  "rear_delt_machine",
  "assisted_pullup_machine",
  "preacher_curl_bench",
  "calf_raise_machine",
  "abductor_adductor_machine",
  "pullup_bar",
  "dip_station",
  "plyo_box",
  "medicine_ball",
  "wall_ball_target",
  "ghd",
  "jump_rope",
  "treadmill",
  "rower",
  "bike_stationary",
  "bike_air",
  "stair_climber",
  "elliptical",
  "ski_erg",
] as const;

export type EquipmentTag = (typeof EQUIPMENT_TAGS)[number];

export const EQUIPMENT_PROFILE_KEYS = [
  "commercial_gym",
  "full_gym",
  "home_barbell",
  "home_dumbbell",
  "bodyweight",
] as const;

export type EquipmentProfileKey = (typeof EQUIPMENT_PROFILE_KEYS)[number];

export type EquipmentProfile = {
  key: EquipmentProfileKey;
  label: string;
  description: string;
  allowed: ReadonlySet<EquipmentTag>;
};

const tags = (...t: EquipmentTag[]) => new Set(t);

// Typical big-box commercial gym: lots of machines, dumbbells up to ~50 lb,
// cables, smith machine, cardio. No free-weight platform, no heavy dumbbells.
const COMMERCIAL_GYM_ALLOWED: ReadonlySet<EquipmentTag> = tags(
  "dumbbell_light",
  "kettlebell",
  "smith_machine",
  "bench_flat",
  "bench_adjustable",
  "cable_column",
  "lat_pulldown",
  "seated_row_machine",
  "chest_press_machine",
  "shoulder_press_machine",
  "leg_press",
  "hack_squat_machine",
  "leg_curl_machine",
  "leg_extension_machine",
  "pec_deck",
  "rear_delt_machine",
  "assisted_pullup_machine",
  "preacher_curl_bench",
  "calf_raise_machine",
  "abductor_adductor_machine",
  "pullup_bar",
  "dip_station",
  "medicine_ball",
  "jump_rope",
  "treadmill",
  "rower",
  "bike_stationary",
  "elliptical",
  "stair_climber",
);

const FULL_GYM_ALLOWED: ReadonlySet<EquipmentTag> = new Set(EQUIPMENT_TAGS);

const HOME_BARBELL_ALLOWED: ReadonlySet<EquipmentTag> = tags(
  "barbell",
  "safety_bar",
  "trap_bar",
  "squat_rack",
  "bench_flat",
  "bench_adjustable",
  "dumbbell_light",
  "dumbbell_heavy",
  "kettlebell",
  "pullup_bar",
  "plyo_box",
  "medicine_ball",
  "jump_rope",
);

const HOME_DUMBBELL_ALLOWED: ReadonlySet<EquipmentTag> = tags(
  "dumbbell_light",
  "dumbbell_heavy",
  "bench_flat",
  "bench_adjustable",
  "kettlebell",
  "pullup_bar",
  "jump_rope",
);

const BODYWEIGHT_ALLOWED: ReadonlySet<EquipmentTag> = tags(
  "pullup_bar",
  "dip_station",
  "jump_rope",
);

export const EQUIPMENT_PROFILES: Record<EquipmentProfileKey, EquipmentProfile> = {
  commercial_gym: {
    key: "commercial_gym",
    label: "Commercial gym",
    description:
      "Standard machines, cables, smith machine, and dumbbells up to ~50 lb. We'll hide exercises that need a squat rack or barbell.",
    allowed: COMMERCIAL_GYM_ALLOWED,
  },
  full_gym: {
    key: "full_gym",
    label: "Full gym",
    description:
      "Everything — barbells, racks, platforms, machines, cables, heavy dumbbells.",
    allowed: FULL_GYM_ALLOWED,
  },
  home_barbell: {
    key: "home_barbell",
    label: "Home gym (barbell)",
    description: "Barbell, rack, bench, plates, and dumbbells. No machines or cables.",
    allowed: HOME_BARBELL_ALLOWED,
  },
  home_dumbbell: {
    key: "home_dumbbell",
    label: "Home gym (dumbbells)",
    description: "Dumbbells and a bench — no barbell or machines.",
    allowed: HOME_DUMBBELL_ALLOWED,
  },
  bodyweight: {
    key: "bodyweight",
    label: "Bodyweight / travel",
    description: "Minimal equipment — pull-up bar, dip station, jump rope.",
    allowed: BODYWEIGHT_ALLOWED,
  },
};

export function isEquipmentProfileKey(value: unknown): value is EquipmentProfileKey {
  return (
    typeof value === "string" &&
    (EQUIPMENT_PROFILE_KEYS as readonly string[]).includes(value)
  );
}

export function getEquipmentProfile(
  key: string | null | undefined,
): EquipmentProfile | null {
  if (!key || !isEquipmentProfileKey(key)) return null;
  return EQUIPMENT_PROFILES[key];
}

// True when every tag in `required` is in `allowed` — the subset check used
// to decide whether to show an exercise. Empty `required` is always allowed.
export function isExerciseAllowed(
  required: readonly string[],
  profile: EquipmentProfile | null,
): boolean {
  if (!profile) return true;
  for (const tag of required) {
    if (!profile.allowed.has(tag as EquipmentTag)) return false;
  }
  return true;
}

// Human-readable short label for an equipment tag — used in UI badges.
const TAG_LABELS: Record<EquipmentTag, string> = {
  barbell: "barbell",
  safety_bar: "safety bar",
  trap_bar: "trap bar",
  dumbbell_light: "dumbbell",
  dumbbell_heavy: "heavy db",
  kettlebell: "kettlebell",
  squat_rack: "rack",
  smith_machine: "smith",
  bench_flat: "bench",
  bench_adjustable: "adj. bench",
  cable_column: "cable",
  lat_pulldown: "lat pulldown",
  seated_row_machine: "seated row",
  chest_press_machine: "chest press",
  shoulder_press_machine: "shoulder press",
  leg_press: "leg press",
  hack_squat_machine: "hack squat",
  leg_curl_machine: "leg curl",
  leg_extension_machine: "leg ext.",
  pec_deck: "pec deck",
  rear_delt_machine: "rear delt",
  assisted_pullup_machine: "assisted pull-up",
  preacher_curl_bench: "preacher",
  calf_raise_machine: "calf raise",
  abductor_adductor_machine: "ab/adductor",
  pullup_bar: "pull-up bar",
  dip_station: "dip station",
  plyo_box: "plyo box",
  medicine_ball: "med ball",
  wall_ball_target: "wall target",
  ghd: "ghd",
  jump_rope: "jump rope",
  treadmill: "treadmill",
  rower: "rower",
  bike_stationary: "bike",
  bike_air: "air bike",
  stair_climber: "stair climber",
  elliptical: "elliptical",
  ski_erg: "ski erg",
};

export function equipmentTagLabel(tag: string): string {
  return TAG_LABELS[tag as EquipmentTag] ?? tag;
}
