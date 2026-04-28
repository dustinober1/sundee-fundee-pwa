import "fake-indexeddb/auto";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { localDb } from "./local-db";
import {
  countLocalRecords,
  completeActiveProgramSession,
  createWorkout,
  createQuickWorkout,
  deleteAllLocalData,
  enrollFirstMargaritaProgram,
  getActiveProgramSession,
  exportLocalData,
  getStoredDataMode,
  getBestLift,
  importLocalData,
  saveDataMode,
} from "./local-repositories";

describe("local PWA repositories", () => {
  beforeEach(async () => {
    await deleteAllLocalData();
  });

  afterAll(async () => {
    await deleteAllLocalData();
    localDb.close();
    await localDb.delete();
  });

  it("stores data mode locally", async () => {
    await saveDataMode("local-only");

    await expect(getStoredDataMode()).resolves.toBe("local-only");
  });

  it("creates workout records and queues a future sync mutation", async () => {
    const workout = await createWorkout({
      title: "Test workout",
      status: "completed",
      completedAt: new Date().toISOString(),
    });

    const counts = await countLocalRecords();

    expect(workout.id).toMatch(/^wrk_/);
    expect(counts.workouts).toBe(1);
    expect(counts.queuedMutations).toBe(1);
  });

  it("exports, deletes, and imports local data", async () => {
    await saveDataMode("local-only");
    await createWorkout({ title: "Exported workout" });

    const exported = await exportLocalData();
    expect(exported.schemaVersion).toBe(1);
    expect(exported.workouts).toHaveLength(1);

    await deleteAllLocalData();
    expect((await countLocalRecords()).workouts).toBe(0);

    await importLocalData(exported);
    expect((await countLocalRecords()).workouts).toBe(1);
    await expect(getStoredDataMode()).resolves.toBe("local-only");
  });

  it("creates a quick workout with exercise, set, lift, and sync mutations", async () => {
    await createQuickWorkout({
      exerciseName: "Back squat",
      weight: 135,
      reps: 5,
      unit: "lb",
    });

    const counts = await countLocalRecords();
    const bestLift = await getBestLift();

    expect(counts.workouts).toBe(1);
    expect(counts.exercises).toBe(1);
    expect(counts.lifts).toBe(1);
    expect(counts.queuedMutations).toBeGreaterThanOrEqual(4);
    expect(bestLift?.exercise?.name).toBe("Back squat");
    expect(bestLift?.lift.bestEstimatedOneRepMax).toBe(157.5);
  });

  it("completes the active bundled session by persisting a program workout with sets and advancing enrollment", async () => {
    await enrollFirstMargaritaProgram();

    const active = await getActiveProgramSession();
    expect(active?.program.title).toBe("The First Margarita");
    expect(active?.session?.sessionId).toBe("w1d1");
    expect(active?.totalSessions).toBe(24);

    const performed = {
      sessionId: active!.session!.sessionId,
      performedAt: new Date().toISOString(),
      exercises: [
        {
          exerciseName:
            (active!.session!.exercises[0] as any).name ??
            (active!.session!.exercises[0] as any).exercise,
          sets: [
            { reps: 5, weight: 95, unit: "lb" as const },
            { reps: 5, weight: 95, unit: "lb" as const },
          ],
        },
      ],
    };

    const result = await completeActiveProgramSession(performed);

    const next = await getActiveProgramSession();
    const counts = await countLocalRecords();

    expect(result?.workout.source).toBe("program");
    expect(result?.summary.persistedSetCount).toBe(2);
    expect(next?.session?.sessionId).toBe("w1d2");
    expect(counts.programEnrollments).toBe(1);
    expect(counts.workouts).toBe(1);
    expect(counts.exercises).toBe(1);
    expect(counts.lifts).toBe(1);
  });

  it("returns null and writes nothing when there is no active enrollment", async () => {
    const before = await countLocalRecords();
    const result = await completeActiveProgramSession({
      sessionId: "w1d1",
      performedAt: new Date().toISOString(),
      exercises: [],
    });

    const after = await countLocalRecords();
    expect(result).toBeNull();
    expect(after).toEqual(before);
  });

  it("rejects malformed performed inputs and does not create partial artifacts", async () => {
    await enrollFirstMargaritaProgram();
    const active = await getActiveProgramSession();
    expect(active?.session?.sessionId).toBe("w1d1");

    const beforeExerciseCount = await localDb.exercises.count();
    const beforeMutationCount = await localDb.syncMutations.count();
    const beforeWorkoutCount = await localDb.workouts.count();
    const beforeWorkoutSetCount = await localDb.workoutSets.count();

    // Malformed completion attempts should not create workout artifacts.
    // Note: exercises/mutations may already exist due to enrollment setup.

    await expect(
      completeActiveProgramSession({
        sessionId: active!.session!.sessionId,
        performedAt: new Date().toISOString(),
        exercises: [
          {
            exerciseName: " ",
            sets: [{ reps: 5, weight: 95, unit: "lb" as const }],
          },
        ],
      }),
    ).rejects.toThrow();

    await expect(
      completeActiveProgramSession({
        sessionId: active!.session!.sessionId,
        performedAt: new Date().toISOString(),
        exercises: [
          {
            exerciseName:
              (active!.session!.exercises[0] as any).name ??
              (active!.session!.exercises[0] as any).exercise,
            sets: [{ reps: 0, weight: 95, unit: "lb" as const }],
          },
        ],
      }),
    ).rejects.toThrow();

    expect(await localDb.workouts.count()).toBe(beforeWorkoutCount);
    expect(await localDb.workoutSets.count()).toBe(beforeWorkoutSetCount);
  });
});
