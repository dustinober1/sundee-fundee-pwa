import { describe, expect, it } from "vitest";
import { seoPages } from "./seo-pages";

describe("SEO landing page quality", () => {
  it("adds rich sections to all high-intent comparison and feature pages", () => {
    const highIntentKinds = new Set(["comparison", "feature"]);
    const highIntentPages = seoPages.filter((page) => highIntentKinds.has(page.kind));

    expect(highIntentPages.length).toBeGreaterThan(0);

    for (const page of highIntentPages) {
      expect(page.sections.length, page.slug).toBeGreaterThanOrEqual(4);
      expect(page.comparisonRows?.length ?? 0, page.slug).toBeGreaterThanOrEqual(3);
      expect(page.workflowSteps?.length ?? 0, page.slug).toBeGreaterThanOrEqual(3);
      expect(page.proofBlocks?.length ?? 0, page.slug).toBeGreaterThanOrEqual(2);
      expect(page.relatedTools?.length ?? 0, page.slug).toBeGreaterThanOrEqual(1);
    }
  });
});
