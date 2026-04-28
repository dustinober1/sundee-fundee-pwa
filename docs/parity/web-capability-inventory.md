# Web PWA Capability Inventory (Current State)

**Reader:** engineers assessing iOS → web/PWA replacement parity.

**Purpose:** document what the current web/PWA *actually does today* (user-visible capability + concrete repo evidence), so parity mapping work can cite real implementation signals instead of marketing pages.

**Scope:** this inventory describes the web/PWA side only. Do **not** infer iOS parity here except when the web capability itself is unambiguous.

**Evidence rule:** every capability row below includes at least one tracked repo path (`src/...`, `public/...`, or `README.md`). If evidence is ambiguous, treat it as **unknown / evidence insufficient**.

---

See also: `docs/parity/parity-verification-harness.md` for what counts as acceptable evidence when promoting inventory findings into the parity ledger, and `docs/parity/private-testing-launchability.md` for the private public-URL launchability contract used by parity claims.

## Inventory

| area | user job / capability | current web behavior | evidence | gaps / notes |
|---|---|---|---|---|
| App shell | Run the PWA experience at a dedicated app route | The training app renders at `/app` as a client component experience. | `src/app/app/page.tsx` `src/components/pwa/AppExperience.tsx` | `/app` is marked noindex via layout metadata. |
| App shell | Navigate between Today / Log / Cycle / Recovery / Programs / Data | In-app navigation is client-state driven (not separate routes), switching between screens with buttons. | `src/components/pwa/AppExperience.tsx` | Screens are not addressable as deep links today. |
| Onboarding | Choose local-only vs cloud-sync data mode | First-run gate forces selecting a data mode; "Local only" requires no account; "Cloud sync" is opt-in. | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/schema.ts` | DataMode is `local-only` or `cloud-sync`. |
| Training | Log a workout set (exercise, weight, reps, unit) | Log screen supports creating a quick workout set and persists it locally. | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/local-repositories.ts` | Validation is minimal (e.g. non-empty exercise name, reps >= 1). |
| Training | Show calculated e1RM estimate + plate breakdown | UI computes estimated 1RM and plate math (lb only) from entered set. | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/calculations` | Plate breakdown is lb-only by design. |
| Training | Show "best lift" summary | App computes and shows a best lift (highest estimated 1RM) from local lift records. | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/local-repositories.ts` | Best lift relies on local lift updates from logged sets. |
| Cycle | Record period start date and compute cycle context | Cycle screen saves cycle settings + period log, then derives phase recommendation and predicted next period. | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/local-repositories.ts` `src/lib/pwa/cycle` | Uses a default settings payload in UI (28/5/14 + tracking enabled). |
| Recovery | Record recovery inputs (sleep, soreness, stress) and store a daily score | Recovery screen saves a computed recovery score record and shows a training label. | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/local-repositories.ts` `src/lib/pwa/recovery` | No push reminders/notifications; user must open the app. |
| Programs | Enroll in bundled "First Margarita" program | Programs screen enrolls the user in the bundled program and persists program + enrollment locally. | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/local-repositories.ts` `src/lib/pwa/programs` | Only the first bundled program is surfaced right now. |
| Programs | Show today’s program session details | When enrolled, app reads active session and renders exercise list with sets/reps/%1RM/rest. | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/local-repositories.ts` | Session detail is derived from the bundled program template. |
| Programs | Mark program session complete (structured local workout artifacts) | "Complete session" advances enrollment session index/week, persists a completed workout record (`source: program`), persists performed workout set rows, updates lift/best estimates, and queues local mutations for later sync. | `src/components/pwa/AppExperience.tsx` `src/components/pwa/app-shell/ProgramsScreen.tsx` `src/lib/pwa/local-repositories.ts` `src/lib/pwa/core-workout-loop.test.ts` `tests/e2e/parity-app.spec.ts` | Timers/rest UI/substitutions still missing; current loop is form-driven set capture. |
| Data controls | Export local data as JSON | Data screen generates a JSON export and triggers a file download. | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/local-repositories.ts` | Export includes all local tables (including sync mutation queue). |
| Data controls | Delete all local data on-device | Data screen confirms then clears all Dexie tables and resets UI state. | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/local-repositories.ts` | No selective delete today (all-or-nothing). |
| Offline | Continue using the app offline (app shell fallback) | Service worker caches core shell assets and falls back to `/app` or `/offline` on navigation fetch failures. | `public/sw.js` `src/app/offline/page.tsx` | Offline fallback is for navigation requests; no granular per-API caching. |
| Install | PWA manifest supports install metadata | Next.js manifest declares `display: standalone`, icons, shortcuts, start_url `/app`. | `src/app/manifest.ts` | `scope` is `/` today. |
| Local persistence | Persist workouts/exercises/lifts/etc locally using IndexedDB (Dexie) | Local DB uses Dexie with tables for workouts, sets, cycle logs, recovery, programs, injuries, preferences, and sync queue. | `src/lib/pwa/local-db.ts` `src/lib/pwa/schema.ts` | DB schema version is `1`. |
| Local persistence | Queue local mutations for later sync | Writes to entities also enqueue a sync mutation (entity/entityId/op/payload). | `src/lib/pwa/local-repositories.ts` `src/lib/pwa/schema.ts` | Queue is used by cloud sync; not a background worker. |
| Cloud sync | Optional Supabase-backed sync (manual / user-initiated) | If configured and enabled, the app can push queued mutations and pull remote rows (LWW by updated_at). | `src/lib/pwa/cloud-sync.ts` `src/components/pwa/AppExperience.tsx` `README.md` | Sync is started by user action ("Start cloud sync" / "Sync now"). |
| Cloud sync | Cloud sync requires sign-in; missing config is handled explicitly | If env vars are missing, sync reports `not-configured`; if signed out, app redirects to sign-in. | `src/lib/pwa/cloud-sync.ts` `src/components/pwa/AppExperience.tsx` | Not a full account/settings parity claim; only sync mechanics. |
| Notifications | Push notifications / background reminders | Not implemented; no push subscription, notification permission requests, or background tasks are present. | `public/sw.js` `src/components/pwa/AppExperience.tsx` | Explicit non-capability: no current push/background notifications. |

---

## Explicit non-capabilities / evidence-insufficient items

- **No push notifications / background reminders**: service worker only handles cache + fetch; no Push API handling. Evidence: `public/sw.js`.
- **No background sync guarantees**: cloud sync runs when the user opens the app and is online; there is no background task scheduling shown in repo. Evidence: `src/components/pwa/AppExperience.tsx` `src/lib/pwa/cloud-sync.ts`.
- **Cloud sync is not full account/settings parity**: current evidence covers optional data sync mechanics only; it does not prove the full native account model, settings, or subscription parity. Evidence: `README.md` `src/lib/pwa/cloud-sync.ts`.

## Notes / follow-ups

- If future refactors move evidence paths, update this inventory rather than dropping rows.
- Keep this table capability-oriented (jobs-to-be-done) rather than duplicating screens.
