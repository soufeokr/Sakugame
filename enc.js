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
const ENC_RARITIES = ['special', 'mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
const ENC_EDITABLE_RARITIES = ENC_RARITIES.filter(r => r !== 'special');
const ENC_RARITY_META = {
  special: { color: '#f4d389', edge: 'rgba(244,211,137,.8)' },
  mythic:    { color: '#c5bcff', edge: 'rgba(190,180,255,.75)' },
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
const ENC_REMOTE_DRAFT_KEY = 'saku-remote-rarity-drafts';
let encRemoteDrafts = {};
function encRemoteRarity(card) {
  if (!card || (card.edition==='strongest'||card.edition==='hoshi')) return '';
  const v = window.SAKU_REMOTE_RARITIES && window.SAKU_REMOTE_RARITIES[String(card.i)];
  return ENC_EDITABLE_RARITIES.indexOf(v) >= 0 ? v : '';
}
function encSaveRemoteDrafts() {
  try { localStorage.setItem(ENC_REMOTE_DRAFT_KEY, JSON.stringify(encRemoteDrafts)); } catch(e) {}
}
// Old remote-only drafts are migrated to local choices in encRarLoad.
function encPruneRemoteDrafts() { /* kept for backwards compatibility */ }


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
        if (c && ENC_EDITABLE_RARITIES.indexOf(legacy[k]) >= 0 && !store[String(c.i)]) {
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
  // A draft was the player's latest choice under the former priority rule.
  // Keep it and promote it to an active local preference, including when
  // the matching published value happens to be the same today.
  let drafts = {};
  try { drafts = JSON.parse(localStorage.getItem(ENC_REMOTE_DRAFT_KEY) || '{}') || {}; } catch(e) {}
  if (drafts && typeof drafts === 'object' && !Array.isArray(drafts)) {
    Object.keys(drafts).forEach(k => { if (ENC_EDITABLE_RARITIES.indexOf(drafts[k]) >= 0) store[k] = drafts[k]; });
    if (Object.keys(drafts).length) { try { localStorage.setItem(ENC_RARITY_ID_KEY, JSON.stringify(store)); localStorage.removeItem(ENC_REMOTE_DRAFT_KEY); } catch(e) {} }
  }
  encRarEdits = store;
  encRemoteDrafts = {};
  window.SAKU_LOCAL_RARITIES = encRarEdits;
  return store;
}
function encRarSave() {
  window.SAKU_LOCAL_RARITIES = encRarEdits;
  try { localStorage.setItem(ENC_RARITY_ID_KEY, JSON.stringify(encRarEdits)); } catch (e) {}
}
function encRarOriginal(card) { return card.r0 || card.r; }
function encRarityOf(card) {
  if ((card.edition==='strongest'||card.edition==='hoshi')) return encRarOriginal(card);
  const o = encRarEdits[String(card.i)];
  if (o && ENC_EDITABLE_RARITIES.indexOf(o) >= 0) return o;
  return encRemoteRarity(card) || encRarOriginal(card);
}
function encRarEdited(card) { return !!encRarEdits[String(card.i)]; }
function encTally() {
  const out = {};
  ENC_RARITIES.forEach(r => { out[r] = 0; });
  if (encFlat) encFlat.forEach(r => {
    const k = encRarityOf(r.card);
    out[k] = (out[k] || 0) + 1;
  });
  return out;
}
function encBlockTally(block) {
  const rar = {};
  block.cards.forEach(c => { const r = encRarityOf(c); rar[r] = (rar[r] || 0) + 1; });
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
      rar[c.r] = (rar[c.r] || 0) + 1; tally[c.r] = (tally[c.r] || 0) + 1;
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
  // Opening the encyclopedia can also migrate old number-keyed preferences.
  if (typeof cardPool !== 'undefined' && cardPool && typeof cardRarityFor === 'function') {
    cardPool.forEach(c => { if ((c.edition !== 'strongest' && c.edition !== 'hoshi')) c.rarity = cardRarityFor(c, c.rank); });
  }
  return true;
}

/* ---------------- filtering / sorting ---------------- */
function encVisible() {
  const q = encQuery.trim().toLowerCase();
  let rows = encFlat;
  if(document.getElementById('encWishlistOnly')?.checked)rows=rows.filter(r=>!!((cardState?.flags||{})[String(r.card.i)]||{}).wishlist);
  if (encRarity) rows = rows.filter(r => r.card.r === encRarity);
  if (q) {
    rows = rows.filter(r => {
      if (r.card.m.toLowerCase().indexOf(q) >= 0) return true;
      if ((r.card.edition==='strongest'||r.card.edition==='hoshi') && window.sakuSpecialNumber && (window.sakuSpecialNumber(r.card)||'').toLowerCase().indexOf(q)>=0) return true;
      if (r.block.label.toLowerCase().indexOf(q) >= 0) return true;
      if (r.card.s && r.card.s.toLowerCase().indexOf(q) >= 0) return true;
      if ((r.card.edition==='strongest'||r.card.edition==='hoshi') && r.card.series && r.card.series.toLowerCase().indexOf(q) >= 0) return true;
      if (r.card.a) for (let i = 0; i < r.card.a.length; i++) if (r.card.a[i].toLowerCase().indexOf(q) >= 0) return true;
      return false;
    });
  }
  if (encSort === 'name') {
    rows = rows.slice().sort((a, b) => a.card.m.localeCompare(b.card.m) || a.card.n - b.card.n);
  } else if (encSort === 'rarity') {
    rows = rows.slice().sort((a, b) =>
      ENC_RARITIES.indexOf(a.card.r) - ENC_RARITIES.indexOf(b.card.r) || a.card.n - b.card.n);
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
  if ((card.edition==='strongest'||card.edition==='hoshi') && typeof window.sakuStrongestCard === 'function') {
    return '<div class="enc-slot strongest-tile" role="button" tabindex="0" data-enc-card="' + card.n + '" title="' + encEsc(card.m) + (card.edition==='hoshi'?' — Hoshi':' — The Strongest') + '">' +
      '<span class="strongest-art">' + window.sakuStrongestCard(card,true) + '</span></div>'; 
  }
  const meta = ENC_RARITY_META[card.r] || ENC_RARITY_META.common;
  return '<div class="enc-slot' + (typeof window.sakuBasicCard === 'function' ? ' basic-rendered' : '') + (card.r === 'mythic' ? ' mythic' : '') + '" ' +
    'style="--er:' + meta.edge + '" role="button" tabindex="0" data-enc-card="' + card.n + '" ' +
    'title="' + encEsc(card.m) + '">' +
    (typeof window.sakuBasicCard === 'function' ? '<span class="basic-card-art">' + window.sakuBasicCard(card, true, {image:encThumb(card.u)}) + '</span>' : '') +
    '<span class="enc-num">' + encNum(card.n) + '</span>' +
    (/^\d+$/.test(String(card.i)) && card.k < 99999 ? '<span class="enc-rank" title="AniList">A#' + card.k + '</span>' : '') +
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
    '<span class="enc-tally-' + r + '" style="background:' + (ENC_RARITY_META[r] || {}).color + '">' +
    (r === 'uncommon' ? 'U' : r.charAt(0).toUpperCase()) + rar[r] + '</span>').join('');
  const from = st ? st.from : block.from, to = st ? st.to : block.to;
  return '<div class="enc-block-head">' +
    '<h3>' + encEsc(encFranchiseLabel(block.label)) + '</h3>' +
    '<span class="enc-block-nums">' + (block.edition==='strongest' ? 'S-001 – S-022' : block.edition==='hoshi' ? 'S-023 – S-044' : encNum(from) + ' – ' + encNum(to)) + '</span>' +
    '<span class="enc-block-tally">' + tally + '</span>' +
    '</div>';
}

function encRender(reset) {
  const grid = document.getElementById('encBinder');
  if (!grid || !encData) return;
  if (reset) { if (window.sakuBasicRelease) window.sakuBasicRelease(grid); encShown = 0; encBlockEls = {}; grid.innerHTML = ''; }

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
        if(window.sakuAppendWishlist)window.sakuAppendWishlist(tmp.firstElementChild,String(rows[encShown].card.i));
        holder.appendChild(tmp.firstElementChild);
        encShown++;
      }
    }
  }

  if (window.sakuBasicObserve) window.sakuBasicObserve(grid);
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
  const remote = encRemoteRarity(card);
  const cur = encRarityOf(card);
  const btns = ENC_EDITABLE_RARITIES.map(r => {
    const on = r === cur ? ' on' : '';
    return '<button type="button" class="enc-rar-btn' + on + '" data-enc-num="' + card.n + '" ' +
      'data-enc-rar="' + r + '" style="--rc:' + (ENC_RARITY_META[r] || {}).color + '" ' +
      'aria-pressed="' + (r === cur) + '" title="' + encEsc(encRarLabel(r)) + '">' +
      '<i style="background:' + (ENC_RARITY_META[r] || {}).color + '"></i>' +
      '<span>' + encEsc(encRarLabel(r)) + '</span></button>';
  }).join('');
  return '<div class="enc-rar-edit">' +
    (remote ? '<p class="enc-rar-edit-lab">' + encEsc(encTr('Published rarity:', 'Published rarity:')) + ' ' + encEsc(encRarLabel(remote)) + '. ' + encEsc(encTr('Your local choice takes priority.', 'Your local choice takes priority.')) + '</p>' : '') +
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

