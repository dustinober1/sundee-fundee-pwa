import type { User } from "@supabase/supabase-js";
import type { Table } from "dexie";
import { localDb } from "./local-db";
import {
  createLocalId,
  getPreference,
  queueLocalMutation,
  saveDataMode,
  savePreference,
} from "./local-repositories";
import {
  CycleSettingsRecordSchema,
  ExerciseRecordSchema,
  InjuryRecordSchema,
  LiftRecordSchema,
  PeriodLogRecordSchema,
  ProgramEnrollmentRecordSchema,
  ProgramRecordSchema,
  RecoveryScoreRecordSchema,
  WorkoutRecordSchema,
  WorkoutSetRecordSchema,
  type CycleSettingsRecord,
  type ExerciseRecord,
  type InjuryRecord,
  type LiftRecord,
  type PeriodLogRecord,
  type ProgramEnrollmentRecord,
  type ProgramRecord,
  type RecoveryScoreRecord,
  type SyncMutationRecord,
  type WorkoutRecord,
  type WorkoutSetRecord,
} from "./schema";
import {
  createSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "./supabase-browser";
import type { Database } from "./database.types";

export const SYNCABLE_ENTITIES = [
  "exercises",
  "lifts",
  "workouts",
  "workout_sets",
  "cycle_settings",
  "period_logs",
  "recovery_scores",
  "programs",
  "program_enrollments",
  "injuries",
] as const;

export type SyncableEntity = (typeof SYNCABLE_ENTITIES)[number];
export type CloudSyncStatus =
  | "disabled"
  | "not-configured"
  | "signed-out"
  | "offline"
  | "syncing"
  | "synced"
  | "failed";

export type CloudSyncError = {
  entity?: SyncableEntity;
  entityId?: string;
  message: string;
};

export type CloudSyncResult = {
  status: CloudSyncStatus;
  pushed: number;
  pulled: number;
  skipped: number;
  failed: number;
  queued: number;
  errors: CloudSyncError[];
  startedAt: string;
  finishedAt: string;
};

export type CloudSyncMetadata = {
  enabled: boolean;
  lastPulledAt: string | null;
  lastSuccessfulSyncAt: string | null;
  lastError: string | null;
  deviceId: string | null;
};

type SyncableRecord =
  | ExerciseRecord
  | LiftRecord
  | WorkoutRecord
  | WorkoutSetRecord
  | CycleSettingsRecord
  | PeriodLogRecord
  | RecoveryScoreRecord
  | ProgramRecord
  | ProgramEnrollmentRecord
  | InjuryRecord;

type RemoteRows = {
  [Entity in SyncableEntity]: Database["public"]["Tables"][Entity]["Row"];
};
type RemoteInserts = {
  [Entity in SyncableEntity]: Database["public"]["Tables"][Entity]["Insert"];
};
type RemoteRow = RemoteRows[SyncableEntity];

const CLOUD_SYNC_ENABLED_KEY = "cloudSync.enabled";
const CLOUD_SYNC_LAST_PULLED_KEY = "cloudSync.lastPulledAt";
const CLOUD_SYNC_LAST_SUCCESS_KEY = "cloudSync.lastSuccessfulSyncAt";
const CLOUD_SYNC_LAST_ERROR_KEY = "cloudSync.lastError";
const CLOUD_SYNC_DEVICE_ID_KEY = "cloudSync.deviceId";

function nowIso() {
  return new Date().toISOString();
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function isSyncableEntity(entity: string): entity is SyncableEntity {
  return SYNCABLE_ENTITIES.includes(entity as SyncableEntity);
}

export async function getCloudSyncMetadata(): Promise<CloudSyncMetadata> {
  const [enabled, lastPulledAt, lastSuccessfulSyncAt, lastError, deviceId] =
    await Promise.all([
      getPreference<boolean>(CLOUD_SYNC_ENABLED_KEY),
      getPreference<string>(CLOUD_SYNC_LAST_PULLED_KEY),
      getPreference<string>(CLOUD_SYNC_LAST_SUCCESS_KEY),
      getPreference<string>(CLOUD_SYNC_LAST_ERROR_KEY),
      getPreference<string>(CLOUD_SYNC_DEVICE_ID_KEY),
    ]);

  return {
    enabled: enabled === true,
    lastPulledAt: lastPulledAt ?? null,
    lastSuccessfulSyncAt: lastSuccessfulSyncAt ?? null,
    lastError: lastError ?? null,
    deviceId: deviceId ?? null,
  };
}

export async function getCloudDeviceId() {
  const existing = await getPreference<string>(CLOUD_SYNC_DEVICE_ID_KEY);
  if (existing) return existing;

  const next = createLocalId("dev");
  await savePreference(CLOUD_SYNC_DEVICE_ID_KEY, next);
  return next;
}

export async function setCloudSyncEnabled(enabled: boolean) {
  await savePreference(CLOUD_SYNC_ENABLED_KEY, enabled);
  if (enabled) {
    await Promise.all([getCloudDeviceId(), saveDataMode("cloud-sync")]);
  }
}

export async function enableCloudSync() {
  if (!isSupabaseBrowserConfigured()) {
    throw new Error("Supabase is not configured for this environment.");
  }

  const supabase = createSupabaseBrowserClient();
  const user = await requireCloudUser();
  const timestamp = nowIso();
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      data_mode: "cloud-sync",
      updated_at: timestamp,
    },
    { onConflict: "id" },
  );

  if (error) throw error;
  await setCloudSyncEnabled(true);
}

