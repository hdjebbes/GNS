import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { COMPANY } from '../constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export function SEO({ title, description, keywords, image }: SEOProps) {
  const location = useLocation();
  const { language, t } = useLanguage();

  useEffect(() => {
    // Get page-specific content
    const getPageContent = () => {
      const path = location.pathname;

      switch (path) {
        case '/':
          return {
            title: t.home.title,
            description: t.home.description.split('\n')[0],
            keywords: 'global solution, oman solution, services trading Oman, proposition service trading Oman, business solutions Oman, consulting Oman, IT solutions Oman, logistics Oman, import export Oman, professional services Oman, GNS'
          };
        case '/about':
          return {
            title: t.about.title,
            description: t.about.description.split('\n')[0],
            keywords: 'global solution Oman, oman solution, about GNS, mission vision, Oman business, professional services Oman'
          };
        case '/services':
          return {
            title: t.services.title,
            description: 'Proposition de services trading Oman : IT, consulting, logistique, import-export. Global solution pour entreprises au Sultanat d\'Oman.',
            keywords: 'services trading Oman, proposition service Oman, IT consulting Oman, logistics Oman, import export Oman, administrative services, global solution'
          };
        case '/sectors':
          return {
            title: t.sectors.title,
            description: 'Secteurs d\'activité : technologie, manufacturing, trading, commerce international. Solutions pour entreprises au Sultanat d\'Oman.',
            keywords: 'business sectors Oman, trading Oman, technology Oman, manufacturing Oman, import export, oman solution'
          };
        case '/contact':
          return {
            title: t.contact.title,
            description: `Contactez GNS - Global Solution Oman. Proposition de services trading, consulting et solutions professionnelles au Sultanat d'Oman.`,
            keywords: 'contact GNS, contact Oman solution, proposition service trading Oman, devis Oman, business inquiry Oman'
          };
        case '/legal':
          return {
            title: t.legal.title,
            description: `Legal information about ${COMPANY.name}, including company registration details.`,
            keywords: 'legal information, company registration, commercial registration, Oman'
          };
        case '/privacy':
          return {
            title: t.privacy.title,
            description: `Privacy Policy - How ${COMPANY.name} collects, uses, and protects your personal data. Compliant with Oman PDPL, GDPR, and international privacy laws.`,
            keywords: 'privacy policy, data protection, personal data, GDPR, Oman'
          };
        default:
          return {
            title: COMPANY.name,
            description: `Global Solution Oman - Services trading, consulting IT et solutions professionnelles au Sultanat d'Oman.`,
            keywords: 'global solution, oman solution, services trading Oman, consulting Oman, GNS'
          };
      }
    };

    const pageContent = getPageContent();
    const finalTitle = title || `${pageContent.title} | ${COMPANY.name}`;
    const finalDescription = description || pageContent.description;
    const finalKeywords = keywords || pageContent.keywords;
    const baseUrl = window.location.origin;
    const currentUrl = window.location.href;
    const ogImage = image || `${baseUrl}/logo.png`;

    // Update document title
    document.title = finalTitle;

    // Update HTML lang attribute
    const htmlLangMap: Record<string, string> = {
      en: 'en',
      fr: 'fr',
      ar: 'ar'
    };
    document.documentElement.lang = htmlLangMap[language] || 'en';

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords);

    // Open Graph tags
    updateMetaTag('og:title', finalTitle, 'property');
    updateMetaTag('og:description', finalDescription, 'property');
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:site_name', COMPANY.name, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:image:width', '1200', 'property');
    updateMetaTag('og:image:height', '630', 'property');
    updateMetaTag('og:image:alt', `${COMPANY.name} Logo`, 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', ogImage);
    updateMetaTag('twitter:image:alt', `${COMPANY.name} Logo`);

    // Language and locale
    updateMetaTag('language', language);
    const localeMap: Record<string, string> = {
      en: 'en_US',
      fr: 'fr_FR',
      ar: 'ar_OM'
    };
    updateMetaTag('og:locale', localeMap[language] || 'en_US', 'property');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Additional SEO meta tags
    updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('theme-color', '#2563eb');
    updateMetaTag('color-scheme', 'light');

    // Geo tags
    updateMetaTag('geo.region', COMPANY.countryCode);
    updateMetaTag('geo.placename', COMPANY.country);

    // Mobile optimization
    updateMetaTag('format-detection', 'telephone=yes');

    // Author and copyright
    updateMetaTag('author', COMPANY.name);
    updateMetaTag('copyright', COMPANY.name);

    // Language alternates (hreflang)
    const updateHreflangTag = (lang: string, href: string) => {
      let element = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'alternate');
        element.setAttribute('hreflang', lang);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    updateHreflangTag('en', `${baseUrl}${location.pathname}`);
    updateHreflangTag('fr', `${baseUrl}${location.pathname}`);
    updateHreflangTag('ar', `${baseUrl}${location.pathname}`);
    updateHreflangTag('x-default', `${baseUrl}${location.pathname}`);

  }, [location.pathname, language, title, description, keywords, image, t]);

  return null;
}
