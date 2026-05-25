import { describe, expect, it } from "vitest";
import { seoPages } from "./seo-pages";

const PRIORITY_PAGE_SLUGS = new Set([
  "best-strength-training-app-for-women",
  "best-apple-health-strength-training-app",
  "best-recovery-strength-training-app",
  "free-strength-training-app-for-women",
  "strength-training-log-for-women",
  "hrv-strength-training-app",
  "fitbod-alternative-for-women",
  "hevy-alternative-for-strength-training",
  "readiness-score-strength-training",
  "injury-friendly-workout-planner",
  "strength-training-plan-for-women",
  "cycle-aware-training",
]);

describe("SEO landing page quality", () => {
  it("adds rich sections to the priority high-intent SEO pages", () => {
    const priorityPages = seoPages.filter((page) => PRIORITY_PAGE_SLUGS.has(page.slug));

    expect(priorityPages).toHaveLength(PRIORITY_PAGE_SLUGS.size);

    for (const page of priorityPages) {
      expect(page.sections.length, page.slug).toBeGreaterThanOrEqual(4);
      expect(page.comparisonRows?.length ?? 0, page.slug).toBeGreaterThanOrEqual(3);
      expect(page.workflowSteps?.length ?? 0, page.slug).toBeGreaterThanOrEqual(3);
      expect(page.proofBlocks?.length ?? 0, page.slug).toBeGreaterThanOrEqual(2);
      expect(page.relatedTools?.length ?? 0, page.slug).toBeGreaterThanOrEqual(1);
    }
  });
});
