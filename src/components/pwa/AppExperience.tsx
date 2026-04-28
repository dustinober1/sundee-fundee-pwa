"use client";

import type { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { calculatePlates, estimatedOneRepMax, roundWeight } from "@/lib/pwa/calculations";
import {
  calculateCycleStatus,
  getPhaseRecommendation,
  type CycleStatus,
  type PhaseRecommendation,
} from "@/lib/pwa/cycle";
import {
  enableCloudSync,
  getCloudSyncMetadata,
  runCloudSync,
  type CloudSyncMetadata,
  type CloudSyncResult,
  type CloudSyncStatus,
} from "@/lib/pwa/cloud-sync";
import {
  addPeriodLog,
  completeActiveProgramSession,
  countLocalRecords,
  createQuickWorkout,
  deleteAllLocalData,
  enrollFirstMargaritaProgram,
  exportLocalData,
  getActiveProgramSession,
  getBestLift,
  getCycleInputs,
  getLatestRecoveryScore,
  getStoredDataMode,
  saveCycleSettings,
  saveDataMode,
  saveRecoveryScore,
  type ActiveProgramSession,
} from "@/lib/pwa/local-repositories";
import { buildLocalTrainingRecommendation } from "@/lib/pwa/recommendations";
import type {
  DataMode,
  ExerciseRecord,
  LiftRecord,
  RecoveryScoreRecord,
} from "@/lib/pwa/schema";
import {
  getCloudUser,
  isSupabaseBrowserConfigured,
} from "@/lib/pwa/supabase-browser";

type LocalCounts = Awaited<ReturnType<typeof countLocalRecords>>;
type BestLift = { lift: LiftRecord; exercise?: ExerciseRecord };
type AppScreen = "today" | "log" | "cycle" | "recovery" | "programs" | "data";
type CloudState = CloudSyncMetadata & {
  connected: boolean;
  userEmail: string | null;
  status: CloudSyncStatus;
  lastResult: CloudSyncResult | null;
};

const navItems: Array<{ id: AppScreen; label: string }> = [
  { id: "today", label: "Today" },
  { id: "log", label: "Log" },
  { id: "cycle", label: "Cycle" },
  { id: "recovery", label: "Recovery" },
  { id: "programs", label: "Programs" },
  { id: "data", label: "Data" },
];

const defaultCounts: LocalCounts = {
  workouts: 0,
  exercises: 0,
  lifts: 0,
  periodLogs: 0,
  recoveryScores: 0,
  programs: 0,
  programEnrollments: 0,
  injuries: 0,
  queuedMutations: 0,
};

const defaultCloudState: CloudState = {
  enabled: false,
  lastPulledAt: null,
  lastSuccessfulSyncAt: null,
  lastError: null,
  deviceId: null,
  connected: false,
  userEmail: null,
  status: "disabled",
  lastResult: null,
};

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function statusLabel(
  mode: DataMode | null,
  online: boolean,
  cloudStatus: CloudSyncStatus,
) {
  if (!mode) return "Onboarding";
  if (mode === "local-only") return "Local only";
  if (!online) return "Offline";
  if (cloudStatus === "synced") return "Cloud synced";
  if (cloudStatus === "failed") return "Sync failed";
  if (cloudStatus === "signed-out") return "Sign in to sync";
  if (cloudStatus === "not-configured") return "Cloud not configured";
  return "Cloud sync ready";
}

function cloudStatusTitle(status: CloudSyncStatus) {
  switch (status) {
    case "not-configured":
      return "Cloud sync not configured";
    case "signed-out":
      return "Signed out";
    case "offline":
      return "Offline";
    case "syncing":
      return "Syncing";
    case "synced":
      return "Synced";
    case "failed":
      return "Sync failed";
    case "disabled":
      return "Connected, not syncing";
  }
}

function formatDateTime(value: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function recoveryLabel(score?: number) {
  if (typeof score !== "number") return "No score yet";
  if (score >= 70) return "Push day";
  if (score >= 40) return "Moderate";
  return "Rest day";
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-cream p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="font-display mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}

export function AppExperience() {
  const [mode, setMode] = useState<DataMode | null>(null);
  const [screen, setScreen] = useState<AppScreen>("today");
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [counts, setCounts] = useState<LocalCounts>(defaultCounts);
  const [bestLift, setBestLift] = useState<BestLift | null>(null);
  const [cycleStatus, setCycleStatus] = useState<CycleStatus | null>(null);
  const [phaseRecommendation, setPhaseRecommendation] =
    useState<PhaseRecommendation | null>(null);
  const [latestRecovery, setLatestRecovery] = useState<RecoveryScoreRecord | null>(null);
  const [activeProgram, setActiveProgram] = useState<ActiveProgramSession | null>(null);
  const [cloudState, setCloudState] = useState<CloudState>(defaultCloudState);
  const [busy, setBusy] = useState(false);
  const [exerciseName, setExerciseName] = useState("Back squat");
  const [weight, setWeight] = useState("135");
  const [reps, setReps] = useState("5");
  const [unit, setUnit] = useState<"lb" | "kg">("lb");
  const [periodStartedOn, setPeriodStartedOn] = useState(todayString);
  const [sleepHours, setSleepHours] = useState("7.5");
  const [soreness, setSoreness] = useState("3");
  const [stress, setStress] = useState("3");
  const cloudConfigured = isSupabaseBrowserConfigured();

  const estimate = useMemo(() => {
    const value = estimatedOneRepMax(Number(weight), Number(reps));
    return value ? roundWeight(value) : null;
  }, [reps, weight]);

  const plates = useMemo(() => {
    if (unit !== "lb") return [];
    return calculatePlates(Number(weight));
  }, [unit, weight]);

  const signal = useMemo(() => {
    if (latestRecovery) return recoveryLabel(latestRecovery.score);
    if (cycleStatus) return getPhaseRecommendation(cycleStatus.currentPhase).trainingFocus;
    if (counts.workouts === 0) return "Ready to train";
    return "Saved locally";
  }, [counts.workouts, cycleStatus, latestRecovery]);

  const recommendation = useMemo(
    () =>
      buildLocalTrainingRecommendation({
        recoveryScore: latestRecovery?.score ?? null,
        cyclePhase: cycleStatus?.currentPhase ?? null,
        soreness: latestRecovery?.soreness ?? null,
        stress: latestRecovery?.stress ?? null,
        recentWorkoutCount: counts.workouts,
        programSession: activeProgram?.session ?? null,
      }),
    [
      activeProgram?.session,
      counts.workouts,
      cycleStatus?.currentPhase,
      latestRecovery?.score,
      latestRecovery?.soreness,
      latestRecovery?.stress,
    ],
  );

  async function refreshLocalState() {
    const [nextCounts, nextBestLift, cycleInputs, recovery, programSession] =
      await Promise.all([
        countLocalRecords(),
        getBestLift(),
        getCycleInputs(),
        getLatestRecoveryScore(),
        getActiveProgramSession(),
      ]);
    const status =
      cycleInputs.settings && cycleInputs.periodLogs.length > 0
        ? calculateCycleStatus(cycleInputs.periodLogs, cycleInputs.settings)
        : null;

    setCounts(nextCounts);
    setBestLift(nextBestLift);
    setCycleStatus(status);
    setPhaseRecommendation(status ? getPhaseRecommendation(status.currentPhase) : null);
    setLatestRecovery(recovery ?? null);
    setActiveProgram(programSession);
  }

  async function refreshCloudState(lastResult: CloudSyncResult | null = null) {
    if (!cloudConfigured) {
      const nextState = {
        ...defaultCloudState,
        status: "not-configured" as const,
        lastResult,
      };
      setCloudState(nextState);
      return nextState;
    }

    const [metadata, user] = await Promise.all([
      getCloudSyncMetadata(),
      getCloudUser(),
    ]);
    const connected = Boolean(user);
    const status: CloudSyncStatus = !online
      ? "offline"
      : !connected
        ? "signed-out"
        : !metadata.enabled
          ? "disabled"
          : metadata.lastError
            ? "failed"
            : metadata.lastSuccessfulSyncAt
              ? "synced"
              : "disabled";
    const nextState = {
      ...metadata,
      connected,
      userEmail: user?.email ?? null,
      status,
      lastResult,
    };

    setCloudState(nextState);
    return nextState;
  }

  async function syncCloudData(options: { enable?: boolean } = {}) {
    if (!cloudConfigured) {
      await refreshCloudState({
        status: "not-configured",
        pushed: 0,
        pulled: 0,
        skipped: 0,
        failed: 0,
        queued: counts.queuedMutations,
        errors: [],
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
      });
      return;
    }

    if (!cloudState.connected) {
      window.location.href = "/auth/sign-in";
      return;
    }

    setCloudState((current) => ({ ...current, status: "syncing", lastError: null }));
    setBusy(true);
    try {
      if (options.enable) {
        await enableCloudSync();
      }
      const result = await runCloudSync();
      await refreshLocalState();
      await refreshCloudState(result);
    } catch (error) {
      const result: CloudSyncResult = {
        status: "failed",
        pushed: 0,
        pulled: 0,
        skipped: 0,
        failed: 1,
        queued: counts.queuedMutations,
        errors: [
          {
            message: error instanceof Error ? error.message : String(error),
          },
        ],
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
      };
      await refreshCloudState(result);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const loadCloudState = async (lastResult: CloudSyncResult | null = null) => {
      if (!cloudConfigured) {
        const nextState = {
          ...defaultCloudState,
          status: "not-configured" as const,
          lastResult,
        };
        setCloudState(nextState);
        return nextState;
      }

      const [metadata, user] = await Promise.all([
        getCloudSyncMetadata(),
        getCloudUser(),
      ]);
      const connected = Boolean(user);
      const status: CloudSyncStatus = !navigator.onLine
        ? "offline"
        : !connected
          ? "signed-out"
          : !metadata.enabled
            ? "disabled"
            : metadata.lastError
              ? "failed"
              : metadata.lastSuccessfulSyncAt
                ? "synced"
                : "disabled";
      const nextState = {
        ...metadata,
        connected,
        userEmail: user?.email ?? null,
        status,
        lastResult,
      };
      setCloudState(nextState);
      return nextState;
    };

    const syncIfReady = async () => {
      const result = await runCloudSync();
      await refreshLocalState();
      await loadCloudState(result);
    };

    const syncMode = async () => {
      const storedMode = await getStoredDataMode();
      setMode(storedMode);
      await refreshLocalState();
      const state = await loadCloudState();
      if (storedMode === "cloud-sync" && state.enabled && state.connected) {
        void syncIfReady();
      }
    };
    const handleOnline = () => {
      setOnline(true);
      void loadCloudState().then((state) => {
        if (state.enabled && state.connected) {
          void syncIfReady();
        }
      });
    };
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    void syncMode();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [cloudConfigured]);

  async function chooseMode(nextMode: DataMode) {
    setBusy(true);
    try {
      await saveDataMode(nextMode);
      setMode(nextMode);
      await refreshLocalState();
      await refreshCloudState();
    } finally {
      setBusy(false);
    }
  }

  async function handleWorkoutSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedWeight = Number(weight);
    const parsedReps = Number(reps);
    if (!exerciseName.trim() || parsedWeight < 0 || parsedReps < 1) return;

    setBusy(true);
    try {
      await createQuickWorkout({
        exerciseName,
        weight: parsedWeight,
        reps: parsedReps,
        unit,
      });
      await refreshLocalState();
      setScreen("today");
    } finally {
      setBusy(false);
    }
  }

  async function handleCycleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await saveCycleSettings({
        averageCycleLengthDays: 28,
        averagePeriodLengthDays: 5,
        lutealPhaseLengthDays: 14,
        trackingEnabled: true,
      });
      await addPeriodLog({ startedOn: periodStartedOn });
      await refreshLocalState();
      setScreen("today");
    } finally {
      setBusy(false);
    }
  }

  async function handleRecoverySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await saveRecoveryScore({
        sleepHours: Number(sleepHours),
        soreness: Number(soreness),
        stress: Number(stress),
        cyclePhase: cycleStatus?.currentPhase ?? null,
      });
      await refreshLocalState();
      setScreen("today");
    } finally {
      setBusy(false);
    }
  }

  async function handleProgramEnroll() {
    setBusy(true);
    try {
      await enrollFirstMargaritaProgram();
      await refreshLocalState();
    } finally {
      setBusy(false);
    }
  }

  async function handleProgramComplete() {
    setBusy(true);
    try {
      await completeActiveProgramSession();
      await refreshLocalState();
      setScreen("today");
    } finally {
      setBusy(false);
    }
  }

  async function downloadExport() {
    const data = await exportLocalData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sundee-fundee-export-${data.exportedAt.slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function clearLocalData() {
    if (!confirm("Delete all local Sundee Fundee data on this device?")) return;

    setBusy(true);
    try {
      await deleteAllLocalData();
      setMode(null);
      setBestLift(null);
      setCycleStatus(null);
      setPhaseRecommendation(null);
      setLatestRecovery(null);
      setActiveProgram(null);
      setCounts(defaultCounts);
      setScreen("today");
    } finally {
      setBusy(false);
    }
  }

  if (!mode) {
    return (
      <main className="min-h-dvh overflow-hidden bg-[linear-gradient(135deg,#f4f0df_0%,#f9f6ea_42%,#dbe7df_100%)] text-navy">
        <div className="mx-auto grid min-h-dvh max-w-6xl px-5 py-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8">
          <section className="flex flex-col justify-between py-4">
            <Link href="/" className="flex w-fit items-center gap-3">
              <Image
                src="/Logo.jpeg"
                alt="Sundee Fundee"
                width={42}
                height={42}
                className="h-[42px] w-[42px] rounded-full border border-navy/10 object-cover"
              />
              <span className="font-display text-2xl font-semibold">
                Sundee Fundee
              </span>
            </Link>

            <div className="py-12">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
                Privacy-first PWA
              </p>
              <h1 className="font-display mt-5 max-w-xl text-5xl font-bold leading-[1.02] sm:text-6xl">
                Train from the device in your hand.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-muted">
                Local workout logging is the default. Cloud backup is a choice,
                not a requirement.
              </p>
            </div>

            <p className="hidden max-w-sm text-sm leading-6 text-muted lg:block">
              Your first decision sets where training data lives. You can export
              local data any time.
            </p>
          </section>

          <section className="flex items-center pb-8 lg:pb-0">
            <div className="w-full rounded-lg border border-navy/12 bg-surface/88 p-4 shadow-[0_24px_80px_rgba(13,26,64,0.14)] backdrop-blur md:p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => chooseMode("local-only")}
                  className="group min-h-64 rounded-lg border border-navy/12 bg-cream p-5 text-left transition hover:-translate-y-0.5 hover:border-orange hover:shadow-lg disabled:opacity-60"
                >
                  <span className="inline-flex h-9 items-center rounded-full bg-navy px-3 text-xs font-bold uppercase tracking-[0.18em] text-cream">
                    Local only
                  </span>
                  <h2 className="font-display mt-8 text-3xl font-semibold">
                    Keep data on this device.
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-muted">
                    Workouts, cycle logs, recovery notes, and exports stay in
                    browser storage unless you choose otherwise.
                  </p>
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => chooseMode("cloud-sync")}
                  className="group min-h-64 rounded-lg border border-navy/12 bg-[#e7eee8] p-5 text-left transition hover:-translate-y-0.5 hover:border-orange hover:shadow-lg disabled:opacity-60"
                >
                  <span className="inline-flex h-9 items-center rounded-full bg-orange px-3 text-xs font-bold uppercase tracking-[0.18em] text-cream">
                    Cloud sync
                  </span>
                  <h2 className="font-display mt-8 text-3xl font-semibold">
                    Back up across devices.
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-muted">
                    Sync uses an account and Supabase RLS. Local data is not
                    uploaded until sync is enabled.
                  </p>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const screenTitle =
    navItems.find((item) => item.id === screen)?.label ?? "Today";

  return (
    <main className="h-dvh overflow-hidden bg-[#f6f2e4] text-navy">
      <div className="mx-auto grid h-dvh max-w-7xl md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-border bg-cream/75 px-4 py-5 md:flex md:flex-col">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/Logo.jpeg"
              alt=""
              width={34}
              height={34}
              className="h-[34px] w-[34px] rounded-full object-cover"
            />
            <span className="font-display text-xl font-semibold">Sundee</span>
          </Link>
          <nav className="mt-10 grid gap-2 text-sm font-semibold">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setScreen(item.id)}
                className={`rounded-lg px-3 py-2 text-left transition ${
                  screen === item.id
                    ? "bg-navy text-cream"
                    : "text-muted hover:bg-navy/5 hover:text-navy"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <Link
            href="/donate"
            className="mt-auto rounded-lg bg-orange px-4 py-2 text-center text-sm font-semibold text-cream"
          >
            Donate
          </Link>
        </aside>

        <section className="grid h-dvh grid-rows-[auto_1fr_auto] overflow-hidden">
          <header className="border-b border-border bg-cream/90 px-5 py-4 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange">
                  {statusLabel(mode, online, cloudState.status)}
                </p>
                <h1 className="font-display text-3xl font-semibold">{screenTitle}</h1>
              </div>
              <button
                type="button"
                onClick={() => setScreen("log")}
                className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-cream md:hidden"
              >
                Log
              </button>
            </div>
          </header>

          <div className="overflow-y-auto px-5 py-5">
            {screen === "today" ? (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                <section className="rounded-lg border border-border bg-surface p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                    Training signal
                  </p>
                  <h2 className="font-display mt-3 text-4xl font-semibold">
                    {recommendation.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                    {recommendation.summary}
                  </p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-3">
                    <StatTile label="Signal" value={signal} />
                    <StatTile
                      label="Load"
                      value={`${Math.round(recommendation.intensityMultiplier * 100)}%`}
                    />
                    <StatTile
                      label="Sets"
                      value={
                        recommendation.setAdjustment === 0
                          ? "As planned"
                          : `${recommendation.setAdjustment}`
                      }
                    />
                  </div>
                </section>

                <section className="rounded-lg border border-border bg-[#e7eee8] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                    Data mode
                  </p>
                  <h2 className="font-display mt-3 text-3xl font-semibold">
                    {mode === "local-only" ? "Local only" : "Cloud sync"}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {mode === "local-only"
                      ? "No account is required."
                      : cloudStatusTitle(cloudState.status)}
                  </p>
                  {mode === "cloud-sync" ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {!cloudConfigured ? (
                        <span className="inline-flex h-10 items-center rounded-lg border border-navy/15 px-4 text-sm font-semibold text-muted">
                          Add Supabase env
                        </span>
                      ) : !cloudState.connected ? (
                        <Link
                          href="/auth/sign-in"
                          className="inline-flex h-10 items-center rounded-lg border border-navy/15 px-4 text-sm font-semibold text-navy"
                        >
                          Connect account
                        </Link>
                      ) : (
                        <button
                          type="button"
                          disabled={busy || cloudState.status === "syncing"}
                          onClick={() =>
                            syncCloudData({ enable: !cloudState.enabled })
                          }
                          className="inline-flex h-10 items-center rounded-lg border border-navy/15 px-4 text-sm font-semibold text-navy disabled:opacity-60"
                        >
                          {cloudState.enabled ? "Sync now" : "Start cloud sync"}
                        </button>
                      )}
                    </div>
                  ) : null}
                </section>

                <section className="rounded-lg border border-border bg-surface p-5 lg:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                    Why
                  </p>
                  <div className="mt-4 grid gap-2 text-sm text-muted lg:grid-cols-3">
                    {recommendation.reasons.slice(0, 3).map((reason) => (
                      <p key={reason} className="rounded-lg bg-cream px-3 py-2">
                        {reason}
                      </p>
                    ))}
                  </div>
                </section>

                <section className="grid gap-3 sm:grid-cols-3 lg:col-span-2">
                  <StatTile label="Workouts" value={counts.workouts} />
                  <StatTile label="Lifts" value={counts.lifts} />
                  <StatTile label="Programs" value={counts.programEnrollments} />
                </section>
              </div>
            ) : null}

            {screen === "log" ? (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <section className="rounded-lg border border-border bg-surface p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                        Lift log
                      </p>
                      <h2 className="font-display mt-3 text-3xl font-semibold">
                        {estimate ? `${estimate} ${unit} e1RM` : "Set details"}
                      </h2>
                    </div>
                    {plates.length > 0 ? (
                      <div className="rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-cream">
                        {plates.map((plate) => `${plate.count}x${plate.weight}`).join(" / ")} per side
                      </div>
                    ) : null}
                  </div>

                  <form onSubmit={handleWorkoutSubmit} className="mt-6 grid gap-4">
                    <label className="grid gap-1 text-sm font-semibold">
                      Exercise
                      <input
                        value={exerciseName}
                        onChange={(event) => setExerciseName(event.target.value)}
                        className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="grid gap-1 text-sm font-semibold">
                        Weight
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={weight}
                          onChange={(event) => setWeight(event.target.value)}
                          className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
                        />
                      </label>
                      <label className="grid gap-1 text-sm font-semibold">
                        Reps
                        <input
                          type="number"
                          min="1"
                          value={reps}
                          onChange={(event) => setReps(event.target.value)}
                          className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
                        />
                      </label>
                      <label className="grid gap-1 text-sm font-semibold">
                        Unit
                        <select
                          value={unit}
                          onChange={(event) => setUnit(event.target.value as "lb" | "kg")}
                          className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
                        >
                          <option value="lb">lb</option>
                          <option value="kg">kg</option>
                        </select>
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={busy}
                      className="h-12 rounded-lg bg-navy px-4 text-sm font-semibold text-cream disabled:opacity-60"
                    >
                      Save set
                    </button>
                  </form>
                </section>

                <section className="rounded-lg border border-border bg-surface p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                    Best lift
                  </p>
                  <h2 className="font-display mt-3 text-3xl font-semibold">
                    {bestLift?.lift.bestEstimatedOneRepMax
                      ? `${bestLift.exercise?.name ?? "Lift"}`
                      : "No lift yet"}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {bestLift?.lift.bestEstimatedOneRepMax
                      ? `${bestLift.lift.bestEstimatedOneRepMax} ${bestLift.lift.unit} estimated 1RM`
                      : "Your best estimated 1RM appears here after a multi-rep set."}
                  </p>
                </section>
              </div>
            ) : null}

            {screen === "cycle" ? (
              <section className="rounded-lg border border-border bg-surface p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                  Cycle context
                </p>
                <h2 className="font-display mt-3 text-3xl font-semibold">
                  {phaseRecommendation?.title ?? "Add a period start"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {cycleStatus
                    ? `Day ${cycleStatus.cycleDay}; next period around ${cycleStatus.predictedNextPeriod}.`
                    : "A single start date is enough to begin local phase estimates."}
                </p>
                {phaseRecommendation ? (
                  <p className="mt-3 text-sm font-semibold text-orange">
                    {phaseRecommendation.trainingFocus}
                  </p>
                ) : null}
                <form onSubmit={handleCycleSubmit} className="mt-6 grid gap-3 sm:max-w-md">
                  <label className="grid gap-1 text-sm font-semibold">
                    Period start
                    <input
                      type="date"
                      value={periodStartedOn}
                      onChange={(event) => setPeriodStartedOn(event.target.value)}
                      className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={busy}
                    className="h-12 rounded-lg bg-navy px-4 text-sm font-semibold text-cream disabled:opacity-60"
                  >
                    Save start
                  </button>
                </form>
              </section>
            ) : null}

            {screen === "recovery" ? (
              <section className="rounded-lg border border-border bg-surface p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                  Recovery
                </p>
                <h2 className="font-display mt-3 text-3xl font-semibold">
                  {latestRecovery ? `${latestRecovery.score}/100` : "Score today"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {recoveryLabel(latestRecovery?.score)}
                </p>
                <form onSubmit={handleRecoverySubmit} className="mt-6 grid gap-4 sm:max-w-lg">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="grid gap-1 text-sm font-semibold">
                      Sleep
                      <input
                        type="number"
                        min="0"
                        max="14"
                        step="0.5"
                        value={sleepHours}
                        onChange={(event) => setSleepHours(event.target.value)}
                        className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
                      />
                    </label>
                    <label className="grid gap-1 text-sm font-semibold">
                      Sore
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={soreness}
                        onChange={(event) => setSoreness(event.target.value)}
                        className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
                      />
                    </label>
                    <label className="grid gap-1 text-sm font-semibold">
                      Stress
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={stress}
                        onChange={(event) => setStress(event.target.value)}
                        className="h-12 rounded-lg border border-border bg-cream px-3 text-base outline-none focus:border-orange"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={busy}
                    className="h-12 rounded-lg bg-navy px-4 text-sm font-semibold text-cream disabled:opacity-60"
                  >
                    Save recovery
                  </button>
                </form>
              </section>
            ) : null}

            {screen === "programs" ? (
              <section className="rounded-lg border border-border bg-surface p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                      Program
                    </p>
                    <h2 className="font-display mt-3 text-3xl font-semibold">
                      {activeProgram
                        ? activeProgram.session?.sessionName
                        : "The First Margarita"}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      {activeProgram
                        ? `${activeProgram.program.title}: session ${
                            activeProgram.enrollment.currentSessionIndex + 1
                          } of ${activeProgram.totalSessions}. ${recommendation.title}.`
                        : "Enroll in the bundled 8-week strength block and surface today's programmed session."}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={activeProgram ? handleProgramComplete : handleProgramEnroll}
                    className="h-12 rounded-lg bg-navy px-4 text-sm font-semibold text-cream disabled:opacity-60"
                  >
                    {activeProgram ? "Complete session" : "Enroll"}
                  </button>
                </div>

                {activeProgram?.session ? (
                  <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {activeProgram.session.exercises.map((exercise) => (
                      <div
                        key={exercise.exercise}
                        className="rounded-lg border border-border bg-cream p-4"
                      >
                        <p className="text-sm font-bold text-navy">{exercise.exercise}</p>
                        <p className="mt-2 text-sm text-muted">
                          {exercise.sets} x {exercise.reps}
                          {exercise.percent1RM
                            ? ` @ ${Math.round(exercise.percent1RM * 100)}%`
                            : ""}
                        </p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-orange">
                          {exercise.restMinutes} min rest
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : null}

            {screen === "data" ? (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
                <section className="rounded-lg border border-border bg-surface p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                    Data controls
                  </p>
                  <h2 className="font-display mt-3 text-3xl font-semibold">
                    {mode === "local-only" ? "This device only" : "Cloud sync mode"}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {counts.queuedMutations} local mutation
                    {counts.queuedMutations === 1 ? "" : "s"} waiting for cloud
                    sync.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={downloadExport}
                      className="h-12 rounded-lg border border-navy/15 px-4 text-sm font-semibold text-navy"
                    >
                      Export JSON
                    </button>
                    <button
                      type="button"
                      onClick={clearLocalData}
                      className="h-12 rounded-lg border border-red-900/20 px-4 text-sm font-semibold text-red-800"
                    >
                      Delete local data
                    </button>
                  </div>
                </section>

                <section className="rounded-lg border border-border bg-[#e7eee8] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                    Cloud sync
                  </p>
                  <h2 className="font-display mt-3 text-3xl font-semibold">
                    {cloudStatusTitle(cloudState.status)}
                  </h2>
                  <div className="mt-4 space-y-2 text-sm leading-6 text-muted">
                    <p>
                      Account:{" "}
                      <span className="font-semibold text-navy">
                        {cloudState.userEmail ?? "Not connected"}
                      </span>
                    </p>
                    <p>
                      Last sync:{" "}
                      <span className="font-semibold text-navy">
                        {formatDateTime(cloudState.lastSuccessfulSyncAt)}
                      </span>
                    </p>
                    <p>
                      Queued:{" "}
                      <span className="font-semibold text-navy">
                        {counts.queuedMutations}
                      </span>
                    </p>
                    {cloudState.lastError ? (
                      <p className="text-red-800">{cloudState.lastError}</p>
                    ) : null}
                    {cloudState.lastResult ? (
                      <p>
                        Last run: {cloudState.lastResult.pushed} pushed,{" "}
                        {cloudState.lastResult.pulled} pulled,{" "}
                        {cloudState.lastResult.skipped} skipped.
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-6 grid gap-2">
                    {!cloudConfigured ? (
                      <p className="rounded-lg border border-navy/10 bg-cream p-3 text-sm text-muted">
                        Add Supabase environment variables to enable cloud sync.
                      </p>
                    ) : !cloudState.connected ? (
                      <Link
                        href="/auth/sign-in"
                        className="inline-flex h-12 items-center justify-center rounded-lg bg-navy px-4 text-sm font-semibold text-cream"
                      >
                        Connect account
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={busy || cloudState.status === "syncing"}
                        onClick={() => syncCloudData({ enable: !cloudState.enabled })}
                        className="h-12 rounded-lg bg-navy px-4 text-sm font-semibold text-cream disabled:opacity-60"
                      >
                        {cloudState.status === "syncing"
                          ? "Syncing"
                          : cloudState.enabled
                            ? "Sync now"
                            : "Start cloud sync"}
                      </button>
                    )}
                  </div>
                </section>
              </div>
            ) : null}
          </div>

          <nav className="grid grid-cols-5 border-t border-border bg-cream/95 px-2 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-muted backdrop-blur md:hidden">
            {navItems
              .filter((item) => item.id !== "recovery")
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setScreen(item.id)}
                  className={`rounded-lg px-1 py-2 ${
                    screen === item.id ? "bg-navy text-cream" : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
