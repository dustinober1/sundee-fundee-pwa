"use client";

import { useState } from "react";

const rows = [
  { rpe: "6", rir: "4", cue: "Fast, easy practice", use: "Technique work and low-fatigue volume" },
  { rpe: "7", rir: "3", cue: "Controlled but meaningful", use: "Most normal work sets" },
  { rpe: "8", rir: "2", cue: "Strong work without grind", use: "Top sets and productive hypertrophy" },
  { rpe: "9", rir: "1", cue: "Very hard but still clean", use: "Selective heavy singles or last hard set" },
  { rpe: "10", rir: "0", cue: "No reps left", use: "Rare max effort, not everyday programming" },
] as const;

export function RpeRirChart() {
  const [activeRpe, setActiveRpe] = useState("8");
  const activeRow = rows.find((row) => row.rpe === activeRpe) ?? rows[2];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-navy text-left text-cream">
            <tr>
              <th className="px-5 py-4 text-sm font-semibold">RPE</th>
              <th className="px-5 py-4 text-sm font-semibold">RIR</th>
              <th className="px-5 py-4 text-sm font-semibold">How it should feel</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const active = row.rpe === activeRpe;
              return (
                <tr
                  key={row.rpe}
                  className={`border-t border-border ${active ? "bg-gold/15" : "bg-white"}`}
                >
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setActiveRpe(row.rpe)}
                      className="font-semibold text-navy underline-offset-4 hover:underline"
                    >
                      {row.rpe}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">{row.rir}</td>
                  <td className="px-5 py-4 text-sm leading-6 text-muted">{row.cue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
          Selected effort
        </p>
        <h3 className="font-display mt-4 text-3xl font-bold text-navy">
          RPE {activeRow.rpe} usually means about {activeRow.rir} reps left
        </h3>
        <p className="mt-4 text-base leading-8 text-muted">{activeRow.use}</p>
        <div className="mt-8 rounded-2xl border border-border bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Good coaching question
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            If the bar speed and form say the set was harder than planned, treat the
            effort honestly even if the rep target was completed.
          </p>
        </div>
      </div>
    </div>
  );
}
