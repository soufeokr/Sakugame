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

    // ===== MULTIPLAYER GUESS WHO (Battle Royale & Race) + QUEUE state =====
    // game === 'battle': everyone has a secret, questions are public, each
    //   opponent gets a ❌ color, finds give points, ranking at the end.
    // game === 'race': one player is the TARGET (picks the mystery character
    //   & answers questions); the hunters race to find it first.
    const GAME_LABELS = { guesswho: '🎭 Anime Guess Who?', undercover: '🕵️ Undercover', battle: '🎭👥 Guess Who — Battle Royale', race: '⚡ Guess Who — Race' };
    let multiMaxPlayers = 6;       // max players for battle/race rooms (3-8)
    let brCrossTarget = null;      // opponent pid I'm currently marking with ❌
    let brGuessMode = false;       // click-a-card-to-guess mode (battle)
    let rcGuessMode = false;       // same for race
    let brMarks = {};              // { opponentPid: {charId:true} } — local notes, like myEliminated in 2P
    let rcMarks = {};              // { charId: true } — my own marks in race
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
      document.getElementById('interactionWindow').classList.remove('show');
      // The floating 💬 chat button exists in the lobby and during games
      const chatBtn = document.getElementById('chatToggleBtn');
      const chatVisible = (screenId === 'lobbyScreen' || screenId === 'gameScreen' || screenId === 'undercoverScreen' || screenId === 'battleScreen' || screenId === 'raceScreen');
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
      const isMulti = hostGame === 'battle' || hostGame === 'race';
      document.getElementById('hostPoolGroup').style.display = isUc ? 'none' : 'block';
      document.getElementById('hostGwSettings').style.display = isUc ? 'none' : 'block';
      document.getElementById('hostUcSettings').style.display = isUc ? 'block' : 'none';
      document.getElementById('hostMultiSettings').style.display = isMulti ? 'block' : 'none';
      if (isMulti) {
        document.getElementById('hostMultiLabel').textContent = hostGame === 'battle' ? 'Battle Royale' : 'Race';
        document.getElementById('hostMultiDesc').textContent = hostGame === 'battle'
          ? '🎭👥 Everyone picks a secret character. On your turn you ask ONE yes/no question and EVERYONE answers about their own secret. Mark cards with each opponent\'s ❌ color, guess their secrets: the earlier you find one, the more points! Last secret standing wins.'
          : '⚡ One random player is the TARGET: they secretly pick the mystery character and answer all questions honestly. The hunters take turns asking — the first to guess the mystery character wins!';
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
    function selectUcMrWhite(on) {
      ucMrWhite = !!on;
      document.getElementById('hostUcMwOff').classList.toggle('selected', !on);
      document.getElementById('hostUcMwOn').classList.toggle('selected', !!on);
    }

    async function createGameRoom() {
      const game = document.getElementById('gameSelect').value || 'guesswho';
        const isUc = game === 'undercover';
        const isMulti = game === 'battle' || game === 'race';
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
          if (isMulti) roomData.maxPlayers = multiMaxPlayers;
        }
        await database.ref('rooms/' + roomCode).set(roomData);
        setupRoomListener(); setupChatListener(); setupPlayerCleanup(); markDisconnectTracking();
        showScreen('lobbyScreen');
        document.getElementById('displayRoomCode').textContent = roomCode;
        document.getElementById('lobbySettingsIcon').style.display = 'block';
        document.getElementById('lobbyGameName').textContent = GAME_LABELS[game] || 'Anime Guess Who?';
        document.getElementById('lobbyRoomType').textContent = roomVisibility === 'private' ? '🔒 Private' : '🌐 Public';
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
          if (queueCount >= QUEUE_MAX) { showNotification('⏳ That room\'s queue is full (' + QUEUE_MAX + ' waiting) — try another room!'); roomCode = null; return; }
          await database.ref('rooms/' + roomCode + '/queue/' + playerId).set({ id: playerId, name: playerName, avatar: myAvatar() || '', joinedAt: Date.now() });
          touchActivity();
          setupRoomListener(); setupChatListener(); setupPlayerCleanup(); markQueueDisconnect();
          afterJoinUI(room);
          showNotification('⏳ ' + (room.state === 'lobby' ? 'Room full' : 'Game in progress') + ' — you are #' + (queueCount + 1) + ' in the queue. You\'ll jump in automatically!', 5000);
        }
      } catch (error) { showNotification('Error joining room: ' + error.message); console.error('Firebase error:', error); }
    }
    function afterJoinUI(room) {
      showScreen('lobbyScreen');
      document.getElementById('displayRoomCode').textContent = roomCode;
      document.getElementById('lobbyGameName').textContent = GAME_LABELS[room.game] || 'Anime Guess Who?';
      document.getElementById('lobbyRoomType').textContent = room.visibility === 'private' ? '🔒 Private' : '🌐 Public';
      updateLobby();
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
        // ⏳ QUEUE membership: waiting (queue/{pid}) vs seated (players/{pid}).
        // Seated/queue transitions flip local state + notifications exactly once.
        const meSeated = !!(currentRoom.players && currentRoom.players[playerId]);
        const meWaiting = !!(currentRoom.queue && currentRoom.queue[playerId]);
        if (meWaiting && !meSeated) {
          imQueued = true;
        } else if (meSeated && imQueued) {
          imQueued = false;
          cancelQueueDisconnect();
          markDisconnectTracking();      // switch disconnect tracking to the seat
          syncMyAccountIntoRoom();       // a promoted player's AniList pool joins the room
          showNotification('🎉 A seat opened — you\'re in! Ready up!', 4000);
        } else if (!meSeated && !meWaiting) {
          imQueued = false;
        }
        maybePromoteQueue(); // host moves queued people into free seats; lobbyless queue-head self-promotes
        updateLobby();
        ensureHostPresent();
        purgeDisconnectedPlayers();
        if (currentRoom.state !== 'finished') gameResultCounted = false; // re-arm stat counting for the next game
        const isUcRoom = currentRoom.game === 'undercover';
        if (currentRoom.state === 'lobby') { showScreen('lobbyScreen'); document.getElementById('winningScreen').classList.remove('show'); document.getElementById('ucEndScreen').classList.remove('show'); document.getElementById('multiEndScreen').classList.remove('show'); document.getElementById('interactionWindow').classList.remove('show'); }
        // Queued visitors never leave the lobby — no game screen routing for them
        if (!meSeated) return;
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
      if (countEl) countEl.textContent = playerCount + '/' + (currentRoom.maxPlayers || 2) + (queueList.length ? '  ·  ⏳ +' + queueList.length : '');
      const gameNameEl = document.getElementById('lobbyGameName');
      if (gameNameEl) gameNameEl.textContent = GAME_LABELS[currentRoom.game] || 'Anime Guess Who?';
      const isMultiGame = currentRoom.game === 'undercover' || currentRoom.game === 'battle' || currentRoom.game === 'race';
      const canStart = isMultiGame ? (allReady && playerCount >= 3) : (allReady && playerCount === 2);
      document.getElementById('startGameBtn').style.display = (isHost && canStart && !imQueued) ? 'block' : 'none';
      // My own "you're waiting" banner + hide Ready while queued
      const qBanner = document.getElementById('queueBanner');
      const readyBtn = document.getElementById('readyBtn');
      const myQ = queueList.findIndex(q => q.id === playerId);
      if (imQueued && myQ !== -1) {
        qBanner.style.display = 'block';
        const why = currentRoom.state === 'lobby' ? 'the room is full — waiting for a free seat' : 'a game is in progress';
        qBanner.innerHTML = '⏳ <b>You are #' + (myQ + 1) + ' in the queue</b> — ' + why + '. You\'ll jump in automatically for the next game!';
        if (readyBtn) readyBtn.style.display = 'none';
      } else {
        qBanner.style.display = 'none';
        if (readyBtn) readyBtn.style.display = 'block';
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
          head.innerHTML = `<span class="queue-pos">#${i + 1}</span>${avatarCircle(qp.avatar, 'ava-lobby')}<div class="player-info"><div class="name">${escapeHtml(String(qp.name || ''))}</div><div class="status">${qp.id === playerId ? '(You) — ' : ''}⏳ waiting for a seat</div></div>`;
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
        { label: '✕ Remove', onclick: async () => {
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
            restarts: null, uc: null, br: null, rc: null,
            host: playerId
          };
          updates['players/' + playerId] = { id: playerId, ready: false, name: me.name || playerName, isHost: true, avatar: me.avatar || '' };
          updates['queue/' + playerId] = null;
          await database.ref('rooms/' + roomCode).update(updates);
          showNotification('👑 Everyone left — you were promoted from the queue and are now the host!', 4000);
        } finally { queuePromoting = false; }
        return;
      }
      if (!isHost || (!inLobby && !force)) return;
      const slots = maxP - seatedCount;
      if (slots <= 0) return;
      const promote = sorted.slice(0, slots);
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
        showNotification('🎉 ' + promote.map(p => p.name).join(', ') + ' joined from the queue!');
      } finally { queuePromoting = false; }
    }

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
      publicRoomsRef.once('value').then(snap => { renderPublicRooms(snap.val() || {}); showNotification('🔄 Room list refreshed'); });
    }
    function renderPublicRooms(rooms) {
      const list = document.getElementById('publicRoomsList');
      if (!list) return;
      const STATUS = { lobby: '🟢 In the lobby', selection: '🎯 Picking characters', playing: '🎮 Game in progress', finished: '🏁 Game ending' };
      const SRC = { generic: '🎴 Generic pool', favorites: '⭐ AniList favorites', mix: '🎲 Mixed pool' };
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
        list.innerHTML = '<p class="pub-empty">No public rooms open right now… create one and set it to 🌐 Public!</p>';
        return;
      }
      list.innerHTML = '';
      entries.forEach(({ code, r, playerCount, maxP, queueCount, joinable }) => {
        const players = Object.values(r.players || {});
        const hostP = players.find(p => p.isHost) || players[0];
        const names = players.slice(0, 4).map(p => (p.isHost ? '👑 ' : '') + (p.name || '?')).join(', ') + (players.length > 4 ? ' +' + (players.length - 4) : '');
        let rules = '';
        if (r.game === 'undercover') rules = '👥 max ' + maxP + ' · ⚪ Mr. White ' + ((r.settings && r.settings.mrWhite) ? 'ON' : 'OFF');
        else if (r.game === 'battle') rules = '🎭 ' + ((r.settings && r.settings.characterCount) || 24) + ' characters · max ' + maxP + ' · ' + SRC[(r.settings && r.settings.source) || 'generic'];
        else if (r.game === 'race') rules = '⚡ ' + ((r.settings && r.settings.characterCount) || 24) + ' characters · max ' + maxP + ' · ' + SRC[(r.settings && r.settings.source) || 'generic'];
        else rules = '🎭 ' + ((r.settings && r.settings.characterCount) || 24) + ' characters · ' + SRC[(r.settings && r.settings.source) || 'generic'];
        const card = document.createElement('div');
        card.className = 'public-room-card';
        const btnLabel = joinable ? '✅ Join' : '⏳ Join queue' + (queueCount ? ' (' + queueCount + ')' : '');
        const btnCls = joinable ? 'success' : 'warning';
        card.innerHTML =
          `<div class="pub-top"><span class="pub-title">${GAME_LABELS[r.game] || '🎮 Game'}</span><span class="pub-status">${STATUS[r.state] || '🟢 In the lobby'}</span></div>
           <div class="pub-players">👑 Host: <b>${escapeHtml(String((hostP && hostP.name) || '?'))}</b> · 🎮 <b>${playerCount}/${maxP}</b>${queueCount ? ' · ⏳ ' + queueCount + ' waiting' : ''}</div>
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
    function brOpponents() {
      const order = ((currentRoom && currentRoom.br && currentRoom.br.order) || []);
      return order.filter(pid => pid !== playerId && (currentRoom.players || {})[pid]);
    }
    function brColorOf(pid) {
      const order = ((currentRoom && currentRoom.br && currentRoom.br.order) || []);
      const idx = order.indexOf(pid);
      return BR_COLORS[(idx >= 0 ? idx : 0) % BR_COLORS.length];
    }
    const rcHunters = (room) => { const r = room || currentRoom; return ((r && r.rc && r.rc.hunters) || []).filter(pid => (r.players || {})[pid]); };

    // ---------- DEAL ----------
    async function multiDeal(game) {
      if (!isHost || !currentRoom) return;
      if (game === 'race') {
        const pids = Object.keys(currentRoom.players || {});
        const targetPid = pids[Math.floor(Math.random() * pids.length)];
        await generateCharacterPool({ restarts: null, rc: { gameId: Date.now(), targetPid, hunters: shuffleArray(pids.filter(p => p !== targetPid)), turnIdx: 0, secretId: null, question: null, answer: null, guess: null, log: [], phase: 'selection' } });
      } else {
        await generateCharacterPool({ restarts: null, br: { gameId: Date.now(), order: [], turnIdx: 0, secrets: {}, points: {}, found: {}, question: null, answers: {}, guess: null, log: [], phase: 'selection' } });
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
        ? (iPick ? '🎯 You are the TARGET — pick the mystery character!' : '🎯 Waiting for the TARGET…')
        : '🎯 Choose Your Secret Character';
      document.querySelector('.selection-header p').textContent = isRace
        ? (iPick ? 'The other players will hunt it — pick well!' : '🔒 ' + tName + ' is secretly picking the mystery character')
        : 'Everyone picks one — you\'ll all try to guess each other\'s!';
      document.getElementById('confirmSelectionBtn').disabled = true;
      document.getElementById('confirmSelectionBtn').style.display = iPick ? 'inline-block' : 'none';
      document.querySelector('.selection-controls').style.display = iPick ? 'flex' : 'none';
      if (!iPick) document.getElementById('selectionStatus').textContent = '🔒 ' + tName + ' is picking… the game starts as soon as the choice is made.';
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
      else if (done >= need.length) el.textContent = '✅ Everyone picked — dealing!';
      else el.textContent = '⏳ ' + done + '/' + need.length + ' players picked…' + (sels[playerId] ? ' (you picked ✔)' : '');
    }
    // Called on every snapshot while state === 'selection' (main listener)
    function multiSelectionTick() {
      if (!currentRoom || currentRoom.state !== 'selection') return;
      multiSelectionStatusText();
      const sels = currentRoom.selections || {};
      const seated = Object.keys(currentRoom.players || {});
      // Too few players mid-selection → host cancels back to the lobby
      if (isHost && seated.length < 3) {
        database.ref('rooms/' + roomCode).update({ state: 'lobby', characters: null, selections: null, br: null, rc: null });
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
    const brTurnPid = (room) => { const r = room || currentRoom; const o = ((r.br && r.br.order) || []).filter(pid => (r.players || {})[pid]); return o.length ? o[(r.br.turnIdx || 0) % o.length] : null; };
    const rcTurnPid = (room) => { const r = room || currentRoom; const h = ((r.rc && r.rc.hunters) || []).filter(pid => (r.players || {})[pid]); return h.length ? h[(r.rc.turnIdx || 0) % h.length] : null; };
    function battleAsk() {
      const inp = document.getElementById('brQuestionInput'); if (!inp) return;
      const text = inp.value.trim(); if (!text) return;
      if (brTurnPid() !== playerId) { showNotification("It's not your turn to ask!"); return; }
      database.ref('rooms/' + roomCode + '/br').update({ question: { by: playerId, text: text.slice(0, 200) }, answers: {}, phase: 'answers' });
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
      database.ref('rooms/' + roomCode + '/br').update({ question: null, answers: {}, phase: 'ask', turnIdx: ((br.turnIdx || 0) + 1) % o.length });
      touchActivity();
    }
    function battleAllAnswersIn() {
      const br = (currentRoom && currentRoom.br) || {};
      if (!br.question) return false;
      const need = (br.order || []).filter(pid => pid !== br.question.by && (currentRoom.players || {})[pid] && !(currentRoom.players[pid] || {}).dcAt);
      return need.every(pid => (br.answers || {})[pid]);
    }
    // HOST watchdog: advance on a vanished asker/answers, resolve guesses, end checks
    function battleWatchdog() {
      const br = (currentRoom && currentRoom.br) || {};
      if (br.phase === 'over' || brWatchBusy) return;
      const players = currentRoom.players || {};
      const alive = pid => players[pid] && !players[pid].dcAt;
      const seated = Object.keys(players);
      // Game is pointless under 2 seated players → end it
      if (seated.length < 2) {
        database.ref('rooms/' + roomCode).update({ 'br/phase': 'over', state: 'finished' });
        return;
      }
      // A guess is pending → resolve it
      if (br.guess) {
        const gs = br.guess;
        brWatchBusy = true;
        try {
          const correct = gs.charId === (br.secrets || {})[gs.target];
          const unfoundAlive = (br.order || []).filter(pid => alive(pid) && !(br.found || {})[pid] && pid !== gs.target).length;
          const pts = correct ? (unfoundAlive + 1) * 100 : 0;
          const log = (br.log || []).slice(-39);
          const name = (players[gs.by] || {}).name || '?';
          const tName = (players[gs.target] || {}).name || '?';
          const charName = ((currentRoom.characters || []).find(c => c.id === gs.charId) || {}).name || '?';
          log.push(correct
            ? { k: 'find', txt: '🎯 ' + name + ' found ' + tName + '\'s secret: ' + charName + '! (+' + pts + ' pts)' }
            : { k: 'miss', txt: '❌ ' + name + ' wrongly guessed ' + charName + ' for ' + tName + '…' });
          const upd = { 'br/guess': null, 'br/log': log, 'br/phase': 'ask', 'br/question': null, 'br/answers': {} };
          const o = (br.order || []).filter(pid => players[pid]);
          upd['br/turnIdx'] = ((br.turnIdx || 0) + 1) % Math.max(o.length, 1);
          if (correct) {
            upd['br/found/' + gs.target] = { by: gs.by, pts };
            upd['br/points/' + gs.by] = ((br.points || {})[gs.by] || 0) + pts;
            // End? Only 0 or 1 unfound secret left among seated players
            const stillUnfound = o.filter(pid => pid !== gs.target && !(br.found || {})[pid]);
            if (stillUnfound.length <= 1) { upd['br/phase'] = 'over'; upd.state = 'finished'; }
          }
          database.ref('rooms/' + roomCode).update(upd);
        } finally { brWatchBusy = false; }
        return;
      }
      // Current asker vanished → skip their turn (works in both phases)
      const turnPid = brTurnPid();
      if (turnPid && !alive(turnPid) && seatsConnectedCount() >= 2) {
        const o = (br.order || []).filter(pid => players[pid]);
        database.ref('rooms/' + roomCode + '/br').update({ question: null, answers: {}, phase: 'ask', turnIdx: ((br.turnIdx || 0) + 1) % Math.max(o.length, 1) });
      }
    }
    function seatsConnectedCount() { return Object.keys((currentRoom && currentRoom.players) || {}).filter(pid => !(currentRoom.players[pid] || {}).dcAt).length; }

    async function battleGuess(charId) {
      const br = currentRoom.br;
      const targetName = (currentRoom.players[brCrossTarget] || {}).name || 'them';
      const charName = ((currentRoom.characters || []).find(c => c.id === charId) || {}).name || '?';
      showInteraction('🎯 Make a guess?', 'You think <b>' + escapeHtml(targetName) + '</b>\'s secret is <b>' + escapeHtml(charName) + '</b>?<br><small>This uses your turn — right or wrong.</small>', [
        { label: 'Cancel', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: '🎯 Guess!', onclick: async () => {
          closeInteraction();
          brGuessMode = false;
          await database.ref('rooms/' + roomCode + '/br/guess').set({ by: playerId, target: brCrossTarget, charId });
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
        if (brCrossTarget === playerId || !brCrossTarget || !(currentRoom.players || {})[brCrossTarget]) brCrossTarget = brOpponents()[0] || null;
        if (!brCrossTarget) { showNotification('No opponent to guess!'); return; }
        brGuessMode = true;
        showNotification('🎯 Guess mode: click the card you think is <b>' + escapeHtml((currentRoom.players[brCrossTarget] || {}).name || '') + '</b>\'s secret!');
      }
      renderBattleBoard();
    }
    function battleClearMarks() { brMarks = {}; renderBattleBoard(); }
    function brToggleMark(charId) {
      if (!brCrossTarget || brCrossTarget === playerId) return;
      if (!brMarks[brCrossTarget]) brMarks[brCrossTarget] = {};
      if (brMarks[brCrossTarget][charId]) delete brMarks[brCrossTarget][charId]; else brMarks[brCrossTarget][charId] = true;
      renderBattleBoard();
    }

    // ---------- BATTLE ROYALE RENDER ----------
    function updateBattle() {
      const br = currentRoom.br || {};
      const players = currentRoom.players || {};
      const turnPid = brTurnPid();
      const turnName = (players[turnPid] || {}).name || '—';
      const phaseNames = { ask: '💬 Question time', answers: '✋ Answering…', over: '🏁 Game over' };
      document.getElementById('brTurnBadge').textContent = br.phase === 'over' ? '🏁 Finished' : ('🎤 ' + turnName + (turnPid === playerId ? ' (You)' : ''));
      document.getElementById('brPhaseBadge').textContent = phaseNames[br.phase] || '';
      // Opponent chips (colored) — click to pick whom your ❌ marks belong to
      if (!brCrossTarget || brCrossTarget === playerId || !players[brCrossTarget]) brCrossTarget = brOpponents()[0] || null;
      const chips = document.getElementById('brChips');
      chips.innerHTML = '';
      brOpponents().forEach(pid => {
        const p = players[pid];
        const col = brColorOf(pid);
        const chip = document.createElement('button');
        chip.className = 'br-chip' + (brCrossTarget === pid ? ' sel' : '');
        chip.style.setProperty('--c', col);
        chip.innerHTML = `${avatarCircle(p.avatar, 'ava-chat')}<span class="chip-name">${escapeHtml(String(p.name || '?'))}</span><span class="chip-pts">${(br.points || {})[pid] || 0} pts</span>${(br.found || {})[pid] ? '<span class="chip-state">🔍 found</span>' : ''}${(p.dcAt ? '<span class="chip-state">🔌</span>' : '')}${turnPid === pid && br.phase !== 'over' ? '<span class="chip-state">🎤</span>' : ''}`;
        chip.addEventListener('click', () => { brCrossTarget = pid; showNotification('❌ Your marks now track: ' + (p.name || '?')); updateBattle(); });
        chips.appendChild(chip);
      });
      // My secret + my points
      const myChar = (currentRoom.characters || []).find(c => c.id === (br.secrets || {})[playerId]);
      const iAmFound = !!(br.found || {})[playerId];
      document.getElementById('brMySecretImg').src = myChar ? myChar.image : '';
      document.getElementById('brMySecretName').textContent = (myChar ? myChar.name : '—') + (iAmFound ? ' · 🔍 FOUND!' : '');
      document.getElementById('brMyPoints').textContent = ((br.points || {})[playerId] || 0) + ' pts';
      renderBattleBoard(); renderBattleQA(); renderBattleLog();
      if (br.phase === 'over') renderMultiEnd('battle'); else document.getElementById('multiEndScreen').classList.remove('show');
    }
    function renderBattleBoard() {
      const board = document.getElementById('brBoard'); if (!board || !currentRoom) return;
      const br = currentRoom.br || {};
      board.className = 'board' + (brGuessMode ? ' guessing' : '');
      board.innerHTML = '';
      const foundSet = {}; // charIds that are someone's revealed secret
      const secrets = br.secrets || {};
      Object.keys(br.found || {}).forEach(pid => { if (secrets[pid] != null) foundSet[secrets[pid]] = pid; });
      (currentRoom.characters || []).forEach(char => {
        const card = document.createElement('div'); card.className = 'card';
        if (foundSet[char.id] != null) { card.classList.add('br-found'); card.style.setProperty('--c', brColorOf(foundSet[char.id])); }
        const marks = document.createElement('div'); marks.className = 'br-marks';
        brOpponents().forEach(pid => {
          if (brMarks[pid] && brMarks[pid][char.id]) {
            const m = document.createElement('span'); m.className = 'br-mark'; m.style.setProperty('--c', brColorOf(pid)); m.textContent = '✕';
            marks.appendChild(m);
          }
        });
        card.appendChild(marks);
        const img = document.createElement('img'); img.className = 'card-img'; img.src = char.image || ''; img.alt = char.name || ''; card.appendChild(img);
        const info = document.createElement('div'); info.className = 'card-info';
        info.innerHTML = `<div class="card-name">${char.name || 'Unknown'}</div>`;
        card.appendChild(info);
        card.addEventListener('click', () => {
          if (brGuessMode) {
            if ((br.found || {})[brCrossTarget]) { showNotification('That player is already found — pick another chip color!'); return; }
            battleGuess(char.id);
          } else brToggleMark(char.id);
        });
        board.appendChild(card);
      });
    }
    function renderBattleQA() {
      const area = document.getElementById('brQuestionArea'); if (!area || !currentRoom) return;
      const br = currentRoom.br || {};
      const players = currentRoom.players || {};
      if (br.phase === 'over') { area.innerHTML = '<div class="question-display"><div class="text">🏁 Game over — check the results!</div></div>'; return; }
      const turnPid = brTurnPid();
      const turnName = (players[turnPid] || {}).name || '?';
      if (!br.question) {
        area.innerHTML = turnPid === playerId
          ? `<div class="question-form"><input type="text" id="brQuestionInput" placeholder="Ask a yes/no question to EVERYONE…" maxlength="200"><button class="success" onclick="battleAsk()">Ask</button></div><div class="uc-hint-line">…or guess a secret with the 🎯 button below the board.</div>`
          : `<div class="question-display"><div class="label">Waiting…</div><div class="text">🎤 <b>${escapeHtml(turnName)}</b> is thinking of a question…</div></div>`;
        const inp = document.getElementById('brQuestionInput');
        if (inp) inp.addEventListener('keypress', (e) => { if (e.key === 'Enter') battleAsk(); });
        return;
      }
      const q = br.question;
      const answers = br.answers || {};
      const myAnswer = answers[playerId];
      const answerers = (br.order || []).filter(pid => pid !== q.by && players[pid]);
      const answerChips = answerers.map(pid => {
        const a = answers[pid];
        return `<span class="qa-ans" style="--c:${brColorOf(pid)}">${avatarCircle(players[pid].avatar, 'ava-chat')}${escapeHtml(String(players[pid].name || '?'))} ${a ? (a === 'YES' ? '✅' : '🚫') : '⏳'}</span>`;
      }).join('');
      const allIn = battleAllAnswersIn();
      let bottom = '';
      if (q.by === playerId) {
        bottom = allIn ? `<button class="success full" onclick="battleNextTurn()">➜ Next turn</button>` : `<div class="uc-hint-line">Waiting for everyone's answers…</div>`;
      } else if (!myAnswer) {
        bottom = `<div class="answer-buttons"><button class="success" onclick="battleAnswer('YES')">✓ YES</button><button class="danger" onclick="battleAnswer('NO')">✕ NO</button></div>`;
      } else {
        bottom = `<div class="uc-hint-line">You answered <b>${myAnswer}</b> — waiting ${allIn ? '' : 'for the others… '}(or guess with 🎯 on your turn)</div>`;
      }
      area.innerHTML = `<div class="question-display"><div class="label">${q.by === playerId ? 'Your question' : '🎤 ' + escapeHtml((players[q.by] || {}).name || '?') + ' asks EVERYONE'}</div><div class="text">${escapeHtml(String(q.text || ''))}</div><div class="qa-answers">${answerChips}</div>${bottom}</div>`;
    }
    function renderBattleLog() {
      const logEl = document.getElementById('brLog'); if (!logEl || !currentRoom) return;
      const log = ((currentRoom.br || {}).log) || [];
      if (log.length === 0) { logEl.innerHTML = '<p style="text-align:center;color:var(--muted);">Nothing yet</p>'; return; }
      logEl.innerHTML = '';
      [...log].reverse().forEach(e => {
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
      database.ref('rooms/' + roomCode + '/rc').update({ question: { by: playerId, text: text.slice(0, 200) }, answer: null, phase: 'answers' });
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
      const h = rcHunters();
      if (!h.length) return;
      database.ref('rooms/' + roomCode + '/rc').update({ question: null, answer: null, phase: 'ask', turnIdx: ((rc.turnIdx || 0) + 1) % h.length });
      touchActivity();
    }
    function raceWatchdog() {
      const rc = (currentRoom && currentRoom.rc) || {};
      if (rc.phase === 'over' || rcWatchBusy) return;
      const players = currentRoom.players || {};
      const alive = pid => players[pid] && !players[pid].dcAt;
      // Target gone → game over (nobody left to answer)
      if (!players[rc.targetPid]) {
        database.ref('rooms/' + roomCode).update({ 'rc/phase': 'over', 'rc/winner': null, 'rc/endReason': 'target-left', state: 'finished' });
        return;
      }
      // No hunters left → over
      if (rcHunters().length === 0) {
        database.ref('rooms/' + roomCode).update({ 'rc/phase': 'over', 'rc/winner': null, 'rc/endReason': 'hunters-left', state: 'finished' });
        return;
      }
      // Pending hunter guess → resolve
      if (rc.guess) {
        rcWatchBusy = true;
        try {
          const correct = rc.guess.charId === rc.secretId;
          const log = (rc.log || []).slice(-39);
          const name = (players[rc.guess.by] || {}).name || '?';
          const charName = ((currentRoom.characters || []).find(c => c.id === rc.guess.charId) || {}).name || '?';
          log.push(correct
            ? { k: 'find', txt: '🏆 ' + name + ' FOUND the mystery character: ' + charName + '!' }
            : { k: 'miss', txt: '❌ ' + name + ' tried ' + charName + ' — wrong!' });
          const upd = { 'rc/guess': null, 'rc/log': log, 'rc/phase': 'ask', 'rc/question': null, 'rc/answer': null };
          if (correct) { upd['rc/phase'] = 'over'; upd['rc/winner'] = rc.guess.by; upd.state = 'finished'; }
          else upd['rc/turnIdx'] = ((rc.turnIdx || 0) + 1) % Math.max(rcHunters().length, 1);
          database.ref('rooms/' + roomCode).update(upd);
        } finally { rcWatchBusy = false; }
        return;
      }
      const turnPid = rcTurnPid();
      if (turnPid && !alive(turnPid)) {
        const h = rcHunters();
        database.ref('rooms/' + roomCode + '/rc').update({ question: null, answer: null, phase: 'ask', turnIdx: ((rc.turnIdx || 0) + 1) % Math.max(h.length, 1) });
      }
    }
    async function raceGuess(charId) {
      const charName = ((currentRoom.characters || []).find(c => c.id === charId) || {}).name || '?';
      showInteraction('🎯 Make a guess?', 'You think the mystery character is <b>' + escapeHtml(charName) + '</b>?<br><small>This uses your turn — right or wrong.</small>', [
        { label: 'Cancel', onclick: () => { closeInteraction(); }, class: 'secondary' },
        { label: '🎯 Guess!', onclick: async () => {
          closeInteraction();
          rcGuessMode = false;
          await database.ref('rooms/' + roomCode + '/rc/guess').set({ by: playerId, charId });
          touchActivity();
        }, class: 'warning' }
      ]);
    }
    function raceToggleGuess() {
      const rc = (currentRoom && currentRoom.rc) || {};
      if (rc.phase === 'over') return;
      if (rc.targetPid === playerId) { showNotification('You are the TARGET — the hunters do the guessing!'); return; }
      if (rcTurnPid() !== playerId) { showNotification('You can guess on your turn only!'); return; }
      rcGuessMode = !rcGuessMode;
      if (rcGuessMode) showNotification('🎯 Guess mode: click the card you think is the mystery character!');
      renderRaceBoard();
    }
    function raceClearMarks() { rcMarks = {}; renderRaceBoard(); }
    function updateRace() {
      const rc = currentRoom.rc || {};
      const players = currentRoom.players || {};
      const isTarget = rc.targetPid === playerId;
      const targetName = (players[rc.targetPid] || {}).name || '?';
      const turnPid = rcTurnPid();
      const turnName = (players[turnPid] || {}).name || '—';
      document.getElementById('rcTurnBadge').textContent = rc.phase === 'over' ? '🏁 Finished' : ('🎤 ' + turnName + (turnPid === playerId ? ' (You)' : ''));
      document.getElementById('rcPhaseBadge').textContent = rc.phase === 'over' ? '🏁 Game over' : (rc.question ? '✋ Target answering…' : '💬 Question time');
      // Banner: target sees their own secret; hunters see the mystery card
      const banner = document.getElementById('rcBanner');
      if (isTarget) {
        const myChar = (currentRoom.characters || []).find(c => c.id === rc.secretId);
        banner.classList.remove('br-hide');
        banner.onclick = () => banner.classList.toggle('br-hide');
        banner.innerHTML = `<img src="${myChar ? myChar.image : ''}" alt=""><div class="br-mysecret-info"><div class="br-mysecret-label">🎯 You are the TARGET — answer questions honestly (tap to hide)</div><div class="br-mysecret-name">${myChar ? myChar.name : '—'}</div></div>`;
      } else {
        banner.onclick = null;
        banner.innerHTML = `<div class="br-mysecret-info"><div class="br-mysecret-label">⚡ RACE — mystery character</div><div class="br-mysecret-name">Hunt <b style="color:var(--warning)">${escapeHtml(targetName)}</b>'s secret before the others!</div></div>`;
      }
      renderRaceBoard(); renderRaceQA(); renderRaceLog();
      if (rc.phase === 'over') renderMultiEnd('race'); else document.getElementById('multiEndScreen').classList.remove('show');
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
      if (rc.phase === 'over') { area.innerHTML = '<div class="question-display"><div class="text">🏁 Game over — check the results!</div></div>'; return; }
      const isTarget = rc.targetPid === playerId;
      const targetName = (players[rc.targetPid] || {}).name || '?';
      const turnPid = rcTurnPid();
      const turnName = (players[turnPid] || {}).name || '?';
      if (!rc.question) {
        if (isTarget) area.innerHTML = `<div class="question-display"><div class="text">🎯 You are the TARGET — wait for <b>${escapeHtml(turnName)}</b>'s question…</div></div>`;
        else if (turnPid === playerId) area.innerHTML = `<div class="question-form"><input type="text" id="rcQuestionInput" placeholder="Ask the target a yes/no question…" maxlength="200"><button class="success" onclick="raceAsk()">Ask</button></div><div class="uc-hint-line">…or guess the mystery character with 🎯 below the board.</div>`;
        else area.innerHTML = `<div class="question-display"><div class="label">Waiting…</div><div class="text">🎤 <b>${escapeHtml(turnName)}</b> is thinking of a question…</div></div>`;
        const inp = document.getElementById('rcQuestionInput');
        if (inp) inp.addEventListener('keypress', (e) => { if (e.key === 'Enter') raceAsk(); });
        return;
      }
      const q = rc.question;
      let bottom = '';
      if (!rc.answer) {
        if (isTarget) bottom = `<div class="answer-buttons"><button class="success" onclick="raceAnswer('YES')">✓ YES</button><button class="danger" onclick="raceAnswer('NO')">✕ NO</button></div>`;
        else bottom = `<div class="uc-hint-line">⏳ Waiting for <b>${escapeHtml(targetName)}</b>'s answer…</div>`;
      } else {
        bottom = `<div class="uc-hint-line" style="font-size:1rem">Answer: <b>${rc.answer === 'YES' ? '✅ YES' : '🚫 NO'}</b></div>`;
        if (q.by === playerId) bottom += `<button class="success full" onclick="raceNextTurn()" style="margin-top:8px">➜ Next turn</button>`;
      }
      area.innerHTML = `<div class="question-display"><div class="label">🎤 ${escapeHtml((players[q.by] || {}).name || '?')} asks the target</div><div class="text">${escapeHtml(String(q.text || ''))}</div>${bottom}</div>`;
    }
    function renderRaceLog() {
      const logEl = document.getElementById('rcLog'); if (!logEl || !currentRoom) return;
      const log = ((currentRoom.rc || {}).log) || [];
      if (log.length === 0) { logEl.innerHTML = '<p style="text-align:center;color:var(--muted);">Nothing yet</p>'; return; }
      logEl.innerHTML = '';
      [...log].reverse().forEach(e => {
        const d = document.createElement('div');
        d.className = 'br-log-' + (e.k === 'find' ? 'find' : e.k === 'miss' ? 'miss' : e.k === 'q' ? 'q' : 'info');
        d.textContent = e.txt;
        logEl.appendChild(d);
      });
    }

    // ---------- SHARED END SCREEN + REPLAY (battle & race) ----------
    function meParticipants() {
      // players eligible to click "Play Again": seated and not spectating this game
      const g = (currentRoom || {}).game;
      const gd = g === 'battle' ? ((currentRoom || {}).br || {}) : ((currentRoom || {}).rc || {});
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
      if (sid !== 'battleScreen' && sid !== 'raceScreen') { screen.classList.remove('show'); return; }
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
        title.textContent = meWin ? '🏆 You win the Battle Royale!' : '🏁 Battle Royale over!';
        sub.textContent = meWin ? 'Champion hunter!' : '👑 ' + ((players[winner] || {}).name || '?') + ' takes it!';
        ranking.forEach((pid, i) => {
          const p = players[pid] || {};
          const found = (br.found || {})[pid];
          const secChar = (currentRoom.characters || []).find(c => c.id === secrets[pid]);
          const row = document.createElement('div');
          row.className = 'me-row' + (pid === playerId ? ' me' : '');
          row.style.setProperty('--c', brColorOf(pid));
          row.innerHTML = `<span class="me-rank">${['🥇','🥈','🥉'][i] || (i + 1) + '.'}</span>${avatarCircle(p.avatar, 'ava-chat')}<span>${escapeHtml(String(p.name || '?'))}${pid === playerId ? ' (You)' : ''}</span><span class="me-pts">${(br.points || {})[pid] || 0} pts${found ? '' : ' · 🕵️ never found'}</span>`;
          if (secChar) { const s = document.createElement('small'); s.style.color = 'var(--muted)'; s.style.width = '100%'; s.textContent = (found ? 'secret: ' : 'secret was: ') + (secChar.name || '?'); row.appendChild(s); row.style.flexWrap = 'wrap'; }
          list.appendChild(row);
        });
      } else {
        const rc = currentRoom.rc || {};
        const winner = rc.winner;
        const secretChar = (currentRoom.characters || []).find(c => c.id === rc.secretId);
        if (winner) {
          title.textContent = winner === playerId ? '🏆 You found it first!' : '🏁 Race over!';
          sub.textContent = '🏆 ' + ((players[winner] || {}).name || '?') + ' found ' + (secretChar ? secretChar.name : 'the character') + ' first!';
        } else {
          title.textContent = '🏁 Race over';
          sub.textContent = rc.endReason === 'target-left' ? 'The target left the game!' : 'No hunters left!';
        }
        if (secretChar) {
          const row = document.createElement('div');
          row.className = 'me-row';
          row.innerHTML = `<span class="me-rank">🎭</span><span>The mystery character was <b>${escapeHtml(secretChar.name || '?')}</b></span>`;
          list.appendChild(row);
        }
        rcHunters().concat(rc.targetPid ? [rc.targetPid] : []).filter(pid => players[pid]).forEach(pid => {
          const p = players[pid] || {};
          const row = document.createElement('div');
          row.className = 'me-row' + (pid === playerId ? ' me' : '');
          row.innerHTML = `${avatarCircle(p.avatar, 'ava-chat')}<span>${escapeHtml(String(p.name || '?'))}${pid === playerId ? ' (You)' : ''}</span><span class="me-pts">${pid === rc.targetPid ? '🎯 target' : (pid === winner ? '🏆 winner' : '🔍 hunter')}</span>`;
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
    async function returnToLobbyFromMulti() {
      const gd = currentRoom && currentRoom.game === 'battle' ? (currentRoom.br || {}) : (currentRoom && currentRoom.rc || {});
      const inGame = currentRoom && (currentRoom.state === 'playing' || currentRoom.state === 'finished') && gd.gameId;
      if (!inGame) { showScreen('lobbyScreen'); return; }
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
        } else if (accountData.length === 2) {
          const count1 = settings.distribution || Math.floor(totalChars / 2);
          const count2 = totalChars - count1;
          const chars1 = pickUnique(shuffleArray((accountData[0].characters || []).slice()), count1);
          const chars2 = pickUnique(shuffleArray((accountData[1].characters || []).slice()), count2);
          selectedChars = shuffleArray([...chars1, ...chars2]);
        } else {
          // 3+ synced accounts (multiplayer rooms): every account shares the board equally
          const per = Math.floor(totalChars / accountData.length);
          accountData.forEach(acc => selectedChars.push(...pickUnique(shuffleArray((acc.characters || []).slice()), per)));
          if (selectedChars.length < totalChars) selectedChars = shuffleArray([...selectedChars, ...pickUnique(shuffleArray(allChars.slice()), totalChars - selectedChars.length)]);
          selectedChars = shuffleArray(selectedChars);
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
      // Restore the classic 2P texts/controls (multiplayer modes customize them)
      document.querySelector('.selection-header h2').textContent = '🎯 Choose Your Secret Character';
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
        if (tp && tp !== playerId) { showNotification('🔒 Only the TARGET picks the mystery character!'); return; }
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
        showNotification('🚪 Your opponent left during selection — back to the lobby.');
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
      document.getElementById('guessBtn').innerHTML = '❌ <span class="btn-label">Cancel Guess</span>';
      document.getElementById('guessBtn').onclick = cancelGuessingMode;
      showNotification('Click on a character to make your guess!');
      renderBoard();
    }

    function cancelGuessingMode() {
      guessMode = false;
      document.getElementById('guessBtn').innerHTML = '🎯 <span class="btn-label">Make a Guess</span>';
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
          showNotification('🚪 Your opponent left the game — you win by default! 🏆');
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
      await maybePromoteQueue(true); // ⏳ queued players take free seats before the new deal
      if (Object.keys((currentRoom && currentRoom.players) || {}).length < 2) {
        showNotification('🚪 Not enough players left — back to the lobby.');
        await returnToLobby();
        return;
      }
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
        eliminations: null, winner: null, currentQuestion: null, questionHistory: null, gameChat: null, restarts: null, uc: null, br: null, rc: null
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
          order: order, turnIdx: 0, clueLog: null,
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
      showInteraction('🎲 Shuffle words & roles?', 'Deals NEW words AND new roles (a new Undercover is picked among the still-playing players). The round restarts.', [
        { label: 'Cancel', onclick: () => {}, class: 'secondary' },
        { label: '🎲 Shuffle it!', class: 'warning', onclick: () => doUcWordReroll() }
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
      if (ev.kind === 'leave') return '🚪 Too many players left — the game cannot continue.';
      if (ev.kind === 'mwleave') return '⚪ Mr. White left the game — he is out! The game goes on!';
      if (ev.kind === 'reroll') return '🎲 The host shuffled everything — NEW words AND NEW roles! Round restarts!';
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
        else if (players[pid] && players[pid].dcAt) status = '🔌 away…';
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
      if (roomCode && playerId) {
        // Cancel the disconnect marker first (avoids a ghost entry), then leave cleanly
        try { database.ref('rooms/' + roomCode + '/players/' + playerId + '/dcAt').onDisconnect().cancel(); } catch (e) {}
        try { database.ref('rooms/' + roomCode + '/queue/' + playerId).onDisconnect().cancel(); } catch (e) {}
        database.ref('rooms/' + roomCode + '/players/' + playerId).remove();
        database.ref('rooms/' + roomCode + '/queue/' + playerId).remove();
      }
    });
