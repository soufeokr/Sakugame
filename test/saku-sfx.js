/* Sakugame — bruitages synthétisés en direct (Web Audio), aucune ressource externe.
   Trois couleurs mêlées :
   • les lives de ZUTOMAYO : piano électrique (Rhodes), section de cuivres en « stabs », basse slap, batterie serrée,
     accords jazz (maj9, 13, 7#9) et salle qui résonne ;
   • Yo-kai Watch : clochettes, boîte à musique et petits arpèges « puce » quand quelque chose monte de niveau ;
   • le mode histoire de Splatoon : éclaboussures d'encre, bulles, « squish » gluants pour les ratés.
   API : SakuSfx.play(type, rareté?, extra?) → poignée {stop()} ; SakuSfx.result(gagné, clé) ; SakuSfx.winOnce(clé).
   Réglage du volume propre à l'appareil (curseur [data-saku-sfx-volume]). */
(function () {
  'use strict';
  const KEY = 'saku_sfx_volume_v1';
  let volume = 0.35;
  try { const s = localStorage.getItem(KEY); if (s !== null) { const n = Number(s); if (Number.isFinite(n) && n >= 0 && n <= 1) volume = n; } } catch (e) {}

  let ctx = null, out = null, verb = null, echo = null, noiseBuf = null, lastFlip = -1;
  const seen = new Set();
  const RANKS = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'special'];
  const rank = r => Math.max(0, RANKS.indexOf(r || 'common'));
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);

  function context() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!ctx) { ctx = new AC(); build(ctx); }
      return ctx;
    } catch (e) { return null; }
  }
  function unlock() { const a = context(); if (a && a.state === 'suspended') a.resume().catch(() => {}); }
  ['pointerdown', 'touchstart', 'keydown'].forEach(e => document.addEventListener(e, unlock, { once: true, passive: true }));

  /* Chaîne de sortie : bus → compresseur (punch « live ») → sortie ; envois vers une salle (réverbération) et un écho court. */
  function build(a) {
    const comp = a.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.22;
    out = a.createGain(); out.gain.value = volume;
    out.connect(comp); comp.connect(a.destination);
    const len = Math.floor(a.sampleRate * 2.2), ir = a.createBuffer(2, len, a.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2) * (i < a.sampleRate * 0.012 ? i / (a.sampleRate * 0.012) : 1);
    }
    const conv = a.createConvolver(); conv.buffer = ir;
    verb = a.createGain(); verb.gain.value = 0.2;
    const tone = a.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 5200;
    verb.connect(tone); tone.connect(conv); conv.connect(out);
    echo = a.createGain(); echo.gain.value = 0.1;
    const dl = a.createDelay(1), fb = a.createGain(), damp = a.createBiquadFilter();
    dl.delayTime.value = 0.21; fb.gain.value = 0.3; damp.type = 'lowpass'; damp.frequency.value = 2400;
    echo.connect(dl); dl.connect(damp); damp.connect(fb); fb.connect(dl); damp.connect(out);
    noiseBuf = a.createBuffer(1, a.sampleRate, a.sampleRate);
    const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  }

  /* Un bus par bruitage : on peut le couper net (grimoire passé). */
  function voice(a, wet, dry) {
    const g = a.createGain(); g.gain.value = dry == null ? 1 : dry; g.connect(out);
    const s = a.createGain(); s.gain.value = wet == null ? 1 : wet; g.connect(s); s.connect(verb); s.connect(echo);
    return { a, bus: g, stop() { try { const t = a.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + 0.08); setTimeout(() => { try { g.disconnect(); } catch (e) {} }, 200); } catch (e) {} } };
  }
  function panner(a, dest, p) {
    if (!p || !a.createStereoPanner) return dest;
    const n = a.createStereoPanner(); n.pan.value = p; n.connect(dest); return n;
  }
  /* Enveloppe : montée a, puis décroissance exponentielle jusqu'à t+dur. */
  function env(g, t, amp, a, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, amp), t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  function osc(v, t, o) {
    const a = v.a, g = a.createGain(), n = a.createOscillator();
    n.type = o.type || 'sine';
    n.frequency.setValueAtTime(o.f, t);
    if (o.f2) n.frequency.exponentialRampToValueAtTime(o.f2, t + (o.glide || o.dur));
    if (o.detune) n.detune.value = o.detune;
    if (o.vib) { const l = a.createOscillator(), lg = a.createGain(); l.frequency.value = o.vib[0]; lg.gain.value = o.vib[1]; l.connect(lg); lg.connect(n.frequency); l.start(t); l.stop(t + o.dur + 0.05); }
    let node = n;
    if (o.lp) {
      const f = a.createBiquadFilter(); f.type = o.lpType || 'lowpass'; f.Q.value = o.q || 0.8;
      f.frequency.setValueAtTime(o.lp[0], t);
      if (o.lp[1]) f.frequency.exponentialRampToValueAtTime(o.lp[1], t + (o.lp[3] || 0.05));
      if (o.lp[2]) f.frequency.exponentialRampToValueAtTime(o.lp[2], t + o.dur);
      n.connect(f); node = f;
    }
    env(g, t, o.amp, o.a || 0.006, o.dur);
    node.connect(g); g.connect(panner(a, v.bus, o.pan));
    n.start(t); n.stop(t + o.dur + 0.05);
  }
  function noise(v, t, o) {
    const a = v.a, s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = noiseBuf; s.loop = true;
    f.type = o.type || 'bandpass'; f.Q.value = o.q || 1;
    f.frequency.setValueAtTime(o.f, t);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + (o.glide || o.dur));
    if (o.swell) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.amp, t + o.dur * 0.85); g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur); }
    else env(g, t, o.amp, o.a || 0.002, o.dur);
    s.connect(f); f.connect(g); g.connect(panner(a, v.bus, o.pan));
    s.start(t, Math.random() * 0.5); s.stop(t + o.dur + 0.05);
  }
  /* Synthèse FM : piano électrique (rapport 1, + « tine » aigu) et clochettes (rapport inharmonique). */
  function fm(v, t, f, dur, amp, ratio, index, pan) {
    const a = v.a, car = a.createOscillator(), mod = a.createOscillator(), mg = a.createGain(), g = a.createGain();
    car.frequency.value = f; mod.frequency.value = f * ratio;
    mg.gain.setValueAtTime(f * index, t); mg.gain.exponentialRampToValueAtTime(Math.max(1, f * index * 0.08), t + dur * 0.7);
    mod.connect(mg); mg.connect(car.frequency);
    env(g, t, amp, 0.004, dur);
    car.connect(g); g.connect(panner(a, v.bus, pan));
    car.start(t); mod.start(t); car.stop(t + dur + 0.05); mod.stop(t + dur + 0.05);
  }
  const ep = (v, t, notes, dur, amp) => notes.forEach((m, i) => {
    const p = (i / Math.max(1, notes.length - 1) - 0.5) * 0.5;
    fm(v, t + i * 0.006, hz(m), dur, amp, 1, 1.8, p);
    fm(v, t + i * 0.006, hz(m), Math.min(dur, 0.35), amp * 0.25, 14, 0.35, p);
  });
  const bell = (v, t, m, dur, amp, pan) => fm(v, t, hz(m), dur || 1.1, amp || 0.07, 3.5, 2.2, pan);
  const music = (v, t, m, amp) => { fm(v, t, hz(m), 0.9, amp || 0.05, 5.0, 1.2, 0.2); osc(v, t, { f: hz(m + 12), dur: 0.25, amp: (amp || 0.05) * 0.35, type: 'sine' }); };
  /* « Puce » 8 bits façon menus Yo-kai Watch (onde carrée, très courte). */
  const chip = (v, t, m, dur, amp) => osc(v, t, { f: hz(m), dur: dur || 0.09, amp: amp || 0.035, type: 'square', lp: [5200], a: 0.002 });
  /* Section de cuivres : trois scies désaccordées dans un filtre qui s'ouvre puis se referme. */
  function brass(v, t, notes, dur, amp) {
    notes.forEach((m, i) => [-9, 0, 8].forEach(dt => osc(v, t + i * 0.004, {
      f: hz(m), detune: dt, type: 'sawtooth', dur: dur, amp: (amp || 0.05) / 2.2, a: 0.018,
      lp: [500, 3600, 900, 0.06], q: 1.2, pan: (i - notes.length / 2) * 0.12
    })));
  }
  /* Basse slap : attaque claquante, filtre qui se referme vite. */
  const slap = (v, t, m, dur, amp) => {
    osc(v, t, { f: hz(m), type: 'sawtooth', dur: dur || 0.32, amp: amp || 0.12, a: 0.003, lp: [400, 2600, 300, 0.02], q: 4 });
    osc(v, t, { f: hz(m), type: 'sine', dur: dur || 0.32, amp: (amp || 0.12) * 0.9, a: 0.003 });
  };
  const kick = (v, t, amp) => { osc(v, t, { f: 150, f2: 42, glide: 0.11, dur: 0.38, amp: amp || 0.32, a: 0.002 }); noise(v, t, { f: 3000, type: 'highpass', dur: 0.015, amp: (amp || 0.32) * 0.25 }); };
  const snare = (v, t, amp) => { noise(v, t, { f: 1900, q: 0.7, dur: 0.17, amp: amp || 0.13 }); osc(v, t, { f: 196, f2: 160, dur: 0.1, amp: (amp || 0.13) * 0.7, type: 'triangle' }); };
  const hat = (v, t, amp, open) => noise(v, t, { f: 8000, type: 'highpass', dur: open ? 0.22 : 0.045, amp: amp || 0.05, pan: 0.25 });
  const crash = (v, t, amp) => { noise(v, t, { f: 5200, type: 'highpass', dur: 1.5, amp: amp || 0.07, pan: -0.2 }); noise(v, t, { f: 9000, q: 0.6, dur: 0.9, amp: (amp || 0.07) * 0.6, pan: 0.2 }); };
  const clap = (v, t, amp) => [0, 0.011, 0.022].forEach((d, i) => noise(v, t + d, { f: 1300, q: 1.3, dur: i === 2 ? 0.16 : 0.02, amp: amp || 0.1 }));
  const taiko = (v, t, amp) => { osc(v, t, { f: 98, f2: 58, glide: 0.18, dur: 0.6, amp: amp || 0.28, a: 0.003 }); noise(v, t, { f: 420, type: 'lowpass', dur: 0.25, amp: (amp || 0.28) * 0.35 }); };
  /* Encre de Splatoon : éclaboussure filtrée + chapelet de bulles qui remontent. */
  function splat(v, t, size) {
    const s = size || 1;
    noise(v, t, { f: 3600, f2: 260, glide: 0.18 * s, q: 5, dur: 0.24 * s, amp: 0.14 * s, type: 'lowpass' });
    noise(v, t, { f: 900, q: 9, dur: 0.07, amp: 0.08 * s });
    for (let i = 0; i < 3 + Math.round(4 * s); i++) {
      const d = 0.04 + i * 0.035 + Math.random() * 0.02, f = 300 + Math.random() * 500;
      osc(v, t + d, { f: f, f2: f * 2.6, glide: 0.045, dur: 0.06, amp: 0.035 * s, pan: Math.random() - 0.5 });
    }
  }
  const whoosh = (v, t, dur, up, amp) => noise(v, t, { f: up ? 350 : 3200, f2: up ? 3800 : 300, q: 1.6, dur: dur, amp: amp || 0.07, swell: true });
  const sparkle = (v, t, n, base, amp) => { const p = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21]; for (let i = 0; i < n; i++) bell(v, t + i * 0.055 + Math.random() * 0.02, base + p[i % p.length], 0.6, amp || 0.035, Math.random() * 1.2 - 0.6); };

  /* ---------------- Bruitages ---------------- */
  const D = 62; // tonalité de référence : ré

  /* Coup d'éclat à la sortie de la carte, de plus en plus riche selon la rareté. */
  function hit(v, t, r) {
    const k = rank(r);
    kick(v, t, 0.26 + k * 0.02);
    if (k >= 2) crash(v, t, 0.04 + k * 0.012);
    else hat(v, t, 0.06, true);
    if (k <= 1) ep(v, t, [D - 12, D - 3, D + 2, D + 4], 0.9, 0.05);
    if (k === 1) [D + 12, D + 16, D + 19].forEach((m, i) => chip(v, t + 0.06 + i * 0.05, m));
    if (k === 2) { ep(v, t, [D - 12, D + 4, D + 7, D + 11, D + 14], 1.2, 0.05); sparkle(v, t + 0.05, 5, D + 24, 0.03); }
    if (k >= 3) { brass(v, t, [D - 5, D + 2, D + 4, D + 9], 0.32, 0.07 + k * 0.004); slap(v, t, D - 24); splat(v, t + 0.02, 0.6 + k * 0.08); }
    if (k >= 3) ep(v, t + 0.02, [D - 12, D + 4, D + 7, D + 11, D + 14], 1.5, 0.045);
    if (k === 3) taiko(v, t, 0.2);
    if (k >= 4) sparkle(v, t + 0.08, 8, D + 24, 0.035);
    if (k >= 5) { // iridescence : clochettes légèrement désaccordées qui chatoient
      [D + 26, D + 30, D + 33, D + 37].forEach((m, i) => { fm(v, t + 0.1 + i * 0.07, hz(m) * 1.004, 1.6, 0.03, 3.5, 2, -0.4); fm(v, t + 0.1 + i * 0.07, hz(m) * 0.996, 1.6, 0.03, 3.5, 2, 0.4); });
    }
    if (k === 6) { taiko(v, t, 0.3); taiko(v, t + 0.16, 0.26); brass(v, t + 0.32, [D - 12, D - 5, D + 4, D + 7, D + 11, D + 14], 0.9, 0.09); crash(v, t + 0.32, 0.08); }
  }
  /* Petit thème quand la carte se pose. */
  function jingle(v, t, r) {
    const k = rank(r);
    if (k === 0) { ep(v, t, [D + 7], 0.5, 0.05); ep(v, t + 0.13, [D + 12], 0.7, 0.05); return; }
    if (k === 1) { [D + 12, D + 16, D + 19, D + 24].forEach((m, i) => chip(v, t + i * 0.06, m, 0.1, 0.04)); return; }
    if (k === 2) { [D + 24, D + 28, D + 31, D + 36].forEach((m, i) => bell(v, t + i * 0.08, m, 1.2, 0.05)); return; }
    if (k === 3) { ep(v, t, [D - 10, D + 2, D + 5, D + 9, D + 12], 0.35, 0.05); ep(v, t + 0.22, [D - 5, D + 2, D + 6, D + 11], 0.9, 0.05); bell(v, t + 0.22, D + 26, 1.2, 0.05); return; }
    // Légendaire et au-delà : riff de cuivres façon live, puis accord final maj9.
    const riff = [D + 2, D + 4, D + 6, D + 9];
    riff.forEach((m, i) => brass(v, t + i * 0.1, [m, m + 12], i === 3 ? 0.5 : 0.11, 0.06));
    snare(v, t + 0.3, 0.1); kick(v, t + 0.4, 0.24);
    ep(v, t + 0.4, [D - 12, D + 4, D + 7, D + 9, D + 14], 1.6, 0.05);
    if (k >= 5) sparkle(v, t + 0.42, 9, D + 26, 0.035);
    if (k === 6) { taiko(v, t + 0.4, 0.25); brass(v, t + 0.4, [D - 12, D - 5, D + 4, D + 9, D + 14], 1.1, 0.08); crash(v, t + 0.4, 0.07); }
  }

  /* Ouverture du grimoire, calée sur l'animation (7 s) : gemmes, fermoir, couverture, pages, montée, éclat, carte. */
  function grimoire(v, t, r) {
    const k = rank(r);
    ep(v, t, [D - 24, D - 12, D - 3, D + 2], 1.4, 0.025);                       // ambiance de salle
    [0.392, 0.532, 0.672, 0.812, 0.952, 1.092].slice(0, k).forEach((d, j) => {     // la gemme monte de couleur
      const m = D + 24 + [0, 2, 4, 7, 9, 12][j];
      bell(v, t + d, m, 0.9, 0.05, 0.3); chip(v, t + d, m + 12, 0.05, 0.02);
    });
    if (k >= 5) { osc(v, t + 1.12, { f: 46, dur: 0.32, amp: 0.2, vib: [11, 6] }); noise(v, t + 1.12, { f: 220, type: 'lowpass', dur: 0.3, amp: 0.12 }); }
    noise(v, t + 1.33, { f: 2600, q: 7, dur: 0.05, amp: 0.13 });                    // fermoir qui saute
    fm(v, t + 1.33, 1900, 0.4, 0.04, 5.2, 1.5, 0.5);
    whoosh(v, t + 1.4, 0.95, true, 0.08);                                          // la couverture s'ouvre
    ep(v, t + 1.55, [D - 13, D - 1, D + 2, D + 7, D + 9], 1.6, 0.03);
    for (let i = 0; i < 9; i++) noise(v, t + 2.1 + i * 0.12 + Math.random() * 0.03, { f: 2600 + Math.random() * 1500, q: 2, dur: 0.035, amp: 0.035, pan: 0.3 }); // pages
    // Montée : roulement qui accélère et souffle qui grimpe, plus intense pour les hautes raretés.
    const roll = 4 + k * 2;
    for (let i = 0; i < roll; i++) { const p = i / roll; snare(v, t + 3.2 + 0.75 * (1 - Math.pow(1 - p, 1.6)), 0.02 + 0.06 * p * (0.4 + k / 10)); }
    noise(v, t + 3.15, { f: 600, f2: 7000, type: 'highpass', q: 0.8, dur: 0.84, amp: 0.03 + k * 0.012, swell: true });
    if (k >= 3) osc(v, t + 3.2, { f: hz(D - 26), f2: hz(D - 14), glide: 0.75, dur: 0.8, amp: 0.09, type: 'sawtooth', lp: [300, 900, 1200, 0.5] });
    hit(v, t + 3.99, r);                                                           // éclat + sortie de la carte
    jingle(v, t + 4.76, r);                                                        // la carte se pose
  }

  function victory(v, t) {
    const e = 0.2; // croche à 150 bpm
    [0, 0.05, 0.1, 0.15].forEach((d, i) => snare(v, t + d, 0.06 + i * 0.025));   // roulement d'entrée
    const prog = [ // basse, accord (stabs de cuivres + Rhodes), position en croches
      [D - 19, [D - 7, D - 3, D + 2, D + 6], 1.5], [D - 17, [D - 5, D - 1, D + 4, D + 7], 2.5],
      [D - 20, [D - 8, D - 3, D + 1, D + 4], 3.5], [D - 15, [D - 3, D + 1, D + 5, D + 8], 4],
      [D - 22, [D - 10, D - 5, D + 2, D + 5], 5], [D - 17, [D - 5, D + 2, D + 4, D + 9], 5.5]
    ];
    prog.forEach(([b, ch, p]) => { brass(v, t + p * e, ch, 0.13, 0.065); ep(v, t + p * e, ch, 0.3, 0.035); slap(v, t + p * e, b, 0.2, 0.1); });
    [1.5, 3.5, 5].forEach(p => kick(v, t + p * e, 0.26)); [2.5, 4, 5.5].forEach(p => snare(v, t + p * e, 0.11));
    for (let p = 1.5; p < 6.5; p += 0.5) hat(v, t + p * e, 0.035);
    const end = t + 6.5 * e; // accord final : ré maj9, cymbale, clochettes et encre de fête
    kick(v, end, 0.3); crash(v, end, 0.08); slap(v, end, D - 24, 0.9, 0.12);
    brass(v, end, [D - 12, D - 5, D + 4, D + 9, D + 14], 0.85, 0.08);
    ep(v, end, [D - 12, D + 4, D + 7, D + 9, D + 14, D + 18], 2, 0.045);
    [D + 26, D + 30, D + 33, D + 37, D + 40, D + 42].forEach((m, i) => bell(v, end + 0.06 + i * 0.06, m, 1.3, 0.04, i % 2 ? 0.4 : -0.4));
    splat(v, end + 0.12, 0.7);
  }
  function defeat(v, t) {
    splat(v, t, 1.3);                                                              // « splatté »
    osc(v, t, { f: 520, f2: 160, glide: 0.3, dur: 0.34, amp: 0.08, vib: [22, 30] });
    // Trombone « wah-wah » qui descend chromatiquement.
    [[D - 4, 0.3, 0.22], [D - 5, 0.55, 0.22], [D - 6, 0.8, 0.22], [D - 7, 1.05, 0.85]].forEach(([m, d, l], i) => {
      [-6, 6].forEach(dt => osc(v, t + d, { f: hz(m), detune: dt, type: 'sawtooth', dur: l, amp: 0.045, a: 0.03, lp: [300, 1500, 350, l * 0.5], q: 6, vib: i === 3 ? [5.5, 4] : null }));
    });
    ep(v, t + 0.3, [D - 19, D - 9, D - 5, D - 2, D + 2], 0.7, 0.03);               // sol m9
    ep(v, t + 1.05, [D - 23, D - 11, D - 4, D, D + 5], 1.6, 0.03);                 // mi♭ maj7(#11)
    osc(v, t + 1.75, { f: 240, f2: 70, glide: 0.35, dur: 0.45, amp: 0.1, vib: [14, 12] }); // petit « boing » final
  }
  function level(v, t) {
    [0, 4, 7, 12, 16, 19, 24].forEach((s, i) => { chip(v, t + i * 0.045, D + 12 + s, 0.08, 0.035); bell(v, t + i * 0.045, D + 12 + s, 0.4, 0.025); });
    const e = t + 0.36;
    clap(v, e, 0.09); kick(v, e, 0.24);
    ep(v, e, [D - 12, D + 4, D + 7, D + 11, D + 14], 1.3, 0.05);
    brass(v, e, [D + 7, D + 11, D + 14], 0.4, 0.05);
    sparkle(v, e + 0.06, 7, D + 26, 0.03);
  }
  function correct(v, t) {
    bell(v, t, D + 29, 0.7, 0.06, -0.2); bell(v, t + 0.08, D + 34, 0.9, 0.06, 0.2);
    ep(v, t, [D - 2, D + 2, D + 5, D + 9], 0.45, 0.04);
    clap(v, t + 0.08, 0.06); chip(v, t + 0.16, D + 41, 0.07, 0.025);
  }
  function wrong(v, t) {
    osc(v, t, { f: 330, f2: 120, glide: 0.22, dur: 0.28, amp: 0.1, vib: [24, 26] });
    noise(v, t, { f: 1100, f2: 180, glide: 0.18, q: 6, type: 'lowpass', dur: 0.2, amp: 0.08 });
    osc(v, t + 0.02, { f: hz(D - 22), dur: 0.25, amp: 0.06, type: 'triangle' });
  }
  function coin(v, t) {
    bell(v, t, D + 33, 0.5, 0.05); bell(v, t + 0.07, D + 38, 0.9, 0.055);
    chip(v, t, D + 33, 0.06, 0.03); chip(v, t + 0.07, D + 38, 0.12, 0.03);
    sparkle(v, t + 0.12, 3, D + 31, 0.02);
  }
  function reward(v, t) {
    coin(v, t);
    music(v, t + 0.16, D + 19, 0.04); music(v, t + 0.26, D + 24, 0.045);
    ep(v, t + 0.16, [D - 3, D + 4, D + 7, D + 11], 0.8, 0.035);
  }
  function card(v, t, r) {
    const k = rank(r);
    noise(v, t, { f: 1400, f2: 4200, glide: 0.06, q: 1.4, dur: 0.07, amp: 0.05 });   // la carte se retourne
    if (k === 0) chip(v, t + 0.03, D + 24, 0.07, 0.03);
    else if (k === 1) { chip(v, t + 0.03, D + 28, 0.06, 0.03); chip(v, t + 0.08, D + 31, 0.08, 0.03); }
    else if (k === 2) { bell(v, t + 0.03, D + 33, 0.8, 0.05); sparkle(v, t + 0.08, 3, D + 31, 0.025); }
    else if (k === 3) { ep(v, t + 0.03, [D - 10, D + 2, D + 5, D + 9, D + 12], 0.6, 0.04); bell(v, t + 0.05, D + 36, 0.9, 0.04); }
    else if (k === 4) { brass(v, t + 0.03, [D - 5, D + 2, D + 7, D + 11], 0.3, 0.06); kick(v, t + 0.03, 0.2); bell(v, t + 0.08, D + 38, 1, 0.04); }
    else { // mythique / spéciale : glissando de clochettes + coup de cuivres
      for (let i = 0; i < 8; i++) bell(v, t + 0.03 + i * 0.035, D + 24 + [0, 2, 4, 7, 9, 12, 14, 16][i], 0.7, 0.035, (i / 7 - 0.5));
      brass(v, t + 0.3, [D - 12, D + 4, D + 7, D + 11, D + 14], 0.5, 0.07); kick(v, t + 0.3, 0.24);
      if (k === 6) { taiko(v, t + 0.3, 0.26); crash(v, t + 0.3, 0.06); }
    }
  }
  const drop = (v, t) => { osc(v, t, { f: 320, f2: 140, glide: 0.1, dur: 0.16, amp: 0.1 }); splat(v, t + 0.04, 0.35); };
  const tap = (v, t) => chip(v, t, D + 24, 0.04, 0.025);

  /* Niveau de chaque bruitage, pour qu'un « bonne réponse » ne soit pas écrasé par l'ouverture d'un grimoire. */
  const LEVEL = { correct: 2.6, wrong: 2.8, coin: 2.3, reward: 2.2, drop: 3, tap: 3, defeat: 1.9, card: 1.7, pack: 1.6, level: 1.4 };
  const SOUNDS = { grimoire, pack: (v, t, r) => { hit(v, t, r); jingle(v, t + 0.6, r); }, card, drop, level, victory, defeat, correct, wrong, coin, reward, tap };

  function play(kind, rarity, extra) {
    try {
      if (volume <= 0 || document.hidden) return null;
      const a = context();
      if (!a || !SOUNDS[kind]) return null;
      if (a.state === 'suspended') { a.resume().then(() => { if (a.state === 'running') play(kind, rarity, extra); }).catch(() => {}); return null; }
      if (a.state !== 'running') return null;
      let t = a.currentTime + 0.02;
      if (kind === 'card') { if (t - lastFlip < 0.12) return null; lastFlip = t; }
      if (kind === 'pack') t += Math.max(0, Number(extra) || 0);
      const v = voice(a, kind === 'tap' || kind === 'card' ? 0.6 : 1, LEVEL[kind] || 1);
      SOUNDS[kind](v, t, rarity);
      return v;
    } catch (e) { return null; } // un bruitage ne doit jamais bloquer une action
  }
  /* Fin de partie : victoire ou défaite, une seule fois par partie. */
  function result(won, key) {
    if (key) { if (seen.has(key)) return; seen.add(key); if (seen.size > 300) seen.delete(seen.values().next().value); }
    play(won ? 'victory' : 'defeat');
  }
  const winOnce = key => result(true, key);

  function init() {
    const controls = document.querySelectorAll('[data-saku-sfx-volume]');
    controls.forEach(el => {
      el.value = Math.round(volume * 100);
      el.addEventListener('input', () => {
        volume = Number(el.value) / 100;
        if (out) out.gain.value = volume;
        try { localStorage.setItem(KEY, String(volume)); } catch (e) {}
        controls.forEach(o => { if (o !== el) o.value = el.value; });
      });
      el.addEventListener('change', () => play('tap'));
    });
  }
  window.SakuSfx = { play, result, winOnce, sounds: Object.keys(SOUNDS) };
  document.addEventListener('saku:level-up', () => play('level'));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
