---
name: cycle-aware-seo-blog-writer
description: Draft a net-new, 1,200+ word SEO blog article for the Sundee Fundee web repo by analyzing the last 20 published blog JSON files in src/app/blog/content, identifying topical overlap to avoid, selecting a long-tail keyword angle with search intent in mind, enforcing an editorial cadence where every third article focuses on the menstrual cycle or related women's health performance topics, adding internal cross-references and external source references, writing the article back in the same JSON format, adding required blog enhancement metadata, running build/SEO validation, creating and switching to a PR-safe feature branch when needed, committing there, pushing that branch, and opening a pull request.
---

# Cycle-Aware SEO Blog Writer

## Overview

Analyze the latest blog JSON content in `src/app/blog/content/`, determine whether the next article must be cycle-focused, research a differentiated angle, produce a publication-ready article package with internal cross-references and external sources, write the article in the repo's existing JSON schema, add the required blog enhancement metadata for the new slug, create and switch to a PR-safe feature branch when needed, commit there, push the branch, and open a pull request.

## Workflow

1. Run PR preflight checks.
2. Inspect `src/app/blog/content/` and review the latest 20 articles.
3. Decide whether the next article must be cycle-focused.
4. Build a gap analysis from the latest 20 posts.
5. Research a fresh angle and long-tail keyword.
6. Map internal cross-reference opportunities and external source requirements.
7. Draft the article using the existing site voice and JSON content shape.
8. Write the article JSON file in `src/app/blog/content/`.
9. Add blog enhancement metadata for the new slug.
10. Run article, test, SEO, and production build verification.
11. Commit and push the current branch.
12. Open a pull request.
13. Run the final quality gate before returning the result.

## Preflight

- Run these commands before writing or staging anything:
  - `gh auth status`
  - `git remote get-url origin`
  - `git branch --show-current`
- If any command fails, stop immediately and report the exact blocker.
- Determine the default branch with `git symbolic-ref refs/remotes/origin/HEAD` or an equivalent non-interactive command.
- If the current branch is the default branch, automatically create and switch to a new branch before making any content changes.
- Name the new branch with a deterministic blog prefix such as `blog/<yyyy-mm-dd>-<short-topic>` or `feat/blog-<short-topic>`.
- After switching, confirm the new branch name and use it for the rest of the workflow.
- Do not commit directly to the default branch unless the user explicitly changes the requirement.

## Discover Recent Content

- Always use `src/app/blog/content/` as the canonical blog content directory.
- Run `scripts/discover_recent_articles.py --root <repo-root> --limit 20`. If the repo root does not include this script, run the bundled skill script at `.Codex/skills/cycle-aware-seo-blog-writer/scripts/discover_recent_articles.py` with `python3`.
- Review the returned latest 20 JSON articles. Read enough of each article to capture title, publish date, tags, primary topic, audience, primary angle, likely keyword, existing internal links, external source style, and repeated themes.
- Treat the script output as discovery, not truth. If ordering or metadata looks wrong, inspect the files directly and correct the working set.
- Use one or more recent JSON files as the formatting template for the new article.
- Inspect at least 3 recent articles that include a `sources` array, if available, so the new article follows the current external-reference shape instead of only mentioning sources in body copy.

## Determine Cycle Cadence

- Compute the next slot from the total number of discoverable articles: `next_index = total_articles + 1`.
- If `next_index % 3 == 0`, the new article must center on the menstrual cycle or a closely related women's-health performance topic.
- If the cadence is ambiguous, state the ambiguity and default to a cycle-focused article only when recent posts underweight cycle topics.
- For cycle-focused posts, connect the topic to a practical user outcome such as strength training, recovery, nutrition, symptoms, adherence, or injury risk.

## Analyze the Latest 20 Articles

- Produce a compact gap analysis covering:
  - article title
  - likely target keyword or search intent
  - core promise
  - audience sophistication
  - themes to avoid repeating
  - internal links already used
  - external source types already used
- Identify:
  - overused topics
  - undercovered subtopics
  - stale framing to replace
  - internal-link opportunities the new article can support
- Reject article ideas that are too close to any of the last 20 posts in topic, title pattern, body framing, or search intent.
- Reject article ideas that only rename an existing green/yellow/red decision guide without adding a new constraint, symptom pattern, training context, evidence base, or user decision.
- When overlap is unavoidable, explicitly state the new differentiation lever before drafting: audience, timing, symptom, exercise pattern, data signal, nutrition constraint, or training decision.

