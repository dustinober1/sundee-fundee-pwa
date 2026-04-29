# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Removed
- Removed the former browser training app surface, offline handling, service
  worker registration, web manifest metadata, auth/sync routes, and related
  verification scripts/tests.

## [2026-04-28]

### Added
- Added `vitest.config.ts` so `npm test` runs only Vitest unit suites under `src/**` and excludes Playwright/debug specs.

### Changed
- Refactored the training lifestyle gallery to use `next/image`.

### Fixed
- Fixed `npm test` so Vitest no longer attempts to run debug specs.

### Verification
- `npm test` ✅
- `npm run lint` ✅
- `npm run typecheck` ✅
- `npm run test:e2e` ✅
- `npm run build` ✅
