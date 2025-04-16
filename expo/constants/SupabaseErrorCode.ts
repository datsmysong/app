export const SupabaseErrorCode = {
  CONSTRAINT_VIOLATION: "23505",
};

// AuthError not have code, so we need to check the message instead
export enum AuthErrorMessage {
  EmailNotConfirmed = "Email not confirmed",
  InvalidCredentials = "Invalid credentials",
  EmailAlreadyUsed = "A user with this email address has already been registered",
}
