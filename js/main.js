// ElecLearn - Fichier JavaScript Principal

document.addEventListener('DOMContentLoaded', () => {
    console.log("ElecLearn App (reconstruction) initialisée.");

    // Initialisation de la base de données et configuration de la navigation
    initSQL().then(() => {
        if (window.db) {
            console.log("Base de données initialisée et prête.");
            setupNavigation();
            // Par défaut, afficher l'accueil. Le sommaire sera chargé via clic.
            showSection('accueil');
        } else {
            console.error("L'objet window.db n'a pas été initialisé après initSQL().");
            // Afficher une erreur plus visible à l'utilisateur si la DB ne charge pas
            const mainContent = document.querySelector('main');
            if(mainContent) {
                mainContent.innerHTML = `<p style="color:red; font-weight:bold; text-align:center;">Erreur critique : Impossible d'initialiser la base de données. L'application ne peut pas fonctionner.</p>`;
            }
        }
    }).catch(error => {
        console.error("Erreur majeure pendant l'initialisation de la DB:", error);
    });

    // Gestionnaires de boutons de retour globaux (ceux qui sont toujours dans le DOM)
    const retourChapitresBtn = document.getElementById('retour-chapitres');
    if (retourChapitresBtn) {
        retourChapitresBtn.addEventListener('click', () => showSection('chapitres'));
    }

    const retourContenuChapitreQuizBtn = document.getElementById('retour-contenu-chapitre-quiz');
    if (retourContenuChapitreQuizBtn) {
        retourContenuChapitreQuizBtn.addEventListener('click', () => {
            // Si on vient d'un quiz général, on va au sommaire, sinon au contenu du chapitre
            if (window.appState.currentQuizType === 'general') {
                loadMainMenuChapitres(); // Recharger le sommaire
                showSection('chapitres');
            } else {
                showSection('contenuChapitre');
            }
        });
    }

    const retourContenuChapitreResultatsBtn = document.getElementById('retour-contenu-chapitre-resultats');
    if (retourContenuChapitreResultatsBtn) {
        retourContenuChapitreResultatsBtn.addEventListener('click', () => showSection('contenuChapitre'));
    }

    const retourSommaireResultatsBtn = document.getElementById('retour-sommaire-resultats');
    if(retourSommaireResultatsBtn){
        retourSommaireResultatsBtn.addEventListener('click', () => {
            loadMainMenuChapitres(); // Recharger le sommaire
            showSection('chapitres');
        });
    }


    // Gestionnaire pour la recherche dans le glossaire
    const rechercheGlossaireInput = document.getElementById('recherche-glossaire');
    if (rechercheGlossaireInput) {
        rechercheGlossaireInput.addEventListener('input', () => {
            loadGlossaire(rechercheGlossaireInput.value.trim());
        });
    }

    // Gestionnaires pour les boutons de quiz (ceux qui sont toujours là)
     const lancerQuizChapitreBtn = document.getElementById('lancer-quiz-chapitre');
    if (lancerQuizChapitreBtn) {
        lancerQuizChapitreBtn.addEventListener('click', () => {
            if (window.appState.selectedChapitreId) {
                startQuiz(window.appState.selectedChapitreId);
            } else {
                alert("Aucun chapitre sélectionné pour lancer un quiz.");
            }
        });
    }

    const prochaineQuestionBtn = document.getElementById('prochaine-question');
    if (prochaineQuestionBtn) {
        prochaineQuestionBtn.addEventListener('click', nextQuestion);
    }

    const terminerQuizBtn = document.getElementById('terminer-quiz');
    if (terminerQuizBtn) {
        terminerQuizBtn.addEventListener('click', showQuizResults);
    }

});

// --- VARIABLES GLOBALES ---
window.db = null;
window.SQL = null;

