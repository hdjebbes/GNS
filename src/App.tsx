import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SEO } from './components/SEO';
import { useLanguage } from './contexts/LanguageContext';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load all page components
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Services = lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const Sectors = lazy(() => import('./pages/Sectors').then(module => ({ default: module.Sectors })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Legal = lazy(() => import('./pages/Legal').then(module => ({ default: module.Legal })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

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
          <Suspense fallback={<LoadingSpinner />}>
            <Routes key={`routes-${language}-${languageVersion}`}>
              <Route path="/" element={<Home key={`home-${language}-${languageVersion}`} />} />
              <Route path="/about" element={<About key={`about-${language}-${languageVersion}`} />} />
              <Route path="/services" element={<Services key={`services-${language}-${languageVersion}`} />} />
              <Route path="/sectors" element={<Sectors key={`sectors-${language}-${languageVersion}`} />} />
              <Route path="/contact" element={<Contact key={`contact-${language}-${languageVersion}`} />} />
              <Route path="/legal" element={<Legal key={`legal-${language}-${languageVersion}`} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
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
