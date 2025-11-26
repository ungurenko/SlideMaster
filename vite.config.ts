import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // Explicitly allowing env variables if needed, though default usually works for VITE_ prefix
  envPrefix: 'VITE_',
});