## Research and Keyword Selection

- Use available internet research tooling to verify current facts and identify long-tail keyword opportunities. Prefer primary sources and strong editorial or clinical sources when health claims are involved.
- Match the keyword to one clear search intent: informational, comparison, or problem-solving.
- Favor long-tail phrases with realistic specificity over broad head terms.
- For health, nutrition, injury, cycle, pregnancy, postpartum, perimenopause, supplements, medication, illness, and environmental-safety claims, use current authoritative external references. Prefer peer-reviewed papers, consensus statements, government health pages, medical institution pages, professional organizations, or established sports-nutrition bodies.
- Use at least 3 external sources for health- or science-claim articles. Use at least 1 external source for lower-risk programming articles when a factual claim would benefit from support.
- Do not cite competitors' SEO articles as authority unless they are being used only to understand search intent.
- Capture source names, URLs, and one-line relevance notes during research, then add them to the article JSON if the current schema supports `sources`.
- Include:
  - primary keyword
  - 3–6 secondary or semantically related phrases
  - a concise search-intent statement
  - a working title that is not derivative of recent posts
- Use `references/seo-editorial-checklist.md` for drafting and quality criteria.
- Do not fabricate studies, statistics, or expert claims. If a claim matters, attribute it in the draft using source names or placeholders for verification.

## Internal Links and External Sources

- Add 3–5 internal links to existing Sundee Fundee pages or blog posts when relevant.
- Choose internal links from the latest 20 articles first when they are contextually useful, then broaden to older posts or core product pages if they better serve the reader.
- Internal links must be natural cross-references inside the article body, not a dumped list at the end.
- Use descriptive anchor text that matches the linked article's topic. Avoid repeated anchors like "click here" or generic "related article".
- Do not link to the same internal URL more than once unless there is a strong reader reason.
- Add or preserve a `sources` array when nearby current articles use it. Match the local schema exactly, including key names and ordering.
- External references should support claims without sending the reader away for basic instructions. Mention source names in body copy only where attribution strengthens trust.
- Avoid unsupported medical certainty. Use careful language such as "may", "can", "is associated with", or "is worth discussing with a clinician" when the evidence or user context requires caution.

## Match the Existing JSON Format

- The article files in `src/app/blog/content/` are JSON, not Markdown.
- Match the surrounding schema exactly. At minimum preserve these keys when present in current articles:
  - `slug`
  - `title`
  - `description`
  - `author`
  - `publishedAt`
  - `updatedAt`
  - `readMinutes`
  - `tags`
  - `primaryTopic`
  - `bestFor`
  - `sources`
  - `body`
- Keep the article body as a single JSON string with embedded Markdown headings and paragraph breaks encoded with `\n`.
- Match the repo's filename pattern exactly: `<slug>.json`.
- Reuse the current author string unless the user explicitly requests a change.
- Derive `readMinutes` realistically from article length and surrounding examples.
- Use tags and `primaryTopic` consistent with nearby articles.
- If the template article has a `sources` array, include it with verified external references. If nearby current articles consistently omit `sources`, include source attribution in body copy only when that matches the established schema.

## Draft the Article

- Write at least 1,200 words unless the user requests a different length.
- Use a structure that can publish cleanly from the JSON `body` field:
  - strong opening thesis
  - clear `##` and `###` hierarchy inside `body`
  - practical examples, takeaways, and scannable lists
  - concise conclusion with a soft CTA or next step
- Keep the article meaningfully different from the last 20 posts in thesis, framing, and examples.
- For cycle-focused articles, use medically cautious language. Avoid diagnosis, treatment instructions, or overstated claims.
- Include 3–5 internal links to existing relevant articles or product pages when possible.
- Include external references in the JSON `sources` field when the schema supports it and in body attribution where useful.
- Include a short "what to do next" or decision section that makes the article actionable rather than purely explanatory.
- Prepare:
  - SEO title
  - meta description
  - slug
  - excerpt-quality description
  - tags
  - `bestFor`
  - internal-link plan
  - external-source plan

## Write the Article File

- Write the new article into `src/app/blog/content/<slug>.json`.
- Use `scripts/write_article_json.py` when the standard schema is sufficient. If the repo root does not include this script, run the bundled skill script at `.Codex/skills/cycle-aware-seo-blog-writer/scripts/write_article_json.py` with `python3`.
- If a nearby article includes required fields the script does not cover, extend the payload to match the repo before writing.
- After writing, reopen the file and verify valid JSON, correct key names, expected date fields, and body formatting.
- Verify that every internal link resolves to an existing route or article slug in the repo.
- Verify that every external source URL is present in the `sources` array when the schema supports it.

