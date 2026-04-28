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
| Data | Local offline storage | iOS app (current) | partial | IndexedDB (Dexie) local store + migration | `src/lib/pwa/local-db.ts` | Data loss / schema drift | Starter row to exercise the contract. |

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

- (placeholder) Add at least 1 concrete gap row here during inventory fill.

---

## Web-impossible / constraint-bound items (required)

List capabilities that are believed to be impossible or unacceptable on web/PWA, and *why*.

- (placeholder) Add at least 1 concrete constraint item here during inventory fill.

---

## Requirements / classification traceability (required)

This ledger is used to drive requirement scope and priority.

- **R001**: iOS capability parity inventory exists and is tracked.
- **R010**: parity claims are evidence-backed and machine-checkable.
- **R014**: capabilities must be classified into `covered`/`partial`/`missing`/`deferred`/`web-impossible` with explicit implications.

Decision linkage:

- **D003**: parity means *replacement parity*.
