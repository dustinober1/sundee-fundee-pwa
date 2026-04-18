import type { CoachRow } from "@/features/coach/queries";
import { dismissRecommendation } from "@/app/coach/actions";

function severityClasses(sev: CoachRow["severity"]): string {
  if (sev === "urgent") return "border-recovery-risk bg-recovery-risk/10";
  if (sev === "warn") return "border-recovery-caution bg-recovery-caution/10";
  return "border-border bg-surface";
}

function severityBadge(sev: CoachRow["severity"]): string {
  if (sev === "urgent") return "text-recovery-risk";
  if (sev === "warn") return "text-recovery-caution";
  return "text-gold";
}

function kindLabel(kind: CoachRow["kind"]): string {
  switch (kind) {
    case "deload":
      return "Deload";
    case "plateau":
      return "Plateau";
    case "pain_focus":
      return "Pain rising";
    case "reduce_volume":
      return "Volume dropped";
    case "retest_1rm":
      return "Retest due";
  }
}

export function CoachCard({ rec }: { rec: CoachRow }) {
  return (
    <article
      className={`rounded-2xl border p-5 ${severityClasses(rec.severity)}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-xs uppercase tracking-wider ${severityBadge(rec.severity)}`}
          >
            {kindLabel(rec.kind)}
          </p>
          <p className="mt-2 text-sm text-navy/90">{rec.rationale}</p>
        </div>
        <form action={dismissRecommendation}>
          <input type="hidden" name="id" value={rec.id} />
          <button
            type="submit"
            className="text-xs text-muted hover:text-recovery-risk underline-offset-4 hover:underline"
          >
            Dismiss
          </button>
        </form>
      </div>
    </article>
  );
}