let encDetailFocus=null;
function encOpenCard(n) {
  if(!encFlat)return;const found=encFlat.find(x=>x.card.n===n);if(!found)return;
  const card=found.card,block=found.block,box=document.getElementById('encDetail');if(!box)return;
  if(!box.classList.contains('show'))encDetailFocus=document.activeElement;
  const special=card.edition==='strongest'||card.edition==='hoshi',meta=ENC_RARITY_META[card.r]||ENC_RARITY_META.common,id=String(card.i),count=Number((cardState&&cardState.cards||{})[id])||0;
  const lang=(window.SAKU_I18N||{}).lang||'en',w=({fr:{label:'CARTE / ENCYCLOPÉDIE',universe:'Univers',rarity:'Rareté',edition:'Édition',number:'Numéro',copies:'Dans ta collection',owned:'Possédée',missing:'Pas encore obtenue',close:'Fermer',rank:'Classement AniList',ordinary:'Classique',view:'Voir sur AniList',also:'Aussi connu sous',edit:'Outils de rareté (test)'},en:{label:'CARD / ENCYCLOPEDIA',universe:'Universe',rarity:'Rarity',edition:'Edition',number:'Number',copies:'In your collection',owned:'Owned',missing:'Not yet owned',close:'Close',rank:'AniList rank',ordinary:'Basic',view:'View on AniList',also:'Also known as',edit:'Rarity tools (test)'},es:{label:'CARTA / ENCICLOPEDIA',universe:'Universo',rarity:'Rareza',edition:'Edición',number:'Número',copies:'En tu colección',owned:'En posesión',missing:'Aún no conseguida',close:'Cerrar',rank:'Clasificación AniList',ordinary:'Básica',view:'Ver en AniList',also:'También conocido como',edit:'Herramientas de rareza (prueba)'}})[lang]||{};
  const number=special?(window.sakuSpecialNumber(card)||'—'):encNum(card.n),series=card.series||encFranchiseLabel(block.label)||'—';
  const art=special?'<div class="enc-detail-card strongest-detail"><span class="strongest-art">'+window.sakuStrongestCard(card)+'</span></div>':'<div class="enc-detail-card basic-rendered'+(card.r==='mythic'?' mythic':'')+'"><span class="basic-card-art">'+window.sakuBasicCard(card,false,{series})+'</span></div>';
  const row=(k,v)=>'<div class="card-detail-row"><dt>'+encEsc(k)+'</dt><dd>'+v+'</dd></div>';
  const link=/^\d+$/.test(id)?'<a class="card-detail-link" href="https://anilist.co/character/'+encodeURIComponent(id)+'" target="_blank" rel="noopener">'+encEsc(w.view)+' <span aria-hidden="true">↗</span></a>':'';
  const alt=card.a&&card.a.length?'<p class="enc-detail-alt"><strong>'+encEsc(w.also)+' :</strong> '+encEsc(card.a.join(' · '))+'</p>':'';
  const edit=window.SAKU_TEST_STUB&&!special?'<details class="enc-test-rarity"><summary>'+encEsc(w.edit)+'</summary>'+encRarPickerHtml(card)+'</details>':'';
  box.innerHTML='<article class="card-detail-panel enc-info-panel"><button class="card-detail-close" type="button" onclick="encCloseDetail()" aria-label="'+encEsc(w.close)+'">×</button><div class="card-detail-visual"><span class="card-detail-eyebrow">SAKUGAME / CARDS</span>'+art+'<span class="card-detail-caption">'+encEsc(number)+'</span></div><section class="card-detail-info enc-detail-meta"><span class="card-detail-eyebrow">'+encEsc(w.label)+'</span><h2>'+encEsc(card.m)+'</h2><p class="card-detail-series">'+encEsc(series)+'</p><div class="card-detail-status '+(count?'owned':'missing')+'">'+encEsc(count?w.owned:w.missing)+'</div><dl>'+row(w.universe,encEsc(series))+row(w.rarity,'<strong style="color:'+encEsc(meta.color)+'">'+encEsc(encRarLabel(card.r))+'</strong>')+row(w.edition,encEsc(card.edition==='hoshi'?'Hoshi':card.edition==='strongest'?'The Strongest':w.ordinary))+row(w.number,encEsc(number))+row(w.copies,'× '+count)+(!special&&/^\d+$/.test(id)&&card.k<99999?row(w.rank,'#'+encEsc(card.k)):'')+'</dl>'+alt+link+edit+'</section></article>';
  box.classList.add('show');if(window.sakuDetailControls)window.sakuDetailControls(box,id,'encyclopedia');if(window.sakuCardLevelsRender)window.sakuCardLevelsRender(box.querySelector('.enc-detail-meta'),id);document.body.style.overflow='hidden';box.querySelector('.card-detail-close').focus({preventScroll:true});
}
/* ---------------- rarity editing ---------------- */
function encFind(n) {
  if (!encFlat) return null;
  for (let i = 0; i < encFlat.length; i++) if (encFlat[i].card.n === n) return encFlat[i];
  return null;
}
function encApplyEdits() {
  window.dispatchEvent(new CustomEvent('saku-rarity-change'));
  // Keep collection, owned statistics and future booster rolls in sync too.
  if (typeof cardPool !== 'undefined' && cardPool && typeof cardRarityFor === 'function') {
    cardPool.forEach(c => { if ((c.edition !== 'strongest' && c.edition !== 'hoshi')) c.rarity = cardRarityFor(c, c.rank); });
    if (typeof cardState !== 'undefined' && cardState) { if (typeof cardsRenderStats === 'function') cardsRenderStats(); if (typeof cardsRenderAlbum === 'function') cardsRenderAlbum(); }
  }
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
  if (!found || (found.card.edition==='strongest'||found.card.edition==='hoshi') || ENC_EDITABLE_RARITIES.indexOf(r) < 0) return;
  const card = found.card;
  // Explicit selections remain local overrides, even if they currently match
  // the published/build value; Reset removes the override instead.
  encRarEdits[String(card.i)] = r;
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
  encRarEdits = {}; encRemoteDrafts = {}; encSaveRemoteDrafts();
  encRarSave();
  encSyncRarities();
  encApplyEdits();
}
/* Back up / restore the edits as a file, so a cleared cache, another
   browser or a second machine can pick them up again.                 */
