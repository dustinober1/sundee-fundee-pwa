# Design: 5 Long-Tail SEO Blog Articles

**Date:** 2026-04-27
**Status:** Approved (specs); ready for implementation plan
**Owner:** Sundee Fundee blog

## Summary

Add 5 new blog articles to the Sundee Fundee blog targeting long-tail SEO opportunities identified through gap analysis of the existing 16-post catalog. The articles are allocated across topic clusters to (a) strengthen weak clusters, (b) extend the strongest cluster (Women Who Lift) into new search territory beyond menstrual-cycle queries, and (c) complete the wearable-brand triumvirate.

## Goals

- Capture long-tail organic search traffic for high-intent lifter queries currently unaddressed by the site.
- Strengthen topic-cluster authority for SEO crawl/internal-link efficiency.
- Maintain editorial consistency with the existing 16-post catalog (length, voice, structure, CTA pattern).

## Non-Goals

- Redesigning the blog template, taxonomy, or post schema.
- Adding new top-level `BlogTopicSlug` values; new tags only.
- Generating image assets, OG images beyond the existing auto-generation, or video.
- Changing publishing infrastructure or analytics.
- Drafting full prose bodies in this spec (handled in implementation plan / writing phase).

## Gap Analysis (rationale for allocation)

Existing post counts by topic:

| Topic | Posts | Notes |
|---|---|---|
| Women Who Lift | 5 | All menstrual-cycle focused; no life-stage coverage (perimenopause, postpartum). |
| Programming Basics | 5 | Well-covered. |
| Recovery & Readiness | 3 | Has HRV-low and sleep; missing overtraining/deload-decision query. |
| Wearables & Health Data | 2 | Garmin + Apple Health only; no WHOOP or Oura. |
| Training Around Pain | 1 | Weakest cluster; high-intent body-part-specific queries unserved. |

The 5 articles allocate as: 2 Women Who Lift (life stages, not cycle), 1 Pain, 1 Wearables, 1 Recovery.

## Article Spec Template

Each article is specified with this schema, matching `BlogPost` in `src/app/blog/posts.ts`:

```
slug:           kebab-case, ≤60 chars, includes primary keyword
title:          ≤60 chars, primary keyword near front
description:    150–160 chars meta description
primaryTopic:   one of the 5 BlogTopicSlug values
tags:           4–6 tags drawn from existing matchTags + 1–2 new long-tail tags
readMinutes:    10–13 (matches house length)
bestFor:        one-sentence audience statement
author:         "Sundee Fundee Team"
publishedAt:    staggered (one per week starting 2026-05-04)
```

### Outline structure (handed to writer/agent)

- **Lede** (~250–350 words): scenario the reader recognizes, the misconception, the thesis.
- **4–5 H2 sections** (~400–600 words each), keyword-aligned but not stuffed.
- **"The Takeaway"** closer (~200 words).
- **Internal links:** 2–3 to existing related posts in the same topic + 1 to the topic's `productHref`.
- **No bullet lists in body** (matches house style — flowing prose).
- **No external link block** (matches existing posts).

### Style guardrails

- Authoritative but not clinical; second-person ("you" / "the lifter").
- Concrete numbers when possible (HRV deltas, RPE values, week ranges).
- Acknowledges individual variation; avoids prescriptive "always/never".
- Anti-pattern → mechanism → application arc per H2.

## The 5 Article Specs

### Article 1 — Perimenopause

| Field | Value |
|---|---|
| slug | `perimenopause-strength-training-programming` |
| title | Perimenopause Strength Training: A Programming Guide |
| description | Perimenopause shifts recovery, sleep, and strength expression. Learn how to program lifting through the hormonal transition without losing progress. |
| primaryTopic | `women-who-lift` |
| tags | `["female-athletes", "cycle", "perimenopause", "programming", "recovery"]` |
| New tags | `perimenopause` |
| readMinutes | 12 |
| bestFor | Lifters in their late 30s through early 50s navigating cycle changes, sleep disruption, and shifting recovery capacity. |
| publishedAt | 2026-05-04 |

**H2 outline:**

1. What perimenopause actually changes for the lifter (estrogen variability, FSH rise, cycle irregularity).
2. Why standard cycle-phase programming stops mapping cleanly.
3. Recovery capacity in perimenopause: sleep fragmentation and HRV trends.
4. A flexible programming framework: anchor lifts, autoregulated volume, longer recovery windows.
5. When to test, when to hold, when to back off (heat-load and sleep signal rules).

