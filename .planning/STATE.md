# State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-17)

**Core value:** A user can log, track, and follow structured training — all in one place that understands her cycle.
**Current milestone:** v1.0 Programs — functionally complete; human UAT deferred

## Current Position

Phase: All 7 phases complete (Phases 3–7 completed autonomously on 2026-04-18 with human UAT deferred)
Plan: Milestone v1.0 Programs — all plans executed
Status: Automated gates green; awaiting human UAT sweep before milestone archive
Last activity: 2026-04-18 — Phases 4, 5, 6, 7 executed end-to-end; all commits on main

Progress: [#######] 7/7 phases complete

## Performance Metrics

Phases complete: 7/7
Requirements mapped: 21/21
Plans written: 13 (01-01, 01-02, 02-01, 03-01..04, 04-01..03, 05-01..02, 06-01..02, 07-01..02)
Plans executed: 13

## Accumulated Context

### Architecture & Conventions
- Brownfield Next.js 16.2.4 App Router PWA — breaking changes from training data, consult `node_modules/next/dist/docs/`.
- Server Components render all protected routes; mutations via Server Actions.
- Feature queries in `src/features/<domain>/queries.ts` (server-only, cached).
- Domain logic in `src/lib/domain/` — pure TypeScript.
- Auth guards: `requireOnboardedProfile()` / `requireAdmin()`.

### Programs Domain State
- Full template model in `program_templates` (phases + weeks JSONB).
- Admin builder at `/admin/programs/new` creates templates.
- Users browse `/programs`, view `/programs/[id]` detail, enroll via Server Action.
- Active enrollment shown at `/programs/enrolled` with current phase + week of total + weeks remaining.
- Session detail at `/programs/enrolled/week/[week]/session/[sessionIndex]` renders target weights using stored 1RMs.
- `startProgramSession` creates a workout + workout_exercises + prescribed workout_sets and links via `enrolled_program_sessions`.
- `completeWorkout` propagates completion to the linked program session row.
- Week advance bounded by `duration_weeks`; final-week UI swaps to "Complete program".

### Decisions (key)
- JSONB for phases + weeks (D-01…D-04).
- Admin write RLS via direct subquery on user_profiles.is_admin (D-07).
- `session_workout_id` FK with on-delete-set-null (D-09).
- Unique (enrollment_id, week_num, session_index) enables upsert from startProgramSession (D-10).

### Known Concerns
- Open redirect in auth callback (pre-existing).
- No DB-level aggregation for analytics (v2).
- Tests rely on pure-domain helpers; server actions are not mocked for E2E. Future: add integration tests against local Supabase.

## Session Continuity

Next action: Human UAT sweep for phases 3–7 when the user is ready. After UAT, `gsd-complete-milestone` to archive v1.0 and open v1.1.

## Deferred UAT
- Phase 3: admin builder end-to-end (see `.planning/phases/03-admin-builder-ui/03-04-PLAN.md`)
- Phase 4: browse → detail → enroll → enrolled view
- Phase 5: start session flow; missing-1RM prompt
- Phase 6: start → log sets → complete workflow; DB row in `enrolled_program_sessions`
- Phase 7: advance through weeks; final-week complete; leave program

---

*Last updated: 2026-04-18 — Phases 4, 5, 6, 7 complete (human UAT deferred)*
