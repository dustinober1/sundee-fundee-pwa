# Architecture

**Analysis Date:** 2026-04-17

## Pattern Overview

**Overall:** Next.js App Router monolith with a server-first, layered architecture

**Key Characteristics:**
- Server Components render all authenticated pages — no client-side data fetching for page loads
- Mutations flow through Next.js Server Actions (`"use server"`), not a REST API layer
- Supabase handles all persistence and auth; the app layer is a thin orchestration shell
- Domain logic (scoring algorithms, adaptation rules) lives in pure TypeScript modules in `src/lib/domain/` — fully decoupled from the framework
- Client Components are limited to interactive forms and the service-worker registration bootstrap

## Layers

**Middleware (Route Guard):**
- Purpose: Refresh the Supabase session cookie on every request; redirect unauthenticated users to `/login`
- Location: `src/proxy.ts` (exported as Next.js middleware via `config.matcher`)
- Contains: `updateSupabaseSession` call, public-route allowlist, post-auth redirect to `/dashboard`
- Depends on: `src/lib/supabase/proxy.ts`
- Used by: Next.js runtime on every non-static request

**Data Access Layer (DAL):**
- Purpose: Centralise auth checks and profile fetches; provide typed guard helpers for page-level auth
- Location: `src/lib/supabase/dal.ts`
- Contains: `getSessionUser`, `requireUser`, `getUserProfile`, `requireOnboardedProfile`
- Depends on: `src/lib/supabase/server.ts`
- Used by: Server Components and Server Actions

**Feature Queries:**
- Purpose: Typed, cached read queries per domain entity
- Location: `src/features/<feature>/queries.ts` (e.g. `src/features/workouts/queries.ts`)
- Contains: `cache()`-wrapped async functions that call the Supabase server client directly; row types defined inline
- Depends on: `src/lib/supabase/server.ts`
- Used by: Page Server Components

**Server Actions:**
- Purpose: Form mutations (create, update, delete) with Zod validation and `revalidatePath`
- Location: `src/app/<route>/actions.ts` (e.g. `src/app/workouts/actions.ts`)
- Contains: `"use server"` functions that validate via Zod, call the Supabase server client, then revalidate or redirect
- Depends on: `src/lib/supabase/dal.ts`, `src/lib/supabase/server.ts`, `zod`
- Used by: Client Components via form `action` prop or `useActionState`

**Domain Logic:**
- Purpose: Pure, framework-agnostic business logic ported from Swift implementations
- Location: `src/lib/domain/` (e.g. `recoveryScore.ts`, `adaptation.ts`, `cyclePhase.ts`, `oneRepMax.ts`, `benchmarks.ts`, `challenges.ts`)
- Contains: Scoring algorithms, contraindication rules, load-multiplier tables, formula helpers
- Depends on: Nothing (no imports from framework or Supabase)
- Used by: Feature queries and Server Components

**Supabase Client Wrappers:**
- Purpose: Provide correctly-scoped Supabase clients for each execution context
- Location: `src/lib/supabase/server.ts` (RSC + Server Actions), `src/lib/supabase/browser.ts` (Client Components), `src/lib/supabase/proxy.ts` (Middleware)
- Contains: Cookie-aware `createServerClient` and `createBrowserClient` factory functions
- Depends on: `@supabase/ssr`
- Used by: All layers that need database or auth access

**Page Server Components:**
- Purpose: Fetch data, enforce auth gates, render HTML
- Location: `src/app/<route>/page.tsx`
- Contains: `async` default exports that call DAL guards then feature queries; render layout + Client Component forms
- Depends on: `src/lib/supabase/dal.ts`, `src/features/<feature>/queries.ts`, `src/lib/domain/`
- Used by: Next.js App Router

**Client Components:**
- Purpose: Interactive forms and optimistic UI; browser-only side-effects (service worker)
- Location: `src/app/<route>/<Name>Form.tsx`, `src/components/ServiceWorkerRegister.tsx`
- Contains: `"use client"` components using `useActionState` / `useTransition`, Supabase browser client for OAuth flows
- Depends on: `src/lib/supabase/browser.ts` (auth only), Server Actions for mutations
- Used by: Page Server Components (rendered as leaf nodes)

## Data Flow

**Authenticated Page Render:**

1. Request hits middleware in `src/proxy.ts` — session cookie is refreshed via `updateSupabaseSession`
2. If no user and route is protected, redirect to `/login?next=<path>`
3. Page Server Component calls `requireUser()` or `requireOnboardedProfile()` from `src/lib/supabase/dal.ts`
4. Server Component calls feature query (e.g. `listWorkouts()` in `src/features/workouts/queries.ts`)
5. Feature query calls `createSupabaseServerClient()` and fetches rows; returns typed objects
6. Server Component optionally passes data through domain logic (e.g. `calculateRecoveryScore()`)
7. HTML is streamed to the client; Client Component islands hydrate interactivity

**Mutation (Server Action):**

