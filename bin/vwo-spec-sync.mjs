#!/usr/bin/env node
// Copies VWO build snippets into the spec pages that show them. A spec page
// marks each code block with <pre ... data-src="vwo/<file>.js">; this rewrites
// the block's content from that file, HTML-escaped.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SPECS = join(ROOT, 'design-specs');
const BLOCK = /(<pre\b[^>]*\bdata-src="([^"]+)"[^>]*>)([\s\S]*?)(<\/pre>)/g;

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let changed = 0;
for (const name of readdirSync(SPECS).filter((f) => f.endsWith('.html'))) {
  const path = join(SPECS, name);
  const html = readFileSync(path, 'utf8');
  const next = html.replace(BLOCK, (match, open, src, body, close) => {
    const code = readFileSync(join(ROOT, src), 'utf8').trimEnd();
    return open + escapeHtml(code) + close;
  });
  if (next !== html) {
    writeFileSync(path, next);
    changed += 1;
    console.log(`updated ${name}`);
  }
}
if (!changed) console.log('all spec code blocks already match');
