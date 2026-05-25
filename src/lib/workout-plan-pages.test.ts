import { describe, expect, it } from "vitest";
import { workoutPlans } from "./workout-plans";

describe("workout plan SEO pages", () => {
  it("has complete landing-page data for every printable plan", () => {
    for (const plan of workoutPlans) {
      expect(plan.landingTitle.length).toBeGreaterThanOrEqual(35);
      expect(plan.landingDescription.length).toBeGreaterThanOrEqual(120);
      expect(plan.searchIntent.length).toBeGreaterThanOrEqual(25);
      expect(plan.sampleWeek).toHaveLength(3);
      expect(plan.whoItFits.length).toBeGreaterThanOrEqual(3);
      expect(plan.whoShouldSkip.length).toBeGreaterThanOrEqual(2);
      expect(plan.faqs.length).toBeGreaterThanOrEqual(4);
      expect(plan.relatedLinks.length).toBeGreaterThanOrEqual(3);
    }
  });
});
