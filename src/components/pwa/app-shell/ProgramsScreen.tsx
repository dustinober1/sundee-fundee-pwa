import type { FormEvent } from "react";
import type { ProgramsScreenExerciseRowModel, ProgramsScreenModel } from "./types";

function PlannedExerciseCard(props: { row: ProgramsScreenExerciseRowModel }) {
  const { row } = props;

  return (
    <div className="rounded-lg border border-border bg-cream p-4 shadow-[0_1px_0_rgba(13,26,64,0.06)]">
      <p className="text-sm font-bold text-navy">{row.exercise}</p>
      <p className="mt-2 text-sm text-muted">
        {row.sets} x {row.reps}
        {row.percentLabel ? ` ${row.percentLabel}` : ""}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-orange">
        {row.restLabel}
      </p>
    </div>
  );
}

export function ProgramsScreen(props: {
  model: ProgramsScreenModel;
  onPrimaryAction: () => void;
  onExercisePerformedWeightChange: (exerciseId: string, nextValue: string) => void;
  onExercisePerformedRepsChange: (exerciseId: string, nextValue: string) => void;
  onExercisePerformedUnitChange: (exerciseId: string, nextValue: "lb" | "kg") => void;
}) {
  const {
    model,
    onPrimaryAction,
    onExercisePerformedWeightChange,
    onExercisePerformedRepsChange,
    onExercisePerformedUnitChange,
  } = props;

  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-[0_18px_60px_rgba(13,26,64,0.08)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
            Program
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-balance">
            {model.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted text-pretty">
            {model.summary}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 lg:max-w-xs">
          <button
            type="submit"
            form="program-session"
            disabled={model.primaryActionDisabled}
            className="h-12 rounded-lg bg-navy px-4 text-sm font-semibold text-cream transition-transform active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {model.primaryActionLabel}
          </button>
          {model.primaryActionReason ? (
            <p className="text-xs leading-5 text-muted">{model.primaryActionReason}</p>
          ) : null}
          <p className="text-xs leading-5 text-muted">{model.completionNote}</p>
        </div>
      </div>

      {model.exercises ? (
        <form
          id="program-session"
          className="mt-6 grid gap-4"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onPrimaryAction();
          }}
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {model.exercises.map((row) => (
              <PlannedExerciseCard key={row.id} row={row} />
            ))}
          </div>

          <div className="rounded-lg border border-border bg-cream p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-navy">Performed sets</p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Enter what you actually hit today. Weight can be 0 for bodyweight movements.
                </p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                1 set per exercise
              </p>
            </div>

            <div className="mt-4 grid gap-4">
              {model.exercises.map((row) => (
                <fieldset key={row.id} className="rounded-lg border border-border bg-surface p-4">
                  <legend className="px-1 text-sm font-semibold text-navy">
                    {row.exercise}
                  </legend>

                  <div className="mt-3 grid gap-3 sm:grid-cols-[1.2fr_0.9fr_0.9fr]">
                    <label className="grid gap-1">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        {row.weightLabel}
                      </span>
                      <input
                        inputMode="decimal"
                        name={`${row.id}-weight`}
                        value={row.performedWeight}
                        onChange={(event) =>
                          onExercisePerformedWeightChange(row.id, event.target.value)
                        }
                        className="h-11 rounded-lg border border-border bg-cream px-3 text-sm font-semibold text-navy shadow-[inset_0_1px_0_rgba(13,26,64,0.04)]"
                        aria-invalid={!row.isValid}
                      />
                    </label>

                    <label className="grid gap-1">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        {row.repsLabel}
                      </span>
                      <input
                        inputMode="numeric"
                        name={`${row.id}-reps`}
                        value={row.performedReps}
                        onChange={(event) =>
                          onExercisePerformedRepsChange(row.id, event.target.value)
                        }
                        className="h-11 rounded-lg border border-border bg-cream px-3 text-sm font-semibold text-navy shadow-[inset_0_1px_0_rgba(13,26,64,0.04)]"
                        aria-invalid={!row.isValid}
                      />
                    </label>

                    <label className="grid gap-1">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        {row.unitLabel}
                      </span>
                      <select
                        name={`${row.id}-unit`}
                        value={row.performedUnit}
                        onChange={(event) =>
                          onExercisePerformedUnitChange(
                            row.id,
                            event.target.value === "kg" ? "kg" : "lb",
                          )
                        }
                        className="h-11 rounded-lg border border-border bg-cream px-3 text-sm font-semibold text-navy"
                      >
                        <option value="lb">lb</option>
                        <option value="kg">kg</option>
                      </select>
                    </label>
                  </div>

                  {row.helperText ? (
                    <p className="mt-2 text-xs leading-5 text-orange">{row.helperText}</p>
                  ) : null}
                </fieldset>
              ))}
            </div>
          </div>
        </form>
      ) : model.primaryActionLabel === "Enroll" ? (
        <p className="mt-6 text-sm leading-6 text-muted" aria-live="polite">
          {model.enrollPendingLabel}
        </p>
      ) : null}
    </section>
  );
}