async function requireCloudUser(): Promise<User> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Sign in before starting cloud sync.");
  return user;
}

function localTableForEntity(entity: SyncableEntity): Table<SyncableRecord, string> {
  switch (entity) {
    case "exercises":
      return localDb.exercises as Table<SyncableRecord, string>;
    case "lifts":
      return localDb.lifts as Table<SyncableRecord, string>;
    case "workouts":
      return localDb.workouts as Table<SyncableRecord, string>;
    case "workout_sets":
      return localDb.workoutSets as Table<SyncableRecord, string>;
    case "cycle_settings":
      return localDb.cycleSettings as Table<SyncableRecord, string>;
    case "period_logs":
      return localDb.periodLogs as Table<SyncableRecord, string>;
    case "recovery_scores":
      return localDb.recoveryScores as Table<SyncableRecord, string>;
    case "programs":
      return localDb.programs as Table<SyncableRecord, string>;
    case "program_enrollments":
      return localDb.programEnrollments as Table<SyncableRecord, string>;
    case "injuries":
      return localDb.injuries as Table<SyncableRecord, string>;
  }
}

function parseLocalRecord(entity: SyncableEntity, payload: unknown): SyncableRecord {
  switch (entity) {
    case "exercises":
      return ExerciseRecordSchema.parse(payload);
    case "lifts":
      return LiftRecordSchema.parse(payload);
    case "workouts":
      return WorkoutRecordSchema.parse(payload);
    case "workout_sets":
      return WorkoutSetRecordSchema.parse(payload);
    case "cycle_settings":
      return CycleSettingsRecordSchema.parse(payload);
    case "period_logs":
      return PeriodLogRecordSchema.parse(payload);
    case "recovery_scores":
      return RecoveryScoreRecordSchema.parse(payload);
    case "programs":
      return ProgramRecordSchema.parse(payload);
    case "program_enrollments":
      return ProgramEnrollmentRecordSchema.parse(payload);
    case "injuries":
      return InjuryRecordSchema.parse(payload);
  }
}

function baseRemoteRow(record: SyncableRecord, userId: string) {
  return {
    id: record.id,
    user_id: userId,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
    deleted_at: record.deletedAt ?? null,
    sync_status: "synced",
  };
}

