#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

function fail(message, details = []) {
  console.error(`❌ app-boundary: ${message}`);
  for (const d of details.slice(0, 25)) console.error(` - ${d}`);
  if (details.length > 25) {
    console.error(` - …and ${details.length - 25} more`);
  }
  process.exit(1);
}

async function readUtf8(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (e) {
    fail('failed to read source file', [
      `path=${filePath}`,
      `error=${e?.code || e?.message || String(e)}`,
    ]);
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function isProbablyText(s) {
  // Very small heuristic: if it contains any NUL bytes when read as utf8, treat as non-text.
  return !s.includes('\u0000');
}

function normalizeSlashes(p) {
  return p.replaceAll('\\', '/');
}

function stripExt(p) {
  return p.replace(/\.(ts|tsx|js|jsx)$/, '');
}

function extractImports(sourceText) {
  // Covers:
  //   import X from 'y'
  //   import {X} from "y"
  //   import 'y'
  //   export * from 'y'
  const results = [];
  const re = /(?:^|\n)\s*(?:import|export)\s+(?:[^\n]*?\s+from\s+)?["']([^"']+)["']/g;
  let match;
  while ((match = re.exec(sourceText))) {
    results.push(match[1]);
  }
  return results;
}

function isUnderDir(filePath, dirPath) {
  const rel = path.relative(dirPath, filePath);
  return !!rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

async function listFilesRecursive(rootDir, exts) {
  const out = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      // Keep scan bounded and predictable.
      if (ent.name === 'node_modules' || ent.name === '.next') continue;
      if (ent.name.startsWith('.')) continue;

      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        await walk(full);
      } else {
        const ext = path.extname(ent.name);
        if (exts.has(ext)) out.push(full);
      }
    }
  }
  if (await fileExists(rootDir)) {
    await walk(rootDir);
  }
  return out;
}

function toRepoRel(repoRoot, absPath) {
  return normalizeSlashes(path.relative(repoRoot, absPath));
}

function classifyViolation({ ruleId, fileRel, importPath }) {
  return `${ruleId}: file=${fileRel} import=${importPath}`;
}

function isNextOrReactImport(spec) {
  return spec === 'react' || spec.startsWith('react/') || spec.startsWith('next/');
}

function isForbiddenSiteImport(importSpec) {
  // Direct component/lib imports.
  if (
    importSpec === '@/components/SiteHeader' ||
    importSpec === '@/components/SiteFooter' ||
    importSpec === '@/lib/site' ||
    importSpec === 'src/lib/site' ||
    importSpec.endsWith('/src/lib/site')
  ) {
    return true;
  }

  // Any alias/path that refers to marketing routes under src/app/** (excluding src/app/app/**).
  // We treat these as forbidden because app code should not import public-site route modules.
  // Note: app route modules should be used via navigation, not imports.
  if (importSpec.startsWith('@/app/')) {
    if (!importSpec.startsWith('@/app/app/')) return true;
  }

  return false;
}

async function main() {
  const repoRoot = process.cwd();
  const srcRoot = path.join(repoRoot, 'src');

  const scanDirs = [
    path.join(srcRoot, 'app'),
    path.join(srcRoot, 'components'),
    path.join(srcRoot, 'lib', 'pwa'),
  ];

  const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);

  const appRouteDir = path.join(srcRoot, 'app', 'app');
  const pwaComponentsDir = path.join(srcRoot, 'components', 'pwa');

  const portableDomainFiles = [
    path.join(srcRoot, 'lib', 'pwa', 'schema.ts'),
    path.join(srcRoot, 'lib', 'pwa', 'calculations.ts'),
    path.join(srcRoot, 'lib', 'pwa', 'cycle.ts'),
    path.join(srcRoot, 'lib', 'pwa', 'recovery.ts'),
    path.join(srcRoot, 'lib', 'pwa', 'recommendations.ts'),
  ];

  const files = [];
  for (const dir of scanDirs) {
    for (const f of await listFilesRecursive(dir, exts)) files.push(f);
  }

  const violations = [];

  for (const absPath of files) {
    const fileRel = toRepoRel(repoRoot, absPath);
    const text = await readUtf8(absPath);
    if (!isProbablyText(text)) {
      violations.push(
        classifyViolation({
          ruleId: 'readable-text-required',
          fileRel,
          importPath: '(non-text source)',
        }),
      );
      continue;
    }

    const imports = extractImports(text);

    const isAppSurfaceFile =
      isUnderDir(absPath, appRouteDir) || isUnderDir(absPath, pwaComponentsDir);

    if (isAppSurfaceFile) {
      for (const imp of imports) {
        if (isForbiddenSiteImport(imp)) {
          violations.push(
            classifyViolation({
              ruleId: 'app-no-site-imports',
              fileRel,
              importPath: imp,
            }),
          );
        }
      }
    }

    // portable-domain subset
    if (portableDomainFiles.includes(absPath)) {
      for (const imp of imports) {
        if (isNextOrReactImport(imp)) {
          violations.push(
            classifyViolation({
              ruleId: 'portable-no-react-next',
              fileRel,
              importPath: imp,
            }),
          );
        }
      }
    }

    // Optional extra: prevent relative imports to marketing routes.
    // Heuristic: importing from "../.." that resolves into src/app (excluding app/app).
    // We intentionally keep this conservative to avoid false positives.
    if (isAppSurfaceFile) {
      for (const imp of imports) {
        if (imp.startsWith('.')) {
          const resolved = path.resolve(path.dirname(absPath), imp);
          const normalized = stripExt(resolved);
          // Only check if it resolves to a file under src/app (not src/app/app)
          if (
            isUnderDir(normalized, path.join(srcRoot, 'app')) &&
            !isUnderDir(normalized, appRouteDir)
          ) {
            violations.push(
              classifyViolation({
                ruleId: 'app-no-site-imports',
                fileRel,
                importPath: imp,
              }),
            );
          }
        }
      }
    }
  }

  if (violations.length) {
    fail('boundary violations found', violations);
  }

  console.log('✅ app-boundary: no violations');
}

main().catch((e) => {
  fail('unexpected error while verifying app boundary', [e?.message || String(e)]);
});
