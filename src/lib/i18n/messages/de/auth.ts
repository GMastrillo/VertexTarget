// Domain message dictionary for auth (de)
import type { AuthDictionary } from '../../types';

const messages: AuthDictionary = {
  "login": {
    "title": "Workspace aufrufen",
    "subtitle": "Geben Sie Ihre Zugangsdaten ein, um fortzufahren.",
    "emailLabel": "E-Mail-Adresse",
    "passwordLabel": "Passwort",
    "submit": "Anmelden",
    "noAccount": "Noch kein Konto?",
    "signupLink": "Kostenloses Konto anlegen",
    "forgotPassword": "Passwort vergessen?"
  },
  "signup": {
    "title": "Kostenloses Konto erstellen",
    "subtitle": "Registrieren Sie sich für den Zugang zu Vertex OS.",
    "nameLabel": "Ihr Name",
    "emailLabel": "Geschäftliche E-Mail",
    "passwordLabel": "Passwort (mind. 12 Zeichen)",
    "termsAgreement": "Ich akzeptiere die AGB und die Datenschutzerklärung",
    "submit": "Registrieren",
    "hasAccount": "Bereits registriert?",
    "loginLink": "Anmelden"
  },
  "recovery": {
    "title": "Passwort wiederherstellen",
    "subtitle": "Wir senden Ihnen einen sicheren Link per E-Mail.",
    "emailLabel": "Registrierte E-Mail",
    "submit": "Wiederherstellungslink senden",
    "backToLogin": "Zurück zur Anmeldung"
  },
  "reset": {
    "title": "Passwort zurücksetzen",
    "subtitle": "Geben Sie Ihr neues Passwort ein.",
    "newPasswordLabel": "Neues Passwort",
    "submit": "Passwort aktualisieren"
  }
};

export default messages;
