// Sakugame — Hot&Cold v37 tests (multiplayer 2-6: rotation, parallel lanes,
// queue scoring, Σ-totals classement, guards). REAL app.js in a VM, stub DOM+Firebase.
const fs = require('fs');
const vm = require('vm');
const R = require('path').join(__dirname, '..') + '/';

// ---------- Firebase stub capturing writes ----------
let ROOM = {};
let pushN = 0;
function deepSet(obj, path, val) {
  const parts = path.split('/').filter(Boolean); let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) { const p = parts[i]; if (cur[p] == null || typeof cur[p] !== 'object') cur[p] = {}; cur = cur[p]; }
  const last = parts[parts.length - 1];
  if (val === null) delete cur[last]; else cur[last] = val;
}
let WRITES = [];
function makeRef(path) {
  const ref = {
    path,
    set: async (v) => { WRITES.push({ op: 'set', path, v }); deepSet(ROOM, path.replace(/^rooms\/TEST\/?/, ''), v); },
    update: async (o) => { WRITES.push({ op: 'update', path, o }); const base = path.replace(/^rooms\/TEST\/?/, ''); Object.keys(o || {}).forEach(k => deepSet(ROOM, base ? base + '/' + k : k, o[k])); },
    remove: async () => { WRITES.push({ op: 'remove', path }); },
    once: async () => ({ val: () => ROOM, exists: () => !!ROOM }),
    on: () => { }, off: () => { },
    child: (c) => makeRef(path + '/' + c),
    push: (v) => {
      const k = '-K' + ('00' + (++pushN)).slice(-3);
      if (v !== undefined) { WRITES.push({ op: 'push', path: path + '/' + k, v }); deepSet(ROOM, path.replace(/^rooms\/TEST\/?/, '') + '/' + k, v); }
      return { key: k, set: ref.set, remove: ref.remove };
    },
    transaction: async (fn) => ({ committed: true, snapshot: { val: () => null } }),
    onDisconnect: () => ({ set: () => { }, remove: () => { }, cancel: () => { } }),
    orderByChild: () => makeRef(path), equalTo: () => makeRef(path), limitToLast: () => makeRef(path)
  };
  return ref;
}
const firebase = {
  initializeApp: () => { },
  database: () => ({ ref: (p) => makeRef(p), ServerValue: { TIMESTAMP: 0 } }),
  auth: () => ({ currentUser: null, onAuthStateChanged: (cb) => { setTimeout(() => { try { cb(null); } catch (e) { } }, 0); } })
};
firebase.database.ServerValue = { TIMESTAMP: 0 };

