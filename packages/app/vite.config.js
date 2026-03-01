// packages/app/vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:   "index.html",
        login:  "public/login.html",
        signup: "public/signup.html",
      },
    },
  },

  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
      "/auth": "http://localhost:3000",
    },
  },
});
