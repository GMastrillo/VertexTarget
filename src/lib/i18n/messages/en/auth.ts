// Domain message dictionary for auth (en)
import type { AuthDictionary } from '../../types';

const messages: AuthDictionary = {
  "login": {
    "title": "Access Workspace",
    "subtitle": "Enter your credentials to continue.",
    "emailLabel": "Email",
    "passwordLabel": "Password",
    "submit": "Sign In",
    "noAccount": "Do not have an account?",
    "signupLink": "Create free account",
    "forgotPassword": "Forgot password?"
  },
  "signup": {
    "title": "Create Free Account",
    "subtitle": "Sign up to get access to Vertex OS.",
    "nameLabel": "Your name",
    "emailLabel": "Work email",
    "passwordLabel": "Password (min. 12 characters)",
    "termsAgreement": "I agree to the Terms of Service and Privacy Policy",
    "submit": "Sign Up",
    "hasAccount": "Already have an account?",
    "loginLink": "Sign in"
  },
  "recovery": {
    "title": "Recover Password",
    "subtitle": "We will send a secure reset link to your email.",
    "emailLabel": "Registered email",
    "submit": "Send Recovery Link",
    "backToLogin": "Back to sign in"
  },
  "reset": {
    "title": "Reset Password",
    "subtitle": "Enter your new password to proceed.",
    "newPasswordLabel": "New password",
    "submit": "Update Password"
  }
};

export default messages;