window.appState = {
    currentView: 'accueil',
    // selectedFasciculeId: 1, // Convention pour les chapitres principaux
    // selectedFasciculeTitre: "Électrotechnique - Sommaire Principal",
    selectedChapitreId: null,       // ID du chapitre actuellement affiché ou quizé
    selectedChapitreTitre: null,
    selectedChapitreContenuPath: null,

    // États pour le Quiz
    currentQuizType: null, // 'chapitre' ou 'general'
    quizQuestions: [],
    currentQuestionIndex: 0,
    userScore: 0,
    quizTotalQuestions: 0,
};

const sections = {
    accueil: document.getElementById('accueil'),
    // fascicules: document.getElementById('fascicules-container'), // Plus utilisé directement
    chapitres: document.getElementById('chapitres-container'), // Sera la liste principale (Sommaire)
    contenuChapitre: document.getElementById('contenu-chapitre-container'),
    quiz: document.getElementById('quiz-container'),
    resultatsQuiz: document.getElementById('resultats-quiz-container'),
    glossaire: document.getElementById('glossaire-container'),
    progression: document.getElementById('progression-container')
};


// --- INITIALISATION DB ---
async function initSQL() {
    try {
        window.SQL = await initSqlJs({ locateFile: file => `js/${file}` });
        const response = await fetch('db/ElecLearn.db');
        if (!response.ok) {
            throw new Error(`Erreur HTTP lors du chargement de ElecLearn.db: ${response.status} ${response.statusText}`);
        }
        const fileBuffer = await response.arrayBuffer();
        window.db = new window.SQL.Database(new Uint8Array(fileBuffer));
        console.log("Base de données ElecLearn.db chargée.");
        // testDatabaseConnection(); // Optionnel: pour vérifier le contenu initial
    } catch (err) {
        console.error("Erreur critique lors de l'initialisation de SQL.js ou du chargement de la DB:", err);
        const body = document.querySelector('body');
        if (body) { // Afficher l'erreur de manière proéminente
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `<p style="color: white; background: red; border: 1px solid darkred; padding: 20px; text-align: center; font-size:1.2em; position:fixed; top:0; left:0; width:100%; z-index:9999;">
                <strong>Erreur critique :</strong> Impossible de charger la base de données de l'application.<br>
                Vérifiez la console du navigateur pour plus de détails.<br>
                Assurez-vous que les fichiers 'sql-wasm.js', 'sql-wasm.wasm' (les vrais, non les placeholders) et 'ElecLearn.db' sont corrects et présents aux bons emplacements, et que l'application est servie via un serveur HTTP (pas file:///).
                </p>`;
            body.insertBefore(errorDiv, body.firstChild);
        }
        throw err; // Renvoyer l'erreur pour que le .catch de DOMContentLoaded la voie
    }
}

// --- FONCTIONS POUR LA PAGE PROGRESSION ---

