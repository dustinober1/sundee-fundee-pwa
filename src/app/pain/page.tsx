import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BODY_REGIONS, regionsByIds } from "@/lib/domain/bodyRegions";
import type { RecoveryPhase, Injury } from "@/lib/domain/adaptation";
import { CreateInjuryForm } from "../injuries/CreateInjuryForm";
import { deleteInjury, updateInjuryPhase } from "../injuries/actions";
import { LogPainForm } from "./LogPainForm";
import { deletePain } from "./actions";

type PainRow = {
  id: string;
  performed_on: string;
  location_ids: string[];
  intensity: number;
  pain_type: string;
  notes: string | null;
};

const PHASE_LABELS: Record<RecoveryPhase, string> = {
  acute: "Acute",
  rehab: "Rehab",
  light_load: "Light Load",
  return_to_play: "Return to Play",
  resolved: "Resolved",
};
const PHASES: RecoveryPhase[] = [
  "acute",
  "rehab",
  "light_load",
  "return_to_play",
  "resolved",
];

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default async function PainPage() {
  const { user } = await requireOnboardedProfile();
  const supabase = await createSupabaseServerClient();
  const [painRes, injuryRes] = await Promise.all([
    supabase
      .from("daily_pain_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("performed_on", { ascending: false })
      .limit(60),
    supabase
      .from("injuries")
      .select("id, name, location_ids, recovery_phase, phase_updated, notes, date_created")
      .eq("user_id", user.id)
      .order("recovery_phase", { ascending: true })
      .order("date_created", { ascending: false }),
  ]);

  const logs = (painRes.data as PainRow[] | null) ?? [];

  type InjuryRow = Injury & {
    phase_updated: string;
    notes: string | null;
    date_created: string;
  };
  const injuries = (injuryRes.data as InjuryRow[] | null) ?? [];

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/dashboard"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Dashboard
        </Link>
        <h1 className="font-display mt-3 text-4xl font-semibold">Pain &amp; Injuries</h1>
        <p className="mt-2 text-sm text-muted">
          Track day-to-day pain and active injuries. Both feed your recovery score
          and exercise adaptations.
        </p>

        <h2 className="font-display mt-10 text-2xl font-semibold">Pain log</h2>

        <section className="mt-4 rounded-2xl border border-border bg-surface p-5">
          <h3 className="font-display text-lg font-semibold">Log entry</h3>
          <LogPainForm regions={BODY_REGIONS} />
        </section>

        <section className="mt-6">
          <h3 className="font-display text-lg font-semibold">Recent</h3>
          {logs.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No entries yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {logs.map((l) => {
                const regions = regionsByIds(l.location_ids);
                return (
                  <li
                    key={l.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface p-3 text-sm"
                  >
                    <div className="flex-1">
                      <p>
                        <span className="font-mono text-lg">{l.intensity}/10</span>{" "}
                        <span className="text-xs uppercase tracking-widest text-muted">
                          {l.pain_type}
                        </span>
                      </p>
                      <p className="text-xs text-muted">
                        {regions.map((r) => r.displayName).join(", ") || "—"}
                      </p>
                      {l.notes ? <p className="mt-1 text-navy/80">{l.notes}</p> : null}
                    </div>
                    <span className="text-xs text-muted">{fmtDate(l.performed_on)}</span>
                    <form action={deletePain}>
                      <input type="hidden" name="id" value={l.id} />
                      <button
                        type="submit"
                        className="text-xs text-muted hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <h2 className="font-display mt-12 text-2xl font-semibold">Injuries</h2>
        <p className="mt-1 text-sm text-muted">
          Active injuries inform exercise contraindications and load reduction.
        </p>

        <section className="mt-4 space-y-3">
          {injuries.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
              No injuries logged.
            </p>
          ) : (
            injuries.map((i) => {
              const regions = regionsByIds(i.location_ids);
              return (
                <article
                  key={i.id}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <header className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold">{i.name}</h3>
                    <span
                      className={`text-xs uppercase tracking-widest ${
                        i.recovery_phase === "resolved"
                          ? "text-recovery-good"
                          : i.recovery_phase === "acute"
                            ? "text-recovery-risk"
                            : "text-gold"
                      }`}
                    >
                      {PHASE_LABELS[i.recovery_phase]}
                    </span>
                  </header>
                  <p className="mt-1 text-xs text-muted">
                    {regions.map((r) => r.displayName).join(", ") || "—"}
                  </p>
                  {i.notes ? <p className="mt-2 text-sm text-navy/80">{i.notes}</p> : null}

                  <div className="mt-3 flex items-center gap-2">
                    <form action={updateInjuryPhase} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={i.id} />
                      <select
                        name="recovery_phase"
                        defaultValue={i.recovery_phase}
                        className="h-10 rounded-xl border border-border bg-cream px-3 text-sm focus:border-navy focus:outline-none"
                      >
                        {PHASES.map((p) => (
                          <option key={p} value={p}>
                            {PHASE_LABELS[p]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="h-10 rounded-lg bg-orange px-4 text-sm font-medium text-cream hover:opacity-90"
                      >
                        Update phase
                      </button>
                    </form>
                    <form action={deleteInjury} className="ml-auto">
                      <input type="hidden" name="id" value={i.id} />
                      <button
                        type="submit"
                        className="text-xs text-recovery-risk hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <h3 className="font-display text-lg font-semibold">Add injury</h3>
          <CreateInjuryForm regions={BODY_REGIONS} />
        </section>
      </div>
    </main>
  );
}
