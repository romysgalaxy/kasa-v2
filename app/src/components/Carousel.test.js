import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Carousel from "./Carousel";

const IMAGES = ["/a.jpg", "/b.jpg", "/c.jpg"];
const TITLE = "Appartement cosy";

function setup(props = {}) {
  const onClose = vi.fn();
  render(
    <Carousel images={IMAGES} title={TITLE} onClose={onClose} {...props} />
  );
  return { onClose };
}

describe("Carousel (lightbox)", () => {
  it("affiche l'image et le compteur sur initialIndex", () => {
    // 1. ARRANGE : on rend le carrousel ouvert sur la 2e image (index 1)
    setup({ initialIndex: 1 });

    // (pas d'ACT ici : on vérifie juste l'état initial)

    // 3. ASSERT : la bonne image et le bon compteur s'affichent
    expect(screen.getByRole("img")).toHaveAttribute("src", "/b.jpg");
    expect(screen.getByText("2/3")).toBeInTheDocument();
  });

  it("passe à l'image suivante au clic sur la flèche droite", async () => {
    // 1. ARRANGE : carrousel ouvert sur la 1re image
    const user = userEvent.setup();
    setup({ initialIndex: 0 });

    // 2. ACT : clic sur la flèche suivante
    await user.click(screen.getByRole("button", { name: /photo suivante/i }));

    // 3. ASSERT : on est passé à la 2e image
    expect(screen.getByRole("img")).toHaveAttribute("src", "/b.jpg");
    expect(screen.getByText("2/3")).toBeInTheDocument();
  });

  it("revient à l'image précédente au clic sur la flèche gauche", async () => {
    // 1. ARRANGE : carrousel ouvert sur la 2e image
    const user = userEvent.setup();
    setup({ initialIndex: 1 });

    // 2. ACT : clic sur la flèche précédente
    await user.click(screen.getByRole("button", { name: /photo précédente/i }));

    // 3. ASSERT : on est revenu à la 1re image
    expect(screen.getByRole("img")).toHaveAttribute("src", "/a.jpg");
    expect(screen.getByText("1/3")).toBeInTheDocument();
  });

  it("boucle de la dernière à la première image (suivant)", async () => {
    // 1. ARRANGE : carrousel ouvert sur la dernière image
    const user = userEvent.setup();
    setup({ initialIndex: 2 });

    // 2. ACT : clic sur suivant depuis la dernière image
    await user.click(screen.getByRole("button", { name: /photo suivante/i }));

    // 3. ASSERT : on revient au début (bouclage)
    expect(screen.getByRole("img")).toHaveAttribute("src", "/a.jpg");
    expect(screen.getByText("1/3")).toBeInTheDocument();
  });

  it("boucle de la première à la dernière image (précédent)", async () => {
    // 1. ARRANGE : carrousel ouvert sur la 1re image
    const user = userEvent.setup();
    setup({ initialIndex: 0 });

    // 2. ACT : clic sur précédent depuis la 1re image
    await user.click(screen.getByRole("button", { name: /photo précédente/i }));

    // 3. ASSERT : on va à la fin (bouclage)
    expect(screen.getByRole("img")).toHaveAttribute("src", "/c.jpg");
    expect(screen.getByText("3/3")).toBeInTheDocument();
  });

  it("navigue au clavier avec les flèches ← / →", async () => {
    // 1. ARRANGE : carrousel ouvert sur la 1re image
    const user = userEvent.setup();
    setup({ initialIndex: 0 });

    // 2. ACT : flèche droite → 3. ASSERT : image suivante
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("img")).toHaveAttribute("src", "/b.jpg");

    // 2. ACT : flèche gauche → 3. ASSERT : retour à l'image précédente
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("img")).toHaveAttribute("src", "/a.jpg");
  });

  it("ferme la galerie avec la touche Échap", async () => {
    // 1. ARRANGE : on récupère l'espion onClose
    const user = userEvent.setup();
    const { onClose } = setup();

    // 2. ACT : appui sur Échap
    await user.keyboard("{Escape}");

    // 3. ASSERT : la fermeture a été déclenchée
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ferme la galerie au clic sur le bouton de fermeture", async () => {
    // 1. ARRANGE : on récupère l'espion onClose
    const user = userEvent.setup();
    const { onClose } = setup();

    // 2. ACT : clic sur le bouton fermer
    await user.click(screen.getByRole("button", { name: /fermer la galerie/i }));

    // 3. ASSERT : la fermeture a été déclenchée une seule fois
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ferme au clic sur le fond mais pas sur l'image", async () => {
    // 1. ARRANGE : on récupère l'espion onClose
    const user = userEvent.setup();
    const { onClose } = setup();

    // 2. ACT + 3. ASSERT : clic sur l'image → ne ferme pas
    await user.click(screen.getByRole("img"));
    expect(onClose).not.toHaveBeenCalled();

    // 2. ACT + 3. ASSERT : clic sur le fond (le conteneur dialog) → ferme
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("masque flèches et compteur quand il n'y a qu'une seule image", () => {
    // 1. ARRANGE : on rend le carrousel avec une seule image
    render(<Carousel images={["/seule.jpg"]} title={TITLE} onClose={vi.fn()} />);

    // (pas d'ACT : on vérifie le rendu conditionnel)

    // 3. ASSERT : ni flèches ni compteur ne sont présents
    expect(
      screen.queryByRole("button", { name: /photo suivante/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /photo précédente/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText("1/1")).not.toBeInTheDocument();
  });
});
