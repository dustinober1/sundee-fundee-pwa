import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import {
  categoryBalance,
  computeAcwr,
  painTrend,
  weeklyVolume,
} from "@/features/analytics/queries";
import { AnalyticsCharts } from "./AnalyticsCharts";

const CATEGORY_LABEL: Record<string, string> = {
  squat: "Squat",
  hip_hinge: "Hip Hinge",
  press: "Press",
  pull: "Pull",
  carry: "Carry",
  olympic_weightlifting: "Olympic",
};

export default async function AnalyticsPage() {
  await requireOnboardedProfile();
  const [weeks, balance, pain, acwr] = await Promise.all([
    weeklyVolume(),
    categoryBalance(),
    painTrend(),
    computeAcwr(),
  ]);

  const labeledBalance = balance.map((b) => ({
    name: CATEGORY_LABEL[b.category] ?? b.category,
    value: b.volumeLbs,
  }));

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/dashboard"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Dashboard
        </Link>
        <h1 className="font-display mt-3 text-4xl font-semibold">Analytics</h1>
        <p className="mt-2 text-sm text-muted">
          Last 90 days of training volume, balance, and pain trend.
        </p>

        {acwr != null ? (
          <p className="mt-4 rounded-2xl border border-border bg-surface p-4 text-sm">
            <span className="font-display text-gold uppercase tracking-[0.3em] text-xs">
              ACWR
            </span>
            <br />
            <span className="font-mono text-2xl">{acwr.toFixed(2)}</span>{" "}
            <span className="text-muted">
              {acwr < 0.8
                ? "well within recovery range"
                : acwr < 1.3
                  ? "balanced load"
                  : "high — consider deload"}
            </span>
          </p>
        ) : null}

        <AnalyticsCharts
          weeks={weeks}
          balance={labeledBalance}
          pain={pain}
        />

        {weeks.length === 0 && balance.length === 0 && pain.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
            No data yet — log workouts and pain to see charts.
          </p>
        ) : null}
      </div>
    </main>
  );
}
