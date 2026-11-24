/* Base odds per card, expressed in thousandths of one percent.
   Order: common, uncommon, rare, epic, legendary, mythic, special.
   Both distributions total 100000 = 100%. Guarantees are applied separately. */
(function(){'use strict';
 const ordinary=Object.freeze([44650,29800,18000,7000,500,50,0]);
 const special=Object.freeze([44640,29800,18000,7000,500,50,10]);
  // Grimoire spécial (gemme d'invocation) : épique 50 %, légendaire 30 %, mythique 15 %, spéciale 5 %.
 const gem=Object.freeze([0,0,0,50000,30000,15000,5000]);
 window.sakuPortalRates=Object.freeze([ordinary,special,ordinary,special,gem]);
})();
