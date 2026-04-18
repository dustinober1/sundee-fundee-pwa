"use client";

import { useMemo, useState } from "react";
import {
  equipmentTagLabel,
  getEquipmentProfile,
  isExerciseAllowed,
} from "@/lib/domain/equipmentProfiles";
import { addExerciseToWorkout } from "../actions";

type Exercise = {
  id: string;
  name: string;
  kind: "weightlifting" | "conditioning";
  weightlifting_category:
    | "squat"
    | "hip_hinge"
    | "press"
    | "pull"
    | "carry"
    | "olympic_weightlifting"
    | null;
  equipment: string[];
};

type GroupKey =
  | "squat"
  | "hip_hinge"
  | "press"
  | "pull"
  | "carry"
  | "olympic_weightlifting"
  | "conditioning";

const GROUP_LABEL: Record<GroupKey, string> = {
  squat: "Squat",
  hip_hinge: "Hip hinge",
  press: "Press",
  pull: "Pull",
  carry: "Carry",
  olympic_weightlifting: "Olympic",
  conditioning: "Conditioning",
};

const GROUP_ORDER: GroupKey[] = [
  "squat",
  "hip_hinge",
  "press",
  "pull",
  "carry",
  "olympic_weightlifting",
  "conditioning",
];

export function ExercisePicker({
  workoutId,
  exercises,
  profileKey,
}: {
  workoutId: string;
  exercises: Exercise[];
  profileKey: string | null;
}) {
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const profile = useMemo(
    () => (showAll ? null : getEquipmentProfile(profileKey)),
    [profileKey, showAll],
  );
  const profileMeta = profileKey ? getEquipmentProfile(profileKey) : null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((e) => {
      if (!isExerciseAllowed(e.equipment, profile)) return false;
      if (q && !e.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [exercises, profile, query]);

  const grouped = useMemo(() => {
    const out = new Map<GroupKey, Exercise[]>();
    for (const e of filtered) {
      const key: GroupKey =
        e.kind === "conditioning"
          ? "conditioning"
          : (e.weightlifting_category ?? "conditioning");
      const list = out.get(key) ?? [];
      list.push(e);
      out.set(key, list);
    }
    return out;
  }, [filtered]);

  const hiddenCount = exercises.length - filtered.length;

  return (
    <form action={addExerciseToWorkout} className="mt-3 space-y-3">
      <input type="hidden" name="workout_id" value={workoutId} />
      <input
        type="hidden"
        name="exercise_id"
        value={selectedId ?? ""}
        required
      />

      <div className="flex items-center justify-between gap-3">
        <input
          type="search"
          placeholder="Search exercises…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 flex-1 rounded-lg border border-border bg-cream px-3 text-sm focus:border-navy focus:outline-none"
        />
        {profileMeta ? (
          <label className="flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              className="h-4 w-4 accent-navy"
            />
            Show all
          </label>
        ) : null}
      </div>

      {profileMeta && !showAll ? (
        <p className="text-xs text-muted">
          Filtered to <span className="font-medium">{profileMeta.label}</span>
          {hiddenCount > 0 ? ` — ${hiddenCount} hidden` : ""}.
        </p>
      ) : null}

      <div className="max-h-96 overflow-y-auto rounded-xl border border-border bg-cream">
        {GROUP_ORDER.map((key) => {
          const list = grouped.get(key);
          if (!list || list.length === 0) return null;
          return (
            <section key={key} className="border-b border-border last:border-0">
              <header className="sticky top-0 bg-cream px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted">
                {GROUP_LABEL[key]}
              </header>
              <ul>
                {list.map((e) => {
                  const active = selectedId === e.id;
                  return (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(e.id)}
                        className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm ${
                          active ? "bg-navy/10" : "hover:bg-surface"
                        }`}
                      >
                        <span className="flex-1">{e.name}</span>
                        <span className="flex flex-wrap justify-end gap-1">
                          {e.equipment.length === 0 ? (
                            <Badge>bodyweight</Badge>
                          ) : (
                            e.equipment.map((t) => (
                              <Badge key={t}>{equipmentTagLabel(t)}</Badge>
                            ))
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
        {filtered.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted">
            No exercises match your filter.
            {profileMeta && !showAll
              ? ' Try "Show all" if you\'re at a different gym today.'
              : ""}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={!selectedId}
        className="h-12 w-full rounded-lg bg-orange text-sm font-medium text-cream hover:opacity-90 disabled:opacity-40"
      >
        {selectedId
          ? `Add ${exercises.find((e) => e.id === selectedId)?.name ?? ""}`
          : "Pick an exercise"}
      </button>
    </form>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted">
      {children}
    </span>
  );
}
