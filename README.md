# ElecLearn v2 — Laboratoire d'électrotechnique

Application web pédagogique indépendante de Wizardaring, en français, dédiée à l'apprentissage de l'électrotechnique à partir du programme des trois fascicules F.E.T.

## Parcours

| Fascicule | Chapitres | Sujets |
|---|---:|---|
| F.E.T 1 | 1–6 | Notions et grandeurs fondamentales, résistances, énergie et puissance, effet Joule, sources chimiques |
| F.E.T 2 | 7–10 | Magnétisme, électrostatique et condensateurs, instruments de mesure, alternatif monophasé |
| F.E.T 3 | 11–15 | Triphasé, moteurs alternatifs, moteurs continus, transformateurs, éclairage |

Les 15 contenus HTML existants dans le dossier contenu sont conservés. Les chapitres 7–15 bénéficient de **neuf compléments pédagogiques originaux avec exemples résolus**. Huit laboratoires interactifs permettent de manipuler des modèles simplifiés :

| Chapitre | Laboratoire |
|---|---|
| 2 | Loi d'Ohm et puissance |
| 7 | Champ magnétique d'une bobine idéale |
| 8 | Charge d'un circuit RC |
| 10 | Oscilloscope monophasé |
| 11 | Équilibrage triphasé résistif et courant de neutre |
| 12 | Vitesse synchrone et glissement d'un moteur |
| 14 | Transformateur idéal |
| 15 | Éclairement et efficacité lumineuse |

**Les simulations sont théoriques et ne constituent ni des instructions de travaux sous tension ni des dimensionnements réglementaires.**

## Fonctionnalités

- Interface responsive pour ordinateur, tablette et smartphone, avec navigation basse sur mobile.
- Parcours par fascicule, recherche par titre et mot-clé, sommaires cliquables dans les leçons.
- 48 questions originales, réparties entre les 15 chapitres, avec corrections et références de sections ; les QCM SQLite historiques peuvent s'y ajouter.
- Révisions ciblées par chapitre ou fascicule ; quiz général réparti entre les trois fascicules.
- Progression sauvegardée via localStorage : consulté, acquis après au moins 70 % dans un quiz du chapitre, historique et moyenne.
- Navigation directe partageable : #/cours/11, #/quiz/14, #/progression.
- PWA installable et consultation hors connexion après une première visite réussie en HTTPS : interface, cours, simulateurs et questionnaires sont préchargés.
- Navigation clavier, focus visible, zones tactiles adaptées et réduction des animations selon les préférences du système.

Aucun compte utilisateur ni serveur applicatif ne sont nécessaires. La progression n'est pas synchronisée entre appareils.

## Démarrer

ElecLearn est une application statique : aucune compilation ni installation de dépendance n'est nécessaire. Dans le dossier du dépôt :

    python -m http.server 8000

Ouvrir ensuite http://localhost:8000 dans un navigateur récent. L'ouverture directe de index.html via file:// ne permet pas le chargement fiable des cours et du cache hors connexion.

Le déploiement sur GitHub Pages ou tout autre serveur statique HTTPS est possible, y compris dans un sous-chemin.

### Contrôles

Avec Node.js 22 :

    npm run check
    npm test

Le second contrôle vérifie la présence des 15 cours, les 48 questions originales, les huit laboratoires, les neuf compléments originaux et le cache hors connexion. Voir tests/MANUAL-QA.md pour la recette sur écrans réels.

## Structure

- index.html — interface active.
- css/style-v2.css — nouveau design. L'ancien fichier css/style.css est conservé.
- js/app-v2.js — routage, apprentissage, révisions et progression.
- js/questions.js — banque de 48 questions originales.
- js/approfondissements.js — neuf modules pédagogiques F.E.T 2 et 3.
- js/labs.js — huit laboratoires interactifs.
- js/main.js — ancien contrôleur conservé pour référence, non chargé.
- js/sql-wasm.js et js/sql-wasm.wasm — compatibilité avec les questions SQLite historiques.
- contenu/f1.html à contenu/f15.html — quinze chapitres HTML existants.
- db/ElecLearn.db — base historique optionnelle.
- sw.js et manifest.webmanifest — installation et cache hors connexion.
- tests — vérifications automatisées et manuelles.
- .github/workflows/quality.yml — qualité sur les commits et pull requests.

