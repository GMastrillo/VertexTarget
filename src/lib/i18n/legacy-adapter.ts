import { normalizeLocale, DEFAULT_LOCALE, type Locale } from './locales.ts';
import ptCommon from './messages/pt-BR/common.ts';
import ptMarketing from './messages/pt-BR/marketing.ts';
import ptPlatform from './messages/pt-BR/platform.ts';
import ptAuth from './messages/pt-BR/auth.ts';
import ptOs from './messages/pt-BR/os.ts';
import ptAdmin from './messages/pt-BR/admin.ts';
import ptLegal from './messages/pt-BR/legal.ts';
import ptCases from './messages/pt-BR/cases.ts';

import enCommon from './messages/en/common.ts';
import enMarketing from './messages/en/marketing.ts';
import enPlatform from './messages/en/platform.ts';
import enAuth from './messages/en/auth.ts';
import enOs from './messages/en/os.ts';
import enAdmin from './messages/en/admin.ts';
import enLegal from './messages/en/legal.ts';
import enCases from './messages/en/cases.ts';

import esCommon from './messages/es/common.ts';
import esMarketing from './messages/es/marketing.ts';
import esPlatform from './messages/es/platform.ts';
import esAuth from './messages/es/auth.ts';
import esOs from './messages/es/os.ts';
import esAdmin from './messages/es/admin.ts';
import esLegal from './messages/es/legal.ts';
import esCases from './messages/es/cases.ts';

import frCommon from './messages/fr/common.ts';
import frMarketing from './messages/fr/marketing.ts';
import frPlatform from './messages/fr/platform.ts';
import frAuth from './messages/fr/auth.ts';
import frOs from './messages/fr/os.ts';
import frAdmin from './messages/fr/admin.ts';
import frLegal from './messages/fr/legal.ts';
import frCases from './messages/fr/cases.ts';

import deCommon from './messages/de/common.ts';
import deMarketing from './messages/de/marketing.ts';
import dePlatform from './messages/de/platform.ts';
import deAuth from './messages/de/auth.ts';
import deOs from './messages/de/os.ts';
import deAdmin from './messages/de/admin.ts';
import deLegal from './messages/de/legal.ts';
import deCases from './messages/de/cases.ts';

import itCommon from './messages/it/common.ts';
import itMarketing from './messages/it/marketing.ts';
import itPlatform from './messages/it/platform.ts';
import itAuth from './messages/it/auth.ts';
import itOs from './messages/it/os.ts';
import itAdmin from './messages/it/admin.ts';
import itLegal from './messages/it/legal.ts';
import itCases from './messages/it/cases.ts';

const bundledDictionaries = {
  'pt-BR': { common: ptCommon, marketing: ptMarketing, platform: ptPlatform, auth: ptAuth, os: ptOs, admin: ptAdmin, legal: ptLegal, cases: ptCases },
  en: { common: enCommon, marketing: enMarketing, platform: enPlatform, auth: enAuth, os: enOs, admin: enAdmin, legal: enLegal, cases: enCases },
  es: { common: esCommon, marketing: esMarketing, platform: esPlatform, auth: esAuth, os: esOs, admin: esAdmin, legal: esLegal, cases: esCases },
  fr: { common: frCommon, marketing: frMarketing, platform: frPlatform, auth: frAuth, os: frOs, admin: frAdmin, legal: frLegal, cases: frCases },
  de: { common: deCommon, marketing: deMarketing, platform: dePlatform, auth: deAuth, os: deOs, admin: deAdmin, legal: deLegal, cases: deCases },
  it: { common: itCommon, marketing: itMarketing, platform: itPlatform, auth: itAuth, os: itOs, admin: itAdmin, legal: itLegal, cases: itCases },
};

export function getBundledDictionary(localeInput: unknown) {
  const loc: Locale = normalizeLocale(localeInput) ?? DEFAULT_LOCALE;
  return bundledDictionaries[loc] ?? bundledDictionaries[DEFAULT_LOCALE];
}
