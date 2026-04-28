export type WeightUnit = "lb" | "kg";

const LBS_TO_KG = 0.453592;

export type Plate = {
  weight: number;
  count: number;
};

export const STANDARD_LB_PLATES = [45, 35, 25, 10, 5, 2.5] as const;

export function estimatedOneRepMax(weight: number, reps: number) {
  if (reps <= 1 || weight <= 0) return null;
  return weight * (1 + reps / 30);
}

export function lbsToKg(lbs: number) {
  return lbs * LBS_TO_KG;
}

export function kgToLbs(kg: number) {
  return kg / LBS_TO_KG;
}

export function roundWeight(weight: number) {
  return Math.round(weight * 10) / 10;
}

export function calculatePlates(targetWeight: number, barWeight = 45): Plate[] {
  if (targetWeight <= barWeight) return [];

  let remaining = (targetWeight - barWeight) / 2;
  const plates: Plate[] = [];

  for (const plateSize of STANDARD_LB_PLATES) {
    const count = Math.floor(remaining / plateSize);
    if (count > 0) {
      plates.push({ weight: plateSize, count });
      remaining -= count * plateSize;
    }

    if (remaining < 2.4) break;
  }

  return plates;
}
