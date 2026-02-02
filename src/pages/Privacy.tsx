import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function Privacy() {
  const { t } = useLanguage();
  const p = t.privacy;

  const sections = [
    { key: 'controller' as const, id: 'controller' },
    { key: 'collected' as const, id: 'collected' },
    { key: 'purposes' as const, id: 'purposes' },
    { key: 'legalBasis' as const, id: 'legal-basis' },
    { key: 'retention' as const, id: 'retention' },
    { key: 'rights' as const, id: 'rights' },
    { key: 'cookies' as const, id: 'cookies' },
    { key: 'transfers' as const, id: 'transfers' },
    { key: 'security' as const, id: 'security' },
    { key: 'contact' as const, id: 'contact' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/20">
      <header className="relative overflow-hidden divi-section bg-gradient-to-br from-blue-50/40 via-blue-50/30 to-blue-100/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(124,58,237,0.08),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-14 h-14 text-blue-600" />
          </div>
          <h1 className="divi-heading bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-4">
            {p.title}
          </h1>
          <p className="divi-subheading text-blue-600">
            {p.lastUpdated}
          </p>
        </div>
      </header>

      <article className="relative overflow-hidden divi-section bg-gradient-to-br from-white via-blue-50/30 to-blue-50/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_60%)]"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="divi-card p-6 md:p-10 space-y-10">
            <p className="text-blue-800 leading-relaxed">
              {p.intro}
            </p>

            {sections.map(({ key, id }) => (
              <section key={key} id={id} className="border-b border-blue-200/50 pb-8 last:border-b-0 last:pb-0">
                <h2 className="text-lg font-bold text-blue-900 mb-4">
                  {p[key].title}
                </h2>
                <p className="text-blue-800 leading-relaxed">
                  {p[key].content}
                </p>
              </section>
            ))}

            <div className="pt-6">
              <Link
                to="/contact"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                {t.footer.dataRights} →
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
