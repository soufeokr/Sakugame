/* ============================================================
   🎬 SAKUGAME — GENERIC ANIME COVER POOL (animes.js)
   ------------------------------------------------------------
   The 500 most-favorited anime on AniList (non-adult),
   fetched 2026-08-15 via the AniList public API.
   Used by the Blur Guess 🎬 "Guess the anime cover" mode.

   Each entry:
     { "id": 123, "name": "Romaji Title", "image": "https://...",
       "year": 2009,
       "al": ["English title", "Synonym", ...]   ← optional }
   ============================================================ */

const ANIME_COVERS =
[
 {
  "id": 21,
  "name": "ONE PIECE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21-ELSYx3yMPcKM.jpg",
  "year": 1999,
  "al": [
   "Vua Hải Tặc",
   "All'arrembaggio!",
   "Tutti all'arrembaggio!",
   "OP"
  ]
 },
 {
  "id": 11061,
  "name": "HUNTER×HUNTER (2011)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11061-y5gsT1hoHuHw.png",
  "year": 2011,
  "al": [
   "Hunter x Hunter (2011)",
   "HxH",
   "ฮันเตอร์ x ฮันเตอร์"
  ]
 },
 {
  "id": 16498,
  "name": "Shingeki no Kyojin",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-buvcRTBx4NSm.jpg",
  "year": 2013,
  "al": [
   "Attack on Titan",
   "SnK",
   "AoT",
   "Ataque a los Titanes",
   "Ataque dos Titãs",
   "L'Attacco dei Giganti",
   "L’Attaque des Titans",
   "Ataque de Titãs",
   "Atak Tytanów",
   "Đại Chiến Titan"
  ]
 },
 {
  "id": 5114,
  "name": "Hagane no Renkinjutsushi: FULLMETAL ALCHEMIST",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx5114-nSWCgQlmOMtj.jpg",
  "year": 2009,
  "al": [
   "Fullmetal Alchemist: Brotherhood",
   "FMA",
   "FMAB",
   "Hagaren",
   "Full Metal Alchemist: Brotherhood",
   "钢之炼金术师 FULLMETAL ALCHEMIST",
   "Stalowy alchemik: Misja braci"
  ]
 },
 {
  "id": 113415,
  "name": "Jujutsu Kaisen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113415-LHBAeoZDIsnF.jpg",
  "year": 2020,
  "al": [
   "JJK",
   "Sorcery Fight",
   "Chú Thuật Hồi Chiến"
  ]
 },
 {
  "id": 1535,
  "name": "DEATH NOTE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1535-kUgkcrfOrkUM.jpg",
  "year": 2006,
  "al": [
   "Notatnik śmierci",
   "Carnet de la Mort"
  ]
 },
 {
  "id": 101922,
  "name": "Kimetsu no Yaiba",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101922-WBsBl0ClmgYL.jpg",
  "year": 2019,
  "al": [
   "Demon Slayer: Kimetsu no Yaiba",
   "KnY",
   "Kimetsu no Yaiba: Kyoudai no Kizuna",
   "Demon Slayer: Kimetsu no Yaiba: Bonds of Siblings",
   "Miecz zabójcy demonów – Kimetsu no Yaiba",
   " Guardians de la nit: Kimetsu no Yaiba",
   "İblis Keser",
   "Zabiják démonů"
  ]
 },
 {
  "id": 20954,
  "name": "Koe no Katachi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20954-sYRfE5jQRtSB.jpg",
  "year": 2016,
  "al": [
   "A Silent Voice",
   "The Shape of Voice",
   "A Voz do Silêncio",
   "A Forma da Voz",
   "La Forma della Voce",
   "Una voz silenciosa",
   "La Forme de la voix",
   "Tylus balsas",
   "Balss forma",
   "Sakit səs",
   "Dáng hình thanh âm"
  ]
 },
 {
  "id": 9253,
  "name": "Steins;Gate",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx9253-tIUXF2gfU8Sg.jpg",
  "year": 2011,
  "al": [
   "S;G"
  ]
 },
 {
  "id": 154587,
  "name": "Sousou no Frieren",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx154587-qQTzQnEJJ3oB.jpg",
  "year": 2023,
  "al": [
   "Frieren: Beyond Journey’s End",
   "Frieren at the Funeral",
   "Frieren - Oltre la Fine del Viaggio",
   "คำอธิษฐานในวันที่จากลา Frieren",
   "Frieren e a Jornada para o Além",
   "Frieren – Nach dem Ende der Reise",
   "Frieren: Más allá del final del viaje",
   "Frieren en el funeral",
   "Sōsō no Furīren",
   "Frieren. U kresu drogi",
   "Frieren - Pháp sư tiễn táng",
   "Frieren: Tras finalizar el viaje"
  ]
 },
 {
  "id": 1735,
  "name": "NARUTO: Shippuuden",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1735-kGfVm0YqCPcu.png",
  "year": 2007,
  "al": [
   "Naruto: Shippuden"
  ]
 },
 {
  "id": 21519,
  "name": "Kimi no Na wa.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21519-SUo3ZQuCbYhJ.png",
  "year": 2016,
  "al": [
   "Your Name.",
   "Your Name. - Gestern, heute und für immer",
   "Mi a Neved?",
   "Tu nombre",
   "Il tuo nome",
   "Twoje imię",
   "Tên cậu là gì",
   "Tvoje meno.",
   "Tvoje jméno."
  ]
 },
 {
  "id": 30,
  "name": "Shin Seiki Evangelion",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx30-AI1zr74Dh4ye.jpg",
  "year": 1995,
  "al": [
   "Neon Genesis Evangelion",
   "NGE",
   "Eva"
  ]
 },
 {
  "id": 20,
  "name": "NARUTO",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20-dE6UHbFFg1A5.jpg",
  "year": 2002
 },
 {
  "id": 20464,
  "name": "Haikyuu!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20464-ooZUyBe4ptp9.png",
  "year": 2014,
  "al": [
   "HAIKYU!!",
   "High Kyuu!!",
   "Haikyu!! L'asso del volley"
  ]
 },
 {
  "id": 21827,
  "name": "Violet Evergarden",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21827-ubzq619ZA2E9.png",
  "year": 2018
 },
 {
  "id": 101348,
  "name": "VINLAND SAGA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101348-2fhDFPCuMNiz.jpg",
  "year": 2019
 },
 {
  "id": 21507,
  "name": "Mob Psycho 100",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21507-6YUSbh2m0N1p.jpg",
  "year": 2016,
  "al": [
   "מוב פסיכו 100"
  ]
 },
 {
  "id": 21355,
  "name": "Re:Zero kara Hajimeru Isekai Seikatsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21355-wRVUrGxpvIQQ.jpg",
  "year": 2016,
  "al": [
   "Re:ZERO -Starting Life in Another World-",
   "Re: Life in a different world from zero",
   "ReZero",
   "Re Zero",
   "Re：从零开始的异世界生活",
   "Re:Zero Empezar de cero en un mundo diferente",
   "Re:Zero – Bắt đầu lại ở thế giới khác"
  ]
 },
 {
  "id": 20665,
  "name": "Shigatsu wa Kimi no Uso",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20665-TLgkL8T8IRFd.png",
  "year": 2014,
  "al": [
   "Your lie in April",
   "KimiUso",
   "Bugie d'aprile",
   "YLIA",
   "Sekunden in Moll",
   "Tháng Tư Là Lời Nói Dối Của Em"
  ]
 },
 {
  "id": 127230,
  "name": "Chainsaw Man",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx127230-DdP4vAdssLoz.png",
  "year": 2022,
  "al": [
   "CSM",
   "Thợ Săn Quỷ"
  ]
 },
 {
  "id": 21459,
  "name": "Boku no Hero Academia",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21459-nYh85uj2Fuwr.jpg",
  "year": 2016,
  "al": [
   "My Hero Academia",
   "BNHA",
   "MHA",
   "나의 히어로 아카데미아 1기",
   "Akademia bohaterów",
   "Hősakadémia",
   "Học Viện Anh Hùng"
  ]
 },
 {
  "id": 1575,
  "name": "Code Geass: Hangyaku no Lelouch",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1575-hsmWM2ydNm1m.jpg",
  "year": 2006,
  "al": [
   "Code Geass: Lelouch of the Rebellion",
   "Code Geass: Lelouch de la Rebelión"
  ]
 },
 {
  "id": 124080,
  "name": "Horimiya",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx124080-3i22mRVPBS0T.jpg",
  "year": 2021
 },
 {
  "id": 1,
  "name": "Cowboy Bebop",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1-GCsPm7waJ4kS.png",
  "year": 1998,
  "al": [
   "Kowboj Bebop"
  ]
 },
 {
  "id": 21087,
  "name": "One Punch Man",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21087-B5DHjqZ3kW4b.jpg",
  "year": 2015,
  "al": [
   "OPM",
   "Wanpanman",
   "Jagoan Sekali Pukul S1",
   "Nhất Quyền Nhân"
  ]
 },
 {
  "id": 101291,
  "name": "Seishun Buta Yarou wa Bunny Girl Senpai no Yume wo Minai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101291-wfEdgPqtfU0l.jpg",
  "year": 2018,
  "al": [
   "Rascal Does Not Dream of Bunny Girl Senpai",
   "AoButa"
  ]
 },
 {
  "id": 97940,
  "name": "Black Clover",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx97940-fyh8o7gNbha0.png",
  "year": 2017
 },
 {
  "id": 269,
  "name": "BLEACH",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx269-d2GmRkJbMopq.png",
  "year": 2004
 },
 {
  "id": 104578,
  "name": "Shingeki no Kyojin Season 3 Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx104578-k61nx3LPjvgd.jpg",
  "year": 2019,
  "al": [
   "Attack on Titan Season 3 Part 2",
   "SnK 3",
   "AoT 3",
   "Shingeki no Kyojin Season 3 (2019)",
   "L'Attaco dei Giganti 3 Parte 2",
   "L'Attacco dei Giganti - Terza Stagione Parte 2",
   "מתקפת הטיטאנים עונה 3 חלק 2",
   "L'Attaque des Titans Saison 3 Partie 2 ",
   "ผ่าพิภพไททัน ภาค 3 Part 2",
   "حمله به تایتان فصل 3"
  ]
 },
 {
  "id": 110277,
  "name": "Shingeki no Kyojin: The Final Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx110277-sKUNXAsWMNFw.jpg",
  "year": 2021,
  "al": [
   "Attack on Titan Final Season",
   "SnK 4",
   "AoT 4",
   "Shingeki no Kyojin 4",
   "進撃の巨人4",
   "Attack on Titan Season 4",
   "L'Attaque des Titans Saison Finale",
   "L'Attacco dei Giganti 4",
   "L'Attacco dei Giganti - La Stagione Finale",
   "ผ่าพิภพไททัน Final Season"
  ]
 },
 {
  "id": 101921,
  "name": "Kaguya-sama wa Kokurasetai: Tensaitachi no Renai Zunousen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101921-ufrjLzhSz7L1.jpg",
  "year": 2019,
  "al": [
   "Kaguya-sama: Love is War",
   "Kaguya Wants to be Confessed To: The Geniuses' War of Love and Brains",
   "Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen",
   "Kaguya-sama : L'Amour est une guerre",
   "Kaguya-sama: Cuộc Chiến Tỏ Tình",
   "Cuộc Chiến Tỏ Tình"
  ]
 },
 {
  "id": 120377,
  "name": "Cyberpunk: Edgerunners",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx120377-ayZPoxiWt4Li.jpg",
  "year": 2022,
  "al": [
   "Cyberpunk: Mercenários",
   "CYBERPUNK: อาชญากรแดนเถื่อน"
  ]
 },
 {
  "id": 2001,
  "name": "Tengen Toppa Gurren Lagann",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx2001-XwRnjzGeFWRQ.png",
  "year": 2007,
  "al": [
   "Gurren Lagann",
   "Heavenly Breakthrough Gurren Lagann",
   "TTGL",
   "Sfondamento dei cieli Gurren Lagann",
   "Heaven-Piercing Gurren Lagann"
  ]
 },
 {
  "id": 130003,
  "name": "Bocchi the Rock!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx130003-HTDmeL4RGeJ4.png",
  "year": 2022,
  "al": [
   "외톨이 THE ROCK!",
   "BTR"
  ]
 },
 {
  "id": 21234,
  "name": "Boku dake ga Inai Machi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21234-XmqW39aQ9o7O.jpg",
  "year": 2016,
  "al": [
   "ERASED",
   "Bokumachi",
   "Desaparecido",
   "Miasto beze mnie"
  ]
 },
 {
  "id": 20605,
  "name": "Tokyo Ghoul",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b20605-k665mVkSug8D.jpg",
  "year": 2014,
  "al": [
   "Tokyo Kushu"
  ]
 },
 {
  "id": 101759,
  "name": "Yakusoku no Neverland",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101759-8UR7r9MNVpz2.jpg",
  "year": 2019,
  "al": [
   "The Promised Neverland",
   "YakuNeba",
   "TPN"
  ]
 },
 {
  "id": 11757,
  "name": "Sword Art Online",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11757-SxYDUzdr9rh2.jpg",
  "year": 2012,
  "al": [
   "S.A.O",
   "SAO"
  ]
 },
 {
  "id": 161645,
  "name": "Kusuriya no Hitorigoto",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx161645-QLbzHXiYRgV2.jpg",
  "year": 2023,
  "al": [
   "The Apothecary Diaries",
   "Drugstore Soliloquy",
   "Les Carnets de l'Apothicaire",
   "Zapiski zielarki",
   "Diários de uma Apotecária",
   "Il monologo della Speziale",
   "Los diarios de la boticaria",
   "Die Tagebücher der Apothekerin",
   "Dược sư tự sự"
  ]
 },
 {
  "id": 140960,
  "name": "SPY×FAMILY",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx140960-Kb6R5nYQfjmP.jpg",
  "year": 2022,
  "al": [
   "SPY x FAMILY",
   "SxF",
   "Gia Đình Điệp Viên"
  ]
 },
 {
  "id": 108465,
  "name": "Mushoku Tensei: Isekai Ittara Honki Dasu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx108465-1ANspF1EWyFx.jpg",
  "year": 2021,
  "al": [
   "Mushoku Tensei: Jobless Reincarnation",
   "Jobless Reincarnation: I Will Seriously Try If I Go To Another World",
   "Thất nghiệp chuyển sinh"
  ]
 },
 {
  "id": 105333,
  "name": "Dr. STONE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx105333-GybuoSoOZfpH.jpg",
  "year": 2019,
  "al": [
   "Dcst"
  ]
 },
 {
  "id": 101338,
  "name": "Mob Psycho 100 II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101338-rokVscjRYzdP.jpg",
  "year": 2019,
  "al": [
   "Mob Psycho Hyaku",
   "ม็อบไซโค 100 คนพลังจิต ภาค 2",
   "Моб Психо 100 II"
  ]
 },
 {
  "id": 19,
  "name": "MONSTER",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx19-gtMC64182sm4.jpg",
  "year": 2004
 },
 {
  "id": 21450,
  "name": "JoJo no Kimyou na Bouken: Diamond wa Kudakenai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21450-D7XFwEQjZ5GA.jpg",
  "year": 2016,
  "al": [
   "JoJo's Bizarre Adventure: Diamond is Unbreakable",
   "JoJo no Kimyou na Bouken Part 4: Diamond wa Kudakenai",
   "JoJo's Bizarre Adventure Part 4: Diamond is Unbreakable",
   "Le bizzarre avventure di JoJo: Diamond is Unbreakable",
   "Невероятные приключения ДжоДжо: Diamond is Unbreakable"
  ]
 },
 {
  "id": 9756,
  "name": "Mahou Shoujo Madoka☆Magica",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx9756-QnUGwlwwnsuN.jpg",
  "year": 2011,
  "al": [
   "Puella Magi Madoka Magica",
   "Mahou Shoujo Madoka Magika",
   "Magical Girl Madoka Magica",
   "PMMM",
   "MSMM"
  ]
 },
 {
  "id": 21202,
  "name": "Kono Subarashii Sekai ni Shukufuku wo!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21202-mPOr80AEjUcZ.png",
  "year": 2016,
  "al": [
   "KONOSUBA -God's blessing on this wonderful world!",
   "Konosuba",
   "Kono Subarashii Sekai ni Syukufuku wo!",
   "Konosuba - As Bençãos de Deus Neste Mundo Maravilhoso",
   "Konosuba : Sois béni monde merveilleux !",
   "Konosuba: Un mundo maravilloso!",
   " Konosuba: ¡Bendito sea este maravilloso mundo!"
  ]
 },
 {
  "id": 199,
  "name": "Sen to Chihiro no Kamikakushi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx199-sWefXJvXkDOb.jpg",
  "year": 2001,
  "al": [
   "Spirited Away",
   "Le Voyage de Chihiro",
   "La Città Incantata",
   "El Viaje de Chihiro",
   "Chihiros Reise ins Zauberland",
   "Ruhların Kaçışı",
   "Călătoria lui Chihiro",
   "Spirited Away: W krainie bogów",
   "Chihiro Szellemországban",
   "A Viagem de Chihiro",
   "Chihiro og heksene",
   "Henkien kätkemä",
   "Chihiro ilmmiid gaskkas",
   "Vaimudest viidud",
   "Chihiro og álögin"
  ]
 },
 {
  "id": 431,
  "name": "Howl no Ugoku Shiro",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx431-o8Lj3XkjHm2k.jpg",
  "year": 2004,
  "al": [
   "Howl‘s Moving Castle",
   "Hauru no Ugoku Shiro",
   "Das wandelnde Schloss",
   "El Castillo Ambulante",
   "Il castello errante di Howl",
   "Le Château Ambulant",
   "Ruchomy zamek Hauru",
   "A Vándorló palota",
   "O Castelo Animado",
   "Yürüyen Şato",
   "Det Levende Slottet",
   "Det levande slottet",
   "Hinn kviki kastali Howls",
   "El increible castillo vagabundo",
   "O Castelo Andante"
  ]
 },
 {
  "id": 101280,
  "name": "Tensei Shitara Slime Datta Ken",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101280-tDxCVJm714nt.jpg",
  "year": 2018,
  "al": [
   "That Time I Got Reincarnated as a Slime",
   "TenSura",
   "Vita da Slime",
   "Moi, quand je me réincarne en Slime",
   "Meine Wiedergeburt als Schleim in einer anderen Welt",
   "TTIGRAAS",
   "Lúc đó tôi đã chuyển sinh thành Slime",
   "Bereinkarnasi Malah Menjadi Slime",
   "Odrodzony jako galareta"
  ]
 },
 {
  "id": 97986,
  "name": "Made in Abyss",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx97986-TQ7dCgbS3y5s.jpg",
  "year": 2017,
  "al": [
   "Đến từ Abyss"
  ]
 },
 {
  "id": 20755,
  "name": "Ansatsu Kyoushitsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20755-dWrhs569YGUO.jpg",
  "year": 2015,
  "al": [
   "Assassination Classroom",
   "Klasa skrytobójców",
   "Lớp học ám sát"
  ]
 },
 {
  "id": 145064,
  "name": "Jujutsu Kaisen 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx145064-hSNRJM03pvv1.jpg",
  "year": 2023,
  "al": [
   "JUJUTSU KAISEN Season 2",
   "Jujutsu Kaisen: Kaigyoku Gyokusetsu / Shibuya Jihen",
   "Jujutsu Kaisen: Hidden Inventory / Premature Death",
   "JJK2",
   "มหาเวทย์ผนึกมาร ภาค 2 ",
   "Jujutsu Kaisen: Shibuya Incident"
  ]
 },
 {
  "id": 2904,
  "name": "Code Geass: Hangyaku no Lelouch R2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx2904-Fet9Q33suC7G.jpg",
  "year": 2008,
  "al": [
   "Code Geass: Lelouch of the Rebellion R2",
   "Code Geass: Hangyaku no Lelouch 2nd Season",
   "Code Geass: Hangyaku no Lelouch Second Season"
  ]
 },
 {
  "id": 21804,
  "name": "Saiki Kusuo no Ψ-nan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21804-As6tDLAvEvNY.jpg",
  "year": 2016,
  "al": [
   "The Disastrous Life of Saiki K."
  ]
 },
 {
  "id": 4224,
  "name": "Toradora!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx4224-PXVMBLNwy2aF.jpg",
  "year": 2008,
  "al": [
   "Tiger X Dragon"
  ]
 },
 {
  "id": 99147,
  "name": "Shingeki no Kyojin Season 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99147-AiPDD8cwlCfi.jpg",
  "year": 2018,
  "al": [
   "Attack on Titan Season 3",
   "SnK 3",
   "AoT 3",
   "מתקפת הטיטאנים עונה 3",
   "L'Attacco dei Giganti 3",
   "L'Attacco dei Giganti - Terza Stagione",
   "ผ่าพิภพไททัน ภาค 3 Part 1"
  ]
 },
 {
  "id": 20958,
  "name": "Shingeki no Kyojin Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20958-HuFJyr54Mmir.jpg",
  "year": 2017,
  "al": [
   "Attack on Titan Season 2",
   "SnK 2",
   "AoT 2",
   "+מתקפת הטיטאנים עונה 2",
   "L'Attacco dei Giganti 2",
   "L'Attacco dei Giganti - Seconda Stagione"
  ]
 },
 {
  "id": 151807,
  "name": "Ore dake Level Up na Ken",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151807-it355ZgzquUd.png",
  "year": 2024,
  "al": [
   "Solo Leveling",
   "Na Honjaman Level Up"
  ]
 },
 {
  "id": 99423,
  "name": "Darling in the Franxx",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx99423-8MBxtwCeHf8B.png",
  "year": 2018,
  "al": [
   "DitF",
   "DarliFra"
  ]
 },
 {
  "id": 99750,
  "name": "Kimi no Suizou wo Tabetai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99750-pNyly9d3MEgV.jpg",
  "year": 2018,
  "al": [
   "I Want to Eat Your Pancreas",
   "Quiero Comerme tu Páncreas",
   "Voglio mangiare il tuo pancreas",
   "Je veux manger ton pancréas",
   "Vull menjar-me el teu pàncrees",
   "Kimisui",
   "Eu Quero Comer Seu Pâncreas",
   "Tớ Muốn Ăn Tụy Của Cậu"
  ]
 },
 {
  "id": 102883,
  "name": "JoJo no Kimyou na Bouken: Ougon no Kaze",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx102883-S9KzdMJhDswJ.png",
  "year": 2018,
  "al": [
   "JoJo's Bizarre Adventure: Golden Wind",
   "JoJo's Bizarre Adventure Part 5",
   "JoJo's Bizarre Adventure: Vento Aureo",
   "Le Bizzarre Avventure Di GioGio: Vento Aureo"
  ]
 },
 {
  "id": 19815,
  "name": "No Game No Life",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b19815-sEOQ9yQaPKlk.jpg",
  "year": 2014,
  "al": [
   "NGNL",
   "nogenora "
  ]
 },
 {
  "id": 100388,
  "name": "BANANA FISH",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx100388-hjkg1AnlJR5z.jpg",
  "year": 2018
 },
 {
  "id": 132405,
  "name": "Sono Bisque Doll wa Koi wo Suru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx132405-qP7FQYGmNI3d.jpg",
  "year": 2022,
  "al": [
   "My Dress-Up Darling",
   "Sono Kisekae Ningyou wa Koi wo suru",
   "kisekoi",
   "Si Boneka Rias Sedang Jatuh Cinta",
   "Projekt: cosplay",
   "Oyuncak Bebek Sevgilim",
   "Nàng Búp Bê Thử Đồ Biết Yêu"
  ]
 },
 {
  "id": 32,
  "name": "Shin Seiki Evangelion Movie: Air / Magokoro wo, Kimi ni",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx32-5JYsv0wc122I.jpg",
  "year": 1997,
  "al": [
   "Neon Genesis Evangelion: The End of Evangelion"
  ]
 },
 {
  "id": 14719,
  "name": "JoJo no Kimyou na Bouken (TV)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx14719-VT5dRzTBSZ0w.jpg",
  "year": 2012,
  "al": [
   "JoJo's Bizarre Adventure (TV)",
   "JoJo no Kimyou na Bouken (2012)",
   "JoJo no Kimyou na Bouken: Sentou Chouryuu",
   "JoJo's Bizarre Adventure: Phantom Blood",
   "JoJo's Bizarre Adventure: Battle Tendency",
   "Le bizzarre avventure di JoJo (2012)",
   "Le bizzarre avventure di JoJo: Phantom Blood",
   "Le bizzarre avventure di JoJo: Battle Tendency",
   "JJBA"
  ]
 },
 {
  "id": 20623,
  "name": "Kiseijuu: Sei no Kakuritsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20623-dUARfggnNDOe.jpg",
  "year": 2014,
  "al": [
   "Parasyte -the maxim-",
   "Kiseiju - L'ospite indesiderato",
   "Parasite : La Maxime",
   "Pasożyt"
  ]
 },
 {
  "id": 116589,
  "name": "86: Eighty Six",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx116589-KawXHB6sApFt.jpg",
  "year": 2021,
  "al": [
   "86 -เอทตี้ซิกซ์-"
  ]
 },
 {
  "id": 171018,
  "name": "Dandadan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx171018-60q1B6GK2Ghb.jpg",
  "year": 2024,
  "al": [
   "DAN DA DAN",
   "DAN DA DAN: FIRST ENCOUNTER"
  ]
 },
 {
  "id": 5081,
  "name": "Bakemonogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx5081-9GocceQ5Z865.jpg",
  "year": 2009,
  "al": [
   "Monster Tale",
   "Monogatari"
  ]
 },
 {
  "id": 150672,
  "name": "[Oshi no Ko]",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx150672-WqmmwZ4nMzAy.png",
  "year": 2023,
  "al": [
   "Favorite Girl",
   "My Idol's Child",
   "[Mein*Star]",
   "Anak Idola",
   "【推しの子】Mother and Children",
   "[Oshi no Ko] Mother and Children",
   "Đứa Con Của Thần Tượng"
  ]
 },
 {
  "id": 20447,
  "name": "Noragami",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20447-EoQXeygHaVCK.jpg",
  "year": 2014,
  "al": [
   "Stray God",
   "โนรางามิ เทวดาขาจร ภาค 1"
  ]
 },
 {
  "id": 99263,
  "name": "Tate no Yuusha no Nariagari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99263-LcazQwdlWzMy.jpg",
  "year": 2019,
  "al": [
   "The Rising of the Shield Hero"
  ]
 },
 {
  "id": 112641,
  "name": "Kaguya-sama wa Kokurasetai?: Tensaitachi no Renai Zunousen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx112641-zoGC8d6FaPXU.jpg",
  "year": 2020,
  "al": [
   "Kaguya-sama: Love is War?",
   "Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen 2",
   "Kaguya-sama: Love is War Season 2",
   "辉夜大小姐想让我告白～天才们的恋爱头脑战～ 2",
   "Kaguya-sama wa Kokurasetai?: Tensai-tachi no Renai Zunousen",
   "Kaguya-sama: Cuộc Chiến Tỏ Tình (Phần 2)"
  ]
 },
 {
  "id": 21311,
  "name": "Bungou Stray Dogs",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21311-hAXyT8Yoh6G9.jpg",
  "year": 2016,
  "al": [
   "Bungo Stray Dogs",
   "BSD",
   "Văn hào lưu lạc"
  ]
 },
 {
  "id": 18679,
  "name": "Kill la Kill",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b18679-lbkq7iYESoFW.png",
  "year": 2013,
  "al": [
   "Kiru Ra Kiru",
   "KLK"
  ]
 },
 {
  "id": 171627,
  "name": "Chainsaw Man: Reze-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx171627-ZN9D7P46yHnw.png",
  "year": 2025,
  "al": [
   "Chainsaw Man – The Movie: Reze Arc",
   "CSM: Reze-hen",
   "CSM – The Movie: Reze Arc",
   "Chainsaw Man – O Filme: Arco da Reze",
   "Chainsaw Man - La película: El arco de Reze",
   "Chainsaw Man - Il Film: La Storia di Reze"
  ]
 },
 {
  "id": 120120,
  "name": "Tokyo Revengers",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx120120-cWDmnmeEntSe.jpg",
  "year": 2021,
  "al": [
   "Răzbunătorii din Tokio"
  ]
 },
 {
  "id": 4181,
  "name": "CLANNAD: After Story",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx4181-zUKE7BZC62OF.png",
  "year": 2008
 },
 {
  "id": 142329,
  "name": "Kimetsu no Yaiba: Yuukaku-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx142329-kET1PIXJv2eW.jpg",
  "year": 2022,
  "al": [
   "Demon Slayer: Kimetsu no Yaiba Entertainment District Arc",
   "KnY 2",
   "Demon Slayer: Kimetsu no Yaiba - Le quartier des plaisirs",
   "ดาบพิฆาตอสูร ภาค 2 บทย่านเริงรมย์",
   "Miecz zabójcy demonów – Kimetsu no Yaiba: Dzielnica uciech"
  ]
 },
 {
  "id": 918,
  "name": "Gintama",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx918-iOaeBVUn4uK7.jpg",
  "year": 2006,
  "al": [
   "Gin Tama",
   "Silver Soul"
  ]
 },
 {
  "id": 437,
  "name": "PERFECT BLUE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx437-69NMlXKFeuse.jpg",
  "year": 1998
 },
 {
  "id": 101347,
  "name": "Dororo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101347-TGaDwEYqLfm1.jpg",
  "year": 2019
 },
 {
  "id": 205,
  "name": "Samurai Champloo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx205-7tHVFu6dPBm9.png",
  "year": 2004
 },
 {
  "id": 98460,
  "name": "DEVILMAN crybaby",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx98460-bLtH2c3jd6sV.png",
  "year": 2018
 },
 {
  "id": 877,
  "name": "NANA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx877-6BUYEWp8By8j.png",
  "year": 2006
 },
 {
  "id": 20613,
  "name": "Akame ga Kill!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20613-HXHpec4bemk5.jpg",
  "year": 2014,
  "al": [
   "Akame ga Kiru!",
   "Red Eyes Sword"
  ]
 },
 {
  "id": 130298,
  "name": "Kage no Jitsuryokusha ni Naritakute!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx130298-YMdcKHytpWNH.jpg",
  "year": 2022,
  "al": [
   "The Eminence in Shadow",
   "To Be a Power in the Shadows!",
   "Un giorno sarò l'eminenza grigia",
   "TEIS"
  ]
 },
 {
  "id": 98659,
  "name": "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx98659-WNyPLIZDpGGY.jpg",
  "year": 2017,
  "al": [
   "Classroom of the Elite",
   "Youjitsu",
   "You-Zitsu",
   "Cote",
   "Chào mừng đến với lớp học đề cao thực lực",
   "Chào mừng tới lớp học biết tuốt"
  ]
 },
 {
  "id": 20931,
  "name": "Death Parade",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx20931-bktYqOcxPERi.jpg",
  "year": 2015
 },
 {
  "id": 3588,
  "name": "Soul Eater",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx3588-fSMggQoFSbUI.png",
  "year": 2008
 },
 {
  "id": 339,
  "name": "serial experiments lain",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx339-xF2wp1NQuQ4r.png",
  "year": 1998,
  "al": [
   "Wirtualna Lain"
  ]
 },
 {
  "id": 813,
  "name": "Dragon Ball Z",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx813-ZhnFNOeCU5dQ.png",
  "year": 1989,
  "al": [
   "DBZ",
   "Dragonball Z",
   "What's My Destiny Dragon Ball",
   "ดราก้อนบอล Z",
   "Bảy Viên Ngọc Rồng Z"
  ]
 },
 {
  "id": 20997,
  "name": "Charlotte",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20997-axVYrsIfjtYJ.jpg",
  "year": 2015
 },
 {
  "id": 105334,
  "name": "Fruits Basket: 1st Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx105334-AZwEdMu4KFtV.jpg",
  "year": 2019,
  "al": [
   "Fruits Basket (2019)",
   "Fruits Basket (Zenpen)",
   "Furuba",
   "Fruba",
   "水果篮子（2019）"
  ]
 },
 {
  "id": 125367,
  "name": "Kaguya-sama wa Kokurasetai: Ultra Romantic",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx125367-1yuq9NFcQuLI.png",
  "year": 2022,
  "al": [
   "Kaguya-sama: Love is War -Ultra Romantic-",
   "Kaguya-sama: Love is War Season 3",
   "辉夜大小姐想让我告白～天才们的恋爱头脑战～ 3",
   "Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen 3",
   "Kaguya-sama wa Kokurasetai 3rd Season",
   "Kaguya-sama: Cuộc Chiến Tỏ Tình - Ultra Romantic",
   "Nona Kaguya Ingin Ditembak: Ultra Romantic"
  ]
 },
 {
  "id": 131681,
  "name": "Shingeki no Kyojin: The Final Season Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx131681-5ooUqvqNtee1.jpg",
  "year": 2022,
  "al": [
   "Attack on Titan Final Season Part 2",
   "SnK 4",
   "AoT 4",
   "L'attaque des titans Saison Finale Partie 2",
   "Shingeki no Kyojin: The Final Season (2022)",
   "حمله به تایتان فصل 4 ",
   " ผ่าพิภพไททัน ไฟนอล ซีซั่น Part 2",
   "L'Attacco dei Giganti 4 Parte 2",
   "Атака титанов: Финал. Часть 2"
  ]
 },
 {
  "id": 853,
  "name": "Ouran Koukou Host Club",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx853-fiUtW8yohsSF.jpg",
  "year": 2006,
  "al": [
   "Ouran High School Host Club",
   "Ohran Koko Host Club",
   "Ouran Koukou Hosutobu",
   "Host Club - Amore in affitto",
   "Hostclub ở trường Ouran"
  ]
 },
 {
  "id": 6547,
  "name": "Angel Beats!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx6547-SYexAn5aFyss.png",
  "year": 2010
 },
 {
  "id": 136430,
  "name": "VINLAND SAGA SEASON 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx136430-gsBsJjA7hGh9.jpg",
  "year": 2023,
  "al": [
   "Сага о Винланде 2"
  ]
 },
 {
  "id": 164,
  "name": "Mononoke-hime",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx164-ySuGzCWVw2cL.jpg",
  "year": 1997,
  "al": [
   "Princess Mononoke",
   "La Princesa Mononoke",
   "Księżniczka Mononoke",
   "Principessa Mononoke",
   "Prenses Mononoke",
   "Princesse Mononoké",
   "Princesa Mononoke",
   "A Princesa Mononoke",
   "Prinzessin Mononoke",
   "Prinsessan Mononoke",
   "Prinsesse Mononoke",
   "Mononoke Prinsessa"
  ]
 },
 {
  "id": 6702,
  "name": "FAIRY TAIL",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b6702-KI4qgSMyI8Pm.png",
  "year": 2009
 },
 {
  "id": 112151,
  "name": "Kimetsu no Yaiba: Mugen Ressha-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx112151-1qlQwPB1RrJe.png",
  "year": 2020,
  "al": [
   "Demon Slayer -Kimetsu no Yaiba- The Movie: Mugen Train",
   "KnY Movie",
   "Els Guardians de la Nit: El Tren Infinit",
   "Guardianes de la Noche: Tren Infinito",
   "Demon Slayer: Mugen Treni",
   "Demon Slayer: Il Treno Mugen",
   "Demon Slayer: Kimetsu no Yaiba - Le film : Le train de l'Infini",
   "ΚΥΝΗΓΟΣ ΔΑΙΜΟΝΩΝ: KIMETSU NO YAIBA – Η ΤΑΙΝΙΑ: ΤΟ ΤΡΕΝΟ ΜΟΥΓΚΕΝ"
  ]
 },
 {
  "id": 20832,
  "name": "Overlord",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20832-vUNm5zrYWifc.jpg",
  "year": 2015,
  "al": [
   "Over Lord"
  ]
 },
 {
  "id": 13601,
  "name": "PSYCHO-PASS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx13601-i42VFuHpqEOJ.jpg",
  "year": 2012
 },
 {
  "id": 21698,
  "name": "Haikyuu!!: Karasuno Koukou VS Shiratorizawa Gakuen Koukou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21698-RL71mr1YU5Io.png",
  "year": 2016,
  "al": [
   "HAIKYU!! 3rd Season",
   "Haikyu!! Karasuno High vs Shiratorizawa Academy",
   "Haikyuu!! 3",
   "ไฮคิว!! คู่ตบฟ้าประทาน ภาค 3"
  ]
 },
 {
  "id": 108430,
  "name": "Given",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx108430-UdruJPro4vDK.jpg",
  "year": 2019
 },
 {
  "id": 20474,
  "name": "JoJo no Kimyou na Bouken: Stardust Crusaders",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20474-xuqem5GBlBtb.jpg",
  "year": 2014,
  "al": [
   "JoJo's Bizarre Adventure: Stardust Crusaders",
   "Dai San Bu Kujo Jotaro: Mirai e no Isan",
   "JoJo no Kimyou na Bouken Part 3: Stardust Crusaders",
   "JoJo's Bizarre Adventure Part 3: Stardust Crusaders",
   "Le bizzarre avventure di JoJo: Stardust Crusaders"
  ]
 },
 {
  "id": 14813,
  "name": "Yahari Ore no Seishun Love Come wa Machigatteiru.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx14813-3mNvcKNEQcDs.jpg",
  "year": 2013,
  "al": [
   "My Teen Romantic Comedy SNAFU",
   "Oregairu",
   "My youth romantic comedy is wrong as I expected."
  ]
 },
 {
  "id": 227,
  "name": "FLCL",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx227-qOB9ZhVvNnqO.jpg",
  "year": 2000,
  "al": [
   "Fooly Cooly",
   "Furi Kuri"
  ]
 },
 {
  "id": 153518,
  "name": "Dungeon Meshi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153518-IVXPDY5ph3kO.jpg",
  "year": 2024,
  "al": [
   "Delicious in Dungeon",
   "Dungeon Food",
   "Dungeon Meal",
   "Tragones y Mazmorras",
   "Gloutons et Dragons",
   "Mỹ vị hầm ngục",
   "Dunmeshi",
   "Labužníci v kobce"
  ]
 },
 {
  "id": 20992,
  "name": "Haikyuu!! 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20992-aHgNbcalVEqk.png",
  "year": 2015,
  "al": [
   "HAIKYU!! 2nd Season",
   "ไฮคิว!! คู่ตบฟ้าประทาน ภาค 2"
  ]
 },
 {
  "id": 176496,
  "name": "Ore dake Level Up na Ken: Season 2 - Arise from the Shadow",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx176496-9BDMjAZGEbq4.png",
  "year": 2025,
  "al": [
   "Solo Leveling Season 2 -Arise from the Shadow-",
   "Na Honjaman Level Up 2",
   "나 혼자만 레벨업 2",
   "Ore dake Level Up na Ken 2nd Season",
   "Solo Leveling 2ª Temporada -Ergam-se das Sombras-",
   "나 혼자만 레벨업 -ARISE FROM THE SHADOW-"
  ]
 },
 {
  "id": 105310,
  "name": "Enen no Shouboutai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx105310-2PKUvoaA6fTn.jpg",
  "year": 2019,
  "al": [
   "Fire Force"
  ]
 },
 {
  "id": 106286,
  "name": "Tenki no Ko",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx106286-5COcpd0J9VbL.png",
  "year": 2019,
  "al": [
   "Weathering With You",
   "El Tiempo Contigo",
   "Weathering With You - Das Mädchen, das die Sonne berührte",
   "Les enfants du temps",
   "O Tempo Com Você",
   "La ragazza del tempo"
  ]
 },
 {
  "id": 12189,
  "name": "Hyouka",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx12189-zj5AWUYO53Fv.jpg",
  "year": 2012,
  "al": [
   "Hyouka: Forbidden Secrets"
  ]
 },
 {
  "id": 131586,
  "name": "86: Eighty Six Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx131586-JhC0wcBi09EZ.jpg",
  "year": 2021,
  "al": [
   "86－エイティシックス－ 2クール"
  ]
 },
 {
  "id": 21856,
  "name": "Boku no Hero Academia 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21856-gutauxhWAwn6.png",
  "year": 2017,
  "al": [
   "My Hero Academia Season 2",
   "BNHA 2",
   "MHA 2",
   "나의 히어로 아카데미아 2기"
  ]
 },
 {
  "id": 127720,
  "name": "Mushoku Tensei: Isekai Ittara Honki Dasu Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx127720-ADJgIrUVMdU9.jpg",
  "year": 2021,
  "al": [
   "Mushoku Tensei: Jobless Reincarnation Cour 2",
   "Mushoku Tensei: Jobless Reincarnation Part 2",
   "เกิดชาตินี้พี่ต้องเทพ พาร์ท 2"
  ]
 },
 {
  "id": 137822,
  "name": "Blue Lock",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx137822-U8naszP96vzC.png",
  "year": 2022
 },
 {
  "id": 5680,
  "name": "K-ON!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx5680-r3AI3Cwfv0Aq.png",
  "year": 2009,
  "al": [
   "Keion"
  ]
 },
 {
  "id": 10087,
  "name": "Fate/Zero",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx10087-M4Hd9qrHGrXk.png",
  "year": 2011,
  "al": [
   "F/Z"
  ]
 },
 {
  "id": 108632,
  "name": "Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx108632-lQWnmw7XaNOK.jpg",
  "year": 2020,
  "al": [
   "Re:ZERO -Starting Life in Another World- Season 2",
   "Re:Zero kara Hajimeru Isekai Seikatsu (2020)",
   "Re: 제로부터 시작하는 이세계 생활 2기",
   "Re:从零开始的异世界生活第二季（上半）",
   "Re:Zero รีเซทชีวิต ฝ่าวิกฤตต่างโลก ภาค 2",
   "Re:Zero — жизнь с нуля в другом мире. Второй сезон"
  ]
 },
 {
  "id": 100922,
  "name": "Grand Blue",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx100922-uxEhaCsqMMp3.png",
  "year": 2018,
  "al": [
   "Grand Blue Dreaming"
  ]
 },
 {
  "id": 9989,
  "name": "Ano Hi Mita Hana no Namae wo Bokutachi wa Mada Shiranai.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx9989-hImMg6kCMm6I.jpg",
  "year": 2011,
  "al": [
   "Anohana: The Flower We Saw That Day",
   "AnoHana",
   "We Still Don't Know the Name of the Flower We Saw That Day.",
   "AnoHana: ancora non conosciamo il nome del fiore che abbiamo visto quel giorno",
   "Đóa hoa đã thấy ngày ấy chúng mình vẫn chưa biết tên"
  ]
 },
 {
  "id": 20799,
  "name": "JoJo no Kimyou na Bouken: Stardust Crusaders - Egypt-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20799-S1eyqBDlx51E.jpg",
  "year": 2015,
  "al": [
   "JoJo's Bizarre Adventure: Stardust Crusaders - Battle in Egypt",
   "Dai San Bu Kujo Jotaro: Mirai e no Isan",
   "JoJo's Bizarre Adventure: Stardust Crusaders 2nd Season",
   "JoJo no Kimyou na Bouken: Stardust Crusaders 2nd Season",
   "JoJo's Bizarre Adventure Part 3: Stardust Crusaders - Battle in Egypt",
   "JoJo no Kimyou na Bouken Part 3: Stardust Crusaders - Egypt-hen",
   "JoJo's Bizarre Adventure: Stardust Crusaders - Egypt Arc",
   "Le bizzarre avventure di JoJo: Stardust Crusaders"
  ]
 },
 {
  "id": 100166,
  "name": "Boku no Hero Academia 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx100166-jUCZYbzn2XLw.jpg",
  "year": 2018,
  "al": [
   "My Hero Academia Season 3",
   "BNHA 3",
   "MHA 3",
   "我的英雄学院 3"
  ]
 },
 {
  "id": 21170,
  "name": "Ansatsu Kyoushitsu 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21170-kbcfTTZGSaFt.jpg",
  "year": 2016,
  "al": [
   "Assassination Classroom Second Season",
   "فصل الاغتيال 2",
   "Klasa skrytobójców 2",
   "Assassination Classroom Season 2"
  ]
 },
 {
  "id": 131573,
  "name": "Jujutsu Kaisen 0",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx131573-rpl82vDEDRm6.jpg",
  "year": 2021,
  "al": [
   "JJK 0",
   "咒术回战0",
   "Jujutsu Kaisen Movie"
  ]
 },
 {
  "id": 10165,
  "name": "Nichijou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx10165-tw8Cz7K9tfVJ.png",
  "year": 2011,
  "al": [
   "Nichijou - My Ordinary Life",
   "Everyday"
  ]
 },
 {
  "id": 99578,
  "name": "Wotaku ni Koi wa Muzukashii",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx99578-oO5KChtfhzln.png",
  "year": 2018,
  "al": [
   "Wotakoi: Love is Hard for Otaku",
   "Otaku ni Koi wa Muzukashii",
   "WotaKoi",
   "It’s Difficult to Love an Otaku",
   "Love is Hard for an Otaku",
   "Love is Hard for Nerds",
   "Wotakoi: Keine Cheats für die Liebe",
   "Wotakoi: O Amor é Difícil para Otaku",
   "Wotakoi: El Amor es Duro para los Otakus"
  ]
 },
 {
  "id": 104276,
  "name": "Boku no Hero Academia 4",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx104276-SnEowMvesWIE.png",
  "year": 2019,
  "al": [
   "My Hero Academia Season 4",
   "BNHA 4",
   "MHA 4",
   "我的英雄学院 4"
  ]
 },
 {
  "id": 103572,
  "name": "Go-toubun no Hanayome",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx103572-cchriAdH95cQ.png",
  "year": 2019,
  "al": [
   "The Quintessential Quintuplets",
   "5-toubun no Hanayome",
   "The Five Wedded Brides",
   "Eşsiz Beşizler",
   "Sposób na pięcioraczki",
   "Las Quintillizas"
  ]
 },
 {
  "id": 124153,
  "name": "SK∞",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx124153-uEBI764OSavB.png",
  "year": 2021,
  "al": [
   "SK8 the Infinity",
   "SK Eight",
   "Hội Thanh Niên Lướt Ván SK∞",
   "Ski Tak Terbatas SK∞"
  ]
 },
 {
  "id": 124194,
  "name": "Fruits Basket: The Final",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx124194-TJlqMMR7BGn9.jpg",
  "year": 2021,
  "al": [
   "Fruits Basket The Final Season",
   "Furuba",
   "Fruba",
   "Fruits Basket Season 3",
   "เสน่ห์สาวข้าวปั้น ภาค 3"
  ]
 },
 {
  "id": 20789,
  "name": "Nanatsu no Taizai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20789-Ma5ouSYPkru9.jpg",
  "year": 2014,
  "al": [
   "The Seven Deadly Sins",
   "ศึกตำนาน 7 อัศวิน",
   "7DS"
  ]
 },
 {
  "id": 20923,
  "name": "Shokugeki no Souma",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20923-pNT38pjW3RFH.jpg",
  "year": 2015,
  "al": [
   "Food Wars!",
   "Food Wars! The First Plate"
  ]
 },
 {
  "id": 140439,
  "name": "Mob Psycho 100 III",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx140439-bPKmhe1wNxc9.jpg",
  "year": 2022,
  "al": [
   "モブサイコ100 III",
   "ม็อบไซโค 100 คนพลังจิต ภาค 3"
  ]
 },
 {
  "id": 128893,
  "name": "Jigokuraku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx128893-Gc2t8b8M0mVu.jpg",
  "year": 2023,
  "al": [
   "Hell’s Paradise",
   "Hell’s Paradise: Jigokuraku"
  ]
 },
 {
  "id": 33,
  "name": "Kenpuu Denki Berserk",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx33-PSwfE5B0gejI.jpg",
  "year": 1997,
  "al": [
   "Berserk",
   "Kenfu Denki Berserk",
   "Sword-Wind Chronicle Berserk",
   "Berserk (1997)"
  ]
 },
 {
  "id": 116674,
  "name": "BLEACH: Sennen Kessen-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx116674-p3zK4PUX2Aag.jpg",
  "year": 2022,
  "al": [
   "BLEACH: Thousand-Year Blood War",
   "Bleach: La guerre sanglante de mille ans",
   "BLEACH TYBW"
  ]
 },
 {
  "id": 181444,
  "name": "Kaoru Hana wa Rin to Saku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx181444-Ut9DDUZdfHwg.jpg",
  "year": 2025,
  "al": [
   "The Fragrant Flower Blooms With Dignity",
   "Kaoru i Rin: Rozkwitając z tobą",
   "BLOOM",
   "La nobleza de las flores",
   "Kaoru und Rin",
   "Güzel Kokulu Çiçekler Zarafetle Açar"
  ]
 },
 {
  "id": 17074,
  "name": "Monogatari Series: Second Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx17074-xMhVAZsEDH66.png",
  "year": 2013,
  "al": [
   "Nekomonogatari White",
   "Kabukimonogatari",
   "Otorimonogatari",
   "Onimonogatari",
   "Koimonogatari"
  ]
 },
 {
  "id": 21709,
  "name": "Yuuri!!! on ICE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21709-aqPBDxJPruYR.png",
  "year": 2016,
  "al": [
   "Yuri!!! on ICE"
  ]
 },
 {
  "id": 21776,
  "name": "Kobayashi-san Chi no Maidragon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21776-bwPaYKhnKfUs.png",
  "year": 2017,
  "al": [
   "Miss Kobayashi's Dragon Maid",
   "Kobayashi-san Chi no Maid Dragon"
  ]
 },
 {
  "id": 126403,
  "name": "Shiguang Dailiren",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx126403-BfVSRzWUtVFW.png",
  "year": null,
  "al": [
   "Link Click",
   "Time Agent",
   "CLICK"
  ]
 },
 {
  "id": 119661,
  "name": "Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx119661-GDbUZxrZMz01.png",
  "year": 2021,
  "al": [
   "Re:ZERO -Starting Life in Another World- Season 2 Part 2",
   "Re:Zero kara Hajimeru Isekai Seikatsu (2021)",
   "Re: 제로부터 시작하는 이세계 생활 2기 파트 2",
   "Re:从零开始的异世界生活第二季（下半）",
   "Re:从零开始的异世界生活 2 下半",
   "Re:Zero รีเซทชีวิต ฝ่าวิกฤตต่างโลก ภาค 2 พาร์ท 2",
   "Re:Zero — жизнь с нуля в другом мире. Второй сезон"
  ]
 },
 {
  "id": 1210,
  "name": "NHK ni Youkoso!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1210-2XotjcgqdcaX.jpg",
  "year": 2006,
  "al": [
   "Welcome to the N-H-K",
   "Welcome to the NHK",
   "欢迎加入NHK！",
   "Bienvenue dans la NHK"
  ]
 },
 {
  "id": 108511,
  "name": "Tensei Shitara Slime Datta Ken 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx108511-PufFordLNyIb.jpg",
  "year": 2021,
  "al": [
   "That Time I Got Reincarnated as a Slime Season 2",
   "転スラ2",
   "TenSura 2",
   "Moi, quand je me réincarne en Slime Saison 2",
   "Meine Wiedergeburt als Schleim in einer anderen Welt Staffel 2"
  ]
 },
 {
  "id": 141391,
  "name": "Yofukashi no Uta",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx141391-M3ZgUKTPENUk.jpg",
  "year": 2022,
  "al": [
   "Call of the Night",
   "Song of the Night Walkers",
   "Night Owl Song",
   "Zew nocy",
   "Il richiamo della notte",
   "El canto de la noche",
   "Canções da Noite"
  ]
 },
 {
  "id": 108463,
  "name": "Jibaku Shounen Hanako-kun",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx108463-u03vrYnyB3L9.jpg",
  "year": 2020,
  "al": [
   "Toilet-bound Hanako-kun",
   "Hanako-kun e os Mistérios do Colégio Kamone"
  ]
 },
 {
  "id": 14741,
  "name": "Chuunibyou demo Koi ga Shitai!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx14741-CGXEIeUe2roA.jpg",
  "year": 2012,
  "al": [
   "Love, Chunibyo & Other Delusions",
   "Chu-2 Byo demo Koi ga Shitai!",
   "Regardless of My Adolescent Delusions of Grandeur, I Want a Date!",
   "Miłość, gimbaza i kosmiczna faza"
  ]
 },
 {
  "id": 104157,
  "name": "Seishun Buta Yarou wa Yumemiru Shoujo no Yume wo Minai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx104157-rk99XI56PaIC.jpg",
  "year": 2019,
  "al": [
   "Rascal Does Not Dream of a Dreaming Girl",
   "Ao Buta "
  ]
 },
 {
  "id": 147105,
  "name": "Tongari Boushi no Atelier",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx147105-rwOX8qyUy8gV.jpg",
  "year": 2026,
  "al": [
   "Witch Hat Atelier",
   "Atelier of Witch Hat",
   "Atelier spiczastych kapeluszy",
   "Cadı Şapkası Atölyesi",
   "L'Atelier des Sorciers",
   "Xưởng Phép Thuật"
  ]
 },
 {
  "id": 114535,
  "name": "Fumetsu no Anata e",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx114535-y3NnjexcqKG1.jpg",
  "year": 2021,
  "al": [
   "To Your Eternity",
   "To You, the Immortal",
   "Uma vida imortal",
   "A te, l'immortale",
   "Ku twej wieczności",
   "Untukmu yang Abadi",
   "Gửi em, người bất tử"
  ]
 },
 {
  "id": 20661,
  "name": "Zankyou no Terror",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20661-aCR7QgzDfOSI.png",
  "year": 2014,
  "al": [
   "Terror in Resonance",
   "Terror in Tokyo",
   "Zagadkowi terroryści"
  ]
 },
 {
  "id": 178025,
  "name": "Gachiakuta",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx178025-cWJKEsZynkil.jpg",
  "year": 2025
 },
 {
  "id": 7054,
  "name": "Kaichou wa Maid-sama!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx7054-GW4D7VAZG19W.png",
  "year": 2010,
  "al": [
   "Maid-Sama!",
   "Kaicho wa Maidsama",
   "Kaichou wa Meido Sama",
   "Class President is a Maid!"
  ]
 },
 {
  "id": 10620,
  "name": "Mirai Nikki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx10620-dUZeNej0W4QN.png",
  "year": 2011,
  "al": [
   "The Future Diary"
  ]
 },
 {
  "id": 176301,
  "name": "Kusuriya no Hitorigoto 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx176301-TIGmldLffQGX.jpg",
  "year": 2025,
  "al": [
   "The Apothecary Diaries Season 2",
   "Die Tagebücher der Apothekerin Season 2",
   "Diários de uma Apotecária 2ª Temporada",
   "Монолог фармацевта 2",
   "Les Carnets de l'apothicaire Saison 2",
   "Los diarios de la boticaria temporada 2",
   "Dược sư tự sự"
  ]
 },
 {
  "id": 11741,
  "name": "Fate/Zero 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11741-oEy1fJHYm2zJ.jpg",
  "year": 2012,
  "al": [
   "Fate/Zero Season 2",
   "フェイト/ゼロ 2ndシーズン",
   "F/Z",
   "Судьба/Начало 2"
  ]
 },
 {
  "id": 113717,
  "name": "Ousama Ranking",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113717-9sNnN8WRgK15.jpg",
  "year": 2021,
  "al": [
   "Ranking of Kings",
   "King Ranking"
  ]
 },
 {
  "id": 20920,
  "name": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20920-MTREwZOG4BAD.jpg",
  "year": 2015,
  "al": [
   "Is It Wrong to Try to Pick Up Girls in a Dungeon?",
   "Danmachi",
   "Dungeon ni Deai o Motomeru no wa Machigatte Iru Darouka: Familia Myth",
   "DanMachi: É Errado Tentar Pegar Garotas numa Masmorra?",
   "DanMachi: Família Myth",
   "Danmachi: ¿Qué Tiene de Malo Intentar Ligar en una Mazmorra?",
   "DanMachi - È sbagliato cercare di incontrare ragazze in un Dungeon?"
  ]
 },
 {
  "id": 20607,
  "name": "Ping Pong THE ANIMATION",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20607-fIOxVISIl0HY.jpg",
  "year": 2014
 },
 {
  "id": 98478,
  "name": "3-gatsu no Lion 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx98478-Yua5iL9zbrji.jpg",
  "year": 2017,
  "al": [
   "March comes in like a lion Season 2",
   "Sangatsu no Lion 2",
   "מרץ מגיע כאריה 2"
  ]
 },
 {
  "id": 98314,
  "name": "Kakegurui",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b98314-TSJykxVwCCQN.jpg",
  "year": 2017,
  "al": [
   "Kakegurui - Compulsive Gambler",
   "Kakegurui: Das Leben ist ein Spiel",
   "Gambling School"
  ]
 },
 {
  "id": 98707,
  "name": "Houseki no Kuni",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx98707-25nUKb4XUFgY.png",
  "year": 2017,
  "al": [
   "Land of the Lustrous",
   "L'Ère des Cristaux",
   "Das Land der Juwelen",
   "Vương Quốc Bảo Thạch"
  ]
 },
 {
  "id": 21613,
  "name": "Youjo Senki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21613-qT3NiwYP5dYc.png",
  "year": 2017,
  "al": [
   "Saga of Tanya the Evil"
  ]
 },
 {
  "id": 21699,
  "name": "Kono Subarashii Sekai ni Shukufuku wo! 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21699-Fkbnkl9ZC6fW.png",
  "year": 2017,
  "al": [
   "KONOSUBA -God's blessing on this wonderful world! 2",
   "Konosuba 2",
   "Konosuba! - As Bençãos de Deus Neste Mundo Maravilhoso 2!",
   "为美好的世界献上祝福！2",
   "Konosuba : Une explosion dans ce monde merveilleux !",
   "Konosuba! Un mundo maravilloso 2"
  ]
 },
 {
  "id": 14713,
  "name": "Kamisama Hajimemashita",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx14713-RyZ7bA7CdvGw.jpg",
  "year": 2012,
  "al": [
   "Kamisama Kiss",
   "Kami-sama Hajimemashita",
   "Kami-sama Kiss",
   "Soy Una Diosa ¿Y ahora qué?",
   "The Girl In The World Of Spirit",
   "Jak zostałam bóstwem!?"
  ]
 },
 {
  "id": 108489,
  "name": "Yahari Ore no Seishun Love Come wa Machigatteiru. Kan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx108489-yGmYCE6dhFta.png",
  "year": 2020,
  "al": [
   "My Teen Romantic Comedy SNAFU Climax!",
   "Oregairu 3",
   "俺ガイル3",
   "Oregairu Kan"
  ]
 },
 {
  "id": 145139,
  "name": "Kimetsu no Yaiba: Katanakaji no Sato-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx145139-rRimpHGWLhym.png",
  "year": 2023,
  "al": [
   "Demon Slayer: Kimetsu no Yaiba Swordsmith Village Arc",
   "KnY 3",
   "ดาบพิฆาตอสูร ภาค 3 บทหมู่บ้านช่างตีดาบ",
   "Demon Slayer: Kimetsu no Yaiba - Le village des forgerons",
   "Истребитель демонов: Kimetsu no Yaiba. Деревня кузнецов",
   "Miecz zabójcy demonów – Kimetsu no Yaiba: Wioska płatnerzy"
  ]
 },
 {
  "id": 143270,
  "name": "Lycoris Recoil",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx143270-rfkyiYXhek5w.jpg",
  "year": 2022,
  "al": [
   "LycoReco"
  ]
 },
 {
  "id": 7785,
  "name": "Yojouhan Shinwa Taikei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx7785-aTjIhsYva8cJ.jpg",
  "year": 2010,
  "al": [
   "The Tatami Galaxy",
   "Yojo-Han Shinwa Taikei",
   "Yojou-Han Shinwa Taikei",
   "Yojohan Shinwa Taikei",
   "4½ Tatami Mythological Chronicles"
  ]
 },
 {
  "id": 153288,
  "name": "Kaijuu 8-gou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153288-25FBfFJzEQ5O.jpg",
  "year": 2024,
  "al": [
   "Kaiju No. 8",
   "Monster #8",
   "8Kaijuu",
   "KAIJU No. EIGHT",
   "Kaiju N°8",
   "괴수 8호"
  ]
 },
 {
  "id": 172463,
  "name": "Jujutsu Kaisen: Shimetsu Kaiyuu - Zenpen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx172463-LnXqHzt74SJL.jpg",
  "year": 2026,
  "al": [
   "JUJUTSU KAISEN Season 3: The Culling Game Part 1",
   "Jujutsu Kaisen 3rd Season",
   "呪術廻戦 第3期",
   "JJK3",
   "มหาเวทย์ผนึกมาร จรดลล้างบาง พาร์ต 1"
  ]
 },
 {
  "id": 129201,
  "name": "Summer Time Render",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx129201-HJBauga2be8I.png",
  "year": 2022,
  "al": [
   "Summer Time Rendering",
   "Summertime Render",
   "A Ilha das Sombras",
   "La Isla de las Sombras",
   "Tajemnica wyspy ",
   "Bright Sun – Dark Shadows"
  ]
 },
 {
  "id": 99426,
  "name": "Sora yori mo Tooi Basho",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99426-ti5BL69Ip3kZ.png",
  "year": 2018,
  "al": [
   "A Place Further Than the Universe",
   "Uchuu Yorimo Toui Basho",
   "Sora yorimo Tooi Basho",
   "Uchuu yori mo Tooi Basho",
   "Yorimoi"
  ]
 },
 {
  "id": 223,
  "name": "Dragon Ball",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx223-scE5uJfXqqj8.png",
  "year": 1986,
  "al": [
   "Dragonball",
   "Bola de Drac",
   "Bảy Viên Ngọc Rồng",
   "DB"
  ]
 },
 {
  "id": 392,
  "name": "Yuu☆Yuu☆Hakusho",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx392-z90299zIvYmx.png",
  "year": 1992,
  "al": [
   "Yu Yu Hakusho: Ghostfiles",
   "Yu Yu Hakusho",
   "Ghost Fighter",
   "Poltergeist Report",
   "YYH",
   "Yu degli spettri"
  ]
 },
 {
  "id": 110349,
  "name": "GREAT PRETENDER",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx110349-59hhZ9CNHVdk.png",
  "year": 2020,
  "al": [
   "El timador timado",
   "EL GRAN FARSANTE",
   "GrePre"
  ]
 },
 {
  "id": 13759,
  "name": "Sakurasou no Pet na Kanojo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx13759-xNf0gJK4Axt2.jpg",
  "year": 2012,
  "al": [
   "The Pet Girl of Sakurasou",
   "Sakura-sou no Pet na Kanojo"
  ]
 },
 {
  "id": 11771,
  "name": "Kuroko no Basket",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11771-uvr44RAwRxPw.jpg",
  "year": 2012,
  "al": [
   "Kuroko's Basketball",
   "Kuroko no Basuke",
   "The Basketball Which Kuroko Plays"
  ]
 },
 {
  "id": 889,
  "name": "BLACK LAGOON",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx889-4S7N2ciq2cwA.png",
  "year": 2006
 },
 {
  "id": 20698,
  "name": "Yahari Ore no Seishun Love Come wa Machigatteiru. Zoku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20698-YZIYor2zW3Ta.png",
  "year": 2015,
  "al": [
   "My Teen Romantic Comedy SNAFU TOO!",
   "Oregairu Zoku",
   "Oregairu 2",
   "俺ガイル2"
  ]
 },
 {
  "id": 263,
  "name": "Hajime no Ippo: THE FIGHTING!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx263-ivVyn9xAgwSZ.png",
  "year": 2000,
  "al": [
   "The First Step",
   "Fighting Spirit",
   "Espíritu de lucha",
   "Hajime no Ippo: A Luta!"
  ]
 },
 {
  "id": 245,
  "name": "GTO",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx245-NcQAyTipUMeO.jpg",
  "year": 1999,
  "al": [
   "GTO: Great Teacher Onizuka",
   "GTO - The Animation"
  ]
 },
 {
  "id": 9919,
  "name": "Ao no Exorcist",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx9919-nXS7JOZrWHfS.jpg",
  "year": 2011,
  "al": [
   "Blue Exorcist",
   "Ao no Futsumashi"
  ]
 },
 {
  "id": 19603,
  "name": "Fate/stay night: Unlimited Blade Works",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx19603-ycT0pyEgDVQu.jpg",
  "year": 2014,
  "al": [
   "フェイト/ステイナイト Unlimited Blade Works",
   "Fate/UBW"
  ]
 },
 {
  "id": 6746,
  "name": "Durarara!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx6746-3LTwM95Uqeoa.png",
  "year": 2010,
  "al": [
   "DRRR!!"
  ]
 },
 {
  "id": 47,
  "name": "AKIRA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx47-4CR68arv452h.jpg",
  "year": 1988
 },
 {
  "id": 6045,
  "name": "Kimi ni Todoke",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx6045-JujXjoWtslUM.jpg",
  "year": 2009,
  "al": [
   "Kimi ni Todoke: From Me to You",
   "Reaching You",
   "Arrivare a te",
   "Llegando a ti",
   "Kimi ni Todoke: Que Chegue a Você"
  ]
 },
 {
  "id": 133965,
  "name": "Komi-san wa, Komyushou desu.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx133965-9TZBS4m4yvED.png",
  "year": 2021,
  "al": [
   "Komi Can’t Communicate",
   "Comi san ha Comyusho desu",
   "Komi-san wa, Comyushou desu.",
   "Komi cherche ses mots",
   "Komi không thể giao tiếp",
   "Komi-san no puede comunicarse"
  ]
 },
 {
  "id": 523,
  "name": "Tonari no Totoro",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx523-fErBvxOHP7IX.jpg",
  "year": 1988,
  "al": [
   "My Neighbor Totoro",
   "My Neighbour Totoro",
   "Meu Amigo Totoro",
   "Mi Vecino Totoro",
   "Komşum Totoro",
   "Mój sąsiad Totoro",
   "Il mio vicino Totoro",
   "Vecinul Totoro",
   "Mon voisin Totoro",
   "Mein Nachbar Totoro",
   "Totoro - A varázserdő titka",
   "Min nabo Totoro",
   "Min granne Totoro",
   "Magiska äventyr med Totoro",
   "Naapurini Totoro",
   "Nágranninn minn Totoro"
  ]
 },
 {
  "id": 20770,
  "name": "Akatsuki no Yona",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20770-brCDvhTXlums.png",
  "year": 2014,
  "al": [
   "Yona of the Dawn",
   "AkaYona",
   "Yona, princesse de l'aube"
  ]
 },
 {
  "id": 11111,
  "name": "Another",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11111-gvvE5bBYsyFo.png",
  "year": 2012
 },
 {
  "id": 20829,
  "name": "Owari no Seraph",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20829-pgsXVjrfyI5V.png",
  "year": 2015,
  "al": [
   "Seraph of the End: Vampire Reign",
   "OwaSera",
   "Seraph of the End: El Reino de los Vampiros"
  ]
 },
 {
  "id": 11617,
  "name": "High School DxD",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx11617-nmxMU9Zh3H5R.jpg",
  "year": 2012,
  "al": [
   "Highschool DxD"
  ]
 },
 {
  "id": 97668,
  "name": "One Punch Man 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx97668-nC8gQrXVxt7k.png",
  "year": 2019,
  "al": [
   "One-Punch Man Season 2",
   "OPM2",
   "Wanpanman 2",
   "วันพันช์แมน ภาคที่ 2",
   "One-Punch Man Phần 2",
   "Jagoan Sekali Pukul S2"
  ]
 },
 {
  "id": 21366,
  "name": "3-gatsu no Lion",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21366-0wrYK0kjKeFn.jpg",
  "year": 2016,
  "al": [
   "March comes in like a lion",
   "Sangatsu no Lion",
   "Un marzo da leoni"
  ]
 },
 {
  "id": 457,
  "name": "Mushishi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx457-l6cTtNgI9Bi6.png",
  "year": 2005,
  "al": [
   "MUSHI-SHI"
  ]
 },
 {
  "id": 109261,
  "name": "Go-toubun no Hanayome ∬",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx109261-65rKxMDlcU9r.png",
  "year": 2021,
  "al": [
   "The Quintessential Quintuplets 2",
   "5-toubun no Hanayome ∬",
   "Go-toubun no Hanayome 2nd Season",
   "The Five Wedded Brides 2nd Season",
   "เจ้าสาวผมเป็นแฝดห้า ภาค 2"
  ]
 },
 {
  "id": 182255,
  "name": "Sousou no Frieren 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx182255-butzrqd4I0aC.jpg",
  "year": 2026,
  "al": [
   "Frieren: Beyond Journey’s End Season 2",
   "Провожающая в последний путь Фрирен 2"
  ]
 },
 {
  "id": 116267,
  "name": "Tonikaku Kawaii",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx116267-Eo1biPBTlL4i.jpg",
  "year": 2020,
  "al": [
   "TONIKAWA: Over The Moon For You",
   "Fly Me to the Moon",
   "Tonikaku Cawaii",
   "Generally Cute"
  ]
 },
 {
  "id": 103047,
  "name": "Violet Evergarden Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx103047-odblDHHEdehK.jpg",
  "year": 2020,
  "al": [
   "Violet Evergarden: the Movie",
   "Violet Evergarden : Le film"
  ]
 },
 {
  "id": 98444,
  "name": "Yuru Camp△",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx98444-Vzysp1EsrzgD.jpg",
  "year": 2018,
  "al": [
   "Laid-Back Camp",
   "Yurucamp",
   "Yurukyan△"
  ]
 },
 {
  "id": 116742,
  "name": "Tensei Shitara Slime Datta Ken 2nd Season Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx116742-jn0dW23ftehq.jpg",
  "year": 2021,
  "al": [
   "That Time I Got Reincarnated as a Slime Season 2 Part 2",
   "Tensura 2",
   "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว ภาค 2 พาร์ท 2",
   "Moi, quand je me réincarne en Slime Saison 2 Partie 2",
   "О моём перерождении в слизь 2"
  ]
 },
 {
  "id": 113538,
  "name": "Haikyuu!! TO THE TOP 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113538-tHVE8j5mOPLu.jpg",
  "year": 2020,
  "al": [
   "HAIKYU!! TO THE TOP Part 2",
   "ไฮคิว!! คู่ตบฟ้าประทาน ภาค 4 Part 2",
   "Haikyu!! Season 4 Part 2"
  ]
 },
 {
  "id": 21127,
  "name": "Steins;Gate 0",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21127-7ARWZkDXKiiD.jpg",
  "year": 2018,
  "al": [
   "s;g0",
   "命运石之门0"
  ]
 },
 {
  "id": 174788,
  "name": "Look Back",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx174788-9LsUnn0oEppv.jpg",
  "year": 2024
 },
 {
  "id": 105228,
  "name": "Dorohedoro",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx105228-I4xr84QS9Pvk.jpg",
  "year": 2020
 },
 {
  "id": 115230,
  "name": "Kami no Tou: Tower of God",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx115230-QHOdSN7yt8ab.jpg",
  "year": 2020,
  "al": [
   "Tower of God",
   "Sinui Tap",
   "Kami no Tou",
   "TOG"
  ]
 },
 {
  "id": 98436,
  "name": "Mahoutsukai no Yome",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx98436-n7sK6POCd0XV.png",
  "year": 2017,
  "al": [
   "The Ancient Magus' Bride",
   "Mahou Tsukai no Yome",
   "Mahoyome"
  ]
 },
 {
  "id": 107660,
  "name": "BEASTARS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx107660-hgknnyaLchJW.png",
  "year": 2019,
  "al": [
   "BEASTARS - O Lobo Bom"
  ]
 },
 {
  "id": 7791,
  "name": "K-ON!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx7791-4tnomla2mMDp.png",
  "year": 2010,
  "al": [
   "K-ON! Season 2",
   "Keion 2",
   "K-On!! 2nd Season",
   "K on 2"
  ]
 },
 {
  "id": 2167,
  "name": "CLANNAD",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx2167-pSDBcyc0vjej.jpg",
  "year": 2007
 },
 {
  "id": 113936,
  "name": "Dr. STONE: STONE WARS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113936-D4eYd4XwslVI.jpg",
  "year": 2021,
  "al": [
   "ドクターストーン STONE WARS",
   "Ｄｒ．ＳＴＯＮＥ第2期",
   "Dr. STONE 2"
  ]
 },
 {
  "id": 155783,
  "name": "Tengoku Daimakyou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx155783-YosKbsmZzuDE.jpg",
  "year": 2023,
  "al": [
   "Tengoku Daimakyo",
   "Heavenly Delusion",
   "Tengoku-Daimakyo: Ilusão Celestial"
  ]
 },
 {
  "id": 117193,
  "name": "Boku no Hero Academia 5",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx117193-E75BlZmDh1aB.jpg",
  "year": 2021,
  "al": [
   "My Hero Academia Season 5",
   "BNHA 5",
   "MHA 5",
   "我的英雄学院 5"
  ]
 },
 {
  "id": 124845,
  "name": "Wonder Egg Priority",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx124845-JXORhqCTGt04.jpg",
  "year": 2021,
  "al": [
   "WonEgg",
   "WEP"
  ]
 },
 {
  "id": 777,
  "name": "HELLSING OVA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx777-F6547pSAR2Zd.jpg",
  "year": 2006,
  "al": [
   "Hellsing Ultimate",
   "ヘルシング OVA"
  ]
 },
 {
  "id": 121,
  "name": "Hagane no Renkinjutsushi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx121-zjmixZ428Mwv.png",
  "year": 2003,
  "al": [
   "Fullmetal Alchemist",
   "Full Metal Alchemist",
   "FMA",
   "Stalowy alchemik"
  ]
 },
 {
  "id": 185407,
  "name": "Takopii no Genzai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx185407-7uzY4fA3hokP.jpg",
  "year": 2025,
  "al": [
   "Takopi's Original Sin"
  ]
 },
 {
  "id": 146065,
  "name": "Mushoku Tensei II: Isekai Ittara Honki Dasu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx146065-IjirxRK26O03.png",
  "year": 2023,
  "al": [
   "Mushoku Tensei: Jobless Reincarnation Season 2",
   "เกิดชาตินี้พี่ต้องเทพ ซีซั่น 2",
   "Mushoku Tensei: Isekai Ittara Honki Dasu 2nd Season",
   "Mushoku Tensei II: Jobless Reincarnation",
   "Mushoku Tensei II: Reencarnación desde cero"
  ]
 },
 {
  "id": 106625,
  "name": "Haikyuu!! TO THE TOP",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx106625-UR22wB2NuNVi.png",
  "year": 2020,
  "al": [
   "HAIKYU!! TO THE TOP",
   "Haikyu!! Season 4",
   "Haikyuu!! Season 4",
   "ไฮคิว!! คู่ตบฟ้าประทาน ภาค 4 Part 1"
  ]
 },
 {
  "id": 100182,
  "name": "Sword Art Online: Alicization",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx100182-KctPmCJ2smHQ.jpg",
  "year": 2018,
  "al": [
   "SAOIII",
   "SAO3",
   "Alicization",
   "Sword Art Online III",
   "ซอร์ดอาร์ตออนไลน์ ภาค 3"
  ]
 },
 {
  "id": 20872,
  "name": "Plastic Memories",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20872-j5PBzzVtrYDM.jpg",
  "year": 2015,
  "al": [
   "Plamemo"
  ]
 },
 {
  "id": 113596,
  "name": "Josee to Tora to Sakanatachi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113596-LKA0bYJGjLnB.jpg",
  "year": 2020,
  "al": [
   "Josee, the Tiger and the Fish",
   "Josee to Tora to Sakana-tachi",
   "Josee, el Tigre y los Peces",
   "Josee, El Tigre i Els Peixos",
   "Josie, der Tiger und die Fische.",
   "Josée, le tigre et les poissons",
   "Josée, la Tigre e i Pesci",
   "Josee: Khi nàng thơ yêu"
  ]
 },
 {
  "id": 512,
  "name": "Majo no Takkyuubin",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx512-UwP8X4BR8YoM.png",
  "year": 1989,
  "al": [
   "Kiki's Delivery Service",
   "Majotaku",
   "Witch's Express Delivery",
   "Kiki la petite sorcière",
   "Nicky, la Aprendiz de Bruja",
   "O Serviço de Entregas da Kiki",
   "Kiki - Consegne a domicilio",
   "Podniebna poczta Kiki",
   "Kikis kleiner Lieferservice",
   "Kikis budservice",
   "Kikin Lähettipalvelu",
   "Kikis Expressbud",
   "Kiki Entregas a Domicilio",
   "Sendiþjónusta Kiki",
   "Kiki, A Aprendiz de Feiticeira",
   "Dịch vụ giao hàng của phù thủy Kiki"
  ]
 },
 {
  "id": 21745,
  "name": "Owarimonogatari (Ge)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21745-VrhhJjZNdBXV.png",
  "year": 2017,
  "al": [
   "Owarimonogatari Second Season",
   "Owarimonogatari 2",
   "End Tale"
  ]
 },
 {
  "id": 17895,
  "name": "Golden Time",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx17895-M8yjOyMxHf5X.jpg",
  "year": 2013
 },
 {
  "id": 162314,
  "name": "Shingeki no Kyojin: The Final Season - Kanketsu-hen Kouhen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx162314-qIWdAAFtvY8J.jpg",
  "year": 2023,
  "al": [
   "Attack on Titan Final Season THE FINAL CHAPTERS Special 2",
   "Shingeki no Kyojin: The Final Season Final Edition",
   "Attack on Titan Final Season Part 3 Final Arc Part 2",
   "Attack on Titan: The Final Season Part 4",
   "Shingeki no Kyojin: The Final Season Part 4",
   "SnK 4",
   "AoT 4"
  ]
 },
 {
  "id": 21400,
  "name": "Kizumonogatari III: Reiketsu-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21400-38ykNo3j4xXo.png",
  "year": 2017,
  "al": [
   "Kizumonogatari Part 3: Reiketsu",
   "Wound Tale 3: Cold Blood"
  ]
 },
 {
  "id": 128546,
  "name": "Vivy: Fluorite Eye’s Song",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx128546-UIwyhuhjxmL0.jpg",
  "year": 2021
 },
 {
  "id": 15809,
  "name": "Hataraku Maou-sama!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx15809-ECv3HyOYJKrk.jpg",
  "year": 2013,
  "al": [
   "The Devil is a Part-Timer!",
   "Raja Iblis Nyambi!"
  ]
 },
 {
  "id": 21128,
  "name": "Noragami ARAGOTO",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21128-eQgH3TG4nngo.jpg",
  "year": 2015,
  "al": [
   "โนรางามิ เทวดาขาจร ภาค 2"
  ]
 },
 {
  "id": 12355,
  "name": "Ookami Kodomo no Ame to Yuki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx12355-wNsvhEsXEgrH.png",
  "year": 2012,
  "al": [
   "Wolf Children",
   "The Wolf Children Ame and Yuki",
   "Los Niños Lobo",
   "Les Enfants loups, Ame & Yuki",
   "Wilcze Dzieci",
   "Ame e Yuki i bambini lupo",
   "Crianças Lobo",
   "Vargbarnen"
  ]
 },
 {
  "id": 249,
  "name": "Inuyasha",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx249-jVBkyLnBvnRE.png",
  "year": 2000,
  "al": [
   "Inu Yasha"
  ]
 },
 {
  "id": 101165,
  "name": "Goblin Slayer",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101165-v5NwPXWPFDuD.jpg",
  "year": 2018
 },
 {
  "id": 21175,
  "name": "Dragon Ball Super",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21175-EH06qlfF8TnB.jpg",
  "year": 2015,
  "al": [
   "DBS",
   "Dragonball Super"
  ]
 },
 {
  "id": 151801,
  "name": "MASHLE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151801-XxVf22Le6C8o.png",
  "year": 2023,
  "al": [
   "MASHLE: MAGIC AND MUSCLES",
   "MASHLE: MAGIA E MÚSCULOS"
  ]
 },
 {
  "id": 20596,
  "name": "Ao Haru Ride",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20596-fJdMHV8xRMgY.png",
  "year": 2014,
  "al": [
   "Blue Spring Ride",
   "Aoharaido"
  ]
 },
 {
  "id": 129874,
  "name": "Kimetsu no Yaiba: Mugen Ressha-hen (TV)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx129874-g6ZKXB94Hui1.jpg",
  "year": 2021,
  "al": [
   "Demon Slayer: Kimetsu no Yaiba Mugen Train Arc",
   "KnY 2",
   "ดาบพิฆาตอสูร : ศึกรถไฟสู่นิรันดร์ (TV)",
   "Demon Slayer: Kimetsu no Yaiba: Le train de l'Infini",
   "Demon Slayer: Kimetsu no Yaiba season 2",
   "Miecz zabójcy demonów – Kimetsu no Yaiba: Nieskończony Pociąg"
  ]
 },
 {
  "id": 43,
  "name": "GHOST IN THE SHELL: Koukaku Kidoutai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx43-Y6EjeEMM14dj.png",
  "year": 1995,
  "al": [
   "Ghost in the Shell",
   "GitS",
   "Ghost in the Shell: O Fantasma do Futuro",
   "Duch w pancerzu",
   "Páncélba zárt szellem"
  ]
 },
 {
  "id": 232,
  "name": "Cardcaptor Sakura",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx232-ERyKCNNPJJeh.png",
  "year": 1998,
  "al": [
   "CCS",
   "Cardcaptors",
   "Card Captor Sakura",
   "Card Captors",
   "Sakura, Cazadora de Cartas",
   "Sakura, la Caçadora de Cartes",
   "Pesca la tua carta, Sakura",
   "Sakura, a Caçadora de Cartas",
   "Sakura, Chasseuse de Cartes"
  ]
 },
 {
  "id": 6,
  "name": "TRIGUN",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx6-wd4saT1JzStH.jpg",
  "year": 1998
 },
 {
  "id": 7311,
  "name": "Suzumiya Haruhi no Shoushitsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx7311-9Mfc1YRHwCCW.jpg",
  "year": 2010,
  "al": [
   "The Disappearance of Haruhi Suzumiya",
   "La Disparition de Haruhi Suzumiya",
   "La Scomparsa di Haruhi Suzumiya"
  ]
 },
 {
  "id": 578,
  "name": "Hotaru no Haka",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx578-vU6XcOlb1XFU.jpg",
  "year": 1988,
  "al": [
   "Grave of the Fireflies",
   "Tombstone for Fireflies",
   "Le Tombeau des lucioles",
   "La Tumba de las Luciérnagas",
   "O Túmulo dos Vagalumes",
   "Die letzten Glühwürmchen",
   "Una tomba per le lucciole",
   "Grobowiec świetlików",
   "Eldflugornas Grav",
   "Szentjánosbogarak sírja",
   "La Tomba delle Lucciole",
   "Ildfluens Grav",
   "O Túmulo dos Pirilampos"
  ]
 },
 {
  "id": 20594,
  "name": "Sword Art Online II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx20594-FhRgZ1H9Istt.jpg",
  "year": 2014,
  "al": [
   "SAO2",
   "GGO",
   "ซอร์ดอาร์ตออนไลน์ ภาค 2"
  ]
 },
 {
  "id": 142838,
  "name": "SPY×FAMILY Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx142838-26JrqcFU1ljB.jpg",
  "year": 2022,
  "al": [
   "SPY x FAMILY Cour 2",
   "SxF",
   "スパイファミリー 2クール"
  ]
 },
 {
  "id": 128547,
  "name": "Odd Taxi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx128547-nNekWTKqmvEi.jpg",
  "year": 2021,
  "al": [
   "ODDTAXI"
  ]
 },
 {
  "id": 11981,
  "name": "Mahou Shoujo Madoka☆Magica: Hangyaku no Monogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b11981-koz1IoISs3eU.jpg",
  "year": 2013,
  "al": [
   "Puella Magi Madoka Magica the Movie -Rebellion-",
   "Mahou Shoujo Madoka Magika Movie 3",
   "Magical Girl Madoka Magica Movie 3",
   "Puella Magi Madoka Magica the Movie Part III: Rebellion"
  ]
 },
 {
  "id": 3786,
  "name": "Shin Evangelion Movie:||",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx3786-Tpt9iM72dxTv.jpg",
  "year": 2021,
  "al": [
   "Evangelion: 3.0+1.0 Thrice Upon a Time",
   "Rebuild of Evangelion 4.0",
   "EVANGELION:3.0+1.01 THRICE UPON A TIME ",
   "EVANGELION:3.0+1.01 A ESPERANÇA",
   "อีวานเกเลียน:3.0+1.01 สามครั้งก่อน เมื่อเนิ่นนานมาแล้ว",
   "Evangelion 3.0+1.11",
   "EVANGELION:3.0+1.01 TRIPLE",
   "Evangelion 3.0+1.01 Od-nowa"
  ]
 },
 {
  "id": 143338,
  "name": "Otonari no Tenshi-sama ni Itsunomanika Dame Ningen ni Sareteita Ken",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx143338-zhyDVYgEzsm5.png",
  "year": 2023,
  "al": [
   "The Angel Next Door Spoils Me Rotten",
   "Meu Anjo de Vizinha Me Mima Demais",
   "Chouchouté par l’ange d’à côté",
   "Aku Dimanjakan Tetanggaku yang Seperti Malaikat",
   "Thiên Sứ Nhà Bên"
  ]
 },
 {
  "id": 131646,
  "name": "Vanitas no Carte",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx131646-cuyGfKcekZ62.jpg",
  "year": 2021,
  "al": [
   "The Case Study of Vanitas",
   "Vanitas no Karte",
   "Les Mémoires de Vanitas"
  ]
 },
 {
  "id": 20850,
  "name": "Tokyo Ghoul √A",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20850-glDf9EMKeCwe.jpg",
  "year": 2015,
  "al": [
   "Tokyo Kushu 2",
   "Tokyo Ghoul Root A"
  ]
 },
 {
  "id": 132126,
  "name": "Sonny Boy",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx132126-4ugVjXMQLAps.png",
  "year": 2021
 },
 {
  "id": 2251,
  "name": "Baccano!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx2251-tTQoWxVy4472.jpg",
  "year": 2007
 },
 {
  "id": 145545,
  "name": "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx145545-DGl3LVvFlnHi.png",
  "year": 2022,
  "al": [
   "Classroom of the Elite Season 2",
   "You-Zitsu 2",
   "Youjitsu 2",
   "ขอต้อนรับสู่ห้องเรียนนิยม (เฉพาะ) ยอดคน ภาค 2",
   "Cote 2"
  ]
 },
 {
  "id": 21049,
  "name": "ReLIFE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21049-4AHSLeiDE9eg.png",
  "year": 2016
 },
 {
  "id": 100668,
  "name": "Arifureta Shokugyou de Sekai Saikyou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx100668-DvOn5bMOt4cy.jpg",
  "year": 2019,
  "al": [
   "Arifureta: From Commonplace to World's Strongest"
  ]
 },
 {
  "id": 4898,
  "name": "Kuroshitsuji",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx4898-mW4gabZvwmLC.jpg",
  "year": 2008,
  "al": [
   "Black Butler",
   "Kuro Shitsuji",
   "Kuroshitsuzi",
   "Hắc Quản Gia",
   "黑执事 第1季",
   "Diácono Negro temporada 1"
  ]
 },
 {
  "id": 146984,
  "name": "Shingeki no Kyojin: The Final Season - Kanketsu-hen Zenpen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx146984-GXrLeT6vQqyP.jpg",
  "year": 2023,
  "al": [
   "Attack on Titan Final Season THE FINAL CHAPTERS Special 1",
   "Shingeki no Kyojin: The Final Season Final Edition",
   "Shingeki no Kyojin: The Final Season Part 3",
   "ผ่าพิภพไททัน ภาค 4",
   "ผ่าพิภพไททัน ไฟนอล ซีซั่น Part 3",
   "Attack on Titan Final Season Part 3 Final Arc Part 1",
   "Attack on Titan The Final Season The Final Part Special",
   "Attack on Titan The Final Season The Final Part Part 1",
   "حمله به تایتان فصل آخر قسمت ویژه 1 ",
   "SnK 4",
   "AoT 4"
  ]
 },
 {
  "id": 153152,
  "name": "Boku no Kokoro no Yabai Yatsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153152-Xnwmx7wuoIWV.jpg",
  "year": 2023,
  "al": [
   "The Dangers in My Heart",
   "BokuYaba",
   "Peligros en mi corazón",
   "Czarne chmury w moim sercu"
  ]
 },
 {
  "id": 113813,
  "name": "Kanojo, Okarishimasu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113813-SnljeXpU3Pw7.jpg",
  "year": 2020,
  "al": [
   "Rent-a-Girlfriend",
   "I'd like to Borrow a Girlfriend",
   "Kanokari",
   "Pacar Sewaan"
  ]
 },
 {
  "id": 151514,
  "name": "Chi. Chikyuu no Undou ni Tsuite",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151514-Y0d82Ah2ZOHX.jpg",
  "year": 2024,
  "al": [
   "Orb: On the Movements of the Earth",
   "Chi: About the Movement of the Earth",
   "O ruchach Ziemi",
   "Du mouvement de la Terre",
   "Tierra, sangre, conocimiento: Sobre el movimiento de la Tierra",
   "Ketzer - Tödliches Wissen über die Bewegung der Erde",
   "Il movimento della Terra"
  ]
 },
 {
  "id": 2890,
  "name": "Gake no Ue no Ponyo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx2890-wcNtFr6aUYOR.jpg",
  "year": 2008,
  "al": [
   "Ponyo",
   "Ponyo on the Cliff by the Sea",
   "Ponyo en el Acantilado",
   "Ponyo sur la falaise",
   "Ponyo på klippen ved havet",
   "Ponyo sulla scogliera",
   "Ponyo på klippan vid havet",
   "Ponyo rantakalliolla",
   "Ponyo: Uma Amizade que Veio do Mar",
   "Ponyo - Das große Abenteuer am Meer",
   "Ponyo við sjávarklettana"
  ]
 },
 {
  "id": 99420,
  "name": "Shoujo Shuumatsu Ryokou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99420-k5Tel6yRMwA8.png",
  "year": 2017,
  "al": [
   "Girls' Last Tour",
   "GLT",
   "Wisata Gadis di Akhir Hayat"
  ]
 },
 {
  "id": 142770,
  "name": "Suzume no Tojimari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx142770-dDaDIRnsv5jN.jpg",
  "year": 2022,
  "al": [
   "Suzume",
   "Khóa Chặt Cửa Nào Suzume"
  ]
 },
 {
  "id": 20996,
  "name": "Gintama°",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20996-kBEGEGdeK1r7.jpg",
  "year": 2015,
  "al": [
   "Gintama Season 3"
  ]
 },
 {
  "id": 139630,
  "name": "Boku no Hero Academia 6",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx139630-3v4gxWtNZxLV.jpg",
  "year": 2022,
  "al": [
   "My Hero Academia Season 6",
   "BNHA 6",
   "MHA 6",
   "我的英雄学院 6"
  ]
 },
 {
  "id": 116006,
  "name": "THE GOD OF HIGH SCHOOL",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx116006-Wt8JSA1ZQxlM.png",
  "year": 2020,
  "al": [
   "GoH"
  ]
 },
 {
  "id": 111762,
  "name": "Fruits Basket: 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx111762-C8TNf5uRlVNQ.jpg",
  "year": 2020,
  "al": [
   "Fruits Basket Season 2",
   "Furuba",
   "Fruba",
   "เสน่ห์สาวข้าวปั้น ภาค 2",
   "Fruits Basket (2019) 2"
  ]
 },
 {
  "id": 161964,
  "name": "Kage no Jitsuryokusha ni Naritakute! 2nd season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx161964-JpkEbHI8ivaP.jpg",
  "year": 2023,
  "al": [
   "The Eminence in Shadow Season 2",
   "To Be a Power in the Shadows! 2",
   "ชีวิตไม่ต้องเด่น ขอแค่เป็นเทพในเงา 2",
   "Un giorno sarò l'eminenza grigia 2",
   "TEIS 2"
  ]
 },
 {
  "id": 20792,
  "name": "Fate/stay night: Unlimited Blade Works 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20792-Q53sZsUAh5FF.jpg",
  "year": 2015,
  "al": [
   "フェイト/ステイナイト Unlimited Blade Works 2ndシーズン",
   "Судьба/Ночь схватки: Бесконечный мир клинков 2"
  ]
 },
 {
  "id": 162804,
  "name": "Tokidoki Bosotto Rossiya-go de Dereru Tonari no Alya-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx162804-TBeptcAfvqTd.jpg",
  "year": 2024,
  "al": [
   "Alya Sometimes Hides Her Feelings in Russian",
   "Roshidere"
  ]
 },
 {
  "id": 18153,
  "name": "Kyoukai no Kanata",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx18153-oDqA9zQzQPOq.png",
  "year": 2013,
  "al": [
   "Beyond the Boundary",
   "Beyond the Horizon"
  ]
 },
 {
  "id": 154965,
  "name": "Yamada-kun to Lv999 no Koi wo Suru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx154965-vZbBRjtmLp7S.jpg",
  "year": 2023,
  "al": [
   "My Love Story with Yamada-kun at Lv999",
   "Loving Yamada at LV999!",
   "My Lv999 Love for Yamada-kun",
   "Minha História de Amor com Yamada-kun Nível 999",
   "รักสุดฟินเลเวล 999 กับยามาดะคุง",
   "和山田进行LV.999的恋爱",
   "Mon histoire d'amour avec Yamada à Lv999",
   "和山田談場 Lv999 的戀愛",
   "Kocham Yamadę na 999 poziomie!"
  ]
 },
 {
  "id": 112301,
  "name": "Maou Gakuin no Futekigousha: Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e Kayou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx112301-f88Fs2es4pSr.jpg",
  "year": 2020,
  "al": [
   "The Misfit of Demon King Academy: History’s Strongest Demon King Reincarnates and Goes to School with His Descendants",
   "Maou Gakuin no Futekigousha",
   "The Misfit of Demon King Academy"
  ]
 },
 {
  "id": 151970,
  "name": "Shangri-La Frontier",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151970-xtIx3VqEk02X.jpg",
  "year": 2023,
  "al": [
   "ShanFro",
   "Shangri-La Frontier: Kusoge Hunter, Kami ge ni Idoman to su",
   "Thợ săn Game rác thách thức Game cấp Thánh"
  ]
 },
 {
  "id": 11843,
  "name": "Danshi Koukousei no Nichijou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11843-ui2jBcuQUqnl.jpg",
  "year": 2012,
  "al": [
   "Daily Lives of High School Boys",
   "Nichibros",
   "La vie quotidienne de lycéens"
  ]
 },
 {
  "id": 102976,
  "name": "Kono Subarashii Sekai ni Shukufuku wo! Kurenai Densetsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx102976-2Yi5icRbjukO.png",
  "year": 2019,
  "al": [
   "KONOSUBA -God's blessing on this wonderful world!- Legend of Crimson",
   "Konosuba Movie",
   "Konosuba! Un mundo maravilloso. La leyenda del carmesí"
  ]
 },
 {
  "id": 185,
  "name": "Initial D",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b185-GvXiR8AKTmdn.jpg",
  "year": 1998,
  "al": [
   "Initial D 1st Stage",
   "Inisharu Di",
   "イニシャルD"
  ]
 },
 {
  "id": 21875,
  "name": "No Game No Life Zero",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx21875-ybSgx75MgRMM.png",
  "year": 2017,
  "al": [
   "NO GAME NO LIFE Movie",
   "NGNL Zero",
   "nogenora 0"
  ]
 },
 {
  "id": 20668,
  "name": "Gekkan Shoujo Nozaki-kun",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20668-6UslJY5NDYNh.png",
  "year": 2014,
  "al": [
   "Monthly Girls' Nozaki-kun",
   "Revista mensual para chicas Nozaki"
  ]
 },
 {
  "id": 189046,
  "name": "Re:Zero kara Hajimeru Isekai Seikatsu 4th Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx189046-yaHWtS5FII46.jpg",
  "year": 2026,
  "al": [
   "Re:ZERO -Starting Life in Another World- Season 4",
   "Re:ZERO รีเซทชีวิต ฝ่าวิกฤตต่างโลก ซีซั่น 4"
  ]
 },
 {
  "id": 226,
  "name": "Elfen Lied",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx226-MibyRKhIrnTe.png",
  "year": 2004,
  "al": [
   "Elfen Song",
   "Elfic Song"
  ]
 },
 {
  "id": 10408,
  "name": "Hotarubi no Mori e",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx10408-PlKJ6DAyvMk2.png",
  "year": 2011,
  "al": [
   "Into the Forest of Fireflies' Light",
   "To the Forest of Firefly Lights",
   "Lạc Vào Khu Rừng Đom Đóm"
  ]
 },
 {
  "id": 114236,
  "name": "Enen no Shouboutai: Ni no Shou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx114236-wfQOWF0Ii3h2.png",
  "year": 2020,
  "al": [
   "Fire Force Season 2",
   "Enen no Shouboutai 2",
   "หน่วยผจญคนไฟลุก ภาค 2"
  ]
 },
 {
  "id": 163134,
  "name": "Re:Zero kara Hajimeru Isekai Seikatsu 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx163134-yieRFbvUOH9a.jpg",
  "year": 2024,
  "al": [
   "Re:ZERO -Starting Life in Another World- Season 3",
   "Re:ZERO – Жизнь с нуля в альтернативном мире 3"
  ]
 },
 {
  "id": 21092,
  "name": "Rakudai Kishi no Cavalry",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx21092-1NML6TdngmBq.jpg",
  "year": 2015,
  "al": [
   "Chivalry of a Failed Knight",
   "Rakudai Kishi no Eiyuutan",
   "A tale of worst one"
  ]
 },
 {
  "id": 440,
  "name": "Shoujo Kakumei Utena",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b440-r4l3N5WGgUOZ.jpg",
  "year": 1997,
  "al": [
   "Revolutionary Girl Utena",
   "Utena la fillette révolutionnaire",
   "La rivoluzione di Utena",
   "Utena la ragazza della rivoluzione",
   "Rewolucjonistka Utena"
  ]
 },
 {
  "id": 114124,
  "name": "Yuukoku no Moriarty",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx114124-def92qPuIVeK.jpg",
  "year": 2020,
  "al": [
   "Moriarty the Patriot"
  ]
 },
 {
  "id": 99457,
  "name": "Sayonara no Asa ni Yakusoku no Hana wo Kazarou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99457-OD0xtM8NlHNQ.png",
  "year": 2018,
  "al": [
   "Maquia: When the Promised Flower Blooms",
   "SayoAsa",
   "Maquia - Decoriamo la mattina dell'addio con i fiori promessi",
   "Maquia - Eine unsterbliche Liebesgeschichte",
   "Maquia: Una historia de amor eterno",
   "Maquia: Chờ ngày lời hứa nở hoa"
  ]
 },
 {
  "id": 21719,
  "name": "Fate/stay night [Heaven's Feel] III. spring song",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21719-MSdTlkno0Z0u.jpg",
  "year": 2020,
  "al": [
   "Fate/HF III",
   "Судьба/Ночь схватки: Прикосновение небес 3"
  ]
 },
 {
  "id": 13125,
  "name": "Shinsekai yori",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx13125-2EDZb8ahshQc.png",
  "year": 2012,
  "al": [
   "From the New World",
   "Shin Sekai Yori",
   "Del nuevo mundo"
  ]
 },
 {
  "id": 20722,
  "name": "Barakamon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20722-2KAeq72E95dr.png",
  "year": 2014
 },
 {
  "id": 21647,
  "name": "orange",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21647-zMUXNhcVyRyv.png",
  "year": 2016
 },
 {
  "id": 166240,
  "name": "Kimetsu no Yaiba: Hashira Geiko-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx166240-PBV7zukIHW7V.png",
  "year": 2024,
  "al": [
   "Demon Slayer: Kimetsu no Yaiba Hashira Training Arc",
   "KnY 4",
   "Demon Slayer: Kimetsu no Yaiba - L'entraînement des Piliers",
   "Miecz zabójcy demonów – Kimetsu no Yaiba: Trening Filarów"
  ]
 },
 {
  "id": 166873,
  "name": "Mushoku Tensei II: Isekai Ittara Honki Dasu Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx166873-xO0BRPkmwFll.png",
  "year": 2024,
  "al": [
   "Mushoku Tensei: Jobless Reincarnation Season 2 Part 2",
   "Mushoku Tensei: Jobless Reincarnation Season 2 Cour 2",
   "เกิดชาตินี้พี่ต้องเทพ ซีซั่น 2 ครึ่งหลัง",
   "Mushoku Tensei: Isekai Ittara Honki Dasu 2nd Season Part 2",
   "Mushoku Tensei II: Jobless Reincarnation Part 2",
   "Mushoku Tensei II: Reencarnación desde cero"
  ]
 },
 {
  "id": 156092,
  "name": "Tu Bian Yingxiong X",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx156092-yHqgQZOF2mbg.jpg",
  "year": null,
  "al": [
   "To Be Hero X",
   "To Be Hero 3",
   "TBHX"
  ]
 },
 {
  "id": 21679,
  "name": "Bungou Stray Dogs 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21679-9MKdz1A7YLV7.jpg",
  "year": 2016,
  "al": [
   "Bungo Stray Dogs 2",
   "Bungou Stray Dogs (2016)",
   "BSD 2",
   "คณะประพันธกรจรจัด ภาค 2"
  ]
 },
 {
  "id": 185660,
  "name": "Dandadan 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx185660-uB8RUMBGovGr.jpg",
  "year": 2025,
  "al": [
   "DAN DA DAN Season 2",
   "Dan Da Dan: Evil Eye"
  ]
 },
 {
  "id": 141949,
  "name": "Fuufu Ijou, Koibito Miman.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx141949-tViCIRHPZAyG.jpg",
  "year": 2022,
  "al": [
   "More than a Married Couple, but Not Lovers.",
   "More than a Couple, Less than Lovers.",
   "Presque mariés, loin d'être amoureux.",
   "Fuukoi"
  ]
 },
 {
  "id": 101474,
  "name": "Overlord III",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101474-tGRyvSAWMjU9.jpg",
  "year": 2018,
  "al": [
   "Over Lord 3",
   "โอเวอร์ลอร์ด ภาค 3"
  ]
 },
 {
  "id": 166794,
  "name": "Yubisaki to Renren",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx166794-1MAXFMgND6qS.jpg",
  "year": 2024,
  "al": [
   "A Sign of Affection",
   "Ein Zeichen der Zuneigung",
   "Signos de Afecto",
   "Znaki naszych uczuć",
   "Cinta dan Isyarat"
  ]
 },
 {
  "id": 178788,
  "name": "Kimetsu no Yaiba: Mugenjou-hen Movie 1 - Akaza Sairai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx178788-zm3gtpB9TpRt.jpg",
  "year": 2025,
  "al": [
   "Demon Slayer: Kimetsu no Yaiba Infinity Castle",
   "Demon Slayer: Kimetsu no Yaiba La Forteresse infinie",
   "Demon Slayer: Kimetsu no Yaiba Castelo Infinito"
  ]
 },
 {
  "id": 235,
  "name": "Meitantei Conan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx235-MyYT7K3chBdO.jpg",
  "year": 1996,
  "al": [
   "Detective Conan",
   "Case Closed",
   "Detectiu Conan",
   "Detektyw Conan",
   "Meitantei Conan: Keisaku Gakkou Hen - Wild Police Story",
   "名探偵コナン 警察学校編 Wild Police Story",
   "Thám Tử Lừng Danh Conan",
   "Detektiv Conan",
   "Detetive Conan"
  ]
 },
 {
  "id": 120697,
  "name": "Ijiranaide, Nagatoro-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx120697-BA2TqxB1I5bJ.jpg",
  "year": 2021,
  "al": [
   "DON'T TOY WITH ME, MISS NAGATORO",
   "Arrête de me chauffer, Nagatoro!",
   "Jangan main-main denganku, Nona Nagatoro Serangan Ke-2 ",
   "No me rayes, Nagatoro"
  ]
 },
 {
  "id": 934,
  "name": "Higurashi no Naku Koro ni",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx934-wjMlVEl4CWwg.jpg",
  "year": 2006,
  "al": [
   "When They Cry",
   "When the Cicadas Cry",
   "Higurashi: When They Cry",
   "Cuando las Cigarras Lloran",
   "Quando as Cigarras Choram",
   "Hinamizawa, le village maudit",
   "Higurashi When They Cry (2006 anime version) ",
   "Khi ve sầu ngân",
   "Higurashi: Όταν Κλαίνε τα Τζιτζίκια",
   "Gdy zapłaczą cykady"
  ]
 },
 {
  "id": 166216,
  "name": "Boku no Kokoro no Yabai Yatsu 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx166216-vCMkF4e3x5FB.jpg",
  "year": 2024,
  "al": [
   "The Dangers in My Heart Season 2",
   "BokuYaba 2",
   "僕ヤバ 2",
   "Czarne chmury w moim sercu. Sezon 2"
  ]
 },
 {
  "id": 166531,
  "name": "[Oshi no Ko] 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx166531-dAL5MsqDHUkj.jpg",
  "year": 2024,
  "al": [
   "OSHI NO KO Season 2"
  ]
 },
 {
  "id": 131942,
  "name": "JoJo no Kimyou na Bouken: Stone Ocean",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx131942-rermlZ9lplHX.png",
  "year": 2021,
  "al": [
   "JoJo's Bizarre Adventure: STONE OCEAN",
   "JoJo's Bizarre Adventure Part 6",
   "JoJo no Kimyou na Bouken Part 6",
   "Le bizzarre avventure di JoJo: Stone Ocean",
   "โจโจ้ ล่าข้ามศตวรรษ ภาค 6"
  ]
 },
 {
  "id": 20458,
  "name": "Mahouka Koukou no Rettousei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20458-tGh343Ew10yU.jpg",
  "year": 2014,
  "al": [
   "The Irregular at Magic High School"
  ]
 },
 {
  "id": 20727,
  "name": "Kekkai Sensen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20727-jgVnxLCHAKqZ.jpg",
  "year": 2015,
  "al": [
   "Blood Blockade Battlefront"
  ]
 },
 {
  "id": 154768,
  "name": "Sono Bisque Doll wa Koi wo Suru Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx154768-DHHvNd4MjV1p.jpg",
  "year": 2025,
  "al": [
   "My Dress-Up Darling Season 2",
   "Sono Kisekae Ningyou wa Koi wo suru",
   "หนุ่มเย็บผ้ากับสาวนักคอสเพลย์ ภาค 2",
   "Kisekoi 2",
   "Si Boneka Rias Sedang Jatuh Cinta"
  ]
 },
 {
  "id": 20807,
  "name": "Prison School",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20807-8nFoO0AUdGsy.jpg",
  "year": 2015,
  "al": [
   "Kangoku Gakuen"
  ]
 },
 {
  "id": 820,
  "name": "Ginga Eiyuu Densetsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx820-x5dNLNFeKb8B.png",
  "year": 1988,
  "al": [
   "Legend of the Galactic Heroes",
   "LoGH",
   "LoTGH",
   "Gin'eiden",
   "Heldensagen vom Kosmosinsel"
  ]
 },
 {
  "id": 2966,
  "name": "Ookami to Koushinryou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx2966-AEULMyYA9WKb.png",
  "year": 2008,
  "al": [
   "Spice and Wolf"
  ]
 },
 {
  "id": 163270,
  "name": "WIND BREAKER",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx163270-wboZJp0ybwVK.jpg",
  "year": 2024,
  "al": [
   "WB",
   "WBK"
  ]
 },
 {
  "id": 141911,
  "name": "Skip to Loafer",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx141911-o6Jwav7hRPPM.jpg",
  "year": 2023,
  "al": [
   "Skip and Loafer"
  ]
 },
 {
  "id": 177689,
  "name": "Hikaru ga Shinda Natsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx177689-d0mB5nYgdnhi.jpg",
  "year": 2025,
  "al": [
   "The Summer Hikaru Died",
   "Lato, kiedy umarł Hikaru",
   "O Verão em que Hikaru Morreu",
   "Der Sommer, in dem Hikaru starb",
   "L'estate in cui Hikaru è morto",
   "El verano en que Hikaru murió",
   "Léto, kdy umřel Hikaru"
  ]
 },
 {
  "id": 159831,
  "name": "Zom 100: Zombie ni Naru Made ni Shitai 100 no Koto",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx159831-cJUNqCqzuApc.png",
  "year": 2023,
  "al": [
   "Zom 100: Bucket List of the Dead",
   "Zombie 100 ~100 Things I Want to do Before I Become a Zombie~",
   "Zombie 100 ~Zombie ni Naru Made ni Shitai 100 no Koto~",
   "100 สิ่งที่อยากทำก่อนจะกลายเป็นซอมบี้",
   "100 Coisas para Fazer Antes de Virar Zumbi"
  ]
 },
 {
  "id": 14513,
  "name": "Magi: The labyrinth of magic",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx14513-HuUdrFFYftA7.jpg",
  "year": 2012
 },
 {
  "id": 114745,
  "name": "Made in Abyss: Retsujitsu no Ougonkyou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx114745-fBgTC12T7IAy.jpg",
  "year": 2022,
  "al": [
   "Made in Abyss: The Golden City of the Scorching Sun",
   "Made in Abyss Season 2",
   "ผ่าเหวนรก ภาค 2",
   "Đến từ Vực Thẳm Mùa 2"
  ]
 },
 {
  "id": 21858,
  "name": "Little Witch Academia (TV)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21858-huBrbIOGMYXv.jpg",
  "year": 2017,
  "al": [
   "LWA (TV)",
   "Det lille hekseakademiet"
  ]
 },
 {
  "id": 101573,
  "name": "Yagate Kimi ni Naru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx101573-Gql3Q3UX1jcu.jpg",
  "year": 2018,
  "al": [
   "Bloom Into You",
   "YagaKimi"
  ]
 },
 {
  "id": 107693,
  "name": "Mairimashita! Iruma-kun",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx107693-A9bSSFAMxA6j.jpg",
  "year": 2019,
  "al": [
   "Welcome to Demon School! Iruma-kun"
  ]
 },
 {
  "id": 18897,
  "name": "Nisekoi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx18897-G2Fx2ZACsXBU.jpg",
  "year": 2014,
  "al": [
   "Nisekoi: False Love"
  ]
 },
 {
  "id": 174576,
  "name": "Tsue to Tsurugi no Wistoria",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx174576-tpKcHG0eO6CS.jpg",
  "year": 2024,
  "al": [
   "Wistoria: Wand and Sword",
   "Wistoria: Varinhas e Espadas"
  ]
 },
 {
  "id": 16782,
  "name": "Kotonoha no Niwa",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16782-qpFGk18UqaHn.jpg",
  "year": 2013,
  "al": [
   "The Garden of Words",
   "Koto no Ha no Niwa",
   "The Garden of Kotonoha",
   "El Jardín de las Palabras",
   "A szavak kertje",
   "Ogród słów",
   "Il giardino delle parole"
  ]
 },
 {
  "id": 101001,
  "name": "Asobi Asobase",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101001-UERCW0UGi0P7.jpg",
  "year": 2018,
  "al": [
   "Asobi Asobase - workshop of fun -",
   "游戏3人娘"
  ]
 },
 {
  "id": 170942,
  "name": "Ao no Hako",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx170942-KKcLfQzV57nG.jpg",
  "year": 2024,
  "al": [
   "Blue Box",
   "La caja azul",
   "Niebieskie pudełko"
  ]
 },
 {
  "id": 21058,
  "name": "Akagami no Shirayuki-hime",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21058-GRqasG1xk3bD.jpg",
  "year": 2015,
  "al": [
   "Snow White with the Red Hair",
   "Shirayuki aux cheveux rouges",
   "Die rothaarige Schneeprinzessin",
   "Blancanieves pelirroja",
   "Shirayuki: Śnieżka o czerwonych włosach"
  ]
 },
 {
  "id": 21096,
  "name": "Doukyuusei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx21096-1wIOxpjtXb7J.jpg",
  "year": 2016,
  "al": [
   "Doukyuusei -Classmates-",
   "Classmates"
  ]
 },
 {
  "id": 8074,
  "name": "Gakuen Mokushiroku: HIGHSCHOOL OF THE DEAD",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx8074-YB63Ik96fjPj.png",
  "year": 2010,
  "al": [
   "High School of the Dead",
   "HOTD",
   "HSOTD",
   "High School of the Dead: Apocalipsis en el Instituto"
  ]
 },
 {
  "id": 125206,
  "name": "Tsuki ga Michibiku Isekai Douchuu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx125206-O2MsOWdW1lVi.jpg",
  "year": 2021,
  "al": [
   "TSUKIMICHI -Moonlit Fantasy-",
   "Moon-led Journey Across Another World"
  ]
 },
 {
  "id": 585,
  "name": "Mimi wo Sumaseba",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx585-5uq7j2xNNVmN.jpg",
  "year": 1995,
  "al": [
   "Whisper of the Heart",
   "If You Listen Carefully",
   "Ghibli Movie 10",
   "Si tu tends l'oreille",
   "Stimme des Herzens",
   "Susurros del Corazón",
   "Sussurros do Coração",
   "Sussurri del cuore",
   "Szept serca",
   "I sospiri del mio cuore",
   "Sydämen kuiskaus",
   "Om du lyssnar noga",
   "Murmuris del cor"
  ]
 },
 {
  "id": 103223,
  "name": "Bungou Stray Dogs 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx103223-bfdnnKWxE4YE.jpg",
  "year": 2019,
  "al": [
   "Bungo Stray Dogs 3",
   "Bungou Stray Dogs (2019)",
   "BSD 3",
   "BungouSD 3",
   "คณะประพันธกรจรจัด ภาค 3"
  ]
 },
 {
  "id": 10793,
  "name": "Guilty Crown",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx10793-KCysCbrVNqK9.jpg",
  "year": 2011
 },
 {
  "id": 387,
  "name": "Haibane Renmei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx387-dS4aJivu0zPB.png",
  "year": 2002,
  "al": [
   "Charcoal Feather Federation",
   " Une fille qui a des ailes grises",
   "Ailes Grises",
   "Ali grigie",
   "Haibane renmei: Stowarzyszenie Szaropiórych"
  ]
 },
 {
  "id": 17265,
  "name": "Log Horizon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx17265-RyErURYesjJt.jpg",
  "year": 2013
 },
 {
  "id": 20912,
  "name": "Hibike! Euphonium",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20912-SiiG4HPrjQlX.jpg",
  "year": 2015,
  "al": [
   "Sound! Euphonium",
   "Résonne ! Euphonium"
  ]
 },
 {
  "id": 98437,
  "name": "Overlord II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx98437-5q0GWqHhNAgJ.jpg",
  "year": 2018,
  "al": [
   "Over Lord 2",
   "โอเวอร์ลอร์ด ภาค 2"
  ]
 },
 {
  "id": 15583,
  "name": "Date A Live",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx15583-Sxd2J4RJdRhj.jpg",
  "year": 2013
 },
 {
  "id": 159322,
  "name": "BLEACH: Sennen Kessen-hen - Ketsubetsu-tan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx159322-Sp1GflRhE6Po.jpg",
  "year": 2023,
  "al": [
   "BLEACH: Thousand-Year Blood War - The Separation",
   "BLEACH: Thousand Year Blood War Part 2",
   "BLEACH 千年血戦篇 第2クール",
   "BLEACH TYBW"
  ]
 },
 {
  "id": 137667,
  "name": "Guimi Zhi Zhu: Xiaochou Pian",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx137667-xQxzQRAerw53.jpg",
  "year": null,
  "al": [
   "Lord of Mysteries",
   "Lord of the Mysteries",
   "LOTM",
   "Lord of Mysteries: The Clown",
   "Chúa Tể Huyền Bí",
   "Tuan Misteri"
  ]
 },
 {
  "id": 99629,
  "name": "Satsuriku no Tenshi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99629-BXyAJ6PDq4sr.jpg",
  "year": 2018,
  "al": [
   "Angels of Death",
   "Angel of Massacre",
   "Angel Slaughter"
  ]
 },
 {
  "id": 100643,
  "name": "Made in Abyss: Fukaki Tamashii no Reimei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx100643-fPH9OgEKKvcI.jpg",
  "year": 2020,
  "al": [
   "Made in Abyss: Dawn of the Deep Soul",
   "Made in Abyss: Dawn of a Deep Soul"
  ]
 },
 {
  "id": 790,
  "name": "Ergo Proxy",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx790-YTUCvBKX8ZWK.jpg",
  "year": 2006
 },
 {
  "id": 20626,
  "name": "FAIRY TAIL (2014)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20626-9LTreIofBgnu.jpg",
  "year": 2014,
  "al": [
   "Fairy Tail Series 2",
   "Fairy Tail 2",
   "Fairy Tail Season 2",
   "フェアリーテイル (2014)"
  ]
 },
 {
  "id": 1887,
  "name": "Lucky☆Star",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1887-P36Pucd4qKji.png",
  "year": 2007
 },
 {
  "id": 1689,
  "name": "Byousoku 5 Centimeter",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1689-rJKhjLEjQHSy.jpg",
  "year": 2007,
  "al": [
   "5 Centimeters per Second",
   "Five Centimeters Per Second",
   "Byousoku 5 Centimeter - a chain of short stories about their distance",
   "5 cm per second",
   "5 Centímetros por Segundo",
   "5 centimètres par seconde",
   "Másodpercenként 5 centiméter",
   "5 centimet trên giây",
   "5 centymetrów na sekundę",
   "5 centimetri al secondo",
   "5 сантиметров в секунду"
  ]
 },
 {
  "id": 171457,
  "name": "Make Heroine ga Oosugiru!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx171457-nmMIk0gNiWsm.jpg",
  "year": 2024,
  "al": [
   "Makeine: Too Many Losing Heroines!",
   "Toooooo Many Losing Heroines",
   "Makeine"
  ]
 },
 {
  "id": 21711,
  "name": "91Days",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21711-EQN4sCIXRhKf.png",
  "year": 2016,
  "al": [
   "91 Days",
   "91デイズ"
  ]
 },
 {
  "id": 2034,
  "name": "Lovely★Complex",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx2034-erjg6gzDetAp.png",
  "year": 2007,
  "al": [
   "Love★Com"
  ]
 },
 {
  "id": 103139,
  "name": "Domestic na Kanojo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx103139-2TfvRyGTE1qp.jpg",
  "year": 2019,
  "al": [
   "Domestic Girlfriend",
   "DomeKano"
  ]
 },
 {
  "id": 114308,
  "name": "Sword Art Online: Alicization - War of Underworld Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx114308-8UBiS7U9buzu.jpg",
  "year": 2020,
  "al": [
   "Sword Art Online: Alicization - War of Underworld Last Season",
   "SAOV",
   "SAO5"
  ]
 },
 {
  "id": 156822,
  "name": "Tensei Shitara Slime Datta Ken 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx156822-Jzo2ITWgm4kM.jpg",
  "year": 2024,
  "al": [
   "That Time I Got Reincarnated as a Slime Season 3",
   "Tensura 3",
   "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว ภาค 3",
   "Moi, quand je me réincarne en Slime Saison 3"
  ]
 },
 {
  "id": 108759,
  "name": "Sword Art Online: Alicization - War of Underworld",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx108759-jcXbDf9BJTcb.jpg",
  "year": 2019,
  "al": [
   "SAOIV",
   "SAO4"
  ]
 },
 {
  "id": 14227,
  "name": "Tonari no Kaibutsu-kun",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx14227-VGxPG1xDZG7v.jpg",
  "year": 2012,
  "al": [
   "My Little Monster",
   "Tonari no Kaibutsukun",
   "The Monster Next Door",
   "My Neighbor Monster-kun",
   "Le Garçon d'à coté",
   "Bestia z ławki obok"
  ]
 },
 {
  "id": 66,
  "name": "Azumanga Daiou THE ANIMATION",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx66-ZqYQWl6LsfeI.png",
  "year": 2002,
  "al": [
   "Azumanga Daioh"
  ]
 },
 {
  "id": 184951,
  "name": "Seihantai na Kimi to Boku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx184951-s8Lg2muPBhdX.jpg",
  "year": 2026,
  "al": [
   "You and I Are Polar Opposites",
   "Cậu Và Tớ Là Hai Thái Cực Đối Lập"
  ]
 },
 {
  "id": 128705,
  "name": "Blue Period",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx128705-LqIWVpiwDlDc.jpg",
  "year": 2021,
  "al": [
   "Periodo Azul"
  ]
 },
 {
  "id": 182896,
  "name": "Boku no Hero Academia FINAL SEASON",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx182896-mvxTVHGdDB4q.jpg",
  "year": 2025,
  "al": [
   "My Hero Academia FINAL SEASON",
   "Boku no Hero Academia 8",
   "My Hero Academia 8",
   "BNHA 8",
   "MHA 8",
   "Моя геройская академия 8"
  ]
 },
 {
  "id": 177709,
  "name": "SAKAMOTO DAYS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx177709-e5Qx6RlsBgD5.png",
  "year": 2025
 },
 {
  "id": 98034,
  "name": "Saiki Kusuo no Ψ-nan 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx98034-1eQ4F7SKxVas.jpg",
  "year": 2018,
  "al": [
   "The Disastrous Life of Saiki K. Season 2",
   "Saiki Kusuo no Psi Nan 2"
  ]
 },
 {
  "id": 572,
  "name": "Kaze no Tani no Nausicaä",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx572-ZE3kHBA6U0X1.jpg",
  "year": 1984,
  "al": [
   "Nausicaä of the Valley of the Wind",
   "Nausicaä de la vallée du vent",
   "Nausicaä del Valle del Viento",
   "Nausicaä do Vale do Vento",
   "Rüzgârlı Vadi",
   "Nausicaä della Valle del Vento",
   "Nausicaä z Doliny Wiatru",
   "Nausicaä aus dem Tal der Winde",
   "Vindens Krigare",
   "Nausicaä från Vindarnas dal",
   "Nausicaä - prinsessen fra Vindens dal",
   "Warriors of the Wind (1987 US Release Title)",
   "Navsíka úr dal vindsins"
  ]
 },
 {
  "id": 133844,
  "name": "Overlord IV",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx133844-E32FjKZ0XxEs.jpg",
  "year": 2022,
  "al": [
   "Overlord 4",
   "โอเวอร์ลอร์ด ภาค 4"
  ]
 },
 {
  "id": 97938,
  "name": "BORUTO: NARUTO NEXT GENERATIONS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx97938-BnF6M5yTaNB1.jpg",
  "year": 2017
 },
 {
  "id": 4081,
  "name": "Natsume Yuujinchou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx4081-xi08naD69tjr.jpg",
  "year": 2008,
  "al": [
   "Natsume's Book of Friends Season 1",
   "Natsume Yujincho",
   "Hữu Nhân Sổ - Natsume Yuujinchou",
   "O Livro de Amigos de Natsume"
  ]
 },
 {
  "id": 20994,
  "name": "GATE: Jieitai Kanochi nite, Kaku Tatakaeri",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20994-pSDk4I58jAK5.jpg",
  "year": 2015,
  "al": [
   "Gate"
  ]
 },
 {
  "id": 6594,
  "name": "Katanagatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx6594-xrrFyCacxUle.png",
  "year": 2010,
  "al": [
   "Sword Story"
  ]
 },
 {
  "id": 106479,
  "name": "Itai no wa Iya nano de Bougyoryoku ni Kyokufuri Shitai to Omoimasu.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx106479-JmPk1F5ubMtm.png",
  "year": 2020,
  "al": [
   "BOFURI: I Don't Want to Get Hurt, so I'll Max Out My Defense.",
   "I hate being in pain, so I think I’ll make a full defense build",
   "bofuri",
   "BOFURI: Je ne suis pas venue ici pour souffrir alors j'ai tout mis en défense",
   "Bofuri: Aku Tidak Ingin Terluka Jadi Seluruh Poin Status Kufokuskan ke Pertahanan"
  ]
 },
 {
  "id": 3002,
  "name": "Gyakkyou Burai Kaiji: Ultimate Survivor",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx3002-BExanPfxp888.jpg",
  "year": 2007,
  "al": [
   "Kaiji - Ultimate Survivor",
   "The Suffering Pariah Kaiji: Ultimate Survivor"
  ]
 },
 {
  "id": 155907,
  "name": "Buddy Daddies",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx155907-wY1RqFUHvZ60.jpg",
  "year": 2023
 },
 {
  "id": 136,
  "name": "HUNTER×HUNTER",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx136-gj0bbCpDNrKG.jpg",
  "year": 1999,
  "al": [
   "Hunter x Hunter",
   "ハンターxハンター",
   "HxH"
  ]
 },
 {
  "id": 111734,
  "name": "Given Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx111734-82sWJBotlzE8.png",
  "year": 2020,
  "al": [
   "Given The Movie"
  ]
 },
 {
  "id": 108725,
  "name": "Yakusoku no Neverland 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx108725-ZKivuyr4Jtc9.jpg",
  "year": 2021,
  "al": [
   "The Promised Neverland Season 2",
   "YakuNeba",
   "TPN2",
   "พันธสัญญาเนเวอร์แลนด์ ภาค 2"
  ]
 },
 {
  "id": 101903,
  "name": "Kaze ga Tsuyoku Fuiteiru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101903-ncgPJbbA5Nou.jpg",
  "year": 2018,
  "al": [
   "Run with the Wind",
   "KazeTsuyo"
  ]
 },
 {
  "id": 16592,
  "name": "Danganronpa: Kibou no Gakuen to Zetsubou no Koukousei - The Animation",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16592-mFn1gfMXlKtw.jpg",
  "year": 2013,
  "al": [
   "Danganronpa: The Animation",
   "ダンガンロンパ The Animation",
   "Danganronpa: Academy of Hope and High School Students of Despair THE ANIMATION",
   "Danganronpa: Sekolah Harapan dan Murid yang Putus Asa"
  ]
 },
 {
  "id": 129898,
  "name": "Sekai Saikou no Ansatsusha, Isekai Kizoku ni Tensei suru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx129898-FRUzDtPhRigt.jpg",
  "year": 2021,
  "al": [
   "The World's Finest Assassin Gets Reincarnated in Another World as an Aristocrat",
   "Ansatsu Kizoku",
   "Pembunuh Terhebat di Dunia Reinkarnasi Menjadi Bangsawan Dunia lain"
  ]
 },
 {
  "id": 9260,
  "name": "Kizumonogatari I: Tekketsu-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx9260-cl7sczYOpTeW.png",
  "year": 2016,
  "al": [
   "Kizumonogatari Part 1: Tekketsu",
   "Wound Tale 1: Iron Blood"
  ]
 },
 {
  "id": 167152,
  "name": "Yuusha Kei ni Shosu: Choubatsu Yuusha 9004-tai Keimu Kiroku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx167152-O1pm6DWwifBD.jpg",
  "year": 2026,
  "al": [
   "Sentenced to Be a Hero",
   "ผู้กล้าโทษประหาร : บันทึกการรับโทษของหน่วยผู้กล้าต้องโทษ 9004"
  ]
 },
 {
  "id": 163132,
  "name": "Horimiya: piece",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx163132-C220CO5UrTxY.jpg",
  "year": 2023,
  "al": [
   "Horimiya: The Missing Pieces"
  ]
 },
 {
  "id": 100178,
  "name": "Liz to Aoi Tori",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx100178-MVATisQLOhkp.png",
  "year": 2018,
  "al": [
   "Liz and the Blue Bird",
   "Liz und ein Blauer Vogel",
   " Liz et l'Oiseau bleu",
   "Liz und der Blaue Vogel"
  ]
 },
 {
  "id": 1943,
  "name": "Paprika",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b1943-jMCEYL1Ixmgc.png",
  "year": 2006,
  "al": [
   "Paprika: El reino de los sueños"
  ]
 },
 {
  "id": 530,
  "name": "Bishoujo Senshi Sailor Moon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx530-O8q6KpJ244Qk.jpg",
  "year": 1992,
  "al": [
   "Sailor Moon",
   "Pretty Soldier Sailor Moon",
   "Czarodziejka z Księżyca",
   "Navegante da Lua",
   "Sailor Moon - Das Mädchen mit den Zauberkräften"
  ]
 },
 {
  "id": 113260,
  "name": "Tian Guan Ci Fu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113260-4LPAAKCSJe8f.jpg",
  "year": null,
  "al": [
   "Heaven Official's Blessing",
   "Tenkan Tamamono Fuku",
   "La bendición del oficial del cielo"
  ]
 },
 {
  "id": 151384,
  "name": "Kaguya-sama wa Kokurasetai: First Kiss wa Owaranai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151384-gv0q8wOE6D58.jpg",
  "year": 2023,
  "al": [
   "Kaguya-sama: Love is War -The First Kiss That Never Ends-",
   "Kaguya-sama: Love is War Movie",
   "Kaguya-sama: Cuộc chiến tỏ tình - Nụ hôn đầu không hồi kết"
  ]
 },
 {
  "id": 141014,
  "name": "Tomodachi Game",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx141014-bTWr7TtS0wt9.jpg",
  "year": 2022,
  "al": [
   "Friend Game",
   "Tomodachi Game: Los juegos de la amistad"
  ]
 },
 {
  "id": 107717,
  "name": "Kobayashi-san Chi no Maidragon S",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx107717-bixaW1NTGBra.jpg",
  "year": 2021,
  "al": [
   "Miss Kobayashi's Dragon Maid S",
   "小林家的龙女仆 S",
   "น้องเมดมังกรของคุณโคบายาชิ ภาค 2",
   " Kobayashi-san Chi no Maid Dragon 2nd Season"
  ]
 },
 {
  "id": 99749,
  "name": "FAIRY TAIL (2018)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx99749-tvz2LCPdMyrp.jpg",
  "year": 2018,
  "al": [
   "Fairy Tail Final Season",
   "Fairy Tail 3",
   "Fairy Tail Series 3",
   "フェアリーテイル (2018)"
  ]
 },
 {
  "id": 127911,
  "name": "Kawaii dake ja Nai Shikimori-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx127911-qfJDzUt0qCna.jpg",
  "year": 2022,
  "al": [
   "Shikimori's Not Just a Cutie",
   "Shikimori n'est pas juste mignonne",
   "Shikimori Không Chỉ Dễ Thương Thôi Đâu",
   "SHIKIMORI Tidak Hanya Manis"
  ]
 },
 {
  "id": 164212,
  "name": "GIRLS BAND CRY",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx164212-eKh15LQxkTEx.jpg",
  "year": 2024,
  "al": [
   "Garukura",
   "GBC"
  ]
 },
 {
  "id": 151806,
  "name": "Tomo-chan wa Onnanoko!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151806-IAMi2ctI5xJI.jpg",
  "year": 2023,
  "al": [
   "Tomo-chan Is a Girl!",
   "Tomo-chan wa Onna no ko!"
  ]
 },
 {
  "id": 2246,
  "name": "Mononoke",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx2246-WHkSkgyuxfgD.jpg",
  "year": 2007
 },
 {
  "id": 849,
  "name": "Suzumiya Haruhi no Yuuutsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx849-wQM3GqLvl62P.png",
  "year": 2006,
  "al": [
   "The Melancholy of Haruhi Suzumiya",
   "La Malinconia Di Haruhi Suzumiya",
   "La mélancolie de Haruhi Suzumiya",
   "Melancholia Haruhi Suzumiyi"
  ]
 },
 {
  "id": 98202,
  "name": "Tsuki ga Kirei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx98202-H6RtsIMZPALF.png",
  "year": 2017,
  "al": [
   "Tsukigakirei",
   "as the moon, so beautiful."
  ]
 },
 {
  "id": 6675,
  "name": "REDLINE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx6675-NF4tFzAxSjkj.png",
  "year": 2009,
  "al": [
   "Red line"
  ]
 },
 {
  "id": 21428,
  "name": "Hai to Gensou no Grimgar",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21428-dFVIHeZ8McBe.jpg",
  "year": 2016,
  "al": [
   "Grimgar of Fantasy and Ash",
   "Grimgar",
   "  Ashes and Illusions"
  ]
 },
 {
  "id": 146066,
  "name": "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx146066-zzKl6P6OeEjy.jpg",
  "year": 2024,
  "al": [
   "Classroom of the Elite Season 3",
   "You-Zitsu 3",
   "Youjitsu 3",
   "ขอต้อนรับสู่ห้องเรียนนิยม (เฉพาะ) ยอดคน ภาค 3",
   "Classroom of the Elite III",
   "Cote 3"
  ]
 },
 {
  "id": 103632,
  "name": "Kumo desu ga, Nani ka?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx103632-2wsy9wFUdm1C.jpg",
  "year": 2021,
  "al": [
   "So I'm a Spider, So What?",
   "Tôi Là Nhện Đấy, Có Sao Không?"
  ]
 },
 {
  "id": 158927,
  "name": "SPY×FAMILY Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b158927-lfO85WVguYgc.png",
  "year": 2023,
  "al": [
   "SPY x FAMILY Season 2",
   "SxF 2",
   "スパイファミリー 2",
   "Spy x Family – Sezon 2"
  ]
 },
 {
  "id": 112609,
  "name": "Majo no Tabitabi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx112609-hBCbnYlEHluz.jpg",
  "year": 2020,
  "al": [
   "Wandering Witch: The Journey of Elaina",
   "MajoTabi",
   "Elainas Reise"
  ]
 },
 {
  "id": 182205,
  "name": "Tensei Shitara Slime Datta Ken 4th Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx182205-q2AeO1owuQbO.jpg",
  "year": 2026,
  "al": [
   "That Time I Got Reincarnated as a Slime Season 4",
   "Tensura 4",
   "転スラ 4",
   "Aquella vez que me convertí en slime - Temporada 4",
   "Moi, quand je me réincarne en Slime Saison 4"
  ]
 },
 {
  "id": 513,
  "name": "Tenkuu no Shiro Laputa",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx513-yM7Dlt65N4Rl.jpg",
  "year": 1986,
  "al": [
   "Castle in the Sky",
   "Tenkuu no Shiro Rapyuta",
   "Das Schloss im Himmel",
   "El Castillo en el Cielo",
   "O Castelo no Céu",
   "Le Château dans le ciel",
   "Gökteki Kale",
   "Laputa - Castello nel cielo",
   "Castello nel cielo",
   "Laputa: Zámek v oblacích",
   "Laputa – podniebny zamek",
   "Laputa - Himmelslottet ",
   "Laputa - Az égi palota",
   "Laputa – slottet i himlen",
   "Laputa: fljúgandi kastalinn"
  ]
 },
 {
  "id": 109298,
  "name": "Eizouken ni wa Te wo Dasu na!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx109298-suwdIUbJEPJx.png",
  "year": 2020,
  "al": [
   "Keep Your Hands Off Eizouken!",
   "Don't mess with the Motion Picture Club!",
   "Hands off the Motion Picture Club!",
   "Ước mơ sản xuất anime"
  ]
 },
 {
  "id": 178789,
  "name": "Mushoku Tensei III: Isekai Ittara Honki Dasu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx178789-hNXjKFzUq7mk.jpg",
  "year": 2026,
  "al": [
   "Mushoku Tensei: Jobless Reincarnation Season 3",
   "無職転生 ～異世界行ったら本気だす～ 第3期",
   "Mushoku Tensei: Isekai Ittara Honki Dasu 3rd Season"
  ]
 },
 {
  "id": 114232,
  "name": "Hige wo Soru. Soshite Joshikousei wo Hirou.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx114232-2rm50ZD1cQgP.jpg",
  "year": 2021,
  "al": [
   "Higehiro: After Being Rejected, I Shaved and Took in a High School Runaway",
   "Higehiro",
   "I Shaved My Beard Then Picked Up a High School Girl.",
   "HIGEHIRO: Kucukur Janggut, Siswi SMA Kupungut"
  ]
 },
 {
  "id": 136804,
  "name": "Kono Subarashii Sekai ni Shukufuku wo! 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx136804-7FVftG67FPBc.jpg",
  "year": 2024,
  "al": [
   "KONOSUBA -God's blessing on this wonderful world! 3",
   "Konosuba 3",
   "ขอให้โชคดีมีชัยในโลกแฟนตาซี! ภาค 3",
   "Konosuba! Un mundo maravilloso 3"
  ]
 },
 {
  "id": 169755,
  "name": "BLEACH: Sennen Kessen-hen - Soukoku-tan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx169755-Rqb7MjnzdTc6.jpg",
  "year": 2024,
  "al": [
   "BLEACH: Thousand-Year Blood War - The Conflict",
   "BLEACH: Thousand Year Blood War Part 3",
   "BLEACH 千年血戦篇 第3クール",
   "BLEACH TYBW"
  ]
 },
 {
  "id": 18115,
  "name": "Magi: The kingdom of magic",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx18115-dilbAD4yGMfc.png",
  "year": 2013,
  "al": [
   "Magi: The Labyrinth of Magic 2",
   "マギ The labyrinth of magic 2"
  ]
 },
 {
  "id": 105156,
  "name": "Shinchou Yuusha: Kono Yuusha ga Ore TUEEE Kuse ni Shinchou Sugiru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx105156-ZVtxISdoUqnY.png",
  "year": 2019,
  "al": [
   "Cautious Hero: The Hero Is Overpowered but Overly Cautious",
   "This Hero is Invincible but \"Too Cautious\"",
   "Shinchou Yuusha"
  ]
 },
 {
  "id": 126288,
  "name": "Sasaki to Miyano",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx126288-v9RNANkv2JEi.jpg",
  "year": 2022,
  "al": [
   "Sasaki and Miyano",
   "Sasaki i Miyano"
  ]
 },
 {
  "id": 21718,
  "name": "Fate/stay night [Heaven's Feel] II. lost butterfly",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21718-Hjj26Sapx1bd.jpg",
  "year": 2019,
  "al": [
   "Fate/HF II",
   "Судьба/Ночь схватки: Прикосновение небес 2"
  ]
 },
 {
  "id": 162694,
  "name": "Kimi no Koto ga Dai Dai Dai Dai Daisuki na 100-nin no Kanojo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx162694-QFBei5pbjSh8.png",
  "year": 2023,
  "al": [
   "The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You",
   "100 Kanojo",
   "100Kano",
   "Hyakkano",
   "100 Namoradas Que Te Amam Muuuuuito",
   "Les 100 petites amies qui t'aiiiment à en mourir",
   "100 Pacar yang Sungguh Sangat Amat Benar-benar Mencintaimu",
   "100 девушек, которые очень-очень-очень-очень-очень сильно тебя любят",
   "100 Cô Bạn Gái Yêu Bạn Rất Rất Rất Rất Rất Nhiều"
  ]
 },
 {
  "id": 101302,
  "name": "Dragon Ball Super: Broly",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101302-7L0lcwYeFQQM.jpg",
  "year": 2018
 },
 {
  "id": 166613,
  "name": "Jigokuraku 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx166613-uHB8q3D4qbon.jpg",
  "year": 2026,
  "al": [
   "Hell’s Paradise Season 2",
   "Hell’s Paradise: Jigokuraku Season 2"
  ]
 },
 {
  "id": 146722,
  "name": "JoJo no Kimyou na Bouken: Stone Ocean Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx146722-hiZU7M33fBhn.jpg",
  "year": 2022,
  "al": [
   "JoJo's Bizarre Adventure: STONE OCEAN Part 2",
   "JoJo's Bizarre Adventure Part 6 (Part 2)",
   "JoJo no Kimyou na Bouken Part 6 (Part 2)",
   "JoJo's Bizarre Adventure: STONE OCEAN The Final Episodes"
  ]
 },
 {
  "id": 99539,
  "name": "Nanatsu no Taizai: Imashime no Fukkatsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99539-caPX28RSsgRP.jpg",
  "year": 2018,
  "al": [
   "The Seven Deadly Sins: Revival of the Commandments",
   "The Seven Deadly Sins: Die Rückkehr der Gebote",
   "ศึกตำนาน 7 อัศวิน ภาค 2 คืนชีพบัญญัติสิบประการ",
   "The Seven Deadly Sins: Odrodzenie przykazań"
  ]
 },
 {
  "id": 116566,
  "name": "Akudama Drive",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx116566-PPIVQt359vQY.jpg",
  "year": 2020
 },
 {
  "id": 21421,
  "name": "Kiznaiver",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21421-5y8ryXsMB7aJ.jpg",
  "year": 2016
 },
 {
  "id": 2025,
  "name": "DARKER THAN BLACK: Kuro no Keiyakusha",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b2025-ZKVteVzUyFLH.png",
  "year": 2007,
  "al": [
   "Darker than Black",
   "DARKER THAN BLACK -Black Contractor-",
   "Bí Mật Bóng Tối",
   "Brama piekieł"
  ]
 },
 {
  "id": 16662,
  "name": "Kaze Tachinu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16662-HUI8irtoTdOJ.jpg",
  "year": 2013,
  "al": [
   "The Wind Rises",
   "El Viento se Levanta",
   "Si Alza il Vento",
   "Szél támad",
   "Zrywa się wiatr",
   "Wie der Wind sich hebt",
   "Le vent se lève",
   "Vidas ao vento",
   "Vinden Stiger",
   "Det Blåser upp en Vind",
   "Vindurinn Rís"
  ]
 },
 {
  "id": 101167,
  "name": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101167-Yasvj97UR9ue.png",
  "year": 2019,
  "al": [
   "Is It Wrong to Try to Pick Up Girls in a Dungeon? II",
   "Danmachi II",
   "ダンジョンに出会いを求めるのは間違っているだろうか2",
   "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka 2",
   "Dungeon ni Deai o Motomeru no wa Machigatte Iru Darouka: Familia Myth II"
  ]
 },
 {
  "id": 163139,
  "name": "Boku no Hero Academia 7",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx163139-JchZhUFlNTWU.jpg",
  "year": 2024,
  "al": [
   "My Hero Academia Season 7",
   "BNHA 7",
   "MHA 7",
   "Моя геройская академия 7"
  ]
 },
 {
  "id": 8795,
  "name": "Panty & Stocking with Garterbelt",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx8795-485Q8MOYeMZx.png",
  "year": 2010,
  "al": [
   "PanSto",
   "PSG",
   "P&SWG"
  ]
 },
 {
  "id": 100077,
  "name": "Hinamatsuri",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx100077-FgGYIt8gGyrn.jpg",
  "year": 2018
 },
 {
  "id": 100240,
  "name": "Tokyo Ghoul:re",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx100240-vJNaKd5HwPJ2.jpg",
  "year": 2018
 },
 {
  "id": 201903,
  "name": "Chou Kaguya-hime!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx201903-v43gxQKw8Tc8.jpg",
  "year": 2026,
  "al": [
   "Cosmic Princess Kaguya!",
   "La princesa Kaguya del cosmos",
   "Kaguya, princesse cosmique",
   "Kaguya: A Princesa Espacial",
   "Cosmica prințesă Kaguya!",
   "CPK",
   "Kaguya – Công chúa vũ trụ!"
  ]
 },
 {
  "id": 147103,
  "name": "Watashi no Shiawase na Kekkon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx147103-Om2LOXlhHNAe.png",
  "year": 2023,
  "al": [
   "My Happy Marriage",
   "WataKon",
   "Moje szczęśliwe małżeństwo",
   "Hôn nhân hạnh phúc của tôi",
   "Meu Casamento Feliz",
   "Il mio matrimonio felice",
   "Mi feliz matrimonio",
   "Meine ganz besondere Hochzeit"
  ]
 },
 {
  "id": 99468,
  "name": "Karakai Jouzu no Takagi-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99468-XayCplkIL3Gf.png",
  "year": 2018,
  "al": [
   "Teasing Master Takagi-san",
   "Skilled Teaser Takagi-san",
   "Takagi-san: Experta en Bromas Pesadas",
   "Nhất quỷ Nhì ma, Thứ ba Takagi",
   "Nicht schon wieder, Takagi-san"
  ]
 },
 {
  "id": 10721,
  "name": "Mawaru Penguindrum",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx10721-lNEbDPX24qzn.jpg",
  "year": 2011,
  "al": [
   "Penguindrum"
  ]
 },
 {
  "id": 18507,
  "name": "Free!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx18507-RajfCYPpBfT3.png",
  "year": 2013,
  "al": [
   "Free! -Iwatobi Swim Club-"
  ]
 },
 {
  "id": 323,
  "name": "Mousou Dairinin",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx323-ZGkUcJOn4ngy.png",
  "year": 2004,
  "al": [
   "Paranoia Agent"
  ]
 },
 {
  "id": 486,
  "name": "Kino no Tabi: the Beautiful World",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx486-xXUgNOEBuxGs.jpg",
  "year": 2003,
  "al": [
   "Kino's Journey",
   "Kino's Travels: The Beautiful World",
   "L'Odyssée de Kino",
   "Kinos Resa"
  ]
 },
 {
  "id": 182300,
  "name": "Tsue to Tsurugi no Wistoria Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx182300-IYkq5KrkQq1V.jpg",
  "year": 2026,
  "al": [
   "Wistoria: Wand and Sword Season 2",
   "ตำนานดาบและคทาแห่งวิสตอเรีย ซีซั่น 2",
   "Tongkat Sihir dan Pedang Wistoria Season 2"
  ]
 },
 {
  "id": 131518,
  "name": "Dr. STONE: NEW WORLD",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx131518-RU7RoUmGb2sP.jpg",
  "year": 2023,
  "al": [
   "Dr.STONE Season 3",
   "DR.STONE ภาค 3",
   "Dr. STONE 新石紀（第三季）"
  ]
 },
 {
  "id": 111321,
  "name": "Tate no Yuusha no Nariagari Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx111321-dIr3dEKOIPer.png",
  "year": 2022,
  "al": [
   "The Rising of the Shield Hero Season 2",
   "ผู้กล้าโล่ผงาด ภาค 2"
  ]
 },
 {
  "id": 114963,
  "name": "Nakitai Watashi wa Neko wo Kaburu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx114963-QWMbi5ttovSK.png",
  "year": 2020,
  "al": [
   "A Whisker Away",
   "Nakineko",
   "Amor de Gata",
   "Loin de moi, près de toi",
   "Olhos de Gato",
   "Um ein Schnurrhaar",
   "Miyo - Un amore felino"
  ]
 },
 {
  "id": 268,
  "name": "GOLDEN BOY: Sasurai no Obenkyou Yarou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx268-0T6bdW9CzVvz.png",
  "year": 1995,
  "al": [
   "GOLDEN BOY"
  ]
 },
 {
  "id": 112124,
  "name": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka III",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx112124-ZmoOntBuiSUU.jpg",
  "year": 2020,
  "al": [
   "Is It Wrong to Try to Pick Up Girls in a Dungeon? III",
   "ダンジョンに出会いを求めるのは間違っているだろうか FAMILIA MYTH III",
   "Dungeon ni Deai o Motomeru no wa Machigatte Iru Darouka: Familia Myth III",
   "Danmachi III",
   "มันผิดรึไงถ้าใจอยากจะพบรักในดันเจี้ยน ภาค 3"
  ]
 },
 {
  "id": 99699,
  "name": "Golden Kamuy",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99699-mBCjpoWpAVGX.jpg",
  "year": 2018,
  "al": [
   "Golden Kamui"
  ]
 },
 {
  "id": 114888,
  "name": "Fugou Keiji: Balance:UNLIMITED",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx114888-lgecUF3O1AWS.png",
  "year": 2020,
  "al": [
   "The Millionaire Detective - Balance: UNLIMITED"
  ]
 },
 {
  "id": 101972,
  "name": "Modao Zushi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx101972-dep8Bcte5jQd.jpg",
  "year": null,
  "al": [
   "The Founder of Diabolism",
   "Mo Dao Zu Shi",
   "Grandmaster of Demonic Cultivation",
   "The Founder of Evil Magic",
   "Madou Soshi",
   "The Untamed",
   "The Master of Diabolism"
  ]
 },
 {
  "id": 20993,
  "name": "Owari no Seraph: Nagoya Kessen-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20993-c34UTma2bCcv.jpg",
  "year": 2015,
  "al": [
   "Seraph of the End: Battle in Nagoya",
   "OwaSera 2",
   "Seraph of the End: El Reino de los Vampiros",
   "เทวทูตแห่งโลกมืด ภาค 2"
  ]
 },
 {
  "id": 527,
  "name": "Pocket Monsters",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b527-t6dBVJ5OVcXK.png",
  "year": 1997,
  "al": [
   "Pokémon",
   "Pokémon the Series",
   "Pokémon: Indigo League",
   "Pokémon: Adventures on the Orange Islands",
   "Pokémon: The Johto Journeys",
   "Pokémon: Johto League Champions",
   "Pokémon: Master Quest",
   "Pokémon Serien: Begynnelsen",
   "Serial Pokémon: Liga Indigo"
  ]
 },
 {
  "id": 10800,
  "name": "Chihayafuru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx10800-hofcUL0YEL7O.png",
  "year": 2011,
  "al": [
   "Chihayafull"
  ]
 },
 {
  "id": 99425,
  "name": "Promare",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99425-CQ500X23zp4i.png",
  "year": 2019
 },
 {
  "id": 21399,
  "name": "Kizumonogatari II: Nekketsu-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21399-VTAdAqc8u5AE.png",
  "year": 2016,
  "al": [
   "Kizumonogatari Part 2: Nekketsu",
   "Wound Tale 2: Hot Blood"
  ]
 },
 {
  "id": 20725,
  "name": "Kuroko no Basket 3rd SEASON",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20725-DLu8VlkGFQKc.png",
  "year": 2015,
  "al": [
   "Kuroko's Basketball 3",
   "Kuroko no Basuke 3",
   "הכדורסל של קורוקו 3"
  ]
 },
 {
  "id": 1604,
  "name": "Katekyou Hitman REBORN!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1604-W2q38L4OCGLI.png",
  "year": 2006,
  "al": [
   "REBORN!",
   "Katekyo Hitman Reborn!",
   "Gia sư HITMAN REBORN! "
  ]
 },
 {
  "id": 99088,
  "name": "PLUTO",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99088-LTJskMD1wbbQ.png",
  "year": 2023
 },
 {
  "id": 179966,
  "name": "Silent Witch: Chinmoku no Majo no Kakushigoto",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx179966-g0EU7rVe2Og7.jpg",
  "year": 2025,
  "al": [
   "Secrets of the Silent Witch",
   "Silent Witch 沉默魔女的祕密"
  ]
 },
 {
  "id": 21701,
  "name": "Kuzu no Honkai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21701-j81oh6WCNlsQ.jpg",
  "year": 2017,
  "al": [
   "Scum's Wish",
   "Desejos Proibidos",
   "El deseo de la escoria"
  ]
 },
 {
  "id": 98503,
  "name": "Gakuen Babysitters",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx98503-oUCGDkv2osNK.jpg",
  "year": 2018,
  "al": [
   "School Babysitters"
  ]
 },
 {
  "id": 166610,
  "name": "MASHLE: Kami Shinkakusha Kouho Senbatsu Shiken-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx166610-S5q7V2v5zdDK.jpg",
  "year": 2024,
  "al": [
   "MASHLE: MAGIC AND MUSCLES Season 2",
   "マッシュル-MASHLE- 第2期",
   "MASHLE 2nd Season",
   "MASHLE: MAGIC AND MUSCLES - The Divine Visionary Candidate Exam Arc",
   "肌肉魔法使-MASHLE- 神覺者候補選拔試驗篇"
  ]
 },
 {
  "id": 104647,
  "name": "Otome Game no Hametsu Flag shika Nai Akuyaku Reijou ni Tensei shiteshimatta…",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx104647-dMGZSavRxHcM.jpg",
  "year": 2020,
  "al": [
   "My Next Life as a Villainess: All Routes Lead to Doom!",
   "I Reincarnated into an Otome Game as a Villainess With Only Destruction Flags..",
   "Hamefura",
   "Hamehura",
   "Bakarina",
   "转生成为了只有乙女游戏破灭Flag的邪恶大小姐…"
  ]
 },
 {
  "id": 100112,
  "name": "Kenja no Mago",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx100112-eExFpnYG2QAK.jpg",
  "year": 2019,
  "al": [
   "Wise Man’s Grandchild",
   "The Wise Grandson",
   "The Sage's Grandson",
   "Philosopher's Grandson",
   "Magi's Grandson"
  ]
 },
 {
  "id": 102351,
  "name": "Tokyo Ghoul:re 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx102351-yD3Ty9YZFMsf.jpg",
  "year": 2018
 },
 {
  "id": 21518,
  "name": "Shokugeki no Souma: Ni no Sara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21518-uBqzDGIuSxJ5.jpg",
  "year": 2016,
  "al": [
   "Food Wars! The Second Plate",
   "ยอดนักปรุงโซมะ ภาค 2"
  ]
 },
 {
  "id": 156067,
  "name": "Tondemo Skill de Isekai Hourou Meshi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx156067-Jovklss4VWIx.jpg",
  "year": 2023,
  "al": [
   "Campfire Cooking in Another World with my Absurd Skill",
   "Regarding the Display of an Outrageous Skill Which Has Incredible Powers",
   "Gourmet Adventure of Legendary Tamer",
   "Mengembara dan Memasak di Dunia Lain dengan Skil yang Absurd",
   "Hero Skill - Achats en ligne"
  ]
 },
 {
  "id": 21403,
  "name": "Sword Art Online: Ordinal Scale",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx21403-k8DZhZ3x1BCO.png",
  "year": 2017,
  "al": [
   "Sword Art Online the Movie: Ordinal Scale",
   "SAO THE MOVIE"
  ]
 },
 {
  "id": 182587,
  "name": "[Oshi no Ko] 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx182587-fsU8LOjmd7oj.jpg",
  "year": 2026,
  "al": [
   "OSHI NO KO Season 3"
  ]
 },
 {
  "id": 108268,
  "name": "Honzuki no Gekokujou: Shisho ni Naru Tame ni wa Shudan wo Erandeiraremasen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx108268-Dtt82uOi3vq5.jpg",
  "year": 2019,
  "al": [
   "Ascendance of a Bookworm",
   "Ascendance of a Bookworm: I'll do anything to become a librarian"
  ]
 },
 {
  "id": 20946,
  "name": "Ore Monogatari!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20946-ejH7JhG6z25y.png",
  "year": 2015,
  "al": [
   "My Love Story!!",
   "Mon Histoire"
  ]
 },
 {
  "id": 153930,
  "name": "Romantic Killer",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153930-uTRxaIcNa26E.jpg",
  "year": 2022,
  "al": [
   "La asesina del romance"
  ]
 },
 {
  "id": 142984,
  "name": "Komi-san wa, Komyushou desu. 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx142984-nv2MWVWZ1yYH.jpg",
  "year": 2022,
  "al": [
   "Komi Can't Communicate Part 2",
   "Komi Can't Communicate Season 2",
   "โฉมงามพูดไม่เก่งกับผองเพื่อนไม่เต็มเต็ง ภาค 2"
  ]
 },
 {
  "id": 16067,
  "name": "Nagi no Asukara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16067-CFX0g435pLob.png",
  "year": 2013,
  "al": [
   "A Lull in the Sea",
   "NagiAsu",
   "Nagi no Asu Kara: Calmaria do Mar",
   "Nagi no Asukara: Calma en el mar",
   "From a calm tomorrow"
  ]
 },
 {
  "id": 112788,
  "name": "Umibe no Étranger",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx112788-yzq8eEwO6wan.jpg",
  "year": 2020,
  "al": [
   "The Stranger by the Shore",
   "Seaside Stranger",
   "L'Étranger de la plage",
   "The Stranger by the Beach"
  ]
 },
 {
  "id": 131520,
  "name": "Go-toubun no Hanayome Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx131520-89Qfo8JnGHI3.png",
  "year": 2022,
  "al": [
   "The Quintessential Quintuplets Movie",
   "5-toubun no Hanayome Movie",
   "Eiga Go-toubun no Hanayome",
   "เจ้าสาวผมเป็นแฝดห้า The Movie"
  ]
 },
 {
  "id": 885,
  "name": "Tenshi no Tamago",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx885-UqlerD6tJKxs.png",
  "year": 1985,
  "al": [
   "Angel's Egg"
  ]
 },
 {
  "id": 6880,
  "name": "Deadman Wonderland",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx6880-qZ1jIqIYpST2.png",
  "year": 2011
 },
 {
  "id": 146850,
  "name": "Isekai Nonbiri Nouka",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx146850-xfeAFIE0M9hl.jpg",
  "year": 2023,
  "al": [
   "Farming Life in Another World",
   " ISEKAI FARMING - Vita contadina in un altro mondo"
  ]
 },
 {
  "id": 101004,
  "name": "Isekai Maou to Shoukan Shoujo no Dorei Majutsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101004-rJLBIWGypbYK.png",
  "year": 2018,
  "al": [
   "How NOT to Summon a Demon Lord",
   "The King of Darkness Another World Story"
  ]
 },
 {
  "id": 17549,
  "name": "Non Non Biyori",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx17549-ROdV36u4nWkU.png",
  "year": 2013
 },
 {
  "id": 169580,
  "name": "Class de 2-banme ni Kawaii Onnanoko to Tomodachi ni Natta",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx169580-nXxpmqu6UVux.jpg",
  "year": 2026,
  "al": [
   "I Made Friends with the Second Prettiest Girl in My Class",
   "I Became Friends with the Second Cutest Girl in My Class",
   "Kuranika"
  ]
 },
 {
  "id": 142769,
  "name": "Natsu e no Tunnel, Sayonara no Deguchi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx142769-kNyyqpwC9gGV.jpg",
  "year": 2022,
  "al": [
   "The Tunnel to Summer, the Exit of Goodbyes",
   "Natsuton",
   "El túnel de los deseos",
   "Đường hầm tới mùa hạ, lối thoát của biệt ly"
  ]
 },
 {
  "id": 153845,
  "name": "Isekai de Cheat Skill wo Te ni Shita Ore wa, Genjitsu Sekai wo mo Musou Suru: Level Up wa Jinsei wo Kaeta",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153845-C47aoKy7wf19.jpg",
  "year": 2023,
  "al": [
   "I Got a Cheat Skill in Another World and Became Unrivaled in The Real World, Too",
   "I Got a Cheat Ability in a Different World, and Became Extraordinary Even in the Real World",
   "Isekai de Cheat Nouryoku Ote ni Shita Ore wa, Genjitsu Sekai o mo Musou Suru",
   "Ganhei um Poder Apelão em Outro Mundo e Agora Sou Imbatível no Mundo Real",
   "Iseleve",
   "Skill Nge-Cheat yang Kudapat di Dunia Lain Juga Membuatku Tanpa Tanding di Dunia Asal"
  ]
 },
 {
  "id": 108553,
  "name": "Boku no Hero Academia THE MOVIE: Heroes:Rising",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx108553-yOLfFogpWnTF.jpg",
  "year": 2019,
  "al": [
   "My Hero Academia: Heroes Rising",
   "Boku no Hero Academia the Movie 2",
   "My Hero Academia: El Despertar de los Héroes"
  ]
 },
 {
  "id": 21460,
  "name": "Hibike! Euphonium 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21460-B52Z2pICE11i.png",
  "year": 2016,
  "al": [
   "Sound! Euphonium 2",
   "Résonne ! Euphonium 2"
  ]
 },
 {
  "id": 20910,
  "name": "Shimoneta to Iu Gainen ga Sonzai Shinai Taikutsu na Sekai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20910-U7txwG3o9gma.jpg",
  "year": 2015,
  "al": [
   "SHIMONETA: A Boring World Where the Concept of Dirty Jokes Doesn’t Exist",
   "Shimoseka"
  ]
 },
 {
  "id": 109190,
  "name": "Violet Evergarden Gaiden: Eien to Jidou Shuki Ningyou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx109190-e8mv1qdmpjLW.jpg",
  "year": 2019,
  "al": [
   "Violet Evergarden: Eternity and the Auto Memory Doll",
   "Violet Evergarden und das Band der Freundschaft",
   "Violet Evergarden Gaiden: La Eternidad y la Muñeca de Recuerdos Automáticos",
   "Violet Evergarden Gaiden: Eternidade e a Boneca de Automemória",
   "Violet Evergarden: Věčnost a Píšící panenka",
   "Violet Evergarden : Éternité et la Poupée de Souvenirs Automatiques"
  ]
 },
 {
  "id": 2236,
  "name": "Toki wo Kakeru Shoujo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx2236-tH5fWFkHyVGg.png",
  "year": 2006,
  "al": [
   "The Girl Who Leapt Through Time",
   "Toki wo Kakeru Shojo",
   "TokiKake",
   "The Girl Who Cut Time",
   "Das Mädchen, das durch die Zeit sprang ",
   "La Chica que Saltaba a Través del Tiempo",
   "A Garota que Conquistou o Tempo",
   "La Traversée du temps",
   "La ragazza che saltava nel tempo",
   "O dziewczynie skaczącej przez czas"
  ]
 },
 {
  "id": 139518,
  "name": "Tsuki ga Michibiku Isekai Douchuu 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx139518-GZWYKM8Kg1S2.png",
  "year": 2024,
  "al": [
   "TSUKIMICHI -Moonlit Fantasy- Season 2",
   "จันทรานำพาสู่ต่างโลก ภาค 2"
  ]
 },
 {
  "id": 11887,
  "name": "Kokoro Connect",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11887-ypZTwcRqopiL.jpg",
  "year": 2012,
  "al": [
   "Kokoroco"
  ]
 },
 {
  "id": 21700,
  "name": "Rokudenashi Majutsu Koushi to Akashic Records",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21700-HhTEXPZKxupP.jpg",
  "year": 2017,
  "al": [
   "Akashic Records of Bastard Magic Instructor",
   "RokuAka"
  ]
 },
 {
  "id": 21262,
  "name": "Owarimonogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx21262-jfbv9hvjymMW.jpg",
  "year": 2015,
  "al": [
   "End Tale"
  ]
 },
 {
  "id": 137908,
  "name": "Chiyu Mahou no Machigatta Tsukaikata",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx137908-50af3lKVbst2.jpg",
  "year": 2024,
  "al": [
   "The Wrong Way to Use Healing Magic",
   "Penggunaan Sihir Penyembuh yang Keliru",
   "Cách dùng sai của ma thuật chữa trị"
  ]
 },
 {
  "id": 190327,
  "name": "JoJo no Kimyou na Bouken: Steel Ball Run - 1st STAGE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx190327-riJNCFL7w9y4.jpg",
  "year": 2026,
  "al": [
   "STEEL BALL RUN JoJo's Bizarre Adventure 1st STAGE",
   "JoJo's Bizarre Adventure: Part 7–Steel Ball Run",
   "SBR"
  ]
 },
 {
  "id": 103871,
  "name": "Zombie Land Saga",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx103871-KEWbn3fkz499.png",
  "year": 2018,
  "al": [
   "Zombieland Saga"
  ]
 },
 {
  "id": 16894,
  "name": "Kuroko no Basket 2nd SEASON",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16894-iXt8GDs1L6dr.jpg",
  "year": 2013,
  "al": [
   "Kuroko's Basketball 2",
   "Kuroko no Basuke 2",
   "הכדורסל של קורוקו 2"
  ]
 },
 {
  "id": 21857,
  "name": "Masamune-kun no Revenge",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/nx21857-haPDVD7DKDpg.jpg",
  "year": 2017,
  "al": [
   "Masamune-kun's Revenge"
  ]
 },
 {
  "id": 20754,
  "name": "Gakkou Gurashi!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20754-e5JXeLpHoN7w.jpg",
  "year": 2015,
  "al": [
   "SCHOOL-LIVE!"
  ]
 },
 {
  "id": 20791,
  "name": "Fate/stay night [Heaven's Feel] I. presage flower",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20791-yPCX5GJuMH2k.png",
  "year": 2017,
  "al": [
   "Fate/HF"
  ]
 },
 {
  "id": 7724,
  "name": "Shiki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx7724-NwNnRsI34eDa.jpg",
  "year": 2010,
  "al": [
   "Corpse Demon"
  ]
 },
 {
  "id": 114129,
  "name": "Gintama: THE FINAL",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx114129-RLgSuh6YbeYx.jpg",
  "year": 2021,
  "al": [
   "Gintama: THE VERY FINAL",
   "กินทามะ THE FINAL"
  ]
 }
];
