// Sakugame — Hot&Cold v37 tests (multiplayer 2-6: rotation, parallel lanes,
// queue scoring, Σ-totals classement, guards). REAL app.js in a VM, stub DOM+Firebase.
const fs = require('fs');
const vm = require('vm');
const R = '/home/user/Sakugame/';

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
// ============================================================================
// Battle Royale + Race — question/answer HISTORY & state-cleanup tests (T1-T6).
// ============================================================================
__TEST = (async () => {
  const results = []; console.log("TEST BODY STARTED");
  const ok = (name, cond) => results.push((cond ? 'PASS' : 'FAIL') + ' ' + name);
  const syncRoom = () => { currentRoom = JSON.parse(JSON.stringify(__getRoom())); };
  const CHARS = [1,2,3,4,5,6].map(i => ({ id: i, name: 'Char' + i, image: 'i' + i + '.jpg', series: 'S' }));
  const logEntries = (g) => Object.values(((currentRoom[g] || {}).log) || {});
  function mkBattleRoom() { return {
    state: 'playing', game: 'battle', maxPlayers: 8, settings: {}, characters: CHARS,
    host: 'A', createdAt: 1, lastActivity: Date.now(),
    players: { A: { id:'A', name:'Aria', isHost:true }, B: { id:'B', name:'Bex' }, C: { id:'C', name:'Cy' } },
    br: { gameId: 1, phase: 'ask', order: ['A','B','C'], turnIdx: 0, question: null, answers: null,
          secrets: { A: 1, B: 2, C: 3 }, found: null, points: { A:0, B:0, C:0 }, guess: null, log: null }
  }; }

  // T1 — happy path: asker asks, everyone answers, asker presses Next turn.
  __setRoom(mkBattleRoom());
  playerId = 'A'; playerName = 'Aria'; isHost = true; syncRoom();
  roomCode = 'TEST';
  await database.ref('rooms/TEST/br').update({ question: { by: 'A', text: 'Is it a shonen?' }, phase: 'answers', answers: null });
  syncRoom();
  await database.ref('rooms/TEST/br/answers/B').set('YES');
  await database.ref('rooms/TEST/br/answers/C').set('NO');
  syncRoom();
  ok('T1a all answers in', battleAllAnswersIn() === true);
  await battleNextTurn();
  syncRoom();
  let L = logEntries('br');
  ok('T1b answers summary in history', L.some(e => e.k === 'ans' && /shonen/.test(e.txt) && /Bex YES/.test(e.txt) && /Cy NO/.test(e.txt)));
  ok('T1c question cleared', !currentRoom.br.question);
  ok('T1d answers wiped for next round', !currentRoom.br.answers || Object.keys(currentRoom.br.answers).length === 0);
  ok('T1e turn advanced to B', currentRoom.br.turnIdx === 1);

  // T2 — new round starts clean: the chips must show "…" for everyone
  playerId = 'B'; playerName = 'Bex'; syncRoom();
  await database.ref('rooms/TEST/br').update({ question: { by: 'B', text: 'Male?' }, phase: 'answers', answers: null });
  syncRoom();
  ok('T2a no stale answers on the new question', !currentRoom.br.answers || Object.keys(currentRoom.br.answers).length === 0);
  ok('T2b allAnswersIn false before answers', battleAllAnswersIn() === false);
  await database.ref('rooms/TEST/br/answers/A').set('NO');
  syncRoom();
  ok('T2c not all in with C missing', battleAllAnswersIn() === false);
  await database.ref('rooms/TEST/br/answers/C').set('YES');
  syncRoom();
  ok('T2d all in once everyone answered', battleAllAnswersIn() === true);

  // T3 — GUESS interrupts a live Q&A: watchdog resolves the guess; the pending
  // answers must be kept in the history too (they were LOST before the fix).
  playerName = 'Bex'; syncRoom();
  battleWatchdog(); // host(A) is current playerId? keep host semantics: set host
  playerId = 'A'; isHost = true; syncRoom();
  await database.ref('rooms/TEST/br/guess').set({ by: 'B', target: 'C', charId: 3 }); // correct guess by B
  syncRoom();
  battleWatchdog();
  await new Promise(r => setTimeout(r, 60));
  syncRoom();
  L = logEntries('br');
  ok('T3a guess found logged', L.some(e => e.k === 'find' && /Cy/.test(e.txt)));
  ok('T3b pending answers preserved in history', L.some(e => e.k === 'ans' && /Male\?/.test(e.txt) && /NO/.test(e.txt) && /YES/.test(e.txt)));
  ok('T3c answers wiped after guess', !currentRoom.br.answers || Object.keys(currentRoom.br.answers).length === 0);

  // T4 — vanished asker: turn skipped, partial answers still preserved
  __setRoom(mkBattleRoom());
  playerId = 'A'; playerName = 'Aria'; isHost = true; syncRoom();
  await database.ref('rooms/TEST/br').update({ question: { by: 'A', text: 'Fly?' }, phase: 'answers', answers: { B: 'YES' } });
  await database.ref('rooms/TEST/players/A/dcAt').set(Date.now() - 1000); // asker dropped
  syncRoom();
  battleWatchdog();
  await new Promise(r => setTimeout(r, 60));
  syncRoom();
  L = logEntries('br');
  ok('T4a turn skipped past vanished asker', !currentRoom.br.question && currentRoom.br.turnIdx === 1);
  ok('T4b partial answers kept in history', L.some(e => e.k === 'ans' && /Fly\?/.test(e.txt) && /Bex YES/.test(e.txt)));
  ok('T4c answers wiped', !currentRoom.br.answers || Object.keys(currentRoom.br.answers).length === 0);

  // T5 — RACE: question+answer flow, history, cleanup
  __setRoom({ state: 'playing', game: 'race', maxPlayers: 8, settings: { raceLives: 3, raceQuestions: 8 },
    characters: CHARS, host: 'A', createdAt: 1, lastActivity: Date.now(),
    players: { A: { id:'A', name:'Aria', isHost:true }, B: { id:'B', name:'Bex' }, C: { id:'C', name:'Cy' } },
    rc: { gameId: 1, phase: 'ask', hunters: ['B','C'], turnIdx: 0, targetPid: 'A', secretId: 1, question: null, answer: null,
          livesLeft: { B: 3, C: 3 }, questionsLeft: { B: 8, C: 8 }, log: null } });
  playerId = 'B'; playerName = 'Bex'; isHost = false; syncRoom();
  const rin = document.getElementById('rcQuestionInput'); rin.value = 'Can they fly?';
  await raceAsk();
  syncRoom();
  L = logEntries('rc');
  ok('T5a question logged with remaining budget', L.some(e => e.k === 'q' && /Bex/.test(e.txt) && /fly/.test(e.txt) && /7 questions left/.test(e.txt)));
  ok('T5b no answer logged yet', !currentRoom.rc.answer);
  playerId = 'A'; playerName = 'Aria'; isHost = true; syncRoom();
  await raceAnswer('YES');
  syncRoom();
  await raceNextTurn();
  syncRoom();
  L = logEntries('rc');
  ok('T5c target answer in history', L.some(e => e.k === 'ans' && /YES/.test(e.txt) && /fly/.test(e.txt)));
  ok('T5d question & answer cleared, next hunter', !currentRoom.rc.question && !currentRoom.rc.answer && currentRoom.rc.turnIdx === 1);

  // T6 — RACE: a wrong guess must NOT wipe the live question (guesses are free)
  playerId = 'C'; playerName = 'Cy'; syncRoom(); // turnIdx 1 → C is the asking hunter
  const rin2 = document.getElementById('rcQuestionInput'); rin2.value = 'From a shonen?';
  await raceAsk();
  syncRoom();
  await database.ref('rooms/TEST/rc/guess').set({ by: 'C', charId: 2 }); // C guesses wrong (free)
  playerId = 'A'; isHost = true; syncRoom();
  raceWatchdog();
  await new Promise(r => setTimeout(r, 60));
  syncRoom();
  L = logEntries('rc');
  ok('T6a wrong guess logged with lives', L.some(e => e.k === 'miss' && /Cy/.test(e.txt) && /2 lives left/.test(e.txt)));
  ok('T6b live question survives a free guess', !!(currentRoom.rc.question && /shonen/.test(currentRoom.rc.question.text)));
  ok('T6c hunter lives decremented', (currentRoom.rc.livesLeft || {}).C === 2);
  return results.filter(Boolean);
})().then(r => { __TESTDONE = r; }).catch(e => { __TESTFAIL = (e && e.stack) || String(e); });
`;
vm.runInContext(tests, sandbox, { filename: 'tests.js' });

(async () => {
  for (let i = 0; i < 4000 && !sandbox.__TESTDONE && !sandbox.__TESTFAIL; i++) await new Promise(r => setTimeout(r, 5));
  if (sandbox.__TESTFAIL) { console.error('💥 HARNESS ERROR:\n' + sandbox.__TESTFAIL); process.exit(1); }
  const r = sandbox.__TESTDONE || [];
  let fails = 0;
  r.forEach(line => { if (line.startsWith('FAIL')) fails++; console.log((line.startsWith('PASS') ? '  ✅ ' : '  ❌ ') + line.slice(5)); });
  console.log(`\n${r.length - fails}/${r.length} tests passed`);
  process.exit(fails ? 1 : 0);
})();
