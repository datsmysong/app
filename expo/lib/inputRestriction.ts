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

export { emailRules, passwordRules, usernameRules };