// ---------- DOM stub ----------
const escS = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function mkEl(id) {
  const el = {
    id: id || '', tagName: 'DIV', style: { setProperty: () => { } }, value: '',
    disabled: false, children: [], childNodes: [], dataset: {}, src: '', alt: '', loading: '', className: '', title: '',
    onclick: null,
    listeners: {},
    classList: {
      _s: new Set(),
      add(...c) { c.forEach(x => this._s.add(x)); },
      remove(...c) { c.forEach(x => this._s.delete(x)); },
      toggle(c, f) { if (f === undefined) f = !this._s.has(c); if (f) this._s.add(c); else this._s.delete(c); return f; },
      contains(c) { return this._s.has(c); }
    }
  };
  let _t = '', _h = '';
  Object.defineProperty(el, 'textContent', {
    get() { return _t; },
    set(v) { _t = v; _h = escS(v); if (v === '') el.children = []; }
  });
  Object.defineProperty(el, 'innerHTML', {
    get() { return _h; },
    set(v) { _h = v; _t = String(v).replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'); if (v === '') el.children = []; }
  });
  el.appendChild = (c) => { el.children.push(c); return c; };
  el.insertBefore = (c, ref) => { const i = ref ? el.children.indexOf(ref) : -1; if (i < 0) el.children.push(c); else el.children.splice(i, 0, c); return c; };
  el.append = (...cs) => { cs.forEach(c => el.children.push(c)); };
  Object.defineProperty(el, 'firstChild', { get() { return el.children[0] || null; } });
  Object.defineProperty(el, 'lastElementChild', { get() { return el.children[el.children.length - 1] || null; } });
  Object.defineProperty(el, 'firstElementChild', { get() { return el.children[0] || null; } });
  el.addEventListener = (t, fn) => { (el.listeners[t] = el.listeners[t] || []).push(fn); };
  el.removeEventListener = () => { };
  el.setAttribute = (k, v) => { el.dataset[k] = v; };
  el.getAttribute = (k) => el.dataset[k] != null ? el.dataset[k] : null;
  el.querySelector = () => null; el.querySelectorAll = () => [];
  el.scrollIntoView = () => { }; el.focus = () => { }; el.click = () => { };
  el.replaceWith = () => { }; el.remove = () => { }; el.closest = () => null;
  el.getBoundingClientRect = () => ({ width: 100, height: 100, top: 0, left: 0 });
  el.scrollTop = 0; el.scrollHeight = 100;
  return el;
}
const EL_CACHE = {};
const byId = (id) => (EL_CACHE[id] = EL_CACHE[id] || mkEl(id));
const hcScreen = byId('hotcoldScreen'); hcScreen.classList.add('active');
const document = {
  _listeners: {},
  getElementById: (id) => (id ? byId(id) : null),
  createElement: (t) => { const e = mkEl(''); e.tagName = t.toUpperCase(); return e; },
  createTextNode: (t) => ({ textContent: t }),
  querySelector: (sel) => {
    if (sel === '.screen.active') return hcScreen.classList.contains('active') ? hcScreen : null;
    if (sel.indexOf('.screen') === 0) return null;
    return null;
  },
  querySelectorAll: (sel) => { if (sel === '.screen') return [hcScreen]; return []; },
  addEventListener(t, fn) { (this._listeners[t] = this._listeners[t] || []).push(fn); },
  body: mkEl('body'), head: mkEl('head'), documentElement: mkEl('html'),
  hidden: false
};
const windowStub = {
  addEventListener: () => { }, removeEventListener: () => { },
  matchMedia: () => ({ matches: false, addEventListener: () => { } }),
  location: { origin: 'http://localhost:8080', pathname: '/index.html', search: '' },
  history: { replaceState: () => { } },
  localStorage: { getItem: () => null, setItem: () => { }, removeItem: () => { } },
  navigator: { userAgent: 'node-test', language: 'en-US', languages: ['en-US'] },
  dispatchEvent: () => { }, CustomEvent: function (n, o) { return { type: n, detail: o && o.detail }; },
  t: undefined, tP: undefined, SAKU_I18N: undefined
};
class MutationObserverStub { constructor(cb) { } observe() { } disconnect() { } }
const sandbox = {
  console, setTimeout, clearTimeout, setInterval, clearInterval, setImmediate,
  document, navigator: windowStub.navigator, location: windowStub.location, history: windowStub.history,
  localStorage: windowStub.localStorage, firebase, fetch: async () => { throw new Error('no-fetch'); },
  MutationObserver: MutationObserverStub, CustomEvent: windowStub.CustomEvent,
  URLSearchParams, RegExp, JSON, Math, Date, Promise, Object, Array, Set, Map, Number, String, Boolean, Error, Intl,
  alert: () => { }, Image: function () { return mkEl('img'); }, FileReader: function () { }, URL: URL,
  Audio: function () { const a = mkEl('audio'); a.play = () => Promise.resolve(); a.pause = () => { }; a.load = () => { }; a.currentTime = 0; a.duration = 200; a.volume = 1; a.muted = false; a.loop = false; a.preload = ''; return a; },
  __writes: WRITES
};
sandbox.__setRoom = (r) => { ROOM = r || {}; };
sandbox.__getRoom = () => ROOM;
sandbox.window = sandbox; sandbox.self = sandbox; sandbox.globalThis = sandbox;
windowStub.window = windowStub;
Object.keys(windowStub).forEach(k => { if (!(k in sandbox)) sandbox[k] = windowStub[k]; });
sandbox.window.addEventListener = () => { };
vm.createContext(sandbox);

// ---------- load the real files in order ----------
const files = ['characters.js', 'charanimes.js', 'animes.js', 'undercover.js', 'music.js', 'lang.js', 'app.js'];
for (const f of files) {
  vm.runInContext(fs.readFileSync(R + f, 'utf8'), sandbox, { filename: f });
}

// ---------- the tests (same scope as app.js internals) ----------
const tests = `
__TEST = (async () => {
  const results = [];
  const ok = (name, cond) => results.push((cond ? 'PASS' : 'FAIL') + ' ' + name);
  const upds = () => __writes.filter(w => w.op === 'update');
  const lastUpd = () => upds().slice(-1)[0];
  const syncRoom = () => { currentRoom = JSON.parse(JSON.stringify(__getRoom())); };

  // 3-seat room: A hides first, B & C hunt. Full rotation = 3 rounds.
  function mkRoom(over) {
    return Object.assign({}, {
      state: 'playing', game: 'hotcold', maxPlayers: 6,
      settings: { hcMode: 'individual' }, // legacy golf semantics for T1-T21 (shared = points since build 45)
      players: { A: { id: 'A', name: 'HiderA' }, B: { id: 'B', name: 'SeekerB' }, C: { id: 'C', name: 'SeekerC' } },
      hc: {
        gameId: 111, round: 1, phase: 'play', order: ['A', 'B', 'C'], hider: 'A',
        secret: { id: 4242, name: 'Mikasa Ackerman', image: 'mikasa.jpg' },
        queue: null, guesses: null,
        sk: { B: { a: 0, s: 'on' }, C: { a: 0, s: 'on' } },
        totals: { A: 0, B: 0, C: 0 },
        rounds: null, winner: null, forfeit: null, nextStarter: null
      }
    }, over || {});
  }
  function seed(r) {
    __setRoom(JSON.parse(JSON.stringify(r)));
    currentRoom = JSON.parse(JSON.stringify(r));
    __writes.length = 0;
    try { hcGuardFor = 0; } catch (e) {} // the guard latches once per gameId — tests reuse id 111
    hcLastPhaseKey = ''; hcQueueSel = null;
  }
  roomCode = 'TEST'; isHost = false; playerId = 'B';

  // ---- T1: the deal seats everyone, shuffles a rotation, zeroes totals
  seed({
    state: 'lobby', game: 'hotcold',
    players: { A: { id: 'A', name: 'HiderA' }, B: { id: 'B', name: 'SeekerB' }, C: { id: 'C', name: 'SeekerC' } },
    hc: null
  });
  await hotcoldDeal();
  {
    const w = lastUpd();
    ok('T1a deal writes hc state', !!(w && w.o && w.o.hc));
    const hcw = w && w.o && w.o.hc;
    ok('T1b rotation has all 3 seats', hcw && Array.isArray(hcw.order) && hcw.order.length === 3);
    ok('T1c first seat hides (round 1, select)', hcw && hcw.hider === hcw.order[0] && hcw.round === 1 && hcw.phase === 'select');
    ok('T1d seeker lanes opened for everyone else', hcw && hcw.sk && Object.keys(hcw.sk).length === 2);
    ok('T1e totals zeroed for all seats', hcw && hcw.totals && Object.keys(hcw.totals).length === 3 && hcw.totals.A === 0);
  }

  // ---- T2: hider stages & hides → play phase (fixed rotation A→B→C)
  seed(mkRoom({ hc: Object.assign({}, mkRoom().hc, { phase: 'select' }) }));
  playerId = 'A';
  hcStagedPick = { id: 4242, name: 'Mikasa Ackerman', image: 'mikasa.jpg' };
  await hcConfirmHide();
  {
    const w = lastUpd();
    ok('T2 hide → play phase + secret stored', !!(w && w.o && w.o.phase === 'play' && w.o.secret && w.o.secret.name === 'Mikasa Ackerman'));
  }

  // ---- T3: a wrong proposal joins the queue (no score yet)
  syncRoom(); // T2's hide wrote into the stubbed ROOM — mirror it locally
  playerId = 'B';
  hcStagedGuess = { id: 7, name: 'Naruto Uzumaki', image: 'n.jpg' };
  await hcConfirmGuess();
  {
    const p = __writes.filter(x => x.op === 'push' && x.path.indexOf('/hc/queue/') !== -1);
    ok('T3a wrong guess is queued for the hider', p.length === 1 && p[0].v.by === 'B');
    ok('T3b no score yet (totals untouched)', syncRoom() || __getRoom().hc.totals.B === 0);
  }

  // ---- T4: one proposal in flight per seeker (2nd is refused)
  const pushesBefore = __writes.filter(x => x.op === 'push').length;
  hcStagedGuess = { id: 8, name: 'Luffy', image: 'l.jpg' };
  await hcConfirmGuess();
  {
    const p = __writes.filter(x => x.op === 'push' && x.path.indexOf('/hc/queue/') !== -1);
    ok('T4 second proposal while inflight is refused', p.length === pushesBefore);
    hcStagedGuess = { id: 7, name: 'Naruto Uzumaki', image: 'n.jpg' }; // restore: the queue still holds this one
  }

  // ---- T5: hider scores the queued proposal 82 → logged, total += 82
  playerId = 'A'; // hider
  syncRoom();
  updateHotcold(); // picks the first queue card
  document.getElementById('hcScoreSlider').value = '82';
  await hcSubmitScore();
  {
    syncRoom();
    const hc = __getRoom().hc;
    ok('T5a guess logged with proposer + score', !!(hc.guesses && Object.keys(hc.guesses).some(k => hc.guesses[k].by === 'B' && hc.guesses[k].score === 82)));
    ok('T5b guess count total updated (+1 per guess)', hc.totals.B === 1);
    ok('T5c queue item consumed', !(hc.queue && Object.keys(hc.queue).length));
    ok('T5d seeker lane still open (attempts 1)', hc.sk.B.a === 1 && hc.sk.B.s === 'on');
  }

  // ---- T6: C lands a DIRECT HIT → auto-100, their lane closes, round NOT over (B still hunting)
  playerId = 'C';
  hcStagedGuess = { id: 4242, name: '  mikasa  ACKERMAN', image: 'x.jpg' };
  await hcConfirmGuess();
  {
    syncRoom();
    const hc = __getRoom().hc;
    ok('T6a direct hit counts 1 guess (lane found)', hc.totals.C === 1 && hc.sk.C.s === 'found');
    ok('T6b round stays open while a lane is hunting', hc.phase === 'play');
  }

  // ---- T7: B lands the hit too → last lane closes → roundEnd + recap
  playerId = 'B';
  hcStagedGuess = { id: 4242, name: 'Mikasa Ackerman', image: 'mikasa.jpg' };
  await hcConfirmGuess();
  {
    syncRoom();
    const hc = __getRoom().hc;
    console.log('DBG hc=' + JSON.stringify({ phase: hc.phase, sk: hc.sk, rounds: hc.rounds, totals: hc.totals, queue: hc.queue }) + ' cur=' + JSON.stringify({ phase: currentRoom.hc.phase, sk: currentRoom.hc.sk }));
    console.log('DBG writes=' + JSON.stringify(upds().map(w => w.o)).slice(0, 900));
    ok('T7a all lanes done → roundEnd', hc.phase === 'roundEnd');
    ok('T7b recap: B found in 2 guesses, C in 1', hc.rounds.r1.found.B === 2 && hc.rounds.r1.found.C === 1);
    ok('T7c recap keeps the secret + hider', hc.rounds.r1.secretName === 'Mikasa Ackerman' && hc.rounds.r1.hider === 'A');
  }

  // ---- T8: only the NEXT hider can start their round
  playerId = 'C'; // not next (rotation A,B,C → next is B)
  __writes.length = 0;
  await hcContinue();
  ok('T8a wrong player cannot continue', __writes.length === 0);
  playerId = 'B'; // round-2 hider
  await hcContinue();
  {
    syncRoom();
    const hc = __getRoom().hc;
    ok('T8b next hider advances the rotation', hc.phase === 'select' && hc.round === 2 && hc.hider === 'B');
    ok('T8c fresh lanes (A hunting now, hider B out)', hc.sk && hc.sk.A && hc.sk.A.s === 'on' && !hc.sk.B);
  }

  // ---- T9: attempt cap — a seeker at 99 tries busts on the 100th
  seed(mkRoom({ hc: Object.assign({}, mkRoom().hc, {
    round: 2, hider: 'B',
    sk: { A: { a: 99, s: 'on' }, C: { a: 2, s: 'on' } },
    totals: { A: 200, B: 100, C: 900 },
    queue: { '-K900': { by: 'A', name: 'Frieren', image: '', at: 1 } }
  }) }));
  playerId = 'B'; // hider scoring A's 100th proposal
  updateHotcold();
  document.getElementById('hcScoreSlider').value = '30';
  await hcSubmitScore();
  {
    syncRoom();
    const hc = __getRoom().hc;
    ok('T9a 100th guess = last one, total += 1', hc.totals.A === 201);
    ok('T9b lane busted at the cap', hc.sk.A.s === 'busted' && hc.sk.A.a === 100);
    ok('T9c round still open (C hunting)', hc.phase === 'play');
  }

  // ---- T10: match end — last rotation round, Σ totals decide the winner
  seed(mkRoom({ hc: Object.assign({}, mkRoom().hc, {
    round: 3, hider: 'C',
    sk: { A: { a: 1, s: 'on' }, B: { a: 4, s: 'on' } },
    totals: { A: 16, B: 14, C: 20 } // golf: the hider inherited their own count from earlier rounds
  }) }));
  playerId = 'A';
  hcStagedGuess = { id: 4242, name: 'Mikasa Ackerman', image: 'mikasa.jpg' };
  await hcConfirmGuess(); // A finds (16+1=17). B still open → not over
  {
    syncRoom();
    ok('T10a last round, one lane open: not over yet', __getRoom().hc.phase === 'play');
  }
  playerId = 'B';
  hcStagedGuess = { id: 4242, name: 'Mikasa Ackerman', image: 'mikasa.jpg' };
  await hcConfirmGuess(); // B finds (14+1=15) → last rotation round done
  {
    syncRoom();
    const hc = __getRoom().hc;
    ok('T10b all rotation rounds done → matchEnd', hc.phase === 'matchEnd');
    ok('T10c LOWEST guess count wins (B 15 < A 17 < C 20)', hc.winner === 'B');
    ok('T10d rematch rotates (2nd hider starts next)', hc.nextStarter === 'B');
  }

  // ---- T11: shared top total = draw
  seed(mkRoom({ hc: Object.assign({}, mkRoom().hc, {
    round: 3, hider: 'C',
    sk: { A: { a: 1, s: 'on' }, B: { a: 1, s: 'on' } },
    totals: { A: 300, B: 300, C: 500 }
  }) }));
  playerId = 'A';
  hcStagedGuess = { id: 4242, name: 'Mikasa Ackerman', image: 'mikasa.jpg' };
  await hcConfirmGuess();
  playerId = 'B';
  hcStagedGuess = { id: 4242, name: 'Mikasa Ackerman', image: 'mikasa.jpg' };
  await hcConfirmGuess();
  {
    syncRoom();
    ok('T11 tie at the top → draw', __getRoom().hc.phase === 'matchEnd' && __getRoom().hc.winner === 'draw');
  }

  // ---- T12: classement render — Σ desc, my row flagged, lane status chips
  seed(mkRoom({ hc: Object.assign({}, mkRoom().hc, {
    totals: { A: 250, B: 500, C: 100 },
    sk: { B: { a: 1, s: 'found' }, C: { a: 100, s: 'busted' } }
  }) }));
  playerId = 'B';
  updateHotcold();
  {
    const rank = document.getElementById('hcRank');
    ok('T12a classement sorted ASC by guess count (C,A,B)', rank.children[0] && rank.children[0].innerHTML.indexOf('SeekerC') !== -1 && rank.children[2].innerHTML.indexOf('SeekerB') !== -1);
    ok('T12b lowest count first (100)', rank.children[0].innerHTML.indexOf('>100<') !== -1);
    ok('T12c my row highlighted', rank.children[2].className.indexOf('hc-me') !== -1);
    ok('T12d found chip + busted ×', rank.children[2].innerHTML.indexOf('ok') !== -1 && rank.children[0].innerHTML.indexOf('×') !== -1);
  }

  // ---- T13: guesses log = current round only, proposer named, heat colors
  seed(mkRoom({ hc: Object.assign({}, mkRoom().hc, {
    guesses: {
      '-K001': { by: 'B', name: 'Cold One', image: '', score: 5, r: 1, at: 1 },
      '-K002': { by: 'C', name: 'Warm One', image: '', score: 55, r: 1, at: 2 },
      '-K003': { by: 'B', name: 'Old Round One', image: '', score: 90, r: 2, at: 3 }
    }, round: 1
  }) }));
  playerId = 'A';
  updateHotcold();
  {
    const log = document.getElementById('hcLog');
    ok('T13a only round-1 guesses shown (2 rows)', log.children.length === 2);
    const texts1 = log.children[1].children[2]; // [num, img, texts, score]
    ok('T13b proposer named in the row', texts1 && texts1.children[0] && texts1.children[0].textContent === 'SeekerC');
    ok('T13c heat colors on scores', log.children[0].children[3].className.indexOf('hc-cold') !== -1 && log.children[1].children[3].className.indexOf('hc-warm') !== -1);
  }

  // ---- T14: wait line for a DONE seeker renders bold markup, no raw tags
  seed(mkRoom({ hc: Object.assign({}, mkRoom().hc, {
    sk: { B: { a: 3, s: 'found' }, C: { a: 1, s: 'on' } },
    totals: { A: 0, B: 260, C: 40 }
  }) }));
  playerId = 'B';
  updateHotcold();
  {
    const wEl = document.getElementById('hcWaitText');
    ok('T14a done-wait visible', document.getElementById('hcWaitArea').style.display !== 'none');
    ok('T14b bold markup present', wEl.innerHTML.indexOf('<b>3</b>') !== -1 && wEl.innerHTML.indexOf('<b>260</b>') !== -1);
    ok('T14c no raw <b> text leak', wEl.textContent.indexOf('<b>') === -1);
  }

  // ---- T15: the hider sees the queue cards with proposer names
  seed(mkRoom({ hc: Object.assign({}, mkRoom().hc, {
    queue: { '-K100': { by: 'B', name: 'Naruto Uzumaki', image: 'n.jpg', at: 1 }, '-K101': { by: 'C', name: 'Saitama', image: 's.jpg', at: 2 } }
  }) }));
  playerId = 'A';
  updateHotcold();
  {
    const q = document.getElementById('hcQueue');
    ok('T15a two queue cards', q.children.length === 2);
    ok('T15b proposer labels on cards', q.children[0].children[1].children[0].textContent === 'SeekerB' && q.children[1].children[1].children[0].textContent === 'SeekerC');
    ok('T15c first card auto-selected into the scoring box', document.getElementById('hcAnsName').textContent === 'Naruto Uzumaki' && document.getElementById('hcAnsLabel').innerHTML.indexOf('SeekerB') !== -1);
  }

  // ---- T16: GUARD — the hider bails mid-play (host view) → rotation rolls on
  seed(mkRoom());
  currentRoom.players.A.outInGame = 111;
  isHost = true; playerId = 'B';
  updateHotcold();
  {
    syncRoom();
    const hc = __getRoom().hc;
    ok('T16a rotation rolls to the next seat', hc.phase === 'select' && hc.round === 2 && hc.hider === 'B');
    ok('T16b secret voided, fresh lanes', !hc.secret && hc.sk && hc.sk.A === undefined && hc.sk.C && hc.sk.C.s === 'on');
  }

  // ---- T17: GUARD — a seeker bails → lane closed 'left', round closes if it was the last open one
  seed(mkRoom({ hc: Object.assign({}, mkRoom().hc, { sk: { B: { a: 1, s: 'found' }, C: { a: 2, s: 'on' } } }) }));
  currentRoom.players.C.outInGame = 111;
  isHost = true; playerId = 'B';
  updateHotcold();
  {
    syncRoom();
    const hc = __getRoom().hc;
    ok('T17a departed lane closed', hc.sk.C.s === 'left');
    ok('T17b last open lane → roundEnd', hc.phase === 'roundEnd');
    ok('T17c recap tags the dropout', hc.rounds.r1.leftOut && hc.rounds.r1.leftOut.indexOf('C') !== -1);
  }

  // ---- T18: end screen — classement rows + per-round recap + winner sub
  seed(mkRoom({ hc: Object.assign({}, mkRoom().hc, {
    phase: 'matchEnd', winner: 'C',
    totals: { A: 250, B: 600, C: 100 },
    rounds: { r1: { hider: 'A', secretName: 'Mikasa Ackerman', secretImg: '', found: { B: 2 }, bust: ['C'], leftOut: null } }
  }) }));
  playerId = 'B';
  updateHotcold();
  {
    const list = document.getElementById('hcEndList');
    ok('T18a end classement asc (C first, fewest)', list.children[0] && list.children[0].innerHTML.indexOf('SeekerC') !== -1 && list.children[0].innerHTML.indexOf('100') !== -1);
    const recap = document.getElementById('hcRoundsRecap');
    ok('T18b recap names the secret + hider + found', recap.innerHTML.indexOf('Mikasa Ackerman') !== -1 && recap.innerHTML.indexOf('SeekerB') !== -1);
    const sub = document.getElementById('hcWinSub');
    ok('T18c winner subtitle names winner + count', sub.innerHTML.indexOf('SeekerC') !== -1 && sub.innerHTML.indexOf('100') !== -1 && sub.innerHTML.indexOf('<b>') !== -1);
  }
  // ---- T19: best-guesses panel — top 5 by 0-100 score, deduped, proposer shown
  seed(mkRoom({ hc: Object.assign({}, mkRoom().hc, {
    guesses: {
      '-K001': { by: 'B', name: 'Cold One', image: '', score: 5, r: 1, at: 1 },
      '-K002': { by: 'C', name: 'Warm One', image: '', score: 55, r: 1, at: 2 },
      '-K003': { by: 'B', name: 'Hot One', image: '', score: 91, r: 1, at: 3 },
      '-K004': { by: 'C', name: 'Lava One', image: '', score: 98, r: 1, at: 4 },
      '-K005': { by: 'B', name: 'Warm One', image: '', score: 60, r: 1, at: 5 }, // dup name — keeps the better 60
      '-K006': { by: 'C', name: 'Mid One', image: '', score: 40, r: 1, at: 6 },
      '-K007': { by: 'B', name: 'Old Round', image: '', score: 99, r: 2, at: 7 }  // another round — excluded
    }
  }) }));
  playerId = 'A';
  updateHotcold();
  {
    const top = document.getElementById('hcTop');
    ok('T19a wrap visible once guesses exist', document.getElementById('hcTopWrap').style.display !== 'none');
    ok('T19b hottest first (Lava 98)', top.children[0].children[2].children[1].textContent === 'Lava One');
    const scores = top.children.map(r => r.children[3].textContent.replace(/[^0-9]/g, ''));
    ok('T19c desc, name-dedup keeps best (60), excludes round 2', JSON.stringify(scores) === JSON.stringify(['98', '91', '60', '40', '5']));
    ok('T19d proposer named on the row', top.children[0].children[2].children[0].textContent === 'SeekerC');
    seed(mkRoom());
    updateHotcold();
    ok('T19e empty round hides the panel', document.getElementById('hcTopWrap').style.display === 'none');
  }

  // ---- T20: suggestion rows neutralize ghost clicks (phone tap-through
  // onto the button the dropdown was covering, e.g. "Random")
  seed(mkRoom());
  document.getElementById('hcPickInput').value = 'naruto';
  hcRenderSug('pick');
  {
    const box = document.getElementById('hcPickSuggest');
    ok('T20a suggestions shown for the query', box.children.length > 0);
    const row = box.children[0];
    const handlers = (row.listeners && row.listeners.pointerdown) || [];
    ok('T20b pointerdown handler bound', handlers.length > 0);
    let pd = false;
    handlers.forEach(fn => fn({ preventDefault: () => { pd = true; }, clientX: 1, clientY: 2 }));
    ok('T20c ghost click prevented on tap-down', pd === true);
    hcHideSug('pick');
  }

  // ---- T21: seeker typing space auto-clears when MY lane advances
  // (the hider scored my proposal — don't resurrect the old character)
  seed(mkRoom({ hc: Object.assign({}, mkRoom().hc, {
    round: 2, hider: 'A',
    sk: { B: { a: 2, s: 'on' }, C: { a: 1, s: 'on' } },
    guesses: { '-K910': { by: 'B', name: 'Nami', image: '', score: 44, r: 2, at: 1 } }
  }) }));
  playerId = 'B';
  updateHotcold(); // primes the lane watcher (a=2)
  {
    const gi = document.getElementById('hcGuessInput');
    const sug = document.getElementById('hcGuessSuggest');
    gi.value = 'Eren Yeager'; // seeker typed a fresh proposal…
    sug.classList.add('show');
    __getRoom().hc.sk.B.a = 3; // …and the hider scored the previous one
    syncRoom(); // mirror the store change
    updateHotcold();
    ok('T21a typing space emptied on score', gi.value === '');
    ok('T21b suggestions dropdown closed with it', sug.classList.contains('show') === false);
    // and without a lane change the text stays (typing is not clobbered mid-draft)
    gi.value = 'Giyu Tomioka';
    updateHotcold();
    ok('T21c no lane change → draft preserved', gi.value === 'Giyu Tomioka');
  }

  // ---- T22: individual-guess mode — seekers see ONLY their own scored
  // guesses, the hider keeps the full log; shared (default) is untouched
  {
    const rr = mkRoom({ hc: Object.assign({}, mkRoom().hc, {
      round: 2, hider: 'A',
      sk: { B: { a: 1, s: 'on' }, C: { a: 2, s: 'on' } },
      guesses: {
        '-K1': { by: 'B', name: 'Nami', image: '', score: 30, r: 2, at: 100 },
        '-K2': { by: 'C', name: 'Zoro', image: '', score: 55, r: 2, at: 200 },
        '-K3': { by: 'B', name: 'Robin', image: '', score: 61, r: 2, at: 300 }
      }
    }) });

    // T22a/b: shared mode (no setting) — seekers & hider all see the full log
    rr.settings = { hcMode: 'shared' };
    seed(rr);
    playerId = 'B';
    ok('T22a shared mode: seeker sees every guess', Object.keys(hcVisibleGuesses(currentRoom.hc)).length === 3);
    playerId = 'A';
    ok('T22b shared mode: hider sees every guess', Object.keys(hcVisibleGuesses(currentRoom.hc)).length === 3);

    // T22c/d/e: individual mode — seeker B sees ONLY their own two rows
    const rInd = JSON.parse(JSON.stringify(rr));
    rInd.settings = { hcMode: 'individual' };
    seed(rInd);
    playerId = 'B';
    const mine = hcVisibleGuesses(currentRoom.hc);
    ok('T22c individual: seeker sees only own guesses', Object.keys(mine).length === 2 && Object.keys(mine).every(k => mine[k].by === 'B'));
    ok('T22d individual: mode getter reads the setting', hcGuessMode() === 'individual');
    playerId = 'A';
    ok('T22e individual: hider still sees everything', Object.keys(hcVisibleGuesses(currentRoom.hc)).length === 3);

    // T22f/g: render plumbing — the log lists only MY rows for a seeker
    playerId = 'B';
    updateHotcold();
    {
      const log = document.getElementById('hcLog');
      const rows = Array.from(log.children).filter(el => String(el.className || '').indexOf('hc-row') !== -1);
      ok('T22f individual: log shows only my rows', rows.length === 2);
      const title = document.getElementById('hcLogTitle');
      ok('T22g individual: log title says MY guesses', title && title.textContent.indexOf('My guesses') !== -1);
      const topTitle = document.getElementById('hcTopTitle');
      ok('T22h individual: top title says MY best guesses', topTitle && topTitle.textContent.indexOf('My best guesses') !== -1);
    }

    // T22i: back to shared — seeker B sees all 3 rows again
    delete rInd.settings; seed(JSON.parse(JSON.stringify(rr)));
    playerId = 'B'; updateHotcold();
    {
      const log = document.getElementById('hcLog');
      const rows = Array.from(log.children).filter(el => String(el.className || '').indexOf('hc-row') !== -1);
      ok('T22i shared: log shows every row again', rows.length === 3);
    }
    playerId = 'B';
  }

  // ---- T23: "Watched" pool — HC + Blur only see characters/covers from
  // anime a synced account watched (checked statuses only)
  {
    const mkWatchRoom = (over) => Object.assign({}, mkRoom(), {
      settings: { pool: 'watched' },
      accounts: { bob: { username: 'bob', characters: [], count: 0,
        watched: [{ i: 21, t: 'ONE PIECE', s: 'completed' }], ws: ['completed'] } }
    }, over || {});

    seed(mkWatchRoom());
    playerId = 'B';
    const opPool = hcPoolChars();
    ok('T23a watched HC pool = only ONE PIECE characters', opPool.length > 0 && opPool.every(c => c.series === 'ONE PIECE'));

    seed(mkWatchRoom({ accounts: { bob: { username: 'bob', characters: [], count: 0,
      watched: [{ i: 21, t: 'ONE PIECE', s: 'completed' }], ws: ['planning'] } } }));
    ok('T23b status NOT checked → filtered out (empty pool)', hcPoolChars().length === 0);

    seed(mkWatchRoom({ accounts: { bob: { username: 'bob', characters: [], count: 0,
      watched: [{ i: 21, t: 'ONE PIECE', s: 'completed' }] } } })); // no ws at all
    ok('T23c missing ws → default statuses (completed counts)', hcPoolChars().length > 0);

    seed(mkWatchRoom({ bg: { mode: 'covers' } }));
    const cov = bgCandidateChars();
    ok('T23d watched covers pool = only watched anime ids', cov.length === 1 && cov[0] && cov[0].name === 'ONE PIECE');

    seed(mkWatchRoom({ settings: { pool: 'random' }, bg: { mode: 'covers' } }));
    ok('T23e random covers pool = full website library', bgCandidateChars().length >= 400);

    seed(mkWatchRoom({ settings: { pool: 'random' }, bg: { mode: 'characters' } }));
    ok('T23f random characters pool = full generic pool', bgCandidateChars().length >= 4000);

    // 'watching' checkbox covers CURRENT + REPEATING statuses
    seed(mkWatchRoom({ accounts: { bob: { username: 'bob', characters: [], count: 0,
      watched: [{ i: 21, t: 'ONE PIECE', s: 'repeating' }], ws: ['watching'] } } }));
    ok('T23g repeating counts as watching', hcPoolChars().length > 0);
  }

  // ---- T24: Guess Who boards — equal favorites split (no more distribution
  // bar) + the Mix split bar (settings/mixCount)
  {
    const mkAcc = (username, base, n) => {
      const chars = [];
      for (let i = 0; i < n; i++) chars.push({ id: base + i, name: 'TESTFAV_' + base + '_' + i, image: '', series: 'T', gender: 'female', mediaType: 'anime' });
      return { username: username, characters: chars, count: chars.length };
    };
    const seedGw = (settings, accounts) => {
      seed({
        state: 'lobby', game: 'guesswho', settings: settings, accounts: accounts,
        players: { A: { id: 'A', name: 'HiderA', ready: true }, B: { id: 'B', name: 'SeekerB', ready: true } }
      });
      playerId = 'A'; isHost = true;
    };
    const writeChars = () => {
      const w = lastUpd();
      return ((w && w.o && w.o.characters) || []);
    };

    // T24a: 2 accounts × 40 favorites each, board 24 → exactly 12 + 12
    seedGw({ characterCount: 24, source: 'favorites' }, { a1: mkAcc('a1', 991000, 40), a2: mkAcc('a2', 992000, 40) });
    await generateCharacterPool();
    {
      const cs = writeChars();
      const from1 = cs.filter(c => c.id >= 991000 && c.id < 992000).length;
      const from2 = cs.filter(c => c.id >= 992000 && c.id < 993000).length;
      ok('T24a favorites board split equally 12+12', cs.length === 24 && from1 === 12 && from2 === 12);
    }

    // T24b: mix with the bar at 8 → 8 generic + 16 favorites
    seedGw({ characterCount: 24, source: 'mix', mixCount: 8 }, { a1: mkAcc('a1', 993000, 40), a2: mkAcc('a2', 994000, 40) });
    await generateCharacterPool();
    {
      const cs = writeChars();
      const favs = cs.filter(c => String(c.name || '').indexOf('TESTFAV_') === 0).length;
      ok('T24b mix bar: 8 generic + 16 favorites', cs.length === 24 && favs === 16);
    }

    // T24c: mix WITHOUT a stored bar value → default 50/50
    seedGw({ characterCount: 24, source: 'mix' }, { a1: mkAcc('a1', 995000, 40), a2: mkAcc('a2', 996000, 40) });
    await generateCharacterPool();
    {
      const cs = writeChars();
      const favs = cs.filter(c => String(c.name || '').indexOf('TESTFAV_') === 0).length;
      ok('T24c mix default: 12 generic + 12 favorites', cs.length === 24 && favs === 12);
    }
    isHost = false;
  }

  // ---- T25: SHARED guesses = points win system · hidden ranking toggle ·
  // hider eraser · AFK queue skip · spectator public view
  {
    const mkShared = (over) => {
      const r = mkRoom({ settings: { hcMode: 'shared' } });
      if (over && over.hc) r.hc = Object.assign({}, r.hc, over.hc);
      return r;
    };

    // T25a/b: shared mode → the hider's score IS the points the seeker banks
    seed(mkShared());
    playerId = 'A';
    await hcAwardScore('B', { name: 'Nami', image: '' }, 82, null);
    ok('T25a shared: the score lands AS points', (__getRoom().hc.totals.B) === 82);
    await hcAwardScore('B', { name: 'Robin', image: '' }, 61, null);
    ok('T25b shared: points accumulate', (__getRoom().hc.totals.B) === 143);

    // T25c-f: winner selection per mode
    ok('T25c points winner = biggest total', hcPointsWinner(['A', 'B', 'C'], { A: 0, B: 190, C: 150 }) === 'B');
    ok('T25d tie → draw', hcPointsWinner(['A', 'B'], { A: 100, B: 100 }) === 'draw');
    ok('T25e individual keeps golf winner', hcWinnerOf(['A', 'B', 'C'], { A: 3, B: 2, C: 5 }, 'individual') === 'B');
    ok('T25f shared uses points winner', hcWinnerOf(['A', 'B', 'C'], { A: 3, B: 2, C: 5 }, 'shared') === 'C');

    // T25g/h: hide-rank parks the live ranking panel until match end
    {
      const rH = mkShared(); rH.settings.hcHideRank = true;
      seed(rH); playerId = 'B'; updateHotcold();
      ok('T25g hidden ranking parks the panel', document.getElementById('hcRank').style.display === 'none');
      const rS = mkShared(); seed(rS); updateHotcold();
      ok('T25h default ranking shows again', document.getElementById('hcRank').style.display !== 'none');
    }

    // T25i: the hider's eraser wipes the pick box
    {
      const pk = document.getElementById('hcPickInput');
      pk.value = 'Mikasa';
      hcClearPick();
      ok('T25i eraser clears the pick input', pk.value === '');
    }

    // T25j: AFK queue entries never auto-promote into seats
    seed({
      state: 'lobby', game: 'hotcold', maxPlayers: 3,
      players: { A: { id: 'A', name: 'HiderA', isHost: true }, B: { id: 'B', name: 'SeekerB' } },
      queue: { Q1: { id: 'Q1', name: 'AFKGuy', joinedAt: 1, away: true }, Q2: { id: 'Q2', name: 'Waiting', joinedAt: 2 } }
    });
    playerId = 'A'; isHost = true;
    await maybePromoteQueue();
    {
      const w = lastUpd();
      ok('T25j AFK queue entry is never promoted', !!w && !!w.o && !!w.o['players/Q2'] && w.o['queue/Q2'] === null && !w.o['players/Q1']);
    }
    isHost = false;

    // T25k/m: spectator view — public info only, hidden-rank respected
    {
      const rSp = mkShared();
      rSp.hc = Object.assign({}, rSp.hc, { guesses: { '-K1': { by: 'B', name: 'Nami', image: '', score: 61, r: 1, at: 1 } } });
      seed(rSp); playerId = 'Q1'; // a queued spectator
      renderSpectate();
      const feed = document.getElementById('specFeed');
      ok('T25k spectator feed shows the shared score', feed.children.some(c => String(c.textContent).indexOf('61') !== -1));
      ok('T25l spectator scoreboard lists players', document.getElementById('specScore').innerHTML.indexOf('HiderA') !== -1);
      rSp.settings = Object.assign({}, rSp.settings, { hcHideRank: true });
      seed(rSp); renderSpectate();
      ok('T25m hidden ranking parks the spectator scoreboard too', document.getElementById('specScore').innerHTML.indexOf('Ranking hidden') !== -1);
      playerId = 'B';
    }
  }

  // ---- T26: shared = 3+ players ONLY (2 seats force individual) · Watched
  // as the 4th Guess Who pool source
  {
    // T26a: a 2-seat room asking for shared plays individual
    const rDuo = {
      state: 'playing', game: 'hotcold',
      settings: { hcMode: 'shared' },
      players: { A: { id: 'A', name: 'HiderA' }, B: { id: 'B', name: 'SeekerB' } },
      hc: { hider: 'A' }
    };
    seed(rDuo);
    ok('T26a 2 players: shared asked → individual effective', hcModeOfRoom(currentRoom) === 'individual');

    // T26b: golf scoring (+1) applies in that 2-seat match (not the score)
    seed({
      state: 'playing', game: 'hotcold',
      settings: { hcMode: 'shared' },
      players: { A: { id: 'A', name: 'HiderA' }, B: { id: 'B', name: 'SeekerB' } },
      hc: { gameId: 77, round: 1, phase: 'play', order: ['A', 'B'], hider: 'A',
        secret: { id: 1, name: 'X', image: '' }, sk: { B: { a: 0, s: 'on' } }, totals: { A: 0, B: 0 } }
    });
    playerId = 'A';
    await hcAwardScore('B', { name: 'Nami', image: '' }, 82, null);
    ok('T26b 2-seat shared match scores golf +1, not the score', (__getRoom().hc.totals.B) === 1);

    // T26c: 3 seats with shared stays shared + scores points
    ok('T26c 3 seats: shared stays shared', hcModeOfRoom(mkRoom({ settings: { hcMode: 'shared' } })) === 'shared');

    // T26d: Guess Who board from the Watched source = watched-anime chars only
    {
      const room = {
        state: 'lobby', game: 'guesswho',
        settings: { characterCount: 24, source: 'watched' },
        accounts: { bob: { username: 'bob', characters: [], count: 0,
          watched: [{ i: 21, t: 'ONE PIECE', s: 'completed' }], ws: ['completed'] } },
        players: { A: { id: 'A', name: 'HiderA', ready: true }, B: { id: 'B', name: 'SeekerB', ready: true } }
      };
      seed(room); playerId = 'A'; isHost = true;
      await generateCharacterPool();
      const cs = (lastUpd() && lastUpd().o && lastUpd().o.characters) || [];
      ok('T26d watched Guess Who board = watched-anime characters only', cs.length === 24 && cs.every(c => c.series === 'ONE PIECE'));
      isHost = false;
    }
    playerId = 'B';
  }

  // ---- T27: id-based watched matching (same-title collisions) · typo
  // fallback search · rematch double-launch latch · foreign-pick guard
  {
    // T27a: the OTHER 'WIND BREAKER' (the 135083 manga) does NOT unlock the 2024 chars
    {
      const roomManga = {
        state: 'lobby', game: 'hotcold', settings: { pool: 'watched' },
        accounts: { bob: { username: 'bob', characters: [], count: 0,
          watched: [{ i: 135083, t: 'WIND BREAKER', s: 'completed' }], ws: ['completed'] } },
        players: { A: { id: 'A', name: 'A-Name' }, B: { id: 'B', name: 'B-Name' } }
      };
      seed(roomManga); playerId = 'A';
      const pool = watchedPoolChars(currentRoom);
      ok('T27a manga WIND BREAKER unlocks no 2024-anime chars (id match wins)', !pool.some(c => c.series === 'WIND BREAKER'));
    }
    // T27b: the real 2024 anime (163270) DOES unlock them
    {
      const roomAnime = {
        state: 'lobby', game: 'hotcold', settings: { pool: 'watched' },
        accounts: { bob: { username: 'bob', characters: [], count: 0,
          watched: [{ i: 163270, t: 'WIND BREAKER', s: 'completed' }], ws: ['completed'] } },
        players: { A: { id: 'A', name: 'A-Name' }, B: { id: 'B', name: 'B-Name' } }
      };
      seed(roomAnime);
      const pool2 = watchedPoolChars(currentRoom);
      ok('T27b 2024 WIND BREAKER unlocks its cast', pool2.some(c => c.series === 'WIND BREAKER'));
    }
    // T27c: the Bocchi row now points at Bocchi the Rock!
    {
      const relabel = GENERIC_CHARACTERS.filter(c => c.id === 257562);
      ok('T27c Hitori Gotou row points at Bocchi the Rock!', relabel.length === 1 && relabel[0].series === 'Bocchi the Rock!');
    }
    // T27d: typo fallback — 'hitori gotou' still surfaces her via the right token
    {
      const roomRnd = { state: 'lobby', game: 'hotcold', settings: { pool: 'random' }, players: { A: {}, B: {} }, accounts: {} };
      seed(roomRnd); playerId = 'A';
      const hitsTypo = hcSearch('hitori gotou');
      ok('T27d typo fallback finds Hitori Gotou', hitsTypo.some(c => c.name === 'Hitori Gotou'));
    }
    // T27e: launchNewGame fires only ONE deal even when the listener double-fires
    {
      const room = {
        state: 'finished', game: 'guesswho',
        settings: { characterCount: 24, source: 'generic' },
        players: { A: { id: 'A', name: 'A-Name', ready: true, isHost: true }, B: { id: 'B', name: 'B-Name', ready: true } },
        restarts: { A: true, B: true }, characters: null, selections: null, secrets: null
      };
      seed(room); playerId = 'A'; isHost = true;
      const mark = __writes.length;
      const d1 = launchNewGame(); const d2 = launchNewGame();
      await Promise.all([d1, d2]);
      const deals = __writes.slice(mark).filter(w => w.op === 'update' && w.o && w.o.characters);
      ok('T27e double listener event deals the board exactly once', deals.length === 1);
      isHost = false;
    }
    // T27f: startGameFromSelection refuses picks from a stale/foreign board
    {
      const room = {
        state: 'selection', game: 'guesswho',
        settings: { characterCount: 24, source: 'generic' },
        players: { A: { id: 'A', name: 'A-Name', ready: true, isHost: true }, B: { id: 'B', name: 'B-Name', ready: true } },
        characters: [{ id: 1001, name: 'Char One', image: 'a.jpg', series: 'Alpha' }, { id: 1002, name: 'Char Two', image: 'b.jpg', series: 'Alpha' }],
        selections: { A: 9999, B: 8888 }   // foreign ids (old board)
      };
      seed(room); playerId = 'A'; isHost = true;
      await updateSelectionStatus({ A: 9999, B: 8888 });
      const r = __getRoom();
      ok('T27f foreign picks are wiped, game not started', r.state === 'selection' && (!r.selections || !r.selections.A) && (!r.selections || !r.selections.B));
      isHost = false;
    }
    playerId = 'B';
  }
  return results.filter(Boolean);
})().then(r => { __TESTDONE = r; }).catch(e => { __TESTFAIL = (e && e.stack) || String(e); });
`;
vm.runInContext(tests, sandbox, { filename: 'tests.js' });

// ---------- wait for completion ----------
(async () => {
  for (let i = 0; i < 300 && !sandbox.__TESTDONE && !sandbox.__TESTFAIL; i++) await new Promise(r => setImmediate(r));
  if (sandbox.__TESTFAIL) { console.error('💥 HARNESS ERROR:\n' + sandbox.__TESTFAIL); process.exit(1); }
  const r = sandbox.__TESTDONE || [];
  let fails = 0;
  r.forEach(line => { if (line.startsWith('FAIL')) fails++; console.log((line.startsWith('PASS') ? '  ✅ ' : '  ❌ ') + line.slice(5)); });
  console.log(`\n${r.length - fails}/${r.length} tests passed`);
  process.exit(fails ? 1 : 0);
})();
