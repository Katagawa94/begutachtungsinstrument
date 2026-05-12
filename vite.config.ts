/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/begutachtungsinstrument/',
  plugins: [react()],
  // Pyodide und WebLLM laden ihre WASM-/Modell-Assets zur Laufzeit (CDN bzw.
  // HuggingFace); der Vite-Optimizer soll diese Pakete nicht vorbündeln.
  optimizeDeps: {
    exclude: ['pyodide', '@mlc-ai/web-llm'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
