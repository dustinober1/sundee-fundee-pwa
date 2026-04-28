"use client";

import type { FormEvent } from "react";
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
import type { DataMode, RecoveryScoreRecord } from "@/lib/pwa/schema";
import { getCloudUser, isSupabaseBrowserConfigured } from "@/lib/pwa/supabase-browser";
import { AppShell } from "@/components/pwa/app-shell/AppShell";
import { CycleScreen } from "@/components/pwa/app-shell/CycleScreen";
import { DataScreen } from "@/components/pwa/app-shell/DataScreen";
import { LogScreen } from "@/components/pwa/app-shell/LogScreen";
import { ProgramsScreen } from "@/components/pwa/app-shell/ProgramsScreen";
import { RecoveryScreen } from "@/components/pwa/app-shell/RecoveryScreen";
import { TodayScreen } from "@/components/pwa/app-shell/TodayScreen";
import type { AppScreen, BestLift, CloudState, LocalCounts, NavItem } from "@/components/pwa/app-shell/types";

const navItems: NavItem[] = [
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
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="flex w-fit items-center gap-3">
              {/*
                Intentionally using <img> here while onboarding.
                This is inside AppExperience (not the extracted app-shell) and keeps this area simple.
                eslint is suppressed to avoid blocking lint in CI.
              */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Logo.jpeg"
                alt="Sundee Fundee"
                width={42}
                height={42}
                className="h-[42px] w-[42px] rounded-full border border-navy/10 object-cover"
              />
              <span className="font-display text-2xl font-semibold">Sundee Fundee</span>
            </a>

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

  const screenTitle = navItems.find((item) => item.id === screen)?.label ?? "Today";

  const todayModel = {
    recommendationTitle: recommendation.title,
    recommendationSummary: recommendation.summary,
    recommendationReasons: recommendation.reasons,
    intensityPercent: Math.round(recommendation.intensityMultiplier * 100),
    setAdjustmentLabel:
      recommendation.setAdjustment === 0 ? "As planned" : `${recommendation.setAdjustment}`,
    signalLabel: signal,
    counts: {
      workouts: counts.workouts,
      lifts: counts.lifts,
      programEnrollments: counts.programEnrollments,
    },
    mode,
    cloudConfigured,
    cloudStatusTitle: mode === "local-only" ? "No account is required." : cloudStatusTitle(cloudState.status),
    canConnectCloud: !cloudState.connected,
    canSyncCloud: cloudState.connected,
    cloudSyncButtonLabel: cloudState.enabled ? "Sync now" : "Start cloud sync",
    cloudSyncBusy: busy || cloudState.status === "syncing",
  };

  const logModel = {
    estimateLabel: estimate ? `${estimate} ${unit} e1RM` : "Set details",
    platesLabel: plates.length > 0 ? `${plates.map((plate) => `${plate.count}x${plate.weight}`).join(" / ")} per side` : null,
    bestLiftTitle: bestLift?.lift.bestEstimatedOneRepMax
      ? `${bestLift.exercise?.name ?? "Lift"}`
      : "No lift yet",
    bestLiftSummary: bestLift?.lift.bestEstimatedOneRepMax
      ? `${bestLift.lift.bestEstimatedOneRepMax} ${bestLift.lift.unit} estimated 1RM`
      : "Your best estimated 1RM appears here after a multi-rep set.",
  };

  const cycleModel = {
    title: phaseRecommendation?.title ?? "Add a period start",
    summary: cycleStatus
      ? `Day ${cycleStatus.cycleDay}; next period around ${cycleStatus.predictedNextPeriod}.`
      : "A single start date is enough to begin local phase estimates.",
    trainingFocus: phaseRecommendation?.trainingFocus ?? null,
  };

  const recoveryModel = {
    title: latestRecovery ? `${latestRecovery.score}/100` : "Score today",
    summary: recoveryLabel(latestRecovery?.score),
  };

  const programsModel = {
    title: activeProgram ? activeProgram.session?.sessionName ?? "Program" : "The First Margarita",
    summary: activeProgram
      ? `${activeProgram.program.title}: session ${activeProgram.enrollment.currentSessionIndex + 1} of ${activeProgram.totalSessions}. ${recommendation.title}.`
      : "Enroll in the bundled 8-week strength block and surface today's programmed session.",
    buttonLabel: activeProgram ? "Complete session" : "Enroll",
    buttonDisabled: busy,
    exercises: activeProgram?.session
      ? activeProgram.session.exercises.map((exercise) => ({
          exercise: exercise.exercise,
          sets: exercise.sets,
          reps: exercise.reps,
          percentLabel: exercise.percent1RM ? `@ ${Math.round(exercise.percent1RM * 100)}%` : null,
          restLabel: `${exercise.restMinutes} min rest`,
        }))
      : null,
  };

  const dataModel = {
    title: mode === "local-only" ? "This device only" : "Cloud sync mode",
    queuedMutationsLabel: `${counts.queuedMutations} local mutation${counts.queuedMutations === 1 ? "" : "s"} waiting for cloud sync.`,
    cloudStatusTitle: cloudStatusTitle(cloudState.status),
    accountEmailLabel: cloudState.userEmail ?? "Not connected",
    lastSyncLabel: formatDateTime(cloudState.lastSuccessfulSyncAt),
    queuedLabel: `${counts.queuedMutations}`,
    lastError: cloudState.lastError,
    lastRunLabel: cloudState.lastResult
      ? `Last run: ${cloudState.lastResult.pushed} pushed, ${cloudState.lastResult.pulled} pulled, ${cloudState.lastResult.skipped} skipped.`
      : null,
    cloudActionLabel:
      cloudState.status === "syncing"
        ? "Syncing"
        : cloudState.enabled
          ? "Sync now"
          : "Start cloud sync",
    cloudActionDisabled: busy || cloudState.status === "syncing",
    cloudConfigured,
    cloudConnected: cloudState.connected,
  };

  return (
    <AppShell
      navItems={navItems}
      screen={screen}
      onNavigate={setScreen}
      statusLabel={statusLabel(mode, online, cloudState.status)}
      screenTitle={screenTitle}
      onQuickLog={() => setScreen("log")}
    >
      {screen === "today" ? (
        <TodayScreen
          model={todayModel}
          onChooseModeLocalOnly={() => chooseMode("local-only")}
          onChooseModeCloudSync={() => chooseMode("cloud-sync")}
          onSyncCloud={() => syncCloudData({ enable: !cloudState.enabled })}
        />
      ) : null}

      {screen === "log" ? (
        <LogScreen
          model={logModel}
          exerciseName={exerciseName}
          weight={weight}
          reps={reps}
          unit={unit}
          busy={busy}
          onExerciseNameChange={setExerciseName}
          onWeightChange={setWeight}
          onRepsChange={setReps}
          onUnitChange={setUnit}
          onSubmit={handleWorkoutSubmit}
        />
      ) : null}

      {screen === "cycle" ? (
        <CycleScreen
          model={cycleModel}
          periodStartedOn={periodStartedOn}
          busy={busy}
          onPeriodStartedOnChange={setPeriodStartedOn}
          onSubmit={handleCycleSubmit}
        />
      ) : null}

      {screen === "recovery" ? (
        <RecoveryScreen
          model={recoveryModel}
          sleepHours={sleepHours}
          soreness={soreness}
          stress={stress}
          busy={busy}
          onSleepHoursChange={setSleepHours}
          onSorenessChange={setSoreness}
          onStressChange={setStress}
          onSubmit={handleRecoverySubmit}
        />
      ) : null}

      {screen === "programs" ? (
        <ProgramsScreen
          model={programsModel}
          onPrimaryAction={activeProgram ? handleProgramComplete : handleProgramEnroll}
        />
      ) : null}

      {screen === "data" ? (
        <DataScreen
          model={dataModel}
          onExport={downloadExport}
          onDeleteLocal={clearLocalData}
          onCloudAction={() => syncCloudData({ enable: !cloudState.enabled })}
        />
      ) : null}
    </AppShell>
  );
}

