import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [react(), tailwindcss(), nodePolyfills()],
  server: {
    hmr: {
      overlay: false, // 👈 disables the full-screen error overlay
    },
  },
});