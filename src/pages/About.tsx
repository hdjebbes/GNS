import { useLanguage } from '../contexts/LanguageContext';
import { Target, Eye } from 'lucide-react';

export function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/20">
      {/* Header Section */}
      <header className="relative overflow-hidden divi-section bg-gradient-to-br from-blue-50/40 via-blue-50/30 to-blue-100/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(124,58,237,0.08),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="divi-heading bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-4">
            {t.about.title}
          </h1>
        </div>
      </header>

      <article className="relative overflow-hidden divi-section bg-gradient-to-br from-white via-blue-50/30 to-blue-50/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_60%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Company Description */}
            <div className="mb-16 md:mb-20 divi-card p-6 md:p-10">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-blue-900">Our Company</h2>
              </div>
              <p className="text-xl text-blue-800/80 leading-relaxed whitespace-pre-line">
                {t.about.description}
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8 mb-16 md:mb-20">
              <div className="divi-card p-6 md:p-10 bg-gradient-to-br from-blue-50/80 to-blue-50/80 border-blue-200/50">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-900">
                    {t.about.mission}
                  </h2>
                </div>
                <p className="text-lg text-blue-800/80 leading-relaxed">
                  {t.about.missionText}
                </p>
              </div>

              <div className="divi-card p-6 md:p-10 bg-gradient-to-br from-blue-50/80 to-blue-50/80 border-blue-200/50">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-900">
                    {t.about.vision}
                  </h2>
                </div>
                <p className="text-lg text-blue-800/80 leading-relaxed">
                  {t.about.visionText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
