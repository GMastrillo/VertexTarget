// Domain message dictionary for auth (it)
import type { AuthDictionary } from '../../types';

const messages: AuthDictionary = {
  "login": {
    "title": "Accedi al Workspace",
    "subtitle": "Inserisci le tue credenziali per continuare.",
    "emailLabel": "Indirizzo e-mail",
    "passwordLabel": "Password",
    "submit": "Accedi",
    "noAccount": "Non hai un account?",
    "signupLink": "Crea account gratuito",
    "forgotPassword": "Password dimenticata?"
  },
  "signup": {
    "title": "Crea Account Gratuito",
    "subtitle": "Registrati per accedere a Vertex OS.",
    "nameLabel": "Il tuo nome",
    "emailLabel": "E-mail professionale",
    "passwordLabel": "Password (minimo 12 caratteri)",
    "termsAgreement": "Accetto i Termini di Servizio e la Privacy Policy",
    "submit": "Registrati",
    "hasAccount": "Hai già un account?",
    "loginLink": "Accedi"
  },
  "recovery": {
    "title": "Recupera Password",
    "subtitle": "Invieremo un link sicuro al tuo indirizzo e-mail.",
    "emailLabel": "E-mail registrata",
    "submit": "Invia Link di Recupero",
    "backToLogin": "Torna all’accesso"
  },
  "reset": {
    "title": "Reimposta Password",
    "subtitle": "Inserisci la tua nuova password.",
    "newPasswordLabel": "Nuova password",
    "submit": "Aggiorna Password"
  }
};

export default messages;
