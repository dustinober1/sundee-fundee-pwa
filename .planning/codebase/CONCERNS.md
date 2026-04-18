# Codebase Concerns

**Analysis Date:** 2026-04-17

## Security Considerations

**Open Redirect in Auth Callback:**
- Risk: The `?next=` parameter in `src/app/auth/callback/route.ts` (line 7) is passed directly to `new URL(next, url.origin)`. Because `new URL` is used with `url.origin` as base, an absolute URL in `next` (e.g., `https://evil.com`) would override the base, making this a potential open redirect after OAuth sign-in. The same risk exists in `src/app/login/LoginForm.tsx` where `next` is passed to `window.location.href = next ?? "/dashboard"` (line 65) without validation.
- Files: `src/app/auth/callback/route.ts`, `src/app/login/LoginForm.tsx`
- Current mitigation: None — `next` param is not validated to be same-origin.
- Recommendations: Validate that `next` starts with `/` before using it, or whitelist allowed paths.

**Missing Ownership Check on Set/Exercise Deletion:**
- Risk: `deleteSet` and `deleteWorkoutExercise` in `src/app/workouts/actions.ts` (lines 132–152) only authenticate the user with `requireUser()` but do NOT verify that the target row belongs to that user. They delete directly by `id` without an `.eq("user_id", user.id)` guard. RLS at the database layer mitigates this, but the application-level check is absent, making the defense rely entirely on Supabase RLS policy correctness.
- Files: `src/app/workouts/actions.ts`
- Current mitigation: Supabase RLS policies on `workout_sets` and `workout_exercises` enforce ownership through a join to `workouts`.
- Recommendations: Add explicit ownership verification at the action layer (check the parent workout's `user_id`), same pattern as `addExerciseToWorkout` already does.

**No Rate Limiting on Any Endpoint:**
- Risk: All server actions, auth routes, and the CSV export route have zero rate limiting. The magic link and password sign-in flows in `src/app/login/LoginForm.tsx` can be called indefinitely. The export route at `src/app/api/export/route.ts` could be abused to extract data at high volume.
- Files: `src/app/login/LoginForm.tsx`, `src/app/auth/callback/route.ts`, `src/app/api/export/route.ts`
- Current mitigation: None in application code. Supabase Auth may impose its own rate limits on the magic link endpoint.
- Recommendations: Add edge-level rate limiting (e.g., Vercel edge middleware, Upstash) on `/auth/callback`, `/api/export`, and server actions.

**Non-Null Assertion on Env Vars:**
- Risk: `src/lib/supabase/server.ts` and `src/lib/supabase/browser.ts` use the `!` non-null assertion on `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`. If these vars are absent in production, the app throws a runtime error rather than failing gracefully. The `isSupabaseConfigured()` guard in `src/lib/supabase/dal.ts` handles missing env in the DAL layer only, but `createSupabaseServerClient` itself would crash before the guard runs in some code paths (e.g., the export API route, which calls `createSupabaseServerClient` directly without the `isSupabaseConfigured()` check).
- Files: `src/lib/supabase/server.ts`, `src/lib/supabase/browser.ts`, `src/app/api/export/route.ts`
- Current mitigation: `isSupabaseConfigured()` guard in `src/lib/supabase/dal.ts` protects DAL-layer calls.
- Recommendations: Move the env guard into `createSupabaseServerClient` itself, or validate env at startup and throw a descriptive error early.

## Tech Debt

**No Supabase Generated Types:**
- Issue: `src/lib/supabase/types.ts` (lines 1–7) contains a comment that the full `Database` type should be regenerated from the live project via `npx supabase gen types typescript`, but this has not been done. All Supabase query results are typed with hand-written row interfaces and cast with `as SomeType | null`. This pattern is verbose, fragile, and can fall out of sync with actual schema.
- Files: `src/lib/supabase/types.ts`, `src/features/workouts/queries.ts`, `src/features/analytics/queries.ts`, `src/app/api/export/route.ts`
- Impact: Schema changes silently break type assumptions. No TypeScript protection against column renames or type changes.
- Fix approach: Run `npx supabase gen types typescript --project-id <id>` and replace the hand-rolled types with generated `Database['public']['Tables'][...]` types.

**Inline `type` Casts Throughout Query Files:**
- Issue: Every file that calls Supabase uses inline `as RawType` casts (e.g., `data as WorkoutSetRow[] | null`, `data as Raw`). This is a symptom of lacking generated types (above) and creates approximately 30+ unchecked cast sites across the codebase.
- Files: `src/features/workouts/queries.ts`, `src/features/analytics/queries.ts`, `src/app/api/export/route.ts`, `src/app/workouts/actions.ts`, `src/app/challenges/actions.ts`, `src/app/recovery/actions.ts`, `src/app/injuries/page.tsx`, and others.
- Impact: TypeScript safety is bypassed at every data boundary.
- Fix approach: Eliminate with generated types (above) and remove all `as` casts in favor of proper inference.

**Duplicate `DEFAULT_CYCLE_SETTINGS` Fallback:**
- Issue: The default cycle settings (`averageCycleLengthDays: 28`, `averagePeriodLengthDays: 5`, `lutealPhaseLengthDays: 14`) are duplicated as inline object literals in `src/app/recovery/actions.ts` (lines 44–48) and `src/app/cycle/page.tsx` (lines 55–59), in addition to the canonical `DEFAULT_CYCLE_SETTINGS` constant exported from `src/lib/domain/cyclePhase.ts`.
- Files: `src/app/recovery/actions.ts`, `src/app/cycle/page.tsx`, `src/lib/domain/cyclePhase.ts`
- Impact: If defaults change, three locations must be updated.
- Fix approach: Import and use `DEFAULT_CYCLE_SETTINGS` from `src/lib/domain/cyclePhase.ts` in both locations.

**Programs Feature is Incomplete (Placeholder UI):**
- Issue: `src/app/programs/enrolled/page.tsx` (lines 32–36) contains a hardcoded placeholder message: "Per-week session details land in a follow-up — the iOS source has full templates with exercises, sets, reps, and %1RM." The enrolled program page shows no actual workout sessions — only a week counter and advance/end controls. The `program_templates.phases` and `program_templates.weeks` JSONB columns in migration `0003` exist but are seeded as empty arrays (`'[]'::jsonb`).
- Files: `src/app/programs/enrolled/page.tsx`, `src/features/programs/queries.ts`, `supabase/migrations/0003_programs_benchmarks_challenges.sql`
- Impact: The Programs feature is non-functional beyond enrollment tracking. Users are instructed to log workouts manually.
- Fix approach: Seed program template data and build a week/session detail view using the `phases`/`weeks` JSONB structure.

**`insights/` Route Has No Page Implementation:**
- Issue: `src/app/insights/` exists as a directory but contains only `export/` as a subdirectory with an export page. There is no `src/app/insights/page.tsx`. The "Analytics" section in the dashboard links to `/analytics`, not `/insights`, so this may be a naming remnant.
- Files: `src/app/insights/` (directory)
- Impact: Navigating to `/insights` returns a 404. The directory name creates confusion.
- Fix approach: Either add a page to redirect to `/analytics`, or remove the directory if it is unused.

## Performance Bottlenecks

**Analytics Query Fetches All Sets for 90 Days Without DB-Level Aggregation:**
- Problem: `fetchSetsLast90Days()` in `src/features/analytics/queries.ts` (lines 55–73) loads every `workout_set` row for the last 90 days including nested joins (`workout_exercises`, `workouts`, `exercises`) and then aggregates them in JavaScript. For a high-frequency user, this could be thousands of rows per request.
- Files: `src/features/analytics/queries.ts`
- Cause: Aggregation (weekly volume, category balance) is done in JS after fetching all raw rows, rather than via a Postgres `GROUP BY` or materialized view.
- Improvement path: Move aggregation to a Supabase database function or RPC call; alternatively add a Postgres materialized view refreshed daily.

**`listWorkouts` Has a Hard Limit of 100 With No Pagination:**
- Problem: `src/features/workouts/queries.ts` (line 55) returns the most recent 100 workouts and silently truncates history beyond that. The workouts list page renders all 100 at once.
- Files: `src/features/workouts/queries.ts`, `src/app/workouts/page.tsx`
- Cause: No pagination or infinite scroll is implemented.
- Improvement path: Add cursor-based pagination or a load-more control.

**No Caching Strategy for Frequently-Read Catalog Data:**
- Problem: `listExercises()` and `listProgramTemplates()` are called on every workout detail page load and every programs page load. These are read-only catalog tables that change rarely.
- Files: `src/features/exercises/queries.ts`, `src/features/programs/queries.ts`
- Cause: React `cache()` is used in query functions, but this only deduplicates within a single request, not across requests.
- Improvement path: Use Next.js `fetch` with `next: { revalidate: 3600 }` for catalog endpoints, or move to `unstable_cache`.

## Fragile Areas

**Position Counter Race Condition in Workout Sets and Exercises:**
- Files: `src/app/workouts/actions.ts` (lines 74–87, 110–126)
- Why fragile: Both `addExerciseToWorkout` and `addSetToExercise` compute the next position by fetching the current max position and incrementing it in application code. If two requests arrive simultaneously, they read the same max position and insert two rows with the same position, violating the `unique (workout_id, position)` and `unique (workout_exercise_id, position)` constraints.
- Safe modification: Use a Postgres sequence or compute position with `SELECT COALESCE(MAX(position), -1) + 1 FROM ... FOR UPDATE` inside a transaction.
- Test coverage: No tests for concurrent inserts.

**`addSetToExercise` Has No Ownership Verification:**
- Files: `src/app/workouts/actions.ts` (lines 99–130)
- Why fragile: The action verifies the user is authenticated but does not check that `workout_exercise_id` belongs to the authenticated user's workout. This relies entirely on the `workout_sets_owner_all` RLS policy (which joins through `workout_exercises` to `workouts`). A misconfigured policy would silently expose a BSON injection surface.
- Safe modification: Add an explicit check: fetch the parent workout by joining through `workout_exercises`, confirm `user_id = user.id`.

**`volume_lbs` Unit Assumption in Challenges and Analytics:**
- Files: `src/app/challenges/actions.ts`, `src/features/analytics/queries.ts`, `src/lib/domain/challenges.ts`
- Why fragile: All volume calculations hard-code pounds (`volume_lbs`). The app supports `kg` as a user weight unit preference, but when a kg user adds volume to a challenge or has analytics computed, no conversion occurs. Data in `accumulated_volume_lbs` for kg users will be numerically incorrect (kg values stored as lb).
- Test coverage: `src/lib/domain/oneRepMax.test.ts` tests weight conversion, but challenge/analytics volume paths have no unit conversion tests.

## Missing Critical Features

**No Route Protection via Middleware:**
- Problem: There is no `middleware.ts` at the project root (only the Supabase proxy utility in `src/lib/supabase/proxy.ts` which is never mounted). Route protection relies entirely on `requireUser()` / `requireOnboardedProfile()` being called in each page. Any page that forgets to call these is publicly accessible.
- Blocks: Reliable authentication enforcement across all routes without per-page boilerplate.
- Files: `src/lib/supabase/proxy.ts` (utility exists but unused as middleware), all `src/app/*/page.tsx` files.

**No Delete Confirmation for Destructive Actions:**
- Problem: Delete buttons for workouts (`src/app/workouts/[id]/page.tsx`), injuries, challenges, sets, exercises, and benchmarks submit forms directly with no confirmation dialog or undo mechanism. A mis-tap permanently destroys data.
- Blocks: Safe destructive action UX.
- Files: `src/app/workouts/[id]/page.tsx`, `src/app/injuries/page.tsx`, `src/app/challenges/[id]/page.tsx`, `src/app/benchmarks/[id]/page.tsx`

## Test Coverage Gaps

**Server Actions Have Zero Test Coverage:**
- What's not tested: All `actions.ts` files (`src/app/workouts/actions.ts`, `src/app/challenges/actions.ts`, `src/app/recovery/actions.ts`, `src/app/injuries/actions.ts`, `src/app/maxes/actions.ts`, `src/app/pain/actions.ts`, `src/app/cycle/actions.ts`, `src/app/programs/actions.ts`)
- Files: All `src/app/*/actions.ts`
- Risk: Validation logic, ownership checks, and database mutations are untested. A refactor could silently break authorization without any failing test.
- Priority: High

**No Integration Tests for Database Queries:**
- What's not tested: All `src/features/*/queries.ts` files. Unit tests in `src/lib/domain/` cover pure domain logic only.
- Files: `src/features/analytics/queries.ts`, `src/features/workouts/queries.ts`, `src/features/recovery/queries.ts`, `src/features/programs/queries.ts`, `src/features/challenges/queries.ts`, `src/features/benchmarks/queries.ts`, `src/features/maxes/queries.ts`
- Risk: Query shape mismatches (e.g., after a migration) go undetected until runtime.
- Priority: High

**E2E Tests Require No Auth and Skip Most Pages:**
- What's not tested: All authenticated routes (`/dashboard`, `/workouts`, `/maxes`, `/recovery`, etc.) are not covered by e2e tests in `tests/e2e/`. The `auth-flow.spec.ts` conditionally skips the onboarding test when Supabase is not configured.
- Files: `tests/e2e/auth-flow.spec.ts`, `tests/e2e/smoke.spec.ts`
- Risk: Regressions in authenticated page rendering, form submission, and data display go undetected in CI.
- Priority: Medium

## Accessibility Gaps

**Interactive Buttons Lack Accessible Labels Throughout:**
- Problem: Delete and action buttons throughout the app (e.g., "Remove" in workout exercises, "Delete" for sets in `src/app/workouts/[id]/page.tsx`, "Delete workout" footer button) use text-only labels that are contextually ambiguous to screen readers. There are only 2 `aria-label` attributes across the entire `src/app/` directory.
- Files: `src/app/workouts/[id]/page.tsx`, `src/app/injuries/page.tsx`, `src/app/challenges/[id]/page.tsx`
- Risk: Screen reader users cannot distinguish which workout or set a "Remove" or "Delete" button targets.
- Fix approach: Add `aria-label` with entity name context (e.g., `aria-label={`Remove ${we.exercise_name}`}`).

**No `aria-live` Region for Server Action Feedback:**
- Problem: Form error and success messages are rendered conditionally in JSX but are not announced to screen readers. Only the global loading state in `src/app/loading.tsx` uses `aria-live="polite"`.
- Files: `src/app/onboarding/OnboardingForm.tsx`, `src/app/settings/SettingsForm.tsx`, `src/app/maxes/AddMaxForm.tsx`, `src/app/injuries/CreateInjuryForm.tsx`
- Risk: Users relying on screen readers receive no feedback when a form action succeeds or fails.
- Fix approach: Wrap error/success message containers with `aria-live="polite"`.

---

*Concerns audit: 2026-04-17*
