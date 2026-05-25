import { describe, expect, it } from "vitest";
import {
  scoreSearchConsoleOpportunity,
  scoreSearchConsoleOpportunities,
} from "./search-console-opportunities";

describe("search console opportunities", () => {
  it("marks an exported high-impression low-CTR page as high priority", () => {
    expect(
      scoreSearchConsoleOpportunity({
        page: "/blog/strength-training-when-tired",
        query: "strength training when tired",
        clicks: 7,
        impressions: 1800,
        ctr: 0.39,
        position: 8.4,
      }),
    ).toEqual({
      priority: "high",
      recommendedAction: "rewrite-title-description-and-intro",
    });
  });

  it("treats equality edges for high priority correctly", () => {
    expect(
      scoreSearchConsoleOpportunity({
        page: "/blog/high-boundary",
        query: "high boundary",
        clicks: 10,
        impressions: 1000,
        ctr: 0.99,
        position: 12,
      }),
    ).toEqual({
      priority: "high",
      recommendedAction: "rewrite-title-description-and-intro",
    });

    expect(
      scoreSearchConsoleOpportunity({
        page: "/blog/high-ctr-edge",
        query: "high ctr edge",
        clicks: 10,
        impressions: 1000,
        ctr: 1,
        position: 12,
      }),
    ).toEqual({
      priority: "medium",
      recommendedAction: "add-internal-links-and-refresh-section",
    });
  });

  it("treats equality edges for medium priority correctly", () => {
    expect(
      scoreSearchConsoleOpportunity({
        page: "/blog/medium-boundary",
        query: "medium boundary",
        clicks: 10,
        impressions: 500,
        ctr: 1.99,
        position: 20,
      }),
    ).toEqual({
      priority: "medium",
      recommendedAction: "add-internal-links-and-refresh-section",
    });

    expect(
      scoreSearchConsoleOpportunity({
        page: "/blog/medium-position-edge",
        query: "medium position edge",
        clicks: 10,
        impressions: 500,
        ctr: 2,
        position: 20,
      }),
    ).toEqual({
      priority: "low",
      recommendedAction: "monitor",
    });
  });

  it("supports explicit fraction CTR values when the unit is declared", () => {
    expect(
      scoreSearchConsoleOpportunity({
        page: "/blog/fraction-ctr",
        query: "fraction ctr",
        clicks: 7,
        impressions: 1800,
        ctr: 0.0039,
        ctrUnit: "fraction",
        position: 8.4,
      }),
    ).toEqual({
      priority: "high",
      recommendedAction: "rewrite-title-description-and-intro",
    });
  });

  it("scores batches and preserves the original row fields", () => {
    expect(
      scoreSearchConsoleOpportunities([
        {
          page: "/blog/high",
          query: "high",
          clicks: 7,
          impressions: 1800,
          ctr: 0.39,
          position: 8.4,
        },
        {
          page: "/blog/medium",
          query: "medium",
          clicks: 12,
          impressions: 700,
          ctr: 1.5,
          position: 18,
        },
        {
          page: "/blog/low",
          query: "low",
          clicks: 20,
          impressions: 499,
          ctr: 0.4,
          position: 11,
        },
      ]),
    ).toEqual([
      {
        page: "/blog/high",
        query: "high",
        clicks: 7,
        impressions: 1800,
        ctr: 0.39,
        position: 8.4,
        priority: "high",
        recommendedAction: "rewrite-title-description-and-intro",
      },
      {
        page: "/blog/medium",
        query: "medium",
        clicks: 12,
        impressions: 700,
        ctr: 1.5,
        position: 18,
        priority: "medium",
        recommendedAction: "add-internal-links-and-refresh-section",
      },
      {
        page: "/blog/low",
        query: "low",
        clicks: 20,
        impressions: 499,
        ctr: 0.4,
        position: 11,
        priority: "low",
        recommendedAction: "monitor",
      },
    ]);
  });
});
