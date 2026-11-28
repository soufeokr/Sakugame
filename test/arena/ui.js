/* Sakugame Arena (version test) — interface : menu, decks, Duel contre l'IA, Amical en ligne,
   règles, historique, paramètres. Intégrée au site dans une iframe (pont : window.parent.sakuArenaBridge). */
(function () {
  'use strict';
  var A = window.Arena, AI = window.ArenaAI, APPLY = window.ArenaApply.apply;
  var RARITY_FR = A.RARITY_FR;
  var FAM = A.FAMILIES;

  /* Couleurs des familles (badges, boutons, effets). */
  var FAMC = {
    tireur: '#d9a441', electricite: '#e3b81a', feu: '#ff6a2b', glace: '#38b6f0', lame: '#8b9bc4', rempart: '#c2873a',
    vitesse: '#22c7b4', soigneur: '#3fc77f', stratege: '#8e7cf0', poison: '#6fbf2c', invocateur: '#b07cf5',
    regeneration: '#e0507f', assassin: '#c8364f', psychique: '#c060ff', explosifs: '#ff8a1f', copie: '#ee6fc6', vol: '#5f9dff',
    vampire: '#c0284f', force: '#e2574c', eveil: '#ffb020', zone: '#ff7ab6', protection: '#7fd3ff', pression: '#b5651d',
    temps: '#2ec4d6', sceau: '#9aa3b8', malediction: '#b388ff', seisme: '#b08a5a'
  };
  var ST_ICON = { para: 'ϟ', burn: '♨', freeze: '❄', venom: '☣', venom2: '☣²', prison: '◆', prison2: '◆', taunt: '⛨', seal: '⊘', mark: '◎', counter: '⚔' };
  var ST_TXT = {
    para: 'Paralysie : ne peut pas attaquer à son prochain tour.',
    burn: 'Brûlure : perd des PV à la fin de chacun de ses tours ; ni déplacement ni remplacement.',
    freeze: 'Gel : ATK réduite jusqu’à la fin de son prochain tour.',
    venom: 'Venin : perd un % de ses PV max à chaque tour (doublé ou triplé) ; soins bloqués.',
    venom2: 'Venin ×2 : deux poisons cumulés ; soins bloqués.',
    prison: 'Entrave : ne peut pas attaquer (cachée : ne peut pas être retournée).',
    prison2: 'Entrave : ni attaque, ni capacité, ni déplacement.',
    taunt: 'Dur à cuire : subira la prochaine attaque adverse, dégâts réduits.',
    mark: 'Point faible : subit plus de dégâts de toutes les sources.',
    counter: 'Contre-attaque : dégâts réduits et riposte à chaque coup direct reçu.',
    seal: 'Annulation : pas de capacité active et passive suspendue.'
  };

  /* Pool : tableaux compacts -> objets. */
  function thumbUrl(u) { u = String(u || ''); return u.indexOf('/character/large/') >= 0 ? u.replace('/character/large/', '/character/medium/') : u; }
  var POOL = (window.ARENA_CARDS || []).map(function (a) {
    return { name: a[0], series: a[1], rarity: a[2], profil: a[3], pv: a[4], atk: a[5], characterRank: a[6], image: a[7], thumb: thumbUrl(a[7]) };
  });
  POOL.forEach(function (d, i) { Object.defineProperty(d, '__i', { value: i, enumerable: false }); });
  window.__FUSION_IMG__ = 'fusion.webp';
  /* Siège du joueur local : 0 (hôte / Duel) ou 1 (invité en Amical). */
  var ME = 0, OP = 1;
  function setSeat(s) { ME = s; OP = 1 - s; }

  var UI = {
    screen: 'menu', st: null, setupSel: [], setupSent: false, match: null, net: null, decks: null, editing: 0, who: undefined, colMode: null, joinCode: '', sel: null, mode: 'idle', pending: null,
    busy: false, anim: false, endShown: false, search: '', rarity: 'all', series: 'all', famf: 'all',
    limit: 60, inspect: null, fxOn: true
  };

  var RARITY_ORDER = ['special', 'mythic', 'legendary', 'epic', 'rare', 'uncommon'];
  var SERIES = Array.from(new Set(POOL.map(function (d) { return d.series; }))).sort(function (a, b) { return a.localeCompare(b, 'fr'); });
  var FAM_KEYS = Object.keys(FAM);

  /* ---------- utilitaires ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function toast(msg, isErr) {
    var old = document.querySelector('.toast'); if (old) old.remove();
    var t = document.createElement('div'); t.className = 'toast' + (isErr ? ' err' : ''); t.textContent = msg;
    document.body.appendChild(t); clearTimeout(toast._t); toast._t = setTimeout(function () { t.remove(); }, 2600);
  }
  function normName(n) { return String(n || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
  function famStyle(f) { return f ? ' style="--famc:' + FAMC[f] + '"' : ''; }

  /* ---------- carte ---------- */
  /* ---------- carte Arena ----------
     Inspirée du cadre Sakugame (coins coupés, liseré de rareté, plaque de nom), mais pensée pour le combat :
     jauge de PV sous l'image, étiquettes PV / ATK intégrées au cadre, repère de capacité, statuts lisibles. */
  var RGEM = { uncommon: 'U', rare: 'R', epic: 'É', legendary: 'L', mythic: 'M', special: 'S' };
  var ICO_PV = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.2 2.6 9.1A3.4 3.4 0 0 1 8 4.6a3.4 3.4 0 0 1 5.4 4.5z" fill="currentColor"/></svg>';
  var ICO_ATK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.6 1.6 7.4 7.8l-1.2-.4-.9.9 1.1 1.1-3.1 3.1.8.8 3.1-3.1 1.1 1.1.9-.9-.4-1.2 6.2-6.2V1.6z" fill="currentColor"/></svg>';
  function abilityMark(def) {
    var a = A.abilitiesFor(def).length, p = A.passivesFor(def).length;
    if (!a && !p) return '';
    var t = a && p ? 'Capacité active et passive' : a ? 'Capacité active' : 'Capacité passive';
    return '<span class="amark' + (a ? ' actv' : '') + '" title="' + t + '">' + (a && p ? '✦✦' : a ? '✦' : '◆') + '</span>';
  }
  function cardFace(def, opts) {
    opts = opts || {};
    var cls = ['card', 'acard', 'r-' + def.rarity];
    ['selected', 'targetable', 'selectable', 'dim', 'locked', 'attacked', 'peek', 'big'].forEach(function (k) { if (opts[k]) cls.push(k); });
    if (opts.ally) cls.push('ally');
    if (opts.cls) Array.prototype.push.apply(cls, opts.cls);
    var pv = opts.pv != null ? opts.pv : def.pv, atk = opts.atk != null ? opts.atk : def.atk;
    var maxPv = Math.max(1, opts.maxPv || Math.max(def.pv, pv));
    var pct = Math.max(0, Math.min(100, Math.round(pv / maxPv * 100)));
    var src = opts.thumb || def.thumb;
    var art = src ? '<img src="' + esc(src) + '" alt="" loading="lazy" draggable="false" referrerpolicy="no-referrer" onerror="this.style.visibility=\'hidden\'">' : '';
    var status = (opts.status || []).length ? '<div class="status">' + opts.status.map(function (k) {
      return '<span class="st-' + k + '" title="' + esc(ST_TXT[k] || k) + '">' + ST_ICON[k] + '</span>';
    }).join('') + '</div>' : '';
    var atkCls = atk > def.atk ? ' up' : (opts.atkDown ? ' down' : '');
    var techs = A.passivesFor(def).concat(A.abilitiesFor(def)).map(function (x) { return x.nom; }).join(' · ');
    return '<div class="' + cls.join(' ') + '" ' + (opts.attrs || '') + ' title="' + esc((opts.nom || def.name) + ' — ' + def.series + (techs ? ' — ' + techs : '')) + '">' +
      '<div class="afr"><div class="ain">' +
        '<div class="aart"><span class="ainit">' + esc((def.name || '?').charAt(0)) + '</span>' + art + '</div>' +
        '<div class="ahp' + (pct <= 30 ? ' low' : pct <= 60 ? ' mid' : '') + '"><i style="width:' + pct + '%"></i></div>' +
        '<div class="aname"><b>' + esc(opts.nom || def.name) + '</b><small>' + esc(def.series) + '</small></div>' +
        '<div class="astats"><span class="spv' + (pv > def.pv ? ' up' : '') + '">' + ICO_PV + '<b>' + pv + '</b></span>' +
          '<span class="satk' + atkCls + '">' + ICO_ATK + '<b>' + atk + '</b></span></div>' +
      '</div></div>' +
      '<span class="agem">' + (RGEM[def.rarity] || '') + '</span>' + abilityMark(def) + status + '</div>';
  }
  var BACK_ART = '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="abk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#5a8fd6"/></linearGradient></defs>' +
    '<path d="M50 8 84 22v26c0 21-14 35-34 44C30 83 16 69 16 48V22z" fill="none" stroke="url(#abk)" stroke-width="2.6"/>' +
    '<path d="M50 17 76 28v20c0 16-10 27-26 34-16-7-26-18-26-34V28z" fill="#0c2240" stroke="#9fd8ff55" stroke-width="1"/>' +
    '<g fill="url(#abk)">' + [0, 72, 144, 216, 288].map(function (r) { return '<ellipse cx="50" cy="38" rx="6" ry="10" transform="rotate(' + r + ' 50 49)"/>'; }).join('') + '</g>' +
    '<circle cx="50" cy="49" r="4.2" fill="#0c2240" stroke="#bfe6ff" stroke-width="1.6"/></svg>';
  function cardBack(attrs, label, extra) {
    return '<div class="card acard aback selectable' + (extra || '') + '" ' + (attrs || '') + '>' +
      '<div class="afr"><div class="ain"><div class="abk">' + BACK_ART + '<span class="abkt">ARENA</span></div></div></div>' +
      '<div class="back-label">' + (label || 'Arena') + '</div></div>';
  }

  /* ---------- ciblage ---------- */
  function selAbility() {
    if (!UI.pending || !UI.sel || !UI.sel.uid) return null;
    var ab = null;
    A.abilitiesOf(UI.st, UI.sel.uid).forEach(function (a) { if (a.key === UI.pending.key) ab = a; });
    return ab;
  }
  function currentTargets() {
    var st = UI.st, out = { uids: new Set(), cells: new Set(), kind: null };
    if (!UI.sel || !UI.sel.uid || !st.cards[UI.sel.uid]) return out;
    if (UI.mode === 'attack') { A.legalTargetsForAttack(st, UI.sel.uid).forEach(function (u) { out.uids.add(u); }); out.kind = 'enemy'; return out; }
    if (UI.mode !== 'ability' || !UI.pending) return out;
    var ab = selAbility(); if (!ab) return out;
    var T;
    if (ab.fam) T = A.abilityTargets(st, UI.sel.uid, ab, UI.pending.stage1 || null);
    else if (ab.cible === 'case') T = A.abilityTargets(st, UI.sel.uid, ab);
    else if (ab.cible === 'allie') { T = { kind: 'ally', uids: st.players[ME].terrain.filter(Boolean), cells: [] }; }
    else { T = { kind: 'enemy', uids: st.players[OP].terrain.filter(function (u) { return u && st.cards[u].faceUp; }), cells: [] }; }
    out.kind = T.kind;
    T.uids.forEach(function (u) { out.uids.add(u); });
    T.cells.forEach(function (c) { out.cells.add(c.owner + ':' + c.slot); });
    return out;
  }

  /* ---------- plateau ---------- */
  function zone(pi, isOpp, T) {
    var st = UI.st, p = st.players[pi];
    var see = A.insight(st, ME);
    var visible = p.terrain.filter(function (u) { return u && st.cards[u].faceUp; }).length;
    var fires = A.fires(st), cells = '';
    for (var s = 0; s < A.COLS; s++) {
      var uid = p.terrain[s], pos = pi + ':' + s;
      var flamed = (st.flames || []).some(function (f) { return f.owner === pi && f.slot === s; });
      var fire = fires.filter(function (f) { return f.owner === pi && f.slot === s; });
      var deco = (flamed ? '<div class="flame" title="Amaterasu : 25 dégâts à la fin de chaque tour">🔥</div>' : '') +
        (fire.length ? '<div class="fire" title="Mur de flammes"><b>' + fire.reduce(function (a, f) { return a + f.dmg; }, 0) + ' × ' + Math.max.apply(null, fire.map(function (f) { return f.left; })) + '</b></div>' : '');
      var cellT = T.cells.has(pos);
      if (!uid) {
        var refillHere = !isOpp && st.refill && st.refill.owner === ME && st.turnOwner === ME && st.refill.slots[0] === s;
        if (refillHere) { cells += '<div class="slot refill-target" data-pos="' + pos + '"></div>'; continue; }
        var canPlace = !isOpp && st.turnOwner === ME && !st.refill && (UI.mode === 'place' || UI.mode === 'move') && st.actionsLeft > 0;
        var clickable = canPlace || cellT;
        cells += '<div class="slot' + (clickable ? (canPlace ? ' empty-targetable' : ' case-targetable') : '') + '" data-pos="' + pos + '"' +
          (clickable ? ' data-act="cell" data-owner="' + pi + '" data-slot="' + s + '"' : '') + '>' + deco + '</div>';
        continue;
      }
      var c = st.cards[uid], d = A.def(st, c), stt = A.stats(st, c);
      var attrs = 'data-act="card" data-uid="' + uid + '" data-owner="' + pi + '" data-slot="' + s + '"';
      var tg = T.uids.has(uid);
      var slotCls = 'slot filled' + (cellT ? ' case-targetable' : '');
      var cellAttrs = cellT ? ' data-act="cell" data-owner="' + pi + '" data-slot="' + s + '"' : '';
      var setupPick = st.phase === 'setup' && !isOpp;
      if (!c.faceUp && !(isOpp && see.hidden) && !setupPick) {
        cells += '<div class="' + slotCls + '" data-pos="' + pos + '"' + cellAttrs + '>' +
          cardBack(attrs + ' data-hidden="1"', isOpp ? 'adversaire' : (A.canReveal(st, uid) ? 'à révéler' : 'prise dans la glace'), tg ? ' targetable' : '') + deco + '</div>';
        continue;
      }
      var targetable = tg, selectable = false, dim = false, picked = false;
      if (setupPick) {
        picked = UI.setupSel.indexOf(uid) >= 0;
        if (setupDone()) dim = !(UI.setupSel.indexOf(uid) >= 0); else selectable = true;
      } else if (st.phase === 'setup') {
        selectable = false;
      } else if (!isOpp && st.turnOwner === ME && UI.mode === 'place') {
        targetable = c.faceUp; dim = !c.faceUp;
      } else if (!isOpp && st.turnOwner === ME) {
        if (UI.mode === 'attack') dim = true;
        else if (UI.mode === 'move') { if (UI.sel && UI.sel.uid === uid) dim = true; else targetable = c.faceUp; }
        else if (UI.mode === 'ability') dim = !tg;
        else selectable = true;
      }
      if (isOpp) {
        if (UI.mode === 'attack' || UI.mode === 'ability') dim = !tg && !cellT;
        else selectable = true;
      }
      var clone = c.clone ? '<div class="clonep" title="Clone : encaisse 50 % des coups, attaque avec sa carte">✦<span> clone</span> ' + Math.max(0, c.clone.pv) + '<span> PV · ' + c.clone.atk + ' ATK</span></div>' : '';
      cells += '<div class="' + slotCls + '" data-pos="' + pos + '"' + cellAttrs + '>' + cardFace(d, {
        pv: stt.pv, atk: stt.atk, maxPv: stt.maxPv, nom: A.displayName(st, c),
        thumb: c.fusion && window.__FUSION_IMG__ ? window.__FUSION_IMG__ : null,
        selected: picked || (UI.sel && UI.sel.uid === uid), targetable: targetable, ally: targetable && !isOpp,
        selectable: selectable, dim: dim, peek: !c.faceUp, cls: picked ? ['setup-picked'] : null,
        locked: c.lockedUntil >= st.turnNo || A.paralysed(st, c), attacked: c.attacked,
        status: c.faceUp ? A.statusList(st, c) : (A.imprisoned(st, c) ? ['prison'] : []),
        atkDown: (c.status && c.status.freeze && c.status.freeze.until >= st.turnNo) || (c.flatAtk < 0),
        attrs: attrs
      }) + clone + deco + '</div>';
    }
    var counters;
    if (isOpp) {
      counters = '<div class="counters"><span class="counter">terrain <b>' + p.terrain.filter(Boolean).length + '</b></span>' +
        '<span class="counter">cartes restantes <b>' + A.totalCards(st, pi) + '</b></span>' +
        (see.oppNext && p.deck.length ? '<span class="counter spy" title="Stratège Légendaire">prochaine pioche <b>' + esc(A.def(st, st.cards[p.deck[p.deck.length - 1]]).name) + '</b></span>' : '') + '</div>';
    } else {
      counters = '<div class="counters"><span class="counter">pioche <b>' + p.deck.length + '</b></span>' +
        '<span class="counter">main <b>' + p.hand.length + '</b></span><span class="counter">visibles <b>' + visible + '</b></span>' +
        (see.myNext && p.deck.length ? '<span class="counter spy" title="Stratège">prochaine pioche <b>' + esc(A.def(st, st.cards[p.deck[p.deck.length - 1]]).name) + '</b></span>' : '') + '</div>';
    }
    var peekHand = isOpp && see.oppHand ? '<div class="peekhand">👁 main adverse : ' + (p.hand.length ? p.hand.map(function (u) { return '<span>' + esc(A.def(st, st.cards[u]).name) + '</span>'; }).join('') : '<span>vide</span>') + '</div>' : '';
    var cols = '<div class="cols">' + [1, 2, 3, 4, 5].map(function (n) { return '<span>' + n + '</span>'; }).join('') + '</div>';
    return '<section class="zone ' + (isOpp ? 'opp' : 'me') + '"><div class="zonehead"><div class="zname">' + (isOpp ? esc(p.nom === 'Adversaire' ? 'Adversaire' : p.nom) : 'Votre terrain') +
      '<span class="tag">' + (isOpp ? (see.hidden ? 'cartes cachées vues (Stratège)' : 'face cachée') : (st.phase === 'setup' ? 'mise en place' : st.turnOwner === ME ? 'à vous' : 'en attente')) + '</span></div>' + counters + '</div>' +
      peekHand + '<div class="board">' + cells + '</div>' + cols + '</section>';
  }

  function handStrip() {
    var st = UI.st, p = st.players[ME], html = '';
    p.hand.forEach(function (uid, i) {
      var c = st.cards[uid], d = A.def(st, c);
      var canPlace = st.phase !== 'setup' && st.turnOwner === ME && (st.refill ? true : st.actionsLeft > 0 && p.terrain.some(function (u) { return !u || st.cards[u].faceUp; }));
      html += cardFace(d, { selectable: canPlace, selected: UI.mode === 'place' && UI.sel && UI.sel.index === i, dim: !canPlace,
        nom: A.displayName(st, c), thumb: c.fusion && window.__FUSION_IMG__ ? window.__FUSION_IMG__ : null, attrs: 'data-act="hand" data-i="' + i + '"' });
    });
    for (var k = p.hand.length; k < 3; k++) html += '<div class="slot-empty">main</div>';
    return '<div class="handwrap"><div class="zonehead"><div class="zname">Votre main <span class="tag">poser ou remplacer = 1 coup</span></div></div><div class="hand">' + html + '</div></div>';
  }

  function actionBar() {
    var st = UI.st;
    if (st.over) return '<div class="actionbar"><span class="hint">Partie terminée.</span>' + (isOnline() ? '<button class="act" data-act="go" data-s="friendly">Salon</button>' : '<button class="act" data-act="again">Rejouer</button>') + '<button class="act" data-act="go" data-s="menu">Menu Arena</button></div>';
    if (st.phase === 'setup') {
      if (setupDone()) return '<div class="actionbar"><span class="hint">Cartes choisies. En attente de ' + esc(st.players[OP].nom) + '…</span></div>';
      var n = UI.setupSel.length;
      return '<div class="actionbar setupbar"><span class="hint"><b style="color:#fff">Mise en place</b> : touche 2 cartes de ton terrain à retourner (' + n + '/2)</span>' +
        '<button class="act go" data-act="setupok"' + (n === 2 ? '' : ' disabled') + '>Retourner ces cartes</button></div>';
    }
    var fiche = UI.inspect && st.cards[UI.inspect] ? '<button class="act" data-act="sheet" data-uid="' + UI.inspect + '">Fiche</button>' : '';
    if (st.turnOwner !== ME) return '<div class="actionbar"><span class="hint">' + esc(st.players[OP].nom) + (st.refill ? ' remplit ses cases vides…' : ' joue…') + '</span>' + fiche + '</div>';
    if (st.refill) {
      var R = st.refill, pp = st.players[ME];
      return '<div class="actionbar setupbar"><span class="hint"><b style="color:#fff">Case vide — colonne ' + (R.slots[0] + 1) + '</b>' + (R.slots.length > 1 ? ' (encore ' + (R.slots.length - 1) + ' après)' : '') +
        ' : touche une carte de ta main pour l’y poser face cachée, ou prends la carte du dessus de ta pioche. Gratuit.</span>' +
        '<button class="act go" data-act="refilldeck"' + (pp.deck.length ? '' : ' disabled') + '>Prendre dans la pioche (' + pp.deck.length + ')</button></div>';
    }
    var btn = [], sel = UI.sel && UI.sel.uid ? st.cards[UI.sel.uid] : null;
    if (UI.mode === 'attack') btn.push('<span class="hint">Choisissez une cible en surbrillance —</span><button class="act" data-act="cancel">annuler</button>');
    else if (UI.mode === 'move') btn.push('<span class="hint">Échangez avec une carte visible alliée, ou visez une case vide —</span><button class="act" data-act="cancel">annuler</button>');
    else if (UI.mode === 'place') btn.push('<span class="hint">Touchez une case vide pour la poser, ou une de vos cartes visibles pour la remplacer (elle part au fond de la pioche) —</span><button class="act" data-act="cancel">annuler</button>');
    else if (UI.mode === 'ability' && UI.pending) {
      var T = currentTargets();
      var quoi = T.kind === 'cell' ? 'une case adverse' : (T.kind === 'ally' ? (UI.pending.cible === 'allie-puis-ennemi' ? 'une alliée qui a déjà attaqué' : 'une alliée') : (UI.pending.stage1 ? 'la cible de son attaque' : 'une cible ennemie'));
      btn.push('<span class="hint"><b style="color:#fff">' + esc(UI.pending.nom) + '</b> : choisissez ' + quoi + (T.uids.size + T.cells.size ? '' : ' (aucune cible possible)') + ' —</span><button class="act" data-act="cancel">annuler</button>');
    } else if (sel && sel.owner === ME) {
      if (!sel.faceUp) {
        btn.push('<button class="act" data-act="reveal"' + (st.actionsLeft > 0 && A.canReveal(st, sel.uid) ? '' : ' disabled') + '>Révéler <b>1 coup</b></button>');
      } else {
        var canAct = A.canAct(st, sel.uid) && st.actionsLeft > 0, targets = A.legalTargetsForAttack(st, sel.uid);
        btn.push('<button class="act" data-act="toattack"' + (canAct && targets.length ? '' : ' disabled') + '>Attaquer' + (targets.length ? ' <b>' + targets.length + '</b>' : '') + '</button>');
        A.abilitiesOf(st, sel.uid).forEach(function (ab) {
          if (ab.key === 'janedoe') return;
          var used = sel.usedAbil[ab.key] || 0, dis = (used >= ab.uses) || st.actionsLeft <= 0 || (ab.key === 'clonage' && sel.clone) || (A.imprisoned(st, sel) && sel.prison.full) || A.sealed(st, sel) ||
            ((ab.key === 'combo' || ab.key === 'fureur') && !(canAct && targets.length));
          btn.push('<button class="act' + (ab.fam ? ' ab' : '') + '"' + famStyle(ab.fam) + ' data-act="ability" data-key="' + ab.key + '"' + (dis ? ' disabled' : '') + ' title="' + esc(ab.desc) + '">' +
            esc(ab.nom) + ' <b>' + (ab.uses - used) + '/' + ab.uses + '</b></button>');
        });
        btn.push('<button class="act" data-act="tomove"' + (st.actionsLeft > 0 && A.canMove(st, sel.uid) ? '' : ' disabled') + '>Déplacer</button>');
      }
      btn.push('<button class="act" data-act="deselect">Désélectionner</button>');
    } else {
      btn.push('<span class="hint">Sélectionnez une carte de votre terrain ou de votre main —</span>');
      btn.push('<button class="act" data-act="draw"' + (st.players[ME].deck.length && st.actionsLeft ? '' : ' disabled') + '>Piocher</button>');
    }
    if (fiche) btn.push(fiche);
    btn.push('<button class="act danger" data-act="end" style="margin-left:auto">Terminer le tour</button>');
    return '<div class="actionbar">' + btn.join(' ') + '</div>';
  }

  function inspector() {
    var st = UI.st;
    if (!UI.inspect || !st.cards[UI.inspect]) {
      return '<aside class="inspector"><h3>Détails</h3><p class="sub" style="margin-top:8px">Touchez une carte du plateau ou de la main pour voir ses stats, ses capacités et ses statuts. Appui long (ou clic droit) sur n’importe quelle carte : sa fiche complète.</p>' +
        '<p class="sub" style="margin-top:14px"><b style="color:#fff">Statuts</b><br>' + Object.keys(ST_TXT).filter(function (k) { return k !== 'venom2' && k !== 'prison2'; }).map(function (k) { return ST_ICON[k] + ' ' + esc(ST_TXT[k]); }).join('<br>') + '</p></aside>';
    }
    var c = st.cards[UI.inspect], d = A.def(st, c), s = A.stats(st, c);
    var see = A.insight(st, ME);
    if (!c.faceUp && c.owner !== ME && !see.hidden) {
      return '<aside class="inspector"><span class="tag" style="color:var(--muted)">Adversaire</span><h3 style="margin-top:10px">Carte face cachée</h3>' +
        '<p class="sub">Son identité, ses stats et ses capacités restent inconnues tant qu’elle n’a pas été révélée.</p></aside>';
    }
    var nom = A.displayName(st, c), thumb = c.fusion && window.__FUSION_IMG__ ? window.__FUSION_IMG__ : null;
    var pct = Math.max(0, Math.min(100, Math.round(s.pv / s.maxPv * 100)));
    var f = A.familyOfDef(d), abs = A.abilitiesFor(d), pass = A.passivesFor(d), blocks = '';
    if (pass.length) blocks += '<div class="psec">Passives</div>' + pass.map(function (p) {
      return '<div class="abil passive"><div class="t"><span>' + esc(p.nom) + '</span><em>' + (p.eff ? esc(p.eff) + ' · ' : '') + 'passif' + (A.sealed(st, c) && p.eff ? ' · suspendu' : '') + '</em></div><div class="d">' + esc(p.desc) + '</div></div>';
    }).join('');
    if (abs.length) blocks += '<div class="psec">Actives</div>' + abs.map(function (ab) {
      var used = c.usedAbil[ab.key] || 0;
      return '<div class="abil"><div class="t"><span>' + esc(ab.nom) + '</span><em>' + (ab.eff ? esc(ab.eff) + ' · ' : '') + (ab.uses - used) + '/' + ab.uses + ' restante(s)</em></div><div class="d">' + esc(ab.desc) + '</div></div>';
    }).join('');
    if (!abs.length && !pass.length) blocks = '<p class="sub">Aucune capacité (Rare et Uncommon).</p>';
    var sts = A.statusList(st, c);
    if (sts.length || c.clone) {
      blocks += '<div class="psec">En jeu</div>' + sts.map(function (k) { return '<div class="abil statusx"><div class="t"><span>' + ST_ICON[k] + ' ' + esc(ST_TXT[k].split(' : ')[0]) + '</span></div><div class="d">' + esc(ST_TXT[k].split(' : ')[1] || '') + '</div></div>'; }).join('') +
        (c.clone ? '<div class="abil passive"><div class="t"><span>✦ Clone</span><em>' + Math.max(0, c.clone.pv) + '/' + c.clone.maxPv + ' PV · ' + c.clone.atk + ' ATK</em></div><div class="d">Encaisse 50 % des coups reçus et attaque avec sa carte.</div></div>' : '');
    }
    return '<aside class="inspector"><div class="preview">' + cardFace(d, { nom: nom, pv: s.pv, atk: s.atk, maxPv: s.maxPv, thumb: thumb, cls: ['static'], big: true, status: sts }) + '</div>' +
      '<span class="tag" style="color:var(--' + d.rarity + ')">' + RARITY_FR[d.rarity] + '</span>' +
      '<h3>' + esc(nom) + '</h3><div class="s">' + esc(d.series) + ' · profil ' + esc(profilFr(d.profil)) + (c.faceUp ? '' : ' · face cachée') + '</div>' +
      '<div class="statline"><div><span>PV</span><b>' + s.pv + ' / ' + s.maxPv + '</b></div><div><span>ATK</span><b>' + s.atk + '</b></div></div>' +
      '<div class="pvbar"><i style="width:' + pct + '%"></i></div>' +
      '<p class="sub" style="margin:10px 0 0">Base ' + d.pv + ' PV / ' + d.atk + ' ATK' + (c.bonus ? ' · <span style="color:var(--pv)">+' + c.bonus + ' bonus d’animé</span>' : '') +
      (c.atkBoost ? ' · <span style="color:var(--sky)">+' + Math.round(c.atkBoost * 100) + ' % ATK (Incisif)</span>' : '') +
      (c.awaken ? ' · <span style="color:#ffb020">+' + Math.round(c.awaken * 100) + ' % ATK et PV (Éveil)</span>' : '') + '</p>' + blocks +
      (c.attacked ? '<p class="sub" style="color:#ffc9a8;margin-top:10px">A déjà attaqué ce tour.</p>' : '') + '</aside>';
  }

  /* ---------- fiche d'une carte : lire ses stats et ses capacités ----------
     Bouton ⓘ (deck), bouton « Fiche » (partie), appui long ou clic droit sur n'importe quelle carte. */
  var PROFIL_FR = { equilibre: 'équilibré', resistant: 'résistant', regeneration: 'régénération' };
  function profilFr(p) { return PROFIL_FR[p] || p || '—'; }
  function sheetBlocks(d) {
    var pass = A.passivesFor(d), abs = A.abilitiesFor(d), out = '';
    if (pass.length) out += '<div class="psec">' + (pass.length > 1 ? 'Passives' : 'Passive') + '</div>' + pass.map(function (p) {
      return '<div class="abil passive"><div class="t"><span>' + esc(p.nom) + '</span><em>' + (p.eff ? esc(p.eff) + ' · ' : '') + 'passif</em></div><div class="d">' + esc(p.desc) + '</div></div>';
    }).join('');
    if (abs.length) out += '<div class="psec">' + (abs.length > 1 ? 'Actives' : 'Active') + '</div>' + abs.map(function (ab) {
      return '<div class="abil"><div class="t"><span>' + esc(ab.nom) + '</span><em>' + (ab.eff ? esc(ab.eff) + ' · ' : '') + ab.uses + ' utilisation' + (ab.uses > 1 ? 's' : '') + ' par partie</em></div><div class="d">' + esc(ab.desc) + '</div></div>';
    }).join('');
    return out || '<p class="sub">Aucune capacité : les cartes Rare et Uncommon n’en ont pas.</p>';
  }
  function sheetDef(d) {
    return '<aside class="inspector sheet"><div class="preview">' + cardFace(d, { cls: ['static'], big: true }) + '</div>' +
      '<span class="tag" style="color:var(--' + d.rarity + ')">' + RARITY_FR[d.rarity] + '</span>' +
      '<h3>' + esc(d.name) + '</h3><div class="s">' + esc(d.series) + ' · profil ' + esc(profilFr(d.profil)) + '</div>' +
      '<div class="statline"><div><span>PV</span><b>' + d.pv + '</b></div><div><span>ATK</span><b>' + d.atk + '</b></div></div>' +
      sheetBlocks(d) + '</aside>';
  }
  function openSheet(html) {
    removeModal('sheetmodal');
    var m = document.createElement('div'); m.className = 'modal'; m.id = 'sheetmodal';
    m.innerHTML = '<div class="box sheetbox" role="dialog" aria-label="Fiche de la carte">' + html +
      '<div class="sheetbtns"><button class="ghostbtn" data-act="closesheet">Fermer</button></div></div>';
    document.body.appendChild(m);
    var b = m.querySelector('[data-act="closesheet"]'); if (b) b.focus({ preventScroll: true });
  }
  function sheetForPool(i) { if (POOL[i]) openSheet(sheetDef(POOL[i])); }
  function sheetForUid(uid) {
    var st = UI.st; if (!st || !st.cards[uid]) return;
    var keep = UI.inspect; UI.inspect = uid;
    var h = inspector(); UI.inspect = keep;
    openSheet(h.replace('<aside class="inspector"', '<aside class="inspector sheet"'));
  }
  /* Carte visée par un appui long / clic droit : [data-act=card|hand|pick|deckinfo]. */
  function sheetFromEl(el) {
    var act = el.dataset.act;
    if (act === 'pick' || act === 'sheet' && el.dataset.i != null) { sheetForPool(parseInt(el.dataset.i, 10)); return true; }
    if (act === 'deckrow') { sheetForPool(parseInt(el.dataset.p, 10)); return true; }
    if (!UI.st) return false;
    if (act === 'card' && el.dataset.uid) { sheetForUid(parseInt(el.dataset.uid, 10)); return true; }
    if (act === 'hand') { var u = UI.st.players[ME] && UI.st.players[ME].hand[parseInt(el.dataset.i, 10)]; if (u) { sheetForUid(u); return true; } }
    return false;
  }
  var SHEET_SEL = '[data-act="card"][data-uid],[data-act="hand"],[data-act="pick"],[data-act="deckrow"]';
  var LP = { t: null, x: 0, y: 0, fired: false };
  document.addEventListener('pointerdown', function (e) {
    LP.fired = false; clearTimeout(LP.t);
    if (e.pointerType === 'mouse') return;   // à la souris : clic droit ou bouton ⓘ
    var el = e.target.closest && e.target.closest(SHEET_SEL);
    if (!el || e.target.closest('button')) return;
    LP.x = e.clientX; LP.y = e.clientY;
    LP.t = setTimeout(function () {
      if (sheetFromEl(el)) { LP.fired = true; try { if (navigator.vibrate) navigator.vibrate(12); } catch (err) {} }
    }, 450);
  });
  document.addEventListener('pointermove', function (e) { if (LP.t && Math.abs(e.clientX - LP.x) + Math.abs(e.clientY - LP.y) > 12) { clearTimeout(LP.t); LP.t = null; } });
  ['pointerup', 'pointercancel'].forEach(function (ev) { document.addEventListener(ev, function () { clearTimeout(LP.t); LP.t = null; }); });
  /* Après un appui long, le relâchement ne doit pas aussi choisir ou jouer la carte. */
  document.addEventListener('click', function (e) { if (LP.fired) { LP.fired = false; e.stopPropagation(); e.preventDefault(); } }, true);
  document.addEventListener('click', function (e) { if (e.target && e.target.id === 'sheetmodal') removeModal('sheetmodal'); });
  document.addEventListener('contextmenu', function (e) {
    var el = e.target.closest && e.target.closest(SHEET_SEL);
    if (!el) return;
    e.preventDefault();
    clearTimeout(LP.t); LP.t = null;
    var touch = e.pointerType === 'touch' || e.pointerType === 'pen';
    if (!document.getElementById('sheetmodal') && sheetFromEl(el) && touch) LP.fired = true;
  });

  function pipsHtml(n) {
    var out = '';
    for (var i = 0; i < Math.max(2, n); i++) out += '<span class="pip' + (n > i ? ' on' : '') + (i >= 2 ? ' extra' : '') + '"></span>';
    return out;
  }
  function logPanel() {
    var items = UI.st.log.slice(-50).map(function (l) { return '<div class="l-' + l.type + ' entry">' + esc(l.text) + '</div>'; }).join('');
    return '<aside class="logbox" id="log"><div class="lt">Journal</div>' + (items || '<div class="sub">Aucun événement.</div>') + '</aside>';
  }

  function renderGame() {
    var st = UI.st, T = currentTargets();
    var hud = '<div class="hud"><div class="turnline"><span class="turnbadge' + (st.turnOwner === ME ? '' : ' opp') + '"><i class="dot"></i>' + (st.turnOwner === ME ? 'À vous' : 'Adversaire') + '</span>' +
      '<span class="who">Tour <b>' + Math.ceil(st.turnNo / 2) + '</b></span></div>' +
      '<div class="who" style="display:flex;align-items:center;gap:9px">Coups<div class="pips">' + pipsHtml(st.actionsLeft) + '</div></div>' +
      '<div class="hudbtns">' + (isOnline() ? oppStatus() : '') + '<button class="ghostbtn" data-act="go" data-s="menu">Menu</button><button class="ghostbtn" data-act="rules">Règles</button>' +
      (st.over ? '' : '<button class="ghostbtn danger" data-act="forfeit">Abandonner</button>') + '</div></div>';
    return '<div class="game"><div class="arena" id="arena">' + hud + zone(OP, true, T) + zone(ME, false, T) + handStrip() + actionBar() + '</div>' +
      '<div class="side">' + inspector() + logPanel() + '</div></div>';
  }

  /* ================================================================== */
  /* Effets visuels                                                      */
  /* ================================================================== */
  var layer = null;
  function fxLayer() { if (!layer || !layer.isConnected) { layer = document.createElement('div'); layer.id = 'fx'; document.body.appendChild(layer); } return layer; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function slotEl(pos) { return pos ? document.querySelector('.slot[data-pos="' + pos.owner + ':' + pos.slot + '"]') : null; }
  function cardEl(pos) { var s = slotEl(pos); return s ? s.querySelector('.card') : null; }
  function box(pos) {
    var el = slotEl(pos); if (!el) return null;
    var r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  }
  function add(html, css) { var d = document.createElement('div'); d.innerHTML = html; var el = d.firstChild; if (css) Object.assign(el.style, css); fxLayer().appendChild(el); return el; }
  function kill(el, ms) { setTimeout(function () { if (el && el.parentNode) el.remove(); }, ms); }
  function num(pos, text, cls, dy) {
    var b = box(pos); if (!b) return;
    var el = add('<div class="fx-num ' + (cls || '') + '">' + esc(text) + '</div>', { left: b.cx + 'px', top: (b.y + b.h * 0.35 + (dy || 0)) + 'px' });
    kill(el, 1050);
  }
  function label(pos, text, color) {
    var b = box(pos); if (!b) return;
    var el = add('<div class="fx-label">' + esc(text) + '</div>', { left: b.cx + 'px', top: (b.y + 6) + 'px' });
    el.style.setProperty('--famc', color || '#2b7fd6'); kill(el, 1150);
  }
  function ring(pos, color, size, delay) {
    var b = box(pos); if (!b) return;
    setTimeout(function () {
      var el = add('<div class="fx-ring"></div>', { left: b.cx + 'px', top: b.cy + 'px' });
      el.style.setProperty('--c', color); el.style.setProperty('--s', (size || b.w * 1.6) + 'px'); kill(el, 760);
    }, delay || 0);
  }
  function glow(pos, color) {
    var b = box(pos); if (!b) return;
    var el = add('<div class="fx-glow"></div>', { left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', height: b.h + 'px' });
    el.style.setProperty('--c', color); kill(el, 740);
  }
  function flash(pos, color) {
    var b = box(pos); if (!b) return;
    var el = add('<div class="fx-flash"></div>', { left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', height: b.h + 'px' });
    el.style.setProperty('--c', color || '#fff'); kill(el, 380);
  }
  function burst(pos, color, n, spread, size) {
    var b = box(pos); if (!b) return;
    for (var i = 0; i < (n || 14); i++) {
      var el = add('<div class="fx-part"></div>', { left: b.cx + 'px', top: b.cy + 'px' });
      el.style.setProperty('--c', color); el.style.setProperty('--s', (size || 4 + Math.random() * 5) + 'px');
      var a = Math.random() * Math.PI * 2, r = (spread || b.w * 0.9) * (0.4 + Math.random() * 0.6);
      el.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + Math.cos(a) * r + 'px), calc(-50% + ' + Math.sin(a) * r + 'px)) scale(.2)', opacity: 0 }],
        { duration: 500 + Math.random() * 350, easing: 'cubic-bezier(.1,.7,.3,1)', fill: 'forwards' });
      kill(el, 900);
    }
  }
  function rise(pos, color, n, chars) {
    var b = box(pos); if (!b) return;
    for (var i = 0; i < (n || 8); i++) {
      var el = add('<div class="fx-num" style="font-size:' + (12 + Math.random() * 10) + 'px;text-shadow:0 0 10px ' + color + ';color:' + color + '">' + (chars ? chars[i % chars.length] : '•') + '</div>',
        { left: (b.x + b.w * (0.15 + Math.random() * 0.7)) + 'px', top: (b.y + b.h * (0.55 + Math.random() * 0.35)) + 'px', animationDuration: (700 + Math.random() * 500) + 'ms' });
      kill(el, 1300);
    }
  }
  function svgLayer() {
    var NS = 'http://www.w3.org/2000/svg', s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', 'fx-svg'); s.setAttribute('width', innerWidth); s.setAttribute('height', innerHeight);
    fxLayer().appendChild(s); return s;
  }
  function svgEl(svg, tag, attrs) { var e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (var k in attrs) e.setAttribute(k, attrs[k]); svg.appendChild(e); return e; }
  function line(a, b, color, width, dur, dash) {
    var A0 = box(a), B0 = box(b); if (!A0 || !B0) return;
    var s = svgLayer();
    var l = svgEl(s, 'line', { x1: A0.cx, y1: A0.cy, x2: B0.cx, y2: B0.cy, stroke: color, 'stroke-width': width || 3, 'stroke-linecap': 'round', filter: 'drop-shadow(0 0 6px ' + color + ')' });
    if (dash) l.setAttribute('stroke-dasharray', dash);
    var len = Math.hypot(B0.cx - A0.cx, B0.cy - A0.cy);
    if (!dash) { l.setAttribute('stroke-dasharray', len); l.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: (dur || 200) * 0.6, fill: 'forwards' }); }
    s.animate([{ opacity: 1 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }], { duration: dur || 320, fill: 'forwards' });
    kill(s, (dur || 320) + 30);
  }
  function bolt(points, color, dur) {
    var pts = points.map(box).filter(Boolean); if (pts.length < 2) return;
    var s = svgLayer();
    function jag() {
      var d = '';
      for (var i = 0; i < pts.length - 1; i++) {
        var p = pts[i], q = pts[i + 1], seg = 7;
        if (!i) d += 'M' + p.cx + ' ' + p.cy;
        for (var k = 1; k <= seg; k++) {
          var t = k / seg, x = p.cx + (q.cx - p.cx) * t, y = p.cy + (q.cy - p.cy) * t;
          if (k < seg) { x += (Math.random() - .5) * 26; y += (Math.random() - .5) * 26; }
          d += ' L' + x.toFixed(1) + ' ' + y.toFixed(1);
        }
      }
      return d;
    }
    var p1 = svgEl(s, 'path', { d: jag(), fill: 'none', stroke: color, 'stroke-width': 5, 'stroke-linejoin': 'round', opacity: .55, filter: 'drop-shadow(0 0 10px ' + color + ')' });
    var p2 = svgEl(s, 'path', { d: jag(), fill: 'none', stroke: '#fff', 'stroke-width': 2, 'stroke-linejoin': 'round' });
    var k = 0, iv = setInterval(function () { p1.setAttribute('d', jag()); p2.setAttribute('d', jag()); if (++k > 4) clearInterval(iv); }, 55);
    s.animate([{ opacity: 1 }, { opacity: 1, offset: .7 }, { opacity: 0 }], { duration: dur || 380, fill: 'forwards' });
    kill(s, (dur || 380) + 30);
  }
  function slashAt(pos, color, cross) {
    var b = box(pos); if (!b) return;
    var s = svgLayer();
    var arcs = cross ? [[-1, -1, 1, 1], [1, -1, -1, 1]] : [[-1, -0.7, 1, 0.8]];
    arcs.forEach(function (a, i) {
      var x1 = b.cx + a[0] * b.w * 0.55, y1 = b.cy + a[1] * b.h * 0.4, x2 = b.cx + a[2] * b.w * 0.55, y2 = b.cy + a[3] * b.h * 0.4;
      var mx = (x1 + x2) / 2 + (y2 - y1) * 0.18, my = (y1 + y2) / 2 - (x2 - x1) * 0.18;
      var p = svgEl(s, 'path', { d: 'M' + x1 + ' ' + y1 + ' Q' + mx + ' ' + my + ' ' + x2 + ' ' + y2, fill: 'none', stroke: color, 'stroke-width': 7, 'stroke-linecap': 'round', filter: 'drop-shadow(0 0 10px ' + color + ')' });
      var p2 = svgEl(s, 'path', { d: 'M' + x1 + ' ' + y1 + ' Q' + mx + ' ' + my + ' ' + x2 + ' ' + y2, fill: 'none', stroke: '#fff', 'stroke-width': 2.2, 'stroke-linecap': 'round' });
      [p, p2].forEach(function (e) { var L = 400; e.setAttribute('stroke-dasharray', L); e.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 160, delay: i * 90, fill: 'both', easing: 'ease-out' }); });
    });
    s.animate([{ opacity: 1 }, { opacity: 1, offset: .6 }, { opacity: 0 }], { duration: 480, fill: 'forwards' });
    kill(s, 520);
  }
  /* Projectile d'une case à l'autre ; arc > 0 pour une trajectoire en cloche. */
  function shoot(a, b, color, size, dur, arc, kind) {
    var A0 = box(a), B0 = box(b); if (!A0 || !B0) return Promise.resolve();
    var el;
    if (kind === 'shard') el = add('<div class="fx-part" style="border-radius:2px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)"></div>', { left: A0.cx + 'px', top: A0.cy + 'px' });
    else if (kind === 'bullet') el = add('<div class="fx-part" style="border-radius:99px"></div>', { left: A0.cx + 'px', top: A0.cy + 'px' });
    else el = add('<div class="fx-orb"></div>', { left: A0.cx + 'px', top: A0.cy + 'px' });
    el.style.setProperty('--c', color); el.style.setProperty('--s', (size || 18) + 'px');
    if (kind === 'bullet') { el.style.width = '22px'; el.style.height = '4px'; el.style.marginLeft = '-11px'; el.style.marginTop = '-2px'; }
    var dx = B0.cx - A0.cx, dy = B0.cy - A0.cy, ang = Math.atan2(dy, dx) * 180 / Math.PI;
    var frames = [];
    for (var i = 0; i <= 10; i++) {
      var t = i / 10, x = dx * t, y = dy * t - (arc || 0) * Math.sin(Math.PI * t);
      frames.push({ transform: 'translate(' + x + 'px,' + y + 'px) rotate(' + ang + 'deg)' + (kind === 'orb-grow' ? ' scale(' + (0.6 + t) + ')' : '') });
    }
    var an = el.animate(frames, { duration: dur || 260, easing: 'linear', fill: 'forwards' });
    /* traînée */
    var trail = setInterval(function () {
      var r = el.getBoundingClientRect();
      var tr = add('<div class="fx-part"></div>', { left: (r.left + r.width / 2) + 'px', top: (r.top + r.height / 2) + 'px' });
      tr.style.setProperty('--c', color); tr.style.setProperty('--s', Math.max(3, (size || 18) * 0.45) + 'px');
      tr.animate([{ opacity: .8, transform: 'translate(-50%,-50%) scale(1)' }, { opacity: 0, transform: 'translate(-50%,-50%) scale(.2)' }], { duration: 300, fill: 'forwards' });
      kill(tr, 320);
    }, 28);
    return new Promise(function (res) { an.onfinish = function () { clearInterval(trail); el.remove(); res(); }; });
  }
  function lunge(a, b, dist) {
    var el = cardEl(a), A0 = box(a), B0 = box(b); if (!el || !A0 || !B0) return;
    var dx = (B0.cx - A0.cx) * (dist || 0.22), dy = (B0.cy - A0.cy) * (dist || 0.22);
    el.animate([{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(1.06)', offset: 0.45 }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.3,.7,.4,1)' });
  }
  function shakeScreen(strong) {
    var el = document.getElementById('arena'); if (!el) return;
    el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
    if (strong) el.style.animationDuration = '.5s'; else el.style.animationDuration = '';
    setTimeout(function () { el.classList.remove('shake'); }, 520);
  }
  function cardAnim(pos, cls, ms) { var el = cardEl(pos); if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(function () { el.classList.remove(cls); }, ms || 600); }
  function setBadge(pos, delta) {
    var el = cardEl(pos); if (!el) return;
    var b = el.querySelector('.badge.pv'); if (!b) return;
    var v = parseInt(b.textContent, 10); if (!isNaN(v)) b.textContent = Math.max(0, v + delta);
  }
  function shatter(pos, ghostHtml) {
    var b = box(pos); if (!b || !ghostHtml) return;
    var orig = cardEl(pos); if (orig) orig.style.visibility = 'hidden';
    var n = 3, m = 4;
    for (var i = 0; i < n; i++) for (var j = 0; j < m; j++) {
      var w = b.w / n, h = b.h / m;
      var sh = add('<div class="fx-shard">' + ghostHtml + '</div>', { left: (b.x + i * w) + 'px', top: (b.y + j * h) + 'px', width: w + 'px', height: h + 'px' });
      var inner = sh.firstChild; if (inner) { inner.style.position = 'absolute'; inner.style.width = b.w + 'px'; inner.style.height = b.h + 'px'; inner.style.left = (-i * w) + 'px'; inner.style.top = (-j * h) + 'px'; }
      var ax = (i - 1) * (40 + Math.random() * 60), ay = (j - 1.5) * (30 + Math.random() * 40) + 60;
      sh.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(' + ax + 'px,' + ay + 'px) rotate(' + ((Math.random() - .5) * 120) + 'deg) scale(.6)', opacity: 0 }],
        { duration: 750 + Math.random() * 300, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'forwards' });
      kill(sh, 1100);
    }
    burst(pos, '#ff6f8f', 18, b.w * 1.1);
  }
  function ghostFly(pos, ghostHtml, color, toY) {
    var b = box(pos); if (!b || !ghostHtml) return;
    var orig = cardEl(pos); if (orig) orig.style.visibility = 'hidden';
    var g = add('<div class="fx-ghost">' + ghostHtml + '</div>', { left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', height: b.h + 'px' });
    g.animate([{ transform: 'none', opacity: 1, filter: 'none' }, { transform: 'translateY(' + (toY || -260) + 'px) rotate(-14deg) scale(.5)', opacity: 0, filter: 'drop-shadow(0 0 24px ' + color + ') brightness(1.6)' }],
      { duration: 800, easing: 'cubic-bezier(.5,0,.8,.6)', fill: 'forwards' });
    kill(g, 850);
  }
  function crosshair(pos) {
    var b = box(pos); if (!b) return;
    var s = svgLayer(), r = Math.min(b.w, b.h) * 0.32;
    var g = svgEl(s, 'g', { stroke: '#ffd47a', 'stroke-width': 2.5, fill: 'none', filter: 'drop-shadow(0 0 6px #ffd47a)' });
    svgEl(g, 'circle', { cx: b.cx, cy: b.cy, r: r });
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(function (d) { svgEl(g, 'line', { x1: b.cx + d[0] * r * 0.5, y1: b.cy + d[1] * r * 0.5, x2: b.cx + d[0] * r * 1.35, y2: b.cy + d[1] * r * 1.35 }); });
    g.animate([{ transform: 'scale(1.8)', transformOrigin: b.cx + 'px ' + b.cy + 'px', opacity: 0 }, { transform: 'scale(1)', transformOrigin: b.cx + 'px ' + b.cy + 'px', opacity: 1 }], { duration: 220, fill: 'forwards' });
    s.animate([{ opacity: 1 }, { opacity: 1, offset: .75 }, { opacity: 0 }], { duration: 520, fill: 'forwards' });
    kill(s, 560);
  }
  function banner(text, color) {
    if (!UI.fxOn) return;
    var d = document.createElement('div'); d.className = 'fx-banner'; d.innerHTML = '<span>' + esc(text) + '</span>';
    d.firstChild.style.setProperty('--c', color); document.body.appendChild(d); kill(d, 1300);
  }

  var STATUS_FX = { para: ['ϟ Paralysie', '#ffe14d'], burn: ['♨ Brûlure', '#ff8a3d'], freeze: ['❄ Gel', '#8fe3ff'], venom: ['☣ Venin', '#8dff6a'] };

  /* Effets joués sur le plateau AVANT le nouveau rendu (l'ancien état reste affiché). */
  function playOld(ev, ghosts) {
    var c = ev.fam ? FAMC[ev.fam] : null;
    switch (ev.t) {
      case 'cast': label(ev.at, ev.nom, c || '#2b7fd6'); glow(ev.at, c || '#9fd8ff'); return 260;
      case 'strike': {
        var f = ev.fam;
        if (ev.riposte) { lunge(ev.from, ev.to, 0.18); slashAt(ev.to, '#cfd8ff'); return 220; }
        lunge(ev.from, ev.to);
        if (f === 'tireur') { line(ev.from, ev.to, '#ffd47a', 3, 260); burst(ev.from, '#ffd47a', 6, 26, 4); return 200; }
        if (f === 'electricite') { bolt([ev.from, ev.to], '#ffe14d', 360); return 260; }
        if (f === 'feu') return shoot(ev.from, ev.to, '#ff6a2b', 26, 300, 26).then(function () { burst(ev.to, '#ff8a3d', 16); return 30; });
        if (f === 'glace') return shoot(ev.from, ev.to, '#8fe3ff', 16, 260, 0, 'shard').then(function () { burst(ev.to, '#bfefff', 12); return 30; });
        if (f === 'lame') { slashAt(ev.to, '#e6ecff'); return 240; }
        if (f === 'vitesse') { lunge(ev.from, ev.to, 0.42); slashAt(ev.to, '#7ff7e8', true); return 260; }
        if (f === 'poison') return shoot(ev.from, ev.to, '#8dff6a', 18, 320, 40).then(function () { rise(ev.to, '#8dff6a', 6, ['○', '◦']); return 20; });
        if (f === 'psychique') { ring(ev.to, '#c060ff', null); ring(ev.to, '#e5b8ff', null, 120); return 260; }
        if (f === 'explosifs') return shoot(ev.from, ev.to, '#ff8a1f', 20, 320, 46).then(function () { ring(ev.to, '#ff8a1f', null); burst(ev.to, '#ffd166', 14); return 20; });
        if (f === 'vol') return shoot(ev.from, ev.to, '#9cc4ff', 14, 260, 80).then(function () { slashAt(ev.to, '#9cc4ff'); return 40; });
        if (f === 'clone') return shoot(ev.from, ev.to, '#c9b6f2', 14, 240, 10).then(function () { return 20; });
        if (f === 'assassin') { slashAt(ev.to, '#ff4d6d', true); return 240; }
        return shoot(ev.from, ev.to, '#eaf4ff', 14, 230, 0).then(function () { flash(ev.to, '#fff'); return 20; });
      }
      case 'shot': crosshair(ev.to); return wait(260).then(function () { line(ev.from, ev.to, '#ffe9a6', 5, 300); burst(ev.to, '#ffd47a', 12); return 120; });
      case 'chain': bolt(ev.path, '#ffe14d', 460); ev.path.slice(1).forEach(function (p) { flash(p, '#fff6b0'); }); return 360;
      case 'venom': return shoot(ev.from, ev.to, '#8dff6a', 22, 360, 60).then(function () { rise(ev.to, '#8dff6a', 9, ['○', '◦', '•']); return 60; });
      case 'slash': slashAt(ev.to, ev.exec ? '#ff4d6d' : '#e6ecff', true); lunge(ev.from, ev.to, 0.32); return 300;
      case 'psy': ring(ev.from, '#c060ff', null); return wait(140).then(function () { ring(ev.to, '#c060ff', null); ring(ev.to, '#f0d6ff', null, 140); var el = cardEl(ev.to); if (el) el.animate([{ transform: 'none' }, { transform: 'translateY(-14px) rotate(-3deg)' }, { transform: 'none' }], { duration: 420 }); return 260; });
      case 'dive': { var el2 = cardEl(ev.from); if (el2) el2.animate([{ transform: 'none' }, { transform: 'translateY(-26px) scale(1.08)', offset: .4 }, { transform: 'none' }], { duration: 360 }); return shoot(ev.from, ev.to, '#9cc4ff', 20, 300, 120).then(function () { slashAt(ev.to, '#cfe0ff', true); ring(ev.to, '#9cc4ff', null); return 60; }); }
      case 'order': line(ev.from, ev.to, '#ffd47a', 2.5, 420, '6 6'); glow(ev.to, '#ffd47a'); label(ev.to, 'À l’attaque !', '#8e7cf0'); return 300;
      case 'firewall': return shoot(ev.from, ev.at, '#ff6a2b', 24, 340, 70).then(function () { burst(ev.at, '#ff8a3d', 22); ring(ev.at, '#ff6a2b', null); rise(ev.at, '#ffb36b', 10, ['♨', '•']); return 80; });
      case 'boom': return shoot(ev.from, ev.at, '#ff8a1f', 22, 340, 70).then(function () {
        var b0 = box(ev.at); flash(ev.at, '#fff2c0'); ring(ev.at, '#ffd166', b0 ? b0.w * 3 : 300); ring(ev.at, '#ff6a2b', b0 ? b0.w * 2.2 : 220, 80);
        burst(ev.at, '#ffb347', 30, b0 ? b0.w * 1.8 : 160, 7); shakeScreen(true); return 120; });
      case 'ice': return shoot(ev.from, ev.at, '#bfefff', 16, 260, 0, 'shard').then(function () { burst(ev.at, '#bfefff', 18); ring(ev.at, '#8fe3ff', null); glow(ev.at, '#8fe3ff'); return 60; });
      case 'shield': glow(ev.at, '#ffd47a'); ring(ev.at, '#ffd47a', null); label(ev.at, ev.nom || 'Dur à cuire', '#c2873a'); return 240;
      case 'barrier': glow(ev.at, '#bfefff'); ring(ev.at, '#7fd3ff', null); return 200;
      case 'powerup': glow(ev.at, '#ffd47a'); ring(ev.at, '#ffb020', null); rise(ev.at, '#ffd47a', 8, ['▲', '✦']); return 280;
      case 'wave': ring(ev.at, c || '#ff7ab6', null); burst(ev.at, c || '#ff7ab6', 12); return 90;
      case 'seal': ring(ev.at, '#9aa3b8', null); label(ev.at, '⊘ Annulé', '#9aa3b8'); return 180;
      case 'tempo': glow(ev.at, '#2ec4d6'); label(ev.at, '+1 coup', '#2ec4d6'); return 200;
      case 'taunt': line(ev.from, ev.at, '#ffd47a', 3, 300, '4 5'); label(ev.at, 'Interception !', '#c2873a'); return 220;
      case 'afterimage': { var el3 = cardEl(ev.at); if (el3) el3.animate([{ filter: 'none' }, { filter: 'blur(2px) drop-shadow(-18px 0 0 #22c7b488) drop-shadow(18px 0 0 #22c7b444)' }, { filter: 'none' }], { duration: 300 }); return 120; }
      case 'clone': ring(ev.at, '#c9b6f2', null); burst(ev.at, '#e8deff', 16); label(ev.at, 'Clone !', '#b07cf5'); return 220;
      case 'cleanse': ring(ev.at, '#ffffff', null); rise(ev.at, '#ffffff', 8, ['✧', '✦']); return 120;
      case 'hit':
        if (!ev.n) { num(ev.at, '0', 'zero'); return 80; }
        setBadge(ev.at, -ev.n); cardAnim(ev.at, 'fx-hit', 450); flash(ev.at, ev.kind === 'effect' ? '#ff9a5a' : '#ffffff');
        num(ev.at, '−' + ev.n, ev.n >= 45 ? 'big' : ''); if (ev.n >= 60) shakeScreen(); return ev.kind === 'effect' ? 120 : 160;
      case 'clonehit': num(ev.at, '✦ −' + ev.n, 'clone', -40); return 60;
      case 'heal': setBadge(ev.at, ev.n); num(ev.at, '+' + ev.n, 'heal', 12); cardAnim(ev.at, 'fx-heal', 620); rise(ev.at, '#5fe0b0', 6, ['+']); return 120;
      case 'status': { var sf = STATUS_FX[ev.s] || [ev.s, '#fff']; label(ev.at || null, sf[0], sf[1]); return 140; }
      case 'dodge': cardAnim(ev.at, 'fx-dodge', 520); num(ev.at, 'Esquive', 'word zero'); return 220;
      case 'guard': ring(ev.at, '#b07cf5', null); label(ev.at, ev.nom || 'Familier gardien', '#b07cf5'); return 160;
      case 'undying': glow(ev.at, '#ffd47a'); label(ev.at, ev.nom || 'Increvable', '#e0507f'); return 200;
      case 'ambush': label(ev.at, ev.nom || 'Embuscade', '#c8364f'); flash(ev.at, '#ff4d6d'); return 140;
      case 'drain': return shoot(ev.from, ev.to, '#c060ff', 12, 280, 30).then(function () { num(ev.to, '+' + ev.n + ' ATK', 'word clone'); return 40; });
      case 'splash': ring(ev.at, '#ff8a1f', null); burst(ev.at, '#ffd166', 8); return 60;
      case 'bullet': line(ev.from, ev.to, '#ffe9a6', 3, 160); burst(ev.to, '#ffd47a', 7); return 110;
      case 'mark': line(ev.from, ev.at, '#b388ff', 2, 220, '3 4'); ring(ev.at, '#b388ff', null); label(ev.at, '◎ Point faible', '#b388ff'); return 220;
      case 'burntick': rise(ev.at, '#ff8a3d', 7, ['♨', '•']); return 80;
      case 'venomtick': rise(ev.at, '#8dff6a', 7, ['○', '◦']); return 80;
      case 'cloneko': ring(ev.at, '#c9b6f2', null); burst(ev.at, '#c9b6f2', 14); num(ev.at, 'Clone détruit', 'word clone', -30); return 160;
      case 'ko': shatter(ev.at, ghosts[ev.uid]); return 320;
      case 'project': ghostFly(ev.at, ghosts[ev.uid], '#c060ff', ev.at && ev.at.owner === OP ? -300 : 300); return 300;
      case 'reveal': { var el4 = cardEl(ev.at); if (el4) el4.animate([{ transform: 'none' }, { transform: 'perspective(600px) rotateY(90deg)' }], { duration: 180, fill: 'forwards' }); return 160; }
      default: return 0;
    }
  }
  /* Effets joués APRÈS le nouveau rendu (cartes à leur nouvelle place). */
  function playNew(evs) {
    evs.forEach(function (ev) {
      if (ev.t === 'reveal') { cardAnim(ev.at, 'fx-flip', 520); flash(ev.at, '#bfe6ff'); }
      else if (ev.t === 'place') { cardAnim(ev.at, 'fx-drop', 480); ring(ev.at, '#9fd8ff', null, 120); }
      else if (ev.t === 'move' && ev.from) {
        var a = box(ev.from), b = box(ev.at), el = cardEl(ev.at);
        if (a && b && el) el.animate([{ transform: 'translate(' + (a.cx - b.cx) + 'px,' + (a.cy - b.cy) + 'px)' }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.3,.8,.3,1)' });
      }
      else if (ev.t === 'shield') cardAnim(ev.at, 'fx-shield', 700);
    });
  }

  function snapshotGhosts() {
    var g = {};
    document.querySelectorAll('.slot .card[data-uid]').forEach(function (el) { g[el.dataset.uid] = el.outerHTML; });
    return g;
  }

  /* Joue la liste d'événements produite par une action, puis rend le nouvel état. */
  function playEvents(evs, ghosts) {
    if (!UI.fxOn || !evs.length || UI.screen !== 'game') { render(); return Promise.resolve(); }
    UI.anim = true;
    var i = 0;
    function next() {
      if (i >= evs.length) return Promise.resolve();
      var ev = evs[i++], r;
      try { r = playOld(ev, ghosts); } catch (e) { r = 0; }
      return Promise.resolve(r).then(function (ms) { return wait(Math.min(400, ms || 0)); }).then(next);
    }
    return next().then(function () { render(); playNew(evs); return wait(80); }).then(function () { UI.anim = false; });
  }

  /* ---------- interactions ---------- */
  function resetSelection() { UI.sel = null; UI.mode = 'idle'; UI.pending = null; }
  function isDuel() { return !!(UI.match && UI.match.kind === 'duel'); }
  /* Mise en place : mes 2 cartes à retourner sont-elles déjà choisies ? */
  function setupDone() {
    var st = UI.st; if (!st || st.phase !== 'setup') return false;
    if (st.setup && st.setup[ME]) return true;
    if (isOnline()) { var m = UI.net && UI.net.room && UI.net.room.arena && UI.net.room.arena.match; return !!(UI.setupSent || (m && m.setup && m.setup[ME])); }
    return false;
  }
  function confirmSetup() {
    var uids = UI.setupSel.slice(0, 2);
    if (uids.length !== 2 || setupDone()) return;
    if (isOnline()) {
      var N = UI.net; if (!N) return;
      UI.setupSent = true; render();
      N.ref.child('arena/match/setup/' + ME).set(uids).catch(function () { UI.setupSent = false; render(); toast('Choix non envoyé : vérifie ta connexion.', true); });
      return;
    }
    doAction({ type: 'setup', player: ME, uids: uids });
  }
  function isOnline() { return !!(UI.match && UI.match.kind === 'online'); }

  function run(action) {
    var ghosts = snapshotGhosts();
    var turnBefore = UI.st.turnOwner;
    var res = APPLY(UI.st, action);
    var evs = UI.st.fx.splice(0);
    if (!res.ok) { toast(res.error, true); return Promise.resolve(res); }
    if (isOnline()) netPush(evs);
    return playEvents(evs, ghosts).then(function () {
      if (UI.st && UI.st.turnOwner !== turnBefore && !UI.st.over) turnBanner();
      return res;
    });
  }
  function turnBanner() { banner(UI.st.turnOwner === ME ? 'À vous de jouer' : 'Tour adverse', UI.st.turnOwner === ME ? '#2b7fd6' : '#b0306a'); }

  function doAction(action) {
    run(action).then(function (res) {
      if (!UI.st) return;
      if (res.ok) { UI.mode = 'idle'; UI.pending = null; }
      if (res.ok && action.type === 'setup' && UI.st.phase === 'play') turnBanner();
      if (UI.sel && UI.sel.uid && !UI.st.cards[UI.sel.uid]) resetSelection();
      render();
      if (UI.st.over) { setTimeout(showEnd, 420); return; }
      if (isDuel() && UI.st.turnOwner === OP) scheduleAI();
    });
  }

  function scheduleAI() {
    if (UI.busy) return;
    UI.busy = true;
    var fast = SET.speed === 'fast', game = UI.st;
    var finish = function () { UI.busy = false; render(); if (UI.st && UI.st.over) setTimeout(showEnd, 260); };
    var step = function () {
      if (!UI.st || UI.st !== game || !isDuel()) { UI.busy = false; return; }
      if (UI.st.over) { finish(); return; }
      if (UI.st.phase === 'setup' || UI.st.turnOwner !== OP) { UI.busy = false; render(); return; }
      var act = AI.nextAction(UI.st) || { type: 'endTurn' };
      run(act).then(function (res) {
        if (!res.ok && UI.st === game) return run({ type: 'endTurn' });
        return res;
      }).then(function () {
        if (UI.st !== game) { UI.busy = false; return; }
        if (UI.st.over) { finish(); return; }
        if (UI.st.turnOwner !== OP) { UI.busy = false; render(); return; }
        setTimeout(step, UI.fxOn ? (fast ? 200 : 380) : (fast ? 120 : 260));
      });
    };
    setTimeout(step, UI.fxOn ? (fast ? 350 : 650) : (fast ? 200 : 400));
  }

  function removeModal(id) { var m = document.getElementById(id); if (m) m.remove(); }

  function showEnd() {
    if (!UI.st || !UI.st.over || UI.endShown) return;
    UI.endShown = true;
    var w = UI.st.over.winner, res = w === -1 ? 'draw' : (w === ME ? 'win' : 'loss');
    var titre = res === 'draw' ? 'Match nul' : (res === 'win' ? 'Victoire' : 'Défaite');
    var rk = recordResult(res);
    var btns = isOnline()
      ? '<button class="primary" data-act="rematch">' + (UI.net && UI.net.wantRematch ? 'En attente de l’adversaire…' : 'Revanche') + '</button><button class="ghostbtn" data-act="netleave">Quitter le salon</button>'
      : '<button class="primary" data-act="again">Rejouer</button><button class="ghostbtn" data-act="go" data-s="deck">Changer de deck</button><button class="ghostbtn" data-act="go" data-s="menu">Menu Arena</button>';
    var box0 = document.createElement('div'); box0.className = 'modal'; box0.id = 'endmodal';
    box0.innerHTML = '<div class="box endbox' + (res === 'loss' ? ' lose' : '') + '"><span class="tag" style="color:var(--sky)">' + (isOnline() ? (rk ? 'Match classé' : 'Amical') : 'Duel') + ' terminé</span><div class="res">' + titre + '</div>' +
      '<p class="sub">' + esc(UI.st.over.reason) + '</p><div class="statline">' +
      '<div><span>Dégâts infligés</span><b>' + UI.st.stats.degats[OP] + '</b></div><div><span>Dégâts subis</span><b>' + UI.st.stats.degats[ME] + '</b></div>' +
      '<div><span>Éliminations</span><b>' + UI.st.stats.eliminations[ME] + '</b></div><div><span>Tours</span><b>' + Math.ceil(UI.st.turnNo / 2) + '</b></div></div>' +
      (rk ? '<div class="rankgain' + (rk.up ? ' promo' : '') + '">' + rankLogo(rk.after.t, 62, '', divPips(rk.after)) + '<div><span>' + (rk.up && rk.after.t > rk.before.t ? 'Nouveau rang !' : rk.up ? 'Division supérieure !' : 'Rang') + '</span>' +
        '<b>' + esc(rk.after.name) + '</b><div class="rbar2"><i style="width:' + rk.after.pct + '%"></i></div><small>' + rk.after.pts + ' Elo' + (rk.after.hi ? ' / ' + rk.after.hi : '') + ' · adversaire ' + rk.opp + '</small></div>' +
        '<em class="' + (rk.delta > 0 ? 'up' : rk.delta < 0 ? 'dn' : '') + '">' + (rk.delta > 0 ? '+' : '') + rk.delta + ' Elo</em></div>' : '') +
      '<div class="endbtns">' + btns + '</div></div>';
    document.body.appendChild(box0);
    if (UI.fxOn && res === 'win') {
      var colors = ['#9fd8ff', '#ffd47a', '#f28ab0', '#5fe0b0', '#c9b6f2'];
      for (var i = 0; i < 70; i++) {
        var p = document.createElement('div'); p.className = 'fx-part';
        Object.assign(p.style, { position: 'fixed', left: (innerWidth / 2) + 'px', top: (innerHeight * 0.38) + 'px', zIndex: 90 });
        p.style.setProperty('--c', colors[i % colors.length]); p.style.setProperty('--s', (5 + Math.random() * 6) + 'px');
        document.body.appendChild(p);
        var a = Math.random() * Math.PI * 2, r = 120 + Math.random() * 380;
        p.animate([{ transform: 'translate(-50%,-50%)', opacity: 1 }, { transform: 'translate(' + Math.cos(a) * r + 'px,' + (Math.sin(a) * r + 160) + 'px) rotate(360deg)', opacity: 0 }], { duration: 1200 + Math.random() * 900, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
        kill(p, 2200);
      }
    }
  }

  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ================================================================== */
  /* Compte, collection, decks, réglages                                 */
  /* ================================================================== */
  var HOST = null;
  try { if (window.parent !== window && window.parent.sakuArenaBridge) HOST = window.parent.sakuArenaBridge; } catch (e) { HOST = null; }
  function load(k, dflt) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? dflt : v; } catch (e) { return dflt; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function guestId() {
    var id = load('sakuArena:guest', null);
    if (!id) { id = 'g' + Math.random().toString(36).slice(2, 12); save('sakuArena:guest', id); }
    return id;
  }
  function me() {
    try { if (HOST) { var m = HOST.me(); if (m && m.pid) return m; } } catch (e) {}
    return { pid: guestId(), uid: null, name: 'Invité', avatar: '', signedIn: false };
  }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  /* Clé de deck : nom|série ; la rareté s'ajoute seulement pour départager deux cartes (Gojo Mythique / Gojo Spéciale). */
  var KEY = (function () { var seen = {}; return POOL.map(function (d) { var k = d.name + '|' + d.series; if (seen[k]) k += '|' + d.rarity; seen[k] = 1; return k; }); })();
  var KEYIDX = {}; KEY.forEach(function (k, i) { if (!(k in KEYIDX)) KEYIDX[k] = i; });
  function keysToIdx(keys) { return (keys || []).map(function (k) { return KEYIDX[k]; }).filter(function (i) { return i != null; }); }
  var SITEID = null;
  function siteIds() {
    if (SITEID) return SITEID;
    var cat = [];
    try { cat = HOST ? (HOST.catalogue() || []) : []; } catch (e) { cat = []; }
    if (!cat.length) return [];
    var byNSR = {}, byNS = {}, byN = {};
    cat.forEach(function (c) {
      var k = norm(c.name) + '|' + norm(c.series); if (!byNS[k]) byNS[k] = String(c.id);
      var kr = k + '|' + (c.rarity || ''); if (!byNSR[kr]) byNSR[kr] = String(c.id);
      var n = norm(c.name); (byN[n] = byN[n] || []).push(String(c.id));
    });
    SITEID = POOL.map(function (d) {
      var id = byNSR[norm(d.name) + '|' + norm(d.series) + '|' + d.rarity] || byNS[norm(d.name) + '|' + norm(d.series)];
      if (!id) { var l = byN[norm(d.name)]; if (l && l.length === 1) id = l[0]; }
      return id || null;
    });
    return SITEID;
  }
  function ownedMap() { try { return HOST ? HOST.owned() : null; } catch (e) { return null; } }
  function isOwned(i, om) { if (!om) return true; var id = siteIds()[i]; return !!(id && om[id] > 0); }
  function ownedCount(om) { if (!om) return POOL.length; var n = 0; for (var i = 0; i < POOL.length; i++) if (isOwned(i, om)) n++; return n; }

  var SET = Object.assign({ fx: true, speed: 'normal', fam: 'split', level: 'normal' }, load('sakuArena:settings', {}));
  function saveSet() { save('sakuArena:settings', SET); }
  UI.fxOn = SET.fx !== false; A.SETTINGS.famMode = 'split';

  var STARTER = ['Riza Hawkeye', 'Mikoto Misaka', 'Portgas D. Ace', 'Toushirou Hitsugaya', 'Byakuya Kuchiki', 'Franky', 'Tengen Uzui', 'Tsunade Senju', 'Erwin Smith', 'Orochimaru',
    'Suguru Getou', 'Ban', 'Hisoka Morow', 'Tatsumaki', 'Solf Kimblee', 'Himiko Toga', 'Keigo Takami', 'Ryomen Sukuna', 'Gokuu Son', 'Makima'];
  function uniqueByName(list) { var seen = {}; return list.filter(function (i) { var n = norm(POOL[i].name); if (seen[n]) return false; seen[n] = 1; return true; }); }
  function power(i) { var d = POOL[i]; return d.pv + d.atk * 1.2 + (A.familyOfDef(d) ? 25 : 0); }
  function autoDeck(fromOwned) {
    var om = fromOwned ? ownedMap() : null;
    var idx = POOL.map(function (_, i) { return i; }).filter(function (i) { return isOwned(i, om); });
    idx.sort(function (a, b) { return power(b) - power(a) + (Math.random() - 0.5) * 30; });
    return uniqueByName(idx).slice(0, 20);
  }
  function starterDeck() {
    var out = STARTER.map(function (n) { var t = norm(n); for (var i = 0; i < POOL.length; i++) if (norm(POOL[i].name) === t) return i; return -1; }).filter(function (i) { return i >= 0; });
    return Array.from(new Set(out)).slice(0, 20);
  }

  function deckStoreKey() { return 'sakuArena:decks:' + (UI.who || 'guest'); }
  function histKey() { return 'sakuArena:hist:' + (UI.who || 'guest'); }
  function loadDecks() {
    var d = load(deckStoreKey(), null), fresh = !d || !Array.isArray(d.decks);
    if (fresh) d = { active: 0, decks: [] };
    while (d.decks.length < 3) d.decks.push({ name: 'Deck ' + (d.decks.length + 1), cards: [] });
    d.decks = d.decks.slice(0, 3);
    d.decks.forEach(function (x, n) { x.name = String(x.name || ('Deck ' + (n + 1))).slice(0, 24); x.cards = (x.cards || []).filter(function (k) { return k in KEYIDX; }).slice(0, 20); });
    if (!(d.active >= 0 && d.active < 3)) d.active = 0;
    if (fresh) {
      var om = ownedMap(), mine = om ? autoDeck(true) : [];
      var first = mine.length === 20 ? mine : starterDeck();
      d.decks[0].cards = first.map(function (i) { return KEY[i]; });
    }
    UI.decks = d; if (fresh) saveDecks();
  }
  function saveDecks() { save(deckStoreKey(), UI.decks); }
  function deckIdx(n) { return keysToIdx(UI.decks.decks[n].cards); }
  function setDeckIdx(n, list) { UI.decks.decks[n].cards = list.map(function (i) { return KEY[i]; }); saveDecks(); }
  function syncIdentity() {
    var m = me(), who = m.uid || 'guest';
    if (who !== UI.who) { UI.who = who; loadDecks(); UI.editing = UI.decks.active; }
    if (UI.colMode == null) { var om = ownedMap(); UI.colMode = om && ownedCount(om) >= 20 ? 'mine' : 'all'; }
    return m;
  }

  /* ---------- historique ---------- */
  var LEVEL_FR = { easy: 'Facile', normal: 'Normal', hard: 'Difficile' };
  function recordResult(res) {
    var h = load(histKey(), []);
    h.unshift({ t: Date.now(), kind: isOnline() ? 'online' : 'duel', level: UI.match && UI.match.level || null, res: res,
      opp: UI.st.players[OP].nom, turns: Math.ceil(UI.st.turnNo / 2), elim: UI.st.stats.eliminations[ME] });
    save(histKey(), h.slice(0, 40));
    if (isDuel()) return applyRank(res, AI_ELO[(UI.match && UI.match.level) || 'normal'], UI.match && UI.match.id);
    var m = UI.net && UI.net.room && UI.net.room.arena && UI.net.room.arena.match;
    if (isOnline() && m && m.ranked && m.ratings) {
      var opp = m.seats[0] === UI.net.pid ? m.seats[1] : m.seats[0];
      return applyRank(res, Number(m.ratings[opp]) || ELO_START, m.id);
    }
    return null;
  }


  /* ================================================================== */
  /* Rangs Arena : cote Elo (départ 1000), 7 paliers.                    */
  /* ================================================================== */
  var TIERS = [
    { key: 'bronze',  nom: 'Bronze',  min: 600,  div: 3, c1: '#ffd2ad', c2: '#a35a2a', c3: '#4a2410', glow: '#e08a50' },
    { key: 'argent',  nom: 'Argent',  min: 900,  div: 3, c1: '#ffffff', c2: '#8fa3bd', c3: '#2c3a4d', glow: '#c9d8ea' },
    { key: 'or',      nom: 'Or',      min: 1200, div: 3, c1: '#fff1b8', c2: '#d99a14', c3: '#5a3a06', glow: '#ffc24d' },
    { key: 'platine', nom: 'Platine', min: 1500, div: 3, c1: '#d9fff7', c2: '#2fb3a6', c3: '#0c3d3a', glow: '#5fe0d0' },
    { key: 'diamant', nom: 'Diamant', min: 1800, div: 3, c1: '#e6f6ff', c2: '#3b82f0', c3: '#0e2a66', glow: '#6fb8ff' },
    { key: 'maitre',  nom: 'Maître',  min: 2100, div: 1, c1: '#f6e0ff', c2: '#9b4fe8', c3: '#33105c', glow: '#c27cff' },
    { key: 'legende', nom: 'Légende', min: 2400, div: 1, c1: '#ffe0e8', c2: '#e2456e', c3: '#4f0c22', glow: '#ff8fb0' }
  ];
  var ROMAN = ['I', 'II', 'III'];
  /* Elo : on gagne plus en battant un adversaire mieux classé, on perd moins en tombant contre lui. */
  var ELO_START = 1000, AI_ELO = { easy: 850, normal: 1100, hard: 1400 };
  function kFactor(games) { return games < 10 ? 48 : games < 30 ? 36 : 28; }
  function eloExpected(me, opp) { return 1 / (1 + Math.pow(10, (opp - me) / 400)); }
  function eloDelta(me, opp, score, games) {
    var d = Math.round(kFactor(games || 0) * (score - eloExpected(me, opp)));
    if (score === 1) d = Math.max(d, 2); else if (score === 0) d = Math.min(d, -2);
    return d;
  }
  function eloStake(opp) { var r = rankLoad(); return { win: eloDelta(r.pts, opp, 1, r.games), loss: eloDelta(r.pts, opp, 0, r.games), draw: eloDelta(r.pts, opp, .5, r.games) }; }
  function rankKey() { return 'sakuArena:rank:' + (UI.who || 'guest'); }
  function rankLoad() { var r = load(rankKey(), null); return r && r.v === 2 && typeof r.pts === 'number' ? r : { v: 2, pts: ELO_START, best: ELO_START, games: 0, done: [] }; }
  function rankInfo(pts) {
    var t = 0, raw = pts; pts = Math.max(pts, TIERS[0].min);
    for (var i = TIERS.length - 1; i >= 0; i--) if (pts >= TIERS[i].min) { t = i; break; }
    var T = TIERS[t], next = TIERS[t + 1], span = (next ? next.min : T.min + 500) - T.min;
    var size = T.div > 1 ? span / T.div : span, k = Math.min(T.div - 1, Math.floor((pts - T.min) / size));
    var lo = T.min + k * size, hi = T.div > 1 || next ? lo + size : null;
    var divLabel = T.div > 1 ? ROMAN[T.div - 1 - k] : '';
    return { t: t, tier: T, div: divLabel, name: T.nom + (divLabel ? ' ' + divLabel : ''), lo: lo, hi: next || T.div > 1 ? hi : null,
      pct: hi ? Math.max(0, Math.min(100, Math.round((pts - lo) / (hi - lo) * 100))) : 100, pts: raw };
  }
  /* Emblèmes de rang (SVG 120×120) : métal biseauté, gemme centrale, ornement propre à chaque rang,
     et pastilles de division (III = 1, II = 2, I = 3) sous l'emblème. */
  var RSEQ = 0;
  var GEMS = { bronze: ['#ffd9a8', '#c2601e'], argent: ['#e9f6ff', '#5b86b8'], or: ['#fff4b0', '#e08a00'], platine: ['#d4fff6', '#139c8c'],
    diamant: ['#eaf7ff', '#2f6fe8'], maitre: ['#f3dcff', '#8a2be2'], legende: ['#ffe1ea', '#d81b55'] };
  function rankLogo(t, size, extraCls, pips) {
    var T = TIERS[t], id = 'rk' + (++RSEQ), G = GEMS[T.key];
    var m = 'url(#' + id + 'm)', dk = 'url(#' + id + 'd)', hl = 'url(#' + id + 'h)', gm = 'url(#' + id + 'g)', gl = 'url(#' + id + 'l)';
    var defs = '<defs>' +
      '<linearGradient id="' + id + 'm" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="' + T.c1 + '"/><stop offset=".38" stop-color="' + T.c2 + '"/><stop offset=".55" stop-color="' + T.c1 + '" stop-opacity=".9"/><stop offset=".72" stop-color="' + T.c2 + '"/><stop offset="1" stop-color="' + T.c3 + '"/></linearGradient>' +
      '<linearGradient id="' + id + 'd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + T.c3 + '"/><stop offset="1" stop-color="#04070f"/></linearGradient>' +
      '<linearGradient id="' + id + 'h" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="' + id + 'g" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="' + G[0] + '"/><stop offset="1" stop-color="' + G[1] + '"/></radialGradient>' +
      '<radialGradient id="' + id + 'l" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="' + T.glow + '" stop-opacity=".55"/><stop offset="1" stop-color="' + T.glow + '" stop-opacity="0"/></radialGradient></defs>';
    function plate(d, inner) {   // pièce métallique biseautée
      return '<path d="' + d + '" fill="' + m + '" stroke="' + T.c3 + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="' + d + '" fill="none" stroke="' + hl + '" stroke-width="1.4" stroke-linejoin="round" transform="translate(0 .6)"/>' +
        (inner ? '<path d="' + inner + '" fill="' + dk + '" stroke="' + T.c1 + '" stroke-opacity=".55" stroke-width="1.2" stroke-linejoin="round"/>' : '');
    }
    function gem(cx, cy, r, kind) {   // gemme facettée
      if (kind === 'round') return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + gm + '" stroke="' + T.c3 + '" stroke-width="1.2"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * .62).toFixed(1) + '" fill="none" stroke="#fff" stroke-opacity=".35"/><ellipse cx="' + (cx - r * .35).toFixed(1) + '" cy="' + (cy - r * .4).toFixed(1) + '" rx="' + (r * .3).toFixed(1) + '" ry="' + (r * .18).toFixed(1) + '" fill="#fff" fill-opacity=".85"/>';
      var p = 'M' + cx + ' ' + (cy - r) + 'L' + (cx + r * .8) + ' ' + cy + 'L' + cx + ' ' + (cy + r) + 'L' + (cx - r * .8) + ' ' + cy + 'Z';
      return '<path d="' + p + '" fill="' + gm + '" stroke="' + T.c3 + '" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<path d="M' + cx + ' ' + (cy - r) + 'L' + (cx + r * .8) + ' ' + cy + 'H' + (cx - r * .8) + 'Z" fill="#fff" fill-opacity=".32"/>' +
        '<path d="M' + (cx - r * .8) + ' ' + cy + 'L' + cx + ' ' + (cy + r) + 'V' + (cy - r) + 'Z" fill="#000" fill-opacity=".12"/>';
    }
    function star(x, y, r, fill, op) { var d = ''; for (var i = 0; i < 10; i++) { var a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * .42 : r; d += (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ' ' + (y + Math.sin(a) * rr).toFixed(1); } return '<path d="' + d + 'Z" fill="' + (fill || '#fff') + '"' + (op ? ' fill-opacity="' + op + '"' : '') + '/>'; }
    function sparkle(x, y, r) { return '<path d="M' + x + ' ' + (y - r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + r) + 'Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + 'Z" fill="#fff"/>'; }
    function chev(y, w) { return '<path d="M' + (60 - w) + ' ' + y + 'l' + w + '-' + (w * .7).toFixed(1) + ' ' + w + ' ' + (w * .7).toFixed(1) + '" fill="none" stroke="' + T.c1 + '" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>'; }
    function crown(cx, cy, s) {
      return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')"><path d="M-17 7-19-9-9-1 0-14 9-1 19-9 17 7z" fill="' + m + '" stroke="' + T.c3 + '" stroke-width="1.3" stroke-linejoin="round"/>' +
        '<path d="M-17 7h34v4h-34z" fill="' + m + '" stroke="' + T.c3 + '" stroke-width="1"/><circle cx="0" cy="-14" r="2.6" fill="' + gm + '"/><circle cx="-19" cy="-9" r="2" fill="' + gm + '"/><circle cx="19" cy="-9" r="2" fill="' + gm + '"/><circle cx="0" cy="3" r="2.4" fill="' + gm + '"/></g>';
    }
    var SH = 'M60 14 92 26v28c0 24-14 40-32 50-18-10-32-26-32-50V26z', SH_IN = 'M60 23 84 32v22c0 18-10 31-24 39-14-8-24-21-24-39V32z';
    var body = '<circle cx="60" cy="58" r="56" fill="' + gl + '"/>';
    if (T.key === 'bronze') {
      body += plate(SH, SH_IN) + gem(60, 50, 9, 'round') + chev(80, 12);
    } else if (T.key === 'argent') {
      body += '<path d="M30 34 6 22l12 26-10 4 22 10z" fill="' + m + '" stroke="' + T.c3 + '" stroke-width="1.3" stroke-linejoin="round"/><path d="M90 34l24-12-12 26 10 4-22 10z" fill="' + m + '" stroke="' + T.c3 + '" stroke-width="1.3" stroke-linejoin="round"/>' +
        plate(SH, SH_IN) + gem(60, 48, 11) + chev(76, 11) + chev(87, 11);
    } else if (T.key === 'or') {
      var leaf = 'M0-8C4-4 4 4 0 8-4 4-4-4 0-8z', wreath = '<path d="M44 106C18 96 10 66 20 40M76 106c26-10 34-40 24-66" fill="none" stroke="' + T.c2 + '" stroke-width="2" stroke-linecap="round"/>';
      for (var i = 0; i < 8; i++) {
        var phi = 112 + i * 14, x = 60 + Math.cos(phi * Math.PI / 180) * 47, y = 62 + Math.sin(phi * Math.PI / 180) * 47, rot = phi + 160;
        wreath += '<path d="' + leaf + '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + rot.toFixed(0) + ') scale(' + (1.05 - i * .04).toFixed(2) + ')" fill="' + m + '" stroke="' + T.c3 + '" stroke-width=".9"/>';
        wreath += '<path d="' + leaf + '" transform="translate(' + (120 - x).toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (-rot).toFixed(0) + ') scale(' + (1.05 - i * .04).toFixed(2) + ')" fill="' + m + '" stroke="' + T.c3 + '" stroke-width=".9"/>';
      }
      body += wreath + plate(SH, SH_IN) + star(60, 52, 15, gm) + star(60, 52, 15, 'none') + '<path d="M60 37 63.6 47.2H74.3L65.6 53.4 69 63.6 60 57.3 51 63.6 54.4 53.4 45.7 47.2H56.4z" fill="none" stroke="' + T.c3 + '" stroke-width="1"/>' + chev(82, 10) + star(60, 8, 6, T.c1);
    } else if (T.key === 'platine') {
      var HX = 'M60 8 98 30v44L60 114 22 74V30z', HX_IN = 'M60 18 89 35v34L60 103 31 69V35z';
      body += '<path d="M24 40 4 56l20 16z" fill="' + m + '" stroke="' + T.c3 + '" stroke-width="1.2"/><path d="M96 40l20 16-20 16z" fill="' + m + '" stroke="' + T.c3 + '" stroke-width="1.2"/>' +
        plate(HX, HX_IN) + '<path d="M60 28 72 54 60 90 48 54z" fill="' + gm + '" stroke="' + T.c3 + '" stroke-width="1.2"/><path d="M60 28 72 54H48z" fill="#fff" fill-opacity=".38"/><path d="M48 54 60 90V54z" fill="#000" fill-opacity=".12"/>' +
        '<path d="M40 96h40" stroke="' + T.c1 + '" stroke-width="3" stroke-linecap="round" stroke-opacity=".8"/>';
    } else if (T.key === 'diamant') {
      var rays = '';
      for (var r = 0; r < 12; r++) { var a0 = r * 30 + 15, L0 = r % 2 ? 50 : 60;
        rays += '<path d="M60 60 L' + (60 + Math.cos((a0 - 3) * Math.PI / 180) * 26).toFixed(1) + ' ' + (60 + Math.sin((a0 - 3) * Math.PI / 180) * 26).toFixed(1) + ' L' + (60 + Math.cos(a0 * Math.PI / 180) * L0).toFixed(1) + ' ' + (60 + Math.sin(a0 * Math.PI / 180) * L0).toFixed(1) + ' L' + (60 + Math.cos((a0 + 3) * Math.PI / 180) * 26).toFixed(1) + ' ' + (60 + Math.sin((a0 + 3) * Math.PI / 180) * 26).toFixed(1) + 'z" fill="' + (r % 2 ? T.c2 : '#cfe9ff') + '" fill-opacity="' + (r % 2 ? .6 : .85) + '"/>'; }
      body += rays + '<path d="M34 22h52l24 30-50 62L10 52z" fill="' + gm + '" stroke="' + T.c3 + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M34 22 46 52 60 22 74 52 86 22M10 52h100M46 52l14 62 14-62" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.3" stroke-linejoin="round"/>' +
        '<path d="M34 22 46 52H10z" fill="#fff" fill-opacity=".42"/><path d="M60 22 74 52H46z" fill="#fff" fill-opacity=".22"/><path d="M74 52 60 114 110 52z" fill="#000" fill-opacity=".18"/>' +
        sparkle(98, 18, 8) + sparkle(18, 86, 5) + sparkle(84, 96, 4);
    } else if (T.key === 'maitre') {
      var feather = 'M0 0C-10-5-27-5-38 1-27 6-11 7 0 4z', wings = '';
      [-28, -12, 4, 20, 36].forEach(function (deg, k) {
        var sc = 1 - k * .09;
        wings += '<path d="' + feather + '" transform="translate(34 50) rotate(' + deg + ') scale(' + sc.toFixed(2) + ')" fill="' + m + '" stroke="' + T.c3 + '" stroke-width="1.1"/>';
        wings += '<path d="' + feather + '" transform="translate(86 50) scale(-1 1) rotate(' + deg + ') scale(' + sc.toFixed(2) + ')" fill="' + m + '" stroke="' + T.c3 + '" stroke-width="1.1"/>';
      });
      body += wings + plate(SH, SH_IN) + crown(60, 15, 1) + gem(60, 56, 15) + sparkle(60, 86, 5);
    } else {
      var burst = '', petals = '';
      for (var q = 0; q < 16; q++) { var a1 = q * 22.5, L = q % 2 ? 46 : 57; burst += '<path d="M60 60 L' + (60 + Math.cos((a1 - 5) * Math.PI / 180) * 20).toFixed(1) + ' ' + (60 + Math.sin((a1 - 5) * Math.PI / 180) * 20).toFixed(1) + ' L' + (60 + Math.cos(a1 * Math.PI / 180) * L).toFixed(1) + ' ' + (60 + Math.sin(a1 * Math.PI / 180) * L).toFixed(1) + ' L' + (60 + Math.cos((a1 + 5) * Math.PI / 180) * 20).toFixed(1) + ' ' + (60 + Math.sin((a1 + 5) * Math.PI / 180) * 20).toFixed(1) + 'z" fill="' + (q % 2 ? '#ffd47a' : '#fff0c2') + '" fill-opacity="' + (q % 2 ? .55 : .8) + '"/>'; }
      for (var k2 = 0; k2 < 5; k2++) petals += '<path d="M0 0C-11-9-13-26-4-36L0-31 4-36C13-26 11-9 0 0z" transform="translate(60 60) rotate(' + (k2 * 72) + ')" fill="' + m + '" stroke="' + T.c3 + '" stroke-width="1.2"/>' +
        '<path d="M0-6C-3-14-3-22 0-28" transform="translate(60 60) rotate(' + (k2 * 72) + ')" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/>';
      body += burst + petals + '<circle cx="60" cy="60" r="17" fill="' + dk + '" stroke="#ffe7a8" stroke-width="2.4"/>' + gem(60, 60, 11, 'round') + crown(60, 16, .95) +
        '<path d="M38 96 28 108l12-2 4 9 6-14M82 96l10 12-12-2-4 9-6-14" fill="' + m + '" stroke="' + T.c3 + '" stroke-width="1"/>';
    }
    var pipsHtml = '';
    if (pips) { for (var n = 0; n < pips; n++) { var px = 60 + (n - (pips - 1) / 2) * 11; pipsHtml += '<path d="M' + px + ' 109l4.2 5-4.2 5-4.2-5z" fill="' + gm + '" stroke="' + T.c3 + '" stroke-width="1"/>'; } }
    return '<svg class="rlogo' + (extraCls ? ' ' + extraCls : '') + '" viewBox="0 0 120 124" width="' + size + '" height="' + size + '" role="img" aria-label="Rang ' + T.nom + '">' + defs +
      '<g style="filter:drop-shadow(0 ' + Math.max(1, size / 40).toFixed(1) + 'px ' + Math.max(2, size / 16).toFixed(1) + 'px #000a)">' + body + '</g>' + pipsHtml + '</svg>';
  }
  function divPips(R) { return R.tier.div > 1 ? R.tier.div - ROMAN.indexOf(R.div) : 0; }
  function rankBadge(pts, size) { var R = rankInfo(pts || 0); return '<span class="rbadge" title="' + esc(R.name) + ' · ' + R.pts + ' Elo">' + rankLogo(R.t, size || 22) + '<b>' + esc(R.name) + '</b></span>'; }
  /* Applique le résultat d'un match classé (une seule fois par match). */
  function applyRank(res, oppRating, matchId) {
    var r = rankLoad(), before = rankInfo(r.pts);
    if (matchId && (r.done || []).indexOf(matchId) >= 0) return null;
    var score = res === 'win' ? 1 : res === 'loss' ? 0 : .5;
    var delta = eloDelta(r.pts, oppRating, score, r.games);
    var pts = Math.max(0, r.pts + delta);
    delta = pts - r.pts; r.pts = pts; r.games = (r.games || 0) + 1; r.best = Math.max(r.best || 0, pts);
    if (matchId) r.done = (r.done || []).concat([matchId]).slice(-40);
    save(rankKey(), r);
    var after = rankInfo(pts);
    return { delta: delta, opp: oppRating, before: before, after: after, up: after.t > before.t || (after.t === before.t && after.lo > before.lo) };
  }
  function renderRanks() {
    var rr = rankLoad(), me0 = rankInfo(rr.pts);
    var rows = TIERS.map(function (T, t) {
      var cur = t === me0.t, next = TIERS[t + 1];
      var divs = T.div > 1 ? ROMAN.slice(0, T.div).reverse().join(' → ') + ' (100 Elo chacune)' : 'division unique';
      return '<div class="rkrow' + (cur ? ' cur' : '') + (t > me0.t ? ' locked' : '') + '">' + rankLogo(t, 64, '', cur ? divPips(me0) : 0) +
        '<div><b>' + T.nom + '</b><span>' + (t === 0 ? 'moins de ' + next.min : T.min + (next ? ' – ' + (next.min - 1) : ' et plus')) + ' Elo · ' + divs + '</span>' + (cur ? '<em>Ton rang : ' + esc(me0.name) + ' · ' + rr.pts + ' Elo</em>' : '') + '</div></div>';
    }).join('');
    var diffs = [-300, -150, 0, 150, 300], k = kFactor(rr.games);
    var table = diffs.map(function (d) {
      var w = Math.max(2, Math.round(k * (1 - eloExpected(1500, 1500 + d)))), l = Math.min(-2, Math.round(k * (0 - eloExpected(1500, 1500 + d))));
      return '<div><span>' + (d === 0 ? 'Même cote' : (d > 0 ? '+' : '') + d + ' Elo') + '</span><b class="up">+' + w + '</b><b class="dn">' + l + '</b></div>';
    }).join('');
    var ai = ['easy', 'normal', 'hard'].map(function (lv) { var st = eloStake(AI_ELO[lv]); return '<div><span>IA ' + LEVEL_FR[lv] + ' (' + AI_ELO[lv] + ')</span><b class="up">+' + st.win + '</b><b class="dn">' + st.loss + '</b></div>'; }).join('');
    return head('Rangs', 'Ta cote Elo monte ou descend après chaque match classé, selon le niveau de ton adversaire.') +
      '<div class="setup"><section class="panel"><h2>Les 7 rangs</h2><div class="rklist">' + rows + '</div></section>' +
      '<section class="panel"><h2>Points selon l’adversaire</h2><p class="sub">Écart entre la cote de ton adversaire et la tienne (coefficient actuel : ' + k + ').</p>' +
        '<div class="rkgain"><div class="h"><span>Adversaire</span><b>Victoire</b><b>Défaite</b></div>' + table + '</div>' +
        '<h2 style="margin-top:20px">Duel contre l’IA</h2><div class="rkgain"><div class="h"><span>Niveau</span><b>Victoire</b><b>Défaite</b></div>' + ai + '</div>' +
      '<ul class="ess" style="margin-top:14px"><li>Battre un joueur mieux classé rapporte beaucoup ; battre un joueur moins bien classé rapporte peu.</li>' +
      '<li>Perdre contre plus fort coûte peu ; perdre contre plus faible coûte cher.</li>' +
      '<li>Départ à 1000 Elo. Les 10 premiers matchs comptent plus (coefficient 48), puis 36 jusqu’au 30e, puis 28.</li>' +
      '<li>En Amical, l’hôte peut rendre la partie classée ; sinon elle ne compte pas.</li>' +
      '<li>Version test : la cote est enregistrée sur cet appareil.</li></ul></section></div>';
  }


  /* ================================================================== */
  /* Écrans                                                              */
  /* ================================================================== */
  var ICONS = {
    duel: '<path d="M5 3l7 7M3 5l2-2M12 10l2 2-2 2-2-2M19 3l-7 7M21 5l-2-2M12 10"/><path d="M4 20l5-5M20 20l-5-5M3 18l3 3M21 18l-3 3"/>',
    friendly: '<circle cx="8" cy="8" r="3.2"/><circle cx="16.5" cy="9" r="2.6"/><path d="M2.5 20c.6-3.6 2.8-5.6 5.5-5.6s4.9 2 5.5 5.6M14 15.2c.8-.5 1.6-.8 2.5-.8 2.3 0 4.2 1.7 4.7 4.8"/>',
    deck: '<rect x="3" y="6" width="11" height="15" rx="2"/><path d="M7 3h10a2 2 0 0 1 2 2v13"/>',
    rules: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5V4.5M8 7h8M8 11h6"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    ranks: '<path d="M12 2 20 6v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="m8.5 12 3.5-3 3.5 3M8.5 15.5l3.5-3 3.5 3"/>'
  };
  function icon(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[k] + '</svg>'; }
  function head(title, sub) {
    return '<header class="ahead"><button class="backbtn" data-act="go" data-s="menu" aria-label="Retour au menu Arena">' + icon('back') + '</button>' +
      '<div><span class="kicker">SAKUGAME / ARENA</span><h1>' + esc(title) + '</h1>' + (sub ? '<p class="sub">' + esc(sub) + '</p>' : '') + '</div></header>';
  }
  function deckSummary(n) {
    var list = deckIdx(n), om = ownedMap(), out = list.filter(function (i) { return !isOwned(i, om); }).length;
    var fams = list.filter(function (i) { return A.familyOfDef(POOL[i]); }).length;
    return { n: list.length, out: out, fams: fams, ok: list.length === 20 };
  }
  function deckPicker(act) {
    return '<div class="deckpick">' + UI.decks.decks.map(function (d, n) {
      var s = deckSummary(n);
      return '<button class="dpk' + (UI.decks.active === n ? ' on' : '') + (s.ok ? '' : ' bad') + '" data-act="' + act + '" data-n="' + n + '"><b>' + esc(d.name) + '</b><span>' + s.n + '/20 cartes</span>' +
        (s.out ? '<em>' + s.out + ' hors collection</em>' : '') + '</button>';
    }).join('') + '</div>';
  }

  function renderMenu() {
    var m = me(), n = UI.decks.active, act = UI.decks.decks[n], s = deckSummary(n), list = deckIdx(n);
    var h = load(histKey(), []), wins = h.filter(function (x) { return x.res === 'win'; }).length;
    var rate = h.length ? Math.round(wins / h.length * 100) + ' %' : '—', RK = rankInfo(rankLoad().pts);
    var counts = {}; list.forEach(function (i) { var r = POOL[i].rarity; counts[r] = (counts[r] || 0) + 1; });
    var bar = RARITY_ORDER.filter(function (r) { return counts[r]; }).map(function (r) { return '<span style="width:' + (counts[r] / 20 * 100) + '%;background:var(--' + r + ')"></span>'; }).join('');
    var shown = list.slice().sort(function (a, b) { return RARITY_ORDER.indexOf(POOL[a].rarity) - RARITY_ORDER.indexOf(POOL[b].rarity); }).slice(0, 10);
    var thumbs = shown.map(function (i) { var d = POOL[i]; return '<span class="mth r-' + d.rarity + '" title="' + esc(d.name) + '"><img src="' + esc(d.thumb) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.visibility=\'hidden\'"></span>'; }).join('');
    for (var k = shown.length; k < 10; k++) thumbs += '<span class="mth empty"></span>';
    var lv = LEVEL_FR[SET.level || 'normal'];
    function play(key, title, desc, meta, cta) {
      return '<button class="mplaycard ' + key + '" data-act="go" data-s="' + key + '"><span class="bgico" aria-hidden="true">' + icon(key) + '</span>' +
        '<span class="ti">' + icon(key) + '</span><span class="tx"><b>' + title + '</b><span>' + desc + '</span></span>' +
        '<span class="foot"><em>' + meta + '</em><span class="cta">' + cta + ' <span aria-hidden="true">→</span></span></span></button>';
    }
    function link(key, title, desc) {
      return '<button class="mlink" data-act="go" data-s="' + key + '"><span class="ti">' + icon(key) + '</span><span class="tx"><b>' + title + '</b><span>' + desc + '</span></span><span class="arr" aria-hidden="true">›</span></button>';
    }
    return '<div class="amenu">' +
      '<section class="hero"><div class="herotx"><span class="kicker">SAKUGAME / ARENA <i class="testtag">version test</i></span><h1>Arena</h1>' +
        '<p class="sub">Combats de cartes en 1 contre 1 : 5 cases, 3 cartes en main, 2 coups par tour. Élimine toutes les cartes adverses.</p></div>' +
        '<button class="herorank" data-act="go" data-s="ranks">' + rankLogo(RK.t, 78, '', divPips(RK)) + '<span class="hrk"><span class="kicker">Rang</span><b>' + esc(RK.name) + '</b>' +
          '<span class="rbar2"><i style="width:' + RK.pct + '%"></i></span><small>' + RK.pts + ' Elo' + (RK.hi ? ' / ' + RK.hi : '') + ' · ' + h.length + ' combat' + (h.length > 1 ? 's' : '') + ', ' + rate + ' de victoires</small></span></button>' +
        '<span class="who">' + (m.signedIn ? esc(m.name) : 'Invité (non connecté)') + '</span></section>' +
      (UI.net ? '<button class="resume" data-act="go" data-s="friendly">Salon Amical en cours · ' + esc(UI.net.code) + ' — revenir</button>' : '') +
      (UI.st && !UI.st.over ? '<button class="resume" data-act="resume">Partie en cours — reprendre</button>' : '') +
      '<div class="mgrid"><div class="mplay">' +
        play('duel', 'Duel', 'Affronte l’IA avec ton deck. Trois niveaux de difficulté.', 'Niveau ' + lv, 'Jouer') +
        play('friendly', 'Amical', 'Défie un ami en ligne avec un code de salon. Sans enjeu.', 'Salon privé à 2', '<span class="lg">Créer ou rejoindre</span><span class="sm">Jouer</span>') +
      '</div><aside class="mside">' +
        '<button class="mdeck" data-act="go" data-s="deck"><span class="kicker">Deck de combat</span>' +
          '<span class="mdhead"><b>' + esc(act.name) + '</b><small' + (s.ok ? '' : ' class="bad"') + '>' + s.n + '/20</small></span>' +
          '<span class="mthumbs">' + thumbs + '</span><span class="rbar">' + bar + '</span>' +
          '<span class="mdfoot"><small>' + (s.out ? s.out + ' carte' + (s.out > 1 ? 's' : '') + ' hors collection' : (s.ok ? 'Prêt pour le combat' : 'Deck incomplet')) + '</small><span class="cta">Modifier mes decks <span aria-hidden="true">→</span></span></span></button>' +
        '<nav class="mlinks">' + link('ranks', 'Rangs', 'Les 7 rangs et le calcul Elo') + link('rules', 'Règles', 'Comment jouer, statuts et capacités') + link('history', 'Historique', 'Tes derniers combats et ton bilan') + link('settings', 'Paramètres', 'Animations et vitesse de l’IA') + '</nav>' +
      '</aside></div></div>';
  }

  function renderDeck() {
    var n = UI.editing, deck = deckIdx(n), chosen = new Set(deck), om = ownedMap();
    var need = 20 - deck.length, counts = {};
    deck.forEach(function (i) { var r = POOL[i].rarity; counts[r] = (counts[r] || 0) + 1; });
    var deckRows = deck.map(function (i, k) {
      var d = POOL[i], f = A.familyOfDef(d), own = isOwned(i, om);
      return '<div class="deckrow' + (own ? '' : ' out') + '" data-act="deckrow" data-p="' + i + '"><img src="' + esc(d.thumb) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.visibility=\'hidden\'">' +
        '<span class="nm">' + esc(d.name) + (own ? '' : ' <small>hors collection</small>') + '</span>' + 
        '<button class="infob" data-act="sheet" data-i="' + i + '" title="Voir la fiche" aria-label="Voir la fiche de ' + esc(d.name) + '">i</button>' +
        '<button data-act="remove" data-i="' + k + '" title="Retirer">×</button></div>';
    }).join('') || '<div class="sub" style="padding:10px 0">Aucune carte : choisis-en 20 dans la liste.</div>';
    var barSegs = RARITY_ORDER.filter(function (r) { return counts[r]; }).map(function (r) { return '<span style="width:' + (counts[r] / 20 * 100) + '%;background:var(--' + r + ')"></span>'; }).join('');
    var countChips = RARITY_ORDER.filter(function (r) { return counts[r]; }).map(function (r) { return '<span style="color:var(--' + r + ')">' + RARITY_FR[r] + ' ' + counts[r] + '</span>'; }).join('');
    var q = UI.search.trim().toLowerCase(), mine = UI.colMode === 'mine' && om;
    var list = POOL.map(function (d, i) { return { d: d, i: i }; }).filter(function (o) {
      if (mine && !isOwned(o.i, om)) return false;
      if (UI.rarity !== 'all' && o.d.rarity !== UI.rarity) return false;
      if (UI.series !== 'all' && o.d.series !== UI.series) return false;
      if (q && (o.d.name + ' ' + o.d.series).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var grid = list.slice(0, UI.limit).map(function (o) {
      var own = isOwned(o.i, om);
      return '<div class="poolcard' + (chosen.has(o.i) ? ' chosen' : '') + (own ? '' : ' unowned') + '" data-act="pick" data-i="' + o.i + '">' + cardFace(o.d, {}) + (own ? '' : '<span class="nown">non possédée</span>') +
        '<button class="infob" data-act="sheet" data-i="' + o.i + '" title="Voir la fiche" aria-label="Voir la fiche de ' + esc(o.d.name) + '">i</button></div>';
    }).join('');
    var nOwned = om ? ownedCount(om) : 0;
    return head('Deck', 'Compose tes decks de combat. Ils sont enregistrés automatiquement sur cet appareil.') +
      '<div class="builder"><aside class="panel">' +
      '<div class="dtabs">' + UI.decks.decks.map(function (d, k) { return '<button class="' + (k === n ? 'on' : '') + '" data-act="editdeck" data-n="' + k + '">' + (UI.decks.active === k ? '★ ' : '') + esc(d.name) + '</button>'; }).join('') + '</div>' +
      '<label class="dname"><span>Nom</span><input id="deckname" maxlength="24" value="' + esc(UI.decks.decks[n].name) + '"></label>' +
      '<div class="deckhead"><h2>' + deck.length + '<small>/20</small></h2>' +
        (UI.decks.active === n ? '<span class="activetag">Deck de combat</span>' : '<button class="ghostbtn" data-act="setactive" data-n="' + n + '">Utiliser pour combattre</button>') + '</div>' +
      '<div class="sub">Personnages uniques · Uncommon minimum (pas de Common)</div>' +
      '<div class="rbar">' + barSegs + '</div><div class="counts">' + (countChips || '<span>vide</span>') + '</div>' +
      '<div class="decklist">' + deckRows + '</div>' +
      '<div class="dbtns"><button class="ghostbtn" data-act="autodeck">Auto (ma collection)</button><button class="ghostbtn" data-act="random">Aléatoire</button>' +
        '<button class="ghostbtn" data-act="clear">Vider</button></div>' +
      '<div class="sticky-cta"><button class="primary" style="width:100%" data-act="go" data-s="duel" ' + (deck.length === 20 ? '' : 'disabled') + '>' +
        (deck.length === 20 ? 'Jouer un Duel avec ce deck' : 'Encore ' + need + ' carte' + (need > 1 ? 's' : '')) + '</button></div>' +
      '</aside><section>' +
      '<div class="colseg"><button class="' + (UI.colMode === 'mine' ? 'on' : '') + '" data-act="colmode" data-v="mine"' + (om ? '' : ' disabled') + '>Ma collection' + (om ? ' <b>' + nOwned + '</b>' : '') + '</button>' +
        '<button class="' + (UI.colMode !== 'mine' ? 'on' : '') + '" data-act="colmode" data-v="all">Toutes les cartes <b>' + POOL.length + '</b></button>' +
        '<span class="sub">' + (om ? 'Version test : les cartes non possédées restent autorisées.' : 'Connecte-toi pour filtrer sur ta collection.') + '</span></div>' +
      '<div class="filters"><label class="search"><span>⌕</span><input id="q" type="search" placeholder="Rechercher un personnage ou une série…" value="' + esc(UI.search) + '"></label>' +
        '<select id="series"><option value="all">Toutes les séries (' + SERIES.length + ')</option>' +
          SERIES.map(function (s) { return '<option value="' + esc(s) + '"' + (UI.series === s ? ' selected' : '') + '>' + esc(s) + '</option>'; }).join('') + '</select>' +
        '</div>' +
      '<div class="chips"><button class="chip' + (UI.rarity === 'all' ? ' active' : '') + '" data-act="rarity" data-r="all">Toutes raretés</button>' +
        RARITY_ORDER.map(function (r) { return '<button class="chip' + (UI.rarity === r ? ' active' : '') + '" data-act="rarity" data-r="' + r + '">' + RARITY_FR[r] + '</button>'; }).join('') + '</div>' +
      '<div class="sub" style="margin-bottom:11px">' + list.length + ' carte(s) — touche une carte pour l’ajouter ou la retirer ; touche ⓘ (ou appuie longuement) pour lire sa capacité.</div>' +
      '<div class="poolgrid">' + grid + '</div>' +
      (list.length > UI.limit ? '<button class="ghostbtn morebtn" data-act="more">Afficher ' + Math.min(120, list.length - UI.limit) + ' cartes de plus</button>' : '') +
      '</section></div>';
  }

  function renderDuel() {
    var lv = SET.level || 'normal', s = deckSummary(UI.decks.active);
    var desc = { easy: 'L’IA joue un deck d’Uncommon, de Rare et de quelques Épiques, et se trompe de temps en temps.',
      normal: 'L’IA joue un deck mélangé de toutes les raretés.',
      hard: 'L’IA joue un deck d’Épiques, de Légendaires, de Mythiques et de Spéciales, et choisit toujours son meilleur coup.' };
    return head('Duel', 'Un combat contre l’IA. Rien n’est misé.') +
      '<div class="setup"><section class="panel"><h2>1. Ton deck</h2>' + deckPicker('pickactive') +
      '<button class="ghostbtn" data-act="go" data-s="deck">Modifier mes decks</button></section>' +
      '<section class="panel"><h2>2. Difficulté</h2><div class="seg big">' + ['easy', 'normal', 'hard'].map(function (k) {
        return '<button data-act="level" data-v="' + k + '" class="' + (lv === k ? 'on' : '') + '">' + LEVEL_FR[k] + '</button>'; }).join('') + '</div>' +
      '<p class="sub">' + desc[lv] + '</p><p class="stake">' + rankLogo(rankInfo(rankLoad().pts).t, 28) + '<span>IA ' + AI_ELO[lv] + ' Elo · Victoire <b class="up">+' + eloStake(AI_ELO[lv]).win + '</b> · Défaite <b class="dn">' + eloStake(AI_ELO[lv]).loss + '</b></span></p>' +
      '<button class="primary wide" data-act="startduel"' + (s.ok ? '' : ' disabled') + '>' + (s.ok ? 'Lancer le duel' : 'Ton deck doit compter 20 cartes') + '</button></section></div>';
  }

  function renderFriendly() {
    var m = me(), N = UI.net, db = null;
    try { db = HOST && HOST.db(); } catch (e) { db = null; }
    if (!db) return head('Amical', 'Combat en ligne contre un ami.') + '<section class="panel"><p class="sub">Le mode Amical n’est disponible que depuis le site Sakugame (version test).</p></section>';
    var s = deckSummary(UI.decks.active);
    if (!N) {
      return head('Amical', 'Combat en ligne contre un ami, sans enjeu. Chacun joue avec son propre deck.') +
        '<div class="setup"><section class="panel"><h2>Ton deck</h2>' + deckPicker('pickactive') + '</section>' +
        '<section class="panel"><h2>Créer un salon</h2><p class="sub">Tu reçois un code à 4 caractères à donner à ton ami' + (m.signedIn ? ', ou invite-le directement.' : '.') + '</p>' +
        '<button class="primary wide" data-act="netcreate"' + (s.ok ? '' : ' disabled') + '>Créer un salon</button>' +
        '<h2 style="margin-top:22px">Rejoindre</h2><div class="joinrow"><input id="joincode" maxlength="4" placeholder="CODE" autocomplete="off" spellcheck="false" value="' + esc(UI.joinCode || '') + '">' +
        '<button class="primary" data-act="netjoin"' + (s.ok ? '' : ' disabled') + '>Rejoindre</button></div>' +
        (s.ok ? '' : '<p class="sub warn">Ton deck de combat doit compter 20 cartes.</p>') +
        (m.signedIn ? '' : '<p class="sub">Tu joues en invité : connecte-toi sur le site pour inviter tes amis.</p>') + '</section></div>';
    }
    var room = N.room || {}, players = room.players || {}, ids = Object.keys(players);
    var decks = (room.arena && room.arena.decks) || {};
    var seats = ids.map(function (id) {
      var p = players[id] || {}, ready = decks[id] && decks[id].length === 20;
      return '<div class="pl"><span class="ava">' + (p.avatar ? '<img src="' + esc(p.avatar) + '" alt="" onerror="this.remove()">' : '') + '<b>' + esc(String(p.name || '?').charAt(0).toUpperCase()) + '</b></span>' +
        '<span class="pn">' + esc(p.name || 'Joueur') + (id === N.pid ? ' <small>(toi)</small>' : '') + (room.host === id ? ' <small>hôte</small>' : '') + '</span>' + rankBadge(p.rank || 0, 22) +
        '<span class="pr' + (ready ? ' ok' : '') + '">' + (ready ? 'deck prêt' : 'deck…') + '</span></div>';
    }).join('');
    if (ids.length < 2) seats += '<div class="pl wait"><span class="ava"></span><span class="pn">En attente d’un adversaire…</span></div>';
    var ranked = !!(room.arena && room.arena.ranked), oppId = ids.filter(function (id) { return id !== N.pid; })[0];
    var oppRating = oppId && players[oppId] ? Number(players[oppId].rank) || ELO_START : null, stake = oppRating != null ? eloStake(oppRating) : null;
    var rankedBox = '<div class="rankedbox' + (ranked ? ' on' : '') + '"><div><b>' + (ranked ? 'Partie classée' : 'Partie amicale') + '</b><span>' +
      (ranked ? (stake ? 'Contre ' + oppRating + ' Elo : victoire <b class="up">+' + stake.win + '</b> · défaite <b class="dn">' + stake.loss + '</b>' : 'Ta cote Elo changera selon celle de ton adversaire.') : 'Ne compte pas pour le classement.') + '</span></div>' +
      (N.isHost && room.state === 'lobby' ? '<button class="ghostbtn" data-act="toggleranked">' + (ranked ? 'Rendre amicale' : 'Rendre classée') + '</button>' : '') + '</div>';
    var canStart = N.isHost && room.state === 'lobby' && ids.length === 2 && ids.every(function (id) { return decks[id] && decks[id].length === 20; });
    var resume = UI.st && isOnline() ? '<button class="primary wide" data-act="resume">' + (UI.st.over ? 'Revoir la fin de partie' : 'Reprendre la partie') + '</button>' : '';
    return head('Amical', 'Salon privé : seuls les joueurs qui ont le code peuvent entrer.') +
      '<div class="setup"><section class="panel lobby">' + resume + '<span class="kicker">Code du salon</span><div class="codebig">' + esc(N.code) + '</div>' +
      '<div class="dbtns"><button class="ghostbtn" data-act="copycode">Copier le code</button><button class="ghostbtn" data-act="copylink">Copier le lien</button>' +
      (m.signedIn && HOST && HOST.invite ? '<button class="ghostbtn" data-act="invite">Inviter un ami</button>' : '') + '</div>' +
      '<div class="players">' + seats + '</div>' + rankedBox +
      (room.state !== 'lobby' ? '' : N.isHost ? '<button class="primary wide" data-act="netstart"' + (canStart ? '' : ' disabled') + '>' + (canStart ? 'Lancer la partie' : 'En attente du deuxième joueur') + '</button>'
        : '<p class="sub">L’hôte lance la partie dès que vous êtes deux.</p>') +
      '<button class="ghostbtn" data-act="netleave" style="margin-top:12px">Quitter le salon</button></section>' +
      '<section class="panel"><h2>Ton deck</h2>' + deckPicker('pickactive') + '<p class="sub">Change de deck avant le lancement : il est envoyé au salon.</p></section></div>';
  }

  /* Effets des capacités de signature, par ordre alphabétique (valeurs Épique / Légendaire / Mythique / Spéciale). */
  var EFF_EX = null;
  function effectExamples() {
    if (EFF_EX) return EFF_EX;
    EFF_EX = {};
    var order = { special: 0, mythic: 1, legendary: 2, epic: 3 };
    POOL.slice().sort(function (x, y) { return (order[x.rarity] == null ? 9 : order[x.rarity]) - (order[y.rarity] == null ? 9 : order[y.rarity]); }).forEach(function (d) {
      A.signatureOf(d).forEach(function (sg) {
        var l = EFF_EX[sg.key] || (EFF_EX[sg.key] = []);
        if (l.length < 3) l.push(sg.nom + ' (' + d.name + ')');
      });
    });
    return EFF_EX;
  }
  function abilityLists() {
    var E = A.EFFECTS, ex = effectExamples(), pas = [], act = [];
    function uses(arr) {
      var u = arr.every(function (x) { return x === arr[0]; }) ? String(arr[0]) : arr.join(' / ');
      return u + ' utilisation' + (u === '1' ? '' : 's');
    }
    Object.keys(E).forEach(function (k) {
      if (!ex[k]) return;   // effet porté par aucune carte
      var x = E[k];
      (x.kind === 'passive' ? pas : act).push({ n: x.nom, t: x.kind === 'passive' ? 'passive' : 'active · ' + uses(x.uses), d: x.d(-1), f: x.fam, e: ex[k] });
    });
    function rows(list) {
      return list.sort(function (a, b) { return a.n.localeCompare(b.n, 'fr'); }).map(function (x) {
        return '<div class="row"><b' + famStyle(x.f) + '>' + esc(x.n) + ' <em class="abt">' + esc(x.t) + '</em></b><p>' + esc(x.d) + '</p>' +
          '<p class="sub abex">Ex. : ' + esc(x.e.join(', ')) + '</p></div>';
      }).join('');
    }
    return '<h2>Capacités</h2><p class="sub">Chaque Épique, Légendaire, Mythique et Spéciale porte une vraie technique de son personnage (Getsuga Tenshō, The World, Gear Fifth…), reliée à l’un des effets ci-dessous. ' +
      'Une seule capacité par carte, deux pour les Spéciales. Quand une valeur change avec la rareté, elle est donnée dans l’ordre Épique / Légendaire / Mythique / Spéciale ; touche une carte en jeu pour voir sa valeur exacte.</p>' +
      '<p class="sub"><b style="color:#fff">Lire la capacité d’une carte</b> : bouton ⓘ dans Deck, bouton « Fiche » en partie, ou appui long (clic droit à la souris) sur n’importe quelle carte.</p>' +
      '<h2>Effets passifs</h2><p class="sub">Aucun coup : ils s’appliquent tant que la carte est visible.</p>' + rows(pas) +
      '<h2>Effets actifs</h2><p class="sub">Un coup par utilisation (sauf mention contraire).</p>' + rows(act) +
      '<p class="sub" style="margin-top:12px">Quelques personnages ont des capacités uniques aux règles propres (Goku, Sukuna, Megumi, Makima, Reze, Angel Devil, Yoru, Gogeta, Itachi, Sasuke, Hohenheim, Denji, Pochita) : elles sont décrites sur leur carte. Rare et Uncommon n’ont pas de capacité.</p>';
  }
  function renderRules() {
    var rows = A.RULES.filter(function (r) { return r.id !== 'familles'; }).map(function (r) { return '<div class="row"><b>' + esc(r.titre) + '</b><p>' + esc(r.texte) + '</p></div>'; }).join('');
    var sts = Object.keys(ST_TXT).filter(function (k) { return k !== 'venom2' && k !== 'prison2'; }).map(function (k) { return '<div class="row"><b>' + ST_ICON[k] + ' ' + esc(ST_TXT[k].split(' : ')[0]) + '</b><p>' + esc(ST_TXT[k].split(' : ')[1] || '') + '</p></div>'; }).join('');
    return head('Règles', 'Tout ce qu’il faut savoir pour jouer.') +
      '<section class="panel rules"><h2>L’essentiel</h2><ul class="ess">' +
      '<li>Chaque joueur a un deck de <b>20 cartes</b> : 5 sur le terrain face cachée, 3 en main, le reste en pioche.</li>' +
      '<li>Au début, chacun choisit les <b>2 cartes de son terrain à retourner</b> ; elles sont révélées en même temps.</li>' +
      '<li>À ton tour, tu as <b>2 coups</b> (un seul au tout premier tour pour celui qui commence) : révéler, poser, remplacer, attaquer, utiliser une capacité, déplacer ou piocher.</li>' +
      '<li><b>Remplacer</b> : une carte de ta main prend la place d’une de tes cartes visibles, qui part au fond de ta pioche.</li>' +
      '<li>Une carte n’attaque qu’une fois par tour. Épiques, Légendaires et Mythiques ont une capacité, les Spéciales deux.</li>' +
      '<li>Tu gagnes quand l’adversaire n’a plus aucune carte : terrain, main et pioche vides.</li></ul>' +
      '<h2>Règles détaillées</h2>' + rows + '<h2>Statuts</h2>' + sts +
      abilityLists() + '</section>';
  }

  function renderHistory() {
    var h = load(histKey(), []);
    function bilan(kind) {
      var l = h.filter(function (x) { return x.kind === kind; }), w = l.filter(function (x) { return x.res === 'win'; }).length;
      return '<div><span>' + (kind === 'duel' ? 'Duel' : 'Amical') + '</span><b>' + w + ' V · ' + (l.length - w) + ' D</b><small>' + (l.length ? Math.round(w / l.length * 100) + ' % de victoires' : 'aucun combat') + '</small></div>';
    }
    var rows = h.slice(0, 25).map(function (x) {
      var d = new Date(x.t), when = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      var r = x.res === 'win' ? 'Victoire' : (x.res === 'draw' ? 'Nul' : 'Défaite');
      return '<div class="hrow ' + x.res + '"><b>' + r + '</b><span>' + (x.kind === 'duel' ? 'Duel ' + (LEVEL_FR[x.level] || '') : 'Amical') + ' · contre ' + esc(x.opp || '?') + '</span><span>' + x.turns + ' tours · ' + (x.elim || 0) + ' élim.</span><small>' + when + '</small></div>';
    }).join('') || '<p class="sub">Aucun combat pour l’instant.</p>';
    return head('Historique', 'Tes 40 derniers combats sur cet appareil.') +
      '<section class="panel"><div class="statline hist">' + bilan('duel') + bilan('online') + '</div>' + rows +
      (h.length ? '<button class="ghostbtn" data-act="clearhist" style="margin-top:14px">Effacer l’historique</button>' : '') + '</section>';
  }

  function renderSettings() {
    function seg(act, opts, cur) { return '<div class="seg">' + opts.map(function (o) { return '<button data-act="' + act + '" data-v="' + o[0] + '" class="' + (cur === o[0] ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div>'; }
    return head('Paramètres', 'Réglages enregistrés sur cet appareil.') +
      '<section class="panel setlist">' +
      '<div class="setrow"><div><b>Animations de combat</b><p class="sub">Frappes, éclairs, explosions… Désactive-les sur un appareil lent.</p></div>' + seg('fxset', [['1', 'Activées'], ['0', 'Désactivées']], UI.fxOn ? '1' : '0') + '</div>' +
      '<div class="setrow"><div><b>Vitesse de l’IA</b><p class="sub">Temps entre deux coups de l’IA en Duel.</p></div>' + seg('speed', [['normal', 'Normale'], ['fast', 'Rapide']], SET.speed) + '</div>' +
      '</section>';
  }

  function render() {
    syncIdentity();
    var root = document.getElementById('app');
    document.body.dataset.screen = UI.screen;
    if (UI.screen === 'game' && UI.st) { root.innerHTML = renderGame(); var lg = document.getElementById('log'); if (lg) lg.scrollTop = lg.scrollHeight; return; }
    var html = UI.screen === 'deck' ? renderDeck() : UI.screen === 'duel' ? renderDuel() : UI.screen === 'friendly' ? renderFriendly()
      : UI.screen === 'rules' ? renderRules() : UI.screen === 'ranks' ? renderRanks() : UI.screen === 'history' ? renderHistory() : UI.screen === 'settings' ? renderSettings() : renderMenu();
    root.innerHTML = html;
  }
  function go(screen) {
    removeModal('endmodal');
    if (UI.screen === 'game' && screen !== 'game' && isDuel() && UI.st && UI.st.over) { UI.st = null; UI.match = null; UI.busy = false; }
    UI.screen = screen; UI.limit = 60; resetSelection();
    render(); try { window.scrollTo(0, 0); } catch (e) {}
  }

  /* ---------- lancement d'un Duel ---------- */
  function aiDeck(level) {
    var idx = shuffle(POOL.map(function (_, i) { return i; })), pick;
    if (level === 'easy') {
      var W = { uncommon: 1, rare: 0.9, epic: 0.25 };
      pick = idx.filter(function (i) { return Math.random() < (W[POOL[i].rarity] || 0); });
    } else if (level === 'hard') {
      var H = { epic: 0.7, legendary: 1, mythic: 1, special: 0.7 };
      pick = idx.filter(function (i) { return Math.random() < (H[POOL[i].rarity] || 0); });
      pick = pick.filter(function (i) { return A.familyOfDef(POOL[i]); }).slice(0, 12).concat(pick);
    } else {
      pick = idx.filter(function (i) { return A.familyOfDef(POOL[i]); }).slice(0, 10).concat(idx);
    }
    var out = uniqueByName(pick.concat(idx));
    return out.slice(0, 20);
  }
  function startDuel() {
    var deck = deckIdx(UI.decks.active);
    if (deck.length !== 20) { toast('Ton deck doit compter 20 cartes.', true); return; }
    var lv = SET.level || 'normal';
    AI.level = lv === 'easy' ? 'easy' : 'normal';
    setSeat(0); UI.match = { kind: 'duel', level: lv, id: 'd' + Date.now().toString(36) }; UI.busy = false;
    UI.st = A.newGame({ pool: POOL, deck0: deck, deck1: aiDeck(lv), nom0: 'Vous', nom1: 'IA ' + LEVEL_FR[lv] });
    APPLY(UI.st, { type: 'setup', player: OP, uids: AI.chooseSetup(UI.st, OP) });
    UI.st.fx.length = 0;
    enterGame();
  }
  function enterGame() {
    removeModal('endmodal');
    UI.screen = 'game'; UI.endShown = false; resetSelection(); UI.inspect = null; UI.setupSel = []; UI.setupSent = false;
    render(); try { window.scrollTo(0, 0); } catch (e) {}
    if (UI.st.phase === 'setup') banner('Choisis 2 cartes à retourner', '#2b7fd6');
    else banner(UI.st.turnOwner === ME ? 'Vous commencez' : 'L’adversaire commence', UI.st.turnOwner === ME ? '#2b7fd6' : '#b0306a');
  }

  /* ================================================================== */
  /* Amical en ligne (salon Firebase rooms/{code}, jeu « arena », privé) */
  /* ================================================================== */
  var CODE_CH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function ser(st) {
    var p = st.pool, r = st.rng, f = st.fx, l = st.log;
    st.pool = null; st.rng = null; st.fx = []; st.log = l.slice(-80);
    var j = JSON.stringify(st);
    st.pool = p; st.rng = r; st.fx = f; st.log = l;
    return j;
  }
  // 🛡️ L'état reçu en ligne est écrit par l'adversaire : aucune chaîne ne doit pouvoir fermer un attribut ou ouvrir une balise.
  function scrub(v, d) {
    if (d > 12) return null;
    if (typeof v === 'string') return v.replace(/[<>"`]/g, '').slice(0, 400);
    if (Array.isArray(v)) return v.slice(0, 2000).map(function (x) { return scrub(x, d + 1); });
    if (v && typeof v === 'object') { var o = {}; Object.keys(v).slice(0, 2000).forEach(function (k) { if (k === '__proto__' || k === 'constructor' || k === 'prototype' || /[<>"`]/.test(k)) return; o[k] = scrub(v[k], d + 1); }); return o; }
    return typeof v === 'number' && !isFinite(v) ? 0 : v;
  }
  function deser(j) { var st = scrub(JSON.parse(j), 0); st.pool = POOL; st.rng = Math.random; st.fx = []; st.log = Array.isArray(st.log) ? st.log : []; return st; }
  function db() { try { return HOST && HOST.db(); } catch (e) { return null; } }
  function seatPlayer(m) { return { id: m.pid, name: String(m.name || 'Joueur').slice(0, 32), avatar: m.avatar || '', uid: m.uid || null, ready: true, isHost: false, arena: true, online: true, rank: rankLoad().pts }; }

  function netAttach(code, ref, isHost) {
    var m = me();
    UI.net = { code: code, ref: ref, pid: m.pid, isHost: isHost, room: null, matchId: null, v: 0, q: Promise.resolve(), wantRematch: false };
    UI.net.cb = ref.on('value', function (snap) { if (UI.net && UI.net.ref === ref) onRoom(snap.val()); }, function () { toast('Connexion au salon perdue.', true); });
  }
  function netCreate() {
    var D = db(), m = me(), deck = deckIdx(UI.decks.active);
    if (!D) return; if (deck.length !== 20) { toast('Ton deck doit compter 20 cartes.', true); return; }
    var tries = 0;
    (function attempt() {
      var code = ''; for (var i = 0; i < 4; i++) code += CODE_CH[Math.floor(Math.random() * CODE_CH.length)];
      var ref = D.ref('rooms/' + code);
      ref.once('value').then(function (snap) {
        if (snap.exists()) { if (++tries < 6) return attempt(); throw new Error('code'); }
        var p = seatPlayer(m); p.isHost = true;
        var room = { host: m.pid, game: 'arena', visibility: 'private', state: 'lobby', createdAt: Date.now(), lastActivity: Date.now(), maxPlayers: 2, chat: {},
          players: {}, arena: { decks: {} } };
        room.players[m.pid] = p; room.arena.decks[m.pid] = deck.map(function (i) { return KEY[i]; });
        return ref.set(room).then(function () {
          try { ref.onDisconnect().remove(); } catch (e) {}
          netAttach(code, ref, true); render();
        });
      }).catch(function () { toast('Impossible de créer le salon. Réessaie.', true); });
    })();
  }
  function netJoin(code) {
    var D = db(), m = me(), deck = deckIdx(UI.decks.active);
    code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!D) { toast('Mode Amical indisponible ici.', true); return; }
    if (!/^[A-Z0-9]{4}$/.test(code)) { toast('Le code fait 4 caractères.', true); return; }
    if (UI.net && UI.net.code === code) { go('friendly'); return; }
    if (UI.net) netLeave();
    var ref = D.ref('rooms/' + code);
    ref.once('value').then(function (snap) {
      var r = snap.val();
      if (!r) { toast('Salon introuvable.', true); return; }
      if (r.game !== 'arena') { toast('Ce code correspond à un autre jeu du site.', true); return; }
      var players = r.players || {}, ids = Object.keys(players), inside = !!players[m.pid];
      if (!inside && ids.length >= 2) { toast('Ce salon est complet.', true); return; }
      if (!inside && r.state !== 'lobby') { toast('La partie a déjà commencé.', true); return; }
      if (!inside && deck.length !== 20) { UI.joinCode = code; go('friendly'); toast('Ton deck de combat doit compter 20 cartes.', true); return; }
      var up = { lastActivity: Date.now() };
      if (!inside) { up['players/' + m.pid] = seatPlayer(m); up['arena/decks/' + m.pid] = deck.map(function (i) { return KEY[i]; }); }
      else up['players/' + m.pid + '/online'] = true;
      return ref.update(up).then(function () {
        if (r.state === 'lobby') { try { ref.child('players/' + m.pid).onDisconnect().remove(); ref.child('arena/decks/' + m.pid).onDisconnect().remove(); } catch (e) {} }
        else { try { ref.child('players/' + m.pid + '/online').onDisconnect().set(false); } catch (e) {} }
        netAttach(code, ref, r.host === m.pid);
        UI.screen = 'friendly'; render();
      });
    }).catch(function () { toast('Impossible de rejoindre ce salon.', true); });
  }
  function netSendDeck() {
    var N = UI.net; if (!N || !N.room || N.room.state !== 'lobby') return;
    var deck = deckIdx(UI.decks.active);
    N.ref.child('arena/decks/' + N.pid).set(deck.length === 20 ? deck.map(function (i) { return KEY[i]; }) : null).catch(function () {});
  }
  function newMatch(room) {
    var N = UI.net, ids = Object.keys(room.players || {}), host = room.host, guest = ids.filter(function (id) { return id !== host; })[0];
    var decks = (room.arena && room.arena.decks) || {};
    var d0 = keysToIdx(decks[host]), d1 = keysToIdx(decks[guest]);
    if (d0.length !== 20 || d1.length !== 20) { toast('Les deux decks doivent compter 20 cartes.', true); return; }
    var st = A.newGame({ pool: POOL, deck0: d0, deck1: d1, nom0: (room.players[host] || {}).name || 'Hôte', nom1: (room.players[guest] || {}).name || 'Invité' });
    st.fx.length = 0;
    var ratings = {}; ratings[host] = Number((room.players[host] || {}).rank) || ELO_START; ratings[guest] = Number((room.players[guest] || {}).rank) || ELO_START;
    var match = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), v: 1, st: ser(st), fx: '[]', by: N.pid, seats: [host, guest], at: Date.now(),
      ranked: !!(room.arena && room.arena.ranked), ratings: ratings };
    N.ref.update({ 'arena/match': match, 'arena/rematch': null, state: 'playing', lastActivity: Date.now() }).catch(function () { toast('Lancement impossible.', true); });
  }
  function netPush(evs) {
    var N = UI.net; if (!N || !N.matchId) return;
    N.v += 1;
    var up = {};
    up['arena/match/v'] = N.v; up['arena/match/st'] = ser(UI.st); up['arena/match/fx'] = JSON.stringify(evs); up['arena/match/by'] = N.pid; up['arena/match/at'] = Date.now();
    up.lastActivity = Date.now();
    if (UI.st.over) up.state = 'ended';
    N.ref.update(up).catch(function () { toast('Coup non envoyé : vérifie ta connexion.', true); });
  }
  function onRoom(room) {
    var N = UI.net; if (!N) return;
    if (!room) {
      if (UI.st && isOnline() && !UI.st.over) { UI.st.over = { winner: ME, reason: 'L’adversaire a quitté le salon.' }; render(); setTimeout(showEnd, 300); }
      else { toast('Le salon a été fermé.'); }
      netReset(); if (UI.screen === 'friendly') render();
      return;
    }
    N.room = room;
    var a = room.arena || {}, m = a.match;
    if (m && m.id !== N.matchId) {
      var seat = m.seats && m.seats[0] === N.pid ? 0 : (m.seats && m.seats[1] === N.pid ? 1 : -1);
      if (seat < 0) { toast('Tu ne fais pas partie de cette partie.', true); return; }
      N.matchId = m.id; N.v = m.v; N.wantRematch = false;
      try { N.ref.onDisconnect().cancel(); N.ref.child('players/' + N.pid).onDisconnect().cancel(); N.ref.child('arena/decks/' + N.pid).onDisconnect().cancel(); } catch (e) {}
      try { N.ref.child('players/' + N.pid + '/online').onDisconnect().set(false); } catch (e) {}
      setSeat(seat); UI.match = { kind: 'online' }; UI.busy = false;
      UI.st = deser(m.st);
      enterGame();
      if (UI.st.over) setTimeout(showEnd, 400);
      return;
    }
    if (m && m.v > N.v) {
      N.v = m.v;
      if (m.by !== N.pid) {
        var snapshot = { st: m.st, fx: m.fx };
        N.q = N.q.then(function () { return applyRemote(snapshot); }).catch(function () {});
      }
    }
    if (m && N.isHost && UI.st && UI.st.phase === 'setup' && m.setup && m.setup[0] && m.setup[1] && !N.setupBusy) {
      N.setupBusy = true;
      var s0 = [].concat(m.setup[0]), s1 = [].concat(m.setup[1]);
      N.q = N.q.then(function () {
        if (!UI.st || UI.st.phase !== 'setup') return;
        APPLY(UI.st, { type: 'setup', player: 0, uids: s0 }); UI.st.fx.length = 0;
        return run({ type: 'setup', player: 1, uids: s1 }).then(function (res) {
          if (res.ok) { resetSelection(); render(); turnBanner(); }
        });
      }).catch(function () {}).then(function () { N.setupBusy = false; });
    }
    if (m && m.forfeit && UI.st && !UI.st.over) {
      var loser = m.seats[0] === m.forfeit ? 0 : 1;
      UI.st.over = { winner: 1 - loser, reason: UI.st.players[loser].nom + ' a abandonné.' };
      resetSelection(); render(); setTimeout(showEnd, 300);
    }
    if (m && a.rematch && N.isHost && UI.st && UI.st.over) {
      var ids = Object.keys(room.players || {});
      if (ids.length === 2 && ids.every(function (id) { return a.rematch[id]; })) newMatch(room);
    }
    if (UI.screen === 'friendly') render();
    if (UI.screen === 'game') { var oc = document.getElementById('oppstatus'); if (oc) oc.outerHTML = oppStatus(); }
  }
  function applyRemote(snap) {
    if (!UI.st) return Promise.resolve();
    var ghosts = snapshotGhosts(), turnBefore = UI.st.turnOwner, evs = [];
    try { evs = scrub(JSON.parse(snap.fx || '[]'), 0); if (!Array.isArray(evs)) evs = []; } catch (e) { evs = []; }
    UI.st = deser(snap.st);
    if (UI.st.turnOwner !== ME || UI.st.over) resetSelection();
    if (UI.inspect && !UI.st.cards[UI.inspect]) UI.inspect = null;
    if (UI.screen !== 'game') return Promise.resolve();
    return playEvents(evs, ghosts).then(function () {
      if (UI.st.turnOwner !== turnBefore && !UI.st.over) turnBanner();
      render();
      if (UI.st.over) setTimeout(showEnd, 420);
    });
  }
  function oppStatus() {
    var N = UI.net, room = N && N.room, txt = '';
    if (room && room.players) {
      var opp = Object.keys(room.players).filter(function (id) { return id !== N.pid; })[0], p = opp && room.players[opp];
      if (!p) txt = '<span class="oppst off">adversaire parti</span>';
      else if (p.online === false) txt = '<span class="oppst off">adversaire hors ligne</span>';
      else txt = '<span class="oppst">adversaire en ligne</span>';
    }
    return '<span id="oppstatus">' + txt + '</span>';
  }
  function netForfeit() {
    var N = UI.net; if (!N || !N.matchId) return;
    N.ref.child('arena/match/forfeit').set(N.pid).catch(function () {});
    N.ref.update({ state: 'ended', lastActivity: Date.now() }).catch(function () {});
  }
  function netReset() { var N = UI.net; if (N) { try { N.ref.off('value', N.cb); } catch (e) {} } UI.net = null; if (isOnline()) { UI.match = null; } }
  function netLeave() {
    var N = UI.net; if (!N) return;
    var room = N.room || {}, ids = Object.keys(room.players || {});
    if (UI.st && isOnline() && !UI.st.over) netForfeit();
    var others = ids.filter(function (id) { return id !== N.pid && room.players[id] && room.players[id].online !== false; });
    try { N.ref.off('value', N.cb); } catch (e) {}
    if ((N.isHost && room.state === 'lobby') || !others.length) N.ref.remove().catch(function () {});
    else { var up = { lastActivity: Date.now() }; up['players/' + N.pid] = null; if (room.state === 'lobby') up['arena/decks/' + N.pid] = null; N.ref.update(up).catch(function () {}); }
    try { N.ref.onDisconnect().cancel(); } catch (e) {}
    UI.net = null;
    if (isOnline()) { UI.st = null; UI.match = null; }
  }
  function copy(text, ok) {
    var done = function () { toast(ok); };
    try { navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); }); } catch (e) { fallbackCopy(text); done(); }
  }
  function fallbackCopy(text) { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} t.remove(); }
  function shareLink(code) {
    var base = '';
    try { base = window.parent.location.origin + window.parent.location.pathname; } catch (e) { base = location.origin + location.pathname.replace(/arena\/.*$/, ''); }
    return base + '?arena=' + code;
  }

  function openRules() {
    var rows = A.RULES.filter(function (r) { return r.id !== 'familles'; }).map(function (r) {
      return '<div class="row"><b>' + esc(r.titre) + '<span class="badge-etat ' + (r.etat === 'cahier' ? 'cahier' : 'proposition') + '">' + (r.etat === 'cahier' ? 'cahier' : 'proposition') + '</span></b><p>' + esc(r.texte) + '</p></div>';
    }).join('');
    var interp = A.INTERPRETATIONS.map(function (r) { return '<div class="row"><b>' + esc(r.sujet) + '</b><p>' + esc(r.texte) + '</p></div>'; }).join('');
    var box0 = document.createElement('div'); box0.className = 'modal'; box0.id = 'rulesmodal';
    box0.innerHTML = '<div class="box"><h2>Règles implémentées</h2><p class="sub">Les points non tranchés sont marqués <span class="badge-etat proposition">proposition</span>.</p>' + rows +
      '<div class="rules">' + abilityLists() + '</div>' +
      '<h2 style="margin-top:24px;font-size:21px">Interprétations</h2>' + interp +
      '<div style="margin-top:20px;text-align:right"><button class="ghostbtn" data-act="closemodal">Fermer</button></div></div>';
    document.body.appendChild(box0);
  }

  /* ---------- événements ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.dataset.act;
    if (act === 'closemodal') { removeModal('rulesmodal'); return; }
    if (act === 'closesheet') { removeModal('sheetmodal'); return; }
    if (act === 'sheet') { if (el.dataset.uid) sheetForUid(parseInt(el.dataset.uid, 10)); else sheetForPool(parseInt(el.dataset.i, 10)); return; }
    if (act === 'deckrow') return;
    if (e.target.closest('#endmodal') && ['again', 'go', 'rematch', 'netleave'].indexOf(act) < 0) return;

    if (act === 'go') { go(el.dataset.s); return; }
    if (act === 'resume') { if (UI.st) { UI.screen = 'game'; render(); } return; }
    /* decks */
    if (act === 'editdeck') { UI.editing = parseInt(el.dataset.n, 10); render(); return; }
    if (act === 'setactive' || act === 'pickactive') { UI.decks.active = parseInt(el.dataset.n, 10); saveDecks(); netSendDeck(); render(); return; }
    if (act === 'pick') {
      var i = parseInt(el.dataset.i, 10), deck = deckIdx(UI.editing), pos = deck.indexOf(i);
      if (pos >= 0) deck.splice(pos, 1);
      else if (deck.length >= 20) { toast('20 cartes maximum : retire-en une d’abord.', true); return; }
      else if (deck.some(function (k) { return norm(POOL[k].name) === norm(POOL[i].name); })) { toast('Ce personnage est déjà dans le deck.', true); return; }
      else deck.push(i);
      setDeckIdx(UI.editing, deck); render(); return;
    }
    if (act === 'remove') { var d2 = deckIdx(UI.editing); d2.splice(parseInt(el.dataset.i, 10), 1); setDeckIdx(UI.editing, d2); render(); return; }
    if (act === 'clear') { setDeckIdx(UI.editing, []); render(); return; }
    if (act === 'autodeck') { var ad = autoDeck(UI.colMode === 'mine'); if (ad.length < 20) toast('Pas assez de cartes éligibles : ' + ad.length + '/20.', true); setDeckIdx(UI.editing, ad); render(); return; }
    if (act === 'random') {
      var om = UI.colMode === 'mine' ? ownedMap() : null;
      setDeckIdx(UI.editing, uniqueByName(shuffle(POOL.map(function (_, k) { return k; }).filter(function (k) { return isOwned(k, om); }))).slice(0, 20)); render(); return;
    }
    if (act === 'colmode') { UI.colMode = el.dataset.v; UI.limit = 60; render(); return; }
    if (act === 'rarity') { UI.rarity = el.dataset.r; UI.limit = 60; render(); return; }
    if (act === 'more') { UI.limit += 120; render(); return; }
    /* réglages */
    if (act === 'fxset') { UI.fxOn = SET.fx = el.dataset.v === '1'; saveSet(); render(); return; }
    if (act === 'speed') { SET.speed = el.dataset.v; saveSet(); render(); return; }
    if (act === 'level') { SET.level = el.dataset.v; saveSet(); render(); return; }
    if (act === 'clearhist') { save(histKey(), []); render(); return; }
    /* duel */
    if (act === 'startduel') { startDuel(); return; }
    if (act === 'again') { removeModal('endmodal'); if (isOnline()) return; startDuel(); return; }
    /* amical */
    if (act === 'netcreate') { netCreate(); return; }
    if (act === 'netjoin') { var inp = document.getElementById('joincode'); netJoin(inp ? inp.value : ''); return; }
    if (act === 'toggleranked') { if (UI.net && UI.net.isHost && UI.net.room) UI.net.ref.child('arena/ranked').set(!(UI.net.room.arena && UI.net.room.arena.ranked)).catch(function () {}); return; }
    if (act === 'netstart') { if (UI.net && UI.net.room) newMatch(UI.net.room); return; }
    if (act === 'netleave') { netLeave(); go('friendly'); return; }
    if (act === 'copycode') { if (UI.net) copy(UI.net.code, 'Code copié.'); return; }
    if (act === 'copylink') { if (UI.net) copy(shareLink(UI.net.code), 'Lien copié.'); return; }
    if (act === 'invite') { if (UI.net && HOST && HOST.invite) HOST.invite(UI.net.code); return; }
    if (act === 'rematch') {
      if (!UI.net) return; UI.net.wantRematch = true; el.textContent = 'En attente de l’adversaire…'; el.disabled = true;
      UI.net.ref.child('arena/rematch/' + UI.net.pid).set(true).catch(function () {}); return;
    }
    if (act === 'rules') { openRules(); return; }
    if (act === 'forfeit') {
      if (!UI.st || UI.st.over) return;
      if (!el.classList.contains('confirm')) { el.classList.add('confirm'); el.textContent = 'Confirmer l’abandon'; setTimeout(function () { if (el.isConnected) { el.classList.remove('confirm'); el.textContent = 'Abandonner'; } }, 3000); return; }
      if (isOnline()) { netForfeit(); return; }
      UI.st.over = { winner: OP, reason: 'Vous avez abandonné.' }; UI.busy = false; resetSelection(); render(); setTimeout(showEnd, 200); return;
    }

    if (!UI.st || UI.st.over || UI.screen !== 'game') return;
    if (UI.anim) return;
    if (UI.st.phase === 'setup') {
      if (act === 'setupok') { confirmSetup(); return; }
      if (act === 'card') {
        var su = parseInt(el.dataset.uid, 10), so = parseInt(el.dataset.owner, 10);
        UI.inspect = su;
        if (so === ME && !setupDone()) {
          var k = UI.setupSel.indexOf(su);
          if (k >= 0) UI.setupSel.splice(k, 1);
          else { if (UI.setupSel.length >= 2) UI.setupSel.shift(); UI.setupSel.push(su); }
        }
        render();
      }
      return;
    }
    if (act === 'card' && UI.mode === 'idle' && UI.st.turnOwner !== ME) { UI.inspect = el.dataset.uid ? parseInt(el.dataset.uid, 10) : UI.inspect; render(); return; }
    if (UI.st.turnOwner !== ME) { toast('C’est au tour de l’adversaire.', true); return; }

    if (act === 'end') { resetSelection(); doAction({ type: 'endTurn' }); return; }
    if (act === 'draw') { doAction({ type: 'draw' }); return; }
    if (act === 'deselect' || act === 'cancel') { resetSelection(); render(); return; }

    if (act === 'card' || act === 'cell') {
      var owner = parseInt(el.dataset.owner, 10), slot = parseInt(el.dataset.slot, 10);
      var uid = el.dataset.uid ? parseInt(el.dataset.uid, 10) : UI.st.players[owner].terrain[slot];
      var T = currentTargets();
      if (UI.mode === 'ability' && UI.pending) {
        if (T.kind === 'cell') {
          if (T.cells.has(owner + ':' + slot)) doAction({ type: 'ability', uid: UI.sel.uid, key: UI.pending.key, cell: { owner: owner, slot: slot } });
          else toast('Case invalide.', true);
          return;
        }
        if (!uid || !T.uids.has(uid)) { toast('Cible invalide.', true); return; }
        if (UI.pending.cible === 'allie-puis-ennemi' && !UI.pending.stage1) { UI.pending.stage1 = uid; render(); return; }
        if (UI.pending.stage1) doAction({ type: 'ability', uid: UI.sel.uid, key: UI.pending.key, target: UI.pending.stage1, target2: uid });
        else doAction({ type: 'ability', uid: UI.sel.uid, key: UI.pending.key, target: uid });
        return;
      }
      if (act === 'cell') {
        if (UI.mode === 'place' && UI.sel) doAction({ type: 'place', handIndex: UI.sel.index, slot: slot });
        else if (UI.mode === 'move' && UI.sel) doAction({ type: 'moveSingle', uid: UI.sel.uid, slot: slot });
        return;
      }
      if (UI.mode === 'place' && UI.sel && UI.sel.index != null && owner === ME && uid) {
        if (UI.st.cards[uid].faceUp) doAction({ type: 'replace', handIndex: UI.sel.index, slot: slot });
        else toast('Seule une carte visible peut être remplacée.', true);
        return;
      }
      if (UI.mode === 'attack') {
        if (T.uids.has(uid)) doAction({ type: 'attack', attacker: UI.sel.uid, target: uid }); else toast('Cible invalide.', true);
        return;
      }
      if (UI.mode === 'move') {
        if (owner !== ME) { toast('Seules vos cartes se déplacent.', true); return; }
        if (uid === UI.sel.uid) { resetSelection(); render(); return; }
        doAction({ type: 'moveSwap', a: UI.sel.uid, b: uid }); return;
      }
      UI.inspect = uid; UI.sel = { uid: uid }; UI.mode = 'idle'; render(); return;
    }
    if (UI.st.refill) {
      var R2 = UI.st.refill;
      if (act === 'hand') { doAction({ type: 'refill', slot: R2.slots[0], from: 'hand', handIndex: parseInt(el.dataset.i, 10) }); return; }
      if (act === 'refilldeck') { doAction({ type: 'refill', slot: R2.slots[0], from: 'deck' }); return; }
      if (act === 'card') { UI.inspect = parseInt(el.dataset.uid, 10); render(); return; }
      toast('Remplis d’abord ta case vide : carte de ta main ou de la pioche.', true); return;
    }
    if (act === 'hand') {
      var hi = parseInt(el.dataset.i, 10);
      UI.sel = { index: hi, uid: null }; UI.inspect = UI.st.players[ME].hand[hi]; UI.mode = 'place'; render(); return;
    }
    if (act === 'reveal' && UI.sel && UI.sel.uid) { doAction({ type: 'reveal', uid: UI.sel.uid }); return; }
    if (act === 'toattack') { UI.mode = 'attack'; render(); return; }
    if (act === 'tomove') { UI.mode = 'move'; render(); return; }
    if (act === 'ability' && UI.sel && UI.sel.uid) {
      var key = el.dataset.key, ab = null;
      A.abilitiesOf(UI.st, UI.sel.uid).forEach(function (a) { if (a.key === key) ab = a; });
      if (!ab) return;
      if (ab.cible === 'ennemi' || ab.cible === 'allie' || ab.cible === 'case' || ab.cible === 'ennemi-cache' || ab.cible === 'allie-puis-ennemi') {
        UI.pending = { key: key, nom: ab.nom, cible: ab.cible, stage1: null }; UI.mode = 'ability'; render();
        var T2 = currentTargets();
        if (!T2.uids.size && !T2.cells.size) toast('Aucune cible possible pour ' + ab.nom + ' pour l’instant.', true);
      } else doAction({ type: 'ability', uid: UI.sel.uid, key: key });
      return;
    }
  });

  document.addEventListener('input', function (e) {
    if (e.target.id === 'q') {
      UI.search = e.target.value; UI.limit = 60;
      var pos = e.target.selectionStart; render();
      var q2 = document.getElementById('q'); if (q2) { q2.focus(); q2.setSelectionRange(pos, pos); }
    }
    if (e.target.id === 'joincode') { var v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4); if (v !== e.target.value) e.target.value = v; UI.joinCode = v; }
  });
  document.addEventListener('change', function (e) {
    if (e.target.id === 'series') { UI.series = e.target.value; UI.limit = 60; render(); }
    if (e.target.id === 'deckname') { UI.decks.decks[UI.editing].name = (e.target.value.trim() || ('Deck ' + (UI.editing + 1))).slice(0, 24); saveDecks(); render(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.getElementById('sheetmodal')) { removeModal('sheetmodal'); return; }
    if (e.key === 'Escape' && !UI.anim) { removeModal('rulesmodal'); resetSelection(); if (UI.screen === 'game') render(); }
    if (e.key === 'Enter' && e.target && e.target.id === 'joincode') { netJoin(e.target.value); }
  });
  window.addEventListener('pagehide', function () { if (UI.net && UI.net.room && UI.net.room.state === 'lobby' && UI.net.isHost) { try { UI.net.ref.remove(); } catch (e) {} } });

  /* ---------- API pour le site ---------- */
  window.ArenaApp = {
    join: function (code) { syncIdentity(); netJoin(code); },
    open: function (screen) { go(screen || 'menu'); },
    refresh: function () { SITEID = null; if (UI.screen !== 'game') render(); }
  };
  window.addEventListener('error', function (e) { toast('Erreur : ' + e.message, true); });
  UI.render = render;
  UI.rankLogo = rankLogo;
  UI.showEnd = showEnd;
  UI.doAction = doAction;
  UI.isAnimating = function () { return UI.anim || UI.busy; };
  window.__ARENA_UI = UI;
  UI.screen = 'menu';
  render();
  try { if (HOST && HOST.ready) HOST.ready(); } catch (e) {}
})();