function loadProgression() {
    if (!window.db) {
        console.error("DB non prête pour charger la progression.");
        const progressionListeDiv = document.getElementById('progression-liste');
        if (progressionListeDiv) {
            progressionListeDiv.innerHTML = '<p>La base de données n\'est pas encore prête.</p>';
        }
        return;
    }

    const progressionListeDiv = document.getElementById('progression-liste');
    if (!progressionListeDiv) {
        console.error("Élément 'progression-liste' non trouvé.");
        return;
    }

    try {
        // Récupérer tous les résultats, joindre avec Chapitres pour obtenir les titres des chapitres
        // pour les quiz de type 'chapitre'.
        const query = `
            SELECT
                rq.id,
                rq.score,
                rq.total_questions,
                rq.date_tentative,
                rq.type_quiz,
                c.titre AS chapitre_titre
            FROM ResultatsQuiz rq
            LEFT JOIN Chapitres c ON rq.chapitre_id = c.id
            ORDER BY rq.date_tentative DESC;
        `;
        // LEFT JOIN pour s'assurer qu'on récupère aussi les quiz généraux où c.titre sera NULL

        const results = window.db.exec(query);

        progressionListeDiv.innerHTML = '';

        if (results.length > 0 && results[0].values.length > 0) {
            const ul = document.createElement('ul');
            ul.className = 'progression-items-list';

            results[0].values.forEach(row => {
                const entry = {};
                results[0].columns.forEach((colName, index) => {
                    entry[colName] = row[index];
                });

                const li = document.createElement('li');
                li.className = 'progression-item';

                const percentage = entry.total_questions > 0 ? (entry.score / entry.total_questions * 100).toFixed(1) : 0;
                const dateTentative = new Date(entry.date_tentative).toLocaleString('fr-FR', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });

                let titrePrincipal = "";
                if (entry.type_quiz === 'general') {
                    titrePrincipal = "Quiz Général Aléatoire";
                } else if (entry.chapitre_titre) {
                    titrePrincipal = `Quiz: ${entry.chapitre_titre}`;
                } else {
                    titrePrincipal = "Quiz d'un chapitre (Titre non trouvé)";
                }

                li.innerHTML = `
                    <h4>${titrePrincipal}</h4>
                    <p><strong>Score obtenu:</strong> ${entry.score} / ${entry.total_questions} (${percentage}%)</p>
                    <p><strong>Date de la tentative:</strong> ${dateTentative}</p>
                    <hr>
                `;
                ul.appendChild(li);
            });
            progressionListeDiv.appendChild(ul);
        } else {
            progressionListeDiv.innerHTML = '<p>Aucun résultat de quiz enregistré. Participez à un quiz pour voir votre progression !</p>';
        }
        console.log("Progression (historique des quiz) chargée.");
    } catch (err) {
        console.error("Erreur lors du chargement de la progression:", err);
        progressionListeDiv.innerHTML = '<p>Erreur lors du chargement de l''historique des quiz.</p>';
    }
}

// --- FONCTIONS POUR LE GLOSSAIRE ---

function loadGlossaire(searchTerm = "") {
    if (!window.db) {
        console.error("DB non prête pour charger le glossaire.");
        const glossaireListeDiv = document.getElementById('glossaire-liste');
        if (glossaireListeDiv) {
            glossaireListeDiv.innerHTML = '<p>La base de données n\'est pas encore prête.</p>';
        }
        return;
    }

    const glossaireListeDiv = document.getElementById('glossaire-liste');
    if (!glossaireListeDiv) {
        console.error("Élément 'glossaire-liste' non trouvé.");
        return;
    }

    try {
        let query = "SELECT id, terme, definition, chapitre_id FROM Glossaire";
        const params = {};
        if (searchTerm) {
            query += " WHERE terme LIKE :terme OR definition LIKE :definition";
            params[':terme'] = `%${searchTerm}%`;
            params[':definition'] = `%${searchTerm}%`;
        }
        query += " ORDER BY terme";

        const stmt = window.db.prepare(query);
        if (searchTerm) {
            stmt.bind(params);
        }

        glossaireListeDiv.innerHTML = '';
        let hasResults = false;
        const dl = document.createElement('dl');

        while(stmt.step()) {
            hasResults = true;
            const row = stmt.getAsObject();

            const dt = document.createElement('dt');
            dt.textContent = row.terme;

            const dd = document.createElement('dd');
            dd.textContent = row.definition;

            // Optionnel: Afficher un lien vers le chapitre si chapitre_id est présent
            // Pour cela, il faudrait une autre requête pour obtenir le titre du chapitre, etc.
            // Ou stocker le titre du chapitre avec le terme si c'est une info souvent nécessaire.
            // if (row.chapitre_id) {
            //     dd.innerHTML += ` <small class="glossaire-chapitre-ref">(Réf. Chapitre ${row.chapitre_id})</small>`;
            // }

            dl.appendChild(dt);
            dl.appendChild(dd);
        }
        stmt.free();

        if (hasResults) {
            glossaireListeDiv.appendChild(dl);
        } else {
            if (searchTerm) {
                glossaireListeDiv.innerHTML = `<p>Aucun terme trouvé correspondant à "${searchTerm}".</p>`;
            } else {
                glossaireListeDiv.innerHTML = '<p>Aucun terme dans le glossaire pour le moment.</p>';
            }
        }
        console.log(`Glossaire chargé (recherche: "${searchTerm}").`);
    } catch (err) {
        console.error(`Erreur lors du chargement du glossaire (recherche: "${searchTerm}"):`, err);
        glossaireListeDiv.innerHTML = '<p>Erreur lors du chargement du glossaire.</p>';
    }
}

