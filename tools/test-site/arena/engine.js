/* Arena — moteur de combat 1v1 (prototype)
   Logique pure, sans DOM. Utilisable en Node pour les tests.
   Toutes les règles non tranchées par le cahier des charges sont marquées
   PROPOSITION dans RULES ci-dessous et dans l'interface. */
(function (global) {
  'use strict';

  var COLS = 5;
  var RARITY_ORDER = { uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5, special: 6 };
  var RARITY_FR = {
    uncommon: 'Uncommon', rare: 'Rare', epic: 'Épique',
    legendary: 'Légendaire', mythic: 'Mythique', special: 'Spéciale'
  };

  /* ------------------------------------------------------------------ */
  /* Règles implémentées : chaque entrée renvoie à une ligne du cahier.  */
  /* ------------------------------------------------------------------ */
  var RULES = [
    { id: 'deck', titre: 'Deck de 20 personnages uniques', etat: 'cahier',
      texte: "20 cartes possédées, toutes éditions confondues, Uncommon minimum. Une même personne n'occupe qu'une place : l'identité canonique est le nom normalisé, la meilleure édition disponible (Strongest > Hoshi > Basic) est retenue." },
    { id: 'setup', titre: 'Mise en place', etat: 'cahier',
      texte: "Chaque joueur a 5 cartes cachées sur le terrain, 3 en main, 12 en pioche. Avant le premier tour, chaque joueur choisit les 2 cartes de son terrain qu'il retourne ; elles sont révélées en même temps. Premier joueur tiré au hasard : il ne joue qu'un seul coup à son premier tour." },
    { id: 'plateau', titre: ' Orientation du plateau', etat: 'proposition',
      texte: "Plateau 2 rangées x 5 colonnes, une rangée par joueur, les deux rangées face à face. La colonne n d'une rangée fait face à la colonne n de l'autre. Une carte ne se déplace jamais d'une rangée à l'autre." },
    { id: 'coups', titre: 'Deux coups par tour', etat: 'cahier',
      texte: "Révéler, poser, remplacer, attaquer, utiliser une capacité active et déplacer coûtent chacun un coup. Piocher coûte un coup. Exception : le joueur qui commence n'a qu'un coup à son tout premier tour." },
    { id: 'remplacement', titre: 'Remplacement', etat: 'cahier',
      texte: "Pour un coup, une carte visible de votre terrain peut être remplacée par une carte de votre main : la nouvelle carte arrive face visible sur la case, l'ancienne part au fond de votre pioche (elle ne compte pas comme morte, perd ses statuts et bonus mais garde ses dégâts), et vous piochez aussitôt une carte gratuitement. Impossible sur une carte qui brûle ou prise dans une Prison de glace complète." },
    { id: 'remplissage', titre: 'Remplissage du terrain', etat: 'proposition',
      texte: "Quand une carte meurt (ou quitte le terrain), sa case est remplie au début du tour suivant de son propriétaire : il choisit, gratuitement, une carte de sa main ou la carte du dessus de sa pioche ; elle arrive face cachée. Si sa main est vide, la pioche remplit sans choix. Une carte renvoyée dans la pioche ne se régénère pas : elle garde ses dégâts." },
    { id: 'adjacence', titre: "Bonus d'animé voisin", etat: 'proposition',
      etatTexte: true,
      texte: "Un voisin visible de la même série donne +10 ATK et +10 PV maximum et actuels, cumulable à +20 (deux voisins au maximum). Sont voisines deux cases orthogonalement ou diagonalement adjacentes. PROPOSITION : seuls les voisins alliés comptent (synergie d'équipe). Quand le bonus tombe, les PV actuels sont conservés puis plafonnés au nouveau maximum." },
    { id: 'attaque', titre: 'Attaque', etat: 'proposition',
      texte: "Une carte visible attaque une carte visible de la rangée opposée, même colonne ou colonne adjacente (« en face ou en diagonale »). Sans riposte ; une attaque maximum par carte et par tour. PROPOSITION : une carte cachée ne peut pas être attaquée — il faut d'abord la révéler." },
    { id: 'deplacement', titre: 'Déplacement', etat: 'proposition',
      texte: "Échange de deux cartes visibles alliées, ou déplacement d'une carte visible vers une case vide de sa rangée. PROPOSITION : l'échange n'exige pas l'adjacence et le déplacement vers une case libre est étendu à toutes les cartes visibles, afin qu'aucune position ne devienne définitivement hors de portée." },
    { id: 'defaite', titre: 'Défaite', etat: 'proposition',
      texte: "Un terrain vide est autorisé tant qu'il reste des cartes. Un joueur perd quand il n'a plus aucune carte : terrain vide, main vide et pioche vide. Si les deux joueurs tombent à zéro sur le même effet, la partie est nulle." },
    { id: 'capacites', titre: 'Capacités par rareté', etat: 'cahier',
      texte: 'Spéciale : deux capacités. Mythique et Légendaire : une. Épique : une capacité faible. Rare et Uncommon : aucune. Les nombres d’utilisations sont propres à chaque capacité et affichés sur la carte.' },
    { id: 'passifs', titre: 'Capacités passives', etat: 'proposition',
      texte: "PROPOSITION : une capacité passive ne coûte aucun coup et ne s'active pas — elle s'applique tant que la carte est en jeu (SSJ Blue, Ultra Instinct, Jane Doe, Absorption, Guérison sanguinaire, Dernier des Uchiha, Vengeance, Assimilation). Elle compte dans le quota de capacités de la rareté." },
    { id: 'flammes', titre: 'Effets persistants sur une case', etat: 'proposition',
      texte: "PROPOSITION : les flammes d'Amaterasu sont attachées à une case (rangée + colonne) et non à une carte : elles brûlent toute carte qui s'y trouve à la fin de chaque tour, alliée ou adverse, et ne peuvent pas être retirées." },
    { id: 'recharges', titre: 'Recharges', etat: 'proposition',
      texte: "PROPOSITION : chaque capacité a un nombre d'utilisations par partie, indiqué sur la carte ; aucune capacité ne se recharge au tour. Les capacités actives coûtent un coup." },
    { id: 'cap-nommees', titre: 'Capacités nommées', etat: 'proposition',
      texte: "Les huit capacités décrites au cahier (Angel Devil, Reze, Sukuna, Megumi, Yoru, Goku, Makima, Gogeta) sont implémentées dans une version simplifiée. Les points laissés ouverts (rang, égalités, arrondis, durée) ont reçu une interprétation explicite, visible sur la carte et dans le panneau Interprétations." }
  ];

  RULES.push(
    { id: 'familles', titre: 'Familles de capacités Épique & Légendaire', etat: 'cahier',
      texte: "261 cartes Épique ou Légendaire sont rattachées à l'une des 17 familles du document (Tireur, Électricité, Feu, Glace et eau, Lame, Rempart, Vitesse, Soigneur, Stratège, Poison, Invocateur, Régénération, Assassin, Psychique, Explosifs, Copie, Vol). Les autres gardent la capacité de leur profil. Passive : aucun coup, s'applique tant que la carte est face visible. Active : un coup, nombre d'utilisations par partie." },
    { id: 'quota', titre: 'Une capacité par carte', etat: 'cahier',
      texte: "Chaque carte a une seule capacité ; seules les Spéciales en ont deux (Goku Mythique garde Kamehameha, Ultra Instinct reste à la Spéciale). PROPOSITION pour les familles : l'Épique reçoit la passive de sa famille et la Légendaire son active (Soigneur et Copie n'ont qu'une passive). La règle est la même pour tous les joueurs." },
    { id: 'statuts', titre: 'Statuts partagés', etat: 'cahier',
      texte: "Paralysie (pas d'attaque à son prochain tour), Brûlure (PV fixes à la fin de chacun de ses tours, 2 tours, ni déplacement ni remplacement), Gel (−% d'ATK jusqu'à la fin de son prochain tour), Venin (doublé ou triplé à chaque tour, 3 tours, cumulable ×2, soins bloqués). Un exemplaire de chaque, une carte cachée n'en subit aucun, Rempart y est immunisé, et un statut tombe quand la carte quitte le terrain." }
  );

  var INTERPRETATIONS = [
    { sujet: 'Familles — choix du prototype', texte: "Les passives « cible touchée » (Paralysie, Brûlure, Gel, Morsure) se déclenchent sur les attaques et sur la cible principale des capacités, pas sur les éclaboussures. Mur de flammes brûle à la fin de chaque tour (des deux joueurs) et ne touche qu'une carte visible. Morsure draine l'ATK pour le reste de la partie ; le boost d'Incisif dure toute la partie. Combo et Ordre tactique résolvent la frappe aussitôt (sinon il ne resterait pas de coup pour attaquer). Dur à cuire dure jusqu'au prochain tour de la carte. Prison de glace peut viser une carte cachée (elle ne pourra pas être retournée). Le clone encaisse 50 % des coups reçus par son utilisateur, attaque avec lui et ne peut pas être visé directement. Projection renvoie la carte au fond de la pioche adverse, PV et statuts remis à zéro. Big Boom retourne les voisines cachées (effets d'entrée compris) avant de les toucher." },
    { sujet: 'Angel Devil', texte: "Soin passif de 50 % des dégâts infligés ; « Ailes démoniaques » double les dégâts de sa prochaine attaque, une fois par partie." },
    { sujet: 'Reze', texte: "Jane Doe (passif) : 80 dégâts à l'adversaire visible le plus proche à son entrée sur le terrain — révélation ou pose ; égalité de distance tranchée par la colonne la plus à gauche. « Rang » interprété comme tranche de 100 de characterRank : ATK −10 % par tranche, plancher à −10 % (sans classement connu)." },
    { sujet: 'Sukuna', texte: "« Clivage » répartit 250 dégâts entre les cartes ennemies visibles adjacentes, 250/n arrondi au supérieur par cible ; sans cible adjacente, aucune cible. « Échange » ne se déclenche que sous 16 % de PV et seulement si Sukuna a survécu au coup, deux fois au maximum." },
    { sujet: 'Megumi', texte: "Mahoraga se déclenche au début du tour suivant si Megumi a survécu à une attaque : il élimine le dernier attaquant. « Invocation » cumule +50 % des stats de base, quatre utilisations, jusqu'à la fin de la partie." },
    { sujet: 'Yoru', texte: "« Manipulation » oblige deux cartes ennemies visibles adjacentes à s'attaquer mutuellement, une fois ; chaque attaque applique son ATK, sans riposte." },
    { sujet: 'Goku', texte: "Kamehameha reste une capacité active : ATK x (0,5 + PV actuels / PV maximum) sur la cible et ses voisines visibles, arrondi au supérieur. Ultra Instinct est un PASSIF : 80 % d'esquive tant que Goku est visible, sans limite de durée ni d'utilisation." },
    { sujet: 'Denji', texte: "Guérison sanguinaire (passif) : après avoir éliminé une carte adverse, Denji récupère 25 % de ses PV maximum, sans dépasser son maximum." },
    { sujet: 'Pochita', texte: "Assimilation (passif) : la carte Pochita reste Pochita tant que Denji n'est pas sur le terrain. Dès que Denji entre sur le terrain (pose, remplissage automatique ou mise en place), les deux fusionnent sur la case de Denji : la carte devient Chainsaw Man avec +60 PV et +30 ATK, et les aptitudes de Denji sont conservées. Base retenue : les stats de Pochita, auxquelles s'ajoute le bonus ; la carte Denji est absorbée sans compter comme allié mort, et la case libérée par Pochita se remplit au tour suivant." },
    { sujet: 'Itachi', texte: "Amaterasu : une utilisation, cible une case du plateau. 25 dégâts à la carte présente sur cette case à la fin de chaque tour, alliée ou adverse ; les flammes ne disparaissent jamais et se cumulent si la case est visée plusieurs fois par des Itachi différents." },
    { sujet: 'Sasuke', texte: "Dernier des Uchiha (passif) : +10 % de stats (ATK et PV maximum) par carte alliée morte depuis le début de la partie ; les PV courants ne suivent pas automatiquement la hausse." },
    { sujet: 'Hohenheim', texte: "Vengeance (passif) : même mécanique que Sasuke, à +5 % par carte alliée morte." },
    { sujet: 'Makima', texte: "« Contrôle » place une carte ennemie au bas de la pioche pour la partie, une fois. La propriété est rendue à la fin de la partie : l'effet ne transfère aucun inventaire réel." },
    { sujet: 'Gogeta', texte: "« Verrouillage » reste actif : la cible et ses voisines ne peuvent pas attaquer au tour suivant ; la version Mythique ne peut pas attaquer au tour suivant. « SSJ Blue » est un PASSIF : à la révélation de Gogeta, +100 % des stats de base pendant trois tours." }
  ];

  /* ------------------------------------------------------------------ */
  /* Utilitaires                                                         */
  /* ------------------------------------------------------------------ */
  function shuffle(arr, rng) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function normName(n) { return String(n || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }

  /* Alias de noms : l'aperçu contient plusieurs graphies pour un même personnage. */
  var ALIASES = {
    'ryomen sukuna': 'sukuna', 'sukuna': 'sukuna',
    'gokuu son': 'goku', 'son goku': 'goku', 'goku': 'goku',
    'yoru': 'yoru', 'megumi fushiguro': 'megumi fushiguro',
    'angel devil': 'angel devil', 'reze': 'reze', 'makima': 'makima', 'gogeta': 'gogeta',
    'itachi uchiha': 'itachi', 'sasuke uchiha': 'sasuke',
    'van hohenheim': 'hohenheim', 'hoenheim': 'hohenheim', 'hohenheim': 'hohenheim',
    'pochita': 'pochita', 'denji': 'denji',
    'jane doe': 'jane doe'
  };
  function canonName(n) { var k = normName(n); return ALIASES[k] || k; }

  /* ------------------------------------------------------------------ */
  /* Capacités                                                           */
  /* ------------------------------------------------------------------ */
  function genericAbility(profil, rarity) {
    var weak = rarity === 'epic';
    var p = (profil || 'equilibre').toLowerCase();
    if (p === 'frappeur' || p === 'offensif' || p === 'explosif' || p === 'colosse') {
      return {
        key: 'frappe', nom: 'Frappe lourde', cible: 'ennemi',
        desc: weak ? 'Inflige 50 % de l’ATK à une carte ennemie visible adjacente.' :
          'Inflige 80 % de l’ATK à une carte ennemie visible adjacente (hors attaque).',
        uses: weak ? 1 : 2, mult: weak ? 0.5 : 0.8
      };
    }
    if (p === 'resistant' || p === 'colosse') {
      return {
        key: 'garde', nom: 'Garde', cible: 'soi',
        desc: weak ? 'Réduit de 30 % les dégâts subis jusqu’à votre prochain tour.' :
          'Réduit de 60 % les dégâts subis jusqu’à votre prochain tour.',
        uses: weak ? 1 : 2, reduction: weak ? 0.3 : 0.6
      };
    }
    if (p === 'soutien' || p === 'regeneration') {
      return {
        key: 'soin', nom: 'Second souffle', cible: 'allie',
        desc: weak ? 'Rend 15 PV à une carte alliée visible adjacente.' :
          'Rend 35 PV à une carte alliée visible adjacente (sans dépasser son maximum).',
        uses: weak ? 1 : 2, soin: weak ? 15 : 35
      };
    }
    if (p === 'rapide' || p === 'pilote') {
      return {
        key: 'esquive', nom: 'Esquive', cible: 'soi',
        desc: weak ? '30 % d’esquive jusqu’à votre prochain tour.' : '50 % d’esquive jusqu’à votre prochain tour.',
        uses: weak ? 1 : 2, esquive: weak ? 0.3 : 0.5
      };
    }
    return {
      key: 'analyse', nom: 'Analyse', cible: 'soi',
      desc: weak ? 'Pioche une carte.' : 'Pioche une carte sans consommer la pioche du tour.',
      uses: weak ? 1 : 2
    };
  }


  /* ------------------------------------------------------------------ */
  /* Familles de capacités Épique & Légendaire (document « Capacités      */
  /* génériques Épique & Légendaire »). Une carte Épique ou Légendaire     */
  /* taguée reçoit la passive de sa famille et, selon le réglage du quota, */
  /* son active. Les cartes sans famille gardent la capacité de leur       */
  /* profil (Frappe lourde, Garde, Second souffle, Esquive, Analyse).      */
  /* ------------------------------------------------------------------ */
  var FAMILY_OF = {"Shino Asada": "tireur", "Guido Mista": "tireur", "Rebecca": "tireur", "Nicholas D. Wolfwood": "tireur", "Riza Hawkeye": "tireur", "Vash the Stampede": "tireur", "Usopp": "tireur", "Uryuu Ishida": "tireur", "Mine": "tireur", "Chisato Nishikigi": "tireur", "Takina Inoue": "tireur", "Faye Valentine": "tireur", "Spike Spiegel": "tireur", "Balalaika": "tireur", "Roberta Cisneros": "tireur", "Mami Tomoe": "tireur", "Archer": "tireur", "Kiritsugu Emiya": "tireur", "Sniper Kamen": "tireur", "Milly Thompson": "tireur", "Sasha Blouse": "tireur", "Ash Lynx": "tireur", "Angelo Lagusa": "tireur", "Seras Victoria": "tireur", "Youko Littner": "tireur", "Asirpa": "tireur", "Shinya Kougami": "tireur", "Nobuchika Ginoza": "tireur", "Anju Emma": "tireur", "Kurena Kukumila": "tireur", "Theoto Rikka": "tireur", "Hild": "tireur", "Yukio Okumura": "tireur", "Shinya Hiiragi": "tireur", "Mey-Rin": "tireur", "Takehisa Hinawa": "tireur", "Narancia Ghirga": "tireur", "Bishamon": "tireur", "Denki Kaminari": "electricite", "Luck Voltia": "electricite", "Laxus Dreyar": "electricite", "Mikoto Misaka": "electricite", "Hajime Kashimo": "electricite", "Makoto Kino": "electricite", "Hei": "electricite", "Carrot": "electricite", "Fuegoleon Vermillion": "feu", "Portgas D. Ace": "feu", "Enji Todoroki": "feu", "Benimaru": "feu", "Rei Hino": "feu", "Maki Oze": "feu", "Princess Hibana": "feu", "Tamaki Kotatsu": "feu", "Joker": "feu", "Sakazuki": "feu", "Sabo": "feu", "Mohammed Avdol": "feu", "Genryuusai Yamamoto": "feu", "Rin Okumura": "feu", "Stella  Vermillion": "feu", "Kotori Itsuka": "feu", "Tsunayoshi Sawada": "feu", "Yoshino": "glace", "Kuzan": "glace", "Toushirou Hitsugaya": "glace", "Juvia Lockser": "glace", "Ami Mizuno": "glace", "Michiru Kaiou": "glace", "Roxy Migurdia": "glace", "Dracule Mihawk": "lame", "Shichika Yasuri": "lame", "Jin": "lame", "Byakuya Kuchiki": "lame", "Kenshin Himura": "lame", "Renji Abarai": "lame", "Eugeo": "lame", "Alice Zuberg": "lame", "Ais Wallenstein": "lame", "Kokushibo": "lame", "Yoriichi Tsugikuni": "lame", "Muichirou Tokitou": "lame", "Obanai Iguro": "lame", "Sanemi Shinazugawa": "lame", "Mitsuri Kanroji": "lame", "Shinji Hirako": "lame", "Gin Ichimaru": "lame", "Zangetsu": "lame", "Saeko Busujima": "lame", "Shinsuke Takasugi": "lame", "Toushirou Hijikata": "lame", "Sougo Okita": "lame", "Kotarou Katsura": "lame", "Isao Kondou": "lame", "Hak Son": "lame", "Mordred Pendragon": "lame", "Xin Li": "lame", "Suguha Kirigaya": "lame", "Ikki Kurogane": "lame", "Casca": "lame", "Shiki Ryougi": "lame", "Mikaela Hyakuya": "lame", "Yuuichirou Hyakuya": "lame", "Guren Ichinose": "lame", "Inosuke Hashibira": "lame", "Shura Kirigakure": "lame", "Raphtalia": "lame", "Laios Thorden": "lame", "Thors Snorresson": "lame", "Yato": "lame", "Takamura": "lame", "Kisame Hoshigaki": "lame", "Nicolas Brown": "lame", "Kishou Arima": "lame", "Hyakkimaru": "lame", "Olivier Mira Armstrong": "lame", "Jinbe": "rempart", "Yasutora Sado": "rempart", "Annie Leonhart": "rempart", "Senshi": "rempart", "Darkness": "rempart", "Eijirou Kirishima": "rempart", "Franky": "rempart", "Gyoumei Himejima": "rempart", "Naofumi Iwatani": "rempart", "Garfiel Tinsel": "rempart", "Diane": "rempart", "Chouji Akimichi": "rempart", "Albedo": "rempart", "Klaus von Reinherz": "rempart", "Thorkell": "rempart", "Bulat": "rempart", "Tatsumi": "rempart", "Jeanne  d'Arc": "rempart", "Charon": "rempart", "Taiju Ooki": "rempart", "Greed": "rempart", "Gajeel Redfox": "rempart", "Ki-Ja": "rempart", "Onsoku no Sonic": "vitesse", "Soi Fon": "vitesse", "Borsalino": "vitesse", "Rumi Usagiyama": "vitesse", "Tengen Uzui": "vitesse", "Rock Lee": "vitesse", "Bell Cranel": "vitesse", "Mirio Togata": "vitesse", "Guy Might": "vitesse", "Grimmjow Jaegerjaquez": "vitesse", "Hiei": "vitesse", "Garou": "vitesse", "Haruka Tenou": "vitesse", "Kamui": "vitesse", "Shuna": "soigneur", "Mimosa Vermillion": "soigneur", "Retsu Unohana": "soigneur", "Akiko Yosano": "soigneur", "Tsunade Senju": "soigneur", "Tony Tony Chopper": "soigneur", "Sakura Haruno": "soigneur", "Wendy Marvell": "soigneur", "Elizabeth Liones": "soigneur", "Sylphiette": "soigneur", "Leorio Paradinight": "soigneur", "Shiroe": "stratege", "Demiurge": "stratege", "Erwin Smith": "stratege", "Hange Zoe": "stratege", "Akane Tsunemori": "stratege", "Reinhard von Lohengramm": "stratege", "Loid Forger": "stratege", "Kazuma Satou": "stratege", "Askeladd": "stratege", "Canute Svenson": "stratege", "Mavis Vermillion": "stratege", "Misato Katsuragi": "stratege", "Dok-Ja Kim": "stratege", "Fyodor Dostoyevsky": "stratege", "Doppo Kunikida": "stratege", "Izaya Orihara": "stratege", "Shougo Makishima": "stratege", "Integra Fairbrook Wingates Hellsing": "stratege", "Siesta": "stratege", "Meme Oshino": "stratege", "Orochimaru": "poison", "Entoma Vasilissa Zeta": "poison", "Mayuri Kurotsuchi": "poison", "Kumoko": "poison", "Medusa": "poison", "Jin Bubaigawara": "invocateur", "Rem Galleu": "invocateur", "Suguru Getou": "invocateur", "Funny Valentine": "invocateur", "Sakura Kinomoto": "invocateur", "Fumikage Tokoyami": "invocateur", "Fushi": "regeneration", "Tsukihi Araragi": "regeneration", "Kinji Hakari": "regeneration", "Akihito Kanbara": "regeneration", "Saichi Sugimoto": "regeneration", "Ban": "regeneration", "Hashirama Senju": "regeneration", "Phosphophyllite": "regeneration", "Cell": "regeneration", "Majin Boo": "regeneration", "Kid Buu": "regeneration", "Satou": "regeneration", "Alucard": "regeneration", "Rize Kamishiro": "regeneration", "Nezuko Kamado": "regeneration", "Akaza": "regeneration", "Muzan Kibutsuji": "regeneration", "Mahito": "regeneration", "Rory Mercury": "regeneration", "Krul Tepes": "regeneration", "Arcueid Brunestud": "regeneration", "Shalltear Bloodfallen": "regeneration", "Alexander Anderson": "regeneration", "Kaiman": "regeneration", "Eto": "regeneration", "Zeno": "regeneration", "Lugh Tuatha Dé": "assassin", "Kyouka Izumi": "assassin", "Shin Asakura": "assassin", "Osaragi": "assassin", "Kei Uzuki": "assassin", "Nagisa Shiota": "assassin", "Hisoka Morow": "assassin", "Yoichi Nagumo": "assassin", "Touji Fushiguro": "assassin", "Feitan Portor": "assassin", "Gabimaru": "assassin", "Karma Akabane": "assassin", "Akatsuki": "assassin", "Tarou Sakamoto": "assassin", "Yuzuriha": "assassin", "Claire Stanfield": "assassin", "Rei Suwa": "assassin", "Sebastian Michaelis": "assassin", "Fiona Frost": "assassin", "Fubuki": "psychique", "Ritsu Kageyama": "psychique", "Tatsumaki": "psychique", "Ochako Uraraka": "psychique", "Quinella": "psychique", "Solf Kimblee": "explosifs", "Reg": "explosifs", "Gabi Braun": "explosifs", "Himiko Toga": "copie", "Chelsea": "copie", "Tamaki Amajiki": "copie", "Fafnir": "vol", "Filo": "vol", "Elma": "vol", "Beru": "vol", "Keigo Takami": "vol", "Kanna Kamui": "vol", "Diablo": "vol", "Veldora Tempest": "vol", "Tenshi no Akuma": "vol", "Jae-Ha": "vol"};

  /* PROPOSITION (point « Quota par carte » du document) : Épique = passive
     seule, Légendaire = passive + active. Réglable dans l'interface. */
  /* Une seule capacité par carte (seules les Spéciales en ont deux).
     famMode : 'split' = Épique → passive de sa famille, Légendaire → active (PROPOSITION par défaut) ;
     'passive' = toutes la passive ; 'active' = toutes l'active. Soigneur et Copie n'ont qu'une passive. */
  var SETTINGS = { famMode: 'split' };

  var FAMILIES = {
    tireur: { nom: 'Tireur', icon: '◎',
      passive: { key: 'longueportee', nom: 'Longue portée',
        e: "Attaque jusqu'à 2 colonnes d'écart ; −25 % de dégâts au-delà de la colonne voisine.",
        l: "Attaque jusqu'à 2 colonnes d'écart, sans pénalité." },
      active: { key: 'tirprecision', nom: 'Tir de précision', cible: 'ennemi', portee: 'libre',
        e: "70 % de l'ATK sur n'importe quelle carte ennemie visible ; ignore esquive, réductions de dégâts, clone, familier et provocation.",
        l: "100 % de l'ATK, même cible libre, ignore les mêmes effets.", ue: 1, ul: 2 } },
    electricite: { nom: 'Électricité', icon: 'ϟ',
      passive: { key: 'paralysie', nom: 'Paralysie',
        e: "20 % de chances de paralyser la cible touchée ; 40 % de paralyser une carte qui lui inflige des dégâts.",
        l: "35 % de chances ; 60 % sur une carte qui lui inflige des dégâts." },
      active: { key: 'decharge', nom: 'Décharge en chaîne', cible: 'ennemi', portee: 'attaque',
        e: "50 % de l'ATK sur la cible puis 25 % sur une ennemie visible voisine ; 10 % de paralyser la cible principale.",
        l: "70 % puis 40 % sur 2 ennemies visibles adjacentes ; la cible principale est paralysée, 10 % de paralyser les voisines.", ue: 1, ul: 2 } },
    feu: { nom: 'Feu', icon: '♨',
      passive: { key: 'brulure', nom: 'Brûlure',
        e: "La cible touchée brûle : 8 PV par tour pendant 2 tours ; elle ne peut être ni déplacée ni remplacée.",
        l: "12 PV par tour." },
      active: { key: 'murflammes', nom: 'Mur de flammes', cible: 'case',
        e: "Enflamme une case adverse : 15 dégâts à la fin de chaque tour pendant 4 tours.",
        l: "50 % de l'ATK immédiats sur la carte de la case, puis 20 par tour pendant 6 tours.", ue: 1, ul: 1 } },
    glace: { nom: 'Glace et eau', icon: '❄',
      passive: { key: 'gel', nom: 'Gel', e: "La cible touchée est gelée : −15 % d'ATK jusqu'à la fin de son prochain tour.", l: "−25 % d'ATK." },
      active: { key: 'prison', nom: 'Prison de glace', cible: 'ennemi-cache', portee: 'attaque',
        e: "Une ennemie adjacente ne peut pas attaquer à son prochain tour ; cachée, elle ne peut pas être retournée.",
        l: "Ni attaque, ni capacité, ni déplacement à son prochain tour ; cachée, elle ne peut pas être retournée.", ue: 1, ul: 2 } },
    lame: { nom: 'Lame', icon: '⚔',
      passive: { key: 'riposte', nom: 'Riposte',
        e: "Si la carte survit à une attaque venue de la colonne d'en face, elle renvoie 30 % de son ATK à l'attaquant.",
        l: "Renvoie 50 % de son ATK." },
      active: { key: 'incisif', nom: 'Incisif', cible: 'ennemi', portee: 'attaque',
        e: "Frappe à 100 % de l'ATK en ignorant les réductions de dégâts (Invincible, Dur à cuire, Barrière psychique) ; +25 % si la cible a moins de la moitié de ses PV ; +10 % d'ATK pour le reste de la partie.",
        l: "+50 % dans le même cas ; +20 % d'ATK pour le reste de la partie.", ue: 1, ul: 2 } },
    rempart: { nom: 'Rempart', icon: '⛨',
      passive: { key: 'invincible', nom: 'Invincible', e: "Réduit les dégâts subis de 20 %. Ne peut pas subir de statut.", l: "Réduction de 30 %, immunité aux statuts." },
      active: { key: 'durcuire', nom: 'Dur à cuire', cible: 'soi',
        e: "Subit la prochaine attaque adverse, peu importe la carte visée, avec 60 % de dégâts en moins (jusqu'à son prochain tour).",
        l: "80 % de dégâts en moins.", ue: 1, ul: 2 } },
    vitesse: { nom: 'Vitesse', icon: '»',
      passive: { key: 'insaisissable', nom: 'Insaisissable', e: "20 % d'esquive permanente.", l: "30 % d'esquive permanente." },
      active: { key: 'combo', nom: 'Combo', cible: 'ennemi', portee: 'attaque',
        e: "Attaque une seconde fois ce tour, à 50 % de son ATK (même si elle a déjà attaqué).", l: "Seconde attaque à 80 %.", ue: 1, ul: 2 } },
    soigneur: { nom: 'Soigneur', icon: '✚',
      passive: { key: 'aura', nom: 'Aura apaisante', e: "Au début de votre tour, +5 PV aux alliées visibles adjacentes.", l: "+10 PV." },
      active: null },
    stratege: { nom: 'Stratège', icon: '♜',
      passive: { key: 'strategie', nom: 'Stratège',
        e: "Voit toutes les cartes cachées adverses et votre prochaine pioche. Les effets s'arrêtent quand la carte meurt.",
        l: "Même effet, plus la main de l'adversaire, sa prochaine pioche et +10 % d'ATK pour vos alliées. Les effets s'arrêtent quand la carte meurt." },
      active: { key: 'ordre', nom: 'Ordre tactique', cible: 'allie-puis-ennemi',
        e: "Une alliée visible qui a déjà attaqué ce tour attaque de nouveau, à 50 % de son ATK.", l: "À 100 % de son ATK.", ue: 1, ul: 2 } },
    poison: { nom: 'Poison', icon: '☣',
      passive: { key: 'morsure', nom: 'Morsure',
        e: "Draine 20 % de l'ATK de la cible touchée ; 5 % de chances de la paralyser.", l: "Draine 25 % ; 10 % de paralysie." },
      active: { key: 'venin', nom: 'Venin', cible: 'ennemi', portee: 'libre',
        e: "Vise une carte ennemie visible au choix : 20 % de l'ATK, puis empoisonnée : 4 % → 8 % → 16 % de ses PV max par tour ; ne peut pas être soignée.",
        l: "35 % de l'ATK, puis 6 % → 18 % → 54 % de ses PV max par tour.", ue: 1, ul: 1 } },
    invocateur: { nom: 'Invocateur', icon: '✦',
      passive: { key: 'familier', nom: 'Familier gardien', e: "La première attaque reçue dans la partie est à moitié absorbée (−50 %).", l: "Entièrement absorbée." },
      active: { key: 'clonage', nom: 'Clonage', cible: 'soi',
        e: "Place devant elle un clone à 50 % de son ATK et de ses PV : il encaisse 50 % des coups reçus et attaque avec elle. Tué seul, il compte comme mort ; il meurt avec son utilisateur sans compter.",
        l: "Clone à 100 % des stats.", ue: 1, ul: 1 } },
    regeneration: { nom: 'Régénération', icon: '❋',
      passive: { key: 'regen', nom: 'Régénération',
        e: "Au début de votre tour, +6 % de ses PV max.", l: "+10 %, et une fois par partie un coup fatal la laisse à 1 PV (Increvable)." },
      active: { key: 'soigneurregen', nom: 'Soigneur', cible: 'allie',
        e: "Rend 35 % de ses PV max à une alliée visible ou à elle-même.", l: "Rend 70 % de ses PV max et retire tous les statuts.", ue: 2, ul: 2 } },
    assassin: { nom: 'Assassin', icon: '✖',
      passive: { key: 'embuscade', nom: 'Embuscade',
        e: "Sa première attaque après une entrée face visible (révélation, pose) inflige +30 %.", l: "+50 %." },
      active: { key: 'execution', nom: 'Exécution', cible: 'ennemi', portee: 'attaque',
        e: "Sur une cible à moins de 30 % de ses PV : dégâts ×1,5 ; sinon 50 % de l'ATK.",
        l: "Sous 30 % : élimination directe (×1,5 sur une Spéciale) ; sinon 70 %.", ue: 1, ul: 1 } },
    psychique: { nom: 'Psychique', icon: '◉',
      passive: { key: 'barriere', nom: 'Barrière psychique',
        e: "−35 % de dégâts subis sur les capacités.", l: "−50 % sur les capacités, et −10 % sur les attaques normales pour elle et ses alliées." },
      active: { key: 'projection', nom: 'Projection', cible: 'ennemi', portee: 'attaque',
        e: "Inflige 70 % de l'ATK et renvoie la carte adverse dans la pioche de l'adversaire, sans qu'elle compte comme morte.",
        l: "90 % de l'ATK.", ue: 1, ul: 2 } },
    explosifs: { nom: 'Explosifs', icon: '✺',
      passive: { key: 'explosif', nom: 'Explosif', e: "Ses attaques touchent aussi les ennemies visibles voisines de la cible pour 25 % de l'ATK.", l: "40 % de l'ATK." },
      active: { key: 'bigboom', nom: 'Big Boom', cible: 'ennemi', portee: 'attaque',
        e: "110 % de l'ATK sur la cible et 65 % sur ses voisines visibles ; retourne les voisines cachées en leur infligeant 25 % ; la carte perd 20 % de ses PV max.",
        l: "120 %, 75 % et 33 % ; contrecoup de 10 %.", ue: 1, ul: 2 } },
    copie: { nom: 'Copie', icon: '⧉',
      passive: { key: 'metamorphose', nom: 'Métamorphose',
        e: "À son entrée face visible, compte comme de la même série que ses alliées voisines pour le bonus d'animé ; ne se réactive pas si une alliée est remplacée.",
        l: "Même effet, réactivé à chaque changement d'alliées." },
      active: null },
    vol: { nom: 'Vol', icon: '⌃',
      passive: { key: 'defaerienne', nom: 'Défense aérienne',
        e: "Ne peut être attaquée que depuis la colonne d'en face ; Longue portée et capacités l'atteignent normalement.", l: "Même règle, +10 % d'esquive." },
      active: { key: 'attaqueaerienne', nom: 'Attaque aérienne', cible: 'ennemi', portee: 2,
        e: "100 % de l'ATK sur une ennemie visible jusqu'à 2 colonnes d'écart.", l: "120 % de l'ATK, même portée.", ue: 1, ul: 2 } }
  };

  function passiveChosen(d) {
    var f = familyOfDef(d); if (!f) return false;
    if (!FAMILIES[f].active) return true;
    /* Règle commune à tous les joueurs : l'Épique a la passive de sa famille, la Légendaire son active. */
    return d.rarity === 'epic';
  }

  /* Famille d'une définition (Épique / Légendaire taguées uniquement). */
  function familyOfDef(d) {
    if (!d || (d.rarity !== 'epic' && d.rarity !== 'legendary')) return null;
    var f = FAMILY_OF[d.name];
    return f && FAMILIES[f] ? f : null;
  }
  function tierOf(d) { return d.rarity === 'legendary' ? 'l' : 'e'; }
  /* Famille active d'une carte EN JEU : seulement face visible (passives). */
  function famAny(st, c) {
    if (!c || !c.faceUp) return null;
    return familyOfDef(def(st, c));
  }
  /* Famille dont la PASSIVE s'applique à cette carte (face visible, passive attribuée). */
  function fam(st, c) {
    if (!c || !c.faceUp) return null;
    var d = def(st, c);
    return passiveChosen(d) ? familyOfDef(d) : null;
  }
  function isLeg(st, c) { return def(st, c).rarity === 'legendary'; }
  function famPassive(d) {
    var f = familyOfDef(d); if (!f || !passiveChosen(d)) return null;
    var p = FAMILIES[f].passive, t = tierOf(d);
    return { key: p.key, nom: p.nom, desc: t === 'l' ? p.e + ' Légendaire : ' + p.l : p.e, fam: f };
  }
  function famActive(d) {
    var f = familyOfDef(d); if (!f) return null;
    var a = FAMILIES[f].active; if (!a) return null;
    if (passiveChosen(d)) return null;
    var t = tierOf(d);
    return { key: a.key, nom: a.nom, desc: t === 'l' ? a.e + ' Légendaire : ' + a.l : a.e, cible: a.cible, portee: a.portee, uses: t === 'l' ? a.ul : a.ue, fam: f };
  }

  /* Tour de jeu du prochain tour d'un joueur (les statuts « jusqu'à son prochain tour »). */
  function nextTurnOf(st, owner) { return st.turnOwner === owner ? st.turnNo + 2 : st.turnNo + 1; }

  function fx(st, ev) { (st.fx || (st.fx = [])).push(ev); }
  function where(st, uid) {
    var c = st.cards[uid]; if (!c) return null;
    var s = st.players[c.owner].terrain.indexOf(uid);
    return s < 0 ? null : { owner: c.owner, slot: s };
  }

  /* ---------- statuts ---------- */
  function statusImmune(st, c) {
    if (!c || !c.faceUp) return true;               // une carte cachée ne subit aucun statut
    return fam(st, c) === 'rempart';                 // Invincible : immunité aux statuts
  }
  function applyStatus(st, uid, type, p) {
    var c = st.cards[uid];
    if (!c || statusImmune(st, c)) return false;
    var s = c.status || (c.status = {});
    var nm = def(st, c).name;
    if (type === 'para') {
      s.para = Math.max(s.para || 0, nextTurnOf(st, c.owner));
      log(st, 'status', nm + ' est paralysé : pas d’attaque à son prochain tour.');
    } else if (type === 'burn') {
      s.burn = { dmg: Math.max(p.dmg, (s.burn && s.burn.left > 0) ? s.burn.dmg : 0), left: 2 };
      log(st, 'status', nm + ' brûle (' + s.burn.dmg + ' PV par tour, 2 tours).');
    } else if (type === 'freeze') {
      s.freeze = { pct: Math.max(p.pct, (s.freeze && s.freeze.until >= st.turnNo) ? s.freeze.pct : 0), until: nextTurnOf(st, c.owner) };
      log(st, 'status', nm + ' est gelé : −' + Math.round(s.freeze.pct * 100) + ' % d’ATK.');
    } else if (type === 'venom') {
      s.venom = (s.venom || []).filter(function (v) { return v.i < v.seq.length; });
      if (s.venom.length >= 2) s.venom.shift();      // cumulable deux fois
      s.venom.push({ seq: p.seq.slice(), i: 0 });
      log(st, 'status', nm + ' est empoisonné (' + p.seq.join(' → ') + ' % des PV max par tour) — soins bloqués.');
    }
    fx(st, { t: 'status', uid: uid, s: type, at: where(st, uid) });
    return true;
  }
  function hasVenom(c) { return !!(c && c.status && c.status.venom && c.status.venom.some(function (v) { return v.i < v.seq.length; })); }
  function clearStatus(c) { if (c) c.status = {}; }
  function statusList(st, c) {
    var s = (c && c.status) || {}, out = [];
    if (s.para && s.para >= st.turnNo) out.push('para');
    if (s.burn && s.burn.left > 0) out.push('burn');
    if (s.freeze && s.freeze.until >= st.turnNo) out.push('freeze');
    if (hasVenom(c)) out.push('venom' + (s.venom.filter(function (v) { return v.i < v.seq.length; }).length > 1 ? '2' : ''));
    if (c && c.prison && c.prison.until >= st.turnNo) out.push(c.prison.full ? 'prison2' : 'prison');
    if (c && c.taunt && c.taunt.until >= st.turnNo) out.push('taunt');
    return out;
  }
  function paralysed(st, c) { return !!(c && c.status && c.status.para && c.status.para >= st.turnNo); }
  function imprisoned(st, c) { return !!(c && c.prison && c.prison.until >= st.turnNo); }
  function burning(c) { return !!(c && c.status && c.status.burn && c.status.burn.left > 0); }

  /* Portée d'attaque normale. */
  function attackRange(st, c) { return fam(st, c) === 'tireur' ? 2 : 1; }

  /* Stratège Légendaire visible : +10 % d'ATK pour les alliées. */
  function strategistAura(st, owner) {
    return st.players[owner].terrain.some(function (u) {
      var x = u && st.cards[u];
      return x && x.faceUp && fam(st, x) === 'stratege' && isLeg(st, x);
    });
  }
  /* Ce que le joueur voit grâce à un Stratège (pour l'interface). */
  function insight(st, pi) {
    var e = false, l = false;
    st.players[pi].terrain.forEach(function (u) {
      var x = u && st.cards[u];
      if (x && x.faceUp && fam(st, x) === 'stratege') { e = true; if (isLeg(st, x)) l = true; }
    });
    return { hidden: e, myNext: e, oppHand: l, oppNext: l };
  }

  var NAMED_ACTIVE = {
    'angel devil': function () {
      return [{
        key: 'ailes', nom: 'Ailes démoniaques', cible: 'soi',
        desc: 'Double les dégâts de sa prochaine attaque.', uses: 1
      }];
    },
    'itachi': function () {
      return [{
        key: 'amaterasu', nom: 'Amaterasu', cible: 'case',
        desc: 'Pose des flammes sur une case : 25 dégâts à la carte présente à la fin de chaque tour. Les flammes ne peuvent pas être retirées. Une utilisation.', uses: 1
      }];
    },
    'reze': function () { return []; },
    'sukuna': function () {
      return [
        { key: 'clivage', nom: 'Clivage', cible: 'auto-ennemis', desc: 'Répartit 250 dégâts (arrondi au supérieur) entre les cartes ennemies visibles adjacentes.', uses: 2, total: 250 },
        { key: 'echange', nom: 'Échange', cible: 'soi', desc: 'Sous 16 % de PV : échange les pourcentages de PV avec le dernier attaquant. Deux fois au maximum, jamais après un coup létal.', uses: 2 }
      ];
    },
    'megumi fushiguro': function () {
      return [{
        key: 'invocation', nom: 'Invocation', cible: 'soi',
        desc: 'Mahoraga riposte en un coup au tour suivant si Megumi survit. Invocation : +50 % des stats de base par utilisation, quatre fois au maximum.',
        uses: 4
      }];
    },
    'yoru': function () {
      return [{
        key: 'manipulation', nom: 'Manipulation', cible: 'auto',
        desc: 'Deux cartes ennemies visibles adjacentes s’attaquent mutuellement.', uses: 1
      }];
    },
    'goku': function () {
      return [{ key: 'kamehameha', nom: 'Kamehameha', cible: 'ennemi', desc: 'Vise une cible et ses voisines visibles : ATK x (0,5 + PV actuels / PV max).', uses: 2 }];
    },
    'makima': function () {
      return [{
        key: 'controle', nom: 'Contrôle', cible: 'ennemi',
        desc: 'Vole une carte ennemie et la place au bas de sa pioche pour la partie. Une fois.', uses: 1
      }];
    },
    'gogeta': function () {
      return [{ key: 'verrou', nom: 'Verrouillage', cible: 'ennemi', desc: 'La cible et ses voisines ne peuvent pas attaquer au tour suivant. La version Mythique ne peut pas attaquer non plus.', uses: 2 }];
    }
  };

  /* Capacités passives : elles ne coûtent pas de coup et ne s’activent pas. */
  var PASSIVES = {
    'angel devil': function () {
      return [{ key: 'lifesteal', nom: 'Absorption', desc: 'Se soigne de 50 % des dégâts infligés.' }];
    },
    'reze': function () {
      return [
        { key: 'janedoe', nom: 'Jane Doe', desc: 'À son entrée sur le terrain (révélation ou pose) : 80 dégâts à l’adversaire visible le plus proche.' },
        { key: 'atkmalus', nom: 'Charge instable', desc: 'ATK −10 % par tranche de 100 de rang (plancher −10 %).' }
      ];
    },
    'denji': function () {
      return [{ key: 'guerison', nom: 'Guérison sanguinaire', desc: 'Quand il élimine une carte adverse, il récupère 25 % de ses PV maximum.' }];
    },
    'pochita': function () {
      return [{ key: 'assimilation', nom: 'Assimilation', desc: 'Pochita reste Pochita tant que Denji n’est pas sur le terrain. Dès que Denji y entre, les deux fusionnent sur sa case : Chainsaw Man, +60 PV et +30 ATK, aptitudes de Denji conservées.' }];
    },
    'sasuke': function () {
      return [{ key: 'uchiha', nom: 'Dernier des Uchiha', desc: '+10 % de stats par carte alliée morte.' }];
    },
    'hohenheim': function () {
      return [{ key: 'vengeance', nom: 'Vengeance', desc: '+5 % de stats par carte alliée morte.' }];
    },
    'gogeta': function () {
      return [{ key: 'ssjblue', nom: 'SSJ Blue', desc: 'À sa révélation : +100 % des stats de base pendant trois tours.' }];
    },
    'goku': function () {
      return [{ key: 'ultra', nom: 'Ultra Instinct', desc: '80 % d’esquive tant que Goku reste visible.' }];
    }
  };

  function passivesFor(def) {
    if (def.rarity === 'rare' || def.rarity === 'uncommon') return [];
    var f = PASSIVES[canonName(def.name)];
    var list = f ? f() : [];
    /* Une seule capacité hors Spéciales : Ultra Instinct est la capacité de la Spéciale Goku. */
    if (def.rarity !== 'special' && canonName(def.name) === 'goku') list = [];
    var fp = famPassive(def);
    return fp ? list.concat([fp]) : list;
  }

  /* Renvoie la liste des capacités ACTIVES d'une carte (0 à 2). */
  function abilitiesFor(def) {
    var rar = def.rarity;
    if (rar === 'rare' || rar === 'uncommon') return [];
    var key = canonName(def.name);
    var pass = PASSIVES[key] ? PASSIVES[key]().length : 0;
    var acts = NAMED_ACTIVE[key];
    if (acts) {
      var list = acts().slice(0, rar === 'special' ? 2 : 1);
      if (rar === 'special' && list.length + pass < 2) {
        list = list.concat([genericAbility(def.profil, 'legendary')]).slice(0, 2 - pass);
      }
      return list;
    }
    /* Famille Épique / Légendaire : son active (selon le quota), sinon rien. */
    if (familyOfDef(def)) { var fa = famActive(def); return fa ? [fa] : []; }
    /* Personnage dont la capacité est entièrement passive. */
    if (pass > 0) return [];
    var g = genericAbility(def.profil, rar);
    if (rar === 'special') {
      return [g, {
        key: 'adrenaline', nom: 'Poussée d’adrénaline', cible: 'soi',
        desc: 'Ajoute 50 % à l’ATK jusqu’à la fin du tour.', uses: 1
      }];
    }
    return [g];
  }

  /* ------------------------------------------------------------------ */
  /* État                                                                */
  /* ------------------------------------------------------------------ */
  function newGame(opts) {
    opts = opts || {};
    var pool = opts.pool;
    var seed = (opts.seed == null ? Math.floor(Math.random() * 1e9) : opts.seed) >>> 0;
    var rng = mulberry32(seed);
    var st = {
      pool: pool,
      seed: seed,
      rng: rng,
      uid: 0,
      cards: {},
      players: [
        { nom: opts.nom0 || 'Vous', terrain: new Array(COLS).fill(null), hand: [], deck: [], lost: 0 },
        { nom: opts.nom1 || 'Adversaire', terrain: new Array(COLS).fill(null), hand: [], deck: [], lost: 0 }
      ],
      turnOwner: 0,
      turnNo: 0,
      actionsLeft: 2,
      log: [],
      over: null,
      lastDamageTurn: 1,
      flames: [],
      fires: [],
      fx: [],
      stats: { tours: 0, degats: [0, 0], eliminations: [0, 0] }
    };

    var deck0 = opts.deck0.slice();
    var deck1 = opts.deck1.slice();
    st.players[0].deck = shuffle(deck0, rng).map(function (i) { return makeCard(st, i, 0); });
    st.players[1].deck = shuffle(deck1, rng).map(function (i) { return makeCard(st, i, 1); });

    st.players.forEach(function (p) {
      for (var s = 0; s < COLS; s++) p.terrain[s] = p.deck.pop() || null;
      for (var h = 0; h < 3; h++) { var c = p.deck.pop(); if (c) p.hand.push(c); }
    });

    // Mise en place : chaque joueur choisit les 2 cartes qu'il retourne (action « setup »).
    st.turnOwner = rng() < 0.5 ? 0 : 1;
    st.turnNo = 1;
    st.actionsLeft = 1;
    st.phase = 'setup';
    st.setup = [null, null];
    st.log = [];
    log(st, 'p', 'Mise en place : deck de 20 cartes, 5 sur le terrain, 3 en main, 12 en pioche. Chaque joueur choisit 2 cartes à retourner.');
    return st;
  }

  function makeCard(st, defIndex, owner) {
    var def = st.pool[defIndex];
    var uid = ++st.uid;
    st.cards[uid] = {
      uid: uid, defIndex: defIndex, owner: owner, faceUp: false,
      pv: def.pv, bonus: 0, atkMul: 1, pvMul: 1,
      buffUntil: 0, shield: 0, shieldUntil: 0, dodge: 0, dodgeUntil: 0,
      attacked: false, lockedUntil: 0, usedAbil: {}, lastAttacker: null,
      mahoraga: false, mahoragaTarget: null, doubleNext: false,
      invoked: 0, flatAtk: 0, flatPv: 0, traits: [], fusion: false, ssjDone: false,
      status: {}, prison: null, taunt: null, clone: null, atkBoost: 0, ambush: false,
      guardUsed: false, undyingUsed: false, copySeries: null
    };
    return uid;
  }

  function def(st, card) { return st.pool[card.defIndex]; }
  function ownerOf(st, uid) { return st.cards[uid] ? st.cards[uid].owner : -1; }
  function slotOf(st, uid) { return st.players[st.cards[uid].owner].terrain.indexOf(uid); }

  function log(st, type, text) { st.log.push({ type: type, text: text, turn: st.turnNo }); }

  /* ------------------------------------------------------------------ */
  /* Stats effectives                                                    */
  /* ------------------------------------------------------------------ */
  /* Progression liée aux alliés morts : Sasuke +10 %/mort, Hohenheim +5 %/mort. */
  function lostMult(st, card) {
    var key = canonName(def(st, card).name);
    var rate = 0;
    if (hasTrait(st, card, 'sasuke')) rate = 0.10;
    else if (hasTrait(st, card, 'hohenheim')) rate = 0.05;
    if (!rate) return 1;
    var lost = (st.players[card.owner] && st.players[card.owner].lost) || 0;
    return 1 + rate * lost;
  }
  function hasTrait(st, card, trait) {
    if (!card) return false;
    if (canonName(def(st, card).name) === trait) return true;
    return (card.traits || []).indexOf(trait) >= 0;
  }
  function baseAtk(st, card) {
    var d = def(st, card);
    var atk = d.atk * card.atkMul * (1 + 0.5 * card.invoked) + (card.flatAtk || 0);
    if (canonName(d.name) === 'reze') {
      var tier = Math.max(1, Math.ceil((d.characterRank || 100) / 100));
      atk = atk * (1 - 0.1 * tier);
    }
    atk *= lostMult(st, card);
    return Math.max(0, atk);
  }
  function baseMaxPv(st, card) {
    var d = def(st, card);
    var pv = d.pv * card.pvMul * (1 + 0.5 * card.invoked) + (card.flatPv || 0);
    return Math.max(1, Math.round(pv * lostMult(st, card)));
  }
  /* Esquive effective : capacité active temporaire ou passive (Ultra Instinct). */
  function dodgeOf(st, card) {
    var d = 0;
    if (card.dodgeUntil >= st.turnNo) d = card.dodge;
    if (card.faceUp && canonName(def(st, card).name) === 'goku' && def(st, card).rarity === 'special') d = Math.max(d, 0.8);
    var f = fam(st, card);
    if (f === 'vitesse') d = Math.max(d, isLeg(st, card) ? 0.3 : 0.2);
    if (f === 'vol' && isLeg(st, card)) d = Math.min(0.95, d + 0.1);
    return d;
  }
  function displayName(st, card) {
    if (card && card.fusion) return 'Chainsaw Man';
    return card ? def(st, card).name : '?';
  }
  function stats(st, card) {
    var raw = baseAtk(st, card) * (1 + (card.atkBoost || 0));
    if (card.faceUp && strategistAura(st, card.owner)) raw *= 1.1;
    var fz = card.status && card.status.freeze;
    if (fz && fz.until >= st.turnNo) raw *= (1 - fz.pct);
    var atk = Math.round(raw) + card.bonus;
    var maxPv = baseMaxPv(st, card) + card.bonus;
    return { atk: Math.max(0, atk), maxPv: maxPv, pv: clamp(card.pv, 0, maxPv) };
  }

  function neighborsOf(st, owner, slot) {
    var out = [];
    var row = st.players[owner].terrain;
    [-1, 1].forEach(function (d) {
      var s2 = slot + d;
      if (s2 >= 0 && s2 < COLS && row[s2]) out.push({ owner: owner, slot: s2, uid: row[s2] });
    });
    var other = st.players[1 - owner].terrain;
    [-1, 0, 1].forEach(function (d) {
      var s2 = slot + d;
      if (s2 >= 0 && s2 < COLS && other[s2]) out.push({ owner: 1 - owner, slot: s2, uid: other[s2] });
    });
    return out;
  }

  /* Même série pour le bonus d'animé, Métamorphose (Copie) comprise. */
  function seriesMatch(st, a, b) {
    var sa = normName(def(st, a).series), sb = normName(def(st, b).series);
    if (sa === sb) return true;
    var fa = fam(st, a), fb = fam(st, b);
    if (fa === 'copie') { if (isLeg(st, a)) return true; if (a.copySeries && a.copySeries === sb) return true; }
    if (fb === 'copie') { if (isLeg(st, b)) return true; if (b.copySeries && b.copySeries === sa) return true; }
    return false;
  }

  /* Recalcule les bonus d'adjacence, en ajustant les PV courants. */
  function refreshBonuses(st, silent) {
    var changed = false;
    [0, 1].forEach(function (pi) {
      st.players[pi].terrain.forEach(function (uid, slot) {
        if (!uid) return;
        var card = st.cards[uid];
        var d = def(st, card);
        var count = 0;
        neighborsOf(st, pi, slot).forEach(function (n) {
          var nc = st.cards[n.uid];
          if (!nc.faceUp || !card.faceUp) return;
          if (n.owner !== pi) return; // PROPOSITION : voisins alliés uniquement
          if (seriesMatch(st, card, nc)) count++;
        });
        var newBonus = Math.min(2, count) * 10;
        if (newBonus !== card.bonus) {
          var delta = newBonus - card.bonus;
          card.bonus = newBonus;
          var maxPv = baseMaxPv(st, card) + newBonus;
          if (delta > 0) card.pv = Math.min(maxPv, card.pv + delta);
          else card.pv = Math.min(card.pv, maxPv);
          changed = true;
          if (!silent && newBonus > 0) {
            log(st, 'bonus', d.name + ' : bonus d’animé +' + newBonus + ' ATK/PV (' + def(st, card).series + ').');
          }
        }
      });
    });
    return changed;
  }

  /* ------------------------------------------------------------------ */
  /* Vérifications                                                       */
  /* ------------------------------------------------------------------ */
  function totalCards(st, pi) {
    var p = st.players[pi];
    var t = p.deck.length + p.hand.length;
    p.terrain.forEach(function (u) { if (u) t++; });
    return t;
  }

  function checkEnd(st) {
    if (st.over) return true;
    var d0 = totalCards(st, 0) === 0;
    var d1 = totalCards(st, 1) === 0;
    if (d0 && d1) { st.over = { winner: -1, reason: 'Les deux joueurs n’ont plus de cartes : partie nulle.' }; }
    else if (d0) { st.over = { winner: 1, reason: st.players[0].nom + ' n’a plus aucune carte (terrain, main et pioche vides).' }; }
    else if (d1) { st.over = { winner: 0, reason: st.players[1].nom + ' n’a plus aucune carte (terrain, main et pioche vides).' }; }
    if (st.over) log(st, 'end', st.over.reason);
    return !!st.over;
  }

  function removeCard(st, uid) {
    var card = st.cards[uid];
    if (!card) return;
    var p = st.players[card.owner];
    var s = p.terrain.indexOf(uid);
    if (s >= 0) p.terrain[s] = null;
    delete st.cards[uid];
  }

  /* Barrière psychique Légendaire visible : −10 % sur les attaques normales pour elle et ses alliées. */
  function psychicAura(st, card) {
    return st.players[card.owner].terrain.some(function (u) {
      var x = u && st.cards[u];
      return x && x.faceUp && fam(st, x) === 'psychique' && isLeg(st, x);
    });
  }

  /* Le clone encaisse sa part ; tué seul, il compte comme une carte morte. */
  function hitClone(st, ownerUid, amount) {
    var c = st.cards[ownerUid];
    if (!c || !c.clone) return;
    c.clone.pv -= amount;
    fx(st, { t: 'clonehit', uid: ownerUid, n: amount, at: where(st, ownerUid) });
    if (c.clone.pv <= 0) {
      c.clone = null;
      st.players[c.owner].lost++;
      st.stats.eliminations[1 - c.owner]++;
      log(st, 'ko', 'Le clone de ' + def(st, c).name + ' est détruit (compte comme une carte morte).');
      fx(st, { t: 'cloneko', uid: ownerUid, at: where(st, ownerUid) });
    } else {
      log(st, 'dmg', 'Le clone de ' + def(st, c).name + ' encaisse ' + amount + ' dégâts.');
    }
  }

  /* Passives déclenchées quand la carte source touche sa cible (coups principaux). */
  function onHitPassives(st, srcUid, tgtUid) {
    var src = st.cards[srcUid], t = st.cards[tgtUid];
    if (!src || !t) return;
    var f = fam(st, src), L = isLeg(st, src);
    if (f === 'electricite') { if (st.rng() < (L ? 0.35 : 0.2)) applyStatus(st, tgtUid, 'para'); }
    else if (f === 'feu') applyStatus(st, tgtUid, 'burn', { dmg: L ? 12 : 8 });
    else if (f === 'glace') applyStatus(st, tgtUid, 'freeze', { pct: L ? 0.25 : 0.15 });
    else if (f === 'poison') {
      var x = Math.round(stats(st, t).atk * (L ? 0.25 : 0.2));
      if (x > 0 && t.faceUp) {
        t.flatAtk = (t.flatAtk || 0) - x; src.flatAtk = (src.flatAtk || 0) + x;
        log(st, 'abil', 'Morsure : ' + def(st, src).name + ' draine ' + x + ' ATK à ' + def(st, t).name + '.');
        fx(st, { t: 'drain', from: where(st, tgtUid), to: where(st, srcUid), n: x });
      }
      if (st.rng() < (L ? 0.1 : 0.05)) applyStatus(st, tgtUid, 'para');
    }
  }

  /* Dégâts. Renvoie le montant appliqué.
     opts.kind : 'attack' (attaque normale), 'ability' (capacité), 'effect' (statut, flammes…).
     opts.pierce : ignore tout (Tir de précision, flammes) ; opts.noReduce : ignore les réductions (Incisif). */
  function damage(st, targetUid, amount, sourceUid, opts) {
    opts = opts || {};
    var card = st.cards[targetUid];
    if (!card) return 0;
    if (!where(st, targetUid)) return 0;   // une carte revenue en main ou dans la pioche ne subit plus rien
    var kind = opts.kind || (sourceUid ? 'ability' : 'effect');
    var d = def(st, card);
    var src = sourceUid ? st.cards[sourceUid] : null;
    var dmg = Math.max(0, Math.round(amount));
    var at = where(st, targetUid);
    if (!opts.pierce) {
      var tf = fam(st, card);
      if (!opts.noReduce) {
        if (card.shieldUntil >= st.turnNo) dmg = Math.round(dmg * (1 - card.shield));
        if (tf === 'rempart') dmg = Math.round(dmg * (isLeg(st, card) ? 0.7 : 0.8));
        if (opts.taunt) dmg = Math.round(dmg * (1 - opts.taunt));
        if (kind === 'ability' && tf === 'psychique') dmg = Math.round(dmg * (isLeg(st, card) ? 0.5 : 0.65));
        if (kind === 'attack' && psychicAura(st, card)) dmg = Math.round(dmg * 0.9);
      }
      if (kind === 'attack' && tf === 'invocateur' && !card.guardUsed && dmg > 0) {
        card.guardUsed = true;
        var absorbed = isLeg(st, card) ? dmg : Math.round(dmg * 0.5);
        dmg -= absorbed;
        log(st, 'abil', 'Familier gardien : ' + d.name + ' absorbe ' + absorbed + ' dégâts.');
        fx(st, { t: 'guard', uid: targetUid, at: at });
      }
      if ((kind === 'attack' || kind === 'ability') && card.clone && card.clone.pv > 0 && dmg > 0) {
        var part = Math.ceil(dmg * 0.5);
        dmg -= part;
        hitClone(st, targetUid, part);
      }
    }
    if (dmg <= 0) { fx(st, { t: 'hit', uid: targetUid, n: 0, at: at, kind: kind }); return 0; }
    if (card.pv - dmg <= 0 && fam(st, card) === 'regeneration' && isLeg(st, card) && !card.undyingUsed && card.pv > 1) {
      card.undyingUsed = true;
      dmg = card.pv - 1;
      log(st, 'abil', 'Increvable : ' + d.name + ' survit à 1 PV.');
      fx(st, { t: 'undying', uid: targetUid, at: at });
    }
    var s = stats(st, card);
    card.pv -= dmg;
    st.stats.degats[card.owner] += dmg;
    st.lastDamageTurn = st.turnNo;
    fx(st, { t: 'hit', uid: targetUid, n: dmg, at: at, kind: kind, fam: src ? (famAny(st, src) || '') : '' });
    if (src) {
      if (canonName(def(st, src).name) === 'angel devil') {
        var soinAngel = Math.round(dmg * 0.5);
        var sm = stats(st, src);
        src.pv = Math.min(sm.maxPv, src.pv + soinAngel);
        log(st, 'soin', 'Angel Devil se soigne de ' + soinAngel + ' PV (50 % des dégâts infligés).');
        fx(st, { t: 'heal', uid: sourceUid, n: soinAngel, at: where(st, sourceUid) });
      }
    }
    if (card.pv > 0) {
      if (src && opts.primary) onHitPassives(st, sourceUid, targetUid);
      /* Électricité (passive de la cible) : paralyse la carte qui lui inflige des dégâts. */
      if (src && kind !== 'effect' && fam(st, card) === 'electricite' && src.faceUp && st.cards[sourceUid] && src.owner !== card.owner) {
        if (st.rng() < (isLeg(st, card) ? 0.6 : 0.4)) applyStatus(st, sourceUid, 'para');
      }
    }
    if (card.pv <= 0) {
      log(st, 'ko', d.name + ' est éliminé (' + (d.series) + ').');
      fx(st, { t: 'ko', uid: targetUid, at: at, clone: !!card.clone });
      if (card.clone) log(st, 'ko', 'Son clone disparaît avec lui (ne compte pas comme mort).');
      st.players[card.owner].lost++;
      st.stats.eliminations[1 - card.owner]++;
      /* Guérison sanguinaire : Denji récupère 25 % de ses PV max après une élimination. */
      if (sourceUid && st.cards[sourceUid] && hasTrait(st, st.cards[sourceUid], 'denji')) {
        var killer = st.cards[sourceUid];
        var ks = stats(st, killer);
        var h = heal(st, sourceUid, Math.round(ks.maxPv * 0.25));
        if (h > 0) log(st, 'soin', 'Guérison sanguinaire : ' + displayName(st, killer) + ' récupère ' + h + ' PV.');
      }
      // Mahoraga : mémorise son dernier attaquant.
      [0, 1].forEach(function (pi) {
        st.players[pi].terrain.forEach(function (u) {
          if (!u) return;
          var mc = st.cards[u];
          if (mc.lastAttacker === targetUid) mc.mahoragaTarget = null;
        });
      });
      removeCard(st, targetUid);
      refreshBonuses(st, false);
      checkEnd(st);
    } else {
      log(st, 'dmg', d.name + ' subit ' + dmg + ' dégâts (' + Math.max(0, card.pv) + '/' + s.maxPv + ' PV).');
    }
    return dmg;
  }

  function heal(st, uid, amount) {
    var card = st.cards[uid];
    if (!card) return 0;
    if (hasVenom(card)) { log(st, 'status', def(st, card).name + ' est empoisonné : le soin est bloqué.'); return 0; }
    var s = stats(st, card);
    var before = card.pv;
    card.pv = Math.min(s.maxPv, card.pv + Math.round(amount));
    if (card.pv > before) fx(st, { t: 'heal', uid: uid, n: card.pv - before, at: where(st, uid) });
    return card.pv - before;
  }

  /* ------------------------------------------------------------------ */
  /* Actions                                                             */
  /* ------------------------------------------------------------------ */
  function fail(msg) { return { ok: false, error: msg }; }
  function ok(msg) { return { ok: true, message: msg }; }

  function spend(st) {
    st.actionsLeft--;
    if (st.actionsLeft <= 0) st.actionsLeft = 0;
  }

  function reveal(st, uid) {
    if (st.over) return fail('La partie est terminée.');
    var card = st.cards[uid];
    if (!card) return fail('Carte introuvable.');
    if (card.owner !== st.turnOwner) return fail('Cette carte ne vous appartient pas.');
    if (card.faceUp) return fail('Cette carte est déjà révélée.');
    if (st.actionsLeft <= 0) return fail('Plus de coup disponible.');
    if (imprisoned(st, card)) return fail('Prison de glace : cette carte ne peut pas être retournée ce tour.');
    card.faceUp = true;
    fx(st, { t: 'reveal', uid: uid, at: where(st, uid) });
    log(st, 'reveal', def(st, card).name + ' est révélé.');
    refreshBonuses(st, false);
    onReveal(st, uid);
    revealTriggers(st, uid);
    spend(st);
    checkEnd(st);
    return ok('Carte révélée.');
  }

  function placeFromHand(st, handIndex, slot) {
    if (st.over) return fail('La partie est terminée.');
    var p = st.players[st.turnOwner];
    if (handIndex < 0 || handIndex >= p.hand.length) return fail('Carte en main invalide.');
    if (slot < 0 || slot >= COLS) return fail('Case invalide.');
    if (p.terrain[slot]) return fail('Cette case est occupée.');
    if (st.actionsLeft <= 0) return fail('Plus de coup disponible.');
    var uid = p.hand.splice(handIndex, 1)[0];
    var card = st.cards[uid];
    card.faceUp = true;
    p.terrain[slot] = uid;
    fx(st, { t: 'place', uid: uid, at: { owner: card.owner, slot: slot } });
    log(st, 'pose', def(st, card).name + ' est posé face visible en colonne ' + (slot + 1) + '.');
    refreshBonuses(st, false);
    onReveal(st, uid);
    revealTriggers(st, uid);
    spend(st);
    checkEnd(st);
    return ok('Carte posée.');
  }

  /* Mise en place : le joueur pi choisit les 2 cartes de son terrain à retourner.
     Les choix restent secrets jusqu'à ce que les deux joueurs aient choisi. */
  function setupReveal(st, pi, uids) {
    if (st.over) return fail('La partie est terminée.');
    if (st.phase !== 'setup') return fail('La mise en place est terminée.');
    if (pi !== 0 && pi !== 1) return fail('Joueur invalide.');
    if (st.setup[pi]) return fail('Vos cartes sont déjà choisies.');
    var row = st.players[pi].terrain, list = (uids || []).filter(function (u, k, a) { return a.indexOf(u) === k; });
    var need = Math.min(2, row.filter(Boolean).length);
    if (list.length !== need) return fail('Choisissez ' + need + ' cartes à retourner.');
    if (list.some(function (u) { return row.indexOf(u) < 0; })) return fail('Choisissez des cartes de votre terrain.');
    st.setup[pi] = list;
    log(st, 'p', st.players[pi].nom === 'Vous' ? 'Vous avez choisi vos cartes.' : st.players[pi].nom + ' a choisi ses cartes.');
    if (st.setup[0] && st.setup[1]) finishSetup(st);
    return ok('Choix enregistré.');
  }
  function finishSetup(st) {
    [0, 1].forEach(function (pi) {
      st.setup[pi].forEach(function (u) { var c = st.cards[u]; if (c) { c.faceUp = true; fx(st, { t: 'reveal', uid: u, at: where(st, u) }); } });
    });
    st.phase = 'play';
    refreshBonuses(st, true);
    var first = st.players[st.turnOwner].nom;
    log(st, 'turn', 'Tour 1 — ' + (first === 'Vous' ? 'vous commencez' : first + ' commence') + ' (tirage au sort) avec 1 seul coup.');
    checkFusions(st);
    [0, 1].forEach(function (pi) {
      st.players[pi].terrain.forEach(function (u) { if (u && st.cards[u].faceUp) onReveal(st, u); });
    });
    revealTriggers(st);
    checkEnd(st);
  }

  /* Remplacement : une carte de la main prend la place d'une carte visible, qui part au fond de la pioche. */
  function replaceFromHand(st, handIndex, slot) {
    if (st.over) return fail('La partie est terminée.');
    var p = st.players[st.turnOwner];
    if (handIndex < 0 || handIndex >= p.hand.length) return fail('Carte en main invalide.');
    if (slot < 0 || slot >= COLS) return fail('Case invalide.');
    var oldUid = p.terrain[slot];
    if (!oldUid) return fail('Case vide : posez simplement la carte.');
    var old = st.cards[oldUid];
    if (!old.faceUp) return fail('Seule une carte visible peut être remplacée.');
    if (st.actionsLeft <= 0) return fail('Plus de coup disponible.');
    var why = moveBlocked(st, old);
    if (why) return fail(why);
    var from = where(st, oldUid), oldName = def(st, old).name;
    p.terrain[slot] = null;
    resetCard(st, old);
    p.deck.unshift(oldUid);
    fx(st, { t: 'project', uid: oldUid, at: from });
    var uid = p.hand.splice(handIndex, 1)[0];
    var card = st.cards[uid];
    card.faceUp = true;
    p.terrain[slot] = uid;
    fx(st, { t: 'place', uid: uid, at: { owner: card.owner, slot: slot } });
    log(st, 'pose', def(st, card).name + ' remplace ' + oldName + ' en colonne ' + (slot + 1) + ' ; ' + oldName + ' part au fond de la pioche.');
    refreshBonuses(st, false);
    onReveal(st, uid);
    revealTriggers(st, uid);
    if (draw(st, p === st.players[0] ? 0 : 1, true)) log(st, 'draw', p.nom + ' pioche une carte gratuitement (main : ' + p.hand.length + ').');
    spend(st);
    checkEnd(st);
    return ok('Carte remplacée.');
  }

  function attack(st, attackerUid, targetUid) {
    if (st.over) return fail('La partie est terminée.');
    var a = st.cards[attackerUid], t = st.cards[targetUid];
    if (!a || !t) return fail('Carte introuvable.');
    if (a.owner !== st.turnOwner) return fail('Cette carte ne vous appartient pas.');
    if (!a.faceUp) return fail('Une carte cachée ne peut pas attaquer.');
    if (a.attacked) return fail('Cette carte a déjà attaqué ce tour.');
    if (a.lockedUntil >= st.turnNo) return fail('Cette carte est verrouillée pour ce tour.');
    if (paralysed(st, a)) return fail('Cette carte est paralysée : elle ne peut pas attaquer ce tour.');
    if (imprisoned(st, a)) return fail('Prison de glace : cette carte ne peut pas attaquer ce tour.');
    if (st.actionsLeft <= 0) return fail('Plus de coup disponible.');
    var why = attackBlocked(st, attackerUid, targetUid);
    if (why) return fail(why);
    a.attacked = true;
    strike(st, attackerUid, targetUid, 1);
    spend(st);
    checkEnd(st);
    return ok('Attaque résolue.');
  }

  /* Raison pour laquelle a ne peut pas viser t par une attaque normale (ou null). */
  function attackBlocked(st, aUid, tUid) {
    var a = st.cards[aUid], t = st.cards[tUid];
    if (!a || !t) return 'Carte introuvable.';
    if (t.owner === a.owner) return 'Une carte ne peut pas attaquer un allié.';
    if (!t.faceUp) return 'Une carte cachée ne peut pas être attaquée.';
    var dist = Math.abs(slotOf(st, aUid) - slotOf(st, tUid));
    if (dist > attackRange(st, a)) return attackRange(st, a) > 1
      ? 'Cible hors de portée : deux colonnes d’écart au maximum.'
      : 'Cible hors de portée : même colonne ou colonne adjacente uniquement.';
    if (dist !== 0 && fam(st, t) === 'vol' && fam(st, a) !== 'tireur') return 'Défense aérienne : cette carte ne peut être attaquée que depuis la colonne d’en face.';
    return null;
  }

  /* Provocation active (Dur à cuire) dans le camp owner. */
  function findTaunter(st, owner) {
    var out = null;
    st.players[owner].terrain.forEach(function (u) {
      var x = u && st.cards[u];
      if (!out && x && x.faceUp && x.taunt && x.taunt.until >= st.turnNo) out = u;
    });
    return out;
  }

  /* Une frappe : attaque normale, Combo ou Ordre tactique (mul = part de l'ATK). */
  function strike(st, aUid, tUid, mul, label) {
    var a = st.cards[aUid], t = st.cards[tUid];
    var atk = stats(st, a).atk * mul;
    var aSlot = slotOf(st, aUid);
    var dist = Math.abs(aSlot - slotOf(st, tUid));
    var aname = def(st, a).name;
    if (dist === 2 && fam(st, a) === 'tireur' && !isLeg(st, a)) atk *= 0.75;
    if (a.ambush && fam(st, a) === 'assassin') {
      atk *= isLeg(st, a) ? 1.5 : 1.3;
      log(st, 'abil', 'Embuscade : ' + aname + ' frappe à +' + (isLeg(st, a) ? 50 : 30) + ' %.');
      fx(st, { t: 'ambush', uid: aUid, at: where(st, aUid) });
    }
    a.ambush = false;
    if (a.doubleNext) { atk *= 2; a.doubleNext = false; log(st, 'abil', 'Ailes démoniaques : dégâts doublés.'); }

    var tauntRed = 0, taunter = findTaunter(st, t.owner);
    if (taunter) {
      if (taunter !== tUid) {
        log(st, 'abil', 'Dur à cuire : ' + def(st, st.cards[taunter]).name + ' s’interpose à la place de ' + def(st, t).name + '.');
        fx(st, { t: 'taunt', uid: taunter, at: where(st, taunter), from: where(st, tUid) });
        tUid = taunter; t = st.cards[tUid];
      }
      tauntRed = t.taunt.red; t.taunt = null;
    }
    var tSlot = slotOf(st, tUid), tOwner = t.owner;
    fx(st, { t: 'strike', from: where(st, aUid), to: where(st, tUid), fam: famAny(st, a) || '', big: mul >= 1 });

    var dodge = dodgeOf(st, t);
    if (dodge > 0 && st.rng() < dodge) {
      log(st, 'miss', def(st, t).name + ' esquive l’attaque (' + Math.round(dodge * 100) + ' %).');
      fx(st, { t: 'dodge', uid: tUid, at: where(st, tUid) });
      return;
    }
    log(st, 'attaque', aname + (label ? ' — ' + label : '') + ' attaque ' + def(st, t).name + ' (' + Math.round(atk) + ' dégâts).');
    t.lastAttacker = aUid;
    damage(st, tUid, atk, aUid, { kind: 'attack', primary: true, taunt: tauntRed });

    /* Explosif : les voisines visibles de la cible sont touchées aussi. */
    if (st.cards[aUid] && fam(st, a) === 'explosifs') {
      var r = isLeg(st, a) ? 0.4 : 0.25, splash = Math.round(stats(st, a).atk * r);
      [tSlot - 1, tSlot + 1].forEach(function (s2) {
        var u = s2 >= 0 && s2 < COLS ? st.players[tOwner].terrain[s2] : null;
        if (u && st.cards[u] && st.cards[u].faceUp) {
          fx(st, { t: 'splash', at: { owner: tOwner, slot: s2 } });
          damage(st, u, splash, aUid, { kind: 'attack' });
        }
      });
    }
    /* Riposte (Lame) : la cible survit à une attaque venue de la colonne d'en face. */
    var tc = st.cards[tUid];
    if (tc && st.cards[aUid] && fam(st, tc) === 'lame' && tSlot === aSlot) {
      var rp = Math.round(stats(st, tc).atk * (isLeg(st, tc) ? 0.5 : 0.3));
      log(st, 'abil', 'Riposte : ' + def(st, tc).name + ' renvoie ' + rp + ' dégâts.');
      fx(st, { t: 'strike', from: where(st, tUid), to: where(st, aUid), fam: 'lame', riposte: true });
      damage(st, aUid, rp, tUid, { kind: 'ability' });
    }
    /* Le clone attaque avec son utilisateur. */
    var a2 = st.cards[aUid];
    if (a2 && a2.clone && a2.clone.pv > 0 && st.cards[tUid]) {
      log(st, 'abil', 'Le clone de ' + aname + ' attaque aussi (' + a2.clone.atk + ' dégâts).');
      fx(st, { t: 'strike', from: where(st, aUid), to: where(st, tUid), fam: 'clone' });
      damage(st, tUid, a2.clone.atk, aUid, { kind: 'attack' });
    }

    // Mahoraga : si Megumi survit à une attaque, il prépare sa riposte.
    if (st.cards[aUid] && canonName(def(st, st.cards[aUid]).name) === 'megumi fushiguro') {
      var mg = st.cards[aUid];
      mg.mahoraga = true; mg.mahoragaTarget = tUid;
    }
    if (st.cards[tUid] && canonName(def(st, st.cards[tUid]).name) === 'megumi fushiguro') {
      var mg2 = st.cards[tUid];
      mg2.mahoraga = true; mg2.mahoragaTarget = aUid;
    }
    // Sukuna « Échange » : déclenchement passif sous 16 % de PV après avoir survécu.
    if (st.cards[tUid] && canonName(def(st, st.cards[tUid]).name) === 'sukuna') tryEchange(st, tUid);
  }

  function tryEchange(st, uid) {
    var c = st.cards[uid];
    if (!c || !c.lastAttacker || !st.cards[c.lastAttacker]) return;
    var used = c.usedAbil.echange || 0;
    if (used >= 2) return;
    var s = stats(st, c);
    if (c.pv <= 0 || c.pv / s.maxPv >= 0.16) return;
    var a = st.cards[c.lastAttacker];
    var sa = stats(st, a);
    var pc = c.pv / s.maxPv, pa = Math.max(0, Math.min(1, a.pv / sa.maxPv));
    c.pv = Math.round(pa * s.maxPv);
    a.pv = Math.round(pc * sa.maxPv);
    c.usedAbil.echange = used + 1;
    log(st, 'abil', 'Échange : ' + def(st, c).name + ' et ' + def(st, a).name + ' inversent leurs pourcentages de PV.');
  }

  function moveBlocked(st, c) {
    if (burning(c)) return def(st, c).name + ' brûle : elle ne peut être ni déplacée ni remplacée.';
    if (imprisoned(st, c) && c.prison.full) return 'Prison de glace : ' + def(st, c).name + ' ne peut pas se déplacer ce tour.';
    return null;
  }

  function moveSwap(st, uidA, uidB) {
    if (st.over) return fail('La partie est terminée.');
    var a = st.cards[uidA], b = st.cards[uidB];
    if (!a || !b) return fail('Carte introuvable.');
    if (a.owner !== st.turnOwner || b.owner !== st.turnOwner) return fail('Seules vos cartes se déplacent.');
    if (!a.faceUp || !b.faceUp) return fail('Les deux cartes doivent être visibles.');
    if (st.actionsLeft <= 0) return fail('Plus de coup disponible.');
    var mb = moveBlocked(st, a) || moveBlocked(st, b);
    if (mb) return fail(mb);
    var sa = slotOf(st, uidA), sbb = slotOf(st, uidB);
    var row = st.players[a.owner].terrain;
    row[sa] = uidB; row[sbb] = uidA;
    fx(st, { t: 'move', uid: uidA, at: { owner: a.owner, slot: sbb }, from: { owner: a.owner, slot: sa } });
    fx(st, { t: 'move', uid: uidB, at: { owner: a.owner, slot: sa }, from: { owner: a.owner, slot: sbb } });
    log(st, 'move', def(st, a).name + ' et ' + def(st, b).name + ' échangent leurs places.');
    refreshBonuses(st, false);
    spend(st);
    return ok('Déplacement effectué.');
  }

  function moveSingle(st, uid, slot) {
    if (st.over) return fail('La partie est terminée.');
    var card = st.cards[uid];
    if (!card) return fail('Carte introuvable.');
    if (card.owner !== st.turnOwner) return fail('Cette carte ne vous appartient pas.');
    var p = st.players[card.owner];
    if (!card.faceUp) return fail('La carte doit être visible.');
    if (slot < 0 || slot >= COLS || p.terrain[slot]) return fail('Case cible occupée.');
    if (st.actionsLeft <= 0) return fail('Plus de coup disponible.');
    var mb1 = moveBlocked(st, card);
    if (mb1) return fail(mb1);
    var s = p.terrain.indexOf(uid);
    p.terrain[s] = null; p.terrain[slot] = uid;
    fx(st, { t: 'move', uid: uid, at: { owner: card.owner, slot: slot }, from: { owner: card.owner, slot: s } });
    log(st, 'move', def(st, card).name + ' rejoint la colonne ' + (slot + 1) + '.');
    refreshBonuses(st, false);
    spend(st);
    return ok('Déplacement effectué.');
  }

  function draw(st, playerIndex, silent) {
    var p = st.players[playerIndex == null ? st.turnOwner : playerIndex];
    if (!p.deck.length) return null;
    var uid = p.deck.pop();
    p.hand.push(uid);
    if (!silent) log(st, 'draw', p.nom + ' pioche une carte (main : ' + p.hand.length + ').');
    return uid;
  }

  function drawAction(st) {
    if (st.over) return fail('La partie est terminée.');
    if (st.actionsLeft <= 0) return fail('Plus de coup disponible.');
    if (!st.players[st.turnOwner].deck.length) return fail('Pioche vide.');
    draw(st);
    spend(st);
    return ok('Carte piochée.');
  }

  /* Déclenchements automatiques à la révélation / pose (Reze, etc.). */
  function revealTriggers(st, onlyUid) {
    var pi = st.turnOwner;
    [0, 1].forEach(function (owner) {
      st.players[owner].terrain.forEach(function (uid, slot) {
        if (!uid || (onlyUid && uid !== onlyUid)) return;
        var c = st.cards[uid];
        if (!c.faceUp) return;
        var d = def(st, c);
        if (canonName(d.name) !== 'reze') return;
        if (c.usedAbil.janedoe) return;
        c.usedAbil.janedoe = 1;
        // Cible : carte ennemie visible la plus proche (colonne), égalité -> la plus à gauche.
        var best = null;
        st.players[1 - owner].terrain.forEach(function (tu, ts) {
          if (!tu) return;
          var tc = st.cards[tu];
          if (!tc.faceUp) return;
          var dist = Math.abs(ts - slot);
          if (!best || dist < best.dist || (dist === best.dist && ts < best.slot)) best = { uid: tu, dist: dist, slot: ts };
        });
        if (best) {
          log(st, 'abil', 'Jane Doe : ' + d.name + ' frappe ' + def(st, st.cards[best.uid]).name + ' pour 80 dégâts.');
          damage(st, best.uid, 80, uid);
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Capacités actives                                                   */
  /* ------------------------------------------------------------------ */
  function abilityState(st, uid, key) {
    var c = st.cards[uid];
    if (!c) return null;
    var list = abilitiesFor(def(st, c));
    for (var i = 0; i < list.length; i++) if (list[i].key === key) return { ab: list[i], used: c.usedAbil[key] || 0 };
    return null;
  }

  function useAbility(st, uid, key, targetUid, cell, target2) {
    if (st.over) return fail('La partie est terminée.');
    var c = st.cards[uid];
    if (!c) return fail('Carte introuvable.');
    if (c.owner !== st.turnOwner) return fail('Cette carte ne vous appartient pas.');
    if (!c.faceUp) return fail('La carte doit être révélée.');
    if (st.actionsLeft <= 0) return fail('Plus de coup disponible.');
    var info = abilityState(st, uid, key);
    if (!info) return fail('Capacité inconnue.');
    var ab = info.ab;
    if (info.used >= ab.uses) return fail('Capacité épuisée.');
    var name = def(st, c).name;
    if (imprisoned(st, c) && c.prison.full) return fail('Prison de glace : pas de capacité ce tour.');
    if (ab.fam) {
      var chk = checkFamilyTarget(st, uid, ab, targetUid, cell, target2);
      if (chk) return fail(chk);
      var r = useFamilyAbility(st, uid, ab, targetUid, cell, target2);
      if (r) return fail(r);
      c = st.cards[uid];
      if (c) c.usedAbil[key] = info.used + 1;
      refreshBonuses(st, true);
      spend(st);
      checkEnd(st);
      return ok(ab.nom + ' utilisée.');
    }

    if (ab.cible === 'ennemi' && !targetUid) return fail('Choisissez une cible.');
    if (ab.cible === 'allie' && !targetUid) return fail('Choisissez un allié.');
    if (ab.cible === 'case' && !cell) return fail('Choisissez une case.');
    if (targetUid) {
      var t = st.cards[targetUid];
      if (!t) return fail('Cible introuvable.');
      if (ab.cible === 'ennemi' && t.owner === c.owner) return fail('La cible doit être ennemie.');
      if (ab.cible === 'allie' && t.owner !== c.owner) return fail('La cible doit être alliée.');
      if (ab.cible === 'ennemi' && !t.faceUp) return fail('La cible doit être visible.');
    }

    fx(st, { t: 'cast', uid: uid, at: where(st, uid), nom: ab.nom });
    switch (key) {
      case 'frappe': {
        var dmg = Math.round(stats(st, c).atk * (ab.mult || 0.8));
        log(st, 'abil', name + ' — ' + ab.nom + ' : ' + dmg + ' dégâts.');
        damage(st, targetUid, dmg, uid);
        break;
      }
      case 'garde': {
        c.shield = ab.reduction; c.shieldUntil = st.turnNo + 1;
        log(st, 'abil', name + ' — Garde : dégâts subis réduits de ' + Math.round(ab.reduction * 100) + ' %.');
        break;
      }
      case 'soin': {
        var h = heal(st, targetUid, ab.soin);
        log(st, 'abil', name + ' — Second souffle : +' + h + ' PV à ' + def(st, st.cards[targetUid]).name + '.');
        break;
      }
      case 'esquive': {
        c.dodge = ab.esquive; c.dodgeUntil = st.turnNo + 1;
        log(st, 'abil', name + ' — Esquive : ' + Math.round(ab.esquive * 100) + ' % jusqu’à votre prochain tour.');
        break;
      }
      case 'analyse': {
        draw(st); log(st, 'abil', name + ' — Analyse : une carte piochée.');
        break;
      }
      case 'adrenaline': {
        c.atkMul *= 1.5; c.buffUntil = st.turnNo; // jusqu'à la fin du tour
        log(st, 'abil', name + ' — Poussée d’adrénaline : ATK +50 % ce tour.');
        break;
      }
      case 'ailes': {
        c.doubleNext = true;
        log(st, 'abil', 'Angel Devil — Ailes démoniaques : prochaine attaque doublée.');
        break;
      }
      case 'clivage': {
        var targets = neighborsOf(st, c.owner, slotOf(st, uid)).filter(function (n) {
          var nc = st.cards[n.uid];
          return nc && n.owner !== c.owner && nc.faceUp;
        });
        if (!targets.length) return fail('Aucune carte ennemie visible adjacente.');
        var each = Math.ceil(250 / targets.length);
        log(st, 'abil', 'Sukuna — Clivage : 250 dégâts répartis, ' + each + ' par cible (' + targets.length + ' cibles).');
        targets.slice().forEach(function (n) { damage(st, n.uid, each, uid); });
        break;
      }
      case 'echange': {
        var s = stats(st, c);
        if (c.pv / s.maxPv >= 0.16) return fail('Sukuna doit être sous 16 % de PV.');
        if (!c.lastAttacker || !st.cards[c.lastAttacker]) return fail('Aucun dernier attaquant valide.');
        tryEchange(st, uid);
        break;
      }
      case 'invocation': {
        c.invoked += 1; c.pvMul *= 1.5;
        var nm = baseMaxPv(st, c);
        c.pv = Math.min(nm, Math.round(c.pv * 1.5));
        log(st, 'abil', 'Megumi — Invocation ' + c.invoked + '/4 : +50 % de stats de base.');
        break;
      }
      case 'manipulation': {
        // Deux cartes ennemies visibles adjacentes s'attaquent mutuellement.
        var foes = [];
        st.players[1 - c.owner].terrain.forEach(function (u, s2) { if (u && st.cards[u].faceUp) foes.push({ uid: u, slot: s2 }); });
        var pair = null;
        for (var i = 0; i < foes.length && !pair; i++)
          for (var j = i + 1; j < foes.length; j++)
            if (Math.abs(foes[i].slot - foes[j].slot) === 1) { pair = [foes[i], foes[j]]; break; }
        if (!pair) return fail('Aucune paire de cartes ennemies adjacentes.');
        var A = st.cards[pair[0].uid], B = st.cards[pair[1].uid];
        var a1 = stats(st, A).atk, a2 = stats(st, B).atk;
        log(st, 'abil', 'Yoru — Manipulation : ' + def(st, A).name + ' et ' + def(st, B).name + ' s’attaquent mutuellement.');
        damage(st, pair[1].uid, a1, pair[0].uid);
        if (st.cards[pair[0].uid]) damage(st, pair[0].uid, a2, pair[1].uid);
        break;
      }
      case 'kamehameha': {
        if (ab.cible === 'ennemi' && st.cards[targetUid].owner === c.owner) return fail('La cible doit être ennemie.');
        var ss = stats(st, c);
        var frac = ss.pv / ss.maxPv;
        var base = Math.round(ss.atk * (0.5 + frac));
        var zone = [targetUid];
        neighborsOf(st, st.cards[targetUid].owner, slotOf(st, targetUid)).forEach(function (n) {
          if (n.owner === st.cards[targetUid].owner && zone.indexOf(n.uid) < 0) zone.push(n.uid);
        });
        log(st, 'abil', 'Goku — Kamehameha : ' + base + ' dégâts sur ' + zone.length + ' carte(s).');
        zone.slice().forEach(function (u) { if (st.cards[u]) damage(st, u, base, uid); });
        break;
      }
      case 'controle': {
        var tc = st.cards[targetUid];
        if (tc.owner === c.owner) return fail('La cible doit être ennemie.');
        var tslot = slotOf(st, targetUid);
        var tp = st.players[tc.owner];
        tp.terrain[tslot] = null;
        tc.owner = c.owner;
        resetCard(st, tc);
        st.players[c.owner].deck.unshift(targetUid); // bas de la pioche = index 0
        log(st, 'abil', 'Makima — Contrôle : ' + def(st, tc).name + ' rejoint le bas de votre pioche (propriété rendue en fin de partie).');
        refreshBonuses(st, false);
        checkEnd(st);
        break;
      }
      case 'verrou': {
        var tv = st.cards[targetUid];
        tv.lockedUntil = st.turnNo + 1;
        neighborsOf(st, tv.owner, slotOf(st, targetUid)).forEach(function (n) {
          if (n.owner === tv.owner) st.cards[n.uid].lockedUntil = st.turnNo + 1;
        });
        if (def(st, c).rarity === 'mythic') c.lockedUntil = st.turnNo + 1;
        log(st, 'abil', 'Gogeta — Verrouillage : ' + def(st, tv).name + ' et ses voisines ne peuvent pas attaquer au tour suivant.');
        break;
      }
      case 'amaterasu': {
        if (cell.owner < 0 || cell.owner > 1 || cell.slot < 0 || cell.slot >= COLS) return fail('Case invalide.');
        st.flames.push({ owner: cell.owner, slot: cell.slot });
        log(st, 'abil', 'Itachi — Amaterasu : les flammes brûlent la colonne ' + (cell.slot + 1) +
          ' du terrain ' + (cell.owner === c.owner ? 'allié' : 'adverse') + ' (25 dégâts à la fin de chaque tour).');
        break;
      }
      default:
        return fail('Capacité non implémentée.');
    }

    if (st.cards[uid]) st.cards[uid].usedAbil[key] = info.used + 1;
    refreshBonuses(st, true);
    spend(st);
    checkEnd(st);
    return ok(ab.nom + ' utilisée.');
  }

  /* ---------- capacités de famille ---------- */
  function enemiesInRow(st, owner) {
    var out = [];
    st.players[owner].terrain.forEach(function (u, s2) { if (u) out.push({ uid: u, slot: s2 }); });
    return out;
  }
  /* Cibles possibles d'une capacité : { kind, uids, cells }. */
  function abilityTargets(st, uid, ab, stage1) {
    var c = st.cards[uid];
    if (!c || !ab) return { kind: 'none', uids: [], cells: [] };
    var me = c.owner, foe = 1 - me, mySlot = slotOf(st, uid), out = [];
    if (ab.cible === 'soi' || ab.cible === 'auto' || ab.cible === 'auto-ennemis') return { kind: 'none', uids: [], cells: [] };
    if (ab.cible === 'case') {
      var cells = [];
      for (var s2 = 0; s2 < COLS; s2++) {
        if (ab.fam) cells.push({ owner: foe, slot: s2 });
        else { cells.push({ owner: 0, slot: s2 }); cells.push({ owner: 1, slot: s2 }); }
      }
      return { kind: 'cell', uids: [], cells: cells };
    }
    if (ab.cible === 'allie') {
      st.players[me].terrain.forEach(function (u) { if (u && (st.cards[u].faceUp || !ab.fam)) out.push(u); });
      return { kind: 'ally', uids: out, cells: [] };
    }
    if (ab.cible === 'allie-puis-ennemi') {
      if (stage1) return { kind: 'enemy', uids: strikeTargets(st, stage1), cells: [] };
      st.players[me].terrain.forEach(function (u) {
        var x = u && st.cards[u];
        if (x && u !== uid && x.faceUp && x.attacked && !paralysed(st, x) && !imprisoned(st, x) && strikeTargets(st, u).length) out.push(u);
      });
      return { kind: 'ally', uids: out, cells: [] };
    }
    /* ennemi */
    if (ab.key === 'combo') return { kind: 'enemy', uids: strikeTargets(st, uid), cells: [] };
    st.players[foe].terrain.forEach(function (u, s2) {
      if (!u) return;
      var x = st.cards[u];
      if (!x.faceUp && ab.cible !== 'ennemi-cache') return;
      if (!ab.fam) { out.push(u); return; }
      var dist = Math.abs(s2 - mySlot);
      var range = ab.portee === 'libre' ? 99 : (typeof ab.portee === 'number' ? ab.portee : attackRange(st, c));
      if (dist <= range) out.push(u);
    });
    return { kind: 'enemy', uids: out, cells: [] };
  }
  /* Cibles d'une frappe (attaque normale sans tenir compte du drapeau « a déjà attaqué »). */
  function strikeTargets(st, uid) {
    var c = st.cards[uid];
    if (!c) return [];
    var out = [];
    st.players[1 - c.owner].terrain.forEach(function (u) { if (u && !attackBlocked(st, uid, u)) out.push(u); });
    return out;
  }
  function checkFamilyTarget(st, uid, ab, targetUid, cell, target2) {
    var T = abilityTargets(st, uid, ab);
    if (T.kind === 'none') return null;
    if (T.kind === 'cell') {
      if (!cell) return 'Choisissez une case.';
      if (!T.cells.some(function (x) { return x.owner === cell.owner && x.slot === cell.slot; })) return 'Case invalide : visez une case adverse.';
      return null;
    }
    if (!targetUid) return T.kind === 'ally' ? 'Choisissez une alliée.' : 'Choisissez une cible.';
    if (T.uids.indexOf(targetUid) < 0) return 'Cible invalide pour ' + ab.nom + '.';
    if (ab.cible === 'allie-puis-ennemi') {
      if (!target2) return 'Choisissez la cible de l’attaque.';
      if (strikeTargets(st, targetUid).indexOf(target2) < 0) return 'Cible hors de portée de cette alliée.';
    }
    if (ab.key === 'combo' && (paralysed(st, st.cards[uid]) || imprisoned(st, st.cards[uid]))) return 'Cette carte ne peut pas attaquer ce tour.';
    return null;
  }

  function useFamilyAbility(st, uid, ab, targetUid, cell, target2) {
    var c = st.cards[uid], L = isLeg(st, c), name = def(st, c).name, atk = stats(st, c).atk;
    var t = targetUid ? st.cards[targetUid] : null;
    var tname = t ? def(st, t).name : '';
    var me = c.owner;
    fx(st, { t: 'cast', uid: uid, at: where(st, uid), nom: ab.nom, fam: ab.fam });
    switch (ab.key) {
      case 'tirprecision': {
        var d1 = Math.round(atk * (L ? 1 : 0.7));
        log(st, 'abil', name + ' — Tir de précision : ' + d1 + ' dégâts sur ' + tname + ', rien ne l’arrête.');
        fx(st, { t: 'shot', from: where(st, uid), to: where(st, targetUid), fam: 'tireur' });
        damage(st, targetUid, d1, uid, { kind: 'ability', pierce: true, primary: true });
        break;
      }
      case 'decharge': {
        var tSlot = slotOf(st, targetUid), tOwner = t.owner;
        var main = Math.round(atk * (L ? 0.7 : 0.5)), sec = Math.round(atk * (L ? 0.4 : 0.25));
        var side = [];
        [tSlot - 1, tSlot + 1].forEach(function (s2) {
          var u = s2 >= 0 && s2 < COLS ? st.players[tOwner].terrain[s2] : null;
          if (u && st.cards[u].faceUp) side.push(u);
        });
        side.sort(function (x, y) { return st.cards[x].pv - st.cards[y].pv; });
        side = side.slice(0, L ? 2 : 1);
        log(st, 'abil', name + ' — Décharge en chaîne : ' + main + ' sur ' + tname + (side.length ? ', ' + sec + ' sur ' + side.length + ' voisine(s)' : '') + '.');
        fx(st, { t: 'chain', path: [where(st, uid), where(st, targetUid)].concat(side.map(function (u) { return where(st, u); })) });
        damage(st, targetUid, main, uid, { kind: 'ability', primary: true });
        if (st.cards[targetUid]) { if (L || st.rng() < 0.1) applyStatus(st, targetUid, 'para'); }
        side.forEach(function (u) {
          if (!st.cards[u]) return;
          damage(st, u, sec, uid, { kind: 'ability' });
          if (L && st.cards[u] && st.rng() < 0.1) applyStatus(st, u, 'para');
        });
        break;
      }
      case 'murflammes': {
        var occ = st.players[cell.owner].terrain[cell.slot];
        st.fires.push({ owner: cell.owner, slot: cell.slot, dmg: L ? 20 : 15, left: L ? 6 : 4, src: name });
        log(st, 'abil', name + ' — Mur de flammes sur la colonne ' + (cell.slot + 1) + ' adverse : ' + (L ? 20 : 15) + ' dégâts à la fin de chaque tour pendant ' + (L ? 6 : 4) + ' tours.');
        fx(st, { t: 'firewall', at: { owner: cell.owner, slot: cell.slot }, from: where(st, uid) });
        if (L && occ && st.cards[occ] && st.cards[occ].faceUp) damage(st, occ, Math.round(atk * 0.5), uid, { kind: 'ability' });
        break;
      }
      case 'prison': {
        t.prison = { until: nextTurnOf(st, t.owner), full: L };
        log(st, 'abil', name + ' — Prison de glace : ' + (t.faceUp ? tname + (L ? ' ne pourra ni attaquer, ni utiliser de capacité, ni se déplacer' : ' ne pourra pas attaquer') + ' à son prochain tour.' : 'la carte cachée ne pourra pas être retournée à son prochain tour.'));
        fx(st, { t: 'ice', at: where(st, targetUid), from: where(st, uid) });
        break;
      }
      case 'incisif': {
        var ts = stats(st, t), base = atk;
        if (ts.pv < ts.maxPv / 2) base *= L ? 1.5 : 1.25;
        log(st, 'abil', name + ' — Incisif sur ' + tname + ' (' + Math.round(base) + ', réductions ignorées).');
        fx(st, { t: 'slash', from: where(st, uid), to: where(st, targetUid) });
        damage(st, targetUid, base, uid, { kind: 'ability', noReduce: true, primary: true });
        if (st.cards[uid]) { st.cards[uid].atkBoost = (st.cards[uid].atkBoost || 0) + (L ? 0.2 : 0.1); log(st, 'buff', name + ' gagne +' + (L ? 20 : 10) + ' % d’ATK pour la partie.'); }
        break;
      }
      case 'durcuire': {
        c.taunt = { until: st.turnNo + 1, red: L ? 0.8 : 0.6 };
        log(st, 'abil', name + ' — Dur à cuire : la prochaine attaque adverse sera pour elle, −' + (L ? 80 : 60) + ' % de dégâts.');
        fx(st, { t: 'shield', at: where(st, uid) });
        break;
      }
      case 'combo': {
        fx(st, { t: 'afterimage', at: where(st, uid) });
        strike(st, uid, targetUid, L ? 0.8 : 0.5, 'Combo');
        break;
      }
      case 'ordre': {
        var ally = targetUid;
        log(st, 'abil', name + ' — Ordre tactique : ' + tname + ' attaque de nouveau à ' + (L ? 100 : 50) + ' %.');
        fx(st, { t: 'order', from: where(st, uid), to: where(st, ally) });
        strike(st, ally, target2, L ? 1 : 0.5, 'Ordre tactique');
        break;
      }
      case 'venin': {
        var dv = Math.round(atk * (L ? 0.35 : 0.2));
        log(st, 'abil', name + ' — Venin sur ' + tname + ' (' + dv + ' dégâts).');
        fx(st, { t: 'venom', from: where(st, uid), to: where(st, targetUid) });
        damage(st, targetUid, dv, uid, { kind: 'ability', primary: true });
        if (st.cards[targetUid]) applyStatus(st, targetUid, 'venom', { seq: L ? [6, 18, 54] : [4, 8, 16] });
        break;
      }
      case 'clonage': {
        if (c.clone) return 'Un clone est déjà en jeu.';
        var cs = stats(st, c), r = L ? 1 : 0.5;
        c.clone = { atk: Math.round(cs.atk * r), maxPv: Math.max(1, Math.round(cs.maxPv * r)), pv: Math.max(1, Math.round(cs.maxPv * r)) };
        log(st, 'abil', name + ' — Clonage : un clone (' + c.clone.maxPv + ' PV / ' + c.clone.atk + ' ATK) se place devant elle.');
        fx(st, { t: 'clone', at: where(st, uid) });
        break;
      }
      case 'soigneurregen': {
        var amount = Math.round(stats(st, c).maxPv * (L ? 0.7 : 0.35));
        if (L) { clearStatus(t); t.prison = null; log(st, 'abil', name + ' — Soigneur retire tous les statuts de ' + tname + '.'); fx(st, { t: 'cleanse', at: where(st, targetUid) }); }
        var hh = heal(st, targetUid, amount);
        log(st, 'abil', name + ' — Soigneur : +' + hh + ' PV à ' + tname + '.');
        break;
      }
      case 'execution': {
        var es = stats(st, t), low = es.pv < es.maxPv * 0.3;
        fx(st, { t: 'slash', from: where(st, uid), to: where(st, targetUid), exec: true });
        if (low && L && def(st, t).rarity !== 'special') {
          log(st, 'abil', name + ' — Exécution : ' + tname + ' est éliminé.');
          damage(st, targetUid, 99999, uid, { kind: 'ability', pierce: true, primary: true });
        } else {
          var de = Math.round(atk * (low ? 1.5 : (L ? 0.7 : 0.5)));
          log(st, 'abil', name + ' — Exécution sur ' + tname + ' (' + de + ' dégâts).');
          damage(st, targetUid, de, uid, { kind: 'ability', primary: true });
        }
        break;
      }
      case 'projection': {
        var dp = Math.round(atk * (L ? 0.9 : 0.7));
        log(st, 'abil', name + ' — Projection sur ' + tname + ' (' + dp + ' dégâts).');
        fx(st, { t: 'psy', from: where(st, uid), to: where(st, targetUid) });
        damage(st, targetUid, dp, uid, { kind: 'ability', primary: true });
        var pt = st.cards[targetUid];
        if (pt) {
          var from = where(st, targetUid);
          var row = st.players[pt.owner].terrain;
          row[row.indexOf(targetUid)] = null;
          resetCard(st, pt);
          st.players[pt.owner].deck.unshift(targetUid);
          log(st, 'abil', tname + ' est renvoyé au fond de la pioche adverse (ne compte pas comme mort).');
          fx(st, { t: 'project', at: from });
          refreshBonuses(st, false);
        }
        break;
      }
      case 'bigboom': {
        var bSlot = slotOf(st, targetUid), bOwner = t.owner;
        var r1 = L ? 1.2 : 1.1, r2 = L ? 0.75 : 0.65, r3 = L ? 0.33 : 0.25;
        log(st, 'abil', name + ' — Big Boom sur ' + tname + ' !');
        fx(st, { t: 'boom', at: where(st, targetUid), from: where(st, uid) });
        var around = [];
        [bSlot - 1, bSlot + 1].forEach(function (s2) {
          var u = s2 >= 0 && s2 < COLS ? st.players[bOwner].terrain[s2] : null;
          if (u) around.push(u);
        });
        damage(st, targetUid, Math.round(atk * r1), uid, { kind: 'ability', primary: true });
        around.forEach(function (u) {
          var x = st.cards[u]; if (!x) return;
          if (x.faceUp) { damage(st, u, Math.round(atk * r2), uid, { kind: 'ability' }); return; }
          x.faceUp = true;
          log(st, 'reveal', 'Le souffle retourne ' + def(st, x).name + '.');
          fx(st, { t: 'reveal', uid: u, at: where(st, u) });
          refreshBonuses(st, false);
          onReveal(st, u);
          revealTriggers(st, u);
          if (st.cards[u]) damage(st, u, Math.round(atk * r3), uid, { kind: 'ability' });
        });
        if (st.cards[uid]) {
          var self = Math.round(stats(st, st.cards[uid]).maxPv * (L ? 0.1 : 0.2));
          log(st, 'abil', 'Contrecoup : ' + name + ' perd ' + self + ' PV.');
          damage(st, uid, self, null, { kind: 'effect', pierce: true });
        }
        break;
      }
      case 'attaqueaerienne': {
        var da = Math.round(atk * (L ? 1.2 : 1));
        log(st, 'abil', name + ' — Attaque aérienne sur ' + tname + ' (' + da + ' dégâts).');
        fx(st, { t: 'dive', from: where(st, uid), to: where(st, targetUid) });
        damage(st, targetUid, da, uid, { kind: 'ability', primary: true });
        break;
      }
      default: return 'Capacité non implémentée.';
    }
    return null;
  }

  /* Une carte qui quitte le terrain sans mourir (Projection, Contrôle) perd ses statuts et bonus. */
  function resetCard(st, c) {
    var d = def(st, c);
    c.faceUp = false; c.bonus = 0; c.status = {}; c.prison = null; c.taunt = null; c.clone = null;
    c.atkMul = 1; c.pvMul = 1; c.buffUntil = 0; c.attacked = false; c.ambush = false;
    /* Renvoyée dans la pioche, la carte ne se régénère pas : elle garde ses dégâts (bonus de PV retirés). */
    c.pv = Math.max(1, Math.min(c.pv, d.pv)); c.lockedUntil = 0;
  }

  /* Assimilation : Denji entre sur le terrain -> fusion sur SA case.
     Pochita reste Pochita tant que Denji n'est pas sur le terrain. */
  function findCard(st, pi, key) {
    var out = { terrain: null, hand: null };
    st.players[pi].terrain.forEach(function (u, slot) {
      if (u && st.cards[u] && !out.terrain && canonName(def(st, st.cards[u]).name) === key) out.terrain = { uid: u, slot: slot };
    });
    st.players[pi].hand.forEach(function (u, idx) {
      if (!out.hand && st.cards[u] && canonName(def(st, st.cards[u]).name) === key) out.hand = { uid: u, idx: idx };
    });
    return out;
  }

  function checkFusions(st) {
    [0, 1].forEach(function (pi) {
      var p = st.players[pi];
      var den = findCard(st, pi, 'denji');
      if (!den.terrain) return;                    // Denji doit être entré sur le terrain
      var denCard = st.cards[den.terrain.uid];
      if (!denCard || denCard.fusion) return;

      var po = findCard(st, pi, 'pochita');
      var src = po.terrain || po.hand;             // Pochita en main ou sur le terrain
      if (!src) return;
      var host = st.cards[src.uid];
      if (!host || host.fusion) return;

      /* La carte Pochita quitte sa place et prend celle de Denji. */
      if (po.terrain) p.terrain[po.terrain.slot] = null;
      else p.hand.splice(po.hand.idx, 1);
      p.terrain[den.terrain.slot] = src.uid;

      host.flatPv += 60;
      host.flatAtk += 30;
      host.fusion = true;
      host.traits = host.traits || [];
      if (host.traits.indexOf('denji') < 0) host.traits.push('denji');
      host.faceUp = !!denCard.faceUp;              // hérite de la visibilité de la case de Denji
      host.attacked = denCard.attacked;

      delete st.cards[den.terrain.uid];            // Denji est absorbé (pas compté comme mort)
      log(st, 'abil', 'Assimilation : Pochita et Denji fusionnent en Chainsaw Man sur la case de Denji' +
        (host.faceUp ? ' (colonne ' + (den.terrain.slot + 1) + ')' : ' (face cachée)') +
        ' — +60 PV, +30 ATK, aptitudes de Denji conservées.');
      refreshBonuses(st, false);
    });
  }

  /* Déclenchements à la révélation d'une carte (SSJ Blue passif). */
  function onReveal(st, uid) {
    var c = st.cards[uid];
    if (!c) return;
    var k = canonName(def(st, c).name);
    var f0 = fam(st, c);
    if (f0 === 'assassin') c.ambush = true;
    if (f0 === 'copie' && !isLeg(st, c) && !c.copySeries) {
      var sl = slotOf(st, uid), row0 = st.players[c.owner].terrain;
      [sl - 1, sl + 1].some(function (s2) {
        var u = s2 >= 0 && s2 < COLS ? row0[s2] : null;
        if (u && st.cards[u] && st.cards[u].faceUp) {
          c.copySeries = normName(def(st, st.cards[u]).series);
          log(st, 'abil', 'Métamorphose : ' + def(st, c).name + ' compte comme ' + def(st, st.cards[u]).series + '.');
          return true;
        }
        return false;
      });
      refreshBonuses(st, false);
    }
    if (k === 'gogeta' && !c.ssjDone) {
      c.ssjDone = true;
      c.atkMul *= 2; c.pvMul *= 2;
      c.buffUntil = st.turnNo + 6;
      var sm = stats(st, c);
      c.pv = Math.min(sm.maxPv, Math.round(c.pv * 2));
      log(st, 'abil', 'SSJ Blue (passif) : Gogeta double ses stats de base pour trois tours.');
    }
    checkFusions(st);
  }

  /* Abilités automatiques déclenchées au début du tour du propriétaire. */
  function startOfTurnTriggers(st, pi) {
    st.players[pi].terrain.forEach(function (uid) {
      if (!uid) return;
      var c = st.cards[uid];
      if (!c.faceUp) return;
      var d = def(st, c);
      if (c.buffUntil && st.turnNo > c.buffUntil) {
        // Fin d'un bonus temporaire : retour aux stats de base.
        c.atkMul = 1; c.pvMul = 1; c.buffUntil = 0;
        var s = stats(st, c);
        c.pv = Math.min(c.pv, s.maxPv);
        log(st, 'buff', 'Fin du bonus temporaire de ' + d.name + '.');
      }
      var f1 = fam(st, c);
      if (f1 === 'soigneur') {
        var sl1 = slotOf(st, uid), amt = isLeg(st, c) ? 10 : 5;
        [sl1 - 1, sl1 + 1].forEach(function (s2) {
          var u = s2 >= 0 && s2 < COLS ? st.players[pi].terrain[s2] : null;
          if (u && st.cards[u] && st.cards[u].faceUp) {
            var hh = heal(st, u, amt);
            if (hh > 0) log(st, 'soin', 'Aura apaisante : +' + hh + ' PV à ' + def(st, st.cards[u]).name + '.');
          }
        });
      }
      if (f1 === 'regeneration') {
        var hr = heal(st, uid, Math.round(stats(st, c).maxPv * (isLeg(st, c) ? 0.1 : 0.06)));
        if (hr > 0) log(st, 'soin', 'Régénération : ' + d.name + ' récupère ' + hr + ' PV.');
      }
      if (c.mahoraga && c.mahoragaTarget && st.cards[c.mahoragaTarget] && where(st, c.mahoragaTarget)) {
        log(st, 'abil', 'Megumi — Mahoraga riposte et élimine ' + def(st, st.cards[c.mahoragaTarget]).name + '.');
        var tgt = c.mahoragaTarget;
        c.mahoraga = false; c.mahoragaTarget = null;
        damage(st, tgt, 99999, uid, { pierce: true });
      } else if (c.mahoraga) { c.mahoraga = false; c.mahoragaTarget = null; }
    });
    refreshBonuses(st, false);
  }

  /* Remplissage des cases vides (carte morte ou renvoyée) au début du tour de leur propriétaire :
     le joueur choisit pour chaque case une carte de sa main ou la carte du dessus de sa pioche (gratuit, face cachée). */
  function refillTerrain(st, pi) {
    var p = st.players[pi], slots = [];
    for (var s = 0; s < COLS; s++) if (!p.terrain[s]) slots.push(s);
    st.refill = null;
    if (!slots.length || (!p.hand.length && !p.deck.length)) return;
    if (!p.hand.length) {            // main vide : la pioche remplit sans choix
      slots.forEach(function (sl) { refillOne(st, pi, sl, 'deck'); });
      afterRefill(st, pi);
      return;
    }
    st.refill = { owner: pi, slots: slots };
    var nb = slots.length + ' case' + (slots.length > 1 ? 's' : '') + ' vide' + (slots.length > 1 ? 's' : '');
    log(st, 'refill', (p.nom === 'Vous' ? 'Vous devez remplir ' : p.nom + ' doit remplir ') + nb + ' : carte de la main ou de la pioche.');
  }
  function refillOne(st, pi, slot, from, handIndex) {
    var p = st.players[pi], uid = null;
    if (from === 'hand') uid = p.hand.splice(handIndex, 1)[0];
    else uid = p.deck.pop();
    if (!uid) return false;
    var c = st.cards[uid];
    c.faceUp = false; c.bonus = 0;
    p.terrain[slot] = uid;
    fx(st, { t: 'place', uid: uid, at: { owner: pi, slot: slot } });
    log(st, 'refill', (p.nom === 'Vous' ? 'Vous remplissez' : p.nom + ' remplit') + ' la colonne ' + (slot + 1) + ' depuis ' + (from === 'hand' ? (p.nom === 'Vous' ? 'votre main' : 'sa main') : (p.nom === 'Vous' ? 'votre pioche' : 'sa pioche')) + ' (face cachée).');
    return true;
  }
  function afterRefill(st, pi) {
    st.refill = null;
    refreshBonuses(st, false);
    checkFusions(st);
    checkEnd(st);
  }
  function refillAction(st, slot, from, handIndex) {
    var R = st.refill;
    if (!R) return fail('Aucune case à remplir.');
    if (R.owner !== st.turnOwner) return fail('Ce n’est pas à vous de remplir.');
    if (R.slots.indexOf(slot) < 0) return fail('Cette case n’est pas à remplir.');
    var p = st.players[R.owner];
    if (from === 'hand') { if (!(handIndex >= 0 && handIndex < p.hand.length)) return fail('Carte en main invalide.'); }
    else if (from === 'deck') { if (!p.deck.length) return fail('Pioche vide : choisissez une carte de votre main.'); }
    else return fail('Choix invalide.');
    refillOne(st, R.owner, slot, from, handIndex);
    R.slots = R.slots.filter(function (x) { return x !== slot; });
    if (!R.slots.length || (!p.hand.length && !p.deck.length)) afterRefill(st, R.owner);
    else if (!p.hand.length) { R.slots.slice().forEach(function (sl) { refillOne(st, R.owner, sl, 'deck'); }); afterRefill(st, R.owner); }
    return ok('Case remplie.');
  }

  /* Amaterasu : 25 dégâts à la carte présente sur chaque case en flammes. */
  function applyFlames(st) {
    if (!st.flames || !st.flames.length) return;
    st.flames.slice().forEach(function (f) {
      var uid = st.players[f.owner].terrain[f.slot];
      if (!uid) return;
      log(st, 'flame', 'Amaterasu : 25 dégâts à ' + def(st, st.cards[uid]).name + ' (colonne ' + (f.slot + 1) + ').');
      damage(st, uid, 25, null, { pierce: true });
    });
  }

  /* Brûlure et Venin : à la fin de chacun des tours de la carte touchée. */
  function tickStatuses(st, pi) {
    st.players[pi].terrain.slice().forEach(function (uid) {
      var c = uid && st.cards[uid];
      if (!c || !c.status) return;
      var nm = def(st, c).name, s = c.status;
      if (s.burn && s.burn.left > 0) {
        s.burn.left--;
        log(st, 'flame', 'Brûlure : ' + s.burn.dmg + ' dégâts à ' + nm + '.');
        fx(st, { t: 'burntick', at: where(st, uid) });
        damage(st, uid, s.burn.dmg, null, { kind: 'effect', pierce: true });
      }
      c = st.cards[uid];
      if (c && c.status.venom && c.status.venom.length) {
        var maxPv = stats(st, c).maxPv, tot = 0;
        c.status.venom.forEach(function (v) { if (v.i < v.seq.length) { tot += Math.ceil(maxPv * v.seq[v.i] / 100); v.i++; } });
        c.status.venom = c.status.venom.filter(function (v) { return v.i < v.seq.length; });
        if (tot > 0) {
          log(st, 'status', 'Venin : ' + tot + ' dégâts à ' + nm + '.');
          fx(st, { t: 'venomtick', at: where(st, uid) });
          damage(st, uid, tot, null, { kind: 'effect', pierce: true });
        }
      }
    });
  }
  /* Mur de flammes : la carte visible de la case brûle à la fin de chaque tour. */
  function applyFires(st) {
    if (!st.fires || !st.fires.length) return;
    st.fires.forEach(function (f) {
      var uid = st.players[f.owner].terrain[f.slot];
      f.left--;
      if (!uid || !st.cards[uid] || !st.cards[uid].faceUp) return;
      log(st, 'flame', 'Mur de flammes : ' + f.dmg + ' dégâts à ' + def(st, st.cards[uid]).name + ' (colonne ' + (f.slot + 1) + ').');
      fx(st, { t: 'burntick', at: { owner: f.owner, slot: f.slot } });
      damage(st, uid, f.dmg, null, { kind: 'effect', pierce: true });
    });
    st.fires = st.fires.filter(function (f) { return f.left > 0; });
  }

  function endTurn(st) {
    if (st.over) return fail('La partie est terminée.');
    var me = st.turnOwner;
    applyFlames(st);
    if (st.over) return ok('Fin de tour.');
    tickStatuses(st, me);
    if (st.over) return ok('Fin de tour.');
    applyFires(st);
    if (st.over) return ok('Fin de tour.');
    st.players[me].terrain.forEach(function (uid) { if (uid) st.cards[uid].attacked = false; });
    st.turnOwner = 1 - st.turnOwner;
    st.turnNo++;
    st.actionsLeft = 2;
    var p = st.players[st.turnOwner];
    checkFusions(st);
    startOfTurnTriggers(st, st.turnOwner);
    refillTerrain(st, st.turnOwner);
    if (!st.refill) checkFusions(st);
    p.terrain.forEach(function (uid) { if (uid) st.cards[uid].attacked = false; });
    log(st, 'turn', 'Tour ' + Math.ceil(st.turnNo / 2) + ' — ' + p.nom + ' (' + st.actionsLeft + ' coups).');
    st.stats.tours++;
    if (!st.over && st.turnNo - st.lastDamageTurn > 40) {
      st.over = { winner: -1, reason: 'Aucun dégât infligé pendant 20 tours : nulle (limite anti-blocage du prototype).' };
      log(st, 'end', st.over.reason);
    }
    checkEnd(st);
    return ok('Au tour de ' + p.nom + '.');
  }

  /* Réinitialise les drapeaux de fin de tour du joueur courant. */
  function endOfPlayerTurn(st) {
    st.players[st.turnOwner].terrain.forEach(function (uid) { if (uid) st.cards[uid].attacked = false; });
  }

  /* ------------------------------------------------------------------ */
  /* Aides pour l'interface et l'IA                                      */
  /* ------------------------------------------------------------------ */
  function legalTargetsForAttack(st, uid) {
    var c = st.cards[uid];
    if (!c) return [];
    var out = [];
    st.players[1 - c.owner].terrain.forEach(function (u) {
      if (u && !attackBlocked(st, uid, u)) out.push(u);
    });
    return out;
  }

  function canAct(st, uid) {
    var c = st.cards[uid];
    if (!c) return false;
    return c.owner === st.turnOwner && c.faceUp && !c.attacked && c.lockedUntil < st.turnNo && !paralysed(st, c) && !imprisoned(st, c);
  }

  global.Arena = {
    COLS: COLS,
    RULES: RULES,
    INTERPRETATIONS: INTERPRETATIONS,
    RARITY_FR: RARITY_FR,
    RARITY_ORDER: RARITY_ORDER,
    newGame: newGame,
    stats: stats,
    def: def,
    abilitiesFor: abilitiesFor,
    passivesFor: passivesFor,
    passivesOf: function (st, uid) { var c = st.cards[uid]; return c ? passivesFor(def(st, c)) : []; },
    displayName: displayName,
    dodgeOf: dodgeOf,
    hasTrait: hasTrait,
    flames: function (st) { return st.flames || []; },
    fires: function (st) { return st.fires || []; },
    FAMILIES: FAMILIES,
    SETTINGS: SETTINGS,
    familyOfDef: familyOfDef,
    famOf: function (st, uid) { var c = st.cards[uid]; return c ? familyOfDef(def(st, c)) : null; },
    statusList: statusList,
    insight: insight,
    attackRange: attackRange,
    abilityTargets: abilityTargets,
    strikeTargets: strikeTargets,
    paralysed: paralysed,
    imprisoned: imprisoned,
    findTaunter: findTaunter,
    canMove: function (st, uid) { var c = st.cards[uid]; return !!c && !moveBlocked(st, c); },
    canReveal: function (st, uid) { var c = st.cards[uid]; return !!c && !imprisoned(st, c); },
    burning: burning,
    abilitiesOf: function (st, uid) { var c = st.cards[uid]; return c ? abilitiesFor(def(st, c)) : []; },
    slotOf: slotOf,
    neighborsOf: neighborsOf,
    legalTargetsForAttack: legalTargetsForAttack,
    canAct: canAct,
    totalCards: totalCards,
    refreshBonuses: refreshBonuses,
    actions: {
      reveal: reveal, placeFromHand: placeFromHand, replaceFromHand: replaceFromHand, setupReveal: setupReveal, refill: refillAction, attack: attack,
      moveSwap: moveSwap, moveSingle: moveSingle, drawAction: drawAction,
      useAbility: useAbility, endTurn: endTurn
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = global.Arena;
})(typeof globalThis !== 'undefined' ? globalThis : this);
