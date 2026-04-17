"use client";

import { useActionState, useState } from "react";
import type { ExerciseRow } from "@/features/exercises/queries";
import { createChallenge, type CreateChallengeState } from "./actions";

type ChallengeType = "lifetime_volume" | "exercise_volume" | "custom";

export function CreateChallengeForm({ exercises }: { exercises: ExerciseRow[] }) {
  const [type, setType] = useState<ChallengeType>("lifetime_volume");
  const [exerciseId, setExerciseId] = useState("");
  const [state, action, pending] = useActionState<
    CreateChallengeState | undefined,
    FormData
  >(createChallenge, undefined);

  const exerciseName = exercises.find((e) => e.id === exerciseId)?.name ?? "";

  return (
    <form action={action} className="mt-3 grid gap-3 sm:grid-cols-2">
      <label className="sm:col-span-2 text-sm">
        <span className="block font-medium text-navy">Type</span>
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as ChallengeType)}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        >
          <option value="lifetime_volume">Lifetime volume (Bronze/Silver/Gold)</option>
          <option value="exercise_volume">Per-exercise volume</option>
          <option value="custom">Custom (single goal)</option>
        </select>
      </label>

      <label className="sm:col-span-2 text-sm">
        <span className="block font-medium text-navy">Title</span>
        <input
          name="title"
          required
          maxLength={120}
          placeholder="e.g., Lifetime Volume"
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
      </label>

      {type === "exercise_volume" ? (
        <label className="sm:col-span-2 text-sm">
          <span className="block font-medium text-navy">Exercise</span>
          <select
            name="exercise_id"
            required
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
            className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
          >
            <option value="" disabled>
              Pick an exercise…
            </option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
          <input type="hidden" name="exercise_name" value={exerciseName} />
        </label>
      ) : null}

      {type === "custom" ? (
        <>
          <label className="text-sm">
            <span className="block font-medium text-navy">Target volume (lb)</span>
            <input
              name="target_volume_lbs"
              type="number"
              step="100"
              min="1"
              required
              className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
            />
          </label>
          <label className="text-sm">
            <span className="block font-medium text-navy">End date (optional)</span>
            <input
              name="challenge_end_date"
              type="date"
              className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
            />
          </label>
        </>
      ) : null}

      {state?.message ? (
        <p className="sm:col-span-2 rounded-lg border border-recovery-risk/40 bg-recovery-risk/10 p-3 text-sm text-recovery-risk">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="sm:col-span-2 flex h-12 items-center justify-center rounded-lg bg-orange font-medium text-cream hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create challenge"}
      </button>
    </form>
  );
}
