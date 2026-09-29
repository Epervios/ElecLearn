# Recette manuelle — ElecLearn v2

## Navigateurs et dimensions
- Bureau Chrome/Edge et Firefox : 1440 × 900 et 1024 × 768.
- Tablette iPad/Safari ou émulation : 820 × 1180, portrait et paysage.
- Mobile iOS Safari / Android Chrome : 320 × 640, 375 × 812, 430 × 932.
- Navigation au clavier, zoom 200 % et préférence « réduire les animations ».

## Scénarios
1. Ouvrir chaque fascicule depuis l'accueil : six, quatre et cinq chapitres respectivement.
2. Sur mobile, naviguer avec la barre basse : cinq entrées visibles et aucune barre horizontale.
3. Rechercher « transformateur », ouvrir le chapitre 14 et changer N1/N2 dans son simulateur.
4. Lire un chapitre, revenir au sommaire : statut « En cours ».
5. Atteindre au moins 70 % au quiz correspondant : statut « Acquis ».
6. Fermer et rouvrir le navigateur : la progression reste disponible.
7. Lancer 15 questions « tout le programme » : vérifier la représentation des trois fascicules.
8. Contrôler les laboratoires 2, 7, 8, 10, 11, 12, 14 et 15.
9. Après une visite en HTTPS, activer le mode avion, recharger et lire les quinze chapitres.
10. Contrôler le sommaire des leçons, les formules MathJax en ligne, les touches 1–4 et le focus visible.
11. Simuler l'indisponibilité de SQLite : cours et 48 questions doivent rester accessibles.
12. Vérifier le bouton « Effacer mes données » et sa confirmation.

## Limites connues
- La première installation hors connexion requiert une visite préalable en ligne.
- MathJax est actuellement chargé depuis un CDN : un premier rendu de formules entièrement hors connexion n'est pas garanti.
- Les anciens résultats SQLite seulement présents en mémoire du navigateur ne sont pas récupérables après fermeture.
- Aucun PDF F.E.T original ne doit être publié sur le dépôt sans autorisation de reproduction.


## Illustrations et bibliothèque privée

13. Ouvrir chacun des quinze chapitres ; contrôler les illustrations SVG, le titre accessible et la légende en mode ordinateur et téléphone.
14. Vérifier que les trois cartes de fascicule affichent une miniature vectorielle lisible.
15. Importer des PDF locaux d'un support de cours et d'une annale 2024 ; contrôler le classement par domaine, année et métier.
16. Ouvrir un PDF dans l'aperçu, puis dans un onglet séparé. Fermer l'aperçu et supprimer le document ; aucun fichier ne doit apparaître dans les requêtes sortantes.
17. Recharger la bibliothèque : les PDF restent présents sur cet appareil. Vérifier l'effet du mode navigation privée et d'un quota insuffisant.
18. Décompresser l'archive d'annales avant import ; un ZIP ne doit pas être accepté comme PDF.
19. Lancer un entraînement professionnel général et ciblé sur les mathématiques ; contrôler les corrections et la conservation des résultats.
20. Tester le catalogue sur iPhone Safari, Android Chrome, tablette et bureau : les prévisualisations PDF dépendent des capacités natives de chaque navigateur.
21. S'assurer que les neuf documents complets et les 44 sujets officiels ne sont jamais copiés dans GitHub Pages, dans le cache du service worker ni dans un artefact CI.
