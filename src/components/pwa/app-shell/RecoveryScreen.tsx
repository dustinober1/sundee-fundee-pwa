import type { FormEvent } from "react";
import type { RecoveryScreenModel } from "./types";

export function RecoveryScreen(props: {
  model: RecoveryScreenModel;
  sleepHours: string;
  soreness: string;
  stress: string;
  busy: boolean;
  onSleepHoursChange: (value: string) => void;
  onSorenessChange: (value: string) => void;
  onStressChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const {
    model,
    sleepHours,
    soreness,
    stress,
    busy,
    onSleepHoursChange,
    onSorenessChange,
    onStressChange,
    onSubmit,
  } = props;

  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
        Recovery
      </p>
      <h2 className="font-display mt-3 text-3xl font-semibold">{model.title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{model.summary}</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:max-w-lg">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1 text-sm font-semibold">
            Sleep
            <input
              type="number"
              min="0"
              max="14"
              step="0.5"
              value={sleepHours}
              onChange={(event) => onSleepHoursChange(event.target.value)}
              className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Sore
            <input
              type="number"
              min="0"
              max="10"
              value={soreness}
              onChange={(event) => onSorenessChange(event.target.value)}
              className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Stress
            <input
              type="number"
              min="0"
              max="10"
              value={stress}
              onChange={(event) => onStressChange(event.target.value)}
              className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="h-12 rounded-lg bg-navy px-4 text-sm font-semibold text-cream disabled:opacity-60"
        >
          Save recovery
        </button>
      </form>
    </section>
  );
}
