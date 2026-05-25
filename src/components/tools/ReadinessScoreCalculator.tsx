"use client";

import { useMemo, useState } from "react";
import { calculateReadinessRecommendation } from "@/lib/training-tools";

const fields = [
  {
    key: "sleep",
    label: "Sleep quality",
    help: "Rate last night's sleep from 0 to 10.",
  },
  {
    key: "soreness",
    label: "Soreness",
    help: "Rate how sticky or limiting your soreness feels.",
  },
  {
    key: "stress",
    label: "Stress",
    help: "Rate general life stress and mental load.",
  },
  {
    key: "pain",
    label: "Pain",
    help: "Rate pain that changes how you move or brace.",
  },
] as const;

export function ReadinessScoreCalculator() {
  const [values, setValues] = useState({
    sleep: 7,
    soreness: 4,
    stress: 4,
    pain: 1,
  });

  const result = useMemo(
    () => calculateReadinessRecommendation(values),
    [values],
  );

  const toneClass =
    result.mode === "push"
      ? "bg-emerald-50 text-emerald-700"
      : result.mode === "steady"
        ? "bg-gold/20 text-navy"
        : "bg-orange/15 text-orange";

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-4">
        {fields.map((field) => (
          <label
            key={field.key}
            className="block rounded-2xl border border-border bg-white p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-navy">{field.label}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{field.help}</p>
              </div>
              <span className="text-2xl font-semibold text-navy">
                {values[field.key]}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={values[field.key]}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [field.key]: Number(event.target.value),
                }))
              }
              className="mt-4 w-full accent-orange"
            />
          </label>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
          Recommendation
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span className={`rounded-full px-4 py-2 text-sm font-semibold ${toneClass}`}>
            {result.mode.toUpperCase()}
          </span>
          <span className="text-sm text-muted">Readiness score: {result.score}/100</span>
        </div>
        <h3 className="font-display mt-6 text-3xl font-bold text-navy">
          {result.headline}
        </h3>
        <p className="mt-4 text-base leading-8 text-muted">{result.guidance}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Good push signs
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Warm-ups move faster, positions feel stable, and top sets do not need
              convincing.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Good modify signs
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Warm-ups stay sticky, soreness does not clear, or pain changes the way
              you set up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
