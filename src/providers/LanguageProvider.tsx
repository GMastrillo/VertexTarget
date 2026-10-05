"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getDict, type Dict, type Locale } from "@/lib/i18n";
import { normalizeLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { switchLocaleHref } from "@/lib/i18n/routing";
import type { DomainDictionaryMap } from "@/lib/i18n/types";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
  dictionaries?: Partial<DomainDictionaryMap>;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: getDict(DEFAULT_LOCALE),
});

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Convenience hook: returns the dictionary for the active locale */
export function useT(): Dict {
  return useContext(LanguageContext).t;
}

export interface LanguageProviderProps {
  initialLocale?: Locale;
  dictionaries?: Partial<DomainDictionaryMap>;
  children: ReactNode;
}

export default function LanguageProvider({
  initialLocale,
  dictionaries,
  children,
}: LanguageProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE);

  useEffect(() => {
    if (initialLocale) {
      setLocaleState(initialLocale);
      document.documentElement.lang = initialLocale;
      return;
    }
    const saved = window.localStorage.getItem("vt-locale");
    const normalized = normalizeLocale(saved);
    if (normalized) {
      setLocaleState(normalized);
      document.documentElement.lang = normalized;
    }
  }, [initialLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    window.localStorage.setItem("vt-locale", newLocale);
    document.cookie = `vt-locale=${newLocale}; Path=/; SameSite=Lax; max-age=31536000`;
    document.documentElement.lang = newLocale;

    const target = normalizeLocale(newLocale) ?? DEFAULT_LOCALE;
    if (pathname) {
      const switched = switchLocaleHref(pathname + window.location.search + window.location.hash, target);
      if (switched) {
        router.push(switched);
      }
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t: getDict(locale),
        dictionaries,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
