import { RegisterOptions } from "react-hook-form";

/**
 * This file contains all the rules for the inputs with library react-hook-form
 */

const usernameRules: RegisterOptions = {
  required: "Un nom d'utilisateur est requis",
  minLength: {
    value: 3,
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
  },
  maxLength: {
    value: 15,
    message: "Le nom d'utilisateur doit contenir au plus 15 caractères",
  },
  // pas d'espace ni de caractères spéciaux
  pattern: {
    value: /^[a-zA-Z0-9]*$/,
    message:
      "Le nom d'utilisateur ne doit contenir que des lettres et des chiffres",
  },
};

const emailRules: RegisterOptions = {
  required: "Veuillez saisir votre adresse email",
  pattern: {
    value: /\S+@\S+\.\S+/,
    message: "Veuillez saisir une adresse email valide",
  },
};

const passwordRules: RegisterOptions = {
  required: "Veuillez saisir votre mot de passe",
  minLength: {
    value: 6,
    message: "Le mot de passe doit contenir au moins 6 caractères",
  },
  validate: {
    hasNumber: (value) =>
      /\d/.test(value) || "Le mot de passe doit contenir un chiffre",
    hasUppercase: (value) =>
      /[A-Z]/.test(value) || "Le mot de passe doit contenir une majuscule",
    hasLowercase: (value) =>
      /[a-z]/.test(value) || "Le mot de passe doit contenir une minuscule",
  },
};

const displayNameRules: RegisterOptions = {
  required: "Veuillez saisir votre nom d'affichage",
  minLength: {
    value: 3,
    message: "Le nom d'affichage doit contenir au moins 3 caractères",
  },
  maxLength: {
    value: 15,
    message: "Le nom d'affichage doit contenir au plus 15 caractères",
  },
};

export { emailRules, passwordRules, usernameRules, displayNameRules };
