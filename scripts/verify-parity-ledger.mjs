#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const ALLOWED_STATUSES = new Set([
  'covered',
  'partial',
  'missing',
  'deferred',
  'web-impossible',
]);

const REQUIRED_LEDGER_SECTIONS = [
  '## Ledger',
  '## Highest-risk gaps (required)',
  '## Web-impossible / constraint-bound items (required)',
  '## Requirements / classification traceability (required)',
];

function stripCodeTicks(s) {
  return s.replace(/^`+|`+$/g, '').trim();
}

function fail(message, details = []) {
  // Keep output actionable and compact.
  console.error(`❌ parity-ledger: ${message}`);
  for (const d of details.slice(0, 20)) console.error(` - ${d}`);
  if (details.length > 20) console.error(` - …and ${details.length - 20} more`);
  process.exit(1);
}

function parseMarkdownTable(lines, headerLineIndex) {
  // Expects:
  // | h1 | h2 |
  // |---|---|
  // | v1 | v2 |

  const header = lines[headerLineIndex];
  const sep = lines[headerLineIndex + 1];

  if (!header || !sep) {
    return { headers: [], rows: [] };
  }

  const headerCells = header
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());

  const sepOk = /^\|?\s*:?---/.test(sep.trim());
  if (!sepOk) {
    return { headers: headerCells, rows: [], malformedSeparator: true };
  }

  const rows = [];
  for (let i = headerLineIndex + 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) break;
    if (!line.includes('|')) break;

    const cells = line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim());

    rows.push({ lineIndex: i + 1, raw: line, cells });
  }

  return { headers: headerCells, rows };
}

function findLineIndex(lines, needle) {
  return lines.findIndex((l) => l.trim() === needle.trim());
}

async function readIfExists(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (e) {
    if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return null;
    throw e;
  }
}

function verifyLedgerMarkdown(markdown, fileLabel) {
  const lines = markdown.split(/\r?\n/);

  const missingSections = REQUIRED_LEDGER_SECTIONS.filter(
    (s) => !lines.some((l) => l.trim() === s.trim()),
  );
  if (missingSections.length) {
    fail(`${fileLabel} missing required section(s)`, missingSections);
  }

  const ledgerHeaderIndex = findLineIndex(lines, '## Ledger');
  if (ledgerHeaderIndex === -1) {
    fail(`${fileLabel} missing "## Ledger" section`);
  }

  // Find the first table after the Ledger header.
  let tableHeaderIndex = -1;
  for (let i = ledgerHeaderIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith('|')) {
      tableHeaderIndex = i;
      break;
    }
    // stop if another header encountered
    if (/^#{1,6}\s+/.test(line)) break;
  }

  if (tableHeaderIndex === -1) {
    fail(`${fileLabel} missing markdown table under ## Ledger`);
  }

  const { headers, rows, malformedSeparator } = parseMarkdownTable(
    lines,
    tableHeaderIndex,
  );
  if (malformedSeparator) {
    fail(`${fileLabel} ledger table separator row is malformed`, [
      `Expected a markdown separator row (e.g. |---|---|) after header at line ${tableHeaderIndex + 1}`,
    ]);
  }

  const expectedHeaders = [
    'bucket',
    'capability',
    'ios_source',
    'web_status',
    'replacement_path',
    'evidence',
    'risks',
    'notes',
  ];

  if (headers.join('|') !== expectedHeaders.join('|')) {
    fail(`${fileLabel} ledger headers must match the contract`, [
      `Expected: ${expectedHeaders.join(', ')}`,
      `Actual:   ${headers.join(', ')}`,
    ]);
  }

  if (rows.length === 0) {
    fail(`${fileLabel} ledger table has no rows (add at least one starter row)`);
  }

  const statusIdx = expectedHeaders.indexOf('web_status');
  const evidenceIdx = expectedHeaders.indexOf('evidence');

  const problems = [];
  for (const r of rows) {
    if (r.cells.length !== expectedHeaders.length) {
      problems.push(
        `Line ${r.lineIndex}: expected ${expectedHeaders.length} cells, got ${r.cells.length}`,
      );
      continue;
    }

    const status = r.cells[statusIdx];
    if (!ALLOWED_STATUSES.has(status)) {
      problems.push(
        `Line ${r.lineIndex}: invalid web_status "${status}" (allowed: ${[...ALLOWED_STATUSES].join(', ')})`,
      );
    }

    const evidence = stripCodeTicks(r.cells[evidenceIdx]);
    if (!evidence) {
      problems.push(`Line ${r.lineIndex}: missing evidence cell`);
    }
  }

  if (problems.length) {
    fail(`${fileLabel} has malformed ledger rows`, problems);
  }
}

async function main() {
  const repoRoot = process.cwd();
  const ledgerPath = path.join(repoRoot, 'docs/parity/ios-web-parity-ledger.md');
  const webInventoryPath = path.join(
    repoRoot,
    'docs/parity/web-capability-inventory.md',
  );

  const ledger = await readIfExists(ledgerPath);
  if (!ledger) {
    fail('missing docs/parity/ios-web-parity-ledger.md');
  }
  verifyLedgerMarkdown(ledger, 'ios-web-parity-ledger.md');

  const webInventory = await readIfExists(webInventoryPath);
  if (!webInventory) {
    // Optional in T01: print note and continue.
    console.warn(
      '⚠️  parity-ledger: docs/parity/web-capability-inventory.md not found (optional for now)',
    );
  } else {
    // Minimal check: ensure it is not empty so later tasks can extend.
    if (!webInventory.trim()) {
      fail('web-capability-inventory.md exists but is empty');
    }
  }

  console.log('✅ parity-ledger: contract checks passed');
}

main().catch((e) => {
  fail('unexpected error while verifying parity ledger', [e?.message || String(e)]);
});
