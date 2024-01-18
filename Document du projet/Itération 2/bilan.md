# Bilan itération 2

## Etat de la version

#### Notre application permet de :

_Itération 1_

- Créer un compte / se connecter à l'aide de Spotify
- Créer une salle d'écoute dans la base de données depuis un formulaire
- Générer un lien vers une salle d'écoute
- Rejoindre une salle d'écoute via un lien (seulement en tant qu'utilisateur connecté)
- Ajouter une musique à la file d'attente (backend)

_Itération 2_

- S’authentifier à l’aide de deux providers (Google & Spotify)
- Consulter la file d'attente d'une salle d'écoute avec une écoute en utilisant un websocket

#### Certaines fonctionnalités n'ont pas pu être terminées à temps :

- Contrôle du flux de lecture via un Widget intégré ou un lecteur externe
- Authentification à l’aide d’un identifiant et mot de passe
- Créer la logique des interactions avec les plateformes de musique
- Implémenter la logique pour chaque plateforme de streaming

### Bugs

- Résolution d’un bug sur notre vérification des droits des utilisateurs dans la navigation
- Résolution d’un bug sur notre backend sur la route de création d’une salle
- L’application ne redirige pas automatiquement l’utilisateur PC sur la page de la salle d’écoute

### Validation

Toutes les fonctionnalités présentes sur le main du dépôt ont été vérifiées.

## Conformité des choix de cette itération par rapport à l'étude préalable

- De légères modifications de types sur la base de données
- Ajout de maquettes nécessaires pour la page des intégrations
- Ajout d'un diagramme de séquence pour bien comprendre le flux du WebSocket, qui était prévu dans l'étude préalable mais pas détaillé
