    const firebaseConfig = {
      apiKey: "AIzaSyAbXV8BIBF5jdfGxIUja2tIEkRh72s2gaU",
      authDomain: "sakugame-e14de.firebaseapp.com",
      databaseURL: "https://sakugame-e14de-default-rtdb.europe-west1.firebasedatabase.app/",
      projectId: "sakugame-e14de",
      storageBucket: "sakugame-e14de.firebasestorage.app",
      messagingSenderId: "921379342493",
      appId: "1:921379342493:web:804fbf88163c2df0ddac74",
      measurementId: "G-EFHR28CLN5"
    };
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // 🔢 BUILD STAMP — must match <meta saku-build> in index.html.
    // If a stale index.html pairs with a fresh app.js (browser/Pages cache
    // mix after an update), the new code would crash on missing elements —
    // so we shout a loud "hard refresh!" warning instead of failing quietly.
    const SAKU_BUILD = '46';
    document.addEventListener('DOMContentLoaded', () => {
      const m = document.querySelector('meta[name="saku-build"]');
      const htmlBuild = m ? m.getAttribute('content') : null;
      if (htmlBuild !== SAKU_BUILD) {
        const msg = 'Cache mix detected (page build ' + (htmlBuild || '?') + ' ≠ app build ' + SAKU_BUILD + ') — please HARD REFRESH: Ctrl+Shift+R (phone: close the tab fully and reopen)!';
        console.error('[Sakugame] ' + msg);
        setTimeout(() => { try { showNotification(msg, 9000); } catch (e) { alert(msg); } }, 800);
      }
    });

    // ===== SVG ICON HELPER — inline UI icons from the sprite in index.html =====
    // Usage: ic('target') → <svg class="ic"><use href="#i-target"/></svg>
    // Icons inherit the text color (currentColor), so they always match.
    function ic(n, cls) {
      return '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>';
    }
    const GAME_ICONS = { guesswho: 'mask', undercover: 'spy', battle: 'users', race: 'bolt', blur: 'layers', hotcold: 'target' };

    // 🌐 i18n shims (lang.js). Everything stays English if lang.js fails to load.
    function tPO(id, vars) { // sentence pattern with a name/word inside
      if (window.tP) return tP(id, vars);
      var en = {
        pos_board: "{n}'s board", switch_board: "Switch to {n}'s board",
        secret_already: "{n}'s secret is already found — switch board with the color chips!",
        think_secret: "You think {n}'s secret is {c}?",
        guess_mode: "Guess mode: click the card you think is {n}'s secret! (you are on their glowing board)",
        hunt_secret: "Hunt {n}'s secret before the others!",
        wait_question: "You are the TARGET — wait for {n}'s question…",
        wait_answer: "Waiting for {n}'s answer…",
        found_secret: "{a} found {n}'s secret:",
        hc_direct: "🎯 DIRECT HIT! {n} WAS the secret — no scoring needed!",
        hc_round_word: "{c} guesses",
        hc_log_mine: "My guesses ({c})",
        hc_top_mine_tip: "{c} of your guesses logged",
        mix_label: "Mix: {v} generic · {r} favorites",
        hc_rescore: "0 = nothing alike · 100 = that's exactly it! If they're proposing <b>{s}</b>, just send 100 — otherwise answer honestly, it decides the round.",
        hc_hide_you: "You <b>HIDE</b> this round — pick any character from the pool!",
        hc_track: "Track down the secret — this is guess <b>#{c}</b>! Scores only guide you — every guess counts 1, so find it in as few as possible!",
        hc_wait_hide: "<b>{n}</b> is choosing the secret character…",
        hc_wait_score: "<b>{n}</b> is scoring your proposal…",
        hc_found: "<b>{n}</b> found the secret in <b>{c}</b> guesses!",
        hc_reveal: "The secret was <b>{s}</b>.",
        hc_continue_wait: "Waiting for <b>{n}</b> to start the next round…",
        hc_done_found: "You found it in <b>{c}</b> guesses — <b>{t}</b> total so far! Waiting for the others…",
        hc_done_bust: "Cap reached — <b>{t}</b> guesses on your total. Waiting for the others…",
        hc_ans_by: "<b>{n}</b>'s guess",
        hc_win_total: "<b>{n}</b> wins with the fewest guesses — <b>{t}</b> total!",
        hc_win_you_total: "Fewest guesses (<b>{t}</b> total) — <b>you win the Hot & Cold!</b>",
        hc_hidden_by: "hidden by {n}",
        hc_start_round: "Start round {r} — you hide!",
        hc_pts_found: "found it in {c}",
        hc_pts_bust: "busted at {c}",
        hc_pts_left: "dropped out",
        hc_draw: "Dead even on guesses — <b>it's a draw!</b>",
        hc_draw_pts: "Dead even on points — <b>it's a draw!</b>",
        hc_win_you_total_pts: "Most points (<b>{t}</b> total) — <b>you win the Hot & Cold!</b>",
        hc_win_total_pts: "<b>{n}</b> wins with the most points — <b>{t}</b> total!",
        hc_pts_word: "{c} pts",
        hc_wins_name: "<b>{n}</b> wins!",
        hc_by_forfeit: "by forfeit — too many players left",
        hc_top_plural: "{c} guesses logged"
      }[id] || id;
      return String(en).replace(/\{(\w+)\}/g, function (m, k) { return (vars && (k in vars)) ? vars[k] : m; });
    }
    function bgIsCovers() { // true in Blur 🎬 anime-covers mode (localized titles apply there only)
      const b = (currentRoom && currentRoom.bg) || {};
      const s = (currentRoom && currentRoom.settings) || {};
      return (b.mode || s.bgMode) === 'covers';
    }
    // Localized anime DISPLAY title (FR/ES picked from AniList synonyms; EN → unchanged)
    function dTitle(n) { return (window.SAKU_I18N ? SAKU_I18N.translateAnimeTitle(n) : n); }
    // Extra accepted guess spellings for a cover (its FR/ES titles)
    function dAlt(n) { return (window.SAKU_I18N ? SAKU_I18N.animeAltTitles(n) : []); }

    // ===== HOW TO PLAY — slideshow guides on the Games menu =====
    // Each game has a short step-by-step presentation with demo scenes (mock gameplay).
    var HT = { game: null, idx: 0 };
    const HT_POOL = (typeof GENERIC_CHARACTERS !== 'undefined' && GENERIC_CHARACTERS.length) ? GENERIC_CHARACTERS : [];
    const HT_BLUR_IMG = (typeof ANIME_COVERS !== 'undefined' && ANIME_COVERS.length) ? ANIME_COVERS[0].image : '';
    const HT_BLUR_NAME = (typeof ANIME_COVERS !== 'undefined' && ANIME_COVERS.length) ? ANIME_COVERS[0].name : 'anime cover';

    function htChip(txt, cls) { return '<span class="mk-chip' + (cls ? ' ' + cls : '') + '">' + txt + '</span>'; }
    function htQ(text, btn) {
      return '<div class="mk-q"><div class="mk-in">' + text + '</div><div class="mk-btn">' + (btn || 'Send') + '</div></div>';
    }
    function htScene(html) { return '<div class="mock">' + html + '</div>'; }

    // Real character photos straight from the game pool (characters.js)
    const HT_NAMES = ['Levi', 'Naruto Uzumaki', 'Eren Yeager', 'Mikasa Ackerman', 'Rem', 'Saitama', 'Light Yagami', 'Usagi Tsukino'];
    function htImgFail(img) { // fallback if a character photo ever fails to load
      const d = document.createElement('div');
      d.className = 'mk-face'; d.textContent = img.dataset.l || '?';
      img.replaceWith(d);
    }
    function htCharReal(name, extra) {
      const c = HT_POOL.find(function (x) { return x.name === name; }) || {};
      const face = c.image
        ? '<img class="mk-photo" src="' + c.image + '" alt="" loading="lazy" data-l="' + name[0] + '" onerror="htImgFail(this)">'
        : '<div class="mk-face">' + escapeHtml(name[0]) + '</div>';
      return '<div class="mk-char' + (extra ? ' ' + extra : '') + '"><div class="mk-photo-wrap">' + face + '</div><span class="mk-name">' + escapeHtml(name) + '</span>' + (extra === 'secret' ? '<span class="mk-badge">?</span>' : '') + '</div>';
    }
    const HT_BOARD = '<div class="mk-grid">' + HT_NAMES.map(function (n, i) { return htCharReal(n, i === 3 ? 'secret' : ''); }).join('') + '</div>';
    const HT_BOARD_OUT = '<div class="mk-grid">' + HT_NAMES.map(function (n, i) { return htCharReal(n, [0, 2, 6].indexOf(i) >= 0 ? 'out' : (i === 3 ? 'secret' : '')); }).join('') + '</div>';
    function htMiniBoard(who, outIdx) {
      const items = HT_NAMES.slice(0, 6).map(function (n, i) { return htCharReal(n, outIdx.indexOf(i) >= 0 ? 'out' : ''); }).join('');
      return '<div class="mk-mini"><div class="mk-label">' + who + '</div><div class="mk-grid mk-grid3">' + items + '</div></div>';
    }

    const HOWTO = {
      guesswho: { title: 'Anime Guess Who?', icon: 'mask', players: '2 players', slides: [
        { t: 'Two players, two secrets', d: 'You each receive a secret anime character from a shared AniList board. Take turns asking yes/no questions — the first player to name the opponent\'s secret wins.',
          s: htScene('<div class="mk-label">Your shared board (real game characters)</div>' + HT_BOARD + '<div class="mk-note">Every game deals one secret card to each player.</div>') },
        { t: 'Ask smart questions', d: 'On your turn, type one yes/no question about appearance, powers or series. The answer is public — pick questions that cut your remaining cards in half!',
          s: htScene(htQ('Does your character use a sword?') + '<div class="mk-chips">' + htChip('YES', 'ok') + htChip('NO', 'no') + '</div>') },
        { t: 'Eliminate as you go', d: 'Tap the cards on your own board to cross out characters that no longer fit. It is your personal workspace — organize it however you like.',
          s: htScene(HT_BOARD_OUT + '<div class="mk-note">3 eliminated — 5 suspects left.</div>') },
        { t: 'Make the final call', d: 'Confident about the secret? Fire your guess! A correct name wins the game instantly — a wrong one gives your opponent free information.',
          s: htScene(htQ('My guess: Mikasa Ackerman', 'GUESS!') + '<div class="mk-chips">' + htChip('Correct — you win!', 'ok') + '</div>') }
      ]},
      undercover: { title: 'Undercover', icon: 'spy', players: '3-8 players', slides: [
        { t: 'Secret roles', d: 'Everyone receives the same secret word… except one Undercover (a very similar word) and one Mr. White (no word at all). Peek at your card and keep it secret!',
          s: htScene('<div class="mk-roles3"><div class="mk-role">' + htChip('Citizen', 'ok') + '<div class="mk-word">Blue Lock</div></div><div class="mk-role">' + htChip('Undercover', 'no') + '<div class="mk-word">Ao Ashi</div></div><div class="mk-role">' + htChip('Mr. White', 'dim') + '<div class="mk-word">???</div></div></div><div class="mk-note">A real pair from the game — both are football anime!</div>') },
        { t: 'One clue each', d: 'Round after round, every player gives a one-word clue about their word. Citizens must prove they know it — without making it obvious for the impostors.',
          s: htScene('<div class="mk-log"><p><b>SakuraFan:</b> strikers</p><p><b>Kira_42:</b> football</p><p><b>Yuki:</b> ego</p><p><b>Tensa:</b> isagi</p></div>') },
        { t: 'Listen carefully', d: 'The Undercover bluffs with clues that almost fit, and Mr. White improvises from the other players\' clues. An odd clue is your best lead — remember who said what.',
          s: htScene('<div class="mk-log"><p><b>SakuraFan:</b> blue prison</p><p class="mk-odd"><b>Kira_42:</b> esperion youth team??</p><p><b>Tensa:</b> bachira</p><div class="mk-note">Esperion is the team in Ao Ashi — not in Blue Lock. Suspicious…</div></div>') },
        { t: 'Time to vote', d: 'After the clues, everyone votes to eliminate one suspect. The player with the most votes leaves — and their role is revealed to the table.',
          s: htScene('<div class="mk-chipwrap">' + htChip('SakuraFan') + htChip('Kira_42 (3 votes)', 'no') + htChip('Yuki') + htChip('Tensa') + '</div><div class="mk-note">Kira_42 was… the Undercover! Their word was Ao Ashi.</div>') },
        { t: 'How it ends', d: 'Citizens win by voting out every impostor. Impostors win once they equal the citizens. And Mr. White can steal everything: when caught, one correct guess of the secret word = instant solo win!',
          s: htScene('<div class="mk-chips">' + htChip('Citizens win!', 'ok') + htChip('Impostors win!', 'no') + htChip('Mr. White steals it!', 'dim') + '</div>') }
      ]},
      battle: { title: 'Guess Who — Battle Royale', icon: 'users', players: '3-8 players', slides: [
        { t: 'Everyone hides a secret', d: 'Each player secretly receives a character. 3 to 8 detectives sit at one big table — and everyone is both hunter and prey.',
          s: htScene('<div class="mk-chipwrap">' + htChip('You') + htChip('Aria — secret set') + htChip('Rex — secret set') + htChip('Noa — secret set') + '</div>' + HT_BOARD) },
        { t: 'One board PER rival', d: 'This is the key to Battle Royale: you do NOT share one big board. Every opponent has their OWN private suspect board on your screen. Cross out cards independently — Aria\'s answers only shrink Aria\'s board!',
          s: htScene('<div class="mk-duo">' + htMiniBoard("Aria's suspects", []) + htMiniBoard("Rex's suspects", [1, 4]) + '</div><div class="mk-note">Same game, two different boards — eliminate per rival.</div>') },
        { t: 'One question for the whole table', d: 'On your turn, ask ONE yes/no question — every opponent answers it publicly. Their answers narrow your boards and everyone else\'s at the same time.',
          s: htScene(htQ('Is your character from a shonen?') + '<div class="mk-chipwrap">' + htChip('Aria: YES', 'ok') + htChip('Rex: NO', 'no') + htChip('Noa: YES', 'ok') + '</div>') },
        { t: 'Track and strike', d: 'As answers arrive, eliminate on each rival\'s board — then fire a guess at any rival when you feel sure. Each correctly exposed secret scores big points.',
          s: htScene(HT_BOARD_OUT + htQ('Rex is… Light Yagami!', 'GUESS')) },
        { t: 'Ranking decides the winner', d: 'Points for exposed secrets, sharp guesses and keeping your own secret alive. When the game ends, the top of the leaderboard takes the crown.',
          s: htScene('<div class="mk-board-list"><p>' + htChip('1st — Aria', 'ok') + ' 340 pts</p><p>' + htChip('2nd — You', 'dim') + ' 290 pts</p><p>' + htChip('3rd — Rex', 'dim') + ' 210 pts</p></div>') }
      ]},
      race: { title: 'Guess Who — Race', icon: 'bolt', players: '3-8 players', slides: [
        { t: 'The Target and the Hunters', d: 'One player is the TARGET — only they know the mystery character. Everyone else is a hunter racing to name it first and win the game.',
          s: htScene('<div class="mk-chipwrap">' + htChip('Aria — TARGET', 'dim') + htChip('You — hunter') + htChip('Rex — hunter') + htChip('Noa — hunter') + '</div><div class="mk-note">The Target sees the mystery character. Hunters see nothing.</div>') },
        { t: 'Inside the Target seat', d: 'When YOU are the Target: only your screen shows the mystery character. Answer every question honestly with YES or NO — then sit back and enjoy the hunt. If every hunter burns all their lives on wrong guesses, the win is yours!',
          s: htScene('<div class="mk-label">Only the Target sees this</div><div class="mk-duo"><div>' + htCharReal('Mikasa Ackerman', 'secret') + '</div><div class="mk-word" style="align-self:center">Mystery: Mikasa Ackerman<br><span style="color:#8b9bc0">Answer honestly, keep a straight face!</span></div></div><div class="mk-chips">' + htChip('YES', 'ok') + htChip('NO', 'no') + '</div>') },
        { t: 'The mic goes around', d: 'Hunters take turns holding the mic: one yes/no question each, answered publicly by the Target. Each hunter has a limited question budget — spend them wisely!',
          s: htScene('<div class="mk-chipwrap">' + htChip('Rex ' + ic('mic'), 'ok') + htChip('You') + htChip('Noa') + '</div>' + htQ('Can the character fly?') + '<div class="mk-note">Target answers: YES</div>') },
        { t: 'Guess at ANY moment', d: 'No turns for guessing — fire it whenever inspiration strikes! But every wrong guess costs 1 of your 3 lives. Lose all three and you watch the rest of the hunt from the bench.',
          s: htScene('<div class="mk-lives">' + ic('heart') + ic('heart') + '<span class="mk-dead">' + ic('heart') + '</span></div>' + htQ('It\'s Mikasa Ackerman!', 'GUESS') + '<div class="mk-note">High risk, high reward — bold guesses win races.</div>') }
      ]},
      blur: { title: 'Blur Guess', icon: 'layers', players: 'solo or up to 8', slides: [
        { t: 'Pick your mode', d: 'Play solo to train, or with up to 8 players. Two modes: blurred anime characters, or blurred anime covers from 500 classics.',
          s: htScene('<div class="mk-chips">' + htChip('Characters mode') + htChip('Anime covers mode') + '</div>' + (HT_BLUR_IMG ? '<img class="mk-img" src="' + HT_BLUR_IMG + '" alt="anime cover demo">' : '<div class="mk-note">500 covers in the pool!</div>')) },
        { t: 'Five stages, five payouts', d: 'The image unblurs over 5 stages, and the payout melts as it clears: stage 1 pays 5 pts… stage 5 pays only 1 pt. Trust your gut early!',
          s: htScene(HT_BLUR_IMG ? '<div class="mk-stages"><div><img class="mk-img b3" src="' + HT_BLUR_IMG + '" alt=""><span class="mk-badge2">5 pts</span></div><div><img class="mk-img b2" src="' + HT_BLUR_IMG + '" alt=""><span class="mk-badge2">3 pts</span></div><div><img class="mk-img b1" src="' + HT_BLUR_IMG + '" alt=""><span class="mk-badge2">1 pt</span></div></div><div class="mk-note">Stage 1 → 3 of 5 — already nameable?</div>' : '<div class="mk-note">Stage 1 = 5 pts … stage 5 = 1 pt.</div>') },
        { t: 'Fast fingers win big', d: 'The FIRST correct guess in a round adds a +3 speed bonus (then +2 and +1 for the next players). A stage-1 first guess is the jackpot: 5 + 3 = 8 points!',
          s: htScene(htQ('My answer: ' + HT_BLUR_NAME, 'SUBMIT') + '<div class="mk-chips">' + htChip('Correct! +8 pts', 'ok') + htChip('5 base + 3 speed bonus', 'dim') + '</div>') },
        { t: 'Build your streak', d: 'Rounds chain and the leaderboard remembers everything. In multiplayer, the most consistent eye wins — learn studios, eras and art styles!',
          s: htScene('<div class="mk-board-list"><p>' + htChip('1st — You', 'ok') + ' 24 pts</p><p>' + htChip('2nd — Aria', 'dim') + ' 19 pts</p><p>' + htChip('3rd — Rex', 'dim') + ' 14 pts</p></div>') }
      ]},
      hotcold: { title: 'Guess Who — Hot & Cold', icon: 'target', players: '2-6 players', slides: [
        { t: 'One hides, everyone hunts', d: 'The HIDER picks any character from the whole pool. Every other player hunts at the same time, in their own lane — proposing characters at their own pace, one proposal at a time.',
          s: htScene('<div class="mk-mini"><div class="mk-label">The hider\'s view (secret!)</div><div class="mk-grid mk-grid3">' + HT_NAMES.slice(0, 6).map(function (n, i) { return htCharReal(n, i === 4 ? 'secret' : ''); }).join('') + '</div></div>') },
        { t: 'Hot or cold, 0 to 100', d: 'The hider scores every proposal: 0 = nothing alike… 90+ = so close it burns. An exact hit is found instantly — no scoring needed! Each seeker stops when THEY find it (or after 100 tries).',
          s: htScene(htQ('They guessed: "Naruto Uzumaki"', 'SCORE') + '<div class="mk-chips">' + htChip('82 — so hot!', 'ok') + htChip('41 — lukewarm', 'dim') + htChip('5 — ice cold', 'no') + '</div>') },
        { t: 'Fewer guesses wins', d: 'Everyone hides once! Your classement score = the TOTAL NUMBER of guesses you took across every secret (16 + 14 guesses = 30). Scores only guide you — the LOWEST guess count takes the match!',
          s: htScene('<div class="mk-board-list"><p>' + htChip('1st — You', 'ok') + ' with 30 guesses</p><p>' + htChip('2nd — Aria', 'dim') + ' with 34 guesses</p><p>' + htChip('3rd — Rex', 'dim') + ' with 41 guesses</p></div>') }
      ]}
    };

    function openHowTo(g) {
      if (!HOWTO[g]) return;
      HT.game = g; HT.idx = 0;
      renderHowTo();
      document.getElementById('howtoModal').style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
    function closeHowTo() {
      const m = document.getElementById('howtoModal');
      if (m) m.style.display = 'none';
      document.body.style.overflow = '';
    }
    function howtoNav(d) {
      const n = HOWTO[HT.game].slides.length;
      HT.idx = Math.min(n - 1, Math.max(0, HT.idx + d));
      renderHowTo();
    }
    function howtoGo(i) { HT.idx = i; renderHowTo(); }
    function renderHowTo() {
      const meta = HOWTO[HT.game]; if (!meta) return;
      const n = meta.slides.length;
      document.getElementById('howtoIcon').innerHTML = ic(meta.icon);
      document.getElementById('howtoTitle').textContent = meta.title;
      document.getElementById('howtoPlayers').textContent = meta.players;
      const s = meta.slides[HT.idx];
      document.getElementById('howtoSlide').innerHTML =
        '<div class="ht-scene">' + s.s + '</div>' +
        '<div class="ht-text"><h4>' + s.t + '</h4><p>' + s.d + '</p><div class="ht-step">Step ' + (HT.idx + 1) + ' of ' + n + '</div></div>';
      document.getElementById('howtoPrev').disabled = HT.idx === 0;
      document.getElementById('howtoNext').disabled = HT.idx === n - 1;
      document.getElementById('howtoDots').innerHTML = meta.slides.map(function(_, i) {
        return '<span class="howto-dot' + (i === HT.idx ? ' on' : '') + '" onclick="howtoGo(' + i + ')"></span>';
      }).join('');
      document.getElementById('howtoCta').innerHTML = ic('play') + ' Host a room';
    }
    function howtoPlayNow() {
      const g = HT.game;
      closeHowTo();
      showHostRoom();
      const sel = document.getElementById('gameSelect');
      if (sel) { sel.value = g; try { onGameSelectChange(); } catch (e) {} }
    }
    document.addEventListener('keydown', function (e) {
      const m = document.getElementById('howtoModal');
      if (!m || m.style.display !== 'flex') return;
      if (e.key === 'Escape') closeHowTo();
      else if (e.key === 'ArrowRight') howtoNav(1);
      else if (e.key === 'ArrowLeft') howtoNav(-1);
    });

    // ===== CUSTOM NOTIFICATION & INTERACTION SYSTEM =====
    let interactionCallback = null;
    function showNotification(message, duration = 3000) {
      const container = document.getElementById('notificationContainer');
      if (!container) return;
      const note = document.createElement('div');
      note.className = 'notification-message';
      note.textContent = message;
      container.appendChild(note);
      setTimeout(() => {
        note.classList.add('fade-out');
        setTimeout(() => note.remove(), 350);
      }, duration);
    }
    function showInteraction(title, message, buttons) {
      const win = document.getElementById('interactionWindow');
      document.getElementById('interactionTitle').innerHTML = title;
      document.getElementById('interactionMessage').innerHTML = message;
      const btnContainer = document.getElementById('interactionButtons');
      btnContainer.innerHTML = '';
      buttons.forEach(btn => {
        const b = document.createElement('button');
        b.innerHTML = btn.label;
        b.className = btn.class || '';
        b.onclick = () => {
          win.classList.remove('show');
          if (btn.onclick) btn.onclick();
        };
        btnContainer.appendChild(b);
      });
      win.classList.add('show');
    }
    function closeInteraction() { document.getElementById('interactionWindow').classList.remove('show'); }

    // ===== PLAYER ACCOUNTS (Firebase Auth, username-only) =====
    // Internally each username maps to a synthetic email: username@sakugame.app
    // Players never see or use an email address.
    const AUTH_EMAIL_SUFFIX = '@sakugame.app';
    let currentAccount = null;   // { uid, username, wins, losses, avatar } when logged in
    let gameResultCounted = false; // ensures stats are counted once per game

    // ===== PROFILE PICTURES (avatars) =====
    // Logged-in players pick one of the 12 built-in anime avatars below
    // (images hosted on the AniList CDN, exactly like the game cards),
    // OR upload their own picture: the browser shrinks it to a tiny 96×96
    // JPEG which is stored as text on their Firebase profile (no paid
    // Firebase Storage needed). Avatars follow players into rooms via
    // rooms/{code}/players/{pid}/avatar so everyone sees them.
    const AVATAR_PRESETS = [
      { n: 'Levi — Attack on Titan',        img: 'https://s4.anilist.co/file/anilistcdn/character/large/b45627-CR68RyZmddGG.png' },
      { n: 'Naruto Uzumaki — Naruto',       img: 'https://s4.anilist.co/file/anilistcdn/character/large/b17-phjcWCkRuIhu.png' },
      { n: 'Luffy Monkey D. — One Piece',   img: 'https://s4.anilist.co/file/anilistcdn/character/large/b40-MNypXsxSRb1R.png' },
      { n: 'Gokuu Son — Dragon Ball',       img: 'https://s4.anilist.co/file/anilistcdn/character/large/246-wsRRr6z1kii8.png' },
      { n: 'Eren Yeager — Attack on Titan', img: 'https://s4.anilist.co/file/anilistcdn/character/large/b40882-dsj7IP943WFF.jpg' },
      { n: 'Rem — Re:Zero',                 img: 'https://s4.anilist.co/file/anilistcdn/character/large/b88575-Ayu8UPDA8NS6.png' },
      { n: 'Nezuko Kamado — Demon Slayer',  img: 'https://s4.anilist.co/file/anilistcdn/character/large/b127518-NRlq1CQ1v1ro.png' },
      { n: 'Zoro Roronoa — One Piece',      img: 'https://s4.anilist.co/file/anilistcdn/character/large/b62-S7oAeA9WInjV.png' },
      { n: 'Satoru Gojou — Jujutsu Kaisen', img: 'https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png' },
      { n: 'Itachi Uchiha — Naruto',        img: 'https://s4.anilist.co/file/anilistcdn/character/large/b14-9Kb1E5oel1ke.png' },
      { n: 'Shouto Todoroki — MHA',         img: 'https://s4.anilist.co/file/anilistcdn/character/large/b89220-KNBwaVFAR8FD.png' },
      { n: 'Zero Two — Darling in the FranXX', img: 'https://s4.anilist.co/file/anilistcdn/character/large/b124381-pkTKi6HHNuVR.png' },
    ];

    function myAvatar() { return (currentAccount && currentAccount.avatar) ? currentAccount.avatar : null; }

    // A little round bubble: the picture if set, a silhouette if not.
    function avatarCircle(url, cls) {
      cls = cls || 'ava-lobby';
      if (url) return '<span class="ava ' + cls + '"><img src="' + escapeHtml(String(url)) + '" alt="" loading="lazy" onerror="this.parentNode.classList.add(\'ava-empty\'); this.remove();"></span>';
      return '<span class="ava ' + cls + ' ava-empty"></span>';
    }

    // The top-bar account button shows a mini avatar when the player has one.
    function updateUserButton() {
      const btn = document.getElementById('usernameBtn');
      if (!btn) return;
      const av = myAvatar();
      btn.innerHTML = (av ? '<span class="ava ava-btn"><img src="' + escapeHtml(String(av)) + '" alt="" onerror="this.parentNode.classList.add(\'ava-empty\'); this.remove();"></span> ' : '<span class="ava ava-btn ava-empty"></span> ') + escapeHtml(String(playerName));
    }

    // Show/hide a standalone circular <img> (game screens).
    function setAvatarImg(id, url) {
      const el = document.getElementById(id);
      if (!el) return;
      if (url) { el.src = String(url); el.style.display = 'inline-block'; }
      else { el.removeAttribute('src'); el.style.display = 'none'; }
    }

    // ----- avatar picker modal -----
    function openAvatarModal() {
      if (!firebase.auth().currentUser) { showNotification('Log in to set a profile picture.'); return; }
      const grid = document.getElementById('avatarGrid');
      grid.innerHTML = '';
      AVATAR_PRESETS.forEach(p => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'avatar-pick';
        b.title = p.n;
        b.innerHTML = '<img src="' + escapeHtml(p.img) + '" alt="' + escapeHtml(p.n) + '" loading="lazy">';
        b.addEventListener('click', () => saveAvatar(p.img));
        grid.appendChild(b);
      });
      const err = document.getElementById('avatarError');
      if (err) err.textContent = '';
      document.getElementById('avatarModal').classList.add('show');
    }
    function closeAvatarModal() { document.getElementById('avatarModal').classList.remove('show'); }

    function renderProfileAvatar() {
      const wrap = document.getElementById('profileAvatar');
      if (wrap) wrap.innerHTML = avatarCircle(myAvatar(), 'ava-profile');
    }

    async function saveAvatar(url) {
      const user = firebase.auth().currentUser;
      if (!user) { showNotification('Log in to set a profile picture.'); return; }
      try {
        await database.ref('users/' + user.uid + '/avatar').set(url || null); // null = remove picture
        if (currentAccount) currentAccount.avatar = url || null;
        // Keep the room copy in sync so other players see the new picture immediately
        if (roomCode && currentRoom && currentRoom.players && currentRoom.players[playerId]) {
          try { await database.ref('rooms/' + roomCode + '/players/' + playerId + '/avatar').set(url || ''); } catch (e) {}
        }
        renderProfileAvatar();
        updateUserButton();
        closeAvatarModal();
        showNotification(url ? 'Profile picture updated!' : 'Profile picture removed.');
      } catch (e) {
        const err = document.getElementById('avatarError');
        if (err) err.textContent = 'Could not save the picture: ' + ((e && e.message) || 'unknown error');
      }
    }

    // Upload own picture → shrink to 96×96 JPEG → save as text (data URL)
    function onAvatarFileSelected(ev) {
      const file = ev.target && ev.target.files ? ev.target.files[0] : null;
      ev.target.value = ''; // allow picking the same file again later
      const err = document.getElementById('avatarError');
      if (err) err.textContent = '';
      if (!file) return;
      if (!/^image\//.test(file.type)) { if (err) err.textContent = 'Please choose an image file (PNG, JPG…).'; return; }
      if (file.size > 8 * 1024 * 1024) { if (err) err.textContent = 'That image is too big (max 8 MB).'; return; }
      const reader = new FileReader();
      reader.onerror = () => { if (err) err.textContent = 'Could not read that file.'; };
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => { if (err) err.textContent = 'Could not load that image.'; };
        img.onload = () => {
          const S = 96;
          const canvas = document.createElement('canvas');
          canvas.width = S; canvas.height = S;
          const ctx = canvas.getContext('2d');
          const m = Math.min(img.width, img.height || img.width);
          ctx.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
          let dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          if (dataUrl.length > 15000) dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          saveAvatar(dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }


    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const ref = database.ref('users/' + user.uid);
        const snap = await ref.once('value');
        let profile = snap.val();
        if (!profile || !profile.username) {
          // Fallback: profile write failed during registration — rebuild a minimal one
          const lower = (user.email || 'player').split('@')[0];
          profile = { username: lower, usernameLower: lower, wins: 0, losses: 0, uWins: 0, uLosses: 0, createdAt: Date.now() };
          await ref.set(profile);
        }
        currentAccount = { uid: user.uid, username: profile.username, wins: profile.wins || 0, losses: profile.losses || 0, uWins: profile.uWins || 0, uLosses: profile.uLosses || 0, anilist: profile.anilist || null, avatar: profile.avatar || null };
        playerName = currentAccount.username;
        updateUserButton();
        // If already inside a room, update the displayed name + picture there too
        if (roomCode && currentRoom && currentRoom.players && currentRoom.players[playerId]) {
          database.ref('rooms/' + roomCode + '/players/' + playerId).update({ name: playerName, avatar: myAvatar() || '' });
        }
        // If sitting on the host screen when logging in, load the synced AniList account
        const hostScreen = document.getElementById('hostRoomScreen');
        if (hostScreen && hostScreen.classList.contains('active')) autoSyncHostAccount();
        // If inside a room when logging in, drop the synced account into the pool
        if (roomCode) syncMyAccountIntoRoom();
      } else {
        currentAccount = null;
        updateUserButton();
      }
    });

    function onUserButton() {
      if (firebase.auth().currentUser) openAuthModal(); else changeUsername();
    }

    // 🗂️ Account menu tabs (Game / Account / Support) + Discord copy
    function switchAcctTab(tab) {
      ['game', 'account', 'support'].forEach(t => {
        const pane = document.getElementById('acctPane' + t.charAt(0).toUpperCase() + t.slice(1));
        if (pane) pane.style.display = (t === tab) ? 'block' : 'none';
      });
      document.querySelectorAll('.acct-tab').forEach(b => {
        const on = b.getAttribute('data-tab') === tab;
        b.classList.toggle('on', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      try { localStorage.setItem('sakugame_acct_tab', tab); } catch (e) { }
    }
    function copyDiscord() {
      const h = '@soufiane_jv';
      try {
        navigator.clipboard.writeText(h).then(
          () => showNotification(window.t ? t('Discord username copied!') : 'Discord username copied!'),
          () => showNotification('Discord: ' + h));
      } catch (e) { showNotification('Discord: ' + h); }
    }

    async function openAuthModal() {
      const user = firebase.auth().currentUser;
      document.getElementById('authFormView').style.display = user ? 'none' : 'block';
      document.getElementById('authProfileView').style.display = user ? 'block' : 'none';
      if (user) {
        let lastTab = 'game';
        try { lastTab = localStorage.getItem('sakugame_acct_tab') || 'game'; } catch (e) { }
        switchAcctTab(lastTab);
        const snap = await database.ref('users/' + user.uid).once('value');
        const p = snap.val() || {};
        document.getElementById('profileName').textContent = p.username || 'Account';
        if (currentAccount) currentAccount.avatar = p.avatar || null;
        renderProfileAvatar();
        document.getElementById('profileWins').textContent = p.wins || 0;
        document.getElementById('profileLosses').textContent = p.losses || 0;
        const uwEl = document.getElementById('profileUWins');
        const ulEl = document.getElementById('profileULosses');
        if (uwEl) uwEl.textContent = p.uWins || 0;
        if (ulEl) ulEl.textContent = p.uLosses || 0;
        document.getElementById('anilistSyncInput').value = p.anilist || '';
        document.getElementById('profileUsernameInput').value = '';
        document.getElementById('currentPasswordInput').value = '';
        document.getElementById('newPasswordInput').value = '';
        if (currentAccount) currentAccount.anilist = p.anilist || null;
        if (currentAccount) currentAccount.watchStatuses = Array.isArray(p.watchStatuses) ? p.watchStatuses : null;
        try { loadWatchStatusesIntoUI(); } catch (e) {}
      } else {
        showAuthError('');
      }
      document.getElementById('authModal').classList.add('show');
    }

    function closeAuthModal() { document.getElementById('authModal').classList.remove('show'); showAuthError(''); }
    function showAuthError(msg) { const el = document.getElementById('authError'); if (el) el.textContent = msg || ''; }
    function authBusy(busy) { ['authLoginBtn', 'authRegisterBtn'].forEach(id => { const el = document.getElementById(id); if (el) el.disabled = busy; }); }

    function validateAuthForm(username, password) {
      if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) return 'Username: 3-20 characters, letters, numbers and _ only.';
      if (!password || password.length < 6) return 'Password must be at least 6 characters.';
      return null;
    }

    function friendlyAuthError(e) {
      const code = (e && e.code) || '';
      if (code === 'auth/email-already-in-use') return 'This username is already taken.';
      if (code === 'auth/weak-password') return 'Password is too weak (min 6 characters).';
      if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials') return 'Wrong username or password.';
      if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait and retry.';
      if (code === 'auth/network-request-failed') return 'Network error. Check your connection.';
      if (code === 'auth/operation-not-allowed') return 'Accounts not enabled yet: enable "Email/Password" in Firebase console (Authentication → Sign-in method).';
      return 'Error: ' + ((e && e.message) || 'unknown');
    }

    async function registerAccount() {
      const usernameRaw = document.getElementById('authUsernameInput').value.trim();
      const password = document.getElementById('authPasswordInput').value;
      const err = validateAuthForm(usernameRaw, password);
      if (err) { showAuthError(err); return; }
      const lower = usernameRaw.toLowerCase();
      authBusy(true);
      try {
        // Cheap availability pre-check (the transaction below enforces it for real)
        const taken = await database.ref('usernames/' + lower).once('value');
        if (taken.exists()) { showAuthError('This username is already taken.'); authBusy(false); return; }
        const cred = await firebase.auth().createUserWithEmailAndPassword(lower + AUTH_EMAIL_SUFFIX, password);
        // Claim the username — transaction makes it race-safe.
        // The entry records the uid plus the ORIGINAL login name (authLower),
        // so later renames don't change how the player logs in.
        const claim = await database.ref('usernames/' + lower).transaction(cur => (cur === null ? { uid: cred.user.uid, authLower: lower } : undefined));
        if (!claim.committed) {
          try { await cred.user.delete(); } catch (e) {}
          showAuthError('This username is already taken.');
          authBusy(false); return;
        }
        await database.ref('users/' + cred.user.uid).set({ username: usernameRaw, usernameLower: lower, wins: 0, losses: 0, uWins: 0, uLosses: 0, createdAt: Date.now() });
        currentAccount = { uid: cred.user.uid, username: usernameRaw, wins: 0, losses: 0, uWins: 0, uLosses: 0, avatar: null };
        playerName = usernameRaw;
        updateUserButton();
        closeAuthModal();
        showNotification('Account created! Welcome, ' + usernameRaw + '!');
      } catch (e) { showAuthError(friendlyAuthError(e)); }
      authBusy(false);
    }

    async function loginAccount() {
      const usernameRaw = document.getElementById('authUsernameInput').value.trim();
      const password = document.getElementById('authPasswordInput').value;
      const err = validateAuthForm(usernameRaw, password);
      if (err) { showAuthError(err); return; }
      authBusy(true);
      try {
        const lower = usernameRaw.toLowerCase();
        // The registry tells us which original login name (auth email) this display name maps to
        const entrySnap = await database.ref('usernames/' + lower).once('value');
        const entry = entrySnap.val();
        if (!entry) { showAuthError('Wrong username or password.'); authBusy(false); return; }
        // New format: { uid, authLower } — legacy format: plain uid string (key == login name)
        const authLower = (typeof entry === 'object' && entry && entry.authLower) ? entry.authLower : lower;
        await firebase.auth().signInWithEmailAndPassword(authLower + AUTH_EMAIL_SUFFIX, password);
        closeAuthModal();
        showNotification('Logged in as ' + (currentAccount ? currentAccount.username : usernameRaw) + '!');
      } catch (e) { showAuthError(friendlyAuthError(e)); }
      authBusy(false);
    }

    async function logoutAccount() {
      try { await firebase.auth().signOut(); } catch (e) {}
      anilistAutoSyncDone = false;
      closeAuthModal();
      showNotification('Logged out.');
    }

    // ===== PROFILE MENU ACTIONS =====

    // Change display username. The LOGIN stays attached to the original name
    // internally (auth email never changes → no verification-email problem):
    // the /usernames registry maps display name → original login name.
    async function changeAccountUsername() {
      const user = firebase.auth().currentUser;
      if (!user || !currentAccount) return;
      const btn = document.getElementById('profileUsernameBtn');
      const newName = document.getElementById('profileUsernameInput').value.trim();
      if (!/^[A-Za-z0-9_]{3,20}$/.test(newName)) { showNotification('Username: 3-20 characters, letters, numbers and _ only.'); return; }
      const lower = newName.toLowerCase();
      const authLower = (user.email || '').split('@')[0]; // original login name, never changes
      const oldLower = currentAccount.username.toLowerCase();
      btn.disabled = true;
      try {
        if (lower !== oldLower) {
          const takenSnap = await database.ref('usernames/' + lower).once('value');
          const tv = takenSnap.val();
          const takenByOther = tv && !((typeof tv === 'object' && tv.uid === user.uid) || tv === user.uid);
          if (takenByOther) { showNotification('This username is already taken.'); btn.disabled = false; return; }
          const claim = await database.ref('usernames/' + lower).transaction(cur => (cur === null ? { uid: user.uid, authLower: authLower } : undefined));
          if (!claim.committed) { showNotification('This username is already taken.'); btn.disabled = false; return; }
          await database.ref('users/' + user.uid).update({ username: newName, usernameLower: lower });
          try { await database.ref('usernames/' + oldLower).remove(); } catch (e) {} // release old name
        } else {
          await database.ref('users/' + user.uid).update({ username: newName }); // case-only change
        }
        currentAccount.username = newName;
        playerName = newName;
        updateUserButton();
        document.getElementById('profileName').textContent = newName;
        document.getElementById('profileUsernameInput').value = '';
        if (roomCode && currentRoom && currentRoom.players && currentRoom.players[playerId]) {
          database.ref('rooms/' + roomCode + '/players/' + playerId + '/name').set(playerName);
        }
        showNotification('Username changed to: ' + newName);
      } catch (e) { showNotification('Error: ' + e.message); }
      btn.disabled = false;
    }

    // Change password — Firebase requires a recent login, so re-authenticate first
    async function changeAccountPassword() {
      const user = firebase.auth().currentUser;
      if (!user) return;
      const btn = document.getElementById('profilePasswordBtn');
      const current = document.getElementById('currentPasswordInput').value;
      const next = document.getElementById('newPasswordInput').value;
      if (!current) { showNotification('Enter your current password.'); return; }
      if (!next || next.length < 6) { showNotification('New password must be at least 6 characters.'); return; }
      btn.disabled = true;
      try {
        const cred = firebase.auth.EmailAuthProvider.credential(user.email, current);
        await user.reauthenticateWithCredential(cred);
        await user.updatePassword(next);
        document.getElementById('currentPasswordInput').value = '';
        document.getElementById('newPasswordInput').value = '';
        showNotification('Password updated!');
      } catch (e) {
        const code = (e && e.code) || '';
        if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') showNotification('Current password is incorrect.');
        else showNotification(friendlyAuthError(e));
      }
      btn.disabled = false;
    }

    // 👁 Peek button next to password boxes: tap to reveal what's typed,
    // tap again to mask — stays readable on every auth form (login/register
    // + change password) without leaving the modal
    function togglePassword(inputId, btn) {
      const inp = document.getElementById(inputId);
      if (!inp) return;
      const show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      if (btn) {
        btn.classList.toggle('pw-on', show);
        btn.title = show ? 'Hide password' : 'Show password';
        btn.setAttribute('aria-label', btn.title);
      }
    }

    // Lightweight AniList check (user exists + enough favorites) without full download
    async function checkAniListUser(username) {
      const query = 'query ($username: String) { User(name: $username) { name favourites { characters(page: 1, perPage: 1) { pageInfo { total } } } } }';
      const response = await fetch(ANILIST_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query, variables: { username } })
      });
      const data = await response.json();
      if (data.errors) throw new Error(data.errors[0].message);
      if (!data.data || !data.data.User) return null;
      return { name: data.data.User.name, total: (data.data.User.favourites.characters.pageInfo.total || 0) };
    }

    async function saveAnilistSync() {
      const user = firebase.auth().currentUser;
      if (!user) return;
      const btn = document.getElementById('anilistSaveBtn');
      const raw = document.getElementById('anilistSyncInput').value.trim();
      btn.disabled = true;
      try {
        if (!raw) {
          // Empty field = remove the sync
          if (currentAccount && currentAccount.anilist) {
            await database.ref('users/' + user.uid + '/anilist').remove();
            currentAccount.anilist = null; anilistAutoSyncDone = false;
            showNotification('AniList sync removed.');
          } else { showNotification('Enter your AniList username.'); }
          btn.disabled = false; return;
        }
        const info = await checkAniListUser(raw);
        if (!info) { showNotification('AniList user not found: ' + raw); btn.disabled = false; return; }
        if (info.total < 6) { showNotification(info.name + ' has only ' + info.total + ' favorites. Need at least 6.'); btn.disabled = false; return; }
        await database.ref('users/' + user.uid + '/anilist').set(info.name);
        if (currentAccount) currentAccount.anilist = info.name;
        anilistAutoSyncDone = false; // allow auto-load next time you host
        document.getElementById('anilistSyncInput').value = info.name;
        showNotification('AniList account synced: ' + info.name);
        if (roomCode) syncMyAccountIntoRoom(); // if currently in a room, add it right away
      } catch (e) { showNotification('Error checking AniList: ' + e.message); }
      btn.disabled = false;
    }

    // Auto-load the synced AniList account when the host screen opens
    let anilistAutoSyncDone = false;
    async function autoSyncHostAccount() {
      if (anilistAutoSyncDone) return;
      if (!currentAccount || !currentAccount.anilist) return;
      const name = currentAccount.anilist;
      if (hostAccounts.find(a => a.username.toLowerCase() === name.toLowerCase())) { anilistAutoSyncDone = true; return; }
      anilistAutoSyncDone = true;
      try {
        showNotification('Loading synced AniList account (' + name + ')...');
        const built = await buildRoomAccount(name);
        if (built.favCount < 6) { showNotification(name + ' has only ' + built.favCount + ' favorites. Need at least 6.'); return; }
        hostAccounts.push(built.entry);
      } catch (e) { showNotification('Could not load synced AniList: ' + e.message); }
    }

    // Auto-add the logged-in player's synced AniList account to the current room.
    // Runs on room join, on login while inside a room, and right after syncing.
    async function syncMyAccountIntoRoom() {
      if (!currentAccount || !currentAccount.anilist || !roomCode) return;
      const name = currentAccount.anilist;
      const lower = name.toLowerCase();
      const existing = Object.keys(currentRoom ? (currentRoom.accounts || {}) : {});
      if (existing.some(k => k.toLowerCase() === lower)) return; // already in the room
      try {
        showNotification('Loading your synced AniList account (' + name + ')...');
        const built = await buildRoomAccount(name);
        if (built.favCount < 6) { showNotification(name + ' has only ' + built.favCount + ' favorites. Need at least 6.'); return; }
        await database.ref('rooms/' + roomCode + '/accounts/' + name).set(built.entry);
        touchActivity();
        showNotification('Your AniList account (' + name + ') was added to the room.');
      } catch (e) { showNotification('Could not load synced AniList: ' + e.message); }
    }

    // Count the player's own result once per finished game (logged-in players only).
    function recordGameResult(won) {
      const user = firebase.auth().currentUser;
      if (!user) return; // guests: no stats
      database.ref('users/' + user.uid + '/' + (won ? 'wins' : 'losses')).transaction(v => (v || 0) + 1);
    }

    // Same, but for Undercover games — counted in separate counters (uWins/uLosses).
    function recordUndercoverResult(won) {
      const user = firebase.auth().currentUser;
      if (!user) return; // guests: no stats
      database.ref('users/' + user.uid + '/' + (won ? 'uWins' : 'uLosses')).transaction(v => (v || 0) + 1);
    }

    const ANILIST_API = 'https://graphql.anilist.co';

    async function fetchAniListFavorites(username) {
      let allCharacters = [];
      let hasNextPage = true;
      let page = 1;
      while (hasNextPage) {
        const query = `
          query ($username: String, $page: Int) {
            User(name: $username) {
              name
              favourites {
                characters(page: $page, perPage: 50) {
                  pageInfo { hasNextPage }
                  nodes {
                    id
                    name { full alternative }
                    image { large }
                    gender
                    media(page: 1, perPage: 1, sort: POPULARITY_DESC) {
                      nodes { title { romaji } type }
                    }
                  }
                }
              }
            }
          }
        `;
        const response = await fetch(ANILIST_API, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ query, variables: { username, page } })
        });
        const data = await response.json();
        if (data.errors) throw new Error(data.errors[0].message);
        const characterData = data.data.User.favourites.characters;
        allCharacters.push(...characterData.nodes);
        hasNextPage = characterData.pageInfo.hasNextPage;
        page++;
      }
      return { name: username, characters: allCharacters };
    }

    // 🗃️ WATCHED LIST — every anime on the account, ALL list-statuses, so the
    // HC/Blur "Watched" pools can filter live by the account owner's own
    // checkboxes (account pane). Chunked 500-per-request via MediaListCollection.
    async function fetchAniListWatched(username) {
      const entries = [];
      let chunk = 1; let hasNext = true;
      while (hasNext && chunk <= 20) { // 20×500 hard cap — paranoid loop guard
        const query = `
          query ($username: String, $chunk: Int) {
            MediaListCollection(userName: $username, type: ANIME, chunk: $chunk) {
              hasNextChunk
              lists { entries { status media { id title { romaji english } } } }
            }
          }
        `;
        const response = await fetch(ANILIST_API, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ query, variables: { username, chunk } })
        });
        const data = await response.json();
        if (data.errors) throw new Error(data.errors[0].message);
        const col = data.data && data.data.MediaListCollection;
        if (!col) break;
        (col.lists || []).forEach(l => { (l.entries || []).forEach(e => { if (e && e.media && e.media.id != null) entries.push(e); }); });
        hasNext = !!col.hasNextChunk;
        chunk++;
      }
      return entries;
    }

    // Compact watched entries for the room: {i: AniList media id, t: romaji
    // title, e?: english (if it adds a new spelling), s: list status}.
    function mapAniListWatched(entries) {
      const out = []; const seen = new Set();
      (entries || []).forEach(e => {
        const m = e && e.media;
        if (!m || m.id == null || seen.has(m.id)) return;
        seen.add(m.id);
        const t = (m.title && m.title.romaji) || '';
        if (!t) return;
        const en = (m.title && m.title.english) || '';
        const w = { i: m.id, t: t, s: String(e.status || 'COMPLETED').toLowerCase() };
        if (en && bgNorm(en) !== bgNorm(t)) w.e = en;
        out.push(w);
      });
      return out;
    }

    // Fetch favorites + watched list and build the room account entry. The
    // watched fetch is best-effort: a failure must never block the favorites.
    async function buildRoomAccount(name) {
      const userData = await fetchAniListFavorites(name);
      const favs = userData.characters;
      const mappedChars = mapAniListChars(favs);
      let watched = [];
      try { watched = mapAniListWatched(await fetchAniListWatched(name)); } catch (e) { watched = []; }
      const ws = (currentAccount && Array.isArray(currentAccount.watchStatuses) && currentAccount.watchStatuses.length) ? currentAccount.watchStatuses.slice() : WATCH_STATUS_DEFAULT.slice();
      return { entry: { username: name, characters: mappedChars, count: mappedChars.length, watched: watched, ws: ws }, favCount: favs.length };
    }

    // Map raw AniList favorite nodes to compact room entries. Keeps the
    // alternative names ("Deku", "Goku Son", "Burdock"…) in `al` so the
    // Blur Guess matcher/autocomplete can find characters by any of their
    // names — pure-Japanese aliases and duplicates of the main name are dropped.
    function mapAniListChars(favs) {
      return favs.map(char => {
        const media = (char.media && char.media.nodes && char.media.nodes[0]) ? char.media.nodes[0] : { title: { romaji: 'Unknown' }, type: 'ANIME' };
        const full = char.name ? char.name.full : '';
        const seenAl = new Set([bgNorm(full)]);
        const al = [];
        (char.name && Array.isArray(char.name.alternative) ? char.name.alternative : []).forEach(a => {
          const n = bgNorm(a);
          if (!n || seenAl.has(n)) return;
          seenAl.add(n);
          al.push(a);
        });
        const entry = {
          id: char.id,
          name: full || 'Unknown',
          image: char.image ? char.image.large : '',
          series: media.title ? media.title.romaji : 'Unknown',
          gender: (char.gender || 'Unknown').toLowerCase(),
          mediaType: (media.type || 'ANIME').toLowerCase()
        };
        if (al.length) entry.al = al;
        return entry;
      });
    }

    let roomCode = null;
    let playerId = 'player_' + Math.random().toString(36).substr(2, 9);
    let playerName = 'Player ' + Math.floor(Math.random() * 1000);
    let isHost = false;
    let currentRoom = null;
    let roomRef = null;
    let kickRef = null;
    let beingKicked = false;
    let hostAccounts = [];
    let characters = [];
    let mySecret = null;
    let selectedCharacter = null;
    let myEliminated = new Set();
    let guessMode = false;
    let guessingCharacter = null;
    let roomVisibility = 'private';
    let hostSource = 'generic'; // character pool for the next room: 'generic' | 'favorites' | 'mix' (Guess Who games)
    let hostPool = 'random';    // 🎲 Hot & Cold + Blur Guess pool: 'random' (full website pool) | 'watched' (only anime the synced accounts have seen)
    let hostMixCount = 12;      // 🔀 Guess Who Mix split: how many board slots come from the generic pool
    // 👀 AniList list-statuses that count as "watched" (account-pane checkboxes)
    const WATCH_STATUS_DEFAULT = ['watching', 'completed', 'paused'];
    const WATCH_STATUS_MAP = { current: 'watching', repeating: 'watching', completed: 'completed', paused: 'paused', dropped: 'dropped', planning: 'planning' };
    function watchStatusOk(s, ws) {
      const g = WATCH_STATUS_MAP[String(s || '').toLowerCase()] || 'watching';
      return (Array.isArray(ws) && ws.length ? ws : WATCH_STATUS_DEFAULT).indexOf(g) >= 0;
    }
    function selectHostPool(p) {
      hostPool = p === 'watched' ? 'watched' : 'random';
      const e1 = document.getElementById('hostPoolRandom');
      const e2 = document.getElementById('hostPoolWatched');
      if (e1) e1.classList.toggle('selected', hostPool === 'random');
      if (e2) e2.classList.toggle('selected', hostPool === 'watched');
    }
    function updateHostMix() {
      const block = document.getElementById('hostMixBlock');
      const show = hostSource === 'mix';
      if (block) block.style.display = show ? 'block' : 'none';
      if (!show) return;
      const total = parseInt(document.getElementById('hostCharCountSlider').value, 10) || 24;
      const slider = document.getElementById('hostMixSlider');
      slider.max = total;
      hostMixCount = clampN(slider.value, 0, total, Math.floor(total / 2));
      const lab = document.getElementById('hostMixLabel');
      if (lab) lab.textContent = tPO('mix_label', { v: hostMixCount, r: total - hostMixCount });
    }
    // ✅ Account-pane checkboxes: which list-statuses YOUR watched pool counts
    function currentWatchStatuses() {
      const map = [['wsWatching', 'watching'], ['wsCompleted', 'completed'], ['wsPaused', 'paused'], ['wsDropped', 'dropped'], ['wsPlanning', 'planning']];
      const out = [];
      map.forEach(p => { const el = document.getElementById(p[0]); if (el && el.checked) out.push(p[1]); });
      return out.length ? out : WATCH_STATUS_DEFAULT.slice();
    }
    async function saveWatchStatuses() {
      const sel = currentWatchStatuses();
      if (currentAccount) currentAccount.watchStatuses = sel;
      const user = firebase.auth().currentUser;
      if (user) { try { await database.ref('users/' + user.uid + '/watchStatuses').set(sel); } catch (e) {} }
      // refresh my entry inside the room too (the raw watched list is unchanged)
      if (roomCode && currentAccount && currentAccount.anilist) {
        try { await database.ref('rooms/' + roomCode + '/accounts/' + currentAccount.anilist + '/ws').set(sel); } catch (e) {}
      }
      showNotification('Watched statuses updated.');
    }
    function loadWatchStatusesIntoUI() {
      const sel = (currentAccount && Array.isArray(currentAccount.watchStatuses) && currentAccount.watchStatuses.length) ? currentAccount.watchStatuses : WATCH_STATUS_DEFAULT;
      const map = { watching: 'wsWatching', completed: 'wsCompleted', paused: 'wsPaused', dropped: 'wsDropped', planning: 'wsPlanning' };
      Object.keys(map).forEach(k => { const el = document.getElementById(map[k]); if (el) el.checked = sel.indexOf(k) >= 0; });
    }
    let codeBlurred = false;
    let myCharacterHidden = false;

    // ===== UNDERCOVER MODE state =====
    let hostGame = 'guesswho';     // game selected on the create-room screen
    let ucMaxPlayers = 5;          // max players for an Undercover room (3-8)
    let ucMrWhite = false;         // Mr. White option on the create-room screen
    let ucStatCountedFor = null;   // "roomCode_gameId" already counted (stats, once per game)
    let ucWatchBusy = false;       // re-entrancy guard for the host watchdog
    let ucLaunching = false;       // restart guard (host side)
    let ucActionKey = '';          // avoids rebuilding the clue input while typing
    let ucWordHidden = false;      // hide/show my secret word

    // ===== MULTIPLAYER GUESS WHO (Battle Royale & Race) + QUEUE state =====
    // game === 'battle': everyone has a secret, questions are public, each
    //   opponent gets a ❌ color, finds give points, ranking at the end.
    // game === 'race': one player is the TARGET (picks the mystery character
    //   & answers questions); the hunters race to find it first.
    const GAME_LABELS = { guesswho: 'Anime Guess Who?', undercover: 'Undercover', battle: 'Guess Who — Battle Royale', race: 'Guess Who — Race', blur: 'Blur Guess', hotcold: 'Guess Who — Hot & Cold' };
    let multiMaxPlayers = 6;       // max players for battle/race rooms (3-8)
    let hcMaxPlayers = 4;          // max players for a Hot & Cold room (2-6)
    let hostHcMode = 'shared';    // 🔀 Hot & Cold hint mode: 'shared' (everyone sees every proposal) | 'individual' (each seeker sees ONLY their own)
    let hostHcHideRank = false;   // 📊 Hot & Cold: hide the live points ranking until match end
    function setHostHcMode(m) {
      hostHcMode = m === 'individual' ? 'individual' : 'shared';
      document.getElementById('hostHcModeShared').classList.toggle('selected', hostHcMode === 'shared');
      document.getElementById('hostHcModeIndividual').classList.toggle('selected', hostHcMode === 'individual');
    }
    function setHostHcRank(h) {
      hostHcHideRank = !!h;
      document.getElementById('hostHcRankShow').classList.toggle('selected', !hostHcHideRank);
      document.getElementById('hostHcRankHide').classList.toggle('selected', hostHcHideRank);
    }
    const RACE_DEFAULT_LIVES = 3;     // hunter wrong guesses before they're out (race)
    const RACE_DEFAULT_QUESTIONS = 8; // max questions each hunter may ask (race)
    let hostRaceLives = RACE_DEFAULT_LIVES;         // race option on the create-room screen
    let hostRaceQuestions = RACE_DEFAULT_QUESTIONS; // race option on the create-room screen

    // ===== 🌫️ BLUR GUESS state =====
    // A picture (character portrait OR anime cover) clears over 5 stages,
    // one every `settings.bgStageSec` seconds (customizable, default 12 s).
    // Base points = 6 - stage (stage 1 = 5 pts … stage 5 = 1 pt); with several
    // players the fastest correct answers add a 🏅 speed bonus (+3/+2/+1).
    // Blur has NO character-count board: rounds are drawn from the FULL source
    // pool (generic 1001 / synced favorites / mix — or the 500 anime covers).
    const BLUR_STAGE_SEC = 12;         // default seconds per blur stage
    const BLUR_STAGES = 5;             // number of unblur stages
    const BLUR_ROUNDS_DEFAULT = 10;    // default number of rounds per game
    const BLUR_ROUNDS_MAX = 80;        // rounds slider max
    const BLUR_STAGE_SEC_MIN = 5, BLUR_STAGE_SEC_MAX = 30; // ⏱ timer slider bounds
    let hostBgRounds = BLUR_ROUNDS_DEFAULT; // rounds option on the create-room screen
    let hostBgStageSec = BLUR_STAGE_SEC;    // timer option on the create-room screen
    let hostBgMode = 'characters';          // 'characters' | 'covers' on the create-room screen
    let bgWatchBusy = false;           // host watchdog guard
    let bgHostTimer = null;            // host-only 1s heartbeat for stages/reveals
    let blurTicker = null;             // 500ms countdown renderer (display only)
    let bgSugHits = [];                // current suggestion rows (for ← keyboard nav)
    let bgSugIndex = -1;               // highlighted suggestion (↑/↓ arrows)
    let brActiveBoard = null;      // 🎨 opponent pid whose colored board I'm viewing (battle)
    let brGuessMode = false;       // click-a-card-to-guess mode (battle)
    let rcGuessMode = false;       // same for race
    let brMarks = {};              // { opponentPid: {charId:true} } — my ❌ notes PER BOARD, like myEliminated in 2P
    let rcMarks = {};              // { charId: true } — my own marks in race
    let lastBrGameId = null, lastRcGameId = null; // reset local marks on a new deal
    let brWatchBusy = false, rcWatchBusy = false;   // host watchdog guards
    const QUEUE_MAX = 8;           // max people waiting in a room's queue
    let imQueued = false;          // I'm in this room's queue (not seated)
    let queuePromoting = false;    // host-side promote guard
    let publicRoomsRef = null;     // live 🌐 list listener (join screen only)

    function changeUsername() {
      document.getElementById('newUsernameInput').value = playerName;
      document.getElementById('usernameModal').classList.add('show');
    }
    function closeUsernameModal() { document.getElementById('usernameModal').classList.remove('show'); }
    async function confirmUsernameChange() {
      const newName = document.getElementById('newUsernameInput').value.trim();
      if (!newName || newName.length < 2) { showNotification('Please enter a valid username (at least 2 characters)'); return; }
      playerName = newName;
      updateUserButton();
      if (roomCode && currentRoom) { await database.ref('rooms/' + roomCode + '/players/' + playerId + '/name').set(playerName); }
      closeUsernameModal(); showNotification('Username changed to: ' + playerName);
    }

    function showScreen(screenId) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById(screenId).classList.add('active');
      document.getElementById('winningScreen').classList.remove('show');
      document.getElementById('ucEndScreen').classList.remove('show');
      document.getElementById('multiEndScreen').classList.remove('show');
      document.getElementById('hcEndScreen').classList.remove('show');
      document.getElementById('interactionWindow').classList.remove('show');
      // The floating 💬 chat button exists in the lobby and during games
      const chatBtn = document.getElementById('chatToggleBtn');
      const chatVisible = (screenId === 'lobbyScreen' || screenId === 'gameScreen' || screenId === 'undercoverScreen' || screenId === 'battleScreen' || screenId === 'raceScreen' || screenId === 'blurScreen' || screenId === 'hotcoldScreen');
      if (chatBtn) chatBtn.style.display = chatVisible ? 'flex' : 'none';
      if (!chatVisible) { closeChatOverlay(); chatUnread = 0; updateChatBadge(); }
      // The 🌐 public room list only streams while the join screen is open
      if (screenId === 'joinRoomScreen') startPublicRoomsWatch(); else stopPublicRoomsWatch();
    }
    async function goHome() {
      if (roomCode) { await leaveRoom(true); } // leaveRoom also resets roomCode and shows the home screen
      showScreen('homepageScreen');
    }
    function showPlayMenu() { showScreen('playMenuScreen'); }
    function showGamesMenu() { showScreen('gamesMenuScreen'); }
    function showHostRoom() { showScreen('hostRoomScreen'); autoSyncHostAccount(); try { onGameSelectChange(); } catch (e) {} }
    function showJoinRoom() { showScreen('joinRoomScreen'); }

    function generateRoomCode() { return Math.random().toString(36).substr(2, 4).toUpperCase(); }
    function shuffleArray(array) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
      return arr;
    }
    function escapeHtml(text) {
      const div = document.createElement('div'); div.textContent = text; return div.innerHTML;
    }
    function toggleBlur() {
      codeBlurred = !codeBlurred;
      const codeEl = document.getElementById('displayRoomCode');
      if (codeBlurred) codeEl.classList.add('blurred'); else codeEl.classList.remove('blurred');
    }

    // ===== 🔗 SHARE ROOM (one-tap join link) =====
    function roomShareLink() {
      return location.origin + location.pathname + '?room=' + roomCode;
    }
    async function shareRoom() {
      if (!roomCode) return;
      const url = roomShareLink();
      const game = GAME_LABELS[(currentRoom || {}).game] || 'a game';
      const text = tPO('share_text', { g: game, c: roomCode });
      // Phones: native share sheet. Computers: straight to the clipboard.
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || '');
      if (navigator.share && isMobile) {
        try { await navigator.share({ title: tPO('share_title', { c: roomCode }), text: text, url: url }); return; }
        catch (e) { if (e && e.name === 'AbortError') return; /* cancelled */ }
      }
      try {
        await navigator.clipboard.writeText(url);
        showNotification('Room link copied! Send it to your friends — one tap and they join the room.', 4000);
      } catch (e) {
        showInteraction(ic('link') + ' Room link', 'Copy this link and send it to your friends:<br><br><code style="user-select: all; word-break: break-all; color: var(--accent);">' + url + '</code>', [
          { label: 'OK', onclick: () => { closeInteraction(); }, class: 'primary' }
        ]);
      }
    }
    // A share link opened the app (?room=CODE): jump straight into the room.
    function shareLinkCode() {
      try {
        const c = (new URLSearchParams(location.search).get('room') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        return c.length === 4 ? c : null;
      } catch (e) { return null; }
    }
    async function tryShareLinkJoin() {
      const code = shareLinkCode();
      if (!code || roomCode) return;
      try { history.replaceState(null, '', location.pathname); } catch (e) {} // clean the URL
      showNotification('Opening shared room ' + code + '…', 3000);
      await joinRoomByCode(code);
    }

    function selectHostSource(type) {
      hostSource = type;
      const map = { favorites: 'hostSrcFavorites', generic: 'hostSrcGeneric', mix: 'hostSrcMix', watched: 'hostSrcWatched' };
      Object.values(map).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('selected', id === map[type]);
      });
      try { updateHostMix(); } catch (e) {} // 🔀 the Mix split bar only shows in Mix mode
    }

    function selectVisibility(type) {
      roomVisibility = type;
      document.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('selected'));
      // Fix: use the clicked element properly
      const target = arguments[1] ? arguments[1].currentTarget : event ? event.currentTarget : document.querySelector('.radio-option.selected');
      if (target) target.classList.add('selected');
    }

    function updateHostCharCount() {
      const value = document.getElementById('hostCharCountSlider').value;
      document.getElementById('hostCharCountValue').textContent = value;
      const mixSlider = document.getElementById('hostMixSlider');
      mixSlider.max = value;
      if (parseInt(mixSlider.value) > parseInt(value)) { mixSlider.value = Math.floor(value / 2); }
      updateHostMix();
    }

    // ===== CREATE-ROOM SCREEN — GAME PICKER =====
    // 🎮 Single screen: small game cards (no tabs) — clicking a card updates
    // the hidden <select id="gameSelect"> so all existing logic keeps working.
    function selectHostGame(game) {
      const sel = document.getElementById('gameSelect');
      // keep your live edits when flipping between game cards
      if (sel && sel.value && sel.value !== game) { try { cfgSession[sel.value] = collectRoomConfig(); } catch (e) {} }
      if (sel) sel.value = game;
      try { onGameSelectChange(); } catch (e) {}
    }
    // ===== LOBBY SETTINGS MODAL — GAME PICKER =====
    // 🎮 Same mini cards as the create screen — they drive the hidden
    // <select id="modalGameSelect"> so modalGameChanged() stays untouched.
    function modalCardGame(g) {
      const sel = document.getElementById('modalGameSelect');
      if (sel) sel.value = g;
      try { modalGameChanged(); } catch (e) {}
      syncModalGameCards();
    }
    function syncModalGameCards() {
      const sel = document.getElementById('modalGameSelect');
      if (!sel) return;
      document.querySelectorAll('#modalGamePick .game-pick-card').forEach(function (c) { c.classList.toggle('selected', c.dataset.game === sel.value); });
    }

    // ===== 💾 SETTINGS MEMORY =====
    // ① AUTO per game: creating a room stores the whole form under that game —
    //    picking that game card again restores exactly what you last played.
    // ② NAMED configs: 💾 Save (top-left) snapshots the CURRENT game's setup
    //    under a name you choose; 📂 Load lists them to reload anytime.
    const LAST_GAME_CFG_KEY = 'sakugame_last_games_v2';
    const NAMED_CFG_KEY = 'sakugame_configs_v1';
    let cfgSession = {}; // live edits per game while the form is open (memory only)
    function clampN(v, min, max, dflt) {
      const n = parseInt(v, 10);
      if (isNaN(n)) return dflt;
      return Math.min(max, Math.max(min, n));
    }
    function collectRoomConfig() {
      return {
        game: (document.getElementById('gameSelect') || {}).value || hostGame || 'guesswho',
        visibility: roomVisibility || 'private', source: hostSource || 'generic',
        ucMax: ucMaxPlayers, ucMw: !!ucMrWhite, multiMax: multiMaxPlayers, hcMax: hcMaxPlayers, hcMode: hostHcMode, hcHideRank: !!hostHcHideRank,
        charCount: clampN(document.getElementById('hostCharCountSlider').value, 12, 80, 24),
        mix: clampN(document.getElementById('hostMixSlider').value, 0, 80, 12),
        pool: hostPool,
        raceLives: hostRaceLives, raceQuestions: hostRaceQuestions,
        bgMode: hostBgMode, bgRounds: hostBgRounds, bgStageSec: hostBgStageSec
      };
    }
    // Restore a snapshot into the whole form (clamped + guarded)
    function applyRoomConfig(cfg) {
      if (!cfg || typeof cfg !== 'object') return;
      const GAMES = ['guesswho', 'battle', 'race', 'blur', 'undercover', 'hotcold'];
      if (['guesswho', 'battle', 'race', 'blur', 'undercover', 'hotcold'].indexOf(cfg.game) >= 0) { hostGame = cfg.game; document.getElementById('gameSelect').value = cfg.game; }
      // 🔒 visibility radios
      const vis = cfg.visibility === 'public' ? 'public' : 'private';
      roomVisibility = vis;
      document.querySelectorAll('#createTabRoom input[name="visibility"]').forEach(function (inp) {
        inp.checked = inp.value === vis;
        const lab = inp.closest('.radio-option');
        if (lab) lab.classList.toggle('selected', inp.value === vis);
      });
      // 👥 player counts
      multiMaxPlayers = clampN(cfg.multiMax, 3, 8, 6);
      document.getElementById('hostMultiMaxSlider').value = multiMaxPlayers; updateMultiMaxPlayers();
      hcMaxPlayers = clampN(cfg.hcMax, 2, 6, 4);
      document.getElementById('hostHcMaxSlider').value = hcMaxPlayers; updateHcMaxPlayers();
      if (cfg.hcMode) setHostHcMode(cfg.hcMode === 'individual' ? 'individual' : 'shared');
      setHostHcRank(!!cfg.hcHideRank);
      ucMaxPlayers = clampN(cfg.ucMax, 3, 8, 5);
      document.getElementById('hostUcMaxSlider').value = ucMaxPlayers; updateUcMaxPlayers();
      // 🃏 pool + Guess Who board
      if (['generic', 'favorites', 'mix', 'watched'].indexOf(cfg.source) >= 0) selectHostSource(cfg.source);
      document.getElementById('hostCharCountSlider').value = clampN(cfg.charCount, 12, 80, 24); updateHostCharCount();
      document.getElementById('hostMixSlider').value = clampN(cfg.mix, 0, parseInt(document.getElementById('hostMixSlider').max) || 80, 12); updateHostMix();
      if (cfg.pool) selectHostPool(cfg.pool === 'watched' ? 'watched' : 'random');
      // ⚡ race
      hostRaceLives = clampN(cfg.raceLives, 1, 5, RACE_DEFAULT_LIVES);
      document.getElementById('hostRaceLivesSlider').value = hostRaceLives; updateRaceLivesSlider();
      hostRaceQuestions = clampN(cfg.raceQuestions, 1, 15, RACE_DEFAULT_QUESTIONS);
      document.getElementById('hostRaceQuestionsSlider').value = hostRaceQuestions; updateRaceQuestionsSlider();
      // 🌫️ blur
      hostBgRounds = clampN(cfg.bgRounds, 5, 80, BLUR_ROUNDS_DEFAULT);
      document.getElementById('hostBgRoundsSlider').value = hostBgRounds; updateBgRoundsSlider();
      hostBgStageSec = clampN(cfg.bgStageSec, 5, 30, BLUR_STAGE_SEC);
      document.getElementById('hostBgStageSecSlider').value = hostBgStageSec; updateBgStageSecSlider();
      selectHostBgMode(cfg.bgMode === 'covers' ? 'covers' : 'characters');
      // 🕵️ undercover
      selectUcMrWhite(!!cfg.ucMw);
    }
    // map { game → last played snapshot }  (+ one-time migration of the old global default)
    function loadLastMap() {
      let map = null;
      try { map = JSON.parse(localStorage.getItem(LAST_GAME_CFG_KEY) || 'null'); } catch (e) {}
      if (!map || typeof map !== 'object') {
        map = {};
        try {
          const old = JSON.parse(localStorage.getItem('sakugame_room_cfg_v1') || 'null');
          if (old && old.game) {
            map[old.game] = old;
            try { localStorage.setItem(LAST_GAME_CFG_KEY, JSON.stringify(map)); } catch (e) {}
            try { localStorage.removeItem('sakugame_room_cfg_v1'); } catch (e) {}
          }
        } catch (e) {}
      }
      return map;
    }
    function rememberLastFor(game) {
      try {
        const map = loadLastMap();
        map[game] = collectRoomConfig();
        localStorage.setItem(LAST_GAME_CFG_KEY, JSON.stringify(map));
      } catch (e) {}
    }

    // ===== 🗂️ NAMED CONFIGS (Save / Load buttons, top-left of create room) =====
    let cfgSaveContext = 'form'; // 'form' = create screen · 'room' = lobby ⚙️ settings
    let cfgLoadContext = 'form';
    function loadNamedCfgs() {
      try { const l = JSON.parse(localStorage.getItem(NAMED_CFG_KEY) || '[]'); return Array.isArray(l) ? l : []; } catch (e) { return []; }
    }
    function storeNamedCfgs(l) { try { localStorage.setItem(NAMED_CFG_KEY, JSON.stringify(l)); } catch (e) {} }
    function openConfigSave(context) {
      cfgSaveContext = context === 'room' && isHost && currentRoom ? 'room' : 'form';
      const g = cfgSaveContext === 'room' ? (currentRoom.game || 'guesswho') : ((document.getElementById('gameSelect') || {}).value || 'guesswho');
      const inp = document.getElementById('cfgNameInput');
      if (inp) inp.value = (GAME_LABELS[g] || g) + ' config';
      document.getElementById('configSaveModal').classList.add('show');
      setTimeout(function () { try { inp.focus(); inp.select(); } catch (e) {} }, 60);
    }
    function closeConfigSave() { document.getElementById('configSaveModal').classList.remove('show'); }
    function confirmConfigSave() {
      const fromRoom = cfgSaveContext === 'room' && isHost && currentRoom;
      const g = fromRoom ? (currentRoom.game || 'guesswho') : ((document.getElementById('gameSelect') || {}).value || 'guesswho');
      const snap = fromRoom ? collectModalConfig() : collectRoomConfig();
      const inp = document.getElementById('cfgNameInput');
      const name = ((inp && inp.value) || '').trim().slice(0, 30) || ((GAME_LABELS[g] || g) + ' config');
      const list = loadNamedCfgs();
      list.unshift({ id: Date.now(), name: name, game: g, snapshot: snap, createdAt: Date.now() });
      storeNamedCfgs(list);
      closeConfigSave();
      showNotification('Config saved!');
    }
    function openConfigLoad(context) {
      cfgLoadContext = context === 'room' && isHost && currentRoom ? 'room' : 'form';
      renderCfgLoadList();
      document.getElementById('configLoadModal').classList.add('show');
    }
    function closeConfigLoad() { document.getElementById('configLoadModal').classList.remove('show'); }
    function renderCfgLoadList() {
      const box = document.getElementById('cfgLoadList');
      if (!box) return;
      const list = loadNamedCfgs();
      if (!list.length) {
        box.innerHTML = '<p style="color: var(--muted); text-align: center;">No saved configs yet — press Save to keep your setup!</p>';
        return;
      }
      box.innerHTML = list.map(function (c) {
        const gl = GAME_LABELS[c.game] || c.game || '?';
        return '<div class="cfg-row">' +
          '<div class="cfg-name">' + escapeHtml(String(c.name)) + '<small>' + escapeHtml(gl) + '</small></div>' +
          '<button class="secondary small" onclick="onCfgRowLoadClick(' + c.id + ')">Load</button>' +
          '<button class="danger small" aria-label="Delete" title="Delete" onclick="deleteNamedCfg(' + c.id + ')"><svg class="ic"><use href="#i-trash"/></svg></button>' +
          '</div>';
      }).join('');
    }
    function onCfgRowLoadClick(id) {
      if (cfgLoadContext === 'room') loadNamedCfgToRoom(id); else loadNamedCfg(id);
    }
    function loadNamedCfg(id) {
      const c = loadNamedCfgs().find(function (x) { return x.id === id; });
      if (!c || !c.snapshot) { showNotification('Could not load this config.'); return; }
      try {
        applyRoomConfig(c.snapshot);
        // make it the session truth too, so onGameSelectChange() won't overwrite it
        cfgSession[(document.getElementById('gameSelect') || {}).value] = c.snapshot;
        onGameSelectChange();
        closeConfigLoad();
        showNotification('Config loaded!');
      } catch (e) { showNotification('Could not load this config.'); }
    }
    // 🏠 Room context: snapshot = the room's LIVE settings (same field names as the form)
    function collectModalConfig() {
      const g = (currentRoom || {}).game || 'guesswho';
      const s = (currentRoom || {}).settings || {};
      const maxP = clampN((currentRoom || {}).maxPlayers, 3, 8, g === 'undercover' ? 5 : 6);
      return {
        game: g, visibility: (currentRoom || {}).visibility === 'public' ? 'public' : 'private',
        source: currentSource() || 'generic',
        ucMax: maxP, ucMw: !!s.mrWhite, multiMax: maxP, hcMax: clampN((currentRoom || {}).maxPlayers, 2, 6, 4),
        charCount: clampN(s.characterCount, 12, 80, 24),
        mix: clampN(s.mixCount, 0, 80, Math.floor(clampN(s.characterCount, 12, 80, 24) / 2)),
        pool: currentPoolMode(), hcHideRank: !!s.hcHideRank,
        raceLives: clampN(s.raceLives, 1, 5, RACE_DEFAULT_LIVES),
        raceQuestions: clampN(s.raceQuestions, 1, 15, RACE_DEFAULT_QUESTIONS),
        bgMode: s.bgMode === 'covers' ? 'covers' : 'characters',
        bgRounds: clampN(s.bgRounds, 5, 80, BLUR_ROUNDS_DEFAULT),
        bgStageSec: clampN(s.bgStageSec, 5, 30, BLUR_STAGE_SEC)
      };
    }
    // …and loading writes the saved settings straight into the current room
    async function loadNamedCfgToRoom(id) {
      const c = loadNamedCfgs().find(function (x) { return x.id === id; });
      if (!c || !c.snapshot) { showNotification('Could not load this config.'); return; }
      const g = (currentRoom || {}).game || 'guesswho';
      if (c.game && c.game !== g) { showNotification('That config is for another game — switch games first!'); return; }
      closeConfigLoad();
      await applyConfigToRoom(c.snapshot);
    }
    async function applyConfigToRoom(cfg) {
      if (!isHost || !currentRoom || !roomCode) { showNotification('Could not load this config.'); return; }
      const g = currentRoom.game || 'guesswho';
      const playerCount = Object.keys(currentRoom.players || {}).length;
      const updates = { visibility: cfg.visibility === 'public' ? 'public' : 'private' };
      if (g === 'undercover') {
        updates.maxPlayers = Math.min(8, Math.max(Math.max(3, playerCount), clampN(cfg.ucMax, 3, 8, 5)));
        updates['settings/mrWhite'] = !!cfg.ucMw;
      } else {
        if (g === 'hotcold' || g === 'blur') {
          if (cfg.pool) updates['settings/pool'] = cfg.pool === 'watched' ? 'watched' : 'random';
        } else if (['generic', 'favorites', 'mix', 'watched'].indexOf(cfg.source) >= 0) updates['settings/source'] = cfg.source;
        if (g === 'guesswho' || g === 'battle' || g === 'race') {
          updates['settings/characterCount'] = clampN(cfg.charCount, 12, 80, 24);
          updates['settings/mixCount'] = clampN(cfg.mix, 0, 80, Math.floor(clampN(cfg.charCount, 12, 80, 24) / 2));
        }
        if (g === 'battle' || g === 'race' || g === 'blur') updates.maxPlayers = Math.min(8, Math.max(Math.max(3, playerCount), clampN(cfg.multiMax, 3, 8, 6)));
        if (g === 'hotcold') updates.maxPlayers = Math.min(6, Math.max(Math.max(2, playerCount), clampN(cfg.hcMax, 2, 6, 4)));
        if (g === 'hotcold' && cfg.hcMode) updates['settings/hcMode'] = cfg.hcMode === 'individual' ? 'individual' : 'shared'; // legacy presets keep the room's current mode
        if (g === 'hotcold' && cfg.hcHideRank != null) updates['settings/hcHideRank'] = !!cfg.hcHideRank;
        if (g === 'race') {
          updates['settings/raceLives'] = clampN(cfg.raceLives, 1, 5, RACE_DEFAULT_LIVES);
          updates['settings/raceQuestions'] = clampN(cfg.raceQuestions, 1, 15, RACE_DEFAULT_QUESTIONS);
        }
        if (g === 'blur') {
          updates['settings/bgRounds'] = clampN(cfg.bgRounds, 5, 80, BLUR_ROUNDS_DEFAULT);
          updates['settings/bgStageSec'] = clampN(cfg.bgStageSec, 5, 30, BLUR_STAGE_SEC);
          updates['settings/bgMode'] = cfg.bgMode === 'covers' ? 'covers' : 'characters';
        }
      }
      try {
        await database.ref('rooms/' + roomCode).update(updates);
        touchActivity();
        // 🪞 local echo → the modal refreshes instantly (listener confirms after)
        Object.keys(updates).forEach(function (k) {
          if (k === 'visibility') currentRoom.visibility = updates[k];
          else if (k === 'maxPlayers') currentRoom.maxPlayers = updates[k];
          else if (k.indexOf('settings/') === 0) { currentRoom.settings = currentRoom.settings || {}; currentRoom.settings[k.slice(9)] = updates[k]; }
        });
        try { openRoomSettings(); } catch (e) {}
        showNotification('Config loaded!');
      } catch (e) { showNotification('Could not load this config.'); }
    }
    function deleteNamedCfg(id) {
      storeNamedCfgs(loadNamedCfgs().filter(function (x) { return x.id !== id; }));
      renderCfgLoadList();
    }

    function onGameSelectChange() {
      hostGame = document.getElementById('gameSelect').value || 'guesswho';
      // 💾 auto-restore this game's last played (or in-session) settings
      try {
        let snap = cfgSession[hostGame];
        if (!snap) { const m = loadLastMap(); snap = m[hostGame] || null; }
        if (snap) applyRoomConfig(snap);
      } catch (e) {}
      // 🎮 highlight the matching mini card
      document.querySelectorAll('#hostGamePick .game-pick-card').forEach(function (c) { c.classList.toggle('selected', c.dataset.game === hostGame); });
      const isUc = hostGame === 'undercover';
      const isMulti = hostGame === 'battle' || hostGame === 'race' || hostGame === 'blur';
      const isBlur = hostGame === 'blur';
      // 🏠 Room tab: only ONE player-count control matches the game
      document.getElementById('hostGwPlayersHint').style.display = hostGame === 'guesswho' ? 'block' : 'none';
      document.getElementById('hostHcMaxBlock').style.display = hostGame === 'hotcold' ? 'block' : 'none';
      document.getElementById('hostMultiMaxBlock').style.display = isMulti ? 'block' : 'none';
      document.getElementById('hostUcMaxBlock').style.display = isUc ? 'block' : 'none';
      // ⚙️ Game tab: pool for all but Undercover; Guess Who board settings for
      // guesswho/battle/race (Blur & Hot & Cold draw from the FULL pool — no count)
      document.getElementById('hostPoolGroup').style.display = isUc ? 'none' : 'block';
      // 👀🎲 HC/Blur get the simplified Random/Watched pair; Guess Who games keep Generic/Favorites/Mix
      const watchUi = isBlur || hostGame === 'hotcold';
      document.getElementById('hostPoolSrcGwGroup').style.display = watchUi ? 'none' : 'block';
      document.getElementById('hostPoolSrcWatchGroup').style.display = watchUi ? 'block' : 'none';
      document.getElementById('hostGwSettings').style.display = (isUc || isBlur || hostGame === 'hotcold') ? 'none' : 'block';
      document.getElementById('hostUcSettings').style.display = isUc ? 'block' : 'none';
      document.getElementById('hostMultiSettings').style.display = isMulti ? 'block' : 'none';
      // ❤️/❓ sliders are Race-only, 🌫️ options are Blur-only
      document.querySelectorAll('.race-only-settings').forEach(el => { el.style.display = hostGame === 'race' ? 'block' : 'none'; });
      document.querySelectorAll('.blur-only-settings').forEach(el => { el.style.display = isBlur ? 'block' : 'none'; });
      if (isMulti) {
        document.getElementById('hostMultiLabel').textContent = hostGame === 'battle' ? 'Battle Royale' : hostGame === 'race' ? 'Race' : 'Blur Guess';
        document.getElementById('hostMultiDesc').textContent = hostGame === 'battle'
          ? 'Everyone picks a secret character. On your turn you ask ONE yes/no question and EVERYONE answers about their own secret. Eliminate cards on each opponent\'s colored board, guess their secrets: the earlier you find one, the more points! Last secret standing wins.'
          : hostGame === 'race'
            ? 'One random player is the TARGET: they secretly pick the mystery character and answer all questions honestly. Hunters take turns ASKING — but GUESSING is free for everyone, at any moment (wrong = -1 life)! First to find the mystery character wins!'
            : 'A blurred character slowly clears over 5 stages — name them as early as you can! Stage 1 = 5 pts, stage 5 = 1 pt. With friends, the fastest correct guesses score a speed bonus (+3/+2/+1). Playable SOLO too!';
      }
    }
    function updateUcMaxPlayers() {
      ucMaxPlayers = parseInt(document.getElementById('hostUcMaxSlider').value);
      document.getElementById('hostUcMaxValue').textContent = ucMaxPlayers;
    }
    function updateMultiMaxPlayers() {
      multiMaxPlayers = parseInt(document.getElementById('hostMultiMaxSlider').value);
      document.getElementById('hostMultiMaxValue').textContent = multiMaxPlayers;
    }
    function updateHcMaxPlayers() {
      hcMaxPlayers = parseInt(document.getElementById('hostHcMaxSlider').value, 10) || 4;
      document.getElementById('hostHcMaxValue').textContent = hcMaxPlayers;
    }
    // 🌡️ Hot & Cold seat count (lobby settings modal): 2-6, never below the
    // number of players already seated
    async function updateModalHcMaxPlayers() {
      const v = clampN(parseInt(document.getElementById('modalHcMaxSlider').value, 10), 2, 6, 4);
      document.getElementById('modalHcMaxValue').textContent = v;
      if (isHost && currentRoom && currentRoom.game === 'hotcold') {
        const pc = Object.keys(currentRoom.players || {}).length;
        await database.ref('rooms/' + roomCode + '/maxPlayers').set(Math.min(6, Math.max(Math.max(2, pc), v)));
        touchActivity();
      }
    }
    function updateRaceLivesSlider() {
      hostRaceLives = parseInt(document.getElementById('hostRaceLivesSlider').value);
      document.getElementById('hostRaceLivesValue').textContent = hostRaceLives;
    }
    function updateRaceQuestionsSlider() {
      hostRaceQuestions = parseInt(document.getElementById('hostRaceQuestionsSlider').value);
      document.getElementById('hostRaceQuestionsValue').textContent = hostRaceQuestions;
    }
    function updateBgRoundsSlider() {
      hostBgRounds = parseInt(document.getElementById('hostBgRoundsSlider').value);
      document.getElementById('hostBgRoundsValue').textContent = hostBgRounds;
    }
    function updateBgStageSecSlider() {
      hostBgStageSec = parseInt(document.getElementById('hostBgStageSecSlider').value);
      document.getElementById('hostBgStageSecValue').textContent = hostBgStageSec + 's';
    }
    function selectHostBgMode(mode) {
      hostBgMode = mode === 'covers' ? 'covers' : 'characters';
      document.getElementById('hostBgModeChars').classList.toggle('selected', hostBgMode === 'characters');
      document.getElementById('hostBgModeCovers').classList.toggle('selected', hostBgMode === 'covers');
    }
    function selectUcMrWhite(on) {
      ucMrWhite = !!on;
      document.getElementById('hostUcMwOff').classList.toggle('selected', !on);
      document.getElementById('hostUcMwOn').classList.toggle('selected', !!on);
    }

    async function createGameRoom() {
      const game = document.getElementById('gameSelect').value || 'guesswho';
        const isUc = game === 'undercover';
        const isMulti = game === 'battle' || game === 'race' || game === 'blur';
        const isWatchGame = game === 'blur' || game === 'hotcold';
      if (!isUc && !isWatchGame && hostSource === 'favorites' && hostAccounts.length === 0) { showNotification('Favorites needs a synced AniList account (profile menu) — or switch the pool to Generic!'); return; }
      if (!isUc && !isWatchGame && hostSource === 'watched' && hostAccounts.length === 0) { showNotification('Watched needs a synced AniList account (profile menu) — or pick another pool!'); return; }
      if (isWatchGame && hostPool === 'watched' && hostAccounts.length === 0) { showNotification('Watched needs synced AniList accounts — friends auto-sync when they join with a linked account (or switch the pool to Random).'); }
      roomCode = generateRoomCode(); isHost = true;
      const charCount = parseInt(document.getElementById('hostCharCountSlider').value);
      try {
        const roomData = {
          host: playerId, game: game, visibility: roomVisibility,
          players: { [playerId]: { id: playerId, ready: false, name: playerName, isHost: true, avatar: myAvatar() || '' } },
          state: 'lobby', chat: {}, createdAt: Date.now(), lastActivity: Date.now()
        };
        if (isUc) {
          roomData.maxPlayers = ucMaxPlayers;
          roomData.settings = { mrWhite: ucMrWhite };
        } else {
          if (game === 'hotcold') roomData.maxPlayers = Math.min(6, Math.max(2, hcMaxPlayers));
          roomData.accounts = hostAccounts.reduce((acc, a) => { acc[a.username] = a; return acc; }, {});
          roomData.settings = { characterCount: charCount, mixCount: clampN(hostMixCount, 0, charCount, Math.floor(charCount / 2)), source: hostSource };
          if (game === 'hotcold') roomData.settings.hcMode = hostHcMode; // 🔀 shared | individual guesses
          if (game === 'hotcold') roomData.settings.hcHideRank = !!hostHcHideRank; // 📊 hide the live ranking until match end
          if (isWatchGame) roomData.settings.pool = hostPool; // 🎲 random (full pool) | watched (synced accounts' seen anime)
          if (isMulti) roomData.maxPlayers = multiMaxPlayers;
          if (game === 'race') { roomData.settings.raceLives = hostRaceLives; roomData.settings.raceQuestions = hostRaceQuestions; }
          if (game === 'blur') {
            roomData.settings.bgRounds = hostBgRounds;
            roomData.settings.bgStageSec = hostBgStageSec;
            roomData.settings.bgMode = hostBgMode;
          }
        }
        await database.ref('rooms/' + roomCode).set(roomData);
        try { rememberLastFor(game); } catch (e) {} // 💾 auto-remember this game's setup
        setupRoomListener(); setupChatListener(); setupPlayerCleanup(); markDisconnectTracking();
        showScreen('lobbyScreen');
        document.getElementById('displayRoomCode').textContent = roomCode;
        document.getElementById('lobbySettingsIcon').style.display = 'block';
        document.getElementById('lobbyGameName').innerHTML = ic(GAME_ICONS[game] || 'gamepad') + ' ' + (GAME_LABELS[game] || 'Anime Guess Who?');
        document.getElementById('lobbyRoomType').textContent = roomVisibility === 'private' ? 'Private' : 'Public';
        updateLobby();
      } catch (error) { showNotification('Error creating room: ' + error.message); console.error('Firebase error:', error); }
    }

    async function joinGameRoom() {
      const input = document.getElementById('joinRoomInput');
      const code = input.value.trim().toUpperCase();
      if (code.length !== 4) { showNotification('Please enter a 4-digit room code'); return; }
      await joinRoomByCode(code);
    }

    // One shared join path for the code input AND the 🌐 public room cards.
    // Free seat + lobby → you sit down directly. Game in progress (or full)
    // → you wait in the room's QUEUE and auto-join when a seat opens.
    async function joinRoomByCode(code) {
      try {
        const roomSnapshot = await database.ref('rooms/' + code).once('value');
        if (!roomSnapshot.exists()) { showNotification('Room not found. Check the code and try again.'); return; }
        const room = roomSnapshot.val();
        roomCode = code; isHost = false;
        const playerCount = Object.keys(room.players || {}).length;
        const maxPlayers = room.maxPlayers || 2;
        // Rejoining a room I'm already part of? Just re-enter.
        const alreadySeated = !!(room.players && room.players[playerId]);
        const alreadyQueued = !!(room.queue && room.queue[playerId]);
        if (alreadySeated || alreadyQueued) {
          setupRoomListener(); setupChatListener(); setupPlayerCleanup();
          if (alreadySeated) markDisconnectTracking(); else markQueueDisconnect();
          afterJoinUI(room);
          return;
        }
        if (room.state === 'lobby' && playerCount < maxPlayers) {
          await database.ref('rooms/' + roomCode + '/players/' + playerId).set({ id: playerId, ready: false, name: playerName, isHost: false, avatar: myAvatar() || '' });
          touchActivity();
          setupRoomListener(); setupChatListener(); setupPlayerCleanup(); markDisconnectTracking();
          syncMyAccountIntoRoom(); // guest's synced AniList account joins the pool automatically
          afterJoinUI(room);
        } else {
          // ⏳ QUEUE: no free seat right now — wait for the next game
          const queueCount = Object.keys(room.queue || {}).length;
          if (queueCount >= QUEUE_MAX) { showNotification('That room\'s queue is full (' + QUEUE_MAX + ' waiting) — try another room!'); roomCode = null; return; }
          await database.ref('rooms/' + roomCode + '/queue/' + playerId).set({ id: playerId, name: playerName, avatar: myAvatar() || '', joinedAt: Date.now() });
          touchActivity();
          setupRoomListener(); setupChatListener(); setupPlayerCleanup(); markQueueDisconnect();
          afterJoinUI(room);
          showNotification((room.state === 'lobby' ? 'Room full' : 'Game in progress') + ' — you are #' + (queueCount + 1) + ' in the queue. You\'ll jump in automatically!', 5000);
        }
      } catch (error) { showNotification('Error joining room: ' + error.message); console.error('Firebase error:', error); }
    }
    function afterJoinUI(room) {
      showScreen('lobbyScreen');
      document.getElementById('displayRoomCode').textContent = roomCode;
      document.getElementById('lobbyGameName').innerHTML = ic(GAME_ICONS[room.game] || 'gamepad') + ' ' + (GAME_LABELS[room.game] || 'Anime Guess Who?');
      document.getElementById('lobbyRoomType').textContent = room.visibility === 'private' ? 'Private' : 'Public';
      updateLobby();
    }

    // 🌐 Re-render runtime-built strings (t()/tPO() labels) after a language
    // switch — the DOM observer can only retranslate dictionary text nodes.
    window.addEventListener('saku-lang-change', function () {
      try {
        if (!currentRoom) return;
        if (document.getElementById('lobbyScreen').classList.contains('active')) updateLobby();
        const g = currentRoom.game;
        if (currentRoom.state === 'selection' && document.getElementById('selectionScreen').classList.contains('active')) {
          if (g === 'battle' || g === 'race') { showMultiSelection(); multiSelectionTick(); }
          else if (g === 'guesswho') showCharacterSelection();
          return;
        }
        if (g === 'undercover' && document.getElementById('undercoverScreen').classList.contains('active')) updateUndercover();
        else if (g === 'battle' && document.getElementById('battleScreen').classList.contains('active')) updateBattle();
        else if (g === 'race' && document.getElementById('raceScreen').classList.contains('active')) updateRace();
        else if (g === 'blur' && document.getElementById('blurScreen').classList.contains('active')) updateBlur();
        else if (g === 'hotcold' && document.getElementById('hotcoldScreen').classList.contains('active')) updateHotcold();
        else if (g === 'guesswho' && document.getElementById('gameScreen').classList.contains('active')) updateGame();
      } catch (e) { /* best effort — the observer already covered static text */ }
    });

    function setupRoomListener() {
      if (roomRef) { roomRef.off(); }
      roomRef = database.ref('rooms/' + roomCode);
      roomRef.on('value', (snapshot) => {
        currentRoom = snapshot.val();
        if (!currentRoom) { showNotification('Room was closed'); goHome(); return; }
        // Keep local host status in sync with the room data (supports host transfer)
        if (currentRoom.players && currentRoom.players[playerId]) {
          const wasHost = isHost;
          isHost = !!currentRoom.players[playerId].isHost;
          if (isHost && !wasHost) showNotification('You are now the room host!');
          document.getElementById('lobbySettingsIcon').style.display = isHost ? 'block' : 'none';
        }
        // ⏳ QUEUE membership: waiting (queue/{pid}) vs seated (players/{pid}).
        // Seated/queue transitions flip local state + notifications exactly once.
        const meSeated = !!(currentRoom.players && currentRoom.players[playerId]);
        const meWaiting = !!(currentRoom.queue && currentRoom.queue[playerId]);
        if (meWaiting && !meSeated) {
          if (!imQueued) {
            // I just got queued (joined a full room, or the host switched to a
            // game with fewer seats) → disconnect tracking moves to the queue entry
            cancelDisconnectTracking();
            markQueueDisconnect();
          }
          imQueued = true;
        } else if (meSeated && imQueued) {
          imQueued = false;
          cancelQueueDisconnect();
          markDisconnectTracking();      // switch disconnect tracking to the seat
          syncMyAccountIntoRoom();       // a promoted player's AniList pool joins the room
          showNotification('A seat opened — you\'re in! Ready up!', 4000);
        } else if (!meSeated && !meWaiting) {
          imQueued = false;
        }
        maybePromoteQueue(); // host moves queued people into free seats; lobbyless queue-head self-promotes
        maybeAbortEmptyGame(); // host resets the room when EVERYBODY abandoned the running game
        updateLobby();
        ensureHostPresent();
        purgeDisconnectedPlayers();
        if (currentRoom.state !== 'finished') gameResultCounted = false; // re-arm stat counting for the next game
        const isUcRoom = currentRoom.game === 'undercover';
        if (currentRoom.state === 'lobby') { showScreen('lobbyScreen'); document.getElementById('winningScreen').classList.remove('show'); document.getElementById('ucEndScreen').classList.remove('show'); document.getElementById('multiEndScreen').classList.remove('show'); document.getElementById('hcEndScreen').classList.remove('show'); document.getElementById('interactionWindow').classList.remove('show'); }
        // 👀 Queued visitors auto-SPECTATE the live game (public info only);
        // an `away` queue entry parks in the lobby instead (never promoted).
        if (!meSeated) {
          const meQ = (currentRoom.queue || {})[playerId] || null;
          const inGameNow = !!(currentRoom.state && currentRoom.state !== 'lobby');
          const specEl = document.getElementById('spectateScreen');
          if (meWaiting && meQ && !meQ.away && inGameNow) {
            if (specEl && !specEl.classList.contains('active')) showScreen('spectateScreen');
            try { renderSpectate(); } catch (e) {}
          } else if (specEl && specEl.classList.contains('active')) {
            showScreen('lobbyScreen');
          }
          return;
        }
        if (isUcRoom) {
          if (currentRoom.state === 'playing' || currentRoom.state === 'finished') {
            // Players who chose "Return to Lobby" mid-game are NOT dragged back
            // into the game screen — they spectate from the lobby until "Play Again".
            const meIn = (currentRoom.players || {})[playerId] || {};
            const spectating = !!(currentRoom.uc && meIn.outInGame && meIn.outInGame === currentRoom.uc.gameId);
            const hasRole = !!(currentRoom.uc && currentRoom.uc.roles && currentRoom.uc.roles[playerId]);
            if (!spectating && hasRole && !document.getElementById('undercoverScreen').classList.contains('active')) showScreen('undercoverScreen');
            if (hasRole) updateUndercover();
            if (isHost && currentRoom.state === 'playing') hostUndercoverWatchdog();
          }
        } else if (currentRoom.game === 'battle' || currentRoom.game === 'race') {
          const isBattle = currentRoom.game === 'battle';
          const screenId = isBattle ? 'battleScreen' : 'raceScreen';
          const gdata = isBattle ? (currentRoom.br || {}) : (currentRoom.rc || {});
          if (currentRoom.state === 'selection') {
            if (!document.getElementById('selectionScreen').classList.contains('active')) showMultiSelection();
            multiSelectionTick();
          }
          if (currentRoom.state === 'playing' || currentRoom.state === 'finished') {
            const meP = (currentRoom.players || {})[playerId] || {};
            const participates = gdata.gameId && meP.outInGame !== gdata.gameId &&
              (isBattle ? !!(gdata.secrets && gdata.secrets[playerId])
                        : (gdata.targetPid === playerId || (gdata.hunters || []).indexOf(playerId) !== -1));
            if (participates && !document.getElementById(screenId).classList.contains('active')) showScreen(screenId);
            if (participates) { if (isBattle) updateBattle(); else updateRace(); }
            if (isHost && currentRoom.state === 'playing') { if (isBattle) battleWatchdog(); else raceWatchdog(); }
          }
        } else if (currentRoom.game === 'blur') {
          const bg = currentRoom.bg || {};
          if (currentRoom.state === 'selection') {
            // brief "dealing" transit — Blur Guess has no pick phase
            if (!document.getElementById('blurScreen').classList.contains('active')) showScreen('blurScreen');
            const st = document.getElementById('bgStatus'); if (st) st.textContent = 'Dealing the pictures…';
          }
          if (currentRoom.state === 'playing' || currentRoom.state === 'finished') {
            const meP = (currentRoom.players || {})[playerId] || {};
            const participates = bg.gameId && meP.outInGame !== bg.gameId;
            if (participates && !document.getElementById('blurScreen').classList.contains('active')) showScreen('blurScreen');
            if (participates) updateBlur();
            if (isHost && currentRoom.state === 'playing') { blurWatchdog(); ensureBgHostTimer(); }
          }
        } else if (currentRoom.game === 'hotcold') {
          const hc = currentRoom.hc || {};
          if (currentRoom.state === 'playing' || currentRoom.state === 'finished') {
            const meP = (currentRoom.players || {})[playerId] || {};
            const participates = hc.gameId && meP.outInGame !== hc.gameId;
            if (participates && !document.getElementById('hotcoldScreen').classList.contains('active')) showScreen('hotcoldScreen');
            if (participates) updateHotcold();
            else document.getElementById('hcEndScreen').classList.remove('show');
          }
        } else {
          if (currentRoom.state === 'selection' && !document.getElementById('selectionScreen').classList.contains('active')) { showCharacterSelection(); }
          if (currentRoom.state === 'playing' && !document.getElementById('gameScreen').classList.contains('active')) { startGame(); }
          if (currentRoom.state === 'playing' || currentRoom.state === 'finished') { updateGame(); }
        }
      });
      // Listen for a kick targeted at me
      if (kickRef) { kickRef.off(); }
      kickRef = database.ref('rooms/' + roomCode + '/kicks/' + playerId);
      kickRef.on('value', (snap) => { if (snap.val()) handleKicked(); });
    }

    // If the host left (closed tab, kicked…), the remaining player with the
    // smallest id quietly becomes the new host so the room never gets stuck.
    function ensureHostPresent() {
      if (!roomCode || !currentRoom || !currentRoom.players) return;
      const players = currentRoom.players;
      const pids = Object.keys(players);
      if (pids.indexOf(playerId) === -1) return;
      const anyHost = pids.some(pid => players[pid].isHost);
      if (anyHost) return;
      pids.sort();
      if (pids[0] !== playerId) return;
      const updates = {};
      updates['rooms/' + roomCode + '/host'] = playerId;
      updates['rooms/' + roomCode + '/players/' + playerId + '/isHost'] = true;
      database.ref().update(updates);
    }

    function setupChatListener() {
      // One single chat for the whole room (lobby + games): the 💬 floating window
      database.ref('rooms/' + roomCode + '/gameChat').on('child_added', (snapshot) => { displayGameChatMessage(snapshot.val()); });
    }

    function setupPlayerCleanup() {
      database.ref('rooms/' + roomCode + '/players').on('value', (snapshot) => {
        const players = snapshot.val();
        // Don't kill the room while QUEUE members are still in it — the queue's
        // #1 promotes themself to host instead (see maybePromoteQueue).
        const queueCount = (currentRoom && currentRoom.queue) ? Object.keys(currentRoom.queue).length : 0;
        if ((!players || Object.keys(players).length === 0) && queueCount === 0) { database.ref('rooms/' + roomCode).remove(); }
      });
    }

    // ===== DISCONNECT TRACKING =====
    // Phones drop their connection all the time (screen lock, app switch…).
    // Instead of instantly deleting the player (which used to BREAK the game
    // for everyone), Firebase marks the entry with a timestamp (dcAt).
    // Games skip marked players; the host purges entries after 45 seconds.
    const dcTrackingRef = () => (roomCode && playerId) ? database.ref('rooms/' + roomCode + '/players/' + playerId + '/dcAt') : null;
    function markDisconnectTracking() {
      const ref = dcTrackingRef();
      if (!ref) return;
      ref.remove(); // clear any stale marker on (re)join
      ref.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
    }
    function cancelDisconnectTracking() {
      const ref = dcTrackingRef();
      if (ref) { try { ref.onDisconnect().cancel(); } catch (e) {} }
    }

    // HOST-ONLY: delete player entries offline for more than 45s
    const DC_GRACE_MS = 45000;
    function purgeDisconnectedPlayers() {
      if (!isHost || !currentRoom || !currentRoom.players) return;
      const now = Date.now();
      Object.keys(currentRoom.players).forEach(pid => {
        const p = currentRoom.players[pid] || {};
        if (pid !== playerId && p.dcAt && (now - Number(p.dcAt)) > DC_GRACE_MS) {
          database.ref('rooms/' + roomCode + '/players/' + pid).remove().catch(() => {});
        }
      });
    }

    function updateLobby() {
      if (!currentRoom) return;
      const playersList = document.getElementById('playersList');
      playersList.innerHTML = '';
      // real players only (skip transient disconnect-marker leftovers)
      const lobbyPlayers = Object.values(currentRoom.players || {}).filter(pl => pl && pl.name);
      lobbyPlayers.forEach(player => {
        const card = document.createElement('div'); card.className = 'player-card';
        if (player.ready) card.classList.add('ready');
        if (player.isHost) card.classList.add('host');
        card.innerHTML = `<div class="player-head">${avatarCircle(player.avatar, 'ava-lobby')}<div class="player-info"><div class="name">${player.isHost ? '<span class="host-badge">' + ic('crown') + ' HOST</span>' : ''}${escapeHtml(String(player.name || ''))}</div><div class="status">${player.id === playerId ? '(You)' : ''}</div></div></div>${player.ready ? '<div class="ready-badge">' + ic('check') + ' Ready</div>' : ''}`;
        const rightWrap = document.createElement('div');
        rightWrap.className = 'player-card-right';
        if (card.lastElementChild && card.lastElementChild.classList.contains('ready-badge')) rightWrap.appendChild(card.lastElementChild);
        // Host-only admin actions on other players: transfer host (crown) and kick (cross)
        if (isHost && player.id !== playerId) {
          const actions = document.createElement('div');
          actions.className = 'player-admin-actions';
          const crownBtn = document.createElement('button');
          crownBtn.className = 'player-admin-btn crown-btn';
          crownBtn.title = 'Make ' + (player.name || 'this player') + ' the room host';
          crownBtn.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M2 8 L7 12.5 L12 4 L17 12.5 L22 8 L20 18 L4 18 Z" fill="#fff"/></svg>';
          crownBtn.addEventListener('click', (e) => { e.stopPropagation(); confirmTransferHost(player.id); });
          const kickBtn = document.createElement('button');
          kickBtn.className = 'player-admin-btn kick-btn';
          kickBtn.title = 'Kick ' + (player.name || 'this player') + ' from the room';
          kickBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6 L18 18 M18 6 L6 18" stroke="#fff" stroke-width="3.2" stroke-linecap="round" fill="none"/></svg>';
          kickBtn.addEventListener('click', (e) => { e.stopPropagation(); confirmKickPlayer(player.id); });
          actions.appendChild(crownBtn);
          actions.appendChild(kickBtn);
          rightWrap.appendChild(actions);
          // Phones have no hover → tapping the card reveals the 👑/✕ buttons (touch devices only)
          if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
            card.addEventListener('click', () => {
              const was = card.classList.contains('show-actions');
              document.querySelectorAll('.player-card.show-actions').forEach(c => c.classList.remove('show-actions'));
              if (!was) card.classList.add('show-actions');
            });
          }
        }
        card.appendChild(rightWrap);
        playersList.appendChild(card);
      });
      const playerCount = lobbyPlayers.length;
      const allReady = lobbyPlayers.every(p => p.ready);
      // ⏳ Queue: who's waiting for a seat (FIFO by join time)
      const queueList = Object.values(currentRoom.queue || {}).filter(q => q && q.name)
        .sort((a, b) => ((a.joinedAt || 0) - (b.joinedAt || 0)) || String(a.id).localeCompare(String(b.id)));
      const countEl = document.getElementById('lobbyPlayerCount');
      if (countEl) countEl.textContent = playerCount + '/' + (currentRoom.maxPlayers || 2) + (queueList.length ? ' · queue +' + queueList.length : '');
      const gameNameEl = document.getElementById('lobbyGameName');
      if (gameNameEl) gameNameEl.innerHTML = ic(GAME_ICONS[currentRoom.game] || 'gamepad') + ' ' + (GAME_LABELS[currentRoom.game] || 'Anime Guess Who?');
      const isMultiGame = currentRoom.game === 'undercover' || currentRoom.game === 'battle' || currentRoom.game === 'race';
      const isBlurGame = currentRoom.game === 'blur';
      const isHcGame = currentRoom.game === 'hotcold'; // 🔥 2-6 seats (multiplayer rework)
      const canStart = isMultiGame ? (allReady && playerCount >= 3) : isBlurGame ? (allReady && playerCount >= 1) : isHcGame ? (allReady && playerCount >= 2) : (allReady && playerCount === 2); // 🌫️ Blur Guess is playable SOLO
      document.getElementById('startGameBtn').style.display = (isHost && canStart && !imQueued) ? 'block' : 'none';
      // My own "you're waiting" banner + hide Ready while queued
      const qBanner = document.getElementById('queueBanner');
      const readyBtn = document.getElementById('readyBtn');
      const myQ = queueList.findIndex(q => q.id === playerId);
      if (imQueued && myQ !== -1) {
        qBanner.style.display = 'block';
        const myAway = !!(queueList[myQ] && queueList[myQ].away);
        if (myAway) qBanner.innerHTML = ic('eye') + ' <b>You are parked AFK</b> — spectating only, you will NOT auto-join the next seat.';
        else {
          const why = currentRoom.state === 'lobby' ? 'the room is full — waiting for a free seat' : 'a game is in progress';
          qBanner.innerHTML = ic('hourglass') + ' <b>You are #' + (myQ + 1) + ' in the queue</b> — ' + why + '. You\'ll jump in automatically for the next game!';
        }
        if (readyBtn) readyBtn.style.display = 'none';
      } else {
        qBanner.style.display = 'none';
        if (readyBtn) readyBtn.style.display = 'block';
      }
      // 👀 AFK/spectate toggle: seated → park AFK (from the lobby only);
      // queued → "I'm back" (away) or "park AFK" (auto-join on)
      const afkBtn = document.getElementById('afkBtn');
      const afkLabel = document.getElementById('afkBtnLabel');
      if (afkBtn) {
        const myEntry = queueList.find(q => q.id === playerId);
        const inLobbyNow = !currentRoom.state || currentRoom.state === 'lobby';
        if (!imQueued && inLobbyNow) { afkBtn.style.display = 'block'; if (afkLabel) afkLabel.textContent = window.t ? t('Go AFK (spectate)') : 'Go AFK (spectate)'; }
        else if (imQueued && myEntry && myEntry.away) { afkBtn.style.display = 'block'; if (afkLabel) afkLabel.textContent = window.t ? t('I\'m back!') : 'I\'m back!'; }
        else if (imQueued && inLobbyNow) { afkBtn.style.display = 'block'; if (afkLabel) afkLabel.textContent = window.t ? t('Stay AFK (no auto-join)') : 'Stay AFK (no auto-join)'; }
        else afkBtn.style.display = 'none';
      }
      // Queue section (visible to everyone, host can kick from the queue)
      const qSection = document.getElementById('queueSection');
      const qList = document.getElementById('queueList');
      if (queueList.length === 0) { qSection.style.display = 'none'; }
      else {
        qSection.style.display = 'block';
        qList.innerHTML = '';
        queueList.forEach((qp, i) => {
          const card = document.createElement('div');
          card.className = 'player-card queue-card';
          const head = document.createElement('div');
          head.className = 'player-head';
          head.innerHTML = `<span class="queue-pos">#${i + 1}</span>${avatarCircle(qp.avatar, 'ava-lobby')}<div class="player-info"><div class="name">${escapeHtml(String(qp.name || ''))}</div><div class="status">${qp.id === playerId ? '(You) — ' : ''}${qp.away ? '<span class="afk-tag">AFK — spectating</span>' : 'waiting for a seat'}</div></div>`;
          card.appendChild(head);
          if (isHost && qp.id !== playerId) {
            const actions = document.createElement('div');
            actions.className = 'player-admin-actions';
            const kickBtn = document.createElement('button');
            kickBtn.className = 'player-admin-btn kick-btn';
            kickBtn.title = 'Remove ' + (qp.name || 'them') + ' from the queue';
            kickBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6 L18 18 M18 6 L6 18" stroke="#fff" stroke-width="3.2" stroke-linecap="round" fill="none"/></svg>';
            kickBtn.addEventListener('click', (e) => { e.stopPropagation(); kickQueued(qp.id); });
            actions.appendChild(kickBtn);
            const rightWrap = document.createElement('div');
            rightWrap.className = 'player-card-right';
            rightWrap.appendChild(actions);
            card.appendChild(rightWrap);
            if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
              card.addEventListener('click', () => {
                const was = card.classList.contains('show-actions');
                document.querySelectorAll('.player-card.show-actions').forEach(c => c.classList.remove('show-actions'));
                if (!was) card.classList.add('show-actions');
              });
            }
          }
          qList.appendChild(card);
        });
      }
    }

    // Remove someone from the queue (host only)
    function kickQueued(pid) {
      if (!isHost) return;
      showInteraction('Remove from the queue?', 'This player will have to join again.', [
        { label: 'Cancel', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: ic('x') + ' Remove', onclick: async () => {
          closeInteraction();
          await database.ref('rooms/' + roomCode + '/kicks/' + pid).set(Date.now());
          await database.ref('rooms/' + roomCode + '/queue/' + pid).remove();
          touchActivity();
          showNotification('Removed from the queue.');
        }, class: 'danger' }
      ]);
    }

    // ===== ⏳ QUEUE PROMOTION =====
    // Runs on every room snapshot. Normal case: the HOST fills free seats
    // from the queue, oldest first. Special case: ALL seated players left —
    // then the queue's #1 promotes THEMSELF as host so the room survives.
    async function maybePromoteQueue(force = false) {
      if (!currentRoom || !roomCode || queuePromoting) return;
      const queue = currentRoom.queue || {};
      const qPids = Object.keys(queue);
      if (qPids.length === 0) return;
      const maxP = currentRoom.maxPlayers || 2;
      const seatedCount = Object.keys(currentRoom.players || {}).length;
      const inLobby = !currentRoom.state || currentRoom.state === 'lobby';
      const sorted = Object.values(queue).filter(q => q && q.id)
        .sort((a, b) => ((a.joinedAt || 0) - (b.joinedAt || 0)) || String(a.id).localeCompare(String(b.id)));
      // Everyone seated vanished → queue #1 takes the room over (and clears the dead game)
      if (seatedCount === 0) {
        if (sorted[0].id !== playerId) return; // only queue #1 acts
        queuePromoting = true;
        try {
          const me = sorted[0];
          const updates = {
            state: 'lobby', characters: null, selections: null, secrets: null, currentTurn: null,
            eliminations: null, winner: null, currentQuestion: null, questionHistory: null,
            restarts: null, uc: null, br: null, rc: null, bg: null, hc: null,
            host: playerId
          };
          updates['players/' + playerId] = { id: playerId, ready: false, name: me.name || playerName, isHost: true, avatar: me.avatar || '' };
          updates['queue/' + playerId] = null;
          await database.ref('rooms/' + roomCode).update(updates);
          showNotification('Everyone left — you were promoted from the queue and are now the host!', 4000);
        } finally { queuePromoting = false; }
        return;
      }
      if (!isHost || (!inLobby && !force)) return;
      const slots = maxP - seatedCount;
      if (slots <= 0) return;
      const promote = sorted.filter(q => !q.away).slice(0, slots); // 👀 AFK spectators never get seated
      if (promote.length === 0) return;
      queuePromoting = true;
      try {
        const updates = {};
        promote.forEach(qp => {
          updates['players/' + qp.id] = { id: qp.id, ready: false, name: qp.name, isHost: false, avatar: qp.avatar || '' };
          updates['queue/' + qp.id] = null;
        });
        await database.ref('rooms/' + roomCode).update(updates);
        touchActivity();
        showNotification(promote.map(p => p.name).join(', ') + ' joined from the queue!');
      } finally { queuePromoting = false; }
    }

    // ===== 🚪 AUTO-ABORT AN EMPTY GAME =====
    // If EVERY seated player backed out of the current game ("To Lobby" mid-game),
    // nobody is left to play it — the room goes back to a real lobby state.
    // Without this, the game kept "running" forever with everyone watching from
    // the lobby: rules couldn't be changed and new joiners always landed in the
    // ⏳ queue (state was never 'lobby' any more).
    function maybeAbortEmptyGame() {
      if (!isHost || !currentRoom || !roomCode) return;
      const st = currentRoom.state;
      if (st !== 'playing' && st !== 'finished') return;
      const g = currentRoom.game;
      let gd = null;
      if (g === 'undercover') gd = currentRoom.uc;
      else if (g === 'battle') gd = currentRoom.br;
      else if (g === 'race') gd = currentRoom.rc;
      else if (g === 'blur') gd = currentRoom.bg;
      else if (g === 'hotcold') gd = currentRoom.hc;
      if (!gd || !gd.gameId) return; // 2P Guess Who ends via its own buttons
      const seated = Object.values(currentRoom.players || {}).filter(p => p && p.id);
      if (seated.length === 0) return;
      const everyoneOut = seated.every(p => p.outInGame === gd.gameId);
      if (everyoneOut) {
        abortingEmptyGame = true; // watchdogs pause while the reset lands
        resetRoomToLobbyAfterGame().finally(() => { abortingEmptyGame = false; });
      }
    }
    let abortingEmptyGame = false;

    // Queue members get a plain onDisconnect-remove (they hold no seat, nothing to protect)
    function markQueueDisconnect() {
      const ref = database.ref('rooms/' + roomCode + '/queue/' + playerId);
      ref.onDisconnect().remove();
    }
    function cancelQueueDisconnect() {
      try { database.ref('rooms/' + roomCode + '/queue/' + playerId).onDisconnect().cancel(); } catch (e) {}
    }

    async function toggleReady() {
      if (!currentRoom || !currentRoom.players || !currentRoom.players[playerId]) return;
      const newReady = !currentRoom.players[playerId].ready;
      await database.ref('rooms/' + roomCode + '/players/' + playerId + '/ready').set(newReady);
      touchActivity();
    }

    async function leaveRoom(silent = false) {
      if (!silent) {
      showInteraction('Leave Room?', 'Are you sure you want to leave?', [
        { label: 'Cancel', onclick: () => {}, class: 'secondary' },
        { label: 'Leave', onclick: () => { leaveRoom(true); }, class: 'danger' }
      ]);
      return;
    }
      if (roomRef) {
        cancelDisconnectTracking();
        cancelQueueDisconnect();
        try { await database.ref('rooms/' + roomCode + '/players/' + playerId).remove(); } catch (e) {}
        try { await database.ref('rooms/' + roomCode + '/queue/' + playerId).remove(); } catch (e) {}
        roomRef.off(); roomRef = null;
      }
      roomCode = null; isHost = false; currentRoom = null; imQueued = false;
      showScreen('homepageScreen'); // leaving a room always brings you back home
    }

    // ===== ROOM ACTIVITY TRACKING (auto-close idle rooms) =====
    function touchActivity() {
      if (roomCode) database.ref('rooms/' + roomCode + '/lastActivity').set(Date.now());
    }

    // ===== HOST ADMIN ACTIONS: KICK & TRANSFER HOST =====
    function confirmKickPlayer(pid) {
      if (!isHost || !currentRoom || !currentRoom.players) return;
      const target = currentRoom.players[pid];
      if (!target) return;
      showInteraction('Kick Player?', tPO('kick_q', { n: '<b>' + escapeHtml(String(target.name || 'this player')) + '</b>' }), [
        { label: 'Cancel', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: ic('x') + ' Kick', onclick: async () => { closeInteraction(); await kickPlayer(pid); }, class: 'danger' }
      ]);
    }

    async function kickPlayer(pid) {
      if (!isHost || !currentRoom || !roomCode) return;
      // Flag the kick first so the target gets notified, then remove them from the room
      await database.ref('rooms/' + roomCode + '/kicks/' + pid).set(Date.now());
      await database.ref('rooms/' + roomCode + '/players/' + pid).remove();
      touchActivity();
      showNotification('Player kicked from the room.');
    }

    async function handleKicked() {
      if (beingKicked || !roomCode) return;
      beingKicked = true;
      const code = roomCode;
      showNotification('You have been kicked from the room.', 5000);
      try {
        cancelDisconnectTracking();
        cancelQueueDisconnect();
        await database.ref('rooms/' + code + '/kicks/' + playerId).remove();
        await database.ref('rooms/' + code + '/players/' + playerId).remove();
        await database.ref('rooms/' + code + '/queue/' + playerId).remove();
      } catch (e) {}
      if (kickRef) { kickRef.off(); kickRef = null; }
      if (roomRef) { roomRef.off(); roomRef = null; }
      roomCode = null; currentRoom = null; isHost = false; beingKicked = false;
      closeInteraction();
      showScreen('homepageScreen');
    }

    function confirmTransferHost(pid) {
      if (!isHost || !currentRoom || !currentRoom.players) return;
      const target = currentRoom.players[pid];
      if (!target) return;
      showInteraction('Transfer Host?', tPO('transfer_q', { n: '<b>' + escapeHtml(String(target.name || 'this player')) + '</b>' }), [
        { label: 'Cancel', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: ic('crown') + ' Make Host', onclick: async () => { closeInteraction(); await transferHost(pid); }, class: 'warning' }
      ]);
    }

    async function transferHost(pid) {
      if (!isHost || !currentRoom || !roomCode) return;
      // Atomic update: exactly one host at all times
      const updates = {};
      updates['rooms/' + roomCode + '/players/' + playerId + '/isHost'] = false;
      updates['rooms/' + roomCode + '/players/' + pid + '/isHost'] = true;
      await database.ref().update(updates);
      touchActivity();
      showNotification('Host permissions transferred.');
    }

    async function pushGameChat(input) {
      const message = input.value.trim();
      if (!message) return;
      const myName = (currentRoom && currentRoom.players && currentRoom.players[playerId]) ? currentRoom.players[playerId].name : playerName;
      await database.ref('rooms/' + roomCode + '/gameChat').push({ senderId: playerId, senderName: myName, text: message, timestamp: Date.now() });
      touchActivity();
      input.value = '';
    }
    // Room chat renders into the floating chat window (opened with the 💬 button)
    let chatOverlayOpen = false;
    let chatUnread = 0;
    function displayGameChatMessage(msg) {
      const container = document.getElementById('chatOverlayMessages');
      if (!container) return;
      if (container.children.length === 1 && container.children[0].style.textAlign === 'center') container.innerHTML = '';
      const msgDiv = document.createElement('div');
      const sender = (currentRoom && currentRoom.players) ? currentRoom.players[msg.senderId] : null;
      msgDiv.className = 'chat-message' + (msg.senderId === playerId ? ' own' : '');
      msgDiv.innerHTML = `<div class="sender">${avatarCircle(sender ? sender.avatar : null, 'ava-chat')}${escapeHtml(String(msg.senderName || 'Player'))}</div><div class="text">${escapeHtml(String(msg.text || ''))}</div>`;
      container.appendChild(msgDiv); container.scrollTop = container.scrollHeight;
      // 🔴 unread counter on the 💬 button when the window is closed
      if (msg.senderId !== playerId && !chatOverlayOpen) { chatUnread++; updateChatBadge(); }
    }

    function updateChatBadge() {
      const b = document.getElementById('chatUnreadBadge');
      if (!b) return;
      b.textContent = chatUnread > 0 ? String(chatUnread) : '';
      b.style.display = chatUnread > 0 ? 'flex' : 'none';
    }
    function toggleChatOverlay() {
      chatOverlayOpen = !chatOverlayOpen;
      const ov = document.getElementById('chatOverlay');
      if (ov) ov.classList.toggle('show', chatOverlayOpen);
      if (chatOverlayOpen) {
        chatUnread = 0; updateChatBadge();
        const c = document.getElementById('chatOverlayMessages');
        if (c) c.scrollTop = c.scrollHeight;
        const inp = document.getElementById('chatOverlayInput');
        if (inp) inp.focus();
      }
    }
    function closeChatOverlay() { if (chatOverlayOpen) toggleChatOverlay(); }
    async function sendOverlayChatMessage() {
      const input = document.getElementById('chatOverlayInput');
      if (input) await pushGameChat(input);
    }

    // ============================================================
    // ===== 🌐 PUBLIC ROOM BROWSER (join room screen) ============
    // ============================================================
    function startPublicRoomsWatch() {
      if (publicRoomsRef) return;
      publicRoomsRef = database.ref('rooms').orderByChild('visibility').equalTo('public').limitToLast(40);
      publicRoomsRef.on('value', (snap) => { renderPublicRooms(snap.val() || {}); });
    }
    function stopPublicRoomsWatch() {
      if (publicRoomsRef) { publicRoomsRef.off(); publicRoomsRef = null; }
    }
    function refreshPublicRooms() {
      if (!publicRoomsRef) { startPublicRoomsWatch(); return; }
      publicRoomsRef.once('value').then(snap => { renderPublicRooms(snap.val() || {}); showNotification('Room list refreshed'); });
    }
    function renderPublicRooms(rooms) {
      const list = document.getElementById('publicRoomsList');
      if (!list) return;
      const STATUS = { lobby: 'In the lobby', selection: 'Picking characters', playing: 'Game in progress', finished: 'Game ending' };
      const SRC = { generic: 'Generic pool', favorites: 'AniList favorites', mix: 'Mixed pool' };
      const entries = Object.entries(rooms)
        .filter(([, r]) => r && r.players && Object.keys(r.players).length > 0)
        .map(([code, r]) => {
          const playerCount = Object.keys(r.players).length;
          const maxP = r.maxPlayers || 2;
          const queueCount = Object.keys(r.queue || {}).length;
          return { code, r, playerCount, maxP, queueCount, joinable: (r.state === 'lobby' && playerCount < maxP) };
        })
        .filter(e => e.playerCount < e.maxP || e.queueCount < QUEUE_MAX) // hide rooms with a full queue
        .sort((a, b) => (b.joinable - a.joinable) || ((b.r.lastActivity || 0) - (a.r.lastActivity || 0)));
      if (entries.length === 0) {
        list.innerHTML = '<p class="pub-empty">No public rooms open right now… create one and set it to Public!</p>';
        return;
      }
      list.innerHTML = '';
      entries.forEach(({ code, r, playerCount, maxP, queueCount, joinable }) => {
        const players = Object.values(r.players || {});
        const hostP = players.find(p => p.isHost) || players[0];
        const names = players.slice(0, 4).map(p => (p.name || '?')).join(', ') + (players.length > 4 ? ' +' + (players.length - 4) : '');
        let rules = '';
        if (r.game === 'undercover') rules = 'max ' + maxP + ' · Mr. White ' + ((r.settings && r.settings.mrWhite) ? 'ON' : 'OFF');
        else if (r.game === 'battle') rules = ((r.settings && r.settings.characterCount) || 24) + ' characters · max ' + maxP + ' · ' + SRC[(r.settings && r.settings.source) || 'generic'];
        else if (r.game === 'race') rules = ((r.settings && r.settings.characterCount) || 24) + ' characters · max ' + maxP + ' · ' + SRC[(r.settings && r.settings.source) || 'generic'];
        else rules = ((r.settings && r.settings.characterCount) || 24) + ' characters · ' + SRC[(r.settings && r.settings.source) || 'generic'];
        const card = document.createElement('div');
        card.className = 'public-room-card';
        const btnLabel = joinable ? 'Join' : 'Join queue' + (queueCount ? ' (' + queueCount + ')' : '');
        const btnCls = joinable ? 'success' : 'warning';
        card.innerHTML =
          `<div class="pub-top"><span class="pub-title">${ic(GAME_ICONS[r.game] || 'gamepad')} ${GAME_LABELS[r.game] || 'Game'}</span><span class="pub-status">${STATUS[r.state] || 'In the lobby'}</span></div>
           <div class="pub-players">${ic('crown')} <b>${escapeHtml(String((hostP && hostP.name) || '?'))}</b> · ${ic('users')} <b>${playerCount}/${maxP}</b>${queueCount ? ' · queue ' + queueCount + ' waiting' : ''}</div>
           <div class="pub-players pub-names">${escapeHtml(names)}</div>
           <div class="pub-rules">${rules} · Code <b>${code}</b></div>
           <button class="${btnCls} pub-join">${btnLabel}</button>`;
        card.querySelector('.pub-join').addEventListener('click', () => joinRoomByCode(code));
        list.appendChild(card);
      });
    }

    // ============================================================
    // ===== 🎭👥 MULTIPLAYER GUESS WHO — BATTLE ROYALE & RACE ====
    // ============================================================
    // Shared board pool: rooms/{code}/characters (same as 2P). Secrets live
    // in br.secrets / rc.targetPid+rc.secretId. ❌ marks are LOCAL notes only
    // (brMarks per opponent color / rcMarks for race) — like myEliminated.
    const BR_COLORS = ['#ff5252', '#40c4ff', '#69f0ae', '#ffd740', '#e040fb', '#ff9e40', '#18ffff', '#ff6e9f'];
    // 👥 In-game participants: seated players who did NOT back out of THIS game
    // (a player who pressed "To Lobby" mid-game spectates from the lobby —
    // the game skips them in rotations and doesn't wait for their answers).
    const brGamePids = (room) => { const r = room || currentRoom; const br = (r && r.br) || {}; return (br.order || []).filter(pid => (r.players || {})[pid] && ((r.players[pid] || {}).outInGame || null) !== br.gameId); };
    const rcHuntersInGame = (room) => { const r = room || currentRoom; const rc = (r && r.rc) || {}; return (rc.hunters || []).filter(pid => (r.players || {})[pid] && ((r.players[pid] || {}).outInGame || null) !== rc.gameId); };
    function brOpponents() {
      return brGamePids().filter(pid => pid !== playerId);
    }
    function brColorOf(pid) {
      const order = ((currentRoom && currentRoom.br && currentRoom.br.order) || []);
      const idx = order.indexOf(pid);
      return BR_COLORS[(idx >= 0 ? idx : 0) % BR_COLORS.length];
    }
    const rcHunters = (room) => { const r = room || currentRoom; return ((r && r.rc && r.rc.hunters) || []).filter(pid => (r.players || {})[pid]); };
    // ❤️ race: hunter with lives left (0 = out, skipped in the rotation)
    const rcLivesOf = (room, pid) => { const r = room || currentRoom; const v = ((r.rc || {}).livesLeft || {})[pid]; return (v == null) ? (((r.settings || {}).raceLives) || RACE_DEFAULT_LIVES) : v; };
    const rcQuestionsOf = (room, pid) => { const r = room || currentRoom; const v = ((r.rc || {}).questionsLeft || {})[pid]; return (v == null) ? (((r.settings || {}).raceQuestions) || RACE_DEFAULT_QUESTIONS) : v; };
    // Active hunters = in the game (not spectating) AND ❤️ lives left
    const rcActiveHunters = (room) => rcHuntersInGame(room).filter(pid => rcLivesOf(room, pid) > 0);
    const rcColorOf = (pid) => { const h = (currentRoom && currentRoom.rc && currentRoom.rc.hunters) || []; const idx = h.indexOf(pid); return BR_COLORS[(idx >= 0 ? idx : 0) % BR_COLORS.length]; };

    // 📜 Append-only game history. Each entry gets its own Firebase push key,
    // so simultaneous writes from different players can NEVER overwrite the
    // history (the old whole-array rewrite used to clobber entries — that's
    // why the battle history looked broken).
    function gameLogPushKey(base) { return database.ref('rooms/' + roomCode + '/' + base + '/log').push().key; }
    function gameLogList(gameData) {
      const raw = (gameData && gameData.log) || {};
      const arr = Array.isArray(raw) ? raw.slice() : Object.values(raw); // arrays = old rooms, push-objects = new
      return arr.filter(e => e && e.txt);
    }

    // ---------- DEAL ----------
    async function multiDeal(game) {
      if (!isHost || !currentRoom) return;
      if (game === 'blur') { await blurDeal(); return; }
      if (game === 'race') {
        const pids = Object.keys(currentRoom.players || {});
        const targetPid = pids[Math.floor(Math.random() * pids.length)];
        const hunters = shuffleArray(pids.filter(p => p !== targetPid));
        // ❤️ lives & ❓ question budget per hunter, from the room settings
        const s = currentRoom.settings || {};
        const livesLeft = {}, questionsLeft = {};
        hunters.forEach(h => { livesLeft[h] = s.raceLives || RACE_DEFAULT_LIVES; questionsLeft[h] = s.raceQuestions || RACE_DEFAULT_QUESTIONS; });
        await generateCharacterPool({ restarts: null, rc: { gameId: Date.now(), targetPid, hunters, livesLeft, questionsLeft, turnIdx: 0, secretId: null, question: null, answer: null, guess: null, phase: 'selection' } });
      } else {
        await generateCharacterPool({ restarts: null, br: { gameId: Date.now(), order: [], turnIdx: 0, secrets: {}, points: {}, found: {}, question: null, answers: {}, guess: null, phase: 'selection' } });
      }
    }

    // ---------- SELECTION (shared screen, driven from the main listener) ----------
    function showMultiSelection() {
      if (!currentRoom || !currentRoom.characters) return;
      characters = currentRoom.characters; selectedCharacter = null;
      showScreen('selectionScreen');
      renderCharacterGrid();
      const isRace = currentRoom.game === 'race';
      const targetPid = isRace ? ((currentRoom.rc || {}).targetPid || null) : null;
      const iPick = !isRace || targetPid === playerId;
      const tName = targetPid && currentRoom.players[targetPid] ? currentRoom.players[targetPid].name : '';
      document.querySelector('.selection-header h2').textContent = isRace
        ? (iPick ? 'You are the TARGET — pick the mystery character!' : 'Waiting for the TARGET…')
        : 'Choose Your Secret Character';
      document.querySelector('.selection-header p').textContent = isRace
        ? (iPick ? 'The other players will hunt it — pick well!' : tName + ' is secretly picking the mystery character')
        : 'Everyone picks one — you\'ll all try to guess each other\'s!';
      document.getElementById('confirmSelectionBtn').disabled = true;
      document.getElementById('confirmSelectionBtn').style.display = iPick ? 'inline-block' : 'none';
      document.querySelector('.selection-controls').style.display = iPick ? 'flex' : 'none';
      if (!iPick) document.getElementById('selectionStatus').textContent = tName + ' is picking… the game starts as soon as the choice is made.';
      else if (isRace) document.getElementById('selectionStatus').textContent = 'Pick a character for the others to find';
      else multiSelectionStatusText();
      multiSelectionTick();
    }
    function multiSelectionStatusText() {
      const sels = (currentRoom && currentRoom.selections) || {};
      const seated = Object.keys((currentRoom && currentRoom.players) || {});
      const need = currentRoom.game === 'race' ? [((currentRoom.rc || {}).targetPid || '')] : seated;
      const done = need.filter(pid => sels[pid]).length;
      const el = document.getElementById('selectionStatus');
      if (!el) return;
      if (currentRoom.game === 'race') { /* target-only flow: status set in showMultiSelection */ }
      else if (done >= need.length) el.textContent = 'Everyone picked — dealing!';
      else el.textContent = done + '/' + need.length + ' players picked…' + (sels[playerId] ? ' (you picked ✓)' : '');
    }
    // Called on every snapshot while state === 'selection' (main listener)
    function multiSelectionTick() {
      if (!currentRoom || currentRoom.state !== 'selection') return;
      multiSelectionStatusText();
      const sels = currentRoom.selections || {};
      const seated = Object.keys(currentRoom.players || {});
      // Too few players mid-selection → host cancels back to the lobby
      if (isHost && seated.length < 3) {
        database.ref('rooms/' + roomCode).update({ state: 'lobby', characters: null, selections: null, br: null, rc: null, bg: null, uc: null });
        return;
      }
      if (currentRoom.game === 'battle') {
        const allPicked = seated.every(pid => sels[pid]);
        if (isHost && allPicked) {
          const order = shuffleArray(seated);
          const points = {}; order.forEach(pid => { points[pid] = 0; });
          database.ref('rooms/' + roomCode).update({
            state: 'playing', selections: null,
            'br/secrets': sels, 'br/order': order, 'br/points': points, 'br/phase': 'ask', 'br/turnIdx': 0
          });
        }
      } else { // race
        const rc = currentRoom.rc || {};
        if (isHost && rc.targetPid && sels[rc.targetPid]) {
          database.ref('rooms/' + roomCode).update({
            state: 'playing', selections: null,
            'rc/secretId': sels[rc.targetPid], 'rc/phase': 'ask', 'rc/turnIdx': 0
          });
        }
      }
    }
    function selectTabNoop() {}

    // ---------- TURN HELPERS (battle & race) ----------
    const brTurnPid = (room) => { const r = room || currentRoom; const o = brGamePids(r); return o.length ? o[(((r.br || {}).turnIdx) || 0) % o.length] : null; };
    // Race turns rotate through hunters who still have ❤️ lives (0 lives = out)
    const rcTurnPid = (room) => { const r = room || currentRoom; const h = rcActiveHunters(r); return h.length ? h[(((r.rc || {}).turnIdx) || 0) % h.length] : null; };
    function battleAsk() {
      const inp = document.getElementById('brQuestionInput'); if (!inp) return;
      const text = inp.value.trim(); if (!text) return;
      if (brTurnPid() !== playerId) { showNotification("It's not your turn to ask!"); return; }
      const upd = { question: { by: playerId, text: text.slice(0, 200) }, answers: {}, phase: 'answers' };
      upd['log/' + gameLogPushKey('br')] = { k: 'q', txt: playerName + ': "' + text.slice(0, 200) + '"' };
      database.ref('rooms/' + roomCode + '/br').update(upd);
      inp.value = ''; touchActivity();
    }
    function battleAnswer(v) {
      const br = (currentRoom && currentRoom.br) || {};
      if (!br.question || br.question.by === playerId) return;
      database.ref('rooms/' + roomCode + '/br/answers/' + playerId).set(v); touchActivity();
    }
    function battleNextTurn() {
      const br = (currentRoom && currentRoom.br) || {};
      if (br.phase !== 'answers') return;
      const o = (br.order || []).filter(pid => (currentRoom.players || {})[pid]);
      if (!o.length) return;
      const upd = { question: null, answers: {}, phase: 'ask', turnIdx: ((br.turnIdx || 0) + 1) % o.length };
      // 📜 keep the answers in the history before wiping them
      if (br.question) {
        const players = currentRoom.players || {};
        const answers = br.answers || {};
        const summary = o.filter(pid => pid !== br.question.by)
          .map(pid => ((players[pid] || {}).name || '?') + ' ' + (answers[pid] === 'YES' ? 'YES' : answers[pid] === 'NO' ? 'NO' : '…'))
          .join(' · ');
        upd['log/' + gameLogPushKey('br')] = { k: 'ans', txt: '"' + br.question.text + '" → ' + summary };
      }
      database.ref('rooms/' + roomCode + '/br').update(upd);
      touchActivity();
    }
    function battleAllAnswersIn() {
      const br = (currentRoom && currentRoom.br) || {};
      if (!br.question) return false;
      const need = brGamePids().filter(pid => pid !== br.question.by && !(currentRoom.players[pid] || {}).dcAt);
      return need.every(pid => (br.answers || {})[pid]);
    }
    // HOST watchdog: advance on a vanished asker/answers, resolve guesses, end checks
    function battleWatchdog() {
      const br = (currentRoom && currentRoom.br) || {};
      if (br.phase === 'over' || brWatchBusy || abortingEmptyGame) return;
      const players = currentRoom.players || {};
      const alive = pid => players[pid] && !players[pid].dcAt && (players[pid].outInGame || null) !== br.gameId;
      // Game is pointless with under 2 people still playing → end it
      // (0 players = everyone backed out: the auto-abort handles the lobby reset)
      const parts = brGamePids().filter(pid => alive(pid));
      if (parts.length === 0) return;
      if (parts.length < 2) {
        database.ref('rooms/' + roomCode).update({ 'br/phase': 'over', state: 'finished' });
        return;
      }
      // A guess is pending → resolve it
      if (br.guess) {
        const gs = br.guess;
        brWatchBusy = true;
        try {
          const correct = gs.charId === (br.secrets || {})[gs.target];
          const unfoundAlive = brGamePids().filter(pid => alive(pid) && !(br.found || {})[pid] && pid !== gs.target).length;
          const pts = correct ? (unfoundAlive + 1) * 100 : 0;
          const name = (players[gs.by] || {}).name || '?';
          const tName = (players[gs.target] || {}).name || '?';
          const charName = ((currentRoom.characters || []).find(c => c.id === gs.charId) || {}).name || '?';
          const upd = { 'br/guess': null, 'br/phase': 'ask', 'br/question': null, 'br/answers': {} };
          upd['br/log/' + gameLogPushKey('br')] = correct
            ? { k: 'find', txt: tPO('found_secret', { a: name, n: tName }) + ' ' + charName + '! (+' + pts + ' pts)' }
            : { k: 'miss', txt: name + ' wrongly guessed ' + charName + ' for ' + tName + '…' };
          const o = brGamePids();
          upd['br/turnIdx'] = ((br.turnIdx || 0) + 1) % Math.max(o.length, 1);
          if (correct) {
            upd['br/found/' + gs.target] = { by: gs.by, pts };
            upd['br/points/' + gs.by] = ((br.points || {})[gs.by] || 0) + pts;
            // End? Only 0 or 1 unfound secret left among players still in the game
            const stillUnfound = o.filter(pid => alive(pid) && pid !== gs.target && !(br.found || {})[pid]);
            if (stillUnfound.length <= 1) { upd['br/phase'] = 'over'; upd.state = 'finished'; }
          }
          database.ref('rooms/' + roomCode).update(upd);
        } finally { brWatchBusy = false; }
        return;
      }
      // Current asker vanished → skip their turn (works in both phases)
      const turnPid = brTurnPid();
      if (turnPid && !alive(turnPid) && seatsConnectedCount() >= 2) {
        const o = brGamePids();
        database.ref('rooms/' + roomCode + '/br').update({ question: null, answers: {}, phase: 'ask', turnIdx: ((br.turnIdx || 0) + 1) % Math.max(o.length, 1) });
      }
    }
    function seatsConnectedCount() { return Object.keys((currentRoom && currentRoom.players) || {}).filter(pid => !(currentRoom.players[pid] || {}).dcAt).length; }

    // 🎨 Every opponent has their OWN board — switch with the color chips.
    // The board I'm viewing is the "active board"; if its owner leaves or a
    // new deal starts, fall back to the first opponent.
    function brEnsureActiveBoard() {
      const opps = brOpponents();
      if (!brActiveBoard || opps.indexOf(brActiveBoard) === -1) brActiveBoard = opps[0] || null;
      return brActiveBoard;
    }

    // Guessing happens ON someone's board: in 🎯 mode, clicking a card =
    // "THIS card is the active board owner's secret".
    async function battleGuess(charId) {
      const br = (currentRoom && currentRoom.br) || {};
      const players = currentRoom.players || {};
      const target = brEnsureActiveBoard();
      if (!target || !players[target]) { showNotification('No opponent board to guess on!'); return; }
      if ((br.found || {})[target]) { showNotification(tPO('secret_already', { n: (players[target].name || '?') })); return; }
      const charName = ((currentRoom.characters || []).find(c => c.id === charId) || {}).name || '?';
      const nameOf = escapeHtml(String(players[target].name || '?'));
      showInteraction(ic('target') + ' Make a guess?', tPO('think_secret', { n: '<b>' + nameOf + '</b>', c: '<b>' + escapeHtml(charName) + '</b>' }) + '<br><small>This uses your turn — right or wrong.</small>', [
        { label: 'Cancel', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: ic('target') + ' Guess!', onclick: async () => {
          closeInteraction();
          brGuessMode = false;
          await database.ref('rooms/' + roomCode + '/br/guess').set({ by: playerId, target: target, charId: charId });
          touchActivity();
        }, class: 'warning' }
      ]);
    }
    function battleToggleGuess() {
      const br = (currentRoom && currentRoom.br) || {};
      if (br.phase === 'over') return;
      if (brTurnPid() !== playerId) { showNotification("You can guess on your turn only!"); return; }
      if (brGuessMode) { brGuessMode = false; }
      else {
        const target = brEnsureActiveBoard();
        if (!target) { showNotification('No opponent to guess!'); return; }
        if ((br.found || {})[target]) { showNotification('That secret is already found — switch to another board!'); return; }
        brGuessMode = true;
        showNotification(tPO('guess_mode', { n: ((currentRoom.players[target] || {}).name || '?') }));
      }
      renderBattleBoard();
    }
    function battleClearMarks() {
      // Clears only the board you're viewing — each board keeps its own ❌
      const pid = brEnsureActiveBoard();
      if (pid && brMarks[pid]) { brMarks[pid] = {}; showNotification('Eliminated cards restored!'); }
      renderBattleBoard();
    }
    function brToggleMark(charId) {
      const pid = brEnsureActiveBoard();
      if (!pid) { showNotification('No opponent board selected!'); return; }
      if (!brMarks[pid]) brMarks[pid] = {};
      if (brMarks[pid][charId]) delete brMarks[pid][charId]; else brMarks[pid][charId] = true;
      renderBattleBoard();
    }

    // ---------- BATTLE ROYALE RENDER ----------
    function updateBattle() {
      const br = currentRoom.br || {};
      const players = currentRoom.players || {};
      const turnPid = brTurnPid();
      const turnName = (players[turnPid] || {}).name || '—';
      const phaseNames = { ask: 'Question time', answers: 'Answering…', over: 'Game over' };
      const phaseIcons = { ask: 'chat', answers: 'hand', over: 'flag' };
      document.getElementById('brTurnBadge').innerHTML = br.phase === 'over' ? ic('flag') + ' Finished' : (ic('mic') + ' Turn: ' + escapeHtml(String(turnName)) + (turnPid === playerId ? ' (You)' : ''));
      document.getElementById('brPhaseBadge').innerHTML = phaseNames[br.phase] ? ic(phaseIcons[br.phase]) + ' ' + phaseNames[br.phase] : '';
      // New deal? Local notes (❌ marks per board + active board) start fresh
      if (br.gameId && br.gameId !== lastBrGameId) { lastBrGameId = br.gameId; brMarks = {}; brGuessMode = false; brActiveBoard = null; }
      // 🎨 Opponent color chips = BOARD SWITCHERS — one glowing board per player
      const opps = brOpponents();
      brEnsureActiveBoard();
      const chips = document.getElementById('brChips');
      chips.innerHTML = '';
      opps.forEach(pid => {
        const p = players[pid];
        const col = brColorOf(pid);
        const chip = document.createElement('button');
        chip.className = 'br-chip' + (brActiveBoard === pid ? ' sel' : '');
        chip.style.setProperty('--c', col);
        chip.title = tPO('switch_board', { n: ((p && p.name) || '?') });
        chip.innerHTML = `${avatarCircle(p.avatar, 'ava-chat')}<span class="chip-name">${escapeHtml(String(p.name || '?'))}</span><span class="chip-pts">${(br.points || {})[pid] || 0} pts</span>${(br.found || {})[pid] ? '<span class="chip-state">' + ic('search') + ' found</span>' : ''}${(p.dcAt ? '<span class="chip-state">away</span>' : '')}${turnPid === pid && br.phase !== 'over' ? '<span class="chip-state">' + ic('mic') + '</span>' : ''}`;
        chip.addEventListener('click', () => { brActiveBoard = pid; updateBattle(); });
        chips.appendChild(chip);
      });
      // My secret + my points
      const myChar = (currentRoom.characters || []).find(c => c.id === (br.secrets || {})[playerId]);
      const iAmFound = !!(br.found || {})[playerId];
      document.getElementById('brMySecretImg').src = myChar ? myChar.image : '';
      document.getElementById('brMySecretName').textContent = (myChar ? myChar.name : '—') + (iAmFound ? ' · FOUND!' : '');
      document.getElementById('brMyPoints').textContent = ((br.points || {})[playerId] || 0) + ' pts';
      renderBattleBoard(); renderBattleQA(); renderBattleLog();
      if (br.phase === 'over') renderMultiEnd('battle'); else document.getElementById('multiEndScreen').classList.remove('show');
    }
    function renderBattleBoard() {
      const board = document.getElementById('brBoard'); if (!board || !currentRoom) return;
      const br = currentRoom.br || {};
      const players = currentRoom.players || {};
      // 🎨 The whole board wears the ACTIVE PLAYER's color (border + glow), so
      // you can never mix up whose tracking notes you're editing.
      const active = brEnsureActiveBoard();
      const col = active ? brColorOf(active) : '#2a2a4a';
      board.className = 'board br-fenced' + (brGuessMode ? ' guessing' : '');
      board.style.setProperty('--boardc', col);
      board.innerHTML = '';
      const title = document.getElementById('brBoardTitle');
      if (title) title.innerHTML = active
        ? ic('palette') + ' ' + tPO('pos_board', { n: '<span style="color:' + col + '">' + escapeHtml(String((players[active] || {}).name || '?')) + '</span>' }) + (brGuessMode ? ' — ' + ic('target') + ' click their secret!' : ' — ' + ic('x') + ' tap cards to eliminate')
        : 'All Characters';
      const foundSet = {}; // charIds that are someone's revealed secret
      const secrets = br.secrets || {};
      Object.keys(br.found || {}).forEach(pid => { if (secrets[pid] != null) foundSet[secrets[pid]] = pid; });
      (currentRoom.characters || []).forEach(char => {
        const card = document.createElement('div'); card.className = 'card';
        if (foundSet[char.id] != null) { card.classList.add('br-found'); card.style.setProperty('--c', brColorOf(foundSet[char.id])); }
        // ❌ marked cards are COMPLETELY ELIMINATED — same greyed-dark look
        // with a big ✕ as in the 1v1 Guess Who. Tap the card again to undo.
        // Only the active board's eliminations are shown (one board = one color).
        if (active && brMarks[active] && brMarks[active][char.id]) card.classList.add('eliminated');
        const img = document.createElement('img'); img.className = 'card-img'; img.src = char.image || ''; img.alt = char.name || ''; card.appendChild(img);
        const info = document.createElement('div'); info.className = 'card-info';
        info.innerHTML = `<div class="card-name">${char.name || 'Unknown'}</div>`;
        card.appendChild(info);
        card.addEventListener('click', () => {
          if (brGuessMode) battleGuess(char.id);
          else brToggleMark(char.id);
        });
        board.appendChild(card);
      });
    }
    function renderBattleQA() {
      const area = document.getElementById('brQuestionArea'); if (!area || !currentRoom) return;
      const br = currentRoom.br || {};
      const players = currentRoom.players || {};
      if (br.phase === 'over') { area.innerHTML = '<div class="question-display"><div class="text">Game over — check the results!</div></div>'; return; }
      const turnPid = brTurnPid();
      const turnName = (players[turnPid] || {}).name || '?';
      if (!br.question) {
        area.innerHTML = turnPid === playerId
          ? `<div class="question-form"><input type="text" id="brQuestionInput" placeholder="Ask a yes/no question to EVERYONE…" maxlength="200"><button class="success" onclick="battleAsk()">Ask</button></div><div class="uc-hint-line">…or use the Guess button below the board to find a secret.</div>`
          : `<div class="question-display"><div class="label">Waiting…</div><div class="text"><b>${escapeHtml(turnName)}</b> is thinking of a question…</div></div>`;
        const inp = document.getElementById('brQuestionInput');
        if (inp) inp.addEventListener('keypress', (e) => { if (e.key === 'Enter') battleAsk(); });
        return;
      }
      const q = br.question;
      const answers = br.answers || {};
      const myAnswer = answers[playerId];
      const answerers = brGamePids().filter(pid => pid !== q.by);
      const answerChips = answerers.map(pid => {
        const a = answers[pid];
        return `<span class="qa-ans" style="--c:${brColorOf(pid)}">${avatarCircle(players[pid].avatar, 'ava-chat')}${escapeHtml(String(players[pid].name || '?'))} ${a ? (a === 'YES' ? ic('check') : ic('x')) : '…'}</span>`;
      }).join('');
      const allIn = battleAllAnswersIn();
      let bottom = '';
      if (q.by === playerId) {
        bottom = allIn ? `<button class="success full" onclick="battleNextTurn()">Next turn</button>` : `<div class="uc-hint-line">Waiting for everyone's answers…</div>`;
      } else if (!myAnswer) {
        bottom = `<div class="answer-buttons"><button class="success" onclick="battleAnswer('YES')">${ic('check')} YES</button><button class="danger" onclick="battleAnswer('NO')">${ic('x')} NO</button></div>`;
      } else {
        bottom = `<div class="uc-hint-line">You answered <b>${myAnswer}</b> — ${allIn ? 'everyone is in!' : 'waiting for the others…'} (you can guess on your turn)</div>`;
      }
      area.innerHTML = `<div class="question-display"><div class="label">${q.by === playerId ? 'Your question' : escapeHtml((players[q.by] || {}).name || '?') + ' asks EVERYONE'}</div><div class="text">${escapeHtml(String(q.text || ''))}</div><div class="qa-answers">${answerChips}</div>${bottom}</div>`;
    }
    function renderBattleLog() {
      const logEl = document.getElementById('brLog'); if (!logEl || !currentRoom) return;
      const log = gameLogList(currentRoom.br);
      if (log.length === 0) { logEl.innerHTML = '<p style="text-align:center;color:var(--muted);">Nothing yet</p>'; return; }
      logEl.innerHTML = '';
      log.slice(-60).reverse().forEach(e => {
        const d = document.createElement('div');
        d.className = 'br-log-' + (e.k === 'find' ? 'find' : e.k === 'miss' ? 'miss' : e.k === 'q' ? 'q' : 'info');
        d.textContent = e.txt;
        logEl.appendChild(d);
      });
    }

    // ---------- RACE ----------
    function raceAsk() {
      const inp = document.getElementById('rcQuestionInput'); if (!inp) return;
      const text = inp.value.trim(); if (!text) return;
      if (rcTurnPid() !== playerId) { showNotification("It's not your turn to ask!"); return; }
      const left = rcQuestionsOf(currentRoom, playerId);
      if (left <= 0) { showNotification('You have used all your questions — you can only guess or pass!'); return; }
      const upd = { question: { by: playerId, text: text.slice(0, 200) }, answer: null, phase: 'answers' };
      upd['questionsLeft/' + playerId] = left - 1;
      upd['log/' + gameLogPushKey('rc')] = { k: 'q', txt: playerName + ': "' + text.slice(0, 200) + '" (' + (left - 1) + ' questions left)' };
      database.ref('rooms/' + roomCode + '/rc').update(upd);
      inp.value = ''; touchActivity();
    }
    function raceAnswer(v) {
      const rc = (currentRoom && currentRoom.rc) || {};
      if (rc.targetPid !== playerId) return;
      database.ref('rooms/' + roomCode + '/rc/answer').set(v); touchActivity();
    }
    function raceNextTurn() {
      const rc = (currentRoom && currentRoom.rc) || {};
      if (rc.phase !== 'answers' || !rc.answer) return;
      const h = rcActiveHunters();
      if (!h.length) return;
      const upd = { question: null, answer: null, phase: 'ask', turnIdx: ((rc.turnIdx || 0) + 1) % h.length };
      // 📜 keep the question + answer in the history before wiping them
      if (rc.question) upd['log/' + gameLogPushKey('rc')] = { k: 'ans', txt: 'Target answered ' + (rc.answer === 'YES' ? 'YES' : 'NO') + ' to "' + rc.question.text + '"' };
      database.ref('rooms/' + roomCode + '/rc').update(upd);
      touchActivity();
    }
    // A hunter with no questions left may simply pass their turn
    function racePassTurn() {
      const rc = (currentRoom && currentRoom.rc) || {};
      if (rc.phase !== 'ask' || rc.question) return;
      if (rcTurnPid() !== playerId) return;
      if (rcQuestionsOf(currentRoom, playerId) > 0) return; // can still ask — no passing
      const h = rcActiveHunters();
      if (!h.length) return;
      const upd = { phase: 'ask', turnIdx: ((rc.turnIdx || 0) + 1) % h.length };
      upd['log/' + gameLogPushKey('rc')] = { k: 'info', txt: playerName + ' passed (out of questions)' };
      database.ref('rooms/' + roomCode + '/rc').update(upd);
      touchActivity();
    }
    function raceWatchdog() {
      const rc = (currentRoom && currentRoom.rc) || {};
      if (rc.phase === 'over' || rcWatchBusy || abortingEmptyGame) return;
      const players = currentRoom.players || {};
      const alive = pid => players[pid] && !players[pid].dcAt;
      // Target gone (left the room OR backed out to the lobby) → game over
      if (!players[rc.targetPid] || (players[rc.targetPid].outInGame || null) === rc.gameId) {
        database.ref('rooms/' + roomCode).update({ 'rc/phase': 'over', 'rc/winner': null, 'rc/endReason': 'target-left', state: 'finished' });
        return;
      }
      // No hunters left → over
      if (rcHunters().length === 0) {
        database.ref('rooms/' + roomCode).update({ 'rc/phase': 'over', 'rc/winner': null, 'rc/endReason': 'hunters-left', state: 'finished' });
        return;
      }
      // 💀 ALL hunters out of lives → the TARGET wins!
      if (rcActiveHunters().length === 0) {
        const upd = { 'rc/phase': 'over', 'rc/winner': rc.targetPid, 'rc/endReason': 'hunters-out', state: 'finished' };
        upd['rc/log/' + gameLogPushKey('rc')] = { k: 'info', txt: 'All hunters are out of lives — the TARGET wins!' };
        database.ref('rooms/' + roomCode).update(upd);
        return;
      }
      // Pending hunter guess → resolve. 🆓 Guesses are FREE now: they live
      // OUTSIDE the question flow — a wrong guess only costs a ❤️, it never
      // eats the turn, wipes the current question or skips anyone.
      if (rc.guess) {
        rcWatchBusy = true;
        try {
          const correct = rc.guess.charId === rc.secretId;
          const name = (players[rc.guess.by] || {}).name || '?';
          const charName = ((currentRoom.characters || []).find(c => c.id === rc.guess.charId) || {}).name || '?';
          const upd = { 'rc/guess': null };
          if (correct) {
            upd['rc/phase'] = 'over'; upd['rc/winner'] = rc.guess.by; upd.state = 'finished';
            upd['rc/log/' + gameLogPushKey('rc')] = { k: 'find', txt: name + ' FOUND the mystery character: ' + charName + '!' };
          } else {
            const left = Math.max(0, rcLivesOf(currentRoom, rc.guess.by) - 1);
            upd['rc/livesLeft/' + rc.guess.by] = left;
            upd['rc/log/' + gameLogPushKey('rc')] = left > 0
              ? { k: 'miss', txt: name + ' tried ' + charName + ' — wrong! ' + left + ' lives left' }
              : { k: 'miss', txt: name + ' tried ' + charName + ' — wrong… and is OUT of lives!' };
          }
          database.ref('rooms/' + roomCode).update(upd);
        } finally { rcWatchBusy = false; }
        return;
      }
      const turnPid = rcTurnPid();
      if (turnPid && !alive(turnPid)) {
        const h = rcActiveHunters();
        database.ref('rooms/' + roomCode + '/rc').update({ question: null, answer: null, phase: 'ask', turnIdx: ((rc.turnIdx || 0) + 1) % Math.max(h.length, 1) });
      }
    }
    async function raceGuess(charId) {
      const rc = (currentRoom && currentRoom.rc) || {};
      if (rc.phase === 'over') return;
      if (rc.targetPid === playerId || !rcHuntersInGame().includes(playerId)) return;
      if (rcLivesOf(currentRoom, playerId) <= 0) { showNotification('You have no lives left!'); return; }
      const charName = ((currentRoom.characters || []).find(c => c.id === charId) || {}).name || '?';
      const livesTxt = tPO('lives_left', { x: '<b>' + rcLivesOf(currentRoom, playerId) + '</b>' });
      showInteraction(ic('target') + ' Make a guess?', tPO('guess_q', { n: '<b>' + escapeHtml(charName) + '</b>' }) + '<br><small>Free guess — allowed at ANY moment, even off-turn.<br>' + livesTxt + '</small>', [
        { label: 'Cancel', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: ic('target') + ' Guess!', onclick: async () => {
          closeInteraction();
          // ⚡ First-come-first-served: the transaction ONLY lands the guess if the
          // slot is empty — with free guessing, two hunters can click at the same
          // time and nobody's guess may be overwritten (or skipped from the log).
          try {
            const res = await database.ref('rooms/' + roomCode + '/rc/guess').transaction(cur => (cur == null ? { by: playerId, charId: charId } : undefined));
            if (res && res.committed) {
              rcGuessMode = false; renderRaceBoard(); touchActivity();
            } else {
              showNotification('Someone else\'s guess is being resolved — try again in a second!');
            }
          } catch (e) {
            // Older builds / no-transaction fallback: simple set still beats nothing
            await database.ref('rooms/' + roomCode + '/rc/guess').set({ by: playerId, charId: charId });
            rcGuessMode = false; renderRaceBoard(); touchActivity();
          }
        }, class: 'warning' }
      ]);
    }
    function raceToggleGuess() {
      const rc = (currentRoom && currentRoom.rc) || {};
      if (rc.phase === 'over') return;
      if (rc.targetPid === playerId) { showNotification('You are the TARGET — the hunters do the guessing!'); return; }
      if (!rcHuntersInGame().includes(playerId)) { showNotification('You are not in this hunt — sit back and watch!'); return; }
      if (rcLivesOf(currentRoom, playerId) <= 0) { showNotification('You are out of lives — watch the others hunt!'); return; }
      // 🆓 Guesses are FREE — anyone can shoot at any moment, even off-turn.
      // Questions stay turn-by-turn; only a WRONG guess costs 1 ❤️.
      rcGuessMode = !rcGuessMode;
      if (rcGuessMode) showNotification('Guess mode: click the card you think is the mystery character! (any time — wrong = -1 life)');
      renderRaceBoard();
    }
    function raceClearMarks() { rcMarks = {}; showNotification('Eliminated cards restored!'); renderRaceBoard(); }
    function updateRace() {
      const rc = currentRoom.rc || {};
      const players = currentRoom.players || {};
      const isTarget = rc.targetPid === playerId;
      const targetName = (players[rc.targetPid] || {}).name || '?';
      // New deal? Local notes (❌ marks) start fresh
      if (rc.gameId && rc.gameId !== lastRcGameId) { lastRcGameId = rc.gameId; rcMarks = {}; rcGuessMode = false; }
      const turnPid = rcTurnPid();
      const turnName = (players[turnPid] || {}).name || '—';
      document.getElementById('rcTurnBadge').innerHTML = rc.phase === 'over' ? ic('flag') + ' Finished' : (ic('mic') + ' Turn: ' + escapeHtml(String(turnName)) + (turnPid === playerId ? ' (You)' : ''));
      document.getElementById('rcPhaseBadge').innerHTML = rc.phase === 'over' ? ic('flag') + ' Game over' : (rc.question ? ic('hand') + ' Target answering…' : ic('chat') + ' Question time');
      // Banner: target sees their own secret; hunters see the mystery card
      const banner = document.getElementById('rcBanner');
      if (isTarget) {
        const myChar = (currentRoom.characters || []).find(c => c.id === rc.secretId);
        banner.classList.remove('br-hide');
        banner.onclick = () => banner.classList.toggle('br-hide');
        banner.innerHTML = `<img src="${myChar ? myChar.image : ''}" alt=""><div class="br-mysecret-info"><div class="br-mysecret-label">${ic('target')} You are the TARGET — answer questions honestly (tap to hide)</div><div class="br-mysecret-name">${myChar ? myChar.name : '—'}</div></div>`;
      } else {
        banner.onclick = null;
        banner.innerHTML = `<div class="br-mysecret-info"><div class="br-mysecret-label">${ic('bolt')} RACE — mystery character</div><div class="br-mysecret-name">${tPO('hunt_secret', { n: '<b style="color:var(--warning)">' + escapeHtml(targetName) + '</b>' })}</div></div>`;
      }
      renderRaceBoard(); renderRaceQA(); renderRaceLog(); renderRcHuntersBar();
      if (rc.phase === 'over') renderMultiEnd('race'); else document.getElementById('multiEndScreen').classList.remove('show');
    }
    // ❤️❓ Custom bar: every hunter's lives & remaining questions
    function renderRcHuntersBar() {
      const bar = document.getElementById('rcHuntersBar'); if (!bar || !currentRoom) return;
      const rc = currentRoom.rc || {};
      const players = currentRoom.players || {};
      const hunters = rcHunters();
      if (!hunters.length) { bar.innerHTML = ''; return; }
      const turnPid = rcTurnPid();
      bar.innerHTML = '';
      hunters.forEach(pid => {
        const p = players[pid] || {};
        const lives = rcLivesOf(currentRoom, pid);
        const qs = rcQuestionsOf(currentRoom, pid);
        const spectating = (p.outInGame || null) === rc.gameId;
        const maxLives = Math.max(lives, ((currentRoom.settings || {}).raceLives) || RACE_DEFAULT_LIVES);
        const out = lives <= 0 || spectating;
        const chip = document.createElement('div');
        chip.className = 'rc-hunter' + (out ? ' out' : '') + (turnPid === pid && !out && rc.phase !== 'over' ? ' turn' : '');
        chip.style.setProperty('--c', rcColorOf(pid));
        const hearts = ic('heart').repeat(lives) + ic('heart', 'ic-off').repeat(Math.max(0, maxLives - lives));
        const livesTxt = spectating ? '—' : (lives <= 0 ? ic('skull') : hearts);
        chip.innerHTML = `${avatarCircle(p.avatar, 'ava-chat')}<span class="rc-hunter-name">${escapeHtml(String(p.name || '?'))}${pid === playerId ? ' (You)' : ''}</span><span class="rc-hunter-res" title="Lives (wrong guesses allowed)">${livesTxt}</span><span class="rc-hunter-res" title="Questions left">${ic('help')}${qs}</span>${turnPid === pid && !out && rc.phase !== 'over' ? '<span class="rc-hunter-turn">' + ic('mic') + '</span>' : ''}`;
        bar.appendChild(chip);
      });
    }
    function renderRaceBoard() {
      const board = document.getElementById('rcBoard'); if (!board || !currentRoom) return;
      board.className = 'board' + (rcGuessMode ? ' guessing' : '');
      board.innerHTML = '';
      (currentRoom.characters || []).forEach(char => {
        const card = document.createElement('div'); card.className = 'card';
        if (rcMarks[char.id]) card.classList.add('eliminated');
        const img = document.createElement('img'); img.className = 'card-img'; img.src = char.image || ''; img.alt = char.name || ''; card.appendChild(img);
        const info = document.createElement('div'); info.className = 'card-info';
        info.innerHTML = `<div class="card-name">${char.name || 'Unknown'}</div>`;
        card.appendChild(info);
        card.addEventListener('click', () => { rcGuessMode ? raceGuess(char.id) : (rcMarks[char.id] ? delete rcMarks[char.id] : rcMarks[char.id] = true, renderRaceBoard()); });
        board.appendChild(card);
      });
    }
    function renderRaceQA() {
      const area = document.getElementById('rcQuestionArea'); if (!area || !currentRoom) return;
      const rc = currentRoom.rc || {};
      const players = currentRoom.players || {};
      if (rc.phase === 'over') { area.innerHTML = '<div class="question-display"><div class="text">Game over — check the results!</div></div>'; return; }
      const isTarget = rc.targetPid === playerId;
      const targetName = (players[rc.targetPid] || {}).name || '?';
      const turnPid = rcTurnPid();
      const turnName = (players[turnPid] || {}).name || '?';
      if (!rc.question) {
        const myLives = isTarget ? 1 : rcLivesOf(currentRoom, playerId);
        const myQs = isTarget ? 0 : rcQuestionsOf(currentRoom, playerId);
        if (isTarget) area.innerHTML = `<div class="question-display"><div class="text">${ic('target')} ${tPO('wait_question', { n: '<b>' + escapeHtml(turnName) + '</b>' })}</div></div>`;
        else if (myLives <= 0) area.innerHTML = `<div class="question-display"><div class="label">${ic('skull')} Out of lives</div><div class="text">You guessed wrong too many times — watch the others hunt!</div></div>`;
        else if (turnPid === playerId) {
          if (myQs > 0) area.innerHTML = `<div class="question-form"><input type="text" id="rcQuestionInput" placeholder="Ask the target a yes/no question…" maxlength="200"><button class="success" onclick="raceAsk()">Ask</button></div><div class="uc-hint-line">${ic('help')} ${myQs} questions left · ${ic('heart')} ${myLives} lives · guessing is FREE — anytime, even off-turn (wrong = -1 life).</div>`;
          else area.innerHTML = `<div class="question-display"><div class="label">No questions left!</div><div class="text">You can't ask anymore — <b>guess</b> the mystery character… or pass:</div><button class="secondary full" onclick="racePassTurn()" style="margin-top:8px">Pass my turn</button></div>`;
        }
        else area.innerHTML = `<div class="question-display"><div class="label">Waiting…</div><div class="text"><b>${escapeHtml(turnName)}</b> is thinking of a question…</div><div class="uc-hint-line">Free guess at ANY moment — wrong guess = -1 life (${rcLivesOf(currentRoom, playerId)} left)</div></div>`;
        const inp = document.getElementById('rcQuestionInput');
        if (inp) inp.addEventListener('keypress', (e) => { if (e.key === 'Enter') raceAsk(); });
        return;
      }
      const q = rc.question;
      let bottom = '';
      if (!rc.answer) {
        if (isTarget) bottom = `<div class="answer-buttons"><button class="success" onclick="raceAnswer('YES')">${ic('check')} YES</button><button class="danger" onclick="raceAnswer('NO')">${ic('x')} NO</button></div>`;
        else bottom = `<div class="uc-hint-line">${tPO('wait_answer', { n: '<b>' + escapeHtml(targetName) + '</b>' })}</div>`;
      } else {
        bottom = `<div class="uc-hint-line" style="font-size:1rem">Answer: <b>${rc.answer}</b></div>`;
        if (q.by === playerId) bottom += `<button class="success full" onclick="raceNextTurn()" style="margin-top:8px">Next turn</button>`;
      }
      area.innerHTML = `<div class="question-display"><div class="label">${escapeHtml((players[q.by] || {}).name || '?')} asks the target</div><div class="text">${escapeHtml(String(q.text || ''))}</div>${bottom}</div>`;
    }
    function renderRaceLog() {
      const logEl = document.getElementById('rcLog'); if (!logEl || !currentRoom) return;
      const log = gameLogList(currentRoom.rc);
      if (log.length === 0) { logEl.innerHTML = '<p style="text-align:center;color:var(--muted);">Nothing yet</p>'; return; }
      logEl.innerHTML = '';
      log.slice(-60).reverse().forEach(e => {
        const d = document.createElement('div');
        d.className = 'br-log-' + (e.k === 'find' ? 'find' : e.k === 'miss' ? 'miss' : e.k === 'q' ? 'q' : 'info');
        d.textContent = e.txt;
        logEl.appendChild(d);
      });
    }

    // ---------- 🌫️ BLUR GUESS ----------
    // Everyone (even solo) watches the same blurred portrait. It clears over
    // BLUR_STAGES stages, one every BLUR_STAGE_SEC seconds (the HOST drives
    // the clock; everyone else's countdown is display-only).
    const bgParticipants = (room) => { const r = room || currentRoom; const bg = (r && r.bg) || {}; return Object.keys((r && r.players) || {}).filter(pid => (((r.players[pid]) || {}).outInGame || null) !== bg.gameId); };

    // The ⏱ timer for one blur stage, from the room settings (host can tune
    // it mid-game in ⚙️; next stage/*next round* uses the new value).
    function bgStageMs() {
      const v = ((currentRoom && currentRoom.settings) || {}).bgStageSec;
      return Math.min(BLUR_STAGE_SEC_MAX, Math.max(BLUR_STAGE_SEC_MIN, v || BLUR_STAGE_SEC)) * 1000;
    }

    // Blur Guess has NO "character count" board: the candidate list is the
    // FULL source pool — every generic character, or the 500 anime covers in
    // 🎬 covers mode. settings/pool 'watched' narrows BOTH variants to anime
    // the synced accounts have seen (characters: by series, covers: by id).
    function bgCandidateChars() {
      const r = currentRoom || {};
      const s = r.settings || {};
      const bg = r.bg || {};
      const mode = bg.mode || s.bgMode || 'characters';
      if (mode === 'covers') {
        const covers = (typeof ANIME_COVERS !== 'undefined' && Array.isArray(ANIME_COVERS)) ? ANIME_COVERS : [];
        if (s.pool !== 'watched') return covers;
        const wset = roomWatchSet(r);
        return covers.filter(c => c && c.id != null && c.name && wset.ids[c.id]);
      }
      const generic = (typeof GENERIC_CHARACTERS !== 'undefined' && Array.isArray(GENERIC_CHARACTERS)) ? GENERIC_CHARACTERS : [];
      if (s.pool === 'watched') return watchedPoolChars(r);
      const seen = new Set();
      return generic.filter(c => { if (!c || c.id == null || !c.name || seen.has(c.id)) return false; seen.add(c.id); return true; });
    }

    // Compact the rounds entry we store in Firebase: everything the clients
    // need to show & match the answer, already resolved (image + aliases).
    function bgRoundEntry(c) {
      const e = { id: c.id, name: c.name, image: c.image || '' };
      if (c.series) e.series = c.series;
      if (Array.isArray(c.al) && c.al.length) e.al = c.al;
      return e;
    }

    // Deal a Blur Guess game: line up `bgRounds` pictures from the full
    // candidate pool, straight into 'playing' (no pick phase, no board).
    async function blurDeal() {
      const s = currentRoom.settings || {};
      const totalRounds = Math.min(BLUR_ROUNDS_MAX, Math.max(5, s.bgRounds || BLUR_ROUNDS_DEFAULT));
      const mode = s.bgMode === 'covers' ? 'covers' : 'characters';
      const gameId = Date.now();
      // brief "dealing" marker so everyone shows the blur screen right away
      await database.ref('rooms/' + roomCode).update({ restarts: null, 'bg/gameId': gameId, 'bg/phase': 'setup', 'bg/mode': mode });
      const snap = await database.ref('rooms/' + roomCode).once('value');
      const fresh = snap.val() || {};
      const cand = bgCandidateChars();
      const rounds = shuffleArray(cand.slice()).slice(0, Math.min(totalRounds, cand.length)).map(bgRoundEntry);
      if (!rounds.length) {
        await database.ref('rooms/' + roomCode).update({ state: 'lobby', characters: null, selections: null, bg: null });
        showNotification('Not enough pictures for Blur Guess! Check the pool settings — Watched needs synced AniList accounts with watched anime.');
        return;
      }
      const scores = {};
      Object.keys(fresh.players || {}).forEach(p => { scores[p] = 0; });
      const upd = { state: 'playing', characters: null, selections: null, 'bg/gameId': gameId, 'bg/mode': mode, 'bg/phase': 'playing',
        'bg/rounds': rounds, 'bg/roundIdx': 0, 'bg/stage': 1, 'bg/found': null, 'bg/scores': scores,
        'bg/deadline': Date.now() + bgStageMs() };
      upd['bg/log/' + gameLogPushKey('bg')] = { k: 'info', txt: (mode === 'covers' ? 'Guess the anime cover' : 'Guess the character') + ' starts — ' + rounds.length + ' rounds! Earlier guess = more points (5 → 1), the fastest score a speed bonus (+3/+2/+1)!' };
      await database.ref('rooms/' + roomCode).update(upd);
    }

    // Accent/punctuation-proof answer matching. A guess is correct when it
    // equals (after normalizing: lowercase, no accents, no punctuation):
    //   • the FULL main name or any FULL alternative name ("deku", "burdock"),
    //   • OR any single word of 4+ letters inside those names ("midoriya",
    //     "izuku", "goku" via the alias "Goku Son"),
    //   • with CLOSE SPELLINGS accepted for 5+ letter words ("kirua" ≈ "killua").
    function bgNorm(s) {
      return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    // ✍️ EXTRA ALIASES the community data misses — famous translations, French
    // spellings & nicknames. Key = bgNorm() of the character's main name.
    const BG_CHAR_EXTRA = {
      // 🐉 Dragon Ball (AniList spells him "Gokuu Son" / "Son Gohan"…)
      'son goku': ['sangoku'], 'gokuu son': ['sangoku', 'goku', 'son goku'],
      'son gohan': ['sangohan'], 'son goten': ['sangoten'],
      'krillin': ['kuririn', 'kulilin'], 'kuririn': ['krillin'],
      'master roshi': ['kame sennin', 'muten roshi', 'tortue geniale'],
      'frieza': ['freezer', 'freeza'], 'piccolo': ['petit coeur'],
      'mr satan': ['hercule'], 'hercule': ['mr satan'],
      'tien shinhan': ['tenshinhan'], 'majin buu': ['buu'],
      'vegetto': ['vegito'], 'vegito': ['vegetto'], 'beerus': ['bills'],
      'android 18': ['c18', 'c 18'], 'android 17': ['c17', 'c 17'],
      // ⚔️ Hunter × Hunter
      'killua zoldyck': ['kirua', 'killua zaoldyeck', 'kirua zoldik'],
      'kurapika': ['curapika', 'kurapica'], 'leorio': ['leolio'],
      // 🏴‍☠️ One Piece
      'roronoa zoro': ['zolo'], 'monkey d luffy': ['mugiwara'],
      'jinbe': ['jinbei', 'jimbei'], 'eustass kid': ['kid', 'eustass kidd'],
      'portgas d ace': ['ace'], 'big mom': ['charlotte linlin'],
      'whitebeard': ['edward newgate'], 'blackbeard': ['marshall d teach'],
      'sakazuki': ['akainu'], 'borsalino': ['kizaru'], 'kuzan': ['aokiji'],
      // 🛡️ Attack on Titan (French spellings)
      'levi': ['livai'], 'levi ackerman': ['livai', 'livai ackerman'],
      'eren yeager': ['eren jaeger'], 'hange zoe': ['hanji zoe'],
      // 🍜 Naruto
      'obito uchiha': ['tobi'], 'nagato': ['pain'], 'pain': ['nagato'],
      // 🦸 My Hero Academia
      'izuku midoriya': ['deku'], 'katsuki bakugo': ['kacchan', 'katchan'],
      'ochaco uraraka': ['uravity'], 'ochako uraraka': ['uravity'],
      'all might': ['toshinori yagi'], 'shoto todoroki': ['shouto todoroki'],
      // 💀 Death Note
      'light yagami': ['kira'], 'l lawliet': ['l', 'ryuzaki'],
      // ⚙️ FMA / Geass / others
      'king bradley': ['wrath'], 'lelouch lamperouge': ['zero', 'lulu', 'lelouch vi britannia'],
      'rintarou okabe': ['okarin', 'hououin kyouma'], 'okabe rintarou': ['okarin', 'hououin kyouma'],
      'kurisu makise': ['christina'],
      'shigeo kageyama': ['mob'], 'ainz ooal gown': ['momonga'],
      'koro sensei': ['koro'], 'sukuna': ['ryomen sukuna'],
      'yuji itadori': ['yuuji itadori'], 'satoru gojo': ['gojo satoru'],
      'loid forger': ['twilight'], 'yor forger': ['yor briar', 'thorn princess'],
      'kazuto kirigaya': ['kirito'], 'kirigaya kazuto': ['kirito'],
      'asuna yuuki': ['asuna'], 'yuuki asuna': ['asuna'],
      'kyojuro rengoku': ['rengoku'], 'sung jinwoo': ['sung jin woo'],
    };
    // 📺 Same for ANIME TITLES — romaji title ↔ well-known English title.
    // Key = bgNorm() of the display title. Also used to search CHARACTERS by
    // their anime (typing "demon slayer" → Tanjiro, series "Kimetsu no Yaiba").
    const BG_ANIME_EXTRA = {
      'kimetsu no yaiba': ['demon slayer'],
      'shingeki no kyojin': ['attack on titan', 'aot', 'snk'],
      'boku no hero academia': ['my hero academia', 'mha'],
      'yakusoku no neverland': ['the promised neverland'],
      'shigatsu wa kimi no uso': ['your lie in april'],
      'kimi no na wa': ['your name'],
      'koe no katachi': ['a silent voice'],
      'eiga koe no katachi': ['a silent voice'],
      'sen to chihiro no kamikakushi': ['spirited away'],
      'mononoke hime': ['princess mononoke'],
      'howl no ugoku shiro': ['howl s moving castle'],
      'tonari no totoro': ['my neighbor totoro'],
      'tensei shitara slime datta ken': ['that time i got reincarnated as a slime', 'tensura'],
      'mobu saiko hyaku': ['mob psycho 100'],
      'jojo no kimyou na bouken': ['jojo s bizarre adventure'],
      'ansatsu kyoushitsu': ['assassination classroom'],
      'nanatsu no taizai': ['the seven deadly sins'],
      'ao no exorcist': ['blue exorcist'],
      'shokugeki no souma': ['food wars'],
      'kaguya sama wa kokurasetai': ['kaguya sama love is war'],
      'go toubun no hanayome': ['the quintessential quintuplets'],
      'koukaku kidoutai': ['ghost in the shell'],
      'tenki no ko': ['weathering with you'],
      'boku dake ga inai machi': ['erased'],
      'tate no yuusha no nariagari': ['the rising of the shield hero'],
      'kono subarashii sekai ni shukufuku wo': ['konosuba'],
      'yahari ore no seishun love comedy wa machigatteiru': ['oregairu', 'my teen romantic comedy snafu'],
      'sousou no frieren': ['frieren beyond journey s end'],
      'kusuriya no hitorigoto': ['the apothecary diaries'],
      'ore dake level up na ken': ['solo leveling'],
      'jibaku shounen hanako kun': ['toilet bound hanako kun'],
      '3 gatsu no lion': ['march comes in like a lion'],
      're zero kara hajimeru isekai seikatsu': ['re zero', 'rezero starting life in another world'],
      'youkoso jitsuryoku shijou shugi no kyoushitsu e': ['classroom of the elite'],
      'dungeon ni deai wo motomeru no wa machigatteiru darou ka': ['danmachi', 'is it wrong to try to pick up girls in a dungeon'],
      'hunter hunter': ['hunter x hunter'],
      'spy family': ['spy x family'],
      'naruto shippuuden': ['naruto shippuden'],
      'boruto naruto next generations': ['boruto'],
      'bleach sennen kessen hen': ['bleach thousand year blood war', 'tybw'],
      'code geass hangyaku no lelouch': ['code geass lelouch of the rebellion'],
      'kiseijuu sei no kakuritsu': ['parasyte the maxim'],
      'shinsekai yori': ['from the new world'],
      'ookami kodomo no ame to yuki': ['wolf children'],
      'kino no tabi': ['kino s journey'],
      'sword art online': ['sao'],
      'jigokuraku': ['hell s paradise'],
      'tokyo kushu': ['tokyo ghoul'], 'toukyou guru': ['tokyo ghoul'],
      'mushoku tensei isekai ittara honki dasu': ['jobless reincarnation', 'mushoku tensei'],
      'kaijuu 8 gou': ['kaiju no 8'],
      'fumetsu no anata e': ['to your eternity'],
      'diamond no ace': ['ace of diamond'],
      'kuroko no basuke': ['kuroko s basketball'],
      'haijime no ippo': ['fighting spirit'], 'hajime no ippo': ['fighting spirit'],
      'uchuu kyoudai': ['space brothers'],
      'wanpanman': ['one punch man'],
      'dr stone': ['dokuta sutoon'],
      'violet evergarden': [],
    };

    // All searchable names of a character/anime: main + community aliases +
    // our curated extras + a dash-joined variant ("Sung Jin-Woo" → "jinwoo").
    function bgNamesOf(ch) {
      if (!ch) return [];
      if (typeof ch === 'string') return [ch];
      const key = bgNorm(ch.name);
      const extra = (BG_CHAR_EXTRA[key] || []).concat(BG_ANIME_EXTRA[key] || []);
      const names = [ch.name || ''].concat(Array.isArray(ch.al) ? ch.al : [], extra, dAlt(ch.name));
      const joined = [];
      names.forEach(nm => { if (nm && nm.indexOf('-') !== -1) joined.push(nm.replace(/-/g, '')); });
      return names.concat(joined);
    }

    // Capped Levenshtein (bails out as soon as it exceeds `max`).
    function bgEditDist(a, b, max) {
      const m = a.length, n = b.length;
      if (Math.abs(m - n) > max) return max + 1;
      let prev = []; for (let j = 0; j <= n; j++) prev[j] = j;
      for (let i = 1; i <= m; i++) {
        const cur = [i]; let rowMin = i;
        for (let j = 1; j <= n; j++) {
          cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
          if (cur[j] < rowMin) rowMin = cur[j];
        }
        if (rowMin > max) return max + 1;
        prev = cur;
      }
      return prev[n];
    }
    // "Close" words: exact, or a tight spelling variant with the SAME beginning
    // (so "mikasa"≠"makise", "bleach"≠"black"… but "hyuga"≈"hyuuga",
    // "goku"≈"gokuu", "shippuden"≈"shippuuden"). Bigger variants ("kirua"≈"killua",
    // "sangoku"→"goku") are covered by the curated alias lists above.
    function bgWordClose(a, b) {
      if (a === b) return true;
      if (Math.min(a.length, b.length) < 4 || Math.max(a.length, b.length) < 5) return false;
      if (a[0] !== b[0] || a[1] !== b[1]) return false;
      const mx = Math.max(a.length, b.length);
      const cap = mx >= 8 ? 2 : 1; // d≤1 for short words; d≤2 only for long ones
      return bgEditDist(a, b, cap) <= cap;
    }

    function bgMatches(guess, ch) {
      const g = bgNorm(guess);
      if (!g) return false;
      const gWords = g.split(' ');
      return bgNamesOf(ch).some(nm => {
        const n = bgNorm(nm);
        if (!n) return false;
        if (g === n) return true;
        // any 4+ letter word of the name/alias, close spellings OK
        return n.split(' ').some(t => t.length >= 4 && gWords.some(w => w.length >= 4 && bgWordClose(w, t)));
      });
    }

    // ---------- ⌨️ GUESS AUTOCOMPLETE ----------
    // While typing in the Blur Guess bar, suggest characters whose name,
    // aliases OR ANIME (series) name match the typed text — "bleach" →
    // Ichigo, Rukia…; "deku" → Izuku Midoriya; "naruto" → Sasuke, Sakura…
    // Series matching is TOKEN-TOLERANT ("shippuden" ≈ "Shippuuden") and knows
    // English titles ("demon slayer" → Tanjiro!). Close spellings of names
    // work too ("kirua" → Killua). Rank: name-start hits first, then alias
    // starts, then substrings, then 📺 series matches — ties keep pool order
    // (pool = AniList popularity, so the famous characters surface first).
    // (Series search only SUGGESTS — it never counts as a correct answer.)
    // A tap fills the input AND submits the guess right away (phone-friendly).

    // Every searchable spelling of a show/series name (norm'd, alias-expanded).
    function bgSeriesKeys(series) {
      const s = bgNorm(series);
      if (!s) return [];
      return [s].concat((BG_ANIME_EXTRA[s] || []).map(bgNorm));
    }

    function bgFindSuggestions(query) {
      const g = bgNorm(query);
      if (!g) return [];
      const gWords = g.split(' ');
      const gSingle = gWords.length === 1 ? g : null;
      const pool = bgCandidateChars(); // full source pool, mode-aware (deduped by id)
      const hits = [];
      pool.forEach(c => {
        let best = null;
        bgNamesOf(c).forEach((nm, i) => {
          const n = bgNorm(nm);
          if (!n) return;
          const isMain = i === 0;
          let rank = -1;
          if (n.indexOf(g) !== -1) {
            rank = isMain ? (n.indexOf(g) === 0 ? 0 : 2) : (n.indexOf(g) === 0 ? 1 : 3);
          } else if (gSingle && gSingle.length >= 4) {
            // close spelling on a 4+ letter word: "kirua" ≈ Killua, "hyuga" ≈ Hyuuga
            if (n.split(' ').some(t => t.length >= 4 && bgWordClose(gSingle, t))) rank = 3;
          }
          if (rank >= 0 && (!best || rank < best.rank)) best = { c: c, rank: rank, via: isMain ? null : ('aka ' + nm) };
        });
        // 📺 by anime title (exact, substring either way, or close word)
        let sRank = 0;
        bgSeriesKeys(c.series).forEach(key => {
          if (sRank || !key) return;
          if (g === key) sRank = 4;
          else if ((g.length >= 3 && key.indexOf(g) !== -1) || (key.length >= 3 && g.indexOf(key) !== -1)) sRank = 5;
          else if (gWords.some(w => w.length >= 4 && key.split(' ').some(t => t.length >= 4 && bgWordClose(w, t)))) sRank = 5;
        });
        if (sRank && (!best || sRank < best.rank)) best = { c: c, rank: sRank, via: c.series };
        if (best) hits.push(best);
      });
      hits.sort((a, b) => a.rank - b.rank); // stable sort → pool (popularity) order inside a rank
      return hits.slice(0, 15);
    }

    function hideBgSuggest() {
      const box = document.getElementById('bgSuggest');
      if (box) { box.classList.remove('show'); box.innerHTML = ''; }
      bgSugHits = [];
      bgSugIndex = -1;
    }

    // Pick a suggestion (tap ↯ click, or Enter on the highlighted row):
    // fills the input AND submits the guess right away (phone-friendly).
    function bgPickSuggestion(h) {
      const inp = document.getElementById('bgGuessInput');
      if (!inp || !h) return;
      inp.value = h.c.name;
      hideBgSuggest();
      blurGuess();
    }

    // ✕ Clear the Blur Guess input (little cross at the end of the typing space)
    function bgClearGuessInput() {
      const inp = document.getElementById('bgGuessInput');
      if (!inp) return;
      inp.value = '';
      hideBgSuggest();
      try { inp.focus(); } catch (_e) {}
    }

    function updateBgSuggest() {
      const inp = document.getElementById('bgGuessInput');
      const box = document.getElementById('bgSuggest');
      if (!inp || !box) return;
      const bg = (currentRoom && currentRoom.bg) || {};
      if (bg.phase !== 'playing' || (bg.found || {})[playerId]) { hideBgSuggest(); return; }
      const q = inp.value;
      if (!bgNorm(q)) { hideBgSuggest(); return; }
      const hits = bgFindSuggestions(q);
      if (!hits.length) { hideBgSuggest(); return; }
      bgSugHits = hits;
      bgSugIndex = -1; // fresh row set → no highlight until ↑/↓
      box.innerHTML = '';
      hits.forEach((h, i) => {
        const row = document.createElement('div');
        row.className = 'bg-sug-row';
        const img = document.createElement('img');
        img.className = 'bg-sug-img'; img.src = h.c.image || ''; img.alt = ''; img.loading = 'lazy';
        const nm = document.createElement('span');
        nm.className = 'bg-sug-name'; nm.textContent = bgIsCovers() ? dTitle(h.c.name) : h.c.name;
        row.appendChild(img); row.appendChild(nm);
        if (h.via) {
          const tag = document.createElement('span');
          tag.className = 'bg-sug-via'; tag.textContent = h.via; // "aka …" or "📺 …"
          row.appendChild(tag);
        }
        // 📱 Tap-guard (scroll-friendly): we never preventDefault → phone users
        // CAN scroll the list with their finger. A row is picked only when the
        // finger LIFTS within 12px of where it landed (a real tap, not a swipe).
        // The 150ms blur-hide in the keydown wiring gives the tap time to land.
        row.addEventListener('pointerdown', (e) => { e.preventDefault(); row._psY = e.clientY; row._psX = e.clientX; }); // preventDefault: no ghost click through the closing dropdown
        row.addEventListener('pointerup', (e) => {
          if (row._psY == null) return;
          const moved = Math.abs(e.clientY - row._psY) + Math.abs(e.clientX - row._psX);
          row._psY = null; row._psX = null;
          if (moved < 12) bgPickSuggestion(h);
        });
        box.appendChild(row);
      });
      box.classList.add('show');
    }

    // ⬆⬇ keyboard navigation through the suggestion rows (wraps around);
    // Enter picks the highlighted suggestion, plain Enter still submits typing.
    function bgPaintSugSel() {
      const box = document.getElementById('bgSuggest');
      if (!box) return;
      for (let i = 0; i < box.children.length; i++) box.children[i].classList.toggle('active', i === bgSugIndex);
      const row = box.children[bgSugIndex];
      if (row && row.scrollIntoView) row.scrollIntoView({ block: 'nearest' });
    }
    function bgSugMove(d) {
      if (!bgSugHits.length) return;
      bgSugIndex = (bgSugIndex + d + bgSugHits.length) % bgSugHits.length;
      bgPaintSugSel();
    }
    function bgSugAccept() {
      if (bgSugIndex >= 0 && bgSugHits[bgSugIndex]) { bgPickSuggestion(bgSugHits[bgSugIndex]); return; }
      blurGuess();
    }
    const bgCurrentChar = (room) => {
      const r = room || currentRoom; const bg = (r && r.bg) || {};
      const total = (bg.rounds || []).length;
      const idx = Math.min(bg.roundIdx || 0, Math.max(total - 1, 0));
      // rounds entries are compact {id,name,image,series?,al?} objects
      // (old ids-only rounds fall back to the room board, pre-2026-08-15 rooms)
      const entry = (bg.rounds || [])[idx];
      if (entry && typeof entry === 'object') return entry;
      return ((r.characters || []).find(c => c.id === entry)) || {};
    };

    function blurGuess() {
      const bg = (currentRoom && currentRoom.bg) || {};
      if (bg.phase !== 'playing' || (bg.found || {})[playerId]) return;
      const inp = document.getElementById('bgGuessInput'); if (!inp) return;
      const text = inp.value.trim(); if (!text) return;
      const ch = bgCurrentChar();
      if (bgMatches(text, ch)) {
        const prior = Object.keys(bg.found || {}).length; // 0 = first finder
        const base = Math.max(1, (BLUR_STAGES + 1) - (bg.stage || 1)); // stage 1 → 5 … stage 5 → 1
        const bonus = [3, 2, 1, 0][Math.min(prior, 3)];                // 🏅 speed bonus
        const pts = base + bonus;
        const upd = {};
        upd['found/' + playerId] = { stage: bg.stage || 1, rank: prior + 1, base: base, bonus: bonus, pts: pts };
        upd['scores/' + playerId] = ((bg.scores || {})[playerId] || 0) + pts;
        database.ref('rooms/' + roomCode + '/bg').update(upd);
        inp.value = '';
        hideBgSuggest();
        showNotification('Correct! +' + pts + ' pts (' + base + ' base' + (bonus ? ' + ' + bonus + ' speed bonus' : '') + ')', 4000);
        touchActivity();
      } else {
        showNotification('Nope! Keep trying — it gets clearer every few seconds…', 2500);
        bgMaybeFocusGuess(); // ⌨️ keep typing on PC (e.g. after picking a suggestion with the mouse)
      }
    }

    // The reveal content (answer + who scored what) — shared by the watchdog
    // transition and the host's ⏭ Skip button.
    function blurRevealLogUpdate(bg) {
      const players = currentRoom.players || {};
      const ch = bgCurrentChar();
      const found = bg.found || {};
      const parts = bgParticipants();
      const gains = parts.filter(pid => found[pid])
        .sort((a, b) => (found[a].rank || 9) - (found[b].rank || 9))
        .map(pid => ((players[pid] || {}).name || '?') + ' +' + found[pid].pts + ' (stage ' + found[pid].stage + ')');
      const upd = { phase: 'reveal', deadline: Date.now() + 6000 };
      upd['log/' + gameLogPushKey('bg')] = { k: 'find', txt: 'Round ' + ((bg.roundIdx || 0) + 1) + '/' + (bg.rounds || []).length + ': it was ' + (bgIsCovers() ? dTitle(ch.name || '?') : (ch.name || '?')) + (ch.series ? ' (' + ch.series + ')' : '') + '!' };
      upd['log/' + gameLogPushKey('bg')] = { k: gains.length ? 'ans' : 'info', txt: gains.length ? gains.join(' · ') : 'Nobody found it that time!' };
      return upd;
    }

    function blurSkip() {
      if (!isHost || !currentRoom) { showNotification('Host only!'); return; }
      const bg = currentRoom.bg || {};
      if (bg.phase !== 'playing') return;
      database.ref('rooms/' + roomCode + '/bg').update(blurRevealLogUpdate(bg));
      touchActivity();
    }

    // HOST watchdog: stages, early reveals, next round, game over.
    // Driven by the room listener AND by a 1s host timer (see below) —
    // without the timer, a room with no writes (nobody guessing/chatting)
    // would freeze the clock: the countdown hits 0 and nothing advances.
    // bgWatchBusy stays true until each write resolves so back-to-back
    // ticks can never double-log or double-advance.
    function blurWatchdog() {
      if (bgWatchBusy || abortingEmptyGame || !isHost) return;
      const bg = (currentRoom && currentRoom.bg) || {};
      if (!bg.gameId) return;
      const players = currentRoom.players || {};
      const parts = bgParticipants();
      if (parts.length === 0) return; // everyone backed out → the auto-abort resets the room
      const found = bg.found || {};
      const now = Date.now();
      const stepMs = bgStageMs(); // ⏱ customizable in the room settings
      const endBusy = () => { bgWatchBusy = false; };
      const poke = () => { touchActivity(); };
      if (bg.phase === 'playing') {
        const allFound = parts.every(pid => found[pid]);
        if (!allFound && now < (bg.deadline || 0)) return; // still waiting on this stage
        if (!allFound && (bg.stage || 1) < BLUR_STAGES) {
          bgWatchBusy = true;
          database.ref('rooms/' + roomCode + '/bg').update({ stage: (bg.stage || 1) + 1, deadline: now + stepMs })
            .then(poke).catch(() => {}).then(endBusy, endBusy);
          return;
        }
        // round over → reveal
        bgWatchBusy = true;
        database.ref('rooms/' + roomCode + '/bg').update(blurRevealLogUpdate(bg))
          .then(poke).catch(() => {}).then(endBusy, endBusy);
        return;
      }
      if (bg.phase === 'reveal' && now >= (bg.deadline || 0)) {
        const nextIdx = (bg.roundIdx || 0) + 1;
        bgWatchBusy = true;
        if (nextIdx >= (bg.rounds || []).length) {
          const winPid = parts.slice().sort((a, b) => ((bg.scores || {})[b] || 0) - ((bg.scores || {})[a] || 0))[0];
          const upd2 = { state: 'finished', 'bg/phase': 'over' };
          upd2['bg/log/' + gameLogPushKey('bg')] = { k: 'find', txt: ((players[winPid] || {}).name || '?') + ' wins Blur Guess with ' + ((bg.scores || {})[winPid] || 0) + ' pts!' };
          database.ref('rooms/' + roomCode).update(upd2).then(poke).catch(() => {}).then(endBusy, endBusy);
        } else {
          database.ref('rooms/' + roomCode + '/bg').update({ roundIdx: nextIdx, stage: 1, found: null, phase: 'playing', deadline: now + stepMs })
            .then(poke).catch(() => {}).then(endBusy, endBusy);
        }
      }
    }

    // HOST-only 1s heartbeat for the Blur Guess clock. It starts when the
    // listener sees a live blur game with me as host, and stops itself the
    // moment that's no longer true (game over, back to lobby, host moved).
    function ensureBgHostTimer() {
      if (bgHostTimer) return;
      bgHostTimer = setInterval(() => {
        const active = isHost && currentRoom && currentRoom.game === 'blur' && currentRoom.state === 'playing';
        if (!active) { clearInterval(bgHostTimer); bgHostTimer = null; return; }
        blurWatchdog();
      }, 1000);
    }

    // ---------- BLUR GUESS RENDER ----------
    const BLUR_LEVELS = [20, 12, 7, 3, 0];
    const BLUR_SCALES = [1.25, 1.2, 1.15, 1.08, 1.02];
    function updateBlurTimer() {
      const bg = (currentRoom && currentRoom.bg) || {};
      const el = document.getElementById('bgTimerBadge'); if (!el) return;
      if (bg.phase !== 'playing' && bg.phase !== 'reveal') { el.innerHTML = ic('flag') + ' Over'; return; }
      const left = Math.max(0, Math.ceil(((bg.deadline || 0) - Date.now()) / 1000));
      el.innerHTML = ic('clock') + ' ' + left + 's';
    }
    function ensureBlurTicker() {
      if (blurTicker) return;
      blurTicker = setInterval(() => {
        const scr = document.getElementById('blurScreen');
        if (!scr || !scr.classList.contains('active')) { clearInterval(blurTicker); blurTicker = null; return; }
        updateBlurTimer();
      }, 500);
    }
    // ⌨️ PC only: at the start of each round, jump straight into the guess bar
    // so desktop players can type instantly (no click needed). Skipped on
    // touch devices — autofocusing there would pop the keyboard over the art,
    // and skipped while typing in the chat or after this round is found.
    function bgMaybeFocusGuess() {
      try {
        if (typeof window === 'undefined') return;
        const coarse = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || (window.innerWidth && window.innerWidth < 768);
        if (coarse) return; // 📱 phones/tablets: no autofocus
        const scr = document.getElementById('blurScreen');
        if (!scr || !(scr.classList.contains('active') || scr.classList.contains('show'))) return;
        const bg = (currentRoom && currentRoom.bg) || {};
        if (bg.phase !== 'playing' || (bg.found || {})[playerId]) return;
        const ae = document.activeElement;
        if (ae && ae.tagName && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA') && ae.id !== 'bgGuessInput') return; // user is typing elsewhere (chat…)
        const inp = document.getElementById('bgGuessInput');
        if (inp && typeof inp.focus === 'function') inp.focus();
      } catch (e) {}
    }
    function updateBlur() {
      const bg = (currentRoom && currentRoom.bg) || {};
      const players = currentRoom.players || {};
      const total = (bg.rounds || []).length;
      const idx = Math.min(bg.roundIdx || 0, Math.max(total - 1, 0));
      const ch = bgCurrentChar();
      const stage = Math.min(bg.stage || 1, BLUR_STAGES);
      const revealed = bg.phase !== 'playing';
      const bgModeNow = bg.mode || ((currentRoom.settings || {}).bgMode) || 'characters';
      const stageSec = Math.round(bgStageMs() / 1000);
      document.getElementById('bgRoundBadge').innerHTML = ic(bgModeNow === 'covers' ? 'film' : 'layers') + (bg.phase === 'setup' ? ' Dealing…' : (' Round ' + Math.min(idx + 1, total || 1) + '/' + (total || '?')));
      document.getElementById('bgStageBadge').textContent = bg.phase === 'over' ? 'Over' : revealed && bg.phase === 'reveal' ? 'Revealed!' : ('Blur stage ' + stage + '/' + BLUR_STAGES + (stage < BLUR_STAGES ? ' → +' + ((BLUR_STAGES + 1) - stage) + ' pts now' : ''));
      const img = document.getElementById('bgImage');
      if (img.getAttribute('data-cid') !== String(ch.id)) {
        // 🚫 No peeking: the old 0.7s filter transition let the NEW image
        // fade in from UNBLURRED for a split second at every round start.
        // Kill the animation during the swap so a round begins 100% blurred.
        img.classList.add('bg-no-anim');
        img.src = ch.image || ''; img.setAttribute('data-cid', String(ch.id));
        img.style.filter = 'blur(' + (revealed ? 0 : BLUR_LEVELS[stage - 1]) + 'px)';
        img.style.transform = 'scale(' + (revealed ? 1.02 : BLUR_SCALES[stage - 1]) + ')';
        try { void img.offsetWidth; } catch (e) {} // force reflow — apply instantly
        img.classList.remove('bg-no-anim');
        // new round → clear any leftover typing/suggestions from the previous character
        const inp = document.getElementById('bgGuessInput');
        if (inp) inp.value = '';
        hideBgSuggest();
        // ⌨️ PC: put the caret in the search bar right away (after the DOM settles)
        if (typeof setTimeout === 'function') setTimeout(bgMaybeFocusGuess, 90); else bgMaybeFocusGuess();
      }
      img.style.filter = 'blur(' + (revealed ? 0 : BLUR_LEVELS[stage - 1]) + 'px)';
      img.style.transform = 'scale(' + (revealed ? 1.02 : BLUR_SCALES[stage - 1]) + ')';
      // While the answer is revealed, quietly preload the NEXT round's
      // picture so its swap is instant (no loading flash either)
      if (bg.phase === 'reveal' && typeof Image !== 'undefined') {
        const nxt = (bg.rounds || [])[(bg.roundIdx || 0) + 1];
        if (nxt && nxt.image) { const pre = new Image(); pre.src = nxt.image; }
      }
      document.getElementById('bgImgWrap').classList.toggle('revealed', revealed && bg.phase !== 'over');
      // guess bar
      const gin = document.getElementById('bgGuessInput');
      if (gin) gin.placeholder = bgModeNow === 'covers' ? 'Type the anime name…' : "Type the character's name… (any name: Deku, Burdock…)";
      const myFind = (bg.found || {})[playerId];
      const barVisible = bg.phase === 'playing' && !myFind;
      document.getElementById('bgGuessBar').style.display = barVisible ? 'flex' : 'none';
      if (!barVisible) hideBgSuggest();
      // status line
      const st = document.getElementById('bgStatus');
      const parts = bgParticipants();
      const thinking = parts.filter(pid => !(bg.found || {})[pid]).map(pid => (players[pid] || {}).name || '?');
      if (bg.phase === 'over') st.textContent = 'Game over — check the results!';
      else if (bg.phase === 'reveal') {
        const gains = parts.filter(pid => (bg.found || {})[pid])
          .sort((a, b) => (bg.found[a].rank || 9) - (bg.found[b].rank || 9))
          .map(pid => ((players[pid] || {}).name || '?') + ' +' + bg.found[pid].pts);
        st.innerHTML = ic('check') + ' It was <b>' + escapeHtml(String(bgIsCovers() ? dTitle(ch.name) : (ch.name || '?'))) + '</b>' + (ch.series ? ' <span style="color:var(--muted);font-weight:700;">(' + escapeHtml(String(ch.series)) + ')</span>' : '') + '!' + (gains.length ? ' ' + gains.join(' · ') : ' Nobody found it!');
      } else if (myFind) {
        st.innerHTML = ic('check') + ' <b>+' + myFind.pts + ' pts!</b> Still thinking: ' + (thinking.length ? escapeHtml(thinking.join(', ')) : 'nobody — next round!');
      } else {
        st.innerHTML = stage === 1
          ? (ic(bgModeNow === 'covers' ? 'film' : 'layers') + ' <b>' + (bgModeNow === 'covers' ? 'Which anime is this?!' : 'Who is this?!') + '</b> ' + tPO('clears_every', { x: stageSec }))
          : 'Still thinking: ' + escapeHtml(thinking.join(', '));
      }
      // score chips
      const chips = document.getElementById('bgChips');
      chips.innerHTML = '';
      const sorted = parts.slice().sort((a, b) => ((bg.scores || {})[b] || 0) - ((bg.scores || {})[a] || 0));
      sorted.forEach((pid, i) => {
        const p = players[pid] || {};
        const f = (bg.found || {})[pid];
        const chip = document.createElement('div');
        chip.className = 'rc-hunter' + (f ? ' turn' : '');
        chip.style.setProperty('--c', '#02a9ff');
        chip.innerHTML = `<span class="rc-hunter-turn">${i + 1}</span>${avatarCircle(p.avatar, 'ava-chat')}<span class="rc-hunter-name">${escapeHtml(String(p.name || '?'))}${pid === playerId ? ' (You)' : ''}</span><span class="chip-pts">${(bg.scores || {})[pid] || 0} pts</span>${f ? '<span class="rc-hunter-res">' + ic('check') + ' stage ' + f.stage + '</span>' : ''}`;
        chips.appendChild(chip);
      });
      const skipBtn = document.getElementById('bgSkipBtn');
      if (skipBtn) skipBtn.style.display = (isHost && bg.phase === 'playing') ? 'flex' : 'none';
      renderBlurLog();
      if (bg.phase === 'over') renderMultiEnd('blur'); else document.getElementById('multiEndScreen').classList.remove('show');
      ensureBlurTicker();
      updateBlurTimer();
    }
    function renderBlurLog() {
      const logEl = document.getElementById('bgLog'); if (!logEl || !currentRoom) return;
      const log = gameLogList(currentRoom.bg);
      if (log.length === 0) { logEl.innerHTML = '<p style="text-align:center;color:var(--muted);">Nothing yet</p>'; return; }
      logEl.innerHTML = '';
      log.slice(-60).reverse().forEach(e => {
        const d = document.createElement('div');
        d.className = 'br-log-' + (e.k === 'find' ? 'find' : e.k === 'q' ? 'q' : 'info');
        d.textContent = e.txt;
        logEl.appendChild(d);
      });
    }

    function meParticipants() {
      // players eligible to click "Play Again": seated and not spectating this game
      const gd = multiGd();
      return Object.keys((currentRoom && currentRoom.players) || {}).filter(pid => {
        const p = currentRoom.players[pid] || {};
        if (p.outInGame && p.outInGame === gd.gameId) return false;
        return true;
      });
    }
    function renderMultiEnd(kind) {
      const screen = document.getElementById('multiEndScreen');
      const activeScreen = document.querySelector('.screen.active');
      const sid = activeScreen ? activeScreen.id : '';
      if (sid !== 'battleScreen' && sid !== 'raceScreen' && sid !== 'blurScreen') { screen.classList.remove('show'); return; }
      const players = currentRoom.players || {};
      const title = document.getElementById('meTitle');
      const sub = document.getElementById('meSub');
      const list = document.getElementById('meList');
      list.innerHTML = '';
      if (kind === 'battle') {
        const br = currentRoom.br || {};
        const secrets = br.secrets || {};
        const ranking = (br.order || []).filter(pid => players[pid]).sort((a, b) => {
          const diff = ((br.points || {})[b] || 0) - ((br.points || {})[a] || 0);
          if (diff) return diff;
          const aF = (br.found || {})[a] ? 1 : 0, bF = (br.found || {})[b] ? 1 : 0;
          return aF - bF; // unfound ranks above on tie
        });
        const winner = ranking[0];
        const meWin = winner === playerId;
        title.textContent = meWin ? 'You win the Battle Royale!' : 'Battle Royale over!';
        sub.textContent = meWin ? 'Champion hunter!' : ((players[winner] || {}).name || '?') + ' takes it!';
        ranking.forEach((pid, i) => {
          const p = players[pid] || {};
          const found = (br.found || {})[pid];
          const secChar = (currentRoom.characters || []).find(c => c.id === secrets[pid]);
          const row = document.createElement('div');
          row.className = 'me-row' + (pid === playerId ? ' me' : '');
          row.style.setProperty('--c', brColorOf(pid));
          row.innerHTML = `<span class="me-rank">${(i + 1) + '.'}</span>${avatarCircle(p.avatar, 'ava-chat')}<span>${escapeHtml(String(p.name || '?'))}${pid === playerId ? ' (You)' : ''}</span><span class="me-pts">${(br.points || {})[pid] || 0} pts${found ? '' : ' · never found'}</span>`;
          if (secChar) { const s = document.createElement('small'); s.style.color = 'var(--muted)'; s.style.width = '100%'; s.textContent = (found ? 'secret: ' : 'secret was: ') + (secChar.name || '?'); row.appendChild(s); row.style.flexWrap = 'wrap'; }
          list.appendChild(row);
        });
      } else if (kind === 'blur') {
        const bg = currentRoom.bg || {};
        const scores = bg.scores || {};
        const ranking = bgParticipants().sort((a, b) => ((scores[b] || 0) - (scores[a] || 0)));
        const winner = ranking[0];
        const meWin = winner === playerId;
        title.textContent = meWin ? 'You win Blur Guess!' : 'Blur Guess over!';
        sub.textContent = meWin ? 'Sharpest eyes in the room!' : ((players[winner] || {}).name || '?') + ' takes it!';
        ranking.forEach((pid, i) => {
          const p = players[pid] || {};
          const row = document.createElement('div');
          row.className = 'me-row' + (pid === playerId ? ' me' : '');
          row.innerHTML = `<span class="me-rank">${(i + 1) + '.'}</span>${avatarCircle(p.avatar, 'ava-chat')}<span>${escapeHtml(String(p.name || '?'))}${pid === playerId ? ' (You)' : ''}</span><span class="me-pts">${scores[pid] || 0} pts</span>`;
          list.appendChild(row);
        });
        const played = (bg.rounds || []).length;
        if (played) {
          const row = document.createElement('div');
          row.className = 'me-row';
          row.innerHTML = `<span class="me-rank">${ic('layers')}</span><span>${played} rounds played — the fastest eyes score speed bonuses!</span>`;
          list.appendChild(row);
        }
      } else {
        const rc = currentRoom.rc || {};
        const winner = rc.winner;
        const secretChar = (currentRoom.characters || []).find(c => c.id === rc.secretId);
        const targetWon = rc.endReason === 'hunters-out' || (winner && winner === rc.targetPid);
        if (targetWon) {
          title.textContent = winner === playerId ? 'You WIN, target!' : 'Race over — TARGET wins!';
          sub.textContent = 'All the hunters ran out of lives — the secret stays safe with ' + ((players[rc.targetPid] || {}).name || '?') + '!';
        } else if (winner) {
          title.textContent = winner === playerId ? 'You found it first!' : 'Race over!';
          sub.textContent = ((players[winner] || {}).name || '?') + ' found ' + (secretChar ? secretChar.name : 'the character') + ' first!';
        } else {
          title.textContent = 'Race over';
          sub.textContent = rc.endReason === 'target-left' ? 'The target left the game!' : 'No hunters left!';
        }
        if (secretChar) {
          const row = document.createElement('div');
          row.className = 'me-row';
          row.innerHTML = `<span class="me-rank">${ic('mask')}</span><span>The mystery character was <b>${escapeHtml(secretChar.name || '?')}</b></span>`;
          list.appendChild(row);
        }
        rcHunters().concat(rc.targetPid ? [rc.targetPid] : []).filter(pid => players[pid]).forEach(pid => {
          const p = players[pid] || {};
          const row = document.createElement('div');
          row.className = 'me-row' + (pid === playerId ? ' me' : '');
          const label = pid === rc.targetPid ? (pid === winner ? 'winning target' : 'target') : (pid === winner ? 'winner' : (rcLivesOf(currentRoom, pid) <= 0 ? 'hunter (out)' : 'hunter'));
          row.innerHTML = `${avatarCircle(p.avatar, 'ava-chat')}<span>${escapeHtml(String(p.name || '?'))}${pid === playerId ? ' (You)' : ''}</span><span class="me-pts">${label}</span>`;
          list.appendChild(row);
        });
      }
      // Replay counting (same pattern as Undercover)
      const restarts = currentRoom.restarts || {};
      if (restarts[playerId]) screen.classList.remove('show'); else screen.classList.add('show');
      const eligible = meParticipants();
      const clicked = eligible.filter(pid => restarts[pid]).length;
      const statusEl = document.getElementById('meRestartStatus');
      const btn = document.getElementById('meRestartBtn');
      if (eligible.length > 0 && clicked >= eligible.length) {
        if (isHost) { if (statusEl) statusEl.textContent = 'Everyone is ready! New game…'; launchNewMulti(); }
        else if (statusEl) statusEl.textContent = 'Waiting for the host…';
      } else if (statusEl) statusEl.textContent = 'Ready for a new game: ' + clicked + '/' + eligible.length;
      if (btn) {
        if (restarts[playerId]) { btn.textContent = 'Waiting…'; btn.disabled = true; }
        else { btn.textContent = 'Play Again'; btn.disabled = false; }
      }
    }
    let multiLaunching = false;
    function multiRestart() {
      if (!currentRoom || !roomCode) return;
      database.ref('rooms/' + roomCode + '/restarts/' + playerId).set(true);
      touchActivity();
      showNotification('Play Again clicked! Waiting for others…');
      const btn = document.getElementById('meRestartBtn');
      if (btn) { btn.textContent = 'Waiting…'; btn.disabled = true; }
    }
    async function launchNewMulti() {
      if (multiLaunching) return;
      multiLaunching = true;
      try {
        await maybePromoteQueue(true); // ⏳ queued players take free seats first
        const snap = await database.ref('rooms/' + roomCode).once('value');
        currentRoom = snap.val();
        document.getElementById('multiEndScreen').classList.remove('show');
        await multiDeal(currentRoom.game);
      } finally { multiLaunching = false; }
    }
    // Shared "the game is OVER → the whole room goes back to the lobby" reset.
    // WITHOUT this the room state stays 'finished' forever once players leave the
    // end screen, and QUEUED players could never take a seat (promotions only
    // happen in the lobby) — the queue looked permanently locked.
    async function resetRoomToLobbyAfterGame() {
      if (!roomCode || !currentRoom) return;
      const updates = {
        state: 'lobby', characters: null, selections: null, restarts: null, winner: null,
        secrets: null, currentTurn: null, eliminations: null, currentQuestion: null,
        questionHistory: null, uc: null, br: null, rc: null, bg: null, hc: null
      };
      Object.keys(currentRoom.players || {}).forEach(pid => {
        updates['players/' + pid + '/ready'] = false;
        updates['players/' + pid + '/outInGame'] = null;
      });
      await database.ref('rooms/' + roomCode).update(updates);
      touchActivity();
    }
    // game data node for the current multiplayer game (battle/race/blur)
    const multiGd = (r) => { const rr = r || currentRoom; if (!rr) return {}; return rr.game === 'battle' ? (rr.br || {}) : rr.game === 'race' ? (rr.rc || {}) : rr.game === 'blur' ? (rr.bg || {}) : {}; };
    async function returnToLobbyFromMulti() {
      const gd = multiGd();
      const inGame = currentRoom && (currentRoom.state === 'playing' || currentRoom.state === 'finished') && gd.gameId;
      if (!inGame) { showScreen('lobbyScreen'); return; }
      // Game over? Then this button brings EVERYONE back to a real lobby
      // (state: 'lobby') so the ⏳ queue can fill free seats again.
      if (currentRoom.state === 'finished' || gd.phase === 'over') {
        showInteraction('Return to Lobby?', 'The game is over — <b>everyone</b> goes back to the lobby' + (Object.keys((currentRoom && currentRoom.queue) || {}).length ? ' and waiting players from the queue take free seats.' : '.'), [
          { label: 'Stay here', onclick: () => { closeInteraction(); }, class: 'secondary' },
          { label: 'To Lobby', onclick: async () => { closeInteraction(); try { await resetRoomToLobbyAfterGame(); } catch (e) {} document.getElementById('multiEndScreen').classList.remove('show'); showScreen('lobbyScreen'); }, class: 'danger' }
        ]);
        return;
      }
      showInteraction('Return to Lobby?', 'The game continues for the others — you wait in the lobby until it ends.', [
        { label: 'Stay in the game', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: 'To Lobby', onclick: async () => {
          closeInteraction();
          try {
            const updates = {};
            updates['rooms/' + roomCode + '/players/' + playerId + '/outInGame'] = gd.gameId;
            updates['rooms/' + roomCode + '/players/' + playerId + '/ready'] = false;
            await database.ref().update(updates);
          } catch (e) {}
          document.getElementById('multiEndScreen').classList.remove('show');
          showScreen('lobbyScreen');
        }, class: 'danger' }
      ]);
    }

    // Runs once per page load: removes rooms abandoned by everyone.
    // Live rooms idle > 1h are already closed by the in-room watcher; this is
    // the backstop for rooms where nobody is connected (crashed/closed tabs).
    async function cleanupStaleRooms() {
      try {
        const snap = await database.ref('rooms').once('value');
        const rooms = snap.val() || {};
        const now = Date.now();
        const STALE_MS = 2 * 60 * 60 * 1000; // 2 hours (conservative backstop)
        Object.entries(rooms).forEach(([code, room]) => {
          const players = (room && room.players) || {};
          const last = (room && (room.lastActivity || room.createdAt)) || 0;
          if (Object.keys(players).length === 0 || !last || now - last > STALE_MS) {
            database.ref('rooms/' + code).remove();
          }
        });
      } catch (e) { console.error('Room cleanup failed:', e); }
    }

    document.addEventListener('DOMContentLoaded', () => {
      cleanupStaleRooms();
      updateUserButton();
      tryShareLinkJoin(); // opened via a 🔗 shared room link? jump straight in
      // Enter on the floating chat window's input
      const chatOverlayInput = document.getElementById('chatOverlayInput');
      if (chatOverlayInput) chatOverlayInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendOverlayChatMessage(); });
      // Enter on the Join Room code field = join directly (PC & phone keyboards)
      const joinRoomInput = document.getElementById('joinRoomInput');
      if (joinRoomInput) joinRoomInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') joinGameRoom(); });
      const pairInputA = document.getElementById('pairInputA');
      if (pairInputA) pairInputA.addEventListener('keypress', (e) => { if (e.key === 'Enter') pairAniListSearch('a'); });
      const pairInputB = document.getElementById('pairInputB');
      if (pairInputB) pairInputB.addEventListener('keypress', (e) => { if (e.key === 'Enter') pairAniListSearch('b'); });
      const joinInput = document.getElementById('joinRoomInput');
      if (joinInput) joinInput.addEventListener('input', (e) => { e.target.value = e.target.value.toUpperCase(); });
      const questionInput = document.getElementById('questionInput');
      if (questionInput) questionInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') askQuestion(); });
      const bgGuessInput = document.getElementById('bgGuessInput');
      if (bgGuessInput) {
        // keydown (not keypress) so the ⬆⬇ arrows & Escape are caught:
        // ↑/↓ = navigate suggestions, Enter = highlighted suggestion (or typed text), Esc = close
        bgGuessInput.addEventListener('keydown', (e) => {
          const boxOpen = document.getElementById('bgSuggest') && document.getElementById('bgSuggest').classList.contains('show');
          if (e.key === 'ArrowDown') { if (boxOpen) { e.preventDefault(); bgSugMove(1); } }
          else if (e.key === 'ArrowUp') { if (boxOpen) { e.preventDefault(); bgSugMove(-1); } }
          else if (e.key === 'Escape') { hideBgSuggest(); }
          else if (e.key === 'Enter') { e.preventDefault(); bgSugAccept(); }
        });
        bgGuessInput.addEventListener('input', updateBgSuggest);
        bgGuessInput.addEventListener('blur', () => setTimeout(hideBgSuggest, 150)); // small delay so taps on suggestions land first
      }
    });

    function openRoomSettings(tab) {
      if (!isHost || !currentRoom) return;
      const game = currentRoom.game || 'guesswho';
      const isUc = game === 'undercover';
      const isRace = game === 'race';
      const isMulti = game === 'battle' || game === 'race' || game === 'blur';
      const isBlur = game === 'blur';
      const gsel = document.getElementById('modalGameSelect');
      if (gsel) gsel.value = game;
      syncModalGameCards();
      // 🏠 Room tab: exactly one player-count control per game
      document.getElementById('modalGwPlayersHint').style.display = game === 'guesswho' ? 'block' : 'none';
      const hcBox = document.getElementById('modalHcMaxBlock');
      if (hcBox) {
        hcBox.style.display = game === 'hotcold' ? 'block' : 'none';
        if (game === 'hotcold') {
          const hm = Math.min(6, Math.max(2, currentRoom.maxPlayers || 4));
          document.getElementById('modalHcMaxSlider').value = hm;
          document.getElementById('modalHcMaxValue').textContent = hm;
          syncHcSettingsUI(); // 🌡️ Guess mode + Ranking pairs mirror the live settings
        }
      }
      const multiBox = document.getElementById('modalMultiMaxBlock');
      if (multiBox) {
        multiBox.style.display = isMulti ? 'block' : 'none';
        if (isMulti) {
          const mp = Math.min(8, Math.max(3, currentRoom.maxPlayers || 6));
          document.getElementById('modalMultiMaxSlider').value = mp;
          document.getElementById('modalMultiMaxValue').textContent = mp;
        }
      }
      document.getElementById('modalUcMaxBlock').style.display = isUc ? 'block' : 'none';
      // ⚙️ Game tab
      document.getElementById('modalPoolGroup').style.display = isUc ? 'none' : 'block';
      // Blur Guess & Hot & Cold draw from the FULL source pool — no character count board needed
      document.getElementById('modalGwSettings').style.display = (isUc || isBlur || game === 'hotcold') ? 'none' : 'block';
      document.getElementById('modalUwSettings').style.display = isUc ? 'block' : 'none';
      const raceBox = document.getElementById('modalRaceSettings');
      if (raceBox) {
        raceBox.style.display = isRace ? 'block' : 'none';
        if (isRace) {
          const s = currentRoom.settings || {};
          const L = s.raceLives || RACE_DEFAULT_LIVES, Q = s.raceQuestions || RACE_DEFAULT_QUESTIONS;
          document.getElementById('modalRaceLivesSlider').value = L;
          document.getElementById('modalRaceLivesValue').textContent = L;
          document.getElementById('modalRaceQuestionsSlider').value = Q;
          document.getElementById('modalRaceQuestionsValue').textContent = Q;
        }
      }
      const bgBox = document.getElementById('modalBgSettings');
      if (bgBox) {
        bgBox.style.display = isBlur ? 'block' : 'none';
        if (isBlur) {
          const s = currentRoom.settings || {};
          const R = s.bgRounds || BLUR_ROUNDS_DEFAULT;
          document.getElementById('modalBgRoundsSlider').value = R;
          document.getElementById('modalBgRoundsValue').textContent = R;
          const T = Math.min(BLUR_STAGE_SEC_MAX, Math.max(BLUR_STAGE_SEC_MIN, s.bgStageSec || BLUR_STAGE_SEC));
          document.getElementById('modalBgStageSecSlider').value = T;
          document.getElementById('modalBgStageSecValue').textContent = T + 's';
          const m = s.bgMode === 'covers' ? 'covers' : 'characters';
          document.getElementById('modalBgModeChars').classList.toggle('selected', m === 'characters');
          document.getElementById('modalBgModeCovers').classList.toggle('selected', m === 'covers');
        }
      }
      if (isUc) {
        const maxP = currentRoom.maxPlayers || 5;
        document.getElementById('modalUcMaxSlider').value = maxP;
        document.getElementById('modalUcMaxValue').textContent = maxP;
        const mwOn = !!(currentRoom.settings && currentRoom.settings.mrWhite);
        document.getElementById('modalUcMwOff').classList.toggle('selected', !mwOn);
        document.getElementById('modalUcMwOn').classList.toggle('selected', mwOn);
      } else {
        document.getElementById('modalCharCountSlider').value = currentRoom.settings ? currentRoom.settings.characterCount : 24;
        const s0 = currentRoom.settings || {};
        const mx0 = document.getElementById('modalMixSlider');
        if (mx0) { mx0.max = s0.characterCount || 24; mx0.value = s0.mixCount != null ? s0.mixCount : Math.floor((s0.characterCount || 24) / 2); }
        updateModalCharCount();
        syncSourceUI();
        syncPoolUI();
        syncMixUI();
      }
      if (currentRoom.visibility === 'private') {
        document.getElementById('modalPrivate').classList.add('selected');
        document.getElementById('modalPublic').classList.remove('selected');
      } else {
        document.getElementById('modalPublic').classList.add('selected');
        document.getElementById('modalPrivate').classList.remove('selected');
      }
      document.getElementById('settingsModal').classList.add('show');
    }

    // Max players for battle/race/blur rooms (lobby ⚙️, 🏠 Room tab)
    async function updateModalMultiMaxPlayers() {
      const slider = document.getElementById('modalMultiMaxSlider');
      if (!slider || !isHost || !currentRoom) return;
      const playerCount = Object.keys(currentRoom.players || {}).length;
      if (parseInt(slider.value) < playerCount) slider.value = playerCount; // can't go below who's already in
      document.getElementById('modalMultiMaxValue').textContent = slider.value;
      await database.ref('rooms/' + roomCode + '/maxPlayers').set(parseInt(slider.value));
      touchActivity();
    }

    function closeSettings() { document.getElementById('settingsModal').classList.remove('show'); }

    // Character pool source: 'generic' | 'favorites' | 'mix' (stored in room settings)
    function currentSource() {
      const settings = currentRoom ? currentRoom.settings : null;
      if (settings && settings.source) return settings.source;
      const accountCount = currentRoom ? Object.keys(currentRoom.accounts || {}).length : 0;
      return accountCount > 0 ? 'favorites' : 'generic'; // default for older rooms
    }

    function syncSourceUI() {
      const src = currentSource();
      const map = { favorites: 'modalSrcFavorites', generic: 'modalSrcGeneric', mix: 'modalSrcMix', watched: 'modalSrcWatched' };
      Object.values(map).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('selected', id === map[src]);
      });
      syncMixUI();
    }

    // 👀🎲 HC/Blur rooms swap the pool section to the Random/Watched pair
    function currentPoolMode() {
      const s = (currentRoom && currentRoom.settings) || {};
      return s.pool === 'watched' ? 'watched' : 'random';
    }
    function syncPoolUI() {
      const g = (currentRoom && currentRoom.game) || 'guesswho';
      const watchUi = g === 'hotcold' || g === 'blur';
      const gw = document.getElementById('modalPoolSrcGwGroup');
      const wg = document.getElementById('modalPoolSrcWatchGroup');
      if (gw) gw.style.display = watchUi ? 'none' : 'block';
      if (wg) wg.style.display = watchUi ? 'block' : 'none';
      const p = currentPoolMode();
      const e1 = document.getElementById('modalPoolRandom');
      const e2 = document.getElementById('modalPoolWatched');
      if (e1) e1.classList.toggle('selected', p === 'random');
      if (e2) e2.classList.toggle('selected', p === 'watched');
    }
    async function changePool(p) {
      if (!isHost || !currentRoom) return;
      await database.ref('rooms/' + roomCode + '/settings/pool').set(p === 'watched' ? 'watched' : 'random');
      touchActivity();
      syncPoolUI();
    }

    // 🌡️ HC Guess mode + Ranking visibility — same toggles as the create screen
    function syncHcSettingsUI() {
      const s = (currentRoom && currentRoom.settings) || {};
      const m = s.hcMode === 'individual' ? 'individual' : 'shared';
      const e1 = document.getElementById('modalHcModeShared');
      const e2 = document.getElementById('modalHcModeIndividual');
      if (e1) e1.classList.toggle('selected', m === 'shared');
      if (e2) e2.classList.toggle('selected', m === 'individual');
      const hidden = !!s.hcHideRank;
      const r1 = document.getElementById('modalHcRankShow');
      const r2 = document.getElementById('modalHcRankHide');
      if (r1) r1.classList.toggle('selected', !hidden);
      if (r2) r2.classList.toggle('selected', hidden);
    }
    async function changeHcMode(m) {
      if (!isHost || !currentRoom) return;
      await database.ref('rooms/' + roomCode + '/settings/hcMode').set(m === 'individual' ? 'individual' : 'shared');
      touchActivity();
      syncHcSettingsUI();
    }
    async function changeHcRank(h) {
      if (!isHost || !currentRoom) return;
      await database.ref('rooms/' + roomCode + '/settings/hcHideRank').set(!!h);
      touchActivity();
      syncHcSettingsUI();
    }

    // 🔀 Mix split bar (Guess Who games, pool = Mix) — reads/writes settings/mixCount
    function syncMixUI() {
      const g = (currentRoom && currentRoom.game) || 'guesswho';
      const gwFam = g === 'guesswho' || g === 'battle' || g === 'race';
      const s = (currentRoom && currentRoom.settings) || {};
      const block = document.getElementById('modalMixBlock');
      const show = gwFam && currentSource() === 'mix';
      if (block) block.style.display = show ? 'block' : 'none';
      if (!show) return;
      const total = s.characterCount || 24;
      const slider = document.getElementById('modalMixSlider');
      if (slider) {
        slider.max = total;
        const v = clampN(s.mixCount != null ? s.mixCount : Math.floor(total / 2), 0, total, Math.floor(total / 2));
        if (parseInt(slider.value, 10) !== v) slider.value = v;
      }
      const lab = document.getElementById('modalMixLabel');
      if (lab) lab.textContent = tPO('mix_label', { v: slider ? parseInt(slider.value, 10) || 0 : 0, r: total - (slider ? parseInt(slider.value, 10) || 0 : 0) });
    }
    async function updateModalMix() {
      if (!currentRoom) return;
      const s = currentRoom.settings || {};
      const total = s.characterCount || 24;
      const v = clampN(document.getElementById('modalMixSlider').value, 0, total, Math.floor(total / 2));
      const lab = document.getElementById('modalMixLabel');
      if (lab) lab.textContent = tPO('mix_label', { v: v, r: total - v });
      if (currentRoom.settings) await database.ref('rooms/' + roomCode + '/settings/mixCount').set(v);
      touchActivity();
    }

    async function changeSource(type) {
      if (!isHost || !currentRoom) return;
      if (type !== 'generic' && Object.keys(currentRoom.accounts || {}).length === 0) {
        showNotification('No AniList account in this room — it will use the generic pool.');
      }
      await database.ref('rooms/' + roomCode + '/settings/source').set(type);
      touchActivity();
      syncSourceUI();
    }

    async function changeVisibility(type) {
      document.querySelectorAll('#modalPrivate, #modalPublic').forEach(opt => opt.classList.remove('selected'));
      const target = event ? event.currentTarget : document.getElementById('modalPrivate');
      if (target) target.classList.add('selected');
      await database.ref('rooms/' + roomCode + '/visibility').set(type);
      touchActivity();
      document.getElementById('lobbyRoomType').textContent = type === 'private' ? 'Private' : 'Public';
    }

    function updateModalCharCount() {
      const value = document.getElementById('modalCharCountSlider').value;
      document.getElementById('modalCharCountValue').textContent = value;
      if (currentRoom && currentRoom.settings) {
        database.ref('rooms/' + roomCode + '/settings/characterCount').set(parseInt(value));
      }
      const mixSlider = document.getElementById('modalMixSlider');
      if (mixSlider) {
        mixSlider.max = value;
        if (parseInt(mixSlider.value, 10) > parseInt(value, 10)) mixSlider.value = Math.floor(value / 2);
      }
      syncMixUI();
    }

    // Undercover room settings (lobby modal)
    async function updateModalUcMaxPlayers() {
      const slider = document.getElementById('modalUcMaxSlider');
      const playerCount = currentRoom ? Object.keys(currentRoom.players || {}).length : 1;
      if (parseInt(slider.value) < playerCount) slider.value = playerCount; // can't go below who's already in
      document.getElementById('modalUcMaxValue').textContent = slider.value;
      if (isHost && currentRoom && currentRoom.game === 'undercover') {
        await database.ref('rooms/' + roomCode + '/maxPlayers').set(parseInt(slider.value));
        touchActivity();
      }
    }
    async function changeUcMrWhite(on) {
      const mwOn = !!on;
      document.getElementById('modalUcMwOff').classList.toggle('selected', !mwOn);
      document.getElementById('modalUcMwOn').classList.toggle('selected', mwOn);
      if (!isHost || !currentRoom || currentRoom.game !== 'undercover') return;
      await database.ref('rooms/' + roomCode + '/settings/mrWhite').set(mwOn);
      touchActivity();
    }

    // Race room settings (lobby modal): hunter lives & question budget
    async function updateModalRaceLives() {
      const v = parseInt(document.getElementById('modalRaceLivesSlider').value);
      document.getElementById('modalRaceLivesValue').textContent = v;
      if (isHost && currentRoom && currentRoom.game === 'race') { await database.ref('rooms/' + roomCode + '/settings/raceLives').set(v); touchActivity(); }
    }
    async function updateModalRaceQuestions() {
      const v = parseInt(document.getElementById('modalRaceQuestionsSlider').value);
      document.getElementById('modalRaceQuestionsValue').textContent = v;
      if (isHost && currentRoom && currentRoom.game === 'race') { await database.ref('rooms/' + roomCode + '/settings/raceQuestions').set(v); touchActivity(); }
    }
    // Blur Guess room settings (lobby modal): number of rounds
    async function updateModalBgRounds() {
      const v = parseInt(document.getElementById('modalBgRoundsSlider').value);
      document.getElementById('modalBgRoundsValue').textContent = v;
      if (isHost && currentRoom && currentRoom.game === 'blur') { await database.ref('rooms/' + roomCode + '/settings/bgRounds').set(v); touchActivity(); }
    }
    async function updateModalBgStageSec() {
      const v = parseInt(document.getElementById('modalBgStageSecSlider').value);
      document.getElementById('modalBgStageSecValue').textContent = v + 's';
      if (isHost && currentRoom && currentRoom.game === 'blur') { await database.ref('rooms/' + roomCode + '/settings/bgStageSec').set(v); touchActivity(); }
    }
    async function changeBgMode(mode) {
      const m = mode === 'covers' ? 'covers' : 'characters';
      document.getElementById('modalBgModeChars').classList.toggle('selected', m === 'characters');
      document.getElementById('modalBgModeCovers').classList.toggle('selected', m === 'covers');
      if (isHost && currentRoom && currentRoom.game === 'blur') { await database.ref('rooms/' + roomCode + '/settings/bgMode').set(m); touchActivity(); }
    }

    // Seats for a game given the room's current size: duels stay 2, Hot &
    // Cold keeps 2-6, the real multi games keep 3-8 (defaults 6 / 2 when unset).
    function seatsForGame(g) {
      if (g === 'undercover' || g === 'battle' || g === 'race' || g === 'blur') return ((currentRoom.maxPlayers || 0) >= 3) ? currentRoom.maxPlayers : 6;
      if (g === 'hotcold') return Math.min(6, Math.max(2, currentRoom.maxPlayers || 2));
      return 2;
    }

    // ===== 🎮 CHANGE THE GAME FROM THE LOBBY (host) =====
    function modalGameChanged() {
      const sel = document.getElementById('modalGameSelect');
      if (!sel || !isHost || !currentRoom) return;
      const cur = currentRoom.game || 'guesswho';
      if (currentRoom.state && currentRoom.state !== 'lobby') { sel.value = cur; syncModalGameCards(); showNotification('Finish the current game first — you can switch games from the lobby.'); return; }
      const newGame = sel.value;
      if (newGame === cur) return;
      sel.value = cur; // revert until confirmed
      syncModalGameCards();
      const seats = seatsForGame(newGame);
      const seatedCount = Object.keys(currentRoom.players || {}).length;
      const overflow = Math.max(0, seatedCount - seats);
      showInteraction('Change the game?', tPO('switch_game_q', { g: '<b>' + (GAME_LABELS[newGame] || newGame) + '</b>' }) + '<br><small>Everyone stays in the room — ready states reset.' + (overflow ? '<br>' + tPO('queue_warn', { s: seats, o: '<b>' + overflow + '</b>' }) : '') + '</small>', [
        { label: 'Cancel', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: ic('gamepad') + ' Switch', onclick: async () => { closeInteraction(); await switchRoomGame(newGame); }, class: 'warning' }
      ]);
    }
    async function switchRoomGame(newGame) {
      if (!isHost || !currentRoom || !roomCode) return;
      const oldGame = currentRoom.game || 'guesswho';
      if (newGame === oldGame) return;
      const newMax = seatsForGame(newGame);
      const s = currentRoom.settings || {};
      const updates = { game: newGame, maxPlayers: newMax, restarts: null };
      // Per-game settings defaults (Undercover rooms have no pool settings…)
      updates['settings/characterCount'] = s.characterCount || 24;
      if (s.mixCount == null) updates['settings/mixCount'] = Math.floor((s.characterCount || 24) / 2);
      if (!s.source) updates['settings/source'] = Object.keys(currentRoom.accounts || {}).length ? 'favorites' : 'generic';
      if (!s.pool) updates['settings/pool'] = 'random'; // 🎲 HC/Blur default: full website pool
      if (newGame === 'undercover' && s.mrWhite == null) updates['settings/mrWhite'] = false;
      if (newGame === 'race') {
        updates['settings/raceLives'] = s.raceLives || RACE_DEFAULT_LIVES;
        updates['settings/raceQuestions'] = s.raceQuestions || RACE_DEFAULT_QUESTIONS;
      }
      if (newGame === 'blur') {
        updates['settings/bgRounds'] = s.bgRounds || BLUR_ROUNDS_DEFAULT;
        updates['settings/bgStageSec'] = s.bgStageSec || BLUR_STAGE_SEC;
        updates['settings/bgMode'] = s.bgMode || 'characters';
      }
      // Fewer seats in the new mode → extra players wait in the ⏳ queue
      const seated = Object.values(currentRoom.players || {}).filter(p => p && p.id);
      const ordered = seated.filter(p => p.isHost).concat(seated.filter(p => !p.isHost)); // host keeps a seat
      const demote = ordered.slice(newMax);
      const now = Date.now();
      demote.forEach((p, i) => {
        updates['players/' + p.id] = null;
        updates['queue/' + p.id] = { id: p.id, name: p.name || 'Player', avatar: p.avatar || '', joinedAt: now + i };
      });
      seated.forEach(p => { if (!demote.some(d => d.id === p.id)) updates['players/' + p.id + '/ready'] = false; });
      await database.ref('rooms/' + roomCode).update(updates);
      touchActivity();
      showNotification('Game switched to ' + (GAME_LABELS[newGame] || newGame) + (demote.length ? ' — ' + demote.map(p => p.name || '?').join(', ') + ' moved to the queue' : '') + '!');
      // The lobby ⚙️ modal triggered this — refresh it INSTANTLY: the new
      // game's options appear without closing/reopening. Local echo of the
      // write; the listener's full snapshot lands right after.
      try {
        currentRoom.game = newGame;
        if (document.getElementById('settingsModal').classList.contains('show')) openRoomSettings('game');
      } catch (e) {}
    }

    // ============================================================
    // ===== 🌡️ GUESS WHO — HOT & COLD (multiplayer, 2-6) ==========
    // ============================================================
    // One player HIDES any character from the FULL pool; every other
    // player hunts SIMULTANEOUSLY, each in their own lane — proposing
    // characters one at a time while the hider scores each proposal
    // 0-100 from a queue (exact hits auto-score 100, no manual pass).
    // Each seeker stops when THEY find it (or bust at the attempt
    // cap); the round closes when every active lane is done. Everyone
    // hides once (full rotation); your score = the TOTAL NUMBER of
    // guesses you made — the LOWEST count wins, a tie at the bottom is
    // a draw (golf scoring).
    const HC_ATTEMPT_CAP = 100; // a lane allows up to 100 proposals (effectively unlimited — golf scoring charges 1 per guess)
    // Rotation seats (deal order — everyone hides once, in this order)
    function hcOrderOf(room) {
      const r = room || currentRoom; const hc = (r && r.hc) || {};
      return Array.isArray(hc.order) && hc.order.length ? hc.order : Object.keys((r && r.players) || {});
    }
    // Seats still in the match (not returned to the lobby mid-game)
    function hcActiveSeats(room) {
      const r = room || currentRoom; const hc = (r && r.hc) || {}; const players = (r && r.players) || {};
      return hcOrderOf(r).filter(pid => players[pid] && players[pid].outInGame !== hc.gameId);
    }
    const hcPids = (room) => hcActiveSeats(room); // seats eligible for Play-Again votes
    // Classement winner: LOWEST cumulative guess count among the ACTIVE
    // seats (golf scoring — every guess adds 1, fewest total takes it)
    function hcLowestWinner(seats, totals) {
      let best = null; let tied = false;
      (seats || []).forEach(pid => {
        const t = (totals || {})[pid] || 0;
        if (best == null || t < best.t) { best = { pid: pid, t: t }; tied = false; }
        else if (t === best.t) tied = true;
      });
      if (!best) return 'draw';
      return tied ? 'draw' : best.pid;
    }

    // 🎯 SHARED guesses score by POINTS (the seeker banks the hider's score),
    // so the winner is the BIGGEST total; individual mode keeps golf scoring
    // (fewest guesses wins).
    function hcPointsWinner(seats, totals) {
      let best = null; let tied = false;
      (seats || []).forEach(pid => {
        const t = (totals || {})[pid] || 0;
        if (best == null || t > best.t) { best = { pid: pid, t: t }; tied = false; }
        else if (t === best.t) tied = true;
      });
      if (!best) return 'draw';
      return tied ? 'draw' : best.pid;
    }
    // Effective guess mode for a room. Shared guesses are a 3+ players mode:
    // with only 2 seats (1 hider + 1 seeker) a shared log is pointless, so the
    // match always falls back to 'individual'.
    function hcModeOfRoom(r) {
      const s = ((r || {}).settings) || {};
      const n = Object.keys((r || {}).players || {}).length;
      if (n > 0 && n < 3) return 'individual';
      return s.hcMode === 'individual' ? 'individual' : 'shared';
    }
    function hcWinnerOf(seats, totals, mode) {
      return mode === 'individual' ? hcLowestWinner(seats, totals) : hcPointsWinner(seats, totals);
    }

    // 🔎 Full searchable pool — same sources as Blur Guess (generic /
    // favorites / mix from the room settings + synced AniList accounts),
    // CHARACTERS only, deduped by id AND by name so ties look clean.
    // 👀 Union of every synced account's watched list, honoring each owner's
    // own status checkboxes (ws). Memoized — the HC autocomplete re-reads the
    // pool on every keystroke, so we only rebuild when accounts actually change.
    let watchSetCacheKey = ''; let watchSetCache = null;
    function roomWatchSet(room) {
      const accounts = (room && room.accounts) || {};
      const key = Object.keys(accounts).map(k => {
        const a = accounts[k] || {};
        return k + ':' + ((a.watched || []).length) + ':' + ((Array.isArray(a.ws) && a.ws.length ? a.ws : WATCH_STATUS_DEFAULT).join(','));
      }).join('|');
      if (watchSetCache && watchSetCacheKey === key) return watchSetCache;
      const ids = {}; const titles = {};
      Object.keys(accounts).forEach(k => {
        const a = accounts[k] || {};
        const ws = Array.isArray(a.ws) && a.ws.length ? a.ws : WATCH_STATUS_DEFAULT;
        (a.watched || []).forEach(w => {
          if (!w || w.i == null || !watchStatusOk(w.s, ws)) return;
          ids[w.i] = 1;
          const tn = bgNorm(w.t); if (tn) titles[tn] = 1;
          const en = bgNorm(w.e); if (en) titles[en] = 1;
        });
      });
      watchSetCacheKey = key;
      watchSetCache = { ids: ids, titles: titles, size: Object.keys(ids).length };
      return watchSetCache;
    }

    function dedupPoolChars(list) {
      const seenId = {}, seenName = {}; const out = [];
      (list || []).forEach(c => {
        if (!c || c.id == null || !c.name) return;
        const nk = bgNorm(c.name);
        if (seenId[c.id] || (nk && seenName[nk])) return;
        seenId[c.id] = 1; if (nk) seenName[nk] = 1;
        out.push(bgRoundEntry(c));
      });
      return out;
    }

    // 🔍 "Watched" character pool: the generic characters whose anime is on at
    // least one synced account's watched list (checked statuses only).
    function watchedPoolChars(room) {
      const wset = roomWatchSet(room);
      const generic = (typeof GENERIC_CHARACTERS !== 'undefined' && Array.isArray(GENERIC_CHARACTERS)) ? GENERIC_CHARACTERS : [];
      return dedupPoolChars(generic.filter(c => c && wset.titles[bgNorm(c.series || '')]));
    }

    // 🧺 shared pool for every Hot & Cold tool (hider secret pick + seekers'
    // autocomplete): settings/pool 'watched' → only watched-anime characters;
    // 'random' (default) → the full website pool.
    function hcPoolChars() {
      const r = currentRoom || {};
      const s = r.settings || {};
      const generic = (typeof GENERIC_CHARACTERS !== 'undefined' && Array.isArray(GENERIC_CHARACTERS)) ? GENERIC_CHARACTERS : [];
      return s.pool === 'watched' ? watchedPoolChars(r) : dedupPoolChars(generic);
    }

    // Ranked autocomplete over the whole pool: exact name 0/1 → starts-with
    // 2/3 → substring 4/5 (main name vs alias) → 📺 series match 6. Top 8,
    // ties keep pool order (AniList popularity — famous chars surface first).
    function hcSearch(q) {
      const g = bgNorm(q);
      if (!g) return [];
      const hits = [];
      hcPoolChars().forEach(c => {
        let best = -1;
        bgNamesOf(c).forEach((nm, i) => {
          const n = bgNorm(nm);
          if (!n) return;
          const isMain = i === 0;
          let rank = -1;
          if (n === g) rank = isMain ? 0 : 1;
          else if (n.indexOf(g) === 0) rank = isMain ? 2 : 3;
          else if (n.indexOf(g) !== -1) rank = isMain ? 4 : 5;
          if (rank >= 0 && (best < 0 || rank < best)) best = rank;
        });
        if (best < 0) {
          const keys = bgSeriesKeys(c.series);
          for (let si = 0; si < keys.length; si++) {
            const key = keys[si];
            if (key && (key.indexOf(g) !== -1 || (g.length >= 3 && g.indexOf(key) !== -1))) { best = 6; break; }
          }
        }
        if (best >= 0) hits.push({ c: c, rank: best });
      });
      hits.sort((a, b) => a.rank - b.rank);
      return hits.slice(0, 8).map(h => h.c);
    }

    // ----- autocomplete UI (shared by the hider's PICK input & the
    // guesser's GUESS input; a tap STAGES the character — never confirms) ---
    let hcWired = false;
    const hcSug = {
      pick: { inp: 'hcPickInput', box: 'hcPickSuggest', stagedBox: 'hcPickStaged', hits: [], idx: -1 },
      guess: { inp: 'hcGuessInput', box: 'hcGuessSuggest', stagedBox: 'hcGuessStaged', hits: [], idx: -1 }
    };
    let hcStagedPick = null;   // character the HIDER is about to hide
    let hcStagedGuess = null;  // character the GUESSER is about to propose
    let hcLastPhaseKey = '';   // phase watcher: clears stale local UI on changes
    let hcLastLaneKey = '';    // my-lane watcher: wipes the guess box when the lane advances
    let hcAnsKey = '';         // pending-guess watcher: recentres the slider

    function hcWireOnce() {
      if (hcWired) return;
      ['pick', 'guess'].forEach(kind => {
        const conf = hcSug[kind];
        const inp = document.getElementById(conf.inp);
        if (!inp) return;
        inp.addEventListener('input', () => { hcClearStage(kind); hcRenderSug(kind); });
        inp.addEventListener('keydown', (e) => {
          const box = document.getElementById(conf.box);
          const open = box && box.classList.contains('show');
          if (e.key === 'ArrowDown') { if (open) { e.preventDefault(); hcSugMove(kind, 1); } }
          else if (e.key === 'ArrowUp') { if (open) { e.preventDefault(); hcSugMove(kind, -1); } }
          else if (e.key === 'Escape') { hcHideSug(kind); }
          else if (e.key === 'Enter') { e.preventDefault(); hcSugAccept(kind); }
        });
        inp.addEventListener('blur', () => setTimeout(() => hcHideSug(kind), 150)); // lets row taps land first
      });
      hcWired = true;
    }
    function hcHideSug(kind) {

      const conf = hcSug[kind];
      const box = document.getElementById(conf.box);
      if (box) { box.classList.remove('show'); box.innerHTML = ''; }
      conf.hits = []; conf.idx = -1;
    }
    // ✕ Clear the seeker's guess input (little cross at the end of the typing space)
    function hcClearGuessInput() {
      const inp = document.getElementById('hcGuessInput');
      if (!inp) return;
      inp.value = '';
      hcClearStage('guess');
      hcHideSug('guess');
      try { inp.focus(); } catch (_e) {}
    }
    function hcRenderSug(kind) {
      const conf = hcSug[kind];
      const inp = document.getElementById(conf.inp);
      const box = document.getElementById(conf.box);
      if (!inp || !box) return;
      if (!bgNorm(inp.value)) { hcHideSug(kind); return; }
      const hits = hcSearch(inp.value);
      if (!hits.length) { hcHideSug(kind); return; }
      conf.hits = hits; conf.idx = -1;
      box.innerHTML = '';
      hits.forEach(c => {
        const row = document.createElement('div');
        row.className = 'bg-sug-row';
        const img = document.createElement('img');
        img.className = 'bg-sug-img'; img.src = c.image || ''; img.alt = ''; img.loading = 'lazy';
        const nm = document.createElement('span');
        nm.className = 'bg-sug-name'; nm.textContent = c.name || '';
        row.appendChild(img); row.appendChild(nm);
        // 📱 Tap-guard (scroll-friendly): a row is picked only when the finger
        // LIFTS within 12px of where it landed (a real tap, not a swipe).
        row.addEventListener('pointerdown', (e) => { e.preventDefault(); row._psY = e.clientY; row._psX = e.clientX; }); // preventDefault: no ghost click through the closing dropdown
        row.addEventListener('pointerup', (e) => {
          if (row._psY == null) return;
          const moved = Math.abs(e.clientY - row._psY) + Math.abs(e.clientX - row._psX);
          row._psY = null; row._psX = null;
          if (moved < 12) hcPickSug(kind, c);
        });
        box.appendChild(row);
      });
      box.classList.add('show');
    }
    function hcPickSug(kind, c) {
      const conf = hcSug[kind];
      const inp = document.getElementById(conf.inp);
      if (inp) inp.value = c.name || '';
      hcHideSug(kind);
      hcStage(kind, c);
    }
    function hcPaintSugSel(kind) {
      const conf = hcSug[kind];
      const box = document.getElementById(conf.box);
      if (!box) return;
      for (let i = 0; i < box.children.length; i++) box.children[i].classList.toggle('active', i === conf.idx);
      const row = box.children[conf.idx];
      if (row && row.scrollIntoView) row.scrollIntoView({ block: 'nearest' });
    }
    function hcSugMove(kind, d) {
      const conf = hcSug[kind];
      if (!conf.hits.length) return;
      conf.idx = (conf.idx + d + conf.hits.length) % conf.hits.length;
      hcPaintSugSel(kind);
    }
    function hcSugAccept(kind) {
      const conf = hcSug[kind];
      if (conf.idx >= 0 && conf.hits[conf.idx]) { hcPickSug(kind, conf.hits[conf.idx]); return; }
      if (conf.hits.length) hcPickSug(kind, conf.hits[0]);
    }
    function hcStage(kind, c) {
      const conf = hcSug[kind];
      if (kind === 'pick') hcStagedPick = c; else hcStagedGuess = c;
      const box = document.getElementById(conf.stagedBox);
      if (!box) return;
      const img = document.getElementById(conf.stagedBox + 'Img');
      const nm = document.getElementById(conf.stagedBox + 'Name');
      if (img) img.src = c.image || '';
      if (nm) nm.textContent = c.name || '';
      box.style.display = '';
    }
    function hcClearStage(kind) {
      if (kind === 'pick') hcStagedPick = null; else hcStagedGuess = null;
      const box = document.getElementById(hcSug[kind].stagedBox);
      if (box) box.style.display = 'none';
    }

    // ----- the DEAL: every seated player plays (2-6). The hiding rotation
    // is the shuffled seat order; a rematch keeps rotating (the old match's
    // "next up" seat hides first). Everyone hides exactly once.
    let hcLaunching = false;
    async function hotcoldDeal() {
      if (hcLaunching) return;
      hcLaunching = true;
      try {
        const snap = await database.ref('rooms/' + roomCode).once('value');
        const fresh = snap.val() || currentRoom || {};
        const pids = Object.keys(fresh.players || {});
        if (pids.length < 2) { showNotification('Hot & Cold needs at least 2 players!'); return; }
        // shared asked with only 2 players → the match runs individual
        if (((fresh.settings || {}).hcMode || 'shared') !== 'individual' && hcModeOfRoom(fresh) === 'individual') {
          showNotification('Shared guesses need 3+ players — this match runs in Individual!', 4000);
        }
        const order = pids.slice();
        for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; }
        const prev = fresh.hc || {};
        const startIdx = prev.nextStarter ? order.indexOf(prev.nextStarter) : -1;
        if (startIdx > 0) { const s0 = order.splice(startIdx, 1)[0]; order.unshift(s0); }
        const sk = {}; order.forEach(pid => { if (pid !== order[0]) sk[pid] = { a: 0, s: 'on' }; });
        const totals = {}; order.forEach(pid => { totals[pid] = 0; });
        const gameId = Date.now();
        await database.ref('rooms/' + roomCode).update({
          state: 'playing', characters: null, selections: null, restarts: null, winner: null,
          hc: {
            gameId: gameId, round: 1, phase: 'select', order: order, hider: order[0],
            secret: null, queue: null, guesses: null, sk: sk, totals: totals,
            rounds: null, winner: null, forfeit: null, nextStarter: null
          }
        });
        touchActivity();
      } finally { hcLaunching = false; }
    }

    function hcRandomPick() {
      const pool = hcPoolChars();
      if (!pool.length) { showNotification('Character pool is empty!'); return; }
      hcPickSug('pick', pool[Math.floor(Math.random() * pool.length)]);
    }

    // 🧽 small input-side eraser: wipe the typing box + close the suggestions
    function hcClearPick() {
      const inp = document.getElementById('hcPickInput');
      if (inp) { inp.value = ''; inp.focus(); }
      const sug = document.getElementById('hcPickSuggest');
      if (sug) { sug.innerHTML = ''; sug.classList.remove('show'); }
    }

    // ===== 👀 SPECTATOR MODE =====
    // Queued visitors (no free seat / game running) auto-spectate the live
    // game: a read-only screen built from PUBLIC info only. Flagging the
    // queue entry `away=true` parks you in the lobby instead (never promoted).
    async function specSetAway(on) {
      if (!roomCode) return;
      await database.ref('rooms/' + roomCode + '/queue/' + playerId + '/away').set(on ? true : null);
      touchActivity();
    }
    async function specWaitInLobby() {
      try { await specSetAway(true); } catch (e) {}
      showScreen('lobbyScreen');
    }
    // Lobby toggle: seated → park AFK in the queue; queued → flip away on/off
    async function toggleAfk() {
      if (!currentRoom || !roomCode) return;
      const me = (currentRoom.players || {})[playerId];
      const meQ = (currentRoom.queue || {})[playerId];
      if (me && !meQ) {
        if (currentRoom.state && currentRoom.state !== 'lobby') { showNotification('Finish your game first — AFK parks you from the lobby.'); return; }
        if (me.isHost && Object.keys(currentRoom.players || {}).length < 2) { showNotification('You are the last player — leave the room instead.'); return; }
        const upd = {};
        upd['queue/' + playerId] = { id: playerId, name: me.name || playerName, avatar: me.avatar || '', joinedAt: Date.now(), away: true };
        upd['players/' + playerId] = null;
        await database.ref('rooms/' + roomCode).update(upd);
        touchActivity();
        showNotification('You are parked AFK — watching only, no seat reserved.');
      } else if (meQ) {
        if (meQ.away) { await specSetAway(false); showNotification('Back in the queue — you\'ll auto-join the next free seat!'); }
        else { await specSetAway(true); showNotification('Parked AFK — you will NOT auto-join the next seat.'); }
      }
    }

    // Public, read-only snapshot of the running game (never a secret in sight)
    function renderSpectate() {
      const r = currentRoom || {};
      const players = r.players || {};
      const s = r.settings || {};
      const g = r.game || 'guesswho';
      const nameEl = document.getElementById('specGameName');
      const phaseEl = document.getElementById('specPhase');
      const boardEl = document.getElementById('specBoard');
      const scoreEl = document.getElementById('specScore');
      const feedEl = document.getElementById('specFeed');
      if (!nameEl || !scoreEl || !feedEl) return;
      nameEl.innerHTML = ic(GAME_ICONS[g] || 'gamepad') + ' ' + (GAME_LABELS[g] || g);
      const nameOf = pid => escapeHtml(((players[pid] || {}).name) || '…');
      const av = pid => avatarCircle(((players[pid] || {}).avatar) || '', 'hc-av');
      const rows = [];
      const feedRows = [];
      let phaseTxt = '';
      if (boardEl) { boardEl.style.display = 'none'; boardEl.innerHTML = ''; }

      if (g === 'blur') {
        const bg = r.bg || {};
        const rounds = bg.rounds || [];
        const idx = Math.min(bg.roundIdx || 0, Math.max(0, rounds.length - 1));
        if (bg.phase === 'playing' && rounds.length) phaseTxt = (window.t ? t('Round') : 'Round') + ' ' + (idx + 1) + '/' + rounds.length + ' — ' + (window.t ? t('stage') : 'stage') + ' ' + (bg.stage || 1) + '/5';
        else phaseTxt = window.t ? t('Waiting for the next deal…') : 'Waiting for the next deal…';
        // 👁️ the blurred picture is public to every player — show it live too
        if (bg.phase === 'playing' && boardEl && rounds[idx] && rounds[idx].image) {
          const st = Math.max(1, Math.min(5, bg.stage || 1));
          const blurPx = [22, 16, 10, 5, 1.5][st - 1];
          boardEl.style.display = 'block';
          boardEl.innerHTML = '';
          const img = document.createElement('img');
          img.className = 'spec-blur-img'; img.src = rounds[idx].image; img.alt = ''; img.loading = 'lazy';
          img.style.filter = 'blur(' + blurPx + 'px)';
          boardEl.appendChild(img);
        }
        const sc = bg.scores || {};
        Object.keys(sc).filter(pid => players[pid]).sort((a, b) => ((sc[b] || 0) - (sc[a] || 0)) || nameOf(a).localeCompare(nameOf(b)))
          .forEach((pid, i) => rows.push('<div class="player-card"><div class="player-head"><span class="queue-pos">' + (i + 1) + '.</span>' + av(pid) + '<div class="player-info"><div class="name">' + nameOf(pid) + '</div></div></div><span class="me-pts">' + (sc[pid] || 0) + '</span></div>'));
        const log = bg.log || {};
        Object.keys(log).sort().slice(-8).forEach(k => { const e = log[k] || {}; if (e.txt) feedRows.push(String(e.txt)); });
      } else if (g === 'hotcold') {
        const hc = r.hc || {};
        const order = Array.isArray(hc.order) ? hc.order : [];
        phaseTxt = 'R' + (hc.round || 1) + '/' + order.length + ' — ' + tPO('hc_hidden_by', { n: nameOf(hc.hider) }) + (hc.phase === 'matchEnd' ? ' · ' + (window.t ? t('Match over') : 'Match over') : '');
        if (!s.hcHideRank) {
          const totals = hc.totals || {};
          const dir = s.hcMode === 'individual' ? 1 : -1;
          order.filter(pid => players[pid]).sort((a, b) => (((totals[a] || 0) - (totals[b] || 0)) * dir) || nameOf(a).localeCompare(nameOf(b)))
            .forEach((pid, i) => rows.push('<div class="player-card"><div class="player-head"><span class="queue-pos">' + (i + 1) + '.</span>' + av(pid) + '<div class="player-info"><div class="name">' + nameOf(pid) + '</div></div></div><span class="me-pts">' + (totals[pid] || 0) + '</span></div>'));
        } else {
          rows.push('<div class="player-card"><div class="player-info"><div class="status">' + (window.t ? t('Ranking hidden until match end') : 'Ranking hidden until match end') + '</div></div></div>');
        }
        if (hcModeOfRoom(r) === 'individual') {
          feedRows.push(window.t ? t('Individual guesses this match — proposals stay private.') : 'Individual guesses this match — proposals stay private.');
        } else {
          const gs = hc.guesses || {};
          Object.keys(gs).filter(k => gs[k] && gs[k].r === hc.round).sort().slice(-8)
            .forEach(k => { const gg = gs[k] || {}; feedRows.push(nameOf(gg.by) + ' → ' + escapeHtml(gg.name || '?') + ' · ' + (gg.score != null ? gg.score : '?')); });
          if (!feedRows.length) feedRows.push(window.t ? t('Nothing yet') : 'Nothing yet');
        }
      } else if (g === 'battle') {
        const br = r.br || {};
        phaseTxt = br.phase ? String(br.phase) : '';
        const pts = br.points || {};
        Object.keys(pts).filter(pid => players[pid]).sort((a, b) => ((pts[b] || 0) - (pts[a] || 0)) || nameOf(a).localeCompare(nameOf(b)))
          .forEach((pid, i) => rows.push('<div class="player-card"><div class="player-head"><span class="queue-pos">' + (i + 1) + '.</span>' + av(pid) + '<div class="player-info"><div class="name">' + nameOf(pid) + '</div></div></div><span class="me-pts">' + (pts[pid] || 0) + '</span></div>'));
      } else if (g === 'race') {
        const rc = r.rc || {};
        phaseTxt = (rc.phase ? String(rc.phase) : '') + ' — ' + tPO('hc_hidden_by', { n: nameOf(rc.targetPid) });
        const lives = rc.livesLeft || {};
        Object.keys(lives).filter(pid => players[pid]).sort((a, b) => nameOf(a).localeCompare(nameOf(b)))
          .forEach(pid => rows.push('<div class="player-card"><div class="player-head">' + av(pid) + '<div class="player-info"><div class="name">' + nameOf(pid) + '</div></div></div><span class="me-pts">' + '❤ ' + (lives[pid] != null ? lives[pid] : '?') + '</span></div>'));
      } else if (g === 'undercover') {
        const uc = r.uc || {};
        phaseTxt = String(uc.phase || '');
        const alive = ucAlivePids(r);
        alive.forEach(pid => { if (players[pid]) rows.push('<div class="player-card"><div class="player-head">' + av(pid) + '<div class="player-info"><div class="name">' + nameOf(pid) + '</div><div class="status">' + (window.t ? t('in play') : 'in play') + '</div></div></div></div>'); });
        const clues = uc.clues || {};
        Object.keys(clues).forEach(pid => { if (players[pid] && clues[pid]) feedRows.push(nameOf(pid) + ': ' + escapeHtml(String(clues[pid]))); });
      } else { // guesswho — public question history only
        phaseTxt = String(r.state || '');
        (r.questionHistory || []).slice(-8).forEach(item => { if (item) feedRows.push('Q: ' + escapeHtml(String(item.question || '')) + ' → ' + escapeHtml(String(item.answer || ''))); });
        if (!feedRows.length) feedRows.push(window.t ? t('Nothing yet') : 'Nothing yet');
      }
      if (rows.length === 0) rows.push('<p style="text-align:center;color:var(--muted);">' + (window.t ? t('Waiting for the next deal…') : 'Waiting for the next deal…') + '</p>');
      if (phaseEl) phaseEl.textContent = phaseTxt;
      scoreEl.innerHTML = rows.join('');
      feedEl.innerHTML = '';
      feedRows.reverse().forEach(txt => {
        const d = document.createElement('div'); d.className = 'hc-row';
        d.innerHTML = '<span class="hc-gname">' + txt + '</span>';
        feedEl.appendChild(d);
      });
    }

    // 👁️ HIDER: hide the staged character → every seeker's lane opens
    async function hcConfirmHide() {
      const hc = (currentRoom && currentRoom.hc) || {};
      if (!hcStagedPick) return;
      if (hc.phase !== 'select' || playerId !== hc.hider) { showNotification('Wait for your hiding turn!'); return; }
      await database.ref('rooms/' + roomCode + '/hc').update({ secret: hcStagedPick, phase: 'play' });
      touchActivity();
      showNotification('Secret hidden — the hunt begins!');
    }

    // 🔍 SEEKER: propose the staged character — one proposal in flight per
    // seeker. A DIRECT HIT (exact character) auto-scores 100 instantly, no
    // queue, no slider — the hider can't botch or stall a sure hit.
    async function hcConfirmGuess() {
      const hc = (currentRoom && currentRoom.hc) || {};
      if (!hcStagedGuess) return;
      if (hc.phase !== 'play' || playerId === hc.hider) return;
      const mySk = (hc.sk || {})[playerId];
      if (!mySk || (mySk.s || 'on') !== 'on') { showNotification('Your lane is already closed for this secret!'); return; }
      const queue = hc.queue || {};
      const mine = Object.keys(queue).find(k => queue[k] && queue[k].by === playerId);
      if (mine) { showNotification('One proposal at a time — yours is still waiting for a score!'); return; }
      const entry = hcStagedGuess;
      const sec = hc.secret || {};
      const directHit = (entry.id != null && sec.id != null && entry.id === sec.id)
        || (!!bgNorm(entry.name || '') && bgNorm(entry.name || '') === bgNorm(sec.name || ''));
      if (directHit) { // 🎯 auto-win: skip the scoring slider entirely
        await hcAwardScore(playerId, entry, 100, null);
        showNotification(tPO('hc_direct', { n: sec.name || entry.name || '?' }), 5000);
        return;
      }
      await database.ref('rooms/' + roomCode + '/hc/queue').push({
        by: playerId, id: (entry.id != null ? entry.id : null),
        name: entry.name || '?', image: entry.image || '', at: Date.now()
      });
      touchActivity();
    }

    // 📥 HIDER: the proposals queue — tap a card to load it into the slider
    let hcQueueSel = null;
    function hcQueueClick(k) { hcQueueSel = k; updateHotcold(); }

    // 🎚️ live slider label + color (ice blue → warm yellow → burning red)
    function hcScoreChanged() {
      const s = document.getElementById('hcScoreSlider');
      const v = document.getElementById('hcScoreValue');
      const box = document.getElementById('hcScoreBox');
      if (!s || !v) return;
      const val = Math.max(0, Math.min(100, parseInt(s.value, 10) || 0));
      v.textContent = val;
      if (box) box.style.setProperty('--hc-col', val >= 75 ? '#ff5252' : val >= 40 ? '#ffca3a' : '#29b6f6');
    }

    // 👁️ HIDER: send the manual 0-100 score for the selected proposal
    async function hcSubmitScore() {
      const hc = (currentRoom && currentRoom.hc) || {};
      if (hc.phase !== 'play' || playerId !== hc.hider || !hcQueueSel) return;
      const q = (hc.queue || {})[hcQueueSel];
      if (!q) return;
      const s = document.getElementById('hcScoreSlider');
      const score = Math.max(0, Math.min(100, s ? (parseInt(s.value, 10) || 0) : 50));
      const key = hcQueueSel;
      hcQueueSel = null;
      await hcAwardScore(q.by, q, score, key);
    }

    // Round recap payload: who found it (in how many guesses), who busted,
    // who dropped out — computed from that round's chronological guesses.
    function hcRoundRecap(round, hc, guesses, sk) {
      const keys = Object.keys(guesses || {}).filter(k => guesses[k] && guesses[k].r === round).sort();
      const found = {}; const cnts = {};
      keys.forEach(k => {
        const g = guesses[k]; if (!g || !g.by) return;
        cnts[g.by] = (cnts[g.by] || 0) + 1;
        if (g.score >= 100 && found[g.by] == null) found[g.by] = cnts[g.by];
      });
      const bust = Object.keys(sk || {}).filter(pid => ((sk[pid] || {}).s === 'busted'));
      const leftOut = Object.keys(sk || {}).filter(pid => ((sk[pid] || {}).s === 'left'));
      return {
        hider: hc.hider || null,
        secretName: ((hc.secret || {}).name) || '', secretImg: ((hc.secret || {}).image) || '',
        found: Object.keys(found).length ? found : null,
        bust: bust.length ? bust : null,
        leftOut: leftOut.length ? leftOut : null
      };
    }

    // Shared score resolution: logs the scored guess, feeds the seeker's
    // cumulative total, closes their lane on 100 (found) or at the attempt
    // cap (busted) — and closes the ROUND when every active seeker's lane
    // is done (last rotation round → matchEnd, winner = biggest total).
    // Called by the hider (manual slider) and by a seeker (direct hit, 100).
    async function hcAwardScore(seeker, entry, score, queueKey) {
      score = Math.max(0, Math.min(100, parseInt(score, 10) || 0));
      // fresh read — parallel resolvers (another seeker's auto-hit, the
      // hider's late send) must never act on a stale snapshot
      const fresh = ((await database.ref('rooms/' + roomCode).once('value')).val()) || currentRoom || {};
      const hc = fresh.hc || {};
      if (hc.phase !== 'play') { // stale score — just clear the queue item
        if (queueKey) await database.ref('rooms/' + roomCode + '/hc/queue/' + queueKey).set(null);
        return;
      }
      const sk0 = (hc.sk || {})[seeker] || { a: 0, s: 'on' };
      if ((sk0.s || 'on') !== 'on') { // lane already closed (their auto-hit landed first)
        if (queueKey) await database.ref('rooms/' + roomCode + '/hc/queue/' + queueKey).set(null);
        return;
      }
      const round = hc.round || 1;
      const attempts = (sk0.a || 0) + 1;
      const status = score >= 100 ? 'found' : (attempts >= HC_ATTEMPT_CAP ? 'busted' : 'on');
      const mode0 = hcModeOfRoom(fresh);
      // 🎯 shared guesses: every guess scores points (the hider's 0-100);
      // individual mode keeps counting attempts (fewest guesses wins)
      const total = ((hc.totals || {})[seeker] || 0) + (mode0 === 'individual' ? 1 : score);
      const gKey = database.ref('rooms/' + roomCode + '/hc/guesses').push().key;
      const gEntry = { by: seeker, name: (entry && entry.name) || '?', image: (entry && entry.image) || '', score: score, r: round, at: Date.now() };
      const upd = {};
      upd['hc/guesses/' + gKey] = gEntry;
      upd['hc/sk/' + seeker + '/a'] = attempts;
      upd['hc/sk/' + seeker + '/s'] = status;
      upd['hc/totals/' + seeker] = total;
      if (queueKey) upd['hc/queue/' + queueKey] = null;
      // closure: every ACTIVE lane (minus the hider) done?
      const skNext = Object.assign({}, hc.sk); skNext[seeker] = { a: attempts, s: status };
      const active = hcActiveSeats(fresh);
      const allDone = active.every(pid => pid === hc.hider || (((skNext[pid] || {}).s || 'on') !== 'on'));
      if (allDone) {
        const gAll = Object.assign({}, hc.guesses); gAll[gKey] = gEntry;
        upd['hc/rounds/r' + round] = hcRoundRecap(round, hc, gAll, skNext);
        const order = hcOrderOf(fresh);
        if (round < order.length) {
          upd['hc/phase'] = 'roundEnd';
        } else {
          const tNext = Object.assign({}, hc.totals); tNext[seeker] = total;
          upd['hc/phase'] = 'matchEnd';
          upd['hc/winner'] = hcWinnerOf(active, tNext, mode0);
          upd['hc/nextStarter'] = order.length > 1 ? order[1] : null; // rematch: 2nd hider starts
        }
      }
      await database.ref('rooms/' + roomCode).update(upd);
      touchActivity();
    }

    // ▶️ between rounds: only the NEXT hider in the rotation can launch
    // their round (no double-launch race)
    async function hcContinue() {
      const hc = (currentRoom && currentRoom.hc) || {};
      if (hc.phase !== 'roundEnd') return;
      const order = hcOrderOf();
      const nextIdx = hc.round || 1; // next hider's seat in the rotation
      const nextHider = order[nextIdx];
      if (!nextHider || playerId !== nextHider) return;
      const sk = {};
      hcActiveSeats().forEach(pid => { if (pid !== nextHider) sk[pid] = { a: 0, s: 'on' }; });
      if (!Object.keys(sk).length) return;
      await database.ref('rooms/' + roomCode + '/hc').update({
        round: nextIdx + 1, phase: 'select', hider: nextHider,
        secret: null, queue: null, sk: sk
      });
      touchActivity();
    }

    // 🔁 Play Again vote on the end screen (same pattern as the multi games)
    function hcPlayAgain() {
      if (!currentRoom || !roomCode) return;
      database.ref('rooms/' + roomCode + '/restarts/' + playerId).set(true);
      touchActivity();
      showNotification('Play Again clicked! Waiting for others…');
      const btn = document.getElementById('hcRestartBtn');
      if (btn) { btn.textContent = 'Waiting…'; btn.disabled = true; }
    }
    async function launchHcRematch() {
      const end = document.getElementById('hcEndScreen');
      if (end) end.classList.remove('show');
      await hotcoldDeal(); // hotcoldDeal clears restarts & rotates the first hider
    }

    function hcHeat(score) { return score >= 75 ? 'hc-hot' : score >= 40 ? 'hc-warm' : 'hc-cold'; }
    const hcNameOf = (players, pid) => ((players[pid] || {}).name) || '…';

    // 🔀 guess visibility — room setting settings/hcMode: 'shared' (default,
    // everyone sees every scored proposal) | 'individual' (a seeker only ever
    // sees THEIR OWN scored guesses; the hider keeps the full picture).
    // NOTE: data-wise the whole room syncs to every client; privacy here is
    // render-level. Round/match recaps never list other players' proposals,
    // and the proposals queue has always been hider-only.
    function hcGuessMode() { return hcModeOfRoom(currentRoom); }
    function hcVisibleGuesses(hc) {
      const all = (hc || {}).guesses || {};
      if (hcGuessMode() !== 'individual') return all;
      if (playerId === (hc || {}).hider) return all;
      if (!playerId) return {};
      const own = {};
      Object.keys(all).forEach(k => { const g = all[k]; if (g && g.by === playerId) own[k] = g; });
      return own;
    }

    // 🛡️ host backstop: departures mid-match. A seeker leaving just closes
    // their lane ('left' = done; banked points stay in the classement); the
    // hider leaving voids the current secret and rolls the rotation forward;
    // under 2 active seats the match ends on the current totals (forfeit).
    let hcGuardFor = 0;
    let hcEmptyPoolFor = 0;     // 👀 watched-pool-empty warning latch (once per match)
    function hcAbandonGuard(hc, players) {
      if (!isHost || !hc.gameId || hc.phase === 'matchEnd' || hcGuardFor === hc.gameId || !Array.isArray(hc.order)) return;
      const gameId = hc.gameId;
      const order = hc.order;
      const active = order.filter(pid => players[pid] && players[pid].outInGame !== gameId);
      const left = order.filter(pid => players[pid] && players[pid].outInGame === gameId);
      if (!left.length) return;
      const upd = {};
      let note = '';
      // a seeker who left: close their open lane so the round can end
      if (hc.phase === 'play') {
        left.forEach(pid => {
          const st = (hc.sk || {})[pid];
          if (pid !== hc.hider && st && (st.s || 'on') === 'on') upd['hc/sk/' + pid + '/s'] = 'left';
        });
      }
      if (active.length < 2) {
        upd['hc/phase'] = 'matchEnd';
        upd['hc/winner'] = hcWinnerOf(active, hc.totals || {}, hcModeOfRoom(currentRoom));
        upd['hc/forfeit'] = true;
        upd['hc/nextStarter'] = null;
        note = 'Too many players left — the match ends here.';
      } else {
        // the seat that must act next: the current hider (select/play) or
        // the upcoming hider (roundEnd). If they bailed → roll forward.
        const slot = hc.phase === 'roundEnd' ? (hc.round || 1) : (hc.round || 1) - 1;
        const slotPid = order[slot];
        if (slotPid != null && active.indexOf(slotPid) === -1) {
          if (hc.phase === 'play') upd['hc/rounds/r' + (hc.round || 1)] = hcRoundRecap(hc.round || 1, hc, hc.guesses || {}, hc.sk || {}); // 'select' | 'roundEnd': nothing to recap / recap exists
          let idx = slot + 1;
          while (idx < order.length && active.indexOf(order[idx]) === -1) idx++;
          if (idx >= order.length) {
            upd['hc/phase'] = 'matchEnd';
            upd['hc/winner'] = hcWinnerOf(active, hc.totals || {}, hcModeOfRoom(currentRoom));
            upd['hc/forfeit'] = true;
            upd['hc/nextStarter'] = null;
            note = 'The last hider left — the match ends on the current totals.';
          } else {
            const sk = {};
            active.forEach(pid => { if (pid !== order[idx]) sk[pid] = { a: 0, s: 'on' }; });
            upd['hc/round'] = idx + 1;
            upd['hc/phase'] = 'select';
            upd['hc/hider'] = order[idx];
            upd['hc/secret'] = null;
            upd['hc/queue'] = null;
            upd['hc/sk'] = sk;
            note = 'The hider left — the rotation moves on!';
          }
        } else if (hc.phase === 'play') {
          // every open lane closed by departures? the round is over
          const skNext = Object.assign({}, hc.sk);
          left.forEach(pid => {
            if (pid !== hc.hider && skNext[pid] && (skNext[pid].s || 'on') === 'on') skNext[pid] = Object.assign({}, skNext[pid], { s: 'left' });
          });
          const allDone = active.every(pid => pid === hc.hider || (((skNext[pid] || {}).s || 'on') !== 'on'));
          if (allDone) {
            upd['hc/rounds/r' + (hc.round || 1)] = hcRoundRecap(hc.round || 1, hc, hc.guesses || {}, skNext);
            if ((hc.round || 1) < order.length) {
              upd['hc/phase'] = 'roundEnd';
            } else {
              upd['hc/phase'] = 'matchEnd';
              upd['hc/winner'] = hcWinnerOf(active, hc.totals || {}, hcModeOfRoom(currentRoom));
              upd['hc/nextStarter'] = order.length > 1 ? order[1] : null;
            }
            note = 'Round over — moving on!';
          }
        }
      }
      if (!Object.keys(upd).length) return;
      hcGuardFor = gameId;
      if (note) showNotification(note);
      database.ref('rooms/' + roomCode).update(upd);
    }

    // ----- main render: everything keys off hc.phase + my seat/role ------
    function updateHotcold() {
      const hc = (currentRoom && currentRoom.hc) || {};
      const players = (currentRoom && currentRoom.players) || {};
      const meP = players[playerId] || {};
      if (!hc.gameId || meP.outInGame === hc.gameId) return;
      try { hcWireOnce(); } catch (e) {}
      const phase = hc.phase || 'select';
      const order = hcOrderOf();
      const round = hc.round || 1;
      const iHider = playerId === hc.hider;
      // 👀 watched pool empty? warn the hider once per match (block with a hint)
      if (iHider && hc.phase === 'select' && (((currentRoom.settings) || {}).pool === 'watched') && hcEmptyPoolFor !== hc.gameId && !hcPoolChars().length) {
        hcEmptyPoolFor = hc.gameId;
        showNotification('The Watched pool is empty — widen the AniList status checkboxes or switch the pool to Random (host ⚙️).');
      }
      const mySk = (hc.sk || {})[playerId] || null;
      const myStatus = mySk ? (mySk.s || 'on') : null;
      const myAttempts = (mySk && mySk.a) || 0;
      const totals = hc.totals || {};
      hcAbandonGuard(hc, players);

      // a phase hop / new round / fresh deal wipes local typing leftovers
      const pk = hc.gameId + ':' + phase + ':' + round + ':' + (hc.hider || '');
      if (pk !== hcLastPhaseKey) {
        hcLastPhaseKey = pk;
        ['pick', 'guess'].forEach(k => { hcClearStage(k); hcHideSug(k); const inp = document.getElementById(hcSug[k].inp); if (inp) inp.value = ''; });
        hcQueueSel = null;
      }

      // badges
      const rBadge = document.getElementById('hcRoundBadge');
      if (rBadge) rBadge.innerHTML = ic('target') + ' Round ' + round + '/' + order.length;
      const roleBadge = document.getElementById('hcRoleBadge');
      if (roleBadge) roleBadge.innerHTML = iHider ? (ic('eye') + ' You are the HIDER') : (ic('search') + ' You are a SEEKER');

      // the hider's secret strip (seekers never see it)
      const strip = document.getElementById('hcSecretStrip');
      const showStrip = iHider && !!hc.secret;
      if (strip) strip.style.display = showStrip ? '' : 'none';
      if (showStrip) {
        const si = document.getElementById('hcSecretImg'); if (si) si.src = hc.secret.image || '';
        const sn = document.getElementById('hcSecretName'); if (sn) sn.textContent = hc.secret.name || '---';
        const cc = document.getElementById('hcCountChip'); if (cc) cc.textContent = totals[playerId] || 0;
      }

      // proposals queue (chrono via push keys) + my in-flight proposal
      const queue = hc.queue || {};
      const qKeys = Object.keys(queue).filter(k => queue[k]).sort();
      const myQueueKey = qKeys.find(k => queue[k] && queue[k].by === playerId) || null;

      // action / waiting areas
      const showEl = (id, on) => { const el = document.getElementById(id); if (el) el.style.display = on ? '' : 'none'; };
      const doPick = phase === 'select' && iHider;
      const doGuess = phase === 'play' && !iHider && myStatus === 'on';
      const doInflight = phase === 'play' && !iHider && myStatus === 'on' && !!myQueueKey;
      const doQueue = phase === 'play' && iHider;
      if (doQueue && (!hcQueueSel || !queue[hcQueueSel])) hcQueueSel = qKeys[0] || null;
      if (!doQueue) hcQueueSel = null;
      // 🧹 seeker convenience: when MY lane advances (the hider scored my
      // proposal, or my lane closed), wipe the typing space + staged card —
      // don't resurrect the previous character in the box
      {
        const laneKey = round + '|' + myAttempts + '|' + (myStatus || '');
        if (hcLastLaneKey && hcLastLaneKey !== laneKey && !iHider) {
          const gi = document.getElementById('hcGuessInput');
          if (gi) gi.value = '';
          hcClearStage('guess'); hcHideSug('guess');
        }
        hcLastLaneKey = laneKey;
      }
      const selQ = (doQueue && hcQueueSel) ? queue[hcQueueSel] : null;
      showEl('hcPickArea', doPick);
      showEl('hcGuessArea', doGuess && !doInflight);
      showEl('hcInflightArea', doInflight);
      showEl('hcQueueArea', doQueue);
      showEl('hcAnswerArea', !!selQ);
      if (doInflight) {
        const it = document.getElementById('hcInflightText');
        if (it) it.innerHTML = tPO('hc_wait_score', { n: escapeHtml(hcNameOf(players, hc.hider)) });
      }

      // the hider's queue cards (proposer + character), selected one loads
      // into the scoring box
      const qBox = document.getElementById('hcQueue');
      if (doQueue && qBox) {
        qBox.innerHTML = '';
        if (!qKeys.length) {
          const p = document.createElement('p');
          p.style.cssText = 'text-align:center;color:var(--muted);margin:6px 0 0;';
          p.textContent = window.t ? t('No proposals yet — the seekers are warming up…') : 'No proposals yet — the seekers are warming up…';
          qBox.appendChild(p);
        }
        qKeys.forEach(k => {
          const q = queue[k] || {};
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'hc-qcard' + (k === hcQueueSel ? ' sel' : '');
          b.onclick = () => hcQueueClick(k);
          const img = document.createElement('img');
          img.src = q.image || ''; img.alt = ''; img.loading = 'lazy';
          const info = document.createElement('div');
          info.className = 'hc-qinfo';
          const by = document.createElement('div');
          by.className = 'hc-qby'; by.textContent = hcNameOf(players, q.by);
          const nm = document.createElement('div');
          nm.className = 'hc-qname'; nm.textContent = q.name || '?';
          info.appendChild(by); info.appendChild(nm);
          b.appendChild(img); b.appendChild(info);
          qBox.appendChild(b);
        });
      }
      if (selQ) { // scoring box mirrors the selected proposal
        if (hcQueueSel !== hcAnsKey) { // new selection → recentre the slider
          hcAnsKey = hcQueueSel;
          const sEl = document.getElementById('hcScoreSlider'); if (sEl) sEl.value = 50;
          hcScoreChanged();
        }
        const ai = document.getElementById('hcAnsImg'); if (ai) ai.src = selQ.image || '';
        const an = document.getElementById('hcAnsName'); if (an) an.textContent = selQ.name || '---';
        const al = document.getElementById('hcAnsLabel'); if (al) al.innerHTML = tPO('hc_ans_by', { n: escapeHtml(hcNameOf(players, selQ.by)) });
        const ah = document.getElementById('hcAnswerHint');
        if (ah) ah.innerHTML = tPO('hc_rescore', { s: escapeHtml(String((hc.secret && hc.secret.name) || '?')) });
      }

      // banner (instructions / round recap) + the generic waiting line
      const banner = document.getElementById('hcBanner');
      let bHtml = '';
      let wText = '';
      if (phase === 'select') {
        if (iHider) bHtml = tPO('hc_hide_you');
        else wText = tPO('hc_wait_hide', { n: escapeHtml(hcNameOf(players, hc.hider)) });
      } else if (phase === 'play') {
        if (doGuess) bHtml = tPO('hc_track', { c: myAttempts + 1 });
        else if (myStatus === 'found') wText = tPO('hc_done_found', { c: myAttempts, t: totals[playerId] || 0 });
        else if (myStatus === 'busted') wText = tPO('hc_done_bust', { t: totals[playerId] || 0 });
      } else if (phase === 'roundEnd') {
        const rr = (hc.rounds || {})['r' + round] || {};
        const bits = [];
        if (rr.secretImg) bits.push('<img class="hc-reveal-img" src="' + String(rr.secretImg) + '" alt="secret" loading="eager">');
        if (rr.secretName) bits.push(tPO('hc_reveal', { s: escapeHtml(String(rr.secretName)) }));
        const fMap = rr.found || {};
        Object.keys(fMap).sort((a, b) => (fMap[a] || 0) - (fMap[b] || 0)).forEach(pid => {
          bits.push(tPO('hc_found', { n: escapeHtml(hcNameOf(players, pid)), c: fMap[pid] }));
        });
        (rr.bust || []).forEach(pid => {
          bits.push('<b>' + escapeHtml(hcNameOf(players, pid)) + '</b> ' + tPO('hc_pts_bust', { c: HC_ATTEMPT_CAP }));
        });
        (rr.leftOut || []).forEach(pid => {
          bits.push('<b>' + escapeHtml(hcNameOf(players, pid)) + '</b> ' + tPO('hc_pts_left'));
        });
        bHtml = bits.join('<br>');
        const nextHider = order[round]; // rotation seat for the next round
        if (nextHider) {
          if (playerId === nextHider) {
            bHtml += '<br><button class="success" style="margin-top:10px;" onclick="hcContinue()">' +
              tPO('hc_start_round', { r: round + 1 }) + '</button>';
          } else {
            bHtml += '<br><small>' + tPO('hc_continue_wait', { n: escapeHtml(hcNameOf(players, nextHider)) }) + '</small>';
          }
        }
      }
      if (banner) { banner.innerHTML = bHtml; banner.style.display = bHtml ? '' : 'none'; }
      const wait = document.getElementById('hcWaitArea');
      const wEl = document.getElementById('hcWaitText');
      if (wait) wait.style.display = wText && phase !== 'matchEnd' ? '' : 'none';
      if (wEl && wText) wEl.innerHTML = wText;

      // guesses log (current round, chronological; 🔀 individual mode → seekers see ONLY their own)
      const guesses = hcVisibleGuesses(hc);
      const mineOnly = hcGuessMode() === 'individual' && playerId !== hc.hider && playerId && hc.phase !== 'select';
      const gKeys = Object.keys(guesses).filter(k => guesses[k] && guesses[k].r === round).sort();
      const log = document.getElementById('hcLog');
      if (log) {
        if (!gKeys.length) {
          log.innerHTML = '<p style="text-align:center;color:var(--muted);">Nothing yet</p>';
        } else {
          log.innerHTML = '';
          gKeys.forEach((k, i) => {
            const g = guesses[k] || {};
            const row = document.createElement('div');
            row.className = 'hc-row';
            const num = document.createElement('span'); num.className = 'hc-gnum'; num.textContent = '#' + (i + 1);
            const img = document.createElement('img'); img.className = 'hc-gimg'; img.src = g.image || ''; img.alt = ''; img.loading = 'lazy';
            const texts = document.createElement('span'); texts.className = 'hc-gtexts';
            const who = document.createElement('span'); who.className = 'hc-gwho'; who.textContent = hcNameOf(players, g.by);
            const nm = document.createElement('span'); nm.className = 'hc-gname'; nm.textContent = g.name || '?';
            texts.appendChild(who); texts.appendChild(nm);
            const sc = document.createElement('span'); sc.className = 'hc-gnum ' + hcHeat(g.score || 0);
            sc.innerHTML = (g.score >= 100 ? ic('check') + ' ' : '') + (g.score != null ? g.score : '?');
            row.appendChild(num); row.appendChild(img); row.appendChild(texts); row.appendChild(sc);
            log.appendChild(row);
          });
        }
      }
      const logTitle = document.getElementById('hcLogTitle');
      if (logTitle) logTitle.innerHTML = ic('note') + ' ' + tPO(mineOnly ? 'hc_log_mine' : 'hc_round_word', { c: gKeys.length });

      // 🏆 CLASSEMENT — Σ of every scored guess (shared: most POINTS first;
      // individual: golf, fewest guesses). Lane chips show who's still hunting.
      // 📊 settings/hcHideRank parks the panel until the match ends.
      const hideRank = !!(((currentRoom || {}).settings || {}).hcHideRank) && hc.phase !== 'matchEnd';
      const sharedPts = hcGuessMode() !== 'individual';
      const rankTitle = document.getElementById('hcRankTitle');
      if (rankTitle) { rankTitle.innerHTML = ic('trophy') + ' ' + (window.t ? t('Ranking') : 'Ranking'); rankTitle.style.display = hideRank ? 'none' : ''; }
      const rank = document.getElementById('hcRank');
      if (rank) rank.style.display = hideRank ? 'none' : '';
      if (rank && !hideRank) {
        const seats = order.filter(pid => players[pid]);
        const dir = sharedPts ? -1 : 1; // shared: biggest points first · individual: golf
        const sorted = seats.slice().sort((a, b) => (((totals[a] || 0) - (totals[b] || 0)) * dir) || String(hcNameOf(players, a)).localeCompare(String(hcNameOf(players, b))));
        rank.innerHTML = '';
        sorted.forEach((pid, i) => {
          const p = players[pid] || {};
          const out = p.outInGame === hc.gameId;
          const st = ((hc.sk || {})[pid] || {}).s;
          const row = document.createElement('div');
          row.className = 'hc-row' + (pid === playerId ? ' hc-me' : '');
          let tag = '';
          if (out) tag = '<span class="hc-done-tag no">(' + (window.t ? t('(left)') : '(left)') + ')</span>';
          else if (pid !== hc.hider && st === 'found') tag = '<span class="hc-done-tag ok">' + ic('check') + '</span>';
          else if (pid !== hc.hider && st === 'busted') tag = '<span class="hc-done-tag no">×</span>';
          row.innerHTML = '<span class="hc-rank">' + (i + 1) + '.</span>' + avatarCircle(p.avatar, 'hc-av') +
            '<span class="hc-gname">' + escapeHtml(hcNameOf(players, pid)) + (pid === playerId ? ' (You)' : '') + tag + '</span>' +
            '<span class="hc-gnum">' + (totals[pid] || 0) + '</span>';
          rank.appendChild(row);
        });
      }

      // 🔥 BEST GUESSES of the round — everyone's shots re-sorted by the
      // hider's 0-100 scores (highest first, ties keep the earlier one),
      // name-deduped, top 5 with the proposer named — which proposals
      // actually burned the closest
      const topTitle = document.getElementById('hcTopTitle');
      if (topTitle) topTitle.innerHTML = ic('trophy') + ' ' + (mineOnly ? (window.t ? t('My best guesses') : 'My best guesses') : (window.t ? t('Best guesses') : 'Best guesses'));
      const topWrap = document.getElementById('hcTopWrap');
      const top = document.getElementById('hcTop');
      if (top && topWrap) {
        if (!gKeys.length) { topWrap.style.display = 'none'; top.innerHTML = ''; }
        else {
          const byScore = gKeys.map(k => guesses[k] || {}).filter(g => g.name)
            .sort((a, b) => ((b.score || 0) - (a.score || 0)) || ((a.at || 0) - (b.at || 0)));
          const seenNm = {};
          const unique = [];
          for (let i = 0; i < byScore.length && unique.length < 5; i++) {
            const nk = bgNorm(byScore[i].name || '');
            if (!nk || seenNm[nk]) continue;
            seenNm[nk] = 1; unique.push(byScore[i]);
          }
          top.innerHTML = '';
          unique.forEach((g, i) => {
            const row = document.createElement('div');
            row.className = 'hc-tcard';
            const rk = document.createElement('span'); rk.className = 'hc-rank'; rk.textContent = (i + 1) + '.';
            const img = document.createElement('img'); img.className = 'hc-gimg'; img.src = g.image || ''; img.alt = ''; img.loading = 'lazy';
            const texts = document.createElement('span'); texts.className = 'hc-gtexts';
            const who = document.createElement('span'); who.className = 'hc-gwho'; who.textContent = hcNameOf(players, g.by);
            const nm = document.createElement('span'); nm.className = 'hc-gname'; nm.textContent = g.name || '?';
            texts.appendChild(who); texts.appendChild(nm);
            const sc = document.createElement('span'); sc.className = 'hc-gnum ' + hcHeat(g.score || 0);
            sc.innerHTML = (g.score >= 100 ? ic('check') + ' ' : '') + (g.score != null ? g.score : '?');
            row.appendChild(rk); row.appendChild(img); row.appendChild(texts); row.appendChild(sc);
            top.appendChild(row);
          });
          top.title = tPO(mineOnly ? 'hc_top_mine_tip' : 'hc_top_plural', { c: gKeys.length });
          topWrap.style.display = '';
        }
      }

      // end screen — only on top of the game screen, like the multi games
      const end = document.getElementById('hcEndScreen');
      if (phase !== 'matchEnd') { if (end) end.classList.remove('show'); return; }
      const activeScreen = document.querySelector('.screen.active');
      if (!activeScreen || activeScreen.id !== 'hotcoldScreen') { if (end) end.classList.remove('show'); return; }
      hcRenderEnd(hc, players);
    }

    // ----- end screen: classement on cumulative totals + per-round recap --
    function hcRenderEnd(hc, players) {
      const end = document.getElementById('hcEndScreen');
      if (!end) return;
      const winner = hc.winner; // pid | 'draw'
      const totals = hc.totals || {};
      const ptsMode = hcGuessMode() !== 'individual'; // 🎯 shared guesses score POINTS
      const title = document.getElementById('hcWinTitle');
      const sub = document.getElementById('hcWinSub');
      if (winner === 'draw') {
        if (title) title.innerHTML = ic('target') + ' ' + 'Draw!';
        if (sub) sub.innerHTML = tPO(ptsMode ? 'hc_draw_pts' : 'hc_draw');
      } else {
        if (title) title.innerHTML = ic('trophy') + ' ' + 'Winner!';
        if (sub) sub.innerHTML = winner === playerId ? tPO(ptsMode ? 'hc_win_you_total_pts' : 'hc_win_you_total', { t: totals[winner] || 0 })
          : tPO(ptsMode ? 'hc_win_total_pts' : 'hc_win_total', { n: escapeHtml(hcNameOf(players, winner)), t: totals[winner] || 0 }) +
            (hc.forfeit ? ' <small>(' + tPO('hc_by_forfeit') + ')</small>' : '');
      }
      const list = document.getElementById('hcEndList');
      if (list) {
        list.innerHTML = '';
        const order = hcOrderOf();
        const dir = ptsMode ? -1 : 1;
        const sorted = order.filter(pid => players[pid]).slice()
          .sort((a, b) => (((totals[a] || 0) - (totals[b] || 0)) * dir) || String(hcNameOf(players, a)).localeCompare(String(hcNameOf(players, b))));
        sorted.forEach((pid, i) => {
          const p = players[pid] || {};
          const out = p.outInGame === hc.gameId;
          const row = document.createElement('div');
          row.className = 'me-row' + (pid === playerId ? ' me' : '');
          const crown = (winner !== 'draw' && pid === winner) ? ic('trophy') + ' ' : '';
          const tag = escapeHtml(hcNameOf(players, pid)) + (pid === playerId ? ' (You)' : '') + (out ? ' <small style="color:var(--muted);">(' + tPO('hc_pts_left') + ')</small>' : '');
          row.innerHTML = '<span class="hc-rank">' + (i + 1) + '.</span>' + avatarCircle(p.avatar, 'ava-chat') + '<span>' + crown + tag + '</span><span class="me-pts">' + tPO(ptsMode ? 'hc_pts_word' : 'hc_round_word', { c: totals[pid] || 0 }) + '</span>';
          list.appendChild(row);
        });
      }
      const recap = document.getElementById('hcRoundsRecap');
      if (recap) {
        recap.innerHTML = '';
        const rks = Object.keys(hc.rounds || {}).sort((a, b) => (parseInt(a.slice(1), 10) || 0) - (parseInt(b.slice(1), 10) || 0));
        rks.forEach(rk => {
          const rr = (hc.rounds || {})[rk] || {};
          const num = parseInt(rk.slice(1), 10) || 0;
          const names = (pids) => (pids || []).map(pid => escapeHtml(hcNameOf(players, pid))).join(', ');
          let line = '<div><b>R' + num + '</b> — ';
          if (rr.secretImg) line += '<img class="hc-recap-img" src="' + String(rr.secretImg) + '" alt=""> ';
          line += rr.secretName ? '<b>' + escapeHtml(rr.secretName) + '</b> ' : '';
          line += rr.hider ? '(' + tPO('hc_hidden_by', { n: escapeHtml(hcNameOf(players, rr.hider)) }) + ')' : '';
          const founds = Object.keys(rr.found || {}).sort((a, b) => ((rr.found[a] || 0) - (rr.found[b] || 0)));
          if (founds.length) line += ' · ✓ ' + names(founds);
          if (rr.bust && rr.bust.length) line += ' · ✗ ' + names(rr.bust);
          if (rr.leftOut && rr.leftOut.length) line += ' · ✗ ' + names(rr.leftOut) + ' (' + tPO('hc_pts_left') + ')';
          recap.innerHTML += line + '</div>';
        });
      }
      // replay counting (same pattern as the multi games)
      const restarts = currentRoom.restarts || {};
      if (restarts[playerId]) end.classList.remove('show'); else end.classList.add('show');
      const eligible = hcPids();
      const clicked = eligible.filter(pid => restarts[pid]).length;
      const statusEl = document.getElementById('hcRestartStatus');
      const btn = document.getElementById('hcRestartBtn');
      if (eligible.length > 0 && clicked >= eligible.length) {
        if (isHost) { if (statusEl) statusEl.textContent = 'Everyone is ready! New game…'; launchHcRematch(); }
        else if (statusEl) statusEl.textContent = 'Waiting for the host…';
      } else if (statusEl) statusEl.textContent = 'Ready for a new game: ' + clicked + '/' + eligible.length;
      if (btn) {
        if (restarts[playerId]) { btn.textContent = 'Waiting…'; btn.disabled = true; }
        else { btn.textContent = 'Play Again'; btn.disabled = false; }
      }
    }

    // 🚪 leave the match (To Lobby button): mid-game you keep your banked
    // points but drop out of the classement race — after the match, the
    // usual "everyone back to the lobby" flow
    async function returnToLobbyFromHotcold() {
      const hc = (currentRoom && currentRoom.hc) || {};
      const meP = ((currentRoom && currentRoom.players) || {})[playerId] || {};
      const inGame = currentRoom && (currentRoom.state === 'playing' || currentRoom.state === 'finished') && hc.gameId && meP.outInGame !== hc.gameId;
      if (!inGame) { document.getElementById('hcEndScreen').classList.remove('show'); showScreen('lobbyScreen'); return; }
      if (hc.phase === 'matchEnd') {
        showInteraction('Return to Lobby?', 'The match is over — everyone goes back to the lobby.', [
          { label: 'Stay here', onclick: () => { closeInteraction(); }, class: 'secondary' },
          { label: 'To Lobby', onclick: async () => { closeInteraction(); try { await returnToLobby(); } catch (e) {} }, class: 'danger' }
        ]);
        return;
      }
      showInteraction('Leave the match?', 'Your banked points stay, but you stop playing — you cannot win the classement anymore.', [
        { label: 'Stay in the match', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: 'To Lobby', onclick: async () => {
          closeInteraction();
          try {
            await database.ref('rooms/' + roomCode + '/players/' + playerId).update({ outInGame: hc.gameId, ready: false });
          } catch (e) {}
          document.getElementById('hcEndScreen').classList.remove('show');
          showScreen('lobbyScreen');
        }, class: 'danger' }
      ]);
    }

    async function hostStartGame() {
      if (!isHost || !currentRoom) return;
      // ⏳ Fill free seats from the queue BEFORE dealing, so waiting players
      // are part of this game
      await maybePromoteQueue(true);
      const snap = await database.ref('rooms/' + roomCode).once('value');
      currentRoom = snap.val();
      const allReady = Object.values(currentRoom.players || {}).every(p => p.ready);
      const playerCount = Object.keys(currentRoom.players || {}).length;
      const g = currentRoom.game;
      if (g === 'undercover') {
        if (playerCount < 3) { showNotification('Undercover needs at least 3 players!'); return; }
        if (!allReady) { showNotification('All players must be ready!'); return; }
        touchActivity();
        await startUndercoverGame();
        return;
      }
      if (g === 'battle' || g === 'race') {
        if (playerCount < 3) { showNotification((GAME_LABELS[g] || 'This game') + ' needs at least 3 players!'); return; }
        if (!allReady) { showNotification('All players must be ready!'); return; }
        touchActivity();
        await multiDeal(g);
        return;
      }
      if (g === 'blur') {
        if (playerCount < 1) { showNotification('Need at least 1 player to start!'); return; }
        if (!allReady) { showNotification('All players must be ready!'); return; }
        touchActivity();
        await multiDeal('blur');
        return;
      }
      if (g === 'hotcold') {
        if (playerCount < 2) { showNotification('Need 2 players to start!'); return; }
        if (!allReady) { showNotification('All players must be ready!'); return; }
        touchActivity();
        await hotcoldDeal();
        return;
      }
      if (!allReady) { showNotification('All players must be ready!'); return; }
      if (playerCount < 2) { showNotification('Need 2 players to start!'); return; }
      touchActivity();
      await generateCharacterPool();
    }

    async function generateCharacterPool(extraUpdates = {}) {
      const accountData = currentRoom ? Object.values(currentRoom.accounts || {}) : [];
      const settings = currentRoom ? currentRoom.settings : { characterCount: 24 };
      const totalChars = settings.characterCount || 24;
      const source = (settings && settings.source) || (accountData.length > 0 ? 'favorites' : 'generic');
      const generic = (typeof GENERIC_CHARACTERS !== 'undefined' && Array.isArray(GENERIC_CHARACTERS)) ? GENERIC_CHARACTERS : [];

      let allChars = [];
      accountData.forEach(acc => allChars.push(...(acc.characters || [])));

      const seenIds = new Set();
      const pickUnique = (list, n) => {
        const pool = shuffleArray(list.filter(c => c && c.id != null && !seenIds.has(c.id)));
        const chosen = pool.slice(0, n);
        chosen.forEach(c => seenIds.add(c.id));
        return chosen;
      };

      let selectedChars = [];
      if (source === 'favorites' && accountData.length > 0) {
        // ⚖️ every synced account shares the board EQUALLY (extra cards on the
        // odd remainder go to the first accounts). Short accounts are topped
        // up from the union of everyone's favorites.
        const n = accountData.length;
        const per = Math.floor(totalChars / n);
        let rem = totalChars - per * n;
        accountData.forEach((acc, i) => selectedChars.push(...pickUnique(shuffleArray(((acc && acc.characters) || []).slice()), per + (i < rem ? 1 : 0))));
        if (selectedChars.length < totalChars) selectedChars.push(...pickUnique(shuffleArray(allChars.slice()), totalChars - selectedChars.length));
        selectedChars = shuffleArray(selectedChars);
      } else if (source === 'mix' && accountData.length > 0) {
        // 🔀 generic/favorites split driven by the Mix bar (settings.mixCount,
        // default 50/50); if one side runs short, the other fills in so the
        // board stays full.
        const wantG = Math.max(0, Math.min(totalChars, (settings.mixCount != null ? settings.mixCount : Math.ceil(totalChars / 2))));
        const fromGeneric = pickUnique(generic.slice(), wantG);
        const fromFavs = pickUnique(allChars, totalChars - fromGeneric.length);
        selectedChars = shuffleArray([...fromGeneric, ...fromFavs]);
        if (selectedChars.length < totalChars) {
          selectedChars = shuffleArray([...selectedChars, ...pickUnique(generic.slice(), totalChars - selectedChars.length)]);
        }
      } else if (source === 'watched' && accountData.length > 0) {
        // 👀 Watched: the board comes from characters of anime the synced
        // accounts have seen (same pool as Hot & Cold / Blur Guess)
        selectedChars = pickUnique(watchedPoolChars(currentRoom), totalChars);
      } else {
        // 'generic', or any source with no AniList accounts configured
        if (source === 'watched') showNotification('Watched pool is empty — check the AniList accounts or switch the pool.');
        else if (source !== 'generic') showNotification('No AniList accounts in this room — using the generic pool.');
        selectedChars = pickUnique(generic.slice(), totalChars);
      }

      if (!selectedChars || selectedChars.length < 6) { showNotification('Not enough characters available to start.'); return; }

      await database.ref('rooms/' + roomCode).update({
        state: 'selection',
        characters: selectedChars,
        selections: {},
        currentTurn: null,
        ...extraUpdates
      });
    }

    function showCharacterSelection() {
      if (!currentRoom || !currentRoom.characters) { console.error('No characters available'); return; }
      characters = currentRoom.characters; selectedCharacter = null;
      // Restore the classic 2P texts/controls (multiplayer modes customize them)
      document.querySelector('.selection-header h2').textContent = 'Choose Your Secret Character';
      document.querySelector('.selection-header p').textContent = 'Pick a character for your opponent to guess';
      document.getElementById('confirmSelectionBtn').style.display = 'inline-block';
      document.querySelector('.selection-controls').style.display = 'flex';
      showScreen('selectionScreen'); renderCharacterGrid();
      // Clean up previous listener to avoid duplicates
      database.ref('rooms/' + roomCode + '/selections').off('value');
      database.ref('rooms/' + roomCode + '/selections').on('value', (snapshot) => { updateSelectionStatus(snapshot.val()); });
    }

    function renderCharacterGrid() {
      const grid = document.getElementById('characterGrid'); grid.innerHTML = '';
      if (!characters || characters.length === 0) { grid.innerHTML = '<p style="text-align: center; color: var(--muted);">No characters available</p>'; return; }
      characters.forEach(char => {
        const card = document.createElement('div'); card.className = 'selectable-card'; card.setAttribute('data-char-id', char.id);
        card.innerHTML = `<img src="${char.image || ''}" alt="${char.name || ''}"><div class="info"><div class="char-name">${char.name || 'Unknown'}</div></div>`;
        card.addEventListener('click', () => selectCharacter(char, card));
        grid.appendChild(card);
      });
    }

    function selectCharacter(char, cardElement) {
      // Race mode: only the TARGET picks the mystery character
      if (currentRoom && currentRoom.game === 'race' && currentRoom.state === 'selection') {
        const tp = (currentRoom.rc || {}).targetPid;
        if (tp && tp !== playerId) { showNotification('Only the TARGET picks the mystery character!'); return; }
      }
      document.querySelectorAll('.selectable-card').forEach(c => c.classList.remove('selected'));
      cardElement.classList.add('selected');
      selectedCharacter = char;
      document.getElementById('confirmSelectionBtn').disabled = false;
      document.getElementById('selectionStatus').className = 'selection-status ready';
      document.getElementById('selectionStatus').textContent = `Selected: ${char.name || 'Unknown'} - Click "Confirm Selection" when ready`;
    }

    function randomSelect() {
      if (!characters || characters.length === 0) return;
      const randomChar = characters[Math.floor(Math.random() * characters.length)];
      const cardElement = document.querySelector(`[data-char-id="${randomChar.id}"]`);
      if (cardElement) { selectCharacter(randomChar, cardElement); cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }

    async function confirmSelection() {
      if (!selectedCharacter) return;
      await database.ref('rooms/' + roomCode + '/selections/' + playerId).set(selectedCharacter.id);
      touchActivity();
      document.getElementById('selectionStatus').className = 'selection-status waiting';
      document.getElementById('selectionStatus').textContent = 'Waiting for opponent to choose...';
      document.getElementById('confirmSelectionBtn').disabled = true;
      document.querySelectorAll('.selectable-card').forEach(c => { c.style.pointerEvents = 'none'; c.style.opacity = '0.5'; });
    }

    async function updateSelectionStatus(selections) {
      if (!currentRoom) return;
      // Multiplayer rooms handle their own selection flow (3-8 players)
      if (currentRoom.game === 'battle' || currentRoom.game === 'race') return;
      if (!selections) return;
      const players = Object.keys(currentRoom.players || {});
      // Opponent vanished during selection → it can't continue alone, back to the lobby
      if (players.length < 2 && isHost && currentRoom.state === 'selection') {
        showNotification('Your opponent left during selection — back to the lobby.');
        await database.ref('rooms/' + roomCode).update({ state: 'lobby', characters: null, selections: null });
        return;
      }
      const allSelected = players.every(pid => selections[pid]);
      if (allSelected && isHost) { startGameFromSelection(selections); }
    }

    async function startGameFromSelection(selections) {
      const players = Object.keys(currentRoom ? currentRoom.players : {});
      if (players.length < 2) return;
      await database.ref('rooms/' + roomCode).update({
        state: 'playing', secrets: selections, currentTurn: players[0],
        eliminations: { [players[0]]: [], [players[1]]: [] },
        questionHistory: [], currentQuestion: null
      });
    }

    async function returnToLobbyFromSelection() {
      showInteraction('Return to Lobby?', 'This will cancel character selection for all players.', [
        { label: 'Cancel', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: 'Return', onclick: async () => { closeInteraction(); await database.ref('rooms/' + roomCode).update({ state: 'lobby', characters: null, selections: null }); await database.ref('rooms/' + roomCode + '/players/' + playerId + '/ready').set(false); showScreen('lobbyScreen'); }, class: 'danger' }
      ]);
    }

    async function returnToLobbyFromGame() {
      showInteraction('Return to Lobby?', 'This will end the current game.', [{label:'Cancel', onclick:()=>{closeInteraction();}, class:'secondary'}, {label:'Return', onclick:()=>{ closeInteraction(); returnToLobby(); }, class:'danger'}]);
    }

    function startGame() {
      if (!currentRoom || !currentRoom.characters) { console.error('Cannot start game: no characters data'); showNotification('Error: No character data available. Returning to lobby...'); returnToLobby(); return; }
      characters = currentRoom.characters;
      if (!characters || characters.length === 0) { console.error('Characters array is empty'); showNotification('Error: Character list is empty. Returning to lobby...'); returnToLobby(); return; }
      mySecret = characters.find(c => c.id === (currentRoom.secrets ? currentRoom.secrets[playerId] : null));
      if (!mySecret) { console.error('Could not find secret character'); showNotification('Error: Could not find your secret character. Returning to lobby...'); returnToLobby(); return; }
      myEliminated.clear(); guessMode = false;
      const players = Object.keys(currentRoom.players || {});
      const opponentId = players.find(id => id !== playerId);
      document.getElementById('yourName').textContent = currentRoom.players[playerId].name || 'You';
      document.getElementById('opponentName').textContent = (opponentId && currentRoom.players[opponentId]) ? currentRoom.players[opponentId].name : 'Opponent';
      setAvatarImg('yourAvatar', currentRoom.players[playerId] ? currentRoom.players[playerId].avatar : null);
      setAvatarImg('opponentAvatar', (opponentId && currentRoom.players[opponentId]) ? currentRoom.players[opponentId].avatar : null);
      document.getElementById('myCharacterImg').src = mySecret.image || '';
      document.getElementById('myCharacterName').textContent = mySecret.name || '---';
      showScreen('gameScreen');
      setTimeout(() => { renderBoard(); updateTurnIndicator(); updateQuestionBox(); updateHistory(); }, 100);
    }

    function renderBoard() {
      const board = document.getElementById('gameBoard');
      if (!board) { console.error('Board element not found'); return; }
      board.innerHTML = '';
      if (!characters || characters.length === 0) { board.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 40px;">Error: No characters loaded</p>'; return; }
      myEliminated = new Set(currentRoom ? (currentRoom.eliminations ? (currentRoom.eliminations[playerId] || []) : []) : []);
      characters.forEach(char => {
        const card = document.createElement('div'); card.className = 'card';
        if (myEliminated.has(char.id)) card.classList.add('eliminated');
        if (guessMode) card.classList.add('guessing');
        card.innerHTML = `<img class="card-img" src="${char.image || ''}" alt="${char.name || ''}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22133%22%3E%3Crect fill=%22%231a1a2e%22 width=%22100%22 height=%22133%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-family=%22Arial%22 font-size=%2214%22 fill=%22%23888%22 text-anchor=%22middle%22 dy=%22.3em%22%3E?%3C/text%3E%3C/svg%3E'"><div class="card-info"><div class="card-name">${char.name || 'Unknown'}</div></div>`;
        card.addEventListener('click', () => onCardClick(char));
        board.appendChild(card);
      });
      updateRemainingCount();
    }

    async function onCardClick(char) {
      if (!currentRoom || currentRoom.state !== 'playing') return;
      if (guessMode) {
        guessingCharacter = char;
        document.getElementById('guessCharImg').src = char.image || '';
        document.getElementById('guessCharName').textContent = char.name || '---';
        document.getElementById('guessModal').classList.add('show'); return;
      }
      if (myEliminated.has(char.id)) { myEliminated.delete(char.id); } else { myEliminated.add(char.id); }
      await database.ref('rooms/' + roomCode + '/eliminations/' + playerId).set([...myEliminated]);
      renderBoard();
    }

    function updateTurnIndicator() {
      const indicator = document.getElementById('turnIndicator');
      if (!currentRoom) return;
      const isMyTurn = currentRoom.currentTurn === playerId;
      indicator.textContent = isMyTurn ? 'Your Turn' : "Opponent's Turn";
      indicator.className = 'turn-indicator ' + (isMyTurn ? 'your-turn' : 'their-turn');
    }

    function updateRemainingCount() {
      const remaining = (characters ? characters.length : 0) - myEliminated.size;
      document.getElementById('remainingCount').textContent = `(${remaining} remaining)`;
    }

    async function askQuestion() {
      if (!currentRoom || currentRoom.currentTurn !== playerId) { showNotification("It's not your turn!"); return; }
      const input = document.getElementById('questionInput');
      const question = input.value.trim();
      if (!question) { showNotification('Please enter a question'); return; }
      await database.ref('rooms/' + roomCode).update({
        currentQuestion: { text: question, askedBy: playerId, askerName: currentRoom.players[playerId].name, timestamp: Date.now() }
      });
      touchActivity();
      input.value = '';
    }

    async function answerQuestion(answer) {
      if (!currentRoom || !currentRoom.currentQuestion) return;
      const question = currentRoom.currentQuestion;
      const historyItem = { question: question.text, answer: answer, askedBy: question.askerName, timestamp: Date.now() };
      const history = currentRoom.questionHistory ? [...currentRoom.questionHistory] : [];
      history.push(historyItem);
      const players = Object.keys(currentRoom.players || {});
      const nextPlayer = players.find(id => id !== playerId);
      await database.ref('rooms/' + roomCode).update({ currentTurn: nextPlayer, currentQuestion: null, questionHistory: history });
      touchActivity();
    }

    function updateQuestionBox() {
      if (!currentRoom) return;
      const isMyTurn = currentRoom.currentTurn === playerId;
      const hasQuestion = currentRoom.currentQuestion;
      document.getElementById('questionFormArea').style.display = (isMyTurn && !hasQuestion) ? 'block' : 'none';
      document.getElementById('currentQuestionArea').style.display = (hasQuestion && !isMyTurn) ? 'block' : 'none';
      if (hasQuestion && !isMyTurn) { document.getElementById('currentQuestionText').textContent = currentRoom.currentQuestion.text; }
    }

    function updateHistory() {
      const list = document.getElementById('historyList');
      const history = (currentRoom && currentRoom.questionHistory) ? currentRoom.questionHistory : [];
      if (history.length === 0) { list.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px;">No questions yet</p>'; return; }
      list.innerHTML = '';
      [...history].reverse().forEach(item => {
        const div = document.createElement('div'); div.className = 'history-item';
        div.innerHTML = `<div class="question">Q: ${escapeHtml(String(item.question || ''))}</div><div class="answer ${item.answer ? String(item.answer).toLowerCase() : ''}">${escapeHtml(String(item.answer || ''))}</div><div class="asker">Asked by: ${escapeHtml(String(item.askedBy || ''))}</div>`;
        list.appendChild(div);
      });
      list.scrollTop = 0;
    }

    function toggleMyCharacter() {
      myCharacterHidden = !myCharacterHidden;
      const myChar = document.getElementById('myCharacter');
      if (myCharacterHidden) myChar.classList.add('hidden'); else myChar.classList.remove('hidden');
    }

    function startGuessing() {
      if (!currentRoom || currentRoom.currentTurn !== playerId) { showNotification("It's not your turn! You can only guess on your turn."); return; }
      guessMode = true;
      document.getElementById('guessBtn').innerHTML = ic('x') + ' <span class="btn-label">Cancel Guess</span>';
      document.getElementById('guessBtn').onclick = cancelGuessingMode;
      showNotification('Click on a character to make your guess!');
      renderBoard();
    }

    function cancelGuessingMode() {
      guessMode = false;
      document.getElementById('guessBtn').innerHTML = ic('target') + ' <span class="btn-label">Make a Guess</span>';
      document.getElementById('guessBtn').onclick = startGuessing;
      renderBoard();
    }

    async function confirmGuess() {
      document.getElementById('guessModal').classList.remove('show');
      if (!currentRoom || !currentRoom.secrets) return;
      touchActivity();
      const opponentId = Object.keys(currentRoom.players || {}).find(id => id !== playerId);
      const opponentSecret = currentRoom.secrets[opponentId];
      const correct = guessingCharacter ? guessingCharacter.id === opponentSecret : false;
      if (correct) {
        await database.ref('rooms/' + roomCode).update({ state: 'finished', winner: playerId });
      } else {
        if (guessingCharacter) { myEliminated.add(guessingCharacter.id); }
        await database.ref('rooms/' + roomCode + '/eliminations/' + playerId).set([...myEliminated]);
        const players = Object.keys(currentRoom.players || {});
        const nextPlayer = players.find(id => id !== playerId);
        await database.ref('rooms/' + roomCode + '/currentTurn').set(nextPlayer);
        if (guessingCharacter) showNotification('Wrong guess! ' + (guessingCharacter ? guessingCharacter.name : '') + ' has been eliminated.');
      }
      cancelGuessingMode(); guessingCharacter = null;
    }

    function cancelGuess() { document.getElementById('guessModal').classList.remove('show'); guessingCharacter = null; }

    function updateGame() {
      if (!currentRoom || currentRoom.game === 'undercover') return;
      if (currentRoom.state === 'playing') {
        // Opponent left or lost connection → the game ends with your win by default
        const others = Object.keys(currentRoom.players || {}).filter(p => p !== playerId);
        const oppGone = others.length === 0 || !!(currentRoom.players[others[0]] && currentRoom.players[others[0]].dcAt);
        if (oppGone) {
          database.ref('rooms/' + roomCode).update({ state: 'finished', winner: playerId });
          showNotification('Your opponent left the game — you win by default!');
          return;
        }
        renderBoard(); updateTurnIndicator(); updateQuestionBox(); updateHistory();
      }
      if (currentRoom.state === 'finished') {
        // Count the result once per finished game (logged-in players only)
        if (!gameResultCounted && currentRoom.winner) { gameResultCounted = true; recordGameResult(currentRoom.winner === playerId); }
        // Ensure characters loaded for winning screen
        if (!characters || characters.length === 0) {
          characters = currentRoom.characters || [];
        }
        const opponentId = Object.keys(currentRoom.players || {}).find(id => id !== playerId);
        const opponentSecret = characters ? characters.find(c => c.id === (currentRoom.secrets ? currentRoom.secrets[opponentId] : null)) : null;
        const winnerSecret = characters ? characters.find(c => c.id === (currentRoom.secrets ? currentRoom.secrets[currentRoom.winner] : null)) : null;
        renderWinningScreen(currentRoom.winner, winnerSecret, opponentSecret);
        // Handle restart state display
        if (currentRoom.restarts) {
          const totalPlayers = Object.keys(currentRoom.players || {}).length;
          const clickedCount = Object.keys(currentRoom.restarts || {}).length;
          const missingCount = totalPlayers - clickedCount;
          const allRestarted = Object.keys(currentRoom.players || {}).every(pid => currentRoom.restarts && currentRoom.restarts[pid]);
          const statusEl = document.getElementById('restartStatus');
          if (allRestarted) {
            // Auto-launch new game when all have clicked restart
            if (isHost) {
              if (statusEl) statusEl.textContent = 'All players ready! Launching new game...';
              launchNewGame();
            } else {
              if (statusEl) statusEl.textContent = 'Waiting for host to launch new game...';
              const restartBtn = document.getElementById('restartBtn');
              if (restartBtn) { restartBtn.textContent = 'Waiting...'; restartBtn.disabled = true; restartBtn.onclick = null; }
            }
          } else if (!currentRoom.restarts[playerId]) {
            if (statusEl) statusEl.textContent = 'Click Restart to begin a new round.';
            const restartBtn = document.getElementById('restartBtn');
            if (restartBtn) { restartBtn.textContent = 'Restart'; restartBtn.disabled = false; restartBtn.onclick = restartGame; }
          } else {
            if (statusEl) statusEl.textContent = 'Waiting for others to restart... ' + missingCount + '/' + totalPlayers;
            const restartBtn = document.getElementById('restartBtn');
            if (restartBtn) { restartBtn.textContent = 'Waiting...'; restartBtn.disabled = true; restartBtn.onclick = null; }
          }
        } else {
          const statusEl = document.getElementById('restartStatus');
          if (statusEl) statusEl.textContent = 'Click Restart to begin a new round.';
          const restartBtn = document.getElementById('restartBtn');
          if (restartBtn) { restartBtn.textContent = 'Restart'; restartBtn.disabled = false; restartBtn.onclick = restartGame; }
        }
      }
    }

    function renderWinningScreen(winnerId, winnerSecret, opponentSecret) {
      const screen = document.getElementById('winningScreen');
      const title = document.getElementById('winTitle');
      const charImg = document.getElementById('winCharImg');
      const charName = document.getElementById('winCharName');
      const playerNameEl = document.getElementById('winPlayerName');

      const isWinner = winnerId === playerId;
      if (isWinner) {
        title.textContent = 'You Win!';
        title.style.color = 'var(--success)';
        charImg.src = (winnerSecret && winnerSecret.image) ? winnerSecret.image : '';
        charName.textContent = (winnerSecret && winnerSecret.name) ? winnerSecret.name : '---';
        playerNameEl.textContent = currentRoom ? (currentRoom.players[playerId] ? currentRoom.players[playerId].name : playerName) : playerName;
      } else {
        title.textContent = 'You Lost';
        title.style.color = 'var(--danger)';
        charImg.src = (winnerSecret && winnerSecret.image) ? winnerSecret.image : '';
        charName.textContent = (winnerSecret && winnerSecret.name) ? winnerSecret.name : '---';
        playerNameEl.textContent = (currentRoom && currentRoom.players[winnerId]) ? currentRoom.players[winnerId].name : 'Opponent';
      }
      const shownPid = isWinner ? playerId : winnerId;
      setAvatarImg('winPlayerAvatar', (currentRoom && currentRoom.players && currentRoom.players[shownPid]) ? currentRoom.players[shownPid].avatar : null);

      // Only show winning screen over game (not over homepage/menu)
      const activeScreen = document.querySelector('.screen.active');
      const screenId = activeScreen ? activeScreen.id : '';
      const allowedScreens = ['gameScreen'];
      if (!allowedScreens.includes(screenId)) {
        screen.classList.remove('show');
        return;
      }

      // Don't re-show winning screen if user already clicked restart
      const userRestarted = currentRoom && currentRoom.restarts && currentRoom.restarts[playerId];
      if (userRestarted) {
        screen.classList.remove('show');
        return;
      }

      // Update the two secret cards
      const cardWinner = document.getElementById('secretCardWinner');
      const cardOpponent = document.getElementById('secretCardOpponent');

      document.getElementById('secretImgWinner').src = (winnerSecret && winnerSecret.image) ? winnerSecret.image : '';
      document.getElementById('secretNameWinner').textContent = (winnerSecret && winnerSecret.name) ? winnerSecret.name : '---';
      document.getElementById('secretLabelWinner').textContent = 'Winner';

      // Determine second card: opponent when winner, self when loser
      const mySecretId = currentRoom && currentRoom.secrets ? currentRoom.secrets[playerId] : null;
      const mySecretChar = characters && mySecretId ? characters.find(c => c.id === mySecretId) : null;
      const secondSecret = isWinner ? opponentSecret : mySecretChar;

      document.getElementById('secretImgOpponent').src = (secondSecret && secondSecret.image) ? secondSecret.image : '';
      document.getElementById('secretNameOpponent').textContent = (secondSecret && secondSecret.name) ? secondSecret.name : '---';
      document.getElementById('secretLabelOpponent').textContent = isWinner ? 'Opponent' : 'You';

      // Highlight winner card
      cardWinner.classList.add('winner-secret');
      cardOpponent.classList.remove('winner-secret');

      screen.classList.add('show');
    }
    
    function restartGame() {
      if (!currentRoom || !roomCode) return;
      document.getElementById('winningScreen').classList.remove('show');
      database.ref('rooms/' + roomCode + '/restarts/' + playerId).set(true);
      touchActivity();
      showNotification('Restart clicked! Waiting for others...');
      document.getElementById('restartBtn').textContent = 'Waiting...';
      document.getElementById('restartBtn').disabled = true;
    }
    
    let newGameLaunching = false;
    async function launchNewGame() {
      // Guard: the room listener can fire multiple times while state is still
      // 'finished' with all restarts set — only launch once.
      if (newGameLaunching) return;
      await maybePromoteQueue(true); // ⏳ queued players take free seats before the new deal
      if (Object.keys((currentRoom && currentRoom.players) || {}).length < 2) {
        showNotification('Not enough players left — back to the lobby.');
        await returnToLobby();
        return;
      }
      newGameLaunching = true;
      try {
        document.getElementById('winningScreen').classList.remove('show');
        // Skip the lobby: deal a brand new character pool with the SAME rules
        // (accounts, characterCount and the Mix split are kept in the room) and
        // send everyone straight to the character selection screen. Leftover
        // game data is cleared in the same atomic write to avoid UI flicker.
        await generateCharacterPool({
          secrets: null,
          eliminations: null,
          winner: null,
          currentQuestion: null,
          questionHistory: null,
          restarts: null,
          gameChat: null
        });
      } finally {
        newGameLaunching = false;
      }
      document.getElementById('restartBtn').textContent = 'Restart';
      document.getElementById('restartBtn').disabled = false;
      showNotification('New game launched! Pick your character!');
    }
    
    function returnToLobbyFromWin() {
      returnToLobby();
    }

    async function returnToLobby() {
      document.getElementById('winningScreen').classList.remove('show');
      document.getElementById('ucEndScreen').classList.remove('show');
      document.getElementById('hcEndScreen').classList.remove('show');
      await database.ref('rooms/' + roomCode).update({
        state: 'lobby', characters: null, secrets: null, selections: null, currentTurn: null,
        eliminations: null, winner: null, currentQuestion: null, questionHistory: null, gameChat: null, restarts: null, uc: null, br: null, rc: null, bg: null, hc: null
      });
      await database.ref('rooms/' + roomCode + '/players/' + playerId + '/ready').set(false);
      if (currentRoom && currentRoom.players) {
        Object.keys(currentRoom.players).forEach(async (pid) => {
          await database.ref('rooms/' + roomCode + '/players/' + pid + '/ready').set(false);
        });
      }
      
      showScreen('lobbyScreen'); updateLobby();
    }

    // ============================================================
    // ===== UNDERCOVER MODE (3-8 players) ========================
    // ============================================================
    // Words & roles live in rooms/{code}/uc — the HOST's browser acts as
    // the game master (hostUndercoverWatchdog) and moves the game forward
    // when everyone has acted. If the host leaves, ensureHostPresent()
    // promotes another player who then takes over the watchdog.
    const UC_MAX_ROUNDS = 10; // the impostor wins by surviving this many rounds

    function ucAlivePids(room) {
      const r = room || currentRoom;
      const players = r ? (r.players || {}) : {};
      const out = (r && r.uc && r.uc.out) || {};
      // players with a disconnect marker (dcAt) are skipped — the game goes on without them
      return Object.keys(players).filter(pid => !out[pid] && !(players[pid] && players[pid].dcAt));
    }

    // Is the game still PLAYABLE after players left? Only stop when it truly can't go on:
    //  - no impostor left (they all left)    → civilians win
    //  - no civilian left (nobody to vote)   → remaining impostor wins
    // Anything else (even 1 civilian vs 1 impostor) CONTINUES.
    function ucLeaveEndCheck() {
      const uc = (currentRoom && currentRoom.uc) || {};
      const roles = uc.roles || {};
      let civ = 0, uw = 0, mw = 0;
      ucAlivePids().forEach(pid => {
        const r = roles[pid] || 'civilian';
        if (r === 'civilian') civ++; else if (r === 'undercover') uw++; else mw++;
      });
      if (uw === 0 && mw === 0) return 'civilian';
      if (civ === 0) return uw > 0 ? 'undercover' : 'mrwhite';
      return null;
    }

    // Turn-by-turn clue order: the speaking order is fixed when words are dealt
    // (uc.order) and every round the alive players speak in that order.
    // Classic rule enforced: 🃏 Mr. White NEVER speaks first.
    function ucCurrentSpeaker(uc, alive) {
      const base = Array.isArray(uc.order) ? uc.order : Object.values(uc.order || {});
      const order = base.filter(p => alive.indexOf(p) !== -1);
      alive.forEach(p => { if (order.indexOf(p) === -1) order.push(p); }); // safety net
      if (order.length === 0) return null;
      const mw = Object.keys(uc.roles || {}).find(p => uc.roles[p] === 'mrwhite');
      if (order.length > 1 && mw && order[0] === mw) order.push(order.shift());
      const idx = Math.min(uc.turnIdx || 0, order.length - 1);
      return order[idx] || null;
    }

    // Winner check over the current player list:
    //  - civilians win once all impostors (Undercover AND Mr. White) are out
    //  - down to 2 alive: Undercover wins if still alive, otherwise Mr. White
    function ucWinnerCheck(outOverride) {
      const uc = (currentRoom && currentRoom.uc) || {};
      const players = (currentRoom && currentRoom.players) || {};
      const out = outOverride || uc.out || {};
      const roles = uc.roles || {};
      const alive = Object.keys(players).filter(pid => !out[pid]);
      const uwAlive = alive.some(pid => roles[pid] === 'undercover');
      const mwAlive = alive.some(pid => roles[pid] === 'mrwhite');
      const civAlive = alive.some(pid => roles[pid] === 'civilian');
      if (!uwAlive && !mwAlive) return 'civilians';
      if (!civAlive) return uwAlive ? 'undercover' : 'mrwhite';
      if (alive.length <= 2) return uwAlive ? 'undercover' : 'mrwhite';
      return null;
    }

    // Accepts built-in array form ["A","B","c"] and custom object form
    // {a, b, type, imgA?, imgB?} — returns a normalized pair or null.
    function normalizePair(entry) {
      const imgs = (typeof UNDERCOVER_IMAGES !== 'undefined') ? UNDERCOVER_IMAGES : {};
      // Type-aware image lookup: "naruto|s" = the ANIME cover when the pair is
      // about series, plain "naruto" = the character (they can share a name!)
      const imgFor = (word, type) => (imgs[String(word).toLowerCase() + '|' + type] || imgs[String(word).toLowerCase()] || null);
      if (Array.isArray(entry)) {
        if (!entry[0] || !entry[1]) return null;
        const t = entry[2] === 's' ? 's' : 'c';
        return { a: String(entry[0]), b: String(entry[1]), type: t, imgA: imgFor(entry[0], t), imgB: imgFor(entry[1], t) };
      }
      if (entry && entry.a && entry.b) {
        const t = entry.type === 's' ? 's' : 'c';
        return { a: String(entry.a), b: String(entry.b), type: t, imgA: entry.imgA || imgFor(entry.a, t), imgB: entry.imgB || imgFor(entry.b, t) };
      }
      return null;
    }

    // Built-in pairs (undercover.js) + your custom pairs (Firebase), deduped.
    async function getAllUndercoverPairs() {
      const builtIn = (typeof UNDERCOVER_PAIRS !== 'undefined' ? UNDERCOVER_PAIRS : []).map(normalizePair).filter(Boolean);
      let custom = [];
      try {
        const snap = await database.ref('undercoverPairs').once('value');
        const data = snap.val() || {};
        custom = Object.values(data).map(normalizePair).filter(Boolean);
      } catch (e) { console.error('Could not load custom pairs:', e); }
      const seen = new Set();
      const all = [];
      // Custom pairs first: if one of your pairs has the same two words as a
      // built-in, YOUR version wins (lets you upgrade a built-in via the manager)
      custom.concat(builtIn).forEach(p => {
        const key = [p.a.toLowerCase(), p.b.toLowerCase()].sort().join('|');
        if (!seen.has(key)) { seen.add(key); all.push(p); }
      });
      return all;
    }

    // Deals words & roles, then flips the room to 'playing' (all clients react)
    async function startUndercoverGame() {
      if (!currentRoom) return;
      const pids = Object.keys(currentRoom.players || {});
      if (pids.length < 3) { showNotification('Undercover needs at least 3 players!'); return; }
      const useMw = !!(currentRoom.settings && currentRoom.settings.mrWhite);
      if (useMw && pids.length < 4) { showNotification('Mr. White needs at least 4 players — disable it in the settings or wait for more players.'); return; }
      const pairs = await getAllUndercoverPairs();
      const pair = pairs.length ? pairs[Math.floor(Math.random() * pairs.length)] : { a: 'Naruto', b: 'Sasuke', type: 'c', imgA: null, imgB: null };
      const flip = Math.random() < 0.5;
      const roles = {};
      const shuffled = shuffleArray(pids);
      shuffled.forEach(pid => { roles[pid] = 'civilian'; });
      roles[shuffled[0]] = 'undercover';
      if (useMw) roles[shuffled[1]] = 'mrwhite';
      // Turn-by-turn speaking order (fixed for the whole game);
      // Mr. White must NEVER speak first → he is bumped off the first slot.
      const order = shuffled.slice();
      if (useMw && order[0] === shuffled[1]) order.push(order.shift());
      const gameId = (currentRoom.uc && currentRoom.uc.gameId) ? currentRoom.uc.gameId + 1 : 1;
      ucActionKey = '';
      await database.ref('rooms/' + roomCode).update({
        state: 'playing',
        winner: null,
        restarts: null,
        gameChat: null,
        uc: {
          gameId: gameId,
          round: 1,
          phase: 'clues',
          word: flip ? pair.b : pair.a,        // civilians' word
          uwWord: flip ? pair.a : pair.b,      // undercover's word
          wordType: pair.type === 's' ? 'anime series' : 'anime characters',
          wordImg: (flip ? pair.imgB : pair.imgA) || null,
          uwWordImg: (flip ? pair.imgA : pair.imgB) || null,
          roles: roles,
          out: null, clues: null, votes: null,
          order: order, turnIdx: 0, clueLog: null,
          lastEvent: null, mwGuess: null,
          winner: null, winnerPids: null
        }
      });
      touchActivity();
      showNotification('Words dealt! Check your secret word…');
    }

    // HOST-ONLY: advances the game when everyone has acted.
    async function hostUndercoverWatchdog() {
      if (ucWatchBusy || abortingEmptyGame) return;
      const uc = (currentRoom && currentRoom.uc) || null;
      if (!uc || currentRoom.state !== 'playing') return;
      const alive = ucAlivePids();
      if (alive.length === 0) return;
      ucWatchBusy = true;
      try {
        // Leaves/disconnects: END the game only if it truly cannot continue…
        if (uc.phase !== 'mrwhite' && uc.phase !== 'reveal') {
          const endNow = ucLeaveEndCheck();
          if (endNow) { await finishUndercover(endNow, { kind: 'leave' }); return; }
          // …Mr. White gone but the Undercover still hides? He is quietly out — game goes on!
          const mwGone = Object.keys(uc.roles || {}).find(pid => uc.roles[pid] === 'mrwhite' && !(currentRoom.players || {})[pid]);
          if (mwGone && !(uc.out || {})[mwGone]) {
            const upd = {}; upd['uc/out/' + mwGone] = true; upd['uc/lastEvent'] = { kind: 'mwleave' };
            await database.ref('rooms/' + roomCode).update(upd);
            touchActivity(); return; // next watchdog pulse evaluates the new situation
          }
        }
        if (uc.phase === 'clues') {
          const clues = uc.clues || {};
          if (alive.every(pid => clues[pid])) {
            await database.ref('rooms/' + roomCode).update({ 'uc/phase': 'voting', 'uc/votes': null, 'uc/turnIdx': 0 });
            touchActivity();
          } else {
            // Turn-by-turn: once the current speaker has said their word, pass the mic
            const speaker = ucCurrentSpeaker(uc, alive);
            if (speaker && clues[speaker]) {
              await database.ref('rooms/' + roomCode + '/uc/turnIdx').set((uc.turnIdx || 0) + 1);
              touchActivity();
            }
          }
        } else if (uc.phase === 'voting') {
          const votes = uc.votes || {};
          if (alive.every(pid => votes[pid])) await resolveUndercoverVote();
        } else if (uc.phase === 'mrwhite') {
          if (uc.mwGuess && ucsafe(uc.mwGuess.text)) { await resolveMrWhiteGuess(); }
          else {
            // Mr. White disconnected before guessing → skip his guess
            const mwPid = Object.keys(uc.roles || {}).find(pid => uc.roles[pid] === 'mrwhite');
            const playersNow = currentRoom.players || {};
            if (mwPid && !playersNow[mwPid]) {
              const win = ucWinnerCheck();
              if (win) await finishUndercover(win, { kind: 'leave' });
              else {
                await database.ref('rooms/' + roomCode).update({ 'uc/phase': 'reveal', 'uc/votes': null, 'uc/mwGuess': null, 'uc/lastEvent': { kind: 'leave' } });
                touchActivity(); scheduleNextRound();
              }
            }
          }
        } else if (uc.phase === 'reveal') {
          scheduleNextRound(); // keeps going even if a new host took over
        }
      } finally { ucWatchBusy = false; }
    }
    function ucsafe(v) { return !!(v && String(v).trim()); }

    async function resolveUndercoverVote() {
      const uc = currentRoom.uc;
      const players = currentRoom.players || {};
      const votes = Object.values(uc.votes || {});
      const tally = {};
      votes.forEach(v => { tally[v] = (tally[v] || 0) + 1; });
      let maxCount = 0;
      Object.keys(tally).forEach(pid => { if (tally[pid] > maxCount) maxCount = tally[pid]; });
      const top = Object.keys(tally).filter(pid => tally[pid] === maxCount && maxCount > 0);
      if (top.length !== 1) { // tie (or nobody voted) → nobody eliminated
        await database.ref('rooms/' + roomCode).update({ 'uc/phase': 'reveal', 'uc/votes': null, 'uc/lastEvent': { kind: 'vote', tie: true } });
        touchActivity(); scheduleNextRound(); return;
      }
      const target = top[0];
      const role = (uc.roles || {})[target] || 'civilian';
      const tname = players[target] ? (players[target].name || 'A player') : 'A player';
      const updates = {};
      updates['uc/out/' + target] = true;
      updates['uc/votes'] = null;
      updates['uc/lastEvent'] = { kind: 'vote', pid: target, name: tname, role: role, tie: false };
      if (role === 'mrwhite') {
        updates['uc/phase'] = 'mrwhite'; // Mr. White gets one last shot at guessing the word
      } else {
        const newOut = Object.assign({}, uc.out || {}, { [target]: true });
        const win = ucWinnerCheck(newOut);
        if (win) {
          await database.ref('rooms/' + roomCode).update(updates);
          touchActivity();
          await finishUndercover(win, updates['uc/lastEvent']);
          return;
        }
        updates['uc/phase'] = 'reveal';
      }
      await database.ref('rooms/' + roomCode).update(updates);
      touchActivity();
      if (updates['uc/phase'] === 'reveal') scheduleNextRound();
    }

    // ===== Mr. White last-chance guess: autocomplete + forgiving match =====
    let mwSugHits = [], mwSugIndex = -1;
    function ucNorm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
    let mwCustomWords = null; // custom pairs from Firebase, loaded once (async)
    function warmMwPool() {
      if (mwCustomWords !== null) return;
      mwCustomWords = [];
      getAllUndercoverPairs().then(all => {
        mwCustomWords = [];
        all.forEach(p => { if (p.a) mwCustomWords.push(p.a); if (p.b) mwCustomWords.push(p.b); });
      }).catch(function () {});
    }
    function ucMwWordPool() { // every word the game can deal (built-in + custom + current round)
      const pool = new Set();
      (typeof UNDERCOVER_PAIRS !== 'undefined' ? UNDERCOVER_PAIRS : []).forEach(p => { if (p[0]) pool.add(p[0]); if (p[1]) pool.add(p[1]); });
      (mwCustomWords || []).forEach(w => pool.add(w));
      const uc = (currentRoom && currentRoom.uc) || {};
      if (uc.word) pool.add(uc.word);
      return [...pool].sort();
    }
    function hideMwSuggest() { const b = document.getElementById('ucMwSuggest'); if (b) { b.classList.remove('show'); b.innerHTML = ''; } mwSugHits = []; mwSugIndex = -1; }
    function ucMwSuggest() {
      warmMwPool(); // fire-and-forget: next keystrokes will also see custom pairs
      const inp = document.getElementById('ucMwInput');
      const box = document.getElementById('ucMwSuggest');
      if (!inp || !box) return;
      const q = ucNorm(inp.value);
      if (q.length < 2) { hideMwSuggest(); return; }
      const hits = ucMwWordPool().filter(w => {
        const n = ucNorm(w);
        return n.indexOf(q) >= 0 || n.split(' ').some(t => t.indexOf(q) === 0);
      }).slice(0, 8);
      if (!hits.length) { hideMwSuggest(); return; }
      mwSugHits = hits; mwSugIndex = -1;
      box.innerHTML = hits.map((w, i) => '<div class="bg-sug-row" onmousedown="ucMwPick(' + i + ');event.preventDefault()"><span class="bg-sug-name">' + escapeHtml(w) + '</span></div>').join('');
      box.classList.add('show');
    }
    function ucMwPick(i) {
      const inp = document.getElementById('ucMwInput');
      if (!inp || !mwSugHits[i]) return;
      inp.value = mwSugHits[i]; hideMwSuggest(); inp.focus();
    }
    function ucMwKey(e) {
      const box = document.getElementById('ucMwSuggest');
      if (e.key === 'Enter') { e.preventDefault(); hideMwSuggest(); submitMrWhiteGuess(); return; }
      if (!box || !box.classList.contains('show') || !mwSugHits.length) { if (e.key === 'Escape') hideMwSuggest(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        mwSugIndex = e.key === 'ArrowDown' ? (mwSugIndex + 1) % mwSugHits.length : (mwSugIndex - 1 + mwSugHits.length) % mwSugHits.length;
        box.querySelectorAll('.bg-sug-row').forEach((r, i) => r.classList.toggle('sel', i === mwSugIndex));
        const inp = document.getElementById('ucMwInput'); if (inp) inp.value = mwSugHits[mwSugIndex];
      } else if (e.key === 'Escape') hideMwSuggest();
    }
    // Forgiving match: exact, token reorder ("Itadori Yuji"), partial name ("Yuji"),
    // or a 4+ letter token with a small typo ("Mikassa").
    function ucWordsMatch(guess, secret) {
      const g = ucNorm(guess), n = ucNorm(secret);
      if (!g || !n) return false;
      if (g === n) return true;
      const gT = g.split(' '), nT = n.split(' ');
      if ([...gT].sort().join(' ') === [...nT].sort().join(' ')) return true;
      if (gT.length <= nT.length && gT.every(w => nT.some(t => w === t || (w.length >= 4 && t.length >= 4 && bgWordClose(w, t))))) return true;
      if ((g.length >= 4 && n.indexOf(g) >= 0) || (n.length >= 4 && g.indexOf(n) >= 0)) return true;
      return false;
    }

    async function resolveMrWhiteGuess() {
      const uc = currentRoom.uc;
      const players = currentRoom.players || {};
      const guessText = (uc.mwGuess && uc.mwGuess.text) ? String(uc.mwGuess.text) : '';
      const mwPid = Object.keys(uc.roles || {}).find(pid => uc.roles[pid] === 'mrwhite') || null;
      const mwName = (mwPid && players[mwPid]) ? players[mwPid].name : 'Mr. White';
      const correct = guessText.length > 0 && ucWordsMatch(guessText, uc.word);
      const ev = correct
        ? { kind: 'mwguess', name: mwName, guess: guessText, correct: true, word: uc.word }
        : { kind: 'mwguess', name: mwName, guess: guessText, correct: false };
      if (correct) { await finishUndercover('mrwhite', ev); return; }
      const win = ucWinnerCheck(); // MW is already out; maybe the Undercover is still hiding
      if (win) { await finishUndercover(win, ev); return; }
      await database.ref('rooms/' + roomCode).update({ 'uc/phase': 'reveal', 'uc/votes': null, 'uc/mwGuess': null, 'uc/lastEvent': ev });
      touchActivity(); scheduleNextRound();
    }

    async function finishUndercover(winnerKey, lastEvent) {
      const uc = (currentRoom && currentRoom.uc) || {};
      const players = (currentRoom && currentRoom.players) || {};
      const pids = Object.keys(players);
      const roles = uc.roles || {};
      let winnerPids = [];
      if (winnerKey === 'civilians') winnerPids = pids.filter(p => roles[p] === 'civilian');
      else if (winnerKey === 'undercover') winnerPids = pids.filter(p => roles[p] === 'undercover');
      else winnerPids = pids.filter(p => roles[p] === 'mrwhite');
      await database.ref('rooms/' + roomCode).update({
        state: 'finished',
        'uc/phase': 'over',
        'uc/winner': winnerKey,
        'uc/winnerPids': winnerPids,
        'uc/lastEvent': lastEvent || null,
        'uc/votes': null,
        'uc/mwGuess': null
      });
      touchActivity();
    }

    // Host-side 4.5s pause on the result banner, then deals the next round
    function scheduleNextRound() {
      const uc = (currentRoom && currentRoom.uc) || null;
      if (!uc || uc.phase !== 'reveal') return;
      const code = roomCode, gid = uc.gameId, rd = uc.round || 1;
      setTimeout(async () => {
        if (!roomCode || roomCode !== code || !isHost || !currentRoom || !currentRoom.uc) return;
        if (currentRoom.state !== 'playing') return;
        if (currentRoom.uc.gameId !== gid || (currentRoom.uc.round || 1) !== rd || currentRoom.uc.phase !== 'reveal') return;
        if (rd >= UC_MAX_ROUNDS) { await finishUndercover('undercover', { kind: 'limit' }); return; }
        await database.ref('rooms/' + code).update({
          'uc/round': rd + 1, 'uc/phase': 'clues', 'uc/clues': null, 'uc/votes': null, 'uc/lastEvent': null, 'uc/mwGuess': null, 'uc/turnIdx': 0
        });
        touchActivity();
      }, 4500);
    }

    // ===== PLAYER ACTIONS =====
    async function submitUndercoverClue() {
      if (!currentRoom || !currentRoom.uc || currentRoom.state !== 'playing') return;
      const uc = currentRoom.uc;
      if (uc.phase !== 'clues' || (uc.out || {})[playerId]) return;
      if (uc.clues && uc.clues[playerId]) return;
      // Turn-by-turn rule: you can only describe your word on your turn
      if (uc.order) {
        const sp = ucCurrentSpeaker(uc, ucAlivePids());
        if (sp && sp !== playerId) { showNotification('Not your turn yet — wait for the others!'); return; }
      }
      const input = document.getElementById('ucClueInput');
      if (!input) return;
      const text = input.value.trim();
      if (!text) { showNotification('Write a short clue first!'); return; }
      // Classic rule: you can't say your own word
      const myWord = ((uc.roles || {})[playerId] === 'undercover') ? uc.uwWord : uc.word;
      if (myWord) {
        const esc = String(myWord).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp('\\b' + esc + '\\b', 'i');
        if (re.test(text)) { showNotification('You cannot say your word! Describe it instead.'); return; }
      }
      input.disabled = true;
      await database.ref('rooms/' + roomCode + '/uc/clues/' + playerId).set(text);
      // …also archived in the round history so everyone can re-read older clues
      try { await database.ref('rooms/' + roomCode + '/uc/clueLog/r' + (uc.round || 1) + '/' + playerId).set(text); } catch (e) {}
      touchActivity();
    }

    async function voteUndercover(suspectPid) {
      if (!currentRoom || !currentRoom.uc || currentRoom.state !== 'playing') return;
      const uc = currentRoom.uc;
      if (uc.phase !== 'voting') return;
      if ((uc.out || {})[playerId]) return;
      if (uc.votes && uc.votes[playerId]) return;
      await database.ref('rooms/' + roomCode + '/uc/votes/' + playerId).set(suspectPid);
      touchActivity();
    }

    async function submitMrWhiteGuess() {
      const uc = (currentRoom && currentRoom.uc) || null;
      if (!uc || uc.phase !== 'mrwhite') return;
      const input = document.getElementById('ucMwInput');
      if (!input) return;
      const text = input.value.trim();
      if (!text) { showNotification('Type your guess first!'); return; }
      input.disabled = true;
      await database.ref('rooms/' + roomCode + '/uc/mwGuess').set({ by: playerId, text: text });
      touchActivity();
    }

    // ===== HOST: deal a NEW pair of words mid-game (same roles, round restarts) =====
    function hostRerollUndercoverWords() {
      if (!isHost || !currentRoom || currentRoom.game !== 'undercover' || !currentRoom.uc) return;
      const uc = currentRoom.uc;
      if (currentRoom.state !== 'playing' || ['clues', 'voting', 'reveal'].indexOf(uc.phase) === -1) {
        showNotification('Words can only be changed during description/vote phases.'); return;
      }
      showInteraction(ic('dice') + ' Shuffle words & roles?', 'Deals NEW words AND new roles (a new Undercover is picked among the still-playing players). The round restarts.', [
        { label: 'Cancel', onclick: () => {}, class: 'secondary' },
        { label: ic('dice') + ' Shuffle it!', class: 'warning', onclick: () => doUcWordReroll() }
      ]);
    }

    async function doUcWordReroll() {
      const uc = (currentRoom && currentRoom.uc) || {};
      const pairs = await getAllUndercoverPairs();
      if (!pairs.length) { showNotification('No word pairs available!'); return; }
      let pair = pairs[Math.floor(Math.random() * pairs.length)];
      // avoid re-dealing the exact same pair when possible
      for (let i = 0; i < 6 && pair && (pair.a === uc.word || pair.b === uc.word || pair.a === uc.uwWord || pair.b === uc.uwWord); i++) {
        pair = pairs[Math.floor(Math.random() * pairs.length)];
      }
      const flip = Math.random() < 0.5;
      const updates = {
        'uc/word': flip ? pair.b : pair.a,
        'uc/uwWord': flip ? pair.a : pair.b,
        'uc/wordType': pair.type === 's' ? 'anime series' : 'anime characters',
        'uc/wordImg': (flip ? pair.imgB : pair.imgA) || null,
        'uc/uwWordImg': (flip ? pair.imgA : pair.imgB) || null,
        'uc/phase': 'clues',
        'uc/clues': null,
        'uc/votes': null,
        'uc/turnIdx': 0,
        'uc/lastEvent': { kind: 'reroll' }
      };
      updates['uc/clueLog/r' + (uc.round || 1)] = null; // fresh history slice for the restarted round
      // Roles are shuffled too: a NEW Undercover (and Mr. White if enabled)
      // is picked among the players still alive; eliminated players stay out.
      const playersNow = currentRoom.players || {};
      const oldRoles = uc.roles || {};
      const hadMw = Object.keys(oldRoles).some(pid => oldRoles[pid] === 'mrwhite');
      const aliveNow = shuffleArray(ucAlivePids());
      const newRoles = {};
      Object.keys(playersNow).forEach(pid => { newRoles[pid] = oldRoles[pid] || 'civilian'; });
      aliveNow.forEach(pid => { newRoles[pid] = 'civilian'; });
      if (aliveNow.length >= 1) newRoles[aliveNow[0]] = 'undercover';
      if (hadMw && aliveNow.length >= 3) newRoles[aliveNow[1]] = 'mrwhite';
      updates['uc/roles'] = newRoles;
      try { await database.ref('rooms/' + roomCode).update(updates); } catch (e) { showNotification('Error: ' + e.message); }
      touchActivity();
    }

    function toggleUcWord() {
      ucWordHidden = !ucWordHidden;
      const wordEl = document.getElementById('ucMyWord');
      if (ucWordHidden) wordEl.classList.add('blurred'); else wordEl.classList.remove('blurred');
      const imgEl = document.getElementById('ucMyWordImg');
      if (imgEl && imgEl.style.display !== 'none') {
        if (ucWordHidden) imgEl.classList.add('blurred'); else imgEl.classList.remove('blurred');
      }
    }

    // Return to the lobby WITHOUT ending the game: the player is marked out for
    // THIS game and waits in the lobby. The others keep playing. A fresh "Play
    // Again" automatically brings them back into the action.
    async function returnToLobbyFromUndercover() {
      const uc = (currentRoom && currentRoom.uc) || null;
      const inGame = currentRoom && (currentRoom.state === 'playing' || currentRoom.state === 'finished') && uc;
      if (!inGame) { showScreen('lobbyScreen'); return; }
      // Game over → EVERYONE goes back to a real 'lobby' state (see the
      // comment on resetRoomToLobbyAfterGame — the queue depends on it).
      if (currentRoom.state === 'finished') {
        showInteraction('Return to Lobby?', 'The game is over — <b>everyone</b> goes back to the lobby' + (Object.keys((currentRoom && currentRoom.queue) || {}).length ? ' and waiting players from the queue take free seats.' : '.'), [
          { label: 'Stay here', onclick: () => { closeInteraction(); }, class: 'secondary' },
          { label: 'To Lobby', onclick: async () => { closeInteraction(); try { await resetRoomToLobbyAfterGame(); } catch (e) {} document.getElementById('ucEndScreen').classList.remove('show'); showScreen('lobbyScreen'); }, class: 'danger' }
        ]);
        return;
      }
      showInteraction('Return to Lobby?', 'The game continues for the others — you wait in the lobby until it ends.', [
        { label: 'Stay in the game', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: 'To Lobby', onclick: async () => {
          closeInteraction();
          try {
            const updates = {};
            updates['rooms/' + roomCode + '/players/' + playerId + '/outInGame'] = uc.gameId || 1;
            if (currentRoom.state === 'playing') updates['rooms/' + roomCode + '/uc/out/' + playerId] = true;
            updates['rooms/' + roomCode + '/players/' + playerId + '/ready'] = false;
            await database.ref().update(updates);
          } catch (e) {}
          showScreen('lobbyScreen');
        }, class: 'danger' }
      ]);
    }

    function ucRestart() {
      if (!currentRoom || !roomCode) return;
      database.ref('rooms/' + roomCode + '/restarts/' + playerId).set(true);
      touchActivity();
      showNotification('Play Again clicked! Waiting for others…');
      const btn = document.getElementById('ucRestartBtn');
      if (btn) { btn.textContent = 'Waiting…'; btn.disabled = true; }
    }

    async function launchNewUndercover() {
      if (ucLaunching) return;
      ucLaunching = true;
      try {
        await maybePromoteQueue(true); // ⏳ fill seats from the queue before re-dealing
        const snap = await database.ref('rooms/' + roomCode).once('value');
        currentRoom = snap.val();
        document.getElementById('ucEndScreen').classList.remove('show');
        await startUndercoverGame();
      } finally { ucLaunching = false; }
    }

    // ===== RENDERING =====
    function ucEventText(ev) {
      if (!ev) return '';
      if (ev.kind === 'vote') {
        if (ev.tie) return 'Tie vote — nobody was eliminated!';
        let roleTxt = 'They were a CIVILIAN… oops!';
        if (ev.role === 'undercover') roleTxt = 'They were the UNDERCOVER!';
        if (ev.role === 'mrwhite') roleTxt = 'They were MR. WHITE!';
        return ev.name + ' was voted out… ' + roleTxt;
      }
      if (ev.kind === 'mwguess') {
        return ev.correct
          ? ev.name + ' guessed the word "' + ev.word + '" — CORRECT!'
          : ev.name + ' guessed "' + ev.guess + '" — WRONG!';
      }
      if (ev.kind === 'limit') return 'Round limit reached — the impostor survived!';
      if (ev.kind === 'leave') return 'Too many players left — the game cannot continue.';
      if (ev.kind === 'mwleave') return 'Mr. White left the game — he is out! The game goes on!';
      if (ev.kind === 'reroll') return 'The host shuffled everything — NEW words AND NEW roles! Round restarts!';
      return '';
    }

    function updateUndercover() {
      if (!currentRoom || currentRoom.game !== 'undercover') return;
      const uc = currentRoom.uc || {};
      const players = currentRoom.players || {};
      const pids = Object.keys(players);
      const out = uc.out || {};
      const roles = uc.roles || {};
      const myRole = roles[playerId] || null;
      const iAmOut = !!out[playerId];

      // Header badges
      document.getElementById('ucRoundBadge').textContent = 'Round ' + (uc.round || 1);
      const phaseNames = { clues: 'Description time', voting: 'Voting time', reveal: 'Result', mrwhite: 'Mr. White guesses…', over: 'Game over' };
      const phaseIcons = { clues: 'chat', voting: 'hand', reveal: 'search', mrwhite: 'help', over: 'flag' };
      document.getElementById('ucPhaseBadge').innerHTML = phaseNames[uc.phase] ? ic(phaseIcons[uc.phase]) + ' ' + phaseNames[uc.phase] : '';
      // Host-only "🎲 New words" button (not during Mr. White's guess or after the game)
      const rb = document.getElementById('ucNewWordsBtn');
      if (rb) rb.style.display = (isHost && currentRoom.state === 'playing' && ['clues', 'voting', 'reveal'].indexOf(uc.phase) !== -1) ? 'inline-block' : 'none';

      // Private word card — roles stay SECRET: civilians and the undercover
      // see the exact same card (label, border, hint), only Mr. White is told
      // he's wordless (that's how the game is meant to be played).
      const wordEl = document.getElementById('ucMyWord');
      const roleLabel = document.getElementById('ucRoleLabel');
      const roleHint = document.getElementById('ucRoleHint');
      const wordCard = document.getElementById('ucWordCard');
      wordCard.className = 'uc-word-card' + (myRole === 'mrwhite' ? ' mrwhite' : '');
      if (myRole === 'mrwhite') {
        roleLabel.textContent = 'You are MR. WHITE';
        wordEl.textContent = '— no word —';
        roleHint.textContent = 'You have NO word! Listen to the clues and improvise.';
      } else {
        roleLabel.textContent = 'Your secret word';
        // your word is uwWord if you're the undercover — but you are NOT told that!
        wordEl.textContent = (myRole === 'undercover') ? (uc.uwWord || '---') : (uc.word || '---');
        roleHint.textContent = 'Describe your word without saying it! One player might have a slightly different word… is it you?';
      }
      const imgEl = document.getElementById('ucMyWordImg');
      const myImg = myRole === 'undercover' ? (uc.uwWordImg || null) : (myRole === 'mrwhite' ? null : (uc.wordImg || null));
      if (myImg) {
        imgEl.src = myImg; imgEl.style.display = 'block';
        if (ucWordHidden) imgEl.classList.add('blurred'); else imgEl.classList.remove('blurred');
      } else { imgEl.src = ''; imgEl.style.display = 'none'; }
      if (ucWordHidden) wordEl.classList.add('blurred'); else wordEl.classList.remove('blurred');

      // Event banner (vote results, Mr. White guess…)
      const banner = document.getElementById('ucEventBanner');
      if (uc.lastEvent) { banner.style.display = 'block'; banner.textContent = ucEventText(uc.lastEvent); }
      else { banner.style.display = 'none'; banner.textContent = ''; }

      // Player tiles
      const grid = document.getElementById('ucPlayers');
      grid.innerHTML = '';
      const clues = uc.clues || {};
      const votes = uc.votes || {};
      const iVoted = !!votes[playerId];
      const speaker = (currentRoom.state === 'playing' && uc.phase === 'clues' && uc.order) ? ucCurrentSpeaker(uc, ucAlivePids()) : null;
      pids.forEach(pid => {
        const p = players[pid] || {};
        const tile = document.createElement('div');
        tile.className = 'uc-player-tile' + (out[pid] ? ' dead' : '') + (pid === playerId ? ' me' : '');
        let status = '';
        if (out[pid]) status = 'out';
        else if (players[pid] && players[pid].dcAt) status = 'away…';
        else if (uc.phase === 'clues') {
          status = clues[pid] ? 'said theirs'
            : (speaker === pid ? 'their turn!'
            : 'waiting their turn');
        }
        else if (uc.phase === 'voting') status = votes[pid] ? 'voted' : 'voting…';
        tile.innerHTML = avatarCircle(p.avatar, 'ava-tile') + '<div class="uc-tile-name">' + escapeHtml(String(p.name || '?')) + (pid === playerId ? ' (You)' : '') + '</div><div class="uc-tile-status">' + status + '</div>';
        if (currentRoom.state === 'playing' && uc.phase === 'voting' && !iAmOut && !iVoted && !out[pid] && pid !== playerId) {
          tile.classList.add('votable');
          const btn = document.createElement('button');
          btn.className = 'danger uc-vote-btn';
          btn.textContent = 'Vote';
          btn.addEventListener('click', (e) => { e.stopPropagation(); voteUndercover(pid); });
          tile.appendChild(btn);
        }
        grid.appendChild(tile);
      });

      // Word history — every clue of every round, grouped and readable again
      const clueList = document.getElementById('ucClueList');
      if (uc.clueLog) {
        const roundKeys = Object.keys(uc.clueLog).sort((a, b) => (parseInt(String(a).slice(1), 10) || 0) - (parseInt(String(b).slice(1), 10) || 0));
        let html = '';
        roundKeys.forEach(rk => {
          const entries = uc.clueLog[rk] || {};
          html += '<div class="uc-log-round">— Round ' + escapeHtml(String(rk).slice(1)) + ' —</div>';
          Object.keys(entries).forEach(pid => {
            html += '<div class="uc-clue"><strong>' + escapeHtml(String(players[pid] ? players[pid].name : '?')) + ':</strong>' + escapeHtml(String(entries[pid])) + '</div>';
          });
        });
        clueList.innerHTML = html || '<p style="text-align: center; color: var(--muted); font-size: 0.85rem; padding: 10px;">No clues yet this round.</p>';
      } else {
        // Fallback for rooms started before the history existed (current round only)
        const clueEntries = pids.filter(pid => clues[pid]);
        if (clueEntries.length === 0) {
          clueList.innerHTML = '<p style="text-align: center; color: var(--muted); font-size: 0.85rem; padding: 10px;">No clues yet this round.</p>';
        } else {
          clueList.innerHTML = '';
          clueEntries.forEach(pid => {
            const div = document.createElement('div');
            div.className = 'uc-clue';
            div.innerHTML = '<strong>' + escapeHtml(String(players[pid] ? players[pid].name : '?')) + ':</strong>' + escapeHtml(String(clues[pid]));
            clueList.appendChild(div);
          });
        }
      }
      clueList.scrollTop = clueList.scrollHeight;

      renderUcAction();

      // End of game: overlay + stats
      if (currentRoom.state === 'finished' && uc.winner) {
        const gid = String(roomCode) + '_' + String(uc.gameId || 1);
        if (ucStatCountedFor !== gid) {
          ucStatCountedFor = gid;
          const wpids = Array.isArray(uc.winnerPids) ? uc.winnerPids : Object.values(uc.winnerPids || {});
          recordUndercoverResult(wpids.indexOf(playerId) !== -1);
        }
        renderUcEndScreen();
      } else {
        document.getElementById('ucEndScreen').classList.remove('show');
      }
    }

    // The action area (clue input / vote hint / Mr. White guess / waiting line).
    // Rebuilt ONLY when the situation changes, so typing is never interrupted
    // by other players' updates.
    function renderUcAction() {
      const uc = (currentRoom && currentRoom.uc) || {};
      const area = document.getElementById('ucActionArea');
      const out = uc.out || {};
      const iAmOut = !!out[playerId];
      const myRole = (uc.roles || {})[playerId];
      const clues = uc.clues || {};
      const votes = uc.votes || {};
      const alive = ucAlivePids();
      const speaker = (currentRoom.state === 'playing' && uc.phase === 'clues' && uc.order) ? ucCurrentSpeaker(uc, alive) : null;
      const key = [uc.gameId, uc.round, uc.phase, !!clues[playerId], !!votes[playerId], iAmOut, myRole, currentRoom.state, speaker].join('|');
      if (key !== ucActionKey) {
        ucActionKey = key;
        area.innerHTML = '';
        if (currentRoom.state === 'playing' && uc.phase === 'clues' && !iAmOut && !clues[playerId] && (!speaker || speaker === playerId)) {
          area.innerHTML = '<div class="uc-action-form"><input type="text" id="ucClueInput" maxlength="80" placeholder="Describe your word in one short clue… (don\'t say it!)"><button class="success" onclick="submitUndercoverClue()">Send Clue</button></div>';
          const inp = document.getElementById('ucClueInput');
          inp.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitUndercoverClue(); });
          inp.focus();
        } else if (currentRoom.state === 'playing' && uc.phase === 'mrwhite' && myRole === 'mrwhite') {
          area.innerHTML = '<div class="uc-action-form"><div class="mw-wrap"><input type="text" id="ucMwInput" maxlength="60" autocomplete="off" placeholder="You were caught! Last chance — guess the civilians\' word…" oninput="ucMwSuggest()" onkeydown="ucMwKey(event)"><div class="bg-suggest" id="ucMwSuggest"></div></div><button class="warning" onclick="hideMwSuggest();submitMrWhiteGuess()">Guess</button></div><div class="uc-hint-line">' + ic('search') + ' Start typing and pick a suggestion — partial names like \'Yuji\' also count!</div>';
          const inp2 = document.getElementById('ucMwInput');
          inp2.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitMrWhiteGuess(); });
          inp2.focus();
        } else {
          const wait = document.createElement('div');
          wait.className = 'uc-waiting';
          wait.id = 'ucWaitingLine';
          area.appendChild(wait);
        }
      }
      // Refresh the waiting/progress line (never touches inputs)
      const wait = document.getElementById('ucWaitingLine');
      if (wait) {
        if (currentRoom.state !== 'playing' || uc.phase === 'over') wait.textContent = '';
        else if (iAmOut) wait.textContent = 'You are out — watch how it ends!';
        else if (uc.phase === 'clues') {
          if (clues[playerId]) {
            wait.textContent = 'Your clue is in! Waiting for the others (' + alive.filter(p => clues[p]).length + '/' + alive.length + ')…';
          } else if (speaker && speaker !== playerId) {
            const spName = (currentRoom.players && currentRoom.players[speaker]) ? currentRoom.players[speaker].name : 'A player';
            wait.textContent = spName + ' is describing their word… your turn comes after (' + alive.filter(p => clues[p]).length + '/' + alive.length + ' done)';
          } else wait.textContent = '';
        }
        else if (uc.phase === 'voting') {
          wait.textContent = votes[playerId]
            ? 'Vote cast! Waiting (' + alive.filter(p => votes[p]).length + '/' + alive.length + ')…'
            : 'Click a player\'s tile to vote them out!';
        }
        else if (uc.phase === 'mrwhite') wait.textContent = 'Mr. White is trying to guess your word…';
        else if (uc.phase === 'reveal') wait.textContent = 'Next round starting…';
      }
    }

    function renderUcEndScreen() {
      const screen = document.getElementById('ucEndScreen');
      const uc = currentRoom.uc || {};
      const players = currentRoom.players || {};
      const pids = Object.keys(players);
      const roles = uc.roles || {};
      const wpids = Array.isArray(uc.winnerPids) ? uc.winnerPids : Object.values(uc.winnerPids || {});
      const iWon = wpids.indexOf(playerId) !== -1;

      const title = document.getElementById('ucWinTitle');
      if (uc.winner === 'undercover') title.textContent = 'The Undercover Wins!';
      else if (uc.winner === 'mrwhite') title.textContent = 'Mr. White Wins!';
      else title.textContent = 'Civilians Win!';
      const personal = document.getElementById('ucWinPersonal');
      personal.textContent = iWon ? 'You won this one!' : 'You lost this one!';
      personal.style.color = iWon ? 'var(--success)' : 'var(--danger)';
      const civImg = uc.wordImg ? '<img class="uc-end-img" src="' + escapeHtml(String(uc.wordImg)) + '" alt="">' : '';
      const uwImg = uc.uwWordImg ? '<img class="uc-end-img" src="' + escapeHtml(String(uc.uwWordImg)) + '" alt="">' : '';
      document.getElementById('ucWordsLine').innerHTML =
        'The <strong>' + escapeHtml(String(uc.wordType || 'anime')) + '</strong> words were:<br>' +
        civImg + ic('users') + ' Civilians: <strong style="color: var(--accent);">' + escapeHtml(String(uc.word || '?')) + '</strong>' +
        ' &nbsp;·&nbsp; ' + uwImg + ic('spy') + ' Undercover: <strong style="color: var(--warning);">' + escapeHtml(String(uc.uwWord || '?')) + '</strong>';

      // Roles reveal list
      const list = document.getElementById('ucRevealList');
      list.innerHTML = '';
      const roleLabel = { civilian: 'Civilian', undercover: 'Undercover', mrwhite: 'Mr. White' };
      const roleColor = { civilian: 'var(--text)', undercover: 'var(--warning)', mrwhite: 'var(--danger)' };
      const sorted = pids.slice().sort((a, b) => {
        const order = { undercover: 0, mrwhite: 1, civilian: 2 };
        return (order[roles[a]] !== undefined ? order[roles[a]] : 3) - (order[roles[b]] !== undefined ? order[roles[b]] : 3);
      });
      sorted.forEach(pid => {
        const p = players[pid] || {};
        const row = document.createElement('div');
        row.className = 'uc-reveal-row';
        row.innerHTML = '<span class="uc-reveal-who">' + avatarCircle(p.avatar, 'ava-chat') + '<span>' + escapeHtml(String(p.name || '?')) + (pid === playerId ? ' (You)' : '') + '</span></span><span class="uc-reveal-role" style="color: ' + (roleColor[roles[pid]] || 'var(--text)') + ';">' + (roleLabel[roles[pid]] || 'Civilian') + '</span>';
        list.appendChild(row);
      });

      // Only show over the undercover screen
      const activeScreen = document.querySelector('.screen.active');
      const screenId = activeScreen ? activeScreen.id : '';
      if (screenId !== 'undercoverScreen') { screen.classList.remove('show'); return; }
      // Hide again once this player clicked Play Again
      const restarts = currentRoom.restarts || {};
      if (restarts[playerId]) screen.classList.remove('show');
      else screen.classList.add('show');

      // Restart status & auto-launch (host side) — players spectating from the
      // lobby are NOT required to click "Play Again"
      const statusEl = document.getElementById('ucRestartStatus');
      const btn = document.getElementById('ucRestartBtn');
      const eligible = pids.filter(pid => !(players[pid] && players[pid].outInGame && players[pid].outInGame === uc.gameId));
      const total = eligible.length;
      const clicked = eligible.filter(pid => restarts[pid]).length;
      if (total > 0 && clicked >= total) {
        if (isHost) {
          if (statusEl) statusEl.textContent = 'Everyone is ready! Dealing new words…';
          launchNewUndercover();
        } else if (statusEl) statusEl.textContent = 'Waiting for the host to deal new words…';
      } else if (statusEl) statusEl.textContent = 'Ready for a new game: ' + clicked + '/' + total;
      if (btn) {
        if (restarts[playerId]) { btn.textContent = 'Waiting…'; btn.disabled = true; }
        else { btn.textContent = 'Play Again'; btn.disabled = false; }
      }
    }

    // ============================================================
    // ===== UNDERCOVER CUSTOM WORD PAIRS (shared via Firebase) ===
    // ============================================================
    // Custom pairs live in the /undercoverPairs node: readable by everyone
    // (rooms read them when dealing words), writable by logged-in players.
    // Each entry: { a, b, type: 'c'|'s', imgA?, imgB? } — the pictures are
    // official AniList images picked through the search in the modal.
    let pairType = 'c';                          // pair type being added: 'c' characters | 's' series
    const pairPicked = { a: null, b: null };     // AniList pick per slot: {name, img}
    let pairSearchTarget = 'a';                  // which slot the current search feeds

    function selectPairType(t) {
      pairType = t === 's' ? 's' : 'c';
      document.getElementById('pairTypeC').classList.toggle('selected', pairType === 'c');
      document.getElementById('pairTypeS').classList.toggle('selected', pairType === 's');
    }

    function pairSlotImg(slot) {
      const picked = pairPicked[slot];
      if (!picked) return null;
      const input = document.getElementById(slot === 'a' ? 'pairInputA' : 'pairInputB');
      return input.value.trim() === picked.name ? (picked.img || null) : null; // user edited the name after picking → drop the image
    }

    async function openPairsModal() {
      if (!firebase.auth().currentUser) { showNotification('Log in first (profile menu) to manage word pairs.'); return; }
      document.getElementById('pairInputA').value = '';
      document.getElementById('pairInputB').value = '';
      pairPicked.a = null; pairPicked.b = null;
      document.getElementById('pairImgA').style.display = 'none';
      document.getElementById('pairImgB').style.display = 'none';
      document.getElementById('pairResults').innerHTML = '';
      selectPairType(pairType);
      document.getElementById('pairsModal').classList.add('show');
      renderPairList();
    }
    function closePairsModal() { document.getElementById('pairsModal').classList.remove('show'); }

    // AniList search feeding the modal — characters or anime series per pair type
    async function pairAniListSearch(slot) {
      pairSearchTarget = slot;
      const input = document.getElementById(slot === 'a' ? 'pairInputA' : 'pairInputB');
      const q = input.value.trim();
      if (q.length < 2) { showNotification('Type a name first, then search.'); return; }
      const results = document.getElementById('pairResults');
      results.innerHTML = '<p style="color: var(--muted); text-align: center; font-size: 0.85rem; padding: 8px;">Searching AniList…</p>';
      const btn = document.getElementById(slot === 'a' ? 'pairSearchABtn' : 'pairSearchBBtn');
      btn.disabled = true;
      try {
        const items = pairType === 's' ? await searchAniListAnime(q) : await searchAniListCharacters(q);
        if (!items.length) { results.innerHTML = '<p style="color: var(--muted); text-align: center; font-size: 0.85rem; padding: 8px;">Nothing found on AniList for "' + escapeHtml(q) + '".</p>'; btn.disabled = false; return; }
        results.innerHTML = '<p style="color: var(--muted); text-align: center; font-size: 0.8rem; margin-bottom: 2px;">Click a result to use it for Word ' + slot.toUpperCase() + ':</p>';
        const grid = document.createElement('div');
        grid.className = 'pair-results-grid';
        items.forEach(it => {
          const card = document.createElement('div');
          card.className = 'pair-result';
          card.innerHTML = '<img src="' + escapeHtml(it.img || '') + '" alt="" onerror="this.style.display=\'none\'"><div class="pr-name">' + escapeHtml(it.name) + '</div>';
          card.addEventListener('click', () => pickPairItem(slot, it));
          grid.appendChild(card);
        });
        results.appendChild(grid);
      } catch (e) {
        results.innerHTML = '<p style="color: var(--danger); text-align: center; font-size: 0.85rem; padding: 8px;">Search failed: ' + escapeHtml(e.message || 'error') + '</p>';
      }
      btn.disabled = false;
    }

    async function searchAniListCharacters(q) {
      const query = 'query ($s: String) { Page(page: 1, perPage: 10) { characters(search: $s, sort: [FAVOURITES_DESC]) { name { full } image { large } } } }';
      const response = await fetch(ANILIST_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query, variables: { s: q } })
      });
      const data = await response.json();
      if (data.errors) throw new Error(data.errors[0].message);
      return (data.data.Page.characters || []).map(c => ({ name: c.name ? c.name.full : '?', img: c.image ? c.image.large : null }));
    }

    async function searchAniListAnime(q) {
      const query = 'query ($s: String) { Page(page: 1, perPage: 10) { media(search: $s, type: ANIME, sort: [POPULARITY_DESC]) { title { romaji } coverImage { large } } } }';
      const response = await fetch(ANILIST_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query, variables: { s: q } })
      });
      const data = await response.json();
      if (data.errors) throw new Error(data.errors[0].message);
      return (data.data.Page.media || []).map(m => ({ name: m.title ? m.title.romaji : '?', img: m.coverImage ? m.coverImage.large : null }));
    }

    function pickPairItem(slot, item) {
      pairPicked[slot] = item;
      const img = document.getElementById(slot === 'a' ? 'pairImgA' : 'pairImgB');
      if (item.img) { img.src = item.img; img.style.display = 'block'; } else { img.style.display = 'none'; }
      document.getElementById(slot === 'a' ? 'pairInputA' : 'pairInputB').value = item.name;
      document.getElementById('pairResults').innerHTML = '';
      showNotification(tPO('picked_slot', { n: item.name, s: slot.toUpperCase() }));
    }

    async function addCustomPair() {
      if (!firebase.auth().currentUser) { showNotification('Log in first (profile menu) to manage word pairs.'); return; }
      const nameA = document.getElementById('pairInputA').value.trim();
      const nameB = document.getElementById('pairInputB').value.trim();
      if (nameA.length < 2 || nameB.length < 2) { showNotification('Both words must be at least 2 characters.'); return; }
      if (nameA.toLowerCase() === nameB.toLowerCase()) { showNotification('The two words must be different!'); return; }
      const btn = document.getElementById('pairAddBtn');
      btn.disabled = true;
      try {
        // Refuse exact duplicates (in either order) of built-in or existing custom pairs
        const all = await getAllUndercoverPairs();
        const key = [nameA.toLowerCase(), nameB.toLowerCase()].sort().join('|');
        const dup = all.some(p => [p.a.toLowerCase(), p.b.toLowerCase()].sort().join('|') === key);
        if (dup) { showNotification('This pair already exists!'); btn.disabled = false; return; }
        await database.ref('undercoverPairs').push({
          a: nameA, b: nameB, type: pairType,
          imgA: pairSlotImg('a'), imgB: pairSlotImg('b'),
          createdAt: Date.now()
        });
        document.getElementById('pairInputA').value = '';
        document.getElementById('pairInputB').value = '';
        pairPicked.a = null; pairPicked.b = null;
        document.getElementById('pairImgA').style.display = 'none';
        document.getElementById('pairImgB').style.display = 'none';
        showNotification('Pair added: ' + nameA + ' vs ' + nameB);
        renderPairList();
      } catch (e) { showNotification('Error adding pair: ' + e.message); }
      btn.disabled = false;
    }

    async function renderPairList() {
      const list = document.getElementById('pairList');
      if (!list) return;
      let data = {};
      try { const snap = await database.ref('undercoverPairs').once('value'); data = snap.val() || {}; }
      catch (e) { list.innerHTML = '<p style="color: var(--danger); text-align: center; font-size: 0.85rem;">Could not load pairs (log in first?).</p>'; return; }
      const keys = Object.keys(data);
      if (!keys.length) {
        list.innerHTML = '<p style="color: var(--muted); text-align: center; font-size: 0.85rem;">No custom pairs yet — the built-in pairs are always used too.</p>';
        return;
      }
      list.innerHTML = '';
      keys.reverse().forEach(k => {
        const p = normalizePair(data[k]);
        if (!p) return;
        const row = document.createElement('div');
        row.className = 'pair-row';
        const imgA = p.imgA ? '<img src="' + escapeHtml(p.imgA) + '" alt="" onerror="this.style.display=\'none\'">' : '';
        const imgB = p.imgB ? '<img src="' + escapeHtml(p.imgB) + '" alt="" onerror="this.style.display=\'none\'">' : '';
        row.innerHTML = imgA +
          '<span class="grow"><strong>' + escapeHtml(p.a) + '</strong><span class="pair-vs">VS</span><strong>' + escapeHtml(p.b) + '</strong></span>' +
          imgB + '<span class="type-badge">' + (p.type === 's' ? ic('film') : ic('user')) + '</span>';
        const del = document.createElement('button');
        del.textContent = '✕';
        del.title = 'Delete this pair';
        del.addEventListener('click', () => removeCustomPair(k));
        row.appendChild(del);
        list.appendChild(row);
      });
    }

    async function removeCustomPair(key) {
      try {
        await database.ref('undercoverPairs/' + key).remove();
        showNotification('Pair removed.');
        renderPairList();
      } catch (e) { showNotification('Error removing pair: ' + e.message); }
    }

    // ===== AUTO-CLOSE ROOMS IDLE FOR MORE THAN 1 HOUR =====
    setInterval(() => {
      if (!roomCode || !currentRoom) return;
      // Only act while this client is actually inside the room UI
      const inRoom = ['lobbyScreen', 'selectionScreen', 'gameScreen', 'undercoverScreen'].some(id => {
        const el = document.getElementById(id);
        return el && el.classList.contains('active');
      });
      if (!inRoom) return;
      const last = currentRoom.lastActivity || currentRoom.createdAt || Date.now();
      if (Date.now() - last > 60 * 60 * 1000) {
        database.ref('rooms/' + roomCode).remove(); // triggers 'Room was closed' on all clients
      }
    }, 60 * 1000);

    window.addEventListener('beforeunload', () => {
      if (roomCode && playerId) {
        // Cancel the disconnect marker first (avoids a ghost entry), then leave cleanly
        try { database.ref('rooms/' + roomCode + '/players/' + playerId + '/dcAt').onDisconnect().cancel(); } catch (e) {}
        try { database.ref('rooms/' + roomCode + '/queue/' + playerId).onDisconnect().cancel(); } catch (e) {}
        database.ref('rooms/' + roomCode + '/players/' + playerId).remove();
        database.ref('rooms/' + roomCode + '/queue/' + playerId).remove();
      }
    });
