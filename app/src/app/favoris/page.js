"use client";

import PropertyCard from "@/components/PropertyCard";
import { useFavorites } from "@/context/FavoritesContext";
import styles from "./page.module.css";

export default function FavorisPage() {
  const { favorites, hydrated } = useFavorites();

  return (
    <main className={styles.main}>
      <header className={styles.intro}>
        <h1 className={styles.title}>Vos favoris</h1>
        <p className={styles.subtitle}>
          Retrouvez ici tous les logements que vous avez aimés.
          <br />
          Prêts à réserver ? Un simple clic et votre prochain séjour est en
          route.
        </p>
      </header>

      {/* Rendu déterministe : la grille est toujours montée (elle se remplit
          quand le localStorage est lu). Le message "vide" n'apparaît qu'une
          fois l'hydratation faite, pour ne pas flasher s'il y a des favoris. */}
      {hydrated && favorites.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            Vous n&apos;avez pas de logement en favoris.
          </p>
        </div>
      )}

      <ul className={styles.grid}>
        {favorites.map((property) => (
          <li key={property.id}>
            <PropertyCard property={property} />
          </li>
        ))}
      </ul>
    </main>
  );
}
