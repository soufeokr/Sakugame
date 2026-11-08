/* Sakugame — profil local au navigateur (V1).
   Remplace les anciennes lectures/écritures Firebase du compte (`accounts/{id}`) :
   pseudo, avatar choisi, lien AniList et statuts suivis restent dans CE navigateur,
   sous la clé `saku-local-account:<id du compte>`. Rien n'est envoyé à un serveur.
   Cette API imite le sous-ensemble de Firebase utilisé par app.js
   (child / once / set / update / remove / transaction / on / off). */
(function () {
  'use strict';
  var PREFIX = 'saku-local-account:';

  function load(id) {
    try {
      var v = JSON.parse(localStorage.getItem(PREFIX + id) || 'null');
      return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
    } catch (e) { return {}; }
  }
  function save(id, v) { try { localStorage.setItem(PREFIX + id, JSON.stringify(v)); } catch (e) {} }
  function clone(v) { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); }
  function snap(v) {
    var c = clone(v);
    // Comme Firebase : un nœud vide n'existe pas (val() === null).
    if (c && typeof c === 'object' && !Array.isArray(c) && !Object.keys(c).length) c = undefined;
    return {
      val: function () { return c === undefined ? null : clone(c); },
      exists: function () { return c !== undefined && c !== null; }
    };
  }
  function getAt(root, path) {
    var n = root;
    for (var i = 0; i < path.length; i++) {
      if (n == null || typeof n !== 'object') return undefined;
      n = n[path[i]];
    }
    return n;
  }
  function badKey(k) { return k === '__proto__' || k === 'constructor' || k === 'prototype'; }
  function setAt(root, path, val) {
    if (!path.length) return (val && typeof val === 'object' && !Array.isArray(val)) ? val : {};
    var n = root, i;
    for (i = 0; i < path.length; i++) if (badKey(path[i])) return root;
    for (i = 0; i < path.length - 1; i++) {
      if (typeof n[path[i]] !== 'object' || n[path[i]] === null) n[path[i]] = {};
      n = n[path[i]];
    }
    var last = path[path.length - 1];
    if (val === undefined || val === null) delete n[last]; else n[last] = val;
    return root;
  }

  function ref(id, path) {
    return {
      child: function (k) { return ref(id, path.concat(String(k).split('/').filter(Boolean))); },
      once: function () { return Promise.resolve(snap(getAt(load(id), path))); },
      set: function (v) { save(id, setAt(load(id), path, clone(v))); return Promise.resolve(); },
      update: function (obj) {
        var r = load(id);
        Object.keys(obj || {}).forEach(function (k) {
          r = setAt(r, path.concat(k.split('/').filter(Boolean)), clone(obj[k]));
        });
        save(id, r);
        return Promise.resolve();
      },
      remove: function () {
        if (!path.length) { try { localStorage.removeItem(PREFIX + id); } catch (e) {} return Promise.resolve(); }
        save(id, setAt(load(id), path, null));
        return Promise.resolve();
      },
      transaction: function (fn) {
        var r = load(id), cur = getAt(r, path);
        var next = fn(cur === undefined ? null : clone(cur));
        if (next === undefined) return Promise.resolve({ committed: false, snapshot: snap(cur) });
        save(id, setAt(r, path, clone(next)));
        return Promise.resolve({ committed: true, snapshot: snap(next) });
      },
      on: function (evt, cb) {
        var self = this;
        Promise.resolve().then(function () { return self.once(); }).then(cb);
        return cb;
      },
      off: function () {}
    };
  }

  window.sakuLocalAccountRef = function (id) { return ref(String(id || 'anon'), []); };
  window.sakuLocalAccountClear = function (id) { try { localStorage.removeItem(PREFIX + id); } catch (e) {} };
})();
