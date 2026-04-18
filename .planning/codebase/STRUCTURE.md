# Codebase Structure

**Analysis Date:** 2026-04-17

## Directory Layout

```
sundee-fundee-pwa/
├── src/
│   ├── app/                  # Next.js App Router — pages, layouts, actions, API routes
│   │   ├── layout.tsx        # Root layout (fonts, global CSS, ServiceWorkerRegister)
│   │   ├── page.tsx          # Landing page (public, unauthenticated)
│   │   ├── error.tsx         # Global error boundary
│   │   ├── loading.tsx       # Global streaming loading state
│   │   ├── not-found.tsx     # 404 handler
│   │   ├── manifest.ts       # PWA manifest generator
│   │   ├── globals.css       # Tailwind base styles + CSS custom properties
│   │   ├── favicon.ico
│   │   ├── auth/
│   │   │   ├── actions.ts    # signOut server action
│   │   │   └── callback/
│   │   │       └── route.ts  # OAuth/magic-link code exchange handler
│   │   ├── api/
│   │   │   └── export/
│   │   │       └── route.ts  # GET /api/export?dataset= — CSV download endpoint
│   │   ├── login/
│   │   │   ├── page.tsx      # Login page (Server Component shell)
│   │   │   └── LoginForm.tsx # "use client" — OAuth, password, magic link UI
│   │   ├── onboarding/
│   │   │   ├── page.tsx
│   │   │   ├── OnboardingForm.tsx
│   │   │   └── actions.ts    # completeOnboarding server action
│   │   ├── dashboard/
│   │   │   └── page.tsx      # Home screen — recovery score + nav cards
│   │   ├── workouts/
│   │   │   ├── page.tsx      # Workout list
│   │   │   ├── actions.ts    # createWorkout, addExercise, addSet, deleteX, completeWorkout
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx  # Workout detail
│   │   │   └── new/
│   │   │       ├── page.tsx
│   │   │       └── NewWorkoutForm.tsx
│   │   ├── maxes/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts
│   │   │   └── AddMaxForm.tsx
│   │   ├── programs/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts
│   │   │   └── enrolled/
│   │   │       └── page.tsx
│   │   ├── benchmarks/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── LogResultForm.tsx
│   │   ├── challenges/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts
│   │   │   ├── CreateChallengeForm.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── recovery/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts
│   │   │   └── LogRecoveryForm.tsx
│   │   ├── pain/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts
│   │   │   └── LogPainForm.tsx
│   │   ├── injuries/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts
│   │   │   └── CreateInjuryForm.tsx
│   │   ├── analytics/
│   │   │   ├── page.tsx
│   │   │   └── AnalyticsCharts.tsx  # "use client" — Recharts charts
│   │   ├── insights/
│   │   │   └── export/
│   │   │       └── page.tsx
│   │   ├── cycle/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── actions.ts
│   │       └── SettingsForm.tsx
│   ├── components/
│   │   └── ServiceWorkerRegister.tsx  # "use client" — registers /sw.js in production
│   ├── features/                      # Server-only read queries per domain entity
│   │   ├── analytics/queries.ts
│   │   ├── benchmarks/queries.ts
│   │   ├── challenges/queries.ts
│   │   ├── exercises/queries.ts
│   │   ├── maxes/queries.ts
│   │   ├── programs/queries.ts
│   │   ├── recovery/queries.ts
│   │   └── workouts/queries.ts
│   ├── lib/
│   │   ├── domain/                    # Pure TypeScript domain logic (no framework deps)
│   │   │   ├── adaptation.ts          # Injury contraindication + load multiplier engine
│   │   │   ├── adaptation.test.ts
│   │   │   ├── benchmarks.ts          # Benchmark scoring helpers
│   │   │   ├── benchmarks.test.ts
│   │   │   ├── bodyRegions.ts         # Body region registry + engine key map
│   │   │   ├── challenges.ts          # Volume calculation helpers
│   │   │   ├── challenges.test.ts
│   │   │   ├── cyclePhase.ts          # Menstrual cycle phase scoring
│   │   │   ├── cyclePhase.test.ts
│   │   │   ├── oneRepMax.ts           # Epley / Brzycki 1RM estimators
│   │   │   ├── oneRepMax.test.ts
│   │   │   ├── recoveryScore.ts       # Weighted multi-signal recovery calculator
│   │   │   └── recoveryScore.test.ts
│   │   ├── supabase/                  # Supabase client factories + DAL
│   │   │   ├── browser.ts             # createSupabaseBrowserClient (Client Components)
│   │   │   ├── server.ts              # createSupabaseServerClient (RSC + Server Actions)
│   │   │   ├── proxy.ts               # updateSupabaseSession (Middleware)
│   │   │   ├── dal.ts                 # Auth guards: requireUser, requireOnboardedProfile
│   │   │   └── types.ts               # Shared row interfaces + domain enums
│   │   ├── version.ts
│   │   └── version.test.ts
│   └── proxy.ts                       # Next.js middleware (route guard + session refresh)
├── supabase/
│   ├── migrations/                    # SQL migration files (applied via Supabase CLI)
│   ├── seed/                          # Seed data scripts
│   └── snippets/                      # SQL utility snippets
├── public/
│   ├── icons/                         # PWA icons (192, 512, maskable-512)
│   └── (sw.js served from here at runtime)
├── tests/
│   └── e2e/                           # Playwright end-to-end tests
├── .planning/
│   └── codebase/                      # GSD codebase map documents
├── .github/
│   └── workflows/                     # CI configuration
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── package.json
```

