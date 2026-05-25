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

  it("rejects titles outside the supported length range", () => {
    expect(scoreTitle("Short title for SEO").ok).toBe(false);
    expect(
      scoreTitle(
        "Strength Training Articles for Recovery and Pain and Cycle and Wearables and Programming",
      ).ok,
    ).toBe(false);
  });

  it("checks useful description length", () => {
    expect(scoreMetaDescription("Short.").ok).toBe(false);
    expect(
      scoreMetaDescription(
        "Browse recovery-aware strength training articles about readiness, cycle context, pain modifications, wearable data, and flexible programming.",
      ).ok,
    ).toBe(true);
  });

  it("rejects overly long descriptions", () => {
    expect(
      scoreMetaDescription(
        "Browse recovery-aware strength training articles about readiness, cycle context, pain modifications, wearable data, flexible programming, practical deload timing, injury-aware changes, and everyday decision support for lifters who need more context before training.",
      ).ok,
    ).toBe(false);
  });
});
