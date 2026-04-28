import { describe, expect, it } from "vitest";
import { fromRemoteRow, toRemoteRow } from "./cloud-sync";
import type { ExerciseRecord, WorkoutRecord } from "./schema";

describe("cloud sync mapping", () => {
  it("maps local exercise records to Supabase rows", () => {
    const exercise: ExerciseRecord = {
      id: "exr_1",
      userId: null,
      name: "Back squat",
      category: "strength",
      primaryMuscles: ["quads", "glutes"],
      isCustom: true,
      createdAt: "2026-04-28T12:00:00.000Z",
      updatedAt: "2026-04-28T12:01:00.000Z",
      deletedAt: null,
      syncStatus: "queued",
    };

    expect(toRemoteRow("exercises", exercise, "user_1")).toEqual({
      id: "exr_1",
      user_id: "user_1",
      name: "Back squat",
      category: "strength",
      primary_muscles: ["quads", "glutes"],
      is_custom: true,
      created_at: "2026-04-28T12:00:00.000Z",
      updated_at: "2026-04-28T12:01:00.000Z",
      deleted_at: null,
      sync_status: "synced",
    });
  });

  it("maps Supabase workout rows back to local records", () => {
    const workout = fromRemoteRow("workouts", {
      id: "wrk_1",
      user_id: "user_1",
      title: "Heavy lower",
      started_at: "2026-04-28T12:00:00.000Z",
      completed_at: "2026-04-28T13:00:00.000Z",
      status: "completed",
      source: "manual",
      notes: null,
      created_at: "2026-04-28T12:00:00.000Z",
      updated_at: "2026-04-28T13:00:00.000Z",
      deleted_at: null,
      sync_status: "synced",
    } satisfies Parameters<typeof fromRemoteRow>[1]) as WorkoutRecord;

    expect(workout).toMatchObject({
      id: "wrk_1",
      userId: "user_1",
      title: "Heavy lower",
      startedAt: "2026-04-28T12:00:00.000Z",
      completedAt: "2026-04-28T13:00:00.000Z",
      status: "completed",
      source: "manual",
      syncStatus: "synced",
    });
  });
});
