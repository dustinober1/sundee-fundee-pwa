# Five Long-Tail SEO Blog Articles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 5 long-tail SEO blog articles per the approved spec at `docs/superpowers/specs/2026-04-27-five-long-tail-seo-articles-design.md`.

**Architecture:** Each article is a single JSON file under `src/app/blog/content/<slug>.json` matching the `BlogPost` shape in `src/app/blog/posts.ts`. The blog index, route page, topic page, and sitemap are filesystem-driven — no list registration anywhere. Adding a JSON file is sufficient to publish.

**Tech Stack:** Next.js 16 (App Router), TypeScript, JSON content store, Markdown body rendered through `react-markdown` + `remark-gfm` via `@/components/Markdown`.

---

## File Structure

### Files to create (one per article)

| Article | Path |
|---|---|
| 1. Perimenopause | `src/app/blog/content/perimenopause-strength-training-programming.json` |
| 2. Postpartum | `src/app/blog/content/postpartum-return-to-lifting-timeline.json` |
| 3. Lower Back Pain Deadlift | `src/app/blog/content/deadlifting-with-lower-back-pain-modifications.json` |
| 4. WHOOP for Lifters | `src/app/blog/content/whoop-recovery-score-for-lifters.json` |
| 5. Overtraining Symptoms | `src/app/blog/content/overtraining-symptoms-strength-training.json` |

### Files to modify

None. The blog is filesystem-driven:

- `src/app/blog/posts.ts:21-25` reads `src/app/blog/content/*.json` and parses every file into `posts`.
- `src/app/blog/[slug]/page.tsx:16-18` calls `generateStaticParams()` from `posts`, so the static route picks up new files automatically.
- `src/app/blog/topic/[topic]/page.tsx` filters posts by `primaryTopic` — no registration needed.
- `src/app/sitemap.ts:2,15` iterates `posts` directly — sitemap also auto-picks up new files.
- `src/app/blog/taxonomy.ts` — no edits required. New tags (`perimenopause`, `postpartum`, `pelvic-floor`, `deadlift`, `whoop`, `overtraining`) are additive; primary-topic mapping is via `primaryTopic` field, not tag matching, so `BLOG_TOPICS[*].matchTags` does not need updating.

### `BlogPost` shape (from `src/app/blog/posts.ts:5-17`)

```ts
type BlogPost = {
  slug: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;       // YYYY-MM-DD
  updatedAt?: string;        // YYYY-MM-DD (set equal to publishedAt at first publish)
  readMinutes: number;
  tags: string[];
  primaryTopic?: BlogTopicSlug;
  bestFor?: string;
  body: string;              // Markdown string; \n\n separates paragraphs; ## starts H2 sections
};
```

### Body conventions (from existing posts)

- Single string in JSON, paragraphs separated by `\n\n`.
- H2 headings use `## Title Case Heading`.
- No bullet lists in body — flowing prose only.
- No external link block at the end.
- "## The Takeaway" is the closing H2 across all existing posts.
- ~225 words/minute is the calibration for `readMinutes`.

---

## Task 0: Environment Sanity Check

**Files:** none (read-only).

- [ ] **Step 1: Confirm working directory and clean tree**

Run:
```bash
cd /Users/dustinober/Projects/sundee-fundee-web
git status
```
Expected: `On branch main` (or feature branch); working tree clean.

- [ ] **Step 2: Confirm dependencies installed**

Run:
```bash
ls node_modules/next/package.json
```
Expected: file exists. If not, run `npm install`.

- [ ] **Step 3: Baseline typecheck + build pass before changes**

Run:
```bash
npm run typecheck
```
Expected: exits 0 (no type errors).

Run:
```bash
npm run build
```
Expected: build completes successfully; the existing 16 blog posts appear under `Generating static pages` output.

If either fails on a clean tree, stop and report — issues are pre-existing and out of scope for this plan.

---

## Task 1: Article 1 — Perimenopause Strength Training

**Files:**
- Create: `src/app/blog/content/perimenopause-strength-training-programming.json`

**Spec reference:** `docs/superpowers/specs/2026-04-27-five-long-tail-seo-articles-design.md` § Article 1.

- [ ] **Step 1: Verify slug uniqueness**

Run:
```bash
ls src/app/blog/content/perimenopause-strength-training-programming.json 2>&1
```
Expected: `No such file or directory`. If the file exists, stop and reconcile with spec.

- [ ] **Step 2: Verify all internal-link slugs exist before writing the body**

