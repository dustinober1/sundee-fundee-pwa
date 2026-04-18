# State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-17)

**Core value:** A user can log, track, and follow structured training — all in one place that understands her cycle.
**Current milestone:** v1.0 Programs

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-04-17 — Milestone v1.0 started

## Accumulated Context

- Codebase is a brownfield Next.js 16.2.4 App Router PWA with React 19, Tailwind CSS 4, Supabase
- Programs schema exists (`program_templates`, `enrolled_programs`) but `phases`/`weeks` JSONB columns are empty seed arrays
- 1RM maxes stored in `maxes` table; `src/lib/domain/oneRepMax.ts` has Epley/Brzycki estimators
- Known concerns documented in `.planning/codebase/CONCERNS.md` — open redirect, no middleware, no server action tests
- One active enrollment per user enforced by unique partial index at DB layer
