import type { FormEvent } from "react";
import type { LogScreenModel } from "./types";

export function LogScreen(props: {
  model: LogScreenModel;
  exerciseName: string;
  weight: string;
  reps: string;
  unit: "lb" | "kg";
  busy: boolean;
  onExerciseNameChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onRepsChange: (value: string) => void;
  onUnitChange: (value: "lb" | "kg") => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const {
    model,
    exerciseName,
    weight,
    reps,
    unit,
    busy,
    onExerciseNameChange,
    onWeightChange,
    onRepsChange,
    onUnitChange,
    onSubmit,
  } = props;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              Lift log
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold">
              {model.estimateLabel}
            </h2>
          </div>
          {model.platesLabel ? (
            <div className="rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-cream">
              {model.platesLabel}
            </div>
          ) : null}
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm font-semibold">
            Exercise
            <input
              value={exerciseName}
              onChange={(event) => onExerciseNameChange(event.target.value)}
              className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-sm font-semibold">
              Weight
              <input
                type="number"
                min="0"
                step="0.5"
                value={weight}
                onChange={(event) => onWeightChange(event.target.value)}
                className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Reps
              <input
                type="number"
                min="1"
                value={reps}
                onChange={(event) => onRepsChange(event.target.value)}
                className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Unit
              <select
                value={unit}
                onChange={(event) => onUnitChange(event.target.value as "lb" | "kg")}
                className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
              >
                <option value="lb">lb</option>
                <option value="kg">kg</option>
              </select>
            </label>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="h-12 rounded-lg bg-navy px-4 text-sm font-semibold text-cream disabled:opacity-60"
          >
            Save set
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
          Best lift
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold">
          {model.bestLiftTitle}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">{model.bestLiftSummary}</p>
      </section>
    </div>
  );
}
