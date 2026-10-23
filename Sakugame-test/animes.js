/* ============================================================
   🎬 SAKUGAME — GENERIC ANIME COVER POOL (animes.js)
   ------------------------------------------------------------
   The 1500 most-favorited anime on AniList (non-adult),
   fetched 2026-09-23 via the AniList public API.
   Used by the Blur Guess 🎬 "Guess the anime cover" mode.

   Each entry:
     { id: 123, "name": "Romaji Title", "image": "https://...",
       "year": 2009, "al": ["English title", "Synonym", ...],
       "r": popularity rank 1-1500 (1 = most favourited) }
   ============================================================ */

const ANIME_COVERS =
[
 {
  "id": 21,
  "name": "ONE PIECE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21-ELSYx3yMPcKM.jpg",
  "year": 1999,
  "al": ["ワンピース", "海贼王", "וואן פיס", "ون بيس", "วันพีซ", "Vua Hải Tặc", "All'arrembaggio!", "Tutti all'arrembaggio!"],
  "r": 1
 },
 {
  "id": 11061,
  "name": "HUNTER×HUNTER (2011)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11061-y5gsT1hoHuHw.png",
  "year": 2011,
  "al": ["Hunter x Hunter (2011)", "ハンター×ハンター", "HxH", "全职猎人", "האנטר האנטר", "ฮันเตอร์ x ฮันเตอร์", "القناص", "Мисливець X Мисливець"],
  "r": 2
 },
 {
  "id": 16498,
  "name": "Shingeki no Kyojin",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16498-buvcRTBx4NSm.jpg",
  "year": 2013,
  "al": ["Attack on Titan", "進撃の巨人", "SnK", "AoT", "Ataque a los Titanes", "Ataque dos Titãs", "L'Attacco dei Giganti", "מתקפת הטיטאנים"],
  "r": 3
 },
 {
  "id": 5114,
  "name": "Hagane no Renkinjutsushi: FULLMETAL ALCHEMIST",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5114-nSWCgQlmOMtj.jpg",
  "year": 2009,
  "al": ["Fullmetal Alchemist: Brotherhood", "鋼の錬金術師 FULLMETAL ALCHEMIST", "FMA", "FMAB", "Hagaren", "الخيميائي الفولاذي", "אלכימאי המתכת: אחוות אחים", "Full Metal Alchemist: Brotherhood"],
  "r": 4
 },
 {
  "id": 113415,
  "name": "Jujutsu Kaisen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113415-LHBAeoZDIsnF.jpg",
  "year": 2020,
  "al": ["呪術廻戦", "JJK", "Sorcery Fight", "咒术回战", "주술회전", "มหาเวทย์ผนึกมาร", "جوجوتسو كايسن", "Магическая битва"],
  "r": 5
 },
 {
  "id": 1535,
  "name": "DEATH NOTE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1535-kUgkcrfOrkUM.jpg",
  "year": 2006,
  "al": ["デスノート", "死亡笔记", "מחברת המוות", "Notatnik śmierci", "Carnet de la Mort", "สมุดโน้ตกระชากวิญญาณ", "مذكرة الموت", "Тетрадь смерти"],
  "r": 6
 },
 {
  "id": 20954,
  "name": "Koe no Katachi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20954-sYRfE5jQRtSB.jpg",
  "year": 2016,
  "al": ["A Silent Voice", "聲の形", "The Shape of Voice", "A Voz do Silêncio", "A Forma da Voz", "La Forma della Voce", "צורתו של קול", "声之形"],
  "r": 7
 },
 {
  "id": 154587,
  "name": "Sousou no Frieren",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154587-qQTzQnEJJ3oB.jpg",
  "year": 2023,
  "al": ["Frieren: Beyond Journey’s End", "葬送のフリーレン", "Frieren at the Funeral", "장송의 프리렌", "Frieren - Oltre la Fine del Viaggio", "คำอธิษฐานในวันที่จากลา Frieren", "Frieren e a Jornada para o Além", "Frieren – Nach dem Ende der Reise"],
  "r": 8
 },
 {
  "id": 101922,
  "name": "Kimetsu no Yaiba",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101922-WBsBl0ClmgYL.jpg",
  "year": 2019,
  "al": ["Demon Slayer: Kimetsu no Yaiba", "鬼滅の刃", "KnY", "Kimetsu no Yaiba: Kyoudai no Kizuna", "Demon Slayer: Kimetsu no Yaiba: Bonds of Siblings", "鬼滅の刃-兄妹の絆-", "鬼灭之刃", "הלהב קוטל השדים"],
  "r": 9
 },
 {
  "id": 9253,
  "name": "Steins;Gate",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx9253-tIUXF2gfU8Sg.jpg",
  "year": 2011,
  "al": ["シュタインズ・ゲート", "S;G", "סטיינס;גייט", "命运石之门", "Врата;Штейна"],
  "r": 10
 },
 {
  "id": 21519,
  "name": "Kimi no Na wa.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21519-SUo3ZQuCbYhJ.png",
  "year": 2016,
  "al": ["Your Name.", "君の名は。", "Your Name. - Gestern, heute und für immer", "Mi a Neved?", "你的名字。", "너의 이름은.", "Tu nombre", "Твоё имя"],
  "r": 11
 },
 {
  "id": 30,
  "name": "Shin Seiki Evangelion",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx30-AI1zr74Dh4ye.jpg",
  "year": 1995,
  "al": ["Neon Genesis Evangelion", "新世紀エヴァンゲリオン", "NGE", "Eva", "ניאון ג'נסיס אוונגליון", "อีวานเกเลียน มหาสงครามวันพิพากษา", "Евангелион"],
  "r": 12
 },
 {
  "id": 1735,
  "name": "NARUTO: Shippuuden",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1735-kGfVm0YqCPcu.png",
  "year": 2007,
  "al": ["Naruto: Shippuden", "NARUTO -ナルト- 疾風伝", "Naruto Shippuuden", "Naruto Shippuden", "נארוטו שיפודן", "火影忍者 疾风传", "นารูโตะ ตำนานวายุสลาตัน", "ناروتو شيبودن"],
  "r": 13
 },
 {
  "id": 20,
  "name": "NARUTO",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20-dE6UHbFFg1A5.jpg",
  "year": 2002,
  "al": ["NARUTO -ナルト-", "נארוטו", "ناروتو", "火影忍者", "นารูโตะ นินจาจอมคาถา", "Наруто"],
  "r": 14
 },
 {
  "id": 101348,
  "name": "VINLAND SAGA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101348-2fhDFPCuMNiz.jpg",
  "year": 2019,
  "al": ["ヴィンランド・サガ", "סאגת וינלנד", "فينلاند ساغا", "สงครามคนทมิฬ", "Сага о Винланде"],
  "r": 15
 },
 {
  "id": 21827,
  "name": "Violet Evergarden",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21827-ubzq619ZA2E9.png",
  "year": 2018,
  "al": ["ヴァイオレット・エヴァーガーデン", "ויולט אברגרדן", "فيوليت", "紫罗兰永恒花园"],
  "r": 16
 },
 {
  "id": 21507,
  "name": "Mob Psycho 100",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21507-6YUSbh2m0N1p.jpg",
  "year": 2016,
  "al": ["モブサイコ100", "מוב פסיכו 100", "ม็อบไซโค 100 คนพลังจิต", "Моб Психо 100"],
  "r": 17
 },
 {
  "id": 20464,
  "name": "Haikyuu!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20464-ooZUyBe4ptp9.png",
  "year": 2014,
  "al": ["HAIKYU!!", "ハイキュー!!", "High Kyuu!!", "HAIKYÛ !!", "排球少年！！", "Haikyu!! L'asso del volley", "ไฮคิว!! คู่ตบฟ้าประทาน"],
  "r": 18
 },
 {
  "id": 127230,
  "name": "Chainsaw Man",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx127230-DdP4vAdssLoz.png",
  "year": 2022,
  "al": ["チェンソーマン", "CSM", "رجل المنشار", "链锯人", "Человек-бензопила", "체인소 맨", "Thợ Săn Quỷ"],
  "r": 19
 },
 {
  "id": 21355,
  "name": "Re:Zero kara Hajimeru Isekai Seikatsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21355-wRVUrGxpvIQQ.jpg",
  "year": 2016,
  "al": ["Re:ZERO -Starting Life in Another World-", "Re:ゼロから始める異世界生活", "Re: Life in a different world from zero", "ReZero", "Re Zero", "Re：从零开始的异世界生活", "Re:Zero รีเซทชีวิต ฝ่าวิกฤตต่างโลก", "Re:Zero — жизнь с нуля в другом мире"],
  "r": 20
 },
 {
  "id": 20665,
  "name": "Shigatsu wa Kimi no Uso",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20665-TLgkL8T8IRFd.png",
  "year": 2014,
  "al": ["Your lie in April", "四月は君の嘘", "KimiUso", "השקר שלך באפריל", "Bugie d'aprile", "四月是你的谎言", "YLIA", "Sekunden in Moll"],
  "r": 21
 },
 {
  "id": 1575,
  "name": "Code Geass: Hangyaku no Lelouch",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1575-hsmWM2ydNm1m.jpg",
  "year": 2006,
  "al": ["Code Geass: Lelouch of the Rebellion", "コードギアス 反逆のルルーシュ", "Code Geass: Lelouch de la Rebelión", "קוד גיאס: המהפכה של ללוש"],
  "r": 22
 },
 {
  "id": 269,
  "name": "BLEACH",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx269-d2GmRkJbMopq.png",
  "year": 2004,
  "al": ["ブリーチ", "'בליץ", "เทพมรณะ", "بليتش", "Блич"],
  "r": 23
 },
 {
  "id": 1,
  "name": "Cowboy Bebop",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1-GCsPm7waJ4kS.png",
  "year": 1998,
  "al": ["カウボーイビバップ", "카우보이 비밥", "קאובוי ביבופ", "คาวบอย บีบ๊อป", "Ковбой Бибоп", "Καουμπόηδες του Διαστήματος", "Kowboj Bebop"],
  "r": 24
 },
 {
  "id": 124080,
  "name": "Horimiya",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx124080-3i22mRVPBS0T.jpg",
  "year": 2021,
  "al": ["ホリミヤ", "堀与宫村", "โฮริมิยะ สาวมั่นกับนายมืดมน", "Хоримия"],
  "r": 25
 },
 {
  "id": 101291,
  "name": "Seishun Buta Yarou wa Bunny Girl Senpai no Yume wo Minai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101291-wfEdgPqtfU0l.jpg",
  "year": 2018,
  "al": ["Rascal Does Not Dream of Bunny Girl Senpai", "青春ブタ野郎はバニーガール先輩の夢を見ない", "AoButa", "青春猪头少年不会梦到兔女郎学姐", "Негодник, которому не снилась девушка-кролик", "Этот глупый свин не понимает мечту девочки-зайки", "青ブタ", "เรื่องฝันปั่นป่วยของผมกับรุ่นพี่บันนี่เกิร์ล"],
  "r": 26
 },
 {
  "id": 21087,
  "name": "One Punch Man",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21087-B5DHjqZ3kW4b.jpg",
  "year": 2015,
  "al": ["One-Punch Man", "ワンパンマン", "OPM", "Wanpanman", "איש האגרוף הבודד", "一拳超人", "วันพันช์แมน", "Jagoan Sekali Pukul S1"],
  "r": 27
 },
 {
  "id": 97940,
  "name": "Black Clover",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97940-fyh8o7gNbha0.png",
  "year": 2017,
  "al": ["ブラッククローバー", "תלתן שחור", "แบล็กโคลเวอร์", "Чёрный клевер"],
  "r": 28
 },
 {
  "id": 120377,
  "name": "Cyberpunk: Edgerunners",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx120377-ayZPoxiWt4Li.jpg",
  "year": 2022,
  "al": ["サイバーパンク エッジランナーズ", "Cyberpunk: Mercenários", "電馭叛客：邊緣行者", "CYBERPUNK: อาชญากรแดนเถื่อน", "Киберпанк: Бегущие по краю"],
  "r": 29
 },
 {
  "id": 104578,
  "name": "Shingeki no Kyojin Season 3 Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104578-k61nx3LPjvgd.jpg",
  "year": 2019,
  "al": ["Attack on Titan Season 3 Part 2", "進撃の巨人 Season３ Part.2", "SnK 3", "AoT 3", "Shingeki no Kyojin Season 3 (2019)", "L'Attaco dei Giganti 3 Parte 2", "L'Attacco dei Giganti - Terza Stagione Parte 2", "מתקפת הטיטאנים עונה 3 חלק 2"],
  "r": 30
 },
 {
  "id": 21459,
  "name": "Boku no Hero Academia",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21459-nYh85uj2Fuwr.jpg",
  "year": 2016,
  "al": ["My Hero Academia", "僕のヒーローアカデミア", "BNHA", "MHA", "나의 히어로 아카데미아 1기", "나히아 1기", "אקדמיית הגיבורים שלי", "我的英雄学院"],
  "r": 31
 },
 {
  "id": 101921,
  "name": "Kaguya-sama wa Kokurasetai: Tensaitachi no Renai Zunousen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101921-ufrjLzhSz7L1.jpg",
  "year": 2019,
  "al": ["Kaguya-sama: Love is War", "かぐや様は告らせたい～天才たちの恋愛頭脳戦～", "Kaguya Wants to be Confessed To: The Geniuses' War of Love and Brains", "קאגויה סאמה", "辉夜大小姐想让我告白～天才们的恋爱头脑战～", "辉夜姬想让人告白", "辉夜姬想让人告白～天才们的恋爱头脑战～", "辉告"],
  "r": 32
 },
 {
  "id": 2001,
  "name": "Tengen Toppa Gurren Lagann",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2001-XwRnjzGeFWRQ.png",
  "year": 2007,
  "al": ["Gurren Lagann", "天元突破グレンラガン", "Heavenly Breakthrough Gurren Lagann", "TTGL", "Sfondamento dei cieli Gurren Lagann", "Heaven-Piercing Gurren Lagann", "Гуррен-Лаганн", "Ґуррен Лаґанн"],
  "r": 33
 },
 {
  "id": 130003,
  "name": "Bocchi the Rock!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx130003-HTDmeL4RGeJ4.png",
  "year": 2022,
  "al": ["ぼっち・ざ・ろっく！", "РОК-ТИХОНЯ!", "บจจิเดอะร็อก!", "孤獨搖滾！", "孤独摇滚！", "외톨이 THE ROCK!", "봇치 더 록!", "BTR"],
  "r": 34
 },
 {
  "id": 161645,
  "name": "Kusuriya no Hitorigoto",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx161645-QLbzHXiYRgV2.jpg",
  "year": 2023,
  "al": ["The Apothecary Diaries", "薬屋のひとりごと", "Drugstore Soliloquy", "Les Carnets de l'Apothicaire", "Zapiski zielarki", "Diários de uma Apotecária", "Il monologo della Speziale", "Los diarios de la boticaria"],
  "r": 35
 },
 {
  "id": 140960,
  "name": "SPY×FAMILY",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx140960-Kb6R5nYQfjmP.jpg",
  "year": 2022,
  "al": ["SPY x FAMILY", "SxF", "스파이 패밀리", "间谍过家家", "Семья шпиона", "سباي إكس فاميلي", "Gia Đình Điệp Viên"],
  "r": 36
 },
 {
  "id": 110277,
  "name": "Shingeki no Kyojin: The Final Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx110277-sKUNXAsWMNFw.jpg",
  "year": 2021,
  "al": ["Attack on Titan Final Season", "進撃の巨人 The Final Season", "SnK 4", "AoT 4", "Shingeki no Kyojin 4", "進撃の巨人4", "Attack on Titan Season 4", "진격의 거인 더 파이널 시즌"],
  "r": 37
 },
 {
  "id": 108465,
  "name": "Mushoku Tensei: Isekai Ittara Honki Dasu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108465-1ANspF1EWyFx.jpg",
  "year": 2021,
  "al": ["Mushoku Tensei: Jobless Reincarnation", "無職転生 ～異世界行ったら本気だす～", "Jobless Reincarnation: I Will Seriously Try If I Go To Another World", "无职转生 ~到了异世界就拿出真本事~", "เกิดชาตินี้พี่ต้องเทพ", "Thất nghiệp chuyển sinh"],
  "r": 38
 },
 {
  "id": 21234,
  "name": "Boku dake ga Inai Machi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21234-XmqW39aQ9o7O.jpg",
  "year": 2016,
  "al": ["ERASED", "僕だけがいない街", "Bokumachi", "Desaparecido", "Miasto beze mnie", "รีไววัล ย้อนอดีตไขปริศนา", "ย้อนอดีตไขปริศนา"],
  "r": 39
 },
 {
  "id": 9756,
  "name": "Mahou Shoujo Madoka☆Magica",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx9756-QnUGwlwwnsuN.jpg",
  "year": 2011,
  "al": ["Puella Magi Madoka Magica", "魔法少女まどか☆マギカ", "Mahou Shoujo Madoka Magika", "Magical Girl Madoka Magica", "PMMM", "MSMM", "הנערה הקסומה מאדוקה מאגיקה", "Девочка-волшебница Мадока☆Волшебство"],
  "r": 40
 },
 {
  "id": 20605,
  "name": "Tokyo Ghoul",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b20605-k665mVkSug8D.jpg",
  "year": 2014,
  "al": ["東京喰種 トーキョーグール", "Tokyo Kushu", "שדי טוקיו", "东京食种", "طوكيو غول", "Токийский гуль"],
  "r": 41
 },
 {
  "id": 101338,
  "name": "Mob Psycho 100 II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101338-rokVscjRYzdP.jpg",
  "year": 2019,
  "al": ["モブサイコ100 II", "Mob Psycho Hyaku", "ม็อบไซโค 100 คนพลังจิต ภาค 2", "Моб Психо 100 II"],
  "r": 42
 },
 {
  "id": 19,
  "name": "MONSTER",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx19-gtMC64182sm4.jpg",
  "year": 2004,
  "al": ["モンスター", "מונסטר", "מפלצת", "مونستر", "وحش", "Монстр", "怪物"],
  "r": 43
 },
 {
  "id": 105333,
  "name": "Dr. STONE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105333-GybuoSoOZfpH.jpg",
  "year": 2019,
  "al": ["Dr.STONE", "Dcst", "石纪元", "ドクターストーン", "ดร.สโตน เจ้าแห่งวิทยาศาสตร์กู้คืนอารยธรรมโลก", "Доктор Стоун"],
  "r": 44
 },
 {
  "id": 11757,
  "name": "Sword Art Online",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11757-SxYDUzdr9rh2.jpg",
  "year": 2012,
  "al": ["ソードアート・オンライン", "S.A.O", "SAO", "אומנות החרב אונליין", "刀剑神域", "ซอร์ดอาร์ตออนไลน์", "Мастера меча онлайн"],
  "r": 45
 },
 {
  "id": 101759,
  "name": "Yakusoku no Neverland",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101759-8UR7r9MNVpz2.jpg",
  "year": 2019,
  "al": ["The Promised Neverland", "約束のネバーランド", "YakuNeba", "TPN", "نيفرلاند الموعودة", "约定的梦幻岛", "พันธสัญญาเนเวอร์แลนด์", "約定的夢幻島"],
  "r": 46
 },
 {
  "id": 21450,
  "name": "JoJo no Kimyou na Bouken: Diamond wa Kudakenai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21450-D7XFwEQjZ5GA.jpg",
  "year": 2016,
  "al": ["JoJo's Bizarre Adventure: Diamond is Unbreakable", "ジョジョの奇妙な冒険 ダイヤモンドは砕けない", "JoJo no Kimyou na Bouken Part 4: Diamond wa Kudakenai", "JoJo's Bizarre Adventure Part 4: Diamond is Unbreakable", "مغامرات جوجو العجيبة: الألماس غير قابل للكسر", "Le bizzarre avventure di JoJo: Diamond is Unbreakable", "Невероятные приключения ДжоДжо: Diamond is Unbreakable"],
  "r": 47
 },
 {
  "id": 145064,
  "name": "Jujutsu Kaisen 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx145064-hSNRJM03pvv1.jpg",
  "year": 2023,
  "al": ["JUJUTSU KAISEN Season 2", "呪術廻戦 第2期", "呪術廻戦 懐玉・玉折／渋谷事変", "Jujutsu Kaisen: Kaigyoku Gyokusetsu / Shibuya Jihen", "Jujutsu Kaisen: Hidden Inventory / Premature Death", "JJK2", "咒術迴戰  第二季", "มหาเวทย์ผนึกมาร ภาค 2"],
  "r": 48
 },
 {
  "id": 431,
  "name": "Howl no Ugoku Shiro",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx431-o8Lj3XkjHm2k.jpg",
  "year": 2004,
  "al": ["Howl‘s Moving Castle", "ハウルの動く城", "Hauru no Ugoku Shiro", "Das wandelnde Schloss", "El Castillo Ambulante", "Il castello errante di Howl", "Le Château Ambulant", "הטירה הנעה של האוול"],
  "r": 49
 },
 {
  "id": 21202,
  "name": "Kono Subarashii Sekai ni Shukufuku wo!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21202-mPOr80AEjUcZ.png",
  "year": 2016,
  "al": ["KONOSUBA -God's blessing on this wonderful world!", "この素晴らしい世界に祝福を！", "Konosuba", "Kono Subarashii Sekai ni Syukufuku wo!", "Konosuba - As Bençãos de Deus Neste Mundo Maravilhoso", "为美好的世界献上祝福！", "ขอให้โชคดีมีชัยในโลกแฟนตาซี!", "Konosuba : Sois béni monde merveilleux !"],
  "r": 50
 },
 {
  "id": 199,
  "name": "Sen to Chihiro no Kamikakushi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx199-sWefXJvXkDOb.jpg",
  "year": 2001,
  "al": ["Spirited Away", "千と千尋の神隠し", "Le Voyage de Chihiro", "La Città Incantata", "El Viaje de Chihiro", "Chihiros Reise ins Zauberland", "Ruhların Kaçışı", "המסע המופלא"],
  "r": 51
 },
 {
  "id": 101280,
  "name": "Tensei Shitara Slime Datta Ken",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101280-tDxCVJm714nt.jpg",
  "year": 2018,
  "al": ["That Time I Got Reincarnated as a Slime", "転生したらスライムだった件", "転スラ", "TenSura", "Vita da Slime", "Moi, quand je me réincarne en Slime", "关于我转生变成史莱姆这档事", "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว"],
  "r": 52
 },
 {
  "id": 97986,
  "name": "Made in Abyss",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97986-TQ7dCgbS3y5s.jpg",
  "year": 2017,
  "al": ["メイドインアビス", "صنع في الهاوية", "Созданный в Бездне", "ผ่าเหวนรก", "นักบุกเบิกหลุมยักษ์", "Đến từ Abyss"],
  "r": 53
 },
 {
  "id": 2904,
  "name": "Code Geass: Hangyaku no Lelouch R2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2904-Fet9Q33suC7G.jpg",
  "year": 2008,
  "al": ["Code Geass: Lelouch of the Rebellion R2", "コードギアス 反逆のルルーシュ R2", "Code Geass: Hangyaku no Lelouch 2nd Season", "Code Geass: Hangyaku no Lelouch Second Season"],
  "r": 54
 },
 {
  "id": 21804,
  "name": "Saiki Kusuo no Ψ-nan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21804-As6tDLAvEvNY.jpg",
  "year": 2016,
  "al": ["The Disastrous Life of Saiki K.", "斉木楠雄のΨ難", "חייו הרי-האסון של סאיקי ק", "Η Καταστροφική Ζωή του Σάικι Κ", "Ох уж этот экстрасенс Сайки Кусуо!"],
  "r": 55
 },
 {
  "id": 20755,
  "name": "Ansatsu Kyoushitsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20755-dWrhs569YGUO.jpg",
  "year": 2015,
  "al": ["Assassination Classroom", "暗殺教室", "כיתת ההתנקשות", "فصل الاغتيال", "Klasa skrytobójców", "Lớp học ám sát"],
  "r": 56
 },
 {
  "id": 151807,
  "name": "Ore dake Level Up na Ken",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx151807-it355ZgzquUd.png",
  "year": 2024,
  "al": ["Solo Leveling", "俺だけレベルアップな件", "나 혼자만 레벨업", "Na Honjaman Level Up", "Solo Leveling: Поднятие уровня в одиночку"],
  "r": 57
 },
 {
  "id": 4224,
  "name": "Toradora!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx4224-PXVMBLNwy2aF.jpg",
  "year": 2008,
  "al": ["とらドラ！", "Tiger X Dragon", "龙与虎", "النمر والتنين", "ยัยเสือใสกับนายหน้าโหด", "Τίγρης και Δράκος"],
  "r": 58
 },
 {
  "id": 132405,
  "name": "Sono Bisque Doll wa Koi wo Suru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx132405-qP7FQYGmNI3d.jpg",
  "year": 2022,
  "al": ["My Dress-Up Darling", "その着せ替え人形は恋をする", "Sono Kisekae Ningyou wa Koi wo suru", "หนุ่มเย็บผ้ากับสาวนักคอสเพลย์", "その着せ替え人形（ビスク・ドール）は恋をする", "kisekoi", "Si Boneka Rias Sedang Jatuh Cinta", "Projekt: cosplay"],
  "r": 59
 },
 {
  "id": 20958,
  "name": "Shingeki no Kyojin Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20958-HuFJyr54Mmir.jpg",
  "year": 2017,
  "al": ["Attack on Titan Season 2", "進撃の巨人 Season２", "SnK 2", "AoT 2", "+מתקפת הטיטאנים עונה 2", "L'Attacco dei Giganti 2", "L'Attacco dei Giganti - Seconda Stagione", "ผ่าพิภพไททัน ภาค 2"],
  "r": 60
 },
 {
  "id": 99147,
  "name": "Shingeki no Kyojin Season 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99147-AiPDD8cwlCfi.jpg",
  "year": 2018,
  "al": ["Attack on Titan Season 3", "進撃の巨人 Season３", "SnK 3", "AoT 3", "מתקפת הטיטאנים עונה 3", "L'Attacco dei Giganti 3", "L'Attacco dei Giganti - Terza Stagione", "ผ่าพิภพไททัน ภาค 3"],
  "r": 61
 },
 {
  "id": 102883,
  "name": "JoJo no Kimyou na Bouken: Ougon no Kaze",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx102883-S9KzdMJhDswJ.png",
  "year": 2018,
  "al": ["JoJo's Bizarre Adventure: Golden Wind", "ジョジョの奇妙な冒険 黄金の風", "JoJo's Bizarre Adventure Part 5", "JoJo's Bizarre Adventure: Vento Aureo", "Le Bizzarre Avventure Di GioGio: Vento Aureo", "مغامرات جوجو العجيبة: الرياح الذهبية", "Невероятные приключения ДжоДжо: Золотой ветер"],
  "r": 62
 },
 {
  "id": 99750,
  "name": "Kimi no Suizou wo Tabetai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99750-pNyly9d3MEgV.jpg",
  "year": 2018,
  "al": ["I Want to Eat Your Pancreas", "君の膵臓をたべたい", "Quiero Comerme tu Páncreas", "Voglio mangiare il tuo pancreas", "Je veux manger ton pancréas", "Vull menjar-me el teu pàncrees", "Kimisui", "Eu Quero Comer Seu Pâncreas"],
  "r": 63
 },
 {
  "id": 32,
  "name": "Shin Seiki Evangelion Movie: Air / Magokoro wo, Kimi ni",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx32-5JYsv0wc122I.jpg",
  "year": 1997,
  "al": ["Neon Genesis Evangelion: The End of Evangelion", "新世紀エヴァンゲリオン劇場版 Air/まごころを、君に", "הסוף של אוונגליון", "אוונגליון של הסוף", "Конец Евангелиона"],
  "r": 64
 },
 {
  "id": 171018,
  "name": "Dandadan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx171018-60q1B6GK2Ghb.jpg",
  "year": 2024,
  "al": ["DAN DA DAN", "ダンダダン", "ดันดาดัน", "膽大黨", "DAN DA DAN: FIRST ENCOUNTER", "Дандадан"],
  "r": 65
 },
 {
  "id": 116589,
  "name": "86: Eighty Six",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116589-KawXHB6sApFt.jpg",
  "year": 2021,
  "al": ["86 EIGHTY-SIX", "86－エイティシックス－", "86--EIGHTY-SIX", "86 -เอทตี้ซิกซ์-", "86 ВОСЕМЬДЕСЯТ ШЕСТЬ", "86 -不存在的战区-"],
  "r": 66
 },
 {
  "id": 150672,
  "name": "[Oshi no Ko]",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx150672-WqmmwZ4nMzAy.png",
  "year": 2023,
  "al": ["OSHI NO KO", "【推しの子】", "Favorite Girl", "My Idol's Child", "[Mein*Star]", "เกิดใหม่เป็นลูกโอชิ", "Anak Idola", "【OSHI NO KO】"],
  "r": 67
 },
 {
  "id": 19815,
  "name": "No Game No Life",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b19815-sEOQ9yQaPKlk.jpg",
  "year": 2014,
  "al": ["No Game, No Life", "ノーゲーム・ノーライフ", "NGNL", "NO GAME NO LIFE游戏人生", "游戏人生", "โนเกม โนไลฟ์", "遊戲人生", "NO GAME NO LIFE 遊戲人生"],
  "r": 68
 },
 {
  "id": 99423,
  "name": "Darling in the Franxx",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx99423-8MBxtwCeHf8B.png",
  "year": 2018,
  "al": ["ダーリン・イン・ザ・フランキス", "DitF", "DarliFra", "Любимый во Франксе"],
  "r": 69
 },
 {
  "id": 14719,
  "name": "JoJo no Kimyou na Bouken (TV)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14719-VT5dRzTBSZ0w.jpg",
  "year": 2012,
  "al": ["JoJo's Bizarre Adventure (TV)", "ジョジョの奇妙な冒険 (TV)", "JoJo no Kimyou na Bouken (2012)", "JoJo no Kimyou na Bouken: Sentou Chouryuu", "JoJo's Bizarre Adventure: Phantom Blood", "JoJo's Bizarre Adventure: Battle Tendency", "مغامرات جوجو العجيبة", "مغامرات جوجو العجيبة:الدماء الوهمية"],
  "r": 70
 },
 {
  "id": 171627,
  "name": "Chainsaw Man: Reze-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx171627-ZN9D7P46yHnw.png",
  "year": 2025,
  "al": ["Chainsaw Man – The Movie: Reze Arc", "チェンソーマン レゼ篇", "CSM: Reze-hen", "CSM – The Movie: Reze Arc", "Chainsaw Man – O Filme: Arco da Reze", "Chainsaw Man - La película: El arco de Reze", "Chainsaw Man - Il Film: La Storia di Reze", "Человек-бензопила: Фильм – История Резе"],
  "r": 71
 },
 {
  "id": 20623,
  "name": "Kiseijuu: Sei no Kakuritsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20623-dUARfggnNDOe.jpg",
  "year": 2014,
  "al": ["Parasyte -the maxim-", "寄生獣 セイの格率", "Kiseiju - L'ospite indesiderato", "Parasite : La Maxime", "Паразит: Учение о жизни", "Pasożyt"],
  "r": 72
 },
 {
  "id": 5081,
  "name": "Bakemonogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5081-9GocceQ5Z865.jpg",
  "year": 2009,
  "al": ["化物語", "Monster Tale", "化物语", "ปกรณัมของเหล่าภูต", "Monogatari"],
  "r": 73
 },
 {
  "id": 100388,
  "name": "BANANA FISH",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100388-hjkg1AnlJR5z.jpg",
  "year": 2018,
  "al": ["バナナフィッシュ", "香蕉鱼", "Банановая рыба"],
  "r": 74
 },
 {
  "id": 142329,
  "name": "Kimetsu no Yaiba: Yuukaku-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142329-kET1PIXJv2eW.jpg",
  "year": 2022,
  "al": ["Demon Slayer: Kimetsu no Yaiba Entertainment District Arc", "鬼滅の刃 遊郭編", "KnY 2", "Demon Slayer: Kimetsu no Yaiba - Le quartier des plaisirs", "ดาบพิฆาตอสูร ภาค 2 บทย่านเริงรมย์", "Miecz zabójcy demonów – Kimetsu no Yaiba: Dzielnica uciech", "귀멸의 칼날: 환락의 거리편", "Клинок, Рассекающий Демонов: Квартал Красных Фонарей"],
  "r": 75
 },
 {
  "id": 20447,
  "name": "Noragami",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20447-EoQXeygHaVCK.jpg",
  "year": 2014,
  "al": ["ノラガミ", "Stray God", "野良神", "โนรางามิ เทวดาขาจร ภาค 1", "Бездомный бог"],
  "r": 76
 },
 {
  "id": 120120,
  "name": "Tokyo Revengers",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx120120-cWDmnmeEntSe.jpg",
  "year": 2021,
  "al": ["東京リベンジャーズ", "重生之道", "โตเกียวรีเวนเจอร์ส", "โตเกียว卍รีเวนเจอร์ส", "东京复仇者", "נוקמי טוקיו", "Токийские мстители", "Răzbunătorii din Tokio"],
  "r": 77
 },
 {
  "id": 437,
  "name": "PERFECT BLUE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx437-69NMlXKFeuse.jpg",
  "year": 1998,
  "al": ["パーフェクト・ブルー"],
  "r": 78
 },
 {
  "id": 4181,
  "name": "CLANNAD: After Story",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx4181-zUKE7BZC62OF.png",
  "year": 2008,
  "al": ["ＣＬＡＮＮＡＤ ~After Story~ クラナド アフターストーリー"],
  "r": 79
 },
 {
  "id": 112641,
  "name": "Kaguya-sama wa Kokurasetai?: Tensaitachi no Renai Zunousen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112641-zoGC8d6FaPXU.jpg",
  "year": 2020,
  "al": ["Kaguya-sama: Love is War?", "かぐや様は告らせたい？～天才たちの恋愛頭脳戦～", "Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen 2", "Kaguya-sama: Love is War Season 2", "辉夜大小姐想让我告白～天才们的恋爱头脑战～第二季", "辉夜大小姐想让我告白～天才们的恋爱头脑战～ 2", "Kaguya-sama wa Kokurasetai?: Tensai-tachi no Renai Zunousen", "สารภาพรักกับคุณคางุยะซะดีๆ ~สงครามประสาทความรักของเหล่าอัจฉริยะ~ ภาค 2"],
  "r": 80
 },
 {
  "id": 18679,
  "name": "Kill la Kill",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b18679-lbkq7iYESoFW.png",
  "year": 2013,
  "al": ["キルラキル", "Kiru Ra Kiru", "KLK"],
  "r": 81
 },
 {
  "id": 130298,
  "name": "Kage no Jitsuryokusha ni Naritakute!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx130298-YMdcKHytpWNH.jpg",
  "year": 2022,
  "al": ["The Eminence in Shadow", "陰の実力者になりたくて！", "To Be a Power in the Shadows!", "ชีวิตไม่ต้องเด่น ขอแค่เป็นเทพในเงา", "Un giorno sarò l'eminenza grigia", "TEIS", "Кардинал теней"],
  "r": 82
 },
 {
  "id": 918,
  "name": "Gintama",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx918-iOaeBVUn4uK7.jpg",
  "year": 2006,
  "al": ["銀魂", "Gin Tama", "Silver Soul", "גינטאמה", "Гинтама"],
  "r": 83
 },
 {
  "id": 99263,
  "name": "Tate no Yuusha no Nariagari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99263-LcazQwdlWzMy.jpg",
  "year": 2019,
  "al": ["The Rising of the Shield Hero", "盾の勇者の成り上がり", "盾之勇者成名录", "ผู้กล้าโล่ผงาด", "Восхождение героя щита"],
  "r": 84
 },
 {
  "id": 21311,
  "name": "Bungou Stray Dogs",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21311-hAXyT8Yoh6G9.jpg",
  "year": 2016,
  "al": ["Bungo Stray Dogs", "文豪ストレイドッグス", "BSD", "Văn hào lưu lạc", "คณะประพันธกรจรจัด", "כלבי ספרות נודדים"],
  "r": 85
 },
 {
  "id": 205,
  "name": "Samurai Champloo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx205-7tHVFu6dPBm9.png",
  "year": 2004,
  "al": ["サムライチャンプルー", "ساموراي تشامبلو", "Самурай Чамплу"],
  "r": 86
 },
 {
  "id": 877,
  "name": "NANA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx877-6BUYEWp8By8j.png",
  "year": 2006,
  "al": ["NANA-ナナ-"],
  "r": 87
 },
 {
  "id": 101347,
  "name": "Dororo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101347-TGaDwEYqLfm1.jpg",
  "year": 2019,
  "al": ["どろろ", "Дороро"],
  "r": 88
 },
 {
  "id": 98460,
  "name": "DEVILMAN crybaby",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98460-bLtH2c3jd6sV.png",
  "year": 2018,
  "al": ["デビルマン クライベイビー", "דווילמן: בכיין", "طفل الشيطان", "เดวิลแมน ครายเบบี้"],
  "r": 89
 },
 {
  "id": 339,
  "name": "serial experiments lain",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx339-xF2wp1NQuQ4r.png",
  "year": 1998,
  "al": ["シリアルエクスペリメンツレイン", "Wirtualna Lain"],
  "r": 90
 },
 {
  "id": 125367,
  "name": "Kaguya-sama wa Kokurasetai: Ultra Romantic",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx125367-1yuq9NFcQuLI.png",
  "year": 2022,
  "al": ["Kaguya-sama: Love is War -Ultra Romantic-", "かぐや様は告らせたい-ウルトラロマンティック-", "Kaguya-sama: Love is War Season 3", "辉夜大小姐想让我告白～天才们的恋爱头脑战～ 3", "辉夜大小姐想让我告白～天才们的恋爱头脑战～ 第三季", "Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen 3", "สารภาพรักกับคุณคางุยะซะดี ๆ ~สงครามประสาทความรักของเหล่าอัจฉริยะ~ ภาค 3", "สารภาพรักกับคุณคางุยะ ซะดี ๆ -อุลตร้า โรแมนติก-"],
  "r": 91
 },
 {
  "id": 98659,
  "name": "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98659-WNyPLIZDpGGY.jpg",
  "year": 2017,
  "al": ["Classroom of the Elite", "ようこそ実力至上主義の教室へ", "Youjitsu", "You-Zitsu", "ขอต้อนรับสู่ห้องเรียนนิยม (เฉพาะ) ยอดคน", "Cote", "歡迎來到實力至上主義的教室", "Добро пожаловать в класс для особо одарённых"],
  "r": 92
 },
 {
  "id": 131681,
  "name": "Shingeki no Kyojin: The Final Season Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131681-5ooUqvqNtee1.jpg",
  "year": 2022,
  "al": ["Attack on Titan Final Season Part 2", "進撃の巨人 The Final Season Part 2", "SnK 4", "AoT 4", "L'attaque des titans Saison Finale Partie 2", "Shingeki no Kyojin: The Final Season (2022)", "اتک عن تایتان", "حمله به غول ها"],
  "r": 93
 },
 {
  "id": 136430,
  "name": "VINLAND SAGA SEASON 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx136430-gsBsJjA7hGh9.jpg",
  "year": 2023,
  "al": ["ヴィンランド・サガ SEASON2", "Сага о Винланде 2"],
  "r": 94
 },
 {
  "id": 20613,
  "name": "Akame ga Kill!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20613-HXHpec4bemk5.jpg",
  "year": 2014,
  "al": ["アカメが斬る！", "Akame ga Kiru!", "أكامي: قاتلة بالإكراه!", "Red Eyes Sword", "斬！赤紅之瞳"],
  "r": 95
 },
 {
  "id": 813,
  "name": "Dragon Ball Z",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx813-ZhnFNOeCU5dQ.png",
  "year": 1989,
  "al": ["ドラゴンボールZ", "DBZ", "Dragonball Z", "דרגון בול זי", "What's My Destiny Dragon Ball", "ดราก้อนบอล Z", "Bảy Viên Ngọc Rồng Z", "Драконий жемчуг Зет"],
  "r": 96
 },
 {
  "id": 3588,
  "name": "Soul Eater",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx3588-fSMggQoFSbUI.png",
  "year": 2008,
  "al": ["ソウルイーター", "אכלן הנשמות", "סול איטר", "Пожирач душ"],
  "r": 97
 },
 {
  "id": 20931,
  "name": "Death Parade",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx20931-bktYqOcxPERi.jpg",
  "year": 2015,
  "al": ["デス・パレード", "תהלוכת המוות"],
  "r": 98
 },
 {
  "id": 20997,
  "name": "Charlotte",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20997-axVYrsIfjtYJ.jpg",
  "year": 2015,
  "al": ["Charlotte(シャーロット)"],
  "r": 99
 },
 {
  "id": 164,
  "name": "Mononoke-hime",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx164-ySuGzCWVw2cL.jpg",
  "year": 1997,
  "al": ["Princess Mononoke", "もののけ姫", "La Princesa Mononoke", "Księżniczka Mononoke", "Principessa Mononoke", "الأميرة مونونوكي", "Prenses Mononoke", "Princesse Mononoké"],
  "r": 100
 },
 {
  "id": 105334,
  "name": "Fruits Basket: 1st Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105334-AZwEdMu4KFtV.jpg",
  "year": 2019,
  "al": ["Fruits Basket (2019)", "フルーツバスケット 1st Season", "Fruits Basket (Zenpen)", "Furuba", "Fruba", "フルバ", "水果篮子（第一季）", "水果篮子（2019）"],
  "r": 101
 },
 {
  "id": 6547,
  "name": "Angel Beats!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6547-SYexAn5aFyss.png",
  "year": 2010,
  "al": ["エンジェルビーツ", "פעימות מלאך", "الملاك الوحش", "Ангельские ритмы"],
  "r": 102
 },
 {
  "id": 853,
  "name": "Ouran Koukou Host Club",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx853-fiUtW8yohsSF.jpg",
  "year": 2006,
  "al": ["Ouran High School Host Club", "桜蘭高校ホスト部", "Ohran Koko Host Club", "Ouran Koukou Hosutobu", "Host Club - Amore in affitto", "Hostclub ở trường Ouran"],
  "r": 103
 },
 {
  "id": 153518,
  "name": "Dungeon Meshi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153518-IVXPDY5ph3kO.jpg",
  "year": 2024,
  "al": ["Delicious in Dungeon", "ダンジョン飯", "Dungeon Food", "Dungeon Meal", "Tragones y Mazmorras", "Gloutons et Dragons", "Подземелье вкусностей", "던전밥"],
  "r": 104
 },
 {
  "id": 20832,
  "name": "Overlord",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20832-vUNm5zrYWifc.jpg",
  "year": 2015,
  "al": ["オーバーロード", "Over Lord", "โอเวอร์ลอร์ด", "โอเวอร์ ลอร์ด จอมมารพิชิตโลก"],
  "r": 105
 },
 {
  "id": 6702,
  "name": "FAIRY TAIL",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b6702-KI4qgSMyI8Pm.png",
  "year": 2009,
  "al": ["פיירי טייל", "妖精的尾巴", "フェアリーテイル", "แฟรี่เทล ศึกจอมเวทอภินิหาร"],
  "r": 106
 },
 {
  "id": 176496,
  "name": "Ore dake Level Up na Ken: Season 2 - Arise from the Shadow",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx176496-9BDMjAZGEbq4.png",
  "year": 2025,
  "al": ["Solo Leveling Season 2 -Arise from the Shadow-", "俺だけレベルアップな件 Season 2 -Arise from the Shadow-", "Na Honjaman Level Up 2", "나 혼자만 레벨업 2", "俺だけレベルアップな件 第2期", "Ore dake Level Up na Ken 2nd Season", "Solo Leveling 2ª Temporada -Ergam-se das Sombras-", "나 혼자만 레벨업 -ARISE FROM THE SHADOW-"],
  "r": 107
 },
 {
  "id": 131586,
  "name": "86: Eighty Six Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131586-JhC0wcBi09EZ.jpg",
  "year": 2021,
  "al": ["86 EIGHTY-SIX Part 2", "86－エイティシックス－ 第2クール", "86－エイティシックス－ 2クール", "86 -เอทตี้ซิกซ์- พาร์ท 2"],
  "r": 108
 },
 {
  "id": 13601,
  "name": "PSYCHO-PASS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx13601-i42VFuHpqEOJ.jpg",
  "year": 2012,
  "al": ["PSYCHO-PASS サイコパス", "Психопаспорт"],
  "r": 109
 },
 {
  "id": 227,
  "name": "FLCL",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx227-qOB9ZhVvNnqO.jpg",
  "year": 2000,
  "al": ["フリクリ", "Fooly Cooly", "Furi Kuri"],
  "r": 110
 },
 {
  "id": 20474,
  "name": "JoJo no Kimyou na Bouken: Stardust Crusaders",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20474-xuqem5GBlBtb.jpg",
  "year": 2014,
  "al": ["JoJo's Bizarre Adventure: Stardust Crusaders", "ジョジョの奇妙な冒険 スターダストクルセイダース", "Dai San Bu Kujo Jotaro: Mirai e no Isan", "JoJo no Kimyou na Bouken Part 3: Stardust Crusaders", "JoJo's Bizarre Adventure Part 3: Stardust Crusaders", "ההרפתקה המוזרה של ג'וג'ו: צלבני אבק כוכבים", "مغامرات جوجو العجيبة : فرسان غبار النجم", "Le bizzarre avventure di JoJo: Stardust Crusaders"],
  "r": 111
 },
 {
  "id": 112151,
  "name": "Kimetsu no Yaiba: Mugen Ressha-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112151-1qlQwPB1RrJe.png",
  "year": 2020,
  "al": ["Demon Slayer -Kimetsu no Yaiba- The Movie: Mugen Train", "鬼滅の刃 無限列車編", "KnY Movie", "Els Guardians de la Nit: El Tren Infinit", "Guardianes de la Noche: Tren Infinito", "Demon Slayer: Mugen Treni", "Demon Slayer: Il Treno Mugen", "鬼灭之刃：无限列车篇"],
  "r": 112
 },
 {
  "id": 14813,
  "name": "Yahari Ore no Seishun Love Come wa Machigatteiru.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14813-3mNvcKNEQcDs.jpg",
  "year": 2013,
  "al": ["My Teen Romantic Comedy SNAFU", "やはり俺の青春ラブコメはまちがっている。", "Oregairu", "My youth romantic comedy is wrong as I expected.", "俺ガイル", "我的青春恋爱物语果然有问题", "กะแล้วชีวิตรักวัยรุ่นของผมมันต้องไม่สดใสเลยสักนิด"],
  "r": 113
 },
 {
  "id": 108430,
  "name": "Given",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108430-UdruJPro4vDK.jpg",
  "year": 2019,
  "al": ["ギヴン"],
  "r": 114
 },
 {
  "id": 127720,
  "name": "Mushoku Tensei: Isekai Ittara Honki Dasu Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx127720-ADJgIrUVMdU9.jpg",
  "year": 2021,
  "al": ["Mushoku Tensei: Jobless Reincarnation Cour 2", "無職転生 ～異世界行ったら本気だす～ 第2クール", "Mushoku Tensei: Jobless Reincarnation Part 2", "เกิดชาตินี้พี่ต้องเทพ พาร์ท 2"],
  "r": 115
 },
 {
  "id": 137822,
  "name": "Blue Lock",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx137822-U8naszP96vzC.png",
  "year": 2022,
  "al": ["ブルーロック", "BLUE LOCK ขังดวลแข้ง", "بلو لوك"],
  "r": 116
 },
 {
  "id": 21698,
  "name": "Haikyuu!!: Karasuno Koukou VS Shiratorizawa Gakuen Koukou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21698-RL71mr1YU5Io.png",
  "year": 2016,
  "al": ["HAIKYU!! 3rd Season", "ハイキュー!! 烏野高校 VS 白鳥沢学園高校", "Haikyu!! Karasuno High vs Shiratorizawa Academy", "Haikyuu!! 3", "ไฮคิว!! คู่ตบฟ้าประทาน ภาค 3"],
  "r": 117
 },
 {
  "id": 106286,
  "name": "Tenki no Ko",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx106286-5COcpd0J9VbL.png",
  "year": 2019,
  "al": ["Weathering With You", "天気の子", "El Tiempo Contigo", "Weathering With You - Das Mädchen, das die Sonne berührte", "Les enfants du temps", "O Tempo Com Você", "天气之子", "La ragazza del tempo"],
  "r": 118
 },
 {
  "id": 12189,
  "name": "Hyouka",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12189-zj5AWUYO53Fv.jpg",
  "year": 2012,
  "al": ["氷菓", "Hyouka: Forbidden Secrets", "เฮียวกะปริศนาความทรงจำ", "Хёка", "빙과", "冰菓"],
  "r": 119
 },
 {
  "id": 105310,
  "name": "Enen no Shouboutai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105310-2PKUvoaA6fTn.jpg",
  "year": 2019,
  "al": ["Fire Force", "炎炎ノ消防隊", "หน่วยผจญคนไฟลุก", "כוח האש", "Полум'яні вогнеборці", "Пламенный отряд"],
  "r": 120
 },
 {
  "id": 100922,
  "name": "Grand Blue",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100922-uxEhaCsqMMp3.png",
  "year": 2018,
  "al": ["Grand Blue Dreaming", "ぐらんぶる", "ก๊วนป่วนชวนบุ๋งบุ๋ง"],
  "r": 121
 },
 {
  "id": 20992,
  "name": "Haikyuu!! 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20992-aHgNbcalVEqk.png",
  "year": 2015,
  "al": ["HAIKYU!! 2nd Season", "ハイキュー!! セカンドシーズン", "ไฮคิว!! คู่ตบฟ้าประทาน ภาค 2"],
  "r": 122
 },
 {
  "id": 5680,
  "name": "K-ON!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5680-r3AI3Cwfv0Aq.png",
  "year": 2009,
  "al": ["けいおん!", "Keion", "K on", "K-on", "케이온!", "轻音少女"],
  "r": 123
 },
 {
  "id": 131573,
  "name": "Jujutsu Kaisen 0",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131573-rpl82vDEDRm6.jpg",
  "year": 2021,
  "al": ["呪術廻戦 0", "JJK 0", "咒术回战0", "มหาเวทย์ผนึกมาร : ซีโร่", "‎جوجوتسو كايسن 0", "Jujutsu Kaisen Movie", "Магическая битва 0"],
  "r": 124
 },
 {
  "id": 10087,
  "name": "Fate/Zero",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10087-M4Hd9qrHGrXk.png",
  "year": 2011,
  "al": ["フェイト/ゼロ", "F/Z", "القدر/زيرو", "פייט/זירו", "Судьба/Начало"],
  "r": 125
 },
 {
  "id": 20799,
  "name": "JoJo no Kimyou na Bouken: Stardust Crusaders - Egypt-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20799-S1eyqBDlx51E.jpg",
  "year": 2015,
  "al": ["JoJo's Bizarre Adventure: Stardust Crusaders - Battle in Egypt", "ジョジョの奇妙な冒険 スターダストクルセイダース エジプト編", "Dai San Bu Kujo Jotaro: Mirai e no Isan", "JoJo's Bizarre Adventure: Stardust Crusaders 2nd Season", "JoJo no Kimyou na Bouken: Stardust Crusaders 2nd Season", "JoJo's Bizarre Adventure Part 3: Stardust Crusaders - Battle in Egypt", "JoJo no Kimyou na Bouken Part 3: Stardust Crusaders - Egypt-hen", "JoJo's Bizarre Adventure: Stardust Crusaders - Egypt Arc"],
  "r": 126
 },
 {
  "id": 108632,
  "name": "Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108632-lQWnmw7XaNOK.jpg",
  "year": 2020,
  "al": ["Re:ZERO -Starting Life in Another World- Season 2", "Re:ゼロから始める異世界生活 2nd Season", "Re:Zero kara Hajimeru Isekai Seikatsu (2020)", "Re: 제로부터 시작하는 이세계 생활 2기", "Re:从零开始的异世界生活第二季（上半）", "Re:从零开始的异世界生活 2 上半", "Re:Zero รีเซทชีวิต ฝ่าวิกฤตต่างโลก ภาค 2", "Re:Zero — жизнь с нуля в другом мире. Второй сезон"],
  "r": 127
 },
 {
  "id": 140439,
  "name": "Mob Psycho 100 III",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx140439-bPKmhe1wNxc9.jpg",
  "year": 2022,
  "al": ["モブサイコ100 Ⅲ", "モブサイコ100 III", "ม็อบไซโค 100 คนพลังจิต ภาค 3", "Моб Психо 100 III"],
  "r": 128
 },
 {
  "id": 116674,
  "name": "BLEACH: Sennen Kessen-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116674-p3zK4PUX2Aag.jpg",
  "year": 2022,
  "al": ["BLEACH: Thousand-Year Blood War", "BLEACH 千年血戦篇", "بليتش: حرب الألف سنة الدموية", "Bleach: La guerre sanglante de mille ans", "BLEACH TYBW"],
  "r": 129
 },
 {
  "id": 181444,
  "name": "Kaoru Hana wa Rin to Saku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx181444-Ut9DDUZdfHwg.jpg",
  "year": 2025,
  "al": ["The Fragrant Flower Blooms With Dignity", "薫る花は凛と咲く", "Kaoru i Rin: Rozkwitając z tobą", "BLOOM", "Благоухающий цветок расцветает с достоинством", "La nobleza de las flores", "Kaoru und Rin", "Güzel Kokulu Çiçekler Zarafetle Açar"],
  "r": 130
 },
 {
  "id": 10165,
  "name": "Nichijou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10165-tw8Cz7K9tfVJ.png",
  "year": 2011,
  "al": ["Nichijou - My Ordinary Life", "日常", "Everyday", "Мелочи Жизни", "Повсякденнощі"],
  "r": 131
 },
 {
  "id": 103572,
  "name": "Go-toubun no Hanayome",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx103572-cchriAdH95cQ.png",
  "year": 2019,
  "al": ["The Quintessential Quintuplets", "五等分の花嫁", "5-toubun no Hanayome", "The Five Wedded Brides", "เจ้าสาวผมเป็นแฝดห้า", "五等分的新娘", "Eşsiz Beşizler", "Sposób na pięcioraczki"],
  "r": 132
 },
 {
  "id": 128893,
  "name": "Jigokuraku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx128893-Gc2t8b8M0mVu.jpg",
  "year": 2023,
  "al": ["Hell’s Paradise", "地獄楽", "Hell’s Paradise: Jigokuraku", "สุขาวดีอเวจี", "Адский рай"],
  "r": 133
 },
 {
  "id": 33,
  "name": "Kenpuu Denki Berserk",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx33-PSwfE5B0gejI.jpg",
  "year": 1997,
  "al": ["Berserk", "剣風伝奇ベルセルク", "Kenfu Denki Berserk", "Sword-Wind Chronicle Berserk", "Berserk (1997)", "Берсерк"],
  "r": 134
 },
 {
  "id": 9989,
  "name": "Ano Hi Mita Hana no Namae wo Bokutachi wa Mada Shiranai.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx9989-hImMg6kCMm6I.jpg",
  "year": 2011,
  "al": ["Anohana: The Flower We Saw That Day", "あの日見た花の名前を僕達はまだ知らない。", "AnoHana", "We Still Don't Know the Name of the Flower We Saw That Day.", "אנוהאנה: הפרח שראינו ביום ההוא", "อาโนะฮานะ ดอกไม้ ความทรงจำ และมิตรภาพ", "あの花", "AnoHana: ancora non conosciamo il nome del fiore che abbiamo visto quel giorno"],
  "r": 135
 },
 {
  "id": 21170,
  "name": "Ansatsu Kyoushitsu 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21170-kbcfTTZGSaFt.jpg",
  "year": 2016,
  "al": ["Assassination Classroom Second Season", "暗殺教室 第２期", "فصل الاغتيال 2", "Klasa skrytobójców 2", "Assassination Classroom Season 2"],
  "r": 136
 },
 {
  "id": 99578,
  "name": "Wotaku ni Koi wa Muzukashii",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx99578-oO5KChtfhzln.png",
  "year": 2018,
  "al": ["Wotakoi: Love is Hard for Otaku", "ヲタクに恋は難しい", "Otaku ni Koi wa Muzukashii", "WotaKoi", "It’s Difficult to Love an Otaku", "Love is Hard for an Otaku", "Love is Hard for Nerds", "ווטקוי: האהבה קשה לאוטאקו"],
  "r": 137
 },
 {
  "id": 147105,
  "name": "Tongari Boushi no Atelier",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx147105-rwOX8qyUy8gV.jpg",
  "year": 2026,
  "al": ["Witch Hat Atelier", "とんがり帽子のアトリエ", "Atelier of Witch Hat", "จอมเวทฝึกหัดกับหมวกมหัศจรรย์", "Atelier spiczastych kapeluszy", "Cadı Şapkası Atölyesi", "L'Atelier des Sorciers", "Xưởng Phép Thuật"],
  "r": 138
 },
 {
  "id": 21856,
  "name": "Boku no Hero Academia 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21856-gutauxhWAwn6.png",
  "year": 2017,
  "al": ["My Hero Academia Season 2", "僕のヒーローアカデミア２", "BNHA 2", "MHA 2", "나의 히어로 아카데미아 2기", "나히아 2기", "我的英雄学院 2", "我的英雄学院第二季"],
  "r": 139
 },
 {
  "id": 124194,
  "name": "Fruits Basket: The Final",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx124194-TJlqMMR7BGn9.jpg",
  "year": 2021,
  "al": ["Fruits Basket The Final Season", "フルーツバスケットThe Final", "Furuba", "Fruba", "フルバ", "Fruits Basket Season 3", "水果篮子 最终季", "เสน่ห์สาวข้าวปั้น ภาค 3"],
  "r": 140
 },
 {
  "id": 126403,
  "name": "Shiguang Dailiren",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx126403-BfVSRzWUtVFW.png",
  "year": 2021,
  "al": ["Link Click", "时光代理人", "Time Agent", "CLICK", "ข้ามเวลาพิชิตภารกิจ"],
  "r": 141
 },
 {
  "id": 141391,
  "name": "Yofukashi no Uta",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx141391-M3ZgUKTPENUk.jpg",
  "year": 2022,
  "al": ["Call of the Night", "よふかしのうた", "Song of the Night Walkers", "Night Owl Song", "เพลงรักมนุษย์ค้างคาว", "نداء الليل", "Zew nocy", "Il richiamo della notte"],
  "r": 142
 },
 {
  "id": 17074,
  "name": "Monogatari Series: Second Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx17074-xMhVAZsEDH66.png",
  "year": 2013,
  "al": ["Monogatari Series Second Season", "〈物語〉シリーズ セカンドシーズン", "Nekomonogatari White", "Kabukimonogatari", "Otorimonogatari", "Onimonogatari", "Koimonogatari"],
  "r": 143
 },
 {
  "id": 1210,
  "name": "NHK ni Youkoso!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1210-2XotjcgqdcaX.jpg",
  "year": 2006,
  "al": ["Welcome to the N-H-K", "N・H・Kにようこそ！", "Welcome to the NHK", "Welcome to the N.H.K.", "欢迎加入NHK！", "Bienvenue dans la NHK"],
  "r": 144
 },
 {
  "id": 20923,
  "name": "Shokugeki no Souma",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20923-pNT38pjW3RFH.jpg",
  "year": 2015,
  "al": ["Food Wars!", "食戟のソーマ", "لا سلام على طعام", "Food Wars! The First Plate", "食戟之灵", "ยอดนักปรุงโซมะ"],
  "r": 145
 },
 {
  "id": 178025,
  "name": "Gachiakuta",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178025-cWJKEsZynkil.jpg",
  "year": 2025,
  "al": ["ガチアクタ", "Гачиакута"],
  "r": 146
 },
 {
  "id": 124153,
  "name": "SK∞",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx124153-uEBI764OSavB.png",
  "year": 2021,
  "al": ["SK8 the Infinity", "SK∞ エスケーエイト", "SK Eight", "เอสเคเอท สเกตบอร์ดล้างเมือง", "Hội Thanh Niên Lướt Ván SK∞", "Ski Tak Terbatas SK∞"],
  "r": 147
 },
 {
  "id": 176301,
  "name": "Kusuriya no Hitorigoto 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx176301-TIGmldLffQGX.jpg",
  "year": 2025,
  "al": ["The Apothecary Diaries Season 2", "薬屋のひとりごと 第2期", "Die Tagebücher der Apothekerin Season 2", "Diários de uma Apotecária 2ª Temporada", "Монолог фармацевта 2", "Les Carnets de l'apothicaire Saison 2", "Los diarios de la boticaria temporada 2", "Dược sư tự sự"],
  "r": 148
 },
 {
  "id": 100166,
  "name": "Boku no Hero Academia 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100166-jUCZYbzn2XLw.jpg",
  "year": 2018,
  "al": ["My Hero Academia Season 3", "僕のヒーローアカデミア３", "BNHA 3", "MHA 3", "我的英雄学院 3", "我的英雄学院第三季", "มายฮีโร่ อคาเดเมีย ภาค 3", "3أكاديميتي للأبطال"],
  "r": 149
 },
 {
  "id": 119661,
  "name": "Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx119661-GDbUZxrZMz01.png",
  "year": 2021,
  "al": ["Re:ZERO -Starting Life in Another World- Season 2 Part 2", "Re:ゼロから始める異世界生活 2nd Season Part 2", "Re:Zero kara Hajimeru Isekai Seikatsu (2021)", "Re: 제로부터 시작하는 이세계 생활 2기 파트 2", "Re:从零开始的异世界生活第二季（下半）", "Re:从零开始的异世界生活 2 下半", "Re:Zero รีเซทชีวิต ฝ่าวิกฤตต่างโลก ภาค 2 พาร์ท 2", "Re:Zero — жизнь с нуля в другом мире. Второй сезон"],
  "r": 150
 },
 {
  "id": 20789,
  "name": "Nanatsu no Taizai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20789-Ma5ouSYPkru9.jpg",
  "year": 2014,
  "al": ["The Seven Deadly Sins", "七つの大罪", "七大罪", "ศึกตำนาน 7 อัศวิน", "7DS", "Семь смертных грехов"],
  "r": 151
 },
 {
  "id": 21776,
  "name": "Kobayashi-san Chi no Maidragon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21776-bwPaYKhnKfUs.png",
  "year": 2017,
  "al": ["Miss Kobayashi's Dragon Maid", "小林さんちのメイドラゴン", "Kobayashi-san Chi no Maid Dragon", "小林家的龙女仆", "น้องเมดมังกรของคุณโคบายาชิ", "Дракониха-горничная госпожи Кобаяси", "โคบายาชิซังกับเมดมังกร"],
  "r": 152
 },
 {
  "id": 14741,
  "name": "Chuunibyou demo Koi ga Shitai!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14741-CGXEIeUe2roA.jpg",
  "year": 2012,
  "al": ["Love, Chunibyo & Other Delusions", "中二病でも恋がしたい!", "Chu-2 Byo demo Koi ga Shitai!", "Regardless of My Adolescent Delusions of Grandeur, I Want a Date!", "Miłość, gimbaza i kosmiczna faza", "中二病也要谈恋爱！"],
  "r": 153
 },
 {
  "id": 104157,
  "name": "Seishun Buta Yarou wa Yumemiru Shoujo no Yume wo Minai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104157-rk99XI56PaIC.jpg",
  "year": 2019,
  "al": ["Rascal Does Not Dream of a Dreaming Girl", "青春ブタ野郎はゆめみる少女の夢を見ない", "青ブタ", "Ao Buta", "青春猪头少年不会梦到怀梦美少女", "Этот глупый свин не понимает мечту девочки-зайки. Фильм", "Негодник, которому не снилась девушка-кролик. Фильм"],
  "r": 154
 },
 {
  "id": 21709,
  "name": "Yuuri!!! on ICE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21709-aqPBDxJPruYR.png",
  "year": 2016,
  "al": ["Yuri!!! on ICE", "ユーリ!!! on ICE"],
  "r": 155
 },
 {
  "id": 108511,
  "name": "Tensei Shitara Slime Datta Ken 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108511-PufFordLNyIb.jpg",
  "year": 2021,
  "al": ["That Time I Got Reincarnated as a Slime Season 2", "転生したらスライムだった件 第2期", "転スラ2", "TenSura 2", "关于我转生变成史莱姆这档事第二季（上半）", "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว ภาค 2", "Moi, quand je me réincarne en Slime Saison 2", "Meine Wiedergeburt als Schleim in einer anderen Welt Staffel 2"],
  "r": 156
 },
 {
  "id": 114535,
  "name": "Fumetsu no Anata e",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114535-y3NnjexcqKG1.jpg",
  "year": 2021,
  "al": ["To Your Eternity", "不滅のあなたへ", "To You, the Immortal", "Uma vida imortal", "致不灭的你", "A te, l'immortale", "Ku twej wieczności", "불멸의 그대에게"],
  "r": 157
 },
 {
  "id": 104276,
  "name": "Boku no Hero Academia 4",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104276-SnEowMvesWIE.png",
  "year": 2019,
  "al": ["My Hero Academia Season 4", "僕のヒーローアカデミア４", "BNHA 4", "MHA 4", "我的英雄学院 4", "我的英雄学院第四季", "มายฮีโร่ อคาเดเมีย ภาค 4", "أكاديميتي للأبطال"],
  "r": 158
 },
 {
  "id": 113717,
  "name": "Ousama Ranking",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113717-9sNnN8WRgK15.jpg",
  "year": 2021,
  "al": ["Ranking of Kings", "王様ランキング", "King Ranking", "อันดับพระราชา", "تصنيف الملوك", "國王排名"],
  "r": 159
 },
 {
  "id": 20661,
  "name": "Zankyou no Terror",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20661-aCR7QgzDfOSI.png",
  "year": 2014,
  "al": ["Terror in Resonance", "残響のテロル", "Terror in Tokyo", "Эхо террора", "Zagadkowi terroryści"],
  "r": 160
 },
 {
  "id": 108463,
  "name": "Jibaku Shounen Hanako-kun",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108463-u03vrYnyB3L9.jpg",
  "year": 2020,
  "al": ["Toilet-bound Hanako-kun", "地縛少年 花子くん", "지박소년 하나코 군", "地缚少年花子君", "Туалетный мальчик Ханако", "Hanako-kun e os Mistérios do Colégio Kamone", "ฮานาโกะคุง วิญญาณติดที่"],
  "r": 161
 },
 {
  "id": 172463,
  "name": "Jujutsu Kaisen: Shimetsu Kaiyuu - Zenpen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx172463-LnXqHzt74SJL.jpg",
  "year": 2026,
  "al": ["JUJUTSU KAISEN Season 3: The Culling Game Part 1", "呪術廻戦 死滅回游 前編", "Jujutsu Kaisen 3rd Season", "呪術廻戦 第3期", "JJK3", "มหาเวทย์ผนึกมาร จรดลล้างบาง พาร์ต 1"],
  "r": 162
 },
 {
  "id": 20607,
  "name": "Ping Pong THE ANIMATION",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20607-fIOxVISIl0HY.jpg",
  "year": 2014,
  "al": ["ピンポン THE ANIMATION"],
  "r": 163
 },
 {
  "id": 153288,
  "name": "Kaijuu 8-gou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153288-25FBfFJzEQ5O.jpg",
  "year": 2024,
  "al": ["Kaiju No. 8", "怪獣８号", "Monster #8", "8Kaijuu", "KAIJU No. EIGHT", "Kaiju N°8", "괴수 8호"],
  "r": 164
 },
 {
  "id": 145139,
  "name": "Kimetsu no Yaiba: Katanakaji no Sato-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx145139-rRimpHGWLhym.png",
  "year": 2023,
  "al": ["Demon Slayer: Kimetsu no Yaiba Swordsmith Village Arc", "鬼滅の刃 刀鍛冶の里編", "KnY 3", "ดาบพิฆาตอสูร ภาค 3 บทหมู่บ้านช่างตีดาบ", "Demon Slayer: Kimetsu no Yaiba - Le village des forgerons", "Истребитель демонов: Kimetsu no Yaiba. Деревня кузнецов", "Miecz zabójcy demonów – Kimetsu no Yaiba: Wioska płatnerzy"],
  "r": 165
 },
 {
  "id": 98707,
  "name": "Houseki no Kuni",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98707-25nUKb4XUFgY.png",
  "year": 2017,
  "al": ["Land of the Lustrous", "宝石の国", "L'Ère des Cristaux", "Das Land der Juwelen", "Страна самоцветов", "Vương Quốc Bảo Thạch", "ดินแดนอัญมณี"],
  "r": 166
 },
 {
  "id": 143270,
  "name": "Lycoris Recoil",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx143270-rfkyiYXhek5w.jpg",
  "year": 2022,
  "al": ["リコリス・リコイル", "ไลโคริส รีคอยล์", "LycoReco", "Ликорис Рекойл", "莉可麗絲"],
  "r": 167
 },
 {
  "id": 11741,
  "name": "Fate/Zero 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11741-oEy1fJHYm2zJ.jpg",
  "year": 2012,
  "al": ["Fate/Zero Season 2", "Fate/Zero 2ndシーズン", "フェイト/ゼロ 2ndシーズン", "F/Z", "Судьба/Начало 2"],
  "r": 168
 },
 {
  "id": 21613,
  "name": "Youjo Senki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21613-qT3NiwYP5dYc.png",
  "year": 2017,
  "al": ["Saga of Tanya the Evil", "幼女戦記", "幼女战记", "Колдунья в погонах"],
  "r": 169
 },
 {
  "id": 129201,
  "name": "Summer Time Render",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx129201-HJBauga2be8I.png",
  "year": 2022,
  "al": ["Summer Time Rendering", "サマータイムレンダ", "Summertime Render", "ปริศนาบ้านเก่า เงามรณะ", "A Ilha das Sombras", "夏日重现", "La Isla de las Sombras", "Tajemnica wyspy"],
  "r": 170
 },
 {
  "id": 10620,
  "name": "Mirai Nikki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10620-dUZeNej0W4QN.png",
  "year": 2011,
  "al": ["The Future Diary", "未来日記", "未来日记", "יומן העתיד"],
  "r": 171
 },
 {
  "id": 98478,
  "name": "3-gatsu no Lion 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98478-Yua5iL9zbrji.jpg",
  "year": 2017,
  "al": ["March comes in like a lion Season 2", "３月のライオン 第2シリーズ", "Sangatsu no Lion 2", "מרץ מגיע כאריה 2"],
  "r": 172
 },
 {
  "id": 7054,
  "name": "Kaichou wa Maid-sama!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx7054-GW4D7VAZG19W.png",
  "year": 2010,
  "al": ["Maid-Sama!", "会長はメイド様!", "Kaicho wa Maidsama", "Kaichou wa Meido Sama", "Class President is a Maid!"],
  "r": 173
 },
 {
  "id": 7785,
  "name": "Yojouhan Shinwa Taikei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx7785-aTjIhsYva8cJ.jpg",
  "year": 2010,
  "al": ["The Tatami Galaxy", "四畳半神話大系", "Yojo-Han Shinwa Taikei", "Yojou-Han Shinwa Taikei", "Yojohan Shinwa Taikei", "四叠半神话大系", "4½ Tatami Mythological Chronicles"],
  "r": 174
 },
 {
  "id": 14713,
  "name": "Kamisama Hajimemashita",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx14713-RyZ7bA7CdvGw.jpg",
  "year": 2012,
  "al": ["Kamisama Kiss", "神様はじめました", "Kami-sama Hajimemashita", "Kami-sama Kiss", "Soy Una Diosa ¿Y ahora qué?", "Приємно познайомитись, Бог", "Очень приятно, Бог", "The Girl In The World Of Spirit"],
  "r": 175
 },
 {
  "id": 20920,
  "name": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20920-MTREwZOG4BAD.jpg",
  "year": 2015,
  "al": ["Is It Wrong to Try to Pick Up Girls in a Dungeon?", "ダンジョンに出会いを求めるのは間違っているだろうか", "Danmachi", "Dungeon ni Deai o Motomeru no wa Machigatte Iru Darouka: Familia Myth", "DanMachi: É Errado Tentar Pegar Garotas numa Masmorra?", "DanMachi: Família Myth", "Danmachi: ¿Qué Tiene de Malo Intentar Ligar en una Mazmorra?", "在地下城寻求邂逅是否搞错了什么"],
  "r": 176
 },
 {
  "id": 108489,
  "name": "Yahari Ore no Seishun Love Come wa Machigatteiru. Kan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108489-yGmYCE6dhFta.png",
  "year": 2020,
  "al": ["My Teen Romantic Comedy SNAFU Climax!", "やはり俺の青春ラブコメはまちがっている。完", "Oregairu 3", "俺ガイル3", "กะแล้วชีวิตรักวัยรุ่นของผมมันต้องไม่สดใสเลยสักนิด ภาค 3", "กะแล้วชีวิตรักวัยรุ่นของผมมันต้องไม่สดใสเลยสักนิด ภาคอวสาน", "Oregairu Kan"],
  "r": 177
 },
 {
  "id": 21699,
  "name": "Kono Subarashii Sekai ni Shukufuku wo! 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21699-Fkbnkl9ZC6fW.png",
  "year": 2017,
  "al": ["KONOSUBA -God's blessing on this wonderful world! 2", "この素晴らしい世界に祝福を！2", "Konosuba 2", "Konosuba! - As Bençãos de Deus Neste Mundo Maravilhoso 2!", "为美好的世界献上祝福！2", "为美好的世界献上祝福第二季", "ขอให้โชคดีมีชัยในโลกแฟนตาซี! ภาค 2", "Konosuba : Une explosion dans ce monde merveilleux !"],
  "r": 178
 },
 {
  "id": 99426,
  "name": "Sora yori mo Tooi Basho",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99426-ti5BL69Ip3kZ.png",
  "year": 2018,
  "al": ["A Place Further Than the Universe", "宇宙よりも遠い場所", "Uchuu Yorimo Toui Basho", "Sora yorimo Tooi Basho", "Uchuu yori mo Tooi Basho", "Yorimoi", "מקום רחוק יותר מהיקום", "ตามหัวใจไปสุดขอบฟ้า"],
  "r": 179
 },
 {
  "id": 889,
  "name": "BLACK LAGOON",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx889-4S7N2ciq2cwA.png",
  "year": 2006,
  "al": ["ブラック・ラグーン", "البحيرة السوداء", "Пираты Черной Лагуны"],
  "r": 180
 },
 {
  "id": 223,
  "name": "Dragon Ball",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx223-scE5uJfXqqj8.png",
  "year": 1986,
  "al": ["ドラゴンボール", "Dragonball", "Bola de Drac", "דרגון בול", "ดราก้อนบอล", "Bảy Viên Ngọc Rồng", "DB", "Драконий жемчуг"],
  "r": 181
 },
 {
  "id": 392,
  "name": "Yuu☆Yuu☆Hakusho",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx392-z90299zIvYmx.png",
  "year": 1992,
  "al": ["Yu Yu Hakusho: Ghostfiles", "幽☆遊☆白書", "Yu Yu Hakusho", "Ghost Fighter", "Poltergeist Report", "YYH", "יו יו האקושו", "يو يو هاكوشو: ملفات الأشباح"],
  "r": 182
 },
 {
  "id": 263,
  "name": "Hajime no Ippo: THE FIGHTING!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx263-ivVyn9xAgwSZ.png",
  "year": 2000,
  "al": ["はじめの一歩 THE FIGHTING!", "The First Step", "Fighting Spirit", "Espíritu de lucha", "Hajime no Ippo: A Luta!", "Первый шаг"],
  "r": 183
 },
 {
  "id": 110349,
  "name": "GREAT PRETENDER",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx110349-59hhZ9CNHVdk.png",
  "year": 2020,
  "al": ["大欺诈师", "הנוכל", "المحتال العظيم", "El timador timado", "Великий притворщик", "Ο Μεγάλος Υποκριτής", "EL GRAN FARSANTE", "GrePre"],
  "r": 184
 },
 {
  "id": 245,
  "name": "GTO",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx245-NcQAyTipUMeO.jpg",
  "year": 1999,
  "al": ["GTO: Great Teacher Onizuka", "グレート・ティーチャー・オニヅカ", "GTO - The Animation"],
  "r": 185
 },
 {
  "id": 47,
  "name": "AKIRA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx47-4CR68arv452h.jpg",
  "year": 1988,
  "al": ["アキラ"],
  "r": 186
 },
 {
  "id": 133965,
  "name": "Komi-san wa, Komyushou desu.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx133965-9TZBS4m4yvED.png",
  "year": 2021,
  "al": ["Komi Can’t Communicate", "古見さんは、コミュ症です。", "Comi san ha Comyusho desu", "مشكلة كومي", "Komi-san wa, Comyushou desu.", "โฉมงามพูดไม่เก่งกับผองเพื่อนไม่เต็มเต็ง", "Komi cherche ses mots", "Komi không thể giao tiếp"],
  "r": 187
 },
 {
  "id": 182255,
  "name": "Sousou no Frieren 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx182255-butzrqd4I0aC.jpg",
  "year": 2026,
  "al": ["Frieren: Beyond Journey’s End Season 2", "葬送のフリーレン 第2期", "Провожающая в последний путь Фрирен 2", "장송의 프리렌 2기"],
  "r": 188
 },
 {
  "id": 13759,
  "name": "Sakurasou no Pet na Kanojo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx13759-xNf0gJK4Axt2.jpg",
  "year": 2012,
  "al": ["The Pet Girl of Sakurasou", "さくら荘のペットな彼女", "Sakura-sou no Pet na Kanojo", "樱花庄的宠物女孩"],
  "r": 189
 },
 {
  "id": 11771,
  "name": "Kuroko no Basket",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11771-uvr44RAwRxPw.jpg",
  "year": 2012,
  "al": ["Kuroko's Basketball", "黒子のバスケ", "Kuroko no Basuke", "The Basketball Which Kuroko Plays", "הכדורסל של קורוקו", "Баскетбол Куроко", "Το Μπάσκετ του Κουρόκο"],
  "r": 190
 },
 {
  "id": 6045,
  "name": "Kimi ni Todoke",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6045-JujXjoWtslUM.jpg",
  "year": 2009,
  "al": ["Kimi ni Todoke: From Me to You", "君に届け", "Reaching You", "Arrivare a te", "Llegando a ti", "Kimi ni Todoke: Que Chegue a Você"],
  "r": 191
 },
 {
  "id": 98314,
  "name": "Kakegurui",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b98314-TSJykxVwCCQN.jpg",
  "year": 2017,
  "al": ["賭ケグルイ", "Kakegurui - Compulsive Gambler", "Kakegurui: Das Leben ist ein Spiel", "Gambling School", "โคตรเซียนโรงเรียนพนัน", "Безумный Азарт"],
  "r": 192
 },
 {
  "id": 19603,
  "name": "Fate/stay night: Unlimited Blade Works",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx19603-ycT0pyEgDVQu.jpg",
  "year": 2014,
  "al": ["Fate/stay night [Unlimited Blade Works]", "フェイト/ステイナイト Unlimited Blade Works", "Fate/UBW", "פייט/סטיי נייט: מלאכת חרבות אינסופית", "Судьба/Ночь схватки: Бесконечный мир клинков"],
  "r": 193
 },
 {
  "id": 6746,
  "name": "Durarara!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6746-3LTwM95Uqeoa.png",
  "year": 2010,
  "al": ["デュラララ!!", "DRRR!!", "דורארארה!!"],
  "r": 194
 },
 {
  "id": 20698,
  "name": "Yahari Ore no Seishun Love Come wa Machigatteiru. Zoku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20698-YZIYor2zW3Ta.png",
  "year": 2015,
  "al": ["My Teen Romantic Comedy SNAFU TOO!", "やはり俺の青春ラブコメはまちがっている。続", "Oregairu Zoku", "Oregairu 2", "俺ガイル2", "我的青春恋爱物语果然有问题 续", "กะแล้วชีวิตรักวัยรุ่นของผมมันต้องไม่สดใสเลยสักนิด ภาค 2"],
  "r": 195
 },
 {
  "id": 523,
  "name": "Tonari no Totoro",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx523-fErBvxOHP7IX.jpg",
  "year": 1988,
  "al": ["My Neighbor Totoro", "となりのトトロ", "My Neighbour Totoro", "Meu Amigo Totoro", "Mi Vecino Totoro", "Komşum Totoro", "השכן הקסום שלי טוטורו", "Mój sąsiad Totoro"],
  "r": 196
 },
 {
  "id": 174788,
  "name": "Look Back",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx174788-9LsUnn0oEppv.jpg",
  "year": 2024,
  "al": ["ルックバック"],
  "r": 197
 },
 {
  "id": 20770,
  "name": "Akatsuki no Yona",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20770-brCDvhTXlums.png",
  "year": 2014,
  "al": ["Yona of the Dawn", "暁のヨナ", "AkaYona", "Йона на заре", "Ёна на заре", "Рассвет Йоны", "Yona, princesse de l'aube"],
  "r": 198
 },
 {
  "id": 21366,
  "name": "3-gatsu no Lion",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21366-0wrYK0kjKeFn.jpg",
  "year": 2016,
  "al": ["March comes in like a lion", "３月のライオン", "Sangatsu no Lion", "Un marzo da leoni", "מרץ מגיע כאריה", "أسد آذار"],
  "r": 199
 },
 {
  "id": 109261,
  "name": "Go-toubun no Hanayome ∬",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx109261-65rKxMDlcU9r.png",
  "year": 2021,
  "al": ["The Quintessential Quintuplets 2", "五等分の花嫁∬", "5-toubun no Hanayome ∬", "Go-toubun no Hanayome 2nd Season", "The Five Wedded Brides 2nd Season", "五等分的新娘∬", "เจ้าสาวผมเป็นแฝดห้า ภาค 2"],
  "r": 200
 },
 {
  "id": 457,
  "name": "Mushishi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx457-l6cTtNgI9Bi6.png",
  "year": 2005,
  "al": ["MUSHI-SHI", "蟲師", "מושישי", "กีฏจารย์กับอาถรรพ์แมลงพิสดาร", "Мастер Муши"],
  "r": 201
 },
 {
  "id": 11111,
  "name": "Another",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11111-gvvE5bBYsyFo.png",
  "year": 2012,
  "al": ["アナザー"],
  "r": 202
 },
 {
  "id": 11617,
  "name": "High School DxD",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx11617-nmxMU9Zh3H5R.jpg",
  "year": 2012,
  "al": ["ハイスクールD×D", "תיכון די אקס די", "Highschool DxD"],
  "r": 203
 },
 {
  "id": 185407,
  "name": "Takopii no Genzai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx185407-7uzY4fA3hokP.jpg",
  "year": 2025,
  "al": ["Takopi's Original Sin", "タコピーの原罪"],
  "r": 204
 },
 {
  "id": 9919,
  "name": "Ao no Exorcist",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx9919-nXS7JOZrWHfS.jpg",
  "year": 2011,
  "al": ["Blue Exorcist", "青の祓魔師", "Ao no Futsumashi", "اللهب الأزرق", "Ο Γαλάζιος Εξορκιστής"],
  "r": 205
 },
 {
  "id": 20829,
  "name": "Owari no Seraph",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20829-pgsXVjrfyI5V.png",
  "year": 2015,
  "al": ["Seraph of the End: Vampire Reign", "終わりのセラフ", "OwaSera", "Seraph of the End: El Reino de los Vampiros", "เทวทูตแห่งโลกมืด"],
  "r": 206
 },
 {
  "id": 103047,
  "name": "Violet Evergarden Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx103047-odblDHHEdehK.jpg",
  "year": 2020,
  "al": ["Violet Evergarden: the Movie", "劇場版 ヴァイオレット・エヴァーガーデン", "Виолетта Эвергарден", "Вайоллет Эвергарден", "薇尔莉特·伊芙加登", "Violet Evergarden : Le film"],
  "r": 207
 },
 {
  "id": 155783,
  "name": "Tengoku Daimakyou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx155783-YosKbsmZzuDE.jpg",
  "year": 2023,
  "al": ["Tengoku Daimakyo", "天国大魔境", "Heavenly Delusion", "Tengoku-Daimakyo: Ilusão Celestial", "ถ้ำปีศาจแดนสวรรค์"],
  "r": 208
 },
 {
  "id": 105228,
  "name": "Dorohedoro",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105228-I4xr84QS9Pvk.jpg",
  "year": 2020,
  "al": ["ドロヘドロ", "دوروهيدورو", "สาปพันธุ์อสูร", "Дорохедоро"],
  "r": 209
 },
 {
  "id": 98444,
  "name": "Yuru Camp△",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98444-Vzysp1EsrzgD.jpg",
  "year": 2018,
  "al": ["Laid-Back Camp", "ゆるキャン△", "Yurucamp", "Yurukyan△", "摇曳露营△", "แคมป์สบายสไตล์สาวๆ"],
  "r": 210
 },
 {
  "id": 116742,
  "name": "Tensei Shitara Slime Datta Ken 2nd Season Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116742-jn0dW23ftehq.jpg",
  "year": 2021,
  "al": ["That Time I Got Reincarnated as a Slime Season 2 Part 2", "転生したらスライムだった件 第2期 第2クール", "Tensura 2", "关于我转生变成史莱姆这档事第二季（下半）", "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว ภาค 2 พาร์ท 2", "Moi, quand je me réincarne en Slime Saison 2 Partie 2", "О моём перерождении в слизь 2", "転スラ 2"],
  "r": 211
 },
 {
  "id": 116267,
  "name": "Tonikaku Kawaii",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116267-Eo1biPBTlL4i.jpg",
  "year": 2020,
  "al": ["TONIKAWA: Over The Moon For You", "トニカクカワイイ", "Fly Me to the Moon", "Tonikaku Cawaii", "Generally Cute", "总之就是非常可爱", "จะยังไงภรรยาของผมก็น่ารัก", "Красавица: Унеси меня на Луну"],
  "r": 212
 },
 {
  "id": 146065,
  "name": "Mushoku Tensei II: Isekai Ittara Honki Dasu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx146065-IjirxRK26O03.png",
  "year": 2023,
  "al": ["Mushoku Tensei: Jobless Reincarnation Season 2", "無職転生Ⅱ ～異世界行ったら本気だす～", "เกิดชาตินี้พี่ต้องเทพ ซีซั่น 2", "Mushoku Tensei: Isekai Ittara Honki Dasu 2nd Season", "Mushoku Tensei II: Jobless Reincarnation", "Mushoku Tensei II: Reencarnación desde cero", "无职转生～到了异世界就拿出真本事～第2季"],
  "r": 213
 },
 {
  "id": 21127,
  "name": "Steins;Gate 0",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21127-7ARWZkDXKiiD.jpg",
  "year": 2018,
  "al": ["シュタインズ・ゲート ゼロ", "s;g0", "命运石之门0"],
  "r": 214
 },
 {
  "id": 777,
  "name": "HELLSING OVA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx777-F6547pSAR2Zd.jpg",
  "year": 2006,
  "al": ["Hellsing Ultimate", "ヘルシング OVA", "הלסינג אוליטמטיבי", "Хеллсинг"],
  "r": 215
 },
 {
  "id": 7791,
  "name": "K-ON!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx7791-4tnomla2mMDp.png",
  "year": 2010,
  "al": ["K-ON! Season 2", "けいおん!!", "Keion 2", "K-On!! 2nd Season", "K on 2", "케이온!!"],
  "r": 216
 },
 {
  "id": 98436,
  "name": "Mahoutsukai no Yome",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98436-n7sK6POCd0XV.png",
  "year": 2017,
  "al": ["The Ancient Magus' Bride", "魔法使いの嫁", "Mahou Tsukai no Yome", "Mahoyome", "Невеста чародея", "เจ้าสาวผมแดงกับจอมเวทอสูร"],
  "r": 217
 },
 {
  "id": 2167,
  "name": "CLANNAD",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2167-pSDBcyc0vjej.jpg",
  "year": 2007,
  "al": ["ＣＬＡＮＮＡＤ -クラナド-"],
  "r": 218
 },
 {
  "id": 162314,
  "name": "Shingeki no Kyojin: The Final Season - Kanketsu-hen Kouhen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx162314-qIWdAAFtvY8J.jpg",
  "year": 2023,
  "al": ["Attack on Titan Final Season THE FINAL CHAPTERS Special 2", "進撃の巨人 The Final Season完結編 後編", "Shingeki no Kyojin: The Final Season Final Edition", "Attack on Titan Final Season Part 3 Final Arc Part 2", "Attack on Titan: The Final Season Part 4", "Shingeki no Kyojin: The Final Season Part 4", "SnK 4", "AoT 4"],
  "r": 219
 },
 {
  "id": 113596,
  "name": "Josee to Tora to Sakanatachi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113596-LKA0bYJGjLnB.jpg",
  "year": 2020,
  "al": ["Josee, the Tiger and the Fish", "ジョゼと虎と魚たち", "Josee to Tora to Sakana-tachi", "乔西的虎与鱼", "Josee, el Tigre y los Peces", "Josee, El Tigre i Els Peixos", "โจเซ่ กับเสือและหมู่ปลา", "Josie, der Tiger und die Fische."],
  "r": 220
 },
 {
  "id": 189046,
  "name": "Re:Zero kara Hajimeru Isekai Seikatsu 4th Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx189046-yaHWtS5FII46.jpg",
  "year": 2026,
  "al": ["Re:ZERO -Starting Life in Another World- Season 4", "Re:ゼロから始める異世界生活 4th season", "Re:ZERO รีเซทชีวิต ฝ่าวิกฤตต่างโลก ซีซั่น 4", "Re:ZERO – Жизнь с нуля в альтернативном мире 4"],
  "r": 221
 },
 {
  "id": 97668,
  "name": "One Punch Man 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97668-nC8gQrXVxt7k.png",
  "year": 2019,
  "al": ["One-Punch Man Season 2", "ワンパンマン 2", "OPM2", "Wanpanman 2", "مرد تک مشتی", "วันพันช์แมน ภาคที่ 2", "One-Punch Man Phần 2", "一拳超人 第二季"],
  "r": 222
 },
 {
  "id": 121,
  "name": "Hagane no Renkinjutsushi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx121-zjmixZ428Mwv.png",
  "year": 2003,
  "al": ["Fullmetal Alchemist", "鋼の錬金術師", "Full Metal Alchemist", "FMA", "אלכימאי המתכת", "Stalowy alchemik", "강철의 연금술사", "แขนกล คนแปรธาตุ"],
  "r": 223
 },
 {
  "id": 107660,
  "name": "BEASTARS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107660-hgknnyaLchJW.png",
  "year": 2019,
  "al": ["ビースターズ", "BEASTARS - O Lobo Bom", "חייתיים", "บีสตาร์", "Выдающиеся звери", "براءة ذئب", "비스타즈"],
  "r": 224
 },
 {
  "id": 115230,
  "name": "Kami no Tou: Tower of God",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx115230-QHOdSN7yt8ab.jpg",
  "year": 2020,
  "al": ["Tower of God", "神之塔 -Tower of God-", "タワーオブ・ゴッド", "신의 탑", "Sinui Tap", "Kami no Tou", "TOG", "Башня Бога"],
  "r": 225
 },
 {
  "id": 512,
  "name": "Majo no Takkyuubin",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx512-UwP8X4BR8YoM.png",
  "year": 1989,
  "al": ["Kiki's Delivery Service", "魔女の宅急便", "魔女宅", "Majotaku", "Witch's Express Delivery", "Kiki la petite sorcière", "Nicky, la Aprendiz de Bruja", "O Serviço de Entregas da Kiki"],
  "r": 226
 },
 {
  "id": 21745,
  "name": "Owarimonogatari (Ge)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21745-VrhhJjZNdBXV.png",
  "year": 2017,
  "al": ["Owarimonogatari Second Season", "終物語（下）", "Owarimonogatari 2", "End Tale"],
  "r": 227
 },
 {
  "id": 151801,
  "name": "MASHLE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx151801-XxVf22Le6C8o.png",
  "year": 2023,
  "al": ["MASHLE: MAGIC AND MUSCLES", "マッシュル-MASHLE-", "MASHLE ศึกโลกเวทมนตร์คนพลังกล้าม", "MASHLE: MAGIA E MÚSCULOS", "MASHLE: Магия и мускулы"],
  "r": 228
 },
 {
  "id": 11981,
  "name": "Mahou Shoujo Madoka☆Magica: Hangyaku no Monogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b11981-koz1IoISs3eU.jpg",
  "year": 2013,
  "al": ["Puella Magi Madoka Magica the Movie -Rebellion-", "劇場版 魔法少女まどか☆マギカ 叛逆の物語", "Mahou Shoujo Madoka Magika Movie 3", "Magical Girl Madoka Magica Movie 3", "Puella Magi Madoka Magica the Movie Part III: Rebellion", "Puella Magi Madoka Magica the Movie: Rebellion"],
  "r": 229
 },
 {
  "id": 128546,
  "name": "Vivy: Fluorite Eye’s Song",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx128546-UIwyhuhjxmL0.jpg",
  "year": 2021,
  "al": ["Vivy -Fluorite Eye's Song-", "Vivy -Fluorite Eye’s Song-", "ヴィヴィ -フローライトアイズソング-", "วีวี่ บทเพลงจักรกลกู้ศตวรรษ"],
  "r": 230
 },
 {
  "id": 21400,
  "name": "Kizumonogatari III: Reiketsu-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21400-38ykNo3j4xXo.png",
  "year": 2017,
  "al": ["Kizumonogatari Part 3: Reiketsu", "傷物語〈Ⅲ冷血篇〉", "Wound Tale 3: Cold Blood"],
  "r": 231
 },
 {
  "id": 113936,
  "name": "Dr. STONE: STONE WARS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113936-D4eYd4XwslVI.jpg",
  "year": 2021,
  "al": ["Dr.STONE STONE WARS", "ドクターストーン STONE WARS", "Ｄｒ．ＳＴＯＮＥ第2期", "Dr. STONE 2", "닥터 스톤 STONE WARS", "石纪元第二季", "DR.STONE ภาค 2", "Доктор Стоун: Каменные войны"],
  "r": 232
 },
 {
  "id": 17895,
  "name": "Golden Time",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx17895-M8yjOyMxHf5X.jpg",
  "year": 2013,
  "al": ["ゴールデンタイム"],
  "r": 233
 },
 {
  "id": 20872,
  "name": "Plastic Memories",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20872-j5PBzzVtrYDM.jpg",
  "year": 2015,
  "al": ["プラスティックメモリーズ", "Plamemo"],
  "r": 234
 },
 {
  "id": 129874,
  "name": "Kimetsu no Yaiba: Mugen Ressha-hen (TV)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx129874-g6ZKXB94Hui1.jpg",
  "year": 2021,
  "al": ["Demon Slayer: Kimetsu no Yaiba Mugen Train Arc", "鬼滅の刃 無限列車編 (TV)", "KnY 2", "ดาบพิฆาตอสูร : ศึกรถไฟสู่นิรันดร์ (TV)", "鬼灭之刃 无限列车篇", "Demon Slayer: Kimetsu no Yaiba: Le train de l'Infini", "Demon Slayer: Kimetsu no Yaiba season 2", "Miecz zabójcy demonów – Kimetsu no Yaiba: Nieskończony Pociąg"],
  "r": 235
 },
 {
  "id": 124845,
  "name": "Wonder Egg Priority",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx124845-JXORhqCTGt04.jpg",
  "year": 2021,
  "al": ["ワンダーエッグ・プライオリティ", "WonEgg", "WEP", "奇蛋物语", "วันเดอร์เอ็ก ไพรออริตี", "Приоритет чудо-яйца"],
  "r": 236
 },
 {
  "id": 43,
  "name": "GHOST IN THE SHELL: Koukaku Kidoutai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx43-Y6EjeEMM14dj.png",
  "year": 1995,
  "al": ["Ghost in the Shell", "GHOST IN THE SHELL / 攻殻機動隊", "GitS", "Ghost in the Shell: O Fantasma do Futuro", "Duch w pancerzu", "Páncélba zárt szellem"],
  "r": 237
 },
 {
  "id": 132126,
  "name": "Sonny Boy",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx132126-4ugVjXMQLAps.png",
  "year": 2021,
  "al": ["サニーボーイ", "ซันนีบอย"],
  "r": 238
 },
 {
  "id": 143338,
  "name": "Otonari no Tenshi-sama ni Itsunomanika Dame Ningen ni Sareteita Ken",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx143338-zhyDVYgEzsm5.png",
  "year": 2023,
  "al": ["The Angel Next Door Spoils Me Rotten", "お隣の天使様にいつの間にか駄目人間にされていた件", "ขาดคุณนางฟ้าข้างห้องไป ผมคงมีชีวิตต่อไปไม่ได้อีกแล้ว", "Meu Anjo de Vizinha Me Mima Demais", "Chouchouté par l’ange d’à côté", "Ангел по соседству меня балует", "關於我在無意間被隔壁的天使變成廢柴這件事", "Aku Dimanjakan Tetanggaku yang Seperti Malaikat"],
  "r": 239
 },
 {
  "id": 142838,
  "name": "SPY×FAMILY Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142838-26JrqcFU1ljB.jpg",
  "year": 2022,
  "al": ["SPY x FAMILY Cour 2", "SPY×FAMILY 第2クール", "SxF", "스파이 패밀리", "间谍过家家", "スパイファミリー 2クール"],
  "r": 240
 },
 {
  "id": 6,
  "name": "TRIGUN",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6-wd4saT1JzStH.jpg",
  "year": 1998,
  "al": ["トライガン", "ไทรกัน", "Триган"],
  "r": 241
 },
 {
  "id": 128547,
  "name": "Odd Taxi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx128547-nNekWTKqmvEi.jpg",
  "year": 2021,
  "al": ["ODDTAXI", "オッドタクシー", "Необычное такси"],
  "r": 242
 },
 {
  "id": 113538,
  "name": "Haikyuu!! TO THE TOP 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113538-tHVE8j5mOPLu.jpg",
  "year": 2020,
  "al": ["HAIKYU!! TO THE TOP Part 2", "ハイキュー!! TO THE TOP 2", "ไฮคิว!! คู่ตบฟ้าประทาน ภาค 4 Part 2", "Haikyu!! Season 4 Part 2", "排球少年!! 第四季"],
  "r": 243
 },
 {
  "id": 151514,
  "name": "Chi. Chikyuu no Undou ni Tsuite",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx151514-Y0d82Ah2ZOHX.jpg",
  "year": 2024,
  "al": ["Orb: On the Movements of the Earth", "チ。-地球の運動について-", "Chi: About the Movement of the Earth", "สุริยะปราชญ์ ทฤษฎีสีเลือด", "O ruchach Ziemi", "Du mouvement de la Terre", "Tierra, sangre, conocimiento: Sobre el movimiento de la Tierra", "Ketzer - Tödliches Wissen über die Bewegung der Erde"],
  "r": 244
 },
 {
  "id": 146984,
  "name": "Shingeki no Kyojin: The Final Season - Kanketsu-hen Zenpen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx146984-GXrLeT6vQqyP.jpg",
  "year": 2023,
  "al": ["Attack on Titan Final Season THE FINAL CHAPTERS Special 1", "進撃の巨人 The Final Season完結編 前編", "Shingeki no Kyojin: The Final Season Final Edition", "Shingeki no Kyojin: The Final Season Part 3", "ผ่าพิภพไททัน ภาค 4", "ผ่าพิภพไททัน ไฟนอล ซีซั่น Part 3", "Attack on Titan Final Season Part 3 Final Arc Part 1", "Attack on Titan The Final Season The Final Part Special"],
  "r": 245
 },
 {
  "id": 7311,
  "name": "Suzumiya Haruhi no Shoushitsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx7311-9Mfc1YRHwCCW.jpg",
  "year": 2010,
  "al": ["The Disappearance of Haruhi Suzumiya", "涼宮ハルヒの消失", "스즈미야 하루히의 소실", "La Disparition de Haruhi Suzumiya", "La Scomparsa di Haruhi Suzumiya", "Исчезновение Харухи Судзумии"],
  "r": 246
 },
 {
  "id": 131646,
  "name": "Vanitas no Carte",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131646-cuyGfKcekZ62.jpg",
  "year": 2021,
  "al": ["The Case Study of Vanitas", "ヴァニタスの手記", "Vanitas no Karte", "Les Mémoires de Vanitas", "瓦尼塔斯的手记", "บันทึกแวมไพร์วานิทัส"],
  "r": 247
 },
 {
  "id": 578,
  "name": "Hotaru no Haka",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx578-vU6XcOlb1XFU.jpg",
  "year": 1988,
  "al": ["Grave of the Fireflies", "火垂るの墓", "Tombstone for Fireflies", "Le Tombeau des lucioles", "La Tumba de las Luciérnagas", "O Túmulo dos Vagalumes", "Die letzten Glühwürmchen", "Una tomba per le lucciole"],
  "r": 248
 },
 {
  "id": 3786,
  "name": "Shin Evangelion Movie:||",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx3786-Tpt9iM72dxTv.jpg",
  "year": 2021,
  "al": ["Evangelion: 3.0+1.0 Thrice Upon a Time", "シン・エヴァンゲリオン劇場版:||", "Rebuild of Evangelion 4.0", "EVANGELION:3.0+1.01 THRICE UPON A TIME", "EVANGELION:3.0+1.01 A ESPERANÇA", "อีวานเกเลียน:3.0+1.01 สามครั้งก่อน เมื่อเนิ่นนานมาแล้ว", "Evangelion 3.0+1.11", "EVANGELION:3.0+1.01 TRIPLE"],
  "r": 249
 },
 {
  "id": 145545,
  "name": "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx145545-DGl3LVvFlnHi.png",
  "year": 2022,
  "al": ["Classroom of the Elite Season 2", "ようこそ実力至上主義の教室へ 2nd Season", "You-Zitsu 2", "Youjitsu 2", "ขอต้อนรับสู่ห้องเรียนนิยม (เฉพาะ) ยอดคน ภาค 2", "Cote 2", "Добро пожаловать в класс для особо одарённых 2", "歡迎來到實力至上主義的教室 第二季"],
  "r": 250
 },
 {
  "id": 12355,
  "name": "Ookami Kodomo no Ame to Yuki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12355-wNsvhEsXEgrH.png",
  "year": 2012,
  "al": ["Wolf Children", "おおかみこどもの雨と雪", "The Wolf Children Ame and Yuki", "Los Niños Lobo", "Les Enfants loups, Ame & Yuki", "Wilcze Dzieci", "Ame e Yuki i bambini lupo", "Crianças Lobo"],
  "r": 251
 },
 {
  "id": 100182,
  "name": "Sword Art Online: Alicization",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx100182-KctPmCJ2smHQ.jpg",
  "year": 2018,
  "al": ["ソードアート・オンライン アリシゼーション", "SAOIII", "SAO3", "Alicization", "Sword Art Online III", "ซอร์ดอาร์ตออนไลน์: Alicization", "ซอร์ดอาร์ตออนไลน์ ภาค 3"],
  "r": 252
 },
 {
  "id": 153152,
  "name": "Boku no Kokoro no Yabai Yatsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153152-Xnwmx7wuoIWV.jpg",
  "year": 2023,
  "al": ["The Dangers in My Heart", "僕の心のヤバイやつ", "BokuYaba", "เธอผู้อันตรายต่อใจผม", "내 마음의 위험한 녀석", "我內心的糟糕念頭", "僕ヤバ", "Peligros en mi corazón"],
  "r": 253
 },
 {
  "id": 101165,
  "name": "Goblin Slayer",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101165-v5NwPXWPFDuD.jpg",
  "year": 2018,
  "al": ["ゴブリンスレイヤー", "ก็อบลิน สเลเยอร์"],
  "r": 254
 },
 {
  "id": 117193,
  "name": "Boku no Hero Academia 5",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx117193-E75BlZmDh1aB.jpg",
  "year": 2021,
  "al": ["My Hero Academia Season 5", "僕のヒーローアカデミア５", "BNHA 5", "MHA 5", "我的英雄学院 5", "我的英雄学院第五季", "มายฮีโร่ อคาเดเมีย ภาค 5", "أكاديميتي للأبطال"],
  "r": 255
 },
 {
  "id": 249,
  "name": "Inuyasha",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx249-jVBkyLnBvnRE.png",
  "year": 2000,
  "al": ["犬夜叉", "Inu Yasha", "이누야샤", "אינויאשה", "อินุยาฉะ เทพอสูรจิ้งจอกเงิน"],
  "r": 256
 },
 {
  "id": 15809,
  "name": "Hataraku Maou-sama!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx15809-ECv3HyOYJKrk.jpg",
  "year": 2013,
  "al": ["The Devil is a Part-Timer!", "はたらく魔王さま!", "ผู้กล้าซึนซ่าส์กับจอมมารสู้ชีวิต", "Raja Iblis Nyambi!", "打工吧！魔王大人"],
  "r": 257
 },
 {
  "id": 106625,
  "name": "Haikyuu!! TO THE TOP",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx106625-UR22wB2NuNVi.png",
  "year": 2020,
  "al": ["HAIKYU!! TO THE TOP", "ハイキュー!! TO THE TOP", "Haikyu!! Season 4", "Haikyuu!! Season 4", "ไฮคิว!! คู่ตบฟ้าประทาน ภาค 4 Part 1", "排球少年!! 第四季"],
  "r": 258
 },
 {
  "id": 21175,
  "name": "Dragon Ball Super",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21175-EH06qlfF8TnB.jpg",
  "year": 2015,
  "al": ["ドラゴンボール超", "DBS", "Dragonball Super", "דרגון בול סופר", "Драконий жемчуг: Супер"],
  "r": 259
 },
 {
  "id": 142770,
  "name": "Suzume no Tojimari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142770-dDaDIRnsv5jN.jpg",
  "year": 2022,
  "al": ["Suzume", "すずめの戸締まり", "铃芽之旅", "Khóa Chặt Cửa Nào Suzume", "การผนึกประตูของซุซุเมะ", "Судзуме зачиняє двері", "Судзумэ"],
  "r": 260
 },
 {
  "id": 2251,
  "name": "Baccano!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2251-tTQoWxVy4472.jpg",
  "year": 2007,
  "al": ["バッカーノ！"],
  "r": 261
 },
 {
  "id": 99420,
  "name": "Shoujo Shuumatsu Ryokou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99420-k5Tel6yRMwA8.png",
  "year": 2017,
  "al": ["Girls' Last Tour", "少女終末旅行", "少女终末旅行", "GLT", "Wisata Gadis di Akhir Hayat"],
  "r": 262
 },
 {
  "id": 21049,
  "name": "ReLIFE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21049-4AHSLeiDE9eg.png",
  "year": 2016,
  "al": ["リライフ", "Повторная жизнь"],
  "r": 263
 },
 {
  "id": 162804,
  "name": "Tokidoki Bosotto Rossiya-go de Dereru Tonari no Alya-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx162804-TBeptcAfvqTd.jpg",
  "year": 2024,
  "al": ["Alya Sometimes Hides Her Feelings in Russian", "時々ボソッとロシア語でデレる隣のアーリャさん", "Roshidere", "ロシデレ", "คุณอาเรียโต๊ะข้างๆพูดรัสเซียหวานใส่ซะหัวใจจะวาย", "Иногда Аля внезапно кокетничает по-русски", "不時輕聲地以俄語遮羞的鄰座艾莉同學"],
  "r": 264
 },
 {
  "id": 21128,
  "name": "Noragami ARAGOTO",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21128-eQgH3TG4nngo.jpg",
  "year": 2015,
  "al": ["ノラガミ ARAGOTO", "โนรางามิ เทวดาขาจร ภาค 2", "ノラガミ アラゴト"],
  "r": 265
 },
 {
  "id": 161964,
  "name": "Kage no Jitsuryokusha ni Naritakute! 2nd season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx161964-JpkEbHI8ivaP.jpg",
  "year": 2023,
  "al": ["The Eminence in Shadow Season 2", "陰の実力者になりたくて！ 2nd season", "To Be a Power in the Shadows! 2", "ชีวิตไม่ต้องเด่น ขอแค่เป็นเทพในเงา 2", "Un giorno sarò l'eminenza grigia 2", "TEIS 2", "Кардинал теней 2"],
  "r": 266
 },
 {
  "id": 232,
  "name": "Cardcaptor Sakura",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx232-ERyKCNNPJJeh.png",
  "year": 1998,
  "al": ["カードキャプターさくら", "CCS", "Cardcaptors", "Card Captor Sakura", "Card Captors", "Sakura, Cazadora de Cartas", "Sakura, la Caçadora de Cartes", "카드캡터 체리"],
  "r": 267
 },
 {
  "id": 100668,
  "name": "Arifureta Shokugyou de Sekai Saikyou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100668-DvOn5bMOt4cy.jpg",
  "year": 2019,
  "al": ["Arifureta: From Commonplace to World's Strongest", "ありふれた職業で世界最強", "平凡职业造就世界最强", "อาชีพกระจอกแล้วทำไม ยังไงข้าก็เทพ"],
  "r": 268
 },
 {
  "id": 139630,
  "name": "Boku no Hero Academia 6",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139630-3v4gxWtNZxLV.jpg",
  "year": 2022,
  "al": ["My Hero Academia Season 6", "僕のヒーローアカデミア６", "BNHA 6", "MHA 6", "我的英雄学院 6", "我的英雄学院第六季", "มายฮีโร่ อคาเดเมีย ภาค 6", "أكاديميتي للأبطال"],
  "r": 269
 },
 {
  "id": 20596,
  "name": "Ao Haru Ride",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20596-fJdMHV8xRMgY.png",
  "year": 2014,
  "al": ["Blue Spring Ride", "アオハライド", "Aoharaido"],
  "r": 270
 },
 {
  "id": 151970,
  "name": "Shangri-La Frontier",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx151970-xtIx3VqEk02X.jpg",
  "year": 2023,
  "al": ["シャングリラ・フロンティア", "ShanFro", "シャンフロ", "シャングリラ・フロンティア〜クソゲーハンター, 神ゲーに挑まんとす〜", "Shangri-La Frontier: Kusoge Hunter, Kami ge ni Idoman to su", "SHANGRI-LA FRONTIER ～เมื่อนักล่าเกมขยะท้าสู้ในเกมเทพ～", "Рубеж Шангри-Ла", "Thợ săn Game rác thách thức Game cấp Thánh"],
  "r": 271
 },
 {
  "id": 2890,
  "name": "Gake no Ue no Ponyo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2890-wcNtFr6aUYOR.jpg",
  "year": 2008,
  "al": ["Ponyo", "崖の上のポニョ", "Ponyo on the Cliff by the Sea", "Ponyo en el Acantilado", "بونيو على جرف البحر", "Ponyo sur la falaise", "Ponyo på klippen ved havet", "Ponyo sulla scogliera"],
  "r": 272
 },
 {
  "id": 154965,
  "name": "Yamada-kun to Lv999 no Koi wo Suru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154965-vZbBRjtmLp7S.jpg",
  "year": 2023,
  "al": ["My Love Story with Yamada-kun at Lv999", "山田くんとLv999の恋をする", "Loving Yamada at LV999!", "My Lv999 Love for Yamada-kun", "Minha História de Amor com Yamada-kun Nível 999", "รักสุดฟินเลเวล 999 กับยามาดะคุง", "和山田进行LV.999的恋爱", "Моя любовь к Ямаде 999 уровня"],
  "r": 273
 },
 {
  "id": 163134,
  "name": "Re:Zero kara Hajimeru Isekai Seikatsu 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163134-yieRFbvUOH9a.jpg",
  "year": 2024,
  "al": ["Re:ZERO -Starting Life in Another World- Season 3", "Re:ゼロから始める異世界生活 3rd season", "Re:ZERO – Жизнь с нуля в альтернативном мире 3"],
  "r": 274
 },
 {
  "id": 20996,
  "name": "Gintama°",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20996-kBEGEGdeK1r7.jpg",
  "year": 2015,
  "al": ["Gintama Season 3", "銀魂゜"],
  "r": 275
 },
 {
  "id": 20594,
  "name": "Sword Art Online II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx20594-FhRgZ1H9Istt.jpg",
  "year": 2014,
  "al": ["ソードアート・オンライン II", "SAO2", "GGO", "ซอร์ดอาร์ตออนไลน์ ภาค 2"],
  "r": 276
 },
 {
  "id": 4898,
  "name": "Kuroshitsuji",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx4898-mW4gabZvwmLC.jpg",
  "year": 2008,
  "al": ["Black Butler", "黒執事", "Kuro Shitsuji", "Kuroshitsuzi", "คนลึกไขปริศนาลับ", "Hắc Quản Gia", "黑执事 第1季", "黑執事 第1季"],
  "r": 277
 },
 {
  "id": 20792,
  "name": "Fate/stay night: Unlimited Blade Works 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20792-Q53sZsUAh5FF.jpg",
  "year": 2015,
  "al": ["Fate/stay night [Unlimited Blade Works] 2ndシーズン", "フェイト/ステイナイト Unlimited Blade Works 2ndシーズン", "Судьба/Ночь схватки: Бесконечный мир клинков 2"],
  "r": 278
 },
 {
  "id": 178788,
  "name": "Kimetsu no Yaiba: Mugenjou-hen Movie 1 - Akaza Sairai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178788-zm3gtpB9TpRt.jpg",
  "year": 2025,
  "al": ["Demon Slayer: Kimetsu no Yaiba Infinity Castle", "劇場版「鬼滅の刃」無限城編 第一章 猗窩座再来", "Demon Slayer: Kimetsu no Yaiba La Forteresse infinie", "Demon Slayer: Kimetsu no Yaiba Castelo Infinito", "Клинок, Рассекающий Демонов: Бесконечный Замок"],
  "r": 279
 },
 {
  "id": 185,
  "name": "Initial D",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b185-GvXiR8AKTmdn.jpg",
  "year": 1998,
  "al": ["Initial D 1st Stage", "頭文字[イニシャル]D", "Inisharu Di", "イニシャルD"],
  "r": 280
 },
 {
  "id": 20850,
  "name": "Tokyo Ghoul √A",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20850-glDf9EMKeCwe.jpg",
  "year": 2015,
  "al": ["東京喰種[トーキョーグール]√A", "Tokyo Kushu 2", "Tokyo Ghoul Root A"],
  "r": 281
 },
 {
  "id": 440,
  "name": "Shoujo Kakumei Utena",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b440-r4l3N5WGgUOZ.jpg",
  "year": 1997,
  "al": ["Revolutionary Girl Utena", "少女革命ウテナ", "Utena la fillette révolutionnaire", "La rivoluzione di Utena", "Utena la ragazza della rivoluzione", "Rewolucjonistka Utena"],
  "r": 282
 },
 {
  "id": 156092,
  "name": "Tu Bian Yingxiong X",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx156092-yHqgQZOF2mbg.jpg",
  "year": 2025,
  "al": ["To Be Hero X", "凸变英雄X", "凸变英雄 第三季", "To Be Hero 3", "TBHX"],
  "r": 283
 },
 {
  "id": 166873,
  "name": "Mushoku Tensei II: Isekai Ittara Honki Dasu Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx166873-xO0BRPkmwFll.png",
  "year": 2024,
  "al": ["Mushoku Tensei: Jobless Reincarnation Season 2 Part 2", "無職転生Ⅱ ～異世界行ったら本気だす～ 第2クール", "Mushoku Tensei: Jobless Reincarnation Season 2 Cour 2", "เกิดชาตินี้พี่ต้องเทพ ซีซั่น 2 ครึ่งหลัง", "Mushoku Tensei: Isekai Ittara Honki Dasu 2nd Season Part 2", "Mushoku Tensei II: Jobless Reincarnation Part 2", "Mushoku Tensei II: Reencarnación desde cero", "无职转生～到了异世界就拿出真本事～第2季"],
  "r": 284
 },
 {
  "id": 166240,
  "name": "Kimetsu no Yaiba: Hashira Geiko-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx166240-PBV7zukIHW7V.png",
  "year": 2024,
  "al": ["Demon Slayer: Kimetsu no Yaiba Hashira Training Arc", "鬼滅の刃 柱稽古編", "KnY 4", "Demon Slayer: Kimetsu no Yaiba - L'entraînement des Piliers", "Miecz zabójcy demonów – Kimetsu no Yaiba: Trening Filarów", "Клинок, рассекающий демонов: Тренировка столпов"],
  "r": 285
 },
 {
  "id": 11843,
  "name": "Danshi Koukousei no Nichijou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11843-ui2jBcuQUqnl.jpg",
  "year": 2012,
  "al": ["Daily Lives of High School Boys", "男子高校生の日常", "Nichibros", "La vie quotidienne de lycéens"],
  "r": 286
 },
 {
  "id": 185660,
  "name": "Dandadan 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx185660-uB8RUMBGovGr.jpg",
  "year": 2025,
  "al": ["DAN DA DAN Season 2", "ダンダダン 第2期", "Dan Da Dan: Evil Eye"],
  "r": 287
 },
 {
  "id": 18153,
  "name": "Kyoukai no Kanata",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx18153-oDqA9zQzQPOq.png",
  "year": 2013,
  "al": ["Beyond the Boundary", "境界の彼方", "Beyond the Horizon", "境界的彼方"],
  "r": 288
 },
 {
  "id": 141949,
  "name": "Fuufu Ijou, Koibito Miman.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx141949-tViCIRHPZAyG.jpg",
  "year": 2022,
  "al": ["More than a Married Couple, but Not Lovers.", "夫婦以上、恋人未満。", "More than a Couple, Less than Lovers.", "แผนสมรสไม่สมเลิฟ", "Presque mariés, loin d'être amoureux.", "Больше чем пара, меньше чем любовники", "Fuukoi", "ふうこい"],
  "r": 289
 },
 {
  "id": 226,
  "name": "Elfen Lied",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx226-MibyRKhIrnTe.png",
  "year": 2004,
  "al": ["エルフェンリート", "Elfen Song", "Elfic Song", "妖精的旋律", "Эльфийская песнь"],
  "r": 290
 },
 {
  "id": 113813,
  "name": "Kanojo, Okarishimasu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113813-SnljeXpU3Pw7.jpg",
  "year": 2020,
  "al": ["Rent-a-Girlfriend", "彼女、お借りします", "I'd like to Borrow a Girlfriend", "Kanokari", "สะดุดรักยัยแฟนเช่า", "Pacar Sewaan"],
  "r": 291
 },
 {
  "id": 21719,
  "name": "Fate/stay night [Heaven's Feel] III. spring song",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21719-MSdTlkno0Z0u.jpg",
  "year": 2020,
  "al": ["Fate/stay night [Heaven’s Feel] III. spring song", "Fate/stay night[Heaven's Feel] ⅠⅠⅠ.spring song", "Fate/HF III", "Судьба/Ночь схватки: Прикосновение небес 3"],
  "r": 292
 },
 {
  "id": 102976,
  "name": "Kono Subarashii Sekai ni Shukufuku wo! Kurenai Densetsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx102976-2Yi5icRbjukO.png",
  "year": 2019,
  "al": ["KONOSUBA -God's blessing on this wonderful world!- Legend of Crimson", "この素晴らしい世界に祝福を！紅伝説", "Konosuba Movie", "このすば紅伝説", "ขอให้โชคดีมีชัยในโลกแฟนตาซี เดอะ มูฟวี่ ตำนานสีชาด", "Konosuba! Un mundo maravilloso. La leyenda del carmesí"],
  "r": 293
 },
 {
  "id": 154768,
  "name": "Sono Bisque Doll wa Koi wo Suru Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154768-DHHvNd4MjV1p.jpg",
  "year": 2025,
  "al": ["My Dress-Up Darling Season 2", "その着せ替え人形は恋をする Season 2", "Sono Kisekae Ningyou wa Koi wo suru", "หนุ่มเย็บผ้ากับสาวนักคอสเพลย์ ภาค 2", "その着せ替え人形（ビスク・ドール）は恋をする", "Kisekoi 2", "Si Boneka Rias Sedang Jatuh Cinta", "着せ恋 2"],
  "r": 294
 },
 {
  "id": 114124,
  "name": "Yuukoku no Moriarty",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114124-def92qPuIVeK.jpg",
  "year": 2020,
  "al": ["Moriarty the Patriot", "憂国のモリアーティ", "มอริอาร์ตี้ผู้รักชาติ"],
  "r": 295
 },
 {
  "id": 166794,
  "name": "Yubisaki to Renren",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx166794-1MAXFMgND6qS.jpg",
  "year": 2024,
  "al": ["A Sign of Affection", "ゆびさきと恋々", "Ein Zeichen der Zuneigung", "손끝과 연연", "Signos de Afecto", "Кохання на кінчиках пальців", "Znaki naszych uczuć", "Cinta dan Isyarat"],
  "r": 296
 },
 {
  "id": 21875,
  "name": "No Game No Life Zero",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx21875-ybSgx75MgRMM.png",
  "year": 2017,
  "al": ["No Game, No Life Zero", "ノーゲーム・ノーライフ ゼロ", "NO GAME NO LIFE Movie", "游戏人生 零", "โนเกม โนไลฟ์ เดอะมูฟวี่", "โนเกม โนไลฟ์ ซีโร่", "NGNL Zero", "ノゲノラ ゼロ"],
  "r": 297
 },
 {
  "id": 166531,
  "name": "[Oshi no Ko] 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx166531-dAL5MsqDHUkj.jpg",
  "year": 2024,
  "al": ["OSHI NO KO Season 2", "【推しの子】第2期", "我推的孩子", "[OSHI NO KO] Season 2", "【OSHI NO KO】Season 2"],
  "r": 298
 },
 {
  "id": 177689,
  "name": "Hikaru ga Shinda Natsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx177689-d0mB5nYgdnhi.jpg",
  "year": 2025,
  "al": ["The Summer Hikaru Died", "光が死んだ夏", "Lato, kiedy umarł Hikaru", "O Verão em que Hikaru Morreu", "صيف وفاة هيكارو", "光死去的夏天", "光逝去的夏天", "Der Sommer, in dem Hikaru starb"],
  "r": 299
 },
 {
  "id": 166216,
  "name": "Boku no Kokoro no Yabai Yatsu 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx166216-vCMkF4e3x5FB.jpg",
  "year": 2024,
  "al": ["The Dangers in My Heart Season 2", "僕の心のヤバイやつ 第2期", "BokuYaba 2", "僕ヤバ 2", "เธอผู้อันตรายต่อใจผม ภาคที่ 2", "Czarne chmury w moim sercu. Sezon 2"],
  "r": 300
 },
 {
  "id": 99457,
  "name": "Sayonara no Asa ni Yakusoku no Hana wo Kazarou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99457-OD0xtM8NlHNQ.png",
  "year": 2018,
  "al": ["Maquia: When the Promised Flower Blooms", "さよならの朝に約束の花をかざろう", "SayoAsa", "さよあさ", "Maquia - Decoriamo la mattina dell'addio con i fiori promessi", "Maquia - Eine unsterbliche Liebesgeschichte", "Укрась прощальное утро цветами обещания", "Maquia: Una historia de amor eterno"],
  "r": 301
 },
 {
  "id": 20668,
  "name": "Gekkan Shoujo Nozaki-kun",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20668-6UslJY5NDYNh.png",
  "year": 2014,
  "al": ["Monthly Girls' Nozaki-kun", "月刊少女野崎くん", "Revista mensual para chicas Nozaki", "月刊少女野崎君"],
  "r": 302
 },
 {
  "id": 112301,
  "name": "Maou Gakuin no Futekigousha: Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e Kayou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112301-f88Fs2es4pSr.jpg",
  "year": 2020,
  "al": ["The Misfit of Demon King Academy: History’s Strongest Demon King Reincarnates and Goes to School with His Descendants", "魔王学院の不適合者 ～史上最強の魔王の始祖、転生して子孫たちの学校へ通う～", "Maou Gakuin no Futekigousha", "The Misfit of Demon King Academy", "魔王学院の不適合者", "ใครว่าข้าไม่เหมาะเป็นจอมมาร: ต้นตระกูลจอมมารที่เเกร่งที่สุดในประวัติศาสตร์เกิดใหม่ไปเรียนที่โรงเรียนลูกหลาน", "魔王学院的不适任者～史上最强的魔王始祖，转生就读子孙们的学校～", "Непригодный для Академии владыки тьмы"],
  "r": 303
 },
 {
  "id": 111762,
  "name": "Fruits Basket: 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx111762-C8TNf5uRlVNQ.jpg",
  "year": 2020,
  "al": ["Fruits Basket Season 2", "フルーツバスケット 2nd Season", "Furuba", "Fruba", "フルバ", "水果篮子 第二季", "เสน่ห์สาวข้าวปั้น ภาค 2", "Fruits Basket (2019) 2"],
  "r": 304
 },
 {
  "id": 13125,
  "name": "Shinsekai yori",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx13125-2EDZb8ahshQc.png",
  "year": 2012,
  "al": ["From the New World", "新世界より", "Shin Sekai Yori", "Del nuevo mundo"],
  "r": 305
 },
 {
  "id": 131942,
  "name": "JoJo no Kimyou na Bouken: Stone Ocean",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131942-rermlZ9lplHX.png",
  "year": 2021,
  "al": ["JoJo's Bizarre Adventure: STONE OCEAN", "ジョジョの奇妙な冒険 ストーンオーシャン", "JoJo's Bizarre Adventure Part 6", "JoJo no Kimyou na Bouken Part 6", "Le bizzarre avventure di JoJo: Stone Ocean", "โจโจ้ ล่าข้ามศตวรรษ: สโตนโอเชียน", "โจโจ้ ล่าข้ามศตวรรษ ภาค 6", "مغامرات جوجو العجيبة: محيط الأحجار"],
  "r": 306
 },
 {
  "id": 235,
  "name": "Meitantei Conan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx235-MyYT7K3chBdO.jpg",
  "year": 1996,
  "al": ["Detective Conan", "名探偵コナン", "Case Closed", "Detectiu Conan", "הבלש קונאן", "Detektyw Conan", "المحقق كونان", "名侦探柯南"],
  "r": 307
 },
 {
  "id": 21092,
  "name": "Rakudai Kishi no Cavalry",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx21092-1NML6TdngmBq.jpg",
  "year": 2015,
  "al": ["Chivalry of a Failed Knight", "落第騎士の英雄譚（キャバルリィ）", "Rakudai Kishi no Eiyuutan", "A tale of worst one", "เจ้าหญิงสีชาดกับอัศวินดาบไร้เทียมทาน"],
  "r": 308
 },
 {
  "id": 934,
  "name": "Higurashi no Naku Koro ni",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx934-wjMlVEl4CWwg.jpg",
  "year": 2006,
  "al": ["When They Cry", "ひぐらしのなく頃に", "When the Cicadas Cry", "Higurashi: When They Cry", "Cuando las Cigarras Lloran", "Quando as Cigarras Choram", "쓰르라미 울 적에", "כשהציקדות בוכות"],
  "r": 309
 },
 {
  "id": 20722,
  "name": "Barakamon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20722-2KAeq72E95dr.png",
  "year": 2014,
  "al": ["ばらかもん", "元气囝仔", "บารากะมอน เกาะมีฮา คนมีเฮ"],
  "r": 310
 },
 {
  "id": 116006,
  "name": "THE GOD OF HIGH SCHOOL",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116006-Wt8JSA1ZQxlM.png",
  "year": 2020,
  "al": ["THE GOD OF HIGH SCHOOL ゴッド・オブ・ハイスクール", "GoH", "갓 오브 하이스쿨", "Бог старшей школы"],
  "r": 311
 },
 {
  "id": 163270,
  "name": "WIND BREAKER",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163270-wboZJp0ybwVK.jpg",
  "year": 2024,
  "al": ["WB", "ウィンブレ", "WBK", "ウィンドブレイカー"],
  "r": 312
 },
 {
  "id": 10408,
  "name": "Hotarubi no Mori e",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10408-PlKJ6DAyvMk2.png",
  "year": 2011,
  "al": ["Into the Forest of Fireflies' Light", "蛍火の杜へ", "To the Forest of Firefly Lights", "สู่ป่าแห่งแสงหิ่งห้อย", "Lạc Vào Khu Rừng Đom Đóm"],
  "r": 313
 },
 {
  "id": 114745,
  "name": "Made in Abyss: Retsujitsu no Ougonkyou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114745-fBgTC12T7IAy.jpg",
  "year": 2022,
  "al": ["Made in Abyss: The Golden City of the Scorching Sun", "メイドインアビス 烈日の黄金郷", "Made in Abyss Season 2", "ผ่าเหวนรก ภาค 2", "นักบุกเบิกหลุมยักษ์ ภาค 2", "صنع في الهاوية 2", "ผ่าเหวนรก นครทองคำแห่งอาทิตย์ที่เจิดจ้า", "Đến từ Vực Thẳm Mùa 2"],
  "r": 314
 },
 {
  "id": 174576,
  "name": "Tsue to Tsurugi no Wistoria",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx174576-tpKcHG0eO6CS.jpg",
  "year": 2024,
  "al": ["Wistoria: Wand and Sword", "杖と剣のウィストリア", "杖與劍的魔劍譚", "ตำนานดาบและคทาแห่งวิสตอเรีย", "Wistoria: Varinhas e Espadas"],
  "r": 315
 },
 {
  "id": 159831,
  "name": "Zom 100: Zombie ni Naru Made ni Shitai 100 no Koto",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx159831-cJUNqCqzuApc.png",
  "year": 2023,
  "al": ["Zom 100: Bucket List of the Dead", "ゾン100～ゾンビになるまでにしたい100のこと～", "Zombie 100 ~100 Things I Want to do Before I Become a Zombie~", "Zombie 100 ~Zombie ni Naru Made ni Shitai 100 no Koto~", "100 สิ่งที่อยากทำก่อนจะกลายเป็นซอมบี้", "Зомби-апокалипсис и 100 предсмертных дел", "100 Coisas para Fazer Antes de Virar Zumbi"],
  "r": 316
 },
 {
  "id": 170942,
  "name": "Ao no Hako",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170942-KKcLfQzV57nG.jpg",
  "year": 2024,
  "al": ["Blue Box", "アオのハコ", "الصندوق الأزرق", "青之箱", "푸른 상자", "La caja azul", "กล่องรักวัยใส", "Niebieskie pudełko"],
  "r": 317
 },
 {
  "id": 101474,
  "name": "Overlord III",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101474-tGRyvSAWMjU9.jpg",
  "year": 2018,
  "al": ["オーバーロードⅢ", "Over Lord 3", "โอเวอร์ลอร์ด ภาค 3", "โอเวอร์ ลอร์ด จอมมารพิชิตโลก ภาค 3"],
  "r": 318
 },
 {
  "id": 114236,
  "name": "Enen no Shouboutai: Ni no Shou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114236-wfQOWF0Ii3h2.png",
  "year": 2020,
  "al": ["Fire Force Season 2", "炎炎ノ消防隊 弐ノ章", "Enen no Shouboutai 2", "หน่วยผจญคนไฟลุก ภาค 2"],
  "r": 319
 },
 {
  "id": 21679,
  "name": "Bungou Stray Dogs 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21679-9MKdz1A7YLV7.jpg",
  "year": 2016,
  "al": ["Bungo Stray Dogs 2", "文豪ストレイドッグス 第2シーズン", "Bungou Stray Dogs (2016)", "BSD 2", "คณะประพันธกรจรจัด ภาค 2"],
  "r": 320
 },
 {
  "id": 21647,
  "name": "orange",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21647-zMUXNhcVyRyv.png",
  "year": 2016,
  "al": ["オレンジ"],
  "r": 321
 },
 {
  "id": 20727,
  "name": "Kekkai Sensen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20727-jgVnxLCHAKqZ.jpg",
  "year": 2015,
  "al": ["Blood Blockade Battlefront", "血界戦線"],
  "r": 322
 },
 {
  "id": 20807,
  "name": "Prison School",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20807-8nFoO0AUdGsy.jpg",
  "year": 2015,
  "al": ["監獄学園〈プリズンスクール〉", "โรงเรียนคุกนรก", "Kangoku Gakuen"],
  "r": 323
 },
 {
  "id": 820,
  "name": "Ginga Eiyuu Densetsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx820-x5dNLNFeKb8B.png",
  "year": 1988,
  "al": ["Legend of the Galactic Heroes", "銀河英雄伝説", "LoGH", "LoTGH", "Gin'eiden", "Heldensagen vom Kosmosinsel", "אגדת הגיבורים הגלקטיים"],
  "r": 324
 },
 {
  "id": 141911,
  "name": "Skip to Loafer",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx141911-o6Jwav7hRPPM.jpg",
  "year": 2023,
  "al": ["Skip and Loafer", "スキップとローファー", "จังหวะวัยรุ่น ว้าวุ่นหัวใจ", "В лоферах вприпрыжку", "躍動青春", "スキロー"],
  "r": 325
 },
 {
  "id": 2966,
  "name": "Ookami to Koushinryou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2966-AEULMyYA9WKb.png",
  "year": 2008,
  "al": ["Spice and Wolf", "狼と香辛料", "สาวหมาป่ากับนายเครื่องเทศ", "Волчица и пряности"],
  "r": 326
 },
 {
  "id": 137667,
  "name": "Guimi Zhi Zhu: Xiaochou Pian",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx137667-xQxzQRAerw53.jpg",
  "year": 2025,
  "al": ["Lord of Mysteries", "诡秘之主 小丑篇​", "Lord of the Mysteries", "LOTM", "诡秘之主", "Lord of Mysteries: The Clown", "Chúa Tể Huyền Bí", "Tuan Misteri"],
  "r": 327
 },
 {
  "id": 159322,
  "name": "BLEACH: Sennen Kessen-hen - Ketsubetsu-tan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx159322-Sp1GflRhE6Po.jpg",
  "year": 2023,
  "al": ["BLEACH: Thousand-Year Blood War - The Separation", "BLEACH 千年血戦篇-訣別譚-", "BLEACH: Thousand Year Blood War Part 2", "BLEACH 千年血戦篇 第2クール", "BLEACH TYBW"],
  "r": 328
 },
 {
  "id": 20458,
  "name": "Mahouka Koukou no Rettousei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20458-tGh343Ew10yU.jpg",
  "year": 2014,
  "al": ["The Irregular at Magic High School", "魔法科高校の劣等生", "พี่น้องปริศนาโรงเรียนมหาเวท", "Непутёвый ученик в школе магии"],
  "r": 329
 },
 {
  "id": 125206,
  "name": "Tsuki ga Michibiku Isekai Douchuu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx125206-O2MsOWdW1lVi.jpg",
  "year": 2021,
  "al": ["TSUKIMICHI -Moonlit Fantasy-", "月が導く異世界道中", "Moon-led Journey Across Another World", "จันทรานำพาสู่ต่างโลก", "月光下的异世界之旅", "Благословлённое лунным светом приключение в другом мире"],
  "r": 330
 },
 {
  "id": 178789,
  "name": "Mushoku Tensei III: Isekai Ittara Honki Dasu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178789-hNXjKFzUq7mk.jpg",
  "year": 2026,
  "al": ["Mushoku Tensei: Jobless Reincarnation Season 3", "無職転生Ⅲ ～異世界行ったら本気だす～", "無職転生 ～異世界行ったら本気だす～ 第3期", "Mushoku Tensei: Isekai Ittara Honki Dasu 3rd Season", "เกิดชาตินี้พี่ต้องเทพ ซีซั่น 3"],
  "r": 331
 },
 {
  "id": 107693,
  "name": "Mairimashita! Iruma-kun",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107693-A9bSSFAMxA6j.jpg",
  "year": 2019,
  "al": ["Welcome to Demon School! Iruma-kun", "魔入りました！入間くん", "Welcome to Demon School, Iruma-kun!", "入间同学入魔了！", "อิรุมะคุง พจญในแดนปีศาจ!"],
  "r": 332
 },
 {
  "id": 14513,
  "name": "Magi: The labyrinth of magic",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14513-HuUdrFFYftA7.jpg",
  "year": 2012,
  "al": ["マギ The labyrinth of magic"],
  "r": 333
 },
 {
  "id": 21858,
  "name": "Little Witch Academia (TV)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21858-huBrbIOGMYXv.jpg",
  "year": 2017,
  "al": ["リトルウィッチアカデミア (TV)", "LWA (TV)", "小魔女学园", "Det lille hekseakademiet", "האקדמיה למכשפות קטנות"],
  "r": 334
 },
 {
  "id": 387,
  "name": "Haibane Renmei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx387-dS4aJivu0zPB.png",
  "year": 2002,
  "al": ["灰羽連盟", "Charcoal Feather Federation", "Une fille qui a des ailes grises", "Ailes Grises", "Ali grigie", "Haibane renmei: Stowarzyszenie Szaropiórych", "Союз Серокрылых"],
  "r": 335
 },
 {
  "id": 101573,
  "name": "Yagate Kimi ni Naru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx101573-Gql3Q3UX1jcu.jpg",
  "year": 2018,
  "al": ["Bloom Into You", "やがて君になる", "YagaKimi", "สุดท้ายก็คือเธอ"],
  "r": 336
 },
 {
  "id": 101001,
  "name": "Asobi Asobase",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101001-UERCW0UGi0P7.jpg",
  "year": 2018,
  "al": ["Asobi Asobase - workshop of fun -", "あそびあそばせ", "Asobi Asobase: Workshop of Fun", "游戏3人娘", "来玩游戏吧", "ชมรมสาวรักสนุก"],
  "r": 337
 },
 {
  "id": 120697,
  "name": "Ijiranaide, Nagatoro-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx120697-BA2TqxB1I5bJ.jpg",
  "year": 2021,
  "al": ["DON'T TOY WITH ME, MISS NAGATORO", "イジらないで、長瀞さん", "不要欺负我、长瀞同学", "Arrête de me chauffer, Nagatoro!", "ยัยตัวแสบแอบน่ารัก นางาโทโระ", "Не издевайся надо мной, Нагаторо", "괴롭히지 말아요, 나가토로 양", "Jangan main-main denganku, Nona Nagatoro Serangan Ke-2"],
  "r": 338
 },
 {
  "id": 184951,
  "name": "Seihantai na Kimi to Boku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx184951-s8Lg2muPBhdX.jpg",
  "year": 2026,
  "al": ["You and I Are Polar Opposites", "正反対な君と僕", "ลุ้นรักฉบับคู่ต่างขั้ว", "정반대의 너와 나", "Cậu Và Tớ Là Hai Thái Cực Đối Lập"],
  "r": 339
 },
 {
  "id": 16782,
  "name": "Kotonoha no Niwa",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16782-qpFGk18UqaHn.jpg",
  "year": 2013,
  "al": ["The Garden of Words", "言の葉の庭", "Koto no Ha no Niwa", "The Garden of Kotonoha", "El Jardín de las Palabras", "A szavak kertje", "ยามสายฝนโปรยปราย", "Ogród słów"],
  "r": 340
 },
 {
  "id": 585,
  "name": "Mimi wo Sumaseba",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx585-5uq7j2xNNVmN.jpg",
  "year": 1995,
  "al": ["Whisper of the Heart", "耳をすませば", "If You Listen Carefully", "Ghibli Movie 10", "Si tu tends l'oreille", "Stimme des Herzens", "Susurros del Corazón", "Sussurros do Coração"],
  "r": 341
 },
 {
  "id": 8074,
  "name": "Gakuen Mokushiroku: HIGHSCHOOL OF THE DEAD",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx8074-YB63Ik96fjPj.png",
  "year": 2010,
  "al": ["High School of the Dead", "学園黙示録HIGHSCHOOL OF THE DEAD", "HOTD", "HSOTD", "High School of the Dead: Apocalipsis en el Instituto"],
  "r": 342
 },
 {
  "id": 171457,
  "name": "Make Heroine ga Oosugiru!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx171457-nmMIk0gNiWsm.jpg",
  "year": 2024,
  "al": ["Makeine: Too Many Losing Heroines!", "負けヒロインが多すぎる！", "Toooooo Many Losing Heroines", "マケイン", "รักครั้งนี้มีคนนกเยอะไปมั้ย!", "Makeine", "敗北女角太多了！"],
  "r": 343
 },
 {
  "id": 18897,
  "name": "Nisekoi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx18897-G2Fx2ZACsXBU.jpg",
  "year": 2014,
  "al": ["ニセコイ", "Nisekoi: False Love", "รักลวงป่วนใจ"],
  "r": 344
 },
 {
  "id": 182896,
  "name": "Boku no Hero Academia FINAL SEASON",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx182896-mvxTVHGdDB4q.jpg",
  "year": 2025,
  "al": ["My Hero Academia FINAL SEASON", "僕のヒーローアカデミア FINAL SEASON", "Boku no Hero Academia 8", "My Hero Academia 8", "BNHA 8", "MHA 8", "Моя геройская академия 8", "ヒロアカ 8"],
  "r": 345
 },
 {
  "id": 21096,
  "name": "Doukyuusei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx21096-1wIOxpjtXb7J.jpg",
  "year": 2016,
  "al": ["Doukyuusei -Classmates-", "同級生", "Classmates"],
  "r": 346
 },
 {
  "id": 20912,
  "name": "Hibike! Euphonium",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20912-SiiG4HPrjQlX.jpg",
  "year": 2015,
  "al": ["Sound! Euphonium", "響け！ユーフォニアム", "Résonne ! Euphonium", "吹响吧!上低音号"],
  "r": 347
 },
 {
  "id": 100643,
  "name": "Made in Abyss: Fukaki Tamashii no Reimei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100643-fPH9OgEKKvcI.jpg",
  "year": 2020,
  "al": ["Made in Abyss: Dawn of the Deep Soul", "メイドインアビス 深き魂の黎明", "Made in Abyss: Dawn of a Deep Soul"],
  "r": 348
 },
 {
  "id": 156822,
  "name": "Tensei Shitara Slime Datta Ken 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx156822-Jzo2ITWgm4kM.jpg",
  "year": 2024,
  "al": ["That Time I Got Reincarnated as a Slime Season 3", "転生したらスライムだった件 第3期", "Tensura 3", "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว ภาค 3", "Moi, quand je me réincarne en Slime Saison 3", "転スラ 3"],
  "r": 349
 },
 {
  "id": 10793,
  "name": "Guilty Crown",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10793-KCysCbrVNqK9.jpg",
  "year": 2011,
  "al": ["ギルティクラウン", "المُلك المُدان"],
  "r": 350
 },
 {
  "id": 21058,
  "name": "Akagami no Shirayuki-hime",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21058-GRqasG1xk3bD.jpg",
  "year": 2015,
  "al": ["Snow White with the Red Hair", "赤髪の白雪姫", "Shirayuki aux cheveux rouges", "สโนว์ไวท์ผมแดง", "Красноволосая Белоснежка", "Красноволосая принцесса Белоснежка", "Die rothaarige Schneeprinzessin", "Blancanieves pelirroja"],
  "r": 351
 },
 {
  "id": 17265,
  "name": "Log Horizon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx17265-RyErURYesjJt.jpg",
  "year": 2013,
  "al": ["ログ・ホライズン", "รวมพลคนติดอยู่ในเกมส์"],
  "r": 352
 },
 {
  "id": 177709,
  "name": "SAKAMOTO DAYS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx177709-e5Qx6RlsBgD5.png",
  "year": 2025,
  "al": ["サカモト デイズ", "أيام ساكاموتو", "사카모토 데이즈", "坂本日常", "Дни Сакамото"],
  "r": 353
 },
 {
  "id": 790,
  "name": "Ergo Proxy",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx790-YTUCvBKX8ZWK.jpg",
  "year": 2006,
  "al": ["エルゴプラクシ", "ארגו פרוקסי", "Эрго Прокси", "Ерго Проксі"],
  "r": 354
 },
 {
  "id": 1887,
  "name": "Lucky☆Star",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1887-P36Pucd4qKji.png",
  "year": 2007,
  "al": ["らき☆すた"],
  "r": 355
 },
 {
  "id": 66,
  "name": "Azumanga Daiou THE ANIMATION",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx66-ZqYQWl6LsfeI.png",
  "year": 2002,
  "al": ["Azumanga Daioh", "あずまんが大王 THE ANIMATION"],
  "r": 356
 },
 {
  "id": 98437,
  "name": "Overlord II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98437-5q0GWqHhNAgJ.jpg",
  "year": 2018,
  "al": ["オーバーロードⅡ", "Over Lord 2", "โอเวอร์ลอร์ด ภาค 2", "โอเวอร์ ลอร์ด จอมมารพิชิตโลก ภาค 2"],
  "r": 357
 },
 {
  "id": 15583,
  "name": "Date A Live",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx15583-Sxd2J4RJdRhj.jpg",
  "year": 2013,
  "al": ["デート・ア・ライブ", "พิชิตรัก พิทักษ์โลก", "Рандеву с жизнью"],
  "r": 358
 },
 {
  "id": 182205,
  "name": "Tensei Shitara Slime Datta Ken 4th Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx182205-q2AeO1owuQbO.jpg",
  "year": 2026,
  "al": ["That Time I Got Reincarnated as a Slime Season 4", "転生したらスライムだった件 第4期", "Tensura 4", "転スラ 4", "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว ซีซั่น 4", "О моём перерождении в слизь 4", "Aquella vez que me convertí en slime - Temporada 4", "Moi, quand je me réincarne en Slime Saison 4"],
  "r": 359
 },
 {
  "id": 2034,
  "name": "Lovely★Complex",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2034-erjg6gzDetAp.png",
  "year": 2007,
  "al": ["Lovely Complex", "ラブ★コン", "Love★Com", "Love Com"],
  "r": 360
 },
 {
  "id": 103223,
  "name": "Bungou Stray Dogs 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx103223-bfdnnKWxE4YE.jpg",
  "year": 2019,
  "al": ["Bungo Stray Dogs 3", "文豪ストレイドッグス 第3シーズン", "Bungou Stray Dogs (2019)", "BSD 3", "BungouSD 3", "คณะประพันธกรจรจัด ภาค 3", "文豪野犬 第三季"],
  "r": 361
 },
 {
  "id": 128705,
  "name": "Blue Period",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx128705-LqIWVpiwDlDc.jpg",
  "year": 2021,
  "al": ["ブルーピリオド", "Periodo Azul", "Голубой период", "Блакитний період"],
  "r": 362
 },
 {
  "id": 133844,
  "name": "Overlord IV",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx133844-E32FjKZ0XxEs.jpg",
  "year": 2022,
  "al": ["オーバーロードⅣ", "Overlord 4", "โอเวอร์ลอร์ด ภาค 4", "โอเวอร์ ลอร์ด จอมมารพิชิตโลก ภาค 4"],
  "r": 363
 },
 {
  "id": 1689,
  "name": "Byousoku 5 Centimeter",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1689-rJKhjLEjQHSy.jpg",
  "year": 2007,
  "al": ["5 Centimeters per Second", "秒速５センチメートル", "Five Centimeters Per Second", "Byousoku 5 Centimeter - a chain of short stories about their distance", "5 cm per second", "5 Centímetros por Segundo", "5 centimètres par seconde", "Másodpercenként 5 centiméter"],
  "r": 364
 },
 {
  "id": 21711,
  "name": "91Days",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21711-EQN4sCIXRhKf.png",
  "year": 2016,
  "al": ["91 Days", "91デイズ"],
  "r": 365
 },
 {
  "id": 572,
  "name": "Kaze no Tani no Nausicaä",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx572-ZE3kHBA6U0X1.jpg",
  "year": 1984,
  "al": ["Nausicaä of the Valley of the Wind", "風の谷のナウシカ", "Nausicaa of the Valley of the Wind", "Nausicaä de la vallée du vent", "Kaze no Tani no Nausicaa", "Nausicaä del Valle del Viento", "Nausicaä do Vale do Vento", "Rüzgârlı Vadi"],
  "r": 366
 },
 {
  "id": 167152,
  "name": "Yuusha Kei ni Shosu: Choubatsu Yuusha 9004-tai Keimu Kiroku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx167152-O1pm6DWwifBD.jpg",
  "year": 2026,
  "al": ["Sentenced to Be a Hero", "勇者刑に処す 懲罰勇者9004隊刑務記録", "ผู้กล้าโทษประหาร : บันทึกการรับโทษของหน่วยผู้กล้าต้องโทษ 9004", "용사형에 처함"],
  "r": 367
 },
 {
  "id": 103139,
  "name": "Domestic na Kanojo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx103139-2TfvRyGTE1qp.jpg",
  "year": 2019,
  "al": ["Domestic Girlfriend", "ドメスティックな彼女", "DomeKano", "บทเรียนรักเส้นทางหัวใจ"],
  "r": 368
 },
 {
  "id": 98034,
  "name": "Saiki Kusuo no Ψ-nan 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx98034-1eQ4F7SKxVas.jpg",
  "year": 2018,
  "al": ["The Disastrous Life of Saiki K. Season 2", "斉木楠雄のΨ難 2", "Saiki Kusuo no Psi Nan 2"],
  "r": 369
 },
 {
  "id": 163132,
  "name": "Horimiya: piece",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163132-C220CO5UrTxY.jpg",
  "year": 2023,
  "al": ["Horimiya: The Missing Pieces", "ホリミヤ -piece-", "Хоримия: Фрагменты"],
  "r": 370
 },
 {
  "id": 3002,
  "name": "Gyakkyou Burai Kaiji: Ultimate Survivor",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx3002-BExanPfxp888.jpg",
  "year": 2007,
  "al": ["Kaiji - Ultimate Survivor", "逆境無頼カイジ Ultimate Survivor", "The Suffering Pariah Kaiji: Ultimate Survivor", "Кайдзи"],
  "r": 371
 },
 {
  "id": 14227,
  "name": "Tonari no Kaibutsu-kun",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14227-VGxPG1xDZG7v.jpg",
  "year": 2012,
  "al": ["My Little Monster", "となりの怪物くん", "Tonari no Kaibutsukun", "The Monster Next Door", "My Neighbor Monster-kun", "Le Garçon d'à coté", "Bestia z ławki obok"],
  "r": 372
 },
 {
  "id": 99629,
  "name": "Satsuriku no Tenshi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99629-BXyAJ6PDq4sr.jpg",
  "year": 2018,
  "al": ["Angels of Death", "殺戮の天使", "Angel of Massacre", "Angel Slaughter", "ทูตสวรรค์ทัณฑ์อำมหิต"],
  "r": 373
 },
 {
  "id": 4081,
  "name": "Natsume Yuujinchou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx4081-xi08naD69tjr.jpg",
  "year": 2008,
  "al": ["Natsume's Book of Friends Season 1", "夏目友人帳", "Natsume Yujincho", "นัตสึเมะกับบันทึกพิศวง", "Hữu Nhân Sổ - Natsume Yuujinchou", "O Livro de Amigos de Natsume", "나츠메 우인장"],
  "r": 374
 },
 {
  "id": 20626,
  "name": "FAIRY TAIL (2014)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20626-9LTreIofBgnu.jpg",
  "year": 2014,
  "al": ["Fairy Tail Series 2", "Fairy Tail 2", "Fairy Tail Season 2", "フェアリーテイル (2014)"],
  "r": 375
 },
 {
  "id": 151384,
  "name": "Kaguya-sama wa Kokurasetai: First Kiss wa Owaranai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx151384-gv0q8wOE6D58.jpg",
  "year": 2023,
  "al": ["Kaguya-sama: Love is War -The First Kiss That Never Ends-", "かぐや様は告らせたい -ファーストキッスは終わらない-", "Kaguya-sama: Love is War Movie", "Kaguya-sama: Cuộc chiến tỏ tình - Nụ hôn đầu không hồi kết", "Госпожа Кагуя: в любви как на войне. Бесконечный первый поцелуй"],
  "r": 376
 },
 {
  "id": 129898,
  "name": "Sekai Saikou no Ansatsusha, Isekai Kizoku ni Tensei suru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx129898-FRUzDtPhRigt.jpg",
  "year": 2021,
  "al": ["The World's Finest Assassin Gets Reincarnated in Another World as an Aristocrat", "世界最高の暗殺者、異世界貴族に転生する", "Ansatsu Kizoku", "สุดยอดมือสังหาร อวตารมาต่างโลก", "世界顶尖的暗杀者转生为异世界贵族", "Pembunuh Terhebat di Dunia Reinkarnasi Menjadi Bangsawan Dunia lain", "המתנקש הטוב ביותר נולד מחדש בעולם אחר בתור אריסטוקרט", "Лучший в мире ассасин переродился в другом мире аристократом"],
  "r": 377
 },
 {
  "id": 6594,
  "name": "Katanagatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6594-xrrFyCacxUle.png",
  "year": 2010,
  "al": ["刀語", "Sword Story"],
  "r": 378
 },
 {
  "id": 1943,
  "name": "Paprika",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b1943-jMCEYL1Ixmgc.png",
  "year": 2006,
  "al": ["パプリカ", "Paprika: El reino de los sueños", "Паприка"],
  "r": 379
 },
 {
  "id": 141014,
  "name": "Tomodachi Game",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx141014-bTWr7TtS0wt9.jpg",
  "year": 2022,
  "al": ["トモダチゲーム", "Friend Game", "친구게임", "โทโมดาจิ เกมมิตรภาพ", "لعبة الأصدقاء", "Tomodachi Game: Los juegos de la amistad"],
  "r": 380
 },
 {
  "id": 164212,
  "name": "GIRLS BAND CRY",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx164212-eKh15LQxkTEx.jpg",
  "year": 2024,
  "al": ["ガールズバンドクライ", "Garukura", "ガルクラ", "GBC", "Крик дівочого гурту", "걸즈 밴드 크라이"],
  "r": 381
 },
 {
  "id": 127911,
  "name": "Kawaii dake ja Nai Shikimori-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx127911-qfJDzUt0qCna.jpg",
  "year": 2022,
  "al": ["Shikimori's Not Just a Cutie", "可愛いだけじゃない式守さん", "คุณชิกิโมริไม่ได้น่ารักแค่อย่างเดียวนะ", "Shikimori n'est pas juste mignonne", "Shikimori Không Chỉ Dễ Thương Thôi Đâu", "SHIKIMORI Tidak Hanya Manis", "Моя девушка не просто милашка"],
  "r": 382
 },
 {
  "id": 100178,
  "name": "Liz to Aoi Tori",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100178-MVATisQLOhkp.png",
  "year": 2018,
  "al": ["Liz and the Blue Bird", "リズと青い鳥", "Liz und ein Blauer Vogel", "Liz et l'Oiseau bleu", "莉茲與青鳥", "Liz und der Blaue Vogel", "ליז והציפור הכחולה"],
  "r": 383
 },
 {
  "id": 106479,
  "name": "Itai no wa Iya nano de Bougyoryoku ni Kyokufuri Shitai to Omoimasu.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx106479-JmPk1F5ubMtm.png",
  "year": 2020,
  "al": ["BOFURI: I Don't Want to Get Hurt, so I'll Max Out My Defense.", "痛いのは嫌なので防御力に極振りしたいと思います。", "I hate being in pain, so I think I’ll make a full defense build", "bofuri", "因为太怕痛就全点防御力了。", "BOFURI: Je ne suis pas venue ici pour souffrir alors j'ai tout mis en défense", "น้องโล่สายแทงก์แกร่งเกินร้อย", "Bofuri: Aku Tidak Ingin Terluka Jadi Seluruh Poin Status Kufokuskan ke Pertahanan"],
  "r": 384
 },
 {
  "id": 101903,
  "name": "Kaze ga Tsuyoku Fuiteiru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101903-ncgPJbbA5Nou.jpg",
  "year": 2018,
  "al": ["Run with the Wind", "風が強く吹いている", "KazeTsuyo", "В ногу с ветром"],
  "r": 385
 },
 {
  "id": 20994,
  "name": "GATE: Jieitai Kanochi nite, Kaku Tatakaeri",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20994-pSDk4I58jAK5.jpg",
  "year": 2015,
  "al": ["Gate", "GATE 自衛隊 彼の地にて、斯く戦えり"],
  "r": 386
 },
 {
  "id": 151806,
  "name": "Tomo-chan wa Onnanoko!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx151806-IAMi2ctI5xJI.jpg",
  "year": 2023,
  "al": ["Tomo-chan Is a Girl!", "トモちゃんは女の子！", "Tomo-chan wa Onna no ko!", "小智是女孩啦！", "Томо — девушка!"],
  "r": 387
 },
 {
  "id": 155907,
  "name": "Buddy Daddies",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx155907-wY1RqFUHvZ60.jpg",
  "year": 2023,
  "al": ["バディダディ", "Напарники-папаши"],
  "r": 388
 },
 {
  "id": 136,
  "name": "HUNTER×HUNTER",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx136-gj0bbCpDNrKG.jpg",
  "year": 1999,
  "al": ["Hunter x Hunter", "ハンターxハンター", "HxH", "全职猎人", "القناص"],
  "r": 389
 },
 {
  "id": 169755,
  "name": "BLEACH: Sennen Kessen-hen - Soukoku-tan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx169755-Rqb7MjnzdTc6.jpg",
  "year": 2024,
  "al": ["BLEACH: Thousand-Year Blood War - The Conflict", "BLEACH 千年血戦篇-相剋譚-", "BLEACH: Thousand Year Blood War Part 3", "BLEACH 千年血戦篇 第3クール", "BLEACH TYBW"],
  "r": 390
 },
 {
  "id": 146066,
  "name": "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx146066-zzKl6P6OeEjy.jpg",
  "year": 2024,
  "al": ["Classroom of the Elite Season 3", "ようこそ実力至上主義の教室へ 3rd Season", "You-Zitsu 3", "Youjitsu 3", "ขอต้อนรับสู่ห้องเรียนนิยม (เฉพาะ) ยอดคน ภาค 3", "Classroom of the Elite III", "欢迎来到实力至上主义的教室 第三季", "Добро пожаловать в класс для особо одарённых 3"],
  "r": 391
 },
 {
  "id": 108759,
  "name": "Sword Art Online: Alicization - War of Underworld",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108759-jcXbDf9BJTcb.jpg",
  "year": 2019,
  "al": ["ソードアート・オンライン アリシゼーション War of Underworld", "SAOIV", "SAO4"],
  "r": 392
 },
 {
  "id": 113260,
  "name": "Tian Guan Ci Fu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113260-4LPAAKCSJe8f.jpg",
  "year": 2020,
  "al": ["Heaven Official's Blessing", "天官赐福", "天官賜福", "Tenkan Tamamono Fuku", "La bendición del oficial del cielo", "สวรรค์ประทานพร"],
  "r": 393
 },
 {
  "id": 114308,
  "name": "Sword Art Online: Alicization - War of Underworld Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114308-8UBiS7U9buzu.jpg",
  "year": 2020,
  "al": ["ソードアート・オンライン アリシゼーション War of Underworld 最終章 (2nd Season)", "Sword Art Online: Alicization - War of Underworld Last Season", "SAOV", "SAO5"],
  "r": 394
 },
 {
  "id": 2246,
  "name": "Mononoke",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2246-WHkSkgyuxfgD.jpg",
  "year": 2007,
  "al": ["モノノ怪"],
  "r": 395
 },
 {
  "id": 9260,
  "name": "Kizumonogatari I: Tekketsu-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx9260-cl7sczYOpTeW.png",
  "year": 2016,
  "al": ["Kizumonogatari Part 1: Tekketsu", "傷物語〈Ⅰ鉄血篇〉", "Wound Tale 1: Iron Blood"],
  "r": 396
 },
 {
  "id": 158927,
  "name": "SPY×FAMILY Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b158927-lfO85WVguYgc.png",
  "year": 2023,
  "al": ["SPY x FAMILY Season 2", "SxF 2", "스파이 패밀리", "Семья шпиона", "スパイファミリー 2", "Spy x Family – Sezon 2"],
  "r": 397
 },
 {
  "id": 6675,
  "name": "REDLINE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6675-NF4tFzAxSjkj.png",
  "year": 2009,
  "al": ["Red line", "レッドライン"],
  "r": 398
 },
 {
  "id": 849,
  "name": "Suzumiya Haruhi no Yuuutsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx849-wQM3GqLvl62P.png",
  "year": 2006,
  "al": ["The Melancholy of Haruhi Suzumiya", "涼宮ハルヒの憂鬱", "La Malinconia Di Haruhi Suzumiya", "凉宫春日的忧郁", "La mélancolie de Haruhi Suzumiya", "Меланхолия Харухи Судзумии", "Melancholia Haruhi Suzumiyi"],
  "r": 399
 },
 {
  "id": 107717,
  "name": "Kobayashi-san Chi no Maidragon S",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107717-bixaW1NTGBra.jpg",
  "year": 2021,
  "al": ["Miss Kobayashi's Dragon Maid S", "小林さんちのメイドラゴンＳ", "小林家的龙女仆 S", "小林家的龍女僕S", "น้องเมดมังกรของคุณโคบายาชิ ภาค 2", "Kobayashi-san Chi no Maid Dragon 2nd Season", "Дракониха-горничная госпожи Кобаяси S"],
  "r": 400
 },
 {
  "id": 136804,
  "name": "Kono Subarashii Sekai ni Shukufuku wo! 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx136804-7FVftG67FPBc.jpg",
  "year": 2024,
  "al": ["KONOSUBA -God's blessing on this wonderful world! 3", "この素晴らしい世界に祝福を！３", "Konosuba 3", "ขอให้โชคดีมีชัยในโลกแฟนตาซี! ภาค 3", "為美好的世界獻上祝福！3", "Да благословят боги сей расчудесный мир! 3", "Konosuba! Un mundo maravilloso 3"],
  "r": 401
 },
 {
  "id": 530,
  "name": "Bishoujo Senshi Sailor Moon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx530-O8q6KpJ244Qk.jpg",
  "year": 1992,
  "al": ["Sailor Moon", "美少女戦士セーラームーン", "Pretty Soldier Sailor Moon", "Czarodziejka z Księżyca", "Navegante da Lua", "Sailor Moon - Das Mädchen mit den Zauberkräften"],
  "r": 402
 },
 {
  "id": 162694,
  "name": "Kimi no Koto ga Dai Dai Dai Dai Daisuki na 100-nin no Kanojo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx162694-QFBei5pbjSh8.png",
  "year": 2023,
  "al": ["The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You", "君のことが大大大大大好きな100人の彼女", "100 Kanojo", "100Kano", "Hyakkano", "100 Namoradas Que Te Amam Muuuuuito", "Les 100 petites amies qui t'aiiiment à en mourir", "100 Pacar yang Sungguh Sangat Amat Benar-benar Mencintaimu"],
  "r": 403
 },
 {
  "id": 201903,
  "name": "Chou Kaguya-hime!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx201903-v43gxQKw8Tc8.jpg",
  "year": 2026,
  "al": ["Cosmic Princess Kaguya!", "超かぐや姫！", "La princesa Kaguya del cosmos", "‫كاغويا أميرة الفضاء!", "超时空辉耀姬！", "Kaguya, princesse cosmique", "Κοσμική Πριγκίπισσα Καγκούγια!", "초(超) 가구야 공주!"],
  "r": 404
 },
 {
  "id": 146722,
  "name": "JoJo no Kimyou na Bouken: Stone Ocean Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx146722-hiZU7M33fBhn.jpg",
  "year": 2022,
  "al": ["JoJo's Bizarre Adventure: STONE OCEAN Part 2", "ジョジョの奇妙な冒険 ストーンオーシャン 2クール", "JoJo's Bizarre Adventure Part 6 (Part 2)", "JoJo no Kimyou na Bouken Part 6 (Part 2)", "JoJo's Bizarre Adventure: STONE OCEAN The Final Episodes"],
  "r": 405
 },
 {
  "id": 166613,
  "name": "Jigokuraku 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx166613-uHB8q3D4qbon.jpg",
  "year": 2026,
  "al": ["Hell’s Paradise Season 2", "地獄楽 第二期", "Hell’s Paradise: Jigokuraku Season 2", "สุขาวดีอเวจี", "Адский рай"],
  "r": 406
 },
 {
  "id": 21428,
  "name": "Hai to Gensou no Grimgar",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21428-dFVIHeZ8McBe.jpg",
  "year": 2016,
  "al": ["Grimgar of Fantasy and Ash", "灰と幻想のグリムガル", "Grimgar", "Ashes and Illusions", "ขี้เถ้าในกริมการ์แดนมายา"],
  "r": 407
 },
 {
  "id": 103632,
  "name": "Kumo desu ga, Nani ka?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx103632-2wsy9wFUdm1C.jpg",
  "year": 2021,
  "al": ["So I'm a Spider, So What?", "蜘蛛ですが、なにか？", "转生成蜘蛛又怎样！", "حسنا أنا عنكبوت، ماذا في ذلك؟", "แมงมุมแล้วไง ข้องใจเหรอคะ", "Tôi Là Nhện Đấy, Có Sao Không?"],
  "r": 408
 },
 {
  "id": 163139,
  "name": "Boku no Hero Academia 7",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163139-JchZhUFlNTWU.jpg",
  "year": 2024,
  "al": ["My Hero Academia Season 7", "僕のヒーローアカデミア 7", "BNHA 7", "MHA 7", "Моя геройская академия 7"],
  "r": 409
 },
 {
  "id": 126288,
  "name": "Sasaki to Miyano",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx126288-v9RNANkv2JEi.jpg",
  "year": 2022,
  "al": ["Sasaki and Miyano", "佐々木と宮野", "ซาซากิกับมิยาโนะ", "Sasaki i Miyano"],
  "r": 410
 },
 {
  "id": 112609,
  "name": "Majo no Tabitabi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112609-hBCbnYlEHluz.jpg",
  "year": 2020,
  "al": ["Wandering Witch: The Journey of Elaina", "魔女の旅々", "MajoTabi", "마녀의 여행", "魔女之旅", "Elainas Reise", "การเดินทางของคุณแม่มด", "Странствующая ведьма"],
  "r": 411
 },
 {
  "id": 513,
  "name": "Tenkuu no Shiro Laputa",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx513-yM7Dlt65N4Rl.jpg",
  "year": 1986,
  "al": ["Castle in the Sky", "天空の城ラピュタ", "Tenkuu no Shiro Rapyuta", "Das Schloss im Himmel", "El Castillo en el Cielo", "O Castelo no Céu", "Le Château dans le ciel", "Gökteki Kale"],
  "r": 412
 },
 {
  "id": 98202,
  "name": "Tsuki ga Kirei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98202-H6RtsIMZPALF.png",
  "year": 2017,
  "al": ["Tsukigakirei", "月がきれい", "as the moon, so beautiful."],
  "r": 413
 },
 {
  "id": 109298,
  "name": "Eizouken ni wa Te wo Dasu na!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx109298-suwdIUbJEPJx.png",
  "year": 2020,
  "al": ["Keep Your Hands Off Eizouken!", "映像研には手を出すな！", "Don't mess with the Motion Picture Club!", "Hands off the Motion Picture Club!", "别对映像研出手！", "Ước mơ sản xuất anime"],
  "r": 414
 },
 {
  "id": 16592,
  "name": "Danganronpa: Kibou no Gakuen to Zetsubou no Koukousei - The Animation",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16592-mFn1gfMXlKtw.jpg",
  "year": 2013,
  "al": ["Danganronpa: The Animation", "ダンガンロンパ 希望の学園と絶望の高校生 The Animation", "ダンガンロンパ The Animation", "Danganronpa: Academy of Hope and High School Students of Despair THE ANIMATION", "Danganronpa: Sekolah Harapan dan Murid yang Putus Asa"],
  "r": 415
 },
 {
  "id": 182300,
  "name": "Tsue to Tsurugi no Wistoria Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx182300-IYkq5KrkQq1V.jpg",
  "year": 2026,
  "al": ["Wistoria: Wand and Sword Season 2", "杖と剣のウィストリア Season2", "ตำนานดาบและคทาแห่งวิสตอเรีย ซีซั่น 2", "Tongkat Sihir dan Pedang Wistoria Season 2"],
  "r": 416
 },
 {
  "id": 527,
  "name": "Pocket Monsters",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b527-t6dBVJ5OVcXK.png",
  "year": 1997,
  "al": ["Pokémon", "ポケットモンスター", "Pokemon", "Pokémon the Series", "Pokémon: Indigo League", "Pokémon: Adventures on the Orange Islands", "Pokémon: The Johto Journeys", "Pokémon: Johto League Champions"],
  "r": 417
 },
 {
  "id": 21718,
  "name": "Fate/stay night [Heaven's Feel] II. lost butterfly",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21718-Hjj26Sapx1bd.jpg",
  "year": 2019,
  "al": ["Fate/stay night[Heaven's Feel] ⅠⅠ.lost butterfly", "Fate/HF II", "Судьба/Ночь схватки: Прикосновение небес 2"],
  "r": 418
 },
 {
  "id": 8795,
  "name": "Panty & Stocking with Garterbelt",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx8795-485Q8MOYeMZx.png",
  "year": 2010,
  "al": ["パンティ＆ストッキングwithガーターベルト", "PanSto", "PSG", "P&SWG"],
  "r": 419
 },
 {
  "id": 16662,
  "name": "Kaze Tachinu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16662-HUI8irtoTdOJ.jpg",
  "year": 2013,
  "al": ["The Wind Rises", "風立ちぬ", "El Viento se Levanta", "Si Alza il Vento", "Szél támad", "Zrywa się wiatr", "Wie der Wind sich hebt", "Le vent se lève"],
  "r": 420
 },
 {
  "id": 99749,
  "name": "FAIRY TAIL (2018)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx99749-tvz2LCPdMyrp.jpg",
  "year": 2018,
  "al": ["Fairy Tail Final Season", "Fairy Tail 3", "Fairy Tail Series 3", "フェアリーテイル (2018)"],
  "r": 421
 },
 {
  "id": 18115,
  "name": "Magi: The kingdom of magic",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx18115-dilbAD4yGMfc.png",
  "year": 2013,
  "al": ["マギ The kingdom of magic", "Magi: The Labyrinth of Magic 2", "マギ The labyrinth of magic 2"],
  "r": 422
 },
 {
  "id": 105156,
  "name": "Shinchou Yuusha: Kono Yuusha ga Ore TUEEE Kuse ni Shinchou Sugiru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105156-ZVtxISdoUqnY.png",
  "year": 2019,
  "al": ["Cautious Hero: The Hero Is Overpowered but Overly Cautious", "慎重勇者～この勇者が俺ＴＵＥＥＥくせに慎重すぎる～", "This Hero is Invincible but \"Too Cautious\"", "Shinchou Yuusha", "慎重勇者～这个勇者明明超强却过分慎重～", "ผู้กล้าสุดแกร่ง ขี้ระแวงขั้นวิกฤติ"],
  "r": 423
 },
 {
  "id": 101302,
  "name": "Dragon Ball Super: Broly",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101302-7L0lcwYeFQQM.jpg",
  "year": 2018,
  "al": ["ドラゴンボール超 ブロリー", "Драконий жемчуг: Супер — Броли"],
  "r": 424
 },
 {
  "id": 147103,
  "name": "Watashi no Shiawase na Kekkon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx147103-Om2LOXlhHNAe.png",
  "year": 2023,
  "al": ["My Happy Marriage", "わたしの幸せな結婚", "WataKon", "ขอให้รักเรานี้ได้มีความสุข", "Moje szczęśliwe małżeństwo", "Hôn nhân hạnh phúc của tôi", "Meu Casamento Feliz", "Il mio matrimonio felice"],
  "r": 425
 },
 {
  "id": 114232,
  "name": "Hige wo Soru. Soshite Joshikousei wo Hirou.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114232-2rm50ZD1cQgP.jpg",
  "year": 2021,
  "al": ["Higehiro: After Being Rejected, I Shaved and Took in a High School Runaway", "ひげを剃る。そして女子高生を拾う。", "Higehiro", "I Shaved My Beard Then Picked Up a High School Girl.", "剃须。然后捡到女高中生。", "刮掉鬍子的我與撿到的女高中生", "โกนหนวดไปทำงาน แล้วกลับบ้านมาพบเธอ", "Я побрился. И приютил школьницу"],
  "r": 426
 },
 {
  "id": 2025,
  "name": "DARKER THAN BLACK: Kuro no Keiyakusha",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b2025-ZKVteVzUyFLH.png",
  "year": 2007,
  "al": ["Darker than Black", "DARKER THAN BLACK -黒の契約者-", "DARKER THAN BLACK -Black Contractor-", "Bí Mật Bóng Tối", "Brama piekieł"],
  "r": 427
 },
 {
  "id": 116566,
  "name": "Akudama Drive",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116566-PPIVQt359vQY.jpg",
  "year": 2020,
  "al": ["アクダマドライブ", "아쿠다마 드라이브", "Акудама Драйв"],
  "r": 428
 },
 {
  "id": 323,
  "name": "Mousou Dairinin",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx323-ZGkUcJOn4ngy.png",
  "year": 2004,
  "al": ["Paranoia Agent", "妄想代理人"],
  "r": 429
 },
 {
  "id": 196187,
  "name": "Super no Ura de Yani Suu Futari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx196187-0dgFi2CPp3xn.jpg",
  "year": 2026,
  "al": ["Smoking Behind the Supermarket with You", "スーパーの裏でヤニ吸うふたり", "Behind the supermarket, smoking with you.", "ヤニすう", "YaniSuu", "Paląc z tobą na tyłach sklepu", "สองสิงห์อมควันหลังซูเปอร์มาร์เก็ต"],
  "r": 430
 },
 {
  "id": 131518,
  "name": "Dr. STONE: NEW WORLD",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131518-RU7RoUmGb2sP.jpg",
  "year": 2023,
  "al": ["Dr. STONE New World", "Dr.STONE NEW WORLD", "石纪元第三季", "Dr.STONE Season 3", "DR.STONE ภาค 3", "Dr.STONE 第3期", "Dr. STONE 新石紀（第三季）", "Доктор Стоун: Новый Свет"],
  "r": 431
 },
 {
  "id": 21421,
  "name": "Kiznaiver",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21421-5y8ryXsMB7aJ.jpg",
  "year": 2016,
  "al": ["キズナイーバー"],
  "r": 432
 },
 {
  "id": 100077,
  "name": "Hinamatsuri",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100077-FgGYIt8gGyrn.jpg",
  "year": 2018,
  "al": ["ヒナまつり"],
  "r": 433
 },
 {
  "id": 486,
  "name": "Kino no Tabi: the Beautiful World",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx486-xXUgNOEBuxGs.jpg",
  "year": 2003,
  "al": ["Kino's Journey", "キノの旅 -the Beautiful World-", "Kino's Travels: The Beautiful World", "L'Odyssée de Kino", "Kinos Resa"],
  "r": 434
 },
 {
  "id": 10721,
  "name": "Mawaru Penguindrum",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10721-lNEbDPX24qzn.jpg",
  "year": 2011,
  "al": ["Penguindrum", "輪るピングドラム"],
  "r": 435
 },
 {
  "id": 179966,
  "name": "Silent Witch: Chinmoku no Majo no Kakushigoto",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx179966-g0EU7rVe2Og7.jpg",
  "year": 2025,
  "al": ["Secrets of the Silent Witch", "サイレント・ウィッチ 沈黙の魔女の隠しごと", "ไซเลนต์วิตช์: ความลับของแม่มดแห่งความเงียบงัน", "Silent Witch 沉默魔女的祕密"],
  "r": 436
 },
 {
  "id": 268,
  "name": "GOLDEN BOY: Sasurai no Obenkyou Yarou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx268-0T6bdW9CzVvz.png",
  "year": 1995,
  "al": ["GOLDEN BOY", "GOLDEN BOY さすらいのお勉強野郎", "ゴールデンボーイ"],
  "r": 437
 },
 {
  "id": 169580,
  "name": "Class de 2-banme ni Kawaii Onnanoko to Tomodachi ni Natta",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx169580-nXxpmqu6UVux.jpg",
  "year": 2026,
  "al": ["I Made Friends with the Second Prettiest Girl in My Class", "クラスで２番目に可愛い女の子と友だちになった", "I Became Friends with the Second Cutest Girl in My Class", "Kuranika", "クラにか", "Я подружился со второй красоткой класса"],
  "r": 438
 },
 {
  "id": 99088,
  "name": "PLUTO",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99088-LTJskMD1wbbQ.png",
  "year": 2023,
  "al": ["プルートウ", "ПЛУТОН"],
  "r": 439
 },
 {
  "id": 182587,
  "name": "[Oshi no Ko] 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx182587-fsU8LOjmd7oj.jpg",
  "year": 2026,
  "al": ["OSHI NO KO Season 3", "【推しの子】第3期", "[OSHI NO KO] Season 3", "【OSHI NO KO】Season 3"],
  "r": 440
 },
 {
  "id": 99699,
  "name": "Golden Kamuy",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99699-mBCjpoWpAVGX.jpg",
  "year": 2018,
  "al": ["ゴールデンカムイ", "Golden Kamui", "黄金神威"],
  "r": 441
 },
 {
  "id": 97938,
  "name": "BORUTO: NARUTO NEXT GENERATIONS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97938-BnF6M5yTaNB1.jpg",
  "year": 2017,
  "al": ["BORUTO-ボルト- NARUTO NEXT GENERATIONS", "博人传 火影忍者新时代", "โบรูโตะ: นารูโตะ เน็กซ์ เจนเนเรชั่น", "بوروتو: الأجيال القادمة من ناروتو"],
  "r": 442
 },
 {
  "id": 99468,
  "name": "Karakai Jouzu no Takagi-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99468-XayCplkIL3Gf.png",
  "year": 2018,
  "al": ["Teasing Master Takagi-san", "からかい上手の高木さん", "Skilled Teaser Takagi-san", "Takagi-san: Experta en Bromas Pesadas", "טאקאגי-סאן אלופת ההקנטות", "擅长捉弄的高木同学", "سيد الدعابة تاكاجي-سان", "Nhất quỷ Nhì ma, Thứ ba Takagi"],
  "r": 443
 },
 {
  "id": 166610,
  "name": "MASHLE: Kami Shinkakusha Kouho Senbatsu Shiken-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx166610-S5q7V2v5zdDK.jpg",
  "year": 2024,
  "al": ["MASHLE: MAGIC AND MUSCLES Season 2", "マッシュル-MASHLE- 神覚者候補選抜試験編", "マッシュル-MASHLE- 第2期", "MASHLE 2nd Season", "MASHLE: MAGIC AND MUSCLES - The Divine Visionary Candidate Exam Arc", "肌肉魔法使-MASHLE- 神覺者候補選拔試驗篇", "MASHLE: Магия и мускулы. Экзамен на звание Вестника Бога"],
  "r": 444
 },
 {
  "id": 111321,
  "name": "Tate no Yuusha no Nariagari Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx111321-dIr3dEKOIPer.png",
  "year": 2022,
  "al": ["The Rising of the Shield Hero Season 2", "盾の勇者の成り上がり Season 2", "ผู้กล้าโล่ผงาด ภาค 2", "Восхождение героя щита 2"],
  "r": 445
 },
 {
  "id": 114963,
  "name": "Nakitai Watashi wa Neko wo Kaburu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114963-QWMbi5ttovSK.png",
  "year": 2020,
  "al": ["A Whisker Away", "泣きたい私は猫をかぶる", "Nakineko", "Amor de Gata", "Loin de moi, près de toi", "Olhos de Gato", "Um ein Schnurrhaar", "Miyo - Un amore felino"],
  "r": 446
 },
 {
  "id": 156067,
  "name": "Tondemo Skill de Isekai Hourou Meshi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx156067-Jovklss4VWIx.jpg",
  "year": 2023,
  "al": ["Campfire Cooking in Another World with my Absurd Skill", "とんでもスキルで異世界放浪メシ", "Regarding the Display of an Outrageous Skill Which Has Incredible Powers", "Gourmet Adventure of Legendary Tamer", "สกิลสุดพิสดารกับมื้ออาหารในต่างโลก", "Mengembara dan Memasak di Dunia Lain dengan Skil yang Absurd", "Hero Skill - Achats en ligne", "擁有超常技能的異世界流浪美食家"],
  "r": 447
 },
 {
  "id": 10800,
  "name": "Chihayafuru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10800-hofcUL0YEL7O.png",
  "year": 2011,
  "al": ["ちはやふる", "Chihayafull"],
  "r": 448
 },
 {
  "id": 101972,
  "name": "Modao Zushi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx101972-dep8Bcte5jQd.jpg",
  "year": 2018,
  "al": ["The Founder of Diabolism", "魔道祖师", "Mo Dao Zu Shi", "Grandmaster of Demonic Cultivation", "The Founder of Evil Magic", "魔道祖師", "Madou Soshi", "마도조사"],
  "r": 449
 },
 {
  "id": 99425,
  "name": "Promare",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99425-CQ500X23zp4i.png",
  "year": 2019,
  "al": ["プロメア", "普罗米亚", "Промар"],
  "r": 450
 },
 {
  "id": 131520,
  "name": "Go-toubun no Hanayome Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131520-89Qfo8JnGHI3.png",
  "year": 2022,
  "al": ["The Quintessential Quintuplets Movie", "映画 五等分の花嫁", "5-toubun no Hanayome Movie", "Eiga Go-toubun no Hanayome", "เจ้าสาวผมเป็นแฝดห้า The Movie"],
  "r": 451
 },
 {
  "id": 142769,
  "name": "Natsu e no Tunnel, Sayonara no Deguchi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142769-kNyyqpwC9gGV.jpg",
  "year": 2022,
  "al": ["The Tunnel to Summer, the Exit of Goodbyes", "夏へのトンネル、さよならの出口", "คำจากลาของคิมหันต์ ณ ปลายอุโมงค์", "Natsuton", "El túnel de los deseos", "Đường hầm tới mùa hạ, lối thoát của biệt ly"],
  "r": 452
 },
 {
  "id": 153930,
  "name": "Romantic Killer",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153930-uTRxaIcNa26E.jpg",
  "year": 2022,
  "al": ["ロマンティック・キラー", "La asesina del romance", "Романтичний убивця", "Убийца-романтик"],
  "r": 453
 },
 {
  "id": 21399,
  "name": "Kizumonogatari II: Nekketsu-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21399-VTAdAqc8u5AE.png",
  "year": 2016,
  "al": ["Kizumonogatari Part 2: Nekketsu", "傷物語〈Ⅱ熱血篇〉", "Wound Tale 2: Hot Blood"],
  "r": 454
 },
 {
  "id": 142984,
  "name": "Komi-san wa, Komyushou desu. 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142984-nv2MWVWZ1yYH.jpg",
  "year": 2022,
  "al": ["Komi Can't Communicate Part 2", "古見さんは、コミュ症です。2", "Komi Can't Communicate Season 2", "โฉมงามพูดไม่เก่งกับผองเพื่อนไม่เต็มเต็ง ภาค 2", "كومي لا تستطيع التواصل", "У Коми проблемы с общением 2", "Комі не вміє спілкуватися 2", "המשאלה של קומי"],
  "r": 455
 },
 {
  "id": 1604,
  "name": "Katekyou Hitman REBORN!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1604-W2q38L4OCGLI.png",
  "year": 2006,
  "al": ["REBORN!", "家庭教師ヒットマンREBORN!", "Katekyo Hitman Reborn!", "ครูพิเศษจอมป่วน รีบอร์น!", "Gia sư HITMAN REBORN!"],
  "r": 456
 },
 {
  "id": 100240,
  "name": "Tokyo Ghoul:re",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx100240-vJNaKd5HwPJ2.jpg",
  "year": 2018,
  "al": ["東京喰種-トーキョーグール-:re"],
  "r": 457
 },
 {
  "id": 99539,
  "name": "Nanatsu no Taizai: Imashime no Fukkatsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99539-caPX28RSsgRP.jpg",
  "year": 2018,
  "al": ["The Seven Deadly Sins: Revival of the Commandments", "七つの大罪 戒めの復活", "The Seven Deadly Sins: Die Rückkehr der Gebote", "ศึกตำนาน 7 อัศวิน ภาค 2 คืนชีพบัญญัติสิบประการ", "The Seven Deadly Sins: Odrodzenie przykazań", "Семь смертных грехов: Возрождение Заповедей"],
  "r": 458
 },
 {
  "id": 108268,
  "name": "Honzuki no Gekokujou: Shisho ni Naru Tame ni wa Shudan wo Erandeiraremasen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108268-Dtt82uOi3vq5.jpg",
  "year": 2019,
  "al": ["Ascendance of a Bookworm", "本好きの下剋上 司書になるためには手段を選んでいられません", "Ascendance of a Bookworm: I'll do anything to become a librarian", "爱书的下克上：为了成为图书管理员不择手段！", "หนอนหนังสือยึดอำนาจ"],
  "r": 459
 },
 {
  "id": 18507,
  "name": "Free!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx18507-RajfCYPpBfT3.png",
  "year": 2013,
  "al": ["Free! -Iwatobi Swim Club-", "フリー！"],
  "r": 460
 },
 {
  "id": 146850,
  "name": "Isekai Nonbiri Nouka",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx146850-xfeAFIE0M9hl.jpg",
  "year": 2023,
  "al": ["Farming Life in Another World", "異世界のんびり農家", "ISEKAI FARMING - Vita contadina in un altro mondo", "異世界悠閒農家"],
  "r": 461
 },
 {
  "id": 185874,
  "name": "BLEACH: Sennen Kessen-hen - Kashin-tan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx185874-aU3e6tBT6wwA.jpg",
  "year": 2026,
  "al": ["BLEACH: Thousand-Year Blood War - The Calamity", "BLEACH 千年血戦篇-禍進譚-", "BLEACH: Thousand-Year Blood War Part 4", "BLEACH 千年血戦篇 第4クール", "BLEACH: Thousand-Year Blood War The Final Season", "BLEACH TYBW"],
  "r": 462
 },
 {
  "id": 885,
  "name": "Tenshi no Tamago",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx885-UqlerD6tJKxs.png",
  "year": 1985,
  "al": ["Angel's Egg", "天使のたまご"],
  "r": 463
 },
 {
  "id": 101167,
  "name": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101167-Yasvj97UR9ue.png",
  "year": 2019,
  "al": ["Is It Wrong to Try to Pick Up Girls in a Dungeon? II", "ダンジョンに出会いを求めるのは間違っているだろうかⅡ", "Danmachi II", "ダンジョンに出会いを求めるのは間違っているだろうか2", "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka 2", "Dungeon ni Deai o Motomeru no wa Machigatte Iru Darouka: Familia Myth II", "มันผิดรึไงถ้าใจอยากจะพบรักในดันเจี้ยน ภาค 2", "ダンまちⅡ"],
  "r": 464
 },
 {
  "id": 137908,
  "name": "Chiyu Mahou no Machigatta Tsukaikata",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx137908-50af3lKVbst2.jpg",
  "year": 2024,
  "al": ["The Wrong Way to Use Healing Magic", "治癒魔法の間違った使い方", "Penggunaan Sihir Penyembuh yang Keliru", "เวทรักษาที่ไหนเขาใช้กันแบบนี้", "Cách dùng sai của ma thuật chữa trị", "Как (не) стоит использовать магию исцеления", "الطريقة الخاطئة لاستخدام سحر الشفاء"],
  "r": 465
 },
 {
  "id": 190327,
  "name": "JoJo no Kimyou na Bouken: Steel Ball Run - 1st STAGE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx190327-riJNCFL7w9y4.jpg",
  "year": 2026,
  "al": ["STEEL BALL RUN JoJo's Bizarre Adventure 1st STAGE", "ジョジョの奇妙な冒険 スティール・ボール・ラン 1st STAGE", "JoJo's Bizarre Adventure: Part 7–Steel Ball Run", "SBR", "ГОНКА «СТАЛЬНОЙ ШАР»: Невероятные приключения ДжоДжо", "Перегони «Сталева куля»: Химерні пригоди ДжоДжо"],
  "r": 466
 },
 {
  "id": 139518,
  "name": "Tsuki ga Michibiku Isekai Douchuu 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139518-GZWYKM8Kg1S2.png",
  "year": 2024,
  "al": ["TSUKIMICHI -Moonlit Fantasy- Season 2", "月が導く異世界道中 第二幕", "จันทรานำพาสู่ต่างโลก ภาค 2", "月光下的異世界之旅 第二季", "Благословлённое лунным светом приключение в другом мире 2"],
  "r": 467
 },
 {
  "id": 153845,
  "name": "Isekai de Cheat Skill wo Te ni Shita Ore wa, Genjitsu Sekai wo mo Musou Suru: Level Up wa Jinsei wo Kaeta",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153845-C47aoKy7wf19.jpg",
  "year": 2023,
  "al": ["I Got a Cheat Skill in Another World and Became Unrivaled in The Real World, Too", "異世界でチート能力を手にした俺は、現実世界をも無双する ～レベルアップは人生を変えた～", "I Got a Cheat Ability in a Different World, and Became Extraordinary Even in the Real World", "Isekai de Cheat Nouryoku Ote ni Shita Ore wa, Genjitsu Sekai o mo Musou Suru", "สกิลโกงไร้เทียมทาน สร้างตำนานในสองโลก: ชีวิตพลิกผันด้วยการอัปเลเวล", "Ganhei um Poder Apelão em Outro Mundo e Agora Sou Imbatível no Mundo Real", "Iseleve", "在异世界获得超强能力的我，在现实世界照样无敌～等级提升改变人生命运"],
  "r": 468
 },
 {
  "id": 104647,
  "name": "Otome Game no Hametsu Flag shika Nai Akuyaku Reijou ni Tensei shiteshimatta…",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104647-dMGZSavRxHcM.jpg",
  "year": 2020,
  "al": ["My Next Life as a Villainess: All Routes Lead to Doom!", "乙女ゲームの破滅フラグしかない悪役令嬢に転生してしまった…", "I Reincarnated into an Otome Game as a Villainess With Only Destruction Flags..", "Hamefura", "Hamehura", "Bakarina", "转生成为了只有乙女游戏破灭Flag的邪恶大小姐…", "เกิดใหม่เป็นนางร้ายจะเลือกทางไหนก็หายนะ"],
  "r": 469
 },
 {
  "id": 21701,
  "name": "Kuzu no Honkai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21701-j81oh6WCNlsQ.jpg",
  "year": 2017,
  "al": ["Scum's Wish", "クズの本懐", "Desejos Proibidos", "El deseo de la escoria"],
  "r": 470
 },
 {
  "id": 20725,
  "name": "Kuroko no Basket 3rd SEASON",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20725-DLu8VlkGFQKc.png",
  "year": 2015,
  "al": ["Kuroko's Basketball 3", "黒子のバスケ 3rd SEASON", "Kuroko no Basuke 3", "הכדורסל של קורוקו 3", "Баскетбол Куроко 3"],
  "r": 471
 },
 {
  "id": 20993,
  "name": "Owari no Seraph: Nagoya Kessen-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20993-c34UTma2bCcv.jpg",
  "year": 2015,
  "al": ["Seraph of the End: Battle in Nagoya", "終わりのセラフ　名古屋決戦編", "OwaSera 2", "Seraph of the End: El Reino de los Vampiros", "เทวทูตแห่งโลกมืด ภาค 2"],
  "r": 472
 },
 {
  "id": 134732,
  "name": "Aoashi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx134732-OXKSrOhF9pCM.jpg",
  "year": 2022,
  "al": ["アオアシ", "AOASHI แข็งเด็กหัวใจนักสู้", "أواشي", "Ao Ashi - Playmaker"],
  "r": 473
 },
 {
  "id": 98503,
  "name": "Gakuen Babysitters",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98503-oUCGDkv2osNK.jpg",
  "year": 2018,
  "al": ["School Babysitters", "学園ベビーシッターズ", "学园奶爸", "นักเรียนพี่เลี้ยงเด็ก"],
  "r": 474
 },
 {
  "id": 20946,
  "name": "Ore Monogatari!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20946-ejH7JhG6z25y.png",
  "year": 2015,
  "al": ["My Love Story!!", "俺物語!!", "Mon Histoire"],
  "r": 475
 },
 {
  "id": 112124,
  "name": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka III",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112124-ZmoOntBuiSUU.jpg",
  "year": 2020,
  "al": ["Is It Wrong to Try to Pick Up Girls in a Dungeon? III", "ダンジョンに出会いを求めるのは間違っているだろうかⅢ", "ダンジョンに出会いを求めるのは間違っているだろうか FAMILIA MYTH III", "Dungeon ni Deai o Motomeru no wa Machigatte Iru Darouka: Familia Myth III", "Danmachi III", "มันผิดรึไงถ้าใจอยากจะพบรักในดันเจี้ยน ภาค 3", "ダンまちⅢ"],
  "r": 476
 },
 {
  "id": 112788,
  "name": "Umibe no Étranger",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112788-yzq8eEwO6wan.jpg",
  "year": 2020,
  "al": ["The Stranger by the Shore", "海辺のエトランゼ", "Seaside Stranger", "Umibe no Etranger", "L'Étranger de la plage", "The Stranger by the Beach"],
  "r": 477
 },
 {
  "id": 180745,
  "name": "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 4th Season 2-nensei-hen Ichi Gakki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx180745-OEZaBeEdWozn.png",
  "year": 2026,
  "al": ["Classroom of the Elite 4th Season: Second Year, First Semester", "ようこそ実力至上主義の教室へ 4th Season 2年生編1学期", "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e: 2-nensei-hen", "ようこそ実力至上主義の教室へ ２年生編", "Classroom of the Elite: Year 2", "Classroom of the Elite Season 4", "ようこそ実力至上主義の教室へ 4th Season 2年生1学期", "Classroom of the Elite 2nd Year"],
  "r": 478
 },
 {
  "id": 114888,
  "name": "Fugou Keiji: Balance:UNLIMITED",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114888-lgecUF3O1AWS.png",
  "year": 2020,
  "al": ["The Millionaire Detective - Balance: UNLIMITED", "富豪刑事 Balance:UNLIMITED"],
  "r": 479
 },
 {
  "id": 100112,
  "name": "Kenja no Mago",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100112-eExFpnYG2QAK.jpg",
  "year": 2019,
  "al": ["Wise Man’s Grandchild", "賢者の孫", "The Wise Grandson", "The Sage's Grandson", "Philosopher's Grandson", "Magi's Grandson", "หลานจอมปราชญ์"],
  "r": 480
 },
 {
  "id": 136484,
  "name": "Shiguang Dailiren II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx136484-QiHcF64PVWQi.jpg",
  "year": 2023,
  "al": ["Link Click Season 2", "时光代理人 第二季", "LINK CLICK II", "ข้ามเวลาพิชิตภารกิจ ภาค 2"],
  "r": 481
 },
 {
  "id": 21460,
  "name": "Hibike! Euphonium 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21460-B52Z2pICE11i.png",
  "year": 2016,
  "al": ["Sound! Euphonium 2", "響け！ユーフォニアム 2", "Résonne ! Euphonium 2"],
  "r": 482
 },
 {
  "id": 114129,
  "name": "Gintama: THE FINAL",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114129-RLgSuh6YbeYx.jpg",
  "year": 2021,
  "al": ["Gintama: THE VERY FINAL", "銀魂 THE FINAL", "กินทามะ THE FINAL"],
  "r": 483
 },
 {
  "id": 109190,
  "name": "Violet Evergarden Gaiden: Eien to Jidou Shuki Ningyou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx109190-e8mv1qdmpjLW.jpg",
  "year": 2019,
  "al": ["Violet Evergarden: Eternity and the Auto Memory Doll", "ヴァイオレット・エヴァーガーデン 外伝~永遠と自動手記人形~", "Violet Evergarden und das Band der Freundschaft", "Violet Evergarden Gaiden: La Eternidad y la Muñeca de Recuerdos Automáticos", "Violet Evergarden Gaiden: Eternidade e a Boneca de Automemória", "فيوليت: الأبدية وذكريات الدمية الآلية", "Вайолет Эвергарден: Вечность и призрак пера", "Violet Evergarden: Věčnost a Píšící panenka"],
  "r": 484
 },
 {
  "id": 21518,
  "name": "Shokugeki no Souma: Ni no Sara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21518-uBqzDGIuSxJ5.jpg",
  "year": 2016,
  "al": ["Food Wars! The Second Plate", "食戟のソーマ 弍ノ皿", "食戟之灵 贰之皿", "ยอดนักปรุงโซมะ ภาค 2"],
  "r": 485
 },
 {
  "id": 17549,
  "name": "Non Non Biyori",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx17549-ROdV36u4nWkU.png",
  "year": 2013,
  "al": ["のんのんびより", "悠哉日常大王"],
  "r": 486
 },
 {
  "id": 6880,
  "name": "Deadman Wonderland",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6880-qZ1jIqIYpST2.png",
  "year": 2011,
  "al": ["デッドマン・ワンダーランド"],
  "r": 487
 },
 {
  "id": 182469,
  "name": "ONE PIECE FAN LETTER",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx182469-JQ808NBPxmgn.jpg",
  "year": 2024,
  "al": [],
  "r": 488
 },
 {
  "id": 21403,
  "name": "Sword Art Online: Ordinal Scale",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx21403-k8DZhZ3x1BCO.png",
  "year": 2017,
  "al": ["Sword Art Online the Movie: Ordinal Scale", "ソードアート・オンライン -オーディナル・スケール-", "SAO THE MOVIE"],
  "r": 489
 },
 {
  "id": 186497,
  "name": "Koori no Jouheki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx186497-uwPrNPphXvjP.jpg",
  "year": 2026,
  "al": ["The Ramparts of Ice", "氷の城壁", "Parede de Gelo", "Стены изо льда", "ปราการน้ำแข็งแห่งหัวใจ"],
  "r": 490
 },
 {
  "id": 126546,
  "name": "Seirei Gensouki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx126546-Jujx9OvKxLzA.jpg",
  "year": 2021,
  "al": ["Seirei Gensouki: Spirit Chronicles", "精霊幻想記", "精灵幻想记", "ตำนานวิญญาณแฟนซี"],
  "r": 491
 },
 {
  "id": 21262,
  "name": "Owarimonogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx21262-jfbv9hvjymMW.jpg",
  "year": 2015,
  "al": ["終物語", "End Tale"],
  "r": 492
 },
 {
  "id": 11887,
  "name": "Kokoro Connect",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11887-ypZTwcRqopiL.jpg",
  "year": 2012,
  "al": ["ココロコネクト", "Kokoroco"],
  "r": 493
 },
 {
  "id": 175914,
  "name": "Yofukashi no Uta Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx175914-VsbL90WzuqoM.jpg",
  "year": 2025,
  "al": ["Call of the Night Season 2", "よふかしのうた Season 2", "Zew nocy. Sezon 2"],
  "r": 494
 },
 {
  "id": 135806,
  "name": "Isekai Oji-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx135806-uhqZSNTYZe04.jpg",
  "year": 2022,
  "al": ["Uncle from Another World", "異世界おじさん", "Ojisan in Another World", "ยอดคุณน้าจากต่างโลก", "Mi tío es de otro mundo", "Coma héroïque dans un autre monde", "O Tio de Outro Mundo", "דוד מעולם אחר"],
  "r": 495
 },
 {
  "id": 2236,
  "name": "Toki wo Kakeru Shoujo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2236-tH5fWFkHyVGg.png",
  "year": 2006,
  "al": ["The Girl Who Leapt Through Time", "時をかける少女", "Toki wo Kakeru Shojo", "TokiKake", "The Girl Who Cut Time", "Das Mädchen, das durch die Zeit sprang", "La Chica que Saltaba a Través del Tiempo", "A Garota que Conquistou o Tempo"],
  "r": 496
 },
 {
  "id": 16067,
  "name": "Nagi no Asukara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16067-CFX0g435pLob.png",
  "year": 2013,
  "al": ["A Lull in the Sea", "凪のあすから", "NagiAsu", "Nagi no Asu Kara: Calmaria do Mar", "Nagi no Asukara: Calma en el mar", "From a calm tomorrow"],
  "r": 497
 },
 {
  "id": 7724,
  "name": "Shiki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx7724-NwNnRsI34eDa.jpg",
  "year": 2010,
  "al": ["屍鬼", "Corpse Demon"],
  "r": 498
 },
 {
  "id": 101004,
  "name": "Isekai Maou to Shoukan Shoujo no Dorei Majutsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101004-rJLBIWGypbYK.png",
  "year": 2018,
  "al": ["How NOT to Summon a Demon Lord", "異世界魔王と召喚少女の奴隷魔術", "The King of Darkness Another World Story", "异世界魔王与召唤少女的奴隶魔术", "จอมมารต่างโลกกับ บริวารสาวนักอัญเชิญ", "異世界魔王與召喚少女的奴隸魔術"],
  "r": 499
 },
 {
  "id": 20910,
  "name": "Shimoneta to Iu Gainen ga Sonzai Shinai Taikutsu na Sekai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20910-U7txwG3o9gma.jpg",
  "year": 2015,
  "al": ["SHIMONETA: A Boring World Where the Concept of Dirty Jokes Doesn’t Exist", "下ネタという概念が存在しない退屈な世界", "Shimoseka"],
  "r": 500
 },
 {
  "id": 131565,
  "name": "takt op.Destiny",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131565-3W2YEX6V3K3i.jpg",
  "year": 2021,
  "al": ["タクトオーパス", "แท็กต์ โอปัส. เดสตินี ~ลิขิตเสียง บรรเลงชะตา~", "宿命回响：命运节拍", "Такт. Опус Дестини"],
  "r": 501
 },
 {
  "id": 163146,
  "name": "Blue Lock VS. U-20 JAPAN",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163146-BVZPgyzkqi82.png",
  "year": 2024,
  "al": ["BLUE LOCK Season 2", "ブルーロック VS. U-20 JAPAN", "ブルーロック第2期", "Blue Lock 2nd Season"],
  "r": 502
 },
 {
  "id": 102351,
  "name": "Tokyo Ghoul:re 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx102351-yD3Ty9YZFMsf.jpg",
  "year": 2018,
  "al": ["東京喰種-トーキョーグール-:re 2"],
  "r": 503
 },
 {
  "id": 177385,
  "name": "Ikoku Nikki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx177385-TBpvkGdF28R7.png",
  "year": 2026,
  "al": ["Journal with Witch", "違国日記", "Diary of a Strange Land", "Foreign Country Diary", "Different Country Diary", "บันทึกจากวิเทศ", "مذكرات من بلد آخر", "Entre les lignes"],
  "r": 504
 },
 {
  "id": 170,
  "name": "SLAM DUNK",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170-cmD8A0vZsp6g.jpg",
  "year": 1993,
  "al": ["スラムダンク", "슬램덩크", "灌篮高手", "灌籃高手", "สแลมดังก์", "سلام دانك"],
  "r": 505
 },
 {
  "id": 195600,
  "name": "Yomi no Tsugai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx195600-moI0UFArtOme.jpg",
  "year": 2026,
  "al": ["Daemons of the Shadow Realm", "黄泉のツガイ", "ヨミツガ", "YomiTsuga", "Pasangan dari Alam Baka", "ยมลแห่งยมโลก", "Yomi no Tsugai - Daemons do Reino das Sombras", "Espíritus del Inframundo"],
  "r": 506
 },
 {
  "id": 21700,
  "name": "Rokudenashi Majutsu Koushi to Akashic Records",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21700-HhTEXPZKxupP.jpg",
  "year": 2017,
  "al": ["Akashic Records of Bastard Magic Instructor", "ロクでなし魔術講師と禁忌教典(アカシックレコード)", "RokuAka", "อาจารย์เวทมนตร์ไม่เอาไหนกับตำนานปราสาทลอยฟ้า", "不正經的魔術講師與禁忌教典"],
  "r": 507
 },
 {
  "id": 143653,
  "name": "Kimi wa Houkago Insomnia",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx143653-uq3motvR9kb4.png",
  "year": 2023,
  "al": ["Insomniacs After School", "君は放課後インソムニア", "Insomniaques", "ถ้านอนไม่หลับไปนับดาวกันไหม", "放学后失眠的你", "Bezsenność po szkole", "Insomnia Sepulang Sekolah"],
  "r": 508
 },
 {
  "id": 103871,
  "name": "Zombie Land Saga",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx103871-KEWbn3fkz499.png",
  "year": 2018,
  "al": ["ゾンビランドサガ", "Zombieland Saga", "佐贺偶像是传奇", "Зомбилэнд-Сага"],
  "r": 509
 },
 {
  "id": 21857,
  "name": "Masamune-kun no Revenge",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx21857-haPDVD7DKDpg.jpg",
  "year": 2017,
  "al": ["Masamune-kun's Revenge", "政宗くんのリベンジ", "การแก้แค้นของมาซามุเนะคุง", "Месть Масамунэ"],
  "r": 510
 },
 {
  "id": 20754,
  "name": "Gakkou Gurashi!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20754-e5JXeLpHoN7w.jpg",
  "year": 2015,
  "al": ["SCHOOL-LIVE!", "がっこうぐらし!"],
  "r": 511
 },
 {
  "id": 322,
  "name": "Paradise Kiss",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx322-4OvRw6V7JTiK.png",
  "year": 2005,
  "al": ["パラダイス・キス", "Parakiss"],
  "r": 512
 },
 {
  "id": 20791,
  "name": "Fate/stay night [Heaven's Feel] I. presage flower",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20791-yPCX5GJuMH2k.png",
  "year": 2017,
  "al": ["Fate/stay night[Heaven's Feel] Ⅰ.presage flower", "Fate/HF", "Судьба/Ночь схватки: Прикосновение небес"],
  "r": 513
 },
 {
  "id": 21196,
  "name": "Koutetsujou no Kabaneri",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21196-2PfPfIDrxKki.jpg",
  "year": 2016,
  "al": ["Kabaneri of the Iron Fortress", "甲鉄城のカバネリ", "Kabaneri de la Fortaleza de Hierro"],
  "r": 514
 },
 {
  "id": 759,
  "name": "Tokyo Godfathers",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx759-XSKBju6xutdR.jpg",
  "year": 2003,
  "al": ["東京ゴッドファーザーズ", "Rodzice chrzestni z Tokio", "Héroes al Rescate"],
  "r": 515
 },
 {
  "id": 124223,
  "name": "Uma Musume: Pretty Derby Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx124223-XMOEUPopjtrI.png",
  "year": 2021,
  "al": ["Umamusume: Pretty Derby Season 2", "ウマ娘 プリティーダービー Season 2", "สาวม้าโมเอะ ภาค 2"],
  "r": 516
 },
 {
  "id": 16894,
  "name": "Kuroko no Basket 2nd SEASON",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16894-iXt8GDs1L6dr.jpg",
  "year": 2013,
  "al": ["Kuroko's Basketball 2", "黒子のバスケ 2nd SEASON", "Kuroko no Basuke 2", "הכדורסל של קורוקו 2", "Баскетбол Куроко 2"],
  "r": 517
 },
 {
  "id": 16664,
  "name": "Kaguya-hime no Monogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/16664-Wakrc8rbBkor.jpg",
  "year": 2013,
  "al": ["The Tale of The Princess Kaguya", "かぐや姫の物語", "Kaguyahime no Monogatari", "Princess Kaguya Story", "El Cuento de la Princesa Kaguya", "O Conto da Princesa Kaguya", "Księżniczka Kaguya", "La leyenda de la Princesa Kaguya"],
  "r": 518
 },
 {
  "id": 14467,
  "name": "K",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14467-TQjwOvq4jkYS.png",
  "year": 2012,
  "al": ["K-Project (K-プロジェクト)", "K -eine weitere Geschichte-"],
  "r": 519
 },
 {
  "id": 108725,
  "name": "Yakusoku no Neverland 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108725-ZKivuyr4Jtc9.jpg",
  "year": 2021,
  "al": ["The Promised Neverland Season 2", "約束のネバーランド2", "YakuNeba", "TPN2", "พันธสัญญาเนเวอร์แลนด์ ภาค 2", "約定的夢幻島 第二季"],
  "r": 520
 },
 {
  "id": 176508,
  "name": "Shangri-La Frontier 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx176508-eFad4szofm8d.png",
  "year": 2024,
  "al": ["Shangri-La Frontier Season 2", "シャングリラ・フロンティア 2nd season", "シャンフロ２", "シャングリラ・フロンティア〜クソゲーハンター, 神ゲーに挑まんとす〜 2nd season", "Shangri-La Frontier: Kusoge Hunter, Kamige ni Idoman to su 2nd Season", "Рубеж Шангри-Ла 2", "Thợ săn Game rác thách thức Game cấp Thánh, Mùa 2"],
  "r": 521
 },
 {
  "id": 100298,
  "name": "Megalo Box",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b100298-A5VQUcw7ZC64.jpg",
  "year": 2018,
  "al": ["Megalobox", "メガロボクス"],
  "r": 522
 },
 {
  "id": 8425,
  "name": "GOSICK",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx8425-Bn14ayPjnq9o.jpg",
  "year": 2011,
  "al": ["ゴシック"],
  "r": 523
 },
 {
  "id": 147864,
  "name": "Onii-chan wa Oshimai!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx147864-EBt29GeJ6G2P.png",
  "year": 2023,
  "al": ["ONIMAI: I'm Now Your Sister!", "お兄ちゃんはおしまい！", "Onii-chan is Done For!", "ONIMAI: Sekarang Aku Kakak Perempuanmu!", "อวสานพี่ชาย กลายเป็นพี่สาว", "不當哥哥了！", "Я стал сестрой!", "ONIMAI: Ab sofort Schwester!"],
  "r": 524
 },
 {
  "id": 5231,
  "name": "Inazuma Eleven",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5231-SuMNWJQQK8jl.png",
  "year": 2008,
  "al": ["イナズマイレブン", "Super Onze", "Super Once"],
  "r": 525
 },
 {
  "id": 12531,
  "name": "Sakamichi no Apollon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12531-m8q2U1lA6V90.jpg",
  "year": 2012,
  "al": ["Kids on the Slope", "坂道のアポロン", "Sakamichi no Aporon", "Apollo on the Slope"],
  "r": 526
 },
 {
  "id": 141249,
  "name": "Bungou Stray Dogs 4th Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx141249-8tjavEDHmLoT.jpg",
  "year": 2023,
  "al": ["Bungo Stray Dogs 4", "文豪ストレイドッグス 第4シーズン", "BSD 4", "BungouSD 4", "คณะประพันธกรจรจัด ภาค 4", "文豪野犬第四季"],
  "r": 527
 },
 {
  "id": 26,
  "name": "TEXHNOLYZE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx26-ADSztyHBNO39.jpg",
  "year": 2003,
  "al": ["テクノライズ"],
  "r": 528
 },
 {
  "id": 142074,
  "name": "Otomege Sekai wa Mob ni Kibishii Sekai desu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142074-pHe4bX791PJh.jpg",
  "year": 2022,
  "al": ["Trapped in a Dating Sim: The World of Otome Games Is Tough for Mobs", "乙女ゲー世界はモブに厳しい世界です", "mobseka", "ชีวิตตัวประกอบอย่างตูช่างอยู่ยาก เมื่ออยู่ในโลกเกมจีบหนุ่ม", "Otome Game Sekai wa Mob ni Kibishii Sekai desu"],
  "r": 529
 },
 {
  "id": 98291,
  "name": "Tsurezure Children",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98291-LY6txxZTX8We.jpg",
  "year": 2017,
  "al": ["Tsuredure Children", "徒然チルドレン", "Tsure x dure children", "Признания"],
  "r": 530
 },
 {
  "id": 139587,
  "name": "Tensei Shitara Ken Deshita",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139587-rbZVcigCRtHY.jpg",
  "year": 2022,
  "al": ["Reincarnated as a Sword", "転生したら剣でした", "I Became the Sword by Transmigrating", "TenKen", "ซวยเหลือหลาย เกิดใหม่กลายเป็นดาบ", "TENKEN - Reincarnato in una spada", "轉生就是劍"],
  "r": 531
 },
 {
  "id": 1482,
  "name": "D.Gray-man",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1482-6jc8ZVSmHuLo.jpg",
  "year": 2006,
  "al": ["ディー・グレイマン", "D. Gray-man", "D. Grey-man"],
  "r": 532
 },
 {
  "id": 270,
  "name": "HELLSING",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b270-S2ProngvO6BU.jpg",
  "year": 2001,
  "al": ["ヘルシング", "Хеллсинг"],
  "r": 533
 },
 {
  "id": 125426,
  "name": "Gokushufudou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx125426-WeKnIVjCRNIC.png",
  "year": 2021,
  "al": ["The Way of the Househusband", "極主夫道", "La Via del Grembiule", "Gokushufudou: Tatsu Imortal", "De yakuza a amo de casa", "La Voie du Tablier", "Yakuza w fartuszku. Kodeks perfekcyjnego pana domu", "على طريقة ربّ المنزل"],
  "r": 534
 },
 {
  "id": 154116,
  "name": "Undead Unluck",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154116-3ydDI9hhvPgw.png",
  "year": 2023,
  "al": ["アンデッドアンラック", "אל-מת ובלי מזל"],
  "r": 535
 },
 {
  "id": 721,
  "name": "Princess Tutu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx721-9tJpM47RBPJm.jpg",
  "year": 2002,
  "al": ["プリンセスチュチュ"],
  "r": 536
 },
 {
  "id": 21495,
  "name": "Tanaka-kun wa Itsumo Kedaruge",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21495-I6p0OKzKBFjw.png",
  "year": 2016,
  "al": ["Tanaka-kun is Always Listless", "田中くんはいつもけだるげ"],
  "r": 537
 },
 {
  "id": 110350,
  "name": "ID: INVADED",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx110350-uchN78wglmhN.png",
  "year": 2020,
  "al": ["イド：インヴェイデッド", "异度侵入 ID:INVADED"],
  "r": 538
 },
 {
  "id": 110354,
  "name": "BNA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx110354-JJKR42frJABe.jpg",
  "year": 2020,
  "al": ["BNA ビー・エヌ・エー", "Brand New Animal", "BNA: Brand New Animal", "יש חיה כזאת"],
  "r": 539
 },
 {
  "id": 108553,
  "name": "Boku no Hero Academia THE MOVIE: Heroes:Rising",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108553-yOLfFogpWnTF.jpg",
  "year": 2019,
  "al": ["My Hero Academia: Heroes Rising", "僕のヒーローアカデミア THE MOVIE ヒーローズ:ライジング", "Boku no Hero Academia the Movie 2", "My Hero Academia: El Despertar de los Héroes", "มายฮีโร่ อคาเดเมีย เดอะมูฟวี่: วีรบุรุษกู้โลก"],
  "r": 540
 },
 {
  "id": 20966,
  "name": "Yamada-kun to 7-nin no Majo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20966-HboUtUzEKWl6.jpg",
  "year": 2015,
  "al": ["Yamada and the Seven Witches", "山田くんと7人の魔女", "Yamadakun to Nananin no Majo", "Yamajo", "ยามาดะคุงกับแม่มดทั้ง 7"],
  "r": 541
 },
 {
  "id": 155211,
  "name": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka IV: Shin Shou Yakusai-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx155211-GHT9uzXEkYS7.png",
  "year": 2023,
  "al": ["Is It Wrong to Try to Pick Up Girls in a Dungeon? IV Part 2", "ダンジョンに出会いを求めるのは間違っているだろうかⅣ 深章 厄災篇", "มันผิดรึไงถ้าใจอยากจะพบรักในดันเจี้ยน ภาค 4 Part 2", "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka 4th Season Part 2", "Is It Wrong to Try to Pick Up Girls in a Dungeon? Season 4 Part 2", "Danmachi IV Part 2", "ダンまちⅣ"],
  "r": 542
 },
 {
  "id": 107663,
  "name": "Kanata no Astra",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107663-gfIpy1h36kUL.jpg",
  "year": 2019,
  "al": ["ASTRA LOST IN SPACE", "彼方のアストラ"],
  "r": 543
 },
 {
  "id": 153629,
  "name": "Tensei Oujo to Tensai Reijou no Mahou Kakumei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153629-LNRlLFrbDTi8.jpg",
  "year": 2023,
  "al": ["The Magical Revolution of the Reincarnated Princess and the Genius Young Lady", "転生王女と天才令嬢の魔法革命", "MagiRevo", "転天", "TenTen", "轉生公主與天才千金的魔法革命", "Revolusi Sihir Sang Putri Reinkarnasi dan Tuan Putri Genius", "การปฏิวัติเวทมนตร์ขององค์หญิงเกิดใหม่กับยัยคุณหนูยอดอัจฉริยะ"],
  "r": 544
 },
 {
  "id": 15451,
  "name": "High School DxD NEW",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx15451-A5T54vmxUq9t.jpg",
  "year": 2013,
  "al": ["ハイスクールD×D NEW", "High School DxD 2", "Highschool DxD 2"],
  "r": 545
 },
 {
  "id": 135136,
  "name": "Vanitas no Carte Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx135136-wVMApb1FEmkz.jpg",
  "year": 2022,
  "al": ["The Case Study of Vanitas Part 2", "ヴァニタスの手記 2クール", "บันทึกแวมไพร์วานิทัส พาร์ท 2", "Vanitas no Karte (2022)"],
  "r": 546
 },
 {
  "id": 10161,
  "name": "NO.6",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10161-iJAey1M4zFrX.jpg",
  "year": 2011,
  "al": ["ナンバー・シックス"],
  "r": 547
 },
 {
  "id": 20657,
  "name": "Saenai Heroine no Sodatekata",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx20657-pMZBj6K6mLhi.jpg",
  "year": 2015,
  "al": ["Saekano: How to Raise a Boring Girlfriend", "冴えない彼女の育てかた", "Saekano", "路人女主的养成方法", "วิธีปั้นสาวบ้านให้มาเป็นนางเอกของผม"],
  "r": 548
 },
 {
  "id": 114121,
  "name": "Xian Wang De Richang Shenghuo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114121-vxWVgIBlBjox.png",
  "year": 2020,
  "al": ["The Daily Life of the Immortal King", "仙王的日常生活", "ชีวิตวุ่นวายของจอมราชันย์", "ชีวิตประจำวันของราชาแห่งเซียน", "La vida diaria del rey inmortal"],
  "r": 549
 },
 {
  "id": 57,
  "name": "BECK",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx57-4wTOlaVSgKoy.png",
  "year": 2004,
  "al": ["Beck: Mongolian Chop Squad", "ベック"],
  "r": 550
 },
 {
  "id": 11597,
  "name": "Nisemonogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11597-x2vd4KSHcI1S.jpg",
  "year": 2012,
  "al": ["偽物語", "Fake Tale", "Истории подделок", "ปกรณัมของเทียม"],
  "r": 551
 },
 {
  "id": 15051,
  "name": "Love Live! School idol project",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b15051-lwm0wVRWjKub.jpg",
  "year": 2013,
  "al": ["ラブライブ! School idol project", "Живая любовь: проект \"Школьный идол\""],
  "r": 552
 },
 {
  "id": 153658,
  "name": "Haikyuu!!: Gomi Suteba no Kessen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153658-KVnjW77cQw3y.jpg",
  "year": 2024,
  "al": ["HAIKYU!! The Dumpster Battle", "ハイキュー!! ゴミ捨て場の決戦", "ハイキュー!! FINAL", "Haikyuu!! FINAL", "Haikyuu!! Battle at the Garbage Dump", "Haikyu!! Movie: Decisive Battle at the Garbage Dump", "HAIKYU!! La Batalla del Basurero", "HAIKYU!! La Guerre des Poubelles"],
  "r": 553
 },
 {
  "id": 97922,
  "name": "Inuyashiki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97922-qrGn5fkQinDs.jpg",
  "year": 2017,
  "al": ["INUYASHIKI LAST HERO", "いぬやしき", "اینو یاشیکی", "อินุยาชิกิ", "犬屋敷", "犬舍"],
  "r": 554
 },
 {
  "id": 20631,
  "name": "Trinity Seven",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20631-LdCiy3goitcT.png",
  "year": 2014,
  "al": ["トリニティセブン", "Trinity Seven: 7-nin no Mahoutsukai", "Trinity Seven: Shichinin no Mahoutsukai"],
  "r": 555
 },
 {
  "id": 162780,
  "name": "Mahou Shoujo ni Akogarete",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx162780-brAdNEROhZdG.jpg",
  "year": 2024,
  "al": ["Gushing Over Magical Girls", "魔法少女にあこがれて", "I Admire Magical Girls, and...", "Mahoako", "Looking up to Magical Girls", "夢想成為魔法少女", "Fascinada por Garotas Mágicas", "Me encantan las Magical Girls"],
  "r": 556
 },
 {
  "id": 6213,
  "name": "Toaru Kagaku no Railgun",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6213-QtrlDQnexApL.jpg",
  "year": 2009,
  "al": ["A Certain Scientific Railgun", "とある科学の超電磁砲", "Toaru Kagaku no Choudenjihou", "ריילגאן", "المستوى الخامس", "เรลกัน แฟ้มลับคดีวิทยาศาสตร์", "Некий научный Рейлган", "เรลกัน แฟ้มลับคดีวิทยาศาสตร์ ภาคที่ 1"],
  "r": 557
 },
 {
  "id": 16742,
  "name": "Watashi ga Motenai no wa Dou Kangaetemo Omaera ga Warui!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16742-apAy622TmkVd.jpg",
  "year": 2013,
  "al": ["WataMote: No Matter How I Look At It, It's You Guys' Fault I'm Not Popular!", "私がモテないのはどう考えてもお前らが悪い!", "Watashi ga Motenai no wa Dou Kangaete mo Omaera ga Warui!", "It's Not My Fault That I'm Not Popular!", "WataMote"],
  "r": 558
 },
 {
  "id": 9969,
  "name": "Gintama'",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx9969-0GaRABYVdUcH.png",
  "year": 2011,
  "al": ["Gintama Season 2", "銀魂’", "Gintama (2011)"],
  "r": 559
 },
 {
  "id": 131083,
  "name": "Mieruko-chan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131083-sKGHkpVDksaZ.png",
  "year": 2021,
  "al": ["見える子ちゃん", "มิเอรุโกะจัง ใครว่าหนูเห็นผี", "Mieruko: Gadis yang Bisa Melihat Hantu", "Girl That Can See It", "Mieruko-chan. Dziewczyna, która widzi więcej"],
  "r": 560
 },
 {
  "id": 14131,
  "name": "Girls und Panzer",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14131-EP12xXteLTiF.jpg",
  "year": 2012,
  "al": ["ガールズ&パンツァー", "Garupan", "少女与战车", "GuP", "Девушки и танки"],
  "r": 561
 },
 {
  "id": 105190,
  "name": "Darwin's Game",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105190-lSoQNlnMF6UP.jpg",
  "year": 2020,
  "al": ["ダーウィンズゲーム", "达尔文游戏"],
  "r": 562
 },
 {
  "id": 20745,
  "name": "High School DxD BorN",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20745-HzWTPFv0P13I.jpg",
  "year": 2015,
  "al": ["ハイスクールD×D BorN", "High School DxD 3", "Highschool DxD 3"],
  "r": 563
 },
 {
  "id": 21860,
  "name": "Shuumatsu Nani Shitemasu ka? Isogashii desu ka? Sukutte Moratte Ii desu ka?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21860-lSIbYJtEbAXu.jpg",
  "year": 2017,
  "al": ["WorldEnd: What are you doing at the end of the world? Are you busy? Will you save us?", "終末なにしてますか? 忙しいですか? 救ってもらっていいですか?", "Do you have what THE END? Are you busy? Shall you save xxx?", "Sukasuka", "末日时在做什么？有没有空？可以来拯救吗？", "WorldEnd: What do you do at the end of the world? Are you busy? Will you save us?", "Apa yang Engkau Lakukan Saat Akhir Dunia? Apakah Engkau Sibuk? Bisakah Engkau Menolongku?", "เวิลด์เอนด์: วันสิ้นโลกนี้ทำอะไร ยุ่งหรือเปล่า มาช่วยเราได้ไหม"],
  "r": 564
 },
 {
  "id": 142853,
  "name": "Tokyo Revengers: Seiya Kessen-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142853-nxEZDE9oDRLG.png",
  "year": 2023,
  "al": ["Tokyo Revengers Season 2", "東京リベンジャーズ 聖夜決戦編", "Tokyo Revengers: Christmas Showdown", "Os Vingadores de Tóquio", "Răzbunătorii din Tokio: Sezonul 2"],
  "r": 565
 },
 {
  "id": 163263,
  "name": "Bungou Stray Dogs 5th Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163263-uz881pFAyi7P.jpg",
  "year": 2023,
  "al": ["Bungo Stray Dogs 5", "文豪ストレイドッグス 第5シーズン", "BSD 5"],
  "r": 566
 },
 {
  "id": 104459,
  "name": "Yuru Camp△ SEASON 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104459-pywEKGQON613.jpg",
  "year": 2021,
  "al": ["LAID-BACK CAMP SEASON2", "ゆるキャン△ SEASON２", "Yurucamp", "Yurukyan△", "摇曳露营△第二季", "摇曳露营△ 2", "โลลิตั้งแคมป์ ภาค 2", "แคมป์สบายสไตล์สาวๆ ภาค 2"],
  "r": 567
 },
 {
  "id": 99255,
  "name": "Shokugeki no Souma: San no Sara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx99255-heGTtj5b4owl.jpg",
  "year": 2017,
  "al": ["Food Wars! The Third Plate", "食戟のソーマ 餐ノ皿", "食戟之灵 餐之皿", "ยอดนักปรุงโซมะ ภาค 3"],
  "r": 568
 },
 {
  "id": 20057,
  "name": "Space☆Dandy",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20057-tG83EpH5Gu8K.jpg",
  "year": 2014,
  "al": ["Space Dandy", "スペース☆ダンディ"],
  "r": 569
 },
 {
  "id": 20773,
  "name": "GANGSTA.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20773-yfJQMyHqZyJr.jpg",
  "year": 2015,
  "al": ["ギャングスタ"],
  "r": 570
 },
 {
  "id": 146493,
  "name": "Ragna Crimson",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx146493-bThyDJ4ZmbfV.jpg",
  "year": 2023,
  "al": ["ラグナクリムゾン", "ตำนานนักล่ามังกร", "Рагна Багровый"],
  "r": 571
 },
 {
  "id": 178754,
  "name": "Kaijuu 8-gou 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178754-Dgrub8xgC03M.jpg",
  "year": 2025,
  "al": ["Kaiju No. 8 Season 2", "怪獣８号 第２期", "KAIJU No. EIGHT 2"],
  "r": 572
 },
 {
  "id": 20987,
  "name": "Himouto! Umaru-chan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20987-9Tq7kZTeJPMo.jpg",
  "year": 2015,
  "al": ["干物妹！うまるちゃん", "干物妹！小埋"],
  "r": 573
 },
 {
  "id": 141774,
  "name": "Paripi Koumei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx141774-iteNFzPq2oGw.jpg",
  "year": 2022,
  "al": ["Ya Boy Kongming!", "パリピ孔明", "Party People Kongming", "Paripi Kongming", "ขงเบ้งเจาะเวลามาปั้นดาว", "派對咖孔明"],
  "r": 574
 },
 {
  "id": 20811,
  "name": "Shingeki no Kyojin Gaiden: Kuinaki Sentaku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20811-IvXLdxZkYNcP.jpg",
  "year": 2015,
  "al": ["Attack on Titan: No Regrets", "進撃の巨人 外伝 悔いなき選択", "SnK", "AoT", "ผ่าพิภพไททัน ภาค OAD No Regret", "ผ่าพิภพไททัน OAD", "Атака титанов: Выбор без сожалений"],
  "r": 575
 },
 {
  "id": 1033,
  "name": "Sennen Joyuu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1033-d5p1pbd5qa4L.png",
  "year": 2002,
  "al": ["Millennium Actress", "千年女優"],
  "r": 576
 },
 {
  "id": 162670,
  "name": "Dr. STONE: NEW WORLD Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx162670-07XrFq2hreTx.jpg",
  "year": 2023,
  "al": ["Dr. STONE New World Part 2", "Dr.STONE NEW WORLD 第2クール", "石纪元第三季", "Dr.STONE Season 3 Part 2", "DR.STONE ภาค 3", "Dr.STONE 第3期 第2クール"],
  "r": 577
 },
 {
  "id": 112323,
  "name": "Arifureta Shokugyou de Sekai Saikyou 2nd season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112323-C6nlP84x8jH8.png",
  "year": 2022,
  "al": ["Arifureta: From Commonplace to World's Strongest Season 2", "ありふれた職業で世界最強 2nd season", "อาชีพกระจอกแล้วทำไม ยังไงข้าก็เทพ ภาค 2", "ARIFURETA: from commonplace to world's strongest second season"],
  "r": 578
 },
 {
  "id": 163623,
  "name": "Giji Harem",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163623-pzR6vIHoJh0b.jpg",
  "year": 2024,
  "al": ["Pseudo Harem", "疑似ハーレム", "ฮาเร็มนี้มีแต่เธอ"],
  "r": 579
 },
 {
  "id": 1889,
  "name": "Higurashi no Naku Koro ni Kai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1889-NqhWV3QwBXZl.jpg",
  "year": 2007,
  "al": ["When They Cry Kai", "ひぐらしのなく頃に解", "쓰르라미 울 적에 해"],
  "r": 580
 },
 {
  "id": 20812,
  "name": "SHIROBAKO",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20812-KvIP1yffJEPZ.jpg",
  "year": 2014,
  "al": ["White Box"],
  "r": 581
 },
 {
  "id": 6114,
  "name": "RAINBOW: Nisha Rokubou no Shichinin",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b6114-pLPszMA7AxbD.jpg",
  "year": 2010,
  "al": ["Rainbow", "RAINBOW -二舎六房の七人-", "Rainbow: The Seven From Compound Two, Cell Six", "Rainbow, os sete do bloco 2, cela 6"],
  "r": 582
 },
 {
  "id": 151040,
  "name": "TRIGUN STAMPEDE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx151040-9QXRpaprfNmL.png",
  "year": 2023,
  "al": ["トライガン スタンピード"],
  "r": 583
 },
 {
  "id": 20972,
  "name": "Shouwa Genroku Rakugo Shinjuu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20972-95dyLz6lkCZ8.jpg",
  "year": 2016,
  "al": ["Showa Genroku Rakugo Shinju", "昭和元禄落語心中", "Descending Stories: Showa Genroku Rakugo Shinju", "Le Rakugo ou la vie"],
  "r": 584
 },
 {
  "id": 145728,
  "name": "Ookami to Koushinryou: MERCHANT MEETS THE WISE WOLF",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx145728-YUKXjN2E81Pq.jpg",
  "year": 2024,
  "al": ["Spice and Wolf: MERCHANT MEETS THE WISE WOLF", "狼と香辛料 MERCHANT MEETS THE WISE WOLF", "Spice and Wolf (2024)", "Ookami to Koushinryou (2024)", "สาวหมาป่ากับนายเครื่องเทศ"],
  "r": 585
 },
 {
  "id": 7674,
  "name": "Bakuman.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx7674-J0QHrtN50kzj.png",
  "year": 2010,
  "al": ["バクマン。", "バクマン。第1シリーズ", "Bakuman. 1st Series", "Бакуман."],
  "r": 586
 },
 {
  "id": 100977,
  "name": "Hataraku Saibou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100977-nH1J2dR7GGAk.jpg",
  "year": 2018,
  "al": ["Cells at Work!", "はたらく細胞", "Les brigades immunitaires", "เซลล์ขยัน พันธุ์เดือด", "Lavori in corpo", "Клетки за работой!"],
  "r": 587
 },
 {
  "id": 1195,
  "name": "Zero no Tsukaima",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1195-odpKgDQ7A1fV.png",
  "year": 2006,
  "al": ["The Familiar of Zero", "ゼロの使い魔", "Zero's Familiar", "La Magia de Zero"],
  "r": 588
 },
 {
  "id": 20801,
  "name": "Kamisama Hajimemashita◎",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20801-2wtvmLpaM8hY.jpg",
  "year": 2015,
  "al": ["Kamisama Kiss◎", "神様はじめました◎"],
  "r": 589
 },
 {
  "id": 9617,
  "name": "K-ON! Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx9617-Z2RA1TIkcNEg.png",
  "year": 2011,
  "al": ["K-ON!: The Movie", "映画けいおん！", "Eiga K-On!", "Keion Movie", "K on Movie", "Film K-On!"],
  "r": 590
 },
 {
  "id": 116338,
  "name": "Mairimashita! Iruma-kun 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116338-jbuJnLkPMcm7.jpg",
  "year": 2021,
  "al": ["Welcome to Demon School! Iruma-kun Season 2", "魔入りました！入間くん 第2シリーズ", "Welcome to Demon School, Iruma-kun! Season 2", "入间同学入魔了 第二季", "入间同学入魔了！2", "อิรุมะคุง พจญในแดนปีศาจ! ภาค 2"],
  "r": 591
 },
 {
  "id": 104464,
  "name": "Ore wo Suki nano wa Omae dake ka yo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104464-UdOCt3uyA2K9.png",
  "year": 2019,
  "al": ["ORESUKI: Are you the only one who loves me?", "俺を好きなのはお前だけかよ", "อุตส่าห์มีคนมาชอบทั้งที ทำไมต้องเป็นยัยนี่ด้วยนะ"],
  "r": 592
 },
 {
  "id": 467,
  "name": "Koukaku Kidoutai: STAND ALONE COMPLEX",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx467-mBTtIoR13qs2.jpg",
  "year": 2002,
  "al": ["Ghost in the Shell: Stand Alone Complex", "攻殻機動隊 STAND ALONE COMPLEX", "Ghost in the Shell SAC", "Ghost in the Shell TV", "Koukaku Kidoutai STAND ALONE COMPLEX"],
  "r": 593
 },
 {
  "id": 20519,
  "name": "Tamako Love Story",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20519-YdNUizVJJIWI.png",
  "year": 2014,
  "al": ["Tamako -love story-", "たまこラブストーリー", "Miłosna opowieść Tamako"],
  "r": 594
 },
 {
  "id": 111428,
  "name": "Maou-jou de Oyasumi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx111428-JGrnjBDHLGQb.png",
  "year": 2020,
  "al": ["Sleepy Princess in the Demon Castle", "魔王城でおやすみ", "Maou Jou de Oyasumi", "Maoujou de Oyasumi", "MaouYasu", "在魔王城说晚安"],
  "r": 595
 },
 {
  "id": 3784,
  "name": "Evangelion Shin Movie: Ha",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx3784-TGCsqLryKJ2R.jpg",
  "year": 2009,
  "al": ["Evangelion: 2.0 You Can (Not) Advance", "ヱヴァンゲリヲン新劇場版:破", "Rebuild of Evangelion 2.22", "EVANGELION:2.22 VOCÊ (NÃO) PODE AVANÇAR", "EVANGELION:2.22 (NO) PUEDES AVANZAR", "Evangelion 2.22 (Nie) możesz iść naprzód"],
  "r": 596
 },
 {
  "id": 6033,
  "name": "Dragon Ball Kai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6033-TKDWyjZN3dXk.png",
  "year": 2009,
  "al": ["Dragon Ball Z Kai", "ドラゴンボール改", "Dragonball Kai", "DBK", "DB Kai", "DBZ Kai", "Драконий жемчуг Кай"],
  "r": 597
 },
 {
  "id": 172420,
  "name": "Uma Musume: Pretty Derby - Shin Jidai no Tobira",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx172420-4LjhmwpNMHti.jpg",
  "year": 2024,
  "al": ["Umamusume: Pretty Derby - Beginning of a New Era", "ウマ娘 プリティーダービー 新時代の扉", "Uma Musume: Pretty Derby Movie", "劇場版 ウマ娘 プリティーダービー", "ウマ娘 プリティーダービー BEGINNING OF A NEW ERA"],
  "r": 598
 },
 {
  "id": 21595,
  "name": "Sakamoto desu ga?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21595-vQ658r2Roe1g.jpg",
  "year": 2016,
  "al": ["Haven't You Heard? I'm Sakamoto", "坂本ですが?", "Sakamoto, pour vous servir !", "เทพศาสตร์ซากาโมโต้", "Gak Pernah Dengar Nama Aku Sakamoto?", "Soy Sakamoto, ¿por?"],
  "r": 599
 },
 {
  "id": 481,
  "name": "Yu☆Gi☆Oh! Duel Monsters",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx481-Qpqy1TQBOxZO.png",
  "year": 2000,
  "al": ["Yu-Gi-Oh!", "遊☆戯☆王　デュエルモンスターズ", "Yugioh", "Yu-Gi-Oh!: Duel Monsters", "Yugioh: Duel Monsters", "遊戲王－怪獸之決鬥"],
  "r": 600
 },
 {
  "id": 111734,
  "name": "Given Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx111734-82sWJBotlzE8.png",
  "year": 2020,
  "al": ["Given The Movie", "映画 ギヴン"],
  "r": 601
 },
 {
  "id": 124858,
  "name": "Yuukoku no Moriarty Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx124858-96RtyVSgUYnm.jpg",
  "year": 2021,
  "al": ["Moriarty the Patriot Part 2", "憂国のモリアーティ2クール", "มอริอาร์ตี้ผู้รักชาติ Part 2"],
  "r": 602
 },
 {
  "id": 141821,
  "name": "Mato Seihei no Slave",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx141821-lkVTjKqL4BU2.jpg",
  "year": 2024,
  "al": ["Chained Soldier", "魔都精兵のスレイブ", "Slave of the Magic Capital's Elite Troops", "Demon Slave", "Slave of the Hell Soldiers", "ทาสสุดแกร่งแห่งหน่วยป้องกันอสูร", "Mabotai", "Demon Slave: The Chained Soldier"],
  "r": 603
 },
 {
  "id": 168374,
  "name": "Loop 7-kaime no Akuyaku Reijou wa, Moto Tekikoku de Jiyuu Kimama na Hanayome Seikatsu wo Mankitsu Suru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx168374-WAEBeVAegRnw.jpg",
  "year": 2024,
  "al": ["7th Time Loop: The Villainess Enjoys a Carefree Life Married to Her Worst Enemy!", "ループ7回目の悪役令嬢は、元敵国で自由気ままな花嫁生活を満喫する", "ชีวิตลูปที่ 7 ของนางร้าย ขอเป็นเจ้าสาวนอนกลิ้งสบายในแดนอดีตศัตรู", "Седьмая беззаботная жизнь злодейки в браке со злейшим врагом", "LoopNana", "ルプなな", "輪迴七次的惡役千金，在前敵國享受隨心所欲的新婚生活"],
  "r": 604
 },
 {
  "id": 103302,
  "name": "Kono Oto Tomare!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx103302-RVGwGRDGdMQq.jpg",
  "year": 2019,
  "al": ["Kono Oto Tomare!: Sounds of Life", "この音とまれ！", "Stop at this Sound!", "ฝากฝันไว้ที่เสียงโคโตะ!"],
  "r": 605
 },
 {
  "id": 8129,
  "name": "Kuragehime",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx8129-VasAsXbiixR1.jpg",
  "year": 2010,
  "al": ["Princess Jellyfish", "海月姫", "Princesa Água Viva"],
  "r": 606
 },
 {
  "id": 21093,
  "name": "Monster Musume no Iru Nichijou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21093-fVFDznAnJZmL.png",
  "year": 2015,
  "al": ["Monster Musume: Everyday Life With Monster Girls", "モンスター娘のいる日常", "MonMusu", "Die Monster Mädchen", "บันทึกอุ่นรักสาวมอนสเตอร์"],
  "r": 607
 },
 {
  "id": 145665,
  "name": "NieR:Automata Ver1.1a",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx145665-Qs53Mta5ngqs.jpg",
  "year": 2023,
  "al": ["ニーア オートマタ", "NieR Automata Ver1.1a", "Giải Cứu Địa Cầu"],
  "r": 608
 },
 {
  "id": 97888,
  "name": "Baki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97888-tdZ1r7qN1DRs.jpg",
  "year": 2018,
  "al": ["バキ", "Baki - O Campeão", "Баки", "Μπάκι"],
  "r": 609
 },
 {
  "id": 100876,
  "name": "Kakegurui ××",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100876-RfvmpW1B8bDQ.png",
  "year": 2019,
  "al": ["Kakegurui xx", "賭ケグルイ××", "Kakegurui - Compulsive Gambler 2", "โคตรเซียนโรงเรียนพนัน  ภาค 2"],
  "r": 610
 },
 {
  "id": 543,
  "name": "Vampire Hunter D (2000)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx543-MAeWIDl4TwuG.png",
  "year": 2000,
  "al": ["Vampire Hunter D: Bloodlust", "バンパイアハンターD", "Bloodlust", "Vampire Hunter D: Żądza krwi", "D: охотник на вампиров: Жажда крови"],
  "r": 611
 },
 {
  "id": 552,
  "name": "Digimon Adventure",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx552-zad0ts5hylQJ.jpg",
  "year": 1999,
  "al": ["Digimon: Digital Monsters", "デジモンアドベンチャー", "Digimon Adventure 01"],
  "r": 612
 },
 {
  "id": 170130,
  "name": "Lv2 Kara Cheat datta Moto Yuusha Kouho no Mattari Isekai Life",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170130-tvhn13WYQ2qM.jpg",
  "year": 2024,
  "al": ["Chillin' in Another World with Level 2 Super Cheat Powers", "Lv2からチートだった元勇者候補のまったり異世界ライフ", "Chillin Different World Life of the Ex-Brave Candidate Was Cheat from Lv2", "Cuộc sống thảnh thơi tại dị giới gian lận của cựu ứng viên dũng giả từ cấp độ hai", "Беззаботная жизнь в ином мире с читерскими способностями со второго уровня"],
  "r": 613
 },
 {
  "id": 45,
  "name": "Rurouni Kenshin: Meiji Kenkaku Romantan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx45-DEFgZRCxiGmF.png",
  "year": 1996,
  "al": ["Rurouni Kenshin", "るろうに剣心 -明治剣客浪漫譚-", "Samurai X", "Rurouni Kenshin: Meiji Swordsman Romantic Story", "ซามูไรพเนจร", "Kenshin - Samurai vagabondo", "Lãng khách Kenshin", "רורואוני קנשין"],
  "r": 614
 },
 {
  "id": 356,
  "name": "Fate/stay night",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx356-mTpMvtillumS.png",
  "year": 2006,
  "al": ["フェイト/ステイナイト", "Судьба/Ночь схватки"],
  "r": 615
 },
 {
  "id": 101281,
  "name": "Carole & Tuesday",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101281-s1UoXUaYXhxn.jpg",
  "year": 2019,
  "al": ["キャロル＆チューズデイ", "C&T", "Carole y Tuesday", "عشق الموسيقى", "แครอลกับทูสเดย์"],
  "r": 616
 },
 {
  "id": 17729,
  "name": "Grisaia no Kajitsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx17729-Xhgile3kCpqB.jpg",
  "year": 2014,
  "al": ["The Fruit of Grisaia", "グリザイアの果実", "Le Fruit De La Grisaia"],
  "r": 617
 },
 {
  "id": 117612,
  "name": "Genjitsu Shugi Yuusha no Oukoku Saikenki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx117612-MCbAaq2ypJlp.jpg",
  "year": 2021,
  "al": ["How a Realist Hero Rebuilt the Kingdom", "現実主義勇者の王国再建記", "Genjitsushugisha no Oukokukaizouki", "A Realist's Kingdom Reform Chronicles", "Genkoku", "ยุทธศาสตร์กู้ชาติของราชามือใหม่"],
  "r": 618
 },
 {
  "id": 180516,
  "name": "Uma Musume: Cinderella Gray",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx180516-lebpoKLkw6E3.jpg",
  "year": 2025,
  "al": ["Umamusume: Cinderella Gray", "ウマ娘 シンデレラグレイ"],
  "r": 619
 },
 {
  "id": 177937,
  "name": "SPY×FAMILY Season 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx177937-Tzgg6rAdhCoH.jpg",
  "year": 2025,
  "al": ["SPY x FAMILY Season 3", "SxF 3", "スパイファミリー 3", "SPY×FAMILY ซีซั่น 3", "SPY×FAMILY 間諜家家酒 Season 3", "間諜家家酒 Season 3"],
  "r": 620
 },
 {
  "id": 97980,
  "name": "Re:CREATORS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97980-9NQwPW0igSMk.jpg",
  "year": 2017,
  "al": ["レクリエイターズ", "Re:CRIADORES"],
  "r": 621
 },
 {
  "id": 156415,
  "name": "Tensei Shitara Dai Nana Ouji Datta node, Kimamani Majutsu wo Kiwamemasu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx156415-zwP9deA786S1.jpg",
  "year": 2024,
  "al": ["I Was Reincarnated as the 7th Prince so I Can Take My Time Perfecting My Magical Ability", "転生したら第七王子だったので、気ままに魔術を極めます", "พอได้เกิดใหม่เป็นองค์ชายลำดับที่เจ็ด ก็เพื่อเรียนเวทย์ให้สนุก", "Dainanaoji", "轉生為第七王子，隨心所欲的魔法學習之路", "Я перевоплотился в седьмого принца, так что буду совершенствовать свою магию как захочу", "Bereinkarnasi Malah Menjadi Pangeran Ketujuh, jadi Aku Bisa Menyempurnakan Kemampuan Sihirku Sepuasnya"],
  "r": 622
 },
 {
  "id": 416,
  "name": "Kurenai no Buta",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx416-oO8Tts2dQtuv.jpg",
  "year": 1992,
  "al": ["Porco Rosso", "紅の豚", "The Scarlet Pig", "Szkarłatny pilot", "På Flygande Uppdrag", "Punainen Sika", "På flyvende oppdrag", "Porco Rosso: O Último Herói Romântico"],
  "r": 623
 },
 {
  "id": 115113,
  "name": "Uzaki-chan wa Asobitai!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx115113-bJDZV7kP0XrP.png",
  "year": 2020,
  "al": ["Uzaki-chan Wants to Hang Out!", "宇崎ちゃんは遊びたい！", "宇崎学妹想要玩！", "รุ่นน้องตัวป่วน อยากชวนเที่ยวเล่น"],
  "r": 624
 },
 {
  "id": 18689,
  "name": "Diamond no Ace",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx18689-LRIiRcgTJS1f.jpg",
  "year": 2013,
  "al": ["Ace of the Diamond", "ダイヤのA", "Daiya no Ace", "Ace of Diamond", "Daiya no A"],
  "r": 625
 },
 {
  "id": 127399,
  "name": "Shuumatsu no Valkyrie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx127399-AAH1pevCZLrB.jpg",
  "year": 2021,
  "al": ["Record of Ragnarok", "終末のワルキューレ", "Shuumatsu no Walkure", "معركة راغناروك", "Valkyrie Apocalypse", "มหาศึกคนชนเทพ", "Повесть о конце света", "Τα Χρονικά του Ράγκναροκ"],
  "r": 626
 },
 {
  "id": 21123,
  "name": "DRIFTERS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21123-bCuqm8wLDqOw.png",
  "year": 2016,
  "al": [],
  "r": 627
 },
 {
  "id": 18671,
  "name": "Chuunibyou demo Koi ga Shitai! Ren",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx18671-RVIY9TGd737H.jpg",
  "year": 2014,
  "al": ["Love, Chunibyo & Other Delusions - Heart Throb -", "中二病でも恋がしたい！戀", "Chuunibyou demo Koi ga Shitai! 2", "Miłość, gimbaza i kosmiczna faza: Porywy serca"],
  "r": 628
 },
 {
  "id": 4282,
  "name": "Kara no Kyoukai: Mujun Rasen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx4282-R19YmET0glSZ.jpg",
  "year": 2008,
  "al": ["the Garden of sinners Chapter 5: Paradox Paradigm", "空の境界 矛盾螺旋"],
  "r": 629
 },
 {
  "id": 20555,
  "name": "Omoide no Marnie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20555-QGbWQC3Kfpok.jpg",
  "year": 2014,
  "al": ["When Marnie Was There", "思い出のマーニー", "Souvenirs de Marnie", "Quando c'era Marnie", "Erinnerungen an Marnie", "El Recuerdo de Marnie", "Marnie - min hemmelige venninne", "När Marnie var där"],
  "r": 630
 },
 {
  "id": 100723,
  "name": "Boku no Hero Academia THE MOVIE: Futari no Hero",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100723-7f5e1BCTCDoB.jpg",
  "year": 2018,
  "al": ["My Hero Academia: Two Heroes", "僕のヒーローアカデミア THE MOVIE 〜2人の英雄〜", "My Hero Academia the Movie", "我的英雄学院 ～两位英雄～", "มายฮีโร่ อคาเดเมีย กำเนิดใหม่ 2 วีรบุรุษ"],
  "r": 631
 },
 {
  "id": 172019,
  "name": "Dr. STONE: SCIENCE FUTURE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx172019-3cfZbrYBmV23.jpg",
  "year": 2025,
  "al": ["Dr. STONE SCIENCE FUTURE", "Dr.STONE SCIENCE FUTURE", "Dr.STONE Season 4", "Dr.STONE 第4期", "ドクターストーン"],
  "r": 632
 },
 {
  "id": 139274,
  "name": "Kidou Senshi Gundam: Suisei no Majo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139274-0NJTOKWHdDew.png",
  "year": 2022,
  "al": ["Mobile Suit Gundam: The Witch from Mercury", "機動戦士ガンダム 水星の魔女", "G-Witch", "Mobile Suit Gundam: Penyihir dari Mercury", "機動戰士鋼彈 水星的魔女", "Мобильный воин Гандам: Ведьма с Меркурия", "โมบิลสูทกันดั้ม แม่มดจากดาวพุธ"],
  "r": 633
 },
 {
  "id": 146210,
  "name": "Kinsou no Vermeil: Gakeppuchi Majutsushi wa Saikyou no Yakusai to Mahou Sekai wo Tsukisusumu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx146210-ZnIithxFLLHn.jpg",
  "year": 2022,
  "al": ["Vermeil in Gold", "金装のヴェルメイユ～崖っぷち魔術師は最強の厄災と魔法世界を突き進む～", "Vermeil in Gold: A Desperate Magician Barges Into the Magical World Alongside the Strongest Calamity", "เวอร์มีลแห่งเวทสีทอง: นักอาคมหวิดซิ่วกับอสูรรับใช้สุดแกร่งบุกตะลุยโลกเวทมนตร์", "Vermeil in Gold - Il mago a rischio bocciatura e la calamità più forte si fanno strada nel mondo della magia"],
  "r": 634
 },
 {
  "id": 109963,
  "name": "Shokugeki no Souma: Shin no Sara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx109963-t8E9axH0Dvrn.jpg",
  "year": 2019,
  "al": ["Food Wars! The Fourth Plate", "食戟のソーマ 神ノ皿", "食戟之灵：神之皿", "ยอดนักปรุงโซมะ ภาค 4"],
  "r": 635
 },
 {
  "id": 1818,
  "name": "CLAYMORE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1818-KieLJv0qo3mO.jpg",
  "year": 2007,
  "al": ["クレイモア"],
  "r": 636
 },
 {
  "id": 20981,
  "name": "Bakemono no Ko",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20981-D6PAJAOC4jPc.jpg",
  "year": 2015,
  "al": ["The Boy and the Beast", "バケモノの子", "El niño y la bestia", "O Rapaz e o Monstro", "El nen i la bèstia", "Учень чудовиська", "Ученик чудовища", "Berniukas ir Pabaisa"],
  "r": 637
 },
 {
  "id": 113024,
  "name": "Shoujo☆Kageki Revue Starlight Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113024-OdzOh0OKFPTN.png",
  "year": 2021,
  "al": ["Revue Starlight: The Movie", "劇場版 少女☆歌劇 レヴュースタァライト"],
  "r": 638
 },
 {
  "id": 104052,
  "name": "Hoshiai no Sora",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104052-vjxtx7LJiTgb.jpg",
  "year": 2019,
  "al": ["Stars Align", "星合の空", "Star-Crossing Skies"],
  "r": 639
 },
 {
  "id": 4654,
  "name": "Toaru Majutsu no Index",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx4654-ba44icsxDQZd.jpg",
  "year": 2008,
  "al": ["A Certain Magical Index", "とある魔術の禁書目録", "Toaru Majutsu no Kinsho Mokuroku", "אינדקס הקסומה", "魔法禁书目录", "فهرس السحر", "อินเดกซ์คัมภีร์คาถาต้องห้าม", "Cấm thư ma thuật Index"],
  "r": 640
 },
 {
  "id": 14289,
  "name": "Sukitte Ii na yo.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx14289-vRTzC8u4XuvW.png",
  "year": 2012,
  "al": ["Say \"I love you\".", "好きっていいなよ。", "Sukinayo"],
  "r": 641
 },
 {
  "id": 125038,
  "name": "Shadows House",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx125038-BCfEvry0QBXW.png",
  "year": 2021,
  "al": ["シャドーハウス", "Shadow House", "影之宅", "影宅", "Dinh Thự Bóng"],
  "r": 642
 },
 {
  "id": 97994,
  "name": "Blend S",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97994-JZ1rLkJBcO8V.png",
  "year": 2017,
  "al": ["BLEND-S", "ブレンド・S", "調教咖啡廳"],
  "r": 643
 },
 {
  "id": 166617,
  "name": "Fate/strange Fake",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx166617-34fpC9y47tTx.png",
  "year": 2026,
  "al": ["Судьба/Странная подделка"],
  "r": 644
 },
 {
  "id": 129196,
  "name": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka IV: Shin Shou Meikyuu-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx129196-eFVs05hMbVSm.jpg",
  "year": 2022,
  "al": ["Is It Wrong to Try to Pick Up Girls in a Dungeon? IV", "ダンジョンに出会いを求めるのは間違っているだろうかⅣ 新章 迷宮篇", "มันผิดรึไงถ้าใจอยากจะพบรักในดันเจี้ยน ภาค 4", "Danmachi IV", "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka 4th Season", "Is It Wrong to Try to Pick Up Girls in a Dungeon? Season 4", "Liệu Có Sai Lầm Khi Tìm Kiếm Cuộc Gặp Gỡ Định Mệnh Trong Hầm Ngục? IV: Chương Mới Phần Mê Cung", "ダンまちⅣ"],
  "r": 645
 },
 {
  "id": 7711,
  "name": "Karigurashi no Arrietty",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx7711-IDDzqp6d3tQz.jpg",
  "year": 2010,
  "al": ["The Secret World of Arrietty", "借りぐらしのアリエッティ", "Karigurashi no Arrietti", "The Borrower Arrietty", "Arrietty: Le Petit Monde des Chapardeurs", "Arrietty y el Mundo de los Diminutos", "O Mundo dos Pequeninos", "Arrietty"],
  "r": 646
 },
 {
  "id": 3785,
  "name": "Evangelion Shin Movie: Kyuu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx3785-a28lDzqtlfjB.png",
  "year": 2012,
  "al": ["Evangelion: 3.0 You Can (Not) Redo", "ヱヴァンゲリヲン新劇場版:Q", "Rebuild of Evangelion 3.33", "Rebuild of Evangelion 3.0 Q Quickening", "EVANGELION:3.33 VOCÊ (NÃO) PODE REFAZER", "EVANGELION: 3.33 TÚ (NO) LO PUEDES REHACER", "Evangelion 3.33 (Nie) możesz powtórzyć"],
  "r": 647
 },
 {
  "id": 5681,
  "name": "Summer Wars",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5681-3DmxUVn3grD0.jpg",
  "year": 2009,
  "al": ["サマーウォーズ", "Guerras de Verão", "Cuộc Chiến Mùa Hè"],
  "r": 648
 },
 {
  "id": 98005,
  "name": "Ballroom e Youkoso",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98005-kwoBQIEeXa8J.png",
  "year": 2017,
  "al": ["Welcome to the Ballroom", "ボールルームへようこそ"],
  "r": 649
 },
 {
  "id": 137281,
  "name": "Aharen-san wa Hakarenai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx137281-i4UHcGkUi7j6.jpg",
  "year": 2022,
  "al": ["阿波連さんははかれない", "Aharen Is Indecipherable", "Aharen Is Unfathomable"],
  "r": 650
 },
 {
  "id": 21733,
  "name": "Shouwa Genroku Rakugo Shinjuu: Sukeroku Futatabi-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx21733-SUV6bCTsU51u.png",
  "year": 2017,
  "al": ["Descending Stories: Showa Genroku Rakugo Shinju", "昭和元禄落語心中～助六再び篇～", "Le Rakugo ou la vie 2", "Shouwa Genroku Rakugo Shinjuu 2nd Season"],
  "r": 651
 },
 {
  "id": 109731,
  "name": "Hibike! Euphonium 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx109731-EwHzbtywdcyG.png",
  "year": 2024,
  "al": ["Sound! Euphonium 3", "響け！ユーフォニアム３", "響け! ユーフォニアム 久美子3年生編", "Hibike! Euphonium: Kumiko 3 Nensei-hen", "Résonne ! Euphonium"],
  "r": 652
 },
 {
  "id": 148969,
  "name": "Kubo-san wa Mob wo Yurusanai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx148969-3vPgXpMpQvba.jpg",
  "year": 2023,
  "al": ["Kubo Won't Let Me Be Invisible", "久保さんは僕を許さない", "Kubo Tidak Akan Membiarkanku Tak Terlihat", "คุณคุโบะไม่ยอมให้ผมเป็นตัวประกอบ", "Kubo Không Để Tôi Hết Cứu"],
  "r": 653
 },
 {
  "id": 97767,
  "name": "High School DxD HERO",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx97767-5PcDorQe0h8w.jpg",
  "year": 2018,
  "al": ["ハイスクールD×D HERO", "High School DxD 4", "Highschool DxD 4"],
  "r": 654
 },
 {
  "id": 20457,
  "name": "Black Bullet",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20457-ftrNiYhZzgoY.jpg",
  "year": 2014,
  "al": ["ブラック・ブレット", "แบล็ค บุลเลท", "黑色子彈"],
  "r": 655
 },
 {
  "id": 21878,
  "name": "Gabriel Dropout",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21878-rfzDjP2gjxGR.jpg",
  "year": 2017,
  "al": ["ガヴリールドロップアウト", "GabDro", "珈百璃的堕落"],
  "r": 656
 },
 {
  "id": 112802,
  "name": "Uramichi Oniisan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112802-FUNqgb2R1LS8.jpg",
  "year": 2021,
  "al": ["Life Lessons with Uramichi Oniisan", "うらみちお兄さん", "อูรามิจิ โอนีซัง"],
  "r": 657
 },
 {
  "id": 16870,
  "name": "THE LAST: NARUTO THE MOVIE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16870-BD4K9rzlhCP4.jpg",
  "year": 2014,
  "al": ["THE LAST -NARUTO THE MOVIE-", "Naruto Movie 10", "Naruto Shippuden Movie 07: The Last"],
  "r": 658
 },
 {
  "id": 237,
  "name": "Koukyoushihen Eureka Seven",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx237-P1YEQQFqZ1An.jpg",
  "year": 2005,
  "al": ["Eureka Seven", "交響詩篇エウレカセブン", "E7", "Eureka 7", "Eureka Seven Psalms of Planets", "Psalms of Planets Eureka Seven"],
  "r": 659
 },
 {
  "id": 105018,
  "name": "Kimi to, Nami ni Noretara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105018-XM7rFyryltjb.jpg",
  "year": 2019,
  "al": ["Ride Your Wave", "きみと、波にのれたら", "El amor está en el agua", "Піймай свою хвилю", "На твоей волне", "Mėgaukis savo banga", "Uz tava viļņa", "Сенің толқыныңда"],
  "r": 660
 },
 {
  "id": 112608,
  "name": "Slime Taoshite 300-nen, Shiranai Uchi ni Level MAX ni Nattemashita",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112608-T3OKdLhxYUfe.png",
  "year": 2021,
  "al": ["I've Been Killing Slimes for 300 Years and Maxed Out My Level", "スライム倒して300年、知らないうちにレベルMAXになってました", "Slime 300", "打了300年的史莱姆，不知不觉就练到了满级", "La Sorcière invincible tueuse de Slime depuis 300 ans", "ล่าสไลม์มา 300 ปีรู้ตัวอีกทีก็เลเวล MAX ซะแล้ว", "Tanpa Sadar Levelku Mentok Setelah Membasmi Slime Selama 300 Tahun", "Я 300 лет убивала слизь и прокачалась на максимум"],
  "r": 661
 },
 {
  "id": 132474,
  "name": "Gaikotsu Kishi-sama, Tadaima Isekai e Odekakechuu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx132474-J2ECHSPkfb9g.jpg",
  "year": 2022,
  "al": ["Skeleton Knight in Another World", "骸骨騎士様、只今異世界へお出掛け中", "บันทึกการเดินทางต่างโลกของท่านอัศวินกระดูก", "Kesatria Tengkorak Berkelana di Dunia Lain", "Hiệp Sĩ Xương Trên Đường Du Hành Đến Thế Giới Khác"],
  "r": 662
 },
 {
  "id": 113311,
  "name": "Kakushigoto",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113311-6bSvvCHBpjpI.jpg",
  "year": 2020,
  "al": ["かくしごと", "ความลับของคุณพ่อเลี้ยงเดี่ยว", "Тайная работа Какуси Гото"],
  "r": 663
 },
 {
  "id": 101168,
  "name": "Plunderer",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101168-LY3XA61byAVo.jpg",
  "year": 2020,
  "al": ["プランダラ"],
  "r": 664
 },
 {
  "id": 107912,
  "name": "Cike Wu Liuqi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107912-pLrOL1AzEIEt.jpg",
  "year": 2018,
  "al": ["Scissor Seven", "刺客伍六七", "Cike WuLiuqi", "Ci Ke Wu Liu Qi", "Assassin Seven", "刺客伍六七 第一季", "Killer Seven", "Scissor 7"],
  "r": 665
 },
 {
  "id": 131680,
  "name": "Black Clover: Mahou Tei no Ken",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131680-gjs8mMQPmkOQ.png",
  "year": 2023,
  "al": ["Black Clover: Sword of the Wizard King", "ブラッククローバー 魔法帝の剣", "Black Clover Movie", "Чорна конюшина: Меч короля магів", "Black Clover: A Espada do Rei Mago", "Black Clover: La espada del rey mago", "Черный клевер: Меч короля магов"],
  "r": 666
 },
 {
  "id": 114194,
  "name": "BEASTARS 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114194-uMuA92X6JHSj.jpg",
  "year": 2021,
  "al": ["BEASTARS Season 2", "BEASTARS 第2期", "บีสตาร์ ภาค 2", "Выдающиеся звери 2", "ビースターズ 2"],
  "r": 667
 },
 {
  "id": 21499,
  "name": "Sousei no Onmyouji",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21499-JCxvIXc27mVT.jpg",
  "year": 2016,
  "al": ["Twin Star Exorcists", "双星の陰陽師", "ทวิดารา มหาองเมียวจิ"],
  "r": 668
 },
 {
  "id": 130588,
  "name": "Maou Gakuin no Futekigousha: Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e Kayou II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx130588-zYz8Gp2kZfTm.jpg",
  "year": 2023,
  "al": ["The Misfit of Demon King Academy Ⅱ: History's Strongest Demon King Reincarnates and Goes to School with His Descendants", "魔王学院の不適合者 ～史上最強の魔王の始祖、転生して子孫たちの学校へ通う～ Ⅱ", "The Misfit of Demon King Academy II", "The Misfit of Demon King Academy: History’s Strongest Demon King Reincarnates and Goes to School with His Descendants Season 2", "ใครว่าข้าไม่เหมาะเป็นจอมมาร: ต้นตระกูลจอมมารที่เเกร่งที่สุดในประวัติศาสตร์เกิดใหม่ไปเรียนที่โรงเรียนลูกหลาน ภาค 2", "Непригодный для Академии владыки тьмы II"],
  "r": 669
 },
 {
  "id": 149118,
  "name": "Enen no Shouboutai: San no Shou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx149118-AOQb0xuTssGl.jpg",
  "year": 2025,
  "al": ["Fire Force Season 3", "炎炎ノ消防隊 参ノ章", "Enen no Shouboutai 3rd Season", "หน่วยผจญคนไฟลุก ภาค 3"],
  "r": 670
 },
 {
  "id": 112443,
  "name": "Jaku-Chara Tomozaki-kun",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112443-UVB1oKdblsIx.jpg",
  "year": 2021,
  "al": ["Bottom-Tier Character Tomozaki", "弱キャラ友崎くん", "เกมพลิกโฉมนายกระจอก", "Низкоуровневый Томодзаки"],
  "r": 671
 },
 {
  "id": 98491,
  "name": "Isekai wa Smartphone to Tomo ni.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx98491-5vyX89aabiHz.jpg",
  "year": 2017,
  "al": ["In Another World With My Smartphone", "異世界はスマートフォンとともに。", "IseSuma", "ไปต่างโลก! ก็ต้องไปกับสมาร์ทโฟนสิ!!!", "帶著智慧型手機闖蕩異世界。"],
  "r": 672
 },
 {
  "id": 2921,
  "name": "Ashita no Joe 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2921-PxFepBRCGD0K.jpg",
  "year": 1980,
  "al": ["Tomorrow's Joe 2", "あしたのジョー２", "Rocky Joe 2", "Champion Joe 2"],
  "r": 673
 },
 {
  "id": 120,
  "name": "Fruits Basket",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx120-Z5i1sw1xboQP.jpg",
  "year": 2001,
  "al": ["フルーツバスケット", "Furuba", "Fruba", "フルバ"],
  "r": 674
 },
 {
  "id": 111322,
  "name": "Tate no Yuusha no Nariagari Season 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx111322-2jQMDQva4YD7.png",
  "year": 2023,
  "al": ["The Rising of the Shield Hero Season 3", "盾の勇者の成り上がり Season 3", "ผู้กล้าโล่ผงาด ภาค 3"],
  "r": 675
 },
 {
  "id": 1519,
  "name": "BLACK LAGOON: The Second Barrage",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1519-cScqJxQW3LNL.png",
  "year": 2006,
  "al": ["BLACK LAGOON The Second Barrage", "Black Lagoon 2nd Season", "Black Lagoon Second Season", "ブラックラグーン The Second Barrage"],
  "r": 676
 },
 {
  "id": 108241,
  "name": "Gleipnir",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108241-Mc28QvkdUkfp.jpg",
  "year": 2020,
  "al": ["グレイプニル", "格莱普尼尔"],
  "r": 677
 },
 {
  "id": 98035,
  "name": "Fate/Apocrypha",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98035-rdkjeqUUsG2j.jpg",
  "year": 2017,
  "al": ["פייט/אפוקריפה", "Судьба/Апокриф"],
  "r": 678
 },
 {
  "id": 117343,
  "name": "Munou na Nana",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx117343-NgCLZTaxallv.jpg",
  "year": 2020,
  "al": ["Talentless Nana", "無能なナナ"],
  "r": 679
 },
 {
  "id": 199221,
  "name": "Dr. STONE: SCIENCE FUTURE Part 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx199221-TReDQMNhslHu.jpg",
  "year": 2026,
  "al": ["Dr. STONE SCIENCE FUTURE Cour 3", "Dr.STONE SCIENCE FUTURE 3クール", "Dr.STONE Season 4 Part 3", "ドクターストーン"],
  "r": 680
 },
 {
  "id": 145,
  "name": "Kareshi Kanojo no Jijou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx145-vcSv07afgy6c.png",
  "year": 1998,
  "al": ["His and Her Circumstances", "彼氏彼女の事情", "Kare Kano", "Karekano", "Tales at North Hills High", "Entre elle et lui", "Le situazioni di Lui & Lei", "他和她的故事"],
  "r": 681
 },
 {
  "id": 9656,
  "name": "Kimi ni Todoke 2ND SEASON",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx9656-vckh2wNj3FwY.jpg",
  "year": 2011,
  "al": ["Kimi ni Todoke: From Me to You Season 2", "君に届け 2ND SEASON", "Reaching You 2nd Season", "Llegando a ti: Temporada 2"],
  "r": 682
 },
 {
  "id": 20602,
  "name": "Amagi Brilliant Park",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20602-f6CfipBF44kV.png",
  "year": 2014,
  "al": ["甘城ブリリアントパーク", "Amaburi", "甘ブリ", "Cudowny park Amagi"],
  "r": 683
 },
 {
  "id": 225,
  "name": "Dragon Ball GT",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx225-pzkDUVy7tKxH.png",
  "year": 1996,
  "al": ["ドラゴンボールGT", "DBGT", "Драконий жемчуг БП"],
  "r": 684
 },
 {
  "id": 20729,
  "name": "World Trigger",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20729-DnBXnUxFon1B.png",
  "year": 2014,
  "al": ["ワールドトリガー", "Импульс мира"],
  "r": 685
 },
 {
  "id": 103275,
  "name": "Fate/Grand Order: Zettai Majuu Sensen Babylonia",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx103275-SN0wwshS3tWA.jpg",
  "year": 2019,
  "al": ["Fate/Grand Order Absolute Demonic Front: Babylonia", "Fate/Grand Order -絶対魔獣戦線バビロニア-", "FGO: Babylonia", "フェイト/グランドオーダー -絶対魔獣戦線バビロニア-", "Судьба/Великий приказ: Вавилония"],
  "r": 686
 },
 {
  "id": 101310,
  "name": "Kishuku Gakkou no Juliet",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx101310-w1PLPsyg0XHr.jpg",
  "year": 2018,
  "al": ["Boarding School Juliet", "寄宿学校のジュリエット", "To LOVE, or not to LOVE", "JULIET NO INTERNATO", "รักลับๆ ข้ามหอของนายหมากับน้องแมว", "Juliet en el internado"],
  "r": 687
 },
 {
  "id": 172258,
  "name": "Kimi no Koto ga Dai Dai Dai Dai Daisuki na 100-nin no Kanojo 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx172258-n23TSWk54aXv.jpg",
  "year": 2025,
  "al": ["The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You Season 2", "君のことが大大大大大好きな100人の彼女 第2期", "100 Kanojo 2", "100Kano 2", "Hyakkano 2"],
  "r": 688
 },
 {
  "id": 98635,
  "name": "ReLIFE: Kanketsu-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98635-U7XClVuynqfY.png",
  "year": 2018,
  "al": ["ReLIFE: Final Arc", "ReLIFE 完結編", "ReLIFE OVA", "Повторная жизнь ОВА"],
  "r": 689
 },
 {
  "id": 9513,
  "name": "Beelzebub",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx9513-is6YiSgKbyQX.jpg",
  "year": 2011,
  "al": ["べるぜバブ"],
  "r": 690
 },
 {
  "id": 11577,
  "name": "Steins;Gate: Fuka Ryouiki no Déjà vu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11577-rhqsxLOAge4f.png",
  "year": 2013,
  "al": ["Steins;Gate The Movie – Load Region of Déjà Vu", "劇場版 シュタインズゲート 負荷領域のデジャヴ"],
  "r": 691
 },
 {
  "id": 99726,
  "name": "Net-juu no Susume",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99726-tta6v7TKGYKa.jpg",
  "year": 2017,
  "al": ["Recovery of an MMO Junkie", "ネト充のススメ", "Neto-juu no Susume", "Netojuu no Susume", "Recommendation of the Wonderful Virtual Life", "Recommendation of The Internet Enhancement", "Netoju"],
  "r": 692
 },
 {
  "id": 139589,
  "name": "Kotarou wa Hitorigurashi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139589-oFz7JwpwRkQV.png",
  "year": 2022,
  "al": ["Kotaro Lives Alone", "コタローは１人暮らし", "Kotaro vive solo", "โคทาโร่อยู่คนเดียว", "Kotaro En Solo", "Ο Κόταρο Ζει Μόνος του", "Kotaro Vai Morar Sozinho", "Kotaro abita da solo"],
  "r": 693
 },
 {
  "id": 97832,
  "name": "citrus",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97832-uMSoHPCn5BnJ.png",
  "year": 2018,
  "al": ["Цитрус"],
  "r": 694
 },
 {
  "id": 158704,
  "name": "Watashi no Oshi wa Akuyaku Reijou.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx158704-sPOrTckSKzKO.jpg",
  "year": 2023,
  "al": ["I'm in Love with the Villainess", "私の推しは悪役令嬢。", "WataOshi", "わたおし", "ทำไงดีเกมนี้นางร้ายน่ารัก", "Me Enamoré de la Villana", "Me Apaixonei pela Vilã!", "Я влюблена в злодейку"],
  "r": 695
 },
 {
  "id": 98861,
  "name": "Quanzhi Gaoshou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98861-MMwQxW1S8WkF.jpg",
  "year": 2017,
  "al": ["The King's Avatar", "全职高手", "全職高手", "Full-Time Expert", "Master of Skills"],
  "r": 696
 },
 {
  "id": 125428,
  "name": "Tenkuu Shinpan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx125428-eXVYIlRnCOtB.jpg",
  "year": 2021,
  "al": ["High-Rise Invasion", "天空侵犯", "Sky-High Survival", "Tenku Shinpan - Sem Saída", "غزاة ناطحات السحاب", "หน้ากากเดนนรก", "Invasión en las Alturas"],
  "r": 697
 },
 {
  "id": 108617,
  "name": "Somali to Mori no Kamisama",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108617-PgoYLgWzzm0c.png",
  "year": 2020,
  "al": ["Somali and the Forest Spirit", "ソマリと森の神様", "Somari and the Guardian of the Forest", "Somali et l'esprit de la forêt"],
  "r": 698
 },
 {
  "id": 21455,
  "name": "NEW GAME!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21455-hTd6T0s9fvYj.jpg",
  "year": 2016,
  "al": ["Новая игра!"],
  "r": 699
 },
 {
  "id": 129190,
  "name": "Tensai Ouji no Akaji Kokka Saisei Jutsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx129190-UnaPbNhTCTOR.jpg",
  "year": 2022,
  "al": ["The Genius Prince's Guide to Raising a Nation Out of Debt", "天才王子の赤字国家再生術", "บูรณะมันวุ่นวาย ขายชาติเลยแล้วกัน", "天才王子的赤字国家振兴术", "Kiat Pemulihan Negara Berutang Ala Pangeran Genius"],
  "r": 700
 },
 {
  "id": 3701,
  "name": "Kaiba",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx3701-ooD3N9dD2rqa.jpg",
  "year": 2008,
  "al": ["カイバ"],
  "r": 701
 },
 {
  "id": 114085,
  "name": "Kemono Jihen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114085-2w5rYZTOa7ER.jpg",
  "year": 2021,
  "al": ["怪物事変", "けものじへん", "Monster Incidents", "Kemono Incidents", "คดีประหลาดคนปีศาจ"],
  "r": 702
 },
 {
  "id": 153800,
  "name": "One Punch Man 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153800-8SpzdHOaZCoU.jpg",
  "year": 2025,
  "al": ["One-Punch Man Season 3", "ワンパンマン３", "OPM3", "ون بنش مان 3", "رجل اللكمة الواحدة 3", "วันพันช์แมน ซีซั่น 3"],
  "r": 703
 },
 {
  "id": 21685,
  "name": "Eromanga Sensei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21685-h1SrcpaNnrIq.jpg",
  "year": 2017,
  "al": ["エロマンガ先生", "Ero Manga Sensei", "情色漫画老师", "น้องสาวของผมคืออาจารย์เอโรมังงะ", "埃罗芒阿老师"],
  "r": 704
 },
 {
  "id": 100183,
  "name": "Sword Art Online Alternative: Gun Gale Online",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx100183-v4S2sGAG3A24.jpg",
  "year": 2018,
  "al": ["ソードアート・オンライン オルタナティブ ガンゲイル・オンライン", "SAO Alternative: Gun Gale Online", "SAO GGO"],
  "r": 705
 },
 {
  "id": 8525,
  "name": "Kami nomi zo Shiru Sekai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx8525-chaE9kM2x0w4.png",
  "year": 2010,
  "al": ["The World God Only Knows", "神のみぞ知るセカイ", "Kaminomi", "Que sa volonté soit faite"],
  "r": 706
 },
 {
  "id": 170019,
  "name": "Otonari no Tenshi-sama ni Itsunomanika Dame Ningen ni Sareteita Ken 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170019-djbN0b934MhE.jpg",
  "year": 2026,
  "al": ["The Angel Next Door Spoils Me Rotten2", "お隣の天使様にいつの間にか駄目人間にされていた件 第2期", "The Angel Next Door Spoils Me Rotten Season 2", "ขาดคุณนางฟ้าข้างห้องไป ผมคงมีชีวิตต่อไปไม่ได้อีกแล้ว2", "Meu Anjo de Vizinha Me Mima Demais 2", "Chouchouté par l’ange d’à côté saison 2", "Ангел по соседству меня балует 2", "關於我在無意間被隔壁的天使變成廢柴這件事"],
  "r": 707
 },
 {
  "id": 178869,
  "name": "Clevatess: Majuu no Ou to Akago to Kabane no Yuusha",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178869-qiEz0gQD8H5N.png",
  "year": 2025,
  "al": ["Clevatess", "クレバテス-魔獣の王と赤子と屍の勇者-", "Clevatess: The King of Devil Beasts", "The Baby and the Brave of Undead", "เคลวาเทส อสูรจอมราชัน"],
  "r": 708
 },
 {
  "id": 100878,
  "name": "Youjo Senki Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100878-npKVJvggmK6a.jpg",
  "year": 2019,
  "al": ["Saga of Tanya the Evil - the Movie -", "劇場版 幼女戦記", "Колдунья в погонах. Фильм"],
  "r": 709
 },
 {
  "id": 175977,
  "name": "Shikanoko Nokonoko Koshitantan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx175977-kNNpCt8Z72uK.jpg",
  "year": 2024,
  "al": ["My Deer Friend Nokotan", "しかのこのこのここしたんたん", "Minha Amiga Nokotan é um Cervo", "Mi Amiga Nokotan es un Ciervo", "鹿乃子乃子虎视眈眈", "Nokotan in Cerva di Amici", "Моя подруга-олениха Нокотан", "Shikanoko i dziwne zdarzenia w klubie jelenia"],
  "r": 710
 },
 {
  "id": 44,
  "name": "Rurouni Kenshin: Meiji Kenkaku Romantan - Tsuioku-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx44-MG5I672UbWAy.png",
  "year": 1999,
  "al": ["Rurouni Kenshin OVA: Trust & Betrayal (Tsuioku-hen)", "るろうに剣心―明治剣客浪漫譚―追憶編", "Rurouni Kenshin: Tsuiokuhen", "Rurouni Kenshin: Reminiscence", "רורואוני קנשין: זיכרונות", "ซามูไรพเนจร ภาคกำเนิดเคนชิน", "Kenshin samurai vagabondo: Memorie del passato", "Lãng khách Kenshin: Truy tìm ký ức"],
  "r": 711
 },
 {
  "id": 141902,
  "name": "ONE PIECE FILM: RED",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx141902-fTyoTk8F8qOl.jpg",
  "year": 2022,
  "al": ["ONE PIECE FILM RED", "One Piece Film 15", "فيلم ون بيس: ريد", "วันพีซ ฟิล์ม เรด"],
  "r": 712
 },
 {
  "id": 178680,
  "name": "WIND BREAKER Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178680-nIAhCizY46ZU.jpg",
  "year": 2025,
  "al": ["WB 2", "ウィンブレ2", "WBK 2", "ウィンドブレイカー Season 2"],
  "r": 713
 },
 {
  "id": 20678,
  "name": "Shinmai Maou no Testament",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20678-58D9Yhi4GcH2.png",
  "year": 2015,
  "al": ["The Testament of Sister New Devil", "新妹魔王の契約者", "Shinmai Maou no Keiyakusha"],
  "r": 714
 },
 {
  "id": 101351,
  "name": "Happy Sugar Life",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101351-TWLbnRdE1tBI.jpg",
  "year": 2018,
  "al": ["ハッピーシュガーライフ", "White Sugar Garden, Black Salt Cage", "幸福甜蜜生活"],
  "r": 715
 },
 {
  "id": 949,
  "name": "Top wo Nerae! GunBuster",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx949-LDCFxDufSwTQ.png",
  "year": 1988,
  "al": ["Gunbuster", "トップをねらえ! GunBuster", "Top wo Nerae!", "Aim for the Top!", "Toppu o Nerae", "Punta al Top! Gunbuster"],
  "r": 716
 },
 {
  "id": 105914,
  "name": "Sewayaki Kitsune no Senko-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105914-WBCcucTOrU0L.png",
  "year": 2019,
  "al": ["The Helpful Fox Senko-san", "世話やきキツネの仙狐さん", "贤惠幼妻仙狐小姐", "Senko si Rubah Penolong"],
  "r": 717
 },
 {
  "id": 126213,
  "name": "Shin no Nakama ja Nai to Yuusha no Party wo Oidasareta node, Henkyou de Slow Life suru Koto ni shimashita",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx126213-cXF3hsCcOipI.jpg",
  "year": 2021,
  "al": ["Banished from the Hero’s Party, I Decided to Live a Quiet Life in the Countryside", "真の仲間じゃないと勇者のパーティーを追い出されたので、辺境でスローライフすることにしました", "Banished from the Heroes' Party, I Decided to Live a Quiet Life in the Countryside", "ผมโดนกลุ่มผู้กล้าขับไส เลยต้องไปสโลว์ไลฟ์ที่ชายแดน", "Banished from the brave man's group, I decided to lead a slow life in the back country.", "I Was Kicked out of the Hero’s Party Because I Wasn’t a True Companion so I Decided to Have a Slow Life at the Frontier"],
  "r": 718
 },
 {
  "id": 16049,
  "name": "Toaru Kagaku no Railgun S",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx16049-FbOhOsQAuisF.jpg",
  "year": 2013,
  "al": ["A Certain Scientific Railgun S", "とある科学の超電磁砲S", "Toaru Kagaku no Railgun 2nd Season", "A Certain Scientific Railgun 2nd Season", "เรลกัน แฟ้มลับคดีวิทยาศาสตร์ ภาค 2", "Некий научный Рейлган 2", "Некий научный Рейлган С", "เรลกัน แฟ้มลับคดีวิทยาศาสตร์ ภาคที่ 2"],
  "r": 719
 },
 {
  "id": 107201,
  "name": "Kyokou Suiri",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107201-zQYOPotwmSXO.png",
  "year": 2020,
  "al": ["In/Spectre", "虚構推理", "虚构推理", "ไขปมปริศนาภูต", "Ложные выводы"],
  "r": 720
 },
 {
  "id": 107625,
  "name": "Cider no You ni Kotoba ga Wakiagaru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107625-2UIAI4TRwXz0.jpg",
  "year": 2021,
  "al": ["Words Bubble Up Like Soda Pop", "サイダーのように言葉が湧き上がる", "Palavras que Borbulham como Refrigerante", "Palabras que burbujean como un refresco", "מילים מתפצפצות כמו גזוז", "Nos mots comme des bulles", "ถ้อยคำเอ่อล้นด้วยหัวใจรัก"],
  "r": 721
 },
 {
  "id": 2759,
  "name": "Evangelion Shin Movie: Jo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2759-S0ATamQtDwlW.jpg",
  "year": 2007,
  "al": ["Evangelion: 1.0 You Are (Not) Alone", "ヱヴァンゲリヲン新劇場版:序", "Rebuild of Evangelion 1.11", "Evangelion 1.11 (Nie) jesteś sam", "Reconstrucción de Evangelion", "Евангелион 1.11: Ты (не) один", "Реконструкция Евангелиона - Евангелион: 1.0 Ты [Не] Одинок", "福音戰士新劇場版：序"],
  "r": 722
 },
 {
  "id": 138565,
  "name": "Fumetsu no Anata e Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx138565-JzvDqH84ILzi.png",
  "year": 2022,
  "al": ["To Your Eternity Season 2", "不滅のあなたへ Season 2", "不滅のあなたへ 第２シリーズ", "Uma vida imortal 2", "แด่เธอผู้เป็นนิรันดร์ ภาค 2"],
  "r": 723
 },
 {
  "id": 98658,
  "name": "Shoujo☆Kageki Revue Starlight",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98658-Xz8uliDO7dzZ.png",
  "year": 2018,
  "al": ["Revue Starlight", "少女☆歌劇 レヴュー・スタァライト", "Girls' Musical Revue Starlight", "少女☆歌剧 Revue Starlight"],
  "r": 724
 },
 {
  "id": 15417,
  "name": "Gintama': Enchousen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx15417-Uc2uNdWEixwi.jpg",
  "year": 2012,
  "al": ["Gintama Season 2 Part 2", "銀魂’延長戦", "Gintama' (2012)", "Gintama' Overdrive", "Kintama"],
  "r": 725
 },
 {
  "id": 10162,
  "name": "Usagi Drop",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10162-w4SG5oQSQwMn.jpg",
  "year": 2011,
  "al": ["Bunny Drop", "うさぎドロップ", "白兔糖", "Un drôle de père", "White Rabbit Candy"],
  "r": 726
 },
 {
  "id": 100675,
  "name": "Saenai Heroine no Sodatekata Fine",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100675-Ut2Qyi9gYOKT.png",
  "year": 2019,
  "al": ["Saekano the Movie: Finale", "冴えない彼女の育てかた Fine", "Saekano Movie", "Saekano Fine", "Saenai Heroine no Sodatekata Movie", "วิธีปั้นสาวบ้านให้มาเป็นนางเอกของผม เดอะ มูฟวี่"],
  "r": 727
 },
 {
  "id": 144553,
  "name": "Saikyou Onmyouji no Isekai Tenseiki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx144553-Q5M7iNLHMuCl.jpg",
  "year": 2023,
  "al": ["The Reincarnation of the Strongest Exorcist in Another World", "最強陰陽師の異世界転生記"],
  "r": 728
 },
 {
  "id": 179062,
  "name": "Enen no Shouboutai: San no Shou Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx179062-pbzYE1miZq61.png",
  "year": 2026,
  "al": ["Fire Force Season 3 Part 2", "炎炎ノ消防隊 参ノ章 第2クール", "Enen no Shouboutai 3rd Season Part 2", "หน่วยผจญคนไฟลุก ภาค 3"],
  "r": 729
 },
 {
  "id": 156039,
  "name": "Boushoku no Berserk",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx156039-JnepQcVxXLLW.jpg",
  "year": 2023,
  "al": ["Berserk of Gluttony", "暴食のベルセルク", "จอมตะกละดาบคลั่ง", "Bousyoku", "O Berserker da Gula", "Berserk nan Rakus", "Ненасытный берсерк"],
  "r": 730
 },
 {
  "id": 97889,
  "name": "Gintama.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97889-ytqHdmus9wQi.jpg",
  "year": 2017,
  "al": ["Gintama Season 4", "銀魂。", "Gintama. (2017)", "Gintama.: The Battle on Rakuyo"],
  "r": 731
 },
 {
  "id": 183161,
  "name": "Saikyou no Ousama, Nidome no Jinsei wa Nani wo Suru?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx183161-5M054tuPmZJX.jpg",
  "year": 2025,
  "al": ["The Beginning After the End", "最強の王様、二度目の人生は 何をする?", "TBATE", "終末起點", "Начало после конца"],
  "r": 732
 },
 {
  "id": 120646,
  "name": "Senpai ga Uzai Kouhai no Hanashi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx120646-CeYcpChKQt0F.jpg",
  "year": 2021,
  "al": ["My Senpai is Annoying", "先輩がうざい後輩の話", "ลุ้นรักรุ่นน้องตัวจิ๋วกับรุ่นพี่ตัวป่วน", "Seniorku yang Menyebalkan"],
  "r": 733
 },
 {
  "id": 167336,
  "name": "Lazarus",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx167336-KpGIIBie71OX.png",
  "year": 2025,
  "al": ["ラザロ"],
  "r": 734
 },
 {
  "id": 126192,
  "name": "Kanojo mo Kanojo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx126192-3fFbZJFSwrHH.jpg",
  "year": 2021,
  "al": ["Girlfriend, Girlfriend", "カノジョも彼女", "KanoKano", "She is also my Girlfriend", "จะคนไหนก็แฟนสาว", "Мои девушки", "Kupunya Dia dan Dirinya"],
  "r": 735
 },
 {
  "id": 114043,
  "name": "Shokugeki no Souma: Gou no Sara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114043-QkgiycojrojN.jpg",
  "year": 2020,
  "al": ["Food Wars! The Fifth Plate", "食戟のソーマ 豪ノ皿", "食戟之灵：豪之皿", "ยอดนักปรุงโซมะ ภาค 5"],
  "r": 736
 },
 {
  "id": 150075,
  "name": "Kono Subarashii Sekai ni Bakuen wo!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx150075-QIGcA7oVyO6l.jpg",
  "year": 2023,
  "al": ["KONOSUBA -An Explosion on This Wonderful World!", "この素晴らしい世界に爆焔を！", "ขอให้ระเบิดตูมตามในโลกแฟนตาซี!", "為美好的世界獻上爆焰！", "Да благословит взрыв сей расчудесный мир!"],
  "r": 737
 },
 {
  "id": 173694,
  "name": "Hazure Waku no [Joutai Ijou Skill] de Saikyou ni Natta Ore ga Subete wo Juurin Suru made",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx173694-XcwGOMBxboOO.png",
  "year": 2024,
  "al": ["Failure Frame: I Became the Strongest and Annihilated Everything with Low-Level Spells", "ハズレ枠の【状態異常スキル】で最強になった俺がすべてを蹂躙するまで", "Hazurewaku", "Dengan Bingkai Status Sampah \"Skill Abnormal\" Aku Menjadi Terkuat dan Akan Menghabisi Semuanya"],
  "r": 738
 },
 {
  "id": 171046,
  "name": "Seishun Buta Yarou wa Santa Claus no Yume wo Minai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx171046-9leqLiNuOqNu.png",
  "year": 2025,
  "al": ["Rascal Does Not Dream of Santa Claus", "青春ブタ野郎はサンタクロースの夢を見ない", "AoButa", "青ブタ", "Rascal Does Not Dream: University Student Arc", "Rascal Series: University Arc", "青春ブタ野郎 大学生編", "Seishun Buta Yarou: Daigakusei-hen"],
  "r": 739
 },
 {
  "id": 98514,
  "name": "Uma Musume: Pretty Derby",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98514-mEh3Gl58AWgc.jpg",
  "year": 2018,
  "al": ["Umamusume: Pretty Derby", "ウマ娘 プリティーダービー", "สาวม้าโมเอะ"],
  "r": 740
 },
 {
  "id": 170732,
  "name": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka V: Houjou no Megami-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170732-PwCMhnnOKdBu.jpg",
  "year": 2024,
  "al": ["Is It Wrong To Try To Pick Up Girls in a Dungeon? V", "ダンジョンに出会いを求めるのは間違っているだろうかⅤ 豊穣の女神篇", "DanMachi V", "Familia Myth V", "ダンまちⅤ", "Is It Wrong to Try to Pick Up Girls in a Dungeon? Season 5", "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka 5th Season", "Is It Wrong to Try to Pick Up Girls in a Dungeon? V: Goddess of Fertility Arc"],
  "r": 741
 },
 {
  "id": 100773,
  "name": "Shokugeki no Souma: San no Sara - Tootsuki Ressha-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx100773-KLx4vR0TiC5o.jpg",
  "year": 2018,
  "al": ["Food Wars! The Third Plate: Totsuki Train Arc", "『食戟のソーマ 餐ノ皿』 遠月列車篇", "食戟之灵 餐之皿 远月列车篇", "ยอดนักปรุงโซมะ ภาค 3 ครึ่งหลัง"],
  "r": 742
 },
 {
  "id": 21394,
  "name": "Magi: Sinbad no Bouken",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21394-yauvzIHGAoZv.jpg",
  "year": 2016,
  "al": ["Magi: Adventure of Sinbad", "マギ シンドバッドの冒険", "מאגי: הרפתקאותיו של סינבד"],
  "r": 743
 },
 {
  "id": 59,
  "name": "Chobits",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx59-0J95ZHgt4uyP.jpg",
  "year": 2002,
  "al": ["ちょびっツ"],
  "r": 744
 },
 {
  "id": 100815,
  "name": "Zoku Owarimonogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100815-cZbnM9Bjth8W.png",
  "year": 2019,
  "al": ["続・終物語", "Continued End Tale"],
  "r": 745
 },
 {
  "id": 189117,
  "name": "Dr. STONE: SCIENCE FUTURE Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx189117-TLtCXYT7JPoL.jpg",
  "year": 2025,
  "al": ["Dr. STONE SCIENCE FUTURE Cour 2", "Dr.STONE SCIENCE FUTURE 2クール", "Dr.STONE Season 4 Part 2", "ドクターストーン"],
  "r": 746
 },
 {
  "id": 103900,
  "name": "Bokutachi wa Benkyou ga Dekinai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx103900-E3rqgpq4X0Py.jpg",
  "year": 2019,
  "al": ["We Never Learn: BOKUBEN", "ぼくたちは勉強ができない", "BokuBen", "We Can't Study", "Boku-tachi wa Benkyou ga Dekinai", "เรื่องนี้ตําราไม่มีสอน"],
  "r": 747
 },
 {
  "id": 3297,
  "name": "ARIA The ORIGINATION",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx3297-FHuyO7uiefNg.png",
  "year": 2008,
  "al": ["アリア ジ オリジネーション"],
  "r": 748
 },
 {
  "id": 178533,
  "name": "Ranma 1/2 (2024)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178533-b88OLxm50jcH.jpg",
  "year": 2024,
  "al": ["Ranma1/2 (2024)", "らんま1/2 (2024)", "Ranma 1/2 (New Anime)", "Ranma 1/2 (Shinsaku Anime)", "らんま1/2 (新作アニメ)", "乱马 1/2", "란마1/2"],
  "r": 749
 },
 {
  "id": 97766,
  "name": "Gamers!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97766-AKr0m3uHkKyW.jpg",
  "year": 2017,
  "al": ["ゲーマーズ!", "Gamers! Amano Keita to Seishun Continue", "Gamers! Keita Amano and youth continue"],
  "r": 750
 },
 {
  "id": 21364,
  "name": "GATE: Jieitai Kanochi nite, Kaku Tatakaeri Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21364-6ikYd5J46dt0.jpg",
  "year": 2016,
  "al": ["Gate 2", "GATE 自衛隊 彼の地にて、斯く戦えり 第2クール"],
  "r": 751
 },
 {
  "id": 21268,
  "name": "Kidou Senshi Gundam: Tekketsu no Orphans",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx21268-6dKrz26PPUvk.jpg",
  "year": 2015,
  "al": ["Mobile Suit GUNDAM Iron Blooded Orphans", "機動戦士ガンダム 鉄血のオルフェンズ", "Gundam IBO", "G-Tekketsu", "Gundam: Sirotci s železnou krví"],
  "r": 752
 },
 {
  "id": 108928,
  "name": "Nanatsu no Taizai: Kamigami no Gekirin",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108928-DuyUzi0JyPIr.jpg",
  "year": 2019,
  "al": ["The Seven Deadly Sins: Imperial Wrath of the Gods", "七つの大罪 神々の逆鱗", "The Seven Deadly Sins: Wrath of the Gods", "ศึกตำนาน 7 อัศวิน ภาค 3 เพลิงพิโรธของเหล่าทวยเทพ", "Семь смертных грехов: Гнев богов"],
  "r": 753
 },
 {
  "id": 20606,
  "name": "Kuroshitsuji: Book of Circus",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx20606-58LzabjtVrwt.jpg",
  "year": 2014,
  "al": ["Black Butler: Book of Circus", "黒執事 Book of Circus", "Black Butler 3", "Kuroshitsuji Circus Hen", "Kuroshitsuji Shin Series", "คนลึกไขปริศนาลับ ภาค 3", "คนลึกไขปริศนาลับ: Book of Circus", "Hắc quản gia: Chương đoàn xiếc"],
  "r": 754
 },
 {
  "id": 80,
  "name": "Kidou Senshi Gundam",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx80-pdYJ12vSTmad.jpg",
  "year": 1979,
  "al": ["Mobile Suit Gundam", "機動戦士ガンダム", "MSG", "Mobile Suit Gundam: 0079"],
  "r": 755
 },
 {
  "id": 202955,
  "name": "Prism Rondo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx202955-9ESiLpN9AynZ.jpg",
  "year": 2026,
  "al": ["Love Through A Prism", "プリズム輪舞曲", "ปริซึมแห่งรัก", "El amor a través de un prisma", "Prin prisma dragostei", "Pelo Prisma do Amor", "프리즘 윤무곡", "Il prisma dell'amore"],
  "r": 756
 },
 {
  "id": 127271,
  "name": "Ryuu to Sobakasu no Hime",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx127271-juJIu4WFTM8q.png",
  "year": 2021,
  "al": ["BELLE", "竜とそばかすの姫", "The Dragon and Freckled Princess", "BELLE เจ้าหญิงแห่งเสียงเพลง", "Красавица и дракон", "Μπελ: Ο Δράκος και Η Πριγκίπισσα", "龙与雀斑公主", "Дракон та веснянкувата принцеса"],
  "r": 757
 },
 {
  "id": 3455,
  "name": "To LOVE-Ru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx3455-oNiJmsZZTAAj.png",
  "year": 2008,
  "al": ["To Love Ru", "To LOVEる -とらぶる-", "To Love You", "ToLoveRu", "ToLoveRu Trouble", "To-LOVE-Ru", "วุ่นรักยัยต่างดาว"],
  "r": 758
 },
 {
  "id": 97917,
  "name": "Yoru wa Mijikashi Arukeyo Otome",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97917-bHtHhWkIsdR5.jpg",
  "year": 2017,
  "al": ["The Night is Short, Walk on Girl", "夜は短し歩けよ乙女", "春宵苦短，少女前进吧！"],
  "r": 759
 },
 {
  "id": 139498,
  "name": "Tensei Shitara Slime Datta Ken: Guren no Kizuna-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139498-DdVASeAj7ag4.jpg",
  "year": 2022,
  "al": ["That Time I Got Reincarnated as a Slime the Movie: Scarlet Bond", "劇場版 転生したらスライムだった件 紅蓮の絆編", "That Time I Got Reincarnated as a Slime Movie", "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว เดอะมูฟวี่", "Lúc đó tôi đã chuyển sinh thành Slime: Mối Liên Kết Đỏ Thẫm", "О моём перерождении в слизь: Алые узы", "Tensura Movie", "That Time I Got Reincarnated as a Slime: El Vínculo Escarlata"],
  "r": 760
 },
 {
  "id": 20876,
  "name": "Nisekoi:",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20876-CCVVLTSsnKC8.jpg",
  "year": 2015,
  "al": ["ニセコイ：", "Nisekoi2 -False Love-", "รักลวงป่วนใจ ภาค 2"],
  "r": 761
 },
 {
  "id": 124140,
  "name": "Sword Art Online: Progressive - Hoshinaki Yoru no Aria",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx124140-HNL0CpH6ig6y.png",
  "year": 2021,
  "al": ["Sword Art Online the Movie -Progressive- Aria of a Starless Night", "劇場版 ソードアート・オンライン プログレッシブ 星なき夜のアリア", "SAO Progressive", "Sword Art Online: Progressive - อาเรียแห่งคืนที่ไร้ดาว", "Sword Art Online Progressive: Ária de Uma Noite Sem Estrelas", "SAOP", "Sword Art Online: Progressive - Aria de una noche sin estrellas"],
  "r": 762
 },
 {
  "id": 11499,
  "name": "Sankarea",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11499-SeYog5nP4Uks.png",
  "year": 2012,
  "al": ["Sankarea: Undying Love", "さんかれあ"],
  "r": 763
 },
 {
  "id": 114065,
  "name": "Bokutachi no Remake",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114065-YPPyW7ZSxfYU.jpg",
  "year": 2021,
  "al": ["Remake Our Life!", "ぼくたちのリメイク", "Bokurema", "我们的重制人生", "ย้อนเวลา รีเมคชีวิต", "Ремейк нашей жизни!"],
  "r": 764
 },
 {
  "id": 147642,
  "name": "Nozomanu Fushi no Boukensha",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx147642-SztpXNn9ke6P.jpg",
  "year": 2024,
  "al": ["The Unwanted Undead Adventurer", "望まぬ不死の冒険者", "เส้นทางพลิกผันชองราชันอมตะ", "TUUA", "Petualang Mayat Hidup yang Tidak Diinginkan", "Нежеланно бессмертный авантюрист"],
  "r": 765
 },
 {
  "id": 206914,
  "name": "Nippon Sangoku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx206914-SHKX08LarRzB.jpg",
  "year": 2026,
  "al": ["NIPPON SANGOKU: The Three Nations of the Crimson Sun", "日本三國", "Nippon Sangoku: Trzy Narody Wschodzącego Słońca", "Les Nations du Soleil Sanglant", "NIPPON SANGOKU: สามก๊กญี่ปุ่น", "Nippon Sangoku: A Guerra das Três Nações", "NIPPON SANGOKU: Kızıl Güneşin Üç Ulusu", "Nippon Sangoku: Las tres naciones del sol carmesí"],
  "r": 766
 },
 {
  "id": 98384,
  "name": "Bungou Stray Dogs: DEAD APPLE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98384-nXEnNzwiJ9BV.jpg",
  "year": 2018,
  "al": ["Bungo Stray Dogs: DEAD APPLE", "文豪ストレイドッグス DEAD APPLE", "Bungou Stray Dogs Movie"],
  "r": 767
 },
 {
  "id": 153332,
  "name": "Tensei Kizoku no Isekai Boukenroku: Jichou wo Shiranai Kamigami no Shito",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153332-k3Jg04E9jNRo.png",
  "year": 2023,
  "al": ["The Aristocrat’s Otherworldly Adventure: Serving Gods Who Go Too Far", "転生貴族の異世界冒険録 〜自重を知らない神々の使徒〜", "Chronicles of an Aristocrat Reborn in Another World", "เกิดใหม่เป็นขุนนางไปผจญภัยในต่างโลก: อัครทูตจอมซุ่มซ่ามของทวยเทพ", "Crônicas de um Aristocrata em Outro Mundo", "Noble New World Adventures", "Die Parallelwelt-Chroniken des Aristokraten"],
  "r": 768
 },
 {
  "id": 5341,
  "name": "Ookami to Koushinryou II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5341-gyp5OZ1NYPxi.jpg",
  "year": 2009,
  "al": ["Spice and Wolf II", "狼と香辛料II", "สาวหมาป่ากับนายเครื่องเทศ ภาค 2", "Волчица и пряности 2"],
  "r": 769
 },
 {
  "id": 153406,
  "name": "Kami no Tou: Tower of God 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153406-dU2RLKgMUF2U.jpg",
  "year": 2024,
  "al": ["Tower of God Season 2", "神之塔 -Tower of God- 第2期", "タワーオブ・ゴッド 2", "Sinui Tap 2", "TOG 2", "신의 탑 2", "Tower of God Season 2: Return of the Prince", "神之塔 -Tower of God- 王子の帰還"],
  "r": 770
 },
 {
  "id": 138882,
  "name": "Kumichou Musume to Sewagakari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx138882-Ich6OQJxB9P8.jpg",
  "year": 2022,
  "al": ["The Yakuza's Guide to Babysitting", "組長娘と世話係", "Con Gái Ông Trùm Và Người Giám Hộ", "組長女兒與保姆"],
  "r": 771
 },
 {
  "id": 107068,
  "name": "Karakai Jouzu no Takagi-san 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107068-KJq0eFP0GTjL.jpg",
  "year": 2019,
  "al": ["Teasing Master Takagi-san Season 2", "からかい上手の高木さん 2", "Skilled Teaser Takagi-san 2nd Season", "טאקאגי-סאן אלופת ההקנטות 2", "Nhất quỷ Nhì ma, Thứ ba Takagi 2", "แกล้งนัก รักนะ รู้ยัง ภาค 2", "Takagi-san, experta en bromas pesadas", "Nicht schon wieder, Takagi-san"],
  "r": 772
 },
 {
  "id": 156023,
  "name": "Maou no Ore ga Dorei Elf wo Yome ni Shitanda ga, Dou Medereba Ii?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx156023-cY4NC8gCcAg7.jpg",
  "year": 2024,
  "al": ["An Archdemon's Dilemma: How to Love Your Elf Bride", "魔王の俺が奴隷エルフを嫁にしたんだが、どう愛でればいい？", "Madome", "まどめ", "จอมมารอย่างข้า ควรรักภรรยาเอลฟ์อย่างไรดี"],
  "r": 773
 },
 {
  "id": 142876,
  "name": "Dr. STONE: Ryuusui",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142876-izO35hPP2DZ9.jpg",
  "year": 2022,
  "al": ["Dr. STONE Special Episode – RYUSUI", "Dr.STONE 龍水", "Dr. STONE: Ryusui", "Доктор Стоун: Рюсуй"],
  "r": 774
 },
 {
  "id": 97880,
  "name": "Code Geass: Fukkatsu no Lelouch",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97880-sZWHViJfrvXm.jpg",
  "year": 2019,
  "al": ["Code Geass: Lelouch of the Re;surrection", "コードギアス 復活のルルーシュ"],
  "r": 775
 },
 {
  "id": 142455,
  "name": "Bubble",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142455-5cBnV4rz5ISf.jpg",
  "year": 2022,
  "al": ["バブル", "บับเบิ้ล", "Burbujas", "فقاعة"],
  "r": 776
 },
 {
  "id": 21131,
  "name": "Gakusen Toshi Asterisk",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21131-sh1HBXuF6qHH.jpg",
  "year": 2015,
  "al": ["The Asterisk War", "学戦都市アスタリスク", "Academy Battle City Asterisk"],
  "r": 777
 },
 {
  "id": 112667,
  "name": "Kimi to Boku no Saigo no Senjo, Arui wa Sekai ga Hajimaru Seisen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112667-GYFeAlZ38mXK.jpg",
  "year": 2020,
  "al": ["Our Last Crusade or the Rise of a New World", "キミと僕の最後の戦場、あるいは世界が始まる聖戦", "Kimisen", "ศึกสุดท้ายของเธอกับผมคือจุดเริ่มต้นของโลกใบใหม่", "Kimi to Boku no Saigo no Senjo, Aruiwa Sekai ga Hajimaru Seisen"],
  "r": 778
 },
 {
  "id": 135865,
  "name": "Youjo Senki II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx135865-T7XIPMAbqcxN.png",
  "year": 2026,
  "al": ["Saga of Tanya the Evil Season 2", "幼女戦記Ⅱ", "Saga of Tanya the Evil II", "Youjo Senki 2"],
  "r": 779
 },
 {
  "id": 12445,
  "name": "Tasogare Otome x Amnesia",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12445-hKIXQW3vA4iz.jpg",
  "year": 2012,
  "al": ["Dusk Maiden of Amnesia", "黄昏乙女×アムネジア"],
  "r": 780
 },
 {
  "id": 182309,
  "name": "Grand Blue Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx182309-IfrR8sgHIczv.jpg",
  "year": 2025,
  "al": ["Grand Blue Dreaming Season 2", "ぐらんぶる Season 2", "Grand Blue ก๊วนป่วนชวนบุ๋งบุ๋ง ซีซัน 2"],
  "r": 781
 },
 {
  "id": 151252,
  "name": "Koori Zokusei Danshi to Cool na Douryou Joshi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx151252-ywrMmJG1Loc3.jpg",
  "year": 2023,
  "al": ["The Ice Guy and His Cool Female Colleague", "氷属性男子とクールな同僚女子", "บริษัทลุ้นรัก หนุ่มหิมะกับสาวสุดคูล", "Pria Es dan Rekan Wanitanya yang Keren"],
  "r": 782
 },
 {
  "id": 152681,
  "name": "Gimai Seikatsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx152681-xtQiVOYDhr3p.jpg",
  "year": 2024,
  "al": ["Days with My Stepsister", "義妹生活", "แง้มหัวใจยัยน้องสาวจำเป็น"],
  "r": 783
 },
 {
  "id": 104462,
  "name": "Toaru Kagaku no Railgun T",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104462-KrVWRvPcR7ci.jpg",
  "year": 2020,
  "al": ["A Certain Scientific Railgun T", "とある科学の超電磁砲T", "Toaru Kagaku no Railgun 3", "とある科学の超電磁砲3", "A Certain Scientific Railgun 3", "เรลกัน แฟ้มลับคดีวิทยาศาสตร์ T", "เรลกัน แฟ้มลับคดีวิทยาศาสตร์ ภาค 3", "Siêu Railgun của khoa học nào đó"],
  "r": 784
 },
 {
  "id": 163076,
  "name": "Akuyaku Reijou Level 99: Watashi wa Ura Boss desu ga Maou de wa Arimasen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163076-5wQKtU3FoMxd.jpg",
  "year": 2024,
  "al": ["Villainess Level 99: I May Be the Hidden Boss but I'm Not the Demon Lord", "悪役令嬢レベル99 ～私は裏ボスですが魔王ではありません～", "ชีวิตไม่ง่ายของนางร้าย LV99", "Light Magic and the Hero", "Злодейка 99 уровня: Да, я скрытый босс, но не повелительница демонов", "Akuyaku LV99"],
  "r": 785
 },
 {
  "id": 163329,
  "name": "Tokyo Revengers: Tenjiku-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163329-lGJRnYV9dcjc.jpg",
  "year": 2023,
  "al": ["Tokyo Revengers Season 2 Part 2", "東京リベンジャーズ 天竺編", "Tokyo Revengers: Tenjiku Arc", "Tokyo Revengers Season 3", "Răzbunătorii din Tokio: Sezonul 2 Partea 2"],
  "r": 786
 },
 {
  "id": 12467,
  "name": "Nazo no Kanojo X",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12467-FtvouFLt2Vkr.jpg",
  "year": 2012,
  "al": ["Mysterious Girlfriend X", "謎の彼女X", "MGX", "NazoKanoX"],
  "r": 787
 },
 {
  "id": 116588,
  "name": "Sentouin, Hakenshimasu!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116588-noyscGIN8FIr.jpg",
  "year": 2021,
  "al": ["Combatants Will Be Dispatched!", "戦闘員、派遣します！", "Kombattanten werden entsandt!", "战斗员派遣中！", "นักรบสายป่วนออกปฏิบัติกวน", "Les combattants seront déployés !"],
  "r": 788
 },
 {
  "id": 19163,
  "name": "Date A Live II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx19163-eHXj3mNRaOXt.jpg",
  "year": 2014,
  "al": ["デート・ア・ライブⅡ", "Date A Live 2", "พิชิตรัก พิทักษ์โลก ภาค 2", "Рандеву с жизнью"],
  "r": 789
 },
 {
  "id": 20574,
  "name": "Hi Score Girl",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20574-cUPxastH5vAm.jpg",
  "year": 2018,
  "al": ["ハイスコアガール"],
  "r": 790
 },
 {
  "id": 98762,
  "name": "Chuunibyou demo Koi ga Shitai!: Take On Me",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98762-ofC7Eqsm2KcD.jpg",
  "year": 2018,
  "al": ["Love, Chunibyo & Other Delusions: Take on Me", "映画 中二病でも恋がしたい！ -Take On Me-", "Miłość, gimbaza i kosmiczna faza! Za mną leć"],
  "r": 791
 },
 {
  "id": 163571,
  "name": "BanG Dream! It's MyGO!!!!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163571-Atkvuzh1A1Ip.png",
  "year": 2023,
  "al": ["バンドリ！It's MyGO!!!!!", "迷途之子!!!!!"],
  "r": 792
 },
 {
  "id": 151847,
  "name": "Kanojo ga Koushaku-tei ni Itta Riyuu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx151847-OnTYbvb4y4mp.jpg",
  "year": 2023,
  "al": ["Why Raeliana Ended Up at the Duke’s Mansion", "彼女が公爵邸に行った理由", "그녀가 공작저로 가야 했던 사정", "Geunyeoga Gongjagjeolo Gaya Haessdeon Sajeong", "พระเอกของฉันเป็นท่านดยุค", "Como Raeliana Foi Parar na Mansão do Duque", "Comment Raeliana a survécu au manoir Wynknight", "The Reason Why Raeliana Ended up at the Duke's Mansion"],
  "r": 793
 },
 {
  "id": 178005,
  "name": "Tamon-kun Ima Docchi!?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178005-pCEReATswrup.jpg",
  "year": 2026,
  "al": ["Tamon's B-Side", "多聞くん今どっち！？", "Two F/aced Tamon", "Which Face Does Tamon Have Now?", "ทามอนคุง ตอนนี้อยู่โหมดไหน!?"],
  "r": 794
 },
 {
  "id": 97886,
  "name": "Kekkai Sensen & BEYOND",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx97886-iArtYIxZzGcR.jpg",
  "year": 2017,
  "al": ["Blood Blockade Battlefront & Beyond", "血界戦線 & BEYOND", "Bloodline Battlefront & Beyond"],
  "r": 795
 },
 {
  "id": 145260,
  "name": "Kuro no Shoukanshi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx145260-Yt5W8aQQKqF2.jpg",
  "year": 2022,
  "al": ["Black Summoner", "黒の召喚士", "นักอัญเชิญทมิฬ", "黑之召喚士"],
  "r": 796
 },
 {
  "id": 116605,
  "name": "Date A Live IV",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116605-uzDakXnaZ1OW.jpg",
  "year": 2022,
  "al": ["デート・ア・ライブIV", "Date A Live Season 4", "พิชิตรัก พิทักษ์โลก ภาค 4", "Рандеву с Жизнью 4"],
  "r": 797
 },
 {
  "id": 186052,
  "name": "Mizu Zokusei no Mahou Tsukai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx186052-zq8h0Qo0O0sP.jpg",
  "year": 2025,
  "al": ["The Water Magician", "水属性の魔法使い"],
  "r": 798
 },
 {
  "id": 10271,
  "name": "Gyakkyou Burai Kaiji: Hakairoku-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx10271-Aep4woDDbXdU.jpg",
  "year": 2011,
  "al": ["Kaiji - Against All Rules", "逆境無頼カイジ 破戒録篇", "The Suffering Pariah Kaiji: Backslide Arc", "Kaiji 2"],
  "r": 799
 },
 {
  "id": 141208,
  "name": "Tonikaku Kawaii Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx141208-On0qHKxo6P5t.png",
  "year": 2023,
  "al": ["TONIKAWA: Over The Moon For You Season 2", "トニカクカワイイ（シーズン2）", "Fly Me to the Moon 2", "Tonikaku Cawaii 2", "Generally Cute 2", "总之就是非常可爱２", "จะยังไงภรรยาของผมก็น่ารัก ภาค 2", "Красавица: Унеси меня на Луну 2"],
  "r": 800
 },
 {
  "id": 85,
  "name": "Kidou Senshi Z Gundam",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx85-zdvoyoXDpjSs.jpg",
  "year": 1985,
  "al": ["Mobile Suit Zeta Gundam", "機動戦士Zガンダム", "Kidou Senshi Zeta Gundam"],
  "r": 801
 },
 {
  "id": 124410,
  "name": "Kanojo, Okarishimasu 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx124410-iScdHzzEqdmk.png",
  "year": 2022,
  "al": ["Rent-a-Girlfriend Season 2", "彼女、お借りします 第2期", "KanoKari 2", "สะดุดรักยัยแฟนเช่า ภาค 2", "Pacar Sewaan 2"],
  "r": 802
 },
 {
  "id": 101316,
  "name": "Irozuku Sekai no Ashita kara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101316-yI1ZvMrsDUn9.png",
  "year": 2018,
  "al": ["IRODUKU: The World in Colors", "色づく世界の明日から", "So Many Colors In The Future What A Wonderful World", "Iroduku", "IRODUKU: O Mundo em Cores", "IRODUKU: Le Monde en couleur", "IRODUKU: El mundo en colores"],
  "r": 803
 },
 {
  "id": 16417,
  "name": "Tamako Market",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx16417-r8Njy5UnwvDE.png",
  "year": 2013,
  "al": ["たまこまーけっと"],
  "r": 804
 },
 {
  "id": 338,
  "name": "Versailles no Bara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx338-dyRsnLdTLZGM.png",
  "year": 1979,
  "al": ["Lady Oscar: The Rose of Versailles", "ベルサイユのばら", "Berusaiyu no Bara", "The Rose of Versailles", "Lady Oscar", "Lady Oscar: Róża Wersalu"],
  "r": 805
 },
 {
  "id": 10495,
  "name": "Yuru Yuri",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10495-FbK4ybSp2DNG.jpg",
  "year": 2011,
  "al": ["YuruYuri", "ゆるゆり", "YRYR"],
  "r": 806
 },
 {
  "id": 100722,
  "name": "Date A Live III",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx100722-M5nXzDkuGOLC.png",
  "year": 2019,
  "al": ["デート・ア・ライブⅢ", "Date a Live 3rd Season", "Date a Live 3", "DAL 3", "พิชิตรัก พิทักษ์โลก ภาค 3", "Рандеву с Жизнью 3"],
  "r": 807
 },
 {
  "id": 14075,
  "name": "Zetsuen no Tempest",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14075-EIJcGXq5hd9O.jpg",
  "year": 2012,
  "al": ["Blast of Tempest", "絶園のテンペスト", "Zetsuen no Tempest: The Civilization Blaster", "絶園のテンペスト ~THE CIVILIZATION BLASTER~", "Penghancuran Peradaban"],
  "r": 808
 },
 {
  "id": 155963,
  "name": "Dosanko Gal wa Namara Menkoi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx155963-kOnLUDAEamUe.jpg",
  "year": 2024,
  "al": ["Hokkaido Gals Are Super Adorable!", "道産子ギャルはなまらめんこい", "Dosanko Gyaru Is Mega Cute", "Dosanko Gyaru wa Namaramenkoi", "สาวแกลเมืองเหนือน่าฮักขนาด", "Dosakoi", "どさこい", "Девчонки с Хоккайдо просто чума!"],
  "r": 809
 },
 {
  "id": 170206,
  "name": "Scott Pilgrim Takes Off",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170206-ZP4qAzx2I2oR.jpg",
  "year": 2023,
  "al": ["スコット・ピルグリム テイクス・オフ", "Scott Pilgrim zaskakuje", "Scott Pilgrim da el salto", "Σκοτ Πίλγκριμ: Η Σειρά", "Скотт Пилигрим жмет на газ", "Scott Pilgrim: A Série", "Scott Pilgrim prend son envol", "Скотт Пілігрим стає до бою"],
  "r": 810
 },
 {
  "id": 132052,
  "name": "Kakkou no Iinazuke",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx132052-3gDTi19HyW6E.png",
  "year": 2022,
  "al": ["A Couple of Cuckoos", "カッコウの許嫁", "รักอลวนคนสลับบ้าน", "Обручённые кукушками"],
  "r": 811
 },
 {
  "id": 117448,
  "name": "Isekai Maou to Shoukan Shoujo no Dorei Majutsu Ω",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx117448-bsPgVDD85sjB.jpg",
  "year": 2021,
  "al": ["How NOT to Summon a Demon Lord Ω", "異世界魔王と召喚少女の奴隷魔術Ω", "Isekai Maou to Shoukan Shoujo no Dorei Majutsu 2", "Isekai Maou to Shoukan Shoujo no Dorei Majutsu Omega", "How NOT To Summon A Demon Lord Omega", "异世界魔王与召唤少女的奴隶魔术Ω", "จอมมารต่างโลกกับ บริวารสาวนักอัญเชิญ ภาค 2"],
  "r": 812
 },
 {
  "id": 161474,
  "name": "Seishun Buta Yarou wa Randoseru Girl no Yume wo Minai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx161474-ZDfmmlJQQngN.jpg",
  "year": 2023,
  "al": ["Rascal Does Not Dream of a Knapsack Kid", "青春ブタ野郎はランドセルガールの夢を見ない", "Ao Buta", "青ブタ"],
  "r": 813
 },
 {
  "id": 136934,
  "name": "Mamahaha no Tsurego ga Motokano datta",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx136934-BXmmENtggiHr.jpg",
  "year": 2022,
  "al": ["My Stepmom's Daughter is My Ex", "継母の連れ子が元カノだった", "Motokano", "Tsurekano", "My Stepsister is My Ex-Girlfriend", "เอาแล้วไง ยัยแฟนเก่าดันเป็นลูกสาวแม่ใหม่", "Step-Exes", "繼母的拖油瓶是我的前女友"],
  "r": 814
 },
 {
  "id": 97907,
  "name": "Death March Kara Hajimaru Isekai Kyousoukyoku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97907-MAOO4oDANGXm.png",
  "year": 2018,
  "al": ["Death March to the Parallel World Rhapsody", "デスマーチからはじまる異世界狂想曲", "โศกนาฏกรรมต่างโลกเริ่มต้นจากเดธมาร์ช", "Pawai Maut Berujung Rapsodi Dunia Lain"],
  "r": 815
 },
 {
  "id": 152137,
  "name": "Isekai Shikkaku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx152137-JpefyFlYa03R.jpg",
  "year": 2024,
  "al": ["No Longer Allowed in Another World", "異世界失格", "No Longer Human…In Another World", "Disqualified from Another World"],
  "r": 816
 },
 {
  "id": 1281,
  "name": "Gakkou no Kaidan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1281-1D6fuMnHwor0.png",
  "year": 2000,
  "al": ["Ghost Stories", "学校の怪談", "Ghosts at School", "Fantasmi a scuola", "Historias de Fantasmas"],
  "r": 817
 },
 {
  "id": 597,
  "name": "Neko no Ongaeshi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx597-Prw5pUyYwcFO.png",
  "year": 2002,
  "al": ["The Cat Returns", "猫の恩返し", "Haru en el Reino de los Gatos", "O Reino dos Gatos", "Le Royaume des chats", "Narzeczona dla kota", "Das Königreich der Katzen", "Katteprinsen"],
  "r": 818
 },
 {
  "id": 140457,
  "name": "Yuusha, Yamemasu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx140457-iC0heNEKV9q1.jpg",
  "year": 2022,
  "al": ["I'm Quitting Heroing", "勇者、辞めます", "Yamemasu Tsugi No Shokuba Ha Mao Jo", "yuuyame", "I’m Quitting Heroing: Next Gig Is at the Demon Queen's Castle", "ผมน่ะเลิกเป็นผู้กล้าแล้วครับ", "勇者、辭職不幹了"],
  "r": 819
 },
 {
  "id": 184237,
  "name": "SAKAMOTO DAYS Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx184237-OJAksU2fsIPx.jpg",
  "year": 2025,
  "al": ["SAKAMOTO DAYS 第２クール", "サカモト デイズ 2クール"],
  "r": 820
 },
 {
  "id": 151379,
  "name": "Akiba Meido Sensou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx151379-JxxgTgSViXZL.png",
  "year": 2022,
  "al": ["Akiba Maid War", "アキバ冥途戦争", "Akiba Maid Sensou", "Война горничных Акибы"],
  "r": 821
 },
 {
  "id": 160188,
  "name": "Suki na Ko ga Megane wo Wasureta",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx160188-4RvYLaru3vKj.jpg",
  "year": 2023,
  "al": ["The Girl I Like Forgot Her Glasses", "好きな子がめがねを忘れた", "Sukinako ga Megane wo Wasureta", "สาวลืมแว่นแสนวุ่นละมุนรัก", "Cô bạn tôi thầm thích lại quên mang kính rồi", "Sukimega", "Minha Crush Esqueceu os Óculos", "La chica que me gusta olvidó sus lentes"],
  "r": 822
 },
 {
  "id": 180367,
  "name": "Witch Watch",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx180367-GlRuB2lG7Kaa.jpg",
  "year": 2025,
  "al": ["ウィッチウォッチ"],
  "r": 823
 },
 {
  "id": 129277,
  "name": "Shinigami Bocchan to Kuro Maid",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx129277-ou64knqN2eQT.jpg",
  "year": 2021,
  "al": ["The Duke of Death and His Maid", "死神坊ちゃんと黒メイド", "คุณชายวิปริตกับเมดสาวรอบจัด"],
  "r": 824
 },
 {
  "id": 128712,
  "name": "Tantei wa mou, Shindeiru.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx128712-AlVwHbrugvj6.jpg",
  "year": 2021,
  "al": ["The Detective Is Already Dead", "探偵はもう、死んでいる。", "La detective esta muerta.", "Tanmoshi", "侦探已经，死了", "侦探已死", "นักสืบตายแล้ว", "Детектив уже мёртв"],
  "r": 825
 },
 {
  "id": 129188,
  "name": "Goblin Slayer II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx129188-zWPBGutZXgjZ.jpg",
  "year": 2023,
  "al": ["ゴブリンスレイヤーⅡ", "ก็อบลิน สเลเยอร์ ภาค 2"],
  "r": 826
 },
 {
  "id": 10719,
  "name": "Boku wa Tomodachi ga Sukunai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10719-aNf9gOOw62Fs.png",
  "year": 2011,
  "al": ["Haganai", "僕は友達が少ない", "I Don't Have Many Friends", "Boku ha Tomodachi ga Sukunai", "我的朋友很少"],
  "r": 827
 },
 {
  "id": 150695,
  "name": "Yuusha Party wo Tsuihou Sareta Beast Tamer, Saikyoushu no Nekomimi Shoujo to Deau",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx150695-UOQF6Zz2iCTX.jpg",
  "year": 2022,
  "al": ["Beast Tamer", "勇者パーティーを追放されたビーストテイマー、最強種の猫耳少女と出会う", "เทมเมอร์ถูกทิ้งกับสาวหูแมวสุดแกร่ง", "Penjinak Binatang yang Ditendang dari Regu Pahlawan Bertemu Gadis Bertelinga Hewan dari Ras Terkuat", "被勇者隊伍開除的馭獸使，邂逅了最強種的貓耳少女"],
  "r": 828
 },
 {
  "id": 169295,
  "name": "BanG Dream! Ave Mujica",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx169295-WxoGTeMbje4T.jpg",
  "year": 2025,
  "al": ["Ave Mujica - The Die is Cast -", "バンドリ！アヴェムジカ"],
  "r": 829
 },
 {
  "id": 162896,
  "name": "Nige Jouzu no Wakagimi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx162896-hSMTVceb50GY.jpg",
  "year": 2024,
  "al": ["The Elusive Samurai", "逃げ上手の若君", "Nigewaka", "นายน้อยจอมโกยก้าวสู่เส้นทางแห่งวีรบุรุษ", "Héroe fugitivo", "Беглый самурай"],
  "r": 830
 },
 {
  "id": 177687,
  "name": "Hyakuemu.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx177687-T4SrtVjrmW01.png",
  "year": 2025,
  "al": ["100 METERS", "ひゃくえむ。", "100M", "A Corrida dos 100 Metros", "100 metros lisos", "100 Mètres"],
  "r": 831
 },
 {
  "id": 154967,
  "name": "Seishun Buta Yarou wa Odekake Sister no Yume wo Minai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154967-W9cIm0qlz6fj.jpg",
  "year": 2023,
  "al": ["Rascal Does Not Dream of a Sister Venturing Out", "青春ブタ野郎はおでかけシスターの夢を見ない", "Ao Buta", "青ブタ", "เรื่องฝันปั่นป่วยของผมกับน้องสาวออกนอกบ้าน"],
  "r": 832
 },
 {
  "id": 139092,
  "name": "Mairimashita! Iruma-kun 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139092-q521Du1fkosV.jpg",
  "year": 2022,
  "al": ["Welcome to Demon School! Iruma-kun Season 3", "魔入りました！入間くん 第3シリーズ", "อิรุมะคุง พจญในแดนปีศาจ! ภาค 3"],
  "r": 833
 },
 {
  "id": 6347,
  "name": "Baka to Test to Shoukanjuu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6347-DCSHLkCY7UT3.jpg",
  "year": 2010,
  "al": ["Baka and Test - Summon the Beasts", "バカとテストと召喚獣", "The Idiot", "the Tests", "and the Summoned Creatures", "Baka to Test to Shokanju"],
  "r": 834
 },
 {
  "id": 187869,
  "name": "Kamiina Botan, Yoeru Sugata wa Yuri no Hana",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx187869-LUn3dyTzuKUq.jpg",
  "year": 2026,
  "al": ["Botan Kamiina Fully Blossoms When Drunk", "上伊那ぼたん、酔へる姿は百合の花", "โบตั๋น คามิอินะ งดงามดุจดอกลิลลี่ยามลอยละล่อง", "Kamiina Botan - Dáng Say Tựa Đoá Bách Hợp", "Ботан Камиина расцветает подшофе", "上伊那牡丹，醉姿如百合"],
  "r": 835
 },
 {
  "id": 157397,
  "name": "Yumemiru Danshi wa Genjitsushugisha",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx157397-L1ZUMTuxf8OK.jpg",
  "year": 2023,
  "al": ["The Dreaming Boy is a Realist", "夢見る男子は現実主義者", "เด็กหนุ่มจอมเพ้อฝัน ผู้ตื่นมามองความเป็นจริง", "My Dreamy Realist", "Il giovane sognatore è un realista"],
  "r": 836
 },
 {
  "id": 199547,
  "name": "MARRIAGETOXIN",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx199547-LAaG3cmKCGhr.jpg",
  "year": 2026,
  "al": ["マリッジトキシン", "Marriage Toxin", "วิวาห์แต้มพิษ", "Брачный токсин"],
  "r": 837
 },
 {
  "id": 106240,
  "name": "HELLO WORLD",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx106240-XeWQ4YhKzv7h.png",
  "year": 2019,
  "al": ["ハロー・ワールド"],
  "r": 838
 },
 {
  "id": 104325,
  "name": "Nande Koko ni Sensei ga!?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104325-rqQLoYjr9lEC.jpg",
  "year": 2019,
  "al": ["Why the hell are you here, Teacher!?", "なんでここに先生が!?"],
  "r": 839
 },
 {
  "id": 181841,
  "name": "CITY THE ANIMATION",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx181841-R6fB3bmU5eOE.jpg",
  "year": 2025,
  "al": [],
  "r": 840
 },
 {
  "id": 158898,
  "name": "Yozakura-san Chi no Daisakusen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx158898-O3egiBNkxLQO.png",
  "year": 2024,
  "al": ["Mission: Yozakura Family", "夜桜さんちの大作戦", "Missão: Família Yozakura", "Misión: Familia Yozakura", "ปฏิบัติการลับบ้านโยซากุระ", "La misión de la familia Yozakura", "Миссия семьи Ёдзакура", "Misja: Rodzina Yozakura"],
  "r": 841
 },
 {
  "id": 21051,
  "name": "Nanbaka",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21051-V4IlRBFhlaOs.jpg",
  "year": 2016,
  "al": ["ナンバカ", "Nambaka", "The Numbers"],
  "r": 842
 },
 {
  "id": 2605,
  "name": "Sayonara Zetsubou Sensei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2605-euXOWMmXtZMe.png",
  "year": 2007,
  "al": ["Sayonara, Zetsubou-Sensei", "さよなら絶望先生", "Sayonara Zetsubo Sensei", "Goodbye Teacher Despair", "SZS"],
  "r": 843
 },
 {
  "id": 97863,
  "name": "Hajimete no Gal",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97863-79AXrUZ7VQa5.jpg",
  "year": 2017,
  "al": ["My First Girlfriend is a Gal", "はじめてのギャル", "Hajimete no Gyaru", "First-Time Gal", "My First Gal", "แฟนผมเป็นสาวแกล"],
  "r": 844
 },
 {
  "id": 107067,
  "name": "Rikei ga Koi ni Ochita no de Shoumei shitemita.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107067-UOEanLoeuvYh.png",
  "year": 2020,
  "al": ["Science Fell in Love, So I Tried to Prove It", "理系が恋に落ちたので証明してみた。", "RikeKoi", "理科生坠入情网，故尝试证明。", "พิสูจน์นิยามความรักด้วยหลักวิชาสายวิทย์"],
  "r": 845
 },
 {
  "id": 15689,
  "name": "Nekomonogatari (Kuro)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx15689-1Na3FwWgGk8v.png",
  "year": 2012,
  "al": ["Nekomonogatari Black", "猫物語（黒）"],
  "r": 846
 },
 {
  "id": 152802,
  "name": "Dark Gathering",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx152802-ENRcnqD5axhQ.jpg",
  "year": 2023,
  "al": ["ダークギャザリング", "คู่หูต่างขั้วกับภารกิจกำจัดผี"],
  "r": 847
 },
 {
  "id": 861,
  "name": "xxxHOLiC",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx861-rbZNhIXwS4JE.png",
  "year": 2006,
  "al": ["XXX ホリック"],
  "r": 848
 },
 {
  "id": 570,
  "name": "JIN-ROH",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx570-xyP4IO7i3ua2.jpg",
  "year": 2000,
  "al": ["Jin-Roh: The Wolf Brigade", "人狼 JIN-ROH", "Jin Roh", "Jin Roh la brigade des loups", "Jin-Roh - Uomini e lupi"],
  "r": 849
 },
 {
  "id": 21861,
  "name": "Ao no Exorcist: Kyoto Fujouou-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21861-KDvJJQenJJlT.jpg",
  "year": 2017,
  "al": ["Blue Exorcist: Kyoto Saga", "青の祓魔師 京都不浄王篇", "Blue Exorcist: Kyoto Impure King Arc", "Blue Exorcist Season 2"],
  "r": 850
 },
 {
  "id": 118375,
  "name": "Ore dake Haireru Kakushi Dungeon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx118375-95ClbAh2EQMD.jpg",
  "year": 2021,
  "al": ["The Hidden Dungeon Only I Can Enter", "俺だけ入れる隠しダンジョン", "Special training in the Secret Dungeon!", "ดันเจี้ยนที่มีแต่ข้าเท่านั้นที่เข้าได้ ～แอบฝึกปรืนจนบรรลุสู่สุดแกร่ง～"],
  "r": 851
 },
 {
  "id": 14345,
  "name": "BTOOOM!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14345-BeDPCuhQGtL5.jpg",
  "year": 2012,
  "al": ["BTOOOM！"],
  "r": 852
 },
 {
  "id": 101432,
  "name": "Violet Evergarden: Kitto \"Ai\" wo Shiru Hi ga Kuru no Darou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101432-NQSedsCDQ6dP.png",
  "year": 2018,
  "al": ["Violet Evergarden: Special", "ヴァイオレット・エヴァーガーデン きっと\"愛\"を知る日が来るのだろう", "فيوليت: رسالة"],
  "r": 853
 },
 {
  "id": 105932,
  "name": "Araburu Kisetsu no Otome-domo yo.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105932-OCI48MaTvGXT.png",
  "year": 2019,
  "al": ["O Maidens in Your Savage Season", "荒ぶる季節の乙女どもよ。", "AraOto", "Nuestra Salvaje Juventud", "O maiden: Wahai Para Dara dalam Masa Beringas"],
  "r": 854
 },
 {
  "id": 21180,
  "name": "Saenai Heroine no Sodatekata ♭",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx21180-6ob7MFdjttYe.jpg",
  "year": 2017,
  "al": ["Saekano: How to Raise a Boring Girlfriend ♭", "冴えない彼女の育てかた ♭", "Saekano 2", "Saekano ♭", "Saekano Flat", "Saenai Heroine no Sodatekata 2", "Saenai Heroine no Sodatekata Flat", "วิธีปั้นสาวบ้านให้มาเป็นนางเอกของผม ภาค 2"],
  "r": 855
 },
 {
  "id": 99424,
  "name": "SSSS.GRIDMAN",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx99424-9bV9lbUhynar.jpg",
  "year": 2018,
  "al": [],
  "r": 856
 },
 {
  "id": 158928,
  "name": "SPY×FAMILY CODE: White",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx158928-xqE0euKlQMnY.jpg",
  "year": 2023,
  "al": ["SPY x FAMILY CODE: White", "SxF Movie", "劇場版 スパイファミリー", "SPY x FAMILY CÓDIGO: Branco"],
  "r": 857
 },
 {
  "id": 4382,
  "name": "Suzumiya Haruhi no Yuuutsu (2009)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx4382-ojMWjGFfJFmN.png",
  "year": 2009,
  "al": ["The Melancholy of Haruhi Suzumiya (2009)", "涼宮ハルヒの憂鬱", "凉宫春日的忧郁 (2009)", "La Mélancolie de Haruhi Suzumiya", "La Malinconia di Haruhi Suzumiya", "Меланхолия Харухи Судзумии. Второй сезон"],
  "r": 858
 },
 {
  "id": 163292,
  "name": "Shinmai Ossan Bouken-sha, Saikyou Party ni Shinu Hodo Kitaerarete Muteki ni Naru.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163292-1DkPP4r5UI9Y.jpg",
  "year": 2024,
  "al": ["The Ossan Newbie Adventurer, Trained to Death by the Most Powerful Party, Became Invincible", "新米オッサン冒険者、最強パーティに死ぬほど鍛えられて無敵になる。"],
  "r": 859
 },
 {
  "id": 5,
  "name": "Cowboy Bebop: Tengoku no Tobira",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5-NozHwXWdNLCz.jpg",
  "year": 2001,
  "al": ["Cowboy Bebop: The Movie - Knockin' on Heaven's Door", "カウボーイビバップ天国の扉", "Cowboy Bebop Movie", "Cowboy Bebop: The Movie", "Cowboy Bebop: O Filme", "Kowboj Bebop", "Cowboy Bebop: Pukając do nieba bram"],
  "r": 860
 },
 {
  "id": 184591,
  "name": "Watashi ga Koibito ni Nareru Wake Nai jan, Muri Muri! (※Muri ja Nakatta!?)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx184591-jRXZ29bN61Zc.jpg",
  "year": 2025,
  "al": ["There's No Freaking Way I'll Be Your Lover! Unless…", "わたしが恋人になれるわけないじゃん、ムリムリ! (※ムリじゃなかった!?)", "WataNare", "Um Amor Impossível! Ou não...", "ให้เป็นแฟนได้ไง ไม่เอาไม่ไหวหรอก (※หรือว่าจะไหวนะ!?)", "わたなれ"],
  "r": 861
 },
 {
  "id": 108891,
  "name": "Kono Oto Tomare! 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108891-RTZQkwjWsFi9.jpg",
  "year": 2019,
  "al": ["Kono Oto Tomare!: Sounds of Life Season 2", "この音とまれ！2", "Stop at this Sound! 2", "ฝากฝันไว้ที่เสียงโคโตะ! ภาค 2"],
  "r": 862
 },
 {
  "id": 181447,
  "name": "Saigo ni Hitotsu dake Onegai Shite mo Yoroshii Deshou ka",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx181447-aCmaQmtdwuU5.jpg",
  "year": 2025,
  "al": ["May I Ask for One Final Thing?", "最後にひとつだけお願いしてもよろしいでしょうか", "さいひと", "SaiHito", "สุดท้ายนี้ขอเพียงอย่างหนึ่งได้ไหมคะ"],
  "r": 863
 },
 {
  "id": 20955,
  "name": "Rokka no Yuusha",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20955-MeZp4OtwKGl1.jpg",
  "year": 2015,
  "al": ["Rokka -Braves of the Six Flowers-", "六花の勇者", "ผู้กล้าแห่งบุปผา"],
  "r": 864
 },
 {
  "id": 116752,
  "name": "Nanatsu no Taizai: Funnu no Shinpan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116752-yIJuKp88adqt.jpg",
  "year": 2021,
  "al": ["The Seven Deadly Sins: Dragon's Judgement", "七つの大罪 憤怒の審判", "七大罪：愤怒的审判", "The Seven Deadly Sins: Dragens dom", "ศึกตำนาน 7 อัศวิน ภาค 4", "Сім смертних гріхів: Правосуддя Дракона", "Семь смертных грехов: Яростное правосудие"],
  "r": 865
 },
 {
  "id": 12413,
  "name": "Jormungand",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12413-LAnEEGbT5JQP.jpg",
  "year": 2012,
  "al": ["ヨルムンガンド"],
  "r": 866
 },
 {
  "id": 140596,
  "name": "Ijiranaide, Nagatoro-san 2nd Attack",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx140596-wBtzi7evAMlf.jpg",
  "year": 2023,
  "al": ["DON'T TOY WITH ME, MISS NAGATORO 2nd Attack", "イジらないで、長瀞さん 2nd Attack", "Don't Toy With Me, Miss Nagatoro Season 2", "ยัยตัวแสบแอบน่ารัก นางาโทโระ ภาค 2", "Не издевайся надо мной, Нагаторо! 2 раунд"],
  "r": 867
 },
 {
  "id": 199588,
  "name": "Otaku ni Yasashii Gal wa Inai!?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx199588-M2vtWicvqNbU.jpg",
  "year": 2026,
  "al": ["Gals Can't Be Kind to Otaku!?", "オタクに優しいギャルはいない!?", "OtaGal", "オタギャル", "OtaGyaru"],
  "r": 868
 },
 {
  "id": 111790,
  "name": "Haikyuu!! Riku VS Kuu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx111790-MrEJLRJxjPja.jpg",
  "year": 2020,
  "al": ["HAIKYU!! LAND VS. AIR", "ハイキュー!! 陸 VS 空", "ボールの\"道\"", "Booru no \"Michi\"", "The \"Path\" of the Ball", "Haikyuu!! OVA", "ไฮคิว คู่ตบฟ้าประทาน Riku vs Kuu OVA"],
  "r": 869
 },
 {
  "id": 130050,
  "name": "Summer Ghost",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx130050-rXTPVJ9UGN8Y.jpg",
  "year": 2021,
  "al": ["サマーゴースト"],
  "r": 870
 },
 {
  "id": 21584,
  "name": "Love Live! Sunshine!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21584-AhHXXC6jvtTX.jpg",
  "year": 2016,
  "al": ["ラブライブ！サンシャイン!!", "Love Live! School Idol Project Sunshine!!"],
  "r": 871
 },
 {
  "id": 101215,
  "name": "Chihayafuru 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101215-8TTRNAYJnPMW.png",
  "year": 2019,
  "al": ["ちはやふる 3"],
  "r": 872
 },
 {
  "id": 21258,
  "name": "Akagami no Shirayuki-hime 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21258-6UnmYMTMH0f7.jpg",
  "year": 2016,
  "al": ["Snow White with the Red Hair Season 2", "赤髪の白雪姫 2ndシーズン", "สโนว์ไวท์ผมแดง ภาค 2", "Die rothaarige Schneeprinzessin 2"],
  "r": 873
 },
 {
  "id": 128207,
  "name": "THE FIRST SLAM DUNK",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx128207-SWpfVJMRfQ9X.jpg",
  "year": 2022,
  "al": ["Slam Dunk Movie", "ザ・ファーストスラムダンク", "סלאם דאנק"],
  "r": 874
 },
 {
  "id": 110733,
  "name": "Zombie Land Saga: Revenge",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx110733-mv2p0VBBD3jz.jpg",
  "year": 2021,
  "al": ["ZOMBIE LAND SAGA REVENGE", "ゾンビランドサガ リベンジ", "Zombieland Saga: Revenge", "佐贺偶像是传奇 Revenge", "ซอมบี้เเลนด์ซากะ Revenge", "Зомбилэнд-Сага: Возмездие"],
  "r": 875
 },
 {
  "id": 130586,
  "name": "Shijou Saikyou no Daimaou, Murabito A ni Tensei suru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx130586-vzoz4X37RZwc.jpg",
  "year": 2022,
  "al": ["The Greatest Demon Lord Is Reborn as a Typical Nobody", "史上最強の大魔王、村人Aに転生する", "ชีวิตใหม่ไม่ธรรมดาของราชาปีศาจขี้เหงา", "Raja Iblis Terkuat Sepanjang Sejarah Terlahir Kembali Sebagai Figuran", "Đại Ma Vương Mạnh Nhất Lịch Sử Chuyển Sinh Thành Dân Làng A"],
  "r": 876
 },
 {
  "id": 2993,
  "name": "Rosario to Vampire",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/2993.jpg",
  "year": 2008,
  "al": ["Rosario + Vampire", "ロザリオとバンパイア", "Rosario and Vampire"],
  "r": 877
 },
 {
  "id": 112300,
  "name": "Mahouka Koukou no Rettousei: Raihousha-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112300-I5ucx66OvqWX.png",
  "year": 2020,
  "al": ["The Irregular at Magic High School: Visitor Arc", "魔法科高校の劣等生 来訪者編", "The Irregular at Magic High School Season 2", "พี่น้องปริศนาโรงเรียนมหาเวท ภาค 2", "พี่น้องปริศนาโรงเรียนมหาเวท บทผู้มาเยือน", "Непутёвый ученик в школе магии: Гость"],
  "r": 878
 },
 {
  "id": 21714,
  "name": "Flip Flappers",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21714-wfvIxPvc2wo4.jpg",
  "year": 2016,
  "al": ["フリップフラッパーズ", "轻拍翻转小魔女", "Flip Flappers: Fantazja kontra świat"],
  "r": 879
 },
 {
  "id": 154459,
  "name": "Keikenzumi na Kimi to, Keiken Zero na Ore ga, Otsukiai suru Hanashi.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154459-foR6BMJayEbi.jpg",
  "year": 2023,
  "al": ["Our Dating Story: The Experienced You and The Inexperienced Me", "経験済みなキミと、経験ゼロなオレが、お付き合いする話。", "หนุ่มซิงกับสาวฮอต เดตนี้จะรอดมั้ยนะ", "Kimizero", "キミゼロ", "Kisah Asmara Kita: Kamu yang Berpengalaman dan Aku yang Polos", "Искушённая ты и незрелый я", "Kẻ Ngây Thơ, Người Từng Trải Và Câu Chuyện Tình Của Chúng Ta"],
  "r": 880
 },
 {
  "id": 180228,
  "name": "Ganbare! Nakamura-kun!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx180228-MuZ7adbGiYVj.jpg",
  "year": 2026,
  "al": ["Go For It, Nakamura-kun!!", "ガンバレ！中村くん！！", "Go For It, Nakamura!"],
  "r": 881
 },
 {
  "id": 115740,
  "name": "Kamitachi ni Hirowareta Otoko",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx115740-IRwSQo96Qs2Q.jpg",
  "year": 2020,
  "al": ["By the Grace of the Gods", "神達に拾われた男", "The man picked up by the gods", "Kamihiro", "Kami-tachi ni Hirowareta Otoko", "เพราะพระเจ้าเลือกเลยได้เกิดใหม่มาเลี้ยงสไลม์ในต่างโลก"],
  "r": 882
 },
 {
  "id": 154473,
  "name": "Arifureta Shokugyou de Sekai Saikyou 3rd season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154473-o55309dVGP3G.jpg",
  "year": 2024,
  "al": ["Arifureta: From Commonplace to World's Strongest Season 3", "ありふれた職業で世界最強 3rd season", "อาชีพกระจอกแล้วทำไม ยังไงข้าก็เทพ ภาค 3"],
  "r": 883
 },
 {
  "id": 162983,
  "name": "Undead Girl Murder Farce",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx162983-T3nZyk6sUlEj.jpg",
  "year": 2023,
  "al": ["Undead Murder Farce", "アンデッドガール・マーダーファルス", "Фарс убитой нежити", "不死少女的谋杀闹剧"],
  "r": 884
 },
 {
  "id": 136707,
  "name": "Isekai Yakkyoku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx136707-StRFbEwZT7q5.jpg",
  "year": 2022,
  "al": ["Parallel World Pharmacy", "異世界薬局", "เภสัชกรเทพสองโลก", "奇幻世界药局"],
  "r": 885
 },
 {
  "id": 170695,
  "name": "Ore wa Subete wo [Parry] Suru: Gyaku Kanchigai no Sekai Saikyou wa Boukensha ni Naritai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170695-Nb1DIg7gIHCF.jpg",
  "year": 2024,
  "al": ["I Parry Everything", "俺は全てを【パリイ】する ～逆勘違いの世界最強は冒険者になりたい～", "I Parry Everything: What Do You Mean I'm the Strongest? I'm Not Even an Adventurer Yet!", "I Parry Everything to Become the Greatest Adventure!"],
  "r": 886
 },
 {
  "id": 157198,
  "name": "Dead Mount Death Play",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx157198-LVZ7PgxWwc6v.jpg",
  "year": 2023,
  "al": ["デッドマウント・デスプレイ", "屍體如山的死亡遊戲", "DMDP"],
  "r": 887
 },
 {
  "id": 20968,
  "name": "Kokoro ga Sakebitagatterun da.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20968-0zFVsoFUYjeh.jpg",
  "year": 2015,
  "al": ["The Anthem of the Heart", "心が叫びたがってるんだ。", "Kokosake", "El Himno del Corazón", "The Anthem of the Heart: Beautiful Word Beautiful World", "Jun La voix du Coeur", "เมื่อใจกู่ร้องอยากบอกโลก"],
  "r": 888
 },
 {
  "id": 176273,
  "name": "Zenshuu.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx176273-raxxcgkslf4Q.jpg",
  "year": 2025,
  "al": ["ZENSHU", "全修。", "เซ็นชู"],
  "r": 889
 },
 {
  "id": 170083,
  "name": "Dragon Ball DAIMA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170083-GTwRrhTApcLR.png",
  "year": 2024,
  "al": ["ドラゴンボールDAIMA", "ドラゴンボール ダイマ", "Драконий жемчуг Дайма"],
  "r": 890
 },
 {
  "id": 21377,
  "name": "Kuroko no Basket: Last Game",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21377-oRcPPiQ1btPZ.jpg",
  "year": 2017,
  "al": ["Kuroko's Basketball: Last Game", "劇場版 黒子のバスケ Last Game", "Kuroko no Basket: EXTRA GAME", "Το Μπάσκετ του Κουρόκο: Το Τελευταίο Παιχνίδι"],
  "r": 891
 },
 {
  "id": 20593,
  "name": "Hanamonogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20593-ri6S0Qt3mFkv.jpg",
  "year": 2014,
  "al": ["花物語", "Monogatari Series Second Season +α", "ปกรณัมแห่งบุปผา"],
  "r": 892
 },
 {
  "id": 8769,
  "name": "Ore no Imouto ga Konna ni Kawaii Wake ga Nai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx8769-Lat76qlOwdBN.jpg",
  "year": 2010,
  "al": ["Oreimo", "俺の妹がこんなに可愛いわけがない", "My Little Sister Can't Be This Cute", "我的妹妹哪有这么可爱！", "น้องสาวของผมไม่น่ารักขนาดนั้นหรอก"],
  "r": 893
 },
 {
  "id": 109979,
  "name": "Kimitachi wa Dou Ikiru ka",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx109979-BRHXpBkCw4oc.jpg",
  "year": 2023,
  "al": ["The Boy and the Heron", "君たちはどう生きるか", "How Do You Live?", "Il ragazzo e l’airone", "Chłopiec i czapla", "Le Garçon et le Héron", "Gutten og hegren", "Pojken och hägern"],
  "r": 894
 },
 {
  "id": 131548,
  "name": "Akebi-chan no Sailor Fuku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131548-4OXik3SWOaee.jpg",
  "year": 2022,
  "al": ["Akebi’s Sailor Uniform", "明日ちゃんのセーラー服", "Akebi-chan no Serafuku", "Akebi's School Uniform", "ชุดกะลาสีของอาเคบิจัง"],
  "r": 895
 },
 {
  "id": 144092,
  "name": "Benriya Saitou-san, Isekai ni Iku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx144092-8EKzzZQofFlW.jpg",
  "year": 2023,
  "al": ["Handyman Saitou in Another World", "便利屋斎藤さん、異世界に行く"],
  "r": 896
 },
 {
  "id": 130592,
  "name": "Hataraku Maou-sama!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx130592-LAUlhx15mxQu.jpg",
  "year": 2022,
  "al": ["The Devil is a Part-Timer! Season 2", "はたらく魔王さま！！", "ผู้กล้าซึนซ่าส์กับจอมมารสู้ชีวิต ภาค 2", "Hataraku Maou-sama! 2", "The Devil is a Part-Timer!!", "Hataraku Maou-sama 2nd Season", "打工吧！魔王大人 第二季", "Raja Iblis Nyambi! Musim Kedua"],
  "r": 897
 },
 {
  "id": 107226,
  "name": "Dumbbell Nan Kilo Moteru?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107226-zIyl8iIdR8JA.png",
  "year": 2019,
  "al": ["How Heavy Are the Dumbbells You Lift?", "ダンベル何キロ持てる？", "How Many Kilograms are the Dumbbells You Lift?", "Danberu Nan Kiro Moteru?", "Dumbbell : Combien tu peux soulever ?", "แก๊งสาวป่วน ก๊วนฟิตเนส"],
  "r": 898
 },
 {
  "id": 202269,
  "name": "Toumei na Yoru ni Kakeru Kimi to, Me ni Mienai Koi wo Shita.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx202269-7KNj8s2fSsJJ.jpg",
  "year": 2026,
  "al": ["Love Unseen Beneath the Clear Night Sky", "透明な夜に駆ける君と、目に見えない恋をした。", "かけ恋", "Kakekoi", "Un amour invisible", "รักที่มองไม่เห็น ด้วยตา กับเธอในค่ำคืนที่แสนจะเลือนราง"],
  "r": 899
 },
 {
  "id": 98596,
  "name": "Imouto sae Ireba Ii.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98596-E2aZouOyuQ8G.jpg",
  "year": 2017,
  "al": ["A Sister's All You Need.", "妹さえいればいい。", "Imoto sae Ireba Ii.", "A Sister's All You Need", "It'd be Good if Only Little Sister Was Here", "Imosae", "Imoutosae", "Imotosae"],
  "r": 900
 },
 {
  "id": 20541,
  "name": "Mekakucity Actors",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20541-vEenrRZqApRn.jpg",
  "year": 2014,
  "al": ["メカクシティアクターズ", "Kagerou Days", "Heat-Haze Days", "Mekaku City Actors", "Kagerou Project"],
  "r": 901
 },
 {
  "id": 20918,
  "name": "Tsukimonogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20918-8Gp6nJpbjFgr.jpg",
  "year": 2014,
  "al": ["憑物語", "Possession Tale"],
  "r": 902
 },
 {
  "id": 107490,
  "name": "Machikado Mazoku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107490-OaUP9KSAJQt9.png",
  "year": 2019,
  "al": ["The Demon Girl Next Door", "まちカドまぞく", "Street Corner Demon", "街角魔族"],
  "r": 903
 },
 {
  "id": 195604,
  "name": "Black Clover 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx195604-8xUI10lVVhPY.jpg",
  "year": 2026,
  "al": ["Black Clover Season 2", "ブラッククローバー 第2期"],
  "r": 904
 },
 {
  "id": 116741,
  "name": "Tensei Shitara Slime Datta Ken: Tensura Nikki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116741-MI9aI2ikNyAP.jpg",
  "year": 2021,
  "al": ["The Slime Diaries", "転生したらスライムだった件 転スラ日記", "The Slime Diaries: That Time I Got Reincarnated as a Slime", "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว : เดอะ สไลม์ ไดอารี่", "关于我转生变成史莱姆这档事 转生史莱姆日记", "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว ไดอารี่ของสไลม์"],
  "r": 905
 },
 {
  "id": 165171,
  "name": "Medalist",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx165171-an9pyRXwVxJS.jpg",
  "year": 2025,
  "al": ["メダリスト", "金牌得主"],
  "r": 906
 },
 {
  "id": 21341,
  "name": "Ajin",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21341-Pyc7SkMEuGsl.jpg",
  "year": 2016,
  "al": ["AJIN: Demi-Human", "亜人", "AJIN: Semihumano", "อาจิน สายพันธุ์อมนุษย์", "أجين: أنصاف البشر"],
  "r": 907
 },
 {
  "id": 20849,
  "name": "GOD EATER",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20849-TvJpY8iLEcYG.jpg",
  "year": 2015,
  "al": ["ゴッドイーター"],
  "r": 908
 },
 {
  "id": 15315,
  "name": "Mondaiji-tachi ga Isekai kara Kuru Sou desu yo?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx15315-mvKPcy8Z2QkB.jpg",
  "year": 2013,
  "al": ["Problem Children Are Coming From Another World, Aren't They?", "問題児たちが異世界から来るそうですよ?", "ตัวป่วนชั้นเซียน มาตบเกรียนถึงต่างโลก", "문제아들이 이세계에서 온다는 모양인데요?", "문제아들이 다른 세계에서 온다는 모양인데요?"],
  "r": 909
 },
 {
  "id": 3457,
  "name": "Vampire Knight",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx3457-owSEHJYvflx5.jpg",
  "year": 2008,
  "al": ["ヴァンパイア騎士", "Vampire Kishi", "El Caballero Vampiro"],
  "r": 910
 },
 {
  "id": 126659,
  "name": "Boku no Hero Academia THE MOVIE: World Heroes' Mission",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx126659-i6c1PsXHGyke.jpg",
  "year": 2021,
  "al": ["My Hero Academia: World Heroes' Mission", "僕のヒーローアカデミア THE MOVIE ワールド ヒーローズ ミッション", "My Hero Academia the Movie 3", "My Hero Academia: Misión Mundial de Héroes", "My Hero Academia: Missão Mundial de Heróis", "มาย ฮีโร่ อาคาเดเมีย : รวมพลฮีโร่กู้วิกฤตโลก"],
  "r": 911
 },
 {
  "id": 20666,
  "name": "Space☆Dandy 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20666-uuCrKd28BFsT.jpg",
  "year": 2014,
  "al": ["Space Dandy 2", "スペース☆ダンディ 2"],
  "r": 912
 },
 {
  "id": 156891,
  "name": "Saijaku Tamer wa Gomi Hiroi no Tabi wo Hajimemashita.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx156891-bw91QNdptQEG.jpg",
  "year": 2024,
  "al": ["The Weakest Tamer Began a Journey to Pick Up Trash", "最弱テイマーはゴミ拾いの旅を始めました。", "การผจญภัยของเทมเมอร์มือใหม่กับสไลม์สุดด๋อย", "最弱魔物使開始了撿垃圾之旅。", "Слабейшая укротительница отправляется в путешествие по сбору мусора", "Kẻ Thuần Hóa Yếu Nhất Bắt Đầu Hành Trình Nhặt Rác"],
  "r": 913
 },
 {
  "id": 98385,
  "name": "Koi wa Ameagari no You ni",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98385-GYmOoxtwWVhz.jpg",
  "year": 2018,
  "al": ["After the Rain", "恋は雨上がりのように", "KoiAme", "Love is Like after the Rain", "Depois da Chuva", "Dopo la pioggia", "Après la pluie", "เส้นทางชีวิต ลิขิตหัวใจ"],
  "r": 914
 },
 {
  "id": 158559,
  "name": "2.5 Jigen no Ririsa",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx158559-yCnnnedsSCie.jpg",
  "year": 2024,
  "al": ["2.5 Dimensional Seduction", "2.5次元の誘惑", "2.5 Jigen no Yuuwaku", "2.5 มิติ ริริสะ", "Ririsa of 2.5 Dimension", "にごリリ", "Nigoriri", "Ririsa, uma Garota em 2.5D"],
  "r": 915
 },
 {
  "id": 148048,
  "name": "Kaminaki Sekai no Kamisama Katsudou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx148048-IaEk51Wtu07L.jpg",
  "year": 2023,
  "al": ["KamiKatsu: Working for God in a Godless World", "神無き世界のカミサマ活動", "What God Does in a World Without Gods", "KamiKatsu: Atividades Divinas em um Mundo sem Deuses", "Kamisama : Opération Divine", "KamiKatsu", "KamiKatsu: Meine Arbeit als Missionar in einer gottlosen Welt", "โลกนี้ โลกหน้า ข้าก็เป็นพระเจ้า"],
  "r": 916
 },
 {
  "id": 11633,
  "name": "Blood Lad",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11633-vIjtabJq64Xt.jpg",
  "year": 2013,
  "al": ["ブラッドラッド"],
  "r": 917
 },
 {
  "id": 113359,
  "name": "NOMAD: Megalo Box 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113359-FnjG2VppJF9f.png",
  "year": 2021,
  "al": ["MEGALOBOX 2: NOMAD", "NOMAD メガロボクス2", "เมกาโล่บ็อกซ์ เจ้าสังเวียนพันธุ์แกร่ง ภาค 2"],
  "r": 918
 },
 {
  "id": 210,
  "name": "Ranma 1/2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx210-qgahLDYT0t9b.png",
  "year": 1989,
  "al": ["Ranma ½", "らんま1/2", "ينبوع الأحلام", "รันม่า1/2 ไอ้หนุ่มกังฟู"],
  "r": 919
 },
 {
  "id": 20632,
  "name": "Aldnoah.Zero",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx20632-Mkgbtvi1kmhD.jpg",
  "year": 2014,
  "al": ["アルドノア・ゼロ", "A/Z", "ALDNOAH.ZERO: Let Justice Be Done, Though The Heavens Fall."],
  "r": 920
 },
 {
  "id": 151639,
  "name": "Ninja Kamui",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx151639-7KqJ7BgaM9Mx.png",
  "year": 2024,
  "al": [],
  "r": 921
 },
 {
  "id": 8675,
  "name": "Seitokai Yakuindomo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx8675-5H2QSLvXA7bH.jpg",
  "year": 2010,
  "al": ["生徒会役員共"],
  "r": 922
 },
 {
  "id": 116005,
  "name": "NOBLESSE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116005-yfngIe9aBaJw.jpg",
  "year": 2020,
  "al": ["NOBLESSE -ノブレス-"],
  "r": 923
 },
 {
  "id": 239,
  "name": "Gankutsuou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx239-eldiiZxky1Ul.png",
  "year": 2004,
  "al": ["Gankutsuou: The Count of Monte Cristo", "巌窟王", "גנקוטסואו: הרוזן ממונטה כריסטו", "Il conte di Montecristo", "Gankutsuou: Hrabia Monte Cristo", "غانكوتسو: الكونت دي مونت كريستو"],
  "r": 924
 },
 {
  "id": 5258,
  "name": "Hajime no Ippo: New Challenger",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5258-Qn6GBiSY57iT.jpg",
  "year": 2009,
  "al": ["Hajime no Ippo: The Fighting! New Challenger", "はじめの一歩 New Challenger", "Hajime no Ippo Season II", "Hajime no Ippo 2", "Fighting Spirit: New Challenger", "Hajime no Ippo: A Luta! - Um Novo Desafiante"],
  "r": 925
 },
 {
  "id": 5205,
  "name": "Kara no Kyoukai: Satsujin Kousatsu (Kou)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5205-kfgpEQI8ERza.jpg",
  "year": 2009,
  "al": ["the Garden of sinners Chapter 7: ……not nothing heart. (Murder Speculation Part B)", "空の境界 殺人考察(後)", "The Garden of Sinners: Murder Speculation Part B (...not nothing heart.)"],
  "r": 926
 },
 {
  "id": 801,
  "name": "Koukaku Kidoutai: Stand Alone Complex 2nd GIG",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx801-nF9RyvPJu6s4.jpg",
  "year": 2004,
  "al": ["Ghost in the Shell: Stand Alone Complex 2nd GIG", "攻殻機動隊 S.A.C. 2nd GIG", "Koukaku Kidoutai S.A.C. 2nd GIG", "Ghost In The Shell S.A.C. 2nd GIG"],
  "r": 927
 },
 {
  "id": 97731,
  "name": "Shelter",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx97731-gYxm0WorfNPM.png",
  "year": 2016,
  "al": ["シェルター", "Shelter The Animation"],
  "r": 928
 },
 {
  "id": 160900,
  "name": "Hametsu no Oukoku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx160900-GxVB6H5ewrqv.jpg",
  "year": 2023,
  "al": ["The Kingdoms of Ruin", "はめつのおうこく", "Os Reinos da Ruína", "破滅的王國"],
  "r": 929
 },
 {
  "id": 5040,
  "name": "One Outs",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5040-9ruuekq2LZKJ.png",
  "year": 2008,
  "al": ["ワンナウツ", "ONE OUTS - Nobody wins, but I!"],
  "r": 930
 },
 {
  "id": 20671,
  "name": "Log Horizon 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20671-ZpNJQ5RixVIq.jpg",
  "year": 2014,
  "al": ["ログ・ホライズン 2"],
  "r": 931
 },
 {
  "id": 116867,
  "name": "Itai no wa Iya nano de Bougyoryoku ni Kyokufuri Shitai to Omoimasu. 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116867-bXUSi1BWrd9R.jpg",
  "year": 2023,
  "al": ["BOFURI: I Don't Want to Get Hurt, so I'll Max Out My Defense. Season 2", "痛いのは嫌なので防御力に極振りしたいと思います。2", "น้องโล่สายแทงก์แกร่งเกินร้อย ภาค 2", "Bofuri 2", "Aku Tidak Ingin Terluka Jadi Seluruh Poin Status Kufokuskan ke Pertahanan 2", "Бофури. Я боюсь боли, так что качаю только защиту 2", "BOFURI: Je suis pas venue ici pour souffrir alors j'ai tout mis en défense. S2"],
  "r": 932
 },
 {
  "id": 107871,
  "name": "Princess Connect! Re:Dive",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107871-ZOh7oeDd0kq9.png",
  "year": 2020,
  "al": ["プリンセスコネクト！Re:Dive", "Priconne", "ปรินเซส คอนเนค รี: ไดฟ์"],
  "r": 933
 },
 {
  "id": 139648,
  "name": "Genjitsu Shugi Yuusha no Oukoku Saikenki Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139648-Gc88ZbCFeKCQ.jpg",
  "year": 2022,
  "al": ["How a Realist Hero Rebuilt the Kingdom Part 2", "現実主義勇者の王国再建記 第二部", "ยุทธศาสตร์กู้ชาติของราชามือใหม่ พาร์ท 2", "Genkoku Part 2", "Genjitsu Shugi Yuusha no Oukoku Saikenki (2022)"],
  "r": 934
 },
 {
  "id": 110355,
  "name": "Golden Kamuy 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx110355-yXOXm5tr8kgr.png",
  "year": 2020,
  "al": ["Golden Kamuy Season 3", "ゴールデンカムイ 第三期", "Golden Kamui 3"],
  "r": 935
 },
 {
  "id": 138424,
  "name": "Karakai Jouzu no Takagi-san 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx138424-97Nz1P7M3O2d.png",
  "year": 2022,
  "al": ["Teasing Master Takagi-san Season 3", "からかい上手の高木さん３", "แกล้งนัก รักนะรู้ยัง ภาค 3"],
  "r": 936
 },
 {
  "id": 109287,
  "name": "Adachi to Shimamura",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx109287-yHDlERSIEjsL.jpg",
  "year": 2020,
  "al": ["Adachi and Shimamura", "安達としまむら", "AdaShima", "Адати и Симамура"],
  "r": 937
 },
 {
  "id": 99916,
  "name": "Asagao to Kase-san.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99916-1GGvAujPHu6F.png",
  "year": 2018,
  "al": ["Kase-san and Morning Glories", "あさがおと加瀬さん。", "คุณคาเซะกับดอกบานเช้า"],
  "r": 938
 },
 {
  "id": 132010,
  "name": "Koi wa Sekai Seifuku no Ato de",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx132010-s0o3Rg0XvDXl.jpg",
  "year": 2022,
  "al": ["Love After World Domination", "恋は世界征服のあとで", "รักเรานั้นไว้หลังครองโลก", "รักหลังครองโลก", "Koiseka"],
  "r": 939
 },
 {
  "id": 2593,
  "name": "Kara no Kyoukai: Fukan Fuukei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2593-FsRHa8PIl2OJ.jpg",
  "year": 2007,
  "al": ["the Garden of sinners Chapter 1: Thanatos. (Overlooking View)", "空の境界 俯瞰風景"],
  "r": 940
 },
 {
  "id": 163078,
  "name": "Yoru no Kurage wa Oyogenai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163078-akhThKoWpWOb.jpg",
  "year": 2024,
  "al": ["Jellyfish Can’t Swim in the Night", "夜のクラゲは泳げない", "YoruKura", "ヨルクラ", "Meduzy nie pływają same", "แมงกะพรุนว่ายน้ำตอนกลางคืนไม่ได้หรอกนะ"],
  "r": 941
 },
 {
  "id": 18245,
  "name": "WHITE ALBUM 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx18245-7eMtaBsi00dl.jpg",
  "year": 2013,
  "al": ["WA2", "ホワイトアルバム2"],
  "r": 942
 },
 {
  "id": 158417,
  "name": "Sentai Daishikkaku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx158417-Ii0DOFwNim0A.jpg",
  "year": 2024,
  "al": ["Go! Go! Loser Ranger!", "戦隊大失格", "Ranger Reject", "ขบวนการกำมะลอ", "No Longer Rangers"],
  "r": 943
 },
 {
  "id": 21290,
  "name": "Netoge no Yome wa Onnanoko ja Nai to Omotta?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21290-R6qYWnylwpbL.png",
  "year": 2016,
  "al": ["And you thought there is never a girl online?", "ネトゲの嫁は女の子じゃないと思った?", "NetoYome", "Netgame no Yome wa Onna no Ko ja Nai to Omotta?", "ถามหน่อยครับ คิดว่าเจ้าสาวผมในเกมออนไลน์เป็นผู้หญิงจริงหรือเปล่า?"],
  "r": 944
 },
 {
  "id": 119683,
  "name": "EDENS ZERO",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx119683-BC4i4dF5DGNO.jpg",
  "year": 2021,
  "al": ["エデンズゼロ", "إيدينز زيرو", "אדנס זירו", "เอเดนส์ซีโร่", "НУЛЕВОЙ ЭДЕМ"],
  "r": 945
 },
 {
  "id": 141182,
  "name": "Seirei Gensouki 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx141182-xNtdR0PenhRR.jpg",
  "year": 2024,
  "al": ["Seirei Gensouki: Spirit Chronicles Season 2", "精霊幻想記2", "ตำนานวิญญาณแฟนซี ภาค 2", "精灵幻想记吧2"],
  "r": 946
 },
 {
  "id": 101571,
  "name": "Aggressive Retsuko",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b101571-7vzCaj13jkGS.jpg",
  "year": 2018,
  "al": ["Aggretsuko", "アグレッシブ烈子", "Η Ρέτσουκο Έξω Φρενών"],
  "r": 947
 },
 {
  "id": 154391,
  "name": "Jitsu wa Ore, Saikyou Deshita?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154391-IEyLPkJBsMxO.jpg",
  "year": 2023,
  "al": ["Am I Actually the Strongest?", "実は俺、最強でした？", "ผมเทพสุดจริงเหรอ?", "Я что, сильнейший?", "É Sério Que Eu Sou o Mais Forte?"],
  "r": 948
 },
 {
  "id": 2418,
  "name": "Stranger: Mukou Hadan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx2418-AoLtfG2da5yo.jpg",
  "year": 2007,
  "al": ["Sword of the Stranger", "ストレンヂア -無皇刃譚-", "Stranger: Mukoh Hadan"],
  "r": 949
 },
 {
  "id": 127401,
  "name": "Platinum End",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx127401-fVKVbuIE5W5Q.jpg",
  "year": 2021,
  "al": ["プラチナエンド"],
  "r": 950
 },
 {
  "id": 146625,
  "name": "Engage Kiss",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx146625-DmXjpJ2y8fDn.jpg",
  "year": 2022,
  "al": ["エンゲージ・キス", "Project Engage", "Клятвенный поцелуй"],
  "r": 951
 },
 {
  "id": 179955,
  "name": "Katainaka no Ossan, Kensei ni Naru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx179955-e4UPTow92B1O.jpg",
  "year": 2025,
  "al": ["From Old Country Bumpkin to Master Swordsman", "片田舎のおっさん、剣聖になる", "Katainaka no Ossan, Kensei ni Naru: Tada no Inaka no Kenjutsu Shihan datta noni, Taisei Shita Deshitachi ga Ore wo Houttekurenai Ken", "片田舎のおっさん、剣聖になる ～ただの田舎の剣術師範だったのに、大成した弟子たちが俺を放ってくれない件～", "Wieśniak mistrzem miecza", "De Caipira a Mestre Espadachim", "Pria Tua Pedesaan Menjadi Pendekar Pedang Elite", "Daripada Orang Kampung Biasa kepada Mahaguru Pedang"],
  "r": 952
 },
 {
  "id": 874,
  "name": "Digimon Tamers",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx874-3uug3PiSeyf7.jpg",
  "year": 2001,
  "al": ["デジモンテイマーズ", "Digimon: Digital Monsters 03"],
  "r": 953
 },
 {
  "id": 15227,
  "name": "Kono Sekai no Katasumi ni",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx15227-1tG3lhprG0A9.jpg",
  "year": 2016,
  "al": ["In This Corner of the World", "この世界の片隅に", "To All the Corners of the World", "En Este Rincón del Mundo", "Dans un recoin de ce monde", "Ở một góc nhân gian", "W tym zakątku świata", "In questo angolo di mondo"],
  "r": 954
 },
 {
  "id": 100526,
  "name": "3D Kanojo: Real Girl",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100526-Hw6U34Hw2TDb.jpg",
  "year": 2018,
  "al": ["Real Girl", "3D彼女 リアルガール", "3D Girlfriend", "Three D Kanojo Real Girl"],
  "r": 955
 },
 {
  "id": 4087,
  "name": "Michiko to Hatchin",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx4087-TMc9A0GSKiJf.png",
  "year": 2008,
  "al": ["Michiko & Hatchin", "ミチコとハッチン", "Michiko e Hatchin"],
  "r": 956
 },
 {
  "id": 19703,
  "name": "Kyousougiga (TV)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx19703-OpohqKDqXIp9.png",
  "year": 2013,
  "al": ["Kyousougiga", "京騒戯画 (TV)", "Kyousogiga", "Kyousou Giga"],
  "r": 957
 },
 {
  "id": 178462,
  "name": "Class no Daikirai na Joshi to Kekkon Suru Koto ni Natta.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178462-YW6BgSGGP4az.jpg",
  "year": 2025,
  "al": ["I'm Getting Married to a Girl I Hate in My Class", "クラスの大嫌いな女子と結婚することになった。", "Kurakon", "クラ婚", "クラコン", "Cla-Kon"],
  "r": 958
 },
 {
  "id": 207141,
  "name": "Yani Neko",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx207141-h5q5KJPd6vaX.jpg",
  "year": 2026,
  "al": ["Chainsmoker Cat", "ヤニねこ", "แมวสาวอมควัน", "尼古喵喵"],
  "r": 959
 },
 {
  "id": 186794,
  "name": "Ansatsusha de Aru Ore no Status ga Yuusha yori mo Akiraka ni Tsuyoi no da ga",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx186794-Ns8xWNdMdOxq.jpg",
  "year": 2025,
  "al": ["My Status as an Assassin Obviously Exceeds the Hero’s", "暗殺者である俺のステータスが 勇者よりも明らかに強いのだが", "Sutetsuyo", "ステつよ", "ถึงเป็นแค่นักฆ่า แต่ดูยังไงข้าก็เทพกว่าผู้กล้าซะอีก"],
  "r": 960
 },
 {
  "id": 139820,
  "name": "Akuyaku Reijou nano de Last Boss wo Kattemimashita",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139820-T8Nk5dRd3q9L.jpg",
  "year": 2022,
  "al": ["I'm the Villainess, So I'm Taming the Final Boss", "悪役令嬢なのでラスボスを飼ってみました", "作为恶役大小姐就该养魔王", "悪ラス", "AkuLast", "AkuRasu"],
  "r": 961
 },
 {
  "id": 158028,
  "name": "Sokushi Cheat ga Saikyou Sugite, Isekai no Yatsura ga Marude Aite ni Naranai n desu ga.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx158028-gQ2vnz7LEb0E.jpg",
  "year": 2024,
  "al": ["My Instant Death Ability is Overpowered", "即死チートが最強すぎて、異世界のやつらがまるで相手にならないんですが。", "Sokushicheat", "My Instant Death Ability Is So Overpowered, No One in This Other World Stands a Chance Against Me!"],
  "r": 962
 },
 {
  "id": 169417,
  "name": "Re:Monster",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx169417-izsfKg0hasRd.png",
  "year": 2024,
  "al": ["リ・モンスター"],
  "r": 963
 },
 {
  "id": 1292,
  "name": "Afro Samurai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1292-FcyYgq7Ly34H.png",
  "year": 2007,
  "al": ["アフロサムライ"],
  "r": 964
 },
 {
  "id": 113693,
  "name": "Honzuki no Gekokujou: Shisho ni Naru Tame ni wa Shudan wo Erandeiraremasen 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113693-3tHbslFxD47R.jpg",
  "year": 2020,
  "al": ["Ascendance of a Bookworm Part 2", "本好きの下剋上 司書になるためには手段を選んでいられません 第2期", "Ascendance of a Bookworm Season 2", "爱书的下克上：为了成为图书管理员不择手段！2", "หนอนหนังสือยึดอำนาจ ภาค 2"],
  "r": 965
 },
 {
  "id": 123802,
  "name": "Seijo no Maryoku wa Bannou desu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx123802-FpGzlfjebl0z.jpg",
  "year": 2021,
  "al": ["The Saint's Magic Power is Omnipotent", "聖女の魔力は万能です", "The power of the saint is all around", "圣女的魔力是万能的", "สตรีศักดิ์สิทธิ์อิทธิฤทธิ์สารพัดอย่าง", "Kekuatan Sihir Santa Sungguh Mahaguna"],
  "r": 966
 },
 {
  "id": 100049,
  "name": "Re:Zero kara Hajimeru Isekai Seikatsu OVAs",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx100049-mgvPLctBJprp.jpg",
  "year": 2018,
  "al": ["Re:ZERO -Starting Life in Another World- OVAs", "Re:ゼロから始める異世界生活 OVAs", "Re:ZERO -Starting Life in Another World- Memory Snow", "Re:ZERO -Starting Life in Another World- The Frozen Bond", "Re:Zero kara Hajimeru Isekai Seikatsu - Memory Snow", "Re:Zero kara Hajimeru Isekai Seikatsu: Hyouketsu no Kizuna", "Re:ゼロから始める異世界生活 Memory Snow", "Re:ゼロから始める異世界生活 氷結の絆"],
  "r": 967
 },
 {
  "id": 146953,
  "name": "Masamune-kun no Revenge R",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx146953-80YtZNkpbhIA.jpg",
  "year": 2023,
  "al": ["Masamune-kun's Revenge R", "政宗くんのリベンジR", "Masamune-kun’s Revenge Season 2", "Masamune-kun no Revenge 2nd Season", "การแก้แค้นของมาซามุเนะคุง ภาค 2"],
  "r": 968
 },
 {
  "id": 132473,
  "name": "Saihate no Paladin",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx132473-L64hP24nJyEV.jpg",
  "year": 2021,
  "al": ["The Faraway Paladin", "最果てのパラディン", "พาลาดิน ยอดอัศวินจากแดนไกล"],
  "r": 969
 },
 {
  "id": 175872,
  "name": "Isshun de Chiryou Shiteita no ni Yakutatazu to Tsuihou Sareta Tensai Chiyushi, Yami Healer Toshite Tanoshiku Ikiru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx175872-d55nfiC4WWHO.jpg",
  "year": 2025,
  "al": ["The Brilliant Healer's New Life in the Shadows", "一瞬で治療していたのに役立たずと追放された天才治癒師、闇ヒーラーとして楽しく生きる", "闇ヒーラー", "Cuộc Sống Mới Trong Bóng Tối Của Trị Liệu Sư Tài Ba", "瞬間治癒卻被當成廢物踢出隊伍的天才治療師，改當無照治療師快樂過活", "Yami Healer"],
  "r": 970
 },
 {
  "id": 95,
  "name": "∀ Gundam",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx95-5okHk1B0VKro.jpg",
  "year": 1999,
  "al": ["Turn A Gundam", "∀ガンダム", "Mobile Suit Gundam Turn A"],
  "r": 971
 },
 {
  "id": 10029,
  "name": "Coquelicot-zaka kara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10029-R7iZdjWuzeYq.png",
  "year": 2011,
  "al": ["From Up on Poppy Hill", "コクリコ坂から", "Kokuriko-saka kara", "Kokuriko-zaka kara", "La Colina de las Amapolas", "Da Colina Kokuriko", "La collina dei papaveri", "A Colina das Papoilas"],
  "r": 972
 },
 {
  "id": 11759,
  "name": "Accel World",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11759-o3ZRpFYnP5Lc.jpg",
  "year": 2012,
  "al": ["アクセル・ワールド", "Accelerated World"],
  "r": 973
 },
 {
  "id": 153818,
  "name": "Majo to Yajuu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153818-FWvl0RL6vDbq.png",
  "year": 2024,
  "al": ["The Witch and the Beast", "魔女と野獣", "Ведьма и зверь", "Відьма та чудовисько"],
  "r": 974
 },
 {
  "id": 148116,
  "name": "Hyouken no Majutsushi ga Sekai wo Suberu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx148116-t6E73U8SJhYD.jpg",
  "year": 2023,
  "al": ["The Iceblade Sorcerer Shall Rule the World", "冰剣の魔術師が世界を統べる"],
  "r": 975
 },
 {
  "id": 1254,
  "name": "Saint Seiya",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/1254.jpg",
  "year": 1986,
  "al": ["Saint Seiya: Knights of the Zodiac", "聖闘士星矢", "Knights of the Zodiac", "Zodiac Knights", "セイントセイヤ", "Saint Seiya: Los Caballeros del Zodiaco", "Os Cavaleiros do Zodíaco", "Les Chevaliers du Zodiaque"],
  "r": 976
 },
 {
  "id": 14349,
  "name": "Little Witch Academia",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14349-zvSfbgjZr4LW.jpg",
  "year": 2013,
  "al": ["リトルウィッチアカデミア", "LWA", "Wakate Animator Ikusei Project", "2012 Young Animator Training Project", "Anime Mirai 2012"],
  "r": 977
 },
 {
  "id": 21686,
  "name": "Watashi ga Motete Dousunda",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21686-N3dWHyKnzoKk.jpg",
  "year": 2016,
  "al": ["Kiss Him, Not Me", "私がモテてどうすんだ", "私モテ", "WatashiMote", "WataMote", "Bésalo a él, no a mí", "Aku Jadi Populer, Gimana Sih?"],
  "r": 978
 },
 {
  "id": 329,
  "name": "Planetes",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx329-4xwXdazRA7Ph.png",
  "year": 2003,
  "al": ["プラネテス", "ΠΛΑΝΗΤΕΣ"],
  "r": 979
 },
 {
  "id": 16918,
  "name": "Gin no Saji",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16918-0biAxYFR29mw.png",
  "year": 2013,
  "al": ["Silver Spoon", "銀の匙", "Ginsaji"],
  "r": 980
 },
 {
  "id": 1029,
  "name": "Omoide Poro Poro",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx1029-Ch9LIVLFnssA.jpg",
  "year": 1991,
  "al": ["Only Yesterday", "おもひでぽろぽろ", "Omoide Poro-poro", "Memories Like Falling Rain Drops", "Memories Like Falling Teardrops", "Recuerdos del Ayer", "Memórias de Ontem", "Dün Gibi"],
  "r": 981
 },
 {
  "id": 127412,
  "name": "Taishou Otome Otogibanashi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx127412-dpHXV2X9tskV.jpg",
  "year": 2021,
  "al": ["Taisho Otome Fairy Tale", "大正オトメ御伽話", "เรื่องเล่าของสาวน้อยยุคไทโช", "Kisah Gadis Zaman Taisho"],
  "r": 982
 },
 {
  "id": 170577,
  "name": "Tondemo Skill de Isekai Hourou Meshi 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170577-ocYSFAcry7ty.jpg",
  "year": 2025,
  "al": ["Campfire Cooking in Another World with my Absurd Skill Season 2", "とんでもスキルで異世界放浪メシ2", "とんでもスキルで異世界放浪メシ 第2期", "Tondemo Skill de Isekai Hourou Meshi 2nd Season", "สกิลสุดพิสดารกับมื้ออาหารในต่างโลก ซีซั่น 2", "Кулинар со странными навыками в параллельном мире 2", "擁有超常技能的異世界流浪美食家 S2"],
  "r": 983
 },
 {
  "id": 100402,
  "name": "Tsurune: Kazemai Koukou Kyuudou-bu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100402-eDxanr9DiBuV.jpg",
  "year": 2018,
  "al": ["Tsurune", "ツルネ ―風舞高校弓道部―", "Tsurune - Il tiro che unisce"],
  "r": 984
 },
 {
  "id": 129192,
  "name": "Tensei Kenja no Isekai Life: Daini no Shokugyou wo Ete, Sekai Saikyou ni Narimashita",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx129192-p9qQ3GNgoqnS.jpg",
  "year": 2022,
  "al": ["My Isekai Life: I Gained a Second Character Class and Became the Strongest Sage in the World!", "転生賢者の異世界ライフ ～第二の職業を得て、世界最強になりました～", "เกิดใหม่ในต่างโลกเป็นปราชญ์แกร่งสุดโดยไม่รู้ตัว"],
  "r": 985
 },
 {
  "id": 173295,
  "name": "Shoushimin Series",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx173295-5DIOnrTYiF0a.jpg",
  "year": 2024,
  "al": ["SHOSHIMIN: How to Become Ordinary", "小市民シリーズ", "小市民系列"],
  "r": 986
 },
 {
  "id": 16201,
  "name": "Aku no Hana",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16201-rYR0GXDBve8Y.jpg",
  "year": 2013,
  "al": ["Flowers of Evil", "惡の華", "Kwiaty zła"],
  "r": 987
 },
 {
  "id": 112625,
  "name": "Saiki Kusuo no Ψ-nan: Ψ-shidou-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b112625-5Qi2PEQqITCa.jpg",
  "year": 2019,
  "al": ["The Disastrous Life of Saiki K.: Reawakened", "斉木楠雄のΨ難 Ψ始動編", "The Disastrous Life of Saiki K.", "Starting Arc"],
  "r": 988
 },
 {
  "id": 163142,
  "name": "Kikansha no Mahou wa Tokubetsu desu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163142-RjFeJrTnDA2B.png",
  "year": 2023,
  "al": ["A Returner's Magic Should Be Special", "帰還者の魔法は特別です", "Gwihwanjaui Mabeobeun Teukbyeolhaeya Hamnida", "귀환자의 마법은 특별해야 합니다"],
  "r": 989
 },
 {
  "id": 210031,
  "name": "Seihantai na Kimi to Boku 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx210031-TppgcHZh46LY.jpg",
  "year": 2026,
  "al": ["You and I Are Polar Opposites Season 2", "正反対な君と僕 第2期", "ลุ้นรักฉบับคู่ต่างขั้ว ซีซัน 2"],
  "r": 990
 },
 {
  "id": 109020,
  "name": "Yesterday wo Utatte",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx109020-sRBusiVXbsLH.jpg",
  "year": 2020,
  "al": ["SING \"YESTERDAY\" FOR ME", "イエスタデイをうたって", "Sing Yesterday for Me", "Спой мне \"Yesterday\""],
  "r": 991
 },
 {
  "id": 21006,
  "name": "Grisaia no Rakuen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21006-nJI2WD4PoUUL.jpg",
  "year": 2015,
  "al": ["The Eden of Grisaia", "グリザイアの楽園", "Le Eden De La Grisaia"],
  "r": 992
 },
 {
  "id": 100179,
  "name": "Tada-kun wa Koi wo Shinai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx100179-jDGTOMxtoDkt.jpg",
  "year": 2018,
  "al": ["Tada Never Falls In Love", "多田くんは恋をしない", "Tadakun wa Koi wo Shinai", "Tadakoi", "Tada-kun Never Falls In Love", "ทาดะคุงไม่ตกหลุมรัก"],
  "r": 993
 },
 {
  "id": 102977,
  "name": "Golden Kamuy 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx102977-gUejfwQWpnzX.png",
  "year": 2018,
  "al": ["Golden Kamuy Season 2", "ゴールデンカムイ 第二期", "Golden Kamui 2"],
  "r": 994
 },
 {
  "id": 194393,
  "name": "Aishiteru Game wo Owarasetai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx194393-0H9yYABu6y0i.jpg",
  "year": 2026,
  "al": ["I Want to End this Love Game", "愛してるゲームを終わらせたい"],
  "r": 995
 },
 {
  "id": 12291,
  "name": "Acchi Kocchi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12291-NKo7qYW674Wo.jpg",
  "year": 2012,
  "al": ["Place to Place", "あっちこっち"],
  "r": 996
 },
 {
  "id": 195516,
  "name": "Kusuriya no Hitorigoto 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx195516-MJpUZlOberqH.jpg",
  "year": 2026,
  "al": ["The Apothecary Diaries Season 3", "薬屋のひとりごと 第3期"],
  "r": 997
 },
 {
  "id": 14833,
  "name": "Maoyuu Maou Yuusha",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14833-6M3yEmu4SJkH.png",
  "year": 2013,
  "al": ["Maoyu: Archenemy & Hero", "まおゆう魔王勇者", "Maoyu Maou Yusha"],
  "r": 998
 },
 {
  "id": 184322,
  "name": "Shinjiteita Nakamatachi ni Dungeon Okuchi de Korosarekaketa ga Gift \"Mugen Gacha\" de Level 9999 no Nakamatachi wo Te ni Irete Moto Party Member to Sekai ni Fukushuu & \"Zamaa!\" Shimasu!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx184322-rRkaMQ7J1zOI.jpg",
  "year": 2025,
  "al": ["My Gift Lvl 9999 Unlimited Gacha: Backstabbed in a Backwater Dungeon, I'm Out for Revenge!", "信じていた仲間達にダンジョン奥地で殺されかけたがギフト『無限ガチャ』でレベル9999の仲間達を手に入れて元パーティーメンバーと世界に復讐＆『ざまぁ！』します！", "Backstabbed in a Backwater Dungeon: My Trusted Companions Tried to Kill Me, But Thanks to the Gift of an Unlimited Gacha I Got LVL 9999 Friends", "My Gift LVL 9999 Unlimited Gacha", "ผมถูกเพื่อนที่เชื่อใจหลอกไปฆ่า เลยใช้กิฟต์สุ่มกาชาพาพวกพ้องเลเวล 9999 กลับมาล้างแค้น", "Mugen Gacha"],
  "r": 999
 },
 {
  "id": 175019,
  "name": "Nageki no Bourei wa Intai Shitai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx175019-8lLRmHID5fMd.jpg",
  "year": 2024,
  "al": ["Let This Grieving Soul Retire", "嘆きの亡霊は引退したい", "Arwah Berduka yang Ingin Pensiun"],
  "r": 1000
 },
 {
  "id": 177104,
  "name": "Saikyou no Shien-shoku [Wajutsushi] Dearu Ore wa Sekai Saikyou Clan wo Shitagaeru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx177104-8fQUQdXGZG8j.jpg",
  "year": 2024,
  "al": ["The Most Notorious \"Talker\" Runs the World's Greatest Clan", "最凶の支援職【話術士】である俺は世界最強クランを従える", "Wajutsushi"],
  "r": 1001
 },
 {
  "id": 97592,
  "name": "Demi-chan wa Kataritai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97592-6I0sanu3MPiZ.jpg",
  "year": 2017,
  "al": ["Interviews with Monster Girls", "亜人ちゃんは語りたい", "Entrevistas con chicas monstruo", "Interviews mit Monster-Mädchen"],
  "r": 1002
 },
 {
  "id": 101386,
  "name": "Hitoribocchi no ○○ Seikatsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101386-ZJN6JFf9gKrV.png",
  "year": 2019,
  "al": ["Hitoribocchi no Marumaruseikatsu", "ひとりぼっちの○○生活", "Hitoribocchi", "Bocchi Seikatsu", "一个人的○○小日子", "Hitoribocchi no Marumaru Seikatsu"],
  "r": 1003
 },
 {
  "id": 118419,
  "name": "Kamisama ni Natta Hi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx118419-li8RpQcLgiKK.png",
  "year": 2020,
  "al": ["The Day I Became a God", "神様になった日", "День, когда я стала Богом"],
  "r": 1004
 },
 {
  "id": 2402,
  "name": "Ashita no Joe",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx2402-hbo1SbfcM5hm.jpg",
  "year": 1970,
  "al": ["Tomorrow's Joe", "あしたのジョー", "Rocky Joe", "Champion Joe"],
  "r": 1005
 },
 {
  "id": 21574,
  "name": "Kono Subarashii Sekai ni Shukufuku wo!: Kono Subarashii Choker ni Shukufuku wo!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21574-CTRsdAGe4mDp.png",
  "year": 2016,
  "al": ["KONOSUBA -God's blessing on this wonderful world!: God's Blessings On This Wonderful Choker!", "この素晴らしい世界に祝福を！ この素晴らしいチョーカーに祝福を!", "Konosuba - As Bençãos de Deus Neste Mundo Maravilhoso: As Bençãos de Deus Nesta Maravilhosa Gargantilha!", "Konosuba ¡Bendito sea este mundo maravilloso!: ¡Bendita sea esta gargantilla maravillosa!", "Konosuba OVA"],
  "r": 1006
 },
 {
  "id": 173172,
  "name": "Dorohedoro Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx173172-404XnuOS0DhR.jpg",
  "year": 2026,
  "al": ["ドロヘドロ Season 2", "Дорохедоро 2", "สาปพันธุ์อสูร ซีซั่น2"],
  "r": 1007
 },
 {
  "id": 139821,
  "name": "Sugar Apple Fairy Tale",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139821-RC4PW7KPY1DU.jpg",
  "year": 2023,
  "al": ["シュガーアップル・フェアリーテイル", "Сказка о сахарном яблоке"],
  "r": 1008
 },
 {
  "id": 19647,
  "name": "Hajime no Ippo: Rising",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx19647-cIy7ShTL6e9h.jpg",
  "year": 2013,
  "al": ["Hajime No Ippo: The Fighting! - Rising -", "はじめの一歩 Rising", "Hajime no Ippo 3", "Fighting Spirit: Rising"],
  "r": 1009
 },
 {
  "id": 178886,
  "name": "Mikadono Sanshimai wa Angai, Choroi.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178886-KjzSXyEB61zX.jpg",
  "year": 2025,
  "al": ["Dealing with Mikadono Sisters Is a Breeze", "帝乃三姉妹は案外、チョロい。", "The Mikadono sisters are surprisingly easy to deal with."],
  "r": 1010
 },
 {
  "id": 139095,
  "name": "FAIRY TAIL: 100 YEARS QUEST",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139095-xXcToL6L4vuv.jpg",
  "year": 2024,
  "al": ["FAIRY TAIL 100 YEARS QUEST", "FAIRY TAIL 100 YEARS QUEST", "フェアリーテイル", "FAIRY TAIL 100年クエスト", "FAIRY TAIL: 100-nen Quest"],
  "r": 1011
 },
 {
  "id": 155158,
  "name": "Kidou Senshi Gundam: Suisei no Majo Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx155158-4MO3TP5plLSm.jpg",
  "year": 2023,
  "al": ["Mobile Suit Gundam: The Witch from Mercury Season 2", "機動戦士ガンダム 水星の魔女 Season2", "G-Witch 2", "機動戰士鋼彈 水星的魔女 Season2", "Мобильный воин Гандам: Ведьма с Меркурия"],
  "r": 1012
 },
 {
  "id": 202,
  "name": "Wolf's Rain",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx202-w2OLL3j8WmDm.jpg",
  "year": 2003,
  "al": ["ウルフズレイン", "Wolf Rain", "Wolfs Rain"],
  "r": 1013
 },
 {
  "id": 103221,
  "name": "Kaijuu no Kodomo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx103221-Ol5OyQ8fbTqH.png",
  "year": 2019,
  "al": ["Children of the Sea", "海獣の子供", "Los Niños del Mar", "Les enfants de la Mer", "海兽之子", "Дети моря", "I figli del mare", "Dzieci morza"],
  "r": 1014
 },
 {
  "id": 21825,
  "name": "Danganronpa 3: The End of Kibougamine Gakuen - Zetsubou-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21825-OjVRUQwM8bTz.png",
  "year": 2016,
  "al": ["Danganronpa 3: The End of Hope’s Peak High School - Despair Arc", "ダンガンロンパ3 -The End of 希望ヶ峰学園-　絶望編"],
  "r": 1015
 },
 {
  "id": 151380,
  "name": "Date A Live V",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx151380-gvN5PjrybTw2.jpg",
  "year": 2024,
  "al": ["デート・ア・ライブV", "Date A Live Season 5", "พิชิตรัก พิทักษ์โลก ภาค 5", "Рандеву с Жизнью 5"],
  "r": 1016
 },
 {
  "id": 14749,
  "name": "Ore no Kanojo to Osananajimi ga Shuraba Sugiru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14749-aq6aPtIPPVOY.png",
  "year": 2013,
  "al": ["Oreshura", "俺の彼女と幼なじみが修羅場すぎる", "My Girlfriend and Childhood Friend Fight Too Much", "สมรภูมิรักแฟนสาวกับเพื่อนข้างบ้าน"],
  "r": 1017
 },
 {
  "id": 99531,
  "name": "Devils' Line",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99531-UUrozP70Wlmg.png",
  "year": 2018,
  "al": ["デビルズライン", "Devil's Line"],
  "r": 1018
 },
 {
  "id": 133845,
  "name": "Overlord: Sei Oukoku-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx133845-InD67nSzCAUr.png",
  "year": 2024,
  "al": ["OVERLORD: The Sacred Kingdom", "オーバーロード 聖王国編", "Overlord Movie 3", "Overlord: Holy Kingdom Arc", "โอเวอร์ลอร์ด บทนครศักดิ์สิทธิ์", "Overlord: The Paladin of the Sacred Kingdom Arc", "Overlord: O Reino Sagrado", "Overlord: El Reino Sagrado"],
  "r": 1019
 },
 {
  "id": 195240,
  "name": "Uma Musume: Cinderella Gray Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx195240-hKcmllV6YHQT.jpg",
  "year": 2025,
  "al": ["Umamusume: Cinderella Gray 2nd Cour", "ウマ娘 シンデレラグレイ 第2クール", "Umamusume: Cinderella Gray Cour 2"],
  "r": 1020
 },
 {
  "id": 71,
  "name": "Full Metal Panic!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx71-Fi08vs7xNBMW.png",
  "year": 2002,
  "al": ["フルメタル・パニック！", "FMP", "Furumeta", "Стальная тревога"],
  "r": 1021
 },
 {
  "id": 12431,
  "name": "Uchuu Kyoudai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12431-vL6wmxLsTzzS.png",
  "year": 2012,
  "al": ["Space Brothers", "宇宙兄弟", "Uchu Kyodai", "Space Bros"],
  "r": 1022
 },
 {
  "id": 104454,
  "name": "Isekai Quartet",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104454-pH5YCR7HteqP.jpg",
  "year": 2019,
  "al": ["異世界かるてっと", "Квартет попаданцев"],
  "r": 1023
 },
 {
  "id": 154,
  "name": "Shaman King",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154-hSYv4EtcBE1p.png",
  "year": 2001,
  "al": ["シャーマンキング", "Król szamanów", "שאמן קינג", "Σαμάνος Πρίγκιπας"],
  "r": 1024
 },
 {
  "id": 8841,
  "name": "Kore wa Zombie desu ka?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx8841-pitrO5QSdfmA.png",
  "year": 2011,
  "al": ["Is this a Zombie?", "これはゾンビですか?", "เจ้านี่เหรอซอมบี้"],
  "r": 1025
 },
 {
  "id": 143277,
  "name": "Urusei Yatsura (2022)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx143277-snjd4UzsUl8M.jpg",
  "year": 2022,
  "al": ["Urusei Yatsura (2022) Seasons 1 & 2", "うる星やつら (2022)", "Urusei Yatsura: All Stars", "Lum, the Invader Girl", "Lamù e i casinisti planetari", "Turma do Barulho", "Urusei Yatsura: Kosmiczni natręci", "Urusei Yatsura (2022) Seasons 1 and 2"],
  "r": 1026
 },
 {
  "id": 6811,
  "name": "Inuyasha: Kanketsu-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6811-DUsNLwQAOB7o.png",
  "year": 2009,
  "al": ["InuYasha: The Final Act", "犬夜叉 完結編", "Inu Yasha: Kanketsu-hen", "이누야샤 완결편", "Inuyasha: El acto final"],
  "r": 1027
 },
 {
  "id": 2476,
  "name": "School Days (TV)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2476-GSeJUpMGnj40.jpg",
  "year": 2007,
  "al": ["スクールデイズ (TV)", "School Days: Wer dir alles geben kann, kann dir auch alles nehmen ..."],
  "r": 1028
 },
 {
  "id": 18397,
  "name": "Shingeki no Kyojin OVA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx18397-AnpwhLkSjYL1.jpg",
  "year": 2013,
  "al": ["Attack on Titan OVA", "進撃の巨人 OVA", "Attack on Titan: Ilse's Journal", "Attack on Titan: A Sudden Visitor", "ผ่าพิภพไททัน OAD", "Атака титанов OVA"],
  "r": 1029
 },
 {
  "id": 477,
  "name": "ARIA The ANIMATION",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx477-CdKPHW7rGbUP.png",
  "year": 2005,
  "al": ["水星领航员"],
  "r": 1030
 },
 {
  "id": 127976,
  "name": "Tian Guan Ci Fu 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx127976-zmag82H3ygcI.jpg",
  "year": 2023,
  "al": ["Heaven Official's Blessing Season 2", "天官赐福 第二季"],
  "r": 1031
 },
 {
  "id": 82,
  "name": "Kidou Senshi Gundam 0080: Pocket no Naka no Sensou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx82-aw5fvnBOYuNw.png",
  "year": 1989,
  "al": ["Mobile Suit Gundam 0080: War in the Pocket", "機動戦士ガンダム 0080 ポケットの中の戦争"],
  "r": 1032
 },
 {
  "id": 177474,
  "name": "Tougen Anki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx177474-oHil1yLWldfl.jpg",
  "year": 2025,
  "al": ["桃源暗鬼", "Tougen Anki: Legend of the Cursed Blood", "Tougen Anki: Dark Demon of Paradise"],
  "r": 1033
 },
 {
  "id": 5958,
  "name": "Sora no Otoshimono",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5958-qaAKEr4Q0JWn.jpg",
  "year": 2009,
  "al": ["Heaven's Lost Property", "そらのおとしもの"],
  "r": 1034
 },
 {
  "id": 21425,
  "name": "Kuroshitsuji: Book of the Atlantic",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21425-HHZEaefKU8Jt.png",
  "year": 2017,
  "al": ["Black Butler: Book of the Atlantic", "黒執事 Book of the Atlantic", "Kuroshitsuji", "Black Butler", "Book of Atlantic", "คนลึกไขปริศนาลับ: Book of the Atlantic"],
  "r": 1035
 },
 {
  "id": 98505,
  "name": "Princess Principal",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98505-uxUXC7fQ9lMk.jpg",
  "year": 2017,
  "al": ["プリンセス・プリンシパル"],
  "r": 1036
 },
 {
  "id": 4565,
  "name": "Tengen Toppa Gurren Lagann: Lagann-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx4565-FbFYEBTJSPyr.png",
  "year": 2009,
  "al": ["Gurren Lagann The Movie: The Lights in the Sky are Stars", "天元突破グレンラガン 螺巌篇", "Tengen Toppa Gurren Lagann Movie 2"],
  "r": 1037
 },
 {
  "id": 21306,
  "name": "Musaigen no Phantom World",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21306-nXw2pY43S2ox.png",
  "year": 2016,
  "al": ["Myriad Colors Phantom World", "無彩限のファントム・ワールド"],
  "r": 1038
 },
 {
  "id": 110353,
  "name": "Deca-Dence",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx110353-XGYSsii7qJeK.png",
  "year": 2020,
  "al": ["デカダンス"],
  "r": 1039
 },
 {
  "id": 142877,
  "name": "Rurouni Kenshin: Meiji Kenkaku Romantan (2023)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142877-FrXXLsgXYQAp.jpg",
  "year": 2023,
  "al": ["Rurouni Kenshin (2023)", "るろうに剣心 －明治剣客浪漫譚－(2023)", "Samurai X (2023)", "Kenshin le vagabond (2023)"],
  "r": 1040
 },
 {
  "id": 146676,
  "name": "Renai Flops",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx146676-8hkJxhY3b4tX.jpg",
  "year": 2022,
  "al": ["LOVE FLOPS", "恋愛フロップス", "Renai Furoppusu"],
  "r": 1041
 },
 {
  "id": 9041,
  "name": "IS: Infinite Stratos",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx9041-nyIdVMM8q27K.jpg",
  "year": 2011,
  "al": ["Infinite Stratos", "IS〈インフィニット・ストラトス〉", "IS ปฏิบัติการรักจักรกลทะยานฟ้า"],
  "r": 1042
 },
 {
  "id": 164702,
  "name": "Tensei Kizoku, Kantei Skill de Nariagaru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx164702-FjpM96MPdzVm.jpg",
  "year": 2024,
  "al": ["As a Reincarnated Aristocrat, I'll Use My Appraisal Skill to Rise in the World", "転生貴族、鑑定スキルで成り上がる", "KanteiSkill"],
  "r": 1043
 },
 {
  "id": 4722,
  "name": "Skip Beat!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx4722-haxa25k1oSxU.png",
  "year": 2008,
  "al": ["スキップ・ビート！"],
  "r": 1044
 },
 {
  "id": 101261,
  "name": "Sarazanmai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101261-lOLwQS45WJm5.jpg",
  "year": 2019,
  "al": ["さらざんまい"],
  "r": 1045
 },
 {
  "id": 18277,
  "name": "Strike the Blood",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx18277-Vwm314Nr6vsg.jpg",
  "year": 2013,
  "al": ["ストライク・ザ・ブラッド", "ราชันย์โลหิตรัตติกาล"],
  "r": 1046
 },
 {
  "id": 114340,
  "name": "Kuma Kuma Kuma Bear",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114340-9KovjbYWlNGa.jpg",
  "year": 2020,
  "al": ["くまクマ熊ベアー", "The Bears Bear a Bare Kuma", "熊熊勇闯异世界", "Ми-ми-ми-мишка"],
  "r": 1047
 },
 {
  "id": 12477,
  "name": "Sakasama no Patema",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12477-KtZm8BuvrPYo.jpg",
  "year": 2013,
  "al": ["Patema Inverted", "サカサマのパテマ"],
  "r": 1048
 },
 {
  "id": 10012,
  "name": "Carnival Phantasm",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10012-MNLVctKXaIAf.jpg",
  "year": 2011,
  "al": ["カーニバル・ファンタズム", "Карнавальный Фантазм"],
  "r": 1049
 },
 {
  "id": 1430,
  "name": "Lupin III: Cagliostro no Shiro",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1430-aHneeSPBCeHR.jpg",
  "year": 1979,
  "al": ["Lupin The 3rd: The Castle of Cagliostro", "ルパン三世 カリオストロの城", "Rupan Sansei", "Lupin III: El Castillo de Cagliostro", "Edgar de la Cambriole : Le Château de Cagliostro", "Lupin Trzeci: Zamek Cagliostro", "Lupin III: The Castle of Cagliostro", "Lupin III - Il castello di Cagliostro"],
  "r": 1050
 },
 {
  "id": 107961,
  "name": "Kawaikereba Hentai demo Suki ni Natte Kuremasu ka?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107961-8aQlUDwwRpQS.jpg",
  "year": 2019,
  "al": ["Hensuki: Are you willing to fall in love with a pervert, as long as she’s a cutie?", "可愛ければ変態でも好きになってくれますか？", "Would you even fall in love with a pervert as long as it's a cutie?", "Kawaiikereba Hentai demo Suki ni Natte Kuremasu ka?"],
  "r": 1051
 },
 {
  "id": 154412,
  "name": "Megami no Café Terrace",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154412-bEMQkJWOStDR.jpg",
  "year": 2023,
  "al": ["The Café Terrace and Its Goddesses", "女神のカフェテラス", "Goddess Café Terrace", "คาเฟ่นี้มีนางฟ้ามาเสิร์ฟ", "Богини кафе-террасы"],
  "r": 1052
 },
 {
  "id": 21356,
  "name": "Pocket Monsters XY&Z",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21356-bHTUPdtd8xy2.jpg",
  "year": 2015,
  "al": ["Pokémon the Series: XYZ", "ポケットモンスター XY&Z", "Pokémon Seria XYZ"],
  "r": 1053
 },
 {
  "id": 4901,
  "name": "BLACK LAGOON: Roberta's Blood Trail",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx4901-evMxxc1A8pCF.jpg",
  "year": 2010,
  "al": ["BLACK LAGOON Roberta's Blood Trail", "Black Lagoon 3"],
  "r": 1054
 },
 {
  "id": 19111,
  "name": "Love Live! School idol project 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx19111-06M6xbT8fEbp.jpg",
  "year": 2014,
  "al": ["ラブライブ! School idol project 2期", "Живая любовь: проект \"Школьный идол\". 2 сезон"],
  "r": 1055
 },
 {
  "id": 130591,
  "name": "Sabikui Bisco",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx130591-9O1cf7u6SfYa.jpg",
  "year": 2022,
  "al": ["錆喰いビスコ", "Rust-Eater Bisco", "บิสโก้ นรชนคนโคตรเห็ด", "Bisco Si Pemakan Karat"],
  "r": 1056
 },
 {
  "id": 6956,
  "name": "WORKING!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6956-Nxs7H25yHLNS.jpg",
  "year": 2010,
  "al": ["Wagnaria!!", "ワーキング!!", "워킹!!"],
  "r": 1057
 },
 {
  "id": 97768,
  "name": "Grancrest Senki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97768-atbPjYJNXnIo.jpg",
  "year": 2018,
  "al": ["Record of Grancrest War", "グランクレスト戦記", "บันทึกสงครามแกรนเครสท์"],
  "r": 1058
 },
 {
  "id": 187264,
  "name": "Yuusha Party wo Oidasareta Kiyou Binbou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx187264-wjwbVdnynbbu.jpg",
  "year": 2026,
  "al": ["Jack-of-All-Trades, Party of None", "勇者パーティを追い出された器用貧乏", "Yuusha Party wo Oidasareta Kiyou Binbou: Party Jijou de Fuyo Jutsushi wo Yatteita Kenshi, Bannou e to Itaru", "勇者パーティを追い出された器用貧乏　～パーティ事情で付与術士をやっていた剣士、万能へと至る～", "เก่งรอบด้านแต่ไร้ทีเด็ด เลยถูกเฉดหัวจากปาร์ตี้ผู้กล้า", "용사 파티에서 쫓겨난 다재무능", "Si Serbabisa Terbuang Ini Akan Bangkit Jua!"],
  "r": 1059
 },
 {
  "id": 178090,
  "name": "Tensei Shitara Dai Nana Ouji Datta node, Kimamani Majutsu wo Kiwamemasu 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178090-1OOScJqXLjRd.png",
  "year": 2025,
  "al": ["I Was Reincarnated as the 7th Prince so I Can Take My Time Perfecting My Magical Ability Season 2", "転生したら第七王子だったので、気ままに魔術を極めます 第2期", "Dainanaoji 2", "第七王子 第2期", "轉生為第七王子，隨心所欲的魔法學習之路 第二季"],
  "r": 1060
 },
 {
  "id": 97617,
  "name": "Isekai Shokudou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx97617-TmRRraupfbT5.jpg",
  "year": 2017,
  "al": ["Restaurant to Another World", "異世界食堂", "异世界食堂", "ร้านอาหารต่างโลก"],
  "r": 1061
 },
 {
  "id": 116673,
  "name": "BURN THE WITCH",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116673-cy4sgiliurpR.jpg",
  "year": 2020,
  "al": [],
  "r": 1062
 },
 {
  "id": 20031,
  "name": "D-Frag!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20031-WOR6bly9HOr1.jpg",
  "year": 2014,
  "al": ["ディーふらぐ!", "D Frag", "D-Fragments!"],
  "r": 1063
 },
 {
  "id": 168872,
  "name": "Kimi ni Todoke 3RD SEASON",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx168872-ls6UwxFAw212.jpg",
  "year": 2024,
  "al": ["Kimi ni Todoke: From Me to You Season 3", "君に届け 3RD SEASON", "ฝากใจไปถึงเธอ ซีซั่น 3"],
  "r": 1064
 },
 {
  "id": 441,
  "name": "Shoujo Kakumei Utena: Adolescence Mokushiroku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx441-JbPY7EiWIeaL.jpg",
  "year": 1999,
  "al": ["Revolutionary Girl Utena: The Adolescence of Utena", "少女革命ウテナ アドゥレセンス黙示録", "Revolutionary Girl Utena: Adolescence Apocalypse", "Utena la fillette révolutionnaire - Apocalisse adolescenziale", "Utena, la fillette révolutionnaire - Le Film", "Rewolucjonistka Utena. Film"],
  "r": 1065
 },
 {
  "id": 98320,
  "name": "Koi to Uso",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98320-VwCcTBeEs08J.jpg",
  "year": 2017,
  "al": ["LOVE and LIES", "恋と嘘", "Love & Lies", "จะรักหรือจะหลอก"],
  "r": 1066
 },
 {
  "id": 104722,
  "name": "Assassins Pride",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104722-XVscwgdGzfnO.jpg",
  "year": 2019,
  "al": ["アサシンズプライド", "Assassin's Pride", "แอสแซสซินส์ ไพรด์)"],
  "r": 1067
 },
 {
  "id": 5630,
  "name": "Higashi no Eden",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5630-l1YM9YDO8tpt.png",
  "year": 2009,
  "al": ["Eden of the East", "東のエデン"],
  "r": 1068
 },
 {
  "id": 158709,
  "name": "Unnamed Memory",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx158709-WFA0RHloDvPl.jpg",
  "year": 2024,
  "al": ["アンネームドメモリー", "อันเนมด์ เมโมรี"],
  "r": 1069
 },
 {
  "id": 15335,
  "name": "Gintama: Kanketsu-hen - Yorozuya yo Eien Nare",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx15335-QjijwChGTBs0.png",
  "year": 2013,
  "al": ["Gintama: The Final Chapter - Be Forever Yorozuya", "劇場版 銀魂 完結篇 万事屋よ永遠なれ", "Gintama Movie 2", "Gintama the Final Movie"],
  "r": 1070
 },
 {
  "id": 21749,
  "name": "Kidou Senshi Gundam: Tekketsu no Orphans 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21749-tO6zfDKFesgl.jpg",
  "year": 2016,
  "al": ["Mobile Suit GUNDAM Iron Blooded Orphans 2", "機動戦士ガンダム 鉄血のオルフェンズ 2", "Gundam IBO", "G-Tekketsu"],
  "r": 1071
 },
 {
  "id": 21823,
  "name": "ACCA: 13-ku Kansatsu-ka",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21823-0XTjZ0Rtm7va.jpg",
  "year": 2017,
  "al": ["ACCA: 13-Territory Inspection Dept.", "ACCA 13区監察課", "ACCA: Jusan-ku Kansatsu-ka"],
  "r": 1072
 },
 {
  "id": 182814,
  "name": "Kowloon Generic Romance",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx182814-UTKRUUm7Jah5.jpg",
  "year": 2025,
  "al": ["九龍ジェネリックロマンス", "九龍GR", "เกาลูน อุบัติรักปริศนาลับ"],
  "r": 1073
 },
 {
  "id": 121176,
  "name": "Honzuki no Gekokujou: Shisho ni Naru Tame ni wa Shudan wo Erandeiraremasen 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx121176-qWobMmSf761W.jpg",
  "year": 2022,
  "al": ["Ascendance of a Bookworm Season 3", "本好きの下剋上 司書になるためには手段を選んでいられません 第3期", "爱书的下克上：为了成为图书管理员不择手段！3", "หนอนหนังสือยึดอำนาจ ภาค 3", "การปฏิวัติของสาวน้อยหนอนหนังสือ ภาค 3", "Sự Nổi Dậy Của Cô Gái Mọt Sách: Mình Sẽ Làm Mọi Cách Để Trở Thành Thủ Thư 3", "Власть книжного червя"],
  "r": 1074
 },
 {
  "id": 166910,
  "name": "The Fable",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx166910-wI4LacRXICtI.png",
  "year": 2024,
  "al": ["ザ・ファブル"],
  "r": 1075
 },
 {
  "id": 12115,
  "name": "Berserk: Ougon Jidai-hen III - Kourin",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b12115-pslMEaGV6gpf.jpg",
  "year": 2013,
  "al": ["Berserk: The Golden Age Arc III - The Advent", "ベルセルク 黄金時代篇Ⅲ 降臨", "Berserk Movie", "Berserk Saga", "Berserk: Golden Age Arc III - Descent", "Berserk: La Edad de Oro III - El Advenimiento"],
  "r": 1076
 },
 {
  "id": 20513,
  "name": "PSYCHO-PASS 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20513-pVQqYhMwBGoh.jpg",
  "year": 2014,
  "al": ["PSYCHO-PASS サイコパス2"],
  "r": 1077
 },
 {
  "id": 116242,
  "name": "100-man no Inochi no Ue ni Ore wa Tatteiru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116242-JY81Khmbqysn.jpg",
  "year": 2020,
  "al": ["I'm Standing on a Million Lives", "100万の命の上に俺は立っている", "I'm standing on 1,000,000 lives.", "ข้าก้าวผ่าน 1 ล้านชีวิตเพื่อพิชิตเกมมรณะ"],
  "r": 1078
 },
 {
  "id": 482,
  "name": "Yu☆Gi☆Oh! Duel Monsters GX",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b482-c14JwoMTmKAU.png",
  "year": 2004,
  "al": ["Yu-Gi-Oh! GX", "遊☆戯☆王デュエルモンスターズＧＸ", "Yugioh Genex", "Yugioh GX", "Yu-Gi-Oh! Genex", "เกมกลคนอัจฉริยะ GX"],
  "r": 1079
 },
 {
  "id": 21385,
  "name": "Nanatsu no Taizai: Seisen no Shirushi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21385-0rOBu6r4C4b9.jpg",
  "year": 2016,
  "al": ["The Seven Deadly Sins: Signs of A Holy War", "七つの大罪 聖戦の予兆", "The Seven Deadly Sins: Signs of Holy War", "The Seven Deadly Sins - Anzeichen eines Heiligen Kriegs", "ศึกตำนาน 7 อัศวิน ภาค สัญญาณสงครามศักดิ์สิทธิ์", "The Seven Deadly Sins: Ślady Świętej Wojny", "Семь смертных грехов: Знамение священной войны"],
  "r": 1080
 },
 {
  "id": 105143,
  "name": "ONE PIECE STAMPEDE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105143-5uBDmhvMr6At.png",
  "year": 2019,
  "al": ["One Piece: Stampede", "ワンピース スタンピード", "One Piece: Estampida", "航海王：狂热行动", "One Piece Film 14"],
  "r": 1081
 },
 {
  "id": 5530,
  "name": "Pandora Hearts",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5530-ukD9JNrN47aA.jpg",
  "year": 2009,
  "al": ["PandoraHearts", "パンドラハーツ"],
  "r": 1082
 },
 {
  "id": 176276,
  "name": "Mato Seihei no Slave 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx176276-rtF8mYd2OWw2.png",
  "year": 2026,
  "al": ["Chained Soldier Season 2", "魔都精兵のスレイブ2", "Mabotai 2", "魔都精兵のスレイブ 第２期", "Mato Seihei no Slave 2nd Season", "ทาสสุดแกร่งแห่งหน่วยป้องกันอสูร ซีซั่น 2", "Demon Slave Temporada 2"],
  "r": 1083
 },
 {
  "id": 185736,
  "name": "Vigilante: Boku no Hero Academia ILLEGALS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx185736-Ci6AiGwjKKtp.jpg",
  "year": 2025,
  "al": ["My Hero Academia: Vigilantes", "ヴィジランテ -僕のヒーローアカデミア ILLEGALS-", "MHA Vigilantes", "BNHA Vigilantes"],
  "r": 1084
 },
 {
  "id": 21851,
  "name": "Busou Shoujo Machiavellianism",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21851-WCBWT6fLgh5z.jpg",
  "year": 2017,
  "al": ["Armed Girl's Machiavellism", "武装少女マキャヴェリズム"],
  "r": 1085
 },
 {
  "id": 187942,
  "name": "Mayonaka Heart Tune",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx187942-c2cZvunJGfiE.jpg",
  "year": 2026,
  "al": ["Tune In to the Midnight Heart", "真夜中ハートチューン", "Mayochu", "จูนเสียงใจไปสุดฝัน"],
  "r": 1086
 },
 {
  "id": 121467,
  "name": "Modao Zushi 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx121467-Et0U1jXLfuYf.jpg",
  "year": 2021,
  "al": ["The Founder of Diabolism: Final Season", "魔道祖师 第三季", "Mo Dao Zu Shi 3", "Grandmaster of Demonic Cultivation 3", "The Founder of Diabolism 3", "The Founder of Evil Magic 3", "魔道祖师完结篇", "The Master of Diabolism 3"],
  "r": 1087
 },
 {
  "id": 2581,
  "name": "Kidou Senshi Gundam 00",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2581-MLEf00dNAfqY.jpg",
  "year": 2007,
  "al": ["Mobile Suit Gundam 00", "機動戦士ガンダム00"],
  "r": 1088
 },
 {
  "id": 21639,
  "name": "Keijo!!!!!!!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21639-tdDGBK68CQk0.jpg",
  "year": 2016,
  "al": ["競女!!!!!!!!", "Hip Whip Girl"],
  "r": 1089
 },
 {
  "id": 113418,
  "name": "Super Cub",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113418-OjWcmCXAHWkq.jpg",
  "year": 2021,
  "al": ["スーパーカブ", "ซุปเปอร์คับ"],
  "r": 1090
 },
 {
  "id": 129191,
  "name": "Shikkakumon no Saikyou Kenja",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx129191-F80AgCUP79yE.jpg",
  "year": 2022,
  "al": ["The Strongest Sage with the Weakest Crest", "失格紋の最強賢者", "ปราชญ์หนึ่งในใต้หล้ากับตราสุดอัปยศ", "失格纹的最强贤者"],
  "r": 1091
 },
 {
  "id": 104580,
  "name": "Saiki Kusuo no Ψ-nan: Kanketsu-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104580-AfhlKn5rmOZS.png",
  "year": 2018,
  "al": ["The Disastrous Life of Saiki K. Season 3", "斉木楠雄のΨ難 完結編", "Saiki Kusuo no Psi Nan 3"],
  "r": 1092
 },
 {
  "id": 108623,
  "name": "Goblin Slayer: GOBLIN'S CROWN",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108623-pREPeutedpc2.jpg",
  "year": 2020,
  "al": ["GOBLIN SLAYER -GOBLIN’S CROWN-", "ゴブリンスレイヤー -GOBLIN'S CROWN-", "Goblin Slayer: Korona"],
  "r": 1093
 },
 {
  "id": 147885,
  "name": "Cool Doji Danshi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx147885-RuqC9lZH9ao6.jpg",
  "year": 2022,
  "al": ["Play It Cool, Guys", "クールドジ男子"],
  "r": 1094
 },
 {
  "id": 10588,
  "name": "Persona 4 the Animation",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10588-44oPKE7GRXA2.png",
  "year": 2011,
  "al": ["ペルソナ4アニメーション", "P4A"],
  "r": 1095
 },
 {
  "id": 114446,
  "name": "Higurashi no Naku Koro ni Gou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114446-H6uxjVi8wBoo.jpg",
  "year": 2020,
  "al": ["Higurashi: When They Cry - GOU", "ひぐらしのなく頃に業", "When the Cicadas Cry", "Higurashi: When They Cry - NEW", "Higurashi no Naku Koro ni (2020)", "ひぐらしのなく頃に (2020)", "HIGURASHI: Когда плачут цикады — GOU"],
  "r": 1096
 },
 {
  "id": 183385,
  "name": "Watashi wo Tabetai, Hitodenashi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx183385-f1TgnttLckBT.jpg",
  "year": 2025,
  "al": ["This Monster Wants to Eat Me", "私を喰べたい、ひとでなし", "A Monster Wants to Eat Me", "WataTabe", "わたたべ", "หากวันใดใครตนนั้นใคร่กลืนกิน"],
  "r": 1097
 },
 {
  "id": 112649,
  "name": "Tatoeba Last Dungeon Mae no Mura no Shounen ga Joban no Machi de Kurasu Youna Monogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112649-Wdcxo6cQZbhx.jpg",
  "year": 2021,
  "al": ["Suppose a Kid from the Last Dungeon Boonies moved to a starter town?", "たとえばラストダンジョン前の村の少年が序盤の街で暮らすような物語", "LASDAN", "Imagine, un cambrousard du dernier donjon dans la ville de départ !", "หนุ่มน้อยใสซื่อจากหมู่บ้านหน้าลาสท์ดันเจี้ยนมาเข้ากรุงแล้ว"],
  "r": 1098
 },
 {
  "id": 10490,
  "name": "BLOOD-C",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10490-Rqx4jlTOMFWx.jpg",
  "year": 2011,
  "al": ["ブラッドシー"],
  "r": 1099
 },
 {
  "id": 167087,
  "name": "30-sai made Doutei da to Mahou Tsukai ni Nareru Rashii",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx167087-Hf3MjsSVIerP.jpg",
  "year": 2024,
  "al": ["Cherry Magic! Thirty Years of Virginity Can Make You a Wizard?!", "30歳まで童貞だと魔法使いになれるらしい", "Cherry Magic! 30 ยังซิงกับเวทมนตร์ปิ๊งรัก", "如果30歲還是處男，似乎就能成為魔法師", "チェリまほ", "CherryMaho", "Оказывается, можно стать волшебником, если хранить девственность до 30 лет"],
  "r": 1100
 },
 {
  "id": 103874,
  "name": "Doukyonin wa Hiza, Tokidoki, Atama no Ue.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx103874-kAyuVMwwF5pp.jpg",
  "year": 2019,
  "al": ["My Roommate is a Cat", "同居人はひざ、時々、頭のうえ。", "Hizaue", "นายท่านอยู่บนตักหรือบางทีอยู่บนหัวเรา"],
  "r": 1101
 },
 {
  "id": 20785,
  "name": "Absolute Duo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20785-AsFpG5XMj7ip.jpg",
  "year": 2015,
  "al": ["アブソリュート・デュオ", "แอบโซลูท ดูโอ"],
  "r": 1102
 },
 {
  "id": 355,
  "name": "Shakugan no Shana",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx355-tB52QB38leMs.png",
  "year": 2005,
  "al": ["灼眼のシャナ", "Shana of the Burning Eyes", "ชานะ นักรบเนตรอัคคี", "Shakugan của Shana", "Ognistooka Shana"],
  "r": 1103
 },
 {
  "id": 113950,
  "name": "SSSS.DYNAZENON",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113950-XqVhfpSccNuJ.png",
  "year": 2021,
  "al": [],
  "r": 1104
 },
 {
  "id": 173693,
  "name": "Hitoribocchi no Isekai Kouryaku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx173693-tRLdDE1BieXe.png",
  "year": 2024,
  "al": ["Loner Life in Another World", "ひとりぼっちの異世界攻略"],
  "r": 1105
 },
 {
  "id": 101381,
  "name": "Dakaretai Otoko 1-i ni Odosarete Imasu.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101381-ZawZ7kIzuZVR.jpg",
  "year": 2018,
  "al": ["DAKAICHI -I'm being harassed by the sexiest man of the year-", "抱かれたい男1位に脅されています。", "我让最想被拥抱的男人给威胁了"],
  "r": 1106
 },
 {
  "id": 188139,
  "name": "Futsutsuka na Akujo de wa Gozaimasu ga: Suuguu Chouso Torikae Den",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx188139-1qIJfWxym8FX.jpg",
  "year": 2026,
  "al": ["Though I Am an Inept Villainess", "ふつつかな悪女ではございますが ~雛宮蝶鼠とりかえ伝~", "Though I Am an Inept Villainess: Tale of the Butterfly-Rat Body Swap in the Maiden Court", "Futsutsuka", "นางร้ายมือใหม่ เป็นกำลังใจให้ด้วยนะเจ้าคะ", "Хоть я и бездарная злодейка"],
  "r": 1107
 },
 {
  "id": 104458,
  "name": "Modao Zushi 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104458-b3PRaVB0vBM9.png",
  "year": 2019,
  "al": ["The Founder of Diabolism 2", "魔道祖师 第二季", "Grandmaster of Demonic Cultivation 2", "The Founder of Evil Magic 2", "Mo Dao Zu Shi 2", "魔道祖师 羡云篇", "The Master of Diabolism 2"],
  "r": 1108
 },
 {
  "id": 128545,
  "name": "Shiroi Suna no Aquatope",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx128545-8oL2w1DYd2ur.png",
  "year": 2021,
  "al": ["The aquatope on white sand", "白い砂のアクアトープ", "Aquatope of White Sand", "The two girls met in the ruins of damaged dream", "อควาโทปแห่งทรายขาว", "Aquatope di Atas Pasir Putih", "Акватоп на белом песке"],
  "r": 1109
 },
 {
  "id": 133898,
  "name": "Dragon Ball Super: Super Hero",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx133898-KdQ7fWTG06n4.png",
  "year": 2022,
  "al": ["ドラゴンボール超 スーパーヒーロー", "دراغون بول سوبر: البطل الخارق", "Dragon Ball Super - Szuperhős", "Драконий жемчуг: Супер — Супергерой"],
  "r": 1110
 },
 {
  "id": 173533,
  "name": "Monogatari Series: Off & Monster Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx173533-9DN3nHtT2FBm.png",
  "year": 2024,
  "al": ["〈物語〉シリーズ オフ&モンスターシーズン", "Orokamonogatari", "Nademonogatari", "Wazamonogatari", "Shinobumonogatari"],
  "r": 1111
 },
 {
  "id": 24,
  "name": "School Rumble",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx24-FY8Y08LrROKE.png",
  "year": 2004,
  "al": ["スクールランブル"],
  "r": 1112
 },
 {
  "id": 12365,
  "name": "Bakuman. 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12365-G5nFzWm2mIwz.png",
  "year": 2012,
  "al": ["バクマン。3", "バクマン。第3シリーズ", "Bakuman. 3rd Series"],
  "r": 1113
 },
 {
  "id": 190569,
  "name": "Tenmaku no Jaadugar",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx190569-KnCQLI3Z8hPX.jpg",
  "year": 2026,
  "al": ["Jaadugar: A Witch in Mongolia", "天幕のジャードゥーガル", "A Witch's Life in Mongol", "Jaadugar, la légende de Fatima"],
  "r": 1114
 },
 {
  "id": 177699,
  "name": "Koukaku Kidoutai: THE GHOST IN THE SHELL",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx177699-VHMezCGf48nM.jpg",
  "year": 2026,
  "al": ["THE GHOST IN THE SHELL", "攻殻機動隊 THE GHOST IN THE SHELL", "Koukaku Kidoutai (2026)", "The Ghost in the Shell (2026)", "攻殻機動隊 (2026)", "GITS 2026", "เดอะ โกสต์ อิน เดอะ เชลล์"],
  "r": 1115
 },
 {
  "id": 98251,
  "name": "Aho-Girl",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b98251-6miVBNYEXzaF.jpg",
  "year": 2017,
  "al": ["アホガール", "Ahogaru: Clueless Girl"],
  "r": 1116
 },
 {
  "id": 100784,
  "name": "Gintama.: Shirogane no Tamashii-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100784-7fWdiduBFr95.jpg",
  "year": 2018,
  "al": ["Gintama.: Silver Soul Arc", "銀魂. 銀ノ魂篇"],
  "r": 1117
 },
 {
  "id": 126357,
  "name": "Xian Wang De Richang Shenghuo 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx126357-gqjGyFI0pUtC.png",
  "year": 2021,
  "al": ["The Daily Life of the Immortal King Season 2", "仙王的日常生活 第二季", "ชีวิตวุ่นวายของจอมราชันย์ ภาค 2", "ชีวิตประจำวันของราชาแห่งเซียน ภาค 2"],
  "r": 1118
 },
 {
  "id": 101925,
  "name": "Gintama.: Shirogane no Tamashii-hen - Kouhan-sen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101925-gcA84dgcSj2w.png",
  "year": 2018,
  "al": ["Gintama.: Silver Soul Arc - Second Half War", "銀魂. 銀ノ魂篇2", "Gintama.: Silver Soul Arc 2", "Gintama. Silver Soul Arc Season 2", "Gintama.: Shirogane no Tamashii-hen Season 2"],
  "r": 1119
 },
 {
  "id": 20614,
  "name": "Free!: Eternal Summer",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20614-Dr962gTXZzMs.png",
  "year": 2014,
  "al": ["Free! -Eternal Summer-", "Free!-Eternal Summer-"],
  "r": 1120
 },
 {
  "id": 152523,
  "name": "Kaiko sareta Ankoku Heishi (30-dai) no Slow na Second Life",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx152523-1I1KPnKyOwhe.jpg",
  "year": 2023,
  "al": ["Chillin’ in My 30s after Getting Fired from the Demon King’s Army", "解雇された暗黒兵士（30代）のスローなセカンドライフ", "被解僱的暗黑士兵（30多歲）開始了慢生活的第二人生"],
  "r": 1121
 },
 {
  "id": 186,
  "name": "Initial D SECOND STAGE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b186-eygBSoYwLCYt.jpg",
  "year": 1999,
  "al": ["Initial D 2nd Stage", "頭文字[イニシャル]D SECOND STAGE", "Inisharu Di", "Initial D Season 2", "Initial S 2nd Season", "Initial D Stage 2"],
  "r": 1122
 },
 {
  "id": 175443,
  "name": "Honey Lemon Soda",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx175443-QpmlCJt47Rp9.jpg",
  "year": 2025,
  "al": ["ハニーレモンソーダ"],
  "r": 1123
 },
 {
  "id": 180675,
  "name": "Apocalypse Hotel",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx180675-YEwsxiMsnyvL.png",
  "year": 2025,
  "al": ["アポカリプスホテル"],
  "r": 1124
 },
 {
  "id": 21673,
  "name": "Senki Zesshou Symphogear XV",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21673-ZXlqf3DGJph9.png",
  "year": 2019,
  "al": ["Symphogear XV", "戦姫絶唱シンフォギアXV"],
  "r": 1125
 },
 {
  "id": 21659,
  "name": "Amaama to Inazuma",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21659-r1nnqXPIcl9D.png",
  "year": 2016,
  "al": ["Sweetness & Lightning", "甘々と稲妻"],
  "r": 1126
 },
 {
  "id": 180523,
  "name": "Yasei no Last Boss ga Arawareta!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx180523-FjvW1XByUNMK.jpg",
  "year": 2025,
  "al": ["A Wild Last Boss Appeared!", "野生のラスボスが現れた！", "A Wild Last Boss Appears!", "อุบัติการณ์ลาสบอสสุดแกร่ง"],
  "r": 1127
 },
 {
  "id": 168139,
  "name": "Rekishi ni Nokoru Akujo ni Naruzo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx168139-nGLXIdSksKCI.jpg",
  "year": 2024,
  "al": ["I’ll Become a Villainess Who Goes Down in History", "歴史に残る悪女になるぞ", "I'll Become a Villainess That Will Go Down in History", "I'll Become a Villainess That Will Go Down in History - The More of a Villainess I Become, the More the Prince Will Dote on Me", "Rekishi ni Nokoru Akujo ni Naruzo: Akuyaku Reijou ni Naru hodo Ouji no Dekiai wa Kasoku Suru you desu!", "歴史に残る悪女になるぞ　悪役令嬢になるほど王子の溺愛は加速するようです！"],
  "r": 1128
 },
 {
  "id": 795,
  "name": "Onii-sama e...",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx795-HJhtGq0Hql2r.jpg",
  "year": 1991,
  "al": ["Dear Brother", "おにいさまへ…", "Brother, Dear Brother", "To My Brother...", "Caro Fratello", "Très cher frère"],
  "r": 1129
 },
 {
  "id": 1096,
  "name": "Kidou Keisatsu Patlabor 2: the Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1096-O4Nz0aBmMSxH.jpg",
  "year": 1993,
  "al": ["Mobile Police Patlabor 2: The Movie", "機動警察パトレイバー2 the Movie", "Kidou Keisatsu Patlabor 2 The Movie"],
  "r": 1130
 },
 {
  "id": 20517,
  "name": "Gochuumon wa Usagi desu ka?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20517-SNNUtav2knou.jpg",
  "year": 2014,
  "al": ["Is the Order a Rabbit?", "ご注文はうさぎですか？", "Gochiusa", "ごちうさ"],
  "r": 1131
 },
 {
  "id": 21188,
  "name": "Saijaku Muhai no Bahamut",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21188-VFUo0sASxOfO.jpg",
  "year": 2016,
  "al": ["Undefeated Bahamut Chronicle", "最弱無敗の神装機竜《バハムート》", "บาฮามุท มังกรเหล็กไร้พ่าย"],
  "r": 1132
 },
 {
  "id": 97663,
  "name": "Knight's & Magic",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97663-4TMJDIpm3toz.png",
  "year": 2017,
  "al": ["ナイツ&マジック", "Knight's and Magic", "Naitsuma", "ไนท์ & แมจิก"],
  "r": 1133
 },
 {
  "id": 143598,
  "name": "Kijin Gentoushou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx143598-FCvAhQJLllSP.png",
  "year": 2025,
  "al": ["Sword of the Demon Hunter: Kijin Gentosho", "鬼人幻燈抄", "Le memorie del mezzo demone"],
  "r": 1134
 },
 {
  "id": 164172,
  "name": "Amagami-san Chi no Enmusubi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx164172-GY2aqItIuqtR.jpg",
  "year": 2024,
  "al": ["Tying the Knot with an Amagami Sister", "甘神さんちの縁結び", "Matchmaking of the Amagami Household", "ด้ายแดงผูกรักบ้านอามากามิ", "結緣甘神神社", "甘神家的连理枝", "ربط العقد مع أخوات أماغامي"],
  "r": 1135
 },
 {
  "id": 110229,
  "name": "Bokutachi wa Benkyou ga Dekinai!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx110229-uBjHp2cbXYVL.jpg",
  "year": 2019,
  "al": ["We Never Learn!: BOKUBEN Season 2", "ぼくたちは勉強ができない！", "BokuBen 2", "We Never Learn 2", "Boku-tachi wa Benkyou ga Dekinai 2nd Season", "Boku-tachi wa Benkyou ga Dekinai!", "เรื่องนี้ตําราไม่มีสอน ภาค 2"],
  "r": 1136
 },
 {
  "id": 11013,
  "name": "Inu x Boku SS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11013-EBA11hztD2yi.jpg",
  "year": 2012,
  "al": ["Inu X Boku Secret Service", "妖狐×僕SS", "Youko x Boku SS"],
  "r": 1137
 },
 {
  "id": 20701,
  "name": "Ookami Shoujo to Kuro Ouji",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20701-8tyJFN3soUm0.jpg",
  "year": 2014,
  "al": ["Wolf Girl and Black Prince", "オオカミ少女と黒王子"],
  "r": 1138
 },
 {
  "id": 190143,
  "name": "Shunkashuutou Daikousha: Haru no Mai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx190143-IqqbkMAF0GOo.jpg",
  "year": 2026,
  "al": ["Agents of the Four Seasons: Dance of Spring", "春夏秋冬代行者 春の舞", "4 Seasons", "Utusan Empat Musim: Tarian Musim Semi", "Gli Agenti delle Quattro Stagioni: La Danza della Primavera", "ลำนำรักผู้พิทักษ์ฤดูกาล ภาควสันตลีลา", "Sứ giả bốn mùa: Vũ Điệu Mùa Xuân", "Агенты Времён года: Весенний танец"],
  "r": 1139
 },
 {
  "id": 138056,
  "name": "Shuumatsu no Valkyrie II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx138056-r6wKvl71ddar.jpg",
  "year": 2023,
  "al": ["Record of Ragnarok II", "終末のワルキューレⅡ", "Record of Ragnarock Season 2", "Shuumatsu no Walkure 2", "Хроніка Раґнароку 2"],
  "r": 1140
 },
 {
  "id": 13663,
  "name": "To LOVE-Ru Darkness",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx13663-kpsCFSRAutWM.jpg",
  "year": 2012,
  "al": ["To Love Ru Darkness", "To LOVEる -とらぶる- ダークネス", "To LOVE-Ru Trouble Darkness", "To-Love-Ru Darkness", "ToLoveRu Darkness"],
  "r": 1141
 },
 {
  "id": 170166,
  "name": "Shiguang Dailiren: Yingdu Pian",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170166-VpX7l0Horthq.jpg",
  "year": 2024,
  "al": ["Link Click: Bridon Arc", "时光代理人英都篇", "Time Agent", "ข้ามเวลาพิชิตภารกิจ ภาคเมืองไบรดอน", "時光代理人-LINK CLICK- 英都篇"],
  "r": 1142
 },
 {
  "id": 98820,
  "name": "Just Because!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98820-EVHeNEUOWkh3.jpg",
  "year": 2017,
  "al": ["ジャストビコーズ"],
  "r": 1143
 },
 {
  "id": 21665,
  "name": "B: The Beginning",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx21665-QnenQOaxzhpf.jpg",
  "year": 2018,
  "al": ["Perfect Bones", "بي: البداية"],
  "r": 1144
 },
 {
  "id": 21410,
  "name": "Nejimaki Seirei Senki: Tenkyou no Alderamin",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21410-ZGPqM634gFlX.jpg",
  "year": 2016,
  "al": ["Alderamin on the Sky", "ねじ巻き精霊戦記 天鏡のアルデラミン", "สงครามภูติล้างบัลลังก์ อัลเดรามินแห่งฟากฟ้า"],
  "r": 1145
 },
 {
  "id": 122434,
  "name": "Heion Sedai no Idaten-tachi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx122434-HmMGLaGk2v4j.jpg",
  "year": 2021,
  "al": ["The Idaten Deities Know Only Peace", "平穏世代の韋駄天達", "Idaten Deities in the Peaceful Generation", "อิดะเท็น เทพต่อสู้กู้ยุคสันติ", "Боги-стражники не ведали войны"],
  "r": 1146
 },
 {
  "id": 172190,
  "name": "Kimi wa Meido-sama.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx172190-i1IqizIUcKkN.jpg",
  "year": 2024,
  "al": ["You are Ms. Servant", "君は冥土様。"],
  "r": 1147
 },
 {
  "id": 163327,
  "name": "Go-toubun no Hanayome∽",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163327-xBQznOwq6emq.jpg",
  "year": 2023,
  "al": ["The Quintessential Quintuplets Specials", "五等分の花嫁∽", "The Quintessential Quintuplets∽", "5-Toubun no Hanayome∽", "The Quintessential Quintuplets: No Coincidences in This Summer Break"],
  "r": 1148
 },
 {
  "id": 97996,
  "name": "Kono Subarashii Sekai ni Shukufuku wo! 2: Kono Subarashii Geijutsu ni Shukufuku wo!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b97996-px2KGexuEZpg.jpg",
  "year": 2017,
  "al": ["KONOSUBA -God's blessing on this wonderful world! 2: God's Blessings on These Wonderful Works of Art!", "この素晴らしい世界に祝福を！ 2 この素晴らしい芸術に祝福を!", "Konosuba 2 OVA", "Konosuba! - As Bençãos de Deus Neste Mundo Maravilhoso 2!: As Bençãos de Deus Nestas Obras de Arte Maravilhosas!", "Konosuba ¡Bendito sea este mundo maravilloso!: ¡Benditas sean estas maravillosas obras de arte!"],
  "r": 1149
 },
 {
  "id": 104252,
  "name": "Maou-sama, Retry!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104252-DTFPQy0uae3o.png",
  "year": 2019,
  "al": ["Demon Lord, Retry!", "魔王様、リトライ!", "จอมมารรีไทร์"],
  "r": 1150
 },
 {
  "id": 180746,
  "name": "Shibou Yuugi de Meshi wo Kuu.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx180746-eqDiHbzoHMFh.jpg",
  "year": 2026,
  "al": ["SHIBOYUGI: Playing Death Games to Put Food on the Table", "死亡遊戯で飯を食う。", "SHIBOYUGI: Jogos Mortais para Colocar Comida na Mesa", "SHIBOYUGI: Juegos mortales para ganarse el pan", "SHIBOYUGI: Das Phantom-Mädchen im Spiel des Todes", "Смертельная игра ради еды на столе", "Смертельні ігри заради їжі на столі", "Kiếm Cơm Bằng Trò Chơi Sinh Tử"],
  "r": 1151
 },
 {
  "id": 228,
  "name": "Jigoku Shoujo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx228-J2J1CI4jfyeC.jpg",
  "year": 2005,
  "al": ["Hell Girl", "地獄少女", "Jigoku Shojo", "สัญญามรณะ ธิดาอเวจี ภาคที่ 1", "Sứ giả địa phủ"],
  "r": 1152
 },
 {
  "id": 21261,
  "name": "Osomatsu-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21261-jLm2IGonsEzU.jpg",
  "year": 2015,
  "al": ["Mr. Osomatsu", "おそ松さん"],
  "r": 1153
 },
 {
  "id": 197824,
  "name": "Isekai Nonbiri Nouka 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx197824-k9Uyef8g49hB.png",
  "year": 2026,
  "al": ["Farming Life in Another World 2", "異世界のんびり農家２"],
  "r": 1154
 },
 {
  "id": 10110,
  "name": "Mayo Chiki!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10110-BXC37EbeTL3h.png",
  "year": 2011,
  "al": ["まよチキ!"],
  "r": 1155
 },
 {
  "id": 20599,
  "name": "Soredemo Sekai wa Utsukushii",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20599-QFFdBLjLlPJf.jpg",
  "year": 2014,
  "al": ["The World is Still Beautiful", "それでも世界は美しい", "Sore demo Sekai wa Utsukushii", "Even so, the World is Beautiful", "Still, the World is Beautiful", "O Mundo Ainda é Belo"],
  "r": 1156
 },
 {
  "id": 130166,
  "name": "Leadale no Daichi nite",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx130166-YVHrYg4wNA68.jpg",
  "year": 2022,
  "al": ["In the Land of Leadale", "リアデイルの大地にて", "มหาพิภพลีอาเดล", "World of Leadale"],
  "r": 1157
 },
 {
  "id": 16011,
  "name": "Tokyo Ravens",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16011-orxVpks3jG9U.jpg",
  "year": 2013,
  "al": ["東京レイヴンズ", "โตเกียว อนเมียวจิ"],
  "r": 1158
 },
 {
  "id": 98549,
  "name": "Poputepipikku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx98549-XfLyPhrP5Ors.jpg",
  "year": 2018,
  "al": ["Pop Team Epic", "ポプテピピック", "PPTP", "PTE", "Poptepipic"],
  "r": 1159
 },
 {
  "id": 170468,
  "name": "Raise wa Tanin ga Ii",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170468-kD2X9O2XM9KH.jpg",
  "year": 2024,
  "al": ["Yakuza Fiancé: Raise wa Tanin ga Ii", "来世は他人がいい", "รักอันตรายของเจ้าสาวยากูซ่า"],
  "r": 1160
 },
 {
  "id": 179694,
  "name": "Rock wa Lady no Tashinami Deshite",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx179694-7zhc0T6IImor.jpg",
  "year": 2025,
  "al": ["Rock is a Lady’s Modesty", "ロックは淑女の嗜みでして", "Rock wa Shukujo no Tashinami de shite"],
  "r": 1161
 },
 {
  "id": 1559,
  "name": "Shijou Saikyou no Deshi Kenichi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1559-7ZlyZxtBNo8g.jpg",
  "year": 2006,
  "al": ["Kenichi: The Mightiest Disciple", "史上最強の弟子 ケンイチ", "History's Strongest Disciple Kenichi", "Ken'ichi, el discípulo más fuerte de la historia", "Kenichi: O Discípulo Mais Forte"],
  "r": 1162
 },
 {
  "id": 158539,
  "name": "Oemojisangjuui",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx158539-jcLUcvqALA08.jpg",
  "year": 2022,
  "al": ["Lookism", "외모지상주의", "Gaiken Shijou Shugi", "外見至上主義", "APARI3NCIAS", "Лукізм", "Лукизм"],
  "r": 1163
 },
 {
  "id": 180136,
  "name": "Tsuihou Sareta Tensei Juukishi wa Game Chishiki de Musou Suru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx180136-gtMTCRlOD4OE.jpg",
  "year": 2026,
  "al": ["The Exiled Heavy Knight Knows How to Game the System", "追放された転生重騎士はゲーム知識で無双する", "The Exiled Reincarnated Heavy Knight Is Unrivaled in Game Knowledge", "Juukishi", "Kesatria Kelas Berat Tereinkarnasi yang Diasingkan Jadi Tanpa Tanding Dengan Pengetahuan Gimnya", "เกิดใหม่เป็นอัศวินเกราะหนักผู้ถูกขับไล่แต่ใช้ความรู้จากเกมจนไร้เทียมทาน"],
  "r": 1164
 },
 {
  "id": 120150,
  "name": "Bungou Stray Dogs Wan!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx120150-hxvcRrYzgP2F.png",
  "year": 2021,
  "al": ["Bungo Stray Dogs WAN!", "文豪ストレイドッグス わん！", "คณะประพันธกรจรจัด โฮ่ง!"],
  "r": 1165
 },
 {
  "id": 857,
  "name": "Air Gear",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b857-0pbF6kMJpUeL.png",
  "year": 2006,
  "al": ["エア・ギア"],
  "r": 1166
 },
 {
  "id": 9289,
  "name": "Hanasaku Iroha",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx9289-2Y14iZ2pMqeX.jpg",
  "year": 2011,
  "al": ["Hanasaku Iroha ~Blossoms for Tomorrow~", "花咲くいろは", "Hana-Saku Iroha", "Hanairo", "花开伊吕波"],
  "r": 1167
 },
 {
  "id": 148098,
  "name": "Otonari ni Ginga",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx148098-MI9Rm8JVhSh0.jpg",
  "year": 2023,
  "al": ["A Galaxy Next Door", "おとなりに銀河", "Uma Vizinha de Outro Mundo", "鄰人似銀河"],
  "r": 1168
 },
 {
  "id": 158926,
  "name": "Kamonohashi Ron no Kindan Suiri",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx158926-u3Sb0d0jagoI.jpg",
  "year": 2023,
  "al": ["Ron Kamonohashi's Forbidden Deductions", "鴨乃橋ロンの禁断推理", "Ron Kamonohashi: Deranged Detective", "El misterio prohibido de Ron Kamonohashi", "สืบลับฉบับคาโมโนะฮาชิ รอน", "Meisterdetektiv Ron Kamonohashi", "鸭乃桥论的禁忌推理"],
  "r": 1169
 },
 {
  "id": 21509,
  "name": "Danganronpa 3: The End of Kibougamine Gakuen - Mirai-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21509-3Ih7TTU0Romm.jpg",
  "year": 2016,
  "al": ["Danganronpa 3: The End of Hope’s Peak High School - Future Arc", "ダンガンロンパ３ –The End of 希望ヶ峰学園– 未来編"],
  "r": 1170
 },
 {
  "id": 140501,
  "name": "Seiken Gakuin no Maken Tsukai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx140501-pXY8yUDScfHS.jpg",
  "year": 2023,
  "al": ["The Demon Sword Master of Excalibur Academy", "聖剣学院の魔剣使い", "Demon's Sword Master of Excalibur School", "จอมมารเกิดใหม่ วิทยาลัยผู้พิทักษ์", "Lo spadaccino demoniaco all'accademia delle arti sacre"],
  "r": 1171
 },
 {
  "id": 147571,
  "name": "Isekai wa Smartphone to Tomo ni. 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx147571-QvxjhZtVavTz.png",
  "year": 2023,
  "al": ["In Another World With My Smartphone 2", "異世界はスマートフォンとともに。2", "Isesuma 2", "帶著智慧型手機闖蕩異世界。2"],
  "r": 1172
 },
 {
  "id": 170938,
  "name": "Katsute Mahou Shoujo to Aku wa Tekitai Shite Ita.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170938-kkeDCKGSUNaV.jpg",
  "year": 2024,
  "al": ["The Magical Girl and the Evil Lieutenant Used to Be Archenemies", "かつて魔法少女と悪は敵対していた。", "MahoAku", "まほあく", "Волшебница и злой офицер"],
  "r": 1173
 },
 {
  "id": 173780,
  "name": "Tate no Yuusha no Nariagari Season 4",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx173780-O7v1YfXg61JT.png",
  "year": 2025,
  "al": ["The Rising of the Shield Hero Season 4", "盾の勇者の成り上がり Season 4"],
  "r": 1174
 },
 {
  "id": 140842,
  "name": "Chiikawa",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx140842-T0geOCa3zS0A.jpg",
  "year": 2022,
  "al": ["ちいかわ", "Nanka Chiisakute Kawaii Yatsu", "なんか小さくてかわいいやつ", "吉伊卡哇"],
  "r": 1175
 },
 {
  "id": 100010,
  "name": "Mahou Shoujo Site",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100010-FCSVBvRZ6Ifl.png",
  "year": 2018,
  "al": ["MAGICAL GIRL SITE", "魔法少女サイト", "Garota Mágica .Com"],
  "r": 1176
 },
 {
  "id": 187538,
  "name": "BLACK TORCH",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx187538-fXVXKYUA3VV6.jpg",
  "year": 2026,
  "al": ["ブラックトーチ", "Tocha Negra"],
  "r": 1177
 },
 {
  "id": 20595,
  "name": "Mushishi Zoku Shou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20595-HcUeaAnvaUhM.jpg",
  "year": 2014,
  "al": ["MUSHI-SHI The Next Passage", "蟲師 続章", "Mushi-shi Zoku Shou", "Mushishi Zokushou", "Mushishi: The Next Chapter"],
  "r": 1178
 },
 {
  "id": 120608,
  "name": "Meikyuu Black Company",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx120608-gjCnIszBGe9k.jpg",
  "year": 2021,
  "al": ["The Dungeon of Black Company", "迷宮ブラックカンパニー", "เมคีว แบล็กคอมพานี"],
  "r": 1179
 },
 {
  "id": 20529,
  "name": "Bokura wa Minna Kawaisou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20529-WyK2k8mF9wIQ.png",
  "year": 2014,
  "al": ["The Kawai Complex Guide to Manors and Hostel Behavior", "僕らはみんな河合荘"],
  "r": 1180
 },
 {
  "id": 6707,
  "name": "Kuroshitsuji II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx6707-eZvzqWlu51DD.png",
  "year": 2010,
  "al": ["Black Butler II", "黒執事II", "Kuroshitsuji 2", "Black Butler 2", "คนลึกไขปริศนาลับ ภาค 2", "คนลึกไขปริศนาลับ II", "Hắc quản gia 2", "黑执事 第2季"],
  "r": 1181
 },
 {
  "id": 141534,
  "name": "Mushoku Tensei: Isekai Ittara Honki Dasu Part 2 - Eris no Goblin Toubatsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx141534-Tmnlz4mvYhaU.jpg",
  "year": 2022,
  "al": ["Mushoku Tensei: Jobless Reincarnation Cour 2 - Eris the Goblin Slayer", "無職転生 ～異世界行ったら本気だす～ 第2クール エリスのゴブリン討伐", "Mushoku Tensei: Jobless Reincarnation Cour 2 Special", "Mushoku Tensei: Jobless Reincarnation Part 2 Special", "เกิดชาตินี้พี่ต้องเทพ OVA", "Mushoku Tensei: Isekai Ittara Honki Dasu Part 2 Special"],
  "r": 1182
 },
 {
  "id": 4981,
  "name": "Casshern Sins",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx4981-V6MbMiJUqdvP.jpg",
  "year": 2008,
  "al": ["キャシャーンSins"],
  "r": 1183
 },
 {
  "id": 20809,
  "name": "Madan no Ou to Vanadis",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20809-QJQM3RI8PI4a.jpg",
  "year": 2014,
  "al": ["Lord Marksman and Vanadis", "魔弾の王と戦姫 (ヴァナディース)", "The King of the Magic Bullet and Vanadis"],
  "r": 1184
 },
 {
  "id": 198188,
  "name": "Fujimoto Tatsuki 17-26",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx198188-h3w6uICVNhqh.png",
  "year": 2025,
  "al": ["Tatsuki Fujimoto 17-26", "藤本タツキ 17-26", "A Couple Clucking Chickens Were Still Kickin' in the Schoolyard", "Sasaki Stopped a Bullet", "Love is Blind", "Shikaku", "Mermaid Rhapsody", "Woke-Up-as-a-Girl Syndrome"],
  "r": 1185
 },
 {
  "id": 142598,
  "name": "Nanatsu no Maken ga Shihai Suru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142598-0jpRK2h0v1hd.jpg",
  "year": 2023,
  "al": ["Reign of the Seven Spellblades", "七つの魔剣が支配する", "Seven Magic Swords Rule", "ซ่อนคมเวทเจ็ดดาบมาร", "Nanatsuma", "ななつま", "O Reino das Sete Magilâminas", "Тирания семи разящих клинков"],
  "r": 1186
 },
 {
  "id": 153554,
  "name": "Danjo no Yuujou wa Seiritsu suru? (Iya, Shinai!!)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153554-hHYe9aV6Gvlv.jpg",
  "year": 2025,
  "al": ["Can a Boy-Girl Friendship Survive?", "男女の友情は成立する？（いや、 しないっ!!）", "だんじょる", "Danjoru", "Can a Boy and Girl Friendship Hold Up? (No It Can't)", "เธอกับฉันเพื่อนกันใช่มั้ย (ไม่ใช่!!)"],
  "r": 1187
 },
 {
  "id": 19291,
  "name": "Pocket Monsters XY",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx19291-jwGqfWIXPtGA.png",
  "year": 2013,
  "al": ["Pokémon the Series: XY", "ポケットモンスターXY", "Pokemon XY", "Pokémon XY: The Series", "Pokemon XY: The Series - Kalos Quest", "Pokémon XY: The Series - Kalos Quest", "Pokémon Serien: XY", "Pokémon Serien: XY Kalos-reisen"],
  "r": 1188
 },
 {
  "id": 20751,
  "name": "Mushishi Zoku Shou 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20751-O3XJ9u30y7Qj.png",
  "year": 2014,
  "al": ["MUSHI-SHI The Next Passage 2", "蟲師 続章 2"],
  "r": 1189
 },
 {
  "id": 126791,
  "name": "Kyuukyoku Shinka Shita Full Dive RPG ga Genjitsu yori mo Kusogee Dattara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx126791-Rwhm1a5QFope.jpg",
  "year": 2021,
  "al": ["Full Dive: This Ultimate Next-Gen Full Dive RPG Is Even Shittier than Real Life!", "究極進化したフルダイブRPGが現実よりもクソゲーだったら", "What If the Ultimate in Fully Immersive VR RPGs Was a Crappier Game Than Reality Itself", "如果究极进化的完全潜行 RPG 比现实还更像垃圾游戏的话", "Full Dive : L'ultime RPG est encore plus foireux que la réalité !", "เมื่อ Full Dive RPG ได้กลายเป็นสิ่งที่แย่กว่าชีวิตจริง"],
  "r": 1190
 },
 {
  "id": 179696,
  "name": "Kono Kaisha ni Suki na Hito ga Imasu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx179696-1MAqXYVXT7IT.jpg",
  "year": 2025,
  "al": ["I Have a Crush at Work", "この会社に好きな人がいます", "Can You Keep a Secret?", "บริษัทนี้มีความรัก", "KonoSuki", "Ты умеешь хранить секреты?", "Bí mật Tình yêu nơi Công sở"],
  "r": 1191
 },
 {
  "id": 124395,
  "name": "Uzaki-chan wa Asobitai! ω",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx124395-9GeigGh1Ae2f.png",
  "year": 2022,
  "al": ["Uzaki-chan Wants to Hang Out! Season 2", "宇崎ちゃんは遊びたい！ω（だぶる）", "Uzaki-chan Wants to Hang Out! ω", "Uzaki-chan Wants to Hang Out! Double", "Uzaki-chan wa Asobitai! 2nd Season", "รุ่นน้องตัวป่วน อยากชวนเที่ยวเล่น ภาค 2"],
  "r": 1192
 },
 {
  "id": 129193,
  "name": "Shokei Shoujo no Virgin Road",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx129193-pT3W5PpiMAUB.png",
  "year": 2022,
  "al": ["The Executioner and Her Way of Life", "処刑少女の生きる道（バージンロード）", "เวอร์จินโร้ด เพชฌฆาตสาวบนเส้นทางพิสุทธิ์", "處刑少女的生存之道"],
  "r": 1193
 },
 {
  "id": 20590,
  "name": "Shingeki no Bahamut: GENESIS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20590-LuMDAd75Kg3C.jpg",
  "year": 2014,
  "al": ["Rage of Bahamut: Genesis", "神撃のバハムート GENESIS"],
  "r": 1194
 },
 {
  "id": 187260,
  "name": "Kimi ga Shinu made Koi wo Shitai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx187260-WW5RBa5NINRP.jpg",
  "year": 2026,
  "al": ["I Want to Love You Till Your Dying Day", "きみが死ぬまで恋をしたい", "きみ死ぬ", "KimiShinu", "Je veux t'aimer jusqu'à ta mort", "與妳相戀到生命盡頭"],
  "r": 1195
 },
 {
  "id": 174802,
  "name": "Shiunji-ke no Kodomotachi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx174802-ILahIZlNWN3R.jpg",
  "year": 2025,
  "al": ["The Shiunji Family Children", "紫雲寺家の子供たち", "รักว้าวุ่นในบ้านชิอุนจิ", "Những Đứa Trẻ Nhà Shiunji"],
  "r": 1196
 },
 {
  "id": 12031,
  "name": "Kingdom",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12031-1nVQa5nXPt48.png",
  "year": 2012,
  "al": ["キングダム", "Царство"],
  "r": 1197
 },
 {
  "id": 154745,
  "name": "Kanojo, Okarishimasu 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154745-xBr65cJsL3uW.jpg",
  "year": 2023,
  "al": ["Rent-a-Girlfriend Season 3", "彼女、お借りします 第3期", "KanoKari 3", "สะดุดรักยัยแฟนเช่า ภาค 3"],
  "r": 1198
 },
 {
  "id": 163135,
  "name": "Maou 2099",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx163135-NjvXyXvTYSHH.jpg",
  "year": 2024,
  "al": ["DEMON LORD 2099", "魔王2099", "魔王2099: THE LORD OF IMMORTALS BLOOMING IN THE ABYSS E.E. 2099", "Maou 2099:THE LORD OF IMMORTALS BLOOMING IN THE ABYSS E.E. 2099"],
  "r": 1199
 },
 {
  "id": 8676,
  "name": "Amagami SS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx8676-rpRpE8lD4tbw.png",
  "year": 2010,
  "al": ["アマガミSS", "圣诞之吻SS", "아마가미 SS", "Амагами СС"],
  "r": 1200
 },
 {
  "id": 11665,
  "name": "Natsume Yuujinchou Shi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11665-nfbt94cwKySE.png",
  "year": 2012,
  "al": ["Natsume's Book of Friends Season 4", "夏目友人帳 肆", "Natsume Yuujinchou Four", "Natsume Yuujinchou 4", "Natsume Yujincho 4"],
  "r": 1201
 },
 {
  "id": 8937,
  "name": "Toaru Majutsu no Index II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx8937-i3AW4QZxQHMy.jpg",
  "year": 2010,
  "al": ["A Certain Magical Index II", "とある魔術の禁書目録II", "Toaru Majutsu no Index 2", "Toaru Majutsu no Kinsho Mokuroku 2", "魔法禁书目录第二季", "魔法禁书目录 2", "อินเดกซ์คัมภีร์คาถาต้องห้าม ภาค 2", "Cấm thư ma thuật Index II"],
  "r": 1202
 },
 {
  "id": 101239,
  "name": "Ahiru no Sora",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101239-iGhniUbzVgpn.jpg",
  "year": 2019,
  "al": ["あひるの空"],
  "r": 1203
 },
 {
  "id": 20483,
  "name": "Mikakunin de Shinkoukei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20483-FJMOn8gjbcny.jpg",
  "year": 2014,
  "al": ["Engaged to the Unidentified", "未確認で進行形"],
  "r": 1204
 },
 {
  "id": 7647,
  "name": "Arakawa Under the Bridge",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx7647-NQEKHruZT5ch.jpg",
  "year": 2010,
  "al": ["荒川アンダー ザ ブリッジ"],
  "r": 1205
 },
 {
  "id": 14397,
  "name": "Chihayafuru 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14397-k2mzAGlUthAb.jpg",
  "year": 2013,
  "al": ["ちはやふる 2", "Chihayafull 2"],
  "r": 1206
 },
 {
  "id": 127371,
  "name": "Tonikaku Kawaii: SNS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx127371-sQvD9sILl7Lc.jpg",
  "year": 2021,
  "al": ["TONIKAWA: Over The Moon For You ~SNS~", "トニカクカワイイ ～SNS～", "Tonikaku Kawaii OVA", "TONIKAWA OVA", "Tonikaku Kawaii Episode 13", "Красавица: Унеси меня на Луну. Социальная сеть"],
  "r": 1207
 },
 {
  "id": 194884,
  "name": "Kaguya-sama wa Kokurasetai: Otona e no Kaidan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx194884-rHgGAzKSCEWz.jpg",
  "year": 2025,
  "al": ["Kaguya-sama: Love Is War -Stairway to Adulthood-", "かぐや様は告らせたい 大人への階段", "Kaguya-sama: Love Is War - The Grown-Up Staircase"],
  "r": 1208
 },
 {
  "id": 106319,
  "name": "Hachi-nan tte, Sore wa Nai deshou!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx106319-LDDmqyV2rs4D.jpg",
  "year": 2020,
  "al": ["The 8th Son? Are You Kidding Me?", "八男って、それはないでしょう！", "ผมเนี่ยนะ...ชายแปด!"],
  "r": 1209
 },
 {
  "id": 154364,
  "name": "Mahoutsukai no Yome SEASON 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154364-vz0w1E1mnqhG.png",
  "year": 2023,
  "al": ["The Ancient Magus' Bride Season 2", "魔法使いの嫁 SEASON2", "Mahoyome 2", "เจ้าสาวผมแดงกับจอมเวทอสูร ภาค 2", "Невеста чародея 2"],
  "r": 1210
 },
 {
  "id": 20652,
  "name": "Durarara!!x2 Shou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20652-8ft6GZKEoeWn.png",
  "year": 2015,
  "al": ["Durarara!! X2", "デュラララ!!×２ 承", "DRRR!! 2 Shou", "דורארארה!!2x התפתחות"],
  "r": 1211
 },
 {
  "id": 168138,
  "name": "Jii-san Baa-san Wakagaeru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx168138-jgMSP1rDkJhs.jpg",
  "year": 2024,
  "al": ["Grandpa and Grandma Turn Young Again", "じいさんばあさん若返る", "A Story About a Grandpa and Grandma Who Returned Back to Their Youth", "おじいさんとおばあさんが若返った話。", "Ojiisan to Obaasan ga Wakagaetta Hanashi."],
  "r": 1212
 },
 {
  "id": 532,
  "name": "Bishoujo Senshi Sailor Moon S",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx532-D6yrPcsSxhSE.jpg",
  "year": 1994,
  "al": ["Sailor Moon S", "美少女戦士セーラームーン S", "Pretty Soldier Sailor Moon S", "Sailor Moon e il cristallo del cuore"],
  "r": 1213
 },
 {
  "id": 9941,
  "name": "TIGER & BUNNY",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx9941-ixTUsgXCg2AI.jpg",
  "year": 2011,
  "al": ["タイガー・アンド・バニー", "Tiger and Bunny", "Taibani", "Тигр та Кролик"],
  "r": 1214
 },
 {
  "id": 120209,
  "name": "Otome Game no Hametsu Flag shika Nai Akuyaku Reijou ni Tensei shiteshimatta… X",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx120209-7eQk3UKmkQun.jpg",
  "year": 2021,
  "al": ["My Next Life as a Villainess: All Routes Lead to Doom! X", "乙女ゲームの破滅フラグしかない悪役令嬢に転生してしまった…Ｘ", "Hamefura 2", "Hamehura 2", "เกิดใหม่เป็นนางร้ายจะเลือกทางไหนก็หายนะ X", "เกิดใหม่เป็นนางร้ายจะเลือกทางไหนก็หายนะ ภาค 2"],
  "r": 1215
 },
 {
  "id": 113108,
  "name": "Kingdom 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113108-ArjAmFLubVyu.jpg",
  "year": 2020,
  "al": ["Kingdom Season 3", "キングダム 第3シリーズ", "สงครามบัลลังก์ผงาดจิ๋นซี ภาค 3", "Царство 3"],
  "r": 1216
 },
 {
  "id": 601,
  "name": "Nekojiru-sou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b601-ti6XlGiU2tUA.jpg",
  "year": 2001,
  "al": ["Cat Soup", "ねこぢる草", "Kocia zupa", "Кошачий суп", "L'herbe du chat Jiru"],
  "r": 1217
 },
 {
  "id": 1698,
  "name": "Nodame Cantabile",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx1698-VhVaiOLkcGCp.jpg",
  "year": 2007,
  "al": ["のだめカンタービレ"],
  "r": 1218
 },
 {
  "id": 10357,
  "name": "Jinrui wa Suitai Shimashita",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10357-JJvq6G2S01kl.png",
  "year": 2012,
  "al": ["Humanity Has Declined", "人類は衰退しました", "Jintai", "ตัวฉันกับวันสิ้นโลก"],
  "r": 1219
 },
 {
  "id": 114840,
  "name": "Koi to Yobu ni wa Kimochi Warui",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114840-FlmPI0oBQjjO.jpg",
  "year": 2021,
  "al": ["Koikimo", "恋と呼ぶには気持ち悪い", "It's Disgusting to Call This Love"],
  "r": 1220
 },
 {
  "id": 132456,
  "name": "Jahy-sama wa Kujikenai!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx132456-wxTCgdXnZMMQ.jpg",
  "year": 2021,
  "al": ["The Great Jahy Will Not Be Defeated!", "ジャヒー様はくじけない！", "ท่านปีศาจจาฮี ชีวิตนี้ไม่มีถอย!", "Niepokonana Jahy"],
  "r": 1221
 },
 {
  "id": 117989,
  "name": "Megami-ryou no Ryoubo-kun.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx117989-WG5tan8Gxwa6.jpg",
  "year": 2021,
  "al": ["Mother of the Goddess’ Dormitory", "女神寮の寮母くん。"],
  "r": 1222
 },
 {
  "id": 99940,
  "name": "Itou Junji: Collection",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx99940-pxsliSVHi0sj.jpg",
  "year": 2018,
  "al": ["Junji Ito Collection", "伊藤潤二「コレクション」", "จุนจิ อิโต้ คอลเลคชั่นสยอง"],
  "r": 1223
 },
 {
  "id": 177697,
  "name": "Dead Dead Demon's Dededededestruction",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b177697-EWgIqtwm5ABh.png",
  "year": 2024,
  "al": ["DEAD DEAD DEMONS DEDEDEDE DESTRUCTION", "デッドデッドデーモンズデデデデデストラクション", "DDDD"],
  "r": 1224
 },
 {
  "id": 2923,
  "name": "Shugo Chara!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2923-4gO5g4PBcoxy.jpg",
  "year": 2007,
  "al": ["しゅごキャラ！", "Guardian Character!", "คาแรคเตอร์ผู้พิทักษ์"],
  "r": 1225
 },
 {
  "id": 124195,
  "name": "Hanma Baki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx124195-5Z1JSrRlbMRe.jpg",
  "year": 2021,
  "al": ["Baki Hanma", "範馬刃牙", "Baki: Son of Ogre", "Hanma Baki: SON OF OGRE", "ฮันมะ บากิ", "Баки Ханма", "Μπάκι Χάνμα", "Бакі Ханма"],
  "r": 1226
 },
 {
  "id": 177506,
  "name": "Izure Saikyou no Renkinjutsushi?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx177506-in4J0GNzjOZL.jpg",
  "year": 2025,
  "al": ["Possibly the Greatest Alchemist of All Time", "いずれ最強の錬金術師？", "Someday Will I Be The Greatest Alchemist?", "遲早是最強的鍊金術師？"],
  "r": 1227
 },
 {
  "id": 21284,
  "name": "Flying Witch",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21284-vQcCLIWt1o5O.png",
  "year": 2016,
  "al": ["ふらいんぐうぃっち"],
  "r": 1228
 },
 {
  "id": 99634,
  "name": "Shingeki no Kyojin: LOST GIRLS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx99634-9u4hdvWwmC2s.png",
  "year": 2017,
  "al": ["Attack on Titan: Lost Girls", "進撃の巨人 LOST GIRLS", "Episode 16.5A: Wall Sina. Goodbye", "Episode 16.5B: Wall Sina. Goodbye", "SnK", "AoT", "ผ่าพิภพไททัน OAD", "ผ่าพิภพไททัน ภาค OAD Lost Girls"],
  "r": 1229
 },
 {
  "id": 100483,
  "name": "Yuragi-sou no Yuuna-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx100483-fzseZYJnQTLI.jpg",
  "year": 2018,
  "al": ["Yuuna and the Haunted Hot Springs", "ゆらぎ荘の幽奈さん", "Yuragisou no Yuuna-san", "Yuuna of Yuragi Manor", "Yunas Geisterhaus", "Yûna de la pension Yuragi", "ยูรากิโซ ที่นี่ผีน่ารักนะ"],
  "r": 1230
 },
 {
  "id": 202102,
  "name": "NEEDY GIRL OVERDOSE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx202102-7qDmTI7eT5xF.png",
  "year": 2026,
  "al": ["ニーディガール オーバードーズ", "NEEDY STREAMER OVERLOAD", "NEEDY GIRL OVERDOSE -OVERTURE-"],
  "r": 1231
 },
 {
  "id": 18617,
  "name": "Girls und Panzer Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx18617-bzfsyLDahhm8.jpg",
  "year": 2015,
  "al": ["Girls und Panzer der Film", "ガールズ&パンツァー 劇場版"],
  "r": 1232
 },
 {
  "id": 468,
  "name": "Innocence",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx468-rfiX1uY8bsPp.jpg",
  "year": 2004,
  "al": ["Ghost in the Shell 2: Innocence", "イノセンス", "Ghost in the Shell - L'attacco dei cyborg"],
  "r": 1233
 },
 {
  "id": 100855,
  "name": "Emiya-san Chi no Kyou no Gohan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100855-r8cXwdCschnX.jpg",
  "year": 2018,
  "al": ["Today's Menu for the Emiya Family", "衛宮さんちの今日のごはん", "Сегодняшнее меню для Эмии"],
  "r": 1234
 },
 {
  "id": 16706,
  "name": "Kami nomi zo Shiru Sekai: Megami-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16706-qMfhkWuHkWhX.jpg",
  "year": 2013,
  "al": ["The World God Only Knows: Goddesses", "神のみぞ知るセカイ 女神篇", "Kami nomi zo Shiru Sekai III", "Kami nomi zo Shiru Sekai 3", "Kaminomi III", "Kaminomi 3", "Que sa volonté soit faite III"],
  "r": 1235
 },
 {
  "id": 21390,
  "name": "Gakusen Toshi Asterisk 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21390-5MedgrU15Twy.jpg",
  "year": 2016,
  "al": ["The Asterisk War 2", "学戦都市アスタリスク 2"],
  "r": 1236
 },
 {
  "id": 159808,
  "name": "Hikikomari Kyuuketsuki no Monmon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx159808-svpzcGb6ig4X.jpg",
  "year": 2023,
  "al": ["The Vexations of a Shut-In Vampire Princess", "ひきこまり吸血姫の悶々", "สารพันปัญหาวุ่นวาย ของยัยแวมไพร์ขี้จุ๊", "I tormenti della vampira reclusa", "家裡蹲吸血姬的鬱悶"],
  "r": 1237
 },
 {
  "id": 10278,
  "name": "THE IDOLM@STER",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx10278-FnbOihGuSpfc.jpg",
  "year": 2011,
  "al": ["The Idol Master", "アイドルマスター", "The Idolmaster"],
  "r": 1238
 },
 {
  "id": 155418,
  "name": "Seija Musou: Salaryman, Isekai de Ikinokoru Tame ni Ayumu Michi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx155418-wLWulAHYVrE5.jpg",
  "year": 2023,
  "al": ["The Great Cleric", "聖者無双 ～サラリーマン、異世界で生き残るために歩む道～", "นักบุญไร้เทียมทาน หนทางรอดในต่างโลกของมนุษย์เงินเดือน", "Великий святой", "The Great Cleric: White-Collar Survival in Another World", "Invincible Saint: Salaryman, the Path I Walk to Survive in This Other World", "Padri Agung", "Padri Agung: Jalan yang Dipilih Seorang Pekerja Kantor untuk Bertahan Hidup di Dunia Lain"],
  "r": 1239
 },
 {
  "id": 18179,
  "name": "Yowamushi Pedal",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx18179-YG0tghcQBxGe.png",
  "year": 2013,
  "al": ["弱虫ペダル", "Yowapeda"],
  "r": 1240
 },
 {
  "id": 102882,
  "name": "3D Kanojo: Real Girl 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx102882-lKp3ExWNzoE6.jpg",
  "year": 2019,
  "al": ["Real Girl 2", "3D彼女 リアルガール 2"],
  "r": 1241
 },
 {
  "id": 107956,
  "name": "Uchi no Ko no Tame Naraba, Ore wa Moshikashitara Maou mo Taoseru Kamo Shirenai.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx107956-bYR4EjoV6TFu.jpg",
  "year": 2019,
  "al": ["If It's for My Daughter, I'd Even Defeat a Demon Lord", "うちの娘の為ならば、俺はもしかしたら魔王も倒せるかもしれない。", "For My Daughter, I'd Even Defeat a Demon Lord", "Uchinoko", "UchiMusume", "เพื่อลูกจ๋า ปะป๋าขอลุย"],
  "r": 1242
 },
 {
  "id": 9863,
  "name": "SKET DANCE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx9863-G6dAvTVsfLRO.png",
  "year": 2011,
  "al": ["スケットダンス"],
  "r": 1243
 },
 {
  "id": 127050,
  "name": "Koroshi Ai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx127050-kJ3pIbJzLDYT.png",
  "year": 2022,
  "al": ["Love of Kill", "殺し愛"],
  "r": 1244
 },
 {
  "id": 100891,
  "name": "Kengan Ashura",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100891-vPfnfkzizYFe.jpg",
  "year": 2019,
  "al": ["KENGAN ASHURA Part I", "ケンガンアシュラ", "КЕНҐАН АСУРА", "Кэнган Асура"],
  "r": 1245
 },
 {
  "id": 283,
  "name": "Akage no Anne",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx283-HlHQFRlU8IfB.png",
  "year": 1979,
  "al": ["Anne of Green Gables", "赤毛のアン", "Sekai Meisaku Gekijou", "Red haired Anne", "Anne the Redhead", "World Masterpiece Theater", "WMT", "האסופית"],
  "r": 1246
 },
 {
  "id": 10863,
  "name": "Steins;Gate: Oukoubakko no Poriomania",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10863-V6oW2kN8bBYf.png",
  "year": 2012,
  "al": ["Steins;Gate: Egoistic Poriomania", "シュタインズ・ゲート 横行跋扈のポリオマニア", "Steins", "Gate Special", "Poriomanía del egoismo"],
  "r": 1247
 },
 {
  "id": 150,
  "name": "BLOOD+",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx150-YRcwKiJEXcLx.png",
  "year": 2005,
  "al": ["ブラッドプラス", "Blood Plus"],
  "r": 1248
 },
 {
  "id": 140999,
  "name": "Sword Art Online: Progressive - Kuraki Yuuyami no Scherzo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx140999-8nRYAPkywhbl.jpg",
  "year": 2022,
  "al": ["Sword Art Online the Movie -Progressive- Scherzo of Deep Night", "劇場版 ソードアート・オンライン プログレッシブ 冥き夕闇のスケルツォ", "Sword Art Online: Progressive - Scherzo of Dark Night", "SAO Progressive", "SAOP", "Sword Art Online : Progressive - สแกรโซแห่งสนธยาโศก", "Sword Art Online: Progressive - Scherzo de una profunda oscuridad", "Sword Art Online Progressive: Scherzo do Crepúsculo Sombrio"],
  "r": 1249
 },
 {
  "id": 18,
  "name": "Initial D FOURTH STAGE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b18-r7IirVmwP89u.jpg",
  "year": 2004,
  "al": ["Initial D 4th Stage", "頭文字[イニシャル]D FOURTH STAGE"],
  "r": 1250
 },
 {
  "id": 20806,
  "name": "Cross Ange: Tenshi to Ryuu no Rondo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20806-TFTl8bavYzvc.jpg",
  "year": 2014,
  "al": ["Cross Ange: Rondo of Angel and Dragon", "クロスアンジュ 天使と竜の輪舞"],
  "r": 1251
 },
 {
  "id": 100500,
  "name": "Kakuriyo no Yadomeshi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100500-D1InEy2GriJV.jpg",
  "year": 2018,
  "al": ["Kakuriyo -Bed & Breakfast for Spirits-", "かくりよの宿飯"],
  "r": 1252
 },
 {
  "id": 125368,
  "name": "Kaguya-sama wa Kokurasetai: Tensaitachi no Renai Zunousen OVA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx125368-QhcBkbNP0ZfU.png",
  "year": 2021,
  "al": ["かぐや様は告らせたい～天才たちの恋愛頭脳戦～OVA", "Kaguya-sama: Love is War OVA", "Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen OVA"],
  "r": 1253
 },
 {
  "id": 179965,
  "name": "Haite Kudasai, Takamine-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx179965-EwqzG3xSyxwc.jpg",
  "year": 2025,
  "al": ["Please Put Them On, Takamine-san", "履いてください、鷹峰さん", "Let Me Put Your Panties On, Takamine-san", "Please Put These On, Takamine"],
  "r": 1254
 },
 {
  "id": 20963,
  "name": "Kyoukai no Kanata: I'LL BE HERE - Mirai-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx20963-xWZjgqAdFOfn.png",
  "year": 2015,
  "al": ["Beyond the Boundary -I'LL BE HERE-: Future", "劇場版 境界の彼方 I'LL BE HERE 未来篇", "Kyoukai no Kanata: I’ll Be Here – przyszłość"],
  "r": 1255
 },
 {
  "id": 185262,
  "name": "Hell Mode: Yarikomi-zuki no Gamer wa Haisettei no Isekai de Musou Suru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx185262-95wbx3Y9hCwm.jpg",
  "year": 2026,
  "al": ["HELL MODE: The Hardcore Gamer Dominates in Another World with Garbage Balancing", "ヘルモード ～やり込み好きのゲーマーは廃設定の異世界で無双する～", "HELL MODE อยากเล่นโหด ขอโหมดนรก"],
  "r": 1256
 },
 {
  "id": 1726,
  "name": "Devil May Cry",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1726-IrpH32PVADiO.jpg",
  "year": 2007,
  "al": ["デビル メイ クライ", "DMC"],
  "r": 1257
 },
 {
  "id": 875,
  "name": "Mind Game",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx875-kvQVUKDPcAKl.png",
  "year": 2004,
  "al": ["マインド・ゲーム", "Mindgame"],
  "r": 1258
 },
 {
  "id": 150972,
  "name": "Shiro Seijo to Kuro Bokushi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx150972-3gNJvsyu7lwP.png",
  "year": 2023,
  "al": ["Saint Cecilia & Pastor Lawrence", "白聖女と黒牧師", "The White Holy Woman and the Black Priest", "White Saint and Black Pastor", "Santa Cecília e Padre Lawrence", "นักบุญจอมเฉื่อย & บาทหลวงผู้เอาใจใส่", "Die Heilige Cecilia und Pastor Lawrence"],
  "r": 1259
 },
 {
  "id": 20635,
  "name": "Dragon Ball Kai (2014)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20635-gUYy4KZfYRb0.jpg",
  "year": 2014,
  "al": ["Dragon Ball Z Kai: The Final Chapters", "ドラゴンボール改 (2014)", "Dragon Ball Kai", "DBK", "DB Kai", "DBZ Kai", "Драконий жемчуг Кай (2014)"],
  "r": 1260
 },
 {
  "id": 966,
  "name": "Crayon Shin-chan",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b966-QUCdKAk4ls9J.jpg",
  "year": 1992,
  "al": ["Shin Chan", "クレヨンしんちゃん"],
  "r": 1261
 },
 {
  "id": 108388,
  "name": "Choujin Koukousei-tachi wa Isekai demo Yoyuu de Ikinuku you desu!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx108388-DV17bODJAKlR.jpg",
  "year": 2019,
  "al": ["High School Prodigies Have It Easy Even In Another World", "超人高校生たちは異世界でも余裕で生き抜くようです!", "CHOYOYU!", "¡Los prodigios de bachillerato han llegado a otro mundo!", "Les super lycéens arrivent dans un autre monde!", "I prodigi delle superiori sono arrivati in un altro mondo!", "Die Oberschul-Wunderkinder sind in einer anderen Welt eingetroffen!", "Сверходарённые школьники прибыли в другой мир"],
  "r": 1262
 },
 {
  "id": 180929,
  "name": "Ruri no Houseki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx180929-ytdzqbrOhots.jpg",
  "year": 2025,
  "al": ["Ruri Rocks", "瑠璃の宝石", "Introduction to Mineralogy"],
  "r": 1263
 },
 {
  "id": 87494,
  "name": "Hitorijime My Hero",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx87494-jzaf0chomVA9.jpg",
  "year": 2017,
  "al": ["ひとりじめマイヒーロー", "My Very Own Hero"],
  "r": 1264
 },
 {
  "id": 1530,
  "name": "Kanon (2006)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1530-nkzstlVZhZNG.jpg",
  "year": 2006,
  "al": ["カノン (2006)", "Kanon Remake", "Kanon 2006"],
  "r": 1265
 },
 {
  "id": 126047,
  "name": "Deatte 5-byou de Battle",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx126047-C3ivEjzfigA0.jpg",
  "year": 2021,
  "al": ["Battle Game in 5 Seconds", "出会って5秒でバトル", "Battle in 5 seconds after meeting.", "ศึกเดือด 5 วิ พลิกชะตา"],
  "r": 1266
 },
 {
  "id": 11285,
  "name": "Black★Rock Shooter (TV)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11285-uO6GgQUjikbf.jpg",
  "year": 2012,
  "al": ["Black Rock Shooter", "ブラック★ロックシューター (TV)", "BRS TV", "Black Rock Shooter TV"],
  "r": 1267
 },
 {
  "id": 20694,
  "name": "Non Non Biyori: Repeat",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20694-Brxd5Unqa5fP.png",
  "year": 2015,
  "al": ["Non Non Biyori Repeat", "のんのんびより りぴーと"],
  "r": 1268
 },
 {
  "id": 98449,
  "name": "Kujira no Kora wa Sajou ni Utau",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98449-CxVQsAWFPpMa.jpg",
  "year": 2017,
  "al": ["Children of the Whales", "クジラの子らは砂上に歌う", "KujiSuna", "Die Walkinder", "Hijos de las Ballenas", "أبناء الحيتان", "ลำนำของเหล่าลูกปลาวาฬ", "Kujira no Kora - Filhos das Baleias"],
  "r": 1269
 },
 {
  "id": 178548,
  "name": "Fuguushoku [Kanteishi] ga Jitsu wa Saikyou Datta: Naraku de Kitaeta Saikyou no [Shingan] de Musou Suru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178548-4QkzBuJAx8w7.jpg",
  "year": 2025,
  "al": ["Even Given the Worthless “Appraiser” Class, I’m Actually the Strongest", "不遇職【鑑定士】が実は最強だった～奈落で鍛えた最強の【神眼】で無双する～", "FuguKan", "ふぐ鑑", "Đen đủi khi có nghề [Giám định sĩ] nhưng tôi lại là người mạnh nhất"],
  "r": 1270
 },
 {
  "id": 129068,
  "name": "Shinka no Mi: Shiranai Uchi ni Kachigumi Jinsei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx129068-HlY1UqLyrbmB.jpg",
  "year": 2021,
  "al": ["The Fruit of Evolution: Before I Knew It, My Life Had It Made", "進化の実～知らないうちに勝ち組人生～", "ผลไม้วิวัฒนาการ: ชีวิตผู้ชนะแบบไม่ทันตั้งตัว"],
  "r": 1271
 },
 {
  "id": 21520,
  "name": "Koyomimonogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21520-nZKCr7PZrv7e.png",
  "year": 2016,
  "al": ["暦物語", "Calendar Tale"],
  "r": 1272
 },
 {
  "id": 106509,
  "name": "Tensei Shitara Slime Datta Ken OVA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx106509-nTJyMJKbvRFn.jpg",
  "year": 2019,
  "al": ["That Time I Got Reincarnated as a Slime OAD", "転生したらスライムだった件 OVA", "ten·sura", "転スラ", "Tensei Shitara Slime Datta Ken (2019)", "That Time I Got Reincarnated as a Slime OVA", "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว OAD", "Moi, quand je me réincarne en Slime OAD"],
  "r": 1273
 },
 {
  "id": 3972,
  "name": "Yu☆Gi☆Oh! 5D's",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx3972-bSmlWKXrVvDv.png",
  "year": 2008,
  "al": ["Yu-Gi-Oh! 5D's", "遊☆戯☆王5D's（ファイブディーズ）", "יו-גי-הו! המימד החמישי"],
  "r": 1274
 },
 {
  "id": 101547,
  "name": "Isekai Cheat Magician",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101547-Y0uARlMRaARP.jpg",
  "year": 2019,
  "al": ["異世界チート魔術師", "ผ่ามิติแหกกฎมนตรา"],
  "r": 1275
 },
 {
  "id": 170890,
  "name": "THE NEW GATE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170890-XrggQYjAJAGa.jpg",
  "year": 2024,
  "al": ["ザ・ニュー・ゲート", "TNG"],
  "r": 1276
 },
 {
  "id": 177637,
  "name": "Sayonara Lara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx177637-8onaQWqKW1C3.jpg",
  "year": 2026,
  "al": ["Goodbye, Lara", "さよならララ", "さよララ", "SayoLara"],
  "r": 1277
 },
 {
  "id": 687,
  "name": "Tokyo Mew Mew",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx687-d0VfkLNsEDeu.png",
  "year": 2002,
  "al": ["東京ミュウミュウ", "Mew Mew Power", "As Super Gatinhas"],
  "r": 1278
 },
 {
  "id": 21560,
  "name": "Berserk",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21560-6iifjdssfebJ.jpg",
  "year": 2016,
  "al": ["Berserk (2016)", "ベルセルク"],
  "r": 1279
 },
 {
  "id": 134252,
  "name": "Fantasy Bishoujo Juniku Oji-san to",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx134252-6pwG0YdI20aQ.jpg",
  "year": 2022,
  "al": ["Life With an Ordinary Guy Who Reincarnated Into a Total Fantasy Knockout", "異世界美少女受肉おじさんと", "เกิดใหม่ต่างโลก เพื่อนผมน่ารักโฮกเลยครับ", "Fabiniku", "В другом мире с мужчиной, обратившимся красоткой", "ファ美肉おじさん"],
  "r": 1280
 },
 {
  "id": 104463,
  "name": "Toaru Kagaku no Accelerator",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104463-nlo4ndS9Mt0P.jpg",
  "year": 2019,
  "al": ["A Certain Scientific Accelerator", "とある科学の一方通行【アクセラレータ】", "科学一方通行", "แอคเซลเลอร์เรเตอร์ แฟ้มลับคดีวิทยาศาสตร์", "แฟ้มลับคดีเด็กหาย", "Máy gia tốc khoa học nhất định", "Akselerator Ilmu Pengetahuan Tertentu"],
  "r": 1281
 },
 {
  "id": 11433,
  "name": "Ano Natsu de Matteru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11433-KLEzZeK6D46g.jpg",
  "year": 2012,
  "al": ["Waiting in the Summer", "あの夏で待ってる", "Natsumachi"],
  "r": 1282
 },
 {
  "id": 102680,
  "name": "Watashi ni Tenshi ga Maiorita!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx102680-75Mgrnn65PAg.png",
  "year": 2019,
  "al": ["WATATEN!: an Angel Flew Down to Me", "私に天使が舞い降りた！", "Wataten", "An Angel Swooped Down on Me!", "นางฟ้าตัวน้อยได้ลงมาโปรดฉันค่ะ"],
  "r": 1283
 },
 {
  "id": 200637,
  "name": "Kimi no Koto ga Dai Dai Dai Dai Daisuki na 100-nin no Kanojo 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx200637-QLR5uv9SbQ69.jpg",
  "year": 2026,
  "al": ["The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You Season 3", "君のことが大大大大大好きな100人の彼女 第3期", "Hyakkano 3", "รักรักรักรักรักเธอหมดหัวใจจากแฟนสาว 100 คน ซีซั่น 3"],
  "r": 1284
 },
 {
  "id": 21269,
  "name": "SERVAMP",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21269-NU0MR6HcefqO.jpg",
  "year": 2016,
  "al": ["サーヴァンプ"],
  "r": 1285
 },
 {
  "id": 1462,
  "name": "MEMORIES",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1462-wHe4bW5b6XRE.png",
  "year": 1995,
  "al": ["メモリーズ", "彼女の想いで", "最臭兵器", "大砲の街", "Kanojo no Omoide", "Saishuu-heiki", "Taihou no Machi", "Magnetic Rose"],
  "r": 1286
 },
 {
  "id": 136192,
  "name": "Fruits Basket: prelude",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx136192-hxeNRzBHizBZ.jpg",
  "year": 2022,
  "al": ["Fruits Basket -prelude-", "フルーツバスケット -prelude-", "The Story of Kyoko and Katsuya", "今日子と勝也の物語", "Kyouko to Katsuya no Monogatari", "Fruits Basket Movie", "Корзинка фруктов: Прелюдия"],
  "r": 1287
 },
 {
  "id": 142193,
  "name": "Eiyuu-ou, Bu wo Kiwameru Tame Tenseisu: Soshite, Sekai Saikyou no Minarai Kishi♀",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142193-3S6gtp7PHLNL.jpg",
  "year": 2023,
  "al": ["Reborn to Master the Blade: From Hero-King to Extraordinary Squire", "英雄王、武を極めるため転生す ～そして、世界最強の見習い騎士♀～", "ราชาวีรชน เกิดใหม่เพื่อขัดเกลาวิถีต่อสู้ และ กลายเป็นอัศวินฝึกหัดที่แกร่งสุดในโลก", "英雄王，為了窮盡武道而轉生～而後成為世界最強見習騎士♀～", "英雄王，为了穷尽武道而转生～然后，成为世界最强的见习骑士♀", "Eiyuuou, Bu wo Kiwameru Tame Tenseisu", "Raja Pahlawan Bereinkarnasi Untuk Mengasah Ilmu Bela Diri", "Переродился, чтобы стать мастером меча: из великого короля в ученицу рыцаря"],
  "r": 1288
 },
 {
  "id": 178433,
  "name": "Isekai Mokushiroku Mynoghra: Hametsu no Bunmei de Hajimeru Sekai Seifuku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178433-8KzNsjTmdAvw.jpg",
  "year": 2025,
  "al": ["Apocalypse Bringer Mynoghra: World Conquest Starts with the Civilization of Ruin", "異世界黙示録マイノグーラ ～破滅の文明で始める世界征服～", "Khải huyền dị giới Mynoghra: Chinh phục thế giới từ nền văn minh suy tàn", "Apokalips Dunia Lain Mynoghra: Menaklukkan Dunia Dimulai dari Peradaban Kehancuran"],
  "r": 1289
 },
 {
  "id": 182483,
  "name": "Hime Kishi wa Barbaroi no Yome",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx182483-La7chs6htDWr.jpg",
  "year": 2026,
  "al": ["The Warrior Princess and the Barbaric King", "姫騎士は蛮族の嫁", "The Barbarian’s Bride", "The Bride of Barbaroi", "Himekishi wa Barbaroi no Yome", "バルよめ", "BaruYome", "Принцесса-рыцарь — невеста варвара"],
  "r": 1290
 },
 {
  "id": 1453,
  "name": "Maison Ikkoku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx1453-mghhMKzxEVcQ.jpg",
  "year": 1986,
  "al": ["めぞん一刻", "Ikkoku House", "Juliette je t'aime", "Cara dolce Kyoko"],
  "r": 1291
 },
 {
  "id": 7593,
  "name": "kiss×sis (TV)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b7593-6a0TvcDmgjP9.jpg",
  "year": 2010,
  "al": ["キスシス", "kiss x sis"],
  "r": 1292
 },
 {
  "id": 98292,
  "name": "NEW GAME!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx98292-jY1lqjOBBQs4.jpg",
  "year": 2017,
  "al": ["Новая игра!!"],
  "r": 1293
 },
 {
  "id": 142666,
  "name": "Migi to Dali",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142666-QI7zhl1ClcRg.jpg",
  "year": 2023,
  "al": ["Migi&Dali", "ミギとダリ"],
  "r": 1294
 },
 {
  "id": 10379,
  "name": "Natsume Yuujinchou San",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10379-lS2Mk6lX4lZr.jpg",
  "year": 2011,
  "al": ["Natsume's Book of Friends Season 3", "夏目友人帳 参", "Natsume Yuujinchou Three", "Natsume Yuujinchou 3", "Natsume Yujincho 3", "O Livro de Amigos de Natsume 3"],
  "r": 1295
 },
 {
  "id": 149883,
  "name": "Dekiru Neko wa Kyou mo Yuuutsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx149883-D2LSB7hm5bhv.png",
  "year": 2023,
  "al": ["The Masterful Cat is Depressed Again Today", "デキる猫は今日も憂鬱", "DekiNeko", "เรื่องน่ากลุ้มของเจ้าเหมียวผู้สามารถ", "O Gato Prendado está Deprimido Hoje de Novo", "能幹貓今天也憂鬱", "Кот-домохозяин сегодня снова грустит"],
  "r": 1296
 },
 {
  "id": 2154,
  "name": "Tekkon Kinkreet",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx2154-R7xZo22O9FjK.png",
  "year": 2006,
  "al": ["Tekkonkinkreet", "鉄コン筋クリート", "Black & White", "Amer Béton"],
  "r": 1297
 },
 {
  "id": 5682,
  "name": "Phantom: Requiem for the Phantom",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5682-13S0UNmJInAE.png",
  "year": 2009,
  "al": ["Phantom 〜Requiem for the Phantom〜"],
  "r": 1298
 },
 {
  "id": 151799,
  "name": "New PANTY & STOCKING with GARTERBELT",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx151799-igwbH3AffgHc.jpg",
  "year": 2025,
  "al": ["PSG2", "P&SWG2", "NEW PSG", "Panty & Stocking with Garterbelt Season 2"],
  "r": 1299
 },
 {
  "id": 105989,
  "name": "Midara na Ao-chan wa Benkyou ga Dekinai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105989-Jooq6bqkeeiP.jpg",
  "year": 2019,
  "al": ["Ao-chan Can't Study!", "みだらな青ちゃんは勉強ができない"],
  "r": 1300
 },
 {
  "id": 111314,
  "name": "Uzumaki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx111314-ui2D6cvpNumy.jpg",
  "year": 2024,
  "al": ["うずまき", "The Spiral", "ก้นหอยมรณะ", "أوزوماكي", "Uzumaki. Spirala", "UZUMAKI: Animated TV Series"],
  "r": 1301
 },
 {
  "id": 5300,
  "name": "Zoku Natsume Yuujinchou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5300-t9N4PoOkPAdS.jpg",
  "year": 2009,
  "al": ["Natsume's Book of Friends Season 2", "続 夏目友人帳", "Natsume Yuujinchou Two", "Natsume Yuujinchou 2", "Natsume Yujincho 2", "O Livro de Amigos de Natsume 2"],
  "r": 1302
 },
 {
  "id": 131516,
  "name": "Do It Yourself!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131516-kLB37ISBeOX0.jpg",
  "year": 2022,
  "al": ["Do It Yourself!! -どぅー・いっと・ゆあせるふ-", "DIY!!", "Сделай сама!"],
  "r": 1303
 },
 {
  "id": 192507,
  "name": "Uruwashi no Yoi no Tsuki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx192507-SCmImUlUnpAD.jpg",
  "year": 2026,
  "al": ["In the Clear Moonlit Dusk", "うるわしの宵の月", "เมื่อสาวหล่อขอมีรัก", "Любовь прекрасной Ёи"],
  "r": 1304
 },
 {
  "id": 119675,
  "name": "SHAMAN KING (2021)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx119675-ziQ6Lb80zEx4.png",
  "year": 2021,
  "al": ["シャーマンキング (2021)", "ملك الشامان", "通灵王", "שאמן קינג", "Король шаманов", "Βασιλιάς Σαμάνος", "Król szamanów", "Rey Chamán"],
  "r": 1305
 },
 {
  "id": 127400,
  "name": "World Trigger 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx127400-m2xz2qDVqQwL.jpg",
  "year": 2021,
  "al": ["ワールドトリガー 3rdシーズン", "Импульс мира 3"],
  "r": 1306
 },
 {
  "id": 155890,
  "name": "Bartender: Kami no Glass",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b155890-PN3wsgVDofhB.jpg",
  "year": 2024,
  "al": ["BARTENDER Glass of God", "バーテンダー 神のグラス", "Bartender (New Anime)", "Бармен: божественный стакан"],
  "r": 1307
 },
 {
  "id": 16,
  "name": "Hachimitsu to Clover",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16-S9k8qahNXoYP.jpg",
  "year": 2005,
  "al": ["Honey and Clover", "ハチミツとクローバー", "HachiKuro", "Honey & Clover"],
  "r": 1308
 },
 {
  "id": 101166,
  "name": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka: Orion no Ya",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101166-aF8tzfuui6Bp.jpg",
  "year": 2019,
  "al": ["Is It Wrong to Try to Pick Up Girls in a Dungeon?: Arrow of the Orion", "ダンジョンに出会いを求めるのは間違っているだろうか ─ オリオンの矢 ─", "DanMachi: Arrow of the Orion"],
  "r": 1309
 },
 {
  "id": 21365,
  "name": "Dagashi Kashi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21365-FRalqWQn0lf9.jpg",
  "year": 2016,
  "al": ["だがしかし"],
  "r": 1310
 },
 {
  "id": 139310,
  "name": "Boku ga Aishita Subete no Kimi e",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139310-OM1RKpk5YH7g.jpg",
  "year": 2022,
  "al": ["To Every You I’ve Loved Before", "僕が愛したすべての君へ", "Nhắn gửi tất cả các em, những người tôi đã yêu", "BokuAi"],
  "r": 1311
 },
 {
  "id": 180082,
  "name": "Chitose-kun wa Ramune Bin no Naka",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx180082-IZAlf06G2VVm.png",
  "year": 2025,
  "al": ["Chitose Is in the Ramune Bottle", "千歳くんはラムネ瓶のなか", "Ramune no Bin ni Shizunda Biidama no Tsuki", "ラムネの瓶に沈んだビー玉の月", "Chiramune", "チラムネ", "ชีวิตรสโซดาของจิโตะเสะคุง"],
  "r": 1312
 },
 {
  "id": 122052,
  "name": "Kaizoku Oujo",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx122052-nb8cfAe7pniT.jpg",
  "year": 2021,
  "al": ["Fena: Pirate Princess", "海賊王女"],
  "r": 1313
 },
 {
  "id": 127595,
  "name": "Wu Liuqi: Xuanwu Guo Pian",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx127595-PXUt146nepcP.png",
  "year": 2021,
  "al": ["Scissor Seven Season 3", "伍六七之玄武国篇", "Scissor Seven: The Kingdom of Xuanwu", "Киллер с ножницами 3"],
  "r": 1314
 },
 {
  "id": 139311,
  "name": "Kimi wo Aishita Hitori no Boku e",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139311-5iHY459iwQ46.jpg",
  "year": 2022,
  "al": ["To Me, The One Who Loved You", "君を愛したひとりの僕へ", "Nhắn gửi một tôi, người đã yêu em", "KimiAi"],
  "r": 1315
 },
 {
  "id": 142701,
  "name": "Koukyuu no Karasu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx142701-jyjYorMpj3lf.jpg",
  "year": 2022,
  "al": ["Raven of the Inner Palace", "後宮の烏"],
  "r": 1316
 },
 {
  "id": 87495,
  "name": "IDOLiSH7",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx87495-DH0xWBYac5sw.jpg",
  "year": 2018,
  "al": ["アイドリッシュセブン", "ไอดอลลิช เซเว่น"],
  "r": 1317
 },
 {
  "id": 112153,
  "name": "Pocket Monsters (2019)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112153-LK1lpFz3vlvl.png",
  "year": 2019,
  "al": ["Pokémon Journeys: The Series", "ポケットモンスター (2019)", "Pokemon (2019)", "Pokémon (2019)", "Pokémon Reiser: Serien", "Pokémon Reisen: Die Serie", "Viajes Pokémon", "Pokémon, les voyages"],
  "r": 1318
 },
 {
  "id": 167420,
  "name": "NieR:Automata Ver1.1a 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx167420-PBxeW0tmbEDQ.jpg",
  "year": 2024,
  "al": ["NieR:Automata Ver1.1a Cour 2", "NieR:Automata Ver1.1a 第2期"],
  "r": 1319
 },
 {
  "id": 5042,
  "name": "kiss×sis",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5042-FZ8XdXStvn0u.png",
  "year": 2009,
  "al": ["Kiss x Sis", "キスシス"],
  "r": 1320
 },
 {
  "id": 184492,
  "name": "Mairimashita! Iruma-kun 4",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx184492-KUVFGieuMaOx.jpg",
  "year": 2026,
  "al": ["Welcome to Demon School! Iruma-kun Season 4", "魔入りました！入間くん 第4シリーズ", "อิรุมะคุง ผจญในแดนปีศาจ ซีซั่น 4"],
  "r": 1321
 },
 {
  "id": 99900,
  "name": "Eiga Daisuki Pompo-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99900-YpWbTgc4wr7A.jpg",
  "year": 2021,
  "al": ["Pompo: The Cinéphile", "映画大好きポンポさん", "ปอมโปะ ทีมป่วนก๊วนทำหนัง", "Coming Soon", "פומפו חובבת הקולנוע", "Pompo, la cinefila", "Pompo: A Cinéfila"],
  "r": 1322
 },
 {
  "id": 97634,
  "name": "Pocket Monsters Sun & Moon",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx97634-P3p6KJiZFajv.png",
  "year": 2016,
  "al": ["Pokémon the Series: Sun & Moon", "ポケットモンスター サン＆ムーン", "Pokèmon: Sun & Moon", "Pokémon: Sol y Luna", "Pokémon-serien: Sol og Måne", "Pokémon – Seria: Słońce i Księżyc", "宝可梦 太阳&月亮", "Serie Pokèmon Sole e Luna"],
  "r": 1323
 },
 {
  "id": 114979,
  "name": "Love Live! Superstar!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114979-H9anmAB2Z7uo.jpg",
  "year": 2021,
  "al": ["ラブライブ!スーパースター!!", "เลิฟไลฟ์! ซูเปอร์สตาร์!!", "Лав Лайв! Суперзвезда!!"],
  "r": 1324
 },
 {
  "id": 5941,
  "name": "Cross Game",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx5941-Rl3qnxfiRCy1.jpg",
  "year": 2009,
  "al": ["クロスゲーム"],
  "r": 1325
 },
 {
  "id": 169441,
  "name": "Watashi no Shiawase na Kekkon 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx169441-DHutDkhkC8EN.jpg",
  "year": 2025,
  "al": ["My Happy Marriage Season 2", "わたしの幸せな結婚 第二期", "WataKon 2", "ขอให้รักเรานี้ได้มีความสุข", "Moje szczęśliwe małżeństwo. Sezon 2", "Hôn nhân hạnh phúc của tôi", "Meu Casamento Feliz", "Il mio matrimonio felice"],
  "r": 1326
 },
 {
  "id": 153,
  "name": "Juuni Kokuki",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153-pLhZPQCYk7hl.png",
  "year": 2002,
  "al": ["The Twelve Kingdoms", "十二国記", "12 Kingdoms", "Juuni Kokki", "Les 12 Royaumes", "12 อาณาจักรเทพยุทธ์", "Thập nhị quốc ký", "Doce Reinos"],
  "r": 1327
 },
 {
  "id": 21005,
  "name": "Grisaia no Meikyuu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21005-XM9fdXguR1CO.jpg",
  "year": 2015,
  "al": ["The Labyrinth of Grisaia", "グリザイアの迷宮", "Le Labyrinthe De La Grisaia"],
  "r": 1328
 },
 {
  "id": 464,
  "name": "ONE PIECE THE MOVIE: Omatsuri Danshaku to Himitsu no Shima",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx464-g4wcZPjbhY5j.png",
  "year": 2005,
  "al": ["One Piece: Baron Omatsuri and the Secret Island", "ONE PIECE THE MOVIE オマツリ男爵と秘密の島", "One Piece Movie 6", "One Piece: El barón Omatsuri y la isla de los secretos", "One Piece - L'isola segreta del barone Omatsuri"],
  "r": 1329
 },
 {
  "id": 21637,
  "name": "Uchuu Patrol Luluco",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21637-6SulVMOqv77m.jpg",
  "year": 2016,
  "al": ["Space Patrol Luluco", "宇宙パトロールルル子"],
  "r": 1330
 },
 {
  "id": 21803,
  "name": "Kubikiri Cycle: Aoiro Savant to Zaregotozukai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b21803-BAQClgq6Q0DP.jpg",
  "year": 2016,
  "al": ["Kubikiri Cycle: The Blue Savant and the Nonsense User", "クビキリサイクル 青色サヴァンと戯言遣い", "Zaregoto Series", "Decapitation Cycle", "Kubikiri Cycle: Aoiro Savant to Zaregoto Tsukai"],
  "r": 1331
 },
 {
  "id": 99693,
  "name": "PERSONA5 the Animation",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99693-3YTkA0ZnEOqH.jpg",
  "year": 2018,
  "al": ["P5A", "ペルソナ5アニメーション"],
  "r": 1332
 },
 {
  "id": 100185,
  "name": "Toaru Majutsu no Index III",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100185-mZquZyZ8QbSS.jpg",
  "year": 2018,
  "al": ["A Certain Magical Index III", "とある魔術の禁書目録III", "Toaru Majutsu no Index 3", "魔法禁书目录第三季", "魔法禁书目录 3", "อินเดกซ์คัมภีร์คาถาต้องห้าม ภาค 3", "Cấm thư ma thuật Index III"],
  "r": 1333
 },
 {
  "id": 140660,
  "name": "Arknights: Reimei Zensou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx140660-iJAS9omOJdzU.jpg",
  "year": 2022,
  "al": ["Arknights: PRELUDE TO DAWN", "アークナイツ 黎明前奏", "明日方舟: 黎明前奏"],
  "r": 1334
 },
 {
  "id": 2104,
  "name": "Seto no Hanayome",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2104-8nyExxxIKd3P.jpg",
  "year": 2007,
  "al": ["My Bride is a Mermaid", "瀬戸の花嫁", "The Inland Sea Bride"],
  "r": 1335
 },
 {
  "id": 138714,
  "name": "Heike Monogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx138714-dLyXT5qyTYbr.jpg",
  "year": 2021,
  "al": ["The Heike Story", "平家物語", "เรื่องของเฮเกะ"],
  "r": 1336
 },
 {
  "id": 19613,
  "name": "Initial D Final Stage",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx19613-5vb40lsFXudd.png",
  "year": 2014,
  "al": ["頭文字[イニシャル]D Final Stage"],
  "r": 1337
 },
 {
  "id": 156040,
  "name": "Higeki no Genkyou to Naru Saikyou Gedou Last Boss Joou wa Tami no Tame ni Tsukushimasu.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx156040-qWlfbAk6GJJR.png",
  "year": 2023,
  "al": ["The Most Heretical Last Boss Queen: From Villainess to Savior", "悲劇の元凶となる最強外道ラスボス女王は民の為に尽くします。", "โศกนาฏกรรมของตัวร้ายสุดแกร่งอย่างราชินีลาสบอสจะขอถวายตัวเพื่อปวงชน", "Ratu sang Bos Terakhir Paling Gila yang Akan Menjadi Sumber Tragedi Ingin Berjuang Demi Seluruh Rakyatnya", "ラス為", "LasTame"],
  "r": 1338
 },
 {
  "id": 162669,
  "name": "Fumetsu no Anata e Season 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx162669-FLYUTftoXgMh.jpg",
  "year": 2025,
  "al": ["To Your Eternity Season 3", "不滅のあなたへ Season 3"],
  "r": 1339
 },
 {
  "id": 108581,
  "name": "Hi Score Girl II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b108581-gmxhJcBbITCl.jpg",
  "year": 2019,
  "al": ["ハイスコアガール II", "High Score Girl 2nd Season"],
  "r": 1340
 },
 {
  "id": 128715,
  "name": "Niehime to Kemono no Ou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx128715-T4Tne2TcqfVx.jpg",
  "year": 2023,
  "al": ["Sacrificial Princess and the King of Beasts", "贄姫と獣の王", "เจ้าหญิงผู้เสียสละกับราชาอสูร", "A Princesa Oferenda e o Rei das Feras", "La Princesse et la Bête", "Жертвенная принцесса и владыка зверей"],
  "r": 1341
 },
 {
  "id": 167143,
  "name": "Guild no Uketsukejou desu ga, Zangyou wa Iya nanode Boss wo Solo Toubatsu Shiyou to Omoimasu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx167143-iY2ho0I0KnYF.jpg",
  "year": 2025,
  "al": ["I May Be a Guild Receptionist, but I’ll Solo Any Boss to Clock Out on Time", "ギルドの受付嬢ですが、残業は嫌なのでボスをソロ討伐しようと思います", "Uketsukejou Saikyou", "Girumasu", "ギルます", "雖然是公會的櫃檯小姐，但因為不想加班所以打算獨自討伐迷宮頭目"],
  "r": 1342
 },
 {
  "id": 124675,
  "name": "Osananajimi ga Zettai ni Makenai Love Kome",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx124675-fNI06ipb65vy.jpg",
  "year": 2021,
  "al": ["Osamake: Romcom Where The Childhood Friend Won't Lose", "幼なじみが絶対に負けないラブコメ", "Osananajimi ga Zettai ni Makenai Love Comedy", "OsaMake", "ความรักนี้เพื่อนสมัยเด็กไม่แพ้รักแรกหรอก", "เลิฟคอเมดี้เรื่องนี้ เพื่อนสมัยเด็กไม่มีวันแพ้"],
  "r": 1343
 },
 {
  "id": 137909,
  "name": "Ningen Fushin no Boukensha-tachi ga Sekai wo Sukuu you desu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx137909-7c0zEcg9GjYo.png",
  "year": 2023,
  "al": ["Ningen Fushin: Adventurers Who Don’t Believe in Humanity Will Save the World", "人間不信の冒険者たちが世界を救うようです", "Apparently, Disillusioned Adventurers Will Save the World", "Tampaknya para Petualang Misantropis Akan Menyelamatkan Dunia"],
  "r": 1344
 },
 {
  "id": 154966,
  "name": "Fate/strange Fake: Whispers of Dawn",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154966-eQRCmSrCh96j.png",
  "year": 2023,
  "al": ["Fate/strange Fake -Whispers of Dawn-", "Fate/strange Fake -Whispers of Dawn-", "Судьба/Странная подделка. Шёпот рассвета"],
  "r": 1345
 },
 {
  "id": 164244,
  "name": "Oroka na Tenshi wa Akuma to Odoru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx164244-cOP5eMVqVIew.jpg",
  "year": 2024,
  "al": ["The Foolish Angel Dances with the Devil", "愚かな天使は悪魔と踊る", "Stupid angel dances with the devil", "Die mit dem Teufel tanzt", "愚蠢天使與惡魔共舞", "Глупый ангел пляшет с демоном", "かな天", "KanaTen"],
  "r": 1346
 },
 {
  "id": 130590,
  "name": "Maou Gakuin no Futekigousha: Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e Kayou II Part 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx130590-698sT7jWoz42.jpg",
  "year": 2024,
  "al": ["The Misfit of Demon King Academy II (Cour 2)", "魔王学院の不適合者 ～史上最強の魔王の始祖、転生して子孫たちの学校へ通う～ Ⅱ 2クール", "The Misfit of Demon King Academy: History’s Strongest Demon King Reincarnates and Goes to School with His Descendants Season 2 Part 2", "ใครว่าข้าไม่เหมาะเป็นจอมมาร: ต้นตระกูลจอมมารที่เเกร่งที่สุดในประวัติศาสตร์เกิดใหม่ไปเรียนที่โรงเรียนลูกหลาน ภาค 2 Part 2", "Непригодный для Академии владыки тьмы II"],
  "r": 1347
 },
 {
  "id": 6802,
  "name": "So Ra No Wo To",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6802-MmsfM8KAgZuR.jpg",
  "year": 2010,
  "al": ["Sound of the Sky", "ソ・ラ・ノ・ヲ・ト", "Sora no Oto", "Soranowoto", "Sora no Woto"],
  "r": 1348
 },
 {
  "id": 3470,
  "name": "Special A",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx3470-L3BUDBujYi7G.jpg",
  "year": 2008,
  "al": ["S.A: Special A", "スペシャル・エー", "S.A.", "Special A Class"],
  "r": 1349
 },
 {
  "id": 20646,
  "name": "Inou-Battle wa Nichijou-kei no Naka de",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20646-LgR1T1MSR493.jpg",
  "year": 2014,
  "al": ["When Supernatural Battles Became Commonplace", "異能バトルは日常系のなかで", "InoBato", "Inou-Battle in the Usually Daze.", "Inou Battle Within Everyday Life", "พลังป่วนก๊วนเหนือธรรมชาติ"],
  "r": 1350
 },
 {
  "id": 104217,
  "name": "Wotaku ni Koi wa Muzukashii OVA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104217-PoZOCoWD5ei8.jpg",
  "year": 2019,
  "al": ["ヲタクに恋は難しい OVA", "WotaKoi", "Wotaku ni Koi wa Muzukashii: Youth", "Wotakoi: Love is Hard for Otaku OVA", "WotaKoi: Sore wa, ikinari otozureta=koi", "ヲタ恋: それは、いきなりおとづれた＝恋", "ヲタクに恋は難しい OAD"],
  "r": 1351
 },
 {
  "id": 15379,
  "name": "Kotoura-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx15379-tSZbUJQzAvRi.png",
  "year": 2013,
  "al": ["The Troubled Life of Miss Kotoura", "琴浦さん"],
  "r": 1352
 },
 {
  "id": 145815,
  "name": "Noumin Kanren no Skill Bakka Agetetara Naze ka Tsuyoku Natta.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx145815-XsgcXy7WzgtK.png",
  "year": 2022,
  "al": ["I've Somehow Gotten Stronger When I Improved My Farm-Related Skills", "農民関連のスキルばっか上げてたら何故か強くなった。", "I Somehow Got Strong By Raising Skills Related To Farming", "点满农民相关技能后，不知为何就变强了。", "Fantasy Farm - Avevo coltivato solo le mie abilità legate all'agricoltura, ma sono diventato più forte"],
  "r": 1353
 },
 {
  "id": 11751,
  "name": "Senki Zesshou Symphogear",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11751-CNf1IlrvzbEa.png",
  "year": 2012,
  "al": ["Symphogear", "戦姫絶唱シンフォギア"],
  "r": 1354
 },
 {
  "id": 113970,
  "name": "Love Live! Nijigasaki Gakuen School Idol Doukoukai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113970-peyHsjypxse0.jpg",
  "year": 2020,
  "al": ["Love Live! Nijigasaki High School Idol Club", "ラブライブ！虹ヶ咲学園スクールアイドル同好会", "Love Live! Perfect Dream Project", "เลิฟไลฟ์ ชมรมสคูลไอดอลนิจิกะซากิ", "Лав Лайв! Клуб айдолов академии Нидзигасаки"],
  "r": 1355
 },
 {
  "id": 131019,
  "name": "Tsuki to Laika to Nosferatu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131019-xaTtBN2G6BrO.jpg",
  "year": 2021,
  "al": ["Irina: The Vampire Cosmonaut", "月とライカと吸血姫", "ノスフェラトゥ", "The Moon, Laika, and Nosferatu", "จันทรากับไลคร่าและเจ้าหญิงแวมไพร์", "จันทรากับไลก้าและนอสเฟราตู", "Луна, Лайка и Носферату"],
  "r": 1356
 },
 {
  "id": 7088,
  "name": "Ichiban Ushiro no Daimaou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx7088-Y38q7jaBwlTZ.png",
  "year": 2010,
  "al": ["Demon King Daimao", "いちばんうしろの大魔王", "Ichiban Ushiro no Dai Mao", "Rei Demônio Daimao", "El Gran Rey Demonio"],
  "r": 1357
 },
 {
  "id": 105749,
  "name": "Diamond no Ace act II",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105749-bbqFNGq0r6mS.jpg",
  "year": 2019,
  "al": ["Ace of the Diamond act II", "ダイヤのA actⅡ"],
  "r": 1358
 },
 {
  "id": 106863,
  "name": "Nekopara",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx106863-CxiCK7HejySK.png",
  "year": 2020,
  "al": ["ネコぱら"],
  "r": 1359
 },
 {
  "id": 15225,
  "name": "Hentai Ouji to Warawanai Neko.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx15225-wQg1w96ABj0p.jpg",
  "year": 2013,
  "al": ["Hentai Prince & the Stony Cat", "変態王子と笑わない猫。", "HENNEKO", "El príncipe pervertido y el gato de piedra", "O príncipe pervertido e o gato inexpressivo", "The \"Hentai\" Prince and the Stony Cat."],
  "r": 1360
 },
 {
  "id": 140754,
  "name": "Isekai Shoukan wa Nidome desu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx140754-JHwGp7NrAj9m.png",
  "year": 2023,
  "al": ["Summoned to Another World for a Second Time", "異世界召喚は二度目です", "Summoned to Another World... Again?!", "Invocado Para Outro Mundo... De Novo?!", "Je me fais isekai pour la deuxième fois... Ça commence à faire beaucoup.", "IseNido"],
  "r": 1361
 },
 {
  "id": 170892,
  "name": "Jibaku Shounen Hanako-kun 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx170892-zhJUSsX6PaF0.jpg",
  "year": 2025,
  "al": ["Toilet-bound Hanako-kun Season 2", "地縛少年花子くん２", "ฮานาโกะคุง วิญญาณติดที่ ซีซั่น 2"],
  "r": 1362
 },
 {
  "id": 8142,
  "name": "Colorful",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx8142-C8NvVbzJz7hN.jpg",
  "year": 2010,
  "al": ["Colorful ~ The Motion Picture", "カラフル"],
  "r": 1363
 },
 {
  "id": 109403,
  "name": "Non Non Biyori: Nonstop",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx109403-g6QqMkqV1ayu.jpg",
  "year": 2021,
  "al": ["Non Non Biyori Nonstop", "のんのんびより のんすとっぷ", "สาวใสหัวใจบ้านทุ่ง ภาค 3"],
  "r": 1364
 },
 {
  "id": 139093,
  "name": "Shadows House 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139093-LwQoTAGhhs5v.jpg",
  "year": 2022,
  "al": ["シャドーハウス 2nd Season", "影宅 第二季", "SHADOWS HOUSE-影宅- 第二季"],
  "r": 1365
 },
 {
  "id": 194317,
  "name": "Saikyou no Ousama, Nidome no Jinsei wa Nani wo Suru? 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx194317-M7t2ymBDHqyW.jpg",
  "year": 2026,
  "al": ["The Beginning After the End Season 2", "最強の王様、二度目の人生は 何をする? 第2期", "TBATE S2", "Начало после конца 2"],
  "r": 1366
 },
 {
  "id": 21085,
  "name": "Diamond no Ace: Second Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21085-qqkUxpMgtFDW.jpg",
  "year": 2015,
  "al": ["Ace of the Diamond Second Season", "ダイヤのA～Second Season～", "Daiya no Ace 2"],
  "r": 1367
 },
 {
  "id": 146646,
  "name": "Hanma Baki Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx146646-RMrHipfzvfTM.jpg",
  "year": 2023,
  "al": ["Baki Hanma Season 2", "範馬刃牙 シーズン２", "Baki Hanma: Son of Ogre 2", "Son of Ogre Baki Hanma Season 2"],
  "r": 1368
 },
 {
  "id": 666,
  "name": "JoJo no Kimyou na Bouken",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx666-kYzXvKlUbeMP.jpg",
  "year": 1993,
  "al": ["JoJo's Bizarre Adventure", "ジョジョの奇妙な冒険", "JoJo's Bizarre Adventure OVA 1"],
  "r": 1369
 },
 {
  "id": 14837,
  "name": "Dragon Ball Z: Kami to Kami",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/14837.jpg",
  "year": 2013,
  "al": ["Dragon Ball Z: Battle of Gods", "ドラゴンボールZ: 神と神", "Dragon Ball Z 2013", "DBZ (2013)", "Saikyou Shidou", "Dragon Ball Z Movie 14: God & God", "Bola de Drac Z: La Batalla dels Déus", "Dragon Ball Z - Kampf der Götter"],
  "r": 1370
 },
 {
  "id": 20047,
  "name": "Sakura Trick",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20047-QcFqHoZNuCIH.png",
  "year": 2014,
  "al": ["桜Trick"],
  "r": 1371
 },
 {
  "id": 20935,
  "name": "Arslan Senki (TV)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20935-jCAXBOuei2T8.jpg",
  "year": 2015,
  "al": ["The Heroic Legend of Arslan", "アルスラーン戦記 (TV)", "La Heroica Leyenda de Arslan"],
  "r": 1372
 },
 {
  "id": 21626,
  "name": "Handa-kun",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21626-5jbbIK9DsmY8.jpg",
  "year": 2016,
  "al": ["はんだくん", "ฮันดะคุง"],
  "r": 1373
 },
 {
  "id": 21624,
  "name": "Steins;Gate: Kyoukaimenjou no Missing Link - Divide By Zero",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21624-szbmwyC3sJos.jpg",
  "year": 2015,
  "al": ["Steins;Gate 0: 23β -Divide by Zero-", "シュタインズ・ゲート 境界面上のミッシングリンク -Divide By Zero-", "Steins;Gate: Episode 23 (β)"],
  "r": 1374
 },
 {
  "id": 20767,
  "name": "Date A Live II: Kurumi Star Festival",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20767-kvu80j0CZx7C.png",
  "year": 2014,
  "al": ["デート・ア・ライブ II 狂三スターフェスティバル", "Date A Live II Episode 11", "Date A Live II OVA", "Date A Live: Encore"],
  "r": 1375
 },
 {
  "id": 21186,
  "name": "Kamisama Hajimemashita: Kako-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/21186-v6A5xZwvomDK.jpg",
  "year": 2015,
  "al": ["Kamisama Kiss◎ OVA", "神様はじめました ～過去編～"],
  "r": 1376
 },
 {
  "id": 159309,
  "name": "Otomege Sekai wa Mob ni Kibishii Sekai desu 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx159309-wRfh9O1odrDJ.jpg",
  "year": 2026,
  "al": ["Trapped in a Dating Sim: The World of Otome Games is Tough for Mobs Season 2", "乙女ゲー世界はモブに厳しい世界です2", "mobseka 2", "ชีวิตตัวประกอบอย่างตูช่างอยู่ยาก เมื่ออยู่ในโลกเกมจีบหนุ่ม ภาค 2", "Otome Game Sekai wa Mob ni Kibishii Sekai desu 2", "Otomege 2", "モブせか 2"],
  "r": 1377
 },
 {
  "id": 15037,
  "name": "Corpse Party: Tortured Souls - Bougyakusareta Tamashii no Jukyou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx15037-32PupkILJcuv.jpg",
  "year": 2013,
  "al": ["Corpse Party", "コープスパーティー Tortured Souls -暴虐された魂の呪叫-", "Corpse Party: Tortured Souls – The Curse of Tortured Souls"],
  "r": 1378
 },
 {
  "id": 131863,
  "name": "Liar Liar",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx131863-G7bfAMPea08v.png",
  "year": 2023,
  "al": ["Liar, Liar", "ライアー・ライアー", "Ложь на лжи"],
  "r": 1379
 },
 {
  "id": 177552,
  "name": "Kuroiwa Medaka ni Watashi no Kawaii ga Tsuujinai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx177552-7XiOf3dGXmNs.jpg",
  "year": 2025,
  "al": ["Medaka Kuroiwa is Impervious to My Charms", "黒岩メダカに私の可愛いが通じない", "メダかわ", "Medakawa", "Мэдака Куроива не понимает моей привлекательности"],
  "r": 1380
 },
 {
  "id": 12859,
  "name": "ONE PIECE FILM: Z",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12859-uQFENDPzMWz6.jpg",
  "year": 2012,
  "al": ["ONE PIECE FILM Z", "One Piece Film 12: Z", "海贼王剧场版Z", "One Piece Gold - Il film"],
  "r": 1381
 },
 {
  "id": 16524,
  "name": "Suisei no Gargantia",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16524-xox2OUR3L1at.png",
  "year": 2013,
  "al": ["Gargantia on the Verdurous Planet", "翠星のガルガンティア", "Suisei no Galgantia"],
  "r": 1382
 },
 {
  "id": 18195,
  "name": "Little Busters!: Refrain",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx18195-r62KJesiZQWb.png",
  "year": 2013,
  "al": ["Little Busters! Refrain", "リトルバスターズ! ~Refrain~"],
  "r": 1383
 },
 {
  "id": 167419,
  "name": "Naze Boku no Sekai wo Daremo Oboeteinai no ka?",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx167419-yesWtncEBD9N.jpg",
  "year": 2024,
  "al": ["Why Does Nobody Remember Me in This World?", "なぜ僕の世界を誰も覚えていないのか？", "Why nobody remembers my world?", "Nazeboku"],
  "r": 1384
 },
 {
  "id": 550,
  "name": "Yu☆Gi☆Oh!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx550-aXb7NoghEGab.png",
  "year": 1998,
  "al": ["遊☆戯☆王", "King of Games", "Yu-Gi-Oh! First Series", "Yu-Gi-Oh! Serie Zero", "Yugi-Oh", "Yu-Gi-Oh!"],
  "r": 1385
 },
 {
  "id": 113290,
  "name": "Wu Liuqi: Zui Qiang Faxingshi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113290-zsH3Ni7M7STm.jpg",
  "year": 2019,
  "al": ["Scissor Seven Season 2", "伍六七之最强发型师", "Killer Seven Season 2", "Киллер с ножницами 2"],
  "r": 1386
 },
 {
  "id": 967,
  "name": "Hokuto no Ken",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/n967-84jNBaInec98.png",
  "year": 1984,
  "al": ["Fist of the North Star", "北斗の拳", "Ken il Guerriero", "Seikimatsu Kyuseishu Densetsu: Hokuto no Ken", "Ken - Rättvisans Kämpe", "Ken: The Great Bearfist"],
  "r": 1387
 },
 {
  "id": 128223,
  "name": "Soredemo Ayumu wa Yosetekuru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx128223-TOQovu2MXr8k.jpg",
  "year": 2022,
  "al": ["When Will Ayumu Make His Move?", "それでも歩は寄せてくる", "Shogi Senpai", "Even so, Ayumu draws closer to the endgame", "ขอรุกเข้าไปใกล้ๆ ใจเธอ", "À quoi tu joues, Ayumu ?!"],
  "r": 1388
 },
 {
  "id": 187,
  "name": "Initial D THIRD STAGE",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx187-QyCAlBGY3EWw.jpg",
  "year": 2001,
  "al": ["Initial D 3rd Stage", "頭文字[イニシャル]D THIRD STAGE", "Initial D: La película"],
  "r": 1389
 },
 {
  "id": 154214,
  "name": "Konyaku Haki sareta Reijou wo Hirotta Ore ga, Ikenai Koto wo Oshiekomu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154214-Uf9x7mY4IJJr.jpg",
  "year": 2023,
  "al": ["I'm Giving the Disgraced Noble Lady I Rescued a Crash Course in Naughtiness", "婚約破棄された令嬢を拾った俺が、イケナイことを教え込む", "Ikenaikyo", "Vou Ensinar a Jovem Nobre Desonrada a Fazer Coisas Impróprias"],
  "r": 1390
 },
 {
  "id": 180812,
  "name": "A-Rank Party wo Ridatsu Shita Ore wa, Moto Oshiegotachi to Meikyuu Shinbu wo Mezasu.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx180812-162w2RBaqJzE.jpg",
  "year": 2025,
  "al": ["I Left My A-Rank Party to Help My Former Students Reach the Dungeon Depths!", "Aランクパーティを離脱した俺は、元教え子たちと迷宮深部を目指す。", "After Leaving the A-Rank Party, I Aim for the Deep Part of the Labyrinth With My Former Students", "Aparida", "Покинув группу А-ранга, я направился вместе со своими бывшими учениками в глубины лабиринта", "Aku Meninggalkan Regu Peringkat-A untuk Membantu Mantan Muridku", "Sau khi rời khỏi Tổ đội hạng A, Tôi thám hiểm Mê cung cùng Đệ tử cũ"],
  "r": 1391
 },
 {
  "id": 179302,
  "name": "SANDA",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx179302-gWWAh5BfQyl4.jpg",
  "year": 2025,
  "al": ["サンダ"],
  "r": 1392
 },
 {
  "id": 72,
  "name": "Full Metal Panic? Fumoffu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx72-dalTPVFKaOuZ.png",
  "year": 2003,
  "al": ["フルメタル・パニック? ふもっふ", "Full Metal Panic Fumoffu"],
  "r": 1393
 },
 {
  "id": 1840,
  "name": "Zero no Tsukaima: Futatsuki no Kishi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1840-AYZXdXUCpqpR.jpg",
  "year": 2007,
  "al": ["The Familiar of Zero: Knight of the Twin Moons", "ゼロの使い魔 ～双月の騎士～", "Zero's Familiar 2nd Series", "Zero no Tsukaima S2", "The Familiar of Zero: The Rider of the Twin Moons"],
  "r": 1394
 },
 {
  "id": 161802,
  "name": "Tensei Shitara Slime Datta Ken: Coleus no Yume",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx161802-Ra8acfv0cSov.jpg",
  "year": 2023,
  "al": ["That Time I Got Reincarnated as a Slime: Visions of Coleus", "転生したらスライムだった件 コリウスの夢", "That Time I Got Reincarnated as a Slime: Coleus' Dream", "Moi quand je me réincarne en Slime : Le rêve de Coleus", "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว ฝันแห่งโคลีอัส"],
  "r": 1395
 },
 {
  "id": 185116,
  "name": "Gnosia",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx185116-DIFRjiMgz1IS.jpg",
  "year": 2025,
  "al": ["グノーシア"],
  "r": 1396
 },
 {
  "id": 87,
  "name": "Kidou Senshi Gundam: Gyakushuu no Char",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx87-SCCIlaJZjSvz.png",
  "year": 1988,
  "al": ["Mobile Suit Gundam: Char's Counterattack", "機動戦士ガンダム 逆襲のシャア", "Mobile Suit Gundam: Odwet Chara"],
  "r": 1397
 },
 {
  "id": 10937,
  "name": "Kidou Senshi Gundam: THE ORIGIN",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10937-yNrI4MUsigat.png",
  "year": 2015,
  "al": ["Mobile Suit Gundam: The Origin", "機動戦士ガンダムTHE ORIGIN", "Aoi Hitomi no Casval", "Kanashimi no Artesia", "Akatsuki no Houki"],
  "r": 1398
 },
 {
  "id": 20503,
  "name": "Witch Craft Works",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20503-liSpvCiFljGr.jpg",
  "year": 2014,
  "al": ["ウィッチクラフトワークス", "Witchcraft Works"],
  "r": 1399
 },
 {
  "id": 20800,
  "name": "Yuuki Yuuna wa Yuusha de Aru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20800-7IAW762FbSFU.png",
  "year": 2014,
  "al": ["Yuki Yuna is a Hero", "結城友奈は勇者である", "YuYuYu", "สาวน้อยชมรมผู้กล้า"],
  "r": 1400
 },
 {
  "id": 21517,
  "name": "Renai Boukun",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21517-huYdImj17Sr3.jpg",
  "year": 2017,
  "al": ["Love Tyrant", "恋愛暴君", "The very lovely tyrant of love♥"],
  "r": 1401
 },
 {
  "id": 20880,
  "name": "Durarara!!x2 Ketsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20880-WsvmgSdL8lhP.png",
  "year": 2016,
  "al": ["Durarara!! X2 The Third Arc", "デュラララ!!×２ 結", "DRRR!! 2 Ketsu", "דורארארה!!2x סיום"],
  "r": 1402
 },
 {
  "id": 17909,
  "name": "Uchouten Kazoku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx17909-BXyd04Lj8F6M.jpg",
  "year": 2013,
  "al": ["The Eccentric Family", "有頂天家族", "Uchoten Kazoku"],
  "r": 1403
 },
 {
  "id": 98448,
  "name": "Kino no Tabi -the Beautiful World- the Animated Series",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx98448-OdfxrjAhkYvp.jpg",
  "year": 2017,
  "al": ["Kino's Journey -the Beautiful World- the Animated Series", "キノの旅 -the Beautiful World- the Animated Series"],
  "r": 1404
 },
 {
  "id": 192808,
  "name": "Jishou Akuyaku Reijou na Konyakusha no Kansatsu Kiroku.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx192808-tfrX4Gn2Y1Ye.jpg",
  "year": 2026,
  "al": ["An Observation Log of My Fiancée Who Calls Herself a Villainess", "自称悪役令嬢な婚約者の観察記録。", "Observation Records of My Fiancée: The Misadventures of a Self-Proclaimed Villainess", "บันทึกสังเกตการณ์คู่หมั้นผู้ประกาศตัวเป็นนางร้าย"],
  "r": 1405
 },
 {
  "id": 101227,
  "name": "Watashi, Nouryoku wa Heikinchi de tte Itta yo ne!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101227-PUPavhaClwfa.jpg",
  "year": 2019,
  "al": ["Didn't I Say to Make My Abilities Average in the Next Life?!", "私、能力は平均値でって言ったよね！", "Noukin", "ก็บอกว่าขอแค่ค่าเฉลี่ยไงล่ะคะ!"],
  "r": 1406
 },
 {
  "id": 135102,
  "name": "Kamitachi ni Hirowareta Otoko 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx135102-3vX6Rs8e8oHU.jpg",
  "year": 2023,
  "al": ["By the Grace of the Gods 2", "神達に拾われた男２", "Kami-tachi ni Hirowareta Otoko 2", "เพราะพระเจ้าเลือกเลยได้เกิดใหม่มาเลี้ยงสไลม์ในต่างโลก ภาค 2", "Oleh Rahmat Para Dewa 2"],
  "r": 1407
 },
 {
  "id": 105074,
  "name": "Tejina Senpai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105074-flcJxKWZ5IZz.jpg",
  "year": 2019,
  "al": ["Magical Sempai", "手品先輩", "Magical Senpai"],
  "r": 1408
 },
 {
  "id": 122808,
  "name": "Princess Connect! Re:Dive Season 2",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx122808-mOspflVwrnGJ.png",
  "year": 2022,
  "al": ["プリンセスコネクト！Re:Dive Season 2", "Priconne Season 2", "ปรินเซส คอนเนค รี: ไดฟ์ ภาค 2"],
  "r": 1409
 },
 {
  "id": 114087,
  "name": "World Trigger 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx114087-5sSD98EFqQZ5.jpg",
  "year": 2021,
  "al": ["ワールドトリガー 2ndシーズン", "Импульс мира 2"],
  "r": 1410
 },
 {
  "id": 145140,
  "name": "Helck",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx145140-tHT8TT2XSsOh.jpg",
  "year": 2023,
  "al": ["ヘルク", "ยอดผู้กล้า Helck"],
  "r": 1411
 },
 {
  "id": 182,
  "name": "Tenkuu no Escaflowne",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx182-YzZtZWMZCSFf.png",
  "year": 1996,
  "al": ["Vision of Escaflowne", "天空のエスカフローネ", "The Vision of Escaflowne", "La Visión de Escaflowne", "Vision d'Escaflowne", "I cieli di Escaflowne"],
  "r": 1412
 },
 {
  "id": 138425,
  "name": "Karakai Jouzu no Takagi-san Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx138425-c3yXTMt39DeT.png",
  "year": 2022,
  "al": ["Teasing Master Takagi-san: The Movie", "劇場版 からかい上手の高木さん", "แกล้งนัก รักนะ รู้ยัง? มูฟวี่", "Quand Takagi me Taquine, le Film", "La Maestra de las Bromas Takagi-san: La Película"],
  "r": 1413
 },
 {
  "id": 21110,
  "name": "Shinmai Maou no Testament: BURST",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21110-TxTB92HIRfMv.jpg",
  "year": 2015,
  "al": ["The Testament of Sister New Devil BURST", "新妹魔王の契約者 BURST", "Shinmai Maou no Keiyakusha BURST"],
  "r": 1414
 },
 {
  "id": 139606,
  "name": "Eiyuu Kyoushitsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx139606-LrYkytn7fVwt.jpg",
  "year": 2023,
  "al": ["Classroom for Heroes", "英雄教室", "Класс героев", "Sala de Aula dos Heróis"],
  "r": 1415
 },
 {
  "id": 143327,
  "name": "MF Ghost",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx143327-6gv1QzquNg2o.png",
  "year": 2023,
  "al": ["MFゴースト", "燃油車鬥魂"],
  "r": 1416
 },
 {
  "id": 369,
  "name": "Boogiepop wa Warawanai: Boogiepop Phantom",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx369-dwzXLDvzzAmK.png",
  "year": 2000,
  "al": ["Boogiepop Phantom", "ブギーポップは笑わない Boogiepop Phantom", "Boogiepop Doesn't Laugh", "Boogiepop Never Laughs"],
  "r": 1417
 },
 {
  "id": 21778,
  "name": "Kishibe Rohan wa Ugokanai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21778-pCUJjJuP7Pmd.png",
  "year": 2017,
  "al": ["Thus Spoke Rohan Kishibe", "岸辺露伴は動かない", "Thus Spoke Kishibe Rohan", "Assim Falava Kishibe Rohan", "Así habló Kishibe Rohan", "على لسان كيشيبي روهان", "Αυτά Είπε ο Ρόχαν Κίσιμπε"],
  "r": 1418
 },
 {
  "id": 165855,
  "name": "Hananoi-kun to Koi no Yamai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx165855-uJ0Hq5EFUlz8.jpg",
  "year": 2024,
  "al": ["A Condition Called Love", "花野井くんと恋の病", "I'm addicted to you", "A tes côtés", "Ein Gefühl namens Liebe", "Adicto a ti", "รักติดหนึบของฮานาโนอิคุง", "Una enfermedad llamada amor"],
  "r": 1419
 },
 {
  "id": 143271,
  "name": "Mahouka Koukou no Rettousei 3rd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx143271-o5wry0ohH9R3.jpg",
  "year": 2024,
  "al": ["The Irregular at Magic High School Season 3", "魔法科高校の劣等生 第3シーズン", "พี่น้องปริศนาโรงเรียนมหาเวท ภาค 3", "Непутёвый ученик в школе магии 3"],
  "r": 1420
 },
 {
  "id": 198113,
  "name": "Kill Ao",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx198113-NRa47idWSlnx.jpg",
  "year": 2026,
  "al": ["KILL BLUE", "キルアオ", "คิลบลู", "Убивая юность"],
  "r": 1421
 },
 {
  "id": 113286,
  "name": "Monster Musume no Oisha-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113286-AUS3PAJ5n6BU.png",
  "year": 2020,
  "al": ["Monster Girl Doctor", "モンスター娘のお医者さん", "MonIsha", "モン医者", "รักษาหนูหน่อยคุณหมอมอนสเตอร์"],
  "r": 1422
 },
 {
  "id": 189987,
  "name": "Ponkotsu Fuuki Iin to Skirt take ga Futekisetsu na JK no Hanashi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx189987-CkTDPfD7vu2Y.jpg",
  "year": 2026,
  "al": ["The Klutzy Class Monitor and the Girl with the Short Skirt", "ポンコツ風紀委員とスカート丈が不適切なJKの話", "The Story Between a Dumb Prefect and a High School Girl with an Inappropriate Skirt Length", "PonSuka", "ポンスカ", "Бесполезный дежурный и школьница со слишком короткой юбкой"],
  "r": 1423
 },
 {
  "id": 6336,
  "name": "Kidou Senshi Gundam UC",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6336-jdAs058XtObM.jpg",
  "year": 2010,
  "al": ["Mobile Suit Gundam UC", "機動戦士ガンダムUC", "Kidou Senshi Gundam Unicorn", "Mobile Suit Gundam Unicorn"],
  "r": 1424
 },
 {
  "id": 6211,
  "name": "Tokyo Magnitude 8.0",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx6211-2MCqBUXvmBdB.png",
  "year": 2009,
  "al": ["東京マグニチュード8.0", "东京地震8.0", "Токийское восьмибалльное", "Terratrèmol a Tòquio 8.0"],
  "r": 1425
 },
 {
  "id": 98349,
  "name": "Love Live! Sunshine!! 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx98349-kj4hp8iNSzLr.jpg",
  "year": 2017,
  "al": ["Love Live! Sunshine!! Season 2", "ラブライブ！サンシャイン!! 2nd Season"],
  "r": 1426
 },
 {
  "id": 164117,
  "name": "Idol",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx164117-PW0VR0S1nsba.png",
  "year": 2023,
  "al": ["アイドル"],
  "r": 1427
 },
 {
  "id": 99714,
  "name": "Gintama.: Porori-hen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx99714-0pCKHe4XYIz7.jpg",
  "year": 2017,
  "al": ["Gintama.: Slip Arc", "銀魂. ポロリ編", "Gintama. (2017)"],
  "r": 1428
 },
 {
  "id": 126356,
  "name": "Tian Guan Ci Fu Special",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx126356-Nt66D91sH3Cu.png",
  "year": 2021,
  "al": ["Heaven Official's Blessing Special Episode", "天官赐福 特别篇"],
  "r": 1429
 },
 {
  "id": 156131,
  "name": "Shin no Nakama ja Nai to Yuusha no Party wo Oidasareta node, Henkyou de Slow Life suru Koto ni shimashita 2nd",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx156131-aZPpDX61BIeo.jpg",
  "year": 2024,
  "al": ["Banished from the Hero’s Party, I Decided to Live a Quiet Life in the Countryside Season 2", "真の仲間じゃないと勇者のパーティーを追い出されたので、辺境でスローライフすることにしました 2nd", "Banished from the brave man's group, I decided to lead a slow life in the back country. 2nd", "I Was Kicked out of the Hero’s Party Because I Wasn’t a True Companion so I Decided to Have a Slow Life at the Frontier Season 2", "ผมโดนกลุ่มผู้กล้าขับไส เลยต้องไปสโลว์ไลฟ์ที่ชายแดน ภาค 2", "Изгнанный из отряда героя, я решил поселиться в глубинке 2"],
  "r": 1430
 },
 {
  "id": 21281,
  "name": "Shingeki! Kyojin Chuugakkou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b21281-GwCKcZii6fVf.jpg",
  "year": 2015,
  "al": ["Attack on Titan: Junior High", "進撃！巨人中学校", "Ataque a los Titanes: Junior High", "ผ่ามัธยมไททัน", "ผ่า! มัธยมไททัน"],
  "r": 1431
 },
 {
  "id": 183274,
  "name": "Ore wa Seikan Kokka no Akutoku Ryoushu!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx183274-zqrwevS4PBJF.jpg",
  "year": 2025,
  "al": ["I'm the Evil Lord of an Intergalactic Empire!", "俺は星間国家の悪徳領主!", "OreAku", "我是星際國家的惡德領主！", "Aku Bangsawan Korup di Kekaisaran Antargalaksi!"],
  "r": 1432
 },
 {
  "id": 101024,
  "name": "Radiant",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx101024-4dFUVMKSE0Q1.jpg",
  "year": 2018,
  "al": ["ラディアン"],
  "r": 1433
 },
 {
  "id": 156111,
  "name": "Aishang Ta De Liyou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx156111-ZABTgci6m9sN.png",
  "year": 2023,
  "al": ["The Girl Downstairs", "爱上她的理由", "이두나!", "Lee Du-Na!", "Alasan Mencintainya", "下の階には澪がいる", "Cô Gái Tầng Dưới", "กั๊กหัวใจไว้รักยัยคนนี้"],
  "r": 1434
 },
 {
  "id": 1293,
  "name": "Urusei Yatsura",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1293-xohJFutZXimo.jpg",
  "year": 1981,
  "al": ["うる星やつら", "Those Obnoxious Aliens", "Lum the Invader Girl", "The Return of Lum", "Lamu", "Lamù", "Turma do Barulho"],
  "r": 1435
 },
 {
  "id": 105081,
  "name": "Joshikousei no Mudazukai",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx105081-pc4jgCmAP0dZ.jpg",
  "year": 2019,
  "al": ["Wasteful Days of High School Girls", "女子高生の無駄づかい"],
  "r": 1436
 },
 {
  "id": 208044,
  "name": "Rakudai Kenja no Gakuin Musou: Nidome no Tensei, S-Rank Cheat Majutsushi Bouken-roku",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx208044-Pm2UhvApQFUh.jpg",
  "year": 2026,
  "al": ["From Overshadowed to Overpowered: Second Reincarnation of a Talentless Sage", "落第賢者の学院無双～二度目の転生、Sランクチート魔術師冒険録～", "The Unsuccessful Yet Academically Unparalleled Sage: A Cheating S-Rank Sorcerer's Post-Rebirth Adventurer Log", "The Failed Sage's Academy Domination"],
  "r": 1437
 },
 {
  "id": 19221,
  "name": "Ore no Nounai Sentakushi ga, Gakuen Love Comedy wo Zenryoku de Jama Shiteiru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx19221-gYYDXIVzas7u.jpg",
  "year": 2013,
  "al": ["My Mental Choices Are Completely Interfering With My School Romantic Comedy", "俺の脳内選択肢が、学園ラブコメを全力で邪魔している", "NouKome", "NouCome", "Ore no Nounai Sentakushi ga", "Gakuen Lovecome o Zenryoku de Jama Shite Iru"],
  "r": 1438
 },
 {
  "id": 21362,
  "name": "Hundred",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21362-7YZq4TZ112Il.png",
  "year": 2016,
  "al": ["ハンドレッド", "ฮันเดรด"],
  "r": 1439
 },
 {
  "id": 10218,
  "name": "Berserk: Ougon Jidai-hen I - Haou no Tamago",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx10218-QJgUwiua9tB0.jpg",
  "year": 2012,
  "al": ["Berserk: The Golden Age Arc I - The Egg of the King", "ベルセルク 黄金時代篇Ⅰ 覇王の卵", "Berserk Movie", "Berserk Saga", "Berserk: Golden Age Arc I - Egg of the Supreme Ruler", "The Golden Age Arc I: The High King's Egg", "Berserk: La Edad de Oro I - El Huevo del Rey Conquistador"],
  "r": 1440
 },
 {
  "id": 21248,
  "name": "PERSONA 3 THE MOVIE: #4 Winter of Rebirth",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b21248-nze05fa3smqI.png",
  "year": 2016,
  "al": ["PERSONA3 THE MOVIE — #4 Winter of Rebirth —", "Shin Megami Tensei: Persona 3", "P3M", "ペルソナ3"],
  "r": 1441
 },
 {
  "id": 153360,
  "name": "Jidou Hanbaiki ni Umarekawatta Ore wa Meikyuu wo Samayou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx153360-VM22UwGEz8Ir.jpg",
  "year": 2023,
  "al": ["Reborn as a Vending Machine, I Now Wander the Dungeon", "自動販売機に生まれ変わった俺は迷宮を彷徨う", "Переродившись в торговый автомат, я блуждаю по подземелью", "Jidōhanbaiki ni Umarekawatta Ore wa Meikyū ni Samayō", "Reencarnado numa Máquina de Vendas, Agora Exploro a Masmorra", "Jihanki", "自販機"],
  "r": 1442
 },
 {
  "id": 190704,
  "name": "Kanan-sama wa Akumade Choroi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx190704-Ts1VvkrNdnCZ.jpg",
  "year": 2026,
  "al": ["Mistress Kanan is Devilishly Easy", "カナン様はあくまでチョロい", "Kanan-sama Is Easy as Hell!", "KanaChoro", "カナチョロ", "ท่านคานัน ปีศาจต๊อง บ๊องไม่มีใครเกิน", "Канан до чёртиков проста"],
  "r": 1443
 },
 {
  "id": 199111,
  "name": "Grand Blue Season 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx199111-gBSuBG61ElcW.jpg",
  "year": 2026,
  "al": ["Grand Blue Dreaming Season 3", "ぐらんぶる Season 3", "Grand Blue ก๊วนป่วนชวนบุ๋งบุ๋ง ซีซัน 3"],
  "r": 1444
 },
 {
  "id": 101117,
  "name": "Free!: Dive to the Future",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx101117-kajkIgT8fepr.jpg",
  "year": 2018,
  "al": ["Free! -Dive to the Future-", "Free!-Dive to the Future-", "Free! 3rd Season"],
  "r": 1445
 },
 {
  "id": 148109,
  "name": "Yuusha ga Shinda!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx148109-cwAINDGwAHB2.jpg",
  "year": 2023,
  "al": ["The Legendary Hero is Dead!", "勇者が死んだ！", "勇者死了！", "เมื่อผู้กล้าลาโลกแล้ว!", "Герой мёртв!"],
  "r": 1446
 },
 {
  "id": 204466,
  "name": "Otome Kaijuu Caraméliser",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx204466-vXMvIs4VOoQd.png",
  "year": 2026,
  "al": ["KAIJU GIRL CARAMELISE", "乙女怪獣キャラメリゼ", "สาวน้อยไคจู คาราเมไลซ์"],
  "r": 1447
 },
 {
  "id": 155730,
  "name": "Uchi no Kaisha no Chiisai Senpai no Hanashi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx155730-1dE2C3K8VFdW.png",
  "year": 2023,
  "al": ["My Tiny Senpai", "うちの会社の小さい先輩の話", "Story of a Small Senior in My Company", "My Company's Small Senpai", "My Tiny Senpai From Work", "A Veterana Pitica da Firma", "รุ่นพี่ตัวน้อยดูท่าจะตกหลุมรัก", "МОЯ НЕВЫСОКАЯ КОЛЛЕГА"],
  "r": 1448
 },
 {
  "id": 141852,
  "name": "Xian Wang De Richang Shenghuo 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx141852-tgLX8S7fqy3G.png",
  "year": 2022,
  "al": ["The Daily Life of the Immortal King Season 3", "仙王的日常生活 第三季"],
  "r": 1449
 },
 {
  "id": 21378,
  "name": "Masou Gakuen HxH",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21378-83u2Jo9aACxx.jpg",
  "year": 2016,
  "al": ["Hybrid x Heart Magias Academy Ataraxia", "魔装学園H×H"],
  "r": 1450
 },
 {
  "id": 172453,
  "name": "Akuyaku Reijou Tensei Oji-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx172453-7iYNTAEZpNsJ.png",
  "year": 2025,
  "al": ["From Bureaucrat to Villainess: Dad's Been Reincarnated!", "悪役令嬢転生おじさん", "The Middle-Aged Man that Reincarnated as a Villainess", "Om-om yang Bereinkarnasi Menjadi Putri Jahat", "中年大叔轉生反派千金"],
  "r": 1451
 },
 {
  "id": 20520,
  "name": "LOVE STAGE!!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx20520-x753cpAR4JvF.png",
  "year": 2014,
  "al": ["ラブステージ"],
  "r": 1452
 },
 {
  "id": 172439,
  "name": "Nihon e Youkoso Elf-san.",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx172439-sTda7baXB0Fh.jpg",
  "year": 2025,
  "al": ["Welcome to Japan, Ms. Elf!", "日本へようこそエルフさん。", "歡迎來到日本，妖精小姐。"],
  "r": 1453
 },
 {
  "id": 12293,
  "name": "Campione!: Matsurowanu Kamigami to Kamigoroshi no Maou",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12293-DKc0XJ0cacSZ.jpg",
  "year": 2012,
  "al": ["Campione!", "カンピオーネ！ ～まつろわぬ神々と神殺しの魔王～"],
  "r": 1454
 },
 {
  "id": 146323,
  "name": "Spy Kyoushitsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx146323-vyj1w1VRgDN7.png",
  "year": 2023,
  "al": ["Spy Classroom", "スパイ教室", "Spy Room", "ห้องเรียนจารชน"],
  "r": 1455
 },
 {
  "id": 162144,
  "name": "Gekai Elise",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx162144-T0y7XyTFhSYJ.jpg",
  "year": 2024,
  "al": ["Doctor Elise: The Royal Lady with the Lamp", "外科医エリーゼ", "Surgeon Elise", "Oegwauisa Elise", "외과의사 엘리제", "เอลิเซ่ แพทย์หญิงทะลุมิติ", "L'Impérieux Destin du Dr. Elise", "Доктор Элизе: леди со скальпелем"],
  "r": 1456
 },
 {
  "id": 384,
  "name": "GANTZ",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx384-5vHimZPju1Wr.jpg",
  "year": 2004,
  "al": ["ガンツ"],
  "r": 1457
 },
 {
  "id": 20627,
  "name": "Seiken Tsukai no World Break",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20627-qAzYOBmxk5iS.jpg",
  "year": 2015,
  "al": ["World Break: Aria of Curse for a Holy Swordsman", "聖剣使いの禁呪詠唱＜ワールドブレイク＞", "World Break เทพนักดาบข้ามภพ"],
  "r": 1458
 },
 {
  "id": 21676,
  "name": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka Gaiden: Sword Oratoria",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21676-98OeKU9NDhJI.jpg",
  "year": 2017,
  "al": ["Sword Oratoria: Is it Wrong to Try to Pick Up Girls in a Dungeon? On the Side", "ダンジョンに出会いを求めるのは間違っているだろうか外伝 ソード・オラトリア", "Is It Wrong to Hope to Meet a Girl in a Dungeon? On the Side: Sword Oratoria", "Danmachi Sword Oratoria", "¿Qué tiene de malo ligar en una mazmorra? Sword Oratoria"],
  "r": 1459
 },
 {
  "id": 160389,
  "name": "Kekkon Yubiwa Monogatari",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx160389-2f6SosbyUpxX.jpg",
  "year": 2024,
  "al": ["Tales of Wedding Rings", "結婚指輪物語", "ตำนานผู้กล้าแห่งแหวน", "婚戒物語"],
  "r": 1460
 },
 {
  "id": 196935,
  "name": "Akane-banashi",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx196935-RnLWBsEvNp8M.jpg",
  "year": 2026,
  "al": ["あかね噺", "อาคาเนะ พลิกตำนานวงการราคุโกะ", "Сказание об Аканэ", "Chuyện Kể Akane", "朱音落語"],
  "r": 1461
 },
 {
  "id": 11319,
  "name": "Zero no Tsukaima F",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11319-6PwRxZiVChQo.jpg",
  "year": 2012,
  "al": ["The Familiar of Zero F", "ゼロの使い魔F", "Zero no Tsukaima Final Series", "Zero's Familiar Final Series", "Zero no Tsukaima S4"],
  "r": 1462
 },
 {
  "id": 20766,
  "name": "Love Live! The School Idol Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20766-9A9Z6hawqdLe.png",
  "year": 2015,
  "al": ["ラブライブ！The School Idol Movie", "Gekijouban Love Live!", "Love Live! School Idol Project Movie"],
  "r": 1463
 },
 {
  "id": 104460,
  "name": "Yuru Camp△ Movie",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104460-EwUV9ZJMCtnR.jpg",
  "year": 2022,
  "al": ["Laid-Back Camp The Movie", "映画 ゆるキャン△", "Eiga Yuru Camp"],
  "r": 1464
 },
 {
  "id": 13655,
  "name": "Little Busters!",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx13655-ZdAJjba0HrY6.jpg",
  "year": 2012,
  "al": ["リトルバスターズ!", "LB!"],
  "r": 1465
 },
 {
  "id": 112023,
  "name": "Luo Xiaohei Zhan Ji (Movie)",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx112023-jAzTavYOx3zq.png",
  "year": 2019,
  "al": ["The Legend of Hei", "罗小黑战记大电影", "羅小黒戦記", "Ro Shaohei Senki", "Luo Xiao Hei Zhan Ji (Movie)", "A Lenda de Hei"],
  "r": 1466
 },
 {
  "id": 156632,
  "name": "Uma Musume: Pretty Derby Season 3",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx156632-QnKMOaso3n2y.jpg",
  "year": 2023,
  "al": ["Umamusume: Pretty Derby Season 3", "ウマ娘 プリティーダービー Season 3", "สาวม้าโมเอะ ภาค 3", "賽馬娘Pretty Derby 第3季"],
  "r": 1467
 },
 {
  "id": 178434,
  "name": "Tensei Kizoku, Kantei Skill de Nariagaru 2nd Season",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx178434-UtRCL4WqNcgv.png",
  "year": 2024,
  "al": ["As a Reincarnated Aristocrat, I'll Use My Appraisal Skill to Rise in the World Season 2", "転生貴族、鑑定スキルで成り上がる 第2期", "KanteiSkill 2"],
  "r": 1468
 },
 {
  "id": 267,
  "name": "Gungrave",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx267-vGNmfjvWb1Qq.png",
  "year": 2003,
  "al": ["ガングレイヴ"],
  "r": 1469
 },
 {
  "id": 20790,
  "name": "Magic Kaito 1412",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20790-ZOXZWSlvlN1W.jpg",
  "year": 2014,
  "al": ["まじっく快斗1412"],
  "r": 1470
 },
 {
  "id": 179878,
  "name": "Project Sekai: Kowareta SEKAI to Utaenai MIKU",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx179878-jG5GTXhe2vou.jpg",
  "year": 2025,
  "al": ["COLORFUL STAGE! The Movie: A Miku Who Can't Sing", "プロジェクトセカイ 壊れたセカイと歌えないミク", "Project Sekai Movie", "劇場版 プロセカ", "Gekijouban Proseka", "Colorful Stage La Película: Miku no puede cantar", "Colorful Stage! เดอะมูฟวี่: มิกุที่ไร้เสียงเพลง", "Colorful Stage! O Filme: Uma Miku Que Não Sabe Cantar"],
  "r": 1471
 },
 {
  "id": 20879,
  "name": "Durarara!!x2 Ten",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20879-IqgXMXuUMvRM.png",
  "year": 2015,
  "al": ["Durarara!! X2 The Second Arc", "デュラララ!!×２ 転", "DRRR!! 2 Ten", "דורארארה!!2x תפנית"],
  "r": 1472
 },
 {
  "id": 165070,
  "name": "Atarashii Joushi wa Dotennen",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx165070-0OlcD1TA6pe4.jpg",
  "year": 2023,
  "al": ["My New Boss is Goofy", "新しい上司はど天然", "Atarashii Joushi wa Do Tennen", "My New Boss is Too Scatterbrained"],
  "r": 1473
 },
 {
  "id": 1486,
  "name": "Kodomo no Omocha",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx1486-S1lSoaOlGBxQ.jpg",
  "year": 1996,
  "al": ["Kodocha", "こどものおもちゃ", "Child's Toy", "Rossana"],
  "r": 1474
 },
 {
  "id": 14967,
  "name": "Boku wa Tomodachi ga Sukunai NEXT",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx14967-ZGsclJ1xjPwr.jpg",
  "year": 2013,
  "al": ["Haganai NEXT", "僕は友達が少ない NEXT", "Boku wa Tomodachi ga Sukunai 2nd Season"],
  "r": 1475
 },
 {
  "id": 1177,
  "name": "Alien 9",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx1177-1rJWF4RpI0Vz.png",
  "year": 2001,
  "al": ["Alien Nine", "エイリアン9"],
  "r": 1476
 },
 {
  "id": 204356,
  "name": "Boku no Hero Academia No. 170+1: More",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx204356-RNYmxUVVz3Z2.png",
  "year": 2026,
  "al": ["My Hero Academia More", "僕のヒーローアカデミア No. 170+1 「More」", "My Hero Academia No. 170+1: “More”"],
  "r": 1477
 },
 {
  "id": 522,
  "name": "Metropolis",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx522-4Sp8QlrufkG5.jpg",
  "year": 2001,
  "al": ["メトロポリス", "Osamu Tezuka's Metropolis", "Robotic Angel"],
  "r": 1478
 },
 {
  "id": 21688,
  "name": "Mahoutsukai no Yome: Hoshi Matsu Hito",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21688-DOc6RxTYfXEr.jpg",
  "year": 2016,
  "al": ["The Ancient Magus' Bride: Those Awaiting a Star", "魔法使いの嫁 星待つひと", "Mahou Tsukai no Yome: Hoshi Matsu Hito", "The Ancient Magus Bride", "The Ancient Magus' Bride"],
  "r": 1479
 },
 {
  "id": 140499,
  "name": "BLUE GIANT",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx140499-Yr7YLk6suS0K.jpg",
  "year": 2023,
  "al": ["블루 자이언트", "蓝巨人", "ブルージャイアント", "Blue Giant Tokubetsu-hen", "BLUE GIANT 特別編", "ブルージャイント"],
  "r": 1480
 },
 {
  "id": 96,
  "name": "Kidou Butouden G Gundam",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx96-as1zJO34Qevb.png",
  "year": 1994,
  "al": ["Mobile Fighter G Gundam", "機動武闘伝Gガンダム"],
  "r": 1481
 },
 {
  "id": 20995,
  "name": "To LOVE-Ru Darkness 2nd",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx20995-IQsfCe4Zy2aj.jpg",
  "year": 2015,
  "al": ["To Love Ru Darkness 2", "To LOVEる -とらぶる- ダークネス2nd", "To LOVE-Ru Trouble Darkness 2nd"],
  "r": 1482
 },
 {
  "id": 15,
  "name": "Eyeshield 21",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx15-A4F2t0TgWoi4.png",
  "year": 2005,
  "al": ["アイシールド21", "Eyeshield21"],
  "r": 1483
 },
 {
  "id": 2164,
  "name": "Dennou Coil",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2164-4tUI4MJCZQO3.png",
  "year": 2007,
  "al": ["Den-noh Coil", "電脳コイル", "Cyber Coil", "Coil - A Circle of Children", "Denno Coil", "Кибервиток"],
  "r": 1484
 },
 {
  "id": 160181,
  "name": "Sasayaku You ni Koi wo Utau",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx160181-EGC0Scngy5In.jpg",
  "year": 2024,
  "al": ["Whisper Me a Love Song", "ささやくように恋を唄う", "Whispering You a Love Song", "SasaKoi", "ささこい", "Cicha piosenka o miłości", "Flüster mir ein Liebeslied", "กระซิบรักเป็นทำนองร้องบอกเธอ"],
  "r": 1485
 },
 {
  "id": 1852,
  "name": "Hidamari Sketch",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1852-N3qrLcuVdUTF.png",
  "year": 2007,
  "al": ["ひだまりスケッチ"],
  "r": 1486
 },
 {
  "id": 180292,
  "name": "Arafou Otoko no Isekai Tsuuhan Seikatsu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx180292-GG0nwYZ5HeN7.jpg",
  "year": 2025,
  "al": ["The Daily Life of a Middle-Aged Online Shopper in Another World", "アラフォー男の異世界通販生活", "Around 40 Otoko no Isekai Tsuuhan Seikatsu", "ทะลุมิติไปเป็นยอดนักขายออนไลน์ในต่างโลกของชายวัยสี่สิบ"],
  "r": 1487
 },
 {
  "id": 4063,
  "name": "Sekirei",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx4063-ZP7agutiaOCf.png",
  "year": 2008,
  "al": ["セキレイ", "Wagtail"],
  "r": 1488
 },
 {
  "id": 104159,
  "name": "Azur Lane",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx104159-xJoXzhEmtohE.jpg",
  "year": 2019,
  "al": ["アズールレーン"],
  "r": 1489
 },
 {
  "id": 148465,
  "name": "Level 1 dakedo Unique Skill de Saikyou desu",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx148465-JHRudD6EbUVU.jpg",
  "year": 2023,
  "al": ["My Unique Skill Makes Me OP even at Level 1", "レベル1だけどユニークスキルで最強です", "เลเวล 1 แล้วไง ผมมีสกิลแกร่งสุดล้ำไม่ซ้ำใคร", "Minha Habilidade Única Me Deixa Invencível no Nível 1", "Aku Level 1 Tapi Jadi Orang Terkuat Karena Skill Unik"],
  "r": 1490
 },
 {
  "id": 11785,
  "name": "Haiyore! Nyaruko-san",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx11785-cBfqpOetdIeF.jpg",
  "year": 2012,
  "al": ["Nyaruko: Crawling with Love!", "這いよれ！ニャル子さん", "Haiyoru! Nyaruko-san", "Nyarko-san: Another Crawling Chaos"],
  "r": 1491
 },
 {
  "id": 166710,
  "name": "Isekai Suicide Squad",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx166710-3G2croXhaCOm.jpg",
  "year": 2024,
  "al": ["Suicide Squad ISEKAI", "異世界スーサイド・スクワッド", "Legion samobójców: Isekai", "異世界自殺突擊隊", "Esquadrão Suicida: Isekai", "Az Öngyilkos osztag: Iszekai"],
  "r": 1492
 },
 {
  "id": 12883,
  "name": "Tsuritama",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12883-AjuWBGy1xd4e.jpg",
  "year": 2012,
  "al": ["つり球"],
  "r": 1493
 },
 {
  "id": 21386,
  "name": "One Punch Man: Road to Hero",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21386-ZMcREWXeWMow.jpg",
  "year": 2015,
  "al": ["One-Punch Man: Road to Hero", "ワンパンマン「ロード・トゥ・ヒーロー」", "One Punch Man OVA 1"],
  "r": 1494
 },
 {
  "id": 12029,
  "name": "Uchuu Senkan Yamato 2199",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx12029-qIY5Bkh4sFKx.png",
  "year": 2012,
  "al": ["Star Blazers: Space Battleship Yamato 2199", "宇宙戦艦ヤマト2199"],
  "r": 1495
 },
 {
  "id": 1827,
  "name": "Seirei no Moribito",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1827-snIp62SY7ZFK.jpg",
  "year": 2007,
  "al": ["Moribito: Guardian of the Spirit", "精霊の守り人", "Guardian of the Sacred Spirit"],
  "r": 1496
 },
 {
  "id": 15059,
  "name": "Initial D Fifth Stage",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/15059.jpg",
  "year": 2012,
  "al": ["頭文字[イニシャル]D Fifth Stage"],
  "r": 1497
 },
 {
  "id": 17513,
  "name": "DIABOLIK LOVERS",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx17513-gfqhEF7XYYvm.jpg",
  "year": 2013,
  "al": ["ディアボリックラヴァーズ"],
  "r": 1498
 },
 {
  "id": 183275,
  "name": "Kanpeki Sugite Kawai-ge ga Nai to Konyaku Haki Sareta Seijo wa Ringoku ni Urareru",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx183275-WtAo77sYDFW8.png",
  "year": 2025,
  "al": ["The Too-Perfect Saint: Tossed Aside by My Fiancé and Sold to Another Kingdom", "完璧すぎて可愛げがないと婚約破棄された聖女は隣国に売られる", "Kanpekiseijo"],
  "r": 1499
 },
 {
  "id": 21710,
  "name": "Natsume Yuujinchou Go",
  "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx21710-Y20fKQviC3hL.jpg",
  "year": 2016,
  "al": ["Natsume's Book of Friends Season 5", "夏目友人帳 伍", "Natsume's Book of Friends Five"],
  "r": 1500
 }
];