## Directory Purposes

**`src/app/`:**
- Purpose: All Next.js App Router routes — pages, layouts, server actions, and API route handlers
- Contains: `page.tsx` (Server Components), `actions.ts` (`"use server"` mutations), `*Form.tsx` (`"use client"` form islands), `route.ts` (API handlers), special files (`layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`, `manifest.ts`)
- Key files: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/dashboard/page.tsx`

**`src/features/`:**
- Purpose: Server-only read queries scoped per domain entity; imported by page Server Components
- Contains: One `queries.ts` per subdirectory; each exports `cache()`-wrapped async functions and inline row types
- Key files: `src/features/workouts/queries.ts`, `src/features/analytics/queries.ts`, `src/features/recovery/queries.ts`

**`src/lib/domain/`:**
- Purpose: Pure, framework-agnostic business logic; unit-tested in isolation
- Contains: Scoring algorithms (recovery, cycle phase), contraindication rules, 1RM estimators, volume calculators
- Key files: `src/lib/domain/recoveryScore.ts`, `src/lib/domain/adaptation.ts`, `src/lib/domain/oneRepMax.ts`

**`src/lib/supabase/`:**
- Purpose: Supabase client factory functions and the Data Access Layer
- Contains: Context-specific client factories (`browser.ts`, `server.ts`, `proxy.ts`), auth guards (`dal.ts`), shared row types (`types.ts`)
- Key files: `src/lib/supabase/dal.ts`, `src/lib/supabase/server.ts`

**`src/components/`:**
- Purpose: Shared Client Components that don't belong to a single route
- Contains: `ServiceWorkerRegister.tsx` (PWA service worker bootstrap)

**`supabase/`:**
- Purpose: Supabase project configuration managed by Supabase CLI
- Contains: SQL migrations in `supabase/migrations/`, seed scripts in `supabase/seed/`

**`public/`:**
- Purpose: Static assets served directly; PWA icons required by `src/app/manifest.ts`
- Contains: `icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-maskable-512.png`; service worker (`sw.js`) is served from here at runtime

**`tests/e2e/`:**
- Purpose: Playwright end-to-end test suite
- Key files: See `playwright.config.ts` at project root

## Key File Locations

**Entry Points:**
- `src/proxy.ts`: Next.js middleware — session refresh and route protection
- `src/app/layout.tsx`: Root HTML shell — fonts, global CSS, PWA metadata, ServiceWorkerRegister
- `src/app/page.tsx`: Public landing page
- `src/app/dashboard/page.tsx`: Authenticated home screen

**Configuration:**
- `next.config.ts`: Next.js config (minimal; `allowedDevOrigins` only)
- `tsconfig.json`: TypeScript config; defines `@/*` path alias to `./src/*`
- `vitest.config.ts`: Unit test runner config
- `playwright.config.ts`: E2E test runner config
- `eslint.config.mjs`: ESLint config
- `postcss.config.mjs`: PostCSS / Tailwind CSS config

**Core Logic:**
- `src/lib/supabase/dal.ts`: `requireUser`, `requireOnboardedProfile` — used at the top of every protected page
- `src/lib/supabase/server.ts`: `createSupabaseServerClient` — the single server-side DB/auth client factory
- `src/lib/domain/recoveryScore.ts`: Recovery score algorithm (weighted multi-signal)
- `src/lib/domain/adaptation.ts`: Injury contraindication + exercise regression engine

**Testing:**
- Unit tests: co-located with source, e.g. `src/lib/domain/recoveryScore.test.ts`
- E2E tests: `tests/e2e/`

## Naming Conventions

**Files:**
- Page files: `page.tsx` (Next.js convention)
- Server Actions: `actions.ts` per route directory
- Client Component forms: `PascalCase` matching the form's purpose, e.g. `NewWorkoutForm.tsx`, `LogRecoveryForm.tsx`
- Feature queries: `queries.ts` per feature directory
- Domain modules: `camelCase.ts`, e.g. `recoveryScore.ts`, `oneRepMax.ts`
- Tests: co-located, `<module>.test.ts`

**Directories:**
- App routes: lowercase, matching URL segment (e.g. `workouts/`, `benchmarks/`)
- Dynamic segments: `[id]/` (Next.js convention)
- Feature modules: lowercase, matching domain entity (e.g. `features/workouts/`)

## Where to Add New Code

**New App Route (page + mutations):**
- Create `src/app/<route>/page.tsx` (Server Component)
- Create `src/app/<route>/actions.ts` (`"use server"` mutations)
- Create `src/app/<route>/<Name>Form.tsx` (`"use client"` form component) if interactive input is needed
- Add auth guard `await requireOnboardedProfile()` as the first line in `page.tsx`

**New Data Read Query:**
- Add a `cache()`-wrapped function to `src/features/<domain>/queries.ts` (create the file if the domain is new)
- Mark the file `"server-only"` at the top

**New Domain Logic:**
- Add to an existing `src/lib/domain/<module>.ts` or create a new one
- Write a co-located `<module>.test.ts` (Vitest)
- Keep the module free of any Next.js or Supabase imports

**New Shared Client Component:**
- Add to `src/components/` (for route-agnostic components)
- For route-specific Client Components, keep them in `src/app/<route>/`

**New API Route:**
- Add `src/app/api/<name>/route.ts` following the pattern in `src/app/api/export/route.ts`
- Authenticate with `createSupabaseServerClient` and check `supabase.auth.getUser()`

**New Supabase Table:**
- Write a migration in `supabase/migrations/` via `supabase migration new <name>`
- Add a row interface to `src/lib/supabase/types.ts` if the table is accessed in the DAL; otherwise define the type inline in the relevant `queries.ts`

## Special Directories

**`.planning/`:**
- Purpose: GSD planning documents and codebase maps
- Generated: No — manually maintained
- Committed: Yes

**`.next/`:**
- Purpose: Next.js build output and dev cache
- Generated: Yes
- Committed: No

**`supabase/.branches/` and `supabase/.temp/`:**
- Purpose: Supabase CLI working directories
- Generated: Yes
- Committed: No (ignored by `.gitignore`)

---

*Structure analysis: 2026-04-17*
