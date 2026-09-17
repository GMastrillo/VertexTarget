"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getDict, type Dict, type Locale } from "@/lib/i18n";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "pt",
  setLocale: () => {},
  t: getDict("pt"),
});

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Convenience hook: returns the dictionary for the active locale */
export function useT(): Dict {
  return useContext(LanguageContext).t;
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    const saved = window.localStorage.getItem("vt-locale") as Locale | null;
    if (saved && ["pt", "en", "es", "fr", "it"].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem("vt-locale", l);
    document.documentElement.lang = l === "pt" ? "pt-BR" : l;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: getDict(locale) }}>
      {children}
    </LanguageContext.Provider>
  );
}
