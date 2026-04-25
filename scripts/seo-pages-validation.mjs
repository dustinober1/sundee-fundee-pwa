import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const expectedSlugs = [
  "best-strength-training-app-for-women",
  "best-apple-health-strength-training-app",
  "strength-training-app-alternatives",
  "best-recovery-strength-training-app",
  "readiness-score-strength-training",
  "cycle-based-strength-training",
  "injury-friendly-workout-planner",
  "strength-training-pr-tracker",
  "deload-week-planner",
  "strength-training-plan-for-women",
  "beginner-strength-training-plan",
  "strength-training-after-injury",
  "recovery-based-workout-plan",
  "strength-training-during-period",
  "strength-training-recovery",
  "strength-training-for-women",
  "lifting-with-injuries",
  "wearables-and-strength-training",
  "cycle-aware-training",
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const registry = read("src/lib/seo-pages.ts");
const route = read("src/app/[seoSlug]/page.tsx");
const sitemap = read("src/app/sitemap.ts");
const seo = read("src/lib/seo.ts");
const footer = read("src/components/SiteFooter.tsx");
const home = read("src/app/page.tsx");
const faq = read("src/app/faq/page.tsx");

for (const slug of expectedSlugs) {
  assert.match(registry, new RegExp(`slug: "${slug}"`), `${slug} missing from SEO registry`);
}

assert.match(registry, /export const seoPages/, "SEO registry should export seoPages");
assert.match(route, /generateStaticParams/, "SEO route should statically generate registry pages");
assert.match(route, /buildFaqPageJsonLd/, "SEO route should emit FAQPage schema");
assert.match(route, /buildItemListJsonLd/, "SEO route should emit ItemList schema for hubs");
assert.match(sitemap, /seoPages/, "Sitemap should include SEO registry pages");
assert.match(seo, /buildSoftwareApplicationJsonLd/, "SoftwareApplication schema helper missing");
assert.match(seo, /buildFaqPageJsonLd/, "FAQPage schema helper missing");
assert.match(seo, /buildItemListJsonLd/, "ItemList schema helper missing");
assert.match(home, /buildSoftwareApplicationJsonLd/, "Homepage should emit SoftwareApplication schema");
assert.match(faq, /buildFaqPageJsonLd/, "FAQ page should emit FAQPage schema");
assert.match(footer, /strength-training-recovery/, "Footer should link topic/commercial SEO pages");

console.log(`Validated ${expectedSlugs.length} SEO pages and schema integrations.`);
