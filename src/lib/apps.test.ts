import { describe, expect, it } from "vitest";
import { getSundeeApp, primaryApp, sideApps, sundeeApps } from "./apps";

describe("sundeeApps", () => {
  it("has one primary app and three side apps", () => {
    expect(primaryApp.slug).toBe("sundee-fundee");
    expect(sundeeApps.filter((app) => app.role === "primary")).toHaveLength(1);
    expect(sideApps.map((app) => app.slug)).toEqual([
      "sundee-ruck-tracker",
      "load-that-bar",
      "sundee-3d-print-cost",
    ]);
  });

  it("keeps every App Store URL valid and app-specific", () => {
    expect.assertions(sundeeApps.length);

    for (const app of sundeeApps) {
      const url = new URL(app.appStoreUrl);

      expect(`${url.origin}${url.pathname}`).toMatch(
        /^https:\/\/apps\.apple\.com\/us\/app\/.+\/id\d+$/,
      );
    }
  });

  it("captures privacy and monetization categories for the legal pages", () => {
    expect(getSundeeApp("sundee-fundee").privacyLabel).toBe("linked-data");
    expect(getSundeeApp("sundee-ruck-tracker").privacyCategories).toContain(
      "Precise Location",
    );

    for (const slug of ["load-that-bar", "sundee-3d-print-cost"] as const) {
      const app = getSundeeApp(slug);

      expect(app.priceLabel).toBe("$0.99");
      expect(app.monetization).toBe("paid-download");
      expect(app.privacyLabel).toBe("data-not-collected");
    }
  });
});
