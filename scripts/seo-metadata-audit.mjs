import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const genericTitles = new Set(["Blog", "FAQ", "Apps", "Roadmap"]);

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function fail(message) {
  throw new Error(message);
}

function scoreTitle(title) {
  const normalized = title.trim();
  const issues = [];

  if (genericTitles.has(normalized)) issues.push("generic");
  if (normalized.length < 30) issues.push("too short");
  if (normalized.length > 70) issues.push("too long");

  return {
    ok: issues.length === 0,
    issues,
    length: normalized.length,
  };
}

function scoreDescription(description) {
  const normalized = description.trim();
  const issues = [];

  if (normalized.length < 110) issues.push("too short");
  if (normalized.length > 170) issues.push("too long");

  return {
    ok: issues.length === 0,
    issues,
    length: normalized.length,
  };
}

function assertLiteralAbsent(source, literal, context) {
  if (source.includes(literal)) {
    fail(`${context} still contains generic metadata literal ${literal}.`);
  }
}

function getRequiredMatch(source, pattern, context) {
  const match = source.match(pattern);

  if (!match) {
    fail(`Could not find ${context}.`);
  }

  return match[1];
}

function auditMetadata(label, title, description) {
  const titleResult = scoreTitle(title);
  if (!titleResult.ok) {
    fail(
      `${label} title failed metadata audit (${titleResult.issues.join(", ")}): "${title}"`,
    );
  }

  const descriptionResult = scoreDescription(description);
  if (!descriptionResult.ok) {
    fail(
      `${label} description failed metadata audit (${descriptionResult.issues.join(", ")}): "${description}"`,
    );
  }
}

const blogPage = read("src/app/blog/page.tsx");
const blogTopicPage = read("src/app/blog/topic/[topic]/page.tsx");
const topicHubs = read("src/lib/topic-hubs.ts");
const seoPages = read("src/lib/seo-pages.ts");

assertLiteralAbsent(blogPage, 'title: "Blog"', "Blog index");
assertLiteralAbsent(blogPage, 'title: "FAQ"', "Blog index");
assertLiteralAbsent(blogPage, 'title: "Apps"', "Blog index");
if (!/title:\s*hub\.metaTitle/.test(blogTopicPage)) {
  fail("Blog topic route metadata should use hub.metaTitle.");
}

if (!/description:\s*hub\.metaDescription/.test(blogTopicPage)) {
  fail("Blog topic route metadata should use hub.metaDescription.");
}

if (/title:\s*`\$\{topic\.label\} Articles`/.test(blogTopicPage)) {
  fail("Blog topic route metadata still uses a generic topic title.");
}

auditMetadata(
  "Blog index",
  getRequiredMatch(blogPage, /title: "([^"]+)"/, "blog metadata title"),
  getRequiredMatch(
    blogPage,
    /description:\s*"([^"]+)"/,
    "blog metadata description",
  ),
);

const topicTitles = [...topicHubs.matchAll(/metaTitle: "([^"]+)"/g)].map(
  (match) => match[1],
);
const topicDescriptions = [
  ...topicHubs.matchAll(/metaDescription:\s*"([^"]+)"/g),
].map((match) => match[1]);

if (topicTitles.length === 0 || topicDescriptions.length === 0) {
  fail("Topic hub metadata definitions are missing.");
}

if (topicTitles.length !== topicDescriptions.length) {
  fail("Topic hub metadata title/description counts do not match.");
}

topicTitles.forEach((title, index) => {
  auditMetadata(`Topic hub ${index + 1}`, title, topicDescriptions[index]);
});

const seoPageEntries = [
  ...seoPages.matchAll(
    /slug: "([^"]+)"[\s\S]*?\n\s+(?:metaTitle|title): "([^"]+)"/g,
  ),
].map((match) => ({
  slug: match[1],
  title: match[2],
}));

if (seoPageEntries.length === 0) {
  fail("No SEO page metadata entries were found.");
}

for (const entry of seoPageEntries) {
  const result = scoreTitle(entry.title);
  if (!result.ok) {
    fail(
      `SEO page ${entry.slug} has weak metadata title (${result.issues.join(", ")}): "${entry.title}"`,
    );
  }
}

console.log(
  `Metadata audit passed for blog index, ${topicTitles.length} topic hubs, and ${seoPageEntries.length} SEO pages.`,
);
