# Radar Gratuit

Application locale de veille d'offres publiques, en français. Elle conserve les données sur votre ordinateur et ne nécessite aucun compte, aucune API payante, ni installation de bibliothèque supplémentaire.

## Installation et démarrage sous Windows

1. Installez **Node.js 24 ou plus récent** depuis [nodejs.org](https://nodejs.org/) (version officielle gratuite). Fermez et rouvrez la fenêtre de commande si Node vient d'être installé.
2. Décompressez toute l'archive dans un dossier où vous pouvez écrire.
3. Double-cliquez sur `Demarrer.bat` et laissez la fenêtre ouverte.
4. Dans votre navigateur, ouvrez [http://127.0.0.1:3210](http://127.0.0.1:3210).
5. Ouvrez **Sources**, ajoutez au besoin des flux RSS/Atom ou des pages de promotions, puis cliquez sur **Actualiser les sources**. Les erreurs d'accès figurent sous chaque source.
6. Dans **Préférences**, réglez pays, région, intervalle et mots-clés d'alertes. Les fiches correspondant au pays ou à la région sont privilégiées dans le tri par nouveauté, sans supposer admissibles les offres dont le pays est inconnu.

Vous pouvez aussi lancer `node server.js` depuis le dossier. Fermez la fenêtre pour arrêter. Si le port 3210 est occupé, dans PowerShell utilisez `$env:PORT=3211; node server.js` puis ouvrez `http://127.0.0.1:3211`.

La base SQLite est créée automatiquement dans `data/radar.sqlite` ; sauvegardez le dossier `data` quand l'application est arrêtée. Le ZIP ne contient aucune offre fictive ni donnée personnelle. Le scanner utilise Internet, mais l'interface et la base sont locales. Ne publiez pas le serveur sur Internet ou un réseau partagé.

## Utilisation

- Le tableau de bord présente les résultats et les filtres ; les nombres représentent les fiches dans votre base locale, pas toutes les offres du Web. Les flux par défaut sont des pistes de découverte anglophones et francophones et peuvent changer ou devenir indisponibles.
- Pour chercher sur le Web, utilisez **Sources → Rechercher sur le Web** : un flux Google Actualités correspondant est ajouté à la surveillance. La barre principale recherche dans les fiches déjà enregistrées. Les résultats Google Actualités peuvent être des articles ou intermédiaires et non la page officielle.
- Ajoutez une URL directe dans **Sources**, puis actualisez pour obtenir une fiche issue de cette page. Un flux ajoute jusqu'à 30 éléments par analyse. Leur texte de résumé est analysé ; les pages liées ne sont pas suivies automatiquement.
- Ouvrez une fiche pour compléter l'URL officielle, le pays, les frais, le montant, les étapes, la carte, les restrictions, les conditions de retrait et la date. « Inconnu » veut dire que l'application ne dispose pas de cette information. Le lien de découverte et le lien officiel sont distincts ; ce dernier doit être renseigné après vérification.
- La gratuité n'est **jamais confirmée automatiquement**. Vérifiez les conditions officielles, cochez les cinq critères et indiquez une preuve datée dans la fiche. Une offre avec frais ou achat obligatoires doit être classée « Frais ou achat requis ». Les concours restent séparés, même si leurs conditions sont gratuites. Les anciennes confirmations sont remises à vérifier lorsque le contenu observé change.
- Une carte bancaire ou un compte gratuits peuvent coexister avec le statut de gratuité. Le filtre « Sans carte bancaire confirmée » ne conserve que les fiches explicitement marquées « Non » après vérification. Le filtre « Gratuité confirmée » impose les cinq critères, dont l'absence de dépôt et de frais.
- Un code public détecté est « À vérifier » ; précisez son avantage, ses restrictions et son statut après contrôle. Le bouton copie le code. Si un site propose un mécanisme officiel de génération, suivez son lien officiel et utilisez ce mécanisme ; l'application ne se connecte pas aux comptes et ne génère pas elle-même de code ni de lien. Aucun code aléatoire n'est présenté comme fonctionnel.
- Les favoris, offres utilisées et consultations sont conservés. Le tri par valeur compare seulement le premier nombre indiqué : il ne convertit pas les devises et ne garantit pas une comparaison pertinente entre crédits et argent retirable.
- Les doublons exacts d'URL (hors paramètres de suivi usuels) sont fusionnés ; les titres identiques suffisamment longs ou liens officiels identiques sont signalés comme doublons possibles, sans fusion automatique. Des doublons aux formulations différentes peuvent ne pas être reconnus.

## Surveillance et alertes

Quand le serveur est ouvert, chaque source est analysée à l'intervalle configuré, à partir du lancement ; le bouton permet une analyse immédiate. Les alertes locales sont dédupliquées et concernent les nouvelles fiches selon vos mots-clés, les codes détectés, les changements du texte observé, les favoris expirant dans les trois jours et une page directe surveillée retournant HTTP 404/410. L'onglet Alertes conserve ces messages ; pour des notifications système, autorisez-les dans cet onglet et gardez la page ouverte. Aucun courriel ou SMS n'est envoyé.

Les alertes de modifications et d'indisponibilité ne sont possibles que si la source effectivement surveillée les expose : un flux peut ne pas refléter le changement de la page liée, une disparition du flux ne prouve pas qu'une offre est expirée, et une erreur réseau ne prouve pas son indisponibilité. Ajoutez la page directe à surveiller quand cela est possible. Les mots-clés des alertes ne vérifient pas à eux seuls l'admissibilité géographique. Les alertes sont désactivables dans les préférences.

## Limites importantes

- Les sources accessibles sont uniquement celles qui répondent au lecteur HTTP et dont `robots.txt` autorise l'accès ; le statut réel et la dernière tentative apparaissent dans **Sources**. La liste initiale est une configuration de départ, pas une garantie de disponibilité. Aucun site ne permet de couvrir tout Internet.
- La lecture repose sur le HTML initial ou sur un flux RSS/Atom, avec des règles simples en français et en anglais. JavaScript, connexion, CAPTCHA, PDF, pages payantes, contenu chargé après interaction et certains formats ne sont pas pris en charge. Un site peut refuser l'accès, limiter les requêtes ou modifier son format. Le lecteur `robots.txt` est volontairement simple et peut écarter une page par prudence.
- Le texte d'une page peut mélanger conditions de plusieurs offres, ignorer les conditions détaillées ou ne pas préciser le coût total. Les avertissements automatiques sont des indices, pas des décisions. Les dates, pays, montants, étapes, lien officiel, conditions de mise et seuils de retrait doivent être complétés et contrôlés manuellement. L'accès gratuit à des tours ne signifie pas que les gains sont retirables.
- Les remboursements doivent être vérifiés pour confirmer que l'utilisateur peut les réclamer sans nouvelle dépense ; certains supposent des achats antérieurs et d'autres conditions. L'application ne vérifie pas l'identité, la disponibilité, l'âge légal ou l'admissibilité personnelle.
- L'application n'essaie pas les codes auprès des marchands, ne se connecte pas à leurs services et ne revendique aucune validation automatique. Les champs de validation reposent sur la vérification de l'utilisateur. Vérifiez aussi la fiabilité des sites et ne communiquez pas vos données sans discernement.
- Un réseau d'entreprise, un proxy ou un pare-feu peut interdire les connexions directes. Les échecs sont affichés, ils ne sont pas présentés comme des offres inexistantes. Une source supprimée ne supprime pas les fiches déjà découvertes.

## Vérification technique

Exécutez `node --test` dans le dossier. Les tests couvrent notamment les critères de gratuité, concours et expiration, l'extraction prudente des codes, RSS/Atom et l'exclusion des adresses réseau privées. Le projet utilise les modules intégrés Node.js, y compris `node:sqlite`.

L'interface s'adapte aux petits écrans. Par sécurité, le serveur écoute seulement sur `127.0.0.1` : un téléphone distinct ne peut donc pas accéder directement à l'instance lancée sur l'ordinateur. Un accès mobile à distance nécessiterait une authentification et une connexion sécurisée supplémentaires, qui ne sont pas fournies ici.
