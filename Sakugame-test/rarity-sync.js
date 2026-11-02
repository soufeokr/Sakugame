/* Raretés officielles : fichier exporté à côté de index.html sur le site.
   Le fichier publié prime sur les éditions locales des IDs qu'il contient. */
(function () {
  'use strict';
  var KEY = 'saku-published-rarities-v1', URL = './sakugame-rarities.json', TTL = 5 * 60 * 1000;
  var allowed = {common:1, uncommon:1, rare:1, epic:1, legendary:1, mythic:1};
  var inflight = null;
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
    if (typeof encPruneRemoteDrafts === 'function') encPruneRemoteDrafts();
    if (typeof cardPool !== 'undefined' && cardPool) {
      cardPool.forEach(function(card) { if (!card.collectibleOnly && card.edition !== 'strongest') card.rarity = cardRarityFor(card, card.rank); });
      try { if (typeof cardState !== 'undefined' && cardState && typeof cardsRenderAlbum === 'function') cardsRenderAlbum(); } catch(e) { console.warn('rarity album refresh:', e); }
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
