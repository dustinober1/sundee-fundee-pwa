// Empty stub so vitest can resolve `import "server-only"` statements.
// Next.js's `server-only` package throws at build time if imported from a
// Client Component; under Vitest there is no such boundary, so the import
// just needs to resolve to something harmless.
export {};
