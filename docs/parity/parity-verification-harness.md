# Parity Verification Harness (Contract)

**Audience:** engineers validating iOS → web/PWA *replacement parity* claims.

**Purpose:** define what counts as **machine-checkable evidence** for each parity status in `docs/parity/ios-web-parity-ledger.md`, and how we record true platform impossibilities vs constraint-bound limitations.

This document is intentionally a **contract**:

- It explains *how to prove* parity claims (or prove they are not yet proven).
- It avoids inventing new vocabulary — the parity ledger remains the source of truth for statuses and row claims.
- It defines rules the verifier/tests can enforce (shape + minimal evidence), without pretending we can automatically validate every semantic claim.

---

## Replacement parity principles (D003)

We track **replacement parity**, not implementation parity.

- The goal is that a user can accomplish the same **job-to-be-done**.
- We do **not** require matching iOS UI, HealthKit APIs, Apple frameworks, or 1:1 feature mechanics.

Implication: a row may be `covered` even when the web implementation differs materially, as long as the replacement path is concrete and the evidence shows it exists.

---

## Canonical status vocabulary (must be exact)

Ledger rows MUST use exactly one of:

- `covered`
- `partial`
- `missing`
- `deferred`
- `web-impossible`

No additional statuses are allowed.

---

## Evidence: allowed / disallowed

### Allowed evidence formats

A ledger row’s `evidence` cell MUST be actionable and must use only **tracked** repo content or **public** external documentation.

Accepted evidence forms:

1. **Repo paths** to tracked files (preferred): e.g. `src/lib/pwa/local-db.ts`, `public/sw.js`.
2. **Markdown links** to public docs/standards: e.g. `[MDN — Push API](https://developer.mozilla.org/docs/Web/API/Push_API)`.
3. **Short rationale text** that explains why the status is believed true (keep it falsifiable).

### Disallowed evidence (explicitly rejected)

The parity harness intentionally rejects evidence that can’t be checked by other agents/CI:

- Any path under ignored/local-only directories (examples: `.gsd/`, `.planning/`, `.audits/`).
- Personal data, account identifiers, tokens, secrets, or real workout data.
- Vague phrasing like “should work” without either repo evidence or an external link.

---

## Evidence expectations by status

This section defines **minimum** evidence per status. Rows can always include more.

### `covered`

Minimum expectations:

- `replacement_path` explains the user-visible web/PWA path.
- `evidence` includes at least one of:
  - tracked repo path(s) that implement the capability, OR
  - a test path that proves it, OR
  - a public doc link that proves the platform support *and* a repo path that shows it’s implemented.

### `partial`

Minimum expectations:

- `replacement_path` describes what exists today **and** what is missing.
- `evidence` includes:
  - at least one tracked repo path showing the partial implementation, AND
  - a brief text note describing the limiting constraint or missing sub-capability.

### `missing`

Minimum expectations:

- `replacement_path` is explicit about being TBD or planned (no hand-waving).
- `evidence` includes:
  - a brief rationale explaining why we believe it’s missing, and ideally
  - a repo search anchor (e.g. “no Push API handling in `public/sw.js`”).

### `deferred`

Minimum expectations:

- `replacement_path` indicates the intended direction (even if not scheduled).
- `evidence` includes:
  - a clear **reason for deferral** (scope, dependency, risk), and
  - any known constraints that could later reclassify it to `web-impossible`.

Rule: `deferred` and `partial` MUST NOT be “upgraded” to `web-impossible` without cited proof (see below).

### `web-impossible`

**Use `web-impossible` narrowly.**

Minimum expectations:

- `replacement_path` describes the best-available alternative (manual entry, import, integration, etc.), even if it cannot fully match iOS.
- `evidence` includes:
  - a clear statement of the platform impossibility, AND
  - at least one public doc link or standards reference showing the constraint is inherent to the platform.

---

## `web-impossible` vs constraint-bound limitations

### The narrow definition of `web-impossible`

`web-impossible` is reserved for cases where **the web platform cannot provide the capability at all**, regardless of engineering effort.

The canonical example:

- **Direct HealthKit access** is `web-impossible` because HealthKit is an Apple-native framework and not accessible to web pages or service workers.

### Constraint-bound (NOT automatically `web-impossible`)

Many items are hard on the web/PWA — especially on iOS Safari — but are not proven impossible for our product UX.

Treat these as `partial` or `deferred` unless the ledger row includes a specific constraint citation proving the required UX cannot be met:

- Push notifications / reminders on iOS Safari PWAs
- Background execution / periodic background sync
- “Always on” behavior typical of native background tasks

These items are typically **constraint-bound** (platform-dependent, version-dependent, permission/UX-dependent), not universally impossible.

---

## High-risk row evidence expectations

Some rows have outsized impact on replacement viability. For these, we expect **stronger evidence** than “a file path exists”.

If a row’s `risks` is marked high (or the row is listed in the ledger’s “Highest-risk gaps”), prefer one or more of:

- A unit test or integration test path proving the capability.
- An e2e test that asserts the user-visible flow.
- A short, reproducible manual verification recipe *paired with* tracked evidence (e.g. test code, fixtures, screenshots in tracked docs if necessary).

---

## Impossibility / constraint register rules

The parity ledger table is the canonical mapping. When we need deeper detail on a platform limitation, we record it in a **register entry** (tracked in `docs/parity/` — see follow-on tasks).

A register entry MUST contain:

- **Capability:** the job-to-be-done being evaluated.
- **Classification:** `web-impossible` or `constraint-bound`.
- **Constraint / evidence:** why (with a public doc link).
- **Replacement path:** what the web/PWA can do instead.
- **Repo evidence (if applicable):** paths to current implementation or relevant stubs.

A register entry MUST NOT:

- cite `.gsd/` or other ignored directories as proof.
- claim impossibility without a link to primary documentation.

---

## Repeatable verification commands

These commands are the **canonical harness entry points**.

- Verify the ledger contract (shape, vocabulary, required sections):
  - `npm run verify:parity-ledger`

- Unit tests for ledger parsing/validation (scoped):
  - `npm run test -- src/lib/pwa/parity-ledger.test.ts`

- E2E proof of key replacement flows (scoped):
  - `npm run test:e2e -- tests/e2e/parity-app.spec.ts`

Notes:

- Evidence must be reproducible and must not contain secrets or real personal/workout data.
- Verifiers should report failures with file/row/selector pointers when practical.

---

## References (platform constraints)

Links used for citation accuracy in ledger/register entries:

- MDN — Push API: https://developer.mozilla.org/docs/Web/API/Push_API
- MDN — Notifications API: https://developer.mozilla.org/docs/Web/API/Notifications_API
- WebKit blog — Web Push for web apps on iOS and iPadOS (Safari): https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
- MDN — Service Worker API: https://developer.mozilla.org/docs/Web/API/Service_Worker_API
- MDN — Background Sync API (concept + availability notes): https://developer.mozilla.org/docs/Web/API/Background_Synchronization_API