Run:
```bash
ls src/app/blog/content/cycle-phase-strength-programming.json \
   src/app/blog/content/menstrual-cycle-recovery-metrics-wearables.json \
   src/app/blog/content/when-hrv-is-low-strength-training.json
```
Expected: all three files listed without errors. If any are missing, stop — the spec assumed them.

- [ ] **Step 3: Draft the body**

Write a Markdown body that:

- Opens with a 250–350 word lede that puts the reader in the scenario of a lifter in her 40s noticing recovery, sleep, and strength shifts that don't map to her usual cycle pattern, names the misconception ("standard cycle-phase programming will keep working"), and states the thesis (perimenopause requires a flexible programming framework, not a rigid template).
- Contains exactly five H2 sections with the headings:
  1. `## What Perimenopause Actually Changes for the Lifter`
  2. `## Why Standard Cycle-Phase Programming Stops Mapping Cleanly`
  3. `## Recovery Capacity in Perimenopause: Sleep Fragmentation and HRV Trends`
  4. `## A Flexible Programming Framework for Perimenopause`
  5. `## When to Test, When to Hold, When to Back Off`
- Closes with `## The Takeaway` (~200 words).
- Each H2 section is 400–600 words of flowing prose with no bulleted lists.
- Includes inline Markdown links to:
  - `/blog/cycle-phase-strength-programming`
  - `/blog/menstrual-cycle-recovery-metrics-wearables`
  - `/blog/when-hrv-is-low-strength-training`
  - `/for-women-who-lift` (product link)
- Total body length targets ~2700 words (12-minute read at 225 wpm).
- Voice matches existing posts: authoritative, second-person ("you" / "the lifter"), concrete numbers where possible, acknowledges individual variation, anti-pattern → mechanism → application arc per H2.
- Stays framed as programming and signal-reading guidance — not medical advice.

- [ ] **Step 4: Assemble the JSON file**

Create `src/app/blog/content/perimenopause-strength-training-programming.json`:

```json
{
  "slug": "perimenopause-strength-training-programming",
  "title": "Perimenopause Strength Training: A Programming Guide",
  "description": "Perimenopause shifts recovery, sleep, and strength expression. Learn how to program lifting through the hormonal transition without losing progress.",
  "author": "Sundee Fundee Team",
  "publishedAt": "2026-05-04",
  "updatedAt": "2026-05-04",
  "readMinutes": 12,
  "tags": [
    "female-athletes",
    "cycle",
    "perimenopause",
    "programming",
    "recovery"
  ],
  "primaryTopic": "women-who-lift",
  "bestFor": "Lifters in their late 30s through early 50s navigating cycle changes, sleep disruption, and shifting recovery capacity.",
  "body": "<<DRAFTED BODY FROM STEP 3, JSON-ESCAPED>>"
}
```

