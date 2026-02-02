import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

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
        case '/privacy':
          return {
            title: t.privacy.title,
            description: 'Privacy Policy - How GLOBAL NEXUS SOLUTIONS LLC collects, uses, and protects your personal data. Compliant with Oman PDPL, GDPR, and international privacy laws.',
            keywords: 'privacy policy, data protection, personal data, GDPR, Oman'
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
    updateMetaTag('og:site_name', 'GLOBAL NEXUS SOLUTIONS LLC', 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:image:width', '1200', 'property');
    updateMetaTag('og:image:height', '630', 'property');
    updateMetaTag('og:image:alt', 'GLOBAL NEXUS SOLUTIONS LLC Logo', 'property');
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', ogImage);
    updateMetaTag('twitter:image:alt', 'GLOBAL NEXUS SOLUTIONS LLC Logo');
    
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
    updateMetaTag('geo.region', 'OM');
    updateMetaTag('geo.placename', 'Sultanate of Oman');
    
    // Mobile optimization
    updateMetaTag('format-detection', 'telephone=yes');
    
    // Author and copyright
    updateMetaTag('author', 'GLOBAL NEXUS SOLUTIONS LLC');
    updateMetaTag('copyright', 'GLOBAL NEXUS SOLUTIONS LLC');
    
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

