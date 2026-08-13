/* ============================================================
   🎵 SAKUGAME — MUSIC PLAYER (music.js)
   ------------------------------------------------------------
   AUTOMATIC TRACKLIST 🎉 — you no longer need to edit this file!

   HOW TO ADD / CHANGE MUSIC:
   1. Drop your .mp3 files into the  music/  folder.
   2. Push to GitHub. DONE — the player asks GitHub which files
      are in  music/  and plays them all automatically.
      (The list refreshes every 30 minutes in visitors' browsers.)

   The track name shown in the bottom-left corner = the file
   name (without the .mp3 extension).

   ⬇️ The list below is now only a BACKUP, used if the automatic
   listing can't load (offline preview, GitHub API hiccup).
   Keeping it updated is a good idea, but not required.
   ============================================================ */

// The GitHub repo that hosts this site (used to list the music/ folder).
// If you ever rename the repo, update ONLY this line:
const MUSIC_REPO = 'soufeokr/Sakugame';

// BACKUP playlist (used only when the automatic listing fails):
const MUSIC_PLAYLIST = [
  'Anohana - Opening.mp3',
  'Bunny Girl Senpai - Ending 1.mp3',
  'Chainsaw Man - Ending 9.mp3',
  'More Than a Married Couple, But Not Lovers - Ending.mp3',
  'Spy x Family - Ending 1.mp3',
  'Vinland Saga - Opening 3.mp3',
];

// Optional settings:
const MUSIC_SHUFFLE = true;         // false = plays your list in order (loops), true = random order
const MUSIC_DEFAULT_VOLUME = 0.5;   // 0.0 to 1.0 — used on first visit only (after that, the player's choice is remembered)

/* ============================================================
   ⬇️  PLAYER ENGINE — you normally don't need to touch this
   ============================================================ */
(function () {
  // ---------- automatic tracklist discovery ----------
  const CACHE_KEY = 'sakugame_music_tracklist';
  const CACHE_TTL = 30 * 60 * 1000; // re-check GitHub at most every 30 min

  function readCache() {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (c && Array.isArray(c.files) && c.files.length) return c;
    } catch (e) {}
    return null;
  }
  function writeCache(files) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), files: files })); } catch (e) {}
  }

  async function discoverTrackNames() {
    const cached = readCache();
    if (cached && (Date.now() - (cached.t || 0)) < CACHE_TTL) return cached.files;
    try {
      const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      const timer = ctrl ? setTimeout(() => ctrl.abort(), 6000) : null;
      const res = await fetch('https://api.github.com/repos/' + MUSIC_REPO + '/contents/music', {
        headers: { 'Accept': 'application/vnd.github+json' },
        signal: ctrl ? ctrl.signal : undefined
      });
      if (timer) clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const names = data.filter(f => f && f.type === 'file' && /\.mp3$/i.test(f.name || '')).map(f => f.name);
          if (names.length) { writeCache(names); return names; }
        }
      }
      console.warn('[music] Could not list the music/ folder (HTTP ' + res.status + ') — using backup list.');
    } catch (e) {
      console.warn('[music] Automatic tracklist unavailable — using backup list.', e);
    }
    if (cached) return cached.files;  // an old list still beats the tiny backup list
    return MUSIC_PLAYLIST;
  }

  function toSrc(entry) {
    // Entries with a folder are used as-is; plain file names live in music/
    let p = String(entry || '').trim();
    if (!p) return null;
    return (p.indexOf('/') === -1 ? 'music/' + encodeURIComponent(p) : p);
  }

  // ---------- player engine ----------
  function startPlayer(names) {
    const TRACKS = [];
    names.forEach(n => { const src = toSrc(n); if (src) TRACKS.push(src); });
    if (TRACKS.length === 0) return;

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
    let order = TRACKS.map((_, i) => i);
    let cursor = 0;
    function shuffled() {
      const arr = TRACKS.map((_, i) => i);
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

    function currentSrc() { return TRACKS[order[cursor]]; }

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
      if (cursor >= order.length) { order = MUSIC_SHUFFLE ? shuffled() : TRACKS.map((_, i) => i); cursor = 0; }
      loadCurrent();
    }
    audio.addEventListener('ended', () => { consecutiveErrors = 0; nextTrack(); });
    audio.addEventListener('error', () => {
      console.warn('[music] Cannot play file:', currentSrc());
      consecutiveErrors++;
      if (consecutiveErrors <= TRACKS.length) nextTrack(); // skip missing file; give up if ALL are missing
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

    // ----- boot the player itself -----
    if (MUSIC_SHUFFLE) order = shuffled();
    cursor = 0;
    loadCurrent(); // preload first track (no sound until first click/keypress)
    ['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, tryStart));
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncSliders); else syncSliders();
  }

  // ---------- go: find the tracks, then start ----------
  (async function () { startPlayer(await discoverTrackNames()); })();
})();
