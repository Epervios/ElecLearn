# ElecLearn - Application d'Apprentissage de l'Électrotechnique

ElecLearn est une application web statique conçue pour aider à l'apprentissage de l'électrotechnique, notamment pour la préparation aux examens de planificateur électricien. Elle est basée sur le contenu des ouvrages "Électrotechnique - Fascicules 1, 2 et 3".

L'application permet de naviguer à travers les fascicules et chapitres, de lire le contenu théorique, de tester ses connaissances avec des quiz, de consulter un glossaire de termes techniques et de suivre sa progression.

## Fonctionnalités Principales

*   Navigation par Fascicules et Chapitres.
*   Affichage du contenu des chapitres (chargé depuis des fichiers HTML externes).
*   Quiz interactifs (QCM pour l'instant) par chapitre.
*   Feedback immédiat et explications pour les réponses aux quiz.
*   Enregistrement des scores des quiz.
*   Glossaire des termes techniques avec fonction de recherche.
*   Historique des résultats des quiz pour suivre la progression.
*   Interface utilisateur responsive (basique).

## Technologies Utilisées

*   **HTML5** pour la structure.
*   **CSS3** pour le style et la mise en page.
*   **JavaScript (ES6+)** pour la logique de l'application et l'interactivité.
*   **SQL.js (sql-wasm.js)** : Bibliothèque JavaScript pour exécuter SQLite directement dans le navigateur. Toutes les données (contenu des fascicules/chapitres, questions, glossaire, résultats) sont stockées dans une base de données SQLite (`ElecLearn.db`).

## Structure du Projet

```
ElecLearn_App/
├── css/
│   └── style.css           # Styles principaux de l'application
├── db/
│   └── ElecLearn.db        # Base de données SQLite (contient le schéma et les données initiales)
├── js/
│   ├── main.js             # Logique JavaScript principale de l'application
│   ├── sql-wasm.js         # Fichier de la bibliothèque SQL.js (À TÉLÉCHARGER)
│   └── sql-wasm.wasm       # Fichier WebAssembly pour SQL.js (À TÉLÉCHARGER)
├── contenu/
│   ├── f1_ch1.html         # Exemple de fichier de contenu pour Fascicule 1, Chapitre 1
│   └── ...                 # Autres fichiers de contenu des chapitres
├── index.html              # Point d'entrée principal de l'application
└── README.md               # Ce fichier
```

## Installation et Lancement

ElecLearn est une application web statique et ne nécessite pas de processus de build complexe ni de serveur backend dédié pour ses fonctionnalités de base.

1.  **Prérequis : Fichiers SQL.js**
    *   Téléchargez les fichiers `sql-wasm.js` et `sql-wasm.wasm` depuis la [page des releases de SQL.js sur GitHub](https://github.com/sql-js/sql.js/releases).
    *   Placez ces deux fichiers dans le répertoire `ElecLearn_App/js/`.
    *   *Note : Des fichiers placeholders sont présents dans le dépôt mais ils ne fonctionneront pas. Vous devez les remplacer.*

2.  **Lancement :**
    *   Ouvrez simplement le fichier `ElecLearn_App/index.html` dans un navigateur web moderne (Chrome, Firefox, Edge, Safari).
    *   Pour que `fetch()` fonctionne correctement pour charger la base de données (`ElecLearn.db`) et les fichiers de contenu des chapitres (par exemple, `contenu/f1_ch1.html`), il est **fortement recommandé de servir les fichiers via un serveur web local léger** en raison des restrictions de sécurité des navigateurs (CORS) lors de l'accès aux fichiers locaux (`file:///`).

    **Options pour un serveur web local simple :**
    *   **Avec Python 3 :** Naviguez dans votre terminal jusqu'au répertoire `ElecLearn_App` et exécutez :
        ```bash
        python -m http.server
        ```
        Puis ouvrez `http://localhost:8000` (ou le port indiqué) dans votre navigateur.
    *   **Avec Node.js (si vous avez `npx`) :** Naviguez dans votre terminal jusqu'au répertoire `ElecLearn_App` et exécutez :
        ```bash
        npx serve
        ```
        Puis ouvrez l'URL fournie (généralement `http://localhost:3000` ou `http://localhost:5000`).
    *   **Avec l'extension "Live Server" de VS Code :** Si vous utilisez VS Code, vous pouvez installer l'extension "Live Server" et l'utiliser pour servir le dossier `ElecLearn_App`.

## Personnalisation du Contenu

*   **Base de données (`db/ElecLearn.db`) :**
    *   Le schéma est défini dans ce fichier. Vous pouvez l'ouvrir avec un outil de gestion SQLite (DB Browser for SQLite, DBeaver, etc.) pour modifier les données (ajouter/modifier fascicules, chapitres, questions, termes du glossaire).
    *   Les `INSERT` initiaux sont également dans ce fichier, mais peuvent être gérés via un outil externe.
*   **Contenu des Chapitres (`contenu/`) :**
    *   Créez des fichiers HTML simples dans ce répertoire pour chaque chapitre.
    *   Assurez-vous que la colonne `contenu_path` dans la table `Chapitres` de la base de données pointe correctement vers ces fichiers (par exemple, `contenu/fX_chY.html`).

## Auteur

Ce projet a été développé par Jules (Agent IA).

```
