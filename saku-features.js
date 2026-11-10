/* Sakugame V2 — interrupteurs de fonctionnalités.
   Mets false pour masquer une fonctionnalité dans le site (à faire en plus de couper
   côté serveur si besoin : voir PUBLICATION-V2.md). Aucune donnée n'est supprimée. */
window.SAKU_FEATURES = { auctions: true, friends: true, showcase: true, quests: true };
(function () {
  'use strict';
  var f = window.SAKU_FEATURES, c = document.documentElement.classList;
  Object.keys(f).forEach(function (k) { if (f[k] === false) c.add('no-' + k); });
  document.addEventListener('DOMContentLoaded', function () {
    if (f.auctions === false) {
      var o = document.querySelector('#marketSaleType option[value="auction"]');
      if (o && o.parentNode) o.parentNode.removeChild(o);
    }
  });
})();
