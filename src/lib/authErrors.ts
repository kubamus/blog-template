import { CredentialsSignin } from "next-auth";

class TooManyAttemptsError extends CredentialsSignin {
  code = 'rate_limit';
  errorMessage = "Too many attempts";
}

class InvalidCredentialsError extends CredentialsSignin {
  code = 'invalid_credentials';
  errorMessage = "Invalid credentials";
}

class ValidationError extends CredentialsSignin {
  code = 'validation_error';
  errorMessage = "Validation error";
}

export {
  TooManyAttemptsError,
  InvalidCredentialsError,
  ValidationError
}