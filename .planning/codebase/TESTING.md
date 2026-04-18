# Testing Patterns

**Analysis Date:** 2026-04-17

## Test Framework

**Unit/Integration Runner:**
- Vitest `^4.1.4`
- Config: `vitest.config.ts`
- Plugins: `@vitejs/plugin-react`, `vite-tsconfig-paths`
- Environment: `jsdom`
- Globals: `true` (no need to import `describe`/`it`/`expect` — but observed code imports explicitly anyway)
- Setup file: `vitest.setup.ts` — imports `@testing-library/jest-dom/vitest` for DOM matchers

**E2E Runner:**
- Playwright `^1.59.1`
- Config: `playwright.config.ts`
- Browser: Chromium only
- Test dir: `tests/e2e/`

**Assertion Library:**
- Vitest built-in `expect` + `@testing-library/jest-dom` matchers (e.g., `toBeVisible`)
- `@testing-library/react ^16.3.2` and `@testing-library/user-event ^14.6.1` installed but not yet used in existing tests

**Run Commands:**
```bash
# Note: package.json scripts are incomplete — CI references these commands
npm test              # Runs vitest (inferred: vitest run)
npm run test:e2e      # Runs playwright (inferred: playwright test)
npm run typecheck     # Runs tsc --noEmit (inferred)

# Direct tool invocation (always works):
npx vitest run        # All unit tests
npx vitest            # Watch mode
npx vitest --coverage # Coverage report
npx playwright test   # All E2E tests
```

**Warning:** `package.json` only defines `dev`, `build`, `start`, and `lint` scripts. The CI workflow references `npm test`, `npm run typecheck`, and `npm run test:e2e` — these scripts are missing from `package.json` and will fail in CI. This is a known gap (see `CONCERNS.md`).

## Test File Organization

**Unit tests:** Co-located with the source file they test.
```
src/lib/domain/
├── oneRepMax.ts
├── oneRepMax.test.ts      # co-located
├── benchmarks.ts
├── benchmarks.test.ts     # co-located
├── challenges.ts
├── challenges.test.ts     # co-located
├── recoveryScore.ts
├── recoveryScore.test.ts  # co-located
├── cyclePhase.ts
├── cyclePhase.test.ts     # co-located
└── adaptation.ts
    adaptation.test.ts     # co-located
src/lib/
└── version.test.ts        # co-located with version.ts
```

**E2E tests:** Separate top-level directory.
```
tests/e2e/
├── smoke.spec.ts       # Basic page load check
└── auth-flow.spec.ts   # Login page rendering + auth form checks
```

**Naming:**
- Unit: `<module>.test.ts` — matches the source file name
- E2E: `<feature-or-area>.spec.ts`
- Vitest includes: `src/**/*.{test,spec}.{ts,tsx}`
- Vitest excludes: `node_modules`, `.next`, `tests/e2e/**`

## Test Structure

**Unit suite organization:**
```typescript
import { describe, expect, it } from "vitest";
import { functionUnderTest } from "./module";

describe("functionUnderTest", () => {
  it("describes the specific behavior", () => {
    expect(functionUnderTest(input)).toBe(expected);
  });

  it("handles edge case", () => {
    expect(functionUnderTest(edgeInput)).toBeNull();
  });
});
```

**Patterns:**
- Explicit `vitest` imports for `describe`, `expect`, `it` — even though globals are enabled
- No `beforeEach`/`afterEach` — all tests are stateless, pure function calls
- No mocking in existing tests — domain functions have zero external dependencies
- Test data defined inline or as module-level constants (`const kneeInjury: Injury = { ... }`)

## Mocking

**Framework:** Vitest mock utilities (`vi`) — available but not used in current tests.

**Current state:** No mocks in any existing test. All tested modules are pure functions with no I/O or external dependencies, so mocking is unnecessary.

**For future tests needing mocks:**
```typescript
import { vi } from "vitest";

// Mock a module
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn().mockResolvedValue({ from: vi.fn() }),
}));

// Mock a function
const mockFn = vi.fn().mockReturnValue(42);
```

**What to mock:**
- Supabase client (`createSupabaseServerClient`, `createSupabaseBrowserClient`) when testing server actions or query functions
- `next/navigation` (`redirect`, `notFound`) when testing server actions that redirect
- `react` cache when testing cached query functions

