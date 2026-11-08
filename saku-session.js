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

  function warn(e) { try { console.warn('Session Sakugame', e); } catch (_) {} }

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
    window.sakuSecureUserId = null;
    window.sakuSecureCoins = null;
    currentAccount = null;
    if (typeof cardsLoad === 'function') cardsLoad(); else cardState = cardNormalize(null);
    updateUserButton();
    try { sakuRenderDiscordBox(null); } catch (e) {}
    if (typeof cardsRenderStats === 'function') try { cardsRenderStats(); } catch (e) {}
  }

  async function hydrate() {
    var run = ++sequence;
    if (!window.sakuBackend) throw new Error('Service de compte indisponible');
    var user = await window.sakuBackend.currentUser();
    if (run !== sequence) return;
    if (!user) { if (currentAccount || window.sakuSecureUserId) clear(); return; }
    if (window.sakuSecureUserId && window.sakuSecureUserId !== user.id) clear();
    var res = await Promise.all([window.sakuBackend.gameCollection(), window.sakuBackend.wallet()]);
    if (run !== sequence) return;
    var store = window.sakuLocalAccountRef(user.id);
    var local = (await store.once('value')).val() || {};
    var name = metaName(user), avatar = metaAvatar(user);
    var dc = { id: user.id, username: name, globalName: name, avatar: avatar, linkedAt: Date.now() };
    await store.update({ dc: dc });
    if (run !== sequence) return;
    window.sakuSecureUserId = user.id;
    window.sakuSecureCoins = res[1];
    await sakuAdoptAccount(Object.assign({}, local, { dc: dc, cards: res[0] }));
    if (typeof cardsRenderStats === 'function') try { cardsRenderStats(); } catch (e) {}
    var album = document.getElementById('collectionScreen');
    if (typeof cardsRenderAlbum === 'function' && album && album.classList.contains('active')) cardsRenderAlbum();
  }

  function start() {
    if (started) return;
    started = true;
    if (!window.sakuBackend) { warn(new Error('sakuBackend absent')); return; }
    window.sakuBackend.onAuthStateChange(function (user) {
      // Le renouvellement périodique du jeton ne doit pas réinitialiser l'interface.
      if (user && user.id === window.sakuSecureUserId) return;
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
