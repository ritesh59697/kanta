import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

// The Midnight runtime ships WebAssembly; esnext keeps its top-level await.
export default defineConfig({
  plugins: [react(), wasm()],
  build: { target: 'esnext' },
  optimizeDeps: {
    exclude: ['@midnightntwrk/onchain-runtime-v4'],
    include: ['object-inspect'],
    esbuildOptions: { target: 'esnext' },
  },
});
