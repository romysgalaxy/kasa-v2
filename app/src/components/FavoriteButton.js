"use client";

import { useFavorites } from "@/context/FavoritesContext";
import styles from "./FavoriteButton.module.css";

export default function FavoriteButton({ property }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(property.id);

  return (
    <button
      type="button"
      className={`${styles.button} ${active ? styles.active : ""}`}
      aria-pressed={active}
      aria-label={
        active
          ? `Retirer ${property.title} des favoris`
          : `Ajouter ${property.title} aux favoris`
      }
      onClick={() => toggleFavorite(property)}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
