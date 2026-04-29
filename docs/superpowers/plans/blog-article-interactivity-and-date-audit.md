# Blog Article Interactivity And Date Audit

Date: 2026-04-28

This audit maps every live blog article to a realistic publication timeline and a lightweight interactive presentation pattern. The live date policy is:

- `publishedAt` must not be in the future.
- `updatedAt` must be on or after `publishedAt`.
- Future-dated articles were compressed into a realistic live sequence while preserving editorial order.

| Slug | Topic | Current `publishedAt` | Current `updatedAt` | Proposed `publishedAt` | Proposed `updatedAt` | Interactive pattern | Rationale |
|---|---|---:|---:|---:|---:|---|---|
| `why-recovery-beats-the-calendar` | Recovery & Readiness | 2026-04-02 | 2026-04-25 | 2026-04-02 | 2026-04-25 | Decision guide | Foundational article; readers need a push/hold/modify framing before the body. |
| `apple-health-data-for-strength-training` | Wearables & Health Data | 2026-04-12 | 2026-04-25 | 2026-04-12 | 2026-04-25 | Compare options | The article helps readers compare what Apple Health signals are worth acting on. |
| `garmin-recovery-data-for-lifters` | Wearables & Health Data | 2026-04-14 | 2026-04-25 | 2026-04-14 | 2026-04-25 | Metric explainer | Best used as a quick translator from Garmin metrics to training action. |
| `training-around-injuries-without-losing-progress` | Training Around Pain | 2026-04-15 | 2026-04-25 | 2026-04-15 | 2026-04-25 | Modification checklist | Readers need adaptation options more than long-form browsing alone. |
| `when-hrv-is-low-strength-training` | Recovery & Readiness | 2026-04-16 | 2026-04-25 | 2026-04-16 | 2026-04-25 | Symptom audit | HRV posts work best when readers can classify how strong the warning signal is. |
| `one-rep-max-testing-timing-and-protocol` | Programming Basics | 2026-04-18 | 2026-04-25 | 2026-04-18 | 2026-04-25 | Timeline | The article is inherently staged around testing readiness and progression. |
| `warm-up-protocol-for-strength-training` | Training Around Pain | 2026-04-18 | 2026-04-25 | 2026-04-18 | 2026-04-25 | Protocol | Readers want order-of-operations guidance before they read every section. |
| `cycle-phase-strength-programming` | Women Who Lift | 2026-04-19 | 2026-04-25 | 2026-04-19 | 2026-04-25 | Protocol | This article is best framed as a sequence of programming choices. |
| `menstrual-cycle-nutrition-strength-training` | Women Who Lift | 2026-04-20 | 2026-04-25 | 2026-04-20 | 2026-04-25 | Protocol | Nutrition guidance lands better as a practical sequence than as passive reading. |
| `deload-week-programming-strength-training` | Programming Basics | 2026-04-21 | 2026-04-25 | 2026-04-21 | 2026-04-25 | Decision guide | The main reader need is deciding whether a deload is actually warranted. |
| `breathing-bracing-lifting-technique` | Programming Basics | 2026-04-22 | 2026-04-25 | 2026-04-22 | 2026-04-25 | Protocol | Technical setup content benefits from an ordered interaction pattern. |
| `menstrual-cycle-injury-risk-lifting` | Women Who Lift | 2026-04-23 | 2026-04-25 | 2026-04-23 | 2026-04-25 | Compare options | Readers are comparing context and tradeoffs more than seeking a single rule. |
| `sleep-quality-strength-training-gains` | Recovery & Readiness | 2026-04-24 | 2026-04-25 | 2026-04-24 | 2026-04-25 | Compare options | Sleep articles work best when readers can separate one bad night from a pattern. |
| `rpe-training-autoregulation-strength` | Programming Basics | 2026-04-25 | 2026-04-25 | 2026-04-25 | 2026-04-25 | Decision guide | The core job is deciding how to load the day. |
| `perimenopause-strength-training-programming` | Women Who Lift | 2026-05-04 | 2026-05-04 | 2026-04-26 | 2026-04-28 | Timeline | The staged future date was unrealistic; the article itself fits a phased decision model. |
| `cycle-phase-peak-strength-testing` | Women Who Lift | 2026-04-26 | 2026-04-27 | 2026-04-26 | 2026-04-27 | Timeline | Peak-testing articles are naturally phase-based. |
| `postpartum-return-to-lifting-timeline` | Women Who Lift | 2026-05-11 | 2026-05-11 | 2026-04-27 | 2026-04-28 | Timeline | The future date was compressed into the live window while keeping sequence after perimenopause. |
| `apple-health-strength-training-recovery` | Wearables & Health Data | 2026-04-27 | 2026-04-28 | 2026-04-27 | 2026-04-28 | Decision guide | Readers need a direct action path from signal to session. |
| `apple-watch-hrv-strength-training` | Wearables & Health Data | 2026-04-27 | 2026-04-28 | 2026-04-27 | 2026-04-28 | Symptom audit | HRV is best handled as a warning-signal audit, not a single-number verdict. |
| `deload-week-sleep-soreness-training-history` | Programming Basics | 2026-04-27 | 2026-04-28 | 2026-04-27 | 2026-04-28 | Decision guide | This is a judgment article about when a deload is actually earned. |
| `low-readiness-score-strength-training` | Recovery & Readiness | 2026-04-27 | 2026-04-28 | 2026-04-27 | 2026-04-28 | Symptom audit | Readers need help weighing stacked low-readiness signals. |
| `menstrual-cycle-recovery-metrics-wearables` | Women Who Lift | 2026-04-27 | 2026-04-27 | 2026-04-27 | 2026-04-27 | Metric explainer | The article is strongest when it translates metrics rather than just listing them. |
| `strength-training-app-for-women-recovery` | Women Who Lift | 2026-04-27 | 2026-04-28 | 2026-04-27 | 2026-04-28 | Decision guide | This article should help the reader decide whether the product logic matches her needs. |
| `strength-training-around-minor-injuries` | Training Around Pain | 2026-04-27 | 2026-04-28 | 2026-04-27 | 2026-04-28 | Modification checklist | The best interaction is a quick filter for safe modifications. |
| `strength-training-during-period-modifications` | Women Who Lift | 2026-04-27 | 2026-04-28 | 2026-04-27 | 2026-04-28 | Decision guide | The article answers what to push and what to modify on the day. |
| `cardio-and-strength-training-for-women` | Women Who Lift | 2026-05-18 | 2026-05-18 | 2026-04-28 | 2026-04-28 | Compare options | The staged future date was unrealistic; readers need a tradeoff view between conditioning and lifting. |
