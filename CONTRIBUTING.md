# Contributing to Sundee Fundee PWA

Thanks for considering a contribution! Sundee Fundee is AGPL-3.0 licensed and intentionally built to be self-hostable. Contributions of all sizes are welcome — bug reports, exercise database entries, translations, and code.

## Ground rules

- **Be kind.** See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
- **Deterministic over "smart".** This project replaces AI-driven features with deterministic rule-based logic. New features should prefer rule-based scoring, lookup tables, and heuristics over LLM calls.
- **Privacy first.** No third-party analytics, trackers, or telemetry. Do not introduce dependencies that phone home.
- **Self-hostable.** Avoid vendor-locked primitives. If a feature uses a Supabase-specific extension, also document the Postgres-native equivalent.

## Dev setup

```bash
nvm use            # Node version pinned in .nvmrc
npm install
npm run dev        # http://localhost:3000
```

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (no emit) |
| `npm test` | Vitest unit tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright E2E (builds + runs server) |

All four verification commands (`lint`, `typecheck`, `test`, `build`) must pass before merging.

## Making a change

1. Open an issue first for anything non-trivial so we can align on the approach.
2. Fork and create a topic branch (`feat/short-description` or `fix/short-description`).
3. Write tests for new logic (Vitest for unit, Playwright for flows).
4. Keep commits small and focused. Use [Conventional Commits](https://www.conventionalcommits.org/) — e.g. `feat(cycle): add luteal phase adaptation`.
5. Open a PR using the PR template. Link the issue it closes.

## Code style

- TypeScript strict mode is on. No `any` without justification.
- Prefer pure functions in `src/lib/` and `src/domain/` (zero side effects, no React imports).
- UI components go under `src/app/` (route segments) or `src/components/`.
- Keep domain logic isolated from Supabase client calls — the data layer should be the only place that touches Supabase.

## Contributing to the exercise database

The exercise database is seeded from the [Free Exercise DB](https://github.com/yuhonas/free-exercise-db) and extended. To add or correct an exercise:

1. Open an issue using the **Exercise submission** template (added in a later phase).
2. Submissions go through PR review — every entry needs muscle group, equipment, movement pattern, and difficulty tags.

## Reporting security issues

Please do **not** open a public issue for security problems. See [SECURITY.md](./SECURITY.md) for the responsible disclosure process.

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 license that covers the project.
