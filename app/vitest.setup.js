import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { createElement } from "react";

// Démonte le DOM rendu après chaque test pour éviter les fuites entre tests.
afterEach(() => {
  cleanup();
});

// next/image n'est pas utilisable tel quel en environnement de test (jsdom).
// On le remplace par une simple balise <img> en retirant les props spécifiques à Next.
vi.mock("next/image", () => ({
  default: ({ src, alt, fill, priority, sizes, ...rest }) =>
    createElement("img", { src, alt, ...rest }),
}));
