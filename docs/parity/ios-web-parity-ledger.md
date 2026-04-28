# iOS → Web Replacement Parity Ledger (Contract)

**Reader:** engineers migrating the existing iOS app to a web/PWA replacement.

**Purpose:** define the tracked, machine-checkable contract for documenting *replacement parity* between current iOS capabilities and current web/PWA support.

This file is intentionally a **contract** first (shape, vocabulary, required sections, evidence rules) so downstream work can fill the inventory without reinventing rules.

---

## Parity definition (D003)

This project tracks **replacement parity**, not implementation parity.

- Replacement parity means: the web/PWA provides a way for users to accomplish the *same job-to-be-done*, even if the technical implementation differs from iOS.
- We do **not** require matching UI affordances, Apple frameworks, or 1:1 API equivalence.

See decision **D003** in the decisions register.

See also: `docs/parity/parity-verification-harness.md` for the evidence/status contract used by verifiers.

---

## Status vocabulary (must be exact)

Every active ledger row MUST use exactly one status from:

- `covered` — web/PWA already supports the capability with acceptable UX.
- `partial` — some path exists but significant UX/feature gaps remain.
- `missing` — no viable path exists yet; work is required.
- `deferred` — deliberately not pursuing in current milestone; track why.
- `web-impossible` — not feasible in web/PWA within current constraints; document the constraint/evidence.

> No other status strings are allowed.

---

## Evidence rules

Every row MUST include **evidence** that is actionable for future agents.

Accepted evidence formats:

- A short text rationale (e.g. “Safari iOS blocks background execution; needs user-initiated flow”).
- A markdown link to primary docs or standards.
- A repo-internal path to a tracked file (e.g. ``src/lib/pwa/local-db.ts``). Backticks are allowed.

Avoid:

- vague phrases like “should work”
- references to ignored directories (e.g. `.gsd/`, `.planning/`)
- secrets, IDs, or user data

---

## Required table

The verifier expects a single markdown table under **## Ledger** with the exact header columns below.

## Ledger

