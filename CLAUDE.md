# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

**Sundee Fundee PWA** — a recovery-aware strength training PWA, ported from an iOS app. Built with Next.js App Router, React 19, TypeScript, Supabase (Postgres + Auth), and Tailwind v4. Target host: Cloudflare Pages.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # Type-check without emitting

# Tests
npx vitest run                     # All unit tests (56 passing)
npx vitest run src/lib/domain      # Domain logic tests only
npx vitest run --watch             # Watch mode
npx playwright test                # E2E (builds + starts prod server first)

# Local Supabase
npx supabase start                 # Spin up local Postgres + Studio
npx supabase db reset              # Apply all migrations + seeds
npx supabase db push --local       # Push schema changes to local
docker exec -it supabase_db_sundee-fundee-pwa psql -U postgres  # Direct DB access
```

## Architecture

### Routing & Pages (`src/app/`)

App Router with 16 feature areas: `/dashboard`, `/workouts`, `/maxes`, `/programs`, `/benchmarks`, `/challenges`, `/recovery`, `/pain`, `/cycle`, `/injuries`, `/analytics`, `/insights/export`, `/admin`, `/onboarding`, `/blog`, `/login`.

**Route protection tiers** (enforced in server components, not just middleware):
- `requireUser()` — must be authenticated
- `requireOnboardedProfile()` — must have completed onboarding
- `requireAdmin()` — must have `is_admin = true`

**Middleware** (`src/proxy.ts`) — refreshes Supabase session on every request; redirects unauthenticated users on gated routes to `/login`.

### Data Layer

**Feature-scoped queries** (`src/features/<feature>/queries.ts`) — server-only, wrapped in `cache()` for per-request deduplication. Each feature owns its query surface.

**Server Actions** (`src/app/<route>/actions.ts`) — Zod-validated FormData mutations. Pattern: parse with `safeParse`, return `{ errors }` on failure, `revalidatePath` + redirect on success.

**Supabase clients:**
- `createSupabaseBrowserClient()` — browser, anon key
- `createSupabaseServerClient()` — server, cookie-based session
- DAL (`src/lib/supabase/dal.ts`) — `getSessionUser()`, `requireUser()`, `requireOnboardedProfile()`, `requireAdmin()`

### Domain Logic (`src/lib/domain/`)

Pure TypeScript ports of Swift domain logic. Each file has a co-located `.test.ts`. Key modules:
- `oneRepMax.ts` — Epley formula
- `recoveryScore.ts` — HRV/sleep/pain composite scoring
- `cyclePhase.ts` — Menstrual phase tracking
- `adaptation.ts` — Injury phase adaptation engine
- `challenges.ts` — Volume tier progression

These are pure functions with no I/O — safe to unit test in isolation.

### Database

7 migrations in `supabase/migrations/` (0001–0007). Seed data: 92 exercises, 31 WODs, 7 program templates. Key tables: `user_profiles`, `workouts`, `workout_exercises`, `workout_sets`, `maxes`, `recovery_logs`, `pain_logs`, `cycle_logs`, `programs`, `benchmarks`, `challenges`, `equipment_profiles`.

**MCP server** (`.mcp.json`) points at the cloud Supabase project — use `mcp__supabase__*` tools for cloud, `docker exec` or `npx supabase` CLI for local.

### Auth

Multi-provider OAuth: Apple, Google, Facebook, email magic-link. Flow: `/login` → provider → `/auth/callback?code=...` → session set → redirect to `/dashboard`. Session lives in secure httpOnly cookies managed by `@supabase/ssr`.

### PWA

`app/manifest.ts` generates `/manifest.webmanifest`. `public/sw.js` is the service worker (production only). `ServiceWorkerRegister` component handles registration.

## Key Patterns

**Form handling:** Pages use a server component for data + a client `*Form` component with `useActionState`. No explicit fetch/axios.

**Type aliases:** `@/` maps to `src/`. Use throughout — avoid relative paths crossing feature boundaries.

**Tailwind v4:** CSS-native config; colors are CSS variables in `globals.css`, not a `tailwind.config.ts`.

**`server-only` package:** Imported at the top of server-only modules. Vitest stubs it — tests can import these files safely.

**Graceful degradation:** App boots without Supabase env vars. Public routes render; DB-touching routes redirect.

## Security

**Never commit secrets.** Environment variables, API keys, tokens, and credentials must never be committed to git.

**Secrets setup:**
- Copy `.env.example` to `.env.local` and fill in your credentials
- `.env*` is in `.gitignore` — local env files are safe
- Use `NEXT_PUBLIC_*` prefix only for values that can be public (anon Supabase key)
- Server-only secrets (service role keys, JWT secrets) go unprefixed

**Pre-commit secret scanning:** Gitleaks runs on every commit (via pre-commit hooks). If a secret is detected, fix it before committing. If you accidentally commit a secret:
1. Immediately rotate the credential in its source system
2. Use `git filter-branch` or `git filter-repo` to remove it from history
3. Force-push the cleaned history to the remote

**Testing with secrets:** Use `.env.local` (git-ignored) for test credentials. Never hardcode real tokens in test files or comments.
