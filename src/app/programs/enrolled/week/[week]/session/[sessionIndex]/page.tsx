import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import {
  getActiveEnrollment,
  getProgramTemplate,
} from "@/features/programs/queries";
import { listExercisesByIds } from "@/features/exercises/queries";
import { listLatestMaxByExerciseId } from "@/features/maxes/queries";
import { findWeek, resolveTargetWeight } from "@/lib/domain/programs";
import { startProgramSession } from "@/app/programs/actions";

type Params = Promise<{ week: string; sessionIndex: string }>;

export default async function ProgramSessionPage({
  params,
}: {
  params: Params;
}) {
  await requireOnboardedProfile();
  const active = await getActiveEnrollment();
  if (!active) redirect("/programs");

  const { week: weekParam, sessionIndex: sessionIdxParam } = await params;
  const weekNum = Number.parseInt(weekParam, 10);
  const sessionIdx = Number.parseInt(sessionIdxParam, 10);
  if (!Number.isFinite(weekNum) || !Number.isFinite(sessionIdx)) notFound();

  const template = await getProgramTemplate(active.template_id);
  if (!template) notFound();
  const week = findWeek(template.weeks, weekNum);
  if (!week) notFound();
  const session = week.sessions[sessionIdx];
  if (!session) notFound();

  const exerciseIds = Array.from(
    new Set(session.exercises.map((e) => e.exercise_id)),
  );
  const [exerciseRows, latestMaxes] = await Promise.all([
    listExercisesByIds(exerciseIds),
    listLatestMaxByExerciseId(),
  ]);
  const nameById = new Map(exerciseRows.map((e) => [e.id, e.name]));

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/programs/enrolled"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← {active.template_name}
        </Link>
        <p className="mt-3 font-display text-gold uppercase tracking-[0.3em] text-xs">
          Week {weekNum}
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold">
          {session.label}
        </h1>

        <section className="mt-8 space-y-3">
          {session.exercises.map((e, idx) => {
            const max = latestMaxes.get(e.exercise_id);
            const target = resolveTargetWeight(
              e.pct_1rm,
              max ? { weight: max.weight, unit: max.unit } : null,
            );
            return (
              <article
                key={`${e.exercise_id}-${idx}`}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <header className="flex items-baseline justify-between">
                  <h2 className="font-display text-lg font-semibold">
                    {nameById.get(e.exercise_id) ?? "Exercise"}
                  </h2>
                  <span className="text-xs text-muted uppercase tracking-widest">
                    {Math.round(e.pct_1rm * 100)}%
                  </span>
                </header>
                <p className="mt-1 text-sm text-muted">
                  {e.sets} sets × {e.reps} reps
                </p>
                {target.has_max ? (
                  <p className="mt-2 font-mono text-sm">
                    Target:{" "}
                    <strong>
                      {target.weight} {target.unit}
                    </strong>
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-recovery-risk">
                    No 1RM on file —{" "}
                    <Link
                      href="/maxes"
                      className="underline underline-offset-4"
                    >
                      log a max →
                    </Link>
                  </p>
                )}
              </article>
            );
          })}
        </section>

        <footer className="mt-10">
          <form action={startProgramSession}>
            <input type="hidden" name="enrollment_id" value={active.id} />
            <input type="hidden" name="week_num" value={String(weekNum)} />
            <input
              type="hidden"
              name="session_index"
              value={String(sessionIdx)}
            />
            <input type="hidden" name="session_label" value={session.label} />
            <button
              type="submit"
              className="h-11 rounded-lg bg-orange px-5 text-sm font-medium text-cream hover:opacity-90"
            >
              Start session
            </button>
          </form>
        </footer>
      </div>
    </main>
  );
}
