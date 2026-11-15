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
  { key: 'mythic',    odds: 1,  color: '#c5bcff', edge: 'rgba(190,180,255,.75)' },
  { key: 'special', odds: 0, color: '#f4d389', edge: 'rgba(244,211,137,.8)' }
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
let cardPoolBuiltWithBase = false;
let cardPoolBySeries = null;   // { series: [poolIndex…] }
let cardPoolById = null;       // { id: entry }
let cardReveal = null;         // [{ char, isNew }] while a booster is open
let cardRevealDone = false;
let cardAlbumLimit = CARD_ALBUM_STEP;
let cardSaveTimer = null;
let cardTickTimer = null;

/* ---------------- helpers ---------------- */
function cardDefaultState() {
  return { cards: {}, levels: {}, flags: {}, boosters: 0, nextFree: 0, opened: 0, dupes: 0 };
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
  // Levels count physical copies; omitted copies are level 0. Old collections migrate as level 0.
  if (s.levels && typeof s.levels === 'object') Object.keys(s.levels).forEach(id => {
    let left=d.cards[id]||0, counts={};
    [3,2,1].forEach(level=>{let n=Math.max(0,parseInt((s.levels[id]||{})[level],10)||0);n=Math.min(left,n);if(n){counts[level]=n;left-=n;}});
    if(Object.keys(counts).length)d.levels[id]=counts;
  });
  if (s.flags && typeof s.flags === 'object') Object.keys(s.flags).forEach(id=>{let f=s.flags[id]||{},clean={};['wishlist','favorite','locked'].forEach(k=>{if(f[k]===true)clean[k]=true});if(Object.keys(clean).length)d.flags[id]=clean;});
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

/* The encyclopedia is the shared source of base rarities; never infer a
   different tier from the position of a card in the playable-character list. */
let cardEncyclopediaRarityIndex = null, cardEncyclopediaIndexSource = null;
function cardEncyclopediaRecord(id) {
  if (typeof ENCYCLOPEDIA === 'undefined' || !ENCYCLOPEDIA || !Array.isArray(ENCYCLOPEDIA.list)) return null;
  if (!cardEncyclopediaRarityIndex || cardEncyclopediaIndexSource !== ENCYCLOPEDIA) {
    cardEncyclopediaRarityIndex = Object.create(null); cardEncyclopediaIndexSource = ENCYCLOPEDIA;
    ENCYCLOPEDIA.list.forEach(g => { if (g.edition !== 'strongest' && g.edition !== 'hoshi') (g.cards || []).forEach(c => { cardEncyclopediaRarityIndex[String(c.i)] = c; }); });
  }
  return cardEncyclopediaRarityIndex[String(id)] || null;
}
/* Player overrides first, then the published sheet, then the shipped value. */
function cardRarityFor(char, rank) {
  if ((char.edition === 'strongest' || char.edition === 'hoshi')) return 'special';
  const local = (char.edition !== 'strongest' && char.edition !== 'hoshi') && window.SAKU_LOCAL_RARITIES && window.SAKU_LOCAL_RARITIES[String(char.id)];
  if (local && local !== 'special' && CARD_RARITY_BY_KEY[local]) return local;
  const remote = (char.edition !== 'strongest' && char.edition !== 'hoshi') && window.SAKU_REMOTE_RARITIES && window.SAKU_REMOTE_RARITIES[String(char.id)];
  if (remote && remote !== 'special' && CARD_RARITY_BY_KEY[remote]) return remote;
  const encyclopediaCard = cardEncyclopediaRecord(char.id != null ? char.id : char.i);
  if (encyclopediaCard) {
    const r = encyclopediaCard.r0 || encyclopediaCard.r;
    if (r && r !== 'special' && CARD_RARITY_BY_KEY[r]) return r;
  }
  if (typeof CARD_RARITY !== 'undefined' && CARD_RARITY) {
    const v = CARD_RARITY[char.id] || CARD_RARITY[String(char.id)];
    if (v && String(v).toLowerCase() !== 'special' && CARD_RARITY_BY_KEY[String(v).toLowerCase()]) return String(v).toLowerCase();
  }
  for (let i = 0; i < CARD_AUTO_BANDS.length; i++) {
    if (rank <= CARD_AUTO_BANDS[i][0]) return CARD_AUTO_BANDS[i][1];
  }
  return 'common';
}

/* The pool is built lazily: characters.js arrives with sakuDataReady. */
function cardBuildPool() {
  const base = (typeof GENERIC_CHARACTERS !== 'undefined' && GENERIC_CHARACTERS) ? GENERIC_CHARACTERS : [];
  // A route can request the pool before the deferred game data loads. Rebuild that
  // provisional pool once the full character list arrives.
  if (cardPool && (cardPoolBuiltWithBase || !base.length)) return cardPool;
  cardPoolBuiltWithBase = !!base.length;
  const extra = (typeof CARD_EXTRA_CHARACTERS !== 'undefined' && Array.isArray(CARD_EXTRA_CHARACTERS)) ? CARD_EXTRA_CHARACTERS : [];
  const special = (typeof CARD_STRONGEST !== 'undefined' && Array.isArray(CARD_STRONGEST)) ? CARD_STRONGEST : [];
  const list = base.concat(extra, special, typeof CARD_HOSHI!=='undefined'?CARD_HOSHI:[]);
  cardPool = [];
  cardPoolBySeries = {};
  cardPoolById = {};
  list.forEach((c, i) => {
    if (!c || !c.id || !c.image) return;
    const rank = i + 1;
    const entry = { id: c.id, name: c.name || '?', image: c.image, series: c.series || '', rank: rank, rarity: cardRarityFor(c, rank), edition: c.edition || '', collectibleOnly: !!c.collectibleOnly, specialNumber:c.specialNumber };
    if (typeof window.sakuBindCharacterName === 'function') window.sakuBindCharacterName(entry, 'name', entry.id);
    const idx = cardPool.length;
    cardPool.push(entry);
    const key = entry.series || '';
    if (!cardPoolBySeries[key]) cardPoolBySeries[key] = [];
    cardPoolBySeries[key].push(idx);
    cardPoolById[String(entry.id)] = entry;
  });
  return cardPool;
}
/* Incorporer les nouvelles éditions à un pool déjà initialisé, sans le réinitialiser. */
function sakuStrongestSyncPool() {
  if (!cardPool || typeof CARD_STRONGEST === 'undefined') return;
  CARD_STRONGEST.forEach(function(p) {
    const id=String(p.id), old=cardPoolById[id];
    if (old) { old.name=p.name; old.image=p.image; old.rarity='special';old.specialNumber=p.specialNumber; return; }
    const entry={id:p.id,name:p.name,image:p.image,series:p.series,rank:99999,rarity:'special',edition:'strongest',collectibleOnly:true,specialNumber:p.specialNumber};
    const idx=cardPool.length;cardPool.push(entry);cardPoolById[id]=entry;
    if (!cardPoolBySeries[entry.series]) cardPoolBySeries[entry.series]=[];
    cardPoolBySeries[entry.series].push(idx);
  });
  if (cardState) cardsRenderAlbum();
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
/* Bring catalogue-only owned cards into the album without adding them to draws. */
function sakuIncludeOwnedCards() {
  if (!cardState || !cardPool || typeof ENCYCLOPEDIA === 'undefined') return;
  const owned=cardState.cards||{};
  ENCYCLOPEDIA.list.forEach(group=>(group.cards||[]).forEach(c=>{
    const id=String(c.i);if(!owned[id]||cardPoolById[id]||!c.u)return;
    const v={id:id,name:c.m,image:c.u,series:c.series||group.label,rank:c.k||99999,rarity:cardRarityFor({id:id,edition:c.edition||group.edition||''},c.k||99999),edition:c.edition||group.edition||'',collectibleOnly:true};
    if(window.sakuBindCharacterName)window.sakuBindCharacterName(v,'name',id);
    const i=cardPool.length;cardPool.push(v);cardPoolById[id]=v;(cardPoolBySeries[v.series]||(cardPoolBySeries[v.series]=[])).push(i);
  }));
}
function cardsLoad() {
  if (currentAccount && currentAccount.cards) cardState = cardNormalize(currentAccount.cards);
  else cardState = cardReadLocal();
  if (typeof GENERIC_CHARACTERS !== 'undefined' && GENERIC_CHARACTERS.length) cardBuildPool();
  sakuIncludeOwnedCards();
  return cardState;
}
function cardsSave(now) {
  if (!cardState) return;
  if (!currentAccount) { cardWriteLocal(); try { localStorage.setItem('saku-cards-guest-only','1'); } catch(e){} }
  if (cardSaveTimer) { clearTimeout(cardSaveTimer); cardSaveTimer = null; }
  const saveUid = currentAccount ? sakuMyDcId() : null;
  const savedState = cardNormalize(cardState);
  const push = () => {
    cardSaveTimer = null;
    if (!currentAccount || sakuMyDcId() !== saveUid) return;
    /* V1 : la collection d'un compte vient du serveur ; rien n'est écrit depuis le navigateur. */
  };
  if (now) push();
  else cardSaveTimer = setTimeout(push, 1200);        // debounce rapid clicks
}
/* Called when a Discord account is adopted: fold the guest collection in. */
function cardsMergeOnSignIn(node) {
  // V1 : le serveur fait foi. Aucune fusion avec une collection locale, aucune écriture.
  cardState = cardNormalize((node && node.cards) || null);
  if (currentAccount) currentAccount.cards = cardState;
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
  const basicPool = cardPool.filter(c => !c.collectibleOnly);
  let candidates = basicPool;
  if (series) {
    const idx = cardPoolBySeries[series] || [];
    candidates = idx.map(i => cardPool[i]).filter(c => !c.collectibleOnly);
  }
  if (!candidates.length) candidates = basicPool;
  if (!candidates.length) return [];
  const picks = [];
  for (let i = 0; i < CARD_PACK_SIZE; i++) {
    const rarity = cardsRollRarity();
    const c = cardsPickOf(candidates, rarity) || basicPool[Math.floor(Math.random() * basicPool.length)];
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
  return; // V1 : l'ouverture de boosters se fait uniquement via les portails (serveur)
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
    slot.className = 'ac-slot' + (typeof window.sakuBasicBack === 'function' ? ' basic-rendered' : '') + (item.char.rarity === 'mythic' && (item.char.edition !== 'strongest' && item.char.edition !== 'hoshi') ? ' mythic' : '');
    slot.id = 'cardsSlot' + i;
    const meta = cardRarityMeta(item.char.rarity);
    slot.style.setProperty('--ac-edge', meta.edge);
    slot.style.setProperty('--ac-color', meta.color);
    slot.innerHTML =
      '<div class="ac-flip-inner">' +
      '<div class="ac-face ac-face-front">' +
        (typeof window.sakuBasicBack === 'function' ? '<span class="basic-card-art">' + window.sakuBasicBack() + '</span>' : '') +
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
  if ((char.edition === 'strongest' || char.edition === 'hoshi') && typeof window.sakuStrongestCard === 'function') {
    return '<span class="strongest-art">' + window.sakuStrongestCard(char) + '</span>';
  }
  const meta = cardRarityMeta(char.rarity);
  const badge = count > 1
    ? '<span class="ac-count">×' + count + '</span>'
    : '<span class="ac-new">' + ((typeof t === 'function') ? t('NEW') : 'NEW') + '</span>';
  return '' +
    (typeof window.sakuBasicCard === 'function' ? '<span class="basic-card-art">' + window.sakuBasicCard(char, false) + '</span>' : '') +
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
function cardsOwnedCount() { return cardState ? Object.keys(cardState.cards).filter(id => Number(cardState.cards[id]) > 0 && (!cardPoolById || !!cardPoolById[id])).length : 0; }
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
    tiers += '<span class="ac-tier' + (k === 'mythic' ? ' mythic' : '') + '"><i style="background:' + meta.color + '"></i>' + escapeHtml(cardRarityLabel(k)) +
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
/* ---------------- vue Personnages / Animés ---------------- */
const CARD_PREFS_KEY = 'sakuCollectionPrefs';
let cardView = 'cards';               // 'cards' (personnages) ou 'anime'
let cardAnimeOpen = null;             // clé de l'animé ouvert dans la fenêtre
let cardAnimeCache = null;
let cardPrefsLoaded = false;
function cardTr(s) { return (typeof t === 'function') ? t(s) : s; }
function cardAnimeLabel(raw) { try { return (typeof translateAnimeTitle === 'function') ? (translateAnimeTitle(raw) || raw) : raw; } catch (e) { return raw; } }
function cardEditionLabel(p) { return p && p.edition === 'hoshi' ? 'hoshi' : p && p.edition === 'strongest' ? 'the strongest' : ''; }
/* Cartes Hoshi dont la série n'a pas le même nom que l'animé de l'encyclopédie. */
const CARD_SPECIAL_ANIME = {
  'evangelion': 'Neon Genesis Evangelion', 'le voyage de chihiro': 'Spirited Away', 'dragon ball super broly': 'Dragon Ball',
  'josee le tigre et les poissons': 'Josee, the Tiger and the Fish', 'kuroko no basket': "Kuroko's Basketball",
  'spider man spider verse': 'Spider-Man: Miles Morales', 'je veux manger ton pancreas': 'I Want to Eat Your Pancreas',
  'bunny girl senpai': 'Rascal Does Not Dream of Bunny Girl Senpai', 'princesse mononoke': 'Princess Mononoke',
  'monogatari': 'Monogatari Series', 'one piece film red': 'One Piece'
};
function cardNorm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
function cardsAnimeGroups() {
  cardBuildPool();
  const encN = (typeof ENCYCLOPEDIA !== 'undefined' && ENCYCLOPEDIA && ENCYCLOPEDIA.list) ? ENCYCLOPEDIA.list.length : 0;
  if (cardAnimeCache && cardAnimeCache.n === cardPool.length && cardAnimeCache.enc === encN) return cardAnimeCache;
  const byId = {}, groups = [], byKey = {}, bySeries = {}, byLabel = {};
  const add = (key, label) => { if (!byKey[key]) { byKey[key] = { key: key, label: label, ids: [] }; groups.push(byKey[key]); } return byKey[key]; };
  const put = (g, id) => { if (!byId[id]) { byId[id] = g; g.ids.push(id); } };
  const specials = [];
  if (encN) ENCYCLOPEDIA.list.forEach(b => {
    if (b.edition) { b.cards.forEach(c => specials.push(String(c.i))); return; }
    const g = add('enc:' + b.label, b.label); byLabel[cardNorm(b.label)] = g;
    b.cards.forEach(c => { const id = String(c.i), p = cardPoolById[id]; if (!p) return; put(g, id); if (p.series && !bySeries[cardNorm(p.series)]) bySeries[cardNorm(p.series)] = g; });
  });
  // Hoshi / The Strongest : rangées avec leur animé (la recherche « hoshi » / « strongest » les retrouve).
  cardPool.forEach(p => { if (p.edition && specials.indexOf(String(p.id)) < 0) specials.push(String(p.id)); });
  specials.forEach(id => {
    const p = cardPoolById[id]; if (!p || byId[id]) return;
    const n = cardNorm(p.series), alias = CARD_SPECIAL_ANIME[n];
    const g = bySeries[n] || byLabel[n] || (alias && byLabel[cardNorm(alias)]) || add('series:' + (p.series || '?'), p.series || '?');
    put(g, id);
  });
  cardPool.forEach(c => { const id = String(c.id); if (byId[id]) return; put(bySeries[cardNorm(c.series)] || add('series:' + (c.series || '?'), c.series || '?'), id); });
  const live = groups.filter(g => g.ids.length);
  cardAnimeCache = { n: cardPool.length, enc: encN, byId: byId, groups: live, byKey: byKey };
  return cardAnimeCache;
}
function cardsLevelOf(id) {
  if (!window.sakuCardLevelCounts || !cardState) return 0;
  const ct = window.sakuCardLevelCounts(cardState, String(id));
  return [3, 2, 1].find(n => ct[n]) || 0;
}
function cardsCanUpgrade(id) { return !!(window.sakuCardLevelInfo && cardState && window.sakuCardLevelInfo(cardState, String(id)).canUpgrade); }
function cardsBadges(id, count) {
  if (!count) return '';
  const lv = cardsLevelOf(id), up = cardsCanUpgrade(id);
  if (!lv && !up) return '';
  return '<span class="ac-badges">' + (lv && window.sakuStarBadge ? window.sakuStarBadge(lv) : '') +
    (up ? '<span class="ac-upgradable" title="' + escapeHtml(cardTr('Can be upgraded')) + '" aria-label="' + escapeHtml(cardTr('Can be upgraded')) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V6m0 0-6 6m6-6 6 6"/></svg></span>' : '') + '</span>';
}
const cardAnimeCollator = (typeof Intl !== 'undefined' && Intl.Collator) ? new Intl.Collator(undefined, { sensitivity: 'base', ignorePunctuation: true, numeric: true }) : null;
function cardAnimeCompare(a, b) { return cardAnimeCollator ? cardAnimeCollator.compare(a, b) : a.localeCompare(b); }
const CARD_RARITY_LETTER = { common: 'C', uncommon: 'U', rare: 'R', epic: 'E', legendary: 'L', mythic: 'M', special: 'S' };
function cardMatches(p, q) {
  return p.name.toLowerCase().indexOf(q) >= 0 || (p.series || '').toLowerCase().indexOf(q) >= 0 ||
    (p.edition && (cardEditionLabel(p).indexOf(q) >= 0 || ((window.sakuSpecialNumber && window.sakuSpecialNumber(p)) || '').toLowerCase().indexOf(q) >= 0));
}
function cardsAnimeStats(g, rf) {
  const owned = cardState.cards || {};
  const ids = rf ? g.ids.filter(id => cardPoolById[id].rarity === rf) : g.ids;
  const have = ids.filter(id => Number(owned[id]) > 0), per = {};
  g.ids.forEach(id => { const r = cardPoolById[id].rarity; per[r] = per[r] || [0, 0]; per[r][1]++; if (Number(owned[id]) > 0) per[r][0]++; });
  return { ids: ids, have: have, per: per, pct: ids.length ? Math.floor(have.length * 100 / ids.length) : 0 };
}
function cardsTallyHtml(per, rf) {
  return CARD_RARITY_ORDER.filter(r => per[r]).map(r =>
    '<span class="anime-tally' + (rf === r ? ' on' : '') + '" style="--rarity:' + cardRarityMeta(r).color + '" title="' + escapeHtml(cardRarityLabel(r)) + '"><b>' + CARD_RARITY_LETTER[r] + '</b> ' + per[r][0] + '/' + per[r][1] + '</span>').join('');
}
function cardsAnimeCover(ids, have) {
  const pick = (have.length ? have : ids).slice().sort((a, b) => cardPoolById[a].rank - cardPoolById[b].rank)[0];
  return cardPoolById[pick];
}
function cardsRenderAnimeList(grid, q, rf, ownedOnly, favOnly) {
  const data = cardsAnimeGroups(), flags = cardState.flags || {};
  const order = (document.getElementById('cardsAnimeSort') || {}).value || 'name';
  let list = data.groups.map(g => Object.assign({ g: g, label: cardAnimeLabel(g.label) }, cardsAnimeStats(g, rf))).filter(x => x.ids.length);
  if (ownedOnly) list = list.filter(x => x.have.length);
  if (favOnly) list = list.filter(x => x.ids.some(id => (flags[id] || {}).favorite));
  if (q) list = list.filter(x => x.label.toLowerCase().indexOf(q) >= 0 || x.g.label.toLowerCase().indexOf(q) >= 0 || x.ids.some(id => cardMatches(cardPoolById[id], q)));
  if (order === 'progress') list.sort((a, b) => b.pct - a.pct || b.have.length - a.have.length || cardAnimeCompare(a.label, b.label));
  else if (order === 'size') list.sort((a, b) => b.ids.length - a.ids.length || cardAnimeCompare(a.label, b.label));
  else list.sort((a, b) => cardAnimeCompare(a.label, b.label));
  const more = document.getElementById('cardsMoreBtn');
  const shown = list.slice(0, cardAlbumLimit);
  if (more) { more.style.display = list.length > cardAlbumLimit ? '' : 'none'; more.textContent = cardTr('Show more') + ' (' + (list.length - cardAlbumLimit) + ')'; }
  if (window.sakuBasicRelease) window.sakuBasicRelease(grid);
  grid.classList.add('anime-mode');
  if (!grid.dataset.animeClick) { grid.dataset.animeClick = '1'; grid.addEventListener('click', e => { const b = e.target.closest('[data-anime]'); if (b && grid.contains(b)) cardsOpenAnime(b.dataset.anime); }); }
  if (!shown.length) { grid.innerHTML = '<p class="ac-empty">' + escapeHtml(cardTr('No anime matches.')) + '</p>'; return; }
  grid.innerHTML = shown.map(x => {
    const cover = cardsAnimeCover(x.ids, x.have);
    const keyAttr = String(x.g.key).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const special = x.ids.filter(id => cardPoolById[id].edition).length;
    return '<button type="button" class="anime-entry' + (x.have.length ? '' : ' empty') + (x.pct === 100 ? ' complete' : '') + '" data-anime="' + keyAttr + '">' +
      '<span class="anime-cover"><img src="' + escapeHtml(cardThumb(cover.image)) + '" alt="" loading="lazy" decoding="async" onerror="this.style.opacity=0"></span>' +
      '<span class="anime-info"><strong>' + escapeHtml(x.label) + '</strong>' +
      '<span class="anime-progress">' + x.have.length + '/' + x.ids.length + ' · ' + x.pct + ' %</span>' +
      '<span class="anime-tallies">' + cardsTallyHtml(x.per, rf) + '</span></span>' +
      '<span class="anime-bar" aria-hidden="true"><i style="width:' + x.pct + '%"></i></span></button>';
  }).join('');
}
/* Fenêtre d'un animé */
let cardAnimeFocus = null;
function cardsOpenAnime(key) {
  const g = cardsAnimeGroups().byKey[key]; const box = document.getElementById('cardsAnimeModal');
  if (!g || !box) return;
  if (!cardAnimeOpen) cardAnimeFocus = document.activeElement;
  cardAnimeOpen = key; box.hidden = false; document.body.classList.add('anime-modal-open');
  cardsRenderAnimeModal();
  try { document.getElementById('cardsAnimeClose').focus({ preventScroll: true }); } catch (e) {}
}
function cardsCloseAnime() {
  const box = document.getElementById('cardsAnimeModal'); if (!box || box.hidden) return;
  box.hidden = true; cardAnimeOpen = null; document.body.classList.remove('anime-modal-open');
  const grid = document.getElementById('cardsAnimeGrid'); if (grid) { if (window.sakuBasicRelease) window.sakuBasicRelease(grid); grid.innerHTML = ''; }
  if (cardAnimeFocus && cardAnimeFocus.isConnected) try { cardAnimeFocus.focus({ preventScroll: true }); } catch (e) {}
  cardAnimeFocus = null;
}
function cardsRenderAnimeModal() {
  if (!cardAnimeOpen || !cardState) return;
  const g = cardsAnimeGroups().byKey[cardAnimeOpen]; if (!g) { cardsCloseAnime(); return; }
  const st = cardsAnimeStats(g, ''), owned = cardState.cards || {}, mine = !!document.getElementById('cardsAnimeMine')?.checked;
  const cover = cardsAnimeCover(st.ids, st.have);
  document.getElementById('cardsAnimeCover').src = cardThumb(cover.image);
  document.getElementById('cardsAnimeTitle').textContent = cardAnimeLabel(g.label);
  document.getElementById('cardsAnimeProgress').textContent = st.have.length + '/' + st.ids.length + ' · ' + st.pct + ' %';
  document.getElementById('cardsAnimeTallies').innerHTML = cardsTallyHtml(st.per, '');
  document.getElementById('cardsAnimeBar').style.width = st.pct + '%';
  let rows = g.ids.map(id => ({ p: cardPoolById[id], count: Number(owned[id]) || 0 }));
  if (mine) rows = rows.filter(r => r.count > 0);
  rows.sort((a, b) => (!!b.count - !!a.count) || CARD_RARITY_ORDER.indexOf(b.p.rarity) - CARD_RARITY_ORDER.indexOf(a.p.rarity) || a.p.rank - b.p.rank);
  const grid = document.getElementById('cardsAnimeGrid');
  if (window.sakuBasicRelease) window.sakuBasicRelease(grid);
  grid.innerHTML = rows.length ? rows.map(cardsTileHtml).join('') : '<p class="ac-empty">' + escapeHtml(cardTr('No card matches — open a booster to start your collection!')) + '</p>';
  if (window.sakuAppendWishlist) grid.querySelectorAll('[data-card-id]').forEach(tile => window.sakuAppendWishlist(tile, tile.dataset.cardId));
  if (window.sakuBasicObserve) window.sakuBasicObserve(grid);
}
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape' || !cardAnimeOpen || document.getElementById('cardsDetail')?.classList.contains('show')) return;
  e.preventDefault(); cardsCloseAnime();
});
/* Mémoriser la vue, le tri et les filtres */
function cardsLoadPrefs() {
  if (cardPrefsLoaded) return; cardPrefsLoaded = true;
  let p = null; try { p = JSON.parse(localStorage.getItem(CARD_PREFS_KEY) || 'null'); } catch (e) {}
  if (!p || typeof p !== 'object') return;
  const set = (id, v) => { const el = document.getElementById(id); if (el && v != null && Array.from(el.options || []).some(o => o.value === v)) el.value = v; };
  if (p.view === 'anime' || p.view === 'cards') cardView = p.view;
  set('cardsSort', p.sort); set('cardsAnimeSort', p.animeSort); set('cardsRarityFilter', p.rarity);
  const own = document.getElementById('cardsOwnedOnly'); if (own && typeof p.owned === 'boolean') own.checked = p.owned;
  const fav = document.getElementById('cardsFavoriteOnly'); if (fav && typeof p.fav === 'boolean') fav.checked = p.fav;
}
function cardsSavePrefs() {
  try {
    localStorage.setItem(CARD_PREFS_KEY, JSON.stringify({
      view: cardView, sort: (document.getElementById('cardsSort') || {}).value, animeSort: (document.getElementById('cardsAnimeSort') || {}).value,
      rarity: (document.getElementById('cardsRarityFilter') || {}).value || '', owned: !!document.getElementById('cardsOwnedOnly')?.checked, fav: !!document.getElementById('cardsFavoriteOnly')?.checked
    }));
  } catch (e) {}
}
function cardsSetView(view) {
  cardView = view === 'anime' ? 'anime' : 'cards'; cardAlbumLimit = CARD_ALBUM_STEP; cardsRenderAlbum();
}
function cardsSyncViewUi() {
  document.querySelectorAll('#cardsViewSwitch [data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === cardView)));
  const s = document.getElementById('cardsSort'), a = document.getElementById('cardsAnimeSort');
  if (s) s.hidden = cardView === 'anime'; if (a) a.hidden = cardView !== 'anime';
  const search = document.getElementById('cardsSearch');
  if (search) { const ph = cardTr(cardView === 'anime' ? 'Search an anime or a character…' : 'Search a character or a series…'); if (search.placeholder !== ph) search.placeholder = ph; }
  document.querySelectorAll('#cardsRarityChips button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.rarity === ((document.getElementById('cardsRarityFilter') || {}).value || ''))));
}

function cardsRenderAlbum() {
  const grid = document.getElementById('cardsAlbum');
  if (!grid || !cardState) return;
  cardBuildPool();
  cardsLoadPrefs();
  cardsSyncViewUi();
  cardsSavePrefs();
  const q = ((document.getElementById('cardsSearch') || {}).value || '').trim().toLowerCase();
  const rf = (document.getElementById('cardsRarityFilter') || {}).value || '';
  const sort = (document.getElementById('cardsSort') || {}).value || 'rarity';
  const ownedOnly = (document.getElementById('cardsOwnedOnly') || {}).checked !== false;
  const favOnly = !!document.getElementById('cardsFavoriteOnly')?.checked;
  grid.classList.remove('anime-mode');
  if (cardAnimeOpen) cardsRenderAnimeModal();
  if (cardView === 'anime') { cardsRenderAnimeList(grid, q, rf, ownedOnly, favOnly); return; }
  const byId = {};
  Object.keys(cardState.cards).forEach(id => { byId[String(id)] = cardState.cards[id]; });

  let rows = cardPool.map(p => {
    const count = byId[String(p.id)] || 0;
    return { p: p, count: count, key: count ? (1000000 - count) * 100000 + p.rank : 100000000 + p.rank };
  });
  if (ownedOnly) rows = rows.filter(r => r.count > 0);
  if (favOnly) rows = rows.filter(r => !!(((cardState.flags || {})[String(r.p.id)] || {}).favorite));
  if (rf) rows = rows.filter(r => r.p.rarity === rf);
  if (q) rows = rows.filter(r => cardMatches(r.p, q));
  if (sort === 'name') rows.sort((a, b) => a.p.name.localeCompare(b.p.name));
  else if (sort === 'rarity') rows.sort((a, b) => CARD_RARITY_ORDER.indexOf(b.p.rarity) - CARD_RARITY_ORDER.indexOf(a.p.rarity) || a.p.rank - b.p.rank);
  else if (sort === 'duplicates') rows.sort((a, b) => Math.max(0, b.count - 1) - Math.max(0, a.count - 1) || a.p.rank - b.p.rank);
  else if (sort === 'level') { rows.forEach(r => { r.lv = r.count ? cardsLevelOf(r.p.id) : -1; r.up = r.count && cardsCanUpgrade(r.p.id) ? 1 : 0; }); rows.sort((a, b) => b.lv - a.lv || b.up - a.up || CARD_RARITY_ORDER.indexOf(b.p.rarity) - CARD_RARITY_ORDER.indexOf(a.p.rarity) || a.p.rank - b.p.rank); }
  else if (sort === 'anime') {
    const groups = cardsAnimeGroups().byId;
    rows.forEach(r => { const g = groups[String(r.p.id)]; r.g = g; r.gl = g ? cardAnimeLabel(g.label) : (r.p.series || ''); });
    rows.sort((a, b) => cardAnimeCompare(a.gl, b.gl) || (a.g === b.g ? 0 : String(a.g && a.g.key).localeCompare(String(b.g && b.g.key))) || CARD_RARITY_ORDER.indexOf(b.p.rarity) - CARD_RARITY_ORDER.indexOf(a.p.rarity) || a.p.rank - b.p.rank);
  }
  else rows.sort((a, b) => a.p.rank - b.p.rank);

  const more = document.getElementById('cardsMoreBtn');
  const shown = rows.slice(0, cardAlbumLimit);
  if (more) {
    more.style.display = rows.length > cardAlbumLimit ? '' : 'none';
    more.textContent = cardTr('Show more') + ' (' + (rows.length - cardAlbumLimit) + ')';
  }
  if (window.sakuBasicRelease) window.sakuBasicRelease(grid);
  if (!shown.length) {
    grid.innerHTML = '<p class="ac-empty">' + escapeHtml(cardTr('No card matches — open a booster to start your collection!')) + '</p>';
    return;
  }
  grid.innerHTML = shown.map(cardsTileHtml).join('');
  if(window.sakuAppendWishlist)grid.querySelectorAll('[data-card-id]').forEach(tile=>window.sakuAppendWishlist(tile,tile.dataset.cardId));
  if (window.sakuBasicObserve) window.sakuBasicObserve(grid);
}
function cardsTileHtml(r) {
  {
    const meta = cardRarityMeta(r.p.rarity);
    const idArg = JSON.stringify(String(r.p.id)).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
    if ((r.p.edition === 'strongest' || r.p.edition === 'hoshi') && typeof window.sakuStrongestCard === 'function') {
      return '<div class="ac-tile strongest-tile' + (r.count ? '' : ' missing') + '" role="button" tabindex="0" ' +
        'data-card-id="' + escapeHtml(String(r.p.id)) + '" onclick="cardsOpenDetail(' + idArg + ')" onkeydown="if(event.key===String.fromCharCode(13))cardsOpenDetail(' + idArg + ')">' +
        '<span class="strongest-art">' + window.sakuStrongestCard(r.p,true) + '</span>' +
        cardsBadges(r.p.id, r.count) +
        (r.count ? '<span class="strongest-ownership">×' + r.count + '</span>' : '<span class="strongest-ownership">' + escapeHtml((typeof t === 'function') ? t('Not obtained') : 'Not obtained') + '</span>') + '</div>';
    }
    return '<div class="ac-tile' + (typeof window.sakuBasicCard === 'function' ? ' basic-rendered' : '') + (r.p.rarity === 'mythic' ? ' mythic' : '') + (r.count ? '' : ' missing') + '" style="--ac-edge:' + meta.edge + ';--ac-color:' + meta.color + '" ' +
      'data-card-id="' + escapeHtml(String(r.p.id)) + '" onclick="cardsOpenDetail(' + idArg + ')" role="button" tabindex="0" ' +
      'onkeydown="if(event.key===String.fromCharCode(13))cardsOpenDetail(' + idArg + ')">' +
      (typeof window.sakuBasicCard === 'function' ? '<span class="basic-card-art">' + window.sakuBasicCard(r.p, true, {image:cardThumb(r.p.image)}) + '</span>' : '') +
      cardsBadges(r.p.id, r.count) +
      '<span class="ac-rar" style="background:' + meta.color + '"></span>' +
      (r.count > 1 ? '<span class="ac-count">×' + r.count + '</span>' : '') +
      '<span class="ac-art"><img src="' + escapeHtml(cardThumb(r.p.image)) + '" alt="' + escapeHtml(String(r.p.name)) + '" ' +
      'loading="lazy" decoding="async" fetchpriority="low" ' +
      'onload="this.classList.add(\'in\')" onerror="this.style.opacity=0"></span>' +
      '<span class="ac-name">' + escapeHtml(String(r.p.name)) + '</span>' +
      '<span class="ac-series">' + escapeHtml(String(r.p.series || '')) + '</span>' +
      '<span class="ac-foot"><b style="color:' + meta.color + '">' + escapeHtml(cardRarityLabel(r.p.rarity)) + '</b>' +
      (r.count > 1 ? '<i class="ac-own">×' + r.count + '</i>' : '') + '</span>' +
      '</div>';
  }
}
function cardsShowMore() { cardAlbumLimit += CARD_ALBUM_STEP; cardsRenderAlbum(); }

/* ---------------- card detail ---------------- */
let sakuCardDetailFocus = null;
function cardsOpenDetail(id) {
  cardBuildPool();
  const entry=cardPoolById&&cardPoolById[String(id)],box=document.getElementById('cardsDetail');
  if(!entry||!box)return;
  sakuCardDetailFocus=document.activeElement;
  const count=Number((cardState&&cardState.cards[String(id)])||0), special=entry.edition==='strongest'||entry.edition==='hoshi',meta=cardRarityMeta(entry.rarity);
  const lang=(window.SAKU_I18N||{}).lang||'en',words={fr:{label:'CARTE / COLLECTION',universe:'Univers',rarity:'Rareté',edition:'Édition',number:'Numéro',copies:'Dans ta collection',owned:'Possédée',missing:'Pas encore obtenue',close:'Fermer',rank:'Classement AniList',ordinary:'Classique',view:'Voir sur AniList'},en:{label:'CARD / COLLECTION',universe:'Universe',rarity:'Rarity',edition:'Edition',number:'Number',copies:'In your collection',owned:'Owned',missing:'Not yet owned',close:'Close',rank:'AniList rank',ordinary:'Basic',view:'View on AniList'},es:{label:'CARTA / COLECCIÓN',universe:'Universo',rarity:'Rareza',edition:'Edición',number:'Número',copies:'En tu colección',owned:'En posesión',missing:'Aún no conseguida',close:'Cerrar',rank:'Clasificación AniList',ordinary:'Básica',view:'Ver en AniList'}}[lang]||{};
  let record=null;if(typeof ENCYCLOPEDIA!=='undefined')for(const g of ENCYCLOPEDIA.list){record=(g.cards||[]).find(c=>String(c.i)===String(id));if(record)break;}
  const number=special?(window.sakuSpecialNumber(entry)||'—'):(record&&record.n?'#'+String(record.n).padStart(4,'0'):'—');
  const art=special?'<div class="ac-detail-card strongest-detail"><span class="strongest-art">'+window.sakuStrongestCard(entry)+'</span></div>':'<div class="ac-detail-card basic-rendered'+(entry.rarity==='mythic'?' mythic':'')+'" style="--ac-edge:'+meta.edge+';--ac-color:'+meta.color+'">'+cardsCardFace(entry,count,false)+'</div>';
  const item=(name,value)=>'<div class="card-detail-row"><dt>'+escapeHtml(name)+'</dt><dd>'+value+'</dd></div>';
  let link=/^\d+$/.test(String(entry.id))?'<a class="card-detail-link" href="https://anilist.co/character/'+encodeURIComponent(String(entry.id))+'" target="_blank" rel="noopener">'+escapeHtml(words.view)+' <span aria-hidden="true">↗</span></a>':'';
  let label=entry.edition==='hoshi'?'Hoshi':entry.edition==='strongest'?'The Strongest':words.ordinary;
  box.innerHTML='<article class="card-detail-panel"><button class="card-detail-close" type="button" onclick="cardsCloseDetail()" aria-label="'+escapeHtml(words.close)+'">×</button><div class="card-detail-visual"><span class="card-detail-eyebrow">SAKUGAME / CARDS</span>'+art+'<span class="card-detail-caption">'+escapeHtml(number)+'</span></div><section class="card-detail-info"><span class="card-detail-eyebrow">'+escapeHtml(words.label)+'</span><h2>'+escapeHtml(entry.name)+'</h2><p class="card-detail-series">'+escapeHtml(entry.series||'—')+'</p><div class="card-detail-status '+(count?'owned':'missing')+'">'+escapeHtml(count?words.owned:words.missing)+'</div><dl>'+item(words.universe,escapeHtml(entry.series||'—'))+item(words.rarity,'<strong style="color:'+escapeHtml(meta.color)+'">'+escapeHtml(cardRarityLabel(entry.rarity))+'</strong>')+item(words.edition,escapeHtml(label))+item(words.number,escapeHtml(number))+item(words.copies,'<strong>× '+count+'</strong>')+(!special&&/^\d+$/.test(String(entry.id))?item(words.rank,'#'+escapeHtml(entry.rank)):'')+'</dl>'+link+'</section></article>';
  box.classList.add('show');if(window.sakuDetailControls)window.sakuDetailControls(box,String(id),'collection');if(window.sakuCardLevelsRender)window.sakuCardLevelsRender(box.querySelector('.card-detail-info'),String(id));document.body.style.overflow='hidden';box.querySelector('.card-detail-close').focus({preventScroll:true});
}
function cardsCloseDetail() {
  const box=document.getElementById('cardsDetail');if(box)box.classList.remove('show');document.body.style.overflow='';if(sakuCardDetailFocus&&sakuCardDetailFocus.isConnected)sakuCardDetailFocus.focus({preventScroll:true});sakuCardDetailFocus=null;
}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.getElementById('cardsDetail')?.classList.contains('show')){e.preventDefault();cardsCloseDetail();}});

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
  if(window.sakuRarityChips)window.sakuRarityChips('cardsRarityFilter','cardsRarityChips');
}

/* ---------------- entry point ---------------- */
function showCards() {
  if (typeof showCardHome === 'function') showCardHome();
}
function showCollection() {
  showScreen('collectionScreen');
  cardsEnsureReady();
  try { window.scrollTo(0, 0); } catch (e) {}
}
function cardsEnsureReady() {
  // The base catalogue is injected after first paint: never cache only the
  // extra/special cards when a visitor opens a direct link immediately.
  if (typeof GENERIC_CHARACTERS === 'undefined' || !GENERIC_CHARACTERS.length) {
    const stats = document.getElementById('cardsStats');
    if (stats) stats.textContent = typeof t === 'function' ? t('Loading cards…') : 'Loading cards…';
    if (window.sakuDataReady && window.sakuDataReady.then) window.sakuDataReady.then(function () {
      const active = document.querySelector('#cardsScreen.active, #collectionScreen.active');
      if (active) cardsEnsureReady();
    }).catch(function () {
      if (stats) stats.textContent = typeof t === 'function' ? t('Could not load the cards. Please reload the page.') : 'Could not load the cards. Please reload the page.';
    });
    return;
  }
  cardsLoad();
  cardsFillFilters();
  cardsRenderTop();
  cardsRenderStats();
  cardAlbumLimit = CARD_ALBUM_STEP;
  cardsRenderAlbum();
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
    if ((document.getElementById('cardsScreen') && document.getElementById('cardsScreen').classList.contains('active')) || (document.getElementById('collectionScreen') && document.getElementById('collectionScreen').classList.contains('active'))) {
      cardsRenderTop(); cardsRenderStats(); cardsRenderAlbum();
    }
  };
  if (typeof window !== 'undefined' && window.sakuDataReady && window.sakuDataReady.then) window.sakuDataReady.then(kick).catch(function () {});
  else setTimeout(kick, 600);
})();
