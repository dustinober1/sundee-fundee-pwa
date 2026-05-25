import { describe, expect, it } from "vitest";
import { scoreMetaDescription, scoreTitle } from "./metadata-quality";

describe("metadata quality", () => {
  it("rejects generic titles", () => {
    expect(scoreTitle("Blog").ok).toBe(false);
    expect(
      scoreTitle(
        "Strength Training Articles for Recovery, Cycle, Pain & Wearables",
      ).ok,
    ).toBe(true);
  });

  it("checks useful description length", () => {
    expect(scoreMetaDescription("Short.").ok).toBe(false);
    expect(
      scoreMetaDescription(
        "Browse recovery-aware strength training articles about readiness, cycle context, pain modifications, wearable data, and flexible programming.",
      ).ok,
    ).toBe(true);
  });
});
