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
      document.getElementById('interactionTitle').textContent = title;
      document.getElementById('interactionMessage').textContent = message;
      const btnContainer = document.getElementById('interactionButtons');
      btnContainer.innerHTML = '';
      buttons.forEach(btn => {
        const b = document.createElement('button');
        b.textContent = btn.label;
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
    let currentAccount = null;   // { uid, username, wins, losses } when logged in
    let gameResultCounted = false; // ensures stats are counted once per game

    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const ref = database.ref('users/' + user.uid);
        const snap = await ref.once('value');
        let profile = snap.val();
        if (!profile || !profile.username) {
          // Fallback: profile write failed during registration — rebuild a minimal one
          const lower = (user.email || 'player').split('@')[0];
          profile = { username: lower, usernameLower: lower, wins: 0, losses: 0, createdAt: Date.now() };
          await ref.set(profile);
        }
        currentAccount = { uid: user.uid, username: profile.username, wins: profile.wins || 0, losses: profile.losses || 0, anilist: profile.anilist || null };
        playerName = currentAccount.username;
        const btn = document.getElementById('usernameBtn');
        if (btn) btn.textContent = '👤 ' + playerName;
        // If already inside a room, update the displayed name there too
        if (roomCode && currentRoom && currentRoom.players && currentRoom.players[playerId]) {
          database.ref('rooms/' + roomCode + '/players/' + playerId + '/name').set(playerName);
        }
        // If sitting on the host screen when logging in, load the synced AniList account
        const hostScreen = document.getElementById('hostRoomScreen');
        if (hostScreen && hostScreen.classList.contains('active')) autoSyncHostAccount();
        // If inside a room when logging in, drop the synced account into the pool
        if (roomCode) syncMyAccountIntoRoom();
      } else {
        currentAccount = null;
        const btn = document.getElementById('usernameBtn');
        if (btn) btn.textContent = '👤 ' + playerName;
      }
    });

    function onUserButton() {
      if (firebase.auth().currentUser) openAuthModal(); else changeUsername();
    }

    async function openAuthModal() {
      const user = firebase.auth().currentUser;
      document.getElementById('authFormView').style.display = user ? 'none' : 'block';
      document.getElementById('authProfileView').style.display = user ? 'block' : 'none';
      if (user) {
        const snap = await database.ref('users/' + user.uid).once('value');
        const p = snap.val() || {};
        document.getElementById('profileName').textContent = p.username || 'Account';
        document.getElementById('profileWins').textContent = p.wins || 0;
        document.getElementById('profileLosses').textContent = p.losses || 0;
        document.getElementById('anilistSyncInput').value = p.anilist || '';
        document.getElementById('profileUsernameInput').value = '';
        document.getElementById('currentPasswordInput').value = '';
        document.getElementById('newPasswordInput').value = '';
        if (currentAccount) currentAccount.anilist = p.anilist || null;
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
        await database.ref('users/' + cred.user.uid).set({ username: usernameRaw, usernameLower: lower, wins: 0, losses: 0, createdAt: Date.now() });
        currentAccount = { uid: cred.user.uid, username: usernameRaw, wins: 0, losses: 0 };
        playerName = usernameRaw;
        document.getElementById('usernameBtn').textContent = '👤 ' + playerName;
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
        document.getElementById('usernameBtn').textContent = '👤 ' + playerName;
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
        const userData = await fetchAniListFavorites(name);
        const favs = userData.characters;
        if (favs.length < 6) { showNotification(name + ' has only ' + favs.length + ' favorites. Need at least 6.'); return; }
        const mappedChars = favs.map(char => {
          const media = (char.media && char.media.nodes && char.media.nodes[0]) ? char.media.nodes[0] : { title: { romaji: 'Unknown' }, type: 'ANIME' };
          return {
            id: char.id,
            name: char.name ? char.name.full : 'Unknown',
            image: char.image ? char.image.large : '',
            series: media.title ? media.title.romaji : 'Unknown',
            gender: (char.gender || 'Unknown').toLowerCase(),
            mediaType: (media.type || 'ANIME').toLowerCase()
          };
        });
        hostAccounts.push({ username: name, characters: mappedChars, count: mappedChars.length });
        renderHostAccounts();
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
        const userData = await fetchAniListFavorites(name);
        const favs = userData.characters;
        if (favs.length < 6) { showNotification(name + ' has only ' + favs.length + ' favorites. Need at least 6.'); return; }
        const mappedChars = favs.map(char => {
          const media = (char.media && char.media.nodes && char.media.nodes[0]) ? char.media.nodes[0] : { title: { romaji: 'Unknown' }, type: 'ANIME' };
          return {
            id: char.id,
            name: char.name ? char.name.full : 'Unknown',
            image: char.image ? char.image.large : '',
            series: media.title ? media.title.romaji : 'Unknown',
            gender: (char.gender || 'Unknown').toLowerCase(),
            mediaType: (media.type || 'ANIME').toLowerCase()
          };
        });
        await database.ref('rooms/' + roomCode + '/accounts/' + name).set({ username: name, characters: mappedChars, count: mappedChars.length });
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
                    name { full }
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
    let hostSource = 'generic'; // character pool for the next room: 'generic' | 'favorites' | 'mix'
    let codeBlurred = false;
    let myCharacterHidden = false;

    function changeUsername() {
      document.getElementById('newUsernameInput').value = playerName;
      document.getElementById('usernameModal').classList.add('show');
    }
    function closeUsernameModal() { document.getElementById('usernameModal').classList.remove('show'); }
    async function confirmUsernameChange() {
      const newName = document.getElementById('newUsernameInput').value.trim();
      if (!newName || newName.length < 2) { showNotification('Please enter a valid username (at least 2 characters)'); return; }
      playerName = newName;
      document.getElementById('usernameBtn').textContent = '👤 ' + playerName;
      if (roomCode && currentRoom) { await database.ref('rooms/' + roomCode + '/players/' + playerId + '/name').set(playerName); }
      closeUsernameModal(); showNotification('Username changed to: ' + playerName);
    }

    function showScreen(screenId) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById(screenId).classList.add('active');
      document.getElementById('winningScreen').classList.remove('show');
      document.getElementById('interactionWindow').classList.remove('show');
    }
    async function goHome() {
      if (roomCode && roomRef) { await leaveRoom(true); }
      showScreen('homepageScreen');
    }
    function showPlayMenu() { showScreen('playMenuScreen'); }
    function showGamesMenu() { showScreen('gamesMenuScreen'); }
    function showHostRoom() { showScreen('hostRoomScreen'); renderHostAccounts(); autoSyncHostAccount(); }
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

    function selectHostSource(type) {
      hostSource = type;
      const map = { favorites: 'hostSrcFavorites', generic: 'hostSrcGeneric', mix: 'hostSrcMix' };
      Object.values(map).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('selected', id === map[type]);
      });
    }

    function selectVisibility(type) {
      roomVisibility = type;
      document.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('selected'));
      // Fix: use the clicked element properly
      const target = arguments[1] ? arguments[1].currentTarget : event ? event.currentTarget : document.querySelector('.radio-option.selected');
      if (target) target.classList.add('selected');
    }

    function renderHostAccounts() {
      const list = document.getElementById('hostAccountsList');
      list.innerHTML = '';
      if (hostAccounts.length === 0) {
        const p = document.createElement('p');
        p.style.cssText = 'color: var(--muted); font-size: 0.85rem; padding: 6px 0;';
        p.textContent = 'No synced account — sync your AniList in the 👤 profile menu, or just play with the 🎴 Generic pool.';
        list.appendChild(p);
      }
      hostAccounts.forEach((acc) => {
        const item = document.createElement('div'); item.className = 'account-item';
        item.innerHTML = `<div><span class="name">${escapeHtml(String(acc.username || ''))}</span><span class="count">(${parseInt(acc.count) || 0} favorites)</span></div><span class="count" style="color: var(--success); font-weight: 700;">✓ synced</span>`;
        list.appendChild(item);
      });
      updateHostDist();
    }

    function updateHostCharCount() {
      const value = document.getElementById('hostCharCountSlider').value;
      document.getElementById('hostCharCountValue').textContent = value;
      const distSlider = document.getElementById('hostDistSlider');
      distSlider.max = value;
      if (parseInt(distSlider.value) > parseInt(value)) { distSlider.value = Math.floor(value / 2); }
      updateHostDist();
    }

    function updateHostDist() {
      if (hostAccounts.length >= 2) {
        document.getElementById('hostDistContainer').style.display = 'block';
        const value = parseInt(document.getElementById('hostDistSlider').value);
        const total = parseInt(document.getElementById('hostCharCountSlider').value);
        document.getElementById('hostDistLabel').textContent = `Distribution: ${value} from ${hostAccounts[0].username} / ${total - value} from ${hostAccounts[1].username}`;
      } else {
        document.getElementById('hostDistContainer').style.display = 'none';
      }
    }

    async function createGameRoom() {
      if (hostSource === 'favorites' && hostAccounts.length === 0) { showNotification('⭐ Favorites needs a synced AniList account (👤 profile menu) — or switch the pool to 🎴 Generic!'); return; }
      roomCode = generateRoomCode(); isHost = true;
      const charCount = parseInt(document.getElementById('hostCharCountSlider').value);
      const distribution = parseInt(document.getElementById('hostDistSlider').value);
      try {
        await database.ref('rooms/' + roomCode).set({
          host: playerId, game: 'guesswho', visibility: roomVisibility,
          players: { [playerId]: { id: playerId, ready: false, name: playerName, isHost: true } },
          accounts: hostAccounts.reduce((acc, a) => { acc[a.username] = a; return acc; }, {}),
          settings: { characterCount: charCount, distribution: distribution, source: hostSource },
          state: 'lobby', chat: {}, createdAt: Date.now(), lastActivity: Date.now()
        });
        setupRoomListener(); setupChatListener(); setupPlayerCleanup();
        showScreen('lobbyScreen');
        document.getElementById('displayRoomCode').textContent = roomCode;
        document.getElementById('lobbySettingsIcon').style.display = 'block';
        document.getElementById('lobbyGameName').textContent = 'Anime Guess Who?';
        document.getElementById('lobbyRoomType').textContent = roomVisibility === 'private' ? '🔒 Private' : '🌐 Public';
        updateLobby();
      } catch (error) { showNotification('Error creating room: ' + error.message); console.error('Firebase error:', error); }
    }

    async function joinGameRoom() {
      const input = document.getElementById('joinRoomInput');
      const code = input.value.trim().toUpperCase();
      if (code.length !== 4) { showNotification('Please enter a 4-digit room code'); return; }
      try {
        const roomSnapshot = await database.ref('rooms/' + code).once('value');
        if (!roomSnapshot.exists()) { showNotification('Room not found. Check the code and try again.'); return; }
        const room = roomSnapshot.val();
        const playerCount = Object.keys(room.players || {}).length;
        if (playerCount >= 2) { showNotification('Room is full (2/2 players)'); return; }
        roomCode = code; isHost = false;
        await database.ref('rooms/' + roomCode + '/players/' + playerId).set({ id: playerId, ready: false, name: playerName, isHost: false });
        touchActivity();
        setupRoomListener(); setupChatListener(); setupPlayerCleanup();
        syncMyAccountIntoRoom(); // guest's synced AniList account joins the pool automatically
        showScreen('lobbyScreen');
        document.getElementById('displayRoomCode').textContent = roomCode;
        document.getElementById('lobbyGameName').textContent = 'Anime Guess Who?';
        document.getElementById('lobbyRoomType').textContent = room.visibility === 'private' ? '🔒 Private' : '🌐 Public';
        updateLobby();
      } catch (error) { showNotification('Error joining room: ' + error.message); console.error('Firebase error:', error); }
    }

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
          if (isHost && !wasHost) showNotification('👑 You are now the room host!');
          document.getElementById('lobbySettingsIcon').style.display = isHost ? 'block' : 'none';
        }
        updateLobby();
        if (currentRoom.state !== 'finished') gameResultCounted = false; // re-arm stat counting for the next game
        if (currentRoom.state === 'lobby') { showScreen('lobbyScreen'); document.getElementById('winningScreen').classList.remove('show'); document.getElementById('interactionWindow').classList.remove('show'); }
        if (currentRoom.state === 'selection' && !document.getElementById('selectionScreen').classList.contains('active')) { showCharacterSelection(); }
        if (currentRoom.state === 'playing' && !document.getElementById('gameScreen').classList.contains('active')) { startGame(); }
        if (currentRoom.state === 'playing' || currentRoom.state === 'finished') { updateGame(); }
      });
      // Listen for a kick targeted at me
      if (kickRef) { kickRef.off(); }
      kickRef = database.ref('rooms/' + roomCode + '/kicks/' + playerId);
      kickRef.on('value', (snap) => { if (snap.val()) handleKicked(); });
    }

    function setupChatListener() {
      database.ref('rooms/' + roomCode + '/chat').on('child_added', (snapshot) => { displayChatMessage(snapshot.val()); });
      database.ref('rooms/' + roomCode + '/gameChat').on('child_added', (snapshot) => { displayGameChatMessage(snapshot.val()); });
    }

    function setupPlayerCleanup() {
      database.ref('rooms/' + roomCode + '/players').on('value', (snapshot) => {
        const players = snapshot.val();
        if (!players || Object.keys(players).length === 0) { database.ref('rooms/' + roomCode).remove(); }
      });
    }

    function updateLobby() {
      if (!currentRoom) return;
      const playersList = document.getElementById('playersList');
      playersList.innerHTML = '';
      Object.values(currentRoom.players || {}).forEach(player => {
        const card = document.createElement('div'); card.className = 'player-card';
        if (player.ready) card.classList.add('ready');
        if (player.isHost) card.classList.add('host');
        card.innerHTML = `<div class="player-info"><div class="name">${player.isHost ? '<span class="host-badge">👑 HOST</span>' : ''}${escapeHtml(String(player.name || ''))}</div><div class="status">${player.id === playerId ? '(You)' : ''}</div></div>${player.ready ? '<div class="ready-badge">✓ Ready</div>' : ''}`;
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
        }
        card.appendChild(rightWrap);
        playersList.appendChild(card);
      });
      const allReady = Object.values(currentRoom.players || {}).every(p => p.ready);
      const has2Players = Object.keys(currentRoom.players || {}).length === 2;
      document.getElementById('startGameBtn').style.display = (isHost && allReady && has2Players) ? 'block' : 'none';
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
      if (roomRef) { await database.ref('rooms/' + roomCode + '/players/' + playerId).remove(); roomRef.off(); }
      if (!silent) goHome();
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
      showInteraction('Kick Player?', 'Kick ' + (target.name || 'this player') + ' from the room?', [
        { label: 'Cancel', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: '✕ Kick', onclick: async () => { closeInteraction(); await kickPlayer(pid); }, class: 'danger' }
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
      showNotification('❌ You have been kicked from the room.', 5000);
      try {
        await database.ref('rooms/' + code + '/kicks/' + playerId).remove();
        await database.ref('rooms/' + code + '/players/' + playerId).remove();
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
      showInteraction('Transfer Host?', 'Make ' + (target.name || 'this player') + ' the room host? You will lose your host permissions.', [
        { label: 'Cancel', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: '👑 Make Host', onclick: async () => { closeInteraction(); await transferHost(pid); }, class: 'warning' }
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

    async function sendMessage() {
      const input = document.getElementById('chatInput'); const message = input.value.trim();
      if (!message) return;
      await database.ref('rooms/' + roomCode + '/chat').push({ senderId: playerId, senderName: currentRoom ? currentRoom.players[playerId].name : playerName, text: message, timestamp: Date.now() });
      touchActivity();
      input.value = '';
    }
    async function sendGameMessage() {
      const input = document.getElementById('gameChatInput'); const message = input.value.trim();
      if (!message) return;
      await database.ref('rooms/' + roomCode + '/gameChat').push({ senderId: playerId, senderName: currentRoom ? currentRoom.players[playerId].name : playerName, text: message, timestamp: Date.now() });
      touchActivity();
      input.value = '';
    }

    function displayChatMessage(msg) {
      const container = document.getElementById('chatMessages');
      if (container.children.length === 1 && container.children[0].style.textAlign === 'center') container.innerHTML = '';
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-message' + (msg.senderId === playerId ? ' own' : '');
      msgDiv.innerHTML = `<div class="sender">${escapeHtml(String(msg.senderName || 'Player'))}</div><div class="text">${escapeHtml(String(msg.text || ''))}</div>`;
      container.appendChild(msgDiv); container.scrollTop = container.scrollHeight;
    }
    function displayGameChatMessage(msg) {
      const container = document.getElementById('gameChatMessages');
      if (container.children.length === 1 && container.children[0].style.textAlign === 'center') container.innerHTML = '';
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-message' + (msg.senderId === playerId ? ' own' : '');
      msgDiv.innerHTML = `<div class="sender">${escapeHtml(String(msg.senderName || 'Player'))}</div><div class="text">${escapeHtml(String(msg.text || ''))}</div>`;
      container.appendChild(msgDiv); container.scrollTop = container.scrollHeight;
    }

    // ===== STALE ROOM JANITOR =====
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
      document.getElementById('usernameBtn').textContent = '👤 ' + playerName;
      const chatInput = document.getElementById('chatInput');
      if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
      const gameChatInput = document.getElementById('gameChatInput');
      if (gameChatInput) gameChatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendGameMessage(); });
      const joinInput = document.getElementById('joinRoomInput');
      if (joinInput) joinInput.addEventListener('input', (e) => { e.target.value = e.target.value.toUpperCase(); });
      const questionInput = document.getElementById('questionInput');
      if (questionInput) questionInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') askQuestion(); });
    });

    function openRoomSettings() {
      if (!isHost || !currentRoom) return;
      document.getElementById('modalCharCountSlider').value = currentRoom.settings ? currentRoom.settings.characterCount : 24;
      document.getElementById('modalDistSlider').value = currentRoom.settings ? currentRoom.settings.distribution : 12;
      updateModalCharCount();
      if (currentRoom.visibility === 'private') {
        document.getElementById('modalPrivate').classList.add('selected');
        document.getElementById('modalPublic').classList.remove('selected');
      } else {
        document.getElementById('modalPublic').classList.add('selected');
        document.getElementById('modalPrivate').classList.remove('selected');
      }
      syncSourceUI();
      document.getElementById('settingsModal').classList.add('show');
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
      const map = { favorites: 'modalSrcFavorites', generic: 'modalSrcGeneric', mix: 'modalSrcMix' };
      Object.values(map).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('selected', id === map[src]);
      });
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
      document.getElementById('lobbyRoomType').textContent = type === 'private' ? '🔒 Private' : '🌐 Public';
    }

    function updateModalCharCount() {
      const value = document.getElementById('modalCharCountSlider').value;
      document.getElementById('modalCharCountValue').textContent = value;
      if (currentRoom && currentRoom.settings) {
        database.ref('rooms/' + roomCode + '/settings/characterCount').set(parseInt(value));
      }
      const distSlider = document.getElementById('modalDistSlider');
      distSlider.max = value;
      if (parseInt(distSlider.value) > parseInt(value)) { distSlider.value = Math.floor(value / 2); }
      updateModalDist();
    }

    function updateModalDist() {
      const accountNames = currentRoom ? Object.keys(currentRoom.accounts || {}) : [];
      if (accountNames.length >= 2) {
        document.getElementById('modalDistContainer').style.display = 'block';
        const value = parseInt(document.getElementById('modalDistSlider').value);
        const total = currentRoom && currentRoom.settings ? currentRoom.settings.characterCount : 24;
        document.getElementById('modalDistLabel').textContent = `Distribution: ${value} from ${accountNames[0]} / ${total - value} from ${accountNames[1]}`;
        database.ref('rooms/' + roomCode + '/settings/distribution').set(value);
      } else {
        document.getElementById('modalDistContainer').style.display = 'none';
      }
    }

    async function hostStartGame() {
      if (!isHost || !currentRoom) return;
      const allReady = Object.values(currentRoom.players || {}).every(p => p.ready);
      if (!allReady) { showNotification('All players must be ready!'); return; }
      if (Object.keys(currentRoom.players || {}).length < 2) { showNotification('Need 2 players to start!'); return; }
      touchActivity();
      await generateCharacterPool();
    }

    async function generateCharacterPool(extraUpdates = {}) {
      const accountData = currentRoom ? Object.values(currentRoom.accounts || {}) : [];
      const settings = currentRoom ? currentRoom.settings : { characterCount: 24, distribution: 12 };
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
        if (accountData.length === 1) {
          selectedChars = pickUnique(allChars, totalChars);
        } else {
          const count1 = settings.distribution || Math.floor(totalChars / 2);
          const count2 = totalChars - count1;
          const chars1 = pickUnique(shuffleArray((accountData[0].characters || []).slice()), count1);
          const chars2 = pickUnique(shuffleArray((accountData[1].characters || []).slice()), count2);
          selectedChars = shuffleArray([...chars1, ...chars2]);
        }
      } else if (source === 'mix' && accountData.length > 0) {
        // Half generic, half favorites (deduped by AniList id); if one side
        // runs short, the other fills in so the board stays full.
        const fromGeneric = pickUnique(generic.slice(), Math.ceil(totalChars / 2));
        const fromFavs = pickUnique(allChars, totalChars - fromGeneric.length);
        selectedChars = shuffleArray([...fromGeneric, ...fromFavs]);
        if (selectedChars.length < totalChars) {
          selectedChars = shuffleArray([...selectedChars, ...pickUnique(generic.slice(), totalChars - selectedChars.length)]);
        }
      } else {
        // 'generic', or any source with no AniList accounts configured
        if (source !== 'generic') showNotification('No AniList accounts in this room — using the generic pool.');
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

    function updateSelectionStatus(selections) {
      if (!selections || !currentRoom) return;
      const players = Object.keys(currentRoom.players || {});
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
      document.getElementById('guessBtn').textContent = 'Cancel Guess';
      document.getElementById('guessBtn').onclick = cancelGuessingMode;
      showNotification('Click on a character to make your guess!');
      renderBoard();
    }

    function cancelGuessingMode() {
      guessMode = false;
      document.getElementById('guessBtn').textContent = '🎯 Make a Guess';
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
      if (!currentRoom) return;
      if (currentRoom.state === 'playing') { renderBoard(); updateTurnIndicator(); updateQuestionBox(); updateHistory(); }
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
        title.textContent = '🎉 You Win!';
        title.style.color = 'var(--success)';
        charImg.src = (winnerSecret && winnerSecret.image) ? winnerSecret.image : '';
        charName.textContent = (winnerSecret && winnerSecret.name) ? winnerSecret.name : '---';
        playerNameEl.textContent = currentRoom ? (currentRoom.players[playerId] ? currentRoom.players[playerId].name : playerName) : playerName;
      } else {
        title.textContent = '😢 You Lost';
        title.style.color = 'var(--danger)';
        charImg.src = (winnerSecret && winnerSecret.image) ? winnerSecret.image : '';
        charName.textContent = (winnerSecret && winnerSecret.name) ? winnerSecret.name : '---';
        playerNameEl.textContent = (currentRoom && currentRoom.players[winnerId]) ? currentRoom.players[winnerId].name : 'Opponent';
      }

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
      newGameLaunching = true;
      try {
        document.getElementById('winningScreen').classList.remove('show');
        // Skip the lobby: deal a brand new character pool with the SAME rules
        // (accounts, characterCount and distribution are kept in the room) and
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
      await database.ref('rooms/' + roomCode).update({
        state: 'lobby', characters: null, secrets: null, selections: null, currentTurn: null,
        eliminations: null, winner: null, currentQuestion: null, questionHistory: null, gameChat: null, restarts: null
      });
      await database.ref('rooms/' + roomCode + '/players/' + playerId + '/ready').set(false);
      if (currentRoom && currentRoom.players) {
        Object.keys(currentRoom.players).forEach(async (pid) => {
          await database.ref('rooms/' + roomCode + '/players/' + pid + '/ready').set(false);
        });
      }
      
      showScreen('lobbyScreen'); updateLobby();
    }

    // ===== AUTO-CLOSE ROOMS IDLE FOR MORE THAN 1 HOUR =====
    setInterval(() => {
      if (!roomCode || !currentRoom) return;
      // Only act while this client is actually inside the room UI
      const inRoom = ['lobbyScreen', 'selectionScreen', 'gameScreen'].some(id => {
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
      if (roomCode && playerId) { database.ref('rooms/' + roomCode + '/players/' + playerId).remove(); }
    });
