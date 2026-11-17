/* Sakugame — parrainage. Tout est validé côté serveur (referral_status / referral_apply / referral_claim). */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const tr = s => typeof t === 'function' ? t(s) : s;
  const fmt = (tpl, n) => tr(tpl).replace('{n}', n);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const lang = () => (window.SAKU_I18N && SAKU_I18N.lang) || 'en';
  const num = n => Number(n || 0).toLocaleString(lang());
  const day = d => { try { return new Date(d).toLocaleDateString(lang(), {day: 'numeric', month: 'short', year: 'numeric'}); } catch (e) { return ''; } };
  const acct = () => (typeof currentAccount !== 'undefined' ? currentAccount : null);
  const CODE_RE = /^[A-HJ-NP-Z2-9]{6}$/;
  const STORE = 'saku_ref_code';
  const ERRORS = {
    invalid_code: 'Referral code not found.',
    own_code: 'You cannot use your own code.',
    already_referred: 'This Discord account has already been referred.',
    referral_window_closed: 'A code must be entered within 7 days of signing up.',
    discord_too_recent: 'Your Discord account must be at least 15 days old.',
    discord_required: 'Sign in with Discord to use a code.',
    referral_loop: 'You cannot use the code of a player you referred.',
    referrer_daily_limit: 'This player reached today’s referral limit. Try again tomorrow.',
    not_ready: 'Not enough referrals for this tier yet.',
    already_claimed: 'Reward already claimed.'
  };
  // Erreurs après lesquelles un code mémorisé depuis un lien ne sera jamais accepté.
  const FINAL = ['invalid_code', 'own_code', 'already_referred', 'referral_window_closed', 'discord_required', 'referral_loop'];
  const REWARDS = {
    bonus_draws: n => fmt('{n} bonus free draws', n),
    coins: n => num(n) + ' ' + tr('coins'),
    special_ticket: () => tr('Special ticket')
  };
  let status = null, uid = null, busy = false, loading = false, failed = false;

  function errCode(e) { const m = String((e && e.message) || ''); return Object.keys(ERRORS).find(k => m.indexOf(k) >= 0) || ''; }
  function errText(e) { const c = errCode(e); return tr(c ? ERRORS[c] : 'Something went wrong. Please try again.'); }
  function notify(text) { if (typeof showNotification === 'function') showNotification(text); }
  function stored() { try { const v = JSON.parse(localStorage.getItem(STORE) || 'null'); return v && CODE_RE.test(v.code) ? v.code : null; } catch (e) { return null; } }
  function forget() { try { localStorage.removeItem(STORE); } catch (e) {} }
  function link(code) { return location.origin + location.pathname.replace(/index\.html$/, '') + '?ref=' + code; }

  // Lien d'invitation : ?ref=CODE est mémorisé puis retiré de l'adresse.
  function captureLink() {
    let code = null;
    try { code = (new URLSearchParams(location.search).get('ref') || '').trim().toUpperCase(); } catch (e) {}
    if (!code || !CODE_RE.test(code)) return;
    try { localStorage.setItem(STORE, JSON.stringify({code, at: Date.now()})); } catch (e) {}
    try { const u = new URL(location.href); u.searchParams.delete('ref'); history.replaceState(history.state, '', u.pathname + u.search + u.hash); } catch (e) {}
    setTimeout(() => { if (!acct()) notify(tr('Invitation saved! Sign in with Discord to get 2 bonus free draws.')); }, 1800);
  }

  function syncDraws(s) {
    if (!s) return;
    if (window.sakuPortalBonusDraws) window.sakuPortalBonusDraws(s.bonus_draws);
    if (window.sakuPlayerRefreshDraws) window.sakuPlayerRefreshDraws();
  }

  async function load() {
    if (!acct() || !window.sakuRpc || loading) return;
    const owner = window.sakuSecureUserId || null;
    loading = true; failed = false;
    try {
      const s = await window.sakuRpc('referral_status', {});
      if (owner !== (window.sakuSecureUserId || null)) return;
      status = s; uid = owner;
      await autoApply();
    } catch (e) {
      failed = true; console.warn('Parrainage indisponible', e);
    } finally { loading = false; render(); }
  }

  async function autoApply() {
    const code = stored();
    if (!code || !status) return;
    if (status.referred_by || !status.can_enter) { forget(); return; }
    if (code === status.code) { forget(); return; }
    try {
      const s = await window.sakuRpc('referral_apply', {p_code: code});
      status = s; forget(); syncDraws(s);
      notify(tr('Referral confirmed! You received 2 bonus free draws.'));
    } catch (e) {
      const c = errCode(e);
      if (FINAL.indexOf(c) >= 0) forget();
      const box = $('refCodeInput'); if (box) box.value = code;
      notify(errText(e));
    }
  }

  async function apply(ev) {
    if (ev) ev.preventDefault();
    const input = $('refCodeInput'); if (!input || busy) return;
    const code = input.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!CODE_RE.test(code)) { notify(tr(ERRORS.invalid_code)); return; }
    busy = true; render();
    try {
      const s = await window.sakuRpc('referral_apply', {p_code: code});
      status = s; forget(); syncDraws(s);
      notify(tr('Referral confirmed! You received 2 bonus free draws.'));
    } catch (e) { notify(errText(e)); }
    finally { busy = false; render(); }
  }

  async function claim(goal) {
    if (busy || !status) return;
    busy = true; render();
    try {
      const s = await window.sakuRpc('referral_claim', {p_tier: goal});
      status = s; syncDraws(s);
      if (window.sakuProgressRefresh) window.sakuProgressRefresh();
      notify(tr('Reward collected!'));
    } catch (e) { notify(errText(e)); }
    finally { busy = false; render(); }
  }

  async function copy() {
    if (!status) return;
    const url = link(status.code);
    try { await navigator.clipboard.writeText(url); notify(tr('Link copied!')); }
    catch (e) { const i = $('refLinkInput'); if (i) { i.hidden = false; i.select(); } notify(tr('Copy the link below.')); }
  }
  async function share() {
    if (!status) return;
    const url = link(status.code);
    if (navigator.share) {
      try { await navigator.share({title: 'Sakugame', text: tr('Join me on Sakugame: we each get 2 bonus free draws!'), url}); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    copy();
  }

  function tiersHtml(s) {
    const tiers = s.tiers || [], n = Number(s.count) || 0, last = tiers.length ? tiers[tiers.length - 1].goal : 1;
    const pc = Math.min(100, Math.round(n / last * 100));
    const next = tiers.find(x => !x.ready);
    return '<div class="ref-progress">' +
      '<div class="ref-progress-head"><b>' + fmt(n === 1 ? '{n} referral' : '{n} referrals', num(n)) + '</b>' +
        (next ? '<span>' + fmt('Next tier: {n} referrals', next.goal) + '</span>' : '<span>' + tr('All tiers reached') + '</span>') + '</div>' +
      '<div class="ref-track"><span style="width:' + pc + '%"></span></div>' +
      '<ol class="ref-tiers">' + tiers.map(x => {
        const st = x.claimed ? 'claimed' : x.ready ? 'ready' : 'locked';
        const soon = x.reward === 'special_ticket';
        return '<li class="ref-tier is-' + st + '" style="--at:' + Math.min(100, x.goal / last * 100) + '%">' +
          '<span class="ref-tier-goal">' + x.goal + '</span>' +
          '<span class="ref-tier-reward">' + esc(REWARDS[x.reward] ? REWARDS[x.reward](x.amount) : x.reward) + (soon ? '<small>' + tr('Coming soon') + '</small>' : '') + '</span>' +
          (st === 'ready' ? '<button type="button" class="ref-claim" ' + (busy ? 'disabled' : '') + ' onclick="sakuReferralClaim(' + Number(x.goal) + ')">' + tr('Claim') + '</button>'
            : st === 'claimed' ? '<span class="ref-tier-state"><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg>' + tr('Claimed') + '</span>'
            : '<span class="ref-tier-state">' + fmt('{n} more', x.goal - n) + '</span>') +
          '</li>';
      }).join('') + '</ol></div>';
  }

  function enterHtml(s) {
    if (s.referred_by) {
      return '<div class="ref-enter ref-enter-done"><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg><span>' +
        tr('Referred by') + ' <b>' + esc(s.referred_by.name || '—') + '</b> · ' + esc(day(s.referred_by.at)) + '</span></div>';
    }
    if (!s.can_enter) return '';
    const waitDiscord = !s.discord_ok, ready = s.discord_ready_at && new Date(s.discord_ready_at) < new Date(s.enter_until);
    if (waitDiscord && !ready) return '';
    return '<form class="ref-enter" onsubmit="sakuReferralApply(event)">' +
      '<label for="refCodeInput">' + tr('Got a referral code?') + '</label>' +
      '<div class="hub-form-row"><input id="refCodeInput" type="text" maxlength="6" autocomplete="off" spellcheck="false" placeholder="ABC234" value="' + esc(stored() || '') + '"' + (waitDiscord ? ' disabled' : '') + '>' +
      '<button type="submit" class="hub-primary"' + (busy || waitDiscord ? ' disabled' : '') + '>' + tr('Confirm') + '</button></div>' +
      '<p class="hub-helper">' + (waitDiscord
        ? esc(fmt('Your Discord account must be at least 15 days old. Available from {n}.', day(s.discord_ready_at)))
        : esc(fmt('You can enter a code until {n}.', day(s.enter_until)))) + '</p></form>';
  }

  function listHtml(s) {
    const list = s.referrals || [];
    if (!list.length) return '<p class="ref-empty">' + tr('No referrals yet. Share your link to get started!') + '</p>';
    return '<details class="ref-list"><summary>' + fmt('My referrals ({n})', num(s.count)) + '</summary><ul>' + list.map(r =>
      '<li><span>' + (r.deleted ? '<i>' + tr('Deleted account') + '</i>' : esc(r.name || '—')) + '</span><time>' + esc(day(r.at)) + '</time></li>').join('') + '</ul></details>';
  }

  function render() {
    const box = $('accountReferral'); if (!box) return;
    const signed = !!acct();
    box.hidden = !signed;
    if (!signed) { box.innerHTML = ''; return; }
    const head = '<div class="hub-card-head"><span class="hub-icon ref-icon"><svg class="ic"><use href="#i-users"/></svg></span><div><h2>' + tr('Referral') + '</h2><p>' +
      tr('Invite your friends: you each get 2 bonus free draws, on top of the 5 free ones.') + '</p></div></div>';
    if (!status) {
      box.innerHTML = head + '<p class="ref-empty">' + tr(failed ? 'Referral information is unavailable right now.' : 'Loading…') + '</p>' +
        (failed ? '<button type="button" class="hub-subtle" onclick="sakuReferralReload()">' + tr('Try again') + '</button>' : '');
      return;
    }
    const s = status, code = esc(s.code || '');
    const focused = document.activeElement && document.activeElement.id === 'refCodeInput', typed = focused ? document.activeElement.value : null;
    box.innerHTML = head +
      '<div class="ref-code-box"><div class="ref-code"><small>' + tr('Your code') + '</small><strong data-noi18n>' + code + '</strong></div>' +
        '<div class="ref-actions"><button type="button" class="hub-primary" onclick="sakuReferralCopy()"><svg class="ic" aria-hidden="true"><use href="#i-link"/></svg><span>' + tr('Copy link') + '</span></button>' +
        '<button type="button" class="hub-subtle" onclick="sakuReferralShare()"><svg class="ic" aria-hidden="true"><use href="#i-send"/></svg><span>' + tr('Share') + '</span></button></div>' +
        '<input id="refLinkInput" class="ref-link-input" type="text" readonly value="' + esc(link(s.code)) + '" hidden></div>' +
      tiersHtml(s) + listHtml(s) + enterHtml(s) +
      '<div class="ref-foot"><span><svg class="ic" aria-hidden="true"><use href="#i-cards"/></svg>' + tr('Bonus free draws') + ' : <b>' + num(s.bonus_draws) + '</b></span>' +
        (s.special_tickets ? '<span><svg class="ic" aria-hidden="true"><use href="#i-star"/></svg>' + tr('Special tickets') + ' : <b>' + num(s.special_tickets) + '</b></span>' : '') + '</div>' +
      '<details class="qx-help ref-rules"><summary><svg class="ic" aria-hidden="true"><use href="#i-help"/></svg>' + tr('Referral rules') + '</summary><ul>' +
        '<li>' + tr('Your friend enters your code (or opens your link) within 7 days of signing up. You each get 2 bonus free draws.') + '</li>' +
        '<li>' + tr('Bonus draws do not expire and are used after your 5 regular free draws.') + '</li>' +
        '<li>' + tr('The referred player’s Discord account must be at least 15 days old. Each Discord account can only be referred once.') + '</li>' +
        '<li>' + tr('Up to 5 new referrals per day.') + '</li></ul></details>';
    if (focused) { const i = $('refCodeInput'); if (i) { i.value = typed; i.focus(); } }
  }

  function attach() {
    const owner = window.sakuSecureUserId || null;
    if (!acct()) { detach(); return; }
    if (owner !== uid) { status = null; uid = owner; }
    load();
  }
  function detach() { status = null; uid = null; busy = false; failed = false; render(); }

  captureLink();
  window.sakuReferralAttach = attach; window.sakuReferralDetach = detach; window.sakuReferralRender = render;
  window.sakuReferralReload = load; window.sakuReferralApply = apply; window.sakuReferralClaim = claim;
  window.sakuReferralCopy = copy; window.sakuReferralShare = share;
  window.addEventListener('saku-lang-change', render);
  document.addEventListener('DOMContentLoaded', () => { if (acct()) attach(); });
  window.__sakuReferralTest = {set: s => { status = s; render(); }, get: () => status};
})();
