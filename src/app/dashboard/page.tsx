import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTodayRecoveryScore } from "@/features/recovery/queries";
import { recommendationLabel } from "@/lib/domain/recoveryScore";

function recommendationColor(r: string) {
  return r === "push_day"
    ? "text-recovery-good"
    : r === "moderate"
      ? "text-recovery-caution"
      : "text-recovery-risk";
}

async function thisWeekWorkoutCount(userId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const monday = new Date();
  monday.setHours(0, 0, 0, 0);
  const day = monday.getDay() || 7;
  if (day !== 1) monday.setDate(monday.getDate() - (day - 1));

  const { count } = await supabase
    .from("workouts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("performed_on", monday.toISOString().slice(0, 10));
  return count ?? 0;
}

export default async function DashboardPage() {
  const { user, profile } = await requireOnboardedProfile();
  const [today, weekCount] = await Promise.all([
    getTodayRecoveryScore(),
    thisWeekWorkoutCount(user.id),
  ]);

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <p className="font-display text-gold uppercase tracking-[0.4em] text-xs">Today</p>
        <h1 className="font-display mt-3 text-4xl font-semibold">
          Welcome back, {profile.display_name ?? "lifter"}.
        </h1>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/recovery"
            className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:bg-cream"
          >
            <p className="font-display text-gold uppercase tracking-[0.3em] text-xs">
              Recovery
            </p>
            {today ? (
              <>
                <p className="font-display mt-2 text-5xl font-semibold">{today.total}</p>
                <p
                  className={`mt-1 text-sm font-medium ${recommendationColor(today.recommendation)}`}
                >
                  {recommendationLabel(today.recommendation)}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">No score logged today.</p>
            )}
          </Link>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="font-display text-gold uppercase tracking-[0.3em] text-xs">
              This week
            </p>
            <p className="font-display mt-2 text-5xl font-semibold">{weekCount}</p>
            <p className="mt-1 text-sm text-muted">
              workout{weekCount === 1 ? "" : "s"} logged
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <Card title="Workouts" body="Log a session or review history." href="/workouts" />
          <Card title="Maxes" body="Track 1RMs and PR history." href="/maxes" />
          <Card title="Programs" body="Browse and enroll in a program." href="/programs" />
          <Card title="Benchmarks" body="Re-test fitness over time." href="/benchmarks" />
          <Card title="Challenges" body="Volume goals across tiers." href="/challenges" />
          <Card title="Pain log" body="Daily pain by body region." href="/pain" />
          <Card title="Injuries" body="Active injuries + recovery phase." href="/injuries" />
          <Card title="Analytics" body="90-day volume + balance + pain." href="/analytics" />
          {profile.cycle_tracking_enabled ? (
            <Card title="Cycle" body="Phase, predictions, training focus." href="/cycle" />
          ) : null}
          <Card title="Settings" body="Profile, units, export." href="/settings" />
        </section>
      </div>
    </main>
  );
}

function Card({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-border bg-surface p-5 transition-colors hover:bg-cream"
    >
      <p className="font-display text-xl font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </Link>
  );
}
