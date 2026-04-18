"use client";

import { useOfflineAction } from "@/lib/offline/useOfflineAction";
import type { ExerciseRow } from "@/features/exercises/queries";
import type { WeightUnit } from "@/lib/supabase/types";
import { addOneRepMax, type AddMaxState } from "./actions";

const CATEGORY_LABEL: Record<NonNullable<ExerciseRow["weightlifting_category"]>, string> = {
  squat: "Squat",
  hip_hinge: "Hip Hinge",
  press: "Press",
  pull: "Pull",
  carry: "Carry",
  olympic_weightlifting: "Olympic",
};

export function AddMaxForm({
  exercises,
  defaultUnit,
}: {
  exercises: ExerciseRow[];
  defaultUnit: WeightUnit;
}) {
  const [status, action, pending] = useOfflineAction<AddMaxState | undefined>({
    kind: "addOneRepMax",
    action: addOneRepMax,
  });
  const state =
    status.kind === "ok" ? (status.state as AddMaxState | undefined) : undefined;
  const queued = status.kind === "queued";

  const grouped = exercises.reduce<Record<string, ExerciseRow[]>>((acc, ex) => {
    const key = ex.weightlifting_category
      ? CATEGORY_LABEL[ex.weightlifting_category]
      : "Other";
    (acc[key] ??= []).push(ex);
    return acc;
  }, {});

  return (
    <form action={action} className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="sm:col-span-2 text-sm">
        <span className="block font-medium text-navy">Exercise</span>
        <select
          name="exercise_id"
          required
          defaultValue=""
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        >
          <option value="" disabled>
            Pick a lift…
          </option>
          {Object.entries(grouped).map(([cat, items]) => (
            <optgroup key={cat} label={cat}>
              {items.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {state?.errors?.exercise_id ? (
          <span className="mt-1 block text-xs text-recovery-risk">
            {state.errors.exercise_id[0]}
          </span>
        ) : null}
      </label>

      <label className="text-sm">
        <span className="block font-medium text-navy">Weight</span>
        <input
          name="weight"
          type="number"
          step="0.5"
          min="0"
          required
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
        {state?.errors?.weight ? (
          <span className="mt-1 block text-xs text-recovery-risk">
            {state.errors.weight[0]}
          </span>
        ) : null}
      </label>

      <label className="text-sm">
        <span className="block font-medium text-navy">Reps</span>
        <input
          name="reps"
          type="number"
          min="1"
          max="20"
          defaultValue={1}
          required
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
        <span className="mt-1 block text-xs text-muted">
          More than 1 rep — we&apos;ll estimate the 1RM (Epley).
        </span>
      </label>

      <label className="text-sm">
        <span className="block font-medium text-navy">Unit</span>
        <select
          name="unit"
          defaultValue={defaultUnit}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        >
          <option value="lb">Pounds</option>
          <option value="kg">Kilograms</option>
        </select>
      </label>

      <label className="text-sm">
        <span className="block font-medium text-navy">Date</span>
        <input
          name="performed_on"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
      </label>

      <label className="sm:col-span-2 text-sm">
        <span className="block font-medium text-navy">Notes</span>
        <input
          name="notes"
          maxLength={280}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
      </label>

      {state?.message ? (
        <p className="sm:col-span-2 rounded-lg border border-recovery-risk/40 bg-recovery-risk/10 p-3 text-sm text-recovery-risk">
          {state.message}
        </p>
      ) : null}
      {queued ? (
        <p className="sm:col-span-2 rounded-lg border border-gold/40 bg-gold/10 p-3 text-sm text-navy">
          Queued for sync — we&apos;ll upload this when you&apos;re back online.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="sm:col-span-2 flex h-12 items-center justify-center rounded-lg bg-orange font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Add"}
      </button>
    </form>
  );
}