export function toRemoteRow(
  entity: SyncableEntity,
  record: SyncableRecord,
  userId: string,
): RemoteRow {
  const base = baseRemoteRow(record, userId);

  switch (entity) {
    case "exercises": {
      const exercise = record as ExerciseRecord;
      return {
        ...base,
        name: exercise.name,
        category: exercise.category,
        primary_muscles: exercise.primaryMuscles,
        is_custom: exercise.isCustom,
      };
    }
    case "lifts": {
      const lift = record as LiftRecord;
      return {
        ...base,
        exercise_id: lift.exerciseId,
        best_estimated_one_rep_max: lift.bestEstimatedOneRepMax ?? null,
        unit: lift.unit,
      };
    }
    case "workouts": {
      const workout = record as WorkoutRecord;
      return {
        ...base,
        title: workout.title,
        started_at: workout.startedAt,
        completed_at: workout.completedAt ?? null,
        status: workout.status,
        source: workout.source,
        notes: workout.notes ?? null,
      };
    }
    case "workout_sets": {
      const set = record as WorkoutSetRecord;
      return {
        ...base,
        workout_id: set.workoutId,
        exercise_id: set.exerciseId,
        set_index: set.setIndex,
        reps: set.reps,
        weight: set.weight,
        unit: set.unit,
        rpe: set.rpe ?? null,
      };
    }
    case "cycle_settings": {
      const settings = record as CycleSettingsRecord;
      return {
        ...base,
        average_cycle_length_days: settings.averageCycleLengthDays,
        average_period_length_days: settings.averagePeriodLengthDays,
        luteal_phase_length_days: settings.lutealPhaseLengthDays,
        tracking_enabled: settings.trackingEnabled,
      };
    }
    case "period_logs": {
      const log = record as PeriodLogRecord;
      return {
        ...base,
        started_on: log.startedOn,
        ended_on: log.endedOn ?? null,
        flow: log.flow ?? null,
      };
    }
    case "recovery_scores": {
      const score = record as RecoveryScoreRecord;
      return {
        ...base,
        recorded_on: score.recordedOn,
        score: score.score,
        sleep_quality: score.sleepQuality ?? null,
        soreness: score.soreness ?? null,
        stress: score.stress ?? null,
        notes: score.notes ?? null,
      };
    }
    case "programs": {
      const program = record as ProgramRecord;
      return {
        ...base,
        title: program.title,
        description: program.description ?? null,
        template_id: program.templateId ?? null,
        category: program.category ?? null,
        difficulty: program.difficulty ?? null,
        weeks: program.weeks,
        sessions_per_week: program.sessionsPerWeek,
        source: program.source,
      };
    }
    case "program_enrollments": {
      const enrollment = record as ProgramEnrollmentRecord;
      return {
        ...base,
        program_id: enrollment.programId,
        started_on: enrollment.startedOn,
        current_week: enrollment.currentWeek,
        current_session_index: enrollment.currentSessionIndex,
        status: enrollment.status,
      };
    }
    case "injuries": {
      const injury = record as InjuryRecord;
      return {
        ...base,
        body_location: injury.bodyLocation,
        severity: injury.severity,
        notes: injury.notes ?? null,
        active: injury.active,
      };
    }
  }
}