| bucket | capability | ios_source | web_status | replacement_path | evidence | risks | notes |
|---|---|---|---|---|---|---|---|
| App shell | Dedicated app surface at `/app` | iOS app: main app experience | covered | PWA route `/app` hosts the training experience | `src/app/app/page.tsx` `src/components/pwa/AppExperience.tsx` | Navigation/SEO boundary drift | Current web app experience is already isolated under `/app`. |
| Offline | Offline-first local storage for workouts/cycle/recovery/programs | iOS app: on-device persistence | partial | IndexedDB (Dexie) local store + migration discipline | `src/lib/pwa/local-db.ts` `src/lib/pwa/schema.ts` | Data loss / schema drift | Local DB exists; migration strategy and data integrity still need hardening. |
| Training | Log a workout set (exercise/weight/reps/unit) | iOS app: workout logging + set entry | covered | Log screen with local persistence | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/local-repositories.ts` | Validation gaps; UX parity | Web supports core set logging; advanced flows may still diverge. |
| Training | Workout execution session with timers, rest, substitutions, and rich detail views | iOS: workout execution / session flow (multiple views) | partial | Local-first "program session" execution loop: enroll bundled program, capture performed sets, persist structured workout+set artifacts, advance active session, and expose counts/export for inspection. Timers/substitutions/rich session UI still missing. | Evidence: local repositories `src/lib/pwa/local-repositories.ts`, UI orchestration `src/components/pwa/AppExperience.tsx` + `src/components/pwa/app-shell/ProgramsScreen.tsx`, deterministic proof `src/lib/pwa/core-workout-loop.test.ts`, baseline repository tests `src/lib/pwa/local-repositories.test.ts` | High: UX depth + timers/substitutions still absent; needs dedicated runner UI | S03 closes the highest-risk "generic completion" gap by persisting structured program workouts in local-only mode, but does not implement timers/rest/substitutions. |
| AI | AI workout generation, personalization, and handoff into an executable session | iOS: AI workout generation + session handoff | missing | Add server-backed AI plan generation + client flow to review/apply to session | iOS evidence: AI workout generation path (research handoff); web evidence: no AI flows in `src/components/pwa/AppExperience.tsx` | High: differentiator; model + cost + safety | Treat as replacement parity: could start with template-based assistant before full parity. |
| Cycle | Record period start + derive cycle phase guidance | iOS: cycle tracking + recommendations | covered | Cycle screen saves settings + logs and computes next period | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/cycle` | Algorithm/validation drift | Current web implementation covers the basic job-to-be-done. |
| Recovery | Record recovery inputs (sleep/soreness/stress) and compute a daily readiness label | iOS: recovery tracking | covered | Recovery screen stores daily recovery score record | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/recovery` | Engagement without reminders | No notifications/reminders; see notifications rows. |
| Sensors | HealthKit import of workouts, heart rate, HRV, etc. | iOS: HealthKit | web-impossible | No direct HealthKit; consider manual import / device integrations later | Constraint: HealthKit is Apple-only; Web cannot access it directly (R014 classification). See harness refs: [MDN — Service Worker API](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) (web surface has no HealthKit bridge). | High: data gaps; parity expectations | Marked web-impossible only for direct HealthKit parity; replacement may exist via manual import or vendor APIs. |
| Data controls | Export all user data (portable JSON) | iOS: export/share data | covered | Data screen exports JSON and triggers download | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/local-repositories.ts` | Privacy; format stability | Export exists; format contract should be documented later. |
| Data controls | Delete all user data on-device | iOS: account/data controls | covered | Data screen clears local tables | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/local-repositories.ts` | Accidental deletion | All-or-nothing delete exists; selective delete is missing. |
| Account | Account/profile/settings management beyond sync (profile, preferences, subscription, support) | iOS: settings/profile/account/export surfaces | partial | Start with minimal “data mode + sync auth” then expand settings/profile pages | Web evidence: `src/components/pwa/AppExperience.tsx` has data mode + sync boundary but no broader account UI. | High: trust, privacy, supportability | Current web app has only the sync auth boundary, not full account/settings parity. |
| Analytics | Rich analytics dashboards, benchmarks, maxes, insights | iOS: analytics/benchmarks/maxes/insights views | missing | Build analytics views on top of local+synced data with charts + PR/max calculations | Web evidence: no analytics screens in `src/components/pwa/AppExperience.tsx`; only limited "best lift" today. | Medium/High: retention + value | Web currently shows “best lift” only; that’s not full analytics parity. |
| Programs | Guided programs with enrollments and session progression | iOS: programs | partial | Web supports one bundled program; expand program library and editing | `src/components/pwa/AppExperience.tsx` `src/lib/pwa/programs` | Content scope explosion | One program is implemented; broader parity likely missing. |
| Notifications | Push notifications for reminders (recovery check-ins, workouts) | iOS: local/push notifications | deferred | Investigate iOS Safari push constraints + implement if feasible | Web evidence: no Push API handlers in `public/sw.js` | High: engagement; platform limits | Defer until constraints are validated; may move to web-impossible if iOS Safari limitations block required UX. |
| Background | Background sync / background execution of cloud sync | iOS: background tasks | partial | User-initiated sync only; explore Background Sync / periodic sync later | `src/lib/pwa/cloud-sync.ts` `public/sw.js` | Battery; reliability | Current web sync is foreground/user-driven; no background scheduler. |
| Sync | Optional Supabase-backed cloud sync | iOS: cloud sync | partial | User-initiated push/pull with conflict rules (LWW) | `src/lib/pwa/cloud-sync.ts` `README.md` | Data conflicts; auth | Implemented at a basic level; still needs robustness and UX polish. |

### Column semantics

- `bucket`: high-level area (e.g. Data, Sync, Notifications, Purchase, Auth, UI, Export, Sharing, Background, Sensors).
- `capability`: user-facing capability.
- `ios_source`: where the capability exists on iOS (feature/module name; do not paste code).
- `web_status`: one of the allowed statuses above.
- `replacement_path`: what the web/PWA will do instead (even if TBD).
- `evidence`: why we believe the status/path.
- `risks`: what could invalidate the claim.
- `notes`: optional details.

---

## Highest-risk gaps (required)

List the top gaps that could block a viable replacement if unresolved.

1. **Workout execution session runner (timers, rest, substitutions, rich detail)** — Without a session-mode runner, the web app risks feeling like a “logging form” rather than a training companion.
   - iOS anchor: native workout/session flow modules (research handoff)
   - Web evidence: `src/components/pwa/AppExperience.tsx` only supports quick set logging.

2. **AI workout generation → review → handoff into an executable session** — This is a differentiator and requires end-to-end flow design (prompting, safety, cost controls, and a concrete output schema that the session runner can execute).
   - iOS anchor: AI workout generation + session handoff (research handoff)
   - Web evidence: no AI generation or planning flows in the current PWA app surface.

3. **HealthKit-derived inputs (cycle/recovery/workout imports)** — Direct HealthKit parity is not feasible on web; replacement paths (manual entry, file import, vendor API integrations) must be defined or the web replacement will have an unavoidable data quality gap.
   - Constraint anchor: HealthKit is Apple-only (see R014 classification below)
   - Web evidence: no import integrations today.

4. **Account/profile/settings breadth (privacy, export semantics, supportability, subscription)** — The current web app has only the sync auth boundary; missing account controls can block shipping to real users even if training logging works.
   - iOS anchor: settings/profile/account/export surfaces (research handoff)
   - Web evidence: `src/components/pwa/AppExperience.tsx` focuses on in-app logging + data mode selection.

5. **Notifications/reminders + background runtime expectations** — Engagement features depend on push/local notifications and reliable background behavior that may be constrained on iOS Safari.
   - Web evidence: no Push API handling in `public/sw.js`; sync is foreground/user-initiated.

---

## Web-impossible / constraint-bound items (required)

List capabilities that are believed to be impossible or unacceptable on web/PWA, and *why*.

- **Direct HealthKit integration (workouts, HR/HRV, cycle signals)** — `web-impossible` for direct parity because HealthKit is Apple-only and not exposed to the open web platform. Replacement paths may include manual entry, file import, or third-party wearable APIs, but those are not HealthKit parity.
- **Reliable always-on background execution (iOS-like background tasks)** — constraint-bound: installed PWAs still face background execution limits; current implementation is user-initiated foreground sync only. Treat as `partial`/`deferred` rather than `web-impossible` until constraints are validated for our required UX.
- **Push notification support on iOS Safari PWAs** — constraint-bound: push capability exists in some Safari versions/configurations but is not universal and has UX friction. We defer implementation until we validate target OS/browser support requirements.

> Rule of thumb: use `web-impossible` only for platform constraints (like HealthKit), not for ordinary missing features (like analytics views).
---

## Requirements / classification traceability (required)

This ledger is used to drive requirement scope and priority.

- **R001**: iOS capability parity inventory exists and is tracked.
- **R010**: parity claims are evidence-backed and machine-checkable.
- **R014**: capabilities must be classified into `covered`/`partial`/`missing`/`deferred`/`web-impossible` with explicit implications.

Decision linkage:

- **D003**: parity means *replacement parity*.
