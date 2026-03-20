/**
 * validate-decap-config.mjs
 *
 * Pre-build guard that catches three classes of DecapCMS configuration
 * mistakes that cause API_ERROR failures and 255-byte Git ref violations:
 *
 *  1. Content filenames that would produce branch refs > MAX_FILENAME_BYTES
 *  2. Collections missing identifier_field or slug (for mutable collections)
 *  3. Collection names containing spaces (breaks Git ref token construction)
 *
 * Run:  node scripts/validate-decap-config.mjs
 * Exit: 0 = valid, 1 = one or more violations found
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** Max bytes for a content markdown filename (not the full ref path).
 *  Full ref is:  refs/heads/cms/<collection>/<filename>
 *  Prefix costs ~22 bytes ("refs/heads/cms//"), leaving ~233 for slug.
 *  We use 200 as a comfortable hard limit.
 */
const MAX_FILENAME_BYTES = 200;

/** Content directories to check for filename length. */
const CONTENT_DIRS = [
  'src/content/blog',
  'src/content/employees',
  'src/content/services',
  'src/content/testimonials',
  'src/content/featured-blog',
];

/** Collections that can create new entries and therefore affect branch name generation. */
const MUTABLE_COLLECTION_TYPES = ['blog', 'employees', 'testimonials'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let exitCode = 0;

function fail(msg) {
  console.error('  ❌', msg);
  exitCode = 1;
}

function warn(msg) {
  console.warn('  ⚠️ ', msg);
}

function ok(msg) {
  console.log('  ✅', msg);
}

// ---------------------------------------------------------------------------
// Check 1: Filename byte lengths
// ---------------------------------------------------------------------------

console.log('\n[1] Checking content filename lengths...');
let filenameLengthPassed = true;

for (const dir of CONTENT_DIRS) {
  let files;
  try {
    files = readdirSync(dir).filter(f => f.endsWith('.md'));
  } catch {
    continue; // directory may not exist yet
  }
  for (const file of files) {
    const bytes = Buffer.byteLength(file, 'utf8');
    if (bytes > MAX_FILENAME_BYTES) {
      fail(`${dir}/${file}\n      ${bytes} bytes (limit: ${MAX_FILENAME_BYTES})`);
      filenameLengthPassed = false;
    }
  }
}

if (filenameLengthPassed) {
  ok(`All content filenames are within ${MAX_FILENAME_BYTES} bytes`);
}

// ---------------------------------------------------------------------------
// Check 2: Collection config quality
// ---------------------------------------------------------------------------

console.log('\n[2] Checking public/admin/config.yml collection settings...');

let configText;
try {
  configText = readFileSync('public/admin/config.yml', 'utf8');
} catch {
  fail('Could not read public/admin/config.yml');
  process.exit(1);
}

// Simple line-by-line analysis (avoids a yaml parse dependency)
const lines = configText.split('\n');
const collectionNameRe = /^\s{2}-\s+name:\s+"?([^"]+)"?/;
const identifierRe = /^\s+identifier_field:/;
const slugRe = /^\s+slug:/;
const spaceInNameRe = /^\s{2}-\s+name:\s+"[^"]*\s[^"]*"/;

let currentCollection = null;
let hasIdentifier = false;
let hasSlug = false;
let collectionChecks = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const nameMatch = line.match(collectionNameRe);
  if (nameMatch) {
    if (currentCollection) {
      collectionChecks.push({ name: currentCollection, hasIdentifier, hasSlug });
    }
    currentCollection = nameMatch[1];
    hasIdentifier = false;
    hasSlug = false;

    if (spaceInNameRe.test(line)) {
      fail(`Collection "${currentCollection}" contains a space – rename to use hyphens`);
    }
  }
  if (identifierRe.test(line)) hasIdentifier = true;
  if (slugRe.test(line)) hasSlug = true;
}
if (currentCollection) {
  collectionChecks.push({ name: currentCollection, hasIdentifier, hasSlug });
}

for (const col of collectionChecks) {
  if (MUTABLE_COLLECTION_TYPES.includes(col.name)) {
    if (!col.hasIdentifier) {
      warn(`Collection "${col.name}" is missing identifier_field – CMS may fall back to filename`);
    }
    if (!col.hasSlug) {
      warn(`Collection "${col.name}" is missing slug template – new entries may get auto-generated long filenames`);
    }
    if (col.hasIdentifier && col.hasSlug) {
      ok(`Collection "${col.name}" has identifier_field and slug`);
    }
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log('\n' + (exitCode === 0 ? '✅ All checks passed.' : '❌ Validation failed – fix the issues above before building.') + '\n');
process.exit(exitCode);
