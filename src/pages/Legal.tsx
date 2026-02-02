import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export function Legal() {
  const { t } = useLanguage();

  const items = [
    { label: t.legal.companyName, value: t.legal.companyNameValue },
    { label: t.legal.legalForm, value: t.legal.legalFormValue },
    { label: t.legal.country, value: t.legal.countryValue },
    { label: t.legal.crNumber, value: t.legal.crNumberValue }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/20">
      {/* Header Section */}
      <header className="relative overflow-hidden divi-section bg-gradient-to-br from-blue-50/40 via-blue-50/30 to-blue-100/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(124,58,237,0.08),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="divi-heading bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-4">
            {t.legal.title}
          </h1>
        </div>
      </header>

      <article className="relative overflow-hidden divi-section bg-gradient-to-br from-white via-blue-50/30 to-blue-50/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_60%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="divi-card p-6 md:p-10">
              <div className="space-y-8">
                {items.map((item, index) => (
                  <div key={index} className="border-b border-blue-200/50 pb-6 last:border-b-0 last:pb-0">
                    <p className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-xl text-blue-900 font-bold">
                      {item.value}
                    </p>
                  </div>
                ))}
                <div className="pt-6">
                  <Link
                    to="/privacy"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t.footer.privacyPolicy} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
