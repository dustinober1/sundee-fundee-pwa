import "fake-indexeddb/auto";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { localDb } from "./local-db";
import {
  completeActiveProgramSession,
  countLocalRecords,
  deleteAllLocalData,
  enrollFirstMargaritaProgram,
  exportLocalData,
  getActiveProgramSession,
  getBestLift,
  saveDataMode,
  saveCycleSettings,
  saveRecoveryScore,
} from "./local-repositories";
import { buildLocalTrainingRecommendation } from "./recommendations";

function isoDate(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

describe("core workout loop (local-first proof)", () => {
  beforeEach(async () => {
    await deleteAllLocalData();
  });

  afterAll(async () => {
    await deleteAllLocalData();
    localDb.close();
    await localDb.delete();
  });

  it("completes a bundled program session in local-only mode and exports structured workout artifacts", async () => {
    // Local-only mode should be sufficient for the core training loop.
    await saveDataMode("local-only");

    // Preserve readiness/cycle context so recommendation generation has real inputs.
    await saveCycleSettings({
      trackingEnabled: true,
      averageCycleLengthDays: 28,
      averagePeriodLengthDays: 5,
      lutealPhaseLengthDays: 14,
    });
    await localDb.periodLogs.put({
      id: "prd_seed",
      startedOn: isoDate(3),
      endedOn: null,
      flow: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      syncStatus: "queued",
      userId: null,
    });

    const recovery = await saveRecoveryScore({
      sleepHours: 7,
      soreness: 2,
      stress: 2,
      cyclePhase: "follicular",
    });
    expect(recovery?.record.score).toBeGreaterThan(0);

    // Enroll and confirm the active session is present locally.
    await enrollFirstMargaritaProgram();
    const activeBefore = await getActiveProgramSession();
    expect(activeBefore?.program.title).toBe("The First Margarita");
    expect(activeBefore?.session?.sessionId).toBe("w1d1");

    // Recommendation should incorporate the active session context (non-generic guidance).
    const recommendationBefore = buildLocalTrainingRecommendation({
      recoveryScore: recovery?.record.score,
      cyclePhase: "follicular",
      soreness: 2,
      stress: 2,
      recentWorkoutCount: 0,
      programSession: activeBefore!.session,
    });

    expect(recommendationBefore.summary).toContain("Week 1 Day 1");

    // Perform the session with a bounded set log.
    const performed = {
      sessionId: activeBefore!.session!.sessionId,
      performedAt: new Date().toISOString(),
      exercises: [
        {
          exerciseName: activeBefore!.session!.exercises[0].exercise,
          sets: [
            { reps: 5, weight: 95, unit: "lb" as const },
            { reps: 5, weight: 95, unit: "lb" as const },
          ],
        },
      ],
    };

    const completion = await completeActiveProgramSession(performed);

    expect(completion?.workout.source).toBe("program");
    expect(completion?.summary.persistedSetCount).toBe(2);

    // Enrollment should advance and recommendation should use the new active context.
    const activeAfter = await getActiveProgramSession();
    expect(activeAfter?.session?.sessionId).toBe("w1d2");

    const recommendationAfter = buildLocalTrainingRecommendation({
      recoveryScore: recovery?.record.score,
      cyclePhase: "follicular",
      soreness: 2,
      stress: 2,
      recentWorkoutCount: 1,
      programSession: activeAfter!.session,
    });

    expect(recommendationAfter.summary).toContain("Week 1 Day 2");

    // Local counts and lifts should update.
    const counts = await countLocalRecords();
    expect(counts.programEnrollments).toBe(1);
    expect(counts.workouts).toBe(1);
    expect(counts.exercises).toBeGreaterThan(0);
    expect(counts.lifts).toBeGreaterThan(0);

    const bestLift = await getBestLift();
    expect(bestLift).not.toBeNull();

    // Export should include structured workout artifacts.
    const exported = await exportLocalData();
    const exportedWorkout = exported.workouts.find(
      (workout) => workout.id === completion?.workout.id,
    );

    expect(exportedWorkout?.source).toBe("program");
    expect(
      exported.workoutSets.filter((set) => set.workoutId === completion?.workout.id),
    ).toHaveLength(2);
  });

  it("does not create workout artifacts when attempting completion without an active enrollment", async () => {
    const before = await countLocalRecords();

    const result = await completeActiveProgramSession({
      sessionId: "w1d1",
      performedAt: new Date().toISOString(),
      exercises: [],
    });

    expect(result).toBeNull();
    expect(await countLocalRecords()).toEqual(before);
  });
});
