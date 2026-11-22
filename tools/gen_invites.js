#!/usr/bin/env node
/* Sakugame — génère les pages d'invitation i/CODE/index.html (aperçus de lien personnalisés).
   Les robots des messageries (Discord, WhatsApp, iMessage…) ne lancent pas le JavaScript : chaque invitation
   a donc sa propre page statique avec ses balises Open Graph (« X vous invite à jouer sur Sakugame » + photo).
   Un visiteur est aussitôt renvoyé vers l'accueil avec ?ref=CODE, que le site mémorise.
   Lancé par l'action GitHub « Invites » ; utilisable à la main : node tools/gen_invites.js [fichier.json]
   (le fichier JSON remplace l'appel à Supabase, pour les tests). */
'use strict';
const fs = require('fs');
const path = require('path');

const SITE = 'https://soufeokr.github.io/Sakugame/';
const API = 'https://nafesytcmueciltowcci.supabase.co/rest/v1/rpc/referral_invites_public';
const KEY = 'sb_publishable_Bq1ZcTPaQfP4tCnXfVHRgw_Ym-IKavg'; // clé publique (déjà dans supabase-client.js)
const ROOT = path.join(__dirname, '..', 'i');
const CODE_RE = /^[A-HJ-NP-Z2-9]{6}$/;

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

// Photo de profil : https uniquement ; les photos Discord sont demandées en PNG 256 px (aperçu net, pas de GIF).
function avatarUrl(a) {
  a = String(a || '');
  if (!/^https:\/\/[^\s"'<>]+$/i.test(a) || a.length > 500) return null;
  const m = a.match(/^(https:\/\/cdn\.discordapp\.com\/avatars\/\d+\/[A-Za-z0-9_]+)\.(?:png|gif|webp|jpg|jpeg)(?:\?.*)?$/i);
  if (m) return m[1] + '.png?size=256';
  return a;
}

function page(inv) {
  const name = String(inv.name || 'Un joueur').slice(0, 40);
  const url = SITE + 'i/' + inv.code + '/';
  const target = SITE + '?ref=' + inv.code;
  const av = avatarUrl(inv.avatar);
  const title = name + ' vous invite à jouer sur Sakugame';
  const desc = 'Jeux anime entre amis, gratuits et sans pub. Avec cette invitation, chaque joueur reçoit 2 packs gratuits.';
  const img = av || SITE + 'icons/open-graph.png';
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex, follow">
<meta name="theme-color" content="#0f0f1a">
<link rel="canonical" href="${esc(url)}">
<link rel="icon" href="../../favicon.ico">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Sakugame">
<meta property="og:locale" content="fr_FR">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(img)}">
${av ? `<meta property="og:image:width" content="256">
<meta property="og:image:height" content="256">
<meta property="og:image:alt" content="${esc('Photo de profil de ' + name)}">
<meta name="twitter:card" content="summary">` : `<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Sakugame">
<meta name="twitter:card" content="summary_large_image">`}
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(img)}">
<script>location.replace(${JSON.stringify(target)});</script>
<style>
  body{min-height:100vh;margin:0;display:flex;align-items:center;justify-content:center;background:#0f0f1a;color:#eee;
    font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;text-align:center;padding:24px;box-sizing:border-box}
  img{width:88px;height:88px;border-radius:50%;object-fit:cover;margin-bottom:14px}
  h1{font-size:1.3rem;margin:0 0 8px}p{color:#a0a0b0;margin:0 0 22px;line-height:1.5}
  a{display:inline-block;padding:12px 24px;border-radius:12px;background:#02a9ff;color:#fff;font-weight:800;text-decoration:none}
</style>
</head>
<body>
<main>
${av ? `<img src="${esc(av)}" alt="" referrerpolicy="no-referrer">` : ''}
<h1>${esc(title)}</h1>
<p>${esc(desc)}</p>
<a href="${esc(target)}">Rejoindre Sakugame</a>
</main>
</body>
</html>
`;
}

async function load() {
  if (process.argv[2]) return JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const r = await fetch(API, {method: 'POST', headers: {apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json'}, body: '{}'});
  if (!r.ok) throw new Error('Supabase ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return r.json();
}

(async () => {
  const list = await load();
  if (!Array.isArray(list)) throw new Error('réponse inattendue');
  const keep = new Set();
  let written = 0;
  fs.mkdirSync(ROOT, {recursive: true});
  for (const inv of list) {
    if (!inv || !CODE_RE.test(inv.code)) continue;
    keep.add(inv.code);
    const dir = path.join(ROOT, inv.code), file = path.join(dir, 'index.html'), html = page(inv);
    if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === html) continue;
    fs.mkdirSync(dir, {recursive: true});
    fs.writeFileSync(file, html);
    written++;
  }
  let removed = 0;
  for (const d of fs.readdirSync(ROOT)) {
    if (CODE_RE.test(d) && !keep.has(d)) { fs.rmSync(path.join(ROOT, d), {recursive: true, force: true}); removed++; }
  }
  console.log(`invitations : ${keep.size} au total, ${written} écrites, ${removed} supprimées`);
})().catch(e => { console.error(e.message || e); process.exit(1); });
