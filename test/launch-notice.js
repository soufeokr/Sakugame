/* Sakugame — fenêtre d'information du lancement de la 1.0.
   Montrée une seule fois par compte (launch_notice_get / launch_notice_seen, côté serveur).
   Les comptes de la bêta voient en plus le paragraphe sur la remise à zéro et la gemme offerte. */
(function () {
  'use strict';
  const lang = () => { const l = (window.SAKU_I18N && SAKU_I18N.lang) || 'en'; return l === 'fr' || l === 'es' ? l : 'en'; };
  const T = {
    fr: {
      kicker: 'SAKUGAME · VERSION 1.0', title: 'Sakugame passe en 1.0 !',
      intro: 'Merci d’être là pour le lancement. Le jeu de cartes est maintenant ouvert à tous : ouvre des boosters, fais monter tes cartes de niveau, échange avec les autres joueurs et compose ta vitrine.',
      betaTitle: 'Merci d’avoir testé la bêta',
      beta: 'Pour le lancement, tous les comptes ont été remis à zéro : collections, pièces, niveaux et statistiques. Tu repars avec 10 000 pièces, et tu as reçu une gemme d’invocation en dédommagement.',
      betaGem: 'La gemme ouvre le grimoire spécial : 10 cartes, épiques ou mieux, tirées parmi toutes les cartes du jeu.',
      whatTitle: 'Ce qui t’attend',
      what: [
        ['i-cards', 'Portails', '5 tirages gratuits, un de plus toutes les 12 minutes. Chaque portail a ses propres cartes.'],
        ['i-market', 'Marché et échanges', 'Achète, enchéris, vends ou propose des échanges aux autres joueurs.'],
        ['i-trophy', 'Classement et quêtes', 'Gagne des parties, remplis tes quêtes et grimpe dans le classement.']
      ],
      refTitle: 'Parrainage',
      ref: 'Invite tes amis avec ton code ou ton lien : vous recevez chacun 2 tirages gratuits bonus.',
      tiers: '3 filleuls : 5 tirages bonus · 5 : 1 500 pièces · 10 : 5 000 pièces · 20 : un mythique garanti · 30 : une gemme d’invocation.',
      refBeta: 'Tu as 7 jours à partir d’aujourd’hui pour saisir le code d’un ami.',
      refNew: 'Un ami t’a invité ? Saisis son code dans les 7 jours suivant ton inscription.',
      refBtn: 'Voir le parrainage', ok: 'C’est parti !', close: 'Fermer'
    },
    en: {
      kicker: 'SAKUGAME · VERSION 1.0', title: 'Sakugame 1.0 is here!',
      intro: 'Thanks for being here for the launch. The card game is now open to everyone: open boosters, level up your cards, trade with other players and build your showcase.',
      betaTitle: 'Thank you for testing the beta',
      beta: 'For the launch, every account has been reset: collections, coins, levels and stats. You start again with 10,000 coins, and you received a summoning gem as compensation.',
      betaGem: 'The gem opens the special grimoire: 10 cards, epic or better, drawn from every card in the game.',
      whatTitle: 'What’s waiting for you',
      what: [
        ['i-cards', 'Portals', '5 free draws, plus one every 12 minutes. Each portal has its own cards.'],
        ['i-market', 'Market and trades', 'Buy, bid, sell or offer trades to other players.'],
        ['i-trophy', 'Leaderboard and quests', 'Win games, complete your quests and climb the leaderboard.']
      ],
      refTitle: 'Referral',
      ref: 'Invite your friends with your code or link: you each get 2 bonus free draws.',
      tiers: '3 referrals: 5 bonus draws · 5: 1,500 coins · 10: 5,000 coins · 20: a guaranteed mythic · 30: a summoning gem.',
      refBeta: 'You have 7 days from today to enter a friend’s code.',
      refNew: 'Did a friend invite you? Enter their code within 7 days of signing up.',
      refBtn: 'Open referral', ok: 'Let’s go!', close: 'Close'
    },
    es: {
      kicker: 'SAKUGAME · VERSIÓN 1.0', title: '¡Sakugame llega a la 1.0!',
      intro: 'Gracias por estar aquí en el lanzamiento. El juego de cartas ya está abierto a todos: abre sobres, sube de nivel tus cartas, intercambia con otros jugadores y crea tu vitrina.',
      betaTitle: 'Gracias por probar la beta',
      beta: 'Para el lanzamiento, todas las cuentas se han reiniciado: colecciones, monedas, niveles y estadísticas. Empiezas de nuevo con 10 000 monedas y has recibido una gema de invocación como compensación.',
      betaGem: 'La gema abre el grimorio especial: 10 cartas, épicas o mejores, entre todas las cartas del juego.',
      whatTitle: 'Lo que te espera',
      what: [
        ['i-cards', 'Portales', '5 tiradas gratis, y una más cada 12 minutos. Cada portal tiene sus propias cartas.'],
        ['i-market', 'Mercado e intercambios', 'Compra, puja, vende o propone intercambios a otros jugadores.'],
        ['i-trophy', 'Clasificación y misiones', 'Gana partidas, completa tus misiones y sube en la clasificación.']
      ],
      refTitle: 'Referidos',
      ref: 'Invita a tus amigos con tu código o enlace: cada uno recibe 2 tiradas gratis extra.',
      tiers: '3 referidos: 5 tiradas extra · 5: 1 500 monedas · 10: 5 000 monedas · 20: un mítico garantizado · 30: una gema de invocación.',
      refBeta: 'Tienes 7 días desde hoy para introducir el código de un amigo.',
      refNew: '¿Te invitó un amigo? Introduce su código en los 7 días siguientes a tu registro.',
      refBtn: 'Ver referidos', ok: '¡Vamos!', close: 'Cerrar'
    }
  };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const ic = id => '<svg class="ic" aria-hidden="true"><use href="#' + id + '"/></svg>';
  const GEM = '<svg class="ln-gem" viewBox="-50 -50 100 100" aria-hidden="true"><polygon points="0,-44 38,-22 38,22 0,44 -38,22 -38,-22" fill="#7a3fd0"/><polygon points="0,-44 38,-22 17,-10 0,-20 -17,-10 -38,-22" fill="#e6ccff"/><polygon points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10" fill="#b17cf0"/></svg>';
  let checkedFor = null, open = false;

  function render(beta) {
    const w = T[lang()];
    let d = document.getElementById('launchNotice'); if (d) d.remove();
    d = document.createElement('dialog');
    d.id = 'launchNotice'; d.className = 'trade-dialog ln-dialog'; d.setAttribute('aria-labelledby', 'lnTitle'); d.setAttribute('data-noi18n', '');
    d.innerHTML = '<div class="ln-shell">' +
      '<button type="button" class="ln-x" data-ln="close" aria-label="' + esc(w.close) + '">×</button>' +
      '<header class="ln-head"><span class="ln-kicker">' + esc(w.kicker) + '</span><h2 id="lnTitle">' + esc(w.title) + '</h2><p>' + esc(w.intro) + '</p></header>' +
      (beta ? '<section class="ln-beta">' + GEM + '<div><b>' + esc(w.betaTitle) + '</b><p>' + esc(w.beta) + '</p><small>' + esc(w.betaGem) + '</small></div></section>' : '') +
      '<section class="ln-block"><h3>' + esc(w.whatTitle) + '</h3><ul class="ln-what">' +
        w.what.map(x => '<li><span class="ln-ico">' + ic(x[0]) + '</span><div><b>' + esc(x[1]) + '</b><p>' + esc(x[2]) + '</p></div></li>').join('') + '</ul></section>' +
      '<section class="ln-block ln-ref"><h3>' + ic('i-users') + esc(w.refTitle) + '</h3><p>' + esc(w.ref) + '</p><p class="ln-tiers">' + esc(w.tiers) + '</p><p class="ln-note">' + esc(beta ? w.refBeta : w.refNew) + '</p></section>' +
      '<div class="ln-actions"><button type="button" class="ln-sub" data-ln="ref">' + esc(w.refBtn) + '</button><button type="button" class="ln-ok" data-ln="ok">' + esc(w.ok) + '</button></div>' +
      '</div>';
    document.body.appendChild(d);
    d.addEventListener('click', e => {
      const b = e.target.closest('[data-ln]');
      if (b) { finish(b.dataset.ln === 'ref'); return; }
      if (e.target === d) finish(false);
    });
    d.addEventListener('cancel', e => { e.preventDefault(); finish(false); });
    open = true;
    try { d.showModal(); } catch (e) { d.setAttribute('open', ''); }
    const ok = d.querySelector('.ln-ok'); if (ok) ok.focus({preventScroll: true});
    const sh = d.querySelector('.ln-shell'); if (sh) sh.scrollTop = 0;
  }

  function finish(toReferral) {
    const d = document.getElementById('launchNotice');
    if (d) { try { d.close(); } catch (e) {} d.remove(); }
    open = false;
    if (window.sakuRpc) window.sakuRpc('launch_notice_seen', {}).catch(() => {});
    if (toReferral && typeof sakuNavGo === 'function') sakuNavGo('referral');
  }

  async function check() {
    const who = window.sakuSecureUserId || null;
    if (!who || who === checkedFor || open || !window.sakuRpc) return;
    checkedFor = who;
    try {
      const r = await window.sakuRpc('launch_notice_get', {});
      if (!r || !r.show || (window.sakuSecureUserId || null) !== who) return;
      // attend qu'aucune autre fenêtre ne soit ouverte
      const wait = () => document.querySelector('dialog[open]') ? setTimeout(wait, 1500) : render(!!r.beta);
      setTimeout(wait, 1200);
    } catch (e) { checkedFor = null; }
  }
  window.sakuLaunchNotice = beta => render(!!beta);
  setInterval(check, 2000);
})();
