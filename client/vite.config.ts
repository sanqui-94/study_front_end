import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    resolve: {
        alias: {
        "@": path.resolve(__dirname, "../shared"),
        },
    },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  },
});
