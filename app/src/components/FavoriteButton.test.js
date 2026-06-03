import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoritesProvider } from "@/context/FavoritesContext";
import FavoriteButton from "./FavoriteButton";

const PROPERTY = { id: "abc", title: "Studio cosy", cover: "/a.jpg" };
const STORAGE_KEY = "kasa:favorites";

// On rend le bouton dans le Provider : on teste donc le bouton ET le contexte
// ensemble (le bouton n'a de sens qu'à l'intérieur du Provider).
function renderButton(property = PROPERTY) {
  return render(
    <FavoritesProvider>
      <FavoriteButton property={property} />
    </FavoritesProvider>
  );
}

// localStorage est partagé entre les tests : on le vide avant chacun.
beforeEach(() => {
  localStorage.clear();
});

describe("Système favoris (bouton ♥ + Context + localStorage)", () => {
  it("n'est pas en favori au départ", () => {
    // ARRANGE + ACT : on rend le bouton
    renderButton();
    // ASSERT : le bouton n'est pas "pressé"
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("ajoute aux favoris au clic (cœur actif)", async () => {
    // ARRANGE
    const user = userEvent.setup();
    renderButton();
    // ACT : clic sur le cœur
    await user.click(screen.getByRole("button"));
    // ASSERT : le bouton est maintenant actif
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("retire des favoris au second clic", async () => {
    // ARRANGE
    const user = userEvent.setup();
    renderButton();
    const btn = screen.getByRole("button");
    // ACT : on ajoute puis on retire
    await user.click(btn);
    await user.click(btn);
    // ASSERT : retour à l'état non favori
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("met à jour le libellé accessible quand on ajoute", async () => {
    // ARRANGE
    const user = userEvent.setup();
    renderButton();
    // ACT
    await user.click(screen.getByRole("button"));
    // ASSERT : le label passe de "Ajouter..." à "Retirer..."
    expect(screen.getByRole("button")).toHaveAccessibleName(
      /retirer studio cosy des favoris/i
    );
  });

  it("enregistre le favori dans le localStorage", async () => {
    // ARRANGE
    const user = userEvent.setup();
    renderButton();
    // ACT
    await user.click(screen.getByRole("button"));
    // ASSERT : le logement est persisté
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toEqual([PROPERTY]);
  });

  it("retire le favori du localStorage au second clic", async () => {
    // ARRANGE
    const user = userEvent.setup();
    renderButton();
    const btn = screen.getByRole("button");
    // ACT
    await user.click(btn);
    await user.click(btn);
    // ASSERT : le localStorage est revenu à une liste vide
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([]);
  });

  it("relit les favoris du localStorage au montage (persistance de session)", async () => {
    // ARRANGE : on simule une session précédente où le logement était favori
    localStorage.setItem(STORAGE_KEY, JSON.stringify([PROPERTY]));
    // ACT : on (re)monte le composant
    renderButton();
    // ASSERT : le bouton apparaît déjà actif
    expect(
      await screen.findByRole("button", { pressed: true })
    ).toBeInTheDocument();
  });
});
