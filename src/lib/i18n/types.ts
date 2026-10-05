export const SUPPORTED_LOCALES = [
  'pt-BR',
  'en',
  'es',
  'fr',
  'de',
  'it',
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export type DictionaryDomain =
  | 'common'
  | 'marketing'
  | 'platform'
  | 'auth'
  | 'os'
  | 'admin'
  | 'legal'
  | 'cases';

export interface CommonDictionary {
  brand: string;
  tagline: string;
  theme: {
    toggle: string;
    light: string;
    dark: string;
  };
  language: {
    select: string;
    ptBR: string;
    en: string;
    es: string;
    fr: string;
    de: string;
    it: string;
  };
  actions: {
    back: string;
    cancel: string;
    confirm: string;
    save: string;
    close: string;
    loading: string;
    openMenu: string;
    closeMenu: string;
  };
  errors: {
    generic: string;
    notFound: string;
    network: string;
    unauthorized: string;
    rateLimited: string;
  };
}

export interface MarketingDictionary {
  nav: {
    home: string;
    platform: string;
    services: string;
    cases: string;
    about: string;
    aiLab: string;
    contact: string;
    login: string;
    start: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
  };
  ecosystem: {
    badge: string;
    title: string;
    subtitle: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    submit: string;
    success: string;
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
  };
}

export interface PlatformDictionary {
  nav: {
    overview: string;
    templates: string;
    pricing: string;
    faq: string;
    startFree: string;
    enter: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    secondaryCta: string;
  };
  features: {
    title: string;
    subtitle: string;
  };
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    freeTitle: string;
    freePrice: string;
    freeDesc: string;
    freeCta: string;
    customTitle: string;
    customPrice: string;
    customDesc: string;
    customCta: string;
  };
  faq: {
    title: string;
  };
}

export interface AuthDictionary {
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    submit: string;
    noAccount: string;
    signupLink: string;
    forgotPassword: string;
  };
  signup: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    termsAgreement: string;
    submit: string;
    hasAccount: string;
    loginLink: string;
  };
  recovery: {
    title: string;
    subtitle: string;
    emailLabel: string;
    submit: string;
    backToLogin: string;
  };
  reset: {
    title: string;
    subtitle: string;
    newPasswordLabel: string;
    submit: string;
  };
}

export interface OsDictionary {
  shell: {
    dashboard: string;
    projects: string;
    prospects: string;
    settings: string;
    logout: string;
  };
  projects: {
    title: string;
    newProject: string;
    save: string;
    publish: string;
    unpublish: string;
    preview: string;
    savedStatus: string;
    savingStatus: string;
    conflictStatus: string;
  };
  prospects: {
    title: string;
    addProspect: string;
    searchMarket: string;
    columns: {
      new: string;
      contacted: string;
      proposal: string;
      closed: string;
      discarded: string;
    };
  };
  usage: {
    title: string;
    copyRemaining: string;
    searchRemaining: string;
    renewNotice: string;
  };
}

export interface AdminDictionary {
  shell: {
    overview: string;
    commercial: string;
    crm: string;
    interests: string;
    prospecting: string;
    performance: string;
    financial: string;
    inbox: string;
    whatsapp: string;
    settings: string;
  };
  interests: {
    title: string;
    empty: string;
    statusNew: string;
  };
}

export interface LegalDictionary {
  privacy: {
    title: string;
    updatedAt: string;
    intro: string;
  };
  terms: {
    title: string;
    updatedAt: string;
    intro: string;
  };
}

export interface CasesDictionary {
  badge: string;
  title: string;
  subtitle: string;
  filterAllCategories: string;
  filterAllTech: string;
  filterAllYears: string;
  viewStudy: string;
  backToCases: string;
}

export interface DomainDictionaryMap {
  common: CommonDictionary;
  marketing: MarketingDictionary;
  platform: PlatformDictionary;
  auth: AuthDictionary;
  os: OsDictionary;
  admin: AdminDictionary;
  legal: LegalDictionary;
  cases: CasesDictionary;
}
