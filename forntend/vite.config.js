import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// vite.config.js
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // adjust based on your folder structure
    },
  },
  server: {
    port: 5173, // Fix the port to 5173
    proxy: {
      '/api': {
        target: 'http://localhost:4000/',
        secure: false,
      },
    },
  },
  assetsInclude: ['**/*.mp3'], // Explicitly include MP3 files
});
