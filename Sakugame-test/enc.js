/* ============================================================
   📖 SAKUGAME — ENCYCLOPEDIA (enc.js)
   ------------------------------------------------------------
   The collection binder: every card of the game, numbered 1..N,
   laid out like a Yo-kai Watch medallium.

   ORDER comes from encyclopedia.js (see tools/build_encyclopedia.py):
     • one block per ANIME FRANCHISE — every season / part / cour of a
       show is folded into one name (the same grouping Snapshot and
       Blur Guess use);
     • inside a franchise: Mythic → Legendary → Epic → Rare →
       Uncommon → Common, then AniList fame;
     • franchises run most-popular first, except the four pinned
       ones: Dragon Ball, Bleach, Naruto, One Piece;
     • `n` is the card number — NOT the AniList rank (`k`).

   Everything renders in chunks so 6765 cards never freeze the page.
   ============================================================ */

const ENC_STEP = 240;              // cards per "show more" chunk
const ENC_RARITIES = ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
const ENC_RARITY_META = {
  mythic:    { color: '#ff5252', edge: 'rgba(255,82,82,.60)' },
  legendary: { color: '#ffa726', edge: 'rgba(255,167,38,.60)' },
  epic:      { color: '#9d6bff', edge: 'rgba(157,107,255,.60)' },
  rare:      { color: '#02a9ff', edge: 'rgba(2,169,255,.55)' },
  uncommon:  { color: '#4caf50', edge: 'rgba(76,175,80,.55)' },
  common:    { color: '#9aa5b1', edge: 'rgba(154,165,177,.55)' }
};
const ENC_PINNED = ['dragon ball', 'bleach', 'naruto', 'one piece'];

let encData = null;        // the ENCYCLOPEDIA payload
let encFlat = null;        // [{ card, block, bi }] in catalogue order
let encShown = 0;          // how many cards are in the DOM
let encBlockEls = {};      // franchise block index -> its <section> element
let encQuery = '', encRarity = '', encSort = 'num';

/* ---------------- rarity edits ----------------
   The binder is also the curation desk: pick a new rarity on any card
   and it is remembered in this browser (localStorage), so a re-open,
   a reload or a search keeps it.  `card.r0` always holds the rarity
   the build shipped, so an edit can always be undone.                */
const ENC_RARITY_KEY = 'saku-enc-rarity';        // v1: keyed by binder number
const ENC_RARITY_ID_KEY = 'saku-enc-rar-by-id';    // v2: keyed by AniList id
const ENC_RARITY_MIGRATED = 'saku-enc-rar-migrated';
let encRarEdits = {};

/* ---------------- helpers ---------------- */
function encEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function encRarLabel(key) {
  const cap = key.charAt(0).toUpperCase() + key.slice(1);
  return (typeof t === 'function') ? t(cap) : cap;
}
function encTr(key, fallback) { return (typeof t === 'function') ? (t(key) || fallback) : fallback; }
function encFranchiseLabel(raw) {
  try { return (typeof translateAnimeTitle === 'function') ? (translateAnimeTitle(raw) || raw) : raw; }
  catch (e) { return raw; }
}
function encNum(n) { return '#' + String(n).padStart(4, '0'); }

/* Graphics quality (Settings → Display → High / Low).  HIGH asks the CDN
   for its full-size render everywhere; LOW always takes the small one —
   about a quarter of the bytes.  app.js owns the setting; this guard keeps
   enc.js working when it is loaded on its own (tests, previews).        */
function encGfxLow() {
  if (typeof sakuGfxLow === 'function') return sakuGfxLow();
  try { return localStorage.getItem('saku-graphics') === 'low'; } catch (e) { return false; }
}
/* The binder tile is only ~130 px, so LOW takes the CDN's `medium` render.
   HIGH keeps the full `large` file.  The open card always uses `large`.   */
function encThumb(url) {
  const u = String(url || '');
  if (u.indexOf('/character/large/') < 0) return u;
  return encGfxLow() ? u.replace('/character/large/', '/character/medium/') : u;
}

