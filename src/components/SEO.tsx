import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export function SEO({ title, description, keywords }: SEOProps) {
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
            keywords: 'business solutions, consulting, technology, logistics, Oman'
          };
        case '/about':
          return {
            title: t.about.title,
            description: t.about.description.split('\n')[0],
            keywords: 'about us, company, mission, vision, Oman business'
          };
        case '/services':
          return {
            title: t.services.title,
            description: 'Professional services including IT, consulting, administrative, and logistics support.',
            keywords: 'services, IT support, consulting, administrative services, logistics'
          };
        case '/sectors':
          return {
            title: t.sectors.title,
            description: 'Serving various business sectors including technology, manufacturing, trade, and professional services.',
            keywords: 'business sectors, industries, technology, manufacturing, trade'
          };
        case '/contact':
          return {
            title: t.contact.title,
            description: 'Get in touch with GLOBAL NEXUS SOLUTIONS LLC. Contact us for business inquiries and support.',
            keywords: 'contact, email, phone, business inquiry, Oman'
          };
        case '/legal':
          return {
            title: t.legal.title,
            description: 'Legal information about GLOBAL NEXUS SOLUTIONS LLC, including company registration details.',
            keywords: 'legal information, company registration, commercial registration, Oman'
          };
        default:
          return {
            title: 'GLOBAL NEXUS SOLUTIONS LLC',
            description: 'Professional services company based in the Sultanate of Oman.',
            keywords: 'business solutions, Oman, consulting, technology'
          };
      }
    };

    const pageContent = getPageContent();
    const finalTitle = title || `${pageContent.title} | GLOBAL NEXUS SOLUTIONS LLC`;
    const finalDescription = description || pageContent.description;
    const finalKeywords = keywords || pageContent.keywords;

    // Update document title
    document.title = finalTitle;

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
    updateMetaTag('og:url', window.location.href, 'property');
    updateMetaTag('og:site_name', 'GLOBAL NEXUS SOLUTIONS LLC', 'property');
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    
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
    canonical.setAttribute('href', window.location.href);

  }, [location.pathname, language, title, description, keywords, t]);

  return null;
}

