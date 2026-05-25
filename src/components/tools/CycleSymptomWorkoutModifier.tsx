"use client";

import { useMemo, useState } from "react";

const symptomRecommendations = {
  cramps: {
    label: "Cramps",
    adjustment:
      "Extend the warm-up, reduce top-end intensity, and keep main-lift reps crisp instead of grindy.",
  },
  fatigue: {
    label: "Fatigue",
    adjustment:
      "Keep the main pattern if it cleans up quickly, but cut one or two working sets before you chase progression.",
  },
  bloating: {
    label: "Bloating",
    adjustment:
      "Use positions that let you brace comfortably and rely on controlled accessories if heavy setup feels too costly.",
  },
  headache: {
    label: "Headache",
    adjustment:
      "Lower the arousal level of the session, avoid breath-holding contests, and keep accessories simple.",
  },
  spotting: {
    label: "Spotting",
    adjustment:
      "Keep the session calm, avoid turning it into a proof day, and favor clean technique work or moderate accessories if heavy bracing feels disruptive.",
  },
  lowBackTightness: {
    label: "Low-back tightness",
    adjustment:
      "Choose lower-cost hinges or squat variations and keep the effort away from ugly bracing under fatigue.",
  },
} as const;

type SymptomKey = keyof typeof symptomRecommendations;

export function CycleSymptomWorkoutModifier() {
  const [symptom, setSymptom] = useState<SymptomKey>("fatigue");
  const [energy, setEnergy] = useState("medium");

  const recommendation = useMemo(() => {
    const base = symptomRecommendations[symptom];
    if (energy === "high") {
      return `${base.adjustment} If warm-ups improve, you can still keep the main lift and preserve the session intent.`;
    }

    if (energy === "low") {
      return `${base.adjustment} With low energy on top of the symptom, make the session shorter and remove the highest-cost accessory work first.`;
    }

    return `${base.adjustment} Keep the session honest and let warm-up feedback decide whether the main lift stays in.`;
  }, [energy, symptom]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="grid gap-4">
        <label className="rounded-2xl border border-border bg-white p-5">
          <p className="font-medium text-navy">Primary symptom today</p>
          <select
            value={symptom}
            onChange={(event) => setSymptom(event.target.value as SymptomKey)}
            className="mt-4 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-navy"
          >
            {Object.entries(symptomRecommendations).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="rounded-2xl border border-border bg-white p-5">
          <p className="font-medium text-navy">Overall energy</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["low", "medium", "high"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setEnergy(value)}
                className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                  energy === value
                    ? "border-orange bg-orange/10 text-orange"
                    : "border-border bg-surface text-navy"
                }`}
              >
                {value[0]?.toUpperCase()}
                {value.slice(1)}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
          Suggested modification
        </p>
        <h3 className="font-display mt-4 text-3xl font-bold text-navy">
          {symptomRecommendations[symptom].label} with {energy} energy
        </h3>
        <p className="mt-4 text-base leading-8 text-muted">{recommendation}</p>
        <div className="mt-8 rounded-2xl border border-border bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Keep in mind
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            The goal is not to train according to a rigid phase rule. The goal is to
            choose the lowest-cost version of the session that still moves the week
            forward.
          </p>
        </div>
      </div>
    </div>
  );
}
