import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ScienceRecommendationSimulator } from "./ScienceRecommendationSimulator";

describe("ScienceRecommendationSimulator", () => {
  it("renders the simulator controls and default recommendation", () => {
    const markup = renderToStaticMarkup(<ScienceRecommendationSimulator />);

    expect(markup).toContain("See how the training decision changes.");
    expect(markup).toContain("Readiness");
    expect(markup).toContain("Cycle context");
    expect(markup).toContain("Pain flag");
    expect(markup).toContain("Session goal");
    expect(markup).toContain("Suggested response");
    expect(markup).toContain("Run the plan, keep it honest.");
    expect(markup).toContain("aria-pressed");
  });
});
