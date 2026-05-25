import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const expectedSlugs = [
  "best-strength-training-app-for-women",
  "best-apple-health-strength-training-app",
  "strength-training-app-alternatives",
  "best-recovery-strength-training-app",
  "free-strength-training-app-for-women",
  "strength-training-log-for-women",
  "hrv-strength-training-app",
  "fitbod-alternative-for-women",
  "hevy-alternative-for-strength-training",
  "readiness-score-strength-training",
  "cycle-based-strength-training",
  "injury-friendly-workout-planner",
  "strength-training-pr-tracker",
  "deload-week-planner",
  "strength-training-plan-for-women",
  "beginner-strength-training-plan",
  "strength-training-after-injury",
  "recovery-based-workout-plan",
  "two-day-strength-training-plan-for-women",
  "perimenopause-strength-training",
  "postpartum-strength-training-app",
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
const robots = read("src/app/robots.ts");
const nextConfig = read("next.config.ts");
const seo = read("src/lib/seo.ts");
const footer = read("src/components/SiteFooter.tsx");
const home = read("src/app/page.tsx");
const faq = read("src/app/faq/page.tsx");
const donate = read("src/app/donate/page.tsx");
const jsonLd = read("src/components/JsonLd.tsx");
const blogPostRoute = read("src/app/blog/[slug]/page.tsx");
const blogTopicRoute = read("src/app/blog/topic/[topic]/page.tsx");
const workoutPlanRoute = read("src/app/workout-plans/[plan]/page.tsx");
const science = read("src/app/science/page.tsx");
const proxy = read("src/proxy.ts");
const toolsIndexRoute = read("src/app/tools/page.tsx");
const toolDetailRoute = read("src/app/tools/[tool]/page.tsx");
const trainingToolsRegistry = read("src/lib/training-tools.ts");

for (const slug of expectedSlugs) {
  assert.match(registry, new RegExp(`slug: "${slug}"`), `${slug} missing from SEO registry`);
}

assert.match(registry, /export const seoPages/, "SEO registry should export seoPages");
assert.match(route, /generateStaticParams/, "SEO route should statically generate registry pages");
assert.match(route, /dynamicParams\s*=\s*false/, "SEO route should 404 unknown slugs");
assert.match(blogPostRoute, /dynamicParams\s*=\s*false/, "Blog post route should 404 unknown slugs");
assert.match(blogTopicRoute, /dynamicParams\s*=\s*false/, "Blog topic route should 404 unknown topics");
assert.match(blogTopicRoute, /getTopicHub/, "Blog topic route should render topic hub content");
assert.match(blogTopicRoute, /relatedTools/, "Blog topic route should link related tools");
assert.match(trainingToolsRegistry, /export const trainingTools/, "Training tool registry should export trainingTools");
assert.match(toolsIndexRoute, /trainingTools\.map/, "Tools index route should render registered tools");
assert.match(toolDetailRoute, /generateStaticParams/, "Tool detail route should statically generate registered tools");
assert.match(toolDetailRoute, /dynamicParams\s*=\s*false/, "Tool detail route should 404 unknown tool slugs");
assert.match(toolDetailRoute, /getTrainingTool/, "Tool detail route should load tools from the registry");
assert.match(workoutPlanRoute, /generateStaticParams/, "Workout plan detail route should statically generate plan pages");
assert.match(workoutPlanRoute, /dynamicParams\s*=\s*false/, "Workout plan detail route should 404 unknown plan slugs");
assert.match(workoutPlanRoute, /buildFaqPageJsonLd/, "Workout plan detail route should emit FAQPage schema");
assert.match(workoutPlanRoute, /buildItemListJsonLd/, "Workout plan detail route should emit ItemList schema");
assert.match(route, /buildFaqPageJsonLd/, "SEO route should emit FAQPage schema");
assert.match(route, /buildWebPageJsonLd/, "SEO route should emit page-specific WebPage schema");
assert.match(route, /buildItemListJsonLd/, "SEO route should emit ItemList schema for hubs");
assert.match(sitemap, /seoPages/, "Sitemap should include SEO registry pages");
assert.match(sitemap, /trainingTools/, "Sitemap should include training tool routes");
assert.match(sitemap, /workoutPlans/, "Sitemap should include workout plan detail routes");
assert.match(sitemap, /`\$\{SITE_URL\}\/workout-plans\/\$\{plan\.slug\}`/, "Sitemap should include the workout plan detail route family");
assert.match(sitemap, /`\$\{SITE_URL\}\/tools`/, "Sitemap should include the tools index route");
for (const path of ["/science", "/roadmap", "/donate"]) {
  assert.match(sitemap, new RegExp(`\\$\\{SITE_URL\\}${path}`), `Sitemap should include ${path}`);
}
assert.doesNotMatch(sitemap, /\/privacy/, "Noindex privacy page should not be listed in sitemap");
assert.doesNotMatch(sitemap, /\/terms/, "Noindex terms page should not be listed in sitemap");
assert.match(sitemap, /url: `\$\{SITE_URL\}\/science`[\s\S]*?priority: 0\.75/, "Science sitemap priority should reflect the updated trust page");
assert.match(robots, /disallow:\s*\[[\s\S]*"\/api\/"/, "Robots should keep API routes out of crawl");
assert.match(seo, /buildSoftwareApplicationJsonLd/, "SoftwareApplication schema helper missing");
assert.match(seo, /buildWebPageJsonLd/, "WebPage schema helper missing");
assert.match(seo, /buildWorkoutPlanJsonLd/, "Workout plan schema helper missing");
assert.match(seo, /buildFaqPageJsonLd/, "FAQPage schema helper missing");
assert.match(seo, /buildItemListJsonLd/, "ItemList schema helper missing");
assert.match(home, /buildSoftwareApplicationJsonLd/, "Homepage should emit SoftwareApplication schema");
assert.match(home, /href: "\/science"/, "Homepage should link to the science page");
assert.match(home, /free-strength-training-app-for-women/, "Homepage should link to new high-intent SEO pages");
assert.match(faq, /buildFaqPageJsonLd/, "FAQ page should emit FAQPage schema");
assert.match(donate, /export const metadata/, "Donate page should export route-specific metadata");
assert.match(donate, /canonical:\s*"\/donate"/, "Donate page should define a canonical URL");
assert.doesNotMatch(donate, /^"use client";/, "Donate route should stay server-rendered so metadata exports work");
assert.match(jsonLd, /replace\(\s*\/</, "JSON-LD should escape less-than characters before injection");
assert.match(science, /Readiness Score, Cycle-Aware Training & Injury-Aware Programming \| Sundee Fundee/, "Science page should use stronger search metadata");
assert.match(science, /buildBreadcrumbJsonLd/, "Science page should emit breadcrumb schema");
assert.match(science, /buildSoftwareApplicationJsonLd/, "Science page should emit software schema");
assert.doesNotMatch(science, /buildFaqPageJsonLd/, "Science page should not rely on FAQPage schema");
assert.match(footer, /strength-training-recovery/, "Footer should link topic/commercial SEO pages");
assert.match(footer, /free-strength-training-app-for-women/, "Footer should link high-intent commercial SEO pages");
assert.match(blogPostRoute, /opengraph-image/, "Blog posts should use generated Open Graph images");
assert.match(blogPostRoute, /width:\s*1200/, "Blog Open Graph metadata should include image width");
assert.doesNotMatch(blogPostRoute, />Learn more</, "Blog post CTA links should use descriptive anchor text");
assert.match(proxy, /pathname\.toLowerCase\(\)/, "Proxy should redirect case variants to lowercase paths");
assert.match(nextConfig, /Cache-Control/, "Static asset cache headers should be configured");
assert.match(nextConfig, /stale-while-revalidate=604800/, "Static asset cache headers should allow stale revalidation");

console.log(`Validated ${expectedSlugs.length} SEO pages and schema integrations.`);
