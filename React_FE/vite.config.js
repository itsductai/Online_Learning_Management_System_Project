import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "postcss.config.js",
  },
  server: {
  host: true,
  allowedHosts: ['8226-123-28-250-163.ngrok-free.app'], 
  }
});
