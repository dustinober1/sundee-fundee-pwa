import Link from "next/link";
import { redirect } from "next/navigation";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { getActiveEnrollment } from "@/features/programs/queries";
import { advanceWeek, endEnrollment } from "../actions";

export default async function EnrolledProgramPage() {
  await requireOnboardedProfile();
  const active = await getActiveEnrollment();
  if (!active) redirect("/programs");

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
        <p className="mt-1 text-sm text-muted">
          Started {new Date(active.started_on + "T00:00:00").toLocaleDateString()}{" "}
          · Week {active.current_week}
        </p>

        <section className="mt-8 rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
          Per-week session details land in a follow-up — the iOS source has
          full templates with exercises, sets, reps, and %1RM. Until then, log
          workouts manually under <Link href="/workouts" className="text-navy underline">Workouts</Link>{" "}
          and reference the program structure from your training notes.
        </section>

        <div className="mt-6 flex items-center gap-3">
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
