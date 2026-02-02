import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { Language, translations } from '../i18n/translations';

// Use the English translation type as the base structure (all languages have the same structure)
type TranslationType = typeof translations.en;

const SUPPORTED_LANGUAGES: Language[] = ['en', 'fr', 'ar'];

/** Maps browser locale (e.g. "fr-FR", "ar-OM") to a supported app language. Falls back to "en" if not supported. */
function getLanguageFromLocale(): Language {
  if (typeof navigator === 'undefined') return 'en';
  const locale =
    navigator.language ||
    (navigator.languages && navigator.languages[0]) ||
    '';
  const code = locale.split(/[-_]/)[0]?.toLowerCase() || 'en';
  if (SUPPORTED_LANGUAGES.includes(code as Language)) {
    return code as Language;
  }
  return 'en';
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationType;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) {
      return saved as Language;
    }
    return getLanguageFromLocale();
  });

  const setLanguage = useCallback((lang: Language) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
    } else {
      console.warn(`Invalid language code: ${lang}. Falling back to 'en'.`);
      setLanguageState('en');
      localStorage.setItem('language', 'en');
    }
  }, []);

  const isRTL = useMemo(() => language === 'ar', [language]);

  // Memoize translations to avoid recreating object on every render
  const currentTranslations = useMemo((): TranslationType => {
    switch (language) {
      case 'fr':
        return translations.fr as TranslationType;
      case 'ar':
        return translations.ar as TranslationType;
      case 'en':
      default:
        return translations.en as TranslationType;
    }
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<LanguageContextType>(() => ({
    language,
    setLanguage,
    t: currentTranslations,
    isRTL
  }), [language, setLanguage, currentTranslations, isRTL]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
