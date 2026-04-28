import type { ProgramsScreenModel } from "./types";

export function ProgramsScreen(props: {
  model: ProgramsScreenModel;
  onPrimaryAction: () => void;
}) {
  const { model, onPrimaryAction } = props;

  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
            Program
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold">{model.title}</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{model.summary}</p>
        </div>
        <button
          type="button"
          disabled={model.buttonDisabled}
          onClick={onPrimaryAction}
          className="h-12 rounded-lg bg-navy px-4 text-sm font-semibold text-cream disabled:opacity-60"
        >
          {model.buttonLabel}
        </button>
      </div>

      {model.exercises ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {model.exercises.map((exercise) => (
            <div
              key={exercise.exercise}
              className="rounded-lg border border-border bg-cream p-4"
            >
              <p className="text-sm font-bold text-navy">{exercise.exercise}</p>
              <p className="mt-2 text-sm text-muted">
                {exercise.sets} x {exercise.reps}
                {exercise.percentLabel ? ` ${exercise.percentLabel}` : ""}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-orange">
                {exercise.restLabel}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