function testDatabaseConnection() { // Fonction de débogage
    if (!window.db) { console.error("DB non initialisée pour test."); return; }
    try {
        console.log("Version SQLite:", window.db.exec("SELECT sqlite_version();")[0].values[0][0]);
        const tables = window.db.exec("SELECT name FROM sqlite_master WHERE type='table';");
        console.log("Tables:", tables[0] ? tables[0].values.map(row => row[0]) : "Aucune table trouvée");
        // Ajoutez d'autres requêtes de test si nécessaire
    } catch (e) {
        console.error("Erreur test DB:", e);
    }
}


// --- GESTION DE LA NAVIGATION ET AFFICHAGE DES SECTIONS ---

function showSection(sectionId) {
    Object.values(sections).forEach(section => {
        if (section) section.style.display = 'none';
    });

    // Assurer que l'ancien conteneur de fascicules (si jamais il était utilisé) est caché
    // const fasciculesContainer = document.getElementById('fascicules-container');
    // if (fasciculesContainer) fasciculesContainer.style.display = 'none';

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

        // Cacher/montrer les boutons de retour spécifiques aux résultats de quiz
        const retourContenuChapitreResultatsBtn = document.getElementById('retour-contenu-chapitre-resultats');
        const retourSommaireResultatsBtn = document.getElementById('retour-sommaire-resultats');
        if (sectionId === 'resultatsQuiz') {
            if (window.appState.currentQuizType === 'general') {
                if(retourContenuChapitreResultatsBtn) retourContenuChapitreResultatsBtn.style.display = 'none';
                if(retourSommaireResultatsBtn) retourSommaireResultatsBtn.style.display = 'inline-block';
            } else { // 'chapitre'
                if(retourContenuChapitreResultatsBtn) retourContenuChapitreResultatsBtn.style.display = 'inline-block';
                if(retourSommaireResultatsBtn) retourSommaireResultatsBtn.style.display = 'none';
            }
        }


    } else {
        console.warn(`Tentative d'affichage d'une section inconnue: ${sectionId}`);
    }
}

function setupNavigation() {
    const accueilSection = document.getElementById('accueil');
    if (accueilSection) { // Vérifier si la section accueil existe
        const voirSommaireBtn = document.createElement('button');
        voirSommaireBtn.textContent = "Commencer l'Apprentissage (Sommaire)";
        voirSommaireBtn.id = "btn-voir-sommaire";
        voirSommaireBtn.addEventListener('click', () => {
            loadMainMenuChapitres();
            showSection('chapitres');
        });
        accueilSection.appendChild(voirSommaireBtn);
    }


    const navElement = document.querySelector('header nav');
    if (navElement) {
        navElement.innerHTML = `
            <ul>
                <li><a href="#" data-section="accueil">Accueil</a></li>
                <li><a href="#" data-section="chapitres">Sommaire</a></li>
                <li><a href="#" data-section="quiz_general">Quiz Général</a></li>
                <li><a href="#" data-section="glossaire">Glossaire</a></li>
                <li><a href="#" data-section="progression">Ma Progression</a></li>
            </ul>
        `;
        navElement.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionIdTarget = e.target.dataset.section;

                if (sectionIdTarget === 'chapitres') {
                    loadMainMenuChapitres();
                    showSection('chapitres');
                } else if (sectionIdTarget === 'quiz_general') {
                    // Implémenter startGeneralQuiz() à l'étape correspondante
                    // Pour l'instant, on peut juste afficher une section placeholder ou un message
                    console.log("Démarrage du Quiz Général (à implémenter)");
                    startGeneralQuiz(20); // Appel à la fonction qui sera créée
                    // showSection('quiz'); // Ou une section spécifique si différente
                } else if (sectionIdTarget === 'glossaire') {
                    loadGlossaire();
                    document.getElementById('recherche-glossaire').value = '';
                    showSection('glossaire');
                } else if (sectionIdTarget === 'progression') {
                    loadProgression();
                    showSection('progression');
                } else {
                    showSection(sectionIdTarget); // Pour 'accueil'
                }
            });
        });
    }
}

