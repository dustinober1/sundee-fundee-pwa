import { z } from "zod";

const isoString = z.string().min(1);

export const DataModeSchema = z.enum(["local-only", "cloud-sync"]);
export type DataMode = z.infer<typeof DataModeSchema>;

export const SyncStatusSchema = z.enum(["local", "queued", "syncing", "synced", "failed"]);
export type SyncStatus = z.infer<typeof SyncStatusSchema>;

const BaseLocalRecordSchema = z.object({
  id: z.string().min(1),
  userId: z.string().nullable().optional(),
  createdAt: isoString,
  updatedAt: isoString,
  deletedAt: isoString.nullable().optional(),
  syncStatus: SyncStatusSchema.default("local"),
});

export const PreferenceRecordSchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
  updatedAt: isoString,
});
export type PreferenceRecord = z.infer<typeof PreferenceRecordSchema>;

export const ExerciseRecordSchema = BaseLocalRecordSchema.extend({
  name: z.string().min(1),
  category: z.string().default("strength"),
  primaryMuscles: z.array(z.string()).default([]),
  isCustom: z.boolean().default(true),
});
export type ExerciseRecord = z.infer<typeof ExerciseRecordSchema>;

export const LiftRecordSchema = BaseLocalRecordSchema.extend({
  exerciseId: z.string().min(1),
  bestEstimatedOneRepMax: z.number().nonnegative().nullable().optional(),
  unit: z.enum(["lb", "kg"]).default("lb"),
});
export type LiftRecord = z.infer<typeof LiftRecordSchema>;

export const WorkoutRecordSchema = BaseLocalRecordSchema.extend({
  title: z.string().min(1),
  startedAt: isoString,
  completedAt: isoString.nullable().optional(),
  status: z.enum(["planned", "active", "completed"]).default("active"),
  source: z.enum(["manual", "program", "ai"]).default("manual"),
  notes: z.string().optional(),
});
export type WorkoutRecord = z.infer<typeof WorkoutRecordSchema>;

export const WorkoutSetRecordSchema = BaseLocalRecordSchema.extend({
  workoutId: z.string().min(1),
  exerciseId: z.string().min(1),
  setIndex: z.number().int().nonnegative(),
  reps: z.number().int().positive(),
  weight: z.number().nonnegative(),
  unit: z.enum(["lb", "kg"]).default("lb"),
  rpe: z.number().min(0).max(10).nullable().optional(),
});
export type WorkoutSetRecord = z.infer<typeof WorkoutSetRecordSchema>;

export const CycleSettingsRecordSchema = BaseLocalRecordSchema.extend({
  averageCycleLengthDays: z.number().int().min(15).max(60).default(28),
  averagePeriodLengthDays: z.number().int().min(1).max(14).default(5),
  lutealPhaseLengthDays: z.number().int().min(8).max(20).default(14),
  trackingEnabled: z.boolean().default(false),
});
export type CycleSettingsRecord = z.infer<typeof CycleSettingsRecordSchema>;

export const PeriodLogRecordSchema = BaseLocalRecordSchema.extend({
  startedOn: z.string().min(1),
  endedOn: z.string().nullable().optional(),
  flow: z.enum(["light", "medium", "heavy"]).nullable().optional(),
});
export type PeriodLogRecord = z.infer<typeof PeriodLogRecordSchema>;

export const RecoveryScoreRecordSchema = BaseLocalRecordSchema.extend({
  recordedOn: z.string().min(1),
  score: z.number().min(0).max(100),
  sleepQuality: z.number().min(0).max(10).nullable().optional(),
  soreness: z.number().min(0).max(10).nullable().optional(),
  stress: z.number().min(0).max(10).nullable().optional(),
  notes: z.string().optional(),
});
export type RecoveryScoreRecord = z.infer<typeof RecoveryScoreRecordSchema>;

export const ProgramRecordSchema = BaseLocalRecordSchema.extend({
  title: z.string().min(1),
  description: z.string().optional(),
  templateId: z.string().min(1).optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  weeks: z.number().int().positive().default(4),
  sessionsPerWeek: z.number().int().positive().default(3),
  source: z.enum(["bundled", "custom"]).default("custom"),
});
export type ProgramRecord = z.infer<typeof ProgramRecordSchema>;

export const ProgramEnrollmentRecordSchema = BaseLocalRecordSchema.extend({
  programId: z.string().min(1),
  startedOn: z.string().min(1),
  currentWeek: z.number().int().positive().default(1),
  currentSessionIndex: z.number().int().nonnegative().default(0),
  status: z.enum(["active", "paused", "completed"]).default("active"),
});
export type ProgramEnrollmentRecord = z.infer<typeof ProgramEnrollmentRecordSchema>;

export const InjuryRecordSchema = BaseLocalRecordSchema.extend({
  bodyLocation: z.string().min(1),
  severity: z.number().int().min(1).max(5),
  notes: z.string().optional(),
  active: z.boolean().default(true),
});
export type InjuryRecord = z.infer<typeof InjuryRecordSchema>;

export const DonationMetadataRecordSchema = z.object({
  id: z.string().min(1),
  email: z.string().email().nullable().optional(),
  lastDonatedAt: isoString.nullable().optional(),
  updatedAt: isoString,
});
export type DonationMetadataRecord = z.infer<typeof DonationMetadataRecordSchema>;

export const SyncMutationRecordSchema = z.object({
  id: z.string().min(1),
  entity: z.string().min(1),
  entityId: z.string().min(1),
  operation: z.enum(["upsert", "delete"]),
  payload: z.unknown(),
  attempts: z.number().int().nonnegative().default(0),
  lastError: z.string().nullable().optional(),
  createdAt: isoString,
  updatedAt: isoString,
});
export type SyncMutationRecord = z.infer<typeof SyncMutationRecordSchema>;

export const LocalDataExportSchema = z.object({
  schemaVersion: z.literal(1),
  exportedAt: isoString,
  preferences: z.array(PreferenceRecordSchema),
  exercises: z.array(ExerciseRecordSchema),
  lifts: z.array(LiftRecordSchema),
  workouts: z.array(WorkoutRecordSchema),
  workoutSets: z.array(WorkoutSetRecordSchema),
  cycleSettings: z.array(CycleSettingsRecordSchema),
  periodLogs: z.array(PeriodLogRecordSchema),
  recoveryScores: z.array(RecoveryScoreRecordSchema),
  programs: z.array(ProgramRecordSchema),
  programEnrollments: z.array(ProgramEnrollmentRecordSchema),
  injuries: z.array(InjuryRecordSchema),
  donationMetadata: z.array(DonationMetadataRecordSchema),
  syncMutations: z.array(SyncMutationRecordSchema),
});
export type LocalDataExport = z.infer<typeof LocalDataExportSchema>;
