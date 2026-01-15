import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Source maps uniquement en développement (pour éviter des 404 inutiles en prod)
  build: {
    sourcemap: mode === 'development',
  },
}));
