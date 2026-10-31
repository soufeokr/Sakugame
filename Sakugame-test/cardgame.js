/* ============================================================
   🎴 SAKUGAME — ANIME CARDS (cardgame.js)
   ------------------------------------------------------------
   A collectible card game in the spirit of Kyara / Yu-Gi-Oh! /
   Pokémon: you open free boosters, you collect anime characters,
   every card carries a rarity, and the album tracks your progress.

   • The pool is the site's own 5000 AniList characters (real art,
     real names, real series) — nothing extra to download.
   • Rarity comes from the imported sheet when one is present
     (`card-rarity.js` → CARD_RARITY), otherwise from the AniList
     favourites rank, which is already a popularity order.
   • One free booster every 10 minutes, up to 15 in reserve.
   • Guests keep their collection in localStorage; a Discord
     account syncs it to the database (and merges the guest
     collection in on the first sign-in).
   ============================================================ */

/* ---------------- tunables ---------------- */
const CARD_FREE_MS = 10 * 60 * 1000;      // ⏱ one free booster every 10 minutes
const CARD_MAX_STORED = 15;               // 📦 reserve cap
const CARD_PACK_SIZE = 5;                 // 🎴 cards per booster
const CARD_LS = 'saku-cards';             // guest storage key
const CARD_ALBUM_STEP = 240;              // album "show more" chunk

/* Rarity tiers. `odds` = % chance per card slot; the label is translated
   through the site dictionary (t('Common') … t('Mythic')). */
const CARD_RARITIES = [
  { key: 'common',    odds: 45, color: '#9aa5b1', edge: 'rgba(154,165,177,.55)' },
  { key: 'uncommon',  odds: 28, color: '#4caf50', edge: 'rgba(76,175,80,.55)' },
  { key: 'rare',      odds: 15, color: '#02a9ff', edge: 'rgba(2,169,255,.55)' },
  { key: 'epic',      odds: 8,  color: '#9d6bff', edge: 'rgba(157,107,255,.60)' },
  { key: 'legendary', odds: 3,  color: '#ffa726', edge: 'rgba(255,167,38,.60)' },
  { key: 'mythic',    odds: 1,  color: '#ff5252', edge: 'rgba(255,82,82,.60)' }
];
const CARD_RARITY_ORDER = CARD_RARITIES.map(r => r.key);
const CARD_RARITY_BY_KEY = {};
CARD_RARITIES.forEach(r => { CARD_RARITY_BY_KEY[r.key] = r; });
/* Fallback bands over the AniList favourites rank (1 = most favourited). */
const CARD_AUTO_BANDS = [[50, 'mythic'], [300, 'legendary'], [1000, 'epic'],
  [2500, 'rare'], [4000, 'uncommon'], [Infinity, 'common']];

/* ---------------- state ---------------- */
let cardState = null;          // { cards:{id:count}, boosters, nextFree, opened, dupes }
let cardPool = null;           // [{ id,name,image,series,rank,rarity }]
let cardPoolBySeries = null;   // { series: [poolIndex…] }
let cardPoolById = null;       // { id: entry }
let cardReveal = null;         // [{ char, isNew }] while a booster is open
let cardRevealDone = false;
let cardAlbumLimit = CARD_ALBUM_STEP;
let cardSaveTimer = null;
let cardTickTimer = null;

/* ---------------- helpers ---------------- */
function cardDefaultState() {
  return { cards: {}, boosters: 0, nextFree: 0, opened: 0, dupes: 0 };
}
function cardNormalize(s) {
  const d = cardDefaultState();
  if (!s || typeof s !== 'object') return d;
  if (s.cards && typeof s.cards === 'object') {
    Object.keys(s.cards).forEach(k => {
      const n = parseInt(s.cards[k], 10);
      if (k && n > 0) d.cards[k] = n;
    });
  }
  d.boosters = Math.max(0, Math.min(CARD_MAX_STORED, parseInt(s.boosters, 10) || 0));
  d.nextFree = Math.max(0, parseInt(s.nextFree, 10) || 0);
  d.opened = Math.max(0, parseInt(s.opened, 10) || 0);
  d.dupes = Math.max(0, parseInt(s.dupes, 10) || 0);
  return d;
}
function cardRarityLabel(key) {
  const k = CARD_RARITY_BY_KEY[key] ? key : 'common';
  const cap = k.charAt(0).toUpperCase() + k.slice(1);
  return (typeof t === 'function') ? t(cap) : cap;
}
function cardRarityMeta(key) { return CARD_RARITY_BY_KEY[key] || CARD_RARITY_BY_KEY.common; }

