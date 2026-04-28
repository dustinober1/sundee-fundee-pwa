import { localDb } from "./local-db";
import { estimatedOneRepMax } from "./calculations";
import {
  FIRST_MARGARITA_PROGRAM,
  getProgramSessionByIndex,
  type ProgramSession,
} from "./programs";
import { calculateRecoveryScore } from "./recovery";
import {
  CycleSettingsRecordSchema,
  ExerciseRecordSchema,
  LiftRecordSchema,
  DataModeSchema,
  LocalDataExportSchema,
  LOCAL_EXPORT_SCHEMA_VERSION,
  parseLocalDataExport,
  UnsupportedLocalExportSchemaVersionError,
  PeriodLogRecordSchema,
  PreferenceRecordSchema,
  ProgramEnrollmentRecordSchema,
  ProgramRecordSchema,
  RecoveryScoreRecordSchema,
  SyncMutationRecordSchema,
  WorkoutSetRecordSchema,
  WorkoutRecordSchema,
  type CycleSettingsRecord,
  type DataMode,
  type ExerciseRecord,
  type LocalDataExport,
  type PeriodLogRecord,
  type ProgramEnrollmentRecord,
  type ProgramRecord,
  type WorkoutRecord,
  type WorkoutSetRecord,
} from "./schema";

export const DATA_MODE_PREFERENCE_KEY = "dataMode";

function nowIso() {
  return new Date().toISOString();
}

export function createLocalId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `${prefix}_${random}`;
}

