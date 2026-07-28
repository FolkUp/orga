#!/usr/bin/env node
// IndexNow ping для underground.folkup.life
//
// Usage:
//   node scripts/indexnow-ping.mjs           # discover key + submit all sitemap URLs
//   node scripts/indexnow-ping.mjs <url...>  # submit specific URLs
//
// Prerequisites:
//   1. astro/public/<key>.txt файл must be deployed к prod (CF Pages)
//   2. Verify accessibility: curl https://underground.folkup.life/<key>.txt
//   3. Then run this script
//
// Protocol: https://www.indexnow.org/documentation

import { readFile } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HOST = 'underground.folkup.life';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(__dirname, '..', 'public');
const SITEMAP_LOCAL = join(__dirname, '..', 'dist', 'sitemap-0.xml');
const SITEMAP_LIVE = `https://${HOST}/sitemap-0.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

function discoverKey() {
  const files = readdirSync(PUBLIC_DIR);
  const keyFile = files.find((f) => /^[0-9a-f]{16,128}\.txt$/i.test(f));
  if (!keyFile) {
    throw new Error(`IndexNow key file not found in ${PUBLIC_DIR}. Expected /^[0-9a-f]{16,128}\\.txt$/`);
  }
  return keyFile.replace(/\.txt$/, '');
}

async function fetchSitemapUrls() {
  let xml;
  if (existsSync(SITEMAP_LOCAL)) {
    console.log(`Reading local sitemap: ${SITEMAP_LOCAL}`);
    xml = await readFile(SITEMAP_LOCAL, 'utf8');
  } else {
    console.log(`Fetching live sitemap: ${SITEMAP_LIVE}`);
    const res = await fetch(SITEMAP_LIVE);
    if (!res.ok) throw new Error(`Sitemap fetch failed: HTTP ${res.status}`);
    xml = await res.text();
  }
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return urls;
}

async function submitToIndexNow(key, urls) {
  const body = {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList: urls,
  };
  console.log(`Submitting ${urls.length} URLs to IndexNow endpoint...`);
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(`Response: HTTP ${res.status} ${res.statusText}`);
  if (text.trim()) console.log(`Body: ${text}`);
  if (!res.ok && res.status !== 202) {
    throw new Error(`IndexNow rejected: HTTP ${res.status}`);
  }
  return { status: res.status };
}

async function main() {
  const key = discoverKey();
  const maskedKey = `${key.slice(0, 4)}...${key.slice(-4)}`;
  console.log(`IndexNow key: ${maskedKey} (masked, file astro/public/${key.slice(0, 4)}...${key.slice(-4)}.txt)`);

  const cliUrls = process.argv.slice(2);
  const urls = cliUrls.length > 0 ? cliUrls : await fetchSitemapUrls();

  if (urls.length === 0) {
    console.log('No URLs to submit. Exiting.');
    return;
  }

  console.log(`URLs to submit (${urls.length}):`);
  urls.slice(0, 5).forEach((u) => console.log(`  - ${u}`));
  if (urls.length > 5) console.log(`  ... and ${urls.length - 5} more`);

  await submitToIndexNow(key, urls);
  console.log('IndexNow ping complete.');
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
