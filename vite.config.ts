import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["a39eff2d-5114-4e8c-ae20-02850c22c62e.lovableproject.com"], // Add this line
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom", // Simulates a browser environment
    globals: true, // Enables global test functions like describe, it, and expect
    setupFiles: "./src/vitest.setup.ts", // Path to the setup file
  },
}));