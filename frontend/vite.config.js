import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // host: true is required for GitHub Codespaces / cloud dev environments so
    // the dev server listens on all interfaces and can be reached via the tunnel.
    // On a trusted local network this is safe; restrict to 'localhost' if needed.
    host: true,
    port: 5173,
    hmr: {
      // GitHub Codespaces (and similar tunnels) forward traffic on port 443.
      // VITE_HMR_CLIENT_PORT can override this for other environments.
      clientPort: parseInt(process.env.VITE_HMR_CLIENT_PORT || '443', 10),
    },
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
});
