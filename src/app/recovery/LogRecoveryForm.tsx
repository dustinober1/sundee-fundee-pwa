"use client";

import { useActionState } from "react";
import { logRecoveryEntry, type RecoveryEntryState } from "./actions";

export function LogRecoveryForm() {
  const [state, action, pending] = useActionState<
    RecoveryEntryState | undefined,
    FormData
  >(logRecoveryEntry, undefined);

  return (
    <form action={action} className="mt-3 grid gap-3 sm:grid-cols-2">
      <label className="sm:col-span-2 text-sm">
        <span className="block font-medium text-navy">Date</span>
        <input
          name="performed_on"
          type="date"
          required
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
      </label>

      <label className="text-sm">
        <span className="block font-medium text-navy">HRV (ms)</span>
        <input
          name="hrv_ms"
          type="number"
          step="0.1"
          min="0"
          max="300"
          placeholder="e.g., 65"
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
      </label>

      <label className="text-sm">
        <span className="block font-medium text-navy">Sleep (hours)</span>
        <input
          name="sleep_hours"
          type="number"
          step="0.1"
          min="0"
          max="16"
          placeholder="e.g., 7.5"
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
      </label>

      <label className="text-sm">
        <span className="block font-medium text-navy">Pain intensity (1–10)</span>
        <input
          name="pain_intensity"
          type="number"
          min="1"
          max="10"
          placeholder="optional"
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
      </label>

      <label className="text-sm">
        <span className="block font-medium text-navy">Notes</span>
        <input
          name="notes"
          maxLength={500}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
      </label>

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
        {pending ? "Saving…" : "Save & score"}
      </button>
    </form>
  );
}
