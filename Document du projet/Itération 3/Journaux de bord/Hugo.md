# Journal de bord :

## lundi 22 janvier 2024

Aujourd'hui, j'ai réglé les problèmes (doublons : lignes ou fichiers,...) causés à cause d'une mauvaise utilisation de git...

J'ai également ajouté un fichier qui contient un type commun entre backend dans frontend dans le package "common".

Normalement, celle-ci est presque terminé ainsi que rebase sur origin/main.

Le seul problème est le style qui ne correspond pas à la maquette.

## mardi 23 janvier 2024

Déplacement du type RoomJSON vers le paquet common "commons"

La variable EXPO_PUBLIC_API_ENDPOINT permet dans mon code front de pointer vers le backend, cependant dans le code commun une autre variable le permettait déjà EXPO_PUBLIC_BACKEND_API, j'ai donc décidé d'utiliser cette dernière dans mon code.

J'ai renommé la MusicStorage par RoomStorage que ce soit les variables en elle-même ou les classes portant ce nom.

Reformatage de la classe Track en rendant le constructeur privé et en remplaçant son utilisation dans une méthode newTrackMetadata qui crée un objet s'il n'y a pas d'erreur dans les paramètres passés

Séparation des composants servant à afficher la liste des morceaux de musique stockés dans une file d'attente d'une salle d'écoute. 

## mercredi 24 janvier 2024

Aujourd'hui, j'ai mis en conformité le style de la page : file d'attente d'une salle d'écoute active, à la maquette Figma correspondante.

J'ai aussi implémenté correctement la suppression d'un morceau à l'aide d'un lien, ce qui avait été codé précédemment n'avait pas été testé et après relecture le code rempli d'effet de bord.

J'ai également ajouté la suppression d'un morceau avec dans place dans la liste : plus précisément, il faut passer l'index du morceau dans la liste, donc à partir de 0.

J'ai découvert quelques bugs, dont un qui bloquait totalement l'application, car le problème venait de l'API de Spotify qui déclenchait une erreur quand un id de morceau était invalide.
J'ai donc wrappé la méthode qui appelle les API externes des services de streaming musicaux (pour l'instant juste Spotify)
