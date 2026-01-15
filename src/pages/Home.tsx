import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, Sparkles, Globe2, TrendingUp, Shield } from 'lucide-react';
import { Logo } from '../components/Logo';

export function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const serviceIcons = [Sparkles, Globe2, TrendingUp, Shield];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/20 via-white to-blue-50/10">
      {/* Hero Section - Style Divi */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50/40 via-blue-50/30 to-blue-100/20 divi-section">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,transparent_0%,rgba(59,130,246,0.05)_50%,transparent_100%)]"></div>
        {/* Grid pattern removed */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo as decorative element */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Logo size="lg" showText={false} className="opacity-30 drop-shadow-2xl scale-[2.0]" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 bg-gradient-to-br from-blue-400/30 to-blue-500/30 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center justify-center mb-8 px-4 py-2 bg-blue-100/60 backdrop-blur-sm rounded-full border border-blue-200/40">
              <span className="text-sm font-medium text-blue-800">Professional Services • Sultanate of Oman</span>
            </div>
            <h1 className="divi-heading bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
              {t.home.title}
            </h1>
            <p className="divi-subheading mb-12 text-blue-700">
              {t.home.subtitle}
            </p>
            <div className="max-w-2xl mx-auto mb-12">
              <p className="text-xl text-blue-800/80 leading-relaxed whitespace-pre-line">
                {t.home.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/contact')}
                className="group inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>{t.nav.contact}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/services')}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg text-blue-700 bg-white border-2 border-blue-300 hover:border-blue-400 transition-all duration-300 hover:shadow-lg"
              >
                {t.nav.services}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Style Divi */}
      <section className="relative overflow-hidden divi-section bg-gradient-to-br from-white via-blue-50/30 to-blue-50/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_60%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent mb-4">
              {t.home.servicesTitle}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {t.home.services.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              return (
                <div
                  key={index}
                  className="divi-card p-8 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors">
                        {service}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Style Divi */}
      <section className="divi-section bg-gradient-to-br from-[#0f172a] via-blue-900 to-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.1),transparent_50%)]"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl lg:text-5xl font-bold mb-6">{t.home.ctaTitle}</h3>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">{t.home.ctaText}</p>
          <button
            onClick={() => navigate('/contact')}
            className="group inline-flex items-center space-x-3 bg-white text-blue-900 px-10 py-5 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
          >
            <span>{t.nav.contact}</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
