"use client";

import { useOfflineAction } from "@/lib/offline/useOfflineAction";
import { createWorkout, type CreateWorkoutState } from "../actions";

export function NewWorkoutForm() {
  const [status, action, pending] = useOfflineAction<CreateWorkoutState | undefined>({
    kind: "createWorkout",
    action: createWorkout,
  });
  const state =
    status.kind === "ok" ? (status.state as CreateWorkoutState | undefined) : undefined;
  const queued = status.kind === "queued";

  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="block text-sm">
        <span className="block font-medium text-navy">Date</span>
        <input
          name="performed_on"
          type="date"
          required
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-surface px-3 focus:border-navy focus:outline-none"
        />
        {state?.errors?.performed_on ? (
          <span className="mt-1 block text-xs text-recovery-risk">
            {state.errors.performed_on[0]}
          </span>
        ) : null}
      </label>

      <label className="block text-sm">
        <span className="block font-medium text-navy">Name (optional)</span>
        <input
          name="name"
          maxLength={120}
          placeholder="Lower body — heavy"
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-surface px-3 focus:border-navy focus:outline-none"
        />
      </label>

      <label className="block text-sm">
        <span className="block font-medium text-navy">Notes (optional)</span>
        <textarea
          name="notes"
          rows={3}
          maxLength={2000}
          className="mt-1 block w-full rounded-xl border border-border bg-surface p-3 focus:border-navy focus:outline-none"
        />
      </label>

      {state?.message ? (
        <p className="rounded-lg border border-recovery-risk/40 bg-recovery-risk/10 p-3 text-sm text-recovery-risk">
          {state.message}
        </p>
      ) : null}
      {queued ? (
        <p className="rounded-lg border border-gold/40 bg-gold/10 p-3 text-sm text-navy">
          Queued for sync — we&apos;ll upload this when you&apos;re back online.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full h-12 items-center justify-center rounded-lg bg-orange font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create workout"}
      </button>
    </form>
  );
}
