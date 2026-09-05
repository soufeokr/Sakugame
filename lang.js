/* ============================================================
   🌐 SAKUGAME — TRANSLATIONS (lang.js)
   ------------------------------------------------------------
   Languages: English (default), Français, Español.
   • The site auto-detects the browser language (EN fallback).
   • The visitor can switch with the flag buttons in the settings
     panel (just above the music volume). The choice is saved
     (localStorage 'sakugame_lang').

   HOW IT WORKS (simple!):
   • I18N = dictionary. KEY = the exact English text shown on
     the site, VALUE = the FR / ES text.
   • A MutationObserver watches the page: every new text is
     looked up in I18N and swapped on the fly. Strings NOT in
     the dictionary simply stay in English (character names,
     anime titles, game names… on purpose — no overtranslation).
   • Assembled sentences with a name inside (e.g. "Toto's board")
     are handled by I18N_PAT patterns via tP(id, {n:'Toto'}).

   TO EDIT: add / fix a line in I18N below, keep the English key
   EXACTLY as it appears in the code (case + punctuation).
   ============================================================ */
// Localized anime titles (generated from AniList synonyms, tools/title_picks.js)
var ANIME_TITLE_IDX = {"shingeki no kyojin":{"fr":"L’Attaque des Titans","es":"Ataque a los Titanes"},"attack on titan":{"fr":"L’Attaque des Titans","es":"Ataque a los Titanes"},"snk":{"fr":"L’Attaque des Titans","es":"Ataque a los Titanes"},"aot":{"fr":"L’Attaque des Titans","es":"Ataque a los Titanes"},"ataque a los titanes":{"fr":"L’Attaque des Titans","es":"Ataque a los Titanes"},"ataque dos titas":{"fr":"L’Attaque des Titans","es":"Ataque a los Titanes"},"l'attacco dei giganti":{"fr":"L’Attaque des Titans","es":"Ataque a los Titanes"},"l'attaque des titans":{"fr":"L’Attaque des Titans","es":"Ataque a los Titanes"},"ataque de titas":{"fr":"L’Attaque des Titans","es":"Ataque a los Titanes"},"atak tytanow":{"fr":"L’Attaque des Titans","es":"Ataque a los Titanes"},"hagane no renkinjutsushi fullmetal alchemist":{"es":"Fullmetal Alchemist: Brotherhood"},"fullmetal alchemist brotherhood":{"es":"Fullmetal Alchemist: Brotherhood"},"fma":{"es":"Fullmetal Alchemist: Brotherhood"},"fmab":{"es":"Fullmetal Alchemist: Brotherhood"},"hagaren":{"es":"Fullmetal Alchemist: Brotherhood"},"full metal alchemist brotherhood":{"es":"Fullmetal Alchemist: Brotherhood"},"stalowy alchemik misja braci":{"es":"Fullmetal Alchemist: Brotherhood"},"death note":{"fr":"Carnet de la Mort"},"carnet de la mort":{"fr":"Carnet de la Mort"},"kimetsu no yaiba":{"es":"Demon Slayer: Kimetsu no Yaiba"},"demon slayer kimetsu no yaiba":{"es":"Demon Slayer: Kimetsu no Yaiba"},"kny":{"es":"Demon Slayer: Kimetsu no Yaiba"},"kimetsu no yaiba kyoudai no kizuna":{"es":"Demon Slayer: Kimetsu no Yaiba"},"demon slayer kimetsu no yaiba bonds of siblings":{"es":"Demon Slayer: Kimetsu no Yaiba"},"miecz zabojcy demonow kimetsu no yaiba":{"es":"Demon Slayer: Kimetsu no Yaiba"},"guardians de la nit kimetsu no yaiba":{"es":"Demon Slayer: Kimetsu no Yaiba"},"koe no katachi":{"fr":"La Forme de la voix","es":"A Silent Voice"},"a silent voice":{"fr":"La Forme de la voix","es":"A Silent Voice"},"the shape of voice":{"fr":"La Forme de la voix","es":"A Silent Voice"},"a voz do silencio":{"fr":"La Forme de la voix","es":"A Silent Voice"},"a forma da voz":{"fr":"La Forme de la voix","es":"A Silent Voice"},"la forma della voce":{"fr":"La Forme de la voix","es":"A Silent Voice"},"una voz silenciosa":{"fr":"La Forme de la voix","es":"A Silent Voice"},"la forme de la voix":{"fr":"La Forme de la voix","es":"A Silent Voice"},"tylus balsas":{"fr":"La Forme de la voix","es":"A Silent Voice"},"balss forma":{"fr":"La Forme de la voix","es":"A Silent Voice"},"dang hinh thanh am":{"fr":"La Forme de la voix","es":"A Silent Voice"},"sousou no frieren":{"es":"Frieren: Más allá del final del viaje"},"frieren beyond journey's end":{"es":"Frieren: Más allá del final del viaje"},"frieren at the funeral":{"es":"Frieren: Más allá del final del viaje"},"frieren oltre la fine del viaggio":{"es":"Frieren: Más allá del final del viaje"},"frieren e a jornada para o alem":{"es":"Frieren: Más allá del final del viaje"},"frieren nach dem ende der reise":{"es":"Frieren: Más allá del final del viaje"},"frieren mas alla del final del viaje":{"es":"Frieren: Más allá del final del viaje"},"frieren en el funeral":{"es":"Frieren: Más allá del final del viaje"},"frieren u kresu drogi":{"es":"Frieren: Más allá del final del viaje"},"frieren tras finalizar el viaje":{"es":"Frieren: Más allá del final del viaje"},"naruto shippuuden":{"fr":"Naruto: Shippuden","es":"Naruto: Shippuden"},"naruto shippuden":{"fr":"Naruto: Shippuden","es":"Naruto: Shippuden"},"shin seiki evangelion":{"es":"Neon Genesis Evangelion"},"neon genesis evangelion":{"es":"Neon Genesis Evangelion"},"nge":{"es":"Neon Genesis Evangelion"},"eva":{"es":"Neon Genesis Evangelion"},"haikyuu":{"es":"HAIKYU!!"},"haikyu":{"es":"HAIKYU!!"},"high kyuu":{"es":"HAIKYU!!"},"haikyu l'asso del volley":{"es":"HAIKYU!!"},"re zero kara hajimeru isekai seikatsu":{"fr":"Re:ZERO -Starting Life in Another World-","es":"Re Zero"},"re zero starting life in another world":{"fr":"Re:ZERO -Starting Life in Another World-","es":"Re Zero"},"re life in a different world from zero":{"fr":"Re:ZERO -Starting Life in Another World-","es":"Re Zero"},"rezero":{"fr":"Re:ZERO -Starting Life in Another World-","es":"Re Zero"},"re zero":{"fr":"Re:ZERO -Starting Life in Another World-","es":"Re Zero"},"re zero empezar de cero en un mundo diferente":{"fr":"Re:ZERO -Starting Life in Another World-","es":"Re Zero"},"shigatsu wa kimi no uso":{"es":"Your lie in April"},"your lie in april":{"es":"Your lie in April"},"kimiuso":{"es":"Your lie in April"},"bugie d'aprile":{"es":"Your lie in April"},"ylia":{"es":"Your lie in April"},"sekunden in moll":{"es":"Your lie in April"},"code geass hangyaku no lelouch":{"fr":"Code Geass: Lelouch of the Rebellion","es":"Code Geass: Lelouch de la Rebelión"},"code geass lelouch of the rebellion":{"fr":"Code Geass: Lelouch of the Rebellion","es":"Code Geass: Lelouch de la Rebelión"},"code geass lelouch de la rebelion":{"fr":"Code Geass: Lelouch of the Rebellion","es":"Code Geass: Lelouch de la Rebelión"},"shingeki no kyojin season 3 part 2":{"fr":"L'Attaque des Titans Saison 3 Partie 2"},"attack on titan season 3 part 2":{"fr":"L'Attaque des Titans Saison 3 Partie 2"},"snk 3":{"fr":"L'Attaque des Titans Saison 3 Partie 2"},"aot 3":{"fr":"L'Attaque des Titans Saison 3 Partie 2"},"shingeki no kyojin season 3 2019":{"fr":"L'Attaque des Titans Saison 3 Partie 2"},"l'attaco dei giganti 3 parte 2":{"fr":"L'Attaque des Titans Saison 3 Partie 2"},"l'attacco dei giganti terza stagione parte 2":{"fr":"L'Attaque des Titans Saison 3 Partie 2"},"l'attaque des titans saison 3 partie 2":{"fr":"L'Attaque des Titans Saison 3 Partie 2"},"shingeki no kyojin the final season":{"fr":"L'Attaque des Titans Saison Finale"},"attack on titan final season":{"fr":"L'Attaque des Titans Saison Finale"},"snk 4":{"fr":"L'Attaque des Titans Saison Finale"},"aot 4":{"fr":"L'Attaque des Titans Saison Finale"},"shingeki no kyojin 4":{"fr":"L'Attaque des Titans Saison Finale"},"attack on titan season 4":{"fr":"L'Attaque des Titans Saison Finale"},"l'attaque des titans saison finale":{"fr":"L'Attaque des Titans Saison Finale"},"l'attacco dei giganti 4":{"fr":"L'Attaque des Titans Saison Finale"},"l'attacco dei giganti la stagione finale":{"fr":"L'Attaque des Titans Saison Finale"},"kaguya sama wa kokurasetai tensaitachi no renai zunousen":{"fr":"Kaguya-sama : L'Amour est une guerre"},"kaguya sama love is war":{"fr":"Kaguya-sama : L'Amour est une guerre"},"kaguya wants to be confessed to the geniuses' war of love and brains":{"fr":"Kaguya-sama : L'Amour est une guerre"},"kaguya sama wa kokurasetai tensai tachi no renai zunousen":{"fr":"Kaguya-sama : L'Amour est une guerre"},"kaguya sama l'amour est une guerre":{"fr":"Kaguya-sama : L'Amour est une guerre"},"kusuriya no hitorigoto":{"fr":"Les Carnets de l'Apothicaire","es":"Los diarios de la boticaria"},"the apothecary diaries":{"fr":"Les Carnets de l'Apothicaire","es":"Los diarios de la boticaria"},"drugstore soliloquy":{"fr":"Les Carnets de l'Apothicaire","es":"Los diarios de la boticaria"},"les carnets de l'apothicaire":{"fr":"Les Carnets de l'Apothicaire","es":"Los diarios de la boticaria"},"zapiski zielarki":{"fr":"Les Carnets de l'Apothicaire","es":"Los diarios de la boticaria"},"diarios de uma apotecaria":{"fr":"Les Carnets de l'Apothicaire","es":"Los diarios de la boticaria"},"il monologo della speziale":{"fr":"Les Carnets de l'Apothicaire","es":"Los diarios de la boticaria"},"los diarios de la boticaria":{"fr":"Les Carnets de l'Apothicaire","es":"Los diarios de la boticaria"},"die tagebucher der apothekerin":{"fr":"Les Carnets de l'Apothicaire","es":"Los diarios de la boticaria"},"spy family":{"fr":"SPY x FAMILY"},"spy x family":{"fr":"SPY x FAMILY"},"sxf":{"fr":"SPY x FAMILY"},"puella magi madoka magica":{"es":"Puella Magi Madoka Magica"},"mahou shoujo madoka magika":{"es":"Puella Magi Madoka Magica"},"magical girl madoka magica":{"es":"Puella Magi Madoka Magica"},"pmmm":{"es":"Puella Magi Madoka Magica"},"msmm":{"es":"Puella Magi Madoka Magica"},"kono subarashii sekai ni shukufuku wo":{"es":"Konosuba: ¡Bendito sea este maravilloso mundo!"},"konosuba god's blessing on this wonderful world":{"es":"Konosuba: ¡Bendito sea este maravilloso mundo!"},"konosuba":{"es":"Konosuba: ¡Bendito sea este maravilloso mundo!"},"kono subarashii sekai ni syukufuku wo":{"es":"Konosuba: ¡Bendito sea este maravilloso mundo!"},"konosuba as bencaos de deus neste mundo maravilhoso":{"es":"Konosuba: ¡Bendito sea este maravilloso mundo!"},"konosuba sois beni monde merveilleux":{"es":"Konosuba: ¡Bendito sea este maravilloso mundo!"},"konosuba un mundo maravilloso":{"es":"Konosuba: ¡Bendito sea este maravilloso mundo!"},"konosuba bendito sea este maravilloso mundo":{"es":"Konosuba: ¡Bendito sea este maravilloso mundo!"},"sen to chihiro no kamikakushi":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"spirited away":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"le voyage de chihiro":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"la citta incantata":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"el viaje de chihiro":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"chihiros reise ins zauberland":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"spirited away w krainie bogow":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"chihiro szellemorszagban":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"a viagem de chihiro":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"chihiro og heksene":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"henkien katkema":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"chihiro ilmmiid gaskkas":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"vaimudest viidud":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"chihiro og alogin":{"fr":"Le Voyage de Chihiro","es":"El Viaje de Chihiro"},"howl no ugoku shiro":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"howl's moving castle":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"hauru no ugoku shiro":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"das wandelnde schloss":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"el castillo ambulante":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"il castello errante di howl":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"le chateau ambulant":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"ruchomy zamek hauru":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"a vandorlo palota":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"o castelo animado":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"det levende slottet":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"det levande slottet":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"hinn kviki kastali howls":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"el increible castillo vagabundo":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"o castelo andante":{"fr":"Le Château Ambulant","es":"El Castillo Ambulante"},"tensei shitara slime datta ken":{"fr":"Moi, quand je me réincarne en Slime"},"that time i got reincarnated as a slime":{"fr":"Moi, quand je me réincarne en Slime"},"tensura":{"fr":"Moi, quand je me réincarne en Slime"},"vita da slime":{"fr":"Moi, quand je me réincarne en Slime"},"moi quand je me reincarne en slime":{"fr":"Moi, quand je me réincarne en Slime"},"meine wiedergeburt als schleim in einer anderen welt":{"fr":"Moi, quand je me réincarne en Slime"},"ttigraas":{"fr":"Moi, quand je me réincarne en Slime"},"bereinkarnasi malah menjadi slime":{"fr":"Moi, quand je me réincarne en Slime"},"odrodzony jako galareta":{"fr":"Moi, quand je me réincarne en Slime"},"ansatsu kyoushitsu":{"fr":"Assassination Classroom"},"assassination classroom":{"fr":"Assassination Classroom"},"klasa skrytobojcow":{"fr":"Assassination Classroom"},"ore dake level up na ken":{"fr":"Solo Leveling","es":"Solo Leveling"},"solo leveling":{"fr":"Solo Leveling","es":"Solo Leveling"},"na honjaman level up":{"fr":"Solo Leveling","es":"Solo Leveling"},"kimi no suizou wo tabetai":{"fr":"Je veux manger ton pancréas","es":"Quiero Comerme tu Páncreas"},"i want to eat your pancreas":{"fr":"Je veux manger ton pancréas","es":"Quiero Comerme tu Páncreas"},"quiero comerme tu pancreas":{"fr":"Je veux manger ton pancréas","es":"Quiero Comerme tu Páncreas"},"voglio mangiare il tuo pancreas":{"fr":"Je veux manger ton pancréas","es":"Quiero Comerme tu Páncreas"},"je veux manger ton pancreas":{"fr":"Je veux manger ton pancréas","es":"Quiero Comerme tu Páncreas"},"vull menjar me el teu pancrees":{"fr":"Je veux manger ton pancréas","es":"Quiero Comerme tu Páncreas"},"kimisui":{"fr":"Je veux manger ton pancréas","es":"Quiero Comerme tu Páncreas"},"eu quero comer seu pancreas":{"fr":"Je veux manger ton pancréas","es":"Quiero Comerme tu Páncreas"},"chainsaw man reze hen":{"es":"Chainsaw Man - La película: El arco de Reze"},"chainsaw man the movie reze arc":{"es":"Chainsaw Man - La película: El arco de Reze"},"csm reze hen":{"es":"Chainsaw Man - La película: El arco de Reze"},"csm the movie reze arc":{"es":"Chainsaw Man - La película: El arco de Reze"},"chainsaw man o filme arco da reze":{"es":"Chainsaw Man - La película: El arco de Reze"},"chainsaw man la pelicula el arco de reze":{"es":"Chainsaw Man - La película: El arco de Reze"},"chainsaw man il film la storia di reze":{"es":"Chainsaw Man - La película: El arco de Reze"},"kimetsu no yaiba yuukaku hen":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le quartier des plaisirs"},"demon slayer kimetsu no yaiba entertainment district arc":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le quartier des plaisirs"},"kny 2":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le quartier des plaisirs"},"demon slayer kimetsu no yaiba le quartier des plaisirs":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le quartier des plaisirs"},"miecz zabojcy demonow kimetsu no yaiba dzielnica uciech":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le quartier des plaisirs"},"shingeki no kyojin the final season part 2":{"fr":"L'attaque des titans Saison Finale Partie 2"},"attack on titan final season part 2":{"fr":"L'attaque des titans Saison Finale Partie 2"},"l'attaque des titans saison finale partie 2":{"fr":"L'attaque des titans Saison Finale Partie 2"},"shingeki no kyojin the final season 2022":{"fr":"L'attaque des titans Saison Finale Partie 2"},"l'attacco dei giganti 4 parte 2":{"fr":"L'attaque des titans Saison Finale Partie 2"},"mononoke hime":{"fr":"Princesse Mononoké","es":"La Princesa Mononoke"},"princess mononoke":{"fr":"Princesse Mononoké","es":"La Princesa Mononoke"},"la princesa mononoke":{"fr":"Princesse Mononoké","es":"La Princesa Mononoke"},"principessa mononoke":{"fr":"Princesse Mononoké","es":"La Princesa Mononoke"},"prenses mononoke":{"fr":"Princesse Mononoké","es":"La Princesa Mononoke"},"princesse mononoke":{"fr":"Princesse Mononoké","es":"La Princesa Mononoke"},"princesa mononoke":{"fr":"Princesse Mononoké","es":"La Princesa Mononoke"},"a princesa mononoke":{"fr":"Princesse Mononoké","es":"La Princesa Mononoke"},"prinzessin mononoke":{"fr":"Princesse Mononoké","es":"La Princesa Mononoke"},"prinsessan mononoke":{"fr":"Princesse Mononoké","es":"La Princesa Mononoke"},"prinsesse mononoke":{"fr":"Princesse Mononoké","es":"La Princesa Mononoke"},"mononoke prinsessa":{"fr":"Princesse Mononoké","es":"La Princesa Mononoke"},"kimetsu no yaiba mugen ressha hen":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le film : Le train de l'Infini","es":"Guardianes de la Noche: Tren Infinito"},"demon slayer kimetsu no yaiba the movie mugen train":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le film : Le train de l'Infini","es":"Guardianes de la Noche: Tren Infinito"},"kny movie":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le film : Le train de l'Infini","es":"Guardianes de la Noche: Tren Infinito"},"els guardians de la nit el tren infinit":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le film : Le train de l'Infini","es":"Guardianes de la Noche: Tren Infinito"},"guardianes de la noche tren infinito":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le film : Le train de l'Infini","es":"Guardianes de la Noche: Tren Infinito"},"demon slayer mugen treni":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le film : Le train de l'Infini","es":"Guardianes de la Noche: Tren Infinito"},"demon slayer il treno mugen":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le film : Le train de l'Infini","es":"Guardianes de la Noche: Tren Infinito"},"demon slayer kimetsu no yaiba le film le train de l'infini":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le film : Le train de l'Infini","es":"Guardianes de la Noche: Tren Infinito"},"dungeon meshi":{"fr":"Gloutons et Dragons"},"delicious in dungeon":{"fr":"Gloutons et Dragons"},"dungeon food":{"fr":"Gloutons et Dragons"},"dungeon meal":{"fr":"Gloutons et Dragons"},"tragones y mazmorras":{"fr":"Gloutons et Dragons"},"gloutons et dragons":{"fr":"Gloutons et Dragons"},"dunmeshi":{"fr":"Gloutons et Dragons"},"tenki no ko":{"fr":"Les enfants du temps","es":"El Tiempo Contigo"},"weathering with you":{"fr":"Les enfants du temps","es":"El Tiempo Contigo"},"el tiempo contigo":{"fr":"Les enfants du temps","es":"El Tiempo Contigo"},"weathering with you das madchen das die sonne beruhrte":{"fr":"Les enfants du temps","es":"El Tiempo Contigo"},"les enfants du temps":{"fr":"Les enfants du temps","es":"El Tiempo Contigo"},"o tempo com voce":{"fr":"Les enfants du temps","es":"El Tiempo Contigo"},"la ragazza del tempo":{"fr":"Les enfants du temps","es":"El Tiempo Contigo"},"ano hi mita hana no namae wo bokutachi wa mada shiranai":{"es":"AnoHana"},"anohana the flower we saw that day":{"es":"AnoHana"},"anohana":{"es":"AnoHana"},"we still don't know the name of the flower we saw that day":{"es":"AnoHana"},"anohana ancora non conosciamo il nome del fiore che abbiamo visto quel giorno":{"es":"AnoHana"},"go toubun no hanayome":{"es":"Las Quintillizas"},"the quintessential quintuplets":{"es":"Las Quintillizas"},"5 toubun no hanayome":{"es":"Las Quintillizas"},"the five wedded brides":{"es":"Las Quintillizas"},"las quintillizas":{"es":"Las Quintillizas"},"nanatsu no taizai":{"es":"The Seven Deadly Sins"},"the seven deadly sins":{"es":"The Seven Deadly Sins"},"7ds":{"es":"The Seven Deadly Sins"},"bleach sennen kessen hen":{"fr":"Bleach: La guerre sanglante de mille ans"},"bleach thousand year blood war":{"fr":"Bleach: La guerre sanglante de mille ans"},"bleach la guerre sanglante de mille ans":{"fr":"Bleach: La guerre sanglante de mille ans"},"bleach tybw":{"fr":"Bleach: La guerre sanglante de mille ans"},"nhk ni youkoso":{"fr":"Bienvenue dans la NHK"},"welcome to the n h k":{"fr":"Bienvenue dans la NHK"},"welcome to the nhk":{"fr":"Bienvenue dans la NHK"},"bienvenue dans la nhk":{"fr":"Bienvenue dans la NHK"},"yofukashi no uta":{"fr":"Call of the Night","es":"El canto de la noche"},"call of the night":{"fr":"Call of the Night","es":"El canto de la noche"},"song of the night walkers":{"fr":"Call of the Night","es":"El canto de la noche"},"night owl song":{"fr":"Call of the Night","es":"El canto de la noche"},"zew nocy":{"fr":"Call of the Night","es":"El canto de la noche"},"il richiamo della notte":{"fr":"Call of the Night","es":"El canto de la noche"},"el canto de la noche":{"fr":"Call of the Night","es":"El canto de la noche"},"cancoes da noite":{"fr":"Call of the Night","es":"El canto de la noche"},"tongari boushi no atelier":{"fr":"L'Atelier des Sorciers"},"witch hat atelier":{"fr":"L'Atelier des Sorciers"},"atelier of witch hat":{"fr":"L'Atelier des Sorciers"},"atelier spiczastych kapeluszy":{"fr":"L'Atelier des Sorciers"},"l'atelier des sorciers":{"fr":"L'Atelier des Sorciers"},"kusuriya no hitorigoto 2nd season":{"fr":"Les Carnets de l'apothicaire Saison 2","es":"Los diarios de la boticaria temporada 2"},"the apothecary diaries season 2":{"fr":"Les Carnets de l'apothicaire Saison 2","es":"Los diarios de la boticaria temporada 2"},"die tagebucher der apothekerin season 2":{"fr":"Les Carnets de l'apothicaire Saison 2","es":"Los diarios de la boticaria temporada 2"},"les carnets de l'apothicaire saison 2":{"fr":"Les Carnets de l'apothicaire Saison 2","es":"Los diarios de la boticaria temporada 2"},"los diarios de la boticaria temporada 2":{"fr":"Les Carnets de l'apothicaire Saison 2","es":"Los diarios de la boticaria temporada 2"},"dungeon ni deai wo motomeru no wa machigatteiru darou ka":{"es":"Danmachi: ¿Qué Tiene de Malo Intentar Ligar en una Mazmorra?"},"is it wrong to try to pick up girls in a dungeon":{"es":"Danmachi: ¿Qué Tiene de Malo Intentar Ligar en una Mazmorra?"},"danmachi":{"es":"Danmachi: ¿Qué Tiene de Malo Intentar Ligar en una Mazmorra?"},"dungeon ni deai o motomeru no wa machigatte iru darouka familia myth":{"es":"Danmachi: ¿Qué Tiene de Malo Intentar Ligar en una Mazmorra?"},"danmachi e errado tentar pegar garotas numa masmorra":{"es":"Danmachi: ¿Qué Tiene de Malo Intentar Ligar en una Mazmorra?"},"danmachi familia myth":{"es":"Danmachi: ¿Qué Tiene de Malo Intentar Ligar en una Mazmorra?"},"danmachi que tiene de malo intentar ligar en una mazmorra":{"es":"Danmachi: ¿Qué Tiene de Malo Intentar Ligar en una Mazmorra?"},"danmachi e sbagliato cercare di incontrare ragazze in un dungeon":{"es":"Danmachi: ¿Qué Tiene de Malo Intentar Ligar en una Mazmorra?"},"houseki no kuni":{"fr":"L'Ère des Cristaux"},"land of the lustrous":{"fr":"L'Ère des Cristaux"},"l'ere des cristaux":{"fr":"L'Ère des Cristaux"},"das land der juwelen":{"fr":"L'Ère des Cristaux"},"kimetsu no yaiba katanakaji no sato hen":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le village des forgerons"},"demon slayer kimetsu no yaiba swordsmith village arc":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le village des forgerons"},"kny 3":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le village des forgerons"},"demon slayer kimetsu no yaiba le village des forgerons":{"fr":"Demon Slayer: Kimetsu no Yaiba - Le village des forgerons"},"kaijuu 8 gou":{"fr":"Kaiju No. 8"},"kaiju no 8":{"fr":"Kaiju No. 8"},"monster 8":{"fr":"Kaiju No. 8"},"8kaijuu":{"fr":"Kaiju No. 8"},"kaiju no eight":{"fr":"Kaiju No. 8"},"kaiju n 8":{"fr":"Kaiju No. 8"},"summer time render":{"es":"La Isla de las Sombras"},"summer time rendering":{"es":"La Isla de las Sombras"},"summertime render":{"es":"La Isla de las Sombras"},"a ilha das sombras":{"es":"La Isla de las Sombras"},"la isla de las sombras":{"es":"La Isla de las Sombras"},"tajemnica wyspy":{"es":"La Isla de las Sombras"},"bright sun dark shadows":{"es":"La Isla de las Sombras"},"yu yu hakusho ghostfiles":{"fr":"Yu Yu Hakusho"},"yu yu hakusho":{"fr":"Yu Yu Hakusho"},"ghost fighter":{"fr":"Yu Yu Hakusho"},"poltergeist report":{"fr":"Yu Yu Hakusho"},"yyh":{"fr":"Yu Yu Hakusho"},"yu degli spettri":{"fr":"Yu Yu Hakusho"},"great pretender":{"es":"EL GRAN FARSANTE"},"el timador timado":{"es":"EL GRAN FARSANTE"},"el gran farsante":{"es":"EL GRAN FARSANTE"},"grepre":{"es":"EL GRAN FARSANTE"},"hajime no ippo the fighting":{"es":"Espíritu de lucha"},"the first step":{"es":"Espíritu de lucha"},"fighting spirit":{"es":"Espíritu de lucha"},"espiritu de lucha":{"es":"Espíritu de lucha"},"hajime no ippo a luta":{"es":"Espíritu de lucha"},"tonari no totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"my neighbor totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"my neighbour totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"meu amigo totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"mi vecino totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"il mio vicino totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"vecinul totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"mon voisin totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"mein nachbar totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"min nabo totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"min granne totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"magiska aventyr med totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"naapurini totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"nagranninn minn totoro":{"fr":"Mon voisin Totoro","es":"Mi Vecino Totoro"},"violet evergarden movie":{"fr":"Violet Evergarden : Le film"},"violet evergarden the movie":{"fr":"Violet Evergarden : Le film"},"violet evergarden le film":{"fr":"Violet Evergarden : Le film"},"mushoku tensei ii isekai ittara honki dasu":{"es":"Mushoku Tensei II: Reencarnación desde cero"},"mushoku tensei jobless reincarnation season 2":{"es":"Mushoku Tensei II: Reencarnación desde cero"},"mushoku tensei isekai ittara honki dasu 2nd season":{"es":"Mushoku Tensei II: Reencarnación desde cero"},"mushoku tensei ii jobless reincarnation":{"es":"Mushoku Tensei II: Reencarnación desde cero"},"mushoku tensei ii reencarnacion desde cero":{"es":"Mushoku Tensei II: Reencarnación desde cero"},"josee to tora to sakanatachi":{"fr":"Josée, le tigre et les poissons","es":"Josee, el Tigre y los Peces"},"josee the tiger and the fish":{"fr":"Josée, le tigre et les poissons","es":"Josee, el Tigre y los Peces"},"josee to tora to sakana tachi":{"fr":"Josée, le tigre et les poissons","es":"Josee, el Tigre y los Peces"},"josee el tigre y los peces":{"fr":"Josée, le tigre et les poissons","es":"Josee, el Tigre y los Peces"},"josee el tigre i els peixos":{"fr":"Josée, le tigre et les poissons","es":"Josee, el Tigre y los Peces"},"josie der tiger und die fische":{"fr":"Josée, le tigre et les poissons","es":"Josee, el Tigre y los Peces"},"josee le tigre et les poissons":{"fr":"Josée, le tigre et les poissons","es":"Josee, el Tigre y los Peces"},"josee la tigre e i pesci":{"fr":"Josée, le tigre et les poissons","es":"Josee, el Tigre y los Peces"},"majo no takkyuubin":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"kiki's delivery service":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"majotaku":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"witch's express delivery":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"kiki la petite sorciere":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"nicky la aprendiz de bruja":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"o servico de entregas da kiki":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"kiki consegne a domicilio":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"podniebna poczta kiki":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"kikis kleiner lieferservice":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"kikis budservice":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"kikin lahettipalvelu":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"kikis expressbud":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"kiki entregas a domicilio":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"sendi jonusta kiki":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"kiki a aprendiz de feiticeira":{"fr":"Kiki la petite sorcière","es":"Nicky, la Aprendiz de Bruja"},"ookami kodomo no ame to yuki":{"fr":"Les Enfants loups, Ame & Yuki","es":"Los Niños Lobo"},"wolf children":{"fr":"Les Enfants loups, Ame & Yuki","es":"Los Niños Lobo"},"the wolf children ame and yuki":{"fr":"Les Enfants loups, Ame & Yuki","es":"Los Niños Lobo"},"los ninos lobo":{"fr":"Les Enfants loups, Ame & Yuki","es":"Los Niños Lobo"},"les enfants loups ame yuki":{"fr":"Les Enfants loups, Ame & Yuki","es":"Los Niños Lobo"},"wilcze dzieci":{"fr":"Les Enfants loups, Ame & Yuki","es":"Los Niños Lobo"},"ame e yuki i bambini lupo":{"fr":"Les Enfants loups, Ame & Yuki","es":"Los Niños Lobo"},"criancas lobo":{"fr":"Les Enfants loups, Ame & Yuki","es":"Los Niños Lobo"},"vargbarnen":{"fr":"Les Enfants loups, Ame & Yuki","es":"Los Niños Lobo"},"kimetsu no yaiba mugen ressha hen tv":{"fr":"Demon Slayer: Kimetsu no Yaiba: Le train de l'Infini"},"demon slayer kimetsu no yaiba mugen train arc":{"fr":"Demon Slayer: Kimetsu no Yaiba: Le train de l'Infini"},"demon slayer kimetsu no yaiba le train de l'infini":{"fr":"Demon Slayer: Kimetsu no Yaiba: Le train de l'Infini"},"demon slayer kimetsu no yaiba season 2":{"fr":"Demon Slayer: Kimetsu no Yaiba: Le train de l'Infini"},"ghost in the shell koukaku kidoutai":{"fr":"Ghost in the Shell"},"ghost in the shell":{"fr":"Ghost in the Shell"},"gits":{"fr":"Ghost in the Shell"},"ghost in the shell o fantasma do futuro":{"fr":"Ghost in the Shell"},"duch w pancerzu":{"fr":"Ghost in the Shell"},"pancelba zart szellem":{"fr":"Ghost in the Shell"},"suzumiya haruhi no shoushitsu":{"fr":"La Disparition de Haruhi Suzumiya"},"the disappearance of haruhi suzumiya":{"fr":"La Disparition de Haruhi Suzumiya"},"la disparition de haruhi suzumiya":{"fr":"La Disparition de Haruhi Suzumiya"},"la scomparsa di haruhi suzumiya":{"fr":"La Disparition de Haruhi Suzumiya"},"hotaru no haka":{"fr":"Le Tombeau des lucioles","es":"La Tumba de las Luciérnagas"},"grave of the fireflies":{"fr":"Le Tombeau des lucioles","es":"La Tumba de las Luciérnagas"},"tombstone for fireflies":{"fr":"Le Tombeau des lucioles","es":"La Tumba de las Luciérnagas"},"le tombeau des lucioles":{"fr":"Le Tombeau des lucioles","es":"La Tumba de las Luciérnagas"},"la tumba de las luciernagas":{"fr":"Le Tombeau des lucioles","es":"La Tumba de las Luciérnagas"},"o tumulo dos vagalumes":{"fr":"Le Tombeau des lucioles","es":"La Tumba de las Luciérnagas"},"die letzten gluhwurmchen":{"fr":"Le Tombeau des lucioles","es":"La Tumba de las Luciérnagas"},"una tomba per le lucciole":{"fr":"Le Tombeau des lucioles","es":"La Tumba de las Luciérnagas"},"eldflugornas grav":{"fr":"Le Tombeau des lucioles","es":"La Tumba de las Luciérnagas"},"szentjanosbogarak sirja":{"fr":"Le Tombeau des lucioles","es":"La Tumba de las Luciérnagas"},"la tomba delle lucciole":{"fr":"Le Tombeau des lucioles","es":"La Tumba de las Luciérnagas"},"ildfluens grav":{"fr":"Le Tombeau des lucioles","es":"La Tumba de las Luciérnagas"},"o tumulo dos pirilampos":{"fr":"Le Tombeau des lucioles","es":"La Tumba de las Luciérnagas"},"otonari no tenshi sama ni itsunomanika dame ningen ni sareteita ken":{"fr":"Chouchouté par l’ange d’à côté"},"the angel next door spoils me rotten":{"fr":"Chouchouté par l’ange d’à côté"},"meu anjo de vizinha me mima demais":{"fr":"Chouchouté par l’ange d’à côté"},"chouchoute par l'ange d'a cote":{"fr":"Chouchouté par l’ange d’à côté"},"aku dimanjakan tetanggaku yang seperti malaikat":{"fr":"Chouchouté par l’ange d’à côté"},"vanitas no carte":{"fr":"Les Mémoires de Vanitas"},"the case study of vanitas":{"fr":"Les Mémoires de Vanitas"},"vanitas no karte":{"fr":"Les Mémoires de Vanitas"},"les memoires de vanitas":{"fr":"Les Mémoires de Vanitas"},"kuroshitsuji":{"fr":"Black Butler"},"black butler":{"fr":"Black Butler"},"kuro shitsuji":{"fr":"Black Butler"},"kuroshitsuzi":{"fr":"Black Butler"},"diacono negro temporada 1":{"fr":"Black Butler"},"chi chikyuu no undou ni tsuite":{"fr":"Du mouvement de la Terre"},"orb on the movements of the earth":{"fr":"Du mouvement de la Terre"},"chi about the movement of the earth":{"fr":"Du mouvement de la Terre"},"o ruchach ziemi":{"fr":"Du mouvement de la Terre"},"du mouvement de la terre":{"fr":"Du mouvement de la Terre"},"tierra sangre conocimiento sobre el movimiento de la tierra":{"fr":"Du mouvement de la Terre"},"ketzer todliches wissen uber die bewegung der erde":{"fr":"Du mouvement de la Terre"},"il movimento della terra":{"fr":"Du mouvement de la Terre"},"gake no ue no ponyo":{"fr":"Ponyo sur la falaise","es":"Ponyo en el Acantilado"},"ponyo":{"fr":"Ponyo sur la falaise","es":"Ponyo en el Acantilado"},"ponyo on the cliff by the sea":{"fr":"Ponyo sur la falaise","es":"Ponyo en el Acantilado"},"ponyo en el acantilado":{"fr":"Ponyo sur la falaise","es":"Ponyo en el Acantilado"},"ponyo sur la falaise":{"fr":"Ponyo sur la falaise","es":"Ponyo en el Acantilado"},"ponyo pa klippen ved havet":{"fr":"Ponyo sur la falaise","es":"Ponyo en el Acantilado"},"ponyo sulla scogliera":{"fr":"Ponyo sur la falaise","es":"Ponyo en el Acantilado"},"ponyo pa klippan vid havet":{"fr":"Ponyo sur la falaise","es":"Ponyo en el Acantilado"},"ponyo rantakalliolla":{"fr":"Ponyo sur la falaise","es":"Ponyo en el Acantilado"},"ponyo uma amizade que veio do mar":{"fr":"Ponyo sur la falaise","es":"Ponyo en el Acantilado"},"ponyo das gro e abenteuer am meer":{"fr":"Ponyo sur la falaise","es":"Ponyo en el Acantilado"},"ponyo vi sjavarklettana":{"fr":"Ponyo sur la falaise","es":"Ponyo en el Acantilado"},"danshi koukousei no nichijou":{"fr":"La vie quotidienne de lycéens"},"daily lives of high school boys":{"fr":"La vie quotidienne de lycéens"},"nichibros":{"fr":"La vie quotidienne de lycéens"},"la vie quotidienne de lyceens":{"fr":"La vie quotidienne de lycéens"},"kono subarashii sekai ni shukufuku wo kurenai densetsu":{"es":"Konosuba! Un mundo maravilloso. La leyenda del carmesí"},"konosuba god's blessing on this wonderful world legend of crimson":{"es":"Konosuba! Un mundo maravilloso. La leyenda del carmesí"},"konosuba movie":{"es":"Konosuba! Un mundo maravilloso. La leyenda del carmesí"},"konosuba un mundo maravilloso la leyenda del carmesi":{"es":"Konosuba! Un mundo maravilloso. La leyenda del carmesí"},"kimetsu no yaiba hashira geiko hen":{"fr":"Demon Slayer: Kimetsu no Yaiba - L'entraînement des Piliers"},"demon slayer kimetsu no yaiba hashira training arc":{"fr":"Demon Slayer: Kimetsu no Yaiba - L'entraînement des Piliers"},"kny 4":{"fr":"Demon Slayer: Kimetsu no Yaiba - L'entraînement des Piliers"},"demon slayer kimetsu no yaiba l'entrainement des piliers":{"fr":"Demon Slayer: Kimetsu no Yaiba - L'entraînement des Piliers"},"miecz zabojcy demonow kimetsu no yaiba trening filarow":{"fr":"Demon Slayer: Kimetsu no Yaiba - L'entraînement des Piliers"},"mushoku tensei ii isekai ittara honki dasu part 2":{"es":"Mushoku Tensei II: Reencarnación desde cero"},"mushoku tensei jobless reincarnation season 2 part 2":{"es":"Mushoku Tensei II: Reencarnación desde cero"},"mushoku tensei jobless reincarnation season 2 cour 2":{"es":"Mushoku Tensei II: Reencarnación desde cero"},"mushoku tensei isekai ittara honki dasu 2nd season part 2":{"es":"Mushoku Tensei II: Reencarnación desde cero"},"mushoku tensei ii jobless reincarnation part 2":{"es":"Mushoku Tensei II: Reencarnación desde cero"},"ijiranaide nagatoro san":{"fr":"Arrête de me chauffer, Nagatoro!"},"don't toy with me miss nagatoro":{"fr":"Arrête de me chauffer, Nagatoro!"},"arrete de me chauffer nagatoro":{"fr":"Arrête de me chauffer, Nagatoro!"},"jangan main main denganku nona nagatoro serangan ke 2":{"fr":"Arrête de me chauffer, Nagatoro!"},"no me rayes nagatoro":{"fr":"Arrête de me chauffer, Nagatoro!"},"hikaru ga shinda natsu":{"es":"El verano en que Hikaru murió"},"the summer hikaru died":{"es":"El verano en que Hikaru murió"},"o verao em que hikaru morreu":{"es":"El verano en que Hikaru murió"},"der sommer in dem hikaru starb":{"es":"El verano en que Hikaru murió"},"l'estate in cui hikaru e morto":{"es":"El verano en que Hikaru murió"},"el verano en que hikaru murio":{"es":"El verano en que Hikaru murió"},"kotonoha no niwa":{"es":"El Jardín de las Palabras"},"the garden of words":{"es":"El Jardín de las Palabras"},"koto no ha no niwa":{"es":"El Jardín de las Palabras"},"the garden of kotonoha":{"es":"El Jardín de las Palabras"},"el jardin de las palabras":{"es":"El Jardín de las Palabras"},"a szavak kertje":{"es":"El Jardín de las Palabras"},"il giardino delle parole":{"es":"El Jardín de las Palabras"},"ao no hako":{"es":"La caja azul"},"blue box":{"es":"La caja azul"},"la caja azul":{"es":"La caja azul"},"mimi wo sumaseba":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"whisper of the heart":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"if you listen carefully":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"ghibli movie 10":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"si tu tends l'oreille":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"stimme des herzens":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"susurros del corazon":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"sussurros do coracao":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"sussurri del cuore":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"szept serca":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"i sospiri del mio cuore":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"sydamen kuiskaus":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"om du lyssnar noga":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"murmuris del cor":{"fr":"Si tu tends l'oreille","es":"Susurros del Corazón"},"byousoku 5 centimeter":{"fr":"5 centimètres par seconde","es":"5 Centímetros por Segundo"},"5 centimeters per second":{"fr":"5 centimètres par seconde","es":"5 Centímetros por Segundo"},"five centimeters per second":{"fr":"5 centimètres par seconde","es":"5 Centímetros por Segundo"},"byousoku 5 centimeter a chain of short stories about their distance":{"fr":"5 centimètres par seconde","es":"5 Centímetros por Segundo"},"5 cm per second":{"fr":"5 centimètres par seconde","es":"5 Centímetros por Segundo"},"5 centimetros por segundo":{"fr":"5 centimètres par seconde","es":"5 Centímetros por Segundo"},"5 centimetres par seconde":{"fr":"5 centimètres par seconde","es":"5 Centímetros por Segundo"},"masodpercenkent 5 centimeter":{"fr":"5 centimètres par seconde","es":"5 Centímetros por Segundo"},"5 centimet tren giay":{"fr":"5 centimètres par seconde","es":"5 Centímetros por Segundo"},"5 centimetri al secondo":{"fr":"5 centimètres par seconde","es":"5 Centímetros por Segundo"},"kaze no tani no nausicaa":{"fr":"Nausicaä de la vallée du vent","es":"Nausicaä del Valle del Viento"},"nausicaa of the valley of the wind":{"fr":"Nausicaä de la vallée du vent","es":"Nausicaä del Valle del Viento"},"nausicaa de la vallee du vent":{"fr":"Nausicaä de la vallée du vent","es":"Nausicaä del Valle del Viento"},"nausicaa del valle del viento":{"fr":"Nausicaä de la vallée du vent","es":"Nausicaä del Valle del Viento"},"nausicaa do vale do vento":{"fr":"Nausicaä de la vallée du vent","es":"Nausicaä del Valle del Viento"},"nausicaa della valle del vento":{"fr":"Nausicaä de la vallée du vent","es":"Nausicaä del Valle del Viento"},"nausicaa z doliny wiatru":{"fr":"Nausicaä de la vallée du vent","es":"Nausicaä del Valle del Viento"},"nausicaa aus dem tal der winde":{"fr":"Nausicaä de la vallée du vent","es":"Nausicaä del Valle del Viento"},"vindens krigare":{"fr":"Nausicaä de la vallée du vent","es":"Nausicaä del Valle del Viento"},"nausicaa fran vindarnas dal":{"fr":"Nausicaä de la vallée du vent","es":"Nausicaä del Valle del Viento"},"nausicaa prinsessen fra vindens dal":{"fr":"Nausicaä de la vallée du vent","es":"Nausicaä del Valle del Viento"},"warriors of the wind 1987 us release title":{"fr":"Nausicaä de la vallée du vent","es":"Nausicaä del Valle del Viento"},"navsika ur dal vindsins":{"fr":"Nausicaä de la vallée du vent","es":"Nausicaä del Valle del Viento"},"liz to aoi tori":{"fr":"Liz et l'Oiseau bleu"},"liz and the blue bird":{"fr":"Liz et l'Oiseau bleu"},"liz und ein blauer vogel":{"fr":"Liz et l'Oiseau bleu"},"liz et l'oiseau bleu":{"fr":"Liz et l'Oiseau bleu"},"liz und der blaue vogel":{"fr":"Liz et l'Oiseau bleu"},"bishoujo senshi sailor moon":{"es":"Sailor Moon"},"sailor moon":{"es":"Sailor Moon"},"pretty soldier sailor moon":{"es":"Sailor Moon"},"navegante da lua":{"es":"Sailor Moon"},"sailor moon das madchen mit den zauberkraften":{"es":"Sailor Moon"},"tian guan ci fu":{"es":"La bendición del oficial del cielo"},"heaven official's blessing":{"es":"La bendición del oficial del cielo"},"tenkan tamamono fuku":{"es":"La bendición del oficial del cielo"},"la bendicion del oficial del cielo":{"es":"La bendición del oficial del cielo"},"suzumiya haruhi no yuuutsu":{"fr":"La mélancolie de Haruhi Suzumiya"},"the melancholy of haruhi suzumiya":{"fr":"La mélancolie de Haruhi Suzumiya"},"la malinconia di haruhi suzumiya":{"fr":"La mélancolie de Haruhi Suzumiya"},"la melancolie de haruhi suzumiya":{"fr":"La mélancolie de Haruhi Suzumiya"},"melancholia haruhi suzumiyi":{"fr":"La mélancolie de Haruhi Suzumiya"},"tensei shitara slime datta ken 4th season":{"es":"Aquella vez que me convertí en slime - Temporada 4"},"that time i got reincarnated as a slime season 4":{"es":"Aquella vez que me convertí en slime - Temporada 4"},"tensura 4":{"es":"Aquella vez que me convertí en slime - Temporada 4"},"aquella vez que me converti en slime temporada 4":{"es":"Aquella vez que me convertí en slime - Temporada 4"},"moi quand je me reincarne en slime saison 4":{"es":"Aquella vez que me convertí en slime - Temporada 4"},"tenkuu no shiro laputa":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"castle in the sky":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"tenkuu no shiro rapyuta":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"das schloss im himmel":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"el castillo en el cielo":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"o castelo no ceu":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"le chateau dans le ciel":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"gokteki kale":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"laputa castello nel cielo":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"castello nel cielo":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"laputa zamek v oblacich":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"laputa podniebny zamek":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"laputa himmelslottet":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"laputa az egi palota":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"laputa slottet i himlen":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"laputa fljugandi kastalinn":{"fr":"Le Château dans le ciel","es":"El Castillo en el Cielo"},"kimi no koto ga dai dai dai dai daisuki na 100 nin no kanojo":{"fr":"Les 100 petites amies qui t'aiiiment à en mourir"},"the 100 girlfriends who really really really really really love you":{"fr":"Les 100 petites amies qui t'aiiiment à en mourir"},"100 kanojo":{"fr":"Les 100 petites amies qui t'aiiiment à en mourir"},"100kano":{"fr":"Les 100 petites amies qui t'aiiiment à en mourir"},"hyakkano":{"fr":"Les 100 petites amies qui t'aiiiment à en mourir"},"100 namoradas que te amam muuuuuito":{"fr":"Les 100 petites amies qui t'aiiiment à en mourir"},"les 100 petites amies qui t'aiiiment a en mourir":{"fr":"Les 100 petites amies qui t'aiiiment à en mourir"},"100 pacar yang sungguh sangat amat benar benar mencintaimu":{"fr":"Les 100 petites amies qui t'aiiiment à en mourir"},"kaze tachinu":{"fr":"Le vent se lève","es":"El Viento se Levanta"},"the wind rises":{"fr":"Le vent se lève","es":"El Viento se Levanta"},"el viento se levanta":{"fr":"Le vent se lève","es":"El Viento se Levanta"},"si alza il vento":{"fr":"Le vent se lève","es":"El Viento se Levanta"},"szel tamad":{"fr":"Le vent se lève","es":"El Viento se Levanta"},"wie der wind sich hebt":{"fr":"Le vent se lève","es":"El Viento se Levanta"},"le vent se leve":{"fr":"Le vent se lève","es":"El Viento se Levanta"},"vidas ao vento":{"fr":"Le vent se lève","es":"El Viento se Levanta"},"vinden stiger":{"fr":"Le vent se lève","es":"El Viento se Levanta"},"det blaser upp en vind":{"fr":"Le vent se lève","es":"El Viento se Levanta"},"vindurinn ris":{"fr":"Le vent se lève","es":"El Viento se Levanta"},"chou kaguya hime":{"fr":"Kaguya, princesse cosmique"},"cosmic princess kaguya":{"fr":"Kaguya, princesse cosmique"},"la princesa kaguya del cosmos":{"fr":"Kaguya, princesse cosmique"},"kaguya princesse cosmique":{"fr":"Kaguya, princesse cosmique"},"kaguya a princesa espacial":{"fr":"Kaguya, princesse cosmique"},"cpk":{"fr":"Kaguya, princesse cosmique"},"kino no tabi the beautiful world":{"fr":"L'Odyssée de Kino"},"kino's journey":{"fr":"L'Odyssée de Kino"},"kino's travels the beautiful world":{"fr":"L'Odyssée de Kino"},"l'odyssee de kino":{"fr":"L'Odyssée de Kino"},"kinos resa":{"fr":"L'Odyssée de Kino"},"kuzu no honkai":{"es":"El deseo de la escoria"},"scum's wish":{"es":"El deseo de la escoria"},"desejos proibidos":{"es":"El deseo de la escoria"},"el deseo de la escoria":{"es":"El deseo de la escoria"},"romantic killer":{"es":"La asesina del romance"},"la asesina del romance":{"es":"La asesina del romance"},"umibe no etranger":{"fr":"L'Étranger de la plage"},"the stranger by the shore":{"fr":"L'Étranger de la plage"},"seaside stranger":{"fr":"L'Étranger de la plage"},"l'etranger de la plage":{"fr":"L'Étranger de la plage"},"the stranger by the beach":{"fr":"L'Étranger de la plage"},"boku no hero academia the movie heroes rising":{"es":"My Hero Academia: El Despertar de los Héroes"},"my hero academia heroes rising":{"es":"My Hero Academia: El Despertar de los Héroes"},"boku no hero academia the movie 2":{"es":"My Hero Academia: El Despertar de los Héroes"},"my hero academia el despertar de los heroes":{"es":"My Hero Academia: El Despertar de los Héroes"},"toki wo kakeru shoujo":{"fr":"La Traversée du temps","es":"La Chica que Saltaba a Través del Tiempo"},"the girl who leapt through time":{"fr":"La Traversée du temps","es":"La Chica que Saltaba a Través del Tiempo"},"toki wo kakeru shojo":{"fr":"La Traversée du temps","es":"La Chica que Saltaba a Través del Tiempo"},"tokikake":{"fr":"La Traversée du temps","es":"La Chica que Saltaba a Través del Tiempo"},"the girl who cut time":{"fr":"La Traversée du temps","es":"La Chica que Saltaba a Través del Tiempo"},"das madchen das durch die zeit sprang":{"fr":"La Traversée du temps","es":"La Chica que Saltaba a Través del Tiempo"},"la chica que saltaba a traves del tiempo":{"fr":"La Traversée du temps","es":"La Chica que Saltaba a Través del Tiempo"},"a garota que conquistou o tempo":{"fr":"La Traversée du temps","es":"La Chica que Saltaba a Través del Tiempo"},"la traversee du temps":{"fr":"La Traversée du temps","es":"La Chica que Saltaba a Través del Tiempo"},"la ragazza che saltava nel tempo":{"fr":"La Traversée du temps","es":"La Chica que Saltaba a Través del Tiempo"}};

