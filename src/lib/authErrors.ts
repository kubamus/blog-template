import { CredentialsSignin } from "next-auth";

class TooManyAttemptsError extends CredentialsSignin {
  code = 'rate_limit';
  errorMessage = "Too many attempts";
  constructor(message?: any, errorOptions?: any) {
    super(message, errorOptions);
  }
}

class InvalidCredentialsError extends CredentialsSignin {
  code = 'invalid_credentials';
  errorMessage = "Invalid credentials";
  constructor(message?: any, errorOptions?: any) {
    super(message, errorOptions);
  }
}

class ValidationError extends CredentialsSignin {
  code = 'validation_error';
  errorMessage = "Validation error";
  constructor(message?: any, errorOptions?: any) {
    super(message, errorOptions);
  }
}

export {
  TooManyAttemptsError,
  InvalidCredentialsError,
  ValidationError
}