---
name: cycle-aware-seo-blog-writer
description: Draft a net-new, 1,200+ word SEO blog article for the Sundee Fundee web repo by analyzing the last 10 published blog JSON files in src/app/blog/content, identifying topical overlap to avoid, selecting a long-tail keyword angle with search intent in mind, enforcing an editorial cadence where every third article focuses on the menstrual cycle or related women's health performance topics, and then writing the article back in the same JSON format, committing it on the current branch, pushing that branch, and opening a pull request.
---

# Cycle-Aware SEO Blog Writer

## Overview

Analyze the latest blog JSON content in `src/app/blog/content/`, determine whether the next article must be cycle-focused, research a differentiated angle, produce a publication-ready article package, write the article in the repo's existing JSON schema, commit it on the current branch, push the branch, and open a pull request.

## Workflow

1. Run PR preflight checks.
2. Inspect `src/app/blog/content/` and review the latest 10 articles.
3. Decide whether the next article must be cycle-focused.
4. Build a gap analysis from the latest 10 posts.
5. Research a fresh angle and long-tail keyword.
6. Draft the article using the existing site voice and JSON content shape.
7. Write the article JSON file in `src/app/blog/content/`.
8. Commit and push the current branch.
9. Open a pull request.
10. Run the final quality gate before returning the result.

## Preflight

- Run these commands before writing or staging anything:
  - `gh auth status`
  - `git remote get-url origin`
  - `git branch --show-current`
- If any command fails, stop immediately and report the exact blocker.
- If the current branch is the default branch, stop and tell the user a PR requires a separate head branch. Do not commit directly to the default branch unless the user explicitly changes the requirement.

## Discover Recent Content

- Always use `src/app/blog/content/` as the canonical blog content directory.
- Run `scripts/discover_recent_articles.py --root <repo-root> --limit 10`.
- Review the returned latest 10 JSON articles. Read enough of each article to capture title, publish date, tags, primary topic, audience, primary angle, likely keyword, and repeated themes.
- Treat the script output as discovery, not truth. If ordering or metadata looks wrong, inspect the files directly and correct the working set.
- Use one or more recent JSON files as the formatting template for the new article.

## Determine Cycle Cadence

- Compute the next slot from the total number of discoverable articles: `next_index = total_articles + 1`.
- If `next_index % 3 == 0`, the new article must center on the menstrual cycle or a closely related women's-health performance topic.
- If the cadence is ambiguous, state the ambiguity and default to a cycle-focused article only when recent posts underweight cycle topics.
- For cycle-focused posts, connect the topic to a practical user outcome such as strength training, recovery, nutrition, symptoms, adherence, or injury risk.

## Analyze the Latest 10 Articles

- Produce a compact gap analysis covering:
  - article title
  - likely target keyword or search intent
  - core promise
  - audience sophistication
  - themes to avoid repeating
- Identify:
  - overused topics
  - undercovered subtopics
  - stale framing to replace
  - internal-link opportunities the new article can support
- Reject article ideas that are too close to any of the last 10 posts in topic, title pattern, body framing, or search intent.

## Research and Keyword Selection

- Use available internet research tooling to verify current facts and identify long-tail keyword opportunities. Prefer primary sources and strong editorial or clinical sources when health claims are involved.
- Match the keyword to one clear search intent: informational, comparison, or problem-solving.
- Favor long-tail phrases with realistic specificity over broad head terms.
- Include:
  - primary keyword
  - 3–6 secondary or semantically related phrases
  - a concise search-intent statement
  - a working title that is not derivative of recent posts
- Use `references/seo-editorial-checklist.md` for drafting and quality criteria.
- Do not fabricate studies, statistics, or expert claims. If a claim matters, attribute it in the draft using source names or placeholders for verification.

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
  - `body`
- Keep the article body as a single JSON string with embedded Markdown headings and paragraph breaks encoded with `\n`.
- Match the repo's filename pattern exactly: `<slug>.json`.
- Reuse the current author string unless the user explicitly requests a change.
- Derive `readMinutes` realistically from article length and surrounding examples.
- Use tags and `primaryTopic` consistent with nearby articles.

## Draft the Article

- Write at least 1,200 words unless the user requests a different length.
- Use a structure that can publish cleanly from the JSON `body` field:
  - strong opening thesis
  - clear `##` and `###` hierarchy inside `body`
  - practical examples, takeaways, and scannable lists
  - concise conclusion with a soft CTA or next step
- Keep the article meaningfully different from the last 10 posts in thesis, framing, and examples.
- For cycle-focused articles, use medically cautious language. Avoid diagnosis, treatment instructions, or overstated claims.
- Suggest 3 internal links to existing relevant articles when possible.
- Prepare:
  - SEO title
  - meta description
  - slug
  - excerpt-quality description
  - tags
  - `bestFor`

## Write the Article File

- Write the new article into `src/app/blog/content/<slug>.json`.
- Use `scripts/write_article_json.py` when the standard schema is sufficient.
- If a nearby article includes required fields the script does not cover, extend the payload to match the repo before writing.
- After writing, reopen the file and verify valid JSON, correct key names, expected date fields, and body formatting.

## Commit, Push, and Open the PR

- Use the current branch. Do not create or switch branches.
- Stage only the new article file and any directly related metadata file you created. Never stage unrelated changes.
- Create a focused commit message such as `feat(blog): add article on <topic>`.
- Push the current branch to `origin` first so it exists remotely.
- Open the PR non-interactively with explicit values rather than relying on prompts or `--fill`.
- Use `gh pr create --base <base-branch> --head <current-branch> --title <pr-title> --body-file <temp-file>`.
- Use `--draft` only when the user explicitly wants a draft PR.
- The PR body should include:
  - article title
  - primary keyword
  - reason the topic is different from recent posts
  - whether the cadence required a cycle-focused article
  - paths changed
- If `gh` auth, remote configuration, or push permissions fail, stop and report the exact blocker.

## Final Quality Gate

- Verify all of the following before returning:
  - article is at least 1,200 words
  - angle is distinct from the latest 10 articles
  - every-third-post cadence is respected
  - keyword use is natural, not stuffed
  - claims are researched or clearly marked for verification
  - headings are descriptive and search-intent aligned
  - JSON is valid and matches the repo schema
  - article file was written to `src/app/blog/content/`
  - commit succeeded on the intended branch
  - branch was pushed successfully
  - pull request URL or number is available
- If the article fails any gate, revise before returning it.

## Output Format

Return results in this order:

1. `Cadence decision` — whether the next article had to be cycle-focused and why.
2. `Gap analysis` — concise comparison against the latest 10 posts.
3. `Keyword plan` — primary keyword, related phrases, and search intent.
4. `Article package` — title, slug, description, tags, bestFor, and internal-link suggestions.
5. `Written file` — repo path of the created article.
6. `Commit` — commit SHA and branch name.
7. `Pull request` — PR number and URL.
8. `Full draft` — complete article body and final JSON payload summary.

## Resources

- `scripts/discover_recent_articles.py` — discover and summarize the latest blog JSON files.
- `scripts/write_article_json.py` — write a blog article JSON file in the existing site schema.
- `references/seo-editorial-checklist.md` — drafting, differentiation, and SEO quality checklist.
