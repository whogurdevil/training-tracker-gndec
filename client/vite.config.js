import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy options
      '/assets': {
        target: 'http://127.0.0.1:5500/', // Your server URL
        changeOrigin: true,
        secure: false, // if you're using HTTPS, set it to true
        headers: {
          'Access-Control-Allow-Origin': '*', // or specific origin
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
        }
      }
    }
  }
});
