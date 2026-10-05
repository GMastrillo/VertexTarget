// Domain message dictionary for os (fr)
import type { OsDictionary } from '../../types';

const messages: OsDictionary = {
  "shell": {
    "dashboard": "Tableau de bord",
    "projects": "Projets",
    "prospects": "Prospection",
    "settings": "Paramètres",
    "logout": "Déconnexion"
  },
  "projects": {
    "title": "Vos Projets",
    "newProject": "Nouveau Projet",
    "save": "Enregistrer",
    "publish": "Publier la Page",
    "unpublish": "Dépublier",
    "preview": "Aperçu Direct",
    "savedStatus": "Enregistré avec succès",
    "savingStatus": "Enregistrement...",
    "conflictStatus": "Conflit détecté"
  },
  "prospects": {
    "title": "Pipeline de Prospection",
    "addProspect": "Ajouter un Prospect",
    "searchMarket": "Explorer le Marché",
    "columns": {
      "new": "Nouveaux",
      "contacted": "Contactés",
      "proposal": "Proposition",
      "closed": "Conclus",
      "discarded": "Écartés"
    }
  },
  "usage": {
    "title": "Utilisation Mensuelle",
    "copyRemaining": "Générations de texte restantes",
    "searchRemaining": "Recherches marché restantes",
    "renewNotice": "Quotas réinitialisés au début de chaque mois UTC."
  }
};

export default messages;