**What NOT to mock:**
- Domain logic modules in `src/lib/domain/` — these are pure functions and should be tested directly
- TypeScript types — not executable

## Fixtures and Factories

**Current pattern:** Inline test data as module-level `const` values.

```typescript
// From src/lib/domain/adaptation.test.ts
const kneeInjury: Injury = {
  id: "i1",
  name: "knee strain",
  location_ids: ["knee_right"],
  recovery_phase: "rehab",
};

// Spread to create variants
{ ...kneeInjury, recovery_phase: "resolved" }
{ ...kneeInjury, id: "i9", recovery_phase: "acute" }
```

**Location:** No shared fixtures directory — all fixtures are defined at the top of each test file.

## Coverage

**Requirements:** None enforced — no coverage thresholds configured.

**View Coverage:**
```bash
npx vitest --coverage
```

**Current coverage assessment:**
- `src/lib/domain/` — well covered: `oneRepMax`, `benchmarks`, `challenges`, `recoveryScore`, `cyclePhase`, `adaptation` all have dedicated test files
- `src/lib/version.ts` — covered
- `src/app/` — zero unit test coverage (no tests for pages, actions, or layout)
- `src/features/` — zero unit test coverage (no tests for feature queries)
- `src/lib/supabase/` — zero unit test coverage (DAL, server client, proxy not tested)
- `src/components/` — zero unit test coverage

## Test Types

**Unit Tests (`src/**/*.test.ts`):**
- Scope: Pure domain logic functions only
- 7 test files, all in `src/lib/domain/` and `src/lib/`
- No React component testing, no server action testing, no query testing
- Tests are fast, deterministic, no network or DB required

**E2E Tests (`tests/e2e/*.spec.ts`):**
- Scope: Page rendering and UI structure validation
- 2 spec files: `smoke.spec.ts` and `auth-flow.spec.ts`
- `smoke.spec.ts` — checks landing page loads with correct title
- `auth-flow.spec.ts` — validates login page renders OAuth buttons and magic link form; validates `?error` param surfaces in UI; onboarding test conditionally skipped when Supabase is unconfigured
- Runs against full production build (`npm run build && npm start`)
- Chromium only; retries 2× on CI

**Integration Tests:** Not present.

**Component Tests:** `@testing-library/react` and `@testing-library/user-event` are installed but unused.

## CI/CD Setup

**Config:** `.github/workflows/ci.yml`

**Trigger:** Push and PR to `main` branch. Concurrent runs cancelled via `concurrency` group.

**Job 1 — `verify` (Lint / Typecheck / Unit):**
```
npm ci → npm run lint → npm run typecheck → npm test → npm run build
```
- Node version from `.nvmrc` (Node 22)
- npm cache enabled

**Job 2 — `e2e` (Playwright E2E):**
- Depends on `verify` job passing
- Installs Chromium: `npx playwright install --with-deps chromium`
- Runs: `npm run test:e2e`
- Uploads `playwright-report/` as artifact (14-day retention) on success or failure

**Known CI gap:** `package.json` is missing `test`, `typecheck`, and `test:e2e` scripts — the CI pipeline will fail until these are added. See `CONCERNS.md`.

## Test Coverage Gaps

**Server Actions (`src/app/workouts/actions.ts`, etc.):**
- No tests for Zod validation, ownership checks, revalidation, or redirect behavior
- Risk: Broken validation silently passes invalid data to Supabase

**Feature Queries (`src/features/*/queries.ts`):**
- No tests for query shape mapping (the `type Raw = ...` casting pattern)
- Risk: Supabase schema changes silently break data shapes

**DAL (`src/lib/supabase/dal.ts`):**
- No tests for `requireUser`, `requireOnboardedProfile`, or graceful unconfigured state
- Risk: Auth redirect logic regressions go undetected

**React Components:**
- `LoginForm.tsx` — no tests for OAuth handler, magic link, password sign-in, or error states
- `NewWorkoutForm.tsx` — no tests for `useActionState` integration or field validation display
- Risk: UI regressions not caught by E2E tests (which only verify presence, not interaction)

---

*Testing analysis: 2026-04-17*
