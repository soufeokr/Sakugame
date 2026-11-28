/* Sakugame (version test) — Arena dans le site.
   • Ajoute l'écran Arena (iframe arena/index.html) et l'entrée « Arena » du menu et de l'accueil Cartes.
   • Pont window.sakuArenaBridge lu par Arena : compte, collection, catalogue, base Firebase, invitations.
   • Lien direct : ?arena=CODE ouvre Arena et rejoint le salon Amical.
   • Onglet « Arena » dans la fiche des cartes (Collection, Encyclopédie) : stats et capacités de combat. */
(function () {
  'use strict';
  const SRC = 'arena/index.html?v=3a241314';
  let pending = null, cardIndex = null;
  const $ = id => document.getElementById(id);
  function frame() { return $('arenaFrame'); }
  function app() { try { const f = frame(); return f && f.contentWindow && f.contentWindow.ArenaApp; } catch (e) { return null; } }
  function guestId() {
    let id = null;
    try { id = JSON.parse(localStorage.getItem('sakuArena:guest') || 'null'); } catch (e) {}
    if (!id) { id = 'g' + Math.random().toString(36).slice(2, 12); try { localStorage.setItem('sakuArena:guest', JSON.stringify(id)); } catch (e) {} }
    return id;
  }

  window.sakuArenaBridge = {
    me() {
      let id = null, name = '', avatar = '';
      try { id = typeof sakuMyDcId === 'function' ? sakuMyDcId() : null; } catch (e) {}
      try { name = typeof playerName === 'string' ? playerName : ''; } catch (e) {}
      try { avatar = (typeof myAvatar === 'function' && myAvatar()) || ''; } catch (e) {}
      return { pid: id || guestId(), uid: id, name: name || 'Joueur', avatar: avatar, signedIn: !!id };
    },
    owned() { try { return (typeof cardState !== 'undefined' && cardState && cardState.cards) || null; } catch (e) { return null; } },
    catalogue() { try { return window.sakuMarket ? window.sakuMarket.list() : []; } catch (e) { return []; } },
    db() { try { return typeof database !== 'undefined' ? database : null; } catch (e) { return null; } },
    // Visuels officiels des cartes (même rendu que la collection) : SVG avec l'image déjà chargée.
    cardSvg(id) {
      try {
        const list = window.sakuMarket ? window.sakuMarket.list() : [];
        if (!cardIndex || cardIndex.n !== list.length) { cardIndex = { n: list.length, map: new Map(list.map(c => [String(c.id), c])) }; }
        const c = cardIndex.map.get(String(id));
        if (!c) return null;
        let svg = '';
        if ((c.edition === 'strongest' || c.edition === 'hoshi') && window.sakuStrongestCard) svg = window.sakuStrongestCard(c, true);
        else if (window.sakuBasicCard) svg = window.sakuBasicCard(c, true, { image: typeof cardThumb === 'function' ? cardThumb(c.image) : c.image, level: 0 });
        return svg ? svg.replace(/data-saku-src=/g, 'href=') : null;
      } catch (e) { return null; }
    },
    backSvg() { try { return window.sakuBasicBack ? window.sakuBasicBack() : null; } catch (e) { return null; } },
    invite(code) { if (window.sakuRoomInviteOpen) window.sakuRoomInviteOpen(code, 'arena'); },
    notify(msg) { if (typeof showNotification === 'function') showNotification(msg); },
    ready() { if (pending) { const c = pending; pending = null; const a = app(); if (a && a.join) a.join(c); } }
  };

  function navInset() {
    const nav = $('mobilePrimaryNav');
    if (!nav) return 0;
    const r = nav.getBoundingClientRect();
    if (!r.height || getComputedStyle(nav).display === 'none' || getComputedStyle(nav).visibility === 'hidden') return 0;
    return r.top < window.innerHeight && r.bottom >= window.innerHeight - 2 ? Math.round(window.innerHeight - r.top) : 0;
  }
  function fit() {
    const inset = navInset();
    document.documentElement.style.setProperty('--saku-nav-inset', inset + 'px');
    const f = frame(); if (!f || !f.offsetParent) return;
    const top = Math.max(0, f.getBoundingClientRect().top + window.scrollY);
    f.style.height = Math.max(420, window.innerHeight - top - inset) + 'px';
  }
  function open(code) {
    if (typeof showScreen !== 'function') return;
    showScreen('arenaScreen');
    markNav(true);
    window.scrollTo(0, 0);
    const f = frame();
    if (f && !f.getAttribute('src')) f.setAttribute('src', SRC);
    requestAnimationFrame(fit);
    if (code) { const a = app(); if (a && a.join) a.join(code); else pending = code; }
    else { const a = app(); if (a && a.refresh) a.refresh(); }
  }
  // Barre du bas (téléphone) : le bouton Arena est mis en avant tant que l'écran Arena est ouvert.
  function markNav(on) {
    document.querySelectorAll('#mobilePrimaryNav [data-mobile-destination]').forEach(b => {
      if (b.dataset.mobileDestination === 'arena') { if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); }
      else if (on) b.removeAttribute('aria-current');
    });
  }
  document.addEventListener('saku-screen-show', e => { if (e.detail !== 'arenaScreen') markNav(false); });
  window.sakuArenaOpen = open;
  window.sakuArenaJoin = code => open(String(code || '').toUpperCase());
  window.addEventListener('resize', fit);

  const navGo = window.sakuNavGo;
  if (typeof navGo === 'function') {
    window.sakuNavGo = function (destination) {
      if (destination === 'arena') { if (typeof sakuNavClose === 'function') sakuNavClose(false); open(); return; }
      return navGo.apply(this, arguments);
    };
  }


  /* ---------- Onglet Arena dans la fiche des cartes (Collection et Encyclopédie) ---------- */
  const ARENA_V = '3a241314';
  let engineP = null, arenaIdx = null, arenaTabOn = false;
  const RAR_FR = { uncommon: 'Uncommon', rare: 'Rare', epic: 'Épique', legendary: 'Légendaire', mythic: 'Mythique', special: 'Spéciale' };
  const RAR_COL = { uncommon: '#6fd08c', rare: '#58a8ff', epic: '#b47cff', legendary: '#ffbf3c', mythic: '#ff5a8a', special: '#7ff3ff' };
  const PROFIL_FR = { equilibre: 'équilibré', frappeur: 'frappeur', colosse: 'colosse', rapide: 'rapide', soutien: 'soutien', resistant: 'résistant', offensif: 'offensif', pilote: 'pilote', polyvalent: 'polyvalent', mage: 'mage', technique: 'technique', explosif: 'explosif', regeneration: 'régénération' };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  function loadScript(src) {
    return new Promise((res, rej) => { const el = document.createElement('script'); el.src = src; el.onload = res; el.onerror = rej; document.head.appendChild(el); });
  }
  // Moteur Arena chargé à la demande (premier clic sur l'onglet) : cartes, signatures, règles.
  function arenaEngine() {
    if (window.Arena && window.Arena.passivesFor && window.ARENA_CARDS) return Promise.resolve(window.Arena);
    if (!engineP) {
      engineP = loadScript('arena/cards.js?v=' + ARENA_V)
        .then(() => loadScript('arena/signatures.js?v=' + ARENA_V))
        .then(() => loadScript('arena/engine.js?v=' + ARENA_V))
        .then(() => { if (!window.Arena || !window.ARENA_CARDS) throw new Error('arena'); return window.Arena; })
        .catch(e => { engineP = null; throw e; });
    }
    return engineP;
  }
  /* Même personnage, noms écrits autrement selon la source : ordre des mots (Nico Robin / Robin Nico),
     romanisation (Souryuu / Soryu), titre de série japonais ou anglais (Hagane no Renkinjutsushi / Fullmetal Alchemist).
     Prudence : un homonyme d'une autre œuvre (Kojiro Sasaki de Vagabond) ne doit pas recevoir la fiche d'un autre. */
  const rom = s => norm(s).replace(/ou/g, 'o').replace(/uu/g, 'u').replace(/oo/g, 'o');
  const toks = s => rom(s).split(' ').filter(Boolean).sort();
  const SERIES_STOP = { the: 1, no: 1, of: 1, and: 1, tv: 1, season: 1, movie: 1, film: 1, shin: 1, seiki: 1, part: 1, arc: 1 };
  const seriesToks = s => rom(s).split(' ').filter(t => t.length > 2 && !SERIES_STOP[t] && !/^\d+$/.test(t));
  let seriesAlias = null;
  // Titres équivalents appris du catalogue : au moins deux personnages différents, au nom identique et unique dans Arena, les relient.
  function learnSeriesAlias() {
    seriesAlias = {};
    let pool = null;
    try { if (typeof cardBuildPool === 'function') cardBuildPool(); pool = typeof cardPoolById !== 'undefined' && cardPoolById ? Object.values(cardPoolById) : null; } catch (e) { pool = null; }
    if (!pool) return;
    const byTok = {};
    arenaIdx.list.forEach(x => { const k = x.t.join(' '); (byTok[k] = byTok[k] || []).push(x.d); });
    const seen = {};
    pool.forEach(e => {
      const t = toks(e.name); if (!t.length || (t.length === 1 && t[0].length < 4)) return;
      const m = byTok[t.join(' ')]; if (!m || m.length !== 1) return;
      const pair = rom(e.series) + '|' + rom(m[0].series), who = t.join(' ');
      (seen[pair] = seen[pair] || {})[who] = 1;
    });
    // Œuvres peuplées de figures historiques ou mythologiques (Jack l'Éventreur, Nikola Tesla…) : homonymes, pas mêmes personnages.
    const HIST = /\b(fate|ragnarok|valkyrie|drifters)\b/;
    Object.keys(seen).forEach(k => { if (Object.keys(seen[k]).length >= 2 && !HIST.test(k)) seriesAlias[k] = 1; });
  }
  /* Titres d'une même œuvre que l'apprentissage ne relie pas (trop peu de personnages communs) :
     début du titre côté site → début du titre côté Arena. */
  const SERIES_ALIAS = [
    ['Shingeki no Kyojin', 'Attack on Titan'], ['Kimetsu no Yaiba', 'Demon Slayer'], ['Shuumatsu no Valkyrie', 'Record of Ragnarok'],
    ['Kara no Kyoukai', 'the Garden of sinners'], ['Ginga Eiyuu Densetsu', 'Legend of the Galactic Heroes'], ['The Future Diary', 'Mirai Nikki'],
    ['Pandora Hearts', 'PandoraHearts'], ['Mahouka Koukou no Rettousei', 'The Irregular at Magic High School'], ['Nisemonogatari', 'Monogatari'],
    ['Bakemonogatari', 'Monogatari'], ['Hataraku Maou-sama', 'The Devil is a Part-Timer'], ['Kyoukai no Kanata', 'Beyond the Boundary'],
    ['Rakudai Kishi no Cavalry', 'Chivalry of a Failed Knight'], ['Kekkai Sensen', 'Blood Blockade Battlefront'], ['Saga of Tanya the Evil', 'Youjo Senki'],
    ['Shuumatsu Nani Shitemasu ka', 'WorldEnd'], ['Kumo desu ga, Nani ka', 'So I\'m a Spider, So What'], ['Houseki no Kuni', 'Land of the Lustrous'],
    ['Tenkuu Shinpan', 'High-Rise Invasion'], ['Fumetsu no Anata e', 'To Your Eternity'], ['Maou Gakuin no Futekigousha', 'The Misfit of Demon King Academy'],
    ['Tantei wa mou, Shindeiru', 'The Detective Is Already Dead'], ['TSUKIMICHI', 'Tsuki ga Michibiku']
  ].map(x => [rom(x[0]), rom(x[1])]);
  /* Même nom pour deux personnages d'une même série (romanisations inversées entre le site et Arena). */
  const CARD_ALIAS = [
    ['jousuke higashikata', 'diamond wa kudakenai', 'Josuke Higashikata'],   // Partie 4 : Crazy Diamond
    ['josuke higashikata', 'jojolion', 'Jousuke Higashikata'],               // Partie 8 : Soft & Wet
    ['sung jin woo', 'ore dake level up', 'Jin-U Seong'],
    ['yoo mi ra', 'god of high school', 'Mi-Ra Yu']
  ].map(x => [x[0], rom(x[1]), x[2]]);
  function seriesNear(arenaSeries, siteSeries) {
    const x = seriesToks(arenaSeries), y = seriesToks(siteSeries);
    if (x.some(t => y.indexOf(t) >= 0)) return true;
    const rs = rom(siteSeries), ra = rom(arenaSeries);
    if (SERIES_ALIAS.some(p => rs.indexOf(p[0]) === 0 && ra.indexOf(p[1]) === 0)) return true;
    if (!seriesAlias) learnSeriesAlias();
    return !!seriesAlias[rs + '|' + ra];
  }
  /* Choix parmi des candidats : la même rareté d'abord (Gojo Mythique ≠ Gojo Spéciale). */
  function pickRarity(list, rarity, strict) {
    if (!list.length) return null;
    if (rarity) {
      const same = list.filter(d => d.rarity === rarity);
      if (same.length) return same.length === 1 ? same[0] : 'amb';
      if (strict) return null;
    }
    return list.length === 1 ? list[0] : 'amb';
  }
  function arenaDefFor(name, series, rarity, strict) {
    if (!arenaIdx) {
      arenaIdx = { ns: {}, list: [], byName: {} };
      window.ARENA_CARDS.forEach(a => {
        const d = { name: a[0], series: a[1], rarity: a[2], profil: a[3], pv: a[4], atk: a[5], characterRank: a[6] };
        const k = norm(a[0]) + '|' + norm(a[1]);
        (arenaIdx.ns[k] = arenaIdx.ns[k] || []).push(d);
        (arenaIdx.byName[a[0]] = arenaIdx.byName[a[0]] || []).push(d);
        arenaIdx.list.push({ d: d, t: toks(a[0]) });
      });
    }
    const rn = norm(name), rs = rom(series);
    for (let i = 0; i < CARD_ALIAS.length; i++) {
      if (rn === CARD_ALIAS[i][0] && rs.indexOf(CARD_ALIAS[i][1]) >= 0) {
        const r = pickRarity(arenaIdx.byName[CARD_ALIAS[i][2]] || [], rarity, strict);
        return r && r !== 'amb' ? r : null;
      }
    }
    const exList = arenaIdx.ns[norm(name) + '|' + norm(series)] || [];
    const exact = pickRarity(exList, rarity, true);
    if (exact && exact !== 'amb') return exact;
    const t = toks(name);
    if (!t.length) return null;
    // Mêmes mots (ordre et romanisation libres), dans une série proche.
    const eq = arenaIdx.list.filter(x => x.t.length === t.length && x.t.every((k, i) => k === t[i]) && seriesNear(x.d.series, series)).map(x => x.d);
    const e2 = pickRarity(eq, rarity, true);
    if (e2 === 'amb') return null;
    if (e2) return e2;
    if (t.length >= 2) {
      // Particule en plus ou en moins (Monkey D. Luffy, Trafalgar D. Water Law), dans une série proche.
      const extraOk = (small, big) => small.length >= 2 && small.every(k => big.indexOf(k) >= 0) &&
        big.filter(k => small.indexOf(k) < 0).every(k => k.length === 1 || k === 'water');
      const inc = arenaIdx.list.filter(x => (extraOk(t, x.t) || extraOk(x.t, t)) && seriesNear(x.d.series, series)).map(x => x.d);
      const i2 = pickRarity(inc, rarity, true);
      if (i2 === 'amb') return null;
      if (i2) return i2;
      if (strict) return null;
      const i3 = pickRarity(inc, null, false);
      if (i3 && i3 !== 'amb') return i3;
    }
    if (strict) return null;
    if (exList.length) return exList[0];
    const e3 = pickRarity(eq, null, false);
    return e3 && e3 !== 'amb' ? e3 : null;
  }
  // Lecture seule (outils de test) : fiche Arena d'une carte du site (même rareté d'abord, sinon la plus proche).
  window.sakuArenaBridge.arenaCardFor = (name, series, rarity, strict) => (window.ARENA_CARDS ? (arenaDefFor(name, series, rarity, true) || (strict ? null : arenaDefFor(name, series, rarity, false))) : null);
  function siteCard(id, info) {
    try {
      if (typeof cardBuildPool === 'function') cardBuildPool();
      const e = typeof cardPoolById !== 'undefined' && cardPoolById ? cardPoolById[String(id)] : null;
      if (e) return { name: e.name, series: e.series, rarity: e.rarity };
    } catch (err) {}
    const h = info.querySelector('h2'), sr = info.querySelector('.card-detail-series');
    return { name: h ? h.textContent : '', series: sr ? sr.textContent : '' };
  }
  function abilHtml(x, active) {
    const meta = active ? (x.eff ? esc(x.eff) + ' · ' : '') + x.uses + ' utilisation' + (x.uses > 1 ? 's' : '') + ' par partie' : (x.eff ? esc(x.eff) + ' · ' : '') + 'passive';
    return '<div class="arena-abil' + (active ? ' act' : '') + '"><div class="arena-abil-t"><b>' + esc(x.nom) + '</b><em>' + meta + '</em></div><p>' + esc(x.desc) + '</p></div>';
  }
  function paneHtml(A, d) {
    const pass = A.passivesFor(d), acts = A.abilitiesFor(d);
    let col = RAR_COL[d.rarity] || '#9fd8ff';
    try { if (typeof cardRarityMeta === 'function') col = cardRarityMeta(d.rarity).color || col; } catch (e) {}
    let abil = '';
    if (pass.length) abil += '<h3 class="arena-sec">' + (pass.length > 1 ? 'Passives' : 'Passive') + '</h3>' + pass.map(x => abilHtml(x, false)).join('');
    if (acts.length) abil += '<h3 class="arena-sec">' + (acts.length > 1 ? 'Actives' : 'Active') + '</h3>' + acts.map(x => abilHtml(x, true)).join('');
    if (!abil) abil = '<p class="arena-note">Aucune capacité : les cartes Rare et Uncommon n’en ont pas dans Arena.</p>';
    return '<span class="card-detail-eyebrow">ARENA / COMBAT</span><h2>' + esc(d.name) + '</h2><p class="card-detail-series">' + esc(d.series) + '</p>' +
      '<div class="arena-tagline"><span class="arena-rar" style="--rc:' + col + '">' + esc(RAR_FR[d.rarity] || d.rarity) + '</span><span>profil ' + esc(PROFIL_FR[d.profil] || d.profil || '—') + '</span></div>' +
      '<div class="arena-stats"><div class="pv"><span>PV</span><b>' + d.pv + '</b></div><div class="atk"><span>ATK</span><b>' + d.atk + '</b></div></div>' +
      abil +
      '<p class="arena-note">Stats de base en combat. La force d’une capacité dépend de la rareté Arena de la carte.</p>' +
      '<button type="button" class="arena-open">Ouvrir Arena <span aria-hidden="true">→</span></button>';
  }
  function fillPane(pane, id, info) {
    if (pane.dataset.card === String(id)) return;
    pane.innerHTML = '<p class="arena-note">Chargement d’Arena…</p>';
    arenaEngine().then(A => {
      const sc = siteCard(id, info), d = arenaDefFor(sc.name, sc.series, sc.rarity, true) || arenaDefFor(sc.name, sc.series, sc.rarity, false);
      pane.dataset.card = String(id);
      pane.innerHTML = d ? paneHtml(A, d) : '<span class="card-detail-eyebrow">ARENA / COMBAT</span><h2>' + esc(sc.name) + '</h2>' +
        '<p class="arena-note">' + (sc.rarity === 'common' ? 'Les cartes Common ne sont pas jouables dans Arena.' : 'Ce personnage n’est pas encore jouable dans Arena.') + '</p>';
    }).catch(() => { pane.innerHTML = '<p class="arena-note">Impossible de charger Arena pour le moment. Réessaie dans un instant.</p>'; });
  }
  function closeDetails() {
    try { if (typeof cardsCloseDetail === 'function') cardsCloseDetail(); } catch (e) {}
    try { if (typeof encCloseDetail === 'function') encCloseDetail(); } catch (e) {}
  }
  function arenaTab(box, id) {
    const info = box && box.querySelector('.card-detail-info');
    if (!info || info.querySelector(':scope > .arena-tabs')) return;
    const tabs = document.createElement('div');
    tabs.className = 'arena-tabs'; tabs.setAttribute('role', 'tablist'); tabs.setAttribute('data-noi18n', '');
    tabs.innerHTML = '<button type="button" role="tab" data-t="info">Infos</button><button type="button" role="tab" data-t="arena">⚔ Arena</button>';
    const pane = document.createElement('div');
    pane.className = 'arena-pane'; pane.setAttribute('role', 'tabpanel'); pane.setAttribute('data-noi18n', '');
    info.insertBefore(tabs, info.firstChild);
    info.appendChild(pane);
    function show(on) {
      arenaTabOn = on;
      info.classList.toggle('arena-on', on);
      tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String((b.dataset.t === 'arena') === on)));
      if (on) fillPane(pane, id, info);
    }
    tabs.addEventListener('click', e => { const b = e.target.closest('button[data-t]'); if (b) show(b.dataset.t === 'arena'); });
    pane.addEventListener('click', e => { if (e.target.closest('.arena-open')) { closeDetails(); open(); } });
    show(arenaTabOn);   // garde l'onglet choisi d'une carte à l'autre
  }
  function hookDetails() {
    const orig = window.sakuDetailControls;
    if (typeof orig !== 'function' || orig.__arena) return !!(orig && orig.__arena);
    const wrapped = function (box, id) {
      const r = orig.apply(this, arguments);
      try { arenaTab(box, id); } catch (e) {}
      return r;
    };
    wrapped.__arena = true;
    window.sakuDetailControls = wrapped;
    return true;
  }

  function mount() {
    if (!$('sakuTestPill')) {
      const pill = document.createElement('div'); pill.id = 'sakuTestPill'; pill.className = 'saku-test-pill'; pill.setAttribute('data-noi18n', '');
      pill.textContent = 'Version test'; document.body.appendChild(pill);
    }
    fit();
    if (!hookDetails()) { let n = 0; const t = setInterval(() => { if (hookDetails() || ++n > 40) clearInterval(t); }, 250); }
    const m = /[?&]arena=([A-Za-z0-9]{4})\b/.exec(location.search);
    if (m) setTimeout(() => open(m[1].toUpperCase()), 300);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
