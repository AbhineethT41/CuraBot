import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      // Proxy API requests during development
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    build: {
      // Generate assets with relative paths for production
      // This ensures assets work when served by the backend
      assetsDir: 'assets',
      outDir: 'dist',
      emptyOutDir: true,
    },
  };
});
