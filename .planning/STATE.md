# State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-17)

**Core value:** A user can log, track, and follow structured training — all in one place that understands her cycle.
**Current milestone:** v1.0 Programs

## Current Position

Phase: 1 — Data Model & Schema
Plan: TBD (roadmap defined, planning not yet started)
Status: Ready to plan Phase 1
Last activity: 2026-04-17 — Roadmap created, 7 phases, 21 requirements mapped

Progress: [-------] 0/7 phases complete

## Performance Metrics

Phases complete: 0/7
Requirements mapped: 21/21
Plans written: 0

## Accumulated Context

### Architecture & Conventions

- Brownfield Next.js 16.2.4 App Router PWA — read `node_modules/next/dist/docs/` before writing any Next.js code (breaking changes from training data)
- Server Components render all authenticated pages; mutations via Server Actions (`"use server"`)
- Feature queries in `src/features/<domain>/queries.ts` (server-only, `cache()`-wrapped)
- Domain logic in `src/lib/domain/` — pure TypeScript, no framework imports
- Auth guards: `requireOnboardedProfile()` at top of every protected page

### Programs Domain State

- `program_templates` table exists with `phases` and `weeks` JSONB columns (currently empty `[]`)
- `enrolled_programs` table tracks `user_id`, `template_id`, `current_week`, `is_active`
- Unique partial index enforces one active program per user at DB level
- `src/features/programs/queries.ts` exists (partial implementation)
- `src/app/programs/` route exists; `enrolled/page.tsx` is a placeholder
- `src/lib/domain/oneRepMax.ts` has Epley/Brzycki estimators — use for %1RM load calculation

### Key Decisions (from PROJECT.md)

- JSONB for program template structure (mirrors iOS source data shape; flexible hierarchy)
- Session logs create real workout entries (unified workout history — program sessions appear alongside regular workouts)
- Admin role via `is_admin` flag on profiles (no complex RBAC)
- One active enrollment per user (enforced at DB level)

### Known Concerns (from CONCERNS.md)

- Open redirect in auth callback
- Missing middleware mount (some routes may be unguarded)
- No server action tests
- No DB-level query aggregation for analytics

## Session Continuity

Next action: Run `/gsd-plan-phase 1` to decompose Phase 1 (Data Model & Schema) into executable plans.

Phase 1 scope reminder: JSONB structure definition for phases/weeks/sessions/exercises, `is_admin` flag + RLS policy on `program_templates`, workout-session linkage column.

---

*State initialized: 2026-04-17 — Roadmap created*
*Last updated: 2026-04-17*
