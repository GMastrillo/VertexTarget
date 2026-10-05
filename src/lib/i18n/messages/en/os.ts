// Domain message dictionary for os (en)
import type { OsDictionary } from '../../types';

const messages: OsDictionary = {
  "shell": {
    "dashboard": "Dashboard",
    "projects": "Projects",
    "prospects": "Prospects",
    "settings": "Settings",
    "logout": "Sign Out"
  },
  "projects": {
    "title": "Your Projects",
    "newProject": "New Project",
    "save": "Save Changes",
    "publish": "Publish Page",
    "unpublish": "Unpublish",
    "preview": "Live Preview",
    "savedStatus": "Saved successfully",
    "savingStatus": "Saving...",
    "conflictStatus": "Conflict detected"
  },
  "prospects": {
    "title": "Prospecting Pipeline",
    "addProspect": "Add Lead",
    "searchMarket": "Search Market",
    "columns": {
      "new": "New",
      "contacted": "Contacted",
      "proposal": "Proposal",
      "closed": "Closed",
      "discarded": "Discarded"
    }
  },
  "usage": {
    "title": "Monthly Usage",
    "copyRemaining": "Copy generations remaining",
    "searchRemaining": "Market searches remaining",
    "renewNotice": "Quotas renew at the beginning of each UTC month."
  }
};

export default messages;
