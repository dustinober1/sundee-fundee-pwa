import "fake-indexeddb/auto";

import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const isSupabaseBrowserConfiguredSpy = vi.fn(() => true);
const createSupabaseBrowserClientSpy = vi.fn(() => {
  throw new Error("should not create Supabase client in local-only mode");
});

vi.mock("./supabase-browser", () => ({
  isSupabaseBrowserConfigured: () => isSupabaseBrowserConfiguredSpy(),
  createSupabaseBrowserClient: () => createSupabaseBrowserClientSpy(),
  getCloudUser: async () => null,
}));

import { localDb } from "./local-db";
import { runCloudSync } from "./cloud-sync";
import {
  countLocalRecords,
  createWorkout,
  deleteAllLocalData,
  saveDataMode,
  savePreference,
} from "./local-repositories";

const CLOUD_SYNC_ENABLED_KEY = "cloudSync.enabled";

describe("local-only privacy boundary", () => {
  beforeEach(async () => {
    isSupabaseBrowserConfiguredSpy.mockClear();
    createSupabaseBrowserClientSpy.mockClear();
    await deleteAllLocalData();
  });

  afterAll(async () => {
    await deleteAllLocalData();
    localDb.close();
    await localDb.delete();
  });

  it("treats missing/invalid data mode preference as non-cloud-sync and does not upload", async () => {
    await savePreference("dataMode", "definitely-not-a-real-mode");
    await savePreference(CLOUD_SYNC_ENABLED_KEY, true);
    await createWorkout({ title: "Queued workout" });

    const result = await runCloudSync();
    const counts = await countLocalRecords();

    expect(result.status).toBe("disabled");
    expect(result.queued).toBeGreaterThan(0);
    expect(counts.queuedMutations).toBeGreaterThan(0);
    expect(createSupabaseBrowserClientSpy).not.toHaveBeenCalled();
  });

  it("does not call remote sync paths even with stale cloudSync.enabled=true when mode is local-only", async () => {
    await saveDataMode("local-only");
    await savePreference(CLOUD_SYNC_ENABLED_KEY, true);
    await createWorkout({ title: "Queued workout" });

    const result = await runCloudSync();

    expect(result.status).toBe("disabled");
    expect(result.queued).toBeGreaterThan(0);
    expect(createSupabaseBrowserClientSpy).not.toHaveBeenCalled();
  });
});
