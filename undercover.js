// ============================================================
// SAKUGAME — Undercover word pairs
// ============================================================
// HOW IT WORKS:
//   Each entry is a pair of SIMILAR words: ["Word A", "Word B", "type"]
//   - All CIVILIANS get one word of the pair
//   - The UNDERCOVER gets the OTHER one
//   - "type" is "c" (anime characters) or "s" (anime series) — info only
//
// The game picks a random pair each round. Good pairs are things that are
// similar enough to be described with the same clues, but not identical.
//
// TIP: you usually DON'T need to edit this file! Logged-in players can add
// pairs directly from the site: Create Room → 🕵️ Undercover →
// "📝 Manage My Word Pairs" (with AniList search + pictures — saved online).
// Those custom pairs are ADDED ON TOP of the built-in list below.
//
// FEEL FREE TO EDIT ANYWAY if you prefer: add/remove pairs below, save,
// upload — that's it. Just keep the exact format: ["First", "Second", "c"],
// ============================================================

const UNDERCOVER_PAIRS = [
  // ---------- ANIME CHARACTERS ----------
  ["Naruto", "Sasuke", "c"],
  ["Goku", "Vegeta", "c"],
  ["Luffy", "Zoro", "c"],
  ["Luffy", "Ace", "c"],
  ["Sanji", "Zoro", "c"],
  ["Eren", "Mikasa", "c"],
  ["Eren", "Armin", "c"],
  ["Levi", "Erwin", "c"],
  ["Light Yagami", "L", "c"],
  ["Near", "Mello", "c"],
  ["Killua", "Gon", "c"],
  ["Kurapika", "Leorio", "c"],
  ["Hisoka", "Illumi", "c"],
  ["Saitama", "Genos", "c"],
  ["Saitama", "Garou", "c"],
  ["Deku", "Bakugo", "c"],
  ["Todoroki", "Deku", "c"],
  ["All Might", "Endeavor", "c"],
  ["Kirishima", "Bakugo", "c"],
  ["Tanjiro", "Zenitsu", "c"],
  ["Tanjiro", "Inosuke", "c"],
  ["Giyu", "Shinobu", "c"],
  ["Rengoku", "Tengen", "c"],
  ["Nezuko", "Kanao", "c"],
  ["Satoru Gojo", "Geto", "c"],
  ["Satoru Gojo", "Sukuna", "c"],
  ["Yuji", "Megumi", "c"],
  ["Yuji", "Todo", "c"],
  ["Maki", "Mai", "c"],
  ["Itachi", "Sasuke", "c"],
  ["Kakashi", "Obito", "c"],
  ["Jiraiya", "Orochimaru", "c"],
  ["Minato", "Kakashi", "c"],
  ["Edward Elric", "Alphonse Elric", "c"],
  ["Roy Mustang", "Maes Hughes", "c"],
  ["Lelouch", "Suzaku", "c"],
  ["Spike Spiegel", "Jet Black", "c"],
  ["Senku", "Taiju", "c"],
  ["Senku", "Gen", "c"],
  ["Ash Ketchum", "Gary Oak", "c"],
  ["Pikachu", "Charizard", "c"],
  ["Brock", "Misty", "c"],
  ["Rem", "Ram", "c"],
  ["Subaru", "Emilia", "c"],
  ["Kirito", "Eugeo", "c"],
  ["Asuna", "Sinon", "c"],
  ["Ichigo", "Uryu", "c"],
  ["Aizen", "Gin", "c"],
  ["Byakuya", "Renji", "c"],
  ["Natsu", "Gray", "c"],
  ["Natsu", "Gajeel", "c"],
  ["Erza", "Mirajane", "c"],
  ["Meliodas", "Ban", "c"],
  ["Meliodas", "Escanor", "c"],
  ["King", "Diane", "c"],
  ["Mob", "Reigen", "c"],
  ["Mob", "Ritsu", "c"],
  ["Denji", "Aki", "c"],
  ["Power", "Kobeni", "c"],
  ["Yor", "Loid", "c"],
  ["Thorfinn", "Askeladd", "c"],
  ["Thorfinn", "Canute", "c"],
  ["Guts", "Griffith", "c"],
  ["Frieren", "Fern", "c"],
  ["Rimuru", "Milim", "c"],
  ["Ainz", "Demiurge", "c"],
  ["Aqua", "Megumin", "c"],
  ["Ryuko", "Satsuki", "c"],
  ["Simon", "Kamina", "c"],
  ["Gintoki", "Katsura", "c"],
  ["Gintoki", "Hijikata", "c"],
  ["Miyuki Shirogane", "Ishigami", "c"],
  ["Kaguya", "Chika", "c"],
  ["Hachiman", "Yukino", "c"],
  ["Rudeus", "Paul", "c"],
  ["Tohru", "Elma", "c"],
  ["Nasa", "Tsukasa", "c"],
  ["Bocchi", "Nijika", "c"],
  ["Baki", "Yujiro", "c"],
  ["Shinra", "Arthur Boyle", "c"],
  ["Asta", "Yuno", "c"],
  ["Yami Sukehiro", "Jack the Ripper", "c"],

  // ---------- ANIME SERIES ----------
  ["Death Note", "Code Geass", "s"],
  ["Attack on Titan", "Vinland Saga", "s"],
  ["Naruto", "Bleach", "s"],
  ["One Piece", "Fairy Tail", "s"],
  ["Dragon Ball Z", "Naruto", "s"],
  ["Demon Slayer", "Jujutsu Kaisen", "s"],
  ["Hunter x Hunter", "Yu Yu Hakusho", "s"],
  ["Fire Force", "Soul Eater", "s"],
  ["Oshi no Ko", "Kaguya-sama", "s"],
  ["Sword Art Online", "Accel World", "s"],
  ["Re:Zero", "Konosuba", "s"],
  ["Overlord", "That Time I Got Reincarnated as a Slime", "s"],
  ["Steins;Gate", "Erased", "s"],
  ["Tokyo Ghoul", "Parasyte", "s"],
  ["One Punch Man", "My Hero Academia", "s"],
  ["Mob Psycho 100", "Saiki K", "s"],
  ["Chainsaw Man", "Hell's Paradise", "s"],
  ["Spy x Family", "Buddy Daddies", "s"],
  ["Your Name", "Weathering With You", "s"],
  ["A Silent Voice", "I Want to Eat Your Pancreas", "s"],
  ["Haikyuu", "Kuroko's Basketball", "s"],
  ["Blue Lock", "Ao Ashi", "s"],
  ["Cowboy Bebop", "Samurai Champloo", "s"],
  ["Evangelion", "Darling in the Franxx", "s"],
  ["Gurren Lagann", "Kill la Kill", "s"],
  ["Black Clover", "Radiant", "s"],
  ["My Hero Academia", "Assassination Classroom", "s"],
  ["Made in Abyss", "The Promised Neverland", "s"],
  ["Your Lie in April", "Anohana", "s"],
  ["Clannad", "Angel Beats", "s"],
  ["Toradora", "Golden Time", "s"],
  ["Berserk", "Claymore", "s"],
  ["Vinland Saga", "Kingdom", "s"],
  ["Dororo", "Inuyasha", "s"],
  ["Psycho-Pass", "Ghost in the Shell", "s"],
  ["Akira", "Ghost in the Shell", "s"],
  ["Monster", "Pluto", "s"],
  ["Pokémon", "Digimon", "s"],
  ["Yu-Gi-Oh!", "Cardfight Vanguard", "s"],
  ["Beyblade", "Bakugan", "s"],
  ["Bocchi the Rock", "K-On!", "s"],
  ["Solo Leveling", "The Eminence in Shadow", "s"],
  ["Tokyo Revengers", "Wind Breaker", "s"],
  ["Bungo Stray Dogs", "Moriarty the Patriot", "s"],
  ["Seven Deadly Sins", "Magi", "s"],
  ["Attack on Titan", "Kabaneri of the Iron Fortress", "s"],
  ["Frieren", "Delicious in Dungeon", "s"],
  ["Dr. Stone", "Cells at Work", "s"],
];

