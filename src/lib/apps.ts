import { APP_STORE_URL } from "./site";

export type SundeeAppSlug =
  | "sundee-fundee"
  | "sundee-ruck-tracker"
  | "load-that-bar"
  | "sundee-3d-print-cost";

export type SundeeAppRole = "primary" | "side";
export type SundeeAppMonetization = "free" | "paid-download";
export type SundeeAppPrivacyLabel = "linked-data" | "data-not-collected";

export type SundeeApp = {
  slug: SundeeAppSlug;
  role: SundeeAppRole;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  appStoreUrl: string;
  category: string;
  priceLabel: "Free" | "$0.99";
  monetization: SundeeAppMonetization;
  privacyLabel: SundeeAppPrivacyLabel;
  privacySummary: string;
  privacyCategories: readonly string[];
};

export const sundeeApps = [
  {
    slug: "sundee-fundee",
    role: "primary",
    name: "Sundee Fundee",
    shortName: "Sundee Fundee",
    tagline: "Recovery-aware strength training",
    description:
      "The primary Sundee app for cycle-aware strength training, readiness context, injury-aware choices, programs, and progress tracking.",
    appStoreUrl: APP_STORE_URL,
    category: "Health & Fitness",
    priceLabel: "Free",
    monetization: "free",
    privacyLabel: "linked-data",
    privacySummary:
      "May use health and fitness data, contact information, and account identifiers to provide training features.",
    privacyCategories: ["Health", "Fitness", "Email Address", "Name", "User ID"],
  },
  {
    slug: "sundee-ruck-tracker",
    role: "side",
    name: "Sundee Ruck Tracker",
    shortName: "Ruck Tracker",
    tagline: "GPS rucks, clubs, and badges",
    description:
      "Track weighted walks with GPS, clubs, routes, goals, badges, leaderboards, Apple Watch support, and Apple Health workout saving.",
    appStoreUrl:
      "https://apps.apple.com/us/app/sundee-ruck-tracker/id6760980683",
    category: "Health & Fitness",
    priceLabel: "Free",
    monetization: "free",
    privacyLabel: "linked-data",
    privacySummary:
      "May use health and fitness data, precise location, contact information, and account identifiers for ruck tracking and app functionality.",
    privacyCategories: [
      "Health",
      "Fitness",
      "Precise Location",
      "Email Address",
      "Name",
      "User ID",
    ],
  },
  {
    slug: "load-that-bar",
    role: "side",
    name: "Load That Bar",
    shortName: "Load That Bar",
    tagline: "Barbell plate calculator",
    description:
      "Calculate exactly how to load a barbell for a target weight in pounds or kilograms using your available bar and plates.",
    appStoreUrl: "https://apps.apple.com/us/app/load-that-bar/id6769888435",
    category: "Health & Fitness",
    priceLabel: "$0.99",
    monetization: "paid-download",
    privacyLabel: "data-not-collected",
    privacySummary:
      "The app does not collect personal data. Apple may process App Store purchase, download, and account information.",
    privacyCategories: [],
  },
  {
    slug: "sundee-3d-print-cost",
    role: "side",
    name: "Sundee 3D Print Cost",
    shortName: "3D Print Cost",
    tagline: "One-time 3D print pricing",
    description:
      "Estimate material, print time, machine, energy, labor, markup, and profit so small shops and makers can quote 3D prints quickly.",
    appStoreUrl:
      "https://apps.apple.com/us/app/sundee-3d-print-cost/id6771582389",
    category: "Utilities",
    priceLabel: "$0.99",
    monetization: "paid-download",
    privacyLabel: "data-not-collected",
    privacySummary:
      "The app does not collect personal data. Apple may process App Store purchase, download, and account information.",
    privacyCategories: [],
  },
] as const satisfies readonly SundeeApp[];

export const primaryApp = sundeeApps.find((app) => app.role === "primary")!;
export const sideApps = sundeeApps.filter((app) => app.role === "side");

export function getSundeeApp(slug: SundeeAppSlug): SundeeApp {
  const app = sundeeApps.find((candidate) => candidate.slug === slug);

  if (!app) {
    throw new Error(`Unknown Sundee app: ${slug}`);
  }

  return app;
}
