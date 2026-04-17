import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";

const DATASETS = [
  { key: "workouts", label: "Workouts", description: "Date, name, duration, notes." },
  { key: "maxes", label: "One-rep maxes", description: "Per-lift PR history." },
  {
    key: "benchmarks",
    label: "Benchmark results",
    description: "Date, benchmark, score.",
  },
  {
    key: "recovery",
    label: "Recovery scores",
    description: "Daily total + sub-inputs.",
  },
  { key: "pain", label: "Pain logs", description: "Daily pain entries by location." },
] as const;

export default async function ExportPage() {
  await requireOnboardedProfile();

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/settings"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Settings
        </Link>
        <h1 className="font-display mt-3 text-4xl font-semibold">Export</h1>
        <p className="mt-2 text-sm text-muted">
          Download your data as CSV.
        </p>

        <ul className="mt-6 space-y-3">
          {DATASETS.map((d) => (
            <li
              key={d.key}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4"
            >
              <div>
                <p className="font-display text-lg font-semibold">{d.label}</p>
                <p className="text-sm text-muted">{d.description}</p>
              </div>
              <a
                href={`/api/export?dataset=${d.key}`}
                download
                className="inline-flex h-10 items-center rounded-full bg-navy px-4 text-sm font-medium text-cream hover:opacity-90"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
