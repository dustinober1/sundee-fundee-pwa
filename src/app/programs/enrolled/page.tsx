import Link from "next/link";
import { redirect } from "next/navigation";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import {
  getActiveEnrollment,
  getProgramTemplate,
} from "@/features/programs/queries";
import { findWeek } from "@/lib/domain/programs";
import { advanceWeek, endEnrollment } from "../actions";

export default async function EnrolledProgramPage() {
  await requireOnboardedProfile();
  const active = await getActiveEnrollment();
  if (!active) redirect("/programs");

  const template = await getProgramTemplate(active.template_id);
  const thisWeek = template ? findWeek(template.weeks, active.current_week) : null;

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/programs"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Programs
        </Link>
        <p className="mt-3 font-display text-gold uppercase tracking-[0.3em] text-xs">
          Active program
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold">
          {active.template_name}
        </h1>
        {active.current_phase_name ? (
          <p className="mt-1 text-sm text-navy/80">
            {active.current_phase_name}
          </p>
        ) : null}
        <p className="mt-1 text-sm text-muted">
          Started {new Date(active.started_on + "T00:00:00").toLocaleDateString()}{" "}
          · Week {active.current_week} of {active.template_duration_weeks}
          {active.template_duration_weeks > 0
            ? ` · ${Math.max(0, active.template_duration_weeks - active.current_week)} weeks remaining`
            : ""}
        </p>

        <section className="mt-8">
          <h2 className="font-display text-gold uppercase tracking-[0.3em] text-xs">
            This week
          </h2>
          {thisWeek && thisWeek.sessions.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {thisWeek.sessions.map((s, idx) => (
                <li
                  key={`${s.label}-${idx}`}
                  className="rounded-2xl border border-border bg-surface p-4"
                >
                  <Link
                    href={`/programs/enrolled/week/${active.current_week}/session/${idx}`}
                    className="flex items-center justify-between"
                  >
                    <span className="font-display text-base font-semibold">
                      {s.label}
                    </span>
                    <span className="text-xs text-muted">
                      {s.exercises.length} exercise
                      {s.exercises.length === 1 ? "" : "s"} →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-2xl border border-dashed border-border p-5 text-sm text-muted">
              No sessions are defined for week {active.current_week}. Log
              workouts manually under{" "}
              <Link href="/workouts" className="text-navy underline">
                Workouts
              </Link>
              .
            </p>
          )}
        </section>

        <div className="mt-6 flex items-center gap-3">
          {active.current_week < active.template_duration_weeks ? (
            <form action={advanceWeek}>
              <input type="hidden" name="id" value={active.id} />
              <input
                type="hidden"
                name="next_week"
                value={active.current_week + 1}
              />
              <button
                type="submit"
                className="h-10 rounded-lg bg-orange px-5 text-sm font-medium text-cream hover:opacity-90"
              >
                Advance to week {active.current_week + 1}
              </button>
            </form>
          ) : (
            <form action={endEnrollment}>
              <input type="hidden" name="id" value={active.id} />
              <button
                type="submit"
                className="h-10 rounded-lg bg-recovery-good px-5 text-sm font-medium text-cream hover:opacity-90"
              >
                Complete program
              </button>
            </form>
          )}

          <form action={endEnrollment}>
            <input type="hidden" name="id" value={active.id} />
            <button
              type="submit"
              className="text-sm text-recovery-risk underline-offset-4 hover:underline"
            >
              End program
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
