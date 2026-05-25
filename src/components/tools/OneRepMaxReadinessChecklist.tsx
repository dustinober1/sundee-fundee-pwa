"use client";

import { useMemo, useState } from "react";

const checks = [
  "I slept well enough to recover from a heavy attempt.",
  "I do not have a pain flare that changes setup or bar path.",
  "Recent heavy singles or doubles have looked technically stable.",
  "I have a safe rack, safeties, or reliable spotter setup.",
  "Today's max test fits the current training block instead of being impulsive.",
  "I know the jump plan and stop point before I start loading plates.",
] as const;

export function OneRepMaxReadinessChecklist() {
  const [selected, setSelected] = useState<string[]>(checks.slice(0, 3));

  const readiness = useMemo(() => {
    const score = Math.round((selected.length / checks.length) * 100);
    if (score >= 83) {
      return {
        label: "Ready to test",
        guidance:
          "Proceed if warm-ups stay crisp. Work up deliberately and keep the jump plan conservative.",
      };
    }

    if (score >= 50) {
      return {
        label: "Heavy single instead",
        guidance:
          "Treat today as heavy-skill practice. Take a strong single, then move to planned back-off work.",
      };
    }

    return {
      label: "Not a max day",
      guidance:
        "Shift the session down in cost. The better decision is to protect the next week, not force the headline lift.",
    };
  }, [selected]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <fieldset className="space-y-4">
          <legend className="font-display text-2xl font-semibold text-navy">
            Max-test checklist
          </legend>
          <p className="text-sm leading-7 text-muted">
            Check only the statements that are actually true today.
          </p>
          {checks.map((item) => {
            const checked = selected.includes(item);
            return (
              <label
                key={item}
                className="flex gap-3 rounded-2xl border border-border bg-surface p-4"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setSelected((current) =>
                      checked
                        ? current.filter((entry) => entry !== item)
                        : [...current, item],
                    )
                  }
                  className="mt-1 h-4 w-4 accent-orange"
                />
                <span className="text-sm leading-6 text-muted">{item}</span>
              </label>
            );
          })}
        </fieldset>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
          Decision
        </p>
        <p className="mt-4 text-sm text-muted">
          {selected.length} of {checks.length} readiness checks confirmed
        </p>
        <h3 className="font-display mt-4 text-3xl font-bold text-navy">
          {readiness.label}
        </h3>
        <p className="mt-4 text-base leading-8 text-muted">
          {readiness.guidance}
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Common downgrade
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            If the checklist is mixed, keep the day's intent but turn the max into a
            heavy single with one or two reps still in reserve.
          </p>
        </div>
      </div>
    </div>
  );
}
