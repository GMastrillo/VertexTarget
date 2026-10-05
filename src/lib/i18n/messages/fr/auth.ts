// Domain message dictionary for auth (fr)
import type { AuthDictionary } from '../../types';

const messages: AuthDictionary = {
  "login": {
    "title": "Accéder à l’Espace",
    "subtitle": "Entrez vos identifiants pour continuer.",
    "emailLabel": "Adresse e-mail",
    "passwordLabel": "Mot de passe",
    "submit": "Se Connecter",
    "noAccount": "Pas encore de compte ?",
    "signupLink": "Créer un compte gratuit",
    "forgotPassword": "Mot de passe oublié ?"
  },
  "signup": {
    "title": "Créer un Compte Gratuit",
    "subtitle": "Inscrivez-vous pour accéder à Vertex OS.",
    "nameLabel": "Votre nom",
    "emailLabel": "E-mail professionnel",
    "passwordLabel": "Mot de passe (min. 12 caractères)",
    "termsAgreement": "J’accepte les Conditions et la Politique de Confidentialité",
    "submit": "S’inscrire",
    "hasAccount": "Déjà un compte ?",
    "loginLink": "Se connecter"
  },
  "recovery": {
    "title": "Récupérer le Mot de Passe",
    "subtitle": "Nous vous enverrons un lien sécurisé par e-mail.",
    "emailLabel": "E-mail enregistré",
    "submit": "Envoyer le Lien",
    "backToLogin": "Retour à la connexion"
  },
  "reset": {
    "title": "Réinitialiser le Mot de Passe",
    "subtitle": "Saisissez votre nouveau mot de passe.",
    "newPasswordLabel": "Nouveau mot de passe",
    "submit": "Mettre à Jour"
  }
};

export default messages;
