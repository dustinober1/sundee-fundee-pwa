# M001/S06 — Research

**Date:** 2026-04-28

## Summary

S06 is a targeted integration/proof slice, not a new subsystem. The main seams already exist: the `/app` PWA route (`src/app/app/page.tsx`), local-only onboarding and workout/program execution orchestration (`src/components/pwa/AppExperience.tsx`), the presentational screens (`src/components/pwa/app-shell/*`), the local-first repository layer (`src/lib/pwa/local-repositories.ts`), the cloud/local guard (`src/lib/pwa/cloud-sync.ts`), and the parity harness/e2e scaffold (`tests/e2e/parity-app.spec.ts`, `playwright.config.ts`, `docs/parity/*`). S03 proved the structured local workout loop in deterministic repository tests; S04 proved the local-only no-upload boundary; S05 proved a stable browser smoke path. S06 should combine those into an honest end-to-end replacement proof for real private use and public-URL launchability evidence.

Active requirements this slice directly supports: **R003** (main workout loop usable in the PWA during actual training sessions) and **R011** (publishable/usable on a public URL for private testing now). It also consumes the replacement-parity rule from D003 / MEM003: proof should validate the same job-to-be-done, not UI mimicry. The highest-value work is expanding browser proof from S05’s stable smoke assertions into a deterministic “real user loop” assertion, then documenting/recording the deployment + private-test contract so parity claims can cite machine-checkable evidence instead of narrative.

## Recommendation

Build S06 in this order:
1. **Deepen the browser proof first** by expanding `tests/e2e/parity-app.spec.ts` from enrollment/persistence smoke into the full local-only loop already proven at repository level: onboarding → enroll → complete session with performed values → return to Today → verify workout/program counts and persisted local-only state after reload. This is the clearest evidence for R003 and is the riskiest gap left by S05.
2. **Add explicit launchability/public-URL proof surfaces** second. The codebase already has deploy scripts (`npm run preview`, `npm run deploy`) via OpenNext/Cloudflare, a PWA manifest, and a service worker. What is missing is a tracked contract for how to publish privately/unadvertised, what URL/envs are required, and what checks prove the deployed app is usable. This likely belongs in `README.md` plus a new doc in `docs/parity/` or `docs/architecture/` so the ledger can cite tracked evidence for R011.
3. **Only then update parity evidence/docs** (`docs/parity/ios-web-parity-ledger.md`, `docs/parity/web-capability-inventory.md`) to cite the stronger e2e proof and launchability contract. Follow the S05 harness rule: evidence must be tracked repo paths or public docs, not `.gsd` artifacts.

This follows the loaded **verify-before-complete** rule: do not claim “real replacement path proven” until the new e2e/browser or deploy verification commands run in the current task and produce fresh evidence. It also follows the existing parity-harness contract from S05: high-risk rows should prefer tests/e2e proof over prose-only claims.

## Implementation Landscape

### Key Files

- `src/app/app/page.tsx` — entry route for the app surface; unchanged seam, but this is the runtime target for all replacement-proof verification.
- `src/app/app/layout.tsx` — `/app` metadata is already `noindex`; relevant for “public but unadvertised” launchability positioning.
- `src/components/pwa/AppExperience.tsx` — orchestrator for onboarding, local-only/cloud mode, Today/Programs/Data screens, program enrollment, program-session completion, export/delete, online sync gating. Natural place if the proof needs additional observable UI state (success copy, counts refresh, stable selectors).
- `src/components/pwa/app-shell/ProgramsScreen.tsx` — renders `form#program-session`, fieldsets, weight/reps/unit controls, and the “Complete session” CTA. Current Playwright spec already targets this DOM; likely where stable test hooks/labels would be added if needed.
- `src/components/pwa/app-shell/TodayScreen.tsx` — shows status (“Local only”), workouts/lifts/program counts, and sync mode UI. Best place for post-completion observable assertions in e2e.
- `src/components/pwa/app-shell/DataScreen.tsx` — shows queued mutations, sync/account status, export/delete controls. Useful if S06 wants browser proof that local-only mode accumulates local data without requiring cloud auth.
- `src/lib/pwa/local-repositories.ts` — canonical local-first domain contract. `enrollFirstMargaritaProgram()`, `getActiveProgramSession()`, `completeActiveProgramSession()`, `countLocalRecords()`, and `exportLocalData()` define what “replacement loop completed” means in persistent terms.
- `src/lib/pwa/cloud-sync.ts` — local-only guard remains the no-upload boundary. S06 should reuse this as a constraint, not bypass it.
- `tests/e2e/parity-app.spec.ts` — current stable smoke proof. This is the primary seam to extend for S06; it already clears browser state and drives the local-only path.
- `playwright.config.ts` — deterministic dev-server config on `127.0.0.1:3100`, single-worker, artifact capture on failure. Keep this stable; do not broaden scope unless verification truly needs it.
- `src/lib/pwa/core-workout-loop.test.ts` — repository-level deterministic proof for the full program loop; use as the semantic reference for what the browser test should prove, not as a replacement.
- `src/lib/pwa/local-only-privacy.test.ts` — regression proof for the no-cloud-write claim; cite this alongside browser proof when documenting local-only real-use evidence.
- `src/app/manifest.ts` — install metadata (`start_url: /app`, `display: standalone`) and shortcuts; relevant to R011/public-use docs.
- `public/sw.js` and `src/components/pwa/PwaServiceWorker.tsx` — install/offline shell behavior; supports “usable” claims for deployed private testing, but does not prove push/background features.
- `README.md` — already contains deploy commands (`preview`, `deploy`) and local-only/cloud-sync notes; likely needs an explicit “private testing / public URL proof” section.
- `docs/parity/ios-web-parity-ledger.md` — canonical parity claims; update only after new proof exists.
- `docs/parity/web-capability-inventory.md` — current web-side capability evidence; should gain S06 evidence lines once browser/deploy proof is in place.
- `docs/parity/parity-verification-harness.md` — contract from S05. Planner/executors should follow its high-risk evidence standard and avoid evidence in ignored dirs.

