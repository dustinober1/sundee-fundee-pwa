"use client";

import { useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { AppStoreButtons } from "../AppStoreButtons";
import {
  defaultScienceSimulatorState,
  getScienceRecommendation,
  type ScienceCycleContext,
  type SciencePainFlag,
  type ScienceReadinessLevel,
  type ScienceSessionGoal,
  type ScienceSimulatorState,
} from "../../lib/science";

type Option<T extends string> = {
  value: T;
  label: string;
  description: string;
};

const readinessOptions: Option<ScienceReadinessLevel>[] = [
  {
    value: "high",
    label: "High",
    description: "Sleep, soreness, and motivation all look favorable.",
  },
  {
    value: "steady",
    label: "Steady",
    description: "A normal training day with no major warnings.",
  },
  {
    value: "low",
    label: "Low",
    description: "Fatigue, soreness, or stress is noticeably elevated.",
  },
  {
    value: "very-low",
    label: "Very low",
    description: "Recovery is poor enough that hard training is a bad trade.",
  },
];

const cycleOptions: Option<ScienceCycleContext>[] = [
  {
    value: "not-used",
    label: "Not used",
    description: "Cycle tracking is off or not relevant today.",
  },
  {
    value: "follicular",
    label: "Follicular",
    description: "A phase where harder work may feel more available.",
  },
  {
    value: "ovulatory",
    label: "Ovulatory",
    description: "Potentially strong, but high-risk movements still deserve care.",
  },
  {
    value: "luteal",
    label: "Luteal",
    description: "Fatigue and heat tolerance can change session cost.",
  },
  {
    value: "symptom-heavy",
    label: "Symptom-heavy",
    description: "Symptoms matter more than the name of the phase.",
  },
];

const painOptions: Option<SciencePainFlag>[] = [
  {
    value: "none",
    label: "None",
    description: "No pain flag changes the plan.",
  },
  {
    value: "minor",
    label: "Minor",
    description: "Something is noticeable, but not sharp or worsening.",
  },
  {
    value: "joint",
    label: "Joint",
    description: "A joint or tissue needs a more conservative variation.",
  },
  {
    value: "acute",
    label: "Acute",
    description: "Sharp, sudden, or worsening pain changes the priority.",
  },
];

const goalOptions: Option<ScienceSessionGoal>[] = [
  {
    value: "strength",
    label: "Strength",
    description: "Heavy work, top sets, or lower-rep loading.",
  },
  {
    value: "hypertrophy",
    label: "Hypertrophy",
    description: "Moderate loads and enough volume to build.",
  },
  {
    value: "conditioning",
    label: "Conditioning",
    description: "Higher breathing cost or shorter rest.",
  },
  {
    value: "technique",
    label: "Technique",
    description: "Practice quality, positions, and crisp reps.",
  },
];

function actionColor(action: string) {
  switch (action) {
    case "Push":
      return "bg-recovery-good text-cream";
    case "Hold":
      return "bg-gold text-navy";
    case "Modify":
      return "bg-orange text-cream";
    case "Recover":
      return "bg-recovery-risk text-cream";
    default:
      return "bg-navy text-cream";
  }
}

function OptionGroup<T extends string>({
  legend,
  description,
  value,
  options,
  onChange,
}: {
  legend: string;
  description: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="font-display text-xl font-semibold text-navy">
        {legend}
      </legend>
      <p className="text-sm leading-6 text-muted">{description}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`min-h-24 rounded-xl border p-4 text-left transition ${
                active
                  ? "border-navy bg-navy text-cream shadow-[0_12px_28px_rgba(13,26,64,0.12)]"
                  : "border-border bg-cream text-navy hover:border-orange/70"
              }`}
            >
              <span
                className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                  active ? "text-gold" : "text-orange"
                }`}
              >
                {option.label}
              </span>
              <span
                className={`mt-2 block text-sm leading-6 ${
                  active ? "text-cream/80" : "text-muted"
                }`}
              >
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ScienceRecommendationSimulator() {
  const [state, setState] = useState<ScienceSimulatorState>(
    defaultScienceSimulatorState,
  );
  const recommendation = useMemo(() => getScienceRecommendation(state), [state]);

  function updateState<T extends keyof ScienceSimulatorState>(
    key: T,
    value: ScienceSimulatorState[T],
  ) {
    const nextState = { ...state, [key]: value };
    const nextRecommendation = getScienceRecommendation(nextState);
    setState(nextState);
    track("science_simulator_interaction", {
      control: key,
      recommendation: nextRecommendation.action,
    });
  }

  return (
    <section
      id="simulator"
      className="bg-surface px-6 py-20"
      aria-labelledby="simulator-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
            Interactive simulator
          </p>
          <h2
            id="simulator-heading"
            className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl"
          >
            See how the training decision changes.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted">
            This is an illustrative model of the principles behind Sundee
            Fundee, not the exact production scoring algorithm. It shows how
            readiness, cycle context, pain, and session goal can change the
            safest useful version of the workout.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-8">
            <OptionGroup
              legend="Readiness"
              description="How recovered does today look before the warm-up?"
              value={state.readiness}
              options={readinessOptions}
              onChange={(value) => updateState("readiness", value)}
            />
            <OptionGroup
              legend="Cycle context"
              description="Use optional cycle context only when it is relevant."
              value={state.cycleContext}
              options={cycleOptions}
              onChange={(value) => updateState("cycleContext", value)}
            />
            <OptionGroup
              legend="Pain flag"
              description="Pain changes the training constraint before load changes."
              value={state.painFlag}
              options={painOptions}
              onChange={(value) => updateState("painFlag", value)}
            />
            <OptionGroup
              legend="Session goal"
              description="The same signals can mean different changes for different goals."
              value={state.sessionGoal}
              options={goalOptions}
              onChange={(value) => updateState("sessionGoal", value)}
            />
          </div>

          <div className="sticky top-28 rounded-[1.5rem] bg-navy p-6 text-cream shadow-[0_24px_70px_rgba(13,26,64,0.18)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cream/60">
                Suggested response
              </p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${actionColor(
                  recommendation.action,
                )}`}
              >
                {recommendation.action}
              </span>
            </div>
            <h3 className="font-display mt-5 text-3xl font-semibold">
              {recommendation.title}
            </h3>
            <p className="mt-4 text-base leading-7 text-cream/80">
              {recommendation.summary}
            </p>

            <dl className="mt-8 grid gap-4">
              {[
                ["Load", recommendation.load],
                ["Volume", recommendation.volume],
                ["Exercise", recommendation.exerciseSelection],
                ["Rest", recommendation.rest],
              ].map(([term, detail]) => (
                <div
                  key={term}
                  className="rounded-xl border border-cream/10 bg-cream/6 p-4"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                    {term}
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-cream/80">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 border-t border-cream/10 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/55">
                Why this recommendation changed
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-cream/80">
                {recommendation.rationale.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <AppStoreButtons
                utmCampaign="science"
                utmContent="simulator_cta"
                compact
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
