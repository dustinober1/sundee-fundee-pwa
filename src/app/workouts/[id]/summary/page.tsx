import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { getWorkoutSummaryData } from "@/features/workouts/summaryQueries";
import { roundToPlate } from "@/lib/domain/oneRepMax";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatLbs(value: number): string {
  return `${Math.round(value).toLocaleString()} lb`;
}

type Params = Promise<{ id: string }>;

export default async function WorkoutSummaryPage({ params }: { params: Params }) {
  await requireOnboardedProfile();
  const { id } = await params;
  const data = await getWorkoutSummaryData(id);
  if (!data) notFound();

  const { workout, prs } = data;
  const hasAnything =
    prs.oneRmPrs.length > 0 ||
    prs.volumePr !== null ||
    prs.bestSetOfDay !== null ||
    prs.challengeAdvances.length > 0;

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href={`/workouts/${workout.id}`}
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Back to workout
        </Link>

        <header className="mt-3">
          <p className="font-display text-gold uppercase tracking-[0.4em] text-xs">
            Session summary
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold">Nice work.</h1>
          <p className="mt-1 text-sm text-muted">{formatDate(workout.performed_on)}</p>
        </header>

        {!hasAnything ? (
          <section className="mt-8 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
            No PRs this session — log more complete sets (weight × reps) to unlock summary stats.
          </section>
        ) : null}

        {prs.bestSetOfDay ? (
          <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Best set of the day</p>
            <p className="font-display mt-2 text-2xl font-semibold">
              {prs.bestSetOfDay.exercise_name}
            </p>
            <p className="mt-1 font-mono text-lg">
              {prs.bestSetOfDay.weight} × {prs.bestSetOfDay.reps}
            </p>
            <p className="mt-2 text-sm text-muted">
              ≈ {roundToPlate(prs.bestSetOfDay.estimated_1rm)} lb estimated 1RM (Epley)
            </p>
          </section>
        ) : null}

        {prs.oneRmPrs.length > 0 ? (
          <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wider text-muted">
              {prs.oneRmPrs.length === 1 ? "New 1RM" : `${prs.oneRmPrs.length} new 1RMs`}
            </p>
            <ul className="mt-3 space-y-3">
              {prs.oneRmPrs.map((pr) => (
                <li key={pr.exercise_id} className="flex items-baseline justify-between">
                  <div>
                    <p className="font-medium">{pr.exercise_name}</p>
                    <p className="text-xs text-muted font-mono">
                      from {pr.source_set.weight} × {pr.source_set.reps}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg">
                      {roundToPlate(pr.estimated_1rm)} lb
                    </p>
                    <p className="text-xs text-recovery-good">
                      {pr.prior_best === null
                        ? "first record"
                        : `+${roundToPlate(pr.delta)} lb`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {prs.volumePr ? (
          <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Volume PR</p>
            <p className="font-display mt-2 text-2xl font-semibold">
              {formatLbs(prs.volumePr.total_volume)}
            </p>
            <p className="mt-1 text-sm text-muted">
              {prs.volumePr.prior_best === null
                ? "First full workout logged — this is your new ceiling."
                : `Beats previous best of ${formatLbs(prs.volumePr.prior_best)} by ${formatLbs(prs.volumePr.delta)}.`}
            </p>
          </section>
        ) : null}

        {prs.challengeAdvances.length > 0 ? (
          <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Challenge progress</p>
            <ul className="mt-3 space-y-3">
              {prs.challengeAdvances.map((a) => (
                <li key={a.challenge_id} className="flex items-baseline justify-between">
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-muted">
                      +{formatLbs(a.added_volume)} this session
                    </p>
                  </div>
                  <p className="text-sm font-medium text-recovery-good">
                    {a.is_fully_complete
                      ? "Fully complete"
                      : a.new_tier_name
                        ? `→ ${a.new_tier_name}`
                        : "Tier up"}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <footer className="mt-10 flex items-center justify-between">
          <Link
            href="/workouts"
            className="text-sm text-muted underline-offset-4 hover:underline"
          >
            All workouts
          </Link>
          <Link
            href="/dashboard"
            className="h-10 inline-flex items-center rounded-lg bg-navy px-5 text-sm font-medium text-cream hover:opacity-90"
          >
            Back to dashboard
          </Link>
        </footer>
      </div>
    </main>
  );
}
