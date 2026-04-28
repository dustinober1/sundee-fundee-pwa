#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const requiredFiles = [
  "supabase/migrations/20260428000000_pwa_core.sql",
  "src/lib/pwa/database.types.ts",
  "docs/architecture/supabase-readiness.md",
];

const envKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

let failed = false;

function ok(message) {
  console.log(`✅ ${message}`);
}

function warn(message) {
  console.log(`⚠️  ${message}`);
}

function fail(message) {
  console.error(`❌ ${message}`);
  failed = true;
}

function loadDotenvFile(path) {
  if (!existsSync(path)) return {};

  const entries = {};
  const contents = readFileSync(path, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    entries[key] = value;
  }
  return entries;
}

const fileEnv = {
  ...loadDotenvFile(resolve(root, ".env")),
  ...loadDotenvFile(resolve(root, ".env.local")),
};

for (const file of requiredFiles) {
  const path = resolve(root, file);
  if (existsSync(path)) ok(`found ${file}`);
  else fail(`missing ${file}`);
}

const linkedProjectPath = resolve(root, "supabase/.temp/linked-project.json");
if (existsSync(linkedProjectPath)) {
  try {
    const linked = JSON.parse(readFileSync(linkedProjectPath, "utf8"));
    ok(`linked Supabase project ${linked.name} (${linked.ref})`);
  } catch (error) {
    fail(`could not parse supabase/.temp/linked-project.json: ${String(error)}`);
  }
} else {
  warn("no linked Supabase project metadata found at supabase/.temp/linked-project.json");
}

for (const key of envKeys) {
  if (process.env[key] || fileEnv[key]) ok(`${key} is set`);
  else warn(`${key} is not set`);
}

const migrationPath = resolve(root, "supabase/migrations/20260428000000_pwa_core.sql");
if (existsSync(migrationPath)) {
  const sql = readFileSync(migrationPath, "utf8").toLowerCase();
  const policyCount = (sql.match(/create policy/g) ?? []).length;
  const dropPolicyCount = (sql.match(/drop policy/g) ?? []).length;
  if (policyCount > 0 && dropPolicyCount === 0) {
    warn("migration creates RLS policies without explicit drop policy guards; verify replay via `supabase db reset`");
  } else {
    ok("migration includes replay-aware policy handling");
  }
}

if (failed) process.exit(1);
