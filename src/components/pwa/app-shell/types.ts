import type {
  CloudSyncMetadata,
  CloudSyncResult,
  CloudSyncStatus,
} from "@/lib/pwa/cloud-sync";
import type { countLocalRecords } from "@/lib/pwa/local-repositories";
import type { ActiveProgramSession } from "@/lib/pwa/local-repositories";
import type { DataMode, ExerciseRecord, LiftRecord, RecoveryScoreRecord } from "@/lib/pwa/schema";
import type { CycleStatus, PhaseRecommendation } from "@/lib/pwa/cycle";

export type AppScreen = "today" | "log" | "cycle" | "recovery" | "programs" | "data";

export type NavItem = { id: AppScreen; label: string };

export type LocalCounts = Awaited<ReturnType<typeof countLocalRecords>>;

export type BestLift = { lift: LiftRecord; exercise?: ExerciseRecord };

export type CloudState = CloudSyncMetadata & {
  connected: boolean;
  userEmail: string | null;
  status: CloudSyncStatus;
  lastResult: CloudSyncResult | null;
};

export type AppShellHeaderModel = {
  statusLabel: string;
  screenTitle: string;
};

export type TodayScreenModel = {
  recommendationTitle: string;
  recommendationSummary: string;
  recommendationReasons: string[];
  intensityPercent: number;
  setAdjustmentLabel: string;
  signalLabel: string;
  counts: Pick<LocalCounts, "workouts" | "lifts" | "programEnrollments">;
  mode: DataMode;
  cloudConfigured: boolean;
  cloudStatusTitle: string;
  canConnectCloud: boolean;
  canSyncCloud: boolean;
  cloudSyncButtonLabel: string;
  cloudSyncBusy: boolean;
};

export type LogScreenModel = {
  estimateLabel: string;
  platesLabel: string | null;
  bestLiftTitle: string;
  bestLiftSummary: string;
};

export type CycleScreenModel = {
  title: string;
  summary: string;
  trainingFocus: string | null;
};

export type RecoveryScreenModel = {
  title: string;
  summary: string;
};

export type ProgramsScreenExerciseRowModel = {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  percentLabel: string | null;
  restLabel: string;
  performedWeight: string;
  performedReps: string;
  performedUnit: "lb" | "kg";
  weightLabel: string;
  repsLabel: string;
  unitLabel: string;
  isValid: boolean;
  helperText: string | null;
};

export type ProgramsScreenModel = {
  title: string;
  summary: string;
  primaryActionLabel: string;
  primaryActionDisabled: boolean;
  primaryActionReason: string | null;
  completionNote: string;
  exercises: ProgramsScreenExerciseRowModel[] | null;
};

export type DataScreenModel = {
  title: string;
  queuedMutationsLabel: string;
  cloudStatusTitle: string;
  accountEmailLabel: string;
  lastSyncLabel: string;
  queuedLabel: string;
  lastError: string | null;
  lastRunLabel: string | null;
  cloudActionLabel: string;
  cloudActionDisabled: boolean;
  cloudConfigured: boolean;
  cloudConnected: boolean;
};

export type AppExperienceState = {
  mode: DataMode;
  screen: AppScreen;
  online: boolean;
  busy: boolean;
  counts: LocalCounts;
  bestLift: BestLift | null;
  cycleStatus: CycleStatus | null;
  phaseRecommendation: PhaseRecommendation | null;
  latestRecovery: RecoveryScoreRecord | null;
  activeProgram: ActiveProgramSession | null;
  cloudState: CloudState;
  cloudConfigured: boolean;
};