(function () {
  var LANGS = ['en', 'fr', 'es'];

  function detectLang() {
    try {
      var saved = localStorage.getItem('sakugame_lang');
      if (saved && LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) { }
    var nav = (navigator.language || navigator.userLanguage || 'en');
    var short = String(nav).slice(0, 2).toLowerCase();
    return LANGS.indexOf(short) !== -1 ? short : 'en';
  }
  var LANG = detectLang();

// The main dictionary. KEY = exact English text → { fr, es }.
var I18N = {
  "- Click \"Confirm Selection\" when ready": { fr: "- Cliquez sur \"Confirmer la sélection\" quand vous êtes prêt", es: "- Pulsa \"Confirmar selección\" cuando estés listo" },
  "— joins automatically when a seat opens": { fr: "— rejoint automatiquement dès qu'une place se libère", es: "— se une automáticamente en cuanto se libera un asiento" },
  "— no word —": { fr: "— aucun mot —", es: "— sin palabra —" },
  "— wrong!": { fr: "— raté !", es: "— ¡falló!" },
  "— wrong… and is OUT of lives!": { fr: "— raté… et n'a plus de vies !", es: "— falló… ¡y se quedó sin vidas!" },
  "— you are #": { fr: "— vous êtes n°", es: "— eres el n.º" },
  ", always.": { fr: ", toujours.", es: ", siempre." },
  ": it was": { fr: " : c'était", es: ": era" },
  ". You'll jump in automatically for the next game!": { fr: ". Vous entrerez automatiquement à la prochaine partie !", es: ". ¡Entrarás automáticamente en la próxima partida!" },
  "…or use your own picture (your browser shrinks it to a tiny 96×96 image — nothing heavy is uploaded).": { fr: "…ou utilisez votre propre image (votre navigateur la réduit à une petite image de 96×96 — rien de lourd n'est envoyé).", es: "…o usa tu propia imagen (tu navegador la reduce a una imagen de 96×96 — no se sube nada pesado)." },
  "· Code": { fr: "· Code", es: "· Código" },
  "· FOUND!": { fr: "· TROUVÉ !", es: "· ¡ENCONTRADO!" },
  "· queue +": { fr: "· file +", es: "· cola +" },
  "\" — CORRECT!": { fr: "\" — CORRECT !", es: "\" — ¡CORRECTO!" },
  "\" — WRONG!": { fr: "\" — FAUX !", es: "\" — ¡FALSO!" },
  "(0 remaining)": { fr: "(0 restant)", es: "(0 restantes)" },
  "(a player with NO word — needs 4+ players)": { fr: "(un joueur SANS mot — 4+ joueurs requis)", es: "(un jugador SIN palabra — requiere 4+ jugadores)" },
  "(everyone stays in the room)": { fr: "(tout le monde reste dans le salon)", es: "(todos se quedan en la sala)" },
  "(needs 4+ players)": { fr: "(4+ joueurs requis)", es: "(requiere 4+ jugadores)" },
  "(per hunter)": { fr: "(par chasseur)", es: "(por cazador)" },
  "(pictures to guess)": { fr: "(images à deviner)", es: "(imágenes por adivinar)" },
  "(seconds per unblur step)": { fr: "(secondes par niveau de flou)", es: "(segundos por nivel de desenfoque)" },
  "(stage": { fr: "(niveau", es: "(nivel" },
  "(wrong guesses allowed)": { fr: "(erreurs autorisées)", es: "(fallos permitidos)" },
  "(you can guess on your turn)": { fr: "(vous pouvez deviner à votre tour)", es: "(puedes adivinar en tu turno)" },
  "(you picked ✓)": { fr: "(choisi ✓)", es: "(elegido ✓)" },
  ") was added to the room.": { fr: ") a été ajoutée au salon.", es: ") se añadió a la sala." },
  "← Back": { fr: "← Retour", es: "← Volver" },
  "← Back to Home": { fr: "← Retour à l'accueil", es: "← Volver al inicio" },
  "← Return to Lobby": { fr: "← Retour au lobby", es: "← Volver al lobby" },
  "??? A real pair from the game — both are football anime!": { fr: "??? Une vraie paire du jeu — les deux sont des anime de foot !", es: "??? Una pareja real del juego — ¡los dos son anime de fútbol!" },
  "5000 famous characters — no AniList needed": { fr: "5000 personnages célèbres — AniList non requis", es: "5000 personajes famosos — no hace falta AniList" },
  "1st — Aria": { fr: "1re — Aria", es: "1.ª — Aria" },
  "1st — You": { fr: "1er — Vous", es: "1.º — Tú" },
  "1-8 players": { fr: "1-8 joueurs", es: "1-8 jugadores" },
  "2 players": { fr: "2 joueurs", es: "2 jugadores" },
  "2nd — Aria": { fr: "2e — Aria", es: "2.ª — Aria" },
  "2nd — You": { fr: "2e — Vous", es: "2.º — Tú" },
  "3-20 letters, numbers, _": { fr: "3-20 lettres, chiffres, _", es: "3-20 letras, números, _" },
  "3-8 players": { fr: "3-8 joueurs", es: "3-8 jugadores" },
  "3-8 players! Everyone has a secret character. Ask questions to the whole table, track each opponent on their own glowing board, guess their secrets, and climb the points ranking!": { fr: "3-8 joueurs ! Chacun a un personnage secret. Posez des questions à toute la table, suivez chaque adversaire sur son propre plateau lumineux, devinez leurs secrets et grimpez au classement !", es: "¡3-8 jugadores! Cada uno tiene un personaje secreto. Haz preguntas a toda la mesa, sigue a cada rival en su propio tablero brillante, adivina sus secretos y sube en la clasificación!" },
  "3-8 players! Everyone secretly gets an anime word — except the Undercover (a similar word) and Mr. White (no word at all). Give a clue each round, discuss, and vote out the impostor!": { fr: "3-8 joueurs ! Tout le monde reçoit un mot d'anime secret — sauf l'Undercover (un mot proche) et Mr. White (aucun mot). Donnez un indice par manche, discutez et éliminez l'imposteur !", es: "¡3-8 jugadores! Todos reciben en secreto una palabra de anime — excepto el Undercover (una palabra parecida) y Mr. White (ninguna palabra). Da una pista por ronda, discute y vota al impostor!" },
  "3rd — Rex": { fr: "3e — Rex", es: "3.º — Rex" },
  "5 base + 3 speed bonus": { fr: "5 de base + 3 bonus de vitesse", es: "5 de base + 3 de bonus de velocidad" },
  "a game": { fr: "une partie", es: "una partida" },
  "a game is in progress": { fr: "une partie est en cours", es: "hay una partida en curso" },
  "A player": { fr: "Un joueur", es: "Un jugador" },
  "A seat opened — you're in! Ready up!": { fr: "Une place s'est libérée — vous êtes dedans ! Mettez-vous prêt !", es: "¡Se liberó un asiento — estás dentro! ¡Prepárate!" },
  "Account": { fr: "Compte", es: "Cuenta" },
  "Account created! Welcome,": { fr: "Compte créé ! Bienvenue,", es: "¡Cuenta creada! Bienvenido," },
  "Add This Pair": { fr: "Ajouter cette paire", es: "Añadir esta pareja" },
  "Add your own pairs — saved online instantly and used by": { fr: "Ajoutez vos propres paires — sauvegardées en ligne immédiatement et utilisées par", es: "Añade tus propias parejas — se guardan online al instante y las usa" },
  "After the clues, everyone votes to eliminate one suspect. The player with the most votes leaves — and their role is revealed to the table.": { fr: "Après les indices, tout le monde vote pour éliminer un suspect. Le joueur avec le plus de voix sort — et son rôle est révélé à la table.", es: "Tras las pistas, todos votan para eliminar a un sospechoso. El jugador con más votos sale — y su rol se revela a la mesa." },
  "All Characters": { fr: "Tous les personnages", es: "Todos los personajes" },
  "all hunters": { fr: "tous les chasseurs", es: "todos los cazadores" },
  "All hunters are out of lives — the TARGET wins!": { fr: "Tous les chasseurs sont à court de vies — la CIBLE gagne !", es: "¡Todos los cazadores se quedaron sin vidas — gana el OBJETIVO!" },
  "All players must be ready!": { fr: "Tous les joueurs doivent être prêts !", es: "¡Todos los jugadores deben estar listos!" },
  "All players ready! Launching new game...": { fr: "Tous les joueurs sont prêts ! Lancement d'une nouvelle partie...", es: "¡Todos listos! Iniciando nueva partida..." },
  "All the hunters ran out of lives — the secret stays safe with": { fr: "Tous les chasseurs sont à court de vies — le secret reste en sécurité avec", es: "Todos los cazadores se quedaron sin vidas — el secreto queda a salvo con" },
  "and pick the right result to attach the official name & picture. You must be logged in.": { fr: "et choisissez le bon résultat pour attacher le nom & l'image officiels. Vous devez être connecté.", es: "y elige el resultado correcto para adjuntar el nombre y la imagen oficiales. Debes iniciar sesión." },
  "and waiting players from the queue take free seats.": { fr: "et les joueurs en file d'attente prennent les places libres.", es: "y los jugadores en cola ocupan los asientos libres." },
  "AniList Account": { fr: "Compte AniList", es: "Cuenta de AniList" },
  "anime characters": { fr: "personnages d'anime", es: "personajes de anime" },
  "anime cover": { fr: "affiche d'anime", es: "portada de anime" },
  "Anime covers": { fr: "Affiches d'anime", es: "Portadas de anime" },
  "Anime covers mode": { fr: "Mode affiches d'anime", es: "Modo portadas de anime" },
  "Anime Guess Who? (2 players)": { fr: "Anime Guess Who? (2 joueurs)", es: "Anime Guess Who? (2 jugadores)" },
  "Anime Guess Who? is a head-to-head duel —": { fr: "Anime Guess Who? est un duel en tête-à-tête —", es: "Anime Guess Who? es un duelo cara a cara —" },
  "anime series": { fr: "séries d'anime", es: "series de anime" },
  "Anime series": { fr: "Séries d'anime", es: "Series de anime" },
  "Answering…": { fr: "Réponse en cours…", es: "Respondiendo…" },
  "Applies from the next game.": { fr: "S'applique dès la prochaine partie.", es: "Se aplica desde la próxima partida." },
  "Are you sure you want to leave?": { fr: "Voulez-vous vraiment partir ?", es: "¿Seguro que quieres salir?" },
  "Aria — secret set": { fr: "Aria — secret choisi", es: "Aria — secreto elegido" },
  "Aria — TARGET": { fr: "Aria — CIBLE", es: "Aria — OBJETIVO" },
  "Aria: YES": { fr: "Aria : OUI", es: "Aria: SÍ" },
  "Aria's suspects": { fr: "Suspects d'Aria", es: "Sospechosos de Aria" },
  "As answers arrive, eliminate on each rival's board — then fire a guess at any rival when you feel sure. Each correctly exposed secret scores big points.": { fr: "Au fil des réponses, éliminez sur le plateau de chaque rival — puis lancez une accusation dès que vous êtes sûr. Chaque secret correctement dévoilé rapporte gros.", es: "A medida que llegan las respuestas, elimina en el tablero de cada rival — y lanza una acusación cuando estés seguro. Cada secreto bien expuesto da muchos puntos." },
  "Ask": { fr: "Poser", es: "Preguntar" },
  "Ask smart questions": { fr: "Posez des questions malines", es: "Haz preguntas astutas" },
  "At least 6 characters": { fr: "Au moins 6 caractères", es: "Al menos 6 caracteres" },
  "Available Games": { fr: "Jeux disponibles", es: "Juegos disponibles" },
  "Battle Royale over!": { fr: "Battle Royale terminé !", es: "¡Battle Royale terminado!" },
  "Blur Code": { fr: "Code Blur", es: "Código Blur" },
  "Blur Guess (solo or up to 8 players)": { fr: "Blur Guess (solo ou jusqu'à 8 joueurs)", es: "Blur Guess (en solitario o hasta 8 jugadores)" },
  "Blur Guess over!": { fr: "Blur Guess terminé !", es: "¡Blur Guess terminado!" },
  "Blur stage": { fr: "Niveau de flou", es: "Nivel de desenfoque" },
  "Blur stage 1/5": { fr: "Niveau de flou 1/5", es: "Nivel de desenfoque 1/5" },
  "blurred portraits": { fr: "portraits floutés", es: "retratos difuminados" },
  "blurred posters": { fr: "affiches floutées", es: "pósters difuminados" },
  "Board element not found": { fr: "Élément de plateau introuvable", es: "Elemento de tablero no encontrado" },
  "Both words must be at least 2 characters.": { fr: "Les deux mots doivent faire au moins 2 caractères.", es: "Ambas palabras deben tener al menos 2 caracteres." },
  "Browse available games": { fr: "Parcourir les jeux disponibles", es: "Explorar los juegos disponibles" },
  "Build your streak": { fr: "Construisez votre série", es: "Construye tu racha" },
  "Can the character fly?": { fr: "Le personnage peut-il voler ?", es: "¿El personaje puede volar?" },
  "Cancel": { fr: "Annuler", es: "Cancelar" },
  "Cannot start game: no characters data": { fr: "Impossible de lancer : aucune donnée de personnages", es: "No se puede iniciar: sin datos de personajes" },
  "Champion hunter!": { fr: "Champion chasseur !", es: "¡Cazador campeón!" },
  "Change Password": { fr: "Changer le mot de passe", es: "Cambiar la contraseña" },
  "Change picture": { fr: "Changer d'image", es: "Cambiar imagen" },
  "Change the game?": { fr: "Changer de jeu ?", es: "¿Cambiar de juego?" },
  "Change the word pair (roles stay the same)": { fr: "Changer la paire de mots (les rôles restent identiques)", es: "Cambiar la pareja de palabras (los roles se mantienen)" },
  "Change Username": { fr: "Changer le pseudo", es: "Cambiar el nombre de usuario" },
  "Character Count": { fr: "Nombre de personnages", es: "Número de personajes" },
  "Character Pool": { fr: "Réserve de personnages", es: "Grupo de personajes" },
  "Characters": { fr: "Personnages", es: "Personajes" },
  "Choose a Game": { fr: "Choisis un jeu", es: "Elige un juego" },
  "characters ·": { fr: "personnages ·", es: "personajes ·" },
  "characters · max": { fr: "personnages · max", es: "personajes · máx." },
  "Characters array is empty": { fr: "La liste de personnages est vide", es: "La lista de personajes está vacía" },
  "Characters mode": { fr: "Mode personnages", es: "Modo personajes" },
  "Chat": { fr: "Discussion", es: "Chat" },
  "Chat with the other players!": { fr: "Discutez avec les autres joueurs !", es: "¡Chatea con los otros jugadores!" },
  "Choose a new display name": { fr: "Choisissez un nouveau nom affiché", es: "Elige un nuevo nombre visible" },
  "Choose Your Secret Character": { fr: "Choisissez votre personnage secret", es: "Elige tu personaje secreto" },
  "Citizens win!": { fr: "Les Civils gagnent !", es: "¡Ganan los Ciudadanos!" },
  "Civilians Win!": { fr: "Les Civils gagnent !", es: "¡Ganan los Civiles!" },
  "Classic guessing game with your favorite anime characters from AniList. Eliminate characters and guess your opponent's secret!": { fr: "Jeu de déduction classique avec vos personnages d'anime préférés d'AniList. Éliminez des personnages et devinez le secret de votre adversaire !", es: "Juego de adivinanzas clásico con tus personajes de anime favoritos de AniList. ¡Elimina personajes y adivina el secreto de tu rival!" },
  "Click a player's tile to vote them out!": { fr: "Cliquez sur la tuile d'un joueur pour l'éliminer !", es: "¡Pulsa la ficha de un jugador para expulsarlo!" },
  "Click on a character to make your guess!": { fr: "Cliquez sur un personnage pour tenter votre réponse !", es: "¡Pulsa un personaje para dar tu respuesta!" },
  "Click on a character to select it as your secret": { fr: "Cliquez sur un personnage pour en faire votre secret", es: "Pulsa un personaje para elegirlo como tu secreto" },
  "Click Restart to begin a new round.": { fr: "Cliquez sur Recommencer pour lancer une nouvelle manche.", es: "Pulsa Reiniciar para empezar una nueva ronda." },
  "click their secret!": { fr: "cliquez sur leur secret !", es: "pulsa su secreto!" },
  "Close": { fr: "Fermer", es: "Cerrar" },
  "Code only": { fr: "Code uniquement", es: "Solo código" },
  "Come play": { fr: "Viens jouer", es: "Ven a jugar" },
  "Confident about the secret? Fire your guess! A correct name wins the game instantly — a wrong one gives your opponent free information.": { fr: "Sûr du secret ? Lancez votre accusation ! Un bon nom gagne la partie instantanément — un mauvais donne des informations gratuites à votre adversaire.", es: "¿Seguro del secreto? ¡Lanza tu acusación! Un nombre correcto gana la partida al instante — uno malo da información gratis a tu rival." },
  "Config loaded!": { fr: "Config chargée !", es: "¡Config cargada!" },
  "Config saved!": { fr: "Config enregistrée !", es: "¡Config guardada!" },
  "Configure your room settings": { fr: "Configurez les paramètres du salon", es: "Configura los ajustes de la sala" },
  "Confirm": { fr: "Confirmer", es: "Confirmar" },
  "Confirm Selection": { fr: "Confirmer la sélection", es: "Confirmar selección" },
  "Confirm Your Guess": { fr: "Confirmez votre réponse", es: "Confirma tu respuesta" },
  "Correct — you win!": { fr: "Correct — vous gagnez !", es: "¡Correcto — tú ganas!" },
  "Correct! +": { fr: "Correct ! +", es: "¡Correcto! +" },
  "Correct! +8 pts": { fr: "Correct ! +8 pts", es: "¡Correcto! +8 pts" },
  "Could not find secret character": { fr: "Personnage secret introuvable", es: "No se encontró el personaje secreto" },
  "Could not load this config.": { fr: "Impossible de charger cette config.", es: "No se pudo cargar esta config." },
  "Could not load custom pairs:": { fr: "Impossible de charger les paires personnalisées :", es: "No se pudieron cargar las parejas personalizadas:" },
  "Could not load that image.": { fr: "Impossible de charger cette image.", es: "No se pudo cargar esa imagen." },
  "Could not read that file.": { fr: "Impossible de lire ce fichier.", es: "No se pudo leer ese archivo." },
  "Could not save the picture:": { fr: "Impossible de sauvegarder l'image :", es: "No se pudo guardar la imagen:" },
  "Create a new game room and invite friends": { fr: "Créez un nouveau salon de jeu et invitez des amis", es: "Crea una nueva sala de juego e invita a amigos" },
  "Create Account": { fr: "Créer un compte", es: "Crear cuenta" },
  "Create Game Room": { fr: "Créer un salon de jeu", es: "Crear sala de juego" },
  "Create Room": { fr: "Créer un salon", es: "Crear sala" },
  "Current password": { fr: "Mot de passe actuel", es: "Contraseña actual" },
  "Current password is incorrect.": { fr: "Le mot de passe actuel est incorrect.", es: "La contraseña actual es incorrecta." },
  "Dealing the pictures…": { fr: "Distribution des images…", es: "Repartiendo las imágenes…" },
  "Dealing…": { fr: "Distribution…", es: "Repartiendo…" },
  "Deals NEW words AND new roles (a new Undercover is picked among the still-playing players). The round restarts.": { fr: "Distribue de NOUVEAUX mots ET de nouveaux rôles (un nouvel Undercover est tiré parmi les joueurs encore en jeu). La manche recommence.", es: "Reparte palabras NUEVAS Y roles nuevos (se elige un nuevo Undercover entre los jugadores activos). La ronda se reinicia." },
  "Delete this pair": { fr: "Supprimer cette paire", es: "Eliminar esta pareja" },
  "Describe your word without saying it!": { fr: "Décrivez votre mot sans le dire !", es: "¡Describe tu palabra sin decirla!" },
  "Describe your word without saying it! One player might have a slightly different word… is it you?": { fr: "Décrivez votre mot sans le dire ! Un joueur a peut-être un mot légèrement différent… est-ce vous ?", es: "¡Describe tu palabra sin decirla! Un jugador podría tener una palabra ligeramente distinta… ¿eres tú?" },
  "Description time": { fr: "Temps de description", es: "Tiempo de descripción" },
  "Disabled": { fr: "Désactivé", es: "Desactivado" },
  "Distribution": { fr: "Distribution", es: "Distribución" },
  "Distribution:": { fr: "Distribution :", es: "Distribución:" },
  "Does your character use a sword?": { fr: "Votre personnage utilise-t-il une épée ?", es: "¿Tu personaje usa una espada?" },
  "e.g. Luffy": { fr: "ex. Luffy", es: "p. ej. Luffy" },
  "e.g. Race 5Q 2L": { fr: "ex. Race 5Q 2L", es: "ej. Race 5Q 2L" },
  "e.g. Zoro": { fr: "ex. Zoro", es: "p. ej. Zoro" },
  "Each player secretly receives a character. 3 to 8 detectives sit at one big table — and everyone is both hunter and prey.": { fr: "Chaque joueur reçoit secrètement un personnage. 3 à 8 détectives à une même table — chacun est à la fois chasseur et proie.", es: "Cada jugador recibe un personaje en secreto. De 3 a 8 detectives en una misma mesa — todos son cazador y presa a la vez." },
  "Eliminate as you go": { fr: "Éliminez au fur et à mesure", es: "Elimina sobre la marcha" },
  "Eliminated cards restored!": { fr: "Cartes éliminées restaurées !", es: "¡Cartas eliminadas restauradas!" },
  "Enabled": { fr: "Activé", es: "Activado" },
  "Enter 4-digit code": { fr: "Entrez le code à 4 chiffres", es: "Introduce el código de 4 dígitos" },
  "Enter a room code to join an existing game": { fr: "Entrez un code de salon pour rejoindre une partie existante", es: "Introduce un código de sala para unirte a una partida" },
  "Enter the room code to join": { fr: "Entrez le code du salon pour rejoindre", es: "Introduce el código de sala para unirte" },
  "Enter username": { fr: "Entrez un pseudo", es: "Introduce un nombre de usuario" },
  "Enter your current password.": { fr: "Entrez votre mot de passe actuel.", es: "Introduce tu contraseña actual." },
  "Error adding pair:": { fr: "Erreur lors de l'ajout de la paire :", es: "Error al añadir la pareja:" },
  "Error creating room:": { fr: "Erreur lors de la création du salon :", es: "Error al crear la sala:" },
  "Error joining room:": { fr: "Erreur pour rejoindre le salon :", es: "Error al unirse a la sala:" },
  "Error removing pair:": { fr: "Erreur lors de la suppression de la paire :", es: "Error al eliminar la pareja:" },
  "Error:": { fr: "Erreur :", es: "Error:" },
  "Error: Character list is empty. Returning to lobby...": { fr: "Erreur : liste de personnages vide. Retour au lobby...", es: "Error: lista de personajes vacía. Volviendo al lobby..." },
  "Error: Could not find your secret character. Returning to lobby...": { fr: "Erreur : personnage secret introuvable. Retour au lobby...", es: "Error: no se encontró tu personaje secreto. Volviendo al lobby..." },
  "Error: No character data available. Returning to lobby...": { fr: "Erreur : aucune donnée de personnage disponible. Retour au lobby...", es: "Error: sin datos de personajes disponibles. Volviendo al lobby..." },
  "Everyone gets a secret anime word — except the Undercover (who gets a similar one) and Mr. White (who gets nothing). Describe your word each round, spot the impostor, and vote them out!": { fr: "Tout le monde reçoit un mot d'anime secret — sauf l'Undercover (un mot proche) et Mr. White (rien du tout). Décrivez votre mot à chaque manche, repérez l'imposteur et éliminez-le !", es: "Todos reciben una palabra de anime secreta — excepto el Undercover (una parecida) y Mr. White (nada). ¡Describe tu palabra cada ronda, descubre al impostor y expúlsalo!" },
  "Everyone hides a secret": { fr: "Chacun cache un secret", es: "Todos esconden un secreto" },
  "Everyone is ready! Dealing new words…": { fr: "Tout le monde est prêt ! Distribution de nouveaux mots…", es: "¡Todos están listos! Repartiendo palabras nuevas…" },
  "Everyone is ready! New game…": { fr: "Tout le monde est prêt ! Nouvelle partie…", es: "¡Todos están listos! Nueva partida…" },
  "Everyone left — you were promoted from the queue and are now the host!": { fr: "Tout le monde est parti — vous étiez en file d'attente et êtes maintenant l'hôte !", es: "Todos salieron — estabas en la cola y ahora eres el anfitrión!" },
  "Everyone picked — dealing!": { fr: "Tout le monde a choisi — distribution !", es: "¡Todos eligieron — repartiendo!" },
  "Everyone picks one — you'll all try to guess each other's!": { fr: "Chacun en choisit un — vous devrez tous deviner celui des autres !", es: "Cada uno elige uno — ¡todos intentaréis adivinar el de los demás!" },
  "Everyone receives the same secret word… except one Undercover (a very similar word) and one Mr. White (no word at all). Peek at your card and keep it secret!": { fr: "Tout le monde reçoit le même mot secret… sauf un Undercover (un mot très proche) et un Mr. White (aucun mot). Regardez votre carte et gardez-la secrète !", es: "Todos reciben la misma palabra secreta… excepto un Undercover (una palabra muy parecida) y un Mr. White (ninguna palabra). ¡Mira tu carta y mantenla en secreto!" },
  "Everyone stays in the room — ready states reset.": { fr: "Tout le monde reste dans le salon — les statuts prêts sont remis à zéro.", es: "Todos se quedan en la sala — los estados de listo se reinician." },
  "Fast fingers win big": { fr: "Les doigts rapides gagnent gros", es: "Los dedos rápidos ganan a lo grande" },
  "Favorites": { fr: "Favoris", es: "Favoritos" },
  "favorites. Need at least 6.": { fr: "favoris. Il en faut au moins 6.", es: "favoritos. Se necesitan al menos 6." },
  "Finish the current game first — you can switch games from the lobby.": { fr: "Terminez d'abord la partie en cours — vous pourrez changer de jeu depuis le lobby.", es: "Termina primero la partida actual — puedes cambiar de juego desde el lobby." },
  "first!": { fr: "en premier !", es: "primero!" },
  "Five stages, five payouts": { fr: "Cinq niveaux, cinq gains", es: "Cinco niveles, cinco pagos" },
  "FOUND the mystery character:": { fr: "A TROUVÉ le personnage mystère :", es: "ENCONTRÓ el personaje misterioso:" },
  "Free guess — allowed at ANY moment, even off-turn.": { fr: "Essai gratuit — autorisé à TOUT moment, même hors tour.", es: "Intento gratis — permitido en CUALQUIER momento, incluso fuera de turno." },
  "from the queue": { fr: "de la file d'attente", es: "de la cola" },
  "from the room": { fr: "du salon", es: "de la sala" },
  "from the room?": { fr: "du salon ?", es: "¿de la sala?" },
  "Game": { fr: "Jeu", es: "Juego" },
  "Game Chat": { fr: "Discussion de partie", es: "Chat de la partida" },
  "Game ending": { fr: "Fin de partie", es: "Fin de la partida" },
  "Game in progress": { fr: "Partie en cours", es: "Partida en curso" },
  "Game Lobby": { fr: "Lobby", es: "Lobby del juego" },
  "Game Mode": { fr: "Mode de jeu", es: "Modo de juego" },
  "Game over": { fr: "Partie terminée", es: "Partida terminada" },
  "Game Over": { fr: "Partie terminée", es: "Fin de la partida" },
  "Game over — check the results!": { fr: "Partie terminée — regardez les résultats !", es: "¡Partida terminada — mira los resultados!" },
  "Game Settings - Blur Guess": { fr: "Paramètres du jeu - Blur Guess", es: "Ajustes del juego - Blur Guess" },
  "Game Settings - Guess Who": { fr: "Paramètres du jeu - Guess Who", es: "Ajustes del juego - Guess Who" },
  "Game Settings - Race": { fr: "Paramètres du jeu - Race", es: "Ajustes del juego - Race" },
  "Game Settings - Undercover": { fr: "Paramètres du jeu - Undercover", es: "Ajustes del juego - Undercover" },
  "Game Settings —": { fr: "Paramètres du jeu —", es: "Ajustes del juego —" },
  "Game switched to": { fr: "Jeu changé pour", es: "Juego cambiado a" },
  "Game:": { fr: "Jeu :", es: "Juego:" },
  "Games": { fr: "Jeux", es: "Juegos" },
  "Rules": { fr: "Règles", es: "Reglas" },
  "Browse games & their rules": { fr: "Parcourir les jeux et leurs règles", es: "Explorar los juegos y sus reglas" },
  "Generic": { fr: "Générique", es: "Genérico" },
  "Generic pool": { fr: "Réserve générique", es: "Grupo genérico" },
  "goes back to the lobby": { fr: "retourne au lobby", es: "vuelve al lobby" },
  "Guess at ANY moment": { fr: "Devinez à TOUT moment", es: "Adivina en CUALQUIER momento" },
  "Guess mode: click the card you think is": { fr: "Mode accusation : cliquez sur la carte qui selon vous est", es: "Modo acusación: pulsa la carta que crees que es" },
  "Guess the anime cover": { fr: "Devinez l'affiche d'anime", es: "Adivina la portada de anime" },
  "Guess the character": { fr: "Devinez le personnage", es: "Adivina el personaje" },
  "Guess Who — Battle Royale (3-8 players)": { fr: "Guess Who — Battle Royale (3-8 joueurs)", es: "Guess Who — Battle Royale (3-8 jugadores)" },
  "Guess Who — Race (3-8 players)": { fr: "Guess Who — Race (3-8 joueurs)", es: "Guess Who — Race (3-8 jugadores)" },
  "Guess!": { fr: "Devinez !", es: "¡Adivina!" },
  "GUESS!": { fr: "DEVINEZ !", es: "¡ADIVINA!" },
  "guessed \"": { fr: "a tenté « ", es: "intentó «" },
  "guessed the word \"": { fr: "a deviné le mot « ", es: "adivinó la palabra «" },
  "Half generic, half favorites": { fr: "Moitié générique, moitié favoris", es: "Mitad genérico, mitad favoritos" },
  "has been eliminated.": { fr: "a été éliminé.", es: "ha sido eliminado." },
  "has only": { fr: "n'a plus que", es: "solo le quedan" },
  "History": { fr: "Historique", es: "Historial" },
  "Host a room": { fr: "Créer un salon", es: "Crear una sala" },
  "Host only!": { fr: "Hôte uniquement !", es: "¡Solo el anfitrión!" },
  "Host or join a game room": { fr: "Créez ou rejoignez un salon de jeu", es: "Crea o únete a una sala de juego" },
  "Host permissions transferred.": { fr: "Droits d'hôte transférés.", es: "Permisos de anfitrión transferidos." },
  "Host Room": { fr: "Créer un salon", es: "Crear sala" },
  "How it ends": { fr: "Comment ça se termine", es: "Cómo termina" },
  "How to Play": { fr: "Comment jouer", es: "Cómo jugar" },
  "hunter (out)": { fr: "chasseur (éliminé)", es: "cazador (fuera)" },
  "Hunter lives": { fr: "Vies des chasseurs", es: "Vidas de cazador" },
  "Hunter questions": { fr: "Questions des chasseurs", es: "Preguntas de cazador" },
  "Impostors win!": { fr: "Les Imposteurs gagnent !", es: "¡Ganan los Impostores!" },
  "In the lobby": { fr: "Dans le lobby", es: "En el lobby" },
  "in the queue": { fr: "dans la file d'attente", es: "en la cola" },
  "in the queue. You'll jump in automatically!": { fr: "dans la file. Vous entrerez automatiquement !", es: "en la cola. ¡Entrarás automáticamente!" },
  "Inside the Target seat": { fr: "Dans le siège de la Cible", es: "En el asiento del Objetivo" },
  "is describing their word… your turn comes after (": { fr: "décrit son mot… votre tour vient après (", es: "está describiendo su palabra… tu turno llega tras (" },
  "is picking… the game starts as soon as the choice is made.": { fr: "choisit… la partie commence dès que le choix est fait.", es: "está eligiendo… la partida empieza en cuanto elija." },
  "is secretly picking the mystery character": { fr: "choisit secrètement le personnage mystère", es: "está eligiendo en secreto el personaje misterioso" },
  "is thinking of a question…": { fr: "réfléchit à une question…", es: "está pensando una pregunta…" },
  "Is this your opponent's character?": { fr: "Est-ce le personnage de votre adversaire ?", es: "¿Es el personaje de tu rival?" },
  "Is your character from a shonen?": { fr: "Votre personnage vient-il d'un shonen ?", es: "¿Tu personaje es de un shonen?" },
  "It clears every": { fr: "Cela efface tous les", es: "Borra todos los" },
  "It was": { fr: "C'était", es: "Era" },
  "It's Mikasa Ackerman!": { fr: "C'est Mikasa Ackerman !", es: "¡Es Mikasa Ackerman!" },
  "It's not your turn to ask!": { fr: "Ce n'est pas votre tour de poser une question !", es: "¡No es tu turno de preguntar!" },
  "It's not your turn!": { fr: "Ce n'est pas votre tour !", es: "¡No es tu turno!" },
  "It's not your turn! You can only guess on your turn.": { fr: "Ce n'est pas votre tour ! Vous ne pouvez deviner qu'à votre tour.", es: "¡No es tu turno! Solo puedes adivinar en tu turno." },
  "Join Game Room": { fr: "Rejoindre un salon de jeu", es: "Unirse a una sala de juego" },
  "Join queue": { fr: "Rejoindre la file", es: "Unirse a la cola" },
  "Join Room": { fr: "Rejoindre un salon", es: "Unirse a la sala" },
  "joined from the queue!": { fr: "a rejoint depuis la file d'attente !", es: "se unió desde la cola!" },
  "Kick": { fr: "Expulser", es: "Expulsar" },
  "Kick Player?": { fr: "Expulser ce joueur ?", es: "¿Expulsar al jugador?" },
  "Kira_42 (3 votes)": { fr: "Kira_42 (3 voix)", es: "Kira_42 (3 votos)" },
  "Leave Room": { fr: "Quitter le salon", es: "Salir de la sala" },
  "Leave Room?": { fr: "Quitter le salon ?", es: "¿Salir de la sala?" },
  "left)": { fr: "restantes)", es: "restantes)" },
  "Listed": { fr: "Enregistrées", es: "Registradas" },
  "Listen carefully": { fr: "Écoutez attentivement", es: "Escucha con atención" },
  "Load": { fr: "Charger", es: "Cargar" },
  "Load a config": { fr: "Charger une config", es: "Cargar una configuración" },
  "lives — a wrong guess costs one!": { fr: "vies — une erreur en coûte une !", es: "vidas — ¡un fallo cuesta una!" },
  "lives left": { fr: "vies restantes", es: "vidas restantes" },
  "Log In": { fr: "Connexion", es: "Iniciar sesión" },
  "Log in / Create account": { fr: "Connexion / Créer un compte", es: "Entrar / Crear cuenta" },
  "Log in first (profile menu) to manage word pairs.": { fr: "Connectez-vous d'abord (menu profil) pour gérer les paires de mots.", es: "Inicia sesión primero (menú de perfil) para gestionar las parejas." },
  "Log in or create an account — username only, no email needed": { fr: "Connectez-vous ou créez un compte — pseudo uniquement, pas d'e-mail requis", es: "Entra o crea una cuenta — solo usuario, sin email requerido" },
  "Log in to set a profile picture.": { fr: "Connectez-vous pour définir une photo de profil.", es: "Inicia sesión para poner una foto de perfil." },
  "Log Out": { fr: "Déconnexion", es: "Cerrar sesión" },
  "Logged in — this name & picture are used in your games": { fr: "Connecté — ce nom & cette image sont utilisés dans vos parties", es: "Conectado — este nombre e imagen se usan en tus partidas" },
  "Logged in as": { fr: "Connecté en tant que", es: "Conectado como" },
  "Logged out.": { fr: "Déconnecté.", es: "Sesión cerrada." },
  "Looking for open rooms…": { fr: "Recherche de salons ouverts…", es: "Buscando salas abiertas…" },
  "Losses": { fr: "Défaites", es: "Derrotas" },
  "Make a Guess": { fr: "Tenter une réponse", es: "Dar una respuesta" },
  "Make a guess?": { fr: "Tenter une réponse ?", es: "¿Dar una respuesta?" },
  "Make Host": { fr: "Nommer hôte", es: "Hacer anfitrión" },
  "Make the final call": { fr: "Tranchez", es: "Da el veredicto final" },
  "Max Players": { fr: "Joueurs max", es: "Máx. jugadores" },
  "Mix": { fr: "Mixte", es: "Mezcla" },
  "Mixed pool": { fr: "Réserve mixte", es: "Grupo mixto" },
  "moved to the queue": { fr: "envoyé dans la file d'attente", es: "movido a la cola" },
  "Mr. White guesses…": { fr: "Mr. White tente sa chance…", es: "Mr. White intenta adivinar…" },
  "Mr. White is trying to guess your word…": { fr: "Mr. White essaie de deviner votre mot…", es: "Mr. White está intentando adivinar tu palabra…" },
  "Mr. White left the game — he is out! The game goes on!": { fr: "Mr. White a quitté la partie — il est éliminé ! Le jeu continue !", es: "¡Mr. White salió de la partida — está fuera! ¡El juego continúa!" },
  "Mr. White needs at least 4 players — disable it in the settings or wait for more players.": { fr: "Mr. White nécessite au moins 4 joueurs — désactivez-le dans les paramètres ou attendez plus de joueurs.", es: "Mr. White necesita al menos 4 jugadores — desactívalo en los ajustes o espera a más jugadores." },
  "Mr. White steals it!": { fr: "Mr. White rafle la victoire !", es: "¡Mr. White se la roba!" },
  "Mr. White Wins!": { fr: "Mr. White gagne !", es: "¡Gana Mr. White!" },
  "Multiplayer": { fr: "Multijoueur", es: "Multijugador" },
  "Music Volume": { fr: "Volume de la musique", es: "Volumen de la música" },
  "My answer:": { fr: "Ma réponse :", es: "Mi respuesta:" },
  "My guess: Mikasa Ackerman": { fr: "Mon essai : Mikasa Ackerman", es: "Mi intento: Mikasa Ackerman" },
  "Name": { fr: "Nom", es: "Nombre" },
  "Need 2 players to start!": { fr: "Il faut 2 joueurs pour commencer !", es: "¡Se necesitan 2 jugadores para empezar!" },
  "Need at least 1 player to start!": { fr: "Il faut au moins 1 joueur pour commencer !", es: "¡Se necesita al menos 1 jugador!" },
  "needs at least 3 players!": { fr: "nécessite au moins 3 joueurs !", es: "necesita al menos 3 jugadores!" },
  "Network error. Check your connection.": { fr: "Erreur réseau. Vérifiez votre connexion.", es: "Error de red. Comprueba tu conexión." },
  "New game launched! Pick your character!": { fr: "Nouvelle partie lancée ! Choisissez votre personnage !", es: "¡Nueva partida iniciada! ¡Elige tu personaje!" },
  "New password (min 6 characters)": { fr: "Nouveau mot de passe (min 6 caractères)", es: "Nueva contraseña (mín. 6 caracteres)" },
  "New password must be at least 6 characters.": { fr: "Le nouveau mot de passe doit faire au moins 6 caractères.", es: "La nueva contraseña debe tener al menos 6 caracteres." },
  "New Username": { fr: "Nouveau pseudo", es: "Nuevo nombre de usuario" },
  "New username (3-20 chars)": { fr: "Nouveau pseudo (3-20 caractères)", es: "Nuevo usuario (3-20 caracteres)" },
  "New words": { fr: "Nouveaux mots", es: "Palabras nuevas" },
  "Next round starting…": { fr: "Prochaine manche…", es: "Siguiente ronda…" },
  "Next step": { fr: "Étape suivante", es: "Siguiente paso" },
  "No characters available": { fr: "Aucun personnage disponible", es: "No hay personajes disponibles" },
  "No custom pairs yet.": { fr: "Aucune paire personnalisée pour le moment.", es: "Aún no hay parejas personalizadas." },
  "No custom pairs yet — the built-in pairs are always used too.": { fr: "Aucune paire personnalisée pour l'instant — les paires intégrées sont toujours utilisées aussi.", es: "Aún no hay parejas personalizadas — las parejas integradas siempre se usan también." },
  "No hunters left!": { fr: "Plus de chasseurs !", es: "¡No quedan cazadores!" },
  "No opponent board selected!": { fr: "Aucun plateau adverse sélectionné !", es: "¡Ningún tablero rival seleccionado!" },
  "No opponent board to guess on!": { fr: "Aucun plateau adverse où deviner !", es: "¡Ningún tablero rival donde adivinar!" },
  "No opponent to guess!": { fr: "Aucun adversaire à deviner !", es: "¡Ningún rival que adivinar!" },
  "No questions yet": { fr: "Pas encore de questions", es: "Aún no hay preguntas" },
  "No saved configs yet — press Save to keep your setup!": { fr: "Aucune config enregistrée — appuie sur Enregistrer pour garder la tienne !", es: "Aún no hay configuraciones guardadas — ¡pulsa Guardar para conservar la tuya!" },
  "No turns for guessing — fire it whenever inspiration strikes! But every wrong guess costs 1 of your 3 lives. Lose all three and you watch the rest of the hunt from the bench.": { fr: "Aucun tour pour deviner — tentez quand l'inspiration frappe ! Mais chaque erreur coûte 1 de vos 3 vies. Perdez les trois et vous regardez le reste de la chasse depuis le banc.", es: "Sin turnos para adivinar — ¡inténtalo cuando te llegue la inspiración! Pero cada fallo cuesta 1 de tus 3 vidas. Pierde las tres y verás el resto de la caza desde el banquillo." },
  "No word pairs available!": { fr: "Aucune paire de mots disponible !", es: "¡No hay parejas de palabras!" },
  "Noa — hunter": { fr: "Noa — chasseur", es: "Noa — cazador" },
  "Noa — secret set": { fr: "Noa — secret choisi", es: "Noa — secreto elegido" },
  "Noa: YES": { fr: "Noa : OUI", es: "Noa: SÍ" },
  "nobody — next round!": { fr: "personne — manche suivante !", es: "nadie — ¡siguiente ronda!" },
  "Nobody found it that time!": { fr: "Personne ne l'a trouvé cette fois !", es: "¡Nadie lo encontró esta vez!" },
  "Nobody found it!": { fr: "Personne ne l'a trouvé !", es: "¡Nadie lo encontró!" },
  "Nope! Keep trying — it gets clearer every few seconds…": { fr: "Non ! Continuez — ça devient plus net toutes les quelques secondes…", es: "¡No! Sigue intentándolo — se ve más claro cada pocos segundos…" },
  "Not enough characters available to start.": { fr: "Pas assez de personnages disponibles pour commencer.", es: "No hay suficientes personajes para empezar." },
  "Not enough pictures for Blur Guess! Check the pool source settings.": { fr: "Pas assez d'images pour Blur Guess ! Vérifiez les paramètres de source de la réserve.", es: "¡No hay suficientes imágenes para Blur Guess! Revisa los ajustes de origen." },
  "Not enough pictures for Blur Guess! Check the pool settings — Watched needs synced AniList accounts with watched anime.": { fr: "Pas assez d'images pour Blur Guess ! Vérifiez la réserve — Vus demande des comptes AniList liés avec des animés vus.", es: "¡No hay suficientes imágenes para Blur Guess! Revisa la reserva — Vistos necesita cuentas de AniList sincronizadas con anime visto." },
  "The Watched pool is empty — widen the AniList status checkboxes or switch the pool to Random (host ⚙️).": { fr: "La réserve Vus est vide — cochez plus de statuts AniList ou repassez en Aléatoire (⚙️ hôte).", es: "La reserva Vistos está vacía — marca más estados de AniList o vuelve a Aleatorio (⚙️ del anfitrión)." },
  "Watched needs synced AniList accounts — friends auto-sync when they join with a linked account (or switch the pool to Random).": { fr: "Vus demande des comptes AniList liés — les amis se synchronisent en rejoignant avec un compte lié (ou passez en Aléatoire).", es: "Vistos necesita cuentas de AniList sincronizadas — los amigos se sincronizan al entrar con una cuenta vinculada (o cambia a Aleatorio)." },
  "Watched statuses updated.": { fr: "Statuts de visionnage mis à jour.", es: "Estados de lo visto actualizados." },
  "Count as watched:": { fr: "Compter comme vus :", es: "Contar como vistos:" },
  "Watching": { fr: "En cours", es: "Viendo" },
  "Completed": { fr: "Terminés", es: "Completados" },
  "Paused": { fr: "En pause", es: "En pausa" },
  "Dropped": { fr: "Abandonnés", es: "Abandonados" },
  "Planning": { fr: "Prévus", es: "Planeados" },
  "Watched": { fr: "Vus", es: "Vistos" },
  "Only from anime the synced accounts have watched": { fr: "Uniquement des animés vus par les comptes liés", es: "Solo de animes vistos por las cuentas sincronizadas" },
  "Every character & cover on Sakugame": { fr: "Tous les personnages et posters de Sakugame", es: "Todos los personajes y portadas de Sakugame" },
  "Not enough players left — back to the lobby.": { fr: "Plus assez de joueurs — retour au lobby.", es: "No quedan suficientes jugadores — volviendo al lobby." },
  "Not your turn yet — wait for the others!": { fr: "Pas encore votre tour — attendez les autres !", es: "Aún no es tu turno — ¡espera a los demás!" },
  "Nothing yet": { fr: "Rien pour l'instant", es: "Nada aún" },
  "One board PER rival": { fr: "Un plateau PAR rival", es: "Un tablero POR rival" },
  "One clue each": { fr: "Un indice chacun", es: "Una pista cada uno" },
  "One player is the TARGET — only they know the mystery character. Everyone else is a hunter racing to name it first and win the game.": { fr: "Un joueur est la CIBLE — seul lui connaît le personnage mystère. Tous les autres sont des chasseurs qui courent pour le nommer en premier et gagner la partie.", es: "Un jugador es el OBJETIVO — solo él conoce el personaje misterioso. Todos los demás son cazadores compitiendo por nombrarlo primero y ganar la partida." },
  "One question for the whole table": { fr: "Une question pour toute la table", es: "Una pregunta para toda la mesa" },
  "Only the TARGET picks the mystery character!": { fr: "Seule la CIBLE choisit le personnage mystère !", es: "¡Solo el OBJETIVO elige el personaje misterioso!" },
  "Opening shared room": { fr: "Ouverture du salon partagé", es: "Abriendo sala compartida" },
  "Opponent": { fr: "Adversaire", es: "Rival" },
  "Opponent's Turn": { fr: "Tour de l'adversaire", es: "Turno del rival" },
  "Pair added:": { fr: "Paire ajoutée :", es: "Pareja añadida:" },
  "Pair removed.": { fr: "Paire supprimée.", es: "Pareja eliminada." },
  "Pair type": { fr: "Type de paire", es: "Tipo de pareja" },
  "passed (out of questions)": { fr: "a passé (plus de questions)", es: "pasó (sin preguntas)" },
  "Password": { fr: "Mot de passe", es: "Contraseña" },
  "Password is too weak (min 6 characters).": { fr: "Mot de passe trop faible (min 6 caractères).", es: "Contraseña demasiado débil (mín. 6 caracteres)." },
  "Password must be at least 6 characters.": { fr: "Le mot de passe doit faire au moins 6 caractères.", es: "La contraseña debe tener al menos 6 caracteres." },
  "Password updated!": { fr: "Mot de passe mis à jour !", es: "¡Contraseña actualizada!" },
  "Pick a character for the others to find": { fr: "Choisissez un personnage à faire deviner aux autres", es: "Elige un personaje para que los demás lo encuentren" },
  "Pick a character for your opponent to guess": { fr: "Choisissez un personnage à faire deviner à votre adversaire", es: "Elige un personaje para que tu rival lo adivine" },
  "Pick an anime avatar:": { fr: "Choisissez un avatar anime :", es: "Elige un avatar de anime:" },
  "Pick your mode": { fr: "Choisissez votre mode", es: "Elige tu modo" },
  "Picking characters": { fr: "Choix des personnages", es: "Eligiendo personajes" },
  "Play": { fr: "Jouer", es: "Jugar" },
  "Play Again": { fr: "Rejouer", es: "Jugar otra vez" },
  "Play Again clicked! Waiting for others…": { fr: "Rejouer cliqué ! En attente des autres…", es: "¡Jugar otra vez pulsado! Esperando a los demás…" },
  "Play anime-themed games with friends online": { fr: "Jouez à des jeux d'anime en ligne avec vos amis", es: "Juega a juegos temáticos de anime online con amigos" },
  "Play solo to train, or with up to 8 players. Two modes: blurred anime characters, or blurred anime covers from 500 classics.": { fr: "Jouez solo pour vous entraîner, ou jusqu'à 8 joueurs. Deux modes : personnages d'anime floutés, ou affiches d'anime floutées issues de 500 classiques.", es: "Juega en solitario para entrenar, o con hasta 8 jugadores. Dos modos: personajes de anime difuminados, o portadas de anime de 500 clásicos." },
  "Player": { fr: "Joueur", es: "Jugador" },
  "Player 1": { fr: "Joueur 1", es: "Jugador 1" },
  "Player 2": { fr: "Joueur 2", es: "Jugador 2" },
  "Player kicked from the room.": { fr: "Joueur expulsé du salon.", es: "Jugador expulsado de la sala." },
  "player(s) will move to the queue.": { fr: "joueur(s) passeront dans la file d'attente.", es: "jugador(es) pasarán a la cola." },
  "players picked…": { fr: "joueurs ont choisi…", es: "jugadores han elegido…" },
  "Players:": { fr: "Joueurs :", es: "Jugadores:" },
  "Players' synced AniList accounts": { fr: "Comptes AniList synchronisés des joueurs", es: "Cuentas de AniList sincronizadas de los jugadores" },
  "Please enter a 4-digit room code": { fr: "Veuillez entrer un code de salon à 4 chiffres", es: "Introduce un código de sala de 4 dígitos" },
  "Please enter a question": { fr: "Veuillez entrer une question", es: "Introduce una pregunta" },
  "Please enter a valid username (at least 2 characters)": { fr: "Veuillez entrer un pseudo valide (au moins 2 caractères)", es: "Introduce un usuario válido (al menos 2 caracteres)" },
  "Points for exposed secrets, sharp guesses and keeping your own secret alive. When the game ends, the top of the leaderboard takes the crown.": { fr: "Des points pour les secrets dévoilés, les accusations précises et la survie de votre propre secret. À la fin, le premier du classement remporte la couronne.", es: "Puntos por secretos expuestos, acusaciones certeras y mantener vivo tu propio secreto. Al terminar, el primero de la clasificación se lleva la corona." },
  "Previous step": { fr: "Étape précédente", es: "Paso anterior" },
  "Private": { fr: "Privé", es: "Privada" },
  "Profile Picture": { fr: "Photo de profil", es: "Foto de perfil" },
  "Profile picture removed.": { fr: "Photo de profil supprimée.", es: "Foto de perfil eliminada." },
  "Profile picture updated!": { fr: "Photo de profil mise à jour !", es: "¡Foto de perfil actualizada!" },
  "pts now": { fr: "pts maintenant", es: "pts ahora" },
  "pts!": { fr: "pts !", es: "¡pts!" },
  "Public": { fr: "Public", es: "Pública" },
  "Public Rooms": { fr: "Salons publics", es: "Salas públicas" },
  "Question from opponent:": { fr: "Question de l'adversaire :", es: "Pregunta del rival:" },
  "Question History": { fr: "Historique des questions", es: "Historial de preguntas" },
  "Question time": { fr: "Temps des questions", es: "Hora de preguntas" },
  "questions left ·": { fr: "questions restantes ·", es: "preguntas restantes ·" },
  "questions left)": { fr: "questions restantes)", es: "preguntas restantes)" },
  "Race over": { fr: "Race terminée", es: "Race terminada" },
  "Race over — TARGET wins!": { fr: "Race terminée — la CIBLE gagne !", es: "¡Race terminada — gana el OBJETIVO!" },
  "Race over!": { fr: "Race terminée !", es: "¡Race terminada!" },
  "Random Pick": { fr: "Choix aléatoire", es: "Elección aleatoria" },
  "Ranking decides the winner": { fr: "Le classement désigne le gagnant", es: "La clasificación decide el ganador" },
  "Ready": { fr: "Prêt", es: "Listo" },
  "Ready for a new game:": { fr: "Prêts pour une nouvelle partie :", es: "Listos para otra partida:" },
  "Refresh the list": { fr: "Rafraîchir la liste", es: "Actualizar la lista" },
  "remaining)": { fr: "restantes)", es: "restantes)" },
  "Remove from the queue?": { fr: "Retirer de la file d'attente ?", es: "¿Quitar de la cola?" },
  "Remove picture": { fr: "Supprimer l'image", es: "Quitar imagen" },
  "Removed from the queue.": { fr: "Retiré de la file d'attente.", es: "Quitado de la cola." },
  "Restart": { fr: "Recommencer", es: "Reiniciar" },
  "Restart clicked! Waiting for others...": { fr: "Recommencer cliqué ! En attente des autres...", es: "¡Reinicio pulsado! Esperando a los demás..." },
  "Restore all": { fr: "Tout restaurer", es: "Restaurar todo" },
  "Restore all eliminated cards": { fr: "Restaurer toutes les cartes éliminées", es: "Restaurar todas las cartas eliminadas" },
  "Restore all eliminated cards on this board": { fr: "Restaurer toutes les cartes éliminées de ce plateau", es: "Restaurar todas las cartas eliminadas de este tablero" },
  "Return to Lobby": { fr: "Retour au lobby", es: "Volver al lobby" },
  "Return to Lobby?": { fr: "Retour au lobby ?", es: "¿Volver al lobby?" },
  "Reveal & skip this round (host)": { fr: "Révéler & sauter cette manche (hôte)", es: "Revelar y saltar esta ronda (anfitrión)" },
  "Revealed!": { fr: "Révélé !", es: "¡Revelado!" },
  "Rex — hunter": { fr: "Rex — chasseur", es: "Rex — cazador" },
  "Rex — secret set": { fr: "Rex — secret choisi", es: "Rex — secreto elegido" },
  "Rex is… Light Yagami!": { fr: "Rex est… Light Yagami !", es: "Rex es… ¡Light Yagami!" },
  "Rex: NO": { fr: "Rex : NON", es: "Rex: NO" },
  "Rex's suspects": { fr: "Suspects de Rex", es: "Sospechosos de Rex" },
  "Roles Revealed": { fr: "Rôles révélés", es: "Roles revelados" },
  "Room": { fr: "Salon", es: "Sala" },
  "Room cleanup failed:": { fr: "Échec du nettoyage du salon :", es: "Fallo al limpiar la sala:" },
  "Room Code": { fr: "Code du salon", es: "Código de sala" },
  "Room full": { fr: "Salon plein", es: "Sala llena" },
  "Room link": { fr: "Lien du salon", es: "Enlace de sala" },
  "Room link copied! Send it to your friends — one tap and they join the room.": { fr: "Lien du salon copié ! Envoyez-le à vos amis — un clic et ils rejoignent le salon.", es: "¡Enlace de sala copiado! Envíaselo a tus amigos — un toque y entran en la sala." },
  "Room list refreshed": { fr: "Liste des salons actualisée", es: "Lista de salas actualizada" },
  "Room not found. Check the code and try again.": { fr: "Salon introuvable. Vérifiez le code et réessayez.", es: "Sala no encontrada. Revisa el código e inténtalo de nuevo." },
  "Room Visibility": { fr: "Visibilité du salon", es: "Visibilidad de la sala" },
  "Room was closed": { fr: "Le salon a été fermé", es: "La sala se cerró" },
  "Room:": { fr: "Salon :", es: "Sala:" },
  "Round 1": { fr: "Manche 1", es: "Ronda 1" },
  "Round 1/10": { fr: "Manche 1/10", es: "Ronda 1/10" },
  "Round after round, every player gives a one-word clue about their word. Citizens must prove they know it — without making it obvious for the impostors.": { fr: "Manche après manche, chaque joueur donne un indice en un mot sur son mot. Les Civils doivent prouver qu'ils le connaissent — sans le rendre évident pour les imposteurs.", es: "Ronda tras ronda, cada jugador da una pista de una palabra sobre su palabra. Los Ciudadanos deben demostrar que la conocen — sin hacerlo obvio para los impostores." },
  "Round limit reached — the impostor survived!": { fr: "Limite de manches atteinte — l'imposteur a survécu !", es: "¡Límite de rondas alcanzado — el impostor sobrevivió!" },
  "Rounds": { fr: "Manches", es: "Rondas" },
  "Rounds chain and the leaderboard remembers everything. In multiplayer, the most consistent eye wins — learn studios, eras and art styles!": { fr: "Les manches s'enchaînent et le classement se souvient de tout. En multijoueur, l'œil le plus régulier gagne — apprenez les studios, les époques et les styles !", es: "Las rondas se encadenan y la clasificación lo recuerda todo. En multijugador gana el ojo más constante — ¡aprende estudios, épocas y estilos!" },
  "rounds played — the fastest eyes score speed bonuses!": { fr: "manches jouées — les yeux les plus rapides marquent des bonus de vitesse !", es: "rondas jugadas — ¡los ojos más rápidos puntúan bonus de velocidad!" },
  "run out of lives, the TARGET wins! Running out of questions means you can only guess… or pass.": { fr: "à court de vies, la CIBLE gagne ! Être à court de questions signifie que vous ne pouvez que deviner… ou passer.", es: "sin vidas, ¡gana el OBJETIVO! Quedarse sin preguntas significa que solo puedes adivinar… o pasar." },
  "said theirs": { fr: "a dit le sien", es: "dijo la suya" },
  "Save": { fr: "Enregistrer", es: "Guardar" },
  "Save & Close": { fr: "Enregistrer & fermer", es: "Guardar y cerrar" },
  "Save the current settings for the selected game. Reload them later in one tap!": { fr: "Enregistre les paramètres actuels du jeu sélectionné. Recharge-les plus tard en un tap !", es: "Guarda los ajustes del juego seleccionado. ¡Recárgalos más tarde con un toque!" },
  "Save this config": { fr: "Enregistrer cette config", es: "Guardar esta config" },
  "Search AniList": { fr: "Rechercher sur AniList", es: "Buscar en AniList" },
  "Secret roles": { fr: "Rôles secrets", es: "Roles secretos" },
  "secret was:": { fr: "secret était :", es: "secreto era:" },
  "secret:": { fr: "secret :", es: "secreto:" },
  "Secrets Revealed": { fr: "Secrets révélés", es: "Secretos revelados" },
  "Selected:": { fr: "Sélectionné :", es: "Seleccionado:" },
  "Send": { fr: "Envoyer", es: "Enviar" },
  "Settings": { fr: "Paramètres", es: "Ajustes" },
  "Share Room": { fr: "Partager le salon", es: "Compartir sala" },
  "Share this code — or the link — with your friends": { fr: "Partagez ce code — ou le lien — avec vos amis", es: "Comparte este código — o el enlace — con tus amigos" },
  "Sharpest eyes in the room!": { fr: "Les yeux les plus vifs du salon !", es: "¡Los ojos más rápidos de la sala!" },
  "Shuffle it!": { fr: "Mélanger !", es: "¡Barajar!" },
  "Shuffle words & roles?": { fr: "Mélanger les mots & les rôles ?", es: "¿Barajar palabras y roles?" },
  "Skip round": { fr: "Sauter la manche", es: "Saltar ronda" },
  "solo or up to 8": { fr: "solo ou jusqu'à 8", es: "en solitario o hasta 8" },
  "Solo or up to 8 players! A blurred character or anime cover slowly clears over 5 stages — name it as early as you can for big points. The fastest correct guesses score a speed bonus!": { fr: "Solo ou jusqu'à 8 joueurs ! Un personnage ou une affiche d'anime floutée s'éclaircit sur 5 niveaux — nommez-le au plus tôt pour marquer gros. Les bonnes réponses les plus rapides marquent un bonus de vitesse !", es: "¡En solitario o hasta 8 jugadores! Un personaje o una portada de anime se aclara en 5 niveles — nómbralo lo antes posible para ganar en grande. ¡Las respuestas correctas más rápidas puntúan un bonus de velocidad!" },
  "Someone else's guess is being resolved — try again in a second!": { fr: "L'essai d'un autre joueur est en cours de vérification — réessayez dans une seconde !", es: "Se está resolviendo el intento de otro jugador — ¡inténtalo en un segundo!" },
  "speed bonus": { fr: "bonus de vitesse", es: "bonus de velocidad" },
  "Stage timer": { fr: "Minuteur de niveau", es: "Temporizador de nivel" },
  "START GAME": { fr: "LANCER LA PARTIE", es: "EMPEZAR PARTIDA" },
  "Start typing and pick a suggestion — partial names like 'Yuji' also count!": { fr: "Commencez à taper et choisissez une suggestion — les noms partiels comme 'Yuji' comptent aussi !", es: "Empieza a escribir y elige una sugerencia — ¡los nombres parciales como 'Yuji' también valen!" },
  "starts —": { fr: "commence —", es: "empieza —" },
  "Stats": { fr: "Stats", es: "Estadísticas" },
  "Stay here": { fr: "Rester ici", es: "Quedarse aquí" },
  "Stay in the game": { fr: "Rester dans la partie", es: "Quedarse en la partida" },
  "Still thinking:": { fr: "Réfléchit encore :", es: "Aún pensando:" },
  "Switch the game": { fr: "Changer de jeu", es: "Cambiar de juego" },
  "Switch this room to": { fr: "Transformer ce salon en", es: "Cambiar esta sala a" },
  "Switch to": { fr: "Passer à", es: "Cambiar a" },
  "Sync": { fr: "Synchro", es: "Sincronizar" },
  "takes it!": { fr: "remporte la mise !", es: "se lo lleva!" },
  "Tap a color chip to switch to that player's board — every card glows with their color. Tap a card to eliminate it (greyed like in 1v1 Guess Who — tap again to undo). Eliminations and guesses are per-board!": { fr: "Touchez un jeton de couleur pour passer au plateau de ce joueur — chaque carte brille de sa couleur. Touchez une carte pour l'éliminer (grisée comme en Guess Who 1v1 — retouchez pour annuler). Éliminations et accusations sont par plateau !", es: "Pulsa una ficha de color para cambiar al tablero de ese jugador — cada carta brilla con su color. Pulsa una carta para eliminarla (en gris como en Guess Who 1v1 — pulsa de nuevo para deshacer). ¡Las eliminaciones y acusaciones son por tablero!" },
  "tap cards to eliminate": { fr: "touchez les cartes pour éliminer", es: "pulsa las cartas para eliminar" },
  "Tap the cards on your own board to cross out characters that no longer fit. It is your personal workspace — organize it however you like.": { fr: "Touchez les cartes de votre propre plateau pour rayer les personnages qui ne correspondent plus. C'est votre espace de travail personnel — organisez-le comme vous voulez.", es: "Pulsa las cartas de tu propio tablero para tachar los personajes que ya no encajan. Es tu espacio personal — organízalo como quieras." },
  "Target answered": { fr: "La Cible a répondu", es: "El Objetivo respondió" },
  "Target answering…": { fr: "La Cible répond…", es: "El Objetivo responde…" },
  "That image is too big (max 8 MB).": { fr: "Cette image est trop lourde (max 8 Mo).", es: "Esa imagen es demasiado grande (máx. 8 MB)." },
  "That room's queue is full (": { fr: "La file d'attente de ce salon est pleine (", es: "La cola de esa sala está llena (" },
  "That secret is already found — switch to another board!": { fr: "Ce secret est déjà trouvé — changez de plateau !", es: "Ese secreto ya fue encontrado — ¡cambia de tablero!" },
  "the character": { fr: "le personnage", es: "el personaje" },
  "That config is for another game — switch games first!": { fr: "Cette config est pour un autre jeu — change de jeu d'abord avec les cartes au-dessus !", es: "¡Esa config es de otro juego — cambia de juego primero con las cartas de arriba!" },
  "The game continues for the others — you wait in the lobby until it ends.": { fr: "La partie continue pour les autres — vous attendez dans le lobby jusqu'à la fin.", es: "La partida continúa para los demás — esperas en el lobby hasta que termine." },
  "The game is over —": { fr: "La partie est terminée —", es: "La partida terminó —" },
  "The host shuffled everything — NEW words AND NEW roles! Round restarts!": { fr: "L'hôte a tout mélangé — NOUVEAUX mots ET nouveaux rôles ! La manche recommence !", es: "¡El anfitrión lo barajó todo — palabras NUEVAS Y roles nuevos! ¡La ronda se reinicia!" },
  "The image unblurs over 5 stages, and the payout melts as it clears: stage 1 pays 5 pts… stage 5 pays only 1 pt. Trust your gut early!": { fr: "L'image se défloute sur 5 niveaux, et le gain fond à mesure : le niveau 1 rapporte 5 pts… le niveau 5 seulement 1 pt. Faites confiance à votre instinct dès le début !", es: "La imagen se aclara en 5 niveles y el pago se derrite: el nivel 1 paga 5 pts… el nivel 5 solo 1 pt. ¡Fíate de tu instinto desde el principio!" },
  "The mic goes around": { fr: "La parole circule", es: "El micro va pasando" },
  "The mystery character was": { fr: "Le personnage mystère était", es: "El personaje misterioso era" },
  "The other players will hunt it — pick well!": { fr: "Les autres joueurs vont le chasser — choisissez bien !", es: "Los demás jugadores lo cazarán — ¡elige bien!" },
  "the room host": { fr: "l'hôte du salon", es: "el anfitrión de la sala" },
  "the room host? You will lose your host permissions.": { fr: "l'hôte du salon ? Vous perdrez vos droits d'hôte.", es: "¿el anfitrión de la sala? Perderás tus permisos de anfitrión." },
  "the room is full — waiting for a free seat": { fr: "le salon est plein — en attente d'une place libre", es: "la sala está llena — esperando un asiento libre" },
  "The Target and the Hunters": { fr: "La Cible et les Chasseurs", es: "El Objetivo y los Cazadores" },
  "The target left the game!": { fr: "La Cible a quitté la partie !", es: "¡El Objetivo salió de la partida!" },
  "The two words must be different!": { fr: "Les deux mots doivent être différents !", es: "¡Las dos palabras deben ser diferentes!" },
  "The Undercover bluffs with clues that almost fit, and Mr. White improvises from the other players' clues. An odd clue is your best lead — remember who said what.": { fr: "L'Undercover bluffe avec des indices presque corrects, et Mr. White improvise à partir des indices des autres joueurs. Un indice bizarre est votre meilleure piste — souvenez-vous de qui a dit quoi.", es: "El Undercover farolea con pistas casi correctas y Mr. White improvisa a partir de las pistas de los demás. Una pista rara es tu mejor indicio — recuerda quién dijo qué." },
  "The Undercover Wins!": { fr: "L'Undercover gagne !", es: "¡El Undercover gana!" },
  "their turn!": { fr: "leur tour !", es: "¡su turno!" },
  "They were a CIVILIAN… oops!": { fr: "C'était un CIVIL… oups !", es: "¡Era un CIVIL… ups!" },
  "They were MR. WHITE!": { fr: "C'était MR. WHITE !", es: "¡Era MR. WHITE!" },
  "They were the UNDERCOVER!": { fr: "C'était l'UNDERCOVER !", es: "¡Era el UNDERCOVER!" },
  "This is the key to Battle Royale: you do NOT share one big board. Every opponent has their OWN private suspect board on your screen. Cross out cards independently — Aria's answers only shrink Aria's board!": { fr: "C'est la clé de Battle Royale : vous ne partagez PAS un seul grand plateau. Chaque adversaire a SON propre plateau de suspects privé sur votre écran. Rayez les cartes indépendamment — les réponses d'Aria ne réduisent que le plateau d'Aria !", es: "Esta es la clave de Battle Royale: NO compartes un solo tablero grande. Cada rival tiene su PROPIO tablero privado de sospechosos en tu pantalla. Tacha cartas independientemente — ¡las respuestas de Aria solo reducen el tablero de Aria!" },
  "This pair already exists!": { fr: "Cette paire existe déjà !", es: "¡Esta pareja ya existe!" },
  "this player": { fr: "ce joueur", es: "este jugador" },
  "This player will have to join again.": { fr: "Ce joueur devra rejoindre à nouveau.", es: "Este jugador tendrá que volver a unirse." },
  "This username is already taken.": { fr: "Ce pseudo est déjà pris.", es: "Este nombre de usuario ya está en uso." },
  "This uses your turn — right or wrong.": { fr: "Cela utilise votre tour — juste ou faux.", es: "Esto usa tu turno — aciertes o falles." },
  "This will cancel character selection for all players.": { fr: "Cela annulera la sélection de personnage pour tous les joueurs.", es: "Esto cancelará la selección de personaje de todos los jugadores." },
  "This will end the current game.": { fr: "Cela mettra fin à la partie en cours.", es: "Esto terminará la partida actual." },
  "Tie vote — nobody was eliminated!": { fr: "Égalité — personne n'a été éliminé !", es: "¡Empate — nadie fue eliminado!" },
  "Time to vote": { fr: "L'heure du vote", es: "Hora de votar" },
  "To Lobby": { fr: "Vers le lobby", es: "Al lobby" },
  "Too many attempts. Please wait and retry.": { fr: "Trop de tentatives. Veuillez patienter et réessayer.", es: "Demasiados intentos. Espera y reintenta." },
  "Too many players left — the game cannot continue.": { fr: "Trop de joueurs sont partis — la partie ne peut pas continuer.", es: "Se fueron demasiados jugadores — la partida no puede continuar." },
  "Track and strike": { fr: "Pistez et frappez", es: "Rastrea y golpea" },
  "Transfer Host?": { fr: "Transférer le rôle d'hôte ?", es: "¿Transferir el anfitrión?" },
  "Turn:": { fr: "Tour :", es: "Turno:" },
  "Two players, two secrets": { fr: "Deux joueurs, deux secrets", es: "Dos jugadores, dos secretos" },
  "Type a message...": { fr: "Écrivez un message...", es: "Escribe un mensaje..." },
  "Type a name first, then search.": { fr: "Tapez d'abord un nom, puis cherchez.", es: "Escribe primero un nombre y luego busca." },
  "Type the anime name…": { fr: "Tapez le nom de l'anime…", es: "Escribe el nombre del anime…" },
  "Type the character's name… (any name: Deku, Burdock…)": { fr: "Tapez le nom du personnage… (tous les noms : Deku, Burdock…)", es: "Escribe el nombre del personaje… (cualquier nombre: Deku, Burdock…)" },
  "Type your guess first!": { fr: "Tapez d'abord votre réponse !", es: "¡Escribe primero tu respuesta!" },
  "Undercover (3-8 players)": { fr: "Undercover (3-8 joueurs)", es: "Undercover (3-8 jugadores)" },
  "Undercover needs at least 3 players!": { fr: "Undercover nécessite au moins 3 joueurs !", es: "¡Undercover necesita al menos 3 jugadores!" },
  "Undercover room (on top of the built-in pairs). Type a name, click": { fr: "Salon Undercover (en plus des paires intégrées). Tapez un nom, cliquez", es: "Sala Undercover (además de las parejas integradas). Escribe un nombre, pulsa" },
  "Undercover Word Pairs": { fr: "Paires de mots Undercover", es: "Parejas de palabras Undercover" },
  "unknown error": { fr: "erreur inconnue", es: "error desconocido" },
  "Update": { fr: "Mettre à jour", es: "Actualizar" },
  "Upload my own": { fr: "Envoyer la mienne", es: "Subir la mía" },
  "Username": { fr: "Pseudo", es: "Usuario" },
  "Username changed to:": { fr: "Pseudo changé en :", es: "Usuario cambiado a:" },
  "Username: 3-20 characters, letters, numbers and _ only.": { fr: "Pseudo : 3-20 caractères, lettres, chiffres et _ uniquement.", es: "Usuario: 3-20 caracteres, letras, números y _ solamente." },
  "Vote cast! Waiting (": { fr: "Vote enregistré ! En attente (", es: "¡Voto emitido! Esperando (" },
  "Voting time": { fr: "Temps du vote", es: "Hora de votar" },
  "waiting for a seat": { fr: "en attente d'une place", es: "esperando un asiento" },
  "Waiting for host to launch new game...": { fr: "En attente de l'hôte pour lancer une nouvelle partie...", es: "Esperando al anfitrión para iniciar otra partida..." },
  "Waiting for opponent to choose...": { fr: "En attente du choix de l'adversaire...", es: "Esperando a que el rival elija..." },
  "Waiting for others to restart...": { fr: "En attente des autres pour recommencer...", es: "Esperando a los demás para reiniciar..." },
  "Waiting for players to restart...": { fr: "En attente des joueurs pour recommencer...", es: "Esperando a los jugadores para reiniciar..." },
  "Waiting for the host to deal new words…": { fr: "En attente de l'hôte pour distribuer de nouveaux mots…", es: "Esperando a que el anfitrión reparta nuevas palabras…" },
  "Waiting for the host…": { fr: "En attente de l'hôte…", es: "Esperando al anfitrión…" },
  "Waiting for the TARGET…": { fr: "En attente de la CIBLE…", es: "Esperando al OBJETIVO…" },
  "Waiting queue": { fr: "File d'attente", es: "Cola de espera" },
  "waiting their turn": { fr: "attendent leur tour", es: "esperando su turno" },
  "Waiting...": { fr: "En attente...", es: "Esperando..." },
  "Waiting…": { fr: "En attente…", es: "Esperando…" },
  "waiting) — try another room!": { fr: "en attente) — essayez un autre salon !", es: "en espera) — ¡prueba otra sala!" },
  "was voted out…": { fr: "a été éliminé au vote…", es: "fue expulsado por votos…" },
  "Welcome to Sakugame!": { fr: "Bienvenue sur Sakugame !", es: "¡Bienvenido a Sakugame!" },
  "What to guess": { fr: "Quoi deviner", es: "Qué adivinar" },
  "Which anime is this?!": { fr: "Quel est cet anime ?!", es: "¡¿Qué anime es este?!" },
  "Who is this?!": { fr: "Qui est-ce ?!", es: "¡¿Quién es este?!" },
  "Winner": { fr: "Gagnant", es: "Ganador" },
  "Winner!": { fr: "Gagnant !", es: "¡Ganador!" },
  "winning target": { fr: "cible gagnante", es: "objetivo ganador" },
  "Wins": { fr: "Victoires", es: "Victorias" },
  "wins Blur Guess with": { fr: "gagne Blur Guess avec", es: "gana Blur Guess con" },
  "Word A": { fr: "Mot A", es: "Palabra A" },
  "Word B": { fr: "Mot B", es: "Palabra B" },
  "Word history": { fr: "Historique des mots", es: "Historial de palabras" },
  "Words dealt! Check your secret word…": { fr: "Mots distribués ! Regardez votre mot secret…", es: "¡Palabras repartidas! Mira tu palabra secreta…" },
  "words were:": { fr: "mots étaient :", es: "palabras eran:" },
  "Write a short clue first!": { fr: "Écrivez d'abord un court indice !", es: "¡Escribe primero una pista corta!" },
  "Wrong guess!": { fr: "Mauvaise réponse !", es: "¡Respuesta incorrecta!" },
  "Wrong username or password.": { fr: "Mauvais pseudo ou mot de passe.", es: "Usuario o contraseña incorrectos." },
  "wrongly guessed": { fr: "s'est trompé", es: "falló" },
  "YES": { fr: "OUI", es: "SÍ" },
  "Yes, Confirm Guess": { fr: "Oui, confirmer l'essai", es: "Sí, confirmar el intento" },
  "You": { fr: "Vous", es: "Tú" },
  "You — hunter": { fr: "Vous — chasseur", es: "Tú — cazador" },
  "You are #": { fr: "Vous êtes n°", es: "Eres el n.º" },
  "You are parked AFK": { fr: "Vous êtes parqué AFK", es: "Estás aparcado AFK" },
  "spectating only, you will NOT auto-join the next seat.": { fr: "mode spectateur, vous n'entrerez PAS automatiquement.", es: "solo espectador, NO entrarás automáticamente." },
  "AFK — spectating": { fr: "AFK — spectateur", es: "AFK — espectador" },
  "Spectating —": { fr: "Spectateur —", es: "Espectador —" },
  "Live feed": { fr: "Flux en direct", es: "En directo" },
  "Wait in the lobby instead": { fr: "Attendre dans le salon", es: "Esperar en el vestíbulo" },
  "Go AFK (spectate)": { fr: "Passer AFK (spectateur)", es: "Pasar AFK (espectador)" },
  "I'm back!": { fr: "De retour !", es: "¡De vuelta!" },
  "Stay AFK (no auto-join)": { fr: "Rester AFK (sans auto-entrée)", es: "Quedarse AFK (sin auto-entrada)" },
  "Finish your game first — AFK parks you from the lobby.": { fr: "Terminez d'abord votre partie — AFK vous parque depuis le salon.", es: "Termina primero tu partida — AFK te aparca desde el vestíbulo." },
  "You are the last player — leave the room instead.": { fr: "Vous êtes le dernier joueur — quittez plutôt le salon.", es: "Eres el último jugador — sal de la sala en su lugar." },
  "You are parked AFK — watching only, no seat reserved.": { fr: "Vous êtes parqué AFK — spectateur seulement, aucune place réservée.", es: "Estás aparcado AFK — solo viendo, sin asiento reservado." },
  "Back in the queue — you'll auto-join the next free seat!": { fr: "De retour dans la file — vous entrerez automatiquement à la prochaine place !", es: "De vuelta en la cola — ¡entrarás automáticamente al siguiente asiento!" },
  "Parked AFK — you will NOT auto-join the next seat.": { fr: "Parqué AFK — vous n'entrerez PAS à la prochaine place.", es: "Aparcado AFK — NO entrarás al siguiente asiento." },
  "Ranking hidden until match end": { fr: "Classement caché jusqu'à la fin du match", es: "Clasificación oculta hasta el final" },
  "Individual guesses this match — proposals stay private.": { fr: "Essais individuels ce match — les propositions restent privées.", es: "Intentos individuales — las propuestas siguen privadas." },
  "Waiting for the next deal…": { fr: "En attente de la prochaine distribution…", es: "Esperando el próximo reparto…" },
  "Match over": { fr: "Match terminé", es: "Partida terminada" },
  "Eraser": { fr: "Gomme", es: "Borrador" },
  "Visible": { fr: "Visible", es: "Visible" },
  "Hidden": { fr: "Caché", es: "Oculta" },
  "Players see the live points ranking": { fr: "Les joueurs voient le classement des points en direct", es: "Los jugadores ven la clasificación de puntos en vivo" },
  "Revealed only at match end": { fr: "Révélé seulement en fin de match", es: "Se revela solo al final" },
  "in play": { fr: "en jeu", es: "en juego" },
  "stage": { fr: "niveau", es: "nivel" },
  "Round": { fr: "Manche", es: "Ronda" },
  "You are a CIVILIAN": { fr: "Vous êtes un CIVIL", es: "Eres un CIVIL" },
  "You are MR. WHITE": { fr: "Vous êtes MR. WHITE", es: "Eres MR. WHITE" },
  "You are not in this hunt — sit back and watch!": { fr: "Vous n'êtes pas dans cette chasse — installez-vous et regardez !", es: "No estás en esta caza — ¡siéntate y mira!" },
  "You are now the room host!": { fr: "Vous êtes maintenant l'hôte du salon !", es: "¡Ahora eres el anfitrión de la sala!" },
  "You are out — watch how it ends!": { fr: "Vous êtes éliminé — regardez la fin !", es: "Estás fuera — ¡mira cómo termina!" },
  "You are out of lives — watch the others hunt!": { fr: "Vous n'avez plus de vies — regardez les autres chasser !", es: "Te quedaste sin vidas — ¡mira cazar a los demás!" },
  "You are the TARGET — pick the mystery character!": { fr: "Vous êtes la CIBLE — choisissez le personnage mystère !", es: "¡Eres el OBJETIVO — elige el personaje misterioso!" },
  "You are the TARGET — the hunters do the guessing!": { fr: "Vous êtes la CIBLE — ce sont les chasseurs qui devinent !", es: "¡Eres el OBJETIVO — los cazadores son quienes adivinan!" },
  "You are the TARGET — wait for": { fr: "Vous êtes la CIBLE — en attente de", es: "Eres el OBJETIVO — espera a" },
  "You can guess on your turn only!": { fr: "Vous ne pouvez deviner qu'à votre tour !", es: "¡Solo puedes adivinar en tu turno!" },
  "You cannot say your word! Describe it instead.": { fr: "Vous ne pouvez pas dire votre mot ! Décrivez-le plutôt.", es: "¡No puedes decir tu palabra! Descríbela." },
  "You found it first!": { fr: "Vous l'avez trouvé en premier !", es: "¡Lo encontraste primero!" },
  "You have": { fr: "Vous avez", es: "Tienes" },
  "You have been kicked from the room.": { fr: "Vous avez été expulsé du salon.", es: "Has sido expulsado de la sala." },
  "You have no lives left!": { fr: "Vous n'avez plus de vies !", es: "¡No te quedan vidas!" },
  "You have NO word! Listen to the clues and improvise.": { fr: "Vous n'avez AUCUN mot ! Écoutez les indices et improvisez.", es: "¡No tienes NINGUNA palabra! Escucha las pistas e improvisa." },
  "You have used all your questions — you can only guess or pass!": { fr: "Vous avez utilisé toutes vos questions — vous ne pouvez que deviner ou passer !", es: "Has usado todas tus preguntas — ¡solo puedes adivinar o pasar!" },
  "You Lost": { fr: "Vous avez perdu", es: "Perdiste" },
  "You lost this one!": { fr: "Vous avez perdu celle-ci !", es: "¡Perdiste esta!" },
  "You think": { fr: "Vous pensez", es: "Crees" },
  "You think the mystery character is": { fr: "Vous pensez que le personnage mystère est", es: "Crees que el personaje misterioso es" },
  "You win Blur Guess!": { fr: "Vous gagnez Blur Guess !", es: "¡Ganas Blur Guess!" },
  "You win the Battle Royale!": { fr: "Vous gagnez le Battle Royale !", es: "¡Ganas el Battle Royale!" },
  "You WIN, target!": { fr: "Vous GAGNEZ, cible !", es: "¡GANAS, objetivo!" },
  "You Win!": { fr: "Vous gagnez !", es: "¡Ganas!" },
  "You won this one!": { fr: "Vous avez gagné celle-ci !", es: "¡Ganaste esta!" },
  "Your AniList username": { fr: "Votre pseudo AniList", es: "Tu usuario de AniList" },
  "Your clue is in! Waiting for the others (": { fr: "Votre indice est envoyé ! En attente des autres (", es: "¡Tu pista está lista! Esperando a los demás (" },
  "Your custom pairs": { fr: "Vos paires personnalisées", es: "Tus parejas personalizadas" },
  "Your opponent left during selection — back to the lobby.": { fr: "Votre adversaire est parti pendant la sélection — retour au lobby.", es: "Tu rival salió durante la selección — volviendo al lobby." },
  "Your opponent left the game — you win by default!": { fr: "Votre adversaire a quitté la partie — vous gagnez par forfait !", es: "¡Tu rival salió de la partida — ganas por abandono!" },
  "Your Secret": { fr: "Votre secret", es: "Tu secreto" },
  "Your secret — tap to hide": { fr: "Votre secret — touchez pour cacher", es: "Tu secreto — pulsa para ocultar" },
  "Your secret word": { fr: "Votre mot secret", es: "Tu palabra secreta" },
  "Your synced AniList account is loaded automatically when you host a room. Clear the field and press Sync to remove it.": { fr: "Votre compte AniList synchronisé est chargé automatiquement quand vous créez un salon. Videz le champ et appuyez sur Synchro pour le retirer.", es: "Tu cuenta de AniList sincronizada se carga automáticamente al crear una sala. Borra el campo y pulsa Sincronizar para quitarla." },
  "Your Turn": { fr: "À vous", es: "Tu turno" },
  "3 eliminated — 5 suspects left.": { fr: "3 éliminés — 5 suspects restants.", es: "3 eliminados — quedan 5 sospechosos." },
  "3-8 players! One player is the TARGET with a mystery character. Hunters take turns ASKING questions — but everyone can GUESS at any moment (wrong guess = -1 life)! First to find the mystery character wins!": { fr: "3-8 joueurs ! Un joueur est la CIBLE avec un personnage mystère. Les chasseurs POSENT des questions à tour de rôle — mais tout le monde peut DEVINER à tout moment (erreur = -1 vie) ! Le premier à trouver le personnage mystère gagne !", es: "¡3-8 jugadores! Un jugador es el OBJETIVO con un personaje misterioso. Los cazadores PREGUNTAN por turnos — ¡pero todos pueden ADIVINAR en cualquier momento (fallo = -1 vida)! ¡El primero en encontrar el personaje misterioso gana!" },
  "500 covers in the pool!": { fr: "500 covers dans la réserve !", es: "¡500 portadas en el grupo!" },
  "A blurred character slowly clears over 5 stages — name them as early as you can! Stage 1 = 5 pts, stage 5 = 1 pt. With friends, the fastest correct guesses score a speed bonus (+3/+2/+1). Playable SOLO too!": { fr: "Un personnage flouté s'éclaircit sur 5 niveaux — nommez-le au plus tôt ! Niveau 1 = 5 pts, niveau 5 = 1 pt. Entre amis, les bonnes réponses les plus rapides marquent un bonus de vitesse (+3/+2/+1). Jouable en SOLO aussi !", es: "¡Un personaje difuminado se aclara en 5 niveles — nómbralo cuanto antes! Nivel 1 = 5 pts, nivel 5 = 1 pt. Con amigos, las respuestas más rápidas puntúan bonus de velocidad (+3/+2/+1). ¡También en SOLITARIO!" },
  "A real pair from the game — both are football anime!": { fr: "Une vraie paire du jeu — les deux sont des anime de foot !", es: "¡Una pareja real del juego — los dos son anime de fútbol!" },
  "Asked by:": { fr: "Demandé par :", es: "Preguntado por:" },
  "Cancel Guess": { fr: "Annuler l'essai", es: "Cancelar intento" },
  "Describe your word in one short clue… (don't say it!)": { fr: "Décrivez votre mot en un court indice… (ne le dites pas !)", es: "Describe tu palabra con una pista corta… (¡no la digas!)" },
  "Citizens win by voting out every impostor. Impostors win once they equal the citizens. And Mr. White can steal everything: when caught, one correct guess of the secret word = instant solo win!": { fr: "Les Civils gagnent en éliminant tous les imposteurs. Les imposteurs gagnent dès qu'ils égalent les civils. Et Mr. White peut tout voler : s'il est démasqué, un seul bon essai du mot secret = victoire solo instantanée !", es: "Los Ciudadanos ganan expulsando a todos los impostores. Los impostores ganan al igualar a los ciudadanos. ¡Y Mr. White puede robarlo todo: al ser descubierto, un acierto de la palabra secreta = victoria en solitario instantánea!" },
  "Each round clears over 5 stages — earlier guess = more points. Blur Guess uses the FULL pool (no character count). Applies from the next game.": { fr: "Chaque manche s'éclaircit sur 5 niveaux — plus tôt = plus de points. Blur Guess utilise TOUTE la réserve (pas de nombre de personnages). S'applique dès la prochaine partie.", es: "Cada ronda se aclara en 5 niveles — antes = más puntos. Blur Guess usa TODO el grupo (sin número de personajes). Se aplica desde la próxima partida." },
  "Each round clears over 5 stages — earlier guess = more points. No character count: the pool is Random (everything) or Watched (only anime seen by synced accounts). Applies from the next game.": { fr: "Chaque manche s'éclaircit sur 5 niveaux — plus tôt = plus de points. Pas de nombre de personnages : la réserve est Aléatoire (tout) ou Vus (animés vus par les comptes liés). S'applique dès la prochaine partie.", es: "Cada ronda se aclara en 5 niveles — antes = más puntos. Sin número de personajes: el grupo es Aleatorio (todo) o Vistos (solo anime visto por las cuentas sincronizadas). Se aplica desde la próxima partida." },
  "Esperion is the team in Ao Ashi — not in Blue Lock. Suspicious…": { fr: "Esperion est l'équipe d'Ao Ashi — pas de Blue Lock. Suspect…", es: "Esperion es el equipo de Ao Ashi — no de Blue Lock. Sospechoso…" },
  "Every game deals one secret card to each player.": { fr: "Chaque partie distribue une carte secrète à chaque joueur.", es: "Cada partida reparte una carta secreta a cada jugador." },
  "Free guess at ANY moment — wrong guess = -1 life (": { fr: "Essai gratuit à TOUT moment — erreur = -1 vie (", es: "Intento gratis en CUALQUIER momento — fallo = -1 vida (" },
  "Free guess — anytime, even off-turn (wrong = -1 life)": { fr: "Essai gratuit — à tout moment, même hors tour (erreur = -1 vie)", es: "Intento gratis — en cualquier momento, incluso fuera de turno (fallo = -1 vida)" },
  "Guess mode: click the card you think is the mystery character! (any time — wrong = -1 life)": { fr: "Mode accusation : cliquez sur la carte qui est le personnage mystère ! (à tout moment — erreur = -1 vie)", es: "Modo acusación: pulsa la carta que creas que es el personaje misterioso (en cualquier momento — fallo = -1 vida)" },
  "High risk, high reward — bold guesses win races.": { fr: "Risque élevé, belle récompense — les audacieux gagnent les courses.", es: "Alto riesgo, alta recompensa — las acusaciones audaces ganan carreras." },
  "Hunt": { fr: "Chasser", es: "Cazar" },
  "Kira_42 was… the Undercover! Their word was Ao Ashi.": { fr: "Kira_42 était… l'Undercover ! Son mot était Ao Ashi.", es: "Kira_42 era… ¡el Undercover! Su palabra era Ao Ashi." },
  "Kira_42:": { fr: "Kira_42 :", es: "Kira_42:" },
  "Next turn": { fr: "Tour suivant", es: "Siguiente turno" },
  "No public rooms open right now… create one and set it to Public!": { fr: "Aucun salon public ouvert pour l'instant… créez-en un et mettez-le en Public !", es: "No hay salas públicas abiertas ahora… ¡crea una y ponla en Pública!" },
  "No questions left!": { fr: "Plus de questions !", es: "¡No quedan preguntas!" },
  "Only the Target sees this": { fr: "Seule la Cible voit ceci", es: "Solo el Objetivo ve esto" },
  "Out of lives": { fr: "À court de vies", es: "Sin vidas" },
  "Pass my turn": { fr: "Passer mon tour", es: "Pasar mi turno" },
  "RACE — mystery character": { fr: "RACE — personnage mystère", es: "RACE — personaje misterioso" },
  "SakuraFan:": { fr: "SakuraFan :", es: "SakuraFan:" },
  "Same game, two different boards — eliminate per rival.": { fr: "Même partie, deux plateaux différents — éliminez par rival.", es: "Misma partida, dos tableros distintos — elimina por rival." },
  "Send Clue": { fr: "Envoyer l'indice", es: "Enviar pista" },
  "Stage 1 = 5 pts … stage 5 = 1 pt.": { fr: "Niveau 1 = 5 pts … niveau 5 = 1 pt.", es: "Nivel 1 = 5 pts … nivel 5 = 1 pt." },
  "Stage 1 → 3 of 5 — already nameable?": { fr: "Niveau 1 → 3 sur 5 — déjà identifiable ?", es: "Nivel 1 → 3 de 5 — ¿ya reconocible?" },
  "Target answers: YES": { fr: "La Cible répond : OUI", es: "El Objetivo responde: SÍ" },
  "Tensa:": { fr: "Tensa :", es: "Tensa:" },
  "The FIRST correct guess in a round adds a +3 speed bonus (then +2 and +1 for the next players). A stage-1 first guess is the jackpot: 5 + 3 = 8 points!": { fr: "La PREMIÈRE bonne réponse d'une manche ajoute un bonus de vitesse +3 (puis +2 et +1 pour les suivants). Une première réponse au niveau 1, c'est le jackpot : 5 + 3 = 8 points !", es: "La PRIMERA respuesta correcta de una ronda añade un bonus de velocidad +3 (luego +2 y +1 para los siguientes). ¡Un primer acierto en nivel 1 es el bote: 5 + 3 = 8 puntos!" },
  "The Target sees the mystery character. Hunters see nothing.": { fr: "La Cible voit le personnage mystère. Les chasseurs ne voient rien.", es: "El Objetivo ve el personaje misterioso. Los cazadores no ven nada." },
  "Waiting for": { fr: "En attente de", es: "Esperando a" },
  "Waiting for everyone's answers…": { fr: "En attente des réponses de tous…", es: "Esperando las respuestas de todos…" },
  "You answered": { fr: "Vous avez répondu", es: "Respondiste" },
  "You are the TARGET — answer questions honestly (tap to hide)": { fr: "Vous êtes la CIBLE — répondez honnêtement aux questions (touchez pour cacher)", es: "Eres el OBJETIVO — responde con honestidad (pulsa para ocultar)" },
  "You can't ask anymore —": { fr: "Vous ne pouvez plus poser de question —", es: "Ya no puedes preguntar —" },
  "You guessed wrong too many times — watch the others hunt!": { fr: "Vous vous êtes trompé trop de fois — regardez les autres chasser !", es: "Fallaste demasiadas veces — ¡mira cazar a los demás!" },
  "Your shared board (real game characters)": { fr: "Votre plateau partagé (vrais personnages du jeu)", es: "Tu tablero compartido (personajes reales del juego)" },
  "asks the target": { fr: "interroge la cible", es: "pregunta al objetivo" },
  "blue prison": { fr: "prison bleue", es: "prisión azul" },
  "esperion youth team??": { fr: "l'équipe jeunes d'Esperion ??", es: "el equipo juvenil de Esperion ??" },
  "lives · guessing is FREE — anytime, even off-turn (wrong = -1 life).": { fr: "vies · deviner est GRATUIT — à tout moment, même hors tour (erreur = -1 vie).", es: "vidas · adivinar es GRATIS — en cualquier momento, incluso fuera de turno (fallo = -1 vida)." },
  "rounds! Earlier guess = more points (5 → 1), the fastest score a speed bonus (+3/+2/+1)!": { fr: "manches ! Plus tôt = plus de points (5 → 1), les plus rapides marquent un bonus de vitesse (+3/+2/+1) !", es: "¡rondas! Antes = más puntos (5 → 1), ¡los más rápidos puntúan bonus de velocidad (+3/+2/+1)!" },
  "the mystery character… or pass:": { fr: "le personnage mystère… ou passez :", es: "el personaje misterioso… o pasa:" },
  "…or use the Guess button below the board to find a secret.": { fr: "…ou utilisez le bouton Deviner sous le plateau pour trouver un secret.", es: "…o usa el botón Adivinar bajo el tablero para encontrar un secreto." },
  "(all hunters out = target wins)": { fr: "(tous les chasseurs éliminés = la cible gagne)", es: "(todos los cazadores fuera = gana el objetivo)" },
  "Ask a yes/no question to EVERYONE…": { fr: "Posez une question oui/non à TOUT LE MONDE…", es: "Haz una pregunta de sí/no a TODOS…" },
  "Ask your opponent a yes/no question...": { fr: "Posez une question oui/non à votre adversaire...", es: "Hazle una pregunta de sí/no a tu rival..." },
  "Hide/Show My Word": { fr: "Cacher/Afficher mon mot", es: "Ocultar/Mostrar mi palabra" },
  "Hunters take turns holding the mic: one yes/no question each, answered publicly by the Target. Each hunter has a limited question budget — spend them wisely!": { fr: "Les chasseurs se passent le micro : une question oui/non chacun, à laquelle la Cible répond publiquement. Chaque chasseur a un budget de questions limité — dépensez-le sagement !", es: "Los cazadores se turnan el micro: una pregunta de sí/no cada uno, respondida públicamente por el Objetivo. ¡Cada cazador tiene un presupuesto limitado de preguntas — gástalas con cabeza!" },
  "On your turn, ask ONE yes/no question — every opponent answers it publicly. Their answers narrow your boards and everyone else's at the same time.": { fr: "À votre tour, posez UNE question oui/non — chaque adversaire y répond publiquement. Leurs réponses réduisent vos plateaux et ceux de tout le monde en même temps.", es: "En tu turno, haz UNA pregunta de sí/no — cada rival la responde públicamente. Sus respuestas reducen tus tableros y los de los demás a la vez." },
  "On your turn, type one yes/no question about appearance, powers or series. The answer is public — pick questions that cut your remaining cards in half!": { fr: "À votre tour, tapez une question oui/non sur l'apparence, les pouvoirs ou la série. La réponse est publique — choisissez des questions qui divisent vos cartes restantes en deux !", es: "En tu turno, escribe una pregunta de sí/no sobre apariencia, poderes o serie. ¡La respuesta es pública — elige preguntas que partan tus cartas restantes por la mitad!" },
  "Show/Hide My Character": { fr: "Afficher/Cacher mon personnage", es: "Mostrar/Ocultar mi personaje" },
  "Tap to hide/show your secret": { fr: "Touchez pour cacher/afficher votre secret", es: "Pulsa para ocultar/mostrar tu secreto" },
  "Words can only be changed during description/vote phases.": { fr: "Les mots ne peuvent être changés que pendant les phases description/vote.", es: "Las palabras solo se pueden cambiar durante las fases de descripción/votación." },
  "Anime Guess Who?": { fr: "Anime Guess Who?", es: "Anime Guess Who?" }, // PROTECT (game/role name — stays in English)
  "Guess Who — Race": { fr: "Guess Who — Race", es: "Guess Who — Race" }, // PROTECT (game/role name — stays in English)
  "Guess Who — Battle Royale": { fr: "Guess Who — Battle Royale", es: "Guess Who — Battle Royale" }, // PROTECT (game/role name — stays in English)
  "Blur Guess": { fr: "Blur Guess", es: "Blur Guess" }, // PROTECT (game/role name — stays in English)
  "Undercover": { fr: "Undercover", es: "Undercover" }, // PROTECT (game/role name — stays in English)
  "Battle Royale": { fr: "Battle Royale", es: "Battle Royale" }, // PROTECT (game/role name — stays in English)
  "Mr. White": { fr: "Mr. White", es: "Mr. White" }, // PROTECT (game/role name — stays in English)
  "Race": { fr: "Race", es: "Race" }, // PROTECT (game/role name — stays in English)
  "· Mr. White": { fr: "· Mr. White", es: "· Mr. White" }, // PROTECT (game/role name — stays in English)
  "Guess": { fr: "Deviner", es: "Adivinar" },
  "Answer honestly, keep a straight face!": { fr: "Répondez honnêtement, gardez votre sérieux !", es: "¡Responde honestamente, mantén la cara seria!" },
  "Everyone picks a secret character. On your turn you ask ONE yes/no question and EVERYONE answers about their own secret. Eliminate cards on each opponent's colored board, guess their secrets: the earlier you find one, the more points! Last secret standing wins.": { fr: "Chacun choisit un personnage secret. À votre tour, posez UNE question oui/non et TOUT LE MONDE répond à propos de son propre secret. Éliminez des cartes sur le plateau coloré de chaque adversaire, devinez leurs secrets : plus tôt vous en trouvez un, plus vous marquez ! Le dernier secret debout gagne.", es: "Cada uno elige un personaje secreto. En tu turno haz UNA pregunta de sí/no y TODOS responden sobre su propio secreto. Elimina cartas en el tablero de colores de cada rival, adivina sus secretos: ¡cuanto antes encuentres uno, más puntas! El último secreto en pie gana." },
  "Mystery: Mikasa Ackerman": { fr: "Mystère : Mikasa Ackerman", es: "Misterio: Mikasa Ackerman" },
  "One random player is the TARGET: they secretly pick the mystery character and answer all questions honestly. Hunters take turns ASKING — but GUESSING is free for everyone, at any moment (wrong = -1 life)! First to find the mystery character wins!": { fr: "Un joueur au hasard est la CIBLE : il choisit secrètement le personnage mystère et répond honnêtement à toutes les questions. Les chasseurs POSENT des questions à tour de rôle — mais DEVINER est libre pour tous, à tout moment (erreur = -1 vie) ! Le premier à trouver le personnage mystère gagne !", es: "Un jugador al azar es el OBJETIVO: elige en secreto el personaje misterioso y responde todas las preguntas con honestidad. Los cazadores PREGUNTAN por turnos — ¡pero ADIVINAR es libre para todos, en cualquier momento (fallo = -1 vida)! ¡El primero en encontrar el personaje misterioso gana!" },
  "When YOU are the Target: only your screen shows the mystery character. Answer every question honestly with YES or NO — then sit back and enjoy the hunt. If every hunter burns all their lives on wrong guesses, the win is yours!": { fr: "Quand VOUS êtes la Cible : seul votre écran montre le personnage mystère. Répondez honnêtement à chaque question par OUI ou NON — puis installez-vous et profitez de la chasse. Si tous les chasseurs brûlent leurs vies sur des erreurs, la victoire est vôtre !", es: "Cuando TÚ eres el Objetivo: solo tu pantalla muestra el personaje misterioso. Responde honestamente a cada pregunta con SÍ o NO — luego siéntate y disfruta de la caza. ¡Si todos los cazadores queman sus vidas en fallos, la victoria es tuya!" },
  "GUESS": { fr: "DEVINEZ", es: "¡ADIVINA!" },
  "Citizen": { fr: "Civil", es: "Ciudadano" },
  // ---- v25 additions (gap fill) ----
  "Language": { fr: "Langue", es: "Idioma" },
  "You each receive a secret anime character from a shared AniList board. Take turns asking yes/no questions — the first player to name the opponent's secret wins.": { fr: "Vous recevez chacun un personnage d'anime secret depuis un plateau AniList partagé. Posez des questions oui/non à tour de rôle — le premier à nommer le secret de son adversaire gagne.", es: "Cada uno recibe un personaje de anime secreto de un tablero AniList compartido. Hagan preguntas de sí/no por turnos — el primero en nombrar el secreto de su rival gana." },
  "You were caught! Last chance — guess the civilians' word…": { fr: "Vous êtes démasqué ! Dernière chance — devinez le mot des civils…", es: "¡Te descubrieron! Última oportunidad — adivina la palabra de los civiles…" },
  "AniList account synced:": { fr: "Compte AniList synchronisé :", es: "Cuenta AniList sincronizada:" },
  "AniList sync removed.": { fr: "Synchronisation AniList supprimée.", es: "Sincronización AniList eliminada." },
  "AniList user not found:": { fr: "Utilisateur AniList introuvable :", es: "Usuario de AniList no encontrado:" },
  "Could not load synced AniList:": { fr: "Impossible de charger le compte AniList synchronisé :", es: "No se pudo cargar la cuenta AniList sincronizada:" },
  "Error checking AniList:": { fr: "Erreur lors de la vérification AniList :", es: "Error al comprobar AniList:" },
  "Enter your AniList username.": { fr: "Entrez votre nom d'utilisateur AniList.", es: "Introduce tu nombre de usuario de AniList." },
  "Loading synced AniList account": { fr: "Chargement du compte AniList synchronisé", es: "Cargando cuenta AniList sincronizada" },
  "Loading your synced AniList account": { fr: "Chargement de votre compte AniList synchronisé", es: "Cargando tu cuenta AniList sincronizada" },
  "Your AniList account": { fr: "Votre compte AniList", es: "Tu cuenta AniList" },
  "AniList favorites": { fr: "favoris AniList", es: "favoritos AniList" },
  "Favorites needs a synced AniList account (profile menu) — or switch the pool to Generic!": { fr: "Les favoris nécessitent un compte AniList synchronisé (menu profil) — ou repassez le pool sur Générique !", es: "Los favoritos necesitan una cuenta AniList sincronizada (menú perfil) — ¡o cambia el pool a Genérico!" },
  "Firebase error:": { fr: "Erreur Firebase :", es: "Error de Firebase:" },
  "Accounts not enabled yet: enable \"Email/Password\" in Firebase console (Authentication → Sign-in method).": { fr: "Comptes pas encore activés : activez \"Email/Password\" dans la console Firebase (Authentication → Sign-in method).", es: "Cuentas aún no activadas: activa \"Email/Password\" en la consola de Firebase (Authentication → Sign-in method)." },
  "Winner Character": { fr: "Personnage du gagnant", es: "Personaje del ganador" },
  "Winner Secret": { fr: "Secret du gagnant", es: "Secreto del ganador" },
  "Opponent Secret": { fr: "Secret de l'adversaire", es: "Secreto del rival" },
  // ---- v27 additions (account menu tabs + support) ----
  "Support": { fr: "Support", es: "Soporte" },
  "Contact & Support": { fr: "Contact & Support", es: "Contacto y soporte" },
  "A question, a bug to report, or an idea to improve the games? Message me on Discord — I read everything!": { fr: "Une question, un bug à signaler ou une idée pour améliorer les jeux ? Écrivez-moi sur Discord — je lis tout !", es: "¿Una pregunta, un bug que reportar o una idea para mejorar los juegos? ¡Escríbeme por Discord — lo leo todo!" },
  "Discord → Add Friend → paste my username — I usually answer within a day.": { fr: "Discord → Ajouter un ami → collez mon pseudo — je réponds généralement sous 24 h.", es: "Discord → Añadir amigo → pega mi usuario — normalmente respondo en un día." },
  "Copy": { fr: "Copier", es: "Copiar" },
  "Discord username copied!": { fr: "Pseudo Discord copié !", es: "¡Usuario de Discord copiado!" },
  // ---- v32-37 additions (Guess Who — Hot & Cold, multiplayer 2-6) ----
  "Guess Who — Hot & Cold": { fr: "Guess Who — Hot & Cold", es: "Guess Who — Hot & Cold" }, // PROTECT (game/role name — stays in English)
  "2-6 players": { fr: "2-6 joueurs", es: "2-6 jugadores" },
  "Guess Who — Hot & Cold (2-6 players)": { fr: "Guess Who — Hot & Cold (2-6 joueurs)", es: "Guess Who — Hot & Cold (2-6 jugadores)" },
  "You are a SEEKER": { fr: "Vous êtes un CHERCHEUR", es: "Eres un BUSCADOR" },
  "You are the HIDER": { fr: "Vous êtes le CACHEUR", es: "Eres el ESCONDEDOR" },
  "Draw!": { fr: "Match nul !", es: "¡Empate!" },
  "Pick any character from the pool and hide it — the seekers will feel their way to it!": { fr: "Choisissez n'importe quel personnage du pool et cachez-le — les chercheurs devront le trouver à tâtons !", es: "¡Elige cualquier personaje del pool y escóndelo — los buscadores tendrán que encontrarlo a tientas!" },
  "Type a character name…": { fr: "Tapez un nom de personnage…", es: "Escribe un nombre de personaje…" },
  "Show password": { fr: "Afficher le mot de passe", es: "Mostrar la contraseña" },
  "Hide password": { fr: "Masquer le mot de passe", es: "Ocultar la contraseña" },
  "Clear": { fr: "Effacer", es: "Borrar" },
  "Random": { fr: "Aléatoire", es: "Aleatorio" },
  "Hide this one?": { fr: "Cacher celui-ci ?", es: "¿Esconder este?" },
  "Hide it!": { fr: "Cachez-le !", es: "¡Escóndelo!" },
  "Name a character — every answer earns a 0-100 closeness score!": { fr: "Nommez un personnage — chaque réponse reçoit une note de proximité de 0 à 100 !", es: "Nombra un personaje — ¡cada respuesta recibe una puntuación de cercanía de 0 a 100!" },
  "Your guess?": { fr: "Votre essai ?", es: "¿Tu suposición?" },
  "Propose it!": { fr: "Proposez-le !", es: "¡Propónlo!" },
  "The seekers are proposing — tap a guess to score it:": { fr: "Les chercheurs proposent — touchez un essai pour le noter :", es: "Los buscadores están proponiendo — toca una suposición para puntuarla:" },
  "Their guess": { fr: "Son essai", es: "Su suposición" },
  "How close is it?": { fr: "À quel point est-ce proche ?", es: "¿Qué tan cerca está?" },
  "0 = nothing alike · 100 = exactly the one! Answer honestly — it decides the round.": { fr: "0 = rien à voir · 100 = exactement lui ! Répondez honnêtement — cela décide de la manche.", es: "0 = nada parecido · 100 = ¡exactamente ese! Responde con honestidad — decide la ronda." },
  "Send the score": { fr: "Envoyer la note", es: "Enviar la puntuación" },
  "Guesses": { fr: "Essais", es: "Intentos" },
  "Ranking": { fr: "Classement", es: "Clasificación" },
  "(left)": { fr: "(parti)", es: "(se fue)" },
  "No guesses yet": { fr: "Aucun essai pour l'instant", es: "Sin intentos todavía" },
  "Every guess counts — fewest wins!": { fr: "Chaque essai compte — le moins gagne !", es: "¡Cada intento cuenta — gana el menor!" },
  "Best guesses": { fr: "Meilleurs essais", es: "Mejores intentos" },
  "My best guesses": { fr: "Mes meilleurs essais", es: "Mis mejores intentos" },
  "Guess mode": { fr: "Mode des essais", es: "Modo de intentos" },
  "Shared guesses": { fr: "Essais partagés", es: "Intentos compartidos" },
  "Individual guesses": { fr: "Essais individuels", es: "Intentos individuales" },
  "Everyone sees every proposal & its score": { fr: "Tout le monde voit chaque proposition et sa note", es: "Todos ven cada propuesta y su nota" },
  "Everyone sees every proposal & its score (3+ players)": { fr: "Tout le monde voit chaque proposition et sa note (3+ joueurs)", es: "Todos ven cada propuesta y su nota (3+ jugadores)" },
  "Watched needs a synced AniList account (profile menu) — or pick another pool!": { fr: "Vus demande un compte AniList lié (menu profil) — ou choisissez une autre réserve !", es: "Vistos necesita una cuenta de AniList sincronizada (menú perfil) — ¡o elige otro grupo!" },
  "Shared guesses need 3+ players — this match runs in Individual!": { fr: "Les essais partagés demandent 3+ joueurs — ce match passe en Individuel !", es: "Los intentos compartidos necesitan 3+ jugadores — ¡esta partida va en Individual!" },
  "Watched pool is empty — check the AniList accounts or switch the pool.": { fr: "La réserve Vus est vide — vérifiez les comptes AniList ou changez de réserve.", es: "El grupo Vistos está vacío — revisa las cuentas de AniList o cambia de grupo." },
  "No AniList accounts in this room — using the generic pool.": { fr: "Aucun compte AniList dans ce salon — réserve générique utilisée.", es: "No hay cuentas de AniList en esta sala — se usa el grupo genérico." },
  "Each seeker sees ONLY their own — no peeking!": { fr: "Chaque chercheur ne voit QUE les siens — pas de triche !", es: "¡Cada buscador SOLO ve los suyos — sin espiar!" },
  "No proposals yet — the seekers are warming up…": { fr: "Aucune proposition pour l'instant — les chercheurs s'échauffent…", es: "Sin propuestas todavía — los buscadores se están calentando…" },
  "Secret hidden — the hunt begins!": { fr: "Secret caché — la chasse commence !", es: "¡Secreto escondido — empieza la caza!" },
  "Wait for your hiding turn!": { fr: "Attendez votre tour de cacheur !", es: "¡Espera tu turno de esconder!" },
  "Your lane is already closed for this secret!": { fr: "Votre voie est déjà fermée pour ce secret !", es: "¡Tu vía ya está cerrada para este secreto!" },
  "One proposal at a time — yours is still waiting for a score!": { fr: "Une seule proposition à la fois — la vôtre attend encore une note !", es: "¡Una propuesta a la vez — la tuya aún espera puntuación!" },
  "Hot & Cold needs at least 2 players!": { fr: "Hot & Cold nécessite au moins 2 joueurs !", es: "¡Hot & Cold necesita al menos 2 jugadores!" },
  "Leave the match?": { fr: "Quitter la partie ?", es: "¿Abandonar la partida?" },
  "Stay in the match": { fr: "Rester dans la partie", es: "Quedarse en la partida" },
  "Your banked points stay, but you stop playing — you cannot win the classement anymore.": { fr: "Vos points accumulés restent, mais vous arrêtez de jouer — vous ne pouvez plus gagner le classement.", es: "Tus puntos acumulados se quedan, pero dejas de jugar — ya no puedes ganar la clasificación." },
  "The match is over — everyone goes back to the lobby.": { fr: "La partie est terminée — tout le monde retourne au salon.", es: "La partida terminó — todos vuelven al lobby." },
  "Too many players left — the match ends here.": { fr: "Trop de joueurs sont partis — la partie s'arrête ici.", es: "Demasiados jugadores se fueron — la partida termina aquí." },
  "The hider left — the rotation moves on!": { fr: "Le cacheur est parti — la rotation continue !", es: "El escondedor se fue — ¡la rotación continúa!" },
  "The last hider left — the match ends on the current totals.": { fr: "Le dernier cacheur est parti — la partie se termine sur les totaux actuels.", es: "El último escondedor se fue — la partida termina con los totales actuales." },
  "Round over — moving on!": { fr: "Manche terminée — on continue !", es: "¡Ronda terminada — seguimos!" },
  "2-6 players! One hides a character, everyone else proposes at their own pace and the hider scores each 0-100. Every guess counts — find each secret in the fewest total guesses to win!": { fr: "2-6 joueurs ! L'un cache un personnage, tous les autres proposent à leur rythme et le cacheur note chacun de 0 à 100. Chaque essai compte — trouvez chaque secret en le moins d'essais total pour gagner !", es: "¡2-6 jugadores! Uno esconde un personaje, los demás proponen a su ritmo y el escondedor puntúa cada uno de 0 a 100. ¡Cada intento cuenta — encuentra cada secreto en el menor total de intentos para ganar!" },
  "One hides, everyone hunts": { fr: "L'un cache, tous les autres cherchent", es: "Uno esconde, todos los demás buscan" },
  "The HIDER picks any character from the whole pool. Every other player hunts at the same time, in their own lane — proposing characters at their own pace, one proposal at a time.": { fr: "Le CACHEUR choisit n'importe quel personnage du pool entier. Tous les autres joueurs cherchent en même temps, chacun dans sa voie — en proposant des personnages à leur rythme, une proposition à la fois.", es: "El ESCONDEDOR elige cualquier personaje de todo el pool. Todos los demás jugadores cazan a la vez, cada uno en su vía — proponiendo personajes a su ritmo, una propuesta cada vez." },
  "Hot or cold, 0 to 100": { fr: "Chaud ou froid, de 0 à 100", es: "Frío o caliente, de 0 a 100" },
  "The hider scores every proposal: 0 = nothing alike… 90+ = so close it burns. An exact hit is found instantly — no scoring needed! Each seeker stops when THEY find it (or after 100 tries).": { fr: "Le cacheur note chaque proposition : 0 = rien à voir… 90+ = si proche que ça brûle. Un essai exact est trouvé instantanément — pas besoin de note ! Chaque chercheur s'arrête quand IL trouve (ou après 100 essais).", es: "El escondedor puntúa cada propuesta: 0 = nada parecido… 90+ = tan cerca que quema. ¡Un acierto exacto se detecta al instante — sin puntuación! Cada buscador para cuando ÉL lo encuentra (o tras 100 intentos)." },
  "Fewer guesses wins": { fr: "Le moins d'essais gagne", es: "Gana quien adivina en menos intentos" },
  "Everyone hides once! Your classement score = the TOTAL NUMBER of guesses you took across every secret (16 + 14 guesses = 30). Scores only guide you — the LOWEST guess count takes the match!": { fr: "Tout le monde cache une fois ! Votre score au classement = le NOMBRE TOTAL d'essais utilisés sur tous les secrets (16 + 14 essais = 30). Les notes ne font que guider — le plus PETIT nombre d'essais remporte la partie !", es: "¡Todos esconden una vez! Tu puntuación en la clasificación = el TOTAL de intentos usados en todos los secretos (16 + 14 intentos = 30). Las puntuaciones solo guían — ¡el total MÁS BAJO gana la partida!" },
  "The hider's view (secret!)": { fr: "La vue du cacheur (secret !)", es: "La vista del escondedor (¡secreto!)" },
  "They guessed: \"Naruto Uzumaki\"": { fr: "Ils ont proposé : \"Naruto Uzumaki\"", es: "Propusieron: \"Naruto Uzumaki\"" },
  "SCORE": { fr: "NOTE", es: "NOTA" },
  "82 — so hot!": { fr: "82 — brûlant !", es: "82 — ¡ardiendo!" },
  "41 — lukewarm": { fr: "41 — tiède", es: "41 — tibio" },
  "5 — ice cold": { fr: "5 — glacial", es: "5 — helado" },

  "with 30 guesses": { fr: "en 30 essais", es: "con 30 intentos" },
  "with 34 guesses": { fr: "en 34 essais", es: "con 34 intentos" },
  "with 41 guesses": { fr: "en 41 essais", es: "con 41 intentos" },
};

// ---- Assembled-sentence patterns (names inside sentences) ----------------
// Used by app.js via tP(id, {n:'Toto'}) so French/Spanish word order stays natural.
var I18N_PAT = {
  pos_board:       { en: "{n}'s board", fr: "Plateau de {n}", es: "Tablero de {n}" },
  switch_board:    { en: "Switch to {n}'s board", fr: "Passer au plateau de {n}", es: "Cambiar al tablero de {n}" },
  secret_already:  { en: "{n}'s secret is already found — switch board with the color chips!", fr: "Le secret de {n} est déjà trouvé — changez de plateau avec les jetons de couleur !", es: "¡El secreto de {n} ya fue encontrado — cambia de tablero con las fichas de color!" },
  think_secret:    { en: "You think {n}'s secret is {c}?", fr: "Vous pensez que le secret de {n} est {c} ?", es: "¿Crees que el secreto de {n} es {c}?" },
  guess_mode:      { en: "Guess mode: click the card you think is {n}'s secret! (you are on their glowing board)", fr: "Mode accusation : cliquez sur la carte qui est le secret de {n} ! (vous êtes sur son plateau lumineux)", es: "Modo acusación: pulsa la carta que creas que es el secreto de {n} (estás en su tablero brillante)" },
  hunt_secret:     { en: "Hunt {n}'s secret before the others!", fr: "Trouvez le secret de {n} avant les autres !", es: "¡Encuentra el secreto de {n} antes que los demás!" },
  wait_question:   { en: "You are the TARGET — wait for {n}'s question…", fr: "Vous êtes la CIBLE — attendez la question de {n}…", es: "Eres el OBJETIVO — espera la pregunta de {n}…" },
  wait_answer:     { en: "Waiting for {n}'s answer…", fr: "En attente de la réponse de {n}…", es: "Esperando la respuesta de {n}…" },
  found_secret:    { en: "{a} found {n}'s secret:", fr: "{a} a trouvé le secret de {n} :", es: "{a} encontró el secreto de {n}:" },
  // ---- v25 additions ----
  kick_q:          { en: "Kick <b>{n}</b> from the room?", fr: "Expulser <b>{n}</b> du salon ?", es: "¿Expulsar a <b>{n}</b> de la sala?" },
  transfer_q:      { en: "Make <b>{n}</b> the room host? You will lose your host permissions.", fr: "Nommer <b>{n}</b> hôte du salon ? Vous perdrez vos permissions d'hôte.", es: "¿Hacer a <b>{n}</b> el anfitrión de la sala? Perderás tus permisos de anfitrión." },
  guess_q:         { en: "You think the mystery character is <b>{n}</b>?", fr: "Vous pensez que le personnage mystère est <b>{n}</b> ?", es: "¿Crees que el personaje misterioso es <b>{n}</b>?" },
  lives_left:      { en: "You have <b>{x}</b> lives — a wrong guess costs one!", fr: "Vous avez <b>{x}</b> vies — une erreur en coûte une !", es: "Tienes <b>{x}</b> vidas — ¡un fallo cuesta una!" },
  clears_every:    { en: "It clears every {x} seconds…", fr: "L'image devient nette toutes les {x} s…", es: "La imagen se aclara cada {x} s…" },
  switch_game_q:   { en: "Switch this room to <b>{g}</b>?", fr: "Passer ce salon au jeu <b>{g}</b> ?", es: "¿Cambiar esta sala a <b>{g}</b>?" },
  queue_warn:      { en: "Only {s} seats: <b>{o}</b> player(s) will move to the queue.", fr: "Seulement {s} places : <b>{o}</b> joueur(s) passeront en file d'attente.", es: "Solo {s} asientos: <b>{o}</b> jugador(es) pasarán a la cola." },
  share_text:      { en: "Come play {g} with me on Sakugame — room {c}!", fr: "Viens jouer à {g} avec moi sur Sakugame — salon {c} !", es: "¡Ven a jugar a {g} conmigo en Sakugame — sala {c}!" },
  share_title:     { en: "Sakugame room {c}", fr: "Salon Sakugame {c}", es: "Sala Sakugame {c}" },
  mix_label:       { en: "Mix: {v} generic · {r} favorites", fr: "Mix : {v} génériques · {r} favoris", es: "Mezcla: {v} genéricos · {r} favoritos" },
  picked_slot:     { en: "{n} picked for Word {s}", fr: "{n} choisi pour le Mot {s}", es: "{n} elegido para la Palabra {s}" },
  come_play:       { en: "a game", fr: "un jeu", es: "un juego" },
  // ---- v37 additions (Guess Who — Hot & Cold, multiplayer 2-6) ----
  hc_hide_you:     { en: "You <b>HIDE</b> this round — pick any character from the pool!", fr: "Vous <b>CACHEZ</b> dans cette manche — choisissez n'importe quel personnage du pool !", es: "Tú <b>ESCONDES</b> esta ronda — ¡elige cualquier personaje del pool!" },
  hc_track:        { en: "Track down the secret — this is guess <b>#{c}</b>! Scores only guide you — every guess counts 1, so find it in as few as possible!", fr: "Trouvez le secret — ceci est la proposition <b>n°{c}</b> ! Les notes ne font que guider — chaque essai compte 1, trouvez-le en le moins possible !", es: "Encuentra el secreto — esta es la suposición <b>n.º {c}</b>. ¡Las puntuaciones solo guían — cada intento cuenta 1, encuéntralo en los menos posibles!" },
  hc_wait_hide:    { en: "<b>{n}</b> is choosing the secret character…", fr: "<b>{n}</b> choisit le personnage secret…", es: "<b>{n}</b> está eligiendo el personaje secreto…" },
  hc_wait_score:   { en: "<b>{n}</b> is scoring your proposal…", fr: "<b>{n}</b> note votre proposition…", es: "<b>{n}</b> está puntuando tu propuesta…" },
  hc_found:        { en: "<b>{n}</b> found the secret in <b>{c}</b> guesses!", fr: "<b>{n}</b> a trouvé le secret en <b>{c}</b> essais !", es: "¡<b>{n}</b> encontró el secreto en <b>{c}</b> intentos!" },
  hc_reveal:       { en: "The secret was <b>{s}</b>.", fr: "Le secret était <b>{s}</b>.", es: "El secreto era <b>{s}</b>." },
  hc_continue_wait:{ en: "Waiting for <b>{n}</b> to start the next round…", fr: "En attente de <b>{n}</b> pour lancer la manche suivante…", es: "Esperando a que <b>{n}</b> empiece la siguiente ronda…" },
  hc_done_found:   { en: "You found it in <b>{c}</b> guesses — <b>{t}</b> total so far! Waiting for the others…", fr: "Vous l'avez trouvé en <b>{c}</b> essais — <b>{t}</b> au total pour l'instant ! En attente des autres…", es: "¡Lo encontraste en <b>{c}</b> intentos — <b>{t}</b> en total hasta ahora! Esperando a los demás…" },
  hc_done_bust:    { en: "Cap reached — <b>{t}</b> guesses on your total. Waiting for the others…", fr: "Limite atteinte — <b>{t}</b> essais sur votre total. En attente des autres…", es: "Límite alcanzado — <b>{t}</b> intentos en tu total. Esperando a los demás…" },
  hc_ans_by:       { en: "<b>{n}</b>'s guess", fr: "Proposition de <b>{n}</b>", es: "Propuesta de <b>{n}</b>" },
  hc_win_you_total:{ en: "Fewest guesses (<b>{t}</b> total) — <b>you win the Hot & Cold!</b>", fr: "Le moins d'essais (<b>{t}</b> au total) — <b>vous remportez le Hot & Cold !</b>", es: "Menos intentos (<b>{t}</b> en total) — ¡<b>ganas el Hot & Cold!</b>" },
  hc_win_total:    { en: "<b>{n}</b> wins with the fewest guesses — <b>{t}</b> total!", fr: "<b>{n}</b> gagne avec le moins d'essais — <b>{t}</b> au total !", es: "¡<b>{n}</b> gana con menos intentos — <b>{t}</b> en total!" },
  hc_draw:         { en: "Dead even on guesses — <b>it's a draw!</b>", fr: "Égalité parfaite aux essais — <b>match nul !</b>", es: "Empate total en intentos — ¡<b>es un empate!</b>" },
  hc_draw_pts:     { en: "Dead even on points — <b>it's a draw!</b>", fr: "Égalité parfaite aux points — <b>match nul !</b>", es: "Empate total en puntos — ¡<b>es un empate!</b>" },
  hc_win_you_total_pts: { en: "Most points (<b>{t}</b> total) — <b>you win the Hot & Cold!</b>", fr: "Le plus de points (<b>{t}</b> au total) — <b>vous remportez le Hot & Cold !</b>", es: "Más puntos (<b>{t}</b> en total) — ¡<b>ganas el Hot & Cold!</b>" },
  hc_win_total_pts: { en: "<b>{n}</b> wins with the most points — <b>{t}</b> total!", fr: "<b>{n}</b> gagne avec le plus de points — <b>{t}</b> au total !", es: "¡<b>{n}</b> gana con más puntos — <b>{t}</b> en total!" },
  hc_pts_word:     { en: "{c} pts", fr: "{c} pts", es: "{c} pts" },
  hc_wins_name:    { en: "<b>{n}</b> wins!", fr: "<b>{n}</b> gagne !", es: "¡<b>{n}</b> gana!" },
  hc_by_forfeit:   { en: "by forfeit — too many players left", fr: "par forfait — trop de joueurs sont partis", es: "por abandono — demasiados jugadores se fueron" },
  hc_pts_found:    { en: "found it in {c}", fr: "trouvé en {c}", es: "lo encontró en {c}" },
  hc_pts_bust:     { en: "busted at {c}", fr: "bloqué à {c}", es: "se atascó en {c}" },
  hc_pts_left:     { en: "dropped out", fr: "a quitté", es: "abandonó" },
  hc_direct:       { en: "🎯 DIRECT HIT! {n} WAS the secret — no scoring needed!", fr: "🎯 PLEIN DANS LE MILLE ! {n} ÉTAIT le secret — pas besoin de note !", es: "🎯 ¡DE LLENO! ¡{n} ERA el secreto — no hace falta puntuar!" },
  hc_rescore:      { en: "0 = nothing alike · 100 = that's exactly it! If they're proposing <b>{s}</b>, just send 100 — otherwise answer honestly, it decides the round.", fr: "0 = rien à voir · 100 = c'est exactement ça ! S'ils proposent <b>{s}</b>, envoyez 100 — sinon répondez honnêtement, cela décide de la manche.", es: "0 = nada parecido · 100 = ¡ese exacto! Si proponen <b>{s}</b>, envía 100 — si no, responde con honestidad, decide la ronda." },
  hc_round_word:   { en: "{c} guesses", fr: "Essais ({c})", es: "Intentos ({c})" },
  hc_log_mine:     { en: "My guesses ({c})", fr: "Mes essais ({c})", es: "Mis intentos ({c})" },
  hc_top_mine_tip: { en: "{c} of your guesses logged", fr: "{c} de vos essais enregistrés", es: "{c} de tus intentos registrados" },
  hc_hidden_by:    { en: "hidden by {n}", fr: "caché par {n}", es: "escondido por {n}" },
  hc_start_round:  { en: "Start round {r} — you hide!", fr: "Manche {r} — à vous de cacher !", es: "Ronda {r} — ¡te toca esconder!" },
  hc_top_plural:   { en: "{c} guesses logged", fr: "{c} essais enregistrés", es: "{c} intentos registrados" }

};

// Dynamic counter patterns: [regex, fr, es] with $1/$2 capture refs.
var I18N_RX = [
  [/^Step (\d+) of (\d+)$/, 'Étape $1 sur $2', 'Paso $1 de $2'],
  [/^Round (\d+)\/(\d+)$/, 'Manche $1/$2', 'Ronda $1/$2'],
  [/^Blur stage (\d+)\/(\d+)$/, 'Niveau de flou $1/$2', 'Nivel de desenfoque $1/$2'],
  [/^\(stage (\d+)\)$/, '(niveau $1)', '(nivel $1)'],
  [/^\((\d+) remaining\)$/, '($1 restant(s))', '($1 restantes)'],
  [/^\((\d+) votes\)$/, '($1 voix)', '($1 votos)'],
  [/^1 guess$/, '1 essai', '1 intento'],
  [/^(\d+) guesses$/, 'Essais ($1)', 'Intentos ($1)']
];
function rxTranslate(s) {
  if (LANG === 'en') return null;
  for (var i = 0; i < I18N_RX.length; i++) {
    var m = s.match(I18N_RX[i][0]);
    if (m) {
      var out = I18N_RX[i][LANG === 'fr' ? 1 : 2];
      for (var g = 1; g < m.length; g++) out = out.split('$' + g).join(m[g]);
      return out;
    }
  }
  return null;
}

// ---- Core translate helpers ------------------------------------------------
function t(s) {
  if (s == null || LANG === 'en') return s;
  var e = I18N[s];
  if (e && e[LANG]) return e[LANG];
  var r = rxTranslate(s);
  return r != null ? r : s;
}
function fmt(tpl, vars) {
  if (!vars) return tpl;
  return String(tpl).replace(/\{(\w+)\}/g, function (m, k) { return (k in vars) ? vars[k] : m; });
}
function tP(id, vars) {
  var p = I18N_PAT[id];
  if (!p) return id;
  return fmt(p[LANG] || p.en, vars);
}
// Possessive shortcut: posI18n('Toto','board') → "Toto's board" / "Plateau de Toto" / "Tablero de Toto"
function posI18n(name, kind) { return tP(kind === 'board' ? 'pos_board' : kind, { n: name }); }

// ---- Anime titles (FR / ES names picked from AniList synonyms) -------------
// ANIME_TITLE_IDX is generated below (normalized title → { fr, es }).
function normTitle(s) {
  s = String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return s.replace(/['’‘`´]/g, "'").replace(/[«»“”"]/g, ' ').replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
}
function translateAnimeTitle(name) {
  if (!name || LANG === 'en' || typeof ANIME_TITLE_IDX === 'undefined') return name;
  var e = ANIME_TITLE_IDX[normTitle(name)];
  if (!e) return name;
  var loc = e[LANG];
  if (!loc || normTitle(loc) === normTitle(name)) return name;
  return loc;
}
// Extra accepted guess spellings for a cover entry (blur mode) — localized titles
function animeAltTitles(name) {
  if (typeof ANIME_TITLE_IDX === 'undefined') return [];
  var e = ANIME_TITLE_IDX[normTitle(name)];
  if (!e) return [];
  return [e.fr, e.es].filter(Boolean);
}

// ---- DOM translation engine -------------------------------------------------
// Only translates STATIC dictionary strings; character names, anime titles,
// game names, player names, chat messages and clues are left untouched.
var SKIP_PARENT = 'script, style, noscript, [data-noi18n], .noi18n, .chat-message, .uc-clue, .history-item';
var dictRe = null;
function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function buildDictRe() {
  dictRe = null;
  if (LANG === 'en') return;
  // include identity entries (translation == key): they PROTECT phrases (e.g. game
  // titles) from being eaten by shorter keys during the substring pass, because
  // longer keys are matched first, once and non-overlapping.
  // Non-identity keys only join the SUBSTRING pass if they are multi-word or
  // long: short single words ("Game", "Race", "Hero"…) must never be replaced
  // inside proper nouns like "No Game No Life". They still work for exact
  // whole-node matches via trExact().
  var keys = Object.keys(I18N).filter(function (k) {
    if (!I18N[k][LANG]) return false;
    var ident = (I18N[k].fr === k && I18N[k].es === k);
    return ident || k.length >= 12 || k.indexOf(' ') !== -1;
  });
  keys.sort(function (a, b) { return b.length - a.length; });
  if (!keys.length) return;
  dictRe = new RegExp('(^|[^\\p{L}\\p{N}_])(' + keys.map(escRe).join('|') + ')(?![\\p{L}\\p{N}_])', 'gu');
}

// ---- Proper-noun protection (names, titles, pair words) --------------------
// A node/attribute whose WHOLE value is a known character name, anime title or
// Undercover word is never translated ("No Game No Life" stays as-is, etc.).
var PROTECT_SET = null;
function buildProtect() {
  if (PROTECT_SET) return;
  PROTECT_SET = new Set();
  function add(s) {
    if (typeof s !== 'string') return;
    var t = s.replace(/\s+/g, ' ').trim();
    if (t.length > 1 && /[A-Za-zÀ-ÿ]/.test(t)) PROTECT_SET.add(t.toLowerCase());
  }
  try { if (typeof GENERIC_CHARACTERS !== 'undefined') GENERIC_CHARACTERS.forEach(function (c) { add(c.name); add(c.series); (c.al || []).forEach(add); }); } catch (e) { }
  try { if (typeof ANIME_COVERS !== 'undefined') ANIME_COVERS.forEach(function (a) { add(a.name); (a.al || []).forEach(add); }); } catch (e) { }
  try { if (typeof UNDERCOVER_PAIRS !== 'undefined') UNDERCOVER_PAIRS.forEach(function (p) { add(p[0]); add(p[1]); }); } catch (e) { }
}
function isProtected(s) { return !!(PROTECT_SET && PROTECT_SET.has(s.toLowerCase())); }
function trExact(s) {
  if (LANG === 'en') return s;
  var e = I18N[s];
  if (e && e[LANG]) return e[LANG];
  return rxTranslate(s);
}
function trSubstring(s) {
  if (LANG === 'en' || !dictRe) return null;
  dictRe.lastIndex = 0;
  var changed = false;
  var out = s.replace(dictRe, function (m, p1, p2) {
    var e = I18N[p2];
    if (e && e[LANG]) { changed = true; return p1 + e[LANG]; }
    return m;
  });
  return changed ? out : null;
}
function skipped(node) {
  var el = node.nodeType === 3 ? node.parentElement : node;
  return el && el.closest && el.closest(SKIP_PARENT);
}
function restoreNode(node) {
  var st = node.__i18n;
  if (!st) return;
  delete node.__i18n;
  // only restore if the app hasn't rewritten the node since we translated it
  var core = (node.nodeValue || '').replace(/\s+/g, ' ').trim();
  if (core === st.out) node.nodeValue = (st.lead || '') + st.en + (st.trail || '');
}
function restoreAttrs(el) {
  var st = el.__i18nA;
  if (!st) return;
  delete el.__i18nA;
  for (var a in st) {
    if (a.slice(-6) === '__out_') continue;                     // skip trackers
    var out = st[a + '__out_'];
    if (out == null) continue;                                  // never translated
    if (el.getAttribute(a) === out) el.setAttribute(a, st[a]);  // restore original
  }
}
function restoreAll(root) {
  if (!root) return;
  translating = true;
  try {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    var n, pending = [];
    while ((n = walker.nextNode())) pending.push(n);
    for (var i = 0; i < pending.length; i++) {
      var nd = pending[i];
      if (nd.nodeType === 3) restoreNode(nd);
      else if (nd.__i18nA) restoreAttrs(nd);
    }
  } finally { translating = false; }
}
function trTextNode(node) {
  var v = node.nodeValue;
  if (!v || !/[A-Za-zÀ-ÿ]/.test(v)) return;
  var lead = v.match(/^\s*/)[0], trail = v.match(/\s*$/)[0];
  var core = v.slice(lead.length, v.length - trail.length).replace(/\s+/g, ' '); // collapse inner newlines/indents
  if (!core) return;
  var state = node.__i18n;
  var source = (state && state.en) ? state.en : core;         // translate from original EN
  if (state && state.out && core !== state.out && core !== source) { state = null; source = core; } // app rewrote the node
  if (isProtected(source)) { if (state) delete node.__i18n; return; } // proper noun — leave alone
  var out = trExact(source);
  if (out == null) out = trSubstring(source);
  if (out == null || out === source) { if (state) delete node.__i18n; return; }
  if (node.nodeValue !== lead + out + trail) node.nodeValue = lead + out + trail;
  node.__i18n = { en: source, out: out, lead: lead, trail: trail };
}
var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
function trAttrEl(el) {
  var st = el.__i18nA || (el.__i18nA = {});
  for (var i = 0; i < ATTRS.length; i++) {
    var a = ATTRS[i];
    if (!el.hasAttribute || !el.hasAttribute(a)) continue;
    if (!(a in st)) st[a] = el.getAttribute(a);               // remember original once
    var src = (st[a] == null) ? '' : String(st[a]).replace(/\s+/g, ' ');
    var t = src.trim();
    if (!t || isProtected(t)) continue;
    var out = trExact(t);
    if (out) {
      var lead = src.match(/^\s*/)[0], trail = src.match(/\s*$/)[0];
      var val = lead + out + trail;
      el.setAttribute(a, val);
      st[a + '__out_'] = val;                                 // translated value (for restore)
    }
  }
}
function hasTrAttrs(n) { return n.placeholder !== undefined || n.title || n.getAttribute('aria-label') || n.getAttribute('alt'); }
function walkTranslate(root) {
  if (LANG === 'en' || !root) return;
  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  var n;
  while ((n = walker.nextNode())) {
    if (n.nodeType === 3) { if (!skipped(n)) trTextNode(n); }
    else if (n.nodeType === 1 && n.hasAttribute && !skipped(n)) {
      if (hasTrAttrs(n)) trAttrEl(n);
    }
  }
}
var translating = false;
function handleMutations(muts) {
  if (LANG === 'en' || translating) return;
  translating = true;
  try {
    for (var i = 0; i < muts.length; i++) {
      var mu = muts[i];
      if (mu.type === 'characterData') { if (!skipped(mu.target)) trTextNode(mu.target); continue; }
      for (var j = 0; j < mu.addedNodes.length; j++) {
        var nd = mu.addedNodes[j];
        if (nd.nodeType === 3) { if (!skipped(nd)) trTextNode(nd); }
        else if (nd.nodeType === 1) {
          if (!skipped(nd) && hasTrAttrs(nd)) trAttrEl(nd);
          walkTranslate(nd);
        }
      }
    }
  } finally { translating = false; }
}
var observer = null;
function startObserver() {
  if (observer || LANG === 'en') return;
  buildDictRe();
  observer = new MutationObserver(handleMutations);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}
function setLang(l) {
  if (LANGS.indexOf(l) === -1) l = 'en';
  if (l === LANG) { syncSwitcher(); return; }
  var prev = LANG;
  LANG = l;
  try { localStorage.setItem('sakugame_lang', l); } catch (e) { }
  document.documentElement.lang = l;
  applyCssLang();
  buildDictRe();
  // 1) put back every string the observer translated (verified English originals)
  restoreAll(document.body);
  // 2) translate the whole page into the new language
  if (l !== 'en') { startObserver(); walkTranslate(document.body); }
  // 3) let the app re-render strings it builds itself (t()/tP() runtime text)
  try { window.dispatchEvent(new CustomEvent('saku-lang-change', { detail: { lang: l, prev: prev } })); } catch (e) { }
  syncSwitcher();
}

// ---- CSS-generated text (pseudo-element content, untouchable via DOM) -------
// e.g. style.css adds "How to play →" on game cards via ::after{content:...}
var CSS_TEXT = [
  ['.game-card-content::after', 'How to play →', 'Comment jouer →', 'Cómo jugar →']
];
function applyCssLang() {
  var tag = document.getElementById('i18nCss');
  var rules = '';
  if (LANG !== 'en') {
    for (var i = 0; i < CSS_TEXT.length; i++) {
      var row = CSS_TEXT[i];
      rules += row[0] + ' { content: "' + (LANG === 'fr' ? row[2] : row[3]) + '" !important; }\n';
    }
  }
  if (!rules) { if (tag) tag.remove(); return; }
  if (!tag) {
    tag = document.createElement('style');
    tag.id = 'i18nCss';
    document.head.appendChild(tag);
  }
  tag.textContent = rules;
}

// ---- Language switcher (flag buttons inside the settings panels) -----------
// The buttons live in index.html (.lang-opt[data-lang]) and call
// SAKU_I18N.setLang(...).  Here we just keep their active state in sync.
function syncSwitcher() {
  var btns = document.querySelectorAll('.lang-opt');
  for (var i = 0; i < btns.length; i++) {
    var on = btns[i].getAttribute('data-lang') === LANG;
    btns[i].classList.toggle('on', on);
    btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
  }
}

// ---- Boot -------------------------------------------------------------------
function boot() {
  buildProtect();
  document.documentElement.lang = LANG;
  applyCssLang();
  syncSwitcher();
  if (LANG !== 'en') { startObserver(); walkTranslate(document.body); }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

// ---- Public API (used by app.js) --------------------------------------------
window.SAKU_I18N = {
  get lang() { return LANG; },
  t: t, tP: tP, posI18n: posI18n, setLang: setLang,
  translateAnimeTitle: translateAnimeTitle, animeAltTitles: animeAltTitles
};
window.t = window.t || t;   // global shortcut, only if the app didn't define one
window.tP = tP;
})();
