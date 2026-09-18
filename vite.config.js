import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { germanPagesPlugin } from './scripts/german-pages.mjs';

export default defineConfig({
  base: '/rafs-german/',
  appType: 'spa',
  plugins: [react(), tailwindcss(), germanPagesPlugin()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8787'
    }
  }
});
