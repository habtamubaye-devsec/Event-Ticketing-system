import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Proxy target must be an origin (no trailing /api). Always include protocol.
  const backendUrl =
    env.VITE_BACKEND_URL ||
    env.VITE_API_URL ||
    env.BACKEND_URL ||
    "http://localhost:5001";

  return {
    plugins: [tailwindcss(), react()],
    server: {
      proxy: {
        "/api": backendUrl,
      },
    },
  };
});
