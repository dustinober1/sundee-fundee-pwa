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
const authorsRoute = read("src/app/authors/[author]/page.tsx");
const methodologyRoute = read("src/app/methodology/page.tsx");
const workoutPlanRoute = read("src/app/workout-plans/[plan]/page.tsx");
const science = read("src/app/science/page.tsx");
const proxy = fs.existsSync(path.join(root, "src/proxy.ts"))
  ? read("src/proxy.ts")
  : read("src/middleware.ts");
const toolsIndexRoute = read("src/app/tools/page.tsx");
const toolDetailRoute = read("src/app/tools/[tool]/page.tsx");
const trainingToolsRegistry = read("src/lib/training-tools.ts");
const authorsRegistry = read("src/lib/authors.ts");
const internalLinking = read("src/lib/internal-linking.ts");
const cycleSymptomModifier = read(
  "src/components/tools/CycleSymptomWorkoutModifier.tsx",
);
const registeredToolSlugs = Array.from(
  trainingToolsRegistry.matchAll(/slug: "([^"]+)"/g),
  (match) => match[1],
);
const toolDetailMappings = new Map([
  ["readiness-score-calculator", "ReadinessScoreCalculator"],
  ["deload-week-planner", "DeloadPlanner"],
  ["one-rep-max-readiness-checklist", "OneRepMaxReadinessChecklist"],
  ["rpe-rir-chart", "RpeRirChart"],
  ["cycle-symptom-workout-modifier", "CycleSymptomWorkoutModifier"],
]);

const highIntentSlugs = [
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
];

function getSeoPageBlock(slug) {
  const slugToken = `slug: "${slug}"`;
  const start = registry.indexOf(slugToken);
  assert.notEqual(start, -1, `${slug} missing from SEO registry`);

  const nextStart = registry.indexOf('\n  {\n    slug: "', start + slugToken.length);
  return registry.slice(start, nextStart === -1 ? undefined : nextStart);
}

function getFunctionBlock(source, functionName) {
  const start = source.indexOf(`export function ${functionName}`);
  assert.notEqual(start, -1, `${functionName} missing from SEO helper source`);

  const signatureEnd = source.indexOf(") {", start);
  assert.notEqual(signatureEnd, -1, `${functionName} signature terminator missing`);

  const bodyStart = signatureEnd + 2;

  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  assert.fail(`${functionName} body did not terminate cleanly`);
}

const blogPostingHelper = getFunctionBlock(seo, "buildBlogPostingJsonLd");
const trainingToolHelper = getFunctionBlock(seo, "buildTrainingToolJsonLd");

for (const slug of expectedSlugs) {
  assert.match(registry, new RegExp(`slug: "${slug}"`), `${slug} missing from SEO registry`);
}

