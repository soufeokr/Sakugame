/* ============================================================
   🚫 SAKUGAME — NSFW (18+) ID LIST (nsfwdata.js)
   Generated 2026-09-16 from the AniList public API (isAdult flag).
   Powers the "Hide NSFW content" filter (Settings → Account).
   ============================================================ */
const NSFW_ANIME_IDS_LIST = [5259, 5569, 8861, 10851, 17157, 20783, 21067, 21358, 100659, 101374, 109171, 110270, 113417, 113425, 115138, 115567, 118465, 127090, 151632];
const NSFW_ANIME_IDS = new Set(NSFW_ANIME_IDS_LIST);
const NSFW_CHARACTER_IDS = (function () {
  const s = new Set();
  try {
    if (typeof CHAR_ANIME_IDS !== 'undefined' && CHAR_ANIME_IDS) {
      for (const cid in CHAR_ANIME_IDS) {
        const aids = CHAR_ANIME_IDS[cid] || [];
        for (let i = 0; i < aids.length; i++) { if (NSFW_ANIME_IDS.has(aids[i])) { s.add(parseInt(cid, 10)); break; } }
      }
    }
  } catch (e) {}
  return s;
})();