export async function queueLocalMutation(
  entity: string,
  entityId: string,
  operation: "upsert" | "delete",
  payload: unknown,
) {
  const timestamp = nowIso();
  const mutation = SyncMutationRecordSchema.parse({
    id: createLocalId("mut"),
    entity,
    entityId,
    operation,
    payload,
    attempts: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  await localDb.syncMutations.put(mutation);
  return mutation;
}

export async function savePreference(key: string, value: unknown) {
  const preference = PreferenceRecordSchema.parse({
    key,
    value,
    updatedAt: nowIso(),
  });

  await localDb.preferences.put(preference);
  return preference;
}

export async function getPreference<T = unknown>(key: string) {
  const preference = await localDb.preferences.get(key);
  return preference?.value as T | undefined;
}

export async function saveDataMode(mode: DataMode) {
  return savePreference(DATA_MODE_PREFERENCE_KEY, DataModeSchema.parse(mode));
}

export async function getStoredDataMode() {
  const mode = await getPreference(DATA_MODE_PREFERENCE_KEY);
  const parsed = DataModeSchema.safeParse(mode);
  return parsed.success ? parsed.data : null;
}

export async function createWorkout(
  input: Pick<WorkoutRecord, "title"> &
    Partial<Omit<WorkoutRecord, "id" | "createdAt" | "updatedAt">>,
) {
  const timestamp = nowIso();
  const workout = WorkoutRecordSchema.parse({
    id: createLocalId("wrk"),
    title: input.title,
    startedAt: input.startedAt ?? timestamp,
    completedAt: input.completedAt ?? null,
    status: input.status ?? "active",
    source: input.source ?? "manual",
    notes: input.notes,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
    syncStatus: "queued",
    userId: input.userId ?? null,
  });

  await localDb.transaction("rw", localDb.workouts, localDb.syncMutations, async () => {
    await localDb.workouts.put(workout);
    await queueLocalMutation("workouts", workout.id, "upsert", workout);
  });

  return workout;
}

export async function upsertExercise(
  input: Pick<ExerciseRecord, "name"> &
    Partial<Omit<ExerciseRecord, "updatedAt">>,
) {
  const timestamp = nowIso();
  const existing = await localDb.exercises
    .where("name")
    .equalsIgnoreCase(input.name)
    .first();

  if (existing && !existing.deletedAt) return existing;

  const exercise = ExerciseRecordSchema.parse({
    id: input.id ?? createLocalId("exr"),
    name: input.name,
    category: input.category ?? "strength",
    primaryMuscles: input.primaryMuscles ?? [],
    isCustom: input.isCustom ?? true,
    createdAt: input.createdAt ?? timestamp,
    updatedAt: timestamp,
    deletedAt: input.deletedAt ?? null,
    syncStatus: "queued",
    userId: input.userId ?? null,
  });

  await localDb.transaction("rw", localDb.exercises, localDb.syncMutations, async () => {
    await localDb.exercises.put(exercise);
    await queueLocalMutation("exercises", exercise.id, "upsert", exercise);
  });

  return exercise;
}

export async function listExercises(limit = 50) {
  return localDb.exercises
    .orderBy("name")
    .filter((exercise) => !exercise.deletedAt)
    .limit(limit)
    .toArray();
}

export async function addWorkoutSet(
  input: Pick<WorkoutSetRecord, "workoutId" | "exerciseId" | "setIndex" | "reps" | "weight"> &
    Partial<Omit<WorkoutSetRecord, "id" | "createdAt" | "updatedAt">>,
) {
  const timestamp = nowIso();
  const workoutSet = WorkoutSetRecordSchema.parse({
    id: createLocalId("set"),
    workoutId: input.workoutId,
    exerciseId: input.exerciseId,
    setIndex: input.setIndex,
    reps: input.reps,
    weight: input.weight,
    unit: input.unit ?? "lb",
    rpe: input.rpe ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
    syncStatus: "queued",
    userId: input.userId ?? null,
  });
  const estimate = estimatedOneRepMax(workoutSet.weight, workoutSet.reps);

  await localDb.transaction(
    "rw",
    localDb.workoutSets,
    localDb.lifts,
    localDb.syncMutations,
    async () => {
      await localDb.workoutSets.put(workoutSet);
      await queueLocalMutation("workout_sets", workoutSet.id, "upsert", workoutSet);

      if (estimate) {
        const existingLift = await localDb.lifts
          .where("exerciseId")
          .equals(workoutSet.exerciseId)
          .first();
        const best = Math.max(
          existingLift?.bestEstimatedOneRepMax ?? 0,
          Math.round(estimate * 10) / 10,
        );
        const lift = LiftRecordSchema.parse({
          id: existingLift?.id ?? createLocalId("lft"),
          exerciseId: workoutSet.exerciseId,
          bestEstimatedOneRepMax: best,
          unit: workoutSet.unit,
          createdAt: existingLift?.createdAt ?? timestamp,
          updatedAt: timestamp,
          deletedAt: null,
          syncStatus: "queued",
          userId: workoutSet.userId ?? null,
        });
        await localDb.lifts.put(lift);
        await queueLocalMutation("lifts", lift.id, "upsert", lift);
      }
    },
  );

  return workoutSet;
}

export async function createQuickWorkout(input: {
  exerciseName: string;
  weight: number;
  reps: number;
  unit?: "lb" | "kg";
  rpe?: number | null;
}) {
  const exercise = await upsertExercise({ name: input.exerciseName.trim() });
  const workout = await createWorkout({
    title: input.exerciseName.trim(),
    status: "completed",
    completedAt: nowIso(),
  });
  const workoutSet = await addWorkoutSet({
    workoutId: workout.id,
    exerciseId: exercise.id,
    setIndex: 0,
    reps: input.reps,
    weight: input.weight,
    unit: input.unit ?? "lb",
    rpe: input.rpe ?? null,
  });

  return { exercise, workout, workoutSet };
}

export async function getBestLift() {
  const lifts = await localDb.lifts
    .filter((record) => !record.deletedAt && Boolean(record.bestEstimatedOneRepMax))
    .toArray();
  const lift = lifts.sort(
    (a, b) =>
      (b.bestEstimatedOneRepMax ?? 0) - (a.bestEstimatedOneRepMax ?? 0),
  )[0];

  if (!lift) return null;
  const exercise = await localDb.exercises.get(lift.exerciseId);
  return { lift, exercise };
}

export async function listWorkouts(limit = 20) {
  const workouts = await localDb.workouts
    .orderBy("startedAt")
    .reverse()
    .filter((workout) => !workout.deletedAt)
    .limit(limit)
    .toArray();

  return workouts;
}

export async function saveCycleSettings(
  input: Partial<
    Pick<
      CycleSettingsRecord,
      | "averageCycleLengthDays"
      | "averagePeriodLengthDays"
      | "lutealPhaseLengthDays"
      | "trackingEnabled"
    >
  >,
) {
  const timestamp = nowIso();
  const existing = await localDb.cycleSettings.toCollection().first();
  const settings = CycleSettingsRecordSchema.parse({
    id: existing?.id ?? createLocalId("cyc"),
    averageCycleLengthDays: input.averageCycleLengthDays ?? existing?.averageCycleLengthDays ?? 28,
    averagePeriodLengthDays: input.averagePeriodLengthDays ?? existing?.averagePeriodLengthDays ?? 5,
    lutealPhaseLengthDays: input.lutealPhaseLengthDays ?? existing?.lutealPhaseLengthDays ?? 14,
    trackingEnabled: input.trackingEnabled ?? existing?.trackingEnabled ?? true,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
    deletedAt: null,
    syncStatus: "queued",
    userId: existing?.userId ?? null,
  });

  await localDb.transaction("rw", localDb.cycleSettings, localDb.syncMutations, async () => {
    await localDb.cycleSettings.put(settings);
    await queueLocalMutation("cycle_settings", settings.id, "upsert", settings);
  });

  return settings;
}

export async function addPeriodLog(
  input: Pick<PeriodLogRecord, "startedOn"> & Partial<Omit<PeriodLogRecord, "id" | "createdAt" | "updatedAt">>,
) {
  const timestamp = nowIso();
  const periodLog = PeriodLogRecordSchema.parse({
    id: createLocalId("prd"),
    startedOn: input.startedOn,
    endedOn: input.endedOn ?? null,
    flow: input.flow ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
    syncStatus: "queued",
    userId: input.userId ?? null,
  });

  await localDb.transaction("rw", localDb.periodLogs, localDb.syncMutations, async () => {
    await localDb.periodLogs.put(periodLog);
    await queueLocalMutation("period_logs", periodLog.id, "upsert", periodLog);
  });

  return periodLog;
}

export async function getCycleInputs() {
  const [settings, periodLogs] = await Promise.all([
    localDb.cycleSettings.toCollection().first(),
    localDb.periodLogs
      .orderBy("startedOn")
      .reverse()
      .filter((record) => !record.deletedAt)
      .toArray(),
  ]);

  return { settings, periodLogs };
}

export async function saveRecoveryScore(input: {
  sleepHours?: number | null;
  soreness?: number | null;
  stress?: number | null;
  cyclePhase?: string | null;
  notes?: string;
}) {
  const result = calculateRecoveryScore({
    sleepHours: input.sleepHours,
    soreness: input.soreness,
    stress: input.stress,
    cyclePhase:
      input.cyclePhase === "menstrual" ||
      input.cyclePhase === "follicular" ||
      input.cyclePhase === "ovulation" ||
      input.cyclePhase === "luteal"
        ? input.cyclePhase
        : null,
  });

  if (!result) return null;

  const timestamp = nowIso();
  const record = RecoveryScoreRecordSchema.parse({
    id: createLocalId("rec"),
    recordedOn: timestamp.slice(0, 10),
    score: result.total,
    sleepQuality: input.sleepHours ?? null,
    soreness: input.soreness ?? null,
    stress: input.stress ?? null,
    notes: input.notes ?? result.explanations.join("; "),
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
    syncStatus: "queued",
    userId: null,
  });

  await localDb.transaction("rw", localDb.recoveryScores, localDb.syncMutations, async () => {
    await localDb.recoveryScores.put(record);
    await queueLocalMutation("recovery_scores", record.id, "upsert", record);
  });

  return { record, result };
}

export async function getLatestRecoveryScore() {
  return localDb.recoveryScores
    .orderBy("recordedOn")
    .reverse()
    .filter((record) => !record.deletedAt)
    .first();
}

export type ActiveProgramSession = {
  program: ProgramRecord;
  enrollment: ProgramEnrollmentRecord;
  session: (ProgramSession & { week: number; phaseId: string; globalIndex: number }) | null;
  totalSessions: number;
};

export async function enrollFirstMargaritaProgram() {
  const timestamp = nowIso();
  const existingProgram = await localDb.programs.get(FIRST_MARGARITA_PROGRAM.id);
  const program = ProgramRecordSchema.parse({
    id: FIRST_MARGARITA_PROGRAM.id,
    title: FIRST_MARGARITA_PROGRAM.name,
    description: FIRST_MARGARITA_PROGRAM.description,
    templateId: FIRST_MARGARITA_PROGRAM.id,
    category: FIRST_MARGARITA_PROGRAM.category,
    difficulty: FIRST_MARGARITA_PROGRAM.difficulty,
    weeks: FIRST_MARGARITA_PROGRAM.durationWeeks,
    sessionsPerWeek: FIRST_MARGARITA_PROGRAM.sessionsPerWeek,
    source: "bundled",
    createdAt: existingProgram?.createdAt ?? timestamp,
    updatedAt: timestamp,
    deletedAt: null,
    syncStatus: "queued",
    userId: existingProgram?.userId ?? null,
  });
  const activeEnrollment = await localDb.programEnrollments
    .where("status")
    .equals("active")
    .first();
  const enrollment = ProgramEnrollmentRecordSchema.parse({
    id: activeEnrollment?.id ?? createLocalId("enr"),
    programId: program.id,
    startedOn: activeEnrollment?.startedOn ?? timestamp.slice(0, 10),
    currentWeek: activeEnrollment?.currentWeek ?? 1,
    currentSessionIndex: activeEnrollment?.currentSessionIndex ?? 0,
    status: "active",
    createdAt: activeEnrollment?.createdAt ?? timestamp,
    updatedAt: timestamp,
    deletedAt: null,
    syncStatus: "queued",
    userId: activeEnrollment?.userId ?? null,
  });

  await localDb.transaction(
    "rw",
    localDb.programs,
    localDb.programEnrollments,
    localDb.syncMutations,
    async () => {
      await localDb.programs.put(program);
      await localDb.programEnrollments.put(enrollment);
      await queueLocalMutation("programs", program.id, "upsert", program);
      await queueLocalMutation("program_enrollments", enrollment.id, "upsert", enrollment);
    },
  );

  return { program, enrollment };
}

export async function getActiveProgramSession(): Promise<ActiveProgramSession | null> {
  const enrollment = await localDb.programEnrollments
    .where("status")
    .equals("active")
    .filter((record) => !record.deletedAt)
    .first();

  if (!enrollment) return null;

  const program = await localDb.programs.get(enrollment.programId);
  if (!program || program.deletedAt) return null;

  const totalSessions = FIRST_MARGARITA_PROGRAM.durationWeeks * FIRST_MARGARITA_PROGRAM.sessionsPerWeek;
  return {
    program,
    enrollment,
    session: getProgramSessionByIndex(enrollment.currentSessionIndex),
    totalSessions,
  };
}

export type CompletedProgramSessionInput = {
  sessionId: string;
  performedAt: string;
  exercises: Array<{
    exerciseName: string;
    sets: Array<{
      reps: number;
      weight: number;
      unit?: "lb" | "kg";
      rpe?: number | null;
    }>;
  }>;
};

export type CompletedProgramSessionSummary = {
  workoutId: string;
  completedSessionId: string;
  completedSessionName: string;
  persistedSetCount: number;
  enrollmentStatus: ProgramEnrollmentRecord["status"];
  nextSessionIndex: number;
};

export async function completeActiveProgramSession(performed: CompletedProgramSessionInput) {
  const active = await getActiveProgramSession();
  if (!active?.session) return null;

  if (performed.sessionId !== active.session.sessionId) {
    throw new Error("Performed session does not match active session");
  }

  const timestamp = nowIso();
  const performedAt = performed.performedAt || timestamp;

  const trimmedExercises = performed.exercises.map((exercise) => ({
    ...exercise,
    exerciseName: (exercise.exerciseName ?? "").trim(),
  }));

  if (trimmedExercises.some((exercise) => !exercise.exerciseName)) {
    throw new Error("Exercise name is required");
  }

  const nextIndex = active.enrollment.currentSessionIndex + 1;
  const completed = nextIndex >= active.totalSessions;
  const nextSessionIndex = Math.min(nextIndex, active.totalSessions - 1);

  const nextEnrollment = ProgramEnrollmentRecordSchema.parse({
    ...active.enrollment,
    currentSessionIndex: nextSessionIndex,
    currentWeek: Math.min(
      active.program.weeks,
      Math.floor(nextSessionIndex / active.program.sessionsPerWeek) + 1,
    ),
    status: completed ? "completed" : "active",
    updatedAt: timestamp,
    syncStatus: "queued",
  });

  const workoutId = createLocalId("wrk");
  const workout = WorkoutRecordSchema.parse({
    id: workoutId,
    title: active.session.sessionName,
    startedAt: performedAt,
    completedAt: performedAt,
    status: "completed",
    source: "program",
    notes: `${active.program.title} / ${active.session.focus}`,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
    syncStatus: "queued",
    userId: null,
  });

  const workoutSets: WorkoutSetRecord[] = [];
  let persistedSetCount = 0;

  for (const [exerciseIndex, exercise] of trimmedExercises.entries()) {
    const upserted = await upsertExercise({ name: exercise.exerciseName });

    for (const [setIndex, set] of exercise.sets.entries()) {
      const record = WorkoutSetRecordSchema.parse({
        id: createLocalId("set"),
        workoutId: workout.id,
        exerciseId: upserted.id,
        setIndex: exerciseIndex * 1000 + setIndex,
        reps: set.reps,
        weight: set.weight,
        unit: set.unit ?? "lb",
        rpe: set.rpe ?? null,
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
        syncStatus: "queued",
        userId: null,
      });
      workoutSets.push(record);
      persistedSetCount += 1;
    }
  }

  await localDb.transaction(
    "rw",
    [
      localDb.workouts,
      localDb.workoutSets,
      localDb.exercises,
      localDb.lifts,
      localDb.programEnrollments,
      localDb.syncMutations,
    ],
    async () => {
      await localDb.workouts.put(workout);
      await queueLocalMutation("workouts", workout.id, "upsert", workout);

      for (const set of workoutSets) {
        await localDb.workoutSets.put(set);
        await queueLocalMutation("workout_sets", set.id, "upsert", set);

        const estimate = estimatedOneRepMax(set.weight, set.reps);
        if (estimate) {
          const existingLift = await localDb.lifts
            .where("exerciseId")
            .equals(set.exerciseId)
            .first();
          const best = Math.max(
            existingLift?.bestEstimatedOneRepMax ?? 0,
            Math.round(estimate * 10) / 10,
          );
          const lift = LiftRecordSchema.parse({
            id: existingLift?.id ?? createLocalId("lft"),
            exerciseId: set.exerciseId,
            bestEstimatedOneRepMax: best,
            unit: set.unit,
            createdAt: existingLift?.createdAt ?? timestamp,
            updatedAt: timestamp,
            deletedAt: null,
            syncStatus: "queued",
            userId: null,
          });
          await localDb.lifts.put(lift);
          await queueLocalMutation("lifts", lift.id, "upsert", lift);
        }
      }

      await localDb.programEnrollments.put(nextEnrollment);
      await queueLocalMutation("program_enrollments", nextEnrollment.id, "upsert", nextEnrollment);
    },
  );

  const summary: CompletedProgramSessionSummary = {
    workoutId: workout.id,
    completedSessionId: active.session.sessionId,
    completedSessionName: active.session.sessionName,
    persistedSetCount,
    enrollmentStatus: nextEnrollment.status,
    nextSessionIndex: nextEnrollment.currentSessionIndex,
  };

  return { workout, enrollment: nextEnrollment, completedSession: active.session, summary };
}

export async function countLocalRecords() {
  const [
    workouts,
    exercises,
    periodLogs,
    recoveryScores,
    programs,
    programEnrollments,
    injuries,
    queuedMutations,
  ] = await Promise.all([
    localDb.workouts.filter((record) => !record.deletedAt).count(),
    localDb.exercises.filter((record) => !record.deletedAt).count(),
    localDb.periodLogs.filter((record) => !record.deletedAt).count(),
    localDb.recoveryScores.filter((record) => !record.deletedAt).count(),
    localDb.programs.filter((record) => !record.deletedAt).count(),
    localDb.programEnrollments.filter((record) => !record.deletedAt).count(),
    localDb.injuries.filter((record) => !record.deletedAt).count(),
    localDb.syncMutations.count(),
  ]);

  return {
    workouts,
    exercises,
    periodLogs,
    recoveryScores,
    lifts: await localDb.lifts.filter((record) => !record.deletedAt).count(),
    programs,
    programEnrollments,
    injuries,
    queuedMutations,
  };
}

export async function exportLocalData(): Promise<LocalDataExport> {
  const [
    preferences,
    exercises,
    lifts,
    workouts,
    workoutSets,
    cycleSettings,
    periodLogs,
    recoveryScores,
    programs,
    programEnrollments,
    injuries,
    donationMetadata,
    syncMutations,
  ] = await Promise.all([
    localDb.preferences.toArray(),
    localDb.exercises.toArray(),
    localDb.lifts.toArray(),
    localDb.workouts.toArray(),
    localDb.workoutSets.toArray(),
    localDb.cycleSettings.toArray(),
    localDb.periodLogs.toArray(),
    localDb.recoveryScores.toArray(),
    localDb.programs.toArray(),
    localDb.programEnrollments.toArray(),
    localDb.injuries.toArray(),
    localDb.donationMetadata.toArray(),
    localDb.syncMutations.toArray(),
  ]);

  return LocalDataExportSchema.parse({
    schemaVersion: LOCAL_EXPORT_SCHEMA_VERSION,
    exportedAt: nowIso(),
    preferences,
    exercises,
    lifts,
    workouts,
    workoutSets,
    cycleSettings,
    periodLogs,
    recoveryScores,
    programs,
    programEnrollments,
    injuries,
    donationMetadata,
    syncMutations,
  });
}

export async function importLocalData(exportedData: unknown) {
  // Fail closed on unknown schema versions before any IndexedDB writes.
  const data = parseLocalDataExport(exportedData);

  await localDb.transaction("rw", localDb.tables, async () => {
    await Promise.all([
      localDb.preferences.bulkPut(data.preferences),
      localDb.exercises.bulkPut(data.exercises),
      localDb.lifts.bulkPut(data.lifts),
      localDb.workouts.bulkPut(data.workouts),
      localDb.workoutSets.bulkPut(data.workoutSets),
      localDb.cycleSettings.bulkPut(data.cycleSettings),
      localDb.periodLogs.bulkPut(data.periodLogs),
      localDb.recoveryScores.bulkPut(data.recoveryScores),
      localDb.programs.bulkPut(data.programs),
      localDb.programEnrollments.bulkPut(data.programEnrollments),
      localDb.injuries.bulkPut(data.injuries),
      localDb.donationMetadata.bulkPut(data.donationMetadata),
      localDb.syncMutations.bulkPut(data.syncMutations),
    ]);
  });

  return data;
}

export async function deleteAllLocalData() {
  await localDb.transaction("rw", localDb.tables, async () => {
    await Promise.all(localDb.tables.map((table) => table.clear()));
  });
}