assert.match(registry, /export const seoPages/, "SEO registry should export seoPages");
assert.match(registry, /comparisonRows\?: SeoPageComparisonRow\[]/, "SEO registry should support comparison rows");
assert.match(registry, /workflowSteps\?: SeoPageWorkflowStep\[]/, "SEO registry should support workflow steps");
assert.match(registry, /proofBlocks\?: SeoPageProofBlock\[]/, "SEO registry should support proof blocks");
assert.match(registry, /relatedTools\?: SeoPageLink\[]/, "SEO registry should support related tool links");
assert.match(registry, /export const SEO_PAGES_LAST_MODIFIED = "2026-05-24"/, "SEO page last-modified date should reflect the richer SEO page update");
for (const slug of highIntentSlugs) {
  const block = getSeoPageBlock(slug);
  assert.match(block, /comparisonRows:\s*comparisonRows\(/, `${slug} should define comparison rows`);
  assert.match(block, /workflowSteps:\s*workflowSteps\(/, `${slug} should define workflow steps`);
  assert.match(block, /proofBlocks:\s*proofBlocks\(/, `${slug} should define proof blocks`);
  assert.match(block, /relatedTools:\s*\[/, `${slug} should link at least one related tool`);
}
assert.match(route, /generateStaticParams/, "SEO route should statically generate registry pages");
assert.match(route, /dynamicParams\s*=\s*false/, "SEO route should 404 unknown slugs");
assert.match(route, /title:\s*page\.title/, "SEO route metadata should use the query-targeted page title");
assert.match(route, /page\.comparisonRows\.map/, "SEO route should render comparison rows");
assert.match(route, /page\.workflowSteps\.map/, "SEO route should render workflow steps");
assert.match(route, /page\.proofBlocks\.map/, "SEO route should render proof blocks");
assert.match(route, /page\.relatedTools\.map/, "SEO route should render related tools");
assert.match(route, /getSeoPageInternalLinks/, "SEO route should wire topic/resource bridge links");
assert.match(route, /buildEnhancedSoftwareApplicationJsonLd/, "SEO route should emit the enhanced software application schema");
assert.match(blogPostRoute, /dynamicParams\s*=\s*false/, "Blog post route should 404 unknown slugs");
assert.match(blogPostRoute, /buildBlogPostingJsonLd/, "Blog post route should emit the shared BlogPosting schema helper");
assert.match(blogPostRoute, /getBlogPostInternalLinks/, "Blog post route should render deterministic internal links");
assert.match(blogPostRoute, /getAuthorUrl/, "Blog post route should link author and reviewer metadata to author pages");
assert.match(blogPostRoute, /Reviewed by/, "Blog post route should keep the visible review badge");
assert.match(blogPostRoute, /Editorial methodology/, "Blog post route should expose the methodology link");
assert.match(blogPostRoute, /post\.sources\.map/, "Blog post route should render the source list");
assert.match(blogPostRoute, /Medical boundary/, "Blog post route should render a medical boundary callout");
assert.match(blogTopicRoute, /dynamicParams\s*=\s*false/, "Blog topic route should 404 unknown topics");
assert.match(blogTopicRoute, /getTopicHub/, "Blog topic route should render topic hub content");
assert.match(blogTopicRoute, /relatedTools/, "Blog topic route should link related tools");
assert.match(blogTopicRoute, /getTopicHubDecisionLinks/, "Blog topic route should link back into product and SEO decision pages");
assert.match(authorsRegistry, /slug: "sundee-fundee-team"/, "Authors registry should define the Sundee Fundee team profile");
assert.match(authorsRegistry, /slug: "sundee-fundee-editorial-review"/, "Authors registry should define the editorial review profile");
assert.match(authorsRegistry, /methodologyHref: "\/methodology"/, "Author profiles should link to the methodology route");
assert.match(authorsRoute, /generateStaticParams/, "Author route should statically generate known author pages");
assert.match(authorsRoute, /buildProfilePageJsonLd/, "Author route should emit profile schema");
assert.match(authorsRoute, /Back to methodology/, "Author route should connect back to methodology");
assert.match(authorsRoute, /Written by/, "Author route should distinguish written articles");
assert.match(authorsRoute, /Reviewed by/, "Author route should distinguish reviewed articles");
assert.match(methodologyRoute, /What shows on article pages/, "Methodology route should explain article trust signals");
assert.match(methodologyRoute, /View profile →/, "Methodology route should connect to contributor pages");
assert.match(internalLinking, /getBlogPostInternalLinks/, "Internal linking helper should export blog post links");
assert.match(internalLinking, /getSeoPageInternalLinks/, "Internal linking helper should export SEO page links");
assert.match(internalLinking, /getTopicHubDecisionLinks/, "Internal linking helper should export topic hub decision links");
assert.match(trainingToolsRegistry, /export const trainingTools/, "Training tool registry should export trainingTools");
assert.match(trainingToolsRegistry, /calculateReadinessRecommendation/, "Training tool registry should export readiness recommendation logic");
assert.match(trainingToolsRegistry, /calculateEstimatedOneRepMax/, "Training tool registry should export estimated one rep max logic");
assert.match(trainingToolsRegistry, /classifyDeloadNeed/, "Training tool registry should export deload classification logic");
assert.match(toolsIndexRoute, /trainingTools\.map/, "Tools index route should render registered tools");
assert.match(toolDetailRoute, /generateStaticParams/, "Tool detail route should statically generate registered tools");
assert.match(toolDetailRoute, /dynamicParams\s*=\s*false/, "Tool detail route should 404 unknown tool slugs");
assert.match(toolDetailRoute, /getTrainingTool/, "Tool detail route should load tools from the registry");
assert.match(toolDetailRoute, /buildWebPageJsonLd/, "Tool detail route should emit WebPage schema");
assert.match(toolDetailRoute, /buildTrainingToolJsonLd/, "Tool detail route should emit the shared training tool schema");
assert.equal(
  registeredToolSlugs.length,
  5,
  "Training tools registry should define exactly five tool slugs in this slice",
);
for (const slug of registeredToolSlugs) {
  const componentName = toolDetailMappings.get(slug);
  assert.ok(componentName, `Missing expected detail-route component mapping for ${slug}`);
  assert.match(
    toolDetailRoute,
    new RegExp(`case "${slug}"[\\s\\S]*<${componentName}`),
    `Tool detail route should map ${slug} to ${componentName}`,
  );
}
assert.match(
  cycleSymptomModifier,
  /spotting/i,
  "Cycle symptom modifier should support spotting when the route copy promises it",
);
assert.match(workoutPlanRoute, /generateStaticParams/, "Workout plan detail route should statically generate plan pages");
assert.match(workoutPlanRoute, /dynamicParams\s*=\s*false/, "Workout plan detail route should 404 unknown plan slugs");
assert.match(workoutPlanRoute, /buildFaqPageJsonLd/, "Workout plan detail route should emit FAQPage schema");
assert.match(workoutPlanRoute, /buildItemListJsonLd/, "Workout plan detail route should emit ItemList schema");
assert.match(workoutPlanRoute, /buildWebPageJsonLd/, "Workout plan detail route should emit landing-page WebPage schema");
assert.match(workoutPlanRoute, /url:\s*absoluteUrl\(plan\.pdfPath\)/, "Workout plan downloadable schema should point at the PDF URL");
assert.match(route, /buildFaqPageJsonLd/, "SEO route should emit FAQPage schema");
assert.match(route, /buildWebPageJsonLd/, "SEO route should emit page-specific WebPage schema");
assert.match(route, /buildItemListJsonLd/, "SEO route should emit ItemList schema for hubs");
assert.match(route, /openGraph:\s*{[\s\S]*title:\s*page\.title/, "SEO route Open Graph metadata should use the page title");
assert.match(route, /twitter:\s*{[\s\S]*title:\s*page\.title/, "SEO route Twitter metadata should use the page title");
assert.match(sitemap, /seoPages/, "Sitemap should include SEO registry pages");
assert.match(sitemap, /trainingTools/, "Sitemap should include training tool routes");
assert.match(sitemap, /workoutPlans/, "Sitemap should include workout plan detail routes");
assert.match(sitemap, /authors/, "Sitemap should include author routes");
assert.match(sitemap, /`\$\{SITE_URL\}\/workout-plans\/\$\{plan\.slug\}`/, "Sitemap should include the workout plan detail route family");
assert.match(sitemap, /`\$\{SITE_URL\}\/tools`/, "Sitemap should include the tools index route");
assert.match(sitemap, /`\$\{SITE_URL\}\/methodology`/, "Sitemap should include the methodology route");
assert.match(sitemap, /getAuthorUrl/, "Sitemap should build author entries from the shared author helper");
for (const path of ["/science", "/roadmap", "/donate"]) {
  assert.match(sitemap, new RegExp(`\\$\\{SITE_URL\\}${path}`), `Sitemap should include ${path}`);
}
assert.doesNotMatch(sitemap, /\/privacy/, "Noindex privacy page should not be listed in sitemap");
assert.doesNotMatch(sitemap, /\/terms/, "Noindex terms page should not be listed in sitemap");
assert.match(sitemap, /url: `\$\{SITE_URL\}\/science`[\s\S]*?priority: 0\.75/, "Science sitemap priority should reflect the updated trust page");
assert.match(robots, /disallow:\s*\[[\s\S]*"\/api\/"/, "Robots should keep API routes out of crawl");
assert.match(seo, /buildSoftwareApplicationJsonLd/, "SoftwareApplication schema helper missing");
assert.match(seo, /buildEnhancedSoftwareApplicationJsonLd/, "Enhanced software application schema helper missing");
assert.match(seo, /buildBlogPostingJsonLd/, "BlogPosting schema helper missing");
assert.match(seo, /buildProfilePageJsonLd/, "ProfilePage schema helper missing");
assert.match(seo, /buildTrainingToolJsonLd/, "Training tool schema helper missing");
assert.match(seo, /buildWebPageJsonLd/, "WebPage schema helper missing");
assert.match(seo, /buildWorkoutPlanJsonLd/, "Workout plan schema helper missing");
assert.match(seo, /buildFaqPageJsonLd/, "FAQPage schema helper missing");
assert.match(seo, /buildItemListJsonLd/, "ItemList schema helper missing");
assert.doesNotMatch(blogPostingHelper, /reviewedBy:/, "BlogPosting schema helper should not emit reviewedBy");
assert.match(
  blogPostingHelper,
  /publisher:\s*\{\s*"@type": "Organization",\s*name: source\.publisher,\s*\}/,
  "BlogPosting citations should emit schema-compatible publisher organizations",
);
assert.match(
  trainingToolHelper,
  /"@type": "WebApplication"/,
  "Training tool schema should identify on-page tools as WebApplication",
);
assert.match(
  trainingToolHelper,
  /operatingSystem: "Any"/,
  "Training tool schema should target browser-based tools instead of iOS-only defaults",
);
assert.match(
  trainingToolHelper,
  /browserRequirements: "Requires a modern JavaScript-enabled browser"/,
  "Training tool schema should describe browser requirements",
);
assert.doesNotMatch(
  trainingToolHelper,
  /APP_STORE_URL|offers:|HealthApplication/,
  "Training tool schema should not inherit native app store defaults",
);
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
assert.match(nextConfig, /source:\s*"\/workout-plans\/\(\.\*\\\\\.pdf\)"/, "Workout plan PDF assets should keep the long cache header");
assert.match(nextConfig, /source:\s*"\/workout-plans\/\(\.\*\\\\\.png\)"/, "Workout plan cover images should keep the long cache header");
assert.doesNotMatch(nextConfig, /source:\s*"\/workout-plans\/:path\*"/, "Workout plan HTML routes should not share the broad asset cache rule");

console.log(`Validated ${expectedSlugs.length} SEO pages and schema integrations.`);
