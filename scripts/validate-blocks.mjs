#!/usr/bin/env node
/**
 * Validates `cc-*` component blocks embedded in blog Markdown.
 *
 * Blocks are authored as fenced code with a JSON body. A malformed block does
 * not break the build (the renderer falls back to a plain code block), which
 * means a typo would silently ship as raw JSON on the page. This catches that.
 *
 * Run via `npm run validate:content`.
 */

import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

// Must stay in sync with the REGISTRY in src/components/blog/blocks/index.tsx
const KNOWN = new Set([
  'country-comparison',
  'key-takeaway',
  'callout',
  'timeline',
  'tax-activities',
  'example',
  'pros-cons',
  'calculator-cta',
  'faq',
  'sources',
]);

const FENCE = /^```cc-([\w-]+)[ \t]*$/;

export function validateBlocks() {
  const errors = [];
  const stats = { blocks: 0, files: 0 };

  for (const file of fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))) {
    const lines = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8').split(/\r?\n/);
    let found = false;

    for (let i = 0; i < lines.length; i++) {
      const m = FENCE.exec(lines[i]);
      if (!m) continue;

      const name = m[1];
      const start = i + 1;
      let end = -1;
      for (let j = start; j < lines.length; j++) {
        if (lines[j].trim() === '```') {
          end = j;
          break;
        }
      }

      if (end === -1) {
        errors.push(`${file}:${i + 1} block "cc-${name}" is never closed.`);
        continue;
      }

      found = true;
      stats.blocks++;

      if (!KNOWN.has(name)) {
        errors.push(
          `${file}:${i + 1} unknown block "cc-${name}". Known: ${[...KNOWN].sort().join(', ')}.`
        );
      }

      const body = lines.slice(start, end).join('\n');
      try {
        const parsed = JSON.parse(body);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          errors.push(`${file}:${i + 1} block "cc-${name}" must be a JSON object.`);
        }
      } catch (e) {
        errors.push(`${file}:${i + 1} block "cc-${name}" has invalid JSON: ${e.message}`);
      }

      i = end;
    }

    if (found) stats.files++;
  }

  return { errors, stats };
}

// Run standalone when invoked directly.
if (import.meta.url === `file://${process.argv[1]?.split(path.sep).join('/')}`) {
  const { errors, stats } = validateBlocks();
  if (errors.length) {
    console.error(`\n✗ Component block validation failed (${errors.length}):\n`);
    errors.forEach((e) => console.error(`   ${e}`));
    process.exit(1);
  }
  console.log(`\n✓ ${stats.blocks} component block(s) valid across ${stats.files} post(s).\n`);
}
