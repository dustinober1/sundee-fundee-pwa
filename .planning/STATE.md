# State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-17)

**Core value:** A user can log, track, and follow structured training — all in one place that understands her cycle.
**Current milestone:** v1.0 Programs

## Current Position

Phase: 1 — Data Model & Schema
Plan: 1/2 complete (Wave 1: migration file done; Wave 2: push + verify next)
Status: Executing Phase 1
Last activity: 2026-04-18 — Plan 01-01 complete (migration 0005_programs_schema.sql written)

Progress: [-------] 0/7 phases complete (Phase 1 in progress: 1/2 plans done)

## Performance Metrics

Phases complete: 0/7
Requirements mapped: 21/21
Plans written: 2
Plans executed: 1 (01-01: migration write, ~1 min)

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

Next action: Execute Phase 1, Plan 02 (01-02-PLAN.md) — push migration 0005_programs_schema.sql to Supabase and verify schema changes are live.

Phase 1 context locked:
- phases = [{name, start_week, end_week}], weeks = [{week_num, sessions: [{label, exercises: [{exercise_id, sets, reps, pct_1rm: decimal}]}]}]
- is_admin boolean on user_profiles; admin write RLS via subquery on user_profiles
- enrolled_program_sessions table (minimal) with UNIQUE(enrollment_id, week_num, session_index) and session_workout_id FK to workouts
- jsonb_typeof check constraints on phases + weeks columns

### Decisions from 01-01

- is_admin stored as DB column on user_profiles, not JWT claim — cannot be self-granted client-side
- Admin write RLS uses direct subquery on user_profiles.is_admin; no helper function (D-07)
- program_templates_select_all policy preserved — templates are public catalog data (D-08)
- session_workout_id FK uses on delete set null so deleting a workout does not cascade-delete session records (D-09)
- Unique constraint (enrollment_id, week_num, session_index) inline on table definition; Phase 6 can upsert on conflict (D-10)
- updated_at trigger applied to enrolled_program_sessions following existing table conventions

---

*State initialized: 2026-04-17 — Roadmap created*
*Last updated: 2026-04-18 — 01-01 complete (migration 0005_programs_schema.sql written)*