export function fromRemoteRow(entity: SyncableEntity, row: RemoteRow): SyncableRecord {
  const base = {
    id: row.id,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    syncStatus: "synced" as const,
  };

  switch (entity) {
    case "exercises": {
      const exercise = row as RemoteRows["exercises"];
      return ExerciseRecordSchema.parse({
        ...base,
        name: exercise.name,
        category: exercise.category,
        primaryMuscles: exercise.primary_muscles,
        isCustom: exercise.is_custom,
      });
    }
    case "lifts": {
      const lift = row as RemoteRows["lifts"];
      return LiftRecordSchema.parse({
        ...base,
        exerciseId: lift.exercise_id,
        bestEstimatedOneRepMax: lift.best_estimated_one_rep_max,
        unit: lift.unit,
      });
    }
    case "workouts": {
      const workout = row as RemoteRows["workouts"];
      return WorkoutRecordSchema.parse({
        ...base,
        title: workout.title,
        startedAt: workout.started_at,
        completedAt: workout.completed_at,
        status: workout.status,
        source: workout.source,
        notes: workout.notes ?? undefined,
      });
    }
    case "workout_sets": {
      const set = row as RemoteRows["workout_sets"];
      return WorkoutSetRecordSchema.parse({
        ...base,
        workoutId: set.workout_id,
        exerciseId: set.exercise_id,
        setIndex: set.set_index,
        reps: set.reps,
        weight: set.weight,
        unit: set.unit,
        rpe: set.rpe,
      });
    }
    case "cycle_settings": {
      const settings = row as RemoteRows["cycle_settings"];
      return CycleSettingsRecordSchema.parse({
        ...base,
        averageCycleLengthDays: settings.average_cycle_length_days,
        averagePeriodLengthDays: settings.average_period_length_days,
        lutealPhaseLengthDays: settings.luteal_phase_length_days,
        trackingEnabled: settings.tracking_enabled,
      });
    }
    case "period_logs": {
      const log = row as RemoteRows["period_logs"];
      return PeriodLogRecordSchema.parse({
        ...base,
        startedOn: log.started_on,
        endedOn: log.ended_on,
        flow: log.flow,
      });
    }
    case "recovery_scores": {
      const score = row as RemoteRows["recovery_scores"];
      return RecoveryScoreRecordSchema.parse({
        ...base,
        recordedOn: score.recorded_on,
        score: score.score,
        sleepQuality: score.sleep_quality,
        soreness: score.soreness,
        stress: score.stress,
        notes: score.notes ?? undefined,
      });
    }
    case "programs": {
      const program = row as RemoteRows["programs"];
      return ProgramRecordSchema.parse({
        ...base,
        title: program.title,
        description: program.description ?? undefined,
        templateId: program.template_id ?? undefined,
        category: program.category ?? undefined,
        difficulty: program.difficulty ?? undefined,
        weeks: program.weeks,
        sessionsPerWeek: program.sessions_per_week,
        source: program.source,
      });
    }
    case "program_enrollments": {
      const enrollment = row as RemoteRows["program_enrollments"];
      return ProgramEnrollmentRecordSchema.parse({
        ...base,
        programId: enrollment.program_id,
        startedOn: enrollment.started_on,
        currentWeek: enrollment.current_week,
        currentSessionIndex: enrollment.current_session_index,
        status: enrollment.status,
      });
    }
    case "injuries": {
      const injury = row as RemoteRows["injuries"];
      return InjuryRecordSchema.parse({
        ...base,
        bodyLocation: injury.body_location,
        severity: injury.severity,
        notes: injury.notes ?? undefined,
        active: injury.active,
      });
    }
  }
}

async function upsertRemoteRow(
  entity: SyncableEntity,
  row: ReturnType<typeof toRemoteRow>,
) {
  const supabase = createSupabaseBrowserClient();

  switch (entity) {
    case "exercises":
      return supabase
        .from("exercises")
        .upsert(row as unknown as RemoteInserts["exercises"], { onConflict: "id" });
    case "lifts":
      return supabase
        .from("lifts")
        .upsert(row as unknown as RemoteInserts["lifts"], { onConflict: "id" });
    case "workouts":
      return supabase
        .from("workouts")
        .upsert(row as unknown as RemoteInserts["workouts"], { onConflict: "id" });
    case "workout_sets":
      return supabase
        .from("workout_sets")
        .upsert(row as unknown as RemoteInserts["workout_sets"], { onConflict: "id" });
    case "cycle_settings":
      return supabase
        .from("cycle_settings")
        .upsert(row as unknown as RemoteInserts["cycle_settings"], { onConflict: "id" });
    case "period_logs":
      return supabase
        .from("period_logs")
        .upsert(row as unknown as RemoteInserts["period_logs"], { onConflict: "id" });
    case "recovery_scores":
      return supabase
        .from("recovery_scores")
        .upsert(row as unknown as RemoteInserts["recovery_scores"], { onConflict: "id" });
    case "programs":
      return supabase
        .from("programs")
        .upsert(row as unknown as RemoteInserts["programs"], { onConflict: "id" });
    case "program_enrollments":
      return supabase
        .from("program_enrollments")
        .upsert(row as unknown as RemoteInserts["program_enrollments"], { onConflict: "id" });
    case "injuries":
      return supabase
        .from("injuries")
        .upsert(row as unknown as RemoteInserts["injuries"], { onConflict: "id" });
  }
}