function encRarLoad() {
  let store = {};
  try { store = JSON.parse(localStorage.getItem(ENC_RARITY_ID_KEY) || '{}') || {}; }
  catch (e) { store = {}; }
  if (!store || typeof store !== 'object') store = {};
  /* First run since the switch: the old store was keyed by binder number,
     and those numbers are rewritten every time a rarity changes.  Re-key
     them onto the AniList character id so the edits survive.            */
  if (!localStorage.getItem(ENC_RARITY_MIGRATED)) {
    let legacy = {};
    try { legacy = JSON.parse(localStorage.getItem(ENC_RARITY_KEY) || '{}') || {}; }
    catch (e) { legacy = {}; }
    let moved = 0;
    if (legacy && typeof legacy === 'object') {
      const byNum = {};
      encData.list.forEach(b => b.cards.forEach(c => { byNum[c.n0] = c; }));
      Object.keys(legacy).forEach(k => {
        const c = byNum[k];
        if (c && ENC_RARITIES.indexOf(legacy[k]) >= 0 && !store[String(c.i)]) {
          store[String(c.i)] = legacy[k];
          moved++;
        }
      });
      if (moved) { try { localStorage.setItem(ENC_RARITY_ID_KEY, JSON.stringify(store)); } catch (e) {} }
    }
    try { localStorage.setItem(ENC_RARITY_MIGRATED, '1'); } catch (e) {}
    if (moved && window.console) console.log('encyclopedia: ' + moved +
      ' rarity edit(s) re-keyed to AniList ids');
  }
  encRarEdits = store;
  return store;
}
function encRarSave() {
  try { localStorage.setItem(ENC_RARITY_ID_KEY, JSON.stringify(encRarEdits)); } catch (e) {}
}
function encRarOriginal(card) { return card.r0 || card.r; }
function encRarityOf(card) {
  const o = encRarEdits[String(card.i)];
  return (o && ENC_RARITIES.indexOf(o) >= 0) ? o : encRarOriginal(card);
}
function encRarEdited(card) { return !!encRarEdits[String(card.i)]; }
function encTally() {
  const out = {};
  ENC_RARITIES.forEach(r => { out[r] = 0; });
  if (encFlat) encFlat.forEach(r => {
    if (r.card.edition === 'strongest') return;
    const k = encRarityOf(r.card);
    out[k] = (out[k] || 0) + 1;
  });
  return out;
}
function encBlockTally(block) {
  const rar = {};
  block.cards.forEach(c => { if (c.edition === 'strongest') return; const r = encRarityOf(c); rar[r] = (rar[r] || 0) + 1; });
  return rar;
}

/* ---------------- boot ---------------- */
function encReady() {
  return typeof ENCYCLOPEDIA !== 'undefined' && ENCYCLOPEDIA && ENCYCLOPEDIA.list;
}
/* Re-sort every franchise and re-number the whole binder from the
   rarities the user actually sees: anime-major, rarity-minor, then the
   AniList fame rank, then the name.  `n0` keeps the shipped number so the
   v1 store can still be migrated.                                     */
function encRenumber() {
  let n = 0;
  const tally = {};
  ENC_RARITIES.forEach(r => { tally[r] = 0; });
  encData.list.forEach(block => {
    block.cards.sort((a, b) =>
      (ENC_RARITIES.indexOf(a.r) - ENC_RARITIES.indexOf(b.r)) ||
      ((a.k || 99999) - (b.k || 99999)) ||
      String(a.m).localeCompare(String(b.m)) ||
      String(a.i).localeCompare(String(b.i)));
    block.from = n + 1;
    const rar = {};
    block.cards.forEach(c => {
      n += 1;
      c.n = n;
      if (c.edition !== 'strongest') { rar[c.r] = (rar[c.r] || 0) + 1; tally[c.r] += 1; }
    });
    block.to = n;
    block.rar = rar;
  });
  encData.total = n;
  encData.tally = tally;
}
/* data only - no repaint */
function encSyncRarities() {
  if (!encData) return;
  encData.list.forEach(block => block.cards.forEach(c => { c.r = encRarityOf(c); }));
  encRenumber();
  encFlat = [];
  encData.list.forEach((block, bi) => block.cards.forEach(card => encFlat.push({ card, block, bi })));
}
function sakuStrongestRefreshEnc() {
  if (!encData) return;
  encSyncRarities();encRenderHero();encRenderIndex();encRender(true);
}
function encBuild() {
  if (!encReady()) return false;
  encData = ENCYCLOPEDIA;
  encData.list.forEach(block => block.cards.forEach(card => {
    if (card.n0 === undefined) card.n0 = card.n;   // the number the build shipped
    if (!card.r0) card.r0 = card.r;
  }));
  encRarLoad();
  encSyncRarities();
  return true;
}

