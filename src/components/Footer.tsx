import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from './Logo';
import { COMPANY } from '../constants';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-white mt-auto relative overflow-hidden border-t border-blue-900/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(37,99,235,0.1),transparent_50%)]"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-12 mb-12">
          <div>
            <Logo size="lg" showText={true} className="mb-6" />
            <p className="text-blue-200 leading-relaxed">
              {t.home.subtitle}
            </p>
            <p className="text-blue-300 text-sm mt-4">
              Professional services company based in the {COMPANY.country}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-400" />
              {t.contact.email}
            </h4>
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-blue-200 hover:text-white transition-colors hover:underline"
            >
              {COMPANY.email}
            </a>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-400" />
              {t.contact.phone}
            </h4>
            <a
              href={`tel:${COMPANY.phone}`}
              className="text-blue-200 hover:text-white transition-colors hover:underline"
            >
              {COMPANY.phoneDisplay}
            </a>
            <div className="mt-6">
              <h4 className="text-lg font-bold mb-2 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                {t.contact.location}
              </h4>
              <p className="text-blue-200">{t.contact.locationValue}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800/50 pt-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <Link
                to="/privacy"
                className="text-blue-300 hover:text-white transition-colors"
              >
                {t.footer.privacyPolicy}
              </Link>
              <a
                href={`mailto:${COMPANY.email}?subject=Data%20Privacy%20Request`}
                className="text-blue-300 hover:text-white transition-colors"
              >
                {t.footer.dataRights}
              </a>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-blue-300 text-sm">
                &copy; {currentYear} {COMPANY.name}. All rights reserved.
              </p>
              <p className="text-blue-400 text-sm">
                CR Number: {t.legal.crNumberValue}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
