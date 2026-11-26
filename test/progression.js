/* Sakugame V2 — progression (niveaux, XP, quêtes, paliers).
   Tout est calculé et versé par le serveur (scripts SQL 016-progression.sql) : ce fichier
   affiche l'état reçu et signale la fin des parties. Il n'écrit jamais lui-même de pièces ni d'XP. */
(function () {
  'use strict';
  const GAME_QUESTS = [
    {id:'classic',name:'Detective Showdown',icon:'guesswho'}, {id:'undercover',name:'Undercover',icon:'undercover'},
    {id:'battle',name:'Detective Royale',icon:'battle'}, {id:'race',name:'Wanted!',icon:'race'},
    {id:'blur',name:'Blur Guess',icon:'blur'}, {id:'hotcold',name:'Cold Case',icon:'hotcold'},
    {id:'codenames',name:'Ninja',icon:'codenames'}, {id:'snapshot',name:'Snapshot!',icon:'snapshot'}
  ];
  const COLLECTION_NAMES = {
    collection: 'Collection completed', boosters: 'Boosters opened',
    mythics: 'Distinct mythic cards owned', duplicates: 'Duplicates obtained',
    legendaries: 'Distinct legendary cards owned', upgrades: 'Cards upgraded', explorer: 'Explorer: different games played'
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
  const WEEKLY_TITLES = {
    games: 'Finish {n} games', wins: 'Win {n} games', variety: 'Play {n} different games',
    boosters: 'Open {n} boosters', upgrades: 'Upgrade {n} cards', days: 'Complete all daily quests on {n} days'
  };
  const QUEST_ICONS = {
    games: 'i-gamepad', wins: 'i-trophy', variety: 'i-dice', boosters: 'i-vending', upgrades: 'i-bolt', days: 'i-check',
    collection: 'i-cards', mythics: 'i-crown', duplicates: 'i-layers', legendaries: 'i-star', explorer: 'i-globe'
  };
  const TABS = [['daily', 'Today'], ['weekly', 'This week'], ['games', 'Games'], ['collection', 'Collection']];
  let tab = null, claimingAll = false;
  try { tab = localStorage.getItem('saku_quest_tab'); } catch (e) {}
  const fmt = (tpl, n) => tr(tpl).replace('{n}', n);
  const num = n => safe(n).toLocaleString((window.SAKU_I18N && SAKU_I18N.lang) || undefined);
  const icon = (id, cls) => '<span class="qx-ico' + (cls ? ' ' + cls : '') + '"><svg class="ic" aria-hidden="true"><use href="#' + id + '"/></svg></span>';
  function timeLeft(ms) {
    const m = Math.max(1, Math.ceil(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor(m % 1440 / 60), mi = m % 60;
    const L = (window.SAKU_I18N && SAKU_I18N.lang) || 'en', u = L === 'fr' ? [' j', ' h', ' min'] : L === 'es' ? [' d', ' h', ' min'] : ['d', 'h', 'm'];
    return d ? d + u[0] + ' ' + h + u[1] : h ? h + u[1] + ' ' + mi + u[2] : mi + u[2];
  }
  function nextReset(weekly) {
    const n = new Date(), t = Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() + 1);
    return weekly ? t + ((8 - (n.getUTCDay() || 7)) % 7) * 86400000 : t;
  }
  function timer(weekly) {
    return '<span class="qx-timer" data-reset="' + (weekly ? 'w' : 'd') + '"><svg class="ic" aria-hidden="true"><use href="#i-clock"/></svg><span>' +
      tr(weekly ? 'Resets in {n}' : 'New quests in {n}').replace('{n}', timeLeft(nextReset(weekly) - Date.now())) + '</span></span>';
  }
  function tickTimers() {
    document.querySelectorAll('.qx-timer[data-reset]').forEach(el => {
      const w = el.dataset.reset === 'w', span = el.querySelector('span');
      if (span) span.textContent = tr(w ? 'Resets in {n}' : 'New quests in {n}').replace('{n}', timeLeft(nextReset(w) - Date.now()));
    });
  }
  function claimables(s) {
    const r = {daily: 0, weekly: 0, games: 0, collection: 0, coins: 0, xp: 0};
    let left = Math.max(0, safe(s.max_claims) - safe(s.claimed_count));
    (s.daily_quests || []).forEach(q => { if (q.ready && !q.claimed && left > 0) { left--; r.daily++; r.coins += safe(q.coins); r.xp += safe(q.xp); } });
    (s.weekly_quests || []).forEach(q => { if (q.ready && !q.claimed) { r.weekly++; r.coins += safe(q.coins); r.xp += safe(q.xp); } });
    (s.game_quests || []).forEach(q => { if (q.ready) { r.games++; r.coins += safe(q.coins); } });
    (s.collection_quests || []).concat(s.milestone_quests || []).forEach(q => {
      if (q.ready) { r[q.id === 'explorer' ? 'games' : 'collection']++; r.coins += safe(q.reward); }
    });
    r.total = r.daily + r.weekly + r.games + r.collection;
    return r;
  }
  function status(ready, claimed, blocked, onclick) {
    if (claimed) return '<span class="qx-state qx-state-done"><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg>' + tr('Claimed') + '</span>';
    if (ready && !blocked) return '<button type="button" class="qx-btn" onclick="' + onclick + '">' + tr('Claim') + '</button>';
    return '<span class="qx-state">' + tr(blocked && ready ? 'Daily limit reached' : 'In progress') + '</span>';
  }
  function meter(n, goal, label) {
    const pc = Math.min(100, Math.floor(n / Math.max(1, goal) * 100));
    return '<div class="qx-meter-line">' + (label ? '<span class="qx-obj-label">' + tr(label) + '</span>' : '') +
      '<div class="quest-meter"><span style="width:' + pc + '%"></span></div><span class="qx-count">' + label_n(n, goal) + '</span></div>';
  }
  function label_n(n, goal) { return num(Math.min(n, goal)) + ' / ' + num(goal); }
  function reward(xp, coins) {
    return '<div class="qx-reward">' + (xp ? '<span class="qx-xp">+' + safe(xp) + ' XP</span>' : '') +
      '<span class="qx-coin">' + coin() + num(coins) + '</span></div>';
  }
  function row(q, title, ico, onclick, blocked) {
    const n = safe(q.count), goal = Math.max(1, safe(q.goal)), claimed = !!q.claimed, ready = n >= goal;
    return '<article class="qx-row' + (claimed ? ' is-claimed' : ready && !blocked ? ' is-ready' : '') + '">' + ico +
      '<div class="qx-main"><h3>' + title + '</h3>' + meter(n, goal) + '</div>' + reward(q.xp, q.coins) +
      status(ready, claimed, blocked, onclick) + '</article>';
  }
  function pips(tier, len) {
    let h = '<span class="qx-pips" title="' + tr('Tier') + ' ' + Math.min(tier + 1, len) + ' / ' + len + '">';
    for (let i = 0; i < len; i++) h += '<i class="' + (i < tier ? 'on' : i === tier ? 'cur' : '') + '"></i>';
    return h + '</span>';
  }
  function track(o) {
    return '<article class="qx-track' + (o.done ? ' is-done' : o.ready ? ' is-ready' : '') + '" data-score="' + o.score + '">' + o.ico +
      '<div class="qx-main"><div class="qx-track-head"><h3>' + o.title + '</h3>' + o.pips + '</div>' +
      (o.done ? '<p class="qx-done-text">' + tr('All tiers completed') + '</p>' : o.body) + '</div>' +
      (o.done ? '' : '<div class="qx-track-foot">' + reward(0, o.coins) + status(o.ready, false, false, o.onclick) + '</div>') + '</article>';
  }
  function sortTracks(list) {
    return list.sort((a, b) => (b.ready - a.ready) || (a.done - b.done) || (b.score - a.score)).map(track).join('');
  }
  function milestoneTrack(q, cs, noPips) {
    const name = COLLECTION_NAMES[q.id] || q.id, tier = safe(q.tier), len = Math.max(1, safe(q.tiers)), pct = !!q.percent,
      n = Number(q.value) || 0, goal = Math.max(1, safe(q.goal));
    const body = pct
      ? '<div class="qx-meter-line"><div class="quest-meter"><span style="width:' + Math.min(100, Math.floor(n / goal * 100)) + '%"></span></div><span class="qx-count">' +
        (Math.floor(Math.min(n, goal) * 10) / 10) + '% / ' + goal + '%</span></div><small class="qx-sub">' + num(cs.owned) + ' / ' + num(cs.total) + ' ' + tr('cards') + '</small>'
      : meter(Math.floor(n), goal);
    return {title: esc(tr(name)), ico: icon(QUEST_ICONS[q.id] || 'i-cards'), pips: noPips ? '' : pips(tier, len), body, done: !!q.done, ready: !!q.ready,
      coins: q.reward, score: q.done ? 0 : Math.min(1, n / goal), onclick: "sakuClaimCollectionQuest('" + q.id + "'," + tier + ")"};
  }
  function panelDaily(s) {
    const limit = safe(s.claimed_count) >= safe(s.max_claims);
    return (s.daily_quests || []).map(q => row(q, dailyTitle(q),
      q.game ? '<span class="qx-ico qx-ico-game"><svg class="ic" aria-hidden="true"><use href="#i-game-' + gameInfo(q.game).icon + '"/></svg></span>' : icon(q.kind === 'wins' ? 'i-trophy' : 'i-gamepad'),
      "sakuClaimQuest('" + esc(q.id) + "')", limit && !q.claimed)).join('');
  }
  function panelWeekly(s) {
    return (s.weekly_quests || []).map(q => row(q, esc(fmt(WEEKLY_TITLES[q.kind] || q.id, num(q.goal))), icon(QUEST_ICONS[q.kind] || 'i-star'),
      "sakuClaimWeeklyQuest('" + esc(q.id) + "')", false)).join('');
  }
  function panelGames(s) {
    const cs = s.collection || {};
    const list = (s.game_quests || []).map(q => {
      const g = gameInfo(q.id), rounds = !!q.rounds, tier = safe(q.tier), done = !!q.done, gg = Math.max(1, safe(q.goal_games)), gw = Math.max(1, safe(q.goal_wins));
      return {title: esc(tr(g.name)), ico: '<span class="qx-ico qx-ico-game"><svg class="ic" aria-hidden="true"><use href="#i-game-' + g.icon + '"/></svg></span>',
        pips: safe(q.tiers) > 8 ? '' : pips(tier, Math.max(1, safe(q.tiers) || 5)), done, ready: !!q.ready, coins: q.coins, score: done ? 0 : Math.min(1, (Math.min(1, q.games / gg) + Math.min(1, q.wins / gw)) / 2),
        body: '<div class="qx-objs">' + meter(safe(q.games), gg, rounds ? 'Rounds played' : 'Games played') + meter(safe(q.wins), gw, rounds ? 'Correct rounds' : 'Victories') + '</div>',
        onclick: "sakuClaimGameQuest('" + g.id + "'," + tier + ")"};
    });
    (s.milestone_quests || []).filter(q => q.id === 'explorer').forEach(q => list.push(milestoneTrack(q, cs)));
    return sortTracks(list);
  }
  function panelCollection(s) {
    const cs = s.collection || {};
    return sortTracks((s.collection_quests || []).concat((s.milestone_quests || []).filter(q => q.id !== 'explorer')).map(q => milestoneTrack(q, cs, true)));
  }
  const TAB_INFO = {
    daily: ['Four quick quests, renewed every day.', false,
      ['A game earns 40 XP, plus 20 XP for a win. Blur Guess and Snapshot earn 4 XP per round, plus 2 XP for a correct answer.',
       'For daily quests, 10 rounds count as one game and 10 correct rounds as one win.']],
    weekly: ['Bigger goals for the whole week. They reset every Monday.', true,
      ['Blur Guess and Snapshot: 10 rounds count as one game and 10 correct rounds as one win.',
       'A day counts once you have claimed all your daily quests.']],
    games: ['Each game has many tiers. Reach both goals to unlock the reward.', null,
      ['Blur Guess and Snapshot: 10 rounds equal one game for the targets. Only rounds recorded from this update count.',
       'Daily limits apply to counted games and rounds.', 'Explorer: Blur Guess and Snapshot count once you have played 10 rounds.']],
    collection: ['Permanent milestones for your cards. Your progress is never lost.', null,
      ['Collection and mythic goals count cards currently owned. Duplicates count extra copies you currently hold.',
       'Legendary goals count distinct legendary cards currently owned.']]
  };
  function questsPage(s) {
    const c = claimables(s);
    if (!TABS.some(x => x[0] === tab)) tab = c.daily ? 'daily' : c.weekly ? 'weekly' : c.games ? 'games' : c.collection ? 'collection' : 'daily';
    const limit = Math.max(1, safe(s.needed)), pc = Math.min(100, Math.floor(100 * safe(s.xp) / limit));
    const inf = window.sakuInfiniteCoins && window.sakuInfiniteCoins(boundUid);
    const info = TAB_INFO[tab], body = tab === 'weekly' ? panelWeekly(s) : tab === 'games' ? panelGames(s) : tab === 'collection' ? panelCollection(s) : panelDaily(s);
    return '<section class="qx-summary">' +
      '<div class="qx-level"><span class="qx-level-badge"><small>' + tr('Level') + '</small><b>' + safe(s.level) + '</b></span><div class="qx-level-main">' +
        '<div class="qx-level-line"><span>' + tr('Experience') + '</span><b>' + num(s.xp) + ' / ' + num(limit) + ' XP</b></div>' +
        '<div class="progress-bar"><span style="width:' + pc + '%"></span></div>' +
        '<small class="qx-next">' + tr('Next level') + ' : ' + coin() + num(s.next_reward) + '</small></div></div>' +
      '<div class="qx-wallet">' + coin() + '<strong>' + (inf ? '∞' : num(s.coins)) + '</strong></div>' +
      '<button type="button" class="qx-claim-all" ' + (c.total && !claimingAll ? '' : 'disabled') + ' onclick="sakuClaimAllQuests()">' +
        '<svg class="ic" aria-hidden="true"><use href="#i-sparkle"/></svg><span class="qx-claim-all-text"><b>' +
        tr(claimingAll ? 'Collecting…' : c.total ? 'Claim all' : 'Nothing to claim') + '</b>' +
        (c.total ? '<small>' + fmt(c.total > 1 ? '{n} rewards' : '{n} reward', c.total) + ' · +' + num(c.coins) + ' ' + tr('coins') + (c.xp ? ' · +' + num(c.xp) + ' XP' : '') + '</small>' : '<small>' + tr('Keep playing to fill your quests.') + '</small>') +
      '</span></button></section>' +
      '<nav class="qx-tabs" role="tablist" aria-label="' + tr('Quests') + '">' + TABS.map(([id, label]) =>
        '<button type="button" role="tab" class="qx-tab' + (id === tab ? ' active' : '') + '" aria-selected="' + (id === tab) + '" onclick="sakuQuestTab(\'' + id + '\')">' +
        '<span>' + tr(label) + '</span>' + (c[id] ? '<span class="qx-tab-badge">' + c[id] + '</span>' : '') + '</button>').join('') + '</nav>' +
      '<section class="qx-panel qx-panel-' + tab + '" role="tabpanel"><header class="qx-panel-head"><p>' + tr(info[0]) + '</p>' + (info[1] === null ? '' : timer(info[1])) + '</header>' +
      '<div class="' + (tab === 'games' || tab === 'collection' ? 'qx-grid' : 'qx-list') + '">' + body + '</div>' +
      '<details class="qx-help"><summary><svg class="ic" aria-hidden="true"><use href="#i-help"/></svg>' + tr('How does it work?') + '</summary><ul>' +
        info[2].map(x => '<li>' + tr(x) + '</li>').join('') + '</ul></details></section>';
  }
  function badges(s) {
    const n = s ? claimables(s).total : 0;
    document.querySelectorAll('.quest-ready-badge').forEach(b => { b.hidden = !n; b.textContent = n > 9 ? '9+' : String(n); });
  }
  function renderClipboard() {
    const box = $('homeQuestContent'); if (!box) return;
    if (!currentAccount) { box.innerHTML = '<p class="home-quest-empty">' + tr('Sign in to track your quests.') + ' <button type="button" onclick="openAuthModal()">' + tr('Continue with Discord') + '</button></p>'; return; }
    if (!state) { box.innerHTML = '<p class="home-quest-empty">' + tr(loadFailed ? 'Could not load progression. Please try again.' : 'Loading progression…') + (loadFailed ? ' <button type="button" class="quest-retry" onclick="window.sakuProgressRetry&&window.sakuProgressRetry()">' + tr('Try again') + '</button>' : '') + '</p>'; return; }
    const near = [];
    (state.game_quests || []).forEach(q => {
      if (q.done || !q.goal_games || !q.goal_wins) return;
      const score = Math.min(q.games / q.goal_games, q.wins / q.goal_wins);
      if (score > 0) near.push({name: tr(gameInfo(q.id).name), score: Math.min(1, score)});
    });
    (state.collection_quests || []).concat(state.milestone_quests || []).forEach(q => {
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
    renderClipboard(); badges(signed ? state : null);
    if (acc) { acc.hidden = !signed; if (signed) acc.innerHTML = state ? panel(state) : '<p>' + tr(loadFailed ? 'Could not load progression. Please try again.' : 'Loading progression…') + (loadFailed ? ' <button type="button" class="quest-retry" onclick="window.sakuProgressRetry&&window.sakuProgressRetry()">' + tr('Try again') + '</button>' : '') + '</p>'; }
    if (!box) return;
    if (!signed) { box.innerHTML = '<section class="quest-guest"><div class="quest-guest-star">✦</div><h2>' + tr('Your quests are waiting') + '</h2><p>' + tr('Sign in to earn experience, collect coins and track your quests.') + '</p><button class="hub-primary hub-discord" onclick="openAuthModal()"><svg class="ic"><use href="#i-discord"/></svg> ' + tr('Continue with Discord') + '</button></section>'; return; }
    if (!state) { box.innerHTML = '<section class="quest-empty">' + tr(loadFailed ? 'Could not load progression. Please try again.' : 'Loading progression…') + (loadFailed ? ' <button type="button" class="quest-retry" onclick="window.sakuProgressRetry&&window.sakuProgressRetry()">' + tr('Try again') + '</button>' : '') + '</section>'; return; }
    box.innerHTML = questsPage(state);
  }
  let lastLevel = null;
  function changed() {
    window.sakuSecureCoins = state ? state.coins : null;
    const lv = state ? Number(state.level) || null : null;
    if (lastLevel != null && lv != null && lv > lastLevel) { try { document.dispatchEvent(new CustomEvent('saku:level-up', {detail: {level: lv}})); } catch (e) {} }
    lastLevel = lv;
    if (state && window.sakuNotifQuests) { try { window.sakuNotifQuests(state); } catch (e) {} }
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
  function detach() { boundUid = null; state = null; lastLevel = null; loadFailed = false; primed = false; pending.clear(); clearTimeout(refetchTimer); render(); }
  // b328 — progression déjà reçue avec le compte (account_bootstrap) : pas de second appel.
  let primed = false;
  function prime(uid, snap) { if (!uid || !snap || typeof snap !== 'object') return; boundUid = String(uid); state = snap; loadFailed = false; primed = true; }
  function attach() {
    if (!currentAccount) { detach(); return; }
    const uid = sakuMyDcId();
    if (uid === boundUid && state) { if (primed) { primed = false; changed(); } else render(); return; }
    primed = false;
    boundUid = uid; state = null; loadFailed = false; render(); fetchState();
  }
  function matchPrefix(kind, gid) {
    return [roomCode, currentRoom.createdAt || 0, kind, gid].join('_').replace(/[^A-Za-z0-9_:-]/g, '_').slice(0, 190);
  }
  function game(kind, gid, won) {
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
      if (window.SakuSfx) window.SakuSfx.play('reward');
      notify(okText);
    } catch (e) {
      if (uid === boundUid) { notify('Progress could not be saved.'); fetchState(); }
    }
  }
  const claim = id => claimWith('progress_claim_daily', {p_quest: String(id)}, 'Quest reward collected!');
  const claimGameQuest = (id, tier) => Number.isInteger(tier) && tier >= 0 && tier <= 100 && GAME_QUESTS.some(g => g.id === id)
    ? claimWith('progress_claim_game', {p_game: id, p_tier: tier}, 'Game quest reward collected!') : undefined;
  const claimCollectionQuest = (id, tier) => Number.isInteger(tier) && tier >= 0 && tier <= 200 && COLLECTION_NAMES[id]
    ? claimWith('progress_claim_collection', {p_quest: id, p_tier: tier}, 'Quest reward collected!') : undefined;

  const claimWeeklyQuest = id => /^w_[a-z]{2,20}$/.test(String(id)) ? claimWith('progress_claim_weekly', {p_quest: String(id)}, 'Quest reward collected!') : undefined;
  async function claimAll() {
    if (!currentAccount || !boundUid || claimingAll) return;
    const uid = boundUid;
    claimingAll = true; render();
    try {
      const r = await rpc('progress_claim_all', {});
      if (uid !== boundUid) return;
      const n = r ? safe(r.claimed_total) : 0, coins = r ? safe(r.coins_gained) : 0;
      if (r) { delete r.claimed_total; delete r.coins_gained; delete r.levels_gained; }
      claimingAll = false;
      if (r) apply(r);
      if (n && window.SakuSfx) window.SakuSfx.play('reward');
      if (typeof showNotification === 'function') showNotification(n
        ? fmt(n > 1 ? '{n} rewards collected!' : '{n} reward collected!', n) + (coins ? ' +' + num(coins) + ' ' + tr('coins') : '')
        : tr('Nothing to claim'));
    } catch (e) {
      if (uid === boundUid) { notify('Progress could not be saved.'); fetchState(); }
    } finally { if (claimingAll) { claimingAll = false; render(); } }
  }
  window.sakuClaimGameQuest = claimGameQuest; window.sakuClaimCollectionQuest = claimCollectionQuest;
  window.sakuClaimWeeklyQuest = claimWeeklyQuest; window.sakuClaimAllQuests = claimAll;
  window.sakuQuestTab = function (id) {
    if (!TABS.some(x => x[0] === id)) return;
    tab = id; try { localStorage.setItem('saku_quest_tab', id); } catch (e) {}
    render();
  };
  setInterval(() => { const q = $('questsScreen'); if (q && q.classList.contains('active')) tickTimers(); }, 30000);
  window.sakuProgressRetry = function () { loadFailed = false; render(); fetchState(); };
  window.showQuests = function () { showScreen('questsScreen'); render(); fetchState(); try { window.scrollTo(0, 0); } catch (e) {} };
  window.sakuProgressRefresh = fetchState;
  window.sakuProgressSetCoins = c => { c = Number(c); if (state && Number.isFinite(c) && c >= 0) { state = Object.assign({}, state, {coins: Math.floor(c)}); changed(); } };
  window.sakuProgressPrime = prime;
  window.sakuProgressAttach = attach; window.sakuProgressDetach = detach; window.sakuProgressGame = game; window.sakuProgressRound = round;
  window.sakuProgressMulti = multi; window.sakuClaimQuest = claim; window.sakuProgressRender = render; window.sakuProgressClipboard = renderClipboard;
  window.sakuProgressSnapshot = function () {
    if (!state) return null;
    return {level: safe(state.level), xp: safe(state.xp), needed: safe(state.needed),
      coins: window.sakuInfiniteCoins && window.sakuInfiniteCoins(boundUid) ? Infinity : safe(state.coins)};
  };
  window.__sakuProgressTest = {setState: s => { state = s; boundUid = boundUid || 'test'; }, render, dailyTitle, claimables, getState: () => state};
  window.addEventListener('saku-lang-change', render);
  document.addEventListener('DOMContentLoaded', () => { if (currentAccount) attach(); else render(); });
  setInterval(() => {
    if (!currentAccount || document.hidden) return;
    const q = $('questsScreen'), h = $('homepageScreen');
    if ((q && q.classList.contains('active')) || (h && h.classList.contains('active'))) fetchState();
  }, 60000);
})();
