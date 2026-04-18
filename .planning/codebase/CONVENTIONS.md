# Coding Conventions

**Analysis Date:** 2026-04-17

## Naming Patterns

**Files:**
- Page files: `page.tsx` (Next.js App Router convention — always lowercase)
- Layout files: `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- Server action files: `actions.ts` (co-located in the route directory, always plural)
- Feature query files: `queries.ts` (one per feature in `src/features/<feature>/`)
- Client components: PascalCase filename matching export name — `LoginForm.tsx`, `NewWorkoutForm.tsx`, `ServiceWorkerRegister.tsx`
- Domain logic files: camelCase matching the concept — `oneRepMax.ts`, `recoveryScore.ts`, `cyclePhase.ts`
- Test files: co-located, named `<module>.test.ts` — `oneRepMax.test.ts`, `benchmarks.test.ts`

**Functions:**
- Page/layout components: PascalCase, default export — `DashboardPage`, `WorkoutsPage`, `RootLayout`
- Client components: PascalCase named export — `export function LoginForm(...)`, `export function NewWorkoutForm(...)`
- Utility/helper functions in pages: camelCase, file-private — `recommendationColor`, `formatDate`, `thisWeekWorkoutCount`
- Domain functions: camelCase, named exports — `estimatedOneRepMax`, `calculateRecoveryScore`, `advanceTier`
- Server actions: camelCase, named exports — `createWorkout`, `addExerciseToWorkout`, `deleteSet`
- Query functions: camelCase, named exports — `listWorkouts`, `getWorkout`, `getTodayRecoveryScore`

**Variables:**
- camelCase throughout — `weekCount`, `performed_on` (exception: Supabase column names keep snake_case)
- `SCREAMING_SNAKE_CASE` for module-level constants — `PROVIDERS`, `CONTRAINDICATION_RULES`, `LOAD_MULTIPLIER`, `REGRESSION_TABLE`
- React state variables: descriptive names — `[status, setStatus]`, `[pending, startTransition]`

**Types:**
- Interfaces for row/data shapes: PascalCase + suffix — `UserProfileRow`, `WorkoutListRow`, `WorkoutDetail`, `WorkoutExercise`
- Type aliases for domain unions: PascalCase — `WeightUnit`, `ExperienceLevel`, `RecoveryPhase`, `BenchmarkScoring`
- Discriminated unions inline: `type Status = { kind: "idle" } | { kind: "sent" } | { kind: "error"; message: string }`
- Generic `type Params = Promise<{ id: string }>` for async dynamic params (Next.js 15+ pattern)

## Code Style

**Formatting:**
- Prettier (inferred from ESLint config + project consistency); no `.prettierrc` present — uses defaults
- 2-space indentation throughout
- Double quotes for JSX string props, template literals for interpolation
- Trailing commas in multiline

**Linting:**
- ESLint v9 flat config (`eslint.config.mjs`)
- Extends `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- Ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`
- No custom rule overrides — uses Next.js defaults

**TypeScript:**
- `strict: true` in `tsconfig.json`
- No `any` in observed production code — unknown shapes narrowed via `type Raw = ...` local aliases
- Non-null assertion (`!`) used only for Supabase env vars that are guaranteed present
- `satisfies` not observed; `as` casts used sparingly for Supabase response narrowing
- `isolatedModules: true` — every file must be a module

## Import Organization

**Order (observed pattern):**
1. Framework imports — `import "server-only"`, `import { cache } from "react"`
2. Next.js imports — `import Link from "next/link"`, `import { redirect } from "next/navigation"`
3. Internal path-alias imports `@/` — ordered lib → features → components
4. Relative imports — `import { createWorkout } from "../actions"`

**Path Aliases:**
- `@/*` maps to `./src/*` — use for all cross-directory imports
- Relative imports only within the same route segment (e.g., `../actions` from a sub-page)

**Side-effect imports:**
- `import "server-only"` at top of every server-only module (DAL, feature queries, server client)

## Server vs Client Component Patterns

**Default: Server Component**
- All `page.tsx` files are async Server Components — no `"use client"` directive
- They call `requireOnboardedProfile()` or `requireUser()` directly for auth gating
- They call feature query functions and pass data down as props

**Client Components: explicit opt-in with `"use client"`**
- Used only when browser APIs, state, or event handlers are needed
- `LoginForm.tsx` — OAuth + magic link handlers using `useTransition`
- `NewWorkoutForm.tsx` — `useActionState` form with server action binding
- `error.tsx` — `"use client"` required by Next.js error boundary convention
- `ServiceWorkerRegister.tsx` — `useEffect` for SW registration

**Pattern for Client Form Components with Server Actions:**
```typescript
// In actions.ts
"use server";
export type CreateWorkoutState = { errors?: Record<string, string[]>; message?: string };
export async function createWorkout(_prev: CreateWorkoutState | undefined, formData: FormData): Promise<CreateWorkoutState> { ... }

// In ClientForm.tsx
"use client";
import { useActionState } from "react";
import { createWorkout, type CreateWorkoutState } from "../actions";

export function NewWorkoutForm() {
  const [state, action, pending] = useActionState<CreateWorkoutState | undefined, FormData>(createWorkout, undefined);
  return <form action={action}>...</form>;
}
```

**Pattern for Server Actions without state (progressive enhancement):**
```typescript
// In page.tsx — forms use action directly, no client component needed
<form action={deleteWorkout}>
  <input type="hidden" name="id" value={workout.id} />
  <button type="submit">Delete workout</button>
</form>
```

## Data Fetching Patterns

**Server-side queries:**
- All feature queries live in `src/features/<feature>/queries.ts` and are `server-only`
- Cacheable, side-effect-free reads use `cache()` from React — `export const listWorkouts = cache(async () => { ... })`
- Non-cacheable or parameterized reads are plain `async function` — `export async function getWorkout(id: string): Promise<WorkoutDetail | null>`
- Parallel fetches in pages use `Promise.all`: `const [workout, exercises] = await Promise.all([getWorkout(id), listExercises()])`

**Supabase query style:**
- Always destructure only `{ data }` (errors silently fall back to empty/null)
- Use `.maybeSingle()` for 0-or-1 results (returns `null` instead of throwing)
- Use `.single()` only for guaranteed-unique inserts (e.g., insert + `.select("id").single()`)
- Type narrowing via local `type Raw = ...` aliases cast with `as Raw`

**Auth gating pattern (server):**
```typescript
// Hard gate — redirects to /login if unauthenticated
export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}
// Full gate — redirects to /onboarding if not onboarded
export async function requireOnboardedProfile() {
  const user = await requireUser();
  const profile = await getUserProfile();
  if (!profile || !profile.onboarded_at) redirect("/onboarding");
  return { user, profile };
}
```

## Error Handling

**Server actions — validation errors:**
- Use Zod schemas with `.safeParse()`, return `{ errors: z.flattenError(parsed.error).fieldErrors }` on failure
- Return `{ message: error?.message ?? "Fallback message" }` for DB/runtime errors
- Never throw from Server Actions — always return error state

**Server actions — auth:**
- Call `requireUser()` at the top; it redirects internally so no explicit error needed
- Ownership check: query the resource and return early if `user_id !== user.id`

**Page-level errors:**
- Use `notFound()` from `next/navigation` when a resource is missing (`if (!workout) notFound()`)
- `src/app/error.tsx` catches route-level errors — logs via `console.error("[app] route error", error)` and shows digest ref
- `src/app/not-found.tsx` handles 404s globally

**Unconfigured Supabase (dev/CI without env vars):**
- `isSupabaseConfigured()` check in DAL — returns `null` gracefully instead of throwing
- Playwright tests skip auth-gated routes when `NEXT_PUBLIC_SUPABASE_URL` is unset

## Logging

**Pattern:** `console.error` for errors, `console.warn` for non-fatal issues.
- `console.error("[app] route error", error)` — in `error.tsx`
- `console.warn("[sw] registration failed", err)` — in `ServiceWorkerRegister.tsx`
- Prefix with `[context]` in brackets for easy filtering
- No structured logging library — raw `console` only

## Comments

**When to Comment:**
- Port/source attribution at top of domain files: `// Port of EpleyCalculator.swift.`
- `//` inline for clarification of non-obvious logic (e.g., formula derivations in tests)
- JSDoc `/** ... */` for exported domain functions with non-obvious parameters
- `// TODO`-style comments absent from domain code — left for implementation gaps only

**Example from `src/lib/supabase/server.ts`:**
```typescript
// Server Components cannot set cookies; the proxy refresh handles it.
```

## Function Design

**Size:** Small, single-responsibility. Domain functions are typically 5–15 lines.

**Parameters:** Prefer plain typed params over option bags; domain functions take primitives.

**Return Values:**
- Return `null` (not `undefined`) for missing data — `Promise<WorkoutDetail | null>`
- Domain calculations return `null` for invalid inputs, never `NaN` or `0` as a sentinel
- Server actions return typed state objects, never throw

## Module Design

**Exports:**
- Feature queries: all exports are named, no default export
- Domain modules: all exports are named, no default export
- Client components: named exports (`export function LoginForm`)
- Page/layout components: default exports only (required by Next.js)

**Barrel Files:** Not used — import directly from the module file.

---

*Convention analysis: 2026-04-17*
