import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { listExercises } from "@/features/exercises/queries";
import { getWorkout } from "@/features/workouts/queries";
import {
  addExerciseToWorkout,
  addSetToExercise,
  completeWorkout,
  deleteSet,
  deleteWorkout,
  deleteWorkoutExercise,
} from "../actions";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type Params = Promise<{ id: string }>;

export default async function WorkoutDetailPage({ params }: { params: Params }) {
  await requireOnboardedProfile();
  const { id } = await params;
  const [workout, exercises] = await Promise.all([
    getWorkout(id),
    listExercises(),
  ]);
  if (!workout) notFound();

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/workouts"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Workouts
        </Link>

        <header className="mt-3">
          <h1 className="font-display text-4xl font-semibold">
            {workout.name?.trim() || "Workout"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {formatDate(workout.performed_on)}
            {workout.completed_at ? " · Completed" : " · In progress"}
          </p>
          {workout.notes ? (
            <p className="mt-3 text-sm text-navy/80 whitespace-pre-wrap">
              {workout.notes}
            </p>
          ) : null}
        </header>

        <section className="mt-8 space-y-4">
          {workout.exercises.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
              No exercises yet — add one below.
            </p>
          ) : (
            workout.exercises.map((we) => (
              <article
                key={we.id}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <header className="flex items-baseline justify-between">
                  <h2 className="font-display text-lg font-semibold">
                    {we.exercise_name}
                  </h2>
                  <form action={deleteWorkoutExercise}>
                    <input type="hidden" name="id" value={we.id} />
                    <input type="hidden" name="workout_id" value={workout.id} />
                    <button
                      type="submit"
                      className="text-xs text-muted hover:underline"
                    >
                      Remove
                    </button>
                  </form>
                </header>

                {we.sets.length > 0 ? (
                  <ul className="mt-3 space-y-1 text-sm font-mono">
                    {we.sets.map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center justify-between"
                      >
                        <span>
                          Set {s.position + 1}:{" "}
                          {s.completed_weight !== null && s.completed_reps !== null
                            ? `${s.completed_weight} × ${s.completed_reps}`
                            : s.completed_seconds !== null
                              ? `${s.completed_seconds}s`
                              : "—"}
                        </span>
                        <form action={deleteSet}>
                          <input type="hidden" name="id" value={s.id} />
                          <input
                            type="hidden"
                            name="workout_id"
                            value={workout.id}
                          />
                          <button
                            type="submit"
                            className="text-xs text-muted hover:underline"
                          >
                            Delete
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <form action={addSetToExercise} className="mt-4 grid grid-cols-3 gap-2">
                  <input type="hidden" name="workout_exercise_id" value={we.id} />
                  <input
                    name="weight"
                    type="number"
                    step="0.5"
                    placeholder="Weight"
                    className="h-10 rounded-lg border border-border bg-cream px-2 text-sm focus:border-navy focus:outline-none"
                  />
                  <input
                    name="reps"
                    type="number"
                    placeholder="Reps"
                    className="h-10 rounded-lg border border-border bg-cream px-2 text-sm focus:border-navy focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="h-10 rounded-lg bg-navy text-sm font-medium text-cream hover:opacity-90"
                  >
                    Add set
                  </button>
                </form>
              </article>
            ))
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Add exercise</h2>
          <form action={addExerciseToWorkout} className="mt-3 flex gap-2">
            <input type="hidden" name="workout_id" value={workout.id} />
            <select
              name="exercise_id"
              required
              defaultValue=""
              className="h-12 flex-1 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
            >
              <option value="" disabled>
                Pick an exercise…
              </option>
              {exercises.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="h-12 rounded-lg bg-orange px-5 text-sm font-medium text-cream hover:opacity-90"
            >
              Add
            </button>
          </form>
        </section>

        <footer className="mt-10 flex items-center justify-between">
          {workout.completed_at ? (
            <p className="text-sm text-muted">
              Completed{" "}
              {new Date(workout.completed_at).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          ) : (
            <form action={completeWorkout}>
              <input type="hidden" name="id" value={workout.id} />
              <button
                type="submit"
                className="h-10 rounded-lg bg-recovery-good px-5 text-sm font-medium text-cream hover:opacity-90"
              >
                Mark complete
              </button>
            </form>
          )}

          <form action={deleteWorkout}>
            <input type="hidden" name="id" value={workout.id} />
            <button
              type="submit"
              className="text-sm text-recovery-risk underline-offset-4 hover:underline"
            >
              Delete workout
            </button>
          </form>
        </footer>
      </div>
    </main>
  );
}
