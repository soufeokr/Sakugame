# Portail Cinéma — critères et limites

Le portail conserve les œuvres conçues comme films indépendants et les univers pour lesquels un film est retenu comme faisant partie de la continuité principale. Les OAV/OVA, les compilations et films résumés ainsi que les films hors canon ne rendent pas un univers éligible. La classification canonique d'une franchise pouvant être controversée ou changer selon la continuité, la sélection est **prudente et incomplète** : un cas ambigu est omis en attendant une vérification éditoriale. Les cartes déjà possédées et les boosters achetés avant ce changement ne sont pas supprimés.

Exemples : Naruto reste inclus grâce à *The Last*, Dragon Ball grâce à *Battle of Gods* et *Resurrection F*, Jujutsu Kaisen grâce à *Jujutsu Kaisen 0* et Chainsaw Man grâce à *Reze Arc*. Bocchi the Rock! et Gurren Lagann sont exclus : leurs films identifiés résument la série. Les films One Piece ne rendent pas l'univers ordinaire éligible, leur canonicité étant contestée. **Exception demandée par l'utilisateur : la carte spéciale Hoshi Uta reste disponible dans le portail**, même si *Film: Red* n'est pas retenu comme justificatif pour les cartes ordinaires.

L'index `cinema-index.js` s'appuie sur les titres et personnages AniList, puis les relations entre œuvres voisines. Les films sont limités au format `MOVIE` et à une sortie au plus tard le 6 novembre 2026. Les identifiants sont conservés dans l'index. La liste éditoriale des films de franchise retenus est `tools/cinema-canon-films.json` ; ceux exclus comme résumés figurent dans `tools/cinema-recap-exclusions.json`. Les caches AniList sont `tools/cinema-media-cache.json`, `tools/cinema-films-cache.json` et `tools/cinema-film-descriptions.json`. Le script `tools/build-cinema-index.py` applique ces critères.

Repères pour les cas les plus connus :
- Naruto : https://www.narutohq.com/movies
- Film Red, distinction entre Uta et l'histoire du film : https://www.yahoo.com/entertainment/explained-one-piece-film-red-140005872.html
- My Hero Academia: Two Heroes, déclaration rapportée du créateur : https://epicstream.com/article/my-hero-academia-creator-says-two-heroes-movie-is-canon-to-series-manga

La liste n'est pas exhaustive et les sources secondaires ne remplacent pas une confirmation officielle du canon pour chaque œuvre. Les liens AniList entre œuvres ne prouvent pas, à eux seuls, qu'un film est canonique ; ils servent uniquement à identifier les candidats.
