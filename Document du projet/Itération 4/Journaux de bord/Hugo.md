# 📰 Journal de bord

## Lundi

| Horaire   | Tâche                         |
| --------- | ----------------------------- |
| 8h - 17h | J'ai ajouté un nouvel écran permettant d'ajouter un morceau à partir de son URL Spotify dans une file d'attente.
||Cette page est accessible depuis un bouton situé en bas à droite dans l'écran correspondant à la salle d'écoute.
||J'ai lié mes fonctionnalités à celle déjà présente sur main, comme la création de playlist qui reliée à ma page affichant la file d'attente.
||J'ai aussi adapté la création de salle d'écoute sur le serveur, celle-ci est récupéré ou créé sur le serveur, seulement si elle existe dans la base de donnée.
||En effet, la récupération d'une salle d'écoute est possible avec le code de partage, mais aussi son identifiant unique.
||Merge de la branche sur le main
| 17h - 18h | Review des pull-requests

## Mardi

| Horaire  | Tâche |
| -------- | ----- |
| 8h - 8h30 | Création d'une nouvelle branche "feat/close-book" attachée à la fonctionnalité "Fermer une salle d'écoute en tant qu'hôte" |
| 8h30h - 9h | Ajout d'un bouton temporaire pour supprimer une salle d'écoute |
| 9h - 16h | Création d'une route HTTP permettant de supprimer une salle d'écoute : - cela consiste à vérifier si l'utilisateur est bien l'hôte de la salle - supprimer la salle d'écoute du serveur - définir la salle d'écoute comme inactive et supprimer son code de partage dans la base de donnée - avertir tous les participants que la salle d'écoute est supprimé |
| 16h - 17h | Rendre le code plus orienté production (nettoyage, suppression des bugs) |

## Mercredi

| Horaire   | Tâche |
| --------- | ----- |
| 8h - 8h30 | ...   |

## Jeudi

| Horaire  | Tâche |
| -------- | ----- |
| 8h - 10h | ...   |
