/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/begutachtungsinstrument/',
  plugins: [react()],
  // Pyodide lädt seine WASM-/Paket-Assets zur Laufzeit von einem CDN; der
  // Vite-Optimizer soll das Paket nicht vorbündeln.
  optimizeDeps: {
    exclude: ['pyodide'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
