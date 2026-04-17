// Port of InjuryAdaptationEngine.swift.

import { regionsByIds, type BodyRegion } from "./bodyRegions";

export type RecoveryPhase =
  | "acute"
  | "rehab"
  | "light_load"
  | "return_to_play"
  | "resolved";

export type Injury = {
  id: string;
  name: string;
  location_ids: string[];
  recovery_phase: RecoveryPhase;
};

type EngineKey = BodyRegion["engineKey"];

type ContraindicationRule = {
  categories: readonly string[];
  keywords: readonly string[];
};

const CONTRAINDICATION_RULES: Record<EngineKey, ContraindicationRule> = {
  head: { categories: [], keywords: [] },
  neck: { categories: [], keywords: ["neck", "shrug"] },
  knee: {
    categories: ["Squat"],
    keywords: ["squat", "lunge", "leg press", "leg extension", "box jump", "jump"],
  },
  shoulder: {
    categories: ["Press", "Olympic Weightlifting"],
    keywords: ["press", "overhead", "bench", "push-up", "dip", "fly", "raise"],
  },
  chest: { categories: ["Press"], keywords: ["bench", "fly", "push-up"] },
  back: {
    categories: ["Hip Hinge"],
    keywords: ["deadlift", "good morning", "row", "back extension", "hyperextension"],
  },
  hip: {
    categories: [],
    keywords: ["hip thrust", "glute", "hamstring", "lunge", "step-up"],
  },
  wrist: {
    categories: ["Olympic Weightlifting"],
    keywords: ["clean", "snatch", "jerk", "front squat", "wrist"],
  },
  elbow: { categories: [], keywords: ["curl", "tricep", "extension", "press"] },
  ankle: { categories: [], keywords: ["calf", "jump", "run", "sprint", "box jump"] },
};

const CLINICAL_SYNONYMS: Record<string, EngineKey> = {
  acl: "knee",
  mcl: "knee",
  meniscus: "knee",
  patella: "knee",
  "rotator cuff": "shoulder",
  labrum: "shoulder",
  "frozen shoulder": "shoulder",
  lumbar: "back",
  "herniated disc": "back",
  sciatica: "back",
  "si joint": "hip",
  piriformis: "hip",
  "carpal tunnel": "wrist",
  "tennis elbow": "elbow",
  "golfers elbow": "elbow",
  achilles: "ankle",
  "plantar fascia": "ankle",
};

const REGRESSION_TABLE: Record<string, readonly string[]> = {
  "Back Squat": ["Goblet Squat", "Box Squat", "Air Squats"],
  "Front Squat": ["Goblet Squat", "Box Squat", "Air Squats"],
  "Flat Barbell Bench Press": ["Dumbbell Bench Press", "Push-Ups", "Floor Press"],
  "Incline Barbell Bench Press": ["Dumbbell Bench Press", "Push-Ups", "Floor Press"],
  "Strict Press": ["Lateral Raises", "Z-Press", "Seated Dumbbell Press"],
  "Push Press": ["Dumbbell Overhead Press", "Lateral Raises", "Arnold Press"],
  "Conventional Deadlift": ["Romanian Deadlift", "Trap Bar Deadlift", "Kettlebell Deadlift"],
  "Romanian Deadlift": ["Nordic Curl", "Glute Bridge", "Hip Thrust"],
  "Squat Snatch": ["Power Snatch", "Hang Snatch", "Overhead Squat"],
  "Squat Clean": ["Power Clean", "Hang Clean", "Front Squat"],
  "Power Clean": ["Hang Clean", "Kettlebell Deadlift", "Hip Thrust"],
  "Power Snatch": ["Hang Snatch", "Kettlebell Deadlift", "Hip Thrust"],
  "Clean and Jerk": ["Power Clean", "Push Press", "Front Squat"],
  "Split Jerk": ["Push Press", "Push Jerk", "Strict Press"],
  "Pull-Up": ["Lat Pulldown", "Band-Assisted Pull-Up", "TRX Row"],
  "Toes-to-Bar": ["Knees-to-Elbows", "Hanging Leg Raises", "Lying Leg Raises"],
  "Box Jump": ["Step-Up", "Box Step-Up", "Air Squats"],
  Burpee: ["Step-Up Burpee", "Squat Thrust", "Air Squat"],
};

const LOAD_MULTIPLIER: Record<RecoveryPhase, number> = {
  acute: 0.3,
  rehab: 0.5,
  light_load: 0.7,
  return_to_play: 0.85,
  resolved: 1.0,
};

function activeInjuries(injuries: readonly Injury[]): Injury[] {
  return injuries.filter((i) => i.recovery_phase !== "resolved");
}

export function isContraindicated(
  exerciseName: string,
  exerciseCategory: string | null,
  injuries: readonly Injury[],
): boolean {
  const active = activeInjuries(injuries);
  if (active.length === 0) return false;

  const lowerName = exerciseName.toLowerCase();

  for (const injury of active) {
    const regions = regionsByIds(injury.location_ids);
    for (const region of regions) {
      const synonym = CLINICAL_SYNONYMS[injury.name.toLowerCase()];
      const engineKey = synonym ?? region.engineKey;
      const rule = CONTRAINDICATION_RULES[engineKey];
      if (!rule) continue;

      if (
        exerciseCategory &&
        rule.categories.some((c) =>
          exerciseCategory.toLowerCase().includes(c.toLowerCase()),
        )
      ) {
        return true;
      }
      if (rule.keywords.some((k) => lowerName.includes(k.toLowerCase()))) {
        return true;
      }
    }
  }
  return false;
}

export function getRegressions(exerciseName: string): readonly string[] {
  const lower = exerciseName.toLowerCase();
  for (const [base, regressions] of Object.entries(REGRESSION_TABLE)) {
    const lb = base.toLowerCase();
    if (lower.includes(lb) || lb.includes(lower)) return regressions;
  }
  return [];
}

export function calculateLoadMultiplier(injuries: readonly Injury[]): number {
  const active = activeInjuries(injuries);
  if (active.length === 0) return 1.0;
  return Math.min(...active.map((i) => LOAD_MULTIPLIER[i.recovery_phase]));
}

export function getRecommendedExercises(injury: Injury): string[] {
  const regions = regionsByIds(injury.location_ids);
  const out = new Set<string>();
  for (const region of regions) {
    switch (region.engineKey) {
      case "knee":
        ["Box Squat", "Glute Bridge", "Hip Thrust", "Calf Raises"].forEach((e) => out.add(e));
        break;
      case "shoulder":
        ["Lateral Raises", "Front Raises", "Face Pulls", "Band Pull-Aparts"].forEach((e) =>
          out.add(e),
        );
        break;
      case "back":
        ["Bird Dog", "Cat-Cow", "Plank", "Side Plank"].forEach((e) => out.add(e));
        break;
      case "hip":
        ["Clamshells", "Fire Hydrants", "Glute Bridges", "Lateral Band Walks"].forEach((e) =>
          out.add(e),
        );
        break;
      case "wrist":
        ["Knuckle Push-Ups", "Ring Rows", "Farmer's Carries"].forEach((e) => out.add(e));
        break;
      case "elbow":
        ["Hammer Curls", "Reverse Curls", "Tricep Pushdowns (Light Band)"].forEach((e) =>
          out.add(e),
        );
        break;
      case "ankle":
        ["Ankle Circles", "Single-Leg Balance", "Calf Raises (Seated)"].forEach((e) =>
          out.add(e),
        );
        break;
    }
  }
  return [...out];
}
