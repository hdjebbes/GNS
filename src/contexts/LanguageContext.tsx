import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { Language, translations } from '../i18n/translations';

// Use the English translation type as the base structure (all languages have the same structure)
type TranslationType = typeof translations.en;

const SUPPORTED_LANGUAGES: Language[] = ['en', 'fr', 'ar'];

/** Country codes that map to French. */
const FRENCH_COUNTRY_CODES = new Set(['FR', 'BE', 'CH', 'LU', 'MC', 'RE', 'GP', 'MQ', 'GF', 'YT']);
/** Country codes that map to Arabic. */
const ARABIC_COUNTRY_CODES = new Set([
  'OM', 'SA', 'AE', 'QA', 'KW', 'BH', 'YE', 'IQ', 'SY', 'JO', 'LB', 'PS', 'EG', 'LY', 'TN', 'DZ', 'MA', 'MR', 'SD', 'SO', 'DJ', 'KM'
]);

/** Maps country code from IP geolocation to a supported app language. Falls back to "en" if not mapped. */
function getLanguageFromCountryCode(countryCode: string): Language {
  const code = countryCode?.toUpperCase() || '';
  if (FRENCH_COUNTRY_CODES.has(code)) return 'fr';
  if (ARABIC_COUNTRY_CODES.has(code)) return 'ar';
  return 'en';
}

// Public API (can be blocked by ad blockers / ERR_BLOCKED_BY_CLIENT). Prefer same-origin proxy via VITE_GEO_PROXY_URL.
const IP_GEO_API_FALLBACK = 'https://api.country.is/';
const FETCH_TIMEOUT_MS = 5000;

function getGeoApiUrl(): string {
  const proxy = import.meta.env.VITE_GEO_PROXY_URL?.trim();
  return proxy || IP_GEO_API_FALLBACK;
}

/** AbortController + setTimeout for browsers that don't support AbortSignal.timeout(). */
function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, {
    signal: controller.signal,
    mode: 'cors',
  }).finally(() => clearTimeout(timeoutId));
}

/** Fetches user's country code from connection IP and returns the matching language, or "en" on error. */
async function fetchLanguageFromIp(): Promise<Language> {
  const url = getGeoApiUrl();
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return 'en';
    const data = await res.json();
    const code = (data?.country ?? data?.country_code ?? data?.countryCode ?? '').toUpperCase();
    return getLanguageFromCountryCode(code);
  } catch {
    return 'en';
  }
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
    return 'en';
  });

  // When no saved language, detect from connection IP and set language (fallback stays en)
  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) return;
    let cancelled = false;
    fetchLanguageFromIp().then((lang) => {
      if (!cancelled) {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
      }
    });
    return () => { cancelled = true; };
  }, []);

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