function loadMainMenuChapitres() {
    if (!window.db) {
        console.error("DB non prête pour charger le sommaire.");
        return;
    }

    const chapitresListeDiv = document.getElementById('chapitres-liste');
    const chapitresTitreH2 = document.getElementById('chapitres-titre');

    if (!chapitresListeDiv || !chapitresTitreH2) {
        console.error("Éléments DOM pour la liste principale des chapitres (#chapitres-liste ou #chapitres-titre) non trouvés.");
        return;
    }

    chapitresTitreH2.textContent = "Sommaire Principal du Cours";
    const retourFasciculesBtn = document.getElementById('retour-fascicules');
    if(retourFasciculesBtn) retourFasciculesBtn.style.display = 'none';

    try {
        // On récupère tous les chapitres avec fascicule_id = 1 (convention)
        const stmt = window.db.prepare("SELECT id, numero_chapitre, titre, contenu_path FROM Chapitres WHERE fascicule_id = 1 ORDER BY numero_chapitre");

        chapitresListeDiv.innerHTML = '';
        let hasResults = false;

        while(stmt.step()) {
            hasResults = true;
            const row = stmt.getAsObject();

            const chapitreDiv = document.createElement('div');
            chapitreDiv.className = 'chapitre-item';
            chapitreDiv.setAttribute('data-id', row.id);

            const titreH3 = document.createElement('h3'); // Utiliser h3 pour les titres dans le sommaire
            titreH3.textContent = `${row.titre}`;
            chapitreDiv.appendChild(titreH3);

            chapitreDiv.addEventListener('click', () => {
                window.appState.selectedChapitreId = row.id;
                window.appState.selectedChapitreTitre = row.titre;
                window.appState.selectedChapitreContenuPath = row.contenu_path;
                loadContenuChapitre(row.id, row.contenu_path);
                showSection('contenuChapitre');
            });
            chapitresListeDiv.appendChild(chapitreDiv);
        }
        stmt.free();

        if (!hasResults) {
            chapitresListeDiv.innerHTML = '<p>Aucun chapitre trouvé dans le sommaire. Vérifiez la base de données.</p>';
        }
        console.log("Sommaire principal des chapitres chargé.");
    } catch (err) {
        console.error("Erreur lors du chargement du sommaire principal:", err);
        chapitresListeDiv.innerHTML = '<p>Erreur lors du chargement du sommaire.</p>';
    }
}

