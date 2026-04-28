# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [2026-04-28]

### Added
- Added app/site boundary verification via `scripts/verify-app-boundary.mjs`.
- Added parity-ledger verification via `scripts/verify-parity-ledger.mjs`.
- Added Playwright coverage for the `/app` local-only replacement path.
- Added parity and architecture documentation for replacement parity, local-only data boundaries, app-shell boundaries, and private testing launchability.
- Added `vitest.config.ts` so `npm test` runs only Vitest unit suites under `src/**` and excludes Playwright/debug specs.

### Changed
- Merged milestone PWA parity and app-shell work into `main`.
- Refactored the training lifestyle gallery to use `next/image`.
- Memoized `refreshLocalState` in `src/components/pwa/AppExperience.tsx` and aligned effect dependencies.

### Fixed
- Fixed `npm test` so Vitest no longer attempts to run Playwright specs or `.tmp` repro files.
- Removed unused imports in local DB/repository modules to restore a clean lint baseline.

### Verification
- `npm test` ✅
- `npm run lint` ✅
- `npm run typecheck` ✅
- `npm run test:e2e` ✅
- `npm run build` ✅
