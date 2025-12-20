import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { Language, translations } from '../i18n/translations';

// Use the English translation type as the base structure (all languages have the same structure)
type TranslationType = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationType;
  isRTL: boolean;
  languageVersion: number; // Force re-render counter
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

  // Use a version counter that increments on every language change
  const [languageVersion, setLanguageVersion] = useState(0);
  const versionRef = useRef(0);

  const setLanguage = useCallback((lang: Language) => {
    // Validate language before setting
    if (lang === 'en' || lang === 'fr' || lang === 'ar') {
      console.log('🔄 Changing language to:', lang);
      setLanguageState(lang);
      localStorage.setItem('language', lang);
      // Increment version to force all components to re-render
      versionRef.current += 1;
      const newVersion = versionRef.current;
      console.log('📊 New language version:', newVersion);
      setLanguageVersion(newVersion);
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('languageChanged'));
      // Force a small delay to ensure state updates propagate
      setTimeout(() => {
        console.log('✅ Language change complete');
      }, 0);
    } else {
      console.warn(`Invalid language code: ${lang}. Falling back to 'en'.`);
      setLanguageState('en');
      localStorage.setItem('language', 'en');
      versionRef.current += 1;
      setLanguageVersion(versionRef.current);
      window.dispatchEvent(new Event('languageChanged'));
    }
  }, []);

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  // Get translations for current language - Force new object every time
  // Use a function that returns a new object reference on every call
  const getTranslations = (): TranslationType => {
    switch (language) {
      case 'fr':
        return { ...translations.fr } as TranslationType;
      case 'ar':
        return { ...translations.ar } as TranslationType;
      case 'en':
      default:
        return { ...translations.en } as TranslationType;
    }
  };
  
  // Call the function directly (no memoization) to get fresh object every render
  const currentTranslations = getTranslations();

  // Create context value - NEVER use useMemo, always create new object
  // This ensures React always sees a new reference
  const contextValue = {
    language,
    setLanguage,
    t: currentTranslations,
    isRTL,
    languageVersion
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      <div key={`lang-wrapper-${language}-${languageVersion}`}>
        {children}
      </div>
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
