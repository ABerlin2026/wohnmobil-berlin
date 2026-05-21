import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { de } from "./de";
import { en } from "./en";

export type Language = "de" | "en";

type Translations = typeof de;

const translations: Record<Language, Translations> = { de, en };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Default to German (Zielmarkt). Crawler wie Googlebot senden meist
    // Accept-Language: en-US — würden sonst die englische Variante
    // indexieren und englische Snippets in den SERPs zeigen.
    const saved = typeof localStorage !== "undefined"
      ? (localStorage.getItem("lang") as Language | null)
      : null;
    if (saved && translations[saved]) return saved;
    return "de";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
