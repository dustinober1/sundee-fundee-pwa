# External Integrations

**Analysis Date:** 2026-04-17

## APIs & External Services

**Supabase (primary backend):**
- Purpose: Database, authentication, and row-level security
- SDK: `@supabase/supabase-js` ^2.103.3 + `@supabase/ssr` ^0.10.2
- Auth env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server client: `src/lib/supabase/server.ts` — `createSupabaseServerClient()` (cookie-based, server-only)
- Browser client: `src/lib/supabase/browser.ts` — `createSupabaseBrowserClient()` (client components)
- Middleware/proxy: `src/lib/supabase/proxy.ts` — `updateSupabaseSession()` refreshes session tokens on every request via `src/proxy.ts` (Next.js middleware)
- DAL: `src/lib/supabase/dal.ts` — `getSessionUser()`, `requireUser()`, `getUserProfile()`, `requireOnboardedProfile()`

**Google Fonts:**
- Purpose: Typography
- SDK: `next/font/google` (bundled with Next.js — no separate API key)
- Fonts loaded: Playfair Display, Inter
- Loaded in: `src/app/layout.tsx`

## Data Storage

**Databases:**
- Supabase (PostgreSQL)
  - Connection: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Client: `@supabase/supabase-js` (no additional ORM — raw Supabase query builder)
  - Schema managed via `supabase/migrations/`:
    - `0001_init.sql` — base schema
    - `0002_training.sql` — workouts, exercises, maxes
    - `0003_programs_benchmarks_challenges.sql` — programs, benchmarks, challenges
    - `0004_recovery.sql` — recovery scores, pain logs
  - Type definitions: `src/lib/supabase/types.ts` (hand-maintained row interfaces; full generated types not yet present — see comment in `types.ts` for `supabase gen types` instructions)
  - Key tables used in queries: `user_profiles`, `workouts`, `one_rep_max_records`, `exercises`, `benchmark_results`, `recovery_scores`, `daily_pain_logs`

**File Storage:**
- Local filesystem only (no cloud file storage detected)

**Caching:**
- React `cache()` used in `src/lib/supabase/dal.ts` for `getSessionUser()` and `getUserProfile()` — request-scoped deduplication
- No Redis or external cache layer detected

## Authentication & Identity

**Auth Provider:**
- Supabase Auth
  - OAuth providers configured: Apple, Google, Facebook (via `src/app/login/LoginForm.tsx`)
  - Magic link / OTP (email): `supabase.auth.signInWithOtp()`
  - Password auth: `supabase.auth.signInWithPassword()`
  - OAuth callback handled at: `src/app/auth/callback/route.ts` — exchanges code for session, redirects to `/dashboard` or `?next=` param
  - Sign-out: `src/app/auth/actions.ts` — `signOut()` server action
  - Session refresh: Next.js middleware (`src/proxy.ts`) calls `updateSupabaseSession()` on every non-static request
  - Auth guard: `src/proxy.ts` redirects unauthenticated requests to `/login?next=<path>`
  - Onboarding guard: `requireOnboardedProfile()` in `src/lib/supabase/dal.ts` redirects to `/onboarding` if profile not yet completed

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry, Datadog, or similar SDK present)

**Logs:**
- `console.warn` used in `src/components/ServiceWorkerRegister.tsx` for service worker failures
- No structured logging library detected

## CI/CD & Deployment

**Hosting:**
- Not explicitly configured (no Vercel, Fly, or Railway config detected in project root)
- `public/vercel.svg` present — likely targets Vercel

**CI Pipeline:**
- GitHub Actions: `.github/workflows/ci.yml`
  - Trigger: push/PR to `main`
  - Node version: sourced from `.nvmrc` (Node 22)
  - `verify` job: lint → typecheck → unit tests → build
  - `e2e` job (runs after `verify`): Playwright against built app on Chromium
  - Playwright report uploaded as artifact on every run (14-day retention)

## Data Export

**Built-in Export API:**
- Route: `GET /api/export?dataset=<name>` — `src/app/api/export/route.ts`
- Supported datasets: `workouts`, `maxes`, `benchmarks`, `recovery`, `pain`
- Output: CSV download with `Content-Disposition: attachment`
- Auth: requires authenticated session (returns 401 otherwise)

## Webhooks & Callbacks

**Incoming:**
- `GET /auth/callback` — Supabase OAuth code exchange (`src/app/auth/callback/route.ts`)

**Outgoing:**
- None detected

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project REST URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key

**Optional / graceful degradation:**
- App boots and serves public routes without Supabase env vars configured (checked in `src/proxy.ts` and `src/lib/supabase/dal.ts`)

**Secrets location:**
- `.env` file (not committed); existence confirmed, contents not read
- Both required vars are `NEXT_PUBLIC_` prefixed — they are exposed to the browser bundle intentionally (Supabase anon key is designed for public exposure with RLS)

---

*Integration audit: 2026-04-17*