**Internal links:** `cycle-phase-strength-programming`, `menstrual-cycle-recovery-metrics-wearables`, `when-hrv-is-low-strength-training`.
**Product link:** `/for-women-who-lift`.

---

### Article 2 — Postpartum Return

| Field | Value |
|---|---|
| slug | `postpartum-return-to-lifting-timeline` |
| title | Returning to Lifting Postpartum: A Phased Timeline |
| description | A phased postpartum return-to-lifting timeline covering core, pelvic floor, load progression, and the readiness signals that gate each stage. |
| primaryTopic | `women-who-lift` |
| tags | `["female-athletes", "postpartum", "programming", "recovery", "pelvic-floor"]` |
| New tags | `postpartum`, `pelvic-floor` |
| readMinutes | 13 |
| bestFor | Lifters in the first 12 months postpartum who want a structured, signal-driven return rather than a calendar-based one. |
| publishedAt | 2026-05-11 |

**H2 outline:**

1. Why postpartum return is a recovery problem, not a strength problem.
2. Phase 1 (weeks 0–6): breath, alignment, pelvic floor reconnection.
3. Phase 2 (weeks 6–12): reloaded fundamentals and core staging.
4. Phase 3 (months 3–6): progressive overload with sleep and bleeding signals.
5. Phase 4 (months 6–12): testing, cycle return, and the new baseline.

**Internal links:** `cycle-phase-strength-programming`, `breathing-bracing-lifting-technique`, `training-around-injuries-without-losing-progress`.
**Product link:** `/for-women-who-lift`.

---

### Article 3 — Lower Back Pain Deadlift

| Field | Value |
|---|---|
| slug | `deadlifting-with-lower-back-pain-modifications` |
| title | Deadlifting With Lower Back Pain: Modifications That Work |
| description | Lower back pain doesn't have to mean stopping deadlifts. Use these stance, range, and load modifications to keep training while the back recovers. |
| primaryTopic | `training-around-pain` |
| tags | `["injuries", "pain", "deadlift", "adaptation", "programming"]` |
| New tags | `deadlift` |
| readMinutes | 11 |
| bestFor | Lifters with non-specific lower back irritation who want to keep deadlifting through it without making it worse. |
| publishedAt | 2026-05-18 |

**H2 outline:**

1. Three flavors of lower back pain in lifters and why they need different responses.
2. The irritation test: load, range, and tempo as diagnostic dials.
3. Stance and bar-path modifications (trap bar, block pulls, paused starts).
4. Volume and intensity rules during a flare-up.
5. Re-entry: how to walk load and range back up without re-triggering.

**Internal links:** `training-around-injuries-without-losing-progress`, `breathing-bracing-lifting-technique`, `warm-up-protocol-for-strength-training`.
**Product link:** `/train-around-injury`.

---

### Article 4 — WHOOP for Lifters

| Field | Value |
|---|---|
| slug | `whoop-recovery-score-for-lifters` |
| title | WHOOP Recovery for Lifters: What It Gets Right and Wrong |
| description | WHOOP recovery scores are tuned for endurance load, not lifting. Learn what the score reads accurately, where it misleads, and how lifters should use it. |
| primaryTopic | `wearables-health-data` |
| tags | `["wearables", "whoop", "recovery", "hrv", "readiness"]` |
| New tags | `whoop` |
| readMinutes | 11 |
| bestFor | Lifters using WHOOP as a primary readiness device who want a strength-training-aware reading of the score. |
| publishedAt | 2026-05-25 |

**H2 outline:**

1. How WHOOP computes recovery (HRV, RHR, sleep, respiratory rate) and what it weights.
2. Where the score works for lifters: chronic load and sleep trends.
3. Where it misleads: heavy CNS days, post-meet fatigue, luteal-phase noise.
4. Building a lifter's playbook for green/yellow/red days.
5. Reading WHOOP alongside RPE and bar speed instead of in place of them.

**Internal links:** `garmin-recovery-data-for-lifters`, `apple-health-data-for-strength-training`, `when-hrv-is-low-strength-training`.
**Product link:** `/apple-health-strength-training-app`.

