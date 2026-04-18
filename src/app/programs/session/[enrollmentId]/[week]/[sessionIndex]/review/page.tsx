import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { confirmAdaptedSession } from "@/app/programs/actions";
import type { AdaptSessionResult } from "@/lib/domain/adaptSession";

type Params = Promise<{
  enrollmentId: string;
  week: string;
  sessionIndex: string;
}>;

type StoredPayload = {
  template_name: string;
  session_label: string;
  result: AdaptSessionResult;
};

export default async function SessionReviewPage({ params }: { params: Params }) {
  const { user } = await requireOnboardedProfile();
  const { enrollmentId, week, sessionIndex } = await params;
  const weekNum = Number(week);
  const sIdx = Number(sessionIndex);
  if (!Number.isInteger(weekNum) || !Number.isInteger(sIdx)) notFound();

  const supabase = await createSupabaseServerClient();

  // If a workout already exists, skip the review.
  const { data: existingSession } = await supabase
    .from("enrolled_program_sessions")
    .select("session_workout_id")
    .eq("enrollment_id", enrollmentId)
    .eq("week_num", weekNum)
    .eq("session_index", sIdx)
    .maybeSingle();
  const existingWorkoutId = (
    existingSession as { session_workout_id: string | null } | null
  )?.session_workout_id;
  if (existingWorkoutId) redirect(`/workouts/${existingWorkoutId}`);

  const { data: row } = await supabase
    .from("session_adaptations")
    .select("payload, recovery_score, load_multiplier")
    .eq("user_id", user.id)
    .eq("enrollment_id", enrollmentId)
    .eq("week_num", weekNum)
    .eq("session_index", sIdx)
    .maybeSingle();
  if (!row) redirect("/programs/enrolled");

  const { payload, recovery_score, load_multiplier } = row as {
    payload: StoredPayload;
    recovery_score: number | null;
    load_multiplier: number | null;
  };
  const { template_name, session_label, result } = payload;

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/programs/enrolled"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Back to program
        </Link>

        <header className="mt-3">
          <p className="font-display text-gold uppercase tracking-[0.4em] text-xs">
            Session review
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold">
            {template_name}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Week {weekNum} · {session_label}
          </p>
        </header>

        <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Adapted load
              </p>
              <p className="font-display mt-1 text-2xl font-semibold">
                {Math.round((load_multiplier ?? result.globalMultiplier) * 100)}%
              </p>
            </div>
            {recovery_score !== null ? (
              <p className="text-sm text-muted">
                Recovery score: <span className="font-mono">{recovery_score}</span>
              </p>
            ) : null}
          </div>
          {result.rationale.length > 0 ? (
            <ul className="mt-3 space-y-1 text-sm">
              {result.rationale.map((line, i) => (
                <li key={i} className="text-navy/80">
                  · {line}
                </li>
              ))}
            </ul>
          ) : null}
          {result.skipRecommended ? (
            <p className="mt-3 rounded-lg border border-recovery-risk/40 bg-recovery-risk/10 p-3 text-sm text-recovery-risk">
              Your recovery suggests taking today off. You can still proceed,
              but consider a rest or deload.
            </p>
          ) : null}
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-wider text-muted">Exercises</p>
          <ul className="mt-3 space-y-4">
            {result.exercises.map((ex, i) => {
              const original = ex.original_prescribed_weight;
              const adapted = ex.adapted_prescribed_weight;
              const changed =
                original !== null &&
                adapted !== null &&
                Math.abs(original - adapted) > 0.01;
              return (
                <li
                  key={`${ex.exercise_id}-${i}`}
                  className="border-t border-border pt-3 first:border-0 first:pt-0"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <p className="font-medium">{ex.exercise_name}</p>
                      <p className="text-xs text-muted font-mono">
                        {ex.sets} × {ex.reps} @ {Math.round(ex.pct_1rm * 100)}%1RM
                      </p>
                    </div>
                    <div className="text-right">
                      {adapted !== null ? (
                        <>
                          <p className="font-mono text-lg">{adapted} lb</p>
                          {changed && original !== null ? (
                            <p className="text-xs text-muted line-through font-mono">
                              {original} lb
                            </p>
                          ) : null}
                        </>
                      ) : (
                        <p className="text-xs text-muted">No max on file</p>
                      )}
                    </div>
                  </div>
                  {ex.contraindicated ? (
                    <div className="mt-2 rounded-lg border border-recovery-risk/40 bg-recovery-risk/10 p-2 text-xs text-recovery-risk">
                      <p className="font-medium">Injury flag</p>
                      {ex.regression_suggestions.length > 0 ? (
                        <p className="mt-1">
                          Consider swapping to:{" "}
                          {ex.regression_suggestions.join(", ")}
                        </p>
                      ) : (
                        <p className="mt-1">
                          This movement may aggravate an active injury.
                        </p>
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-6 flex flex-wrap items-center gap-3">
          <form action={confirmAdaptedSession}>
            <input type="hidden" name="enrollment_id" value={enrollmentId} />
            <input type="hidden" name="week_num" value={weekNum} />
            <input type="hidden" name="session_index" value={sIdx} />
            <input type="hidden" name="mode" value="accept" />
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-lg bg-orange px-5 text-sm font-medium text-cream hover:opacity-90"
            >
              Accept & start session
            </button>
          </form>
          <form action={confirmAdaptedSession}>
            <input type="hidden" name="enrollment_id" value={enrollmentId} />
            <input type="hidden" name="week_num" value={weekNum} />
            <input type="hidden" name="session_index" value={sIdx} />
            <input type="hidden" name="mode" value="dismiss" />
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm font-medium hover:bg-cream"
            >
              Use prescribed loads
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
