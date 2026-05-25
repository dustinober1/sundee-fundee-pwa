"use client";

import { useMemo, useState } from "react";
import { classifyDeloadNeed } from "@/lib/training-tools";

export function DeloadPlanner() {
  const [values, setValues] = useState({
    poorSleepDays: 2,
    highSorenessDays: 2,
    performanceDropSessions: 0,
  });

  const classification = useMemo(() => classifyDeloadNeed(values), [values]);

  const summary =
    classification === "continue"
      ? "Normal fatigue. Keep the block moving and reassess after the next hard session."
      : classification === "monitor"
        ? "Warning signs are stacking. Cap unnecessary stress and watch the next few workouts closely."
        : "A real deload is justified. Reduce session cost now so the next block can rebound.";

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-4">
        {[
          ["poorSleepDays", "Poor-sleep days this week", 7],
          ["highSorenessDays", "High-soreness days this week", 7],
          ["performanceDropSessions", "Performance-drop sessions", 4],
        ].map(([key, label, max]) => (
          <label
            key={key}
            className="block rounded-2xl border border-border bg-white p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-medium text-navy">{label}</p>
              <span className="text-2xl font-semibold text-navy">
                {values[key as keyof typeof values]}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={String(max)}
              value={values[key as keyof typeof values]}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [key]: Number(event.target.value),
                }))
              }
              className="mt-4 w-full accent-orange"
            />
          </label>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
          Deload call
        </p>
        <h3 className="font-display mt-4 text-3xl font-bold text-navy">
          {classification === "continue"
            ? "Continue the block"
            : classification === "monitor"
              ? "Monitor the next sessions"
              : "Plan a deload week"}
        </h3>
        <p className="mt-4 text-base leading-8 text-muted">{summary}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Continue
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Fatigue is present but still behaving like normal training cost.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Monitor
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Keep the plan, but trim the first thing that makes the week too
              expensive.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Deload
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Cut volume first, keep clean practice, and let the next phase rebuild.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
