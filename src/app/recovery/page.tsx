import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import {
  getTodayRecoveryScore,
  listRecoveryScores,
} from "@/features/recovery/queries";
import { recommendationLabel } from "@/lib/domain/recoveryScore";
import { LogRecoveryForm } from "./LogRecoveryForm";

function recommendationColor(r: string) {
  return r === "push_day"
    ? "text-recovery-good"
    : r === "moderate"
      ? "text-recovery-caution"
      : "text-recovery-risk";
}

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default async function RecoveryPage() {
  await requireOnboardedProfile();
  const [today, history] = await Promise.all([
    getTodayRecoveryScore(),
    listRecoveryScores(),
  ]);

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/dashboard"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Dashboard
        </Link>
        <h1 className="font-display mt-3 text-4xl font-semibold">Recovery</h1>
        <p className="mt-2 text-sm text-muted">
          Log HRV, sleep, and pain to get a daily readiness score and training
          recommendation.
        </p>

        <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
          {today ? (
            <>
              <p className="font-display text-gold uppercase tracking-[0.3em] text-xs">
                Today
              </p>
              <p className="font-display mt-2 text-6xl font-semibold">{today.total}</p>
              <p className={`mt-1 text-lg font-medium ${recommendationColor(today.recommendation)}`}>
                {recommendationLabel(today.recommendation)}
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                {Object.entries(today.sub_scores).map(([k, v]) => (
                  <li key={k} className="rounded-lg border border-border bg-cream p-2">
                    <p className="text-muted uppercase tracking-widest">{k}</p>
                    <p className="text-navy font-mono text-lg">{v}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-muted">
              No score logged today. Use the form below.
            </p>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Log entry</h2>
          <p className="mt-1 text-xs text-muted">
            Provide at least one input. Score is recomputed on save and uses
            your cycle phase if cycle tracking is enabled.
          </p>
          <LogRecoveryForm />
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">History</h2>
          {history.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No entries yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {history.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-sm"
                >
                  <span>{fmtDate(r.performed_on)}</span>
                  <span className="font-mono text-lg">{r.total}</span>
                  <span className={`text-xs ${recommendationColor(r.recommendation)}`}>
                    {recommendationLabel(r.recommendation)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
