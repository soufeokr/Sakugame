/* Sakugame V2 — progression (niveaux, XP, quêtes, paliers).
   Tout est calculé et versé par le serveur (scripts SQL 016-progression.sql) : ce fichier
   affiche l'état reçu et signale la fin des parties. Il n'écrit jamais lui-même de pièces ni d'XP. */
(function () {
  'use strict';
  const GAME_QUESTS = [
    {id:'classic',name:'Detective Showdown',icon:'guesswho'}, {id:'undercover',name:'Undercover',icon:'undercover'},
    {id:'battle',name:'Detective Royale',icon:'battle'}, {id:'race',name:'Wanted!',icon:'race'},
    {id:'blur',name:'Blur Guess',icon:'blur'}, {id:'hotcold',name:'Cold Case',icon:'hotcold'},
    {id:'codenames',name:'Ninja Scrolls',icon:'codenames'}, {id:'snapshot',name:'Snapshot!',icon:'snapshot'}
  ];
  const COLLECTION_NAMES = {
    collection: 'Collection completed', boosters: 'Boosters opened',
    mythics: 'Distinct mythic cards owned', duplicates: 'Duplicates obtained'
  };
  let state = null, boundUid = null, fetching = null, loadFailed = false, refetchTimer = null;
  const pending = new Set();
  const tr = s => typeof t === 'function' ? t(s) : s;
  const rpc = (name, args) => window.sakuRpc(name, args);
  const safe = n => Number.isFinite(Number(n)) ? Math.max(0, Math.floor(Number(n))) : 0;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const $ = id => document.getElementById(id);
  const notify = text => { if (typeof showNotification === 'function') showNotification(tr(text)); };
  const gameInfo = id => GAME_QUESTS.find(g => g.id === id) || {id, name: id, icon: id};

  function coin() { return '<img class="progress-coin" src="summon-machines/coin.svg" alt="">'; }
  function dailyTitle(q) {
    if (!q.game) return esc(tr(q.title));
    const action = q.rounds ? (q.kind === 'games' ? tr('Play rounds') : tr('Answer rounds correctly'))
                            : (q.kind === 'games' ? tr('Finish games') : tr('Win games'));
    return esc(action + ' · ' + tr(gameInfo(q.game).name));
  }
  function objective(label, n, goal) {
    n = safe(n); goal = Math.max(1, safe(goal));
    return '<div class="game-quest-objective"><div class="game-quest-objective-head"><strong>' + tr(label) + '</strong><span>' +
      Math.min(n, goal) + ' / ' + goal + '</span></div><div class="quest-meter"><span style="width:' +
      Math.min(100, Math.floor(n / goal * 100)) + '%"></span></div></div>';
  }
  function gameQuestSection(s) {
    return '<div class="quest-section-head"><div><span class="progress-eyebrow">SAKUGAME / GAMES</span><h2>' + tr('Game quests') +
      '</h2><p>' + tr('Complete both objectives to claim the tier reward. Progress is cumulative.') + '</p></div></div><div class="game-quest-grid">' +
      (s.game_quests || []).map(q => {
        const g = gameInfo(q.id), rounds = !!q.rounds, tier = safe(q.tier), done = !!q.done;
        return '<article class="game-quest-card"><div class="game-quest-header"><svg class="ic" aria-hidden="true"><use href="#i-game-' + g.icon +
          '"/></svg><h3>' + tr(g.name) + '</h3><span class="game-quest-tier">' + tr('Tier') + ' ' + Math.min(tier + 1, 5) + ' / 5</span></div>' +
          (done ? '<p class="game-quest-complete">' + tr('All tiers completed') + '</p>'
            : objective(rounds ? 'Rounds played' : 'Completed games', q.games, q.goal_games) +
              objective(rounds ? 'Correct rounds' : 'Victories', q.wins, q.goal_wins) +
              '<div class="game-quest-tier-footer"><span class="game-quest-rewards">' + coin() + ' ' + safe(q.coins) +
              '</span><button type="button" class="quest-claim game-quest-claim" ' + (q.ready ? '' : 'disabled') +
              ' onclick="sakuClaimGameQuest(\'' + g.id + '\',' + tier + ')">' + tr(q.ready ? 'Claim' : 'In progress') + '</button></div>') +
          '</article>';
      }).join('') + '</div><p class="quest-footnote">' +
      tr('Blur Guess and Snapshot: 10 rounds equal one game for the targets. Only rounds recorded from this update count.') + ' ' +
      tr('Daily limits apply to counted games and rounds.') + '</p>';
  }
  function collectionQuestSection(s) {
    const cs = s.collection || {};
    return '<div class="quest-section-head"><div><span class="progress-eyebrow">SAKUGAME / CARDS</span><h2>' + tr('Collection quests') +
      '</h2><p>' + tr('Collect cards and advance through permanent milestones.') + '</p></div></div><div class="game-quest-grid">' +
      (s.collection_quests || []).map(q => {
        const name = COLLECTION_NAMES[q.id] || q.id, tier = safe(q.tier), len = safe(q.tiers), done = !!q.done, pct = !!q.percent,
          n = Number(q.value) || 0, goal = Math.max(1, safe(q.goal)), shown = pct ? Math.floor(n * 10) / 10 : Math.floor(n);
        return '<article class="game-quest-card collection-quest-card"><div class="game-quest-header"><svg class="ic" aria-hidden="true"><use href="#i-cards"/></svg><h3>' +
          tr(name) + '</h3><span class="game-quest-tier">' + tr('Tier') + ' ' + Math.min(tier + 1, len) + ' / ' + len + '</span></div>' +
          (done ? '<p class="game-quest-complete">' + tr('All tiers completed') + '</p>'
            : '<div class="game-quest-objective"><div class="game-quest-objective-head"><strong>' + tr(name) + '</strong><span>' +
              Math.min(shown, goal) + (pct ? '%' : '') + ' / ' + goal + (pct ? '%' : '') + '</span></div><div class="quest-meter"><span style="width:' +
              Math.min(100, Math.floor(n / goal * 100)) + '%"></span></div>' +
              (pct ? '<small class="collection-quest-detail">' + safe(cs.owned) + ' / ' + safe(cs.total) + ' ' + tr('cards') + '</small>' : '') +
              '</div><div class="game-quest-tier-footer"><span class="game-quest-rewards">' + coin() + ' ' + safe(q.reward) +
              '</span><button type="button" class="quest-claim game-quest-claim" ' + (q.ready ? '' : 'disabled') +
              ' onclick="sakuClaimCollectionQuest(\'' + q.id + '\',' + tier + ')">' + tr(q.ready ? 'Claim' : 'In progress') + '</button></div>') +
          '</article>';
      }).join('') + '</div><p class="quest-footnote">' +
      tr('Collection and mythic goals count cards currently owned. Duplicates count extra copies you currently hold.') + '</p>';
  }
  function renderClipboard() {
    const box = $('homeQuestContent'); if (!box) return;
    if (!currentAccount) { box.innerHTML = '<p class="home-quest-empty">' + tr('Sign in to track your quests.') + ' <button type="button" onclick="openAuthModal()">' + tr('Continue with Discord') + '</button></p>'; return; }
    if (!state) { box.innerHTML = '<p class="home-quest-empty">' + tr(loadFailed ? 'Could not load progression. Please try again.' : 'Loading progression…') + '</p>'; return; }
    const near = [];
    (state.game_quests || []).forEach(q => {
      if (q.done || !q.goal_games || !q.goal_wins) return;
      const score = Math.min(q.games / q.goal_games, q.wins / q.goal_wins);
      if (score > 0) near.push({name: tr(gameInfo(q.id).name), score: Math.min(1, score)});
    });
    (state.collection_quests || []).forEach(q => {
      if (q.done || !q.goal) return;
      const score = (Number(q.value) || 0) / q.goal;
      if (score > 0) near.push({name: tr(COLLECTION_NAMES[q.id] || q.id), score: Math.min(1, score)});
    });
    near.sort((a, b) => b.score - a.score);
    box.innerHTML = '<div class="home-quest-column"><h3>' + tr('Daily quests') + '</h3>' + (state.daily_quests || []).map(q => {
      const n = Math.min(q.goal, safe(q.count)), done = !!q.claimed, ready = n >= q.goal;
      return '<div class="home-quest-row"><span class="home-quest-check ' + (done ? 'done' : ready ? 'ready' : '') + '">' + (done ? '✓' : ready ? '!' : '') +
        '</span><span>' + dailyTitle(q) + '</span><b>' + (done ? tr('Claimed') : n + ' / ' + q.goal) + '</b></div>';
    }).join('') + '</div><div class="home-quest-column home-quest-near"><h3>' + tr('Almost there') + '</h3>' +
      (near.length ? near.slice(0, 2).map(q => '<div class="home-quest-near-row"><div><span>' + esc(q.name) + '</span><b>' + Math.floor(q.score * 100) +
        '%</b></div><div class="quest-meter"><span style="width:' + Math.floor(q.score * 100) + '%"></span></div></div>').join('')
        : '<p class="home-quest-empty">' + tr('Play or collect to start a milestone.') + '</p>') + '</div>';
  }
  function panel(s) {
    const limit = Math.max(1, safe(s.needed)), pc = Math.min(100, Math.floor(100 * safe(s.xp) / limit));
    return '<div class="progress-top"><div><span class="progress-eyebrow">' + tr('Your progression') + '</span><h2>' + tr('Level') + ' ' + safe(s.level) +
      '</h2></div><div class="progress-balance">' + coin() + '<strong>' +
      (window.sakuInfiniteCoins && window.sakuInfiniteCoins(boundUid) ? '∞' : safe(s.coins).toLocaleString()) + '</strong><span>' + tr('coins') + '</span></div></div>' +
      '<div class="progress-xp-label"><span>' + tr('Experience') + '</span><b>' + safe(s.xp) + ' / ' + limit + ' XP</b></div><div class="progress-bar"><span style="width:' + pc +
      '%"></span></div><p class="progress-next">' + tr('Next level reward') + ' : ' + coin() + ' ' + safe(s.next_reward) + ' ' + tr('coins') + '</p>';
  }
  function render() {
    const acc = $('accountProgress'), box = $('questsContent'), signed = !!currentAccount;
    renderClipboard();
    if (acc) { acc.hidden = !signed; if (signed) acc.innerHTML = state ? panel(state) : '<p>' + tr(loadFailed ? 'Could not load progression. Please try again.' : 'Loading progression…') + '</p>'; }
    if (!box) return;
    if (!signed) { box.innerHTML = '<section class="quest-guest"><div class="quest-guest-star">✦</div><h2>' + tr('Your quests are waiting') + '</h2><p>' + tr('Sign in to earn experience, collect coins and track your quests.') + '</p><button class="hub-primary hub-discord" onclick="openAuthModal()"><svg class="ic"><use href="#i-discord"/></svg> ' + tr('Continue with Discord') + '</button></section>'; return; }
    if (!state) { box.innerHTML = '<section class="quest-empty">' + tr(loadFailed ? 'Could not load progression. Please try again.' : 'Loading progression…') + '</section>'; return; }
    const limitReached = safe(state.claimed_count) >= safe(state.max_claims);
    box.innerHTML = '<section class="quest-progress">' + panel(state) + '</section><div class="quest-section-head"><div><span class="progress-eyebrow">' + tr('YOUR OBJECTIVES') +
      '</span><h2>' + tr('Daily quests') + '</h2><p>' + tr('Resets every day at 00:00 UTC. Claim your rewards before the reset.') + '</p></div></div><div class="quest-list">' +
      (state.daily_quests || []).map(q => {
        const n = Math.min(q.goal, safe(q.count)), claimed = !!q.claimed, ready = n >= q.goal;
        return '<article class="quest-card"><div class="quest-symbol">✦</div><div class="quest-main"><h3>' + dailyTitle(q) + '</h3><div class="quest-meter"><span style="width:' +
          Math.floor(n / q.goal * 100) + '%"></span></div><div class="quest-count">' + n + ' / ' + q.goal + '</div></div><div class="quest-rewards"><span>+' + safe(q.xp) +
          ' XP</span><span>' + coin() + ' +' + safe(q.coins) + '</span></div><button type="button" class="quest-claim" ' + (!ready || claimed || limitReached ? 'disabled' : '') +
          ' onclick="sakuClaimQuest(\'' + esc(q.id) + '\')">' + tr(claimed ? 'Claimed' : limitReached ? 'Daily limit reached' : ready ? 'Claim' : 'In progress') + '</button></article>';
      }).join('') + '</div><p class="quest-footnote">' +
      tr('A game earns 40 XP, plus 20 XP for a win. Blur Guess and Snapshot earn 4 XP per round, plus 2 XP for a correct answer.') + ' ' +
      tr('For daily quests, 10 rounds count as one game and 10 correct rounds as one win.') + '</p>' + gameQuestSection(state) + collectionQuestSection(state);
  }
  let lastLevel = null;
  function changed() {
    window.sakuSecureCoins = state ? state.coins : null;
    const lv = state ? Number(state.level) || null : null;
    if (lastLevel != null && lv != null && lv > lastLevel) { try { document.dispatchEvent(new CustomEvent('saku:level-up', {detail: {level: lv}})); } catch (e) {} }
    lastLevel = lv;
    render();
    if (window.sakuPlayerRender) window.sakuPlayerRender();
    if (window.sakuShowcaseProgressChanged) window.sakuShowcaseProgressChanged();
  }
  function apply(snapshot) { if (snapshot && typeof snapshot === 'object') { state = Object.assign({}, state || {}, snapshot); changed(); } }
  function fetchState() {
    if (!currentAccount || !window.sakuRpc || !boundUid) return Promise.resolve();
    if (fetching) return fetching;
    const uid = boundUid;
    fetching = rpc('progress_get', {}).then(s => { if (uid !== boundUid) return; loadFailed = false; state = s; changed(); })
      .catch(() => { if (uid === boundUid) { loadFailed = true; render(); } })
      .then(() => { fetching = null; });
    return fetching;
  }
  function scheduleFetch(delay) { clearTimeout(refetchTimer); refetchTimer = setTimeout(fetchState, delay || 1200); }
  function detach() { boundUid = null; state = null; lastLevel = null; loadFailed = false; pending.clear(); clearTimeout(refetchTimer); render(); }
  function attach() {
    if (!currentAccount) { detach(); return; }
    const uid = sakuMyDcId();
    if (uid === boundUid && state) { render(); return; }
    boundUid = uid; state = null; loadFailed = false; render(); fetchState();
  }
  function matchPrefix(kind, gid) {
    return [roomCode, currentRoom.createdAt || 0, kind, gid].join('_').replace(/[^A-Za-z0-9_:-]/g, '_').slice(0, 190);
  }
  function game(kind, gid, won) {
    if (won && window.SakuSfx && gid && roomCode) window.SakuSfx.winOnce(roomCode + ':' + kind + ':' + gid);
    if (!currentAccount || !boundUid || !gid || !roomCode || !currentRoom || kind === 'blur' || kind === 'snapshot') return;
    const id = matchPrefix(kind, gid);
    if (pending.has(id)) return;
    pending.add(id);
    const uid = boundUid;
    rpc('progress_report_game', {p_kind: kind, p_match: id, p_won: !!won}).then(r => {
      if (uid !== boundUid || !r) return;
      const counted = r.counted; delete r.counted; delete r.reason;
      if (counted) notify('Game complete: experience earned!');
      apply(r); scheduleFetch();
    }).catch(() => { pending.delete(id); if (uid === boundUid) notify('Progress could not be saved.'); });
  }
  function round(kind, gid, index, won) {
    if (!currentAccount || !boundUid || !gid || !roomCode || !currentRoom || !['blur', 'snapshot'].includes(kind) || !Number.isInteger(index) || index < 0 || index > 199) return;
    const prefix = matchPrefix(kind, gid), token = prefix + '#' + index;
    if (pending.has(token)) return;
    pending.add(token);
    const uid = boundUid;
    rpc('progress_report_round', {p_kind: kind, p_match: prefix, p_index: index, p_won: !!won}).then(r => {
      if (uid !== boundUid || !r) return;
      delete r.counted; delete r.reason;
      apply(r); scheduleFetch(2500);
    }).catch(() => { pending.delete(token); if (uid === boundUid) notify('Progress could not be saved.'); });
  }
  function multi(kind, room) {
    if (!room || !room.players || !room.players[playerId]) return;
    const k = {battle: 'br', race: 'rc', blur: 'bg', snapshot: 'sn', codenames: 'cn'}[kind], g = room[k];
    if (!g || !g.gameId || room.players[playerId].outInGame === g.gameId) return;
    let won = false;
    if (kind === 'race') { if (g.targetPid !== playerId && !(g.hunters || []).includes(playerId)) return; won = g.winner === playerId; }
    else if (kind === 'codenames') { const team = cnTeamOf(playerId, g); if (!team || !g.winner) return; won = team === g.winner.team; }
    else if (kind === 'battle') {
      if (!g.secrets || !g.secrets[playerId]) return;
      const rank = (g.order || []).filter(pid => room.players[pid]).sort((a, b) => ((g.points || {})[b] || 0) - ((g.points || {})[a] || 0) || ((g.found || {})[a] ? 1 : 0) - ((g.found || {})[b] ? 1 : 0));
      won = rank[0] === playerId;
    } else {
      const rank = Object.keys(room.players).filter(pid => room.players[pid].outInGame !== g.gameId).sort((a, b) => ((g.scores || {})[b] || 0) - ((g.scores || {})[a] || 0));
      won = rank[0] === playerId;
    }
    game(kind, g.gameId, won);
  }
  async function claimWith(fn, args, okText) {
    if (!currentAccount || !boundUid) return;
    const uid = boundUid;
    try {
      const r = await rpc(fn, args);
      if (uid !== boundUid) return;
      if (r) { delete r.claimed; apply(r); }
      notify(okText);
    } catch (e) {
      if (uid === boundUid) { notify('Progress could not be saved.'); fetchState(); }
    }
  }
  const claim = id => claimWith('progress_claim_daily', {p_quest: String(id)}, 'Quest reward collected!');
  const claimGameQuest = (id, tier) => Number.isInteger(tier) && tier >= 0 && tier <= 4 && GAME_QUESTS.some(g => g.id === id)
    ? claimWith('progress_claim_game', {p_game: id, p_tier: tier}, 'Game quest reward collected!') : undefined;
  const claimCollectionQuest = (id, tier) => Number.isInteger(tier) && tier >= 0 && tier <= 20 && COLLECTION_NAMES[id]
    ? claimWith('progress_claim_collection', {p_quest: id, p_tier: tier}, 'Quest reward collected!') : undefined;

  window.sakuClaimGameQuest = claimGameQuest; window.sakuClaimCollectionQuest = claimCollectionQuest;
  window.showQuests = function () { showScreen('questsScreen'); render(); fetchState(); try { window.scrollTo(0, 0); } catch (e) {} };
  window.sakuProgressRefresh = fetchState;
  window.sakuProgressSetCoins = c => { c = Number(c); if (state && Number.isFinite(c) && c >= 0) { state = Object.assign({}, state, {coins: Math.floor(c)}); changed(); } };
  window.sakuProgressAttach = attach; window.sakuProgressDetach = detach; window.sakuProgressGame = game; window.sakuProgressRound = round;
  window.sakuProgressMulti = multi; window.sakuClaimQuest = claim; window.sakuProgressRender = render; window.sakuProgressClipboard = renderClipboard;
  window.sakuProgressSnapshot = function () {
    if (!state) return null;
    return {level: safe(state.level), xp: safe(state.xp), needed: safe(state.needed),
      coins: window.sakuInfiniteCoins && window.sakuInfiniteCoins(boundUid) ? Infinity : safe(state.coins)};
  };
  window.__sakuProgressTest = {setState: s => { state = s; boundUid = boundUid || 'test'; }, render, dailyTitle, getState: () => state};
  window.addEventListener('saku-lang-change', render);
  document.addEventListener('DOMContentLoaded', () => { if (currentAccount) attach(); else render(); });
  setInterval(() => {
    if (!currentAccount || document.hidden) return;
    const q = $('questsScreen'), h = $('homepageScreen');
    if ((q && q.classList.contains('active')) || (h && h.classList.contains('active'))) fetchState();
  }, 60000);
})();