1. User submits form; Client Component calls Server Action via `action` prop or `startTransition`
2. Server Action (`src/app/<route>/actions.ts`) calls `requireUser()` to authenticate
3. Input validated with `zod` `safeParse`; errors returned as `{ errors: Record<string, string[]> }`
4. Validated data written to Supabase via `createSupabaseServerClient()`
5. `revalidatePath()` clears Next.js page cache; `redirect()` navigates on success

**Auth Flow:**

1. `LoginForm` (`src/app/login/LoginForm.tsx`) calls Supabase browser client directly for OAuth (`signInWithOAuth`) or OTP (`signInWithOtp`) or password (`signInWithPassword`)
2. OAuth and OTP redirect to `/auth/callback?code=<code>&next=<path>`
3. Callback route handler (`src/app/auth/callback/route.ts`) calls `supabase.auth.exchangeCodeForSession(code)`
4. On success, redirects to `next` (defaults to `/dashboard`)
5. Middleware refreshes session on all subsequent requests via `updateSupabaseSession` in `src/lib/supabase/proxy.ts`
6. New users land on `/onboarding`; `requireOnboardedProfile()` enforces `onboarded_at` is set before granting access to app pages

**State Management:**
- No global client state store. All persistent state lives in Supabase.
- In-flight form state (errors, pending) managed locally with React `useActionState` / `useTransition`
- Page data is server-rendered on each navigation; React cache (`cache()`) deduplicates repeat queries within a single request

## Key Abstractions

**`requireOnboardedProfile()`:**
- Purpose: Combined auth + onboarding gate; the standard guard for all app pages
- Examples: `src/app/dashboard/page.tsx`, `src/app/workouts/page.tsx`, `src/app/analytics/page.tsx`
- Pattern: Call at the top of every protected page Server Component before any data fetch

**Feature Query Files:**
- Purpose: One `queries.ts` per domain entity with `cache()`-wrapped server-only read functions
- Examples: `src/features/workouts/queries.ts`, `src/features/analytics/queries.ts`
- Pattern: Mark `"server-only"` at top; wrap each export in `cache()`; define row types inline

**Server Actions:**
- Purpose: One `actions.ts` per route with `"use server"` mutations
- Examples: `src/app/workouts/actions.ts`, `src/app/onboarding/actions.ts`
- Pattern: `requireUser()` first, then Zod validation, then Supabase write, then `revalidatePath` / `redirect`

**Domain Modules:**
- Purpose: Pure scoring/calculation logic isolated from framework
- Examples: `src/lib/domain/recoveryScore.ts`, `src/lib/domain/adaptation.ts`, `src/lib/domain/oneRepMax.ts`
- Pattern: No imports from Next.js or Supabase; all exported functions are synchronous and unit-tested

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Font loading, global CSS, `<ServiceWorkerRegister>` mount, PWA metadata

**Landing Page:**
- Location: `src/app/page.tsx`
- Triggers: Unauthenticated visit to `/`
- Responsibilities: Marketing content; authenticated users are redirected to `/dashboard` by middleware

**Dashboard:**
- Location: `src/app/dashboard/page.tsx`
- Triggers: Authenticated visit post-onboarding
- Responsibilities: Today's recovery score, weekly workout count, nav cards to all sections

**Auth Callback:**
- Location: `src/app/auth/callback/route.ts`
- Triggers: OAuth / magic-link redirect from Supabase
- Responsibilities: Exchange code for session, redirect to `next` or `/dashboard`

**Middleware:**
- Location: `src/proxy.ts`
- Triggers: Every non-static request (matched by `config.matcher`)
- Responsibilities: Session refresh, route protection, post-auth redirect

**Export API:**
- Location: `src/app/api/export/route.ts`
- Triggers: `GET /api/export?dataset=<name>`
- Responsibilities: Auth check, fetch dataset from Supabase, stream CSV response

## Error Handling

**Strategy:** Optimistic fail-fast with user-visible error messages; no crash-recovery retry logic

**Patterns:**
- Server Actions return `{ errors: Record<string, string[]> }` on Zod failures; components display field errors inline
- Server Actions return `{ message: string }` on Supabase errors; displayed as a top-level form error
- `src/app/error.tsx` provides a global Next.js error boundary for uncaught exceptions
- `src/app/not-found.tsx` handles 404s
- `src/app/loading.tsx` renders a skeleton during streaming suspense
- DAL functions (`getSessionUser`, `getUserProfile`) return `null` when Supabase is unconfigured, allowing the app to boot without credentials (useful in CI and fresh clones)

## Cross-Cutting Concerns

**Logging:** `console.warn` for service worker registration failures only; no structured logging library
**Validation:** Zod in every Server Action; validated at the boundary before any DB write
**Authentication:** Supabase Auth (cookie-based sessions via `@supabase/ssr`); enforced at middleware + DAL layers
**PWA:** `src/app/manifest.ts` generates `manifest.webmanifest`; `src/components/ServiceWorkerRegister.tsx` registers `/sw.js` in production only

---

*Architecture analysis: 2026-04-17*
