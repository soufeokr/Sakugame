/* Sakugame (version test) — Arena dans le site.
   • Ajoute l'écran Arena (iframe arena/index.html) et l'entrée « Arena » du menu et de l'accueil Cartes.
   • Pont window.sakuArenaBridge lu par Arena : compte, collection, catalogue, base Firebase, invitations.
   • Lien direct : ?arena=CODE ouvre Arena et rejoint le salon Amical. */
(function () {
  'use strict';
  const SRC = 'arena/index.html?v=62c31be1';
  let pending = null, cardIndex = null;
  const $ = id => document.getElementById(id);
  function frame() { return $('arenaFrame'); }
  function app() { try { const f = frame(); return f && f.contentWindow && f.contentWindow.ArenaApp; } catch (e) { return null; } }
  function guestId() {
    let id = null;
    try { id = JSON.parse(localStorage.getItem('sakuArena:guest') || 'null'); } catch (e) {}
    if (!id) { id = 'g' + Math.random().toString(36).slice(2, 12); try { localStorage.setItem('sakuArena:guest', JSON.stringify(id)); } catch (e) {} }
    return id;
  }

  window.sakuArenaBridge = {
    me() {
      let id = null, name = '', avatar = '';
      try { id = typeof sakuMyDcId === 'function' ? sakuMyDcId() : null; } catch (e) {}
      try { name = typeof playerName === 'string' ? playerName : ''; } catch (e) {}
      try { avatar = (typeof myAvatar === 'function' && myAvatar()) || ''; } catch (e) {}
      return { pid: id || guestId(), uid: id, name: name || 'Joueur', avatar: avatar, signedIn: !!id };
    },
    owned() { try { return (typeof cardState !== 'undefined' && cardState && cardState.cards) || null; } catch (e) { return null; } },
    catalogue() { try { return window.sakuMarket ? window.sakuMarket.list() : []; } catch (e) { return []; } },
    db() { try { return typeof database !== 'undefined' ? database : null; } catch (e) { return null; } },
    // Visuels officiels des cartes (même rendu que la collection) : SVG avec l'image déjà chargée.
    cardSvg(id) {
      try {
        const list = window.sakuMarket ? window.sakuMarket.list() : [];
        if (!cardIndex || cardIndex.n !== list.length) { cardIndex = { n: list.length, map: new Map(list.map(c => [String(c.id), c])) }; }
        const c = cardIndex.map.get(String(id));
        if (!c) return null;
        let svg = '';
        if ((c.edition === 'strongest' || c.edition === 'hoshi') && window.sakuStrongestCard) svg = window.sakuStrongestCard(c, true);
        else if (window.sakuBasicCard) svg = window.sakuBasicCard(c, true, { image: typeof cardThumb === 'function' ? cardThumb(c.image) : c.image, level: 0 });
        return svg ? svg.replace(/data-saku-src=/g, 'href=') : null;
      } catch (e) { return null; }
    },
    backSvg() { try { return window.sakuBasicBack ? window.sakuBasicBack() : null; } catch (e) { return null; } },
    invite(code) { if (window.sakuRoomInviteOpen) window.sakuRoomInviteOpen(code, 'arena'); },
    notify(msg) { if (typeof showNotification === 'function') showNotification(msg); },
    ready() { if (pending) { const c = pending; pending = null; const a = app(); if (a && a.join) a.join(c); } }
  };

  function navInset() {
    const nav = $('mobilePrimaryNav');
    if (!nav) return 0;
    const r = nav.getBoundingClientRect();
    if (!r.height || getComputedStyle(nav).display === 'none' || getComputedStyle(nav).visibility === 'hidden') return 0;
    return r.top < window.innerHeight && r.bottom >= window.innerHeight - 2 ? Math.round(window.innerHeight - r.top) : 0;
  }
  function fit() {
    const inset = navInset();
    document.documentElement.style.setProperty('--saku-nav-inset', inset + 'px');
    const f = frame(); if (!f || !f.offsetParent) return;
    const top = Math.max(0, f.getBoundingClientRect().top + window.scrollY);
    f.style.height = Math.max(420, window.innerHeight - top - inset) + 'px';
  }
  function open(code) {
    if (typeof showScreen !== 'function') return;
    showScreen('arenaScreen');
    markNav(true);
    window.scrollTo(0, 0);
    const f = frame();
    if (f && !f.getAttribute('src')) f.setAttribute('src', SRC);
    requestAnimationFrame(fit);
    if (code) { const a = app(); if (a && a.join) a.join(code); else pending = code; }
    else { const a = app(); if (a && a.refresh) a.refresh(); }
  }
  // Barre du bas (téléphone) : le bouton Arena est mis en avant tant que l'écran Arena est ouvert.
  function markNav(on) {
    document.querySelectorAll('#mobilePrimaryNav [data-mobile-destination]').forEach(b => {
      if (b.dataset.mobileDestination === 'arena') { if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); }
      else if (on) b.removeAttribute('aria-current');
    });
  }
  document.addEventListener('saku-screen-show', e => { if (e.detail !== 'arenaScreen') markNav(false); });
  window.sakuArenaOpen = open;
  window.sakuArenaJoin = code => open(String(code || '').toUpperCase());
  window.addEventListener('resize', fit);

  const navGo = window.sakuNavGo;
  if (typeof navGo === 'function') {
    window.sakuNavGo = function (destination) {
      if (destination === 'arena') { if (typeof sakuNavClose === 'function') sakuNavClose(false); open(); return; }
      return navGo.apply(this, arguments);
    };
  }

  function mount() {
    if (!$('sakuTestPill')) {
      const pill = document.createElement('div'); pill.id = 'sakuTestPill'; pill.className = 'saku-test-pill'; pill.setAttribute('data-noi18n', '');
      pill.textContent = 'Version test'; document.body.appendChild(pill);
    }
    fit();
    const m = /[?&]arena=([A-Za-z0-9]{4})\b/.exec(location.search);
    if (m) setTimeout(() => open(m[1].toUpperCase()), 300);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
