// Fichier JavaScript principal pour ElecLearn

document.addEventListener('DOMContentLoaded', () => {
    console.log("ElecLearn App initialisée.");

    // Logique pour sql.js et interaction avec la DB viendra ici
    // ainsi que la gestion des événements et la manipulation du DOM

    // Exemple de gestion de la navigation simple (à développer)
    const navLinks = {
        accueil: document.getElementById('accueil'),
        fascicules: document.getElementById('fascicules-container'),
        chapitres: document.getElementById('chapitres-container'),
        contenuChapitre: document.getElementById('contenu-chapitre-container'),
        quiz: document.getElementById('quiz-container'),
        resultatsQuiz: document.getElementById('resultats-quiz-container'),
        glossaire: document.getElementById('glossaire-container'),
        progression: document.getElementById('progression-container')
    };

    // Logique de navigation (très basique pour l'instant)
    // À remplacer par une gestion plus robuste des vues
    function showSection(sectionId) {
        Object.values(navLinks).forEach(section => {
            if (section) section.style.display = 'none';
        });
        if (navLinks[sectionId]) {
            navLinks[sectionId].style.display = 'block';
        }
    }

    // Exemple: Afficher l'accueil par défaut
    showSection('accueil');

    // TODO: Ajouter des gestionnaires d'événements pour la navigation réelle
    // par exemple, cliquer sur un bouton "Voir les fascicules"
    // document.getElementById('bouton-voir-fascicules').addEventListener('click', () => showSection('fascicules'));

    // Initialisation de la base de données
    initSQL().then(() => {
        if (window.db) {
            console.log("Base de données initialisée et prête.");
            // Une fois la DB prête, charger les fascicules
            loadFascicules();
            setupNavigation(); // Configurer la navigation principale
        } else {
            console.error("L'objet window.db n'a pas été initialisé après initSQL().");
        }
    }).catch(error => {
        console.error("Erreur majeure pendant l'initialisation de la DB dans le listener DOMContentLoaded:", error);
    });

    // Gestionnaires pour les boutons de retour (si déjà présents dans le HTML)
    const retourFasciculesBtn = document.getElementById('retour-fascicules');
    if (retourFasciculesBtn) {
        retourFasciculesBtn.addEventListener('click', () => showSection('fascicules'));
    }
    // D'autres boutons de retour seront gérés au fur et à mesure de l'implémentation des sections
    const retourChapitresBtn = document.getElementById('retour-chapitres');
    if (retourChapitresBtn) {
        retourChapitresBtn.addEventListener('click', () => {
            if (window.appState.selectedFasciculeId) {
                // Pas besoin de recharger les chapitres s'ils sont déjà là,
                // mais on pourrait si la logique l'exigeait.
                showSection('chapitres');
            } else {
                //Fallback si on a perdu l'état du fascicule, improbable mais sûr
                showSection('fascicules');
            }
        });
    }
});

// Variable globale pour la base de données
window.db = null;
// Variable globale pour l'instance SQL (utile si on doit recréer la DB)
window.SQL = null;
// Stocker l'état actuel, par exemple l'ID du fascicule ou du chapitre sélectionné
window.appState = {
    currentView: 'accueil',
    selectedFasciculeId: null,
    selectedChapitreId: null,
};


// --- SECTIONS DE L'APPLICATION ---
const sections = {
    accueil: document.getElementById('accueil'),
    fascicules: document.getElementById('fascicules-container'),
    chapitres: document.getElementById('chapitres-container'),
    contenuChapitre: document.getElementById('contenu-chapitre-container'),
    quiz: document.getElementById('quiz-container'),
    resultatsQuiz: document.getElementById('resultats-quiz-container'),
    glossaire: document.getElementById('glossaire-container'),
    progression: document.getElementById('progression-container')
};

