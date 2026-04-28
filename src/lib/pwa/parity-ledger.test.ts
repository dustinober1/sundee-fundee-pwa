import { describe, expect, test } from 'vitest';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const verifierPath = path.join(process.cwd(), 'scripts/verify-parity-ledger.mjs');

function runVerifier(cwd = process.cwd()) {
  return spawnSync(process.execPath, [verifierPath], {
    cwd,
    encoding: 'utf8',
  });
}

function mkTempDir() {
  // Use OS temp dir so we don't create untracked workspace files.
  return fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'parity-ledger-'));
}

describe('parity ledger contract', () => {
  test('verifier passes for the tracked contract ledger', () => {
    const res = runVerifier();

    expect(res.status).toBe(0);
    expect(res.stdout).toContain('contract checks passed');
  });

  test('verifier exits non-zero with actionable error for malformed ledger headers (negative)', () => {
    const tmp = mkTempDir();
    fs.mkdirSync(path.join(tmp, 'docs/parity'), { recursive: true });
    fs.mkdirSync(path.join(tmp, 'scripts'), { recursive: true });

    // Minimal contract-like ledger, but with wrong headers.
    fs.writeFileSync(
      path.join(tmp, 'docs/parity/ios-web-parity-ledger.md'),
      [
        '# iOS → Web Replacement Parity Ledger (Contract)',
        '',
        '## Status vocabulary (must be exact)',
        '',
        '## Ledger',
        '',
        '| bucket | capability | web_status |',
        '|---|---|---|',
        '| Data | X | covered |',
        '',
        '## Highest-risk gaps (required)',
        '',
        '- x',
        '',
        '## Web-impossible / constraint-bound items (required)',
        '',
        '- x',
        '',
        '## Requirements / classification traceability (required)',
        '',
        '- R001',
        '',
      ].join('\n'),
      'utf8',
    );

    // Reuse the real verifier by copying it into the temp workspace.
    fs.copyFileSync(verifierPath, path.join(tmp, 'scripts/verify-parity-ledger.mjs'));

    const res = spawnSync(process.execPath, ['scripts/verify-parity-ledger.mjs'], {
      cwd: tmp,
      encoding: 'utf8',
    });

    expect(res.status).toBe(1);
    expect(res.stderr).toContain('ledger headers must match the contract');
  });

  test('allowed status vocabulary is fixed', () => {
    const ALLOWED = ['covered', 'partial', 'missing', 'deferred', 'web-impossible'];
    expect(new Set(ALLOWED).size).toBe(ALLOWED.length);
    expect(ALLOWED).toContain('covered');
    expect(ALLOWED).toContain('web-impossible');
  });
});
