import { describe, expect, test } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'node:fs/promises';

const execFileAsync = promisify(execFile);

async function runVerifier(cwd: string) {
  const scriptPath = path.join(cwd, 'scripts', 'verify-app-boundary.mjs');
  return execFileAsync('node', [scriptPath], {
    cwd,
    env: {
      ...process.env,
      // Keep output deterministic for assertions.
      FORCE_COLOR: '0',
    },
  });
}

describe('app boundary verifier', () => {
  test('current repo passes', async () => {
    const repoRoot = process.cwd();
    await expect(runVerifier(repoRoot)).resolves.toBeTruthy();
  });

  test('rejects app importing public-site chrome from route shell (app-no-site-imports)', async () => {
    const repoRoot = process.cwd();
    const fixtureRoot = await fs.mkdtemp(path.join(repoRoot, '.tmp-app-boundary-'));

    try {
      // Minimal tree for verifier scan.
      await fs.mkdir(path.join(fixtureRoot, 'src', 'app', 'app'), {
        recursive: true,
      });
      await fs.mkdir(path.join(fixtureRoot, 'src', 'components', 'pwa'), {
        recursive: true,
      });
      await fs.mkdir(path.join(fixtureRoot, 'src', 'lib', 'pwa'), { recursive: true });
      await fs.mkdir(path.join(fixtureRoot, 'scripts'), { recursive: true });

      // Copy verifier into fixture so it runs against fixtureRoot.
      const verifierText = await fs.readFile(
        path.join(repoRoot, 'scripts', 'verify-app-boundary.mjs'),
        'utf8',
      );
      await fs.writeFile(
        path.join(fixtureRoot, 'scripts', 'verify-app-boundary.mjs'),
        verifierText,
        'utf8',
      );

      await fs.mkdir(path.join(fixtureRoot, 'src', 'components', 'pwa', 'app-shell'), {
        recursive: true,
      });

      await fs.writeFile(
        path.join(fixtureRoot, 'src', 'components', 'pwa', 'app-shell', 'AppRouteShell.tsx'),
        "import SiteHeader from '@/components/SiteHeader'\nexport function AppRouteShell({children}:{children:any}){return children}\n",
        'utf8',
      );

      const run = runVerifier(fixtureRoot);
      await expect(run).rejects.toMatchObject({
        stderr: expect.stringContaining('app-no-site-imports'),
      });
    } finally {
      await fs.rm(fixtureRoot, { recursive: true, force: true });
    }
  });

  test('rejects portable domain importing react/next (portable-no-react-next)', async () => {
    const repoRoot = process.cwd();
    const fixtureRoot = await fs.mkdtemp(path.join(repoRoot, '.tmp-app-boundary-'));

    try {
      await fs.mkdir(path.join(fixtureRoot, 'src', 'app', 'app'), {
        recursive: true,
      });
      await fs.mkdir(path.join(fixtureRoot, 'src', 'components', 'pwa'), {
        recursive: true,
      });
      await fs.mkdir(path.join(fixtureRoot, 'src', 'lib', 'pwa'), { recursive: true });
      await fs.mkdir(path.join(fixtureRoot, 'scripts'), { recursive: true });

      const verifierText = await fs.readFile(
        path.join(repoRoot, 'scripts', 'verify-app-boundary.mjs'),
        'utf8',
      );
      await fs.writeFile(
        path.join(fixtureRoot, 'scripts', 'verify-app-boundary.mjs'),
        verifierText,
        'utf8',
      );

      await fs.writeFile(
        path.join(fixtureRoot, 'src', 'lib', 'pwa', 'schema.ts'),
        "import React from 'react'\nexport const x = 1\n",
        'utf8',
      );
      // other portable files exist but can be empty.
      await fs.writeFile(
        path.join(fixtureRoot, 'src', 'lib', 'pwa', 'calculations.ts'),
        'export const y = 2\n',
        'utf8',
      );
      await fs.writeFile(
        path.join(fixtureRoot, 'src', 'lib', 'pwa', 'cycle.ts'),
        'export const z = 3\n',
        'utf8',
      );
      await fs.writeFile(
        path.join(fixtureRoot, 'src', 'lib', 'pwa', 'recovery.ts'),
        'export const a = 4\n',
        'utf8',
      );
      await fs.writeFile(
        path.join(fixtureRoot, 'src', 'lib', 'pwa', 'recommendations.ts'),
        'export const b = 5\n',
        'utf8',
      );

      const run = runVerifier(fixtureRoot);
      await expect(run).rejects.toMatchObject({
        stderr: expect.stringContaining('portable-no-react-next'),
      });
    } finally {
      await fs.rm(fixtureRoot, { recursive: true, force: true });
    }
  });
});
