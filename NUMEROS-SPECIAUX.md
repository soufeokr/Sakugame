# Numérotation des cartes spéciales

Les spéciales partagent une numérotation indépendante de celle des cartes ordinaires. Le registre est commun à tous les joueurs.

- **The Strongest : `#S-001` à `#S-022`**. Les vingt premiers numéros restent inchangés ; les nouvelles cartes Edward Newgate et Madoka Kaname occupent les deux numéros suivants.
- **Hoshi : `#S-023` à `#S-044`**. Reze ouvre la série, puis les autres cartes suivent l'ordre déjà utilisé.

Cette réorganisation modifie uniquement les numéros visibles : les identifiants `strongest_…` et `hoshi_…`, les possessions et les transactions restent identiques. Les modèles Hoshi, leurs données et les numéros sont dans `hoshi-data.js` ; le registre Strongest est dans `strongest-sync.js`. Toute nouvelle spéciale doit recevoir un numéro inutilisé, quelle que soit son édition.