---

### Article 5 — Overtraining Symptoms

| Field | Value |
|---|---|
| slug | `overtraining-symptoms-strength-training` |
| title | Signs of Overtraining in Strength Training: When to Back Off |
| description | Real overtraining in strength training has specific markers: stalled lifts, elevated resting HR, sleep disruption, and mood drop. Here's how to spot it. |
| primaryTopic | `recovery-readiness` |
| tags | `["recovery", "readiness", "overtraining", "deload", "hrv"]` |
| New tags | `overtraining` |
| readMinutes | 12 |
| bestFor | Intermediate lifters who suspect they've pushed past sustainable load and need a clear framework to confirm and respond. |
| publishedAt | 2026-06-01 |

**H2 outline:**

1. Overreaching vs. overtraining: why the distinction matters for the response.
2. The five markers worth tracking together (performance, RHR, HRV, sleep, mood).
3. What single-signal noise looks like and why it's not overtraining.
4. The deload-vs-rest decision: when each is the right tool.
5. Rebuilding load after a real overtraining episode.

**Internal links:** `when-hrv-is-low-strength-training`, `deload-week-programming-strength-training`, `sleep-quality-strength-training-gains`.
**Product link:** `/recovery-aware-strength-training`.

## Taxonomy Changes

No new `BlogTopicSlug` values. The following new tags will be introduced (added organically as articles ship; no central tag registry exists today, so no other code change is required):

- `perimenopause`
- `postpartum`
- `pelvic-floor`
- `deadlift`
- `whoop`
- `overtraining`

`BLOG_TOPICS[*].matchTags` in `src/app/blog/taxonomy.ts` already covers the primary topic mapping for each new article via existing tags (`female-athletes`/`cycle` for Women Who Lift; `injuries`/`pain` for Training Around Pain; `wearables`/`hrv` for Wearables; `recovery`/`readiness` for Recovery). The new long-tail tags are additive and do not need to appear in `matchTags` unless future filtering wants to surface them as topic anchors.

## Publishing Cadence

| Week | Date | Article |
|---|---|---|
| 1 | 2026-05-04 | Perimenopause |
| 2 | 2026-05-11 | Postpartum |
| 3 | 2026-05-18 | Lower Back Pain Deadlift |
| 4 | 2026-05-25 | WHOOP for Lifters |
| 5 | 2026-06-01 | Overtraining Symptoms |

Order prioritizes the highest-momentum Women Who Lift posts first, then fills weak clusters.

## Implementation Surface

For each article, the implementation work is:

1. Create one JSON file at `src/app/blog/content/<slug>.json` with all required `BlogPost` fields populated (including the full prose `body`).
2. The article is automatically picked up by `posts.ts` (filesystem scan) — no list registration needed.
3. The route `src/app/blog/[slug]/page.tsx` and topic page `src/app/blog/topic/[topic]/page.tsx` will render it without modification.
4. Set `updatedAt` equal to `publishedAt` at first publish.

No code changes are required to ship the 5 articles beyond the new content JSON files.

## Quality Gates

Before each article is merged:

- Title ≤60 chars, description 140–160 chars.
- Slug matches `^[a-z0-9-]+$` and is unique against existing slugs.
- `primaryTopic` is a valid `BlogTopicSlug`.
- All 4–5 H2s present; "The Takeaway" closer present; no bulleted lists in body.
- Internal links target existing slugs (verified against `src/app/blog/content/`).
- Product link matches the topic's `productHref`.
- `readMinutes` calibrated to actual word count (~225 wpm target).

## Risks & Mitigations

- **Risk:** New tags fragment the topic clusters and weaken internal-link signal.
  **Mitigation:** Long-tail tags are additive; primary topic mapping is preserved via existing `matchTags`.
- **Risk:** Postpartum/perimenopause content drifts into medical advice territory.
  **Mitigation:** Outlines stay framed as programming and signal-reading guidance; explicit non-medical framing in lede.
- **Risk:** WHOOP article reads as a competitor takedown.
  **Mitigation:** "What it gets right and wrong" framing; balanced sections.

## Out of Scope

- Drafting prose bodies (next phase).
- Author bylines beyond `Sundee Fundee Team`.
- Adding `updatedAt` revision schedule.
- Backlink outreach or distribution plan.
- Image asset generation.
