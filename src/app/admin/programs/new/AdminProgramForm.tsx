"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import {
  createProgramTemplate,
  searchExercises,
  type CreateProgramState,
} from "./actions";

// ── Types ────────────────────────────────────────────────────────────────

type PhaseRow = {
  id: string;
  name: string;
  start_week: string;
  end_week: string;
};

type ExerciseRow = {
  id: string;
  exercise_id: string;
  exercise_name: string;
  sets: string;
  reps: string;
  pct_1rm: string;
};

type SessionSlot = { label: string; exercises: ExerciseRow[] };
type WeekState = { sessions: SessionSlot[] };
type ExerciseMatch = { id: string; name: string };

// ── Helpers ──────────────────────────────────────────────────────────────

function buildEmptySessions(count: number): SessionSlot[] {
  return Array.from({ length: count }, () => ({ label: "", exercises: [] }));
}

function buildInitialWeeks(
  durationWeeks: number,
  sessionsPerWeek: number,
): WeekState[] {
  return Array.from({ length: durationWeeks }, () => ({
    sessions: buildEmptySessions(sessionsPerWeek),
  }));
}

function newPhase(): PhaseRow {
  return {
    id: crypto.randomUUID(),
    name: "",
    start_week: "",
    end_week: "",
  };
}

function newExercise(): ExerciseRow {
  return {
    id: crypto.randomUUID(),
    exercise_id: "",
    exercise_name: "",
    sets: "",
    reps: "",
    pct_1rm: "",
  };
}

// ── Styles ───────────────────────────────────────────────────────────────

const INPUT_CLS =
  "mt-1 block w-full h-12 rounded-xl border border-border bg-surface px-3 focus:border-navy focus:outline-none";
const SMALL_INPUT_CLS =
  "h-10 w-16 rounded-xl border border-border bg-surface px-2 focus:border-navy focus:outline-none text-sm";
const TEXTAREA_CLS =
  "mt-1 block w-full rounded-xl border border-border bg-surface p-3 focus:border-navy focus:outline-none";
const SECTION_LABEL_CLS =
  "text-xs text-gold uppercase tracking-[0.3em]";
const ADD_BTN_CLS = "text-sm text-gold hover:underline";
const REMOVE_BTN_CLS = "text-xs text-muted hover:text-recovery-risk";

// ── Component ────────────────────────────────────────────────────────────

