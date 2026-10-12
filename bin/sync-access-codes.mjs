#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const PREFIX = 'c2b-proto:';
const kvsArn = process.env.KVS_ARN;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function aws(...args) {
  return JSON.parse(execFileSync('aws', ['cloudfront-keyvaluestore', ...args, '--kvs-arn', kvsArn, '--output', 'json'], { encoding: 'utf8' }));
}

function seconds(date, time) {
  return Math.floor(Date.parse(`${date}T${time}Z`) / 1000);
}

if (!kvsArn) {
  fail('Set KVS_ARN.');
}

const codes = JSON.parse(readFileSync('access-codes.json', 'utf8'));
if (!Array.isArray(codes)) {
  fail('access-codes.json must be a list.');
}

const puts = codes.map((entry, index) => {
  if (!entry.label || !/^[0-9a-f]{64}$/.test(entry.sha256 ?? '')) {
    fail(`Entry ${index + 1} in access-codes.json needs a label and a 64-character sha256.`);
  }
  const window = {};
  for (const [field, key, time] of [['validFrom', 'from', '00:00:00'], ['validUntil', 'until', '23:59:59']]) {
    if (entry[field] === undefined) {
      continue;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry[field]) || Number.isNaN(seconds(entry[field], time))) {
      fail(`"${entry.label}": ${field} must be a date such as 2026-10-31.`);
    }
    window[key] = seconds(entry[field], time);
  }
  return { Key: PREFIX + entry.sha256, Value: JSON.stringify(window) };
});

const wanted = new Set(puts.map((put) => put.Key));
const deletes = aws('list-keys').Items
  .map((item) => item.Key)
  .filter((key) => key.startsWith(PREFIX) && !wanted.has(key))
  .map((key) => ({ Key: key }));

const { ETag } = aws('describe-key-value-store');
const args = ['update-keys', '--if-match', ETag, '--puts', JSON.stringify(puts)];
if (deletes.length) {
  args.push('--deletes', JSON.stringify(deletes));
}
aws(...args);

console.log(`Access codes synced: ${puts.length} active, ${deletes.length} removed.`);