## Références, propriété intellectuelle et limites

La structuration du programme s'appuie sur les fascicules *Électrotechnique* de la Fédération des écoles techniques (F.E.T.), volumes 1, 2 et 3. Les questions, compléments et laboratoires ajoutés sont des réalisations pédagogiques originales ; ils ne reproduisent ni les pages, ni les figures, ni les exercices des ouvrages.

**Les manuels PDF F.E.T ne sont pas inclus dans ce dépôt public.** Leur reproduction ou diffusion nécessiterait une autorisation des ayants droit. ElecLearn n'est pas présenté comme une publication officielle de la F.E.T.

La première visite nécessite un accès réseau pour installer le cache ; MathJax est actuellement fourni par un CDN, donc son premier rendu entièrement hors connexion n'est pas garanti. La suppression des données du site ou une session privée peut effacer la progression locale. Les résultats historiques uniquement stockés en mémoire dans l'ancienne version ne sont pas récupérables après fermeture.

**Projet :** ElecLearn · Wizardaring.

### Vérification automatique en navigateur

La CI GitHub exécute aussi un parcours Playwright en Chromium aux formats 1440, 820, 375 et 320 pixels. Celui-ci contrôle la navigation, l'absence de débordement horizontal, les laboratoires, les QCM, la persistance des résultats et l'accès à un cours en mode hors connexion. Une capture de l'accueil mobile est conservée comme artefact de CI. Pour l'exécuter localement, installer Playwright et Chromium, démarrer un serveur local puis lancer la commande npm run browser-test. Les contrôles Safari/iOS et les tests sur appareils physiques restent manuels.


## Illustrations conceptuelles et entraînement métier

- Quinze illustrations vectorielles originales et adaptatives : charges, Ohm, couplages, rendement, effet Joule, piles, induction, RC, mesure, alternatif, triphasé, machines AC/DC, transformateur et éclairage.
- Les schémas sont des simplifications destinées à l'apprentissage, jamais des plans d'exécution ou des installations à reproduire sous tension.
- 28 questions professionnelles inédites réparties en sept domaines : installations, énergie, principes de réglementation, réseaux, dessin, mathématiques, machines.
- Le questionnaire professionnel ne reproduit pas les annales officielles et ne prétend pas être une épreuve de qualification officielle. Les règles réglementaires détaillées doivent être consultées dans leurs versions officielles applicables.

## Bibliothèque privée de documents

La nouvelle rubrique **Bibliothèque** permet d'importer ses propres fichiers PDF pour une consultation depuis l'appareil utilisé. Les fichiers complets sont stockés dans IndexedDB, et non dans GitHub, sur le serveur statique ou sur un compte ElecLearn. Ils peuvent être ouverts dans un aperçu intégré, recherchés et supprimés par l'utilisateur.

Les neuf supports fournis pour la préparation couvrent les matériaux, la production, les installations, les contrôles OIBT, la télématique, les dessins professionnels (deux volumes), les mathématiques et le Workbook NIBT 2025. L'archive d'annales inventoriée contient **44 PDF d'épreuves de 2015 à 2024** : principalement les métiers d'électricien de montage CFC, avec une épreuve planificateur-électricien CFC de 2024. Le site ne contient **aucun de ces PDF** et ne contient pas d'extrait scanné, de schéma repris ou de corrigé reproduit.

**Pour importer les annales ZIP :** utilisez « PDF ou archive ZIP » et sélectionnez directement le fichier ZIP : les PDF qu’il contient sont décompressés puis classés sur votre appareil. Les ZIP classiques non chiffrés (méthode Store ou Deflate) sont pris en charge lorsque le navigateur supporte la décompression locale `deflate-raw`. Sur un navigateur incompatible, décompressez l’archive et importez les PDF en sélection multiple. Les fichiers importés ne sont visibles que dans le navigateur et le profil ayant réalisé l'importation. Ils ne sont pas synchronisés entre appareils.