export function AdminProgramForm() {
  const [state, action, pending] = useActionState<
    CreateProgramState | undefined,
    FormData
  >(createProgramTemplate, undefined);

  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [phases, setPhases] = useState<PhaseRow[]>([newPhase()]);
  const [weeks, setWeeks] = useState<WeekState[]>(() =>
    buildInitialWeeks(4, 3),
  );
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<
    Record<string, ExerciseMatch[]>
  >({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Phase handlers ─────────────────────────────────────────────────────
  function addPhase() {
    setPhases((prev) => [...prev, newPhase()]);
  }
  function removePhase(id: string) {
    setPhases((prev) => prev.filter((p) => p.id !== id));
  }
  function updatePhase(id: string, field: keyof PhaseRow, value: string) {
    setPhases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  }

  // ── Duration / sessions reconciliation ─────────────────────────────────
  function handleDurationChange(newCount: number) {
    const n = Number.isFinite(newCount) && newCount > 0 ? newCount : 1;
    setDurationWeeks(n);
    setWeeks((prev) => {
      const next = [...prev];
      while (next.length < n) {
        next.push({ sessions: buildEmptySessions(sessionsPerWeek) });
      }
      return next.slice(0, n);
    });
  }

  function handleSessionsPerWeekChange(newCount: number) {
    const n = Number.isFinite(newCount) && newCount > 0 ? newCount : 1;
    setSessionsPerWeek(n);
    setWeeks((prev) =>
      prev.map((w) => {
        const next = [...w.sessions];
        while (next.length < n) next.push({ label: "", exercises: [] });
        return { sessions: next.slice(0, n) };
      }),
    );
  }

  // ── Session / exercise handlers ────────────────────────────────────────
  function updateSessionLabel(
    weekIdx: number,
    sessionIdx: number,
    label: string,
  ) {
    setWeeks((prev) =>
      prev.map((w, wi) =>
        wi !== weekIdx
          ? w
          : {
              sessions: w.sessions.map((s, si) =>
                si !== sessionIdx ? s : { ...s, label },
              ),
            },
      ),
    );
  }

  function addExercise(weekIdx: number, sessionIdx: number) {
    setWeeks((prev) =>
      prev.map((w, wi) =>
        wi !== weekIdx
          ? w
          : {
              sessions: w.sessions.map((s, si) =>
                si !== sessionIdx
                  ? s
                  : { ...s, exercises: [...s.exercises, newExercise()] },
              ),
            },
      ),
    );
  }

  function removeExercise(
    weekIdx: number,
    sessionIdx: number,
    exId: string,
  ) {
    setWeeks((prev) =>
      prev.map((w, wi) =>
        wi !== weekIdx
          ? w
          : {
              sessions: w.sessions.map((s, si) =>
                si !== sessionIdx
                  ? s
                  : {
                      ...s,
                      exercises: s.exercises.filter((e) => e.id !== exId),
                    },
              ),
            },
      ),
    );
    setSearchResults((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [exId]: _, ...rest } = prev;
      return rest;
    });
  }

  function updateExercise(
    weekIdx: number,
    sessionIdx: number,
    exId: string,
    patch: Partial<ExerciseRow>,
  ) {
    setWeeks((prev) =>
      prev.map((w, wi) =>
        wi !== weekIdx
          ? w
          : {
              sessions: w.sessions.map((s, si) =>
                si !== sessionIdx
                  ? s
                  : {
                      ...s,
                      exercises: s.exercises.map((e) =>
                        e.id === exId ? { ...e, ...patch } : e,
                      ),
                    },
              ),
            },
      ),
    );
  }

  // ── Type-ahead ─────────────────────────────────────────────────────────
  function handleSearchChange(
    weekIdx: number,
    sessionIdx: number,
    exId: string,
    value: string,
  ) {
    // Update the input value immediately (controlled); clear exercise_id if typing again
    updateExercise(weekIdx, sessionIdx, exId, {
      exercise_name: value,
      exercise_id: "",
    });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (value.length >= 2) {
        const results = await searchExercises(value);
        setSearchResults((prev) => ({ ...prev, [exId]: results }));
      } else {
        setSearchResults((prev) => ({ ...prev, [exId]: [] }));
      }
    }, 300);
  }

  function selectExercise(
    weekIdx: number,
    sessionIdx: number,
    exId: string,
    match: ExerciseMatch,
  ) {
    updateExercise(weekIdx, sessionIdx, exId, {
      exercise_id: match.id,
      exercise_name: match.name,
    });
    setSearchResults((prev) => ({ ...prev, [exId]: [] }));
  }

  // ── Payload assembly (fresh every render) ──────────────────────────────
  const payload = JSON.stringify({
    name: formName,
    description: formDesc,
    duration_weeks: durationWeeks,
    sessions_per_week: sessionsPerWeek,
    phases: phases.map((p) => ({
      name: p.name,
      start_week: p.start_week,
      end_week: p.end_week,
    })),
    weeks: weeks.map((w, i) => ({
      week_num: i + 1,
      sessions: w.sessions.map((s) => ({
        label: s.label,
        exercises: s.exercises.map((e) => ({
          exercise_id: e.exercise_id,
          sets: e.sets,
          reps: e.reps,
          pct_1rm: e.pct_1rm,
        })),
      })),
    })),
  });

  const err = state?.errors ?? {};

  return (
    <form action={action} className="mt-2">
      <input type="hidden" name="payload" value={payload} />

      <Link
        href="/programs"
        className="text-xs text-muted underline-offset-4 hover:underline"
      >
        ← Programs
      </Link>
      <h1 className="font-display mt-3 text-4xl font-semibold">New Program</h1>
      <p className="mt-2 text-sm text-muted">
        Fill in the template details below, then define phases and weekly
        sessions.
      </p>

      {/* ── Template metadata ──────────────────────────────────────── */}
      <div className="mt-8 space-y-4">
        <label className="block text-sm">
          <span className="block font-medium text-navy">Name</span>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g. Starting Strength — 4-Week Beginner"
            className={INPUT_CLS}
          />
          {err.name ? (
            <span className="mt-1 block text-xs text-recovery-risk">
              {err.name[0]}
            </span>
          ) : null}
        </label>

        <label className="block text-sm">
          <span className="block font-medium text-navy">
            Description (optional)
          </span>
          <textarea
            rows={3}
            maxLength={1000}
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            className={TEXTAREA_CLS}
          />
          {err.description ? (
            <span className="mt-1 block text-xs text-recovery-risk">
              {err.description[0]}
            </span>
          ) : null}
        </label>

        <div className="flex gap-4">
          <label className="block text-sm">
            <span className="block font-medium text-navy">Duration (weeks)</span>
            <input
              type="number"
              min={1}
              max={52}
              value={durationWeeks}
              onChange={(e) =>
                handleDurationChange(parseInt(e.target.value, 10))
              }
              className="mt-1 block h-12 w-24 rounded-xl border border-border bg-surface px-3 focus:border-navy focus:outline-none"
            />
            {err.duration_weeks ? (
              <span className="mt-1 block text-xs text-recovery-risk">
                {err.duration_weeks[0]}
              </span>
            ) : null}
          </label>

          <label className="block text-sm">
            <span className="block font-medium text-navy">Sessions / week</span>
            <input
              type="number"
              min={1}
              max={7}
              value={sessionsPerWeek}
              onChange={(e) =>
                handleSessionsPerWeekChange(parseInt(e.target.value, 10))
              }
              className="mt-1 block h-12 w-20 rounded-xl border border-border bg-surface px-3 focus:border-navy focus:outline-none"
            />
            {err.sessions_per_week ? (
              <span className="mt-1 block text-xs text-recovery-risk">
                {err.sessions_per_week[0]}
              </span>
            ) : null}
          </label>
        </div>
      </div>

      {/* ── Phases ─────────────────────────────────────────────────── */}
      <section className="mt-6 rounded-2xl border border-gold bg-surface p-5">
        <p className={SECTION_LABEL_CLS}>Phases</p>
        <ul className="mt-3 space-y-3">
          {phases.map((p) => (
            <li key={p.id} className="flex flex-wrap items-end gap-3">
              <label className="block text-sm flex-1 min-w-[12rem]">
                <span className="block font-medium text-navy">Name</span>
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => updatePhase(p.id, "name", e.target.value)}
                  className={INPUT_CLS}
                />
              </label>
              <label className="block text-sm">
                <span className="block font-medium text-navy">Start</span>
                <input
                  type="number"
                  min={1}
                  value={p.start_week}
                  onChange={(e) =>
                    updatePhase(p.id, "start_week", e.target.value)
                  }
                  className="mt-1 block h-12 w-20 rounded-xl border border-border bg-surface px-3 focus:border-navy focus:outline-none"
                />
              </label>
              <label className="block text-sm">
                <span className="block font-medium text-navy">End</span>
                <input
                  type="number"
                  min={1}
                  value={p.end_week}
                  onChange={(e) =>
                    updatePhase(p.id, "end_week", e.target.value)
                  }
                  className="mt-1 block h-12 w-20 rounded-xl border border-border bg-surface px-3 focus:border-navy focus:outline-none"
                />
              </label>
              {phases.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removePhase(p.id)}
                  className={REMOVE_BTN_CLS}
                >
                  Remove
                </button>
              ) : null}
            </li>
          ))}
        </ul>
        {err.phases ? (
          <span className="mt-2 block text-xs text-recovery-risk">
            {err.phases[0]}
          </span>
        ) : null}
        <button
          type="button"
          onClick={addPhase}
          className={`${ADD_BTN_CLS} mt-3 inline-block`}
        >
          + Add Phase
        </button>
      </section>

      {/* ── Week Sessions ───────────────────────────────────────────── */}
      <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <p className={SECTION_LABEL_CLS}>Week Sessions</p>
        <div className="mt-3 space-y-2">
          {weeks.map((w, weekIdx) => {
            const isOpen = openWeek === weekIdx;
            return (
              <div key={weekIdx}>
                <button
                  type="button"
                  onClick={() => setOpenWeek(isOpen ? null : weekIdx)}
                  className={`flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium ${
                    isOpen ? "rounded-b-none" : ""
                  }`}
                  aria-expanded={isOpen}
                >
                  <span>Week {weekIdx + 1}</span>
                  <span>{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen ? (
                  <div className="bg-surface px-4 pb-4 rounded-b-xl border-x border-b border-border -mt-px pt-3 space-y-4">
                    {w.sessions.length === 0 ? (
                      <p className="text-xs text-muted">
                        No sessions added yet. Add an exercise to begin.
                      </p>
                    ) : null}
                    {w.sessions.map((s, sessionIdx) => (
                      <div
                        key={sessionIdx}
                        className="rounded-xl border border-border p-3"
                      >
                        <label className="block text-sm">
                          <span className="block font-medium text-navy">
                            Session {sessionIdx + 1} label
                          </span>
                          <input
                            type="text"
                            value={s.label}
                            onChange={(e) =>
                              updateSessionLabel(
                                weekIdx,
                                sessionIdx,
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Session A"
                            className={INPUT_CLS}
                          />
                        </label>

                        <ul className="mt-3 space-y-2">
                          {s.exercises.map((ex) => {
                            const results = searchResults[ex.id] ?? [];
                            const showDropdown =
                              ex.exercise_name.length >= 2 &&
                              !ex.exercise_id &&
                              results.length >= 0;
                            return (
                              <li
                                key={ex.id}
                                className="flex flex-wrap items-end gap-2"
                              >
                                <div className="relative flex-1 min-w-[12rem]">
                                  <label className="block text-sm">
                                    <span className="block font-medium text-navy">
                                      Exercise
                                    </span>
                                    <input
                                      type="text"
                                      value={ex.exercise_name}
                                      placeholder="Search exercises…"
                                      onChange={(e) =>
                                        handleSearchChange(
                                          weekIdx,
                                          sessionIdx,
                                          ex.id,
                                          e.target.value,
                                        )
                                      }
                                      className={INPUT_CLS}
                                      role="combobox"
                                      aria-expanded={showDropdown}
                                      aria-controls="combobox-dropdown"
                                    />
                                  </label>
                                  {showDropdown ? (
                                    <ul
                                      role="listbox"
                                      className="absolute z-10 w-full bg-surface border border-border rounded-xl shadow-sm mt-1"
                                    >
                                      {results.length === 0 ? (
                                        <li className="px-3 py-2 text-sm text-muted">
                                          No exercises found.
                                        </li>
                                      ) : (
                                        results.map((m) => (
                                          <li
                                            key={m.id}
                                            role="option"
                                            aria-selected={false}
                                            onMouseDown={(e) =>
                                              e.preventDefault()
                                            }
                                            onClick={() =>
                                              selectExercise(
                                                weekIdx,
                                                sessionIdx,
                                                ex.id,
                                                m,
                                              )
                                            }
                                            className="px-3 py-2 text-sm hover:bg-cream cursor-pointer"
                                          >
                                            {m.name}
                                          </li>
                                        ))
                                      )}
                                    </ul>
                                  ) : null}
                                </div>
                                <label className="block text-sm">
                                  <span className="block font-medium text-navy">
                                    Sets
                                  </span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={ex.sets}
                                    onChange={(e) =>
                                      updateExercise(
                                        weekIdx,
                                        sessionIdx,
                                        ex.id,
                                        { sets: e.target.value },
                                      )
                                    }
                                    className={SMALL_INPUT_CLS}
                                  />
                                </label>
                                <label className="block text-sm">
                                  <span className="block font-medium text-navy">
                                    Reps
                                  </span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={ex.reps}
                                    onChange={(e) =>
                                      updateExercise(
                                        weekIdx,
                                        sessionIdx,
                                        ex.id,
                                        { reps: e.target.value },
                                      )
                                    }
                                    className={SMALL_INPUT_CLS}
                                  />
                                </label>
                                <label className="block text-sm">
                                  <span className="block font-medium text-navy">
                                    %1RM
                                  </span>
                                  <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={ex.pct_1rm}
                                    onChange={(e) =>
                                      updateExercise(
                                        weekIdx,
                                        sessionIdx,
                                        ex.id,
                                        { pct_1rm: e.target.value },
                                      )
                                    }
                                    className={SMALL_INPUT_CLS}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeExercise(weekIdx, sessionIdx, ex.id)
                                  }
                                  className={REMOVE_BTN_CLS}
                                >
                                  Remove
                                </button>
                              </li>
                            );
                          })}
                        </ul>

                        <button
                          type="button"
                          onClick={() => addExercise(weekIdx, sessionIdx)}
                          className={`${ADD_BTN_CLS} mt-3 inline-block`}
                        >
                          + Add Exercise
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        {err.weeks ? (
          <span className="mt-2 block text-xs text-recovery-risk">
            {err.weeks[0]}
          </span>
        ) : null}
      </section>

      {/* ── Global error ───────────────────────────────────────────── */}
      {state?.message ? (
        <p className="mt-6 rounded-lg border border-recovery-risk/40 bg-recovery-risk/10 p-3 text-sm text-recovery-risk">
          {state.message}
        </p>
      ) : null}

      {/* ── Submit ─────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex w-full h-12 items-center justify-center rounded-lg bg-orange font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create Program"}
      </button>
    </form>
  );
}
