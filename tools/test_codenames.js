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
// ============================================================================
// Code Names tests (C1-C8 groups): team setup, deal, clue, guess rules,
// pass, watchdog rescue. Pure resolver + Firebase-room actions, VM-verified.
// ============================================================================
__TEST = (async () => {
  const results = []; console.log("TEST BODY STARTED");
  roomCode = 'TEST';
  const ok = (name, cond) => results.push((cond ? 'PASS' : 'FAIL') + ' ' + name);
  const syncRoom = () => { currentRoom = JSON.parse(JSON.stringify(__getRoom())); };
  const cnLogs = () => Object.values(((__getRoom().cn || {}).log) || {});
  const P6 = () => ({ A: { id: 'A', name: 'Aria', isHost: true }, B: { id: 'B', name: 'Bex' }, C: { id: 'C', name: 'Cy' }, D: { id: 'D', name: 'Dee' }, E: { id: 'E', name: 'Eli' }, F: { id: 'F', name: 'Fay' } });
  function mkLobby() { return { game: 'codenames', state: 'lobby', maxPlayers: 8, settings: { source: 'generic', characterCount: 24, mixCount: 12 }, createdAt: 1, lastActivity: Date.now(), players: P6() }; }
  function mkTeamsRoom(redMembers, blueMembers, spyRed, spyBlue) {
    const r = mkLobby(); r.state = 'teams';
    const mk = (arr, spy) => { const m = {}; arr.forEach(p => { m[p] = true; }); return { spy, members: m }; };
    r.cn = { gameId: 1, teams: { red: mk(redMembers, spyRed), blue: mk(blueMembers, spyBlue) } };
    return r;
  }
  // deterministic board/key for rule tests: 0-8 RED, 9-16 BLUE, 17-23 BEIGE, 24 BLACK
  function mkCn(partial) {
    const board = []; const key = {};
    for (let i = 0; i < 25; i++) { board.push({ id: 200 + i, name: 'Cn' + i, image: 'x.jpg', series: 'S' }); key[String(i)] = i < 9 ? 'red' : i < 17 ? 'blue' : i < 24 ? 'beige' : 'black'; }
    return Object.assign({ gameId: 7, board, key, first: 'red', turn: 'red', phase: 'guess', clue: { word: 'hot', n: 2, by: 'A', at: 1 },
      guessesLeft: 2, revealed: {}, rem: { red: 9, blue: 8 }, winner: null,
      teams: { red: { spy: 'A', members: { A: true, B: true, C: true } }, blue: { spy: 'D', members: { D: true, E: true, F: true } } } }, partial || {});
  }

  // ---------- C1: team setup & gates ----------
  __setRoom(mkLobby()); syncRoom(); isHost = true; playerId = 'A';
  await cnOpenTeams(); syncRoom();
  ok('C1a open teams state', currentRoom.state === 'teams' && !!((currentRoom.cn || {}).gameId));
  playerId = 'A'; await cnJoinTeam('red'); syncRoom();
  playerId = 'B'; await cnJoinTeam('red'); syncRoom();
  playerId = 'C'; await cnJoinTeam('blue'); syncRoom();
  playerId = 'D'; await cnJoinTeam('blue'); syncRoom();
  let tm = cnTeams();
  ok('C1b first member grabs the spymaster key', tm.red.spy === 'A' && tm.blue.spy === 'C');
  ok('C1c later joins are guessers', tm.red.members.length === 2 && tm.blue.members.length === 2);
  playerId = 'B'; await cnJoinTeam('blue'); syncRoom(); // B hops red→blue
  tm = cnTeams();
  ok('C1d moving teams works both ways', tm.red.members.length === 1 && tm.blue.members.length === 3);
  playerId = 'B'; await cnJoinTeam('blue'); syncRoom(); // re-tap = bench
  tm = cnTeams();
  ok('C1e re-tap leaves the team (bench)', tm.blue.members.length === 2 && !cnTeamOf('B'));
  __setRoom(mkTeamsRoom(['A', 'B'], ['C', 'D'], 'A', 'C')); syncRoom();
  await cnSetTeam('A', null); syncRoom(); // spymaster steps out
  tm = cnTeams();
  ok('C1f spy hand-off when spy leaves', tm.red.spy === 'B');
  // gates
  __setRoom(mkTeamsRoom(['A'], ['C', 'D'], 'A', 'C')); syncRoom();
  ok('C1g gate refuses a 1v2 split', !cnTeamsGate().ok);
  __setRoom(mkTeamsRoom(['A', 'B'], ['C', 'D'], 'A', null)); syncRoom();
  ok('C1h gate refuses a team with no spymaster', !cnTeamsGate().ok);
  __setRoom(mkTeamsRoom(['A', 'B'], ['C', 'D'], 'A', 'C')); syncRoom();
  ok('C1i gate refuses while E+F sit on the bench', !cnTeamsGate().ok);
  __setRoom(mkTeamsRoom(['A', 'B', 'E'], ['C', 'D', 'F'], 'A', 'C')); syncRoom();
  ok('C1j gate opens on a valid 3v3', cnTeamsGate().ok);
  // random
  __setRoom(mkTeamsRoom([], [], null, null)); syncRoom();
  await cnRandomTeams(); syncRoom();
  tm = cnTeams();
  ok('C1k random makes 3v3, everyone seated', tm.red.members.length === 3 && tm.blue.members.length === 3 && tm.red.members.concat(tm.blue.members).sort().join('') === 'ABCDEF');
  ok('C1l random sets spies', tm.red.members.indexOf(tm.red.spy) !== -1 && tm.blue.members.indexOf(tm.blue.spy) !== -1);

  // ---------- C2: the deal ----------
  __setRoom(mkTeamsRoom(['A', 'B', 'E'], ['C', 'D', 'F'], 'A', 'C')); syncRoom(); isHost = true; playerId = 'A';
  await cnDeal(); syncRoom();
  const cn2 = currentRoom.cn || {};
  ok('C2a deal starts the game', currentRoom.state === 'playing' && cn2.phase === 'clue' && cn2.turn === cn2.first);
  ok('C2b 25 unique characters', (cn2.board || []).length === 25 && new Set((cn2.board || []).map(c => c.id)).size === 25);
  const cnt = { red: 0, blue: 0, beige: 0, black: 0 };
  Object.values(cn2.key || {}).forEach(c => { cnt[c] = (cnt[c] || 0) + 1; });
  const other2 = cn2.first === 'red' ? 'blue' : 'red';
  ok('C2c key is 9 first / 8 other / 7 beige / 1 black', cnt[cn2.first] === 9 && cnt[other2] === 8 && cnt.beige === 7 && cnt.black === 1);
  ok('C2d rem mirrors the first team', (cn2.rem || {})[cn2.first] === 9 && (cn2.rem || {})[other2] === 8);

  // ---------- C3: the clue ----------
  const cnTurnSpy = (cnObj) => (cnObj.turn === 'red' ? 'A' : 'C');
  playerId = cnTurnSpy(cn2); syncRoom();
  document.getElementById('cnClueNum').value = '2';
  document.getElementById('cnClueWord').value = 'two words';
  cnSendClue(); syncRoom();
  ok('C3a two-word clue refused', (currentRoom.cn || {}).phase === 'clue' && !(currentRoom.cn || {}).clue);
  const someName = String(((cn2.board || [])[3] || {}).name || 'zzz').toLowerCase();
  document.getElementById('cnClueWord').value = someName;
  cnSendClue(); syncRoom();
  ok('C3b a clue matching a visible name refused', !(currentRoom.cn || {}).clue);
  document.getElementById('cnClueWord').value = 'frognaruto9000'; // provably not a board name
  cnSendClue(); syncRoom();
  const cn3 = currentRoom.cn || {};
  ok('C3c valid clue opens the pick phase', cn3.phase === 'guess' && cn3.guessesLeft === 2 && cn3.clue && cn3.clue.word === 'frognaruto9000' && cn3.clue.n === 2);
  ok('C3d clue logged', cnLogs().some(e => e.k === 'clue-' + cn3.turn && /frognaruto9000/.test(e.txt)));
  playerId = 'B'; // guessers can't clue
  document.getElementById('cnClueWord').value = 'anotherxx';
  cnSendClue(); syncRoom();
  ok('C3e non-spymaster cannot clue', ((currentRoom.cn || {}).clue || {}).word === 'frognaruto9000');

  // ---------- C4: guess rules (pure resolver, deterministic board) ----------
  let r4 = cnResolveGuess(mkCn(), 'red', 0, '<b>B</b>'); // own agent
  ok('C4a own agent: revealed, no error', !r4.err && r4.upd['cn/revealed/0'] === 'red');
  ok('C4b own agent: -1 agent, -1 pick, turn kept', r4.upd['cn/rem/red'] === 8 && r4.upd['cn/guessesLeft'] === 1 && !r4.upd['cn/turn']);
  r4 = cnResolveGuess(mkCn({ rem: { red: 1, blue: 8 }, guessesLeft: 2 }), 'red', 0); // LAST own agent
  ok('C4c last agent wins the game', r4.winnerFlag === true && r4.upd['state'] === 'finished' && r4.upd['cn/winner'].team === 'red' && r4.upd['cn/winner'].reason === 'agents');
  r4 = cnResolveGuess(mkCn(), 'red', 17); // bystander
  ok('C4d beige ends the turn', !r4.winnerFlag && r4.upd['cn/turn'] === 'blue' && r4.upd['cn/phase'] === 'clue' && r4.upd['cn/guessesLeft'] === 0);
  r4 = cnResolveGuess(mkCn(), 'red', 9); // opponent agent
  ok('C4e opponent card: helps them, ends turn', r4.upd['cn/rem/blue'] === 7 && r4.upd['cn/turn'] === 'blue' && !r4.winnerFlag);
  r4 = cnResolveGuess(mkCn({ rem: { red: 9, blue: 1 } }), 'red', 9); // their LAST agent
  ok('C4f revealing their last agent gives THEM the win', r4.winnerFlag === true && r4.upd['cn/winner'].team === 'blue' && r4.upd['cn/winner'].reason === 'agents');
  r4 = cnResolveGuess(mkCn(), 'red', 24); // assassin
  ok('C4g black card = instant loss, other team wins', r4.upd['cn/winner'] && r4.upd['cn/winner'].team === 'blue' && r4.upd['cn/winner'].reason === 'assassin' && r4.upd['state'] === 'finished');
  r4 = cnResolveGuess(mkCn({ revealed: { '0': 'red' } }), 'red', 0);
  ok('C4h already-revealed card rejected', r4.err === 'taken' && Object.keys(r4.upd).length === 0);

  // ---------- C5: live guess + pass through the room ----------
  __setRoom(mkTeamsRoom(['A', 'B', 'E'], ['C', 'D', 'F'], 'A', 'C')); syncRoom();
  __getRoom().cn = mkCn(); __getRoom().state = 'playing'; syncRoom();
  playerId = 'B'; isHost = false;
  ok('C5a guessers may pick', cnCanIGuess(currentRoom.cn) === true);
  ok('C5b spy blocked from picking', (() => { const save = playerId; playerId = 'A'; const r = !cnCanIGuess(currentRoom.cn); playerId = save; return r; })());
  playerId = 'B';
  await doCnGuess(0); syncRoom(); // RED hits own agent
  const cn5 = currentRoom.cn || {};
  ok('C5c live guess: revealed + rem 8 + one pick left', (cn5.revealed || {})['0'] === 'red' && (cn5.rem || {}).red === 8 && cn5.guessesLeft === 1 && cn5.turn === 'red');
  ok('C5d guess logged with the picker', cnLogs().some(e => e.k === 'find-red' && /Bex/.test(e.txt)));
  await cnPass(); syncRoom();
  const cn5b = currentRoom.cn || {};
  ok('C5e pass hands the turn over', cn5b.turn === 'blue' && cn5b.phase === 'clue' && cn5b.guessesLeft === 0 && cnLogs().some(e => e.k === 'info' && /passes/.test(e.txt)));

  // ---------- C6: watchdog: dead team = forfeit, dead spy = hand-off ----------
  __setRoom(mkTeamsRoom(['A', 'B', 'E'], ['C', 'D', 'F'], 'A', 'C')); syncRoom();
  __getRoom().cn = mkCn(); __getRoom().state = 'playing';
  delete __getRoom().players.D; delete __getRoom().players.E; delete __getRoom().players.F; syncRoom(); // mkCn: blue team = D,E,F
  isHost = true; playerId = 'A';
  await cnWatchdog(); syncRoom();
  const cn6 = currentRoom.cn || {};
  ok('C6a a vanished team forfeits the game', cn6.phase === 'over' && cn6.winner && cn6.winner.team === 'red' && cn6.winner.reason === 'team-left');
  __setRoom(mkTeamsRoom(['A', 'B', 'E'], ['C', 'D', 'F'], 'A', 'C')); syncRoom();
  __getRoom().cn = mkCn(); __getRoom().state = 'playing';
  delete __getRoom().players.A; syncRoom(); // red spy gone mid-game
  isHost = true; playerId = 'B';
  await cnWatchdog(); syncRoom();
  ok('C6b a dead spymaster hands the key to a teammate', ((currentRoom.cn || {}).teams || {}).red.spy === 'B');

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
