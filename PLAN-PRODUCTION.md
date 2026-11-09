# Sakugame — préparation du service en ligne

État : **plan technique, pas un service déployé**. Le dossier Sakugame principal et la base réelle n'ont pas été modifiés. Le marché et les invocations de Sakugame Test reposent sur un simulateur local ; les exporter ne les rendrait ni multijoueurs ni sûrs.

## Risques constatés avant mise en ligne

- Le backend de test `test-stub.js` et le panneau test ne doivent jamais être expédiés en production. Le marché test refuse explicitement de fonctionner sans ce simulateur et utilise des transactions racine côté navigateur.
- L'achat de boosters est lui aussi volontairement bloqué hors du mode test. Un navigateur ne doit pas décider des tirages, soldes, garanties ou résultats.
- Le fichier de règles présent dans Sakugame indique que les comptes et les salons sont accessibles en écriture sans authentification Firebase. Une authentification Discord côté navigateur et un identifiant stocké localement ne sont pas une preuve d'identité suffisante pour protéger les cartes ou les pièces. Il faut vérifier les règles réellement déployées avant toute modification, et ne pas les remplacer sans plan de migration.
- Les niveaux, doublons, verrouillages, taxes, niveaux des exemplaires, réservations d'offres et statistiques existants exigent une migration vérifiable. Aucun compte réel ne doit être réinitialisé.

## Architecture proposée

1. **Identité** : serveur effectuant l'échange Discord OAuth avec PKCE, vérification `state` et retour d'identité vérifié, puis session courte sécurisée (cookie `Secure`, `HttpOnly`, `SameSite`, protection CSRF) ou jeton Firebase personnalisé. Secrets uniquement côté serveur. L'identité et l'autorisation ne proviennent jamais d'un ID envoyé par le client.
2. **Économie faisant autorité** : service serveur et base transactionnelle ; seuls les serveurs peuvent écrire les pièces, cartes, niveaux, garanties, offres et réservations. Le client reçoit uniquement les résultats et ne peut pas les forger. Règles de base distinctes pour profils publics, données privées et salons ; règles testées dans l'émulateur Firebase avant déploiement. Ne pas placer de droit d'écriture trop large sur un parent : les règles RTDB se propagent.
3. **Invocations** : tirage aléatoire cryptographiquement sûr côté serveur ; tarifs, catalogue et taux versionnés côté serveur ; transaction atomique : débit, tirage, garanties et attribution simultanés. Une clé d'idempotence propre à l'action évite de débiter deux fois après une reconnexion. Reprise après interruption sans double attribution.
4. **Marché** : création, annulation, achat et enchères contrôlés côté serveur ; réservation atomique d'un exemplaire précis (ID, édition et niveau), prix minimum selon la rareté serveur et taxe au moment de la vente. Les enchères utilisent une heure serveur et un règlement planifié idempotent ; annulation ou expiration sans acheteur ne prélève aucune taxe. Le verrou empêche toute nouvelle réservation. Les échanges restent suspendus.
5. **Traçabilité** : journal immuable des mouvements d'inventaire et de pièces, identifiant de transaction, version des règles, états des réservations et rapprochement des soldes ; alertes sur échecs et actions anormales. Ne pas enregistrer de jeton ou secret dans les journaux.
6. **Administration** : aucune fonction de modération, modification de rareté, compte de test infini ou porte d'accès test dans le client public. Les raretés proviennent d'un catalogue publié, versionné et contrôlé côté serveur. Les anciens drapeaux et objets test ne sont pas importés automatiquement.

## Migration et vérification

- Sauvegarder et restaurer sur une copie isolée la base réelle ; inventorier le schéma et quantifier comptes, soldes, cartes, éditions, niveaux et annonces ; tester intégrité et retour arrière.
- Associer chaque compte à une identité Discord vérifiée, sans fusion automatique de comptes ambigus. Définir explicitement la reprise des données et faire valider les cas incohérents.
- Répéter la migration dans un environnement séparé, comparer avant/après inventaires et soldes, puis geler temporairement les écritures au moment de la bascule pour éviter les pertes.
- Tester en émulateur et préproduction : droits inter-comptes, double clics et requêtes rejouées, achats concurrents, seuils de rareté, solde insuffisant, réservations, niveaux, enchères et remboursements, arrondis, pity, panne/reprise et conservation des données. Tester aussi les salons et les usages mobiles sur plusieurs appareils.
- Déployer d'abord en préproduction, puis en production seulement après contrôle des résultats, sauvegarde vérifiée et autorisation explicite. Ne pas publier les règles ni pointer les tests vers la base réelle avant cette étape.

## Décisions et accès nécessaires

Choisir l'hébergement du serveur (par exemple Cloud Run + base transactionnelle), le domaine HTTPS et l'environnement de préproduction ; disposer d'un projet Firebase distinct, d'une application Discord OAuth et de droits sur leur configuration. Aucun secret n'est requis dans cette conversation ni dans les fichiers du site. Les coûts, quotas, politique de confidentialité et conditions d'utilisation devront être confirmés avant ouverture.
