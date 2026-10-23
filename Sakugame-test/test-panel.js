/* ============================================================
   🧪 SAKUGAME TEST BUILD — control panel (panel.js)
   ------------------------------------------------------------
   A floating panel that only exists in the TEST copy. It drives the
   REAL site code (no forked logic): fake Discord sign-ins, bot
   players in your room, solo launches of every game, phone/tablet
   frames, language switching and a one-click data reset.
   ============================================================ */
(function () {
  'use strict';

  var CSS = [
    '#tPanel{position:fixed;right:14px;bottom:14px;z-index:2147483000;width:308px;max-height:82vh;',
    'overflow:auto;background:#12121e;color:#e8e8f2;border:1px solid #34345a;border-radius:14px;',
    'box-shadow:0 18px 50px rgba(0,0,0,.55);font:12px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}',
    '#tPanel *{box-sizing:border-box}',
    '#tPanel .tp-h{display:flex;align-items:center;gap:8px;padding:10px 12px;background:linear-gradient(90deg,#5865F2,#7a5cff);',
    'border-radius:13px 13px 0 0;cursor:pointer;position:sticky;top:0;z-index:2}',
    '#tPanel .tp-h b{font-size:12.5px;letter-spacing:.2px;flex:1}',
    '#tPanel .tp-h span{font-size:10.5px;opacity:.9}',
    '#tPanel .tp-b{padding:10px 12px 12px;display:none}',
    '#tPanel.open .tp-b{display:block}',
    '#tPanel h5{margin:12px 0 6px;font-size:10.5px;letter-spacing:.9px;text-transform:uppercase;color:#9aa0d0}',
    '#tPanel h5:first-child{margin-top:0}',
    '#tPanel .tp-r{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:5px}',
    '#tPanel button{font:inherit;color:#e8e8f2;background:#23233c;border:1px solid #3a3a5e;border-radius:8px;',
    'padding:5px 8px;cursor:pointer;transition:.12s}',
    '#tPanel button:hover{background:#2e2e50;border-color:#5865F2}',
    '#tPanel button.dc{background:#5865F2;border-color:#7a8bff}',
    '#tPanel button.dc:hover{background:#6a78ff}',
    '#tPanel button.warn{background:#3a2a1e;border-color:#7a5a2e}',
    '#tPanel button.danger{background:#3a1e26;border-color:#7a2e42}',
    '#tPanel button.on{background:#0f7a3d;border-color:#12a352}',
    '#tPanel .tp-s{padding:7px 8px;background:#0d0d18;border:1px solid #2a2a48;border-radius:8px;',
    'font:11px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:#a8e6c0;white-space:pre-wrap;margin-bottom:6px}',
    '#tPanel .tp-l{font:10.5px/1.4 ui-monospace,Menlo,monospace;color:#8f96c9;max-height:64px;overflow:auto;',
    'border-top:1px dashed #2a2a48;padding-top:6px;margin-top:4px}',
    '#tPanel .tp-frame{position:fixed;inset:0;z-index:2147482999;background:rgba(6,6,14,.94);display:none;',
    'flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px}',
    '#tPanel .tp-frame.show{display:flex}',
    '#tPanel .tp-frame iframe{width:100%;height:100%;border:2px solid #34345a;border-radius:18px;background:#0b0b14}',
    '#tPanel .tp-frame .tp-bar{display:flex;gap:8px;align-items:center;color:#cfd3ff;font-size:12px}',
    '#tPanel .tp-frame .tp-bar select{background:#23233c;color:#e8e8f2;border:1px solid #3a3a5e;border-radius:6px;padding:4px 6px}'
  ].join('\n');

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function btn(label, cls, fn) {
    var b = el('button', cls, label);
    b.type = 'button';
    b.addEventListener('click', function (ev) { ev.preventDefault(); try { fn(b); } catch (e) { log('⚠️ ' + e.message); } });
    return b;
  }
  function row() { return el('div', 'tp-r'); }
  function head(txt) { return el('h5', null, txt); }

  var LOG = [];
  function log(msg) {
    LOG.unshift(msg);
    if (LOG.length > 8) LOG.pop();
    if (logEl) logEl.textContent = LOG.join('\n');
  }

  /* ---------------- fake Discord sign-in ---------------- */
  function signInAs(token) {
    try { localStorage.setItem('saku-dc-pending', 'signin'); } catch (e) {}
    location.hash = '#access_token=' + encodeURIComponent(token) + '&token_type=Bearer&expires_in=604800';
    log('→ Discord return for ' + token + ' — reloading…');
    setTimeout(function () { location.reload(); }, 30);
  }
  function guestMode() {
    try { localStorage.removeItem('saku-acct-session'); } catch (e) {}
    log('→ guest mode');
    if (typeof changeUsername === 'function') changeUsername();
    else location.reload();
  }

  /* ---------------- bots ---------------- */
  var BOT_NAMES = ['Bot Rukia', 'Bot Ichigo', 'Bot Zero Two', 'Bot Yor', 'Bot Killua', 'Bot Nezuko', 'Bot Gojo', 'Bot Mikasa'];
  var BOT_AVS = ['test-avatars/u1.jpg', 'test-avatars/u2.jpg', 'test-avatars/u3.jpg', 'test-avatars/u1.jpg',
    'test-avatars/u2.jpg', 'test-avatars/u3.jpg', 'test-avatars/u1.jpg', 'test-avatars/u2.jpg'];
  function roomRef() { return (typeof roomCode !== 'undefined' && roomCode) ? database.ref('rooms/' + roomCode) : null; }
  function myId() { return (typeof playerId !== 'undefined') ? playerId : null; }
  function bots() {
    var r = (typeof currentRoom !== 'undefined' && currentRoom) ? currentRoom : null;
    if (!r || !r.players) return [];
    return Object.keys(r.players).filter(function (id) { return id !== myId() && /^bot_/.test(id); });
  }
  function addBot() {
    var ref = roomRef(); if (!ref) return log('⚠️ no room — create one first');
    var have = bots().length;
    if (have >= BOT_NAMES.length) return log('⚠️ 8 bots max');
    var id = 'bot_' + Date.now().toString(36) + Math.floor(Math.random() * 999);
    ref.child('players').child(id).set({
      id: id, name: BOT_NAMES[have], ready: true, isHost: false, avatar: BOT_AVS[have], bot: true
    });
    ref.child('lastActivity').set(Date.now());
    log('+ bot ' + BOT_NAMES[have]);
  }
  function fillRoom(n) {
    var ref = roomRef(); if (!ref) return log('⚠️ no room — create one first');
    var r = (typeof currentRoom !== 'undefined') ? currentRoom : {};
    var cur = Object.keys(r.players || {}).length;
    var up = {};
    var added = 0;
    while (cur < n && added < 8) {
      var id = 'bot_' + Date.now().toString(36) + Math.floor(Math.random() * 999);
      up['players/' + id] = { id: id, name: BOT_NAMES[added], ready: true, isHost: false, avatar: BOT_AVS[added], bot: true };
      cur++; added++;
    }
    ref.update(Object.assign({ lastActivity: Date.now() }, up));
    log('+ ' + added + ' bots (room → ' + cur + ')');
  }
  function toggleBotsReady() {
    var ref = roomRef(); if (!ref) return log('⚠️ no room');
    var b = bots(); if (!b.length) return log('⚠️ no bots in the room');
    var want = !((currentRoom.players[b[0]] || {}).ready === true);
    var up = {};
    b.forEach(function (id) { up['players/' + id + '/ready'] = want; });
    ref.update(up);
    log(want ? 'bots → ready' : 'bots → not ready');
  }
  function kickBots() {
    var ref = roomRef(); if (!ref) return log('⚠️ no room');
    var b = bots(); if (!b.length) return log('⚠️ no bots in the room');
    var up = {};
    b.forEach(function (id) { up['players/' + id] = null; });
    ref.update(up);
    log('− ' + b.length + ' bots');
  }
  function hostToBot() {
    var ref = roomRef(); if (!ref) return log('⚠️ no room');
    var b = bots(); if (!b.length) return log('⚠️ no bots — add one first');
    var id = b[0];
    var up = { host: id, lastActivity: Date.now() };
    up['players/' + id + '/isHost'] = true;
    up['players/' + myId() + '/isHost'] = false;
    ref.update(up);
    log('host → ' + (currentRoom.players[id].name || id));
  }
  /* DS selection: the bots pick a real character off the dealt board */
  function botsPick() {
    var ref = roomRef(); if (!ref) return log('⚠️ no room');
    var r = (typeof currentRoom !== 'undefined') ? currentRoom : {};
    var board = r.characters || [];
    var b = bots();
    if (!board.length) return log('⚠️ no board yet — press Start in the lobby');
    if (!b.length) return log('⚠️ no bots in the room');
    var up = {};
    b.forEach(function (id, i) {
      var c = board[(i + 1) % board.length];
      if (c) up['selections/' + id] = c.id;
    });
    ref.update(up);
    log('bots picked ' + Object.keys(up).length + ' characters');
  }
  /* Seed rooms so the 🌐 public-room browser has something to show */
  function seedPublicRooms() {
    var GAMES = ['guesswho', 'undercover', 'blur', 'snapshot', 'hotcold', 'codenames', 'race', 'battle'];
    var now = Date.now();
    var up = {};
    for (var i = 0; i < 3; i++) {
      var code = String(1000 + Math.floor(Math.random() * 8999));
      var g = GAMES[i % GAMES.length];
      var pid = 'seed_' + i;
      up['rooms/' + code] = {
        host: pid, game: g, visibility: 'public', state: 'lobby', maxPlayers: 8,
        players: {
          [pid]: { id: pid, name: 'Host ' + (i + 1), ready: true, isHost: true, avatar: BOT_AVS[i] },
          ['seed_' + i + '_b']: { id: 'seed_' + i + '_b', name: 'Player ' + (i + 1), ready: true, isHost: false, avatar: BOT_AVS[(i + 1) % 3] }
        },
        chat: {}, createdAt: now - 60000 * (i + 1), lastActivity: now - 1000 * (i + 1),
        settings: { characterCount: 24, source: 'generic' }
      };
    }
    database.ref().update(up);
    log('3 public rooms seeded');
  }

  /* ---------------- screens & games ---------------- */
  var SCREENS = [
    ['Home', 'homepageScreen'], ['Games', 'gamesMenuScreen'], ['Play', 'playMenuScreen'],
    ['Join', 'joinRoomScreen'], ['Host room', 'hostRoomScreen']
  ];
  var GAMES = [
    ['DS', 'guesswho'], ['UC', 'undercover'], ['Battle', 'battle'], ['Race', 'race'],
    ['Blur', 'blur'], ['Snapshot', 'snapshot'], ['Hot/Cold', 'hotcold'], ['Codenames', 'codenames']
  ];
  function hostGame(g) {
    if (typeof showHostRoom === 'function') showHostRoom();
    var sel = document.getElementById('gameSelect');
    if (sel) sel.value = g;
    if (typeof onGameSelectChange === 'function') { try { onGameSelectChange(); } catch (e) {} }
    setTimeout(function () {
      if (typeof createGameRoom === 'function') createGameRoom();
      else log('⚠️ createGameRoom() missing');
    }, 60);
    log('hosting ' + g + '…');
  }
  function openProfile() { if (typeof openAuthModal === 'function') openAuthModal(); else log('⚠️ openAuthModal() missing'); }

  /* ---------------- phone / tablet frame ---------------- */
  var frame = null;
  function toggleFrame(w, h) {
    if (frame) { frame.classList.remove('show'); return; }
    frame = el('div', 'tp-frame');
    var bar = el('div', 'tp-bar');
    var sel = el('select');
    [['Phone 390×844', 390, 844], ['Phone 430×932', 430, 932], ['Tablet 820×1180', 820, 1180], ['Desktop 1280×800', 1280, 800]]
      .forEach(function (o) { var op = el('option', null, o[0]); op.value = o[1] + 'x' + o[2]; sel.appendChild(op); });
    sel.value = w + 'x' + h;
    var ifr = el('iframe');
    ifr.src = 'index.html';
    function size() {
      var p = sel.value.split('x');
      ifr.style.width = Math.min(p[0], window.innerWidth - 40) + 'px';
      ifr.style.height = Math.min(p[1], window.innerHeight - 90) + 'px';
    }
    sel.addEventListener('change', size);
    var close = btn('✕ Close', 'warn', function () { frame.classList.remove('show'); frame = null; });
    bar.appendChild(sel); bar.appendChild(close);
    frame.appendChild(bar); frame.appendChild(ifr);
    document.body.appendChild(frame);
    size();
    frame.classList.add('show');
    log('frame ' + sel.value);
  }

  /* ---------------- build the panel ---------------- */
  var style = el('style', null, CSS);
  document.head.appendChild(style);

  var bodyEl = el('div', 'tp-b');
  var logEl = el('div', 'tp-l', '');
  var statusEl = el('div', 'tp-s', '…');

  var hdr = el('div', 'tp-h', '<b>🧪 TEST BUILD</b><span>fake backend</span>');
  var panel = el('div', '', '');
  panel.id = 'tPanel';
  panel.appendChild(hdr);
  panel.appendChild(bodyEl);
  hdr.addEventListener('click', function () { panel.classList.toggle('open'); });

  // Accounts
  var r1 = row();
  r1.appendChild(btn('🥷 Ninja Tester', 'dc', function () { signInAs('TEST-NINJA'); }));
  r1.appendChild(btn('🌸 Sakura', 'dc', function () { signInAs('TEST-SAKURA'); }));
  r1.appendChild(btn('👻 Ghost (no pfp)', 'dc', function () { signInAs('TEST-GHOST'); }));
  var r2 = row();
  r2.appendChild(btn('Guest', '', guestMode));
  r2.appendChild(btn('Log out', '', function () { if (typeof logoutAccount === 'function') logoutAccount(); }));
  r2.appendChild(btn('Wipe accounts', 'danger', function () { __TEST_DB.set('accounts', null); try { localStorage.removeItem('saku-acct-session'); } catch (e) {} log('accounts wiped'); }));
  bodyEl.appendChild(head('Discord accounts'));
  bodyEl.appendChild(r1); bodyEl.appendChild(r2);

  // Room
  var r3 = row();
  r3.appendChild(btn('+ Bot', '', addBot));
  r3.appendChild(btn('Fill to 6', '', function () { fillRoom(6); }));
  r3.appendChild(btn('Toggle ready', '', toggleBotsReady));
  var r4 = row();
  r4.appendChild(btn('Kick bots', 'warn', kickBots));
  r4.appendChild(btn('Host → bot', 'warn', hostToBot));
  r4.appendChild(btn('Bot picks (DS)', '', botsPick));
  var r5 = row();
  r5.appendChild(btn('Seed public rooms', '', seedPublicRooms));
  r5.appendChild(btn('Leave room', 'warn', function () { if (typeof leaveRoom === 'function') leaveRoom(true); else log('⚠️ leaveRoom() missing'); }));
  bodyEl.appendChild(head('Room helpers'));
  bodyEl.appendChild(r3); bodyEl.appendChild(r4); bodyEl.appendChild(r5);

  // Screens
  var r6 = row();
  SCREENS.forEach(function (s) { r6.appendChild(btn(s[0], '', function () { showScreen(s[1]); })); });
  bodyEl.appendChild(head('Screens'));
  bodyEl.appendChild(r6);
  var r6b = row();
  r6b.appendChild(btn('Profile menu', '', openProfile));
  r6b.appendChild(btn('Avatar picker', '', function () { if (typeof openAvatarModal === 'function') openAvatarModal(); }));
  r6b.appendChild(btn('Delete-account modal', '', function () { if (typeof openDeleteAccountModal === 'function') openDeleteAccountModal(); }));
  bodyEl.appendChild(r6b);

  // Games
  var r7 = row();
  GAMES.forEach(function (g) { r7.appendChild(btn(g[0], '', function () { hostGame(g[1]); })); });
  bodyEl.appendChild(head('Solo launch a game'));
  bodyEl.appendChild(r7);

  // View
  var r8 = row();
  r8.appendChild(btn('📱 Phone frame', '', function () { toggleFrame(390, 844); }));
  r8.appendChild(btn('💻 Tablet frame', '', function () { toggleFrame(820, 1180); }));
  var r9 = row();
  r9.appendChild(btn('EN', '', function () { sakuSetLang('en'); }));
  r9.appendChild(btn('FR', '', function () { sakuSetLang('fr'); }));
  r9.appendChild(btn('ES', '', function () { sakuSetLang('es'); }));
  r9.appendChild(btn('Admin mode', '', function () { if (typeof sakuAdminToggle === 'function') sakuAdminToggle(); }));
  bodyEl.appendChild(head('View & language'));
  bodyEl.appendChild(r8); bodyEl.appendChild(r9);

  // Data
  var r10 = row();
  r10.appendChild(btn('♻️ Reset ALL test data', 'danger', function () {
    if (!confirm('Wipe the whole test database (rooms, accounts, stats)?')) return;
    __TEST_DB.reset();
    try { localStorage.removeItem('saku-acct-session'); localStorage.removeItem('saku-dc-cache'); } catch (e) {}
    log('test database reset');
    setTimeout(function () { location.reload(); }, 200);
  }));
  bodyEl.appendChild(head('Data'));
  bodyEl.appendChild(r10);

  bodyEl.appendChild(statusEl);
  bodyEl.appendChild(logEl);
  document.body.appendChild(panel);
  panel.classList.add('open');

  /* ---------------- status ticker ---------------- */
  function tick() {
    var acct = '—';
    try {
      if (typeof currentAccount !== 'undefined' && currentAccount) acct = currentAccount.username + ' (dc)';
      else if (typeof playerName !== 'undefined' && playerName) acct = 'guest · ' + playerName;
    } catch (e) {}
    var room = (typeof roomCode !== 'undefined' && roomCode) ? roomCode + (typeof isHost !== 'undefined' && isHost ? ' ·host' : '') : 'no room';
    var n = 0;
    try { n = Object.keys((typeof currentRoom !== 'undefined' && currentRoom && currentRoom.players) || {}).length; } catch (e) {}
    var admin = 'off';
    try { admin = (typeof sakuIsAdmin === 'function' && sakuIsAdmin()) ? 'ON' : 'off'; } catch (e) {}
    var listeners = 0;
    try { listeners = __TEST_DB.listenerCount(); } catch (e) {}
    statusEl.textContent = 'account : ' + acct + '\nroom    : ' + room + ' · ' + n + ' player(s)\n'
      + 'admin   : ' + admin + '   listeners: ' + listeners + '\nbuild   : ' + (document.querySelector('meta[name="saku-build"]') || {}).getAttribute
      ? (document.querySelector('meta[name="saku-build"]').getAttribute('content') || '?') : '?';
  }
  setInterval(tick, 700); tick();
  log('test panel ready — ' + Object.keys(__TEST_DB.raw() || {}).length + ' top-level key(s) in the fake DB');
})();
