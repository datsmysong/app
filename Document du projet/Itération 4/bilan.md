# Bilan

## Etat de la version

### A ce stade, notre application permet de

- Créer un compte utilisateur à partir d’un compte Spotify, Google, ou d’un email et mot de passe
- Créer une salle d'écoute dans la base de données depuis un formulaire
- Générer un lien vers une salle d'écoute
- Rejoindre une salle d'écoute via un lien (seulement en tant qu'utilisateur connecté)
- Consulter la file d'attente d'une salle d'écoute
- Générer un lien vers la salle d'écoute et rejoindre une salle d'écoute grâce à ce lien
- Menu d'intégrations des plateformes (Spotify et SoundCloud implémentés)
- Modifier les paramètres de son profil (nom, email, avatar stocké en base de donnée)
- Fermeture d’une salle d’écoute pour le créateur de la salle
- Suppression d’une musique pour le créateur de la salle
- Ecouter une musique dans une salle d’écoute

### Certaines fonctionnalités ont été reportées à la prochaine itération

- Créer le menu de paramétrage d’une salle d’écoute

### Bugs

- Impossible de faire des requêtes sur notre backend avec les informations d'authentification (pour vérifier le compte de l'utilisateur) sur mobile (mais fonctionne sur desktop). Cela concerne la création d'une salle d'écoute notamment.

### Validation

Toutes les fonctionnalités présentes sur le main du dépôt ont été vérifiées.

## Conformité des choix de cette itération par rapport à l'étude préalable

- Ajout de maquettes
  - écran de partage d'une salle active
  - page d'une salle d'écoute passée
- Communication avec le backend
  - Implémentation pour chaque plateforme de streaming (certaines communiquant à nouveau avec le websocket)