/* Rarity of one character: the imported sheet wins, else the AniList rank. */
function cardRarityFor(char, rank) {
  if (typeof CARD_RARITY !== 'undefined' && CARD_RARITY) {
    const v = CARD_RARITY[char.id] || CARD_RARITY[String(char.id)];
    if (v && CARD_RARITY_BY_KEY[String(v).toLowerCase()]) return String(v).toLowerCase();
  }
  for (let i = 0; i < CARD_AUTO_BANDS.length; i++) {
    if (rank <= CARD_AUTO_BANDS[i][0]) return CARD_AUTO_BANDS[i][1];
  }
  return 'common';
}

/* The pool is built lazily: characters.js arrives with sakuDataReady. */
function cardBuildPool() {
  if (cardPool) return cardPool;
  const list = (typeof GENERIC_CHARACTERS !== 'undefined' && GENERIC_CHARACTERS) ? GENERIC_CHARACTERS : [];
  cardPool = [];
  cardPoolBySeries = {};
  cardPoolById = {};
  list.forEach((c, i) => {
    if (!c || !c.id || !c.image) return;
    const rank = i + 1;
    const entry = { id: c.id, name: c.name || '?', image: c.image, series: c.series || '', rank: rank, rarity: cardRarityFor(c, rank) };
    const idx = cardPool.length;
    cardPool.push(entry);
    const key = entry.series || '';
    if (!cardPoolBySeries[key]) cardPoolBySeries[key] = [];
    cardPoolBySeries[key].push(idx);
    cardPoolById[String(entry.id)] = entry;
  });
  return cardPool;
}
function cardPoolReady() {
  cardBuildPool();
  return cardPool.length > 0;
}

/* ---------------- storage: guest (localStorage) / account (RTDB) ---------------- */
function cardReadLocal() {
  try { return cardNormalize(JSON.parse(localStorage.getItem(CARD_LS) || 'null')); } catch (e) { return cardDefaultState(); }
}
function cardWriteLocal() {
  try { localStorage.setItem(CARD_LS, JSON.stringify(cardState)); } catch (e) {}
}
function cardsLoad() {
  if (currentAccount && currentAccount.cards) cardState = cardNormalize(currentAccount.cards);
  else cardState = cardReadLocal();
  return cardState;
}
function cardsSave(now) {
  if (!cardState) return;
  cardWriteLocal();                                   // always keep a local mirror
  if (cardSaveTimer) { clearTimeout(cardSaveTimer); cardSaveTimer = null; }
  const push = () => {
    cardSaveTimer = null;
    if (!currentAccount) return;
    try { sakuAcctRef(sakuMyDcId()).child('cards').set(cardState); } catch (e) {}
  };
  if (now) push();
  else cardSaveTimer = setTimeout(push, 1200);        // debounce rapid clicks
}
/* Called when a Discord account is adopted: fold the guest collection in. */
function cardsMergeOnSignIn(node) {
  const local = cardReadLocal();
  const remote = cardNormalize((node && node.cards) || null);
  const merged = cardNormalize(null);
  const all = {};
  Object.keys(local.cards).forEach(k => { all[k] = Math.max(all[k] || 0, local.cards[k]); });
  Object.keys(remote.cards).forEach(k => { all[k] = Math.max(all[k] || 0, remote.cards[k]); });
  merged.cards = all;
  merged.boosters = Math.max(local.boosters, remote.boosters);
  merged.opened = local.opened + remote.opened;
  merged.dupes = local.dupes + remote.dupes;
  merged.nextFree = Math.min(local.nextFree || Infinity, remote.nextFree || Infinity);
  if (!isFinite(merged.nextFree)) merged.nextFree = 0;
  cardState = merged;
  cardWriteLocal();
  if (currentAccount) {
    currentAccount.cards = merged;
    try { sakuAcctRef(sakuMyDcId()).child('cards').set(merged); } catch (e) {}
  }
}