**Capacité :** certains supports numérisés dépassent 100 Mo. Le quota d'IndexedDB varie selon le navigateur et l'espace disponible : si l'import permanent échoue, la bibliothèque bascule en mode de consultation temporaire en l'indiquant clairement. Les documents importés en mode temporaire disparaissent au rechargement. Le bouton « Vérifier ma bibliothèque » affiche un diagnostic du stockage. Conservez toujours vos fichiers originaux hors du navigateur. La suppression des données du site peut effacer la bibliothèque. Pour une autre implantation, privilégier à terme une solution de bibliothèque privée sur un serveur autorisé.

## Droits des supports de référence

Plusieurs ouvrages de formation mentionnent explicitement une interdiction de reproduction, même partielle, sans autorisation écrite. Leur importation personnelle dans une session locale est distincte de leur publication sur le dépôt public. Les références fournies servent de trame thématique, mais aucun contenu des ouvrages, annales ou corrigés n'est ajouté tel quel au code public. Si des droits de diffusion sont obtenus, établir la provenance, la licence, la durée de mise à disposition et les obligations d'attribution avant toute nouvelle publication.


## Mise à jour V2.1 — catalogue commun et atlas visuel

La bibliothèque n'est plus une page vide tant que les PDF ne sont pas importés : sept matières sont accessibles immédiatement, avec des liens vers les quinze chapitres, des miniatures vectorielles et des révisions ciblées. Les cours sont **communs aux professions** : installation, énergie, sécurité, télématique, dessin, mathématiques et machines. Les archives restent classées dans « Examens », sans séparation par métier ni filtre par profession.

L’atlas visuel a été renforcé : **45 schémas SVG originaux au total**, répartis sur 15 chapitres (une illustration principale et deux illustrations contextuelles insérées au niveau des sections). Sept aperçus thématiques figurent aussi dans la bibliothèque ; ces aperçus réutilisent certaines illustrations des cours. Les 8 laboratoires interactifs sont conservés.

La bibliothèque privée est désormais facultative : elle ajoute vos PDF/ZIP à des cours déjà utilisables. L'import fait apparaître un état de progression et des erreurs explicites. Si le stockage persistant du navigateur est bloqué, un mode temporaire permet de consulter les documents pendant la session, avec un avertissement. Deux PDF portant le même nom dans des sous-dossiers ZIP différents sont conservés distinctement grâce à leur chemin d'origine.

La branche reste une PR en brouillon ; les changements ne sont pas automatiquement visibles sur le site publié tant qu'ils ne sont pas déployés.

## Tester réellement la bibliothèque

GitHub affiche le **code** du dépôt, pas une application web exécutable. Si GitHub Pages n'a pas été activé pour ce dépôt, une URL GitHub n'ouvre pas la bibliothèque. Lancement local depuis la racine du dépôt : `python -m http.server 8000`, puis `http://localhost:8000/#/bibliotheque` dans le navigateur. Pour l'accès public, activer **Settings → Pages** et choisir une source de publication (branche ou GitHub Actions) avant d'annoncer un lien de démonstration.

Sur la page Bibliothèque : sept matières s'affichent sans PDF importé. Le bouton « Importer PDF ou ZIP » ajoute des documents **privés au navigateur courant**, pas au dépôt GitHub. Le bouton « Vérifier ma bibliothèque » renseigne la disponibilité du stockage ; si celui-ci est refusé ou saturé, la bibliothèque continue de fonctionner temporairement, sans persistance.

## Correctif de navigation : bibliothèque autonome

La **Bibliothèque** s'ouvre désormais via `bibliotheque.html`, une véritable page indépendante de l'ancien routeur de la page d'accueil. L'ancien favori `index.html#/bibliotheque` est redirigé vers cette page. Cette séparation évite qu'un script d'ancienne version ne réachemine la rubrique vers l'accueil et permet une bibliothèque sans chargement du module principal de quiz. Les sept matières et tous leurs liens vers les cours sont disponibles directement depuis cette page.

Lors du déploiement, transférer **tous les fichiers** du dépôt, y compris `bibliotheque.html`, les scripts et `sw.js` ; il ne suffit pas de remplacer `index.html`. Les ressources critiques portent un numéro de version pour éviter que l'ancien service worker réutilise indéfiniment les anciens scripts. Après la mise à jour, ouvrir directement `bibliotheque.html` depuis le domaine de déploiement.
