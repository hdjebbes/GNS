import { useState, useEffect, useRef } from 'react';
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
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Recreate pages array on every render to ensure it updates
  // This is more aggressive but ensures updates happen
  const pages = [
    { path: '/', label: t.nav.home, icon: Home },
    { path: '/about', label: t.nav.about, icon: Info },
    { path: '/services', label: t.nav.services, icon: Briefcase },
    { path: '/sectors', label: t.nav.sectors, icon: Building2 },
    { path: '/contact', label: t.nav.contact, icon: Mail },
    { path: '/legal', label: t.nav.legal, icon: FileText }
  ];

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' }
  ];

  const handleLanguageChange = (e: React.MouseEvent<HTMLButtonElement>, lang: Language) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 Navigation: Language change requested:', lang);
    
    // Close menu first to prevent click outside handler from interfering
    setLangMenuOpen(false);
    
    // Use setTimeout to ensure state update happens after menu closes
    setTimeout(() => {
      setLanguage(lang);
      console.log('✅ Language set to:', lang);
    }, 0);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check if click is inside the language menu or on a language button
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        // Also check if the click is on a language button (they might be outside the ref)
        const isLanguageButton = (target as Element).closest('button[data-language-button]');
        if (!isLanguageButton) {
          setLangMenuOpen(false);
        }
      }
    };

    if (langMenuOpen) {
      // Use a longer delay to ensure language change is processed first
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 200);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [langMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-[#0f172a] shadow-lg sticky top-0 z-50 border-b border-blue-900/30">
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

            <div className="relative ml-4" ref={langMenuRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLangMenuOpen(!langMenuOpen);
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-800/30 transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
                <span>{language.toUpperCase()}</span>
              </button>

              {langMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-[#1e3a5f] rounded-xl shadow-2xl py-2 border border-blue-700/50 z-50"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      data-language-button="true"
                      onClick={(e) => handleLanguageChange(e, lang.code)}
                      onMouseDown={(e) => {
                        // Prevent the click outside handler from firing
                        e.stopPropagation();
                      }}
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
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLangMenuOpen(!langMenuOpen);
                }}
                className="p-2 rounded-lg text-blue-100 hover:bg-blue-800/30 transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
              </button>

              {langMenuOpen && (
                <div 
                  className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-[#1e3a5f] rounded-xl shadow-2xl py-2 border border-blue-700/50 z-50`}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      data-language-button="true"
                      onClick={(e) => handleLanguageChange(e, lang.code)}
                      onMouseDown={(e) => {
                        // Prevent the click outside handler from firing
                        e.stopPropagation();
                      }}
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

