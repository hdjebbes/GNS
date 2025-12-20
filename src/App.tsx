import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Sectors } from './pages/Sectors';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotFound } from './pages/NotFound';
import { SEO } from './components/SEO';
import { useLanguage } from './contexts/LanguageContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const { language, languageVersion } = useLanguage();

  return (
    <>
      <SEO />
      <ScrollToTop />
      <div className="min-h-screen flex flex-col relative" key={`app-${language}-${languageVersion}`}>
        <Navigation key={`nav-${language}-${languageVersion}`} />
        <main className="flex-grow relative z-10" key={`main-${language}-${languageVersion}`}>
          {/* Use languageVersion to force complete re-render when language changes */}
          <Routes key={`routes-${language}-${languageVersion}`}>
            <Route path="/" element={<Home key={`home-${language}-${languageVersion}`} />} />
            <Route path="/about" element={<About key={`about-${language}-${languageVersion}`} />} />
            <Route path="/services" element={<Services key={`services-${language}-${languageVersion}`} />} />
            <Route path="/sectors" element={<Sectors key={`sectors-${language}-${languageVersion}`} />} />
            <Route path="/contact" element={<Contact key={`contact-${language}-${languageVersion}`} />} />
            <Route path="/legal" element={<Legal key={`legal-${language}-${languageVersion}`} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer key={`footer-${language}-${languageVersion}`} />
      </div>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
