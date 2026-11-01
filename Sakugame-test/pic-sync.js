/* Photos publiques : pics/<nom du personnage>.jpg, .jpeg, .png ou .webp.
   Correspondance exacte normalisée, sans attribution en cas de conflit. */
(function () {
  'use strict';
  var API = 'https://api.github.com/repos/soufeokr/Sakugame-pics/git/trees/main?recursive=1';
  var BASE = 'https://raw.githubusercontent.com/soufeokr/Sakugame-pics/main/';
  var KEY = 'saku-pics-by-name-v2', TTL = 5 * 60 * 1000;
  var cached = null;
  try { cached = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) {}
  function normalize(name) {
    return String(name || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
  }
  function parse(tree) {
    if (!tree || tree.truncated || !Array.isArray(tree.tree)) throw new Error('Liste GitHub incomplète');
    var index = {}, candidates = {}, duplicates = {};
    if (typeof ENCYCLOPEDIA !== 'undefined' && ENCYCLOPEDIA && ENCYCLOPEDIA.list) {
      ENCYCLOPEDIA.list.forEach(function (group) { if (group.edition === 'strongest') return; group.cards.forEach(function (c) {
        var names = [c.m].concat(Array.isArray(c.a) ? c.a : []);
        names.forEach(function (name) {
          var id = String(c.i);
          // Le nom complet suffit normalement. Le suffixe de franchise
          // désambiguïse deux personnages homonymes.
          [normalize(name), normalize(name + ' ' + group.label)].forEach(function (key) {
            if (!key) return;
            if (!index[key]) index[key] = {};
            index[key][id] = true;
          });
        });
      }); });
    }
    // Ces six fichiers ont été explicitement mis de côté par le joueur.
    var reserved = { 'arslan.jpg':1, 'narsus.jpg':1, 'daryun.jpg':1,
      'zeke yeager.jpg':1 };
    tree.tree.forEach(function (entry) {
      if (entry.type !== 'blob') return;
      var match = /^pics\/([^/]+)\.(jpg|jpeg|png|webp)$/i.exec(entry.path || '');
      if (!match || reserved[(match[1]+'.'+match[2]).toLowerCase()]) return;
      var key = normalize(match[1]), matches = index[key] ? Object.keys(index[key]) : [];
      if (matches.length !== 1) return;
      var id = matches[0];
      if (candidates[id]) { duplicates[id] = true; return; }
      var url = BASE + entry.path.split('/').map(encodeURIComponent).join('/');
      if (/^[0-9a-f]{40}$/.test(entry.sha || '')) url += '?v=' + entry.sha.slice(0, 12);
      candidates[id] = url;
    });
    Object.keys(duplicates).forEach(function (id) { delete candidates[id]; });
    return candidates;
  }
  function apply(map) {
    var changes = {}, byId = {};
    if (typeof ENCYCLOPEDIA !== 'undefined' && ENCYCLOPEDIA && ENCYCLOPEDIA.list) {
      ENCYCLOPEDIA.list.forEach(function (g) { if (g.edition === 'strongest') return; g.cards.forEach(function (c) {
        var u = map[String(c.i)];
        if (u) { if (c.u && c.u !== u) changes[c.u] = u; c.u = u; }
        if (c.u && c.u.indexOf(BASE) === 0) byId[String(c.i)] = c.u;
      }); });
    }
    if (typeof GENERIC_CHARACTERS !== 'undefined') GENERIC_CHARACTERS.forEach(function (c) {
      var u = byId[String(c.id)] || map[String(c.id)];
      if (u) { if (c.image && c.image !== u) changes[c.image] = u; c.image = u; }
    });
    if (typeof CARD_EXTRA_CHARACTERS !== 'undefined' && Array.isArray(CARD_EXTRA_CHARACTERS)) CARD_EXTRA_CHARACTERS.forEach(function (c) {
      var u = byId[String(c.id)] || map[String(c.id)];
      if (u) { if (c.image && c.image !== u) changes[c.image] = u; c.image = u; }
    });
    if (typeof cardPool !== 'undefined' && cardPool) cardPool.forEach(function (c) {
      var u = byId[String(c.id)] || map[String(c.id)];
      if (u) { if (c.image && c.image !== u) changes[c.image] = u; c.image = u; }
    });
    if (typeof document !== 'undefined' && document.querySelectorAll) {
      document.querySelectorAll('img').forEach(function (img) {
        var old = img.getAttribute('src'); if (old && changes[old]) img.setAttribute('src', changes[old]);
      });
    }
  }
  function refresh(force) {
    var now = Date.now();
    if (!force && cached && cached.map && now - cached.at < TTL) {
      apply(cached.map); return Promise.resolve(cached.map);
    }
    if (typeof fetch !== 'function') { if (cached && cached.map) apply(cached.map); return Promise.resolve(null); }
    return fetch(API, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('GitHub ' + r.status);
      return r.json();
    }).then(function (tree) {
      try { if (typeof window.sakuStrongestAccept === 'function') window.sakuStrongestAccept(tree); } catch (_) {}
      var map = parse(tree); cached = { at: Date.now(), map: map };
      try { localStorage.setItem(KEY, JSON.stringify(cached)); } catch (_) {}
      apply(map); return map;
    }).catch(function () {
      if (cached && cached.map) apply(cached.map);
      else apply({});
      return null;
    });
  }
  window.sakuPicsRefresh = function () { return refresh(true); };
  window.sakuPicsParse = parse;
  var ready = window.sakuDataReady || Promise.resolve();
  Promise.resolve(ready).then(function () { refresh(false); }).catch(function () {});
  setInterval(function () { refresh(false); }, TTL);
})();