function showSection(sectionId) {
    Object.values(sections).forEach(section => {
        if (section) section.style.display = 'none';
    });
    if (sections[sectionId]) {
        sections[sectionId].style.display = 'block';
        window.appState.currentView = sectionId;
        console.log(`Affichage de la section: ${sectionId}`);

        // Mettre à jour la classe active dans la navigation
        const navLinks = document.querySelectorAll('header nav a');
        navLinks.forEach(link => {
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    } else {
        console.warn(`Tentative d'affichage d'une section inconnue: ${sectionId}`);
    }
}

async function loadContenuChapitre(chapitreId, contenuPath) {
    if (!chapitreId) {
        console.error("chapitreId non fourni pour charger le contenu.");
        return;
    }

    const contenuTitreH2 = document.getElementById('contenu-chapitre-titre');
    const contenuTexteDiv = document.getElementById('contenu-chapitre-texte');

    if (!contenuTitreH2 || !contenuTexteDiv) {
        console.error("Éléments DOM 'contenu-chapitre-titre' ou 'contenu-chapitre-texte' non trouvés.");
        return;
    }

    // Mettre à jour le titre de la section
    contenuTitreH2.textContent = window.appState.selectedChapitreTitre || "Contenu du chapitre";

    if (contenuPath && contenuPath.trim() !== "") {
        try {
            const response = await fetch(contenuPath);
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status} lors du chargement de ${contenuPath}`);
            }
            const htmlContent = await response.text();
            contenuTexteDiv.innerHTML = htmlContent;
            console.log(`Contenu du chapitre ${chapitreId} chargé depuis ${contenuPath}`);
        } catch (err) {
            console.error(`Erreur lors du chargement du contenu du chapitre depuis ${contenuPath}:`, err);
            contenuTexteDiv.innerHTML = `<p>Impossible de charger le contenu du chapitre. Vérifiez que le fichier '${contenuPath}' existe et est accessible.</p>`;
        }
    } else {
        contenuTexteDiv.innerHTML = '<p>Aucun chemin de contenu spécifié pour ce chapitre.</p>';
        console.log(`Aucun contenuPath pour chapitre ${chapitreId}`);
    }
}

function loadChapitres(fasciculeId) {
    if (!window.db) {
        console.error("DB non prête pour charger les chapitres.");
        return;
    }
    if (!fasciculeId) {
        console.error("fasciculeId non fourni pour charger les chapitres.");
        // Optionnel: rediriger vers la liste des fascicules
        // showSection('fascicules');
        return;
    }

    const chapitresListeDiv = document.getElementById('chapitres-liste');
    const chapitresTitreH2 = document.getElementById('chapitres-titre');

    if (!chapitresListeDiv || !chapitresTitreH2) {
        console.error("Éléments DOM 'chapitres-liste' ou 'chapitres-titre' non trouvés.");
        return;
    }

    // Mettre à jour le titre de la section
    chapitresTitreH2.textContent = `Chapitres du ${window.appState.selectedFasciculeTitre || 'Fascicule sélectionné'}`;

    try {
        // Utilisation de requêtes préparées pour éviter les injections SQL (même si ici fasciculeId est contrôlé)
        // sql.js retourne les résultats différemment avec les requêtes préparées.
        // db.exec() est plus simple pour les SELECTS sans paramètres variables venant de l'utilisateur direct.
        // Pour la simplicité ici, et vu que fasciculeId vient de notre propre code:
        const stmt = window.db.prepare("SELECT id, numero_chapitre, titre, contenu_path FROM Chapitres WHERE fascicule_id = :id_fascicule ORDER BY numero_chapitre");
        stmt.bind({':id_fascicule': fasciculeId});

        chapitresListeDiv.innerHTML = ''; // Vider la liste existante
        let hasResults = false;

        while(stmt.step()) { // itérer sur les lignes
            hasResults = true;
            const row = stmt.getAsObject(); // {id: ..., numero_chapitre: ..., titre: ..., contenu_path: ...}

            const chapitreDiv = document.createElement('div');
            chapitreDiv.className = 'chapitre-item';
            chapitreDiv.setAttribute('data-id', row.id);
            chapitreDiv.setAttribute('data-contenu-path', row.contenu_path || ''); // Stocker le chemin du contenu

            const titreH4 = document.createElement('h4');
            titreH4.textContent = `Chapitre ${row.numero_chapitre}: ${row.titre}`;
            chapitreDiv.appendChild(titreH4);

            chapitreDiv.addEventListener('click', () => {
                console.log(`Chapitre cliqué: ID ${row.id}, Titre: ${row.titre}, Contenu: ${row.contenu_path}`);
                window.appState.selectedChapitreId = row.id;
                window.appState.selectedChapitreTitre = row.titre; // Stocker le titre du chapitre
                window.appState.selectedChapitreContenuPath = row.contenu_path;
                loadContenuChapitre(row.id, row.contenu_path);
                showSection('contenuChapitre');
            });

            chapitresListeDiv.appendChild(chapitreDiv);
        }

        stmt.free(); // Libérer la requête préparée

        if (!hasResults) {
            chapitresListeDiv.innerHTML = '<p>Aucun chapitre trouvé pour ce fascicule.</p>';
        }
        console.log(`Chapitres pour fasciculeId ${fasciculeId} chargés et affichés.`);

    } catch (err) {
        console.error(`Erreur lors du chargement ou de l'affichage des chapitres pour fasciculeId ${fasciculeId}:`, err);
        chapitresListeDiv.innerHTML = '<p>Erreur lors du chargement des chapitres.</p>';
    }
}

function setupNavigation() {
    // Exemple: bouton sur la page d'accueil pour voir les fascicules
    const voirFasciculesBtn = document.createElement('button');
    voirFasciculesBtn.textContent = "Explorer les Fascicules";
    voirFasciculesBtn.id = "btn-voir-fascicules";
    sections.accueil.appendChild(voirFasciculesBtn);

    voirFasciculesBtn.addEventListener('click', () => {
        loadFascicules(); // S'assurer que les fascicules sont chargés/rechargés
        showSection('fascicules');
    });

    // Ajouter des liens de navigation dans le header <nav>
    const navElement = document.querySelector('header nav');
    if (navElement) {
        navElement.innerHTML = `
            <ul>
                <li><a href="#" data-section="accueil">Accueil</a></li>
                <li><a href="#" data-section="fascicules">Fascicules</a></li>
                <li><a href="#" data-section="glossaire">Glossaire</a></li>
                <li><a href="#" data-section="progression">Ma Progression</a></li>
            </ul>
        `;
        navElement.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = e.target.dataset.section;
                if (sectionId === 'fascicules') {
                    loadFascicules(); // Recharger si on clique explicitement
                }
                // TODO: Ajouter le chargement des données pour glossaire et progression ici si nécessaire
                showSection(sectionId);
            });
        });
    }
     // Afficher l'accueil par défaut au chargement
    showSection('accueil');
}

