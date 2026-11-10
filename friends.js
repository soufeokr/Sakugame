/* Sakugame V2 — amis. Annuaire de pseudos publics et relations du compte, gérés par le serveur
   (scripts SQL 015-social.sql). Les demandes doivent être acceptées ; favoris et blocages sont privés.
   Ce fichier n'écrit rien lui-même : il appelle social_list / social_search / social_action. */
(function () {
  'use strict';
  const tr = s => typeof t === 'function' ? t(s) : s;
  const $ = id => document.getElementById(id);
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const rpc = (name, args) => window.sakuRpc(name, args);
  let uid = null, social = {friends: [], incoming: [], outgoing: [], blocked: []}, loaded = false;
  let results = [], resultsQuery = '', searchTimer = null, searchSeq = 0, pollTimer = null;
  const busy = new Set(), known = new Map();

  function safeId(id) { return UUID.test(String(id)); }
  function setText(el, text) { el.textContent = text; return el; }
  function node(tag, cls, text) { const el = document.createElement(tag); if (cls) el.className = cls; if (text !== undefined) setText(el, text); return el; }
  function status(text) { const el = $('friendStatus'); if (el) el.textContent = text ? tr(text) : ''; }
  function remember(list) { (list || []).forEach(c => { if (c && safeId(c.id)) known.set(c.id, c); }); }
  function setSocial(list) {
    const s = list && typeof list === 'object' ? list : {};
    social = {friends: s.friends || [], incoming: s.incoming || [], outgoing: s.outgoing || [], blocked: s.blocked || []};
    ['friends', 'incoming', 'outgoing', 'blocked'].forEach(g => remember(social[g]));
    loaded = true;
  }
  const idsOf = group => (social[group] || []).filter(c => safeId(c.id) && c.id !== uid);
  const has = (group, id) => (social[group] || []).some(c => c.id === id);
  const isFav = id => (social.friends || []).some(c => c.id === id && c.favorite);
  const cardOf = id => known.get(id) || {id, name: tr('Player unavailable'), avatar: null};

  async function refresh() {
    if (!currentAccount || !uid || !window.sakuRpc) return;
    const me = uid;
    try { const list = await rpc('social_list', {}); if (uid !== me) return; setSocial(list); render(); }
    catch (e) { if (uid === me) status('Could not load friends.'); }
  }
  function detach() {
    uid = null; social = {friends: [], incoming: [], outgoing: [], blocked: []}; loaded = false; results = []; resultsQuery = '';
    known.clear(); busy.clear(); clearInterval(pollTimer); pollTimer = null; clearTimeout(searchTimer); render();
  }
  function attach() {
    if (!currentAccount) { detach(); return; }
    const id = sakuMyDcId(); if (!safeId(id)) return;
    if (uid === id && loaded) { render(); return; }
    detach(); uid = id; render(); refresh();
    pollTimer = setInterval(() => { if (!document.hidden) refresh(); }, 30000);
  }
  function button(label, action, id, variant) {
    const b = node('button', 'friend-action ' + (variant || ''), tr(label)); b.type = 'button'; b.dataset.action = action; b.dataset.id = id; return b;
  }
  function row(card, mode) {
    const id = card.id, item = node('div', 'friend-row'), avatar = node('div', 'friend-avatar');
    if (card.avatar && /^https:\/\//i.test(String(card.avatar))) {
      const img = document.createElement('img'); img.alt = ''; img.src = String(card.avatar); img.onerror = () => img.remove(); avatar.appendChild(img);
    } else avatar.textContent = '✦';
    const content = node('div', 'friend-row-content'), head = node('div', 'friend-row-head');
    head.appendChild(node('strong', 'friend-name', String(card.name || tr('Player unavailable'))));
    head.appendChild(node('span', 'friend-id', '#' + id.slice(-4))); content.appendChild(head);
    const actions = node('div', 'friend-actions');
    if (mode !== 'blocked') actions.appendChild(button('View showcase', 'showcase', id));
    if (mode === 'blocked') actions.appendChild(button('Unblock', 'unblock', id));
    else if (mode === 'incoming') { actions.appendChild(button('Accept', 'accept', id, 'primary')); actions.appendChild(button('Decline', 'decline', id)); actions.appendChild(button('Block', 'block', id)); }
    else if (mode === 'outgoing') { actions.appendChild(button('Cancel request', 'cancel', id)); actions.appendChild(button('Block', 'block', id)); }
    else if (mode === 'friend') {
      actions.appendChild(button(isFav(id) ? 'Remove favorite' : 'Favorite', isFav(id) ? 'unfavorite' : 'favorite', id));
      actions.appendChild(button('Remove', 'remove', id)); actions.appendChild(button('Block', 'block', id));
    } else { actions.appendChild(button('Add', 'request', id, 'primary')); actions.appendChild(button('Block', 'block', id)); }
    content.appendChild(actions); item.append(avatar, content); return item;
  }
  function list(container, cards, mode, empty) {
    container.replaceChildren();
    if (!cards.length) container.appendChild(node('p', 'friend-empty', tr(empty)));
    else cards.slice().sort((a, b) => String(a.name).localeCompare(String(b.name))).forEach(c => container.appendChild(row(c, mode)));
  }
  function render() {
    if (!$('friendsGuest')) return;
    const signed = !!currentAccount; $('friendsGuest').hidden = signed; $('friendsSigned').hidden = !signed;
    const incoming = idsOf('incoming'), badge = $('friendRequestBadge');
    badge.hidden = !signed || !incoming.length; badge.textContent = String(incoming.length);
    if (!signed) return;
    const friends = idsOf('friends'), fav = friends.filter(c => c.favorite), blocked = idsOf('blocked');
    $('favoritesCount').textContent = String(fav.length); $('friendsCount').textContent = String(friends.length); $('blockedCount').textContent = String(blocked.length);
    list($('favoritesList'), fav, 'friend', 'No favorites yet.'); list($('friendsList'), friends, 'friend', 'No friends yet.'); list($('blockedList'), blocked, 'blocked', 'No blocked players.');
    const requests = $('friendRequests'); requests.replaceChildren(); const outgoing = idsOf('outgoing');
    if (incoming.length || outgoing.length) {
      requests.appendChild(node('p', 'friend-subtitle', tr('Friend requests')));
      incoming.forEach(c => requests.appendChild(row(c, 'incoming'))); outgoing.forEach(c => requests.appendChild(row(c, 'outgoing')));
    }
    const query = $('friendsSearch').value.trim(), box = $('friendSearchResults'); box.hidden = !query; box.replaceChildren();
    if (!query) return;
    if (query.length < 2) { box.appendChild(node('p', 'friend-empty', tr('Type at least 2 characters.'))); return; }
    if (resultsQuery !== query) { box.appendChild(node('p', 'friend-empty', tr('Loading players…'))); return; }
    box.appendChild(node('p', 'friend-subtitle', tr('Search results')));
    if (!results.length) box.appendChild(node('p', 'friend-empty', tr('No players found.')));
    results.forEach(c => box.appendChild(row(c, c.relation === 'friend' ? 'friend' : c.relation === 'incoming' ? 'incoming' : c.relation === 'outgoing' ? 'outgoing' : 'search')));
  }
  async function search() {
    const query = $('friendsSearch').value.trim();
    if (!uid || query.length < 2) { results = []; resultsQuery = ''; render(); return; }
    const me = uid, seq = ++searchSeq;
    try {
      const found = await rpc('social_search', {p_query: query});
      if (uid !== me || seq !== searchSeq) return;
      results = Array.isArray(found) ? found.filter(c => safeId(c.id)) : []; remember(results); resultsQuery = query; render();
    } catch (e) { if (uid === me && seq === searchSeq) { results = []; resultsQuery = query; status('Could not load players.'); render(); } }
  }
  const ERRORS = {
    unable: 'Unable to add this player.', request_gone: 'This request is no longer available.',
    too_many_requests: 'Too many pending requests.', friend_limit: 'Friend limit reached.', target_full: 'This player cannot receive requests right now.'
  };
  async function action(act, id) {
    if (!uid || !safeId(id) || id === uid || busy.has(id)) return;
    if (act === 'showcase') { sakuNavClose(false); if (window.showShowcase) window.showShowcase(id); return; }
    if (act === 'block' && !window.confirm(tr('Block this player? They will be removed from your friends.'))) return;
    const me = uid; busy.add(id); status('');
    try {
      const list = await rpc('social_action', {p_action: act, p_target: id});
      if (uid !== me) return;
      setSocial(list); render();
      if ($('friendsSearch').value.trim().length >= 2) search();
    } catch (e) {
      if (uid !== me) return;
      const msg = String(e && e.message || '');
      if (msg === 'already_related') { refresh(); }
      else status(ERRORS[msg] || 'Action could not be saved. Please try again.');
      if (msg === 'request_gone') refresh();
    } finally { busy.delete(id); }
  }
  function tab(which) {
    const friends = which === 'friends';
    $('sideMenuView').hidden = friends; $('sideFriendsView').hidden = !friends;
    $('sideMenuTab').classList.toggle('active', !friends); $('sideFriendsTab').classList.toggle('active', friends);
    $('sideMenuTab').setAttribute('aria-selected', String(!friends)); $('sideFriendsTab').setAttribute('aria-selected', String(friends));
    if (friends) { if (currentAccount && !uid) attach(); else refresh(); render(); }
  }
  document.addEventListener('DOMContentLoaded', () => {
    $('friendsSearch').addEventListener('input', () => { render(); clearTimeout(searchTimer); searchTimer = setTimeout(search, 350); });
    $('sideFriendsView').addEventListener('click', e => { const b = e.target.closest('button[data-action]'); if (b) action(b.dataset.action, b.dataset.id); });
    // Un trackpad émet beaucoup de petits événements horizontaux : un seul geste change d'onglet une fois.
    let swipeAmount = 0, swipeLocked = false, swipeIdle = null;
    $('sideNavigation').addEventListener('wheel', event => {
      if (event.ctrlKey || !event.deltaX || Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.15) return;
      event.preventDefault();
      clearTimeout(swipeIdle);
      swipeIdle = setTimeout(() => { swipeAmount = 0; swipeLocked = false; }, 180);
      if (swipeLocked) return;
      const delta = event.deltaX * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerWidth : 1);
      if (swipeAmount && Math.sign(swipeAmount) !== Math.sign(delta)) swipeAmount = 0;
      swipeAmount += delta;
      if (Math.abs(swipeAmount) < 45) return;
      const destination = swipeAmount > 0 ? 'friends' : 'menu';
      swipeAmount = 0; swipeLocked = true;
      if ((destination === 'friends') !== !$('sideFriendsView').hidden) { tab(destination); $('sideNavigation').scrollTop = 0; }
    }, {passive: false});
    if (currentAccount) attach(); else render();
  });
  window.sakuSocialTab = tab; window.sakuFriendsAttach = attach; window.sakuFriendsDetach = detach; window.sakuFriendsPublish = function () {};
  window.__sakuFriendsTest = {setSocial, render, search, action, getSocial: () => social, setUid: v => { uid = v; }};
})();
