/* ============================================================
   🎵 SAKUGAME — MUSIC PLAYER (music.js)
   ------------------------------------------------------------
   THIS FILE IS YOURS TO UPDATE AT ANY TIME.
   Nothing else in the website needs to change.

   HOW TO ADD / CHANGE MUSIC:
   1. Drop your .mp3 files into the  music/  folder.
   2. Edit the MUSIC_PLAYLIST list below — one line per file,
      with the EXACT file name (case matters!).
   3. Save, push to GitHub, done.

   The track name shown in the bottom-left corner = the file
   name (without the .mp3 extension).
   ============================================================ */

const MUSIC_PLAYLIST = [
  'Anohana - Opening.mp3',   // ← replace with your real file names
  'Bunny Girl Senpai - Ending 1.mp3',
  'Chainsaw Man - Ending 9.mp3',
];

// Optional settings:
const MUSIC_SHUFFLE = true;        // false = plays your list in order (loops), true = random order
const MUSIC_DEFAULT_VOLUME = 0.5;   // 0.0 to 1.0 — used on first visit only (after that, the player's choice is remembered)

/* ============================================================
   ⬇️  PLAYER ENGINE — you normally don't need to touch this
   ============================================================ */
(function () {
  if (!Array.isArray(MUSIC_PLAYLIST) || MUSIC_PLAYLIST.length === 0) return;

  const VOLUME_KEY = 'sakugame_music_volume';
  const audio = new Audio();
  audio.preload = 'auto';

  let volume = MUSIC_DEFAULT_VOLUME;
  try {
    const saved = parseFloat(localStorage.getItem(VOLUME_KEY));
    if (!isNaN(saved) && saved >= 0 && saved <= 1) volume = saved;
  } catch (e) {}
  audio.volume = volume;

  // ----- play order (sequential with loop, or shuffled) -----
  let order = MUSIC_PLAYLIST.map((_, i) => i);
  let cursor = 0;
  function shuffled() {
    const arr = MUSIC_PLAYLIST.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }

  // ----- now-playing label (bottom-left corner) -----
  const styleTag = document.createElement('style');
  styleTag.textContent =
    '#musicNowPlaying{position:fixed;bottom:20px;left:20px;z-index:50;background:var(--accent2,#0f3460);color:#fff;' +
    'padding:10px 18px;border-radius:25px;font:700 .85rem Nunito,sans-serif;box-shadow:0 4px 15px rgba(0,0,0,.3);' +
    'display:none;align-items:center;gap:8px;max-width:45vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}';
  document.head.appendChild(styleTag);
  const label = document.createElement('div');
  label.id = 'musicNowPlaying';
  document.body.appendChild(label);

  function trackNameOf(src) {
    let file = src.split('/').pop().replace(/\.mp3$/i, '');
    try { file = decodeURIComponent(file); } catch (e) {}
    return file;
  }

  function currentSrc() { return MUSIC_PLAYLIST[order[cursor]]; }

  function loadCurrent() {
    audio.src = currentSrc();
    audio.load();
    if (playing) {
      label.textContent = '🎵 ' + trackNameOf(currentSrc());
      label.style.display = 'flex';
      audio.play().catch(() => {});
    }
  }

  let consecutiveErrors = 0;
  function nextTrack() {
    cursor++;
    if (cursor >= order.length) { order = MUSIC_SHUFFLE ? shuffled() : MUSIC_PLAYLIST.map((_, i) => i); cursor = 0; }
    loadCurrent();
  }
  audio.addEventListener('ended', () => { consecutiveErrors = 0; nextTrack(); });
  audio.addEventListener('error', () => {
    console.warn('[music] Cannot play file:', currentSrc(), '— check the file exists and the name matches MUSIC_PLAYLIST.');
    consecutiveErrors++;
    if (consecutiveErrors <= MUSIC_PLAYLIST.length) nextTrack(); // skip missing file; give up if ALL are missing
  });

  // ----- start on first user interaction (browsers block autoplay) -----
  let playing = false;
  function tryStart() {
    if (playing) return;
    audio.play().then(() => {
      playing = true;
      label.textContent = '🎵 ' + trackNameOf(currentSrc());
      label.style.display = 'flex';
      ['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.removeEventListener(ev, tryStart));
    }).catch(() => {});
  }

  // ----- volume control (sliders carry the class "music-volume-slider") -----
  function setVolume(v) {
    v = Math.max(0, Math.min(100, parseFloat(v) || 0));
    volume = v / 100;
    audio.volume = volume;
    try { localStorage.setItem(VOLUME_KEY, String(volume)); } catch (e) {}
    document.querySelectorAll('.music-volume-slider').forEach(s => { s.value = String(v); });
  }
  function syncSliders() {
    document.querySelectorAll('.music-volume-slider').forEach(s => {
      s.value = String(Math.round(volume * 100));
      if (!s.dataset.musicBound) { s.dataset.musicBound = '1'; s.addEventListener('input', e => setVolume(e.target.value)); }
    });
  }

  window.MusicPlayer = {
    setVolume: setVolume,
    getVolume: function () { return volume; },
    next: nextTrack,
    nowPlaying: function () { return playing ? trackNameOf(currentSrc()) : null; }
  };

  // ----- boot -----
  loadCurrent(); // preload first track (no sound until first click/keypress)
  if (MUSIC_SHUFFLE) { order = shuffled(); cursor = 0; loadCurrent(); }
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, tryStart));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncSliders); else syncSliders();
})();