## Add Blog Enhancement Metadata

- Every new article slug must have an entry in `src/app/blog/post-enhancements.ts`; otherwise `next build` fails while collecting `/blog` page data.
- Add the new slug to `postEnhancementsBySlug` with the article intent that matches the draft:
  - `decision-guide` for green/yellow/red or train/modify/skip decision articles
  - `compare-options` for option-selection or tradeoff articles
  - `metric-explainer` for wearable or data-signal articles
  - `checklist` for pain, modification, or form audit articles
  - `protocol` for ordered process articles
  - `symptom-audit` for symptom or recovery-warning articles
  - `timeline` for staged return, phase, or progression articles
- Include `src/app/blog/post-enhancements.ts` in the staged changes whenever a new article is added.
- If tests fail because `BLOG_VALIDATION_DATE` or a hardcoded test date is stale, update the test to use the production `getTodayIso()` helper or set an explicit current validation date; do not weaken future-date validation.

## Verify Locally Before Commit

- Run all of these before committing and before opening the PR:
  - `npm test`
  - `npm run build`
  - `npm run test:metadata`
  - `npm run test:seo`
- Also parse all blog JSON files and confirm the new article is at least 1,200 words.
- Run a lightweight link audit for the new article: all internal `/blog/<slug>` links should match existing files in `src/app/blog/content/`, and any product-page links should match known app routes.
- Confirm the new article has 3–5 internal links unless the topic genuinely has fewer relevant options, and document the exception.
- Confirm health/science claims are backed by external sources or softened/removed.
- If `npm run build` fails with `Missing blog enhancement metadata for <slug>`, add or fix the `postEnhancementsBySlug` entry before proceeding.

## Commit, Push, and Open the PR

- Use the current branch if it is already a non-default branch.
- If preflight created a new branch, use that branch for all subsequent git, push, and PR steps.
- Stage only the new article file, `src/app/blog/post-enhancements.ts`, and any directly related metadata/test file you changed. Never stage unrelated changes.
- Create a focused commit message such as `feat(blog): add article on <topic>`.
- Push the current branch to `origin` first so it exists remotely.
- Open the PR non-interactively with explicit values rather than relying on prompts or `--fill`.
- Use `gh pr create --base <base-branch> --head <current-branch> --title <pr-title> --body-file <temp-file>`.
- Use `--draft` only when the user explicitly wants a draft PR.
- The PR body should include:
  - article title
  - primary keyword
  - reason the topic is different from the latest 20 posts
  - whether the cadence required a cycle-focused article
  - internal links added
  - external sources used
  - paths changed
  - verification commands run, including `npm run build`
- If `gh` auth, remote configuration, or push permissions fail, stop and report the exact blocker.

## Final Quality Gate

- Verify all of the following before returning:
  - article is at least 1,200 words
  - angle is distinct from the latest 20 articles
  - every-third-post cadence is respected
  - keyword use is natural, not stuffed
  - claims are researched, sourced, softened, or clearly marked for verification
  - external references are included for health/science claims
  - 3–5 internal cross-references are included and resolve locally
  - headings are descriptive and search-intent aligned
  - JSON is valid and matches the repo schema
  - article file was written to `src/app/blog/content/`
  - `src/app/blog/post-enhancements.ts` includes the new slug
  - `npm test` passed
  - `npm run build` passed
  - `npm run test:metadata` passed
  - `npm run test:seo` passed
  - commit succeeded on the intended branch
  - branch was pushed successfully
  - pull request URL or number is available
- If the article fails any gate, revise before returning it.

## Output Format

Return results in this order:

1. `Cadence decision` — whether the next article had to be cycle-focused and why.
2. `Gap analysis` — concise comparison against the latest 20 posts.
3. `Keyword plan` — primary keyword, related phrases, and search intent.
4. `Article package` — title, slug, description, tags, bestFor, internal links, and external sources.
5. `Written file` — repo path of the created article.
6. `Commit` — commit SHA and branch name.
7. `Pull request` — PR number and URL.
8. `Full draft` — complete article body and final JSON payload summary.

## Resources

- `scripts/discover_recent_articles.py` — discover and summarize the latest blog JSON files.
- `scripts/write_article_json.py` — write a blog article JSON file in the existing site schema.
- `references/seo-editorial-checklist.md` — drafting, differentiation, and SEO quality checklist.
