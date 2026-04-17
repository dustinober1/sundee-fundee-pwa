import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { listChallenges } from "@/features/challenges/queries";
import { computeChallengeProgress } from "@/lib/domain/challenges";
import { listWeightliftingExercises } from "@/features/exercises/queries";
import { CreateChallengeForm } from "./CreateChallengeForm";

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export default async function ChallengesPage() {
  await requireOnboardedProfile();
  const [challenges, exercises] = await Promise.all([
    listChallenges(),
    listWeightliftingExercises(),
  ]);

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/dashboard"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Dashboard
        </Link>
        <h1 className="font-display mt-3 text-4xl font-semibold">Challenges</h1>
        <p className="mt-2 text-sm text-muted">
          Track lifetime or per-exercise volume goals across multiple tiers.
        </p>

        <section className="mt-8 space-y-3">
          {challenges.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
              No challenges yet — create one below.
            </p>
          ) : (
            challenges.map((c) => {
              const p = computeChallengeProgress(c);
              return (
                <Link
                  key={c.id}
                  href={`/challenges/${c.id}`}
                  className="block rounded-2xl border border-border bg-surface p-5 transition-colors hover:bg-cream"
                >
                  <header className="flex items-baseline justify-between gap-3">
                    <p className="font-display text-lg font-semibold">{c.title}</p>
                    <span
                      className={`text-xs uppercase tracking-widest ${
                        c.status === "completed"
                          ? "text-recovery-good"
                          : c.status === "expired"
                            ? "text-recovery-risk"
                            : "text-gold"
                      }`}
                    >
                      {c.status}
                    </span>
                  </header>
                  {c.exercise_name ? (
                    <p className="text-xs text-muted">{c.exercise_name}</p>
                  ) : null}
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream">
                    <div
                      className="h-full bg-gold"
                      style={{ width: `${(p.percentComplete * 100).toFixed(0)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {p.isFullyComplete
                      ? "All tiers complete!"
                      : `${p.currentTierName} · ${fmt(p.volumeRemaining)} lb to go`}
                    {" · "}
                    {fmt(c.accumulated_volume_lbs)} lb total
                  </p>
                </Link>
              );
            })
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">New challenge</h2>
          <CreateChallengeForm exercises={exercises} />
        </section>
      </div>
    </main>
  );
}
