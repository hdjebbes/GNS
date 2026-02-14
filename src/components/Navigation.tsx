import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Home, Info, Briefcase, Building2, Mail, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';
import { Logo } from './Logo';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { language, setLanguage, t, isRTL } = useLanguage();
  const location = useLocation();
  const desktopLangMenuRef = useRef<HTMLDivElement>(null);
  const mobileLangMenuRef = useRef<HTMLDivElement>(null);

  const pages = useMemo(() => [
    { path: '/', label: t.nav.home, icon: Home },
    { path: '/about', label: t.nav.about, icon: Info },
    { path: '/services', label: t.nav.services, icon: Briefcase },
    { path: '/sectors', label: t.nav.sectors, icon: Building2 },
    { path: '/contact', label: t.nav.contact, icon: Mail },
    { path: '/legal', label: t.nav.legal, icon: FileText }
  ], [t]);

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' }
  ];

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    setLangMenuOpen(false);
  }, [setLanguage]);

  // Close language menu on click outside
  useEffect(() => {
    if (!langMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        desktopLangMenuRef.current && !desktopLangMenuRef.current.contains(target) &&
        mobileLangMenuRef.current && !mobileLangMenuRef.current.contains(target)
      ) {
        setLangMenuOpen(false);
      }
      // Handle case where only one ref is mounted
      if (!desktopLangMenuRef.current && mobileLangMenuRef.current && !mobileLangMenuRef.current.contains(target)) {
        setLangMenuOpen(false);
      }
      if (desktopLangMenuRef.current && !desktopLangMenuRef.current.contains(target) && !mobileLangMenuRef.current) {
        setLangMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langMenuOpen]);

  // Close language menu on Escape key
  useEffect(() => {
    if (!langMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLangMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [langMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const languageDropdown = (
    <div
      role="menu"
      aria-label="Language selection"
      className="absolute right-0 mt-2 w-48 bg-[#1e3a5f] rounded-xl shadow-2xl py-2 border border-blue-700/50 z-50"
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          role="menuitem"
          onClick={() => handleLanguageChange(lang.code)}
          className={`block w-full text-left px-4 py-3 text-sm hover:bg-blue-700/30 transition-all duration-300 ${
            language === lang.code ? 'bg-blue-600/40 font-semibold text-white' : 'text-blue-100'
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="bg-[#0f172a] shadow-lg sticky top-0 z-50 border-b border-blue-900/30">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md">
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Logo size="md" showText={true} />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {pages.map((page) => {
              const Icon = page.icon;
              const isActive = location.pathname === page.path;
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-blue-600/40 shadow-md'
                      : 'text-blue-100 hover:text-white hover:bg-blue-800/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{page.label}</span>
                </Link>
              );
            })}

            <div className="relative ml-4" ref={desktopLangMenuRef}>
              <button
                type="button"
                aria-expanded={langMenuOpen}
                aria-haspopup="true"
                aria-label="Select language"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-800/30 transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
                <span>{language.toUpperCase()}</span>
              </button>

              {langMenuOpen && languageDropdown}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <div className="relative" ref={mobileLangMenuRef}>
              <button
                type="button"
                aria-expanded={langMenuOpen}
                aria-haspopup="true"
                aria-label="Select language"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 rounded-lg text-blue-100 hover:bg-blue-800/30 transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
              </button>

              {langMenuOpen && (
                <div
                  role="menu"
                  aria-label="Language selection"
                  className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-[#1e3a5f] rounded-xl shadow-2xl py-2 border border-blue-700/50 z-50`}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      role="menuitem"
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`block w-full text-left px-4 py-3 text-sm hover:bg-blue-700/30 transition-all duration-300 ${
                        language === lang.code ? 'bg-blue-600/40 font-semibold text-white' : 'text-blue-100'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="p-2 rounded-lg text-blue-100 hover:bg-blue-800/30 transition-all duration-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-blue-900/30 bg-[#0f172a]">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {pages.map((page) => {
              const Icon = page.icon;
              const isActive = location.pathname === page.path;
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-blue-600/40'
                      : 'text-blue-100 hover:text-white hover:bg-blue-800/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{page.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