async function selectRemoteRows(entity: SyncableEntity, userId: string, since: string | null) {
  const supabase = createSupabaseBrowserClient();

  switch (entity) {
    case "exercises": {
      const query = supabase.from("exercises").select("*").eq("user_id", userId);
      return since ? query.gt("updated_at", since) : query;
    }
    case "lifts": {
      const query = supabase.from("lifts").select("*").eq("user_id", userId);
      return since ? query.gt("updated_at", since) : query;
    }
    case "workouts": {
      const query = supabase.from("workouts").select("*").eq("user_id", userId);
      return since ? query.gt("updated_at", since) : query;
    }
    case "workout_sets": {
      const query = supabase.from("workout_sets").select("*").eq("user_id", userId);
      return since ? query.gt("updated_at", since) : query;
    }
    case "cycle_settings": {
      const query = supabase.from("cycle_settings").select("*").eq("user_id", userId);
      return since ? query.gt("updated_at", since) : query;
    }
    case "period_logs": {
      const query = supabase.from("period_logs").select("*").eq("user_id", userId);
      return since ? query.gt("updated_at", since) : query;
    }
    case "recovery_scores": {
      const query = supabase.from("recovery_scores").select("*").eq("user_id", userId);
      return since ? query.gt("updated_at", since) : query;
    }
    case "programs": {
      const query = supabase.from("programs").select("*").eq("user_id", userId);
      return since ? query.gt("updated_at", since) : query;
    }
    case "program_enrollments": {
      const query = supabase
        .from("program_enrollments")
        .select("*")
        .eq("user_id", userId);
      return since ? query.gt("updated_at", since) : query;
    }
    case "injuries": {
      const query = supabase.from("injuries").select("*").eq("user_id", userId);
      return since ? query.gt("updated_at", since) : query;
    }
  }
}

async function markLocalRecordSynced(entity: SyncableEntity, id: string, userId: string) {
  await localTableForEntity(entity).update(id, {
    syncStatus: "synced",
    userId,
  } as Partial<SyncableRecord>);
}

async function hasQueuedMutation(entity: SyncableEntity, entityId: string) {
  const count = await localDb.syncMutations
    .where("entityId")
    .equals(entityId)
    .filter((mutation) => mutation.entity === entity)
    .count();

  return count > 0;
}

async function queueLocalRecordIfNeeded(entity: SyncableEntity, record: SyncableRecord) {
  if (await hasQueuedMutation(entity, record.id)) return;
  await queueLocalMutation(entity, record.id, "upsert", record);
}

