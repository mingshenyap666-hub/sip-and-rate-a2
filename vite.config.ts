import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
const codespaceHost =
  process.env.CODESPACE_NAME &&
  process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    ? `${process.env.CODESPACE_NAME}-5173.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : null;
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["terminal.local", ...(codespaceHost ? [codespaceHost] : [])],
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: process.env.API_TARGET || "http://127.0.0.1:8080",
        changeOrigin: true,
      },
    },
  },
});
