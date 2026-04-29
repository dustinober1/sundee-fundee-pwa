"use client";

import { useState } from "react";
import type { BlogInteractiveModule as BlogInteractiveModuleType } from "@/app/blog/posts";

type BlogInteractiveModuleProps = {
  module: BlogInteractiveModuleType;
};

const moduleEyebrows: Record<BlogInteractiveModuleType["type"], string> = {
  "comparison-cards": "Interactive comparison",
  "decision-guide": "Decision guide",
  "metric-explainer": "Signal translator",
  "modification-checklist": "Modification checklist",
  "readiness-check": "Readiness check",
  timeline: "Timeline",
};

export function BlogInteractiveModule({ module }: BlogInteractiveModuleProps) {
  const [selectedKey, setSelectedKey] = useState(module.choices[0]?.key ?? "");
  const activeChoice =
    module.choices.find((choice) => choice.key === selectedKey) ?? module.choices[0];

  if (!activeChoice) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-border bg-surface p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
            {moduleEyebrows[module.type]}
          </p>
          <h2 className="font-display mt-4 text-3xl font-bold text-navy sm:text-4xl">
            {module.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted">{module.prompt}</p>

          <div className="mt-8 grid gap-3">
            {module.choices.map((choice) => {
              const isActive = choice.key === activeChoice.key;

              return (
                <button
                  key={choice.key}
                  type="button"
                  onClick={() => setSelectedKey(choice.key)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-navy bg-navy text-cream shadow-[0_18px_38px_rgba(13,26,64,0.12)]"
                      : "border-border bg-cream text-navy hover:border-navy/35"
                  }`}
                >
                  <p
                    className={`text-xs font-medium uppercase tracking-[0.25em] ${
                      isActive ? "text-gold" : "text-muted"
                    }`}
                  >
                    {choice.label}
                  </p>
                  <h3 className="font-display mt-2 text-xl font-semibold">
                    {choice.title}
                  </h3>
                  <p className={`mt-2 text-sm leading-relaxed ${isActive ? "text-cream/80" : "text-muted"}`}>
                    {choice.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-navy/10 bg-navy p-6 text-cream sm:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/60">
            Suggested read of the situation
          </p>
          <h3 className="font-display mt-4 text-3xl font-semibold text-cream">
            {activeChoice.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-cream/82">
            {activeChoice.response}
          </p>

          {module.note ? (
            <div className="mt-8 rounded-[1.25rem] border border-cream/10 bg-cream/6 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cream/55">
                Best for
              </p>
              <p className="mt-3 text-sm leading-relaxed text-cream/80">
                {module.note}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
