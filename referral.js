/* Sakugame — parrainage (page Paramètres › Parrainage). Tout est validé côté serveur :
   referral_status / referral_apply / referral_claim. */
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
  const ic = id => '<svg class="ic" aria-hidden="true"><use href="#' + id + '"/></svg>';
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
  const REWARD_ICONS = {bonus_draws: 'i-cards', coins: 'i-market', special_ticket: 'i-crown'};
  let status = null, uid = null, busy = false, loading = false, failed = false;

  function errCode(e) { const m = String((e && e.message) || ''); return Object.keys(ERRORS).find(k => m.indexOf(k) >= 0) || ''; }
  function errText(e) { const c = errCode(e); return tr(c ? ERRORS[c] : 'Something went wrong. Please try again.'); }
  function notify(text) { if (typeof showNotification === 'function') showNotification(text); }
  function stored() { try { const v = JSON.parse(localStorage.getItem(STORE) || 'null'); return v && CODE_RE.test(v.code) ? v.code : null; } catch (e) { return null; } }
  function forget() { try { localStorage.removeItem(STORE); } catch (e) {} }
  function link(code) { return location.origin + location.pathname.replace(/index\.html$/, '') + '?ref=' + code; }
  function readyCount(s) { return s ? (s.tiers || []).filter(x => x.ready && !x.claimed).length : 0; }

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
    loading = true; failed = false; render();
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
    if (status.referred_by || !status.can_enter || code === status.code) { forget(); return; }
    try {
      const s = await window.sakuRpc('referral_apply', {p_code: code});
      status = s; forget(); syncDraws(s);
      notify(tr('Referral confirmed! You received 2 bonus free draws.'));
    } catch (e) {
      if (FINAL.indexOf(errCode(e)) >= 0) forget();
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
    catch (e) { const i = $('refLinkInput'); if (i) { i.focus(); i.select(); } notify(tr('Copy the link below.')); }
  }
  async function share() {
    if (!status) return;
    const url = link(status.code);
    if (navigator.share) {
      try { await navigator.share({title: 'Sakugame', text: tr('Join me on Sakugame: we each get 2 bonus free draws!'), url}); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    copy();
  }

  // ---------- rendu ----------
  function heroHtml(s) {
    return '<section class="hub-card ref-hero">' +
      '<div class="ref-hero-main"><span class="hub-eyebrow">' + tr('Your code') + '</span>' +
        '<strong class="ref-code" data-noi18n>' + esc(s.code) + '</strong>' +
        '<div class="ref-link-row"><input id="refLinkInput" class="ref-link-input" type="text" readonly value="' + esc(link(s.code)) + '" aria-label="' + tr('Your invitation link') + '" onclick="this.select()">' +
          '<button type="button" class="hub-primary" onclick="sakuReferralCopy()">' + ic('i-link') + '<span>' + tr('Copy link') + '</span></button>' +
          '<button type="button" class="hub-subtle" onclick="sakuReferralShare()">' + ic('i-send') + '<span>' + tr('Share') + '</span></button></div></div>' +
      '<div class="ref-stats">' +
        '<div class="ref-stat"><b>' + num(s.count) + '</b><span>' + tr(Number(s.count) === 1 ? 'Referral' : 'Referrals') + '</span></div>' +
        '<div class="ref-stat"><b>' + num(s.bonus_draws) + '</b><span>' + tr('Bonus free draws') + '</span></div>' +
        '<div class="ref-stat"><b>' + num(s.special_tickets) + '</b><span>' + tr('Special tickets') + '</span></div></div>' +
      '</section>';
  }

  function stepsHtml() {
    const steps = [['i-send', 'Share your link', 'Send your link or your code to a friend.'],
      ['i-discord', 'Your friend signs in', 'They sign in with Discord and enter your code within 7 days.'],
      ['i-cards', 'You both win', 'You each get 2 bonus free draws, on top of the 5 free ones.']];
    return '<ol class="ref-steps">' + steps.map((x, i) => '<li><span class="ref-step-n">' + (i + 1) + '</span><span class="ref-step-ico">' + ic(x[0]) + '</span><div><b>' + tr(x[1]) + '</b><p>' + tr(x[2]) + '</p></div></li>').join('') + '</ol>';
  }

  function tiersHtml(s) {
    const tiers = s.tiers || [], n = Number(s.count) || 0, last = tiers.length ? tiers[tiers.length - 1].goal : 1;
    const pc = Math.min(100, Math.round(n / last * 100)), next = tiers.find(x => !x.ready);
    return '<section class="hub-card ref-tiers-card"><div class="hub-card-head"><span class="hub-icon ref-icon">' + ic('i-trophy') + '</span><div><h2>' + tr('Referral rewards') + '</h2><p>' +
        (next ? esc(fmt('{n} more referrals until the next reward.', next.goal - n)) : tr('All tiers reached')) + '</p></div></div>' +
      '<div class="ref-track" role="progressbar" aria-valuemin="0" aria-valuemax="' + last + '" aria-valuenow="' + n + '"><span style="width:' + pc + '%"></span></div>' +
      '<ol class="ref-tiers">' + tiers.map(x => {
        const st = x.claimed ? 'claimed' : x.ready ? 'ready' : 'locked';
        return '<li class="ref-tier is-' + st + '">' +
          '<span class="ref-tier-goal">' + esc(fmt(x.goal === 1 ? '{n} referral' : '{n} referrals', x.goal)) + '</span>' +
          '<span class="ref-tier-ico">' + (x.reward === 'coins' ? '<img src="summon-machines/coin.svg" alt="">' : ic(REWARD_ICONS[x.reward] || 'i-star')) + '</span>' +
          '<span class="ref-tier-reward">' + esc(REWARDS[x.reward] ? REWARDS[x.reward](x.amount) : x.reward) +
            (x.reward === 'special_ticket' ? '<small>' + tr('Coming soon') + '</small>' : '') + '</span>' +
          (st === 'ready' ? '<button type="button" class="ref-claim" ' + (busy ? 'disabled' : '') + ' onclick="sakuReferralClaim(' + Number(x.goal) + ')">' + tr('Claim') + '</button>'
            : st === 'claimed' ? '<span class="ref-tier-state">' + ic('i-check') + tr('Claimed') + '</span>'
            : '<span class="ref-tier-state">' + esc(fmt('{n} more', x.goal - n)) + '</span>') +
          '</li>';
      }).join('') + '</ol></section>';
  }

  function listHtml(s) {
    const list = s.referrals || [];
    return '<section class="hub-card ref-list-card"><div class="hub-card-head"><span class="hub-icon">' + ic('i-users') + '</span><div><h2>' +
      esc(fmt('My referrals ({n})', num(s.count))) + '</h2><p>' + tr('Players who joined with your code.') + '</p></div></div>' +
      (list.length ? '<ul class="ref-list">' + list.map(r => '<li><span class="ref-avatar">' + ic('i-user') + '</span><span class="ref-name">' +
          (r.deleted ? '<i>' + tr('Deleted account') + '</i>' : esc(r.name || '—')) + '</span><time>' + esc(day(r.at)) + '</time></li>').join('') + '</ul>'
        : '<p class="ref-empty">' + tr('No referrals yet. Share your link to get started!') + '</p>') + '</section>';
  }

  function enterHtml(s) {
    const head = '<div class="hub-card-head"><span class="hub-icon">' + ic('i-key') + '</span><div><h2>' + tr('Got a referral code?') + '</h2><p>' +
      tr('Enter a friend’s code to get 2 bonus free draws.') + '</p></div></div>';
    if (s.referred_by) {
      return '<section class="hub-card ref-enter-card">' + head.replace(tr('Got a referral code?'), tr('Your sponsor')) +
        '<div class="ref-enter-done">' + ic('i-check') + '<span>' + tr('Referred by') + ' <b>' + esc(s.referred_by.name || '—') + '</b> · ' + esc(day(s.referred_by.at)) + '</span></div></section>';
    }
    if (!s.can_enter) {
      return '<section class="hub-card ref-enter-card">' + head + '<p class="ref-empty">' + tr('Codes can only be entered within 7 days of signing up.') + '</p></section>';
    }
    const waitDiscord = !s.discord_ok;
    return '<section class="hub-card ref-enter-card">' + head + '<form class="ref-enter" onsubmit="sakuReferralApply(event)">' +
      '<div class="hub-form-row"><input id="refCodeInput" type="text" maxlength="6" autocomplete="off" spellcheck="false" placeholder="ABC234" aria-label="' + tr('Referral code') + '" value="' + esc(stored() || '') + '"' + (waitDiscord ? ' disabled' : '') + '>' +
      '<button type="submit" class="hub-primary"' + (busy || waitDiscord ? ' disabled' : '') + '>' + tr('Confirm') + '</button></div>' +
      '<p class="hub-helper">' + (waitDiscord
        ? esc(s.discord_ready_at && new Date(s.discord_ready_at) < new Date(s.enter_until)
          ? fmt('Your Discord account must be at least 15 days old. Available from {n}.', day(s.discord_ready_at))
          : tr('Your Discord account must be at least 15 days old.'))
        : esc(fmt('You can enter a code until {n}.', day(s.enter_until)))) + '</p></form></section>';
  }

  function rulesHtml() {
    return '<section class="hub-card ref-rules-card"><div class="hub-card-head"><span class="hub-icon">' + ic('i-help') + '</span><div><h2>' + tr('Referral rules') + '</h2></div></div><ul class="ref-rules">' +
      '<li>' + tr('Your friend enters your code (or opens your link) within 7 days of signing up. You each get 2 bonus free draws.') + '</li>' +
      '<li>' + tr('Bonus draws do not expire and are used after your 5 regular free draws.') + '</li>' +
      '<li>' + tr('The referred player’s Discord account must be at least 15 days old. Each Discord account can only be referred once.') + '</li>' +
      '<li>' + tr('Tier rewards are permanent: claim them whenever you like.') + '</li></ul></section>';
  }

  function badges() {
    const n = acct() ? readyCount(status) : 0;
    document.querySelectorAll('.ref-ready-badge').forEach(b => { b.hidden = !n; b.textContent = String(n); });
  }

  function render() {
    badges();
    const box = $('referralContent'); if (!box) return;
    if (!acct()) {
      box.innerHTML = '<section class="hub-card ref-guest"><span class="hub-icon ref-icon">' + ic('i-users') + '</span><h2>' + tr('Invite your friends') + '</h2><p>' +
        tr('Sign in to get your referral code. You and each friend you invite receive 2 bonus free draws.') + '</p>' +
        '<button class="hub-primary hub-discord" onclick="openAuthModal()">' + ic('i-discord') + ' ' + tr('Continue with Discord') + '</button></section>' + stepsHtml();
      return;
    }
    if (!status) {
      box.innerHTML = '<section class="hub-card ref-guest"><p class="ref-empty">' + tr(failed ? 'Referral information is unavailable right now.' : 'Loading…') + '</p>' +
        (failed ? '<button type="button" class="hub-subtle" onclick="sakuReferralReload()">' + tr('Try again') + '</button>' : '') + '</section>';
      return;
    }
    const focused = document.activeElement && document.activeElement.id === 'refCodeInput', typed = focused ? document.activeElement.value : null;
    box.innerHTML = heroHtml(status) + stepsHtml() + tiersHtml(status) +
      '<div class="ref-columns"><div class="ref-col">' + listHtml(status) + '</div><div class="ref-col">' + enterHtml(status) + rulesHtml() + '</div></div>';
    if (focused) { const i = $('refCodeInput'); if (i) { i.value = typed; i.focus(); } }
  }

  function open() {
    if (typeof showScreen === 'function') showScreen('referralScreen');
    if (acct() && !status && !loading) load(); else render();
    try { window.scrollTo(0, 0); } catch (e) {}
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
  window.sakuReferralOpen = open; window.sakuReferralReload = load; window.sakuReferralApply = apply; window.sakuReferralClaim = claim;
  window.sakuReferralCopy = copy; window.sakuReferralShare = share;
  window.addEventListener('saku-lang-change', render);
  document.addEventListener('DOMContentLoaded', () => { if (acct()) attach(); else render(); });
  window.__sakuReferralTest = {set: s => { status = s; render(); }, get: () => status};
})();
