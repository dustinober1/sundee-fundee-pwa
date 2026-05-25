import { describe, expect, it } from "vitest";
import { scoreSearchConsoleOpportunity } from "./search-console-opportunities";

describe("search console opportunities", () => {
  it("marks a high-impression low-CTR page as high priority", () => {
    expect(
      scoreSearchConsoleOpportunity({
        page: "/blog/strength-training-when-tired",
        query: "strength training when tired",
        clicks: 7,
        impressions: 1800,
        ctr: 0.0039,
        position: 8.4,
      }),
    ).toEqual({
      priority: "high",
      recommendedAction: "rewrite-title-description-and-intro",
    });
  });
});
