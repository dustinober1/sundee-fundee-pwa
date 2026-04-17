"use client";

import { useActionState } from "react";
import type { BodyRegion } from "@/lib/domain/bodyRegions";
import { createInjury, type CreateInjuryState } from "./actions";

const PHASES = [
  { value: "acute", label: "Acute" },
  { value: "rehab", label: "Rehab" },
  { value: "light_load", label: "Light Load" },
  { value: "return_to_play", label: "Return to Play" },
  { value: "resolved", label: "Resolved" },
] as const;

export function CreateInjuryForm({ regions }: { regions: readonly BodyRegion[] }) {
  const [state, action, pending] = useActionState<
    CreateInjuryState | undefined,
    FormData
  >(createInjury, undefined);

  return (
    <form action={action} className="mt-3 space-y-4">
      <label className="block text-sm">
        <span className="block font-medium text-navy">Name</span>
        <input
          name="name"
          required
          maxLength={120}
          placeholder="e.g., Right knee strain"
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
      </label>

      <fieldset className="text-sm">
        <legend className="font-medium text-navy">Body locations</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {regions.map((r) => (
            <label
              key={r.id}
              className="flex items-center gap-2 rounded-xl border border-border bg-cream p-2 has-[:checked]:border-navy"
            >
              <input
                type="checkbox"
                name="location_ids"
                value={r.id}
                className="h-4 w-4 accent-navy"
              />
              <span>{r.displayName}</span>
            </label>
          ))}
        </div>
        {state?.errors?.location_ids ? (
          <p className="mt-1 text-xs text-recovery-risk">
            {state.errors.location_ids[0]}
          </p>
        ) : null}
      </fieldset>

      <label className="block text-sm">
        <span className="block font-medium text-navy">Recovery phase</span>
        <select
          name="recovery_phase"
          defaultValue="acute"
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        >
          {PHASES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="block font-medium text-navy">Notes</span>
        <textarea
          name="notes"
          rows={2}
          maxLength={500}
          className="mt-1 block w-full rounded-xl border border-border bg-cream p-3 focus:border-navy focus:outline-none"
        />
      </label>

      {state?.message ? (
        <p className="rounded-lg border border-recovery-risk/40 bg-recovery-risk/10 p-3 text-sm text-recovery-risk">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full h-12 items-center justify-center rounded-lg bg-orange font-medium text-cream hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Add"}
      </button>
    </form>
  );
}
