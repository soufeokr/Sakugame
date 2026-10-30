/* ============================================================
   🔒 SAKUGAME — TEST BUILD ENTRANCE GATE  (gate.js)
   ------------------------------------------------------------
   Asks for the passcode before anything else loads.

   TEST BUILD ONLY — the live build (../Sakugame) never loads this
   file, so the public site stays open to everyone.

   The code is the same one admin mode uses (SAKU_ADMIN_CODE in
   app.js): sakuga981
   ============================================================ */
(function () {
  'use strict';

  var GATE_CODE = 'sakuga981';
  var GATE_KEY = 'sakuGateOk';       // "1" once the visitor is in

  function gateEl() { return document.getElementById('sakuGate'); }

  function stored() {
    try { return localStorage.getItem(GATE_KEY) === '1'; }
    catch (e) { return false; }
  }
  function remember() {
    try { localStorage.setItem(GATE_KEY, '1'); } catch (e) {}
  }
  function forget() {
    try { localStorage.removeItem(GATE_KEY); } catch (e) {}
  }

  function unlock() {
    var g = gateEl();
    if (g) { g.hidden = true; g.setAttribute('aria-hidden', 'true'); }
    document.documentElement.classList.remove('gate-locked');
    var input = document.getElementById('sakuGateInput');
    if (input) input.value = '';
    var err = document.getElementById('sakuGateErr');
    if (err) err.textContent = '';
  }

  function reject(msg) {
    var g = gateEl();
    var err = document.getElementById('sakuGateErr');
    if (err) err.textContent = msg;
    if (g) {
      g.classList.remove('shake');
      // force a reflow so the animation can replay
      void g.offsetWidth;
      g.classList.add('shake');
      setTimeout(function () { g.classList.remove('shake'); }, 420);
    }
    var input = document.getElementById('sakuGateInput');
    if (input) { input.value = ''; input.focus(); }
  }

  function tryCode() {
    var input = document.getElementById('sakuGateInput');
    var val = (input && input.value ? input.value : '').trim();
    if (!val) { reject('Type the passcode first.'); return; }
    if (val === GATE_CODE) { remember(); unlock(); return; }
    reject('Wrong passcode.');
  }

  function wire() {
    var g = gateEl();
    if (!g) return;
    if (window.__sakuGateWired) return;      // never wire the form twice
    window.__sakuGateWired = 1;

    // already unlocked in this browser → never show it again
    // (the inline script in index.html already did this synchronously; this is
    //  the safety net for when gate.js runs on its own)
    if (stored()) { unlock(); return; }

    g.hidden = false;
    g.removeAttribute('aria-hidden');
    document.documentElement.classList.add('gate-locked');
    if (!document.documentElement.className.match(/(^|\s)gate-locked(\s|$)/)) {
      document.documentElement.className += ' gate-locked';
    }

    var form = document.getElementById('sakuGateForm');
    var input = document.getElementById('sakuGateInput');
    var eye = document.getElementById('sakuGateEye');

    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); tryCode(); });
    if (input) {
      input.addEventListener('input', function () {
        var err = document.getElementById('sakuGateErr');
        if (err) err.textContent = '';
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); tryCode(); }
      });
    }
    if (eye) eye.addEventListener('click', function () {
      if (!input) return;
      var shown = input.type === 'text';
      input.type = shown ? 'password' : 'text';
      eye.textContent = shown ? '👁' : '🙈';
      eye.setAttribute('aria-label', shown ? 'Show passcode' : 'Hide passcode');
      input.focus();
    });

    setTimeout(function () { if (input) input.focus(); }, 60);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();

  // exposed so the badge / a support link can lock the build again
  window.sakuGateLock = function () { forget(); location.reload(); };
})();
