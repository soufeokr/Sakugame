/* Sakugame — notifications (cloche de la barre du haut, ordinateur) et invitations dans un salon.
   • Serveur (migration 319) : ventes, enchères remportées, surenchères, demandes d'ami, échanges,
     parrainages et invitations de salon arrivent par notif_list (interrogé toutes les 25 s).
   • Navigateur : les quêtes terminées sont déduites de l'état des quêtes (progression.js) ;
     on retient localement celles déjà signalées pour ne les annoncer qu'une fois.
   • Les invitations de salon s'affichent aussi en bandeau, sur téléphone comme sur ordinateur. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const L3 = (fr, en, es) => ({fr, en, es}[(window.SAKU_I18N || {}).lang] || en);
  const rpc = (name, args) => window.sakuRpc(name, args || {});
  const POLL_MS = 25000, LOCAL_MAX = 15;

  let uid = null, items = [], local = [], unread = 0, maxId = 0, timer = null, busy = false, open = false, firstLoad = true;
  const toasted = new Set();

  /* ---------- petits utilitaires ---------- */
  const nf = n => { try { return Number(n).toLocaleString((window.SAKU_I18N || {}).lang || undefined); } catch (e) { return String(n); } };
  function cardName(id) {
    try { const c = window.sakuMarket && window.sakuMarket.card(String(id)); if (c && c.name) return c.name; } catch (e) {}
    return '#' + id;
  }
  function gameName(g) {
    if (g === 'arena') return 'Arena';
    try { if (typeof GAME_LABELS !== 'undefined' && GAME_LABELS[g]) return typeof t === 'function' ? t(GAME_LABELS[g]) : GAME_LABELS[g]; } catch (e) {}
    return L3('un jeu', 'a game', 'un juego');
  }
  function ago(iso) {
    const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
    if (!isFinite(s)) return '';
    if (s < 60) return L3("à l'instant", 'just now', 'ahora');
    const m = Math.floor(s / 60); if (m < 60) return L3('il y a ' + m + ' min', m + ' min ago', 'hace ' + m + ' min');
    const h = Math.floor(m / 60); if (h < 24) return L3('il y a ' + h + ' h', h + ' h ago', 'hace ' + h + ' h');
    const d = Math.floor(h / 24); return L3('il y a ' + d + ' j', d + ' d ago', 'hace ' + d + ' d');
  }
  const okAvatar = a => a && /^https:\/\/[^\s"'<>]+$/i.test(String(a));
  function avatarHtml(n) {
    if (n.kind === 'quest') return '<span class="notif-ava notif-ava-icon notif-ava-quest" aria-hidden="true"><svg class="ic"><use href="#i-trophy"/></svg></span>';
    const name = String(n.actor_name || '?');
    return '<span class="notif-ava" aria-hidden="true">' + (okAvatar(n.actor_avatar) ? '<img src="' + esc(n.actor_avatar) + '" alt="" loading="lazy" onerror="this.remove()">' : '') + '<b>' + esc(name.trim().charAt(0).toUpperCase() || '?') + '</b></span>';
  }
  const ICON = {sale: 'coin', auction_won: 'coin', outbid: 'coin', friend_request: 'user', friend_accept: 'user', trade_request: 'trade', trade_counter: 'trade', trade_accepted: 'trade', referral: 'gift', room_invite: 'game', quest: 'quest'};

  /* ---------- texte de chaque notification ---------- */
  function text(n) {
    const who = '<b data-noi18n>' + esc(n.actor_name || L3('Un joueur', 'A player', 'Un jugador')) + '</b>', d = n.data || {};
    const card = '<b data-noi18n>' + esc(cardName(d.card)) + '</b>', price = '<b class="notif-coins">' + nf(d.price || 0) + '</b>';
    switch (n.kind) {
      case 'sale': return d.auction
        ? L3('Enchère terminée : ' + card + ' vendue à ' + who + ' pour ' + price + ' pièces.', 'Auction over: ' + card + ' sold to ' + who + ' for ' + price + ' coins.', 'Subasta terminada: ' + card + ' vendida a ' + who + ' por ' + price + ' monedas.')
        : L3(who + ' a acheté ta carte ' + card + ' pour ' + price + ' pièces.', who + ' bought your card ' + card + ' for ' + price + ' coins.', who + ' compró tu carta ' + card + ' por ' + price + ' monedas.');
      case 'auction_won': return L3('Tu as remporté l\'enchère : ' + card + ' pour ' + price + ' pièces.', 'You won the auction: ' + card + ' for ' + price + ' coins.', 'Ganaste la subasta: ' + card + ' por ' + price + ' monedas.');
      case 'outbid': return L3(who + ' a surenchéri sur ' + card + ' : ' + price + ' pièces. Tes pièces t\'ont été rendues.', who + ' outbid you on ' + card + ': ' + price + ' coins. Your coins were returned.', who + ' superó tu puja por ' + card + ': ' + price + ' monedas. Te devolvimos tus monedas.');
      case 'friend_request': return L3(who + ' t\'a envoyé une demande d\'ami.', who + ' sent you a friend request.', who + ' te envió una solicitud de amistad.');
      case 'friend_accept': return L3(who + ' a accepté ta demande d\'ami.', who + ' accepted your friend request.', who + ' aceptó tu solicitud de amistad.');
      case 'trade_request': return L3(who + ' te propose un échange.', who + ' offers you an exchange.', who + ' te propone un intercambio.');
      case 'trade_counter': return L3(who + ' a fait une contre-proposition à ton échange.', who + ' made a counter-offer to your exchange.', who + ' hizo una contrapropuesta a tu intercambio.');
      case 'trade_accepted': return L3(who + ' a accepté ton échange.', who + ' accepted your exchange.', who + ' aceptó tu intercambio.');
      case 'referral': return L3(who + ' a rejoint Sakugame grâce à ton lien de parrainage.', who + ' joined Sakugame with your referral link.', who + ' se unió a Sakugame con tu enlace de referido.');
      case 'room_invite': return L3(who + ' t\'invite dans son salon ' + '<b>' + esc(gameName(d.game)) + '</b>.', who + ' invites you to their ' + '<b>' + esc(gameName(d.game)) + '</b> room.', who + ' te invita a su sala de ' + '<b>' + esc(gameName(d.game)) + '</b>.');
      case 'quest': return d.n > 1
        ? L3('<b>' + d.n + ' quêtes terminées</b> : récupère tes récompenses.', '<b>' + d.n + ' quests completed</b>: claim your rewards.', '<b>' + d.n + ' misiones completadas</b>: reclama tus recompensas.')
        : L3('<b>Quête terminée</b> : récupère ta récompense.', '<b>Quest completed</b>: claim your reward.', '<b>Misión completada</b>: reclama tu recompensa.');
      default: return L3('Nouvelle notification.', 'New notification.', 'Nueva notificación.');
    }
  }
  const inviteFresh = n => n.kind === 'room_invite' && Date.now() - Date.parse(n.created_at) < 30 * 60000;

  /* ---------- action au clic ---------- */
  function go(n) {
    const d = n.data || {};
    close();
    try {
      if (n.kind === 'sale' || n.kind === 'auction_won' || n.kind === 'outbid' || /^trade_/.test(n.kind)) { if (window.showMarket) window.showMarket({tab: 'deals'}); }
      else if (n.kind === 'friend_request' || n.kind === 'friend_accept') { if (window.sakuNavOpen) window.sakuNavOpen(); if (window.sakuSocialTab) window.sakuSocialTab('friends'); }
      else if (n.kind === 'referral') { if (window.sakuReferralOpen) window.sakuReferralOpen(); }
      else if (n.kind === 'quest') { if (typeof showQuests === 'function') showQuests(); }
      else if (n.kind === 'room_invite' && d.code) joinRoom(d.code, d.game);
    } catch (e) { console.warn(e); }
  }
  // Arena n'existe que sur la version test du site : ses invitations y mènent.
  const ARENA_TEST_URL = 'https://soufeokr.github.io/Sakugame/test/';
  function joinRoom(code, game) {
    code = String(code || '').toUpperCase();
    if (!/^[A-Z0-9]{4}$/.test(code)) return;
    if (game === 'arena') {
      if (typeof window.sakuArenaJoin === 'function') window.sakuArenaJoin(code);
      else location.href = ARENA_TEST_URL + '?arena=' + code;
      return;
    }
    if (typeof roomCode !== 'undefined' && roomCode === code) { if (typeof showScreen === 'function') showScreen('lobbyScreen'); return; }
    if (typeof joinRoomByCode === 'function') joinRoomByCode(code);
  }

  /* ---------- quêtes terminées (déduites de l'état des quêtes) ---------- */
  const qKey = () => 'sakuNotifQuests:' + uid, lKey = () => 'sakuNotifLocal:' + uid;
  function loadLocal() { try { local = JSON.parse(localStorage.getItem(lKey()) || '[]').filter(x => x && x.kind === 'quest').slice(0, LOCAL_MAX); } catch (e) { local = []; } }
  function saveLocal() { try { localStorage.setItem(lKey(), JSON.stringify(local.slice(0, LOCAL_MAX))); } catch (e) {} }
  function readyKeys(s) {
    const keys = [];
    (s.daily_quests || []).forEach(q => { if (q.ready && !q.claimed) keys.push('d:' + s.day + ':' + q.id); });
    (s.weekly_quests || []).forEach(q => { if (q.ready && !q.claimed) keys.push('w:' + s.week + ':' + q.id); });
    (s.game_quests || []).forEach(q => { if (q.ready) keys.push('g:' + q.id + ':' + q.tier); });
    (s.collection_quests || []).concat(s.milestone_quests || []).forEach(q => { if (q.ready) keys.push('c:' + q.id + ':' + q.tier); });
    return keys;
  }
  function onQuests(s) {
    if (!uid || !s) return;
    let seen = null; try { seen = JSON.parse(localStorage.getItem(qKey()) || 'null'); } catch (e) {}
    const keys = readyKeys(s);
    if (!Array.isArray(seen)) { try { localStorage.setItem(qKey(), JSON.stringify(keys)); } catch (e) {} return; } // premier passage : rien à annoncer
    const fresh = keys.filter(k => seen.indexOf(k) < 0);
    if (!fresh.length) return;
    const all = seen.concat(fresh).slice(-200);
    try { localStorage.setItem(qKey(), JSON.stringify(all)); } catch (e) {}
    local.unshift({id: 'q' + Date.now(), kind: 'quest', data: {n: fresh.length}, created_at: new Date().toISOString(), read: false});
    saveLocal(); render();
  }

  /* ---------- liste et badge ---------- */
  function all() {
    return items.concat(local).sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0, 50);
  }
  function unreadCount() { return unread + local.filter(x => !x.read).length; }
  function render() {
    const btn = $('notifButton'), badge = $('notifBadge');
    if (btn) btn.hidden = !uid;
    const n = uid ? unreadCount() : 0;
    if (badge) { badge.hidden = !n; badge.textContent = n > 9 ? '9+' : String(n); }
    if (btn) btn.setAttribute('aria-label', L3('Notifications', 'Notifications', 'Notificaciones') + (n ? ' (' + n + ')' : ''));
    const list = $('notifList'); if (!list || !open) return;
    const rows = all();
    if (!rows.length) { list.innerHTML = '<p class="notif-empty">' + esc(L3('Aucune notification pour l\'instant. Les ventes, échanges, demandes d\'ami, quêtes terminées et invitations apparaîtront ici.', 'No notifications yet. Sales, exchanges, friend requests, completed quests and invitations will show up here.', 'Aún no hay notificaciones. Aquí aparecerán ventas, intercambios, solicitudes de amistad, misiones completadas e invitaciones.')) + '</p>'; return; }
    list.innerHTML = rows.map(n => {
      const join = n.kind === 'room_invite' && n.data && n.data.code ? (inviteFresh(n) ? '<span class="notif-join">' + esc(L3('Rejoindre', 'Join', 'Unirse')) + ' · ' + esc(n.data.code) + '</span>' : '<span class="notif-join notif-join-old">' + esc(L3('Salon', 'Room', 'Sala')) + ' ' + esc(n.data.code) + '</span>') : '';
      return '<button type="button" class="notif-item notif-' + esc(n.kind) + (n.read ? '' : ' is-unread') + '" data-nid="' + esc(n.id) + '">' + avatarHtml(n) +
        '<span class="notif-body"><span class="notif-text">' + text(n) + '</span><span class="notif-meta"><i class="notif-kind notif-kind-' + esc(ICON[n.kind] || 'x') + '"></i>' + esc(ago(n.created_at)) + join + '</span></span>' +
        (n.read ? '' : '<span class="notif-dot" aria-hidden="true"></span>') + '</button>';
    }).join('');
  }

  /* ---------- serveur ---------- */
  async function poll(force) {
    if (!uid || busy || !window.sakuRpc) return;
    if (document.hidden && !force) return;
    busy = true; const me = uid;
    try {
      const r = await rpc('notif_list', {p_after: firstLoad ? 0 : maxId});
      if (me !== uid || !r) return;
      const got = Array.isArray(r.items) ? r.items : [];
      if (firstLoad) { items = got; firstLoad = false; got.forEach(n => toasted.add(String(n.id))); }
      else if (got.length) {
        const known = new Set(items.map(n => String(n.id)));
        items = got.filter(n => !known.has(String(n.id))).concat(items).slice(0, 60);
        got.forEach(n => { if (n.kind === 'room_invite' && !n.read && inviteFresh(n) && !toasted.has(String(n.id))) inviteToast(n); toasted.add(String(n.id)); });
      }
      items.forEach(n => { if (Number(n.id) > maxId) maxId = Number(n.id); });
      unread = Math.max(0, Number(r.unread) || 0);
      render();
    } catch (e) { /* hors ligne ou session expirée : on réessaiera */ }
    finally { busy = false; }
  }
  async function markRead() {
    local.forEach(x => { x.read = true; }); saveLocal();
    if (unread && maxId) {
      items.forEach(n => { n.read = true; }); unread = 0; render();
      try { await rpc('notif_mark_read', {p_upto: maxId}); } catch (e) {}
    } else render();
  }

  /* ---------- panneau ---------- */
  function toggle() { open ? close() : show(); }
  function show() {
    const p = $('notifPanel'); if (!p || !uid) return;
    open = true; p.hidden = false; $('notifButton').setAttribute('aria-expanded', 'true');
    render(); poll(true);
    // ce qui était non lu reste surligné tant que le panneau est ouvert
    setTimeout(() => { if (open) { local.forEach(x => { x.read = true; }); saveLocal(); if (unread) { unread = 0; const b = $('notifBadge'); if (b) b.hidden = true; rpc('notif_mark_read', {p_upto: maxId}).catch(() => {}); } else render(); } }, 1200);
  }
  function close() {
    const p = $('notifPanel'); if (!p || !open) return;
    open = false; p.hidden = true; const b = $('notifButton'); if (b) b.setAttribute('aria-expanded', 'false');
    items.forEach(n => { n.read = true; }); render();
  }

  /* ---------- bandeau d'invitation (toutes plateformes) ---------- */
  function inviteToast(n) {
    if (!n.data || !n.data.code) return;
    if (typeof roomCode !== 'undefined' && roomCode === String(n.data.code).toUpperCase()) return;
    let box = $('notifToasts'); if (!box) { box = document.createElement('div'); box.id = 'notifToasts'; box.className = 'notif-toasts'; document.body.appendChild(box); }
    const el = document.createElement('div'); el.className = 'notif-toast'; el.setAttribute('role', 'status');
    el.innerHTML = avatarHtml(n) + '<span class="notif-toast-text">' + text(n) + '</span><button type="button" class="notif-toast-join">' + esc(L3('Rejoindre', 'Join', 'Unirse')) + '</button><button type="button" class="notif-toast-x" aria-label="' + esc(L3('Fermer', 'Close', 'Cerrar')) + '">×</button>';
    el.querySelector('.notif-toast-join').addEventListener('click', () => { el.remove(); joinRoom(n.data.code, n.data.game); });
    el.querySelector('.notif-toast-x').addEventListener('click', () => el.remove());
    box.appendChild(el);
    try { if (window.SakuSfx) window.SakuSfx.play('tap'); } catch (e) {}
    setTimeout(() => el.remove(), 20000);
  }

  /* ---------- inviter quelqu'un dans le salon ---------- */
  let invSeq = 0, invTimer = null;
  const invited = new Map();
  function friends() { try { return (window.sakuFriendsList && window.sakuFriendsList()) || []; } catch (e) { return []; } }
  function inviteRow(p, isFriend) {
    const key = invCtx.code + ':' + p.id, done = invited.get(key);
    return '<div class="invite-row"><span class="notif-ava">' + (okAvatar(p.avatar) ? '<img src="' + esc(p.avatar) + '" alt="" loading="lazy" onerror="this.remove()">' : '') + '<b>' + esc(String(p.name || '?').trim().charAt(0).toUpperCase() || '?') + '</b></span>' +
      '<span class="invite-name" data-noi18n>' + esc(p.name || L3('Joueur', 'Player', 'Jugador')) + (isFriend ? '<small>' + esc(p.favorite ? L3('Ami favori', 'Favorite friend', 'Amigo favorito') : L3('Ami', 'Friend', 'Amigo')) + '</small>' : '') + '</span>' +
      '<button type="button" class="invite-send' + (done ? ' is-sent' : '') + '" data-invite="' + esc(p.id) + '"' + (done ? ' disabled' : '') + '>' + esc(done ? L3('Invité', 'Invited', 'Invitado') : L3('Inviter', 'Invite', 'Invitar')) + '</button></div>';
  }
  function renderInvite(results) {
    const list = $('inviteList'); if (!list) return;
    const fr = friends().slice().sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || String(a.name).localeCompare(String(b.name)));
    const q = String(($('inviteSearch') || {}).value || '').trim().toLocaleLowerCase();
    const frShown = q ? fr.filter(p => String(p.name || '').toLocaleLowerCase().includes(q)) : fr;
    const frIds = new Set(fr.map(p => p.id));
    const others = (results || []).filter(p => p && p.id && !frIds.has(p.id) && p.id !== uid);
    let html = '<h4>' + esc(L3('Amis', 'Friends', 'Amigos')) + ' <small>' + fr.length + '</small></h4>';
    html += frShown.length ? frShown.map(p => inviteRow(p, true)).join('') : '<p class="invite-empty">' + esc(fr.length ? L3('Aucun ami ne correspond.', 'No friend matches.', 'Ningún amigo coincide.') : L3('Tu n\'as pas encore d\'amis : cherche un joueur par son pseudo ci-dessus.', 'No friends yet: search a player by name above.', 'Aún no tienes amigos: busca un jugador por su nombre arriba.')) + '</p>';
    if (q.length >= 2) html += '<h4>' + esc(L3('Autres joueurs', 'Other players', 'Otros jugadores')) + '</h4>' + (results == null ? '<p class="invite-empty">' + esc(L3('Recherche…', 'Searching…', 'Buscando…')) + '</p>' : others.length ? others.map(p => inviteRow(p, false)).join('') : '<p class="invite-empty">' + esc(L3('Aucun joueur trouvé.', 'No player found.', 'Ningún jugador encontrado.')) + '</p>');
    list.innerHTML = html;
  }
  let lastResults = [];
  function searchInvite() {
    const q = String(($('inviteSearch') || {}).value || '').trim();
    clearTimeout(invTimer);
    if (q.length < 2) { lastResults = []; renderInvite([]); return; }
    renderInvite(null);
    const seq = ++invSeq;
    invTimer = setTimeout(async () => {
      try { const r = await rpc('social_search', {p_query: q}); if (seq !== invSeq) return; lastResults = Array.isArray(r) ? r : (r && r.results) || []; }
      catch (e) { if (seq !== invSeq) return; lastResults = []; }
      renderInvite(lastResults);
    }, 300);
  }
  const INVITE_ERR = {
    too_many_invites: () => L3('Trop d\'invitations envoyées : réessaie dans quelques minutes.', 'Too many invitations sent: try again in a few minutes.', 'Demasiadas invitaciones enviadas: inténtalo en unos minutos.'),
    player_unavailable: () => L3('Ce joueur n\'est plus disponible.', 'This player is no longer available.', 'Este jugador ya no está disponible.'),
    unavailable: () => L3('Invitation impossible.', 'Invitation unavailable.', 'Invitación imposible.')
  };
  async function sendInvite(btn) {
    const to = btn.dataset.invite, code = invCtx.code || null;
    if (!to || !code) return;
    btn.disabled = true; const msg = $('inviteMsg'); if (msg) msg.textContent = '';
    try {
      await rpc('notif_room_invite', {p_to: to, p_code: code, p_game: invCtx.game || ''});
      invited.set(code + ':' + to, true); btn.classList.add('is-sent'); btn.textContent = L3('Invité', 'Invited', 'Invitado');
    } catch (e) {
      btn.disabled = false; const k = String(e && e.message || '').trim();
      if (msg) msg.textContent = INVITE_ERR[k] ? INVITE_ERR[k]() : L3('L\'invitation n\'a pas pu être envoyée.', 'The invitation could not be sent.', 'No se pudo enviar la invitación.');
    }
  }
  // Salon des jeux du site par défaut ; Arena passe son propre code (openInvite(code, 'arena')).
  let invCtx = {code: '', game: ''};
  function openInvite(code, game) {
    if (typeof code !== 'string') code = typeof roomCode !== 'undefined' ? roomCode : '';
    if (!code) return;
    invCtx = {code: String(code).toUpperCase(), game: typeof game === 'string' ? game : ((typeof currentRoom !== 'undefined' && currentRoom && currentRoom.game) || '')};
    if (!uid) { if (typeof showNotification === 'function') showNotification(L3('Connecte-toi avec Discord pour inviter des joueurs.', 'Sign in with Discord to invite players.', 'Inicia sesión con Discord para invitar jugadores.')); return; }
    const d = $('inviteDialog'); if (!d) return;
    $('inviteSearch').value = ''; $('inviteMsg').textContent = ''; $('inviteCode').textContent = invCtx.code;
    lastResults = []; renderInvite([]);
    if (window.sakuFriendsRefresh) window.sakuFriendsRefresh().then(() => { if (d.open) renderInvite(lastResults); }).catch(() => {});
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    setTimeout(() => { try { $('inviteSearch').focus({preventScroll: true}); } catch (e) {} }, 50);
  }

  /* ---------- branchement ---------- */
  function attach() {
    const id = typeof sakuMyDcId === 'function' ? sakuMyDcId() : null;
    if (!id) { detach(); return; }
    if (id === uid) { poll(true); return; }
    detach(); uid = id; firstLoad = true; loadLocal(); render(); poll(true);
    timer = setInterval(() => poll(false), POLL_MS);
  }
  function detach() { uid = null; items = []; local = []; unread = 0; maxId = 0; firstLoad = true; clearInterval(timer); timer = null; close(); render(); }

  window.sakuNotifAttach = attach; window.sakuNotifDetach = detach; window.sakuNotifQuests = onQuests;
  window.sakuNotifToggle = toggle; window.sakuRoomInviteOpen = openInvite; window.sakuNotifPoll = () => poll(true);
  window.__sakuNotifTest = {setItems: (list, u) => { items = list || []; unread = items.filter(n => !n.read).length; render(); }, text, readyKeys, onQuests, inviteToast, renderInvite, setUid: v => { uid = v; render(); }, getLocal: () => local};

  document.addEventListener('DOMContentLoaded', () => {
    const list = $('notifList');
    if (list) list.addEventListener('click', e => { const b = e.target.closest('[data-nid]'); if (!b) return; const n = all().find(x => String(x.id) === b.dataset.nid); if (n) go(n); });
    const mark = $('notifMarkAll'); if (mark) mark.addEventListener('click', () => markRead());
    document.addEventListener('pointerdown', e => { if (!open) return; if (e.target.closest('#notifPanel,#notifButton')) return; close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) close(); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(true); });
    const inv = $('inviteDialog');
    if (inv) {
      inv.addEventListener('click', e => { if (e.target === inv) { inv.close(); return; } const b = e.target.closest('[data-invite]'); if (b && !b.disabled) sendInvite(b); });
      $('inviteSearch').addEventListener('input', searchInvite);
      $('inviteClose').addEventListener('click', () => inv.close());
    }
    window.addEventListener('saku-lang-change', () => render());
    if (typeof currentAccount !== 'undefined' && currentAccount) attach();
  });
})();
