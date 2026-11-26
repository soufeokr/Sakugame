/* Sakugame — session Supabase (V1).
   Fait le lien entre le client Supabase (window.sakuBackend, voir supabase-client.js)
   et l'interface existante (currentAccount, cardState, sakuAdoptAccount… dans app.js).
   - Identité = compte Supabase connecté via Discord (PKCE).
   - Collection et solde = lus depuis le serveur ; jamais écrits depuis le navigateur.
   - Pseudo/avatar/AniList = profil LOCAL (saku-local-account.js). */
(function () {
  'use strict';
  var PROJECT = 'https://nafesytcmueciltowcci.supabase.co';
  var PUBLIC_KEY = 'sb_publishable_Bq1ZcTPaQfP4tCnXfVHRgw_Ym-IKavg';
  var STORAGE = 'saku-production-auth-v1';
  var sequence = 0, started = false;

  window.sakuInfiniteCoins = function () { return false; };
  // Écrans retirés de la V1 : si une ancienne URL ou un raccourci y mène, retour à l'accueil.
  function home() { if (typeof showScreen === 'function') showScreen('homepageScreen'); }
  if (typeof window.showShowcase !== 'function') window.showShowcase = home;
  if (typeof window.showQuests !== 'function') window.showQuests = home;

  // Un visiteur non connecté fait lever « Auth session missing » au client Supabase : c'est normal, pas une erreur.
  function isNoSession(e) { return !!e && (e.name === 'AuthSessionMissingError' || /auth session missing/i.test(String(e.message || ''))); }
  function warn(e) { if (isNoSession(e)) return; try { console.warn('Session Sakugame', e); } catch (_) {} }
  async function currentUserOrNull() {
    try { return await window.sakuBackend.currentUser(); }
    catch (e) { if (isNoSession(e)) return null; throw e; }
  }

  function metaName(u) {
    var m = (u && u.user_metadata) || {};
    var n = String(m.full_name || m.name || m.user_name || 'Joueur')
      .replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 40);
    return n || 'Joueur';
  }
  function metaAvatar(u) {
    var m = (u && u.user_metadata) || {};
    var a = m.avatar_url || m.picture;
    return (typeof a === 'string' && /^https:\/\/(cdn\.discordapp\.com|media\.discordapp\.net)\//.test(a)) ? a : null;
  }

  function clear() {
    window.__sakuBoot = null;
    if (window.sakuProfileSyncStop) window.sakuProfileSyncStop();
    window.sakuSecureUserId = null;
    window.sakuSecureCoins = null;
    currentAccount = null;
    if (typeof cardsLoad === 'function') cardsLoad(); else cardState = cardNormalize(null);
    updateUserButton();
    try { sakuRenderDiscordBox(null); } catch (e) {}
    if (typeof cardsRenderStats === 'function') try { cardsRenderStats(); } catch (e) {}
  }

  // Appel d'une fonction serveur Supabase avec la session du joueur (progression, amis, vitrine…).
  // Les erreurs métier du serveur (raise exception 'not_ready'…) arrivent dans error.message.
  function readSession() {
    try { var s = JSON.parse(localStorage.getItem(STORAGE) || 'null'); return s && typeof s === 'object' ? s : null; } catch (e) { return null; }
  }
  async function rpc(name, args) {
    if (!/^[a-z_]{3,60}$/.test(String(name))) throw new Error('invalid_rpc');
    var s = readSession();
    if (!s || !s.access_token || (s.expires_at && s.expires_at * 1000 - Date.now() < 45000)) {
      // currentUser() fait renouveler le jeton par le client Supabase si besoin
      if (window.sakuBackend) { try { await window.sakuBackend.currentUser(); } catch (e) {} }
      s = readSession();
    }
    if (!s || !s.access_token) { var na = new Error('not_authenticated'); na.code = 'not_authenticated'; throw na; }
    var res = await fetch(PROJECT + '/rest/v1/rpc/' + name, {
      method: 'POST',
      headers: { apikey: PUBLIC_KEY, Authorization: 'Bearer ' + s.access_token, 'Content-Type': 'application/json' },
      body: JSON.stringify(args || {})
    });
    var text = await res.text(), data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) {}
    if (!res.ok) {
      var err = new Error((data && data.message) || ('http_' + res.status));
      err.status = res.status; err.code = data && data.code;
      throw err;
    }
    return data;
  }
  window.sakuRpc = rpc;

  // b328 — Le compte arrive en un seul appel (account_bootstrap). Le petit script en tête de
  // index.html lance cet appel dès l'ouverture de la page ; on récupère sa réponse ici.
  var hydratingId = null;
  function takeEarlyBoot(uidv) {
    var b = window.__sakuBoot; window.__sakuBoot = null;
    if (!b || b.uid !== uidv || !b.p || Date.now() - b.at > 30000) return null;
    return b.p;
  }
  async function bootstrap(uidv) {
    var early = takeEarlyBoot(uidv), data = null;
    if (early) { try { data = await early; } catch (e) { data = null; } }
    if (!data || data.uid !== uidv) data = await rpc('account_bootstrap');
    return data;
  }
  async function legacyLoad() {
    var res = await Promise.all([
      window.sakuBackend.gameCollection(),
      window.sakuBackend.wallet(),
      rpc('profile_data_get').catch(function (e) { warn(e); return null; })
    ]);
    return { cards: res[0], coins: res[1], profile: res[2], progress: null, free: null };
  }

  async function hydrate() {
    var run = ++sequence;
    if (!window.sakuBackend) throw new Error('Service de compte indisponible');
    var user;
    try { user = await currentUserOrNull(); } catch (e) { if (run === sequence) hydratingId = null; throw e; }
    if (run !== sequence) return;
    if (!user) { hydratingId = null; if (currentAccount || window.sakuSecureUserId) clear(); return; }
    hydratingId = user.id;
    try {
      if (window.sakuSecureUserId && window.sakuSecureUserId !== user.id) clear();
      var got = null;
      try {
        var boot = await bootstrap(user.id);
        if (run !== sequence) return;
        if (boot && boot.uid === user.id && boot.coins != null && window.sakuBackend.buildCollection) {
          got = { cards: window.sakuBackend.buildCollection(boot.cards || [], boot.options || []), coins: boot.coins,
            profile: boot.profile, progress: boot.progress || null, free: boot.free || null };
        }
      } catch (e) { warn(e); }
      if (run !== sequence) return;
      if (!got) { got = await legacyLoad(); if (run !== sequence) return; }
      var store = window.sakuLocalAccountRef(user.id);
      var server = got.profile;
      if (window.sakuProfileSync) window.sakuProfileSync(user.id, server && typeof server === 'object' ? server : {});
      var local = (await store.once('value')).val() || {};
      var name = metaName(user), avatar = metaAvatar(user);
      var dc = { id: user.id, username: name, globalName: name, avatar: avatar, linkedAt: Date.now() };
      await store.update({ dc: dc });
      if (run !== sequence) return;
      window.sakuSecureUserId = user.id;
      window.sakuSecureCoins = got.coins;
      if (got.progress && window.sakuProgressPrime) try { window.sakuProgressPrime(user.id, got.progress); } catch (e) {}
      if (got.free && window.sakuFreeDrawsPrime) try { window.sakuFreeDrawsPrime(user.id, got.free); } catch (e) {}
      await sakuAdoptAccount(Object.assign({}, local, { dc: dc, cards: got.cards }));
      if (typeof cardsRenderStats === 'function') try { cardsRenderStats(); } catch (e) {}
      var album = document.getElementById('collectionScreen');
      if (typeof cardsRenderAlbum === 'function' && album && album.classList.contains('active')) cardsRenderAlbum();
    } finally {
      if (run === sequence) hydratingId = null;
    }
  }

  function start() {
    if (started) return;
    started = true;
    if (!window.sakuBackend) { warn(new Error('sakuBackend absent')); return; }
    // Supabase signale aussi la session trouvée au démarrage : on ne relance pas un
    // chargement déjà en cours (ou déjà fait) pour le même joueur.
    var s0 = readSession();
    if (s0 && s0.user && s0.user.id) hydratingId = s0.user.id;
    window.sakuBackend.onAuthStateChange(function (user) {
      // Le renouvellement périodique du jeton ne doit pas réinitialiser l'interface.
      if (user && (user.id === window.sakuSecureUserId || user.id === hydratingId)) return;
      setTimeout(function () { hydrate().catch(warn); }, 0);
    });
    hydrate().catch(warn);
  }

  async function signOut() {
    ++sequence;
    var id = window.sakuSecureUserId;
    clear();
    if (window.sakuBackend) await window.sakuBackend.logout();
    return id;
  }

  // Droit à l'effacement : supprime le compte Supabase (pièces, cartes, ventes…) via la
  // fonction serveur delete_my_account(), puis efface les données locales.
  async function deleteAccount() {
    var id = window.sakuSecureUserId;
    if (!id) throw new Error('Connexion requise');
    var token = null;
    try { token = JSON.parse(localStorage.getItem(STORAGE) || 'null').access_token; } catch (e) {}
    if (!token) throw new Error('Session expirée : reconnecte-toi puis réessaie.');
    var res = await fetch(PROJECT + '/rest/v1/rpc/delete_my_account', {
      method: 'POST',
      headers: { apikey: PUBLIC_KEY, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: '{}'
    });
    if (!res.ok) throw new Error('Suppression impossible (' + res.status + ')');
    ++sequence;
    clear();
    try { await window.sakuBackend.logout(); } catch (e) {}
    try {
      localStorage.removeItem(STORAGE);
      localStorage.removeItem('saku-pending-summon-v1:' + id);
      localStorage.removeItem('saku-pending-sale-v1:' + id);
    } catch (e) {}
    window.sakuLocalAccountClear(id);
  }

  window.sakuSessionBridge = Object.freeze({
    start: start,
    refresh: hydrate,
    signIn: function () {
      if (!window.sakuBackend) throw new Error('Service de compte indisponible');
      return window.sakuBackend.login();
    },
    signOut: signOut,
    deleteAccount: deleteAccount
  });
})();
