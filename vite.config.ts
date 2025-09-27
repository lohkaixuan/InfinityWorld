import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001', // Make sure this matches your backend port
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