// ============================================================
// YOUR CUSTOM PAIRS (your list, added 2026-08-12)
// Official AniList names + pictures attached automatically.
// imgA/imgB = picture shown in-game (null = no picture available).
// Edit freely: change names, remove lines, add new ones.
// ============================================================
UNDERCOVER_PAIRS.push(
  { a: "Zuko", b: "Shouto Todoroki", type: "c", imgA: null, imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b89220-KNBwaVFAR8FD.png" }, // Zuko (Avatar — not on AniList, no img)
  { a: "Yoshikage Kira", b: "Light Yagami", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b12055-eCEkIVV4qoCu.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b80-26EhwSsSqQ50.png" }, // Yoshikage Kira / Light Yagami
  { a: "Benimaru Shinmon", b: "Genryuusai Yamamoto", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b130848-AuuIm6GR8ody.jpg", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b5726-mO7kc8Abka9J.jpg" }, // Benimaru / Yamamoto
  { a: "Kurapika", b: "Sasuke Uchiha", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b28-ivA7UGnfE40a.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b13-SISLEw1oAD7a.png" }, // Kurapika / Sasuke
  { a: "Yuuji Itadori", b: "Sukuna", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b127212-FVm2tD0erQ5B.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b133701-rCQuDpHr3UZL.png" }, // Yuji / Sukuna
  { a: "Beam", b: "Kisame Hoshigaki", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b157232-5GuWeqoFN9Kq.jpg", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/2672-oxbHx8n3N7WY.jpg" }, // Beam / Kisame
  { a: "Shanks", b: "Gildarts Clive", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b727-wUJx7M1z5xON.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b29502-znlVXVdXEQqg.png" }, // Shanks / Gildarts
  { a: "Kakashi Hatake", b: "Satoru Gojou", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b85-mkVBh2yjxjmx.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png" }, // Kakashi / Gojo
  { a: "Subaru Natsuki", b: "Rintarou Okabe", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b88573-F8yMTK9GhnTA.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b35252-DY9TW6pusqeh.png" }, // Subaru / Okabe
  { a: "Puck", b: "Happy", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b90187-xJXlD84KXl3t.jpg", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b5188-1jTaic3aJ7Ds.jpg" }, // Puck (Re:Zero) / Happy
  { a: "Miyako Shikimori", b: "Akane Kurokawa", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b155702-S8irhsg4QTPf.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b203384-YuSppFDMw2wn.png" }, // Shikimori / Akane
  { a: "Iori Kitahara", b: "Kiyoshi Fujino", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b123182-tuQ2yf5IEx02.jpg", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b46557-fJ8Va6GtynPM.jpg" }, // Kitahara / Kiyoshi Fujino
  { a: "Ryou Yamada", b: "Mio Akiyama", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b264529-BvEusZnJLD2Y.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b19566-XKsMgf370b4m.png" }, // Ryo Yamada / Mio Akiyama
  { a: "Mai Sakurajima", b: "Marin Kitagawa", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b127222-Jh5hhP7vZ7s1.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b133676-kV2czE3C8Qls.png" }, // Mai / Marin
  { a: "Obito Uchiha", b: "Dabi", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b3149-j6cl8A9yup51.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b126378-RFSljq5koy5U.png" }, // Obito / Dabi
  { a: "Beerus", b: "Champa", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b76348-pGWrznfxgPIV.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/127220-yWeW7rlEJP4V.jpg" }, // Beerus / Champa
  { a: "Fern", b: "Coco", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b183965-uGFohBjlFoTp.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b129840-B2CVE0TIcKpT.png" }, // Fern / Coco
  { a: "Erza Scarlet", b: "Eris Boreas Greyrat", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b5189-GR1xdok9SFsN.jpg", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b88349-5dsNUah3oBj8.png" }, // Erza / Eris
  { a: "Kiyotaka Ayanokouji", b: "Yuuichi Katagiri", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b123212-ewZgUQr9vvEM.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b122064-p5x9pgsdjj4W.jpg" }, // Ayanokoji / Yuichi
  { a: "Vanessa Enoteca", b: "Kana Arima", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b124436-dES6CtprlZNy.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b188783-77orwP7vNuNg.png" }, // Vanessa / Kana
  { a: "Itachi Uchiha", b: "Madara Uchiha", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b14-9Kb1E5oel1ke.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b53901-HnRKSoHMG5Vg.png" }, // Itachi / Madara
  { a: "Muzan Kibutsuji", b: "Imu", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b129132-4nIZakUZ1o8W.jpg", imgB: null }, // Muzan / Imu (no img on AniList)
  { a: "Guy Might", b: "Touji Fushiguro", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b307-xieUEdhdTVwQ.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b162722-btzdghBizxKS.jpg" }, // Gai Maito / Toji
  { a: "Cell", b: "Meruem", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/3908.jpg", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b23277-EYmIxzL64Mji.png" }, // Cell / Meruem
  { a: "Arataka Reigen", b: "Kamina", type: "c", imgA: "https://s4.anilist.co/file/anilistcdn/character/large/b89334-OPj1hCzvrt7X.png", imgB: "https://s4.anilist.co/file/anilistcdn/character/large/b2075-sWb5Xz76JWdX.png" }, // Reigen / Kamina
  { a: "Vegeto", b: "Gogeta", type: "c", imgA: null, imgB: null }, // Vegeto / Gogeta (no img on AniList)
);
