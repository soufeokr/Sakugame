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
// Rejoin-offer tests (R1-R9): the "You left a game! → Rejoin" homepage offer
// after closing the app mid-session. Regression: the offer used to silently
// self-destruct when the host's 45s purge had removed our ghost seat.
// ============================================================================
__TEST = (async () => {
  const results = []; console.log("TEST BODY STARTED");
  const ok = (name, cond) => results.push((cond ? 'PASS' : 'FAIL') + ' ' + name);
  // ---- working in-memory localStorage (the global stub is a no-op) ----
  const store = {};
  localStorage.getItem = (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null);
  localStorage.setItem = (k, v) => { store[k] = String(v); };
  localStorage.removeItem = (k) => { delete store[k]; };
  const SKEY = 'sakugame_session_v1', DKEY = 'sakugame_rejoin_dbg';
  const dbg = () => { try { return JSON.parse(store[DKEY] || '{}'); } catch (e) { return {}; } };
  // ---- fixtures ----
  function mkRoom(state, withMe) {
    const players = { HOSTP: { id: 'HOSTP', name: 'Hana', isHost: true } };
    if (withMe) players[playerId] = { id: playerId, name: 'Me', isHost: false };
    return { game: 'guesswho', state: state || 'lobby', maxPlayers: 6, settings: {},
             createdAt: 1, lastActivity: Date.now(), players: players };
  }
  const putSession = (code, ts) => { store[SKEY] = JSON.stringify({ code: code, ts: ts }); };
  const modalTitle = () => document.getElementById('interactionWindow').classList.contains('show') ? document.getElementById('interactionTitle').innerHTML : '';
  const modalMsg = () => document.getElementById('interactionMessage').innerHTML;
  const modalButtons = () => document.getElementById('interactionButtons').children;
  function resetEnv() {
    document.getElementById('interactionWindow').classList.remove('show');
    document.getElementById('interactionTitle').innerHTML = '';
    document.getElementById('interactionMessage').innerHTML = '';
    document.getElementById('interactionButtons').innerHTML = '';
    document.getElementById('interactionButtons').children = [];
    roomCode = null; rejoinOfferShown = false;
    for (const k of Object.keys(store)) delete store[k];
    __setRoom({});
  }

  // R1 — no session at all → no offer, breadcrumb says so
  resetEnv();
  await offerRejoinIfAny();
  ok('R1 no session → no offer shown', !modalTitle() && !store[SKEY]);
  ok('R1b breadcrumb "no session stored"', /no session stored/.test((dbg().why || '')));

  // R2 — session + room alive + seat kept → offer shown, session preserved
  resetEnv(); putSession('WXYZ', Date.now()); __setRoom(mkRoom('lobby', true));
  await offerRejoinIfAny();
  ok('R2 seat kept → offer shown', /You left a game!/.test(modalTitle()));
  ok('R2b message mentions the still-open room', /Your room is still open:.*WXYZ/.test(modalMsg()));
  ok('R2c session kept after offer', !!store[SKEY]);
  ok('R2d two buttons (Rejoin + Dismiss)', modalButtons().length === 2);

  // R3 — dedup: a second offer call must NOT rebuild the modal
  resetEnv(); putSession('WXYZ', Date.now()); __setRoom(mkRoom('lobby', true));
  await offerRejoinIfAny(); const firstBtns = modalButtons()[0];
  await offerRejoinIfAny();
  ok('R3 duplicate call keeps the same modal', modalButtons()[0] === firstBtns);

  // R4 — REGRESSION: purged by the 45s grace → offer must STILL appear
  resetEnv(); putSession('WXYZ', Date.now()); __setRoom(mkRoom('lobby', false)); // no seat, no queue entry
  await offerRejoinIfAny();
  ok('R4 purged seat → offer STILL shown', /You left a game!/.test(modalTitle()));
  ok('R4b "away too long" message variant', /away too long/.test(modalMsg()));
  ok('R4c session NOT silently cleared', !!store[SKEY]);

  // R5 — room gone → no offer + session cleared (real end of life).
  // The harness once() always returns the fixture object, so simulate a
  // missing Firebase node by overriding .ref for this one call.
  resetEnv(); putSession('GONE', Date.now());
  const realRef = database.ref;
  database.ref = function () { return { once: async () => ({ val: () => null, exists: () => false }) }; };
  await offerRejoinIfAny();
  database.ref = realRef;
  ok('R5 dead room → no offer, session cleared', !modalTitle() && !store[SKEY]);
  ok('R5b breadcrumb "no longer exists"', /no longer exists/.test((dbg().why || '')));

  // R6 — already inside a room → offer suppressed (shared-link join, etc.)
  resetEnv(); putSession('WXYZ', Date.now()); __setRoom(mkRoom('lobby', true));
  roomCode = 'ABCD';
  await offerRejoinIfAny();
  ok('R6 already in a room → no offer', !modalTitle());
  roomCode = null;

  // R7 — Dismiss button kills the session
  resetEnv(); putSession('WXYZ', Date.now()); __setRoom(mkRoom('lobby', true));
  await offerRejoinIfAny();
  modalButtons()[1].onclick(); // index 1 = Dismiss
  ok('R7 Dismiss clears the session', !store[SKEY]);

  // R8 — game in progress + seat kept → "still running" variant
  resetEnv(); putSession('WXYZ', Date.now()); __setRoom(mkRoom('playing', true));
  await offerRejoinIfAny();
  ok('R8 live game → "still running" message', /still running in room/.test(modalMsg()));

  // R9 — Rejoin button re-enters through joinRoomByCode with the saved code
  resetEnv(); putSession('WXYZ', Date.now()); __setRoom(mkRoom('lobby', true));
  const realJoin = joinRoomByCode; let joinedCode = null;
  joinRoomByCode = async (c) => { joinedCode = c; };
  await offerRejoinIfAny();
  modalButtons()[0].onclick(); // index 0 = Rejoin (btn wrapper fires win removal + callback)
  await new Promise(r => setTimeout(r, 10));
  joinRoomByCode = realJoin;
  ok('R9 Rejoin button joins the saved room code', joinedCode === 'WXYZ');

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
