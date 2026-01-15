import { useLanguage } from '../contexts/LanguageContext';
import { Monitor, Users, FileText, Truck, Globe } from 'lucide-react';

export function Sectors() {
  const { t } = useLanguage();

  const icons = [Monitor, Users, FileText, Truck, Globe];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/20">
      {/* Header Section */}
      <section className="relative overflow-hidden divi-section bg-gradient-to-br from-blue-50/40 via-blue-50/30 to-blue-100/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(124,58,237,0.08),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="divi-heading bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-4">
            {t.sectors.title}
          </h1>
          <p className="divi-subheading text-blue-700 max-w-2xl mx-auto">
            Serving diverse industries with tailored solutions
          </p>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="relative overflow-hidden divi-section bg-gradient-to-br from-white via-blue-50/30 to-blue-50/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_60%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.sectors.list.map((sector, index) => {
              const Icon = icons[index % icons.length];
              return (
                <div
                  key={index}
                  className="divi-card p-8 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4 group-hover:text-blue-700 transition-colors">
                    {sector.name}
                  </h2>
                  <p className="text-blue-800/80 leading-relaxed">
                    {sector.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
