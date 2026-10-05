// Domain message dictionary for os (de)
import type { OsDictionary } from '../../types';

const messages: OsDictionary = {
  "shell": {
    "dashboard": "Dashboard",
    "projects": "Projekte",
    "prospects": "Akquise",
    "settings": "Einstellungen",
    "logout": "Abmelden"
  },
  "projects": {
    "title": "Ihre Projekte",
    "newProject": "Neues Projekt",
    "save": "Speichern",
    "publish": "Seite veröffentlichen",
    "unpublish": "Zurückziehen",
    "preview": "Live-Vorschau",
    "savedStatus": "Erfolgreich gespeichert",
    "savingStatus": "Wird gespeichert...",
    "conflictStatus": "Konflikt erkannt"
  },
  "prospects": {
    "title": "Akquise-Pipeline",
    "addProspect": "Lead hinzufügen",
    "searchMarket": "Markt durchsuchen",
    "columns": {
      "new": "Neu",
      "contacted": "Kontaktiert",
      "proposal": "Angebot",
      "closed": "Gewonnen",
      "discarded": "Verworfen"
    }
  },
  "usage": {
    "title": "Monatliche Nutzung",
    "copyRemaining": "Verbleibende Texterstellungen",
    "searchRemaining": "Verbleibende Marktsuchen",
    "renewNotice": "Limits erneuern sich zu Beginn jedes UTC-Monats."
  }
};

export default messages;
