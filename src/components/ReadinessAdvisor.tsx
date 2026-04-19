"use client";

import { useState } from "react";

type ReadinessKey = "fresh" | "steady" | "dragging" | "banged_up";

const options: Array<{
  key: ReadinessKey;
  label: string;
  title: string;
  description: string;
  recommendation: string;
}> = [
  {
    key: "fresh",
    label: "Green",
    title: "Fresh and ready",
    description: "Sleep was solid, pain is low, and you want a harder session.",
    recommendation: "Take the main lift or interval work and keep the session ambitious.",
  },
  {
    key: "steady",
    label: "Yellow",
    title: "Normal training day",
    description: "Nothing is perfect, but nothing is telling you to back off either.",
    recommendation: "Keep the plan, trim a little accessory volume, and move on.",
  },
  {
    key: "dragging",
    label: "Orange",
    title: "A bit cooked",
    description: "Work, travel, or poor sleep has taken the edge off your output.",
    recommendation: "Keep the pattern, reduce load, and bias technique or accessories.",
  },
  {
    key: "banged_up",
    label: "Red",
    title: "Beat up today",
    description: "Pain or fatigue is high enough that training hard would be a bad trade.",
    recommendation: "Choose recovery work, mobility, or a walk instead of forcing intensity.",
  },
];

export function ReadinessAdvisor() {
  const [selected, setSelected] = useState<ReadinessKey>("steady");
  const active = options.find((option) => option.key === selected) ?? options[1];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-[2rem] border border-border bg-surface p-8 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
            Interactive utility
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
            What should I train today?
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            This is a simple demo of the product logic. Pick the state that most
            matches today and get a clear training direction back immediately.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {options.map((option) => {
              const isActive = option.key === selected;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSelected(option.key)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-navy bg-navy text-cream shadow-[0_16px_30px_rgba(13,26,64,0.12)]"
                      : "border-border bg-cream text-navy hover:border-navy/40"
                  }`}
                >
                  <p
                    className={`text-xs font-medium uppercase tracking-[0.25em] ${
                      isActive ? "text-gold" : "text-muted"
                    }`}
                  >
                    {option.label}
                  </p>
                  <h3 className="font-display mt-2 text-xl font-semibold">
                    {option.title}
                  </h3>
                  <p className={`mt-2 text-sm leading-relaxed ${isActive ? "text-cream/80" : "text-muted"}`}>
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-navy/10 bg-navy p-8 text-cream">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/60">
            Suggested response
          </p>
          <h3 className="font-display mt-4 text-3xl font-semibold text-cream">
            {active.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-cream/80">
            {active.recommendation}
          </p>

          <div className="mt-8 rounded-[1.25rem] border border-cream/10 bg-cream/6 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cream/55">
              Why this helps
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream/80">
              The point is not to skip work. The point is to keep training
              without forcing the same stress on every day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
