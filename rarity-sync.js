/* Raretés publiées : les choix locaux du joueur restent prioritaires
   pour chaque personnage modifié dans ce navigateur. */
(function () {
  'use strict';
  var KEY = 'saku-published-rarities-v1', URL = './sakugame-rarities.json', TTL = 5 * 60 * 1000;
  var allowed = {common:1, uncommon:1, rare:1, epic:1, legendary:1, mythic:1};
  var inflight = null;
  function loadLocal() {
    var local = {}, drafts = {};
    try { local = JSON.parse(localStorage.getItem('saku-enc-rar-by-id') || '{}') || {}; } catch(e) {}
    try { drafts = JSON.parse(localStorage.getItem('saku-remote-rarity-drafts') || '{}') || {}; } catch(e) {}
    if (!local || typeof local !== 'object' || Array.isArray(local)) local = {};
    if (!drafts || typeof drafts !== 'object' || Array.isArray(drafts)) drafts = {};
    var keys = Object.keys(drafts);
    keys.forEach(function(id) { if (Object.prototype.hasOwnProperty.call(allowed, drafts[id])) local[id] = drafts[id]; });
    // Preserve earlier unpublished choices as active local edits; only remove
    // the old draft store if the merged copy was successfully persisted.
    if (keys.length) { try { localStorage.setItem('saku-enc-rar-by-id', JSON.stringify(local)); localStorage.removeItem('saku-remote-rarity-drafts'); } catch(e) {} }
    window.SAKU_LOCAL_RARITIES = local;
    return local;
  }
  window.sakuRarityLoadLocal = loadLocal;
  loadLocal();
  function parse(data) {
    if (!data || data.kind !== 'sakugame-encyclopedia-rarities' || data.version !== 2 ||
        !data.edits || typeof data.edits !== 'object' || Array.isArray(data.edits)) throw new Error('Format de raretés invalide');
    var keys = Object.keys(data.edits), out = Object.create(null);
    if (keys.length > 15000) throw new Error('Trop de raretés');
    keys.forEach(function(id) {
      var value = data.edits[id];
      if (!/^[A-Za-z0-9_-]{1,120}$/.test(id) || typeof value !== 'string' || !Object.prototype.hasOwnProperty.call(allowed,value)) throw new Error('Rareté invalide');
      out[id] = value;
    });
    return out;
  }
  function apply(map) {
    window.SAKU_REMOTE_RARITIES = map;
    window.dispatchEvent(new CustomEvent('saku-rarity-change'));
    if (typeof cardPool !== 'undefined' && cardPool) {
      cardPool.forEach(function(card) { if ((card.edition!=='strongest' && card.edition!=='hoshi')) card.rarity = cardRarityFor(card, card.rank); });
      try { if (typeof cardState !== 'undefined' && cardState) { if (typeof cardsRenderStats === 'function') cardsRenderStats(); if (typeof cardsRenderAlbum === 'function') cardsRenderAlbum(); } } catch(e) { console.warn('rarity album refresh:', e); }
    }
    try {
      var selected = null, box = document.getElementById('encDetail');
      if (typeof encFind === 'function' && box && box.classList.contains('show')) {
        var btn = box.querySelector('[data-enc-num]');
        var current = btn && encFind(Number(btn.getAttribute('data-enc-num')));
        if (current) selected = current.card;
      }
      if (typeof sakuStrongestRefreshEnc === 'function') sakuStrongestRefreshEnc();
      if (selected && typeof encOpenCard === 'function') encOpenCard(selected.n);
    } catch(e) { console.warn('rarity encyclopedia refresh:', e); }
  }
  var cached;
  try { cached = JSON.parse(localStorage.getItem(KEY) || 'null'); if (cached) apply(parse(cached)); } catch(e) {}
  if (!window.SAKU_REMOTE_RARITIES) window.SAKU_REMOTE_RARITIES = Object.create(null);
  function refresh() {
    if (inflight) return inflight;
    if (typeof fetch !== 'function') return Promise.resolve(null);
    inflight = fetch(URL, {cache:'no-store'}).then(function(resp) {
      if (resp.status === 404 || resp.status === 410) {
        try { localStorage.removeItem(KEY); } catch(e) {}
        apply(Object.create(null)); return null;
      }
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return resp.json().then(function(data) {
        var map = parse(data);
        try { localStorage.setItem(KEY, JSON.stringify({kind:'sakugame-encyclopedia-rarities',version:2,edits:map})); } catch(e) {}
        apply(map); return map;
      });
    }).catch(function(err) { console.warn('Raretés publiées indisponibles : dernière version conservée.', err); return null; })
      .then(function(value) { inflight = null; return value; });
    return inflight;
  }
  window.sakuRarityRefresh = refresh;
  window.sakuRarityParse = parse;
  refresh();
  setInterval(refresh, TTL);
})();
