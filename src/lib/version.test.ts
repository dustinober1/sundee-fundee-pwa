import { describe, expect, it } from "vitest";

import { APP_VERSION, isStableVersion } from "./version";

describe("version", () => {
  it("exports a semver app version", () => {
    expect(isStableVersion(APP_VERSION)).toBe(true);
  });

  it("rejects non-semver strings", () => {
    expect(isStableVersion("1.0")).toBe(false);
    expect(isStableVersion("1.0.0-beta")).toBe(false);
    expect(isStableVersion("v1.0.0")).toBe(false);
  });
});
