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

/* ---------------- boot ---------------- */
function encReady() {
  return typeof ENCYCLOPEDIA !== 'undefined' && ENCYCLOPEDIA && ENCYCLOPEDIA.list;
}
function encBuild() {
  if (!encReady()) return false;
  encData = ENCYCLOPEDIA;
  encFlat = [];
  encData.list.forEach((block, bi) => {
    block.cards.forEach(card => encFlat.push({ card: card, block: block, bi: bi }));
  });
  return true;
}

/* ---------------- filtering / sorting ---------------- */
function encVisible() {
  const q = encQuery.trim().toLowerCase();
  let rows = encFlat;
  if (encRarity) rows = rows.filter(r => r.card.r === encRarity);
  if (q) {
    rows = rows.filter(r => {
      if (r.card.m.toLowerCase().indexOf(q) >= 0) return true;
      if (r.block.label.toLowerCase().indexOf(q) >= 0) return true;
      if (r.card.s && r.card.s.toLowerCase().indexOf(q) >= 0) return true;
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
  const meta = ENC_RARITY_META[card.r] || ENC_RARITY_META.common;
  return '<div class="enc-slot' + (card.r === 'mythic' ? ' mythic' : '') + '" ' +
    'style="--er:' + meta.edge + '" role="button" tabindex="0" data-enc-card="' + card.n + '" ' +
    'title="' + encEsc(card.m) + '">' +
    '<span class="enc-num">' + encNum(card.n) + '</span>' +
    '<span class="enc-rank" title="' + encEsc(encTr('AniList rank', 'AniList rank')) + '">A#' + card.k + '</span>' +
    '<span class="enc-art"><img src="' + encEsc(card.u) + '" alt="' + encEsc(card.m) + '" loading="lazy" ' +
    'onerror="this.style.opacity=0"></span>' +
    '<span class="enc-rar-bar"></span>' +
    '<span class="enc-name">' + encEsc(card.m) + '</span>' +
    (card.s ? '<span class="enc-season">' + encEsc(card.s) + '</span>' : '') +
    '<span class="enc-meta"><b>' + encEsc(encRarLabel(card.r)) + '</b></span>' +
    '</div>';
}

function encBlockHeadHtml(block, st) {
  const rar = (st && st.rar) || block.rar || {};
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
function encOpenCard(n) {
  if (!encFlat) return;
  let found = null;
  for (let i = 0; i < encFlat.length; i++) if (encFlat[i].card.n === n) { found = encFlat[i]; break; }
  if (!found) return;
  const card = found.card, block = found.block;
  const meta = ENC_RARITY_META[card.r] || ENC_RARITY_META.common;
  const box = document.getElementById('encDetail');
  if (!box) return;
  box.innerHTML =
    '<div class="enc-detail-card" style="--er:' + meta.edge + '">' +
    '<span class="enc-art"><img src="' + encEsc(card.u) + '" alt="' + encEsc(card.m) + '" ' +
    'onerror="this.style.opacity=0"></span>' +
    '<span class="enc-num">' + encNum(card.n) + '</span>' +
    '<span class="enc-rank">AniList #' + card.k + '</span>' +
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
    encEsc(encTr('AniList rank', 'AniList rank')) + ' #' + card.k + '</p>' +
    (card.a && card.a.length
      ? '<p class="enc-detail-alt"><b>' + encEsc(encTr('Also known as', 'Also known as')) + ':</b> ' +
        encEsc(card.a.join(' · ')) + '</p>'
      : '') +
    '<a class="secondary" href="https://anilist.co/character/' + encEsc(card.i) + '" target="_blank" rel="noopener">AniList ↗</a>' +
    '</div>';
  box.classList.add('show');
  try { document.body.style.overflow = 'hidden'; } catch (e) {}
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
    leg.innerHTML = ENC_RARITIES.map(r =>
      '<span class="enc-legend-chip"><i style="background:' + (ENC_RARITY_META[r] || {}).color + '"></i>' +
      encEsc(encRarLabel(r)) + ' <b>' + (d.tally[r] || 0) + '</b></span>').join('');
  }
  const sub = document.getElementById('encSub');
  if (sub) sub.textContent = d.groups.toLocaleString('en-US') + ' ' +
    encTr('anime franchises', 'anime franchises') + ' · ' +
    encTr('numbered 1 to {n}', 'numbered 1 to ' + d.total).replace('{n}', d.total);
  const rf = document.getElementById('encRarityFilter');
  if (rf && !rf.dataset.filled) {
    rf.innerHTML = '<option value="">' + encEsc(encTr('All rarities', 'All rarities')) + '</option>' +
      ENC_RARITIES.map(r => '<option value="' + r + '">' + encEsc(encRarLabel(r)) + ' (' + (d.tally[r] || 0) + ')</option>').join('');
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
