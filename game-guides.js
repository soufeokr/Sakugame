/* Concise game guides, based on the current game rules. */
(function(){
 const guides = {
  "guesswho": {
    "en": [
      "2 players",
      "Find your opponent’s secret character before they find yours.",
      [
        "Each player chooses a secret from the same board.",
        "On your turn, ask a yes/no question and eliminate characters that do not fit.",
        "On your turn, select a character to make a guess."
      ],
      "The first correct guess wins. A wrong guess ends your turn.",
      "Example: “Does your character wear glasses?”"
    ],
    "fr": [
      "2 joueurs",
      "Trouve le personnage secret adverse avant que ton adversaire ne trouve le tien.",
      [
        "Chaque joueur choisit un personnage secret sur le même plateau.",
        "À ton tour, pose une question oui/non et élimine les personnages qui ne correspondent pas.",
        "À ton tour, sélectionne un personnage pour faire une proposition."
      ],
      "La première bonne réponse gagne. Une erreur termine ton tour.",
      "Exemple : « Ton personnage porte-t-il des lunettes ? »"
    ],
    "es": [
      "2 jugadores",
      "Descubre el personaje secreto rival antes de que descubra el tuyo.",
      [
        "Cada jugador elige un personaje secreto del mismo tablero.",
        "En tu turno, haz una pregunta de sí/no y descarta los personajes que no encajen.",
        "En tu turno, selecciona un personaje para dar tu respuesta."
      ],
      "La primera respuesta correcta gana. Un error termina tu turno.",
      "Ejemplo: «¿Tu personaje lleva gafas?»"
    ]
  },
  "undercover": {
    "en": [
      "3–12 players",
      "Find the impostors without revealing your secret word.",
      [
        "Citizens share a word; Undercover receives a similar word. Mr. White, if enabled, gets no word.",
        "Give clues in turn, discuss, then vote to eliminate a suspect.",
        "Repeat until a side wins. An eliminated Mr. White can guess the citizens’ word."
      ],
      "Citizens win by eliminating all impostors. Otherwise, impostors win when only two players remain or no citizen remains.",
      "Mr. White wins alone by correctly guessing the word when eliminated."
    ],
    "fr": [
      "3 à 12 joueurs",
      "Repère les imposteurs sans révéler ton mot secret.",
      [
        "Les citoyens ont le même mot ; les Undercover ont un mot proche. Mr. White, s’il est activé, n’a pas de mot.",
        "Donnez chacun un indice, discutez, puis votez pour éliminer un suspect.",
        "Répétez jusqu’à la victoire d’un camp. Mr. White éliminé peut deviner le mot des citoyens."
      ],
      "Les citoyens gagnent en éliminant tous les imposteurs. Sinon, les imposteurs gagnent lorsqu’il ne reste que deux joueurs ou aucun citoyen.",
      "Mr. White gagne seul s’il devine le mot au moment de son élimination."
    ],
    "es": [
      "3 a 12 jugadores",
      "Detecta a los impostores sin revelar tu palabra secreta.",
      [
        "Los civiles comparten una palabra; los Undercover reciben una parecida. Mr. White, si está activado, no recibe ninguna.",
        "Dad pistas por turnos, debatid y votad para eliminar a un sospechoso.",
        "Repetid hasta que gane un bando. Al ser eliminado, Mr. White puede adivinar la palabra de los civiles."
      ],
      "Los civiles ganan si eliminan a todos los impostores. Si no, los impostores ganan cuando quedan dos jugadores o ningún civil.",
      "Mr. White gana en solitario si acierta la palabra al ser eliminado."
    ]
  },
  "battle": {
    "en": [
      "3–12 players",
      "Find opponents’ secrets and finish with the most points.",
      [
        "Everyone chooses a secret character. Each opponent has a separate board you can mark.",
        "Ask one yes/no question on your turn; all opponents answer. Use each answer on the matching board.",
        "Guess a rival’s character on your turn. An incorrect guess uses your turn."
      ],
      "Correct guesses score points; the highest score wins when at most one secret remains.",
      "Earlier discoveries are worth more points."
    ],
    "fr": [
      "3 à 12 joueurs",
      "Trouve les secrets adverses et termine avec le plus de points.",
      [
        "Chacun choisit un personnage secret. Tu disposes d’un plateau distinct pour chaque adversaire.",
        "À ton tour, pose une question oui/non : tous les adversaires répondent. Utilise chaque réponse sur le bon plateau.",
        "À ton tour, devine le personnage d’un adversaire. Une erreur utilise ton tour."
      ],
      "Les bonnes réponses rapportent des points ; le meilleur score gagne lorsqu’il reste au plus un secret.",
      "Les secrets découverts tôt rapportent davantage de points."
    ],
    "es": [
      "3 a 12 jugadores",
      "Descubre los secretos rivales y termina con más puntos.",
      [
        "Cada jugador elige un personaje secreto. Tienes un tablero independiente para cada rival.",
        "En tu turno, haz una pregunta de sí/no: todos los rivales responden. Usa cada respuesta en su tablero.",
        "En tu turno, adivina el personaje de un rival. Un error consume tu turno."
      ],
      "Los aciertos dan puntos; gana la puntuación más alta cuando queda como máximo un secreto.",
      "Descubrir secretos antes da más puntos."
    ]
  },
  "race": {
    "en": [
      "3–12 players",
      "As a hunter, be the first to find the target’s character.",
      [
        "One player is the Target and knows the secret; everyone else is a hunter.",
        "Hunters take turns asking yes/no questions. The Target answers publicly.",
        "Hunters can guess at any time; each wrong guess costs one life. Lives and questions are configurable."
      ],
      "The first hunter to guess correctly wins. The Target wins if all hunters run out of lives.",
      "By default, each hunter has 3 lives and 8 questions."
    ],
    "fr": [
      "3 à 12 joueurs",
      "En tant que chasseur, sois le premier à trouver le personnage de la cible.",
      [
        "Un joueur est la cible et connaît le secret ; les autres sont chasseurs.",
        "Les chasseurs posent chacun leur tour une question oui/non. La cible répond publiquement.",
        "Un chasseur peut proposer une réponse à tout moment ; chaque erreur coûte une vie. Vies et questions sont réglables."
      ],
      "Le premier chasseur qui trouve gagne. La cible gagne si tous les chasseurs perdent leurs vies.",
      "Par défaut : 3 vies et 8 questions par chasseur."
    ],
    "es": [
      "3 a 12 jugadores",
      "Como cazador, sé el primero en descubrir el personaje del objetivo.",
      [
        "Un jugador es el objetivo y conoce el secreto; los demás son cazadores.",
        "Los cazadores hacen preguntas de sí/no por turnos. El objetivo responde en público.",
        "Los cazadores pueden adivinar en cualquier momento; cada fallo cuesta una vida. Las vidas y preguntas se pueden ajustar."
      ],
      "Gana el primer cazador que acierte. El objetivo gana si todos los cazadores pierden sus vidas.",
      "Por defecto: 3 vidas y 8 preguntas por cazador."
    ]
  },
  "blur": {
    "en": [
      "1–12 players",
      "Identify a blurred character or anime cover as early as possible.",
      [
        "Choose characters or covers in the room settings.",
        "Type your answer while the image becomes clearer over five stages.",
        "A correct answer scores 5 to 1 base points depending on the stage; the first three correct players receive +3, +2 and +1."
      ],
      "After all rounds, the highest score wins.",
      "Example: first correct answer at stage 1 = 5 + 3 = 8 points."
    ],
    "fr": [
      "1 à 12 joueurs",
      "Identifie un personnage ou une affiche d’anime flouté le plus tôt possible.",
      [
        "Choisis le mode personnages ou affiches dans les paramètres du salon.",
        "Saisis ta réponse pendant que l’image se précise en cinq étapes.",
        "Une bonne réponse vaut de 5 à 1 point selon l’étape ; les trois premières réponses correctes reçoivent +3, +2 et +1."
      ],
      "Après tous les rounds, le meilleur score gagne.",
      "Exemple : première bonne réponse à l’étape 1 = 5 + 3 = 8 points."
    ],
    "es": [
      "1 a 12 jugadores",
      "Identifica un personaje o una portada de anime borrosa lo antes posible.",
      [
        "Elige personajes o portadas en los ajustes de la sala.",
        "Escribe tu respuesta mientras la imagen se aclara en cinco etapas.",
        "Un acierto vale de 5 a 1 punto según la etapa; los tres primeros en acertar reciben +3, +2 y +1."
      ],
      "Tras todas las rondas, gana la puntuación más alta.",
      "Ejemplo: primer acierto en la etapa 1 = 5 + 3 = 8 puntos."
    ]
  },
  "hotcold": {
    "en": [
      "2–12 players",
      "Find the hidden character using the hider’s hot-or-cold ratings.",
      [
        "One player hides a character; everyone else submits character guesses.",
        "The hider rates each guess from 0 to 100. An exact match is detected automatically.",
        "Everyone takes a turn hiding. The room can use shared or individual guesses."
      ],
      "Individual: fewest total guesses wins. Shared: highest total rating wins.",
      "Shared mode needs at least 3 players; with 2, the game uses individual mode."
    ],
    "fr": [
      "2 à 12 joueurs",
      "Trouve le personnage caché grâce aux indices chaud/froid du cacheur.",
      [
        "Un joueur cache un personnage ; les autres proposent des personnages.",
        "Le cacheur note chaque proposition de 0 à 100. Une réponse exacte est détectée automatiquement.",
        "Chacun cache un personnage à son tour. Les propositions peuvent être partagées ou individuelles."
      ],
      "Individuel : le moins de propositions gagne. Partagé : le plus grand total de points gagne.",
      "Le mode partagé nécessite au moins 3 joueurs ; à 2, le mode individuel est utilisé."
    ],
    "es": [
      "2 a 12 jugadores",
      "Encuentra el personaje oculto con las pistas frío/caliente de quien lo esconde.",
      [
        "Un jugador esconde un personaje; los demás proponen personajes.",
        "Quien lo esconde puntúa cada propuesta de 0 a 100. Un acierto exacto se detecta automáticamente.",
        "Todos esconden un personaje por turnos. Las propuestas pueden ser compartidas o individuales."
      ],
      "Individual: gana quien haga menos propuestas. Compartido: gana la puntuación total más alta.",
      "El modo compartido necesita al menos 3 jugadores; con 2 se usa el individual."
    ]
  },
  "codenames": {
    "en": [
      "4–12 players",
      "Find all your team’s agents while avoiding the assassin.",
      [
        "Split into two teams. Each Ninja sees the hidden colours on the 24-character board.",
        "The Ninja gives a clue and selects the targeted cards; teammates reveal cards based on the clue.",
        "A correct pick keeps the turn going. A neutral or opposing card ends it; a perfect sequence earns bonus picks."
      ],
      "The first team to reveal all its agents wins. Revealing the assassin immediately loses the game.",
      "Example: “sword ×2” suggests two characters linked to swords. A clue cannot contain a visible character name."
    ],
    "fr": [
      "4 à 12 joueurs",
      "Retrouve tous les agents de ton équipe sans révéler l’assassin.",
      [
        "Formez deux équipes. Chaque Ninja voit les couleurs cachées du plateau de 24 personnages.",
        "Le Ninja donne un indice et sélectionne les cartes visées ; ses coéquipiers révèlent des cartes grâce à cet indice.",
        "Une bonne carte prolonge le tour. Une carte neutre ou adverse l’arrête ; une série parfaite donne des propositions bonus."
      ],
      "La première équipe à révéler tous ses agents gagne. Révéler l’assassin fait perdre immédiatement.",
      "Exemple : « épée ×2 » suggère deux personnages liés aux épées. L’indice ne peut pas contenir un nom visible."
    ],
    "es": [
      "4 a 12 jugadores",
      "Encuentra todos los agentes de tu equipo sin revelar al asesino.",
      [
        "Formad dos equipos. Cada Ninja ve los colores ocultos del tablero de 24 personajes.",
        "El Ninja da una pista y selecciona las cartas a las que se refiere; sus compañeros revelan cartas según la pista.",
        "Un acierto mantiene el turno. Una carta neutral o rival lo termina; una serie perfecta da intentos extra."
      ],
      "Gana el primer equipo que revele todos sus agentes. Revelar al asesino supone una derrota inmediata.",
      "Ejemplo: «espada ×2» sugiere dos personajes relacionados con espadas. La pista no puede contener un nombre visible."
    ]
  },
  "snapshot": {
    "en": [
      "1–12 players",
      "Name the anime from its images before the other players.",
      [
        "Each round reveals up to four images from the same anime, one stage at a time.",
        "Type the anime title; at the last stage, a partial title hint appears.",
        "A correct answer scores 4 to 1 base points by stage; the first three correct players receive +3, +2 and +1."
      ],
      "After all rounds, the highest score wins.",
      "Example: first correct answer at stage 1 = 4 + 3 = 7 points."
    ],
    "fr": [
      "1 à 12 joueurs",
      "Trouve le titre de l’anime à partir de ses images avant les autres.",
      [
        "Chaque round révèle jusqu’à quatre images d’un même anime, étape par étape.",
        "Saisis le titre de l’anime ; à la dernière étape, un indice partiel apparaît.",
        "Une bonne réponse vaut de 4 à 1 point selon l’étape ; les trois premières réponses correctes reçoivent +3, +2 et +1."
      ],
      "Après tous les rounds, le meilleur score gagne.",
      "Exemple : première bonne réponse à l’étape 1 = 4 + 3 = 7 points."
    ],
    "es": [
      "1 a 12 jugadores",
      "Adivina el título del anime a partir de sus imágenes antes que los demás.",
      [
        "Cada ronda revela hasta cuatro imágenes del mismo anime, una etapa a la vez.",
        "Escribe el título del anime; en la última etapa aparece una pista parcial.",
        "Un acierto vale de 4 a 1 punto según la etapa; los tres primeros en acertar reciben +3, +2 y +1."
      ],
      "Tras todas las rondas, gana la puntuación más alta.",
      "Ejemplo: primer acierto en la etapa 1 = 4 + 3 = 7 puntos."
    ]
  }
};
 const annotations={"guesswho":{"pos":[[74,19],[75,38],[14,84]],"fr":["Pose ta question ici, puis lis la réponse.","Barre les personnages incompatibles sur ton plateau.","Ton personnage secret : ton adversaire essaie aussi de le trouver."],"en":["Ask your question here, then read the answer.","Cross out incompatible characters on your board.","Your secret character: your opponent is trying to find it too."],"es":["Haz tu pregunta aquí y lee la respuesta.","Descarta en tu tablero los personajes que no encajen.","Tu personaje secreto: tu rival también intenta encontrarlo."]},"undercover":{"pos":[[52,25],[27,57],[50,78]],"fr":["Ton mot est secret : décris-le sans le dire.","Chacun donne un indice à son tour.","Compare les indices, puis vote pour un suspect."],"en":["Your word is secret: describe it without saying it.","Everyone gives a clue in turn.","Compare clues, then vote for a suspect."],"es":["Tu palabra es secreta: descríbela sin decirla.","Cada jugador da una pista por turnos.","Compara las pistas y vota a un sospechoso."]},"battle":{"pos":[[24,16],[17,28],[52,72]],"fr":["Ton personnage secret et tes points.","Choisis un adversaire pour afficher son plateau.","Élimine les personnages selon ses réponses."],"en":["Your secret character and your points.","Choose a rival to view their board.","Eliminate characters using their answers."],"es":["Tu personaje secreto y tus puntos.","Elige un rival para ver su tablero.","Descarta personajes según sus respuestas."]},"race":{"pos":[[51,12],[60,31],[53,65]],"fr":["Les cœurs indiquent les vies des chasseurs.","Pose une question à ton tour.","Devine à tout moment : une erreur coûte une vie."],"en":["Hearts show each hunter’s lives.","Ask a question on your turn.","Guess at any time: a wrong answer costs a life."],"es":["Los corazones indican las vidas de cada cazador.","Haz una pregunta en tu turno.","Adivina en cualquier momento: un error cuesta una vida."]},"blur":{"pos":[[60,8],[50,35],[48,83]],"fr":["Les étapes indiquent combien de points restent.","L’image floue se précise progressivement.","Saisis le nom dès que tu reconnais l’image."],"en":["The stage shows how many base points remain.","The blurred image gradually becomes clearer.","Enter the name as soon as you recognize it."],"es":["La etapa indica los puntos base disponibles.","La imagen borrosa se aclara poco a poco.","Escribe el nombre en cuanto la reconozcas."]},"hotcold":{"pos":[[39,37],[33,76],[87,67]],"fr":["Propose ici un personnage à chercher.","Le cacheur note la proximité : plus le score est haut, plus tu es proche.","Retrouve les propositions et leurs notes dans l’historique."],"en":["Enter a character guess here.","The hider rates similarity: a higher score means closer.","Review the guesses and ratings in the history."],"es":["Propón aquí un personaje.","Quien esconde puntúa la cercanía: cuanto mayor, más cerca.","Consulta las propuestas y sus puntuaciones en el historial."]},"codenames":{"pos":[[50,8],[50,23],[46,63]],"fr":["Les compteurs indiquent les agents restants.","Le Ninja donne un indice et le nombre de cartes visées.","Les coéquipiers choisissent les cartes ; attention à l’assassin caché. Vue montrée : coéquipier."],"en":["Counters show the agents still to find.","The Ninja gives a clue and its target count.","Teammates pick cards; beware the hidden assassin. Shown: teammate view."],"es":["Los contadores indican los agentes restantes.","El Ninja da una pista y el número de cartas relacionadas.","El equipo elige cartas; cuidado con el asesino oculto. Vista: compañero."]},"snapshot":{"pos":[[64,8],[31,33],[43,75]],"fr":["Quatre étapes révèlent les images au fil du temps.","Observe les images d’un même anime.","Saisis son titre : plus tu trouves tôt, plus tu marques."],"en":["Four stages reveal images over time.","Look at the images from the same anime.","Enter its title: the earlier you solve, the more you score."],"es":["Las imágenes se revelan en cuatro etapas.","Observa las imágenes del mismo anime.","Escribe el título: cuanto antes aciertes, más puntos."]}};
 const labels={en:['OBJECTIVE','How to play','How to win','Good to know','Example gameplay · French interface','Enlarge image','Close image'],fr:['OBJECTIF','Comment jouer','Pour gagner','À retenir','Exemple de partie · interface en français','Agrandir l’image','Fermer l’image'],es:['OBJETIVO','Cómo jugar','Cómo ganar','A tener en cuenta','Ejemplo de partida · interfaz en francés','Ampliar imagen','Cerrar imagen']};
 function escape(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 window.sakuGameGuide=function(id){const g=guides[id];if(!g)return null;const lang=(window.SAKU_I18N&&window.SAKU_I18N.lang)||'en', v=g[lang]||g.en, l=labels[lang]||labels.en, anno=annotations[id], notes=anno[lang]||anno.en;
  return {players:v[0],html:'<div class="guide-layout"><section class="guide-goal"><span class="guide-eyebrow">'+l[0]+'</span><p>'+escape(v[1])+'</p><figure class="guide-figure"><button type="button" class="guide-image-button" onclick="sakuGuideImage(\''+id+'\')" aria-label="'+escape(l[5])+'"><img src="guide-images/'+id+'.jpg?v=232" alt="'+escape(l[4])+'" loading="lazy">'+anno.pos.map((p,i)=>'<span class="guide-pin" style="left:'+p[0]+'%;top:'+p[1]+'%" aria-hidden="true">'+(i+1)+'</span>').join('')+'<span class="guide-image-zoom" aria-hidden="true">⤢</span></button><figcaption>'+l[4]+' <span>· '+l[5]+'</span></figcaption><ol class="guide-annotations">'+notes.map((n,i)=>'<li><span>'+(i+1)+'</span><p>'+escape(n)+'</p></li>').join('')+'</ol></figure></section><section class="guide-main"><h4>'+l[1]+'</h4><ol class="guide-steps">'+v[2].map((x,i)=>'<li><span class="guide-num">0'+(i+1)+'</span><p>'+escape(x)+'</p></li>').join('')+'</ol><div class="guide-win"><span class="guide-win-icon">✦</span><div><h4>'+l[2]+'</h4><p>'+escape(v[3])+'</p></div></div><div class="guide-tip"><b>'+l[3]+'</b><p>'+escape(v[4])+'</p></div></section></div>'};
 };
 window.sakuGuideImage=function(id){if(!guides[id])return;const lang=(window.SAKU_I18N&&window.SAKU_I18N.lang)||'en',l=labels[lang]||labels.en;let dlg=document.getElementById('guideImageDialog');if(!dlg){dlg=document.createElement('dialog');dlg.id='guideImageDialog';dlg.className='guide-image-dialog';dlg.innerHTML='<button type="button" class="guide-image-close">×</button><div class="guide-dialog-frame"><img alt=""><div class="guide-dialog-pins"></div></div><p></p><ol class="guide-annotations"></ol>';document.body.appendChild(dlg);dlg.querySelector('button').addEventListener('click',()=>dlg.close());dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});dlg.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();e.preventDefault();dlg.close();}},true);}dlg.querySelector('button').setAttribute('aria-label',l[6]);dlg.querySelector('img').src='guide-images/'+id+'.jpg?v=232';dlg.querySelector('img').alt=l[4];dlg.querySelector('p').textContent=l[4];const anno=annotations[id];dlg.querySelector('.guide-dialog-pins').innerHTML=anno.pos.map((p,i)=>'<span class="guide-pin" style="left:'+p[0]+'%;top:'+p[1]+'%">'+(i+1)+'</span>').join('');dlg.querySelector('ol').innerHTML=(anno[lang]||anno.en).map((n,i)=>'<li><span>'+(i+1)+'</span><p>'+escape(n)+'</p></li>').join('');dlg.setAttribute('aria-label',l[4]);if(!dlg.open)dlg.showModal();};
})();