/* ---------------- filtering / sorting ---------------- */
function encVisible() {
  const q = encQuery.trim().toLowerCase();
  let rows = encFlat;
  if (encRarity) rows = rows.filter(r => r.card.edition !== 'strongest' && r.card.r === encRarity);
  if (q) {
    rows = rows.filter(r => {
      if (r.card.m.toLowerCase().indexOf(q) >= 0) return true;
      if (r.block.label.toLowerCase().indexOf(q) >= 0) return true;
      if (r.card.s && r.card.s.toLowerCase().indexOf(q) >= 0) return true;
      if (r.card.edition === 'strongest' && r.card.series && r.card.series.toLowerCase().indexOf(q) >= 0) return true;
      if (r.card.a) for (let i = 0; i < r.card.a.length; i++) if (r.card.a[i].toLowerCase().indexOf(q) >= 0) return true;
      return false;
    });
  }
  if (encSort === 'name') {
    rows = rows.slice().sort((a, b) => a.card.m.localeCompare(b.card.m) || a.card.n - b.card.n);
  } else if (encSort === 'rarity') {
    rows = rows.slice().sort((a, b) =>
      ENC_RARITIES.indexOf(b.card.r) - ENC_RARITIES.indexOf(a.card.r) || a.card.n - b.card.n);
  }
  return rows;
}

/* ---------------- the index rail ---------------- */
function encRenderIndex() {
  const box = document.getElementById('encIndexList');
  if (!box || !encData) return;
  const q = encQuery.trim().toLowerCase();
  const blocks = encData.list.filter(b => !q || b.label.toLowerCase().indexOf(q) >= 0);
  box.innerHTML = blocks.map((b, i) => {
    const pinned = ENC_PINNED.indexOf(b.label.toLowerCase()) >= 0 ? ' pinned' : '';
    return '<button type="button" class="enc-idx' + pinned + '" data-enc-jump="' + i + '">' +
      '<span>' + encEsc(encFranchiseLabel(b.label)) + '</span><b>' + b.count + '</b></button>';
  }).join('') || '<p class="enc-empty" style="padding:14px 6px">' + encEsc(encTr('No anime matches.', 'No anime matches.')) + '</p>';
  const note = document.getElementById('encIndexCount');
  if (note) note.textContent = blocks.length + ' / ' + encData.groups;
}

