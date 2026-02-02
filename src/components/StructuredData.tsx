import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export function StructuredData() {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const baseUrl = window.location.origin;

    // Organization Schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'GLOBAL NEXUS SOLUTIONS LLC',
      alternateName: 'GNS',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: 'Professional services company based in the Sultanate of Oman, providing integrated solutions across consulting, technology, logistics, and administrative services.',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'OM',
        addressLocality: 'Sultanate of Oman'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+968-79924362',
        contactType: 'customer service',
        email: 'omanigns@gmail.com',
        areaServed: 'OM',
        availableLanguage: ['en', 'fr', 'ar']
      },
      sameAs: [],
      foundingDate: '2024',
      legalName: 'GLOBAL NEXUS SOLUTIONS LLC',
      taxID: '1594268'
    };

    // LocalBusiness Schema (for contact page)
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'GLOBAL NEXUS SOLUTIONS LLC',
      image: `${baseUrl}/logo.png`,
      url: baseUrl,
      telephone: '+968-79924362',
      email: 'omanigns@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'OM',
        addressLocality: 'Sultanate of Oman'
      },
      geo: {
        '@type': 'GeoCoordinates',
        addressCountry: 'OM'
      },
      areaServed: {
        '@type': 'Country',
        name: 'Oman'
      },
      serviceArea: {
        '@type': 'Country',
        name: 'Oman'
      },
      priceRange: '$$',
      currenciesAccepted: 'OMR',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer'
    };

    // Website Schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'GLOBAL NEXUS SOLUTIONS LLC',
      url: baseUrl,
      description: 'Professional services company based in the Sultanate of Oman',
      inLanguage: language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'ar-OM',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };

    // Breadcrumb Schema
    const getBreadcrumbSchema = () => {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const items = [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl
        }
      ];

      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const names: Record<string, Record<string, string>> = {
          en: {
            about: 'About Us',
            services: 'Services',
            sectors: 'Business Sectors',
            contact: 'Contact Us',
            legal: 'Legal Information',
            privacy: 'Privacy Policy'
          },
          fr: {
            about: 'À propos',
            services: 'Services',
            sectors: 'Secteurs d\'activité',
            contact: 'Nous contacter',
            legal: 'Informations légales',
            privacy: 'Politique de confidentialité'
          },
          ar: {
            about: 'من نحن',
            services: 'الخدمات',
            sectors: 'قطاعات الأعمال',
            contact: 'اتصل بنا',
            legal: 'المعلومات القانونية',
            privacy: 'سياسة الخصوصية'
          }
        };

        items.push({
          '@type': 'ListItem',
          position: index + 2,
          name: names[language]?.[segment] || segment,
          item: `${baseUrl}${currentPath}`
        });
      });

      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items
      };
    };

    // Page-specific schemas
    const getPageSpecificSchema = () => {
      const schemas: any[] = [];

      if (location.pathname === '/') {
        // Home page - Service schema
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Professional Services',
          provider: {
            '@type': 'Organization',
            name: 'GLOBAL NEXUS SOLUTIONS LLC'
          },
          areaServed: {
            '@type': 'Country',
            name: 'Oman'
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Business Services',
            itemListElement: [
              {
                '@type': 'OfferCatalog',
                name: 'Information & Communication Technology',
                itemListElement: {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Information & Communication Technology'
                  }
                }
              },
              {
                '@type': 'OfferCatalog',
                name: 'Professional Consulting',
                itemListElement: {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Professional Consulting'
                  }
                }
              },
              {
                '@type': 'OfferCatalog',
                name: 'Administrative Services',
                itemListElement: {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Administrative Services'
                  }
                }
              },
              {
                '@type': 'OfferCatalog',
                name: 'Logistics & Trade Support',
                itemListElement: {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Logistics & Trade Support'
                  }
                }
              }
            ]
          }
        });
      }

      return schemas;
    };

    // Remove existing structured data scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Add all schemas
    const schemas = [
      organizationSchema,
      websiteSchema,
      getBreadcrumbSchema(),
      ...getPageSpecificSchema()
    ];

    if (location.pathname === '/contact') {
      schemas.push(localBusinessSchema);
    }

    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      // Cleanup function
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => script.remove());
    };
  }, [location.pathname, language]);

  return null;
}
