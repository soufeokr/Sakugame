/* Base odds per card, expressed in thousandths of one percent.
   Order: common, uncommon, rare, epic, legendary, mythic, special.
   Both distributions total 100000 = 100%. Guarantees are applied separately. */
(function(){'use strict';
 const ordinary=Object.freeze([44075,29000,18000,7000,1800,125,0]);
 const special=Object.freeze([44065,29000,18000,7000,1800,125,10]);
 window.sakuPortalRates=Object.freeze([ordinary,special,ordinary,special]);
})();
