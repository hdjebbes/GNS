import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { COMPANY } from '../constants';

interface SchemaObject {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

export function StructuredData() {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const baseUrl = window.location.origin;

    // Organization Schema
    const organizationSchema: SchemaObject = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: COMPANY.name,
      alternateName: [COMPANY.shortName, ...(COMPANY.alternateNames || [])],
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: COMPANY.baseDescription,
      address: {
        '@type': 'PostalAddress',
        addressCountry: COMPANY.countryCode,
        addressLocality: COMPANY.country
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: COMPANY.phoneSchema,
        contactType: 'customer service',
        email: COMPANY.email,
        areaServed: COMPANY.countryCode,
        availableLanguage: ['en', 'fr', 'ar']
      },
      sameAs: [],
      foundingDate: COMPANY.foundingDate,
      legalName: COMPANY.name,
      taxID: COMPANY.crNumber
    };

    // LocalBusiness Schema (for contact page) - targets "proposition service trading Oman"
    const localBusinessSchema: SchemaObject = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: COMPANY.name,
      alternateName: ['Global Solution Oman', 'Oman Solution', 'GNS'],
      description: 'Proposition de services trading, consulting IT et solutions professionnelles au Sultanat d\'Oman.',
      image: `${baseUrl}/logo.png`,
      url: baseUrl,
      telephone: COMPANY.phoneSchema,
      email: COMPANY.email,
      address: {
        '@type': 'PostalAddress',
        addressCountry: COMPANY.countryCode,
        addressLocality: COMPANY.country
      },
      geo: {
        '@type': 'GeoCoordinates',
        addressCountry: COMPANY.countryCode
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
      currenciesAccepted: COMPANY.currency,
      paymentAccepted: 'Cash, Credit Card, Bank Transfer'
    };

    // Website Schema
    const websiteSchema: SchemaObject = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: `${COMPANY.name} - Global Solution Oman`,
      alternateName: 'GNS Oman - Services Trading & Solutions',
      url: baseUrl,
      description: `Global Solution Oman - Proposition de services trading, consulting IT, logistique et solutions professionnelles au Sultanat d'Oman.`,
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
    const getBreadcrumbSchema = (): SchemaObject => {
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
    const getPageSpecificSchema = (): SchemaObject[] => {
      const schemas: SchemaObject[] = [];

      if (location.pathname === '/') {
        // Home page - Service schema targeting "global solution", "oman solution", "services trading Oman"
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Global Solution Oman - Professional Services & Trading',
          serviceType: 'Professional Services, Trading Support, Business Consulting',
          description: 'Proposition de services trading, consulting IT, logistique et solutions professionnelles au Sultanat d\'Oman. Global solution for businesses in Oman.',
          provider: {
            '@type': 'Organization',
            name: COMPANY.name
          },
          areaServed: {
            '@type': 'Country',
            name: 'Oman'
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Business Services - Global Solution Oman',
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
              },
              {
                '@type': 'OfferCatalog',
                name: 'Trading Services Oman',
                itemListElement: {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Trading Services & Import Export Oman'
                  }
                }
              }
            ]
          }
        });
      }

      if (location.pathname === '/services') {
        // Services page - reinforce trading & Oman solution keywords
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Proposition de Services Trading Oman - Global Solution',
          serviceType: 'Trading Services, IT Consulting, Logistics, Import Export',
          description: 'Services trading, consulting IT, logistique et import-export au Sultanat d\'Oman. Global solution pour entreprises.',
          provider: { '@type': 'Organization', name: COMPANY.name },
          areaServed: { '@type': 'Country', name: 'Oman' }
        });
      }

      return schemas;
    };

    // Remove existing structured data scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Add all schemas
    const schemas: SchemaObject[] = [
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
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => script.remove());
    };
  }, [location.pathname, language]);

  return null;
}
