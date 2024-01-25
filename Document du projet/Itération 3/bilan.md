# Bilan

## Etat de la version

Notre application permet de :

- S’authentifier à l’aide de deux providers (Google & Spotify)
- Créer une salle d'écoute dans la base de données depuis un formulaire
- Générer un lien vers une salle d'écoute
- Rejoindre une salle d'écoute via un lien (seulement en tant qu'utilisateur connecté)
- Ajouter une musique à la file d'attente (backend)
- Créer un compte à partir d’une adresse email et d’un mot de passe

Certaines fonctionnalités n'ont pas pu être terminées à temps :

- Contrôle du flux de lecture via un Widget intégré ou un lecteur externe
- Créer la logique des interactions avec les plateformes de musique
- Implémenter la logique pour chaque plateforme de streaming
- Gérer son compte (partie information personnels: avatar, changer de pseudo, d’email..)
- Consulter la file d'attente d'une salle d'écoute avec une écoute en utilisant un websocket


### Bugs

- Aucun bug n'a été trouvé sur cette itération (mise à part les bugs dans fonctionnalités en cours de développement)

### Validation

Toutes les fonctionnalités présentes sur le main du dépôt ont été vérifiées.

## Conformité des choix de cette itération par rapport à l'étude préalable

- Ajout de maquettes
  - écran de partage d'une salle active
  - page d'une salle d'écoute passée