function loadFascicules() {
    if (!window.db) {
        console.error("DB non prête pour charger les fascicules.");
        // Peut-être afficher un message à l'utilisateur ou réessayer plus tard
        return;
    }

    const fasciculesListeDiv = document.getElementById('fascicules-liste');
    if (!fasciculesListeDiv) {
        console.error("Élément 'fascicules-liste' non trouvé dans le DOM.");
        return;
    }

    try {
        const results = window.db.exec("SELECT id, titre, description FROM Fascicules ORDER BY id");
        fasciculesListeDiv.innerHTML = ''; // Vider la liste existante

        if (results.length > 0 && results[0].values.length > 0) {
            results[0].values.forEach(row => {
                const fasciculeId = row[0];
                const titre = row[1];
                const description = row[2];

                const fasciculeDiv = document.createElement('div');
                fasciculeDiv.className = 'fascicule-item'; // Pour le style CSS
                fasciculeDiv.setAttribute('data-id', fasciculeId);

                const titreH3 = document.createElement('h3');
                titreH3.textContent = titre;
                fasciculeDiv.appendChild(titreH3);

                if (description) {
                    const descP = document.createElement('p');
                    descP.textContent = description;
                    fasciculeDiv.appendChild(descP);
                }

                // Gérer le clic sur un fascicule (sera utilisé à l'étape suivante)
                fasciculeDiv.addEventListener('click', () => {
                    console.log(`Fascicule cliqué: ID ${fasciculeId}, Titre: ${titre}`);
                    window.appState.selectedFasciculeId = fasciculeId;
                    window.appState.selectedFasciculeTitre = titre; // Garder le titre pour l'affichage
                    loadChapitres(fasciculeId);
                    showSection('chapitres');
                });

                fasciculesListeDiv.appendChild(fasciculeDiv);
            });
        } else {
            fasciculesListeDiv.innerHTML = '<p>Aucun fascicule trouvé dans la base de données.</p>';
        }
        console.log("Fascicules chargés et affichés.");
    } catch (err) {
        console.error("Erreur lors du chargement ou de l'affichage des fascicules:", err);
        fasciculesListeDiv.innerHTML = '<p>Erreur lors du chargement des fascicules.</p>';
    }
}


