#!/usr/bin/env node
import { createHash, randomInt } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://c2b-proto.autovex.fi/';
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
const FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'access-codes.json');
const USAGE = 'Usage: node bin/access-code.mjs add "<label>" [--from YYYY-MM-DD] [--until YYYY-MM-DD]\n'
  + ' node bin/access-code.mjs remove "<label>"\n'
  + ' node bin/access-code.mjs list';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

const [command, label, ...rest] = process.argv.slice(2);
const options = {};
for (let i = 0; i < rest.length; i += 2) {
  options[rest[i].replace(/^--/, '')] = rest[i + 1];
}

const codes = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : [];
const save = () => writeFileSync(FILE, `${JSON.stringify(codes, null, 2)}\n`);

if (command === 'add') {
  if (!label) {
    fail(USAGE);
  }
  if (codes.some((entry) => entry.label === label)) {
    fail(`A code labelled "${label}" already exists. Pick another label.`);
  }
  for (const name of ['from', 'until']) {
    if (options[name] !== undefined && !isDate(options[name])) {
      fail(`--${name} must be a date such as 2026-10-31.`);
    }
  }
  if (options.until && options.until < new Date().toISOString().slice(0, 10)) {
    fail('--until is in the past.');
  }
  const raw = Array.from({ length: 12 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
  const code = raw.match(/.{4}/g).join('-');
  const entry = { label, sha256: createHash('sha256').update(raw).digest('hex') };
  if (options.from) {
    entry.validFrom = options.from;
  }
  if (options.until) {
    entry.validUntil = options.until;
  }
  codes.push(entry);
  save();
  console.log(`Code for "${label}": ${code}`);
  console.log(`Link that carries the code: ${SITE_URL}?code=${code}`);
  console.log(options.until ? `Valid until the end of ${options.until} (UTC).` : 'Valid until removed.');
  console.log('Commit and push access-codes.json. The code works once the deploy finishes. It is not stored anywhere, so save it now.');
} else if (command === 'remove') {
  const index = codes.findIndex((entry) => entry.label === label);
  if (index === -1) {
    fail(`No code labelled "${label}". Run: node bin/access-code.mjs list`);
  }
  codes.splice(index, 1);
  save();
  console.log(`Removed "${label}". Commit and push access-codes.json. The code stops working once the deploy finishes.`);
} else if (command === 'list') {
  for (const entry of codes) {
    console.log(`${entry.label}: from ${entry.validFrom ?? 'now'}, ${entry.validUntil ? `until ${entry.validUntil}` : 'no end date'}`);
  }
} else {
  fail(USAGE);
}
