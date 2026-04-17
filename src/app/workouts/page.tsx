import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { listWorkouts } from "@/features/workouts/queries";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function WorkoutsPage() {
  await requireOnboardedProfile();
  const workouts = await listWorkouts();

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/dashboard"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Dashboard
        </Link>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <h1 className="font-display text-4xl font-semibold">Workouts</h1>
          <Link
            href="/workouts/new"
            className="inline-flex h-10 items-center rounded-full bg-navy px-5 text-sm font-medium text-cream hover:opacity-90"
          >
            New
          </Link>
        </div>

        <ul className="mt-8 space-y-3">
          {workouts.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
              No workouts yet — log your first one.
            </li>
          ) : (
            workouts.map((w) => (
              <li key={w.id}>
                <Link
                  href={`/workouts/${w.id}`}
                  className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-cream"
                >
                  <div>
                    <p className="font-display text-lg font-semibold">
                      {w.name?.trim() || "Workout"}
                    </p>
                    <p className="text-sm text-muted">
                      {formatDate(w.performed_on)} · {w.exercise_count} exercise
                      {w.exercise_count === 1 ? "" : "s"}
                      {w.duration_min ? ` · ${w.duration_min} min` : ""}
                    </p>
                  </div>
                  {w.completed_at ? (
                    <span className="text-xs uppercase tracking-widest text-recovery-good">
                      Done
                    </span>
                  ) : (
                    <span className="text-xs uppercase tracking-widest text-gold">
                      Open
                    </span>
                  )}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
