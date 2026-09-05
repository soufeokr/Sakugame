#!/usr/bin/env node
/* 🔢 SAKUGAME — release stamper (run from the repo root: node tools/stamp.js)
   Bumps the build number EVERYWHERE it must stay in sync:
     • index.html  <meta name="saku-build" content="N">
     • index.html  every ?v=N cache-buster (css/js/favicon)
     • app.js      const SAKU_BUILD = 'N';
     • sitemap.xml <lastmod>YYYY-MM-DD</lastmod>  (today — fresh signal for Google)
   Usage:  node tools/stamp.js            → auto-increment (49 → 50)
           node tools/stamp.js 51         → set explicitly
           node tools/stamp.js --check    → verify only (CI): exit 1 if inconsistent
*/
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const htmlPath = path.join(ROOT, 'index.html');
const appPath = path.join(ROOT, 'app.js');
const mapPath = path.join(ROOT, 'sitemap.xml');

let html = fs.readFileSync(htmlPath, 'utf8');
let app = fs.readFileSync(appPath, 'utf8');
let map = fs.readFileSync(mapPath, 'utf8');

const metaMatch = html.match(/<meta name="saku-build" content="(\d+)">/);
const appMatch = app.match(/const SAKU_BUILD = '(\d+)';/);
const tags = [...html.matchAll(/\?v=(\d+)/g)].map(m => m[1]);

if (!metaMatch || !appMatch) { console.error('❌ could not find build stamps'); process.exit(2); }

const cur = parseInt(metaMatch[1], 10);
const arg = process.argv[2];
const today = new Date().toISOString().slice(0, 10);

// ---------- CHECK mode (CI) ----------
if (arg === '--check') {
  const bad = [];
  if (appMatch[1] !== String(cur)) bad.push(`app.js SAKU_BUILD='${appMatch[1]}' ≠ meta '${cur}'`);
  tags.forEach(t => { if (t !== String(cur)) bad.push(`index.html ?v=${t} ≠ meta '${cur}'`); });
  const lm = (map.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/) || [])[1];
  if (!lm) bad.push('sitemap.xml has no <lastmod>');
  if (bad.length) { console.error('❌ STAMPS OUT OF SYNC:\n - ' + bad.join('\n - ')); process.exit(1); }
  console.log(`✅ stamps coherent — build ${cur}${lm ? `, sitemap lastmod ${lm}` : ''}`);
  process.exit(0);
}

// ---------- BUMP mode ----------
const next = arg ? parseInt(arg, 10) : cur + 1;
if (!Number.isFinite(next) || next <= 0) { console.error('❌ bad build number: ' + arg); process.exit(2); }

html = html.replace(/(<meta name="saku-build" content=")\d+(">)/, `$1${next}$2`);
html = html.replace(/\?v=\d+/g, `?v=${next}`);
app = app.replace(/const SAKU_BUILD = '\d+';/, `const SAKU_BUILD = '${next}';`);
map = map.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${today}</lastmod>`);

fs.writeFileSync(htmlPath, html);
fs.writeFileSync(appPath, app);
fs.writeFileSync(mapPath, map);
console.log(`✅ build ${cur} → ${next} · ${tags.length} cache-busters · sitemap lastmod=${today}`);
