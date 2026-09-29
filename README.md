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