async function loadContenuChapitre(chapitreId, contenuPath) {
    const contenuTitreH2 = document.getElementById('contenu-chapitre-titre');
    const contenuTexteDiv = document.getElementById('contenu-chapitre-texte');

    if (!contenuTitreH2 || !contenuTexteDiv) {
        console.error("Éléments DOM ('contenu-chapitre-titre' ou 'contenu-chapitre-texte') non trouvés.");
        return;
    }

    contenuTitreH2.textContent = window.appState.selectedChapitreTitre || "Contenu du chapitre";

    if (contenuPath && contenuPath.trim() !== "") {
        try {
            const response = await fetch(contenuPath);
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status} lors du chargement de ${contenuPath}`);
            }
            const htmlContent = await response.text();
            contenuTexteDiv.innerHTML = htmlContent;
            console.log(`Contenu du chapitre ${chapitreId} (${contenuPath}) chargé.`);

            if (window.MathJax && window.MathJax.typesetPromise) {
                await window.MathJax.typesetPromise([contenuTexteDiv]);
                console.log('MathJax a traité le contenu du chapitre.');
            } else {
                console.warn('MathJax n\'est pas prêt ou typesetPromise n\'est pas disponible.');
            }
        } catch (err) {
            console.error(`Erreur lors du chargement du contenu (${contenuPath}):`, err);
            contenuTexteDiv.innerHTML = `<p>Impossible de charger le contenu du chapitre. Vérifiez que le fichier '${contenuPath}' existe.</p>`;
        }
    } else {
        contenuTexteDiv.innerHTML = '<p>Aucun chemin de contenu spécifié pour ce chapitre.</p>';
        console.log(`Aucun contenuPath pour chapitre ${chapitreId}`);
    }
}

// Les autres fonctions (Quiz, Glossaire, Progression) seront ajoutées dans les étapes suivantes.


// --- FONCTIONS DU QUIZ (PAR CHAPITRE ET GÉNÉRAL) ---

function startQuiz(chapitreId) {
    if (!window.db || !chapitreId) {
        console.error("DB non prête ou chapitreId manquant pour démarrer le quiz du chapitre.");
        alert("Impossible de démarrer le quiz. Veuillez sélectionner un chapitre valide.");
        return;
    }
    window.appState.currentQuizType = 'chapitre';

    const quizTitreH2 = document.getElementById('quiz-titre');
    quizTitreH2.textContent = `Quiz pour: ${window.appState.selectedChapitreTitre || 'Chapitre en cours'}`;

    try {
        const questionsStmt = window.db.prepare("SELECT id, texte_question, explication FROM Questions WHERE chapitre_id = :chapitre_id AND type_question = 'QCM'");
        questionsStmt.bind({ ':chapitre_id': chapitreId });

        window.appState.quizQuestions = [];
        while (questionsStmt.step()) {
            const q = questionsStmt.getAsObject();
            const optionsStmt = window.db.prepare("SELECT id, texte_option, est_correcte FROM OptionsReponses WHERE question_id = :question_id ORDER BY RANDOM()");
            optionsStmt.bind({ ':question_id': q.id });
            q.options = [];
            while (optionsStmt.step()) {
                q.options.push(optionsStmt.getAsObject());
            }
            optionsStmt.free();
            window.appState.quizQuestions.push(q);
        }
        questionsStmt.free();

        if (window.appState.quizQuestions.length === 0) {
            alert("Aucune question de quiz (QCM) trouvée pour ce chapitre.");
            showSection('contenuChapitre');
            return;
        }

        window.appState.quizQuestions.sort(() => Math.random() - 0.5); // Mélanger les questions
        window.appState.currentQuestionIndex = 0;
        window.appState.userScore = 0;
        window.appState.quizTotalQuestions = window.appState.quizQuestions.length;

        document.getElementById('prochaine-question').style.display = 'none';
        document.getElementById('terminer-quiz').style.display = 'none';

        displayQuestion();
        showSection('quiz');
        console.log("Quiz de chapitre démarré avec", window.appState.quizQuestions.length, "questions.");

    } catch (err) {
        console.error("Erreur lors du démarrage du quiz de chapitre:", err);
        alert("Une erreur est survenue lors du chargement du quiz de chapitre.");
    }
}

function startGeneralQuiz(numQuestions = 20) {
    if (!window.db) {
        console.error("DB non prête pour démarrer le quiz général.");
        alert("Impossible de démarrer le quiz général. La base de données n'est pas accessible.");
        return;
    }
    window.appState.currentQuizType = 'general';
    window.appState.selectedChapitreId = null; // Pas de chapitre spécifique
    window.appState.selectedChapitreTitre = "Quiz Général";


    const quizTitreH2 = document.getElementById('quiz-titre');
    quizTitreH2.textContent = "Quiz Général Aléatoire";

    try {
        // Récupérer N questions aléatoires de toute la base
        const questionsStmt = window.db.prepare(`SELECT id, texte_question, explication FROM Questions ORDER BY RANDOM() LIMIT ${numQuestions}`);
        // Note: l'interpolation directe de numQuestions est généralement sûre si numQuestions est un nombre contrôlé par nous.
        // Pour une sécurité maximale, on pourrait binder, mais LIMIT ne prend pas de placeholder directement dans toutes les versions de SQLite via JS.

        window.appState.quizQuestions = [];
        while (questionsStmt.step()) {
            const q = questionsStmt.getAsObject();
            const optionsStmt = window.db.prepare("SELECT id, texte_option, est_correcte FROM OptionsReponses WHERE question_id = :question_id ORDER BY RANDOM()");
            optionsStmt.bind({ ':question_id': q.id });
            q.options = [];
            while (optionsStmt.step()) {
                q.options.push(optionsStmt.getAsObject());
            }
            optionsStmt.free();
            window.appState.quizQuestions.push(q);
        }
        questionsStmt.free();

        if (window.appState.quizQuestions.length === 0) {
            alert("Aucune question de quiz trouvée dans la base de données pour un quiz général.");
            showSection('accueil'); // Retour à l'accueil
            return;
        }

        // Si moins de questions que demandé sont disponibles, ajuster totalQuestions
        window.appState.quizTotalQuestions = window.appState.quizQuestions.length;

        console.log(`Quiz général démarré avec ${window.appState.quizTotalQuestions} questions (demandé: ${numQuestions}).`);

        window.appState.currentQuestionIndex = 0;
        window.appState.userScore = 0;

        document.getElementById('prochaine-question').style.display = 'none';
        document.getElementById('terminer-quiz').style.display = 'none';

        displayQuestion();
        showSection('quiz');

    } catch (err) {
        console.error("Erreur lors du démarrage du quiz général:", err);
        alert("Une erreur est survenue lors du chargement du quiz général.");
    }
}


function displayQuestion() {
    const questionArea = document.getElementById('question-area');
    const optionsArea = document.getElementById('options-area');
    const feedbackArea = document.getElementById('feedback-area');
    const prochaineQuestionBtn = document.getElementById('prochaine-question');
    const terminerQuizBtn = document.getElementById('terminer-quiz');

    feedbackArea.innerHTML = '';
    feedbackArea.className = '';
    prochaineQuestionBtn.style.display = 'none';
    terminerQuizBtn.style.display = 'none';
    optionsArea.innerHTML = '';

    if (window.appState.currentQuestionIndex < window.appState.quizQuestions.length) {
        const currentQ = window.appState.quizQuestions[window.appState.currentQuestionIndex];
        questionArea.textContent = `${window.appState.currentQuestionIndex + 1}. ${currentQ.texte_question}`;

        currentQ.options.forEach(opt => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            optionDiv.textContent = opt.texte_option;
            optionDiv.setAttribute('data-option-id', opt.id);
            optionDiv.setAttribute('data-question-id', currentQ.id);

            optionDiv.addEventListener('click', handleOptionClick);
            optionsArea.appendChild(optionDiv);
        });
    } else {
        showQuizResults();
    }
}

function handleOptionClick(event) {
    const selectedOptionDiv = event.target;
    // Assurer que l'on ne traite qu'une fois le clic (même si l'event listener est là)
    if (selectedOptionDiv.parentElement.classList.contains('answered')) return;
    selectedOptionDiv.parentElement.classList.add('answered');


    const questionId = parseInt(selectedOptionDiv.getAttribute('data-question-id'));
    const optionId = parseInt(selectedOptionDiv.getAttribute('data-option-id'));

    const currentQ = window.appState.quizQuestions.find(q => q.id === questionId);
    if (!currentQ) return;

    const selectedOptObj = currentQ.options.find(opt => opt.id === optionId);
    if (!selectedOptObj) return;

    const allOptionDivs = document.querySelectorAll('#options-area .option-item');
    allOptionDivs.forEach(div => {
        div.style.pointerEvents = 'none'; // Désactive clics futurs pour cette question
        // div.removeEventListener('click', handleOptionClick); // Alternative, mais pointer-events est plus simple pour le visuel
    });


    const feedbackArea = document.getElementById('feedback-area');
    let feedbackText = "";

    if (selectedOptObj.est_correcte) {
        window.appState.userScore++;
        selectedOptionDiv.classList.add('correct');
        feedbackArea.className = 'correct';
        feedbackText = "<strong>Correct !</strong> ";
    } else {
        selectedOptionDiv.classList.add('incorrect');
        feedbackArea.className = 'incorrect';
        feedbackText = "<strong>Incorrect.</strong> ";
        const correctOption = currentQ.options.find(o => o.est_correcte);
        if (correctOption) {
            allOptionDivs.forEach(div => {
                if (parseInt(div.getAttribute('data-option-id')) === correctOption.id) {
                    div.classList.add('correct');
                }
            });
        }
    }

    if (currentQ.explication) {
        feedbackText += currentQ.explication;
    }
    feedbackArea.innerHTML = `<p>${feedbackText}</p>`;

    if (window.appState.currentQuestionIndex < window.appState.quizQuestions.length - 1) {
        document.getElementById('prochaine-question').style.display = 'inline-block';
    } else {
        document.getElementById('terminer-quiz').style.display = 'inline-block';
    }
}

function nextQuestion() {
    // Réinitialiser la classe 'answered' pour le prochain set d'options
    const optionsArea = document.getElementById('options-area');
    if(optionsArea) optionsArea.classList.remove('answered');

    window.appState.currentQuestionIndex++;
    if (window.appState.currentQuestionIndex < window.appState.quizQuestions.length) {
        displayQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    const scoreFinalP = document.getElementById('score-final');
    const recapQuizP = document.getElementById('recapitulatif-quiz');

    const totalQuestions = window.appState.quizTotalQuestions;
    const score = window.appState.userScore;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    scoreFinalP.textContent = `Votre score: ${score} / ${totalQuestions} (${percentage.toFixed(1)}%)`;

    if (window.appState.currentQuizType === 'general') {
        recapQuizP.textContent = "Quiz général terminé.";
    } else {
        recapQuizP.textContent = `Quiz pour le chapitre "${window.appState.selectedChapitreTitre}" terminé.`;
    }

    // Appel à saveQuizResult (sera implémenté à l'étape suivante)
    saveQuizResult(
        window.appState.currentQuizType === 'chapitre' ? window.appState.selectedChapitreId : null,
        score,
        totalQuestions,
        window.appState.currentQuizType
    );

    // Gérer l'affichage des boutons de retour dans showSection
    showSection('resultatsQuiz');
}

function saveQuizResult(chapitreId, score, totalQuestions, typeQuiz) {
    if (!window.db) {
        console.error("DB non prête pour enregistrer le résultat du quiz.");
        // Optionnel: Informer l'utilisateur que le score n'a pas été sauvegardé.
        return;
    }
    // chapitreId peut être null pour un quiz général, c'est géré par la DB (colonne nullable)
    if (typeQuiz !== 'chapitre' && typeQuiz !== 'general') {
        console.error(`Type de quiz inconnu: ${typeQuiz}. Le résultat ne sera pas sauvegardé.`);
        return;
    }
    if (typeQuiz === 'chapitre' && (chapitreId === null || chapitreId === undefined)) {
        console.error("chapitreId manquant pour un quiz de type 'chapitre'. Le résultat ne sera pas sauvegardé.");
        return;
    }

    try {
        const stmt = window.db.prepare("INSERT INTO ResultatsQuiz (chapitre_id, score, total_questions, type_quiz) VALUES (:chapitre_id, :score, :total_questions, :type_quiz)");
        stmt.bind({
            ':chapitre_id': chapitreId, // Sera NULL si quiz général et chapitreId est null
            ':score': score,
            ':total_questions': totalQuestions,
            ':type_quiz': typeQuiz
        });
        stmt.step();
        stmt.free();
        console.log(`Résultat du quiz (${typeQuiz}) enregistré: Chapitre ID ${chapitreId}, Score ${score}/${totalQuestions}`);

        // Optionnel: Déclencher un rechargement de la section progression si elle est la vue active
        // ou si l'utilisateur navigue vers elle ensuite. Pour l'instant, elle se recharge au clic.

    } catch (err) {
        console.error("Erreur lors de l'enregistrement du résultat du quiz dans la DB:", err);
    }
}


console.log("main.js (reconstruction) chargé.");
