import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  // Le projet écrit du JSX dans des fichiers .js. Par défaut le transformeur oxc
  // de Vite 8 exclut les .js et les parse en JS pur (le JSX est alors rejeté).
  // On élargit le filtre aux .js et on force le langage JSX.
  oxc: {
    include: /\.(jsx?|tsx?)$/,
    exclude: /node_modules/,
    lang: "jsx",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.js",
  },
  resolve: {
    alias: {
      // Reproduit l'alias "@/..." de jsconfig.json pour les imports dans les tests.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
