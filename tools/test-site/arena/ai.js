/* Arena — IA de démonstration (heuristique simple, sans triche sur les cartes cachées).
   Expose ArenaAI.nextAction(state) -> {type, ...} | null */
(function (global) {
  'use strict';
  var A = global.Arena || (typeof require !== 'undefined' ? require('./engine.js') : null);

  function cardsOf(st, pi) { return st.players[pi].terrain.filter(Boolean); }

  function valueOf(st, uid) {
    var s = A.stats(st, st.cards[uid]);
    return s.pv + s.atk * 1.2;
  }

  function candidateAttacks(st) {
    var me = st.turnOwner, out = [];
    cardsOf(st, me).forEach(function (uid) {
      var c = st.cards[uid];
      if (!A.canAct(st, uid)) return;
      var atk = A.stats(st, c).atk;
      A.legalTargetsForAttack(st, uid).forEach(function (t) {
        var tc = st.cards[t];
        var ts = A.stats(st, tc);
        var score = Math.min(atk, ts.pv) * 1.0;
        if (atk >= ts.pv) score += 40 + (ts.atk * 0.6); // élimination
        score += ts.maxPv * 0.15;
        score -= 30 * A.dodgeOf(st, tc);
        out.push({ type: 'attack', attacker: uid, target: t, score: score });
      });
    });
    return out;
  }

  function candidateAbilities(st) {
    var me = st.turnOwner, out = [];
    cardsOf(st, me).forEach(function (uid) {
      var c = st.cards[uid];
      if (!c.faceUp) return;
      A.abilitiesOf(st, uid).forEach(function (ab) {
        var used = c.usedAbil[ab.key] || 0;
        if (used >= ab.uses) return;
        if (ab.fam) { familyCandidates(st, uid, ab).forEach(function (x) { out.push(x); }); return; }
        if (ab.key === 'janedoe' || ab.key === 'ssjblue' || ab.key === 'ultra') return;
        var needsTarget = ab.cible === 'ennemi' || ab.cible === 'allie' || ab.cible === 'case';
        if (ab.key === 'frappe') {
          A.legalTargetsForAttack(st, uid).forEach(function (t) {
            var dmg = Math.round(A.stats(st, c).atk * (ab.mult || 0.8));
            var score = Math.min(dmg, A.stats(st, st.cards[t]).pv) * 0.7;
            if (dmg >= A.stats(st, st.cards[t]).pv) score += 45;
            out.push({ type: 'ability', uid: uid, key: ab.key, target: t, score: score });
          });
        } else if (ab.key === 'soin') {
          var allies = cardsOf(st, me).filter(function (u) {
            var s2 = A.stats(st, st.cards[u]);
            return u !== uid && s2.pv < s2.maxPv - 10;
          });
          allies.forEach(function (t) { out.push({ type: 'ability', uid: uid, key: ab.key, target: t, score: 12 }); });
        } else if (ab.key === 'kamehameha') {
          A.legalTargetsForAttack(st, uid).forEach(function (t) {
            out.push({ type: 'ability', uid: uid, key: ab.key, target: t, score: 45 });
          });
        } else if (ab.key === 'amaterasu') {
          // vise la case ennemie occupée la plus gênante (PV les plus hauts)
          var bestCell = null;
          st.players[1 - me].terrain.forEach(function (u, s2) {
            if (!u) return;
            var s3 = A.stats(st, st.cards[u]);
            if (!bestCell || s3.pv > bestCell.pv) bestCell = { owner: 1 - me, slot: s2, pv: s3.pv };
          });
          if (bestCell) out.push({ type: 'ability', uid: uid, key: ab.key, cell: { owner: bestCell.owner, slot: bestCell.slot }, score: 34 });
        } else if (ab.key === 'clivage') {
          var adj = A.neighborsOf(st, c.owner, A.slotOf(st, uid)).filter(function (n) {
            return n.owner !== c.owner && st.cards[n.uid].faceUp;
          });
          if (adj.length) out.push({ type: 'ability', uid: uid, key: ab.key, score: 38 });
        } else if (ab.key === 'manipulation') {
          var foes = [];
          st.players[1 - me].terrain.forEach(function (u, s) { if (u && st.cards[u].faceUp) foes.push(s); });
          var pairFound = foes.some(function (s, i) { return i > 0 && Math.abs(s - foes[i - 1]) === 1; });
          if (pairFound) out.push({ type: 'ability', uid: uid, key: ab.key, score: 30 });
        } else if (ab.key === 'controle') {
          A.legalTargetsForAttack(st, uid).forEach(function (t) {
            out.push({ type: 'ability', uid: uid, key: ab.key, target: t, score: 20 });
          });
        } else if (ab.key === 'verrou') {
          A.legalTargetsForAttack(st, uid).forEach(function (t) {
            out.push({ type: 'ability', uid: uid, key: ab.key, target: t, score: 22 });
          });
        } else if (needsTarget) {
          return;
        } else if (ab.key === 'invocation' || ab.key === 'ssjblue' || ab.key === 'ailes' ||
          ab.key === 'ultra' || ab.key === 'garde' || ab.key === 'esquive' ||
          ab.key === 'adrenaline' || ab.key === 'analyse') {
          out.push({ type: 'ability', uid: uid, key: ab.key, score: ab.key === 'ssjblue' ? 40 : 14 });
        }
      });
    });
    return out;
  }

  /* ---------- capacités de famille : évaluées par simulation ---------- */
  var APPLY = function (st, a) { return global.ArenaApply.apply(st, a); };
  function cloneState(st) {
    var pool = st.pool, rng = st.rng, lg = st.log, f = st.fx;
    st.pool = null; st.rng = null; st.log = []; st.fx = [];
    var c = JSON.parse(JSON.stringify(st));
    st.pool = pool; st.rng = rng; st.log = lg; st.fx = f;
    c.pool = pool; c.rng = function () { return 0.5; };
    return c;
  }
  function evaluate(st, me) {
    var v = 0;
    [0, 1].forEach(function (pi) {
      var sign = pi === me ? 1 : -1, sub = 0;
      st.players[pi].terrain.forEach(function (u) {
        if (!u) return;
        var c = st.cards[u], s = A.stats(st, c);
        sub += Math.max(0, s.pv) + s.atk * 1.2;
        if (c.clone) sub += c.clone.pv + c.clone.atk;
        A.statusList(st, c).forEach(function (k) {
          sub -= ({ para: 14, burn: 10, freeze: 8, venom: 18, venom2: 34, prison: 12, prison2: 18, taunt: -10, seal: 10, mark: 12, counter: -14 })[k] || 0;
        });
      });
      sub -= 48 * st.players[pi].lost;
      sub += 6 * (st.players[pi].hand.length + st.players[pi].deck.length);
      (st.fires || []).forEach(function (f) { if (f.owner === pi && st.players[pi].terrain[f.slot]) sub -= f.dmg * Math.min(3, f.left) * 0.6; });
      v += sign * sub;
    });
    if (st.over) v += st.over.winner === me ? 5000 : (st.over.winner === -1 ? 0 : -5000);
    return v;
  }
  function familyCandidates(st, uid, ab) {
    var me = st.turnOwner, base = evaluate(st, me), out = [];
    var acts = [];
    var T = A.abilityTargets(st, uid, ab);
    if (T.kind === 'none') acts.push({ type: 'ability', uid: uid, key: ab.key });
    else if (T.kind === 'cell') T.cells.forEach(function (cell) {
      if (st.players[cell.owner].terrain[cell.slot]) acts.push({ type: 'ability', uid: uid, key: ab.key, cell: cell });
    });
    else if (ab.cible === 'allie-puis-ennemi') T.uids.forEach(function (al) {
      A.abilityTargets(st, uid, ab, al).uids.forEach(function (t2) { acts.push({ type: 'ability', uid: uid, key: ab.key, target: al, target2: t2 }); });
    });
    else T.uids.forEach(function (t) { acts.push({ type: 'ability', uid: uid, key: ab.key, target: t }); });
    acts.slice(0, 14).forEach(function (a) {
      var sim = cloneState(st);
      var r = APPLY(sim, a);
      if (!r || !r.ok) return;
      var gain = evaluate(sim, me) - base;
      /* Une capacité « de préparation » vaut un peu plus que son effet immédiat. */
      if (ab.key === 'durcuire' || ab.key === 'clonage') gain += 18;
      if (ab.key === 'garde' || ab.key === 'bouclier' || ab.key === 'esquive') gain += 12;
      if (ab.key === 'tempo') gain += st.actionsLeft >= 1 ? 26 : 0;
      if (ab.key === 'analyse') gain += 10;
      if (ab.key === 'sceau') gain += 10;
      if (ab.key === 'contre') gain += 14;
      if (ab.key === 'marque') gain += 8;
      if (ab.key === 'soigneurregen' || ab.key === 'soinzone') gain *= 0.8;
      a.score = gain * 0.9 - 4;
      out.push(a);
    });
    return out;
  }

  function candidateMoves(st) {
    var me = st.turnOwner, p = st.players[me], out = [];
    var vis = [];
    p.terrain.forEach(function (u, s) { if (u && st.cards[u].faceUp && A.canMove(st, u)) vis.push({ u: u, s: s }); });
    if (!vis.length) return out;
    var enemyCols = [];
    st.players[1 - me].terrain.forEach(function (u, s) { if (u && st.cards[u].faceUp) enemyCols.push(s); });
    if (!enemyCols.length) return out;
    vis.forEach(function (x) {
      if (A.legalTargetsForAttack(st, x.u).length) return;
      for (var s = 0; s < A.COLS; s++) {
        if (p.terrain[s]) continue;
        if (enemyCols.some(function (ec) { return Math.abs(ec - s) <= 1; })) {
          out.push({ type: 'moveSingle', uid: x.u, slot: s, score: 16 });
          break;
        }
      }
      vis.forEach(function (y) {
        if (y.u === x.u) return;
        if (enemyCols.some(function (ec) { return Math.abs(ec - y.s) <= 1; })) {
          out.push({ type: 'moveSwap', a: x.u, b: y.u, score: 13 });
        }
      });
    });
    return out;
  }

  /* Mise en place : l'IA retourne ses 2 cartes les plus solides. */
  function chooseSetup(st, pi) {
    var row = st.players[pi].terrain.filter(Boolean);
    var score = function (u) { var c = st.cards[u], d = A.def(st, c); return d.pv + d.atk * 1.3 + (A.familyOfDef(d) ? 30 : 0) + Math.random() * 12; };
    return row.slice().sort(function (a, b) { return score(b) - score(a); }).slice(0, 2);
  }

  /* Remplacement : une carte visible faible ou abîmée cède sa place à une carte plus forte de la main. */
  function candidateReplaces(st) {
    var me = st.turnOwner, p = st.players[me], out = [];
    if (!p.hand.length) return out;
    var base = evaluate(st, me);
    var vis = [];
    p.terrain.forEach(function (u, s) {
      if (!u) return; var c = st.cards[u]; if (!c.faceUp) return;
      var sc = A.stats(st, c); vis.push({ s: s, w: c.pv / Math.max(1, sc.maxPv) + (sc.atk + sc.maxPv) / 600 });
    });
    vis.sort(function (a, b) { return a.w - b.w; });
    vis.slice(0, 2).forEach(function (v) {
      for (var h = 0; h < Math.min(3, p.hand.length); h++) {
        var a = { type: 'replace', handIndex: h, slot: v.s };
        var sim = cloneState(st), r = APPLY(sim, a);
        if (!r || !r.ok) continue;
        a.score = (evaluate(sim, me) - base) * 0.8 - 8;
        out.push(a);
      }
    });
    return out;
  }

  /* Remplissage : l'IA garde sa main (cartes à poser face visible plus tard) et prend la pioche ;
     pioche vide -> sa carte de main la plus faible. */
  function chooseRefill(st) {
    var R = st.refill, p = st.players[R.owner], slot = R.slots[0];
    if (p.deck.length && (p.hand.length <= 3 || Math.random() < 0.7)) return { type: 'refill', slot: slot, from: 'deck' };
    var best = 0, bestV = Infinity;
    p.hand.forEach(function (u, k) { var d = A.def(st, st.cards[u]); var v = d.pv + d.atk * 1.3; if (v < bestV) { bestV = v; best = k; } });
    return { type: 'refill', slot: slot, from: 'hand', handIndex: best };
  }

  function nextAction(st) {
    if (!st || st.over || st.phase === 'setup') return null;
    if (st.refill) return chooseRefill(st);
    if (st.actionsLeft <= 0) return null;
    var me = st.turnOwner;
    var cands = [];

    cands = cands.concat(candidateAttacks(st));
    cands = cands.concat(candidateAbilities(st));
    cands = cands.concat(candidateMoves(st));
    cands = cands.concat(candidateReplaces(st));

    var hidden = cardsOf(st, me).filter(function (u) { return !st.cards[u].faceUp && A.canReveal(st, u); });
    if (hidden.length) cands.push({ type: 'reveal', uid: hidden[0], score: 18 + hidden.length * 2 });

    var p = st.players[me];
    if (p.hand.length > 0) {
      for (var s = 0; s < A.COLS; s++) {
        if (!p.terrain[s]) { cands.push({ type: 'place', handIndex: 0, slot: s, score: 10 }); break; }
      }
    }
    if (p.hand.length < 3 && p.deck.length) cands.push({ type: 'draw', score: 6 });

    if (!cands.length) return null;
    cands.sort(function (a, b) { return b.score - a.score; });
    var best = cands[0];
    /* Niveau Facile : choix parfois approximatif, et fin de tour anticipée de temps en temps. */
    var level = (global.ArenaAI && global.ArenaAI.level) || 'normal';
    if (level === 'easy') {
      if (st.actionsLeft === 1 && Math.random() < 0.25) return null;
      if (cands.length > 1 && Math.random() < 0.45) best = cands[Math.floor(Math.random() * Math.min(cands.length, 4))];
    }
    if (best.score < 1 && st.actionsLeft <= 0) return null;
    return best;
  }

  global.ArenaAI = { nextAction: nextAction, chooseSetup: chooseSetup, level: 'normal' };
  if (typeof module !== 'undefined' && module.exports) module.exports = global.ArenaAI;
})(typeof globalThis !== 'undefined' ? globalThis : this);
