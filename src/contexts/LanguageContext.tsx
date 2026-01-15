import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { Language, translations } from '../i18n/translations';

// Use the English translation type as the base structure (all languages have the same structure)
type TranslationType = typeof translations.en;

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
    const lang = (saved as Language) || 'en';
    // Validate that the saved language is valid
    if (lang === 'en' || lang === 'fr' || lang === 'ar') {
      return lang;
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    // Validate language before setting
    if (lang === 'en' || lang === 'fr' || lang === 'ar') {
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
