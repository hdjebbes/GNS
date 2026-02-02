import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SEO } from './components/SEO';
import { StructuredData } from './components/StructuredData';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load all page components with error handling
const Home = lazy(() => 
  import('./pages/Home').then(module => ({ default: module.Home }))
);
const About = lazy(() => 
  import('./pages/About').then(module => ({ default: module.About }))
);
const Services = lazy(() => 
  import('./pages/Services').then(module => ({ default: module.Services }))
);
const Sectors = lazy(() => 
  import('./pages/Sectors').then(module => ({ default: module.Sectors }))
);
const Contact = lazy(() => 
  import('./pages/Contact').then(module => ({ default: module.Contact }))
);
const Legal = lazy(() => 
  import('./pages/Legal').then(module => ({ default: module.Legal }))
);
const Privacy = lazy(() => 
  import('./pages/Privacy').then(module => ({ default: module.Privacy }))
);
const NotFound = lazy(() => 
  import('./pages/NotFound').then(module => ({ default: module.NotFound }))
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  return (
    <>
      <SEO />
      <StructuredData />
      <ScrollToTop />
      <div className="min-h-screen flex flex-col relative">
        <Navigation />
        <main className="flex-grow relative z-10">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/sectors" element={<Sectors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
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
