import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BODY_REGIONS, regionsByIds } from "@/lib/domain/bodyRegions";
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
  const { data } = await supabase
    .from("daily_pain_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("performed_on", { ascending: false })
    .limit(60);

  const logs = (data as PainRow[] | null) ?? [];

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/dashboard"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Dashboard
        </Link>
        <h1 className="font-display mt-3 text-4xl font-semibold">Pain log</h1>
        <p className="mt-2 text-sm text-muted">
          Track day-to-day pain by body region. Highest intensity feeds your
          recovery score.
        </p>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Log entry</h2>
          <LogPainForm regions={BODY_REGIONS} />
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">Recent</h2>
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
      </div>
    </main>
  );
}
