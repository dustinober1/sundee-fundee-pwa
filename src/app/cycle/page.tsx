import Link from "next/link";
import { redirect } from "next/navigation";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  calculateCycleStatus,
  DEFAULT_CYCLE_SETTINGS,
  getPhaseRecommendation,
  type CycleSettings,
} from "@/lib/domain/cyclePhase";
import { deletePeriod, logPeriod, saveCycleSettings } from "./actions";

type SettingsRow = {
  average_cycle_length_days: number;
  average_period_length_days: number;
  luteal_phase_length_days: number;
};
type PeriodRow = {
  id: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
};

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function CyclePage() {
  const { user, profile } = await requireOnboardedProfile();
  if (!profile.cycle_tracking_enabled) {
    redirect("/settings");
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: settingsData }, { data: periodData }] = await Promise.all([
    supabase
      .from("cycle_settings")
      .select("average_cycle_length_days, average_period_length_days, luteal_phase_length_days")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("period_logs")
      .select("id, start_date, end_date, notes")
      .eq("user_id", user.id)
      .order("start_date", { ascending: false })
      .limit(12),
  ]);

  const settingsRow = (settingsData as SettingsRow | null) ?? {
    average_cycle_length_days: 28,
    average_period_length_days: 5,
    luteal_phase_length_days: 14,
  };
  const periods = (periodData as PeriodRow[] | null) ?? [];

  const settings: CycleSettings = {
    averageCycleLengthDays: settingsRow.average_cycle_length_days,
    averagePeriodLengthDays: settingsRow.average_period_length_days,
    lutealPhaseLengthDays: settingsRow.luteal_phase_length_days,
  };

  const logs = periods.map((p) => ({
    startDate: new Date(p.start_date + "T00:00:00"),
    endDate: p.end_date ? new Date(p.end_date + "T00:00:00") : null,
  }));

  const status = calculateCycleStatus(logs, settings);
  const rec = status ? getPhaseRecommendation(status.currentPhase) : null;

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/dashboard"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Dashboard
        </Link>
        <h1 className="font-display mt-3 text-4xl font-semibold">Cycle</h1>

        {status && rec ? (
          <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
            <p className="font-display text-gold uppercase tracking-[0.3em] text-xs">
              {rec.title}
            </p>
            <p className="font-display mt-2 text-3xl font-semibold">
              Day {status.cycleDay}
            </p>
            <p className="mt-1 text-sm text-muted">
              {status.daysUntilNextPhase === 0
                ? "Phase ends today"
                : `${status.daysUntilNextPhase} day${status.daysUntilNextPhase === 1 ? "" : "s"} until next phase`}{" "}
              · next period {fmtDate(status.predictedNextPeriod.toISOString().slice(0, 10))}
            </p>
            <p className="mt-3 text-sm text-navy/80">{rec.description}</p>
            <p className="mt-2 text-sm">
              <span className="font-medium">Focus: </span>
              {rec.trainingFocus}
            </p>
            {rec.exercisesToAvoid.length > 0 ? (
              <p className="mt-1 text-sm text-muted">
                Avoid: {rec.exercisesToAvoid.join(", ")}
              </p>
            ) : null}
          </section>
        ) : (
          <p className="mt-6 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
            Log a period below to start tracking phases.
          </p>
        )}

        <section className="mt-10 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Log a period start</h2>
          <form action={logPeriod} className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="block font-medium text-navy">Start date</span>
              <input
                name="start_date"
                type="date"
                required
                className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="block font-medium text-navy">End date (optional)</span>
              <input
                name="end_date"
                type="date"
                className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
              />
            </label>
            <label className="sm:col-span-2 text-sm">
              <span className="block font-medium text-navy">Notes</span>
              <input
                name="notes"
                maxLength={280}
                className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="sm:col-span-2 h-12 rounded-lg bg-orange font-medium text-cream hover:opacity-90"
            >
              Log
            </button>
          </form>

          {periods.length > 0 ? (
            <ul className="mt-6 divide-y divide-border">
              {periods.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span>
                    {fmtDate(p.start_date)}
                    {p.end_date ? ` – ${fmtDate(p.end_date)}` : ""}
                  </span>
                  <form action={deletePeriod}>
                    <input type="hidden" name="id" value={p.id} />
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
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Settings</h2>
          <form action={saveCycleSettings} className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="text-sm">
              <span className="block font-medium text-navy">Cycle length (days)</span>
              <input
                name="average_cycle_length_days"
                type="number"
                min={14}
                max={60}
                defaultValue={settings.averageCycleLengthDays}
                className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="block font-medium text-navy">Period length</span>
              <input
                name="average_period_length_days"
                type="number"
                min={1}
                max={14}
                defaultValue={settings.averagePeriodLengthDays}
                className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="block font-medium text-navy">Luteal length</span>
              <input
                name="luteal_phase_length_days"
                type="number"
                min={7}
                max={20}
                defaultValue={settings.lutealPhaseLengthDays}
                className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="sm:col-span-3 h-12 rounded-lg bg-orange font-medium text-cream hover:opacity-90"
            >
              Save settings
            </button>
          </form>
          <p className="mt-3 text-xs text-muted">
            Defaults: {DEFAULT_CYCLE_SETTINGS.averageCycleLengthDays} /{" "}
            {DEFAULT_CYCLE_SETTINGS.averagePeriodLengthDays} /{" "}
            {DEFAULT_CYCLE_SETTINGS.lutealPhaseLengthDays}.
          </p>
        </section>
      </div>
    </main>
  );
}