/* ---------------- free booster clock ---------------- */
function cardsTickFree(silent) {
  if (!cardState) return;
  const now = Date.now();
  let changed = false;
  while (cardState.boosters < CARD_MAX_STORED && cardState.nextFree && now >= cardState.nextFree) {
    cardState.boosters++;
    cardState.nextFree = cardState.nextFree + CARD_FREE_MS;
    changed = true;
  }
  if (cardState.boosters >= CARD_MAX_STORED) cardState.nextFree = 0;
  if (!cardState.nextFree && cardState.boosters < CARD_MAX_STORED) {
    cardState.nextFree = now + CARD_FREE_MS;           // first ever booster is instant
    changed = true;
  }
  if (changed && !silent) cardsSave();
}
function cardsStartClock() {
  if (cardTickTimer) return;
  cardTickTimer = setInterval(() => {
    if (!document.getElementById('cardsScreen')) return;
    const before = cardState ? cardState.boosters : 0;
    cardsTickFree();
    cardsRenderTop();
    if (cardState && cardState.boosters !== before) {
      cardsRenderStats();
      cardsRenderAlbum();
    }
  }, 1000);
}
function cardsTimeLeft() {
  if (!cardState || !cardState.nextFree) return 0;
  return Math.max(0, cardState.nextFree - Date.now());
}

