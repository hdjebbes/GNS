import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext';

const rootEl = document.getElementById('root')!;
createRoot(rootEl).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);

// Reveal body after first paint to avoid flash of unstyled content
requestAnimationFrame(() => {
  requestAnimationFrame(() => document.documentElement.classList.add('loaded'));
});
