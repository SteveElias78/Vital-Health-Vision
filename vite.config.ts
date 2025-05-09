import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // Use jsdom for DOM simulation
    globals: true, // Enable global test functions like describe, it, and expect
    setupFiles: "./vitest.setup.ts", // Path to the setup file
  },
});