async function pushQueuedMutations(userId: string, result: CloudSyncResult) {
  const mutations = await localDb.syncMutations.orderBy("createdAt").toArray();

  for (const mutation of mutations) {
    if (!isSyncableEntity(mutation.entity)) {
      result.skipped += 1;
      await localDb.syncMutations.delete(mutation.id);
      continue;
    }

    try {
      const record = parseLocalRecord(mutation.entity, mutation.payload);
      const remoteRow = toRemoteRow(mutation.entity, record, userId);

      if (mutation.operation === "delete" && "deleted_at" in remoteRow) {
        remoteRow.deleted_at = remoteRow.deleted_at ?? nowIso();
      }

      const { error } = await upsertRemoteRow(mutation.entity, remoteRow);
      if (error) throw error;

      await markLocalRecordSynced(mutation.entity, mutation.entityId, userId);
      await localDb.syncMutations.delete(mutation.id);
      result.pushed += 1;
    } catch (error) {
      const message = errorMessage(error);
      await localDb.syncMutations.update(mutation.id, {
        attempts: mutation.attempts + 1,
        lastError: message,
        updatedAt: nowIso(),
      } satisfies Partial<SyncMutationRecord>);
      result.failed += 1;
      result.errors.push({
        entity: mutation.entity,
        entityId: mutation.entityId,
        message,
      });
    }
  }
}

async function pullRemoteRows(userId: string, since: string | null, result: CloudSyncResult) {
  for (const entity of SYNCABLE_ENTITIES) {
    const { data, error } = await selectRemoteRows(entity, userId, since);
    if (error) throw error;

    for (const row of data ?? []) {
      const remoteRecord = fromRemoteRow(entity, row as RemoteRow);
      const table = localTableForEntity(entity);
      const localRecord = await table.get(remoteRecord.id);
      const queued = await hasQueuedMutation(entity, remoteRecord.id);

      if (!localRecord) {
        await table.put(remoteRecord);
        result.pulled += 1;
        continue;
      }

      if (queued || localRecord.updatedAt > remoteRecord.updatedAt) {
        await queueLocalRecordIfNeeded(entity, localRecord);
        result.skipped += 1;
        continue;
      }

      await table.put(remoteRecord);
      result.pulled += 1;
    }
  }
}

function emptyResult(status: CloudSyncStatus, startedAt = nowIso()): CloudSyncResult {
  const queued = 0;
  return {
    status,
    pushed: 0,
    pulled: 0,
    skipped: 0,
    failed: 0,
    queued,
    errors: [],
    startedAt,
    finishedAt: nowIso(),
  };
}

export async function runCloudSync(): Promise<CloudSyncResult> {
  const startedAt = nowIso();

  if (!isSupabaseBrowserConfigured()) {
    return emptyResult("not-configured", startedAt);
  }

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return emptyResult("offline", startedAt);
  }

  const metadata = await getCloudSyncMetadata();
  if (!metadata.enabled) {
    return emptyResult("disabled", startedAt);
  }

  try {
    const user = await requireCloudUser();
    const result: CloudSyncResult = {
      status: "syncing",
      pushed: 0,
      pulled: 0,
      skipped: 0,
      failed: 0,
      queued: 0,
      errors: [],
      startedAt,
      finishedAt: startedAt,
    };

    await pushQueuedMutations(user.id, result);
    await pullRemoteRows(user.id, metadata.lastPulledAt, result);

    const finishedAt = nowIso();
    const queued = await localDb.syncMutations.count();
    result.status = result.failed > 0 ? "failed" : "synced";
    result.queued = queued;
    result.finishedAt = finishedAt;

    if (result.status === "synced") {
      await Promise.all([
        savePreference(CLOUD_SYNC_LAST_PULLED_KEY, startedAt),
        savePreference(CLOUD_SYNC_LAST_SUCCESS_KEY, finishedAt),
        savePreference(CLOUD_SYNC_LAST_ERROR_KEY, null),
      ]);
    } else {
      await savePreference(CLOUD_SYNC_LAST_ERROR_KEY, result.errors[0]?.message ?? "Sync failed.");
    }

    return result;
  } catch (error) {
    const message = errorMessage(error);
    await savePreference(CLOUD_SYNC_LAST_ERROR_KEY, message);

    return {
      ...emptyResult("failed", startedAt),
      failed: 1,
      queued: await localDb.syncMutations.count(),
      errors: [{ message }],
      finishedAt: nowIso(),
    };
  }
}
