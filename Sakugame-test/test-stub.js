/* ============================================================
   🧪 SAKUGAME TEST BUILD — fake backend (stub.js)
   ------------------------------------------------------------
   Replaces the three gstatic Firebase scripts in the TEST copy only.
   Nothing here ever touches the real database: the whole tree lives
   in localStorage and is served synchronously, so the site behaves
   exactly like it does online (listeners, transactions, pushes…)
   while every write stays inside this browser.

   It also fakes the two things that genuinely cannot work from a
   local file / preview:
     • the Discord OAuth redirect (Discord refuses file:// redirect
       URIs) → we fake the /users/@me answer instead, so the REAL
       return path in app.js runs untouched;
     • cdn.discordapp.com avatars → rewritten to the local files in
       test-avatars/ so profile pictures are visible.
   ============================================================ */
(function () {
  'use strict';

  var LS_KEY = 'sakuTestDB';
  var T = typeof window !== 'undefined' ? window : globalThis;

  /* ---------------- the tree ---------------- */
  var tree = {};
  try { tree = JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {}; } catch (e) { tree = {}; }
  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(tree)); } catch (e) {} }
  function parts(path) { return path ? String(path).split('/') : []; }
  function get(path) {
    var p = parts(path), n = tree;
    for (var i = 0; i < p.length; i++) {
      if (n == null || typeof n !== 'object') return undefined;
      n = n[p[i]];
    }
    return n;
  }
  function set(path, value) {
    var p = parts(path);
    if (!p.length) { tree = (value && typeof value === 'object') ? value : {}; return; }
    var n = tree;
    for (var i = 0; i < p.length - 1; i++) {
      var k = p[i];
      if (n[k] == null || typeof n[k] !== 'object') n[k] = {};
      n = n[k];
    }
    var last = p[p.length - 1];
    if (value === null || value === undefined) delete n[last]; else n[last] = value;
  }
  function clone(v) { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); }
  function resolveServerValues(v) {
    if (Array.isArray(v)) return v.map(resolveServerValues);
    if (v && typeof v === 'object') {
      if (v['.sv'] === 'timestamp') return Date.now();
      var o = {}; for (var k in v) o[k] = resolveServerValues(v[k]);
      return o;
    }
    return v;
  }

  /* ---------------- snapshots ---------------- */
  function queryValue(v, q) {
    if (!q || !v || typeof v !== 'object' || Array.isArray(v)) return v;
    var keys = Object.keys(v);
    if (q.order === 'child') {
      keys.sort(function (a, b) {
        var x = v[a] ? v[a][q.key] : null, y = v[b] ? v[b][q.key] : null;
        if (x == null && y == null) return a < b ? -1 : 1;
        if (x == null) return -1;
        if (y == null) return 1;
        return x < y ? -1 : (x > y ? 1 : 0);
      });
    } else if (q.order === 'value') {
      keys.sort(function (a, b) { var x = v[a], y = v[b]; return x < y ? -1 : (x > y ? 1 : 0); });
    }
    if (q.eq !== undefined) {
      keys = keys.filter(function (k) {
        var x = q.order === 'child' ? (v[k] ? v[k][q.key] : null) : (q.order === 'value' ? v[k] : k);
        return String(x) === String(q.eq);
      });
    }
    if (q.limitLast != null) keys = keys.slice(-q.limitLast);
    if (q.limitFirst != null) keys = keys.slice(0, q.limitFirst);
    var out = {};
    keys.forEach(function (k) { out[k] = v[k]; });
    return out;
  }

  function snap(path, q) {
    var v = queryValue(get(path), q);
    return {
      key: path ? parts(path).pop() : null,
      exists: function () { return v !== undefined && v !== null; },
      val: function () { return clone(v) === undefined ? null : clone(v); },
      forEach: function (cb) {
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          for (var k in v) { if (cb(snap(path ? path + '/' + k : k)) === true) return; }
        }
      },
      child: function (p) { return snap(path ? path + '/' + p : String(p)); }
    };
  }

  /* ---------------- listeners ---------------- */
  var listeners = [];
  var flushing = false, again = false;
  function flush() {
    if (flushing) { again = true; return; }
    flushing = true;
    do {
      again = false;
      var list = listeners.slice();
      for (var i = 0; i < list.length; i++) {
        var e = list[i];
        if (listeners.indexOf(e) < 0) continue;      // removed meanwhile
        try { e.cb(snap(e.path, e.q)); } catch (err) { console.error('[test-stub] listener error', err); }
      }
    } while (again);
    flushing = false;
  }
  function schedule() { save(); flush(); }

  /* ---------------- refs ---------------- */
  function Ref(path, q) { this._path = path || ''; this._q = q || null; }
  Ref.prototype.toString = function () { return 'Ref(' + (this._path || '/') + ')'; };
  Ref.prototype._derive = function (q) {
    var merged = Object.assign({}, this._q || {}, q || {});
    return new Ref(this._path, merged);
  };
  Ref.prototype.child = function (p) { return new Ref(this._path ? this._path + '/' + p : String(p)); };
  // Query modifiers — enough fidelity for the public-room browser.
  Ref.prototype.orderByChild = function (k) { return this._derive({ order: 'child', key: k }); };
  Ref.prototype.orderByKey = function () { return this._derive({ order: 'key' }); };
  Ref.prototype.orderByValue = function () { return this._derive({ order: 'value' }); };
  Ref.prototype.limitToLast = function (n) { return this._derive({ limitLast: n }); };
  Ref.prototype.limitToFirst = function (n) { return this._derive({ limitFirst: n }); };
  Ref.prototype.equalTo = function (v) { return this._derive({ eq: v }); };
  Ref.prototype.off = function (evt, cb) {
    var self = this;
    listeners = listeners.filter(function (e) {
      if (e.path !== self._path) return true;          // another node
      if (evt && evt !== 'value') return true;         // another event type
      if (cb && e.cb !== cb) return true;              // another callback
      return false;
    });
  };
  Ref.prototype.on = function (evt, cb) {
    if (evt !== 'value') return function () {};
    var e = { path: this._path, cb: cb, q: this._q };
    listeners.push(e);
    try { cb(snap(this._path, this._q)); } catch (err) { console.error('[test-stub] listener error', err); }
    return function () { var i = listeners.indexOf(e); if (i >= 0) listeners.splice(i, 1); };
  };
  Ref.prototype.once = function () { return Promise.resolve(snap(this._path, this._q)); };
  Ref.prototype.set = function (v) { set(this._path, resolveServerValues(v)); schedule(); return Promise.resolve(); };
  Ref.prototype.remove = function () { set(this._path, null); schedule(); return Promise.resolve(); };
  Ref.prototype.update = function (obj) {
    var self = this;
    if (!obj || typeof obj !== 'object') return Promise.resolve();
    Object.keys(obj).forEach(function (k) {
      var path = k.indexOf('/') >= 0 ? (self._path ? self._path + '/' + k : k) : (self._path ? self._path + '/' + k : k);
      set(path, resolveServerValues(obj[k]));
    });
    schedule();
    return Promise.resolve();
  };
  Ref.prototype.transaction = function (fn) {
    var cur = get(this._path), out;
    try { out = fn(clone(cur)); } catch (e) { return Promise.resolve({ committed: false }); }
    if (out === undefined) return Promise.resolve({ committed: false, snapshot: snap(this._path) });
    set(this._path, resolveServerValues(out));
    schedule();
    return Promise.resolve({ committed: true, snapshot: snap(this._path) });
  };
  Ref.prototype.push = function (v) {
    var key = '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    var r = new Ref(this._path ? this._path + '/' + key : key);
    r.key = key;
    if (v !== undefined) r.set(v);
    // ThenableReference: `await ref.push(x)` AND `ref.push().key` both work.
    r.then = function (onF, onR) {
      return Promise.resolve().then(function () {
        var plain = Object.create(Ref.prototype);
        plain._path = r._path; plain.key = key;
        return plain;
      }).then(onF, onR);
    };
    return r;
  };
  Ref.prototype.onDisconnect = function () {
    return { set: function () {}, remove: function () {}, cancel: function () {} };
  };

  /* ---------------- firebase object ---------------- */
  var db = {
    ref: function (p) { return new Ref(p); },
    ServerValue: { TIMESTAMP: { '.sv': 'timestamp' } },
    goOffline: function () {}, goOnline: function () {}
  };
  T.firebase = {
    initializeApp: function () { return {}; },
    app: function () { return {}; },
    database: function () { return db; },
    auth: function () {
      return {
        onAuthStateChanged: function (cb) { try { cb(null); } catch (e) {} return function () {}; },
        signOut: function () { return Promise.resolve(); },
        currentUser: null
      };
    }
  };

  /* ---------------- fake Discord ---------------- */
  var FAKE_USERS = {
    'TEST-NINJA': { id: '900000000000000001', username: 'testninja', global_name: 'Ninja Tester', avatar: 'a1b2c3d4e5f60718' },
    'TEST-SAKURA': { id: '900000000000000002', username: 'sakura.dev', global_name: 'Sakura', avatar: 'b2c3d4e5f6071829' },
    'TEST-GHOST': { id: '900000000000000003', username: 'ghostplayer', global_name: '', avatar: '' }
  };
  var AVATAR_MAP = {
    '900000000000000001': 'test-avatars/u1.jpg',
    '900000000000000002': 'test-avatars/u2.jpg',
    '900000000000000003': 'test-avatars/u3.jpg'
  };
  T.__TEST_USERS = FAKE_USERS;
  T.__TEST_AVATARS = AVATAR_MAP;

  var realFetch = T.fetch ? T.fetch.bind(T) : null;
  T.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.indexOf('discord.com/api/users/@me') >= 0) {
      var h = (init && init.headers) || {};
      var auth = h.Authorization || h.authorization || '';
      var token = String(auth).replace(/^Bearer\s+/i, '').trim();
      var u = FAKE_USERS[token];
      var body = u ? JSON.stringify(u) : JSON.stringify({ message: '401: Unauthorized' });
      return Promise.resolve({ ok: !!u, status: u ? 200 : 401, json: function () { return Promise.resolve(JSON.parse(body)); } });
    }
    return realFetch ? realFetch.apply(null, arguments) : Promise.reject(new Error('no fetch'));
  };

  /* ---------------- local Discord avatars ---------------- */
  function rewrite(img) {
    if (!img || !img.getAttribute) return;
    var src = img.getAttribute('src') || '';
    var m = src.match(/cdn\.discordapp\.com\/avatars\/(\d+)\//);
    if (!m) return;
    var want = AVATAR_MAP[m[1]];
    if (!want) return;
    if (img.getAttribute('src') !== want) { img.setAttribute('src', want); try { img.src = want; } catch (e) {} }
  }
  function scan(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.tagName === 'IMG') rewrite(node);
    if (node.querySelectorAll) {
      var l = node.querySelectorAll('img');
      for (var i = 0; i < l.length; i++) rewrite(l[i]);
    }
  }
  if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined' && document.documentElement) {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'attributes') { rewrite(m.target); continue; }
        var added = m.addedNodes || [];
        for (var j = 0; j < added.length; j++) scan(added[j]);
      }
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  }

  /* ---------------- helpers used by the test panel ---------------- */
  T.__TEST_DB = {
    raw: function () { return clone(tree) || {}; },
    set: function (path, v) { set(path, resolveServerValues(v)); schedule(); },
    get: function (path) { var v = get(path); return clone(v) === undefined ? null : clone(v); },
    reset: function () { tree = {}; save(); flush(); },
    listenerCount: function () { return listeners.length; }
  };
  console.log('%c🧪 TEST BUILD — fake backend active (no real database, no real Discord)',
    'background:#5865F2;color:#fff;padding:2px 6px;border-radius:4px;font-weight:bold');
})();
