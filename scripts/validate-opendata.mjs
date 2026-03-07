#!/usr/bin/env node
/**
 * Quality gate: validate open data catalog (INDA/DCAT compliance)
 * Usage: node scripts/validate-opendata.mjs
 *
 * Validates:
 *   - public/dados-abertos/catalog.json is valid JSON
 *   - Required DCAT fields are present
 *   - Each dataset has required metadata (title, description, issued, modified, publisher, distribution, license)
 *   - Distribution entries have required fields (mediaType, accessURL)
 *   - Dates are ISO 8601 format
 */

import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');

let errors = 0;
let warnings = 0;

function error(msg) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  ⚠ ${msg}`);
  warnings++;
}

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

// ── 1. Load and parse catalog.json ──────────────────────────────────────────

console.log('\n[qg:opendata] Validating public/dados-abertos/catalog.json...\n');

const catalogPath = resolve(root, 'public', 'dados-abertos', 'catalog.json');
let catalog;

try {
  const raw = readFileSync(catalogPath, 'utf8');
  catalog = JSON.parse(raw);
  ok('catalog.json is valid JSON');
} catch (err) {
  error(`Cannot parse catalog.json: ${err.message}`);
  process.exit(1);
}

// ── 2. Check top-level DCAT fields ──────────────────────────────────────────

const requiredTopLevel = ['@context', '@type', 'conformsTo', 'dataset'];
for (const field of requiredTopLevel) {
  if (!catalog[field]) {
    error(`Missing required top-level field: ${field}`);
  } else {
    ok(`Top-level field "${field}" present`);
  }
}

if (catalog['@type'] !== 'dcat:Catalog') {
  error(`@type must be "dcat:Catalog", got: ${catalog['@type']}`);
} else {
  ok('@type is "dcat:Catalog"');
}

if (!Array.isArray(catalog.dataset) || catalog.dataset.length === 0) {
  error('catalog.dataset must be a non-empty array');
} else {
  ok(`catalog.dataset has ${catalog.dataset.length} dataset(s)`);
}

// ── 3. Validate each dataset ─────────────────────────────────────────────────

const requiredDatasetFields = [
  'title', 'description', 'issued', 'modified', 'publisher', 'distribution', 'license'
];

const isoDatePattern = /^\d{4}-\d{2}-\d{2}(T[\d:.Z+-]+)?$/;

for (let i = 0; i < (catalog.dataset || []).length; i++) {
  const ds = catalog.dataset[i];
  const prefix = `Dataset[${i}] "${ds.title || '(no title)'}"`;

  console.log(`\n  Checking ${prefix}...`);

  if (ds['@type'] !== 'dcat:Dataset') {
    error(`${prefix}: @type must be "dcat:Dataset", got: ${ds['@type']}`);
  } else {
    ok(`${prefix}: @type is "dcat:Dataset"`);
  }

  for (const field of requiredDatasetFields) {
    if (!ds[field]) {
      error(`${prefix}: Missing required field "${field}"`);
    } else {
      ok(`${prefix}: Field "${field}" present`);
    }
  }

  // Validate date formats
  for (const dateField of ['issued', 'modified']) {
    if (ds[dateField] && !isoDatePattern.test(ds[dateField])) {
      error(`${prefix}: "${dateField}" is not a valid ISO 8601 date: ${ds[dateField]}`);
    }
  }

  // Validate distributions
  if (!Array.isArray(ds.distribution) || ds.distribution.length === 0) {
    error(`${prefix}: distribution must be a non-empty array`);
  } else {
    for (let j = 0; j < ds.distribution.length; j++) {
      const dist = ds.distribution[j];
      const distPrefix = `${prefix} Distribution[${j}]`;

      if (!dist.mediaType) {
        error(`${distPrefix}: Missing "mediaType"`);
      } else {
        ok(`${distPrefix}: mediaType is "${dist.mediaType}"`);
      }

      if (!dist.accessURL) {
        error(`${distPrefix}: Missing "accessURL"`);
      } else {
        if (!dist.accessURL.startsWith('http')) {
          warn(`${distPrefix}: accessURL should be an absolute URL: ${dist.accessURL}`);
        } else {
          ok(`${distPrefix}: accessURL is "${dist.accessURL}"`);
        }
      }
    }
  }

  // Publisher name check
  if (ds.publisher && !ds.publisher.name) {
    warn(`${prefix}: publisher.name is recommended`);
  }

  // License check
  if (ds.license && !ds.license.startsWith('http')) {
    warn(`${prefix}: license should be a URI, got: ${ds.license}`);
  }
}

// ── 4. Summary ───────────────────────────────────────────────────────────────

console.log(`\n[qg:opendata] Summary: ${errors} error(s), ${warnings} warning(s)\n`);

if (errors > 0) {
  console.error(`[qg:opendata] FAILED — ${errors} error(s) found. Fix them and re-run.\n`);
  process.exit(1);
} else {
  console.log(`[qg:opendata] PASSED — catalog.json is valid and INDA-compliant.\n`);
}
