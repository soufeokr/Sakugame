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

    // A little round bubble: the picture if set, a 👤 circle if not.
    function avatarCircle(url, cls) {
      cls = cls || 'ava-lobby';
      if (url) return '<span class="ava ' + cls + '"><img src="' + escapeHtml(String(url)) + '" alt="" loading="lazy" onerror="var s=this.parentNode; s.classList.add(\'ava-empty\'); s.textContent=\'👤\';"></span>';
      return '<span class="ava ' + cls + ' ava-empty">👤</span>';
    }

    // The top-bar account button shows a mini avatar when the player has one.
    function updateUserButton() {
      const btn = document.getElementById('usernameBtn');
      if (!btn) return;
      const av = myAvatar();
      btn.innerHTML = (av ? '<span class="ava ava-btn"><img src="' + escapeHtml(String(av)) + '" alt="" onerror="var s=this.parentNode; s.classList.add(\'ava-empty\'); s.textContent=\'👤\';"></span> ' : '👤 ') + escapeHtml(String(playerName));
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
        showNotification(url ? 'Profile picture updated! 🖼️' : 'Profile picture removed.');
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

    async function openAuthModal() {
      const user = firebase.auth().currentUser;
      document.getElementById('authFormView').style.display = user ? 'none' : 'block';
      document.getElementById('authProfileView').style.display = user ? 'block' : 'none';
      if (user) {
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

    // ===== UNDERCOVER MODE state =====
    let hostGame = 'guesswho';     // game selected on the create-room screen
    let ucMaxPlayers = 5;          // max players for an Undercover room (3-8)
    let ucMrWhite = false;         // Mr. White option on the create-room screen
    let ucStatCountedFor = null;   // "roomCode_gameId" already counted (stats, once per game)
    let ucWatchBusy = false;       // re-entrancy guard for the host watchdog
    let ucLaunching = false;       // restart guard (host side)
    let ucActionKey = '';          // avoids rebuilding the clue input while typing
    let ucWordHidden = false;      // hide/show my secret word

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
      document.getElementById('interactionWindow').classList.remove('show');
    }
    async function goHome() {
      if (roomCode && roomRef) { await leaveRoom(true); }
      showScreen('homepageScreen');
    }
    function showPlayMenu() { showScreen('playMenuScreen'); }
    function showGamesMenu() { showScreen('gamesMenuScreen'); }
    function showHostRoom() { showScreen('hostRoomScreen'); autoSyncHostAccount(); }
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

    // ===== CREATE-ROOM SCREEN — GAME PICKER =====
    function onGameSelectChange() {
      hostGame = document.getElementById('gameSelect').value || 'guesswho';
      const isUc = hostGame === 'undercover';
      document.getElementById('hostPoolGroup').style.display = isUc ? 'none' : 'block';
      document.getElementById('hostGwSettings').style.display = isUc ? 'none' : 'block';
      document.getElementById('hostUcSettings').style.display = isUc ? 'block' : 'none';
    }
    function updateUcMaxPlayers() {
      ucMaxPlayers = parseInt(document.getElementById('hostUcMaxSlider').value);
      document.getElementById('hostUcMaxValue').textContent = ucMaxPlayers;
    }
    function selectUcMrWhite(on) {
      ucMrWhite = !!on;
      document.getElementById('hostUcMwOff').classList.toggle('selected', !on);
      document.getElementById('hostUcMwOn').classList.toggle('selected', !!on);
    }

    async function createGameRoom() {
      const game = document.getElementById('gameSelect').value || 'guesswho';
      const isUc = game === 'undercover';
      if (!isUc && hostSource === 'favorites' && hostAccounts.length === 0) { showNotification('⭐ Favorites needs a synced AniList account (👤 profile menu) — or switch the pool to 🎴 Generic!'); return; }
      roomCode = generateRoomCode(); isHost = true;
      const charCount = parseInt(document.getElementById('hostCharCountSlider').value);
      const distribution = parseInt(document.getElementById('hostDistSlider').value);
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
          roomData.accounts = hostAccounts.reduce((acc, a) => { acc[a.username] = a; return acc; }, {});
          roomData.settings = { characterCount: charCount, distribution: distribution, source: hostSource };
        }
        await database.ref('rooms/' + roomCode).set(roomData);
        setupRoomListener(); setupChatListener(); setupPlayerCleanup();
        showScreen('lobbyScreen');
        document.getElementById('displayRoomCode').textContent = roomCode;
        document.getElementById('lobbySettingsIcon').style.display = 'block';
        document.getElementById('lobbyGameName').textContent = isUc ? '🕵️ Undercover' : 'Anime Guess Who?';
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
        if (room.state && room.state !== 'lobby') { showNotification('That game has already started — wait for them to return to the lobby.'); return; }
        const playerCount = Object.keys(room.players || {}).length;
        const maxPlayers = room.maxPlayers || 2;
        if (playerCount >= maxPlayers) { showNotification('Room is full (' + playerCount + '/' + maxPlayers + ' players)'); return; }
        roomCode = code; isHost = false;
        await database.ref('rooms/' + roomCode + '/players/' + playerId).set({ id: playerId, ready: false, name: playerName, isHost: false, avatar: myAvatar() || '' });
        touchActivity();
        setupRoomListener(); setupChatListener(); setupPlayerCleanup();
        syncMyAccountIntoRoom(); // guest's synced AniList account joins the pool automatically
        showScreen('lobbyScreen');
        document.getElementById('displayRoomCode').textContent = roomCode;
        document.getElementById('lobbyGameName').textContent = room.game === 'undercover' ? '🕵️ Undercover' : 'Anime Guess Who?';
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
        ensureHostPresent();
        if (currentRoom.state !== 'finished') gameResultCounted = false; // re-arm stat counting for the next game
        const isUcRoom = currentRoom.game === 'undercover';
        if (currentRoom.state === 'lobby') { showScreen('lobbyScreen'); document.getElementById('winningScreen').classList.remove('show'); document.getElementById('ucEndScreen').classList.remove('show'); document.getElementById('interactionWindow').classList.remove('show'); }
        if (isUcRoom) {
          if (currentRoom.state === 'playing' || currentRoom.state === 'finished') {
            if (!document.getElementById('undercoverScreen').classList.contains('active')) showScreen('undercoverScreen');
            updateUndercover();
            if (isHost && currentRoom.state === 'playing') hostUndercoverWatchdog();
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
        card.innerHTML = `<div class="player-head">${avatarCircle(player.avatar, 'ava-lobby')}<div class="player-info"><div class="name">${player.isHost ? '<span class="host-badge">👑 HOST</span>' : ''}${escapeHtml(String(player.name || ''))}</div><div class="status">${player.id === playerId ? '(You)' : ''}</div></div></div>${player.ready ? '<div class="ready-badge">✓ Ready</div>' : ''}`;
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
      const playerCount = Object.keys(currentRoom.players || {}).length;
      const allReady = Object.values(currentRoom.players || {}).every(p => p.ready);
      const countEl = document.getElementById('lobbyPlayerCount');
      if (countEl) countEl.textContent = playerCount + '/' + (currentRoom.maxPlayers || 2);
      const gameNameEl = document.getElementById('lobbyGameName');
      if (gameNameEl) gameNameEl.textContent = currentRoom.game === 'undercover' ? '🕵️ Undercover' : 'Anime Guess Who?';
      const canStart = currentRoom.game === 'undercover' ? (allReady && playerCount >= 3) : (allReady && playerCount === 2);
      document.getElementById('startGameBtn').style.display = (isHost && canStart) ? 'block' : 'none';
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
    async function pushGameChat(input) {
      const message = input.value.trim();
      if (!message) return;
      const myName = (currentRoom && currentRoom.players && currentRoom.players[playerId]) ? currentRoom.players[playerId].name : playerName;
      await database.ref('rooms/' + roomCode + '/gameChat').push({ senderId: playerId, senderName: myName, text: message, timestamp: Date.now() });
      touchActivity();
      input.value = '';
    }
    async function sendGameMessage() { const input = document.getElementById('gameChatInput'); if (input) await pushGameChat(input); }
    async function sendUcMessage() { const input = document.getElementById('ucChatInput'); if (input) await pushGameChat(input); }

    function displayChatMessage(msg) {
      const container = document.getElementById('chatMessages');
      if (container.children.length === 1 && container.children[0].style.textAlign === 'center') container.innerHTML = '';
      const msgDiv = document.createElement('div');
      const sender = (currentRoom && currentRoom.players) ? currentRoom.players[msg.senderId] : null;
      msgDiv.className = 'chat-message' + (msg.senderId === playerId ? ' own' : '');
      msgDiv.innerHTML = `<div class="sender">${avatarCircle(sender ? sender.avatar : null, 'ava-chat')}${escapeHtml(String(msg.senderName || 'Player'))}</div><div class="text">${escapeHtml(String(msg.text || ''))}</div>`;
      container.appendChild(msgDiv); container.scrollTop = container.scrollHeight;
    }
    // Renders into both in-game chat containers (Guess Who screen + Undercover screen)
    function displayGameChatMessage(msg) {
      ['gameChatMessages', 'ucChatMessages'].forEach(id => {
        const container = document.getElementById(id);
        if (!container) return;
        if (container.children.length === 1 && container.children[0].style.textAlign === 'center') container.innerHTML = '';
        const msgDiv = document.createElement('div');
        const sender = (currentRoom && currentRoom.players) ? currentRoom.players[msg.senderId] : null;
        msgDiv.className = 'chat-message' + (msg.senderId === playerId ? ' own' : '');
        msgDiv.innerHTML = `<div class="sender">${avatarCircle(sender ? sender.avatar : null, 'ava-chat')}${escapeHtml(String(msg.senderName || 'Player'))}</div><div class="text">${escapeHtml(String(msg.text || ''))}</div>`;
        container.appendChild(msgDiv); container.scrollTop = container.scrollHeight;
      });
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
      updateUserButton();
      const chatInput = document.getElementById('chatInput');
      if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
      const gameChatInput = document.getElementById('gameChatInput');
      if (gameChatInput) gameChatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendGameMessage(); });
      const ucChatInput = document.getElementById('ucChatInput');
      if (ucChatInput) ucChatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendUcMessage(); });
      const pairInputA = document.getElementById('pairInputA');
      if (pairInputA) pairInputA.addEventListener('keypress', (e) => { if (e.key === 'Enter') pairAniListSearch('a'); });
      const pairInputB = document.getElementById('pairInputB');
      if (pairInputB) pairInputB.addEventListener('keypress', (e) => { if (e.key === 'Enter') pairAniListSearch('b'); });
      const joinInput = document.getElementById('joinRoomInput');
      if (joinInput) joinInput.addEventListener('input', (e) => { e.target.value = e.target.value.toUpperCase(); });
      const questionInput = document.getElementById('questionInput');
      if (questionInput) questionInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') askQuestion(); });
    });

    function openRoomSettings() {
      if (!isHost || !currentRoom) return;
      const isUc = currentRoom.game === 'undercover';
      document.getElementById('modalPoolGroup').style.display = isUc ? 'none' : 'block';
      document.getElementById('modalGwSettings').style.display = isUc ? 'none' : 'block';
      document.getElementById('modalUwSettings').style.display = isUc ? 'block' : 'none';
      if (isUc) {
        const maxP = currentRoom.maxPlayers || 5;
        document.getElementById('modalUcMaxSlider').value = maxP;
        document.getElementById('modalUcMaxValue').textContent = maxP;
        const mwOn = !!(currentRoom.settings && currentRoom.settings.mrWhite);
        document.getElementById('modalUcMwOff').classList.toggle('selected', !mwOn);
        document.getElementById('modalUcMwOn').classList.toggle('selected', mwOn);
      } else {
        document.getElementById('modalCharCountSlider').value = currentRoom.settings ? currentRoom.settings.characterCount : 24;
        document.getElementById('modalDistSlider').value = currentRoom.settings ? currentRoom.settings.distribution : 12;
        updateModalCharCount();
        syncSourceUI();
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

    async function hostStartGame() {
      if (!isHost || !currentRoom) return;
      const allReady = Object.values(currentRoom.players || {}).every(p => p.ready);
      const playerCount = Object.keys(currentRoom.players || {}).length;
      if (currentRoom.game === 'undercover') {
        if (playerCount < 3) { showNotification('Undercover needs at least 3 players!'); return; }
        if (!allReady) { showNotification('All players must be ready!'); return; }
        touchActivity();
        await startUndercoverGame();
        return;
      }
      if (!allReady) { showNotification('All players must be ready!'); return; }
      if (playerCount < 2) { showNotification('Need 2 players to start!'); return; }
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
      if (!currentRoom || currentRoom.game === 'undercover') return;
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
      document.getElementById('ucEndScreen').classList.remove('show');
      await database.ref('rooms/' + roomCode).update({
        state: 'lobby', characters: null, secrets: null, selections: null, currentTurn: null,
        eliminations: null, winner: null, currentQuestion: null, questionHistory: null, gameChat: null, restarts: null, uc: null
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
      return Object.keys(players).filter(pid => !out[pid]);
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
      if (Array.isArray(entry)) {
        if (!entry[0] || !entry[1]) return null;
        return { a: String(entry[0]), b: String(entry[1]), type: entry[2] === 's' ? 's' : 'c', imgA: imgs[String(entry[0]).toLowerCase()] || null, imgB: imgs[String(entry[1]).toLowerCase()] || null };
      }
      if (entry && entry.a && entry.b) {
        return { a: String(entry.a), b: String(entry.b), type: entry.type === 's' ? 's' : 'c', imgA: entry.imgA || imgs[String(entry.a).toLowerCase()] || null, imgB: entry.imgB || imgs[String(entry.b).toLowerCase()] || null };
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
      if (useMw && pids.length < 4) { showNotification('Mr. White needs at least 4 players — disable it in ⚙️ settings or wait for more players.'); return; }
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
          order: order, turnIdx: 0,
          lastEvent: null, mwGuess: null,
          winner: null, winnerPids: null
        }
      });
      touchActivity();
      showNotification('🕵️ Words dealt! Check your secret word…');
    }

    // HOST-ONLY: advances the game when everyone has acted.
    async function hostUndercoverWatchdog() {
      if (ucWatchBusy) return;
      const uc = (currentRoom && currentRoom.uc) || null;
      if (!uc || currentRoom.state !== 'playing') return;
      const alive = ucAlivePids();
      if (alive.length === 0) return;
      ucWatchBusy = true;
      try {
        // Emergency end check (e.g. the Undercover / Mr. White left the room)
        if (uc.phase !== 'mrwhite' && uc.phase !== 'reveal') {
          const winNow = ucWinnerCheck();
          if (winNow) { await finishUndercover(winNow, { kind: 'leave' }); return; }
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

    async function resolveMrWhiteGuess() {
      const uc = currentRoom.uc;
      const players = currentRoom.players || {};
      const guessText = (uc.mwGuess && uc.mwGuess.text) ? String(uc.mwGuess.text) : '';
      const mwPid = Object.keys(uc.roles || {}).find(pid => uc.roles[pid] === 'mrwhite') || null;
      const mwName = (mwPid && players[mwPid]) ? players[mwPid].name : 'Mr. White';
      const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
      const correct = guessText.length > 0 && norm(guessText) === norm(uc.word);
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
        if (sp && sp !== playerId) { showNotification('⏳ Not your turn yet — wait for the others!'); return; }
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
        if (re.test(text)) { showNotification('🚫 You cannot say your word! Describe it instead.'); return; }
      }
      input.disabled = true;
      await database.ref('rooms/' + roomCode + '/uc/clues/' + playerId).set(text);
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

    function toggleUcWord() {
      ucWordHidden = !ucWordHidden;
      const wordEl = document.getElementById('ucMyWord');
      if (ucWordHidden) wordEl.classList.add('blurred'); else wordEl.classList.remove('blurred');
      const imgEl = document.getElementById('ucMyWordImg');
      if (imgEl && imgEl.style.display !== 'none') {
        if (ucWordHidden) imgEl.classList.add('blurred'); else imgEl.classList.remove('blurred');
      }
    }

    async function returnToLobbyFromUndercover() {
      showInteraction('Return to Lobby?', 'This will end the current game for everyone.', [
        { label: 'Cancel', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: 'Return', onclick: () => { closeInteraction(); returnToLobby(); }, class: 'danger' }
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
        document.getElementById('ucEndScreen').classList.remove('show');
        await startUndercoverGame();
      } finally { ucLaunching = false; }
    }

    // ===== RENDERING =====
    function ucEventText(ev) {
      if (!ev) return '';
      if (ev.kind === 'vote') {
        if (ev.tie) return '🤝 Tie vote — nobody was eliminated!';
        let roleTxt = 'They were a 👥 CIVILIAN… oops!';
        if (ev.role === 'undercover') roleTxt = 'They were the 🕵️ UNDERCOVER!';
        if (ev.role === 'mrwhite') roleTxt = 'They were ⚪ MR. WHITE!';
        return '🗳️ ' + ev.name + ' was voted out… ' + roleTxt;
      }
      if (ev.kind === 'mwguess') {
        return ev.correct
          ? '⚪ ' + ev.name + ' guessed the word "' + ev.word + '" — CORRECT!'
          : '⚪ ' + ev.name + ' guessed "' + ev.guess + '" — WRONG!';
      }
      if (ev.kind === 'limit') return '⏱️ Round limit reached — the impostor survived!';
      if (ev.kind === 'leave') return '🚪 A key player left — the game cannot continue.';
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
      const phaseNames = { clues: '💬 Description time', voting: '🗳️ Voting time', reveal: '🔎 Result', mrwhite: '⚪ Mr. White guesses…', over: '🏁 Game over' };
      document.getElementById('ucPhaseBadge').textContent = phaseNames[uc.phase] || '';

      // Private word card — roles stay SECRET: civilians and the undercover
      // see the exact same card (label, border, hint), only Mr. White is told
      // he's wordless (that's how the game is meant to be played).
      const wordEl = document.getElementById('ucMyWord');
      const roleLabel = document.getElementById('ucRoleLabel');
      const roleHint = document.getElementById('ucRoleHint');
      const wordCard = document.getElementById('ucWordCard');
      wordCard.className = 'uc-word-card' + (myRole === 'mrwhite' ? ' mrwhite' : '');
      if (myRole === 'mrwhite') {
        roleLabel.textContent = '⚪ You are MR. WHITE';
        wordEl.textContent = '— no word —';
        roleHint.textContent = 'You have NO word! Listen to the clues and improvise.';
      } else {
        roleLabel.textContent = '🎴 Your secret word';
        // your word is uwWord if you're the undercover — but you are NOT told that!
        wordEl.textContent = (myRole === 'undercover') ? (uc.uwWord || '---') : (uc.word || '---');
        roleHint.textContent = 'Describe your word without saying it! One player might have a slightly different word… is it you? 👀';
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
        if (out[pid]) status = '💀 out';
        else if (uc.phase === 'clues') {
          status = clues[pid] ? '✅ said theirs'
            : (speaker === pid ? '🗣️ their turn!'
            : '⏳ waiting their turn');
        }
        else if (uc.phase === 'voting') status = votes[pid] ? '✅ voted' : '⏳ voting…';
        tile.innerHTML = avatarCircle(p.avatar, 'ava-tile') + '<div class="uc-tile-name">' + escapeHtml(String(p.name || '?')) + (pid === playerId ? ' (You)' : '') + '</div><div class="uc-tile-status">' + status + '</div>';
        if (currentRoom.state === 'playing' && uc.phase === 'voting' && !iAmOut && !iVoted && !out[pid] && pid !== playerId) {
          tile.classList.add('votable');
          const btn = document.createElement('button');
          btn.className = 'danger uc-vote-btn';
          btn.textContent = '🗳️ Vote';
          btn.addEventListener('click', (e) => { e.stopPropagation(); voteUndercover(pid); });
          tile.appendChild(btn);
        }
        grid.appendChild(tile);
      });

      // Clues of the round
      const clueList = document.getElementById('ucClueList');
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
          area.innerHTML = '<div class="uc-action-form"><input type="text" id="ucMwInput" maxlength="60" placeholder="You were caught! Last chance — guess the civilians\' word…"><button class="warning" onclick="submitMrWhiteGuess()">Guess</button></div>';
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
        else if (iAmOut) wait.textContent = '💀 You are out — watch how it ends!';
        else if (uc.phase === 'clues') {
          if (clues[playerId]) {
            wait.textContent = '✅ Your clue is in! Waiting for the others (' + alive.filter(p => clues[p]).length + '/' + alive.length + ')…';
          } else if (speaker && speaker !== playerId) {
            const spName = (currentRoom.players && currentRoom.players[speaker]) ? currentRoom.players[speaker].name : 'A player';
            wait.textContent = '🗣️ ' + spName + ' is describing their word… your turn comes after (' + alive.filter(p => clues[p]).length + '/' + alive.length + ' done)';
          } else wait.textContent = '';
        }
        else if (uc.phase === 'voting') {
          wait.textContent = votes[playerId]
            ? '✅ Vote cast! Waiting (' + alive.filter(p => votes[p]).length + '/' + alive.length + ')…'
            : '🗳️ Click a player\'s tile to vote them out!';
        }
        else if (uc.phase === 'mrwhite') wait.textContent = '⚪ Mr. White is trying to guess your word…';
        else if (uc.phase === 'reveal') wait.textContent = '🔎 Next round starting…';
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
      if (uc.winner === 'undercover') title.textContent = '🕵️ The Undercover Wins!';
      else if (uc.winner === 'mrwhite') title.textContent = '⚪ Mr. White Wins!';
      else title.textContent = '👥 Civilians Win!';
      const personal = document.getElementById('ucWinPersonal');
      personal.textContent = iWon ? '🎉 You won this one!' : '😢 You lost this one!';
      personal.style.color = iWon ? 'var(--success)' : 'var(--danger)';
      const civImg = uc.wordImg ? '<img class="uc-end-img" src="' + escapeHtml(String(uc.wordImg)) + '" alt="">' : '';
      const uwImg = uc.uwWordImg ? '<img class="uc-end-img" src="' + escapeHtml(String(uc.uwWordImg)) + '" alt="">' : '';
      document.getElementById('ucWordsLine').innerHTML =
        'The <strong>' + escapeHtml(String(uc.wordType || 'anime')) + '</strong> words were:<br>' +
        civImg + '👥 Civilians: <strong style="color: var(--accent);">' + escapeHtml(String(uc.word || '?')) + '</strong>' +
        ' &nbsp;·&nbsp; ' + uwImg + '🕵️ Undercover: <strong style="color: var(--warning);">' + escapeHtml(String(uc.uwWord || '?')) + '</strong>';

      // Roles reveal list
      const list = document.getElementById('ucRevealList');
      list.innerHTML = '';
      const roleLabel = { civilian: '👥 Civilian', undercover: '🕵️ Undercover', mrwhite: '⚪ Mr. White' };
      const roleColor = { civilian: 'var(--text)', undercover: 'var(--warning)', mrwhite: 'var(--danger)' };
      const sorted = pids.slice().sort((a, b) => {
        const order = { undercover: 0, mrwhite: 1, civilian: 2 };
        return (order[roles[a]] !== undefined ? order[roles[a]] : 3) - (order[roles[b]] !== undefined ? order[roles[b]] : 3);
      });
      sorted.forEach(pid => {
        const p = players[pid] || {};
        const row = document.createElement('div');
        row.className = 'uc-reveal-row';
        row.innerHTML = '<span class="uc-reveal-who">' + avatarCircle(p.avatar, 'ava-chat') + '<span>' + escapeHtml(String(p.name || '?')) + (pid === playerId ? ' (You)' : '') + '</span></span><span class="uc-reveal-role" style="color: ' + (roleColor[roles[pid]] || 'var(--text)') + ';">' + (roleLabel[roles[pid]] || '👥 Civilian') + '</span>';
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

      // Restart status & auto-launch (host side)
      const statusEl = document.getElementById('ucRestartStatus');
      const btn = document.getElementById('ucRestartBtn');
      const total = pids.length;
      const clicked = pids.filter(pid => restarts[pid]).length;
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
      if (!firebase.auth().currentUser) { showNotification('🔑 Log in first (👤 menu) to manage word pairs.'); return; }
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
      showNotification('✅ ' + item.name + ' picked for Word ' + slot.toUpperCase());
    }

    async function addCustomPair() {
      if (!firebase.auth().currentUser) { showNotification('🔑 Log in first (👤 menu) to manage word pairs.'); return; }
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
        showNotification('🎉 Pair added: ' + nameA + ' vs ' + nameB);
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
          imgB + '<span class="type-badge">' + (p.type === 's' ? '🎬' : '👤') + '</span>';
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
      if (roomCode && playerId) { database.ref('rooms/' + roomCode + '/players/' + playerId).remove(); }
    });
