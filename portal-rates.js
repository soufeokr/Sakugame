/* Base odds per card, expressed in thousandths of one percent.
   Order: common, uncommon, rare, epic, legendary, mythic, special.
   Both distributions total 100000 = 100%. Guarantees are applied separately. */
(function(){'use strict';
 const ordinary=Object.freeze([37000,32000,21000,7075,2800,125,0]);
 const special=Object.freeze([37000,32000,21000,7000,2800,125,75]);
 window.sakuPortalRates=Object.freeze([ordinary,special,ordinary,special]);
})();
