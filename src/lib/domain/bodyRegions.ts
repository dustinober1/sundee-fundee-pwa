// Port of BodyLocation.swift / BodyRegions.

export type BodyRegion = {
  id: string;
  displayName: string;
  engineKey:
    | "head"
    | "neck"
    | "shoulder"
    | "chest"
    | "back"
    | "elbow"
    | "wrist"
    | "hip"
    | "knee"
    | "ankle";
};

export const BODY_REGIONS: readonly BodyRegion[] = [
  { id: "head", displayName: "Head", engineKey: "head" },
  { id: "neck", displayName: "Neck", engineKey: "neck" },
  { id: "shoulder_left", displayName: "Left Shoulder", engineKey: "shoulder" },
  { id: "shoulder_right", displayName: "Right Shoulder", engineKey: "shoulder" },
  { id: "chest", displayName: "Chest", engineKey: "chest" },
  { id: "upper_back", displayName: "Upper Back", engineKey: "back" },
  { id: "lower_back", displayName: "Lower Back", engineKey: "back" },
  { id: "elbow_left", displayName: "Left Elbow", engineKey: "elbow" },
  { id: "elbow_right", displayName: "Right Elbow", engineKey: "elbow" },
  { id: "wrist_left", displayName: "Left Wrist", engineKey: "wrist" },
  { id: "wrist_right", displayName: "Right Wrist", engineKey: "wrist" },
  { id: "hip_left", displayName: "Left Hip", engineKey: "hip" },
  { id: "hip_right", displayName: "Right Hip", engineKey: "hip" },
  { id: "knee_left", displayName: "Left Knee", engineKey: "knee" },
  { id: "knee_right", displayName: "Right Knee", engineKey: "knee" },
  { id: "ankle_left", displayName: "Left Ankle", engineKey: "ankle" },
  { id: "ankle_right", displayName: "Right Ankle", engineKey: "ankle" },
];

const REGION_MAP: Record<string, BodyRegion> = Object.fromEntries(
  BODY_REGIONS.map((r) => [r.id, r]),
);

export function regionsByIds(ids: readonly string[]): BodyRegion[] {
  return ids.map((id) => REGION_MAP[id]).filter(Boolean);
}
