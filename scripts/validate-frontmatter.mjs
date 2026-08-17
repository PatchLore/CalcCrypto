#!/usr/bin/env node
/**
 * Blog frontmatter validator.
 *
 * Runs on `prebuild`, so a malformed post fails the build instead of shipping
 * silently. This exists because two real bugs got through by hand:
 *   - `description:` used instead of `excerpt:`, which renders an empty meta
 *     description, empty OG description, empty RSS item and a blank blog card.
 *   - an unquoted `date:`, which YAML parses as a Date object rather than the
 *     string the Post interface declares.
 * Both were invisible at runtime. Neither is invisible now.
 *
 * Run manually with: npm run validate:content
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { validateBlocks } from './validate-blocks.mjs';

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const REQUIRED_STRINGS = ['title', 'excerpt', 'image', 'category', 'author'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Fields that look like a required field but aren't read by posts.ts. Catching
// these by name gives a far clearer error than "excerpt is missing".
const KNOWN_MISTAKES = {
  description: 'excerpt',
  summary: 'excerpt',
  thumbnail: 'image',
  cover: 'image',
  publishedAt: 'date',
  tag: 'tags',
  categories: 'category',
};

const errors = [];
const warnings = [];

function err(file, msg) {
  errors.push(`${file}: ${msg}`);
}
function warn(file, msg) {
  warnings.push(`${file}: ${msg}`);
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function validate(file, data) {
  // Misnamed fields first — these produce the most confusing downstream bugs.
  for (const [wrong, right] of Object.entries(KNOWN_MISTAKES)) {
    if (wrong in data) {
      err(file, `uses "${wrong}:" — this field is ignored. Rename it to "${right}:".`);
    }
  }

  for (const key of REQUIRED_STRINGS) {
    if (!(key in data)) {
      err(file, `missing required field "${key}".`);
    } else if (!isNonEmptyString(data[key])) {
      err(file, `"${key}" must be a non-empty string (got ${JSON.stringify(data[key])}).`);
    }
  }

  // date: must be a quoted YYYY-MM-DD string. Unquoted YAML dates become Date
  // objects, which breaks the declared Post type and JSON-LD datePublished.
  if (!('date' in data)) {
    err(file, 'missing required field "date".');
  } else if (data.date instanceof Date) {
    const iso = data.date.toISOString().split('T')[0];
    err(file, `"date" is unquoted so YAML parsed it as a Date. Write it as date: "${iso}".`);
  } else if (!isNonEmptyString(data.date)) {
    err(file, `"date" must be a quoted string (got ${JSON.stringify(data.date)}).`);
  } else if (!DATE_RE.test(data.date)) {
    err(file, `"date" must be YYYY-MM-DD (got "${data.date}").`);
  } else if (Number.isNaN(new Date(data.date).getTime())) {
    err(file, `"date" is not a real calendar date ("${data.date}").`);
  }

  // image: must resolve to a file that actually exists under public/.
  if (isNonEmptyString(data.image)) {
    if (!data.image.startsWith('/')) {
      err(file, `"image" must be a root-relative path starting with "/" (got "${data.image}").`);
    } else if (!fs.existsSync(path.join(PUBLIC_DIR, data.image))) {
      err(file, `"image" points at "${data.image}" which does not exist under public/.`);
    }
  }

  // tags: required, array of non-empty strings.
  if (!('tags' in data)) {
    err(file, 'missing required field "tags".');
  } else if (!Array.isArray(data.tags)) {
    err(file, `"tags" must be an array (got ${typeof data.tags}).`);
  } else if (data.tags.length === 0) {
    err(file, '"tags" must contain at least one tag.');
  } else {
    data.tags.forEach((t, i) => {
      if (!isNonEmptyString(t)) {
        err(file, `tags[${i}] must be a non-empty string (got ${JSON.stringify(t)}).`);
      } else if (t !== t.toLowerCase()) {
        warn(file, `tags[${i}] "${t}" is not lowercase — tags are compared literally.`);
      }
    });
  }

  // faq: optional, but if present it feeds FAQPage schema. A malformed entry
  // emits broken structured data, which is worse than emitting none.
  if ('faq' in data) {
    if (!Array.isArray(data.faq)) {
      err(file, `"faq" must be an array of {question, answer} objects (got ${typeof data.faq}).`);
    } else if (data.faq.length === 0) {
      err(file, '"faq" is present but empty — remove it or add entries.');
    } else {
      data.faq.forEach((item, i) => {
        if (typeof item !== 'object' || item === null || Array.isArray(item)) {
          err(file, `faq[${i}] must be an object with "question" and "answer" (got ${JSON.stringify(item)}).`);
          return;
        }
        if (!isNonEmptyString(item.question)) {
          err(file, `faq[${i}] missing a non-empty "question".`);
        }
        if (!isNonEmptyString(item.answer)) {
          err(file, `faq[${i}] ("${item.question ?? '?'}") missing a non-empty "answer".`);
        }
        const extra = Object.keys(item).filter((k) => k !== 'question' && k !== 'answer');
        if (extra.length) {
          warn(file, `faq[${i}] has unrecognised key(s): ${extra.join(', ')}.`);
        }
      });
    }
  }

  // Soft SEO guidance — never fails the build.
  if (isNonEmptyString(data.excerpt) && data.excerpt.length > 300) {
    warn(file, `"excerpt" is ${data.excerpt.length} chars; search engines truncate well before that.`);
  }
  if (isNonEmptyString(data.title) && data.title.length > 70) {
    warn(file, `"title" is ${data.title.length} chars; likely truncated in search results.`);
  }
}

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`✗ Blog directory not found: ${POSTS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  if (files.length === 0) {
    console.error('✗ No blog posts found.');
    process.exit(1);
  }

  const seenSlugs = new Map();

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    if (seenSlugs.has(slug)) {
      err(file, `duplicate slug "${slug}" (also ${seenSlugs.get(slug)}).`);
    }
    seenSlugs.set(slug, file);

    let parsed;
    try {
      parsed = matter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
    } catch (e) {
      err(file, `frontmatter failed to parse: ${e.message}`);
      continue;
    }

    if (!parsed.content.trim()) {
      err(file, 'has no body content.');
    }
    validate(file, parsed.data);
  }

  // Component blocks fail soft at render time, so validate them here too.
  const blocks = validateBlocks();
  errors.push(...blocks.errors);

  if (warnings.length) {
    console.warn(`\n⚠  ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.warn(`   ${w}`));
  }

  if (errors.length) {
    console.error(`\n✗ Frontmatter validation failed — ${errors.length} error(s):\n`);
    errors.forEach((e) => console.error(`   ${e}`));
    console.error('\nFix the above before building.\n');
    process.exit(1);
  }

  console.log(
    `\n✓ Frontmatter valid across ${files.length} post(s); ` +
      `${blocks.stats.blocks} component block(s) valid across ${blocks.stats.files} post(s).\n`
  );
}

main();