async function initSQL() {
    try {
        // initSqlJs est exposé globalement par le script sql-wasm.js
        // Il est important que sql-wasm.js soit chargé AVANT ce script.
        // La propriété locateFile est cruciale pour que sql.js trouve le fichier .wasm
        window.SQL = await initSqlJs({
            locateFile: file => `js/${file}`
        });

        // Charger le fichier de base de données ElecLearn.db
        const response = await fetch('db/ElecLearn.db');
        if (!response.ok) {
            throw new Error(`Erreur HTTP lors du chargement de ElecLearn.db: ${response.status} ${response.statusText}`);
        }
        const fileBuffer = await response.arrayBuffer();

        // Créer une instance de la base de données
        // Si le fichier .db est vide ou ne contient pas de tables SQL valides,
        // SQL.Database le créera en mémoire mais il sera vide.
        // Si le fichier .db contient du SQL (comme nos CREATE TABLE), il l'exécutera.
        window.db = new window.SQL.Database(new Uint8Array(fileBuffer));

        console.log("Base de données ElecLearn.db chargée avec succès dans sql.js.");

        // Testons avec une requête simple pour vérifier que tout fonctionne
        testDatabaseConnection();

    } catch (err) {
        console.error("Erreur lors de l'initialisation de SQL.js ou du chargement de la DB:", err);
        // Afficher un message à l'utilisateur si l'initialisation échoue
        const body = document.querySelector('body');
        if (body) {
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `
                <p style="color: red; background: #ffdddd; border: 1px solid red; padding: 10px; text-align: center;">
                    <strong>Erreur critique :</strong> Impossible de charger la base de données de l'application.
                    Vérifiez la console du navigateur pour plus de détails.
                    Assurez-vous que les fichiers 'sql-wasm.js' et 'sql-wasm.wasm' sont corrects et présents dans le dossier 'js/'.
                </p>`;
            body.insertBefore(errorDiv, body.firstChild);
        }
    }
}

function testDatabaseConnection() {
    if (!window.db) {
        console.error("La base de données n'est pas initialisée pour le test.");
        return;
    }
    try {
        // 1. Vérifier la version de SQLite
        const versionResult = window.db.exec("SELECT sqlite_version();");
        if (versionResult && versionResult.length > 0 && versionResult[0].values) {
            console.log("Version SQLite:", versionResult[0].values[0][0]);
        } else {
            console.warn("Impossible de récupérer la version de SQLite.");
        }

        // 2. Tester la lecture des fascicules (ceux insérés dans le .db)
        const fasciculesResult = window.db.exec("SELECT id, titre FROM Fascicules");
        if (fasciculesResult && fasciculesResult.length > 0 && fasciculesResult[0].values) {
            console.log("Fascicules trouvés dans la DB:", fasciculesResult[0].values.length);
            fasciculesResult[0].values.forEach(row => {
                console.log(`ID: ${row[0]}, Titre: ${row[1]}`);
            });
            if (fasciculesResult[0].values.length === 0) {
                console.warn("Aucun fascicule trouvé. Vérifiez les INSERTs dans ElecLearn.db ou si le fichier est correctement lu.");
            }
        } else {
            console.warn("La requête pour les fascicules n'a retourné aucun résultat ou une structure inattendue. La table 'Fascicules' est-elle vide ou le schéma est-il incorrect ?");
        }

        // 3. Vérifier si les tables existent (une autre façon de s'assurer que le schéma a été lu)
        const tablesResult = window.db.exec("SELECT name FROM sqlite_master WHERE type='table';");
        if (tablesResult && tablesResult.length > 0 && tablesResult[0].values) {
            console.log("Tables présentes dans la base de données:", tablesResult[0].values.map(row => row[0]));
        } else {
            console.warn("Impossible de lister les tables de la base de données.");
        }

    } catch (e) {
        console.error("Erreur lors du test de la connexion à la base de données:", e);
    }
}

// Les autres fonctions (loadFascicules, loadChapitres, etc.) seront ajoutées ici
// et appelleront window.db pour exécuter des requêtes.

console.log("main.js chargé et prêt pour l'initialisation de SQL.js.");
