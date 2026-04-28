import Dexie, { type Table } from "dexie";
import type {
  CycleSettingsRecord,
  DonationMetadataRecord,
  ExerciseRecord,
  InjuryRecord,
  LiftRecord,
  PeriodLogRecord,
  PreferenceRecord,
  ProgramEnrollmentRecord,
  ProgramRecord,
  RecoveryScoreRecord,
  SyncMutationRecord,
  WorkoutRecord,
  WorkoutSetRecord,
} from "./schema";

export class SundeeFundeeLocalDb extends Dexie {
  preferences!: Table<PreferenceRecord, string>;
  exercises!: Table<ExerciseRecord, string>;
  lifts!: Table<LiftRecord, string>;
  workouts!: Table<WorkoutRecord, string>;
  workoutSets!: Table<WorkoutSetRecord, string>;
  cycleSettings!: Table<CycleSettingsRecord, string>;
  periodLogs!: Table<PeriodLogRecord, string>;
  recoveryScores!: Table<RecoveryScoreRecord, string>;
  programs!: Table<ProgramRecord, string>;
  programEnrollments!: Table<ProgramEnrollmentRecord, string>;
  injuries!: Table<InjuryRecord, string>;
  donationMetadata!: Table<DonationMetadataRecord, string>;
  syncMutations!: Table<SyncMutationRecord, string>;

  constructor(name = "sundee-fundee-local") {
    super(name);

    // NOTE: Dexie schema versioning and exported local data schema versioning are related but
    // intentionally separate concerns. This DB is currently version(1), and the app also exports
    // data as schemaVersion 1. If you bump either, do it intentionally:
    // - add a Dexie migration via `this.version(N).upgrade(...)`
    // - bump LOCAL_EXPORT_SCHEMA_VERSION and update parse/import compatibility rules
    // Current export schema: v${LOCAL_EXPORT_SCHEMA_VERSION}
    this.version(1).stores({
      preferences: "key, updatedAt",
      exercises: "id, name, updatedAt, deletedAt, syncStatus",
      lifts: "id, exerciseId, updatedAt, deletedAt, syncStatus",
      workouts: "id, startedAt, updatedAt, deletedAt, status, syncStatus",
      workoutSets: "id, workoutId, exerciseId, updatedAt, deletedAt, syncStatus",
      cycleSettings: "id, updatedAt, deletedAt, syncStatus",
      periodLogs: "id, startedOn, updatedAt, deletedAt, syncStatus",
      recoveryScores: "id, recordedOn, updatedAt, deletedAt, syncStatus",
      programs: "id, title, updatedAt, deletedAt, syncStatus",
      programEnrollments: "id, programId, status, updatedAt, deletedAt, syncStatus",
      injuries: "id, bodyLocation, active, updatedAt, deletedAt, syncStatus",
      donationMetadata: "id, email, updatedAt",
      syncMutations: "id, entity, entityId, operation, createdAt, updatedAt",
    });
  }
}

export const localDb = new SundeeFundeeLocalDb();