function encExportRarities() {
  // Export the published base, overlaid by the player's local choices.
  const published = window.SAKU_REMOTE_RARITIES || {};
  const merged = Object.assign({}, published);
  Object.keys(encRarEdits).forEach(k => { if (ENC_EDITABLE_RARITIES.indexOf(encRarEdits[k]) >= 0) merged[k] = encRarEdits[k]; });
  Object.keys(encRemoteDrafts).forEach(k => { if (ENC_EDITABLE_RARITIES.indexOf(encRemoteDrafts[k]) >= 0) merged[k] = encRemoteDrafts[k]; });
  const n = Object.keys(merged).length;
  if (!n) { alert(encTr('No rarity edits to save yet.', 'No rarity edits to save yet.')); return; }
  const names = {};
  encData.list.forEach(b => b.cards.forEach(c => { names[String(c.i)] = c.m; }));
  const blob = new Blob([JSON.stringify({
    kind: 'sakugame-encyclopedia-rarities', version: 2, saved: new Date().toISOString(),
    edits: merged, names: names
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
      if (ENC_EDITABLE_RARITIES.indexOf(edits[k]) >= 0) clean[String(k)] = edits[k];
    });
    // Import updates matching choices without deleting unrelated local edits.
    encRemoteDrafts = {};
    encSaveRemoteDrafts();
    encRarEdits = Object.assign({}, encRarEdits, clean);
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
  if(encDetailFocus&&encDetailFocus.isConnected)encDetailFocus.focus({preventScroll:true});encDetailFocus=null;
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
      '<span class="enc-legend-chip' + (r === 'mythic' ? ' mythic' : '') + '"><i style="background:' + (ENC_RARITY_META[r] || {}).color + '"></i>' +
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
    encTr('including special cards', 'including special cards');
  const rf = document.getElementById('encRarityFilter');
  if (rf) {
    const tal = encTally();
    const keep = rf.value;
    rf.innerHTML = '<option value="">' + encEsc(encTr('All rarities', 'All rarities')) + '</option>' +
      ENC_RARITIES.map(r => '<option value="' + r + '">' + encEsc(encRarLabel(r)) + ' (' + (tal[r] || 0) + ')</option>').join('');
    rf.value = keep;
    rf.dataset.filled = '1';
  }
  if(window.sakuRarityChips)window.sakuRarityChips('encRarityFilter','encRarityChips');
}

function encOpen() {
  if(!cardState)cardsLoad();
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
