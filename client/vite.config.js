import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy options
      '/training-tracker/assets': {
        target: 'http://127.0.0.1:5500/',
        changeOrigin: true,
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*', // or specific origin
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
        }
      }
    }
  }
});
