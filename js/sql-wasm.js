// Placeholder pour sql-wasm.js
// VEUILLEZ REMPLACER CE FICHIER PAR LE VRAI FICHIER sql-wasm.js TÉLÉCHARGÉ DEPUIS
// https://github.com/sql-js/sql.js/releases
// Ce fichier est nécessaire pour que sql.js fonctionne.

console.warn("PLACEHOLDER: sql-wasm.js. Remplacer par le fichier réel de sql.js.");

// Contenu typique d'un tel fichier (très simplifié pour l'exemple)
var initSqlJs = async function(config) {
    console.log("Placeholder initSqlJs appelé. Le vrai sql.js est nécessaire pour la fonctionnalité DB.");
    // Simuler l'API pour éviter les erreurs immédiates dans main.js si le vrai fichier n'est pas là
    return Promise.resolve({
        Database: function(data) {
            console.warn("Placeholder SQL.Database instanciée. Fonctionnalité DB limitée/absente.");
            return {
                exec: function(query) {
                    console.log(`Placeholder db.exec: ${query}`);
                    if (query.toUpperCase().includes("SELECT SQLITE_VERSION()")) {
                        return [{ columns: ['sqlite_version()'], values: [['?.?.? (Placeholder DB)']] }];
                    }
                    if (query.toUpperCase().includes("FROM CHAPITRES")) {
                         return [{ columns: ['id', 'numero_chapitre', 'titre', 'contenu_path'], values: [[1,1,'Chapitre Placeholder 1','contenu/placeholder.html']] }];
                    }
                    return []; // Retourne un résultat vide pour les autres requêtes
                },
                prepare: function(query) {
                    console.log(`Placeholder db.prepare: ${query}`);
                    return {
                        step: function() { return false; }, // Simule aucune ligne retournée
                        getAsObject: function() { return {}; },
                        free: function() {},
                        bind: function() {}
                    };
                },
                close: function() { console.log("Placeholder db.close appelée."); },
                export: function() { return new Uint8Array(0); }
            };
        }
    });
};
