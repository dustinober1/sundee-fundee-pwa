import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { getChallenge } from "@/features/challenges/queries";
import { computeChallengeProgress } from "@/lib/domain/challenges";
import { addVolumeToChallenge, deleteChallenge } from "../actions";

type Params = Promise<{ id: string }>;

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export default async function ChallengeDetailPage({ params }: { params: Params }) {
  await requireOnboardedProfile();
  const { id } = await params;
  const c = await getChallenge(id);
  if (!c) notFound();
  const progress = computeChallengeProgress(c);

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/challenges"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Challenges
        </Link>

        <header className="mt-3">
          <p className="font-display text-gold uppercase tracking-[0.3em] text-xs">
            {c.type.replaceAll("_", " ")}
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold">{c.title}</h1>
          {c.exercise_name ? (
            <p className="text-sm text-muted">{c.exercise_name}</p>
          ) : null}
          <p className="mt-1 text-xs text-muted">
            Started{" "}
            {new Date(c.challenge_start_date + "T00:00:00").toLocaleDateString()}
            {c.challenge_end_date
              ? ` · ends ${new Date(c.challenge_end_date + "T00:00:00").toLocaleDateString()}`
              : ""}
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <p className="font-display text-3xl font-semibold">
            {fmt(c.accumulated_volume_lbs)} lb
          </p>
          <p className="text-sm text-muted">
            {progress.isFullyComplete
              ? "All tiers complete — congrats!"
              : `${progress.currentTierName}: ${fmt(progress.volumeRemaining)} lb to go`}
          </p>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-cream">
            <div
              className="h-full bg-gold"
              style={{ width: `${(progress.percentComplete * 100).toFixed(0)}%` }}
            />
          </div>

          <ol className="mt-6 space-y-2 text-sm">
            {[...c.tiers]
              .sort((a, b) => a.ordinal - b.ordinal)
              .map((t, i) => {
                const reached = i < c.current_tier_index;
                return (
                  <li
                    key={t.ordinal}
                    className={`flex items-center justify-between rounded-xl border p-3 ${
                      reached
                        ? "border-recovery-good bg-recovery-good/5"
                        : "border-border bg-cream"
                    }`}
                  >
                    <span className="font-medium">{t.name}</span>
                    <span className="font-mono text-muted">
                      {fmt(t.target_volume_lbs)} lb
                      {reached ? " ✓" : ""}
                    </span>
                  </li>
                );
              })}
          </ol>
        </section>

        {c.status === "active" ? (
          <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
            <h2 className="font-display text-lg font-semibold">Add volume</h2>
            <p className="mt-1 text-xs text-muted">
              Manually add lbs of volume from a session. (Auto-aggregation from
              workouts ships with the analytics surface in Phase 5.)
            </p>
            <form action={addVolumeToChallenge} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={c.id} />
              <input
                name="volume_lbs"
                type="number"
                step="100"
                min="1"
                required
                placeholder="Volume (lb)"
                className="h-12 flex-1 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
              />
              <button
                type="submit"
                className="h-12 rounded-full bg-navy px-5 text-sm font-medium text-cream hover:opacity-90"
              >
                Add
              </button>
            </form>
          </section>
        ) : null}

        <footer className="mt-10">
          <form action={deleteChallenge}>
            <input type="hidden" name="id" value={c.id} />
            <button
              type="submit"
              className="text-sm text-recovery-risk underline-offset-4 hover:underline"
            >
              Delete challenge
            </button>
          </form>
        </footer>
      </div>
    </main>
  );
}
