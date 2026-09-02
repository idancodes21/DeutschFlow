export function getAuthErrorMessage(code: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account already exists with this email.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Please choose a stronger password.";

    default:
      return "Something went wrong. Please try again.";
  }
}