### Build Order

1. **Inspect and strengthen observability for browser proof**
   - Confirm the existing Today/Programs UI exposes stable post-session assertions (counts, headings, status labels).
   - If assertions are too brittle, add small presentational hooks/copy in `TodayScreen.tsx` / `ProgramsScreen.tsx` via `AppExperience.tsx` state, rather than changing repository logic.
   - This unblocks deterministic expansion of the Playwright flow.

2. **Expand Playwright from smoke to real loop**
   - Use the same local-only onboarding path.
   - Enroll, navigate back to the active program session, fill performed values, exercise validation (already partially present), complete the session, and assert Today shows persisted progress after reload.
   - Prefer observable count/status changes already backed by `countLocalRecords()` semantics instead of fragile layout assumptions.

3. **Document launchability/private-test contract**
   - Add tracked documentation describing how this app is published privately on a public URL using the existing OpenNext/Cloudflare path, what envs are optional vs required, and what “usable” means (e.g. `/app` reachable, local-only works without Supabase, manifest/service worker present, noindex on `/app`).
   - Keep this honest: broad promotion is out of scope; “publishable for private testing” is the claim.

4. **Update parity docs/evidence references**
   - After proof and docs exist, update ledger/inventory rows for workout-loop and launchability evidence.
   - Ensure evidence paths point to tracked files/tests/docs only.

### Verification Approach

Primary verification commands already fit the slice:

- `npm run test:e2e -- tests/e2e/parity-app.spec.ts` — must become the canonical browser proof for the real local-only replacement loop.
- `npm run test -- src/lib/pwa/core-workout-loop.test.ts src/lib/pwa/local-only-privacy.test.ts` — preserves the deterministic domain proof and local-only guard beneath the browser layer.
- `npm run verify:parity-ledger` — required after any parity-doc updates.
- `npm run verify:app-boundary` — ensures any added app proof/documentation does not violate the site/app boundary contract.
- `npm run typecheck`
- `npm run lint`

If launchability proof includes deploy/runtime verification, keep it machine-executable where possible (existing `npm run preview` is the obvious local production-like check) and document any manual public-URL check as a tracked recipe, not as untracked session narrative.

## Constraints

- **Replacement parity, not implementation parity** — per D003/MEM003, the browser proof only needs to show the same training job can be accomplished, not a 1:1 iOS runner UI.
- **Local-only boundary must remain intact** — S04’s cloud-sync guard in `runCloudSync()` is an invariant. S06 proof should exercise the real user loop in local-only mode first; do not make Supabase a prerequisite for replacement claims.
- **Launchability is “public but unadvertised,” not public rollout** — `/app` is already `noindex` in `src/app/app/layout.tsx`; deployment documentation should preserve that stance.
- **Current PWA limits remain honest gaps** — `public/sw.js` gives offline shell caching only; no push/background execution proof should be implied by S06.

## Common Pitfalls

- **Over-claiming from smoke tests** — S05 intentionally stopped at reachability/persistence smoke. S06 must not update parity wording unless the e2e flow truly completes a session and asserts persisted outcomes.
- **Using `.gsd` artifacts as parity evidence** — the S05 harness explicitly rejects ignored-dir evidence. Any new proof must live in tracked tests/docs.
- **Binding e2e to fragile copy/layout** — prefer headings, form IDs, labels, and stable stat tiles already present in `ProgramsScreen.tsx` / `TodayScreen.tsx`; add small test-friendly UI hooks if necessary.
- **Equating deploy commands with launchability proof** — `package.json` already has `preview`/`deploy`; R011 still needs tracked documentation and observable acceptance criteria for a private public URL.

## Open Risks

- The current browser flow may still be brittle around when the active session form becomes visible after enrollment; if so, executor work may need a small UX/state tweak in `AppExperience.tsx` rather than more Playwright retries.
- R011 evidence may require a new tracked “private testing deployment contract” doc because the current README only lists commands, not the acceptance proof for a private public URL.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Playwright/browser automation | `agent-browser` | installed |
| React/Next.js app patterns | `react-best-practices` | installed |
| Vercel/hosting-related frontend quality | `web-design-guidelines` / search results found for Vercel skills, but no new install needed for this slice | available |