JSON-escape the body: replace every literal newline with `\n`, every `"` with `\"`, every `\` with `\\`. Use `node -e 'console.log(JSON.stringify(require("fs").readFileSync("/tmp/body.md","utf8")))'` if drafting in a scratch file.

- [ ] **Step 5: Validate metadata constraints**

Run:
```bash
node -e '
const p = JSON.parse(require("fs").readFileSync("src/app/blog/content/perimenopause-strength-training-programming.json","utf8"));
const errs = [];
if (p.slug !== "perimenopause-strength-training-programming") errs.push("slug mismatch");
if (!/^[a-z0-9-]+$/.test(p.slug)) errs.push("slug invalid chars");
if (p.title.length > 60) errs.push(`title too long: ${p.title.length}`);
if (p.description.length < 140 || p.description.length > 160) errs.push(`description length ${p.description.length} (need 140-160)`);
if (p.publishedAt !== "2026-05-04") errs.push("publishedAt mismatch");
if (p.primaryTopic !== "women-who-lift") errs.push("primaryTopic mismatch");
const h2 = (p.body.match(/\n## /g) || []).length;
if (h2 < 5 || h2 > 6) errs.push(`H2 count ${h2} (need 5 body H2s + 1 takeaway = 6 total leading "\\n## ")`);
if (!p.body.includes("## The Takeaway")) errs.push("missing The Takeaway closer");
if (/\n[-*] /.test(p.body)) errs.push("contains bulleted list lines");
const wc = p.body.split(/\s+/).filter(Boolean).length;
if (wc < 2400 || wc > 3200) errs.push(`word count ${wc} (target 2400-3200 for 12 min)`);
console.log(errs.length ? "FAIL: " + errs.join("; ") : "OK");
'
```
Expected: `OK`. If any error, fix the body or metadata and re-run until `OK`.

- [ ] **Step 6: Run typecheck + build**

Run:
```bash
npm run typecheck && npm run build
```
Expected: both succeed; build output includes `/blog/perimenopause-strength-training-programming` in the `Generating static pages` list.

- [ ] **Step 7: Commit**

```bash
git add src/app/blog/content/perimenopause-strength-training-programming.json
git commit -m "blog: Perimenopause Strength Training: A Programming Guide"
```

---

## Task 2: Article 2 — Postpartum Return to Lifting

**Files:**
- Create: `src/app/blog/content/postpartum-return-to-lifting-timeline.json`

**Spec reference:** `docs/superpowers/specs/2026-04-27-five-long-tail-seo-articles-design.md` § Article 2.

- [ ] **Step 1: Verify slug uniqueness**

Run:
```bash
ls src/app/blog/content/postpartum-return-to-lifting-timeline.json 2>&1
```
Expected: `No such file or directory`.

- [ ] **Step 2: Verify internal-link slugs exist**

Run:
```bash
ls src/app/blog/content/cycle-phase-strength-programming.json \
   src/app/blog/content/breathing-bracing-lifting-technique.json \
   src/app/blog/content/training-around-injuries-without-losing-progress.json
```
Expected: all three present.

- [ ] **Step 3: Draft the body**

Write a Markdown body that:

- Opens with a 250–350 word lede that puts the reader in the scenario of returning postpartum and feeling stuck between "do nothing for six weeks" and "back to your old program at twelve weeks," names the misconception (timeline-based return), and states the thesis (signal-driven phased return is more reliable than calendar-based return).
- Contains exactly five H2 sections with the headings:
  1. `## Why Postpartum Return Is a Recovery Problem, Not a Strength Problem`
  2. `## Phase 1 (Weeks 0–6): Breath, Alignment, Pelvic Floor Reconnection`
  3. `## Phase 2 (Weeks 6–12): Reloaded Fundamentals and Core Staging`
  4. `## Phase 3 (Months 3–6): Progressive Overload With Sleep and Bleeding Signals`
  5. `## Phase 4 (Months 6–12): Testing, Cycle Return, and the New Baseline`
- Closes with `## The Takeaway` (~200 words).
- Each H2 section is 400–600 words of flowing prose with no bulleted lists.
- Includes inline Markdown links to:
  - `/blog/cycle-phase-strength-programming`
  - `/blog/breathing-bracing-lifting-technique`
  - `/blog/training-around-injuries-without-losing-progress`
  - `/for-women-who-lift` (product link)
- Total body length targets ~2900 words (13-minute read at 225 wpm).
- Frames diastasis recti, pelvic floor, and bleeding signals as gating signals to read, not medical conditions to diagnose. Defers to clinician guidance for postpartum medical clearance and frames the article as "what to do once cleared."

- [ ] **Step 4: Assemble the JSON file**

Create `src/app/blog/content/postpartum-return-to-lifting-timeline.json`:

```json
{
  "slug": "postpartum-return-to-lifting-timeline",
  "title": "Returning to Lifting Postpartum: A Phased Timeline",
  "description": "A phased postpartum return-to-lifting timeline covering core, pelvic floor, load progression, and the readiness signals that gate each stage.",
  "author": "Sundee Fundee Team",
  "publishedAt": "2026-05-11",
  "updatedAt": "2026-05-11",
  "readMinutes": 13,
  "tags": [
    "female-athletes",
    "postpartum",
    "programming",
    "recovery",
    "pelvic-floor"
  ],
  "primaryTopic": "women-who-lift",
  "bestFor": "Lifters in the first 12 months postpartum who want a structured, signal-driven return rather than a calendar-based one.",
  "body": "<<DRAFTED BODY FROM STEP 3, JSON-ESCAPED>>"
}
```

- [ ] **Step 5: Validate metadata constraints**

Run:
```bash
node -e '
const p = JSON.parse(require("fs").readFileSync("src/app/blog/content/postpartum-return-to-lifting-timeline.json","utf8"));
const errs = [];
if (p.slug !== "postpartum-return-to-lifting-timeline") errs.push("slug mismatch");
if (!/^[a-z0-9-]+$/.test(p.slug)) errs.push("slug invalid chars");
if (p.title.length > 60) errs.push(`title too long: ${p.title.length}`);
if (p.description.length < 140 || p.description.length > 160) errs.push(`description length ${p.description.length} (need 140-160)`);
if (p.publishedAt !== "2026-05-11") errs.push("publishedAt mismatch");
if (p.primaryTopic !== "women-who-lift") errs.push("primaryTopic mismatch");
const h2 = (p.body.match(/\n## /g) || []).length;
if (h2 < 5 || h2 > 6) errs.push(`H2 count ${h2}`);
if (!p.body.includes("## The Takeaway")) errs.push("missing The Takeaway closer");
if (/\n[-*] /.test(p.body)) errs.push("contains bulleted list lines");
const wc = p.body.split(/\s+/).filter(Boolean).length;
if (wc < 2600 || wc > 3400) errs.push(`word count ${wc} (target 2600-3400 for 13 min)`);
console.log(errs.length ? "FAIL: " + errs.join("; ") : "OK");
'
```
Expected: `OK`.

- [ ] **Step 6: Run typecheck + build**

Run:
```bash
npm run typecheck && npm run build
```
Expected: both succeed; build output includes `/blog/postpartum-return-to-lifting-timeline`.

- [ ] **Step 7: Commit**

```bash
git add src/app/blog/content/postpartum-return-to-lifting-timeline.json
git commit -m "blog: Returning to Lifting Postpartum: A Phased Timeline"
```

---

## Task 3: Article 3 — Deadlifting With Lower Back Pain

**Files:**
- Create: `src/app/blog/content/deadlifting-with-lower-back-pain-modifications.json`

**Spec reference:** `docs/superpowers/specs/2026-04-27-five-long-tail-seo-articles-design.md` § Article 3.

- [ ] **Step 1: Verify slug uniqueness**

Run:
```bash
ls src/app/blog/content/deadlifting-with-lower-back-pain-modifications.json 2>&1
```
Expected: `No such file or directory`.

- [ ] **Step 2: Verify internal-link slugs exist**

Run:
```bash
ls src/app/blog/content/training-around-injuries-without-losing-progress.json \
   src/app/blog/content/breathing-bracing-lifting-technique.json \
   src/app/blog/content/warm-up-protocol-for-strength-training.json
```
Expected: all three present.

- [ ] **Step 3: Draft the body**

Write a Markdown body that:

- Opens with a 250–350 word lede that puts the reader in the scenario of a lifter feeling lower back tightness after a deadlift session and weighing "stop deadlifting" against "push through it," names the misconception (binary stop/continue thinking), and states the thesis (modifying load, range, stance, and tempo lets most lifters keep training while irritation resolves).
- Contains exactly five H2 sections with the headings:
  1. `## Three Flavors of Lower Back Pain in Lifters`
  2. `## The Irritation Test: Load, Range, and Tempo as Diagnostic Dials`
  3. `## Stance and Bar-Path Modifications That Reduce Spinal Load`
  4. `## Volume and Intensity Rules During a Flare-Up`
  5. `## Re-Entry: Walking Load and Range Back Up Without Re-Triggering`
- Closes with `## The Takeaway` (~200 words).
- Each H2 section is 400–600 words of flowing prose with no bulleted lists.
- Includes inline Markdown links to:
  - `/blog/training-around-injuries-without-losing-progress`
  - `/blog/breathing-bracing-lifting-technique`
  - `/blog/warm-up-protocol-for-strength-training`
  - `/train-around-injury` (product link)
- Total body length targets ~2500 words (11-minute read at 225 wpm).
- Explicitly distinguishes "irritation a programming change can manage" from "symptoms that require clinical evaluation" (radiating leg pain, numbness, loss of bladder/bowel control, severe trauma) — refer to a clinician for the latter, in the lede.

- [ ] **Step 4: Assemble the JSON file**

Create `src/app/blog/content/deadlifting-with-lower-back-pain-modifications.json`:

```json
{
  "slug": "deadlifting-with-lower-back-pain-modifications",
  "title": "Deadlifting With Lower Back Pain: Modifications That Work",
  "description": "Lower back pain doesn't have to mean stopping deadlifts. Use these stance, range, and load modifications to keep training while the back recovers.",
  "author": "Sundee Fundee Team",
  "publishedAt": "2026-05-18",
  "updatedAt": "2026-05-18",
  "readMinutes": 11,
  "tags": [
    "injuries",
    "pain",
    "deadlift",
    "adaptation",
    "programming"
  ],
  "primaryTopic": "training-around-pain",
  "bestFor": "Lifters with non-specific lower back irritation who want to keep deadlifting through it without making it worse.",
  "body": "<<DRAFTED BODY FROM STEP 3, JSON-ESCAPED>>"
}
```

- [ ] **Step 5: Validate metadata constraints**

Run:
```bash
node -e '
const p = JSON.parse(require("fs").readFileSync("src/app/blog/content/deadlifting-with-lower-back-pain-modifications.json","utf8"));
const errs = [];
if (p.slug !== "deadlifting-with-lower-back-pain-modifications") errs.push("slug mismatch");
if (!/^[a-z0-9-]+$/.test(p.slug)) errs.push("slug invalid chars");
if (p.title.length > 60) errs.push(`title too long: ${p.title.length}`);
if (p.description.length < 140 || p.description.length > 160) errs.push(`description length ${p.description.length} (need 140-160)`);
if (p.publishedAt !== "2026-05-18") errs.push("publishedAt mismatch");
if (p.primaryTopic !== "training-around-pain") errs.push("primaryTopic mismatch");
const h2 = (p.body.match(/\n## /g) || []).length;
if (h2 < 5 || h2 > 6) errs.push(`H2 count ${h2}`);
if (!p.body.includes("## The Takeaway")) errs.push("missing The Takeaway closer");
if (/\n[-*] /.test(p.body)) errs.push("contains bulleted list lines");
const wc = p.body.split(/\s+/).filter(Boolean).length;
if (wc < 2200 || wc > 2900) errs.push(`word count ${wc} (target 2200-2900 for 11 min)`);
console.log(errs.length ? "FAIL: " + errs.join("; ") : "OK");
'
```
Expected: `OK`.

- [ ] **Step 6: Run typecheck + build**

Run:
```bash
npm run typecheck && npm run build
```
Expected: both succeed; build output includes `/blog/deadlifting-with-lower-back-pain-modifications`.

- [ ] **Step 7: Commit**

```bash
git add src/app/blog/content/deadlifting-with-lower-back-pain-modifications.json
git commit -m "blog: Deadlifting With Lower Back Pain: Modifications That Work"
```

---

## Task 4: Article 4 — WHOOP Recovery for Lifters

**Files:**
- Create: `src/app/blog/content/whoop-recovery-score-for-lifters.json`

**Spec reference:** `docs/superpowers/specs/2026-04-27-five-long-tail-seo-articles-design.md` § Article 4.

- [ ] **Step 1: Verify slug uniqueness**

Run:
```bash
ls src/app/blog/content/whoop-recovery-score-for-lifters.json 2>&1
```
Expected: `No such file or directory`.

- [ ] **Step 2: Verify internal-link slugs exist**

Run:
```bash
ls src/app/blog/content/garmin-recovery-data-for-lifters.json \
   src/app/blog/content/apple-health-data-for-strength-training.json \
   src/app/blog/content/when-hrv-is-low-strength-training.json
```
Expected: all three present.

- [ ] **Step 3: Draft the body**

Write a Markdown body that:

- Opens with a 250–350 word lede that puts the reader in the scenario of a lifter seeing a 28% recovery score after a heavy session and questioning whether to deload, names the misconception (WHOOP's recovery score reads strength training the same way it reads endurance load), and states the thesis (the score is useful for chronic load and sleep but misleads on heavy CNS days; lifters need a strength-aware reading).
- Contains exactly five H2 sections with the headings:
  1. `## How WHOOP Computes Recovery and What It Weights`
  2. `## Where the Score Works for Lifters: Chronic Load and Sleep Trends`
  3. `## Where It Misleads: Heavy CNS Days, Post-Meet Fatigue, Luteal-Phase Noise`
  4. `## A Lifter's Playbook for Green, Yellow, and Red Days`
  5. `## Reading WHOOP Alongside RPE and Bar Speed, Not in Place of Them`
- Closes with `## The Takeaway` (~200 words).
- Each H2 section is 400–600 words of flowing prose with no bulleted lists.
- Includes inline Markdown links to:
  - `/blog/garmin-recovery-data-for-lifters`
  - `/blog/apple-health-data-for-strength-training`
  - `/blog/when-hrv-is-low-strength-training`
  - `/apple-health-strength-training-app` (product link)
- Total body length targets ~2500 words (11-minute read at 225 wpm).
- "What it gets right and wrong" framing — balanced, not a takedown. Acknowledges WHOOP's genuine strengths before discussing limits.

- [ ] **Step 4: Assemble the JSON file**

Create `src/app/blog/content/whoop-recovery-score-for-lifters.json`:

```json
{
  "slug": "whoop-recovery-score-for-lifters",
  "title": "WHOOP Recovery for Lifters: What It Gets Right and Wrong",
  "description": "WHOOP recovery scores are tuned for endurance load, not lifting. Learn what the score reads accurately, where it misleads, and how lifters should use it.",
  "author": "Sundee Fundee Team",
  "publishedAt": "2026-05-25",
  "updatedAt": "2026-05-25",
  "readMinutes": 11,
  "tags": [
    "wearables",
    "whoop",
    "recovery",
    "hrv",
    "readiness"
  ],
  "primaryTopic": "wearables-health-data",
  "bestFor": "Lifters using WHOOP as a primary readiness device who want a strength-training-aware reading of the score.",
  "body": "<<DRAFTED BODY FROM STEP 3, JSON-ESCAPED>>"
}
```

- [ ] **Step 5: Validate metadata constraints**

Run:
```bash
node -e '
const p = JSON.parse(require("fs").readFileSync("src/app/blog/content/whoop-recovery-score-for-lifters.json","utf8"));
const errs = [];
if (p.slug !== "whoop-recovery-score-for-lifters") errs.push("slug mismatch");
if (!/^[a-z0-9-]+$/.test(p.slug)) errs.push("slug invalid chars");
if (p.title.length > 60) errs.push(`title too long: ${p.title.length}`);
if (p.description.length < 140 || p.description.length > 160) errs.push(`description length ${p.description.length} (need 140-160)`);
if (p.publishedAt !== "2026-05-25") errs.push("publishedAt mismatch");
if (p.primaryTopic !== "wearables-health-data") errs.push("primaryTopic mismatch");
const h2 = (p.body.match(/\n## /g) || []).length;
if (h2 < 5 || h2 > 6) errs.push(`H2 count ${h2}`);
if (!p.body.includes("## The Takeaway")) errs.push("missing The Takeaway closer");
if (/\n[-*] /.test(p.body)) errs.push("contains bulleted list lines");
const wc = p.body.split(/\s+/).filter(Boolean).length;
if (wc < 2200 || wc > 2900) errs.push(`word count ${wc} (target 2200-2900 for 11 min)`);
console.log(errs.length ? "FAIL: " + errs.join("; ") : "OK");
'
```
Expected: `OK`.

- [ ] **Step 6: Run typecheck + build**

Run:
```bash
npm run typecheck && npm run build
```
Expected: both succeed; build output includes `/blog/whoop-recovery-score-for-lifters`.

- [ ] **Step 7: Commit**

```bash
git add src/app/blog/content/whoop-recovery-score-for-lifters.json
git commit -m "blog: WHOOP Recovery for Lifters: What It Gets Right and Wrong"
```

---

## Task 5: Article 5 — Signs of Overtraining in Strength Training

**Files:**
- Create: `src/app/blog/content/overtraining-symptoms-strength-training.json`

**Spec reference:** `docs/superpowers/specs/2026-04-27-five-long-tail-seo-articles-design.md` § Article 5.

- [ ] **Step 1: Verify slug uniqueness**

Run:
```bash
ls src/app/blog/content/overtraining-symptoms-strength-training.json 2>&1
```
Expected: `No such file or directory`.

- [ ] **Step 2: Verify internal-link slugs exist**

Run:
```bash
ls src/app/blog/content/when-hrv-is-low-strength-training.json \
   src/app/blog/content/deload-week-programming-strength-training.json \
   src/app/blog/content/sleep-quality-strength-training-gains.json
```
Expected: all three present.

- [ ] **Step 3: Draft the body**

Write a Markdown body that:

- Opens with a 250–350 word lede that puts the reader in the scenario of a lifter who has stalled across multiple sessions and is unsure whether they're overtraining or under-recovered, names the misconception (any single bad session = overtraining), and states the thesis (real overtraining is a syndrome of converging signals, not a single metric).
- Contains exactly five H2 sections with the headings:
  1. `## Overreaching vs. Overtraining: Why the Distinction Matters`
  2. `## The Five Markers Worth Tracking Together`
  3. `## What Single-Signal Noise Looks Like (and Why It's Not Overtraining)`
  4. `## The Deload-vs-Rest Decision: When Each Is the Right Tool`
  5. `## Rebuilding Load After a Real Overtraining Episode`
- Closes with `## The Takeaway` (~200 words).
- Each H2 section is 400–600 words of flowing prose with no bulleted lists.
- Includes inline Markdown links to:
  - `/blog/when-hrv-is-low-strength-training`
  - `/blog/deload-week-programming-strength-training`
  - `/blog/sleep-quality-strength-training-gains`
  - `/recovery-aware-strength-training` (product link)
- Total body length targets ~2700 words (12-minute read at 225 wpm).
- Distinguishes functional overreaching (planned, recoverable in days) from non-functional overreaching (1–4 weeks recovery) from overtraining syndrome (months of recovery, often clinical), and frames the article around the realistic case lifters encounter.

- [ ] **Step 4: Assemble the JSON file**

Create `src/app/blog/content/overtraining-symptoms-strength-training.json`:

```json
{
  "slug": "overtraining-symptoms-strength-training",
  "title": "Signs of Overtraining in Strength Training: When to Back Off",
  "description": "Real overtraining in strength training has specific markers: stalled lifts, elevated resting HR, sleep disruption, and mood drop. Here's how to spot it.",
  "author": "Sundee Fundee Team",
  "publishedAt": "2026-06-01",
  "updatedAt": "2026-06-01",
  "readMinutes": 12,
  "tags": [
    "recovery",
    "readiness",
    "overtraining",
    "deload",
    "hrv"
  ],
  "primaryTopic": "recovery-readiness",
  "bestFor": "Intermediate lifters who suspect they've pushed past sustainable load and need a clear framework to confirm and respond.",
  "body": "<<DRAFTED BODY FROM STEP 3, JSON-ESCAPED>>"
}
```

- [ ] **Step 5: Validate metadata constraints**

Run:
```bash
node -e '
const p = JSON.parse(require("fs").readFileSync("src/app/blog/content/overtraining-symptoms-strength-training.json","utf8"));
const errs = [];
if (p.slug !== "overtraining-symptoms-strength-training") errs.push("slug mismatch");
if (!/^[a-z0-9-]+$/.test(p.slug)) errs.push("slug invalid chars");
if (p.title.length > 60) errs.push(`title too long: ${p.title.length}`);
if (p.description.length < 140 || p.description.length > 160) errs.push(`description length ${p.description.length} (need 140-160)`);
if (p.publishedAt !== "2026-06-01") errs.push("publishedAt mismatch");
if (p.primaryTopic !== "recovery-readiness") errs.push("primaryTopic mismatch");
const h2 = (p.body.match(/\n## /g) || []).length;
if (h2 < 5 || h2 > 6) errs.push(`H2 count ${h2}`);
if (!p.body.includes("## The Takeaway")) errs.push("missing The Takeaway closer");
if (/\n[-*] /.test(p.body)) errs.push("contains bulleted list lines");
const wc = p.body.split(/\s+/).filter(Boolean).length;
if (wc < 2400 || wc > 3200) errs.push(`word count ${wc} (target 2400-3200 for 12 min)`);
console.log(errs.length ? "FAIL: " + errs.join("; ") : "OK");
'
```
Expected: `OK`.

- [ ] **Step 6: Run typecheck + build**

Run:
```bash
npm run typecheck && npm run build
```
Expected: both succeed; build output includes `/blog/overtraining-symptoms-strength-training`.

- [ ] **Step 7: Commit**

```bash
git add src/app/blog/content/overtraining-symptoms-strength-training.json
git commit -m "blog: Signs of Overtraining in Strength Training: When to Back Off"
```

---

## Task 6: Cross-Article Verification

**Files:** none (read-only).

- [ ] **Step 1: Verify all 5 files present and parseable**

Run:
```bash
node -e '
const fs = require("fs");
const slugs = [
  "perimenopause-strength-training-programming",
  "postpartum-return-to-lifting-timeline",
  "deadlifting-with-lower-back-pain-modifications",
  "whoop-recovery-score-for-lifters",
  "overtraining-symptoms-strength-training"
];
for (const s of slugs) {
  const p = JSON.parse(fs.readFileSync(`src/app/blog/content/${s}.json`,"utf8"));
  if (p.slug !== s) throw new Error(`slug mismatch in ${s}`);
}
console.log("All 5 articles parse and slugs match.");
'
```
Expected: `All 5 articles parse and slugs match.`

- [ ] **Step 2: Verify topic page renders new posts**

Run:
```bash
npm run build
```
Expected: build output includes `/blog/topic/women-who-lift`, `/blog/topic/training-around-pain`, `/blog/topic/wearables-health-data`, `/blog/topic/recovery-readiness` regenerated successfully.

- [ ] **Step 3: Verify sitemap includes all 5 new URLs**

Run:
```bash
npm run build && \
node -e '
const fs = require("fs");
const dir = ".next/server/app";
const sitemap = fs.readFileSync(`${dir}/sitemap.xml.body`, "utf8").catch?.(()=>fs.readFileSync(".next/server/app/sitemap.xml/route.js","utf8")) || "";
console.log(sitemap.includes("perimenopause-strength-training-programming") ? "sitemap OK" : "sitemap missing perimenopause");
'
```

If the build artifact path differs, fall back to:
```bash
node -e '
import("./src/app/sitemap.ts").then(m => {
  const items = m.default();
  const slugs = [
    "perimenopause-strength-training-programming",
    "postpartum-return-to-lifting-timeline",
    "deadlifting-with-lower-back-pain-modifications",
    "whoop-recovery-score-for-lifters",
    "overtraining-symptoms-strength-training"
  ];
  const urls = items.map(i => i.url);
  for (const s of slugs) {
    if (!urls.some(u => u.includes(s))) throw new Error(`sitemap missing ${s}`);
  }
  console.log("All 5 in sitemap.");
});
' 2>&1 || echo "Sitemap check requires runtime; rely on build output instead."
```

Expected: confirmation all 5 slugs are present in the sitemap. If runtime import fails (TS in node), accept the `npm run build` success as sufficient evidence — `sitemap.ts` reads `posts` directly from the same filesystem scan.

- [ ] **Step 4: Run SEO regression suite**

Run:
```bash
npm run test:seo
```
Expected: `Validated 19 SEO pages and schema integrations.` This script does not test blog content directly, but a passing run confirms no regression in the SEO infrastructure that the blog posts share.

- [ ] **Step 5: Run lint**

Run:
```bash
npm run lint
```
Expected: exits 0. Blog JSON files do not lint, but this catches any incidental TS/TSX changes.

- [ ] **Step 6: Spot-check related-post wiring**

Run:
```bash
node -e '
const fs = require("fs");
const path = require("path");
const dir = "src/app/blog/content";
const posts = fs.readdirSync(dir).filter(f => f.endsWith(".json")).map(f => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
const newSlugs = [
  "perimenopause-strength-training-programming",
  "postpartum-return-to-lifting-timeline",
  "deadlifting-with-lower-back-pain-modifications",
  "whoop-recovery-score-for-lifters",
  "overtraining-symptoms-strength-training"
];
for (const slug of newSlugs) {
  const p = posts.find(x => x.slug === slug);
  const linked = (p.body.match(/\/blog\/([a-z0-9-]+)/g) || []).map(s => s.replace("/blog/",""));
  for (const l of linked) {
    if (!posts.some(x => x.slug === l)) throw new Error(`${slug} links to non-existent /blog/${l}`);
  }
  if (linked.length < 2) throw new Error(`${slug} has fewer than 2 internal blog links`);
}
console.log("All internal blog links resolve and each new post has >=2 internal links.");
'
```
Expected: `All internal blog links resolve and each new post has >=2 internal links.`

- [ ] **Step 7: Final summary commit (if any meta files were touched)**

Run:
```bash
git status
```
Expected: clean working tree (everything committed inside Tasks 1–5). If anything is unstaged from the verification phase, decide whether it belongs in the plan or should be reverted.

---

## Self-Review

**Spec coverage:**
- All 5 articles in spec → Tasks 1–5. ✓
- Spec template (slug pattern, title ≤60, desc 140–160, etc.) → enforced in Step 5 of each task. ✓
- Outline structure (lede, 5 H2s, takeaway, no bullets) → encoded in Step 3 + validated in Step 5. ✓
- Internal links + product link → enumerated in Step 3 of each task; verified in Task 6 Step 6. ✓
- Publishing cadence (2026-05-04 / 11 / 18 / 25, 06-01) → encoded in JSON `publishedAt` + checked in Step 5. ✓
- New tags (`perimenopause`, `postpartum`, `pelvic-floor`, `deadlift`, `whoop`, `overtraining`) → present in `tags` arrays per task. ✓
- "Quality gates" from spec (title, desc, slug, H2 count, takeaway, no bullets, internal links) → all enforced in Step 5 + Task 6 Step 6. ✓
- "Risks" from spec (medical-advice framing, WHOOP not a takedown) → addressed in Step 3 framing notes. ✓

**Placeholder scan:** `<<DRAFTED BODY FROM STEP 3, JSON-ESCAPED>>` is the only intentional placeholder, and it's clearly delimited as "the body the engineer writes in Step 3." Every other piece of metadata, every command, and every validation script is concrete. ✓

**Type consistency:** `slug`, `primaryTopic`, `tags`, `publishedAt`, `bestFor` — all field names match `BlogPost` in `src/app/blog/posts.ts:5-17`. `BlogTopicSlug` values used (`women-who-lift`, `training-around-pain`, `wearables-health-data`, `recovery-readiness`) all exist in `src/app/blog/taxonomy.ts:6-10`. ✓

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-27-five-long-tail-seo-articles.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per article task, review between tasks, fast iteration. Good fit here because each article is independent, draft-heavy, and benefits from a clean context per article.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