/* ---------------- booster rolling ---------------- */
function cardsRollRarity() {
  let roll = Math.random() * 100;
  for (let i = 0; i < CARD_RARITIES.length; i++) {
    if (roll < CARD_RARITIES[i].odds) return CARD_RARITIES[i].key;
    roll -= CARD_RARITIES[i].odds;
  }
  return 'common';
}
function cardsPickOf(candidates, rarity) {
  const want = CARD_RARITY_ORDER.indexOf(rarity);
  const n = CARD_RARITY_ORDER.length;
  // Widen from the rolled rarity in BOTH directions (one step rarer, one step
  // easier, then further out) so a small series still yields its own cards.
  for (let step = 0; step < n; step++) {
    const at = [want - step, want + step];
    for (let k = 0; k < at.length; k++) {
      if (at[k] < 0 || at[k] >= n || (step > 0 && at[k] === want)) continue;
      const pool = candidates.filter(c => c.rarity === CARD_RARITY_ORDER[at[k]]);
      if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  return null;
}
function cardsRollPack(series) {
  cardBuildPool();
  let candidates = cardPool;
  if (series) {
    const idx = cardPoolBySeries[series] || [];
    candidates = idx.map(i => cardPool[i]);
  }
  if (!candidates.length) candidates = cardPool;
  const picks = [];
  for (let i = 0; i < CARD_PACK_SIZE; i++) {
    const rarity = cardsRollRarity();
    const c = cardsPickOf(candidates, rarity) || cardPool[Math.floor(Math.random() * cardPool.length)];
    picks.push(c);
  }
  return picks;
}

/* ---------------- booster opening UI ---------------- */
/* The pack tears itself open before the reveal lands — same click, one
   beat of theatre.  If there is no booster to open we skip the theatre
   and let cardsOpenBooster() say why.                                  */
function cardsTearPack(btn) {
  const ready = cardState && cardState.boosters > 0;
  if (!ready || !btn || btn.classList.contains('tearing')) { cardsOpenBooster(); return; }
  btn.classList.add('tearing');
  setTimeout(() => { btn.classList.remove('tearing'); cardsOpenBooster(); }, 420);
}
function cardsOpenBooster() {
  if (!cardPoolReady()) { showNotification('The character data is still loading — try again in a second.'); return; }
  cardsLoad();
  cardsTickFree(true);
  if (cardState.boosters <= 0) {
    const s = cardsTimeLeft();
    const mm = Math.floor(s / 60000), ss = Math.floor((s % 60000) / 1000);
    showNotification((typeof t === 'function' ? t('No booster ready — next free one in {t}') : 'No booster ready — next free one in {t}')
      .replace('{t}', mm + ':' + ('0' + ss).slice(-2)));
    return;
  }
  const sel = document.getElementById('cardsSeries');
  const series = sel && sel.value ? sel.value : '';
  cardState.boosters--;
  cardState.opened++;
  cardReveal = cardsRollPack(series).map(c => ({ char: c, isNew: !cardState.cards[c.id] }));
  cardRevealDone = false;
  cardsSave();
  cardsRenderReveal();
  cardsRenderTop();
  cardsRenderStats();
}
function cardsRevealAt(i) {
  if (!cardReveal || !cardReveal[i] || cardReveal[i].flipped) return;
  const item = cardReveal[i];
  item.flipped = true;
  const id = item.char.id;
  const had = cardState.cards[id] || 0;
  cardState.cards[id] = had + 1;
  if (had > 0) { cardState.dupes++; }
  cardsSave();
  const slot = document.getElementById('cardsSlot' + i);
  if (slot) {
    slot.classList.add('flipped');
    const inner = slot.querySelector('.ac-flip-inner');
    if (inner) {
      const meta = cardRarityMeta(item.char.rarity);
      inner.querySelector('.ac-face-back').innerHTML = cardsCardFace(item.char, had + 1, true);
      inner.style.setProperty('--ac-edge', meta.edge);
      inner.style.setProperty('--ac-color', meta.color);
    }
    if (had > 0) slot.classList.add('is-dupe');
  }
  cardsRenderStats();
  if (cardReveal.every(p => p.flipped)) cardsRevealDone = true;
  const done = document.getElementById('cardsRevealDone');
  if (done) done.classList.toggle('ready', cardRevealDone);
  const title = document.getElementById('cardsRevealTitle');
  if (title && !cardRevealDone) {
    const left = cardReveal.filter(p => !p.flipped).length;
    title.textContent = (typeof t === 'function' ? t('{n} card(s) left to flip') : '{n} card(s) left to flip').replace('{n}', left);
  } else if (title) {
    title.textContent = (typeof t === 'function' ? t('Nice pulls!') : 'Nice pulls!');
  }
}
function cardsRenderReveal() {
  const box = document.getElementById('cardsReveal');
  const grid = document.getElementById('cardsRevealGrid');
  if (!box || !grid || !cardReveal) return;
  grid.innerHTML = '';
  cardReveal.forEach((item, i) => {
    const slot = document.createElement('div');
    slot.className = 'ac-slot';
    slot.id = 'cardsSlot' + i;
    const meta = cardRarityMeta(item.char.rarity);
    slot.style.setProperty('--ac-edge', meta.edge);
    slot.style.setProperty('--ac-color', meta.color);
    slot.innerHTML =
      '<div class="ac-flip-inner">' +
      '<div class="ac-face ac-face-front">' +
        '<span class="ac-back" aria-hidden="true">' +
          '<span class="ac-back-foil"></span>' +
          '<span class="ac-back-crimp"></span>' +
          '<span class="ac-back-mark">SAKUGAME</span>' +
          '<span class="ac-back-q">?</span>' +
          '<span class="ac-back-shine"></span>' +
        '</span>' +
      '</div>' +
      '<div class="ac-face ac-face-back"></div>' +
      '</div>';
    slot.addEventListener('click', () => cardsRevealAt(i));
    grid.appendChild(slot);
  });
  const title = document.getElementById('cardsRevealTitle');
  if (title) title.textContent = (typeof t === 'function' ? t('Tap each card to flip it!') : 'Tap each card to flip it!');
  const done = document.getElementById('cardsRevealDone');
  if (done) done.classList.remove('ready');
  box.classList.add('show');
  try { document.body.style.overflow = 'hidden'; } catch (e) {}
}
function cardsCloseReveal() {
  const box = document.getElementById('cardsReveal');
  if (box) box.classList.remove('show');
  try { document.body.style.overflow = ''; } catch (e) {}
  cardReveal = null;
  cardsSave(true);
  cardsRenderAlbum();
  cardsRenderTop();
}

/* ---------------- the card face ---------------- */
/* Graphics quality (Settings → Display → High / Low).  HIGH asks the CDN
   for its full-size render everywhere; LOW always takes the small one —
   about a quarter of the bytes.  app.js owns the setting; this guard keeps
   cardgame.js working when it is loaded on its own (tests, previews).   */
function cardGfxLow() {
  if (typeof sakuGfxLow === 'function') return sakuGfxLow();
  try { return localStorage.getItem('saku-graphics') === 'low'; } catch (e) { return false; }
}
/* The album tile is only ~130 px, so LOW takes the CDN's `medium` render.
   HIGH keeps the full `large` file.  Booster faces and the detail modal
   always use `large`.                                                   */
function cardThumb(url) {
  const u = String(url || '');
  if (u.indexOf('/character/large/') < 0) return u;
  return cardGfxLow() ? u.replace('/character/large/', '/character/medium/') : u;
}
function cardsCardFace(char, count, big) {
  const meta = cardRarityMeta(char.rarity);
  const badge = count > 1
    ? '<span class="ac-count">×' + count + '</span>'
    : '<span class="ac-new">' + ((typeof t === 'function') ? t('NEW') : 'NEW') + '</span>';
  return '' +
    '<span class="ac-rar" style="background:' + meta.color + '"></span>' +
    '<span class="ac-art"><img src="' + escapeHtml(String(char.image)) + '" alt="' + escapeHtml(String(char.name)) + '" ' +
      'loading="lazy" decoding="async" fetchpriority="high" onerror="this.style.opacity=0"></span>' +
    '<span class="ac-name">' + escapeHtml(String(char.name)) + '</span>' +
    '<span class="ac-series">' + escapeHtml(String(char.series || '')) + '</span>' +
    '<span class="ac-foot"><b style="color:' + meta.color + '">' + escapeHtml(cardRarityLabel(char.rarity)) + '</b>' +
    '<i>#' + escapeHtml(String(char.rank)) + '</i></span>' +
    (big ? badge : '');
}

/* ---------------- album ---------------- */
function cardsOwnedCount() { return cardState ? Object.keys(cardState.cards).length : 0; }
function cardsTotalCount() { return Object.keys((cardState && cardState.cards) || {}).length; }
function cardsRenderStats() {
  const box = document.getElementById('cardsStats');
  if (!box || !cardState) return;
  const owned = cardsOwnedCount();
  const total = cardPool ? cardPool.length : 0;
  const pct = total ? Math.round(owned * 1000 / total) / 10 : 0;
  let tiers = '';
  CARD_RARITY_ORDER.forEach(k => {
    const have = Object.keys(cardState.cards).filter(id => {
      const e = cardPoolById && cardPoolById[String(id)];
      return e && e.rarity === k;
    }).length;
    const meta = cardRarityMeta(k);
    tiers += '<span class="ac-tier"><i style="background:' + meta.color + '"></i>' + escapeHtml(cardRarityLabel(k)) +
      ' <b>' + have + '</b></span>';
  });
  box.innerHTML =
    '<div class="ac-prog"><div class="ac-prog-bar"><span style="width:' + Math.min(100, pct) + '%"></span></div>' +
    '<div class="ac-prog-txt"><b>' + owned + '</b> / ' + total + ' ' + ((typeof t === 'function') ? t('collected') : 'collected') +
    ' · <b>' + pct + '%</b></div></div>' +
    '<div class="ac-tiers">' + tiers + '</div>' +
    '<div class="ac-sub">' + ((typeof t === 'function') ? t('Boosters opened') : 'Boosters opened') + ': <b>' + cardState.opened +
    '</b> · ' + ((typeof t === 'function') ? t('duplicates') : 'duplicates') + ': <b>' + cardState.dupes + '</b></div>';
}
function cardsRenderTop() {
  const cnt = document.getElementById('cardsBoosterCount');
  if (cnt && cardState) cnt.textContent = cardState.boosters;
  const timer = document.getElementById('cardsTimer');
  if (timer) {
    if (cardState && cardState.boosters >= CARD_MAX_STORED) {
      timer.textContent = (typeof t === 'function') ? t('Reserve full!') : 'Reserve full!';
    } else {
      const s = cardsTimeLeft();
      const mm = Math.floor(s / 60000), ss = Math.floor((s % 60000) / 1000);
      timer.textContent = (typeof t === 'function' ? t('Next free booster in {t}') : 'Next free booster in {t}')
        .replace('{t}', mm + ':' + ('0' + ss).slice(-2));
    }
  }
  const btn = document.getElementById('cardsOpenBtn');
  if (btn) {
    const ready = cardState && cardState.boosters > 0;
    btn.classList.toggle('ready', !!ready);
    btn.disabled = !cardPoolReady();
  }
}
function cardsRenderAlbum() {
  const grid = document.getElementById('cardsAlbum');
  if (!grid || !cardState) return;
  cardBuildPool();
  const q = ((document.getElementById('cardsSearch') || {}).value || '').trim().toLowerCase();
  const rf = (document.getElementById('cardsRarityFilter') || {}).value || '';
  const sort = (document.getElementById('cardsSort') || {}).value || 'rank';
  const ownedOnly = (document.getElementById('cardsOwnedOnly') || {}).checked !== false;
  const byId = {};
  Object.keys(cardState.cards).forEach(id => { byId[String(id)] = cardState.cards[id]; });

  let rows = cardPool.map(p => {
    const count = byId[String(p.id)] || 0;
    return { p: p, count: count, key: count ? (1000000 - count) * 100000 + p.rank : 100000000 + p.rank };
  });
  if (ownedOnly) rows = rows.filter(r => r.count > 0);
  if (rf) rows = rows.filter(r => r.p.rarity === rf);
  if (q) rows = rows.filter(r => r.p.name.toLowerCase().indexOf(q) >= 0 || (r.p.series || '').toLowerCase().indexOf(q) >= 0);
  if (sort === 'name') rows.sort((a, b) => a.p.name.localeCompare(b.p.name));
  else if (sort === 'rarity') rows.sort((a, b) => CARD_RARITY_ORDER.indexOf(b.p.rarity) - CARD_RARITY_ORDER.indexOf(a.p.rarity) || a.p.rank - b.p.rank);
  else rows.sort((a, b) => a.key - b.key);

  const more = document.getElementById('cardsMoreBtn');
  const shown = rows.slice(0, cardAlbumLimit);
  if (more) {
    more.style.display = rows.length > cardAlbumLimit ? '' : 'none';
    more.textContent = ((typeof t === 'function') ? t('Show more') : 'Show more') + ' (' + (rows.length - cardAlbumLimit) + ')';
  }
  if (!shown.length) {
    grid.innerHTML = '<p class="ac-empty">' + ((typeof t === 'function')
      ? t('No card matches — open a booster to start your collection!') : 'No card matches — open a booster to start your collection!') + '</p>';
    return;
  }
  grid.innerHTML = shown.map(r => {
    const meta = cardRarityMeta(r.p.rarity);
    return '<div class="ac-tile' + (r.count ? '' : ' missing') + '" style="--ac-edge:' + meta.edge + ';--ac-color:' + meta.color + '" ' +
      'onclick="cardsOpenDetail(' + r.p.id + ')" role="button" tabindex="0" ' +
      'onkeydown="if(event.key===String.fromCharCode(13))cardsOpenDetail(' + r.p.id + ')">' +
      '<span class="ac-rar" style="background:' + meta.color + '"></span>' +
      '<span class="ac-art"><img src="' + escapeHtml(cardThumb(r.p.image)) + '" alt="' + escapeHtml(String(r.p.name)) + '" ' +
      'loading="lazy" decoding="async" fetchpriority="low" ' +
      'onload="this.classList.add(\'in\')" onerror="this.style.opacity=0"></span>' +
      '<span class="ac-name">' + escapeHtml(String(r.p.name)) + '</span>' +
      '<span class="ac-series">' + escapeHtml(String(r.p.series || '')) + '</span>' +
      '<span class="ac-foot"><b style="color:' + meta.color + '">' + escapeHtml(cardRarityLabel(r.p.rarity)) + '</b>' +
      (r.count > 1 ? '<i class="ac-own">×' + r.count + '</i>' : '') + '</span>' +
      '</div>';
  }).join('');
}
function cardsShowMore() { cardAlbumLimit += CARD_ALBUM_STEP; cardsRenderAlbum(); }

/* ---------------- card detail ---------------- */
function cardsOpenDetail(id) {
  cardBuildPool();
  const entry = (cardPoolById && cardPoolById[String(id)]) || null;
  const box = document.getElementById('cardsDetail');
  if (!entry || !box) return;
  const count = (cardState && cardState.cards[String(id)]) || 0;
  const meta = cardRarityMeta(entry.rarity);
  box.innerHTML =
    '<div class="ac-detail-card" style="--ac-edge:' + meta.edge + ';--ac-color:' + meta.color + '">' +
    cardsCardFace(entry, count, true) +
    '</div>' +
    '<div class="ac-detail-meta">' +
    '<h3>' + escapeHtml(entry.name) + '</h3>' +
    '<p>' + escapeHtml(entry.series || '—') + '</p>' +
    '<p><b style="color:' + meta.color + '">' + escapeHtml(cardRarityLabel(entry.rarity)) + '</b> · ' +
    ((typeof t === 'function') ? t('AniList rank') : 'AniList rank') + ' #' + entry.rank + '</p>' +
    '<p>' + (count
      ? ((typeof t === 'function') ? t('You own {n} copy(ies)') : 'You own {n} copy(ies)').replace('{n}', count)
      : ((typeof t === 'function') ? t('Not in your collection yet') : 'Not in your collection yet')) + '</p>' +
    '<a class="secondary" href="https://anilist.co/character/' + entry.id + '" target="_blank" rel="noopener">AniList ↗</a>' +
    '</div>';
  box.classList.add('show');
  try { document.body.style.overflow = 'hidden'; } catch (e) {}
}
function cardsCloseDetail() {
  const box = document.getElementById('cardsDetail');
  if (box) box.classList.remove('show');
  try { document.body.style.overflow = ''; } catch (e) {}
}

/* ---------------- filters wiring ---------------- */
function cardsFillFilters() {
  const sel = document.getElementById('cardsSeries');
  if (sel && !sel.dataset.filled) {
    cardBuildPool();
    const counts = {};
    Object.keys(cardPoolBySeries).forEach(s => { if (s) counts[s] = cardPoolBySeries[s].length; });
    const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b)).slice(0, 60);
    sel.innerHTML = '<option value="">' + ((typeof t === 'function') ? t('Any series') : 'Any series') + '</option>' +
      top.map(s => '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + ' (' + counts[s] + ')</option>').join('');
    sel.dataset.filled = '1';
  }
  const rf = document.getElementById('cardsRarityFilter');
  if (rf && !rf.dataset.filled) {
    rf.innerHTML = '<option value="">' + ((typeof t === 'function') ? t('All rarities') : 'All rarities') + '</option>' +
      CARD_RARITY_ORDER.slice().reverse().map(k =>
        '<option value="' + k + '">' + escapeHtml(cardRarityLabel(k)) + '</option>').join('');
    rf.dataset.filled = '1';
  }
}

/* ---------------- entry point ---------------- */
function showCards() {
  showScreen('cardsScreen');
  cardsEnsureReady();
}
function cardsEnsureReady() {
  cardsLoad();
  cardsTickFree(true);
  cardsFillFilters();
  cardsRenderTop();
  cardsRenderStats();
  cardAlbumLimit = CARD_ALBUM_STEP;
  cardsRenderAlbum();
  cardsStartClock();
  const note = document.getElementById('cardsSaveNote');
  if (note) {
    note.textContent = currentAccount
      ? ((typeof t === 'function') ? t('Your collection syncs with your Discord account.') : 'Your collection syncs with your Discord account.')
      : ((typeof t === 'function') ? t('Guests keep their collection in this browser.') : 'Guests keep their collection in this browser.');
  }
}
/* The character data arrives asynchronously — refresh the screen once it lands. */
(function cardsWaitForData() {
  const kick = () => {
    if (!cardPoolReady()) { setTimeout(kick, 400); return; }
    cardsFillFilters();
    if (document.getElementById('cardsScreen') && document.getElementById('cardsScreen').classList.contains('active')) {
      cardsRenderTop(); cardsRenderStats(); cardsRenderAlbum();
    }
  };
  if (typeof window !== 'undefined' && window.sakuDataReady && window.sakuDataReady.then) window.sakuDataReady.then(kick).catch(function () {});
  else setTimeout(kick, 600);
})();
