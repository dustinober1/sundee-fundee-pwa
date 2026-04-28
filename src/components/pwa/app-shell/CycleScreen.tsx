import type { FormEvent } from "react";
import type { CycleScreenModel } from "./types";

export function CycleScreen(props: {
  model: CycleScreenModel;
  periodStartedOn: string;
  busy: boolean;
  onPeriodStartedOnChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const { model, periodStartedOn, busy, onPeriodStartedOnChange, onSubmit } = props;

  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
        Cycle context
      </p>
      <h2 className="font-display mt-3 text-3xl font-semibold">{model.title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{model.summary}</p>
      {model.trainingFocus ? (
        <p className="mt-3 text-sm font-semibold text-orange">
          {model.trainingFocus}
        </p>
      ) : null}
      <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:max-w-md">
        <label className="grid gap-1 text-sm font-semibold">
          Period start
          <input
            type="date"
            value={periodStartedOn}
            onChange={(event) => onPeriodStartedOnChange(event.target.value)}
            className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="h-12 rounded-lg bg-navy px-4 text-sm font-semibold text-cream disabled:opacity-60"
        >
          Save start
        </button>
      </form>
    </section>
  );
}
