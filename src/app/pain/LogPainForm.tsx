"use client";

import { useOfflineAction } from "@/lib/offline/useOfflineAction";
import type { BodyRegion } from "@/lib/domain/bodyRegions";
import { logPain, type LogPainState } from "./actions";

const PAIN_TYPES = [
  "acute",
  "chronic",
  "soreness",
  "stiffness",
  "sharp",
  "dull",
  "aching",
  "other",
] as const;

export function LogPainForm({ regions }: { regions: readonly BodyRegion[] }) {
  const [status, action, pending] = useOfflineAction<LogPainState | undefined>({
    kind: "logPain",
    action: logPain,
  });
  const state =
    status.kind === "ok" ? (status.state as LogPainState | undefined) : undefined;
  const queued = status.kind === "queued";

  return (
    <form action={action} className="mt-3 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
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
          <span className="block font-medium text-navy">Intensity (1–10)</span>
          <input
            name="intensity"
            type="number"
            min="1"
            max="10"
            required
            defaultValue={3}
            className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="block font-medium text-navy">Type</span>
          <select
            name="pain_type"
            defaultValue="soreness"
            className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
          >
            {PAIN_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="text-sm">
        <legend className="font-medium text-navy">Locations</legend>
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
        <span className="block font-medium text-navy">Notes</span>
        <input
          name="notes"
          maxLength={500}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
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
        className="flex w-full h-12 items-center justify-center rounded-lg bg-orange font-medium text-cream hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Log pain"}
      </button>
    </form>
  );
}
