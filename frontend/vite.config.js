import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const codespaceHost =
  process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    ? `${process.env.CODESPACE_NAME}-5173.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : undefined;

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    hmr: {
      clientPort: parseInt(process.env.HMR_CLIENT_PORT || '443'),
      ...(codespaceHost && { host: codespaceHost }),
    },
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
});
