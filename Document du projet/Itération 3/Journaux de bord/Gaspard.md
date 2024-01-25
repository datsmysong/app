# 📰 Journal de bord | Gaspard. B

# Semaine 22/01 ⇒ 26/01

## Lundi

- 8h ⇒ 10h40 : Backend de ma fonctionnalité pour créer un compte avec un identifiant et un mot de passe
- 10h45 ⇒ 12h30 : Front de ma fonctionnalité pour créer un compte avec un identifiant et un mot de passe, avec les champs
  - Création de composant pour faire des formulaires plus tard de la même manière (réutilisabilité)
  - Respect du style des maquettes
  - Refactor
- 13h30 ⇒ 14h : Réunion avec notre tuteur
  - Résolutions prises après discussion
    - fusionner la branche main tous les matins
    - faire une revue de PR une fois par jour (nous prenons 1h par jour pour donner un compte rendu du code sur les branches de chacun)
    - chaque matin, regarder les revues des camarades sur notre code
  - D’autres aspects intéressants vus (petit point personnel des deux premières semaines pour chacun)
- 14h ⇒ 15h10 : Création d’un composant password-input, avec la logique pour afficher le mot de passe ou non
- 15h15 ⇒ 16h : Tests des formulaires, correctifs & rebase du main
- 16h ⇒ 17h : Respect de nos configurations Eslint & Prettier mises en place ce weekend sur le code que je maintiens actuellement sur ma branche (_feat/auth-forms_).
- 17h ⇒ 18h : analyse et commentaire de la branche de Thomas + début d’analyse de la branche d’Hugo
- 19h ⇒ 19h30 : analyse de la branche de Noam et Maxence

## Mardi

- 8h - 9h : ajout d’une limite de taux d’appel sur notre serveur backend
- 9h - 10h : Ajout de préfixe sur les routes du backend, cela permet de refactoriser le code, en regroupant par exemple toutes les routes d’authentifications commençant par `/auth/…` dans un même fichier
- 10h - 12h :
  - création d’un composant Warning, permettant d’afficher les erreurs
  - Réunion quotidienne où on aborde plusieurs thèmes comme les revues de code faites la veille
- 14h-16h : Début de ma nouvelle fonctionnalité, création du layout de la page gérer mon compte pour travailler sur la page informations personnelles
- 16h - 17h : Essai d’ajout de la photo de profil sur la base de données
- 17h - 18h : relecture du code des camarades

## Mercredi

- 8h - 10h : Ajout d’une alerte permettant de renvoyer le mail de confirmation lors de l’inscription. Mise à jour du composant Warning pour qu’il soit utilisable dans toute l’application & résolution des petits soucis déclarés lors des relectures de mon code par mes camarades
- 10h - 10h30 : Réunion quotidienne où on aborde plusieurs thèmes comme les retours de code faits la veille
- 10h - 11h : Ajout de la logique pour faire disparaître l’alerte de confirmation (avec le formulaire, au premier changement après l’erreur il disparaît)
- 11h - 13h : Logique pour ajouter un avatar (image) dans la base de données concluante sur ordinateur
- 14h - 16h : Logique d’ajout d’un avatar sur appareil mobile, et style de la page
- 16h - 18h : fusion des branches finies sur main & relecture des camarades

## Jeudi

- 8h - 10h : Préparation de la soutenance (documents, diapositives, etc.) & daily
- 10h - 12h : Soutenance puis/avant correction des erreurs soulevées lors des relectures de mes camarades hier soir
