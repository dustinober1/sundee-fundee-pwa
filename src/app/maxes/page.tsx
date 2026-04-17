import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { listWeightliftingExercises } from "@/features/exercises/queries";
import { listMaxes, type OneRepMaxRow } from "@/features/maxes/queries";
import { AddMaxForm } from "./AddMaxForm";
import { deleteOneRepMax } from "./actions";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function groupByExercise(rows: OneRepMaxRow[]) {
  const groups = new Map<string, OneRepMaxRow[]>();
  for (const r of rows) {
    const list = groups.get(r.exercise_name) ?? [];
    list.push(r);
    groups.set(r.exercise_name, list);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function bestOf(rows: OneRepMaxRow[]): OneRepMaxRow {
  return rows.reduce((best, r) => (r.weight > best.weight ? r : best), rows[0]);
}

export default async function MaxesPage() {
  const { profile } = await requireOnboardedProfile();
  const [exercises, rows] = await Promise.all([
    listWeightliftingExercises(),
    listMaxes(),
  ]);
  const groups = groupByExercise(rows);

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/dashboard"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Dashboard
        </Link>
        <h1 className="font-display mt-3 text-4xl font-semibold">One-rep maxes</h1>
        <p className="mt-2 text-sm text-muted">
          Log a true 1RM, or any rep max — we&apos;ll estimate the 1RM with Epley.
        </p>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-xl font-semibold">Add entry</h2>
          <AddMaxForm exercises={exercises} defaultUnit={profile.weight_unit} />
        </section>

        <section className="mt-10 space-y-6">
          {groups.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
              No maxes logged yet.
            </p>
          ) : (
            groups.map(([exercise, entries]) => {
              const pr = bestOf(entries);
              return (
                <article
                  key={exercise}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <header className="flex items-baseline justify-between">
                    <h3 className="font-display text-lg font-semibold">{exercise}</h3>
                    <p className="text-sm text-gold font-medium">
                      PR: {pr.weight.toFixed(1)} {pr.unit}
                      {pr.is_estimated ? " (est.)" : ""}
                    </p>
                  </header>
                  <ul className="mt-3 divide-y divide-border">
                    {entries.map((r) => (
                      <li
                        key={r.id}
                        className="flex items-center justify-between py-2 text-sm"
                      >
                        <span className="font-mono">
                          {r.weight.toFixed(1)} {r.unit}
                          {r.is_estimated && r.source_reps
                            ? ` · est. from ${r.source_reps} reps`
                            : ""}
                        </span>
                        <span className="text-muted">
                          {formatDate(r.performed_on)}
                        </span>
                        <form action={deleteOneRepMax}>
                          <input type="hidden" name="id" value={r.id} />
                          <button
                            type="submit"
                            aria-label="Delete entry"
                            className="text-xs text-muted underline-offset-4 hover:underline"
                          >
                            Delete
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
