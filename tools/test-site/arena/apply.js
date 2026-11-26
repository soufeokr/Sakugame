/* Arena — application d'une action structurée (utilisée par l'interface et les tests). */
(function (global) {
  'use strict';
  var A = global.Arena;

  function apply(st, action) {
    if (!action) return { ok: false, error: 'Action vide.' };
    if (action.type === 'setup') return A.actions.setupReveal(st, action.player, action.uids);
    if (st.phase === 'setup') return { ok: false, error: 'Choisissez d’abord les cartes à retourner.' };
    if (action.type === 'refill') return A.actions.refill(st, action.slot, action.from, action.handIndex);
    if (st.refill) return { ok: false, error: 'Remplissez d’abord vos cases vides (main ou pioche).' };
    switch (action.type) {
      case 'replace': return A.actions.replaceFromHand(st, action.handIndex, action.slot);
      case 'attack': return A.actions.attack(st, action.attacker, action.target);
      case 'reveal': return A.actions.reveal(st, action.uid);
      case 'place': return A.actions.placeFromHand(st, action.handIndex, action.slot);
      case 'moveSwap': return A.actions.moveSwap(st, action.a, action.b);
      case 'moveSingle': return A.actions.moveSingle(st, action.uid, action.slot);
      case 'draw': return A.actions.drawAction(st);
      case 'ability': return A.actions.useAbility(st, action.uid, action.key, action.target, action.cell, action.target2);
      case 'endTurn': return A.actions.endTurn(st);
      default: return { ok: false, error: 'Action inconnue : ' + action.type };
    }
  }

  global.ArenaApply = { apply: apply };
  if (typeof module !== 'undefined' && module.exports) module.exports = global.ArenaApply;
})(typeof globalThis !== 'undefined' ? globalThis : this);
