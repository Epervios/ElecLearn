# ElecLearn - Application d'Apprentissage de l'Électrotechnique (Version Reconstruite)

ElecLearn est une application web statique conçue pour aider à l'apprentissage de l'électrotechnique. Cette version est structurée autour de 15 chapitres principaux couvrant divers aspects de la discipline.

L'application permet de naviguer à travers un sommaire de chapitres, de lire le contenu théorique (avec support des formules LaTeX via MathJax), de tester ses connaissances avec des quiz par chapitre ou un quiz général aléatoire, de consulter un glossaire et de suivre sa progression.

## Fonctionnalités Principales

*   Navigation via un **Sommaire Principal** listant 15 chapitres clés.
*   Affichage du contenu des chapitres (chargé depuis des fichiers HTML externes, par exemple `contenu/f1.html` à `contenu/f15.html`).
*   Support du rendu des formules **LaTeX** via MathJax dans le contenu des chapitres.
*   **Quiz par Chapitre** interactifs (QCM).
*   **Quiz Général Aléatoire** tirant des questions de tous les chapitres.
*   Feedback immédiat et explications pour les réponses aux quiz.
*   Enregistrement des scores des quiz (distinction entre quiz de chapitre et quiz général).
*   **Glossaire** des termes techniques avec fonction de recherche.
*   **Historique des résultats** des quiz ("Ma Progression") pour suivre les performances.
*   Interface utilisateur responsive (basique) et stylée.

## Technologies Utilisées

*   **HTML5** pour la structure.
*   **CSS3** pour le style et la mise en page.
*   **JavaScript (ES6+)** pour la logique de l'application et l'interactivité.
*   **SQL.js (sql-wasm.js)** : Bibliothèque JavaScript pour exécuter SQLite directement dans le navigateur. Les données sont stockées dans `ElecLearn.db`.
*   **MathJax** : Pour le rendu des formules mathématiques en LaTeX.

## Structure du Projet

```
ElecLearn_App/  (ou le nom de votre dossier racine)
├── css/
│   └── style.css           # Styles principaux de l'application
├── db/
│   └── ElecLearn.db        # Base de données SQLite (schéma et données initiales des 15 chapitres)
├── js/
│   ├── main.js             # Logique JavaScript principale
│   ├── sql-wasm.js         # Fichier de la bibliothèque SQL.js (À TÉLÉCHARGER)
│   └── sql-wasm.wasm       # Fichier WebAssembly pour SQL.js (À TÉLÉCHARGER)
├── contenu/
│   ├── f1.html             # Fichier de contenu pour le Chapitre 1
│   ├── f2.html             # Fichier de contenu pour le Chapitre 2
│   └── ...                 # Jusqu'à f15.html et images éventuelles
├── index.html              # Point d'entrée principal de l'application
└── README.md               # Ce fichier
```

## Installation et Lancement

ElecLearn est une application web statique.

1.  **Prérequis : Fichiers SQL.js**
    *   Téléchargez les fichiers `sql-wasm.js` et `sql-wasm.wasm` depuis la [page des releases de SQL.js sur GitHub](https://github.com/sql-js/sql.js/releases).
    *   Placez ces deux fichiers dans le répertoire `js/` de votre projet.
    *   *Note : Des fichiers placeholders sont présents dans le dépôt mais ils ne fonctionneront pas. Vous devez les remplacer par les vrais fichiers.*

2.  **Lancement (Fortement Recommandé : via un serveur HTTP local) :**
    *   Pour que `fetch()` charge correctement `ElecLearn.db` et les fichiers de contenu des chapitres (par exemple, `contenu/f1.html`), il est essentiel de servir les fichiers via un serveur web local. Ouvrir `index.html` directement via `file:///` causera des erreurs CORS.

    **Options pour un serveur web local simple :**
    *   **Avec Python 3 :** Naviguez dans votre terminal jusqu'au répertoire racine du projet (`ElecLearn_App`) et exécutez :
        ```bash
        python -m http.server
        ```
        Ouvrez ensuite `http://localhost:8000` (ou le port indiqué) dans votre navigateur.
    *   **Avec Node.js (`npx`) :** Naviguez dans votre terminal jusqu'au répertoire racine et exécutez :
        ```bash
        npx serve
        ```
        Ouvrez l'URL fournie (souvent `http://localhost:3000` ou `http://localhost:5000`).
    *   **Avec l'extension "Live Server" de VS Code.**

## Personnalisation et Développement de Contenu

1.  **Contenu des Chapitres (`contenu/fX.html`) :**
    *   Créez/Modifiez les fichiers `f1.html` à `f15.html` dans le dossier `contenu/`.
    *   Structurez votre texte avec des balises HTML sémantiques (`<h2>`, `<h3>`, `<p>`, `<ul>`, `<img>`, etc.).
    *   Utilisez la syntaxe LaTeX pour les formules mathématiques (par exemple, `$E=mc^2$` pour en ligne, `$$U = R \\times I$$` pour en mode display). MathJax s'occupera du rendu.
    *   Placez les images dans un sous-dossier (par exemple, `contenu/images/`) et référencez-les avec des chemins relatifs (par exemple, `src="images/mon_image.png"`).

2.  **Base de Données (`db/ElecLearn.db`) :**
    *   Utilisez un outil de gestion SQLite (par exemple, DB Browser for SQLite) pour modifier `ElecLearn.db`.
    *   **Table `Chapitres` :** Les 15 chapitres principaux y sont déjà définis, pointant vers `contenu/f1.html` à `contenu/f15.html`. Vous pouvez modifier leurs titres si nécessaire.
    *   **Table `Questions` et `OptionsReponses` :** Ajoutez ici les questions QCM pour chaque chapitre et pour le quiz général. Liez chaque question à un `chapitre_id` correspondant à l'ID du chapitre dans la table `Chapitres`.
    *   **Table `Glossaire` :** Ajoutez les termes techniques et leurs définitions. Vous pouvez lier un terme à un `chapitre_id`.
    *   **Table `ResultatsQuiz` :** Contient la colonne `type_quiz` ('chapitre' ou 'general') et `chapitre_id` (qui sera `NULL` pour les quiz généraux).

## Auteur

Ce projet a été développé par Jules (Agent IA).
```