function encJump(i) {
  let guard = 0;
  while (!encBlockEls[i] && encShown < encVisible().length && guard++ < 60) encRender(false);
  const el = encBlockEls[i];
  if (!el) return;
  try { if (el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  catch (e) { if (el.scrollTop !== undefined) el.scrollTop = 0; }
  document.querySelectorAll('.enc-idx.on').forEach(n => n.classList.remove('on'));
  const btn = document.querySelector('.enc-idx[data-enc-jump="' + i + '"]');
  if (btn) btn.classList.add('on');
}

/* ---------------- the binder ---------------- */
function encSlotHtml(card) {
  if (card.edition === 'strongest' && typeof window.sakuStrongestCard === 'function') {
    return '<div class="enc-slot strongest-tile" role="button" tabindex="0" data-enc-card="' + card.n + '" title="' + encEsc(card.m) + ' — The Strongest">' +
      '<span class="strongest-art">' + window.sakuStrongestCard(card) + '</span></div>';
  }
  const meta = ENC_RARITY_META[card.r] || ENC_RARITY_META.common;
  return '<div class="enc-slot' + (card.r === 'mythic' ? ' mythic' : '') + '" ' +
    'style="--er:' + meta.edge + '" role="button" tabindex="0" data-enc-card="' + card.n + '" ' +
    'title="' + encEsc(card.m) + '">' +
    '<span class="enc-num">' + encNum(card.n) + '</span>' +
    (/^\d+$/.test(String(card.i)) ? '<span class="enc-rank" title="AniList">A#' + card.k + '</span>' : '') +
    '<span class="enc-art"><img src="' + encEsc(encThumb(card.u)) + '" alt="' + encEsc(card.m) + '" ' +
    'loading="lazy" decoding="async" fetchpriority="low" ' +
    'onload="this.classList.add(\'in\')" onerror="this.style.opacity=0"></span>' +
    '<span class="enc-rar-bar"></span>' +
    '<span class="enc-name">' + encEsc(card.m) + '</span>' +
    (card.s ? '<span class="enc-season">' + encEsc(card.s) + '</span>' : '') +
    '<span class="enc-meta"><b>' + encEsc(encRarLabel(card.r)) + '</b></span>' +
    '</div>';
}

function encBlockHeadHtml(block, st) {
  const rar = (st && st.rar) || encBlockTally(block);
  const tally = ENC_RARITIES.filter(r => rar[r]).map(r =>
    '<span style="background:' + (ENC_RARITY_META[r] || {}).color + '">' +
    (r === 'uncommon' ? 'U' : r.charAt(0).toUpperCase()) + rar[r] + '</span>').join('');
  const from = st ? st.from : block.from, to = st ? st.to : block.to;
  return '<div class="enc-block-head">' +
    '<h3>' + encEsc(encFranchiseLabel(block.label)) + '</h3>' +
    '<span class="enc-block-nums">' + encNum(from) + ' – ' + encNum(to) + '</span>' +
    '<span class="enc-block-tally">' + tally + '</span>' +
    '</div>';
}

function encRender(reset) {
  const grid = document.getElementById('encBinder');
  if (!grid || !encData) return;
  if (reset) { encShown = 0; encBlockEls = {}; grid.innerHTML = ''; }

  const rows = encVisible();
  const total = rows.length;

  if (!total) {
    grid.innerHTML = '<p class="enc-empty">' + encEsc(encTr('No card matches your filters.', 'No card matches your filters.')) + '</p>';
    encShown = 0;
  } else {
    const stale = grid.querySelector('.enc-empty');
    if (stale) stale.remove();
    // live per-block stats so a search / rarity filter rewrites each header
    let stats = null;
    if (encRarity || encQuery) {
      stats = {};
      for (let i = 0; i < total; i++) {
        const r = rows[i];
        const st = stats[r.bi] || (stats[r.bi] = { rar: {}, from: Infinity, to: 0 });
        st.rar[r.card.r] = (st.rar[r.card.r] || 0) + 1;
        if (r.card.n < st.from) st.from = r.card.n;
        if (r.card.n > st.to) st.to = r.card.n;
      }
    }
    const target = Math.min(total, encShown + ENC_STEP);
    let cur = grid.lastElementChild;
    while (encShown < target) {
      const row = rows[encShown];
      if (!cur || cur.dataset.encBlock !== String(row.bi)) {
        const sec = document.createElement('section');
        sec.className = 'enc-block';
        sec.dataset.encBlock = String(row.bi);
        sec.innerHTML = encBlockHeadHtml(row.block, stats && stats[row.bi]) + '<div class="enc-grid"></div>';
        grid.appendChild(sec);
        cur = sec;
        encBlockEls[row.bi] = sec;
      }
      const holder = cur.querySelector('.enc-grid');
      const tmp = document.createElement('div');
      while (encShown < target && rows[encShown].bi === row.bi) {
        tmp.innerHTML = encSlotHtml(rows[encShown].card);
        holder.appendChild(tmp.firstElementChild);
        encShown++;
      }
    }
  }

  const left = total - encShown;
  const more = document.getElementById('encMoreBtn');
  if (more) {
    more.style.display = left > 0 ? '' : 'none';
    more.textContent = encTr('Show more', 'Show more') + ' (' + left + ')';
  }
  const note = document.getElementById('encCountNote');
  if (note) note.textContent = encShown + ' / ' + total;
}
function encShowMore() { encRender(false); }

/* ---------------- detail ---------------- */
function encRarPickerHtml(card) {
  const cur = encRarityOf(card);
  const btns = ENC_RARITIES.map(r => {
    const on = r === cur ? ' on' : '';
    return '<button type="button" class="enc-rar-btn' + on + '" data-enc-num="' + card.n + '" ' +
      'data-enc-rar="' + r + '" style="--rc:' + (ENC_RARITY_META[r] || {}).color + '" ' +
      'aria-pressed="' + (r === cur) + '" title="' + encEsc(encRarLabel(r)) + '">' +
      '<i style="background:' + (ENC_RARITY_META[r] || {}).color + '"></i>' +
      '<span>' + encEsc(encRarLabel(r)) + '</span></button>';
  }).join('');
  return '<div class="enc-rar-edit">' +
    '<span class="enc-rar-edit-lab">' + encEsc(encTr('Change rarity', 'Change rarity')) +
    (encRarEdited(card) ? ' <em class="enc-rar-flag">' +
      encEsc(encTr('edited', 'edited')) + '</em>' : '') + '</span>' +
    '<div class="enc-rar-pick" role="group" aria-label="' +
    encEsc(encTr('Change rarity', 'Change rarity')) + '">' + btns + '</div>' +
    (encRarEdited(card)
      ? '<button type="button" class="enc-rar-undo" data-enc-num="' + card.n + '" ' +
        'data-enc-rar-reset="1">&#8635; ' + encEsc(encTr('Reset', 'Reset')) + '</button>'
      : '') +
    '</div>';
}

function encOpenCard(n) {
  if (!encFlat) return;
  let found = null;
  for (let i = 0; i < encFlat.length; i++) if (encFlat[i].card.n === n) { found = encFlat[i]; break; }
  if (!found) return;
  const card = found.card, block = found.block;
  const meta = ENC_RARITY_META[card.r] || ENC_RARITY_META.common;
  const box = document.getElementById('encDetail');
  if (!box) return;
  if (card.edition === 'strongest' && typeof window.sakuStrongestCard === 'function') {
    box.innerHTML = '<div class="enc-detail-card strongest-detail"><span class="strongest-art">' + window.sakuStrongestCard(card) + '</span></div>' +
      '<div class="enc-detail-meta"><div class="enc-big-num">' + encNum(card.n) + '</div><h3>' + encEsc(card.m) + '</h3><p>' + encEsc(card.series || '') +
      '</p><p>Édition The Strongest · collection uniquement</p></div>';
    box.classList.add('show');try { document.body.style.overflow = 'hidden'; } catch(e) {} return;
  }
  box.innerHTML =
    '<div class="enc-detail-card" style="--er:' + meta.edge + '">' +
    '<span class="enc-art"><img src="' + encEsc(card.u) + '" alt="' + encEsc(card.m) + '" ' +
    'decoding="async" fetchpriority="high" onerror="this.style.opacity=0"></span>' +
    '<span class="enc-num">' + encNum(card.n) + '</span>' +
    (/^\d+$/.test(String(card.i)) ? '<span class="enc-rank">AniList #' + card.k + '</span>' : '') +
    '<span class="enc-rar-bar"></span>' +
    '<span class="enc-name">' + encEsc(card.m) + '</span>' +
    (card.s ? '<span class="enc-season">' + encEsc(card.s) + '</span>' : '') +
    '<span class="enc-meta"><b style="color:' + meta.color + '">' + encEsc(encRarLabel(card.r)) + '</b>' +
    '<i>' + encNum(card.n) + '</i></span>' +
    '</div>' +
    '<div class="enc-detail-meta">' +
    '<div class="enc-big-num">' + encNum(card.n) + '</div>' +
    '<h3>' + encEsc(card.m) + '</h3>' +
    '<p>' + encEsc(encFranchiseLabel(block.label)) +
    (card.s ? ' · <i>' + encEsc(card.s) + '</i>' : '') + '</p>' +
    '<p><b style="color:' + meta.color + '">' + encEsc(encRarLabel(card.r)) + '</b> · ' +
    (/^\d+$/.test(String(card.i)) ? encEsc(encTr('AniList rank', 'AniList rank')) + ' #' + card.k : 'Personnage ajouté manuellement') + '</p>' +
    encRarPickerHtml(card) +
    (card.a && card.a.length
      ? '<p class="enc-detail-alt"><b>' + encEsc(encTr('Also known as', 'Also known as')) + ':</b> ' +
        encEsc(card.a.join(' · ')) + '</p>'
      : '') +
    (/^Q[1-9]\d*$/.test(String(card.i)) ? '<a class="secondary" href="https://www.wikidata.org/wiki/' + encEsc(card.i) + '" target="_blank" rel="noopener">Wikidata ↗</a>' : (/^\d+$/.test(String(card.i)) ? '<a class="secondary" href="https://anilist.co/character/' + encEsc(card.i) + '" target="_blank" rel="noopener">AniList ↗</a>' : '')) +
    '</div>';
  box.classList.add('show');
  try { document.body.style.overflow = 'hidden'; } catch (e) {}
}
/* ---------------- rarity editing ---------------- */
function encFind(n) {
  if (!encFlat) return null;
  for (let i = 0; i < encFlat.length; i++) if (encFlat[i].card.n === n) return encFlat[i];
  return null;
}
function encApplyEdits() {
  // repaint every slot / header that is already on screen
  encRenderHero();
  encRenderIndex();
  encRender(true);
}
function encScrollToCard(n) {
  const rows = encVisible();
  let idx = -1;
  for (let i = 0; i < rows.length; i++) if (rows[i].card.n === n) { idx = i; break; }
  let guard = 0;
  while (idx >= 0 && encShown <= idx && guard++ < 90) encRender(false);
  const el = document.querySelector('[data-enc-card="' + n + '"]');
  if (el && el.scrollIntoView) { try { el.scrollIntoView({ block: 'center' }); } catch (e) {} }
}
function encSetRarity(n, r) {
  const found = encFind(n);
  if (!found || ENC_RARITIES.indexOf(r) < 0) return;
  const card = found.card;
  if (r === encRarOriginal(card)) delete encRarEdits[String(card.i)];   // back to the build value
  else encRarEdits[String(card.i)] = r;
  encRarSave();
  encSyncRarities();      // re-sorts and re-numbers the binder
  encApplyEdits();
  encScrollToCard(card.n);
  encOpenCard(card.n);          // re-open so the picker shows the new state
}
function encResetRarity(n) {
  const found = encFind(n);
  if (!found) return;
  delete encRarEdits[String(found.card.i)];
  encRarSave();
  encSyncRarities();
  encApplyEdits();
  encScrollToCard(found.card.n);
  encOpenCard(found.card.n);
}
function encResetAllRarity() {
  encRarEdits = {};
  encRarSave();
  encSyncRarities();
  encApplyEdits();
}
/* Back up / restore the edits as a file, so a cleared cache, another
   browser or a second machine can pick them up again.                 */
function encExportRarities() {
  const n = Object.keys(encRarEdits).length;
  if (!n) { alert(encTr('No rarity edits to save yet.', 'No rarity edits to save yet.')); return; }
  const names = {};
  encData.list.forEach(b => b.cards.forEach(c => { names[String(c.i)] = c.m; }));
  const blob = new Blob([JSON.stringify({
    kind: 'sakugame-encyclopedia-rarities', version: 2, saved: new Date().toISOString(),
    edits: encRarEdits, names: names
  }, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sakugame-rarities.json';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
}
function encImportRarities(file) {
  const fr = new FileReader();
  fr.onload = () => {
    let data = null;
    try { data = JSON.parse(String(fr.result)); } catch (e) { data = null; }
    const edits = data && (data.edits || (data.kind === undefined ? data : null));
    if (!edits || typeof edits !== 'object') {
      alert(encTr('That file does not look like a rarity backup.', 'That file does not look like a rarity backup.'));
      return;
    }
    const clean = {};
    Object.keys(edits).forEach(k => {
      if (ENC_RARITIES.indexOf(edits[k]) >= 0) clean[String(k)] = edits[k];
    });
    encRarEdits = clean;
    encRarSave();
    try { localStorage.setItem(ENC_RARITY_MIGRATED, '1'); } catch (e) {}
    encSyncRarities();
    encApplyEdits();
    alert(encTr('{n} rarity edit(s) restored.', '{n} rarity edit(s) restored.')
      .replace('{n}', Object.keys(clean).length));
  };
  fr.readAsText(file);
}

function encCloseDetail() {
  const box = document.getElementById('encDetail');
  if (box) box.classList.remove('show');
  try { document.body.style.overflow = ''; } catch (e) {}
}

/* ---------------- hero + tools ---------------- */
function encRenderHero() {
  const d = encData;
  if (!d) return;
  const tot = document.getElementById('encHeroTotal');
  if (tot) tot.innerHTML = '<b>' + d.total.toLocaleString('en-US') + '</b><span>' +
    encEsc(encTr('cards', 'cards')) + '</span>';
  const leg = document.getElementById('encLegend');
  if (leg) {
    const tal = encTally();
    leg.innerHTML = ENC_RARITIES.map(r =>
      '<span class="enc-legend-chip"><i style="background:' + (ENC_RARITY_META[r] || {}).color + '"></i>' +
      encEsc(encRarLabel(r)) + ' <b>' + (tal[r] || 0) + '</b></span>').join('') +
      (encRarEdits && Object.keys(encRarEdits).length
        ? '<button type="button" class="enc-legend-chip enc-legend-reset" data-enc-rar-all="1">' +
          '&#8635; ' + encEsc(encTr('Reset all edits', 'Reset all edits')) +
          ' (' + Object.keys(encRarEdits).length + ')</button>'
        : '') +
      /* Save / Load stay visible even with no edits, so a backup can be
         put back after a cleared cache or on another machine.        */
      '<button type="button" class="enc-legend-chip enc-legend-reset" data-enc-rar-save="1">' +
      '&#8681; ' + encEsc(encTr('Save', 'Save')) + '</button>' +
      '<button type="button" class="enc-legend-chip enc-legend-reset" data-enc-rar-load="1">' +
      '&#8679; ' + encEsc(encTr('Load', 'Load')) + '</button>';
  }
  const sub = document.getElementById('encSub');
  if (sub) sub.textContent = d.groups.toLocaleString('en-US') + ' ' +
    encTr('anime franchises', 'anime franchises') + ' · ' +
    encTr('numbered 1 to {n}', 'numbered 1 to ' + d.total).replace('{n}', d.total);
  const rf = document.getElementById('encRarityFilter');
  if (rf) {
    const tal = encTally();
    const keep = rf.value;
    rf.innerHTML = '<option value="">' + encEsc(encTr('All rarities', 'All rarities')) + '</option>' +
      ENC_RARITIES.map(r => '<option value="' + r + '">' + encEsc(encRarLabel(r)) + ' (' + (tal[r] || 0) + ')</option>').join('');
    rf.value = keep;
    rf.dataset.filled = '1';
  }
}

function encOpen() {
  if (!encBuild()) return;
  encRenderHero();
  encRenderIndex();
  encRender(true);
  showScreen('encyclopediaScreen');
}

/* ---------------- wiring ---------------- */
function encWire() {
  const search = document.getElementById('encSearch');
  if (search) search.addEventListener('input', () => {
    encQuery = search.value || '';
    encRenderIndex();
    encRender(true);
  });
  const rf = document.getElementById('encRarityFilter');
  if (rf) rf.addEventListener('change', () => { encRarity = rf.value || ''; encRender(true); });
  const so = document.getElementById('encSort');
  if (so) so.addEventListener('change', () => { encSort = so.value || 'num'; encRender(true); });

  document.addEventListener('click', e => {
    const jump = e.target.closest && e.target.closest('[data-enc-jump]');
    if (jump) { encJump(parseInt(jump.getAttribute('data-enc-jump'), 10)); return; }
    const slot = e.target.closest && e.target.closest('[data-enc-card]');
    if (slot) { encOpenCard(parseInt(slot.getAttribute('data-enc-card'), 10)); return; }
    const rarAll = e.target.closest && e.target.closest('[data-enc-rar-all]');
    if (rarAll) { encResetAllRarity(); return; }
    if (e.target.closest && e.target.closest('[data-enc-rar-save]')) { encExportRarities(); return; }
    if (e.target.closest && e.target.closest('[data-enc-rar-load]')) {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = '.json,application/json';
      inp.addEventListener('change', () => { if (inp.files && inp.files[0]) encImportRarities(inp.files[0]); });
      inp.click();
      return;
    }
    const rarBtn = e.target.closest && e.target.closest('[data-enc-rar]');
    if (rarBtn) {
      encSetRarity(parseInt(rarBtn.getAttribute('data-enc-num'), 10),
                   rarBtn.getAttribute('data-enc-rar'));
      return;
    }
    const rarUndo = e.target.closest && e.target.closest('[data-enc-rar-reset]');
    if (rarUndo) { encResetRarity(parseInt(rarUndo.getAttribute('data-enc-num'), 10)); return; }
    if (e.target.id === 'encDetail') encCloseDetail();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') encCloseDetail();
    if (e.key !== 'Enter' && e.key !== String.fromCharCode(13)) return;
    const slot = e.target.closest && e.target.closest('[data-enc-card]');
    if (slot) encOpenCard(parseInt(slot.getAttribute('data-enc-card'), 10));
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', encWire);
else encWire();
